# Handoff — 2026-09-21 (latest)

## Read first

**Sixteen narrow requests in one sitting, all Option 1 (`index.html`)** — a carried-over Free Text
task plus fifteen screenshot-driven follow-ups, almost all of them about the **empty-group / Edit
group drawer** and the **Free Text widget**.

⚠️ **THE FIRST ONE WAS A LATENT BUG, NOT A MISSING FEATURE, AND IT IS THE THING TO CARRY FORWARD.**
The task was *"add edit option in free text widget"*. There was nothing to add: **the ⋮ was already
there and had been unreachable since the overlay was written on 17 Sep.**

    .widget.wft .whead{ … font-size:0 }      /* to hide the title, which is a bare text node */
    .wdots                                   /* IS the text character ⋮ — it declares no size */

So on every Free Text widget the kebab rendered as a **zero-width, invisible span**: Edit Widget,
Clone, Full screen and Remove were all unreachable. The fix is one rule
(`index.html:8517`). **The header's other children survived because each declares its own size** —
`.wgrip` 11px, `.wremove` 11px, `.wtime` 10px, `.wai` an 18px box — which is exactly why it read as
*"a note has no actions"* rather than as a CSS fault: the corner still painted a grip and a time
chip, so nothing looked broken.

**The rule: give a control a size; never lift the 0.** Any future child of that header that is a
GLYPH rather than a BOX needs the same line.

⚠️ **I BUILT A PENCIL BUTTON AS THE FIX FIRST, AND IT WAS THE WRONG FIX.** It passed 12 assertions
and was removed within the hour — *"remove edit icon because the edit option is already in '3 dot'"*.
**Fixing the affordance that was supposed to exist beat adding a second one.** `.wedit` and
`ICONS.pencil` are parked and unreferenced.

Everything is in `CLAUDE.md` under **"The 21 Sep 2026 pass — a note's actions, the group header, and
the Edit-group drawer"**. It supersedes parts of the 17–19 Sep entries above it: the widget and group
drag grips, "Title size", and what `No padding` does.

## What this session changed

    index.html    the .wdots rule; both grips out of flow with the cursor on the headers; the
                  caret as a real glyph; four `No padding` tokens; Alignment + Title size in the
                  Edit group drawer; the transparent-header sticky fix; the group navigator;
                  W_GROUP_OPT down to two tiles
    CLAUDE.md     the new "21 Sep 2026 pass" section
    HANDOFF.md    this file

⚠️ **`setting.js` WAS NOT TOUCHED THIS SESSION.** It is dirty in the tree from two sessions ago
(`#cwModal` in both scoped DS token openers). `node --check` is clean on it; that is not this work.

⚠️ **COMMITTED AND PUSHED — `9ef647d`, 21 Sep 2026.** All four files went up together, including
the `setting.js` change from two sessions ago (its diff is symmetric across the dark and light DS
token openers and `node --check` is clean, but it was not reviewed here).

⚠️ **THAT PUSH ALSO CARRIED `46dfacf`, WHICH HAD BEEN SITTING UNPUSHED** — the range was
`63daf4a..9ef647d`, i.e. the remote was TWO commits behind, not one. *"Empty group option 2"* was
committed locally in an earlier session and never pushed, so it went live with this work. **Check
`git log origin/main..main` before assuming a local commit is published.**

⚠️ **THE FORMATTING-HELP IMAGE ROW NOW HOTLINKS A SIGNED FACEBOOK CDN URL ON A PUBLIC SITE**
(`index.html`, `CW_FT_MD`). It is not an internal identifier, so the RFC 5737 scrub rule does not
catch it — but it carries a signature (`oh=`) and an expiry (`oe=`), it points at a personal photo
asset, and it is now in public git history permanently. It was raised before the push and the push
was reaffirmed. When it expires the row renders its alt text; swap in any reachable image, or put
the `data:` URI back from git.

## The requests, and what each one actually cost

