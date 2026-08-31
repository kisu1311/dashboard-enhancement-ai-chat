# `_ds/` — the ObserveOps design system, vendored

The **Agentic AI** settings screen (`Settings › Agentic AI › Overview`, the `ag*` block in all
three option files) is built from the DS's **real web components**, not from CSS-class
reproductions. The contract is explicit about this:

> Build with the REAL components — the framework-agnostic Web Components
> `@mtdt/observeops-ds-elements` … reconstructing from CSS classes is a fallback only.

## What is here

| file | what | why it is committed |
|---|---|---|
| `observeops-elements.umd.js` | `@mtdt/observeops-ds-elements` **v0.1.166**, the UMD build, verbatim | registers the 47 `obs-*` custom elements. A `<script src>` works over `file://` **and** on GitHub Pages, so the prototypes keep opening with no build step |
| `observeops-ds.css` | `@mtdt/observeops-ds-css` **v0.1.6**, verbatim | **NOT linked by any page.** It is the source the scoped token block in each option file is generated from — kept so a regeneration needs no network |

Both are public on npm, no auth:

```bash
npm install @mtdt/observeops-ds-elements @mtdt/observeops-ds-css
```

## ⚠️ The CSS is deliberately not linked

`observeops-ds.css` declares its **light** values on `:root` and its dark ones under
`[data-theme='dark-theme']`. This prototype is the other way round — **dark is the default**
and light is `html[data-theme="light"]`. Linking it would put the whole page into the DS's
light theme while the prototype sits in dark, and would leak ~390 tokens (`--primary`,
`--border-color`, `--page-text-color`, …) onto the dashboard, the Log Explorer and Settings.

Instead each option file re-emits the same values **scoped to `#agPage,#agWiz`**, against this
file's theme convention. The `obs-*` elements read them through the cascade — custom properties
inherit into shadow DOM — so scoping costs the components nothing.

## Regenerating the scoped token block

If the CSS package is updated, re-extract with a **quote- and paren-aware** declaration
splitter. ⚠️ A naive `split(';')` corrupts the sheet: `--graph-bg` is a `url('data:image/svg+xml;…')`
whose value contains its own `;`, which leaves an unterminated string and silently drops
**every rule after the token block**. That happened once; the symptom was a page with correct
colours and no layout at all.

## Known gaps in v0.1.166, found while building this screen

- **`obs-radio` renders a label and nothing else.** Its registry describes the `list` variant
  as "a mode chooser with per-option descriptions" and the Vue component has an `option` slot
  for it, but the web component accepts only `{value,label,disabled}` and escapes the label.
- **`obs-input` ignores `prefix-icon` / `suffix-icon`.** Both are documented in
  `elements-api.json` and read by the source, but the shadow root renders zero icons.

Both are worked around in the `ag*` block and noted at the call site.
