# Handoff: Game Intro — 4-Panel Comic Prologue

## Overview
This is the **intro / prologue screen** for a web game. It presents the game's opening
narration as a 2×2 grid of "comic panels." Each panel pairs a small animated illustration
(rendered entirely in CSS/SVG — no raster art) with a block of lore text, in a dark,
candle-lit, gold-on-black fantasy aesthetic. A single **Awaken** button below the grid
starts the game.

The narrative arc across the four panels:
- **I — The Dark:** the player is a bodiless will/mind in the void.
- **II — Sensation:** a tremor from the world above; a glowing crack opens in the stone.
- **III — The Apparition:** a faceless ghost phases in (the dungeon stirring to awareness).
- **IV — Intent:** a pickaxe floats and stirs on its own, animated by the mind's will.

## About the Design Files
The file in this bundle (`Intro.dc.html`) is a **design reference created in HTML** — a
working prototype that demonstrates the intended layout, visuals, animation, and behavior.
It is **not production code to copy directly**. It is authored as a "Design Component"
(a custom streaming-HTML format), so its markup uses a `<x-dc>` wrapper and inline-style
conventions that are specific to that authoring tool.

**Your task:** recreate this design in the game's existing codebase using its established
patterns (React/Vue/Svelte/Canvas/whatever the project uses). Everything here is plain DOM
+ CSS + inline SVG, so it ports cleanly to any framework. If no frontend environment exists
yet, pick the most appropriate one for the project and implement there. Pull the exact
values from the **Design Tokens** and **Screens** sections below; use the HTML file only as
a visual cross-check.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, layout, and animations are all
intended as shown. Recreate pixel-closely. The one liberty you may take: the panel
illustrations are stylized CSS/SVG sketches — if your game has real concept art, these are
the natural place to swap in production artwork (keep the panel framing and text layout).

## Layout (overall)
- **Page background:** a full-viewport vertical radial gradient (warm near-black).
  `radial-gradient(120% 90% at 50% 0%, #15100a 0%, #0a0706 48%, #070504 100%)`
- **Outer container:** flex column, centered horizontally.
  `padding: 46px 24px 60px; box-sizing: border-box; min-height: 100vh.`
- **Kicker label** ("THE AGE BEGINS"): Cinzel, 13px, letter-spacing `.42em`, uppercase,
  color `#7a5f33`, `margin-bottom: 26px`.
- **Panel grid:** `display: grid; grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 14px; width: 100%; max-width: 968px.` → two columns, ~477px each at max width.
- **Each panel:** `position: relative; height: 362px; overflow: hidden;`
  `border: 1px solid rgba(201,160,90,.42);`
  `box-shadow: inset 0 0 60px rgba(0,0,0,.7);`
  background is a panel-specific radial gradient (see each screen).
  - Inside each panel, the top **172px** is the illustration area (`position:absolute; top:0; left:0; right:0; height:172px; overflow:hidden`).
  - A **gradient scrim** sits at the bottom to fade the art into the caption:
    `position:absolute; left:0; right:0; bottom:0; height:210px;`
    `background: linear-gradient(180deg, transparent, #0a0706 42%);`
  - The **Roman numeral** (I–IV) is top-left of each panel: Cinzel, 15px, color `#c9a05a`,
    opacity `.85`, at `top:10px; left:13px`.
  - The **caption paragraph** is absolutely positioned at the bottom:
    `left:20px; right:20px; bottom:18px; margin:0;`
    `font-variant: small-caps; font-size: 15.5px; line-height: 1.72;`
    `letter-spacing: .025em; color: #a9854e; text-wrap: pretty.`
    Emphasis words are wrapped in `<em>` with `color:#e3bd74` (italic).
- **Awaken button** (below grid, `margin-top: 34px`): Cinzel, 15px, letter-spacing `.34em`,
  uppercase, color `#e3bd74`, `background: rgba(20,15,9,.6)`,
  `border: 1px solid rgba(201,160,90,.55)`, `padding: 15px 52px`, `cursor: pointer`.
  Hover: `background: rgba(40,30,16,.85); color:#ffe6a8`.
  Idle: gentle breathing box-shadow (see `btnBreathe` keyframe).

## Screens / Views
There is **one screen** (the intro), composed of four panels. Exact caption copy below — do
not paraphrase; this is the game's written voice.

