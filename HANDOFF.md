# Handoff — 2026-09-18

## Read first

Everything this session touched is **Option 1 (`index.html`)**, plus `setting.js`, `CLAUDE.md`
and `_ds/README.md`. The work is the drawer's **second Empty group tile**, which is the first of
the three to diverge at all — and one drawer-wide hover colour.

In `CLAUDE.md` it is one new section, **"Empty group OPTION 2 — a band you resize, a banner behind
its title, and no dashed box"**, sitting after the 17 Sep group sub-sections and before
*Global AI*. Read its `W_GROUP_OPT` and `fitCanvas` parts before touching either.

⚠️ The older **"Three Empty group options in the drawer"** section is now marked
**SUPERSEDED IN PART** — its "identical" claim is true of the artwork and false of the behaviour.

## What this session changed

Nothing — this session's work is committed. The commit before it (`63daf4a`) carries the 17 Sep
group work, and the one before that Option 14 and the `_variants.js` / `lxbehave` / `stbehave`
edits, so the tree is clean.

    CLAUDE.md          the new section, plus the correction above
    HANDOFF.md         this file
    _ds/README.md      a NINTH 0.1.166 finding — every quiet obs-button variant is ~3:1 in light
    index.html         the four requests below, plus the tile hover colour
    setting.js         #drawer-gedit added to the scoped DS token block, dark and light

⚠️ **NOT PUSHED.** `origin` is `dashboard-enhancement-ai-chat` and Pages deploys from `main` on
push; say the word and it goes.

## The four requests, and what to know about each

1. **The band resizes and the widgets refit around it.** `W_GROUP_OPT` carries `rz:true` on
   option 2 only; `awAddGroup(opt)` takes the argument optionally so the `G` shortcut is unchanged.
   ⚠️ **The `fitCanvas` floor drops to `hMul * GRP_RZ_GIVE` ONLY while `.gdrop.gdrs` is on the open
   board.** Without that gate the request cannot be met on a board that already overflows — `k` is
   pinned at the floor and dragging would move nothing. Every other board keeps `hMul`, probed.
   ⚠️ `fitCanvas()` runs on every mousemove, deliberately un-throttled: rAF is starved under
   headless virtual time, so a probe could never see it.
2. **A Header banner field in the Edit group drawer**, option 2 only, stored on `GRP_STYLE` so it
   inherits undo/clone/reorder for free. ⚠️ The image is rasterised to a bounded JPEG first —
   `histState()` stringifies the whole board and `HIST.cap` is 50. ⚠️ `background:` is a shorthand
   and resets every longhand, so `gStyleCSS` emits the colour BEFORE the image.
3. **No dashed box on option 2's empty band.** ⚠️ `.dgrid12.dropinto .gdrop.gdrs` restates the teal
   drag-over border — the base rule sits above it at equal weight and would win on source order,
   and the band would stop saying you can drop into it.
4. **The attach control is the design system's.** ⚠️ `search_components('file upload')` returns
   NOTHING, so it is composed from `obs-button` + `obs-icon` over a native file input — the
   product's own My Profile pattern. ⚠️ **`#drawer-gedit` had to join `setting.js`'s scoped DS token
   block, dark and light** (a DS component outside it reads the package's LIGHT defaults — the
   `#licHistDr` trap, third time), and deliberately NOT the prototype-token re-point.

Plus: **a drawer tile's label turns teal on hover** — `#cad3e2` IS `--text` in dark and `#14b8a6`
IS `--teal`, so the request landed on two tokens. ⚠️ Scoped to `.awcard`, i.e. every tile, not only
the three Empty group ones.

## ⚠️ The finding worth carrying forward

**Every quiet `obs-button` variant is ~3:1 in light theme** — `neutral-lightest` and
`neutral-lighter` **3.01:1**, `transparent` **3.51:1**, all on their own pale fills, against
`default`'s **14.45:1**. Dark is fine for all of them. The registry's decision flow routes a
"quiet utility control" to `neutral-lightest`, which is the right *role* and an unreadable
*render* in one theme — so the banner field shipped it, measured it, and moved to `default` with
an icon-only `squared-button` Remove to keep the pair tellable apart. Recorded in
`_ds/README.md`. **Don't restore the quiet variant on the strength of the decision flow alone.**

## Open, and what I would do next

- ⚠️ **Options 1 and 3 are still byte copies of each other.** Only option 2 has diverged. Giving
  either of the other two its own behaviour is a field on its `W_GROUP_OPT` row plus a gate.
- ⚠️ **The tile artwork is still identical for all three** — the corner chip is the only thing on
  the tile that says which design you are adding, because option 2's difference shows on the BOARD.
- ⚠️ **The `.ddnote` hint under the banner field is still the drawer's tinted box**, beside two DS
  buttons. The DS's own reasoning (recorded at the Agentic AI test panel) is that a form hint
  should be plain muted text, not a tinted block — one scoped rule if that is wanted.
- ⚠️ **`obs-button` carries the catalogue-wide SF-001 focus-ring gap**, so those two controls are
  less keyboard-legible than the `.btn` they replaced. One `:focus-visible` rule if it matters.
- ⚠️ **Option 2 has no widget editor at all** (`cwModal: 0`) — flagged five times now, still open.
- ⚠️ **The group work is Option 1 only.** Options 2–14 keep the old three-row ⋮ menu, the text
  glyphs, no drag, no Edit group and one undifferentiated Empty group tile.

## Verification run this session

| suite | result |
|---|---|
| the option-2 band, banner, borders, clone/undo (`g2probe.js`) | **ALL 64 PASS** |
| the DS banner field, **dark and light** (`dsban.py`) | **ALL 42 PASS ×2** |
| `harness index.html query` | **ALL 77 PASS** (all seven resolutions, one verdict string) |
| `stbehave` (re-run after the `setting.js` edit) | **0 of 14 pages FAILED** |
| `lxbehave` | **ALL 57 PASS ×14** |

Screenshots (dark and light): the resized band with its banner on the board, and the Edit group
drawer showing the DS field — in the session scratch dir, not the repo.

⚠️ **`behave.py` (the `ac*` chat panel) was NOT re-run** — nothing this session touched that panel,
but it remains the one suite with no fresh verdict.

⚠️ **A DS probe copy MUST be written beside the source.** Built in the scratchpad it 404s
`_ds/observeops-elements.umd.js`, **no `obs-*` element registers**, and the field renders as inert
markup — the recorded "`_verify/` was silently testing a page with no design system" trap. It cost
one full run here and reported five failures that read exactly like the feature being broken.
