// save.js
//
// Save system, modeled on Evolve (pmotschmann/Evolve):
//   • localStorage uses LZString.compressToUTF16 (densest for UTF-16 string storage)
//   • export strings use LZString.compressToBase64 (safe to paste anywhere)
//   • saves carry a version stamp; migrateSave() upgrades old saves on load
//   • import writes to localStorage then reloads, so normal startup load applies it
//
// LZString is loaded globally from lib/lz-string.min.js before this file.

const SAVE_KEY = "dungeonKeeperSave";

// Maximum offline time that can be banked (8 hours in seconds)
const OFFLINE_BANK_CAP = 8 * 60 * 60;

// ── Serialization helpers ───────────────────────────────────────────────────
// Reading falls back to plain JSON so saves written before compression existed
// (and hand-pasted/dev saves) still load.

function _serializeSave(obj) {
    const json = JSON.stringify(obj);
    if (typeof LZString !== "undefined" && LZString.compressToUTF16) {
        return LZString.compressToUTF16(json);
    }
    return json; // fallback: store raw JSON
}

function _deserializeSave(raw) {
    if (!raw) return null;
    // Try UTF-16 compressed first; if that yields nothing, treat as raw JSON.
    if (typeof LZString !== "undefined" && LZString.decompressFromUTF16) {
        try {
            const out = LZString.decompressFromUTF16(raw);
            if (out) return JSON.parse(out);
        } catch (e) { /* fall through to raw JSON */ }
    }
    try { return JSON.parse(raw); } catch (e) { return null; }
}

// ── Version migration ───────────────────────────────────────────────────────
// Runs on every load before the state is committed to gameState. Each block
// upgrades the save shape for a given era of the game. Keep blocks additive and
// idempotent — a fresh/recent save should pass through untouched.

function migrateSave(state) {
    if (!state || typeof state !== "object") return state;

    const from = state.saveVersion || "0";

    // --- Structural normalization (safe for any version) ---
    if (!state.meta) state.meta = {};
    if (!state.run)  state.run  = { biome: null, race: null, mods: [] };
    if (!state.resources) state.resources = {};

    // Example migration scaffold — grow this as the schema changes:
    // if (_verLt(from, "0.52")) {
    //     // rename/move/default fields introduced in 0.52
    // }

    // Stamp the save with the current version so the next load sees it as current.
    state.saveVersion = (typeof window !== "undefined" && window.GAME_VERSION) || from;
    return state;
}

// Compare dotted version strings: returns true if a < b.
function _verLt(a, b) {
    const pa = String(a).split(".").map(Number);
    const pb = String(b).split(".").map(Number);
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
        const x = pa[i] || 0, y = pb[i] || 0;
        if (x < y) return true;
        if (x > y) return false;
    }
    return false;
}

// ── Core save / load ────────────────────────────────────────────────────────

function saveGame() {
    gameState.lastSeen = Date.now();
    gameState.saveVersion = (typeof window !== "undefined" && window.GAME_VERSION) || gameState.saveVersion || "0";
    localStorage.setItem(SAVE_KEY, _serializeSave(gameState));
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;

    const state = _deserializeSave(raw);
    if (!state) return; // corrupted/unreadable — leave defaults in place

    migrateSave(state);
    Object.assign(gameState, state);

    // Bank offline seconds (up to 8 hrs) into the accel bank
    if (gameState.lastSeen) {
        const offlineSec = Math.floor((Date.now() - gameState.lastSeen) / 1000);
        const toBank     = Math.min(offlineSec, OFFLINE_BANK_CAP);
        if (toBank > 0) {
            gameState.pauseBank = (gameState.pauseBank || 0) + toBank;
        }
    }
    gameState.lastSeen = Date.now();
}

// ── Export / Import (Evolve-style) ──────────────────────────────────────────

// Returns a Base64 string of the entire game state, suitable for copy-paste.
function exportSave() {
    gameState.lastSeen = Date.now();
    gameState.saveVersion = (typeof window !== "undefined" && window.GAME_VERSION) || gameState.saveVersion || "0";
    if (typeof LZString === "undefined" || !LZString.compressToBase64) {
        // No compression available — fall back to Base64 of raw JSON via btoa.
        return btoa(unescape(encodeURIComponent(JSON.stringify(gameState))));
    }
    return LZString.compressToBase64(JSON.stringify(gameState));
}

// Accepts a Base64 export string. Decompresses, validates, migrates, writes to
// localStorage, and reloads the page so normal startup load applies it (matching
// Evolve's reload-after-import flow). Returns true on success, false on failure.
function importSave(data) {
    if (!data || typeof data !== "string") return false;
    const trimmed = data.trim();
    if (!trimmed) return false;

    let state = null;
    if (typeof LZString !== "undefined" && LZString.decompressFromBase64) {
        try {
            const out = LZString.decompressFromBase64(trimmed);
            if (out) state = JSON.parse(out);
        } catch (e) { state = null; }
    }
    // Fallbacks: plain btoa-Base64 JSON, or even raw JSON paste.
    if (!state) {
        try { state = JSON.parse(decodeURIComponent(escape(atob(trimmed)))); } catch (e) {}
    }
    if (!state) {
        try { state = JSON.parse(trimmed); } catch (e) {}
    }

    // Basic sanity check: a real save has resources + run.
    if (!state || typeof state !== "object" || !state.resources || !state.run) {
        return false;
    }

    migrateSave(state);

    // Write the imported save, then reload so startup loadGame() applies it.
    // Set the reset flag first so the beforeunload handler doesn't overwrite the
    // freshly-imported save with the old in-memory gameState on the way out.
    if (typeof window !== "undefined") window._pendingReset = true;
    localStorage.setItem(SAVE_KEY, _serializeSave(state));
    location.reload();
    return true;
}
