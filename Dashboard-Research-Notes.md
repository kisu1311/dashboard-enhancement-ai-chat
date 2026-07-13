# ObserveOps Dashboard Module — Research & Analysis Notes

**Date:** 12–13 Jul 2026
**Sources:** Live demo instance `https://demo.motadataaiops.com/dashboard` (BUILD 8.2.6, explored via authenticated Chrome session) + official docs `https://docs.motadata.com/motadata-aiops-docs/` (deep-research: 15 primary sources, 74 claims extracted, 21 confirmed by 3-vote adversarial verification, 3 refuted).

> Note: Playwright could not be used against the demo site — `/dashboard` redirects to a username/password login and no credentials are on file (and credential-guessing risks lockout). Exploration was done through the already-authenticated Chrome session instead. That session expired at the end of the exploration (both tabs redirected to `/login`).

---

## 1. Module chrome (as seen live, build 8.2.6)

- **Main nav (16 modules):** Dashboards, Monitors, Alerts, SLO (BETA), Reports, Topology, NCCM, NetRoute, Metric Explorer, Log Explorer, APM Explorer, RUM Explorer, Flow Explorer, Trap Explorer, Audits, Settings.
- **Header:** logo, spotlight search, user/actions icons, bell with unread badge, `BUILD : 8.2.6` chip, avatar (KP).
- **Dashboard header row:** panel-toggle chevron ▸, grid icon + dashboard title + **favorite star ☆**, time-range chip, from/to timestamps, **Full Screen** ⤢, **Export**, **kebab ⋮**.
- **Time-slider strip** below the header: ~100 tick dots, draggable selection window with two round handles, 11 time marks. Dragging a handle switches the chip to `Custom`. **Domain = 4× the selected window, right-pinned at now** (Today ⇒ selection sits in the last quarter).

## 2. Dashboard list panel (chevron ▸ next to title)

- Two radio-tabs: **Dashboard | NOC View**.
- **Dashboard tab:** search box, **＋ Create Dashboard** button, manage (grid-pencil) icon, tree of groups:
  - `Recently Viewed (6)`
  - Category groups with counts — live instance showed ~70 categories, e.g. Overview 31, Server 11, **Network 59**, SDN 2, Cloud 3, Virtualization 5, HCI 1, Applications 7, Database 4, **Log 25**, Flow 5, Active Directory 1, plus many user-created ones (Training 11, Demo, ITSM, NCM, SLO, Maps, ML Stream, License Count, …).
  - Each dashboard row has a public/private (lock) indicator; current dashboard highlighted.
- **NOC View tab:** NOC view groups with counts (demo 5, JS 4, KOL 2, test view 2) + same ＋ button (creates a NOC View). Clicking a NOC view **opens playback in a new browser tab** (`/dashboard?noc=<id>`).

## 3. NOC View (kiosk mode) — live capture

- Full-screen chromeless mode: only logo + centered **‹ Dashboard Name ›** prev/next arrows + **countdown timer (seconds)** + **pause ⏸** + **close ✕**.
- Auto-rotates through all dashboards in the group at the configured interval (observed 21s countdown).
- Docs: introduced in **8.2.5** — "dedicated display mode built for large screens in a NOC; group multiple dashboards, rotate automatically at a chosen interval" (release-notes-8.2.5). A separate docs page exists: `/motadata-aiops-docs/dashboards/noc-view`.
- ⚠️ Refuted (0-3): claim that NOC View has per-view visibility control (everyone vs specific users) — not in docs.

## 4. Dashboard-level actions

- **Kebab ⋮ menu:** **Clone / Edit / Delete** (Delete styled red).
- **Full Screen** button (aria: "Full Screen").
- **Export** button (aria: "Export") — docs: export dashboard **as PDF** and share via **Email with password-protected attachment**; **Create Schedule** to send dashboard data on a schedule (docs Overview page).
- **Favorite star** next to the title.
- **Clone** (docs, 8.0.25): cloning a dashboard also clones **all associated widgets** and their configurations.
- Docs Overview page also lists: snapshot of all widgets, drag-and-drop repositioning, resize, widget full-screen, historical data via time-interval change, zoom-in inside graphs, hover reveals monitor details.

## 5. Create / Edit Dashboard drawer (identical form both ways)

