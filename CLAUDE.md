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

Three pages are in the switcher, labelled **Option 1 / 2 / 3**. All three now carry the
shared **`ac*` chat panel** on top of their own AI, **and all three carry the `lx*` Log
Explorer module**, and all three are verified responsive at the seven target resolutions —
see those sections below.

- **`index copy.html` — Option 1 · Sidebar & Header Actions.** The chrome study, and now
  the most heavily iterated page. Datadog-style module rail (see below), the full
  Dashboard list panel ported from Option 2, time-slider strip, dynamic widget canvas,
  widget Share drawer, Full Screen, Export. **Only this page** has the on-canvas
  add-widget tile, the single-key shortcut system with its `?` sheet, and undo/redo.
- **`index.html` — Option 2 · Grouped Sidebar + AI (main prototype).** Sidebar +
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
- `_ai-source/` — `ai-chat-option2.html` and `dashboard-ai-insights.html`, the two
  original AI prototypes the panel was ported from. **The only copies that exist**
  (their old `AI_Chat_Interface/` folder is gone). Kept out of the folder root so
  the variant sync ignores them. Reference only — do not delete.
- `Dashboard-Research-Notes.md` — the verified product research (see MANDATORY
  above). `_variants.js` + `_sync_variants.js` — variant switcher + auto-sync.

## Log Explorer module (`lx*`) — a clone of the live module, in all three options

Until 17 Aug 2026 every module except Dashboards landed on the generic `#view-module`
placeholder card. **Log Explorer is now a real module screen** — read off the live product
(build 8.2.6) at `/log/`, `/log/search` and `/log/live-tail` and rebuilt, not invented. It
is **one CSS block + one `<section id="view-logexp">` + one `<script>` block**, so a change
here is normally a three-file change like the `ac*` panel.

> ⚠️ **It is NOT byte-identical any more (18 Aug 2026).** Option 1 diverged on request:
> its **left log-sources panel was removed** (the Type | Group tabs, the search and the
> log-type tree, plus the `lxPanelBtn` toggle and the `lxPanel` / `lxTreeTab` / `lxTree` /
> `lxTreeToggle` functions), and it gained an **`✦ Ask AI`** button in the head. Options 2
> and 3 still carry both the panel and no Ask AI. Re-sync deliberately or leave them
> different, but don't assume `md5` over the block still matches.

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

Common to all three: violet is the AI accent (`--ai*` in Option 1, `--oa*` in Option 3);
teal stays the product accent. Everything is **canned and deterministic** — nothing calls
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

#### The header is now: `name ⌄ · New · ? · ⧉ Layout · ✕`

Three controls were added on 17 Aug 2026, each from a supplied reference image.

- **The chat name is a DROPDOWN TRIGGER** (`.aihttl` / `aiChatMenu`) — Rename · Delete,
  then **CONVERSATIONS**, which is the whole history. Click-to-rename moved **into** the
  menu, so the name has one behaviour.
  ⚠️ **The header's History button is GONE and so is the "Show all ›" row** (request,
  17 Aug 2026: *"remove the History button because you already set on CONVERSATIONS"*).
  The dropdown absorbed the job — `aiHistOpen()` (the in-body sheet) is **kept but
  unreferenced**, so it can be pointed back in one edit, the way Option 2 keeps `iFocus`.
- **The dropdown lists only the RECENT chats** (`aiChatMenuHTML` / `aiChatListHTML` /
  `aiChatDelRow` / `aiChatPeek` / `aiChatSummary`): `Conversations · recent`, the **five**
  most recent (`AI_CHAT_RECENT`), each with a ✦ avatar, its name and **when it happened**
  (elapsed for today, clock time for any other day), then a **`Show all N ›`** row wearing
  the clock glyph the removed History button used to.
  ⚠️ No date bands here on purpose: over five rows they would be more heading than list, and
  the times already read Today from Yesterday.
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
- **Help** (`aiHelpMenu`) — **two rows only, Documentation ↗ and Support ↗**. The
  reference's third row, *Release Notes*, was explicitly not wanted. Both URLs were checked
  200 before being written in (`docs.motadata.com/motadata-aiops-docs/`,
  `support.motadata.com`); `www.motadata.com/support/` is a 404, don't use it.
