# Handoff — 2026-09-08 10:35

## Read first

Three places in `CLAUDE.md`, in this order:

1. **"Pages (variants)"** (near the top) — the eight-option map. Options 6, 7 and 8 descend from
   Option 5's page; a change meant for all of them is an eight-file change.
2. **"Option 5 — the narrow rail + nav column"**, especially the run of 7 Sep 2026 bullets under
   *"Option 5 — an expand tile, and the column on the 34px pitch"* — today's work on that column,
   each bullet with its request, what changed and why, and what it implies.
3. **"Option 6 — the card sidebar" › "Option 5's 7 Sep column changes, ported"** — the map from
   Option 5's `pl*` names to Option 6's `sk*` ones, and the two places they differ.
4. **Option 8's and Option 4's port notes** — *"Option 5's 7 Sep column changes, ported"* under
   Option 8, and *"The 7 Sep 2026 column changes, ported to the docked panel"* under Option 4:
   what each already had, what came across, and the two adaptations each needed.
5. **"The sidebar UX pass — UX Planet's twelve rules"** (just above *Responsive*) — the audit
   table: which of the twelve rules each option already met, what was added under `ux*`, and the
   one rule deliberately not built (an account switcher) and why — and its **"Round 2"**
   subsection (8 Sep): the rail options brought up to the same rules, and keyboard reach everywhere.

Also still worth reading: **"An init-aborting crash on Windows and Linux, in six files"** (5 Sep) —
no probe here could have caught it — and the previous session's **"Settings › My Account ›
License"** section (unchanged today; committed and live with this push).

## What we worked on this session

A long 7 Sep session on the sidebars. The column of **Option 5** (`dashboard-nav-column.html`),
request by request from screenshots; the same set ported to **Option 6**, then Option 6's Next
steps card back into Option 5; after a publish, the set ported to **Option 8** (as the day's diff
of Option 5) and to **Option 4**'s docked panel; Option 6's active colours moved to `--action`; and
finally **a UX pass over all eight sidebars** against UX Planet's twelve rules. Nothing on the
canvas, the AI panel or Settings changed.

## Completed

- **Later on 7 Sep · the License page's second pass** (Option 1, `_settings-module.js` / `.css`):
  every region is a DS element now — the edition hero became THREE DS WIDGETS under the tabs
  (Edition · Validity with the days-left metric and a term-elapsed bar cell · Support & renewal
  from the License Guide); two earlier shapes were rejected the same day (a key-value card +
  metric list, then the header's detail-meta strip) and are recorded in CLAUDE.md; the expandable row detail is an
  `obs-banner` (metering rule) + `obs-key-value` (split) + a **nested `obs-table` with bar cells**
  (by type); section heads are `obs-toolbar`s; the chart legend is `obs-tag`s; the activation code
  sits in a read-only labelled `obs-input`; the EPS tiles carry avg/peak/util as header tags and
  the figure as a metric row. The ring, term bar, stacked bar and every raw span are gone; the two
  line charts are the one declared gap. Verified by headless shots (both themes, both tabs, the
  expanded row, drawer, modal) and JS probes; `CLAUDE.md`'s License section carries the audit
  table. **Not committed** — see git status.
- **Option 5 · rows with children carry an expand/collapse chevron** — the product's own
  `chevron-right`, at the row's right edge, visible at rest, turned down when open. Monitor and
  NCCM in Explorer; NetRoute, APM and Real User Monitoring in Alert.
- **Option 5 · Alert is a collapsible tree**, derived from `SUBNAV['Alerts']` the way Option 1's
  flyout reads it (`plAlertTree` / `plTreeFor`). Its views start folded; a parent row toggles
  instead of navigating.
- **Option 5 · the section caret is the product's `chevron-down`** (`PL_CAR`), replacing a
  hand-drawn filled triangle.
- **Option 5 · docs link, module-wise like Option 1** — a hover-revealed `DOCS ↗` chip on every
  Explorer, Alert and Setting row linking to that row's own page (with the module's page as the
  fallback), and one `<Module> documentation ↗` footer under the Dashboard, SLO and Report lists.
  No paths were added; the data was inherited from Option 1's page.
