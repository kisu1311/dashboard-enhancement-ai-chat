# Handoff — 2026-09-11

## Read first

In `CLAUDE.md`, four sections carry everything this session touched:

- **"Options 10, 11 and 12 — the rail + flyout family"** — the family's whole record, now with
  two new subsections: **"Option 12's Explorer menu became a plain list (11 Sep 2026)"** and
  **"Option 13 — a byte copy of Option 12 (11 Sep 2026)"**.
- **"Pages (variants)"** — the option table is now **thirteen** rows, and the lineage warning is
  the thing most likely to bite next: **Option 13 is a copy of OPTION 12, not of Option 10**, so
  `mf*` / `sbNotif*` / `RAIL_TMP` / `railPin*` and the rail CSS now exist in **four** files with
  nothing syncing them.
- **"Their shortcuts are LETTERS"** — `VS_LETTERS = ['x', 'z', 'c']`, and the rule for adding a
  fourteenth.
- The Option 10 entries for the **self-drawing Ask-AI border** and the **Explorer grid's heading**.

## What happened today

### Option 12 — the Explorer menu became a plain list

Eleven narrow requests turned Explorer's flyout from a two-card master/detail **grid** into **one
flat list in one card**, matching Alert's. In order: the grid interception removed from `mfOpen`
and the click path → the chevron column removed → `MF_TREE_HIDE = { Explorer: ['Monitor'] }` →
the child pane removed → the card repainted on `var(--sidebar)` → `.mfcards` dropped so the
geometry matches Alert's → **each module's children rendered inline beneath it** as `.mfi.sub` →
**the module glyph restored** on those rows only.

- **`Topology` went 5 tabs → 6.** A second supplied screenshot of the same tab bar shows `Custom`.
  The 9 Sep comment in `EXPLORER_TREE` argues at length that `Custom View` is *not* a tab; the tab
  bar wins, and the comment is kept as the record of why it looked otherwise.
- **The inline children close a gap the child pane opened** — with the pane gone, Topology, NCCM,
  APM and Flow had nowhere their children were listed. No caret, no count, no pin, no DOCS chip.
- **The glyph is a scoped exception, not a reversal** of the 10 Sep *"remove the sub module popup
  icon in every where"*: `MF_TREE_ICONS = ['Explorer']` sets `.mficons` on the master column, and
  **Alert and Settings still emit eight resolvable `.mfic` each and paint none** — measured.
