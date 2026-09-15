# Handoff — 2026-09-14 (late evening)

## Read first

Everything this session touched is the **Settings module** and the **Product License** page. In
`CLAUDE.md`, four sections carry it, newest first:

- **"The last four 14 Sep 2026 requests"** and **"The later 14 Sep 2026 License requests"** —
  the newest state of Options 2 and 3's quota cards; where they conflict with the sections below,
  they win.
- **"Option 2, third design"**, **"Option 4 — the one-card licence"** and **"Option 5 — the
  one-card licence, borderless"** (all 14 Sep 2026) — what the License page's switcher now offers
  beyond Options 1 and 3. The 13 Sep *licence strip* section carries a superseded banner.
- **"The License page, re-audited against the DS (12 Sep 2026)"** — the two component
  mis-selections a 100/100 score could not see, the `obs-drawer` swap, and the dark-theme
  token-scope trap.
- **"One file called `setting.js` (12 Sep 2026)"** — the current address of the whole module.
- **"Options 2, 3 and 4 share the Settings module too (12 Sep 2026)"** — how the last three
  inline copies were removed.

⚠️ Two standing claims were **corrected rather than left**: the 1 Sep section
*"The Settings module lives in its own files now"* now opens with a superseded banner, and the
*Pages (variants)* note now says **all thirteen options load `setting.js`**.

## What we worked on this session

Consolidating the Settings module into one shared file, then two rounds of design work on the
Product License page — a DS re-audit of the existing screen, and a new Option 2 built from
supplied cards.

## Completed

- **Agentic AI Option 1 / Option 2, 16 Sep** — ⚠️ not committed (`setting.js`): a header switcher; Option 2's overview is
  one connected-provider panel (details + three trend charts, no grid/search); its Configure drawer is a 684px side panel with
  a segmented provider picker, credentials, one terms checkbox + links, no rail/help/advanced/models/data terms; Enable AI
  gates on test + terms. Option 1 unchanged. See CLAUDE.md › *Settings › Agentic AI — Option 1 / Option 2*.
- **Option 13 pin intro, 15 Sep (night)** — ⚠️ not committed (`dashboard-rail-flyout-alt3.html` only): every Explorer
  sub-module row shows a blinking teal DOT at rest (its pin, right after it, stays hover-only) until read (third build — a blinking pin, then a
  dot replacing the pin, were both rejected; the dot then swapped from after the pin to before it); hovering or clicking a dot opens the *Pin a sub-module* picture card; the pin still
  pins. Read = Got it or any pin press (localStorage `oo13-pin-intro-read`) — the dots go and the pins return to hover-only;
  `mfPinIntroReset()` replays it. Probe 29/29, dark and light screenshots. See CLAUDE.md › *Option 13 — the pin, its blinking
  dot and the picture intro*.
- **Settings accent + License demo data + Option 4, 15 Sep (night)** — ⚠️ not committed: the whole Settings module's
  accent is **#cad3e2 dark / #1d2a3e light** instead of teal (one token override on its five roots; DS `--primary` →
  `--primary-alt`); the five add-ons show **10 used** on every option (shared `LIC_DATA`); Option 4 — licence card
  columns 1.2fr / 1fr / 184px above a 1080px card, ring stroke 8, *In use* tiles wear `utilization`, no dot on Healthy
  or Status, card borders `--widget-border-color`, no header Upgrade Now, APM's split flush under its tiles with amber /
  aqua swatches; the 1280 sparkline clipping is fixed (chart hidden under a 300px tile). Later the same night: Option 4's
  add-on buttons read "History"; the Activation Code dialog puts the paste box first; a RUM card with the ring in the header
  (built on Option 4, moved to Option 5); Option 4's EPS tab is Option 5's (LIC_EPS5) with no swatches, top-right tags, a 24h time axis
  with a visible timeline, signal-coloured allocation bars, and the usage tab's card border + 10px padding. Details in
  CLAUDE.md *"The Settings accent, demo usage, and the last Option 4 batch"*.
