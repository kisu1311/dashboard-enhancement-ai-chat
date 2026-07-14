# Side_bar_menu — ObserveOps sidebar & header prototype

## MANDATORY: consult the research notes for EVERY task in this folder

Before designing, changing, or adding anything here, read
`Dashboard-Research-Notes.md` (same folder) and ground the work in it. It is
the verified source of truth for the live product (build 8.2.6 + official
docs, adversarially fact-checked): module chrome, dashboard list panel,
NOC View, dashboard/widget actions, Create/Edit drawer fields, time-range
picker, widget catalog, RBAC, and refuted claims. Match its terminology,
field names, notes, and behaviors exactly; when inventing something new,
call out that it goes beyond the live product. Never contradict a fact in
the notes without flagging it to the user.

Single self-contained HTML prototype of the Motadata ObserveOps sidebar + header
navigation (based on the live 8.2.6 chrome): profile menu, notification bell
popover, spotlight search, and a 64→170px expanding sidebar with flat and
grouped views. `index.html` is the main prototype (V2 · Grouped Sidebar);
`index copy.html` is an earlier variant (V1 · Sidebar & Header Actions).
Open `index.html` directly in a browser — no build step.

## Variant switcher (auto-connected pages)

Every `.html` file in this folder is an option in a floating variant-switcher
pill (bottom-right of each page), rendered by `_variants.js`.

**MANDATORY: after creating, renaming, or deleting any `.html` file in this
folder, run:**

```bash
node "/Users/kishanpatel/ObseverOps/Side_bar_menu/_sync_variants.js"
```

It auto-adds the page to the switcher list in `_variants.js` (labelled
`V<n> · <page title>` from the file's `<title>` tag — so give new files a
meaningful title), injects `<script src="_variants.js"></script>` before
`</body>` if missing, and removes deleted files from the list. Never edit the
`VARIANTS:BEGIN…END` block in `_variants.js` by hand. The deploy workflow also
runs the sync on every push as a safety net, so the live site is always
complete even if a local run was missed. Files starting with `_` are ignored.

## Deployment
Repo: https://github.com/kisu1311/Side_bar_menu
Live URL: https://kisu1311.github.io/Side_bar_menu/