| asked | what it took |
|---|---|
| the ⠿ grips: *"remove only icon don't remove functionality"* | **two passes** — see below |
| Transparent + No padding *"side by side"* | one `.gepair` row on the drawer's existing two columns |
| *"when i apply No padding … the border will be remove"* | **four declarations**, not one |
| *"remove headder below line when i select the 'Transparent' & 'No padding'"* | a fifth, gated on **both** |
| *"ADD TEXT ALIGNMENT LIKE 'FREE TEXT'"* | aligns the group's **TITLE** — `CW_FT_ALIGN` reused, no second list |
| *"THE TEXT size will be improve like free text"* | the searchable `cwFtDD` over `CW_FT_SIZE`; **the seed had to move too** |
| *"the 'down' arow & hadder text will be align"* | the caret became a real glyph |
| *"the text is show left … the center text alignment the text will be set on center"* | a `max-width` cap, and a green assertion that hid it |
| *"the arrow will be set no left margin"* | the fourth `No padding` token |
| *"option 3 empty group remove option3 only in 'Add New Widget'"* | one line of `W_GROUP_OPT` |
| *"remove the right alignment only"* / *"remove the 'Vertical alignment'"* | **picker-only** withdrawals |
| the group navigator (ChatGPT's canvas reference) | `gNav*` + its CSS |
| *"make the minimal ui visualization … when 2 group then show only 2 line"* | the mark **counts** now, and the card round it went |
| *"it will be show out side of empty group"* | the board gives up a **derived** left gutter — see below |

### The navigator: the mark counts, and then the board made room for it

Two follow-ups, and the second is the one with a cost worth stating.

**It counts.** The collapsed mark was **four fixed bars at alternating 16/11px widths inside a
bordered card** — a drawn "list" glyph — so a two-group board's mark said four. `gNavPaint` emits
`TABS.length` of them now, reading the **same array** the list below it maps, so the collapsed
count and the open rows cannot drift and every path that already repaints the nav moves the bars
for free. The alternating widths went with the count and **that is not tidying**: once a bar IS a
group, two widths claim a per-group difference that does not exist. The card's border, fill and
shadow went too — the **padding stayed**, because it is the only hit area a 2px bar has.

**Then it had to get out of the group's way.** Measured: the mark ran **70–91px** while the group
box started at **68** — it was painted on the box's border, its header fill and the first letters
of its name, on every board with more than one group.

⚠️ **THE MARK COULD NOT MOVE, SO THE CANVAS DID.** `.gnav` is absolute inside `.dwrap`, which
begins at the rail; the only room to its left was `.pagebody`'s 14px inset and the control is
28px wide. `.pagebody`'s **left padding** grows instead — and **every number in it is a token**:
`--gnav-x` + `--gnav-pad` + `--gnav-bar` (the three the mark itself reads) + `--pb-x`, which is
`.pagebody`'s own horizontal inset rather than a second `14px`. 45px today, and it follows a moved
mark, a resized bar or a changed board inset on its own.

⚠️ **`.dwrap:has(#gNav)` is exact**, because `gNavPaint` REMOVES the element below two groups
rather than hiding it — so a flat board, a one-group board and the page's other two `.pagebody`
scrollers keep their 14px with no second test. It wins on **weight**, not source order: `:has()`
carries its argument's specificity, so the id inside makes it (1,2,0).

⚠️ **CONSEQUENCE, STATED:** a multi-group board is now **31px narrower** than a flat one. At
1600 the group box still measures 1488px and nothing overflows — it is the price of the mark
having somewhere to stand, and only boards with a navigator pay it.

### The grips took two passes, and the second is the one worth remembering

Pass one deleted both reveal rules, so the span rested at `opacity:0` **keeping its box, its
`cursor:grab` and its tooltip**. Pass two removed the glyph from `WGRIP` — and **the box went with
it**:

⚠️ **`flex:0 0 auto` ON AN EMPTY SPAN MEASURES 0 WIDE.** The box I had said I was keeping was
already gone, and the grab cursor it existed to carry with it. An invisible 0px element is not a
handle, it is a leftover. **A probe assertion caught this** — nothing on screen could have.
Both grips are `display:none` now and **`cursor:grab` moved onto `.whead`** (`.ghead` already had
it), which is where the group's handle has always been. Its `data-tip` went too: a tooltip over an
invisible mark pops up when the pointer crosses empty header and names a control nobody can see.

⚠️ Removing the group grip also **re-aligned the header**, which is half of *"make the proper
alignment"*: invisible but still 8px wide plus the row's 9px gap, it was pushing the caret and the
title 19px in from the strip's edge with nothing to show for it.

### `No padding` is four declarations, and each was found by the next screenshot

    --gv-pad:0                 the box's padding — the original control
    --gv-line:transparent      with no padding the outline sits hard against the strip
    --gv-hm:0 0 10px           ⚠️ `.ghead`'s margin is the INVERSE of that padding
    --gv-hpad:8px 0            the strip's own inset, so the caret reaches the edge

⚠️ **`.ghead`'s `margin:-10px -12px 10px` IS THE INVERSE OF THE BOX'S PADDING.** At `--gv-pad:0` it
stops cancelling anything and starts pulling the strip **12px past the group's own edges**.

⚠️ **NONE OF THEM IS `border:0` OR A REMOVED MARGIN** — every one keeps its 1px or its box, so
ticking a checkbox never also moves the group's widgets by a pixel.

The header's own `border-bottom` goes **only with Transparent as well**: a title strip is a fill
plus a rule, and with the fill gone the rule is the last thing drawing it; with the box's border
gone too it is a line ruled across the canvas belonging to nothing.

### A transparent header cannot be sticky — a real bug, found on the way

Reported as *"the scroll time the header is fix"*, with the group's name painting straight across a
row of donut widgets.

⚠️ **`position:sticky` WORKS BECAUSE THE STRIP'S OWN FILL HIDES WHAT PASSES UNDER IT.** With
`background:transparent` there is nothing to hide it, so a stuck header is just floating text over
moving content. `gStyleCSS`'s `transp` branch emits `position:relative;top:auto;` — **the same one
test that removes the fill removes the stickiness**, so the two cannot disagree. `relative`, not
`static`, because `.ghead.gban::before` needs a positioned ancestor. **Centring made it obvious; it
did not cause it** — the bug predates the alignment control.

## Two consequences, stated rather than quietly absorbed

- ⚠️ **CENTRE LANDS ~62px (4%) LEFT OF THE HEADER'S TRUE MIDDLE.** The title takes 1316 of 1517px;
  the count chip and the ＋/⋮ still sit to the right. Exact centring needs the title absolutely
  positioned across the strip, which moves the count chip and puts a full-width box under the ＋ —
  **not done for 4%**.
- ⚠️ **`right` ALIGNMENT AND `Vertical alignment` WERE WITHDRAWN FROM THE PICKER, NOT THE MODEL.**
  `gAlign`/`gStyleCSS` still honour `right`; `GRP_VALIGN`/`gValign` still emit `--gv-align`. A group
  styled before either withdrawal **keeps the position it was given**. Conflating "stop offering it"
  with "remove it" is how a saved board changes under its owner. `GRP_ALIGN_OK` names the two that
  are offered.

## The two things a probe could not have told me

- ⚠️ **`.gnm`'s OWN `max-width:340px` IS WHY CENTRE DID NOT LOOK CENTRED — and my assertion PASSED
  on it.** The title's box measured 340px and the probe asked whether it was *"wide enough"*. It was
  340 because it had hit its **cap**, not because it had taken the slack, so on a 1400px header the
  words were centred inside the leftmost 340px. **Assert against the container, never against a
  number.** No failure ever reported this; the user's screenshot did.
- ⚠️ **A DEFAULT HAS TO BE A VALUE THE CONTROL CAN RENDER**, not just one the renderer understands.
  Title size showed a bare **"M"** for an hour: `gStyleOf`/`gStyleMake`/`gEditReset` still seeded
  `size:'M'` while the control now reads `CW_FT_SIZE`, and `gSizePx` degrades an unknown key to 0 —
  so the board looked right and the field was wrong. Seeding is part of swapping a control.

## Verification

    gedit21.py                ALL 92 PASS   (session scratch dir)
    navmin.py                 ALL 20 PASS   the mark counts · the card is gone
    navout.py                 ALL 22 PASS   the mark is outside the group box, the gutter is derived
    </style>  substring 1  ·  line-start 1
    comment balance           2748 / 2753 — the SAME +5 as `git show HEAD:index.html`, i.e. pre-existing
    node --check              clean — index.html's main block and setting.js
    screenshots               drawer · centred header · No padding · navigator (shut + open), both themes

⚠️ **SIX OF THE TEN FAILURES ACROSS THE RUNS WERE THE PROBE'S OWN MODEL**, each a recorded trap: the
seeded board is FLAT so `ungrouped` stays true and **no `.ghead` renders at all** unless the probe
sets it; `getBoundingClientRect()` on the section **includes its 1px border**, so every "starts at
the edge" expectation was off by exactly 1; `.gtog` adds 4px of its own padding in front of the
caret; two assertions were written against the pencil and the grip's box minutes before both were
deliberately removed; and **`awAdd` scrolls the canvas to its end**, so "at rest" after adding
widgets is the BOTTOM of the board and the navigator's mark is correctly on the LAST group.
**Read a probe failure before believing it.** Two were real, and both are above.

## Open — carried forward, and what I would do next

- ⚠️ **A NOTE STILL DRAWS THE `today` TIME CHIP** although a Free Text widget has no time range.
  Not asked for, easy to drop — one test in the header builder.
- ⚠️ **ALL OF THIS IS OPTION 1 ONLY.** Options 2–14 keep the old three-row group ⋮ menu, the text
  glyphs, no drag, no Edit group, both dashed Empty group tiles and **the invisible ⋮ on every Free
  Text widget** — that bug is still live in every other page that has the overlay.
- ⚠️ **Options 1 and 3's Empty group tiles were byte copies; option 3 is now GONE** (21 Sep). Two
  tiles remain with **identical artwork**, so the corner chip is the only thing saying which design
  you are adding — option 2's difference shows on the BOARD, not in the picture. The chip and
  `.awgopt`'s rule both go when one design is picked.
- ⚠️ **`#licHistDr` IS IN `setting.js`'s DARK TOKEN OPENER AND NOT THE LIGHT ONE** — measured two
  sessions ago, still not fixed, still out of scope (License page). Confirm first whether that
  screen has been reviewed in light with the dark panel showing; fixing it changes how it has looked.
- ⚠️ **The named colours and the DS picker store different things** — a name (theme-aware
  `color-mix`) against a flat hex. A board saved with a custom colour will not follow a theme change.
- ⚠️ **The Free Text panel's `Font Size` / `Alignment` pair is capped at 232px while the colour pair
  runs full width** — both were explicit requests, recorded rather than reconciled.
- ⚠️ **`behave.py` (the `ac*` chat panel) still has no fresh verdict** — nothing in the last three
  sessions touched that panel.