| Field | Details |
|---|---|
| Dashboard Name * | text |
| Category * | select + **Create New** button |
| Visibility & Sharing | **Public / Private** toggle. Public note: "Anyone in the organization can view this dashboard. Edit access is limited to you and Dashboard Admins." Docs: choosing Private reveals a **Users** multi-select to share with specific users |
| Default landing dashboard | ON/OFF switch — "opens first on sign-in", with radios **Only for me** (unless an Administrator has assigned a default for you) / **For specific users** (pick exactly who gets this as their default) |
| Layout | **Header font size** (S/M/L slider), **Horizontal gap** (px, default 10), **Vertical gap** (px, default 10), **Row height** (px, default 50) |
| Live Preview | skeleton mini-widgets (Top Server Monitors by Alert Count, Monitor Availability, CPU Utilisation, Logs by Severity) update as layout sliders move |
| Footer | Reset / Create Dashboard (or Update Dashboard) + docs link "For more information: Create Dashboard ↗" |

Docs (8.2.3): public/private visibility is **unified** across custom dashboards, out-of-the-box dashboards, Metric Explorer saved views, saved log views, and saved topology views.

## 6. Time-range picker (header chip)

- Chip anatomy: shortcut pill (`today`, `2d`, …) + label + **clear ⊗**. Clicking the chip turns the label into a "Type Range…" search input with autocomplete ghost text.
- **Preset list:** Last 5 / 15 / 30 Mins · Last 1 / 6 / 12 / 24 / 48 Hours · **Today** · Last Day (1d) · Last Week (1w) · Last Month (1mo) · This Week · This Month · **Custom**.
- **Custom:** dual-month calendar + **From Time / To Time** selects + Cancel / **Apply**.
- **Clear ⊗** empties the selection entirely (chip becomes calendar-icon "Select Time", slider strip hides, widgets clear until a range is picked).
- Docs (8.0.25): **Sticky Timeline** — keep a consistent time range across widgets on a dashboard.

## 7. Widgets — catalog (Add New Widget drawer, floating ＋ bottom-right)

Three tabs: **Create Widget | Predefined | User Define** + search. Docs confirm the two library categories and that hovering a library widget shows its **used count**.

**Create Widget catalog (17 types, grouped):**

| Group | Types |
|---|---|
| Graph | Chart, Top N, Gauge, Grid, Pie, Query Value, Numeric Grid, Sankey |
| Alert / Availability | Heat Map, Stream, Active Alert |
| Map | Tree Map, Map |
| AI / ML | **Anomaly, Forecast** |
| Event History | Event History |
| Text and Inserts | Free Text, IFrame |

(Docs Visualization page lists 11 of these — Chart, Grid, Top N, Gauge, Heat Map, Sankey, Map, Stream, Event History, Free Text, iFrame; the live 8.2.6 build adds Pie, Query Value, Numeric Grid, Tree Map, Active Alert, Anomaly, Forecast as first-class picker entries. A claim that the docs list is "exactly 11" was refuted 0-3, so treat the live 17 as canonical.)

- **Predefined tab:** ready-made widgets (Aruba/Cisco Rogue AP & Clients, AWS EBS Volumes, AWS EC2 Instances, Top Network Monitor by CPU Percent, Top Interface by Error Packet, Top Network Monitor by Latency, Ruckus Wireless Clients/Rogue APs, PostgreSQL Connection Used, …).
- **User Define tab:** user-saved widgets (e.g. Copy of Bandwidth utilization by Switch/devices, Signal_Strength, Windows AD login Events by Remote IP, Windows AD Group Policy Audit, Connected Camera Status, …).
- Footer docs link: "For more information: Widgets ↗".

## 8. Widget builder (Create/Edit Widget modal)

- **Type tabs across the top:** Chart | Grid | Top N | Gauge | Heat Map | Sankey | Map | Stream | Anomaly | Forecast | Active Alerts | Event History.
- **Fields:** widget name + Widget Description.
- **Style section** (per type). Gauge styles observed (tooltips): **Pie, Radial View, Progress With Count View, Horizontal Bar With Count View, Pivot Grid, Tree Map**.
- **Query builder** (bottom): data-source category buttons **Metric | Availability | Log | Flow | Alert | APM | NetRoute | RUM**; each source block holds rows of **Counter*** (e.g. `monitor.up.count`, `monitor.down.count`, `monitor.unreachable.count`, `monitor.maintenance.count`) + **Source Filter** (Everywhere) + **Source**, with per-row remove ⊗.
- Live preview pane renders the widget with real data while editing.
- Footer: **Reset / Update Widget** (or Create).
- Docs: widget creation = 3 documented steps — **Select Visualization → Query the Widget Data → Add Styling & Sorting Details** (each has its own docs page).
- Docs (8.0.25 style options): **Show Value** on horizontal/vertical bars, multiple **line styles**, **point size/appearance** customization for line charts. Chart visualization types (from custom-performance-reports page): Area, Line, Horizontal Bar, Vertical Bar + stacked variants (8 total).

