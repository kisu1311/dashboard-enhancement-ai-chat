**On session start:** If `HANDOFF.md` exists in this directory, read it before
anything else for the latest state of the work.

# Dashboard_with_AI_Chat — ObserveOps chrome, Dashboard module & AI panel

> **Folder was renamed** from `Side_bar_menu` on 5 Aug 2026. The git remote is
> still `github.com/kisu1311/Side_bar_menu` and Pages still serves from
> `kisu1311.github.io/Side_bar_menu/` — only the local folder name changed.
> Old Agentation sessions and annotations may still carry `/Side_bar_menu/` URLs.

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

Three pages are in the switcher. Each carries the **ObserveOps AI panel** except V1.

- **`index copy.html` — V1 · Sidebar & Header Actions.** The chrome study, and now
  the most heavily iterated page. Datadog-style module rail (see below), the full
  Dashboard list panel ported from V2, time-slider strip, dynamic widget canvas,
  widget Share drawer, Full Screen, Export.
- **`index.html` — V2 · Grouped Sidebar + AI Option 1 (main prototype).** Sidebar +
  profile popover + notifications + spotlight search, PLUS the full Dashboard
  module: picker panel (quick-access grid, sticky category headers, only the
  current category open by default, type icons + legend, search w/ highlight),
  per-dashboard actions menu, Create/Edit Dashboard drawer (560px, Advanced
  Settings), full timeline system, dynamic widget canvas (17-type catalog,
  clone/remove/full-screen, drag-reorder, resize, drill-down, Metric Insight,
  export), NOC View kiosk playback + create form, Manage Dashboards modal
  (concept). **Carries AI panel Option 1.**
- **`dashboard-picker-advanced.html` — V3 · Advanced Picker + AI Option 2.** The
  denser picker design (filter chips, type tiles, collapsible tree) kept for
  comparison. **Carries AI panel Option 2** (auto mode badge + scope selector).
- `_ai-source/` — `ai-chat-option2.html` and `dashboard-ai-insights.html`, the two
  original AI prototypes the panel was ported from. **The only copies that exist**
  (their old `AI_Chat_Interface/` folder is gone). Kept out of the folder root so
  the variant sync ignores them. Reference only — do not delete.
- `Dashboard-Research-Notes.md` — the verified product research (see MANDATORY
  above). `_variants.js` + `_sync_variants.js` — variant switcher + auto-sync.

## The ObserveOps AI panel (V2 + V3)

Ported verbatim from `_ai-source/`: ~600 lines CSS, ~33 lines markup, ~1,000–1,200
lines JS, in **its own `<script>` block** so it stays out of each page's flat script
scope. Self-contained apart from `toast()`.

- Opens from the **✦ ObserveOps AI** row in the sidebar rail or the **✦ Ask AI**
  button in the dashboard toolbar. **⌘K / Ctrl+K opens the AI**, not the spotlight
  search (the AI binds it in the capture phase — same trade-off the source files
  made).
- Violet (`--oa*` tokens) is reserved for AI; teal stays the product accent.
- "Create a dashboard" is the AI's **workflow mode** (plan → preview → approve).
  The standalone *Create Dashboard with AI* drawer in the source files is dead
  code — it was deliberately removed there; don't resurrect it.
- A host adapter keeps the AI's context chips pointing at the live `#dashTitle`
  and time chip instead of the source prototype's canned board.

## V1's module rail (Datadog pattern, docs-grounded)

Reworked from `docs.motadata.com/motadata-aiops-docs` (read Aug 2026), not invented:

