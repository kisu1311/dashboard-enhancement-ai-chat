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

- **⚠️ `obs-button` fires a consumer's `onclick` TWICE for one real click.** The most serious
  one here, because it is silent. A pointer click targets the component's INNER `<button>` (in
  its shadow root); that event is `composed`, so it crosses the boundary and runs the host's
  `onclick` once — and the component ALSO re-emits a click on the host, running it again.
  Measured 1 Sep 2026:

      inner.click()  ->  onclick fired 2x          host.click()  ->  onclick fired 1x

  It is invisible while every handler is idempotent, which is how it survived several green
  probe runs — every probe clicked the HOST. The first non-idempotent handler exposed it at
  once: a TOGGLE (`Advanced settings`) flipped twice and the panel never opened — a dead
  control that automated checks all called working.
  ⚠️ Any automated check of `obs-button` must click `el.shadowRoot.querySelector('button')`,
  not the host, or it tests something a user never does.
  ⚠️ `onchange` is NOT affected — obs-checkbox / obs-switch / obs-radio / obs-select each fire
  once (measured). The Agentic AI screen routes every `obs-button` `onclick` through a small
  same-handler/60ms guard (`agTap`).

- **`obs-radio` renders a label and nothing else.** Its registry describes the `list` variant
  as "a mode chooser with per-option descriptions" and the Vue component has an `option` slot
  for it, but the web component accepts only `{value,label,disabled}` and escapes the label.
- **`obs-input` cannot show an icon in the field AT ALL — worse than the props being ignored.**
  `prefix-icon` / `suffix-icon` are documented in `elements-api.json` and read by the source,
  and the shadow root renders zero icons for them. The registry also lists `prefix` / `suffix`
  **slots**; those do not work either — the shadow root contains **no `<slot>` elements of any
  name**, so nothing in the light DOM is ever projected and a slotted `<obs-icon slot="prefix">`
  measures 0×0. Verified 1 Sep 2026 on 0.1.166.
  ⚠️ There is no way round it from the outside: the inner `<input class="field">` lives in the
  shadow root, so a consumer cannot add the left padding an overlaid icon would need. The DS
  ships no dedicated search element either (`search_components` routes a list search to
  "obs-toolbar `start` slot + obs-input"), so a toolbar search box in this build is a plain
  field. The Agentic AI toolbar leaves it plain rather than hand-drawing a magnifier.

Both are worked around in the `ag*` block and noted at the call site.
