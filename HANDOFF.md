# Handoff — 2026-08-25 18:14

## Read first

Two sections of `CLAUDE.md`, in this order:

1. **"The 25 Aug 2026 pass — the assistant gets a name, a mark, and a neutral palette"**
   — everything this session did, and it **supersedes** several older statements in that
   file (violet is no longer the `ai*` panel's accent, `AI_SPARK` is no longer the ✦,
   "Ask AI" is now "Ask Iris", the grip line's "don't shorten it again" note is overruled).
   Where anything conflicts, that section is current.
2. **"The 24 Aug 2026 pass"** directly above it — the immediately preceding state, which
   this one builds on.

All work is **Option 1 only** (`index copy.html`). Options 2 and 3 were not touched.

## What we worked on this session

Gave the AI assistant an identity — a name (**Iris**) and a supplied product mark — then
repainted the whole chat panel off violet onto a neutral pair, and rebuilt the "thinking"
row's motion from two beui.dev references (Dia Text Animation + Text Shimmer).

## Completed

- **`_ai-identity.html`** — a new options board: six complete AI identities (mark + name +
  rationale + trademark notes), rendered at real size in the actual pill, both themes.
  Underscore-prefixed so `_sync_variants.js` ignores it. Iris was chosen from it.
- **Iris applied everywhere** — toolbar pill, Log Explorer head, rail row + tooltip, the `A`
  shortcut label, the panel `aria-label`, empty-state copy. Greeting fixed "we" → "I".
- **The mark is the supplied `OPS AI.svg`** (speech bubble + spark), path extracted
  programmatically from the file. Eight CSS consumers moved back from `stroke` to `fill`;
  `#sbAI .ic` override removed; `LX_AI_SPARK = AI_SPARK` so there is one definition.
- **Stop button** — glyph is now Lucide `circle-stop`'s inner rect verbatim (corner radius
  27% → 16.7%, which is what made it read as a blob); recoloured to `--text`
  (`#1D2A3E` / `#CAD3E2`) with `--card` glyph, `--white` hover, `--text-dim` active.
- **Bug fixed: four stale `:not(.stop)` selectors** left over from the documented
  `stop` → `aisndstop` rename. Consequences, both live until now: Stop rendered at **62%
  opacity** (contradicting its own comment saying it was excluded), and painted **violet
  whenever the composer had text** — reachable by typing while an answer streams.
- **Whole `ai*` panel off violet** — tokens redefined on `.aipanel` per theme, plus a new
  `--ai-fg` (the fill inverts, so ten `color:#fff` rules were unreadable in one theme), and
  a **stale later-in-the-same-rule light violet declaration deleted** that would otherwise
  have kept light theme violet while dark went neutral.
- **`--action` token pair** for primary buttons (`.btn.pri` + `.cwfab`), replacing a
  theme-invariant `--teal`.
