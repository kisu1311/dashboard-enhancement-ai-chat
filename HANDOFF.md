# Handoff — 2026-08-24 13:30

## Read first

One file changed this session: **`index copy.html`** (Option 1). Options 2 and 3 untouched.

In `CLAUDE.md`, read **"Manage dashboards (`md*`) — Option 1, built from the ServiceOps
revamp"** first. It is a new section and it carries the whole thing: what the reference
screen does, which of this prototype's components each part reuses, the deliberate
differences, and the four traps the build hit.

## What we worked on this session

Drove the ServiceOps revamp prototype in the browser, read its **Manage all dashboards**
flow off the live DOM, and built that flow into Option 1 as a full-page screen — then
rebuilt its visuals on this prototype's own components after the first pass came out looking
like the reference product instead.

## Completed

**The flow** (`md*` namespace, `#view-manage`, reached from *Manage dashboards* at the foot
of the dashboard list panel):

- **Faceted filter bar** — the four fields Category · Visibility · Status · Owner; each
  becomes a chip with its own **Is / Is not** operator and a checkbox list, committed with
  Done. Plus a plain keyword search.
- **Four tabs with live counts** — All · Created by me · Shared with me · Archive.
- **Bulk bar on selection** — Move to category · Disable all · Archive · Clear.
- **The table** — ☐ · Dashboard · Category · Technician access · Status · Updated · Actions,
  five columns sortable.
- **Row actions** — Duplicate · Edit · Schedule · History · Archive, with **Archive absent
  on system dashboards** (the rule behind the reference's 4-action / 5-action row split).
- **Inline row confirm** — *"Archive this dashboard? Yes No"*, not a modal.
- **Archive tab** — swaps the actions for Restore / Delete forever.
- **Two drawers** — History (date range + audit log) and Schedule.

**The visual rebuild** — the screen is now assembled from components the file already has:
`.pagehead` + `.ttl` for the head, **`.stcgrid`** for the table (the grid cloned from the
live product for Compliance Settings), `.btn` / `.btn.pri`, `.stcib` for row actions,
`.dtabs` / `.dtab`, and `.ddswitch` for the status toggle. Only the bulk bar, the inline
confirm, the filter popover and the drawer bodies are new.

## In progress

Nothing mid-flight — every step was verified before the next began.

**Two open questions, both needing your call:**

1. **`Report` is in two places.** It is a rail entry *and* the last row of Explorer's
   flyout, because `sidemenu.md` puts it at the top level and your later message listed it
   among Explorer's sub-modules. Both are your specs; I did what each asked rather than pick.
   This is unchanged from the previous handoff.
2. **`DASH_GROUPS` grew from 2 dashboards to 8** so the manage table has something to
   manage. The grouped/flat pair you rely on (Log Statistics, Application Performance) is
   untouched and still first, and `MD_META` hangs the management-only fields off those names
   rather than duplicating the list. Say if you want it trimmed back.

## Next steps

1. **Answer the two questions above.**
2. **Nothing is committed.** `index copy.html` and `CLAUDE.md` are the modified files; last
   commit is `48ea49a`. Run `/publish` to put this live.
3. **Options 2 and 3 are a long way behind Option 1** — none of the AI panel work, the rail
   rebuild or this screen is in them. Decide whether Option 1 is now the reference.
4. **The third `.stop` collision is still open.** Option 3's `ac*` panel toggles a bare
   `'stop'` on `.acsend`, carrying the same sidebar-`.stop` bug fixed in Option 1. It is a
   three-file change because that block is byte-identical across all three.

## Decisions made

- **Read the reference in the browser, not from screenshots.** Every column, operator,
  action and confirm was measured off the live DOM — which is how the 4-vs-5 action split
  turned out to be "system dashboards cannot be archived" rather than an arbitrary
  difference.
- **Reuse the product-cloned grid rather than style a new table.** `.stcgrid` was cloned
  from the live product for Compliance Settings, so borrowing it means this screen's header
  case, row height, borders and hover *cannot drift from the product* later.
- **One source of truth for which dashboards exist.** `DASH_GROUPS` owns the list; `MD_META`
  only hangs the management columns off those names. Duplicating them would let the list
  panel and the manage screen disagree about what exists — the one thing a management screen
  must never do.
- **Archive is reversible, Delete forever is not.** Archive is a `MD_ARCH` set; only
  `mdDeleteGo` touches `DASH_GROUPS` / `DASH_INDEX`, which is what the list panel reads.
- **Colours stay on this file's tokens.** ServiceOps is light-only; its primary, ink and
  bulk-bar tints have no dark counterpart, so importing them would put four colours in the
  file that no token owns.

## Gotchas & notes

**Four traps, all already recorded elsewhere in `CLAUDE.md` and all hit again:**

- **`.mdfb input` matched the checkboxes inside `.mdfpop`**, which is a child of the bar —
  `min-width:120px` turned every filter checkbox into a 120px black slab and pushed its
  label right. Scoped to `.mdfb>input`. The `.agpfgt span` / `.awrow svg` trap.
- **The host sheet styles a bare `th`** (uppercase, 10.5px). My table inherited it. That one
  resolved itself when the table became `.stcgrid` — the product *is* uppercase here, so my
  earlier "fix" to sentence case had been matching the wrong product.
- **`table-layout:fixed` takes its widths from the first row** — the drawer tables' column
  widths had to go on the `<th>`s, or five columns split evenly.
- **Row checkboxes need `accent-color` AND `color-scheme`** — `accent-color` only tints the
  *checked* fill, so unchecked boxes painted bright white in dark theme.

**Two process notes worth keeping:**

- **A stale screenshot copy fooled me again.** I regenerated the probe but not the
  screenshot HTML, so a picture kept showing a clipped confirm that was already fixed while
  the verdict was green. Regenerate *both*, every time.
- **A Python edit script that throws before its final `write()` loses every earlier edit in
  that run.** Two `<th>` width edits silently didn't land because a later `one()` assertion
  failed. Re-check the file, don't assume partial success.

**Environment**

- `image.png` in the repo root is still an untracked reference screenshot, not part of the
  prototype. Left alone.
- The reference is `zenichakalasiya.github.io/ServiceOps_Dashboard_v2/#/dashboards` — it is
  a *different product's* prototype, so treat it as a flow reference only, never a visual one.
