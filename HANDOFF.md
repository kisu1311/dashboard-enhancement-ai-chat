# Handoff — 2026-09-01 22:09

> ⚠️ **TWO SESSIONS RAN IN THIS FOLDER TODAY, IN PARALLEL.** This handoff covers both.
> Stream A (Option 4 + the Settings extraction) and Stream B (the Agentic AI rebuild) were
> written by different sessions and edited the same files minutes apart. Neither clobbered the
> other, but **mtimes are not a reliable signal of who wrote what — re-read before editing.**

## Read first

1. **CLAUDE.md → "The 1 Sep 2026 pass — Agentic AI cleared and rebuilt from the reference"** —
   the screen as it now stands, the two undocumented `obs-table` capabilities it is built on,
   and the `obs-button` double-fire defect that made a control silently dead.
2. **CLAUDE.md → "Option 4 — the labelled rail"** — the new page and its divergences.
3. **CLAUDE.md → "The Settings module lives in its own files now"** — the extraction and its
   load-order contract.
4. **CLAUDE.md → "Each option now demonstrates a DIFFERENT sidebar pattern"** — four rows now.
5. The **`## Gotchas`** section.

## What we worked on this session

**Stream A — Option 4 and the Settings extraction.** Built `dashboard-labelled-rail.html`
(Option 1 with monday.com's labelled side navigation and a docked detail panel), and lifted
the `st*` / `stc*` / `ag*` blocks out of `index copy.html` into `_settings-module.css` +
`_settings-module.js`. The page went 2,024,257 → ~1,700,000 bytes and behaves identically.

**Stream B — Agentic AI, cleared and rebuilt.** The whole screen was deleted on request and
rebuilt reference by reference on the real `obs-*` elements: integration header → toolbar →
a provider grid whose rows expand to their usage widgets, and a full-page Configure flow
(provider rail → credentials with a staged connection test → model selection → data consent →
done) with a Help Card column.

## Completed

**Stream A**
- `dashboard-labelled-rail.html` — labelled rail, docked detail panel, hover flyout stood down
  (not deleted). Added to `_variants.js`; the sync reports no change.
- `_settings-module.css` / `_settings-module.js` — the blocks lifted byte for byte.
- `_verify/behave.py`, `shoot.py`, `harness.py`, `lxbehave.py` — all four wrote their probe
  copy into `_out/`, so every relative asset 404'd and they had **never** loaded the DS bundle
  while still reporting green. All now inject a `<base>`.
- Verified: `lxbehave` 57/57 ×4 · `behave` 63/63 · `harness` 77/77 · Playwright Agentation on
  all four pages · a ~40-assertion walk for Option 4.

**Stream B**
- The Agentic AI screen rebuilt end to end in Options 1, 2 and 3 (see CLAUDE.md for the parts).
- `agTap` — a same-handler/60ms guard on every `obs-button` `onclick`, because the element
  fires a consumer's handler **twice** for one real click. This had shipped a **dead Advanced
  settings toggle** that every probe called working.
- `_verify/dsconf.py` + `_verify/ds-gaps.json` — a DS-conformance harness for this screen.
- Per-provider rail icons (`eye` / `book-open` / `thunder-bolt`) on the provider record as `ic`.
- Verified with hit-tested pointer clicks throughout (30/30 on the full flow, 12/12 on the
  provider grid, 17/17 on the Help Card, and more). Current conformance: **Overview 100/100 ·
  Configure 89/100**, all scenes pass in all three files.

## In progress

**Nothing half-written, but one file is behind.** ⚠️ **`dashboard-labelled-rail.html`
(Option 4) has the `ag*` block at a MID-SESSION state.** It was copied from Option 1 partway
through Stream B, so it has `.aggrid` and the wizard but **not**: the Help Card, the
per-provider icons, the usage `obs-table` with `expandable`, `agSeed`, or the three-provider
rows. Verified by grep — `aghelp` 0, `thunder-bolt` 0, `agUse` 0, `agSeed` 0.

## Next steps

1. **Bring Option 4's `ag*` block up to date** — it is the only file showing an older Agentic
   AI screen. Easiest path is to take the block from `_settings-module.js` / `.css` rather than
   replay the edits.
2. **Point Options 2, 3 and 4 at `_settings-module.*`.** They still hold inline copies, so the
   block is no longer byte-identical across the four files — the property CLAUDE.md has
   asserted since 19 Aug 2026. One `<link>` + one `<script src>` each, then delete their copies.
   This is what makes today's "every change three times, in two shapes" go away.
3. ⚠️ **`_settings-module.css` and `_settings-module.js` are UNTRACKED and NOT gitignored, and
   they MUST ship** — Option 1 renders unstyled without them, exactly like `_ds/`. Commit them
   with everything else. Nothing from today is committed.
4. **Answer the open Agentation note on the wizard stepper** — three "improve this" notes are
   open with a reply listing five specific options (size, spacing, completed-state colour,
   horizontal→vertical, or something else).
5. **Report the `obs-*` findings upstream** — the `obs-button` double-fire, `obs-table`'s
   undocumented `expandable` + `sparkline`, and `obs-input`'s missing icon slots.
6. Publish (`/publish`) once the above is settled.

## Decisions made

- **The provider grid lists all three providers**, the connected one with figures and the other
  two with an em dash — *nothing measured* is not the same as *measured zero*. This reversed an
  earlier "single config, single entry" call made the same day.
- **The usage widgets live in the row's expand**, not as sections down the page — built on
  `obs-table`'s own `expandable`, not a hand-built accordion.
- **The Help Card's section headers are raw `<button>`s.** The DS ships no accordion (52
  registered elements, checked), the checker treats raw controls as an advisory for an
  unshipped organism, and a `<div role=button>` would trade real keyboard support for a better
  score. This is why Configure scores 89 and not 100.
