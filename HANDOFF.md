# Handoff — 2026-09-10 19:30

## Read first

In `CLAUDE.md`, three sections carry everything this session touched:

- **“Options 10, 11 and 12 — the rail + flyout family”** — the whole day's work, including
  the new **“Option 12 — Gemini's rule”** and **“The 10 Sep 2026 pass”** subsections.
- **“Pages (variants)”** — the option table is now **twelve** rows, and the lineage warning
  (Options 10/11/12 share `mf*` / `sbNotif*` / `RAIL_TMP` / `railPin*` with **nothing syncing
  them**) is the thing most likely to bite next.
- **“Their shortcuts are LETTERS”** — `VS_LETTERS = ['x', 'z']`, and the rule for adding a
  thirteenth.

## What we worked on this session

Iterated Options 10 and 11 (`dashboard-rail-flyout.html`, `dashboard-rail-flyout-alt.html`)
through ~20 small image-driven requests on the sidebar — marks, sizes, the Ask-AI ramp, the
Explorer grid's tiles and pin badge — then created **Option 12** as a third copy of Option 10
and gave its sidebar **Gemini's behaviour**. Two rounds were published to GitHub Pages.

## Completed

- **Two commits pushed and verified live** on Pages (the deployed HTML was checked, not just
  the URL): `a79344f` and `cb28e4b`.
- **Options 10 + 11, in lockstep**: the rail's 18px “has a list” chevron on rows that really
  have one; the flyout's own row arrows added and then removed again; Ask AI on the brand ramp
  as a 10% wash (15% hover) with the label clipped from the full ramp; the Explorer grid's icon
  box at 40px, border-only at rest and `--card` on hover; the pin badge tilted 45° and 2px
  inside the corner; the pin moved into the popup heading as that same badge; brand mark 24×24;
  brand row 56px; collapse glyph 20px in a 32px button; the ⌘K keycap rebuilt and its ink at
  50%; What's new 2px under the quick links; light `--sidebar` `#F6F9FC` in all twelve options.
- **Two bugs that were dead CSS states**, both found by measuring rather than looking: the
  collapse arrow keyed off `.sidebar.open`, which is true whenever that button is visible, so
  its second state was unreachable (now `body.pinned`); and a stale
  `.mfsec .mfsp:hover{background:var(--hover-side)}` one line below the real rule at the same
  specificity, which repainted the pin badge into the surface behind it (1.02:1).
- **Option 12** — `dashboard-rail-flyout-alt2.html`, byte copy of Option 10, registered in
  `_variants.js` (label **Option 12**, shortcut **Z**) and in `_verify/lxbehave.py`'s `FILES`.
  Its sidebar follows Gemini: **no hover expand**, the toggle present and centred in **both**
  states, the header row no longer a toggle.
- **Verification**: ~15 headless probes this session, all green at the end; `harness … query`
  **ALL 77 PASS** on Options 10, 11 and 12; `lxbehave` **ALL 57 PASS × 12 files**; `Z` proved by
  real navigation in a real browser over `python3 -m http.server`.

## In progress

**Option 12 is not committed.** `git status` shows `?? dashboard-rail-flyout-alt2.html`,
`M _variants.js`, `M _verify/lxbehave.py`, plus this handoff and `CLAUDE.md`. Everything is
verified — it only needs `/publish`.

## Next steps

1. `/publish` — commit and push Option 12 (the new page, `_variants.js`, `lxbehave.py`,
   `CLAUDE.md`, `HANDOFF.md`).
2. Decide the two Gemini traits deliberately **not** copied into Option 12: its **292px**
   expanded panel (ours is 240, the UX-rule floor — one token), and its **borderless**
   rail-to-content edge (see the reason in the Option 12 section before changing it).
3. Option 11's footer still orders What's new **first**, so its 2px top margin was left alone —
   match it if you want the two files identical there.
4. `#notifPop` is still the only popover on `--pop` (white) and still has its caret; the two
   files carry different What's-new tooltips. Both flagged, neither decided.
5. **Scrub before the next public push**: this folder still ships internal hostnames and
   `172.16.x` addresses from before today (SNMP/cluster/NCCM tables, Option 1's AI starters).
   Nothing new was added today.

## Decisions made

- **Option 12 changes BEHAVIOUR only.** Gemini's 292px width and borderless edge are
  appearance; the width would eat canvas the harness is measured against, and dropping the
  border would leave a 1.04:1 boundary in light — the exact fault this folder recorded twice.
- **`sbHover` was neutralised with one early `return`, not by unpicking its six callers**, and
  its whole body (including the collapse watchdog) was kept — the request said not to remove
  any thinking, and it is the record of the bug it was built for.
- **The collapse arrow flips on `body.pinned`, not `.sidebar.open`** — that is the state the
  button actually toggles, and it makes the glyph agree with the tooltip it has always written.
- **The ⌘K keycap's ink is 50% and that is below 4.5:1** (3.16 dark / 2.72 light). Requested
  twice, on a shortcut hint beside a row that already reads “Search”; written down rather than
  quietly softened.
- **The Ask-AI label is the full ramp on a 10% wash of itself**, which is under 4.5 at two of
  the three stops. Look chosen over ratio, deliberately, on two short words.
- **A pinned or temporary rail row with no children keeps the pin, not the arrow** —
  `mfOpenPin` refuses those rows, so an arrow would point at a menu that never opens.

## Gotchas & notes

- ⚠️ **`--dump-dom` cannot observe a navigation** — it never emits and the run must be killed.
  Test the switcher key with `python3 -m http.server` + the browser tools. The browser tool also
  **refuses `file://` URLs**, so http is the only route.
- ⚠️ **A probe copy is written as `q-0.html`**, so `location.pathname` says nothing about which
  option it is and `_variants.js`'s `here` never matches. Key off the page's **title**, and test
  `.vs-item.on` in a sandbox that keeps the real filenames.
- ⚠️ **A forced `:hover` stand-in with `!important` hides cascade bugs** — it beat both rules
  and reported the intended colour while the badge was visibly wrong. Read the CASCADE:
  enumerate every rule matching the selector and assert there is exactly one.
- ⚠️ **`color-mix()` serialises as `color(srgb 0..1)`**, not `rgb(0..255)`. A probe dividing by
  255 reported 1.79:1 and 17.66:1 on correct CSS.
- ⚠️ **A token's value depends on where it is read.** `--text-dim` is `#7186a8` scoped to
  `.aipanel` but `#5b6b85` at `:root` — I quoted the wrong one and overstated a contrast failure.
  Resolve tokens on the element under test.
- ⚠️ **A flex item's `inline-flex` is blockified to `flex`** — an assertion on the declared
  value fails on correct CSS.
- ⚠️ Several probes failed on working code by asserting a shared expectation across files whose
  behaviour genuinely differs (Option 10 hides its collapse toggle on purpose; Option 11's button
  hides the sidebar rather than unpinning). **Branch the probe on the file's own behaviour.**
- `gh` is **not installed** on this machine and is not needed: the repo, remote, Pages workflow
  and Pages source all exist, so a plain `git push` is the whole publish.
- The Gemini reference was **driven and measured** at gemini.google.com (rail 52px,
  `transition:background-color .3s`, hover expands nothing, one toggle in both states) — the
  numbers in the Option 12 section come from that DOM, not from a screenshot.
