/**
 * D20Background — an interactive, rollable d20 die rendered to a full-screen
 * canvas, intended to sit BEHIND page content.
 *
 * Framework-agnostic. Requires Three.js (r150+) available as `THREE`.
 *   - npm:  import * as THREE from 'three';  then pass it in, OR set window.THREE
 *   - cdn:  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
 *
 * Behavior:
 *   - Real 20-face icosahedron. Numbers 1-20, opposite faces sum to 21 (true d20).
 *   - Idle: very slow tumble ("mostly still, but alive").
 *   - Cursor: the die slides away from the pointer and springs back home.
 *   - Roll: call .roll() (or click anywhere not flagged data-no-roll) — it tumbles
 *     and settles face-up on a random 1-20 facing the viewer.
 *
 * Usage:
 *   const d20 = new D20Background({ canvas, THREE });  // THREE optional if window.THREE
 *   d20.start();
 *   // ... later
 *   d20.roll();            // programmatic roll
 *   d20.destroy();         // cleanup (removes listeners, disposes GL)
 *
 * The constructor does NOT attach a global click handler by default. Opt in with
 * `attachClickToRoll: true` to make clicking the page (outside [data-no-roll]) roll.
 */
class D20Background {
  constructor(opts = {}) {
    this.THREE = opts.THREE || window.THREE;
    if (!this.THREE) throw new Error('D20Background: THREE.js is required');
    this.canvas = opts.canvas;
    if (!this.canvas) throw new Error('D20Background: a canvas element is required');

    // --- Tunables -----------------------------------------------------------
    this.R = opts.radius ?? 2.2;                 // die circumradius (world units)
    this.coverage = opts.coverage ?? 0.33;       // die radius as fraction of half-viewport-height
    this.coverageMobile = opts.coverageMobile ?? 0.28;
    this.faceColor = opts.faceColor ?? 0x0d0d13; // die body color
    this.trimColor = opts.trimColor ?? 0xe6c172; // gold edge lines
    this.numberColor = opts.numberColor ?? '#efcd7e';
    this.numberFont = opts.numberFont ?? '700 76px Cinzel, Georgia, serif';
    this.repelRadius = opts.repelRadius ?? this.R * 2.4; // cursor influence radius (world)
    this.maxPush = opts.maxPush ?? this.R * 0.26;        // max position offset from cursor
    this.idleSpin = opts.idleSpin ?? 0.16;       // idle angular speed (rad/s)
    this.attachClickToRoll = opts.attachClickToRoll ?? false;
    this.noRollSelector = opts.noRollSelector ?? '[data-no-roll]'; // clicks inside these never roll

    this._raf = 0;
    this._inited = false;
  }

  // ------------------------------------------------------------------------
  start() {
    if (this._inited) return;
    const ready = () => this._init();
    if (document.fonts && document.fonts.ready) {
      // Wait for the number font so the baked textures are crisp (cap at 1.2s).
      Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(ready);
    } else { ready(); }
  }

  _labelTexture(num) {
    const THREE = this.THREE;
    const s = 128;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const x = c.getContext('2d');
    x.clearRect(0, 0, s, s);
    x.fillStyle = this.numberColor;
    x.font = this.numberFont;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.shadowColor = 'rgba(255,210,120,0.55)';
    x.shadowBlur = 8;
    x.fillText(String(num), s / 2, s / 2 - 2);
    if (num === 6 || num === 9) {          // underline so 6/9 are unambiguous
      x.shadowBlur = 0;
      x.fillRect(s / 2 - 22, s / 2 + 34, 44, 5);
    }
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }

  _init() {
    const THREE = this.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // cap DPR for mobile perf
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.scene = scene;
    this.camera = camera;

    scene.add(new THREE.AmbientLight(0x37301c, 0.7));
    const key = new THREE.DirectionalLight(0xfff1d4, 1.15); key.position.set(3, 4, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffce6a, 0.6); rim.position.set(-5, -2, 1); scene.add(rim);

    const R = this.R;
    const group = new THREE.Group();
    scene.add(group);
    this.group = group;

    const baseGeo = new THREE.IcosahedronGeometry(R, 0);
    const bodyGeo = baseGeo.toNonIndexed();
    const bodyMat = new THREE.MeshStandardMaterial({ color: this.faceColor, metalness: 0.4, roughness: 0.5, flatShading: true });
    group.add(new THREE.Mesh(bodyGeo, bodyMat));

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseGeo),
      new THREE.LineBasicMaterial({ color: this.trimColor, transparent: true, opacity: 0.92 })
    );
    group.add(edges);

    // Per-face centroid + outward normal (object space).
    const pos = bodyGeo.attributes.position;
    const faces = [];
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const centroid = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
      const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
      faces.push({ centroid, normal });
    }
    this.faces = faces;

    // Number assignment so OPPOSITE faces sum to 21 (authentic d20).
    const numbers = new Array(faces.length).fill(0);
    const used = new Array(faces.length).fill(false);
    let n = 1;
    for (let i = 0; i < faces.length; i++) {
      if (used[i]) continue;
      let opp = -1, min = 2;
      for (let j = 0; j < faces.length; j++) {
        if (j === i || used[j]) continue;
        const d = faces[i].normal.dot(faces[j].normal); // most antiparallel = opposite face
        if (d < min) { min = d; opp = j; }
      }
      numbers[i] = n; used[i] = true;
      if (opp >= 0) { numbers[opp] = 21 - n; used[opp] = true; }
      n++;
    }

    // Number labels: a small textured plane sitting just above each face.
    const ps = R * 0.64;
    for (let i = 0; i < faces.length; i++) {
      const mat = new THREE.MeshBasicMaterial({ map: this._labelTexture(numbers[i]), transparent: true, depthWrite: false });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(ps, ps), mat);
      plane.position.copy(faces[i].centroid).addScaledVector(faces[i].normal, R * 0.012);
      plane.lookAt(new THREE.Vector3().addVectors(plane.position, faces[i].normal));
      group.add(plane);
    }

    // Interaction / animation state
    this.mode = 'idle';                                   // 'idle' | 'tumble' | 'settle'
    this.angVel = new THREE.Vector3();
    this.idleAxis = new THREE.Vector3(0.4, 1, 0.25).normalize();
    this.qTarget = new THREE.Quaternion();
    this.pointerWorld = null;
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0 plane for cursor projection
    this._ndc = new THREE.Vector2();

    this._onResize = () => this._resize();
    this._onMove = (e) => this._onPointerMove(e);
    this._onDown = (e) => this._onPointerDown(e);
    this._onVis = () => { if (!document.hidden) this._loop(); };
    window.addEventListener('resize', this._onResize);
    window.addEventListener('pointermove', this._onMove);
    if (this.attachClickToRoll) window.addEventListener('pointerdown', this._onDown);
    document.addEventListener('visibilitychange', this._onVis);

    this._inited = true;
    this._resize();
    this._last = performance.now();
    this._loop();
  }

  _resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const cam = this.camera;
    cam.aspect = w / h;
    const vfov = cam.fov * Math.PI / 180;
    const coverage = w < 720 ? this.coverageMobile : this.coverage;
    let dist = this.R / (Math.tan(vfov / 2) * coverage);
    if (cam.aspect < 1) dist /= cam.aspect;   // portrait: pull camera back so die fits
    cam.position.set(0, 0, dist);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }

  _onPointerMove(e) {
    const THREE = this.THREE;
    this._ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(this._ndc, this.camera);
    const p = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.plane, p)) this.pointerWorld = p;
  }

  _onPointerDown(e) {
    if (e.target && e.target.closest && e.target.closest(this.noRollSelector)) return;
    this.roll();
  }

  /** Programmatically roll: tumble, then settle on a random face toward the viewer. */
  roll() {
    if (!this._inited) return;
    const THREE = this.THREE;
    const rnd = () => (Math.random() * 2 - 1);
    this.angVel.set(rnd() * 9 + (rnd() > 0 ? 4 : -4), rnd() * 9 + (rnd() > 0 ? 4 : -4), rnd() * 7);
    const idx = Math.floor(Math.random() * this.faces.length);
    // Rotate so this face's normal points at the camera (+Z) — its number faces the viewer.
    this.qTarget.setFromUnitVectors(this.faces[idx].normal.clone(), new THREE.Vector3(0, 0, 1));
    this.mode = 'tumble';
  }

  _loop() {
    cancelAnimationFrame(this._raf);
    if (document.hidden) return;                  // pause when tab hidden
    this._raf = requestAnimationFrame(() => this._loop());
    const THREE = this.THREE;
    const now = performance.now();
    let dt = (now - this._last) / 1000;
    this._last = now;
    if (dt > 0.05) dt = 0.05;                     // clamp big gaps (tab refocus)
    const g = this.group;

    if (this.mode === 'tumble') {
      const e = new THREE.Euler(this.angVel.x * dt, this.angVel.y * dt, this.angVel.z * dt);
      g.quaternion.premultiply(new THREE.Quaternion().setFromEuler(e));
      this.angVel.multiplyScalar(Math.pow(0.12, dt)); // frame-rate-independent exponential damping
      if (this.angVel.length() < 1.4) this.mode = 'settle';
    } else if (this.mode === 'settle') {
      g.quaternion.slerp(this.qTarget, 1 - Math.pow(0.0006, dt));
      if (g.quaternion.angleTo(this.qTarget) < 0.015) this.mode = 'idle';
    } else {
      g.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(this.idleAxis, this.idleSpin * dt));
    }

    // Cursor repel + spring back to home (0,0,0).
    const off = new THREE.Vector3();
    if (this.pointerWorld) {
      const toDie = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), this.pointerWorld);
      const d = toDie.length();
      if (d < this.repelRadius) off.copy(toDie).setLength((1 - d / this.repelRadius) * this.maxPush);
    }
    g.position.lerp(off, 1 - Math.pow(0.0001, dt));

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerdown', this._onDown);
    document.removeEventListener('visibilitychange', this._onVis);
    if (this.renderer) this.renderer.dispose();
    this._inited = false;
  }
}

// Export for both module and global usage.
if (typeof module !== 'undefined' && module.exports) module.exports = { D20Background };
if (typeof window !== 'undefined') window.D20Background = D20Background;