- **Primary buttons are navy, not the reference's violet** — the DS states twice that the brand
  is `--primary`.
- **No provider logos** — the DS has none and says never to hand-draw a brand mark; the rail
  icons are read from each provider's own tagline instead.
- (Stream A) Option 4's panel is docked at 340px; its active tile is a `--pill` fill; the
  Settings CSS is a real `.css` file because its comments carry 218 backticks.

## Gotchas & notes

- ⚠️ **`obs-button` runs a consumer's `onclick` twice for one real click** (inner 2 / host 1).
  Invisible until a handler is not idempotent. Guard with `agTap`, and **click the inner
  shadow `<button>` in any probe** or you are testing something a user never does.
- ⚠️ **A green probe is not a working feature, and this session proved it three times**: the
  dead toggle above; the conformance harness scoring pages where no `obs-*` had loaded; and two
  *false failures* of my own making (clicks landing outside an 800×600 `--dump-dom` viewport,
  and asserting `borderBottomWidth` on a divider that `no-divider` makes transparent).
- ⚠️ **Check a token against the surface it lands on, not by its name.** Two same-colour
  collisions bit today, each in one theme only — see CLAUDE.md's "Token collisions".
- ⚠️ **A `const` read before its declaration aborts the whole block.** `agSeed()` reads
  `AG_TASKS`; running it inline threw a `ReferenceError` that took the entire screen down. It is
  a function now, called at the foot of the block.
- ⚠️ **Regenerate the probe copy after every edit** — a stale copy reported a fixed bug as still
  broken, twice.
- ⚠️ **The Agentation queue was flooded**: ~35 copies of one stuck `#agTbl` rearrange from a
  browser tab that was never reloaded, which **buried two real notes**. The delta was identical
  every time — that is a stuck pending rearrange being re-saved, not new feedback, and only a
  reload clears it. Ask for a reload before reading the queue.
- `dashboard-labelled-rail.html` and `image.png` are untracked alongside the two module files.