### Panel I — The Dark
- **Panel background:** `radial-gradient(120% 120% at 50% 32%, #1a130b 0%, #0c0907 60%, #080605 100%)`
- **Illustration:** a central **glowing mote** (14px gold dot, radial fill `#ffe6a8→#e0b15c`,
  `box-shadow: 0 0 26px 8px rgba(224,177,92,.4)`) that **pulses** (`pulseGlow`, 4.5s).
  Three faint **star-ray** lines cross through it (1px gradient lines at 0°, 60°, 120°).
  Four small **twinkling** particles (`twinkle`, 3–4.4s, staggered) scattered around.
- **Caption (exact):**
  > Before there was hunger, before there was purpose — there was only the dark. You did not
  > arrive. You simply *were*. A will without a body, a mind pressed between the stones of a
  > world that had forgotten you were there.
  - Emphasis word: **were**

### Panel II — Sensation (the crack)
- **Panel background:** `radial-gradient(120% 120% at 50% 35%, #161009 0%, #0b0807 64%, #080605 100%)`
- **Illustration:** a **stone-block wall** built from repeating-linear-gradient mortar lines
  (`#15100a` base; vertical lines every 64px, horizontal every 40px, offset rows at 80px),
  with `box-shadow: inset 0 0 50px rgba(0,0,0,.6)`. A **jagged glowing crack** runs top-to-
  bottom as an SVG `<polyline>` (gold `#e8c069`, width 2.4, with a thin `#fff0c8` hot core
  and two smaller branch cracks). The crack group **pulses** opacity (`seam`, 3.6s).
- **Caption (exact):**
  > Then — sensation. The weight of stone above. The slow drip of water somewhere far below.
  > Something had changed in the world above, and the tremor of it reached you, faint as a
  > whispered rumour. You were not summoned. But something had drawn *near*.
  - Emphasis word: **near**

### Panel III — The Apparition (faceless ghost)
- **Panel background:** same as Panel II.
- **Illustration:** the same stone-wall texture. A **classic faceless ghost** silhouette
  (SVG path: domed head + scalloped wavy bottom) filled with a pale-gold vertical gradient
  (`#fff3d4 .78 → #e6c98c .5 → #caa45c .16`), `drop-shadow(0 0 16px rgba(224,177,92,.6))`.
  It **phases in and out** (`ghostPhase`, 6s: opacity 0→.92→0 with blur 13px→2px→13px and a
  slight rise) and **sways** (`ghostSway`, 6.5s) on a parent wrapper. A soft floor glow
  pulses beneath it (`floorGlow`, 5s). Two embers rise (`spark`).
- **Caption (exact):**
  > These halls are yours by right of ruin. No deed records them. No king claims them. They
  > were abandoned to silence, and silence answered to no one — until *now*. A dungeon
  > without a mind is merely a grave. You are the difference.
  - Emphasis word: **now**

### Panel IV — Intent (the floating pick)
- **Panel background:** `radial-gradient(120% 120% at 50% 40%, #19120a 0%, #0b0807 64%, #080605 100%)`
- **Illustration:**
  - **Stone floor / rubble:** four `60×36` stone blocks along the bottom (`top:126px`)
    plus two small tilted rubble chips.
  - **The mind / will:** a glowing mote on the left (`left:118 top:62`): an 11px gold core
    (`box-shadow 0 0 18px 5px`) inside a 60px pulsing halo (`mindPulse`, 4s).
  - **Tether of intent:** a 150px gradient line from the mote toward the pick, flickering
    opacity (`beamFlicker`, 2.4s).
  - **Aura:** a 98×88 radial gold glow around the pick, pulsing (`auraPulse`, 3.6s).
  - **The pickaxe:** a smooth **inline-SVG** pick (≈68×86) — arched golden head
    (gradient `#f4dc97→#d8ab54→#9a7026`, stroke `#6e4f1c`, with a `#fff0c8` highlight arc and
    a center boss circle) on a wood-gradient handle. It **floats/stirs on its own**
    (`pickFloat`, 3.8s: translateY 0→-10px with rotate -4°→5°). Three sparks rise from where
    it would strike.
- **Caption (exact):**
  > You reach — not with hands, but with *intent*. The pick stirs. The stones remember what
  > they once were: not a tomb, but a stronghold. Not an ending, but a beginning. Your first
  > choice awaits. Make it count, Dungeon Mind. The age has only just begun.
  - Emphasis word: **intent**

## Interactions & Behavior
- **Awaken button** is the only interactive control. In the prototype it dispatches a
  bubbling DOM `CustomEvent('intro-awaken')`. In your codebase, wire this to your game's
  start/route transition (e.g. navigate to the first gameplay screen). Add a hover state as
  specified and keep the idle breathing glow.
