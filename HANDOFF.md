# Handoff — 2026-09-07 16:07

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

Also still worth reading: **"An init-aborting crash on Windows and Linux, in six files"** (5 Sep) —
no probe here could have caught it — and the previous session's **"Settings › My Account ›
License"** section (unchanged today; committed and live with this push).

## What we worked on this session

The sidebar column of **Option 5** (`dashboard-nav-column.html`), request by request from
screenshots, then the same set ported to **Option 6** (`dashboard-card-sidebar.html`), then
Option 6's Next steps card and licence line brought back into Option 5 — and, after the publish,
the whole set ported to **Option 8** (`dashboard-nav-column-alt.html`, as today's diff of Option 5)
and to **Option 4**'s docked panel (`dashboard-labelled-rail.html`, the remainder its panel did not
already have). Nothing on the canvas, the AI panel or Settings changed.

## Completed

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

Nothing mid-flight. **Everything is committed and live** — the Option 5 / 6 work in `51abeb4`, the
Option 8 and Option 4 ports in the commit after the two handoff fixes; Pages served the new markup
for both ported pages within a minute of the push. Both ports are verified (Option 8: 79 + 29 probe
assertions, harness 77/77; Option 4: 43 assertions, harness 77/77).

## Next steps

1. **Decide on the two behaviours today's chevrons imply, both recorded, neither resolved**: one
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
- The probe scripts (`probe.py`, `probe2.py`, `probe6.py`, `probe-ns5.py`) live in the session
  scratchpad, not the repo; the `pl→sk` mapping in `probe6.py` is a string substitution and had
  to drop the section-caret block by hand.
