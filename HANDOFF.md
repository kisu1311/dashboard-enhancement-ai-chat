# Handoff — 2026-08-21 00:47

## Read first

Everything this session is **Option 1 only** (`index copy.html`) — the `ai*` chat panel and
the `lx*` Log Explorer. Options 2 and 3 were not touched.

In `CLAUDE.md`, read these first:

- **“The 20–21 Aug 2026 visual pass”** — new section, written this session. It is the map of
  everything below, grouped by area, with the traps called out.
- **“One icon system, one weight”** inside it — the icon stroke rule (`1.25 × 24 / size`) is
  the single most re-breakable thing here. Change an icon's size and you must recompute.
- **“`✦ AI Pattern Summary` — the Action column”** — now carries a ⚠️ SUPERSEDED banner. The
  ✦ routes into the chat again; the drawer is kept and unreferenced.

Two live references were driven in the browser this session and are worth knowing about:
**ClickUp's Brain² composer** (measured, DOM + computed styles) and the **live ObserveOps
Log Search**. Where we diverge from either, the code says so.

## What we worked on this session

A long, request-by-request visual and interaction pass over Option 1's AI chat panel and its
Log Explorer touchpoints — driven by screenshots and two live product references. Roughly
thirty changes, each verified with a headless probe before being reported.

## Completed

**Icons**
- Every glyph in the panel replaced with **Lucide**, pasted verbatim from `lucide-static`.
- Icon weight normalised: all icons target **1.25px of stroke on screen**, stroke-width
  derived per rendered size. Was a 0.87–1.70px spread across 33 declarations.
- Log Pattern's ACTION ✦ is a tinted tile at rest (and its glyph was being squashed 14→12px
  by flex-shrink — fixed).
- Feedback row icons → Lucide outlines, 24px box / 13px glyph.
- Stop button's square was rendering at 4.2px in a 30px circle (two shrinks multiplied);
  now 11px, ~36%.

**Composer** — measured off ClickUp's Brain²
- Radius 20, shadow-based edge, 14px/21px text, soft-pill context chip.
- Border dimmed four times (`.07 → .018`, now at its floor), hover lift added, focus ring
  composes on top rather than replacing the elevation.
- Padding/gap `12/10 → 16/15`, floor 128px.
- Send appears only when there is text; Stop always shows.
- “Auto-approve” → “Auto”, dimmed to match the glyph row.
- Context row reserves its height so removing the chip moves nothing.
- ＋ menu hugs the button, opens with nothing highlighted.

**Thinking trail**
- Collapsed by default, including while running.
- Group headings hang left as uppercase section labels with real separation.
- Vertical rule removed; sub-detail rows indent under their step.

**Cards**
- ⤴ Share moved into the feedback row after copy, on both the widget and summary cards; the
  row sits outside the card.
- Removed: the widget card's ✕ and counter subtitle, the summary card's ⤴ and ⌃, `.aistep`'s
  leading dot (7 sites), starter row icons, ✦ avatars, the `--sv-cta` brand gradient.
- **`aiAgShare` was throwing on `null.appendChild`** once ⤴ moved — the button did nothing.
  Fixed and guarded.

**Chat history**
- New full-screen-only left column (`aiHs*`).
- Show-all screen's header moved into the panel header; composer hidden there.
- Dropdown capped at **6** with `Show all N ›`.
- Context chip ✕ is out of flow and opaque — nothing reflows, nothing shows through it.

**Clarifier**
- Rebuilt to the supplied reference: numbered rows, pencil free row with inline Skip, ✕.
- Picking a row answers and advances; `Next` removed.
- Docked over the composer, and the composer hides while a question is up.

**Log Explorer**
- Search bar builds queries in place (`✦ Generate query` → rewrite → Apply); the AI Query
  popover now rewrites its own textarea the same way. Both share one engine.
- Source tree and sources panel both open collapsed.
- Pattern ✦ answers in the chat instead of its own drawer.
- Starters replaced with real searches; IP scrubbed to `192.0.2.165`.

**Thread**
- Edge fade via `mask-image` (not an overlay gradient — the panel background is itself a
  gradient).
- Panel background gradient: `--card` at top, 5% black at the foot.
- 16px of space under the header.

## In progress

Nothing mid-flight. Every change was verified and reported before the next was started.