- **Layout — `Sidebar · Floating · Full screen`** (`AI_LAY` / `aiLayMenu` / `aiLaySet` /
  `aiLayCur` / `aiLayPaint`), a menu with a ✓ on the current row.
  | row | geometry | can be dragged |
  |---|---|---|
  | **Sidebar** | full-height right column; `body.aisplit` makes `.shell` yield exactly `--ai-w`, so the board keeps its own column | **width**, from the left edge |
  | **Floating** | `.aifloat` — a detached rounded **card** anchored bottom-right with a margin on every side, its own shadow, board fully visible around it | **moved** by its header, **sized** from the left / top / top-left corner |
  | **Full screen** | `.aifs` — takes the viewport, thread centred at 840px | — |
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
  ⚠️ **Sidebar is the DEFAULT** — `let aiSplit = true` (request, 17 Aug 2026: *"open in
  Sidebar with small width"*), which is also what the reference checks. It opened Floating
  until then, i.e. over the board.
  ⚠️ **That is why `--ai-w` was narrowed 520px → 420px** (ladder 420/408/396/384/366/348).
  The width is now subtracted from the canvas on *every* open, and 520px took a fifth of a
  1600px screen before you had asked anything. Every step stays above `AI_SIDE_MIN` (340px),
  or the ladder would land below the drag floor and the grip would appear to do nothing.
  ⚠️ **One token drives both sides** of Sidebar — `--ai-w` is the panel width *and* the
  padding the shell gives up (the `--dp-w` lesson in the root CLAUDE.md). `body.aisplit`
  also shifts the `.cwfab` Create Widget button, fixed bottom-right, out from under it.
  ⚠️ **Order matters in `aiLaySet('full')`**: `aiFsTog()` only strips `body.aisplit` when it
  finds `aiSplit` still true, so clearing the flag *before* calling it left the shell holding
  its column open behind a `100vw` panel. Toggle first, then clear and repaint.
  ⚠️ The *preference* lives in `aiSplit`; the body class is owned by `aiOpen`/`aiClose`, so
  closing the chat gives the column back and re-opening restores it.
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
| **Auto-approve** | finally has a job — with it **off**, Add asks you to confirm first (the button turns amber, "✓ Confirm — add it"); **on**, it applies straight away |

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
- ⚠️ **An under-specified build asks ONE clarifying question first** — *"How should I group
  “X”?"* with a `1 of 1` step counter and six numbered options — and only previews once
  answered. `aiAskGroup` → `aiPickGroup` → `aiPreviewHTML`.

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
- **Composer** = a 46px pill with `＋` on the left, the input, and send on the right.
  Placeholder: *"Ask, build and act across your stack"*.

#### The composer IS the chat area — context and Auto-approve moved inside it

Annotation, 18 Aug 2026: *"the auto-approve action show in chat area and the context will be
also show in chat area"*. It used to be **three stacked strips** — a loose row of context
chips, the input pill, and the Auto-approve toggle floating underneath — so the one place
you act read as three unrelated things. `.aiinbox` now holds all of it:

| row | what |
|---|---|
| 1 | `#aiCtx` — the Scope dropdown + removable context chips |
| 2 | the `<textarea>`, full width |
| 3 | `.aiinrow` — 📎 attach · **Auto-approve** ⏻ … 🎤 dictate · ➤ send |

- ⚠️ **`.aiinbox` changed from a flex ROW to a flex COLUMN.** `.aiinbox textarea` was
  `flex:1` for the row layout and must be **`flex:0 0 auto`** here, or it stretches to eat
  the column and the control row is pushed out of the box.
- `.aictxbar:empty{display:none}` — inside the pill an empty context row would draw a 7px
  gap for nothing.
- Auto-approve is a hairline pill (`.aiauto`, `--ai-line` border when on) sitting **next to
  send**, because it decides what pressing send does. Its switch shrank 30→26px, so
  `.aiauto.on .aisw::after` moved 13→**11px** — change both together or the knob overshoots.
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
- **The thinking trail is TASK ROWS** (`.aitr*` / `aiTrRows` / `aiTrTog` / `aiTrStep`,
  component supplied 18 Aug 2026). Each step of the trail is a **row**, not a line:
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
  - The **collapsed summary header is unchanged** — a finished trail wants one line, not a
    stack of cards. The agentic build's own `.aitki` rows are untouched.
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
- **The box survives the run** (request, 18 Aug 2026: *"this result will be show in this box
  and it will be expand and collapse"*). `.aitk.bx` is now on both states: it glows
  (`--ai-soft` / `--ai-line`) while working and settles to a quiet `--panel-2` card when
  done, with the whole trail expanding and collapsing **inside** it. The card no longer
  disappears and hand over to a separate disclosure.
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
shortcut. Empty → thinking → answer, five canned starters (`AI_CTA`), an **auto-approve** toggle
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

- ⚠️ **Approve & create and Edit share one class, `.aiapv`, on purpose** — the guide's point
  is that a prettier accept button gets clicked without being read. Don't give Approve a fill.
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

Everything below is **Option 1 only** (`index copy.html`, the `ai*` / `AI_*` / `.ai*`
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
- **Widget card** = `Create Widget` + subtitle of the counters + a 3-series chart + legend
  + an **Add to `<dashboard>`** row + a footer of **`Edit · Accept`**.
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
- **Upload file** replaced the ＋ command menu (`aiUpPick` / `aiUpAdd`): a real picker,
  and attachments land in the context bar as removable chips wearing a clip. It does not
  read the file — pretending to parse a CSV is the one thing that would lie about capability.
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
  entry point in all three files and prints the verdict **as text on stdout**. **56 checks**;
  Option 1 runs 51 of them and reports 5 skipped (see below). Run it after any `lx*` change.
  ⚠️ **The three `lx` blocks are no longer byte-identical.** Option 1's **log-sources panel**
  (the Type | Group tree, `lxPanel` / `lxTree` / `lxTreeTab` / `lxTreeToggle` and its markup)
  was removed by annotation on 17 Aug 2026; Options 2 and 3 still have it. The suite skips
  those checks where `#lxTree` is absent — asserting a panel that was deliberately deleted
  is a false failure, not a regression. `lxPickType()` was deliberately kept: the Overview's
  bubble chart calls it too, so filtering to one log type is still reachable in Option 1.
  ⚠️ It reads its result out of a `<pre id="__probe">` block, **not `<title>`** — the module
  emits `'<title>'` strings for its SVG tooltips, so a title-based read finds those instead.
- All four strip the Agentation loader into a temp copy first (it hangs headless runs) and
  wrap Chrome in `perl -e 'alarm N'`, since macOS has no `timeout` and these runs can hang.
- ⚠️ `harness.py` needs `--allow-file-access-from-files` to read across the `file://`
  iframes; it already passes it.

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

The three options are deliberately no longer the same sidebar. Each is modelled on
a real product, studied live in the browser, but all three read the **same
`RAIL` / `SUBNAV` data**, so the information architecture stays the docs-grounded
one and only the presentation differs.

| Option | Pattern | Source studied |
|---|---|---|
| 1 | icon rail + hover mega-menu flyout | Datadog |
| 2 | icon rail + **always-docked panel** that swaps per module | ClickUp |
| 3 | **one flat named column**, no icon rail | DevRev |

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

- The rail shows **7 main entries**, not the live product's 16 — Dashboards,
  Monitors, Alerts │ Explorers, Network, SLO │ Settings — split by hairlines with
  **no captions, counts or chevrons** (Datadog shows grouping, it doesn't label it).
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

## Create Dashboard drawer — now in Option 1 too

Option 2's drawer (`#ddrawer` / `#ddScrim`, `openCreateDrawer` / `ddCreate` / `ddUpdate` /
`ddReset` / `ddPrev` / `ddVis` / `ddNewCat`, `DD_USERS` / `DD_PREV_W`) was **ported verbatim**
into Option 1, so ＋ Create New Dashboard opens the real form: **Description** ·
Dashboard Name* · Category* + Create New · Public/Private with the live note text ·
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
- **Description leads the form**, above Dashboard Name. It used to be the first field
  *inside* Advanced Settings.
  ⚠️ The consequence to know: the first thing in the drawer is now an **optional** field,
  and `openCreateDrawer()` still focuses `#ddName` on open — so the caret lands on the
  second field. That is deliberate (the required field is still what you type into first);
  change `ddName` in that `setTimeout` if the focus should follow the order instead.

- `.ddhead` / `.ddx` already existed in Option 1 for the Add New Widget drawer, so those two
  rules were **not** re-copied. Nothing else collided (checked before porting).
- `dashNew()` just opens the drawer. `ddCreate()` keeps Option 2's list-panel bookkeeping
  (category, new-category, visibility, extras in the toast) and then calls
  **`newFlatBoard(name, cat)`**, which is what makes the board here.
- `#ddrawer.on` is in `kbBusy()`, so single-key shortcuts don't fire behind the open form.

## Groups are optional — a created dashboard is a flat board (Option 1)

`newFlatBoard()` resets the canvas and opens the new dashboard **ungrouped** — one flat grid
with the add-widget tile, **no group band, no ＋ New group, no Groups ▾**.

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
- **A flat board can now be grouped, from the Add New Widget drawer** — see *Empty group*
  below. Until 18 Aug 2026 `addGroup()`'s only entry point was the `.gnew` button, which
  this mode hides, so a board created flat stayed flat forever.
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
npx playwright test -g "index copy"               # one test, by title
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
z-index 100000 and its marker/canvas layers at 99996–99998, while `index.html`'s
drawers sit at 100001 / 200001 (they have to clear the variant pill at 99999) — so
an open drawer buried the annotation layers and notes could not be attached to
anything inside it. The fix lifts `[data-agentation-root] > *` above everything.
Note the consequence: **while annotate mode is on, clicks inside a drawer go to
Agentation, not the app** — pause it (⏸) to use the UI.

## Gotchas

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
- ⚠️ **This file is edited by more than one session.** `index copy.html` and `CLAUDE.md`
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