- **License · Option 4, 15 Sep (evening)** — ⚠️ not committed: add-on rings are the tiles' height (66px token) and
  their pill sits beside the name reading *Healthy* only; the devices card lost its figure line and its tiles' "% of
  used"; ring figures 20px semibold with totals in k (*of 5k*); tile titles semibold; Option 2's gradient name +
  inline chip on the licence card, no eyebrow, sentence-case 12px labels, 15px semibold values, 57ch description,
  a filled borderless *Activation code* button (the shadow-root restyle is gone), View history / Last N days icons
  swapped, and the three licence sections share one top and bottom (ring 100px). See CLAUDE.md *"Option 4 — sixteen
  more requests on the licence and quota cards"*.
- **License, 15 Sep (latest batch)** — ⚠️ not committed: the tabs have **no icons** on every option;
  Option 2's term line reads *1,432 days · Ends 17 Aug 2030*, its name and edition chip take the **live
  product's license-hero gradient** (scoped `--license-*` tokens), and its term block + Activation code
  button are **top-aligned** with the name row; Option 4's licence card lost its **term bar** and its
  **Activation code** is a collapsed toggle under the description that opens the code row (no rule),
  its **Monitored devices** card is a figure line over the add-on ring + three tiles (the change is a
  *Last N days* tile) with a **left-aligned legend**, and **every Option 4 card is padded 10px**. DS
  conformance: 100 × 4 scenes, **96 on Option 2** (the live blue fails the DS brand-navy rule) and **98 on
  Option 4** (the restyled transparent button) — both declared, both what was asked. See CLAUDE.md
  *"The tabs, Option 2's live colours, and six Option 4 changes"*.
- **Options 2 and 4, 15 Sep (later)**: four Agentation notes on Option 4 (bordered record fields, a
  smaller ring figure, a thicker ring, the add-on status pill top-right after View history) — resolved;
  **History opens Option 5's centred modal on Options 2 and 4 too** (Option 1 keeps the drawer); Option 2's
  licence card: the edition description added, the Activation code section replaced by an *Activation
  code* button (opens the existing modal), the *ObserveOps edition* label row removed, *Expires* replaced
  by a *Status* tile carrying *Activated*, and no % inside the ring. ⚠️ Not committed. DS conformance
  **100/100 × 6 scenes** after these. See CLAUDE.md *"Options 2 and 4 — Agentation notes, the History modal, and a
  trimmed Option 2 licence card"*.
- **Option 5's EPS Trend Breakdown tab is four stat cards, a drop-policy note and the allocation
  card** — Hardware ceiling · Allocated · Ingested live · Drop status as individual borderless cards
  (from a supplied strip), the two drop-policy rules as an info `obs-banner`, then *Dynamic EPS ·
  allocation by signal* (an `obs-toolbar` head, one bar per signal with an allocation marker, ingested
  fill and over-quota shading, a legend), then *Calculated vs actual EPS · per telemetry* — Total plus
  four signal cards whose trend lines are **Highcharts v10** (loaded from jsDelivr only on that tab,
  configured from the DS's captured `chart-multi-line` fixture: smooth line, soft fill, dashed allocation
  line, hover crosshair + Ingested · Dropped · Allocated tooltip). The Total card's top accent line was
  removed on request. ⚠️ Highcharts is commercially licensed and now fetched by the public Pages site;
  offline, a hand-drawn SVG stays in its place. Everything else on that
  tab is gone for Option 5 only; Options 1, 2 and 4 keep the full tab. Figures are `LIC_DATA`'s (951 /
  511 / 54%), not the picture's 949 / 0; Allocated and ingested share `--info-text`. See CLAUDE.md *"Option 5 — the EPS tab: stat cards, a drop-policy note, the allocation card
  and Highcharts trends"*.
