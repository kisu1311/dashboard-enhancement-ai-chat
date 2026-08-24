# Handoff — 2026-08-24 11:44

## Read first

Two files changed this session: **`index copy.html`** (Option 1) and
**`dashboard-picker-advanced.html`** (Option 3). Option 2 was not touched.

In `CLAUDE.md`, read these first:

- **"The module rail (Datadog pattern…)"** — Option 1's rail was rebuilt from
  **`sidemenu.md`** (now in the repo). Six entries, and Explorer carries a two-level tree.
  The section explains what moved and the traps in `MOD_TO_RAIL`.
- **"Each option now demonstrates a DIFFERENT sidebar pattern"** — no longer true of
  Option 3, and the table says so. It runs Option 1's rail now; the DevRev column is hidden,
  not deleted.
- **"The floating card's top edge"** — the resize marks and grips went through several
  shapes. Read it before adjusting any of them; two were built and deliberately reverted.

## What we worked on this session

Continued the request-by-request pass on Option 1's floating chat card, then moved to
navigation: Option 3 adopted Option 1's sidebar, and Option 1's rail was rebuilt from a new
spec file with a much deeper Explorer sub-menu.

## Completed

**Floating chat card (Option 1)**
- **Create Widget dodges the chat only while it overlaps it.** It was shifted for the whole
  of Floating — which is every session now — so dragging the chat away left the button
  parked in the middle of the canvas.
- **Grips straddle the card's edge** (4px out, 4px in) instead of sitting wholly inside it.
  **This was the cause of both "the height increases" and "the height minimises" reports** —
  the grips ate the top of the header, so grabbing the card where you naturally would
  started a resize.
- Corner arcs trimmed to the curve (20px box, 3px tails) — they read as brackets before.
- Edge capsules and corner arcs are now the **same 4px**.
- The full-length edge bar was **restored** after I shortened it on a misread.

**Navigation**
- **Option 3 runs Option 1's sidebar** — icon rail + hover flyout. Four changes; the DevRev
  column is hidden, not deleted.
- **Option 1's rail is six entries** from `sidemenu.md`: Dashboard · Alert · SLO │ Explorer ·
  Report │ Setting.
- **Explorer's flyout is the whole tree** — 11 sub-modules, each with its own product icon
  and highlighted; Monitor's 18 children and NCCM's 2 indented beneath them. 31 rows.

## In progress

Nothing mid-flight — every change was verified before the next was started.

**One question still unanswered, and it is the first thing to settle:**
**`Report` is currently in two places** — a rail entry *and* the last row of Explorer's
flyout. `sidemenu.md` puts it at the top level; the 23 Aug screenshot message lists it among
Explorer's sub-modules. Both are your specs and they disagree, so I did what each asked
rather than pick one. Options: Explorer-only (5 rail entries), rail-only, or both.

## Next steps

1. **Answer the `Report` question above.**
2. **Options 2 and 3 have drifted a long way behind Option 1** — none of the AI panel's
   palette, layout, composer or clarifier work is in them. Decide whether Option 1 is now
   the reference the others follow.
3. **Fix the third `.stop` collision.** Option 3's `ac*` panel still toggles a bare `'stop'`
   on `.acsend`, so it carries the same sidebar-`.stop` bug fixed in Option 1. It is a
   three-file change because that block is byte-identical across all three.
4. The floating card still has near-zero vertical travel at its resting height (0px at
   1280×720) — recorded in CLAUDE.md, still your call.

## Decisions made

- **A grip mark is only drawn where something is grabbable.** East and south became real
  resize handles rather than decorative lines.
- **Icons, not layout, made the 31-row flyout readable.** A two-up grid balanced the columns
  but forced a read-nine-rows-then-jump-back order with nothing signalling it — reverted.
  Icons distinguish "a module you can open" from "a page inside one", which indentation
  alone stopped doing at that length.
- **Uniformity over emphasis.** All eleven sub-modules render as one shape. Two earlier
  attempts (section headings, then parent rows) made Monitor and NCCM look like different
  kinds of thing from each other.
- **Keep replaced machinery unreferenced, not deleted** — the DevRev column, `mfCol`'s
  `parent`/`cols` fields, the two-up grid CSS and the old `SUBNAV` keys are all one edit from
  returning.
- **Where two of your specs disagreed, I did what each asked and flagged it** rather than
  silently choosing (the `Report` question above).

## Gotchas & notes

**Three CSS/JS traps hit this session, all now commented at the rule:**

- **`*{box-sizing:border-box}` does not match pseudo-elements** — it needs
  `*,*::before,*::after`. The edge capsules were silently `content-box` and rendered 6px
  against the arcs' 4px. Fixed on the marks themselves, *not* by widening the global reset.
- **CSS `columns:2` splits the width the container already has**, and `.mfi` is
  `white-space:nowrap` — "Container Orchestration" printed *on top of* the next sub-column.
- **`.mfi:not(.sub)` would have re-weighted every other flyout.** The highlight selector is
  `:has(.mfic)` — a row with a module icon is a module, and nothing else in the file has one.

**Probe traps that produced false results on working code:**

- **`getComputedStyle` on a detached element returns empty strings.** A style value read
  before `mfOpen` replaced the flyout's `innerHTML` compared against `''` for the rest of the
  run. Snapshot the *value*, not the element.
- **A stale screenshot copy.** I regenerated the probe but not the screenshot file, so the
  picture still showed a bug that was already fixed while the verdict was green. Regenerate
  both, every time.
- `getComputedStyle().width` on a pseudo-element returns the **content** box.

**Environment**

- `image.png` in the repo root is an untracked reference screenshot, not part of the
  prototype. Left out of the commit deliberately — delete it or keep it locally.
- `sidemenu.md` **is** committed: `CLAUDE.md` now cites it as the rail's spec.
