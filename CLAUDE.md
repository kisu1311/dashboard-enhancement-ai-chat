**On session start:** If `HANDOFF.md` exists in this directory, read it before
anything else for the latest state of the work.

# Side_bar_menu — ObserveOps sidebar & header prototype

## MANDATORY: consult the research notes for EVERY task in this folder

Before designing, changing, or adding anything here, read
`Dashboard-Research-Notes.md` (same folder) and ground the work in it. It is
the verified source of truth for the live product (build 8.2.6 + official
docs, adversarially fact-checked): module chrome, dashboard list panel,
NOC View, dashboard/widget actions, Create/Edit drawer fields, time-range
picker, widget catalog, RBAC, and refuted claims. Match its terminology,
field names, notes, and behaviors exactly; when inventing something new,
call out that it goes beyond the live product. Never contradict a fact in
the notes without flagging it to the user.

Self-contained HTML prototypes of the Motadata ObserveOps chrome (live 8.2.6):
sidebar, header actions, and a fully interactive **Dashboard module**. Open any
`.html` directly in a browser — no build step. Plain HTML/CSS/JS with the shared
dark/light design-token system; every page redeclares its own `:root` tokens.

## Pages (variants)

- **`index.html` — V2 · Grouped Sidebar (main prototype).** Sidebar + profile
  popover + notifications + spotlight search, PLUS the full Dashboard module:
  friendly flat picker (quick-access grid, sticky category headers,
  collapse/expand — only the current category opens by default, type icons +
  legend, search w/ highlight, category jump bar), per-dashboard actions menu,
  Create/Edit Dashboard drawer (560px, Advanced Settings), full timeline system
  (preset chip + type-ahead, custom dual-month calendar, draggable slider
  strip, clear, sticky toggle), dynamic widget canvas (add-widget drawer w/
  17-type catalog, clone/remove/full-screen, drag-reorder, resize, drill-down
  drawer, Metric Insight tabs, export menu), NOC View kiosk playback +
  create-NOC-view form, and a Manage Dashboards modal (concept).
- **`index copy.html` — V1 · Sidebar & Header Actions.** Earlier chrome variant.
- **`dashboard-picker-advanced.html` — V3 · Advanced Dashboard Picker.** The
  denser picker design (filter chips, type tiles, collapsible tree) kept for
  comparison; also has the per-row dashboard actions menu.
- `Dashboard-Research-Notes.md` — the verified product research (see MANDATORY
  above). `_variants.js` + `_sync_variants.js` — variant switcher + auto-sync.

## Variant switcher (auto-connected pages)

Every `.html` file in this folder is an option in a floating variant-switcher
pill (bottom-right of each page), rendered by `_variants.js`.

**MANDATORY: after creating, renaming, or deleting any `.html` file in this
folder, run:**

```bash
node "/Users/kishanpatel/ObseverOps/Side_bar_menu/_sync_variants.js"
```

It auto-adds the page to the switcher list in `_variants.js` (labelled
`V<n> · <page title>` from the file's `<title>` tag — so give new files a
meaningful title), injects `<script src="_variants.js"></script>` before
`</body>` if missing, and removes deleted files from the list. Never edit the
`VARIANTS:BEGIN…END` block in `_variants.js` by hand. The deploy workflow also
runs the sync on every push as a safety net, so the live site is always
complete even if a local run was missed. Files starting with `_` are ignored.

## Verifying changes

Screenshot with headless Chrome (quote paths; inject JS state via a sed temp
copy named `_shot-tmp.html` — the `_` prefix keeps it out of the variant sync):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --window-size=1500,950 \
  --virtual-time-budget=2500 --screenshot=/tmp/out.png \
  "file:///Users/kishanpatel/ObseverOps/Side_bar_menu/index.html"
```

## Deployment
Repo: https://github.com/kisu1311/Side_bar_menu
Live URL: https://kisu1311.github.io/Side_bar_menu/
Push to `main` → GitHub Actions deploys Pages (workflow also runs the variant
sync). `gh` CLI is NOT installed — plain `git push` works via keychain.

## Handoff
Latest session state is in [HANDOFF.md](HANDOFF.md) — read it first.