- **Option 5's History opens a full-width `obs-modal` laid out like Metric Explorer** — a head row
  (title + token · RANGE · the window's dates · Export as CSV · ✕), a wide chart with a date axis and
  the license-cap line, and the five figures (Current · Period start · Peak · Average · Change) under
  it. **The details are the earlier centred popup's, unchanged** — only the layout moved, per the
  follow-up request. Options 1, 2 and 4 keep the drawer. The devices card rebuild made just before was
  **reverted on request**. See CLAUDE.md *"Option 5 — History opens a full-width modal, laid out like
  Metric Explorer"*. ⚠️ No header icon (obs-modal draws one only in its confirm variant); a 0-usage
  chart still labels its axis 1, 1, 1, 0, 0 (pre-existing).
- **Option 5's cards reworked again**: the add-on cards follow the supplied SLO / NetRoute reference
  cards (header with the status top-right, In use · Available · Allotted figures, a usage row, a
  footer with the window's change and View history — the ring is gone); the Monitored devices card's
  Agentless / Agent-based tiles carry the unit inline and a share bar; *By device type* and its line
  are gone on both options. See CLAUDE.md *"Option 5 — reference-card add-ons, share-bar device
  tiles, no type heading"*. ⚠️ Both references draw a rule above their footer; it was not added.
- **Option 5 of the License page**: every card borderless on the licence card's fill; the licence
  card's top row aligned (edition eyebrow on the *License type* line, the term bar level with the
  description, record rows evenly spaced); the add-on cards two across (one column under a 1000px
  pane), View history centred on each title. See CLAUDE.md *"Option 5 — no card borders, a
  top-aligned licence card, add-ons two across"*. ⚠️ RUM sits alone at half width in the last row.
- **Option 4 of the License page lost three lines and gained tiles** (the last four requests): no
  rule above the licence card's term bar; no *By device type* heading or line on the Monitored
  devices card; the add-on cards' *In use · Available · Last N days* are Agentless-style tiles on
  all five cards; no line under the add-on headers (APM's split rule stays). Option 5 untouched.
  See CLAUDE.md *"Option 4 — three lines removed, and the add-on facts become tiles"*.
- **Every box in the Settings module has 4px corners** (latest request, all options, all 13
  pages). PART 1's off-scale radii went to 4px, and an `attachShadow` hook gives the design-system
  components' shadow roots a small per-tag sheet — the widget header, the Activation Code modal,
  banners, status pills, checkboxes and menus. Circles and the two switch tracks stay round; tiny
  bars and swatches keep their 2–3px. See CLAUDE.md *"Every box in the Settings module has 4px
  corners"*. ⚠️ **Status pills (Healthy / Active) are now 4px tags** — say so if pills were meant
  to stay round; it is one line in the hook's map.
- **The last three inline Settings copies are gone.** Options 2, 3 and 4 now share the module
  like the other ten. Option 2 **−45%**, Option 3 **−42%**, Option 4 **−19%** in file size.
  ⚠️ Not a pure refactor: their copies had drifted, so all three **gained the License page**
  (which they never had) and the current Agentic AI screen.
- **`setting.js`** — `_settings-module.css` + `_settings-module.js` merged into one file and both
  **deleted**. 476 KB, one `<script src>` per page, no `<link>`. 61 prose cross-references across
  the 13 pages were repointed, and `_verify/dsconf.py` (which reads the stylesheet as text) too.
- **The License page re-audited.** Two component mis-selections fixed — `Issued · Expires · Term
  elapsed` was a one-row `obs-table` (it's one record's fields → `obs-key-value`), and the edition
  name was a raw 24px `<div>`. The **History drawer is `obs-drawer`** now.
- **Product License Option 2** — a new design option with an `Option 1 | Option 2` switcher in the
  page header. Option 1 is untouched and still the default. Option 2 ships as the **compact
  licence strip** (identity row · the term in words · the term as a bar) **and nothing else** — the
  License & Quota Usage section was removed from it on 14 Sep, and its first tab is relabelled
  **"License"** to match. ⚠️ That grid was the only door to the **History drawer**, so in Option 2
  the drawer, its chart and its CSV export are unreachable; Option 1 still opens them.
- **Product License Option 3** — a **third** design, from a written spec plus a card: the two-card
  "License overview" (edition | license status, side by side ≥768px, stacked below). ⚠️ Asked for
  as a replacement for Option 1 and **corrected mid-build to "create 3 option and no need to change
  the option1"** — so Options 1 and 2 are untouched, with probe assertions saying so.
  Every figure is computed from the two dates; `licOvDemo('expiring'|'expired')` shows the other
  two states.
- **The quota grid's expanded row, simplified** (Options 1 and 3) — metering rule · one line for
  the agentless/agent split · a **borderless** breakdown table (`obs-table variant="borderless"`, a
  lever read out of the bundle). ⚠️ Same height as before (461 → 457px, measured against HEAD) —
  it is lighter, not shorter. Seven 40px table rows dominate; `hideHeader` or a top-N fold would
  shorten it but change what it says.
- **Product License Option 2, third design** — the strip is gone. Option 2 is now a **licence card**
  (ObserveOps edition + the Activated pill right after it · Infinity ∞ + tag · the ring + term lines
  in the card's top-right · four tiles · activation code with Copy and an *Email support* mailto) and, under it, a **full-width Monitored devices card**
  (170 of 5,000 · bar · agentless/agent split · by type · **View history**, which opens the History
  drawer — so Option 2 has that door again, for devices only). The first tab reads **"License &
  Quota Usage"** in every option again.
- **Product License Option 4** — built from `~/Downloads/license-card.html`: one card, three sections
  (edition · record over a term bar · 120px days-left ring) plus an activation row, with the quota
  grid below. On DS tokens; a size container so it stacks under 1080px instead of the file's forced
  1180px + sideways scroll. **Its vertical section rules were removed on request**, which also fixed a
  stray rule in the stacked layout.
- **Product License Option 5** — the second supplied page: Option 4's card, borderless (no card
  border, a filled activation band, borderless code box, 100px ring). Same markup as Option 4, CSS
  only. **The card and nothing else** — no quota grid ("create only this"). Its top row is
  **centred** (edition, record and ring on one centre line) after an alignment request.
- **Option 2 gained a third card, Flow Sources**, under Monitored devices, and **all three Option 2
  cards now sit on `--widget-background`** (#0B1627 in dark, white in light) with no left accent on
  Flow Sources.
- **Option 5 gained a Monitored devices card** under its licence card — the live quota-row shape
  (icon tile · Healthy · 170 of 5,000 · History · meter · remaining + 30-day sparkline · split legend
  · BY TYPE stacked bar). Option 2's Flow Sources card is built by the same function.
- **Later the same day, six more License requests** (all in `CLAUDE.md` → *"The later 14 Sep 2026
  License requests"*): every card on every option is **#0B1627** in dark (`--widget-background`);
  **Options 3 and 4 lost the quota section**; Option 2 gained the **section head** (with the working
  7d/15d/30d switch) over **six quota cards** — Monitored devices plus Flow, Log, NCCM, APM and RUM —
  each with **History as a top-right icon** and no change figure or sparkline; Option 5's devices
  card was **simplified** (no accent, no sparkline, one action).
- **The last four License requests** (`CLAUDE.md` → *"The last four 14 Sep 2026 requests"*):
  Option 2's **six cards are one shape** (Monitored devices now uses `licQuotaCardHTML`), the
  **Healthy pill sits on the title line** right after the name, **History is a filled icon button**
  (`obs-button neutral-lightest small`, the DS's own icon-only button), and the card internals were
  measured into line (one left edge, button end = meter end, one centre line in the header, one
  column across cards). **Option 3 got the quotas back as its own simple tiles** — a 3/2/1-column
  grid of *name · History / figure / meter / Available · Used*, a pill only when over limit.
- **Option 4 gained two card sets** under its licence card: a **Monitored devices** card from a
  supplied image (usage + deployment tiles + by-device-type bar, labelled History button) and a
  **grid of five add-on ring cards** (Flow · Log · NCCM · APM · RUM) from two supplied HTML pages,
  each with *View history*. See `CLAUDE.md` → *"Option 4 gains a Monitored devices card and five
  add-on ring cards"*. The add-ons were then made **one per row with no accent edge**.
- **Option 2's cards**: the used figure and *N remaining · N% used* are one two-line stat beside History
  (the caption row under the meter is gone), and the meter track is the DS's `--progress-bar-bg`
  (#2B394F dark) — all six cards, Monitored Devices included.
- **Option 2's History is now Options 4/5's labelled, filled button** ("History" + trend glyph).
  "like option 3" was read as today's third switcher entry, Option 4, because Option 3 is gone.
- **The License page's Option 3 was removed from the switcher** (`Option 1 · 2 · 4 · 5`, not
  renumbered — code kept unreferenced), and **Option 4's History buttons are filled** like Option 5's.
- **Option 5's simplified devices card was removed** and its History / View history buttons became
  filled, borderless buttons.
- **Option 5 also gained the five add-on cards** in the supplied "option 2" layout (status beside the
  name, ring on the right), one per row — see `CLAUDE.md` → *"Option 5 gains the add-on cards"*.
- **The License & Quota Usage head (with 7d/15d/30d) is on all five options now**, and Option 5 got a
  **second Monitored devices card** from a supplied HTML page (under its simplified one). The window
  switch retitles Options 4 and 5's change figures. See `CLAUDE.md` → *"The section head on every
  option, and Option 5's second devices card"*.
- **Shared pieces extracted**: `licTermModel()` (Options 2–5 read one term model) and `licMailHref()`
  (the modal and the cards send the same mail).
- **Two new verification tools**: `_verify/stbehave.py` (21 assertions × every page that loads the
  module, auto-discovering) and `_verify/licconf.py` (DS conformance for `#licPage`, 3 scenes).

## In progress

⚠️ **Unanswered, 15 Sep:** a truncated message — *"in option 2&3 the card border color is use #172336 and the"* —
was applied to Option 4 only. Ask whether Option 2's cards should take `--widget-border-color` too (Option 3 no
longer ships).

Nothing mid-flight. Everything is verified green and self-consistent.

⚠️ **One request is still open from the last exchange.** When asked what to change on the License
page you picked four things, and the fourth was *"one specific element I'll point at"* — you never
pointed. The other three are done. Name the control or region and the next session can go straight
at it.

## Next steps

1. **Everything up to 13 Sep IS published and live** — commit `56659dc`, verified on the live site
   (`setting.js` 200, the old `_settings-module.js` 404, `_ds/` resolving). **The 14 Sep change
   — Option 2 dropping the quota section, Option 3, the row detail, Option 2's three new cards and
   Options 4 and 5 (with its devices card) — is committed to nothing yet.** Run
   `/publish` again when you are happy with them.
   ⚠️ `gh` is not installed on this machine; it was not needed (the repo, remote, workflow and
   Pages source already exist, so it is a plain commit-and-push). A NEW repo would need
   `brew install gh` first.
2. **Pick ONE of the remaining License designs (Options 1, 2, 4, 5) and delete the rest.** Decide
   too whether Options 4 and 5 should be renumbered 3 and 4 now that Option 3 is gone. The switcher is review chrome —
   it exists so they can be compared, and should go when one wins (the `Setting/` Scale-switcher
   precedent). `licRingHTML` + its `.licring*` rules are parked from Option 2's first design.
   ⚠️ **History doors by option:** Options 1, 2, 4 and 5 all reach it for every entitlement (grid /
   card buttons). The metering-rule detail is Option 1's alone; the devices breakdown (split +
   by type) is on Options 1, 2 and 5, **not Option 3's simple tiles**.
3. Divergences from the supplied cards, each stated rather than silently matched:
   - Option 2's cards show **`LIC_DATA`'s figures**, not the pictures'. The devices card's
     *+15 in 30 days* line **is gone** since it joined the shared card shape (the change figure was
     removed from that shape by request) — say so if it should come back.
   - **Option 4's cards**: the devices card says *History* and the add-ons *View history*, as supplied
     — unify if wanted; every *Last N days* reads *No change* because `LIC_DATA` has no add-on growth.
   - **Option 5** is licence card · head · the supplied quota devices card · five add-on cards; its
     simplified devices card was removed on request (`lic5DevHTML` kept, unreferenced), and its History
     buttons are filled `neutral-lighter`. The quota card's type shares are of the typed total, not
     the page's used total (its own bar did not fill).
   - **Option 3's overview card has a latent flex tie** (`.licovl > span` beats `.licovact`), so its
     *Activated* pill sits after "License status" rather than at the card's right edge as its spec
     says. The tiles work around it; the overview was left as you have been seeing it.
   - The **"⋯" outside Option 2's card corner** was not built — no actions were specified for it.
   - Options 4/5's solid violet chip and green status pill are **tinted `obs-tag`s**; their 32/40px
     spacing and 16px radius are the DS's 24px and 4px.
   - Option 4 keeps its two **horizontal** rules (above the term bar, above the activation row) —
     the removal request named the vertical ones.
4. The other 12 option pages still carry their own `SUBNAV` / `ICONS` copies — unrelated to this
   session, but it is the next place the same "13 files, nothing syncing them" cost shows up.

## Decisions made

- **One shared module, not a copy per page** — you chose this when asked. It makes "the Settings
  block is one copy" true by construction instead of by discipline, and it is why three pages
  gained screens they never had.
- **One file (`setting.js`), not the two-file pair** — you asked for it, and the 1 Sep entry that
  argued against it admits a single file was the original ask. The hazard it named is real, so the
  mitigation is escaping plus a loud header, not a different structure.
- **`.sdrawer` / `.dr-h` / `.dr-b` stayed in Options 2 and 3** — they sit inside the `ag*` CSS
  region but are generic chrome, and the shared file does not carry them. Moving them would have
  made *Configure AI provider* open nothing, silently.
- **The support links stayed `obs-link`** rather than becoming key-value rows — folding them in
  would have matched the neighbouring cards but broken a working `mailto:`.
- **The ring gave way to the bar, and the bar itself is a declared gap** — the DS ships no gauge,
  meter or progress element (searched). `_verify/ds-gaps.json` now declares `gauge` alongside
  `chart`.
- **The accent is `--chart-indigo`**, a real DS chart-palette token that lands on the mockups'
  violet — not a pasted hex. This page's `--primary` is the prototype's teal.

## Gotchas & notes

- ⚠️ **THE BACKTICK RULE IN `setting.js` PART 1.** The CSS lives in a template literal, so every
  backtick is written `` \` ``. It bit **three times this session**, every time while writing prose
  about the code into a CSS comment. `node --check setting.js` names the line in a second.
- ⚠️ **A 100/100 conformance score cannot see a mis-selected component.** It counts whether a
  component is DS, never whether it was the right one. Both License faults were found by reading
  the registry's `decisionFlow` / `dont`, not by running anything.
- ⚠️ **An overlay in the top layer falls out of a scoped token block.** The `obs-drawer` swap
  shipped a **white drawer on a dark page** — the slotted body was in the `#agPage,#licPage,…`
  list but the drawer host was not. Every probe passed and the checker still said 100/100, because
  both halves were legal DS tokens. **Only the dark screenshot found it.** Any future `<dialog>` /
  portal / top-layer element needs adding to that list.
- ⚠️ **The vendored `obs-drawer` (0.1.166) is not what the registry describes.** `show()`/`hide()`,
  the `open` attribute and all three slots work; `close` / `after-close` **never fire** and
  `el.open` stays false. The one signal every close path shares is the **inner `<dialog>`'s `open`
  attribute**. Re-check if `_ds/` is ever upgraded.
- ⚠️ **An `obs-icon` given a name the bundle lacks FAILS SILENTLY** — empty comment, nothing
  drawn. `file-certificate` / `calendar` / `check` render; `certificate` / `license` do not.
  **Grepping the minified bundle does not answer this** (all five looked absent) — render one and
  read past its `<style>`.
- ⚠️ **`obs-key-value` renders label BESIDE value**, so it cannot make a label-above-value grid.
  That came up twice on this page; Option 3's bottom grid is hand-built for exactly that reason.
- ⚠️ **Measure the "before" rather than trusting a screenshot's impression of size.** The row
  detail was reported as shorter; it was 10px TALLER until the spacing was reverted. Render the
  committed file (`git show HEAD:setting.js`) beside the current one and compare the numbers.
- ⚠️ **`obs-table` has undocumented `variant` values** — `bordered` / `borderless` /
  `borderless-rows` / `plain` / `card` — plus `hideHeader` and `headerStyle` (`tinted`/`default`).
  Read out of the bundle's class list, not the registry.
- ⚠️ **`obs-gauge` is in the registry but NOT in the vendored 0.1.166 bundle** — 31 elements are
  registered, 17 names the registry mentions are not. Test with `customElements.get()` before
  building on anything the registry describes.
- ⚠️ **`obs-key-value`'s `status` field replaces the word**, it does not just colour it — it
  renders the status key's own label. The bundle's map has 48 keys and no `activated`.
- ⚠️ **Probe the untouched page as a control.** A run failed on all three edited pages *and* on
  `index.html` — the assertion was wrong, not the pages. Separately, `textContent` never crosses
  into a **nested** custom element's shadow root, which failed another assertion on working code.
- ⚠️ **`obs-tabs` renders BOTH slots into the DOM** — it toggles visibility, it does not
  unmount. So a "did I remove it?" check on the License page must be scoped to `[slot="usage"]`,
  or the EPS tab's own `.lictb` toolbars keep matching. Cost one probe failure on working code.
- ⚠️ **`harness.py` prints `-> ok` when it has merely written a PNG** — the verdict is painted into
  the image. Read it out of the generated `_out/h-*-query.html`.
- ⚠️ **`--dump-dom` returns a 0-byte stdout on `dashboard-labelled-rail.html`** (on the pre-change
  backup too). Use `lxbehave.py`'s shape: probe copy in `_verify/_out/` with a `<base href>`, and
  `perl -e 'alarm 60; exec @ARGV'` so `subprocess.run` still collects the buffer — `killpg` loses it.
- ⚠️ **A shared `--user-data-dir` carries `setTheme()` into the next scene** via localStorage; both
  "dark" screenshots came out light. Give each themed scene its own Chrome profile.
- ⚠️ **The deleted files are one command away**: `git checkout HEAD -- _settings-module.css
  _settings-module.js`.
- `setting.js` does not start with `_` unlike the other support files — that is the name you asked
  for, and the underscore convention only matters for `.html` files, which `_sync_variants.js` scans.

## Verification at the end of the session

**Latest (15 Sep, the tabs / Option 2 colours / Option 4 batch):** o24b probe **62/62** dark and light · the License probe **279/279** (updated to the new designs) · DS conformance **100 × 4, 96 (Option 2), 98 (Option 4)** · `stbehave` **ALL 21 PASS × 13 pages** · Option 2 and 4 screenshots in dark and light. **Before that (15 Sep, after Option 5's EPS tab — stat cards, note, allocation card, Highcharts trends):** the Option 5 EPS probe **99/99** · DS conformance **100/100 × 6 scenes** (token 100 after the Highcharts subtitle/caption fix) · `stbehave` **21 × 13 pages** · earlier (14 Sep, after Option 5's Metric-Explorer history modal): the License probe **285/285** · DS conformance **100/100 × 5 scenes** · `stbehave` **21 × 13 pages** · earlier, after the 4px corners: a 39-assertion corner probe on Options 1 and 13 (every painted box, shadow roots included, on every Settings screen) · the License probe **255/255** (fewer than earlier: the removed card's and Option 3's assertions went with them) · DS conformance **100/100 × 6 scenes**
(`licconf.py`) · licprobe 31 · opt3probe 45 · detprobe 20 · `stbehave` **21 × 13 pages** · Options 2,
3 and 4 screenshotted in dark, light and at 1280px. Committed and pushed to `main` on 15 Sep (publish requested).

Earlier in the session:

`stbehave` **ALL 21 PASS × 13 pages** · `lxbehave` **ALL 57 PASS × 13** · `harness … query`
**ALL 77 PASS** on Options 1, 2 and 13 (all seven resolutions) · `behave` **ALL 63 PASS × 3** ·
DS conformance **100/100 × 3 scenes** · a 31-assertion License probe and a 30-assertion Option 2
probe · `node --check` clean · every Settings screen shot in **dark and light**.
