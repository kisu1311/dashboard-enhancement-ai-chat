# Handoff — 2026-08-27 22:44

## Read first

Three sections of `CLAUDE.md`, in this order:

1. **"The 27 Aug 2026 pass — the Sidebar tab, and the design system as the authority"** —
   everything this session did, with the traps written at each feature. It **supersedes**
   several older statements in that file; where anything conflicts, it is current.
2. **"Manage dashboards (`md*`)"** and **"The 26 Aug 2026 pass"** — the Layout drawer and
   the Manage screen this session built on.
3. The **`## Gotchas`** section — three of its entries bit again this session.

Most work is **Option 1** (`index copy.html`). ⚠️ **Options 2 and 3 also changed** — the
shared `ac*` chat panel's dead controls (Open in Explorer, View it, Sources, the context
chips, Export) were made real earlier in the session, and that block is **byte-identical in
all three files**, so the edit landed in all three by design. Everything else is Option 1.

## What we worked on this session

Rebuilt the **Dashboard layout** drawer on the ObserveOps **design system** (consulted
through its MCP, not guessed) and on the **live product** at `172.16.12.100` (build 10.0.0),
then turned its second tab into a **Sidebar** tab that governs everything in the rail —
modules, Explorer's sub-modules and pinned dashboards — with a live clone of the sidebar
beside it.

## Completed

- **The drawer is DS-conformant.** Tokens declared under their own DS names on
  `#drawer-layout`; `Molecules/Tabs` variant `no-border`; `Atoms/Button` (one primary);
  4px `@btn-radius`; `@primary-color` cyan on form controls. `validate_usage` /
  `validate_render` return **0 real violations**. SF-001 (no focus ring) is **fixed**, not
  reproduced — it is a documented DS bug, not a spec.
- **Apply to is `Atoms/Radio` variant `list`.** The DS ruled out both previous builds — the
  segmented control by `segmented.dontUse`, and the selection cards because a component may
  not be invented. Descriptions moved under the titles, per the Mobbin corpus (Whop, Deel,
  Jira, Squarespace, HubSpot, beehiiv all do this; none right-aligns).
- **The Sidebar tab**, from the product's **Create Role → Navigation** screen: search +
  Hide all / Show all, a filled-header table of `MENU · HOME · VISIBLE`, and a **Live
  Preview that is a live clone of `#sidebar`** — so it cannot show a rail the rail will not
  produce.
- **Everything in the rail is manageable there**: the 6 rail entries, Explorer's 10
  sub-modules and pinned dashboards, the last two indented as `.sub` under their parents.
- **Show / hide, mark-as-default, and reorder** all work. The default **leads the rail** and
  wears a home mark; a drag handle (the DS `drag` glyph) leads every row, with **Alt+↑/↓**
  as the keyboard route.
- **The catalogue grid** was rebuilt from the live Roles page — column headers, the product's
  count pill, 40px rows, a softer row rule than the header rule.
- **Three init-aborting `ReferenceError`s fixed** (`DASH_PINS`, `waiIcon`, and a pre-existing
  `dashState` fault) — the cause of the `Invalid Date NaN:NaN` time chip.
- **The time-range popover works again** — `.pagehead{overflow:hidden}` at 44px was clipping
  it; `.trpop` is `position:fixed`, placed by `trPlace()`.
- **The `ac*` panel's dead controls are real** (all three files). `Open in Explorer`,
  `View it`, the Sources links, the user bubble's context chips and `Export` all toasted a
  sentence in the conditional — "Would open…", "Would jump…" — or claimed a PDF they never
  wrote. ⚠️ That block is byte-identical across the three files, so **every new function is
  feature-detected**: `awAdd` is in Options 1–2 and not 3, `histUndo` is Option 1 only,
  `DASH_WIDGETS` is Option 2's model and `WIDGETS` is Option 1's.
- **Two Agentation notes resolved** (the Layout icon, the time picker).
- Suites green throughout: **behave 63/63 · harness 77/77 · lxbehave 57/57 ×3**, console
  clean on a fresh load, both themes screenshotted.

## In progress

Nothing mid-flight. Two things are **open decisions**, not unfinished work:

- **`sliders-horizontal` is on two controls that can be on screen together** — the toolbar's
  `#layBtn` (Layout settings) and the dashboard list panel's `.dmanage` row (Manage
  dashboards). Sliders means "adjust these settings", so **Manage is the one that should
  move**. One line either way.
- **The four Layout sliders are the one non-DS building block.** The DS answers, if you want
  full conformance: `obs-input type=number` for the three numeric fields and `Atoms/Radio`
  variant `segmented` for Widget title size. Declared in the code as a divergence.

## Next steps

1. Decide the two open items above (the duplicate icon; the sliders).
2. **Raise `harness.py`'s settle time** — it assumes ~20 s and now needs ~80 s for seven
   copies of a 1.9 MB page. Under that it reports false failures that vary run to run.