- **Thinking row rebuilt** — product mark (pulsing on the old loader's 650ms cadence)
  replaces the pixel grid; the title writes itself in then loops a brand-gradient band; the
  narration line carries Text Shimmer.
- **Bug fixed: the narration shimmer never worked** — `.aitk.bx .aiagsay` (0,3,0) beat
  `.aiagsay.live` (0,2,0), so `color:transparent` never applied and the solid text painted
  over the gradient. Now `.aitk.bx .aiagsay.live` (0,4,0), with `prefers-reduced-motion`
  repeating the same selector.
- **Thinking trail scrollbar hidden**, scrolling preserved.
- Floating-card grip line: reverted to hover-only; length now `card − 84` via `--aigrip-i`.

## In progress

Nothing mid-flight — every change is applied and verified. Open **decisions**, not
unfinished work:

- **`_ai-identity.html`** is kept as the record of why Iris. Delete whenever you like.
- The Iris **prism** mark (from the options board) was built and then replaced by the
  supplied SVG. It is gone from `index copy.html`, but the board still shows it.

## Next steps

1. **Decide the remaining violet surfaces.** Still violet on purpose, all flagged: the
   toolbar `Ask Iris` pill (brand-gradient border + violet text), the Log Explorer's
   `AI Query` / `Generate query` / Apply, the per-widget `✦` summary drawer, the canvas
   `.aiflash` outline, and the whole `ac*` panel (⌘I, runs on `--oa*`, three-file change).
2. **Decide the remaining teal.** 183 `var(--teal)` uses, including two more primary CREATE
   buttons on their own classes — `.ddcreate` (Create Dashboard drawer) and `.cwbtn.pri`
   (widget editor footer) — which now look inconsistent beside the neutral `.btn.pri`.
3. **The Send glyph is still a hand-drawn dart** (`M4 12l16-7…`) even though CLAUDE.md
   records it as Lucide `arrow-up`. It sits directly beside the Stop button that was just
   fixed. Worth pulling the real geometry.
4. **`--ai-cta` starter rows** are now the only other chromatic thing in the panel — in
   light theme they read as a pink wash against an otherwise neutral card. Neutralise, or
   keep as the brand moment?
5. Consider whether the mark and the name should agree — the bubble+spark says "AI chat"
   clearly but does not illustrate *Iris*.

## Decisions made

- **Redefine tokens on `.aipanel`, never edit the ~173 declarations** — and never move those
  rules to `:root`, because `--ai*` also drives four other AI surfaces.
- **Keep the supplied SVG's 48 viewBox** rather than rescaling to the panel's 24 grid.
  Rescaling a path by hand is how artwork drifts out of family; the viewBox is internal
  because every consumer sizes the `<svg>` in CSS.
- **Delete rather than park** the grips' resting-visibility rule — a commented-out
  `opacity:1` beside `opacity:0` invites re-enabling the thing just removed. (Contrast: the
  pixel-grid loader and `aishim` *were* parked, because their timings were hand-tuned.)
- **Overrule the "don't shorten the grip line again" note.** It came from a 23 Aug misread;
  four explicit length requests in a row is a decision. The note is rewritten to say so.
- **Use the brand gradient's own 55% stop**, giving the band's middle colour an offset of
  `+1.4%` rather than centring it at 0 — centring would quietly restate the gradient 50/50.
- **A mask, not `transparent` gradient stops, for the write-in** — the loop needs the text
  readable ahead of the band and the write-in needs it absent; one `background-image` cannot
  be both and it does not interpolate.

## Gotchas & notes

- ⚠️ **A green probe is not a working feature — assert the CONSEQUENCE.** The narration
  shimmer probed as `animationName=aishim` + `background-clip:text` and was still completely
  broken; only reading `color` revealed that a higher-specificity rule had killed it.
- ⚠️ **After renaming a CSS modifier, grep for the OLD name too.** Grepping only the new one
  finds nothing and looks clean — which is how four `:not(.stop)` selectors survived.
- ⚠️ **Check for a later declaration in the SAME rule** before trusting a token override.
  The light `.aipanel` block redeclared `--ai` further down; specificity was identical, so
  source order alone would have reverted half the work invisibly.
- ⚠️ **CSS animations do not advance under headless virtual time.** Sampling an animated
  value returns its `from` value forever. Freeze the animation, set the property explicitly,
  screenshot.
- ⚠️ **`getComputedStyle` on a pseudo-element returns computed, not used, values** — and
  `sips --cropOffset` is centre-relative, not absolute. Both produced phantom measurements.
  Measure pseudo-elements from painted pixels, and crop with PIL.
- ⚠️ **Colour-based pixel detection collides with the dashboard behind the panel** (red =
  heatmap, green = severity, magenta = the Ask-AI pill). Force an unmistakable colour onto
  the element under test and match tolerantly — Chrome rounds `#ff0000` to `(254,0,0)`.
- ⚠️ **The `--screenshot` viewport is taller than the `--dump-dom` one** (no browser chrome),
  so a rect measured in one run will not crop the other.
- ⚠️ **Regenerate the probe copy after every edit.** A stale copy reported the old value
  twice on code that was already correct.
- Nothing is committed. `git status`: `index copy.html` modified, `_ai-identity.html` and
  `image.png` untracked. Run `/publish` to go live.
