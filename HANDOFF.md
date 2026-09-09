# Handoff — 2026-09-09 10:32

## Read first

`CLAUDE.md` is the durable record and it is long. Read these sections, in this order:

1. **"Pages (variants)"** (near the top) — the **nine**-option map. Options 6, 7 and 8 descend
   from Option 5's page and **Option 9 is a byte copy of Option 6**, so a change meant for every
   option is a nine-file change. Options 5 and 8 share the `pl*` namespace and Options 6 and 9
   share `sk*`, with nothing syncing either pair.
2. **"Option 6 — the card sidebar"** and everything nested under it. Almost all of this session's
   work is there, each change with its request, what it does and why.
3. Inside that: **"Level 3 — Explorer's grid pins, and lends the rail an icon"**, **"Iris moved
   from the head of the rail into its foot"**, **"Pinned dashboards reach this rail at last,
   before Explorer"** and **"The rail's shipped order is declared, and Explorer moved"**. The last
   one also carries the rail's single hairline.
4. **"The sidebar UX pass — UX Planet's twelve rules"** (just above *Responsive*) — the audit
   table and its **"Round 2"** subsection: which rules each option already met, what was added,
   and the one rule deliberately not built.
5. **"An init-aborting crash on Windows and Linux, in six files"** — no probe in this folder could
   have caught it, and the same class of bug is still the most likely thing to break a page.

## What we worked on this session

Option 6's sidebar (`dashboard-card-sidebar.html`), request by request from screenshots. The
session finished the user's **three-level sidebar model** — level 1 utility popovers, level 2
module to column to screen, level 3 the Explorer grid launcher — and then reorganised the rail
around it. Option 9 was created as a copy of Option 6 partway through. Nothing on the canvas, the
AI panel, Log Explorer or Settings changed.

## Completed

Everything below is Option 6 unless stated, and each item has its own heading in `CLAUDE.md` with
the reasoning and the traps.

- **Level 3 is built.** Explorer's rail tile opens a grid of its eleven sub-modules; opening one
  from the grid lends the rail that module's icon (a dashed teal ring, deliberately unlike a pin),
  and going anywhere else takes it back. The removal is **derived**, not wired to each caller: the
  tile only renders while its own module is open, so every door out drops it for free.
- **Every grid tile carries a pin**, hidden at rest and shown once pinned. It drives the same
  `railPinToggle` the column row, the rail band and the Layout drawer already use.
- **Explorer's tile navigates nowhere.** It opens the card and nothing else, so pressing a
  launcher no longer opens a screen behind it. That also fixed a tooltip painting over the card,
  and it made the card's "you are here" mark true again.
- **The rail was reorganised.** Explorer is now the **last** tile, after Setting, with the rail's
  **one hairline** above it. Pinned **dashboards** render before Explorer — which turned out to be
  a missing feature rather than a placement problem, since `DASH_PINS` was never read in this
  sidebar at all.
- **Iris moved into the rail's foot, before Health**, and became static markup rather than being
  rebuilt on every rail paint.
- **The column header reads search then collapse**, and the rail shows a search tile before the
  expand tile whenever the column is shut, so exactly one magnifier is ever on screen.
- **Earlier in the session**: the Report column's Create button and its two folding sections, the
  NOC View rows, Geo Map, the search-in-Setting-only rule, the section tiles, the column foot's
  Layout button, Next steps moved onto the rail with a hover card and a `0/4` badge, and one
  shared 12px gap for every card this sidebar summons.
- **A pre-existing bug fixed in all eight option files**: the document click handler closed any
  popover opened from a column or flyout row, so a sidebar row that opened a popover had been
  silently dead in Options 2 to 8.
- **Verified**: eight probes this stretch, 155 assertions, all passing. `lxbehave` **57/57 across
  all nine files** and `harness … query` **77/77** with exactly one verdict string, both run
  against the final code. Both themes screenshotted for every change.

## In progress

Nothing mid-flight. The code is complete and verified.

⚠️ **Nothing is committed.** The last commit is **`12c9925`**, and it is fully pushed (0 unpushed).
Everything after it is uncommitted working-tree state: all of the Option 6 work above, the new
`dashboard-card-sidebar-alt.html` (Option 9, untracked), its registration in `_variants.js`, and
its addition to `_verify/lxbehave.py`'s `FILES`.

⚠️ **`index.html` shows as modified and this session did not touch it.** The change is two extra
spaces of indentation on one token line — the IDE reformat this folder's notes record. Left alone
rather than reverted, since it is another session's editor state.

## Next steps

1. **Publish.** Run `/publish` to commit and push everything above; none of it is live.
2. **Decide what happens to Option 9.** It is a byte copy of Option 6 taken *before* the Next-steps
   rail move, so it has none of level 3, the grid, the pins, the reordered rail, the hairline, the
   moved Iris tile or the pinned-dashboard band. It also shares the `sk*` namespace with Option 6
   and nothing syncs them. Either re-copy it or let it diverge on purpose, but decide before either
   file is touched again.
