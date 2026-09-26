# Handoff — 2026-09-26 (latest)

## Latest — Settings moved into its own page, `setting.html`

Request: *"create a new `setting.html` for the Settings module and move all Settings options,
sections and content into it."* Asked two questions first; answers: **standalone page reached
from every option's Settings doors**, and **the code inline in `setting.html` with `setting.js`
deleted**.

- **`setting.html`** = a copy of `index.html` (Option 1's sidebar and host helpers) + the whole
  module inline (stylesheet, `#view-settings` markup, all `st*`/`stc*`/`dp*`/`ag*`/`lic*` code),
  booting on Settings. Deep links: `setting.html?from=<page>#st=<category>|<page>`.
- **`setting-nav.js`** (new, 48 KB) = `ST_TREE` + `ST_ICO` (one copy, also loaded by
  `setting.html`) + the doors: on every option page `stOpen` / `stInit` / `showView('settings')`
  navigate to `setting.html`, and `#m=` / `#v=` bring you back to the module you picked there.
- All 14 option pages load `setting-nav.js` instead of `setting.js`; the Agentic AI configure
  drawer markup left the nine pages that carried it. `setting.js` is **deleted**.
- `_sync_variants.js` skips `setting.html` (not an option). `stbehave.py` now tests only
  `setting.html`; `dsconf.py` / `licconf.py` default to it.

⚠️ **Open follow-up:** `setting.html` still carries Option 1's dashboard / Log Explorer / AI code
unused (3.4 MB) — so Option 1 sidebar edits must be made in both `index.html` and `setting.html`
until the dead views are stripped. Full notes: `CLAUDE.md` → *"Settings moved into `setting.html`"*.

# Handoff — 2026-09-25

## Latest — Settings › Discovery Settings › Discovery Profile, cloned from live 10.0.1

The live Discovery Profile flow is rebuilt in `setting.js` (all fourteen pages): the list (66
scrubbed rows, vendor marks, chips, column chooser, ⟳ run, ⋮ Schedule/Edit/Delete), the delete
confirm, the Schedule drawer, the full-page Create/Edit form (type rail · field form · help card ·
Save and Exit / Schedule / Reset / Run), the Result page and the Create Credential Profile drawer.
Full notes and the list of **stated divergences** (Run is inferred, ~17 type forms modelled on a
sibling, only the Linux help card harvested, results synthesized, credential Test canned) are in
`CLAUDE.md` → *"Settings › Discovery Settings › Discovery Profile"*. Probe `dpprobe.py` 25/25.
Not committed. **Credential Profile (the category's other page) is still the stub** — next obvious
step if wanted.

## Earlier — 2026-09-22

## Latest — the header icons' hover was pointing the wrong way

Request: *"in header the icon hover color is bad make to improve using the ObserveOps design
system & using [the] color palette library"*. **One rule and one token pair**, Option 1 only.
Full reasoning in `CLAUDE.md` → *"The header icons' hover moves AWAY from the header"*.

⚠️ **`--hover` IS THE ROW-HOVER TOKEN AND THESE ARE FILLED CHIPS.** It is this file's copy of
the product's `--left-menu-hover-bg`: it takes a row with **no fill** to a faint mark. On an
already-filled chip it sends the fill back toward the page, so the button **faded out at exactly
the moment you pointed at it** — in **both** themes, measured against `--header`:

    dark    rest #2b394f 1.63:1  →  was #101d30 1.12:1   (93% of the way back to the header)
    light   rest #e7ecf4 1.19:1  →  was #f0f4f9 1.10:1
    now     dark 1.63 → 2.68     light 1.19 → 1.27

⚠️ **THE DS COULD NOT ANSWER IT — AN ELEVENTH 0.1.166 DEFECT, now in `_ds/README.md`.**
`get_component('button')` routes this control exactly (*"quiet utility in toolbar →
neutral-lightest"*, *"icon-only → icon button"*) and documents the hover as *"bg darkens"*, but
the shipped bundle defines `.v-neutral-lighter:hover` and `.v-neutral-lightest:hover` **nowhere**
(0 each) and never references `--neutral-button-hover-bg` — so the catalogue's most-used variant
(**320×**) has **no pointer feedback at all**. That unreferenced token is `rgb(70,70,70)` in dark,
an off-ramp grey in an all-navy theme, and *lighter* than its own resting fill in light.

⚠️ **SO THE VALUE IS THE PRODUCT'S OWN NEXT RAMP STEP**, and one token carries it in both
themes — **`--pan-btn-border`**, the pan buttons being the product's own small icon-only overlay
controls whose fill `--pan-btn-bg` is already `#2b394f`, i.e. what this chip rests at:

    --chip-hover    dark #485975    light #dee5ed

one step FURTHER from the page than `--tag-bg-color` in each theme. **A new pair was honest, not
lazy**: nothing already here is one step away in both (`--track` is right in dark and a slab in
light), and one `color-mix` percentage cannot serve both, because the light chip starts far
closer to its page than the dark chip does to its own.

⚠️ **LIGHT'S STEP IS THE SMALL ONE AND IT IS THE THEME, NOT THE PICK** — ~0.17 of luminance
between `--chip` and white to work in. Side by side it reads against its resting neighbours at
1.07:1, confirmed from the painted pixels. `--chip-hover` is the one dial.

**Verified:** a **22-assertion probe that reads the CASCADE** (exactly one rule sets this hover,
it names `--chip-hover`, no stale `--hover`, `.btn:hover` still less specific), with the hover
forced by a stand-in class at **equal specificity** so source order decides as `:hover` would —
**ALL 22 PASS**; screenshots dark/light × old/new with the middle button hovered.
⚠️ **Two of its first failures were the probe's own:** `.pagehead` paints **no fill**, so
`backgroundColor` is `rgba(0,0,0,0)` and every ratio was measured against **black**. Walk up to
the first opaque ancestor before computing a contrast against "the background".

## Read first

**Thirteen requests in one sitting, all Option 1 (`index.html`)** — the Edit-group drawer, the
group ⋮ menu, Ungroup, a new Header pattern feature, and a broad clean-out of the dashboard
header. Everything is in `CLAUDE.md` under **"The 22 Sep 2026 pass (later)"**, and every change
site carries its own comment.

⚠️ **TWO RECORDED DECISIONS WERE REVERSED ON REQUEST, and both old notes are rewritten in place
with a warning rather than deleted:**

- **Transparent is a row of the Header colour list again** (it was pulled out into a checkbox on
  19 Sep). The cost is real and is the price of the move: a checkbox OVERRODE the colour, so
  unticking brought back what you had picked; a row REPLACES it.
- **Layout settings is a row of the ⋮ actions menu again** (it became a toolbar button on
  27 Aug). Its `dmAct('layout')` branch had been kept unreferenced against exactly this — and the
  row is BETTER than the button was, because it opens the drawer on a NAMED board.

## What changed

    index.html    the drawer (banner out, Transparent in the colour list, one hugging row of
                  No padding | Alignment | Share, a masked Header pattern, Reset | Save);
                  four product glyphs on the group menu; gUngroup; six controls off the
                  toolbar with Share and Layout settings into the menu; 50px head; an
                  ellipsising crumb; the board flush under the time strip; three Group-tab seeds
    index.html    (later) --chip-hover in both theme blocks; .pagehead .btn.ico:hover
    _ds/README.md (later) the eleventh 0.1.166 defect, with its measurements
    CLAUDE.md     two new sections
    HANDOFF.md    this file

**Options 2—14 are untouched** and keep the old toolbar, the old drawer and a menu of bare text.

## The two things worth carrying forward

### Ungroup — the report was about what it LOOKED like, and it was measured first

        ['Application Performance'(11), 'New group'(0)]  ungroup the first
        click 1  —>  TABS=['New group'] widgets=[11]     one header still on screen
        click 2  —>  TABS=[''] ungrouped=true            flat

The band WAS dissolved on the first click — its widgets merged into the neighbour, which is what
Ungroup has always meant here. The neighbour was **empty**, so the reader saw the same eleven
widgets under one header with a different name.

⚠️ **AN EMPTY BAND CANNOT BE WHAT KEEPS A BOARD GROUPED.** If every other band holds nothing they
are drop areas, not content, so dissolving the one band with widgets flattens the board. A board
with widgets in two bands is untouched. **Cost, stated:** the empty bands go with it, one undo away.

### The header pattern is a MASK

⚠️ **A `background-image` CANNOT BE TINTED.** A data-URI pattern would carry baked-in ink and be
wrong in one theme. `.ghead.gpat::after` masks with `--gp` and paints `--gp-ink` (white dark /
black light), so the theme is the cascade's job and there is no JS. The path inside the URI is
`#000` at full alpha **because a mask reads alpha** — that is not the pattern's colour.
⚠️ **`encodeURIComponent` ON THE WHOLE SVG.** One string has to be safe inside a CSS `url(...)`
AND inside an HTML `style="..."`; a partial escape breaks one of the two silently.
⚠️ **THE 14px SWATCH IS A PREVIEW OF THE SHAPE, NOT THE INK** — a chip is a `background` and
cannot be masked, so its path is a neutral `#888`.

## Measured, and it did NOT reproduce

⚠️ **THE TRANSPARENT HEADER IS STICKY AGAIN — A SECOND REPORT ASKED FOR IT.** The first
read as *"it is fixed and widgets show through it"* and did not reproduce (below); the second
said plainly *"the header position fix in scroll time ... and don't overlay the header on
inside widget"*. Both are met by painting `--bg` instead of `transparent` and leaving `sticky`
alone — the canvas colour is what shows through a transparent strip at rest anyway, so it
looks the same standing still and hides the widgets once stuck. **`background:transparent` is
the one value that makes the two requests contradict each other.**

⚠️ **THE ORIGINAL MEASUREMENT, KEPT:** Reported as *"when i select transparent with no
padding the header title will be set fix when i scroll"*. At 1600×900 scrolled 420px, every
combination: plain header `sticky` with 3 widgets hidden behind its own fill (which is what sticky
is for); **Transparent, Transparent-as-a-colour, Transparent + No padding and the option-2 band all
`position:relative` with ZERO widgets overlapping.** That early return is gone now; what replaced it is above.

⚠️ **ONE THING THE SAME RUN FOUND AND IS UNEXPLAINED:** with **No padding and a FILL**, a hit test
at the sticky strip's left and right ends lands on a widget's `svg` and on a `.wrzE` grip rather
than on `.ghead`; the padded control returns `ghead` at all three samples. The boxes are identical
(68..1585 against a section of 67..1586), so it is paint order, not geometry. Not chased.

## Verification

    grpdrawer.py   ALL 48 PASS
    hdprobe.py     ALL 33 PASS
    seedprobe.py   ALL 15 PASS
    lxbehave       ALL 57 PASS
    ungprobe.py    measured — one click flattens; the three-band case unchanged
    stickprobe.py  measured — the table above
    node --check   clean
    harness query  ALL 77 PASS × 16 pages, all seven resolutions — see the note below
    hovprobe.py    ALL 22 PASS — the header hover, read through the cascade

Screenshots in the scratchpad's `shots22/`, dark and light, each painting its own measurement into
a badge: Mesh over Blue, Dots, Waves over Transparent, the drawer, the ⋮ menu, the Group tab, the
scrolled board with no gap.

## Open — carried forward

- ⚠️ **THE LAYOUT HARNESS PASSED, AND IT WAS RUN OVER EVERY PAGE RATHER THAN ONE.**
  `harness.py ... query` reports **ALL 77 PASS** on `index.html` and on the other fifteen pages
  — the 50px header and the board's new 14px scroller MARGIN change vertical geometry at all
  seven resolutions, so the whole set was checked rather than the one file that moved.
  ⚠️ **Read the verdict out of `_out/h-<file>-query.html` under `--dump-dom`** and take the LAST
  `ALL n PASS` match; the script's own stdout only says a PNG was written.

- ⚠️ **UNDO AND THE OUTLINE ARE KEYBOARD-ONLY ON THIS PAGE NOW.** Nothing on screen announces
  either; the `?` sheet is where they are written.
- ⚠️ **THE ⋮ MENU HAS GLYPHS AND THE WIDGET ⋮ MENU DOES NOT.** They are on the same board. Its
  seven rows need seven more glyphs, three of which the product set has no name for.
- ⚠️ **`layer-group` ON Ungroup IS A STATED READING** — the product set has no ungroup mark, so
  that row names the OBJECT where the other three name their verb. Lucide's `shapes/ungroup` is
  the swap if a stroke glyph beside three fills is acceptable.
- ⚠️ **The board's top gap is 14px and does NOT scroll** — it is a margin on `.pagebody`, i.e.
  outside the scroll container. `#dashGrid`'s padding and `.pagebody`'s own must both stay 0, or
  the 17 Sep sticky-header fix is undone.
- ⚠️ **The drawer footer is `Reset ⋮ Save`** — the primary sits LEFT of the secondary, the
  opposite of this file's convention everywhere else. Asked for twice in one message.
- ⚠️ **Title size is alone in its row now**, so it shares a WIDTH with the Share switch but not
  a right edge. The request named the width.
- ⚠️ **The Group tab's three rows are SEEDS on other boards** and the registry is still
  session-level — a reload restores exactly those three.
- ⚠️ **COMMITTED AND PUSHED — `1984c04` on `main`, and it is LIVE.** That one commit carries
  everything that had accumulated uncommitted across the last three sessions: the header hover,
  the Edit-group drawer, shared groups, the colour dropdown's Custom row, Free Text, Ungroup, the
  toolbar clean-out and Option 13's pin-tooltip. Verified after the deploy: the served
  `index.html` is **byte-identical** to local (`md5 f2413478d9876e3a6be35d46ed7f258d`), the rule
  is live, `_ds/` and `setting.js` load, and `agentation-embed.js` 404s as it should.
  ⚠️ **The push is what publishes** — Pages deploys from `main`, so there is no branch to merge
  and the first fetch after a push can still serve the PREVIOUS build for ~12s. Poll until the
  content changes, not until the URL returns 200.
  ⚠️ **A 2.4 MB response streamed straight into `grep` came back EMPTY twice** on a file that
  plainly contains the match. Download it to a file and grep that — which is also what proved
  the md5.
- ⚠️ Still standing from before: `#licHistDr` is in `setting.js`'s dark token opener and not the
  light one; a note still draws the `today` time chip; named colours and the picker store different
  things (a name is theme-aware, a hex is not).


## 25 Sep 2026 — Option 1's dashboard header is the live product's, as it is

- **`index.html` `#view-dashboard > .pagehead.lhd`** is the live bar from
  `https://172.16.12.100/dashboard/112669747490` (build 10.0.1), measured in the user's Chrome session and
  rebuilt part for part: circled › · divider · dashboard glyph · 20px/500 title · star · the
  `[today] | Today ⊗` chip · two absolute stamps · Full Screen · Export · ⋮. Colours are the DS tokens the
  live bar resolves to, per theme, as `--lh-*` on the header. Full account in CLAUDE.md, *"The dashboard
  header is the LIVE PRODUCT'S"*.
- ⚠️ **Gone from the header, by copying it faithfully:** Public badge, Groups ▾ (the canvas navigator is
  the only door to `openGroupMenu` now), ‹ › stepping, the ⟳ control, the keyboard button. **Auto-refresh
  still runs at 30s with no control on screen** — `rfMs` is the dial.
- ⚠️ **The chevron glyph is chevron-RIGHT, so `.flip` means "no transform"** — the inverse of the old rule.
- ⚠️ **UNCOMMITTED with the rest of this session's index.html work** (the "What can I do for you, Kishan?"
  greeting, the Free Text 2×2 panel, Vertical → Header) — publish when asked.
- Harvest traps, recorded in CLAUDE.md: the devtools MCP cannot open the self-signed host; the
  claude-in-chrome tab is hidden so the SPA never fades in until animations are killed; its content
  filter blocks `key=value;` strings — return JSON in <1,000-char chunks.

- **Monitor module (`Monitors`) has its own view now — `#view-monitor` — carrying the live product's
  two header rows** (tab strip of the 17 types · Search + Columns/Tags/PDF/CSV/Filter squares), measured
  off `/inventory/All/groups`. The grid under them is still the placeholder card. The `--lh-*` tokens and
  the circle / divider / square controls now live on **`.lhtok`**, shared by both headers. Flyout rows
  for Monitor types set `MOD_SUB` so the tab you clicked opens. CLAUDE.md: *"The Monitor module's two
  header rows"*. Uncommitted with the rest.
