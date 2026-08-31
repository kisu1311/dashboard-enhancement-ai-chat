# Handoff — 2026-08-31 23:19

## Read first

Four parts of `CLAUDE.md`, in this order:

1. **"The 31 Aug 2026 pass — Agentic AI, and the REAL design system"** — everything this
   session did. It **supersedes** several older statements; where anything conflicts, it is
   current. Read its *"Verifying this"* subsection before you touch the Agentic AI screen.
2. **`_ds/README.md`** — the vendored design system, why its CSS is deliberately not linked,
   and the six `obs-*` defects this session found.
3. **"Settings module (`st*`)"** and **"Compliance Settings (`stc*`)"** — the module the new
   category lives in, and the atoms it borrows.
4. The **`## Gotchas`** section — it gained three entries this session, all of which cost real
   time here.

## What we worked on this session

Built **Settings › Agentic AI** — a new 19th Settings category with an Overview screen and a
5-step provider-setup wizard — from a supplied React reference, and rebuilt it on the **real
ObserveOps design system**: the `obs-*` web components are now installed and vendored rather
than reproduced from CSS classes. The back half of the session was chasing three bugs that had
all shipped behind passing tests.

## Completed

- **`_ds/`** — `@mtdt/observeops-ds-elements` v0.1.166 (UMD) + `@mtdt/observeops-ds-css` v0.1.6
  vendored, with a README. Works over `file://` and on Pages, no build step.
- **The DS token set scoped to `#agPage,#agWiz`** — 389 tokens, both themes, generated from the
  shipped CSS and re-emitted against this prototype's theme convention.
- **Settings › Agentic AI › Overview** — `obs-page-header` + `obs-toolbar` + `obs-table`
  (the `list-view` recipe), replacing a hand-built hero card and provider-card grid.
- **The setup wizard as an `obs-drawer`** (62%, multi-pane) with an `obs-steps` rail, all five
  steps on real `obs-input` / `obs-radio` / `obs-select` / `obs-switch` / `obs-checkbox` /
  `obs-key-value` / `obs-banner` / `obs-tag` / `obs-button`.
- **Three real bugs fixed**, each found only by a real click: Configure fired into nothing
  (inert `oncellaction=`); Continue closed the wizard instead of advancing (a teardown read as
  a user close); the drawer blinked on every step (a slotted node was being replaced).
- **Two changes outside the block** — a right border on the Settings category list, and pinned
  modules anchored to `Setting` rather than to a group boundary.
- **A click-driven test suite** — `walk-*.html`, 39 assertions, every one a hit-tested pointer
  click. Plus a 42-assertion state probe and a 9-assertion pin-placement probe.

## In progress

Nothing mid-flight. All three option files carry a byte-identical `ag*` block and every suite
is green.

**One open question the teammate has not answered:** the four KPI tiles and three trend charts
in the configured Overview are a declared DS gap (`list_gaps`: charts / stat tiles are
STOP-and-ASK for a standalone build). They are drawn as inline SVG with token colours and the
offer to remove them still stands — it was raised twice and never picked up.

## Next steps

1. **Report the six `obs-*` defects upstream** — they are listed with their measurements in
   `_ds/README.md` and in the 31 Aug section. Several are registry-vs-build divergences
   (`obs-radio`'s missing `description`, `obs-input`'s ignored icons, `obs-drawer`'s
   never-emitted `close`).
2. **Decide the charts question** above — keep, or drop the whole Usage & health block.
3. If the Agentic AI category needs **more pages**, it is one `ST_TREE` array entry plus one
   `ST_PAGES` key; nothing else moves.
4. Consider whether the **other three screens** in the reference (Data & privacy, Governance,
   Usage & health) should be built — they exist in its source but it never routes to them, so
   they were deliberately skipped.

## Decisions made

- **The wizard is a drawer, not a full page.** It went full page → SLO-style full page → drawer
  across three requests. `obs-drawer` is the product's most-used overlay and the Overview stays
  readable behind it.
- **`obs-steps` stays a stepper.** Two supplied references (Create SLO Profile, Create Custom
  Report) use a section MENU in that rail, but ours is an ordered wizard and the registry
  forbids faking a sequence with a menu. The chrome was matched; the control was not swapped.
- **Violet marks what a thing IS; navy marks what to press.** The DS has no AI-accent token, so
  `--chart-indigo` paints the mark and `--primary` every primary action — the reference made
  every CTA purple.
- **Provider tiles are neutral lettermarks.** The reference paints vendor brand hexes; no DS
  token owns them, and its own data comments the field as "a neutral lettermark tile".
- **The DS CSS package is not linked, only re-emitted scoped.** Its light-on-`:root` convention
  is the inverse of this prototype's.

## Gotchas & notes

- ⚠️ **A green probe is not a working feature — this session proved it three times.** Every one
  of the three bugs passed the existing tests because the tests called handlers directly or set
  state by hand. Only `walk-*.html`'s hit-tested clicks catch this class.
- ⚠️ **The drawer's slide transition never completes under virtual time**, so nothing inside it
  is hit-testable until you park it with `dlg.style.transform='none'`. Do NOT inject
  `animation:none` — the panel parks off-screen and reads as "it did not render".
- ⚠️ **Regenerate the probe copy after every edit.** Patching a test script inside a stale
  snapshot reported an already-fixed bug as still broken. Cost a full round.
- ⚠️ **Several "failures" during the session were my own assertions**, not the code — wrong
  selectors (`obs-radio` has no `<input>`), wrong counts, and a pixel assertion on an animating
  box. Read the failure before changing code.
- ⚠️ **The browser tool could not open this project.** It refuses both `file://` and
  `localhost`, and the Agentation loader hangs headless runs — so everything was verified
  headless with the loader stripped. **The loader is the one variable never tested.** If
  something misbehaves in a real browser, press Agentation's ⏸ first: CLAUDE.md records that
  annotate mode sends clicks to Agentation instead of the app.
- The session's probe copies live in the scratch dir, not the repo — regenerate them from
  source rather than reusing them.
- `image.png` is untracked in the repo root and is not mine; left alone.
