**On session start:** If `HANDOFF.md` exists in this directory, read it before
anything else for the latest state of the work.

# Dashboard_with_AI_Chat — ObserveOps chrome, Dashboard module & AI panel

> **Renamed twice.** The local folder went `Side_bar_menu` → `Dashboard_with_AI_Chat`
> on 5 Aug 2026, and the **GitHub repo** went `Side_bar_menu` →
> **`dashboard-enhancement-ai-chat`** on 18 Aug 2026. Live Pages is now
> **https://kisu1311.github.io/dashboard-enhancement-ai-chat/**.
> ⚠️ GitHub redirects the old repo URL, so a stale `origin` keeps working and hides the
> change — check `git remote -v` before assuming. Old Agentation sessions, annotations and
> any shared links still carry `/Side_bar_menu/` URLs and **those Pages links are dead**.

> ⚠️ **THE OPTION FILES WERE RENAMED ON 2 SEP 2026 so the root URL serves Option 1.**
> GitHub Pages always serves `index.html` at the root, and that file used to be Option 2 —
> so the shareable link opened the wrong prototype.
>
> | was | is now | |
> |---|---|---|
> | `index copy.html` | **`index.html`** | Option 1 |
> | `index.html` | **`dashboard-grouped-sidebar.html`** | Option 2 |
>
> ⚠️ **`index copy.html` NO LONGER EXISTS.** It is the name every note written before that date
> uses for Option 1 — this file's own history included, which was rewritten in place. Reading
> anything older: "index copy.html" means `index.html`, and the old "index.html" means
> `dashboard-grouped-sidebar.html`. **Both names appear in git history meaning the opposite
> thing**, so `git log -- index.html` spans two different pages at the rename.
>
> The rename was cheap because **the option pages carry no hardcoded links to each other** —
> navigation is entirely `_variants.js`. Only three places knew the names: `_variants.js`,
> `_verify/lxbehave.py` (`FILES`) and `_verify/dsconf.py` (its default target). If you add a
> fourth, expect it to be missed by the next rename.

## The product docs are digested — read them before inventing anything

`/Users/kishanpatel/ObseverOps/_product-docs/` holds the Motadata AIOps docs
(docs.motadata.com/motadata-aiops-docs, 833 pages) pulled down and condensed on 15 Aug 2026:

- **`MOTADATA-PRODUCT-REFERENCE.md`** — start here. The product's vocabulary and taxonomy in
  one page: the 16 modules, dashboard/widget fields, the 12 documented visualizations and 8
  chart types, the query builder's 7 groups + Counter/Aggregate/Source Filter/Source/Result By,
  the 11 policy types, the 5 severities, the 10 operators, the alert macros, the precise
  timing semantics (*abnormality occurrence*, *notify within*, *auto clear*, *suppress
  window*, *flap*), and the rules for building from it.
- **`dig-*.txt`** — condensed text per section (headings, tables, enumerations).
- **`urls.txt`** — all 833 page paths, i.e. the product's information architecture.
- **`fetchdocs.py`** — refetch a section on demand:
  `python3 fetchdocs.py "alerts-and-policies/" > out.txt`.
  ⚠️ Host is `docs.motadata.com`, needs `curl -L` and a **trailing slash**; the sitemap
  advertises a `www.motadata.com` host whose paths 404.

⚠️ Not digested (refetch if needed): `integrations/` (228 pages, one per monitored device
type), `how-to-guides/` (124), `API Documentation` (50), release notes, upgrade guides.

⚠️ **Docs and the live build differ in places** — the widget query builder documents 7 data
groups but live 8.2.7 shows 8 (adds RUM); the docs list 12 visualizations but the live
*Add New Widget* drawer offers 18. Say which you followed when they conflict.

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

Self-contained HTML prototypes of the Motadata ObserveOps chrome (live 8.2.6):
sidebar, header actions, and a fully interactive **Dashboard module**. Open any
`.html` directly in a browser — no build step. Plain HTML/CSS/JS with the shared
dark/light design-token system; every page redeclares its own `:root` tokens.

## Pages (variants)

⚠️ **THERE ARE THIRTEEN OPTIONS NOW** (Option 10 added 9 Sep 2026, Option 11 on 10 Sep 2026, Option 12 on 10 Sep 2026, Option 13 on 11 Sep 2026), each demonstrating a different sidebar over the
same Option 1 content. The table under *"Each option now demonstrates a DIFFERENT sidebar
pattern"* is the map; in file order:

| # | file | sidebar |
|---|---|---|
| 1 | `index.html` | icon rail + hover mega-menu (Datadog) |
| 2 | `dashboard-grouped-sidebar.html` | icon rail + always-docked panel (ClickUp) |
| 3 | `dashboard-picker-advanced.html` | Option 1's rail; the denser dashboard picker |
| 4 | `dashboard-labelled-rail.html` | labelled rail + a panel you open (monday.com) |
| 5 | `dashboard-nav-column.html` | narrow rail + always-on nav column (Plain) |
| 6 | `dashboard-card-sidebar.html` | rail + column + a "Next steps" card (Plain · Sidekick) |
| 7 | `dashboard-single-column.html` | **no rail at all** — one 270px column (Notion) |
| 8 | `dashboard-nav-column-alt.html` | Option 5's pattern; collapse hides everything |
| 9 | `dashboard-card-sidebar-alt.html` | Option 6's pattern, copied 8 Sep 2026 |
| 10 | `dashboard-rail-flyout.html` | Option 1's rail + flyout, copied 9 Sep 2026 — then heavily diverged |
| 11 | `dashboard-rail-flyout-alt.html` | Option 10's pattern, copied 10 Sep 2026; **boots EXPANDED and collapses to nothing** |
| 12 | `dashboard-rail-flyout-alt2.html` | Option 10's pattern, copied 10 Sep 2026; **Gemini's rule — no hover expand, one toggle** |
| 13 | `dashboard-rail-flyout-alt3.html` | **Option 12's** pattern, copied 11 Sep 2026 — so it inherits Gemini's rule AND the whole 11 Sep Explorer pass; nothing else differs yet |

⚠️ **OPTIONS 6, 7 AND 8 ALL DESCEND FROM OPTION 5's PAGE**, which descends from Option 1's;
**Option 9 is a byte copy of Option 6**; **Option 10 is a byte copy of Option 1**, **Options 11
AND 12 are byte copies of Option 10**, and **Option 13 is a byte copy of OPTION 12** — the first
copy in this family taken from something that is not Option 10, so it is the only one that starts
life with the 11 Sep Explorer pass already in it. A change meant for every option is a
**thirteen-file** change;
⚠️ **OPTIONS 10, 11, 12 AND 13 SHARE THE `mf*` / `sbNotif*` / `RAIL_TMP` / `railPin*` WORK** with nothing syncing them,
the same trap Options 5/8 have with `pl*` and 6/9 with `sk*`. Option 10 carries a session's worth
of things Option 1 does not — the Explorer module grid, per-tile pins, the temporary rail row, the
pinned-row child menu, the gradient AI mark, the hover notification card — and all of it now exists
**four times**. ⚠️ **ALL THIRTEEN OPTIONS LOAD `setting.js`** (the last three inline copies went
on 12 Sep 2026, and the two files merged into one later the same day), so a change to the Settings
module lands in **every page** whether
or not that was meant — the one thing that IS synced, and now by construction rather than by accident
of the copy; Options 5 and 8 share the `pl*` namespace and Options 6 and 9 share `sk*`, with **nothing
syncing either pair**. Each option's own sidebar block is the only
part that differs; everything below this line describes content they all carry.

Four pages are in the switcher, labelled **Option 1 / 2 / 3 / 4**. All of them carry the
shared **`ac*` chat panel** on top of their own AI, **the `lx*` Log Explorer module and the
`st*` Settings module** (My Account › My Profile, cloned from live 8.2.7 — see below), and
all are verified responsive at the seven target resolutions — see those sections below.

⚠️ **Option 4 is a COPY of Option 1 with a different sidebar** (1 Sep 2026), so almost every
section below that says "Option 1" is true of it as well — the `ai*` Iris panel, the Log
Explorer's AI Query and Pattern Summary, the Manage-dashboards screen, the Layout drawer,
the Create/Edit Widget editor, the keyboard registry. **A change meant for both has to be
made twice**, and that is the same cost the other options already carry.

- **`index.html` — Option 1 · Sidebar & Header Actions.** The chrome study, and now
  the most heavily iterated page. Datadog-style module rail (see below), the full
  Dashboard list panel ported from Option 2, time-slider strip, dynamic widget canvas,
  widget Share drawer, Full Screen, Export. **Only this page** has the on-canvas
  add-widget tile, the single-key shortcut system with its `?` sheet, and undo/redo.
- **`dashboard-grouped-sidebar.html` — Option 2 · Grouped Sidebar + AI (main prototype).** Sidebar +
  profile popover + notifications + spotlight search, PLUS the full Dashboard
  module: picker panel (quick-access grid, sticky category headers, only the
  current category open by default, type icons + legend, search w/ highlight),
  per-dashboard actions menu, Create/Edit Dashboard drawer (560px, Advanced
  Settings), full timeline system, dynamic widget canvas (17-type catalog,
  clone/remove/full-screen, drag-reorder, resize, drill-down, Metric Insight,
  export), NOC View kiosk playback + create form, Manage Dashboards modal
  (concept). **Two AIs**: the original inline one (`i*`) on the canvas, plus the shared
  **`ac*` chat panel** built from `AI chat interface.md`.
- **`dashboard-picker-advanced.html` — Option 3 · Advanced Picker + AI.** The
  denser picker design (filter chips, type tiles, collapsible tree) kept for
  comparison. **Two AIs**: the full `oa*` panel — the deepest of the originals — plus the
  shared **`ac*` chat panel**. ⚠️ This is the layout most squeezed by its own chrome: a
  224px named column *and* a **290px inline** dashboard list, so it is the page to check
  first after any width change.
- **`dashboard-labelled-rail.html` — Option 4 · Labelled Rail & Detail Panel.** Option 1's
  whole page with monday.com's side navigation in place of its rail: every entry carries its
  label under its icon, the rail never changes width and never flies out, and one `»/«` above
  the list opens a **docked** detail panel. See *"Option 4 — the labelled rail"* below.
- `_ai-source/` — `ai-chat-option2.html` and `dashboard-ai-insights.html`, the two
  original AI prototypes the panel was ported from. **The only copies that exist**
  (their old `AI_Chat_Interface/` folder is gone). Kept out of the folder root so
  the variant sync ignores them. Reference only — do not delete.
- **`setting.js`** — **the whole Settings module, in one file, loaded by all thirteen pages**
  (12 Sep 2026). PART 1 is its stylesheet, which injects itself as a `<style>`; PART 2 is the
  `#view-settings` markup plus the `st*` (My Profile), `stc*` (Compliance Settings) and
  `ag*` / `lic*` (Agentic AI, Product License) blocks. One `<script src>` per page, placed
  after the design-system bundle — there is no `<link>`. It replaced the pair
  `_settings-module.css` + `_settings-module.js`, which are **deleted**.
  ⚠️ **EVERY BACKTICK IN PART 1 IS WRITTEN `` \` ``** — the CSS lives in a template literal and
  its comments are full of code names. `node --check setting.js` after editing there.
- `Dashboard-Research-Notes.md` — the verified product research (see MANDATORY
  above). `_variants.js` + `_sync_variants.js` — variant switcher + auto-sync.

## Log Explorer module (`lx*`) — a clone of the live module, in all three options

Until 17 Aug 2026 every module except Dashboards landed on the generic `#view-module`
placeholder card. **Log Explorer is now a real module screen** — read off the live product
(build 8.2.6) at `/log/`, `/log/search` and `/log/live-tail` and rebuilt, not invented. It
is **one CSS block + one `<section id="view-logexp">` + one `<script>` block**, so a change
here is normally a three-file change like the `ac*` panel.

> ⚠️ **It is NOT byte-identical any more.** Option 1 diverged on request and now carries
> four things Options 2 and 3 do not: **`✦ Ask AI`** in the head (17 Aug 2026), the
> **`✦ AI Query`** control in the search filter row (19 Aug 2026), the Log Pattern
> **ACTION column** with its **`✦ AI Pattern Summary` drawer** (`lxps*`, 20 Aug 2026), and
> the shared **`lxAiqParse` / `lxAiqCommit`** query model that AI Query and the chat both
> use (20 Aug 2026). Re-sync deliberately or leave them different, but don't assume `md5`
> over the block still matches.
> ⚠️ **The live instance's ADDRESS MOVES between sessions.** Build 10.0.0 answered on
> `172.16.12.186` on 20 Aug 2026 and was unreachable there the day before — which is how
> the first AI-Pattern-Summary build came to be guessed, and wrong. **Ping before assuming
> it is down**, and say which instance a finding came from.
> ⚠️ **The left log-sources panel was removed from Option 1 on 17 Aug 2026 and RESTORED on
> 19 Aug 2026** — verified against live build 10.0.0 first, where it is still there. All
> three options carry it again (`lxPanelBtn`, `lxPanel` / `lxTreeTab` / `lxTree` /
> `lxTreeToggle`, and `body.lxopen` set in `lxInit`). `lxbehave.py` runs its full **57**
> checks in Option 1 again — the 5 skips are gone.

Namespace is `lx` throughout — `.lx*` classes, `lx*()` functions, `LX_*` constants, plus
`body.lxopen` / `body.lxdense`. It borrows nothing from the host page but `toast()`.

**Entry points.** `selectModule()` gained one line — `if (m.name === 'Log Explorer'){
showView('logexp'); lxInit(); return; }` — so the rail's **Explorers** entry reaches it. The
flyout's **Logs** section now carries actions on its first three rows: *Log explorer* →
Overview, *Log search* → Log Search, *Live trail* → the live-tail screen. The other three
rows (Log inventory / parsing / forwarder) still fall through to the placeholder.

**What is in it**

| screen | what it has |
|---|---|
| chrome | panel chevron · **Overview / Log Search** tabs · the time chip (keycap + label + two absolute stamps) · **Start Live Trail** |
| Overview | three KPI tiles (Events Per Second · Total Events · Last Hour Event Counts) over a **packed-bubble chart** of every log type, grouped by source type |
| source panel | **Type \| Group**, three levels deep: group → log type → source host, each with its count chip; type-to-filter |
| Log Search | **List · Chart · Grid · Top N · Gauge**; List gets Execute / Pause↔Resume / Abort / full screen, the others the chart-shape row, **Save as Widget** and the product's query builder (**Counter\* · Aggregation\* · Source Filter · Source · Result By**) |
| Event Log | facet panel, `TIMESTAMP \| MESSAGE`, **Raw Log** toggle, eye column-chooser, CSV export, two row densities |
| row detail | four summary cells (Severity / Event Source / Event Type / Event Category), **Event Attributes \| Metric**, table↔JSON switch with copy |
| Log Pattern | `COUNT \| SEVERITY \| PATTERN` + pager; the live timeout state is reachable via `lxPatFail()` |
| Pre Filters | All/Any group matching · Include/Exclude · Counter / Operator / Value criteria · Add New Group · Reset · Clear · Apply |
| Live Trail | Source (multi) · Search Terms All/Any + Keywords · **Highlight Keywords** (repaints in place) · play / auto-scroll / full screen over a console pane, plus the gear's Line Spacing + Text Size dialog |

### `✦ AI Query` in the search filter row — Option 1

Built 19 Aug 2026 from **live build 10.0.0**, driven in the browser rather than guessed
(the docs describe the facet panel but say nothing about the filter bar's mechanics).

**What the live product does**, observed end to end. Typing *“show me error logs from syslog
in the last 30 minutes”* into `AI Query` and pressing **Run**:

1. rewrote the filter to `INCLUDE event.severity Equals error OR message Contains error`
2. moved the time range to **`30m` / Last 30 Mins** and restamped the absolutes
3. **executed on its own** — the event count went 10,785 → 34
4. toasted **“AI query applied to search.”**

The control sits **between the filter text and Execute** and opens a **320px** popover
titled **“Build a query with AI”** with a 2-row textarea placeholdered *“e.g. ERROR logs in
the last 30 minutes”* — all measured off the live DOM (`.log-ai-panel`).

⚠️ **THE QUERY IS SHOWN BEFORE IT IS APPLIED — a deliberate divergence** (request, 19 Aug
2026: *“the AI will analyse and convert the query format and show the query before I
approve”*). The live product applies straight from **Run** with nothing to review, which is
why pressing it read as *“not working”*: the filter bar and the count change quietly and
there is no moment where you see what it decided. Here **Run builds and shows; Apply
commits.** Four states, one renderer (`lxAiqPaint`):

| state | body | actions |
|---|---|---|
| `idle` | — | Cancel · **Run** (disabled until you type) |
| `busy` | three pulsing dots · *“Reading your log fields…”* | Cancel · Run (disabled) |
| `preview` | **THIS WILL SEARCH** + the expression + `Time range · <name>` — or, for an aggregate, **THIS WILL RUN** + the filter (or *All events*) + the builder rows `Counter · Aggregation · Result By · Visualization` | Cancel · **Apply** |
| `error` | *“I could not turn that into a query…”*, naming what it does understand | Cancel · **Run** |

- ⚠️ **Nothing touches the search until Apply.** There are probe assertions that the query
  box and the range are untouched while busy, while previewing, and after an error.
- ⚠️ **Editing the sentence invalidates the preview** (`lxAiqIn` compares against
  `LX_AIQ_S.q`) — a query card sitting under text it no longer describes is worse than none.
- ⚠️ The failure is **inline in the popover, not a toast**: a toast vanishes, and the thing
  it is talking about is the sentence still on screen.
- ⚠️ **The textarea is `#lxAiqTa`, not `#lxAiqIn`** — `lxAiqIn()` is a function, and an
  element id becomes a window global. It happened to resolve correctly, but a same-named
  id and function in a file this flat is the collision trap the root CLAUDE.md opens with.
- ⚠️ **Test it with a real `input` event**, not by calling `lxAiqIn()` — the inline
  `oninput=` handler resolves its identifier through a different scope chain, so calling the
  function directly can pass while a user typing fails.

#### One parser, one model, one gate — for the popover AND the chat (20 Aug 2026)

Request, 20 Aug 2026: *“any query related prompt I write in the chat interface or AI Query
will be converted to the query format before approve, show the query, I approve, then it
will work”* — with *“Show me today's log events that mention 'error'”* and *“How many log
events did each source send in the last 24 hours?”* as the examples. The first only worked
by luck (the word *error* tripped the severity rule; the quoted term was never read), and
the second could not be built at all — it is an **aggregation**, and the chat rejected it
outright because it starts with “How”. Both surfaces now share three functions:

- **`lxAiqParse(q)` → a query MODEL** `{ q, clauses:[{t:[operand, operator, value], j}],
  range, agg:null | {counter, fn, by, viz} }`. Still canned and deterministic — regexes, no
  call-out — but it reads a sentence rather than a keyword list: a **time phrase**
  (`LX_AIQ_T`, plus `lxAiqRangeN` for *last N minutes/hours/days* → the nearest range at or
  above it); a **quoted term** or one after *mention / contain / saying / about* →
  `message Contains <term>`; a **severity** word; a **source type** via `LX_AIQ_ALIAS` (the
  words people type → `LX_GROUPS` names) and a **log type** matched only as a whole
  multi-word phrase that isn't also a group name; an **IP or host**; and an **aggregation**
  — *how many / count / per / each / by / top / most* → `Counter message · Aggregation
  Count · Result By <LX_AIQ_BY dimension>`, shown as **Grid**, **Top N** for *most / top /
  which … most*, **Chart** for *over time / trend / hourly*, **Gauge** for a bare count.
  ⚠️ A **quoted severity word means the text, not the level** — `'error'` produces
  `message Contains error` only and drops the severity clause the keyword rule would add.
  ⚠️ **`Other` has no alias on purpose** (an ordinary English word); `switch` is guarded
  against *switch to / over / the / it / view*; `most` against *most recent*; `every` is
  not an aggregation signal (*show me every error* is a search).
- **`lxAiqExpr(m)` / `lxAiqRows(m)` / `lxAiqRangeName(k)`** render it — the flat
  `INCLUDE a Op b AND …` string, the builder rows (`.lxaipvb`, one class used inside both
  the popover and the chat card), the range label. `lxAiqBuild(q)` is kept as a wrapper.
- **`lxAiqCommit(m)` is THE GATE** — the only function that changes Log Search, and both
  Applies end in it: `lxRangeSet` (the range without re-running — `lxPickRange` now calls
  it and runs once), the filter box, then either the builder (`LX.counter/agg/resultBy`,
  `lxViz(viz)`) or back to `List` / Event Log, then **one** `lxExec()`.
- **In the chat**, `aiLogQ` returns the model (it no longer refuses question words — only
  *why*, the three canned starters' words, and a question carrying nothing but a time
  range), `aiLogQHTML` renders *Log search query* / *Log query* with the same rows, and
  `aiLogQApply` calls `lxAiqCommit`. `AI_DOMAIN` gained `event|source|query|search|pattern`
  so a plain search sentence isn't answered as *outside what I can see*.
- Verified by a 54-assertion probe (18-row parser table + both surfaces end to end, in the
  session scratch dir); lxbehave still 57/57.

- ⚠️ **The mapping is canned** (`LX_AIQ` for severities / ssh / login, `LX_AIQ_ALIAS` for
  source types), like everything else here. Each rule owns the product's own filter triple
  — **operand / operator / value** — which is the shape the real `filter` URL param
  carries: `[{"operand":"event.source","operator":"in","value":["…"]}]`, base64'd twice
  into the query string. `LX_AIQ_T` maps time phrases onto `LX_RANGES`' own keys so the
  two can't drift.
- ⚠️ **The join is PER CLAUSE, not one for the whole string.** A single global join turned
  “error logs from syslog” into `severity=error OR message~error OR category=syslog`, which
  widens where the sentence narrows. Clauses within one rule use that rule's join; clauses
  from different rules join with `AND`. **No parentheses** — the product renders a flat
  string and its URL model is a flat array, so inventing precedence would be inventing
  product behaviour.
- ⚠️ **It never silently no-ops.** A sentence it cannot map leaves the search exactly as it
  was and says so, rather than half-applying something.
- ⚠️ The popover anchors to the **button** (`.lxaiqw`), not to `.lxbar`. Against the bar its
  `right:0` put a 320px card past the viewport edge, because Execute / Pause / Abort / ⤢ all
  sit to the button's right.
- ⚠️ **Honest divergence:** the live one dropped “from syslog” from that sentence and
  produced only the two error clauses. Ours keeps it as a third `AND` clause — since 20 Aug
  `event.source.type In Syslog`, the group, rather than the `event.category In "syslog
  event"` it was before — which is a better reading of the request but is *not* what the
  product returned.

**Other things build 10.0.0 has that this prototype does not** (seen on the same screen,
recorded so they don't have to be re-derived): `Save Query` and `Ask AI` above the filter
row, `Save as Report` on the results header, and a third results tab **`✦ Anomaly`** beside
Event Log and Log Pattern.

### `✦ AI Pattern Summary` — the Action column of Log Search → Log Pattern (Option 1)

Request, 19 Aug 2026; **flow corrected against the live product 20 Aug 2026** after it was
reported wrong. The lab was unreachable on the 19th, so the first build guessed and routed
the ✦ into the **chat panel** (pinned chip → thinking trail → bullets → Variable parts →
follow-ups). **That is not what the product does, and the chat route has been deleted.**

**What live build 10.0.0 actually does** (driven in the browser at `/log/search` → Log
Pattern → the Action column's ✦, DOM measured):

- The **ACTION column is real** — it exists on the live tab, one violet ✦ per row. (The
  docs describe only `Count · Severity · Pattern`, so the docs are incomplete here.)
- ⚠️ **SUPERSEDED 20 Aug 2026 (late): the ✦ ROUTES INTO THE CHAT AGAIN, on request.** See
  *“The pattern ✦ answers in the chat”* below. Everything in this subsection describes what
  the LIVE PRODUCT does and what the drawer we built to match it does — the drawer
  (`lxPsPaint` / `lxPsClose` / `#lxPs`) is kept and unreferenced, so it is one call site
  away. Read this before “fixing” the chat route back by checking the product.
- The ✦ opens its **own right-hand drawer**, not the chat: header **✦ AI Pattern Summary**
  + ✕, then a **pattern card**, then **✦ AI Summary** and **one prose paragraph**. It says
  one thing about one pattern and closes. There is no thread, no follow-up, no context chip.
- ⚠️ **The summary is fetched, not instant** — a second row's drawer had still not opened
  after 3 s. Ours is canned but keeps the beat: a 1.1 s *"Analysing this pattern…"* state
  with the three pulsing dots, then the paragraph.

**The rebuild** — `lxps*`, in the `lx` block (it is a Log Explorer component, not a chat
one): `lxPatAi(i)` → `LX_PS` → `lxPsPaint(busy)` → `lxPsClose()`, markup `#lxPsScrim` /
`#lxPs` / `#lxPsBody`. Geometry copied from the live DOM, colours through **this file's
tokens** (the live violet `#7C3AED` is our `--ai-2`; importing another product's hue would
put a colour in the file no token owns — the send-button rule):

| part | live | here |
|---|---|---|
| drawer | `.ant-drawer-wrapper-body` **458px**, full height, white | `.lxps` 458px, `--card`, own scrim |
| header | title 16px/500, close `rgb(113,134,168)` | `.lxpsh`, 56px |
| card | `.pattern-header` bg `rgb(236,241,249)`, 1px `rgb(227,232,242)`, radius 4, pad 8/12, mb 16 | `.lxpsc` on `--panel-2` / `--border-soft` |
| label | `PATTERN` 12px/500 uppercase, letter-spacing **.72px**, `rgb(106,127,160)`, severity right | `.lxpscr .l` / `.s` |
| pattern | `.pattern-template` 14px monospace | `.lxpspt` |
| matched | `N events matched` 12px, mt 4 | `.lxpsm`, from `lxPatN()` |
| heading | `.ai-summary-title` ✦ + *AI Summary*, 12.8px/600, `rgb(124,58,237)`, mb 12 | `.lxpst`, `--ai-2` |
| body | one paragraph, 12.8px, line-height 1.7 | `.lxpsp`, `LX_PAT_PROSE[i]` |

- **`LX_PAT_PROSE`** is one analytic paragraph per pattern, in the live one's voice (it
  reads the placeholder distributions and says what they imply), derived from the same
  `LX_PAT_AI[i].tok` numbers the card shows, so prose and data cannot disagree. Placeholder
  names render as `<code>` chips, as they do live.
- ⚠️ **The drawer is `position:fixed` but sits INSIDE `#view-logexp`** — a fixed element in
  a `display:none` ancestor is hidden, so leaving the module cannot strand it. Same rule as
  `#lxDet`.
- ⚠️ **`lxPsClose()` clears the pending timer.** Closing mid-generate otherwise lets the
  summary arrive into a closed drawer a second later — the `agClose()` lesson.
- ⚠️ **Esc is a capture-phase ladder**: the pattern drawer first (topmost), then `#lxDet`.
- ⚠️ **The ✕ is `&#10005;`, not `\u2715`** — that is MARKUP, not a JS string, so the escape
  rendered as the literal text `\u2715` in the header. Caught by reading the probe's own
  output, not by looking at a screenshot. (The repo's `\uXXXX`-vs-real-character gotcha, in
  a new place.)
- ⚠️ **Pattern counts are WEIGHTS scaled onto `LX.count`** (`LX_PAT_SUM` / `lxPatN`). The
  seven seeded numbers summed to 12,726 while the toolbar said 5,483, and `lxExec()`
  re-rolls the count on every search, so "N events matched" could never be honest with fixed
  numbers. The rows now sum to the toolbar's count (±1).
- ⚠️ **Two deliberate differences from live, both recorded so neither is mistaken for the
  product:** our masked tokens keep the table's **teal highlight** (`<user>`, `<ip>`) where
  the live drawer renders its `*****` / `*NUM*` plain; and the live masking convention is
  `*****` / `*NUM*` (per the docs: NUM · IP · EMAIL · URL · GUID · ID · SEQ · HEX · CMD,
  anything else `*****`) while this prototype uses `<name>` placeholders throughout the
  table. Changing the convention would ripple through the table, the prose and the fixtures
  — it was **not** part of the flow fix.
- ⚠️ The live pattern text is full of a real machine name and internal `10.20.x` addresses.
  **Nothing was copied**: the fixtures stay on RFC 5737 / neutral names, per the repo rule.
- ⚠️ **The drawer was then IMPROVED PAST THE LIVE ONE** (request, 20 Aug 2026: *"need to
  improve this visualization"*). Live — and our first copy — is a label, a wall of mono, a
  grey count and one long paragraph: everything the same weight, and the most concrete fact
  the quietest thing on screen. Four changes, all from data already on the page:
  - the severity is **the table's own `.lxsev` chip**, so it carries its colour here too;
  - the count is a **figure with its share of the search** beside it, not a footnote;
  - **Distribution of values** is drawn as **bars** from `LX_PAT_AI[i].tok`, which already
    held `[value, share %]` per masked token — exactly what the docs say a hover on a mask
    shows, and it was rendered nowhere after the drawer rebuild;
  - the summary is **bullet points, not a paragraph** (`LX_PAT_POINTS`, request 20 Aug
    2026). It was one 60-word block: the findings were all in there, but a wall of text
    under a heading called *Summary* is the thing you skip, and the numbers inside it were
    doing no more work than the words around them. Same facts, one point each, strongest
    first, with the figure emphasised.
    ⚠️ **The gap BETWEEN bullets must beat the leading INSIDE a wrapped one** — the measured
    `.aiab li` lesson, in a second place. At 1.6 line-height a wrapped point carries ~7.7px
    between its own lines, so `margin-bottom` is **12px** (3px after the last); a 4–5px
    margin makes a two-line bullet read as two bullets. There is a probe assertion
    comparing the two numbers rather than trusting the eye.
    ⚠️ There is also an assertion that **every** pattern has ≥3 points — a row whose entry
    was missed would open an empty summary;
  - ⚠️ *Show these logs* (an `lxPatOpen()` button in the figures row) was added here and
    then **REMOVED on request** the same day. **Don't re-add it** — the drawer is for
    reading one pattern, and the row it came from is still on screen behind it.
    `lxPatOpen()` is kept and unreferenced again, the way `aiScopeMenu` and `iFocus` are,
    so it is one call site away if it is ever wanted back. There are probe assertions that
    neither the button nor its label appears in the drawer.
  ⚠️ The bar FILL is sized `width:%` with the track as the flex child — a lone flex child
  takes the whole track and every bar would read 100% (the recorded `flex:50` lesson).
  ⚠️ The long-tail row is emitted **only when the shares do not reach 100**, or a zero-width
  row still draws its label and claims a tail that isn't there.
- Verified by a 58-assertion probe (the ✦ opens the drawer and pushes **nothing** into the
  chat thread; generating state; the figure agrees with the row's count; the 88% fill is
  partial and matches its share; no phantom tail row; 458px; label metrics; Esc /
  click-away / close-mid-generate), both themes screenshotted.

- **`LX_GROUPS` is the live source tree verbatim** — 16 groups, 60 log types, with the
  counts the instance reported (Router 209.95 K → Cisco Device Configuration Update 77.71 K,
  …, Nutanix 37.53 K → Cluster Health 2.27 K). `LX_FIELDS` is the 22 most-populated facet
  fields with their live values and counts; **the live panel lists 298 fields** (`LX_FIELD_TOTAL`).
- **The bubble chart is a real circle packing**, not a hand-placed picture: `lxPack()` is a
  greedy front-chain packer (each circle takes the free tangent slot nearest the origin),
  children are packed first and their enclosing circle *is* the group's radius — d3's
  algorithm, so the sizes are honest and the layout is deterministic on every load.
- **Every host and IP is RFC 5737** (`192.0.2.x` / `198.51.100.x` / `203.0.113.x`,
  `example.com`). The live module is full of internal `172.16.x` / `10.x` addresses — this
  is the one place in this folder that obeys the repo scrub rule from the start.
- ⚠️ **Deliberate differences from live, so nothing here is mistaken for the product:**
  the operator list populates as soon as a counter is picked (live renders an empty-state
  illustration until its async load lands); **Log Pattern** never returned data on the
  instance — every range answered *"Failed to fetch data, reason : Request Timed out!"* — so
  both states are built and the success state is a reconstruction; the gear dialog's second
  field is labelled **Text Size**, which the live screen spells "Test Size"; and the bubble
  labels are dark ink rather than the live white, which is unreadable on this pastel palette.
- Verify with the `lx-*` scenes in `_verify/shoot.py` (`lx-ov`, `lx-search`, `lx-detail`,
  `lx-metric`, `lx-json`, `lx-chart`, `lx-topn`, `lx-gauge`, `lx-pattern`, `lx-pre`,
  `lx-range`, `lx-live`, `lx-light`, `lx-lightov`).
  ⚠️ **A light-theme scene must call `setTheme('light')`, not set `data-theme` directly** —
  the page's own init reads `localStorage` a moment later and paints back over a bare attribute.

## Settings module (`st*`) — My Account › My Profile, cloned from live 8.2.7, in all three options

> ⚠️ **19 categories now, not 18** — `Agentic AI` was added 31 Aug 2026 and is the one that is
> NOT on the instance. See *The 31 Aug 2026 pass*.

⚠️ **IN OPTION 1 THIS BLOCK NO LONGER LIVES IN THE PAGE** (1 Sep 2026) — its CSS is
`setting.js`'s PART 1 and its markup + all three script blocks are that same file's PART 2.
Everything below still describes it exactly; only its address changed. See *"The Settings
module lives in its own files now"* above for the load-order contract. ⚠️ **SINCE 12 Sep 2026
EVERY OPTION READS IT FROM THOSE TWO FILES** — Options 2, 3 and 4 were the last three carrying
their own inline copy and no longer do, so "the Settings block is one copy" is true by
construction rather than by discipline. See *"Options 2, 3 and 4 share the Settings module too"*.

Until 19 Aug 2026 the rail's **Settings** entry landed on the generic `#view-module`
placeholder. It is **a real module screen now**, read off live build 8.2.7 at
`/settings/my-account/my-profile` in the browser — the DOM, the computed styles, the Vue
component's own render template and vee-validate rules (pulled out of `__vue__`), and every
state driven by hand — then rebuilt, not invented. Like the `lx*` module it is **one CSS
block + one `<section id="view-settings">` + one `<script>` block, byte-identical in all
three files** (md5-checked), so a change is a three-file change. ⚠️ **NOT ANY MORE IN
OPTION 1, OR IN ANY OTHER** — since 12 Sep 2026 all three pieces are in `setting.js`, which every
option loads (they were `_settings-module.css` + `_settings-module.js` from 1 Sep). Namespace `st` — `.st*`,
`st*()`, `ST_*`; it borrows only `toast()`, `showView()`, `selectModuleByName()`,
`closePops()` from the host. The build is scripted — the generator that assembles the blocks
from the harvested JSON (`_verify/_out/live-settings-nav.json`, `live-settings-subs.json`,
gitignored) lived in the session scratch dir; re-harvest rather than hand-edit if the
live list changes.

**Entry points.** `selectModule()` gained one line — `if (m.name === 'Settings'){
showView('settings'); stInit(); return; }`. **Every Settings row in the flyout / docked
panel / DevRev column carries an `act`** — `stOpen('<category>')` — so each category lands
on itself with its first page selected. The profile popover's **My Profile** row (a toast
stub before) calls `stOpen('My Account','My Profile')`. `stOpen()` is the one public door:
it sets the category/page, expands it, clears the search, then routes through
`selectModuleByName('Settings')` so the rail highlight and the view switch stay the host's.

**What is in it**

| piece | what it has |
|---|---|
| head | `‹` collapse · `⚙` · **Settings**. The chevron hides the left list (width → 0, icon flips) — verified on live, where it collapses the splitpane to 0 |
| left list | **Search**, then the product's **18 categories in the live order**, each with the product's **own icon** (harvested SVG paths in `ST_ICO`), collapsible, **BETA** on Service Level Objective, **every sub-page of every category** (`ST_TREE`, 95 pages, each carrying its live route). Search matches a **category name** (all its pages) or a **page name**, case-insensitive substring, and expands what it matched — verified with “prof”, “utility”, “ACCOUNT”, “PING” against the live list. Clearing it restores the collapse state |
| My Profile | 120px avatar circle with the initials (`first[0]+last[0]`, **live off the two name fields**) · **Change** → file picker (JPEG/JPG/PNG/SVG; anything else refused with the live error text) → `Change | Remove` · First Name\* · Last Name\* · User Name\* (disabled, “Must be unique”) · Email Address\* · Mobile Number · **Change Password OFF/ON** → Current Password\* · Password\* (“Do not use simple password”) · Confirm Password\* (“Same as the password field”, `onpaste` blocked), each with an **eye** toggle (`eye` hidden ↔ `eye-slash` shown) · **Reset · Update My Profile** |
| validation | the component's own rules: names required + `/^[a-zA-Z\s'\-]{1,50}$/`; email required + email; mobile numeric 8–12; current password required; password required + the instance's policy (min 6, special, number, lower, upper; max 64, `ST_PW`); confirm required + must match. Messages are the ones the live form printed |
| every other page | UI Preference and the 17 other categories land on a `.modcard` placeholder that names the **live route** — not built, and it says so. ⚠️ **License IS built now** (7 Sep 2026) — see *Settings › My Account › License — Product License* below |

- ⚠️ **A REQUIRED-EMPTY field shows NO message on live** — only the label and the
  underline turn red (the explain node is rendered `display:none`). Reproduced: `stValidate`
  returns `{req:true}` for those and `{msg}` for everything else. Don't “fix” it without
  saying it diverges.
- ⚠️ **Reset leaves the Change Password switch where it was** — live `onReset()` never
  touches `isChangePassword`. It reloads the saved values, drops a picked picture, clears
  the errors and empties the password fields. Reproduced.
- ⚠️ **A disabled field looks identical to an enabled one on live** (User Name). Reproduced
  with an explicit `-webkit-text-fill-color`, or Chrome greys it.
- **Validation runs on submit, then live per field** (`ST.tried`) — fixing a field clears
  its error as you type, and editing Password re-checks Confirm.
- **Update** shows a spinner, then the draft becomes the saved state, the switch goes OFF,
  the password fields empty, and **the signed-in identity refreshes** — `#sbUser .lbl`,
  `.miniav`, the popover's `.upavatar` / `.nm` (live calls `refreshUser()`). A saved picture
  paints the rail avatar; removing it brings the initials back.
- **The seed profile is the page's own signed-in user** (`stSeed()` reads `#sbUser .lbl`),
  split the way the live one was — “motadata admin” → First `motadata`, Last `admin`, User
  Name `admin`; Option 1's “Kishan Patel” → `Kishan` / `Patel`. E-mail is on `example.com`
  (scrub rule); live carried a real address. That is what lets the block stay identical
  across the three files while each shows its own user.
- ⚠️ **`ST_ICO['eye-slash']` was `null` in the first harvest** — the password rows were not
  on screen when the misc icons were read, so `querySelector('svg[data-icon=eye-slash]')`
  found nothing and the toggle painted `d="null"`. It is patched into the JSON now; a
  harvest has to run with the switch ON.
- **Deliberate differences**, recorded in the block's header comment: the primary button is
  this prototype's teal (live paints white-on-ink); the success toast text is ours (the
  form was never submitted against the instance); the picked picture is circle-cropped but
  not pannable/zoomable (live runs vue-croppa); and live shows nothing at all for a search
  with no match — ours prints one muted line.
- **The flyout list was corrected to the 8.2.7 build**: “Observability Pipeline” is **Log
  Settings** there, and Dependency Mapper / SLO / APM / RUM — which used to route to other
  modules — are Settings categories on the instance, so they open the settings list now.
- **`ST_PAGES` is the page registry** (added 20 Aug 2026): a later script block can own a
  settings page by writing `ST_PAGES['<category> › <page>'] = {html(), after?()}` —
  `stMainPaint()` paints whatever is registered and falls back to the placeholder. The
  Compliance Settings block (`stc*`, below) is the first user. **`stFullOpen({title, html,
  info?, infoHTML?, onClose?})`** is the other door: a screen that replaces the whole
  settings view the way live's Create Benchmark / Create Rule / benchmark view do — the
  head becomes `‹ <title>` (+ the product's `(i)` help toggle when `info` is set), the left
  list hides (`#view-settings.stfullpg`), and the head's ‹ / `stFullClose()` put the list
  back. `stGo`/`stOpen` clear `ST.full`, so navigating away can't strand a full page.
- Verify in a real tab (`python3 -m http.server` + the browser tools) — the probe that
  drove the 39 behaviours above (switch, eyes, initials, every message, reset, save,
  identity, search, toggle, stub, panel, flyout act, geometry) lived in the session, not
  the repo. `lxbehave` 57/57 · `behave` 63/63 · `harness` 77/77 still pass with it in.

## The Settings module lives in its own files now (`_settings-module.*`, 1 Sep 2026)

> ⚠️ **SUPERSEDED 12 Sep 2026 — THE TWO FILES ARE ONE FILE, `setting.js`, AND BOTH ARE DELETED.**
> Request: *"create new file the name is 'setting' and all setting related all will be in this
> file"*. `_settings-module.css` became **PART 1** of `setting.js` (it injects itself as a
> `<style>`) and `_settings-module.js` became **PART 2**, verbatim. Every page loads the one file
> with one tag; there is no `<link>` any more.
>
> **Reading anything below, or anywhere later in this file: `_settings-module.css` and
> `_settings-module.js` both mean `setting.js` now.** The dated entries are kept as written
> because they record why each decision was made — only the address changed. See
> *"One file called `setting.js`"* for what did change, including the one note this merge
> directly reverses.

Request: *"inside the setting module related all code will be copy and create setting module
file and all setting code move in new file"*. **Option 1 only** — `index.html` went
**2,024,257 → 1,700,157 bytes** (26,925 → 23,814 lines) and the module moved out whole:

| file | what left `index.html` |
|---|---|
| **`_settings-module.css`** | the `st*` + `stc*` CSS (was lines 6784–7150) and the `ag*` CSS with its scoped DS token block (was 7294–8295) — 1,369 lines of that file's single `<style>` |
| **`_settings-module.js`** | the `<section id="view-settings">` chrome (was 8576–8598) and the three `<script>` blocks — `st*` (My Profile), `stc*` (Compliance Settings), `ag*` (Agentic AI) — 1,744 lines |

The page loaded them with `<link rel="stylesheet" href="_settings-module.css">` immediately
after its inline stylesheet, and `<script src="_settings-module.js"></script>` immediately
after the design-system bundle. **Since 12 Sep 2026 it is one `<script src="setting.js">` after
that bundle and no `<link>` at all** — the stylesheet injects itself. **Nothing about the module's behaviour changed** — see
*"Proving it did not change"* below.

### The load-order contract, and why each half of it exists

- ⚠️ **A PLAIN, PARSER-BLOCKING `<script src>` — no `defer`, no `async`, NOT `type=module`.**
  All three blocks were classic inline scripts; their top-level `const` / `let` / `function`
  declarations land in the same global scope from an external classic script, which is the
  only reason the host page's four runtime references still resolve. A module script would
  put every one of them in module scope and the rail's Settings entry would throw on the
  first click.
- ⚠️ **IT MUST LOAD AFTER `_ds/observeops-elements.umd.js`.** The `ag*` screen is built out of
  real `obs-*` custom elements. That tag already sat between the `stc*` and `ag*` blocks; it
  stays in the page, directly above the new one.
- ⚠️ **THE FOUR RUNTIME REFERENCES FROM OUTSIDE ARE THE WHOLE CONTRACT**, and all four are
  lazy — which is what makes the move safe. They were enumerated before touching anything:
  `stInit()` (from `selectModule`), `stOpen()` (markup `onclick`s in the flyout, the docked
  panel and the profile popover), **`ST_TREE`** (the two-pane flyout, derived on first hover
  and cached) and **`ST_ICO`** (read through the `layPIc` function). Every other `st*` /
  `stc*` / `ag*` mention anywhere else in that file is prose inside a comment — checked with
  a scan that excluded the six moved regions.
- ⚠️ **THE `<link>` GOES AFTER THE INLINE `<style>`, NOT BEFORE IT.** This file is one flat
  stylesheet where source order decides every tie at equal specificity.
- ⚠️ **ONE CASCADE CHANGE WAS ACCEPTED KNOWINGLY.** The `st*`/`stc*` half used to sit *before*
  the "ObserveOps DESIGN SYSTEM LAYER" block (the Dashboard-layout drawer) and now sits after
  it. Checked first: that block is scoped entirely to `#drawer-layout` (id specificity) and
  the moved CSS's only non-`.st*`/`.stc*` selector is `#view-settings`, so they cannot collide.

### The markup is injected, not authored

`_settings-module.js` inserts the section **before `#view-manage`**, which is exactly where it
was authored, rather than appending it to `.main`. Nothing keys off sibling order today, but
`.view` sections are toggled by a class and a stack of them in the wrong order is the kind of
thing that surfaces later, on a z-index question. The injection runs at parse time of the
file, long before any click can reach it, and is guarded on `.main` existing.

### ⚠️ A `</style>` INSIDE A CSS COMMENT ENDS THE STYLESHEET

The pointer comment left behind in the page said *"loaded by a `<link>` immediately after
`</style>`"* — and the HTML parser leaves "in style" mode on those literal characters **even
inside a `/* */` CSS comment**. The stylesheet ended there, and the remaining ~1,500 lines of
CSS rendered as text down the page. It looked like a catastrophic extraction bug and was one
character class. The comment now says "this block's closing tag" and explains why it must
never spell it out. Same shape as the `</scr`+`ipt>` trap the root `CLAUDE.md` records for
scripted `sed` inserts — and the tell was there before the screenshot: a substring count of
`</style>` returned **2** while the line-start count returned 1.

### ⚠️ Why the CSS is a `.css` file and not a string inside the `.js`

The moved CSS carries **218 backticks** in its comments (`` `--primary` ``, `` `ST_TREE` ``, …).
In a JS template literal every one needs escaping, and the next person to write a comment gets
a syntax error from a character they had no reason to think was special. In this repo the
comments *are* the documentation, so they stay verbatim and the CSS stays a stylesheet. (This
is the one place the build differs from what was agreed up front, which was a single file.)

### Proving it did not change

- **Byte-identity**: each of the five extracted regions was asserted to appear *verbatim* in
  the pre-move file, *verbatim* in its new home, and **not at all** in the page afterwards.
- **A side-by-side fingerprint**: a probe that reads `ST_PAGES`' keys, `ST_TREE`'s 19
  categories, `ST_ICO`'s 26 icons, `STC_RULES0`'s 95 rules, `STC_BENCH0`'s 17 benchmarks, then
  opens My Profile · Compliance Policy · Benchmark · Rules · Agentic AI · a stub page and runs
  the list search — run against the untouched backup and against the extracted page. **Every
  field matched.**
- ⚠️ **One suspected regression was NOT one, and only the side-by-side proved it**: the Agentic
  AI wizard drawer does not open under a synthetic click. The untouched backup behaves
  identically, so it is the page's existing behaviour, not the move. Absolute assertions would
  have reported a bug that was not there.
- `lxbehave` **57/57 ×4** · `behave` **63/63** · `harness … query` **77/77** · the Playwright
  Agentation spec passes on all four option pages.

### ⚠️ `_verify/` was silently testing a page with no design system — fixed with it

`behave.py`, `shoot.py` (and therefore `harness.py`) and `lxbehave.py` all write their probe
copy into **`_verify/_out/`**, so every relative asset in the page resolved against that
folder and 404'd. That was **already true of `_ds/observeops-elements.umd.js` and
`_variants.js`** before this change — those suites had never loaded the design system — and
the Settings module would have joined them. None of their own assertions touch any of it, so
they reported green either way: the "a green probe is not a working feature" trap, in the test
harness itself.

All four scripts now inject **`<base href="file://<project>/">` immediately after `<head>`**,
which fixes every relative asset at once. Verified: the probe copy's DOM now contains
`#view-settings`, `#stNav`, `#stMain` and the `obs-*` elements, where before it contained none
of them. ⚠️ The `<base>` must sit ahead of anything it is meant to resolve, and a probe copy
opened over **http** rather than `file://` will now fail to load its assets — that is the tag
doing its job, not a fault.

### ⚠️ The other three options still carry their own copy — *resolved 12 Sep 2026*

`dashboard-grouped-sidebar.html`, `dashboard-picker-advanced.html` and `dashboard-labelled-rail.html` kept the
Settings module inline, so the block was **no longer byte-identical across the four files** —
the property CLAUDE.md had asserted since 19 Aug 2026. Pointing them at these two files was one
`<link>` and one `<script src>` each, plus deleting their copies, and it makes that property
true by construction instead of by discipline. It was **not** done on 1 Sep (the request named
`index.html`); it **was** done on 12 Sep — see *"Options 2, 3 and 4 share the Settings module
too"* below.

## One file called `setting.js` (12 Sep 2026)

Request: *"create new file the name is 'setting' and all setting related all will be in this
file"*. `_settings-module.css` and `_settings-module.js` are **deleted**; `setting.js` holds the
whole module and every one of the thirteen pages loads it with **one tag**:

```html
<script src="_ds/observeops-elements.umd.js"></script>
<script src="setting.js"></script>
```

| | |
|---|---|
| **PART 1** | the stylesheet — `st*`, `stc*`, `ag*`/`lic*` and the scoped DS token block |
| **PART 2** | `_settings-module.js` verbatim — the `#view-settings` markup it injects, then `st*`, `stc*`, `ag*`/`lic*` |

476 KB, 4,963 lines. There is **no `<link>` any more** and nothing to keep in step: PART 1
injects itself.

### ⚠️ THIS REVERSES A RECORDED DECISION, AND THE REASON FOR IT IS STILL TRUE

The 1 Sep entry *"Why the CSS is a `.css` file and not a string inside the `.js`"* argued against
exactly this, and its own closing line admits **a single file is what was agreed up front**. So
this is the original ask being carried out, not a new idea — but the hazard it named is real and
is now live in the file:

⚠️ **THE CSS LIVES IN A TEMPLATE LITERAL, SO EVERY BACKTICK IN PART 1 IS WRITTEN `` \` ``.**
866 of them at the time of the merge (the 1 Sep note counted 218 — it grew). A template literal
ends at the first unescaped backtick, and these comments are full of `--primary`-style code names,
so a comment typed naturally is a syntax error hundreds of lines from where it looks like the
problem is. **It bit within minutes**: writing this very entry's cross-reference into PART 1
broke the file. `node --check setting.js` named the line in one second, which is why the file's
own header says to run it.

Nothing else needed escaping, and that was measured rather than assumed: the stylesheet contains
**no backslashes and no `${`**, both asserted by the builder, so the escaped text round-trips to
the original **byte for byte** — verified by running PART 1 under a stubbed `document` and
comparing the captured 125,449 bytes against the deleted file.

⚠️ **Three alternatives were considered and rejected**, so nobody re-derives them: a block-comment
heredoc read back through `Function.prototype.toString()` dies because the CSS is full of `*/`;
`fetch`ing a sibling file is blocked by CORS on `file://`, which these prototypes must open under;
and rewriting the 866 backticks to another character would edit the documentation to suit the
container.

### ⚠️ The stylesheet is injected into `<head>`, and that is what preserves the cascade

Each page is one flat stylesheet where source order decides every tie at equal specificity, and
the `<link>` this replaces sat immediately after the page's inline `</style>`. `appendChild` on
`<head>` puts the `<style>` in the same place in document order, so a rule still wins the ties it
used to win. It runs at parse time of `setting.js`, not on `load`; there is no flash either way,
because `#view-settings` is a `.view` section and is hidden until something opens it.
⚠️ `textContent`, never `innerHTML` — a stylesheet is text.
⚠️ The injector is idempotent (`if (document.getElementById('settings-css')) return;`).

### What else had to follow the rename

- **13 HTML pages** — the `<link>` removed, the script pointed at `setting.js`, **and 61 prose
  cross-references fixed**. Those matter: a comment pointing at a file that no longer exists is
  how the next reader loses an hour. Two of them were stale claims in their own right and were
  rewritten rather than repointed — *"IT DOES NOT SHARE OPTION 1'S EXTERNAL FILES"* (4 pages) and
  its Option 10 variant, both of which described the Settings module as synced *by accident of the
  copy*. It is synced by construction now.
- **`_verify/dsconf.py`** — the one script that reads the stylesheet **as text**, to lift the DS
  token block out of it. It now reads `setting.js` and **unescapes the backticks** first.
- **`_verify/stbehave.py`** — its auto-discovery marker.
- **`behave.py` / `lxbehave.py` / `shoot.py`** — prose only; they name the assets their `<base>`
  tag exists to resolve.
- ⚠️ **Three headers inside `setting.js` still described the old world and were reconciled in
  place** rather than deleted: the stylesheet's own title line, the *"why this is a `.css` file"*
  note (now marked as the live caveat it has become), and *"Its stylesheet is the sibling
  `_settings-module.css`"*.

### Verification

`stbehave` **ALL 21 PASS × 13 pages** · `lxbehave` **ALL 57 PASS × 13** · `harness … query`
**ALL 77 PASS** on Options 1, 2 and 13 (all seven resolutions) · `node --check` clean · the
extracted stylesheet brace-balanced and byte-identical to the deleted file · My Profile, License,
Compliance Policy and Agentic AI screenshotted on three pages in **dark and light**.

⚠️ **The deleted files are one command away** if this is ever unwound:
`git checkout HEAD -- _settings-module.css _settings-module.js`.

## Options 2, 3 and 4 share the Settings module too (12 Sep 2026)

Request: *"in this file the 'setting' module will be move new Setting file"*. `index.html` was
open, but its Settings module moved out on 1 Sep and it carries **zero** inline `st*` / `stc*` /
`ag*` / `lic*` code — so the ask could only be about the three options that still had their own
copy. Asked which, and whether to share the existing pair or give each page its own file;
answered **all three, sharing `_settings-module.{css,js}`** — which those two files still were at
that point in the day; they were merged into `setting.js` a few hours later, so read every
`_settings-module.*` below as that one file.

| | was | now | |
|---|---|---|---|
| `dashboard-grouped-sidebar.html` | 903,951 B / 11,496 lines | **506,111 B / 7,602** | −44% |
| `dashboard-picker-advanced.html` | 972,532 B / 12,198 lines | **574,692 B / 8,304** | −41% |
| `dashboard-labelled-rail.html` | 2,190,286 B / 28,932 lines | **1,813,829 B / 25,293** | −17% |

Each page lost the same five regions `index.html` lost on 1 Sep — the `st*`+`stc*` CSS, the `ag*`
CSS, the `<section id="view-settings">` markup and the three `<script>` blocks — and gained the
same two tags in the same two places: the `<link>` immediately after its inline `</style>`, and
the `<script src>` immediately after `_ds/observeops-elements.umd.js`.

### ⚠️ IT IS NOT A PURE REFACTOR — the three pages were BEHIND, and they moved forward

Their inline copies had drifted: **none of them had the License page at all** (`lic*`, built
7 Sep — `licRadioSync` count 0 against the shared file's 3) and their Agentic AI block was older
(`agTap` 7–9× against 17×). Option 4's was furthest behind, exactly as the 1 Sep note said: it
had `.aggrid` / `.agkpi` / `.agcht` — hand-built KPI tiles and charts — where the shared module
renders DS widgets inside `obs-table`'s shadow root. **So this change also gave all three the
License page and the current Agentic AI screen.** That was accepted deliberately and is the
point of sharing; it is recorded here because a reader diffing screenshots will see new screens
that no request in this file asked for on those pages.

### ⚠️ WHAT HAD TO STAY BEHIND: `.sdrawer` / `.dr-h` / `.dr-b` in Options 2 and 3

Those five rules sit **inside** the `ag*` CSS region but are **generic page chrome, not `ag*`**.
Option 1 declares them in its own stylesheet, so `_settings-module.css` does not carry them —
and Options 2 and 3 have exactly one definition each, the one ported on 2 Sep so
`agConfig` would have a drawer to open. Moving them out would have left `#drawer-agcfg` (which
IS in the shared file) styling an element with no base rules: **Configure AI provider would
have opened nothing, silently** — the same regression that port existed to prevent. They stay
in the page at the point the settings CSS used to begin, i.e. still before the `<link>`, which
is the same relative order `index.html` has. There is a comment at the rules saying so.
⚠️ Option 4 needed no such carve-out — it is an Option 1 copy and declares `.sdrawer` natively,
far outside the settings region.

### ⚠️ Option 4 has TWO CSS regions, not one, and the `#drawer-layout` block sits between them

Options 2 and 3 run `st*` → `stc*` → `ag*` as one contiguous block. Option 4 is an Option 1 copy,
so it has the **original** arrangement `index.html` had: `st*`+`stc*`, then the *"ObserveOps
DESIGN SYSTEM LAYER"* block (the Dashboard-layout drawer, `#drawer-layout`), then `ag*`. Cutting
it as one region takes the Layout drawer with it. A first pass did exactly that **and** stopped
its end anchor one line late, eating the DS LAYER banner's opening line; caught by the
before/after selector diff, reverted from the backup and redone as two regions.

### Two changes to the module (now `setting.js`), both of which make it more portable

- **The injection anchor is tried in authored order.** It was `#view-manage` or else append.
  Options 2 and 3 have **no `#view-manage`** — `#view-settings` was authored immediately before
  `#view-logexp` there — so the fallback would have appended Settings at the END of `.main`, a
  different sibling order from the one those pages shipped with. It is
  `getElementById('view-manage') || getElementById('view-logexp')` now; Options 1 and 4 still
  match the first, so nothing about them changed. There is a probe assertion that the injected
  section's next sibling is one of those two on every page.
- **`stcExport`'s CSV branch is guarded on `lxDownload`.** The shared `stcExport` writes a real
  file using three Log Explorer helpers — `lxCsvCell`, `lxFileStamp`, `lxDownload` — that **only
  Options 1 and 4 have**. Options 2 and 3 never gained a file-writing path at all (their own
  `lxCsv()` is a toast too), and their inline `stcExport` was itself a toast stub, so without the
  guard the shared one would have thrown where the page used to say plainly that it does not
  write files. Same guard and same wording as `licHistCsv`, which already had one. ⚠️ The three
  helpers always ship together, so testing one is enough — but that is a convention, not a
  guarantee; if they ever separate, `licHistCsv` has the same single-test assumption.

### ⚠️ The verification traps, three of them new

- **A green probe on the page under test means nothing without a control.** The first run
  reported `profile form rendered → FAIL` on all three edited pages — and on **`index.html`,
  which was not touched**. The assertion was wrong (the form has no `#stFirst`; it has
  `#stSaveBtn` and `#stAv`), not the pages. **Probe the untouched page alongside the edited
  ones**; it is the only thing that separates "I broke it" from "I asserted the wrong thing".
- **`--dump-dom` run from the project directory returns NOTHING on `dashboard-labelled-rail.html`**
  — a 0-byte stdout, not a truncated one — and it does so on the **pre-change backup too**, so it
  is the recorded large-page hang, not a regression. What works is `lxbehave.py`'s shape:
  write the probe copy into `_verify/_out/` with a `<base href>`, and kill Chrome with
  `perl -e 'alarm 60; exec @ARGV'` so `subprocess.run` still collects the buffered stdout. A
  `communicate(timeout=…)` + `killpg` does **not** recover it — the buffer is lost with the process.
- **`harness.py` prints `-> ok` when it has merely written a PNG.** The verdict is painted INTO
  the image; read it by re-running the generated `_out/h-*-query.html` under `--dump-dom` and
  taking the LAST `ALL n PASS` match. Reading the stdout is how a failing layout looks green.

### `_verify/stbehave.py` — a new suite, because there was none for this module

21 assertions per page — the section injected and in its authored position, `stInit`/`stOpen`,
`ST_TREE`'s 19 categories, `ST_ICO`, all three `ST_PAGES` families, `obs-*` registered, the
stylesheet actually applied (`.stnav` has a real width, not `auto`), then My Profile, License,
Compliance Policy and Agentic AI each rendered for real, the list search narrowing and
restoring, and no console errors. It **auto-discovers** every page containing
`setting.js`, so a new option is covered without editing it — unlike `lxbehave.py`,
whose `FILES` list is hardcoded and silently tests the old set when a page is added.

**Verified:** `stbehave` **ALL 21 PASS × 13 pages** · `lxbehave` **ALL 57 PASS × 13** ·
`behave` **ALL 63 PASS × 3** · `harness … query` **ALL 77 PASS × 3** (all seven resolutions) ·
My Profile / License / Compliance / Agentic AI screenshotted on all three pages.

### ⚠️ A concurrent session began editing `_settings-module.js` minutes after it appeared

Its `ag*` block was changed under this session — one icon per provider instead of a shared
`sparkling-star`, carried on the provider record as `ic` (annotation, 1 Sep 2026: *"it is all
icon is same make to use different icon"*). That edit was **kept, not reverted**, and the final
verification above ran against it. Two things follow: the extraction is already being used, and
`git status` mtimes on these two files are not a reliable signal of who wrote what.

### Collapse moved beside the logo, and the rail grew to fit it (2 Sep 2026)

Request + a Magnific reference: the collapse control sits next to the wordmark, not in the
footer. It had been a full labelled `Collapse` ROW at the foot of a stack whose every other
line is a destination — for a control that acts on the rail itself.

- **`#collapseBtn` is now in `.strigger`**, icon-only, `margin-left:auto`; the word moved to
  `data-tip`, which is how every other icon control in this rail works.
- ⚠️ **THE BRAND ROW STILL TOGGLES, and that is not redundant.** Collapsed, the rail is 64px —
  a 30px mark in 15px of padding, with no room for a 26px button — so the button is hidden AND
  `pointer-events:none`, and the LOGO is the way back out. `stopPropagation` on the button
  stops one click toggling twice.
- ⚠️ **`toggleSidebar()` WROTE INTO THE `.lbl` THAT WENT WITH THE LABEL** — `b.querySelector(
  '.lbl').textContent = …` would have thrown `Cannot set properties of null` on the first
  press, i.e. the control would have shipped broken. Both lookups are guarded now.
- ⚠️ **`--rail-w-open` WENT 170 → 190px** (and to **240px** on 8 Sep 2026 — the sidebar-rule floor; see *Round 2* under the UX pass). With the button added the row needs
  `15 + 30 + 9 + 85("ObserveOps" at 14px/600) + 9 + 26 + 15 = 189` — measured, and the wordmark
  was ellipsising to "ObserveO…". Shrinking the product's own name to fit a chrome control is
  the wrong way round. `.brand` also gained `flex:0 1 auto; min-width:0; ellipsis` — the same
  "a text element that cannot shrink shoves what follows it off the end" fault as the flyout's
  ragged chevrons, in a second place on the same day.
- ⚠️ **`body.pinned .shell` HAD A HARDCODED `170px`** beside a `--rail-w-open` that also said
  170 — two copies of one number. Widening the token alone moved the rail and left the canvas
  padded for the old width; it reads the token now.
- Verified: rail 190 open / 64 collapsed, wordmark unclipped, button inside the rail, shell
  padding matches, `railWidth()` returns 190, `behave` 63/63, `harness … query` 77/77.

### Four small fixes to Option 1's chrome (2 Sep 2026)

- **The Settings flyout's chevrons sit in ONE column.** They were at **six** different x
  positions. Two causes, both real: long labels ("Network Config Settings" — 229px of content
  in a 209px row, "Service Level Objective" — 222px) OVERFLOWED the row and shoved their
  chevron past the column edge; and `.mfkc`, `.mfpin` AND `.mfdocs` each carried
  `margin-left:auto`, and **flexbox splits free space between multiple auto margins**, so even
  the rows that did not overflow landed at 370 / 376 / 377 / 378.
  ⚠️ **The fix is one flexible label, not more auto margins.** `mfTree` now wraps the label in
  `<span class="mfl">` (`flex:1 1 auto; min-width:0; ellipsis`) and all three autos are dropped:
  the label takes the slack, so every control after it sits at the row's right edge by
  construction, and a long name ellipsises instead of pushing anything.
- **The provider-config scrollbar is hidden, the scrolling is not.** `overflow-y:auto` stays —
  `overflow:hidden` would remove the bar by removing the ability to reach the rest of the form.
  ⚠️ The trade-off is real: the bar was the only thing announcing the area scrolls. Acceptable
  only because the footer is pinned in view, which is what says the form continues.
- **That footer now matches the form's column.** Measured: every element in the step shared a
  left edge of 334 and a right edge of 1054 — heading, subtitle, fields, panels, body — EXCEPT
  `.agff`, which ended at **1524**. It is a sibling of `.agform` and inherited none of its
  `max-width:720px`, so the commit bar ran 470px past the form it commits. `padding-right` went
  to 0 with it, or the buttons would sit 24px inside the form's edge instead of on it.
- **`BUILD : 8.2.6` left the rail for the profile menu.** A version string is reference
  information you look up once; it did not earn a permanent row in a rail whose every other
  line is somewhere you can go. It is `.upbuild` at the foot of `#userPop` — no hover, no
  pointer, no icon column, so it cannot be mistaken for a control. `.sbuild` is kept and
  unreferenced.

### Only an EMPTY group draws a boundary (2 Sep 2026)

Asked for as "show the border" on a group whose only boundary was its widgets, then narrowed
the same day to **"remove this border, show only empty group"**. Both are in the final shape:

- **A group WITH widgets has no border, no padding, no radius** — `.dgroup{margin-bottom:16px}`,
  as it always was. Once a group holds cards, the cards say where it starts and ends; a
  container edge round them draws the same thing twice.
- **An empty group's boundary is `.gdrop`'s own dashed box** — not a border on `.dgroup`.
  Putting one there as well rings an outline around an outline.
- ⚠️ **`.gdrop` moved from `--border` to `--track`, and the reason is measured.** Against the
  canvas, `--border` is **1.32** contrast in dark and **1.27** in light — invisible, which is
  what prompted the original report. `--track` is **2.68 / 2.57**: findable, still a hairline,
  and it is the only token that lands in that band in BOTH themes (`--chip` is 1.63 dark but
  **1.19** light, so it would have fixed one theme and left the other untouched).
- ⚠️ **The thing worth remembering: a widget reads as a box because it has a FILL (`--card`),
  not because of its border** — whose own contrast is 1.15. Any container given a hairline and
  no fill has to carry the whole boundary on that hairline, so it needs a stronger token than
  the cards inside it, not the same one.

### The provider-config screen pins its footer (2 Sep 2026)

The wizard's action bar — the KMS caption, Run test, Accept & enable AI — scrolled away with
the form, so on the Model-selection step (three radios, a seven-row routing table and a consent
panel) the only way to reach the primary button was to scroll to the very bottom. The bar is
the step's commit; it has to stay on screen.

- ⚠️ **THE SCROLLER WAS `#stMain`, TWO ANCESTORS UP.** Pinning the footer is not a footer
  change — nothing inside `.agcfgm` can pin while an ancestor is what scrolls. `#stMain` stops
  scrolling **for this screen only** (`:has(.agcfg)`), and the height flows down to a bounded
  `.agfbody`.
- ⚠️ **EVERY LINK IN THE CHAIN NEEDS `min-height:0`.** A flex child defaults to
  `min-height:auto` — its content — so leaving any one of `.agcfg` / `.agcfgm` / `.agform` at
  `auto` re-grows the column past the viewport and the footer leaves again; the scrollbar just
  moves.
- ⚠️ **`.agcfg`'s `min-height:520px` had to go with it** — a floor taller than the viewport is
  the same bug on a short screen, except the overflow is now `hidden` and the content
  unreachable.
- ⚠️ The **stepper stays pinned too** (it is in `.agform`, above `.agfbody`) — it is the step
  indicator, i.e. navigation, not content. The side columns get their own scrollers so a long
  provider list or help card is not clipped once the row is bounded.
- ⚠️ `.agcfgm`'s 56px bottom padding is **kept** and still load-bearing: it holds the pinned
  footer clear of the fixed variant-switcher pill.
- Verified: `#stMain` no longer scrolls, `.agfbody` does, the footer does not move when the
  body is scrolled to its end, and ordinary Settings pages still scroll normally.

## Compliance Settings (`stc*`) — the category's three pages, cloned from live 8.2.7, in all three options

Built 20 Aug 2026 from `/settings/compliance-settings/audit-policy` · `benchmark` · `rules`
plus `benchmark/create`, `benchmark/<id>/view` and `rules/create`, read in the browser the
same way as the `st*` module: Kendo grid DOM + computed styles, the Vue components' render
templates and option lists (`AuditPolicyList` / `AuditPolicyForm` / `BenchmarkList` /
`RulesList` / `RulesFom` out of `__vue__`), every drawer and picker driven by hand, and the
two `(i)` help panes' full text. **One CSS block + one `<script>`, byte-identical in the
three files** (md5-checked) — ⚠️ **both are in `setting.js` now, in every option** —
registered into the `st*` module via `ST_PAGES` — there is no
new markup section; `#stMain` hosts everything. Namespace `stc*` / `STC_*`; borrows
`stEsc` / `stA` / `stFullOpen` / `stFullClose` / `stMainPaint` / `toast` and the `st`
block's `.stin` / `.stbtn` / `.stspin` / `.stex` atoms. The generator + harvested JSON
(`_verify/_out/cp-*.json`, `cis-tree.json`, `icons-rulecreate.json`, gitignored) live in
the session scratch dir; re-harvest rather than hand-edit.

| page | what it has (all measured) |
|---|---|
| Compliance Policy | search · eye **column chooser** (with the live's *Reset Column Preference*) · Export As PDF/CSV · **filter toggle** · Create; chips `Benchmark · Tags · ＋ Filter`, each with the live `=` / `!=` operator menu; grid `POLICY NAME↑ · DESCRIPTION · CREATED TIME · USED COUNT (pill) · TAG · SCHEDULE (icon when scheduled) · BENCHMARK · ACTIONS`; **run-now** shows only when `used > 0` and only on row hover, spins while it runs (all as live); ⋮ = Edit · Clone · Schedule · Assign Monitor · Remove Assigned Monitor · Delete |
| its drawer | 684px over a **blurred scrim**: Policy Name* (“Must be unique”, uniqueness enforced) · Description · Tags · Config File Type* `Startup｜Running` · Benchmark Filter by Tags (narrows the Benchmark list, deselects an excluded pick) · **Benchmark\* — locked while editing, as live** · Device Filter* `Monitor｜Group｜Tag` · **Select Device\*** (Monitor → the live **855px grid-dropdown**: search + checkbox table `DEVICE·IP·TYPE·GROUPS·VENDOR·TAGS`) · Notify Team · docs link · `* fields are mandatory` · Reset · Create/Update/Clone. A policy **name** opens the read-only drawer titled **“View Audit Policy”** — that misnamed title is the live product's, kept on purpose |
| Schedule / Assign | `“<name> Schedule”` (Once/Daily/Weekly/Monthly · Start Date* · Hours* · Notify*) and Assign/Unassign Monitor (checkbox monitor table, Cancel · Assign/Unassign) — assign/unassign really move `devs` and the used-count pill follows |
| Benchmark | grid `BENCHMARK · DESCRIPTION · USED COUNT · TAG · ACTIONS`; the system benchmark wears the live **lock** and its ⋮ has **Clone only**; others Clone · Delete (delete refuses while a policy uses it); a name opens the **full-page view** (read-only fields + the tree); Create Benchmark is the **full-page rule-group builder**: numbered accordions, `Enter Name ✓`, ✎ Edit Name, ⊕ child group, 🗑, **Add Rule** (picker over the rule pool with search + severity filter), parallel groups via the bottom *Add Rule Group* |
| Rules | search (with the live ×-clear) · Create Rule; grid `RULE (severity bar) · DESCRIPTION · TAG · RULE TYPE Custom/Default · ACTIONS ⋮ Edit·Clone·Delete`; Create/Edit is the **two-step wizard** — 1 *Audit & Remediation Properties* (Config File｜CLI · Basic｜Advanced · Block Criteria on Advanced · Command* on CLI · condition rows `[AND/OR] Condition* · Result Pattern* · Occurrence* Any/1–25 ⊗ ⊕` · Action to be taken + Create Runbook) → 2 *General Properties* (Rule Name* · Description · Severity* High default · Tags · Rationale/Impact/Default Value/References/Additional Information · Controls + IG-1/2/3 · Add New Controls) |

- **The data is the instance's.** `STC_RULES0` is the live rule pool — the **85 CIS
  rules** of `CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0` with their real numbering,
  severities and (where the grid showed them) descriptions, plus the 10 Custom rules —
  and `STC_BENCH0`'s CIS benchmarks all carry the **full live tree** (3 planes → groups →
  rules), so the view page reads exactly like the product's. Numbering (`1.1.1`) is
  **derived from position, never stored** — drag/re-order can't desync it.
- ⚠️ **Groups default COLLAPSED everywhere** — the live view page opens fully folded; only
  a group just added in the builder opens itself (`stcBfAddGroup` sets `open:true`).
- ⚠️ **`stcPop` / `stcPick` / `stcDevGrid` are the one popover engine** — fixed-position,
  clamped to the viewport, closed by outside-mousedown and by Esc **before** the drawer
  (the Esc ladder is popover → confirm → drawer, all in one capture listener). Repainting
  a searchable popover restores the caret, the `st` search-box lesson.
- ⚠️ **Deletes confirm first** (`stcConfirm`), never `confirm()`; a benchmark a policy
  still uses refuses with a toast naming the count instead.
- **Deliberate differences**, in the block's header comment: RFC 5737 addresses and
  neutralised people-names in the seed data; the live builder's **blank third button** (its
  Delete/Add-Rule control renders empty in 8.2.7) is built here with real icons because the
  `(i)` pane documents both; Export/Create Runbook toast; primary buttons are teal.
- ⚠️ **Watch the ternary-in-template trap**: a `cond ? (nested ? a : b)` missing its outer
  `:` inside a template literal parses hundreds of characters later with a useless error —
  `node --check` the extracted block (the recorded `lx` lesson) before screenshotting.
- Verified with browser probes over http (≈90 assertions across the three pages, both
  themes, all three options); `lxbehave` 57/57 ×3 · `behave` 63/63 ×3 · `harness` 77/77
  still green with the block in.

## Four AI UIs across three options, deliberately different

⚠️ **There is no longer one shared AI panel.** Each surface demonstrates a different
answer to "where does AI live in a dashboard product", so **an AI change is almost never
a three-file change** — decide which surface it belongs to first. Each engine is
self-contained apart from `toast()`, and each uses its own name prefix so nothing
collides in these flat scripts.

| Option | Pattern | Prefix | Where |
|---|---|---|---|
| 1 | **light side chat panel** — the minimum viable chat | `ai*` / `AI_*` | `#aiPanel` / `.aipanel` |
| 2 | **inline AI** — no panel; answers land on the canvas | `i*` / `I_*` | `.iask` + `.icard` in `#dcanvas` |
| 3 | **full chat surface** — the deep one, ~100 functions | `oa*` / `OA_*` | own `<script>` block |
| **1 · 2 · 3** | **docked chat panel** — the spec build (see below) | `ac*` / `AC_*` | `#acPanel` / own `<script>` block |

⚠️ **Every option now carries TWO AI surfaces.** The `ac*` chat panel is in all three
files **byte for byte**; each page also keeps its ORIGINAL AI, which still works. So
an AI change here has to name *which surface* and, if it is the `ac*` one, **be made
three times**. Entry points are deliberately distinct so a reviewer can tell them apart:

| | that page's own AI | the shared `ac*` chat |
|---|---|---|
| Option 1 | toolbar **Ask AI** (`.aibtn`), rail ✦, `A`, Log Explorer's **✦ Ask AI** | **⌘/Ctrl+I only** — the `.acaskbtn` toolbar button was removed 18 Aug (two violet sparkle pills side by side were indistinguishable); its CSS stays for Options 2–3 |
| Option 2 | the inline ask bar on the canvas | rail ✦, toolbar **✦ Ask AI**, **⌘/Ctrl+I** |
| Option 3 | toolbar **Ask AI ⌘K**, rail ✦, "Ask me anything" | toolbar **AI Chat**, **⌘/Ctrl+I** |

⌘K is the spotlight in Options 1–2 and the `oa*` panel in Option 3, so the shared chat
took **⌘I** — which is Datadog Bits Chat's own shortcut. Option 1 also got `#acPanel.on`
added to `kbBusy()` so its single-key shortcuts don't fire behind the open chat.

⚠️ Option 1 had none of `--oa*`, `--sel`, `--text-dim2`; they were added to **both** its
theme blocks (its violet `--ai*` values, re-exported under the `--oa*` names the panel
uses). Options 2 and 3 already had all of them.

⚠️ **The empty state's starter rows carry the BRAND GRADIENT** (Option 1, request 21 Aug
2026, supplied verbatim): `90deg, rgb(76,177,254) 0%, rgb(115,30,251) 55%, rgb(249,17,227)
100%` — blue → violet → magenta, in `--ai-cta` / `--ai-cta-h`. Fourth state for those rows
in two days (`--sv-cta` → flat wash → a single-hue `--ai` fade → this), and the comment at
`.aicta` that argued against exactly this gradient as *"another product's colours"* is
**overruled by the request** — don't revert it on the strength of the old note.
⚠️ **Only the hues and stops are the spec; the alpha is ours.** Painted opaque it puts
saturated blue-to-magenta behind 13px body text. A *uniform* alpha keeps all three hues at
equal weight — which is what three stops are for — tuned so the row's overall strength
matches the fade it replaces: dark `.13` / hover `.19`, light `.075` / hover `.11`. Light
takes a tint far more strongly than the dark canvas, the same split the thinking card uses.

⚠️ **OUT OF DATE — see "The 25 Aug 2026 pass" below.** Option 1's `ai*` panel is no longer
violet (`--ai*` is redefined on `.aipanel` to `#1D2A3E` / `#CAD3E2`), its two primary buttons
are no longer teal (`--action`), and its entry points say **Ask Iris**, not Ask AI. Violet is
still the accent for Option 3's `--oa*`, the Log Explorer's AI Query, the per-widget ✦ drawer
and the toolbar pill. Historically: violet was the AI accent everywhere and teal the product
accent. Everything is **canned and deterministic** — nothing calls
out. The point is that every *state* is reachable so the interaction can be judged.

⚠️ **Option 1's `ai*` panel was REPLACED with the ServiceOps Ask-AI design** (14 Aug 2026),
analysed live at `zenichakalasiya.github.io/ServiceOps_Dashboard` → **Ask AI**. What was
copied, all measured off that panel rather than eyeballed:

- **Header** = a tinted icon tile + title + a **scope subtitle** (`<board> · N widgets`),
  then ⋮ and ✕. ⚠️ The droppable **"READING" chip strip is gone** — that design carries the
  scope in the header instead. `aiCtxRender()` is kept (it guards for the missing node) so
  the chips can be restored without rewriting `aiOpen()`.
  ⚠️ **The tinted ✦ mark tile is gone too** (request, 17 Aug 2026) — `.aimark` and its
  markup were removed and the chat name now leads the header. It was decoration: the rail
  row, the toolbar button and every answer already carry the ✦, and the 36px it was using
  is what the (ellipsised) chat name needed — *"Monitor availability to…"* now fits whole.

#### The header is now: `⧉ · name ⌄ · ⋯ · ⧉ Layout · ✕`

⚠️ **Reshaped again on 19 Aug 2026**, against a supplied reference:
- **New chat LEADS the header and is icon-only** — it moved to the **left of the chat name**
  and lost its "New" label. ⚠️ It is **hidden while the thread is empty** (`aiNewBtnPaint`):
  starting a new chat from an empty one does nothing, so the control would be a no-op the
  first time anyone ever sees it. ⚠️ The paint call sits **above `aiRender()`'s empty-state
  early return** — the tail of that function never runs on an empty thread, which is exactly
  the case it has to hide in.
- **`?` became a `⋯`.** It stopped being a help button when Rename chat and Delete chat moved
  into it; a question mark over two chat actions promises the wrong thing. Its `data-tip` is
  **More**, and the menu itself is unchanged.
- ⚠️ **`.aihbw` and `.aihb .lb` were deleted with the label** — nothing carried one any more.
  Why the modifier existed is worth keeping though: it was named `.aihbw` and **not `.wl`**,
  because `.wl` is the old widget-library tile (`flex-direction:column`), and the first build
  rendered the header glyphs stacked above their words.

Three controls were added on 17 Aug 2026, each from a supplied reference image.

- **The chat name is a DROPDOWN TRIGGER** (`.aihttl` / `aiChatMenu`) — Rename · Delete,
  then **CONVERSATIONS**, which is the whole history. Click-to-rename moved **into** the
  menu, so the name has one behaviour.
  ⚠️ **The header's History button is GONE and so is the "Show all ›" row** (request,
  17 Aug 2026: *"remove the History button because you already set on CONVERSATIONS"*).
  The dropdown absorbed the job — `aiHistOpen()` (the in-body sheet) is **kept but
  unreferenced**, so it can be pointed back in one edit, the way Option 2 keeps `iFocus`.
- **The dropdown is the ClickUp shape** (reference supplied 19 Aug 2026 — the AI chat's
  name menu at `app.clickup.com`): a **`Search AI chats…`** box on top, rows **banded by
  date** (`Today · Yesterday · Aug 16 · Jul 9`), a **speech-bubble mark** on each row
  (`AI_MI.chat`, filled on the current chat), the name, **when it happened** on the right,
  ✎ 🗑 on hover, then **`Show all N ›`**. `AI_CHAT_RECENT` went 5 → 8 → **6** (request,
  20 Aug 2026 — at 8 the menu filled to the point where *Show all* looked redundant, which
  is the opposite of what it is for; the dropdown is the quick switch, the screen is the
  archive). A search narrows
  the list rather than the cap, so an older hit is reachable by typing.
  ⚠️ **The rows are `<div role="button">`, not `<button>`**, because ✎ swaps the name for an
  `<input>` in place (`aiChatRenRow`) and interactive content inside a button is invalid.
  ⚠️ **That is why `.aihm .conv` carries the button rules explicitly** (`display:flex`,
  padding, radius, hover). When the row first became a div it inherited none of
  `.aihm button{…}` and rendered as a block — avatar, name, time and actions each on their
  own line. The 19 Aug screenshot of that is the regression this note exists to prevent.
  ⚠️ `aiChatList()` repaints the **list only**, so the search box keeps its focus and caret.
  ⚠️ The in-row rename field is `.nmwrap` — input plus the reference's **⊗ clear** button.
  The earlier note that argued against date bands ("over five rows they would be more
  heading than list") is superseded by the request to match the reference.
  ⚠️ The Show all row hides itself when everything already fits, and `aiChatDelRow()`
  repaints the **whole menu** rather than just the list, because deleting can take the count
  under the threshold and the row has to go with it.
- **`Show all` opens the full history SCREEN** (`aiHistOpen` / `aiHistFullHTML` /
  `aiHistFilter` / `aiHistClose`, `.aihf*`), which took over the previously-dead in-body
  sheet. A back arrow, the chat count, a full-width **Search AI chats…**, and **date-banded**
  rows — `Today · Yesterday · Aug 14 · Jul 7 …`, the year appended only when it is not the
  current one — each with room for a **two-line summary** the 230px dropdown could never
  carry, plus rename/delete on hover.
  ⚠️ **One renderer with the menu**: `aiChatBand` / `aiChatWhen` / `aiChatSummary` are
  shared, so the screen and the dropdown can never disagree about a band or a timestamp.
  ⚠️ **`aiHistFilter()` repaints and restores the caret** (`selectionStart`) — replacing the
  whole screen on `oninput` drops focus out of the search box on the first keystroke.
  ⚠️ `aiRender()` repaints `#aiBody` from the thread, so anything that re-renders the chat
  takes this screen down — which is what Back, opening a chat, and asking a new question all
  want. `aiHistShown` exists only so a delete can repaint in place.
  ⚠️ An earlier build expanded the dropdown in place instead. That is gone: a 230px menu
  cannot carry a summary per row, and scrolling a menu past the panel height reads as a bug.
  ⚠️ **Hovering a row swaps the timestamp for ✎ / 🗑**, it does not show both: the row is
  only ~230px wide and carrying both pushed long chat names into an ellipsis two words early.
  ⚠️ **Every delete asks first** (`aiDelAsk` / `aiDelGo` / `aiDelCancel`, request 19 Aug
  2026). All three doors — a row's 🗑, the full-history screen's 🗑, and the ⋯ menu's *Delete
  chat* — open one confirmation card inside the panel that names the chat, counts its
  questions, says it can't be undone, and waits. The real work lives in `aiChatDelRowDo` /
  `aiHistDelDo` / `aiChatDelCurDo`.
  ⚠️ Not a browser `confirm()` — nothing in this file uses native dialogs, and a system modal
  over a dark panel reads as a crash. It is `.aidelsc` (a scrim inside the panel) + `.aidel`.
  ⚠️ **Focus lands on Cancel**, not Delete: Enter on a freshly opened destructive dialog
  should be the safe answer; the red button is one Tab away. **Esc cancels** — it is a new
  first rung on the panel's Esc ladder, ahead of "leave full screen" and "close the chat".
  ⚠️ Delete is **`--red`**. That is this system's critical colour, and deleting a chat is
  the one destructive, irreversible act in the panel — unlike Stop, which is deliberately
  not red. ⚠️ Focus is set **synchronously**, not in a `setTimeout(0)`: a probe reading
  `activeElement` right after the click saw nothing focused, and so would a screen reader.
  ⚠️ **✎ renames the row IN PLACE and does not open the chat** (annotation, 19 Aug 2026).
  It used to `aiHistGo()` then `aiRename()`, which switched you into a chat you had only
  meant to retitle. If the renamed row IS the current chat, the header title follows.
  ⚠️ `aiChatDelRow()` is not `aiChatDelCur()` — a row may be any chat, so it only resets the
  thread when the row you deleted is the one you are in.
- **`AI_CHATS` is seeded with nine dashboard/widget chats** whose offsets are **relative to
  load** (`AI_MIN` / `AI_HR` / `AI_DAY`), not fixed stamps, so Today / Yesterday / the dated
  bands are all populated whenever the prototype is opened. One seed is deliberately ~285
  days old so the band that carries a **year** is reachable at all.
  ⚠️ Those constants are prefixed for a reason — bare `MIN` / `HR` / `DAY` at the top level
  of this flat script is the collision trap the file opens with, and `lxRangeStamp()`
  already has its own `MIN`.
- **Hover preview** (`.aihov` / `aiChatPeek`) — a card with the chat's ✦, its name, a
  one-line summary and a `N messages · Yesterday 3:53 pm` footer, on a 260ms delay so
  running the cursor down the list stays quiet. Seeded chats carry their own summary; a
  real one is summarised from what it holds.
  ⚠️ It is appended to **`<body>` at `position:fixed`**, not into the menu — the panel is
  `overflow:hidden` in Floating and only ~408px wide, so a card parented to the menu would
  be clipped and far too narrow to read.
  ⚠️ **It must NOT measure the panel to place itself.** `.aipanel` transitions its transform
  on open, and a rect read mid-flight reports the panel still 428px off-screen — the card
  was then positioned against that and landed *on top of the very list it was previewing*.
  It only looked correct under test because the probe freezes transitions; the bug showed up
  the moment a screenshot was taken with them live. `aiPanelLeft()` derives the settled edge
  from **`--ai-w`** instead — custom properties are never transitioned, the same lesson the
  rail flyout records for `--rail-w`.
  ⚠️ The trigger is a `role="button"` **span, not a `<button>`** — `aiRename()` swaps the
  name for an `<input>` in place, and interactive content inside a `<button>` is invalid and
  eats the clicks. While renaming, `.ren` hides the caret and `aiChatMenu` returns early.
  ⚠️ **`.aiht` needs `align-items:flex-start`.** It is a flex COLUMN, so the trigger
  stretched to the full header width and its hover/open background painted a pale slab
  right across the header instead of hugging the chat name.
  ⚠️ The caret is a **real SVG chevron, not a `⌄` glyph** — the character sits high in the
  line box and its weight does not match the header's other icons, so at 15px beside a
  600-weight title it read as a stray comma. The trigger also **keeps its highlight while
  the menu is open**, or moving the pointer into the menu drops the hover and nothing says
  which control opened it.
  ⚠️ **Delete uses `aiChatDelCur()`, not `aiHistDel()`** — the latter re-opens the history
  sheet, which is wrong from a header menu. It bumps `aiChatId` for the same reason
  `aiNewChat()` does: without it the next chat overwrites the last one in history.
- **Help** — **Documentation ↗ and Support ↗**, held in **`AI_HELP`**. The reference's
  third row, *Release Notes*, was explicitly not wanted. Both URLs were checked 200 before
  being written in (`docs.motadata.com/motadata-aiops-docs/`, `support.motadata.com`);
  `www.motadata.com/support/` is a 404, don't use it.
  ⚠️ **THEY LIVE UNDER THE STARTERS NOW** (request, 21 Aug 2026: *"this 2 link will be set
  below the suggestion text"*), as `.aihelpl` at the tail of the empty state — deliberately
  the quietest thing there (`--text-dim`, no `--ai-cta` wash, a hairline above), because the
  five starters are what the panel is for.
  ⚠️ **SIDE BY SIDE, AS LIGHT-GREY BUTTONS** (request, same day). They shipped for an hour
  as a stacked pair of transparent rows, which read as two more starters in a column of
  five — the same shape as the thing they are meant to be secondary to. A row of two grey
  buttons (`--panel-2`) is a different object and takes one line of the panel instead of two.
  `flex:1 1 0` on both, **not** `1 1 auto`, so they are equal halves rather than sized by
  "Documentation" being twice the word "Support".
  ⚠️ **The ↗ is hidden until hover** (request, same day) — it repeats on both buttons and
  says the same thing on each, so at rest it is noise. It keeps its **box**, only its paint
  goes: taking it out of flow would reflow the label under the cursor. That is the opposite
  of the context chip's ✕, which *is* out of flow — there the chip is ~180px and every pixel
  of label matters; here each button is half a 408px panel and the labels are two short
  words.
  ⚠️ **One array, two surfaces.** `aiHelpMenu` renders the same `AI_HELP`, so the empty
  state and the ⋯ menu can never disagree about a URL.
  ⚠️ **The ⋯ button hides on an empty chat** (`aiHelpBtnPaint`, same gate and same reasoning
  as ＋ New chat). Those two links were its only rows there — Rename and Delete are already
  gated on `aiThread.length` — so it would have opened an empty card, and it was opening it
  straight over the ✦ mark.
  ⚠️ **Rename chat / Delete chat are HIDDEN WHILE THE THREAD IS EMPTY** (request, 21 Aug
  2026), so a brand-new chat's ⋯ menu is those two links and nothing else. There is nothing
  to rename or delete before the first question — the chat is not in history yet, so Delete
  has nothing to remove and Rename would title something that may never exist. Same test
  (`aiThread.length`) and same reasoning as `aiNewBtnPaint`, which hides ＋ New chat on an
  empty thread. ⚠️ **The `<hr>` is emitted with them**, not left behind — otherwise the menu
  opens on a divider with the two links pushed down by a rule separating them from nothing.
- **Layout — a TOGGLE between `Floating` and `Full screen`** (`AI_LAY` / `aiLayTog` /
  `aiLayOther` / `aiLaySet` / `aiLayCur` / `aiLayPaint`).
  ⚠️ **THE DROPDOWN IS GONE** (request, 21 Aug 2026: *"when i click layout to remove the
  popup … click to convert full screen and click to convert floating"*). Once Sidebar was
  removed the menu held one alternative and a ✓ against the mode you were already in — a
  popup and two clicks to do what one click can. `aiLayMenu` is **kept and unreferenced**
  (with `#aiLayM`'s CSS), so a third layout is one `onclick` away.
  ⚠️ **The trigger now shows where it GOES, not where it is.** While it opened a chooser,
  wearing the current layout was right — the menu listed the alternatives. A toggle has no
  list, so the glyph and the tooltip both name the destination, which is what `AI_FS_OUT` /
  `AI_FS_IN` already did for the full-screen button this control absorbed. `.on` still means
  *in full screen*: the class describes the STATE, the glyph the ACTION. Don't fold them.
  ⚠️ **`#aiLayBtn` was removed from `aiHdAway`'s exemption list** — it is no longer a menu
  trigger, so clicking it while the ⋯ menu is open should close that menu, not be ignored.
  | row | geometry | can be dragged |
  |---|---|---|
  | **Floating** (default) | `.aifloat` — a detached rounded **card** floating 20px off the top, right and bottom, `--ai-w` wide and **full height**, board visible around it | **moved** by its header, **sized** from the left / top / top-left corner |
  | **Full screen** | `.aifs` — takes the viewport, thread centred at 840px | — |
  ⚠️ **SIDEBAR WAS REMOVED AND FLOATING IS THE DEFAULT** (request, 21 Aug 2026). Sidebar
  had been a full-height right column that made `.shell` yield `--ai-w` via `body.aisplit`,
  and had been the default since 17 Aug. **The card now rests at exactly that size** —
  `--ai-w` wide and full height — so the geometry survived the mode. Three things went with
  it and are **kept unreferenced**, not deleted: `aiSplit` (now always `false`), the
  `body.aisplit` CSS, and the **drag-to-the-right-edge dock gesture** (`.aidockghost` /
  `body.aidockr`, whose `aiRzEnd` branch is gone). The Sidebar icon's SVG is parked in a
  comment above `AI_LAY` — it took two corrections to get right (its fill was on the LEFT
  region while the chat docks on the RIGHT), so redrawing it would repeat that.
  ⚠️ **`aiLaySet('sidebar')` now maps to `'floating'`** rather than stranding the panel in
  a mode with no row in the menu.
  ⚠️ **Two size constants had to follow the new resting geometry**, and both were bugs the
  moment the card grew: `AI_MAX_H` (900) sat *below* `100vh - 40` on any window taller than
  940, so dragging the card shorter left no way back — it is gone, the viewport is the only
  ceiling. And `aiFMinW()` now folds `AI_MIN_W` (440, by request) against the card's own
  resting `--ai-w` (420px, 348px once the responsive steps bite) — a floor above the resting
  width made the card jump wider on the first pixel of a drag.
  ⚠️ **Floating and Sidebar used to render identically** — both were the same full-height
  column at the right edge, and only `.shell`'s padding told them apart. Two of the three
  rows looked the same, which is what the follow-up request called out. Floating is now a
  real card; that is the difference the menu was promising all along.
  ⚠️ It **replaced a two-state "Show as split view ⇄ Show as overlay" toggle**, and the
  header's **⤢ full-screen button was folded into it**. Three modes on one axis need one
  control: a toggle can only describe two of them, and the separate ⤢ could show "Expand"
  while the menu already said Full screen. `aiFsTog()` is untouched and still does the work
  — the Esc ladder and `aiDashGo()` call it directly — it just has no button of its own now,
  and `aiLayPaint()` runs at the end of it so the trigger stays truthful either way.
  ⚠️ **Floating is the DEFAULT** — `let aiSplit = false`. Sidebar held that job from
  17 Aug 2026 (*"open in Sidebar with small width"*) until it was removed on 21 Aug.
  ⚠️ **That is why `--ai-w` was narrowed 520px → 420px** (ladder 420/408/396/384/366/348) —
  it is the width the chat opens at, every time, and 520px took a fifth of a 1600px screen
  before you had asked anything. The ladder still drives the floating card's resting width.
  ⚠️ **One token drives both sides** of Sidebar — `--ai-w` is the panel width *and* the
  padding the shell gives up (the `--dp-w` lesson in the root CLAUDE.md).
  ⚠️ **THE `.cwfab` CREATE WIDGET BUTTON DODGES ON OVERLAP, NOT ON MODE** (request, 22 Aug
  2026). It was `body.aifloat .cwfab{right:calc(var(--ai-w) + 36px)}` — shifted for the
  whole of Floating, which is *every* session now that Floating is the default. Drag the
  chat to the middle of the board and Create Widget stayed parked out by the card's old
  anchor, in the middle of the canvas, dodging something that was no longer there.
  `aiFabPaint()` now measures the card against the FAB's box and toggles `body.aifabshift`.
  - ⚠️ **The test is always against the FAB's *default* box, never its current one.**
    Testing the shifted position oscillates: shift it clear → it no longer overlaps →
    unshift → it overlaps again. Anchoring to the resting position is what makes the state
    stable, and there is a probe assertion that repainting three times does not move it.
  - ⚠️ **`--cwfab-r` is measured from the card's live left edge**, not derived from
    `--ai-w`, so a *resized* card is cleared properly too.
  - It is called from `aiSplitPaint`, `aiRzMove` (both the move and resize branches) and
    the `resize` listener — the last one repaints **before** the `AIF.x === null` early
    return, because the test depends on the viewport even when there is no pinned geometry
    to clamp.
  ⚠️ **Order matters in `aiLaySet('full')`**: `aiFsTog()` only strips `body.aisplit` when it
  finds `aiSplit` still true, so clearing the flag *before* calling it left the shell holding
  its column open behind a `100vw` panel. Toggle first, then clear and repaint.
  ⚠️ The *preference* lives in `aiSplit`; the body class is owned by `aiOpen`/`aiClose`, so
  closing the chat gives the column back and re-opening restores it.
- ⚠️ **A MOVE MAY NEVER CHANGE THE SIZE.** `aiRzMove`'s `move` branch clamps, then **pins
  `w`/`h` back from the mousedown snapshot** and returns. Reported twice (21 Aug 2026:
  *"when I move the chat interface down the height increases"*) and **not reproducible** — a
  header drag measured a **0px** height delta at 1600×950, 1512×1000 and 1366×768, at rest
  and after shrinking, in all six directions. The pin makes it structurally impossible
  rather than merely true today; `aiClamp()` legitimately adjusts `h` for window resizes, so
  a move has to undo that for itself. Only the `move` branch is pinned — the resize branches
  own the size on purpose.
  ⚠️ **Vertical travel is near zero at the resting size, and that is the real complaint
  behind it.** The card rests at `100vh − 40`, which IS `aiFMaxH()`, so `aiClamp` pins `y`
  at 20 and it cannot be dragged up or down at all until it is made shorter. Measured room:
  **217px** at 1600×950, **260px** at 1512×1000, **35px** at 1366×768 and **0px** at
  1280×720. That is a direct consequence of *"the floating view is sidebar size"* — to get
  travel back, either the resting height shrinks or the card is allowed past the bottom
  edge. Neither has been done; the trade-off is the user's call.
  ⚠️ A probe asserting "it still moves by >100px" fails at 1366×768 and 1280×720 **on
  correct code** — expect the room that exists, not a fixed number.

- **Move and resize** (`AIF` / `aiDragStart` / `aiRzStart` / `aiRzMove` / `aiRzEnd` /
  `aiRzReset` / `aiFloatApply` / `aiFloatSeed` / `aiClamp`, grips `.aigw` `.aign` `.aignw`).
  Floating: drag the header to move, drag the left edge / top edge / top-left corner to
  size. Sidebar: the same left grip widens the column. **Double-click any grip** to go back
  to the authored geometry — the same escape hatch the widget resize gives you, and the
  only way back once a drag has pinned explicit values.
  ⚠️ The card is anchored bottom-right by CSS; the first drag **seeds** left/top/width/
  height from the live rect (`aiFloatSeed`) and switches to explicit positioning, or it
  jumps on the first pixel of movement.
  ⚠️ `aiFloatApply()` **clears the inline geometry first, every time**. Those px values must
  never leak into Sidebar (width comes from `--ai-w`) or Full screen (`100vw`).
  ⚠️ The sidebar drag writes `--ai-w` **inline on `<html>`**, which beats the responsive
  `:root` steps — the same mechanism the `ac*` panel's `.acgrip` uses, and the reason a
  dragged width survives a viewport change instead of being stomped by the next query.
  ⚠️ **Clamp the SIZE first and derive the position from it** on the west/north grips.
  Moving `x` by `dx` and clamping `w` separately lets the card keep sliding left after it
  has hit its minimum width, so the right edge walks away from where you pinned it.
  ⚠️ `aiClamp()` keeps 160px of the card horizontally and its whole header vertically on
  screen — a card dragged fully off is unrecoverable, there is nothing left to grab. There
  is also a `resize` listener, because px positions can be stranded by a window resize.
  ⚠️ **Testing this in headless needs clamp-safe deltas.** `--window-size=1600,950` gives an
  807px viewport, so the card's top starts ~127px down; a probe that dragged it up 150px hit
  the clamp and three assertions failed on working code. Assert the clamp separately.
- ⚠️ **`aiHdMenuClose()` closes by CLASS (`.aihd .aihm`), not by a list of ids.** It named
  only `aiChatM` and `aiHelpM`; when the Layout menu arrived it was never removed, so
  click-away left it on screen **and** `aiHdMenu`'s "already open → just close" guard saw the
  stale node and refused to reopen — the menu then showed a ✓ against a mode that was no
  longer current. A new header dropdown only has to carry `.aihm` to be handled.
- ⚠️ **`.aihd` is `z-index:3`, not 1.** `.aibody` is also `position:relative;z-index:1` and
  comes later in the DOM, so on a tie it wins — and both header dropdowns, which hang down
  into the body's area, painted *underneath* the thread.
- The **History** button now overlaps the name menu's Conversations list. Both were kept:
  History is the full sheet, the menu is the quick switch, and "Show all ›" is the same
  sheet. Worth revisiting if the header gets tight.
- **Empty state** = big mark, a **personal greeting** ("Hello <name>, how can we help?" —
  the name comes off the signed-in identity), one line of help text, then **four gradient
  CTA rows** (44px, radius 10, icon + label, no chevron).
- **Answer** = a status line → a **titled** block → 👍/👎/copy → a **"Follow ups"** list of
  chevron pills. Not one paragraph bubble, which is what it used to be.

### Every action in the panel is wired, not a toast

Request, 14 Aug 2026 — *"all action will be on working mode"*. Six controls were toasts and
now do real work:

| control | what it does now |
|---|---|
| **Chat history** (header) | a real sheet over the body — chats are filed in `AI_CHATS`, click a row to reopen it, 🗑 to delete. The current chat is marked |
| **＋** (composer) | a real command menu; each row **fills the composer** with a ready question |
| **👍 / 👎** | hold their state on the message (`m.fb`) and render selected; clicking again clears |
| **Investigate →** | finds the widget the number came from (`m.src`) on the board, **scrolls to it and flashes it** (`.aiflash`); says so plainly if it is not on this dashboard |
| **Add to another** | lists the *other* dashboards from `DASH_GROUPS`, and picking one switches board and adds there |
| **Auto-approve** | with it **off**, a widget build waits at the docked `.aipend` bar for Accept; **on**, it applies the moment the preview lands (`aiBuildAuto`). ⚠️ The amber two-click "✓ Confirm — add it" dance this described is GONE (20 Aug 2026) — the bar's Accept is the confirmation |

- ⚠️ `aiNewChat()` must call `aiFile()` **and bump `aiChatId`** before clearing. Without
  the id bump the next chat reuses the old id and *overwrites* the previous one in history
  instead of joining it — caught by a test, invisible until you open history twice.
- `aiInvestigate` locates the widget by `.widget[data-g][data-i]`, which is why those
  attributes on the canvas are load-bearing beyond drag-and-drop.

### Scope — module-wise working, and product-only answers

Built to **`ObserveOPS-AI-Chat-Mode-and-Scope.pdf`** (in this folder), which is explicit that
**mode and scope are two different controls and must not be merged**: *mode* is what the AI
does and the AI picks it; *scope* is what data it looks at and the **user** picks it. Scope
lives with the input at the bottom, because it describes what happens next.

- **The context bar** (`.aictxbar` / `aiCtxBar`) is the **first row INSIDE the composer
  pill** (annotation, 18 Aug 2026 — see *The composer is the chat area* below) and holds
  the **pinned context only**: the open board, @-mentions, uploads, all removable.
  ⚠️ **It used to lead with a non-removable `Context <module> ▾` chip, and that chip is
  GONE** (annotation, 18 Aug 2026). Scope still exists and still gates every question —
  ⚠️ **clearing every context chip leaves the module scope standing, so the chat keeps
  working module-wise** rather than falling back to global — but it is set from the entry
  point, from the mismatch card, or by **picking a module in the @-mention list**, which is
  what replaced the chip. See *Modules are in the @-mention list* below.
- **Smart default from where the chat was opened** (`aiScopeFrom`), per the spec's table:
  inside a module → that module (Dashboards → `Dashboard`, with the open board pinned as a
  context chip) · global nav / command palette → `All modules` · an alert card → `Alerts`
  with that alert pinned. `aiOpen(where)` takes the origin; it only applies the default on a
  **fresh** chat so it never stomps a scope the user set.
- **Dropdown** = `All modules (Global)` + the 9 modules, current one marked `●`.
  ⚠️ `aiScopeMenu` / `aiScopeMenuHTML` / `aiScopePick` / `aiScopeChip` are **kept but
  unreferenced** since the chip was removed — the dropdown can be restored in one edit.
- **Product-only answers.** `aiInScope()` gates every question; anything outside ObserveOps
  gets the *Out of scope → friendly redirect* state from the Designer's Guide §5, and — per
  its golden rule that nothing may dead-end — the redirect names what it **can** answer and
  offers three follow-ups.
- **Scope mismatch asks, never guesses.** `aiScopeNeeds()` spots a question that needs another
  module's data and returns the spec's own prompt — *"This needs Logs data. Your scope is set
  to Dashboard."* with **[Expand to Logs + Dashboard]** and **[Keep Dashboard only]**.
  ⚠️ It must never silently expand or silently fail; there is a test asserting the scope is
  unchanged after *Keep*.

⚠️ Not built here: the **ModeBadge** (`⌁ Query` + `[Change]` on the AI message) and the
`/ask` `/query` `/do` slash overrides. The `ac*` panel already implements those
(`acDetect` / `acModeHTML` / `acStrip`); this panel has scope only.

### The conversation flow (also copied, by driving theirs)

Every question was typed into the reference panel and the reply read back. It does **not**
return one prose bubble — it picks an **answer TYPE** from the question and renders that
type's own shape. `aiRoute(q)` → `aiBuildAnswer(type, q)` reproduces all six, with the exact
status line each prints:

| type | status line | shape |
|---|---|---|
| `summary` | "Read N widgets and ranked what matters" | two `<h4>` sections of bullets |
| `rank` | "Ranked for your role · deadline first" | numbered list, each with **Investigate →** |
| `metric` | "Checked it against its normal range" | value+delta / verdict / definition + Investigate |
| `diff` | "Diffed every metric against your last visit" | last-visit line + ↑/↓ delta rows |
| `attention` | "Reasoned in 3 steps · ranked for your role" | rows carrying their source widget as a chip |
| `build` | "Configured from your description" | live preview + type switcher + query rows + Add-to |

Two behaviours worth keeping, both observed on theirs:
- ⚠️ **Unknown input never dead-ends.** "asdfgh zzz nonsense" fell back to the `metric`
  answer on the top metric rather than erroring, so `aiRoute` returns `metric` as its
  default and `aiPickMetric` defaults to the worst metric.
- ⚠️ **An under-specified build asks a STEPPED set of questions first** (`AI_CLAR`,
  `aiAskGroup` → `aiClarNext` → `aiPreviewHTML`), rebuilt 19 Aug 2026 from a supplied Notion
  reference. It was one question with a `1 of 1` counter that could never be anything else;
  it is a card now — **back arrow · question · `n / total` · radio rows with one already
  lit · an “Or, describe your requirements…” free-text row · Skip · Next** (the last step
  reads **Build it**).
  - ⚠️ **Every step must be something the preview actually uses, or the card is theatre.**
    The three are `group`, `range` and `chart`: two were already in `aiBuildState`, and
    `range` was added to it **and printed in the preview's query rows**. Don't add a fourth
    without wiring it through.
  - ⚠️ **Going back RESTORES the answer you gave** (`aiClarRestore`). It used to reset `sel`
    to 0, so stepping back and forward again silently replaced your choice with the default
    — visible only by reading the query rows on the preview afterwards.
  - ⚠️ **Typing in the free row selects it** (`sel = -1`) and clears the radio: a lit radio
    with a caret in the text box is two answers at once.
  - **Skip keeps the step's default** rather than leaving it unanswered, which is why one
    row is always pre-lit and Next is never a dead button.
  - ⚠️ The radio mark is **`.aicqr`, not a bare `.rd`** — the `ac*` panel already styles
    `.acsmi .rd`, and a bare class here would reach into it.

The preview's **Add to “<board>”** calls the host's `awAdd()`, so a widget built in the chat
is a real widget — drag, resize and undo all work on it. The chart-type switcher
(Column · Bar · Line · Doughnut · KPI · Table) re-renders the preview art in place.

Metrics come off the board's own **donut widgets** (`aiMetrics()`), so the numbers in an
answer agree with the canvas; deltas are fixed per label so a metric reads the same every
time it is asked about.

⚠️ `diff` used to slice the worst-first list, so it showed **only rises** and the "improved"
row was unreachable — and sorting by magnitude alone did not fix it, because every big mover
on this board is a rise. It now takes the three biggest movers **plus the biggest
improvement**, which is also a fairer reading of "what changed".
- **Composer** = a rounded box (radius 20, ~128px) with `＋` on the left, the input, and
  send on the right. It began as a 46px pill; see *“The composer, measured off ClickUp”*.
  Placeholder: *"Ask, build and act across your stack"*.

#### The composer IS the chat area — context and Auto-approve moved inside it

Annotation, 18 Aug 2026: *"the auto-approve action show in chat area and the context will be
also show in chat area"*. It used to be **three stacked strips** — a loose row of context
chips, the input pill, and the Auto-approve toggle floating underneath — so the one place
you act read as three unrelated things. `.aiinbox` now holds all of it:

| row | what |
|---|---|
| 1 | `#aiCtx` — the pinned context chips (the Scope dropdown was removed later the same day) |
| 2 | the `<textarea>`, full width |
| 3 | `.aiinrow` — 📎 attach · **Auto-approve** (a word, not a switch) … 🎤 dictate · ➤ send |

- ⚠️ **`.aiinbox` changed from a flex ROW to a flex COLUMN.** `.aiinbox textarea` was
  `flex:1` for the row layout and must be **`flex:0 0 auto`** here, or it stretches to eat
  the column and the control row is pushed out of the box.
- `.aictxbar:empty{display:none}` — inside the pill an empty context row would draw a 7px
  gap for nothing.
- **Auto-approve is a WORD, not a switch** (`.aiauto`, annotation + Notion reference,
  19 Aug 2026): quiet text when off, the AI accent + a soft fill when on. It sits next to
  send because it decides what pressing send does. The toggle pill and its `.aisw` knob are
  gone — the heaviest element in the control row for a setting that is off by default.
  ⚠️ `.aiauto` transitions `background`, so a probe reading it straight after the click
  sees the pre-transition value in headless; assert `font-weight:600` instead.
- **The three composer controls are one size and one shape** — 📎, 🎤 and ➤ are all 30px
  circles with 15px glyphs (annotation, 19 Aug 2026). Send was a rounded square between two
  circles and the mic glyph was 16px; both read as a different size though the boxes matched.
- `.aicmd` menus (slash, @-mention) still anchor to `.aicomp`, which is unchanged, so the
  typeahead was not affected.
- **Modules are in the @-mention list** (`AI_MOD_S` / `aiEntList`, annotation 18 Aug 2026:
  *"in this context show also module context"*). All ten of `AI_MODULES` appear as pickable
  context, directly under the board you are on, each with a one-line description and marked
  `already in context` when it is in scope. They wear the **AI accent dot** (`AI_ENT_C.module
  = --ai-2`), since a module is the AI's own reach rather than a product entity.
  - ⚠️ **Picking one widens `aiScopeSel`, and removing its chip narrows it back** — a module
    chip that did not move the scope would be decoration. `aiScopeSync()` falls back to
    `All modules` rather than leaving the selection empty. **This is what gives scope a hand
    control again** after the Context chip was removed.
  - ⚠️ **`aiMentShow`'s cap went 20 → 34.** The list previously filled exactly 20 rows, so
    the ten modules pushed the sample monitors / metrics / services off the end and an
    unfiltered `@` could no longer reach them. The menu scrolls, so a bigger cap costs a
    longer scroll and nothing else.
  - ⚠️ **Keep `AI_MOD_S`'s descriptions short.** The row is name + description on one line
    in a ~408px panel and the description wins the space — *"everything the AI can read"*
    truncated the name to **"All modu…"**, the one row whose name has to be readable.
- ⚠️ **The Context chip is GONE from that row** (annotation, 18 Aug 2026: *"in chat area
  remove the Context"*). Row 1 is the **pinned context only** — the open board, @-mentions,
  uploads. The scope itself is untouched: `aiScopeSel` still gates every question through
  `aiInScope()` / `aiScopeNeeds()`, it is still defaulted from where the chat was opened
  (`aiScopeFrom`), and the mismatch card's *Expand to `<module>`* button still widens it.
  **What is gone is the only way to set it by hand** — `aiScopeMenu` / `aiScopeMenuHTML` /
  `aiScopePick` / `aiScopeChip` are kept and unreferenced (the way `iFocus` is in Option 2),
  so the chip can be pointed back in one edit.
- **While generating, the send button becomes a filled ACCENT CIRCLE with a white rounded
  square** (request + reference image, 17 Aug 2026) — `.aisend` → `.aisend.stop`.
  ⚠️ **It went through two shapes in one session; do not restore either earlier one.**
  It was a solid `--red` rounded square, then briefly a labelled red *"■ Stop"* pill, and
  the supplied reference settled it as the icon-only circle every chat product uses.
  - **Red is gone on purpose.** `--red` is this system's *critical severity*; stopping a
    generation is an interruption, not a destructive act, so the alarm colour overstated it.
  - **The label is gone too**, so what stops it being confused with the **dictation mic**
    8px to its left is now *weight*: stop is a solid accent circle, the mic is a transparent
    circle with a hairline glyph. The word lives in `data-tip` ("Stop generating").
  - The fill is **`--ai` (#8b5cf6), this panel's own accent — NOT the indigo in the
    reference image**; importing another product's brand hue would put a colour in the file
    that no token owns. Swap the two `--ai` values on `.aisend.stop` for the literal one.
  - The glyph is a rounded square at ~36% of the diameter (the reference's proportion); it
    was a 15px block whose hard corners fought the button's radius. Both states now have
    `:hover` / `:active` / `:focus-visible` — there was no focus ring at all.
  ⚠️ **Measuring this in headless needs `transition:none!important` injected** — `.aisend`
  transitions `background`/`border-radius`, so `getComputedStyle` right after
  `aiSetBusy(true)` reports the *idle* colour. Three assertions failed on working code
  before the transitions were frozen (the folder's recorded gotcha).
- ⚠️ **THE TASK ROWS ARE NO LONGER RENDERED** (annotation, 19 Aug 2026: *"the completed
  step will be shown as normal view — remove this type of UI"*). `aiTkHTML` calls
  **`aiTkPlain`** instead: ordinary `.aitki` tick lines with the amount as a trailing note
  and each step's sub-work inline, which is the shape the agentic disclosure has always
  used. A finished trail of four bordered cards with green ✓ badges and *Completed* pills
  was louder than the answer it belongs to, and made one feature look like two.
  ⚠️ **`aiTrRows` / `aiTrTog` and the whole `.aitr*` block are KEPT and unreferenced** — the
  component was supplied by the user and may come back. Don't delete them; don't call them.
  The description below is of that component, and is history rather than current behaviour:
- **The thinking trail WAS task rows** (`.aitr*` / `aiTrRows` / `aiTrTog` / `aiTrStep`,
  component supplied 18 Aug 2026). Each step of the trail was a **row**, not a line:
  a numbered spinner ring that resolves to a green ✓, the step's label, the **amount** it
  worked on, a status **pill**, and — where the step has sub-work — a chevron into a
  dropdown with a connector line and its own rows.
  - Rows **enter staggered at 80ms** and the **running row auto-opens**, which is what makes
    the trail read as work being done rather than as text appearing. The reference's easing
    is kept verbatim: `cubic-bezier(.23,1,.32,1)` on the entrance and the expand.
  - The expand is **`grid-template-rows:0fr → 1fr`**, not `max-height`: it animates to the
    row's real height, so a two-line and a five-line detail both land without a pixel cap.
    The inner wrapper must be `overflow:hidden` for it to work.
  - ⚠️ **A step may be a string OR `{s, am, dt, warn}`** (`aiTrStep` normalises). Strings
    still render, so every plan that was not enriched keeps working. A step with no `dt`
    gets **no chevron and is not clickable**, rather than opening onto nothing.
  - ⚠️ **Nothing fakes a failure.** The red mark and the `Conflict` pill have exactly one
    home: `newdash`'s "Checking the name" step when the name is already taken. The
    reference demos a failed→retry→completed beat; inventing one in ordinary answers would
    be a lie about what happened.
  - ⚠️ `aiStepMs()` had to learn the new shape — it paced on `String(label).length`, and
    `String({})` is `"[object Object]"` for every step, so all of them would have paced
    identically.
  - ⚠️ **Labels are short on purpose.** The row carries badge + label + amount + pill +
    chevron in ~408px; the first pass ("Reading widgets on “Application Performance”")
    truncated two words early. The specifics live in the amount and the detail rows.
  - ⚠️ `aiScope()` returns `time`, not `range`, and has no `alerts`; widgets carry `t`, not
    `vis`. `aiLogScope()` has no `pct` — the share is derived from `top.c / total`. All four
    were wrong in the first draft and rendered `undefined` into the details.
  - ⚠️ **The collapsed header is a PILL carrying a SUMMARY OF KINDS** (reference, 19 Aug
    2026: *"Thought 2x, Searched, Dashboards"*). `aiTkSummary` / `aiAgSummary` read the
    **first word of each step** through `AI_TK_VERB` and de-duplicate, so it reads
    `Thought 3x, Read, Checked` — and it cannot claim a kind the trail did not take, because
    the verbs come from the same array the expanded rows render. **Both** the thinking trail
    and the agentic flow use it, so they collapse identically.
    ⚠️ **Each kind carries its own count when it ran more than once** (`aiTkKinds`) — the
    reference reads *"Thought 2x, Searched 2x"*. A bare verb hides that it ran twice, which
    is the only thing the count was there to say.
    ⚠️ **Two kinds maximum** — a third pushes the line past a 344px panel.
    ⚠️ **TEXT ONLY — no box** (annotation, 19 Aug 2026: *"remove the box, show only text"*).
    It was briefly a bordered, filled chip; against an answer that carries no chrome of its
    own that made the trail look like a component and the answer like plain prose, which is
    backwards. It still hugs its text rather than filling the width.
    ⚠️ The chevron points **down collapsed, up expanded** on the pill (`›` reads as "go
    somewhere"; this is "there is more below"). The unboxed trail keeps the plain 90° rotate.
    ⚠️ The reference also interleaves muted `thought` rows between the steps. Those are its
    placeholder for hidden model reasoning, which this prototype does not have — **inventing
    them would be inventing work**, so they are deliberately absent.
- **The running Reasoning row is a PIXEL-GRID LOADER** (`.aild*` / `aiLdHTML` / `aiLdStart`,
  component supplied 18 Aug 2026). Three parts, all from the reference: a 3×3 grid of 4px
  cells lit by a chevron wavefront, a label whose gradient shimmers across it, and a **live
  elapsed clock** in mono tabular figures (`3m 52.6s`). It replaced a plain spinner.
  - Delays are the reference's own formula, `(col + |row-1|) × 90ms`. ⚠️ The 650ms cycle is
    **shorter than the sweep**, so two wavefronts are always in flight — that is what makes
    it read as continuous work rather than a blink.
  - ⚠️ **The loader is NOT wrapped in `.aitkm`.** That is a 26×26 `display:grid` box for a
    single icon; putting the grid, label and clock inside it stacked all three vertically
    and pushed Skip onto its own line. `.aitkh` is already a flex row — they go in as direct
    children of it.
  - ⚠️ **The clock writes `textContent` on its own 100ms interval**, not through
    `aiRender()`. Re-rendering the thread ten times a second would fight the running
    animations and throw away every open/closed state in it. It is started at the END of
    `aiRender()` (the node does not exist while the string is still being built) and stops
    itself when the node goes away. `a.t0` was added to both agent objects to feed it.
  - Running and done are different objects: running is loader + shimmer + clock, done goes
    back to ✦ + the step count. `prefers-reduced-motion` freezes the grid but **keeps the
    clock ticking** — that is information, not decoration.
- **Each `say` beat now closes its own group inside the Reasoning disclosure** (request,
  18 Aug 2026), rendered as `.aiagsl`. The beat order is tool → say → tool → say, so
  `aiAgPairSays()` attaches a say to the group it **follows**: what I did, then what I said
  I would do next.
  ⚠️ **They no longer repeat below.** While running, the current line is **inside the
  thinking box**; once done, every line is in the disclosure and nothing is printed loose.
  `.aiagblk` renders nothing at all now, and the narration block's feedback row went with it
  — the answer card below carries its own.
- ⚠️ **The loader's label is NOT a constant** (annotation, 18 Aug 2026: *"is same in every
  prompt"*). It read the literal word "Reasoning" on every question, which said nothing
  about what was being worked on. Two things now feed it:
  - each agent carries a per-request **`a.label`** — `Reading “<board>”` for a summary,
    `Designing the <chart> widget` for a build;
  - while running it shows **the tool beat that is actually happening** (`Read the board` →
    `Fetched the counters behind it`). The first beat is titled `Reasoning` because that is
    its heading in the disclosure, so *that one* falls back to `a.label`.
  The finished header carries `a.label` too — a thread of five answers all headed
  "Reasoning" tells you nothing about which is which. The step count stays beside it.
- **The card's background is a WASH, not a fill** (annotation, 18 Aug 2026: *"improve the
  box background colour"*). `--ai-soft` flat was a solid lavender block on white. It is now
  a gradient from a hint of `--ai` at the top to almost nothing at the bottom, over
  `--card` — and light theme gets its **own weaker mix** (8%→2% vs 13%→4%), because white
  takes a tint far more strongly than the dark canvas does. The finished card drops the
  accent entirely and sits on plain `--card`.
- ⚠️ **A NESTED box, from equal specificity losing to source order.** `.aitk.run .aitkh`
  further down the stylesheet still draws the *thinking trail's* own violet pill, and
  `.aitk.bx .aitkh` — same three-class weight, declared earlier — lost to it, so the header
  painted a second bordered box inside the card (annotation, 18 Aug 2026: *"remove inside
  box"*). The overrides are `.aitk.bx.run .aitkh` / `.aitk.bx.cl .aitkh` (**four** classes),
  which outrank it without reordering the sheet and leave the unboxed trail's pill intact.
  There is a probe assertion that the header has no border and no background inside `.bx`.
- ⚠️ **THE BOX IS GONE** (annotation, 19 Aug 2026: *"remove the box — it was more
  highlighted than the result, make it less highlighted than the result text"*). It had a
  border and, while working, an accent wash; against a plain answer that made the
  **thinking** the loudest thing on screen at exactly the moment there is something else to
  read. `.aitk.bx` now carries **layout only** — the padding that keeps the loader row, its
  narration line and Skip together as one block that survives the run and expands in place.
  Everything the 18 Aug requests asked for is kept; only the border and fill went.
  **Don't restore them without re-reading all three requests.**
  ⚠️ The shimmer peak went `--white` → **`--text-dim`** for the same reason: the answer is
  `--text`/`--white`, and a label that brightens past it makes the wait louder than the
  result. Measured after the change — thinking luminance **111** vs answer **247**.
- ⚠️ **The finished trail is COLLAPSED by default** — `open:{}` at all three agent creation
  sites. It briefly defaulted *open* (18 Aug 2026), because at that point the finished trail
  was hidden with nothing on screen to say it existed. Once the card started surviving the
  run — labelled header, step count, chevron — the affordance became visible and the default
  went back to collapsed, so the thread stays short. Don't flip it again without re-reading
  both requests.
- **"Create a dashboard" runs the SAME agentic flow as a summary** (`aiAgDashStart` /
  `aiAgDashBeats` / `aiAgDashLand`, request 18 Aug 2026). It used to render the `lx`-era
  task rows; `aiLand()` now routes `newdash` to the agent, so both prompts produce the same
  loader card and grouped disclosure.
  ⚠️ **The approval gate is untouched.** The beats only narrate the planning — the existing
  `{r:'dash'}` plan card is still the only thing that creates a dashboard, and only on
  Approve. That flow has never been allowed to auto-create a shared object.
  ⚠️ It has **no card BEAT** (unlike the summary's `scard`), so it lands from `aiAgRun`'s
  tail *and* from `aiAgSkip` — both call `aiAgDashLand()`, which is idempotent via `a.landed`
  so a Skip during the last beat cannot push two gates.
  ⚠️ **`op && !running`** is what keeps the running box to just the loader and its line. A
  tool beat reveals ALL of its sub-steps at once, so rendering the body live would tick
  three rows in a single frame — they belong to the finished trail, not to the wait.
- **While thinking, the whole card is ONE box** (`.aitk.run.bx`, request 18 Aug 2026: *"the
  outside text will be show inside of box"*). The loader row, the line it is narrating and
  **Skip** used to be three separate blocks — a bordered pill with two loose paragraphs
  under it. The border and tint moved onto `.aitk.run.bx` itself so all three sit inside,
  and `.aitkh` went back to being a plain flex row within it. Skip sits on the loader row,
  where `.aitksk`'s `margin-left:auto` was always designed to put it.
  ⚠️ **BOTH trails are boxed now** (annotation, 18 Aug 2026: *"the thinking flow will be
  the same before any action"*). An ordinary answer used to think in a bare pill with a
  spark and three dots while a build or a summary thought inside a bordered card with the
  pixel loader — two treatments for the same moment. `aiTkHTML` now emits `.aitk.bx` in
  both states and uses `aiLdHTML()`, so every prompt gets the same border, the same tint
  while working, the same collapsed `✦ <label> · N steps ›` header and the same
  expand-in-place. A probe asserts the two surfaces' border, radius and padding match.
  ⚠️ `.bx` is still a MODIFIER — the earlier note here said the trail was deliberately
  unboxed, which was true until this request. The CSS did not change; only what asks for
  `.bx` did.
  · The loader's label is the trail's **per-request headline** (`m.head`), not the running
    step — the row below already shows the step with its own spinner, and saying it twice
    14px apart is the repetition this panel keeps being asked to remove.
  · ⚠️ **`aiRender()`'s clock hook has TWO possible owners now** — a running `agent` or a
    running `tk`. It picks whichever is live; only one runs at a time.
  · ⚠️ **`.aitkl.tr`** cancels the box's 14px indent. That indent is for the agent's plain
    tick list; applied to full-width task rows it reads as a card inside a card. It also
    has to beat `.aitk.run .aitkl{margin-left:16px}`, hence the extra class.
  · ⚠️ **`.aildl` and `.aitk.bx .aitkt` are `nowrap` + ellipsis.** The agentic flow feeds
    them short beat names; the trail feeds them a headline, which wrapped to two lines and
    pushed the clock, Skip and the step count onto a second row.
  · ⚠️ **Measure the task rows at 1280, not 1600.** At 1600 the panel is 408px and
    everything fits; at 1280 it is 348px and the row rendered *"Reading counters"* as
    **"Readi…"** while *"8 counters"* sat beside it at full width. `.aitra` is now
    `flex:0 6 auto` + ellipsis so the **amount** takes the deficit, and below 1300px the
    green `Completed` pill is dropped — it is the one element saying nothing the green tick
    has not. The red `Conflict` pill stays; it is the only thing that reports a failure.
  · ⚠️ `AI_T.attention.step` was *"Reasoned in 3 steps · ranked for your role"* — that
    string **is** the collapsed header, which prints its own `3 steps` count beside it. It
    is `"Ranked for your role, worst first"` now.
  ⚠️ The loose Skip row still renders for the **`adding`** state, and for a `run` with no
  tool beats yet — those have no box to hold it.
- ⚠️ **The panel-wide ambient "thinking" glow (`.aiamb`) was BUILT AND THEN REMOVED, both
  on 18 Aug 2026.** Built from a Gemini Live reference (three blurred orbs drifting behind
  the rim from send until the answer landed, then sped up and given an ignition), and
  removed hours later by a direct annotation — *"remove thinking time background animation"*
  — because it was the largest moving thing on screen at exactly the moment there is
  something to read. **Do not rebuild it without asking.** The busy state is still said
  three quieter ways: the spinner on the running task row, the dots beside it, and the light
  on the composer's top edge. A comment above `.aisky` in the file records the removal.
  Two lessons from it are worth keeping, because they generalise:
  - ⚠️ **A percentage in a `radial-gradient` is the RADIUS against that axis.** A mask sized
    `118% 88%` had a transparent core 282px wide inside a 520px panel, so the side edges
    never lit at all. `50% 50%` is what reaches all four edges.
  - ⚠️ **An animation overrides a plain declaration while it plays.** Adding an `opacity`
    pulse silently killed `html[data-theme="light"] … {opacity:.42}`, and the effect ran at
    full dark-theme strength on white. Put the range in custom properties and theme those.
- **The brand gradient rides the composer's BORDER, animated** (annotation, 14 Aug 2026 —
  it began as a static bar floating above the pill, then as the reference's blurred sweeping
  bar, then moved onto the border on request). Built as a **masked ring**: `.aiinbox::before`
  is a gradient box inset `-1px` with `padding:1px` and `mask-composite:exclude`, which
  punches the middle out and leaves a 1px ring. The gradient is `background-size:200% 100%`
  and its `background-position` animates, so the light **travels** along the border rather
  than merely fading; `.aiinbox::after` is a blurred copy at `z-index:-1` that breathes on
  its own ease-in-out curve. Focus shortens the travel to 1.9s and brightens the bloom.
  ⚠️ Three things are load-bearing here, each of which broke it once:
    · `.aiinbox` must be `position:relative` — without it the pseudo anchors to `.aicomp`
      and the ring renders ~9% too wide and unaligned (it only *looked* right because both
      boxes are centred; caught by measuring the ratio, not by eye).
    · `.aiinbox` must **not** be `isolation:isolate` — that makes it a stacking context, which
      traps the `z-index:-1` bloom *above* the pill's background and washes the interior pink.
    · the pill's border must be `transparent` with a `padding-box` background, or the fill
      bleeds over the ring.
  `--sv-ring` pulls the ring back to `.72` in light theme; it reads fine at full strength on
  the dark canvas. `prefers-reduced-motion` freezes both animations.
- **Brand gradient**, read off their Ask AI button:
  `90deg rgba(76,177,254,.8) → rgba(115,30,251,.8) 41.49% → rgba(249,17,227,.8)`.
  ⚠️ That panel is **light-only**; `--sv-cta` carries a translucent dark-theme equivalent of
  its pale CTA fill, and `--sv-line` the border, so this works in both themes.
- ⚠️ `.aibody` had `justify-content:center`, which floated the greeting halfway down an
  otherwise empty column. It is `display:block` now.
- ⚠️ **Testing the answer state needs a delay** — `aiPush` lands the answer on a 620ms
  timer, so assertions fired straight after `aiAsk()` see only the user bubble. Phase the
  probe.

The rebuild below (scope card + intent-grouped starters) was the step before this one and
has been superseded, but its two bug fixes still stand:
It was a hero floating in a mostly blank column over four identical full-width rows with a
chevron — Bits' exact pattern — and its canned answers named things that were **not on the
board** (an internal `*.motadata.local` host, "ISP Link - 2", "14 interfaces"). Now:

- **A scope card leads**, built by **`aiScope()`** off the live board: dashboard name,
  category, widget count, time range, and **up / down / critical / major read out of the
  board's own `donuts` widgets**. Naming what the AI can actually see is the
  observability-specific thing a generic chat empty state cannot do.
- **Starters are grouped by intent** — Investigate · Explain · Act — and each `q`/`a` is a
  **function**, so a starter names real things: *"Why are 671 alerts critical?"*, *"Which of
  the 159 monitors are down?"*, *"Explain “Alert Count”"*. They therefore differ per
  dashboard, where Datadog's are static.
- The **NEW** badge is gone and the body is top-aligned rather than centred.

Two real bugs were fixed on the way:
- ⚠️ **The context strip rendered a BLANK chip on a flat board.** `TABS[currentGroup()] ||
  TABS[0]` looks like a fallback but `TABS` is `['']` when ungrouped, and `'' || ''` is
  still `''` — so an empty chip drew. The group chip is now skipped entirely when
  `ungrouped`.
- The alert chip was the hardcoded string `'7 active alerts'`; it now comes off the board.
- The internal hostname in the answers was replaced per the repo scrub rule.

**Option 1 — light chat panel** (`aiOpen` / `aiClose` / `aiSend` / `aiRender` / `aiPush`,
`AI_STARTERS`). Opened by the rail's ✦ row, the toolbar's **✦ Ask AI**, or the `A`
shortcut. Empty → thinking → answer, five canned starters (`AI_CTA` — the fifth,
*“Build a time-series widget for”*, is a deliberate fragment that reaches the clarifier),
an **Auto** toggle
(`aiToggleAuto`), and a "Reading" strip of droppable context chips (`aiCtxRender` /
`aiCtxDrop` / `aiCtxReset`) built live from `#dashTitle`, the current group, the timeline
range and the alert count — so you can narrow what the AI sees before asking. `#aiPanel.on`
is in `kbBusy()`.

#### "create dashboard" is a workflow, with a real approval gate (Option 1 only)

`aiRoute` returns **`newdash`** and `aiPush` pushes a `{r:'dash'}` thread entry rendered by
`aiDashHTML` — plan → (edit) → approve → done → undo, per Mode 3 of the Designer's Guide.
The parameter card is the **live product's own Create-Dashboard form** (Dashboard Name,
Category, Security, Header Font Size, Horizontal/Vertical Gap, Row Height, Default Landing);
no field is invented. State lives on the thread entry, found by `aiDashState()`.

- ⚠️ **THE GATE LEFT THE CARD** (request, 20 Aug 2026: *"when I create or any action
  performed in chat interface … every action approval will be same"* as the widget build).
  The decision is the docked **`.aipend` bar** over the composer — `Dashboard ready —
  “<name>” · Category <cat> · <sec>` with **Edit · Accept**, and a single **Done editing**
  while the form is open — and **Cancel is a follow-up chip on the card**, the widget
  flow's Reject pattern. The card keeps the plan, the form, and the warning only.
  ⚠️ This also RESOLVED the Designer's-Guide conflict the 19 Aug gate carried (a filled
  `.aigo` primary against §4's equal-weight rule): in the bar, Accept is `.aiagb pri` —
  the same weight the widget flow's Accept has always had, one pattern everywhere.
  `.aigo` / `.aiskip` / `.aiacts.gate` are kept in CSS, unreferenced.
  ⚠️ The plan is still ALWAYS gated, Auto-approve on or off — that rule did not move.
- ⚠️ **`histDo()` / ⌘Z cannot undo this.** `histState()` snapshots the *canvas* model only
  (`{TABS, WIDGETS, GRP_SHUT, curG}`) — it knows nothing about `DASH_INDEX`, `DASH_GROUPS`,
  `BOARDS` or which board is open, and `newFlatBoard()` clears the stack anyway. So
  `aiDashUndo()` owns its own reversal and remembers `d.prev` / `d.prevDefault`. A first
  version called `histDo()` and toasted "⌘Z undoes it"; both were lying.
- **Creating is two jobs**, as in `ddCreate()`: `newFlatBoard()` makes the canvas, and the
  list-panel bookkeeping (`DASH_GROUPS` items, `DASH_INDEX`, visibility `p`, `DASH_DEFAULT`)
  is separate — skip it and the board exists but never appears in the panel.
- Undo must `pickDash(prev)` **before** deleting `BOARDS[name]`, because `pickDash` is
  monkey-patched to `boardSave()` the board it is leaving — drop the store first and it is
  written straight back.
- ⚠️ **The scope-mismatch guard is for READ intents only.** `aiPush` now routes first and
  skips `aiScopeNeeds()` for `build` / `newdash`. Building a widget on the board in front of
  you is not a cross-module read, and challenging "a grid of monitors" as a Monitor-scope
  mismatch made two of the five shipped starters unreachable.
- The plan card is **always gated, even with Auto-approve on** — unlike `aiBuildAdd()`, which
  honours `aiAuto`. Auto-creating "New dashboard" in the default category is useless; the card
  is where the name and category get chosen at all.
- `.aidsteps` must cancel `.aiab li::before`, or the numbered plan renders "1. ●" per step,
  and `.aick input` needs **`color-scheme:dark`** as well as `accent-color` — the latter only
  tints the *checked* fill, so an unchecked native box still paints bright white.

**Option 2 — inline AI.** An ask bar above the canvas (`.iask` / `#iaskIn`) and answers
rendered as `.icard` cards **inside** `#dcanvas` among the widgets — stat tiles, **Pin as
widget** (`iPin`, promotes the answer to a real widget), Try again, dismiss. Engine:
`I_SUGG`, `I_ANSWERS`, `iAsk`, `iSuggest`, `iCardHTML`, `iFocus`. ⚠️ The rail's AI row
used to call `iFocus()`; it now opens the `ac*` panel, so **`iFocus` is unreferenced**
(kept, and commented, so the rail can be pointed back in one edit). The ask bar itself
is untouched — click it and type.

**The shared `ac*` chat panel (all three options).** The build of `AI chat interface.md`,
one section of the spec at a time. Own `<script>` block, ~74 functions, all state on one
`AC` object; the header comment in the file is the authority. A **docked right-hand panel
with no scrim**, so the board stays readable while you ask about it. Drag the left edge
(`.acgrip`) to resize — it writes `--ac-w` as an inline style on `<html>`, which is why a
drag beats the responsive media queries.

- **Top bar** — chat name (click to rename inline), pin/favourite, ⋯ menu, history, new
  chat, close. `acNameEdit` / `acNameDone` / `acRenameDlg` / `acPinCur` / `acChatMenu`.
- **History sheet** (`.achist`, overlays the body) — searchable (`acHistSearch`, matches
  names *and* first questions, hit highlighted), grouped **Pinned · Today · Yesterday ·
  Previous 7 days**, per-row pin + ⋯ → **Rename | Delete**. A chat only enters history
  once it has been used (`acFile`), and is auto-named from its first question (`acAutoName`).
- **Composer** — context chips (`acCtxRender`) + **@-mention typeahead** (`acMentShow` /
  `acMentPick`, scoping to `dashboard · widget · monitor · metric · service · incident`
  from `AC_ENT`, ↑/↓/Enter/Esc), and a send button that **becomes a red STOP** while
  generating (`acSendState` / `acStop`).
- **Per answer** — copy · regenerate · 👍/👎 (a 👎 asks *what was wrong*), sources,
  **the query it wrote** (`acQHTML`, collapsible, **editable** and runnable), **quick
  actions** (Create widget · Add to dashboard · Create alert · Open in Explorer · Export)
  and follow-up chips. Empty state carries five smart starters (`AC_STARTERS`).
- **"Currently" strip** (`acNowRender`) — the module/page/time the chat is looking at,
  read live off `#dashTitle` + `#tchipLabel`, with **Use as context**.
- **Plan → approve → execute** — every quick action that changes something shared pushes
  a plan card instead of acting: numbered steps, a **What this changes** table
  (ADD / MODIFY / NO CHANGE), a warning line, then **Edit plan · Cancel · Approve & run**
  → running → done with **Undo**. `AC_PLANS` / `acAct` / `acPlanRun` / `acUndo`.
  Read-only actions (Explorer, Export) skip the plan.
- ⚠️ The query block is the **live product's own query builder** shape (research notes:
  sources Metric | Availability | Log | Flow | Alert | APM | NetRoute | RUM, with
  Counter / Source Filter / Source rows and real counters like `monitor.down.count`) —
  deliberately not an invented query language. The AI assistant itself is a **proposal**;
  8.2.6 has no conversational AI.
- ⚠️ `acNameDone` clears `onblur` before swapping the input back: removing a focused
  input fires blur synchronously, which re-enters the function mid-swap and makes the
  `outerHTML` assignment throw. Any inline-edit control here needs the same guard.
- `acNowText()` resolves the time-range label rather than assuming one id, because the
  three chromes differ: `#tchipLabel` (Option 2) · `#tcLabel` (Option 1) · the page-head
  `.chipbtn` (Option 3, whose label sits after a `<b>` pill, so it reads the last text node).
- All demo data uses RFC 5737 ranges (`192.0.2.x`, `198.51.100.x`) per the repo scrub rule.

## Option 1's `ai*` panel — the agentic build (17–18 Aug 2026)

Everything below is **Option 1 only** (`index.html`, the `ai*` / `AI_*` / `.ai*`
namespace). None of it is in the shared `ac*` panel, so it is a **one-file change**.
All of it is canned and deterministic — same question, same answer, same timing.

### The thinking trail (`aiTk*`)
A visible reasoning trail replaces the old one-line "Thinking…". It reveals a step at a
time while the answer is worked out, then **folds itself into one clickable line** the
moment the result is ready (`Read 11 widgets and ranked what matters · 3 steps · 5.7s ▸`).

- ⚠️ Steps are built from the **same model the answer is** (`aiScope`, `aiMetrics`,
  `aiDashSpec`, `aiBuildSpec`, `LX_GROUPS`), so the trail can never claim a step the
  answer did not take. A decorative trail is a lie with a spinner on it.
- ⚠️ While a trail is present the answer's own `.aistep` status line is **suppressed**
  (`m.tk`) — the collapsed trail *is* that line.
- Timing: `aiStepMs()` gives every step its own duration from its own text, and
  `aiPace(q)` multiplies by 1 / 1.15 / 1.34 from a hash of the question, so two questions
  never take exactly the same time. A trail lands in ~5–6s. **Skip** is in its header.
- `aiClose()` **flushes** it (the answer is there when you reopen); `aiNewChat()` cancels.

### The narrated flows (`aiAg*`) — widget build and summary
A widget request that names a metric family, and any summary question, run a Datadog-Bits
style narration instead of a single answer: `Reasoning` → a sentence → a tool row → … →
a card. 10–15s end to end, with **one Skip for the whole flow** (`.aiagsk`).

- ⚠️ **All the pre-card tool rows render as ONE disclosure** ("Reasoning · 10 steps"),
  with the phases kept as headings inside it, and **one** feedback row under the three
  narration lines. It used to be three rows and three 👍👎⧉ sets.
- Running rows use `.aitk run` (soft pill, spinner); finished rows `.aitk cl` (muted,
  collapsible). ⚠️ The agentic flow used to render `cl` even while running, so none of the
  running treatment reached it.
- ⚠️ **Undo appears wherever an action can be undone** (`aiAgUndoable` / `aiAgUndo`,
  annotation 19 Aug 2026). The created-dashboard card had one; a widget that was **placed**
  or **saved** did not, though both are reversible. It sits in the same feedback row before
  ⧉ and reverses whichever actually happened — placing via the host's own **`histUndo()`**
  (because `awAdd()` snapshots through `histDo()`), saving by removing the name from
  `W_USER`, which the canvas history knows nothing about. It **reports what it reversed**:
  a widget that was saved *and* placed loses both, and the toast says so.
- ⚠️ **The product mark is the supplied `Light.svg` / `Dark.svg`** (19 Aug 2026), replacing
  the base64 PNG. **One** SVG, not two — the files differ only in the second path's fill
  (`#07101F` vs `white`), so that path is `currentColor` and `.mdlogo` takes `--white`,
  which already flips per theme. ⚠️ The originals' `<clipPath>` is **dropped**: it is a
  full-viewBox rect that clips nothing, and its `id` would collide the moment the logo
  appeared twice — the trap `wArt()` exists to avoid. `aiLogoPaint()` fills every
  `.brandmark` at load (the sidebar trigger and the NOC kiosk header), so there is one
  definition and nothing to keep in step.
- **Widget card** = `Create Widget` + subtitle of the counters + a 3-series chart + legend
  + an **Add to `<dashboard>`** row + a footer of **`Edit · Accept`**.
  - ⚠️ **THE FOOTER IS GONE — Edit / Accept are DOCKED OVER THE COMPOSER** (annotation +
    reference, 19 Aug 2026: *"this will be shown on the text area"*). `.aipend` /
    `aiPendPaint()` reads the thread for an agent in `state === 'card'` — the un-decided
    state — and shows `<chart> widget ready`, its counters, and **Edit · Accept** directly
    on top of the input. The card in the thread keeps **what** is proposed; the decision
    lives **where you act**, and it cannot scroll away in a long thread.
    ⚠️ **SINCE 20 Aug 2026 THE BAR IS THE GATE FOR EVERY PROPOSAL**, not only this one
    (request: *"every action approval will be same"*). `aiPendPaint` scans the thread from
    the END and docks the MOST RECENT undecided proposal of four kinds — this widget card;
    the **create-dashboard plan** (`dash` in `plan`/`edit`; `edit` shows a single *Done
    editing*); the **clarifier's widget preview** (`build` without `b.added`); and a **log
    query** (`lq` without `applied`). Each Accept calls that flow's own existing handler
    (`aiAgAccept` / `aiDashApprove` / `aiBuildAdd` / `aiLogQApply`) — nothing is
    re-implemented in the bar. The in-card gates were all removed with this: the dash
    card's Cancel·Edit·Approve row, the preview's amber `＋ Add to …` two-click confirm,
    and the log card's Apply/Edit pair. `b.added` / `lq.applied` are what stand the bar
    down afterwards — without them an accepted proposal offers itself forever.
    ⚠️ **Auto-approve moved with the confirm dance**: ON, a widget **build** applies the
    moment its preview lands (`aiBuildAuto()` at both `r:'build'` landing sites) — its
    toast has always said "applies straight away"; OFF, the bar waits. The agent widget
    flow and the dashboard plan are still decided by hand either way.
    ⚠️ A read-only **summary still never summons the bar** — the `card`-beat test below
    survived the generalisation, and the probe asserts it.
    ⚠️ `aiChange()` (the bar's Edit for a preview) now **splices the `build` entry by
    index** — it used `aiThread.pop()`, which eats whatever is last once the decision can
    be taken from the bar while later messages exist.
    ⚠️ There is exactly ONE copy of that pair. Rendering it in both places would be the
    duplicate-entry-point smell this panel has been trimmed for twice.
    ⚠️ `aiPendPaint()` runs from `aiRender()` **before the empty-state early return**, like
    `aiNewBtnPaint` — otherwise emptying the thread (New chat, Undo) leaves the bar behind.
    ⚠️ **`state === 'card'` is NOT the test for "a decision is pending"** — `aiAgRun` ends
    EVERY flow with `state = 'card'`, the summary included. Keying on it put
    *"Widget widget ready · Edit · Accept"* under a **dashboard summary**, which has nothing
    to accept (annotation, 19 Aug 2026). The test is whether the flow has a **`card` beat**;
    the summary's is `scard` and the dashboard flow has none.
    ⚠️ The label is `"<chart> widget ready"`, or `"Widget ready"` when there is no chart
    name — the old fallback put the word `Widget` in front of the word `widget`.
    ⚠️ `.aipenda .aiagb` re-sizes the buttons: `.aiagb` is `flex:1` for the footer it was
    written for, and inside this bar that let two buttons eat the sentence beside them.
  - ⚠️ **Reject and Save widget moved OUT of the footer into the follow-up chips**
    (annotation, 18 Aug 2026: *"show accept and edit, the other action button will be show
    in follow-up suggestion"*). Four equal-looking buttons made the card read as a form;
    the footer now carries the two decisions you make *on the widget in front of you*, and
    the two ways out sit under it as `Save it to the library without adding it` /
    `Reject it and build something else`. **Nothing was removed.**
  - ⚠️ **Those chips are ACTIONS wearing `.aifu`, so they call `aiAgSave(i)` / `aiAgReject(i)`
    directly.** They must **not** go through `aiFollow()`, which sends the chip's label as a
    new question — *"Reject it and build something else"* is not a question.
  - **Edit** calls the existing `aiAgEdit(i)`, which primes the composer with the request so
    it can be changed and re-sent. It does not open the Create/Edit Widget modal.
  - ⚠️ **The `Add to <dashboard>` row (`.aiagdst`) left the card too** (annotation, 18 Aug
    2026) and is now the **first** follow-up chip. It **names** the destination —
    *Adding to “Application Performance” — put it somewhere else* — because the card no
    longer says where Accept puts it, and that chip is the only place it is stated.
    `a.target` is unchanged and `aiAgAccept()` still reads it.
    ⚠️ `aiAgDest()` used to anchor its menu with
    `ev.target.closest('.aiagc') || …('.aiagpl')`; a chip is in neither, so it threw on
    `null.appendChild`. It now tries `.aiagfu` first and **guards for no host**. `.aiagfu`
    is `position:relative` and shares `.aiagpl`'s `bottom:calc(100% + 6px)` rule, or the
    picker would render off the card.
  - ⚠️ **The ⤴ menu has NO Copy row on a widget** (annotation, 18 Aug 2026) — a widget is a
    thing you place, not text you paste. The **summary's** menu keeps *Copy summary*, which
    is text. The `<hr>` went with it, or the menu would open on a divider.
  - ⚠️ `aiAgSave(i)` early-returns unless `a.state === 'card'`. A probe that fakes a
    pre-accept card with any other state silently does nothing and looks like a bug in the
    button.
  - **Save widget** writes the definition into `W_USER` (the drawer's *User Define* tab)
    and **touches no board** — the live product's own *Create Widget* button. The summary
    then says it is not on a dashboard and offers **Put it on a dashboard**.
  - ⚠️ **The flow's LAST step closes on follow-up chips, not a button row** (annotation,
    18 Aug 2026). `Add another widget` / `Change the counters` — plus `Put it on a
    dashboard` when it was only saved — are `.aifu` chips inside a `.aiagpl` wrapper
    (`position:relative`, which is what `aiAgDest()` anchors its picker to). The paragraph
    above them lost its *"Would you like to add more widgets, or change this one?"* tail:
    the chips **are** those two options.
  - **Accept** saves *and* places it on the board named in the row, via the host's
    `awAdd()`, so ⌘Z / drag / resize all work.
  - ⚠️ Placing on a board you are **not** on opens it first: `awAdd()` writes to the open
    canvas, and a stock board's store is the shared `DEMO` capture, so writing into another
    board's store blind would leak the widget onto every other stock board.
  - ⚠️ Accept is the only filled button here, unlike the dashboard plan card's deliberately
    equal-weight Approve/Edit. A widget is one ⌘Z away; a dashboard is a shared object.
- **Summary card** is read-only — **no gate**, because a summary changes nothing.
  - ⚠️ **The bullet spacing was MEASURED, not eyeballed** (annotation, 19 Aug 2026: *"set
    proper alignment — step margin, padding, space"*). `.aiab li` had `margin-bottom:5px`
    while a wrapped bullet's own lines carry ~7px of leading — so the gap **inside** a point
    was bigger than the gap **between** points, and a two-line bullet read as two bullets.
    It is `12px` now (last child `2px`), `padding-left` 15 → 16px, `line-height` 1.6 → 1.55,
    and `.aiagsum` gained 2px of top padding. ⚠️ `.aiab` is every answer's body, so this
    fixed the same crammed wrap everywhere, not only in the summary.
  - ⚠️ **The meta row is PLAIN TEXT, not chips** (annotation, 19 Aug 2026). Four pills
    wrapped onto two rows in a 344–420px panel and read as filters you could click. It is
    one muted dot-separated line — `<board> · N widgets · <time range>` — and the **monitor
    total was dropped from it**, because the first bullet already says *"225 of 400 monitors
    are up"*. That was the extra detail.
  - ⚠️ **The card's mark is the PRODUCT LOGO, not the ✦** (annotation, 19 Aug 2026).
    `AI_LOGO` is the same base64 PNG the sidebar trigger uses, so there is no second asset to
    keep in step. It is used where the panel speaks **as the product** (this card); every
    other surface keeps `AI_SPARK`, which is the assistant. `.aiagmk.logo` sizes it — a
    raster mark must not inherit the `fill` the ✦ uses.
  - ⚠️ **Every fact appears ONCE** (annotation, 18 Aug 2026: *"remove the repeated text"*).
    The widget count, the monitor total and the time range were three prose bullets that
    restated the card header's own subtitle, and the heading *"What this dashboard covers"*
    restated the card title *"Dashboard summary"*. Now: the facts are one `.aisumeta` chip
    row, a single `Covers …` line names the widgets, and the only heading left is **How it
    reads right now** — which is the part a summary is actually for.
  - ⚠️ **The header has NO subtitle** (annotation, 18 Aug 2026). It carried the board name
    and never had the room for it — in a 344–420px panel it rendered as *"Application
    Performan…"* with a tooltip floating over the card. The board is the **first meta chip**
    (`.aisumeta .bd`, accent-tinted) instead, where it fits whole. `<b class="gro">` is what
    takes the space the subtitle was holding, or the icon buttons slide up against the title.
  - **The bullets are read off the board** (`aiSumFacts()`, request 18 Aug 2026: *"improve
    the summary detail, some important points in bullet points"*) — the two donut clusters
    and the largest *Top … by Alert Count* pie. Five lines: availability with its split
    (`225 of 400 up (56%) — 159 down, 13 unreachable, 3 in maintenance`), the alert total
    and critical share (`964 open alerts, 671 critical (70%) and 59 warning`), the single
    biggest source (`fg-firewall.example.com — 117 alerts on its own`), then the two
    qualitative lines.
    ⚠️ **A bullet is emitted only when the widget behind it exists**, so the card cannot
    claim a number a different dashboard does not have — there is a probe assertion that a
    board of nothing but a note renders neither the monitor nor the alert line.
    ⚠️ **`aiScope()`'s monitor total is `up + down`**, which silently drops Unreachable and
    Maintenance — 384 where the board says 400. `aiSumFacts()` totals the whole ring;
    `aiScope()` was left alone because the other five answer types depend on it.
- **The create-dashboard PLAN card suggests widgets before you approve**
  (`AI_DASH_FU` / `aiDashFu(d)` / `aiDashFuPick`, request 18 Aug 2026). A dashboard is
  created empty and the old flow only offered *Add a widget* afterwards — by which point you
  are staring at a blank board. The pills sit between the `.aidwarn` line and the gate, are
  chosen from the **dashboard's name** (network · alert · server · log · slo, with a
  generic fallback), and are hidden while the form is in its `edit` state.
  - ⚠️ **They are on the CREATED card, NOT the plan.** They went onto the plan first
    (18 Aug 2026), lost their *"Widgets for this board"* heading, and then moved below
    *Undo · Add a widget* on the created card later the same day — all three by request.
    Don't move them back without re-reading all three.
  - ⚠️ **`Add a widget` IS ONE OF THEM NOW** (request, 20 Aug 2026). It was a lone `.aialt`
    button in its own `.aiacts` row directly **above** the Follow ups heading, so the card
    showed two stacked lists of "what to do next" in two different shapes. It is the
    **first chip** in the list — the general case, ahead of the three specific widgets the
    board's name suggests — and `.aiacts` is gone from this card entirely.
    ⚠️ It is an **ACTION wearing `.aifu`**, so it calls **`aiDashAddW(name)` directly** and
    must never go through `aiDashFuGo`, which reads the chip's text and *sends* it as a
    question. Same rule as the widget card's Save / Reject chips.
    ⚠️ **Consequence:** it now inherits the block's `i === aiThread.length - 1` gate, so it
    disappears once you ask something else — where the old button stayed forever. That is
    the point of a follow-up, and the board is still reachable from the **link in the card
    body**. If it ever has to stay, lift just that chip out of the gate — but then it needs
    its own heading or it will float under a missing one.
  - ⚠️ **They SEND** (`aiDashFuGo`), because on the created card the board is real.
    `aiDashFuGo` **opens the new board first**: the widget builder places onto whatever
    canvas is open, and the created card deliberately does *not* redirect you, so without
    that the widget would land on the board you were reading from.
  - ⚠️ **They render ONLY while the card is the last thing in the thread**
    (`i === aiThread.length - 1`, annotation 18 Aug 2026). They used to render forever, so
    after asking for one widget the same three chips were still sitting halfway up the
    conversation inviting an identical second request — which is exactly what the reported
    screenshot showed. A follow-up suggests what to do **next**; once something has been
    asked it is not next. (The widget flow's own closing chips are *not* gated this way —
    an undecided widget's Save / Reject stay live wherever they are.)
  - ⚠️ **EVERY CHIP IS SENT VERBATIM TO `aiRoute`**, so each must route to `build` *and*
    name a family `aiAgFam` knows. They opened as *"Add Top Network Monitors by Alert
    Count"*, which matched none of the build alternatives, fell through to **`metric`**, and
    on the board that had just been created answered *"Nothing to report — this board has
    no counters"*. Rules for editing `AI_DASH_FU`: **lead with "Build"** (the router's own
    word); **never use "summary"** (`aiRoute` tests it first and it wins); and name a family
    from `AI_AG_FAM`, or it drops to the plain preview instead of the narrated build. There
    is a probe over all six buckets asserting both.
  - `aiRoute`'s build test also gained `add <anything> <chart|widget|donut|gauge|Top N|…>`,
    so the same phrasing typed by hand works too.
  - `aiDashFuPick` — the plan-card version, which **filled** the composer rather than
    sending because the board did not exist yet — is **kept and unreferenced**, so the
    chips can be moved back before the gate in one edit.
- Families live in `AI_AG_FAM` (CPU · Memory · Disk · **APM** · Traffic · Latency ·
  Availability · Alerts · Logs · Flow). ⚠️ APM sits **above** Traffic and Latency: first
  match wins and both own words APM uses, so "APM response time" was building a ping
  widget. Availability and Alerts carry a `live` hook that reads the board's donuts.

### The composer
- ⚠️ **THE LEADING CONTROL IS AN `@` NOW, WITH NO MENU AT ALL** (request, 21 Aug 2026:
  *"the context will show only as @ — remove the + icon"*), and **file upload and dictation
  went with it** (*"remove this"*, pointing at the mic and the *Add images, logs, PDFs or
  CSVs* row). The composer's control row is **`@ · Auto … send`** — three buttons.
  - The ＋ existed because there were **two** things to add, a file and a mention. With
    upload gone there is exactly one, and a menu that opens onto a single row is a click in
    the way. `@` is also the literal character the feature runs on, so the button and the
    keyboard route are the same gesture — press it or type it.
  - ⚠️ It calls **`aiPlusCtx()`, not `aiMentShow('')`** — that function seeds an `@` into the
    composer first, which is the whole reason the list stays filterable. Opening the list
    with nothing typed looks right and dies on the first keystroke (the 20 Aug bug below).
  - **Kept and unreferenced**, the house pattern: `aiPlusMenu` / `aiPlusPaint` / `aiPlusRun` /
    `aiPlusAway` and `.aiplusm`'s CSS; the whole `aiDic*` dictation engine and its CSS;
    `aiUpPick` / `aiUpAdd` / `AI_UP_OK` / `AI_UP_SAY` and the context bar's attachment
    chips. `AI_PLUS` keeps its one Mention row, and the file row sits **commented out inside
    it** rather than deleted — its icon is the Lucide paperclip pasted verbatim, and
    redrawing that by hand is what this panel's icon rule exists to prevent.
  - ⚠️ `aiUpPick()`'s `if (el)` guard is what makes the missing `#aiUpIn` input safe; it
    already existed and now carries the whole feature's absence.
  - ⚠️ `aiNewChat()` still calls `aiDicStop(1)`. That is correct, not a leftover — it
    belongs to the outgoing chat whether or not a control exists for it.
  - ⚠️ **The probe trap bit again here.** `document.body.innerHTML` contains the inline
    `<script>` source, so an assertion that "no markup still calls `aiPlusMenu`" matched the
    parked function's own code and failed on working markup. Assert over
    `querySelectorAll('[onclick]')`.
  - ⚠️ **SEND IS PUSHED RIGHT BY `.aiinrow .aisend{margin-left:auto}`.** The spacer used to
    be on the **mic** (`.aiinrow .aimic`), with send merely following it — so removing the
    mic took the push with it and the button collapsed against `Auto` in the middle of the
    row. `.aisend` is `display:none` until there is text, so on an empty composer the margin
    has nothing to apply to and `@ · Auto` sit left, which is right.

- ⚠️ **THE STOP MODIFIER IS `aisndstop`, AND IT TOOK TWO GOES.** This is the collision trap
  the repo's `CLAUDE.md` opens with, hit **twice in one edit**:
  - it was a bare **`stop`** — which is the **sidebar's top section** 12,000 lines away
    (`.stop{margin:0 8px 4px;border-bottom:1px solid …;padding:0 0 6px}`). That had been
    landing on the send button for the whole of every generation: 8px off the composer's
    right edge and 4px of extra row height. It stayed invisible until the mic was removed
    and send became the rightmost thing in the row.
  - renaming it to **`aistop`** hit **`.aistop`, the stopped-generation notice** in the
    thread, whose `margin:0 0 16px` then grew the control row by exactly 16px.
  ⚠️ Neither rule appears in a search for `.aisend`. Both were found by measuring
  `getComputedStyle` and dumping the row's children — **grep the whole stylesheet for the
  bare modifier before naming one**, which is what the repo rule actually asks for.
  ⚠️ **Option 3's `ac*` panel still toggles a bare `'stop'` on `.acsend`**, so it carries
  the first of these two latent collisions. Not fixed here — that block is byte-identical in
  all three files, so it is a three-file change.

  The ＋ it replaced (kept, unreferenced) — `aiPlusMenu` / `aiPlusPaint` / `aiPlusRun` /
  `aiPlusClose` / `aiPlusCtx`, data in `AI_PLUS`, styled `.aiplusm`:
  | row | goes to |
  |---|---|
  | **Add images, logs, PDFs or CSVs** | `aiUpPick()` — the real file picker, unchanged |
  | **Mention dashboards, monitors or modules** | the @-mention list (`aiMentShow('')`) |
  ⚠️ **It was a PAPERCLIP wired straight to the picker**, so the leading control reached
  only one of the two things that fill the context bar — **@-mention was keyboard-only and
  undiscoverable**. A ＋ promises "add something" and the menu says what.
  ⚠️ **Not the 15 Aug ＋ command menu this replaced**: that listed five canned *questions*
  and refilled the composer. These two rows add *context*.
  ⚠️ **Shape copied from the supplied Notion reference**: ONE line per row (an outline
  glyph then a sentence — it was briefly a two-line name over a description in a filled
  violet tile, which said it twice); the label IS the description, not a noun; the menu
  **hugs the ＋** (`left:27px`, `width:max-content`) instead of spanning the composer like
  the @ typeahead, which is long and filterable where this is two rows belonging to the
  button under it; and one row is always highlighted, with ↑↓ · ↵ · Esc handled at the top
  of `aiKey` (ahead of the @ typeahead, since this menu sits on top of it).
  ⚠️ `left:27px` = `.aicomp`'s 14px padding + `.aiinbox`'s 1px border + 12px padding. At
  10px it sat 17px adrift and read as belonging to the composer, not the button. Both edges
  of `.aicmd` must be cancelled (`right:auto`) or `width:max-content` does nothing.
  ⚠️ **The reference's third row (Skills) was deliberately not copied** — this panel has no
  such feature and inventing one would be inventing product.
  ⚠️ **The Mention row SEEDS an "@" into the composer** — and this is the whole reason the
  row works at all (fixed 20 Aug 2026, *"it will be working mode"*). It first opened the
  list with nothing typed, which *looked* right: the list appeared. But `aiMentIn` — the
  composer's own `oninput` — only keeps the list alive while there is an `@…` before the
  caret, so **the first character you typed hid it again** and you were left scrolling 34
  rows by hand. Seeding the token hands the interaction back to machinery that already
  works: typing filters (34 → 9 on "mon"), ↑↓ choose, ↵ pins, and `aiMentPick` removes the
  `@word` itself.
  ⚠️ **`aiMentUnseed()` takes the token back on every dismissal**, called from
  `aiMentHide()` so Esc, click-away and pick all pass through it. It removes the seeded
  `@` **and the filter typed into it** — a first version kept the filter text on the
  reasoning that deleting keystrokes is worse, and on screen that was plainly wrong:
  dismissing twice left `why is cpu high@dash@mon` in the box, ready to send. The filter
  word is the menu's own search, not prose.
  ⚠️ **The span is bounded by the caret and must match `@` + word chars with NO SPACE.** A
  space means the user carried on writing and the token is theirs; the `[\w.\- ]` class the
  rest of this feature uses would have eaten the following words. A **hand-typed** `@token`
  is never touched, because `aiMentSeed` is only set by the menu.
  ⚠️ `aiPlusAway` **guards a non-Element target**. The house pattern is a bare
  `e.target.closest(...)`, which throws on `document` or a text node — and the throw leaves
  the menu open *and* kills everything after it.
  ⚠️ Attachments still land in the context bar as removable chips, and it still does not
  read the file — pretending to parse a CSV is the one thing that would lie about capability.
- **The context chip leads with a TYPE ICON and hides its ✕ until hover** (reference,
  20 Aug 2026). `AI_ENT_IC` / `aiEntIc(k)` give each kind an outline glyph in the sidebar's
  convention, tinted with that kind's `AI_ENT_C` colour — the chip used to lead with a 5px
  coloured dot, which said *there is a type* without saying which.
  ⚠️ **The ✕ was always visible**, spending ~16px of a 180px chip on a control you need
  once and pushing long names into an ellipsis two words early — the same lesson the
  chat-history row records for its ✎/🗑.
  ⚠️ **Its hover properties are MERGED INTO THE ONE `.aictx button` RULE.** Writing them as
  a second block *earlier* in the sheet lost at equal specificity (`width:16px` beat
  `width:0`) and the ✕ never hid — the collision the root `CLAUDE.md` opens with. There is a
  probe assertion that exactly one such rule exists.
  ⚠️ `width`/`margin` animate, not `display`, or the chip jumps on hover and the label
  reflows under the cursor.
- **The panel background is `--card` (`#ffffff` in light), not `--panel`** (request, 20 Aug
  2026). `--panel` is `#f7f9fc` there, so the chat read as a tinted slab beside a white
  board. ⚠️ Changing the **token** would have repainted the Log Explorer and every other
  surface using it — the change is scoped to `.aipanel`, and `--card` is a valid surface in
  dark too, so the dark theme is unaffected.
- **The header has no bottom border** (request, 20 Aug 2026) — the panel is one surface, so
  a hairline under the title cut it in two for nothing. ⚠️ `.aihd` keeps `z-index:3`: its
  dropdowns hang into the body's area and `.aibody` is also positioned, so on a tie the
  later element wins.
- **The composer is 112px tall, not 46px** (request, 20 Aug 2026: *"make neat and clear …
  and make more height"*). Three rows sat 7px apart in 9px of uneven padding, so a composer
  holding a context chip had barely a line to type in. Now `min-height:112px`, **even 12px
  padding**, 10px between rows, radius 14, text 13.5px/1.6.
  ⚠️ The floor is a `min-height` on **the box**, not a height on the textarea — `aiGrow`
  still sizes the textarea to its content, so a one-line question does not sit in a tall
  empty field; the slack goes to the box and the three rows stay evenly spread.
  ⚠️ **`aiGrow`'s cap must match `.aiinbox textarea`'s `max-height`** — both are 150px now.
  Set the JS cap lower and the box stops growing before the CSS would, hiding the last line
  under the control row.
- **Dictation** (`aiDic*`): mic → listening state → words arrive one at a time. It never
  sends, and speaking again appends. ⚠️ The transcript is canned; a real recogniser would
  replace one timer loop (`webkitSpeechRecognition` needs https, these open over `file://`).
- **@-mention** (`aiMent*`): `@this dashboard`, `@widget`, `@monitor`, `@metric`,
  `@service`, `@incident`. Dashboards and widgets are read **live** off `DASH_GROUPS` /
  `WIDGETS`; the rest mirror `AC_ENT` so the two chat surfaces do not invent two fleets.
  Picking removes the `@token` and adds a **context chip**, dot-coloured by type.
- **Typed suggestions** (`aiSugg*`): from two characters, up to four matching prompts in
  the same chip shape as the follow-ups. ⚠️ Enter with nothing highlighted still sends what
  you typed. The pool comes from the module's own starters, so it can never suggest
  something the router would fail to answer.
- **Stop while generating**: the send button becomes a red stop in the same slot
  (`aiSetBusy` → `.gen`). Stop **abandons** (Skip means "show me the answer now") and
  leaves a `stopped` line with Continue · Edit prompt.
  ⚠️ Every busy transition goes through `aiSetBusy()` — the flag used to be assigned in
  thirteen places.
- **Border**: ordinary at rest, AI-accent while generating, with **one thin light on the
  top edge** (`.aigenbar`). ⚠️ The permanent four-colour brand ring and its blurred bloom
  are gone, and so is the panel-wide ambient glow (`.aiamb`) — see Gotchas.

### Context (was "Scope"), and it is multi-select
The chip is labelled **Context** and takes **several modules at once**; `aiScopeSel` is the
array, `aiScopeCur` the derived string every sentence concatenates. "All modules" is *not*
exclusive — global plus a focus module is a real answer. The selection is never empty.
⚠️ The mismatch guard checks membership, and **"Expand to Logs + Dashboard" now adds that
one module** instead of quietly opening everything.

### Full screen, and no scrim
`aiFsTog()` / `.aipanel.aifs` — Datadog Bits' ⤢. The panel fills the viewport but the
thread and composer **centre in an 840px column**. Esc leaves full screen, Esc again
closes. The scrim paints nothing and blocks nothing, so the board behind stays readable
**and clickable**; click-outside no longer closes the chat (✕ and Esc do).

### In the Log Explorer
`✦ Ask AI` in the module head opens the same panel with **Context = Logs** and the screen
pinned. `aiInLogs()` swaps the empty state, the starters (`AI_CTA_LOGS`) and the answers:
`aiLogAnswer()` builds **Log summary · Noisiest log types · Severity mix** from
`LX_GROUPS` / `LX_FIELDS`, the same arrays the Overview chart draws.
⚠️ `aiLogKind()` picks the log answer from the **question**, because the dashboard router's
types do not map onto log questions ("Which log type is noisiest?" arrived as `metric`).

### Verifying it
There is no test runner for these. The pattern that works is a **probe copy**: strip the
Agentation loader, inject `*{transition:none!important;animation:none!important}` and a
script that drives the panel and writes a verdict into `document.title`, then read it with
`--dump-dom | grep -o "<title>PROBE[^<]*</title>"`. ⚠️ Take the **first** match — the later
ones are template literals in the inlined source. This session ran ~19 such suites
(≈450 assertions); the scripts live in the session scratch dir, not in the repo.

## Auto mode · scope · states · motion — the `ac*` panel's spec build

⚠️ **Two spec documents in this folder now govern the `ac*` panel. Read them before
touching it** — `ObserveOPS-AI-Chat-Mode-and-Scope.pdf` (auto mode detection + global
vs module scope) and `ObserveOPS-AI-Chat-Designer-Guide.md` (message order §4, the ten
states §5, the motion table §6, the design-system rules §7, the writing style §9).
Built 14 Aug 2026, in **all three files identically**.

**Mode is the AI's, scope is the user's.** Mixing them into one control is the mistake
the PDF opens by warning about, so they sit at opposite ends of the panel:

| | control | where | why there |
|---|---|---|---|
| **Mode** | `normal` / `query` / `workflow` | `.acmhrow` badge, **top-right of the answer** | it describes what already happened |
| **Scope** | `all` / `dashboard` / `apm` / `logs` / `alerts` / `netroute` / `rum` / `nccm` | `.acscb` chip, **above the composer** | it describes what happens next |

That is the PDF's own placement rule — it matches the direction of time on screen.

- **There is no mode switcher.** `acDetect(q)` returns `{mode, forced}`; `acRun()` is the
  whole turn. The rule is **"detect silently, display visibly, allow correction"** —
  `.acmdb` always shows the mode and `.acmch` ("Change") opens `acModeMenu` →
  *Answer instead · Build a query · Take action*, which **re-runs the turn** in the
  picked mode (`acSetMode` truncates `msgs` and calls `acRun(q, mode, 1)`). A badge that
  only relabels itself would be a lie.
- **Slash commands are the manual override** — `/ask` `/query` `/do` (`AC_SLASH`,
  `acSlashShow/Paint/Hide/Pick`, ↑/↓/Enter/Esc). They fire **only at the start of the
  box** (`/^\/(\w*)$/`) so a slash inside a question never steals the keystroke, and
  `acStrip()` removes the command before the answer bank matches on the words.
- ⚠️ **Workflow may be entered automatically. It may never execute automatically.**
  `acPlanRun()` is reachable only from the gate. This is what makes auto-detection safe.
- **When it isn't sure it asks** — `acAmbig()` fires on a bare subject with no question
  word ("checkout errors") and renders chips instead of guessing.
- **Smart scope default from the entry point** (`AC_SCOPE_SRC`): rail/toolbar → Dashboard,
  ⌘I/palette → All modules, an alert card → Alerts. Only set on a **fresh** chat, so
  re-opening a conversation can't move its scope out from under it.
- **Scope-mismatch card** (`acScopeMiss` → `acMissHTML`): *"This needs Logs data too.
  Your scope is set to APM."* → `[Expand to Logs + APM]` `[Keep APM only]`. Never
  silently expand, never silently fail.
  ⚠️ **Scope is a READ constraint, so Workflow is exempt.** Without that guard, "**alert**
  me when checkout errors go above 5%" matched the Alerts-module regex and every
  alert-creation request answered with a scope-mismatch card instead of a plan. That bug
  was live for one build; the exemption is in `acScopeMiss(q, mode)`.

**Message order is now §4's**, in `acAnsHTML`: mode badge → answer → evidence (stats,
bars) → tool chip → **`[Show reasoning ▸]` collapsed** → sources → query → plan → footer
→ quick actions → follow-ups.

- `acReason()` builds the trail **from the message's own model**, so it can never
  describe a step the answer did not take. `acToolHTML` seeds its "Ran query · 1,893 rows
  · 143ms" from the query text, so it is stable across re-renders rather than random.
- **Confidence is a word** (`.acconf` → "High confidence" / "Some uncertainty" / "Low
  confidence"), never `0.87`, and the fallback answer is the one that reads `low`.
- ⚠️ **`.acsrc` is used by BOTH the answer's sources row and the user bubble's context
  chips.** A naive `indexOf('acsrc')` on `#acBody` finds the *user* message first and an
  order assertion fails on working code. Scope order tests to the answer element.

**§5 states** — `acStateHTML(kind)` covers `noresult · qfail · noperm · partial · oos`,
plus `stopped` (now *Continue* / *Edit prompt*, not a lone Regenerate) and the
scope-mismatch card. **Golden rule: never a dead end** — every card ends in at least one
button, and `behave.py` asserts exactly that.

**The approval gate changed shape.** It gained a **config diff** (`acDiffHTML`, `+`/`−`
glyphs so it reads with colour removed) behind *View full config diff*, and:

- ⚠️ **Approve and Edit are deliberately the SAME weight** — same class, same size, same
  colour. §4 is explicit ("do not make Approve prettier"), and the previous build had
  `acb pri` on Approve. **Do not put it back.** `behave.py` asserts no `acb pri` sits
  within 240 chars before "Approve & create".
- `AC_PLANS.errrate` is the Guide's own worked example (checkout-api error rate > 5% →
  #checkout-oncall, Production warning), so the flow the specs describe is reachable end
  to end. `acPlanGuess()` routes to it.

**Motion is §6's table, at its numbers** — `accaret` 1000ms steps · `acshim` 1300ms ·
`acpulse` 1400ms · tool/reasoning expand 180ms · `acdiffin` 220ms with a 20ms per-line
stagger · `acgatein` 200ms scale .98→1 — plus a `prefers-reduced-motion` block that
collapses every one of them to a 100ms fade.

**Tone.** §9 forbids emoji, exclamation marks and "Great question!", which is why none of
the ServiceOps reference flow's empathy lines ("That must be frustrating") came across.

**Two review shortcuts**, both in the chat ⋯ menu:
- **Play the reference flow** (`acDemo` / `AC_FLOW`) — APM scope → *"Why is checkout
  slow?"* → *"Alert me when checkout errors go above 5%"* → plan + diff → stops at the
  gate. It only types for you; every beat is reachable by hand.
- **Show every state** (`acStates`) — all five §5 cards on one screen.

⚠️ **Not built, deliberately:** the Guide's §2 **two-column chat + artifact layout**. The
same section sets the side panel at 400px (360–560 resize) and ours is 344–452px, so a
second column does not fit; the query block, plan card and diff stay inline in the
thread. A width-triggered split (two columns past ~720px) is the open follow-up.

## The 20–21 Aug 2026 visual pass — Option 1's `ai*` panel and `lx*` module

A long single-session sweep, all in `index.html`, driven request by request against
supplied screenshots and two live references (ClickUp's Brain² composer, and the live
ObserveOps Log Search). Grouped by what it changed; each item's *why* is in the file's own
comments at the rule or function.

### One icon system, one weight
- **Every glyph in the panel is Lucide** (lucide.dev, ISC), pasted verbatim from
  `lucide-static` — `AI_MI`, `AI_IC`, `AI_ENT_IC`, `AI_LAY`, the header, the composer, the
  feedback row. They were hand-drawn before and it showed.
- ⚠️ **Icon weight is DERIVED, not typed.** Every icon rule targets **1.25px of stroke on
  screen**, and its `stroke-width` is computed from its own rendered size:
  `stroke-width = 1.25 × 24 / <size in px>`. Before this there were 33 declarations from
  1.6 → 3.4 at sizes 9–30px, i.e. an on-screen spread of 0.87–1.70px. **Change an icon's
  size and you must recompute its stroke.**
- ⚠️ `vector-effect:non-scaling-stroke` would say this in one line and does NOT work — it
  is not an inherited property, so it never reaches the `<path>` children.
- ⚠️ Two flex traps, in both directions: `.aihm button svg` is `flex:0 0 15px`, so a
  `width:14px` override did nothing (basis wins); and `.lxpatai svg` had no basis, so the
  flex row squeezed the ✦ to 12×14. **Set `flex` and `width` together.**

### The composer, measured off ClickUp
Read off `app.clickup.com`'s Brain² composer in the browser (DOM + computed styles), not
copied by eye: **radius 20, no border, a three-layer shadow, 14px/21px text, a
radius-999 context chip on a 2.4% wash.**
- Ours keeps a border because the panel is themed and a shadow-only edge vanishes in dark;
  the edge is tokenised (`--ai-in-line` / `--ai-in-shadow` / `--ai-in-shadow-h`).
- The border was dimmed four times on request: `.07 → .045 → .03 → .018`, the shadow's
  hairline coming down each time. **`.018` is the floor** — below it the border may as well
  be deleted, and then there is no edge if the shadow is ever dropped.
- **Hover lifts it** (a deeper, wider shadow); **focus adds its ring ON TOP** of whichever
  shadow is current. ⚠️ `box-shadow` is one property — writing only the ring in
  `:focus-within` discarded the elevation the moment you clicked in.
- Padding/gap grew twice: `12/10 → 14/12 → 16/15`, floor 128px. The **gap** moved further
  than the padding on purpose.
- ⚠️ **`.aictxbar` reserves 24px when empty.** It used to be `:empty{display:none}`, so
  removing the last context chip collapsed 39px and every row under it jumped.

### Send, Auto, and the ＋ menu
- **Send is absent until you type** (`.aiinbox.typed`), then arrives accent-filled. Painted
  from `aiGrow()`, the choke point every path already goes through. ⚠️ `.aisend.stop`
  overrides it — hiding the only way to interrupt a run would be the worst possible moment.
- **"Auto-approve" → "Auto"**, opacity `.62`, matching the ＋/🎤/➤ so the row rests at one
  strength. The full name is in the tooltip.
- The ＋ menu **hugs the button** (`.aicmd.aiplusm{bottom:…}`) and opens with **nothing
  highlighted**. ⚠️ That `bottom` rule must stay **below `.aicmd.up`** — same specificity,
  source order decides, and it silently lost twice before this was measured (85px vs 6px).

### The thinking trail
- **Collapsed by default, including while running.** The running box is the loader, its
  label and Skip — no tick list. It used to print the list live while the agentic flow
  showed only its loader: two treatments for one moment.
- **Group headings hang at the left edge** as uppercase section labels, 18px above / 7px
  below. ⚠️ An earlier pass the same day indented them to 23px to "align" them and that made
  the grouping unreadable — the indent IS the cue. Don't re-align them.
- **No left rule** on `.aitkl`; its 28px of indent is kept as margin.
- Sub-detail rows sit **inside** their step's text column (+13px).

### Cards, rows and marks — what was removed
Each of these was decoration or a duplicate, and each is recorded at its call site:
`.aistep`'s leading dot (7 call sites), the widget card's truncating counter subtitle, the
summary card's ⤴ and ⌃, the widget card's ✕ (a duplicate of the Reject chip), the starter
row icons, the ✦ avatars on history rows and the hover-preview card, and the `--sv-cta`
brand gradient behind the starters.
- **⤴ Share moved into the feedback row, after copy**, on both cards — `aiFbHTML`'s `extra`
  slot, the same one Undo uses. The row itself sits **outside** the card.
- ⚠️ **`aiAgShare` anchors to `.aifb` now, guarded.** It was a bare
  `ev.target.closest('.aiagc')`, and once ⤴ left the card header that returned `null` and
  threw — the button did nothing at all. Same failure `aiAgDest()` was fixed for on 18 Aug.

### The clarifier
- Rebuilt to a supplied reference: **numbered rows, no radios, a pencil-marked free row with
  Skip inline, ✕ to abandon.** Picking a row **answers and advances** — `Next` is gone.
- ⚠️ **A STEP MAY NOW BE `multi`** (request, 21 Aug 2026: *"add new flow with multiple
  options with multiple selection"*). `AI_CLAR` gained a fourth question, **`states` —
  *Which states should it count?*** (Up / Down / Unreachable / Maintenance), and the shape
  changes with it:
  - rows **toggle** instead of committing, and carry a **checkbox** (`.aicqck`) where a
    single step carries its ordinal. The number means *"row 3 of 6"*, which is right when
    one click ends the question and wrong when the job is to tick several — the row has to
    say what it is before you click it. Everything else is unchanged, so the two kinds still
    read as one component.
  - a **Done** button appears (`.aicqd` / `.aicqok`) and names the count. It exists **only**
    on a multi step: on a single step the row *is* the commit, and a second control that
    also commits would be two ways to do one thing.
  - the step opens **pre-lit with its own `def`**, so Done is never dead — the same rule
    that made one radio pre-lit back when there was a Next.
  - **typing in the free row clears the ticks** (and ticking clears the text). Otherwise
    Done has to choose between four checked boxes and a sentence, and there is no right
    answer to that.
  - **Back restores the whole selection**, not the default — the answer is stored as
    `"Down + Maintenance"` and `aiClarRestore` splits it back to indices.
  - ⚠️ **It is printed in the preview as real counters** — `aiCounters()` maps the states
    onto `monitor.<state>.count`, the four the research notes confirm; anything from the
    free-text row passes through unmapped, because inventing a counter id would be
    inventing product. A question whose answer never appears anywhere should not be asked.
  - ⚠️ **`aiClarNext` looked the chart step up as `AI_CLAR[2]`** — a hardcoded index that
    silently pointed at the new `states` step the moment a fourth question was inserted, so
    every build would have fallen back to the default chart. It finds it **by key** now, and
    both branches land through one `aiClarLand()`.
  - ⚠️ **`.aicqx` was already taken** by the clarifier's own old primary button 30 lines
    below, so the checkbox is `.aicqck`. Grepped before naming — which is what the two
    `.stop` collisions earlier the same day cost.
- **Docked over the composer** (`#aiClarDock`), not in the thread, and the **composer is
  hidden while a question is up** — the card has its own free-text row, and two places to
  answer one question is a trap.
- ⚠️ **`sel` has three states: `null` = nothing chosen, `-1` = free text, `0..n` = a row.**
  Folding the first two together lit the "Something else…" row on an untouched question.

### Chat history
- A **full-screen-only left column** (`aiHs*`, 258px) — the third history surface, and the
  only one that is a place rather than an overlay. It shares `aiChatBand` with the other two
  so they cannot disagree about a band.
- The **Show-all screen's header moved into the panel header**; the chat name, ⋯ and
  New-chat hide there, and the composer is hidden on that screen.
- The context chip's **✕ is `position:absolute`** — it takes no flow width, so nothing
  reflows on hover — and it is **opaque**, compositing the chip's own colour so it masks the
  text it covers instead of letting it show through.

### The thread and the Log Explorer
- **The thread fades at whichever edge has more to scroll** — a `mask-image`, not an overlay
  gradient, because the panel's own background is a gradient. Dynamic: 0 until there is
  something past that edge.
- **The panel background is a gradient**: `--card` at the top, 5% black at the foot, held at
  zero for the top 66% so only the area behind the composer greys.
- **The search bar builds queries itself** — type plain English, a `✦ Generate query` button
  appears IN the bar, it rewrites the box, then Apply. The **popover now rewrites its own
  textarea** the same way. Both go through `lxAiqParse → lxAiqExpr → lxAiqCommit`; two
  doors, one engine, and the gate still shows the query before it runs.
  ⚠️ `lxQIsQuery` must stay **case-sensitive** and must not test `In` loosely — "ERROR logs
  **in** the last 30 minutes" matched the product's `In` operator and killed the feature.
- **The log source tree and the sources panel both open COLLAPSED.** ⚠️ The panel diverges
  from live, which shows it open — it was deleted 17 Aug, restored 19 Aug after driving the
  product, and is now collapsed by default. Don't "fix" it back by checking live.
- **The Log Pattern ✦ answers in the chat**, pinning the pattern as context and landing a
  *Pattern summary* card. ⚠️ Also a deliberate divergence — live opens a drawer. Third
  direction change for this flow; `lxPatBodyHTML` is the one renderer both use.
- The Log Explorer starters are now **searches, not summaries**, and the IP in them is
  `192.0.2.165` — the busiest `event.source` in `LX_FIELDS`, not an arbitrary RFC 5737 pick.

### The floating card's top edge (21 Aug 2026)

Every resize grip's highlight line was **deleted** during this pass (*"remove this line on
everwhere"*). One came back for the north grip, and was then put on **all four edges**
(*"this line is shown only on the top upper side — set it on top, bottom, left and right"*):

- **Edges get a capsule, corners get an arc — one mark per grip**, revealed on that grip's
  hover and held up for the whole of its own drag. Four monday Sidekick screenshots were
  supplied as the reference.
  - `.aign / .aigs / .aigw / .aige ::before` — a 4px fully-rounded bar running the **whole
    edge**, inset by `--aifloat-r` at each end so it stops where the card's straight edge
    does. ⚠️ Horizontal edges inset left/right, vertical edges inset top/bottom — same rule,
    different axis; inset the wrong pair and the bar runs into the arc.
    ⚠️ **It was briefly shortened to a 44px centred handle on 23 Aug 2026 and that was a
    MISREAD** of *"show the line width"*; the next message — *"I need this line width"* —
    put it back. The full-length bar is what the monday reference shows and what was asked
    for originally. **Don't shorten it again**; the `--aigrip-l` token was removed rather
    than left at a new value, so there is no dial inviting it.
  - `.aignw / .aigne / .aigse / .aigsw > svg` — a **stroked path** with
    `stroke-linecap:round`, running in along one edge, round the curve, and out along the
    other.
    ⚠️ **It was two adjacent CSS borders and that is why it had to change** (request: *"make
    border will be corner radius"*). Borders draw the right curve but always terminate
    **square and mitred**, so the hollow shape ended in two open flat cut-offs and read as a
    length of pipe. Only a stroked path takes a round cap — which is what the straight bars
    already had from `border-radius:999px`.
    ⚠️ **Hollow comes free from the two stroke widths.** Both paths are byte-identical; the
    4px under the 2px leaves 1px of outline along each side, and — because a round cap
    extends by half the stroke width — the same 1px at each **end**. Nothing is shortened by
    hand, and there is a probe assertion that the two `d` attributes match.
    ⚠️ **One path, rotated 90/180/270°.** A quarter turn about the box centre maps
    (x,y) → (26-y, x), which is exactly the next corner. Four hand-written paths would be
    four chances to get one wrong.
    ⚠️ **The viewBox bakes in `--aifloat-r`** (box `r + 12` square, arc radius `r`). It is
    the one place in the panel where a token is fixed into geometry — change the token and
    the path has to be re-cut.
    ⚠️ **`overflow:visible` on the svg** — the 4px stroke straddles the path, so it paints
    2px outside the viewBox on two sides and is otherwise clipped in half.
  - Every mark is **hollow**: an outline in `--aigrip-c` over the card surface (the bars) or
    a 2px `--card` stroke nested inside the 4px outline (the arcs), so the two read as one
    family. Both are **4px on screen with 1px of outline each side**, and there is a probe
    assertion comparing the capsule's total to the arc's stroke-width.
  - ⚠️ **`*{box-sizing:border-box}` DOES NOT MATCH PSEUDO-ELEMENTS** — it needs
    `*,*::before,*::after`. The reset at the top of this stylesheet is the bare `*`, so the
    edge capsules were silently `content-box`: 4px of height **plus** 1px of border each
    side = **6px on screen**, against the arcs' 4px. Same intended geometry, two different
    sizes, and nothing in either rule said so (reported 23 Aug 2026 as *"same size on this
    and this"*). `box-sizing:border-box` is now declared on the marks themselves — **not**
    by widening the global reset, which governs every pseudo-element in a 300KB sheet and
    would move things far outside this panel. **If another `::before` in this file measures
    wrong, this is the reason.**
- ⚠️ **A SINGLE RING CLIPPED TO A BAND WAS TRIED AND REJECTED.** `.aipanel::before/::after`
  sized to the card, `clip-path:inset(...)` per edge — it ran the edge and turned **both**
  corners as one continuous stroke. That is not what the reference does: there, each grip
  owns a short mark and nothing joins up. Don't rebuild it from this note.
- ⚠️ **ALL FOUR CORNERS ARE REAL GRIPS NOW.** `nw` was the only one, from when the card
  could only grow up and left. The resize maths needed nothing — `aiRzMove` tests modes with
  `M.includes(...)`, so `ne` simply runs the `n` and `e` branches.
- ⚠️ **The insets are `-3px` / `-2px`, not `-1px` / `0`.** An absolutely positioned box lays
  out against its ancestor's **padding** box, so the card's own edge is 1px outside it:
  `-1px` looks like the obvious number and puts the whole stroke *inside* the border.
  `-3px` centres a 4px stroke on the card's outer edge, `-2px` centres the 2px core.
  Measured, not guessed — `getComputedStyle().width` on a pseudo returns the **content** box,
  so add the border widths back before comparing it to the card.
- ⚠️ **EAST AND SOUTH ARE REAL RESIZE HANDLES, not just marks.** The card is anchored
  bottom-right and only ever had `w` / `n` / `nw`; a line saying *grab here* over something
  ungrabbable is worse than no line. `aiRzMove`'s mode tests are `M.includes(...)` now
  rather than an equality chain, so a corner is simply the two edges it is made of — the
  comment there had described eight modes for a while without the code implementing them.
  - ⚠️ **W/N move the far edge and so adjust `x`/`y`; E/S grow away from the anchor and must
    NOT touch them.** Getting that backwards walks the card across the screen as you resize.
  - ⚠️ **E and S must be bounded by the room on their OWN side**, not just by `aiFMaxW/H`.
    The card rests flush against the right margin, so `x` is already maximal; a width the
    general `aiClamp()` then had to absorb came out of `x` instead, and **dragging the right
    edge rightwards moved the left edge left**. `Math.min(aiFMaxW(), innerWidth - AI_EDGE -
    aiDrag.x, …)` makes the edge simply stop at the margin. There is a probe assertion for
    the stop as well as for the widen.
- ⚠️ **One drag flag PER EDGE** (`body.aidragn/s/e/w`), set by membership so `nw` lights both
  the edges it is made of, and all four cleared in `aiRzEnd`. A single `aidragging` class
  cannot say which grip is being dragged.
- ⚠️ **THE GRIPS STRADDLE THE CARD'S EDGE — 4px outside, 4px inside** (`--aigrip-o`,
  request 23 Aug 2026: *"my cursor is in the top header and I move down, the height
  minimises"*). They used to sit **wholly inside**: a 6px band and a 15px corner square,
  both carved out of the header. So a press near the top of the header — which *is* the
  drag handle, and the obvious place to grab a card — landed on the north grip and
  **resized instead of moving**; the card rests at full height, so dragging down from
  there shrinks it, which is exactly what was reported (twice, described first as the
  height increasing and then as it minimising).
  - Straddling is also how a real window behaves: the resize zone is centred on the
    border, not buried in the content. The header gives up **4px** instead of 6, the
    corners reach 9px in instead of 15, and the dead board just outside the card became
    useful.
  - ⚠️ **The marks are positioned inside their grips, so their offsets have to follow.**
    Every mark's `-1px` became `var(--aigrip-o)`, and the corner SVGs with it — move a grip
    without moving its mark and the line detaches from the edge it is pointing at. There
    are probe assertions that the top bar is still centred on the card's edge and the
    corner arc still starts at its outer corner.
- ⚠️ **IT HAS TWO STATES** (request, 21 Aug 2026): an **outline** while you are only
  pointing at the edge — 1px `--text-dim` border on a `--card` fill — and a **solid fill**
  once you are actually dragging it. A mark that looks identical before and during a drag
  says nothing at the only moment it matters.
- ⚠️ **THE ACTIVE FILL IS THE PRODUCT'S, NOT THE AI ACCENT** (request, same day: *"change
  this colour"*). It shipped as `--ai` for a few minutes and that put a saturated violet bar
  across the top of the card — the AI accent means *the assistant is doing something*, and a
  resize grip is neutral chrome with nothing to do with the assistant. The product paints
  its own active/selected chrome with **`--primary`** (`#111c2c` light, `#e3e8f2` dark);
  `--radio-btn-box-selected-bg`, `--calendar-selected-day-background-color` and
  `--nav-divider-bg` all resolve to it. In this file that IS **`--white`**, which the panel
  already maps to `--primary`, so it is one token and correct in both themes with nothing
  further to keep in step.
  - ⚠️ **4px, not 3px.** A 1px border needs a hollow core to read *as* an outline; at 3px
    the two borders meet and it renders as a solid bar again — the state it exists to be
    distinguishable from.
  - ⚠️ **The core is `--card`, not transparent** (request, same day: *"add white
    background"*). The bar straddles the card's edge, so its outer half sits over the
    **board** — a hollow core let widget text and legend dots show through the middle of it
    and read as a rendering fault. `--card` is `#ffffff` in light and the card's own surface
    in dark, so one token covers both; a hardcoded white would punch a bright slot in dark.
  - ⚠️ **THE SOFTNESS IS IN THE BORDER COLOUR, NOT IN `opacity`** — and getting this wrong
    made the fill look see-through **twice**. `opacity` applies to the whole pseudo-element,
    background included, so revealing it at `.5` left a half-transparent white and the
    board read straight through the bar even though the fill was `#ffffff`. It is revealed
    at **`opacity:1`** and the border alone carries the alpha, via
    `color-mix(in srgb, var(--text-dim) 60%, transparent)`.
  - ⚠️ **No `background-clip`** — the default `border-box` is wanted, so the opaque fill
    paints *under* the translucent border and the outline composites over white rather than
    over whatever widget is behind it. `padding-box` was tried and is wrong here; during a
    drag border and fill are the same colour, so it changes nothing in that state either.
  - ⚠️ **`color-mix()` serialises as `color(srgb r g b / a)`, not `rgba(...)`.** A probe
    testing the border for `/rgba/` failed twice on working CSS. Match a fractional alpha
    in either shape.
  - ⚠️ **`body.aidragn` is set ONLY for the north grip** (`aiRzStart`'s `'n'` / `'nw'`) and
    cleared in `aiRzEnd`. The bare `aidragging` class cannot say *which* grip is being
    dragged — keying off it would light the top edge while you resize from the left. It also
    holds the mark up when the pointer runs off the 6px band mid-drag, which `:hover` cannot.
  - ⚠️ **Testing the active state needs a hover stand-in at the SAME specificity as
    `.aign:hover::after`.** A probe injected `.aipanel.aifloat .aign.__h::after` (four
    classes), which outranked `body.aidragn .aign::after` and forced the resting opacity
    during the drag — one phantom failure on working CSS.
- ⚠️ **It STRADDLES the card's border — half above, half below** (second request the same
  day). The grip's own `top:0` is the panel's *padding* box, i.e. 1px inside the border, so
  the mark sits at `top:-1px` and is then centred on itself; its middle lands on the card's
  outer top edge.
- ⚠️ **That is why `.aipanel.aifloat` is `overflow:visible`, and it used to be `hidden`.**
  The outer half is a child painting outside its box and the clip ate it, leaving a 1.5px
  line flush on the edge. Nothing inside the card paints a background of its own, so the
  rounded corners survive without the clip — checked in both themes. **Only the floating
  card ever had that clip**; the base `.aipanel` has none, so Sidebar and Full screen are
  unaffected (a probe asserting they "still clip" failed on working code for this reason).
- ⚠️ **Hover only — it does NOT key off `body.aidragging`.** That class cannot say *which*
  grip is being dragged, so it would light the top edge while you resize from the left.
  It needs no drag state: the north edge follows the pointer, so the pointer stays on the
  grip and the line stays lit by itself.
- Reference: **monday's Sidekick panel**, whose floating card shows this line at its top
  edge and nothing on its sides.

⚠️ **A collapse-to-header control was built here and REMOVED the same day.** Hovering the
floating card's header revealed a chevron that rolled the card up to its title bar
(`.aimin`, `aiFloatMin` / `aiMinPaint` / `aiMinClear`). It was verified working and then
cut outright — the request had been for the *grip line* above, not a control. Unlike
`aiScopeMenu` / `iFocus`, **nothing was kept**: it is fully deleted, not parked. Don't
rebuild it from this note.

### The panel is painted from the product's own palette (21 Aug 2026)

Request: *"use this library to replace new colour, because I need to set this AI chat
interface in the current UI visualization — text colour, icon colour, or any you need"*,
pointing at **`observeops-icons/color-palette.html`** — the live product's tokens harvested
per theme (**319 light / 300 dark**, sectioned: General, Common Border Color, Common Text
Color, buttons, Form Element, …). Preceded by *"the border colour will be replaced with
#E3E8F2 — change all border colours"*, which turned out to be that file's `--border-color`.

Applied by **redefining tokens on `.aipanel`**, not by editing the hundreds of `color:` and
`border:` declarations. Custom properties inherit *and* resolve on the element that declares
them, so one block repaints the card's own edge and everything inside it — and any rule
added later inherits the palette for free.

| product token | ours | light | dark |
|---|---|---|---|
| `--page-text-color` | `--text` | `#1d2a3e` | `#cad3e2` (already agreed) |
| `--text-color-common-secondary` | `--text-dim` | `#7186a8` | `#8e9fbc` |
| `--text-neutral-ligher` | `--text-dim2` | `#6a7fa0` | `#6a7fa0` (already) |
| `--neutral-regular` | `--muted` | `#7186a8` | `#6a7fa0` |
| `--primary` | `--white` | `#111c2c` | `#e3e8f2` |
| `--border-color` | `--border` | `#e3e8f2` | `#1d2a3e` |
| `--tag-bg-color` | `--chip` | `#e3e8f2` | `#2b394f` (already) |
| `--left-menu-hover-bg` | `--hover` | `#ecf1f9` | `#172336` |
| `--dropdown-hover-background` | `--pop-item-hover` | `#ecf1f9` | `#2b394f` (already) |
| `--chart-indigo` | `--ai` | `#7c3aed` | `#8b5cf6` (already) |

- ⚠️ **SCOPED TO THE PANEL.** Every one of these also drives the dashboard, Log Explorer and
  Settings. The ask was to align *the chat* with the product, not to repaint the prototype —
  these rules must never move to `:root`. There are probe assertions that the board keeps its
  own `--text` (`#24344d`) and `--ai` (`#8b5cf6`).
- ⚠️ **Dark is `:root` here** and light is the `html[data-theme="light"]` override, so the
  dark values sit on `.aipanel` and the light ones on the more specific selector. Only what
  actually differs is declared.
- ⚠️ **THE AI ACCENT WAS A PRODUCT TOKEN ALL ALONG.** `--chart-indigo` is `#8b5cf6` in dark
  — exactly the violet this panel already used — and `#7c3aed` in light, which is also what
  `--oa` (Option 3's panel) has always declared in light. So the two AI surfaces stop
  disagreeing about their own accent.
  ⚠️ **`--ai-soft` / `--ai-line` must move with it.** They are hardcoded
  `rgba(139,92,246,…)` at `:root`, so changing `--ai` alone leaves every wash and hairline
  on the old hue.
- ⚠️ **Deliberately NOT repointed**, because none of it is chrome: `--ai-in-line` (the
  composer's edge, dimmed on request four times to its `.018` floor), `--ai-cta` (the brand
  gradient, supplied verbatim), `--track` (the clarifier radio's ring, which must stay
  visible), and `.aihov` (the history hover preview, appended to `<body>`, so it does not
  inherit any of this — it is a popover over the board, not part of the panel).
- ⚠️ **One contrast regression, stated rather than silently "fixed":** light `--text-dim`
  goes `#5b6b85` → `#7186a8`, the product's own secondary-text colour, which lands near
  **4.0:1** on white rather than above 4.5:1. It is what the product ships.

### The chat name lost its resting pill (21 Aug 2026)

- `.aihttl` carried `--ai-in-chip` permanently — a filled slab behind the name in a header
  with no other fill, which made the title read as a field. **`background:transparent` at
  rest; hover and `.open` still fill it**, so the affordance survives. This reverses the
  earlier *"chat name as a resting pill"* — don't restore it without re-reading both.
- ⚠️ **The `margin-left:-9px` went with it** (same request: *"add margin"*). That pull
  existed to cancel the pill's own left padding so the *text* lined up with the header edge;
  with nothing painted at rest there is no pill to cancel, and all it did was jam the name
  against ＋ New chat 4px away. It is `2px` now — the header's own `gap:4px` plus a little,
  measured at 8px of real space between the two controls.

### Verification lessons from this pass
- ⚠️ **Never assert against `document.body.textContent`** — it includes inline `<script>`
  source, so a probe matched `aiAgShare`'s own code and passed on a completely broken
  button. Assert on rendered nodes; capture `window.onerror` in every probe.
- ⚠️ **Regenerate the probe copy after every edit.** A stale snapshot "failed" twice on
  code that was already fixed.
- ⚠️ **Chrome rounds alpha in serialisation** (`.045` → `0.043`, `.018` → `0.02`) and
  **letter-to-digit is not a word boundary** (`\b9\b` never matches `"Show all9 ›"`).
  Both produced phantom failures.
- ⚠️ **A tab driven by automation is not focused, so transitions freeze** — the panel read
  as still off-screen. Inject `transition:none` before measuring geometry.
- ⚠️ Open the chat from the **right module** — `aiInLogs()` swaps the starters, and a probe
  that opened it inside Log Explorer counted 3 instead of 5.

## The 24 Aug 2026 pass — Option 1's `ai*` panel, request by request

A second long single-session sweep, all in `index.html`, driven against supplied
screenshots and a Notion reference for the thinking disclosure. The *why* for each item is
in the file's own comments at the rule or function; this is the map.

### Icons and shapes
- **Send is Lucide `arrow-up` in a 9px ROUNDED SQUARE.** It was a hand-drawn filled dart
  (`M4 12l16-7…`) painted `fill:currentColor` while `.aiplus` / `.aimic` 8px away were
  Lucide outlines — one solid glyph among outlines reads as a different family at any size.
  It went dart → Lucide `send` (plane) → `arrow-up`: the plane is a diagonal form with its
  mass in one corner and never centres in a circle, the arrow is axis-aligned (measured 0.00
  offset on both axes). The plane's path is recorded in the comment, not deleted.
  ⚠️ **The square REVERSES the 19 Aug circle**, whose note said "a 30px rounded square
  between two 30px circles read as a different size". That row is gone — the mic and the ＋
  menu were removed on 21 Aug, so send is the only thing at the right-hand end with nothing
  to disagree with. **If the composer ever regains a control to send's right, re-check this.**
  ⚠️ The Stop state's radius moved with it: the button must not morph shape when pressed.
  ⚠️ `.aisend.aisndstop svg` needs `stroke:none` — `.aisend svg` now sets a stroke and it
  would otherwise leak onto the filled square.
- **The layout toggle is a matched pair**: Lucide `square` for Full screen, Lucide `copy`
  (two overlapping squares) for Floating — the window-control pair every desktop uses. It
  opened as a picture-in-picture mark whose board outline is an OPEN path against a CLOSED
  filled rect; an open path and a closed rect are not siblings however close their subject.
  ⚠️ `copy`'s back path is an open L **on purpose** — it never passes behind the front rect,
  which is what makes the 22% translucent fill safe. Don't "complete" it into a rectangle.
  ⚠️ **It no longer wears `.on`.** `aiLayPaint` used to set the violet pressed look whenever
  the panel was full screen, so the same button was neutral in one of its two states and
  violet in the other. `.aihb.on` STAYS in the sheet — every other header dropdown uses it.
  It is `classList.remove('on')`, not "don't add": a stale `.on` has to be cleared actively.
- **The summary card signs itself with the ✦, not the product logo** — this REVERSES the
  19 Aug annotation. The product did not write that prose, the assistant did, and the mark is
  the one place a reader learns it. `.aiagmk.logo` is kept unreferenced; `AI_LOGO` stays live
  for `aiLogoPaint()`'s `.brandmark`s.
- **The clarifier's back and close icons were different SIZES** (14/2.14 vs 13/2.31) — both
  computed to the panel's 1.25px on-screen weight, so the stroke rule was being obeyed and
  the defect hid behind it. Both are 16px / 1.875 now (still 1.25px on screen); against a
  600-weight title, presence comes from SIZE, never from opting out of the weight rule.

### Spacing, all of it measured against something
- **Header:** `.aihnew`'s and `.aihttl`'s ad-hoc margins are gone — `.aihd`'s `gap:4px` is
  the single place header spacing is set — and `.aihttl`'s left padding went 9 → 4px so the
  chat name sits **8px** from ＋ New chat, which is `.aiagch`'s own mark→title gap. The icon
  →title distance is the summary card's number, not a new one.
  ⚠️ `.aihttl`'s `margin-left` has had FOUR settings (`-9px` → `2px` → `0`, plus the padding
  cut). 0 is not a return to the -9px complaint: what was jammed then was the TEXT, because
  the negative pull had eaten the pill's padding.
- **`.aitobot` was flush on the composer, not merely close.** `bottom` is measured from
  `.aicomp`'s bottom, so `100%` puts the button's edge on `.aicomp`'s TOP — and `.aicomp`
  carries `padding-top:4px`, which is where the pill starts. `calc(100% - 4px)` cancelled
  exactly that. It is `calc(100% + 6px)` = **10px** of real gap; read it against that padding.
- **`.aichips` / `.aiq` / `.aiacts` have TWO gaps now** (`8px 6px`, `margin-top:14px`). A
  single `gap` on a wrapping row governs both axes, so a wrapped line sat 5px under its own
  first line while the blocks were 10px apart — the `.aiab li` lesson in a third place: the
  gap BETWEEN groups must beat the gap INSIDE one. Row-gap is deliberately larger than
  column-gap; side by side, chips are separated by their own borders, stacked they are not.
- **Documentation / Support sit at the FOOT of the empty state.** `.aiempty` is a full-height
  flex column and `.aihelpl` takes `margin-top:auto`, so the blank space is above them.
  ⚠️ **`margin-top:auto` cannot also carry the minimum gap** — it resolves to 0 when there is
  no free space and silently overrides a `margin-top:14px` written beside it. The floor lives
  on `.aiempty > .aicta:last-of-type{margin-bottom:6px}`, verified by squeezing the panel to
  260px. `:last-of-type` cannot match the help buttons — they are nested inside `.aihelpl`.

### The clarifier card
- **Skip left the "Something else…" field** for a footer row it shares with Done (Done after
  Skip, escape-then-commit). Inline in the label it read as skipping the free text rather
  than the question. ⚠️ Its chip styling had to move with it — as `.aicqf .aicqsk` it went
  dead and the bare `.aicqsk` text-button rule would have taken over silently. ⚠️ `.aicqd` is
  emitted on EVERY step now, not just multi ones, or single steps lose Skip entirely.
  ⚠️ `event.preventDefault()` came off — it only existed because the button was in a `<label>`.
- **The back arrow renders on every step, disabled on the first.** It is `flex:0 0 24px` in a
  `gap:9px` row, so appearing at step 2 shoved the title 33px right while `.aicqs` stayed at
  0 — the title stopped aligning with its own subtitle AND the header jumped between steps.
  ⚠️ `.aicqb:disabled` was ALREADY in the sheet; the conditional render had orphaned it.
  ⚠️ `.aicqs`'s indent is `24 + 9 = 33px` and **must move with the button's size** — it was
  31 for one edit, then the icons grew.
- **A 2px `--ai` progress track** sits under the header block, full-bleed. A fraction is a
  fact you read; a bar is one you see. ⚠️ The fill is `width:%` on a block child, never
  `flex` — the recorded `flex:50` bug would paint every step complete. Walked 25/50/75/100.
- The step counter's current number is `--text`, the total `--muted`.

### The thinking trail
- **Expanded, it is capped at 220px, scrolls, and fades both edges** (Notion reference). It
  used to unroll every phase and push the answer off screen. **It reuses the thread's own
  fade engine** — `aiFadeEl(el)` was extracted from `aiFade()` and both call it; a mask fades
  the CONTENT, so it is correct over the panel's gradient. Both fade values default to 0, so
  a short trail is not dimmed for nothing.
  ⚠️ **`aiTkFadeBind()` is called from the TAIL of `aiRender()`, not from `aiFadeBind()`** —
  that function runs near the top, before `b.innerHTML`, so its query finds nothing and binds
  nothing. A `requestAnimationFrame` fallback does not save it either: **rAF is starved under
  headless virtual time**. Anything needing the painted DOM goes after the paint, beside the
  loader's clock. This cost two probe rounds.
- **The collapsed label is one constant, `AI_TK_NAME = 'Thought'`**, on both surfaces. This
  REVERSES the 19 Aug kinds-summary ("Thought 2x, Searched, Dashboards"): the label differed
  on every prompt and changed length as it changed text, so the calmest chrome in the thread
  was the most variable. `AI_TK_VERB` / `aiTkKinds()` are kept unreferenced.

### The context bar never empties
- Dropping the last chip installs a non-removable **All modules** floor and really moves the
  scope (`aiScopeHas('Logs')` flips true, the mismatch guard stops challenging). This
  REVERSES the 18 Aug "clearing every chip leaves the module scope standing" note — empty
  means GLOBAL now, and it says so.
  ⚠️ **`aiOpen`'s guard had to learn about it**: `!aiCtxItems.length` was never true again
  once the floor existed, so every chat opened globally and the entry-point default was
  silently dead, board chip and all. It is `(!aiCtxItems.length || aiCtxIsFloor())`.
  ⚠️ The floor gets its ✕ back as soon as anything else is pinned.

### The floating card's header is a hand
- `cursor:grab` at rest, `grabbing` for the whole drag, scoped to `.aifloat` (`aiDragStart`
  bails otherwise, so a hand in Full screen would promise a drag that cannot happen). The
  header's own controls keep `pointer`. ⚠️ `grabbing` needs a global `!important` under a new
  `body.aidragmv`: the pointer leaves the header during a drag — that is the point — and
  every element it crosses would reassert its own cursor. `body.aidragging`'s `cursor:inherit`
  does not do this; it only targets `body`. ⚠️ The flag is set on the MOVE path only, never in
  `aiRzBind`, or the edge grips lose their resize cursors.

⚠️ **Driving the full-screen toggle wedges the renderer under browser automation.** Verified
against the committed baseline — it predates this session's edits — but it is why the layout
states were measured by setting `.aifs` directly.

## The 25 Aug 2026 pass — the assistant gets a name, a mark, and a neutral palette

All Option 1 (`index.html`). Four threads, and each one **supersedes statements
elsewhere in this file** — where they conflict, this section is current.

### The assistant is called **Iris**, and its mark is `OPS AI.svg`

`Ask AI` → **`Ask Iris`** on the toolbar pill, in the Log Explorer head, on the rail row and
its tooltip, in the `A` shortcut's label, the panel's `aria-label`, and the empty-state copy.
The greeting went *"how can **we** help?"* → *"how can **I** help?"* — naming the assistant
made the plural wrong, and the Logs branch of that same block already spoke as *"I'll build
the query"*.

The name was chosen from **`_ai-identity.html`** (same folder, underscore-prefixed so
`_sync_variants.js` ignores it) — six complete identities with rationale and trademark
notes. Keep it; it is the record of why Iris and not Argus/Vega/Nova/Lyra.

- ⚠️ **`AI_SPARK` IS NO LONGER THE ✦.** It holds the supplied `OPS AI.svg` — a speech
  bubble with a four-point spark, `viewBox="0 0 48 48"`, pasted verbatim. Every ✦ reference
  elsewhere in this file means this mark now.
- ⚠️ **The viewBox is 48 while the rest of the panel is on a 24 grid.** Deliberate: it is the
  box the artwork was drawn in, and rescaling a path by hand is the tidying that puts
  artwork out of family. Nothing downstream cares — every consumer sizes the `<svg>` in CSS.
- ⚠️ **`fill="black"` on the path and `fill="none"` on the root are stripped.** `fill` is an
  inherited SVG property, so with neither present the CSS `fill:` reaches the path. Leave
  `fill="black"` in and the mark paints black in both themes, which looks like the colour
  rules are being ignored rather than like an attribute winning.
- ⚠️ **`LX_AI_SPARK = AI_SPARK`** — one definition. It used to be a second literal and the
  two drifted the moment either changed. The only constraint is block order: the `lx` block
  is parsed after the `ai` one, so it can read that binding; move it earlier and it is a TDZ
  error at load.
- ⚠️ **A stroked mark and a filled mark need opposite CSS**, and there are **eight**
  consumers (`.aibig`, `.aitkm`, `.aiagmk`, `.aibtn svg`, `.lxask svg`, `.lxpst svg`,
  `.lxpatai svg`, `.lxqai .gen svg`). A brief Iris-prism build had them on
  `fill:none;stroke:…` with a per-size `stroke-width`; the supplied mark is filled, so they
  are all back to `fill:` and **the derived stroke-widths were removed, not left behind** —
  a stroke-width on a solid mark reads as a real setting.
- ⚠️ **`#sbAI .ic` has no override any more.** The stroked mark needed `fill:none` scoped
  there; the filled one must NOT have it, or the rail row's icon renders as nothing.
- **Still on the old ✦ deliberately** (different surfaces, not the assistant): Log
  Explorer's `AI Query` button and popover, the per-widget `✦` summary drawer, and the
  `ac*` panel. `AI_SPARK_MI` is genuinely dead.

### The chat panel is off violet — `#1D2A3E` light / `#CAD3E2` dark

Done by **redefining the tokens on `.aipanel`**, not by editing ~173 declarations — the same
move the earlier palette alignment used. **This supersedes every "violet is the AI accent"
statement above**, for the `ai*` panel only.

    .aipanel          --ai/--ai-2 #cad3e2  --ai-3 #8e9fbc  --ai-fg #0b1627  --ai-h #e3e8f2
    light .aipanel    --ai/--ai-2 #1d2a3e  --ai-3 #7186a8  --ai-fg #ffffff  --ai-h #111c2c

- ⚠️ **The light block redeclared the violet LATER IN THE SAME RULE** (`--ai:#7c3aed`, from
  the `--chart-indigo` alignment). Identical specificity, so source order alone would have
  handed the whole light theme back to violet while dark went neutral — and nothing in a
  search for the NEW values would have shown it. Deleted, not left.
- ⚠️ **`--ai-soft` / `--ai-line` must be restated** — they are hardcoded `rgba(139,92,246,…)`
  at `:root`. The two ALPHAS are unchanged (.13/.34 dark, .09/.26 light); only the hue moved.
- ⚠️ **`--ai-fg` is new and load-bearing.** The fill now INVERTS between themes, so the ten
  rules painting `color:#fff` on an `--ai` background are invisible in one theme — white on
  `#CAD3E2`. It is the panel's own surface, so a filled control reads as a hole punched back
  to the card.
- ⚠️ `.aicqok span` (the `Done ①` count pill) was a `rgba(255,255,255,.22)` veil, correct
  only on dark violet. It is mixed off `--ai-fg` now.
- ⚠️ **Scoped to `.aipanel` and must stay there.** `--ai*` also drives the toolbar pill, the
  Log Explorer's AI Query, the per-widget ✦ drawer and the canvas `.aiflash` outline — all
  still violet, all deliberately.
- **`--ai-cta` is NOT repointed** — the supplied brand gradient behind the starter rows
  contains no `#8B5CF6`. It is now the only chromatic thing in the panel besides the
  thinking title's band.

### Primary buttons: a new `--action` token pair

`Create New Dashboard` (`.btn.pri`) and the `Create Widget` FAB (`.cwfab`) were `--teal`,
which is **theme-invariant here** — one `#14b8a6` for both themes. They now use
`--action` / `--action-fg` / `--action-h`, declared per theme (`#cad3e2` dark, `#1d2a3e`
light). `--action-fg` exists because the fill inverts; teal took `#04211d` in both themes and
a fixed foreground over a flipping fill is unreadable in one of them.

⚠️ **183 other `var(--teal)` uses remain** — links, focus rings, active tabs, switches, chart
bars — plus two more primary CREATE buttons on their own classes: **`.ddcreate`** (Create
Dashboard drawer) and **`.cwbtn.pri`** (widget editor footer). Those were left teal.

### The thinking row, rebuilt

The running Reasoning row is now **mark + animated title + shimmering narration + clock**.

| part | what it does |
|---|---|
| `AI_LD_MARK` (`.aildm`, 16px) | the product mark, pulsing `aildpulse` 650ms ease-in-out `.4 → 1` |
| `.aildl` — the title | writes itself in, then a chromatic band loops through it (below) |
| `.aiagsay.live` — the narration | Text Shimmer (`aishim`), 2.6s linear |
| `.aildt` | the elapsed clock, unchanged |

**The title is a CSS port of beui.dev's "Dia Text Animation" (`chromatic-text-reveal.tsx`).**
The reference is React + `motion`; this file has neither.

- ⚠️ **`@property` is mandatory, not a nicety.** An unregistered custom property animates
  DISCRETELY — the sweep would jump end to end and the effect would not appear at all. Both
  `--chromatic-sweep` and `--aireveal` are registered as `<percentage>`.
- ⚠️ **The palette is this file's own brand gradient**, `rgb(76,177,254) 0% / rgb(115,30,251)
  55% / rgb(249,17,227) 100%` — the same three stops as `--ai-cta`. **The middle stop sits at
  `+1.4%`, which looks wrong and is not**: the band spans `sweep ± 14%` (28% wide) and the
  gradient puts its violet at **55%**, so `-14 + (0.55 × 28) = +1.4`. Placing it at 0 would
  centre it and quietly restate the gradient as 50/50.
- ⚠️ The source's own `offset(i) = -14 + (i/(n-1)) × 28` only applies to an EVENLY spaced
  palette. This one is not, so the stops come from the supplied percentages.
- ⚠️ **`background-size` is 100%, not 200%.** The old shimmer needed a double-width image to
  SLIDE; this one never moves the image — the stops move inside it. At 200% every stop lands
  at half its intended position.
- ⚠️ **Three animations on `.aildl.fresh`, and the order is load-bearing**:
  `aiwrite 1.2s ease-in-out 1 forwards` (drives band position AND mask edge together, which
  is what puts the chromatic edge exactly where the text is being written), `aidiain .36s`
  (blur/slide entrance), `aidia 2.4s linear **1.2s** infinite` (loops the band forever). The
  loop is later in the list so it takes `--chromatic-sweep` over at the hand-off; before its
  delay elapses it contributes nothing, so the two never fight.
- ⚠️ **The hand-off is seamless only because the endpoints agree.** `aiwrite` ends at 114%
  (band fully past, every glyph at the trough colour) which is exactly what `aidia` renders
  at its own 0% (`-14%`). Change either endpoint and a colour jump appears at 1.2s.
- ⚠️ **The write-in is a MASK (`--aireveal`), not the gradient's own `transparent` stops.**
  Those two cannot coexist: the loop needs the text READABLE ahead of the band, the write-in
  needs it ABSENT, one `background-image` cannot be both, and it does not interpolate. The
  mask edge runs **8% ahead** of the band centre so the leading colours show at the point of
  writing. `--aireveal` rests at **120%**, not 100% — at exactly 100% the last glyph's
  antialiased edge clips.
- ⚠️ **`.fresh` is emitted by `aiLdHTML()` only when the label TEXT changed.** `aiRender()`
  rebuilds `#aiBody.innerHTML` on every render, so with the animation on `.aildl` it replayed
  on renders that had not changed a word (measured at 3200ms into a run). The base rule
  therefore rests at `--chromatic-sweep:114%` — sweep already past — because at `-14%` a
  non-fresh label would be entirely invisible while its beat was still on screen. The
  freshness test also treats "no loader on screen" as fresh, which is what makes the first
  beat of a NEW run animate when its text repeats the previous run's.
- ⚠️ **The narration shimmer needed `.aitk.bx .aiagsay.live` (0,4,0).** `.aitk.bx .aiagsay`
  sets `color:var(--text-dim)` at (0,3,0) and beat a plain `.aiagsay.live` (0,2,0) — so
  `color:transparent` never applied, the solid text painted OVER the gradient, and only ~9%
  bled through. **`background-clip:text` still applied and the animation still ran**, so
  probing `animationName` reported "working"; only reading `color` found it. Both selectors
  are listed, and `prefers-reduced-motion` had to repeat them or it cannot undo its own rule.
- ⚠️ Its trough is **`--text-dim`**, the colour the line already is in that box — not
  `--muted`. They are both `#7186a8` in light so the difference reads as a no-op there and is
  plainly wrong in dark (`#6a7fa0` vs `#8e9fbc`).
- ⚠️ **On a `background-size:200%` shimmer the RANGE decides how much of the cycle you SEE;
  the duration only decides how fast.** `100% → -100%` put half the travel past the end of
  the text, so for ~1.3s of every 2.6s there was no highlight on the line and any screenshot
  in that half showed flat text. It is `110% → -10%` now (~17% dead instead of 50%).
- **Parked, not deleted:** the pixel-grid loader (`AI_LD_DELAY`, `.aild`, `@keyframes aipix`)
  and its wavefront timing.

### The floating card's resize grips

- **Hover-only, and that is the second answer** — they were made visible at rest and reverted
  the same day. The rule was **deleted rather than commented out**: a parked `opacity:1`
  next to `opacity:0` invites switching the removed thing back on.
- **`--aigrip-i` is the one dial for bar length** — `card size − 2 × (this + 1)`, so it tracks
  a dragged card for free. It moved `14px` (the corner radius) → `11px` → `16px` → **`41px`**,
  i.e. a deduction of 30 → 24 → 34 → **84**. ⚠️ **This overrides the standing
  "don't shorten it again" note**, which came from a 23 Aug misread; four explicit length
  requests in a row is a decision, not a mistake.
- ⚠️ **A value here paints 1px further in than it reads** — an absolutely positioned box lays
  out against its ancestor's PADDING box and the card's edge is 1px outside it.
- The **thinking trail's scrollbar is hidden** (`scrollbar-width:none` + a scoped
  `::-webkit-scrollbar{display:none}`) while `overflow-y:auto` stays. `overflow-y:hidden`
  would remove the bar by removing the scrolling, and the 220px cap exists so the rest is
  still reachable. `padding-right:8px` is kept though its gutter reason is gone — removing it
  re-wraps every row.

### Verification lessons from this pass

- ⚠️ **CSS animations do not advance reliably under headless virtual time.** Sampling an
  animated value returns its `from` value forever. Freeze the animation and set the property
  explicitly, then screenshot — that tests the RENDERING, which is the part that can be wrong.
- ⚠️ **`getComputedStyle` on a PSEUDO-element returns computed, not used, values.** Reading a
  grip mark's `height` returned the declared 4px, and "adding the borders back" produced a
  phantom 6px. Measure a pseudo from PAINTED PIXELS.
- ⚠️ **`sips --cropOffset` is CENTRE-relative, not absolute.** Every early crop landed on the
  wrong region. Use PIL.
- ⚠️ **Colour-detection crops collide with the board behind the panel** — red matched the
  heatmap, green the severity palette, magenta the Ask-AI pill. Force an unmistakable colour
  onto the element under test, and match tolerantly (Chrome rounds `#ff0000` to `254,0,0`).
- ⚠️ **The screenshot viewport is TALLER than the `--dump-dom` one** (no browser chrome), so
  a rect measured in one run does not crop the other. Derive positions from the render's own
  height.
- ⚠️ **Regenerate the probe copy after every edit** — a stale copy reported `card-34` twice
  on code that already said 84.

## The 26 Aug 2026 pass — shortcuts popover, Layout settings, dot-matrix loaders

All Option 1 (`index.html`). Four features and two real bug fixes.

### Keyboard shortcuts, on hover (`kbPop*`)

A keyboard icon in the dashboard toolbar, last in the right-hand cluster. **Hover** shows
every shortcut, **click** opens the existing `?` sheet. All 16 rows are built from the same
**`KB` registry** that already drives that sheet and the per-control keycaps — add a shortcut
to that array and it appears in all three.

- ⚠️ **The button carries NO `data-tip` AND NO `title`.** The delegated tooltip engine fires
  on either and would open a tooltip UNDER the popover on the same hover. `aria-label` gives
  the accessible name without arming `tipFor()`. The cost: this is the one control that
  cannot show its own keycap, so the popover lists `?` itself.
- ⚠️ **Leaving the button does not close it immediately.** The pointer must cross a gap to
  reach the panel; a plain `mouseleave` would shut it mid-journey — the rail-flyout bug. The
  close is deferred 200ms and cancelled by `kbPopIn`, which the panel's own `mouseenter`
  sets. Opening is delayed 140ms so sweeping the toolbar does not flash a 462px panel.
- ⚠️ **`visibility`, not `display:none`.** `kbPopOpen` MEASURES the panel to place it and to
  decide whether to flip above; a `display:none` element has no box, so `offsetWidth` would
  be 0 and every popover would pin to the left edge. Measure, position, THEN reveal — adding
  `.on` first transitions it in at the previous anchor.
- ⚠️ **Each group is one grid item**, so the four tile 2×2 and a heading is never split from
  its rows. `columns:2` flows the rows themselves and breaks that.
- ⚠️ **It closes on `resize` by design**, and that makes it invisible in headless captures —
  the screenshot itself fires a resize. Detach that one listener to shoot it.

### Layout settings (`lay*`) — ported from ServiceOps_Dashboard_v2

A 520px right drawer, **"Dashboard layout"**, from the dashboard's ⋮ menu and from the Manage
screen's bulk bar. Analysed at `#/dashboard/d-188` → ⋮ Actions → "Layout settings", with the
model read out of that app's own bundle.

Their state is `{titleSize, cardPad, hGap, vGap, rowHeight, boardMargin}` but **only four are
editable** in their panel — `cardPad` and `boardMargin` exist and drive their preview yet are
never exposed, so they are not reproduced. Their ranges are kept verbatim: gaps `4–32 step 2`,
row height `110–260 step 10`, title `S/M/L`.

- ⚠️ **EVERY PART IS AN EXISTING ATOM** — `.sdrawer`/`.dr-h`/`.dr-b`/`.dr-f`, `.ddlbl`,
  `.ddseg` (which already WAS a two-way segmented control, for Public/Private), `.ddnote` for
  the scope sentence, `.ddsliders`/`.ddslide` for the 2×2 field grid, `.ddprev` for the Live
  Preview. Only the MODEL was copied; no chrome and no colours.
- ⚠️ **THE DEFAULTS ARE OURS, THE RANGES ARE THEIRS.** Their gaps default to 14 and row
  height to 140; this canvas has always drawn a 10px gap and a 12.5px title. Taking their
  defaults would silently restyle every board the first time the drawer opened, so Reset puts
  the board back to how it has always looked — which is what Reset has to mean.
- ⚠️ **APPLY IS REAL.** `.dgrid12`'s gap and `.widget .whead`'s font-size were hardcoded and
  the Create drawer's existing sliders only ever drove its own preview. Both are tokens now
  (`--lay-hgap` / `--lay-vgap` / `--lay-title`), and **row height drives `hMul`**, the
  multiplier this canvas already had — `fitCanvas` clamps to `Math.max(hMul, …)`, so raising
  it raises the floor and widgets genuinely get taller. 140 maps to hMul 1.
- ⚠️ **`layVars()` SETS TOKENS ONLY and is called from the top of `renderCanvas()`.** It must
  never call `renderCanvas()` itself or it recurses; that placement also applies a per-board
  layout for free when you switch boards.
- ⚠️ **TWO SCOPES, ONE VARIABLE TARGET.** `LAY_G` is global, `LAY_B[board]` an override, and
  `LAY_TGT` is `null` for "the open board" or an array for "these selected boards". The
  segment label, the note, the button label and the apply loop all read `layTargets()`, so
  they cannot drift. "All dashboards" CLEARS the per-board overrides on whatever it was
  pointed at, or those boards keep their old layout and the global setting looks ignored.
- ⚠️ **`#drawer-layout.on` IS MANDATORY.** `#drawer-layout{right:-540px}` is (1,0,0) and
  beats `.sdrawer.on{right:0}` at (0,2,0) — the drawer would open in state and never move on
  screen. Any id-scoped width on a `.sdrawer` needs its own `.on` rule.

### The Manage screen's bulk bar

Gained **Layout settings** (first, before Move to category), and two fixes:

- ⚠️ **ARCHIVE IS NO LONGER `dgr`.** `--red` is this system's CRITICAL colour and it was
  painting Archive, which is fully reversible — `MD_ARCH` is a Set and `mdRestore()` takes a
  board straight back out. The irreversible action is **Delete forever** on the Archive tab,
  and it keeps the red. Two actions that undo differently must not look the same.
- ⚠️ **A `.sep` HAIRLINE PRECEDES THE IRREVERSIBLE ACTION.** With four tiles, colour was the
  only separator — and colour alone is the cue that does not survive a colourblind reader or
  greyscale.

### The thinking row's motion

- **The narration cross-fades** when the beat changes (`aiSayFade`, `.aisayin` / `.aisayswap`).
  ⚠️ **It cannot be pure CSS**: `aiRender()` rebuilds `#aiBody.innerHTML`, so the node holding
  the old sentence is destroyed the instant the new one renders. The trick is to put the OLD
  text back into the NEW node, fade it out, and swap the words at the trough (38% of 0.5s —
  written twice, as a keyframe stop and as a 190ms timeout, and coupled).
  ⚠️ Both rules restate `aishim` and both carry `.aitk.bx`, for the reasons below.
- **Three dot-matrix loaders** replace the product mark in that row, chosen by what the
  assistant is doing: **Prism Bloom** thinking · **Core Spiral** creating · **Strobe Stack**
  building a log query. Ported from `dotmatrix.zzzzshawn.cloud` (`dotm-square-14 / -3 / -8`),
  taken from the library's SOURCE rather than the rendered page.
  ⚠️ **"Converge" and "Stack" DO NOT EXIST** in that library — its registry has 80 loaders
  and neither is among them. Core Spiral and Strobe Stack were confirmed as the substitutes.
  ⚠️ **ONE MARKUP, THREE LOADERS.** Every cell is a bare `<i>` addressed by `:nth-child()`, so
  switching loader is switching ONE class on the container. `AI_LD_KIND` is set in `aiPush`,
  the only place that knows both the router's `type` and whether the sentence parsed as a log
  query — `aiLdHTML` runs later, from a render, where only a label is in scope.
  ⚠️ **PURE CSS, NO TIMER.** Prism Bloom's 25 cells collapse to 7 timelines (a symmetric
  kaleidoscope repeats); Core Spiral is one keyframe set with per-cell delays; Strobe Stack
  needs 25. A JS loader would need clearing when the panel closes — the `agClose()` trap.
  ⚠️ **`steps(1,end)` on Strobe Stack, `linear` on the other two.** Its source snaps between
  24 discrete states; interpolating turns a stack that builds into a soft throb.
  ⚠️ **ONE SPEED DIAL.** Every duration and stagger is `calc(<base> * var(--aidot-speed))`,
  currently **1.8**. Raising it must move the stagger too — Core Spiral's per-cell delay is
  what makes it a snake; slow only the duration and the head runs away from the tail.

### Two bugs this pass, both worth remembering

- ⚠️ **`.aipb` WAS ALREADY TAKEN** — `.aipb{padding:11px;min-height:86px}`, the *AI preview
  body*, 1500 lines up. The Prism Bloom container carried the same class and inherited both,
  so an 18px slot held a 40×86 box and the thinking row broke onto several lines. Nothing
  errored and the dots animated correctly, which made it read as an alignment bug rather than
  a name clash. Renamed `aidpb` / `aidcs` / `aidss`. **Grep the CSS class, not just the JS
  name** — `grep "^\.aipb{"` would have found it instantly.
- ⚠️ **`grid-auto-rows` AND `line-height:0` are both required on a dot grid.** An `<i>` is
  inline by default and although a grid item is blockified — so `getComputedStyle().display`
  reports `block` and looks fine — the ROW is still sized by the inherited line box. Rows
  measured 11.75px instead of 2.6. **Measure `gridTemplateRows`, not the item.**

### Verification notes from this pass

- ⚠️ **`curl` succeeds where the browser tool's content filter blocks.** Returning contiguous
  source from a page context was refused repeatedly; fetching the same file with `curl` in
  Bash worked every time. Use Bash for source, the browser for behaviour.
- ⚠️ **A page running ~98 simultaneous CSS animations wedges the renderer.** The Dot Matrix
  showcase froze the tab twice. Go straight to a single-item route, or to the source.
- ⚠️ **A pre-existing `id="drawer-versions"` DUPLICATE** sits in the markup — two elements,
  different bodies. `getElementById` returns the first, so the second is dead. Not fixed.

## The 27 Aug 2026 pass — the Sidebar tab, and the design system as the authority

All **Option 1** (`index.html`). Two threads: the drawer was rebuilt against the
**ObserveOps design system** (via its MCP: `get_contract` / `get_theme` / `get_layout` /
`get_component` / `resolve_token` / `resolve_icon` / `validate_usage` / `validate_render`)
and against the **live product** at `172.16.12.100` (build 10.0.0); and the Dashboards tab
became a **Sidebar tab** governing everything in the rail.

⚠️ **Several statements elsewhere in this file are superseded here.** Where they conflict,
this section is current.

### The drawer is on the DS, scoped to itself

⚠️ **THE DS TOKENS ARE DECLARED UNDER THEIR OWN NAMES ON `#drawer-layout`**, then this
file's tokens are pointed at them — ~60 existing rules repaint without one being rewritten,
and the mapping stays auditable in one table. The mechanism `.aipanel` already uses.
**It must stay scoped**; every one of those names has a job elsewhere.

| what | the DS said | was |
|---|---|---|
| surface | `get_layout(panels)` — drawer for create/edit, 146 files | already a drawer ✓ |
| tabs | `Molecules/Tabs` variant **`no-border`** ("tabs on a panel that has its own edges", the 21× dominant); active `--primary` text + 4px underline, weight 500; inactive `--tabs-text-color` | `--teal` underline, 2px, weight 600, over a bar rule |
| buttons | `Atoms/Button` — Apply = `primary` (the ONE main action), Reset/Cancel = `default`; `--primary-button-bg` / `--primary-button-text` | `--action`, one step off |
| radius | `get_theme`: "no `@border-radius-base` — use `@btn-radius` for ALL general radius" = **4px** | 5, 6, 7px |
| title | obs-page-header: `--primary-alt`, weight 500 | weight 700 on `--text` |
| form controls | `@primary-color` **cyan #099dd9** — "Ant form controls only (radio dot, checkbox check)" | `--teal` |
| grid header | `--grid-header-bg` | (nothing) |

⚠️ **`--teal` IS NOT A DS COLOUR.** It has no counterpart in `variables.json`. Inside the
drawer it painted the tab underline, the slider fills and every selected mark — all of which
the DS calls `--primary`. Pointing the token converted them at once. The DS warns twice that
the brand is **navy, not cyan, not blue**.
⚠️ **SF-001 IS FIXED, NOT COPIED.** Both `Atoms/Button` and `Atoms/Radio` list "no visible
focus indicator (WCAG 2.4.7)" as a KNOWN ISSUE — Button's at severity HIGH, with the fix
spelled out. A documented bug is not a spec.

**Declared divergences** (in the code, per the contract): the four **sliders** are not a
catalogued component (`search_components` finds none, and `list_gaps` only declares
charts/topology/widget-grid) — the DS answers would be `obs-input type=number` and
`Atoms/Radio` variant `segmented`; the **Live Preview** touches the `widget-grid` gap;
structural tokens are LESS `@vars` and this file has no LESS step, so `@btn-radius` is a
runtime `--btn-radius`; and the DS `@font-family` is Poppins while this prototype is Inter.

### Apply to — `Atoms/Radio`, variant `list`

⚠️ **THE DS RULED OUT BOTH PREVIOUS BUILDS.** `segmented.dontUse` is explicit — "Don't use
for long labels or vertical form fields (use list)" — which killed the original `.ddseg.lay3`
segmented control; and the **selection cards** that briefly replaced it are not a catalogued
component at all (hard rule 1: a component may not be invented). `usageRules.list`'s own
example is "a mode chooser with per-option descriptions", which is exactly this.
- Plain radio list, no card, no fill. Selection is the dot, as the product does it.
- The dot is **`--primary-color` (#099dd9)**, declared unthemed as the DS records it —
  `segmentedVariants.radio-list-dot` says "cyan … matches product", and `$tokensNote` is
  explicit it is NOT `--primary`.
- It lands on the shape **`.ddradio` already had** 40 lines up, so the drawer's two radio
  lists match by construction.
- ⚠️ `.ddradio input` sets `accent-color` but **not `color-scheme`** — its unchecked radios
  paint bright white in dark theme. Not fixed (out of scope); the new group sets both.

### The Sidebar tab — from the product's Create Role → Navigation

⚠️ **THE DASHBOARDS TAB IS NOW A SIDEBAR TAB** (`Layout | Sidebar (n/m)`), governing
everything in the rail. It briefly lived in its own `#drawer-sidebar`; that is gone —
the rail's own **Sidebar** utility row opens this drawer on this tab, so one surface, two
doors. Reference: build 10.0.0, Settings → User Settings → Role → **Create Role →
Navigation(16/16)**, supplied as a screenshot 27 Aug 2026.

⚠️ **THE MAPPING IS EXACT, WHICH IS WHY THE REFERENCE FITS.** Its checkbox is "does this
appear in the navigation" — our **pin**. Its home mark is "what loads on sign-in" — our
**default**. Nothing had to be invented to adopt the pattern.

| piece | what it is |
|---|---|
| toolbar | search · **Hide all** / **Show all** |
| table | filled header strip (`--grid-header-bg`) · `MENU` · `HOME` · `VISIBLE` |
| rows | the **6 rail entries**, with **Explorer's 10 sub-modules** and **pinned dashboards** indented under their parents as `.sub` |
| ordering | a **drag handle leads every row** — the DS `drag` glyph, verbatim from `observeops-icons/common/actions-edit/drag.svg` |
| preview | a **live clone of `#sidebar`**, beside the table |

- **State**: `RAIL_HIDDEN` (which rail entries are off), `RAIL_HOME` (which module opens on
  sign-in), `RAIL_ORDER` / `MOD_ORDER` / `DASH_PIN_ORDER` (three order records).
  ⚠️ **ALL DECLARED BESIDE `RAIL_PINS` / `DASH_PINS`, IN THAT SAME `<script>` BLOCK.** A
  `let` in a block that has not been parsed yet is not hoisted into the one `init()` runs in
  — that has aborted `init()` five times in this file.
  ⚠️ **THE ORDER RECORDS ARE LISTS OF NAMES, NOT INDICES.** `activeRail` and `MOD_TO_RAIL`
  store indices into `RAIL`, so reordering the array itself would point them at the wrong
  module. `RAIL` and `EXPLORER_TREE` never move.
- ⚠️ **THE PREVIEW IS A CLONE, NOT A DRAWING.** `sbmPreview()` clones `#sidebar`, **strips
  every `id`** (the rail is full of them — `sbBell`, `nbadge`, the `svg id="…Ic"` targets
  `setIco` writes into; a second copy would make `getElementById` return the wrong one), forces
  `.open` and makes it inert. `renderMenu()` has already run when it is reached, so the clone
  carries the pins, group gaps, active row, utility rows and identity row exactly.
- ⚠️ **THE DEFAULT LEADS THE RAIL.** Whatever holds `RAIL_HOME` — or a pinned board holding
  `DASH_DEFAULT` — is lifted to the top of `renderMenu`'s output **and skipped in its usual
  place**, via `railPinsHTML(only)` / `railDashPinsHTML(only)`. It is not duplicated.
- ⚠️ **ONE ANSWER TO "WHAT OPENS ON SIGN-IN".** `RAIL_HOME` (a module) and `DASH_DEFAULT` (a
  board) are separate records because each drives its own surface, but only one thing can
  load — so `sbmHomeTog` / `sbmDashHome` clear each other.
- ⚠️ **THREE THINGS CANNOT STRAND THEMSELVES**: home implies visible (marking a hidden entry
  switches it on; marking a sub-module pins it); hiding the home entry moves home; unpinning
  the module or board holding home moves it. And **the last visible rail entry cannot be
  switched off** — `Hide all` included — because the door to this screen is on the rail.
- ⚠️ **A MOVE STAYS INSIDE ITS OWN SIBLING RUN.** Rail entries move within their `group`
  (`renderMenu` bands the rail wherever `group` changes); modules among modules; boards among
  boards. `sbmSibs` defines the run and **both** the drag and `sbmCanMove` read it, so the
  affordance and the handler cannot disagree — they did once, and a board's arrow was enabled
  while the move was silently refused.
- ⚠️ **`DASH_PIN_ORDER` EXISTS BECAUSE OF THAT BUG.** `dashPinsOrdered` read `DASH_GROUPS`,
  so two pinned boards in different categories could never swap. The catalogue order is
  untouched — `layBoardMove` still owns it for the list panel and the Manage screen. A newly
  pinned board joins in catalogue position, not at the end.
- ⚠️ **KEYBOARD SURVIVES THE DRAG-ONLY LIST.** The handle is focusable and **Alt+↑ / Alt+↓**
  call `sbmMove`, with focus restored after the repaint. Plain arrows are left alone.
- ⚠️ **THE DRAWER IS 660px ON BOTH TABS.** It was 520/660 and resized under you when you
  switched. The parked offset moves with the width (`right:-680px`), or 120px sits on the
  board while closed.
- ⚠️ **`#layPaneS` IS A GRID, AND ITS CHILDREN MUST NOT BE SQUASHED.** `.dr-b` is a flex
  column and `.laypick` is `overflow:hidden`, so an 832px table was **clipped with no
  scrollbar** and its last eight rows were unreachable. It looked like a deliberate cap; it
  was the recorded drawer-body squash.

### The catalogue grid, from the live Roles page

Read off `/settings/users-settings/roles` (build 10.0.0) — the product's Kendo grid, measured:
`th` 12.8px/600 uppercase, letter-spacing .25px, 28px, over 1px `--border-color`; `td` 12px/400,
40px rows, on a **softer** `rgba(23,35,54,.7)`; `.used-count-pill` 22×22, radius 10, padding 0 7px.
- ⚠️ **HEADER AND ROWS SHARE ONE `grid-template-columns`**, so a label cannot drift off the
  column it names. A `<table>` is the wrong tool — `table-layout:fixed` takes widths from the
  first row (already recorded twice) and the rows are `draggable`.
- ⚠️ **THE HEADER'S PADDING IS `.laypl`'s PLUS `.laybr`'s.** Rows sit inside 4px of list
  padding and carry their own; a header padded like a row is 8px wider than the rows it
  labels. Found by comparing the two computed templates, not by eye.
- ⚠️ **AN INDENT IS A WIDER FIRST COLUMN, NOT A MARGIN** — `margin-left` pushed the icon out
  of its 22px cell into the name. Widening the column and taking it back off the name keeps
  the control columns aligned on every row.
- ⚠️ Honest divergence: the live ACTIONS column is **empty until hover**; ours shows
  everything at rest, by request.

### Other things this session changed

- **The Layout drawer's icon is the product's `sliders-horizontal`**, read out of the
  reference's DOM. ⚠️ It is **also** the `.dmanage` (Manage dashboards) row's glyph — the two
  can be on screen together. Unresolved; `sliders` means "adjust these settings", so Manage is
  the one that should move.
- **`.laypick` has no fill** — `--neutral-lightest` is the DS's "subtle fill / skeleton / code
  chip", and a list container is none of those.
- ⚠️ **`.trpop` IS `position:fixed`, placed by `trPlace()`.** `.pagehead` is
  `overflow:hidden` at 44px and was clipping the 330px time-range popover so it never painted.
  Pre-existing in HEAD.
- ⚠️ **THREE INIT-ABORTING `ReferenceError`s WERE FIXED** (`DASH_PINS`, `waiIcon`, and a
  pre-existing `dashState` fault) — they were why the time chip read `Invalid Date NaN:NaN`.
  **Only a fresh load shows this class of bug**; probes run after every block has parsed.

### Verification notes from this pass

- ⚠️ **`harness.py` NEEDS ~80 s TO SETTLE NOW, not the ~20 s it assumes.** Under that it
  reports false failures (`panel present — FAIL missing`) that vary run to run — 7, then 14,
  then 42 — while the page itself is fine. A healthy run has **exactly one** verdict string.
- ⚠️ **Headless `--dump-dom` hangs on the 1.9 MB `behave` probe copy.** Read both verdicts by
  loading `_out/*.html` in a real tab over the local server instead. `harness.py` writes
  `file://` iframe srcs, so those need rewriting to relative paths first.
- ⚠️ **The live instance renders NOTHING under browser automation some of the time** — the
  SPA boots (banner logs, no console errors, session valid) and the app root mounts at full
  height with **zero text content**. It worked earlier the same session. `innerText` is 0 for
  unrendered nodes, so check `textContent` to tell "not painted" from "not there".
- ⚠️ **The live product fades in and automation freezes CSS animations**, so the page reads
  blank. Inject `*{animation:none!important;transition:none!important}` and force
  `opacity:1` to see it.

## The 31 Aug 2026 pass — Agentic AI, and the REAL design system

All three option files. Two things arrived together: a **new Settings category** built from a
supplied reference, and — for the first time in this repo — the **actual `obs-*` web components**
instead of CSS reproductions of them.

⚠️ **Several statements elsewhere in this file are superseded here.** Where they conflict, this
section is current.

### `_ds/` — the design system is vendored now

| file | what |
|---|---|
| `_ds/observeops-elements.umd.js` | `@mtdt/observeops-ds-elements` **v0.1.166**, the UMD build, verbatim — registers the 47 `obs-*` custom elements |
| `_ds/observeops-ds.css` | `@mtdt/observeops-ds-css` **v0.1.6** — **NOT linked by any page**; it is the source the scoped token block is generated from |
| `_ds/README.md` | provenance, how to regenerate, the known gaps |

Both are public on npm (`npm install @mtdt/observeops-ds-elements @mtdt/observeops-ds-css`). A
plain `<script src>` works over `file://` **and** on Pages, so the prototypes still open with no
build step. ⚠️ `_ds/` is **not** gitignored — it must ship for the live site.

⚠️ **THE CSS PACKAGE IS DELIBERATELY NOT LINKED.** It declares its LIGHT values on `:root` and
dark under `[data-theme='dark-theme']` — this prototype is the other way round. Linking it would
put the whole page in the DS's light theme while the prototype sits in dark, and leak ~390 tokens
onto the dashboard and Log Explorer. Each option re-emits the same values **scoped to
`#agPage,#agWiz`**, against this file's convention. Custom properties inherit into shadow DOM, so
scoping costs the components nothing.

⚠️ **REGENERATING THAT TOKEN BLOCK NEEDS A QUOTE- AND PAREN-AWARE SPLITTER.** A naive
`split(';')` corrupts the sheet: `--graph-bg` is a `url('data:image/svg+xml;…')` whose value
carries its own `;`, which leaves an unterminated string and **silently drops every rule after
the token block**. The symptom was a page with correct colours and no layout at all, and a brace
scan said "balanced".

### Settings › Agentic AI — the 19th category

`ST_TREE` gained **`Agentic AI`** (icon `sparkling-star`), the one category **not** on the
instance — everything above it is the harvested live list in live order, so it is appended rather
than slotted in. Its one page is **Overview**, served by the `ag*` block through `ST_PAGES`.
⚠️ A category cannot carry zero pages — `stOpen()` and `stStubHTML()` both dereference `subs[0]`.
⚠️ `ST_ICO` gained a hand-added `sparkling-star`; a re-harvest of the live list drops it.

Built from `~/Downloads/Motadata Agentic AI (1) (1).html` — a bundled React prototype whose real
source is a `__bundler/template` blob (decode it; don't guess from screenshots). It ships **one**
routed screen plus a 4-step wizard; its Data-&-privacy / Governance / Usage screens exist in its
source but are not routed, so they are not built here either.

**Overview** is the `list-view` recipe: `obs-page-header` (mark + title + status tag + an inline
doc link, no rule under it) → `obs-toolbar` (label + the one primary) → `obs-table` (Provider ·
Description · Status · action button, Documentation in the row ⋯). **The setup flow is an
`obs-drawer`** at 62%, `scrolled-content="false"`, with an `obs-steps` rail.

⚠️ **THE ONLY NON-DS PARTS ARE THE KPI TILES AND THE THREE TREND CHARTS**, and they are a
declared `list_gaps` gap ("charts / stat tiles … standalone → STOP AND ASK"). Series colours are
tokens, never `--primary`.

### ⚠️ Six defects in `obs-*` v0.1.166, all worked around and all worth reporting

1. **`obs-drawer` never emits its documented `close` event.** Its ✕ takes the inner `<dialog>` to
   `open=false`, leaves the host prop at `true`, and dispatches nothing. The native `close` does
   not fire either, because it drops the ATTRIBUTE rather than calling `dlg.close()`. Watched
   with a MutationObserver on that attribute — the one signal every close path shares.
2. **`<obs-drawer open>` in markup does nothing.** It calls `showModal()` from a *watcher*, so it
   needs a real false→true change. Setting `el.open = true` synchronously in `after()` also fails
   — the element has not upgraded. A `setTimeout(…, 0)` works; **rAF is starved** under headless.
3. **`obs-input` ignores `prefix-icon` / `suffix-icon`** — documented, read by its source, and
   its shadow root renders zero icons. Cost the password-reveal toggle.
4. **`obs-radio` renders a label and nothing else** — no per-option `description` (its own
   registry advertises one) and it ESCAPES the label.
5. **`obs-radio` / `obs-checkbox` render `<label>`s, not native `<input>`s**, despite the radio
   registry claiming "native input type=radio grouped by name".
6. **`obs-steps` exposes no `::part()`**, so the reference's active-row band is unreachable.

Plus one integration trap: **this file's tooltip engine ate the drawer's header.** `tipFor()`
adopts any `title=` into `data-tip` **and deletes the attribute**, so the title vanished and
reappeared as a floating tooltip. Use the `title` **slot**.

⚠️ **CUSTOM EVENTS NEED `addEventListener`.** An inline `on<name>=` content attribute only works
for events the HTML spec lists as handlers. `oncellaction` / `onrowaction` / `onclose` are inert
markup. This shipped green because the probe called the handler directly.

### ⚠️ A REPAINT MUST NOT ADD OR REMOVE A NODE THE DRAWER HAS SLOTTED

Three versions, each less wrong:

1. `stMainPaint()` — rewrote `#stMain.innerHTML`, **destroying** the `<obs-drawer>`; the new one
   replayed its open animation. The panel visibly closed and reopened on every Continue.
2. replacing `#agWiz` with `outerHTML` — kept the drawer, but `#agWiz` is a **slotted child**, so
   the swap fired `slotchange` (measured: 1 per repaint) and re-rendered the component. **The
   dialog's `open` never changed, which is exactly why the probes passed while it still flashed.**
3. **inner content only** — `.agbody`'s markup, the stepper's `active` **attribute**, the
   footer's contents. Measured `slotChanges=0`.

Related, same session: the MutationObserver guard **`if (!dlg.isConnected) return;`** is
load-bearing. Without it a teardown looked like a user close and cleared `AG.wz`, so **Continue
closed the wizard instead of advancing** — and only a REAL CLICK showed it.

### Two changes outside the Agentic AI block

- **`.stnav` has a right border** — the Settings category list and the page sat edge to edge on
  one white surface, so the list's boundary was only implied by where its rows stopped. Dropped
  when `stshut` collapses it.
- **Pinned modules anchor to `Setting`, not to a group boundary** (Option 1 only — Options 2/3
  have no `RAIL_PINS`). It keyed off `PIN_AFTER='analyse'`; in the shipped order that lands in
  the same place, but the Sidebar tab lets you reorder and hide rail entries, and then the group
  change fires elsewhere or never and the pins fall below Setting. Now `PIN_BEFORE='admin'` and
  the anchor is the first visible admin row.
  ⚠️ **SUPERSEDED 1 Sep 2026 — the anchor is now `PIN_UNDER = 'Explorer'`** (request: *"when i
  pin in the explorer sub module it will be show in explorer between report"*). Both earlier
  anchors put the band AFTER `Report`, because Explorer and Report share the `analyse` group —
  so Monitor and Topology rendered under Report and read as if they belonged to it. The band is
  now emitted **immediately after the Explorer row**, which is exact rather than conventional:
  `railPinRow()` resolves every pin against `EXPLORER_TREE`, so `RAIL_PINS` is Explorer's
  children by construction. The dash-pins comment had claimed "module pins get theirs further
  down, UNDER EXPLORER" the whole time; the anchor never did it.
  ⚠️ **PINNED DASHBOARDS HAD THE SAME BUG AND WERE FIXED WITH THEM** (request, 1 Sep 2026:
  *"when i pin the dashboard it is explorer sub module so it will be show properly"*). They
  were anchored to `DASH_AFTER='work'` — the GROUP — and Dashboard, Alert and SLO all live in
  `work`, so a pinned board rendered after **SLO**, two rows below the Dashboard it belonged
  to. The comment above them had asserted they "sit under the Dashboard row they belong to";
  they did not.
  ⚠️ **BOTH BANDS NOW GO THROUGH ONE `pinsFor(name)` HELPER** — "a pin sits directly under the
  rail row it belongs to", stated once and called from the two places a row is emitted (the
  home lift and the loop), so the two kinds cannot drift apart again. It is idempotent via
  `pinsOut` / `dashOut`, which is what lets the same call sit on both paths.
  ⚠️ **`pinsFor` MUST BE DECLARED ABOVE THE HOME-LIFT BLOCK.** It is a `const` arrow, so using
  it from the lift block while it is declared below is a TDZ `ReferenceError` that aborts
  `init()` — the trap this file's own notes say has bitten five times. Caught before it
  shipped, but only because the declaration was moved on purpose.
  ⚠️ **`DASH_AFTER` was deleted, not left behind** — the group boundary it named is no longer
  an anchor, and a live const naming a dead rule is how the last two anchors stayed wrong.
- **The flyout's documentation footer is MODULE-WISE** (request, 2 Sep 2026: *"the
  documentation link will be show as module wise"*). Hovering `Monitor` in Explorer's menu
  filled the detail pane with monitor types under a footer that still read *"Explorer
  documentation"* — the only link on screen, pointing at the wrong section. Each of
  Explorer's ten sub-modules now carries a `doc:` on its `EXPLORER_TREE` row, and
  `mfDocsPaint()` retitles the footer as the pane changes.
  ⚠️ **EVERY PATH CAME OUT OF `_product-docs/urls.txt`** — the product's own harvested sitemap
  — **and was `curl`-verified 200**. The slugs do not match the module names
  (`log-management`, `audit-trail`, `flow-analysis`, `trap-management`,
  `network-configuration-and-compliance-management`), which is exactly why a guessed one is a
  404 nobody notices. Look them up; never hand-write one.
  ⚠️ **`mfSubIdx` WAS THE WRONG STATE TO KEY OFF, and it half-worked — which is how it nearly
  shipped.** It means "which row's DETAIL PANE is open" and is deliberately `-1` for a row
  with no children. Only `Monitor` and `NCCM` have children, so those two retitled correctly
  and the other eight silently fell back to "Explorer documentation". The footer needs "which
  row is the pointer ON", so `mfRowIdx` was added beside it and set on every hover.
  ⚠️ Not named `mfHoverIdx` — that already exists 90 lines up and is the RAIL's hovered entry.
  ⚠️ **It falls back, it never vanishes**: a row with no `doc`, a closed pane, or a menu with
  no master column at all gets the module's own `MOD_DOCS` entry. `mfDocs`'s `if (!p) return ''`
  would otherwise delete the menu's only documentation link on hover.
  ⚠️ **The footer is patched in place, not re-rendered** — it is a sibling of `.mfcols`, so
  repainting the flyout on hover would destroy the master column the pointer is inside.
- **A pinned BOARD and a pinned SUB-MODULE are ONE ROW SHAPE, told apart by their icon**
  (two requests, 2 Sep 2026). They had rendered identically — same row, same weight, same teal
  pin, and, worse, the SAME `ico('dashboard')` glyph as the Dashboard row above them, so the
  band read as three identical grids stacked and a board was indistinguishable from a
  sub-module.
  ⚠️ **THE FIRST ANSWER DEMOTED BOARDS AND WAS REVERSED THE SAME DAY.** It added a
  `.sidebar.open` indent, a 12.4px label and `--text-dim`, on the rule "the rail lists MODULES,
  so a board is content and reads one level down". That made them distinguishable but made a
  user's own pinned board look like a *lesser* row than a module they pinned — which is not the
  relationship; both are things the user chose to put on the rail. The follow-up ("the pinned …
  sub / dashboard module will be shown like [this]", with a screenshot of the module-pin band)
  asked for one shape. **Do not re-add the indent/dim without re-reading both requests.**
  ⚠️ **What survived is the part that was doing the work** — the per-board type icon. It is also
  the only half that works in the COLLAPSED rail, where labels are hidden and an indent cannot
  be shown at all.
  ⚠️ **The board's icon is now `MICON[t]` — its own System / Mine / Shared mark from the list
  panel** — not a second `ico('dashboard')`. Every pinned board wore the SAME glyph as the
  Dashboard row above it, so the band rendered as three identical grids stacked; that repeated
  icon was the main reason the two bands blurred. `MICON` entries are raw `<svg viewBox=…>`
  with no class, so `class="ic"` has to be injected or the glyph renders at natural size and
  blows the row height apart.
  ⚠️ **The pin mark is NOT changed on either.** Both are pinned, and that is the one thing they
  genuinely share. This reverses the older "the two bands read as the same idea" note only in
  part: they are still one FEATURE, which the shared pin says — that was never a reason to make
  a document look like a module.
  ⚠️ **`DASH_INDEX`, `MICON` and `DTYPE` LIVE IN THE NEXT `<script>` BLOCK** while `init()` runs
  at the end of the current one, so all three are in TDZ at that moment. It is safe only
  because `DASH_PINS` is `[]` then, so the function is never reached — seed it with a default
  and `init()` would abort, the failure this file's notes record five times. A `try/catch` now
  makes that structural. ⚠️ **`typeof X !== 'undefined'` is NOT a usable guard**: on a
  `let`/`const` in TDZ, `typeof` itself throws. `railPinRow` gets away with it only because
  `EXPLORER_TREE` is in the same block.
- **The pinned row's mark is a PIN, not a dot** (request, 2 Sep 2026: *"it will be improve to
  show pin icon and it will be show batter view"*). It was a 5px teal disc, which says "this
  row is special" without saying why — while the flyout two centimetres away was already
  drawing a real pin for the same fact. The rail now renders **`MF_PIN`**, read from the const
  rather than pasted; `LAY_BIC.pin` already derived from it for the Sidebar tab, so all three
  surfaces are one definition and cannot drift.
  ⚠️ **FILLED**, per the flyout's own `filled = pinned` rule. On the rail every row in the band
  IS pinned, so there is no hollow state to contrast with — a hollow pin here would read as the
  *unpinned* half of the flyout's pair.
  ⚠️ **RIGHT-ALIGNED, which is the "better view" half** — the marks form a column at the rail's
  edge instead of trailing variable-length labels at a ragged edge. That needs **`flex:1` on
  `.sitem.pin .lbl`**: without it the label shrinks to its text and `margin-left:auto` has no
  free space to push into. A long board name still ellipsises rather than shoving the pin out.
  ⚠️ **`.sitem.pin.dash .lbl .pd{background:…}` was removed.** It forced the dot teal so the two
  bands read as one idea; that is free now they share a glyph — and `background` was the wrong
  property for an icon anyway (it would paint a teal square behind the pin).
  ⚠️ **The mark is invisible on the COLLAPSED 64px rail**, because `.lbl` is `opacity:0` there.
  Unchanged from the dot, and there is no room for it beside a 20px icon — noted so it is not
  mistaken for a regression.
  ⚠️ **The band lost its own hairlines with the move.** They existed because it sat between two
  groups and belonged to neither; under its parent that inverts — a rule between Explorer and
  its own pins would deny the relationship the placement exists to show.
  ⚠️ **Two guards, both tested**: if Explorer is the row lifted to the top as `RAIL_HOME` the
  loop skips it, so the lift block emits the band itself (otherwise the pins land at the BOTTOM
  exactly when their parent is at the top); if Explorer is hidden there is no row to sit under
  and the tail fallback takes it. Verified with a probe covering the shipped order, Explorer as
  home, Explorer hidden and a reordered rail.

### ⚠️ Verifying this — a green probe is not a working feature, three times over

This session shipped three bugs behind passing probes. All three were only visible to a **real
click**. The suite that catches them is `walk-*.html` in the session scratch dir: **39 assertions,
every one a hit-tested pointer click on the element a user would hit, found by piercing shadow
roots.** Nothing calls a handler directly.

Things it needs to work at all:
- ⚠️ **The drawer's slide transition never completes under virtual time**, so nothing inside it
  is hit-testable until you park it (`dlg.style.transform='none'`). Without that the whole
  interior had never been tested.
- ⚠️ **`elementFromPoint` retargets to the host** — pierce `shadowRoot.elementFromPoint` in a
  loop to find the node a pointer would really hit.
- ⚠️ **Do not inject `animation:none`** on a page with `obs-drawer` — the panel parks off-screen
  and reads as "the drawer did not render".
- ⚠️ **Regenerate the probe copy after every edit.** Patching the test script inside a stale
  snapshot reported a fixed bug as still broken.

Suites at the end of the session: click walk **39/39 ×3** · state probe **42/42 ×3** ·
pin placement **9/9** · `lxbehave` 57/57 ×3 · `behave` 63/63 · `harness` 77/77.

## The 1 Sep 2026 pass — Agentic AI cleared and rebuilt from the reference

The Agentic AI screen was **deleted on request** ("clear all screen, today i want to create
new") and rebuilt from scratch, one supplied reference at a time, on the real `obs-*`
elements. ⚠️ Where this section conflicts with *"The 31 Aug 2026 pass"*, this one is current.

⚠️ **SUPERSEDED 12 Sep 2026 — IT IS IN ONE PLACE NOW.** Every option reads it from
`setting.js`; a change below is a ONE-file change. This paragraph used to
read *"it is in four places now, in two shapes"* and warned that **Option 4 was copied
mid-session and was BEHIND** — it had `.aggrid` and the wizard but not the help card, the
per-provider icons, the usage `obs-table`, `agSeed` or the three-provider rows. That drift is
gone: Options 2, 3 and 4 dropped their own copies and took the shared one, which is also how
they gained the **License** page they never had. Kept as the record of what the divergence was,
because the screenshots in this file predate the merge.

### What the screen is

| part | built from |
|---|---|
| header | `obs-page-header` — `heading`, the `title` slot for the status tag, the `before` slot for the mark, and the description as a sibling `<p>` carrying an inline doc link |
| toolbar | `obs-toolbar` — search in `start`, one primary **Configure AI provider** |
| Usage & health | `obs-table` listing **all three providers**; the connected one carries the figures, the others an em dash. **`expandable`** opens the row: three trend widgets in one 3-track grid for the connected one, an explanation for the others |
| Configure | `stFullOpen` full page — `obs-side-menu mode="categories"` rail of the three providers, the flow in the middle, a **Help Card** column on the right |
| the flow | `obs-steps` (Credentials · Model selection · Data consent) → the reference's four staged connection tests → model radio + per-task routing over the seven AI tasks → four consent terms → a summary |

### Undocumented `obs-*` capabilities found by reading the bundle

Neither is in the component registry or `search_components`; both are worth reporting upstream.

- ⚠️ **`obs-table` has `expandable`** — it renders an `exp-col` chevron per row, and an opened
  row becomes `<tr class="row-detail">` whose cell is filled from
  `innerHTML: row.detail || "No detail"`, spanning every column. **This is what the usage grid
  is built on.** A row with no `detail` opens onto that literal fallback, so every row needs one.
- ⚠️ **`obs-table` has a `sparkline` cell type** (an 80×18 polyline from a row array). Unused
  so far, but it is the way to put a mini-trend in a row.

### ⚠️ `obs-button` fires a consumer's `onclick` TWICE — the session's worst defect

A pointer click targets the component's inner `<button>` in its shadow root; that event is
`composed`, so it crosses the boundary and runs the host's `onclick` — and the component
**also** re-emits on the host. Measured: `inner.click()` → 2, `host.click()` → 1.

It is invisible while every handler is idempotent, which is how it survived several green
probe runs. The first non-idempotent handler exposed it instantly: **Advanced settings is a
toggle, so it flipped twice and the panel never opened — a dead control every automated check
called working.** Every `obs-button` `onclick` in the `ag*` block goes through **`agTap`**, a
same-handler/60ms guard. `onchange` is unaffected (checkbox / switch / radio / select each
fire once — measured).

⚠️ **Any automated check of an `obs-button` must click `el.shadowRoot.querySelector('button')`,
not the host**, or it tests something a user never does.

### Other shipped-element limits hit here

- **`obs-input` cannot show an icon in the field at all** — neither `prefix-icon`/`suffix-icon`
  nor the `prefix`/`suffix` slots (its shadow root contains **no `<slot>` of any name**). So the
  toolbar search has no magnifier and the API key has no eye toggle. Recorded in `_ds/README.md`.
- **`obs-radio` takes only `{value,label}` and escapes the label**, so the model cards fold
  their note and context window into the label text.
- **`obs-page-header` exposes no `::part`** and no size hook — its title is fixed at 16px/500.
  `--page-header-padding` is the only lever, and it sets all four sides.
- **`obs-steps` exposes no `::part`** either.
- **`no-divider` makes the header's rule TRANSPARENT, not zero-width** — assert on the painted
  colour, not `borderBottomWidth`.

### Token collisions — check a token against the surface it lands on

Two of these bit in one session, both invisible in one theme only:

- ⚠️ **`--code-tag-background-color` (a selected side-menu row) and `--nav-hover-bg` are the
  SAME `#ecf1f9` in LIGHT.** `sections` mode hides it with a `--primary` left rule; `categories`
  mode has none, so a hovered row was indistinguishable from the selected one. Fixed by pointing
  the active token at `--neutral-lighter` **in the light block only** — in dark the two already
  differ, and `--neutral-lighter` would create the identical collision there.
- ⚠️ **`--common-widget-bg` and `--neutral-lightest` are the SAME `#172336` in DARK.** A widget
  card on the table's detail band had no surface at all. `--page-background-color` differs from
  the band in both themes.

### The detail row is inside the shadow root

Anything `obs-table` inner-HTMLs into `tr.row-detail` is in **its** shadow tree, so the page
stylesheet cannot reach it. That markup is styled **inline** with `var(--token)` values, which
*do* inherit across the boundary — the one place inline styles are correct on this screen. The
charts carry their height inline for the same reason; without it they stretched unbounded.

### `_verify/dsconf.py` — and the scores it invalidated

A new harness that isolates `#agPage` and runs the DS conformance checker
(`@mtdt/observeops-ds-spec`) over it, with `_verify/ds-gaps.json` declaring the chart gap.

⚠️ **Every score it printed before it was fixed was measuring a page where no `obs-*` element
had loaded.** It wrote its copy into `_verify/_out/`, so `_ds/observeops-elements.umd.js` (and
later `_settings-module.*`) 404'd — `obs-table defined: false`. It still reported **100/100**,
because the checker counts `obs-*` *tags* as DS components and finds few off-token colours on
a page that barely paints. **The same bug was in `behave.py`, `shoot.py`, `harness.py` and
`lxbehave.py`**, found independently the same day. They inject a `<base>`; `dsconf.py` instead
builds beside the source as `_dsconf-*.html` and deletes it afterwards — two fixes, one cause.

Current real scores: **Overview 100/100 · Configure 89/100** (component 42–63, from the Help
Card's raw disclosure buttons — the DS ships no accordion; 52 registered elements, checked).

### Conventions this screen now follows

- The DS ships **no provider logo** — `resolve_logo('openai')` answers *"Do NOT hand-draw a
  brand mark"*. The rail's per-provider icons (`eye` / `book-open` / `thunder-bolt`) are read
  from each provider's own tagline and live on the record as `ic`.
- **Charts are the one declared `list_gaps` gap** and carry `class="agchart"`, which is
  load-bearing: the checker derives the archetype from the class, and unclassed they fall back
  to a generic `graphic` that `--declare chart` does not cover.
- **Series colours are tokens, never `--primary`** — a chart in the brand navy would say
  "primary action" in a shape you cannot press.
- Spacing is on the DS structural scale (`@padding-lg` 24 · `@padding-md` 16 · `@padding-sm` 12
  · `@padding-xs` 8). Eyeballed values scored `layout 38` once.

### The configure screen's alignment — the footer and the per-task rows

Two reports (images, 1 Sep 2026: *"make proper alignment"*, *"it will be show in proper
alignment"*). Both were **layout defects that only appear at certain heights**, which is why
they read as "sometimes fine".

- ⚠️ **THE FOOTER WAS UNDER THE VARIANT SWITCHER.** `.vs-switch` is `position:fixed;
  left:50%; bottom:18px` and 33px tall, so it owns the bottom ~51px of the viewport **at
  screen centre** — exactly where `Continue` sits. Measured before the fix: `footer
  334..1054 y 712..763` against `pill 749..851 y 756..789`, i.e. **103×7px of overlap with
  Continue covered**. The pill is not dev-only chrome — `_variants.js` ships and loads on
  every page, Pages included — so this is a real collision, not a test artefact.
  The fix is 56px of `padding-bottom` on `.agcfgm`, which clears the pill's 51px.
- ⚠️ **`padding-bottom` ONLY WORKS IF THE FOOTER IS PINNED TO THE CONTAINER.** Space *below*
  a content-positioned footer cannot move it up. Option 1 was already a flex column whose
  body took the slack, so the padding moved it; **Option 4 was not**, and the same edit
  changed nothing there. It needed the structure as well:
  `.agcfgm` a flex column, `.agform{flex:1 1 auto;min-height:0}` also a column, and the step
  body wrapped in a new **`.agfbody{flex:1 1 auto;min-height:0}`**.
  ⚠️ **The body flexes; the footer keeps its own `margin-top`.** Deliberately NOT
  `margin-top:auto` on `.agff` — that resolves to 0 when there is no free space and so cannot
  also carry the minimum gap (the recorded `.aihelpl` trap). Letting the body absorb the
  slack keeps the 24px in `.agff` a real floor.
- ⚠️ **`.agcfg{flex:0 0 auto}` WAS THE ACTUAL CAUSE IN OPTION 4**, and it survived two
  earlier fixes. At `0 0 auto` the screen took its natural **806px** inside a **763px**
  `.stmain` scroller, so the footer landed at `y759..810` — past the 807px viewport bottom
  *and* under the pill. Option 1 had `flex:1 1 auto;min-height:520px` all along. Both are on
  that now, and the footers agree to the pixel (`y680..731` in both).
- ⚠️ **THE SELECT OVERFLOW WAS NOT REPRODUCIBLE, AND WAS STILL FIXED.** The report showed the
  per-task model dropdown past the panel edge; measured, it sat at **-1px** (inside) at both
  1440px and 1800px, in Options 1 and 4. The rule was nevertheless wrong: `.agrt .n` is a
  flex item, so its default **`min-width:auto`** means the label cannot shrink below its
  text and pushes the `flex:0 0 200px` select out — it just needs a longer model name or a
  narrower panel to show. `min-width:0;flex:0 1 auto;overflow:hidden;white-space:nowrap`
  makes the **label** take the deficit, which is the half that can be truncated.
  Fixing an unreproducible report is right *when the mechanism is real* — say which it was.
- Verified across **all four steps × four options × 1600×950 and 1366×768**: the footer
  clears the pill, stays inside the viewport, and nothing overflows the screen's right edge.

### The 2 Sep 2026 pass — two bugs that DOM measurement could not see

Both were reported as "alignment", both were verified "fixed" by a passing probe first, and
both were only found by looking at **what is painted**. They are the same lesson twice: a
`getBoundingClientRect()` / property read is not evidence about the screen.

- ⚠️ **`obs-select` IGNORES A HOST NARROWER THAN 240px AND PAINTS OUTSIDE ITS OWN BOX.** Its
  shadow root's `.sel` div is hardcoded to 240px. `.agrt obs-select` asked for 200px, so:

      host  x 837..1037  w=200   ← what getBoundingClientRect() reports
      .sel  x 837..1077  w=240   ← what is actually drawn

  The control hung 23px past the panel's own border, on all seven routing rows. **Every DOM
  assertion passed** — the host box really is 200px and really is inside the panel. It was
  found by counting pixels in the screenshot: seven 30px runs of border colour at x=1076, one
  per row, beyond the panel's 1054 edge. The host is 240px now and box and paint agree exactly
  (probe prints `host 1037 · shadow .sel 1037 · panel content edge 1037`). A **seventh**
  v0.1.166 defect — recorded in `_ds/README.md`.
  ⚠️ To test a web component's geometry, measure **its shadow root's own box**, not the host.
- ⚠️ **`[hidden]` LOSES TO ANY AUTHOR `display` RULE, so `stHeadPaint` HAD NEVER HIDDEN
  ANYTHING.** `.stpt{display:grid}` is (0,1,0) and beats the UA stylesheet's
  `[hidden]{display:none}`, so `i.hidden = true` set the attribute and changed no paint: the
  head's **(i)** kept its 34px box and stayed hit-testable on every settings page with no help
  pane. Latent since the module was built. `.stpt[hidden]{display:none}` fixes it.
  ⚠️ A probe asserting `el.hidden` **passed on a button that was plainly still on screen.**
  The property was true; that was never the question. The check that works is a hit test —
  `document.elementFromPoint(centre)` and walk up to see whether you land on the element.

### The `(i)` help toggle was removed from Configure AI provider (2 Sep 2026)

Request: *"remove"*, pointing at the head's circular (i). It came from `stFullOpen`'s **`info`
key**, and `stHeadPaint` hides `#stHeadInfo` whenever that key is absent — so dropping the key
is the entire change and there is no markup to delete. (It only actually hid once the
`[hidden]` bug above was fixed; the two are one change.)

- ⚠️ **CONSEQUENCE, stated rather than acted on:** that button was the Help Card's only
  control, so the card is now permanently shown with nothing to hide it. `agHelpShowTog` and
  the `.agcfg.nohelp` CSS are **kept and unreferenced** (the house pattern), so the toggle is
  one key away.
- ⚠️ **Option 4 needed no edit** — it never had the Help Card, so its `stFullOpen` call already
  carried no `info`. That is the same "Option 4 is behind" divergence recorded above.

### The consent and done steps, rebuilt on the DS (2 Sep 2026)

Requests: *"improve Using the ObserveOps design system"* on the Data-consent step, and the same
on the Done step.

- **Consent was two equal halves and one of them was empty.** `.agrow2` put *Data that may be
  transmitted* (seven chips, wrapping to two rows) beside *<provider> privacy policy* (a title
  and a single link) — equal widths, equal heights, so the right card was mostly dead space
  while the left one was cramped. It is **one full-width panel** now: the chips fit on a single
  row, and the privacy link is demoted to a hairline footer row (**`.agpf`**, grepped free
  before naming). The four checkboxes get a titled panel of their own — *Confirm to continue* —
  rather than sitting in an unlabelled box. Nothing was invented: every fact that was on the
  screen is still on it. ⚠️ `.agrow2` is still used **twice** by the credentials step; it was
  not deleted.
- **The done step's summary sits in `.agpanel`**, so it reads as a summary card instead of five
  loose rows floating under a centred heading.
- ⚠️ **The footer's KMS caption was rendering on ALL FOUR STEPS**, so *"Keys are encrypted with
  the deployment KMS · never sent to the browser"* sat under **Setup completed successfully** —
  a sentence about a field two steps back, on a screen with no field on it. It is the
  credentials step's only now. The empty `<span class="sp">` stays: `.agff .sp{margin-right:auto}`
  is what pushes Back/Continue to the right edge, and dropping the span slides them left.
### The footer spans the pane, not the form (2 Sep 2026)

Request: *"the line is full and the button will be show on helpcard devider line after"*. The
footer's rule stopped at **720px** — `.agform`'s `max-width` — while the pane runs on to the
help card, so the action bar looked like it belonged to the fields rather than to the screen.

- **`agFlowFootHTML()` moved OUT of `.agform`** and is now a sibling of it inside `.agcfgm`.
  720px is a readable measure for FIELDS; the footer is the screen's action bar. `.agcfgm` is
  the flex column, `.agform` keeps `flex:1 1 auto` and takes the slack, `.agff` sits at the
  bottom — so the "footer clears the variant pill" fix above is preserved by construction.
- ⚠️ **The 24px gap is `padding-right`, NOT `margin-right`, and that is the whole trick.** The
  rule IS `.agff`'s `border-top`, which spans the padding box — so the line runs the full width
  to the help card's own divider while the button stops 24px short of it and keeps the breathing
  room every other control has. A right margin would shorten the line by that same 24px, which
  is the thing the request asked to fix.

### The footer's buttons were NEVER right-aligned (2 Sep 2026)

Found while verifying the change above, and it is the other half of the same request. The rule
now reached the help-card divider but the button stopped **323px short of it**.

- ⚠️ **AN INLINE `style="margin:0"` WAS CANCELLING `.agff .sp{margin-right:auto}`.** The KMS
  caption IS the `.sp` spacer, and an inline declaration beats a stylesheet rule — so the auto
  margin never applied and the buttons sat immediately after the caption text, wherever that
  happened to end. The inline style existed only to cancel `.agtn`'s own `margin-top:12px`.
  Doing that in the sheet instead (`.agff .agtn{margin-top:0}`) cancels the top margin and
  leaves the auto margin alive.
- ⚠️ **It had been wrong for the whole life of this footer** and was invisible while the footer
  was only 720px wide — the button looked roughly right-ish because there was little room to be
  wrong in. Widening the footer to the pane is what exposed it.
- ⚠️ **The steps that show no caption were never affected**: they emit `<span class="sp"></span>`
  with no inline style, so those buttons had always been pushed right. Only step 0 was broken,
  which is why it read as a one-screen quirk rather than a rule that did nothing.

### The consent step's banner and its silent gate (2 Sep 2026)

Request: *"Using the ObserveOps design system"* on the Data-consent step.

- ⚠️ **THE BANNER SAID THE SAME THING TWICE.** `obs-banner`'s own `do` rule is "keep the message
  short; put a lead-in in `title` and the detail in the slot" — but the title read *"AI features
  transmit observability data to a third party"* and the body opened *"When AI features are used,
  selected observability data may be transmitted to `<provider>` for processing"*. The body now
  carries only the part the title cannot say. Variant stays **warning**: the registry defines it
  as "a non-blocking caution the user should read before acting", which is what this is.
- ⚠️ **THE GATE WAS SILENT.** `agFlowFootHTML` disables *Accept & enable AI* until
  `consent.every(Boolean)` and nothing on screen said so — a disabled primary with no reason
  beside it is the dead end the Designer's Guide forbids. `agConsText()` / `agConsPaint()` report
  it live: *"2 of 4 accepted — all are required…"* → *"All 4 accepted — you can enable AI features."*
  ⚠️ `agConsPaint` writes ONE NODE'S `textContent` and never repaints the pane — the same
  discipline as `agCfgFootPaint`, and for the same reason: a repaint destroys all four
  `obs-checkbox`es and throws away the focus of the one just clicked. There is a probe assertion
  that four checkboxes still exist after two ticks.
- ⚠️ **NEITHER NOTE MAY BE WRITTEN AS AN HTML COMMENT INSIDE THE TEMPLATE.** Both carry backticks
  around code names, and **a backtick inside a template literal ENDS it** — `node --check`
  reported `Unexpected token 'do'` hundreds of characters from the real cause. Prose about this
  file's code goes in a JS comment, outside the string. Same hazard as the 218 backticks that
  keep the extracted CSS a `.css` file rather than a JS string.

### The Test-connection block, rebuilt on the DS (2 Sep 2026)

Request: *"improve this on Using the ObserveOps design system"*.

- ⚠️ **THE OUTCOME IS AN `obs-banner`, THE HINT IS NOT.** The result was a fifth row in exactly
  the shape of the four stage rows above it — same tick, same size, differing only in text
  colour — so the one line carrying the ANSWER read as one more step. It is
  `obs-banner variant="success"` now, which the registry defines as "a positive inline
  confirmation that should persist on the surface". The **idle** line stays plain muted text
  deliberately: it is a form HINT, not a state, and its own `usageRules.info` covers a hint
  while a tinted block before you have done anything is heavier than what it says.
- ⚠️ **THE PANEL TITLE AND THE BUTTON BOTH SAID "Test connection".** The button now names what
  pressing it does *now* — **Run test → Testing… → Run again** — and the header carries an
  `obs-tag` of the state: **Not tested / Testing / Verified**. So the repetition is gone and the
  header gained the one thing it was missing, which is whether the test has been run at all.
  ⚠️ The tag uses `variant="tag-green"` etc. — the **class names**, which is what this web
  component's `variant` enum takes. The registry's F2 warns the colour *prop* (`variant="success"`)
  is broken and illegible; `tag-*` is the working mechanism.
- ⚠️ **THE RUNNING STAGE IS MARKED (`.agstg.now`).** Every not-yet-done stage drew the same
  empty ring, so while the test ran you could not tell which one was in flight from the two that
  had not started — four lines that said "something is happening" and nothing more.
  ⚠️ Its mark is **neutral chrome on purpose**: green already means done here, and
  `--primary-color` is the DS's Ant-form-control cyan (its own token note says "Ant form
  controls only"), which would be off-purpose on a progress indicator. It is `--neutral-light`
  with an opacity pulse, and `prefers-reduced-motion` stops it.

- ⚠️ **The per-task panel had a 7px LEFT STAGGER.** The header icon is 17px on `.agphl`'s 12px
  gap (title at +29); the row icons were 14px on an 8px gap (labels at +22) — repeated down
  seven rows, which is what reads as "not aligned". Both icons now sit in a fixed 17px slot on
  the same 12px gap, so each glyph keeps its own size and only the TEXT is brought into line.
  Measured after: icons share a left edge at 351, header title and all seven labels at 380.

## The 2 Sep 2026 (later) pass — the flyout rebuilt, and the sidebar measured end to end

All **Option 1** (`index.html` + `_settings-module.*`), driven request by request against
supplied screenshots. ⚠️ Where this conflicts with the 2 Sep entries above, this is current.

**The method mattered more than usual here: two of the reported "bugs" were not bugs, and only
measuring found that out.** The routing labels reported as clipped were not (`scrollWidth ==
clientWidth` on all seven — the ragged last letters were JPEG artifacts), and the config form's
horizontal alignment was already perfect (every block at x=334, right 1054). Both reports were
real, but the *cause* was somewhere else.

### The Configure-AI-provider form has ONE vertical rhythm

Measured before touching it — five different values doing one job, and two of them zero:

    4 heading->helper · 16 helper->fields · 16 fields->Advanced · **0** ->"Model selection"
    17 label->radios  · **79** radios->panel · **0** ->"Review data sharing" · 12 ->banner

- ⚠️ **THE TWO ZEROS WERE THE WHOLE COMPLAINT.** `.agcfgh` is `margin:0 0 4px` — no top margin —
  so once the wizard was flattened into one page each section heading opened flush against the
  previous section's last panel, and three sections read as one run.
- Spacing is declared **once**, at the end of `_settings-module.css`: `.agfbody > *` 16px
  (`@padding-md`), `.agfbody > .agcfgp` 4px, `.agfbody > .agcfgh ~ .agcfgh` **32px**. The four
  inline `style="margin-top:…"` at the call sites are gone from `_settings-module.js`.
- ⚠️ **32 = 2 x @padding-md, not an eyeballed number.** The scale tops out at `@padding-lg` 24,
  and 24 against 16 inside barely reads — the recorded `.aiab li` / `.aichips` lesson: the gap
  BETWEEN groups must beat the gap INSIDE one.
- ⚠️ **`.agfbody > *` is (0,1,0) and TIES with `.agsub` / `.agadv` / `.agrow2` / `.agtn`** — it
  wins only by SOURCE ORDER, so that block must stay at the end of the file.
- ⚠️ **The phantom 79px gap was `obs-radio` being `display:inline`** (an unknown element's
  default): it measured 341px wide in a 720px form and its rect stopped 55px short of its own
  painted rows. `.agcfgm obs-input` already carried the same fix; the radio group never got one.

### The flyout: no rail, one left edge, a section label, the rail's own pitch, and icons

Five requests in a row, each one exposing the next. **The order matters — each fix caused the
next report**, which is worth knowing before "fixing" any of them back:

1. **"remove this line"** — `.mflist`'s 1px left rail went, and its 12px indent with it (that
   indent only existed to clear the rail). ⚠️ The flyouts had DISAGREED: `.mfcol.mfmaster
   .mflist` already set `border-left:0`, so Explorer — the one menu deep enough to want a spine
   — drew none while the flat lists did.
2. **"Explorer and the list of sub module will be line align"** — with the indent gone, a 2px
   stagger showed: heading text at **212**, row icons at **214**. `.mfi` carries `border-left:1px
   solid transparent` (the hover accent) PLUS `padding:0 9px`, so a row's content starts 10px in
   while the heading's started 8px in. `.mfsec` padding-left is **10px** now — DERIVED from that
   row, not picked. All six menus measure 214/214.
3. **"title and list of submodule is same, make to difference"** — a direct consequence of (2):
   the 12px outdent had been the ONLY thing separating them. Measured, heading vs row was 13px/700
   against 12.5px/600 in the *same* colour — 1.00:1. `.mfsec` is now the file's own section-label
   idiom (`.agsub` / `.agsec` / `.dvnh`): **11px/600/.06em/uppercase/`--text-dim`**.
   ⚠️ **THE ROWS WERE NOT TOUCHED** — the heading moved DOWN in weight instead, because the rows
   are what you click.
   ⚠️ **`--text-dim` is the floor.** It is the only token clearing 4.5:1 on the menu in BOTH
   themes (5.04 dark / 5.40 light); `--text-dim2` drops to 3.55 dark and `--muted` to 2.94.
   Stated trade-off: in the three menus whose rows are also `--text-dim`, heading and rows share
   a colour and are told apart by size + case + weight alone.
4. **"add between more space"** — `.mfi` is 32px + 2px = **a 34px pitch, which is `.sitem`'s own
   height**. The rail row and the flyout row are the same kind of thing, so they share one pitch.
   ⚠️ The space is a `margin-bottom`, NOT more height — height grows the hover fill with it and a
   19-row menu paints one continuous slab. Verified the tallest menu (Setting, 19 rows) still
   fits at 1280x720.
5. **"both are different make proper" / "list will be show like"** — **Report and Alert now carry
   a module icon per row**, like Explorer. ⚠️ The rule is *a row that NAMES A MODULE gets that
   module's icon*; `Dashboard` and `SLO` stay iconless because their rows are ACTIONS ("＋ New
   dashboard", "Manage dashboards", "Error budget"), and giving an action a module's glyph would
   say something untrue about where it goes.
   ⚠️ **Nothing was drawn.** All 18 keys already existed — but two are not the obvious ones:
   `Metric` is **`metric-explorer`** (there is no bare `metric`) and `Network Config`/`NCCM` are
   **`ncm`**. `ico()` returns `''` for an unknown key rather than throwing, so a guessed key
   renders one blank row among ten and nothing reports it. All were resolve-checked first.
   ⚠️ **`mfCol` ALREADY SUPPORTED THE FIFTH SLOT** — `[label, mod, act, kind, ic]` — so Report
   needed data only. Alert goes through `mfTree`, whose derivation destructured `[l, mod, act,
   kind]` and DROPPED `ic`; it had to be carried through, and `mfTree` gates the whole icon
   column on `tree.every(r => r.ic && ico(r.ic))`, so one missing key turns icons off for the
   entire menu.
6. **"it will be show icon", with the live Settings page as the reference** — **Setting now draws
   all 19 of the product's own category icons**. ⚠️ **NO DATA WAS ADDED: every `ST_TREE` category
   ALREADY carried a resolvable `ic`** (`my-account`, `network-discovery`, `brain`,
   `sparkling-star` …) and `ST_ICO` is precisely the set the live Settings rail draws — i.e. the
   reference itself. The flyout simply could not see them, because the gate asked `ico()`, whose
   registry holds the 16 MODULES, and got `''` for all 19.
   ⚠️ **`mfIco(n, cls)` is the fix — ONE resolver, two registries**: `ICONS` first, then `ST_ICO`.
   The gate and the render must both use it; gating on one resolver while rendering with another
   is what produced the silent all-or-nothing failure in the first place.
   ⚠️ **`ST_ICO` values are a bare path `d`**, not `ICONS`' `{viewBox, paths}` record, all on the
   same 48x48 grid — hence a hand-built `<svg>` rather than a second call into `ico()`.
   ⚠️ **`ST_ICO` lives in a LATER `<script>`** (`_settings-module.js`). Safe only because the
   flyout builds lazily on first hover — the same timing `mfTreeFor` already relies on for
   `ST_TREE` — and it is wrapped in try/catch to make that structural. A bare `typeof` guard is
   NOT enough on a `const` genuinely in TDZ, the trap this file has recorded five times.

### The flyout is TWO CARDS when it has a pane — the empty column is gone

Request, 2 Sep 2026: *"is it possible to remove the white space and show only [the pane]"*, with the
empty regions above and below the pane boxed in red.

The flyout was **one card** and the detail column a flex child of it, so the column stretched to the
master list's height — 675px for Settings' 19 rows — and painted the menu's surface down its whole
length whether or not there was a pane in it. Hovering `Log Settings` (4 pages) drew a 160px pane
inside a 675px column: ~200px of dead surface above and ~300px below.

- **The fix is to stop the column stretching, not to hide anything.** `align-items:flex-start` makes
  each column shrink-wrap, and the surface moves off the flyout onto the columns themselves — so the
  empty area is simply never painted and the board shows through it. Measured: Setting's pane
  **196px against a 701px master**, with **0px of slack** under its last row.
- ⚠️ **SCOPED BY `#mflyout:has(.mfdetail)`** — true for Explorer / Alert / Setting, false for
  Dashboard / SLO / Report, which are one column **plus a docs footer that is a sibling of
  `.mfcols`**. Card-ifying the columns there would strand that footer outside the card, so those
  menus are not touched at all. There are probe assertions that Report is still one card and still
  has its `.mffoot`.
- ⚠️ **`:empty` IS WHAT HIDES THE PANE** on a row with no children. `mfSub` sets `innerHTML = ''`,
  which is genuinely empty (no whitespace node), so the selector holds. Without it an empty bordered
  box floats beside the list.
- ⚠️ **THE TWO CARDS ARE DELIBERATELY DIFFERENT SHAPES.** The master still hangs off the rail, so it
  keeps `border-left:0` and `border-radius:0 8px 8px 0`; the pane is free-floating and gets a full
  border and radius.
- ⚠️ **THE FLYOUT KEEPS `overflow:auto`** — a 19-row master must still scroll at 720px tall — and
  that clips at its PADDING box, so its padding is what gives the cards' shadows room to fall. The
  right/bottom padding went to 44px for that reason, not for looks.
- ⚠️ **`mfDetailAlign` switched from `padding-top` to `margin-top`.** While the pane was a stretched
  column its offset had to be padding — there was no card to move. Now that it shrink-wraps, padding
  would put the gap INSIDE the border and bring back exactly the empty space this change removes.

### The detail pane opens BESIDE the row you are pointing at (`mfDetailAlign`)

Request, 2 Sep 2026: *"i hover the sub module it will show child sub module but it is show in top —
improve wise the show behind it"*. The pane always rendered flush with the top of its column. On
`My Account` — the first row — that looked deliberate; on `Utility`, the 15th of 19, the lit row is
near the bottom while its answer appears **~500px away at the top**. Settings is 19 rows deep, so
this is the menu where it actually hurts.

- `mfDetailAlign(k)` sets a **`padding-top`** on `#mfDetail` equal to the hovered row's offset,
  clamped to the room that exists. Measured: **15 of Settings' 19 panes now sit exactly level with
  their row (Δ=0)**, the other 4 clamp; nothing overflows the flyout in any menu.
- ⚠️ **`padding-top`, NOT `transform`.** The pane is a flex item that must keep participating in
  layout — `mfClamp()` sizes the flyout from it and `mfFade()` measures its list — so a transform
  would move the paint and leave the box behind, and the clamp would then let content hang off.
- ⚠️ **`scrollHeight` LIES ON A STRETCHED FLEX ITEM, and it failed silently.** This column stretches
  to the master list's height (675px for Settings), and `scrollHeight` returns
  `max(contentHeight, clientHeight)` — so it reported **675 for a 160px pane**, `avail - content`
  was 0 for every row, and the padding computed *correctly* and always came out **zero**. Nothing
  errored; the feature just did nothing. Measure the content's own span instead: first child's top
  to last child's bottom.
- ⚠️ **Zero `paddingTop` BEFORE measuring**, or the previous row's offset is still in the number and
  the pane walks further down on every hover. There is a probe assertion that re-hovering the same
  row is idempotent.
- ⚠️ A pane taller than the list (Monitor's 18 children) gets an offset of 0 and stays at the top —
  that falls out of the clamp rather than needing a special case.

### The DETAIL PANE had the same two-registry bug, and it hid behind which category you opened

Reported straight after (2 Sep 2026: *"some title will be show icon and some is not show"*).
Fixing the master rows left `mfSub`'s tile call site on the old resolver, so the pane's title drew
a glyph for **Compliance Settings** (`metric-explorer`), **SNMP Trap** (`trap-viewer`) and **APM**
(`apm`) — whose keys happen to exist in the rail's `ICONS` set — and nothing for **Utility**
(`utility`) or **Real User Monitoring** (`monitor`), whose keys live only in `ST_ICO`.

- ⚠️ **THE SPLIT IS INVISIBLE UNLESS YOU OPEN THE RIGHT CATEGORIES.** Six of the nineteen resolve
  in both registries, so a spot check lands on a working one more often than not.
- ⚠️ **EVERY ICON IN THIS FLYOUT NOW GOES THROUGH `mfIco`** — the master list, the `mfCol` menus,
  the `mfTree` gate, and this tile. A second resolver is exactly how the two halves drifted apart.
- ⚠️ **A probe asserting "every category shows a tile" FAILS ON CORRECT CODE.** `mfSubIdx` is
  deliberately `-1` for a row with no children, so those rows open no pane at all — in Explorer
  only `Monitor` and `NCCM` have children, and in Alert only `NetRoute`, `APM` and `Real User
  Monitoring`. Assert over the panes that actually open: Setting **19/19**, Explorer **2/2**,
  Alert **3/3**.

### The icon column had to be paid for — `.mfcol.mfmaster` 236 -> 288px

⚠️ **An icon per row costs 22px of label** (a 15px glyph on `.mfi`'s 7px gap), and this column was
already sized to the pixel — it went **212 -> 236** when the `DOCS ↗` chip arrived, for exactly the
same reason. With icons on, `Setting` truncated **7 of 19** rows and `Alert` 1 of 8.
⚠️ **Measured, not rounded up by eye**: the worst deficit was **51px** (`Service Level Objective`),
so 236 + 51 = 287, taken to **288**. Explorer needed none of it, but one rule sizes the master pane
for every menu, so the widest label wins.
⚠️ Verified at **1280x720** — the binding case, not 1600: **0 truncated labels in all six menus**,
every flyout inside the viewport.

### `.mfmaster .mfi.par` had quietly undone a documented decision

Reported as "this and this make to same", holding Alert against Report. Measured: Alert's rows
were **12.5px/600 white**, Report's **12.5px/400 dim** — the same content, a flat list of module
names, in two weights. The only cause was structural: Alert is a master/detail tree because three
of its eight rows have children.

- ⚠️ The highlight had been deliberately keyed to **`.mfi:has(.mfic)`** with its own note —
  *"`:not(.sub)` would have re-weighted the whole rail's menus … there are probe assertions that
  Dashboards and Setting are unchanged"*. A later bare `.mfmaster .mfi.par` rule re-weighted
  exactly those menus anyway. It is `.mfmaster .mfi.par:has(.mfic)` now.
- Result: five of six flyouts render rows identically; **Explorer keeps its highlight because it
  has icons**, which is what the 23 Aug "sub module will be highlighted" request actually asked.

### The sidebar, audited end to end

Every row measured rather than eyeballed. **The rail was already consistent** — all six module
rows plus Search and Iris at box 8 / icon 20 / label 51 / height 34, group gaps 7px. One defect:

- ⚠️ **The wordmark sat at x=54 against every label at x=51.** `.strigger`'s `gap` is **6px**, not
  9, so `15 + 30 + 6 = 51`.
- ⚠️ **The brand mark's own x=15 is CORRECT and was not touched.** It is 30px wide, so it CENTRES
  on 30 — exactly the centre of the 20px icon column at x=20. Moving it to 20 would push its
  centre to 35 and break the one thing that was already right.

### The config footer spans its COLUMN — not the form, not the pane

Request: "show proper full width". ⚠️ **This rule has now been wrong in both directions**, and the
history is kept because each time the obvious fix was the other extreme: **1524** (uncapped, ran
past the help card) -> **720** (capped to `.agform`, stopped 150px short of the divider) ->
**1204**, the middle column's own content edge, measured against the help card at 1204..1584.

- ⚠️ **There is no `max-width` on `.agff` at all now.** It is a child of `.agcfgm`, so it fills
  that column and the width is DERIVED rather than being a third hardcoded number.
- ⚠️ **`padding-right:24px`, not `margin-right`.** The rule IS the `border-top`, which spans the
  padding box, so the line meets the divider at 1204 while the buttons stop at 1180. A margin
  would shorten the LINE by that 24px — the thing the request asked to fix.

### Option 5 gained expand/collapse, and lost its route subtitle

`PL.col` / `plColSet()` / `body.plshut`. ⚠️ The column is `display:none` when collapsed, not a
width transition — its rows are `nowrap`, so animating the width reflows every label. The rail
stays 44px and keeps every module, and `.shell`'s padding follows. The `/slo/` route line was
removed from the column header (same reasoning as the flyout detail pane on 27 Aug: it told you
where you already are rather than what you could do next).

### Verification notes

- ⚠️ **THE STALE-COPY TRAP BIT AGAIN, and it reported a real fix as broken.** These probes live in
  the scratchpad, so their relative `<link href="_settings-module.css">` resolves to the COPY
  beside them. Four assertions failed on correct CSS until the file was re-copied. **Re-copy every
  external asset after every edit**, not just the page.
- ⚠️ **A `<base href>` is NOT a safe substitute here** — it aborted the load at 10KB of a 2MB page.
  Copy the assets instead.
- ⚠️ **`getComputedStyle` on a node a later render replaced returns EMPTY strings**, which reads as
  a failed assertion. Three "FAILs" in the flyout suite were a sample captured before five more
  `mfOpen` calls had rebuilt it.
- ⚠️ **A SIGALRM-killed headless run leaves `/private/tmp/<profile>/SingletonLock` behind**, and
  every later run in that profile dies with "Failed to create a ProcessSingleton". `lxbehave`
  reported NO PROBE OUTPUT on four files for this reason and nothing was wrong with the pages.
- `harness.py … query` **77/77** on `index.html` after all of the above.

## The 2 Sep 2026 pass (later) — Agentic AI moves into a drawer, and six framework traps

All four option files. Driven request-by-request against supplied screenshots and two live
references (Datadog's rail footer, and the product's own **Application Registeration** drawer).
Where this conflicts with anything above, this is current.

### The Configure screen is a `.sdrawer` now, not a full page

`agConfig()` no longer calls `stFullOpen` — it opens **`#drawer-agcfg`**, so the Overview you
launched it from stays on screen behind a blurred scrim. `agCfgClose()` is the way out and
repaints the Overview so the connection state catches up.

- ⚠️ **IT REUSES `.sdrawer`, NOT `obs-drawer`.** The DS element was tried for this exact screen on
  31 Aug and carries six recorded defects (no `close` event, an inert `open` attribute, a slotted
  repaint replaying its open animation). `.sdrawer` is what the reference shows, was rebuilt
  against the DS on 27 Aug, and has none of them. A drawer is also what `get_layout(panels)`
  prescribes for create/edit — the product's most-used overlay, 146 files.
- ⚠️ **OPTIONS 2 AND 3 HAD NO `.sdrawer` AT ALL.** Pointing their `agConfig` at the drawer made
  Configure open *nothing*, silently. The chrome was ported verbatim to both. Check that a shared
  function's target EXISTS in every option before repointing it.
- ⚠️ **1440px, because the help card belongs in it.** I first hid `.aghelp` and asserted three
  columns could not fit a side panel; the supplied reference is the product doing exactly that, so
  the drawer widened instead. Rail 220 + form 720 + help 420. Below a ~1400px viewport the card
  removes itself through the `@media (max-width:1400px)` rule it already had.
- ⚠️ **AN ID-SCOPED WIDTH NEEDS ITS OWN PARKED `right`** — the recorded `#drawer-layout` lesson:
  without it the panel sits partly on screen while closed.
- ⚠️ **`#drawer-agcfg .dr-b > .agcfg{flex:0 0 auto}` IS WHAT MAKES IT SCROLL.** `.dr-b` is a flex
  COLUMN, so its child defaulted to `flex-shrink:1`, `.agcfg` was squashed to the body height, and
  the tall form spilled out with NO scrollbar while the footer sat stranded mid-panel (measured:
  `scrollHeight 756 === clientHeight 756` with content at y=1466 and the footer at y=700).
  ⚠️ Removing `min-height:100%` was the first guess and did **not** fix it — the shrink is the
  cause. After: `scrollHeight 1546 / clientHeight 756`, footer at 1490.
- ⚠️ **A DRAWER MUST PAY FOR ITS OWN GUTTERS.** On the full page the screen sat inside `.stmain`'s
  padding; `.dr-b` is `padding:0` here so `#agPage` owns its spacing, and `.aghelp` only ever had
  `padding-left` — so the help text ran flush to the drawer's edge.

### Six framework traps, each of which cost real time

- ⚠️ **VUE FORWARDS A HOST'S `style` ATTRIBUTE INTO THE SHADOW ROOT.** `style="display:block"` on
  `<obs-banner>` landed on `.bn` and overrode its `display:flex`, stacking the ✓ above the message.
  Measured: `inline style on .bn = "margin-top:16px; display:block"`. **A CLASS IS SAFE WHERE A
  STYLE ATTRIBUTE IS NOT** — the class is copied inward too, but page CSS cannot match inside a
  shadow tree, so only the rule targeting the host applies.
- ⚠️ **`obs-select` IGNORES A HOST NARROWER THAN 240px AND PAINTS OUTSIDE ITS OWN BOX.** Its shadow
  `.sel` is hardcoded to 240px: host 837..1037 (200px) while it *drew* 837..1077. Every DOM
  assertion passed. Found by counting painted pixels. Recorded in `_ds/README.md` as a seventh
  0.1.166 defect. **Measure a web component's SHADOW box, not the host.**
- ⚠️ **`text-overflow` CANNOT ACT ON AN ANONYMOUS FLEX ITEM.** `overflow:hidden` on `.agrt .n`
  (an `inline-flex` whose label was a bare text node) computed to `clip`, cutting labels
  mid-glyph. The label needs its own span.
- ⚠️ **`[hidden]` LOSES TO ANY AUTHOR `display` RULE.** `.stpt{display:grid}` beat the UA's
  `[hidden]{display:none}`, so `stHeadPaint`'s `i.hidden = true` had never hidden anything —
  latent since the Settings module was built.
- ⚠️ **`tipFor()` EATS AN `obs-*` TITLE.** It adopts any `title=` into `data-tip` and deletes the
  attribute; on a DS component `title` is a rendered PROP. The engine now skips `OBS-*`, which
  fixes the whole class rather than one call site.
- ⚠️ **A BACKTICK INSIDE A TEMPLATE LITERAL ENDS IT.** Prose about this file's code — which is full
  of `` `names` `` — must live in a JS comment OUTSIDE the string. `node --check` reports the error
  hundreds of characters from the cause.

### Four cases where a GREEN PROBE measured the wrong thing

The recurring failure of this session, worth more than any individual fix:

- `CLIPPED=false` at 1600px on a genuinely broken rule — the row had 400px of slack. **Test a
  truncation rule at the width where it bites.**
- A chart probe read `fill` before `stroke`; a polyline's `fill` is `"none"`, which resolved to a
  third distinct colour and satisfied "all different" — so the aqua it claimed to verify was never
  measured.
- A button-order suite asserted `b[0]`/`b[1]` by index and reported **8 failures on working code**
  after a requested swap. Locate by label.
- An `el.hidden` assertion passed on a button plainly still on screen. **Hit-test the pixel** with
  `elementFromPoint` and walk up.

Add to that the standing one: a probe that drives `.sidebar.open` measures 11.7px grid columns
because **an automation-driven tab never advances a width transition** — inject
`transition:none` before measuring.

### Everything else this pass changed

| screen | change |
|---|---|
| rail footer | Approval · Health · Notifications MOVED into a 3-up icon-above-label row, from Datadog's own footer (measured in the browser). One column when collapsed — they are utility controls and must stay reachable at 64px. `.on` had to move with them or `showView` marks nothing. |
| rail | the `Sidebar` utility row removed; its tab is still reached from the Layout drawer |
| flyout | `DOCS`/pin/chevron wrapped in one `.mfend` so they form a column (they landed at 294/302/316 on consecutive rows); chevron box always reserved; column 212 → 236px; the hover `translateX(2px)` "bump" removed; no left border where it meets the rail |
| Settings flyout | the footer doc link follows the CATEGORY — `MF_ST_DOCS`, **all 17 paths verified against `_product-docs/urls.txt`**, never composed |
| Agentic AI | wizard flattened to one form (gates unchanged); Test panel absent until Run test; single-line loader; success = banner only; export-PDF before the primary; charts on the chart palette, never `--severity-*`; consent merged to one panel |
| canvas | the group header rule replaced by a border on `.dgroup:has(.ghead)`; an empty group is its dashed border and nothing else |
| everywhere | **every translucent full-screen overlay now blurs** — verified generically, not by list |

## The 3 Sep 2026 pass — every flyout row has a glyph, and three sidebars fixed

Options **1, 4 and 5**, driven request by request from screenshots. ⚠️ Where this conflicts
with anything above, this section is current.

### Dashboard and SLO flyouts carry glyphs now (Option 1; same data in Options 4 and 5)

Request: the Dashboard and SLO menus held against Explorer and Setting — *"improve this and
same ui"*. Three of six flyouts led every row with a mark and the other three led with nothing.

- **The fifth slot on every `SUBNAV['Dashboards']` / `SUBNAV['SLO']` row.** ⚠️ **This REVERSES
  the note at `SUBNAV['Report']`** that kept them iconless because their rows are actions. The
  rule now: **every flyout row has a glyph, and an ACTION row gets the glyph of what it does** —
  a list row the module it lists (`dashboard` / `screen` / `report` / `slo`), a "New …" row the
  product's `plus` (teal, in the slot the text ＋ used to take), Manage the `sliders` the list
  panel's own Manage-dashboards row draws, Scheduled a `calendar`, Error budget a `pie-chart`.
- **Six `ICONS` entries** — five are product SVGs from `observeops-icons/common/` pasted
  verbatim (`plus`, `star`, `screen`, `calendar` = calendar-alt, `pie-chart`); **`sliders` is a
  STROKE icon on a 24 box** (the Lucide `sliders-horizontal` already in the file), so **`ico()`
  gained a `stroke` flag**. ⚠️ A stroke entry carries `style="fill:none"` INLINE: `.mrr .mfic`,
  `.plrow .plic` and `.plib .ic` all say `fill:currentColor`, and a CSS rule beats a presentation
  attribute — without the inline style the outline paints as a blob (the `.dvic svg` trap).
- ⚠️ **A `plus` row with a glyph draws NO text ＋** — `mfCol`, Option 4's `mrRow` and Option 5's
  `plBodyHTML` all test `ic` first. Both together printed two pluses side by side.
- **The Starred rows are `.mfi` now, not `.mfstar`** — the same 32px row and 15px slot as the
  rest of the card, with the product's `star` in `--yellow`. `.mfstar` is kept, unreferenced.
- ⚠️ **`ICONS` and `SUBNAV` are per file.** Done in `index.html`, `dashboard-labelled-rail.html`
  and `dashboard-nav-column.html`. **Options 2 and 3 were not touched** and still render the
  old iconless rows (they were already behind on the 2 Sep icon work).

### Option 5 — an expand tile, and the column on the 34px pitch

- ⚠️ **The collapse button lived in the column's header, and `body.plshut` hid the column** —
  so the control that closed it vanished with it and the only door back was the brand mark,
  which nothing said was a door (*"when i collapse the sidebar the expand icon is not show"*).
  `plRailPaint` now renders **`#plExpand`** (`.plib.plexp`) first under the mark, CSS-hidden
  until `body.plshut`, so `plColSet` needs no repaint on the way down. The mark keeps its click.
- **Rows went 26px → 32px + 2px** — the 34px pitch `.sitem` and `.mfi` already share
  (*"very low spacing"*). ⚠️ This overrides the earlier note that Plain's density IS the
  pattern. Primary rows read in `--text`, children in `--text-dim`; section headers use the
  file's label idiom (11px/600/.06em/uppercase) with 16px above — the gap between groups beats
  the gap inside one. `.plrow.sub` indents 32 = 9 + 15 + 8 so a child's text starts under its
  parent's TEXT.

- **The Alert column's eight module rows carry their glyph** (request, 3 Sep 2026: *"add submodule
  icon — reference is Option 1"*). Option 1's Alert flyout has had a module icon per row since
  2 Sep; this file was copied before that landed, so `SUBNAV['Alerts']` had no fifth slot and the
  column drew bare labels beside an Explorer that drew a glyph per row. **Data only** —
  `plBodyHTML` already renders the fifth slot — and the keys are Option 1's verbatim
  (`metric-explorer` · `log` · `flow` · `trap-viewer` · `netroute` · `apm` · `ncm` · `rum`). The
  six `sub` views stay plain, and `.plrow.sub`'s 32px indent (9 + 15 + 8) now does what it was
  sized for: a child's text starts under its parent's TEXT rather than two steps past it.
  ⚠️ **Options 2, 3 and 4 still carry the iconless `SUBNAV['Alerts']`** — the same one-block data
  change each (Option 4's `mrRow` already reads the slot).
  ⚠️ **This file's `SUBNAV['Report']` is still iconless too** (10 rows, 0 glyphs, measured) while
  Option 1's Report flyout carries them — the same change, not asked for here.
- **The column STARTS COLLAPSED** (request, 3 Sep 2026: *"by default the sidebar will be
  collapsed"*). Boot is a 44px rail, the expand tile under the mark, and the canvas padded for the
  rail alone; the column docks on the tile or the mark and folds again from its own header. It
  is the same default stated twice — `<body class="plshut">` for the first paint and `PL.col:true`
  for the toggles — and both are needed: class only, and the first `plColTog` would open a column
  the state thought was already open; state only, and the column flashes open for a frame while
  the canvas fits twice (the `mpshut` / `dvshut` pattern of Options 2 and 3). The brand mark's
  `data-tip="Expand sidebar"` is in the markup for the same reason — `plColSet` only writes it on
  a toggle. ⚠️ **This reverses the pattern's own premise** (Plain's column is always-on, and the
  Option 5 section below still describes it that way); the hover-peek is what keeps every module's
  navigation one pointer-move away, so nothing became unreachable. `plColSet` is deliberately NOT
  called at boot — nothing needs moving, and its `fitCanvas` would refit a canvas not yet drawn.
- **The Setting column's 19 rows carry the product's category icons** (request, 3 Sep 2026: *"also
  use the icon, reference is Option 1"*). Nothing was added to `SUBNAV['Settings']`: `plStIc(label)`
  reads the category's `ic` off `ST_TREE` at paint time (the harvested list Option 1's Setting
  flyout renders), and **`plIco` is now Option 1's `mfIco` — one resolver over `ICONS` then
  `ST_ICO`**. Six categories resolve in both registries, which is exactly how Option 1's pane drew
  some tiles and not others until both call sites shared one function.
- **EVERY ROW IN THE COLUMN HAS A GLYPH NOW — Explorer's children included** (request, 3 Sep 2026:
  *"if in sidebar they have icon, use it overall"*, holding Monitor's 18 plain children against
  the ten glyph-led sub-modules). ⚠️ **This REVERSES, for this column only, Option 1's 23 Aug rule
  that "the 20 children deliberately have none"** — there, icon-vs-none was the level cue in a flat
  flyout; here the indent (a child's glyph sits under its parent's TEXT) plus the child's smaller,
  dimmer type carry the nesting, so the cue survives. A child is `[label, module, act, ic]` in
  `EXPLORER_TREE`, `act` padded `null` so the slot does not shift.
  ⚠️ **THE PRODUCT HAS NO GLYPH PER MONITOR TYPE** — its `monitors/` icon set is per vendor. All 19
  new `ICONS` entries are product SVGs pasted verbatim from `observeops-icons/` (single path, 48
  grid), but the MAPPING is a reading, recorded above the entries: the Discovery Profile's own
  category tiles (`discovery-server` / `-storage` / `-virtualization` / `-hci` / `-container` /
  `-service-check`) for those six types; `inventory` · `network` · `database` · `process` ·
  `kubernetes` · `metric-explorer` · `compare` by name; and the nearest product glyph for the rest
  — SDN → `sdn-topology`, Cloud → `cloud-topology`, Interface → `port`, WAN Link →
  `cisco-wan-link`, Service → `service-set`, Other → `custom`, Compliance → `shield-check`.
  `interface`, `service` and `rule-compliance` are in the DS registry (`list_icons`) but in
  neither the harvest nor the vendored bundle, so they could not be inlined; swap them in if the
  SVGs are ever harvested. ⚠️ **Option 5 only** — Option 1's flyout keeps its plain children.
  ⚠️ **`--pl-nav` WENT 216 → 224px WITH IT, measured.** A nested row's text now starts 23px further
  in, and "Container Orchestration" came out 136px of text in 135px of room — a 1px overflow that
  costs three letters, because the ellipsis takes its own width. One 8px step clears it with 7px to
  spare; nothing else in any column was within 8px of its edge. The shell padding and the
  hover-peek read the token, so nothing else had to move. ⚠️ **The probe that said "labels fit"
  was wrong** — it compared the label span to itself, while the clipping is `.plrow`'s own
  `nowrap`. Measure a Range over the TEXT against the row's content box, not the span's
  `scrollWidth`.
- **A row that HAS children carries an expand/collapse chevron** (request, 7 Sep 2026: *"the
  explorer add submodule expand & collapse with icon"*). Monitor and NCCM already toggled their
  children on click, but nothing on the row said so — the count reads as data, not as a control.
  `plRowHTML` takes `kids` (draw it) and `open` (turn it); `plBodyHTML` reads both off
  `EXPLORER_TREE`, so a row with no children can never get one. It is the product's own
  `chevron-right` (`PL_CV`, 48 grid, verbatim), **at the row's right edge after the count and
  visible at rest** — the Grafana placement Option 7 settled on 5 Sep, for the same reason:
  four "the control is invisible until hovered" reports in this folder. Points right shut,
  rotates down open (`.plrow.plopen`; not a bare `open`, which is the rail's own state class).
  ⚠️ **Behaviour is unchanged**: the whole row is still the
  toggle, one parent opens at a time (`PL.sub` is a single value), and the open parent still
  wears `.on` — so an expanded Monitor now shows two signals for one state, the tinted row and
  the turned chevron. Both are recorded, not resolved. ⚠️ **Option 5 only** — Option 8's `pl*`
  copy and Option 6's `sk*` column render the same tree without it. Verified by a 26-assertion
  headless probe (placement, size, rotation, hit-tested clicks on both parents, 18/2 children,
  no chevron in the Alert column) and both themes screenshotted.
- **The section caret is the product's `chevron-down` too** (request, 7 Sep 2026, later the same
  day: *"improve this icon in overall"*, pointing at NOC VIEW / REPORTS). `PL_CAR` was a
  hand-drawn 5px filled triangle — the one solid mark in a column of stroked product glyphs. Same
  12px box as the row chevron so the two read as one family; down at rest, turned right when the
  section is shut (the existing `-90deg` rule, unchanged).
- **Docs link, module-wise, like Option 1** (request, 7 Sep 2026). Option 1 has two shapes and the
  column keeps both: a **tree menu** (Explorer · Alert · Setting) puts Datadog's `DOCS ↗` chip on
  each row (`.pldoc`, Option 1's `.mfdocs` at its current numbers, hover-revealed) linking to THAT
  row's page — `EXPLORER_TREE[].doc` for a sub-module, `MF_ST_DOCS[category]` for a Settings
  category, the module's `MOD_DOCS` entry for a row with none (every Alert tab; Agentic AI); a
  **flat menu** (Dashboard · SLO · Report) gets one `<Module> documentation ↗` footer (`.plfoot`,
  Option 1's `.mffoot`) as the last line inside `.plbody`. ⚠️ **No data was added** — the tree's
  `doc:` slots, `MF_ST_DOCS` and `MOD_DOCS` with its singular aliases were all inherited from
  Option 1's page and unrendered until now; every path was `curl`-verified 200 when Option 1 got it.
  ⚠️ **A real `<a>` inside the row's `<button>`** — invalid nesting, but measured in Chrome: a
  hit-tested click follows the href and with `stopPropagation` does not fire the row, so
  middle-click / hover-URL / copy-link keep working where a `window.open` span would lose them.
- **Pin / unpin on the Explorer rows, like Option 1** (request, 7 Sep 2026). `.plpin` is Option 1's
  `.mfpin` — same `MF_PIN` glyph, hover-revealed, always shown and filled teal once pinned, same
  `railPinToggle` handler, so the two options move the same `RAIL_PINS`. **Pinned sub-modules
  render on the rail as 32px tiles directly under Explorer** (`.plib.plpinned`, from Option 1's
  own `railPinsOrdered` / `railPinRow` / `pickPin`); when a pinned module is the active one its
  tile lights and Explorer's does not (`railRowHTML`'s rule). `railPinToggle` is wrapped to
  `plPaint()` after, or the row keeps its old pin while the rail has already changed.
  ⚠️ The pin is a `<span role="button">` — a button inside the row's button is the nesting that
  eats clicks. At 52px the rail tile carries no pin mark, exactly as Option 1's collapsed rail.
- **The trailing controls are ONE cluster, `.plend`** (request, same day: *"make proper alignment
  like option 1"*). As siblings the pin landed 40px further left on Monitor than on Topology,
  because only Monitor carried a count and a chevron. Option 1's `.mfend` port: one flush-right
  group, 5px inside, and — the half that aligns — **the count slot and the chevron box are
  reserved on every tree row** (`.ph`: `visibility:hidden`, the `.mfkc.ph` trick), so pin · DOCS ·
  count · chevron form four columns down the list while a number and a chevron still paint only
  where a row has children.
- **Alert is a collapsible tree too** (request, 7 Sep 2026: *"in this add icon expand collapse"*,
  pointing at NetRoute / APM / Real User Monitoring and their views). It rendered flat from
  `SUBNAV['Alerts']`, every view always shown, with 32px of indent as its only nesting cue while
  Explorer beside it folded its parents behind a chevron. `plAlertTree()` is Option 1's own reading
  of that list (`mfTreeFor('Alert')`: a non-`sub` row is a tab, the `sub` rows after it are its
  dropdown), rebuilt in the `pl*` block because this file's inherited copy drops the fifth-slot
  glyph; `plTreeFor(name)` hands Explorer's or Alert's tree to ONE renderer, so the three parents
  get the chevron, the `2` count, the accordion, the aligned `.plend` cluster and the DOCS chip by
  construction. ⚠️ **The views start FOLDED now** (they were always open) and **a parent row
  toggles instead of navigating** — the Explorer behaviour, so the column has one rule. Pinning
  stays Explorer's only, Option 1's rule.
- ⚠️ **`--pl-nav` went 224 → 264 → 280px, measured.** The chip stays in flow while invisible
  (opacity, so the label cannot reflow under the cursor), and it is **45px** wide, not the 36
  estimated: at 240 `Network Config Settings` still clipped by 15px and `Service Level Objective`
  by 8; 256 would have left 1px in hand — the recorded 224-step trap — so 264 with 9px. Then the
  Alert tree reserved the count slot and chevron box on its rows (36px more) and `Real User
  Monitoring` clipped by 6; 272 would leave 2, so 280 with 10. Same trade Option 1 made twice.
  `harness … query` 77/77 at all seven resolutions with the wider column.
- **Option 6's column foot, "Next steps" card and licence line are in this column too** (request,
  7 Sep 2026: *"the same will be add in option 5"*, with Option 6's card as the picture). Ported
  as `.plcfoot` / `.plfb` / `.plcnt` / `.plns` / `.plstep` / `.plbar` / `.pltrial` and the
  `PL_STEPS` / `plNsPaint` / `plCntPaint` / `plStep` / `plNsTog` / `plFootPaint` / `plHelp` /
  `plLicence` twins — same numbers, same four real destinations, same visited-means-done rule.
  ⚠️ **THE COLUMN'S MARKUP CHANGED SHAPE FOR IT.** `plPaint` used to rewrite the whole `.plnav`;
  the painted host is now an inner `#plNav.plnavin` (`flex:1 1 auto;min-height:0`, so its
  `.plbody` still scrolls) and the foot · `#plNs` · `.pltrial` are STATIC siblings after it —
  painted once, repainted in place — exactly Option 6's `.sknav` shape. The peek and collapse
  rules stay on `.plnav`, so the card collapses and peeks with the column.
  ⚠️ **The foot's ids are `plTourBtn` / `plHelpBtn` / `plSetBtn`, not `plHelp`** — an element id
  is a window global and `plHelp()` is a function in this block. Option 6 carries that exact
  collision (`id="skHelp"` beside `function skHelp`) and survives it only because a function
  declaration wins the name; not repeated here.
  ⚠️ The badge's ring is `--panel`, the surface this column sits on (Option 6's is `--card`, its
  surface) — same reason, different token.
  Verified by a 29-assertion probe (order of the four blocks, three 32px foot buttons with their
  glyphs, badge 4 → dismiss → rocket brings the card back, a hit-tested step landing on Settings ›
  User Settings with the tick, the 25% bar and badge 3, the Settings button lit there, Manage
  licence landing on My Account › License, the 19-row Setting list still scrolling inside the
  host with the foot below it, the card hidden when collapsed and shown in the peek), the earlier
  78-assertion column probe still green, both themes screenshotted.
- Verified by a **78-assertion probe** (label fit in all six columns, the Alert tree end to end, chip hrefs per row, chip
  click does not fold the parent, hit-tested pin → `RAIL_PINS` → rail tile under Explorer → tile
  click lights it and not Explorer → unpin removes all three, Alert/Setting chips and fallbacks,
  the three footers, the four columns of alignment, the caret's glyph and rotation), both themes
  screenshotted. ⚠️ **Option 5 only** — Options 6 and 8 render the same column without any of it.

### Option 4 — `»/«` opens the sub-module panel on Dashboards too

⚠️ **The "one preference, two surfaces" table above is SUPERSEDED.** On Dashboards the control
opened the dashboard LIST panel while every other module opened its sub-navigation — the one
place a reader first presses it showed a different kind of thing (*"to show wrong sidebar … open
the submodule sidebar like option 1"*). `mrApply` toggles `body.mrnav` from `MR.want` on every
module and leaves `.dpanel` alone; `mrPaint` reads `mrnav` only; the `toggleDPanel` wrapper is
gone (it copied the list panel's state into `MR.want`, which would now close the sub-module
panel whenever the list panel's own chevron was pressed); `mrFav()` opens the list panel
directly because the Favorites filter lives there. The list panel is still reachable from its
page-head chevron and from the panel's own first row, *Dashboard list*. Chrome cost at boot is
unchanged — `#mrNav` is the same 340px the list panel was.

### The Setting flyout's last rows — two faults, one report

*"when i hover the submodule in setting module … the last submodule i can't hover it"*. Measured
rather than guessed, because the row highlighted on hover yet the pane did not change:

- ⚠️ **The flyout was capped at `86vh` and its content is 759px** (19 rows at 34px + heading +
  paddings). At a 667px viewport the cap is 574px, so APM / Real User Monitoring / Integration /
  Agentic AI sat OUTSIDE the visible box — a hit test at their centres landed on the dashboard
  grid behind the menu. `overflow:auto` scrolled the box silently, with the bar 44px away in
  the shadow gutter. Now: `max-height:calc(100vh - 16px)`, and **`mfClamp()` bounds the MASTER
  LIST to the viewport** (room read from computed paddings + the heading, never retyped) so the
  list scrolls inside its own card with the same `.more` bottom fade the detail pane has
  (`mfFadeCard` serves both). The tree flyout is `overflow:visible`; the flat menus keep `auto`.
- ⚠️ **`mfSub` called `mfClamp()` BEFORE `mfDetailAlign(k)`** — so the clamp measured the box
  with the PREVIOUS row's `margin-top` still on the pane under the NEW row's content (566px of
  margin under a 332px pane read as a 956px box), shoved the flyout to the top of the viewport,
  and the next hover let it drop back. Measured: the box's top went 38 → 8 → 38 at 807px and
  through **four** positions at 957px. **A menu that moves under the pointer puts a different
  row under it**, which fires that row's hover, which moves it again — that is the row you
  "cannot hover". Align first, clamp second; and **`mfClamp` now keeps an open menu's top**
  (it only pushes UP if the box would overflow, never drifts down). `mfOpen` / `mfOpenUtil`
  clear the inline top so a fresh open starts from its own anchor.
- Verified by a probe that sweeps all 19 rows down and back up at 667 / 807 / 957px: one top
  per run, no pane past the box, box inside the viewport, and the last four rows hit-testable
  after the list is scrolled.

### Settings › Agentic AI — a sixth column, DS widgets, and a drawer that fills the room

Three requests later the same day, in `_settings-module.js` / `.css` (Option 1) and the inline
copies in Options 2 and 3 (and 4 for the drawer; it has no usage table).

- **`Last usage` is the sixth column of the usage grid**, and **the columns are SHARES of the
  width, not pixels** (*"column will be full width"*). Four fixed columns plus one free one put
  670px of figures on the left and handed the rest to Availability. `obs-table` passes a
  non-numeric `width` straight to the header cell's style (checked in the bundle), so `'20%'` /
  `'16%'` land as `<th style="width:…">` and the browser shares the row out — measured 227 / 183 /
  182 / 181 / 182 / 182 across an 1158px table. `AG_DATA.health.lastUsed` feeds the connected
  row; the others keep the em dash (nothing measured ≠ measuring nothing).
- **The three trend tiles are DS widgets** (*"replace this chart Using the ObserveOps design
  system"*). The registry is explicit that charts are Highcharts in the product and a declared
  gap here — no `obs-*` chart exists and the engine is licensed — so what changed is everything
  around and inside the plot that the DS DOES specify:
  - the tile header is **`obs-toolbar variant="widget"`** (the DS widget header: 14px/500 title,
    a time-range pill slot), which draws its own rounded-TOP frame with no bottom edge — the body
    div carries the rest of the frame;
  - ⚠️ **`--common-widget-bg` is repointed on the host** (`style="--common-widget-bg:var(--page-
    background-color)"`): the header paints that token and it is the same `#172336` as the
    table's detail band in dark. **Nothing else may go in that `style`** — Vue forwards a host's
    style attribute onto the inner div (the recorded `obs-banner` trap), so a `display` there
    breaks the toolbar's flex layout;
  - the plot is drawn by one `agChart(kind, …)` to the tokens the `data-viz` family names:
    gridlines `--neutral-lighter`, axis labels 11px `--neutral-light`, baseline `--border-color`,
    series from the chart palette, markers punched back to the page surface. Shapes follow the
    DS's own time-series set — volume is an **area**, latency a **line**, failures/day a
    **vertical bar**. A "nice" y-scale (1/2/2.5/5×10ⁿ) puts gridlines on round values; x labels
    are real dates counted back from today so the axis agrees with the "Last 14 days" pill.
    ⚠️ The last day is always labelled and a regular label within a slot of it is dropped —
    day 12 and day 13 printed "Sep 2Sep 3" on top of each other before that.
  - ⚠️ **A fixed `viewBox` that scales UNIFORMLY**, not `preserveAspectRatio="none"` — the old
    axis-less plot could stretch for free; a stretched axis label is not a label.
  - `agBars` / `agLine` are gone, not parked — `column` and `line` in `agChart` are the same shapes.
- **The Configure drawer is EVERYTHING EXCEPT THE RAIL** (request, 3 Sep 2026: *"not full screen
  sorry but the background sidebar will be show"*). **Three widths were tried in one day** and
  this is the settled one: `min(1440px,96vw)` (a panel beside the app, a strip of page showing)
  → briefly the full viewport (which covered the rail) → the full width **minus the sidebar**, so
  the app's navigation stays visible behind the scrim.
  - ⚠️ **THE RAIL IS DIMMED, NOT INTERACTIVE.** `#agCfgScrim` is `inset:0` at z-index 89 and
    `.sidebar` is z-index 60, so the scrim still covers the rail — it shows through blurred and
    no pointer reaches it. That is also what keeps the width stable: the rail cannot hover-expand
    under an open drawer, so the number taken on open stays true. Probed: what is painted over the
    rail is `agCfgScrim` in all four files.
  - ⚠️ **`agCfgSize()` READS `railWidth()`, WHICH READS THE TOKEN, NOT THE BOX.** The rail animates
    its width and this folder's own recorded lesson is that measuring it catches the transition
    mid-flight — the flyout bug. `railWidth()` already answers "how wide is the rail meant to be",
    `body.pinned` (`--rail-w-open`) included, and `.shell`'s padding trusts it for the same
    question. The CSS `calc(100% - var(--rail-w))` is only the first-paint fallback: that token is
    the COLLAPSED width and would be wrong while pinned.
  - Measured, drawer-left = rail-right in every option: **64 / 56 / 64 / 72**, no horizontal
    overflow at 1500 or 1920, help card still shown.
  - ⚠️ **AN EARLIER, DIFFERENT WIDTH WAS BUILT AND REVERTED THE SAME DAY** — list-edge-to-window
    ("show only background sidebar"), sized by measuring `.stnav`, with the help card moved to a
    container query because the viewport no longer predicted the drawer. Reverted on request.
    **Do not re-derive it**; if the drawer ever gets narrower than "viewport minus a rail", the
    help card needs a container query again.
- ⚠️ **ESCAPE ON THIS DRAWER WAS LEAVING ITS SCRIM BEHIND — a latent bug found by the width
  change.** Escape already reached the drawer: the host page's ladder matches `.sdrawer.on` and
  calls `closeOverlays()`, which strips `.on` from every drawer and clears `#scrim2` — but knows
  nothing about `#agCfgScrim` or `body.agdrawer`. So the panel slid away and left its blurred
  scrim over the page, blocking it, with the Overview never repainted. Latent since the drawer
  was built on 2 Sep; a full-width panel makes Escape the reflex, so it surfaced every time.
  The `ag*` block now handles Escape itself in **capture phase with `stopPropagation()`** — the
  only way to be sure it runs INSTEAD of the host's rung whatever order the scripts registered
  in; falling through would close the drawer twice, once correctly and once badly.
  ⚠️ **No `obs-select` guard.** One was written and removed: the host has always closed this
  drawer on Escape from anywhere inside it, so exempting a dropdown would invent an inconsistency
  — and a bubble-phase guard could not work anyway, since the host's handler fires regardless.
  Measured: the probe reported the drawer closed but `afterEscOnSelect` false, which is what
  exposed the host handler in the first place.

### The Health flyout carries a glyph per row (Option 1)

Request, 3 Sep 2026 — the Health Monitoring flyout's plain rows held against the Report menu:
*"this will be improve as like this"*. It was the last menu in the rail whose rows had no mark,
so it read as a different kind of list from the five beside it.

- **`HEALTH_ICO`**, beside `mfOpenUtil`, maps each tab LABEL to a glyph, and `mfOpenUtil` passes it
  as the fifth slot `mfCol` already renders — so the rows inherit the weight, colour and pitch
  every other glyph row has. Measured against a Report row: 600 / same colour / 32px, identical.
- ⚠️ **KEYED BY LABEL, NOT INDEX.** `HEALTH_TABS` is also what the Health page renders its tab bar
  from; a parallel array would be a second copy of its order, and reordering the tabs would put
  the wrong glyph on every row after the change without anything reporting it.
- ⚠️ **A miss here is one blank row, not a dead menu** — `mfCol` renders whatever slot it is
  given, unlike `mfTree`, which gates all-or-nothing. `ico()` still returns `''` for an unknown
  name rather than throwing, so every key was resolve-checked before being written in.
- **Five product SVGs joined `ICONS`** (`application`, `database`, `sessions`, `upgrade`,
  `restore`), each an exact name match for its tab, verbatim from `observeops-icons/`. Health
  Overview reuses `health-monitoring` (the overview IS the module) and Alert reuses `alert`.
- ⚠️ **Option 1 only.** Options 3, 4 and 5 carry their own `mfOpenUtil` (4 and 5 stand it down)
  and their own `ICONS`, and were not touched.

### The Setting flyout's two cards touch (Option 1)

Request, 3 Sep 2026 — the vertical strip between the Setting list and the Utility pane boxed in
red: *"remove this space"*. The two cards sat 8px apart (`.mfcols{gap:8px}`, from the 2 Sep
two-card change), which read as two unrelated menus floating beside each other rather than as a
list and the pane belonging to the row you are pointing at.

- **`gap:0`**, so the pane's left edge meets the master's right edge exactly. Measured 0 on every
  pane, and the pane still opens level with its own row (the `margin-top` alignment is untouched).
- ⚠️ **THE SEAM IS ONE HAIRLINE, NOT TWO.** Flush with both cards' borders drawn it would be 2px —
  visibly heavier than every other edge in the menu — so the pane drops its **left** border and
  the master's right border is the join. The pane keeps a radius on its free side only.
- ⚠️ **THE MASTER SQUARES ITS RIGHT CORNERS ONLY WHILE A PANE IS ACTUALLY OPEN**
  (`#mflyout:has(.mfdetail:not(:empty))`). `:empty` hides the pane on a row with no children —
  Explorer has nine of them — and a card left square on the side with nothing beside it reads as
  clipped rather than as joined. Probed both ways: `0px` with a pane, `0 8px 8px 0` without.
- ⚠️ **The master's `box-shadow` casts straight onto the pane** (`10px 0 30px`). That is covered,
  not clipped: `.mfdetail` is the later sibling and paints its opaque `--pop` over it, so the
  shadow shows only above and below the pane, which is where it belongs. Nothing relies on a
  `z-index` here.
- ⚠️ **Option 1 only** — `#mflyout:has(.mfdetail)` matches in no other option file.

### The rail footer's two rows were swapped (Option 1)

Request, 3 Sep 2026, pointing at the identity row over Approval · Health · Notifications:
*"swap this"*. The quick links lead the footer now and the identity row is the last line of the
rail.

- ⚠️ **THIS DIVERGES FROM THE REFERENCE THE FOOTER WAS BUILT FROM.** Datadog's own rail footer —
  measured in the browser on 2 Sep 2026, which is where this footer's shape came from — puts the
  avatar row ABOVE the hairline and Invite · Support · Help below it. Recorded as a stated
  divergence rather than left looking like a copy. It does put identity at the very end of the
  rail, which is the edge `#userPop` opens from (`bottom:10px`).
- ⚠️ **THE HAIRLINE MOVED WITH THEM** — `.squick`'s `border-top` became a `border-bottom` (and its
  `padding-top` a `padding-bottom`). The rule belongs BETWEEN the two blocks; left on top it would
  have drawn a second hairline 8px under `.sfoot::before`, the footer's own top rule, with nothing
  above `.squick` left to separate it from. The 4px side margin is untouched, so the rule keeps
  its inset. `.sfoot .sitem`'s margin went 6px → 8px so the rule sits centred between the two.
- ⚠️ Nothing else moved: the same three ids, handlers and tooltips. `showView()` still reaches
  `#sbApproval` / `#sbHealth` directly, the bell still carries `#nbadge`, and collapsed the row
  is still ONE column so all three stay reachable at 64px.
- Verified: order `squick` then `sid`; the rule is a 1px bottom border with 8px either side; all
  four footer controls hit-test to themselves; Approval and Health still light on navigation;
  `#userPop` still opens 10px off the viewport bottom; collapsed the bell is still on screen.
- ⚠️ **Option 1 only** — `.squick` exists in no other option file.

### The Settings category list collapses to an ICON RAIL, not to nothing (all five options)

Request, 3 Sep 2026: *"when I collapse the setting sub module it doesn't hide fully — show the
sidebar by default icon"*. The head's `‹` used to take `.stnav` to 0px, which is what the live
splitpane does — but live has no glyph per category to fall back on, and this list does: the
product's own 19 icons in `ST_ICO`. Collapsed it is now a **52px column of 32px tiles with 20px
glyphs**, the numbers Option 5's rail and the Layout drawer's `»/«` already use, so it reads as
the same object as the rails beside it rather than a third size.

- ⚠️ **A TILE NAVIGATES, IT DOES NOT FOLD.** `stCatTap` toggles the category's pages while the list
  is expanded and goes to the category's first page while it is collapsed (keeping the current
  page when it is already the current category). One element, two states, the behaviour that
  makes sense in each.
- ⚠️ **THE TOOLTIP COMES FREE, AND IT IS SILENT WHILE THE NAME SHOWS.** Every header carries
  `data-tip` = its own name; `tipRedundant` suppresses a tip whose text is readable on the
  element, and `.nm` is `display:none` collapsed, so the tip speaks only then. ⚠️ A probe that
  hovers a tile and re-expands the list before the engine's **320ms** timer fires sees no
  tooltip — that is the suppression working, not a bug. It cost one phantom failure on all five
  files; check the tooltip at t+500ms *before* re-expanding.
- ⚠️ `.stcat.cur` is emitted in both states and styled only in the collapsed one — expanded, the
  lit page (`.stsi.on`) already says where you are, and lighting its parent would say it twice.
- ⚠️ `#view-settings.stshut .stsub` outranks `.stcat.open .stsub` on the id, which is what keeps
  an open category's pages from spilling out of a 52px column.
- **The right border STAYS** — the collapsed state is a column too, so the rule still has an edge
  to sit on. This reverses the older note at `.stnav` that it "must go when the list collapses".
- **In all five files**: Options 1 and 5 read it from `_settings-module.*`; Options 2, 3 and 4
  carry the inline copy. The `stfullpg` full-page screens still hide the list entirely.
- Verified per option with a 26-assertion probe: 246 → 52 → 246px, border kept, search and
  names hidden, 19 tiles at 32×32 each with a glyph path at 20px, an open category's pages
  hidden, the current tile lit, the last tile hit-testable, a hit-tested real click on a tile
  landing on its first page with the list still collapsed and the lit tile following, the head
  button reading *Show settings menu*, the tooltip naming the category; both themes screenshotted.

### Verification notes from this pass

- ⚠️ **Headless Chrome here prints the DOM and then does not exit.** Every `--dump-dom` probe
  reported `TIMEOUT (killed)` AND a full verdict — the probe is fine; the process is not. A
  runner that waits for exit before reading stdout hangs for the whole timeout with the answer
  already in the pipe. `Popen` + `communicate(timeout)` + `killpg`, then parse.
- ⚠️ **A filtered view of a function hides the anchor you are about to edit against.** A `grep
  -v` that dropped comment lines showed `mfClamp();` and `mfDetailAlign(k);` as adjacent; on
  disk a comment sat between them and the replace matched nothing. Print the exact lines.
- The hover bug was invisible to synthetic `mouseenter` dispatch (the probe drove the handler
  and the pane changed); only hit-testing the rows and logging the box's top across the sweep
  found it. A green probe is not a working feature, again.

## Option 6 — the card sidebar (`dashboard-card-sidebar.html`, 3 Sep 2026)

Built from **Plain's Sidekick workspace** (`app.plain.com/workspace/…/sidekick/`), **driven live
in the browser and measured off its DOM** at 1710×951 — unlike Option 5, which was read off a
Mobbin still. The page is **Option 5 with a different sidebar**; its `pl*` block was replaced
wholesale by `sk*` and nothing else in the file was touched, so the AI panel, Log Explorer,
Settings and the canvas are Option 1's as before ("the list of module is option1 for reference").

### Why it is a sixth answer

⚠️ **THE FLOATING CARDS WERE REMOVED ON 5 Sep 2026** (request: *"remove the box, it will show as
option 1"*). Both surfaces are flush to the viewport now — no 8px gutters, no radius, no ring —
and the sidebar is divided from the canvas by a border, as in every other option. **That was what
made this a distinct answer**, and it is honest to say the page is now closer to the others: what
remains its own is the rail + column pairing and the **"Next steps" card at the column's foot**,
which is the one card still on the page and the only option with a place for what the workspace
still has to do.

What the cards were, for a revert: the sidebar inset 8px from a `--panel` page at radius 12 with
a 1px ring plus a 1px drop, and the content beside it a second card of the same make. The tokens
survive — `--sk-gap`, `--sk-r`, `--sk-ring` are kept and unreferenced.

| part | measured off Plain | here |
|---|---|---|
| card | `8px` inset, radius 12, `0 0 0 1px rgba(32,39,44,.08), 0 1px 1px` | **removed 5 Sep 2026** — flush, with a border |
| rail | **65px**: 40px mark at y=20, then 32px tiles on a **40px pitch**, 18px glyphs, active `#e7e7ef` | 64px; the active tile is **`--action` / `--action-fg`** since 7 Sep 2026 (request: *"the sidebar active color is use #1d2a3e"* — `--action`'s light value exactly, inverting to #cad3e2 in dark). It was `--chip`, the hover's own grey. The expand tile's chevron is **16px** since 8 Sep 2026, matching the header's collapse |
| rail foot | rocket + green count · bell · `?` · 40px radius-8 avatar, **44px pitch** | **Iris · Health · Next steps · Approval · Notification · avatar**, 32px tiles on an even 12px gap (Documentation moved to the column foot 4 Sep 2026; Next steps arrived 8 Sep; Iris joined them 8 Sep, see below) |
| column | 281px: header 14px/550 over a 12px line, **no controls** | **296px** since 7 Sep 2026 (the DOCS chip and reserved slots, see the port note), second line derived (see below) |
| row | **36px**, radius 8, glyph at **+11**, text at **+40**, active a lavender pill | `--sel` fill with **`--action` ink** since 7 Sep 2026 (request: the active row "is change the #1d2a3e"; it was `--teal`, which the column keeps for its create rows). A section row's active tile takes the same pair |
| section | "Active" 12px/550 over 24px, `+` at its right (24px, radius 6), 16px above | same, and the `+` is real (below) |
| section row | glyph in a tinted **18px radius-4 tile**, text 12px/550 | `--chip` tile, `--teal` when the row is active |
| column foot | right-aligned 32px icon buttons in 8px of padding | Next steps (rocket + count) · Documentation · Settings — the collapse is the header's |
| Next steps | ring, radius 10, 16px pad, 20px/400 title, ✕ at (7,7), four **34px** rows, a **4px** track | same, title 17px/500 (see the type note) |
| trial line | 12px, underlined link, 20px above the card's bottom edge | a licence line |

- ⚠️ **THE PAINT IS THIS FILE'S TOKENS.** Plain is light-only; none of its hexes are in the file.
  In DARK the card is `--card` against a `--panel` page — three points apart — so **the ring is
  what draws the card**, which is exactly what an 8%-alpha ring does on Plain's near-white page.
- ⚠️ **TYPE IS RESCALED, GEOMETRY IS NOT.** Plain sits on a 14px base and this prototype on Inter
  12, so rows are 13px and the card title 17px/500 against its 20px/400 — but every box, gap,
  radius and pitch is the reference's own number. Inter is loaded at 400/500/600/700, so Plain's
  550 is 600 here.
- ⚠️ **`--rail-w` IS THE WHOLE LEFT CHROME — card + both gutters (361px)**, not the card's width.
  `railWidth()` answers "how much of the left is not canvas" for `.shell` AND for the Agentic AI
  drawer's `agCfgSize()`; give it the card alone and the drawer opens 16px too wide.
- ⚠️ **`.main`'s `overflow:hidden` WENT WITH THE CARDS.** It existed only to round the corners of
  what sat inside it, and it was safe only because a `position:fixed` descendant is not clipped by
  an ancestor's overflow. It is gone, so a merely-absolute child is no longer at risk either.
- ⚠️ **`--rail-w` IS THE SIDEBAR'S OWN WIDTH AGAIN** (it was width + both gutters). `railWidth()`
  and the Agentic AI drawer's `agCfgSize()` both read it, so the drawer follows automatically.
- ⚠️ **THE PEEK KEEPS ITS SHADOW.** It floats over the board, so a hairline alone would let the
  canvas read through the gap — the one place a raised edge is still doing work on this page.
- **The section `+` is the section's own create action.** Where a `SUBNAV` group carries a
  `plus` row (NOC View's *＋ New NOC view*), that row becomes the header's `+` instead of a row
  of its own, so "create" sits with the thing it creates — Plain's *Active +*. The **primary
  list keeps its "New …" row**: it has no header to hang a `+` on. There are probe assertions
  that the promoted row is not also rendered below, and that a group without one (Reports) gets
  no `+`.
- **The header's second line is derived, never invented.** Plain shows the workspace there; this
  product has no workspace, so `skSubtitle()` counts what the column is showing — `10
  sub-modules` for Explorer, `19 categories` for Setting, `N pages` elsewhere, from the same
  arrays the rows come from.
- **"Next steps" is four REAL destinations** — Discovery Settings · User Settings · Agentic AI ·
  Policy Settings, each opened with `stOpen()` and wearing that category's own harvested glyph.
  ⚠️ **A step is marked done when it is VISITED.** The prototype cannot know that a discovery ran
  or a user was invited, and claiming otherwise would be inventing product state. The ✕ dismisses
  the card and the rail's rocket brings it back, its badge counting what is still open — Plain's
  "N steps remaining".
  ⚠️ The progress fill is `width:%` on a block child, never `flex` — the recorded `flex:50` bug
  would paint every card complete.
- ⚠️ **`#sbApproval` / `#sbHealth` / `#sbBell` / `#sbUser` ARE STATIC MARKUP.** `showView()`
  toggles `.on` on the first two BY ID and `init()` runs before this block's first paint, so they
  cannot live in anything `skPaint` rebuilds; `refreshUser()` writes into `#sbUser .miniav` and
  `stSeed()` reads `#sbUser .lbl` (kept, hidden). That is the same trap Options 4 and 5 record.
- ⚠️ **The column starts COLLAPSED** (request, 5 Sep 2026: *"by default it will be collapsed"*).
  This reverses the original reading, which kept it open because "the sidebar being reproduced is
  the open one". Boot is the 64px rail; the column is one click of the header's `»` away and the
  hover-peek shows any module's navigation without docking it. `<body class="skshut">` and
  `SK.col:true` carry the same default and both are needed — the class paints the first frame,
  the flag is what the toggles read.
- Collapsed it is the 64px rail, still a card, with the same **hover-peek** Option 5 has: the
  same column un-hidden and taken out of flow beside the rail, so the canvas never reflows on a
  hover. `mfOpen` / `mfOpenUtil` / `mfLater` / `sbHover` are stood down; `mfHide` is not.
- Verified with a **63-assertion probe** — every measurement in the table above, hit-tested
  clicks on a step, the ✕, the rocket, the collapse and the expand tile, the peek, the Setting
  and Explorer columns, and label fit — plus `harness … query` **77/77**, `lxbehave` **57/57 ×6**,
  both themes screenshotted. ⚠️ One probe assertion was wrong, not the page: it expected Explorer
  to say *11 sub-modules* from a CLAUDE.md line that counts Report, which is a rail entry;
  `EXPLORER_TREE` holds 10.

### The profile and notification popovers open beside the RAIL (8 Sep 2026)

Request: *"the popup will open behind the icon, overlapping [the column]"*. `togglePop` places them
at `#sidebar.offsetWidth + 10`, which is right in Option 1 — there the sidebar **is** the rail. Here
the sidebar is rail + column, so a card summoned from an icon at x≈32 opened ~370px away, past
everything, with the whole column sitting between the control and its own menu.

- `togglePop` is **wrapped, not re-implemented**, and re-places the card at `--sk-rail +
  SK_POP_GAP` = 76px.
- ⚠️ **`SK_POP_GAP` IS ONE CONSTANT FOR EVERY CARD THE SIDEBAR SUMMONS** (request, 8 Sep 2026: the
  level-1 popovers "will show at the same space of 12px"): the profile and notification popovers,
  the Next-steps card and Explorer's module grid. It was `10` written out in four places, so four
  cards opened from one rail could drift apart. **Level 1 anchors to the RAIL, the two cards anchor
  to the whole sidebar** — that difference is deliberate and stays: a popover belongs beside its
  control, while the cards belong beside the navigation they extend.
- ⚠️ **It reads the TOKEN, not a measured box** — `.skside` transitions its width when the column
  folds, and a rect read mid-transition reports the old number (this folder's oldest trap). It is
  74px in both column states.
- ⚠️ **Overlapping the column is the point, not a side effect**: a popover belongs beside the control
  that opened it, and the column behind it is not what you are using at that moment.
- ⚠️ A probe that measured `.skrail`'s own rect instead reported 11px when collapsed and looked like
  a bug: `.skrail` is `flex:1 1 auto` inside a border-box sidebar, so its content edge is 63, not 64.
  Assert against the token.

### Explorer's module grid, and search back in the column header (8 Sep 2026)

- **The column header is `search · collapse`** — the icon arrived on 8 Sep (*"when I expand the
  sidebar the search icon also shows after the collapse icon"*) and the two were **swapped** later
  the same day (*"swap the icon"*). The 8 Sep rule that took the search FIELD off every column but
  Setting stands; this is the **icon**, in the header's control cluster, on every expanded column,
  opening the same spotlight ⌘K does. Search leads because collapse acts on the column itself, so
  the control that folds it sits at the column's own outer edge — and search now keeps the same
  slot the rail's tile takes when the column is shut.
- **THE RAIL CARRIES SEARCH ONLY WHILE THE COLUMN IS SHUT** (`.sksrch`, request 8 Sep 2026: *"when
  the sidebar will be collapsed the search icon show before expand icon"*). It had been removed
  outright hours earlier — *"when I expand the sidebar the search icon shows [in the header]
  behind, so remove the main sidebar [one]"* — because the header had just gained one and two
  magnifiers sat eight pixels apart.
  ⚠️ **BOTH REQUESTS ARE SATISFIED BY THE SAME GATE, which is why this is not a revert**:
  `body.skshut` shows the rail's tile, and that is exactly the state in which the header is not on
  screen. There is a probe assertion, in both column states, that **exactly one magnifier is
  visible** — that is the invariant, not the presence or absence of either control.
  ⚠️ **IT LEADS THE EXPAND TILE**, mirroring the header's own order, so the magnifier holds its
  slot as the column opens and shuts.
  ⚠️ **SAME GATE AS `.skexp`, deliberately** — `display:none` plus a `body.skshut` rule. A JS test
  would have to be re-evaluated by every path that folds the column; the class is the one thing
  every path already agrees on.
  ⚠️ **IT IS NOT `#sbSearch`.** `init()` touches that id off a Mac, and its removal is why those
  lookups were guarded in all six rail files on 5 Sep — reusing it would put a keycap swap back on
  a tile with no room for one. A probe forces `navigator.platform` to `Win32` to prove the guard
  still holds.
- **Hovering Explorer's rail tile opens the module GRID** (`skGrid` / `.skgrid` / `#skGridPop`),
  from a supplied ClickUp reference: its eleven sub-modules as icon-over-label tiles, three to a
  row, over a **Customize navigation** button. ⚠️ **HOVER OPENS IT AND THE COLUMN PEEK DOES NOT RUN
  FOR THIS TILE** (request, same day: *"when I hover the Explorer icon don't show [the peeked
  column], show only [the grid]"*). Every other tile still peeks; this is the one module whose
  contents have a second, better view. ⚠️ **Click now only navigates** — it used to toggle the grid
  as well, which fought the hover: clicking a tile whose grid was already open would have closed it.
  ⚠️ The grid keeps the Next-steps card's grace period, and **hovering any other tile closes it**,
  or it would hang over the column that tile is peeking. ⚠️ Its tiles come from `EXPLORER_TREE`, the same source the
  column lists, so the two cannot disagree; a tile navigates through `mfGo`, so Geo Map toasts there
  exactly as its row does. ⚠️ **Customize navigation opens the Layout drawer's Sidebar tab**
  (`layOpen(); layTab('sidebar')`) — that screen already IS "customise navigation": hide, reorder,
  pin, choose what opens on sign-in. ⚠️ It is not a `.pop`, so `closePops()` does not know about it;
  it carries its own capture-phase `mousedown` click-away.

### Next steps is a rail tile with a hover card (8 Sep 2026)

Request: *"Next Steps will be shown after the Health icon, as a module icon, and I hover it to show
a small popup with all the next steps"*. It was a `.skfb` in the column's foot opening a card parked
above the licence line — a permanent card holding four rows you visit once each.

- **The tile is `.skib` in `.skrfoot`, directly after Health**, and **keeps the old ids**
  (`skTour` / `skTourIc` / `skCnt`), so `skFootPaint`'s icon list and `skCntPaint`'s badge and
  tooltip work unchanged — only the class and the parent moved, exactly as Health and Approval did
  on 4 Sep.
- **The card is `#skNsPop`, appended to `<body>`** (260px beside a 64px rail), tracking the tile
  vertically and clamped to the viewport. ⚠️ **HORIZONTALLY IT CLEARS THE WHOLE SIDEBAR, NOT THE
  TILE** (reported 8 Sep, "the popup opens not proper"): the tile is 32px centred in a 64px rail, so
  `tile.right + 10` put the card **inside the rail, over the icons**. ⚠️ **The width comes from the
  `--sk-rail` / `--sk-nav` TOKENS and `body.skshut`, not from a measured box** — `.skside`
  transitions its width when the column folds, and this folder's oldest recorded trap is that a rect
  read mid-transition reports the old number. ⚠️ **`visibility`, not `display:none`** — `skNsPlace`
  measures it to position it, and a `display:none` element has no box (the `kbPopOpen` lesson).
  ⚠️ **Measure, place, THEN reveal**, or it transitions in at the previous position.
- ⚠️ **The hover follows this file's `kbPop` rules**: opening is delayed 140ms so sweeping the rail
  does not flash a card, and closing is **deferred 200ms and cancelled by the card's own
  `mouseenter`** — the pointer has to cross the gap, and a plain `mouseleave` would shut it
  mid-journey (the rail-flyout bug). **Click toggles it as well**, since hover alone is unreachable
  by keyboard or touch.
- **The badge reads `done/total`, not what is left** (request, 8 Sep 2026: *"the icon will show
  0/4"*). It said `4` — a bare number on a green disc reads as "4 new things" when it meant "4 still
  to do"; `0/4` says exactly what the card's foot says, and the two agree by construction.
  ⚠️ **It still hides once everything is done** — the badge exists to say there is something left,
  and a permanent `4/4` is a sticker. ⚠️ The pill's padding went to 4px: it carries three characters
  now, measured at **24.5px on a 32px tile**, so it still sits inside the tile's own box.
- ⚠️ **THE BADGE IS PAINTED BY `skFootPaint` NOW.** `skNsPaint` used to end in `skCntPaint()` and ran
  on every `skPaint`; it only runs when the card opens, so the tile carried no count until the first
  hover — caught by a probe, not by eye.
- **The card was then rebuilt to a supplied reference** (same day): title **Suggested next steps**
  over *"Optional — do these anytime."*, a ✕ in the corner, each step showing **Done** in `--green`
  where it is finished and the product's `long-arrow-right` where it is not, and a foot of
  *"N of 4 done"* against **Don't show again**. ⚠️ That control **hides the rail tile for the
  session and nothing brings it back** — which is what the words promise; a real product would
  persist it and offer it in Settings. Stated rather than softened.
- ⚠️ **THE TILE CARRIES NO `data-tip` AND NO `title`** — the delegated tooltip engine fires on either
  and opened a tooltip UNDER the card on the same hover (reported with a screenshot). `aria-label`
  names it, and `skCntPaint` writes the count there instead. **This is the same rule Option 1's
  shortcuts popover already records**, hit a second time.
- ⚠️ **Its glyph is `onboard`** — the product's own `file-document/clipboard.svg`, a checklist board.
  It was `tour` (stacked cards), which read as "windows", not "things to finish".
- The column foot is **Documentation · Layout** now, and the licence line stayed. `skNsTog`,
  `SK.ns` and `.skns` are kept, unreferenced.
- ⚠️ **Option 9 was copied BEFORE this change** and still has the card in its column — the
  "nothing syncs them" warning, one change old.

### Section headings fold, and the foot gains the Layout drawer (8 Sep 2026)

- **Every `.sksec` heading folds its rows** — *"add expand and collapse in Scheduled Reports"*. Every
  one, not only that section: a column where one heading folds and the others do not reads as a bug,
  and it is what Option 5's `.plsec` has always done. The caret is the same product chevron the rows
  use, down while open and right when shut.
  ⚠️ **The key is `<module>›<heading>`**, not the heading alone — two modules can name a section the
  same thing and one fold must not close the other's. There is a probe assertion that folding
  Report's section leaves Dashboard's NOC View open.
  ⚠️ **The heading is a `<div role="button">`, not a `<button>`** — it may still carry the promoted
  `+` (SLO's *＋ New SLO*), and a button inside a button is the nesting this file records twice as
  eating the clicks. `.skadd` stops propagation so the `+` cannot also fold the section.
- **The column foot gains the Layout drawer**, in the slot the Settings gear left — *"add layout
  setting icon"*. It calls the same `layOpen()` the dashboard toolbar and the Manage screen use: one
  drawer, three doors. ⚠️ **Its glyph is `columns`, not `sliders`** — the toolbar marks this drawer
  with Lucide `sliders-horizontal`, but this column already spends `sliders` on *Manage dashboards*
  and *Manage NOC View*, so the same glyph would mean two things on one screen. `columns` is the
  product's own `navigation-layout/columns.svg`, already in `ICONS`.

### Four more column changes (8 Sep 2026)

- **The search field is the Setting column's only** — *"remove the [search] everywhere, don't
  remove only [in the] setting module"*. The 7 Sep UX pass had put it on every column (UX Planet
  rule 10); Setting is the one with 19 categories to hunt through. ⚠️ **Nothing became
  unreachable**: ⌘K / Ctrl K opens the same spotlight from any column and the rail's Search tile is
  untouched. This is a deliberate retreat from rule 10 in seven of the eight columns.
- **The section tile has breathing room** — *"improve background colour"*, pointing at these. Once
  the glyph grew to 18px (below) it filled the 18px tile edge to edge and the fill read as a smudge
  behind the icon, not a tile. It is **26px around an 18px glyph with a 18px FOOTPRINT**: `margin:0
  -4px` cancels the 8px it gained, so the row's text still starts at 40px and the glyphs share a
  left edge with the plain rows'. ⚠️ `flex:0 0 26px`, not a `width` — **a flex basis beats a width**
  (recorded at `.aihm button svg`); left at 18 the tile stayed 18px and the negative margins dragged
  the text 8px left. ⚠️ **The fill is still `--chip`, measured**: 1.19 contrast against the column in
  light and 1.55 in dark, the only neutral visible in BOTH — `--hover` is 1.10 / 1.07 (gone in dark)
  and `--track` 2.57 / 2.56 (a slab). One token if it should be lighter.
- **One icon size in a column** — *"same icon size in NOC View or dashboard list"*. A section row's
  glyph was 12px inside its 18px tile while a plain row's was 18px, so two groups in one column drew
  their icons at visibly different sizes. The tiled glyph is 18px now and fills its tile; the
  product's glyphs are on a 48 grid with their own margin, so they do not touch its edges. **The
  tile still marks a section row — the size no longer does**, and the text x is unchanged in both.
- **The Next steps card has no progress bar** — *"remove the line"*. The same fact is already in two
  places: each done step wears a green tick, and the rail's rocket carries the count of what is
  left. `.skbar` is kept, unreferenced.
- **Explorer has an eleventh row, `Geo Map`** — *"in explorer add Geo Map"*, with the product's own
  `location-pin` glyph (added to `ICONS` as `geo-map`, `{viewBox, paths}` like every other entry —
  ⚠️ **this registry holds objects, not SVG strings**, unlike Option 5's; a string entry renders
  nothing and `ico()` gives no error). ⚠️ **It has no screen and no docs page** — there is no Geo Map
  module in `MODULES` and nothing in the harvested sitemap answers to it — so the row toasts that it
  is not built rather than navigating somewhere it is not. **Do not point it at the Topology map**:
  that would claim the two are the same screen. Appended rather than slotted beside Topology; one
  line to move if it belongs there.

### The documentation footer and the foot's Settings gear are gone (8 Sep 2026)

Two removals, both Option 6 only:
- **`<Module> documentation ↗`** at the foot of the three flat menus (Dashboard · SLO · Report) —
  *"remove the document link in everywhere"*. `skDocsFoot` / `SK_BOOK` / `.skdocf` are **kept and
  unreferenced**, the house pattern, so it is one call away. ⚠️ **The other two documentation
  surfaces are untouched**: the `DOCS ↗` chip on the tree menus' rows (Explorer · Alert · Setting)
  and the `?` button in the column foot, which still opens the product docs.
- **The Settings gear in the column foot** — *"remove the setting icon"*. The foot is Next steps ·
  Documentation now. ⚠️ **Settings is not stranded**: the rail carries its own `Setting` entry, the
  door every other module uses. `skFootPaint` already guarded for the missing node, and the `.on`
  light it used to paint while you were in Settings goes with the button.

### The expand and collapse icons are one size (8 Sep 2026)

Request, pointing at the column header's collapse button and the rail's expand tile: *"the expand
and collapse icon size will be same"*. They were **14px** (`.skhb svg`, the header) against
**18px** (`.skexp svg`, the rail tile, sized like a module glyph). Both are **16px** now — the
chevron is chrome, not a destination, so it stays a step under the 18px module glyphs (Option 5's
own rule for its `.plexp`), and the two halves of one control agree. ⚠️ Options 5 and 8 carry the
same 14 / 18 pair (`.plhb svg` / `.plexp svg`) and were not touched.

### The Report column has two sections under the types (8 Sep 2026)

Request: *"in report module add new section 'Create Custom Report' and 'Schedule report' — in
schedule report list has show favorite report"*. Under the ten report types:
- **Create Custom Report** — **one full-width primary button at the TOP of the column** (`SK_CTA`
  / `.skcta`, on the `--action` pair), the request's second form later the same day: *"create
  custom report section in top and show as 'Create Custom Report' button"*. It shipped for an hour
  as a titled section of the docs' fourteen custom report types, one create row each — fourteen rows
  for one action, pushing the favourites below the fold. `RPT_TYPES` is kept, unreferenced, for a
  type picker if the create form is ever built. ⚠️ The prototype has no create-report form: the
  button opens the Reports module and says so in a toast — the house pattern for a screen that is
  not built, never a silent no-op. `SK_CTA` is per module; only Report declares one.
- **Scheduled Reports** — the reports you have STARRED (`REPORT_FAVS`, four of the docs' own report
  titles, the `star` glyph). The docs' Favorites is "reports you've starred for quick access", and
  Schedule is each report's own delivery toggle; the request's "show favorite report" is that list.
  Titled with the product's word ("Scheduled Reports"; the request wrote "Schedule report").
⚠️ **THE COLUMN READS: BUTTON → SCHEDULED REPORTS → THE TEN TYPES.** The favourites were moved
above the module's own list first (*"the 'Scheduled Reports' will be show before 'create custom
report'"*) and the button was then put back on top ten minutes later (*"the create custom report
will be show on top"*) — the one thing you press to MAKE something leads, then what you have
starred, then everything the module has. **Both requests are recorded; don't swap them back on the
strength of one.** `SK_TOP` names the section a column
lifts; `skSecHTML` — extracted from `skBodyRest`'s map — renders it in both positions, so heading,
tiles and `+` promotion cannot drift, and `skBodyRest` filters it out of its usual place so it
cannot render twice. ⚠️ **The filter runs BEFORE the map**: `titled` is `si > 0`, so removing a
later section must not promote the module's own first section into a headed one.
⚠️ `.skbody > .sksec:first-child` drops the 16px group gap to 2px — that gap separates a group from
the rows above it, and at the top of the column there are none.
⚠️ **THE MODULE'S OWN LIST IS HEADED `Report Types` NOW** (request, 8 Sep 2026: the starred reports
and the types "both are different, make it difference" — they ran together as one list with nothing
between them). Two changes, both small: the first section prints its heading **when a section is
lifted above it** (the rule that suppresses it exists because it would repeat the column title
directly beneath it — with something in between, it has to name where it starts), and `skSecHTML`
now takes **`titled` and `grp` as two questions** rather than one flag, so the list gets the heading
while its rows stay PLAIN. The tiles and the 600 weight are what say "starred"; making the types
tiles too would have been the opposite of the request. `grp` also gates the `+` promotion.
⚠️ The heading text is the docs' own `Type` field ("the category of data displayed, for example …
Flow Analytics, Log Compliance, NCCM, APM"), not `Reports`, which would name nothing under a column
titled *Report*. It is **invisible in every other option**, which renders this list first.
⚠️ **Consequence, stated rather than resolved:** the module's own ten types begin below six rows.
⚠️ The 16px above the lifted section COLLAPSES with the button's 10px bottom margin to one 16px gap
— the standard group step, not 26px; `.skbody > .sksec:first-child` drops it to 2px only when a
lifted section leads (no button). The subtitle counts 14 pages; the docs footer stays
(Report is a flat menu). Option 6 only.

### NOC View carries Create and Manage rows (8 Sep 2026)

Request: *"the NOC View add 2 new 'Create NOC View' & 'Manage NOC View'"*. The group is now
`NOC view list · Create NOC View · Manage NOC View`. **The header's `+` went with it**: the create
action had been a `plus` row, which this column promotes into the section header (Plain's
"Active +"), and an explicit Create row beside that `+` would be two doors to one form — the row
replaces it (kind `null`, so it is not promoted). Create opens the NOC create form (`openNocNew`).
⚠️ **Manage lands on the Manage DASHBOARDS screen** (`openManage`): the prototype has no NOC manage
screen and that grid lists `DASH_GROUPS`, not `NOC_VIEWS` — a NOC tab there is the thing this row
now asks for. The subtitle counts 5 pages. Option 6 only.

### A click inside the sidebar no longer closes the popover it just opened (8 Sep 2026, all eight options)

Found while verifying the NOC rows above, and **pre-existing** — the old section `+` had it too,
proved against the pre-session copy. The page's document click handler closed every `.pop` unless
the click came from a `.pop` or a rail **`.sitem`**; a column row (`.skrow`, `.plrow`, `.nxrow`,
`.mrr`, `.mpi`) or a flyout row is none of those, so it ran in the same bubble as the row's own
handler and shut the NOC create form before it painted. The exemption now covers `.sidebar`,
`#mflyout`, `#mpanel` and `#mrNav`. A click on the canvas still closes, and the rail-tile paths
still open — probed both ways. The same one-line handler was in all eight files and is fixed in all.
⚠️ **Any action a sidebar row opens a popover with had been silently dead in Options 2–8** until
this; it only looked like "the row does nothing".

### The Dashboard column has no Reports group (8 Sep 2026)

Request: *"remove report in option 6"*, pointing at the REPORTS section (Report list · Scheduled
reports) under NOC View. It was the leftover Option 4 removed on 3 Sep: a group tucked under
Dashboards from the seven-entry rail that had no Report entry. The rail has carried `Report` since
23 Aug with a column of its own, so the group filed reports under the wrong module. **Data only** —
the section left `SUBNAV['Dashboards']` in this file; the subtitle now counts 3 pages.
⚠️ Options 1 · 2 · 3 · 5 · 7 · 8 still carry it in their own `SUBNAV` copies.

### Option 5's 7 Sep column changes, ported (7 Sep 2026)

Request: *"in option 5 all changes is done, those changes also apply in option 6"*. Everything the
Option 5 section above records for 7 Sep is in this file's `sk*` block now, same code in the `sk`
namespace, differing only where this column's markup does. Read the reasoning there; here is the map:

| Option 5 | here | note |
|---|---|---|
| `PL_CV` / `.plcv` / `.plopen` | `SK_CV` / `.skcv` / `.skopen` | row chevron on Monitor · NCCM · NetRoute · APM · Real User Monitoring |
| `.pldoc` / `plDocChip` / `plRowDoc` | `.skdoc` / `skDocChip` / `skRowDoc` | DOCS chip on Explorer · Alert · Setting rows |
| `.plfoot` / `plDocsFoot` | **`.skdocf`** / `skDocsFoot` | ⚠️ renamed: `.skfoot` is this column's own icon-button foot |
| `.plpin` / `plPinBtn` | `.skpin` / `skPinBtn` | Explorer rows only; pinned tiles on the rail as `.skib.skpinned` |
| `.plend` + `.ph` | `.skend` + `.ph` | the aligned cluster; 5px inside, the row's own 11 outside |
| `plAlertTree` / `plTreeFor` | `skAlertTree` / `skTreeFor` | Alert folds its three parents |
| `railPinToggle` wrap → `plPaint` | → `skPaint` | |

- ⚠️ **No section-caret change here** — this column's sections have no caret (they carry Plain's
  `+`), so the `PL_CAR` swap has no counterpart.
- ⚠️ **`--sk-nav` went 281 → 296px.** 281 was Plain's measured column; with the in-flow chip and
  the reserved count slot + chevron box, `Real User Monitoring` clipped by 3px, so 296 with 12 in
  hand. Everything else reads the token.
- Verified by the Option 5 probe mapped onto this namespace — **73 assertions**, all passing
  (the section-caret block removed, row padding 8 not 9) — plus `harness … query` at the new
  width, both themes screenshotted.

### Level 3 — Explorer's grid pins, and lends the rail an icon (Option 6, 8 Sep 2026)

The user's own three-level model, stated on 8 Sep 2026: **level 1** is a single-click utility
popover (notifications, profile, Approval, Health); **level 2** is module → column → screen;
**level 3** is *"when I click the Explorer icon it shows a popup of the sub modules, and I click
to open a module and the icon will be added automatically in the sidebar, and I go to another
module the added module will be removed."* Levels 1 and 2 already existed. This built level 3, and
finished the grid the same day it was asked for.

| the ask | what it is |
|---|---|
| *"the level 3 popup will be open behind the 12px"* | `#skGridPop` opens at **`--sk-rail + SK_POP_GAP`**, over the column |
| *"add pin & unpin option"* (ClickUp's inbox as the reference) | a pin per tile, `railPinToggle`, hover-revealed |
| *"the icon will be added automatically in the sidebar"* | `SK.tmp` → a **`.skib.sktmp`** tile under Explorer |
| *"I go to other module the added module will be removed"* | `skTmp()` — derived, never cleared by hand |

- ⚠️ **THE GRID NOW OPENS AT `rail + 12`, NOT PAST THE WHOLE SIDEBAR.** It was
  `rail + nav + 12`, so with the column open a card summoned from a tile at x≈32 landed **~370px
  away**, with the column stranded between the control and its own menu. The profile and
  notification popovers were moved for exactly this reason hours earlier; this applies the same
  rule to the third level, so **all four cards this sidebar summons now land at one offset** —
  there is a probe assertion comparing the grid's left edge to `#userPop`'s (both 76 at
  `--sk-rail:64`).
- ⚠️ **THE PIN IS THE SAME `railPinToggle` EVERYTHING ELSE DRIVES.** `RAIL_PINS` holds labels
  resolved through `EXPLORER_TREE`, so the grid, the column's `.skrow .skpin`, the rail's pinned
  band and the Layout drawer's Sidebar tab cannot disagree about what is pinned. Nothing new was
  modelled.
  - ⚠️ **`event.stopPropagation()`**, or pressing the pin also opens the module — the pin sits
    inside the tile's own `<button>`, which is what puts it on the thing it pins.
  - ⚠️ **A `<span role="button">` with NO `tabindex`**, exactly as the column's `skPinBtn` is.
    Interactive content inside a `<button>` is invalid and eats the clicks. Keyboard pinning lives
    on the Sidebar tab, which is the complete surface for it. Stated, not softened.
  - ⚠️ **A PINNED PIN SHOWS AT REST; the others reveal on hover.** A mark that only appears under
    the pointer cannot report a state, and *"which of these am I already carrying"* is the question
    the grid is opened with. Measured: pinned `.75`, unpinned `0`.
  - ⚠️ **The card repaints IN PLACE after a toggle** (`skGridEl().innerHTML = skGridHTML()`), never
    `skGrid(true)` — that re-measures and moves the card out from under the pointer. `skGridHTML`
    was extracted for exactly this, so there is one renderer.
- ⚠️ **THE TEMPORARY TILE'S REMOVAL IS DERIVED, NOT WIRED.** `skTmp()` answers *"is it still
  true?"* by asking whether its module is the one open, so **every door into a view** — the rail,
  the column, the flyout, a shortcut, `stOpen`, the AI panel — drops it for free. Clearing it from
  each caller would mean finding all of them, and missing one leaves a tile claiming a screen you
  have left, which is the exact failure it exists to avoid.
- ⚠️ **ONE AT A TIME.** `SK.tmp` is a single label, so opening a second sub-module replaces the
  first. A queue of temporaries growing behind Explorer is the clutter pinning already has a
  deliberate control for.
- ⚠️ **A PINNED SUB-MODULE NEVER ALSO GETS ONE**, and pinning the one you are in swaps the
  temporary tile for the permanent one — two tiles for one module would light together.
- ⚠️ **IT IS A DASHED RING (`outline`, not a border), NOT THE PIN MARK.** The two are on the rail
  for different reasons — one you chose and it stays, one arrived with the screen and leaves with
  it — so they must not look the same. `outline` because a border would shrink the 32px box and put
  this one tile's glyph a pixel off every other one's. It renders `.on`, because `skTmp()` only
  returns a row whose module is open: while it is there, it **is** the module you are using.
- ⚠️ **A ROW WITH AN `act` GETS NO TILE.** `Geo Map` toasts that it is not built and `mfGo` returns
  before any module changes, so a tile for it would stand for a screen that was never opened — and,
  sharing `Monitors` with the `Monitor` row, `skTmp` would have kept it alive on somebody else's
  screen.
- ⚠️ **EXPLORER'S TILE NAVIGATES NOWHERE — IT OPENS THE CARD AND NOTHING ELSE** (request, 8 Sep
  2026: *"when I click the Explorer icon, open only [the popup] — not the main screen"*). Its
  `onclick` ran `pickRail(i)` first, which opened Explorer's own module (Metric Explorer) behind
  the card: you pressed a launcher and it took you somewhere before you had chosen anything.
  **The grid IS Explorer's navigation** — picking a tile is what opens a screen, and `MOD_TO_RAIL`
  maps every sub-module back to Explorer, so the column still lands on Explorer's tree the moment
  you choose one. Every other rail entry is a place to go and still behaves as one.
  Three things follow, and each was a real defect the navigation was causing:
  - ⚠️ **THE TOOLTIP STOPPED PAINTING OVER THE CARD.** Reported with a screenshot after the first
    fix "worked". The engine reads `tipFor` on **`mouseover`** and paints **320ms later**, so the
    `tipFor` wrapper can only refuse a tip it is asked about — and `pickRail` **repaints
    `#skIcons`**, so a brand-new tile appeared under the resting pointer, fired a fresh
    `mouseover` while `SK.grid` was still false, and armed a timer nothing could take back.
    `skGrid(true)` now also calls **`tipHide()`**, which clears the pending timer as well as the
    box, so the card is safe even if something else repaints the rail later.
  - **The level-3 tile survives opening the grid**, so the sub-module you are in stays marked on
    the rail while you browse for another one.
  - ⚠️ **`.skgi.here` IS BACK, AND THE HISTORY IS WHY IT CAN BE TRUSTED.** It was built and removed
    within the hour earlier the same day: while the tile still navigated, you had already left the
    sub-module by the time the card painted, so the mark could never be true — **a probe caught
    that, not the eye**. With the navigation gone the state it reads is true again, and it shares
    `skTmp()` with the rail's temporary tile, so card and rail cannot disagree about where you are.
- **Explorer's tile wears the hover fill while its card is open** (`.skib.gon`). The card is
  anchored to that tile and nothing else on the rail said which one opened it. ⚠️ Not `.on`: that
  is `--action` and means *this module's screen is open*, which pressing this tile no longer does.
  ⚠️ **The class is toggled DIRECTLY (`skGridLit`), never through `skRailPaint`** — a repaint
  destroys the node under the pointer and fires the very `mouseover` that caused the tooltip bug.
- ⚠️ **THE EARLIER "CLICK, NOT HOVER" REVERSAL STANDS** (request the same day, undoing a
  hover-opened version an hour old): the tile's `onclick` toggles the grid, hover on it does
  **nothing** — no grid and no column peek — and every other tile still peeks. `skGridOver` /
  `skGridT` / `skGridIn` are kept and unreferenced. A card you open by clicking must not close when
  the pointer leaves it, so the grid has no mouse listeners of its own; click-away and a second
  click close it.
- Verified by a **41-assertion probe** — the placement against `#userPop`, the pin on all 11 tiles
  in both states and its three consumers, the temporary tile's position/ring/lighting, its removal
  on every route out, the one-at-a-time rule, the pinned-and-temporary exclusion, Geo Map, the
  suppressed tooltip, and click-away — plus `lxbehave` **57/57 ×8** and `harness … query`
  **77/77** on this file, both themes screenshotted.
  ⚠️ **Two assertions failed on working code first, and both were the recorded stale-node trap in
  the PROBE**: `pickRail` repaints `#skIcons`, so a tile captured before the first click is
  detached and `elementFromPoint` on its zeroed rect clicks something else entirely. Re-query the
  rail after anything that repaints it.

### Iris moved from the head of the rail into its foot (Option 6, 8 Sep 2026)

Request: *"the AI icon will show after health"*, corrected minutes later to **"before health"**.
Both are recorded here; **the second is what shipped** — do not "restore" it under Health on the
strength of the first. The foot is now **Iris · Health · Next steps · Approval · Notification ·
avatar**.

- **Why the foot is the right half of the rail for it.** Iris led the rail — the first tile under
  the collapse control, above Dashboard — which put the assistant ahead of every place you can go.
  This rail's head is destinations and its foot is what you **summon**: Next steps, notifications,
  your profile. Iris opens a panel over the board and navigates nowhere, so it belongs with those.
- ⚠️ **IT IS STATIC MARKUP NOW, not rendered by `skRailPaint`.** `#sbAI` is referenced by nothing
  else in this file (grepped before moving it), so the move costs no lookup — and it takes the tile
  out of the per-paint rebuild, which is the mechanism that put a fresh node under a resting
  pointer and armed the tooltip that painted over Explorer's grid an hour earlier. It joins
  `#sbHealth` / `#sbApproval` / `#sbBell` / `#sbUser`, which are static for the same class of
  reason: the host finds them by id.
- ⚠️ **ITS GLYPH IS PAINTED BY `skFootPaint`, NOT BY THE MARKUP.** `AI_SPARK` is the supplied
  `OPS AI.svg` as a raw SVG string in a **later** script block, and markup cannot interpolate it —
  so the tile ships an empty `<svg id="sbAIIc">` and the foot painter fills it. It is written in
  directly rather than through `setIco` because it is not an `ICONS` entry, and it carries the same
  one-shot `if (!e.innerHTML)` guard the other four foot glyphs use, so it is filled once and never
  repainted. There is a probe assertion that the glyph survives two rail repaints.
- The tile keeps `.airail`, so it keeps the AI accent (`--ai-2`) and its own hover wash against the
  neutral tiles either side of it. Measured after the move: 32px tile, 18px glyph, one column with
  the bell, an even 12px gap down all six.
- ⚠️ **Option 6 only** — every other option renders its own rail, and Option 9 (the byte copy)
  still leads with Iris.
- Verified by a **20-assertion probe** (the foot's exact order, nothing left in the head, one
  `#sbAI`, the painted glyph at 18px, the accent, tile parity with Health, the shared x, the even
  gap, opening the AI panel without navigating, survival across a repaint, Health still lighting,
  the Next-steps badge still painting, every tile on screen and hit-testing to itself in both
  column states), plus `lxbehave` **57/57 ×9** and `harness … query` **77/77**; both themes
  screenshotted.

### Pinned dashboards reach this rail at last, before Explorer (Option 6, 9 Sep 2026)

Request: *"when I pin any dashboard it will show before the Explorer icon"*.

- ⚠️ **THEY WERE NOT ON THIS RAIL AT ALL.** `DASH_PINS` was never read anywhere in the `sk*` block,
  so pinning a board from the list panel put nothing anywhere and the feature was **silently
  absent** in Option 6 — it looked like a placement question and was a missing feature. The host's
  `railDashPinsHTML` emits `.sitem` rows the host rail understands and this rail does not, hence
  `skDashPinsHTML`, the tile version.
- **They render before the Explorer tile, above its hairline** — the placement asked for.
  ⚠️ The host's own rule is *"a pin sits directly under the rail row it belongs to"*, which would
  put them under Dashboard. **This deliberately diverges**, recorded so the two are not confused.
- ⚠️ **NOTHING IS FILTERED OUT.** The host's version drops the default board because `renderMenu`
  **lifts** it to the top of the rail; this rail has no lift, so the same filter would simply hide
  a pinned default board.
- ⚠️ **THE GLYPH IS THE BOARD'S OWN TYPE ICON** (`MICON[t]` — System / Mine / Shared), not a second
  `ico('dashboard')`. That is the 2 Sep rule: a pinned board and a pinned sub-module are one row
  shape told apart by their mark, and every board wearing the Dashboard tile's own glyph would
  render the band as identical grids stacked. ⚠️ `MICON` entries are raw `<svg viewBox=…>` with no
  class, so `class="ic"` has to be injected or the glyph renders at natural size and blows the tile
  apart.
- ⚠️ **THE TOOLTIP SEPARATOR IS `" · "`, NOT TWO SPACES.** The tooltip engine renders a
  double-space tail as a **keycap chip**, which would badge every pinned board with a shortcut that
  does not exist. There is a probe assertion that no board tip contains a double space.
- ⚠️ **`DASH_INDEX` / `MICON` / `DTYPE` ARE IN THE NEXT `<script>` BLOCK**, so they are in the
  temporal dead zone while this block first paints. Every read is wrapped in try/catch, which makes
  the fallback structural: no type icon, not a dead page. ⚠️ `typeof X !== 'undefined'` is **not**
  a usable guard — on a `let`/`const` in TDZ, `typeof` itself throws.
- ⚠️ **A HIDDEN EXPLORER MUST NOT TAKE THE BAND WITH IT.** The pins are emitted before Explorer's
  tile, so with Explorer hidden there is no tile to sit before and a pinned board would be
  unreachable from the rail. `dashOut` is the same idempotent flag the host's `pinsFor` uses, and a
  tail fallback catches that case — probed both ways, including that the band is not rendered twice
  when Explorer comes back.
- **Module pins are untouched and still sit under Explorer**, so both bands can be on the rail at
  once and read as what they are. Probed together.
- Verified by a **22-assertion probe** (no band with nothing pinned, one tile per pin, before both
  Explorer and the hairline, the full order, 32px tile with an 18px glyph, the type icon differing
  from the Dashboard tile's, the tooltip and its lack of a keycap, a second pin, a hit-tested click
  opening that board and lighting its tile, unpinning removing it, the hidden-Explorer guard, both
  bands together, and survival across a repaint), plus `lxbehave` **57/57 ×9** and
  `harness … query` **77/77**; both themes screenshotted.

### The rail's shipped order is declared, and Explorer moved (Option 6, 8 Sep 2026)

Asked for as *"the Explorer icon will show **before** the Setting module"* and reversed minutes
later to *"**after** setting"*. The rail reads **Dashboard · Alert · SLO · Report · Setting ·
Explorer** — Explorer is the **last tile**. It shipped above Report and passed through the
between-Report-and-Setting position on the way.
⚠️ **All three positions are recorded on purpose.** The middle one was live for minutes; the last
is what shipped. Do not "restore" Explorer above Setting on the strength of the middle note.

- ⚠️ **`RAIL` ITSELF WAS NOT REORDERED, AND MUST NEVER BE.** `activeRail` and `MOD_TO_RAIL` store
  **indices** into that array, so moving a row there points every module at the wrong rail entry —
  eleven of the sixteen modules resolve through `MOD_TO_RAIL` to Explorer alone. The order is
  declared as **`RAIL_SEED`, a list of NAMES**, which is what `railOrder()` seeds `RAIL_ORDER`
  from — the same record the Layout drawer's Sidebar tab writes when you drag a row, so the shipped
  order and a user's own reordering use one mechanism.
- ⚠️ **A NAME THE SEED DOES NOT MENTION STILL RENDERS**, appended in `RAIL`'s own order. A bare
  literal would silently drop the next rail entry anybody adds and nothing would report it; there
  is a probe assertion that a deliberately-truncated seed still renders all six.
- **Explorer's pinned band and its level-3 tile followed it for free** — `skRailPaint` emits both
  immediately after Explorer's own tile, so there was nothing to keep in step. With Explorer last,
  both now render at the very bottom of the rail's head, above the foot. Probed: a pin made from
  the grid lands after Setting, and the temporary tile is the last thing in the head.
- **A HAIRLINE SITS ABOVE EXPLORER** (`.skrdiv`, request 8 Sep 2026: *"add divider between Explorer
  & Setting"*), and it is the only rule on this rail. Explorer is not the same KIND of thing as the
  five tiles above it: those open a screen, Explorer opens the level-3 grid and navigates nowhere.
  - ⚠️ **IT IS NOT GROUP BANDING, and that is the point.** `RAIL[].group` would draw **three**
    lines in the declared order — work→analyse at Report, analyse→admin at Setting, admin→analyse
    at Explorer — because the order deliberately interleaves the groups. One of those is where the
    line was asked for and two are not. `RAIL_DIV_BEFORE` names the entry instead, so the line is
    exact rather than a coincidence of the grouping, and it moves with the entry.
  - ⚠️ **`--track`, NOT `--border`, and it was measured.** On this rail's own `--card` surface
    `--border` is **1.27** contrast in light and **1.25** in dark — invisible, exactly the finding
    already recorded for the empty-group box. `--track` is **2.57 / 2.56**, the only token landing
    in a findable hairline band in BOTH themes.
  - ⚠️ **It is never the rail's first child.** A rule above nothing reads as a clipped edge, which
    is what a hidden or reordered Explorer would otherwise produce — both are probed.
  - 24px in a 64px rail, so it reads as a divider between tiles rather than an edge of the rail.
    `.skicons` already puts 8px either side; the 2px margin takes the gap to **21px against the
    ordinary 8px**, which is what separates it (measured, not eyeballed).
- ⚠️ **Option 6 only.** Every other option has its own `RAIL` and its own rail renderer, and
  Option 9 — the byte copy — still ships the old order.
- Verified by a **17-assertion order probe** and a **17-assertion divider probe** (the rendered order, Explorer last and immediately after
  Setting, `RAIL` unmoved, every `MOD_TO_RAIL` index still resolving, every sub-module still
  pointing at Explorer, the truncated-seed guard, the grid still opening at `rail + 12` and still
  navigating nowhere from the new slot, the temporary tile and a pin both still landing under
  Explorer at the rail's end, all four ordinary tiles still navigating, the foot untouched, and
  every tile still on screen), plus `lxbehave` **57/57 ×9** and `harness … query` **77/77**.

## Option 7 — one column, no rail (`dashboard-single-column.html`, 4 Sep 2026)

Built from **Notion** (`app.notion.com/library/recents`), **driven live in the browser and
measured off its DOM** at 1710×951. The page is Option 6 with its sidebar replaced; the `sk*`
block went out whole and `nx*` came in, so everything else is Option 1's as before ("the module
list reference on option1").

### Why it is a seventh answer

**There is no icon rail.** Options 1–6 all have one. This is a single 270px column, every
destination is a labelled row, and nothing has to be hovered to be read. It is also the only
option where the whole navigation nests in one list: the module you are in expands to show its
own pages under it, and Explorer nests a second level under that.

| part | measured off Notion | here |
|---|---|---|
| column | **270px**, `#f9f8f7` on white, **no right border**, padding `0 8px 12px` | `--panel` on `--bg`; the change of surface is the edge |
| workspace row | 30px, a 20px radius-4 mark at **+9**, name 14px/500 at **+38** | the product mark, "ObserveOps", the signed-in avatar, and the collapse |
| actions | 32px row, 2px gap: a rounded-full "Home" pill on a 5% fill, then 22px icon buttons | Home · Iris · Notifications · Search |
| section label | **12px/500** grey at +8, 16px above | 11px/600 `--text-dim` (this file's smaller base) |
| row | **30px**, radius 6, glyph 20px at **+9**, text at **+38**, hover and active a 5% fill | `--hover`; active `--sel` + `--teal` |
| nesting | a child indents so its glyph starts under the parent's text | 38px, and 63px for the second level |
| section tail | a muted "⋯ More" | same, over `NX_CAP` = 6 |
| pinned bar | a rounded-full CTA with a ⌘ keycap, and a 40px square beside it | **removed 5 Sep 2026** — the column ends on the footer row |

- ⚠️ **THE CARET TAKES THE GLYPH'S SLOT, it does not sit beside it.** Notion swaps the page icon
  for a disclosure triangle under the pointer, and that is also the only way the text can stay at
  +38: in the flow a 14px caret plus its gap pushed every module label to **+58** while its own
  children were indented to 38, so a child's glyph landed to the LEFT of its parent's text. Both
  live in a 20px `.nxig` box, stacked. The caret is a `role="button"` span — the row is a real
  `<button>` and interactive content inside one eats the clicks.
- ⚠️ **THE ROW BOTH NAVIGATES AND EXPANDS; THE CARET ONLY EXPANDS.** A module row that merely
  unfolded would leave no way to reach the module; one that only navigated would hide its pages
  behind a control the row does not have. `nxOpenMod(name, force)`'s `force` is what stops the row
  toggling its own pages shut when you click the module you are already in.
- ⚠️ **`selectModule(i)` TAKES A `MODULES` INDEX, NOT A `RAIL` ONE** — 16 entries against 6. The
  wrapper indexed `RAIL` with it and opened the wrong module's pages, or none. The symptom was
  subtle enough to pass a first probe: the rail highlight was right (the host maintains
  `activeRail` itself from `MOD_TO_RAIL`) while the list underneath still showed the module you
  had left. Read `activeRail` AFTER the original runs.
- ⚠️ **THE WORKSPACE ROWS ARE AUTHORED AND MOVED, NOT RE-EMITTED.** `#sbApproval` / `#sbHealth`
  carry ids `showView()` toggles by hand and `init()` runs before this block's first paint, so
  `nxPaint` builds them once and then *appends the same nodes* into each new `#nxUtil`. A probe
  asserts all four survive two repaints with their ids intact.
- ⚠️ **COLLAPSING REMOVES ALL NAVIGATION**, because there is no rail to fall back on — which is
  what Notion does, and why its expand control floats on the canvas rather than living in the
  sidebar. The pair is **`#nxCol`**, at the end of the workspace row, and **`#nxOpen`**, fixed at
  the canvas's top-left and shown only while the column is shut. They are one control in two
  places because the first goes away with the thing it collapsed — the exact fault reported
  against Option 5 on 3 Sep 2026, where the collapse lived in a header that `plshut` hid.
  ⚠️ **The workspace row had to become a CONTAINER when the collapse was added to it** (4 Sep
  2026). `#sbUser` is still a real `<button>` inside it and keeps the hover fill; the toggle is
  its sibling. A button inside a button is invalid and eats the clicks — the same lesson this
  file's own caret follows.
  ⚠️ **`#nxCol` IS VISIBLE AT REST, a deliberate divergence** — Notion reveals its toggle only on
  hover. Here it is the only way to collapse a column that IS the whole navigation, and this
  folder has already had to fix one "the way back out was invisible" report. It is dimmed, not
  hidden.
- **Recents and Starred are the list panel's own state** (`DASH_RECENT` / `DASH_FAVS`), each row
  wearing that board's System / Mine / Shared mark from `MICON` — which is raw `<svg viewBox=…>`
  with no class, so the class has to be injected or the glyph renders at natural size and blows
  the row height apart (the recorded `railPinRow` lesson).
- ⚠️ **`book-open` IS NOT IN THIS FILE'S `ICONS`.** The Documentation row uses `help`, the key
  Option 6's `?` used. `ico()` returns `''` for a name it does not have rather than throwing, so a
  guessed key renders one blank row and nothing reports it.
### The list is MODULES ONLY, and the workspace four are a footer row (5 Sep 2026)

Three sections left the list in one pass, on two requests:

- **WORKSPACE became a 4-up icon row at the foot of the column** — Approval · Health · Settings ·
  Docs, a glyph over a 10.5px label, the same shape as Option 1's `.squick` (measured off
  Datadog's rail footer on 2 Sep). They were four full-width rows carrying a module's weight, for
  screens you reach occasionally; as a footer they cost one row of height between them.
  ⚠️ **`repeat(4,minmax(0,1fr))`, NOT FLEX.** `1fr` is what stops the widest label sizing the row
  and leaving the other three adrift, and `minmax(0,…)` is the part that lets a track shrink below
  its content — without it a long word overflows the grid.
  ⚠️ **THE LABELS ARE SHORTENED, NOT ELLIPSISED.** Four columns in ~254px is ~63px each and
  "Health Monitoring" needs 96. The full name stays in `data-tip`.
  ⚠️ **`.nxq.on` HAS TO BE STYLED.** `showView()` toggles `.on` on `#sbApproval` / `#sbHealth` by
  id, and the selected look lived on `.nxrow.on` — which these are no longer. Without the rule the
  class still lands and styles nothing, so the footer stops saying which screen is open, silently.
  The identical trap is recorded at Option 1's `.sq.on`.
  ⚠️ **STATIC MARKUP, which removed a whole mechanism.** The list version had to MOVE its four
  nodes between repaints to keep those ids alive (`NX_UTIL` / `#nxUtil`); in the footer they are
  simply never rebuilt. Both are gone.
- **RECENTS and STARRED were removed outright** (*"remove it"*). They were the dashboards the list
  panel already tracks, and the panel is still where they live — the Dashboard module's own
  `Dashboard list` row opens it and the canvas keeps its ★ filter.
  ⚠️ `nxBoards`, `nxBoard`, `nxDashIc`, `NX_CAP`, `NX_DOTS` and `NX.more` are **kept and
  unreferenced**, the house pattern, and are what a revert needs.
- ⚠️ **THE POPOVERS OPENED AT THE FOOT OF THE SCREEN** (reported 5 Sep 2026 for the bell, then
  the avatar — the same bug twice). `#userPop` and `#notifPop` are authored for Option 1's RAIL,
  where both triggers sit at the bottom: `bottom:10px` / `bottom:56px`, with the arrow pinned from
  the bottom edge. Here both live at the TOP, in the action row, so a card summoned from y≈50
  opened ~500px down the page. `togglePop` is wrapped and positions each one from its own
  trigger's box.
  ⚠️ **`body #…` IS THE SPECIFICITY IT NEEDS.** The authored rules are `#userPop{bottom:10px}` at
  (1,0,0) and `#userPop::before{bottom:22px}` at (1,0,1); a plain `#userPop{bottom:auto}` would
  only tie and lose on source order.
  ⚠️ **IT READS `--nx-w`, NOT THE BOX** — measuring an element mid-transition is this folder's
  oldest recorded trap, and a custom property never is.
  ⚠️ **IT CLAMPS TO THE VIEWPORT AND THE ARROW STAYS ON THE TRIGGER.** `#notifPop` is up to 620px
  tall, so aligning its top with a trigger 50px down would run it off a short screen; the card is
  pushed up and `--nxarrow` — measured from the card's own top — keeps the arrow pointing at the
  control. That is also why the probe accepts "level with the trigger OR at the 10px margin".
- ⚠️ **THE PINNED BAR WENT AS WELL** (request, same day). It held an *Ask Iris ⌘I* button and a
  ＋ square, and **both keep other doors** — the check every removal in this file gets before it
  happens: Iris has the action row's own `#sbAI` two rows above, the dashboard toolbar's `.aibtn`
  pill and the `A` shortcut; New dashboard has this list's own `＋ New dashboard` row, the page
  head's `#newDashBtn`, the list panel's `#dnewBtn`, the Manage screen's button and the `N`
  shortcut. `.nxbar` / `.nxcta` / `.nxsq` / `.nxk` are kept and unreferenced.
- ⚠️ **THE `MODULES` HEADER WENT TOO** (a further request the same day). With one list left, a
  label over the only thing on screen names nothing you could confuse it with — and the row above
  it already says which module you are in. **This reverses the note that kept it**, written an
  hour earlier; don't restore it on the strength of that reasoning.
  ⚠️ `nxSec` / `nxFold` / `NX.shut` and the whole `.nxsec` block are **kept and unreferenced** —
  what a second section would need.
  ⚠️ `.nxbody` GAINED 6px OF TOP PADDING, because the header's own `:first-child` margin was what
  held the first module row off the action row above it. Removing a heading takes its spacing
  with it; that space still has to come from somewhere.

### The column is on one spacing scale (5 Sep 2026)

Request: *"add proper spacing and margin, padding — need to clear UI"*. **Measured before
changing anything**, and the column was carrying four different steps for the same jobs:

| between | was | now |
|---|---|---|
| the column's own edges | `0 8px 12px` — no top, three different sides | **`8px`** all round |
| workspace row → action row | 6 | **8** |
| action row → the list | 8, **plus** 6px of `padding-top` on the list = 14 in two places | **8**, once |
| row → row | 1 | **2** (a 32px pitch) |
| row → group label | 6 | **12** |
| an expanded module's block → the next module | 6 | **12** |
| list → footer rule → footer buttons | 8 / 8 | unchanged, already on scale |
| the footer button's own padding | `7px 0 6px` | **`8px 0`** |

- ⚠️ **THE GROUP GAP IS THE ONE THAT MATTERED.** At 6 against 1, "next row" and "next group" were
  both just "a small gap" and the grouping stopped working. 12 against 2 is a 6× step and reads at
  a glance — the rule this folder has now recorded five times (`.aiab li`, `.aichips`, `.mfsec`,
  the rail hairline, and here).
- ⚠️ **THE 14px ABOVE THE LIST WAS TWO VALUES FROM TWO PLACES** — `.nxact`'s 8px bottom margin and
  a 6px `padding-top` added to `.nxbody` when the section header was removed, each unaware of the
  other. The gap belongs to the block above it, once.
- ⚠️ **THE COLUMN'S TOP EDGE CAME FROM A CHILD.** With `padding:0 8px 12px` the first row's air was
  a `margin-top` on the workspace row, so the top and bottom edges could not agree and every
  change to that row moved the whole column. `padding:8px` sets all four and the children stop
  compensating.
- There is a probe assertion that **every** spacing value in the column is on the scale, so the
  next off-step number fails rather than being noticed by eye.

### The list took two things from Grafana (5 Sep 2026)

Reference: **Grafana's docked nav** at `play.grafana.org`, driven in the browser. Its tree is the
same shape as this list, and two of its decisions are better than what was here.

- **THE CHEVRON SITS AT THE ROW'S RIGHT EDGE AND IS ALWAYS VISIBLE.** Grafana puts one on every
  expandable row, at the far right, pointing down when the row is open; the glyph on the left
  never moves. ⚠️ **This replaces a caret that SHARED the glyph's slot and appeared only on
  hover** — Notion's behaviour, and it cost two things: the row lost its identifying glyph exactly
  while you were pointing at it, and nothing said a row could be opened until you were already on
  it. That is the fourth "the control is invisible until hovered" report in this folder; the
  pattern is what is being corrected, not just this instance.
  ⚠️ **THE CHEVRON GLYPH IS THE PRODUCT'S OWN**, pasted verbatim from
  `observeops-icons/common/arrows-direction/chevron-right.svg` (request, 5 Sep 2026: *"improve
  this icon — I already gave the icon website, use it, and next time any icon you need, use
  this"*). It shipped as a HAND-DRAWN FILLED TRIANGLE (`M9 5l7 7-7 7z`) among outline glyphs,
  which is exactly the fault the icon rule exists to prevent: a solid mark in a row of strokes
  reads as a different family at any size, and a path drawn by hand has none of the optical
  centring a real set has resolved. It is a 48 grid like every other `ICONS` entry — **never
  rescale one onto 24 by hand**; the consumers size the `<svg>` in CSS, and `fill="currentColor"`
  is the source's own so it takes the row's colour with no override. `NX_SCAR` was swapped at the
  same time although it is unreferenced, so a revert cannot bring the triangle back with it.
  ⚠️ **THE STANDING RULE, reaffirmed:** take a glyph from `observeops-icons/` first (~790 SVGs,
  the product's own), then Lucide/Tabler; never draw one. It is in the session memory too.
- ⚠️ **THE ACCENT BAR WAS REMOVED FIVE HOURS LATER** (request, 5 Sep 2026: *"I need to change
  active style"*, then *neutral fill, no teal*). The active row had become FOUR signals for one
  fact — a teal bar, a teal-tinted fill, teal text and a teal glyph — and is now **one**: a
  `--chip` fill with the text at its normal colour and 600 weight.
  ⚠️ **TEAL IS RESERVED FOR THINGS YOU ACT ON.** In this list that is the two `＋` create rows,
  which keep it, so the accent now reads as "this makes something" instead of competing with the
  selection.
  ⚠️ **`--chip`, NOT `--hover`** — `--hover` IS the hover fill, so an active row would have been
  indistinguishable from whatever the pointer was on (measured: both `#ecf1f9` in light).
  ⚠️ **THREE OLDER TEAL RULES HAD TO BE DELETED, NOT OVERRIDDEN.** `.nxrow.on .nxic`,
  `.nxrow.on .nxn` and `.nxrow.on .nxcar` all sat LATER in the sheet at equal specificity, so
  source order handed them the win — the first fix changed nothing and the glyph stayed teal
  while everything around it went neutral. A fourth rule for the same property would have been
  the next thing to lose.
  Both readings are recorded on purpose; **do not restore the bar on the strength of the Grafana
  note below alone.** What that note describes is what this replaced.
- **~~THE ACTIVE ROW CARRIES A LEFT ACCENT BAR.~~** *(superseded, same day — see above.)* Grafana's own mark, and this product's: the root
  CLAUDE.md records the accent bar as *"the sidebar's nav pattern"* — the thing a selected CARD
  must not use. This list is a sidebar, so it is where it belongs.
  ⚠️ **`box-shadow:inset`, NOT `border-left`.** A border would move the row's content 3px right on
  the active row only, so every glyph would shift as you navigated. An inset shadow paints inside
  the box, costs no layout, and follows the 6px radius for free. There is a probe assertion that
  the text is still at +38 on the active row.
- ⚠️ **NOT TAKEN: Grafana's children have no icons at all** and sit at their parent's text x, so
  the nesting is carried by the missing glyph rather than by indentation. This list gives every
  child a glyph, which was an explicit request on 3 Sep ("use it overall"). Recorded rather than
  changed.

### The list was improved; the header and the footer were not (4 Sep 2026)

Request: *"improve the only list of module … don't change this or this"*, pointing at the
workspace/action row and the pinned bar. Everything below is inside `#nxBody`.

- **AN EXPANDED MODULE IS A BLOCK, NOT A RUN OF LOOSE ROWS.** Its pages ran straight into the
  next module — seven nested rows sat 1px from `Alert`, the same gap they had from each other —
  so nothing said where the expansion ended. They are wrapped in `.nxkids` with 6px under it and
  a **guide line at 19px = the row's 9px padding + half its 20px glyph**, so the rule descends
  from the icon the block belongs to. Explorer's second level gets its own at 46 by the same
  rule. ⚠️ Both are pseudo-elements on the WRAPPER, so no child's padding changed and the +38 /
  +63 indents are untouched. ⚠️ `--track` at .45, **not `--border`** — measured 2 Sep 2026,
  `--border` is 1.32 contrast on this surface in dark and 1.27 in light, i.e. invisible.
- **THE DATA'S OWN GROUPING IS KEPT.** `SUBNAV['Dashboards']` has three sections and all seven
  rows rendered as one, so *Report list* looked like a page of Dashboards. Nested `.nxgrp` labels
  now carry them. ⚠️ **The first section stays untitled** — a module's first group is almost
  always named after the module itself, so a label there says the row above twice; the same rule
  Option 6's column uses. An `h:''` continuation is untitled by the same test.
  ⚠️ **A `plus` row is NOT promoted to a `+` here**, unlike Option 6: this option's whole idea is
  that every destination is a labelled row, and *New dashboard* is a destination.
- **SECTIONS FOLD** (`nxFold`), as Notion's own do — four sections and ~30 rows with a module
  open is what makes that worth having. ⚠️ **Workspace hides `#nxUtil` rather than dropping it**,
  because it holds the four authored rows whose ids `showView()` toggles. `[hidden]` is safe
  there only because nothing gives it a `display` — the `.stpt[hidden]` trap, checked not assumed.
- **THE SECTION HEADER IS OPTION 5's `.plsec`** (request, same day: *"improve this as option 5"*).
  It was Notion's sentence-case label; it is now **this file's own label idiom — 11px/600/.06em/
  UPPERCASE/`--text-dim`, 26px tall** — the voice `.plsec`, `.mfsec` and `.agsub` already share,
  with the label taking the slack and the caret at the row's end. ⚠️ **A stated divergence from
  the reference**, taken because this was the only surface in the folder spelling its labels
  differently, and because case and weight are what separate a group name from the rows under it.
  The nested `.nxgrp` labels take the same idiom one step quieter (10px).
  ⚠️ **The caret is Option 5's `PL_CAR`** — a filled DOWN triangle, visible at rest, rotating -90°
  when the section is shut. It was hover-only and pointing right, which is the "way back out was
  invisible" complaint this folder has already fixed twice.
- ⚠️ **THIS REPLACED A `space-between` HEADER THAT BROKE ON ITS SECOND CHILD.** With one child it
  looks left-aligned, so it read as correct for a day; with the caret added, every section label
  jumped to the column's RIGHT EDGE. One flexible label cannot fail that way — the same fix the
  flyout's ragged chevrons got on 2 Sep 2026.
  ⚠️ The caret must not PRECEDE the label: it would push every label 12px off the x the row
  glyphs sit on (17px, which is Notion's own 16), and absolutely positioning it into the gutter
  would be clipped, because `.nxbody` sets `overflow-y:auto` and that computes `overflow-x` to
  `auto` as well.

- Verified with a **58-assertion probe** — every measurement above, hit-tested clicks on a module
  row, the caret, a Recents board, Home, and both halves of the collapse pair; Explorer nesting two deep; Setting's 19
  categories; label fit — plus `harness … query` **77/77**, `lxbehave` **57/57 ×7**, both themes
  screenshotted. ⚠️ **Five probe failures across this build were the probe's own**, all one
  cause: node references captured before a repaint (the recorded "regenerate after every render"
  trap, in the test rather than the page). Re-query after anything that rebuilds `#nxBody`.

## Option 8 — a second take on the nav column (`dashboard-nav-column-alt.html`, 4 Sep 2026)

Made on request: *"option5 will be copy and create the option 8"*. It is a **byte-for-byte copy
of `dashboard-nav-column.html`** apart from its `<title>` and a banner at the head of its
stylesheet's Option 5 block. Everything CLAUDE.md says about Option 5 is true of it until one of
them is changed.

- ⚠️ **IT KEEPS THE `pl*` NAMESPACE.** Each page in this folder is self-contained, so there is no
  collision — but `plRowHTML`, `plBodyHTML`, `.plrow`, `PL` and the rest now exist in TWO files.
  **Nothing syncs them**: a change meant for the nav-column pattern has to be made deliberately in
  both, and a `grep` for any `pl*` name now returns two files' worth of hits.
- ⚠️ **THE FILENAME DESCRIBES THE PATTERN, NOT THE INTENT.** It is `-alt` because it is a second
  take on the same design; the moment it becomes something else, rename it — the folder's
  convention is that a file is named for what its sidebar IS (`labelled-rail`, `card-sidebar`,
  `single-column`), and `_variants.js`, `lxbehave.py`'s `FILES` and `dsconf.py` are the three
  places that would need to follow (the rename lesson recorded at the top of this file).
- It carries every 3–4 Sep change Option 5 has (the Alert rows' glyphs, the Setting column's
  category icons, Explorer's child glyphs) and, since 7 Sep 2026, the whole 7 Sep set — see
  *"Option 5's 7 Sep column changes, ported"* below; `--pl-nav` is 280px.

### Its one divergence: collapse hides EVERYTHING (5 Sep 2026)

Request: *"when i click to collapse, show only expand icon, the full hide sidebar"*. Option 5
keeps its 52px rail when the column folds — that is the point there, because the rail alone is
still a complete navigation. Here the sidebar goes entirely, the canvas takes the full width, and
the only thing left is **`#plOpen`**, fixed at the canvas's top-left exactly as Option 7's
`#nxOpen` is. **Its column starts collapsed, so that is also the boot state.**

- ⚠️ **`overflow:hidden` IS MANDATORY ON THE COLLAPSED SIDEBAR.** `.sidebar.plside` sets
  `overflow:visible` (the hover-peek needed it), so `width:0` alone leaves the rail's tiles
  PAINTING OUTSIDE the box — collapsed in the layout and still on screen. The right border has to
  go with it, or a 1px rule hangs down the edge of nothing.
- ⚠️ **THE HOVER-PEEK IS DISARMED, NOT MERELY UNUSED — and it was a real latent bug.** With no
  rail to point at, a peek can never be opened by a pointer, but the rule stayed ARMED: anything
  putting `.plpeek` on the body painted a 224px column floating at `left:52px` **with no rail
  beside it**. A probe calling `plPeek(1)` did exactly that. Both halves are now neutralised —
  `plPeek()` returns first, and the CSS rule is kept as commented text — because either one alone
  leaves the other able to produce the phantom.
### The rail expands on hover, and the popover found its anchor (5 Sep 2026)

Two more requests the same day, both on Option 8 only.

**1 · Hovering the 52px rail expands it to a labelled 190px sidebar** (Option 1's rail as the
supplied reference). Option 5 peeks the COLUMN on hover; this page peeks the RAIL, which is the
thing the pointer is actually on — and its own peek was disarmed above, so the gesture was free.

- ⚠️ **THE RAIL IS `position:absolute` AT ALL TIMES, and that is what makes the expansion free.**
  As a flex item, widening it to 190px would SQUEEZE `.plnav` — the sidebar's own width is fixed —
  so the column's rows would reflow and re-ellipsise on every hover. Out of the flow it simply
  paints over them, and `.plnav` pays a `margin-left:var(--pl-rail)` instead.
- ⚠️ **EVERY LABEL IS IN THE MARKUP, hidden at 52px** — not rendered on hover, which would drop
  the hover the moment it fired by rebuilding the list under the pointer. They are DISPLAY-toggled
  rather than faded so the tooltip engine keeps working: `tipSeenText` skips `display:none`, so
  `data-tip` speaks at 52px and goes quiet once the words are there.
- ⚠️ **THREE BOXES NEEDED MORE THAN A WIDTH, and none of the faults is visible at 52px** — each
  holds one child there, so they only appear once the rail expands:
  · `.plbrand` and `.plav` are `flex:0 0 30px`, and **a flex BASIS beats a width**, so the
    wordmark overflowed a 30px box and `overflow:hidden` clipped it to *"erveOps"*;
  · both are `display:grid;place-items:center`, which stacks their children in one cell — the
    identity row rendered the avatar ABOVE the name instead of beside it;
  · `.plicons` and `.plrfoot` carry their own `align-items:center`, which `.plrail:hover`'s
    `stretch` does not reach (it governs direct children only). Left centred, a `width:auto` row
    sizes to its CONTENT: the identity came out **194px inside a 190px rail** (measured at x=-3),
    because the address is wider than the rail and `min-width:0` cannot cap a shrink-to-fit
    parent. Stretched, the row fills the rail and the address truncates.
- The group hairlines come from `RAIL[].group`, the same banding `renderMenu()` draws in Option 1,
  and are `opacity:0` at 52px rather than absent so the rail's rhythm does not shift as it opens.
- ⚠️ **THE RAIL IS ON THE 34px PITCH THE FOLDER SETTLED ON** (request, 5 Sep 2026: *"make it same
  small"*). It was 32px tiles on a **6px** gap = 38, while `.plrow` two pixels to its right is
  32 + 2 = **34**, and so are Option 1's flyout rows. Expanded to 190px that is what read as
  loose: the same words on the same page, four pixels further apart than the list beside them.
  ⚠️ **THE TILE STAYS 32px** — the GAP shrinks, not the hit target. 32 is the size every other
  control in these files uses, and this rail was deliberately taken 28 → 32 on 3 Sep; pulling
  height out of the row instead would undo that. There is a probe assertion comparing the rail's
  measured pitch to `.plrow`'s on the same page, rather than to a number.
  ⚠️ **THE GROUP HAIRLINE'S 6px EITHER SIDE BECAME LOAD-BEARING** with the change: at a 2px row
  gap, the 13px it puts between two groups is the only thing separating them. The gap BETWEEN
  groups must beat the gap INSIDE one — the recorded `.aiab li` rule, newly binding here.
- ⚠️ **`#sbUser` keeps its hidden `.lbl`** — `stSeed()` reads the signed-in name out of it — and
  the visible name is a SECOND node (`.plidt b`), so neither that reader nor `refreshUser()`'s
  `.miniav` is disturbed. The address is on `example.com`, per the repo scrub rule.

**1b · The rail is MODULES ONLY** (request, 5 Sep 2026: *"remove in small sidebar (main), show
only [the column]"*). Search and Iris left it — the only two rows on it that were not a place to
go. **Both doors were checked before removing them**: Search has the column's own header button
(visible in the supplied image) and ⌘K/Ctrl K bound at two places in the host; Iris has the
dashboard toolbar's `.aibtn` pill, the `A` shortcut in `KB`, and Log Explorer's own *Ask Iris*.

- ⚠️ **THE BRAND MARK STOPPED PAINTING, and the cause is worth knowing.** `aiLogoPaint()` fills a
  `.brandmark` only `if (!el.firstElementChild)`, so putting the wordmark span INSIDE the marked
  element made it non-empty and the painter skipped it — the rail rendered an empty 30px hole
  where the logo belongs, in **both** states, and no assertion covered it because every probe was
  measuring boxes rather than content. The mark and the wordmark are **siblings** now, which is
  Option 1's own `.strigger` shape (*"replace from option 1"*). **Nesting anything inside a
  `.brandmark` breaks it the same way.** The mark is 30px in both states, as Option 1's is.
- ⚠️ **`init()` TOUCHES `#sbSearch`, AND THAT WAS ALREADY AN INIT-ABORTING CRASH** — see the entry
  below; removing the id would only have made it certain.

**2 · The profile popover opens beside the rail, not past the whole sidebar.** Reported as *"the
popup shows far from the click"*. `togglePop` sets `left = sidebar.offsetWidth + 10`, which is
right in Option 1, where the sidebar IS the rail — here the sidebar is rail + column, so a 320px
card anchored to a 276px box opened at **x=286** while the avatar it belongs to sits at x≈11.
`togglePop` is wrapped and repositions it to `--pl-rail + 10`.

- ⚠️ **IT READS THE TOKEN, NOT THE BOX.** `.plrail` transitions its width on hover, and measuring
  a box mid-transition is this folder's oldest recorded trap. A custom property is never
  transitioned.
- ⚠️ With the sidebar hidden the anchor falls back to 10px — the avatar is not on screen then, but
  the keyboard and `renderNotifs()` can still open a popover, and one parked at 62px with no rail
  beside it would read as detached.

- ⚠️ **`.plexp`, the in-rail expand tile, IS NO LONGER RENDERED HERE** (request, 5 Sep 2026:
  *"don't show"*). It was added to Option 5 on 3 Sep because folding the COLUMN hid that column's
  own collapse control; on this page folding hides the WHOLE sidebar, so the tile sits in a box
  that is 0 wide and clipped and could never be reached — `#plOpen` on the canvas is the way back.
  Its CSS is kept, which is what a revert to Option 5's collapse would need.
  ⚠️ **THE STRING ALSO REACHED THE SCREEN AS A TOOLTIP**, which removing the tile did not fix
  (reported again the same day). `#plBrand` carried `data-tip="Expand sidebar"` in markup and
  `plColSet` rewrote it on every toggle — Option 5's behaviour, where the mark IS the way back
  because collapsing leaves the rail on screen. Here the mark is inside a sidebar that is 0 wide
  and clipped when collapsed, so the flip could only ever put the string on the EXPANDED rail's
  wordmark, on a control `plColExpand()` early-returns from whenever it is visible. Both the
  attribute and the click are gone, and `plColSet` no longer writes it. **There is now no element
  in this file offering it, in either state** — asserted over every `[data-tip]`, not just over
  rendered text, because that is how it survived the first fix.
  ⚠️ **IT REAPPEARED ONCE BEFORE THAT, AND THE CAUSE GENERALISES.** A bare `.plrail:hover .plib{display:flex}`
  is (0,3,0) and OUTRANKS `.plexp{display:none}` at (0,1,0), so expanding the rail un-hid the
  parked tile and it rendered as the FIRST row of the labelled sidebar. Both hover rules now carry
  `:not(.plexp)`. **Any future `display:none` tile in this rail needs the same exclusion**, or the
  hover state brings it back.
- Registered as **Option 8** in `_variants.js` and added to `lxbehave.py`'s `FILES`.
- Verified: `lxbehave` **57/57** (now ×8), `harness … query` **77/77**, Option 5's own
  32-assertion sidebar probe run against the copy, and a **21-assertion probe of the full-hide
  collapse** — the sidebar at 0 with nothing hit-testable behind it, the canvas at full width, the
  expand button as the only control, a real click each way, and the disarmed peek. All pass.

### Option 5's 7 Sep column changes, ported (7 Sep 2026)

Request: *"in option 5 today those changes apply in option 8"*. Everything the Option 5 section
records for 7 Sep is here — applied as **today's actual diff of Option 5** (`diff` of the file
before and after the session, 11 hunks, `patch -F3`), which is the faithful route while the two
files share the `pl*` namespace. Nine hunks applied clean; two were hand-ported where this file
deliberately differs:

- **`--pl-nav` 224 → 280px** on this file's token line, which also carries `--pl-rail-open`.
- **The pinned tiles carry a `.pllbl`**, like the module tiles — this rail expands to 190px on
  hover and shows every tile's label, so a pin tile without one would be the only wordless row
  on the open rail. The group hairlines (`.plgap`) are emitted as before, ahead of the band.

Same set as Option 5: row chevron · Alert tree · product section caret · DOCS chip and footer ·
pin/unpin with rail tiles · aligned `.plend` cluster · the column foot, Next steps card and
licence line (the `.plnavin` host split). The collapse still hides the whole sidebar, card
included; `#plOpen` stays the way back. Verified with Option 5's probes pointed at this file
(**79** column assertions, incl. the tile label; **29** Next-steps assertions, with the peek
checks swapped for this file's whole-sidebar collapse), `harness … query` **77/77**, screenshots.

## Option 9 — a second card sidebar (`dashboard-card-sidebar-alt.html`, 8 Sep 2026)

Made on request: *"option 6 copy and create new option 9"*. It is a **byte-for-byte copy of
`dashboard-card-sidebar.html`** apart from its `<title>` and a banner at the head of its `sk*`
block. Everything this file says about Option 6 is true of it until one of them is changed.

- ⚠️ **IT KEEPS THE `sk*` NAMESPACE.** Each page here is self-contained, so there is no collision —
  but `skPaint`, `skRowHTML`, `SK`, `SK_TOP`, `.skrow` and the rest now exist in TWO files and
  **nothing syncs them**. A change meant for the card-sidebar pattern is a two-file change, and a
  `grep` for any `sk*` name now returns two files' worth of hits. Same shape as Options 5 / 8's
  shared `pl*`.
- ⚠️ **THE FILENAME DESCRIBES THE PATTERN, NOT THE INTENT** — `-alt` because it is a second take on
  the same sidebar. Rename it the moment it becomes something else; `_variants.js`,
  `_verify/lxbehave.py`'s `FILES` and `_verify/dsconf.py` are the three places that must follow.
- **Registered**: `_sync_variants.js` added it and its auto-label (`V9 · …`) was renamed **Option
  9** by hand, so the switcher does not mix conventions; a re-run reports no changes. It takes the
  **`9` shortcut** for free — the switcher gives the first nine a digit, which is now all of them.
  `lxbehave.py`'s `FILES` gained it (that list is hardcoded — a new page must be added or the suite
  silently tests the old set).
- It carries every 8 Sep change Option 6 has: the Report column's button and its two folding
  sections, the NOC View rows, Geo Map, the search-in-Setting-only rule, the 26px tiles, the foot's
  Layout button.

## Options 10, 11 and 12 — the rail + flyout family (9–10 Sep 2026)

**Option 10** (`dashboard-rail-flyout.html`) began as a byte copy of Option 1 and is now the most
diverged page in the folder. **Option 11** (`dashboard-rail-flyout-alt.html`) is a byte copy of
Option 10 with one deliberate difference (below), and **Option 12**
(`dashboard-rail-flyout-alt2.html`) is a second byte copy with another (Gemini's rule — see its own
section). ⚠️ **Nothing syncs the three** — every item here now
exists in two files, and the `mf*` / `sbNotif*` / `RAIL_TMP` names return two files' worth of hits.

### What Option 10 has that Option 1 does not

| piece | what it is |
|---|---|
| **Explorer's module grid** (`mfGrid*`) | Explorer opens a 232px card of its ten sub-modules as icon tiles, headed `Explorer … DOCS ↗` like every other menu |

⚠️ **THE GRID HAS THE TREE MENUS' OWN HEADING** (request, 11 Sep 2026: "add the title like [the]
alert submodule popup"). Explorer was the one module whose menu opened with no name on it — the
one card that REPLACES a flyout was also the one that did not say what you were looking at.
- ⚠️ **IT REUSES `mfSec`, NOT A LOOKALIKE** — the same function that builds every other menu's
  heading, so the label, the `DOCS ↗` chip, its href and its tooltip cannot drift from the
  flyouts. Passing a path is what emits the chip at all; `mfSec(label)` alone returns the label.
- ⚠️ **THE PATH COMES FROM `MOD_DOCS`**, the table every other chip and footer reads, never a
  literal — those slugs were verified 200 when it was built, and a hand-written one is a 404
  nobody notices.
- ⚠️ **NO PIN ARGUMENT.** `mfSec`'s third parameter adds the heading pin, which belongs to
  `mfOpenPin`'s card where it means "unpin this row". Explorer is a rail ENTRY, not a pinned
  sub-module. The grid already pins per TILE, which is the thing that can be pinned.
- ⚠️ **`.mfgrid .mfsec` HAS TO DROP `.mfsec`'s OWN INSET.** That rule is written for the flyout's
  288px column (`margin:4px 4px 0; padding:0 9px 10px 10px`), and this card supplies its own 10px
  padding — the two stacked put the heading **14px right of the tile column** (measured: label
  x=269 against tiles at 255). Its bottom padding is KEPT: it IS the 12px gap to the first row.

⚠️ **CORRECTION — THIS TABLE CLAIMED A "Customize navigation" BUTTON AND OPTION 10 HAS NONE.**
`.mfgcust` exists here as CSS only; nothing renders it. The button is **Option 6's** grid
(`skGrid`), which is where that sentence belongs. Found by a probe asserting its presence and
failing; the claim had been in this file since the grid was written.
| **a pin per tile** (`.mfgpin`) | the same `railPinToggle` the flyout and the rail band drive — one record, four surfaces |
| **the temporary rail row** (`RAIL_TMP`) | picking a tile puts that sub-module on the rail until you leave it; a **dashed ring**, never the pin mark |
| **the pinned-row child menu** (`mfOpenPin`) | hovering a pinned (or temporary) row lists that module's own children, from the same `kids` array the flyout's detail pane draws |
| **five modules with children** | `Monitor` (18 types) · `Topology` (**6** tabs) · `NCCM` (2) · `APM` (4) · `Flow` (3) — Topology/APM/Flow added 9 Sep from supplied tab bars, each corroborated against `_product-docs`. ⚠️ **Topology went 5 → 6 on 11 Sep 2026**: a second supplied screenshot of the same tab bar shows `Custom` alongside Network · SDN · Cloud · Virtualization · HCI. The 9 Sep comment in `EXPLORER_TREE` argues at length that `Custom View` is NOT a tab (the docs describe it as a view you *create* from a root monitor) — **the tab bar is the tab bar and it wins**; the comment is kept as the record of why it looked otherwise |
| **the gradient AI mark** | the supplied four-point star on the brand ramp, everywhere `AI_SPARK` reaches |
| **the hover notification card** | the bell opens `#notifPop` on hover, with `kbPop`'s timing rules |
| **`MF_NO_HOVER`** | `Dashboard`, `SLO` and `Setting` open no menu on hover — click navigates |
| **the Ask-AI drawing border** (`aidraw` / `aiturn`) | the border draws itself edge by edge on hover and the mark turns with it — see below |

⚠️ **OPTION 10's ASK-AI ANIMATION IS A SELF-DRAWING BORDER, OPTION 12's IS A CONIC ORBIT, AND THAT
IS THE POINT** (request, 11 Sep 2026, with an IconScout Lottie "border animations" gallery as the
reference). Twelve options exist so each demonstrates a distinct idea; two wearing the same border
treatment would waste one.
- ⚠️ **THE REFERENCE IS A GALLERY AND MOST OF IT IS NOT WHAT IT SOUNDS LIKE.** Its results are ICON
  assets named after CSS border PROPERTIES — `top-border`, `left-border`, `outer-border`,
  `inside-border`, `none-border` — i.e. toolbar glyphs for a border picker, not decorative borders
  for a button. What the family shares, and all that was taken, is that **the border draws itself**.
- ⚠️ **IT NEEDS BOTH PSEUDOS, AND THAT IS WHY**: `border-color` cannot be a gradient and one box
  cannot reveal its edges in sequence. `::before` pins TOP-LEFT and grows width → height (top edge,
  then right); `::after` pins BOTTOM-RIGHT and does the same (bottom, then left). They meet at
  opposite corners, so the border closes from both directions at once.
- ⚠️ **THE TWO HALVES CARRY OPPOSITE ENDS OF THE BRAND RAMP** — blue from the top-left, magenta from
  the bottom-right. That is how a two-colour ramp survives on a property that only takes flat
  colours.
- ⚠️ **THE LOOP FADES BEFORE REDRAWING.** Without the fade at 100% the border blinks from complete
  back to nothing, which reads as a glitch rather than a redraw.
- ⚠️ **ALL THREE ANIMATIONS SHARE THE 2.2s PERIOD** so the star's turn cannot drift from the draw it
  is timed to; `linear` on the rotation, because easing a full turn stutters visibly at the wrap.
- ⚠️ **IT REPLACED A SHEEN OF MINE FROM AN HOUR EARLIER** (`aishine` / `aiflare` — a `::after` bar
  translated −120% → 120% with the mark flaring at 8%). Both pseudos are needed to draw four edges,
  and a light sweeping ACROSS a row while a border draws AROUND it is two unrelated motions
  competing for the same 32px. `#sbAI{overflow:hidden}` went with it — clipping that travelling bar
  was its only reason. Both are in git history.
- ⚠️ Hover-only, calm at rest, `prefers-reduced-motion` kills all three. Verified **16/16**, with
  the draw order sampled from a paused lap rather than assumed: `w=0 h=0` → `w=219 h=0` →
  `w=219 h=32` → opacity 0.07.

⚠️ **THE ONE RULE THAT KEEPS COMING BACK: A MENU SHOWS EITHER PER-ROW `DOCS ↗` CHIPS OR ONE
FOOTER, NEVER BOTH AND NEVER NEITHER.** `mfTree` asks `tree.some(x => x.doc)` and `mfOpen` asks the
same question for the footer; they are exact complements. The structural test it replaced
(`mfTreeFor(name) ? chips : footer`) was true only while every tree row had its own `doc` — Alert's
never did, so it drew eight chips at the module's one page **and** no footer. The fallback to
`MOD_DOCS[name]` survives *inside* a per-row-docs menu, because two of Settings' 19 categories have
no page of their own and would otherwise be holes in the chip column.

⚠️ **`.mfcards` IS SET BY `mfOpen`, NOT `:has(.mfdetail)`.** The two-card treatment used to be gated
on "is this a tree menu", which was the same thing as "has no footer" right up until Alert became a
tree menu that keeps its footer — and then the footer, a sibling of `.mfcols`, was stranded below
the cards on the board. `mfOpenUtil` and `mfOpenPin` clear the class; both render one flat card.

⚠️ **THE RAIL LANDS ON EACH MODULE'S FIRST SUB-PAGE** (`mfRailFirst`), derived from the same arrays
the flyout draws — Alert on Metric, Report on Metric, SLO on the SLO list — skipping `plus` rows.
`Dashboard` and `Setting` are exempt: both have a real screen, and Setting resets to `stOpen()`, the
first screen *derived* from `ST_TREE[0]`. **Explorer opens its grid and navigates nowhere**: its
`mod` is `Metric Explorer`, so the row was opening a different module's page under its own name.
`MOD_SUB` names the sub-page on the placeholder, or the setting is invisible.

### Option 11's one divergence

**It boots EXPANDED (240px) and collapsing hides the sidebar entirely**, leaving `#sbOpen` fixed at
the canvas's top-left as the only way back — Option 8's answer, ported. `<body class="pinned">` and
`class="… open"` are in the MARKUP so the first paint is already expanded; state alone flashes the
64px rail and fits the canvas twice. Hiding drops `open`/`pinned` (`mfOpen` gates on `.sidebar.open`
and would read a hidden sidebar as open), closes the flyout and any popover, and `railWidth()`
returns **0** so nothing anchors mid-board. `sbHover` is disarmed while hidden.

⚠️ **Its footer is ONE compact icon row** (a Magnific reference, 10 Sep 2026) — Approval · Health ·
Notifications · What's new · avatar, icon-only, names in `data-tip`. **Only existing controls**; the
reference's plug/mortarboard/moon/⋯ were explicitly not copied. `.squick` and `.sqrow` are laid out
as flex siblings rather than merged, so each keeps the rules written for it. `.sq.on` is restated —
`showView()` toggles it by id and the selected look would otherwise style nothing, silently.
`#sbUser` keeps its hidden `.lbl` for `stSeed()`. **Tips inside `.sfoot` open ABOVE their button.**

### Their shortcuts are LETTERS, and that is new

`_variants.js` ran out of digits at Option 10's `0`. **`VS_LETTERS = ['x', 'z', 'c']`** maps index
10 onward — Option 11 = `X`, Option 12 = `Z` (10 Sep 2026), Option 13 = `C` (11 Sep 2026), each by
request — and `vsKey` / `vsIdx` are exact inverses that **must be edited together**: a key shown on
a row that does not switch, or a switch with no keycap, is worse than no shortcut. Only that array
changes; both functions read it.
⚠️ **EACH LETTER IS CHECKED AGAINST EVERY PAGE FIRST.** That handler runs on all thirteen pages, so
a letter has to be free in every one — each page's own `KB` registry is `n w g e d o t f / s a`,
and none of `x`, `z`, `c` is in any of them, in any `case` label, or in any other bare-key
comparison in the folder.
⚠️ **A MODIFIER BINDING IS NOT A CONFLICT**: ⌘Z / Ctrl+Z stays undo because the handler returns
early on ctrl/meta/alt and claims only the bare key. ⚠️ **`C` MAKES THAT RULE LOAD-BEARING RATHER
THAN THEORETICAL** — ⌘C / Ctrl+C is copy, the one shortcut everybody has muscle memory for.
Deleting that early return would not merely add a conflict, it would break copy on thirteen pages
at once. Verified by dispatching both modified forms and asserting the page did **not** navigate.
⚠️ **BOTH CASES MATCH** — unlike a digit, where Shift gives `!` and can never match, a letter with
Shift is still that letter. The footer hint stopped being `slice(0, 10)`.
⚠️ **A FOURTEENTH NEEDS A DELIBERATE CHOICE**, not the next letter along.

### Verification lessons from this pair

- ⚠️ **A HOVER BUG CANNOT BE CAUGHT BY DISPATCHING `mouseenter`.** The notification card blinked at
  ~3Hz: `togglePop` raises `#scrim` (`inset:0`, `z-index:80`) over a rail at `z-index:60`, so the
  pointer resting on the bell was over the scrim, the bell got a **real** `mouseleave`, the card
  closed, the scrim went, the pointer was on the bell again… Synthetic events do not hit-test, so a
  15/15 probe passed on a visibly broken control. **Assert with `elementFromPoint`.** The fix is that
  hover mode opens without the scrim; the document click handler already closes any `.pop`.
- ⚠️ **A flex BASIS beats a `width`** — recorded again: `.miniav` is `flex:0 0 20px`, so a rule
  asking for 26px measured 20. Set `flex` and `width` together.
- ⚠️ **`location.href` is not configurable**, so a probe that stubs it dies silently. Test the
  switcher by REAL navigation inside an iframe.
- ⚠️ **`.par` is the master-row WEIGHT, not a has-children flag.** Asserting its absence would have
  undone the 2 Sep "Alert and Report read the same" work.
- ⚠️ **Two background probe jobs sharing one generated `probe.html` is a race** — one run reported a
  different assertion count than its siblings because the other job rewrote the file mid-run.

### Option 12 — Gemini's rule: no hover, one toggle (10 Sep 2026)

`dashboard-rail-flyout-alt2.html`, a byte copy of Option 10 whose only differences are its
`<title>`, a banner, its switcher entry — and the sidebar's **behaviour**, which was
**driven and measured on gemini.google.com**, not guessed: that rail is **52px**, its
`bard-sidenav` carries `transition:background-color .3s` and nothing that changes width, hovering
it (icon or empty space) expands **nothing**, and the `Open sidebar` / `Close sidebar` button is
present in **BOTH** states and is the only door.

| | Option 10 | Option 12 |
|---|---|---|
| hover the rail | expands it, with a re-arming collapse watchdog | **nothing** |
| how it opens | hover, or the toggle to pin | **the toggle only** |
| the toggle when collapsed | `display:none` — the logo is the way back | **in the row at 32px, its glyph revealed on hover** |
| the header row | is itself a toggle | plain — only the button toggles |
| collapsed brand row | the 24px mark | **the 24px mark, swapping to the toggle on hover** |

- ⚠️ **ONE EARLY `return` IN `sbHover` NEUTRALISES SIX CALLERS** — the `<aside>`'s
  `onmouseenter`/`onmouseleave`, the grid card's `onmouseleave`, `mfLater`'s partner and the rule-7
  `focusin`/`focusout` bindings. Picking them out would be six edits and a seventh next time.
- ⚠️ **THE BODY BELOW IT IS KEPT, NOT DELETED** (the request said so): the whole three-state
  behaviour, including the 200ms re-arming collapse watchdog, is still there as the record of the
  bug it was built for. `sbHoverT` is simply never armed.
- ⚠️ **THE TOGGLE HAD TO BECOME REACHABLE COLLAPSED.** `pointer-events:none;display:none` was
  right for Option 10, where hover opens the rail; with hover gone it would have stranded the rail
  shut.
- ⚠️ **COLLAPSED, THE ROW SHOWS THE LOGO AND SWAPS TO THE TOGGLE ON HOVER** (request, 10 Sep 2026).
  It shipped as the toggle alone — Gemini's own shape — so the top of the rail only ever said
  "open me" and never said which product you were in, and this row is the one place the mark lives.
  - ⚠️ **THEY ARE STACKED, NOT SWAPPED IN AND OUT OF FLOW.** The button keeps its place at its full
    32px and keeps the click; the mark is absolutely centred OVER it with `pointer-events:none`, so
    the hover region and the hit region are the SAME box. A `display` swap would let a pointer sit
    in the row, reveal the icon and click nothing. Probed with `elementFromPoint` at the logo's own
    centre: it lands on `#collapseBtn`.
  - ⚠️ **THE TRIGGER IS THE BUTTON, NOT THE ROW**, for that reason — the row is 53×56 and the
    button 32×32, so a row-level hover would promise a target up to 12px from the pointer. 32px is
    every `.sitem` tile's own box here, so the top row answers to the same aim as the ten under it.
  - ⚠️ **CONSEQUENCE, STATED:** the ~10px of rail either side of the button is now dead — hovering
    there leaves the logo up. Nothing is unreachable (the button is the same target size as every
    row tile), but this rail no longer announces its own toggle at rest, which is the one Gemini
    trait the request overrules.
  - ⚠️ `:focus-visible` reveals it too, or a keyboard user tabs onto an invisible glyph.
  - ⚠️ **`margin-left` IS CANCELLED** — `.strigger .brandmark` carries -1px for the EXPANDED row's
    optical alignment against the labels below it; on a translate-centred box that is 1px of
    decentring instead.
  - ⚠️ **Measuring the swap needs transitions frozen.** Both halves carry `transition:opacity`, and
    under `--virtual-time-budget` a transitioned property never leaves its START value — the probe
    read `0`/`1` forever and reported three failures on correct CSS. The recorded trap, again.
- ⚠️ **CONSEQUENCE, STATED:** the collapsed rail is icons + tooltips and nothing else — the flyout
  and Explorer's grid both gate on `.sidebar.open`, so they are reachable only once the toggle has
  opened it. That is Gemini's collapsed rail exactly, and a row still navigates on click.
- ⚠️ **ITS FOOTER IS OPTION 11's, PORTED VERBATIM** (request, 10 Sep 2026: "the bottom will be
  change like <Option 11>"). What's new leads as a full-width labelled row, then ONE compact icon
  row — Approval · Health · Notifications · **avatar** — icon-only, names in `data-tip`. It
  replaced the 3-up icon-above-label grid with What's new and a full identity row under it.
  - ⚠️ **THE CSS AND THE MARKUP WERE SPLICED ACROSS, NOT RETYPED**, so the two footers agree by
    construction rather than by two people editing them to look alike. Verified by dumping every
    child's box in both files, open and collapsed, and diffing: identical.
  - ⚠️ **`.sidebar.open .sfoot .sitem.uxnews{margin-top:2px}` WENT WITH IT.** It tightened What's
    new against the quick links directly above it; What's new now LEADS the footer, so the thing
    above it is the module list and the standard 10px is the right gap. Option 11 carries no such
    rule, and it was the one measurable way the two still disagreed.
  - ⚠️ **THE AVATAR IS A `.sitem` INSIDE `.squick`**, so `.sitem`'s own full-width row shape has to
    be cancelled there — two row kinds in one container. Its disc stays 26px while the glyphs are
    18px; shrinking it to match would make the initials unreadable.
  - ⚠️ **`.sq.on` IS RESTATED, NOT ASSUMED.** `showView()` toggles it on `#sbApproval` /
    `#sbHealth` by id, and if the selected look lived on a class these rows no longer carry the
    footer would stop saying which screen is open — silently. The recorded `.nxq.on` trap.
  - ⚠️ **THE ONE DELIBERATE DIVERGENCE: AN 8px GAP BETWEEN THE TWO BLOCKS** (request, 10 Sep 2026,
    asked as 4px and raised to 8 minutes later — **8 is what shipped**). Measured first: What's new
    ended at y=52 and the icon row started at y=52, i.e. the two were FLUSH, separated only by the
    icon row's own internal padding. 8px is also the rail's own step — every `.sitem` sits at
    `margin:0 8px` and the gaps between the rail's groups are 8.
    ⚠️ `margin-top` is set on BOTH `.squick` and `.sidebar.open .sfoot > .squick`: the latter is
    (0,4,0), declares `margin`, and would otherwise cancel the former in the only state the icon
    row exists in — setting just the base rule looks right in the source and changes nothing on
    screen. Move them together. **Option 11 still has the two flush** — one line each if the pair
    should re-converge.
  - ⚠️ **THE ICON ROW GROUPS LEFT, WITH THE AVATAR ALONE AT THE RIGHT EDGE** (request, 10 Sep
    2026). Option 11 spreads all four with `justify-content:space-between`, so they read as four
    unrelated controls at equal weight; here Approval · Health · Notifications are one cluster and
    the avatar is the odd one out — which is what it is.
    ⚠️ **A `gap` UNDER `space-between` IS ONLY A MINIMUM**, so this row's authored `gap:2px` had
    never painted (the real gaps were ~32px, shared out by the browser). Grouping made it
    load-bearing, i.e. a number had to be chosen rather than inherited: **8px**, the rail's own
    step. The 2px stays on the base rule because it still governs the COLLAPSED state, where
    `.squick` is a one-column grid and it is the ROW gap.
    ⚠️ **ONE auto margin, never two.** `.sidebar.open .squick #sbUser{margin-left:auto}` pushes the
    avatar out; a second auto margin anywhere in the row would let flexbox split the free space
    between them and the three would drift apart again — the recorded `.mfkc`/`.mfpin`/`.mfdocs`
    fault that put one column's chevrons at four different x.
    ⚠️ **The selector is an ID (1,3,0) on purpose** — `.sidebar.open .squick .sitem` is (0,4,0) and
    sets `margin:0`, so a class-weight rule would lose and the avatar would sit against the bell.
    Scoped to `.sidebar.open`, because collapsed the avatar is centred in a 52px rail by
    `.sidebar:not(.open) .sfoot .sitem{margin:10px auto 0}`.
- ⚠️ **SETTING LEFT THE MODULE LIST FOR THE FOOTER, ABOVE WHAT'S NEW** (request, 10 Sep 2026).
  The footer reads **Setting · What's new · the icon row**.
  ⚠️ **IT SHIPPED FOR A FEW MINUTES INSIDE THE ICON ROW** — asked for as *"after What's new"*,
  which the icon row is, and confirmed as the icon row over a labelled row when I offered both.
  The follow-up minutes later was *"show BEFORE What's new"*. **Above the line is what shipped**;
  both requests are recorded so neither is undone on the strength of the other.
  ⚠️ **THE POSITION DECIDED THE SHAPE.** In the cluster it was a 32px `.sq` like its neighbours;
  standing alone above a full-width row a lone tile reads as a fragment of a row that isn't there,
  so it is a `.sitem` — the same labelled row it was in the module list, which is also what it is:
  a module, not a utility toggle. That also means `.sitem.on` lights it, the rail rows' own
  selected look, instead of borrowing Approval's and Health's `.sq.on`.
  - ⚠️ **THE ENTRY STAYS IN `RAIL`, AT ITS INDEX, FLAGGED `foot:true`.** `activeRail` and
    `MOD_TO_RAIL` store INDICES into that array, so splicing it out would silently repoint every
    module mapping to a later index — the trap recorded for `RAIL_SEED`. `renderMenu` skips a
    `foot` entry **before the group logic**, for the same reason a hidden row is skipped there:
    `Setting` is the only member of the `admin` group, so leaving it to the group test emits a
    divider introducing a band with nothing in it.
  - ⚠️ **`railFootGo(name)` RESOLVES THE INDEX BY NAME, EVERY TIME.** `pickRail` takes an index and
    markup cannot hold one; `pickRail(5)` in the button would be a second copy of the array's
    order, and the next entry inserted above Setting would send the gear to Report. It also means
    the button reuses the ROW's behaviour — first screen, `mfHide`, `renderMenu` — not a copy.
  - ⚠️ **`railFootPaint()` IS THE HIGHLIGHT, AND IT HAD TO BE WRITTEN.** `renderMenu` marks the
    open module by rebuilding the list, and this button is authored markup that rebuild never
    touches — without it the rail stops saying you are in Settings, silently. The recorded
    `.sq.on` / `.nxq.on` trap. It also honours `RAIL_HIDDEN`, because the Layout drawer's Sidebar
    tab still lists Setting and can still switch it off.
  - ⚠️ **It is a `.sq`, not a `.sitem`** — the row lays out two kinds of child and `.sitem` is the
    full-width shape that has to be cancelled rule by rule.
  - ⚠️ **Options 10 and 11 still carry Setting in the module list.**
- ⚠️ **THE ASK-AI ROW: A BRAND-RAMP BORDER WITH A HOVER-ONLY TRAVELLING HIGHLIGHT, AND A MARK
  THAT EMERGES AND ROTATES** (requests + two references, 10 Sep 2026 — 60fps.design's Chrome
  *Gemini feature intro sheet* for the mark, Aceternity UI's `moving-border` for the edge).
  - ⚠️ **THE GEMINI REFERENCE WAS READ FRAME BY FRAME**, not from its one-line description: the
    shot's mp4 was pulled and decoded at 20fps. The motion is four beats — an arc sweeps out from
    BEHIND the mark, the star appears small at its head, rotates as it travels and overshoots its
    size, then the arc dissipates. All four are reproduced (`aisprkin` / `aisprktr`); Google's
    blue is **not** — the arc takes `--ai-2`, per the standing rule about another product's hue.
  - ⚠️ **THE TRAIL IS PAINTED ONTO THE RAIL'S MARK ALONE.** `aiSparkPaint` appends the circle only
    for `.aisprk`; the same mark is authored in two other places and both are left alone.
  - ⚠️ **`overflow:visible` ON THE SVG AND `transform-box:fill-box` ON ITS CHILDREN ARE BOTH
    LOAD-BEARING.** An SVG root clips to its viewBox, and the arc is drawn at r=29 in 48-space —
    outside the star, therefore outside the box. And an SVG child rotates about the USER SPACE
    origin (the viewBox corner) unless told otherwise, so without `fill-box` the star swings
    around its own corner instead of spinning in place.
  - ⚠️ **THE ARC'S `fill` MUST BE SET IN CSS, NOT AS AN ATTRIBUTE.** `.ic{fill:currentColor}` sits
    on the svg root and `fill` inherits, so `fill="none"` on the circle loses and it paints as a
    solid disc over the row. The recorded attribute-vs-rule trap, in a new place.
  - ⚠️ **LIVE STATE: THE FIRST FORM, RESTORED HOVER-ONLY** (11 Sep 2026, "add the first time I
    applied"). `::before` is the static ramp ring, `::after` a conic head swept by an animated
    `@property --aiorb`, and it runs only while hovered. **It was chosen on evidence**: of the
    five forms, it is the one whose filmstrip actually showed the head at six distinct positions
    round the border. Probe: 19/19, with `--aiorb` proved registered by INTERPOLATION (a sampled
    `123.75deg` mid-animation is a value an unregistered property could not produce).
    ⚠️ Hover-only rather than the `infinite` it first shipped as — "the border animation is only
    hover effect" followed within the hour and was never retracted.
  - ⚠️ **THE HISTORY BEHIND THAT CHOICE — it was removed twice before being restored.** Removed on "remove
    all border animation", re-added on request with the component's demo still, then removed again
    on "remove the border animation in option 12". The ramp ring stays each time; only the moving
    layer goes. **Four genuinely different effects were built and none survives**, recorded so
    none is rebuilt from half a memory: (1) `moving-border` GUESSED as a conic gradient with an
    animated `@property <angle>` — a sharp head sweeping the ring; (2) `hover-border-gradient` — a
    blurred glow hopping the four edges with the border flooding on hover; (3) `moving-border`
    rebuilt from the real source once supplied — a round blob walking the perimeter at CONSTANT
    SPEED, needing length-proportional keyframe times plus a second equal-quarter set for the
    square collapsed tile; (4) the same with a hard white core, a `drop-shadow` bloom and a
    retimed lap.
  - ⚠️ **A FIFTH FORM WAS TRIED AND REMOVED TOO** — a `background-clip` border
    (`border:1px solid transparent` over a `border-box` conic, `padding-box` layers covering the
    interior, spun by a registered `@property <angle>`), from a CodePen after turbo.build. **That
    technique is the right one** — it makes the border itself the moving thing, and this file
    already ships it at `.aibtn`. **My build of it was invalid CSS**: a background-COLOUR is only
    legal in the FINAL layer of the `background` shorthand, and I used `var(--sidebar) padding-box`
    as a middle layer, so the whole declaration was dropped silently. `.aibtn` writes the opaque
    layer as `linear-gradient(var(--header),var(--header)) padding-box` — copy that idiom.
  - ⚠️ **AND MY PIXEL TEST "CONFIRMED" THAT BROKEN BUILD.** It sampled `--teal` and `--sidebar` —
    neither in the ramp — and called it a spinning border, while four DOM assertions correctly
    reported no `padding-box` layers and no conic. **When a pixel check and the DOM disagree, the
    DOM is not automatically the wrong one**; the pixel check exists because DOM assertions can
    pass on invisible output, not because it outranks them.
  - ⚠️ **(1)-(4) NEVER PASSED THEIR PIXEL TEST**, and that is the honest reason to be wary of rebuilding
    it: the blob must stay SMALLER than the row in both axes (or `background-position`'s range
    goes negative and that axis travels backwards), capping it at ~0.63× the row's height where
    the reference's blob is **1.25× its button's**. A light smaller than the thing it travels, on
    a 32px row already wearing a full-saturation ramp, never separated from the ring — the final
    measurement still read `L=+11 R=+13` for a glow parked at the top-LEFT.
  - ⚠️ **`@property --aiorb` WENT WITH THEM**, and deliberately: a live registration for a deleted
    animation is how a later reader concludes the feature is still there. `::after` is free again —
    anything claiming it should know four animations have already used that slot.
  - ⚠️ **`background:` IS A SHORTHAND AND RESETS EVERY `background-*` LONGHAND**, so it must come
    BEFORE `background-size` / `-position` / `-repeat`. My verification probe had them the other
    way round, measured a blob filling the whole box, and reported a confident "the glow does not
    move" about CSS that was correct. A probe that reproduces the component's CSS by hand must
    copy the declaration ORDER, not just the values.
  - ⚠️ **THE MARK'S OWN ANIMATION IS NOT A BORDER ANIMATION AND SURVIVED.** `aisprkin` /
    `aisprktr` is the Gemini reference and was a separate request; the removal was scoped to the
    border and there is a probe assertion that both keyframe sets still exist.
  - ⚠️ **WHAT THE ADAPTATIONS TAUGHT, worth keeping even though the code is gone:** Aceternity's
    component runs a per-frame JS loop (`getPointAtLength` on an SVG rect), which a rail row must
    not do — the `agClose()` rule about a timer outliving its element; animating
    `background-position` between the four CORNERS traces a perimeter correctly, but CSS spends
    equal time between keyframes, so constant speed needs length-proportional times; and CSS
    cannot interpolate one gradient IMAGE into another, which is why a keyframed `background-image`
    hops where framer-motion crossfades.
  - ⚠️ **`box-sizing:border-box` IS DECLARED ON THE PSEUDOS THEMSELVES.** This sheet's reset is a
    bare `*`, which does not match `::before`/`::after` — the recorded fault behind the AI card's
    6px edge capsules. Without it, `inset:0` plus `padding:1px` paints a ring 2px oversized.
  - ⚠️ **`@property` IS MANDATORY FOR THE ORBIT** — an unregistered custom property animates
    DISCRETELY, so the head would jump rather than travel. **Proved by interpolation, not by a
    registration probe**: a computed `conic-gradient(from 121.86deg …)` mid-animation is a value
    an unregistered property could never produce. My first assertion tested for a re-registration
    error message and failed on working CSS.
- ⚠️ **THE COLLAPSED RAIL OPENS SUB-MENUS ON HOVER** (request, 10 Sep 2026: *"when the sidebar is
  collapsed and I hover the icon then show the submodule popup, in every icon"*). Two guards were
  removed from `mfOpen` — the general one and Explorer's — both of which read
  `!sidebar.classList.contains('open')`.
  - ⚠️ **THIS DOES NOT BREAK GEMINI'S RULE, and the distinction is the whole point.** The rule this
    option exists to demonstrate is that **hovering never changes the rail's WIDTH** — one toggle
    does. That still holds: `sbHover` is still neutralised, and the probe asserts the rail measures
    53px before and after every hover and is still collapsed at the end. What hover now does is
    open the module's menu *beside* the rail, which is a different affordance from expanding it.
  - ⚠️ **THE OLD GUARD'S COMMENT WAS ALREADY STALE** — it read "hovering the collapsed rail expands
    it and nothing else", which is Option 10's behaviour, not this one's. Here nothing expanded on
    hover either, so the guard left the collapsed rail with icons and tooltips and no route to a
    sub-module at all without toggling the whole sidebar open.
  - ⚠️ **THE ANCHOR NEEDED NOTHING.** The menu is placed at `railWidth() + MF_GAP`, and
    `railWidth()` reads the collapsed token, so it lands 8px off a 53px rail exactly as off a
    240px one — measured (Alert 8, Explorer's grid 8, Report 8), not assumed.
  - ⚠️ **`const sb0` WENT WITH THEM.** It was read only by those two guards, and a live binding
    whose readers are deleted is how the next reader concludes the state still matters here.
  - ⚠️ **`MF_NO_HOVER` STILL MUTES Dashboard AND SLO, IN BOTH STATES.** That came from its own
    explicit request; applying one rule to both rail states was chosen over silently reversing it,
    so "every icon" is literally every icon that has a hover menu when expanded. One line if those
    two should open too.
- ⚠️ **ONE GAP BETWEEN THE SIDEBAR AND EVERYTHING THAT OPENS OFF IT — 8px** (request, 10 Sep
  2026: *"the sidebar and submodule sidebar use same spacing … in every popup margin is same 8px,
  also my profile popup and notification popup open within 8px margin of sidebar"*). **Measured
  first**, against a rail edge of 240: the module flyout and Explorer's grid sat at **4**, the
  notification and profile cards at **10** — three numbers for one relationship.
  - ⚠️ **`MF_GAP` IS THAT NUMBER AND `POP_GAP` IS DERIVED FROM IT**, not declared beside it.
    Holding it twice is exactly how the flyout came to be 4px away while the cards were 10. The
    `typeof` guard is for block order only — `MF_GAP` is in an earlier `<script>`.
  - ⚠️ **8 IS THE RAIL'S OWN STEP**, not an arbitrary pick: every `.sitem` is `margin:0 8px`, the
    rail's group gaps are 8, and the footer's two blocks are 8 apart.
  - ⚠️ **THE GAP IS MEASURED TO THE POPUP'S OWN BOX**, which is what "margin from the sidebar"
    means. `#mflyout` carries 6px of padding plus its border, so its inner `.mfcol` card sits 7px
    further in again — a probe that measures the CARD reports 15 and looks like a miss.
  - ⚠️ **STILL DIFFERENT, AND NOT TOUCHED: the row rhythm.** Measured, rail rows are 32px on a
    **42px pitch** (10px gaps) while flyout rows are 32px on a **36px pitch** (4px gaps). The
    request read as being about the popup margin throughout, so the flyout's own rhythm was left
    alone; `.mfi{margin:0 4px 4px}` → `10` is the one-line change if the two should match.
- ⚠️ **A POPOVER IS PLACED FROM THE CONTROL THAT OPENED IT** (`POP_TRIG` / `popPlace`, request
  10 Sep 2026: *"when I hover the notification the popup will be show behind the notification
  icon"*). `#notifPop` was parked at a hardcoded `bottom:56px` while the bell sits 10px off the
  viewport floor, so the card opened **46px above its own trigger** and read as floating loose in
  the page. Measured, not guessed: `.sfoot`'s padding is 10 and the icon row is its last block.
  - ⚠️ **BOTTOM-ALIGNED, NOT CENTRED.** The card is up to `100vh - 70` tall and its control is at
    the very bottom of the rail; centring would run most of it off screen.
  - ⚠️ **THE HORIZONTAL READS `railWidth()`, NOT `sidebar.offsetWidth`** — the rail transitions its
    width and this folder's oldest recorded trap is that a box measured mid-flight reports the old
    number. Same value today; the point is that it stays right if the card is opened mid-toggle.
  - ⚠️ **PLACED AFTER `renderNotifs()`**, which fills the body and so decides the height the
    top-clamp is computed from. It is all synchronous, so no frame paints between `.on` landing
    and the position being set — there is no flash needing the `visibility` dance `kbPopOpen` uses.
  - ⚠️ **`#userPop` GOES THROUGH THE SAME ENGINE** and lands where it already did (the avatar's
    bottom is the same 10px), so one rule serves both and neither can drift.
  - ⚠️ **THE `‹` ARROW IS GONE** (same request). `.pop::before` is a 10px square rotated 45° with
    only its left and bottom borders painted; `#userPop` had already killed it with `content:none`
    and the pair now matches. It was **also pointing at nothing**: its `bottom:80px` was measured
    against the old fixed position, so once the card follows the bell a hardcoded offset up its
    edge lands wherever the card happens to be tall.
  - ⚠️ **Option 11 and Option 10 still carry the fixed `bottom:56px` and the arrow.**
  - ⚠️ **STILL DIFFERENT, AND STILL UNDECIDED:** the What's-new `data-tip`. Option 11 reads *"Read
    the release notes ↗"*, Option 12 *"What's new in 10.0.1 ↗"* — which `tipRedundant()` suppresses
    while the label is painted, so it speaks only on the collapsed rail. Not touched: the request
    was the footer's shape, and HANDOFF already flags this pair as open.
- ⚠️ **TWO GEMINI TRAITS DELIBERATELY NOT COPIED**, both appearance rather than behaviour: its
  **292px** expanded panel (this keeps 240, the UX-rule floor — one token if wanted), and its
  **borderless** boundary. Gemini's rail-to-content edge is a ~1.03:1 surface change; ours would be
  1.04:1 in light (`#F6F9FC` on `#ffffff`), and this folder has recorded two bugs caused by exactly
  that, so the 1px border stays.
- ⚠️ **THE TITLE SUFFIXES ARE OFFSET BY ONE**, pre-existing: `dashboard-rail-flyout.html` carries
  "(alt)" because Option 10 was itself the alt of Option 1's rail, `-alt.html` carries "(alt 2)",
  so `-alt2.html` is "(alt 3)".
- ⚠️ **THE FILENAME DESCRIBES THE PATTERN, NOT THE INTENT** — `-alt2` because it is a third take on
  the same sidebar. Rename it the moment it becomes something else; `_variants.js`,
  `_verify/lxbehave.py`'s `FILES` and `_verify/dsconf.py` are the three places that must follow
  (`dsconf.py` takes its target as an argument, so it needed nothing this time).
- Verified: a **18-assertion** probe (no hover expand, no timer armed, the toggle on screen and
  hit-testable, centred at 32px, the row not a toggle, open/close, the canvas yielding to 240px,
  the mark and wordmark returning, focus not opening it) plus **Option 10 re-probed unchanged**;
  the switcher at its real filename (12 rows, Option 12 marked current with a `Z` keycap, all 12
  keys unique); **`Z` navigating for real in a real browser over http**; `harness … query`
  **ALL 77 PASS**; `lxbehave` **ALL 57 PASS ×12**.
  ⚠️ **`--dump-dom` CANNOT OBSERVE A NAVIGATION** — it never emits and the run has to be killed, so
  the switcher key was tested with `python3 -m http.server` + the browser tools. And a probe copy is
  written as `q-0.html`, so `location.pathname` says nothing about which option it is and
  `_variants.js`'s `here` never matches: key off the page's **title**, and test `.vs-item.on` in a
  sandbox that keeps the real filenames.

### Option 12's Explorer menu became a plain list (11 Sep 2026)

Eleven narrow requests in one day turned Explorer's flyout from a two-card master/detail grid into
**one flat list in one card**. Recorded together because each step removed a piece the next one
depended on, and reading them in isolation makes several look arbitrary.

| asked | done |
|---|---|
| *"replace the grid with the list like the alert submodule popup"* | the grid interception is gone from **both** `mfOpen` and the click path; Explorer falls through to `mfTree` like every other module |
| *"show all sub-modules by default, remove the expand/collapse icon"* | the chevron span is gone from the row template |
| *"remove the Monitor tab"* | **`MF_TREE_HIDE = { Explorer: ['Monitor'] }`**, filtered in `mfTree` |
| *"remove the child popup"* | no `onmouseenter="mfSub(k)"`; `mfSubIdx` stays `-1` for the life of the menu |
| *"background colour like the main sidebar"* | `#mflyout.mfcards .mfcol{background:var(--sidebar)}` |
| *"width & inside margin same as the alert popup"* | one line: `fly.classList.remove('mfcards')` |
| *"Topology's 6 children show inside the Topology row"* | every parent's `kids` render inline beneath it as `.mfi.sub` |
| *"the main module will use the icon"* | `MF_TREE_ICONS` + `.mficons` on the master column |

- ⚠️ **`MF_TREE_HIDE` FILTERS AT THE RENDERER, NEVER IN `EXPLORER_TREE`.** That array is the DATA:
  `railPinRow('Monitor')` reads it to build the pinned rail tile, its tooltip and its hover card,
  and `mfRailFirst` reads `tree[0]` to decide where Explorer's own rail click lands. Deleting the
  entry makes the pin render **nothing** — no error, just a missing icon.
- ⚠️ **THE `.mfcards` GATE WAS ASKING THE WRONG QUESTION.** Explorer's card was 332px wide with
  `padding:14px 44px 44px 0` against Alert's 302/6px — six measured differences, all from one
  class. `mfOpen` set it on `perRowDocs`, a *proxy* for "is this a master/detail tree"; that
  stopped being true the moment Explorer's detail pane was removed. **Naming the single cause is
  what turned a vague "make it the same" into a one-line fix** — measure first, then edit.
- ⚠️ **THE EMPTY DETAIL PANE IS STILL RENDERED.** `mfDetailAlign`, `mfClamp` and `mfFade` all
  reach for `#mfDetail`, and `#mflyout.mfcards .mfcol.mfdetail:empty` already hides it. Removing
  the div is the tidier-looking change and the one that breaks the menu.
- ⚠️ **THE INLINE CHILDREN CLOSE A GAP THE CHILD PANE OPENED.** With the pane gone, Topology,
  NCCM, APM and Flow had **nowhere** their children were listed. They reuse `.mfi.sub` — the
  indented child row Alert's own tree already uses — rather than inventing a `.mfchild`.
  **No caret and no count**, because the standing rule for this menu is "all sub-modules shown by
  default, remove the expand/collapse icon" and the supplied picture was described as *"only for
  reference"*. **No pin either**: pinning is `EXPLORER_TREE`-level via `railPinRow`, so a pin on a
  child would silently do nothing.
- ⚠️ **THE MODULE GLYPH IS A SCOPED EXCEPTION, NOT A REVERSAL** (request, 11 Sep 2026: *"the
  explorer submodule popup the main module will use the icon"*). The 10 Sep *"remove the sub
  module popup icon in every where"* still stands everywhere else — measured: **Alert emits eight
  resolvable `.mfic` of its own and paints none**, Settings the same.
  - ⚠️ **THE HOOK IS A CLASS ON THE COLUMN** (`MF_TREE_ICONS` → `.mficons`), because `mfTree`
    builds the master column for Explorer, Alert **and** Settings from one template and nothing on
    `#mflyout` says which is open.
  - ⚠️ **TWO SEPARATE QUESTIONS.** `icons` = "do all this menu's rows resolve a glyph" (decides
    whether the markup is emitted); `iconsOn` = "is this the menu that shows them". Collapsing
    them makes the `display:none` rule and the gate two half-answers in two languages.
  - ⚠️ **THE CHILDREN HAD TO RE-INDENT WITH IT.** `.mfi.sub`'s 24px was measured against a label
    at the row's own 9px padding; the module name now starts at **31** = 9 + 15 (`.mfic`) + 7
    (`.mfi`'s gap), and a child left at 24 would have sat **left of the module it belongs to** —
    the hierarchy inverted. Fixing that is part of the change, not scope creep.
  - ⚠️ **`.mfsidebar-icons-on` IS STILL APPLIED NOWHERE.** Its own note says "restore the icons and
    the parent weighting comes back with them" — it does **not**, and that is deliberate: re-arming
    it is a second change to a title/row contrast settled on 10 Sep. **Consequence, stated:** a
    module row and a page under it now share weight **500** and colour `rgb(202,211,226)`; the
    glyph and 13px-vs-12px are the whole difference. Say so rather than let it be discovered.
  - ⚠️ **NO WEIGHT CHANGED EITHER WAY.** `.mfi:has(.mfic)` asks whether the element **exists**,
    never whether it paints, so it matched these rows while they were `display:none` and matches
    them now. Same trap the file records at `.mfsidebar-icons-on`.
- Verified by probe: Topology lists **6** children; **15 of 15** children render, each directly
  under its own parent and indented past it; no child carries a pin, a DOCS chip or a glyph; a
  child navigates through `mfGo`; **9 of 9** module glyphs visible at 15px on **one** column
  (x=269) with labels and all fifteen children on **one** column (x=291); the row box unmoved at
  259; and Alert / Settings still paint **0 of 8** glyphs with their rows at the original x=269.
  Explorer's geometry against Alert's re-measured **IDENTICAL** on all thirteen fields after the
  rows were added.

### Option 13 — a byte copy of Option 12 (11 Sep 2026)

`dashboard-rail-flyout-alt3.html`, title *"Rail & Flyout (alt 4)"*, switcher key **`C`**. Made on
request with **only its `<title>`, its identity banner and its switcher entry different** —
everything this file says about Option 12 is true of it until one of them is changed.

- ⚠️ **IT IS THE FIRST COPY IN THIS FAMILY NOT TAKEN FROM OPTION 10.** Options 11 and 12 were both
  forked from Option 10; Option 13 is forked from **Option 12**, so it starts life carrying
  Gemini's rule (no hover expand, one toggle) **and** the entire 11 Sep Explorer pass — the flat
  list, `MF_TREE_HIDE`, the inline children, `MF_TREE_ICONS`. Do not assume "it is like Option 10";
  it is like Option 12, which is two sessions of divergence further on.
- ⚠️ **THE `mf*` / `sbNotif*` / `RAIL_TMP` / `railPin*` CODE NOW EXISTS FOUR TIMES**, with nothing
  syncing it. A change meant for the *pattern* is a four-file change and a grep for any of those
  names returns four files' worth of hits.
- ⚠️ **EVERY "Option 12" COMMENT INSIDE THE NEW FILE IS LEFT AS WRITTEN.** They record where a
  decision was made and why, not which file you are reading. Rewriting them to say "Option 13"
  would erase that history and make the two files diff as though they differed.
- ⚠️ **THREE PLACES HAD TO FOLLOW THE NEW FILENAME**, and they are named in the banner so the next
  rename does not miss one: `_variants.js` (auto — `node _sync_variants.js` appends the row, but
  it labels new pages `V13 · <title>`, so the label was hand-set to `Option 13` to match its
  twelve siblings; the script preserves hand-tuned labels), `_verify/lxbehave.py`'s `FILES`
  (manual), and `_verify/dsconf.py` (**nothing** — it takes its target as an argument).
- ⚠️ **`--dump-dom` OVER `http://` HANGS ON THE AGENTATION LOADER.** On `file://` the loader 404s
  and the run finishes; served over http the script actually loads and virtual time never
  completes, so **every assertion failed at once with an empty DOM** — which reads exactly like a
  broken page. The switcher has to be tested over http (its `here` comes from `location.pathname`,
  so a probe copy named `q-0.html` matches nothing), so the fix is a `_probe13/` directory of
  loader-stripped copies **under their real filenames**. `lxbehave.py` already strips it; this is
  the same trap one layer out.
- Verified: **16 assertions** over real http with real filenames — the page loads, the switcher
  lists thirteen rows with Option 13 last and marked current, its keycap is `C`, all thirteen keys
  are unique (`1 2 3 4 5 6 7 8 9 0 X Z C`), the footer hint ends with `C`, Option 12 still lists
  thirteen and still shows itself current with `Z` — plus **`C` navigating for real** (pressed on
  Option 12, the page that comes back is Option 13) and **⌘C / Ctrl+C NOT navigating**.

### Option 13's popups are Option 9's column (11 Sep 2026)

Three requests in one hour, each with a screenshot, converged on this: *"the all submodule popup
will be open like [a Setting column]… only for reference"* → *"in my thinking… like **Option 9**"*
→ *"[Option 9's Dashboard column is] the reference… the current all popup is [an] open popup, make
[it] Option 9 like"* — plus, on the pinned Monitor row's popup, *"remove the search and also
remove [the foot] [the Next-steps card and licence line]"*. The reference is Option 9's `.sknav`
(Option 6's copy), and every card `#mflyout` draws is now that column:

| Option 9's column | Option 13's card |
|---|---|
| docked flush to the rail, top to bottom, 296px, `--card` on a right border | `.mflyout{top:0;bottom:0;height:100vh;width:296px}`; the openers set `left = railWidth()` (no `MF_GAP`) and `mfClamp` sets `top = 0` |
| a bold name over a derived count, a 24px control at the end | `.mfhd` › `.mfhtt` `<b>` + `<span>` by **`mfHead`**, the count by **`mfSubtitle`**; the trailing slot is the **`DOCS ↗` chip** (see below), not Option 9's control |
| Plain rows — 36px, 18px glyph, radius 8, weight 400, 1px apart | `#mflyout .mfi` + `.mfic` overrides; children indent **40** = 11 + 18 + 11 |
| the list takes the room; nothing else scrolls | `.mflist{flex:1 1 auto;min-height:0;overflow-y:auto}` — **no `max-height`, no clamp** |
| foot (rocket · `?` · layout), *Next steps* card, licence line **on the floor** | **`mfTail(path)`**: `.mfft` (`margin-top:auto`), `#mfNs` › `.mfns`, `.mflic`; steps in **`MF_STEPS`**, state in **`MF_NS`** |
| a search field on the Setting column only | **none** — Setting opens no column here (`MF_NO_HOVER`); `mfSearchHTML` / `.uxsrch` kept, unreferenced |
| — | **the pinned Monitor card carries no tail** — head and rows only (`mfOpenPin` passes `null`) |
| — | **the count line is 10px / 600** (request, 11 Sep 2026, pointing at *"18 monitor types"*) — Option 9's is 12 / 400. It is the quietest thing on the card (it names what the list below then shows), so it drops under every row's 13 and takes the weight back to stay legible; `line-height` follows 16 → 14 or the 2px above it reads as 4. The title stays 14 / 600, so the two are separated by size alone |
| — | **the pinned band is SPLIT IN TWO** (`RAIL_PINS_HOME`). Two requests minutes apart — *"when I pin ANY sub-module it will show in between [the] Explorer and Report icon"* and *"the MONITOR icon will show after [the] Dashboard icon"* — read as contradictory only if "pinned row" is one thing. **Asked, and the answer was both**: Monitor ships pinned, so it is a permanent shortcut sitting with the rail's own rows (`PIN_UNDER = 'Dashboard'`), while what *you* pin gathers under the module it came from (`PIN_ADD_UNDER = 'Explorer'`, i.e. the Explorer–Report gap). ⚠️ **Membership, not a snapshot**: a name in `RAIL_PINS_HOME` draws in the Dashboard band *whenever* it is pinned, so unpin-and-repin returns it there instead of migrating it. ⚠️ **Each band has its own flag and its own emptiness test** — sharing `pinsOut` would let the first emitted mark the second done, and testing `RAIL_PINS.length` for both would draw an empty band's hairline. **Options 10, 11 and 12 keep one band under `Dashboard`** |
| — | **the pinned-row card's title carries a pin** (request, 11 Sep 2026, with the NCCM card's head circled: *"the sidebar title will show a pin icon — behind the title"*) — restoring, **on that one card**, the control removed a few hours earlier by *"in the Monitor sub-module popup remove the pin icon"*. `mfSecPin` is set only by `mfOpenPin`, so Alert, Explorer, Report and Health stay bare. It reuses `mfSecPin` / `mfPinFromSec` / `.mfsp`, kept unreferenced since the removal precisely so this was **one argument**, not a rebuild. ⚠️ **The title line had to become a flex row** (`.mfht`): `.mfhtt` is `flex:1 1 auto`, so a pin added as its sibling lands next to the DOCS chip, not the name. ⚠️ **`mfPinFromSec` was reading `.mfsec .mfsp` only** — correct until the card title became `.mfht` — so a press would have toggled the pin and left the mark on the old state, silently |
| — | **…but not for a row the Explorer column does not list** (request, 11 Sep 2026, on the Monitor card: *"Monitor is not part of Explorer, so don't show a pin icon in its title"*). Gated on **`MF_TREE_HIDE.Explorer`**, not on the literal `'Monitor'` and not on `RAIL_PINS_HOME` — all three hold the same one name today, but only `MF_TREE_HIDE` answers the question the request asks, *"does the Explorer column offer this row?"*, which is the same question as *"can it be put back?"*. ⚠️ **The real reason is reversibility, not tidiness**: that pin UNPINS, and for NCCM that is undoable one hover away in the column that lists it — for Monitor there is no such row, so the press would have been a one-way door out of the Layout drawer. Hide another row from Explorer and its card loses the pin for the same reason, with no edit |
| — | **a pinned rail row carries no pin mark** (request, 11 Sep 2026, with the five marks outlined: *"remove the pin icon in the sidebar, and move the sub-module title"*). It only ever appeared on the rows with **no children** — the ones with children spend that slot on the chevron — so the band read as two kinds of row, five navy pins against four grey arrows, for a difference the arrow already states. ⚠️ **The title moves because the mark was INSIDE `.lbl`**: `.pd` carried `margin-left:auto` and pushed itself to the row edge, so the label ended where its text ended; with it gone the label spans the row. One deletion, both halves of the request. ⚠️ **Nothing becomes unpinnable** — the mark was an `<i>` with no handler; unpinning is still the Explorer column's per-row `.mfpin` and the Layout drawer. `.pd`'s CSS and `MF_PIN` are kept and unreferenced here |
| — | **the footer folds three controls into one when the rail runs out of room** (request, 11 Sep 2026: pin every Explorer sub-module and *"the sidebar is full and it scrolls… the bottom 3 icons will be combined — Approval, What's new and Health"*). `#sbMore` (Tabler `system/dots`, from `free-icons/`, filled) opens `#morePop` listing the three in the order they sat in; **Notification and the avatar are untouched**. ⚠️ **The trigger is the OVERFLOW, not a pin count** — "all pinned" is the symptom; a short viewport or a longer rail reaches the same state with fewer pins. ⚠️ **The hysteresis is the whole problem and it is explicit**: collapsing makes `.smenu` taller, which can make it fit, which would expand the footer, which overflows again — so `railFootFit` collapses on overflow, and only expands by actually TRYING the full footer and measuring again. ⚠️ `display:none`, never removal: `showView()` toggles `.on` on `#sbApproval`/`#sbHealth` **by id** |
| — | **the list fades at BOTH ends while it scrolls** (request, 11 Sep 2026: *"when the Explorer sidebar scrolls up and down, the top and bottom blur effect — apply top and bottom"*). There was a bottom fade only, and two things about it were wrong in the column: it ramped to **`var(--pop)`**, the floating card's surface, not the column's `--card`; and it was anchored `bottom:1px` on the CARD, which was the list's own edge back when a card was head + list — with a foot, a Next-steps panel and a licence line now below it, the fade would have washed over those. `mfFadeCard` publishes the list's measured box as **`--mflt` / `--mflb`** and toggles `.mftop` / `.more` independently, so each edge appears only when there is something past it and a card that later grows another block needs no new number. ⚠️ They cannot live on `.mflist` — it is the scroller, so its own pseudo-elements would scroll away with the rows |
| — | **the rail is one 10px rhythm** (request, 11 Sep 2026: *"the same padding between the Search icon and the Dashboard icon, like [between] the Dashboard icon and [the] Monitor icon"*). MEASURED first: every module-to-module gap was 10 (each `.sitem`'s own `margin-bottom`) while Search→Dashboard was **14 expanded** (`.sidebar.open .stop{margin-bottom:4px}`) and **16 collapsed** (`.sidebar:not(.open) .smenu{padding-top:6px}`) — two different separations in two states, neither of them the row gap. Both zeroed; the horizontal 10 stays, since the note above derives the icon column from it |
| — | **the column's two edges carry the same inset** (request, 11 Sep 2026, both edges outlined) — everything starts **L+20** and ends **R+20** from the column's PADDING box: title, count, DOCS chip, every row's content (`.mflist` 8 + `.mfi` 1px border + 11 / 12), the foot's last button, the licence line and the Next-steps panel. The 1px `border-right` is the divider, not an inset, which is why the right reads 21 from the OUTER edge |
| — | **the left half of the drop shadow is clipped off** (request: *"remove the shadow on the sidebar sub-module sidebar left side"*). `8px 0 28px` is offset right but its blur still spilled ~20px left, striping the rail. **`clip-path:inset(0 -40px 0 0)`** — not a bigger x-offset, which would drag the darkest part into the canvas. ⚠️ `overflow:hidden` does **not** do this: it clips descendants, never the element's own shadow. Proven by sampling the rail pixels open-vs-closed: **0 of 60 differ** on the left, up to 25 on the right |
| — | **hovering the rail ANYWHERE reveals the expand glyph** (request) — `.sidebar:not(.open):hover`, where it was `.strcol:hover`. The 32px hit region is unchanged; only the reveal moved outward, so nothing new became clickable. `:focus-visible` still reveals it on its own |
| — | **clicking an Explorer sub-module puts it on the rail until you leave** (request: *"when I click the Explorer sub-module WITHOUT PIN, the module will be added in between the Explorer and Report icon"*) — **`railTmpGo`**. ⚠️ **The temporary row already existed and had been unreachable since the grid stood down**: `RAIL_TMP` was armed in exactly one place, `mfGridGo`, and Explorer stopped opening that grid on 11 Sep. Everything downstream still worked — a feature died from having its one caller removed, with no error and nothing in the DOM to notice. One arming function now serves both doors, gated to Explorer in the renderer where the menu name is known |
| — | **the card title starts on the rows' own left column** (reported 11 Sep 2026: *"the title text and list of sub-module will show [the] same alignment"*). Option 9 pads its header 12 and its body 8, so its title sits 8px left of its rows — a difference this card had no reason to inherit. `.mfhd`'s left pad is **20 = 8 (`.mflist` padding) + 1 (`.mfi`'s transparent `border-left`) + 11 (`.mfi` padding)**, where a row's text starts with or without a glyph; the count and the licence line land there too. Derived — re-derive it if any of the three moves |
| — | **the head's trailing slot is the `DOCS ↗` chip** (request, 11 Sep 2026, with the control outlined and the chip supplied as the replacement: *"remove the expand/collapse icon and add [the] document link"*). It had gone to the foot's `?` in the column pass — and then `MF_NO_TAIL` took the foot off Alert, Explorer and Report, so **those three had no documentation link at all**; this puts one on every card. The path comes from the caller, each of which already knows its own: `mfTree` reads `MOD_DOCS[name]`, `mfCol` reads `mfSecPath` — which `mfOpenPin` sets to the **pinned row's** page, so Monitor's chip goes to Monitor's docs, not Explorer's. `MF_COL` and `.mfhb` are **kept and unreferenced** |
| — | **Alert's NetRoute, APM and RUM show their children inline** (request, 11 Sep 2026: *"Alert's NetRoute, APM and RUM have child sub-modules — show them like Explorer"*). A **data change only**: `SUBNAV['Alerts']`'s six `sub` rows are attached to the tab they follow (`t[t.length-1]`), and `mfTree`'s inline renderer was never gated on Explorer — it asks `r.kids && r.kids.length`. ⚠️ **This reverses 9 Sep's "remove the child sub module", and the reason it was right then no longer holds**: back then `kids` grew a chevron, a "2 VIEWS" count and a second card on hover, so three of eight rows behaved differently for two links each. Option 13 has none of that — six rows, no new behaviour. `kidsAs:'views'` restored with them. The count still reads the parents ("8 pages") |
| — | **Alert's and Report's rows paint no glyph** (two requests, 11 Sep 2026, each with that card's icon column outlined: *"remove the icon"*) — **`MF_NO_ICONS = ['Alert', 'Report']`**; every opener calls `mfNoIcons(name)`, which toggles **`.mfnoic` on `#mflyout` itself**, and one rule (`#mflyout.mfnoic .mfi > .mfic{display:none}`) withholds the paint — the markup still carries the glyph, the same shape as the 10 Sep global hide. One class on one element, so `mfTree` and `mfCol` cards are covered alike and nothing leaks between cards. Explorer and Health keep theirs |
| — | **every sub-module row is 13px / 600** (request, 11 Sep 2026: *"the font size of all the submodule list, make it 13px semibold on Option 13"*) — Option 9's rows are 400, the request names this option. `#mflyout .mfmaster .mfi,#mflyout .mfcol .mfi{font-weight:600}`; **Explorer's children stay 12px / 400** (`#mflyout .mfi.sub`), the one level the earlier request set apart. The `:has(.mfi.sub) .mfi.par` rule is now redundant and kept |
| — | **Explorer's two levels read at two sizes** (request, 11 Sep 2026: *"the submodule font size is 13px and semibold and the child submodule font size 12px"*) — `#mflyout .mflist:has(.mfi.sub) .mfi.par{13px/600}` and `.mfi.sub{12px}`, **keyed on the list having children, not on the menu's name**: Alert's `.par` rows (same class, one level) stay 13/400, and any menu that ever renders children inline weights its parents up with them. `:has()` carries its argument's specificity, which is what lets (1,5,0) beat the column's 400 without an id |
| — | **Alert, Explorer and Report carry no tail either** (three requests minutes apart, 11 Sep 2026, each with that card's foot · card · licence outlined: *"remove [this]"*) — **`MF_NO_TAIL = ['Alert', 'Explorer', 'Report']`**, honoured by one gate, `mfTailFor`, in all three builders (`mfTree`, `mfOpen`'s `mfCol` path, `mfOpenUtil`). That is every rail module that opens a card; **only Health** (the utility) still ends in the tail — one more name in that table if it goes too |

- ⚠️ **THE COUNT IS DERIVED FROM THE ROWS THE CARD LISTS, never typed** — Option 9's `skSubtitle`
  is the model. Explorer says **9 sub-modules** (not `EXPLORER_TREE.length`, 10 — `MF_TREE_HIDE`
  keeps Monitor off the list); a pinned row uses its own `kidsAs` (**18 monitor types**); the rest
  is Option 9's generic *"N pages"*. `mfSecSub` travels exactly as `mfSecPath` does.
- ⚠️ **THE TAIL IS REAL, NOT DECORATION.** The four steps are Option 9's verbatim and every one is
  a harvested `ST_TREE` category opened through `stOpen` (in `_settings-module.js`, which this
  file loads — checked); `MF_NS.done` fills as steps are *visited*, the rocket's badge counts what
  is left and hides at zero, ✕ dismisses until the rocket brings it back. `?` opens the module's
  own `MOD_DOCS` page; layout opens `layOpen()`; *Manage licence* finds My Account › License by
  the same `/licen/i` lookup Option 9 uses. Every one verified on a stub.
- ⚠️ **THE GLYPHS ARE `tour`, `help`, `columns`** — the three Option 9 uses and the three that
  resolve here (`rocket`, `question`, `layout` do **not**; checked before binding). ✕, chevron and
  tick are inline paths (`MF_X`, `MF_CHEV`, `MF_DONE`).
- ⚠️ **THE CHILD-INDENT INVARIANT IS "one column across every card", NOT "aligned with its own
  parent's label".** The latter holds only where the card paints glyphs: there the glyph takes the
  text column and the parent's label already sits 29px in, so child and parent coincide. Alert
  paints none (`MF_NO_ICONS`), so its parents sit at 73 and its children at **102 — the same 102
  Explorer's children use**. A probe asserting the narrower rule reported a real number as a
  failure; the columns were right and the expectation was wrong.
- ⚠️ **`getBoundingClientRect()` RETURNS THE TRANSFORMED BOX.** A probe read the heading pin's
  glyph as 14px and called it a CSS failure; the rule says 10px and a 10px square rotated 45°
  bounds at 10·√2 = 14.14. Assert `getComputedStyle().width` for anything carrying a `transform`.
- ⚠️ **`mfHide()` DROPS `.on`; IT DOES NOT EMPTY THE CARD.** A probe queried the hidden card's DOM,
  found a stale button and reported it as going stale — the card had in fact closed, correctly,
  because the rail row it was anchored to had just been unpinned. Ask the card, not its children.
- ⚠️ **A LAYOUT RULE THAT CHANGES WHAT IT MEASURES NEEDS STATED HYSTERESIS.** The footer's collapse
  makes the list taller, which is the input to the decision to collapse. Written as one test it
  oscillates forever. Written as "collapse on overflow; to expand, put the full footer back and
  measure again" it settles — verified by running the fit eight times and asserting the class never
  changes (`11111111` at 857px, `00000000` at 1157px).
- ⚠️ **A FEATURE CAN DIE FROM LOSING ITS ONE CALLER.** `RAIL_TMP` had a renderer, a CSS class, a
  dashed ring, an anchor constant and a derived teardown — and nothing had set it since the grid
  stood down. Nothing errored and nothing was missing from the DOM; it simply never happened.
  When a code path is removed, grep for what ONLY it called.
- ⚠️ **WHEN TWO REQUESTS LOOK CONTRADICTORY, THE NOUN IS USUALLY DOING TWO JOBS.** "Pinned row"
  meant both *the shortcut the rail ships with* and *the thing you just pinned*; asking which was
  meant returned "both", and the answer was two bands rather than a sixth placement of one. Worth
  one question — guessing would have silently reversed a request made minutes earlier.
- ⚠️ **A DERIVED NUMBER IS ONLY AS GOOD AS THE THREE VALUES IT WAS DERIVED FROM.** The child
  indent `31px` — `9 (row padding) + 15 (.mfic) + 7 (gap)`, correct for the floating card — was
  left behind when the column re-derived all three as `11 + 18 + 11 = 40`. Both rules matched every
  child row and **the stale one won on specificity** (`#mflyout .mfmaster.mficons .mfi.sub` at
  (1,4,0) over `#mflyout .mfi.sub` at (1,2,0)), so parents' labels sat at 102 and children's at 93
  — reported as *"the sub-module text and child sub-module text will show the same alignment"*.
  Four rules deep, found by dumping every matching rule rather than by reading the sheet. A stale
  derived value with higher specificity does not linger, **it wins**; delete it or re-derive it.
- ⚠️ **NOTHING WAS STRANDED BY LOSING THE HEAD'S CONTROL.** It closed the column, and the column
  already closes on `mouseleave` and on any click that navigates — the way every flyout in this
  rail has always closed. Checked before removing it, not after.
- ⚠️ **THREE RECORDED DECISIONS ARE REVERSED IN THIS FILE ONLY, by the reference:** the 10 Sep
  "quiet title" (`.mfsec` untouched — the card title is a different element); the 11 Sep "8px off
  the rail" (the column docks flush; `MF_GAP` still spaces the popovers); and Option 12's
  "background like the main sidebar" (`--card` beside a `--sidebar` rail is the one-step surface
  change the reference shows). The DOCS chip left the header for the foot's `?`, where Option 9
  keeps it. **That lasted an hour**: with `MF_NO_TAIL` removing the foot from three of the five
  cards, the chip came back to the head and both callers pass their real path again.
- ⚠️ **`mfClamp` NO LONGER COMPUTES ANYTHING.** The column is the viewport and the list is
  flex-sized; the old floating-card computation is **`mfClampBox`, kept and unreferenced**. The
  first docked build kept the computed `max-height` and the user's own screenshot showed the foot
  and card **painted over the list rows** — a `max-height` on a flex-sized list inside a
  full-height column is exactly the wrong thing.
- ⚠️ **`Setting` STILL OPENS NO COLUMN** (`MF_NO_HOVER`; it lives in the footer and navigates on
  click). Flagged twice now — which rail items open a card was never the request.
- ⚠️ **NO SECTION FOLDS.** Option 9's titled sections (Dashboard's *NOC View*, with a caret) fold;
  none of the cards that open here has a second section, so there was nothing to port. If one
  ever does, `.mfsec` is where it lands.
- ⚠️ **A SELECTOR SCOPED TO A PARENT IS A CLAIM ABOUT WHERE THE ELEMENT LIVES.** When the chip
  briefly moved into `.mfhd`, every one of its rules was `.mfsec .mfsd …` and its `<svg>` painted
  at the UA's 300×150 in black. **The probe passed** (the chip *was* present); the screenshot
  caught it. Assert the paint, never the presence.
- ⚠️ **A PROBE THAT CLICKS THE REAL `stOpen` / `layOpen` NEVER FINISHES** under
  `--virtual-time-budget` — those handlers arm timers virtual time waits on, and the run dies at
  the wall clock with **`NO PROBE OUTPUT`**, which reads like a broken page. Stub them
  (`window.stOpen = (c,p) => …`) and assert the wiring.
- ⚠️ **`sips --cropOffset 0 0` IS TREATED AS UNSET** and the crop falls back to centre — two
  "different" popup screenshots came back byte-identical. Use `1 1`.
- Verified, after `MF_NO_TAIL`: **ALL 12 PASS** — Alert, Explorer and Report have no foot / card /
  licence and their lists run to the floor (Explorer's still scrolls); Health still carries the
  tail; Monitor still none; nothing leaks between cards. Before it: **ALL 77 PASS at 857px AND at 497px** — five cards × (flush at `railWidth()`, top 0,
  full height, 296 wide; name / count; close control, no chip; no field; 36px/400 rows; glyphs at
  18px; no inline `max-height`; foot · card · licence present with the foot's top **equal to** the
  list's bottom and the licence 20px off the floor — or, for Monitor, none of the three; the list
  scrolling when taller than its room), the column following the expanded rail to 240, close /
  ✕ / rocket / `?` / step / licence / layout each doing its one thing on a stub, no error, the
  count cleared. **Options 10, 11 and 12 untouched.**

### Option 13 — the pin, its blinking dot and the picture intro (15 Sep 2026)

Request: in Explorer's column the pin only appears on hover, so nothing says a sub-module *can* be
pinned. Wanted: shown **only the first time** the sidebar opens, a live "blink" mark in the *new*
colour on the list, and hovering it opens a **picture introduction tooltip** explaining what pinning
is, styled like a supplied *Condition Router* card (title, bold lead, How to use / Output / Example /
Limitation down a connector rail, a badge).

⚠️ **THREE BUILDS IN ONE NIGHT — THE THIRD SHIPS.** (1) a blinking **pin** on the first row only —
*"you blink the pin icon, it is wrong, make it a dot … show all main sub-module"*; (2) a blinking
**dot in place of the pin** on every row — *"don't remove the pin icon, the blink will show behind the
pin icon"*; (3) **the pin, visible and unchanged, with the blinking dot beside it**, on every row — first
after the pin, then swapped to **before** it minutes later (*"swap the pin icon and blink action"*), so a
row reads **dot · pin · DOCS**. Then the last word: *"only the blink action is shown by default and the pin
icon will show only on hover"* — **the pin is hover-only again**; only the dot shows at rest. Don't
restore any earlier shape.

| part | what |
|---|---|
| pin (`.mfpin`) | **untouched — hover-only**, as on every other visit, keeping its `data-tip` and its click. It keeps its box at opacity 0, so the dot does not move when the pin appears under the pointer. It does not blink |
| dot (`.mfpinhot` › `.mfpindot`, `MF_PIN_DOT`) | **right before the pin**, on every main row (9; child rows never), an 8px teal dot (`.mftag.new`'s teal) in a 12×20 hotspot, blinking (`@keyframes mfpindot`) with a ripple (`::after`, `@keyframes mfpinlive`); off under reduced motion. **Its own `role="button"` span, not inside the pin's `<button>`** — hover, focus or click it and the card opens; it never pins |
| card (`#mfPinIntro.mfpi`) | **360px** (reworked on request, *"improve this tooltip"*), on `<body>`, `position:fixed` at the column's right edge, top clamped, its arrow (`--mfpi-arrow`) on **whichever dot is hovered**. A **header** (the pin in a teal tile · *Pin a sub-module* at 13.5px/600 · one line of description) · a **two-panel picture of the real flow** — *In Explorer* (Topology hovered with its dot + pin, then three more rows) → the product's `long-arrow-right` (`MF_PI_ARROW`) → *On your sidebar* (Dashboard · Explorer · **Topology lit** · Report), four rows a side so the panels match · the four reference sections with **600-weight keys** and one-to-two-line copy (`text-wrap:pretty`, so no one-word last lines) · a hairline footer with the *9 sub-modules can be pinned* tag (tinted, no outline) and **Got it** |
| "first time" | `localStorage['oo13-pin-intro-read']` (try/catch). **Got it or ANY pin press** marks it read; `mfPinIntroDone()` removes every dot in place (no repaint). `mfPinIntroReset()` replays it |

- ⚠️ **A PINNED ROW GETS A DOT TOO** — its filled pin beside the dot still reports the state, and every
  row keeps its pin and dot at one x.
- ⚠️ **THE COLUMN'S `onmouseleave` CALLS `mfHide()` AT ONCE**, so crossing from a dot into a card that
  lives on `<body>` would shut the column mid-journey. `mfPinIntroHolds(e)` checks the `relatedTarget`
  first; the card's own `mouseenter` sets `mfIn` and clears `mfTimer`, and its `mouseleave` returns to
  the column (closing only the card, after 200ms — unless the pointer lands on a dot) or closes both.
- ⚠️ **`mfPinIntroDone()` RUNS BEFORE `railPinToggle`** in every pin's `onclick` — the toggle repaints
  the column and asks `mfPinIntroOn()` again, so the order decides whether the dots come back.
- ⚠️ **The dot carries no `data-tip`** — the tooltip engine would paint under the card (the kbPop rule).
- ⚠️ **`.mfpin` transitions its opacity**, so a probe reading a pin's opacity right after Got it sees
  the pre-transition value — freeze transitions first (it failed once on correct CSS).
- ⚠️ **A flex `li` wrapped the bold label into its own column**; the bullet rows are blocks with an
  absolutely placed dot. **`font: inherit 600 …` is an invalid shorthand** — `.mfpigot` uses longhands.
- ⚠️ **Assumptions, stated:** teal because the ask said "like new"; "first time" = until read, per
  browser. **Option 13 only.** Options 10–12 keep the plain hover-revealed pin.
- Verified: a 43-assertion probe at 1920×1100 **and** 1280×720 (the card's header, both panels, the arrow, equal panel heights, the hovered row's dot + pin, the lit sidebar row between Explorer and Report, no clipped picture label, 600 keys, the footer, 360px, inside the viewport; 9 rows, 9 pins hidden at rest and revealed on row hover with the dot not moving, 9 dots before them and
  none on children, pin and dot columns aligned and centred, no clipped label, card from any dot with
  the arrow on it, clicking a dot opening the card without pinning, Got it removing every dot with the
  pins still hover-only, a pinned row's filled pin + dot, a pin press pinning Log and reading the
  intro) · dark and light screenshots.

### The 10 Sep 2026 pass — two dead CSS states, and the sizes

All in Options 10 and 11. Two of these were rules that existed and could never take effect:

- ⚠️ **THE COLLAPSE ARROW NEVER CHANGED.** `.sidebar.open #collapseArrow{transform:scaleX(-1)}` was
  the wrong key: `.sidebar:not(.open) .strcol{display:none}` hides that button whenever the rail is
  not open, so the selector was **true every time the glyph was on screen** and the un-mirrored
  state was unreachable. It flips on **`body.pinned`** now — the state the button actually toggles,
  since the rail also opens on hover — which also makes the glyph agree with the `data-tip`
  `toggleSidebar` has written from `sbPinned` all along. Option 10's authored tip was the wrong half
  of the pair from the first paint (it boots unpinned) and is corrected. ⚠️ **`sbPinned` and
  `body.pinned` must agree at boot** — Option 10 `false` + `<body>`, Options 11/12 `true` +
  `<body class="pinned">`. Option 11 needed no change: its button hides the sidebar outright, so
  whenever it is visible the sidebar is pinned, and `#sbOpen` (a hamburger) is the way back.
- ⚠️ **THE PIN BADGE VANISHED ON HOVER.** A second `.mfsec .mfsp:hover{background:var(--hover-side)}`
  sat one line below the real hover rule at the **same specificity**, so source order handed it the
  win: the dark disc was repainted `#eef2f8`, **1.02:1** against the heading — the badge turned into
  the surface behind it. It was the hover for the badge's first shape (a bare glyph button) and
  outlived the block it belonged to. ⚠️ **AN `!important` STAND-IN IS WHAT HID IT FROM MY OWN
  PROBE** — it beat both rules and reported the intended colour. A hover probe must read the
  CASCADE: enumerate every rule matching the selector and assert there is exactly one.
  The colour shift alone was ~1.13:1, so both badges also gained a **3px halo at 22% of `--action`**.

Sizes and colours, all measured:

- the rail's **"has a list" chevron** — 18px, the rail's own icon size, on Alert · Explorer · Report
  and on a pinned or temporary row **that has children** (`mfOpenPin` refuses a childless row, so an
  arrow there would open nothing; those keep the pin mark). Alert renders through `mfTree`, not
  `mfCol` — which is why it was 0/8 while Report was 10/10.
- **the flyout's own row arrows were added and then removed again** the same day: the rail row says
  the module has a list, so repeating it inside the list said it twice. `.mfgo` and `.mfkc.nav` are
  parked; the reserved chevron box stays on every tree row.
- **Ask AI** wears the brand ramp as a **10% wash (15% on hover)** in both rail states, and its
  label is clipped from the **full** ramp again. Both measured and accepted: the full ramp on a 10%
  wash of itself is 2.04 / 5.10 / 2.76 light and 5.69 / 2.38 / 4.36 dark — under 4.5 at the blue and
  magenta stops. ⚠️ Any future colour on that label must set `-webkit-text-fill-color`, not just
  `color`, or `background-clip:text` paints the glyphs solid on top of the gradient.
- **Explorer's grid**: the icon box is **40px** (30 → 34 → 36 → 40 in one day), border-only at rest,
  `--card` (`#ffffff` in light) **on hover** — 1.39:1 against the hovered tile where `--pop` was
  1.11. The **pin badge** is tilted 45° and sits 2px inside the corner: the offset that centres an
  18px badge on the *visible* corner is **-10**, not -9, because it resolves against the padding box
  and `.mfgt` has a 1px border.
- **the pinned row's mark is the arrow**, and the **pin moved into the popup's heading** as the grid
  tile's own badge (filled = pinned, hollow = not, and it reflects `railPinned()` — it lied for a
  temporary row until that was fixed). It closes the card only when the row it belongs to is gone.
- **brand mark 24×24** with both anchors re-derived (centre 26, wordmark x=46, `.strigger`'s gap
  5 → 8px); **brand row 56px** — ⚠️ declared **twice**, once for both rail states and once for the
  collapsed one, and they must move together: when they last disagreed (53/64) the whole list below
  shifted 11px as the rail expanded; **collapse/expand glyph 20px** in a 32px button (Option 11's
  canvas-side expand button follows, and being stroked its width is derived: 1.25 × 24 / 20 = 1.5).
- the **⌘K keycap** is a definite 16px `inline-flex` chip on the UI font, ink at **50% of `--text`
  mixed into the chip**. ⚠️ Stated rather than softened: that is **3.16:1 dark / 2.72:1 light**,
  below 4.5 for text this size, on a shortcut hint beside a row that already reads "Search".
  ⚠️ **A CORRECTION**: the "3.12:1" once quoted for `--text-dim` there is the `.aipanel`-SCOPED
  value of that token, not the rail's — at `:root` it is 4.07 / 4.55, borderline, not failing.
  ⚠️ `color-mix()` serialises as `color(srgb 0..1)`, **not** `rgb(0..255)`: a probe dividing by 255
  reported 1.79:1 and 17.66:1 on correct CSS.
- **light `--sidebar` is `#F6F9FC` in all twelve options**, not `#ffffff`. It had been the same value
  as `--bg` and `--card`, so the rail, the canvas and every widget were ONE surface with only a 1px
  border between them — the cause of two bugs already recorded here.

## An init-aborting crash on Windows and Linux, in six files (5 Sep 2026)

Found while removing Option 8's rail search, and it was **live in every option**:

```js
if (!/Mac|iP(hone|ad)/.test(navigator.platform||'')){
  document.getElementById('sbKbd').textContent = 'Ctrl K';        // ← null in six files
  document.getElementById('sbSearch').setAttribute(…);
}
```

- ⚠️ **`#sbKbd` DOES NOT EXIST** in Options 5, 6, 7 or 8 — each builds its own rail and none of
  them renders that keycap — and `getElementById(...).textContent` on `null` **throws inside
  `init()`**, so on any non-Mac platform the whole dashboard stopped initialising at that line.
  Everything downstream of it — the canvas, the tabs, the time chip — never ran.
- ⚠️ **NO PROBE IN THIS FOLDER COULD EVER HAVE CAUGHT IT.** The branch only runs off a Mac, and
  headless Chrome on a Mac reports a Mac. It was proved by overriding `navigator.platform` in an
  injected `<head>` script *before* the page's own scripts run: unguarded it reports
  `Cannot set properties of null (setting 'textContent')`, guarded it reports none.
- Both lookups are guarded now in **all six** files that had the unguarded pair (Options 1, 4, 5,
  6, 7, 8 — Options 2 and 3 do not carry it). Options 1 and 4 do have `#sbKbd`, so they were never
  crashing; they are guarded for consistency.
- ⚠️ This is the same class the folder's notes already record five times — *"a `let` in a later
  block is not hoisted"*, *"three init-aborting `ReferenceError`s"*. **Only a fresh load on the
  affected platform shows it**, which is exactly why it lasted.

## Option 1's flyouts are one column width (5 Sep 2026)

Request: *"the submodule sidebar popup will be same width"*. Measured first — the six menus came
out at **three** widths, so hovering down the rail made the menu jump wider and narrower under
the pointer:

| menu | was | now |
|---|---|---|
| SLO · Report | 221 (one 216px column) | **293** |
| Alert · Explorer · Setting | 332 (a 288px master) | **332** |
| Dashboard | 471 (216 + a 250px Starred column) | 543 |

`.mfcol` went **216 → 288**, the width `.mfcol.mfmaster` already had, so every menu's primary
column is now the same. ⚠️ **THE MASTER'S 288 IS WHAT WINS, not the 216** — it was itself measured
up from 236 on 2 Sep to stop Settings' longest labels truncating, so narrowing to 216 would
reintroduce that. The two rules hold one number between them; change them together.

⚠️ **TWO THINGS STILL MAKE A MENU WIDER, and neither was in scope:** the master/detail menus carry
44px of right padding so the two cards' shadows have room to fall (2 Sep), which is the 332 against
the single-column 293; and **Dashboard has a second, 250px Starred column**, so it is 543. Making
every menu identical means deciding what happens to that column — narrowing it, stacking it under
the list, or dropping it — which is a change to what the menu contains, not to its width.

## Two paint bugs the DOM said were fine (5 Sep 2026)

Both reported on Option 6, both invisible to `getComputedStyle`, both found by sampling pixels.

**1 · A hidden panel was casting a shadow across the canvas.** Reported as *"all line in right
side"*. `.dpanel.hid` parks the dashboard list off-screen at `translateX(-101%)` and clears its
shadow — but `html[data-theme="light"] .dpanel{box-shadow:…}` is **(0,2,1)** (an attribute
selector, a type and a class) against `.dpanel.hid`'s **(0,2,0)**, so the light rule won and a
24px blur went on painting from x=61 across the rail's edge into the board. The pixels right of
the rail ramped **238 → 248 over ~14px** instead of being one hairline. Fixed with
`:not(.hid)` on the light rule rather than piling another class onto the hider.
- ⚠️ **LIGHT THEME ONLY**, which is why it survived: in dark the band is invisible against `--bg`.
  Check a "there's a line" report in BOTH themes before concluding there is nothing there.
- ⚠️ **THE SAME PAIR IS STILL LIVE IN Options 1, 2, 4, 5, 7 AND 8** — one line each. Not fixed
  there: the report was against Option 6 and the panel's resting position differs per option.

**2 · A 64px child was painting over its 64px parent's border.** In the collapsed state
`.skrail` is `flex:0 0 var(--sk-rail)` = 64px and the sidebar is 64px too — but the sidebar is
border-box with a 1px right border, so its **content box is 63**. The rail overflowed by exactly
that pixel and its opaque `--card` background covered the border. `getComputedStyle` still
returned `border-right: 1px rgb(227,232,242)`; the paint was pure white at x=63. In light theme
both surfaces are `#ffffff`, so that border is the only thing dividing the rail from the canvas.
`flex:1 1 auto` lets the rail fill whatever the content box actually is.

## Settings › My Account › License — Product License, on the design system (7 Sep 2026)

**Every option** (in `setting.js`; built for Option 1 alone, and reaching the rest when they
adopted the shared module on 12 Sep 2026), registered as `ST_PAGES['My Account › License']`,
namespace `lic*` / `LIC_*` / `.lic*`, grepped free first). Built from **live build 10.0.1** at
`/settings/my-account/license` — the DOM and computed styles, the Vue components read out of
`__vue__` (`LicenseDetails` · `LicenseQuotaUsageTab` · `LicenseQuotaRow` · `LicenseHistoryModal`
· `ActivationCodeModal` · `LicenseEpsTab`) and their handlers out of the settings chunk
(`settings-4ea5ffd0.*.js`, fetched with `curl -k`) — and from the **ObserveOps License Guide**
(`docs.motadata.com/observeops-docs/getting-started/license-guide`, the 2 licence types and the
6 per-module metering rules), which is the detail text under each quota row.

⚠️ **THE DOC SITE IS `observeops-docs`, NOT `motadata-aiops-docs`.** Both exist; the AIOps one
has an older `license-guide` with different wording. `_product-docs/` was digested from the
AIOps site, so it carries no licence page — the guide was fetched fresh.

### What the live page is (so nobody re-derives it)

| part | live 10.0.1 |
|---|---|
| header | `‹` · file-certificate · **Product License** · `Export` (default, download icon) · `Upgrade Now` (primary, behind `LICENSE_CREATE_PERMISSION`) |
| tabs | **License & Quota Usage** (tacho-meter) · **EPS Trend Breakdown** (heart-rate) |
| edition card | eyebrow *ObserveOps Edition* · **Infinity ∞** in a gradient · *✓ Unified Edition* chip · a blurb · License Type / Issue Date / Account / Status · a Jul 2026 → Aug 2030 term bar · a **1440 DAYS LEFT** ring · *Expires August 17, 2030* |
| quota rows | six cards, each a 3px accent border + icon + title + token (`DEV · base platform`, `FSRC · add-on` …) + `Healthy` chip + `170 of 5,000 devices` + `History` + a 12px meter + `4,830 remaining` + `▲ +15 · 30d` + a Highcharts sparkline; Monitored Devices adds *Agentless / Agent-based* and a **BY TYPE** stacked bar; APM adds *Applications (monolith) / Agents (microservices)* |
| range | `7d · 15d · 30d` buttons; the hint reads *Click a row for historical consumption & CSV export* |
| History | a **720px MModal**: token · Range · `Current · Period start · Peak · Average · Change` · an area chart with a dashed **license cap** · `Close` · `Export as CSV` (columns `date,resource,value,cap,utilization_pct`, newest first) |
| Upgrade Now | `activateNow()` → the **Activation Code** modal: *Upgradation code* + the current code + copy · *Please email the above activation code to support@motadata.com* (a mailto with the code in the body) · a required 6-row *Paste your code here...* textarea · `Cancel` · `Activate License` → `PUT /settings/license/{id}` with `license.activation.code` |
| Export | `handleExport` renders the page root to an image named `license-<edition>` (html2canvas) |
| EPS tab | `HARDWARE CEILING 765 · ALLOCATED 950 (124% of ceiling) · INGESTED LIVE 0 · DROP STATUS clean` · two rule lines (notify / drop at 100% for 60 s) · *Dynamic EPS · allocation by signal* (Log 314 · Flow 152 · APM 266 · RUM 219) · *Calculated vs actual EPS · per telemetry* (a Total tile + four) |

### How it is built here — the flow is live's, EVERY part is the DS's

⚠️ **SECOND PASS THE SAME DAY** (request: *"the components are not ObserveOps — verify all
components are using the ObserveOps design system"*, with the expanded row's hand-made stacked
bar and legend as the example). The first build still composed the edition card (eyebrow, big
name, ring, term bar), the row detail (dot chips, a stacked bar, a legend), the chart legend and
the activation-code box from raw spans. All of that is gone; the audit below is the current state,
and the only thing still drawn is the two line charts.

| region | DS part |
|---|---|
| header | `obs-page-header` — `heading`, the licence status as an `obs-tag` in the `title` slot, actions in the default slot, `no-divider` because the tab bar rules. Nothing else: the record lives in the overview widgets |
| tabs | `obs-tabs` with `icon`s; the active key is read back through a **MutationObserver on the reflected `value` attribute** |
| overview | **three DS widgets** (`obs-toolbar variant="widget"` header + body, the EPS tab’s own tile). ⚠️ **REBUILT 12 Sep 2026** — read *"The License page, re-audited against the DS"* below for the current shape and for why. As built on 7 Sep: **Edition** (the name as page text, `obs-tag`s, the guide’s line, `obs-key-value` for License Type · Account) · **Validity** (`obs-metric-list` for days left, coloured by a severity token at ≤ 90 / ≤ 30 days, and a one-row `obs-table` whose `bar` cell is the term elapsed) · **Support & renewal** (obs-links + a neutral obs-button). The edition display line and that one-row table are both gone: they were the two component **mis-selections** a 100/100 conformance score cannot detect. |
| section heads | **`obs-toolbar`** (grid variant): the title in `start`, the hint and the control after it |
| quota usage | **`obs-table expandable`** — `link` · text · `bar` · `sparkline` · `status` · `button` cells |
| the expandable detail | **DS all the way down, inside the shadow root**: `obs-banner variant="info" title="Metered per"` for the guide's rule, `obs-key-value variant="plain" columns="2"` for the agentless/agent (or monolith/agent) split, and a **nested `obs-table`** whose `bar` cells carry the by-type share (7 rows for Monitored Devices). Nested custom elements written into the detail DO upgrade (measured) |
| range | `obs-radio as-button size="small"` — the DS's own *time range 1h/24h/7d/30d* example. ⚠️ `segmented` / `variant="segmented"` render a plain radio list; **`as-button`** is the attribute the element actually reads. ⚠️ **Option values must be STRINGS and the selection is set as a PROPERTY** (`el.value = '30'`): it compares strictly, numeric options never match, and the `value` attribute alone does not select — the switch showed no selected segment for a day (`licRadioSync`) |
| History | the DS’s own **`obs-drawer`** (⚠️ **since 12 Sep 2026**; it was the house drawer, `stcDrOpen`, and the swap needed two documented work-arounds — see the re-audit section below): the token as an `obs-tag`, `obs-radio` range, **`obs-metric-list`** for the five figures, a line chart against the cap (gap), `obs-button` Close / Export as CSV — a real file via `lxDownload`, the live's own columns |
| Upgrade Now | **`obs-modal`** "Activation Code" — a **read-only labelled `obs-input`** carrying the current code + an `obs-button` copy, an `obs-link` mailto, an `obs-input type="textarea" block` with its own label, Cancel · Activate License; the primary is disabled until a code is pasted and the hint says so; Activate replaces the licence (Annual Subscription, one year from today) and repaints |
| EPS tab | two **widget tiles** (`obs-toolbar variant="widget"` header + `obs-metric-list` / `obs-key-value` body) · `obs-toolbar` section heads · `obs-table` with `bar` cells · a legend of **`obs-tag`s** · five widget tiles, each `obs-toolbar` (title + window / avg / peak / util as tags) over an `obs-metric-list` row (the live figure) over a line chart dashed at the allocation (gap) |

- ⚠️ **THE ACCENT IS THE PROTOTYPE'S TEAL, NOT THE DS NAVY** (request, 8 Sep 2026: *"#172336 … and
  #cad3e2 — replace with rgb(20,184,166)"*). `--primary` is re-pointed **across the whole DS scope**
  (`#agPage,#licPage,#licHist,#licHistF`, request 8 Sep 2026: *"replace #172336 / #cad3e2 with
  #14b8a6 everywhere the active colour uses the primary colour"*) to `#14b8a6` dark / `#0e8578` light — the prototype's own
  `--teal` / `--teal-dim` pair — so the active tab, the selected range segment, every bar cell,
  the links, both primary buttons and the ∞ glyph take it — and the **Agentic AI page's** active tab,
  its *Configure AI provider* primary button and its selected side-menu row take it too. The DS
  navy is now used nowhere in this prototype; the rest of Option 1 already used this teal. ⚠️ This
  **overrides the earlier "Agentic AI brand primary is navy, NOT teal" note** — a direct, repeated
  request. The **AI mark stays `--chart-indigo` violet**: that is the AI accent, not an
  active/primary state, and the request named the primary colour only. `--radio-btn-box-selected-bg` is a literal in the scoped
  block and is re-bound to `--primary` so the range segments follow; so are `--primary-button-bg` /
  `-text` / `-hover-*` (obs-button reads its own pair, not `--primary`). **The table's bar fill is
  `--primary-alt`** (measured in the bundle) — #cad3e2 in dark on a #172336 track, which is exactly
  the pair the request quoted — so `--primary-alt` is re-bound to the accent **on `obs-table` only**;
  titles keep it as ink. ⚠️ **The light rule must repeat every pair**: the scoped block declares
  them under `html[data-theme="light"] #licPage` (1,1,1), which outranks a bare `#licPage` rule —
  light buttons stayed navy until it did. ⚠️ **Two literals, one per
  theme, are deliberate**: obs-button paints its primary label in `--page-background-color`, and
  white on `#14b8a6` is 2.5:1 where white on `#0e8578` clears 4:1. ⚠️ `var(--teal)` would be
  circular here — the re-point block binds `--teal` to `--primary` in this scope. ⚠️ Titles and
  body text (`--primary-alt`, `--page-text-color`) were NOT changed; the ask was read as the
  accent role, not the ink — say so if the title was meant too. This is the root CLAUDE.md's
  "the DS ships no interaction accent" gap, answered the way it prescribes.
- ⚠️ **THE ONE DECLARED GAP LEFT IS THE LINE CHART** (history, the five EPS tiles) — the DS ships
  no chart element and `list_gaps` says so; they carry `class="licchart"` for the conformance
  checker and every colour is a token. The ring, the term bar and the stacked bar each had a DS
  answer (a metric row, the record's dates, a table with bar cells), so a gap was not honest there.
- ⚠️ **`obs-key-value` caps a single-column list at 480px** (`.kv.cols-1{max-width:480px}` in its
  shadow CSS) — a long value wraps into a narrow column beside an empty band. That is why the
  metering rule is a banner, not a key-value row.
- ⚠️ **THE TOKEN SCOPE GREW.** The scoped DS block's selectors are now
  `#agPage,#licPage,#licHist,#licHistF{` (three places) — the page, the drawer body and the
  drawer footer, because the drawer is portalled to `<body>`. `_verify/dsconf.py`'s regexes
  were widened to `#agPage[^{]*\{` to keep matching; a bare `#agPage{` no longer exists.
- ⚠️ **`licVal(e)`, not `agDet(e)`.** `agDet` tests `detail.length`, which is also true of a
  string payload and would return its first character.
- ⚠️ **`licNice`, not `agNice`, for these charts** — the 1/2/2.5/5/10 steps took a 951 eps
  allocation to a 2,000 axis and a 5,000 cap to 10,000.
- ⚠️ **obs-input's textarea group is a hardcoded 280px**; only its own `block` attribute
  widens it. `rows` is not read. `label`, `value` and `readonly` ARE read (the code box).
- ⚠️ **`obs-key-value`'s `status` field IS the label** — `{value:"Activated", status:"active"}`
  renders the tag **"Active"** (the status map's word), not the value.
- ⚠️ **`obs-modal` leaves `open` true after its own ✕** — it emits `cancel` and `close`; sync
  `md.open = false` in the listener, and **close it before `stMainPaint()`** repaints the page.
- ⚠️ **The window switch sets the table's `rows` and `columns` ATTRIBUTES** (raw JSON, not
  `agJ`) — a repaint would rebuild the tabs and every open detail row under the pointer.
- ⚠️ **Below 1366px the grid drops Remaining and Change** (`LIC_MQ`, `licColsSync` on the
  media query's `change`). At 1280 with the settings list open the pane is ~950px, and ten
  columns wrapped every label to three lines and pushed History past the edge. Both dropped
  columns are derivable: Remaining is Allotted − Used, Change is the sparkline's own delta and
  reads "—" on five of six rows.
- ⚠️ **A function swap that anchors on the COMMENT above a function leaves the old body in
  place.** The second pass did exactly that for four functions and shipped, for one edit, two
  `function licHeadHTML()`s — the later (old) one wins silently, the duplicate-function trap the
  root CLAUDE.md opens with. Assert one definition per name after any scripted replace.

### Deliberate differences from live, recorded so none is mistaken for the product

- the live rows are bespoke **cards**; here they are `obs-table` rows and the breakdowns
  moved into the expandable detail — the DS has no "card row with a meter";
- the live edition **hero** (gradient "Infinity ∞", a ring, a term bar, four meta cells) is the
  page header's subtitle and meta strip — the DS's own entity detail header; the per-type colours
  of the live stacked bar went with it (the DS bar cell paints in the product's ink);
- History opens in a **drawer**, not a modal — the DS panel guide files drill-down detail
  under the drawer and keeps the modal for confirm/collect, which is exactly what the
  Activation Code dialog is (so that one stays a modal);
- the chart series colours are **chart-palette tokens**, not the live `--license-*` palette
  (Tokyo Night hues); the status tag reads *Active*;
- **Export prints** (the `stcExport` rule) where live snapshots the DOM to an image;
- **the EPS ingest is seeded** (Log 212 · Flow 98 · APM 140 · RUM 61 of the live allocations)
  because the instance is idle and every live counter reads 0; the licence and quota figures
  are the instance's own;
- no `‹` back button — the page sits beside the settings list here, as My Profile does.

### Verifying it

Headless shots via a stripped copy (`shot.sh` in the session scratch dir: Agentation loader
removed, `stOpen('My Account','License')` injected, `--virtual-time-budget`, `alarm 45`) in
both themes, both tabs, the drawer, the modal and the **completed activation** (which needs
virtual time — see the next note). JS probes drove the expand chevron, the 7d switch (headers
and change column follow), History (drawer, metric list, axis, footer), the drawer's own range,
the paste box → button enable → Activate → repaint, and the EPS tab (5 tiles, 4 rows, KPIs).
`lxbehave` **57/57 ×8** · `behave` **63/63** · `harness … query` **77/77** · the DS conformance
checker (a `dsconf.py` variant isolating `#licPage`, one declared gap: `chart`) scores
**100/100 on both tabs, the usage tab with a row expanded** — token, component, philosophy and
layout all 100 after the second pass (the first build read layout 97 with `gauge` also declared). ⚠️ The Agentic AI check reads **87/100 (component 58)** both
before and after this change — measured against the pre-change module files — so the 100 / 89
recorded on 1 Sep is stale, not a regression. The rendered `#licPage` carries **0 hex / rgb literals**; `validate_usage` flags only `--btn-radius` and
`--widget-border-radius`, which are the scoped block's runtime names for the DS structural
tokens (the recorded LESS-vs-runtime divergence).
⚠️ **THE EXTENSION'S TABS ARE HIDDEN** (`document.visibilityState === 'hidden'`) while the
user is not looking at that window: `setTimeout` is throttled to once a minute, and every
screenshot fails with *"Script injection timed out"*. The 900 ms activation timer "never
fired" and the page "froze" for an hour before this was measured. Sync JS probes still work
there; anything timer-, animation- or screenshot-shaped goes headless.

## The License page, re-audited against the DS (12 Sep 2026)

Request: *"we need to change 'Product License' components in setting module … using the ObserveOps
design system"*. **Measured first, and the page was already conformant** — the DS's own shipped
Playwright checker scored it **100/100 on both tabs** (token / component / philosophy / layout),
and `validate_render` found nothing. So the ask was put back as a question, and the answer was:
the three overview cards, the History drawer, and the look.

### ⚠️ THE CHECKER CANNOT SEE A MIS-SELECTED COMPONENT — it counts DS-ness, not fitness

Two real faults survived a perfect score, and both were found by reading the components'
**`decisionFlow` / `dont`** in the registry rather than by running anything:

- **`Issued · Expires · Term elapsed` was a one-row `obs-table` with a `bar` cell.** Those are ONE
  record's fields. `obs-key-value`'s decisionFlow: *"Label→value pairs describing ONE record? ->
  Key-Value"*; `obs-table` is for *"rows of MANY records"*. The nested table also drew a header
  (ISSUED | EXPIRES | TERM ELAPSED) over a single row, which out-weighed the **neighbouring**
  card's key-value labels — so two adjacent cards spoke two languages for one job.
- **The edition name was a raw `<div class="licedn">` at 24px** — the loudest thing on the page for
  the least actionable fact on it. An edition NAME is a record field, not a KPI:
  `obs-metric-list`'s own `dont` reads *"don't use for a record's key/value detail"*. It is the
  first `obs-key-value` row now, and the header keeps its edition tag.

The row now reads one way: **one KPI** (days left, severity-coloured) and **label→value facts**
everywhere else. Score after the rebuild: still **100/100** — which is the point.

⚠️ **THE TERM BAR IS THE ONE THING LOST, and it was weighed rather than dropped.** `Term elapsed`
keeps the signal as a `--severity`-coloured value (warning ≥75%, critical ≥90%); the DS ships **no
standalone meter or progress element** (searched — `bar` exists only as an `obs-table` cell type),
and the days-left KPI directly above already carries the urgency.

⚠️ **THE SUPPORT LINKS STAYED `obs-link` AND WERE NOT FOLDED INTO THE KEY-VALUE.** Doing so would
have made the third card echo the other two, but `obs-key-value` renders text — the working
`mailto:` would have stopped being clickable. A real loss for a cosmetic symmetry. The
inconsistency worth fixing was *two components doing the SAME job*, not two jobs looking different.

### The History drawer is `obs-drawer` now

`drawer` is the DS's most-used overlay (158×) and its decisionFlow names exactly this content:
*"Long content, a detail view, or a form contextual to a record? -> FlotoDrawer"*. The swap also
buys the native `<dialog>` behaviours the house `.sdrawer` hand-rolls — top-layer render, focus
trap, Esc.

⚠️ **THE REGISTRY AND THE VENDORED BUNDLE DISAGREE, AND THE BUNDLE WINS.** `get_component(drawer)`
now describes obs-drawer as FUNCTIONAL (*"✕ / Esc / [data-close] emit close then after-close"*);
`_ds/` v0.1.166 **does not**. Re-measured in a headless probe rather than taken on trust:

| | vendored 0.1.166 |
|---|---|
| `el.show()` / `el.hide()` | work |
| the `open` **attribute** | opens it |
| `title` / default / `actions` slots | all render |
| **`close` / `after-close` events** | **never fire** |
| **`el.open` / the host's `open` attribute** | **stay false throughout** |

So the one signal every close path shares is the **inner `<dialog>`'s own `open` attribute** going
false — which is what `licHistWatch` observes, with an `isConnected` guard so a teardown is not
mistaken for a user close. Re-check if `_ds/` is upgraded; the workaround can go then.
⚠️ The element is created **once** and lives on `<body>` — `#view-settings` is `display:none`
whenever Settings is not the active view, and a fixed child of a hidden ancestor is hidden too,
top layer or not. Only **inner** content is ever repainted, never a slotted node (the recorded
`slotchange` trap).
⚠️ The footer gap is on **our** slotted span, not the component's — registry F3: *"the .actions
footer is justify-end with NO gap, so adjacent buttons touch"*.

### ⚠️ AN OVERLAY IN THE TOP LAYER FALLS OUT OF A SCOPED TOKEN BLOCK — the dark-theme trap

The swap shipped a **white drawer over a dark page**, with the metric values in dark-theme light
grey on it: two themes in one overlay. The scoped DS token block is
`#agPage,#licPage,#licHist,#licHistF{…}` — the slotted body `#licHist` was in that list, but the
**drawer host was not**, so the panel's own chrome read the DS's defaults, which are LIGHT.

⚠️ **EVERY PROBE PASSED AND THE CHECKER STILL SAID 100/100**, because both halves were legal DS
tokens — just not the same set. **Only the dark screenshot found it.** The host `#licHistDr` is in
all three rule openers now. Any future element that renders through `<dialog>`, a portal or the
top layer needs adding to that list.

### Product License · Option 2 — the hero card (12 Sep 2026)

Request, with a supplied design: *"create 'Product License' new option — the current is option 1
and new option is option 2 … this card only, using the ObserveOps design system"*. **Option 1 is
untouched and is still the default.** `LIC.opt` picks between them and an `obs-radio as-button`
sits in the page header beside Export.

⚠️ **THE SWITCHER IS REVIEW CHROME**, like `Setting/`'s Scale switcher — it exists so the two
designs can be compared in one build and goes when one is picked. ⚠️ **It repaints the page**,
unlike the 7d/15d/30d control beside it which sets the grid's attributes in place: the two options
render different markup above the table, and there is no open detail row to lose at the moment you
change design.

Option 2 replaces Option 1's three widgets with **one full-width card** and leaves the tabs, the
quota table and the EPS tab exactly as they were. ⚠️ **THE CARD BELOW IS THE 12 Sep BUILD — the
edition left, the record over a term bar, a days-left ring right. It was replaced on 13 Sep by the
compact strip**; read *"Option 2, second design"* for what ships. Everything below still explains
why each part was chosen, and the ring is kept and unreferenced.

**What is a DS component, and what is not:**

| part | built from |
|---|---|
| the record (License Type · Issue Date · Account · Status) | **`obs-key-value columns="2"`** — the catalogued `two-column` variant, *"a record has MANY fields"*. The **Status** pair passes the item's 4th field, so the value renders as an `obs-tag`: the registry's own `status` variant, which is exactly the green pill in the design |
| the edition chip | `obs-tag` |
| **the ring and the term bar** | ⚠️ **BOTH ARE DECLARED `list_gaps` GAPS** — see below |

⚠️ **`obs-key-value`'s `status` FIELD REPLACES THE WORD, IT DOES NOT JUST COLOUR IT.** The design
says *Activated*; passing `status:'running'` printed **"Running"** over a value that said
"Activated", because the component renders the STATUS KEY's own label. The bundle's map has **48
keys and no `activated`** (read out of `_ds/`), so the key is **`active`** — the DS's word for this
state, and the thing that makes the tag green. An unknown key would have kept the design's word and
lost the colour. Recorded as a declared divergence: the pill reads **Active**, not *Activated*.

⚠️ **THE RING AND THE BAR ARE A STOP-AND-ASK THIS REPO HAS ALREADY ANSWERED.** `data-viz` routes
*"a single value against a total"* to a gauge and the DS ships **no gauge, no meter and no progress
element** — `search_components` returns only `widget-card` / `widget-grid` / `data-viz`, and `bar`
exists solely as an `obs-table` CELL type. They are drawn the way the trend charts already are:
hand-built, every colour a token, carrying a chart class so the checker resolves the archetype.
**`_verify/ds-gaps.json` now declares `gauge` alongside `chart`.**

⚠️ **THE RING IS A REAL ARC, NOT A PICTURE** — `stroke-dasharray` over the circumference, so the
sweep IS the elapsed fraction and cannot disagree with the figure printed inside it. There are
probe assertions that the arc length matches the percentage and that arc + gap = the circumference.

⚠️ **THE ACCENT IS `--chart-indigo`, NOT THE DESIGN'S HEX.** The supplied card is violet while this
page's `--primary` is the prototype's teal. `--chart-indigo` is a real DS chart-palette token
(#8b5cf6 dark / #7c3aed light) that lands on that violet, and the DS's own rule for a figure like
this is *"series colours are chart-palette tokens, never --primary"* — so the design's colour
arrives through a token rather than as another product's brand hue in the file.

⚠️ **THE TRACK IS THE SERIES COLOUR AT 18%, NOT `--neutral-lighter`.** That token is `#1d2a3e` in
dark — the same value as `--border-color` — and the card sits on `--common-widget-bg` (`#172336`),
so the first render had **an invisible ring track and the arc reading as a floating blob.** Only
the screenshot showed it. Tinting the series colour is what the trend charts already do for their
area fill.

⚠️ **TWO OFF-SCALE VALUES COST `layout 85`** on the first conformance run — `padding:22px 26px` and
the `border-radius:999px` pill. Both are on the DS scale now (`24px`, `--btn-radius`); a 6px bar at
4px radius is still visually a pill. **100/100 on all three scenes after.**

**Verified:** DS conformance **100/100 × 3 scenes** (Option 1 × 2 tabs, Option 2) · a 31-assertion
probe (the default, the switcher, the hero's components, the two-column key-value, the nested
status tag, the arc maths, the bar sized by `width` not `flex`, no colour literal, and switching
both ways) · `stbehave` **ALL 21 PASS × 13 pages** · both themes screenshotted.
⚠️ **A probe assertion failed on working code first:** `kv.shadowRoot.textContent` never contains
a NESTED `obs-tag`'s text (it lives in that element's own shadow root) and does contain the shadow
`<style>`. Pierce the nested root; the screenshot had already shown the pill rendering.

#### Option 2, second design — the licence strip (13 Sep 2026)

> ⚠️ **SUPERSEDED 14 Sep 2026** — Option 2 is now a licence card plus a Monitored devices card,
> and its tab is **"License & Quota Usage"** again. See *"Option 2, third design"* below. The
> strip's function and CSS were deleted (they are in commit `56659dc`).

Supplied as a card, with the previous day's build beside it, and *"make it"*. Option 2's
three-column hero became **one compact block, three stacked rows**: identity (mark · name · meta ·
status), the term in words, and the term as a bar. **~150px → ~90px.** Option 1 is still untouched
and still the default.

⚠️ **THE FACTS DID NOT CHANGE, THEIR WEIGHT DID.** What went: the 34px display name, the 2×2
`obs-key-value`, the 128px ring gauge and the EXPIRES block. What arrived: `ObserveOps Infinity`
as a 15px title, the three grid facts as one meta line (`Unified Edition · Free license ·
Motadata`), and `Issued …` / `1,435 days left · expires …` on one row above the bar.

⚠️ **THERE IS NO `obs-key-value` HERE, AND THAT IS CORRECT.** There are no label→value pairs left
— the meta line is a sentence, which is typography, not a component. Reaching for the component
anyway, to keep a DS count up, would change the design that was asked for. What IS still DS: the
status pill is an `obs-tag` (green, `tag-green`) and the mark an `obs-icon`.

⚠️ **`licRingHTML` AND ITS THREE `.licring*` RULES ARE KEPT AND UNREFERENCED** — the house pattern
— so the first design is one call away. The rest of that layout's CSS was deleted with it; the
ring's own rules were deliberately put BACK after the sweep, because "one call away" is false if
the function survives and its styling does not. `ds-gaps.json` still declares the `gauge` it
renders.

⚠️ **THE TERM LINE AND ITS BAR ARE ONE GROUP (8px), AGAINST THE CARD'S 16px.** They are the same
fact in two forms, so the gap INSIDE the pair has to beat the gap to the identity row above it, or
the bar reads as a third, unrelated row. The recorded `.aiab li` rule, in a new place — and there
is a probe assertion comparing the two computed gaps rather than trusting the eye.

⚠️ **`padding:20px` COST `layout 97`.** The DS structural scale is 8 / 12 / 16 / 24; 20 is not on
it. `16px 24px` is, and it is closer to the supplied card than a uniform 24 would be. **100/100 on
all three scenes after.**

**Verified:** DS conformance **100/100 × 3 scenes** · a 30-assertion probe (the switcher, the
identity row, the meta line's three facts, the green `obs-tag`, the grouped term pair and its
measured gaps, the bar sized by `width` not `flex`, the ring NOT rendered, no colour literal,
switching both ways) · Option 1's 31-assertion probe still green · `stbehave` **ALL 21 PASS × 13**
· both themes screenshotted.

#### Option 2 drops the quota section (14 Sep 2026)

Request: *"remove this"*, pointing at **License & Quota Usage** — its section head and its grid.
Option 2 is now the licence strip and nothing else; **Option 1 keeps both**.

⚠️ **THE GRID WAS THE ONLY DOOR TO THE HISTORY DRAWER.** `licHistOpen` is reached from the
table's `cellaction` (the row's History button and its name link), so in Option 2 the drawer, its
trend chart and its CSV export are **unreachable**. The code is untouched and Option 1 still opens
it. Recorded rather than left to be discovered — if Option 2 wins, that drawer needs a new door or
it goes.

⚠️ **NOTHING NEEDED UNBINDING.** `licAfter` already guarded `#licRange` and `#licTable`, and
`licColsSync` / `licSetRange` carry their own `if (!tb) return`. The removal cost one early return.

⚠️ **THE FIRST TAB’S LABEL FOLLOWS THE OPTION NOW** — `licTabs()` returns
**"License"** for Option 2 and **"License & Quota Usage"** for Option 1. Leaving the old label
would have named something no longer on the tab; fixing copy the change falsifies is part of the
change, and it is scoped so Option 1 reads exactly as it did.

⚠️ **A PROBE ASSERTION FAILED ON WORKING CODE HERE, and the cause generalises: `obs-tabs`
renders BOTH slots into the DOM** (it toggles visibility, it does not unmount). The EPS tab has
`.lictb` toolbars of its own, so `#licPage .lictb` still matched after the usage tab’s was gone.
Scope any "is it gone?" check on this page to `[slot="usage"]`.

**Verified:** DS conformance **100/100 × 3 scenes** · a 37-assertion probe (the section, its head
and its window switch all absent in Option 2; the tabs still there; the label swapped; the EPS tab
untouched; and **Option 1 still carrying all three**) · Option 1’s 31-assertion probe still green
· `stbehave` **ALL 21 PASS × 13** · both themes screenshotted.

#### Option 3 — the two-card "License overview" (14 Sep 2026)

Supplied as a written spec plus a card. ⚠️ **ASKED FOR AS A REPLACEMENT FOR OPTION 1, THEN
CORRECTED MID-BUILD to "create 3 option and no need to change the option1"** — so it is a THIRD
design behind the same switcher and **Options 1 and 2 are untouched**. There are probe assertions
that Option 1 still defaults and still renders its three widgets.

Two cards, side by side ≥768px and stacked below (edition first), sharing one skeleton: a muted
label row, main content, and a two-column key/value grid **pinned to the bottom** so the two grids
line up whatever the middles do.

| part | built from |
|---|---|
| both label-row marks | `obs-icon` (`file-certificate`, `calendar`) |
| the edition pill | `obs-tag variant="tag-purple"` |
| the status pill | `obs-tag` — `tag-green` / `tag-orange` / `tag-red` / `tag-unknown` |
| the ring | the declared `gauge` gap — a real `stroke-dasharray` arc |
| the bottom grid | hand-built — see below |

⚠️ **`obs-key-value` IS THE WRONG COMPONENT FOR THAT GRID, and this is the second time the
question has come up on this page.** It renders label BESIDE value (measured on Option 1:
"License Type  Free"); the spec and the card both put the label ABOVE its value, two pairs across.
The DS ships nothing for that shape, so it is four spans on the spacing scale — layout, not an
invented component. There is a probe assertion that the label's box sits above the value's.

⚠️ **EVERY FIGURE IS COMPUTED FROM THE TWO DATES**, as the spec demands — `daysLeft`,
`totalDays`, `percentUsed` and the human duration all derive from `issueDate` / `expiryDate`.
`licDur` does calendar arithmetic (not day-division) and `licDurText` prints the **two largest
NON-ZERO** units, so "3 years, 0 months" reads as "3 years".

⚠️ **ONE PLACE OWNS THE THRESHOLDS.** `licOvState` returns the pill label, the tag variant AND
the ring tone together, so the ring's colour can never disagree with the word beside it:
≥ 90 days → Activated (accent) · ≤ 90 → Expiring soon (warning) · ≤ 0 → Expired (danger, ring
pinned at 100%) · not active → Inactive (neutral).

⚠️ **THE ACTION SLOT TAKES THE SLACK EVEN WHEN EMPTY.** `.licovact` is `flex:1 1 auto` — that is
what pushes the status pill to the card's right edge. A `margin-left:auto` on the pill would work
until the slot were filled, and then TWO auto margins would split the space (the recorded
`.mfkc`/`.mfpin`/`.mfdocs` fault). Nothing renders unless `LIC.ovAction` is set.

⚠️ **SENTENCE CASE IS APPLIED AT THE RENDER SITE, NOT IN THE DATA.** The spec writes every label
in sentence case; `LIC_DATA.edition.chip` is "Unified Edition" and is shared with Options 1 and 2,
which show it as-is. `licSentence` cases it for this option only.
⚠️ **`licPlural` NOW FORMATS THROUGH `licFmt`** — it printed "1433 days" where the spec asks for
thousands separators. Both of card 2's lines run through it.

⚠️ **NO MARKETING COPY, BY INSTRUCTION** — Option 1's edition blurb is deliberately absent, and
a probe asserts it.

**The spec's demo:** `licOvDemo('expiring')` / `('expired')` / `()` to clear. It moves the expiry
date and nothing else, so every derived figure follows from it rather than being faked. (This repo
has no Storybook; this is the `acStates` precedent — a reachable function, not new product chrome.)

⚠️ **AN obs-icon GIVEN A NAME THE BUNDLE LACKS FAILS SILENTLY** — it emits an empty comment and
renders nothing. `file-certificate`, `calendar` and `check` were each confirmed to render;
`certificate` and `license` do NOT exist. **Grep on the minified bundle does not answer this**
(all five "looked" absent); render one and read past its `<style>`.

**Verified:** a 45-assertion probe against the spec — equal card heights, the two bottom grids
aligned to the pixel, label-above-value, the ring at 52px/5px with its arc matching the % printed
inside it and an accessible label, the thousands separator, no marketing copy, no all-caps, no
colour literal, and all three states end to end · DS conformance **100/100 × 4 scenes** · Option 1
and Option 2's own probes still green · `stbehave` **ALL 21 PASS × 13** · four states screenshotted.

#### The quota grid's expanded row, simplified (14 Sep 2026)

Request: the expanded row *"is not user friendly and not ObserveOps design-system components —
make it user friendly and simple."* **Option 1's grid only** (Option 3 shares `licDetailHTML`, so
it follows; Option 2 has no grid). The detail is now **the metering rule · one line for the
deployment split · a borderless breakdown table**.

| part | before | now |
|---|---|---|
| metering rule | `obs-banner variant="info"` | unchanged — it IS the DS hint and it explains the count |
| agentless / agent split | `obs-key-value columns="2"` | **one line of text** |
| device-type breakdown | fully-bordered `obs-table` | `obs-table variant="borderless"` |

⚠️ **`variant="borderless"` IS A REAL obs-table LEVER, read out of the bundle** — not documented
in the registry. The element builds its class list as `grid hs-<headerStyle> v-<variant>`
(+ `hide-hdr`), and the shadow stylesheet carries `.v-bordered` / `.v-borderless` /
`.v-borderless-rows` / `.v-plain` / `.v-card` and `.hs-tinted` / `.hs-default`. A fully-bordered
grid nested inside a row of ANOTHER grid drew a second table's worth of chrome for seven rows,
which is most of what made the panel read as heavy.

⚠️ **THE SPLIT IS PLAIN TEXT, AND BOTH DS CANDIDATES WERE TRIED FIRST.** `obs-key-value` at
`columns="2"` put each label at the far left of a wide column and its number mid-column —
"Agentless (SNMP / API / WMI) ……… 170" read as a broken row. `obs-metric-list` is the right
component *on paper* (these are counts; key-value's own `dont` says "don't use for KPI metrics")
and was **measurably worse here** — it renders the value at KPI size and constrains its label, so
"170" went huge and the label wrapped to two lines. **Two numbers do not need a component**; using
one to keep a DS count up is the same mistake as `obs-table` for a single record's fields.

⚠️ **IT IS NOT SHORTER, AND THE FIRST CLAIM THAT IT WAS WAS WRONG.** Measured against the
committed version rendered from `git show HEAD:setting.js`: **461px before, 457px after**. The
change is visual WEIGHT, not height — seven 40px rows of the DS table dominate either way. A
first pass that raised the spacing to 16px/4px/8px actually made it **10px taller** (471px); that
was reverted. A probe assertion of "< 380px" was invented, failed on correct code, and was replaced
with the measured "no taller than 461px". **Measure the before; do not trust a screenshot's
impression of size.**

⚠️ **THE LABEL KEEPS ITS CASING.** Lowercasing it read nicely as a sentence until it rendered
"agentless (snmp / api / wmi)". The data's own casing wins.

⚠️ **THE DEPLOYMENT LINE IS STYLED INLINE** — it lands in obs-table's SHADOW ROOT, which the
page stylesheet cannot reach. Custom properties do inherit across the boundary, so every value is
still a token; a `.licdepl` class written into the sheet would have styled nothing.

⚠️ **The column widths went 44/16/40 → 56/16/28 → back to 44/16/40.** Widening the name column
to shorten the bar just moved the empty space — "Cloud" sat a third of the panel from its count.
The bar looks sparse because five of seven shares are ≤ 4%: that is the data, not the layout.

**Not done, and offered instead:** two levers that WOULD make it shorter, both of which change what
the panel says — `hideHeader` on the nested table (~28px, but "Share of fleet" is not
self-evident from a bar alone), or showing the top few types with the rest folded into "Other".

**Verified:** a 20-assertion probe driven through obs-table's OWN expand control — banner kept, the
nested table borderless and rendering its seven rows, no `obs-key-value` or `obs-metric-list` left,
the split on one line with its acronyms intact, every inline style a token, and no taller than
before · DS conformance **100/100 × 4 scenes** · Options 1/2/3 probes still green · `stbehave` **ALL
21 PASS × 13** · dark and light screenshotted.

#### Option 2, third design — the licence card + Monitored devices (14 Sep 2026)

Two supplied cards, two requests the same day. Option 2's tab is now **two cards and nothing
else** — still no quota grid.

| card | what it has | built from |
|---|---|---|
| licence (`licHeroHTML`, `.licx*`) | a top row — **ObserveOps edition** with the **Activated** pill right after it, **Infinity ∞** + *Unified edition* tag, and in the **top-right** the 52px ring + "3 years, 11 months left" / "1,433 days · 4% of term used" · four label-over-value tiles (License type · Account · Issue date · Expires) · rule · **Activation code** with an *Email support@…* mailto, a help line, the code and **Copy** | `obs-tag` ×2, `obs-icon`, `obs-divider` ×2, read-only `obs-input`, `obs-button`, `obs-link`; the ring is the declared `gauge` gap |
| Monitored devices (`licDevCardHTML`, `.licq*`) | title + **Healthy** pill · **170** of 5,000 devices · 4,830 available · bar · Agentless / Agent-based · **+15 in 30 days** · *By type* four across · **View history →** | `obs-tag`, `obs-icon`, `obs-divider` ×2, `obs-button variant="transparent"`; the bar is the declared `chart` gap |

- ⚠️ **THE TERM MOVED INTO THE TOP ROW AND THE PILL MOVED TO THE LABEL** (a follow-up request the
  same day). The ring and its lines had been a row of their own between two rules; they now sit
  top-right beside the identity block (`.licxtop`), so the card has **one rule, not two**. The pill
  follows the label (`.licxh` is `flex-start` — it no longer shares `space-between` with the
  devices card's header, whose pill stays at the edge). `.licxtop` wraps, so a narrow card drops the
  term under the identity rather than ellipsising the title.
- ⚠️ **ONE TERM MODEL FOR OPTIONS 2, 3, 4 AND 5.** `licTermModel()` was lifted out of `licOvHTML`
  — thresholds, ring tone, pill, both lines — so no two designs can disagree about one licence.
  Option 3's 45-assertion probe was re-run unchanged after the refactor.
- ⚠️ **ONE MAILTO BUILDER** (`licMailHref`) for the Activation Code modal and the Option 2/4/5
  cards, with the code in the body.
- ⚠️ **`--divider-my:0` ON EVERY `obs-divider` HERE.** The element carries a 1rem margin inside its
  shadow root; with the card's 16px gap that put 48px round each rule. The variable is the
  element's own lever (read out of the bundle) — a margin on the host cannot reach it.
- ⚠️ **THE TILE FILL IS A 5% WASH OF `--page-text-color`**, not a surface token: `--neutral-lightest`
  equals the card in dark and `--page-background-color` equals it in light.
- ⚠️ **THE DEVICE FIGURES ARE `LIC_DATA`'s, NOT THE PICTURE'S** — 170 / 0 agent-based / +15, where
  the card read 171 / 1 / "+9 this month". `delta` is a 30-day window, so the line says *in 30
  days*, not *this month*.
- ⚠️ **THE GROWTH FIGURE IS NOT GREEN.** `resolve_token` has no positive-text token and a severity
  colour would call growth "clear". Say so if the green is wanted — `obs-tag variant="tag-green"`
  is the DS way to get it.
- ⚠️ **View history is an `obs-button`, not a link** (it opens a drawer; the button registry's
  decision flow) and **it makes the History drawer reachable in Option 2 again** — for Monitored
  devices only. The other five entitlements are still not on Option 2.
- ⚠️ **The "⋯" drawn OUTSIDE the supplied card's corner was not built** — no menu was specified.
- **The first tab reads "License & Quota Usage" in every option again** (`licTabs` is a constant).
- **A third card, Flow Sources, sits under Monitored devices** (a later request the same day, from
  a supplied quota-row card). It is Option 5's card shape — see *"Option 5's Monitored devices
  card"* — built by the same `licQuotaCardHTML(q, cls)`, on Option 2's bordered surface
  (`.licq5.licq5o2`). ⚠️ **Its figures are `LIC_DATA`'s**: the instance meters **0 of 100
  exporters** with no change, where the picture read 5 · 95 remaining, so the meter is empty and the
  sparkline flat (a flat series is drawn along the TOP so its fill still shows). ⚠️ Its History uses
  `LIC_HIST_GO.flow` — one stable function per entitlement, so agTap's double-fire guard holds.
- ⚠️ **ALL THREE OPTION 2 CARDS ARE `--widget-background`, AND FLOW SOURCES HAS NO LEFT ACCENT**
  (request: *"remove this color … all card background … #0B1627"*). #0B1627 is that DS token's
  exact dark value (#fff in light), so the request landed on a token, not a pasted hex, and light
  keeps white cards. They were `--common-widget-bg` (#172336). The supplied card's green edge is
  `box-shadow:none` on Option 2 only — Option 5's devices card keeps its accent.

#### Option 4 — the one-card licence (14 Sep 2026, from `license-card.html`)

A supplied page: three sections in a row — edition (eyebrow, gradient **Infinity ∞**, tag, the
edition blurb) · the record (License type · Issue date · Account · Status) over a Jul 2026 → Aug 2030
term bar · a **120px days-left ring** with *Expires August 17, 2030* — then an activation row
(heading · a `Upgradation code | code | copy` box · *Email the activation code above to …*). The
quota section **stays below it**, as under Options 1 and 3. `lic4HTML()`, `.lic4*`.

- ⚠️ **THE LAYOUT IS THE FILE'S, THE PAINT IS THE DS'S.** Its hex palette → tokens; its solid chip
  and green status pill → `obs-tag`; copy → `obs-button`; mailto → `obs-link`; 32/40px spacing and
  16/10/999px radii → 24px and `--btn-radius`; the title gradient runs `--chart-neon-purple` →
  `--chart-indigo`.
- ⚠️ **THE FILE FORCED `min-width:1180px` AND SCROLLED SIDEWAYS.** The card is a **size container**
  instead: under 1080px of its own width the record drops below edition + ring and the activation
  row stacks. The pane is ~920px at 1280.
- ⚠️ **`licRingHTML` IS LIVE AGAIN** — parked since 13 Sep, it is Option 4's and 5's ring. It gained
  a `tone` argument so an expiring licence's ring turns warning with its pill. The ring shows days
  LEFT, the bar term USED, as the file did.
- ⚠️ **NO RULES BETWEEN THE THREE SECTIONS** (a follow-up request: *"remove all [these] lines"*).
  The file drew a border-left on sections two and three; the 24px padding either side is kept.
  Removing them also fixed a real bug — in the stacked layout `.lic4s + .lic4s` (0,2,0) outranked
  the container query's `.lic4rec{border-left:0}` (0,1,0), leaving a stray rule down the record.
  The two HORIZONTAL rules (above the term bar, above the activation row) stay.
- ⚠️ **`.lic4v` IS A BLOCK, NOT A FLEX BOX** — text-overflow cannot act on an anonymous flex item.

#### Option 5's Monitored devices card (14 Sep 2026)

From a supplied card — the live product's quota row — with Mobbin's usage cards (Hume, Gemini,
StackAI, ClickUp) as the pattern check: they agree on the used figure top-right, a full-width meter
under the header and a caption under the meter. Option 5's tab is now **the licence card + this
card**, still no quota grid. `lic5DevHTML()` → the shared **`licQuotaCardHTML(q, cls)`**, `.licq5*`.

| row | what |
|---|---|
| header | a 32px icon tile · **Monitored Devices** over `DEV · base platform` · **Healthy** `obs-tag` · **170** of 5,000 devices · **History** (`obs-button transparent`, `trending-up`) |
| meter | a 10px `.licbar`, the entitlement's `q.tok` |
| caption | *4,830 remaining of 5,000* · **▲ +15 · 30d** beside a 120×28 area sparkline (`lic5Spark`) |
| split | legend swatches — Agentless (SNMP / API / WMI) **170** · Agent-based **0** |
| BY TYPE | a stacked bar + legend with count and share (Cloud 86 62% …), colours from `LIC5_PAL` |

- ⚠️ **SAME SURFACE AS OPTION 5's LICENCE CARD** (the 3% wash, no outer border) so the two read as
  a set; the supplied **left accent** is kept as an inset shadow, not a border, so content does not
  shift 3px right of the card above.
- ⚠️ **SERIES COLOURS ARE CHART-PALETTE TOKENS** (`LIC5_PAL`: aqua · lime-green · neon-purple ·
  amber · hot-pink · rose-red · indigo), not the live `--license-*` hues.
- ⚠️ **ITS DIVIDERS SET `--border-color` ON THE HOST** to a 12% text wash — the token itself is
  #1d2a3e in dark, within a step of this washed surface, and both rules vanished on the first
  dark screenshot. The property inherits into obs-divider's shadow root.
- ⚠️ **A ZERO-SHARE TYPE KEEPS ITS LEGEND ENTRY BUT DRAWS NO SEGMENT**; every fill is `width:%`
  with `flex:0 0 auto` (the recorded `flex:50` / `min-width` faults).
- ⚠️ **THE SPARKLINE'S GRADIENT ID CARRIES THE ENTITLEMENT KEY** (`licq5sg-device`) — Option 2
  draws the same card for Flow Sources, and a shared id would paint one card with the other's fill.
- ⚠️ **The change line is not green** (no DS positive-text token), and figures are `LIC_DATA`'s
  (170 · 0 · +15 · 138 typed devices), not the picture's 171 · 1 · +9.

#### Option 5 — the one-card licence, borderless (14 Sep 2026)

A second supplied page: Option 4's card with its edges taken out. **Same markup** — `lic4HTML('5')`
adds `.lic5` — so content cannot drift; only CSS differs: no card border and no rule above the term
bar, the activation row becomes a **filled rounded band**, the code box loses its outline and cell
rules, the ring is **100px**.

- ⚠️ **OPTION 5 HAS NO QUOTA GRID** (request: *"create only this"*). Since a later request it is
  this card plus the Monitored devices card below. Adding the grid back is one entry in
  `LIC_OVERVIEW`.
- ⚠️ **THE CARD FILL IS A 3% TEXT WASH OVER `--common-widget-bg`.** With no border a light-theme card
  is #fff on the #fff pane and has no edge; the wash gives it one. The band is a further 4% wash,
  the label cell 8% — one declaration per step, both themes (the file's `#121826`/`#1a2232` are
  dark-only).
- ⚠️ **THE TOP ROW IS CENTRED, NOT TOP-ALIGNED** (a follow-up alignment request). The file set
  `align-items:start` with only the ring centred, so beside the tall edition column the record
  hugged the top while the ring sat on the row's middle — ~25px out of line with each other. Now
  all three sections share one centre line (probe: within 1px), and the file's 2px `padding-top`
  on the record, which only existed for top alignment, is gone. Option 4 was already centred.
- ⚠️ **THE RING'S FIGURE WAS NOT ENLARGED.** Matching the file's 28px-in-120 proportion pushed
  "1,433" (with its separator) into the stroke; the SVG scales as one unit, so the default fits.

**Verified (all four, 14 Sep):** a **167-assertion** probe (latterly including Option 5's devices card,
Option 2's Flow Sources card with a real inner History click, and the `--widget-background` recolour) (both Option 2 cards' structure, components,
positions, the tile fill, the divider margin, the ring and term lines, the mailto body, Copy through
the button's inner `<button>`, View history opening the drawer for Monitored Devices, Option 4's
three sections / gradient / record / bar / 120px ring / code box / no vertical rules / no overflow,
Option 5's borderless rules scoped away from Option 4, and Options 1 and 3 unchanged) · Option 1
**31**, Option 3 **45**, row detail **20** still green · DS conformance **100/100 × 6 scenes** ·
`stbehave` **ALL 21 PASS × 13 pages** ·
dark, light and 1280px screenshotted.
⚠️ **Two probe failures were the probe's own**: a tile's label and value have no whitespace
between them in `textContent` (`License typeFree`), and a "four options" assertion went stale the
moment Option 5 arrived.

#### The later 14 Sep 2026 License requests — backgrounds, the quota section, and History icons

Six narrow requests after the cards above, in order. ⚠️ **Where they conflict with the sections
above, this is current.**

| request | what changed |
|---|---|
| Option 2: *"add new card"* ×4 (supplied Log / NCCM / APM / RUM cards) | `licAddonCardsHTML()` — every entitlement except Monitored devices gets `licQuotaCardHTML`, in data order, no left accent. APM's split legend states its allotment (*of 52 units*). Figures are `LIC_DATA`'s, not the pictures' |
| all options: *"all card background … #0B1627"* | `#licPage{--common-widget-bg:var(--widget-background)}` — ONE token re-point covers Option 1's widgets **and their obs-toolbar headers** (the bundle's `.tb.v-widget` reads that token), the EPS tiles, Options 3/4's cards; Option 5 uses `--lic5-surface` (#0B1627 dark, a 3% wash over white in light so the borderless card keeps an edge). Scoped to `#licPage` — Agentic AI and the History drawer keep their own |
| Options 3 & 4: *"remove this"* (the section head + grid) | both render only their overview card(s). ⚠️ **Consequence: neither reaches the History drawer or the metering-rule detail any more** — only Option 1 carries the grid |
| Option 2: *"add this below the ObserveOps edition card"* (the section head) | `licQuotaHeadHTML(hint)` — ONE markup for Options 1 and 2, keeping `#licRange`, so `licAfter`'s single binding drives the grid in Option 1 and **repaints `#licQCards`** in Option 2 (`licSetRange`). ⚠️ The Option 2 hint drops *"Expand a row for its metering rule"* — there are no rows there |
| Option 5: *"remove the line of color … make this card simple and user-friendly"* | `lic5DevHTML` got its own builder (`.licd5`): no accent, no sparkline, no swatches on the Agentless / Agent-based line (they keyed a chart that is not there), one rule, one action (*View history* at the foot); figure + *remaining · change* over the meter, then the split and BY TYPE |
| Option 2: *"remove [the change + sparkline]" and "history is a clickable icon in top right in every card"* | `licHistIcon(key)` — an icon-only `obs-button` (`trending-up`) with `aria-label` + `data-tip` in the top-right of **all six** quota cards; the devices card's *View history* footer went with it. The add-on cards' `— 0 · 30d` and sparkline are gone (`lic5Spark` / `.licq5c` / `.licq5sp` kept unreferenced). The window switch still repaints the cards and drives the devices card's *+15 in 30 days* |

- ⚠️ **A `color-mix(… 0% …)` PAINTS THE RIGHT COLOUR AND SERIALISES AS `color(srgb …)`** — a probe
  comparing against `rgb(11, 22, 39)` failed on a correct render. The fill is a token now instead.
- ⚠️ **`data-tip` IS HONOURED ON `obs-*` ELEMENTS** — the tooltip engine only refuses to ADOPT their
  `title` (a component prop). That is what gives the icon-only History buttons a hover label.
- ⚠️ **History goes through `LIC_HIST_GO[key]`** — one stable function per entitlement; an inline
  arrow per render would defeat `agTap`'s same-handler guard and obs-button would open the drawer
  twice.
- ⚠️ **Stated, not acted on:** Option 2's APM card still carries colour swatches on its split
  legend, which key no chart — the same thing Option 5's simplification removed.

**Verified:** the License probe **188/188** (Option 2's head, spacing, History icons with a real
inner click, the 7d switch repainting cards; Options 3/4 without the section; Option 5's simplified
card; #0B1627 on every option's cards and on Option 1's widget headers) · screenshots dark and light.

#### The last four 14 Sep 2026 requests — one card shape, a History button, Option 3's tiles

⚠️ **Where these conflict with the table above, this is current.** In particular the devices card's
*+15 in 30 days* and the APM split swatches are both gone.

| request | what changed |
|---|---|
| Option 2: *"all the cards — change to this card's visualization"* | **Monitored devices is rendered by `licQuotaCardHTML` too**, so all six cards are one shape (`licAddonCardsHTML` maps every quota). `licDevCardHTML` and its `.licq*` CSS are **kept and unreferenced**. The card class `licq5o2` became **`licqbox`** (Options 2 and 3 used it for a while). ⚠️ The devices card's change line went with its builder — nothing ON a card reads the 7d/15d/30d window now; the switch sets the History drawer's starting window (`LIC.hrange`) |
| Option 2: *"the history icon is button"* | `licHistIcon` is `obs-button variant="neutral-lightest" size="small"` with a 14px glyph — **the DS's own icon-only button** (obs-tabs builds its ＋ add-tab control exactly so, read out of the bundle). 28×24, filled in both themes. `.licq5r obs-button obs-icon{margin-right:2px}` was deleted: it spaced the glyph from the old word and pushed it off-centre |
| Option 2: *"Healthy will show behind [the title]" + "proper alignment"* | the pill moved **onto the title line, 8px after the name** (`.licq5tt`), token under it (`.licq5tk`); the right cluster is figure + History. Measured: icon tile = meter = caption = split = BY TYPE on one left edge; **History button's right edge = the meter's end**; icon tile, title block and right cluster on one centre line; meter 16px under the header, caption 16px under the meter; title text, figures and buttons on one column across all six cards |
| — (consequence of the devices card joining) | ⚠️ **the split rows lost their swatches** — the devices card's "Agentless" square was the same aqua as the BY TYPE legend's "Cloud" one row lower, so they read as one series. APM's split lost them too, which answers the "stated, not acted on" note above |
| Option 3: *"add in option 3"*, then *"make [the cards] simple and user friendly"* | **Option 3 has its own tile** (`lic3TileHTML`, `.licu3*`), built from its overview's skeleton — `.licovc` card, `.licovl` label row, `.licovg` label-above-value pairs: **name · History button / figure *of total unit* / meter / Available · Used**. A 3 / 2 / 1-column grid by the PANE's width (container query on `.licu3w`, 880px / 520px). No metering tokens, no split, no BY TYPE, and **a pill only when a quota is over its limit** (red *Over limit*) — six identical *Healthy* pills said nothing. Sentence case keeps acronyms (`lic3Name` — `licSentence` would print "Nccm"). The section head was NOT restored |

- ⚠️ **ONE CONTAINER ID, TWO BUILDERS.** Options 2 and 3 both render `#licQCards`, and
  `licQCardsHTML()` picks by `LIC.opt` — otherwise `licSetRange`'s repaint would write Option 2's
  cards into Option 3's grid. There is a probe assertion for exactly that.
- ⚠️ **`.licovl > span{flex:0 0 auto}` (0,1,1) OUTRANKS `.licovact{flex:1 1 auto}` (0,1,0)**, so
  Option 3's action slot has never taken the slack — the first tile build put History against the
  name. The tiles restate it at `.licu3 .licovl > .licovact`. ⚠️ **The overview card's own status
  pill has the same tie** and sits right after *License status* instead of at the card's right
  edge, which is what its spec and its own comment say. Not changed — it is how the user has been
  seeing it.
- ⚠️ **`.licq5t span` → `.licq5t > span:not(.licq5tt)`** — the title row is a span too, and the
  descendant rule would have set it to the token's 12px secondary ink.
- ⚠️ **A flex container ignores whitespace between items on screen, and a probe reading
  `textContent` does not.** The tiles put a real space between label and value ("Available 4,830"),
  which is also what a screen reader gets; the Option 2 probe's two "failures" there were
  `170of 5,000`.
- ⚠️ **CONSEQUENCES, stated:** Option 3 no longer shows the devices breakdown (Option 1's row detail
  and Option 2's card do); Option 3 regains the History drawer through its tiles. (Option 4 got its
  own cards and History buttons in the next section.)

**Verified:** the License probe **215/215** (six one-shape cards in Option 2 with the pill on the
title line, the filled History button, every alignment above measured, real inner clicks on two
History buttons, the 7d window reaching the drawer; Option 3's six tiles — names, figures, pairs,
label-above-value, no all-caps, meter 8px under the figure, History at the meter's end, 3 → 2 → 1
columns at 1258 / 700 / 440px, a forced over-limit tile with its red pill and critical meter, the
drawer, and the repaint keeping Option 3's builder) · dark, light and 1280px screenshots.

#### Option 4 gains a Monitored devices card and five add-on ring cards (14 Sep 2026)

Two requests after the section above. Option 4 is now **the licence card · a Monitored devices card
(`lic4DevHTML`, `.licm4*`) · a grid of five add-on cards (`lic4AddonHTML`, `.licg4*`)**. ⚠️ This
supersedes *"Option 4 still has no quota section and no History door"* — every entitlement has a
History button on Option 4 now.

| card | built from | what it has |
|---|---|---|
| Monitored devices | a supplied image | 40px tinted icon tile · *Monitored devices* + **Healthy** pill · *DEV · Base platform* … **History** (`obs-button default`, `history` icon) · **170** *of 5,000 used · 3.4%* … *4,830 available* + a **`tag-orange`** *15 in 30d* · an 8px meter split by deployment · two tiles (Agentless *SNMP / API / WMI* · Agent-based *Installed agent*, each with its count and *% of used*) · rule · centred *By device type* stacked bar and legend |
| Flow · Log · NCCM · APM · RUM | two supplied HTML pages | icon tile · name · *Add-on license · CODES* … **View history** · rule · a **96px ring** (used of total) beside a *Healthy · N% used* pill over **In use · Available · Last 30 days** · APM adds its split |

- ⚠️ **FIGURES ARE `LIC_DATA`'s, NOT THE PICTURES'** — 170 / 0 agent-based / +15 / Servers 28 where
  the image read 171 / 1 / 9 / 29; every add-on has a 0 delta, so *Last 30 days* says **No change**
  where the pages said +1 / +2, and Flow Sources is 0 of 100, not 5.
- ⚠️ **THE CHANGE FIGURES FOLLOW THE WINDOW** (`licSeries(q, LIC.range)`) — the devices card's
  *N in 30d* and every add-on's *Last 30 days*. They read the fixed 30-day `delta` for an hour, while
  Option 4 had no switch; see the next section for why that changed.
- ⚠️ **ONE CARD PER ROW, FULL WIDTH, NO ACCENT EDGE** (a follow-up request the same day: *"remove this
  color line and all card will be show in single line, not side by side"*). Both the add-on page's
  two-across `auto-fill` grid and its 3px `border-left` were built and then removed; the tone still
  tints each card's glyph, ring arc and APM swatch.
- ⚠️ **ACCENTS ARE EACH ENTITLEMENT'S `q.tok`**, not the pages' hexes, so a card and its History chart
  share one tone on every option. The devices card's split is aqua / lime **as the image has it**,
  which are also the BY TYPE palette's first two (Cloud, Servers) — kept, stated.
- ⚠️ **TWO LABELS FOR ONE ACTION, AS SUPPLIED**: *History* on the devices card, *View history* on the
  add-ons. Unify if wanted; both open the same drawer.
- ⚠️ **THE IMAGE'S FIGURE ROW WAS A BROKEN RENDER** ("of 5,000 / used" and "9 in / 30d" wrapped
  mid-phrase). Every run in that row is `nowrap` and the row itself wraps.
- ⚠️ **SPACING IS ON THE DS SCALE** — the pages' 20/22px padding is 16/24 — and both cards size by
  their container (tiles stack under 620px; an add-on card under 440px puts its ring over its facts),
  so nothing overflows at 1280.
- `obs-icon` names were render-checked first: `server` · `network` · `agent` · `history` ·
  `trending-up` draw; `cloud` · `api` · `switch` · `package` · `arrow-up` do not.

**Verified:** the License probe **248/248** (33 new: the devices card's position, surface, header,
labelled History at the meter's end, figure row on one line, orange change tag, one-segment meter,
both tiles, the centred type bar and legend; the five add-ons' order, codes, 2-across grid, accent
edges, rings with the NCCM arc at 1% and none at 0, pills, facts, APM's split, two real History
clicks, and the 600 / 560 / 400px collapses) · DS conformance **100/100 × 6 scenes** · dark, light
and 1280px screenshots.

#### The section head on every option, and Option 5's second devices card (14 Sep 2026)

Two more requests. ⚠️ **Where they conflict with the sections above, this is current.**

| request | what changed |
|---|---|
| *"[the License & Quota Usage head] will be add in all option 1-5"* | **Options 3, 4 and 5 gained `licQuotaHeadHTML(LIC_QHINT)`** — title, *History opens the trend and a CSV export*, the 7d/15d/30d switch — between their licence card and their cards (Options 1 and 2 already had it). ⚠️ **This REVERSES *"remove this in option 3 & 4"* for the head.** Every option's cards now live in `#licQCards`, and **`licQCardsHTML()` picks the builder by `LIC.opt`** (3 → tiles · 4 → devices + add-ons · 5 → simplified devices + the new card · 2 → six quota cards), so the switch's repaint reaches whichever cards are on screen. Spacing is Option 2's: head 24px under the card (`.lic4 + .lictb` joined `.licx`/`.licov`), cards 8px under the head |
| — (consequence) | ⚠️ **a switch above a card that ignores it would look broken**, so Option 4's devices tag (*N in 7d*), every add-on's *Last N days* and Option 5's new card now read `licSeries(q, LIC.range)`; Option 5's simplified card already did. Option 2's and Option 3's cards show nothing window-dependent — there the switch only sets the History drawer's starting window |
| Option 5: *"add new card"* (a supplied HTML page) | **`lic4DevHTML('5')`** — Option 4's devices markup with `.licm5`, the house pattern (`lic4HTML('5')`). What differs: 36px icon tile · 30px `download` / `cpu` deployment marks · the tile name at 12px secondary weight · a 26px figure with the share quieter · **2px gaps in both bars, no track on the type bar, 12px/4px minimum segment widths** (non-zero only, `flex:0 1 auto` so gaps cannot clip the last segment) · **status graded Healthy / Warning ≥80% / Critical ≥95%** · the change tag **signed**, orange on a rise and green otherwise, with a hover sentence. ⚠️ **It is ADDED under the simplified devices card, so Option 5 shows two cards for one entitlement** — what "add" said; one line in `licQCardsHTML` if one should go |

- ⚠️ **THE PAGE'S TYPE SHARES WERE OF THE USED TOTAL** (86 / 171 = 50%), which left its own bar ~19%
  short of full. They are shares of the **typed** total here (62%), as on every other card and in the
  image this same design arrived as.
- ⚠️ **`licSetRange` DOES NOT MOVE THE SWITCH** — it is what the switch's `change` calls. A probe that
  calls it directly and then asserts the segment moved fails on working code; click the segment inside
  obs-radio's shadow root instead, as a user does.

**Verified:** the License probe **277/277** (the head on Options 3–5 with its hint, switch and
24px/8px spacing; a real click on 15d retitling Option 4's devices tag and all five add-ons; Option 5's
new card — sizes, signed orange tag, 12px meter floor, `download`/`cpu` marks, gapped trackless type
bar with every segment inside, typed-total shares, History to the drawer, Warning at 84% and Critical at
96% while the simplified card stays Healthy — and 7d retitling both Option 5 cards) · dark and light
screenshots.

#### Option 5 gains the add-on cards, "option 2" layout (14 Sep 2026)

Request: *"add this card in option 5"* — a supplied page, **"Add-on licenses — option 2"** — *"like
this card"*, with a screenshot of the add-on cards stacked one per row. Option 5 is now **licence card
· section head · simplified devices card · the quota devices card · five add-on cards**.

- **`lic4AddonHTML(q, '5')`** — Option 4's builder with a variant (the `lic4HTML('5')` /
  `lic4DevHTML('5')` pattern), same data and parts on the page's own 2-column grid (`.licg5c`):
  row 1 **tinted 36px icon · name + *Healthy · N% used* pill · *Add-on license · CODES*** … **View
  history**; row 2 **In use · Available · Last N days** on the left, the **96px ring** on the right;
  row 3 APM's split across the card. No divider — the page has none.
- ⚠️ **ONE PER ROW, FULL WIDTH, AND FLOW SOURCES INCLUDED** — from the screenshot; the page itself
  listed only four cards in a two-across grid.
- ⚠️ **NO ACCENT EDGE.** The page has none, and the screenshot's coloured edges belong to the older
  Option 2-style cards it was pointing at for the stacked layout — the same edge was removed from
  Option 4's cards on request that afternoon.
- ⚠️ **`.licg4t span` ALSO MATCHES THIS CARD'S TITLE ROW**, which is a span too: Option 4's subtitle
  rule (12.5px, `nowrap`, ellipsis) would clip the pill and stop the row wrapping. Undone at
  `.licg4t .licg5tt` (0,2,0) — the descendant-selector trap this file records at `.agpfgt span`.
- ⚠️ *Last N days* follows the window switch, like Option 4's; every add-on reads *No change* because
  `LIC_DATA` has no add-on growth (the page said +1 / +2).

**Verified:** the License probe **294/294** (17 new: order, one per row at full width, no edge, pill
beside the name and centred on it, the title row not clipped, codes, tinted tile, View history
top-right with the ring under it and the facts level with the ring, no dividers, APM's split under the
facts, the drawer, two-across facts in a 520px card, and 15d retitling all five) · dark and light
screenshots.

#### Option 5 — filled History buttons, and the simplified devices card removed (14 Sep 2026)

⚠️ **Where these conflict with the three sections above, this is current.**

- **Option 5's *History* and *View history* are filled, borderless buttons** (request: *"show as normal
  button like [Create Widget] without border"*). `obs-button variant="neutral-lighter"` — its fill is
  `--neutral-button-bg` (`#2b394f` dark / `#e3e8f2` light) and its border is the **same token**, so no
  outline shows. Set only on the `'5'` variants of `lic4DevHTML` / `lic4AddonHTML`; **Option 4 keeps
  the outlined `default`** its pictures had.
- **Option 5's simplified Monitored Devices card is GONE** (request: *"remove this card in option 5"*).
  `lic5DevHTML` and the `.licd5*` CSS are **kept and unreferenced**. Option 5 is now **licence card ·
  section head · the quota devices card (`lic4DevHTML('5')`) · five add-on cards**, so the "two cards
  for one entitlement" note above no longer applies.

**Verified:** the License probe **282/282** (the simplified card absent; the quota card first under the
head; both button kinds `neutral-lighter` with one shared fill, border colour = fill, `#2b394f` in dark;
Option 4's buttons still `default`) · DS conformance **100/100 × 6 scenes**.

#### Option 3 removed from the License switcher; Option 4's History buttons filled (14 Sep 2026)

⚠️ **Where this conflicts with anything above, this is current.**

- **The switcher reads `Option 1 · Option 2 · Option 4 · Option 5`** (request: *"remove option 3"*).
  ⚠️ **THE REST WERE NOT RENUMBERED** — every request and note names them Option 4 and Option 5, and
  a renumber would silently repoint all of them. Say so if they should become 3 and 4.
  ⚠️ **Option 3's code is kept and unreferenced** — `licOvHTML`, `lic3TileHTML`, `lic3CardsHTML`,
  `licOvDemo` (which now falls through to Option 1's page) and their CSS; its route and its
  `licQCardsHTML` branch are gone. One entry in `LIC_OPTS` plus the route brings it back.
  ⚠️ `_verify/licconf.py` lost its Option 3 scene (five scenes now), and the scratchpad's
  `opt3probe.py` (45 assertions) tests a screen that no longer ships.
- **Option 4's History and View history buttons are `neutral-lighter` too** (request: *"in option 4 the
  history and view history will be show as normal button … without border"*) — both variants of
  `lic4DevHTML` / `lic4AddonHTML` now share the filled button, so the "Option 4 keeps the outlined
  `default`" line above is superseded.

**Verified:** the License probe **247/247** (the switcher's four options and no `3`, `"3"` falling
through to Option 1, Option 4's buttons `neutral-lighter`) · screenshots of Options 4 and 5.

#### Option 2 — the caption under the figure, and a neutral meter track (14 Sep 2026)

Request: *"the 100 remaining of 100 will be align of 0 of 100 exporters and progress bar color is
#2B394F — the same change in log, nccm, apm, rum, flow"*.

- **The card is a 4-column grid** (`.licq5.licqbox`: icon · title · figure · History). The header
  joins it with `grid-template-columns:subgrid` and its right cluster with `display:contents`, so the
  figure owns column 3; the caption row is placed in **that same column** and pushed to its end. Both
  right edges are the column's end **by construction** — a `padding-right` sized to the History button
  would have been a second copy of that button's width. Everything else spans all four columns.
- **The meter track is `--progress-bar-bg`** — the DS's own progress-bar track token, `#2b394f` in
  dark (as asked) and `#e3e8f2` in light. The fill keeps the entitlement's tone.
- ⚠️ **Monitored Devices changed too.** The request named the five add-ons, but all six Option 2 cards
  are one builder and one shape by an earlier request; excluding one would mean special-casing it.
  One selector if it should keep its old caption and tinted track.
- ⚠️ **A probe cannot measure a `display:contents` element** — it has no box, so the old *"right
  cluster shares the centre line"* assertion read 0 and failed on correct layout. It measures the
  figure and the History button themselves now.

**Verified:** the License probe **251/251** (caption right edge = figure right edge on all six cards,
the caption right of the meter's midpoint, the track `rgb(43, 57, 79)` in dark, the fill still toned,
header items on one centre line) · dark and light screenshots.

#### Option 2 — the used figure and what remains are one stat (14 Sep 2026)

Request: *"in option 3 … improve the '0 of 100 exporters' & '100 remaining of 100' — better
visualization and user-friendly UI"*, with a screenshot of **Option 2's** cards (the switcher reads
Option 1 · 2 · 4 · 5 since Option 3 was removed, and the pictured cards are Option 2's `licqbox`).
⚠️ **This supersedes the section above's caption row.**

- **`.licq5st`** — the figure (**0** *of 100 exporters*) over **100** *remaining · 0% used*, right
  aligned, in grid column 3 beside History. It **mirrors the name + code block** on the left, two
  lines each side, and the whole block sits on the header's centre line.
- **The caption row under the meter is gone** — it sat ~40px from the figure it qualified, alone at
  the card's right. An add-on card is now header · meter and nothing else, one row shorter.
- **The second line gained the share used** (3.4% / 0% / 1% / 4%) — the number the meter drew and no
  text stated — and lost *"of 100"*, which the figure directly above already says.
- ⚠️ `lic5DevHTML` carries a near-identical figure line; the change was applied **inside
  `licQuotaCardHTML` only** (a global string replace matched twice).

**Verified:** the License probe **253/253** (the six remaining lines, no caption row, right edges
equal, the line directly under the figure, the block centred on the header, History level with the
block, the meter the last row of an add-on card) · dark and light screenshots.

#### Option 2 — History becomes Options 4/5's labelled filled button (14 Sep 2026)

Request: *"in option 2 improve the history button like option 3"*, pointing at the icon-only button.
⚠️ **Option 3 had just been removed, and its tiles used this very button**, so "like option 3" was
read as **the third entry of today's switcher — Option 4**, whose History buttons Option 5 shares.
Say so if a different button was meant.

- `licHistIcon` is now **`obs-button variant="neutral-lighter"`** at the default size with the trend
  glyph **and the word "History"**, `data-tip` *Open history and CSV export* — the same button as
  Options 4 and 5. It was `neutral-lightest small`, icon-only (28×24): a bare glyph beside a two-line
  figure read as decoration. This supersedes *"the history icon is button"* above.
- The live callers are Option 2's six cards only (`licDevCardHTML` and `lic3TileHTML` are
  unreferenced).
- ⚠️ `obs-button` may reflect its `size` prop as an attribute, so a probe asserting *no `size`
  attribute* failed on correct markup — assert the rendered class (`button.s-small` absent) instead.

**Verified:** the License probe **255/255** (variant and default size, "History" label with the
trend glyph, borderless with fill = border, `#2b394f` in dark, height ≥30px, glyph before the word)
· dark and light screenshots.

#### Option 4 — three lines removed, and the add-on facts become tiles (14 Sep 2026)

Four narrow requests, all Option 4. ⚠️ **Where they conflict with the Option 4 sections above, this
is current** — in particular *"The two HORIZONTAL rules (above the term bar, above the activation
row) stay"*: only the activation row's rule stays now.

| request | what changed |
|---|---|
| *"in option 4 remove the line"* (licence card) | **no rule above the term bar** — `.lic4tl` lost its `border-top` and 24px `padding-top`; the 24px margin under Account / Status stays. Option 5 already had neither, so its `.lic5 .lic4tl` override was deleted and the two options share one rule |
| *"remove the 'By device type' and remove line"* (Monitored devices) | `lic4DevHTML` emits the `obs-divider` and the `.licm4l` heading **only for Option 5**. The legend names every type and the bar's `aria-label` still says what it is; the card's 20px gap separates tiles from bar |
| *"In use, Available, Last 30 days — show like [the Agentless tile]"* (Flow Sources) | **all five add-on cards** (one builder) render those three as **`.licm4k` tiles** — the devices card's own markup, so the two card kinds speak one shape: icon tile · label over the unit · figure over its share. *In use* wears the entitlement's tone and `q.icon`; *Available* (`check`) and *Last N days* (`history`) are `--neutral-light`, because three hues on one card read as series. Tiles sit three across beside the ring under the pill (`.licg4f.licg4ft`, 12px gap) and stack under 720px of card |
| *"remove this line"* (under the add-on header) | the `obs-divider` after `.licg4h` is gone; the card's 16px gap separates header and ring. ⚠️ **APM's rule above its split row is a different line and stays** — one line if it should go too |

- ⚠️ **Option 5 is untouched by all four** — it keeps its plain `fact` rows, its devices card's
  divider and heading, and never had the term-bar rule. Each request named Option 4.
- ⚠️ **The change tile shows `0` over *No change*** where the fact row said *No change* as its
  value — a 20px figure slot holding two words read as a label. A rise reads `+N` over *added*.
- ⚠️ **`(0,2,0)` on `.licg4f.licg4ft`** is what outranks the 440px container rule that sets
  `.licg4f` to two columns; without it a narrow card would put two tiles across and wrap the third.

**Verified:** the License probe **264/264** (no term-bar rule and the bar 24px under the record, the
activation row's rule kept; the devices card with no heading and no divider, the type bar 20px under
the tiles, Option 5 keeping both; the add-on facts as tiles with label / unit / value / share on all
five cards, the tile matching the Agentless tile's padding / fill / radius / 36px icon, only *In use*
toned, three across beside the ring and under the pill, stacked in a 400px card; no rule under any
header, APM's split rule the one divider left; 15d retitling the change tile) · dark and light
screenshots.

#### Option 5 — no card borders, a top-aligned licence card, add-ons two across (14 Sep 2026)

Three requests, all Option 5. ⚠️ **Where they conflict with the Option 5 sections above, this is
current** — in particular *"THE TOP ROW IS CENTRED"* and *"one per row, full width"*.

| request | what changed |
|---|---|
| *"remove the box border of every card"* | the Monitored devices card (`.licm4.licm5`) and the five add-on cards (`.licg5c`) now match the licence card: **`border-color:transparent`** (kept 1px, so no box shrinks against Option 4's) on **`--lic5-surface`**, the licence card's own borderless fill — `#0B1627` in dark, a 3% wash in light so a card keeps an edge on the white pane |
| *"change the 'OBSERVEOPS EDITION' alignment [with] the card"* | the licence card's top row **stretches**: *License type / Issue date* sit on the *ObserveOps edition* line and the term bar is level with the description's last line; the ring keeps its own centre. The record is one grid (`.lic4meta` is `display:contents`) with `align-content:space-between`, so fields · fields · bar share the free space evenly — pushing only the bar down opened a ~90px hole under Status. Option 4 stays centred |
| *"make this card side by side and … proper alignment with user friendly"* | the add-on grid is **two across** (`.licg4.licg5`), one column under a **1000px** pane via a named container on `#licQCards` (set with `:has(> .licg4.licg5)`, so no other option's unnamed container queries gain a container). Inside: View history is **centred on the title block** (it was pinned to the top), and **`align-content:start`** keeps a card's content at its top when its row-mate is taller (NCCM beside APM's extra split row) |

- ⚠️ **THE 1000px THRESHOLD WAS MEASURED.** At a 1280 viewport the pane is ~940px; two ~460px cards
  wrapped the pill under the name and pushed *Last 30 days* onto a second row, so 1280 gets one per
  row and 1366+ gets two.
- ⚠️ **RUM Front-end Apps sits alone in the last row at half width** — five cards, two across.
  One rule (`grid-column:1 / -1` on the last card) if it should span.

**Verified:** the License probe **271/271** (every Option 5 card borderless on the licence card's
surface with the 1px kept; the eyebrow and *License type* on one line, the bar level with the
description, the record's rows evenly spaced, the ring centred; two across with 16px both ways, half
the devices card's width, RUM alone at the left; one column at a 960px pane; equal row heights with
NCCM's content at the top; View history centred on its title block) · dark, light and 1280px
screenshots.

#### Option 5 — reference-card add-ons, share-bar device tiles, no type heading (14 Sep 2026)

Two more requests on Option 5. ⚠️ **Where they conflict with the Option 5 sections above, this is
current** — the add-on card's ring, its pill-beside-the-name, the centred View history and the
*"Option 5 keeps both"* heading note are all superseded.

| request | what changed |
|---|---|
| *"remove the 'By device type' and line"* (Monitored devices) | gone on **both** options now — `lic4DevHTML` emits neither the `obs-divider` nor `.licm4l` (both rules kept, unreferenced) |
| *"the 2 card inside … make user friendly"* (Agentless / Agent-based) | `.licm5k` tiles: 36px icon top-aligned with a body-weight name over its note, **the figure with its unit inline** ("170 devices") at the right, and under both a **4px share bar** in the tile's tone (the meter segment's aqua / lime) beside "N% of used". A zero share draws the tinted track and no fill. Option 4's tiles unchanged |
| *"make [the add-on card] proper and user friendly"*, references: an SLO card (TestVM) and a NetRoute card (Linkedin) | the card is rebuilt on the references' reading order, as a flex column: **header** (icon · name over *Add-on license · CODES* · status pill top-right, no %) · **figures** In use · Available · **Allotted** as label over a 22px value with its unit · **usage** row ("Usage" … N% over an 8px meter in the tone) · APM's split as two more figures · **footer** "Last N days · No change" beside View history. The ring is gone from Option 5 (`lic4Ring` is Option 4's) |

- ⚠️ **THE FOOTER TAKES `margin-top:auto`**, so in a row where APM's split makes the pair taller both
  cards' footers share one line at the bottom; the column's 16px gap is the minimum above it.
- ⚠️ **A count of 1 takes the singular unit** ("1 device") — `uw()` in the Option 5 branch.
- ⚠️ **No rule above the footer**, though both references draw one — every line on these cards has
  been removed on request today, so adding one back was not assumed. One border-top if wanted.
- ⚠️ The %'s in the usage row are whole numbers; the meter fill uses the exact share (NCCM 1% draws a
  1% fill, not a rounded one).

**Verified:** the License probe **276/276** (the device tiles' icon / name weight / "170 devices" /
share bar full at 100% and an empty tinted track at 0% / tone match / alignment; no heading and no
divider; the add-on cards' child order, pill top-right reading *Healthy*, the three figures with
units and a singular for 1, the usage row with NCCM's 1% fill and no fill at 0, APM's split before
the footer, footers on one line across row-mates, View history at the footer's right, the window
retitling the footer) · DS conformance · dark and light screenshots.

#### Option 5 — History opens a full-width modal, laid out like Metric Explorer (14 Sep 2026)

Three requests in a row. First *"in option 5 when I click the History button, the sidebar will
convert to a center popup"*, then *"improve this popup like [Metric Explorer's full-width chart
popup]"*, then — after a first rework had changed what the popup said — *"the details are the same
[as the centred popup], change only the UI"*. **What ships is Metric Explorer's LAYOUT carrying the
centred popup's DETAILS, unchanged.** Options 1, 2 and 4 keep the `obs-drawer`.

⚠️ **The Monitored devices card rebuild in the add-on card shape (the request just before) was
REVERTED on request** (*"remove the last changes"*). Option 5's devices card is the share-bar tile
version described in *"Option 5 — reference-card add-ons, share-bar device tiles"*.

| row | what |
|---|---|
| head (`.lichxh`) | **`<Entitlement> · Historical Consumption`** + the token behind a swatch in its tone … RANGE 7d/15d/30d · the window's two dates · **Export as CSV** (primary) · ✕ |
| chart (`.lichxc`) | `licHistChart(s, q, {W:1480, H:460, dates})` — full width, a date axis, the dashed cap line with its *license cap N* legend under it |
| figures (`.lichxf`) | **Current** (in the tone) · **Period start** · **Peak** · **Average** · **Change** (green when positive), five across |

- ⚠️ **THE DETAILS ARE THE CENTRED POPUP'S, AND ONLY THOSE.** The first Metric-Explorer rework added
  Entitlement / License cap / Min / Max figures and unit suffixes; the follow-up asked for exactly the
  same details as before, so all of that was taken back out. Do not re-add figures on the strength of
  the reference — its figure row is a different product's.
- `licHistOpen(key)` routes to **`licHistMdOpen`** when `LIC.opt === '5'`. The dialog is an
  **`obs-modal` (`#licHistMd`, class `lichmx`) rendered inside `#licPage`** by `licHTML` on Option 5
  only — so the scoped DS token block reaches it through the DOM (the top-layer trap that needed
  `#licHistDr` added to that block does not apply). `width="calc(100vw - 48px)"`; obs-modal caps
  itself at the same value.
- ⚠️ **ITS OWN HEAD AND FOOT ARE HIDDEN FOR THIS INSTANCE ONLY**, by the `attachShadow` corner hook's
  obs-modal entry: `:host(.lichmx) .head,:host(.lichmx) .foot{display:none}:host(.lichmx) .body{padding:0}`.
  The Metric Explorer head carries controls obs-modal's title bar has no slot for, so the page draws
  its own head inside the body. `:host(.class)` is what keeps the Activation Code modal untouched.
- ⚠️ **`licHistChart(s, q, o)` gained an optional `o`** — `W` / `H` (default 640×220, the drawer's)
  and `dates`, which switches on an x axis of ~10 date labels. **The first and last labels anchor
  `start` / `end`**, or the last one ("Sep 14") is clipped at the plot's right edge.
- ⚠️ **ITS IDS ARE ITS OWN** (`licHistM`, `licHMRange`): the drawer is created once on `<body>` and
  survives an option switch, so sharing `licHist` / `licHRange` would put two elements under one id
  after opening History on Option 1 and then Option 5.
- ⚠️ **obs-modal leaves `open` true after its own ✕** (recorded) — the page's ✕ calls
  `licHistMdClose`, and `licAfter` still syncs `close`/`cancel` (Esc) and clears `LIC.hist`;
  `licHistClose()` closes the modal as well as the drawer.
- ⚠️ **Below 1100px the head WRAPS rather than hiding anything** — a first pass hid the dates, which
  would have dropped one of the details the request said to keep.
- ⚠️ **No header icon**: obs-modal v0.1.166 renders its icon slot only in the **confirm** variant
  (read out of the bundle).
- ⚠️ **A modal's geometry is 0 in the same tick `open` is set** — it paints a tick later. Probe
  assertions on it are structural; its layout was checked from screenshots of the open dialog.
- ⚠️ **Pre-existing, not changed:** for a quota at 0 the chart's scale tops at 1 and the tick labels
  round to *1, 1, 1, 0, 0* — in the drawer and the modal alike (`licHistChart`).

**Verified:** the License probe **285/285** (Option 5's History opens `#licHistMd`, not the drawer;
the head row's title, token + swatch, RANGE at 30, both dates, Export and ✕; the 1480×460 chart with
its date axis and end-anchored last label; the cap legend; the five figures `Current=170 · Period
start=155 · Peak=170 · Average=162 · Change=+15` with tone and green; obs-modal's own head and foot
hidden only on `lichmx`; the range repainting in place to 7 days; ✕ shutting it and clearing state) ·
DS conformance **100/100 × 5 scenes** · `stbehave` **ALL 21 PASS × 13 pages** · the open modal
screenshotted in dark and light at 1600×1000 and 1280×800.

#### Option 5 — the EPS tab: stat cards, a drop-policy note, the allocation card and Highcharts trends (15 Sep 2026)

Request: *"in option 5 the 'EPS Trend Breakdown' tab — remove all details and add [a supplied strip:
HARDWARE CEILING · ALLOCATED · INGESTED LIVE · DROP STATUS] as individual cards"*, then *"also add
this as note"* — sent with nothing attached, so it was asked; the answer was **the drop policy** —
then *"also add this component [the live product's Dynamic EPS · allocation by signal card] using the
ObserveOps design system"*, then the live *Calculated vs actual EPS · per telemetry* section *"as chart
line"*, then *"remove the card line [Total's top accent] and improve the chart using
highcharts.com/demo"*.
**Options 1, 2 and 4 keep the full EPS tab** (`licEpsHTML`); only Option 5's slot changed.

| part | what |
|---|---|
| cards (`lic5EpsHTML`, `.lice5*`) | four individual cards, one per figure — uppercase label · a 22px/600 figure in `--numeric-font-family` (JetBrains Mono) · a caption. Allocated in `--info-text`, Drop status `--severity-clear` (or `--severity-critical` + *dropping · over allocation*), the other two plain |
| surface | Option 5's borderless card: `--lic5-surface`, 1px transparent border, 4px corners, `16px 24px` padding |
| layout | 4 across, 2 under a 720px pane, 1 under 360px — a **named** container (`lice5`), so it cannot answer the add-on cards' unnamed container queries |
| note (`.lice5n`) | `obs-banner variant="info" title="Drop policy"`, 16px under the cards, with *Notify* and *Drop* as a label \| text grid so both sentences start on one column |
| allocation card (`lic5AllocHTML`, `.lice5a`) | the stat cards' surface · an **`obs-toolbar`** head (title in `start`, *allocated vs live ingested · over-quota shaded* on the right — Option 1's own head for this table) · one row per signal: swatch in its `LIC_DATA` tone, name, *N% of pool*, *live / allocated eps* at the right, over an 8px bar · a legend in the DS chart tokens |
| trend section (`lic5TrendHTML`, `.lice5t`) | an `obs-toolbar` head with the ingested · dropped · allocated legend as line samples · **Total** spanning the row, then Log · Flow · APM · RUM two across (one under 720px) · each card: swatch + name, *live / allocated eps*, a 96px chart, *avg · peak · util*. No top accent line — built with one and removed on request |
| the trend chart (`lic5TrendMount`, `lic5HcConfig`) | **Highcharts v10**, lazily loaded from jsDelivr, configured from the DS's captured `chart-multi-line` fixture (`@mtdt/observeops-ds-spec` 0.1.219): an areaspline Ingested series in the signal tone (Total `--info-text`) with a `color-mix()` gradient fill, a Dropped spline (null while within quota), the allocation as a dashed y plot line, a shared HTML tooltip (Ingested · Dropped · Allocated) with a crosshair on `--chart-tooltip-background` / `--chart-font-family`. Every colour a `var(--token)` string, so light / dark flip without a re-render |
| the bar | headroom `--neutral-lightest` · allocated band `--progress-bar-bg` · ingested `--info-text` · over-quota `--secondary-red` from the marker on · a 2px `--secondary-yellow` allocation marker overhanging 3px each side. **One scale for all four rows** = the largest allocation (or ingest) + 5%, which is where the live card puts its markers (Log ~95%) |

- ⚠️ **THE FIGURES ARE `LIC_DATA`'s, NOT THE PICTURE'S** — the same ones Options 1, 2 and 4's EPS tab
  reads: allocated **951** (the picture said 949), ingested **511** at **54%** (the picture's idle
  instance said 0 / 0%), 124% of ceiling and *clean* in both. The ingest is the seeded figure already
  recorded under *Deliberate differences from live*.
- ⚠️ **ALLOCATED AND INGESTED SHARE ONE BLUE, `--info-text`**, because the live product paints its
  Allocated figure and its ingested fill the same periwinkle. The chart palette has no blue (aqua is
  RUM's tone, indigo sits beside Log's neon-purple); `--info-text` (#9cc4ec / #2f6099) is the nearest DS
  token. The card shipped for an hour in `--chart-indigo` and was moved when the allocation card
  arrived. ⚠️ It is a status-family token used as a series colour — stated, not hidden.
- ⚠️ **THE BARS ARE THE DECLARED CHART GAP** — `search_components` finds no meter or bullet element and
  `list_gaps` lists charts; the head is `obs-toolbar` and the legend uses `--chart-font-family` /
  `--chart-legend-color`, the DS's own chart-legend tokens.
- ⚠️ **"% of pool" IS LIVE INGEST ÷ THE ALLOCATED POOL** (22 · 10 · 15 · 6%) — the live card read 0% on
  every row with nothing ingested, so it cannot be an allocation share. Option 1's table labels its
  ALLOCATION share "% of pool"; the two options now print different numbers under one label.
- ⚠️ The captions (*eps · auto-derived*, *% of ceiling*, *% utilization*, *within limits*) are the
  picture's words; every number in them is derived from `LIC_DATA.eps`.
- ⚠️ **HIGHCHARTS IS FETCHED AT RUNTIME, AND IT IS COMMERCIALLY LICENSED.** The DS's data-viz guide now
  answers a standalone chart with *"copy the fixture's config and render with Highcharts v10"*, and the
  product holds the licence — but the public Pages site now pulls `highcharts@10.3.3` from jsDelivr.
  It loads once, only when Option 5's EPS tab paints; **offline, the hand-drawn SVG (`lic5TrendChart`)
  stays in the card**, since nothing is cleared until `window.Highcharts` exists.
- ⚠️ **`visible:false` ON A HIGHCHARTS AXIS DROPS ITS PLOT LINES AND ITS CROSSHAIR.** The first build
  hid both axes that way and the dashed allocation rule and hover line silently vanished. The axes are
  visible with labels / lines / ticks / grid switched off and every axis colour set — otherwise
  Highcharts' `#cccccc` / `#ccd6eb` defaults land in the SVG as hex attributes.
- ⚠️ **A `var()` fillColor WOULD PAINT A SOLID SLAB** — Highcharts cannot parse `var()` to apply
  `fillOpacity`. The fill is a linearGradient whose stops are `color-mix(in srgb, var(--lice5-tone) N%,
  transparent)` strings, which Highcharts passes through untouched.
- ⚠️ **Highcharts creates EMPTY subtitle and caption `<text>` nodes even with `text:null`**, painted in its
  `#666666` default — the DS checker dropped both Option 5 scenes to **token 99** on those ten nodes.
  Both carry a token colour now (found by listing every element computing to `rgb(102,102,102)`, not by
  guessing: the axis-label defaults were tried first and were not it).
- ⚠️ **Highcharts writes `overflow:hidden` inline on its container**, clipping the tooltip at 96px —
  `.lice5hc .highcharts-container{overflow:visible!important}`.
- ⚠️ **A chart painted in the hidden tab measures 0 wide**; a ResizeObserver per container reflows it
  when the tab shows, and charts whose container a repaint removed are destroyed before the next mount.
- ⚠️ **A programmatic `tooltip.refresh()` does not draw the crosshair** — probes drive
  `point.onMouseOver()`. And Highcharts loads fast enough that a probe's "before mount" checks can
  already see the chart: the SVG fallback is tested by rendering it into a temporary element.
- ⚠️ **Consequence, stated:** Option 5 no longer shows the per-signal allocation TABLE (its data is
  the allocation card now); the per-telemetry charts are back as the trend section.
- ⚠️ Swatch colours are `LIC_DATA`'s signal tones (Log neon-purple · Flow emerald · APM amber · RUM aqua),
  not the picture's (lime · lavender · amber · mint), so every option agrees on a signal's colour.

**Verified:** a **99-assertion** probe (only Option 5's markup in the slot; the four cards' labels,
values, captions, font, tones, surface and row; the note; the allocation card's rows, % of pool,
figures, marker positions 95.2 / 46.1 / 80.7 / 66.4%, fills, legend; the trend section's head, legend
line samples, five cards, no accent, figures, avg · peak · util, two-across layout and rhythm; the SVG
fallback; Highcharts 10 mounted in all five — width, 96px, series types, 24 hourly points equal to
`licEpsSeries`, Dropped null, the 314 plot line, tone strokes, gradient stops, a hovered tooltip reading
Ingested 212 · Dropped 0 · Allocated 314 inside the card, the crosshair, no hex attributes; 2 → 1 across;
the *dropping* state; Options 1 and 4 still carrying the full tab) · DS conformance **100/100 × 6 scenes** (`licconf.py` gained
`opt5eps`; token 100 on both Option 5 scenes after the subtitle fix) · dark, light and 1280px screenshots, plus the hovered tooltip in both themes.

#### Options 2 and 4 — Agentation notes, the History modal, and a trimmed Option 2 licence card (15 Sep 2026)

⚠️ **Where this conflicts with the Option 2 / Option 4 sections above, this is current.**

| request | what changed |
|---|---|
| Agentation, Option 4 licence card: *"in this field add border individual"* | each record field (License type · Issue date · Account · Status) is its own bordered box — 1px `--border-color`, 4px corners, 12px/16px padding, 12px gaps (was an open grid at 24px) |
| Agentation, Option 4 ring: *"make small font size"* · *"make the circle thickness"* | the days-left figure 27 → 22 (viewBox units) and both arcs 10 → 14 |
| Agentation, Option 4 add-on cards: *"show top right behind View history"* | the *Healthy · N% used* pill left the tiles row for the header, 12px after View history on its centre line; the three tiles now sit centred on the ring |
| *"the History centre popup — copy and apply in option 2 & 4"* | **`LIC_HIST_MD = ['2','4','5']`** is the one list both `licHTML` (renders `#licHistMd`) and `licHistOpen` (routes to it) read; Options 2 and 4 now open Option 5's Metric-Explorer modal. **Option 1 keeps the drawer** |
| Option 2 card: *"add the text"* | the edition description (`.licxdesc`, the same `LIC_DATA.edition` sentence Option 4 prints) under the name row |
| Option 2 card: *"remove the Activation code and show it as a button"* | the rule and the code block are gone; an **Activation code** `obs-button` (key icon) sits after the term and opens the SAME Activation Code modal Upgrade Now opens (`licActOpen`) — code, Copy and the support mailto all live there |
| Option 2 card: *"remove ObserveOps edition"* · *"remove Expires, show Activated in that box"* | no eyebrow/label row; the status pill went onto the name row after *Unified edition* and, one request later, into the **fourth tile** (*Status*), replacing *Expires*, so it is shown once. The expiry still reads in the term line |
| Option 2 card: *"remove the 4% in the donut chart"* | `licOvRing(pct, tone, bare)` — Option 2 passes `bare`, so no figure; the % stays in the aria-label and the term line |

- ⚠️ **Scoped with `.lic4:not(.lic5)`** — Option 5 renders the same licence-card markup (its record is `display:contents`, its ring 100px) and was not in the notes.
- ⚠️ **`.licxid` is `flex:1 1 320px`.** With the long description inside, the identity block's content width is the whole sentence and `.licxtop` wraps — the term and the new button dropped onto their own line at the left. The basis keeps them top-right and lets the sentence wrap (two lines at 1600, three at 1280).
- ⚠️ **A throwing assertion hangs the License probe rather than failing it** — the Option 4 pill move left `querySelector('.licg4f obs-tag')` null, and the run never emitted (NO PROBE OUTPUT at the full timeout). Update the probe's selectors in the same change as the markup.
- ⚠️ **Date-pinned assertions rot overnight** — the modal's window note was asserted as literal Aug 15 → Sep 14 and failed on Sep 15; it is derived from `licHistWindow()` now.
- ⚠️ **One intermittent probe miss, not a user path**: closing the modal and opening another in the SAME tick occasionally leaves it closed. A click cannot do that; it passed on three reruns.

**Verified:** Agentation probe 20/20 (and Option 5 untouched) · the License probe **282/282** after the Option 2 rework (modal on 2 and 4 with titles, Option 1 still on the drawer, the description, no label row, name row = title + edition tag, Status tile, button top-right opening `#licAct`, bare ring) · screenshots: Option 4 dark / light / 1280, the modal from Options 4 (dark) and 2 (light), Option 2's card dark / light / 1280 · DS conformance **100/100 × 6 scenes** (token 100) after all of them.

#### The tabs, Option 2's live colours, and six Option 4 changes (15 Sep 2026, later)

⚠️ **Where this conflicts with the Option 2 / Option 4 sections above, this is current** — in particular
Option 4's term bar, its *Activation code* row, its devices card's meter and change tag, and 24px card
padding are all gone.

| request | what changed |
|---|---|
| Option 2: *"remove the 4% of term used, add Ends 12 Aug 2030"* | the term line reads **`1,432 days · Ends 17 Aug 2030`** (en-GB, from `T.expires`; *Ended* once expired). ⚠️ **17, not 12** — the licence's own expiry; the date is derived, so it cannot drift |
| *"remove the icon in all option"* | the License tabs carry **no icons** — `licTabs()` / `LIC_TABS_EPS` lost their `icon` fields; obs-tabs draws a glyph only when an item has one |
| Option 2: *"change the color using"* the live `license-hero-name` / `-infinity` / `-chip` | the name is a **100deg `--license-accent` → `--license-violet` gradient** clipped to text (`.licxname`), the ∞ the accent at .85 (`.licxinf`) — now **siblings**, so the gradient spans the name alone; the *Unified edition* chip is a **135deg gradient fill with white 600 text**, still an `obs-tag` (`.licxchip`), styled through the `attachShadow` hook (`:host(.licxchip) .tag`). Sizes unchanged |
| Option 2: *"this 2 element make proper alignment"* (term block + Activation code button) | `.licxtop` is **`align-items:flex-start`** — the ring's top is the name row's top; inside `.licxterm` the ring, lines and button still share a centre |
| Option 4: *"remove the progress bar"* | no Jul 2026 → Aug 2030 bar (`.lic4tl` rendered only for Option 5) |
| Option 4: *"Activation code with an expand/collapse icon"*, then *"remove the line, the button at the end of the paragraph"* | an **`obs-button variant="transparent"` + `chevron-down`** directly under the edition description (`.lic4axw`, 12px below it) toggles **`LIC.act4`** (default **collapsed**); open, the bottom row (`.lic4act.lic4ax`) shows the code box + Copy + support line across the card, with **no rule and no heading**. `lic4ActTog` flips classes only — no repaint |
| Option 4 devices: *"the progress bar like [the add-on ring]"* and *"15 in 30d as a card like Last 30 days"*, then *"change the alignment"* | the figure line (`170 of 5,000 used · 3.4% … 4,830 available`) runs across the card, then **the add-on cards' own row**: the 96px `lic4Ring` (entitlement tone) beside **three tiles** — Agentless · Agent-based · **Last N days** (`changeTile`, the add-on tile's markup, following the window switch). No meter, no orange tag. Tiles go 2-across under 1000px of card, 1 under 620px |
| Option 4 devices: *"the bottom legend will align left"* | `.licm4:not(.licm5) .licm4lg{justify-content:flex-start}` — Option 5's stays centred |
| Option 4: *"all card padding is 24px — change to 10px"* | `.lic4:not(.lic5), .licm4:not(.licm5), .licg4 > .licg4c{padding:10px}` — licence, devices and the five add-on cards. Inner tiles and record boxes keep 12/16px |

- ⚠️ **TWO DECLARED DS DIVERGENCES, and the checker sees both.** DS conformance is **96** on Option 2
  (philosophy 80: *"[brand-navy] off-token saturated blue — brand must be --primary navy"*, from
  `--license-accent` #7aa2f7) and **98** on Option 4 (component 94: *"obs-button transparent renders
  off-reference"*, from the hook that gives the toggle the heading's 13px/600 and 0 padding). Both are
  what was asked for. The alternatives, if the score matters more: map the gradient to DS tokens (the
  chart palette has **no blue** — only `--chart-indigo` for the violet end) and/or let the toggle render
  as a stock transparent button (grey 400 text, 15px padding). **10px padding did NOT cost layout** (100).
- ⚠️ **The live palette is scoped tokens, not literals:** `.licx{--license-accent:#7aa2f7;--license-violet:#bb9af7;--license-on-accent:#fff}`, light `#2563eb` / `#7c3aed` — the live product's own names and values (`/css/styles.293200e0.css`), declared once on the card. **White on #7aa2f7 is ~2.4:1** — what the live chip ships; recorded, not fixed. The live chip's **8px radius was not copied** (the 4px rule).
- ⚠️ **A transform does nothing on an inline box** — `obs-icon` is inline by default, so the chevron's
  `rotate(180deg)` measured `matrix(1,0,0,1,0,0)` until it was given `display:inline-flex`.
- ⚠️ **The disclosure hides by class, not `[hidden]`** — `.lic4code` is `display:grid`, which beats the UA's `[hidden]` (the recorded `.stpt` trap).
- ⚠️ **The figure line moved ABOVE the ring row** because beside the ring it centred the ring on
  figure-line-plus-tiles, ~20px higher than the tiles, and started the tiles 60px lower than on the
  add-on cards. **Consequence, stated:** the ring's centre (*170 of 5,000*) repeats the figure line
  directly above it, as the add-on cards' ring repeats their *In use* tile.
- ⚠️ **The stale-node trap in a probe again**: a padding assertion read `''` from the licence card node
  `stMainPaint()` had already replaced. Re-query after any repaint.

**Verified:** a 62-assertion probe (`o24b.py`, scratchpad) in **dark and light** — tab icons gone, gradient
stops per theme, the chip's shadow fill, the hook leaving other tags alone, top alignment, the toggle's
place / type / edge / chevron render and turn, open → one-line code row → repaint keeps it → close, no
term bar, the ring arc at 3.4%, three tiles, the change tile following 15d, the left legend on the type
bar's edge, 10px on all seven cards, and Option 5 unchanged — plus the License probe updated to the new
designs **279/279** · DS conformance **100 × 4 scenes, 96 (Option 2), 98 (Option 4)** · screenshots
Option 2 dark / light, Option 4 dark collapsed / open / light.

#### Option 4 — sixteen more requests on the licence and quota cards (15 Sep 2026, evening)

⚠️ **Where this conflicts with the section above, this is current** — in particular Option 4's *Activation code* is
no longer a transparent button restyled as a heading, the devices card has no figure line, and the add-on pill has no %.

| request | what changed |
|---|---|
| *"the circle small and the same height as the 'In use' card"* | one token, **`--licg4-h:66px`** on `.licg4b`: the tiles take it as `min-height` (content measured 65.4px), the ring as its box — equal by construction. Arc 9 → 8 units, text re-centred. The devices card's ring row is the same row and follows |
| *"'Healthy · 0% used' behind 'Flow Sources'"*, then *"remove the '0% used'"* | the pill sits on the title line right after the name, reusing Option 5's parked **`.licg5tt`** (it already undoes `.licg4t span`), and reads **Healthy / Over limit** only. View history is alone at the header's edge |
| devices card: *"remove '170 of 5,000 used · 3.4%' and '4,830 available'"* | no figure line on Option 4 — header · ring row · type bar. ⚠️ The 3.4% share and the 4,830 available are no longer written on the card (the ring's aria-label keeps the full figures) |
| *"the '170' 26px → 20px semibold"*, then *"2px between '170' and 'of 5,000', and 5,000 as 5k"* | `.licg4rv` 20 viewBox units / 600 (~14px in the 66px ring); the two lines 3 units further apart (≈2px), still centred; totals ≥1,000 go through **`licK`** (5,000 → `5k`, 1,500 → `1.5k`), smaller totals unchanged. Every Option 4 ring shares the class |
| *"Agentless · Agent-based · Last 30 days semibold"* | `.licm4kt b` 600 on Option 4's devices tiles **and** its add-on tiles (one shape); Option 5 keeps 500 |
| *"remove '100% of used' / '0% of used'"* | Option 4's deployment tiles show the figure only; Option 5 keeps the share |
| description *max-width 57ch* (set in devtools) | `.lic4:not(.lic5) .lic4desc{max-width:57ch}` — a cap, so a narrow column still wraps |
| *"change [the Infinity + tag] and improve like [Option 2's]"* | Option 4 renders Option 2's name row: `.licxname` gradient, `.licxinf` accent ∞, the `.licxchip` gradient chip **inline** (`.lic4nr`). The `--license-*` tokens are declared on `.lic4:not(.lic5)` too. ⚠️ `.lic4s obs-tag{align-self:flex-start}` pinned the chip 3px high — `.lic4 .lic4nr obs-tag{align-self:center}` |
| *"11px → 12px medium, 15px semibold, no letter-spacing, sentence case"* | every uppercase label on the licence card (one rule: License type · Issue date · Account · Status · Expires) is 12px/500, `letter-spacing:0`, `text-transform:none` — the markup was already sentence case; values 15px/600. The ring's own DAYS LEFT is SVG text and unchanged |
| *"remove [ObserveOps edition]"* | no eyebrow on Option 4; the name row leads the section (`.lic4nr{margin-top:0}`). Option 5 keeps it |
| *"Activation code as a button with background, no border"* | **`obs-button variant="neutral-lighter"`** — the History buttons' variant (border = fill). ⚠️ **The `:host(.lic4axb)` shadow-root restyle was DELETED**, which also removes the checker's "variant looks overridden" finding |
| *"swap the View history and Last 30 days icons"* | View history wears **`history`** (the clock), the *Last N days* tile **`trending-up`** — add-on cards and the devices card's change tile. Option 5's View history keeps the trend |
| *"Infinity + paragraph + button and the 4 boxes the same height, and the ring block too"* | `.lic4top{align-items:stretch}` (Option 4): the left section is a flex column with the button on its floor (`margin-top:auto` + 12px padding as the floor), the record's rows are `1fr` inside a flex column, the ring leads its column with Expires + date on the floor (8px padding floor). ⚠️ **The ring went 120 → 100px** so its block is not the tallest — otherwise it would set the row and stretch the boxes. DAYS LEFT 8.5 → 10 units. Measured: name / boxes / ring share top 185, button / boxes / date share bottom 344 at 1920. ⚠️ Under the 1080px container query the record drops to its own row, so only the left block and the ring align there |
| *"'August 17, 2030' 16px semibold, 'Expires' medium"* | `.lic4date` 16px/600 on Option 4; Expires is 500 by the label rule |

- ⚠️ **`margin-top:auto` cannot carry a minimum gap** (it resolves to 0 with no free space — the recorded `.aihelpl` trap), so both floors above are padding.
- ⚠️ **Consequence, stated:** the brand-navy conformance finding that Option 2 carries now applies to Option 4 too (the live blue on its name and chip).
- ⚠️ **Probe traps hit again:** a probe running headless Chrome while another used the same `--user-data-dir` returned `NO PROBE OUTPUT` — wait for the first to finish; and three probe failures after the equal-height change were stale expectations (the button 12px under the text, a 120px ring, the pill's "% used"), not regressions.

#### The Settings accent, demo usage, and the last Option 4 batch (15 Sep 2026, night)

⚠️ **Where this conflicts with anything above, this is current** — in particular **the Settings module is no longer
teal** (the 8 Sep "the accent is teal across the whole DS scope" note), the add-ons no longer carry the live 0 / 0 / 1 / 0 / 2
figures, and APM's split row on Option 4 has no rule above it.

| request | what changed |
|---|---|
| *"in the setting module replace #14b8a6 with #CAD3E2"* | ONE token override on every root the module renders into — `#view-settings`, `.stcmenu`, `#stcDr`, `#stcCf`, `#drawer-agcfg` — sets `--teal` / `--teal-dim` to **#cad3e2 dark / #1d2a3e light**, plus `--st-accent-h` (hover) and `--st-on-accent` (the ink on the fill, replacing the teal-only `#04211d`). The DS scope's `--primary` reads **`var(--primary-alt)`**, which is that exact pair, so no hex is pasted there; the primary-button hover now mixes toward the page background (in dark `--page-text-color` IS #cad3e2, so mixing toward it did nothing). ⚠️ **Light is #1d2a3e, not #cad3e2** — #cad3e2 on white is 1.4:1. ⚠️ **Scoped to the module**: the rail, dashboard and Log Explorer keep their teal, and each page's `:root` `--teal` is untouched. The DS *chart-palette* tokens that happen to equal #14b8a6 (`--chart-vivid-teal`, `--bar-chart-color` …) are series colours, not the accent, and were left |
| *"add demo data — Log will show 10 of 100 — in every card"* | the five add-ons in `LIC_DATA.quotas` are **`used:10`** (Flow · Log · NCCM of 100, APM of 52, RUM of 50) and APM's monolith split is **10 of 52** so the split still sums. ⚠️ **Shared data** — every option's cards, Option 1's grid and the History drawer/modal show it. Totals, deltas and Monitored Devices (170 of 5,000) are still the live figures |
| Option 4: *"the spacing like this screenshot"* (Image #150) | the licence card's three sections are **`minmax(0,1.2fr) minmax(0,1fr) 184px`** with no padding between them, so the record boxes start ~48% across and the ring column sits snug at the right. ⚠️ **Inside `@container (width > 1080px)`** — bare, the (0,3,0) rules outranked the stacked layout's (0,1,0) rules in the 1080px query and a 929px card (the 1280 viewport) got three columns with the record spilling under them |
| Option 4: *"stroke-width 8"* on the licence ring | `.lic4:not(.lic5) .licring circle{stroke-width:8}` — **8 viewBox units, ~6.3px** at the ring's 100px (8px on screen would be 10.24 units, i.e. the original 10) |
| Option 4: *"change the 'In use' icon"* | the five add-on *In use* tiles wear **`utilization`** instead of `q.icon`, which repeated the card header's glyph 40px above. Render-checked: `gauge` / `usage` / `activity` / `meter` do not exist in the bundle; `utilization`, `tacho-meter`, `pie-chart` do |
| Option 4: *"remove the dot in the health tag"* and *"in the Status card"* | the add-on *Healthy* pills and the licence card's *Status* tag carry no `.licovdot`. Option 5 renders the same markup and keeps both dots (`v === '5'`) |
| Option 4: *"all card border colour #172336"* | licence, devices and the five add-on cards take **`--widget-border-color`** — the DS widget-border token, #172336 dark / #e3e8f2 light (the value light already had), so light is unchanged |
| Option 4: *"remove [Upgrade Now] top right"* | `licHeadHTML` omits the header's primary on `LIC.opt === '4'`. Nothing is stranded: the licence card's own **Upgrade Now** opens the same Activation Code modal. Options 1, 2 and 5 keep it |
| Option 4: *"remove the horizontal line and the gap"* above APM's split, then *"add 8px space"*, then *"8px — use 12px"* | no `obs-divider`, and `.licg4 > .licg4c > .licg4s{margin-top:-4px}` trims the card's 16px flex gap, so the legend sits **12px** under the tiles (it was 0, then 8) |
| Option 4: *"a different colour for Applications and Agents"* | the swatches are **the card's amber** and **`--chart-aqua`**, the palette's farthest hue from it. ⚠️ Aqua is also the RUM card's tone directly below |
| (open item from earlier) the "Last N days" sparkline clipping at 1280 | the chart gives way, not the label: `.licm4kt` is `flex:0 0 auto`, the chart `flex:1 1 120px; max-width:120px; min-width:0`, and **under a 300px tile it is not drawn** (`@container licm4k (max-width:300px)`, a NAMED container set only on tiles that carry a chart, so no other query in the card can answer to it). At 1280 the add-on tiles are 264px and show no chart; the devices tile (403px) keeps it |
| Option 4: *"change 'View history' to 'History'"* | the five add-on buttons read **History**, like the devices card's. Option 5's footer button keeps *View history* |
| *"swap the 'Upgradation code' & 'New license code'"* (the Activation Code dialog, every option) | the paste box and its hint lead, the current code + Copy + the email sentence follow. ⚠️ **The sentence was rewritten with the move** — *"Please email **this** activation code … paste it **above** to activate"* — left as it was it pointed the wrong way. `.licact` is one 12px grid gap, so nothing depended on the order. This diverges from live, which puts the current code first |
| Option 4: *"duplicate the [RUM] card, remove the icon, use [the ring] in the icon position"*, then *"this card will be move in option 5"* | ⚠️ **IT LIVES ON OPTION 5 NOW; Option 4 is back to five add-on cards.** `lic4AddonHTML(q, '4', 'ring')` (class **`.licg4rh`**) puts the 66px ring where the header's icon tile was and the three tiles span the row; **`lic5RumRingHTML()`** renders it in its own one-column `.licg4` under Option 5's two-across grid. It was moved as it was — Option 4's border, 10px padding, *History* label and '-rh' sparkline id — so on Option 5 it is the one bordered card among borderless ones. A second design for one entitlement, not a second licence: same data, same History modal |
| *"the Option 5 'EPS Trend Breakdown' tab — all data, copy and add in Option 4"* | **`LIC_EPS5 = ['4','5']`** — one list read by the EPS slot AND by `licAfter`'s Highcharts mount, so an option cannot get the markup without its charts. It is the same `lic5EpsHTML` builder, so the two tabs cannot drift. Options 1 and 2 keep `licEpsHTML` |
| Option 4's EPS trend cards: *"remove the title box colour … and add top right [Last 24 hours · avg · peak · util]"* | no swatch before the title, and a **`.lice5ktg` row of four `obs-tag variant="tag-primary"`** on the title line at the card's right edge — Option 1's EPS tile tags verbatim. Keyed on `LIC.opt === '4'` inside `lic5TrendCard`, so Option 5 keeps its swatch and no tags. ⚠️ **The avg / peak / util row under each chart was NOT removed** (the request said add), so on Option 4 those figures now appear twice per card |
| Option 4's EPS trend cards: *"remove [the avg / peak / util row] and add [a] 24 hour time range"* | the footer row is gone (the top-right tags carry the same figures) and the chart gains a **time axis**: Highcharts `xAxis` labels `HH:00` every 4h (every 2h on the full-width Total card), in `--neutral-light` 11px; the chart went 96 → **118px**. The SVG fallback carries the same hours as an HTML row (`lic5TimeAxis`), because its SVG stretches. `t.o4` is stamped on the stored model by `lic5TrendCard`, so the mount reads the option the card was painted for |
| Option 4: *"show the ingested line on [the] timeline"* — asked; the answer was **a visible axis along the chart floor with a tick at each label** | `xAxis` `lineWidth:1`, `tickLength:5` in **`--field-border-color`** (#2b394f dark / #e3e8f2 light). ⚠️ **Not the DS fixture's `--bottom-line-color`** — #172336 in dark is ~1.1:1 on the #0B1627 card, so the timeline would not show. Option 5's axis stays bare |
| Option 4's allocation card: *"remove the legend box, the colour will show in the progress bar"* | no swatch before Log / Flow / APM / RUM; each bar's **ingested fill is its signal's tone** (Option 5 keeps `--info-text`). ⚠️ The legend's *ingested* key became a **four-tone split swatch**, or it would still say ingested is blue. ⚠️ APM's amber fill now sits beside the yellow allocation marker — still distinct, but closer |
| Option 4's EPS tab: *"add the card border like the License & Quota Usage tab, and apply [its] card padding"* | `.lice5.lice5o4 .lice5c` — every EPS card (four stat cards, the allocation card, five trend cards) takes the usage cards' **1px `--widget-border-color`, 10px padding and `--common-widget-bg` fill**, so the two tabs match in both themes. The Drop policy banner is not a card and is unchanged. Option 5 keeps its borderless 16 / 24px cards |
| Option 4's EPS stat cards: *"the title text small, first letter capital"* | `.lice5.lice5o4 .lice5l{text-transform:none;letter-spacing:0}` — *Hardware ceiling · Allocated · Ingested live · Drop status*; the markup was already sentence case. Size and weight unchanged. ⚠️ The Total trend card's *TOTAL · ALL TELEMETRY* is a different label and is still uppercase |

- ⚠️ **SECTION TITLES SAT ~8px BELOW THE TEXT BESIDE THEM, on every option (fixed 16 Sep 2026)** — reported on Option 4's
  *Dynamic EPS · allocation by signal* vs *allocated vs live ingested · over-quota shaded*. The cause was
  `.lictabs [slot]{padding-top:16px}`: meant for the two tab PANES, but as a bare descendant selector it also matched every
  `obs-toolbar` title carrying `slot="start"` inside them, and obs-toolbar centres a 36px padded span against a 17px hint.
  It is `.lictabs > obs-tabs > [slot]` now, so it reaches the panes only — which also straightens *License & Quota Usage* and
  *Calculated vs actual EPS* on Options 1, 2, 4 and 5. Consequence: each of those heads is ~16px shorter, so what follows it
  moves up that much. Probed: every head's two sides share a centre line (±1.5px) on all four options, both panes keep 16px.
- **Option 4's name gradient is darker in dark theme** (request, 16 Sep 2026: *"make this gradient colour darker"*) — the
  *Infinity* text, the ∞ and the *Unified edition* chip all read `--license-accent` / `--license-violet`, now **#306ef3 /
  #8c55f1** on `.lic4:not(.lic5)` (the same two hues, 15 points darker). Name contrast on the card 4.01 / 4.04 (3:1 is the bar
  at that size); white on the chip rises from ~2.4:1 to ~4.5:1. **Option 2 keeps #7aa2f7 / #bb9af7; light theme keeps
  #2563eb / #7c3aed** on both.
- **Option 4's allocation card has 14px between its title row and the Log row** (request, 16 Sep 2026 — asked as 10px, then
  14px) — the toolbar's `margin-bottom:10px` on top of the card's 4px flex gap. ⚠️ `.lice5a{gap:16px}` has never applied: `.lice5c{gap:4px}` sits
  later in the sheet at the same weight, so every EPS card (Option 5's too) runs on 4px. Option 5 was left at 4px.
- ⚠️ **The DS checker scores Option 4 at 96 now (philosophy 80)** — one element: the ∞ glyph in `--license-accent` #7aa2f7, the same declared "brand-navy" divergence Option 2 carries. Component went back to 100 when the Activation code hook was deleted.
- ⚠️ **Probe traps hit this round:** a `setTimeout` callback that throws is OUTSIDE the probe's try, so the run printed `NO PROBE OUTPUT` and looked like a broken page — wrap the timer body too. And writing `\x60` from Python into PART 1 produced a real backtick that ended the CSS template literal; `node --check` named it at once.
- ⚠️ **Stale probes, not regressions:** `o24b` / `opt24probe` / `m5`–`m8` still assert the pre-15-Sep designs (the toggle's left edge, "170 of 5,000", bordered record fields, the ring's tone on tile glyphs) and now also the old add-on figures (NCCM 1%, Flow 0). `stbehave` **21/21 × 13 pages** and conformance **100 × 4 scenes, 96 × 2** after this batch.

### `_verify/licconf.py` — the License analogue of `dsconf.py`

Same isolation trick, pointed at `#licPage`, with six scenes (both tabs, plus Options 2, 4 and 5 and Option 5's EPS tab — Option 3's scene went with Option 3) — **100/100 on all six** after the
14 Sep cards; since the later 15 Sep batch **96 on Option 2 and 98 on Option 4**, both from declared divergences (see above). ⚠️ **The scoped token
block's selector still starts `#agPage`**, so a blanket rename of the script breaks its regexes —
the isolation target and the token selector are different strings.

### Verification

DS conformance **100/100 × 2 scenes** · a 31-assertion License probe (the three cards' components,
the Edition name surviving as a key-value row, the mailto still clickable, the drawer opening on
`<body>`, its ✕ closing it, the observer clearing state, re-opening, one element only) ·
`stbehave` **ALL 21 PASS × 13 pages** · cards and drawer screenshotted in **dark and light**.

⚠️ **Two verification traps hit in this pass:** the backtick escape in PART 1 of `setting.js` bit
**twice more** while writing these very notes (`node --check` named the line each time); and a
shared `--user-data-dir` carried `setTheme('light')` into the next scene through localStorage, so
both "dark" screenshots came out light — **give each themed scene its own Chrome profile.**

## Settings › Agentic AI — Option 1 / Option 2 (16 Sep 2026)

Request: *"create option 2 — the current is option 1 — copy option 1 and paste it in option 2"*, then a run of Option 2
changes the same day. A switcher (`AG.opt`, `AG_OPTS`, `obs-radio#agOpt as-button` in the page header's action slot, bound by
`agOvAfter` — the `after` hook is back) picks between them; it is review chrome, like the License page's. **Option 1 is
untouched and is still the default.**

⚠️ **OPTION 2 IS A COPY BY CONSTRUCTION, NOT BY PASTED CODE.** Both options render through the same builders; Option 2
differs only where a builder branches on `AG.opt === '2'`. Pasting ~500 lines of `ag*` a second time would collide on every
function name in this flat scope. `#agPage` carries `data-agopt` for CSS scoping.

| Option 2 | what |
|---|---|
| overview | **no grid and no search** (the search filtered the grid) — `agConnHTML()`: one `.agpanel` about the **connected** provider only — its glyph tile, name, **Connected** tag and tagline; an `obs-key-value columns="3"` of Connection name · Default model · Endpoint · API key (masked to the last four) · Availability · Last usage; and the three 14-day trend widgets (`agUseWidgetsHTML()`, extracted from the grid's expanded row so both options draw the same charts). Nothing connected → one plain line, no figures |
| Configure drawer | a **684px side panel** (the product's form-drawer width; `agCfgSize`, `#drawer-agcfg.agcfgo2`) with the footer on its floor — **no provider rail, no help card, no Advanced settings, no Model selection, no data-sharing terms**. Top to bottom: **AI provider** as a segmented `obs-radio#agCfgProv as-button` · Enter credentials (name, API key) · **one terms checkbox** (`agTermsHTML`: *"I have read and agree to the Terms & Conditions and the <provider> privacy policy, and allow ObserveOps to send selected observability data to <provider>"*, two `obs-link`s) · the test output · footer (KMS caption · Run test · **Enable AI**) |
| gate | **Enable AI needs a passing test AND the terms box** (`d.terms`, seeded true for the connected provider). It says *Enable*, not *Accept*, because the four consent terms are not on this form |
| done summary | Provider · Default model · Connection status · **Terms & conditions: Accepted** (no routing / consent rows) |

- ⚠️ **`obs-metric-list` WAS TRIED IN THE PANEL AND REMOVED** — it renders one figure per ROW (its registry's vertical-value
  layout), and three of its four figures were already the trend widgets' headlines. Availability moved into the key-value.
- ⚠️ **THE DRAWER BODY IS BUILT FOR ONE OPTION.** `agCfgPaint` repaints only `#agCfgMain` once `#agCfgBody` exists, so a
  drawer first opened on Option 2 and reopened on Option 1 kept Option 2's frame (no rail, no help). `agConfig` now clears a
  body whose `data-agopt` differs, which sends the paint down its full-build branch. Found by the probe, not by eye.
- ⚠️ **The terms text is a SIBLING of `obs-checkbox`, not its label** — a link inside the component's `<label>` would tick
  the box when clicked. Ticking repaints the footer only (the `agCfgConsent` discipline).
- ⚠️ **The picker lives inside `#agCfgMain`**, so every pane paint rebuilds it: `agCfgBind` rebinds its `change` and sets
  its `value` PROPERTY as a string (the recorded `licRadioSync` lesson).
- ⚠️ **A default-size segmented control, three words** — no icons: `obs-radio` takes `{value,label}` only.
- Verified: a 20-assertion probe (overview panel, 684px drawer, every removed section absent, picker at the top switching
  provider by a real click, terms box below the fields with two links, the two-part gate, the done summary, reopening on
  Option 1 restoring the rail and help card) · dark and light screenshots.

#### Option 2's form — one rhythm, one link, a plainer footer (16 Sep 2026)

Four narrow requests, all Option 2's Configure drawer. ⚠️ **Where they conflict with the section above, this is current** —
in particular the terms line's two links and the footer's KMS caption are both gone.

| request | what changed |
|---|---|
| *"make proper alignment"*, with the product's own **Create Credential Profile** / **Schedule Topology** drawers as the reference | one rhythm: **7px label→control on every row** — `obs-input`'s own number, which page CSS cannot change, so `.agfprov` matches it rather than the other way round — and **24px between rows** (`@padding-lg`, the step those drawers use), where the form ran on its 16px step. The heading's helper line still hugs it at 4px. Measured before: the provider row sat at 6px against the inputs' 7, and the rows ran 16 / 4 / 16 / 16 |
| *"you have 2 links, make it a single link and improve the text"* | `agTermsHTML` carries **one** `obs-link` — the Terms & Conditions — and the provider's privacy policy is no longer on this form. ⚠️ **Stated, not hidden:** that link is gone from the drawer entirely; Option 1's four-term consent panel still carries its own |
| *"the link will be shown in last"* | the sentence was rewritten so the link **ends** it: *"I agree to sending selected observability data to OpenAI under the Terms & Conditions."* It fits on one line at 684px, which is what lets the checkbox align to its own text |
| *"remove the [KMS] text, and the Enable AI button will remove the icon and change the name to Save"* | the footer is **spacer · Run test · Save**. The caption went because Option 2's form already says it — *"Your key is encrypted server-side and never shown again in full"* sits under the Enter credentials heading, so the footer was repeating it under a button. The primary lost its `shield-check` and reads **Save**: the shield said "this is about security", which is the terms line's job two rows up, and *Enable AI* named a capability where the effect is to store this connection |

- ⚠️ **THE EMPTY `.sp` SPAN STAYS** — `.agff .sp{margin-right:auto}` is what pushes the buttons to the right edge, and
  dropping the span with its text slides them into the middle of the footer. The recorded lesson, avoided rather than hit.
- ⚠️ **THE CHECKBOX IS CENTRED ON ITS FIRST TEXT LINE, not on the row.** `obs-checkbox` renders a 24px box against a 19px
  line, so `flex-start` alone left the tick sitting low, and `align-items:center` would centre it across BOTH lines if the
  text ever wraps. It is `flex-start` with a measured `-2px`.
- ⚠️ **Option 1 is untouched by all four** — it keeps the KMS caption, *Accept & enable AI* with its shield, its 16px row
  step and its own consent panel. Each request named Option 2's screen, and there are probe assertions for all four.
- ⚠️ **`agSeed` DELIBERATELY ARRIVES UNTESTED**, so Save is disabled on open until Run test passes — a probe asserting the
  button is enabled at rest fails on correct code (it did). The recorded 2 Sep decision; read it before "fixing" the gate.
- ⚠️ **`agIc` renders an `<obs-icon>`, not a bare `<svg>`** — a probe checking a button's glyph with `querySelector('svg')`
  reports "no icon" on a button that has one, and passes trivially on one that does not.
- Verified: a **26-assertion** probe (one link reading Terms & Conditions and ending the sentence, no privacy link, the
  text on one line, the box centred on it; the label→control gap equal to obs-input's own, every row 24px apart, one left
  edge, equal input columns; no KMS caption with the spacer kept, *Save* with no glyph beside Run test, the buttons still
  at the right edge, the gate disabled → enabled on a passing test → disabled again when the terms are unticked; and
  Option 1 still carrying its caption, its shield, its rail and its help card) · `stbehave` **ALL 21 PASS × 13 pages** ·
  dark and light screenshots.

#### The same evening — a barer form, a 16px inset, and the grid back as two columns (16 Sep 2026)

Five more requests on Option 2, in order. ⚠️ **Where they conflict with anything above, this is current.**

| request | what changed |
|---|---|
| *"remove the line upper side [the] save button"* | `#drawer-agcfg.agcfgo2 .agff{border-top:0}`. **The 16px padding stays** — the border is what was asked for, and taking the space with it jams Save against the row above. The footer still sits on the drawer's floor, which is what separates it |
| *"remove this"*, pointing at **Enter credentials** and *"Connecting OpenAI. Your key is encrypted server-side…"* | `agStepCreds` emits the heading and the helper line for Option 1 only. On a form of three things — pick a provider, name it, paste a key — a section heading names a section with no sibling to be told apart from, and the sentence restated the provider already selected in the segmented control directly above it |
| *"the sidebar padding is 24px → 16px"* | `#drawer-agcfg.agcfgo2 .agcfgm{padding:16px 16px 56px}`. **Measured first**: the drawer's own header is padded `14px 16px`, so the form had been inset 8px further than the title above it — 16 puts every field on the header title's own left edge (probed, ±1.5px). ⚠️ **The 56px bottom is untouched**: it is not spacing, it holds the pinned footer clear of the fixed variant-switcher pill |
| *"the AI provider field margin is 24px → 0px"* | `#drawer-agcfg.agcfgo2 .agfbody > :first-child{margin-top:0}`. ⚠️ **It needs the id.** `.agfbody > :first-child{margin-top:0}` already existed at (0,2,0) and **lost** to this block's own `#drawer-agcfg.agcfgo2 .agfbody > *` at (1,2,0) — which is why the picker carried 24px at all. The zero has to be written at the same weight |
| *"remove [the connection panel] and show the grid — 2 columns: 1. AI provider  2. Status (up/down)"* | **`AG_GRID_COLS` / `agGridRows` / `agGridHTML`** — an `obs-table` of two columns, one row per provider, the status as a `status` cell |

- ⚠️ **THE GRID REVERSES THE MORNING'S "remove the grid", AND DELIBERATELY — BUT IT IS NOT THE SAME GRID.**
  What went was six columns of usage figures on three rows, two of them em dashes; what came back is the two the
  request names. **Do not restore the six-column table on the strength of the older note, and do not restore the
  panel on the strength of this one.** `agConnHTML` is kept and unreferenced, the house pattern — one call away.
  ⚠️ **`agUseWidgetsHTML` is NOT unreferenced**: Option 1's expanded row still draws the same three charts.
- ⚠️ **"DOWN" MEANS NOT CONNECTED HERE, and that is a reading rather than the product's word.** Only one provider is
  active at a time, so the other two are unconfigured rather than unreachable. `up` / `down` are what was asked for and
  are real keys in the DS status map (`up:tag-green`, `down:tag-red`, read out of the bundle, and the cell prints the
  map's own words — *Up* / *Down*). A third *Not configured* state would be more honest and is one line in `agGridRows`.
- ⚠️ **THE STATUS MAP IS APPLIED AS A CLASS INSIDE THE TAG'S OWN SHADOW ROOT, NOT AS THE HOST'S `variant`.** A probe
  reading `variant` reports **`tag-primary` on every row** and fails on correct code (it did). Read the painted
  `.tag` element's class and computed colour — the recorded "measure the shadow box, not the host" lesson.
- ⚠️ **NO SEARCH BOX came back with the grid.** It went with the six-column one and was not asked back; three rows do
  not need it, and the toolbar's own note records that a search over nothing is a dead control.
- ⚠️ **CONSEQUENCE, STATED:** with the helper line gone AND the KMS caption removed an hour earlier, **Option 2's drawer
  now says nothing at all about where the key goes.** Option 1 carries both. One line each if either should come back.
- ⚠️ **The backtick trap bit again**, writing the footer-rule comment into PART 1 — `node --check` named the line in a
  second. Every backtick in PART 1 is `` \` ``.

#### The Status column: one Active provider, Config on the rest (16 Sep 2026)

Request: *"the status column will be convert — I have 3 AI providers but at a time I use a single provider;
when I switch to another the old AI provider will be removed … the column will show the active status and
another show a Config button."* ⚠️ **This replaces the Up / Down reading from earlier the same day**, and it
is a better one: nothing was ever *down* — the other two are simply not configured, which is exactly the
honest third state the Up/Down note flagged. The button says so and offers the way to change it in the
same cell.

| | |
|---|---|
| the connected provider | an **Active** tag (`tags` cell, `tag-green`) |
| the other two | a **Config** button that opens the drawer **on themselves** (`agConfig(d.id)`) |
| connecting a new one | wipes the previous provider's draft — name, key, terms, test — so its row really becomes a Config button rather than a provider that quietly kept your key |

- ⚠️ **IT IS ONE COLUMN, CALLED `Connection`** (request, same day: *"it will be show in same column and the
  column name you suggest"* — an earlier build put the tag and the button in two adjacent columns). The name
  is mine: it is not a *Status* column any more, since one cell says which provider **is** the connection and
  the other two offer to make one. *Action* would name only half of it.
- ⚠️ **ONE COLUMN MEANS ONE CELL TYPE, SO THE TAG IS A BUTTON IN DISGUISE — a stated compromise.**
  `obs-table`'s cell types are `heat / bar / severity / dot / status / type / tags / sparkline / switch /
  icon / link / button`; there is **no `html`**. So the column is `button` throughout, and the connected
  row's cell is painted as the DS's own green tag and made inert (`pointer-events:none`, `cursor:default`).
  It is still a `<button>` element underneath.
- ⚠️ **THE PAINT MUST GO ON THE INNER `.btn`, NOT THE HOST — that is what "the Active will be overlap" was.**
  obs-button renders `<button class="btn v-agactive s-small">` inside its **own** shadow root, and that
  element carries the variant's background, border and min-height; a rule on the host from `obs-table`'s
  sheet drew a green box *around* a default-styled button and both were visible. The rule lives in an
  `obs-button` entry of the same hook, as `:host([variant="agactive"]) .btn`.
- ⚠️ **`variant="agactive"` IS A NAME OF OURS**, not a DS variant — obs-button reflects whatever it is given
  onto the host (probed), so the selector cannot reach any other button in the module.
- ⚠️ **The button reads `Configure`, not `Config`** (request, same day).
- ⚠️ **THE HEADER HAS NO FILL — it is `header-style="default"` with a top rule added** (request, same day:
  *"remove the background colour and show top and bottom border"*, with the product's own monitor grid as
  the reference). The DS's default header **is** that treatment: `.grid.hs-default th` is
  `background:transparent` with a `border-bottom`, in uppercase 600 — which is what the reference shows
  too. Only the TOP rule was added, in the sheet the corner-radius hook adopts into `obs-table`.
  ⚠️ **IT IS SCOPED BY A HOST CLASS (`:host(.aggridt)`), NOT A BARE `th`** — that sheet is shared by every
  `obs-table` in the module, the License quota grid and its nested breakdown included.
  ⚠️ **`hs-tinted` ONLY EVER PAINTS ON A STICKY TABLE**: the bundle's single rule is
  `.box.sticky .grid.hs-tinted thead th`, and this grid's box is not sticky (probed). So the tint it used
  to ask for was never the DS's — worth knowing before "restoring" it.
  ⚠️ **`header-style` IS REFLECTED EVEN WHEN UNSET** — `#licTable` sets none in markup and its host still
  reads `default`, which cost three tries at one probe assertion.
- ⚠️ **AN EMPTY CELL IS NOT BLANK, measured before the column was merged**: an empty `status` cell still
  paints a blank grey chip and an empty `button` cell paints a **16×24 empty button** (Chrome's `:empty`
  does match it — its two child nodes are empty text anchors). `tags` with `[]` is the only one of the three
  that renders nothing. That is why the two-column build needed a hide rule, and why the merged one does not.
- ⚠️ **`cellaction` IS A CUSTOM EVENT**, so `oncellaction=` in markup is inert — `agGridBind()` binds it with
  `addEventListener` from `agOvAfter`, on every repaint, because the table is rebuilt each time.
- ⚠️ **THE WIPE RUNS BEFORE `AG.conn` MOVES**, or it would clear the provider just connected.
- ⚠️ **A PROBE MUST READ THE CELL, NOT obs-tag's SHADOW `.tag`** — the label is *slotted* from the tag's light
  DOM, so the shadow element's `textContent` is empty and two assertions failed on a correct grid.
- ⚠️ **UNRESOLVED, and worth asking about:** the request's *"this not will be show in sidebar on before all
  field"* could not be parsed with any confidence. Nothing was built for it. The two readings that seem
  plausible — the removed provider's details disappearing (already true: the grid is the only place details
  live on Option 2) and something about the Configure drawer's provider picker — differ materially.
#### The drawer states the one-at-a-time rule before you fill it in (16 Sep 2026)

Request: *"show the message — at a time I config a single AI provider, and when I config another the old AI
provider will remove — show as a note"*, under the fields. `agStepCreds` emits an
**`obs-banner variant="info"` titled *One provider at a time*** between the fields and the terms line,
Option 2 only.

- ⚠️ **IT NAMES THE PROVIDER IT WOULD REPLACE** — *"Saving this connection replaces **OpenAI** — its
  connection is removed and its key is not kept."* A generic sentence would not tell you which key you are
  about to lose. Re-configuring the provider that is **already** active replaces nothing, so that case gets
  the plain rule instead and names nobody.
- ⚠️ **IT IS BELOW THE TERMS LINE, NOT UNDER THE FIELDS** (request, same day: *"swap this"*). The form now
  reads: what you are connecting → what you agree to → what it costs you. That is also why the note has its
  own builder rather than living inside `agStepCreds`: the form's ORDER belongs in `agCfgFormHTML`'s one
  line, not in two places.
- ⚠️ **THE SAME NOTE STANDS ON THE OVERVIEW** (request, same day: *"this message will be show by default
  [on] the main screen"*), between the toolbar and the grid — the rule is a property of the screen, and it
  is the sentence that explains why two of the three rows only offer a button. **One builder, three
  sentences** (`agOneNoteHTML(where)`): on the form it names the provider you are about to lose, on the
  overview the one you already have, and with nothing connected both fall back to the plain rule — a second
  copy on the page would be where the two disagree.
- ⚠️ **`.agpage > .agnote` NEEDS ITS OWN 16px.** It is a direct child of `.agpage`, which has no gap of its
  own, so it sat flush against the toolbar (measured 0px); the table's own `margin-top:16px` is the step it
  now matches. Inside the drawer the same banner is spaced by `.agfbody > *`, so the rule is page-scoped.
- ⚠️ The rule it states is the one `agCfgSave` enforces, which is why it belongs on the form rather than in a
  toast afterwards. `title` carries the lead-in and the detail goes in the slot — obs-banner's own `do` rule.
- ⚠️ **`const note` WAS ALREADY TAKEN** in `agStepCreds` (the test panel's) — `node --check` named it in a
  second. The collision trap this file opens with, in a four-line function.
- Verified by a **17-assertion** probe: the chip is one box at 22px with no border, inside its row and still
  green; both other rows read *Configure*; the banner renders **below** the terms line and above the test
  output, spans the form, names OpenAI when another provider is active, and states the plain rule when it is
  not — plus an **11-assertion** probe for the overview copy (between the toolbar and the grid, painted and
  spaced 16px from both, full width, naming the connected provider, the nothing-connected sentence, and
  Option 1 growing no note at all).

- Verified by a **19-assertion** probe driven through the real buttons: two columns, OpenAI *Active* painted
  green and inert with the others offering *Configure* in the same column on one left edge, no *Up* / *Down*
  text anywhere, DeepSeek's Configure opening the drawer on DeepSeek, Save closing it, the old provider's
  name / key / terms / test all cleared, the Active chip moving to DeepSeek with OpenAI now offering
  Configure, exactly one Active row throughout, and re-opening OpenAI showing an empty form.

#### Save commits and closes; the done step is Option 1's only (16 Sep 2026)

Request: *"when I click Save [it shows the Setup completed page] — remove it; when I click Save, show the
main grid screen before."* `agCfgDone` returns `agCfgSave()` on Option 2 instead of stepping to `step 3`.

- **Why the step earns its place on Option 1 and not here.** It is a wizard ending: it recaps Provider /
  Default model / Connection status / Terms, then asks for *Start using AI features* to actually commit.
  Option 1's form carries model routing and four consent terms, so a recap before committing is worth the
  press — and that step is where its own primary has always led. Option 2 is three fields and a button that
  already says **Save**; the recap was a second commit for one decision, and every fact in it is on the grid
  it hands you back to. ⚠️ **`agStepDone` is NOT unreferenced** — Option 1 still renders it.
- ⚠️ **`agCfgSave` WAS CALLING `stFullClose`, AND THAT WAS A LIVE BUG ON BOTH OPTIONS.** This screen was a
  full page until 2 Sep 2026 and has been a drawer ever since; `stFullClose` returns early unless `ST.full`
  is set, so the final button committed the connection and **left the drawer standing open over the page it
  had just changed**. It is `agCfgClose` now — panel, scrim, body class, and a repaint so the Overview shows
  the new state. Found by writing the probe for the request above, not by looking.
- Verified by a **13-assertion** probe driven through the real buttons (the inner `<button>` inside each
  `obs-button`'s shadow root): Save closes the drawer and its scrim, never reaches step 3, commits the
  provider, lands back on the grid with the new provider reading *Up* and the rest *Down* — and Option 1
  still steps to the done screen, still holds the commit until *Start using AI features*, and now closes on it.

- Verified: the 26-assertion drawer probe grew to **37** (the heading and helper line absent, the picker leading the
  form, the fields the second row, no rule above the buttons with the padding kept, the 16px inset with the 56px
  clearance intact, the fields on the header title's left edge, the first row flush at the top) and a **19-assertion**
  grid probe (two columns titled *AI provider* / *Status*, three rows naming the providers, *Up* green on the connected
  one and *Down* red on the other two, no panel, no charts, no search, not expandable — and Option 1 still carrying its
  six-column table, its search box and its expand chevron). Both **ALL PASS** · dark and light screenshots.

## Every box in the Settings module has 4px corners (14 Sep 2026)

Request: *"in all option of setting module we need to change the all box radius will be apply
4px"*. It is `setting.js`, so it reaches **all thirteen pages and every License option** at once.
**Measured before and after**, not grepped: a probe walks every painted box on each Settings
screen — light DOM **and every component shadow root** — and lists any corner that is not 4px.

**What changed in PART 1** (the module's own CSS): the collapsed category tile (8px), the info
button (6px), the count pill (11px), the pager button (2px), both checkboxes (3px), the group tag
and the chip ✕ (10px), the textarea and the confirm box (8px), inline `code` (3px), the control
box (6px), the License widget body and its inline twin in the Agentic AI trend tiles
(`0 0 6px 6px`), and the scoped DS token `--widget-border-radius` 7px → 4px.

**What changed inside the design system** — an `attachShadow` hook near the top of PART 2:

| component | was | why it mattered |
|---|---|---|
| `obs-toolbar` widget header | `6px 6px 0 0` | the top of every widget frame; with the body at 4px the two halves would disagree |
| `obs-modal` | 16px (confirm 20px) | the Activation Code dialog |
| `obs-banner` | 6px | the metering rule in an expanded quota row, the consent warning |
| `obs-tag` with a `status` | 10px pill | the Healthy / Active pills — now the same shape as a plain tag beside them |
| `obs-checkbox` | 3px | the consent checkboxes |
| `obs-select` menus, `obs-menu`, `obs-key-value` card, `obs-severity` chip, `obs-table` pager | 6–11px / 2px | reachable from the components Settings renders |

- ⚠️ **NO `obs-*` CORNER IS A TOKEN AND NONE IS A `::part`.** They are literals in each
  component's shadow CSS (read out of `_ds/`), so page CSS cannot reach them. Each shadow root
  **adopts one small sheet keyed by its tag**, added inside `Element.prototype.attachShadow` —
  which the bundle's custom-element base class calls once per instance in its constructor.
- ⚠️ **AN ADOPTED SHEET IS ORDERED AFTER A SHADOW ROOT'S OWN `<style>`s**, so each rule wins its
  tie with the component's without `!important`, whenever the component writes its styles. Nested
  elements (an `obs-tag` inside an `obs-table` cell, a banner inside a detail row) go through the
  same constructor and are covered too — the probe checks both.
- ⚠️ **SCOPED BY CONSTRUCTION.** `obs-*` elements are rendered by the Settings module and nothing
  else; each page carries a single `obs-icon`, which has no entry in the map.
- ⚠️ **RE-CHECK IF `_ds/` IS UPGRADED.** The map uses v0.1.166's class names (`.tb.v-widget`,
  `.rounded`, `.bn`, `.box` …); a renamed class stops matching silently and the corner goes back.
- ⚠️ **`--widget-border-radius` is read by NOTHING** — not the bundle, not `setting.js`. It was
  moved to 4px so the token block does not claim 7px, not because it drew anything.

**Kept round on purpose, and asserted as such:** circles (the profile avatar, radio marks, status
dots, step markers), the two **switch tracks** (`.stsw` and `obs-switch`), and marks too small to
read as boxes — 3px severity bars, 8–10px legend swatches, 6px table bar cells, the 2px `rx` on
chart columns. Deliberate 0 radii (the underlined input, a nested group) stay 0. The one remaining
off-4px corner the walker finds is `obs-drawer`'s footer (`border-bottom-left-radius:15px`), which
is painted in the drawer's own colour and draws nothing.

**Verified:** a 39-assertion probe (`radcheck.py`, session scratch dir) over My Profile, the
collapsed list, License Options 1 · 2 · 4 · 5 with a row expanded and both tabs, the History
drawer, the Activation Code modal, Compliance Policy with its create drawer, Benchmark, Rules,
Agentic AI and Configure AI provider with its model dropdown **open** — no painted box off 4px on
any of them, plus the kept exceptions and one hook installed.

## The sidebar UX pass — UX Planet's twelve rules, applied to every option (7 Sep 2026)

Request: *"read all rules and improve the all sidebar option"*, with
<https://uxplanet.org/best-ux-practices-for-designing-a-sidebar-9174ee0ecaa2> (D. Sergushkin,
Dec 2024). Medium blocks both the fetch tool and `curl` (Cloudflare 403); the article was read
through the user's own Chrome session. Its twelve rules, and what each option had before anything
was touched, were audited first; only the gaps were built. Everything added is namespaced **`ux*`**
and marked *rule N* at the rule or function.

| rule | already there | added (7 Sep) |
|---|---|---|
| 1 width 240–300 / 48–64, tooltips | rails 52–72, columns 270–296, `data-tip` everywhere | — (widths were measured against content this week; not changed) |
| 2 dynamic Settings nav | every column swaps to the 19 categories; Settings has its own rail | — |
| 3 account switcher | — | **NOT built.** The product has no multi-account concept — its only "tenant" is the Azure AD field on an integration (`_product-docs`) — so it would be invention |
| 4 expandable sub-items, smooth | chevrons (this week), `.15s` rotate | **`.uxin`** — a 160ms slide-in on the children of the parent you *just* opened (`PL/SK/NX/MR.just`, consumed by the paint that renders them; never on an unrelated repaint); off under `prefers-reduced-motion` |
| 5 bottom space for updates | Next steps card + licence line (4 · 5 · 6 · 8) | **`.uxnews`** in 1 · 2 · 3 · 7 — "What's new · 10.0.1", the product's `message-star`, the release-notes page (`curl` 200); dimmer/smaller than the rows, above the identity row / footer |
| 6 light / dark / system | Dark · Light · Auto in the profile popover, `matchMedia` | — |
| 7 active + focus states | active fills/inks; `.mrr:focus-visible` in Option 4 only | **`:focus-visible`** outlines on every row and control of the columns (2 · 5 · 6 · 7 · 8 rows are `<button>`s under a reset that paints nothing) |
| 8 prioritise, dividers, customise | group hairlines; the Layout drawer's Sidebar tab (hide · order · home · pins) | — |
| 9 adjustable width | — | **`.uxgrip` + `uxGrip()`** on every column (2 · 4 · 5 · 6 · 7 · 8): drag the edge, 4px `--track` bar on hover as the cue, min/max clamp, double-click resets, width persisted per option (`oo-w-*`) and written **inline on `<html>`** so the responsive `:root` steps cannot stomp it (the `--ac-w` mechanism). ONE drag engine: window listeners bound once, the grip only starts a drag, so Option 4's panel (which rebuilds its innerHTML) re-mounts its grip per paint without stacking listeners. Not on 1 · 3: their rail is a fixed hover-expand, not a resizable column |
| 10 quick search at the top, shortcut in the box | 1 · 3 · 4 rail rows at the top with the keycap; 5 · 6 · 8 an icon in the column header; 7 an icon in the action row; 2 none in the panel | **`.uxsrch`** — a search FIELD under the column header (5 · 6 · 8), under the action row (7), at the top of the docked panel (2), `⌘K` / `Ctrl K` shown in the box (`UX_KEY`; Option 7 reuses `#sbSearch` / `#sbKbd` so `init()`'s platform swap still lands). It opens the spotlight — one door, not a second engine. The icon it replaces is removed |
| 11 targeted actions | ＋ create rows, pins, DOCS chips, section `+` | — |
| 12 secondary quick-access sidebar | the pinned band under Explorer (1 · 3 · 4 · 5 · 6 · 8) | — |

- ⚠️ **Rule 1's ranges are reported, not enforced.** Options 5 / 6 / 8 total 332–360px with their rail
  and Option 4's labelled rail is 72; each width was measured against its longest label this
  week, and the reference products they copy sit at those numbers. The resize grip is what gives
  the reader the range the article asks for.
- ⚠️ **The grip sits INSIDE the column's edge (`right:0; width:7px`)**, not straddling it: three of
  the six containers are `overflow:hidden`, and an overhang would be clipped on those and not on
  the others — two different widths for one control.
- ⚠️ **`.plnav` / `.sknav` gained `position:relative`** to host the grip; Option 8's `.plnav` carries
  a `margin-left` for its absolute rail, which is why the shared edit script had to anchor on that
  file's own rule text (it aborted on the first attempt).
- Verified: a per-option probe (grip mounted at the edge and hit-testable, a synthetic drag moves
  the token by the delta, clamps at min and max, persists, double-click resets, one grip after a
  repaint; the field's keycap and that it opens the spotlight and left no second icon; children
  animate on the opening paint and NOT on the next; the focus rule; the what's-new link and version)
  — **159 assertions across the eight files, all passing**; `harness … query` **77/77 on all six
  column options**; Options 5, 7 and 1 screenshotted.

### Round 2 — the rail options, and keyboard reach everywhere (8 Sep 2026)

Request, with Option 1's expanded rail as the picture: *"and this rules will be apply in option 1
to option 8"*. Round 1 had given the rail options (1 · 3, and 8's hover rail) the least, because
their sidebar is a hover-expanding rail rather than a resizable column. What this round adds:

- **Rule 1 · the expanded rail is 240px** — the article's floor — in Options 1 (was 190), 3 (was
  170) and 8's hover rail (`--pl-rail-open`, was 190). The flyout's anchor and the pinned shell read
  the token, so nothing else moved; the brand row that once ellipsised at 170 has room to spare.
- **Rule 9 · the expanded rail is resizable** in Options 1 and 3 — the same `uxGrip` engine on
  `.sidebar`, token `--rail-w-open`, 240–320, hidden while the rail is collapsed (`.sidebar:not(.open)
  .uxgrip`): a grip on a 64px rail would be a handle for a width that is not a preference.
  ⚠️ **`sbHover(0)` stands down while `UX_DRAG` is set** — the pointer crossing the rail's edge
  mid-drag used to fire the collapse timer. Option 8 keeps one grip (its column); a second on its
  hover rail would be two handles in one sidebar.
- **Rule 4 · the flyout slides in** (`uxfly`, 140ms) instead of popping. `.on` is added once per
  open — `mfOpen` re-adds it while you move between rows, which does not restart an animation —
  and `mfHide` removes it. Off under reduced motion.
- **Rule 10 · the rail's Search row reads as a FIELD once the rail is open** (`.sidebar.open
  #sbSearch`: a border on the field surface, the keycap it already carried). Collapsed it is the
  64px tile it always was. ⚠️ Option 3's row carries no keycap and never did: `⌘K` there opens its
  `oa*` AI panel (captured, `stopPropagation`), so its search has no shortcut to show.
- **Rule 7 · keyboard reach, every option.** The rail's rows, the tiles, the flyout's rows and the
  docked panel's rows were all `<div onclick>` — nothing a keyboard could reach, so the focus state
  had nothing to receive. `uxFocusable()` gives every `.sitem / .plib / .skib / .mpi / .mfi`
  `tabindex=0` + `role=button`; Enter / Space activates (`click()`); focus moving into the rail
  opens it as hover does (`focusin` → `sbHover(1)`, `focusout` → `sbHover(0)`); one
  `:focus-visible` outline rule covers them. ⚠️ **A MutationObserver re-applies it after every
  repaint**, watching `childList` only — setting an attribute is not a childList mutation, so it
  cannot feed itself — and no row builder had to change. ⚠️ Its callback is a microtask: a probe
  that reads `tabIndex` synchronously after a repaint sees the OLD rows unset (it did, seven
  times). Wait a tick.
- ⚠️ **Option 3 has no `body.pinned .shell` rule at all** — pinning its rail never padded the
  canvas, before or after this. Pre-existing; not fixed here.

## Responsive — the seven target resolutions

All three pages are verified at **1280×720 · 1366×768 · 1440×900 · 1536×864 · 1600×900 ·
1680×1050 · 1920×1080**. One shared media-query block sits at the end of each file's
`.ac*` CSS, byte-identical across the three — the option-specific selectors in it are
inert in the files that lack them, which is what lets it stay identical.

**Width was the real problem, and it was never the panel — it was the docked columns.**
Each option pays a different fixed cost before the canvas gets any width:

| | docked chrome | why |
|---|---|---|
| Option 1 | **64px** | its `.dpanel` list is `position:absolute`, so it costs nothing |
| Option 2 | 56px, or **278px** with the module panel open | the page ships `<body class="mpshut">`, so `.mpanel` starts collapsed; opening it adds 222px |
| Option 3 | 58px by default, **514px** fully expanded | ships `<body class="dvshut">` *and* `#dpanel.hid` (annotation, 13 Aug 2026) — it paid the most chrome of the three, so both side panels start collapsed. Expanded it is a 224px named column + a **290px INLINE** `.dpanel` |
| Option 4 | **72px**, or **412px** with the detail panel open | the rail is a fixed 72px that never expands; `.dpanel` is DOCKED here rather than absolute, so opening it costs a real 340px. Verified at 1280×720 with the rail, the docked list AND the `ac*` chat all open: 524px of canvas, above the harness's own 430px floor, so it needs no `body.acopen` rule of its own |

⚠️ Option 3's collapsed defaults interact with the rules below, and both had to be fixed:
- `body.dvshut{--rail-w:58px}` sits at the top of the file and the responsive
  `body:has(.sidebar.devrev){--rail-w:196px}` at the bottom — **equal specificity, later
  wins**, so at ≤1300px a collapsed rail rendered 196px. The responsive rule is now
  `:not(.dvshut)`.
- `.dpanel.hid` was `margin-left:-291px` against a hardcoded 290px panel, but the
  responsive rules narrow it to 250/232px. A hidden 232px panel over-pulled by 59px and
  dragged the canvas past the container edge — invisible while the panel defaulted to
  *open*, on screen at every load once it defaulted to *hidden*. Width is now the token
  **`--dp-w`** and the hide margin is `calc(-1 * (var(--dp-w) + 1px))`, so the two can't
  drift. The responsive rules set `--dp-w` instead of `width`/`flex`.
- `dvCollapse()` reads state from `classList.toggle()`'s return rather than a JS flag, so
  the markup default needs no other bookkeeping — but `#dvColBtn`'s `data-tip` is authored
  in markup and had to be flipped to "Expand sidebar".

At 1280 with the original 452px panel that left Option 3 **~314px of canvas** — unusable.
Two mechanisms fix it:

1. **`--ac-w` steps down**: 452 → 424 (≤1679) → 404 (≤1536) → 384 (≤1440) → 360 (≤1366)
   → 344 (≤1300).
2. **`body.acopen`** — set by `acOpen()`, cleared by `acClose()`. Below **1500px** the
   list columns yield their width to the chat while it is open: Option 2 via the token
   flip `body.acopen{--mpanel-w:0px}` (which moves `.shell`'s padding too, in one line),
   Option 3 via `body:has(.sidebar.devrev).acopen .dpanel{display:none}`. Option 3 also
   narrows its column and list at ≤1440 / ≤1300 even with the chat closed.
   Result at 1280×720: Option 3's canvas went **314px → ~730px**.
   ⚠️ `:root{--mpanel-w:196px}` at ≤1440 only bites when the user has actually opened
   Option 2's module panel — `body.mpshut .mpanel{width:0}` is more specific and wins
   while it is collapsed, which is the default. That is the intended precedence.

**Height binds separately** — 720 and 768 are the cases. The panel's fixed rows (top bar,
Currently strip, composer, disclaimer) tighten at `max-height:900px` and again at
`max-height:790px` so the scrolling `.acbody` keeps its share. Two things clipped and were
fixed rather than shrunk: the disclaimer's trust clause is a `.acdisx` span that is
**dropped** below 1440px wide or 790px tall (and `.acdis` is `nowrap` + ellipsis as a
backstop), and `.acchip b` — the uppercase type label — is hidden below 1440px, since the
chip's coloured dot already encodes the type.

### Re-verifying it — `_verify/`

Three small scripts live in **`_verify/`** (leading `_`, so the variant sync ignores the
folder; output goes to the gitignored `_verify/_out/`). Run them from inside `_verify/`:

```bash
cd "/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/_verify"
python3 harness.py "index.html" query  _out/h.png    # layout at ALL 7 resolutions
python3 behave.py  "index.html"        _out/b.png    # the 39 interaction checks
python3 shoot.py   "index.html" query 1280 720 _out/s.png   # one plain screenshot
```

- **`harness.py`** — the useful trick: it loads the page in **seven iframes sized to the
  seven resolutions** and asserts layout in each in ONE headless run, because media queries
  inside an iframe evaluate against the *iframe's* viewport. That measures the real thing
  and replaces 21 separate runs. 11 assertions per resolution (no page h-overflow, panel
  fits the height, no inner h-scroll, composer and disclaimer not clipped, `.acbody` ≥
  200px, canvas ≥ 430px, composer ≥ 240px, starters not overflowing) → **77 per file per
  scene**. Scenes: `closed · empty · query · plan · history`. All pass for all three files.
- **`behave.py`** — drives every `ac*` interaction and paints a pass/fail list. **63 checks**
  (39 original + 24 for the mode/scope/states build), all pass in all three files. This is
  what caught the `acNameDone` blur re-entrancy bug.
  ⚠️ Both scripts paint their verdict **into the screenshot**, and stdout only says
  whether a PNG was written. To read the result as text, re-run the generated
  `_out/h-*.html` / `_out/b-*.html` under `--dump-dom` and take the **last** match of
  `ALL \d+ PASS|\d+ of \d+ FAILED` — the first match is the template inside the inlined
  script source, not the rendered verdict.
- **`lxbehave.py`** — the same idea for the **Log Explorer module**: drives every `lx*`
  entry point and prints the verdict **as text on stdout**. ⚠️ It is the one script with a
  **hardcoded `FILES` list** (line 18) rather than a `sys.argv` file — a new page has to be
  added to it or the script silently tests the old set and reports green. Option 4 was added
  on 1 Sep 2026, Option 9 on 8 Sep, Option 10 on 9 Sep, Option 11 and Option 12 both on
  10 Sep, so it now runs **twelve** files — **ALL 57 PASS on all twelve** as of 10 Sep 2026 19:30.
  **57 checks**,
  and all three files run all 57 — Option 1 skipped 5 of them while its log-sources panel was
  deleted, and the panel is back. Run it after any `lx*` change.
  ⚠️ **Two of its assertions were rewritten on 21 Aug 2026** because they encoded the OLD
  defaults: the log tree and the sources panel now open **collapsed in Option 1 and expanded
  in Options 2–3**, so `tree expand group` opens the group only `if (!LX.open['0'])` and the
  panel check asserts the **toggle**, both ways, against whatever that file started with.
  Hardcoding either default fails on the other two files.
  ⚠️ The suite still skips its panel checks wherever `#lxTree` is absent, which is the right
  behaviour if the panel is ever removed again — asserting a deliberately deleted component
  is a false failure. `lxPickType()` is called by the Overview's bubble chart as well as by
  the tree, so filtering to one log type survives with or without the panel.
  ⚠️ It reads its result out of a `<pre id="__probe">` block, **not `<title>`** — the module
  emits `'<title>'` strings for its SVG tooltips, so a title-based read finds those instead.
- **`stbehave.py`** — the same idea for the **Settings module** (added 12 Sep 2026): 21
  assertions per page covering the injected section and its position, `ST_TREE` / `ST_ICO`, all
  three `ST_PAGES` families, the stylesheet actually applying, and My Profile / License /
  Compliance / Agentic AI each rendering. ⚠️ It **auto-discovers** every page that loads
  `setting.js`, so a new option is covered without editing it — unlike `lxbehave.py`, whose
  `FILES` list is hardcoded and silently tests the old set when a page is added.
- **`licconf.py`** — the **Product License** analogue of `dsconf.py` (added 12 Sep 2026): the
  same isolation trick pointed at `#licPage`, three scenes (Option 1's two tabs, Option 2).
  ⚠️ The scoped DS token block's selector still starts `#agPage`, so a blanket rename of the
  script breaks its regexes — the isolation target and the token selector are different strings.
- All of them strip the Agentation loader into a temp copy first (it hangs headless runs) and
  wrap Chrome in `perl -e 'alarm N'`, since macOS has no `timeout` and these runs can hang.
- ⚠️ `harness.py` needs `--allow-file-access-from-files` to read across the `file://`
  iframes; it already passes it.
- ⚠️ **`harness.py` needs a LONG virtual-time budget — give it ~20 s.** It loads the page in
  seven iframes; at `--virtual-time-budget=15000` a run reported **“49 of 77 FAILED”** on
  code that passes, because the verdict was read before the iframes had finished. Re-read
  before believing a harness failure, and check how many verdict strings the DOM actually
  contains — a healthy run has exactly one.

**Option 3 — the full panel.** Ported from `_ai-source/` and then extended far past it.
Its own `<script>` block, ~1,200 lines, all state on one `OA` object. Its header comment is
the authority; the model is **one chat surface, three modes of increasing risk**:

- **Normal** — answers / explains / summarises, cites its sources (`oaSources`).
- **Query** — plain English → a platform query, and **the query is always shown** and
  editable (`oaQueryBlock` / `oaQOpen` / `oaQEdit` / `oaQRun`). Users should always see the
  query behind a number.
- **Workflow** — creates or changes things: **plan → preview → approve → undo**
  (`oaPlanStart` / `oaPlanMsg` / `oaPlanEdit` / `oaPlanRun` / `oaPlanCancel` / `oaUndo`),
  gated by `OA.set.gate` (default `irreversible`).

Beyond that it carries **@-mention scoping** (`OA_ENT` / `oaTypeahead` / `oaPickEnt`),
slash commands (`OA_SLASH`), chat history with rename/pin (`OA_CHATS` / `oaHistRender` /
`oaRename`), a saved-prompt library (`OA_LIB`), memory (`OA_MEM`), versions (`OA_VER`),
artifacts (`oaArtOpen`), share (`oaShareRender`), attachments, effort/deep-think settings,
and a scope bar (`OA_SCOPES` / `oaScopeBar`). `OA_ENTRY` maps *where it was opened from*
(rail / toolbar / apm / logs / alert) onto the starting scope.

- **⌘K / Ctrl+K opens the AI** in Option 3, not the spotlight search (bound in the capture
  phase — the trade-off the source files made).
- The standalone *Create Dashboard with AI* drawer in the source files is **dead code** —
  deliberately removed there; don't resurrect it. "Create a dashboard" is workflow mode.
- **`AI chat interface.md`** (folder root, untracked) is the running **spec/wish-list** for
  this surface — top bar, chat field, per-answer actions, quick actions, show-the-query,
  plan→approve→execute. Read it before extending any of the three AIs; most of it is
  already built in Option 3.
- ⚠️ Option 1's `aiCtxDrop`/`aiCtxRender` and Option 3's `oaCtxDrop`/`oaCtxRender` are
  **different functions with parallel names** in different files. Don't copy a fix across
  by name.

## Each option now demonstrates a DIFFERENT sidebar pattern

The options are deliberately no longer the same sidebar. Each is modelled on
a real product, studied live in the browser, but all of them read the **same
`RAIL` / `SUBNAV` data**, so the information architecture stays the docs-grounded
one and only the presentation differs.

| Option | Pattern | Source studied |
|---|---|---|
| 1 | icon rail + hover mega-menu flyout | Datadog |
| 2 | icon rail + **always-docked panel** that swaps per module | ClickUp |
| 3 | icon rail + hover mega-menu flyout — **Option 1's, since 23 Aug 2026** | Datadog |
| 4 | **labelled** icon rail + a detail panel **you open** | monday.com |
| 5 | **ultra-narrow** icon rail + an always-on **nav column** | Plain |
| 6 | rail + column, with a **Next steps** card at its foot | Plain · Sidekick |
| 7 | **no rail at all** — one 270px column of labelled rows | Notion |
| 8 | Option 5's rail + column, but collapse **hides everything** | Plain (via Option 5) |

⚠️ **OPTION 3 NO LONGER DEMONSTRATES THE DEVREV COLUMN** (request, 23 Aug 2026: *"copy
Option 1's sidebar and set it in Option 3"*). It runs Option 1's icon rail + flyout. The
flat column is **not deleted** — its markup, its CSS and `renderDevRev()` are all still in
the file, and the whole swap is four things:
- `--rail-w:224px / --rail-w-open:224px` → **`64px / 170px`**;
- `.sidebar.devrev`'s display rule **inverted** — it used to hide `.strigger/.stop/.sutil/
  .sfoot/.smenu`, it now hides `.dvtop/.dvsw/.dvsearch/.dvlist/.dvfoot`;
- the `dvshut` class off the `<body>`, and Option 1's `onmouseenter`/`onmouseleave` on the
  `<aside>`;
- the early `return` removed from **both `sbHover()` and `mfOpen()`** — the DevRev pattern
  had suppressed them because the flat column was always open and printed every route.
- ⚠️ **The `devrev` CLASS IS DELIBERATELY KEPT ON THE `<aside>`.** The shared responsive
  block at the end of every file matches `body:has(.sidebar.devrev)` to give Option 3 its
  own `--dp-w` steps, and **that block is byte-identical in all three files**, so it cannot
  be edited to say something else. The class now means *"this is Option 3"*, not *"this is
  the DevRev column"*.
- ⚠️ **`mfOpenUtil` had never been ported** — Health's utility-rail sub-menu. It is written
  in **this file's flyout shape**, without Option 1's `mfDocs()` footer, because this file's
  `mfOpen` emits its columns raw and has never had that function. Match the host, not the
  source.
- Verified: `behave` 63/63 · `lxbehave` 57/57 · `harness` 77/77 on Option 3, plus a
  16-assertion sidebar probe (rail renders, DevRev column hidden but still in the DOM,
  64→170 hover expand, flyout anchored off the token, Health's menu built from
  `HEALTH_TABS`).

## Option 4 — the labelled rail (`dashboard-labelled-rail.html`, 1 Sep 2026)

Built from **monday.com's side navigation**, driven in the browser at
`blue-falcon-cast.monday.com/boards/5030774530` and measured off its DOM — not copied from a
screenshot. The page is **Option 1 (`index.html`) verbatim** apart from the sidebar and
the panel it drives; "the side details is option 1 reference" was the request, so the
dashboard list panel, the AI panel, Log Explorer, Settings and the rest are unchanged.

Everything lives in three places, all clearly marked:
- one **CSS block at the very end of the sheet** (`OPTION 4 — THE LABELLED ICON RAIL`);
- the **`<aside class="sidebar grouped mrail">`** markup plus `#mrMoreM` and `#mrNav`;
- one **`<script>` block** (`mr*` / `MR_*` / `.mr*`, grepped free before it was named).

### What was measured off the live rail

rail **72px** · item **58×64**, padding `6px 0`, gap `4px` · icon tile **32×32 radius 8** ·
glyph **18px** · label **11px/16px weight 400** · resting ink `#676879` · hover tile
`rgba(103,104,121,.1)` · active tile `#CCE5FF` with `#323338` ink · divider **40×1**
`#D0D4E4`, margin `12px 0 4px` · badge pill at the tile's top-right · panel **279px**, 1px
`#E7E9EF`, top-left radius 16px · `»/«` a **32×32** button, 1px `#C3C6D4`, radius 8, in its
own slot above the list.

⚠️ **NONE OF THOSE HEXES IS IN THE FILE.** What is copied is the geometry and the *roles*;
the paint comes from this prototype's own tokens (`--sidebar`, `--hover-side`, `--pill`,
`--text-dim`, `--border`), so Option 4 themes with everything else. Same rule the AI panel's
send button records.

### The three things that make it a different answer, not a reskin

- **The rail is self-describing.** Every entry carries its label under its icon, so nothing
  has to be hovered to be read, and the rail never changes width.
- **The active mark is on the ICON TILE** — a 32px rounded square — not on the row and not
  as a left accent bar.
- **One control opens the detail panel.** Option 2's panel is always there; Option 1 has no
  panel at all, only a flyout.

### The model: one preference, two surfaces

⚠️ **IT STARTS OPEN** (request, 1 Sep 2026: *"the sidebar is not show sub module — the
reference is option 1 but the ui is same as monday.com"*). It shipped `want:false`, copied
from `.dpanel hid` — Option 1's own default — and that was the wrong thing to copy. Option 1
does not NEED a panel to show a module's sub-navigation: it hangs a mega-menu flyout off every
rail row, so Explorer's eleven sub-modules are one hover away. **This option stood that flyout
down** (it is not monday's UI), which makes the docked panel the ONLY place sub-modules exist —
and starting it closed meant a cold load showed six rail icons and no way to learn anything sat
under them.
⚠️ **The two halves of that request pull in opposite directions and both are honoured**: the
CONTENT is Option 1's (`SUBNAV` + `SUBNAV2`, the same arrays its flyout renders), the
PRESENTATION is monday's (a docked panel, not a hover mega-menu). Restoring the flyout would
have satisfied *"reference is option 1"* and broken *"the ui is same as monday.com"*.
⚠️ Defaulting open only fixes the COLD START — it is still a preference, not a lock: `»/«`
closes it and the choice then survives moving between modules.
⚠️ **This is what the responsive numbers are now measured against.** `harness.py … query` runs
all seven resolutions with the rail, the docked panel AND the `ac*` chat open, and still passes
**77/77** — at 1280×720 that is 72 + 340 + 344 of chrome. Verified after the change, not before.

`MR.want` is "do I want the detail panel", and it **survives moving between modules** — which
is what monday's `»/«` actually does. What it drives depends on where you are:

| where | what opens | width |
|---|---|---|
| Dashboards | **`.dpanel`**, Option 1's own list panel, docked | `--mr-pan` |
| anywhere else | **`#mrNav`**, that module's `SUBNAV` (+ `SUBNAV2`) | `--mr-pan` |

- ⚠️ **`mrApply()` IS THE ONLY THING THAT MOVES EITHER PANEL**, so the two can never disagree
  about the preference. It is idempotent and everything that changes where you are calls it:
  `selectModule`, `showView` and `toggleDPanel` are **wrapped, not re-implemented** (all three
  are `function` declarations, so wrapping the binding catches every caller — the rail, the
  flyout's `mfGo`, the AI panel and the Settings module included).
- ⚠️ It goes through **`toggleDPanel()`** rather than the class, because that also flips
  `#dpanelBtn`'s chevron and rewrites its tooltip. A list panel whose own control lies about
  its state is worse than one with no control.
- ⚠️ **`#mrNav` is where the flyout's navigation went.** With the hover mega-menu stood down
  a module's sub-pages would otherwise be unreachable — that is the trap in copying a rail
  without copying the panel beside it. It renders the same `SUBNAV` data the flyout did, with
  the same `mfGo` handler and the same `mfDocs()` footer, so it cannot invent a route.
- ⚠️ **`.mrr:has(.mfic)` weights a sub-module above its children** — the same rule, keyed the
  same way, as `.mfi:has(.mfic)` in the flyout. Keying off the ICON rather than off
  `:not(.sub)` is deliberate: every row in every other module's panel is a `.mrr` that is not
  `.sub`, so `:not(.sub)` would re-weight Dashboard's, Alert's and Setting's lists too. That
  is the 23 Aug 2026 Explorer lesson, in a second place.

### Four functions are stood down, not deleted

`mfOpen`, `mfOpenUtil`, `mfLater` and `sbHover` are reassigned to a no-op in the `mr` block.
All four are `function` declarations in an earlier block, so reassigning the binding is
enough — and it leaves every call site working untouched: `railRowHTML` still writes
`onmouseenter="mfOpen(i,this)"` on every row it builds, and there are **three** such builders
plus the pinned bands. Picking those attributes out would fork three render functions to say
what one line says here. `toggleSidebar()` is unreferenced for the same reason — the rail no
longer expands, so the brand mark is a mark and not a control.
⚠️ **`mfHide` is deliberately NOT in the list** — `mfGo()` calls it on every navigation and
`#mflyout` is still in the document.

### The tail: Favorites · Notification · More

monday's rail ends in an overflow, and that is the point of it: the rail is a fixed list of
what you reach constantly and everything else lives one click behind `···`.

- **Favorites** is a real destination, not a copied label — `DASH_FAVS` already exists and
  the list panel already had a Favorites filter nothing outside the panel could reach.
  `mrFav()` opens the panel and calls `setDashFilter('fav')`.
- **More** carries Approval · Health Monitoring · ⎯ · **Customize menu**. That last row is
  the reference's own final row, and this prototype already has that screen: the Sidebar tab
  of the Layout drawer governs what is in this rail.
  ⚠️ **`showView()` does `getElementById('sbApproval'/'sbHealth').classList`** — those ids
  moved into the menu WITH the rows, or `showView` throws and every navigation dies.
  ⚠️ `#mrMoreM` is a **`.pop`**, so `closePops()` and the scrim already close it; `closePops`
  is **wrapped** to put out the More tile's light, because that is the one exit every path
  goes through.
- ⚠️ **Notification is deliberately NOT in the overflow** — it carries a live count, and a
  number nobody can see is not a number. That is one more trailing item than the live rail
  has, and the only place this build knowingly departs from its shape.

### Stated divergences from the reference

| what | reference | here | why |
|---|---|---|---|
| active tile | soft `#CCE5FF` tint | `--pill` fill | the nearest token, `--sel`, is 3 points from `--sidebar` in DARK theme, so the selected tile would vanish. `--pill` is this system's "rail item selected" colour, it inverts, and at 32px it is a *smaller* mark than Option 1's full-width row pill |
| panel width | 279px | **340px** (`--mr-pan`) | at 279 the inherited list panel squeezed: its filter row is `nowrap` + `overflow-x:auto` on purpose, so the lit chip scrolled out of sight and the panel stopped saying which filter was on. What the reference contributes is that the panel is DOCKED and that ONE control opens it — not a width that squeezes a panel designed around 340 |
| panel corner | 16px top-left | square | its panel is the top-left-most surface, under a global top bar; ours starts BELOW `.pagehead`, mid-page, where a curve is a notch out of the header. Built, measured in both themes, removed |
| identity row | none — the avatar is in the top bar | avatar, **unlabelled** | a person's name is the one rail label whose length nobody controls ("Kishan Patel" is 64px against a 62px box). ⚠️ The `.lbl` is HIDDEN, not removed — `stSeed()` reads it to seed the Settings profile form and `refreshUser()` writes back into it |
| tail | Favorites · More | Favorites · **Notification** · More | see above |

### The 7 Sep 2026 column changes, ported to the docked panel

Request: *"& add option 4 also"*, after Options 6 and 8. **This panel already had most of the
set** — folding parents with a count and chevron (`mrParent`, `MR.open`, independent per row),
the reserved-slot cluster (`.mrend`), the pin on Explorer rows, Alert's parents derived from the
`sub` runs, and a `mfDocs` footer — so what came across is the remainder:

- **Datadog's `DOCS ↗` chip on the rows of a TREE menu** (`.mrdoc`, Explorer · Alert · Setting),
  to that row's own page; **the `mfDocs` footer stays for a FLAT menu** (SLO · Report) — Option 1's
  split. ⚠️ **`EXPLORER_TREE` HAD NO `doc:` HERE.** This page was copied on 1 Sep, a day before
  Option 1's tree gained its ten per-sub-module paths, so the chip fell back to the Explorer
  overview on every row until they were added (read off Option 5's tree by label, all ten).
- **The product's `chevron-right`** in `MR_CHEV_P` / `MR_CHEV`, replacing a hand-drawn stroke.
- **The foot row · Next steps card · licence line** (`.mrcfoot` / `.mrns` / `.mrtrial`, `MR_STEPS`,
  `mrNsHTML` …). ⚠️ **Rendered by `mrNavPaint`, not as static markup** — this panel rewrites its
  whole innerHTML on every module change, so the state (`MR.ns`, `MR.done`) is what survives and
  the card is re-emitted each paint. Foot ids end in `Btn` (`mrHelp()` is a function).
- ⚠️ **THE RESERVED SLOTS ARE NOW GATED ON THE PANEL HAVING PARENTS** (`mrSlots`). They exist so a
  pin or chip sits at one x whether or not its row has children — right in Explorer and Alert,
  but in Setting no row has children and the 40px they reserved clipped `Service Level Objective
  BETA` once the chip arrived. The panel is **279px** (`--mr-nav`; `--mr-pan` is the LIST panel's
  340) and was not widened.
- Verified by a **43-assertion probe** (chip hrefs incl. Log → `log-management/overview`, one x
  for pins and chips, the product glyph, DOCS click not folding, Monitor + NCCM open together,
  pin → the rail's `.sitem.pin` row → unpin, Alert's three parents, Setting's fallback, the two
  footers, label fit in every panel, the card's dismiss / restore / step / badge / licence link),
  `harness … query` **77/77**, both panels screenshotted. ⚠️ A hit-test on a row that has scrolled
  below `.mrpb` lands on whatever is painted there — the probe scrolls the row into the panel's
  own scroller first (never `scrollIntoView`, which also scrolls the window).

### Things that bit, and would bite again

- ⚠️ **THE LABEL BOX IS WIDER THAN THE ITEM** — 62px against the item's 58, pulled back 2px
  each side. The item's 58px is the reference's and sets the tile's hit area; the label only
  has to stay inside the 72px rail. Measured, not guessed: at Inter 11px "Dashboard" is
  **56.7px** and "Notification" **59.8px**, so at 58px the two longest names in the rail —
  the ones a reader most needs whole — were the two that ellipsised. "Notifications" is
  65.6px and is why that row uses the product's own singular.
- ⚠️ **THE TILE IS PAINTED ON THE GLYPH ITSELF** (`padding:7px` + `box-sizing:content-box`),
  not on a wrapper. Rail rows are built by three different functions plus four hand-written
  blocks of markup; doing the tile in CSS is what let every one of them stay untouched.
  `.iwrap` (the bell) is itself the tile, so the glyph inside it must not be padded twice.
- ⚠️ **`.shell`'s padding was the literal `64px`, not `var(--rail-w)`.** Repointing the token
  alone leaves the canvas 8px under the rail.
- ⚠️ **`--rail-w-open` is pinned to `--rail-w`.** `.sidebar.open` still gets set by stray
  callers and must be a no-op rather than a 170px jump.
- ⚠️ **`.dpanel.hid` needs `flex-basis:0` AS WELL AS `width:0`.** `flex:0 0 340px` sets the
  basis, so animating `width` alone collapses nothing.
- ⚠️ **`const MR` IS NOT `window.MR`.** A `const` at the top level of a classic script binds
  in the global *lexical* environment, not on `window` — so a probe driving the page from an
  iframe must call `w.mrPanelTog()` (a `function` declaration, which *is* a window property)
  rather than setting `w.MR.want`. This cost one phantom failure.
- ⚠️ **`ok(name, cond, detail)` EVALUATES ALL ITS ARGUMENTS.** Writing
  `ok('clickable', !hit(el), hit(el))` clicks the button **twice** and toggles it back —
  six assertions failed on working code before this was spotted. Call the driver once.
- ⚠️ **The first click after a navigation is swallowed** on this page under browser
  automation; it lands once the dashboard has settled (~1.5s). Two "failures" were this.
- ⚠️ **An automation-driven tab is not focused, so CSS transitions never advance** — a width
  read after a 340ms wait reported **1px**. Inject `transition:none` before measuring. The
  recorded gotcha, hit again.

### Verifying it

`lxbehave.py` gained the file to its `FILES` list (**57/57**, and still 57/57 on the other
three). `behave.py` **63/63**. `harness.py … query` **77/77** across all seven resolutions.
Plus a browser walk in a real tab — ~40 assertions, every interaction hit-tested with
`elementFromPoint` and driven with a real bubbling `click`, covering the rail's geometry
against the measured reference, the panel on both surfaces, the preference surviving a module
change, the More overflow, Favorites really filtering, and the Sidebar tab's live preview
(which clones `#sidebar`) surviving the new rail.

## Option 5 — the narrow rail + nav column (`dashboard-nav-column.html`, 2 Sep 2026)

Built from **Plain** (plain.com), supplied via Mobbin (screen `8e4cfdce…`). The page is
Option 1 with a different sidebar — "the module details is option 1", the same brief Option 4
had — so the AI panel, Log Explorer, Settings and the rest are untouched.

⚠️ **THE REFERENCE IS A STILL, NOT A LIVE DOM.** Every other option here was measured in the
browser; this one could not be, so the numbers are PROPORTIONS read off the capture and then
set to this product's own type scale. Said plainly so nobody later treats them as measured.

### Why it is a fifth answer

| | rail | how a module's navigation is reached |
|---|---|---|
| 1 · 3 | 64px | hover a mega-menu flyout |
| 2 | 56px | an always-docked panel that swaps per module |
| 4 | 72px, labelled | a docked panel **you open** with `»` |
| **5** | **44px, icon-only** | **an always-on nav column — nested, counted, collapsible** |

It is the only one where the navigation is permanently open AND nested: children sit indented
under the row they belong to, each row can carry a count, and sections below the primary rows
collapse. That nesting is the whole point of the pattern — it is Plain's "All threads → its
statuses" shape.

### How it is built

- **`.plrail` (44px)** — logo, Search, Iris, the `RAIL` modules, then Approval / Health /
  Notifications / avatar. **Icon-only, no labels, no hover-expand, no flyout.** 28px tile,
  18px glyph; active tile is `--pill`.
- **`.plnav` (280px — 216 until 3 Sep 2026, 224 until 7 Sep, see the two width notes below; user-resizable since the 7 Sep UX pass)** — a header (module name, plus Sidebar
  settings), then the rows.
- ⚠️ **EXPLORER RENDERS FROM `EXPLORER_TREE`, EVERYTHING ELSE FROM `SUBNAV`/`SUBNAV2`.** The
  tree is the only source with real nesting and real counts, and nesting is what the pattern
  exists for. Flat modules render their first section as primary rows and the rest as Plain's
  collapsible groups — which is what a `SUBNAV` heading already is.
- ⚠️ **A COUNT IS ONLY DRAWN WHEN IT IS REAL** (`plCount`) — a parent's own `kids.length`.
  Plain puts a number on every row; inventing one here would be inventing product data, so a
  row with nothing true to show gets no number rather than a zero.

### Things that would bite

- ⚠️ **`#smenu` IS KEPT IN THE DOM, EMPTY AND HIDDEN.** `renderMenu()` writes into it and is
  called from `selectModule`, `showView`, `pickDash` and the Layout drawer — it would throw on
  a missing node. Cheaper to keep the node than to fork four call sites. `renderMenu` is
  wrapped so the RAIL still repaints on every navigation.
- ⚠️ **`#sbUser` NEEDS BOTH `.miniav` AND `.lbl`.** `refreshUser()` writes the saved name and
  picture into the first; `stSeed()` reads the signed-in name out of the second to seed the
  Settings profile form. The label is hidden, not removed — `textContent` does not care.
- ⚠️ **`--sel` IS SAFE ON THE COLUMN AND WOULD NOT BE ON THE RAIL.** The column sits on
  `--panel`, which it reads against in both themes; against `--sidebar` in dark, `--sel`
  (#12233a) and the rail (#172336) are three points apart and the active row would vanish.
  That is why the rail's active mark is `--pill` and the column's is `--sel`.
- ⚠️ `mfOpen` / `mfOpenUtil` / `mfLater` / `sbHover` are **stood down, not deleted**, as in
  Option 4. `mfHide` is not — `mfGo()` calls it on every navigation.

Verified: `harness … query` **77/77** across all seven resolutions (the 260px sidebar is the
widest chrome of any option and still clears the 430px canvas floor), `behave` **63/63**,
`lxbehave` **57/57 ×5**, plus a 13-assertion walk (rail is icon-only, Explorer's 10
sub-modules, counts only on the two rows with children and equal to 18/2, Monitor expanding to
18 indented types, sections collapsing).


### Option 2 — ClickUp
`.mpanel` / `renderMPanel()`. Rail drops to **56px, icon-only and permanent** —
`mfOpen()` and `sbHover()` return early because the docked panel replaced both the
flyout and hover-expand. Panel is 222px at `left:var(--rail-w)`; `.shell` is padded
`calc(var(--rail-w) + var(--mpanel-w))`. Shape copied from ClickUp: header (module
name + `＋ ▾` split button) → first SUBNAV section as an ungrouped primary list →
hairline → remaining sections as **named groups**, each with a `＋` on its header and
its "＋ New …" row at the end. `body.mpshut` collapses it; `pickRail()` re-opens it.

### Option 3 — DevRev, now with a module switcher
`.sidebar.devrev` / `renderDevRev()`. There is **no icon rail at all** — one 224px
column: a control row (avatar · settings · panel toggle · ＋), the **module switcher**,
a full-width search with a `⌘K` keycap, the current module's own pages, and a docked
**"Ask me anything"** composer pinned to the bottom that opens the AI panel.

**The flat 7-row module list is gone** (`.dvi` deleted). It listed modules, section
labels and recent dashboards as the same 27px muted row: nothing showed that a module
*has* pages, the active module was bold text with no marker, and Recents repeated the
picker panel sitting right beside it. Researched on Mobbin (web · UI elements ·
**Dropdown Menu**): Railway puts the workspace behind a trigger + grouped dropdown,
LangSmith stacks an app switcher over that app's own nav; both menus use a leading icon
tile, a second descriptive line, hairline group dividers and a ✓ on the current row.

- **`.dvsw` trigger** — module icon tile, name, and `group · N pages` (a count, because
  three section names always ellipsized in 204px).
- **`#dvMenu` dropdown** (`dvMenuEl` / `dvMenuHTML` / `dvMenuOpen` / `dvFilter` /
  `dvKey` / `dvGo`) — built lazily into `<body>`, `position:fixed` off the trigger rect.
  Type-to-filter, ↑/↓/Enter/Esc, grouped by `DV_SECS[].menu`, ✓ on the current module.
- **The column below is the current module's `SUBNAV` (+ `SUBNAV2`)** — the level that
  was missing entirely. `.dvnh` headings, `.dvni` rows, `dvSub` ("section:item") holds
  the selected row, rows fire the same `mfGo(mod, act)` the flyout used.
- **Recents only under Dashboards**, since recents *are* dashboards.
- Module descriptions come from each module's own `SUBNAV` headings (`dvDesc`), so the
  menu can't advertise something a module doesn't contain.
- **Foot of the column** — `.dvurow` (Approval · Health monitoring · Notifications with
  its badge) + `.dvid` identity row → the existing `#userPop` (profile, docs, theme
  segmented control, logout). All of this was already in the markup as `.sutil` /
  `.sfoot` but `.sidebar.devrev` **hid it**, so none of those actions were reachable
  from Option 3. Nothing is a second implementation — same `showView()`, `togglePop()`.
- **Collapse / expand** — `dvCollapse()` toggles `body.dvshut`, which flips `--rail-w`
  to 58px; `.shell` pads by the same token, so one flip moves the column and the canvas.
  Collapsed keeps the chrome (module tile still opens the switcher, search, ＋, the foot)
  and drops the page list, which is text-only. `toggleSidebar()` is the *old* rail's pin
  and `sbHover()` returns early here, which is why the column needs its own control.
- ⚠️ `#userPop` / `#notifPop` were positioned `left:74px` for the old 64px rail. The
  override is `body #userPop{left:calc(var(--rail-w) + 10px)}` — **`body` is needed for
  specificity**, since the 74px rule is declared later in the same stylesheet.

#### One icon system for the column (`ICO` / `svgi` / `dvItemIcon`)
The column was mixing solid blobs (modules), hairline glyphs (utilities) and bare dots
(pages), so nothing read as one family. Every glyph now comes from **`ICO`** and is
emitted by **`svgi(name)`** in the convention the reference sets share (Lucide / Tabler /
Iconsax): 24×24 box, `fill:none`, 2px round-capped strokes, rendered at 15–17px by `.sbi`.

- **Never inline an `<svg>` in this sidebar's markup** — add a glyph to `ICO` instead. The
  static chrome (collapse, search, AI, utilities, ⋯) is injected once from `renderDevRev`
  behind a `host.dataset.chrome` guard.
- ⚠️ **CSS must not set `fill` on these.** A container rule like `.dvic svg{fill:currentColor}`
  beats the inline `fill="none"` attribute and the outline icons render as solid blobs.
  Container rules are `.dvic .sbi`, `.dvswic .sbi`, … (class beats element selector).
- **`dvItemIcon(label)` resolves a page's icon from its own label**, first match wins, so
  the array order *is* the specificity order — `/ list$/` must sit above `/dashboard/` or
  "Dashboard list" gets the grid icon. Verified: all 7 modules, 0 rows fall through to the
  generic dot.
- The top row lost the gear and the panel toggle (the gear is the Settings module in the
  switcher; the panel toggle is `#dpanelBtn` in the page header) and the ＋ (there is a
  "New dashboard" row). It is now identity + collapse.
- Foot utilities are **labelled rows**, not three bare icons; collapsed drops the labels.
- ⚠️ `.dvlist` needs **`min-height:0`** or the flex item won't shrink below its content and
  pushes the whole foot out of the `overflow:hidden` column — and `body.dvshut .dvfoot`
  needs **`margin-top:auto`**, because the list is `display:none` when collapsed so nothing
  is left to take the flexible space.
- ⚠️ `--pop-line` had to be added to Option 3's tokens: `--pop` and `--border` are the
  same colour in dark theme, so the menu's group dividers drew nothing. **All three files
  now declare it, in both themes** (verified: 2 declarations each) — see Gotchas.

⚠️ The old `#smenu` rail nav still renders in these two files — it is hidden by
`.sidebar.devrev .smenu{display:none}` / the `railonly` rules, not removed, because
`renderMenu()` is what calls `renderDevRev()` / `renderMPanel()`. Leaving it out of
the hide list showed the entire old icon rail stacked under the new column.

## The module rail (Datadog pattern, docs-grounded) — Option 1

Reworked from `docs.motadata.com/motadata-aiops-docs` (read Aug 2026), not invented.
Built in Option 1 first, then **ported verbatim into Options 2 and 3** so all three
share one rail. The port moved the `--rail-w`/`--rail-w-open` tokens, the `.mflyout`
CSS block, the `#mflyout` element, and the whole rail engine (`RAIL`, `SUBNAV`,
`SUBNAV2`, `MOD_TO_RAIL`, `renderMenu`, `pickRail`, `mfOpen/mfHide/mfLater/mfGo`,
`railWidth`, `mfAttr`) — checked first for collisions, of which there were none.
Per-page differences kept deliberately — the rail's ✦ AI row calls each page's **own** AI:
`aiOpen()` in Option 1, `iFocus()` (the inline ask bar) in Option 2, `oaOpen()` in Option 3.

- ⚠️ **OPTION 1'S RAIL IS SIX ENTRIES NOW** (request, 23 Aug 2026) — **Dashboard · Alert ·
  SLO │ Explorer · Report │ Setting** — split by hairlines with **no captions, counts or
  chevrons** (Datadog shows grouping, it doesn't label it). It was seven: Dashboards ·
  Monitors · Alerts │ Explorers · Network · SLO │ Settings.
  - The spec is **`sidemenu.md`** in this folder, and it is a **TREE, not the flat list it
    looks like**: everything indented under `Explorer` is a sub-menu row, and `Monitor` and
    `NCCM` have children of their own. Read the indentation before touching it.
  - **Monitors and Network left the rail** and became rows inside Explorer's flyout.
  - ⚠️ **EXPLORER HAS ELEVEN SUB-MODULES** (corrected against a screenshot the same day):
    Monitor · Topology · NCCM · NetRoute · Log · APM · RUM · Flow · Trap · Audit · Report.
    **Monitor and NCCM are ROWS that HAVE children, not headings.** They shipped for an hour
    as `{h:'Monitor'}` / `{h:'NCCM'}` section headings, which made them labels you could not
    click and made their children look like the only real entries. Their children carry
    **`'sub'`** — the kind this flyout already had for exactly this shape (indented, smaller,
    dimmer; it exists because the live Alerts tab bar has dropdowns off its tabs).
    ⚠️ **`'sub'` is the FOURTH element of an item**, after label / module / action. Putting
    it third passes an action string of `'sub'` to `mfGo`, which `eval`s it — silently, with
    the row simply doing nothing. There is a probe assertion that no row's `onclick` carries
    it.
  - ⚠️ **AN ICON PER SUB-MODULE IS WHAT MADE THIS READABLE** (request, 23 Aug 2026: *"it is
    not better, I can't understand this"*). It is the **fifth slot** of an item, after label
    / module / action / kind, and it is optional — every other menu omits it and renders
    byte-identically, which is what lets Options 2 and 3 keep their copy of `mfCol`.
    - At 31 rows, **indentation alone is not a strong enough cue** once you are reading down
      a long list. An icon says *"a module you can open"*; a plain indented label says
      *"something inside one"*.
    - The keys are `MODULES`' own (`navbar-monitor`, `topology`, `ncm`, `netroute`, `log`,
      `apm`, `rum`, `flow`, `trap-viewer`, `audit`, `report`), so the menu cannot show an
      icon the module list does not have.
    - ⚠️ **The 20 children deliberately have none.** Giving all 31 rows an icon would flatten
      the distinction again — the monitor types and NCCM's pages are not modules.
  - ⚠️ **ALL ELEVEN ARE ONE SHAPE, AND THAT SHAPE IS HIGHLIGHTED** — heavier (600) and
    brighter (`--white`) than the pages indented under them (request, 23 Aug 2026: *"sub
    module will be highlighted"*). Uniformity is the readability: a reader learns one row,
    not three. This went through **three** shapes before landing — section headings (labels
    you could not click), then `.mfp` parent rows (but only Monitor could be one, since NCCM
    sits mid-list, so the two halves of the same idea looked different), then this.
  - ⚠️ **THE HIGHLIGHT SELECTOR IS `.mfi:has(.mfic)`, NOT `.mfi:not(.sub)`.** Every row in
    every other flyout is a `.mfi` that is not `.sub`, so `:not(.sub)` would have re-weighted
    the whole rail's menus — Dashboards, Alerts, Setting and the rest. Keying off the icon
    says exactly what is meant: *a row with a module icon is a module*, and nothing else in
    the file has one. There are probe assertions that Dashboards and Setting are unchanged.
  - ⚠️ **A TWO-UP CHILD GRID WAS BUILT AND REVERTED.** `cols:2` balanced the columns (443px
    each) but made you read nine rows down and then jump back to the top for the tenth, with
    nothing saying so — **balance is not worth a reading order nobody can follow**. Column
    one is simply longer than column two now, and that is fine. `mfCol`'s `parent` / `cols`
    fields, `.mfp`, `.mflist.c2` and `.mfcol:has(.mflist.c2)` are all kept, unreferenced.
    Two things learned there, worth keeping if it is ever wanted back: CSS `columns:2` splits
    the width the container **already has**, and `.mfi` is `white-space:nowrap`, so
    *"Container Orchestration"* overflowed its half and printed **on top of** the next
    sub-column's last row — a grid of `max-content` columns sizes itself instead; and
    `grid-auto-flow:column` plus an explicit row count is what keeps the order going **down**
    each sub-column rather than across.
  - ⚠️ **Column two is ONE continuous list.** It was Topology / gap / NCCM+children / gap /
    the rest, and those gaps came from `h:''` continuation headings — structural accidents,
    not groupings. Nothing in the spec separates Topology from NetRoute, so nothing on screen
    does either. There are probe assertions that you read straight down each column with no
    jumps and that no gap in column two exceeds 6px.
  - ⚠️ **`Report` is in BOTH places and that is unresolved.** `sidemenu.md` lists it at the
    top level (a rail entry) and the 23 Aug screenshot message lists it among Explorer's
    sub-modules. It is currently on the rail *and* the last row of Explorer's flyout. Ask
    before removing either — the two specs disagree, they do not clarify each other.
  - ⚠️ **Labels are the spec's, case-corrected.** `sidemenu.md` is typed lowercase and mostly
    singular; the live product and the research notes use plurals (Dashboards, Alerts,
    Reports, Settings). The spec's singular wins because it was given explicitly — recorded
    so it is not "corrected" back by someone checking the notes.
  - ⚠️ **`MOD_TO_RAIL` had to be remapped, and it is the thing that silently breaks.**
    Eleven of the sixteen module screens now light **Explorer**; a module missing from that
    table leaves the rail with nothing lit. There is a probe assertion that all 16 map, and
    that none points past the end of a now-shorter rail.
  - ⚠️ **`Dashboard` / `Alert` / `Setting` are ALIASES**, not copies — `SUBNAV['Dashboards']`
    etc. are still the only definitions, so a page added to one is in the other. The old
    `SUBNAV['Monitors'|'Explorers'|'Network']` entries are kept unreferenced; they are what
    a revert would read.
  - ⚠️ **`Report` has no sub-menu on purpose** — the spec gives it no children, and `mfOpen`
    already handles that by not opening the flyout at all.
  - ⚠️ **`Metric explorer` is indented under `Monitor` in the spec.** That looks like a slip
    (Metric Explorer is a module, not a monitor type) but the file is the spec, so it is
    where the file puts it. One line to move if it was meant as a sibling.
  - Nothing in the code keys off a rail *name* — `RAIL[i]` and `MOD_TO_RAIL[module]` are the
    only lookups — which is why renaming five of the seven cost nothing else.
- Everything else is a **sub-menu**: hovering a rail row opens a mega-menu flyout
  with the module's own navigation under bold headings, using the docs' page names.
  All 15 module screens stay one hover away and light the rail entry that owns them
  (`MOD_TO_RAIL`).
- **Hovering a collapsed rail only expands it** — sub-menus appear once it's open.
- **The rail and its sub-menu are separate boxes**, so moving the pointer into the
  flyout fires the rail's `mouseleave` and used to collapse the rail out from under
  the menu the pointer was heading for. The collapse is now deferred 200ms and
  cancelled by an `mfIn` flag the flyout's `mouseenter` sets; the flyout's
  `mouseleave` clears it and calls `sbHover(0)` so leaving for real still collapses.
- Rail widths are the tokens `--rail-w` / `--rail-w-open`; the flyout anchors off
  the **token**, never off the measured box (see Gotchas).
- ⚠️ This is a deliberate divergence from the live 8.2.6 nav (research notes §1),
  flagged in a comment above `RAIL`. **Monitors and Settings now carry the product's own
  lists** (annotations, 12 Aug 2026) — Monitors is the monitor-type taxonomy (Inventory +
  16 types), Settings is the module's 18-category rail. Alerts / Explorers / Network / SLO
  keep their docs-derived labels. ⚠️ Explorers was briefly flattened to one row per data
  source and **that was reverted on request** — it keeps its Metrics / Logs / Flow ‖ APM /
  RUM / Traps grouping.
- **A section with `h:''` is a continuation**, not a new group: `SUBNAV2` uses it to run
  one long list across two columns. All three renderers understand it — `mfCol` keeps the
  heading's box (`.mfsec.cont`, hidden) so the columns align, while `renderMPanel`
  (Option 2) and `renderDevRev` (Option 3) print no header at all. Without those guards
  both of those surfaces render an empty label strip.
- **Item kinds**: `'plus'` renders the ＋ affordance, `'beta'` a BETA chip, `'sub'` a child
  of the row above it (indented, smaller, dimmer). `'sub'` exists because the live
  **Alerts** tab bar has dropdowns — NetRoute → Source To Destination / Hop To Hop, APM →
  Trace Metrics / Trace Analytics, RUM → RUM Metrics / RUM Analytics — and the tab order
  has to survive, so the children sit inline under their parent rather than in their own
  section. All three renderers honour it (`.mfi.sub` / `.mpi.sub` / `.dvni.sub`).
- **Every flyout ends with a documentation link** (`MOD_DOCS` + `mfDocs()`), Datadog's
  mega-menu footer. The flyout is therefore a **column** — `.mfcols` (the row of columns)
  then `.mffoot`. ⚠️ The docs section slugs do **not** match module names
  (`alerts-and-policies`, `Metric%20Analysis`, `system-settings-module`, …); they came
  from `docs.motadata.com/motadata-aiops-docs/sitemap.xml` and each was verified 200.
- **The utility rail items can open flyouts too** — `mfOpenUtil('Health', el)` builds
  Health's sub-menu from `HEALTH_TABS`, the same array the Health page renders its tabs
  from, and each row calls `setHealthTab(i)`. Approval / Notifications call `mfHide()` on
  hover so a module's menu doesn't hang open over them.
- ⚠️ **The rail now exists in three copies.** A change to `RAIL`/`SUBNAV` or the
  flyout CSS must be made in all three files, or the options drift apart.

## Tooltips (all three options)

**One delegated floating tooltip** per page — `.tipbox` + `tipShow` / `tipHide` /
`tipFor` / `tipSeenText`, sitting just above `toast()` in the script.

- **Delegated**, so it covers everything JS renders (widget kebabs, group headers,
  flyout rows, drawer buttons) with no change to those render functions.
- **Adopts `title=` into `data-tip` on first hover** and deletes the `title`, so the
  slow OS tooltip never fires. That upgraded the ~90–220 controls per page that
  already had a title without touching their markup. Coverage: 281 / 110 / 129.
- Replaced the rail's `::after` tooltip: a pseudo-element is clipped by any
  `overflow:hidden` ancestor, and `.widget`, the drawers and the flyout all are.
- Placement: alongside for anything inside `.sidebar`, below/above otherwise,
  clamped to the viewport. `z-index:2147482000` — above the app's 200001 drawers,
  below Agentation's 2147483000.
- A tip that repeats a **readable** label is suppressed, so the expanded rail
  doesn't tooltip its own rows. ⚠️ That test must use rendered text, not
  `innerText` — the rail hides labels with `opacity:0`, which `innerText` still
  reports, and the first build silently suppressed the *collapsed* rail's tooltips
  (the one place they matter). `tipSeenText()` walks children and skips
  `display:none` / `visibility:hidden` / `opacity:0` / zero-box nodes.
- `data-tip="Label  ⌘K"` (two spaces) renders the tail as a keycap chip.

## Create / Edit Widget editor — Option 1, copied from the live product

`#cwModal` + `cw*` / `CW_*` / `.cw*`, own `<script>` block. **Analysed live on 8.2.7 at
`https://172.16.14.71/dashboard` in Chrome (13 Aug 2026)** — widget ⋮ → Edit Widget — and
rebuilt, not invented. What the live editor does and this reproduces:

- It is a **full-screen modal**, not a side drawer. Header = title · the dashboard's
  time-range chip + absolute stamps (the widget inherits the range) · ✕.
- **Visualization is a radio row of 12**: Chart · Grid · Top N · Gauge · Heat Map · Sankey ·
  Map · Stream · Anomaly · Forecast · Active Alerts · Event History.
- ⚠️ **In Edit mode every visualization except the current one is `disabled`** — a widget's
  type cannot be changed after it is created. This is real product behaviour (it is why a
  click on "Chart" did nothing while editing a Map widget) and is reproduced via `CW.edit`.
- **The right panel's tab set depends on the visualization**: Chart showed
  *Style · Sorting · Markers · Timeline Preference*; Map showed only *Style · Timeline
  Preference*. Widget **name** and **description** sit side by side above the tabs as
  underlined inputs with no labels.
- **Chart Style** = 8 chart-shape tiles, then Rotation · Legend · X-Axis Title · Y-Axis
  Title · Z-Axis Title · Line Width · Points.
- **Query builder** across the bottom: a **coloured source tab down the left edge**, then
  **Counter\*** · **Aggregation\*** · **Source Filter** · **Source** · **Result By** · **Σ**
  · **⊕**, with a **Filters** row beneath. ⊕ adds another counter row; extra rows carry ⊗.
- **The 8 data sources, confirmed live**: Metric · Availability · Log · Flow · Alert · APM ·
  NetRoute · RUM. Switching source **clears the counters**, because counters belong to a source.
- Footer: **Reset · Create Widget / Update Widget**.

**Verified against the CREATE screen** (dashboard `103708016465` → ＋ FAB → a type tile),
which differs from Edit in ways the first build got wrong:

- **The footer is THREE buttons**: `Reset` · `Create Widget` (ghost outline) ·
  `Create & Add Widget` (solid primary). Modelled as: *Create Widget* saves the definition
  into **User Define** without placing it; *Create & Add Widget* also drops it on the open
  dashboard. ⚠️ That split is a reasoned reading of the two buttons, not something the live
  UI states — the rest of this section is measured.
- **The 8 chart-shape tiles are the product's own art** (`CW_SHAPE`), `viewBox="0 0 48 38"`,
  inlined **verbatim**. They already paint from three product CSS variables, so nothing in
  the markup was rewritten — `.cwvar` defines `--chart-type-icon` / `--chart-line-type-icon`
  / `--page-background-color` in this file's tokens and `.cwvar.on` re-points them at
  `--teal`. ⚠️ Never set `fill` on them from CSS; the fills are inline and var-driven.
  Tile **0** is checked by default, as on the live screen.
- **The offered data sources differ per visualization** — measured by clicking all 12:
  Chart/Grid/Top N/Gauge offer all 8; Heat Map offers Metric · Availability · Alert · APM ·
  RUM; Sankey only Flow; Map only Log · Flow; Stream only Alert; Anomaly and Forecast only
  Metric; Active Alerts Availability · Alert; Event History only Log. Chart additionally
  **greys out Availability** (`disabled` in the DOM, not just styled). Switching type moves
  the source to the first valid one and clears the counters.
- Counter placeholder is **"Select Counter"**; the preview draws axes (% scale, time labels,
  gridlines) because a bare line reads as a sketch rather than as the widget.

⚠️ **The editor must not open in an error state.** A side-by-side against the live Create
screen found five differences, all now fixed:

1. **It opens with a counter already selected** — `system.cpu.percent` / Avg / Everywhere —
   so the preview draws and both create buttons are live from the first frame. `CW_SRC`'s
   Metric list was reordered to put `system.cpu.percent` first for exactly this.
2. **Only the COUNTER gates the buttons, not the name.** The live buttons are enabled with
   Widget Name still empty. Requiring a name made the form open showing "Needs a Widget
   Name", which the live editor never does. A blank name falls back to the counter on save,
   so a widget is never titled `""`. Duplicate names are still blocked.
3. **A type tile does NOT prefill the name** — `cwOpenViz()` used to seed it with the tile
   label ("Chart"); the live editor leaves the placeholder showing.
4. **The preview panel has no header strip** — it is just the chart.
5. With no counter the preview draws the **empty axes frame**, not a text placeholder.

Also matched: Rotation is a rotate glyph + borderless number (not a boxed input), and Line
Width is a ticked track with the value boxed on the right.

⚠️ The dark circle floating over the top of the modal in a browser screenshot is
**Agentation's toolbar**, not part of the page — it paints at z-index 2147483000+ and the
loader is stripped from every probe copy, which is why it never appears in verification
shots. Don't chase it as a z-index bug.

⚠️ **A dashboard cannot hold two widgets with the same name.** `cwNameTaken()` blocks a
duplicate and marks the field, and this is why **Clone Widget opens the editor** instead of
duplicating in place: `wDuplicate()` used to splice a shallow copy carrying the *same*
title, which the board cannot hold. It now opens the editor in **create** mode seeded from
the source widget with a free `Copy of …` name (` (2)`, ` (3)`… if taken), type unlocked
because a clone is a new widget. Edit mode still allows a widget its own current name.

Wiring: `CW_VIZ[].vis` maps onto **`AW_VIS`**, the key `awAdd()` already understands, so a
widget made here is a real widget — undo, drag and resize all work on it. `wEditW()` was a
toast stub and now opens `cwOpen(curG, curW)`. The Add New Widget drawer's **Create Widget
tiles** hand off to `cwOpenViz(name)` rather than adding blind, so the library still leads
into the real editor; Predefined and User Define still add in one click. `#cwModal.on` is in
`kbBusy()`.

⚠️ Counter names are illustrative **except** the ones the research notes confirm
(`monitor.up.count` / `.down.` / `.unreachable.` / `.maintenance.`) and the ones read off the
live instance (`esxi.vm.disk.used.percent`, `volume.bytes`, `netroute.latency.ms`).

**Other live findings from the same session** (recorded so they don't have to be re-derived):
- **Dashboard ⋮ menu is only Clone · Edit · Delete.** There is no Add-Widget entry there.
- **Widget ⋮ menu is type-dependent**: a Chart showed *Edit Widget · Clone Widget · Full
  Screen · Share · **Export as CSV** · Remove Widget*; a Map showed the same **without**
  Export as CSV. Option 1's menu gained Export as CSV.
- **Edit Dashboard drawer** confirmed field-for-field against our port, and is *richer* than
  ours in one place: **Default landing dashboard** is a toggle **plus** two radio options —
  *Only for me* / *For specific users*. Ours has the toggle only. Not built.
- The dashboard list panel's round **＋** opens **Create Dashboard**, not Create Widget.
- ⚠️ On that instance no Add-Widget affordance is reachable from a dashboard you did not
  create — the create path was inferred from the Edit Widget form, which is the same form.

## Add New Widget drawer — Option 1 now uses the product's own artwork

The three tabs were rebuilt against the live 8.2.7 drawer (dashboard `103708016465` → the
floating **＋ `.create-widget-btn`** FAB, which is bottom-right and **only exists on a
dashboard you can edit** — that is why it was not on the first dashboard I looked at).

- **`W_TILE_SVG`** — all **18** widget-type illustrations, harvested as inline SVG from the
  live drawer, not redrawn. Three mechanical changes on the way in, all documented at the
  constant: a **viewBox was added** (the sources carry `width`/`height` only and cannot
  scale), the `<defs>` ids were **namespaced per icon**, and the hardcoded palette was
  **mapped onto this file's tokens** (`#172336`→`--ink`, `#1D2A3E`→`--border`,
  `#2B394F`→`--chip`, `#485975`→`--track`, `#6A7FA0`→`--text-dim2`, `#8E9FBC`→`--text-dim`,
  `#fff`→`--white`) — which is why the art inverts correctly in light theme. The icons were
  drawn against this same design system, so every colour had an exact token.
- ⚠️ **`wArt(label, uid)` is mandatory — never inline `W_TILE_SVG[x]` directly.** The art
  carries `<defs>` ids and the same type repeats down the Predefined/User Define lists; two
  copies on screen share an id and the second silently steals the first's `clip-path`, so
  both render as an uncropped smear. `wArt()` suffixes the ids per instance.
- **Create Widget** is a **4-up** tile grid (was 3-up with 22px glyphs); the drawer widened
  480 → **660px** (`--aw-w`, stepping to 600/520/470 down to 1280) because the artwork needs
  the room. Tiles open the real editor via `cwOpenViz()`.
- **Predefined / User Define** rows carry the same art at 44×26 plus the live **hover action
  rail**: Predefined = count · move · add · clone; User Define = count · move · add · **edit**
  · clone · **delete** (destructive, red) — user-defined widgets are yours, so `awUserDel()`
  really removes one. `AW_ART_OF` maps the lists' vis keys back onto a catalogue label.
- ⚠️ **`.awrow svg` had to become `.awrow > svg`.** As a descendant selector it also matched
  the artwork inside `.awrart` and the icons in `.awacts`, and it sits *after* them at equal
  specificity — so it won, crushing the 44×26 illustration to 15px **and** flattening it with
  a single `fill`. The art paints itself from tokens; nothing may set `fill` on it. This is
  the same descendant-selector trap the root CLAUDE.md records for `.agpfgt span`.

### “Empty group” — the drawer’s Structure section (Option 1)

Request, 18 Aug 2026. The Create Widget tab opens with a **Structure** section carrying one
tile, **Empty group**, above the widget types. A group is not a widget, so it gets its own
section rather than a card among the charts — but it belongs in this drawer, because
*“what do I put on this board”* is the question the drawer answers.

- **`W_GROUP_SVG` is DRAWN, not harvested.** The live 8.2.6 drawer has no group tile — a
  group is made from the board there, not from this drawer. It matches the harvested set
  deliberately: same `0 0 100 50` box, same `fill="none"` root, same tokens (`--chip`,
  `--border`, `--text-dim`, `--text-dim2`), so it inverts with the theme like the rest.
  ⚠️ It is emitted **directly**, not through `wArt()` — it carries no `<defs>` ids, so it
  has nothing to namespace, and there is only ever one of it on screen.
- **`awAddGroup()`** is the handler. On an already-grouped board it just calls `addGroup()`.
- ⚠️ **On a FLAT board it converts the board**, and that is more than pushing a group. A
  flat board is `TABS = ['']` — one unnamed band — so the widgets already there need a name
  before a second band can mean anything. They take the **dashboard's own name**; inventing
  “Overview” would put a heading on the board that nobody wrote.
- ⚠️ **An empty flat board is renamed in place** instead of being split, or you would get an
  empty group beside an empty group with nothing in either.
- The conversion goes through `histDo()`, so ⌘Z reverses it — there is a probe assertion for
  undo *and* redo, and another that it survives switching to another board and back (that
  is what the `boardLoad()` change above is for).
- The search box filters it: typing `group` leaves only this tile, typing `gauge` removes
  it. ⚠️ The “nothing matched” empty state had to learn about it, or a search that matched
  only the tile would print *“No widget types match …”* underneath it.

## Add New Widget drawer (original design notes)

Option 2's drawer is now **in Option 1 too** (`#awDrawer`, `awTab`/`awRender`/
`awAdd`, `W_CATALOG` / `W_PREDEF` / `W_USER` / `W_TYPE_ICON`): three tabs — Create
Widget (18 types in 6 categories) · Predefined (with `used N×`) · User Define — plus
a search that filters all three. It replaced Option 1's flat 8-tile `.wlib`.

⚠️ The two pages have **different widget models**, so `awAdd` is not shared: Option 2
pushes `{id,title,vis}` to `DASH_WIDGETS`, while Option 1 appends a rich object to
`WIDGETS[curG]` — the open **group**. `AW_VIS` maps Option 2's vis keys onto the
types `renderCanvas()` knows (`line→spark`, `big→stat`, `heat→honey`, `text→note`,
`donut→gauge`, `hbars→bars`, `flow→bars`, `rows→table`). Group names live in `TABS`
(plain strings), not a `GROUPS` array.
Entry points rewired: the on-canvas add tile (below), the group-header ＋, and
`gAddWidget()`. The old `#drawer-widget` markup is still on disk but now unreachable.

### Four visualizations audited off the live board (Option 1)

Audited on 8.2.7 at `/dashboard/103708016465` (13 Aug 2026) — 11 widgets read out of the
DOM and compared against Option 1's renderers. Four shapes had **no way to be drawn** and
are now `wBody` types, each seeded into the Overview group so it is on screen:

| type | live widget | why the existing renderers could not do it |
|---|---|---|
| `slo` | SLO Achieved Summary | `wGauge` draws **one** unlabelled arc; the live widget packs a **grid** of arcs each with its SLO name underneath |
| `sptab` | Top Network Monitor by CPU Percent | a Top-N table whose last column is a per-row **gradient area sparkline** — neither `table` nor `spark` alone |
| `hexl` | heatmap availability | one **large hexagon per monitor stacked in a column** with the name under each, under a group heading — a different shape from `wHoney`'s dense honeycomb |
| `empty` | Monitor Wise SLO Achieved | the live board renders **"No data found"**; every widget here assumed it had data, so a query returning nothing had no state at all |

- ⚠️ `wSparkTable` gives each row's gradient a **unique `<defs>` id** (`wsg<seed>`) — the
  same trap as the Add-New-Widget artwork: repeated ids and the second sparkline steals the
  first's gradient. There is a test asserting the ids are distinct.
- ⚠️ Its column widths sit on the `<th>`, not the `<td>` — `table-layout:fixed` reads the
  **first row**, which is the header (already a recorded gotcha in the root CLAUDE.md).
- `wSloGauges` prints `100%` for a full arc but keeps 2 decimals below that (`2.08%`),
  matching the live labels, and still draws a visible stub for a near-zero value.
- The hex list is tighter than the live one (34px hexes, 7px gaps): the live widget is a
  259×1068 column, and this has to work at a normal widget height. It scrolls beyond that.

### The floating Create Widget button — Option 1

`#cwFab` / `.cwfab` / `cwFabGo()`. The live product reaches widget creation from a **fixed
button bottom-right** (`.create-widget-btn`), always in reach however long the board is —
which is exactly what Option 1 lacked: its on-canvas add tile renders **after the last
group**, so on a long flat board like Application Performance it sits far below the fold.

Two deliberate differences from the live circular ＋:
- **It is labelled** "Create Widget". A bare ＋ had already been reported as unreadable in
  the toolbar, and this page carries two other plus-shaped affordances (New Dashboard, the
  group ＋), so words beat a third guessable glyph. Below 1280px it collapses to a 44px
  circle and drops the label.
- **bottom:72px, not the live ~20px** — the dev-only variant-switcher pill owns
  bottom:126px. This is the same slot Option 2's `.addw` uses, so the options agree.

It opens the **Add New Widget drawer** (what the live button does), targets the **last
group** so the widget lands at the end of the board, and is bound into the `W` shortcut's
`sel` so the keycap shows on it. `body:has(#view-dashboard.on) .cwfab{display:inline-flex}`
keeps it off the Approvals / Health / module views with no JS.

⚠️ Testing it needs a **>1280px viewport** — at the probe's default 1000px the label is
correctly hidden, so `innerText` is empty and a naive "is it labelled" assertion fails on
working code. Assert on `textContent`, or size the probe window past the breakpoint.

### The ＋ Create New Dashboard glyph

⚠️ A **bare plus** was unreadable in that toolbar (annotation, 13 Aug 2026) — it sat beside
two AI buttons and the canvas/group ＋ affordances, so it read as "add *something*". The
glyph is now the **product's own dashboard grid with the product's own plus** in the free
quadrant: both paths were lifted from the live 8.2.7 icon set — `custom-dashboard` **minus
its pencil** (that icon means *customise*, not *create*, which is why it was not used whole)
and `plus`, composed as `<g transform="translate(36.15 36.05) scale(.74) translate(-24 -24)">`
in a `0 0 48 48` box. Both paths are `fill="currentColor"`, so it works in either theme.

It stays **icon-only** on purpose — the full "＋ Create New Dashboard" label ran ~180px and
dominated the toolbar (earlier annotation). The words survive in the tooltip, the `N`
shortcut and the list panel's ＋ New Dashboard row.

## "Add widget" lives on the canvas — Option 1

The toolbar's primary button is now **＋ Create New Dashboard** (`#newDashBtn` →
`dashNew()`); adding a widget moved **into the board as a ghost tile**, `addTile()` +
the `.wadd` CSS block.

- **One tile per BOARD**, rendered after the last group in its own `.dgrid12` and targeting
  the last group. It used to be one per group, which put four identical add buttons on a
  four-group board — clutter, not affordance. Adding to one specific group is still the `＋`
  in that group's header.
- **The group title renames in place** (`gNameEdit`, annotation 19 Aug 2026). The caret is
  the collapse control and the **name is its own trigger** — click it (or Enter/Space on it)
  and it swaps for an input; **Enter or clicking away commits, Esc cancels**, and the rename
  goes through `histDo()` so ⌘Z reverses it. The ⋮ menu's *Rename group* opens the **same**
  editor; it used to be a native `prompt()`, which nothing else in this file uses.
  ⚠️ **The name must NOT be inside the collapse `<button>`** — it was, which is why clicking
  the title collapsed the group instead of editing it, and interactive content inside a
  button is invalid and eats the clicks anyway. Same lesson as the AI panel's chat-name
  trigger.
  ⚠️ **Clear `onblur` before swapping the input away.** Removing a focused input fires blur
  synchronously and re-enters the commit mid-swap — the `acNameDone` gotcha, in a second
  place now.
- ⚠️ **An empty GROUP is a bare drop area (`.gdrop`), not an add tile** (annotation,
  19 Aug 2026: *"add empty group only"*, with a pointer to Datadog). **Checked against
  Datadog**, which this group model is copied from: a group there is a **container** — you
  select widgets and press **Group** (⌘G), each group gets a custom header and is
  collapsible, and widgets are **dragged** in and out. It carries no add-widget button of
  its own; the group's ＋ lives in its **header**, which is where Datadog puts group
  controls too. Notably **Datadog has no "create an empty group" flow at all** — its Group
  widget schema makes `widgets` required — so the drawer's *Empty group* tile is ours, and
  the empty state it produces is the one thing that had to be designed rather than copied.
  ⚠️ This is **not** the whole-board empty state: a flat empty dashboard still gets the big
  `.wadd` tile, because *"this dashboard has nothing on it"* is a different sentence from
  *"this group is waiting for widgets"*. (`.gempty`, the old text row, is still gone.)
  ⚠️ **The `＋ New group` button (`.gnew`) is gone too** (annotation, 19 Aug 2026), along with
  its CSS — the drawer tile is the single entry point now, and it is the one that knows how
  to convert a flat board. The `G` shortcut survives but runs **`awAddGroup()`**, not
  `addGroup()`, and its `sel` is empty because there is no control left to carry the keycap.
  ⚠️ The end-of-board tile is back to its original test, `WIDGETS.some(a => a.length)`. It
  was briefly also skipped when the last group was empty (18 Aug 2026), because an empty
  group rendered the same `.wadd` tile and the two stacked one under the other. With
  `.gdrop` there is nothing to duplicate.
- Tile body → the three-tab Add New Widget drawer. Five **quick-add buttons**
  (`.waQb`) add the four most-used catalogue types plus the AI suggestion in one
  click, through the same `awAdd()` / `addWidgetFromLib('ai')` the drawer uses.
  `WA_QUICK` holds the type names/keys, taken from `W_CATALOG` so they can't drift.
- Grounding: Grafana reveals an **Add panel** control on the canvas inside the group
  you point at; Datadog labels the control exactly **Add Widget**; live 8.2.6 reaches
  the same drawer from a floating ＋ (research notes §7).
- ⚠️ Options 2 and 3 still have the toolbar button — this is Option 1 only.

## Keyboard shortcuts & undo / redo — Option 1

**Shortcuts.** One registry, `KB`, drives three surfaces: the key handler, the keycap
`kbTag()` appends to a control's own tooltip, and the **`?` cheat sheet** (`kbSheet` /
`kbOpen` / `kbClose`, also reachable from the profile popover). Single keys, no
modifier — `N` new dashboard · `W` add widget · `G` new group · `E` edit mode ·
`D` list · `O` outline · `T` time range · `F` full screen · `/` search · `S` share ·
`A` AI. Suppressed by `kbTyping()` (focus in a field) and `kbBusy()` (a drawer/menu is
open, or the active view isn't `#view-dashboard`).

- `kbTag()` is called from **`tipFor()`**, i.e. at hover time, not at render time — so
  it also covers every control the canvas, menus and flyouts rebuild on each render.
  A `sel` in the registry is what binds a key to a control.
- `tipRedundant()` now never suppresses a tip carrying a keycap, or the shortcut hint
  would be hidden on exactly the buttons whose label matches their tip.
- ⚠️ `toggleFS()` / `toggleDPanel()` write **`data-tip`**, not `title`: the tooltip
  engine adopts `title` once and then ignores it, so a re-set `title` never showed.

**Undo / redo.** Snapshot history (`HIST`, `histState` / `histDo` / `histWas` /
`histUndo` / `histRedo` / `histLoad` / `histRender`), ⌘Z / ⇧⌘Z (`Ctrl+Z` / `Ctrl+Y`,
picked by `KMOD` / `KREDO`), plus the two toolbar buttons `#undoBtn` / `#redoBtn`.

- The snapshot is `{TABS, WIDGETS, GRP_SHUT, curG}` — the whole board model. Every
  mutating action calls **`histDo('<what it did>')` before mutating**; add a new
  board action and you must add that line or it won't be undoable.
- Resize and drag-drop use `histWas(label, before)` instead, so a gesture that ends
  where it started records nothing.
- The buttons **name the edit** ("Undo remove widget") and **dim rather than
  disable**, because `pointer-events:none` would stop the tooltip explaining why
  nothing happens (`.icobtn.off`).

### The time-range chip lights only while its popover is open

⚠️ `trToggle()` lit `.timechip` and opened `#trPop`, but **click-outside and Escape stripped
`.on` from the popover only** — so dismissing it left the chip wearing its teal active
border with nothing open, and it stayed lit for the rest of the session (annotation,
19 Aug 2026). All four close paths go through one **`trClose()` → `trPaint()`** now:
click-outside, Escape, `trSet()` (picking a preset) and `trApply()` (an absolute range).
Anything that closes that popover in future has to call `trClose()`, not
`trPop.classList.remove('on')`.

## Create Dashboard drawer — now in Option 1 too

Option 2's drawer (`#ddrawer` / `#ddScrim`, `openCreateDrawer` / `ddCreate` / `ddUpdate` /
`ddReset` / `ddPrev` / `ddVis` / `ddNewCat`, `DD_USERS` / `DD_PREV_W`) was **ported verbatim**
into Option 1, so ＋ Create New Dashboard opens the real form: Dashboard Name* ·
**Description** · Category* + Create New · Public/Private with the live note text ·
Default landing switch · the four layout sliders with the live preview · Advanced
Settings · docs link / Reset / Create.
`openEditDash()` is the same drawer pre-filled — both were toast stubs here before.

⚠️ **Option 1's drawer has DIVERGED from Option 2's** (requests, 18 Aug 2026). Two changes,
neither ported:
- **Advanced Settings is always open and is no longer a disclosure.** `ddAdvToggle()` is
  **deleted**, `.ddadv` is `display:block` with no `.on`, and the header is a `<div>`, not a
  `<button>` — the caret (`.ddcar`), the `:hover` and the pointer cursor went with it,
  because a heading that cannot be clicked must not look clickable. `ddReset()` no longer
  strips the classes either. It still carries `optional` on the right.
- **Description moved out of Advanced Settings into the main form.** It sat *above*
  Dashboard Name for one build (18 Aug 2026) and is **second** now, under the name
  (19 Aug 2026: *"in top show dashboard name"*). So the order is Name → Description →
  Category, the required field leads, and `openCreateDrawer()`'s focus on `#ddName` follows
  reading order again. Don't move it back above the name without re-reading both requests.

- `.ddhead` / `.ddx` already existed in Option 1 for the Add New Widget drawer, so those two
  rules were **not** re-copied. Nothing else collided (checked before porting).
- `dashNew()` just opens the drawer. `ddCreate()` keeps Option 2's list-panel bookkeeping
  (category, new-category, visibility, extras in the toast) and then calls
  **`newFlatBoard(name, cat)`**, which is what makes the board here.
- `#ddrawer.on` is in `kbBusy()`, so single-key shortcuts don't fire behind the open form.

## Groups are optional — a created dashboard is a flat board (Option 1)

`newFlatBoard()` resets the canvas and opens the new dashboard **ungrouped** — one flat grid
with the add-widget tile, **no group band and no Groups ▾**. (There is no `＋ New group`
button on any board any more — see below.)

- The model is unchanged: an ungrouped board is `TABS = ['']` with a single widget list, so
  add / drag / resize / undo all work without knowing the mode. `ungrouped` is the flag;
  `UNGROUPED` is the set of boards that **keep their own store**.
  ⚠️ **Those two are no longer the same test.** `boardLoad()` used to set
  `ungrouped = UNGROUPED.has(n)`; it now derives it from the model —
  `TABS.length === 1 && TABS[0] === ''` — which is what the sentence above actually
  describes. With the old test, a flat board that gained a group was re-flattened the next
  time you switched away and back: `TABS` held two entries while `ungrouped` said one, and
  the canvas broke.
- ⚠️ **Every pre-existing dashboard shares one demo dataset** in this prototype — the canvas
  never swapped per board, it just re-seeded from `wShift`. Creating a flat board empties
  `TABS`, so without a store the demo groups never came back. `DEMO` captures the shipped
  dataset at load, `BOARDS[name]` holds created boards, and `boardSave()` / `boardLoad()`
  run either side of `pickDash`.
- `renderOutline()` lists widgets instead of bands on a flat board; `addTile` and `awAdd`
  drop the "group" wording; `renderTabs()` says "Created just now" while `dashFresh`.
- **A flat board is grouped from the Add New Widget drawer** — see *Empty group* below,
  which is now the **only** entry point on any board. Until 18 Aug 2026 `addGroup()`'s only
  entry point was the `.gnew` button, which this mode hid, so a board created flat stayed
  flat forever; `.gnew` was then removed outright on 19 Aug.
- **`Application Performance` ships flat, and is now a copy of the live Alert Summary
  board** (`/dashboard/10000000001004`, build 8.2.7) — 11 widgets in the live order and the
  live 3-column shape, seeded into `UNGROUPED` / `BOARDS` next to the `DEMO` capture. It is
  the worked example of the flat layout; every other stock dashboard stays grouped.
  - Copying it needed **three new widget renderers**: `donuts` (the ring cluster behind
    Monitor Availability / Alert Count), `pie` (the five "Top … by Alert Count" widgets,
    pie + legend) and `hbars` (labelled horizontal bars). `wHoney` gained an optional
    `pal` so a board can weight the heatmap its own way — the live Alert Summary grid is
    red-heavy, not the default green-heavy fleet.
  - A widget may now carry **`rows`** instead of `h`, which spans grid rows and stretches
    (`data-h` goes to 0 so `fitCanvas` leaves it alone). That is what puts the tall
    heatmap beside two stacked rows, and it means auto-placement alone reproduces the
    live layout from the widget order.
  - ⚠️ **The source board is full of real identifiers** — hostnames on `mindarray.com` /
    `motadata.local`, internal `10.x` / `172.x` addresses, and people's laptop names
    (`<name>-ThinkPad-T490`, `<name>-PC`). Everything copied in is scrubbed to RFC 5737
    ranges, `example.com` and neutral device names. Anything harvested from the live
    instance must get the same treatment before it lands in a published page.

## Version history & per-widget AI summary (Option 1) — both BEYOND the live product

⚠️ Neither exists in 8.2.6. Research notes §4 lists the dashboard actions (Clone / Edit /
Delete / favourite / default landing / visibility / PDF export / schedule) and §9 the widget
ones (Edit / Clone / Full Screen / Share / Remove, plus 8.2.5's **Metric Insight** — which is
statistics, not a written summary). Both of these are proposals; flagged in code too.

**Version history** — `Version history` in the dashboard ⋮ menu → `openVersions()` and the
`#drawer-versions` panel. `vhList()` builds the rows without any new bookkeeping: `HIST`
already snapshots the board *before* every mutation, so entry *i*'s snapshot is the state
before edit *i*, and the state **after** edit *i* is entry *i+1*'s snapshot (or the live
state for the newest). This session's edits are therefore real and **`vhRestore` genuinely
restores them** — and because the restore itself goes through `histDo()`, ⌘Z undoes it.
Rows older than the session come from `VH_SEED` + `vhSeeded()`, which trims widgets off the
board so an older version really is a smaller board.

**Per-widget AI summary** — `✦` in every widget header (`.wai`, revealed on hover like
`.wdots`) and the first item of the widget kebab → `openWAI(gi,i)` and the `#drawer-wai`
side panel. `waiFor(w)` generates the text **from the widget's own model** — a `pie` reads
its own totals and top share, `hbars` its leader and ratio, `stat` its value and delta — so
no two widgets produce the same summary and the panel can't describe a widget that isn't
there. Violet (`--ai*`) throughout, since that is the AI accent in this folder.

## Manage dashboards (`md*`) — Option 1, built from the ServiceOps revamp

A **full-page management screen**, reached from *Manage dashboards* at the foot of the
dashboard list panel (`openManage()` → `mdOpen()`). Built 24 Aug 2026 from
`zenichakalasiya.github.io/ServiceOps_Dashboard_v2/#/dashboards`, **driven in the browser** —
every column, action, operator and confirm below was read off that DOM, not guessed.
Namespace `md*` / `MD_*` / `.md*`, **grepped free first** (0 classes, 0 functions).

**What the reference does, and what this reproduces**

| piece | what it has |
|---|---|
| head | `Manage dashboards` + **＋ New dashboard** (primary) |
| filter bar | *"Select field or enter a keyword to search…"* → the four fields **Category · Visibility · Status · Owner**; each becomes a chip with its own **Is / Is not** operator, a checkbox list of values, and **Done** |
| tabs | **All · Created by me · Shared with me · Archive**, each with a live count |
| bulk bar | appears on selection: `N selected` · Move to category · Disable all · **Archive** · Clear |
| table | ☐ · Dashboard · Category · Technician access · Status · Updated · Actions, five columns sortable |
| row actions | Duplicate · Edit · Schedule · History · Archive |
| Archive tab | swaps the actions for **Restore** and **Delete forever** |
| drawers | **History** (From/To + Search, `Event · Event time · Module · User · Change summary`, "Showing N events") and **Schedule** (Search + ＋ Create Schedule, `Name · Schedule type · Time filter · Enabled · Actions`) |

- ⚠️ **A SYSTEM DASHBOARD HAS NO ARCHIVE.** The reference's first three rows carry four
  actions and the rest five; `MD_META[...].lock` is the rule behind that, and `mdBulk`
  reports what it actually archived rather than what was selected when the two differ.
- ⚠️ **The confirm is INLINE IN THE ROW** — *"Archive this dashboard? Yes No"* — not a
  modal, so the thing you are about to archive stays next to the question. `MD.conf` holds
  **one** name: two open questions in one table is two things to answer with no way to tell
  which Yes belongs to which.
- ⚠️ **The confirm is `position:absolute`, and it has to be.** The Actions column is 180px
  and `td` is `overflow:hidden`, so in flow it rendered as *"…dashboard? Yes No"* with the
  first three words cut off. Out of flow it sizes to its own text and overhangs the column.
- ⚠️ **A picked filter field is a DRAFT until Done.** Filtering on every checkbox tick would
  re-render the table under the pointer while you are still choosing values. A field with
  nothing ticked is dropped rather than left as a chip that filters nothing.
- ⚠️ **`DASH_GROUPS` grew from 2 dashboards to 8** on the same day, and the reason is in a
  comment at the constant: Option 1's data was deliberately tiny so the grouped and flat
  canvas layouts sat one click apart — which still holds — but a management table with two
  rows demonstrates nothing. `MD_META` hangs the management-only fields off those names
  rather than duplicating the list, so the panel and the manage screen can never disagree
  about what exists.
- ⚠️ **`Delete forever` is the only action that touches the real model** — it splices the
  entry out of `DASH_GROUPS` and `DASH_INDEX`, which is what the list panel reads. Archive
  is a `MD_ARCH` set, so it is reversible.

**⚠️ THE FLOW IS THE REFERENCE'S; THE LOOK IS THIS PROTOTYPE'S** (request, 24 Aug 2026:
*"the visualization is not set on the current UI — set the components"*). The first build
skinned itself like ServiceOps — a 20px `<h1>`, sentence-case headers, 36px pill buttons, a
50px tinted bulk bar — which is that product's component set, not this file's. Everything is
now assembled from what the prototype already has, which is the rule the root `CLAUDE.md`
states for the Settings form: build new controls from what is there and the addition reads
as native.

| part | component reused |
|---|---|
| head | **`.pagehead` + `.ttl`** (44px, 15px/600) — the header every other screen here uses |
| table | **`.stcgrid`**, the grid cloned from the live product for Compliance Settings — its header case, 40px rows, borders and hover come free and cannot drift from the product |
| buttons | `.btn` / `.btn.pri` |
| row actions | `.stcib` |
| tabs | `.dtabs` / `.dtab` |
| search | the `.dsearch` shape |
| switch | **`.ddswitch`**, the Create Dashboard drawer's own |

- ⚠️ **Only what did not already exist is new**: the bulk bar, the inline row confirm, the
  faceted filter popover and the drawers' bodies — each built from the same tokens, so there
  is no imported colour anywhere in the block.
- ⚠️ Because the table is `.stcgrid`, its headers are **uppercase again**. The first build
  cancelled the host `th` rule to get the reference's sentence case; that was matching the
  wrong product, and the cancel is gone.
- ⚠️ **`.ddswitch` is authored as a flex child** (`flex:0 0 34px`). In a table cell it is a
  plain span, and `width`/`height` do not apply to a non-replaced inline element — it needs
  an explicit `inline-block`, scoped here so the drawer's own switches are untouched.
- ⚠️ **The row checkboxes need `accent-color` AND `color-scheme`** — the recorded
  `.aick input` rule, hit again. `accent-color` only tints the *checked* fill, so in dark
  theme every unchecked box painted as a bright white square.

**Deliberate differences from the reference**, so nothing here is mistaken for it:
- a **back arrow** in the head — the reference reaches this screen from a panel that stays
  on screen, and here it replaces the board, so there has to be a way out;
- colours are **this file's tokens**. ServiceOps is light-only; its `#3d8bd0` primary,
  `#364658` ink and `#f0f8ff` bulk bar have no dark counterpart, so importing them would put
  four colours in the file that no token owns — the send-button rule;
- the row **drag handle is decorative**: the list panel's order comes from `DASH_GROUPS` and
  there is nothing to persist a manual order to. It is drawn because the affordance is part
  of the design being reviewed, and it does nothing.

**Traps this build hit, all already recorded elsewhere in this file and all hit again:**
- ⚠️ **`table-layout:fixed` takes its widths from the FIRST row**, so the two drawer tables'
  column widths sit on the `<th>`s. Without them five columns split evenly and *"Update
  Restricted Group"* truncated while Module sat in empty space.
- ⚠️ **`.mdfb input` matched the checkboxes inside `.mdfpop`**, which is a child of the bar —
  `min-width:120px` made every filter checkbox a 120px black slab and pushed its label to
  the right of it. It is `.mdfb>input` now. Exactly the descendant-selector trap recorded
  for `.agpfgt span` and `.awrow svg`: when a container gains new child types, scope its
  rules to the child you meant.

⚠️ The old concept popover (`#managePop`, `mgAct`) is **kept and unreferenced**, the house
pattern — `openManage()` leads here instead.

### Its chrome was rebuilt from the product's own components (24 Aug 2026)

Three requests, each replacing a ServiceOps-shaped control with one this file already owns.
The **flow** is unchanged; only what it is assembled from moved.

- **Tabs are `.lxtab` underline tabs in their own row** under `.pagehead`, not `.dtab`
  segmented pills inside the toolbar. `.dtab` is the dashboard LIST PANEL's two-way switch
  inside a 340px column; these four are the screen's top-level navigation, and the product
  spells that as text tabs with a 2px underline on a hairline. `.lxtab` is this file's own
  copy of that bar, cloned from the live Log Explorer.
  ⚠️ They had to LEAVE `.mdbar` — an underline tab needs a baseline, and crammed to the
  right of a filter field it read as one more toolbar control.
- **The filter field became `.stcsearch` + a `.stcaddf` `＋ Filter`.** The combined
  funnel-on-a-full-width-bar is the reference's control; in this product's chrome that reads
  as a filter, not a search. `.stcsearch` is the product's search box, already cloned here
  for the Compliance pages — so it inherits the live geometry *and* its `≤1366px → 260px`
  step for free. **The faceted filter is not lost**: it needed its own door once clicking
  the box types, and the popover still anchors to `#mdFb`, now the wrapper around ＋ Filter.
  ⚠️ That wrapper is a `<span>` around the button, not the button — `.mdfpop` is absolutely
  positioned with its own `<button>`s inside, and interactive content nested in a `<button>`
  is invalid and eats the clicks.
- **Bulk actions are `.stcsq` icon tiles at the END OF THE TOOLBAR ROW**, not a strip of
  their own. `.stcsq` IS the product's square icon toolbar. As a separate strip it pushed
  the grid down 46px the moment you ticked a box, moving the rows you were still choosing
  from; on the toolbar's line nothing below it shifts.
  ⚠️ `#mdBulk` owns `margin-left:auto`, **not** `.mdbulk` — the inner node is only as wide
  as itself, so an auto margin there is 669px short of the row's edge and looks like the
  rule not applying. `#mdBulk:empty{display:none}`, or a zero-width flex item still draws
  the row's 8px gap on each side of nothing.
  ⚠️ Each tile carries a `data-tip`; the label was the only thing saying what these do.
  **Clear stays a word** — it is the way out of the selection, not an action on dashboards.
  ⚠️ **The tile fill flipped twice and both times for contrast, measured not eyeballed.**
  On the old `--sel`-tinted strip `--chip` was invisible (7 points apart) so it was
  overridden to `--card`; on the page background `--card` is the invisible one — light
  `--bg` IS `#ffffff` — so it is back to `.stcsq`'s own `--chip`. Dark was fine either way,
  which is exactly how this gets missed.
- ⚠️ **`mdMoveMenu` is viewport-clamped now.** It anchored its 200px menu to the trigger's
  left edge and got away with it while that was a ~160px text button; with a 30px tile
  sitting ~130px further right it ran off the screen (measured 9px over at 1710px wide).
  The rect must be read AFTER the append or the menu has no width yet.
- ⚠️ **`.mdfb*` is gone** and `.mdfw` / `.mdchips` / `.mdtabs` replaced it.

⚠️ **The list panel's own `Manage dashboards` control changed with it.** It was a 34px
icon-only square carrying the `custom-dashboard` grid-plus-pencil glyph at 14px, which
renders as a blob and needed a tooltip to say what it was — the same lesson already recorded
for the toolbar's bare ＋. `.dfoot` is a **column** now: the teal primary keeps its full
width, and *Manage dashboards* is a quiet full-width labelled row beneath it (Lucide
`sliders-horizontal`, a trailing chevron because it leaves for a full-page screen where ＋
opens a drawer). ⚠️ `.dfoot`'s `min-height` moved 49 → 85px (9 + 31 + 6 + 30 + 9) and the
arithmetic is in a comment — this is the panel where fixed rows compete with the footer.

## Dashboard list panel

Grounded in research notes §2 (two radio-tabs, search, category tree with counts,
type + lock indicators, current dashboard highlighted).

⚠️ **Option 1's data is deliberately tiny**: `DASH_GROUPS` is one category (PMG) with two
dashboards — **Log Statistics** (grouped) and **Application Performance** (flat) — so the
two canvas layouts sit one click apart. `DASH_FAVS` / `DASH_RECENT` were trimmed with it;
anything referencing a removed name would leave the panel counting rows that don't exist.
Options 2 and 3 still carry the full ~70-dashboard tree.

⚠️ **Option 1 opens on `Application Performance`** (`dashState.cur`), the flat board.
`init()` renders the canvas from the grouped demo data before the panel's script block runs,
so that block has to call **`boardLoad(dashState.cur)` + `renderCanvas()`** or the opening
board and its layout disagree — the title says one board and the canvas shows the other.
The static `#dashTitle` / `#crumbCat` in the markup carry the same defaults so the pre-JS
paint isn't briefly wrong.

- **Filter chips** (`#dlegend`, `renderDashFilters`) — `All · ★ Favorites · System ·
  Mine · Shared`, each with a live count, clicking an active chip clears it.
  `dashState.filter` and `dashItemVisible()` already existed; **nothing in Options 1
  and 2 could set them**. The row was a static legend that merely *described* the
  three type icons, so it now does the job it was describing — same icons, no extra
  vertical space.
- **A filter expands its matches**, exactly as search already did. With categories
  collapsed the chip read "6 favorites" while only 3 rows were on screen.
- **`#dtools`** under the search box — `12 of 66 dashboards` plus **Expand all /
  Collapse all**. The live product has ~70 categories, and there was no way to open
  or fold the whole tree.
- **Keyboard** — ↑/↓ walk the visible rows (`.kbd` cursor), Enter opens (with no
  cursor it opens the top hit), Esc clears the search.

⚠️ **The panel's fixed rows compete with its footer.** `.dpanel` is a flex column
whose only flexible row is `.dtree`; everything else (tabs, search, `#dtools`,
`.dfilt`, `.dfoot`) is fixed. When the filter chips wrapped to two lines the fixed
rows exceeded the panel height and pushed **＋ New Dashboard** off the bottom
(measured: panel 187px vs 245px of children). The chips are therefore
`flex-wrap:nowrap` on one line, the "All" chip carries no count, and `.dpanel` is
`overflow:hidden`. Adding another fixed row here needs the same arithmetic re-checked.

⚠️ Option 3 is the **deliberately different** picker, so it kept its own filter-chip
design and only gained what it lacked (count line, expand-all, keyboard,
click-again-to-clear). Its rows are `.drow`; Options 1 and 2 use `.frow`.
⚠️ In Option 3 the count is of **dashboards, not rows** — that picker repeats a
dashboard under Favorites / Recently Viewed *and* its category, so rows > count is
correct there.

## Widget resize & move (all three options)

**Resize** — one engine shared by all three (`wRzDown` / `wRzMove` / `wRzUp` /
`wRzReset`, above `toast()`). Every widget carries three grips: a corner (`.wrz`,
both axes), a right edge (`.wrzE`, width only) and a bottom edge (`.wrzS`, height
only). Width is measured in **grid columns** so widgets stay on the grid; height is
free pixels. A live `.wrzbadge` reads out `8/12 cols · 248px`. Double-clicking a
grip restores the authored size — which only works because the first resize stashes
`_span0`/`_h0`; clearing a "userSized" flag alone leaves the widget at its new size.

Each page supplies its own `wRzCommit(el, span, h)` because the widget models differ:

| | model | commit target |
|---|---|---|
| Option 1 | `WIDGETS[curG][i]`, rich objects, per **group** | `data-g` / `data-i` |
| Option 2 | `DASH_WIDGETS` `{id,title,vis,span,h}` | `data-wid` |
| Option 3 | four hardcoded strings → now keyed `a–d` + `W3_ORDER` / `W3_SIZE` | `data-wid` |

⚠️ Option 1 renders heights as `w.h * hMul` (`fitCanvas` scales the whole board), so
the commit divides `hMul` back out — otherwise the widget grows again on every
re-render.

**Move** — a `.wgrip` handle (⠿) in every widget header makes dragging discoverable;
the whole widget stays draggable. `draggable` is set false for the duration of a
resize, or the corner starts a move instead.

⚠️ **Options 2 and 3 were upgraded from a 2-column grid to 12 columns** so widths can
be dragged in column steps. Default `span 6` reproduces the old 2-up layout exactly.

⚠️ **Option 2 already had drag-to-reorder** — bound with `addEventListener` in
`wireWidgetDnD()` after every render, which an `ondrop=`/`ondragstart=` grep does not
find. Adding a second engine redeclared `wDragId` and the `SyntaxError` blanked the
whole page. Grep for `addEventListener('drag` as well before concluding a page has no
drag. Option 3 genuinely had none and uses inline handlers.

## Light theme

`--bg` / `--card` / `--sidebar` / `--header` are all `#ffffff`, so widgets are
separated from the page by their border alone: `--border-soft:#e3e8f2` (this token
**is** the widget edge). Widget hover adds `0 3px 12px rgba(0,0,0,.10)`, scoped
`html[data-theme="light"]` and covering both `.widget` (Option 1) and `.dwidget`
(the canvas widget in all three). All three files carry the same values.

⚠️ `.widget` has `transition:border-color .14s`, so under headless
`--virtual-time-budget` `getComputedStyle` reports the **pre-transition** border and
looks like the light theme "isn't applying". Trust the paint, or measure an element
without a transition.

## Variant switcher (auto-connected pages)

Every `.html` file in this folder is an option in a floating variant-switcher
pill, rendered by `_variants.js`.

⚠️ The pill sits **bottom CENTRE** (`left:50%` + `translateX(-50%)`, `bottom:18px`) as of
18 Aug 2026. It used to be bottom-right above the ＋ Add widget FAB, but the AI panel is
docked on that same right edge, so it landed on top of the chat's composer and follow-up
chips. The menu re-anchors to centre with it — a `right:0` menu no longer works under the
`translateX(-50%)`. The edit is outside the `VARIANTS:BEGIN…END` markers, so
`_sync_variants.js` will not clobber it.

**MANDATORY: after creating, renaming, or deleting any `.html` file in this
folder, run:**

```bash
node "/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/_sync_variants.js"
```

It auto-adds the page to the switcher list in `_variants.js`, injects
`<script src="_variants.js"></script>` before
`</body>` if missing, and removes deleted files from the list. The deploy workflow
also runs the sync on every push as a safety net, so the live site is always
complete even if a local run was missed. Files starting with `_` are ignored — and
so is anything in a **subfolder**, which is why `_ai-source/` stays out of the list.

The script only ever *appends* new files and *prunes* deleted ones; it preserves
existing order and hand-tuned labels. So to **reorder or rename** an option you do
edit the `VARIANTS:BEGIN…END` block by hand, then re-run the sync to confirm it
reports no changes (that proves the edit is stable).

⚠️ The options are named **Option 1 / 2 / 3**, but the script still auto-labels a
*new* page `V<n> · <page title>` from its `<title>`. Rename it by hand after adding
one, or the switcher will mix both conventions.

### `1` / `2` / `3` switch option

Bare digit, no modifier, on every page — the handler lives in `_variants.js`, so it is
**one implementation for all three options**, not three copies, and a new variant gets
its digit automatically from its index. The menu shows the digit as a keycap on each
row plus a "Press 1 · 2 · 3 to switch" footer, so it is discoverable.

- **Modifiers are left alone** — ⌘1 / Ctrl+1 are the browser's tab switching and Alt+1
  belongs to the OS. Shift is deliberately *not* tested: on QWERTY it produces `!`, which
  never matches, and skipping the test keeps AZERTY layouts working.
- **Suppressed while typing** (`vsTyping()` — INPUT / TEXTAREA / SELECT / contenteditable).
  These pages are full of fields the digits would otherwise be stolen from: the AI chat
  composer, its history search and rename inputs, the dashboard search, the Create
  Dashboard form, the query editor.
- Pressing the digit for the page you are already on is a **no-op**, not a reload.
- The keys were free — Option 1's single-key registry (`KB`) is letters only
  (N W G E D O T F / S A), and no page bound a bare digit. Grep before adding one.
- ⚠️ Edits here sit **outside** the `VARIANTS:BEGIN…END` markers, and `_sync_variants.js`
  only splices between them, so the sync will not clobber this. Verified by re-running it.
- ⚠️ Testing this needs a **sandbox folder with the same filenames** (`_variants.js` and
  the page basenames both resolve relatively, and `here` is the basename). The check that
  proved it: a temp `_kbtest/` holding loader-stripped copies of all three pages plus
  `_variants.js`, with a runner that drives real navigation between them in iframes —
  9 assertions, all pass. Delete the sandbox afterwards.

## Verifying changes

Driving the page in a real Chrome tab (`python3 -m http.server` + the browser tools) is far
more reliable than headless here — headless runs have hung repeatedly. ⚠️ That server sends
no cache headers, so **add a cache-buster query (`?v=2`) after editing** or you will verify
the previous version of the file and chase a phantom bug.

⚠️ **A GREEN PROBE IS NOT A WORKING FEATURE — assert the CONSEQUENCE, not the call.** The
＋ menu's *Mention* row shipped with a passing suite: the probe clicked it and asserted the
list appeared, which it did. It was still broken — the list could not be **filtered**,
because the composer's `oninput` hides it unless an `@` precedes the caret, so the first
character typed dismissed it. Nothing in the suite ever typed. The bug was found by driving
the page by hand and only then written into a test.
When a control opens something, the assertion that matters is what you can then **do** with
it — type into it, pick from it, see the result land — not that it exists. Two smaller
versions of the same trap the same day: a probe that dispatched `mousedown` synchronously
after the opening click tested before the dismisser's `setTimeout(0)` had attached (two
phantom failures on working code), and several assertions kept passing against selectors
the markup no longer had, because they were only ever checking that *something* was there.

Screenshot with headless Chrome (quote paths; strip the Agentation loader first —
it can hang the run):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox --user-data-dir=/tmp/cp \
  --hide-scrollbars --window-size=1500,950 --virtual-time-budget=2500 \
  --screenshot=/tmp/out.png \
  "file:///Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/index.html"
```

The most efficient check is a **probe copy**: inject a script that calls the
functions under test, collects `ok`/`ERR` per call plus `window.onerror`, and
paints the result into a yellow bar at the top of the page — one screenshot then
verifies a dozen behaviours at once.

### The only automated tests (Playwright, at the REPO ROOT)

There is no build, lint or dev server. The one test suite lives **one level up**, in
`/Users/kishanpatel/ObseverOps`, and only smoke-tests that pages load and that the
Agentation widget mounts — it is not a product test suite and it asserts nothing about
the dashboard UI.

```bash
cd /Users/kishanpatel/ObseverOps
npm test                                          # whole repo (50+ pages, slow)
npx playwright test tests/agentation-all.spec.js  # one spec
npx playwright test -g "index.html"                # one test, by title
npx playwright test --headed                      # watch it run
npm run report                                    # last HTML report
```

`agentation-all.spec.js` **auto-discovers** every `.html` carrying the loader snippet, so
this folder's three pages are covered without listing them. Run it after adding a page
here (and after `_sync_variants.js`).

⚠️ **`tests/sidebar-agentation.spec.js` is broken and will fail.** It hardcodes
`['Side_bar_menu', …]` for these same three pages, and that folder was renamed to
`Dashboard_with_AI_Chat` — the `file://` URLs it builds no longer exist. Its coverage is
fully redundant with `agentation-all.spec.js`; fix the paths or delete the spec, but don't
read those 3 failures as a regression in this folder.

## Agentation (design-feedback widget)

Each page ends with a **dev-only** loader that injects `agentation-embed.js` (it
no-ops off `file://` / localhost, so it never ships). Annotations come back via the
`mcp__agentation__*` tools; resolve each one with a summary of what changed.

The loader also injects a **stacking fix**. Agentation paints its toolbar at
z-index 100000 and its marker/canvas layers at 99996–99998, while `dashboard-grouped-sidebar.html`'s
drawers sit at 100001 / 200001 (they have to clear the variant pill at 99999) — so
an open drawer buried the annotation layers and notes could not be attached to
anything inside it. The fix lifts `[data-agentation-root] > *` above everything.
Note the consequence: **while annotate mode is on, clicks inside a drawer go to
Agentation, not the app** — pause it (⏸) to use the UI.

## Gotchas

- **A `</style>` written inside a CSS COMMENT ends the stylesheet.** The HTML parser leaves
  "in style" mode on those literal characters even inside `/* */`, so a comment that mentions
  the closing tag terminates the sheet and every rule after it renders as text down the page.
  It looks like a catastrophic edit and is one character class. Same shape as the
  `</scr`+`ipt>` trap the root CLAUDE.md records for scripted `sed` inserts — write "this
  block's closing tag" instead. ⚠️ **The tell is countable**: a substring count of `</style>`
  returning 2 while the line-start count returns 1.
- **Before picking a component's size/variant, read the DS registry's `usageRules.<opt>.dontUse`
  — not just its `enum`.** `obs-steps` shipped here as `size="small"` on a spacious top-of-form
  wizard, which its own registry rules out in as many words ("don't use small on a spacious
  horizontal wizard — the markers look cramped"); `small` is the VERTICAL compliance rail's
  number. The enum said it was legal, the usage card said it was wrong. `get_component`
  carries a card for every option — the answer to "which value?" is usually already written.
- **An inline `on<name>=` attribute only works for events the HTML spec lists as handlers.**
  `onclick`/`onchange`/`oninput` are fine; a CUSTOM event name (`oncellaction`, `onrowaction`,
  a component's `onclose`) is inert markup that silently does nothing. Bind those with
  `addEventListener`. ⚠️ This shipped GREEN because the probe called the handler directly —
  see the note on click-driven probes in *The 31 Aug 2026 pass*.
- **A rule that was deleted looks exactly like a rule that is applying.** `.agemt` / `.agemp`
  lost their CSS when a neighbouring block was removed, and the Done step rendered at browser
  defaults for days. Grep every class a component names against the stylesheet; you cannot see
  the difference.
- **Replacing a SLOTTED child re-renders the whole web component.** It fires `slotchange`, and
  a component that animates on render will replay that animation — with no attribute changing,
  so every state-based assertion still passes. Patch the *inner* content of a slotted node, never
  the node itself.
- **Grep before naming a CSS modifier, not just a function.** A header-button modifier
  called `.wl` collided with the widget-library tile `.wl` (`flex-direction:column`,
  `svg{width:100%}`) 700 lines away — same specificity for the properties it declared, so
  the buttons rendered with the glyph stacked *above* the label. Renamed `.aihbw`.
- **A rule that existed only to support something you deleted will outlive it.**
  `.aiinbox.gen{border-color:transparent}` was there so the gradient ring could show
  through; the ring was removed and that rule, later in the sheet, silently beat the new
  accent border — "generating" rendered with no border at all.
- **`innerText` applies `text-transform`.** A test asserting `/Searched counters/` failed
  against an uppercase `.hd`, and the same trap bit twice. Match case-insensitively, or
  read `textContent`.
- **Compute per-state values inside the branch that uses them.** `aiAgHTML` built the
  widget card's subtitle at the top of the function; a summary agent has no counters, so
  the whole panel threw on `a.ctrs.map`.
- **`until()`-style polling in a probe needs a budget bigger than the flow.** The narrated
  flows run 10–15s; probes written when they took 5s gave up early and then dereferenced
  null. Raise the retry count *and* `--virtual-time-budget`.
- **Old probes encode old behaviour.** Several suites "failed" after requested changes
  (three thinking rows merged into one, Save widget added, exclusive-global dropped) —
  those are stale assertions, not regressions. Read the failure before fixing the code.
- ⚠️ **This file is edited by more than one session.** `index.html` and `CLAUDE.md`
  both gained work on 17 Aug that another session wrote (the header redesign, the
  `.aiamb` ambient glow). Re-read before editing, and expect your own notes to sit beside
  someone else's.

- **Never measure an animating box.** The rail transitions its width over .18s;
  positioning the flyout from `getBoundingClientRect()` caught it mid-transition,
  parked the menu at 64px, and the expanding rail then covered it. Anchor off the
  `--rail-w` / `--rail-w-open` custom properties — custom properties aren't
  transitioned, so they give the target value immediately.
- **Headless screenshots lie about in-flight transitions.** With
  `--virtual-time-budget`, `getComputedStyle` can report the *start* width while
  the paint already shows the end state. Confirm which CSS rules match before
  concluding a rule "isn't applying".
- **`JSON.stringify` inside an HTML attribute breaks it** — its double quotes close
  the `onclick`. Escape to `&quot;` (see `mfAttr`).
- **A tab driven through browser automation is not focused, so CSS transitions are
  frozen** and `getComputedStyle` returns the *start* value indefinitely — waiting longer
  does not help. ⚠️ **Headless does this too.** Verifying Option 3's collapse toggles, the
  token read `--rail-w:224` while the painted box still read 58px 600ms later, and the
  sliding `.dpanel` was stuck at `margin-left:-193px` between -251 and 0. Two ways out,
  both used: read a **custom property** (they are never transitioned, so they report the
  target immediately), or inject
  `*,*::before,*::after{transition:none!important;animation:none!important}` into the
  probe copy — which is what turned 2 phantom failures into 14/14 pass. Collapsing Option 3's sidebar read `width:224px` 400ms after the class
  landed, while the same frame screenshotted as a 58px rail. Confirm width/padding changes
  from a **screenshot**, or measure a property that isn't in the `transition` list.
- **`fitCanvas()` scales `data-h`, so a widget with `data-h="0"` gets `height:0`.**
  KPI tiles render `data-h="${w.h||0}"` because they size to their content, and the
  whole KPI row was drawing as three empty hairlines. The list is now filtered to
  `+el.dataset.h > 0`. Anything added to that grid without an authored height must
  stay out of the scale list.
- **Porting a block by line range drags in neighbours.** Copying V2's panel pulled
  in its `<div id="dcanvas">`, which sat in-flow in `.dwrap` and stole half the
  canvas width. After any port, dump the container's children and check for
  duplicate ids.
- `position:absolute` panels need a `position:relative` parent, or they anchor to
  the viewport and cover the header.
- **The host stylesheet already styles bare `td`, and one of the rules is
  `white-space:nowrap`.** A new table in these files inherits it, so `table-layout:fixed`
  and `word-break` do nothing and the table just grows wider than its container — which
  looked like a broken width, not a wrapping bug. The Log Explorer's `.lxattr td.v`,
  `.lxtable td` and `.lxpat td.p` all have to say `white-space:normal` explicitly.
  Diagnose by dumping `getComputedStyle(cell).whiteSpace`, not by eye.
- **`const` shadowing inside one long function is a silent page-killer.** Adding
  `const step = lxStep(max/5)` to `lxPlot()` collided with a `const step` further down the
  same function; the whole `<script>` block failed to parse, so *every* `lx*` name was
  undefined — and because element ids become window globals, `lxTree` reported
  "is not a function" rather than "is not defined", which points at the wrong thing.
  ⚠️ **`node --check` the extracted block before screenshotting**: pull the `<script>`
  out to a `.js` and run it. It names the line in one second; a probe run does not.
- **A `position:fixed` overlay belongs INSIDE its `.view` section.** `#lxDet` is fixed but
  sits inside `#view-logexp`, because a fixed element inside a `display:none` ancestor is
  hidden — leaving the module while the log-detail panel is open can't strand it on screen.
- In dark theme `--pop` and `--border` are **the same colour**, so hairlines inside
  popovers draw nothing. Use `--pop-line` for dividers in a `.pop`. ⚠️ That token has to
  be **declared per file** — Options 1 and 3 were *using* `var(--pop-line)` without ever
  defining it (only Option 2 had it), so every divider it drove was invisible. All three
  declare it now, in both themes.
- **`.dwrap` is a flex ROW** (panel | canvas). Anything meant to sit *above* the
  canvas must go inside the `.dmain` column with it, or it lays out as a narrow
  strip beside the canvas. This is what hid Option 2's ask bar on first build.
- **`</aside>` is not unique** — it closes both the sidebar and the dashboard panel.
  A scripted insert anchored on it must target the first one and assert it falls
  between `<aside class="sidebar` and `<aside class="dpanel`.
- Re-`Read` files before `Edit` (the IDE reformats them).

## Deployment
Repo: https://github.com/kisu1311/dashboard-enhancement-ai-chat
Live URL: https://kisu1311.github.io/dashboard-enhancement-ai-chat/

⚠️ **Renamed on 18 Aug 2026** from `Side_bar_menu`. The old Pages URL
(`kisu1311.github.io/Side_bar_menu/`) is **dead**; the old *repo* URL still redirects, so a
stale `origin` will keep pushing successfully and give you no sign the name changed —
`git remote -v` is the only check.

⚠️ **This folder is its OWN git root** — `git rev-parse --show-toplevel` returns
`Dashboard_with_AI_Chat`, not `ObseverOps`. So a push from here goes to
`kisu1311/dashboard-enhancement-ai-chat` and touches nothing else; the parent folder is a
separate repo (`kisu1311/variable_color`) and has to be pushed from there. Folder name and
repo name have never matched — the folder was renamed 5 Aug, the repo 18 Aug, differently.

Push to `main` → GitHub Actions deploys Pages (workflow also runs the variant
sync). `gh` CLI is NOT installed — plain `git push` works via keychain, and no
`gh` is needed since the repo, remote, workflow and Pages source already exist.

`agentation-embed.js` is **gitignored** — it is a 540 KB dev-only widget and the
loader no-ops off localhost, so the live site never fetches it. Keep your local
copy; if a teammate clones the repo they will need their own.

⚠️ **`_ds/` IS NOT GITIGNORED, AND MUST NOT BE.** It holds the vendored ObserveOps
design-system bundle (1.27 MB) that the Agentic AI screen's `obs-*` components need.
Unlike Agentation, the live site DOES fetch it — gitignore it and that screen renders
as bare unstyled markup on Pages. See `_ds/README.md`.

⚠️ **This folder is a PUBLIC Pages site, and its demo data is not scrubbed.** The repo
rule (root `CLAUDE.md`) is that anything harvested from the live instance goes to RFC 5737
ranges (`192.0.2.x`, `198.51.100.x`, `203.0.113.x`), `example.com` and neutral device
names before a public push — `Setting/` was scrubbed, **this folder was not**. All three
pages currently ship `cisco_core.motadata.local` / `cisco841.motadata.local` /
`juniper_edge.motadata.local` and the internal addresses `172.16.14.71`, `172.16.8.114`,
`172.16.8.131` (SNMP table, cluster/session tables, NCCM rows, and Option 1's AI starter
answers). Most of it is already committed and live. **Do not add more** — use the
documentation ranges in anything new, and scrub the existing ones when a task next touches
those blocks.

## Handoff
Latest session state is in [HANDOFF.md](HANDOFF.md) — read it first.