- **All panel animations are ambient and looping** (CSS keyframes) — purely decorative, no
  user input, no JS state. They should start on mount and loop forever while the screen is
  shown.
- **No scrolling, loading, error, or form states.** This is a static narrative screen.
- **Responsive:** the prototype is a fixed 2×2 grid capped at `max-width:968px`, centered,
  with viewport padding. For small screens you may collapse the grid to a single column
  (`grid-template-columns: 1fr`) — panels and captions will stack; this was not designed but
  ports cleanly. Confirm the desired mobile behavior with design.

## Animations & Easing
All use `ease-in-out infinite` unless noted. Keyframes (recreate verbatim):
- `pulseGlow` 4.5s — mote scale .92→1.12, opacity .55→1 (Panel I core).
- `twinkle` 3–4.4s — opacity .12→.8 (particles).
- `seam` 3.6s — opacity .4→.95 (Panel II crack).
- `ghostPhase` 6s — opacity 0→.92→0, blur 13→2→13px, translateY 16→0→-18px (Panel III).
- `ghostSway` 6.5s — translateX ±4px, rotate ±2.5° (Panel III wrapper).
- `floorGlow` 5s — opacity .3→.6 (Panel III/IV ground glow).
- `mindPulse` 4s — scale .82→1.18, opacity .6→1 (Panel IV mote halo).
- `beamFlicker` 2.4s — opacity .22→.7 (Panel IV tether).
- `auraPulse` 3.6s — scale .9→1.12, opacity .38→.85 (Panel IV pick aura).
- `pickFloat` 3.8s — translateY 0→-10px, rotate -4°→5° (Panel IV pick).
- `spark` ~1.8–3s `ease-out infinite` — translateY 0→-22px, scale 1→.4, opacity 0→.9→0 (rising embers).
- `btnBreathe` 4s — box-shadow grows/glows on the Awaken button.

## State Management
None required. Single static screen with looping CSS animations. The only state is "intro
shown" → "game started," triggered by the Awaken button (handled by your router/game state).

## Design Tokens
**Colors**
- Backgrounds (warm near-black): `#070504`, `#080605`, `#0a0706`, `#0b0807`, `#0c0907`,
  `#15100a`, `#161009`, `#19120a`, `#1a130b`
- Stone blocks: `#1c150d`, `#16110a`, `#241a0e`, `#2a1f12`
- Gold scale: `#7a5f33` (dim), `#9a7b45`, `#a9854e` (body text), `#b8862f`, `#c9a05a`
  (borders/numerals), `#d8ab54`, `#e0b15c`, `#e3bd74` (emphasis / button), `#e8c069`
  (bright accent), `#f2d68c` / `#f4dc97` (highlights), `#ffe6a8` / `#fff0c8` (hot core/white-gold)
- Wood: `#3c2c16`, `#4a3720`, `#5a4324`, `#8a6a36`, `#9c7a40`
- Border (panels): `rgba(201,160,90,.42)`; button border `rgba(201,160,90,.55)`
- Glow/aura base: `rgba(224,177,92, …)`

**Typography**
- **Cinzel** (Google Fonts), weights 500/600 — used for the kicker label, Roman numerals,
  and the Awaken button. Uppercase + wide letter-spacing (`.34em`–`.42em`).
- **EB Garamond** (Google Fonts), regular + italic — used for caption body text, rendered
  with `font-variant: small-caps`, 15.5px, line-height 1.72, letter-spacing .025em.
- Import: `https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:ital@0;1&display=swap`

**Spacing / sizing**
- Grid gap (comic gutter): `14px` · Container max-width: `968px` · Panel height: `362px`
- Illustration band height: `120–172px` · Caption insets: `20px` sides, `18px` bottom
- Button padding: `15px 52px`

**Borders / radius / shadows**
- Panels are square-cornered (`border-radius: 0`) with 1px gold border + inner vignette
  `inset 0 0 60px rgba(0,0,0,.7)`.
- Pick/ghost use SVG `drop-shadow` gold glows; mote uses layered `box-shadow`.

## Assets
**None external.** Every illustration is generated with CSS gradients + inline SVG; there
are no image, icon, or font files beyond the two Google Fonts above. If you replace the
CSS/SVG sketches with real concept art, those become your only new assets.

## Files
- `Intro.dc.html` — the full design reference (all four panels, animations, and button).
  Open it in a browser to see the live result. Note it's authored in a custom streaming-HTML
  ("Design Component") format; treat the markup as a visual/behavioral reference, and use the
  token + measurement tables above for exact implementation values.
