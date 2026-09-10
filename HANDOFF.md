# Handoff — 2026-09-10 08:43

## Read first

`CLAUDE.md` is the durable record and it is long. Read these, in this order:

1. **"Pages (variants)"** (near the top) — now an **eleven**-option map. Options 10 and 11 are
   new, and the warning under it matters more than usual: **nothing syncs 10 and 11**, and
   Options 1, 10 and 11 all load the same `_settings-module.*` files.
2. **"Options 10 and 11 — the rail + flyout pair"** — the whole of this session's work, each
   change with what it does and why. Read the "one rule that keeps coming back" note about
   `DOCS ↗` chips vs the footer before touching any flyout.
3. Inside that: **"Verification lessons from this pair"** — five traps, three of which produced
   a passing probe on broken code.

## What we worked on this session

Option 10 (`dashboard-rail-flyout.html`) — finishing its Explorer grid, pins, per-module child
menus and AI mark — then copying it to **Option 11** (`dashboard-rail-flyout-alt.html`) and
giving that its own sidebar behaviour and footer.

## Completed

**Option 10**
- The Explorer grid closes properly: it holds the rail open while you reach it (`mfIn`), and
  `mfGridMute` stops it re-opening under a stationary pointer after `renderMenu()` replaces the row.
- A **pin per grid tile**, driving the same `railPinToggle` as the flyout, the rail band and the
  Layout drawer — one record, four surfaces.
- The **temporary rail row** (`RAIL_TMP`): picking a tile puts that sub-module on the rail until
  you leave it. Removal is *derived* (`railTmp()` asks whether its module is still open), so every
  exit drops it for free. Dashed ring, never the pin mark.
- **Hovering a pinned row lists that module's children** (`mfOpenPin`), from the same `kids` array
  the flyout's pane uses. Five modules have children now: Monitor 18, Topology 5, NCCM 2, APM 4,
  Flow 3 — Topology/APM/Flow added from supplied tab bars and corroborated in `_product-docs`.
- Alert is flat (its `sub` rows are dropped, not deleted) and shows **one footer link**, not eight
  identical row chips. The chips-vs-footer rule is now derived from the data.
- `.mfcards` replaces `:has(.mfdetail)` as the two-card gate, which un-stranded Alert's footer.
- The rail lands on each module's **first sub-page** (`mfRailFirst`); Setting resets to its first
  screen; **Explorer opens its grid and navigates nowhere** (it was opening Metric Explorer).
- The supplied **gradient star** is the AI mark everywhere (`AI_SPARK_PATH` + one shared `<defs>`),
  "Ask AI" is painted with the brand ramp, and the Ask AI / Search row lost its borders.
- The bell opens its card **on hover**; the blink was `#scrim` covering the rail.
- Pins are `--action` (#1D2A3E light / #cad3e2 dark), Tabler `pinned`, 15px at 1.25px stroke.

**Option 11** — created, registered, shortcut **X**, and given its own behaviour:
- Boots **expanded** (240px); collapsing **hides the sidebar entirely**, with `#sbOpen` on the
  canvas as the only way back. `railWidth()` returns 0 while hidden.
- Footer is **one compact icon row** (Approval · Health · Notifications · What's new · avatar),
  icon-only, names in tooltips, and tips inside `.sfoot` open **above** their button.

## In progress

**One unresolved question, and it is the reason the last three messages repeated.** The request
was *"the 'what is new' will be show upside on this icon"* with three images. What is built is a
**hover tooltip above the icon** reading `What's new` + a `10.0.1` chip — verified in place (tip at
727–755, icon top 763, centred). The teammate re-sent the same request twice, so it may instead
mean **restore the full labelled row** (`✉★ What's new 10.0.1`) as its own line *above* the icon
row, rather than folding it into the row as a 32px button. Both readings were put to them; the
answer had not arrived when the session ended.

Files: `dashboard-rail-flyout-alt.html` — `tipShow()`'s `.sfoot` branch, the `.uxnews` markup in
`.sqrow`, and the `.sidebar.open .sqrow` CSS.

## Next steps

1. Settle the What's-new question above — one of the two readings, then done.
2. Run the standing suites on the two new files: `lxbehave.py` now lists **eleven** files;
   `harness.py "dashboard-rail-flyout-alt.html" query` has not been run at all yet.
3. Option 11 inherited Option 10's `@media (max-height:780px)` What's-new rule with a `:not()`
   exemption — worth a look on a short screen now that the footer is one row.
4. Decide whether any of this session's Option 10 work should go back to Option 1. None of it has.

## Decisions made

- **The docs link is decided by the data, not by the menu's shape.** A row earns a `DOCS ↗` chip
  when it has its own `doc`; otherwise the menu gets one footer. This replaced a structural test
  that silently gave Alert eight identical chips and no footer.
- **Removal state is derived, never wired.** `railTmp()` answers "is this still true?" rather than
  being cleared by each caller, so every exit path drops the temporary row without knowing about it.
- **Tokens, not literals, for colours that invert.** The pin is `var(--action)` because the
  requested `#1D2A3E` is its light value and a hardcoded navy is invisible on the dark rail.
- **Explorer is a group, not a module**, so its rail row opens the grid instead of Metric Explorer.
- **Only existing controls in Option 11's footer** — the Magnific reference was used for the shape,
  not its contents, at the teammate's explicit instruction.
- **No width ladder for the sidebar.** 240px is rule 1's floor for an expanded sidebar; the
  responsive concession is a height one (What's new drops below 780px tall).

## Gotchas & notes

- ⚠️ **Synthetic `mouseenter` does not hit-test.** The notification blink passed a 15/15 probe. Any
  hover assertion has to use `elementFromPoint`.
- ⚠️ **A flex basis beats a width** (`.miniav` measured 20 where the rule said 26).
- ⚠️ **`location.href` is not configurable** — a probe that stubs it dies silently; test the variant
  switcher by real navigation in an iframe.
- ⚠️ **Two background probe jobs sharing one generated `probe.html` is a race.**
- ⚠️ **`.par` is the master-row weight, not a has-children flag.**
- Script block 6 fails `node --check` in these files — a pre-existing artefact of splitting on a
  `</script>` inside a comment, present in the committed baseline. Not a fault.
- Nothing has been committed or published this session.