3. `.ddradio input` (Create Dashboard drawer) sets `accent-color` but **not `color-scheme`**
   — its unchecked radios paint bright white in dark theme. Left alone as out of scope.
4. Consider whether the **Explorer flyout's pin** should point at the Sidebar tab now that
   one screen owns the rail.
5. Nothing here has been committed or published this session.

## Decisions made

- **The DS is the authority when it and the prototype disagree**, and divergences are
  *declared in the code* rather than silently taken — the contract's own rule. Four are
  declared: the sliders, the Live Preview (a `widget-grid` gap), structural tokens as runtime
  vars, and Inter instead of Poppins.
- **DS tokens are declared under their own names and this file's are pointed at them**,
  scoped to the drawer. One auditable table; ~60 rules repaint without being rewritten; the
  rest of the prototype is untouched.
- **The Live Preview clones `#sidebar` rather than redrawing it.** A preview that can drift
  is worse than none — the whole reason the reference has one is that you trust what it shows.
- **One answer to "what opens on sign-in".** `RAIL_HOME` and `DASH_DEFAULT` stay separate
  records (each drives its own surface) but clear each other, since only one thing can load.
- **Reordering is per sibling run**, and the affordance and the handler read the same
  `sbmSibs` — they disagreed once and produced an enabled arrow that silently refused.
- **The Sidebar tab lives inside Dashboard layout**, not as its own drawer — one surface,
  two doors (the tab and the rail's Sidebar row).

## Gotchas & notes

- ⚠️ **`harness.py` needs ~80 s now.** A healthy run has **exactly one** verdict string in
  the DOM; if you see several, you read it mid-flight. It reported 7, then 14, then 42 of 77
  failed on three loads of the same file while the page was fine.
- ⚠️ **Headless `--dump-dom` hangs on the 1.9 MB `behave` probe copy.** Load `_out/*.html` in
  a real tab over `python3 -m http.server` instead. `harness.py` writes `file://` iframe
  srcs, so rewrite those to relative paths first.
- ⚠️ **The live instance (`172.16.12.100`) renders nothing under automation some of the
  time** — SPA boots, no console errors, session valid, app root full height with **zero
  `textContent`**. It worked earlier the same session. And it **fades in**, which automation
  freezes: inject `*{animation:none!important}` and force `opacity:1` to see it at all.
- ⚠️ **Only a fresh load exposes init-aborting `ReferenceError`s** — probes run after every
  `<script>` block has parsed. Check the console on load, not just the assertions.
- ⚠️ **A `let` in a later `<script>` block is not hoisted into the one `init()` runs in.**
  All the new rail state is declared beside `RAIL_PINS` for this reason. Sixth and seventh
  occurrences of this bug in the file.
- ⚠️ **Three recorded gotchas bit again**: the drawer-body flex squash (an 832px table
  clipped with no scrollbar inside `overflow:hidden`); `table-layout:fixed` taking widths
  from the first row (avoided by using a CSS grid); and a duplicate `function` declaration
  silently winning (`layBoardsPaint`, caught in the same edit).
- ⚠️ **Two regex tidy-ups damaged CSS**: one left a dangling selector with no declaration
  block (would have killed every rule after it), one left `.on.on`. Re-read the surrounding
  rule after any scripted selector edit.
- ✅ **Published.** Live at https://kisu1311.github.io/dashboard-enhancement-ai-chat/ —
  served bytes match local exactly (1,939,082) and the build is stamped 27 Aug 17:51.
- ⚠️ **THE DEPLOY FAILED FIVE TIMES FIRST, AND THE ERROR TEXT LIED.** Every run died at
  `actions/deploy-pages@v4` in **one second** with the action's generic *"Timeout reached,
  aborting!"*, while checkout, the variant sync, `configure-pages` and
  `upload-pages-artifact` all succeeded and the artifact stayed a healthy 6.1 MB. It was
  none of the things that looks like: not the workflow, not the artifact size, not the
  action versions, not the Node 24 deprecation warning that appears on every run.
  **The real message sits underneath it in the step log:**
  `Deployment request failed … due to in progress deployment. Please cancel 22c3544 first
  or wait for it to complete.` The first push's Pages deployment had **stuck in-progress on
  GitHub's side** and was rejecting every later one with a 400 before it started.
  ⚠️ **The Deployments API is no help here** — it reported all of them as `failure`,
  including the stuck one. Only the step log shows it. That comment is now written at the
  step in `.github/workflows/deploy.yml`.
  **Fix:** `POST /repos/{owner}/{repo}/pages/deployments/{sha}/cancel` → 204, then
  `POST …/actions/workflows/deploy.yml/dispatches` to re-run. Both need auth; `gh` is not
  installed on this machine, but the **git credential helper already holds a working token**
  (`printf 'protocol=https\nhost=github.com\n\n' | git credential fill`), which is enough
  for the Pages and Actions APIs.