- The rail shows **7 main entries**, not the live product's 16 — Dashboards,
  Monitors, Alerts │ Explorers, Network, SLO │ Settings — split by hairlines with
  **no captions, counts or chevrons** (Datadog shows grouping, it doesn't label it).
- Everything else is a **sub-menu**: hovering a rail row opens a mega-menu flyout
  with the module's own navigation under bold headings, using the docs' page names.
  All 15 module screens stay one hover away and light the rail entry that owns them
  (`MOD_TO_RAIL`).
- **Hovering a collapsed rail only expands it** — sub-menus appear once it's open.
- Rail widths are the tokens `--rail-w` / `--rail-w-open`; the flyout anchors off
  the **token**, never off the measured box (see Gotchas).
- ⚠️ This is a deliberate divergence from the live 8.2.6 nav (research notes §1),
  flagged in a comment above `RAIL`. Only the **Dashboards** flyout is fully
  grounded in real data; other modules' sub-items are docs-derived labels.

## Variant switcher (auto-connected pages)

Every `.html` file in this folder is an option in a floating variant-switcher
pill (bottom-right of each page), rendered by `_variants.js`.

**MANDATORY: after creating, renaming, or deleting any `.html` file in this
folder, run:**

```bash
node "/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/_sync_variants.js"
```

It auto-adds the page to the switcher list in `_variants.js` (labelled
`V<n> · <page title>` from the file's `<title>` tag — so give new files a
meaningful title), injects `<script src="_variants.js"></script>` before
`</body>` if missing, and removes deleted files from the list. The deploy workflow
also runs the sync on every push as a safety net, so the live site is always
complete even if a local run was missed. Files starting with `_` are ignored — and
so is anything in a **subfolder**, which is why `_ai-source/` stays out of the list.

The script only ever *appends* new files and *prunes* deleted ones; it preserves
existing order and hand-tuned labels. So to **reorder or rename** an option you do
edit the `VARIANTS:BEGIN…END` block by hand, then re-run the sync to confirm it
reports no changes (that proves the edit is stable).

## Verifying changes

Screenshot with headless Chrome (quote paths; strip the Agentation loader first —
it can hang the run):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/cp \
  --hide-scrollbars --window-size=1500,950 --virtual-time-budget=2500 \
  --screenshot=/tmp/out.png \
  "file:///Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/index.html"
```

The most efficient check is a **probe copy**: inject a script that calls the
functions under test, collects `ok`/`ERR` per call plus `window.onerror`, and
paints the result into a yellow bar at the top of the page — one screenshot then
verifies a dozen behaviours at once.

## Agentation (design-feedback widget)

Each page ends with a **dev-only** loader that injects `agentation-embed.js` (it
no-ops off `file://` / localhost, so it never ships). Annotations come back via the
`mcp__agentation__*` tools; resolve each one with a summary of what changed.

The loader also injects a **stacking fix**. Agentation paints its toolbar at
z-index 100000 and its marker/canvas layers at 99996–99998, while `index.html`'s
drawers sit at 100001 / 200001 (they have to clear the variant pill at 99999) — so
an open drawer buried the annotation layers and notes could not be attached to
anything inside it. The fix lifts `[data-agentation-root] > *` above everything.
Note the consequence: **while annotate mode is on, clicks inside a drawer go to
Agentation, not the app** — pause it (⏸) to use the UI.

## Gotchas

- **Never measure an animating box.** The rail transitions its width over .18s;
  positioning the flyout from `getBoundingClientRect()` caught it mid-transition,
  parked the menu at 64px, and the expanding rail then covered it. Anchor off the
  `--rail-w` / `--rail-w-open` custom properties — custom properties aren't
  transitioned, so they give the target value immediately.
- **Headless screenshots lie about in-flight transitions.** With
  `--virtual-time-budget`, `getComputedStyle` can report the *start* width while
  the paint already shows the end state. Confirm which CSS rules match before
  concluding a rule "isn't applying".
- **`JSON.stringify` inside an HTML attribute breaks it** — its double quotes close
  the `onclick`. Escape to `&quot;` (see `mfAttr`).
- **Porting a block by line range drags in neighbours.** Copying V2's panel pulled
  in its `<div id="dcanvas">`, which sat in-flow in `.dwrap` and stole half the
  canvas width. After any port, dump the container's children and check for
  duplicate ids.
- `position:absolute` panels need a `position:relative` parent, or they anchor to
  the viewport and cover the header.
- In dark theme `--pop` and `--border` are **the same colour**, so hairlines inside
  popovers draw nothing. Use `--pop-line` for dividers in a `.pop`.
- Re-`Read` files before `Edit` (the IDE reformats them).

## Deployment
Repo: https://github.com/kisu1311/Side_bar_menu (unchanged by the folder rename)
Live URL: https://kisu1311.github.io/Side_bar_menu/
Push to `main` → GitHub Actions deploys Pages (workflow also runs the variant
sync). `gh` CLI is NOT installed — plain `git push` works via keychain.

## Handoff
Latest session state is in [HANDOFF.md](HANDOFF.md) — read it first.
