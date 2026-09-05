# Handoff — 2026-09-05 23:30

## Read first

Two places in `CLAUDE.md`, in this order:

1. **"Pages (variants)"** (near the top) — it now opens with the eight-option map. The folder
   holds eight sidebar prototypes over the same content, and Options 6, 7 and 8 all descend from
   Option 5's page. **A change meant for all of them is an eight-file change.**
2. The sections for whichever option you are touching. The new ones are
   **"Option 6 — the card sidebar"**, **"Option 7 — one column, no rail"** and
   **"Option 8 — a second take on the nav column"**, each just above *Responsive*.

Also read **"An init-aborting crash on Windows and Linux, in six files"** — it is the one bug
this session found that affected everything, and it explains why no probe here could have caught
it.

## What we worked on this session

Three new sidebar options were built and then refined request by request against screenshots:
Option 6 from Plain's Sidekick, Option 7 from Notion, and Option 8 as a copy of Option 5 that
diverged. Along the way three real bugs surfaced that had nothing to do with the new work — an
init crash on non-Mac platforms, a hidden panel casting a shadow, and a rail painting over its
own border.

## Completed

**New options, all registered in the switcher and in `_verify/lxbehave.py`:**

- **Option 6 · `dashboard-card-sidebar.html`** — built from Plain's Sidekick, measured live in
  the browser. Rail + column + a "Next steps" card of four real Settings destinations with a
  count badge. Its floating-card look was **removed on request**, so both surfaces are flush now;
  it boots collapsed.
- **Option 7 · `dashboard-single-column.html`** — built from Notion, measured live. One 270px
  column, **no icon rail at all**, modules expanding to their own pages with Explorer nesting
  twice. Since refined a lot: Grafana's right-edge chevron, a neutral active fill, the workspace
  four moved to an icon footer row, Recents/Starred/Workspace/the MODULES header/the pinned bar
  all removed, popovers re-anchored, and the whole column put on one 2/8/12 spacing scale.
- **Option 8 · `dashboard-nav-column-alt.html`** — a copy of Option 5, then diverged: collapse
  hides the whole sidebar, hovering the 52px rail expands it to a labelled 190px sidebar over the
  column, and the rail is modules only on the folder's 34px pitch.

**Fixes that were not part of any request:**

- **An init-aborting crash in six files** — `init()` dereferenced `#sbKbd`, which does not exist
  in Options 5–8, inside a non-Mac branch. The dashboard never initialised on Windows or Linux.
  Proved by spoofing `navigator.platform`; guarded in Options 1, 4, 5, 6, 7 and 8.
- **Two paint bugs on Option 6**, both invisible to the DOM and found by sampling pixels: a
  hidden panel casting a 24px shadow across the canvas, and the collapsed rail painting over the
  sidebar's own 1px border.

**Earlier in the session:** the Settings category list collapses to an icon rail in all five of
the then-existing options, Option 5's Alert column and Setting column gained glyphs, and Option
1's flyout columns were equalised at 288px.

**A design canvas** was published for Option 7's spacing:
https://claude.ai/code/artifact/eaf6c152-b520-4f27-b320-1fee95cb3d96 — the sidebar, the same
sidebar with every gap measured, and the three-step scale. Built from the prototype's own tokens.

**Suites at the end:** `harness … query` 77/77 on every page touched · `lxbehave` 57/57 ×8 ·
`behave` 63/63 · per-option probes 52–109 assertions each, all green.

## In progress

Nothing mid-flight. Every change is applied, verified and written up.

**Nothing is committed or published.** `git status` shows eleven modified files and three
untracked ones (`dashboard-card-sidebar.html`, `dashboard-single-column.html`,
`dashboard-nav-column-alt.html`). The three new options exist only on disk.

## Next steps

1. **Commit and publish.** The three new option files are untracked, so a `git add` is needed
   before the Pages deploy or they will be missing from the live site.
2. **The shadow bug is still live in six files.** `html[data-theme="light"] .dpanel{box-shadow:…}`
   outranks `.dpanel.hid`'s `box-shadow:none` in Options 1, 2, 4, 5, 7 and 8. One line each —
   the fix is in Option 6 to copy.
3. **Option 1's Dashboard flyout is still wider than the others** (543 against 332) because of
   its Starred column. Equalising it means deciding what happens to that column — narrow it,
   stack it under the list, or drop it.
4. **Options 2 and 3 are behind on the icon work** — their Dashboard, SLO and Alert flyout rows
   still have no glyphs.
5. Option 5's Report column has no glyphs, while Option 1's Report flyout does.

## Decisions made

- **Option 6 lost the floating cards and Option 7 lost most of its list, both on request.** Each
  removed what made that option distinct, and both are recorded as such rather than quietly
  dropped. Option 6's tokens and Option 7's removed renderers are kept unreferenced so either is
  one edit from coming back.
- **Every removal was checked for other doors first.** Before Search, Iris, the pinned bar or the
  expand tile came out, the alternative routes to each were confirmed and written down.
- **Option 7's active row is one signal, not four** — a neutral fill, with teal reserved for the
  create rows. Chosen from four options put to the user.
- **Icons always come from `observeops-icons/` first**, then Lucide or Tabler; never drawn by
  hand. Recorded in the session memory as well as in `CLAUDE.md`.

## Gotchas & notes

- **A green probe is not a working feature, and this session proved it repeatedly.** Around a
  dozen assertion failures were the tests' own fault, nearly all one cause: nodes captured before
  a repaint. Re-query after anything that rebuilds a list, and keep a driver next to its
  assertion.
- **Measure the paint, not the DOM.** Three bugs reported correct values through
  `getComputedStyle` while the screen showed something else — a covered border, a stray shadow, a
  web component drawing outside its own box.
- **Deleting a later CSS rule beats adding an earlier one.** Two fixes silently did nothing
  because an older rule sat further down the sheet at equal specificity.
- **Headless Chrome here prints the DOM and then does not exit.** Read stdout on timeout rather
  than treating the timeout as failure.
- **Probe copies must be re-made after every edit**, including any assets they link to, or you
  verify the previous version.
- The user views these over a local server with no cache headers, so a plain reload can serve the
  old file. A hard reload or a `?v=` query is the fix — one report this session was a cached page,
  not a bug.

## Handoff

Whole-project context is in [CLAUDE.md](CLAUDE.md).