3. **Decide whether level 3 belongs in the other options.** It is Option 6 only. Options 5 and 8
   (`pl*`) and Option 4 (`mr*`) have the same pinning machinery and no grid; Option 7 (`nx*`)
   carries none of the column work either.
4. **Decide whether the Manage dashboards screen gets a NOC tab**, so Option 6's "Manage NOC View"
   row has a real landing instead of the dashboards grid.
5. **Resolve the two behaviours the column chevrons imply**, both recorded and neither settled: one
   parent opens at a time in Options 5 / 6 / 8 (`PL.sub` / `SK.sub` are single values, where Option
   4 folds independently), and an open parent wears both a tinted row and a turned chevron — two
   signals for one state.
6. Standing items from before this session: the `.dpanel` light-theme shadow bug still live in
   Options 1, 2, 4, 5, 7 and 8; Option 1's Dashboard flyout still wider than the other five;
   Options 2 and 3 still behind on flyout icons.

## Decisions made

- **Derive state, don't wire it.** The level-3 tile disappears because it is only rendered while
  its module is open, not because each navigation path clears it. Finding every path and missing
  one would leave a tile claiming a screen you have left — the exact failure it exists to prevent.
- **A launcher should not navigate.** Explorer's tile opening a screen behind its own card was the
  root of three separate defects, including the tooltip that kept coming back.
- **A temporary tile and a pin must not look alike.** One arrived with the screen and leaves with
  it, one you chose and it stays. The dashed ring says "not permanent" without saying "less
  important", which it is not.
- **One offset for every card the sidebar summons** (`SK_POP_GAP` = 12). Four cards opened from one
  rail landing at four offsets was the original complaint; a shared constant makes it structural.
- **Name the entry, don't infer from the grouping.** The rail's order and its single hairline are
  declared by name (`RAIL_SEED`, `RAIL_DIV_BEFORE`). Group banding would have drawn three lines in
  the declared order, only one of them wanted. `RAIL` itself must never be reordered, because two
  lookups index into it.
- **A control that cannot be true is deleted, not parked.** The grid's "you are here" mark went
  entirely when it could never paint, and came back only once the blocker was gone.
- **Measure the token against the surface it lands on.** The rail's hairline uses `--track` because
  `--border` measures 1.27 and 1.25 contrast there — invisible, the same finding already recorded
  for the empty-group box.
- **Every removal is checked for a second door first.** Search left the rail only because the
  column header had one and ⌘K works anywhere; it came back only for the state where that header
  is off screen.

## Gotchas & notes

- **A tooltip is decided on `mouseover`, 320ms before it paints**, so suppressing it at paint time
  is too late. Anything that repaints a rail under a resting pointer fires a fresh `mouseover` and
  arms a tip against the state as it was then. Clear the pending timer when the thing it would
  cover opens, and avoid repainting the node the pointer is on.
- **Re-query after every repaint.** Two assertions failed on working code because the probe held a
  rail tile across a `pickRail`, which rebuilds `#skIcons`; the detached node's zeroed rect made
  `elementFromPoint` click the viewport origin instead.
- **`closePops()` does not close the spotlight — `closeSearch()` does.** A probe left
  `#searchLayer` over the rail and reported a working expand tile as broken. Hit-test and print
  what you actually landed on.
- **`RAIL` is indexed by `activeRail` and `MOD_TO_RAIL`**, so its order is not a display choice.
  Reorder through `RAIL_ORDER` / `RAIL_SEED`, which are lists of names.
- **`DASH_INDEX`, `MICON` and `DTYPE` live in a later `<script>` block** than the sidebar's, so
  they are in the temporal dead zone at first paint. Every read is wrapped in try/catch;
  `typeof X !== 'undefined'` is **not** a usable guard, because `typeof` itself throws on a
  `let`/`const` in TDZ.
- **A tooltip whose text ends in two spaces renders a keycap chip.** Board tooltips use `" · "` as
  their separator so a pinned dashboard is not badged with a shortcut that does not exist.
- **Splitting this file's `<script>` blocks on `</script>` is lossy** — one block's template
  literal contains those characters, so a naive split reports a syntax error in a block that does
  not exist. Pre-existing; check the block that actually holds your edit.
- **`harness.py` needs a long virtual-time budget, and a healthy run has exactly one verdict
  string.** Reading it too early reports large phantom failure counts. `lxbehave.py`'s `FILES` list
  is hardcoded — a new page must be added or the suite silently tests the old set and reports
  green.
- **Headless Chrome here prints the DOM and then does not exit.** Use `Popen` +
  `communicate(timeout)` + `killpg`, then parse; a runner that waits for exit hangs with the answer
  already sitting in the pipe.
