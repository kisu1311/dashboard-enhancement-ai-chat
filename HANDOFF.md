# Handoff — 2026-07-14 18:37

## Read first
CLAUDE.md top-to-bottom — especially the **MANDATORY research-notes rule** (every
task here must be grounded in `Dashboard-Research-Notes.md`) and the **Pages
(variants)** section, which now describes what each HTML file contains.

## What we worked on this session
Built the variant auto-sync system, then turned `index.html` (V2) into a fully
interactive Dashboard module — picker redesigns (three iterations driven by user
feedback), timeline system, Create/Edit drawer, dynamic widget canvas with every
documented action, NOC playback — plus a profile-popover redesign. Everything was
published live.

## Completed
- **Variant auto-sync**: `_sync_variants.js` scans the folder, adds every `.html`
  as a switcher option (label from `<title>`), injects the script include, prunes
  deleted files. Runs in the deploy workflow; MANDATORY manual run after
  creating/renaming/deleting a page (rule in CLAUDE.md).
- **V2 picker (index.html)**: flat list w/ sticky category headers, quick-access
  2-col grid (favorites ★ + recents 🕓), category jump bar, search w/ teal
  highlight + ✕ clear, collapse/expand (only current category open by default),
  neutral type icons per row + footer legend (System Defaults / Created by Me /
  Shared with Me).
- **All dashboard actions real** (per notes §4): row + header kebab menu — Open,
  favorite, Clone (with widgets), Edit (opens the drawer pre-filled, "Update
  Dashboard" really renames/moves/re-shares), default landing (teal home badge),
  Make private/public, Export PDF/schedule toasts, red Delete.
- **Create Dashboard drawer** (notes §5): 560px right drawer — Name*, Category* +
  Create New, Public/Private with exact docs notes + user picker, default-landing
  switch + radios, 4 layout sliders driving a live preview, collapsible Advanced
  Settings (Description, time-range presets, auto-refresh, Sticky Timeline, Add
  to NOC View), Reset, docs link. Creating really adds (new categories included).
- **Timeline system** (notes §1+§6): chip (pill+label+⊗), preset menu with
  "Type Range…" type-ahead, Custom dual-month calendar w/ From/To time, slider
  strip (~100 dots, 2-handle window, domain = 4× window right-pinned at now,
  drag → Custom), from/to stamps, clear empties all widgets, sticky-pin toggle,
  widget badges + data follow the range.
- **Widget canvas** (notes §7+§9): dynamic `DASH_WIDGETS` list; floating ＋ →
  Add New Widget drawer (Create Widget = 17 types in 6 groups, Predefined w/
  used-counts, User Define, search, docs link); widget kebab (Edit/Clone/Full
  Screen/Share/Remove); drag-reorder; vertical resize grips; drill-down side
  drawer on availability counters; Metric Insight (3 tabs) on time-series
  widgets; Export menu (PDF / email / schedule).
- **NOC View**: rows/▶ open a real kiosk playback overlay (‹name› arrows, live
  countdown, pause, ✕/Esc); ＋ New NOC View form really appends. Manage modal
  (labeled "concept — not captured from live").
- **Profile popover redesign**: avatar + status dot + role chip + email, grouped
  ACCOUNT/RESOURCES/THEME sections with icon tiles, chevron/↗ affordances,
  bordered red Logout button, build caption in footer.
- **V3 `dashboard-picker-advanced.html`** preserved as its own variant (the
  denser chips/tiles/tree picker) with the same actions menu.
- **Published**: commit `6a2ea89` pushed; Pages deploy green; new version
  verified live (all 3 variants in the live switcher).

## In progress
Nothing mid-flight.

## Next steps
- Optional: make widget "Edit Widget…" open a real widget-builder modal (type
  tabs + query builder) instead of a toast — the last remaining toast-only stub
  alongside dashboard Export sub-actions and Share.
- Optional: capture the live manage-dashboards (grid-pencil) view + widget Share
  dialog on the demo instance (notes §13 lists them as un-captured) and align
  the concept Manage modal.
- Optional: delete V1 (`index copy.html`) if no longer needed — `rm` + run
  `node _sync_variants.js`.

## Decisions made
- V2 = the *simple* picker (user called the first rich design "very complex");
  the rich design lives on as V3 for comparison. A drill-down variant was built
  and then deleted at the user's request.
- Every task in this folder must be grounded in `Dashboard-Research-Notes.md`
  (user rule, Jul 14). Features beyond the live product get flagged (e.g. the
  Manage modal is labeled "concept").
- Only the current dashboard's category opens by default in the picker.
- Old rich-picker design was preserved as a new variant *before* replacing V2 —
  preserve, don't destroy.

## Gotchas & notes
- **Prototype state is in-memory only** — clones/deletes/creates reset on
  reload. Intentional.
- **z-index**: the variant-switcher pill is z 99999 — any drawer/overlay must
  sit above 100000 (drawers/kiosk already do; the floating ＋ sits at bottom:72px
  to clear the pill).
- **CSS scoping trap** (hit 3×): shared bits like `MICON.lock` (`class="lock"`)
  and `mark` styles are scoped per row class — new row classes need their own
  `.x .lock{…}` sizing rules or icons render giant / marks go browser-yellow.
- Re-`Read` files before `Edit` (IDE Prettier can reformat); screenshot-inject
  state via `_shot-tmp.html` sed copies (underscore keeps sync away), delete after.
- A Claude Code PostToolUse hook for the variant sync was attempted but denied
  by the permission classifier — needs explicit user approval if wanted; the
  CLAUDE.md rule + deploy-workflow step cover it meanwhile.
- `gh` CLI not installed; `git push` works via keychain. Deploy status checked
  via the public GitHub API.
