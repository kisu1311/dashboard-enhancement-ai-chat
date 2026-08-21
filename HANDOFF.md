# Handoff — 2026-08-21 23:49

## Read first

Everything this session is **Option 1 only** (`index copy.html`) — the `ai*` chat panel,
plus two suite fixes. Options 2 and 3 were not touched.

In `CLAUDE.md`, read these first:

- **"The panel is painted from the product's own palette"** — new section. The chat now
  takes its text, border, surface and accent colours from
  `observeops-icons/color-palette.html`, scoped to `.aipanel`. It carries the full token
  mapping and the one contrast trade-off.
- **"The floating card's top edge"** — the resize marks. Four edge capsules, four corner
  arcs, the two states, and two shapes that were built and rejected on the way.
- **"The clarifier"** — it has a **multi-select step** now, and adding it exposed a
  hardcoded index that would have broken every build.
- **The `.aisend.aisndstop` note** — three class-name collisions were hit today, two of
  them by me. Read it before naming any new modifier in this file.

## What we worked on this session

A long request-by-request pass over Option 1's AI chat panel, driven by screenshots and
two references (the product's own colour library, and monday's Sidekick panel). Roughly
twenty changes: the layout model, the floating card's resize affordances, the panel's
whole colour palette, the composer's controls, the empty state, and a new multi-select
flow in the clarifier.

## Completed

**Layout**
- **Sidebar removed from the Layout menu; Floating is the default**, and the card now
  rests at the sidebar's size — `--ai-w` wide and full height, floating 20px off three
  edges. `aiSplit`, `body.aisplit` and the drag-to-dock gesture are kept unreferenced.
- **The Layout menu became a toggle** — two modes are not a dropdown. The trigger shows
  the layout it will go *to*, not the one it is in.
- `AI_MAX_H` (900px) removed and `aiFMinW()` folded against the resting width — both had
  become bugs the moment the card grew to full height.

**The floating card's edges**
- Grips and real resize on **all four edges** plus **all four corners**.
- Each grip shows its own mark: a hollow capsule on an edge, a **stroked SVG arc** on a
  corner. Outline at rest, solid in the product's active colour while dragging.
- **A move can no longer change the size** — `aiRzMove`'s `move` branch pins `w`/`h` back
  after clamping.

**Colour**
- The panel is repainted from **`observeops-icons/color-palette.html`** — text, borders,
  chips, hovers and the AI accent, per theme, scoped to `.aipanel`.
- The starter rows carry the supplied brand gradient (blue → violet → magenta).

**Composer**
- The leading control is an **`@`** that opens the mention list directly. The ＋ menu, the
  mic and file upload are gone (all parked unreferenced).
- Send is pushed hard right; the stop button keeps its exact slot.

**Empty state**
- **Documentation and Support** moved out of the ⋯ menu to **side-by-side light-grey
  buttons** under the starters, with the ↗ hidden until hover. The ⋯ hides on an empty
  chat, and Rename/Delete only appear once a chat has content.
- The chat name lost its resting pill and gained a margin; its width is capped at 50%.

**Clarifier**
- A **multi-select step** (`states`) — checkbox rows, a Done button that names the count,
  pre-lit with its default, free text and ticks mutually exclusive, Back restores the whole
  selection. Printed in the preview as real `monitor.<state>.count` counters.

**Suites**
- `_verify/lxbehave.py` fixed — two assertions encoded the old tree/panel defaults. Now
  **57 checks**, passing on all three files.

## In progress

Nothing mid-flight. Every change was verified before the next was started.

**One open decision, not a bug.** The card rests at `100vh − 40`, which *is* the maximum
height, so `aiClamp` pins it and it can barely be moved vertically — measured travel is
217px at 1600×950, **35px** at 1366×768 and **0px** at 1280×720. That is a direct
consequence of "the floating view is sidebar size". Getting travel back means either a
shorter resting height or letting the card hang past the bottom edge; both undo something
that was asked for, so neither was done. Kishan's call.

## Next steps