- **The children had to re-indent with it**, 24px → **31** = 9 (row padding) + 15 (`.mfic`) + 7
  (`.mfi`'s gap), or a child would have sat *left* of the module it belongs to.

### Option 13 — a byte copy of Option 12

`dashboard-rail-flyout-alt3.html`, title *"Rail & Flyout (alt 4)"*, switcher key **`C`**. Only the
title, the identity banner and the switcher entry differ. Registered in `_variants.js` (label
hand-set to **Option 13**; `node _sync_variants.js` would have called it `V13 · …`) and in
`_verify/lxbehave.py`'s `FILES`. `_verify/dsconf.py` needed nothing — it takes its target as an
argument.

### Option 13 — every popup is Option 9's docked column

Three requests converged on Option 9's column as the reference. Every card `#mflyout` draws
(Alert, Explorer, Report, Health) is now **docked flush to the rail, full height, 296px**: a bold
name over a derived count with a `DOCS ↗` chip, Plain-style rows, and — resting on the floor
— the foot (rocket · `?` · layout), the *Next steps* card and the licence line. **No search field.**
The **pinned Monitor** card is head + rows only, and so are **Alert, Explorer and Report** (`MF_NO_TAIL = ['Alert', 'Explorer', 'Report']` — each asked for explicitly, one card at a time). **Only Health still carries the tail.** **Alert's NetRoute / APM / RUM show their two views inline**, like Explorer (a data change in `mfTreeFor`; the inline renderer was never Explorer-only). **Every sub-module row is 13px/600**; Explorer's children are 12px/400. **Alert's and Report's rows paint no glyph** (`MF_NO_ICONS = ['Alert', 'Report']` → `.mfnoic` on the flyout, set by every opener); Explorer and Health keep theirs. Four per-menu tables now: `MF_TREE_HIDE`, `MF_TREE_ICONS`, `MF_NO_TAIL`, `MF_NO_ICONS`. The count line is **10px/600**, the pinned band is **split in two** — the shipped `Monitor` sits under Dashboard, what you pin yourself lands between Explorer and Report (`RAIL_PINS_HOME` / `PIN_UNDER` / `PIN_ADD_UNDER`; Options 10–12 keep one band under `Dashboard`) — and the card title, count and licence line all start on the rows' own left column (`.mfhd` pad 20 = 8+1+11). The **pinned-row card's title carries a pin** (that card only — it unpins in place and the card closes with its row), **except for a row Explorer does not list**: Monitor ships pinned and has no row to be pinned back from, so it gets none (`MF_TREE_HIDE.Explorer` is the gate). A **pinned rail row carries no pin mark** any more (the label spans the row instead; rows with children keep their chevron). When the rail **runs out of room**, the footer folds What's new · Approval · Health into one `#sbMore` control with a popover (`railFootFit`, triggered by overflow with explicit hysteresis). The list **fades at both ends while it scrolls** (`.mftop` / `.more`, offsets measured onto the card as `--mflt`/`--mflb`). The **rail is one 10px rhythm** (the utility block's 4px/6px group separation is gone, both states). The column's **two edges carry the same 20px inset**, its **left-hand shadow is clipped** (`clip-path`), **hovering the rail anywhere** reveals the expand glyph, and **clicking an Explorer sub-module** drops it on the rail between Explorer and Report until you leave (`railTmpGo` — the temporary row had been unreachable since the grid stood down), and the head's trailing control was replaced by the **`DOCS ↗` chip** — which matters, because with the foot gone from Alert / Explorer / Report the chip is their only documentation link. `Setting` still opens no
column (`MF_NO_HOVER`). Details and the traps in CLAUDE.md under *"Option 13's popups are Option
9's column"*.

### Verification

- Option 12's inline children: **13 assertions ALL PASS** — Topology lists six, 15 of 15 children
  render under their own parent, none carries a pin, chip or glyph, a child navigates via `mfGo`.
- The restored glyph: **14 assertions ALL PASS** — 9 of 9 visible at 15px on one column (x=269),
  labels and all fifteen children on one column (x=291), the row box unmoved at 259, Alert and
  Settings at **0 of 8** visible with their rows still at x=269.
- Explorer vs Alert geometry re-measured **IDENTICAL** on all thirteen fields after the rows
  were added.
- Option 13: **16 assertions ALL PASS** over real http with real filenames, including **`C`
  navigating for real** and **⌘C / Ctrl+C not navigating**.
- Option 13's cards: **ALL 77 PASS at 857px and at 497px** — five docked columns' geometry, head,
  rows, tail-on-the-floor (or none, for Monitor), list scrolling, and every control on a stub;
  Options 10/11/12 untouched.

## In progress

**Nothing is committed.** `git status` shows `?? dashboard-rail-flyout-alt2.html`,
`?? dashboard-rail-flyout-alt3.html`, `M dashboard-rail-flyout.html`, `M _variants.js`,
`M _verify/lxbehave.py`, plus `CLAUDE.md` and this handoff. All of it is verified — it needs
`/publish`.

`lxbehave` across all thirteen pages: **ALL 57 PASS × 13**, Option 13 included.

## Next steps

1. `/publish` — Options 10, 12 and the new 13, plus `_variants.js`, `lxbehave.py`, `CLAUDE.md`,
   `HANDOFF.md`.
2. **Option 13** — **`Setting` opens no column** even though two of the three reference
   screenshots were Setting/Dashboard columns (both in `MF_NO_HOVER`); changing which rail items
   open a card was never asked. **The tail was removed one card at a time** — Monitor, Alert,
   Explorer, Report (`MF_NO_TAIL`); **Health is the last card still carrying it** — one more name
   in that table. If it goes, `mfTail` and everything it builds (`MF_STEPS`, `MF_NS`, `.mfft`,
   `.mfns`, `.mflic`) become kept-and-unreferenced.
   The pinned **Monitor** card has no row glyphs (the 18 monitor
   types have none in this file). Option 9's *section folds* were not ported — no card here has a
   second section.