- **Option 5 · pin / unpin on Explorer rows** (`.plpin`, Option 1's `.mfpin`), with pinned
  sub-modules rendered as rail tiles directly under Explorer. It moves the same `RAIL_PINS`
  Option 1 and the Layout drawer's Sidebar tab use.
- **Option 5 · the trailing controls are one aligned cluster** (`.plend`): pin · DOCS · count ·
  chevron, with the count slot and chevron box reserved on every tree row so the four form
  columns.
- **Option 5 · the column foot, the Next steps card and the licence line**, ported from Option 6
  (`.plcfoot` / `.plns` / `.pltrial`). The column's markup changed shape for it: `plPaint` now
  writes into an inner `#plNav.plnavin`, and the three new pieces are static siblings after it.
- **Option 6 · every one of the row-level changes above** ported into its `sk*` block (chevron,
  Alert tree, DOCS chip and footer, pins and rail tiles, aligned cluster). No section-caret
  change there — its sections carry a `+`, not a caret.
- **Option 6 · the Next steps card's second row reads "Create user"** (was "Invite your team"),
  the product's own name for the job. It still opens User Settings.
- **Option 8 · the full Option 5 set** applied as today's diff (11 hunks, 9 clean, 2 hand-ported:
  the width token, and pinned rail tiles that carry a label for the hover-expanded rail).
- **Option 4 · the remainder its panel lacked**: the DOCS chip on tree-menu rows (footer kept for
  SLO · Report), the ten per-sub-module `doc:` paths its Explorer tree never had, the product
  chevron glyph, the foot row + Next steps card + licence line rendered by `mrNavPaint`, and the
  reserved slots gated on a panel having parents (Setting's `Service Level Objective BETA` clipped
  otherwise).
