# Handoff — 2026-08-24 18:55

## Read first

Two sections of `CLAUDE.md`, both written this session:

- **`## The 24 Aug 2026 pass — Option 1's ai* panel, request by request`** — the map of
  everything changed in the AI panel today, grouped by icons / spacing / clarifier /
  thinking trail / context bar / cursor. Read this before touching `ai*`.
- **`### Its chrome was rebuilt from the product's own components (24 Aug 2026)`**, inside
  `## Manage dashboards (md*)` — the tabs, search box and bulk-action changes.

Everything is **`index copy.html` (Option 1) only**. Options 2 and 3 were not touched, so
the shared `ac*` / `lx*` / `st*` blocks are still byte-identical across the three files.

## What we worked on this session

A long request-by-request visual pass, driven entirely from screenshots the teammate sent
after each change. Two areas: the **Manage dashboards** screen's chrome, and then a deep
sweep of **Option 1's `ai*` chat panel** — icons, spacing, the clarifier card, the thinking
disclosure, and the context bar.

## Completed

**Manage dashboards + the list panel**
- Tabs are `.lxtab` underline tabs in their own row under the page head, not `.dtab` pills
  in the toolbar.
- The funnel filter field became the product's `.stcsearch` search box plus a `.stcaddf`
  `＋ Filter`. The whole faceted filter still works (draft → Done → chip → filtered table,
  verified end to end).
- Bulk actions are `.stcsq` icon tiles pinned to the end of the toolbar row, so ticking a
  box no longer shoves the grid down 46px. Clear stays a word.
- `mdMoveMenu` is viewport-clamped (it ran 9px off-screen once the trigger shrank).
- The list panel's *Manage dashboards* button is a labelled full-width row under the teal
  primary, not a 34px icon square.

**AI panel — icons**
- Send: Lucide `arrow-up` in a 9px rounded square, violet, white glyph. Stop matches.
- Layout toggle: Lucide `square` / `copy` as a matched pair, and it no longer wears `.on`.
- Summary card carries the ✦, not the product logo.
- Clarifier back/close equalised at 16px / 1.875 (still 1.25px on screen).

**AI panel — spacing**
- Header: ad-hoc margins removed, chat name now 8px from ＋ New chat (the summary card's
  own mark→title gap).
- Scroll-to-latest arrow lifted off the composer — it was flush, now 10px.
- `.aichips` / `.aiq` / `.aiacts` split into row-gap vs column-gap with 14px between blocks.
- Documentation / Support moved to the foot of the empty state.

**AI panel — components**
- Clarifier: Skip moved to its own footer row shared with Done; back arrow reserved on every
  step so the title stops jumping and now aligns with its subtitle; a 2px progress track
  (verified 25/50/75/100 across all four steps).
- Thinking trail: expanded state capped at 220px, scrolls, both edges fade — reusing the
  thread's own fade engine (`aiFadeEl` extracted from `aiFade`).
- Collapsed label is one constant, `AI_TK_NAME = 'Thought'`, on both surfaces.
- Context bar never empties: an **All modules** floor chip that really moves the scope.
- The floating card's header shows `grab` / `grabbing`.

## In progress

Nothing mid-flight. Every change was verified before being reported.

**Uncommitted**: `index copy.html` (+605 / −134). Nothing has been committed or pushed this
session — the working tree is that one file plus the pre-existing untracked `image.png`.

## Next steps

1. **Look at the panel in a real browser.** Everything today was measured in headless, and
   the teammate's own screenshots were repeatedly a version behind — see Gotchas.
2. **Commit the work.** One file, one coherent pass; the CLAUDE.md sections above are
   written and can carry the commit message.
3. **Decide the send button's shape if the composer ever regains a control to its right.**
   The 19 Aug objection (a square between two circles) was answered by that row no longer
   existing; it comes back if the row does.
4. **Consider whether `aiNewChat()` should reset pinned context.** It currently keeps the
   previous chat's chips — pre-existing behaviour, unchanged today, but the All-modules floor
   made it more visible.
5. **The full-screen toggle wedging under automation** is worth a real look. It reproduces on
   the committed baseline, so it is not from today's edits.

## Decisions made

- **Reuse this file's own components rather than skinning the reference.** Manage dashboards'
  tabs, search box and bulk tiles are all `.lxtab` / `.stcsearch` / `.stcsq` — controls
  already cloned from the live product — so they inherit its geometry and cannot drift from
  it. The flow stays the reference's; the look is this prototype's.
- **Presence comes from size, never from breaking the icon-weight rule.** The panel targets
  1.25px of stroke on screen everywhere. Where glyphs read as smudges (the clarifier's back
  and close), they were enlarged and the stroke recomputed, not thickened.
- **One constant for the thinking label.** A disclosure's job is to say what is behind it,
  and that is always the same thing. This reverses the 19 Aug kinds-summary deliberately.
- **Empty context now means global, and says so.** Reverses the 18 Aug note. The screen and
  the model had disagreed — the bar was blank while the scope quietly stayed on Dashboard.
- **The AI mark, not the product logo, on generated prose.** Reverses 19 Aug.
- **Reversals are recorded at the rule, with both sides of the argument.** Four decisions
  today undo earlier ones; each carries a note naming the old request so it is not restored
  by someone reading only the older note.

## Gotchas & notes

- ⚠️ **Chrome could not reach any local port for most of this session** — `curl` returned 200
  on the same URLs, two ports and a fresh server made no difference. Verification moved to
  headless probes. **Check this first**; if it persists, headless with a stripped Agentation
  loader is the working route.
- ⚠️ **The teammate's screenshots were repeatedly a version behind.** A paper-plane send icon
  was reported twice after it had already been replaced. These pages are ~1.6 MB and the
  local server sends no cache headers — bump a `?v=` query or hard-reload.
- ⚠️ **`aiFadeBind()` is too early for anything that queries the thread's markup.** It runs
  near the top of `aiRender()`, before `b.innerHTML`. A `requestAnimationFrame` fallback does
  **not** rescue it either — rAF is starved under headless virtual time. Put such calls at the
  tail of `aiRender()`, beside the loader's clock.
- ⚠️ **`margin-top:auto` cannot double as a minimum gap.** It resolves to 0 with no free space
  and silently overrides a `margin-top` written beside it. Put the floor on the preceding
  element.
- ⚠️ **`aiAsk()` throws when called directly from a probe** (`reading '2'`). Drive flows
  through their own entry points instead — `aiAskGroup()`, `aiAgSumStart()`.
- ⚠️ **Probes that advance the clarifier by clicking a row stall on step 2** — that is the
  multi-select step, where a row toggles and only Done commits. One probe reported a false
  failure this way before I noticed.
- ⚠️ **Driving the full-screen toggle wedges the renderer under automation.** Reproduced on
  the committed baseline. Set `.aifs` directly to measure those states.
- ⚠️ Several rules now depend on each other numerically and say so in comments: `.aicqs`'s
  33px indent ← the back button's 24px box; `.aitobot`'s `+6px` ← `.aicomp`'s 4px padding;
  `.dfoot`'s 85px min-height ← its two rows. Change one, move the other.
