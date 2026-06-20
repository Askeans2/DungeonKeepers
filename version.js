// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH FOR THE GAME VERSION.
//
// Bump this one value on each release. Nothing else needs to change.
//
// Every page loads this file fresh (cache-busted by a timestamp), then uses
// GAME_VERSION to stamp a "?v=<version>" query string onto every local asset
// (style.css and the game scripts) and to label the version button. Because the
// query string changes whenever this value changes, browsers automatically
// reload any file that changed in the new release instead of serving a stale
// cached copy.
// ─────────────────────────────────────────────────────────────────────────────
window.GAME_VERSION = "0.32";