1. **Nothing is committed.** `index copy.html`, `CLAUDE.md` and `_verify/lxbehave.py` are
   the three modified files. Last commit is `9c32550`.
2. **Decide the vertical-travel trade-off above.**
3. **Fix the third collision.** Option 3's `ac*` panel still toggles a bare `'stop'` on
   `.acsend`, so it carries the same sidebar-`.stop` bug that was just fixed here. It is a
   three-file change because that block is byte-identical across all three.
4. **Options 2 and 3 have drifted much further behind** — none of this session's palette,
   layout or composer work is in them. Decide whether Option 1 is now the reference.
5. The chat title cap is one number (`max-width:50%` on `.aihttl`) if 11 characters turns
   out to be too short to tell chats apart.

## Decisions made

- **Scope colour changes to `.aipanel`, never `:root`.** Every token repointed also drives
  the dashboard, Log Explorer and Settings. The ask was to align the chat, not repaint the
  prototype — there are probe assertions that the board keeps its own `--text` and `--ai`.
- **The AI accent is a product token after all.** `--chart-indigo` is `#8b5cf6` dark and
  `#7c3aed` light — the violet the panel already used, and what Option 3's `--oa` has
  always declared. The two AI surfaces now agree.
- **State the contrast regression rather than silently "fixing" it.** Light `--text-dim`
  moved to the product's own `#7186a8`, which lands near 4.0:1 on white. It is what the
  product ships.
- **Corner marks are stroked SVG paths, not CSS borders.** A border always terminates
  square and mitred; only a path takes a round cap. One path, rotated three times.
- **A grip mark is only drawn where something is grabbable.** East and south became real
  resize handles rather than decorative lines.
- **Keep removed machinery unreferenced, not deleted** — the ＋ menu, dictation, upload,
  `aiLayMenu`, the sidebar layout and the dock gesture are all one line from returning. The
  exception is the collapse-to-header control, which was fully deleted on request.

## Gotchas & notes

**Three class-name collisions in one session — the trap this repo's CLAUDE.md opens with.**

- `.aisend.stop` was inheriting the **sidebar's** `.stop` (its top section): 8px of margin
  and 4px of row height, on every generation, invisible for weeks.
- Renaming it to `.aistop` hit **`.aistop`, the stopped-generation notice** — `margin:0 0
  16px`, so the row grew 16px.
- `.aicqx`, chosen for the new checkbox, was already the clarifier's own old primary button.
  That one was caught by grepping *before* writing it.

**Grep the whole stylesheet for a bare modifier before naming one.** None of these rules
appear in a search for the component they broke; all were found by measuring
`getComputedStyle` and dumping children.

**Probe traps hit this session, all producing false results on working code:**

- `document.body.innerHTML` contains inline `<script>` source — an assertion that "no
  markup calls `aiPlusMenu`" matched the parked function's own code. Assert over
  `querySelectorAll('[onclick]')`.
- `getComputedStyle(el).display !== 'none'` does **not** mean an element is rendered. A
  child of a `display:none` ancestor computes its own display normally and reports 0×0 at
  0,0. Test the rect.
- `color-mix()` serialises as `color(srgb r g b / a)`, **not** `rgba(...)`.
- `getComputedStyle().width` on a pseudo-element returns the **content** box — add the
  border widths back before comparing to the parent.
- An injected hover stand-in must carry the **same specificity** as the real `:hover` rule,
  or it outranks the drag state it is meant to sit under.
- Expect the room that **exists**: a "card still moves >100px" assertion fails at 1366×768
  and 1280×720 on correct code.

**One design lesson worth keeping:** `opacity` applies to the whole element, background
included. Revealing the grip mark at `.5` left a half-transparent white fill that the board
read straight through — the fix was `opacity:1` with the alpha moved into the border colour.

**Environment**

- Headless Chrome hangs often; wrap in `perl -e 'alarm N'` and strip the Agentation loader
  from probe copies. `harness.py` needs ~20s of virtual time.
- ⚠️ The local http server sends no cache headers — add `?v=N` after editing or you will
  verify the previous version of the file.
