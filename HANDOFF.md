# Handoff — 2026-09-17

## Read first

Everything this session touched is **Option 1 (`index.html`)**, plus `CLAUDE.md`. The newest
work is the **group band** — its two header controls, dragging it, editing its header, and one
scroll bug that came out of the 17 Sep title strip. In `CLAUDE.md`, four consecutive
sub-sections carry it, newest last:

- **"The group header's own two controls, and what its ⋮ can do"** — the glyph swap, the ＋
  visible at rest, Clone group, Move up / down.
- **"A group is DRAGGED by its header, anywhere on the board"**
- **"Edit group — the header's colour, its title size, and the title itself"**, and under it
  **"⚠️ `GRP_STYLE` IS A PARALLEL ARRAY, AND TWO THINGS ABOUT IT BIT"** — read that one before
  touching anything that splices `TABS`.
- **"The scrolled board's widgets no longer show above the group header"** — the current state.

Everything above those in the file (Free Text, the DS help dialog, the sidebar swap) is
earlier the same day and unchanged.

## What is uncommitted

    M CLAUDE.md          the four sub-sections above
    M _ds/README.md      the EIGHTH 0.1.166 defect (obs-modal opens exactly once)
    M _variants.js       Option 14's row; VS_LETTERS gained 'v' BEFORE 'm'
    M _verify/lxbehave.py   FILES gained dashboard-rail-flyout-alt4.html
    M _verify/stbehave.py   discovery fixed to match the real <script> tag, not a mention
    M index.html         all of the below
    M setting.js         #cwMdHelp added to the scoped DS token block (dark + light)
    ?? dashboard-rail-flyout-alt4.html   Option 14

## The group work, and what to know about each piece

1. **The header's two controls are the product's own glyphs**, the ＋ is **visible at rest**
   and the ⋮ is not. ⚠️ `.gaddw{opacity:1}` must stay BELOW `.gact{opacity:0}` — both are
   (0,1,0) and source order alone decides it.
2. **The ⋮ menu is Edit · Clone · Add widget │ Move up · Move down · Collapse others │ Delete.**
   A row with nowhere to go is hidden, not left to no-op; the separator goes with the three.
3. **A group drags by its header** (`.ggrip`, `gDragStart`…`gDrop`) and lands through
   **`gReorder`**, which `gMove` also calls — one mover, so the menu and the drag cannot
   disagree. ⚠️ The drop indicator is an **outset** `box-shadow`: the sticky, opaque header
   paints over an inset one.
4. **Edit group** (`#drawer-gedit`) sets the header's colour, its title size and its title.
   ⚠️ One `histDo` per drawer visit, so ⌘Z reverses the whole visit; an untouched visit records
   nothing.
5. ⚠️ **`GRP_STYLE` is a parallel array to `TABS`, and both of its bugs were silent.**
   `splice` clamps to the array's own length, so a short array inserts at the wrong index —
   `gStylePad()` now runs before every splice. And `gStyleOf` used to CREATE the record it did
   not find, which undid `gEditReset`; it is a pure read now and `gStyleMake` is the write path.
6. **The scrolled board no longer leaks widgets above the group header.** The scroller's own
   12px top padding was inside its scrollport, so the sticky header pinned below it and the band
   showed widget cards. It moved to `#dashGrid`. ⚠️ **Only a pixel sample can see this class of
   bug** — the scroller clips the paint but `getBoundingClientRect()` still reads as though the
   widgets were there.

## Open, and what I would do next

- ⚠️ **The three Empty group tiles are identical and waiting to diverge.** `W_GROUP_OPT` is the
  one array; give options 2 and 3 their own `art` and the render needs nothing.
- ⚠️ **Option 2 has no widget editor at all** (`cwModal: 0`), so the Free Text create flow does
  not exist there. Flagged four times now and still unanswered.
- ⚠️ **A fresh Free Text widget is 16px / left / Gray**, not the Auto-sized centred banner the
  live product opens with. One word in `CW_FT_PRESET[0]` if that is wanted.
- **IFrame is still unwired** — the same drawer section offers it and it maps to `note`.
- ⚠️ **The group work is Option 1 only.** Options 2–14 keep the old three-row ⋮ menu, the text
  glyphs, no drag and no Edit group; `#gMenu`, `.gact` and `renderCanvas`'s header are per file.

## Verification run this session

| suite | result |
|---|---|
| the group header, its ⋮, Clone / Move, drag, and Edit group | **87/87** |
| the scroll band (before → after, with pixel sampling) | **16/16** |
| Free Text editor + DS help dialog | **48/48** |
| the widget ⋮ menu · the three Empty group tiles · the group box | **15/15 · 15/15 · 13/13** |
| `harness index.html query` | **ALL 77 PASS** (all seven resolutions, one verdict string) |
| `stbehave` | **0 of 14 pages FAILED** |
| `lxbehave` | re-run after the padding change — see below |

The band fix was checked **against the pre-change file as a control**: identical widget heights
on both (350,150,150,190,190,190,190,190,272,272,230), with `avail` and `g.scrollHeight` both up
by exactly 12, which is what makes `fitCanvas` indifferent to the move.

Screenshots (dark and light): the scrolled board with the header flush, the board at rest, the
Edit group drawer — in the session scratch dir, not the repo.

⚠️ **`behave.py` (the `ac*` chat panel) was NOT re-run** — nothing this session touched that
panel, but it is the one suite with no fresh verdict.
