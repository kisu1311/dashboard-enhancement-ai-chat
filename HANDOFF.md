# Handoff — 2026-08-18 19:29

## Read first

Everything this session touched is **Option 1 only** — `index copy.html`, the
`ai*` / `AI_*` / `.ai*` namespace. Options 2 and 3 were not opened. In `CLAUDE.md`,
read these sections before changing anything:

- **“Option 1’s `ai*` panel — the agentic build”** — the thinking trail, the widget
  card, the summary card, the create-dashboard flow. Nearly every change below is
  recorded there with the annotation that asked for it.
- **“The composer IS the chat area”** and **“Scope — module-wise working”** — the
  composer was restructured and the Context chip was removed; the scope machinery is
  still live but its hand control moved into the `@` list.
- **“Re-verifying it — `_verify/`”** — how to re-run the three suites.

> The previous handoff (12:27) covered two parallel sessions and the `.aiamb` glow
> collision. That is all still true and settled; nothing from it was reopened here.

## What we worked on this session

A long, screenshot-driven refinement pass on Option 1’s AI chat panel: the answer
cards (summary, widget, create-dashboard), the composer, and finally unifying the two
different “thinking” treatments into one. Every request arrived as an image with a
one-line note, and each was built, probed, screenshotted in both themes, documented
in `CLAUDE.md` and committed on its own.

## Completed

Six commits, all **local** (`8a91191` → `fbbe5a5`), all verified.

**Composer**
- `.aiinbox` went from a flex row to a **flex column** holding the whole chat area:
  context chips → textarea → control row (📎 · Auto-approve · 🎤 · ➤). The
  Auto-approve toggle and the context row used to sit outside it.
- The **`Context <module> ▾` chip was removed** from that row. `aiScopeSel` and every
  guard reading it are untouched; `aiScopeMenu` / `aiScopeChip` / `aiScopePick` are
  kept unreferenced.
- **Modules joined the `@`-mention list** (`AI_MOD_S`, `aiEntList`) — all ten, under
  the board you are on, with descriptions and an `already in context` marker. Picking
  one widens `aiScopeSel`; removing its chip narrows it back. This is the replacement
  hand control for scope.

**Dashboard summary card**
- Every fact appears once: the header subtitle is gone (it only ever rendered as
  `Application Performan…` with a tooltip over the card), the board name is the first
  `.aisumeta` chip, and the heading that echoed the title is gone.
- `aiSumFacts()` reads the board’s own donut clusters and its largest offender pie, so
  the bullets carry the availability split, the alert total and critical share, and the
  single biggest source. **It also corrected a number** — `aiScope()`’s monitor total is
  `up + down`, which drops Unreachable and Maintenance (384 for a fleet of 400).

**Widget card**
- Footer is **`Edit · Accept`**. `Reject`, `Save widget` and the `Add to <dashboard>`
  row all moved below the card as follow-up chips; the destination chip **names** the
  board, since the card no longer shows it.
- The ⤴ share menu lost its `Copy` row on a widget (the summary keeps `Copy summary`).
- The flow’s **last step** closes on follow-up chips instead of a button row.

**Create-dashboard flow**
- Widget suggestions were added to the plan card, lost their heading, then **moved to
  the created card** below `Undo · Add a widget` — three separate requests, in that
  order. They now **send** (`aiDashFuGo`, which opens the new board first) and they
  **only render while the card is the last thing in the thread**.
- Fixed a real defect: every chip was phrased `Add …`, which matched none of
  `aiRoute`’s build alternatives, fell through to `metric`, and on the empty new board
  answered *“Nothing to report.”*

**The thinking trail**
- `aiTkHTML` now renders the same `.aitk.bx` card the agentic flow uses, with the same
  pixel loader, elapsed clock, Skip and collapsed `✦ <label> · N steps ›` header. One
  thinking treatment for every prompt.

## In progress

Nothing mid-flight. Working tree is clean and every suite passes.

## Next steps

1. **Push.** Six commits are local only; the live Pages site is six commits behind.
   Run `/publish` (or `git push`).