**One open question, unanswered:** when the widget card's counter subtitle was removed, the
request quoted *“create widget”* but the screenshot boxed the **subtitle**. I removed the
subtitle and kept the “Create Widget” title (consistent with the 18 Aug summary-card
precedent). If that was backwards it is a one-line flip at `aiAgHTML`'s `.aiagch`.

## Next steps

1. **`_verify/` suites have not been re-run since this pass.** `behave.py` (63) and
   `harness.py` (77) exercise the `ac*` panel and layout — untouched this session, so they
   should still pass, but confirm. `lxbehave.py` was green (56/56 ×3) mid-session, before
   the tree/panel collapse defaults changed — **re-run it**, as those defaults may be
   asserted.
2. **Options 2 and 3 have drifted further behind.** The `ac*` panel in all three still has
   the old flat `--card` surface, the old icon weights, and none of this composer work.
   Decide whether Option 1 is now the reference and the others follow, or whether they stay
   deliberately different.
3. **Nothing is committed.** `index copy.html` is the only modified file.
4. If the icon work is wanted elsewhere, the sidebar's `ICO` map and the `oa*` panel in
   Option 3 are the two remaining hand-drawn sets.

## Decisions made

- **Icon weight is derived, not typed.** `stroke-width = 1.25 × 24 / size`, because the
  on-screen weight is what the eye reads and it is not what the CSS number says.
  `vector-effect:non-scaling-stroke` was tried and does not work — not an inherited property.
- **Measure references, don't copy them by eye.** ClickUp's composer was read out of the
  live DOM; where we diverge (a border for dark theme, an opaque ✕ so long labels don't
  bleed through) the code says why.
- **Divergences from the live product are recorded as divergences.** The Log Pattern ✦
  (chat, not drawer — third direction change for that flow) and the sources panel default
  (collapsed, not open) both carry banners so a future session doesn't "correct" them by
  checking the product.
- **Deleted controls that duplicated another control**, rather than restyling them — the
  widget card's ✕ duplicated the Reject chip; the ⋯ and ⌃ on the summary card had nothing
  to act on.
- **Kept, not deleted, anything measured against a real product screen** — `lxPsPaint` and
  the pattern drawer are unreferenced but intact, so a fourth direction change is one call
  site, not a rebuild.

## Gotchas & notes

**Verification traps hit this session — all four produced false results:**

- **`document.body.textContent` includes inline `<script>` source.** A probe matched
  `aiAgShare`'s own code and reported PASS on a button that did nothing. Assert on rendered
  nodes (`getElementById`, `getBoundingClientRect`), and capture `window.onerror`.
- **Probe copies are snapshots.** Re-running one after editing the source tests the old
  code. Regenerate every time.
- **Chrome rounds alpha** (`.045` → `0.043`, `.018` → `0.02`) and **letter-to-digit is not a
  word boundary** (`\b9\b` never matches `"Show all9 ›"`).
- **An automated tab is not focused, so CSS transitions freeze** — the panel measured as
  still off-screen at x1718. Inject `transition:none` before reading geometry.

**Code traps, all now commented in place:**

- **Flex basis vs width, in both directions.** `.aihm button svg` is `flex:0 0 15px` so a
  `width:14px` did nothing; `.lxpatai svg` had no basis so the row squeezed it to 12×14.
- **Source order at equal specificity.** `.aicmd.aiplusm{bottom:…}` lost to `.aicmd.up`
  twice — it has to sit *below* it, not out-specificity it.
- **`.aihfr .tt span` swallowed the rename editor** — a descendant selector matching a child
  it was never meant to. Scoped to `.sm`.
- **Element ids become window globals.** `lxPanelBtn` is an id; the function is `lxPanel()`.
- **`sel` needs three states** in the clarifier — `null` / `-1` / index.

**Environment**

- Headless Chrome hangs often here; wrap in `perl -e 'alarm N'` and strip the Agentation
  loader from probe copies. Long flows (the agentic build is 10–15s) need
  `--virtual-time-budget` well above the flow, and an `until()` poll whose total is *under*
  the budget or you get no verdict at all.
- Two memories were saved to `~/.claude/projects/…/memory/` this session: the icon sources
  (Lucide/Tabler/SVG Repo — never hand-draw), the icon weight rule, and the
  `document.body.textContent` probe trap.
