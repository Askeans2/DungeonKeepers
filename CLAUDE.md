# Dungeon Keepers — Claude Code Instructions

## Standing Orders

### Changelog (mandatory on every version bump)
Whenever `version.js` is bumped to a new version number, **always** add a new entry at the **top** of the Changelog section in `wiki.html` (inside `#wiki-changelog`). The entry must:
- Use the `.biome-card` div pattern already in use
- Include `<span class="cl-ver">vX.XX</span>` and `<span class="cl-date">YYYY-MM-DD</span>`
- Summarize the changes in 1–3 sentences (what was added, fixed, or changed)
- Be placed **above** all existing entries (newest first)

Entry format:
```html
<div class="biome-card">
    <div><span class="cl-ver">v0.XX</span><span class="cl-date">YYYY-MM-DD</span></div>
    <p class="biome-desc">Summary of what changed in this version.</p>
</div>
```

Also update the Research section of `wiki.html` (`wiki-gameplay` → Research paragraph) if research systems change significantly.

### Version bumping (mandatory on every commit)
Version lives in `version.js` as `window.GAME_VERSION`. **Every commit must include a version bump.** No exceptions.

Use a three-segment format: `MAJOR.MINOR.PATCH` (e.g. `0.55.1`). When the current version only has two segments (e.g. `0.55`), treat it as `0.55.0` before incrementing.

| Change type | Increment | Examples |
|---|---|---|
| New feature, new content, new system | `+0.01.0` (minor) | new wiki page, new creature, new mechanic |
| Bug fix, style change, copy edit, refactor | `+0.00.1` (patch) | tooltip fix, CSS tweak, text correction |

Rules:
- A single commit that mixes features and fixes uses the **higher** increment (minor).
- The bump goes in `version.js` only — asset cache-busting is automatic.
- The changelog entry in `wiki.html` is **also required** on every bump (see Changelog standing order above).