2. **Decide whether the widget flow’s closing chips should also expire.** The
   created-dashboard chips are now gated to the end of the thread; the widget card’s
   `Save` / `Reject` / `Put it on a dashboard` deliberately are not, because an
   undecided widget’s choices should stay reachable. Flagged to the user, not answered.
3. **Scope has no dedicated control any more.** It is set from the entry point, the
   mismatch card, or the `@` list. If that proves too hidden, `aiScopeMenu` can be
   pointed at a header ⋯ row in one edit.
4. **Options 2 and 3 have none of this.** Their `ac*` panel is unchanged and still
   byte-identical between them. Decide per change whether anything here should be
   ported, or whether the three options stay deliberately different.
5. Still open from earlier sessions: the **Log Explorer divergence** (Option 1 lost its
   log-sources panel and gained ✦ Ask AI; 2 and 3 did not), and **scrubbing the
   pre-existing internal hostnames and `172.16.x` addresses**, which are public.

## Decisions made

- **Follow-up chips became the standard “what next” shape** across the panel — the
  widget card, the flow’s last step, and the created dashboard all use `.aiful` +
  `.aifu` instead of button rows. Four equal-weight buttons made a card read as a form.
  ⚠️ Where a chip is an **action**, it calls its handler directly and must **not** go
  through `aiFollow()`, which sends the label as a new question.
- **A chip sends only when the thing it acts on exists.** On the plan card they filled
  the composer (`aiDashFuPick`); on the created card they send (`aiDashFuGo`).
- **The board name moved from a header subtitle into a chip** rather than being
  shortened. A subtitle that can only ever render as an ellipsis is not carrying the
  information it claims to.
- **`aiScope()` was left alone** when its monitor total turned out to be wrong; the
  summary got its own reader instead, because the other five answer types depend on it.
- **Boxing the ordinary thinking trail overturned an earlier deliberate decision**
  (`CLAUDE.md` had recorded that it was intentionally unboxed). The CSS did not change
  — only what asks for `.bx` did.

## Gotchas & notes

- ⚠️ **Measure the AI panel at 1280, not 1600.** At 1600 it is 408px and everything
  fits; at 1280 it is 348px. A task row rendered `Reading counters` as **“Readi…”** and
  looked fine in every 1600px probe. Fixed by making `.aitra` shrink before the label
  and dropping the `Completed` pill below 1300px.
- ⚠️ **Several “failures” this session were probe bugs, not code bugs.** `aiAgSave`
  early-returns unless `a.state === 'card'`; a user thread entry is `{r:'me', t}` not
  `.q`; `textContent` concatenates adjacent elements so `\b11 widgets\b` never matches;
  `aiOpen(where)` will not re-default the scope while `aiCtxItems` is non-empty. Read
  the assertion before touching the code.
- ⚠️ **Fonts and virtual time.** `shoot.py`’s default `--virtual-time-budget=2500` can
  screenshot before the trail has run or before Inter has loaded. Raise it to ~7000 for
  anything that animates.
- ⚠️ **`aiRender()`’s elapsed-clock hook now has two possible owners** (a running
  `agent` or a running `tk`). Anything else that wants the loader has to join that list.
- ⚠️ **`aiAgDest()` anchors its picker with `closest()`** and threw on `null.appendChild`
  the first time it was called from a chip outside the card. It now tries `.aiagfu` →
  `.aiagpl` → `.aiagc` and guards for no host.
- ⚠️ **Every follow-up chip’s text is sent verbatim to `aiRoute`.** Lead with the
  router’s own word (`Build`), never use “summary” (tested first, it wins), and name a
  family from `AI_AG_FAM` or the narrated build drops to the plain preview.
- Suites to re-run after any `ai*` change, from inside `_verify/`:
  `behave.py` (63) · `harness.py` (77 per scene) · `lxbehave.py` (51 in Option 1, 5
  skipped). All green at the end of this session. Both `behave` and `harness` paint
  their verdict into the PNG — re-run the generated `_out/*.html` under `--dump-dom`
  and take the **last** match to read it as text.
