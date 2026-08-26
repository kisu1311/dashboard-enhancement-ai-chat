# Handoff — 2026-08-26 19:33

## Read first

Two sections of `CLAUDE.md`, in this order:

1. **"The 26 Aug 2026 pass — shortcuts popover, Layout settings, dot-matrix loaders"** —
   everything this session did, with the traps written at each feature.
2. **"The 25 Aug 2026 pass"** directly above it — the Iris naming, the neutral palette and
   the Dia/Text-Shimmer motion this session builds on. It also **supersedes** several older
   statements in that file; where anything conflicts, the newer section is current.

All work is **Option 1 only** (`index copy.html`). Options 2 and 3 untouched.

## What we worked on this session

Four features: a hover popover for keyboard shortcuts, a **Layout settings** drawer ported
from ServiceOps_Dashboard_v2, Layout added to the Manage screen's bulk bar, and three
dot-matrix loaders in the thinking row chosen by what the assistant is doing.

## Completed

- **Keyboard shortcuts popover** (`kbPop*`) — a keyboard icon in the toolbar; hover shows all
  16 shortcuts, click opens the existing `?` sheet. Built from the same `KB` registry, so the
  three surfaces can't drift.
- **Layout settings** (`lay*`) — a 520px drawer from the dashboard ⋮ menu. Title size,
  horizontal/vertical spacing and row height, with a live preview, a two-way scope
  (All dashboards / this board) and Reset · Cancel · Apply.
- **Apply genuinely changes the canvas.** The grid gap and widget title size were hardcoded
  and the Create drawer's sliders only drove their own preview; both are tokens now, and row
  height drives `hMul`. Verified: gap 24/28px, title 14px, hMul 1.571 after applying.
- **Bulk bar** — Layout settings added; opens the same drawer pointed at the selection
  (verified applying to 3/3 selected boards with the global layout untouched).
- **Archive is no longer painted red** — it is reversible; Delete forever keeps the red — and
  a hairline now separates the irreversible action from the rest.
- **Narration cross-fades** on a beat change (fade out old → swap → fade in new).
- **Three dot-matrix loaders** — Prism Bloom (thinking), Core Spiral (creating), Strobe Stack
  (log query), ported from the library's source. Pure CSS, no timers, one shared markup, one
  speed dial (`--aidot-speed`, currently 1.8).

## In progress

Nothing mid-flight — every change is applied and verified. What remains are **decisions**,
listed under Next steps.

## Next steps

1. **Decide the remaining teal.** 183 `var(--teal)` uses remain, including two more primary
   CREATE buttons on their own classes — `.ddcreate` (Create Dashboard drawer) and
   `.cwbtn.pri` (widget editor footer) — which now look inconsistent beside the neutral
   `.btn.pri`.
2. **Decide the remaining violet AI surfaces** (unchanged since yesterday): the toolbar
   `Ask Iris` pill, Log Explorer's `AI Query` / `Generate query`, the per-widget `✦` drawer,
   the canvas `.aiflash` outline, and the `ac*` panel (⌘I, `--oa*`, a three-file change).
3. **The Send glyph is still a hand-drawn dart** (`M4 12l16-7…`) though CLAUDE.md records it
   as Lucide `arrow-up`. It sits right beside the Stop button that was fixed yesterday.
4. **Fix the duplicate `id="drawer-versions"`** — two elements, different bodies; the second
   is dead markup.
5. Open questions on the new work: the four bulk-bar tiles are icon-only (per an explicit
   24 Aug request) — if they still read as ambiguous, labels are the next step. And
   `--aidot-speed` is one number if the loaders want to be slower still.

## Decisions made

- **Build from existing atoms, copy only the model.** The Layout drawer is `.sdrawer`,
  `.ddseg`, `.ddnote`, `.ddsliders` and `.ddprev` — all already in the file. No chrome and no
  colours were imported from the reference.
- **Reference ranges, our defaults.** Their gaps default to 14 and row height to 140; ours
  stay at the canvas's own 10px gap and 12.5px title so Reset means "how it has always
  looked" rather than "restyle every board".
- **One scope with a variable target** rather than a third scope, so the segment label, note,
  button label and apply loop all read one function and cannot disagree.
- **Substitutes for two loaders that do not exist.** "Converge" and "Stack" are not in the Dot
  Matrix library (checked all 80 names in its source registry); Core Spiral and Strobe Stack
  were confirmed as the replacements and that is recorded in the code.
- **Pure CSS for the loaders**, because a JS timer would need clearing when the panel closes
  — the `agClose()` trap. Prism Bloom's 25 cells collapse to 7 timelines, which made it cheap.
- **Icon-only bulk tiles kept**, honouring the 24 Aug request, with the ambiguity addressed by
  a divider and by de-reddening Archive rather than by adding labels.

## Gotchas & notes

- ⚠️ **Grep the CSS class, not just the JS name.** `.aipb` was already taken — the *AI preview
  body*, with `padding:11px;min-height:86px`. The new loader container inherited both, an 18px
  slot held a 40×86 box, and the thinking row broke onto several lines. **Nothing errored and
  the animation was correct**, so it read as an alignment bug rather than a name clash.
- ⚠️ **`display:block` in a computed style proves nothing for a grid item** — blockification
  happens whatever the rule says. Dot rows measured 11.75px because the ROW was sized by the
  inherited line box. Fix is `grid-auto-rows` + `line-height:0`; measure `gridTemplateRows`.
- ⚠️ **An id-scoped rule can beat a `.on` state rule.** `#drawer-layout{right:-540px}` is
  (1,0,0) against `.sdrawer.on{right:0}` at (0,2,0) — the drawer opens in state and never
  moves. It needs its own `#drawer-layout.on`.
- ⚠️ **`curl` succeeds where the browser tool's content filter blocks.** Returning contiguous
  source text from a page context was refused repeatedly; the same file via `curl` in Bash
  worked every time. Use Bash for source, the browser for behaviour.
- ⚠️ **A page with ~98 simultaneous CSS animations wedges the renderer** — the Dot Matrix
  showcase froze the tab twice. Go to a single-item route, or to the source.
- ⚠️ **A popover that closes on `resize` is invisible in headless captures**, because the
  screenshot fires a resize. Detach that listener to shoot it.
- ⚠️ **`layVars()` must never call `renderCanvas()`** — `renderCanvas()` calls it.
- ⚠️ Pre-existing and untouched: **`id="drawer-versions"` appears twice** with different
  bodies; the second is unreachable.
- Nothing is committed. `git status`: `index copy.html` modified, `image.png` untracked (a
  stray screenshot, deliberately left out of the last push). Run `/publish` to go live.