3. **`.mfsidebar-icons-on` is still applied nowhere**, deliberately. Consequence, stated rather
   than left to be discovered: in Option 12's Explorer list a **module row and a page under it now
   share weight 500 and colour `rgb(202,211,226)`** — the glyph and 13px-vs-12px are the whole
   difference. Re-arming that class would restore a 600/`--white` parent weight; it was not asked
   for, and it reopens a title/row contrast settled on 10 Sep.
4. **NCCM's child count** — flagged when Option 10's list was built and never chased: the supplied
   reference shows `2 ›` on NCCM and the list shows no count. Decide whether counts belong at all
   (the standing rule for this menu is "everything shown by default, no expand/collapse icon").
5. **Option 10 was deliberately NOT given Option 12's list.** It still has the chevron column, the
   Monitor row, the child pane, `.mfcards` and live collapsed-rail hover gates. That divergence is
   intentional — do not "fix" it without being asked.
6. Still open from 10 Sep, untouched: the two Gemini traits not copied (292px width, borderless
   edge); Option 11's footer ordering What's new first; `#notifPop`'s caret and `--pop` white in
   Options 10 and 11; the differing What's-new tooltips.
7. **Scrub before the next public push**: this folder still ships internal hostnames and `172.16.x`
   addresses from before today (SNMP/cluster/NCCM tables, Option 1's AI starters). Nothing new was
   added today — but **Option 13 is a copy, so it carries its share**.

## Gotchas & notes

- ⚠️ **A selector scoped to a parent is a claim about where the element lives.** The DOCS chip
  moved from `.mfsec` into `.mfhd`; every chip rule was `.mfsec .mfsd …`, so its `<svg>` painted
  at 300×150 in black. The probe passed (the chip *was* present) — the screenshot caught it.
  Assert the paint, not the presence.
- ⚠️ **`sips --cropOffset 0 0` is treated as unset** and the crop falls back to centre. Use `1 1`.
- ⚠️ **A probe that clicks the real `stOpen` / `layOpen` never finishes** under
  `--virtual-time-budget` — `NO PROBE OUTPUT`, which reads like a broken page. Stub them.
- ⚠️ **A stale DERIVED number with higher specificity does not linger — it wins.** The child indent
  `31px` (9 + 15 + 7) survived the column's re-derivation to `40` (11 + 18 + 11); `.mficons`'s
  (1,4,0) beat the new (1,2,0) and the two label columns sat 9px apart. Dump **every** rule that
  matches, in sheet order, rather than reading the stylesheet.

- ⚠️ **`--dump-dom` OVER `http://` HANGS ON THE AGENTATION LOADER.** On `file://` it 404s and the
  run finishes; served over http the script really loads and virtual time never completes, so
  **every assertion fails at once against an empty DOM** — which reads exactly like a broken page.
  The switcher must be tested over http (its `here` is `location.pathname`), so the answer is a
  directory of loader-stripped copies **under their real filenames**. `lxbehave.py` already strips
  it; this was the same trap one layer out.
- ⚠️ **`--dump-dom` cannot observe a navigation** — but it can observe the *result*: press the key,
  let virtual time run, and dump whichever page you end up on. That is how `C` was proved, with no
  browser tools involved.
- ⚠️ **`:has(.mfic)` asks whether the element EXISTS, never whether it paints.** It matched
  Explorer's rows the whole time they were `display:none`, so restoring them changed no weights at
  all. The file already recorded this trap at `.mfsidebar-icons-on`; it caught nobody out twice.
- ⚠️ **`.mfcards` was gated on the wrong question.** Explorer's card was 332px with
  `padding:14px 44px 44px 0` against Alert's 302/6px — six measured differences from one class,
  set on `perRowDocs` as a *proxy* for "is this a master/detail tree". Naming the single cause is
  what turned "make it the same" into a one-line fix.
- ⚠️ **`MF_TREE_HIDE` filters at the renderer, never in `EXPLORER_TREE`.** That array is the data:
  `railPinRow('Monitor')` reads it to build the pinned rail tile and its hover card, and
  `mfRailFirst` reads `tree[0]`. Delete the entry and the pin renders nothing, with no error.