## 9. Widget-level actions (hover on widget header)

- Hover reveals: per-widget **time-range badge** (`today`), **kebab ⋮**, and a **resize handle** (bottom-right corner).
- **Widget kebab menu:** **Edit Widget / Clone Widget / Full Screen / Share / Remove Widget** (red).
- Docs: widgets can be **shared over e-mail with multiple people at once**; clone widget stays inside the same dashboard.
- **Drill-down:** clicking a value inside a widget (e.g. the "Down" counter of Monitor Availability) opens a **side drawer** (`monitor.down.count: 52`) with the underlying records.
- Docs (8.2.5): **Metric Insight** icon on any time-series widget header (statistical summaries — average, 95th percentile, spike info) with 3 tabs: **Statistical Insight, Statistical Summary, KPI Summary**.

## 10. Permissions / RBAC (docs)

- Access control lives in **User Settings** (users, roles, password policies), not in the Dashboard module itself.
- Roles grant per-module permissions at three levels: **Read / Read & Write / Delete**.
- Dashboard-side: Public/Private + per-user sharing (see §5) + "Dashboard Admins" retain edit access on public dashboards.

## 11. AI features

- **AI/ML widgets** are first-class in the picker: **Anomaly** (expected-range band + anomalies) and **Forecast**.
- No AI dashboard *generator* exists in the product (8.2.6) — relevant to our `Dashboard-Clone` "Create with AI" concept (that remains a differentiating proposal).
- 8.2.5's Metric Insight (statistics/spikes on any time-series widget) is the closest built-in "insight" feature.

## 12. Docs page map (verified URLs)

- Section index: `docs.motadata.com/motadata-aiops-docs/dashboards/Overview` (the `/category/dashboards/` URL 404s). Nine sub-pages: Overview · How to Create a Dashboard? · Actions on the Dashboard · Widgets · Visualization · Querying Data on the Widget · Adding Style and Sorting Details · Actions on the widget · NOC View.
- Release notes with dashboard changes: `release-8-0-25` (clone-with-widgets, Sticky Timeline, Show Value, line styles, point customization) · `release-notes-8.2.2` (SLO widget, RUM alert widget — unverified, rate-limited) · `release-notes-8.2.3` (unified public/private visibility) · `release-notes-8.2.5` (NOC View, Metric Insight everywhere) · `release-notes-8.2.6` (current build).

## 13. Refuted / open items

- ✗ "Docs define exactly 11 visualization types" (0-3) — live build has 17 picker entries.
- ✗ "Dashboards shared via email is a documented dashboard action" (0-3) — email sharing is documented for **widgets** and for **PDF export**; dashboard-level sharing is visibility-based.
- ✗ "NOC View has per-view visibility control" (0-3).
- ? "8.2.2 introduced an SLO widget" — 1 vote for, 2 verifiers errored (session limit); re-verify when limits reset. The live build does have an SLO (BETA) module in the nav.
- Not captured live (session expired): manage-dashboards (grid-pencil) view in the list panel, widget **Share** dialog contents, Predefined-widget used-count hover, Category "Create New" flow, Export output. Re-run after logging back into the demo.

## 14. Design takeaways for our prototypes

- Our `Dashboard-Clone/` drawer matches the live Create/Edit drawer field-for-field (name, category+create-new, public/private, default-landing radios, 4 layout sliders, live preview) — still accurate on 8.2.6.
- Time-picker preset list + type-ahead chip behavior matches what's cloned in `Side_bar_menu/index.html`.
- New since our last audit: **NOC View** (kiosk playback with rotation timer) — a candidate surface for prototyping; the list panel's Dashboard/NOC View radio-tabs are new chrome worth mirroring.
- The widget picker's grouping (Graph / Alert‑Availability / Map / AI‑ML / Event History / Text & Inserts) is a good IA reference for our component library docs.