- **Option 6 · the active rail tile and the active row take `--action` / `--action-fg`**
  (#1d2a3e in light, inverting in dark) instead of `--chip` and `--teal`; teal stays on the rows
  that create. Consequence stated: in dark the active row's ink equals normal text, so the state
  is the fill + weight there.
- **All eight options · the sidebar UX pass** from UX Planet's twelve rules: drag-to-resize on
  every column with min/max, persistence and double-click reset (rule 9); a search field with
  `⌘K` / `Ctrl K` in the box at the top of the columns that only had an icon (rule 10); a 160ms
  slide-in on just-opened children (rule 4); focus outlines on every row/control (rule 7); a quiet
  "What's new · 10.0.1" row to the release notes where a sidebar had no bottom slot (rule 5).
  159 probe assertions across the eight files, harness 77/77 on all six columns.
- **Round 2 of the UX pass (8 Sep, on request "apply the rules in option 1 to option 8")**: the
  expanded rail is 240px in Options 1, 3 and 8 (rule 1's floor); the expanded rail is drag-resizable
  in Options 1 and 3 with the hover-collapse suppressed during a drag (rule 9); the flyout slides in
  (rule 4); the rail's Search row reads as a field when open (rule 10); and every rail row, tile,
  flyout row and panel row is keyboard-reachable in Options 1–6 and 8, Enter/Space activating and
  focus opening the rail (rule 7), re-applied after every repaint by a MutationObserver.
  Verified: 73 round-2 assertions + the 159 round-1 assertions re-run, all passing; harness 77/77 on
  the three files whose width tokens changed; Options 1 and 3 screenshotted.
- **Widths, measured**: Option 5's `--pl-nav` 224 → 264 → **280px**; Option 6's `--sk-nav`
  281 → **296px**. Both because the DOCS chip (45px, in flow while invisible) and the reserved
  count slot + chevron box clipped the longest labels (`Network Config Settings`, `Real User
  Monitoring`).
- **Verified**: Option 5 — a 78-assertion column probe, a 29-assertion Next-steps probe, the
  seven-resolution `harness … query` 77/77 (once per width step); Option 6 — the same column probe
  mapped onto the `sk` namespace, 73/73, an 8-check probe of the renamed step, `harness` 77/77.
  Both themes screenshotted for every screen touched. `CLAUDE.md` records each change under its
  option, including what each one implies.

## In progress

Nothing mid-flight. **Everything is committed and live** — through `0a339a8` (the Option 5/6
column work, the Option 8/4 ports, Option 6's active colours, round 1 of the UX pass, the License
page's third pass) and the commit after this file's last edit (round 2 of the UX pass, seven option
files); Pages served round 2's markup within a minute of the push.

## Next steps

1. **Decide on the two behaviours the chevrons imply, both recorded, neither resolved**: one
   parent opens at a time in Options 5 / 6 / 8 (`PL.sub` / `SK.sub` are single values — Option 4
   folds independently), and an open parent still wears the tinted `.on` row as well as the
   turned chevron — two signals for one state.
2. **Option 7 carries none of today's column changes** (its own `nx*` list).
3. The earlier list still stands: the `.dpanel` shadow bug in six files, Option 1's wider
   Dashboard flyout, Options 2/3 behind on flyout icons.

## Decisions made

- **Match Option 1, not invent** — every control ported this session (chevron placement, the
  DOCS chip and its hover reveal, the pin, the reserved-slot alignment) is Option 1's own pattern
  in this column's shape; the reasoning lives once, at Option 5's rules, and Option 6's notes
  point at it.
- **Pay for hidden controls in width rather than take them out of flow.** The DOCS chip stays in
  flow while invisible so labels never reflow under the cursor; the columns widened to fit, in
  measured steps, never to a margin of 1–2px.
- **Chips on tree menus, one footer on flat menus** — Option 1's own split. A per-action chip on
  Dashboard's rows would link the same page N times.
- **A real `<a>` inside the row's `<button>`** for the chip, tested in Chrome, so middle-click,
  hover URL and copy-link keep working.
- **"Create user"** over "Create a user" — the wording given, and the product's own term.
- **UX Planet's rules were audited before anything was built**, and only gaps were filled: no
  account switcher (the product has none to switch), no width changes for rule 1 (the widths were
  measured against content this week; the resize grip gives the reader the range instead).
- **The grip sits inside the column edge**, not straddling it, because three of the six columns
  clip overflow and one control must not have two widths.
- **Keyboard reach via a MutationObserver, not by editing row builders** — seven builders across
  the options would each have needed the same three attributes; one observer on the sidebar, the
  flyout and the panel covers every repaint. It watches childList only, so setting attributes
  cannot re-trigger it.

## Gotchas & notes

- **`harness.py` still reports phantom failures on an early read** — one run today said "49 of
  77 FAILED" on a page that passed 77/77 immediately before and after, with no layout change in
  between. A healthy run has exactly one verdict string; re-run before believing a red one.
- **A width probe must measure the label against its own clipper**, and must be re-run after
  every width step: 240 → 264 → 280 each surfaced a new longest label.
- **Anchor-and-replace edits need the exact on-disk text.** A CLAUDE.md insert anchored on two
  lines that read as adjacent in a filtered grep failed because they were 40 lines apart.
- **Grep before naming.** `.skfoot` was already Option 6's icon-button foot, so its docs footer
  is `.skdocf`; Option 5's foot buttons are `plTourBtn` / `plHelpBtn` / `plSetBtn` because an
  element id is a window global and `plHelp()` is a function (Option 6 carries that exact
  collision as `id="skHelp"` and survives it only because a function declaration wins the name).
- **Headless Chrome prints the DOM and does not exit** — every `--dump-dom` probe here uses
  `Popen` + `communicate(timeout)` + `killpg`, then parses. A plain invocation hangs the tool
  for its full timeout with the answer already in the pipe.
- **Medium blocks both the fetch tool and `curl`** (Cloudflare 403 on uxplanet.org). The article
  was read through the user's Chrome session (`get_page_text`); a condensed copy of the twelve
  rules is in the session scratchpad (`sidebar-rules.md`).
- **A MutationObserver callback is a microtask** — a probe that reads the rows synchronously
  after a repaint sees them unset and reports a failure on working code (seven phantom failures
  in round 2). Wait a tick before asserting.
- **Option 3 has no `body.pinned .shell` rule** — pinning its rail has never padded the canvas;
  pre-existing, not fixed. Its Search row has no keycap because `⌘K` there opens the `oa*` panel.
- **One shared edit script for eight files needs per-file anchors** — Option 8's `.plnav` rule
  carries a `margin-left` Option 5's does not, and `nxPaint` is followed by a comment, not the next
  function; both aborted the first run. Assert every anchor's count before touching a file.
- The probe scripts (`probe.py`, `probe2.py`, `probe6.py`, `probe-ns5.py`, `probe-ux.py`) live in the session
  scratchpad, not the repo; the `pl→sk` mapping in `probe6.py` is a string substitution and had
  to drop the section-caret block by hand.
