"""DS pass over the vendored IPAM module (30 Sep 2026).

Request: "the IPAM main module in all components will be replaced using the ObserveOps
design system". The source already builds its controls from obs-* elements (buttons,
inputs, selects, tabs, tags, toolbars, checkboxes, tooltips); what it hand-built was
the READOUTS. This pass replaces them in the main module (Overview · Subnet Details ·
IP Details · Rogue Detection, and the subnet / IP detail views):

  hand-built <table class="ip-tbl"> + its own pager   ->  obs-table (its own pager)
  Top-N div list (Overview › Subnet Capacity)          ->  obs-table
  stat tiles / IP Address Status boxes                 ->  obs-metric-list
  <dl class="ip-kv"> (IP detail groups)                ->  obs-key-value

The Settings screens' grids are left as they were: the embed hides the source's rail,
so they are unreachable from Option 1.

Run after build_ipam.py (which calls it). Every replacement asserts its anchor exists
exactly once, so a changed source fails loudly instead of half-applying.
"""
import sys

path = sys.argv[1] if len(sys.argv) > 1 else '_ipam/ipam.html'
t = open(path, encoding='utf-8').read()


def rep(a, b, n=1):
    global t
    c = t.count(a)
    assert c == n, (a[:80], c)
    t = t.replace(a, b)


# ── 1. helpers, inserted after utilCell (so BAND_SEV / statusVar / esc / j exist) ──
HELPERS = r'''
/* ══ DS PASS (Option 1 embed, 30 Sep 2026) — readouts on obs-table / obs-metric-list /
   obs-key-value. Written by _ipam/ds_pass.py; re-run it rather than hand-editing. ══ */
/* a status is a CATEGORY (see the colour contract above), so it maps onto tag variants,
   not onto the severity scale */
const DS_STATUS_TAG = { Used: 'tag-primary', Available: 'tag-green', Reserved: 'tag-purple', Transient: 'tag-yellow' };
const DS_TAG_TOKEN = { 'tag-green': '--severity-clear', 'tag-orange': '--severity-major',
  'tag-red': '--severity-critical', 'tag-yellow': '--severity-warning', 'tag-primary': '--primary-alt' };
/* the legacy cell renderers still produce HTML; this reads that HTML back into the typed
   value an obs-table cell takes, so no column definition had to be rewritten */
function dsCell(html) {
  const tp = document.createElement('template');
  tp.innerHTML = String(html ?? '');
  const c = tp.content;
  const tags = [...c.querySelectorAll('obs-tag')];
  if (tags.length) return { type: 'tags', value: tags.map(g => ({ label: g.textContent.trim(), variant: g.getAttribute('variant') || 'default' })) };
  const pill = c.querySelector('.ip-pill');
  if (pill) { const s = pill.textContent.trim(); return { type: 'tags', value: [{ label: s, variant: DS_STATUS_TAG[s] || 'default' }] }; }
  const util = c.querySelector('.ip-util');
  if (util) {
    const fill = util.querySelector('.ip-util-fill');
    const m = /--severity-([a-z]+)/.exec(fill ? fill.getAttribute('style') || '' : '');
    return { type: 'severity', value: (util.querySelector('.ip-util-val') || util).textContent.trim(), sev: m ? m[1] : 'unknown' };
  }
  if (c.querySelector('.ip-nodata')) return { type: 'severity', value: 'not measurable', sev: 'unknown' };
  /* a two-line cell (address over its name) becomes one line — obs-table cells are single-line */
  const lines = [...c.children].length === 1 && c.firstElementChild.children.length > 1
    ? [...c.firstElementChild.children].map(n => n.textContent.trim()).filter(Boolean) : null;
  return { type: 'text', value: lines ? lines.join(' · ') : c.textContent.replace(/\s+/g, ' ').trim() };
}
const DS_GRIDS = { tblSubnets: 50, tblIps: 50, tblSdIps: 25, tblSdHist: 25, tblHistory: 50, tblIpHist: 20, tblRogue: 25, tblTopN: 0 };
const DS_GRID_DATA = {};
function dsGrid(id, cols, rows, opts = {}) {
  const keep = cols.filter(c => c.title);
  const cells = rows.map(r => keep.map(c => dsCell(c.cell(r))));
  const columns = keep.map((c, i) => {
    const typed = cells.map(x => x[i]).find(v => v.type !== 'text');
    const col = { key: 'c' + i, title: c.title };
    if (c.width) col.width = c.width + (opts.fixed ? '%' : 'px');
    if (typed) col.type = typed.type;
    return col;
  });
  const data = rows.map((r, ri) => {
    const o = { id: String(r.id) };
    cells[ri].forEach((v, i) => {
      const ct = columns[i].type;
      o['c' + i] = ct === 'tags' && v.type !== 'tags' ? (v.value ? [{ label: v.value, variant: 'default' }] : [])
        : ct === 'severity' && v.type !== 'severity' ? v.value : v.value;
      if (v.sev) o.sev = v.sev;
      else if (ct === 'severity' && !o.sev) o.sev = 'unknown';
    });
    return o;
  });
  DS_GRID_DATA[id] = { columns, rows: data, size: DS_GRIDS[id] || 0 };
  return `<obs-table id="${id}" data-dsgrid="${id}" class="ip-dstbl" sortable="false"
    empty-text="${esc(opts.empty || 'No records found')}"></obs-table>`;
}
/* row clicks — obs-table's rows live in its shadow root, so the old tbody tr[data-id]
   listeners find nothing; each grid's click goes through here instead */
const DS_ROWCLICK = {
  tblSubnets: id => openSubnet(id),
  tblIps: id => openIp(id, { stacked: true }),
  tblSdIps: id => openIp(id, { stacked: true }),
  tblHistory: id => {
    const ev = svc.events(F, { page: 1, size: 100000 }).rows.find(x => String(x.id) === id);
    if (ev) openIp(ev.ipId, { tab: 'history', origin: 'history' });
  },
  tblSdHist: id => {
    const ev = svc.events(svc.EMPTY(), { page: 1, size: 100000 }).rows.find(x => String(x.id) === id);
    if (ev) openIp(ev.ipId, { stacked: true, tab: 'history', origin: 'history' });
  }
};
/* mounted by a MutationObserver, not by each paint: the source repaints these grids from
   half a dozen places (renderContent, the repaint*Table functions, which CLONE nodes), and
   the observer is the one thing every one of those paths goes through */
function dsMount() {
  document.querySelectorAll('obs-table[data-dsgrid]').forEach(el => {
    const d = DS_GRID_DATA[el.getAttribute('data-dsgrid')];
    if (!d || el.__ds === d) return;
    el.__ds = d;
    el.columns = d.columns;
    el.rows = d.rows;
    if (d.size) el.pageSize = d.size;
    if (!el.__dsBound) {
      el.__dsBound = true;
      el.addEventListener('rowclick', e => {
        const f = DS_ROWCLICK[el.getAttribute('data-dsgrid')];
        const id = detailOf(e);
        if (f && id != null) f(String(id));
      });
    }
  });
}
new MutationObserver(dsMount).observe(document.body, { childList: true, subtree: true });

/* a KPI tile is a one-row obs-metric-list; the tile keeps its card surface and click */
const dsMetric = (value, label, color) =>
  `<obs-metric-list items="${j([[String(value), '', label].concat(color ? [color] : [])])}"></obs-metric-list>`;
'''
anchor = "/* ------------------------------------------------------------- app chrome */"
rep(anchor, HELPERS + '\n' + anchor)

# ── 2. grid() routes the main-module grids to obs-table ──
rep("function grid(id, cols, rows, opts = {}) {\n",
    "function grid(id, cols, rows, opts = {}) {\n  if (DS_GRIDS[id] !== undefined) return dsGrid(id, cols, rows, opts);\n")

# ── 3. hand those grids ALL their rows; obs-table pages them, so the hand pager goes ──
rep("${grid('tblSubnets', visibleCols(SUBNET_COLS, 'subnets'), rows,", "${grid('tblSubnets', visibleCols(SUBNET_COLS, 'subnets'), all,")
rep("\n      ${pager('tblSubnets', p, 'subnets')}", "")
rep("svc.ips(F, { page: pageAt, size: IP_PAGE, excludeStatus", "svc.ips(F, { page: 1, size: 100000, excludeStatus")
rep("\n      ${pager('tblIps', p, 'addresses')}", "")
rep("svc.ips(F, { page: sd.page, size: 25, subnetId", "svc.ips(F, { page: 1, size: 100000, subnetId")
rep("\n      ${pager('tblSdIps', p, 'addresses')}", "")
rep("svc.events(F, { page: sd.page, size: 25, subnetId: s.id })", "svc.events(F, { page: 1, size: 100000, subnetId: s.id })")
rep("${pager('tblSdHist', p, 'events')}", "")
rep("svc.events(svc.EMPTY(), { page: ipd.page, size: 20, ipId: x.id })", "svc.events(svc.EMPTY(), { page: 1, size: 100000, ipId: x.id })")
rep("${pager('tblIpHist', p, 'events')}", "")
rep("${grid('tblRogue', visibleCols(ROGUE_COLS, 'rogue'), rows,", "${grid('tblRogue', visibleCols(ROGUE_COLS, 'rogue'), all,")
rep("\n      ${pager('tblRogue', p, 'devices')}", "")

# ── 4. Top-N list -> obs-table ──
rep("  const body = `<div class=\"ip-topn-tbl\">",
    "  return dsGrid('tblTopN', [\n"
    "    { title: opts.valueHeader || 'Value', cell: r => esc(r.value) },\n"
    "    { title: opts.nameHeader || 'Name', cell: r => esc(r.name) }\n"
    "  ], rows.map((r, i) => ({ ...r, id: 'n' + i })), { empty: opts.empty });\n"
    "  const body = `<div class=\"ip-topn-tbl\">")

# ── 5. stat tiles -> obs-metric-list ──
rep("""function statClick(label, value, dot, status) {
  return `<div class="ip-stat ip-stat-click" data-stat-status="${esc(status)}" role="button" tabindex="0">
    <span class="ip-stat-label">${dot || ''}${esc(label)}</span>
    <span class="ip-stat-value">${esc(value)}</span></div>`;""",
"""function statClick(label, value, dot, status) {
  return `<div class="ip-stat ip-stat-click ip-statds" data-stat-status="${esc(status)}" role="button" tabindex="0"
    aria-label="${esc(label + ' ' + value)}">${dsMetric(value, label)}</div>`;""")
rep("""      <div class="ip-stat" style="flex-direction:row;align-items:stretch;gap:var(--ip-padding-md)">
        <div style="display:flex;flex-direction:column;justify-content:center;gap:2px;flex:1;min-width:0">
          <span class="ip-stat-label">IP Utilization</span>
          <span class="ip-stat-value">${blind ? '—' : c.pct + ' %'}</span>
        </div>
        <div style="width:1px;background:var(--border-color)"></div>
        <div class="ip-stat-click" data-stat-status="Available" style="display:flex;flex-direction:column;justify-content:center;gap:2px;flex:1;min-width:0">
          <span class="ip-stat-label">Free IP's</span>
          <span class="ip-stat-value">${blind ? '—' : (100 - c.pct) + ' %'}</span>
        </div>
      </div>""",
"""      <div class="ip-stat ip-statds">
        ${dsMetric(blind ? '—' : c.pct + ' %', 'IP Utilization')}
        <div class="ip-stat-click" data-stat-status="Available" role="button" tabindex="0">${dsMetric(blind ? '—' : (100 - c.pct) + ' %', "Free IP's")}</div>
      </div>""")
rep("""      <div class="ip-sev-bar" style="background:${b.color}"></div>
      <div class="ip-sev-body">
        <div class="ip-sev-label" style="color:${b.color}">${esc(b.label)}</div>
        <div class="ip-sev-value" style="color:${b.color}">${num(b.value)}</div>
      </div>""",
"""      <div class="ip-sev-bar" style="background:${b.color}"></div>
      <div class="ip-sev-body">${dsMetric(num(b.value), b.label, b.color.replace(/^var\\((--[\\w-]+)\\)$/, '$1'))}</div>""")

# ── 6. key/value groups -> obs-key-value ──
rep("""const kv = pairs => `<dl class="ip-kv">${pairs.map(([k, v]) =>
  `<dt>${esc(k)}</dt><dd>${v == null || v === '' ? '<span class="ip-muted">—</span>' : v}</dd>`).join('')}</dl>`;""",
"""/* obs-key-value renders text (and a DS status tag); a tag-coloured value keeps its
   meaning as that tag's colour token, and a link is lifted out under the list so it
   stays clickable — obs-key-value cannot host one */
const kv = pairs => {
  const links = [];
  const items = pairs.map(([k, v]) => {
    const tp = document.createElement('template');
    tp.innerHTML = v == null ? '' : String(v);
    const lk = tp.content.querySelector('obs-link');
    if (lk) links.push(lk.outerHTML);
    const tag = tp.content.querySelector('obs-tag');
    const txt = tp.content.textContent.replace(/\\s+/g, ' ').trim();
    const pill = tp.content.querySelector('.ip-pill');
    const color = tag ? DS_TAG_TOKEN[tag.getAttribute('variant')]
      : pill ? statusVar(txt).replace(/^var\\((--[\\w-]+)\\)$/, '$1') : undefined;
    return [k, txt || '—'].concat(color ? [color] : []);
  });
  return `<obs-key-value variant="plain" items="${j(items)}"></obs-key-value>` +
    (links.length ? `<div class="ip-kvlinks">${links.join('')}</div>` : '');
};""")

# ── 7. CSS for the new readouts ──
CSS = """
/* DS pass (ds_pass.py) */
obs-table.ip-dstbl { display: block; }
.ip-statds { align-items: center; justify-content: center; }
.ip-statds obs-metric-list { display: block; white-space: nowrap; } /* inherits into its shadow: a label wraps word by word otherwise */
.ip-grid-square .ip-stat.ip-statds { flex-direction: column; gap: var(--ip-padding-sm); }
.ip-sev-body obs-metric-list { display: block; white-space: nowrap; }
.ip-kvlinks { padding: 4px 10px 0; }
"""
rep("/* ---------------------------- app shell layout ---------------------------- */",
    CSS + "/* ---------------------------- app shell layout ---------------------------- */")


# ── 8. Subnet Details list, on the DS list-view recipe (30 Sep 2026: "improve this screen") ──
#   toolbar variant=grid · an obs-filters bar under it · the name column as a text link with the
#   subnet's name split into its own column · numbers right-aligned and sortable · a tinted,
#   sticky header · a row ⋯ menu (context-menu) — every one a part the recipe names.
SUBNET_JS = r"""
/* ══ SUBNET LIST (ds_pass.py §8) ══ */
/* Edit leads, as in the product's own row menus (Edit User · Reset Password · Delete User) */
const DS_SUBNET_ACTIONS = [
  { key: 'edit', label: 'Edit subnet', icon: 'pencil' },   /* 'edit' is not an obs-icon name in this bundle — it rendered nothing */
  { key: 'open', label: 'View details', icon: 'eye' },
  { key: 'poll', label: 'Poll now', icon: 'sync' }
];
function dsSubnetEnhance(columns, data, rows) {
  const at = columns.findIndex(c => c.title === 'Subnet');
  if (at > -1) {
    columns[at].type = 'link';
    columns.splice(at + 1, 0, { key: 'nm', title: 'Name', width: '170px', sortable: true });
    data.forEach((d, i) => { d[columns[at].key] = { text: rows[i].cidr }; d.nm = rows[i].name || '—'; });
  }
  const NUM = { Used: r => r.counts.used, Available: r => r.counts.available, Reserved: r => r.counts.reserved };
  columns.forEach(c => {
    if (NUM[c.title]) {
      c.align = 'right'; c.sortable = true;
      data.forEach((d, i) => { d[c.key] = NUM[c.title](rows[i]); });
    }
    if (c.title === 'VLAN' || c.title === 'Last scan' || c.title === 'Gateway') c.sortable = true;
  });
}
function dsSubnetAction(action, id) {
  const s = svc.subnet(id);
  if (action === 'open') openSubnet(id);
  else if (action === 'poll') pollSubnet(s);
  else if (action === 'edit' && typeof editSubnet === 'function') editSubnet(s);
}
/* the filter BAR and the faceted rail drive the same F, so they never disagree: the bar is
   re-derived from F on every paint, and a chip only writes F once it has a value */
/* §9 (30 Sep 2026, the product Monitors list as the reference): Site · Utilisation · VLAN are
   STANDING pills before '+ Filter', like its Groups · Types · Severity. The bundled obs-filters has
   no quickFilters prop, so each pill is the DS picker itself — obs-select trigger="button" multiple, its
   default-button tokens re-pointed at the + Filter chip's fill so the row reads as one set —
   and the bar carries only the fields that are not pills, so no filter shows twice */
const DS_SN_QUICK = ['site', 'util', 'vlan'];
const DS_SN = { filters: true };
function dsSubnetFilterBar() {
  const f = svc.facets();
  const pills = DS_SN_QUICK.map(k => `<obs-select class="ip-snpill" trigger="button" multiple data-qk="${k}"
      placeholder="${esc(FACET_DEFS[k].label)}" value="${esc((F[k] || []).join(','))}"
      options="${j((f[k] || []).map(x => ({ value: String(x.v), label: String(x.v) })))}"></obs-select>`).join('');
  return `<div class="ip-snqf${DS_SN.filters ? '' : ' ip-hidden'}" id="snQuick">${pills}${dsSubnetFilterBarOnly(f)}</div>`;
}
function dsSubnetFilterBarOnly(f) {
  const keys = TAB_FACETS.subnets.filter(k => !DS_SN_QUICK.includes(k));
  const fields = keys.map(k => ({ key: k, label: FACET_DEFS[k].label, type: 'enum',
    values: (f[k] || []).map(x => String(x.v)) }));
  const value = keys.filter(k => (F[k] || []).length)
    .map(k => ({ field: k, operator: F[k].length > 1 ? 'in' : '=', value: F[k].length > 1 ? F[k] : F[k][0] }));
  return `<obs-filters kind="bar" id="snFilterBar" class="ip-snfb" fields="${j(fields)}" value="${j(value)}"></obs-filters>`;
}
function dsSubnetFilterBind() {
  view.querySelectorAll('#snQuick obs-select[data-qk]').forEach(s => {
    if (s.__dsBound) return;
    s.__dsBound = true;
    s.addEventListener('change', e => {
      const d = detailOf(e);
      F[s.getAttribute('data-qk')] = (Array.isArray(e.detail) && Array.isArray(e.detail[0]) ? e.detail[0]
        : Array.isArray(d) ? d : d ? [d] : []).map(String);
      pageAt = 1; repaintSubnetsTable();
      if (typeof paintFilterRail === 'function' && filterRail && !filterRail.classList.contains('ip-hidden')) paintFilterRail();
    });
  });
  /* the funnel shows / hides the filter row — the product's own behaviour, filled while the row
     is showing. It used to toggle the facet rail, which this tab always hides (a dead control). */
  const ft = view.querySelector('#snFilterToggle');
  if (ft && !ft.__dsBound) {
    ft.__dsBound = true;
    ft.addEventListener('click', () => {
      DS_SN.filters = !DS_SN.filters;
      ft.setAttribute('variant', DS_SN.filters ? 'primary' : 'neutral-lightest');
      ft.setAttribute('aria-pressed', String(DS_SN.filters));
      const row = view.querySelector('#snQuick');
      if (row) row.classList.toggle('ip-hidden', !DS_SN.filters);
      if (typeof dsFitAll === 'function') dsFitAll();   /* the grid's top moved */
    });
  }
  const fb = view.querySelector('#snFilterBar');
  if (!fb || fb.__dsBound) return;
  fb.__dsBound = true;
  /* the DS contract says an abandoned chip is discarded on click-outside; the bundled bar keeps
     it, so every '+ Filter' press left another empty "Select Filter" behind. Its reflected value
     only ever holds COMPLETE conditions, so feeding that back (a trailing space changes the
     string, which is what re-fires its watcher) rebuilds the chips without the empty ones */
  if (!window.__dsSnPrune) {
    window.__dsSnPrune = true;
    document.addEventListener('pointerdown', e => {
      const bar = document.getElementById('snFilterBar');
      if (!bar || !bar.shadowRoot || (e.composedPath && e.composedPath().includes(bar))) return;
      let done = [];
      try { done = JSON.parse(String(bar.value || '[]').trim() || '[]'); } catch (x) { return; }
      if (bar.shadowRoot.querySelectorAll('.chip-wrap').length <= done.length) return;
      bar.__pad = !bar.__pad;
      bar.value = JSON.stringify(done) + (bar.__pad ? ' ' : '');
    }, true);
  }
  fb.addEventListener('change', e => {
    const d = detailOf(e) || {};
    const conds = Array.isArray(d) ? d : (d.conditions || []);
    TAB_FACETS.subnets.filter(k => !DS_SN_QUICK.includes(k)).forEach(k => { F[k] = []; });
    conds.forEach(c => {
      if (!c || !TAB_FACETS.subnets.includes(c.field) || DS_SN_QUICK.includes(c.field)) return;
      const vals = (Array.isArray(c.value) ? c.value : [c.value]).filter(v => v != null && v !== '');
      if (!vals.length || !(c.operator === '=' || c.operator === 'in')) return;
      F[c.field] = [...new Set((F[c.field] || []).concat(vals.map(String)))];
    });
    pageAt = 1; repaintSubnetsTable();
    if (typeof paintFilterRail === 'function' && filterRail && !filterRail.classList.contains('ip-hidden')) paintFilterRail();
  });
}
"""
rep("function dsMount() {", SUBNET_JS + "\nfunction dsMount() {")
# the enhance hook + table attributes, keyed by grid id
rep("  DS_GRID_DATA[id] = { columns, rows: data, size: DS_GRIDS[id] || 0 };",
    "  if (id === 'tblSubnets') dsSubnetEnhance(columns, data, rows);\n"
    "  DS_GRID_DATA[id] = { columns, rows: data, size: DS_GRIDS[id] || 0,\n"
    "    actions: id === 'tblSubnets' ? DS_SUBNET_ACTIONS : null };")
rep("""  return `<obs-table id="${id}" data-dsgrid="${id}" class="ip-dstbl" sortable="false"
    empty-text="${esc(opts.empty || 'No records found')}"></obs-table>`;""",
    """  const sub = id === 'tblSubnets';
  return `<obs-table id="${id}" data-dsgrid="${id}" class="ip-dstbl${sub ? ' ip-sntbl' : ''}" sortable="${sub}"
    empty-text="${esc(opts.empty || 'No records found')}"></obs-table>`;""")
rep("    if (d.size) el.pageSize = d.size;",
    """    if (d.size) el.pageSize = d.size;
    if (d.actions) el.rowActions = d.actions;
    /* obs-table right-aligns a column's CELLS (align:'right') but not its header, so a
       number column read with its title at the left edge over values at the right */
    const right = d.columns.map((c, i) => c.align === 'right' ? i + 1 : 0).filter(Boolean);
    if (right.length && el.shadowRoot && !el.__dsAlign) {
      el.__dsAlign = true;
      const sh = new CSSStyleSheet();
      sh.replaceSync(right.map(n => `.grid thead th:nth-child(${n}){text-align:right}`).join('')); /* beats .grid.hs-tinted th */
      el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, sh];
    }""")
rep("""      el.addEventListener('rowclick', e => {""",
    """      el.addEventListener('rowaction', e => {
        const d = detailOf(e) || {};
        if (el.getAttribute('data-dsgrid') === 'tblSubnets') dsSubnetAction(d.action, String(d.id));
      });
      /* a text-link cell stops its click, so it reaches us as a cellaction, not a rowclick */
      el.addEventListener('cellaction', e => {
        const d = detailOf(e) || {};
        const f = DS_ROWCLICK[el.getAttribute('data-dsgrid')];
        if (d.type === 'link' && f) f(String(d.id));
      });
      el.addEventListener('rowclick', e => {""")
# toolbar: widget -> grid, and the filter bar under it (subnets screen only)
rep("""  return `<div class="ip-stack">
    ${panel(`<obs-toolbar variant="widget">
        <obs-input slot="start" id="snSearch\"""",
    """  return `<div class="ip-stack">
    ${panel(`<obs-toolbar variant="grid">
        <obs-input slot="start" id="snSearch\"""")
rep("""            id="snFilterToggle" aria-label="Filters"><obs-icon name="filter" size="14"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>""",
    """            id="snFilterToggle" aria-label="Filters"><obs-icon name="filter" size="14"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>
      ${dsSubnetFilterBar()}""")
# the table repaint must keep the LIVE filter bar (a half-built chip lives in it), so it
# replaces what follows the bar rather than what follows the toolbar
rep("""  tmp.innerHTML = screenSubnets();
  const freshToolbar = tmp.querySelector('.ip-card obs-toolbar');
  const liveToolbar = card.querySelector('obs-toolbar');""",
    """  tmp.innerHTML = screenSubnets();
  const freshToolbar = tmp.querySelector('.ip-card #snQuick') || tmp.querySelector('.ip-card obs-toolbar');
  const liveToolbar = card.querySelector('#snQuick') || card.querySelector('obs-toolbar');""")
rep("  on('#snFilterToggle', 'click', toggleFilterRail);",
    "  dsSubnetFilterBind();")
rep("obs-table.ip-dstbl { display: block; }",
    "obs-table.ip-dstbl { display: block; }\n#snFilterBar { display: block; padding: 0 0 var(--ip-padding-xs); }\n/* embed: the tab strip and the title start on the content's 16px inset, not on the edge */\nhtml.ipembed #moduleTabs { margin-left: var(--ip-padding-md); }\nhtml.ipembed #pageHeader { margin-left: var(--ip-padding-xs); }")


# ── 9. Subnet Details, laid out like the product Monitors list (30 Sep 2026) ──
# boxed square toolbar icons (the product's neutral icon button), no card frame round the grid,
# and the severity legend under it — the utilisation BANDS are what its dots mean here
# `square` in this bundle is border-radius:0; the DS icon button is `squared` (35×35 at --btn-radius),
# with a 16px glyph. The filter button wears the product's ACTIVE fill (primary) while the facet rail
# is open, so the toolbar says the rail is on.
for bid in ['snColumns', 'snExportPdf', 'snExportCsv']:
    rep('<obs-button slot="trigger" variant="transparent" square\n            id="%s"' % bid,
        '<obs-button slot="trigger" variant="neutral-lightest" squared\n            id="%s"' % bid)
rep('<obs-button slot="trigger" variant="transparent" square\n            id="snFilterToggle"',
    '<obs-button slot="trigger" variant="${DS_SN.filters ? \'primary\' : \'neutral-lightest\'}" squared\n            id="snFilterToggle"'
    + ' aria-pressed="${DS_SN.filters}"')
for ic in ['eye" size="14"></obs-icon></obs-button>Columns', 'export-pdf" size="14"></obs-icon></obs-button>Export as PDF',
           'export-csv" size="14"></obs-icon></obs-button>Export as CSV', 'filter" size="14"></obs-icon></obs-button>Filters']:
    _src = '<obs-icon name="' + ic
    _i = t.find('function screenSubnets()')
    _j = t.find(_src, _i)
    assert _j > -1, ic
    t = t[:_j] + _src.replace('size="14"', 'size="16"') + t[_j + len(_src):]
rep("""      ${grid('tblSubnets', visibleCols(SUBNET_COLS, 'subnets'), all, { openId: sd && sd.id, empty: 'No subnet matches this filter' })}`)}""",
    """      ${grid('tblSubnets', visibleCols(SUBNET_COLS, 'subnets'), all, { openId: sd && sd.id, empty: 'No subnet matches this filter' })}
      ${dsSubnetLegend()}`, 'ip-sncard')}""")
rep("function dsSubnetFilterBind() {",
    """const DS_SN_LEGEND = [['critical', 'Critical'], ['major', 'High'], ['warning', 'Moderate'], ['clear', 'Healthy']];   /* §83: 'Not measurable' removed from the legend on request */
function dsSubnetLegend() {
  return `<div class="ip-snlegend" aria-label="Utilisation legend">${DS_SN_LEGEND.map(([s, l]) =>
    `<span class="ip-snlg"><obs-severity severity="${s}" shape="dot"></obs-severity>${esc(l)}</span>`).join('')}</div>`;
}
function dsSubnetFilterBind() {""")
rep("#snFilterBar { display: block; padding: 0 0 var(--ip-padding-xs); }",
    "#snFilterBar { display: block; flex: 1 1 240px; min-width: 0; }\n"
    ".ip-snqf { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ip-padding-xs); padding: 0 0 var(--ip-padding-sm); }\n"
    ".ip-snpill { flex: 0 0 auto; --default-button-bg: var(--code-tag-background-color); --default-button-border: var(--code-tag-background-color); }\n"
    ".ip-card.ip-sncard { border: 0; background: transparent; box-shadow: none; }\n"
    ".ip-snlegend { display: flex; justify-content: center; flex-wrap: wrap; gap: var(--ip-padding-md); padding: var(--ip-padding-sm) 0; font-size: var(--ip-text-xs); color: var(--page-text-color); }\n"
    "/* the legend sits ON the pager row, centred between its page controls and the item count — the\n   product list puts it there; pointer-events off so it never covers a pager button */\n.ip-snlegend { margin-top: -50px; height: 40px; padding: 0; align-items: center; pointer-events: none; }\n.ip-snlg { display: inline-flex; align-items: center; gap: 6px; }")


# ── 10. grid header + pager on the product's grid numbers, and the legend ON the pager row ──
GRID_JS = r"""
/* §10 — one sheet adopted into every converted obs-table (its shadow CSS cannot be reached from
   the page). Header: the product grid's 12.8px/600 uppercase over a line that actually shows
   (--field-border-color; --border-color is 1.1:1 on the dark canvas). Pager: 28px page buttons
   at --btn-radius, a hover, and the page-size select drawn like the DS dropdown — appearance
   none + the Tabler chevron (library icon) in --neutral-light's exact per-theme value, because a
   data: URI cannot read a var(). */
const DS_CHEV = c => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${c}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6l6 -6'/%3E%3C/svg%3E")`;
const DS_GRID_SHEET = new CSSStyleSheet();
DS_GRID_SHEET.replaceSync(`
.grid.hs-default th{padding:11px 16px;font-size:.8rem;font-weight:600;letter-spacing:.25px;
  color:var(--page-text-color);border-bottom:1px solid var(--field-border-color, var(--border-color))}
.grid td{border-bottom:1px solid var(--border-color)}
.pager{padding:10px 0;min-height:48px;border-top:0}
/* §15: the pager lives inside the scrolling .box, after the table. As a flex column with the pager
   pushed to the foot (margin-top:auto) and held there while rows scroll (sticky bottom), a fitted
   grid shows its pager at the bottom of the screen whatever the row count */
.box{display:flex;flex-direction:column}
.box>table{flex:0 0 auto}
.box>.pager{margin-top:auto;position:sticky;bottom:0;z-index:2;background:var(--page-background-color);
  border-top:1px solid var(--border-color)}
.pleft{gap:4px}
.ppage{min-width:28px;height:28px;padding:0 8px;display:inline-flex;align-items:center;justify-content:center;
  border-radius:var(--btn-radius, 4px);font-variant-numeric:tabular-nums}
.ppage:not(.sel):not(.dis):not(.dots):hover{background:var(--neutral-lighter)}
.ppage.sel{font-weight:600}
.psize{height:28px;margin-left:12px;padding:0 28px 0 10px;border-radius:var(--btn-radius, 4px);
  border:1px solid var(--field-border-color, var(--border-color));-webkit-appearance:none;appearance:none;
  background:var(--pagination-select-bg, var(--page-background-color)) ${DS_CHEV('6a7fa0')} no-repeat right 8px center / 14px}
:host-context([data-theme="dark-theme"]) .psize{background-image:${DS_CHEV('8e9fbc')}}
.prange{font-variant-numeric:tabular-nums}
`);
function dsGridStyle(el) {
  if (!el.shadowRoot || el.__dsSheet) return;
  el.__dsSheet = true;
  el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_GRID_SHEET];
}
/* the legend belongs ON the pager row, centred between the page controls and the item count.
   The pager is inside obs-table's shadow root, so the legend is placed over it by measurement
   rather than by a guessed negative margin (which left it floating above the row) */
function dsSnLegendPlace() {
  const t = document.getElementById('tblSubnets'), lg = document.querySelector('.ip-snlegend');
  const card = lg && lg.closest('.ip-card');
  const pg = t && t.shadowRoot && t.shadowRoot.querySelector('.pager');
  if (!lg || !card) return;
  if (!pg) return;   /* not rendered yet — the ResizeObserver below calls again when it is */
  const pr = pg.getBoundingClientRect(), cr = card.getBoundingClientRect();
  lg.style.top = Math.round(pr.top - cr.top + (pr.height - lg.offsetHeight) / 2) + 'px';
}
addEventListener('resize', dsSnLegendPlace);
"""
rep("function dsMount() {", GRID_JS + "\nfunction dsMount() {")
rep("    if (d.size) el.pageSize = d.size;",
    "    if (d.size) el.pageSize = d.size;\n    dsGridStyle(el);\n"
    "    if (el.id === 'tblSubnets' && !el.__dsRO) {\n"
    "      el.__dsRO = new ResizeObserver(dsSnLegendPlace);\n"
    "      el.__dsRO.observe(el);\n"
    "      setTimeout(dsSnLegendPlace, 60);\n"
    "    }")
rep("      el.addEventListener('rowclick', e => {",
    "      el.addEventListener('pagechange', () => setTimeout(dsSnLegendPlace, 30));\n"
    "      el.addEventListener('rowclick', e => {")
# legend: absolutely placed on the card (measured), not a negative margin
rep(".ip-snlegend { margin-top: -50px; height: 40px; padding: 0; align-items: center; pointer-events: none; }",
    ".ip-card.ip-sncard { position: relative; }\n"
    ".ip-snlegend { position: absolute; left: 50%; transform: translateX(-50%); top: 0; height: auto; padding: 0;"
    " align-items: center; pointer-events: none; white-space: nowrap; z-index: 3; }\n"
    ".ip-snlegend.ip-snlegend-free { position: static; transform: none; padding: var(--ip-padding-sm) 0; }\n"
    "/* embed: the prototype's variant-switcher pill floats over the bottom centre of the page, so the\n"
    "   content keeps clear of it or the pager row is always under the pill */\n"
    "html.ipembed .ip-content { padding-bottom: 64px; }")


# ── 11. IP Details list — the same treatment as Subnet Details (30 Sep 2026) ──
# grid toolbar with the DS squared icon buttons · a funnel that shows/hides the filter row ·
# Status · Site · Device type standing pills + '+ Filter' for the rest · the IP as a text link ·
# Device type and Vendor as two columns and the subnet as its CIDR (the two-line cells were
# wrapping every row to two lines) · single-line cells · sortable text columns · no card frame.
IP_JS = r"""
/* ══ IP LIST (ds_pass.py §11) ══ */
const DS_IP_QUICK = ['status', 'site', 'devType'];
const DS_IP = { filters: true };
function dsIpEnhance(columns, data, rows) {
  const at = t => columns.findIndex(c => c.title === t);
  const ip = at('IP address');
  if (ip > -1) { columns[ip].type = 'link'; data.forEach((d, i) => { d[columns[ip].key] = { text: rows[i].ip }; }); }
  const dt = at('Device type');
  if (dt > -1) {
    columns.splice(dt + 1, 0, { key: 'vd', title: 'Vendor', sortable: true });
    data.forEach((d, i) => { d[columns[dt].key] = rows[i].devType || '—'; d.vd = rows[i].vendor || '—'; });
  }
  const sn = at('Subnet');
  if (sn > -1) data.forEach((d, i) => { d[columns[sn].key] = rows[i].subnet || '—'; });
  columns.forEach(c => {
    delete c.width;   /* auto layout: fixed widths summed past the pane and wrapped every row */
    if (['Hostname', 'MAC', 'Device type', 'Subnet', 'Site', 'Source', 'Last seen'].includes(c.title)) c.sortable = true;
  });
}
function dsIpFilterRow() {
  const f = svc.facets();
  const pills = DS_IP_QUICK.map(k => `<obs-select class="ip-snpill" trigger="button" multiple data-qk="${k}"
      placeholder="${esc(FACET_DEFS[k].label)}" value="${esc((F[k] || []).join(','))}"
      options="${j((f[k] || []).map(x => ({ value: String(x.v), label: String(x.v) })))}"></obs-select>`).join('');
  const keys = TAB_FACETS.ips.filter(k => !DS_IP_QUICK.includes(k));
  const fields = keys.map(k => ({ key: k, label: FACET_DEFS[k].label, type: 'enum', values: (f[k] || []).map(x => String(x.v)) }));
  const value = keys.filter(k => (F[k] || []).length)
    .map(k => ({ field: k, operator: F[k].length > 1 ? 'in' : '=', value: F[k].length > 1 ? F[k] : F[k][0] }));
  return `<div class="ip-snqf${DS_IP.filters ? '' : ' ip-hidden'}" id="ipQuick">${pills}
    <obs-filters kind="bar" id="ipFilterBar" class="ip-fbar" fields="${j(fields)}" value="${j(value)}"></obs-filters></div>`;
}
function dsIpFilterBind() {
  const again = () => { pageAt = 1; repaintIpsTable(); };
  view.querySelectorAll('#ipQuick obs-select[data-qk]').forEach(s => {
    if (s.__dsBound) return;
    s.__dsBound = true;
    s.addEventListener('change', e => {
      const d = detailOf(e);
      F[s.getAttribute('data-qk')] = (Array.isArray(e.detail) && Array.isArray(e.detail[0]) ? e.detail[0]
        : Array.isArray(d) ? d : d ? [d] : []).map(String);
      again();
    });
  });
  const ft = view.querySelector('#ipFilterToggle');
  if (ft && !ft.__dsBound) {
    ft.__dsBound = true;
    ft.addEventListener('click', () => {
      DS_IP.filters = !DS_IP.filters;
      ft.setAttribute('variant', DS_IP.filters ? 'primary' : 'neutral-lightest');
      ft.setAttribute('aria-pressed', String(DS_IP.filters));
      const row = view.querySelector('#ipQuick');
      if (row) row.classList.toggle('ip-hidden', !DS_IP.filters);
      if (typeof dsFitAll === 'function') dsFitAll();   /* the grid's top moved */
    });
  }
  const fb = view.querySelector('#ipFilterBar');
  if (!fb || fb.__dsBound) return;
  fb.__dsBound = true;
  fb.addEventListener('change', e => {
    const d = detailOf(e) || {};
    const conds = Array.isArray(d) ? d : (d.conditions || []);
    const keys = TAB_FACETS.ips.filter(k => !DS_IP_QUICK.includes(k));
    keys.forEach(k => { F[k] = []; });
    conds.forEach(c => {
      if (!c || !keys.includes(c.field)) return;
      const vals = (Array.isArray(c.value) ? c.value : [c.value]).filter(v => v != null && v !== '');
      if (!vals.length || !(c.operator === '=' || c.operator === 'in')) return;
      F[c.field] = [...new Set((F[c.field] || []).concat(vals.map(String)))];
    });
    again();
  });
}
"""
rep("function dsMount() {", IP_JS + "\nfunction dsMount() {")
rep("  if (id === 'tblSubnets') dsSubnetEnhance(columns, data, rows);",
    "  if (id === 'tblSubnets') dsSubnetEnhance(columns, data, rows);\n  if (id === 'tblIps') dsIpEnhance(columns, data, rows);")
rep("""  const sub = id === 'tblSubnets';""", """  const sub = id === 'tblSubnets' || id === 'tblIps';""")
# the empty-chip prune: also for the IP bar
rep("""      const bar = document.getElementById('snFilterBar');
      if (!bar || !bar.shadowRoot || (e.composedPath && e.composedPath().includes(bar))) return;""",
    """      const bar = document.getElementById('snFilterBar') || document.getElementById('ipFilterBar');
      if (!bar || !bar.shadowRoot || (e.composedPath && e.composedPath().includes(bar))) return;""")
# toolbar
rep("""    ${panel(`<obs-toolbar variant="widget">
        <obs-input slot="start" id="ipSearch\"""", """    ${panel(`<obs-toolbar variant="grid">
        <obs-input slot="start" id="ipSearch\"""")
for bid in ['ipColumns', 'ipExportPdf', 'ipExportCsv']:
    rep('<obs-button slot="trigger" variant="transparent" square\n            id="%s"' % bid,
        '<obs-button slot="trigger" variant="neutral-lightest" squared\n            id="%s"' % bid)
rep('<obs-button slot="trigger" variant="transparent" square\n            id="ipFilterToggle"',
    '<obs-button slot="trigger" variant="${DS_IP.filters ? \'primary\' : \'neutral-lightest\'}" squared\n            id="ipFilterToggle" aria-pressed="${DS_IP.filters}"')
_i = t.find('function screenIps()')
for ic in ['eye', 'export-pdf', 'export-csv', 'filter']:
    _src = '<obs-icon name="%s" size="14">' % ic
    _j = t.find(_src, _i)
    assert _j > -1, ic
    t = t[:_j] + _src.replace('size="14"', 'size="16"') + t[_j + len(_src):]
rep("""            id="ipFilterToggle" aria-pressed="${DS_IP.filters}" aria-label="Filters"><obs-icon name="filter" size="16"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>""",
    """            id="ipFilterToggle" aria-pressed="${DS_IP.filters}" aria-label="Filters"><obs-icon name="filter" size="16"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>
      ${dsIpFilterRow()}""")
rep("""      ${grid('tblIps', visibleCols(IP_COLS, 'ips'), p.rows, { openId: ipd && ipd.id, empty: 'No address matches this filter' })}`)}""",
    """      ${grid('tblIps', visibleCols(IP_COLS, 'ips'), p.rows, { openId: ipd && ipd.id, empty: 'No address matches this filter' })}`, 'ip-sncard')}""")
# the repaint keeps the LIVE filter row
rep("""  const freshToolbar = freshCard && freshCard.querySelector('obs-toolbar');
  const liveToolbar = card.querySelector('obs-toolbar');""",
    """  const freshToolbar = freshCard && (freshCard.querySelector('#ipQuick') || freshCard.querySelector('obs-toolbar'));
  const liveToolbar = card.querySelector('#ipQuick') || card.querySelector('obs-toolbar');""")
rep("  on('#ipFilterToggle', 'click', toggleFilterRail);", "  dsIpFilterBind();")
rep("#snFilterBar { display: block; flex: 1 1 240px; min-width: 0; }",
    "#snFilterBar, #ipFilterBar { display: block; flex: 1 1 240px; min-width: 0; }")


# ── 12. IP Address Status tiles, in the product KPI shape (30 Sep 2026) ──
# label (with the status's own colour as a dot, not a 3px band across the tile) · the value in the
# page ink · its share of the total — left-aligned, so five tiles read as one scannable row. The
# DS ships no stat tile (a declared gap); every colour here is a token.
rep("""      <div class="ip-sev-bar" style="background:${b.color}"></div>
      <div class="ip-sev-body">${dsMetric(num(b.value), b.label, b.color.replace(/^var\\((--[\\w-]+)\\)$/, '$1'))}</div>""",
    """      <div class="ip-sev-body">
        <span class="ip-kl"><i class="ip-kdot" style="background:${b.color}"></i>${esc(b.label)}</span>
        <span class="ip-kv">${num(b.value)}</span>
        <span class="ip-ks">${b.label === 'Total' ? 'addresses in scope'
          : (c.total ? Math.round(b.value / c.total * 100) : 0) + '% of total'}</span>
      </div>""")
rep(".ip-snlg { display: inline-flex; align-items: center; gap: 6px; }",
    ".ip-snlg { display: inline-flex; align-items: center; gap: 6px; }\n"
    "#ipStatusWidget .ip-sev-box { text-align: left; }\n"
    "#ipStatusWidget .ip-sev-body { display: flex; flex-direction: column; gap: 4px; padding: var(--ip-padding-sm) var(--ip-padding-md); }\n"
    ".ip-kl { display: inline-flex; align-items: center; gap: 8px; font-size: .8rem; color: var(--neutral-light); }\n"
    ".ip-kdot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 8px; }\n"
    ".ip-kv { font-size: 1.4rem; font-weight: 600; line-height: 1.2; color: var(--page-text-color); font-variant-numeric: tabular-nums; }\n"
    ".ip-ks { font-size: .75rem; color: var(--neutral-light); }")


# ── 13. IP Address Status: no outer box (30 Sep 2026, "remove the outside box border") ──
# the card's own border AND the widget header's (obs-toolbar variant=widget draws its own top-rounded
# frame in its shadow root — reached by re-pointing the tokens it reads on its host). The header's
# 8px inner padding is cancelled so the title, the tiles and the search box below share one left edge.
rep(".ip-ks { font-size: .75rem; color: var(--neutral-light); }",
    ".ip-ks { font-size: .75rem; color: var(--neutral-light); }\n"
    "#ipStatusWidget .ip-card { border: 0; background: transparent; box-shadow: none; }\n"
    "#ipStatusWidget obs-toolbar { --border-color: transparent; --common-widget-bg: transparent; margin: 0 -8px; }\n"
    "#ipStatusWidget .ip-card-body { padding: var(--ip-padding-xs) 0 0; }")


# ── 14. a line ABOVE every grid header, and Rogue Detection on the Subnet Details layout (1 Oct 2026) ──
rep(".grid.hs-default th{padding:11px 16px;font-size:.8rem;font-weight:600;letter-spacing:.25px;",
    ".grid.hs-default th{padding:11px 16px;font-size:.8rem;font-weight:600;letter-spacing:.25px;\n"
    "  border-top:1px solid var(--field-border-color, var(--border-color));")
ROGUE_JS = r"""
/* ══ ROGUE LIST (ds_pass.py §14) — the Subnet Details layout: grid toolbar, squared icon buttons, a
   funnel that shows/hides the filter row, Status · Vendor · VLAN pills + '+ Filter' for Switch and
   Port, sortable columns, no card frame. Rogue rows are not in the facet model (F), so their filter
   state is its own. ══ */
const DS_RG = { filters: true, f: { status: [], vendor: [], vlan: [], switch: [], port: [] } };
const DS_RG_QUICK = [['status', 'Status'], ['vendor', 'Vendor'], ['vlan', 'VLAN']];
const DS_RG_BAR = [['switch', 'Switch'], ['port', 'Port']];
const dsRgMatch = r => Object.keys(DS_RG.f).every(k => !DS_RG.f[k].length || DS_RG.f[k].includes(String(r[k])));
const dsRgVals = k => [...new Set(ROGUE_DEVICES.map(r => String(r[k])))];
function dsRgEnhance(columns) {
  columns.forEach(c => { if (c.title) c.sortable = true; });
}
function dsRgFilterRow() {
  const pills = DS_RG_QUICK.map(([k, l]) => `<obs-select class="ip-snpill" trigger="button" multiple data-rk="${k}"
      placeholder="${esc(l)}" value="${esc(DS_RG.f[k].join(','))}"
      options="${j(dsRgVals(k).map(v => ({ value: v, label: v })))}"></obs-select>`).join('');
  const fields = DS_RG_BAR.map(([k, l]) => ({ key: k, label: l, type: 'enum', values: dsRgVals(k) }));
  const value = DS_RG_BAR.filter(([k]) => DS_RG.f[k].length)
    .map(([k]) => ({ field: k, operator: DS_RG.f[k].length > 1 ? 'in' : '=', value: DS_RG.f[k].length > 1 ? DS_RG.f[k] : DS_RG.f[k][0] }));
  return `<div class="ip-snqf${DS_RG.filters ? '' : ' ip-hidden'}" id="rgQuick">${pills}
    <obs-filters kind="bar" id="rgFilterBar" class="ip-fbar" fields="${j(fields)}" value="${j(value)}"></obs-filters></div>`;
}
function dsRgFilterBind() {
  const again = () => { roguePage = 1; repaintRogueTable(); };
  view.querySelectorAll('#rgQuick obs-select[data-rk]').forEach(s => {
    if (s.__dsBound) return;
    s.__dsBound = true;
    s.addEventListener('change', e => {
      const d = detailOf(e);
      DS_RG.f[s.getAttribute('data-rk')] = (Array.isArray(e.detail) && Array.isArray(e.detail[0]) ? e.detail[0]
        : Array.isArray(d) ? d : d ? [d] : []).map(String);
      again();
    });
  });
  const ft = view.querySelector('#rogueFilterToggle');
  if (ft && !ft.__dsBound) {
    ft.__dsBound = true;
    ft.addEventListener('click', () => {
      DS_RG.filters = !DS_RG.filters;
      ft.setAttribute('variant', DS_RG.filters ? 'primary' : 'neutral-lightest');
      ft.setAttribute('aria-pressed', String(DS_RG.filters));
      const row = view.querySelector('#rgQuick');
      if (row) row.classList.toggle('ip-hidden', !DS_RG.filters);
      if (typeof dsFitAll === 'function') dsFitAll();   /* the grid's top moved */
    });
  }
  const fb = view.querySelector('#rgFilterBar');
  if (!fb || fb.__dsBound) return;
  fb.__dsBound = true;
  fb.addEventListener('change', e => {
    const d = detailOf(e) || {};
    const conds = Array.isArray(d) ? d : (d.conditions || []);
    DS_RG_BAR.forEach(([k]) => { DS_RG.f[k] = []; });
    conds.forEach(c => {
      if (!c || !DS_RG_BAR.some(([k]) => k === c.field)) return;
      const vals = (Array.isArray(c.value) ? c.value : [c.value]).filter(v => v != null && v !== '');
      if (!vals.length || !(c.operator === '=' || c.operator === 'in')) return;
      DS_RG.f[c.field] = [...new Set(DS_RG.f[c.field].concat(vals.map(String)))];
    });
    again();
  });
}
"""
rep("function dsMount() {", ROGUE_JS + "\nfunction dsMount() {")
rep("  if (id === 'tblIps') dsIpEnhance(columns, data, rows);",
    "  if (id === 'tblIps') dsIpEnhance(columns, data, rows);\n  if (id === 'tblRogue') dsRgEnhance(columns);")
rep("""  const sub = id === 'tblSubnets' || id === 'tblIps';""", """  const sub = id === 'tblSubnets' || id === 'tblIps' || id === 'tblRogue';""")
rep("const DS_GRIDS = { tblSubnets: 50, tblIps: 50, tblSdIps: 25, tblSdHist: 25, tblHistory: 50, tblIpHist: 20, tblRogue: 25,",
    "const DS_GRIDS = { tblSubnets: 50, tblIps: 50, tblSdIps: 25, tblSdHist: 25, tblHistory: 50, tblIpHist: 20, tblRogue: 50,")
rep("""      const bar = document.getElementById('snFilterBar') || document.getElementById('ipFilterBar');""",
    """      const bar = document.getElementById('snFilterBar') || document.getElementById('ipFilterBar') || document.getElementById('rgFilterBar');""")
# the rows the grid gets go through the filter state
rep("""  const all = ROGUE_DEVICES.filter(r => !rogueQ ||""", """  const all = ROGUE_DEVICES.filter(dsRgMatch).filter(r => !rogueQ ||""")
rep("""    ${panel(`<obs-toolbar variant="widget">
        <obs-input slot="start" id="rogueSearch\"""", """    ${panel(`<obs-toolbar variant="grid">
        <obs-input slot="start" id="rogueSearch\"""")
for bid in ['rogueColumns', 'rogueExportPdf', 'rogueExportCsv']:
    rep('<obs-button slot="trigger" variant="transparent" square\n            id="%s"' % bid,
        '<obs-button slot="trigger" variant="neutral-lightest" squared\n            id="%s"' % bid)
rep('<obs-button slot="trigger" variant="transparent" square\n            id="rogueFilterToggle"',
    '<obs-button slot="trigger" variant="${DS_RG.filters ? \'primary\' : \'neutral-lightest\'}" squared\n            id="rogueFilterToggle" aria-pressed="${DS_RG.filters}"')
_i = t.find('function screenRogue()')
for ic in ['eye', 'export-pdf', 'export-csv', 'filter']:
    _src = '<obs-icon name="%s" size="14">' % ic
    _j = t.find(_src, _i)
    assert _j > -1, ic
    t = t[:_j] + _src.replace('size="14"', 'size="16"') + t[_j + len(_src):]
rep("""            id="rogueFilterToggle" aria-pressed="${DS_RG.filters}" aria-label="Filters"><obs-icon name="filter" size="16"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>""",
    """            id="rogueFilterToggle" aria-pressed="${DS_RG.filters}" aria-label="Filters"><obs-icon name="filter" size="16"></obs-icon></obs-button>Filters</obs-tooltip>
      </obs-toolbar>
      ${dsRgFilterRow()}""")
rep("""      ${grid('tblRogue', visibleCols(ROGUE_COLS, 'rogue'), all, { empty: 'No rogue device detected in this filter' })}`)}""",
    """      ${grid('tblRogue', visibleCols(ROGUE_COLS, 'rogue'), all, { empty: 'No rogue device detected in this filter' })}`, 'ip-sncard')}""")
# the repaint keeps the LIVE filter row
_k = t.find('function repaintRogueTable()')
_a = """  const freshToolbar = tmp.querySelector('.ip-card obs-toolbar');
  const liveToolbar = card.querySelector('obs-toolbar');"""
_m = t.find(_a, _k)
assert _m > -1 and _m - _k < 400
t = t[:_m] + """  const freshToolbar = tmp.querySelector('.ip-card #rgQuick') || tmp.querySelector('.ip-card obs-toolbar');
  const liveToolbar = card.querySelector('#rgQuick') || card.querySelector('obs-toolbar');""" + t[_m + len(_a):]
rep("  on('#rogueColumns', 'click', e => openColMenu('rogue', ROGUE_COLS, e.currentTarget, repaintRogueTable));",
    "  on('#rogueColumns', 'click', e => openColMenu('rogue', ROGUE_COLS, e.currentTarget, repaintRogueTable));\n  dsRgFilterBind();")
rep("#snFilterBar, #ipFilterBar { display: block;", "#snFilterBar, #ipFilterBar, #rgFilterBar { display: block;")


# ── 15. the pager pinned to the bottom of the screen on every list (1 Oct 2026) ──
# The product list fills the content height: the rows scroll INSIDE the grid, the header sticks,
# and the pager sits at the foot of the screen whatever the row count (2 rogue devices included).
# obs-table's own max-height + sticky-header give the scrolling body; the height is MEASURED —
# what is left of the content area below the grid's top, less the pager — and re-measured by a
# ResizeObserver on the content area and the card, so the filter row, the status tiles and a
# window resize all move it. min-height is set on the same box so a short list still reaches down.
FIT_JS = r"""
const DS_FIT = new Set(['tblSubnets', 'tblIps', 'tblRogue']);
function dsFit(el) {
  if (!el.isConnected || !el.shadowRoot) return;
  const box = el.shadowRoot.querySelector('.box'), pg = el.shadowRoot.querySelector('.pager');
  const ct = el.closest('.ip-content');
  if (!box || !ct) return;
  const pb = parseFloat(getComputedStyle(ct).paddingBottom) || 0;
  /* the pager is INSIDE .box (after the table), so the box's height is the whole remaining space */
  const h = Math.floor(ct.getBoundingClientRect().bottom - pb - box.getBoundingClientRect().top);
  const v = Math.max(160, h) + 'px';
  if (el.maxHeight !== v) el.maxHeight = v;
  if (box.style.minHeight !== v) box.style.minHeight = v;
  if (el.id === 'tblSubnets' && typeof dsSnLegendPlace === 'function') setTimeout(dsSnLegendPlace, 0);   /* the pager moved */
}
const dsFitAll = () => DS_FIT.forEach(id => { const e = document.getElementById(id); if (e) dsFit(e); });
addEventListener('resize', dsFitAll);
function dsFitWatch(el) {
  if (!DS_FIT.has(el.id) || el.__dsFit) return;
  el.__dsFit = true;
  el.stickyHeader = true;
  const ct = el.closest('.ip-content'), card = el.closest('.ip-card');
  const ro = new ResizeObserver(() => dsFit(el));
  if (ct) ro.observe(ct);
  if (card) ro.observe(card);
  setTimeout(() => dsFit(el), 0);
  setTimeout(() => dsFit(el), 120);
}
"""
rep("function dsMount() {", FIT_JS + "\nfunction dsMount() {")
rep("    dsGridStyle(el);\n", "    dsGridStyle(el);\n    dsFitWatch(el);\n")
# the pager row sits just above the variant-switcher pill, not 64px off the floor
rep("html.ipembed .ip-content { padding-bottom: 64px; }", "html.ipembed .ip-content { padding-bottom: 56px; }")


# ── 16. the header holds still across tabs (1 Oct 2026) ──
# · the time-range picker only applies to Overview / Rogue and the source removed it (display:none)
#   elsewhere, so the header row changed height and the title + tab strip jumped on every tab switch;
#   it now keeps its box (visibility:hidden) so the row is one height everywhere.
# · obs-tabs paints its HOVER with the same 4px underline as the ACTIVE tab, so the tab under the
#   pointer read as a second selected tab. Hover is a colour change only now (every obs-tabs on the
#   page — the module strip and the subnet / IP detail strips).
TABS_JS = r"""
const DS_TABS_SHEET = new CSSStyleSheet();
DS_TABS_SHEET.replaceSync('.tab:hover:not(.active):not(.disabled){border-bottom-color:transparent}');
function dsTabsStyle() {
  document.querySelectorAll('obs-tabs').forEach(tb => {
    if (!tb.shadowRoot || tb.__dsTabs) return;
    tb.__dsTabs = true;
    tb.shadowRoot.adoptedStyleSheets = [...tb.shadowRoot.adoptedStyleSheets, DS_TABS_SHEET];
  });
}
"""
rep("function dsMount() {", TABS_JS + "\nfunction dsMount() {\n  dsTabsStyle();")
rep("html.ipembed .ip-content { padding-bottom: 56px; }",
    "html.ipembed .ip-content { padding-bottom: 56px; }\n"
    "#tlPicker.ip-hidden { display: inline-block !important; visibility: hidden; pointer-events: none; }")


# ── 17. row action menus on the product's ACTION-DROPDOWN surface (1 Oct 2026) ──
# obs-menu paints its panel with --page-background-color, so over a grid it is the grid's own colour
# and reads as a hole. The product's row menus use the action-dropdown tokens (#1d2a3e dark / white
# light, their own text + hover). The menus live inside obs-table's shadow root and are re-rendered on
# every page/sort, so a MutationObserver on that root adopts the sheet into each new one.
MENU_JS = r"""
const DS_MENU_SHEET = new CSSStyleSheet();
DS_MENU_SHEET.replaceSync(`.menu{background:var(--action-dropdown-backgroud, var(--dropdown-background));
  border-color:var(--field-border-color, var(--border-color))}
.mitem{color:var(--action-dropdown-text, var(--page-text-color))}
.mitem:hover{background:var(--action-dropdown-hover-bg, var(--neutral-lighter))}
.mitem .mico{color:inherit}`);
function dsMenuStyle(root) {
  root.querySelectorAll('obs-menu').forEach(m => {
    if (!m.shadowRoot || m.__dsMenu) return;
    m.__dsMenu = true;
    m.shadowRoot.adoptedStyleSheets = [...m.shadowRoot.adoptedStyleSheets, DS_MENU_SHEET];
  });
}
"""
rep("function dsGridStyle(el) {", MENU_JS + "\nfunction dsGridStyle(el) {")
rep("""  el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_GRID_SHEET];
}""", """  el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_GRID_SHEET];
  dsMenuStyle(el.shadowRoot);
  new MutationObserver(() => dsMenuStyle(el.shadowRoot)).observe(el.shadowRoot, { childList: true, subtree: true });
}""")


# ── 18. subnet detail (IP Details + IP History tabs) on the list layout (1 Oct 2026) ──
# · the six square tiles (aspect-ratio 1 — 240px tall at 1600) become the IP Details KPI tiles:
#   dot + label, value, share; one row; still clickable (they filter the IP grid to that status)
# · header / grid toolbars: the DS `squared` 35px icon buttons with 16px glyphs, grid toolbar variant
# · both grids: the IP as a text link, single-line cells (widths dropped), sortable text columns;
#   the IP grid also splits Device type / Vendor, like IP Details
SD_JS = r"""
function dsSdKpi(label, value, color, sub, status, clickable) {
  return `<div class="ip-sev-box${clickable ? ' ip-stat-click' : ''}"${clickable ? ` data-stat-status="${esc(status)}" role="button" tabindex="0"` : ''}>
    <div class="ip-sev-body">
      <span class="ip-kl"><i class="ip-kdot" style="background:${color}"></i>${esc(label)}</span>
      <span class="ip-kv">${esc(value)}</span>
      <span class="ip-ks">${esc(sub)}</span>
    </div></div>`;
}
function dsSdKpis(c, blind) {
  const pct = n => (c.total ? Math.round(n / c.total * 100) : 0) + '% of total';
  return `<div class="ip-sev-row sn-kpis">
    ${dsSdKpi('Total IP', num(c.total), 'var(--primary-alt)', 'addresses in subnet', '', true)}
    ${dsSdKpi('Used', num(c.used), statusVar('Used'), pct(c.used), 'Used', true)}
    ${dsSdKpi('Available', num(c.available), statusVar('Transient'), pct(c.available), 'Available', true)}
    ${dsSdKpi('Transient', num(c.transient), statusVar('Available'), pct(c.transient), 'Transient', true)}
    ${dsSdKpi('Reserved', num(c.reserved), statusVar('Reserved'), pct(c.reserved), 'Reserved', true)}
    ${dsSdKpi('IP utilisation', blind ? '—' : c.pct + ' %', bandVar(blind ? 'Unknown' : c.pct >= 90 ? 'Critical' : c.pct >= 75 ? 'High' : c.pct >= 50 ? 'Moderate' : 'Healthy'),
      blind ? 'no discovery coverage' : (100 - c.pct) + '% free', 'Available', !blind)}
  </div>`;
}
function dsSdHistEnhance(columns, data, rows) {
  const ip = columns.findIndex(c => c.title === 'IP address');
  if (ip > -1) { columns[ip].type = 'link'; data.forEach((d, i) => { d[columns[ip].key] = { text: rows[i].ip }; }); }
  columns.forEach(c => { delete c.width; if (c.title && c.type !== 'link' && c.type !== 'tags') c.sortable = true; });
}
"""
rep("function dsMount() {", SD_JS + "\nfunction dsMount() {")
rep("  if (id === 'tblIps') dsIpEnhance(columns, data, rows);",
    "  if (id === 'tblIps' || id === 'tblSdIps') dsIpEnhance(columns, data, rows);\n"
    "  if (id === 'tblSdHist') dsSdHistEnhance(columns, data, rows);")
rep("""  const sub = id === 'tblSubnets' || id === 'tblIps' || id === 'tblRogue';""",
    """  const sub = ['tblSubnets', 'tblIps', 'tblRogue', 'tblSdIps', 'tblSdHist'].includes(id);""")
# the square tiles -> KPI tiles
_a = t.find('    <div class="ip-grid cols-6 ip-grid-square sn-overview-stats">')
_b = t.find('    <div class="ip-grid cols-6">', _a)
assert _a > -1 and _b > _a
t = t[:_a] + '    ${dsSdKpis(c, blind)}\n\n' + t[_b:]
# header buttons
for bid in ['sdPoll', 'sdExport', 'sdFullscreen']:
    rep('<obs-button slot="trigger" variant="transparent" square\n            id="%s"' % bid,
        '<obs-button slot="trigger" variant="neutral-lightest" squared\n            id="%s"' % bid)
rep('<obs-button variant="transparent" square id="sdBack"', '<obs-button variant="transparent" squared id="sdBack"')
_i = t.find('function screenSubnetDetail(s)')
for ic in ['sync" size="14"', 'image" size="14"']:
    _j = t.find('<obs-icon name="' + ic, _i)
    assert _j > -1, ic
    t = t[:_j] + ('<obs-icon name="' + ic).replace('size="14"', 'size="16"') + t[_j + len('<obs-icon name="' + ic):]
rep("""<obs-icon name="${document.fullscreenElement ? 'exitFullscreen' : 'fullscreen'}" size="14">""",
    """<obs-icon name="${document.fullscreenElement ? 'exitFullscreen' : 'fullscreen'}" size="16">""")
# grid toolbars in both tabs
_i = t.find('function subnetTabBody(s)')
_e = t.find('\n}\n', _i)
body = t[_i:_e]
body = body.replace('<obs-toolbar variant="widget">', '<obs-toolbar variant="grid">')
body = body.replace('<obs-button slot="trigger" variant="transparent" square', '<obs-button slot="trigger" variant="neutral-lightest" squared')
body = body.replace('size="14"></obs-icon></obs-button>', 'size="16"></obs-icon></obs-button>')
assert body.count('variant="grid"') == 2 and body.count('squared') == 8
t = t[:_i] + body + t[_e:]
rep(".ip-ks { font-size: .75rem; color: var(--neutral-light); }",
    ".ip-ks { font-size: .75rem; color: var(--neutral-light); }\n"
    ".sn-kpis .ip-sev-box { text-align: left; }\n"
    ".sn-kpis .ip-sev-body { display: flex; flex-direction: column; gap: 4px; padding: var(--ip-padding-sm) var(--ip-padding-md); }\n"
    ".sn-kpis .ip-sev-box.ip-stat-click:hover { border-color: var(--field-border-color, var(--border-color)); background: var(--code-tag-background-color); }")


# ── 19. IP side panel (1 Oct 2026) ──
# The monitoring tag + "Discover Device" link floated alone in a row of empty space above the tabs.
# They belong to the record, so they join the header: the address, its monitoring tag beside it, and
# Discover device as a DS default button at the right before the close (it navigates — a button, not
# a link). The history grid inside is single-line and sortable, like the other grids.
rep("""      <div class="ip-row" style="align-items:flex-start">
        <div class="ip-row" style="flex:1 1 auto"></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none">
          <obs-tag variant="${x.monitoring ? 'tag-green' : 'tag-red'}">${x.monitoring ? 'Monitored' : 'Not Monitored'}</obs-tag>
          ${!x.monitoring ? '<obs-link id="ipDiscoverDevice">Discover Device</obs-link>' : ''}
        </div>
      </div>
""", "")
IPH_JS = r"""
const dsIpTag = x => `<obs-tag variant="${x.monitoring ? 'tag-green' : 'tag-red'}">${x.monitoring ? 'Monitored' : 'Not monitored'}</obs-tag>`;
const dsIpDiscover = x => x.monitoring ? '' : `<obs-button variant="default" size="small" id="ipDiscoverDevice"><obs-icon name="search" size="14"></obs-icon>&nbsp;Discover device</obs-button>`;
"""
rep("function dsMount() {", IPH_JS + "\nfunction dsMount() {")
rep("""      <span class="ip-sp-title">${esc(x.ip)}</span>
      <obs-button variant="transparent" square id="ipStackX" aria-label="Close"><obs-icon name="times" size="16"></obs-icon></obs-button>""",
    """      <span class="ip-sp-title">${esc(x.ip)}${dsIpTag(x)}</span>
      ${dsIpDiscover(x)}
      <obs-button variant="transparent" squared id="ipStackX" aria-label="Close"><obs-icon name="times" size="16"></obs-icon></obs-button>""")
rep("""        <div class="ip-dr-title">${esc(x.ip)}</div>
      </div>""",
    """        <div class="ip-dr-title ip-sp-title">${esc(x.ip)}${dsIpTag(x)}</div>
        ${dsIpDiscover(x)}
      </div>""")
rep("  if (id === 'tblSdHist') dsSdHistEnhance(columns, data, rows);",
    "  if (id === 'tblSdHist' || id === 'tblIpHist') dsSdHistEnhance(columns, data, rows);")
rep("""  const sub = ['tblSubnets', 'tblIps', 'tblRogue', 'tblSdIps', 'tblSdHist'].includes(id);""",
    """  const sub = ['tblSubnets', 'tblIps', 'tblRogue', 'tblSdIps', 'tblSdHist', 'tblIpHist'].includes(id);""")
rep(".ip-ks { font-size: .75rem; color: var(--neutral-light); }",
    ".ip-ks { font-size: .75rem; color: var(--neutral-light); }\n"
    ".ip-sp-title { display: inline-flex; align-items: center; gap: var(--ip-padding-sm); }")


# ── 19b. the IP panel's history grid fits its 688px panel on one line per row ──
PANEL_JS = r"""
const DS_PANEL_SHEET = new CSSStyleSheet();
DS_PANEL_SHEET.replaceSync('.grid td,.grid.hs-default th{padding-left:8px;padding-right:8px}.grid td{white-space:nowrap}');
"""
rep("function dsMount() {", PANEL_JS + "\nfunction dsMount() {")
rep("    dsGridStyle(el);\n",
    "    dsGridStyle(el);\n"
    "    if (el.id === 'tblIpHist' && el.shadowRoot && !el.__dsPanel) { el.__dsPanel = true;\n"
    "      el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_PANEL_SHEET]; }\n")


# ── 20. Overview widgets one size, Subnet Capacity as a real list, IP panel key-values (1 Oct 2026) ──
OV_JS = r"""
/* the IP panel's obs-key-value: a single-column list is capped at 480px in its shadow CSS, so the
   value cell's hover stopped mid-panel; the whole row is the hover now, across the panel */
const DS_KV_SHEET = new CSSStyleSheet();
DS_KV_SHEET.replaceSync(`.kv.cols-1{max-width:none}
.kv.v-plain .k{width:170px}
.kv.v-plain tr:hover td.val{background:transparent}
.kv.v-plain tr:hover td{background:var(--code-tag-background-color)}
.kv.v-plain tr td:first-child{border-radius:4px 0 0 4px}.kv.v-plain tr td:last-child{border-radius:0 4px 4px 0}`);
function dsKvStyle() {
  document.querySelectorAll('obs-key-value').forEach(k => {
    if (!k.shadowRoot || k.__dsKv) return;
    k.__dsKv = true;
    k.shadowRoot.adoptedStyleSheets = [...k.shadowRoot.adoptedStyleSheets, DS_KV_SHEET];
  });
}
/* Subnet Capacity: the subnet as a link, its name as its own column, utilisation with its band dot */
function dsTopNEnhance(columns, data, rows) {
  if (!rows.length || !rows[0].cidr) return;
  columns.length = 0;
  columns.push({ key: 'sn', title: 'Subnet', type: 'link' }, { key: 'nm', title: 'Name' },
               { key: 'ut', title: 'Utilization', type: 'severity', align: 'right' });
  data.forEach((d, i) => {
    const r = rows[i];
    for (const k of Object.keys(d)) if (k !== 'id') delete d[k];
    d.sn = { text: r.cidr }; d.nm = r.nm; d.ut = r.value; d.sev = BAND_SEV[r.band] || 'unknown';
  });
}
"""
rep("function dsMount() {", OV_JS + "\nfunction dsMount() {\n  dsKvStyle();")
rep("  if (id === 'tblTopN') {", "  if (id === 'tblTopN') {") if "  if (id === 'tblTopN') {" in t else None
rep("  if (id === 'tblIps' || id === 'tblSdIps') dsIpEnhance(columns, data, rows);",
    "  if (id === 'tblIps' || id === 'tblSdIps') dsIpEnhance(columns, data, rows);\n"
    "  if (id === 'tblTopN') dsTopNEnhance(columns, data, rows);")
rep("""    .map(x => ({ value: x.util + ' %', name: x.cidr + ' — ' + x.name }));""",
    """    .map(x => ({ id: x.id, value: x.util + ' %', name: x.cidr + ' — ' + x.name, cidr: x.cidr, nm: x.name, band: x.band }));""")
rep("""  ], rows.map((r, i) => ({ ...r, id: 'n' + i })), { empty: opts.empty });""",
    """  ], rows.map((r, i) => ({ ...r, id: r.id || 'n' + i })), { empty: opts.empty });""")
rep("  tblSubnets: id => openSubnet(id),", "  tblSubnets: id => openSubnet(id),\n  tblTopN: id => { if (!/^n\\d+$/.test(id)) { go('subnets'); openSubnet(id); } },")
# the Overview: every widget on one 3-column grid, one height
_i = t.find('function screenOverview()')
_e = t.find('\n}\n', _i)
body = t[_i:_e]
n6 = body.count('<div class="ip-grid cols-6">'); n3 = body.count('<div class="ip-grid cols-3">')
assert n6 == 2 and n3 == 1, (n6, n3)
body = body.replace('<div class="ip-grid cols-6">', '<div class="ip-grid ip-ovgrid">').replace('<div class="ip-grid cols-3">', '<div class="ip-grid ip-ovgrid">')
t = t[:_i] + body + t[_e:]
rep(".ip-ks { font-size: .75rem; color: var(--neutral-light); }",
    ".ip-ks { font-size: .75rem; color: var(--neutral-light); }\n"
    "/* Overview: one width and one height for every widget (1 Oct 2026) — the chart bodies are drawn at\n"
    "   250px, which is what the 340px card is sized around */\n"
    ".ip-grid.ip-ovgrid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n"
    ".ip-ovgrid > .ip-card { grid-column: auto !important; height: 340px; display: flex; flex-direction: column; }\n"
    ".ip-ovgrid > .ip-card > .ip-card-body { flex: 1 1 auto; min-height: 0; overflow: hidden; }\n"
    "@media (max-width: 1100px) { .ip-grid.ip-ovgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }")
# Subnet Capacity scrolls inside its card
rep("    if (d.actions) el.rowActions = d.actions;",
    "    if (d.actions) el.rowActions = d.actions;\n"
    "    if (el.id === 'tblTopN') { el.stickyHeader = true; el.maxHeight = '262px'; }")


# ── 21. Subnet detail laid out like the product's monitor detail page (1 Oct 2026) ──
# header row: home › icon tile · "cidr (name)" | gateway | VLAN | band tag, a tag row under it,
# squared actions right · flat text tabs on a full-width rule · KPI tiles led by an icon tile ·
# widgets with a filled title strip. No outer card — the page is the surface, as on the monitor page.
_i = t.find('function screenSubnetDetail(s) {')
_e = t.find('\n/* the tab badges', _i)
assert _i > -1 and _e > -1
NEW_SD = r"""function screenSubnetDetail(s) {
  const band = s.util == null ? 'Unknown' : s.band;
  const bandTag = { Critical: 'tag-red', High: 'tag-orange', Moderate: 'tag-yellow', Healthy: 'tag-green' }[band] || 'default';
  const act = (id, icon, label) => `<obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared
      id="${id}" aria-label="${label}"><obs-icon name="${icon}" size="16"></obs-icon></obs-button>${label}</obs-tooltip>`;
  return `<div class="ip-sdpg">
    <div class="ip-sdhd">
      <obs-button variant="transparent" squared id="sdBack" aria-label="Back to subnets"><obs-icon name="home" size="18"></obs-icon></obs-button>
      <obs-icon class="ip-sdchev" name="chevron-right" size="14"></obs-icon>
      <span class="ip-sdtile"><obs-icon name="ip" size="20"></obs-icon></span>
      <div class="ip-sdid">
        <div class="ip-sdttl"><b>${esc(s.cidr)} (${esc(s.name)})</b>
          <span class="ip-sdmeta">| gateway ${esc(s.gw)} | ${esc(s.vlan || 'no VLAN')} |</span>
          <obs-tag variant="${bandTag}">${esc(band === 'Unknown' ? 'No coverage' : band)}</obs-tag></div>
        <div class="ip-sdtags">
          <obs-tag>Site &gt; ${esc(s.site)}</obs-tag>
          <obs-tag variant="tag-primary">${esc(s.origin)}</obs-tag>
          <obs-tag>${esc(num(s.counts.total))} addresses</obs-tag>
        </div>
      </div>
      <span class="ip-spacer"></span>
      ${act('sdPoll', 'sync', 'Poll now')}
      ${act('sdExport', 'image', 'Export as image')}
      ${act('sdFullscreen', document.fullscreenElement ? 'exitFullscreen' : 'fullscreen', 'Full screen')}
    </div>
    <obs-tabs id="sdTabs" class="ip-sdtabs" variant="no-border" value="${esc(sd.tab)}" tabs='${j(subnetTabsFor(s).map(x => ({ key: x.key, label: x.label + (x.count != null ? ' (' + num(x.count) + ')' : '') })))}'></obs-tabs>
    <div id="sdBody" class="ip-sdbody">${subnetTabBody(s)}</div>
  </div>
  <div id="ipStack"></div>`;
}"""
t = t[:_i] + NEW_SD + t[_e:]

# KPI tiles: an icon tile, the name as the tile's title, the caption, then the figure
rep("""function dsSdKpi(label, value, color, sub, status, clickable) {
  return `<div class="ip-sev-box${clickable ? ' ip-stat-click' : ''}"${clickable ? ` data-stat-status="${esc(status)}" role="button" tabindex="0"` : ''}>
    <div class="ip-sev-body">
      <span class="ip-kl"><i class="ip-kdot" style="background:${color}"></i>${esc(label)}</span>
      <span class="ip-kv">${esc(value)}</span>
      <span class="ip-ks">${esc(sub)}</span>
    </div></div>`;
}""", """const DS_SD_KPI_IC = { 'Total IP': 'ip', Used: 'check-circle', Available: 'lock-open', Transient: 'clock', Reserved: 'tag', 'IP utilisation': 'utilization' };
function dsSdKpi(label, value, color, sub, status, clickable) {
  return `<div class="ip-sev-box${clickable ? ' ip-stat-click' : ''}"${clickable ? ` data-stat-status="${esc(status)}" role="button" tabindex="0"` : ''}>
    <div class="ip-sev-body">
      <span class="ip-sdki" style="--ip-kc:${color}"><obs-icon name="${DS_SD_KPI_IC[label] || 'ip'}" size="20"></obs-icon></span>
      <span class="ip-sdkt">${esc(label)}</span>
      <span class="ip-ks">${esc(sub)}</span>
      <span class="ip-kv">${esc(value)}</span>
    </div></div>`;
}""")

rep(".ip-ks { font-size: .75rem; color: var(--neutral-light); }",
""".ip-ks { font-size: .75rem; color: var(--neutral-light); }
/* §21 subnet detail — the monitor-detail layout */
.ip-sdpg { display: flex; flex-direction: column; min-height: 0; }
.ip-sdhd { display: flex; align-items: center; gap: 8px; padding: 4px 0 12px; border-bottom: 1px solid var(--border-color); }
.ip-sdchev { color: var(--neutral-light); }
.ip-sdtile { width: 36px; height: 36px; border-radius: 4px; display: grid; place-items: center; flex: 0 0 36px;
  background: var(--code-tag-background-color); color: var(--primary-alt); }
.ip-sdid { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ip-sdttl { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; }
.ip-sdttl b { font-size: 1.05rem; font-weight: 500; color: var(--primary-alt); overflow: hidden; text-overflow: ellipsis; }
.ip-sdmeta { color: var(--neutral-light); font-size: .85rem; }
.ip-sdtags { display: flex; gap: 6px; flex-wrap: wrap; }
.ip-sdtabs { display: block; border-bottom: 1px solid var(--border-color); margin-bottom: 12px; }
.ip-sdbody { min-height: 0; }
.sn-kpis .ip-sev-box { background: var(--common-widget-bg); }
.sn-kpis .ip-sev-body { gap: 2px; padding: 14px 16px 16px; }
.ip-sdki { width: 40px; height: 40px; border-radius: 4px; display: grid; place-items: center; margin-bottom: 10px;
  background: color-mix(in srgb, var(--ip-kc) 18%, transparent); color: var(--ip-kc); }
.ip-sdkt { font-size: 1.15rem; font-weight: 500; color: var(--primary-alt); line-height: 1.3; }
.sn-kpis .ip-kv { margin-top: 10px; font-size: 1.35rem; }
/* widgets on this page carry the monitor page's filled title strip */
.ip-sdpg .ip-card { overflow: hidden; }
.ip-sdpg .ip-card > obs-toolbar[variant="widget"] { --common-widget-bg: var(--code-tag-background-color); }
.ip-sdpg .ip-card > obs-toolbar[variant="widget"] + .ip-card-body { background: var(--common-widget-bg); }""")


# ── §22 · Overview row 1 = Address status · Device Monitoring Status · Subnet Capacity ──
# Device Monitoring Status sat alone in row 3. It moves between the two widgets of row 1, and
# the trend takes its place in row 3, so every card keeps the ovgrid's equal 1/3 width and 340px.
_a = t.find("      ${widget('Device Monitoring Status'")
_b = t.find("\n    </div>", _a)
assert _a > 0 and _b > _a, 'device monitoring widget not found'
_dev = t[_a:_b]
t = t[:_a] + "      ${widget('Overall Subnet Usage Trend', subnetUsageTrendHtml(c.used, 'overview', 214, false))}" + t[_b:]
_tr = "\n      ${widget('Overall Subnet Usage Trend', subnetUsageTrendHtml(c.used, 'overview', 214, false), { cls: 'ip-card-span3' })}\n"
assert t.count(_tr) == 1, 'trend widget anchor'
t = t.replace(_tr, "\n")
_sc = "      ${widget('Subnet Capacity',"
assert t.count(_sc) == 1, 'subnet capacity anchor'
t = t.replace(_sc, _dev.replace(", { cls: 'ip-card-span2' })}", ")}") + "\n\n" + _sc)


# ── §23 · Address status: legend to the right, "name : value" in mono ──
# Reference: Option 1's own pie widget (Top Network Monitors by Alert Count) — chart left, a
# vertical legend right of it carrying each value. The legend centred UNDER the donut left the
# card's sides empty and said nothing a reader could not get only by hovering. Opt-in
# (legendRight), so the Device Monitoring donut beside it is untouched.
_d = "      b.legend.itemMarginBottom = 2;\n\n      function paint(chart) {"
assert t.count(_d) == 1, 'donutSelectable legend anchor'
t = t.replace(_d, """      b.legend.itemMarginBottom = 2;
      if (o.legendRight) {
        b.legend.layout = 'vertical'; b.legend.align = 'right'; b.legend.verticalAlign = 'middle';
        b.legend.itemMarginTop = 5; b.legend.itemMarginBottom = 5; b.legend.x = -8;
        b.legend.symbolRadius = 2;
        b.legend.itemStyle = Object.assign({}, b.legend.itemStyle, {
          fontFamily: tok('--numeric-font-family', "'JetBrains Mono', monospace"),
          fontSize: '12px', color: tok('--page-text-color', '#cad3e2') });
        b.legend.labelFormatter = function () {
          return this.name + ': ' + Number(this.y || 0).toLocaleString();
        };
      }

      function paint(chart) {""")
_v = "showPercent: opts.showPercent, defaultBig: opts.defaultBig, defaultSmall: opts.defaultSmall });"
assert t.count(_v) == 1, 'vizStatusDonut anchor'
t = t.replace(_v, "showPercent: opts.showPercent, defaultBig: opts.defaultBig, defaultSmall: opts.defaultSmall,\n      legendRight: opts.legendRight });")
_c = "], { h: 250, legendLayout: 'vertical', showPercent: true,"
assert t.count(_c) == 1, 'address status call'
t = t.replace(_c, "], { h: 250, legendRight: true, showPercent: true,")


# ── §24 · Overview rows 2 and 3 are pairs; Device Monitoring Status gets the right legend ──
# Row 2 = Site Count · Top Device Type, row 3 = Rogue Devices Trend · Overall Subnet Usage Trend,
# each a 2-column row (.ip-ov2) at the ovgrid's own 340px — row 1 stays three across. The two
# trends now sit side by side, so their time axes line up for comparison.
def _grab(start, end):
    global t
    a = t.find(start); b = t.find(end, a)
    assert a > 0 and b > a, start
    w = t[a:b]; t = t[:a] + t[b:]
    return w
_rogue = _grab("      ${widget('Rogue Devices Trend'", "\n\n      ${widget('Site Count'")
_trend = _grab("      ${widget('Overall Subnet Usage Trend'", "\n    </div>")
_r3 = "    <div class=\"ip-grid ip-ovgrid\">\n\n    </div>"
assert t.count(_r3) == 1, 'emptied row 3'
t = t.replace(_r3, "    <div class=\"ip-grid ip-ovgrid ip-ov2\">\n" + _rogue + "\n\n" + _trend + "\n    </div>")
_r2 = "    <div class=\"ip-grid ip-ovgrid\">\n\n\n      ${widget('Site Count'"
assert t.count(_r2) == 1, 'row 2 head'
t = t.replace(_r2, "    <div class=\"ip-grid ip-ovgrid ip-ov2\">\n      ${widget('Site Count'")
_dm = "], { h: 250, legendLayout: 'vertical', totalLabel: 'devices' })"
assert t.count(_dm) == 1, 'device monitoring call'
t = t.replace(_dm, "], { h: 250, legendRight: true, totalLabel: 'devices' })")
_cs = "@media (max-width: 1100px) { .ip-grid.ip-ovgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }"
assert t.count(_cs) == 1, 'ovgrid css'
t = t.replace(_cs, ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n" + _cs)


# ── §25 · Overview cards read like the product's dashboard widgets (Metric Alert Overview) ──
# (1) the title sits on a filled strip — the §21 subnet-detail rule, now on the overview grid;
# (2) a donut's centre is a small label OVER a mono figure ("Total / 1.91 K" in the reference),
#     one change in drawCentre so every IPAM donut agrees.
rep("""    chart.dsCentre = chart.renderer.text(String(big), 0, 0)
      .css({ color: tok('--primary-alt', '#111c2c'), fontSize: '20px', fontWeight: '500', fontFamily: font })
      .attr({ zIndex: 5 }).add();
    var bb = chart.dsCentre.getBBox();
    chart.dsCentre.attr({ x: cx - bb.width / 2, y: cy + (small ? 1 : bb.height / 3) });

    if (small) {
      chart.dsCentreSub = chart.renderer.text(String(small), 0, 0)
        .css({ color: tok('--neutral-light', '#8a93a5'), fontSize: '10px', fontFamily: font })
        .attr({ zIndex: 5 }).add();
      var sb = chart.dsCentreSub.getBBox();
      chart.dsCentreSub.attr({ x: cx - sb.width / 2, y: cy + 15 });
    }""", """    var mono = tok('--numeric-font-family', "'JetBrains Mono', monospace");
    chart.dsCentre = chart.renderer.text(String(big), 0, 0)
      .css({ color: tok('--primary-alt', '#111c2c'), fontSize: '26px', fontWeight: '600', fontFamily: mono })
      .attr({ zIndex: 5 }).add();
    var bb = chart.dsCentre.getBBox();
    chart.dsCentre.attr({ x: cx - bb.width / 2, y: cy + (small ? 24 : bb.height / 3) });

    if (small) {
      chart.dsCentreSub = chart.renderer.text(String(small), 0, 0)
        .css({ color: tok('--page-text-color', '#cad3e2'), fontSize: '17px', fontFamily: font })
        .attr({ zIndex: 5 }).add();
      var sb = chart.dsCentreSub.getBBox();
      chart.dsCentreSub.attr({ x: cx - sb.width / 2, y: cy - 8 });
    }""")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
assert t.count(_s) == 1
t = t.replace(_s, _s + "\n.ip-ovgrid > .ip-card > obs-toolbar[variant=\"widget\"] { --common-widget-bg: var(--code-tag-background-color); }")


# ── §26 · Overview cards carry no ⋮, and the subnet-detail IP grid keeps upstream's row menu ──
# (1) The overview's ⋮ opened nothing — widget() draws it by default. Overview cards pass actions:''.
#     Scoped to screenOverview's own body so the subnet-detail widgets keep theirs.
_o = t.find('function screenOverview() {'); _e = t.find('\nfunction blindReason', _o)
assert _o > 0 and _e > _o, 'overview body'
_body = t[_o:_e]
_n = _body.count("${widget(")
assert _n == 7, 'overview widgets: %d' % _n
_body = _body.replace("${widget(", "${ovWidget(")
t = t[:_o] + _body + t[_e:]
rep("function widget(title, bodyHtml, opts = {}) {",
    "/* overview cards: the product's dashboard widgets carry no menu when there is nothing to do */\n"
    "const ovWidget = (title, bodyHtml, opts = {}) => widget(title, bodyHtml, Object.assign({}, opts, { actions: '' }));\n"
    "function widget(title, bodyHtml, opts = {}) {")
# (2) Upstream (1 Oct 2026) added a per-row ⋮ "Discover Device" to the subnet detail's IP grid as an
#     <obs-menu> cell, which the DS grid conversion drops. It becomes the obs-table's own rowActions,
#     wired to upstream's discoverDeviceForIp — the same door the IP panel's Discover button uses.
rep("    actions: id === 'tblSubnets' ? DS_SUBNET_ACTIONS : null };",
    "    actions: id === 'tblSubnets' ? DS_SUBNET_ACTIONS : id === 'tblSdIps' ? SD_IPS_ROW_MENU : null };")
rep("        if (el.getAttribute('data-dsgrid') === 'tblSubnets') dsSubnetAction(d.action, String(d.id));",
    "        if (el.getAttribute('data-dsgrid') === 'tblSubnets') dsSubnetAction(d.action, String(d.id));\n"
    "        if (el.getAttribute('data-dsgrid') === 'tblSdIps' && d.action === 'discover') discoverDeviceForIp(String(d.id));")


# ── §27 · a legendRight donut is CENTRED AS A GROUP (donut + gap + legend) in its card ──
# Aligned right, the legend sat at the card's far edge and the donut in the middle of what was left,
# so a wide card read as two things 400px apart. Each render sets EQUAL left/right chart spacing so
# the plot area is exactly as wide as it is tall — the donut fills it, the legend follows after
# legend.margin, and the whole group sits on the card's centre.
# ⚠️ An earlier build moved the PIE (series.update center) and a floating legend from inside the render
#    event; that rebuilt the series mid-paint, the legend collapsed to one swatch and the centre label
#    vanished. Only chart-level spacing is updated here, and a render that updates skips paint (the
#    nested render paints). The 2px tolerance is what stops it re-triggering itself.
_ev = "      b.chart.events = { render: function () { paint(this); } };\n      return b;"
assert t.count(_ev) == 1, 'donutSelectable events'
t = t.replace(_ev, """      b.chart.events = { render: function () { if (o.legendRight && groupCentre(this)) return; paint(this); } };
      if (o.legendRight) b.legend.margin = 28;
      return b;""")
_fn = "  function donutSelectable(slices, o) {"
assert t.count(_fn) == 1
t = t.replace(_fn, """  function groupCentre(c) {
    var L = c.legend;
    if (!L || !L.legendWidth || !c.plotHeight) return false;
    var cur = c.options.chart.spacingLeft || 0;
    var x = Math.max(8, Math.round((c.chartWidth - (c.plotHeight + (L.options.margin || 0) + L.legendWidth)) / 2));
    if (Math.abs(x - cur) < 2) return false;
    c.update({ chart: { spacingLeft: x, spacingRight: x } }, true, false, false);
    return true;
  }

""" + _fn)


# ── §28 · Site Count / Top Device Type drawn like the product's Top-N bar widget ──
# Reference: the product dashboard's Top N bar (one series colour, mono category + value labels,
# a value axis along the floor with vertical gridlines, square bar ends). Opt-in (`product`), so
# any other barTopN keeps its look. The bars draw the RAW count (each row's label) — vizTopN's
# `v` is a share, and an axis under a share would print a scale these cards never meant.
_bt = "    return queue(function () {\n      var b = baseOpts(h);\n      var maxV = rows.reduce("
assert t.count(_bt) == 1, 'barTopN head'
t = t.replace(_bt, """    if (o.product) return barTopNProduct(rows, o);
""" + _bt)
_fn = "  function barTopN(rows, o) {"
assert t.count(_fn) == 1
t = t.replace(_fn, """  function barTopNProduct(rows, o) {
    var h = o.h || Math.max(110, rows.length * 30 + 40);
    var mono = tok('--numeric-font-family', "'JetBrains Mono', monospace");
    var vals = rows.map(function (r) { return Number(r.label != null ? r.label : r.v) || 0; });
    var colour = colourOf(rows[0] || {}, 0);
    return queue(function () {
      var b = baseOpts(h);
      b.chart.type = 'bar';
      b.chart.spacing = [8, 16, 4, 4];
      b.xAxis = {
        categories: rows.map(function (r) { return r.name; }),
        lineWidth: 0, tickLength: 0, gridLineWidth: 0,
        labels: { reserveSpace: true, style: { color: tok('--page-text-color', '#cad3e2'), fontSize: '11px', fontFamily: mono, textOverflow: 'none', whiteSpace: 'nowrap' } }
      };
      b.yAxis = {
        min: 0, title: { text: null }, allowDecimals: false, tickAmount: 6,
        gridLineWidth: 1, gridLineColor: tok('--border-color', '#1d2a3e'), gridLineDashStyle: 'Solid',
        lineWidth: 1, lineColor: tok('--field-border-color', '#2b394f'),
        labels: { style: { color: tok('--neutral-light', '#8e9fbc'), fontSize: '11px', fontFamily: mono } }
      };
      b.legend.enabled = false;
      b.tooltip.pointFormat = '<b>{point.y}</b>';
      b.plotOptions = {
        bar: {
          borderWidth: 0, borderRadius: 0, pointPadding: 0.14, groupPadding: 0.04, color: colour,
          dataLabels: {
            enabled: true, inside: false, crop: false, overflow: 'allow',
            style: { color: tok('--page-text-color', '#cad3e2'), fontSize: '11px', fontWeight: '400',
              fontFamily: mono, textOutline: 'none' }
          }
        }
      };
      b.series = [{ type: 'bar', name: '', color: colour, data: vals }];
      return b;
    });
  }

""" + _fn)
_vz = "    { h: opts.h, axisMax: opts.axisMax, axisUnit: opts.axisUnit });"
assert t.count(_vz) == 1, 'vizTopN'
t = t.replace(_vz, "    { h: opts.h, axisMax: opts.axisMax, axisUnit: opts.axisUnit, product: opts.product });")
for _w in ("siteRows.length ? vizTopN(siteRows, { h: 250 })", "devTypeRows.length ? vizTopN(devTypeRows, { h: 250 })"):
    assert t.count(_w) == 1, _w
    t = t.replace(_w, _w.replace("{ h: 250 }", "{ h: 250, product: true }"))


# ── §29 · the two Overview trends carry a one-series legend, like the product's line widget ──
# Reference: SLO Burn Rate Summary — a short line in the series colour + the series name in mono,
# centred under the plot. DSCharts.line only shows a legend for 2+ series; `legendOne` is opt-in and
# passed from the Overview calls only, so the subnet detail and Rogue Detection trends are unchanged.
_lg = "      b.legend.enabled = (o.legend !== false) && list.length > 1;"
_li = t.find('  function line(list, o) {'); _lp = t.find(_lg, _li)
assert _li > 0 and 0 < _lp - _li < 600, 'line legend'
t = t[:_lp] + _lg + """
      if (o.legendOne) {
        b.legend.enabled = true; b.legend.align = 'center'; b.legend.verticalAlign = 'bottom'; b.legend.layout = 'horizontal';
        b.legend.symbolWidth = 14; b.legend.symbolHeight = 2; b.legend.margin = 10;
        b.legend.itemStyle = Object.assign({}, b.legend.itemStyle, {
          fontFamily: tok('--numeric-font-family', "'JetBrains Mono', monospace"), fontSize: '12px',
          fontWeight: '400', color: tok('--page-text-color', '#cad3e2') });
      }""" + t[_lp + len(_lg):]
for _f in ("function subnetUsageTrendHtml(usedNow, seedKey = 'overview', h = 214, showPicker = true) {",
           "function rogueTrendHtml(rogueCountNow, seedKey = 'rogue-overview', showPicker = false) {"):
    assert t.count(_f) == 1, _f
    t = t.replace(_f, _f.replace(") {", ", lineOpts = {}) {"))
for _c in ("${DSCharts.line([{ name: 'Used IPs', data }], { h, legend: false, categories: subnetUsageTrendCategories(range) })}",
           "${DSCharts.line([{ name: 'Rogue devices', data }], { h: 214, legend: false, categories: subnetUsageTrendCategories(range) })}"):
    assert t.count(_c) == 1, _c
    t = t.replace(_c, _c.replace("categories: subnetUsageTrendCategories(range) })", "categories: subnetUsageTrendCategories(range), ...lineOpts })"))
for _a, _b in (("rogueTrendHtml(ROGUE_DEVICES.filter(r => r.status === 'Rogue').length))}",
                "rogueTrendHtml(ROGUE_DEVICES.filter(r => r.status === 'Rogue').length, 'rogue-overview', false, { h: 260, legendOne: true }))}"),
               ("subnetUsageTrendHtml(c.used, 'overview', 214, false))}",
                "subnetUsageTrendHtml(c.used, 'overview', 260, false, { h: 260, legendOne: true }))}")):
    assert t.count(_a) == 1, _a
    t = t.replace(_a, _b)


# ── §30 · Site Count is a TREEMAP, like the product's tree-map widget ──
# One tile per site, area = its count, filled with the categorical palette by order (--ds-series-N),
# the name and the count in mono white (--active-text-color, #fff in both themes). The vendored
# Highcharts has NO treemap module and this page must work offline, so it is HTML: a squarified layout
# computed in PERCENTAGES against the card's typical aspect, so it scales with the card and never
# needs measuring, a ResizeObserver or a redraw.
_vz = "const vizTopN = (rows, opts = {}) =>"
assert t.count(_vz) == 1, 'vizTopN anchor'
t = t.replace(_vz, r"""/* squarified treemap (Bruls et al.) in % of a box `aspect` wide by 1 tall */
function dsTreemapLayout(vals, aspect) {
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const items = vals.map((v, i) => ({ i, a: v / total * aspect }));
  const out = []; let x = 0, y = 0, w = aspect, h = 1, row = [];
  const worst = (r, side) => { const s = r.reduce((a, b) => a + b.a, 0); if (!s) return Infinity;
    return Math.max(...r.map(o => Math.max(side * side * o.a / (s * s), (s * s) / (side * side * o.a)))); };
  const lay = r => { const s = r.reduce((a, b) => a + b.a, 0);
    if (w >= h) { const cw = s / h; let cy = y; r.forEach(o => { const ch = o.a / cw; out[o.i] = { x, y: cy, w: cw, h: ch }; cy += ch; }); x += cw; w -= cw; }
    else { const rh = s / w; let cx = x; r.forEach(o => { const cw = o.a / rh; out[o.i] = { x: cx, y, w: cw, h: rh }; cx += cw; }); y += rh; h -= rh; } };
  items.forEach(o => { const side = Math.min(w, h);
    if (!row.length || worst(row.concat(o), side) <= worst(row, side)) row.push(o); else { lay(row); row = [o]; } });
  if (row.length) lay(row);
  return out.map(r => ({ l: r.x / aspect * 100, t: r.y * 100, w: r.w / aspect * 100, h: r.h * 100 }));
}
function vizTreemap(rows, opts = {}) {
  const vals = rows.map(r => Number(r.v) || 0);
  const box = dsTreemapLayout(vals, opts.aspect || 3);
  return `<div class="ip-tm" style="height:${opts.h || 250}px" role="img" aria-label="${esc(rows.map(r => r.name + ' ' + (r.label ?? r.v)).join(', '))}">` +
    rows.map((r, i) => `<div class="ip-tmc" title="${esc(r.name)}: ${esc(String(r.label ?? r.v))}" style="left:${box[i].l}%;top:${box[i].t}%;width:${box[i].w}%;height:${box[i].h}%;background:var(--ds-series-${(i % 8) + 1})"><b>${esc(r.name)}</b><span>${esc(String(r.label ?? r.v))}</span></div>`).join('') +
    `</div>`;
}
""" + _vz)
_w = "siteRows.length ? vizTopN(siteRows, { h: 250, product: true })"
assert t.count(_w) == 1, 'site count call'
t = t.replace(_w, "siteRows.length ? vizTreemap(siteRows.map(r => ({ name: r.name, v: r.pct, label: r.v })), { h: 262, aspect: 2.9 })")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
assert t.count(_s) == 1
t = t.replace(_s, _s + """
.ip-tm { position: relative; margin: 0; }
/* the treemap runs edge to edge: the card body's padding is dropped and the map fills it */
.ip-ovgrid > .ip-card > .ip-card-body:has(> .ip-tm) { padding: 0; position: relative; }
.ip-card-body > .ip-tm { position: absolute; inset: 0; height: auto !important; }
.ip-tmc { position: absolute; box-sizing: border-box; border: 0;
  padding: 8px; overflow: hidden; display: flex; flex-direction: column; gap: 2px;
  font-family: var(--numeric-font-family); color: var(--active-text-color); }
.ip-tmc b { font-size: 13px; font-weight: 600; line-height: 1.25; overflow-wrap: break-word; }
.ip-tmc span { font-size: 12px; opacity: .85; }""")


# ── §31 · Subnet Capacity: no Name column, and Utilization carries a 24 h sparkline ──
# obs-table's own `sparkline` cell (a 1.5px polyline, class .cell-spark, preserveAspectRatio none) is
# sized to its column and recoloured by an adopted sheet. Padding the series with its MINIMUM at both
# ends makes the polyline's fill close along the baseline, so `fill` paints the area under the line —
# the reference's shaded sparkline without leaving the DS cell. The history is deterministic per subnet
# and ends on today's real utilisation (a prototype with no time series of its own).
rep("""  columns.push({ key: 'sn', title: 'Subnet', type: 'link' }, { key: 'nm', title: 'Name' },
               { key: 'ut', title: 'Utilization', type: 'severity', align: 'right' });""",
    """  columns.push({ key: 'sn', title: 'Subnet', type: 'link', width: '34%' }, { key: 'sp', title: '', type: 'sparkline' },
               { key: 'ut', title: 'Utilization', type: 'severity', align: 'right', width: '92px' });""")
rep("    d.sn = { text: r.cidr }; d.nm = r.nm; d.ut = r.value; d.sev = BAND_SEV[r.band] || 'unknown';",
    "    d.sn = { text: r.cidr }; d.sp = dsUtilSpark(r.cidr, parseFloat(r.value) || 0); d.ut = r.value; d.sev = BAND_SEV[r.band] || 'unknown';")
rep("function dsTopNEnhance(columns, data, rows) {",
    """function dsUtilSpark(key, now) {
  let h = 2166136261; for (const ch of String(key)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296);
  const pts = []; let v = Math.max(5, now - 6 - rnd() * 10);
  for (let i = 0; i < 23; i++) { pts.push(+v.toFixed(1)); v = Math.min(100, Math.max(1, v + (now - v) / (24 - i) + (rnd() - .5) * 7)); }
  pts.push(now);
  const lo = Math.min(...pts);
  return [lo].concat(pts, [lo]);   /* the two ends close the fill along the baseline */
}
const DS_SPARK_SHEET = new CSSStyleSheet();
DS_SPARK_SHEET.replaceSync('.cell-spark{display:block;width:100%;height:28px}'
  + '.cell-spark polyline{stroke:var(--sparkline-color-response-time);stroke-width:1.5px;vector-effect:non-scaling-stroke;'
  + 'fill:color-mix(in srgb,var(--sparkline-color-response-time) 22%,transparent)}');
function dsTopNEnhance(columns, data, rows) {""")
rep("    if (el.id === 'tblTopN') { el.stickyHeader = true; el.maxHeight = '262px'; }",
    "    if (el.id === 'tblTopN') { el.stickyHeader = true; el.maxHeight = '262px';\n"
    "      if (el.shadowRoot && !el.__dsSpark) { el.__dsSpark = true; el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_SPARK_SHEET]; } }")


# ── §32 · Subnet Capacity's sparkline drawn like the DS's `spark-style="area"` (Top Monitor by Memory) ──
# Reference: obs-table spark-style="area" in DS 0.1.240 — Subnet | value | Sparkline (wide, last), a SMOOTH line
# over a vertical gradient fill. This page vendors DS 0.1.166, whose sparkline cell is a straight polyline with no
# area, and swapping the whole inline bundle is out of scope, so: the 24 points are Catmull-Rom resampled (smooth),
# and a <linearGradient> is appended INTO the table's shadow root so `fill:url(#dsSparkGrad)` resolves there.
rep("""  columns.push({ key: 'sn', title: 'Subnet', type: 'link', width: '34%' }, { key: 'sp', title: '', type: 'sparkline' },
               { key: 'ut', title: 'Utilization', type: 'severity', align: 'right', width: '92px' });""",
    """  columns.push({ key: 'sn', title: 'Subnet', type: 'link', width: '30%' },
               { key: 'ut', title: 'Utilization', width: '24%' },   /* plain value — the band dot was removed on request */
               { key: 'sp', title: 'Sparkline', type: 'sparkline' });""")
rep("""  pts.push(now);
  const lo = Math.min(...pts);
  return [lo].concat(pts, [lo]);   /* the two ends close the fill along the baseline */""",
    """  pts.push(now);
  /* Catmull-Rom, 5 samples per segment: the cell draws straight segments, so smoothness has to be in the data */
  const sm = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < 5; k++) { const u = k / 5, u2 = u * u, u3 = u2 * u;
      sm.push(+(0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3)).toFixed(2)); }
  }
  sm.push(now);
  const lo = Math.min(...sm);
  return [lo].concat(sm, [lo]);   /* the two ends close the fill along the baseline */""")
rep("""DS_SPARK_SHEET.replaceSync('.cell-spark{display:block;width:100%;height:28px}'
  + '.cell-spark polyline{stroke:var(--sparkline-color-response-time);stroke-width:1.5px;vector-effect:non-scaling-stroke;'
  + 'fill:color-mix(in srgb,var(--sparkline-color-response-time) 22%,transparent)}');""",
    """DS_SPARK_SHEET.replaceSync('.cell-spark{display:block;width:100%;height:34px}'
  + '.cell-spark polyline{stroke:var(--sparkline-color-response-time);stroke-width:1.5px;vector-effect:non-scaling-stroke;'
  + 'fill:url(#dsSparkGrad)}');
/* the gradient lives in the table's OWN shadow root — an id is scoped to its tree, so a page-level <defs> is not seen */
function dsSparkDefs(root) {
  if (root.getElementById('dsSparkGrad')) return;
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = '<defs><linearGradient id="dsSparkGrad" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" style="stop-color:var(--sparkline-color-response-time);stop-opacity:.55"/>'
    + '<stop offset="1" style="stop-color:var(--sparkline-color-response-time);stop-opacity:0"/></linearGradient></defs>';
  root.appendChild(svg);
}""")
rep("el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_SPARK_SHEET]; } }",
    "el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_SPARK_SHEET]; }\n"
    "      if (el.shadowRoot) dsSparkDefs(el.shadowRoot); }")


# ── §33 · Overview cards: one border, no inner padding ──
# (1) obs-toolbar's widget variant draws its own rounded-top frame (`.tb.v-widget{border:1px solid
#     var(--border-color)}`) INSIDE our .ip-card's border, so the top and sides showed two lines. The
#     card's border is the frame; the toolbar's is turned off by re-pointing --border-color on its host
#     (a custom property inherits into its shadow root) — the strip's fill stays.
# (2) every overview card body loses its padding: charts, the treemap and the table run to the card's edge.
#     The Subnet Capacity scroller is sized to the body it now fills, so no gap is left under the table.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
assert t.count(_s) == 1
t = t.replace(_s, _s + """
.ip-ovgrid > .ip-card > obs-toolbar[variant="widget"] { --border-color: transparent; }
.ip-ovgrid > .ip-card > .ip-card-body { padding: 0; }""")
_m = "el.maxHeight = '262px';"
assert t.count(_m) == 1, 'topN maxHeight'
t = t.replace(_m, "const _bd = el.closest('.ip-card-body'); el.maxHeight = ((_bd && _bd.clientHeight > 120) ? _bd.clientHeight - 6 : 300) + 'px';")


# ── §34 · "Rogue Devices Trend" → "Rogue Detection Trend" on the Overview, legend included ──
# The series name is a parameter (lineOpts.seriesName) so the Rogue Detection tab's own chart keeps its wording.
_c = "${DSCharts.line([{ name: 'Rogue devices', data }],"
assert t.count(_c) == 1, 'rogue series'
t = t.replace(_c, "${DSCharts.line([{ name: lineOpts.seriesName || 'Rogue devices', data }],")
_w = "${ovWidget('Rogue Devices Trend', rogueTrendHtml(ROGUE_DEVICES.filter(r => r.status === 'Rogue').length, 'rogue-overview', false, { h: 260, legendOne: true }))}"
assert t.count(_w) == 1, 'rogue overview widget'
t = t.replace(_w, "${ovWidget('Rogue Detection Trend', rogueTrendHtml(ROGUE_DEVICES.filter(r => r.status === 'Rogue').length, 'rogue-overview', false, { h: 260, legendOne: true, seriesName: 'Rogue detection' }))}")


# ── §35 · every Overview card is 290px tall (was 340) ──
# The body left under the 38px title strip is ~248px, so each chart is drawn at 244 to fit it: the donuts,
# both bar/Top-N charts and both trends. The treemap and the Subnet Capacity scroller already size to the body.
_c = ".ip-ovgrid > .ip-card { grid-column: auto !important; height: 340px;"
assert t.count(_c) == 1, 'ovgrid card height'
t = t.replace(_c, ".ip-ovgrid > .ip-card { grid-column: auto !important; box-sizing: border-box; height: 290px;")
_o = t.find('function screenOverview() {'); _e = t.find('\nfunction blindReason', _o)
_b = t[_o:_e]
_n = _b.count('h: 250') + _b.count('h: 260') + _b.count("'overview', 260,")
assert _n >= 6, 'overview chart heights: %d' % _n
_b = _b.replace('h: 250', 'h: 244').replace('h: 260', 'h: 244').replace("'overview', 260,", "'overview', 244,")
t = t[:_o] + _b + t[_e:]


# ── §36 · subnet detail: "Total IP" and "IP utilisation" are ONE card, shaped like the product's CPU tile ──
# Reference: the monitor page's CPU tile — icon tile, title, a caption row of facts (User · Interrupt), the figure
# with a smaller unit, and a full-width bar under it. Here: IP utilisation · "Total IP: 254 · Used: 178" · 74 % · a
# bar filled to 74 % in its band colour. The "26 % free" line is gone (the bar's empty part says it). Clicking it
# lists every address, as the Total IP card did. Six tiles become five.
_k = "function dsSdKpis(c, blind) {"
assert t.count(_k) == 1
t = t.replace(_k, r"""function dsSdKpiUtil(c, blind) {
  const col = bandVar(blind ? 'Unknown' : c.pct >= 90 ? 'Critical' : c.pct >= 75 ? 'High' : c.pct >= 50 ? 'Moderate' : 'Healthy');
  const fill = blind ? 0 : Math.max(0, Math.min(100, c.pct));
  return `<div class="ip-sev-box ip-stat-click ip-sdku" data-stat-status="" role="button" tabindex="0">
    <div class="ip-sev-body">
      <span class="ip-sdki" style="--ip-kc:${col}"><obs-icon name="${DS_SD_KPI_IC['IP utilisation'] || 'utilization'}" size="20"></obs-icon></span>
      <span class="ip-sdkt">IP utilisation</span>
      <span class="ip-sdkf"><span>Total IP: ${esc(num(c.total))}</span><span>Used: ${esc(num(c.used))}</span></span>
      <span class="ip-kv">${blind ? '—' : esc(String(c.pct)) + '<small> %</small>'}</span>
      <span class="ip-sdkb" role="img" aria-label="${blind ? 'no discovery coverage' : esc(String(c.pct)) + ' % utilised'}"><i style="width:${fill}%;background:${col}"></i></span>
    </div></div>`;
}
""" + _k)
_t = "    ${dsSdKpi('Total IP', num(c.total), 'var(--primary-alt)', 'addresses in subnet', '', true)}\n"
assert t.count(_t) == 1
t = t.replace(_t, "    ${dsSdKpiUtil(c, blind)}\n")
_a = t.find("    ${dsSdKpi('IP utilisation',"); _b = t.find("\n  </div>`;", _a)
assert _a > 0 and _b > _a, 'utilisation tile'
t = t[:_a].rstrip(' ').rstrip('\n') + t[_b:]
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
.sn-kpis .ip-sdkf { display: flex; justify-content: space-between; gap: 12px; font-size: .75rem; color: var(--neutral-light); }
.sn-kpis .ip-sdku .ip-kv { display: block; }
.sn-kpis .ip-kv small { font-size: .6em; font-weight: 500; margin-left: 1px; }
.sn-kpis .ip-sdkb { display: block; height: 6px; margin-top: 8px; border-radius: 4px; overflow: hidden;
  background: var(--neutral-lighter, var(--border-color)); }
.sn-kpis .ip-sdkb > i { display: block; height: 100%; border-radius: 4px; }""")


# ── §37 · subnet detail → IP History: a search box, and air between the toolbar and the grid ──
# The search filters the obs-table's own rows in place (never a repaint), so the field keeps focus and its
# caret while you type; the query survives a page change (re-applied after the grid mounts). It matches any
# cell's text — IP, MAC, change, previous/new, device, source. The toolbar → grid gap is 12px on both tabs,
# where the icon buttons sat flush on the grid's header rule.
_h = """    return `<obs-toolbar variant="grid">
      <span class="ip-spacer"></span>
      <obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared
          id="sdHistView\""""
assert t.count(_h) == 1, 'history toolbar'
t = t.replace(_h, """    return `<obs-toolbar variant="grid">
      <obs-input slot="start" id="sdHistSearch" type="search" allow-clear value="${esc(sdHistQ)}"
        placeholder="Search history…"></obs-input>
      <span class="ip-spacer"></span>
      <obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared
          id="sdHistView\"""")
_w = "  if (view.querySelector('#tblSdHist')) {"
assert t.count(_w) == 1, 'history wiring'
t = t.replace(_w, """  /* bound directly: `on()` is a local of another function and does not exist in this scope */
  const sdHistS = view.querySelector('#sdHistSearch');
  if (sdHistS) sdHistS.addEventListener('input', e => {
    const d = detailOf(e);
    sdHistQ = typeof d === 'string' ? d : (d && d.value) || '';
    sdHistApply();
  });
  if (sdHistQ) setTimeout(sdHistApply, 0);
""" + _w)
_f = "function subnetTabBody(s) {"
assert t.count(_f) == 1
t = t.replace(_f, """let sdHistQ = '';
function sdHistApply() {
  const el = document.getElementById('tblSdHist'), d = DS_GRID_DATA.tblSdHist;
  if (!el || !d) return;
  const q = sdHistQ.trim().toLowerCase();
  el.rows = q ? d.rows.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : d.rows;
}
""" + _f)
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + '\n.ip-sdbody > obs-toolbar[variant="grid"] { margin-bottom: 12px; }')


# ── §38 · subnet detail KPI captions trimmed: "Used: N" off the utilisation card, "N% of total" off the rest ──
_u = "<span class=\"ip-sdkf\"><span>Total IP: ${esc(num(c.total))}</span><span>Used: ${esc(num(c.used))}</span></span>"
assert t.count(_u) == 1, 'util caption'
t = t.replace(_u, "<span class=\"ip-sdkf\"><span>Total IP: ${esc(num(c.total))}</span></span>")
_p = "  const pct = n => (c.total ? Math.round(n / c.total * 100) : 0) + '% of total';"
assert t.count(_p) == 1, 'pct caption'
t = t.replace(_p, "  const pct = n => '';   /* the '% of total' caption was removed on request */")
_k = "      <span class=\"ip-ks\">${esc(sub)}</span>\n      <span class=\"ip-kv\">${esc(value)}</span>"
assert t.count(_k) == 1, 'kpi caption'
t = t.replace(_k, "      ${sub ? `<span class=\"ip-ks\">${esc(sub)}</span>` : ''}\n      <span class=\"ip-kv\">${esc(value)}</span>")


# ── §39 · list toolbars: 12px above the filter row / grid, and the edge button's tooltip opens LEFT ──
# The toolbar sat flush on the grid's header rule (Subnet Details · IP Details · Rogue Detection share it).
# obs-tooltip takes top/bottom/left/right only; a "bottom" tip centred under the last button overhung the
# card's right edge and .ip-card's overflow:hidden cut it in half, so the filter toggles open to the left.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + '\n.ip-sncard > obs-toolbar[variant="grid"] { margin-bottom: 12px; }')
import re as _re
_n = 0
def _tip(m):
    global _n; _n += 1
    return m.group(0).replace('placement="bottom"', 'placement="left"')
t = _re.sub(r'<obs-tooltip placement="bottom">(?:(?!</obs-tooltip>).)*?id="(?:sn|ip|rogue|rg|sdIps|sdHist)FilterToggle"', _tip, t, flags=_re.S)
assert _n >= 4, 'filter tooltips: %d' % _n

# ── §40 · the pager is boxed like obs-pagination (DS 0.1.240's own sample) ──
# The vendored obs-table pager already uses obs-pagination's class names (.pager .pleft .ppage .psize .prange),
# so only the frame changes: a 1px rounded box with 2px/10px padding, 8px under the rows. The subnet utilisation
# legend still sits centred on it (obs-pagination's centre slot), placed by measurement as before.
_p = """.box>.pager{margin-top:auto;position:sticky;bottom:0;z-index:2;background:var(--page-background-color);
  border-top:1px solid var(--border-color)}"""
assert t.count(_p) == 1, 'pager rule'
t = t.replace(_p, """.box>.pager{margin-top:auto;position:sticky;bottom:0;z-index:2;background:var(--page-background-color);
  border:1px solid var(--border-color);border-radius:6px;padding:2px 10px;min-height:0;flex:0 0 auto}
.box>table{margin-bottom:8px}
.pager .pleft,.pager .prange{padding:6px 4px}""")

# ── §41 · tag columns: one line, and a non-tag value is plain text, not a grey pill ──
# A text cell in a 'tags' column used to become a default (grey) pill — "Not Available" read as a status.
# It is now a tag with an unknown variant ('ip-plain'): obs-tag's base .tag has no fill or colour of its
# own, so it renders as muted text, pulled back 8px to the column's text edge. Tags never wrap.
_d = "      o['c' + i] = ct === 'tags' && v.type !== 'tags' ? (v.value ? [{ label: v.value, variant: 'default' }] : [])"
assert t.count(_d) == 1, 'tags fallback'
t = t.replace(_d, "      o['c' + i] = ct === 'tags' && v.type !== 'tags' ? (v.value ? [{ label: v.value, variant: 'ip-plain' }] : [])")
_g = ".prange{font-variant-numeric:tabular-nums}\n`);"
assert t.count(_g) == 1, 'grid sheet tail'
t = t.replace(_g, """.prange{font-variant-numeric:tabular-nums}
td obs-tag{white-space:nowrap}
td obs-tag[variant="ip-plain"]{margin-left:-8px;color:var(--neutral-light)}
`);""")


# ── §42 · subnet detail: "IP" before each status tile's name; Discover Device wears the product's discovery glyph ──
# Only the DISPLAYED title changes — the label is still the key for DS_SD_KPI_IC and the click filter.
_k = "      <span class=\"ip-sdkt\">${esc(label)}</span>"
assert t.count(_k) == 1, 'kpi title'
t = t.replace(_k, "      <span class=\"ip-sdkt\">IP ${esc(label)}</span>")
_m = "{ key: 'discover', label: 'Discover Device', icon: 'scan' }"
assert t.count(_m) == 1, 'discover menu'
t = t.replace(_m, "{ key: 'discover', label: 'Discover Device', icon: 'network-discovery' }")


# ── §43 · the ⋮ column is titled "Action"; subnet detail → IP Details gets a search box ──
# obs-table renders its rowActions column with an EMPTY header cell. The title is CSS content on that cell,
# guarded by :empty, so a grid whose last column is real data keeps its own title.
_g = 'td obs-tag{white-space:nowrap}'
assert t.count(_g) == 1
t = t.replace(_g, _g + '\n.grid thead th:last-child:empty::after{content:"Action"}\n.grid thead th:last-child:empty{text-align:right}')
# IP Details search: same shape as IP History's (§37) — filters the obs-table's own rows in place.
_h = """    <obs-toolbar variant="grid">
      <span class="ip-spacer"></span>
      <obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared
          id="sdIpsView\""""
assert t.count(_h) == 1, 'ips toolbar'
t = t.replace(_h, """    <obs-toolbar variant="grid">
      <obs-input slot="start" id="sdIpsSearch" type="search" allow-clear value="${esc(sdIpsQ)}"
        placeholder="Search IP addresses…"></obs-input>
      <span class="ip-spacer"></span>
      <obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared
          id="sdIpsView\"""")
_w = "  /* bound directly: `on()` is a local of another function and does not exist in this scope */"
assert t.count(_w) == 1
t = t.replace(_w, """  const sdIpsS = view.querySelector('#sdIpsSearch');
  if (sdIpsS) sdIpsS.addEventListener('input', e => {
    const d = detailOf(e);
    sdIpsQ = typeof d === 'string' ? d : (d && d.value) || '';
    sdGridFilter('tblSdIps', sdIpsQ);
  });
  if (sdIpsQ) setTimeout(() => sdGridFilter('tblSdIps', sdIpsQ), 0);
""" + _w)
_f = "let sdHistQ = '';"
assert t.count(_f) == 1
t = t.replace(_f, """let sdHistQ = '', sdIpsQ = '';
function sdGridFilter(id, q) {
  const el = document.getElementById(id), d = DS_GRID_DATA[id];
  if (!el || !d) return;
  q = (q || '').trim().toLowerCase();
  el.rows = q ? d.rows.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : d.rows;
}""")


# ── §44 · every IPAM search box: the magnifier LEFT, placeholder "Search"; the pager keeps only a TOP border ──
# obs-input draws its search glyph as a suffix (.adorn.suf, after the field). One sheet, adopted into each search
# input's shadow root as it appears (a document observer — the screens re-render), puts it first.
import re as _re2
_np = len(_re2.findall(r'placeholder="Search[^"]*"', t))
t = _re2.sub(r'(<obs-input[^>]*?type="search"[^>]*?)placeholder="Search[^"]*"', r'\1placeholder="Search"', t, flags=_re2.S)
t = _re2.sub(r'placeholder="Search[^"]*"(\s*(?:[\w-]+(?:="[^"]*")?\s*)*>)', lambda m: m.group(0), t)
_dm = "function dsMount() {"
assert t.count(_dm) == 1
t = t.replace(_dm, """const DS_SEARCH_SHEET = new CSSStyleSheet();
DS_SEARCH_SHEET.replaceSync('.ip.t-search .adorn.suf{order:-1;margin:0 8px 0 0}.ip.t-search .adorn.suf obs-icon{--icon-size:16px}');
function dsSearchStyle() {
  document.querySelectorAll('obs-input[type="search"]').forEach(el => {
    if (!el.shadowRoot || el.__dsSearch) return;
    el.__dsSearch = true;
    el.shadowRoot.adoptedStyleSheets = [...el.shadowRoot.adoptedStyleSheets, DS_SEARCH_SHEET];
  });
}
new MutationObserver(() => dsSearchStyle()).observe(document.documentElement, { childList: true, subtree: true });
""" + _dm)
_p = "  border:1px solid var(--border-color);border-radius:6px;padding:2px 10px;min-height:0;flex:0 0 auto}"
assert t.count(_p) == 1, 'pager box'
t = t.replace(_p, "  border:0;border-top:1px solid var(--border-color);border-radius:0;padding:2px 10px;min-height:0;flex:0 0 auto}")

# ── §45 · Subnet Details: Utilisation is obs-table's own BAR cell, the % under the bar ──
# Reference: the DS grid's bar column (a 6px track, its fill, the value beneath). The cell's own rule paints the
# fill --severity-major above 70 % and --primary-alt below; the sheet stacks the label under the track.
_e = "    if (c.title === 'VLAN' || c.title === 'Last scan' || c.title === 'Gateway') c.sortable = true;\n  });\n}"
assert t.count(_e) == 1, 'subnet enhance tail'
t = t.replace(_e, """    if (c.title === 'VLAN' || c.title === 'Last scan' || c.title === 'Gateway') c.sortable = true;
    if (c.title === 'Utilisation') {
      c.type = 'bar'; c.sortable = true;
      data.forEach((d, i) => { const u = rows[i].util; d[c.key] = (u == null || isNaN(u)) ? 0 : Math.round(u); });
    }
  });
}""")
_g = 'td obs-tag{white-space:nowrap}'
t = t.replace(_g, _g + '\n.cell-bar{flex-direction:column;align-items:stretch;gap:4px;padding-right:12px}\n.cell-bar .bar-track{flex:0 0 6px}\n.cell-bar .bar-lbl{font-size:12px}')


# ── §46 · the IP detail side panel laid out like the product's monitor panel ──
# Reference: FortiFirewall-VM — icon tile · bold name with "| host | vendor" beside it · a tag row · plain text
# tabs · sentence-case section headings with a rule BETWEEN sections · a History tab with search, its pager at
# the panel's foot. Discover device moved from the header to the right end of the tab row (it acts on the
# address the tabs describe), in BOTH hosts — the stacked panel and the full-page view share ipViewHtml.
_h = """    <div class="ip-sp-head">
      <span class="ip-sp-title">${esc(x.ip)}${dsIpTag(x)}</span>
      ${dsIpDiscover(x)}
      <obs-button variant="transparent" squared id="ipStackX\""""
assert t.count(_h) == 1, 'stack head'
t = t.replace(_h, """    <div class="ip-sp-head ip-sp-head2">
      ${dsIpHead(x)}
      <obs-button variant="transparent" squared id="ipStackX\"""")
_s2 = """        <div class="ip-dr-title ip-sp-title">${esc(x.ip)}${dsIpTag(x)}</div>
        ${dsIpDiscover(x)}"""
assert t.count(_s2) == 1, 'page head'
t = t.replace(_s2, """        ${dsIpHead(x)}""")
_tb = """      <obs-tabs id="ipTabs" variant="no-border" value="${esc(ipd.tab)}" tabs='${j(tabs)}'></obs-tabs>"""
assert t.count(_tb) == 1, 'ip tabs'
t = t.replace(_tb, """      <div class="ip-sp-tabrow"><obs-tabs id="ipTabs" variant="no-border" value="${esc(ipd.tab)}" tabs='${j(tabs)}'></obs-tabs>${dsIpDiscover(x)}</div>""")
_dt = "const dsIpDiscover = x =>"
assert t.count(_dt) == 1
t = t.replace(_dt, """const dsIpHead = x => {
  const meta = [x.host, x.vendor].filter(Boolean).map(v => '| ' + esc(v)).join(' ');
  return `<span class="ip-sp-tile"><obs-icon name="ip" size="20"></obs-icon></span>
    <div class="ip-sp-id">
      <div class="ip-sp-tl"><b>${esc(x.ip)}</b>${meta ? `<span class="ip-sp-meta">${meta}</span>` : ''}</div>
      <div class="ip-sp-tags"><obs-tag variant="${DS_STATUS_TAG[x.status] || 'default'}">${esc(x.status)}</obs-tag>${dsIpTag(x)}${x.devType ? `<obs-tag variant="default">${esc(x.devType)}</obs-tag>` : ''}</div>
    </div>`;
};
""" + _dt)
# History tab: a search box above the grid, filtering the grid's own rows in place (as §37)
_hs = "    return `${grid('tblIpHist', ["
assert t.count(_hs) == 1, 'ip hist grid'
t = t.replace(_hs, """    return `<obs-input id="ipHistSearch" type="search" allow-clear placeholder="Search" class="ip-sp-search" value="${esc(ipHistQ)}"></obs-input>
    ${grid('tblIpHist', [""")
_bb = "function bindIpBody() {\n  const host = ipHost();\n  if (!host) return;"
assert t.count(_bb) == 1, 'bindIpBody'
t = t.replace(_bb, """let ipHistQ = '';
function bindIpBody() {
  const host = ipHost();
  if (!host) return;
  const hs = host.querySelector('#ipHistSearch');
  if (hs) hs.addEventListener('input', e => { const d = detailOf(e); ipHistQ = typeof d === 'string' ? d : (d && d.value) || ''; sdGridFilter('tblIpHist', ipHistQ); });
  if (ipHistQ) setTimeout(() => sdGridFilter('tblIpHist', ipHistQ), 0);""")
# the History grid fills the panel so its pager sits at the panel's foot: dsFit measures the panel body
_fs = "const DS_FIT = new Set(['tblSubnets', 'tblIps', 'tblRogue']);"
assert t.count(_fs) == 1
t = t.replace(_fs, "const DS_FIT = new Set(['tblSubnets', 'tblIps', 'tblRogue', 'tblIpHist']);")
for _a in ("  const ct = el.closest('.ip-content');\n  if (!box || !ct) return;",
           "  const ct = el.closest('.ip-content'), card = el.closest('.ip-card');"):
    assert t.count(_a) == 1, _a
t = t.replace("  const ct = el.closest('.ip-content');\n  if (!box || !ct) return;",
              "  const ct = el.closest('.ip-sp-body') || el.closest('.ip-content');\n  if (!box || !ct) return;")
t = t.replace("  const ct = el.closest('.ip-content'), card = el.closest('.ip-card');",
              "  const ct = el.closest('.ip-sp-body') || el.closest('.ip-content'), card = el.closest('.ip-card');")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
.ip-sp-head.ip-sp-head2 { align-items: flex-start; gap: 12px; padding: 16px 20px; }
.ip-sp-tile { flex: 0 0 40px; height: 40px; display: grid; place-items: center; border-radius: 4px;
  color: var(--primary-alt); background: color-mix(in srgb, var(--primary-alt) 12%, transparent); }
.ip-sp-id { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.ip-sp-tl { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.ip-sp-tl b { font-size: 1.25rem; font-weight: 600; color: var(--primary-alt); }
.ip-sp-meta { font-size: .8rem; color: var(--neutral-light); }
.ip-sp-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.ip-sp-tabrow { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-color); }
.ip-sp-tabrow > obs-tabs { flex: 1 1 auto; min-width: 0; }
.ip-sp-tabrow > obs-button { flex: none; }
#ipBody .ip-group-h { font-size: 1rem; font-weight: 600; text-transform: none; letter-spacing: 0;
  color: var(--primary-alt); border-bottom: 0; padding-bottom: 0; margin-bottom: 8px; }
#ipBody .ip-group + .ip-group { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); }
.ip-sp-search { display: block; max-width: 300px; margin-bottom: 12px; }""")

# ── §47 · IP Details → IP Address Status tiles: no caption line ("addresses in scope" / "N% of total") ──
_c = """        <span class="ip-ks">${b.label === 'Total' ? 'addresses in scope'
          : (c.total ? Math.round(b.value / c.total * 100) : 0) + '% of total'}</span>\n"""
assert t.count(_c) == 1, 'status tile caption'
t = t.replace(_c, "")


# ── §48 · the Vendor column shows the vendor's LOGO, not its name ──
# Marks: Simple Icons (CC0 1.0, no attribution needed) for Cisco · Dell · HP · Lenovo · Apple · Siemens · Supermicro ·
# VMware, and the product's own logo library (DS 0.1.240 `logos`, aruba-wireless) for Aruba. Stored beside this script
# in vendor_logos.json. NO free set carries an Axis Communications mark and a brand mark is never hand-drawn, so Axis
# (and any vendor without a mark) gets the neutral `globe` glyph; the name is the icon's label and tooltip either way.
# How it renders: an obs-table `icon` cell draws <obs-icon name=…>; a private name (v-cisco…) draws nothing of its own,
# and the grid sheet paints that host with the mark as a CSS MASK in --page-text-color — monochrome, both themes.
import json as _json, os as _os, urllib.parse as _up
_VLALL = _json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'vendor_logos.json')))
_VL = _VLALL['mono']
_css = ['td obs-icon[name^="v-"]{display:inline-block;width:20px;height:20px;background-color:var(--page-text-color);'
        '-webkit-mask:var(--vlogo) center/contain no-repeat;mask:var(--vlogo) center/contain no-repeat}']
for _k, _svg in _VL.items():
    if not _svg: continue
    _svg = _svg.replace("'", '"')
    _css.append('td obs-icon[name="v-%s"]{--vlogo:url("data:image/svg+xml,%s")}' % (_k, _up.quote(_svg, safe='')))
_g = 'td obs-tag{white-space:nowrap}'
assert t.count(_g) == 1
t = t.replace(_g, _g + '\n' + '\n'.join(_css))
_hk = "  if (id === 'tblSdHist' || id === 'tblIpHist') dsSdHistEnhance(columns, data, rows);"
assert t.count(_hk) == 1
t = t.replace(_hk, _hk + "\n  dsVendorEnhance(columns, data, rows);")
_dm = "function dsMount() {"
t = t.replace(_dm, """const DS_VENDOR_LOGO = %s;
function dsVendorKey(v) {
  const s = String(v || '').toLowerCase();
  return DS_VENDOR_LOGO.find(k => s.includes(k)) || '';
}
function dsVendorEnhance(columns, data, rows) {
  const c = columns.find(x => x.title === 'Vendor');
  if (!c) return;
  c.type = 'icon'; delete c.sortable; c.width = '72px';
  data.forEach((d, i) => {
    const v = rows[i].vendor || '';
    d[c.key] = v ? { icon: dsVendorKey(v) ? 'v-' + dsVendorKey(v) : 'globe', label: v } : { icon: '', label: '' };
  });
}
""" % _json.dumps([k for k, v in _VL.items() if v]) + _dm)

# ── §49 · Subnet Details utilisation bars take the LEGEND's band colours ──
# obs-table writes the fill inline (--severity-major over 70 %, --primary-alt below). Each fill is repainted from its
# own value with the bands the legend names: Critical ≥ 90 · High ≥ 75 · Moderate ≥ 50 · Healthy below. A style
# observer re-applies it after a sort or page change; it only writes when the colour differs, so it cannot loop.
_gs = "  dsMenuStyle(el.shadowRoot);\n  new MutationObserver(() => dsMenuStyle(el.shadowRoot)).observe(el.shadowRoot, { childList: true, subtree: true });"
assert t.count(_gs) == 1, 'grid style hook'
t = t.replace(_gs, """  dsMenuStyle(el.shadowRoot); dsBarPaint(el.shadowRoot);
  new MutationObserver(() => { dsMenuStyle(el.shadowRoot); dsBarPaint(el.shadowRoot); })
    .observe(el.shadowRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });""")
_gf = "function dsGridStyle(el) {"
t = t.replace(_gf, """function dsBarPaint(root) {
  root.querySelectorAll('.cell-bar').forEach(c => {
    const f = c.querySelector('.bar-fill'), l = c.querySelector('.bar-lbl');
    if (!f || !l) return;
    const v = parseFloat(l.textContent) || 0;
    const want = 'var(--severity-' + (v >= 90 ? 'critical' : v >= 75 ? 'major' : v >= 50 ? 'warning' : 'clear') + ')';
    if (f.style.background !== want) f.style.background = want;
  });
}
""" + _gf)

# ── §50 · subnet detail cards: the utilisation card is titled "Total IP"; every card wears a fitting glyph ──
# Total IP → ip · Used → check-circle · Available → plus-circle (free to hand out) · Transient → history (seen
# before, not now) · Reserved → flag (set aside). All five render in this bundle (checked: an unknown name draws
# NOTHING). The caption under the new title reads "254 addresses" — "Total IP: 254" under "Total IP" said it twice.
_ic = "const DS_SD_KPI_IC = { 'Total IP': 'ip', Used: 'check-circle', Available: 'lock-open', Transient: 'clock', Reserved: 'tag', 'IP utilisation': 'utilization' };"
assert t.count(_ic) == 1, 'kpi icons'
t = t.replace(_ic, "const DS_SD_KPI_IC = { 'Total IP': 'ip', Used: 'check-circle', Available: 'plus-circle', Transient: 'history', Reserved: 'flag', 'IP utilisation': 'ip' };")
for _a, _b in (("      <span class=\"ip-sdkt\">IP utilisation</span>", "      <span class=\"ip-sdkt\">Total IP</span>"),
               ("<span class=\"ip-sdkf\"><span>Total IP: ${esc(num(c.total))}</span></span>", "<span class=\"ip-sdkf\"><span>${esc(num(c.total))} addresses</span></span>")):
    assert t.count(_a) == 1, _a
    t = t.replace(_a, _b)

# ── §51 · Discover device is a PRIMARY button, with the product's discovery glyph ──
_dd = """`<obs-button variant="default" size="small" id="ipDiscoverDevice"><obs-icon name="search" size="14"></obs-icon>&nbsp;Discover device</obs-button>`"""
assert t.count(_dd) == 1, 'discover button'
t = t.replace(_dd, """`<obs-button variant="primary" size="small" id="ipDiscoverDevice"><obs-icon name="network-discovery" size="14"></obs-icon>&nbsp;Discover device</obs-button>`""")


# ── §52 · IP Details → status tiles: no "IP Address Status" heading, and the subnet detail's KPI design ──
# The widget frame and its title go; the five tiles become the same cards the subnet detail uses (icon tile in the
# status colour · title · figure), so the two screens show address counts one way. Names follow §42/§50:
# Total IP · IP Used · IP Transient · IP Available · IP Reserved; icons from DS_SD_KPI_IC.
_a = t.find("  return widget('IP Address Status', `<div class=\"ip-sev-row\">")
_b = t.find("  </div>`, { actions: '' });\n}", _a)
assert _a > 0 and _b > _a, 'status widget'
_b += len("  </div>`, { actions: '' });\n}")
t = t[:_a] + """  return `<div class="ip-sev-row sn-kpis ip-ipkpis">
    ${boxes.map(b => `<div class="ip-sev-box">
      <div class="ip-sev-body">
        <span class="ip-sdki" style="--ip-kc:${b.color}"><obs-icon name="${DS_SD_KPI_IC[b.label === 'Total' ? 'Total IP' : b.label] || 'ip'}" size="20"></obs-icon></span>
        <span class="ip-sdkt">${b.label === 'Total' ? 'Total IP' : 'IP ' + esc(b.label)}</span>
        <span class="ip-kv">${num(b.value)}</span>
      </div>
    </div>`).join('')}
  </div>`;
}""" + t[_b:]


# ── §53 · vendor logos in COLOUR, from the ObserveOps icon library where it has the vendor ──
# Library (observeops-icons/monitors, published as kisu1311.github.io/ObserveOps_-library): Aruba (aruba-wireless)
# and VMware (vmware-esxi), drawn as-is. The library has no coloured Cisco (its cisco.svg is currentColor) and no
# Dell / HP / Lenovo / Siemens vendor mark (only Dell EMC arrays and HPE — a different company from HP), so those
# are the Simple Icons marks filled with each brand's OFFICIAL colour (from the simple-icons package data).
# Apple (#000000) and Supermicro (#151F6D) are near-black and would vanish on the dark theme, so they keep the
# theme-adaptive mask from §48. A brand colour is absolute, so these are literals — the same exception the
# Agentic AI provider marks take. A colour rule drops the mask and paints the SVG as a background image.
_cc = []
for _k, _svg in _VLALL['color'].items():
    _svg = _svg.replace("'", '"')
    _cc.append('td obs-icon[name="v-%s"]{-webkit-mask:none;mask:none;background:url("data:image/svg+xml,%s") center/contain no-repeat}' % (_k, _up.quote(_svg, safe='')))
_g2 = 'td obs-tag{white-space:nowrap}'
t = t.replace(_g2, _g2 + '\n' + '\n'.join(_cc))

# ── §54 · subnet detail / IP Details KPI cards: the count sits at the BOTTOM, aligned across the row ──
# The cards are equal height; the value takes margin-top:auto so it drops to the floor. The Total IP card has a
# bar under its value, so the other cards hold their value up by the bar's height + gap (8 + 6) — every count then
# shares one baseline.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
.sn-kpis .ip-sev-box { display: flex; }
.sn-kpis .ip-sev-body { flex: 1 1 auto; }
.sn-kpis .ip-kv { margin-top: auto !important; }
.sn-kpis:has(.ip-sdku) .ip-sev-box:not(.ip-sdku) .ip-kv { margin-bottom: 16px; }
/* IP Details tiles have no bar to push the count down, so it gets its own 6px under the title */
.sn-kpis.ip-ipkpis .ip-sev-box .ip-kv { margin-top: 6px !important; }""")


# ── §55 · the KPI cards wear the design system's own IPAM glyphs ──
# get_icons lists IPAM-specific names, all confirmed to render in this vendored bundle: total-ip · lease-ip (an
# address on lease = used) · available-ip · transient-ip · lock-alt (held back = reserved). Both the subnet
# detail cards and the IP Details tiles read DS_SD_KPI_IC, so one map changes both.
_ic = "const DS_SD_KPI_IC = { 'Total IP': 'ip', Used: 'check-circle', Available: 'plus-circle', Transient: 'history', Reserved: 'flag', 'IP utilisation': 'ip' };"
assert t.count(_ic) == 1, 'kpi icon map'
t = t.replace(_ic, "const DS_SD_KPI_IC = { 'Total IP': 'total-ip', Used: 'lease-ip', Available: 'available-ip', Transient: 'transient-ip', Reserved: 'lock-alt', 'IP utilisation': 'total-ip' };")


# ── §56 · the `ip` glyph is the IPAM MODULE icon everywhere (the supplied ipam-hub-hex-pointy.svg) ──
# obs-icon name="ip" is drawn in our markup (subnet header tile, IP panel tile) AND by DS components inside their own
# shadow roots (the IP Details tab, the IPAM nav and Settings entries), which no page rule reaches. So shadow-root
# creation is hooked BEFORE the bundle loads: every obs-icon adopts one sheet that, when its name is "ip", hides
# the stock glyph (visibility, so the box keeps its size) and paints the hub mark as a mask in currentColor.
# The mark lives in _ipam/ipam-module-icon.svg (even-odd, black — a mask reads alpha only).
_svg = open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'ipam-module-icon.svg')).read().strip()
_uri = 'url("data:image/svg+xml,' + _up.quote(_svg.replace("'", '"'), safe='') + '")'
_hook = """<script>/* §56: the IPAM module mark replaces obs-icon "ip" everywhere, inside DS shadow roots too */
(function () {
  var css = ':host([name="ip"]) svg{visibility:hidden}'
    + ':host([name="ip"]){background-color:currentColor;-webkit-mask:%s center/contain no-repeat;mask:%s center/contain no-repeat}';
  var sheet = null;
  try { sheet = new CSSStyleSheet(); sheet.replaceSync(css); } catch (e) {}
  var orig = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    var root = orig.call(this, init);
    if (sheet && this.tagName === 'OBS-ICON') { try { root.adoptedStyleSheets = root.adoptedStyleSheets.concat(sheet); } catch (e) {} }
    return root;
  };
})();
</script>
""" % (_uri, _uri)
assert t.count('<head>\n') >= 1
t = t.replace('<head>\n', '<head>\n' + _hook, 1)


# ── §57 · the module tabs carry no icons; the page title leads with the IPAM module mark ──
_mt = """        {"key":"overview","label":"Overview","icon":"dashboard"},
        {"key":"subnets","label":"Subnet Details","icon":"sitemap"},
        {"key":"ips","label":"IP Details","icon":"ip"},
        {"key":"rogue","label":"Rogue Detection","icon":"shieldCheck"}"""
assert t.count(_mt) == 1, 'module tabs'
t = t.replace(_mt, """        {"key":"overview","label":"Overview"},
        {"key":"subnets","label":"Subnet Details"},
        {"key":"ips","label":"IP Details"},
        {"key":"rogue","label":"Rogue Detection"}""")
# obs-page-header's `before` slot holds the title's mark; `ip` is drawn as the hub mark by §56
_ph = """      <obs-page-header id="pageHeader" heading="IP Address Management"
                       subtitle="">"""
assert t.count(_ph) == 1, 'page header'
t = t.replace(_ph, _ph + """
        <span slot="before" class="ip-ph-mark"><obs-icon name="ip" size="20"></obs-icon></span>""")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + "\n.ip-ph-mark { display: inline-flex; align-items: center; justify-content: center; color: var(--primary-alt); background: none; align-self: center; }")



# ── §61 · KPI card icon: a 45px box with a 24px glyph (subnet detail + IP Details cards — one component) ──
import re as _re3
_n61 = len(_re3.findall(r'(<span class="ip-sdki"[^>]*><obs-icon name="[^"]*") size="20"', t))
assert _n61 >= 3, 'kpi icon spans: %d' % _n61
t = _re3.sub(r'(<span class="ip-sdki"[^>]*><obs-icon name="[^"]*") size="20"', r'\1 size="24"', t)
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + "\n.sn-kpis .ip-sdki { width: 45px; height: 45px; flex: 0 0 45px; }")


# ── §62 · ONE colour per address status, everywhere in IPAM ──
# Three sources disagreed: statusVar (dots, donut) coloured by palette ORDER (Available orange, Transient green); the
# KPI cards swapped Available/Transient to compensate (the source shipped that swap); the grid tags used the DS tag
# variants (Used grey, Transient yellow). STATUS_COLOR is now the single map and its values ARE the DS tag colours,
# so a tag, a card, a dot and a donut slice cannot disagree:
#   Used → --main-tags-text-color (teal, tag `main-tags`) · Available → --secondary-green (tag-green)
#   Transient → --secondary-orange (tag-orange) · Reserved → --severity-unreachable (tag-purple)
_sv = """const STATUS_ORDER = ['Used', 'Available', 'Reserved', 'Transient'];
const statusVar = s => (s === 'Not Scanned' ? 'var(--severity-unknown)'
  : `var(--ds-series-${STATUS_ORDER.indexOf(s) + 1})`);"""
assert t.count(_sv) == 1, 'statusVar'
t = t.replace(_sv, """const STATUS_ORDER = ['Used', 'Available', 'Reserved', 'Transient'];
const STATUS_COLOR = { Used: '--main-tags-text-color', Available: '--secondary-green',
  Transient: '--secondary-orange', Reserved: '--severity-unreachable' };
const statusVar = s => (STATUS_COLOR[s] ? `var(${STATUS_COLOR[s]})` : 'var(--severity-unknown)');""")
_tg = "const DS_STATUS_TAG = { Used: 'tag-primary', Available: 'tag-green', Reserved: 'tag-purple', Transient: 'tag-yellow' };"
assert t.count(_tg) == 1, 'status tags'
t = t.replace(_tg, "const DS_STATUS_TAG = { Used: 'main-tags', Available: 'tag-green', Reserved: 'tag-purple', Transient: 'tag-orange' };")
# the cards asked for each other's colour (the source's swap) — each now asks for its own
for _a, _b in (("dsSdKpi('Available', num(c.available), statusVar('Transient')", "dsSdKpi('Available', num(c.available), statusVar('Available')"),
               ("dsSdKpi('Transient', num(c.transient), statusVar('Available')", "dsSdKpi('Transient', num(c.transient), statusVar('Transient')"),
               ("{ label: 'Transient', value: c.transient, color: statusVar('Available') }", "{ label: 'Transient', value: c.transient, color: statusVar('Transient') }"),
               ("{ label: 'Available', value: c.available, color: statusVar('Transient') }", "{ label: 'Available', value: c.available, color: statusVar('Available') }")):
    assert t.count(_a) == 1, _a
    t = t.replace(_a, _b)
# the donut: a slice named for a status takes that status's colour instead of the palette slot for its position
_cf = "  function colourOf(s, i) {\n    return (s && s.severity) ? sev(s.severity) : hue(i);"
assert t.count(_cf) == 1, 'colourOf'
t = t.replace(_cf, "  function colourOf(s, i) {\n    if (s && s.colorVar) return tok(s.colorVar, hue(i));\n    return (s && s.severity) ? sev(s.severity) : hue(i);")
_ds = "          return { name: s.name, y: s.v, color: colourOf(s, i) };\n        })\n      }];\n      b.chart.events = { render: function () { if (o.legendRight"
assert t.count(_ds) == 1, 'donutSelectable data'
_vz = "  DSCharts.donutSelectable(slices.map(s => ({ name: s.name, v: s.v, severity: sevOfToken(s.color) })),"
assert t.count(_vz) == 1, 'vizStatusDonut'
t = t.replace(_vz, "  DSCharts.donutSelectable(slices.map(s => ({ name: s.name, v: s.v, severity: sevOfToken(s.color), colorVar: (!s.color && STATUS_COLOR[s.name]) || undefined })),")


# ── §63 · subnet detail cards: Transient before Available — the IP Details order (Used · Transient · Available · Reserved) ──
_av = t[t.find("    ${dsSdKpi('Available',"):]
_av = _av[:_av.find("\n") + 1]
_tr = t[t.find("    ${dsSdKpi('Transient',"):]
_tr = _tr[:_tr.find("\n") + 1]
assert _av.startswith("    ${dsSdKpi('Available'") and _tr.startswith("    ${dsSdKpi('Transient'") and t.count(_av + _tr) == 1, 'kpi order'
t = t.replace(_av + _tr, _tr + _av)


# ── §64 · subnet detail's two chart widgets carry no ⋮ (it opened nothing) — ovWidget, as on the Overview ──
for _w in ("${widget('Subnet Usage Trend',", "${widget('Subnet Forecast',"):
    assert t.count(_w) == 1, _w
    t = t.replace(_w, _w.replace('${widget(', '${ovWidget('))


# ── §65 · KPI cards drawn like the product's KPI widget (the "Interface" tile) ──
# Reference markup: padding px-4 pt-4 pb-2 (16/16/8); a SOLID-filled rounded icon tile with the glyph in contrast;
# the title mt-1 under it; the figure at the card's foot in the numeric font at 30px/600, line-height 1, under a
# 13px/500 footer label. Applies to both rows (subnet detail + IP Details — one component). Older rules here carry
# !important and equal weight, so these win on specificity (the `body` prefix), not on source order.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
body .sn-kpis .ip-sev-box .ip-sev-body { padding: 16px 16px 8px; gap: 0; }
body #ipStatusWidget .sn-kpis .ip-sev-body { padding: 16px 16px 8px; gap: 0; }   /* the IP Details row sits under an id-scoped rule */
body .sn-kpis .ip-sdki { background: var(--ip-kc); color: var(--page-background-color); border-radius: 6px; margin-bottom: 0; }
body .sn-kpis .ip-sdkt { margin-top: 4px; font-size: 18px; font-weight: 500; line-height: 1.3; color: var(--primary-alt); }
body .sn-kpis .ip-kv { font-family: var(--numeric-font-family); font-size: 30px; line-height: 1; font-weight: 600;
  color: var(--primary-alt); margin-top: auto !important; padding-top: 16px; }
body .sn-kpis.ip-ipkpis .ip-sev-box .ip-kv { margin-top: auto !important; }
body .sn-kpis .ip-kv small { font-size: .5em; font-weight: 500; }
body .sn-kpis .ip-sdku .ip-sdkf { margin-top: auto; padding-top: 16px; font-size: 13px; font-weight: 500; color: var(--neutral-light); }
body .sn-kpis .ip-sdku .ip-kv { margin-top: 4px !important; padding-top: 0; }
body .sn-kpis .ip-sdkb { margin-top: 10px; }""")


# ── §66 · across the IPAM module: 10px between neighbouring widgets (both axes) and an 8px widget radius ──
# Every gap was --ip-padding-md (16px) and every card --ip-radius (4px). Scoped to the module's content area so the
# side panel and drawers keep their own spacing; .ip-card covers the widgets, .ip-sev-box the KPI cards.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
body .ip-content .ip-grid, body .ip-content .ip-sev-row, body .ip-content .ip-stack { gap: 10px; }
body .ip-content .ip-card, body .ip-content .ip-sev-box { border-radius: 8px; }""")


# ── §67 · Overview cards get inner padding back: 12px round every widget body (request, 2 Oct 2026) ──
# Reverses §33's "no inner padding" for the body only — the toolbar border fix from §33 stays. Every chart is redrawn
# 24px shorter (244 → 220) so it still fits the ~248px body of a 290px card, the treemap insets by the same 12px
# (it is absolutely positioned, so padding alone would not move it), and the Subnet Capacity scroller subtracts the
# padding from the body height it fills (clientHeight includes padding).
# ⚠️ AMENDED THE SAME DAY: Site Count (treemap) and Subnet Capacity (table) run edge to edge again — the request
# was "remove only this 2 widget padding". So no treemap inset, and the scroller is back to `- 6`.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
body .ip-ovgrid > .ip-card > .ip-card-body { padding: 12px; }
body .ip-ovgrid > .ip-card > .ip-card-body:has(> .ip-tm), body .ip-ovgrid > .ip-card > .ip-card-body:has(#tblTopN) { padding: 0; }""")
_o = t.find('function screenOverview() {'); _e = t.find('\nfunction blindReason', _o)
_b = t[_o:_e]
assert _b.count('h: 244') + _b.count("'overview', 244,") >= 6, 'overview 244s'
_b = _b.replace('h: 244', 'h: 220').replace("'overview', 244,", "'overview', 220,")
t = t[:_o] + _b + t[_e:]


# ── §68 · Overview restyled to the ObserveOps DS (request, 2 Oct 2026 — "restyle only", the bundle is NOT upgraded) ──
# Read off the DS's own guidance: the dashboard-view recipe (every widget = obs-widget-card: title + TIME BADGE in the
# grey header) and the data-viz captured Highcharts fixtures (chart-single-donut / -line / -horizontal-bar).
# (1) every Overview card header carries a time badge — an obs-tag with the Overview's range (24h / 7d / 30d). Scoped
#     with ovCard so the subnet detail's ovWidget cards (§64) are unchanged.
# (2) every chart MOUNTED INSIDE .ip-ovgrid gets the fixtures' chrome on top of the bridge's base options: chart font
#     --chart-font-family; legend 11px square swatches (radius 1) in --chart-legend-color at 0.65rem; tooltip on
#     --chart-tooltip-background, radius 10, shadow; axis labels --page-text-color 0.65rem, grid --chart-grid-line-color
#     (solid), axis line --bottom-line-color. Layout keys (legend position, sizes, data) are left alone. The wrapper also
#     becomes the chart's dsMake, so a theme switch rebuilds it with the same chrome.
# (3) the donut centre figure is 28px/600 mono on the Overview — the DS gauge spec (was 26px).
_o = t.find('function screenOverview() {'); _e = t.find('\nfunction blindReason', _o)
_b = t[_o:_e]
assert _b.count('${ovWidget(') == 7, 'overview ovWidget calls: %d' % _b.count('${ovWidget(')
t = t[:_o] + _b.replace('${ovWidget(', '${ovCard(') + t[_e:]
_w = "const ovWidget = (title, bodyHtml, opts = {}) => widget(title, bodyHtml, Object.assign({}, opts, { actions: '' }));"
assert t.count(_w) == 1, 'ovWidget'
t = t.replace(_w, _w + """
/* §68 · an Overview card: the DS widget header's TIME BADGE in the actions slot (the range the Overview is drawn for) */
const ovCard = (title, bodyHtml, opts = {}) => widget(title, bodyHtml, Object.assign({}, opts, {
  actions: `<obs-tag variant="tag-primary" class="ip-ovbadge" aria-label="Time range">${esc(typeof overviewTrendRange === 'string' ? overviewTrendRange : '24h')}</obs-tag>` }));""")
_m = "      var make = pending[i].make, c;"
assert t.count(_m) == 1, 'mount make'
t = t.replace(_m, "      var make = pending[i].make, c;\n      if (el.closest && el.closest('.ip-ovgrid')) make = dsFixture(make);   /* §68 */")
_f = "  /* ------------------------------------------------- queue / mount / life -- */"
assert t.count(_f) == 1, 'queue banner'
t = t.replace(_f, """  /* §68 · the DS captured-fixture chrome (data-viz chart-single-donut / -line / -horizontal-bar), layered over the
     options a builder made. Style only — never position, size or data. Colours are still read from tokens. */
  function dsFixture(make) {
    return function () {
      var o = make(), font = tok('--chart-font-family', "'JetBrains Mono', monospace"), text = tok('--page-text-color', '#cad3e2');
      var grid = tok('--chart-grid-line-color', tok('--border-color', '#1d2a3e')), base = tok('--bottom-line-color', grid);
      o.chart = o.chart || {}; o.chart.style = Object.assign({}, o.chart.style, { fontFamily: font });
      o.legend = o.legend || {};
      o.legend.symbolWidth = 11; o.legend.symbolHeight = 11; o.legend.symbolRadius = 1;
      o.legend.itemStyle = Object.assign({}, o.legend.itemStyle, { color: tok('--chart-legend-color', text), fontWeight: 'normal', fontSize: '0.65rem', fontFamily: font });
      o.legend.itemHoverStyle = Object.assign({}, o.legend.itemHoverStyle, { color: text });
      o.tooltip = Object.assign({}, o.tooltip, { backgroundColor: tok('--chart-tooltip-background', tok('--common-widget-bg', '#172336')),
        borderColor: tok('--border-color', '#1d2a3e'), borderWidth: 1, borderRadius: 10, shadow: true,
        style: Object.assign({}, o.tooltip && o.tooltip.style, { color: text, fontFamily: font }) });
      [].concat(o.xAxis || [], o.yAxis || []).forEach(function (a) {
        a.labels = a.labels || {}; a.labels.style = Object.assign({}, a.labels.style, { color: text, fontSize: '0.65rem', fontFamily: font });
        if (a.gridLineWidth !== 0) { a.gridLineColor = grid; a.gridLineDashStyle = 'Solid'; }
        a.lineColor = base;
      });
      return o;
    };
  }

""" + _f)
_c = ".css({ color: tok('--primary-alt', '#111c2c'), fontSize: '26px', fontWeight: '600', fontFamily: mono })"
assert t.count(_c) == 1, 'centre figure'
t = t.replace(_c, ".css({ color: tok('--primary-alt', '#111c2c'), fontSize: (chart.renderTo && chart.renderTo.closest && chart.renderTo.closest('.ip-ovgrid')) ? '28px' : '26px', fontWeight: '600', fontFamily: mono })")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
.ip-ovgrid .ip-ovbadge { margin-right: 4px; }""")


# ── §69 · list grids to the DS table spec (request, 2 Oct 2026 — Subnet Details · IP Details · Rogue Detection) ──
# The DS obs-table / product list grid (get_component table + the measured live Roles grid): a COMPACT header row
# (~28px — the header reads crisper than the 41px data rows) and ONE LINE PER ROW. IP Details wrapped hostnames,
# sites and "Last seen" onto two lines, so its rows were ~60px and uneven. Cells are nowrap with an ellipsis past
# 240px (150px on IP Details — 12 columns must fit a 1600px window); tags already never wrap. Shared sheet, so the Overview's Subnet Capacity grid follows too.
_g = "td obs-tag{white-space:nowrap}\n"
assert t.count(_g) == 1, 'grid sheet anchor'
t = t.replace(_g, _g + """.grid.hs-default th{padding-top:6px;padding-bottom:6px}
.grid td{white-space:nowrap;max-width:240px;overflow:hidden;text-overflow:ellipsis}
:host(#tblIps) .grid td{max-width:150px}
.grid td:has(.cell-bar){max-width:none;overflow:visible;text-overflow:clip}
:host(#tblIps) .grid th,:host(#tblIps) .grid td{padding-left:12px;padding-right:12px}
""")


# ── §70 · KPI cards aligned to the product's KPI widget, icon tile at 30% (request, 2 Oct 2026) ──
# Measured from the product's own CSS for the supplied card (data-v-68dc2909): .icon-container 45x45, radius .5rem
# (8px), the glyph text-xl + fa-lg (20px x 1.333 = ~26px); the title 20px (request — the product's .text-kpi-header-title is 1rem / 1.25rem in two builds; the larger) mt-1; the figure 30px/600 with its
# unit 16px/500 4px after it. The tile is no longer a SOLID fill with the glyph knocked out — its background is the
# status colour at 30% and the glyph wears the full colour (request: "the icon background colour will be 30% opacity").
# One component, so both rows (IP Details + subnet detail) change together.
# ⚠️ `html body` prefix: every § inserts right AFTER the same anchor, so a NEWER section sits ABOVE the older ones
# and loses ties to them (§65 set these same properties at `body .sn-kpis …`). Win on specificity, not order.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .sn-kpis .ip-sdki { width: 45px; height: 45px; flex: 0 0 45px; border-radius: 8px;
  background: color-mix(in srgb, var(--ip-kc) 30%, transparent); color: var(--ip-kc); }
html body .sn-kpis .ip-sdkt { margin-top: 4px; font-size: 20px; font-weight: 500; line-height: 1.3; }
html body .sn-kpis .ip-kv small { font-size: 16px; font-weight: 500; margin-left: 4px; }""")
_n = t.count('"></obs-icon></span>') and 0
for _a in ("<span class=\"ip-sdki\" style=\"--ip-kc:${color}\"><obs-icon name=\"${DS_SD_KPI_IC[label] || 'ip'}\" size=\"24\">",
           "<span class=\"ip-sdki\" style=\"--ip-kc:${col}\"><obs-icon name=\"${DS_SD_KPI_IC['IP utilisation'] || 'utilization'}\" size=\"24\">",
           "<span class=\"ip-sdki\" style=\"--ip-kc:${b.color}\"><obs-icon name=\"${DS_SD_KPI_IC[b.label === 'Total' ? 'Total IP' : b.label] || 'ip'}\" size=\"24\">"):
    assert t.count(_a) == 1, _a[:60]
    t = t.replace(_a, _a.replace('size="24"', 'size="26"'))


# ── §71 · Overview › Subnet Capacity: Utilization is the Subnet Details utilisation BAR (request, 2 Oct 2026) ──
# The same obs-table `bar` cell the Subnet Details list uses (§39–§55): a track with the % under it, the fill
# repainted per value in the legend's bands by dsBarPaint (Critical ≥90 · High ≥75 · Moderate ≥50 · Healthy).
# It was plain text "74 %" since §33. The cell takes a number, so the value is parsed and rounded.
_c = "{ key: 'ut', title: 'Utilization', width: '24%' },   /* plain value — the band dot was removed on request */"
assert t.count(_c) == 1, 'topN ut column'
t = t.replace(_c, "{ key: 'ut', title: 'Utilization', type: 'bar', width: '34%' },   /* §71: the Subnet Details utilisation bar */")
_c = "{ key: 'sn', title: 'Subnet', type: 'link', width: '30%' },"
assert t.count(_c) == 1, 'topN sn column'
t = t.replace(_c, "{ key: 'sn', title: 'Subnet', type: 'link', width: '28%' },")
_d = "d.ut = r.value;"
assert t.count(_d) == 1, 'topN ut value'
t = t.replace(_d, "d.ut = Math.round(parseFloat(r.value) || 0);")


# ── §72 · Subnet Capacity: the Sparkline column is gone (request, 2 Oct 2026) — Subnet · Utilization only ──
# The utilisation bar (§71) now carries the figure; the 24 h sparkline left with its column. dsUtilSpark and the
# sparkline sheet (§31/§32) are kept and unreferenced, so the column is one line back.
_c = """columns.push({ key: 'sn', title: 'Subnet', type: 'link', width: '28%' },
               { key: 'ut', title: 'Utilization', type: 'bar', width: '34%' },   /* §71: the Subnet Details utilisation bar */
               { key: 'sp', title: 'Sparkline', type: 'sparkline' });"""
assert t.count(_c) == 1, 'topN columns'
t = t.replace(_c, """columns.push({ key: 'sn', title: 'Subnet', type: 'link', width: '45%' },
               { key: 'ut', title: 'Utilization', type: 'bar' });   /* §72: no Sparkline column */""")
_d = "d.sp = dsUtilSpark(r.cidr, parseFloat(r.value) || 0); "
assert t.count(_d) == 1, 'topN sp value'
t = t.replace(_d, "")


# ── §73 · the IP panel header is obs-page-header's DETAIL variant (request, 2 Oct 2026 — "Using the ObserveOps DS") ──
# get_component('page-header'): "Entity / span DETAIL header — title + a status badge + a ' | '-separated metadata
# strip", and "inside a drawer/panel — the drawer supplies its own close; page-header supplies the title + meta".
# So: heading = the IP; `before` slot = the IP glyph tile; `title` slot = the address-status tag; `meta` = host ·
# Vendor · Device type; Monitoring stays a tag BESIDE the status tag (as a 4th meta field it wrapped the strip to
# two lines and left a stray '|' at the end of the first). The hand-built
# "| host | vendor" line and the second tag row are gone. no-divider + --page-header-padding:0, because the panel
# head (.ip-sp-head2) already pads and rules itself; the ✕ / back controls stay the panel's own siblings.
_h = t.find('const dsIpHead = x => {'); _e = t.find('\n};', _h) + 3
assert _h > 0 and t[_h:_e].count('ip-sp-tags') == 1, 'dsIpHead'
t = t[:_h] + r"""const dsIpHead = x => {
  /* §73 · obs-page-header detail header — see ds_pass §73 */
  const meta = [];
  if (x.host) meta.push({ icon: 'server', value: x.host });
  if (x.vendor) meta.push({ label: 'Vendor', value: x.vendor });
  if (x.devType) meta.push({ label: 'Device type', value: x.devType });
  return `<obs-page-header class="ip-sp-ph" heading="${esc(x.ip)}" no-divider meta='${esc(JSON.stringify(meta))}' style="--page-header-padding:0">
      <span slot="before" class="ip-sp-tile"><obs-icon name="ip" size="20"></obs-icon></span>
      <obs-tag slot="title" variant="${DS_STATUS_TAG[x.status] || 'default'}">${esc(x.status)}</obs-tag>
      <span slot="title" class="ip-sp-mon">${dsIpTag(x)}</span>
    </obs-page-header>`;
};""" + t[_e:]
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .ip-sp-head2 > .ip-sp-ph { flex: 1 1 auto; min-width: 0; }
html body .ip-sp-head.ip-sp-head2 { align-items: center; }""")


# ── §74 · IP panel body aligned to the product's monitor panel (request, 2 Oct 2026 — reference: inventory monitor
#    Summary drawer, "Monitor Info / System Info / Tag Info") ──
# Measured off the supplied product screenshot: the section heading 16px/500; each label starts 4px inside the
# heading's left edge (ours was 10px — the plain key-value's own cell padding); values start in ONE column ~280px
# from the label (ours 180); rows on a ~35px pitch (ours ~30). Scoped with :host-context(#ipBody) so the other
# plain key-values in IPAM keep their geometry. NO row hover here (request, 2 Oct 2026) — the rows are read-only facts
# and the product drawer has none; the fill only made one row look selected. The sheet is adopted into obs-key-value's shadow root (dsKvStyle).
_k = ".kv.v-plain tr td:first-child{border-radius:4px 0 0 4px}.kv.v-plain tr td:last-child{border-radius:0 4px 4px 0}`);"
assert t.count(_k) == 1, 'kv sheet'
t = t.replace(_k, _k[:-3] + """
:host-context(#ipBody) .kv.v-plain td{padding:8px 4px;line-height:19px}
:host-context(#ipBody) .kv.v-plain .k{width:280px;padding-right:16px;box-sizing:border-box}
:host-context(#ipBody) .kv.v-plain tr:hover td,:host-context(#ipBody) .kv.v-plain tr:hover td.val{background:transparent}`);""")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body #ipBody .ip-group-h { font-weight: 500; margin-bottom: 4px; }""")


# ── §75 · IP Details KPI cards are the subnet-detail cards' height (request, 2 Oct 2026) ──
# Measured: IP Details 147px, subnet detail 187px (its Total IP card carries the "254 addresses" line + the bar,
# which is what sets that row's height). The IP Details row now takes the same 187px; the figure is already pinned
# to the card's foot (margin-top:auto), so it drops to the bottom exactly as on the subnet detail cards.
# ⚠️ 187 is a MEASUREMENT of the other row — if that row's padding, title or bar changes, re-measure.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .sn-kpis.ip-ipkpis .ip-sev-box { min-height: 187px; box-sizing: border-box; }""")


# ── §76 · IP panel header in the product's own layout (request, 2 Oct 2026 — reference: the inventory monitor drawer
#    header "○ motadatadcdc | 172.16.12.117 | Proxmox VE" over its tag row) ──
# Line 1: a monitoring STATUS RING (obs-severity, up/down) + the IP + "| host | vendor" inline; line 2: the tags
# (address status, device type); the icon tile centred on both lines. REPLACES §73's obs-page-header: that element
# always renders its meta strip BELOW the title and has no slot for a tag row, so it cannot express this layout — and
# the long "host | Vendor: … | Device type: …" strip wrapped to three lines. Built from DS atoms instead.
_h = t.find('const dsIpHead = x => {'); _e = t.find('\n};', _h) + 3
assert _h > 0 and 'ip-sp-ph' in t[_h:_e], 'dsIpHead (§73)'
t = t[:_h] + r"""const dsIpHead = x => {
  /* §76 · the product monitor-drawer header — see ds_pass §76 */
  const meta = [x.host, x.vendor].filter(Boolean).map(v => '| ' + esc(v)).join(' ');
  return `<span class="ip-sp-tile"><obs-icon name="ip" size="20"></obs-icon></span>
    <div class="ip-sp-id">
      <div class="ip-sp-tl"><obs-severity class="ip-sp-dot" severity="${x.monitoring ? 'up' : 'down'}" title="${x.monitoring ? 'Monitored' : 'Not monitored'}"></obs-severity><b>${esc(x.ip)}</b>${meta ? `<span class="ip-sp-meta">${meta}</span>` : ''}</div>
      <div class="ip-sp-tags"><obs-tag variant="${DS_STATUS_TAG[x.status] || 'default'}">${esc(x.status)}</obs-tag>${x.devType ? `<obs-tag variant="default">${esc(x.devType)}</obs-tag>` : ''}</div>
    </div>`;
};""" + t[_e:]
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .ip-sp-head2 .ip-sp-tl { align-items: center; gap: 6px; flex-wrap: nowrap; min-width: 0; }
html body .ip-sp-head2 .ip-sp-tl b { font-size: 1.1rem; font-weight: 600; flex: none; }
html body .ip-sp-head2 .ip-sp-meta { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
html body .ip-sp-head2 .ip-sp-dot { flex: none; display: inline-flex; }
html body .ip-sp-head2 .ip-sp-id { gap: 6px; }
html body .ip-sp-head2 .ip-sp-tile { flex: 0 0 40px; height: 40px; }""")


# ── §77 · IP panel: header → tabs spacing and edges like the product monitor drawer (request, 2 Oct 2026) ──
# Reference: the monitor drawer's tab strip (Summary · Polling Info …) sits right under the header, carries NO icons,
# and the header's rule is INSET to the content edges rather than running the panel's full width. So: the header
# takes the body's 24px side inset (tile, tabs and section headings share one left edge), its rule is drawn inset by
# that same 24px, the body's top padding is 12px (was 24), and the tab items lose their glyphs.
_v = "  const tabs = IP_TABS.map(t => t.key === 'history' ? { ...t, count: evTotal } : t);"
assert t.count(_v) == 1, 'ip tabs'
t = t.replace(_v, "  const tabs = IP_TABS.map(t => { const { icon, ...r } = t; return r.key === 'history' ? { ...r, count: evTotal } : r; });   /* §77: no tab glyphs */")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .ip-stackpanel .ip-sp-head.ip-sp-head2 { padding: 16px 24px; border-bottom: 0;
  background: linear-gradient(var(--border-color), var(--border-color)) no-repeat center bottom / calc(100% - 48px) 1px; }
html body .ip-stackpanel .ip-sp-body { padding-top: 12px; }""")


# ── §78 · IP panel: section rule tight under its rows; Discover device is the default-size primary (2 Oct 2026) ──
# Measured against the product monitor drawer: last row → section rule ~10px (ours 26: the group's 16px top margin on
# top of the key-value's own 10px), rule → heading ~17px (ours 17, kept). And "Discover device" was size="small"
# (24px); the reference ("Create User") is the DS primary at its DEFAULT size (~34px, the @btn-height).
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body #ipBody .ip-group + .ip-group { margin-top: 0; }""")
_b = '<obs-button variant="primary" size="small" id="ipDiscoverDevice"><obs-icon name="network-discovery" size="14">'
assert t.count(_b) == 1, 'discover button'
t = t.replace(_b, '<obs-button variant="primary" id="ipDiscoverDevice"><obs-icon name="network-discovery" size="16">')


# ── §79 · IP panel: Discover device centred BETWEEN the header rule and the tab rule (request, 2 Oct 2026) ──
# The tab row centres the button in ITSELF, but the band the eye reads runs from the header's rule (12px above the
# tab row — the body's top padding, §77) to the tab row's bottom rule. A -12px top margin on a centred flex item
# raises its centre by 6px, i.e. exactly to the middle of that band, without moving the tabs.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .ip-stackpanel .ip-sp-tabrow > #ipDiscoverDevice { margin-top: -12px; }""")


# ── §80 · the Overview cards' time badge is gone (request, 2 Oct 2026 — reverses §68 (1)) ──
# The page header's own "24h · Last 24 Hours" picker already states the range for the whole screen; seven copies
# of it in the card headers said the same thing seven more times. ovCard stays (one place to give these cards
# header actions later); its actions slot is empty again, as ovWidget's always was. .ip-ovbadge is kept unreferenced.
_a = """  actions: `<obs-tag variant="tag-primary" class="ip-ovbadge" aria-label="Time range">${esc(typeof overviewTrendRange === 'string' ? overviewTrendRange : '24h')}</obs-tag>` }));"""
assert t.count(_a) == 1, 'ovCard badge'
t = t.replace(_a, "  actions: '' }));   /* §80: no time badge */")


# ── §81 · the IP panel's key-value rules no longer use :host-context() (2 Oct 2026) ──
# §74's alignment and the no-hover rule were written as `:host-context(#ipBody) …` inside DS_KV_SHEET. Safari and
# Firefox do NOT implement :host-context, so for the user none of it applied: labels stayed 10px in, values 180px,
# and the row hover came back. Headless Chrome supports it, which is why every probe passed. Now the rules are
# `:host(.ip-pkv) …` (supported everywhere) and bindIpBody — run on every panel paint — puts .ip-pkv on the panel's
# key-values. (A second sheet adopted only when k.closest('#ipBody') was tried first: dsKvStyle runs before the panel
# exists, so it never matched.)
_old = """:host-context(#ipBody) .kv.v-plain td{padding:8px 4px;line-height:19px}
:host-context(#ipBody) .kv.v-plain .k{width:280px;padding-right:16px;box-sizing:border-box}
:host-context(#ipBody) .kv.v-plain tr:hover td,:host-context(#ipBody) .kv.v-plain tr:hover td.val{background:transparent}`);"""
assert t.count(_old) == 1, 'host-context rules'
t = t.replace(_old, _old.replace(':host-context(#ipBody)', ':host(.ip-pkv)'))
_b = "function bindIpBody() {\n  const host = ipHost();\n  if (!host) return;\n"
assert t.count(_b) == 1, 'bindIpBody'
t = t.replace(_b, _b + "  host.querySelectorAll('#ipBody obs-key-value').forEach(k => k.classList.add('ip-pkv'));   /* §81: the panel's key-values */\n")


# ── §82 · the IP panel's left inset is 10px (request, 2 Oct 2026 — asked as 8px, then "add 10px margin") ──
# Header (tile), its rule, the tab row and the section headings all start 10px from the panel's left edge (was 24).
# The right inset stays 24px. The header rule is drawn from 8px to 24px-before-the-right-edge.
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body aside.ip-stackpanel .ip-sp-head.ip-sp-head2 { padding-left: 10px;
  background: linear-gradient(var(--border-color), var(--border-color)) no-repeat 10px bottom / calc(100% - 34px) 1px; }
html body aside.ip-stackpanel .ip-sp-body { padding-left: 10px; }""")


# ── §84 · Subnet Details: no Action column (request, 2 Oct 2026) ──
# The row ⋮ (Edit subnet · View details · Poll now) is gone, and with it the "Action" header. View details is still
# the row click. ⚠️ Edit subnet and Poll now have no other door on this list now — the subnet detail page still offers
# Poll. DS_SUBNET_ACTIONS is kept, unreferenced, so the menu is one word back.
_a = "    actions: id === 'tblSubnets' ? DS_SUBNET_ACTIONS : id === 'tblSdIps' ? SD_IPS_ROW_MENU : null };"
assert t.count(_a) == 1, 'grid actions'
t = t.replace(_a, "    actions: id === 'tblSdIps' ? SD_IPS_ROW_MENU : null };   /* §84: no row menu on tblSubnets */")


# ── §85 · subnet detail › IP grid: Source, Connected switch, Connected port start HIDDEN (request, 2 Oct 2026) ──
# The three columns pushed the grid past the page edge, so the whole subnet detail page scrolled sideways (its header
# was cut off on the left). They are hidden through COL_HIDDEN — the eye menu still lists them — not deleted.
_h = "  sdIps: new Set(), sdHist: new Set(), discoveryProfile: new Set(), routers: new Set() };"
assert t.count(_h) == 1, 'COL_HIDDEN sdIps'
t = t.replace(_h, "  sdIps: new Set(['Source', 'Connected switch', 'Connected port']),   /* §85 */\n  sdHist: new Set(), discoveryProfile: new Set(), routers: new Set() };")


# ── §86 · the grid pager sticks only inside a FITTED grid (2 Oct 2026 — rows drew below the pager) ──
# §15 made `.box>.pager` sticky:bottom so a height-fitted grid (DS_FIT) keeps its pager at the screen's foot. On a grid
# that is NOT fitted (the subnet detail's IP grid) .box does not scroll, so sticky resolved against the PAGE scroller:
# the pager pinned to the bottom of the viewport and the remaining rows scrolled on underneath it. dsFitWatch now marks
# fitted hosts `.ds-fit`, and every other grid's pager is static — at the end of its table.
_w = "  if (!DS_FIT.has(el.id) || el.__dsFit) return;\n  el.__dsFit = true;\n"
assert t.count(_w) == 1, 'dsFitWatch'
t = t.replace(_w, _w + "  el.classList.add('ds-fit');   /* §86 */\n")
_g = "td obs-tag{white-space:nowrap}\n"
assert t.count(_g) == 1, 'grid sheet anchor'
t = t.replace(_g, _g + ":host(:not(.ds-fit)) .box>.pager{position:static}\n")


# ── §87 · Top Device Type — four more DS visualizations as OPTIONS beside the original (request, 2 Oct 2026) ──
# "Using the ObserveOps design system … create this widget better visualization and add as option in this screen and
# don't remove this card … create multiple option". The original card is untouched (it is Option 1); four option cards
# sit under it, each a view the DS itself prescribes for a ranking of the leaders:
#   Option 2 · Ranked list   — data-viz `topn` ("a ranked list of the top N items with inline bars"), on obs-table:
#                               rank · device type · devices · share bar (share of ALL classified devices).
#   Option 3 · Packed bubble — the DS `topn-views` fixture's packed-bubble view (highcharts-more, already loaded),
#                               area ∝ count, categorical palette IN ORDER.
#   Option 4 · Gauge grid    — the `topn-views` solid-gauge grid: one ring per type, its share of all classified
#                               devices; DSCharts.gauge gains compact options (labelY / fontSize / noTicks).
#   Option 5 · Tree view     — the `topn-views` tree view (DS `treemap`: part-to-whole, many parts) via vizTreemap.
# Every colour is a token; nothing new is invented outside data-viz's decision flow.
_g = "        labels: { y: 14, distance: 6, style: { color: tok('--neutral-light', '#8a93a5'), fontSize: '10px' } },"
assert t.count(_g) == 1, 'gauge ticks'
t = t.replace(_g, "        labels: o.noTicks ? { enabled: false } : { y: 14, distance: 6, style: { color: tok('--neutral-light', '#8a93a5'), fontSize: '10px' } },")
_g = """            y: -24, borderWidth: 0,
            format: '<div style="text-align:center"><span style="font-size:20px;font-weight:500;color:' +"""
assert t.count(_g) == 1, 'gauge label'
t = t.replace(_g, """            y: o.labelY != null ? o.labelY : -24, borderWidth: 0,
            format: '<div style="text-align:center"><span style="font-size:' + (o.fontSize || 20) + 'px;font-weight:500;font-family:' + tok('--numeric-font-family', 'monospace') + ';color:' +""")
_b = "  /* Timeline epoch for the correlation dataset"
assert t.count(_b) == 1, 'bridge tail'
t = t.replace(_b, """  /* §87 · packed bubble — the DS topn-views fixture's bubble view. rows: [{name, v}]; area ∝ v; palette by order. */
  function bubble(rows, o) {
    o = o || {};
    var h = o.h || 230;
    return queue(function () {
      var b = baseOpts(h);
      delete b.xAxis; delete b.yAxis;
      b.chart.type = 'packedbubble';
      b.chart.spacing = [4, 4, 4, 4];
      /* the names live in a right-hand legend (they overflowed the bubbles); the bubbles carry the counts */
      b.legend = Object.assign(b.legend, { enabled: true, layout: 'vertical', align: 'right', verticalAlign: 'middle', itemMarginBottom: 2 });
      b.tooltip.useHTML = true;
      b.tooltip.pointFormat = '<b>{point.name}</b>: {point.value} devices';
      b.tooltip.headerFormat = '';
      b.plotOptions = { packedbubble: {
        minSize: '46%', maxSize: '62%', zMin: 0,
        layoutAlgorithm: { splitSeries: false, gravitationalConstant: 0.02, enableSimulation: false, bubblePadding: 4 },
        dataLabels: { enabled: true, useHTML: false, format: '{point.value}',
          style: { color: tok('--active-text-color', '#fff'), textOutline: 'none', fontWeight: '600', fontSize: '11px',
                   fontFamily: tok('--chart-font-family', 'monospace') },
          filter: { property: 'value', operator: '>', value: 0 } },
        marker: { fillOpacity: 0.9, lineWidth: 0 } } };
      /* one series per type so the legend lists the names (a single colorByPoint series shows ONE legend item) */
      b.series = rows.map(function (r, i) { return { type: 'packedbubble', name: r.name, color: hue(i),
        data: [{ name: r.name, value: Number(r.v) || 0 }] }; });
      return b;
    });
  }

""" + _b)
_r = "    gauge: gauge,\n"
assert t.count(_r) == 1, 'bridge exports'
t = t.replace(_r, "    gauge: gauge,\n    bubble: bubble,\n")
_v = "  const devTypeRows = Object.entries(devTypeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)\n    .map(([name, n]) => ({ name, pct: n, v: num(n) }));"
assert t.count(_v) == 1, 'devTypeRows'
t = t.replace(_v, _v + """
  /* §87 · the options' share denominator: EVERY classified device in the filter, not just the top 10 */
  const devTypeTotal = Object.values(devTypeCounts).reduce((a, b) => a + b, 0);
  const dtEmpty = `<p class="ip-empty">No address in this filter has a classified device yet</p>`;
  const dtShare = n => devTypeTotal ? Math.round(n / devTypeTotal * 100) : 0;""")
_c = """      ${ovCard('Top Device Type', devTypeRows.length ? vizTopN(devTypeRows, { h: 220, product: true })
        : `<p class="ip-empty">No address in this filter has a classified device yet</p>`)}
    </div>
"""
assert t.count(_c) == 1, 'top device card'
t = t.replace(_c, _c + """
    <!-- §87 · Top Device Type options 2–5 (the card above is Option 1, unchanged) -->
    <div class="ip-grid ip-ovgrid ip-ov2">
      ${ovCard('Top Device Type · Option 2 — Ranked list', devTypeRows.length ? `<obs-table class="ip-dtrank" sticky-header max-height="248px" sortable="false"
          columns='${esc(JSON.stringify([{ key: 'rk', title: '#', width: '44px' }, { key: 'nm', title: 'Device type' },
            { key: 'n', title: 'Devices', align: 'right', width: '96px' }, { key: 'sh', title: 'Share of devices', type: 'bar', width: '42%' }]))}'
          rows='${esc(JSON.stringify(devTypeRows.map((r, i) => ({ id: 'dt' + i, rk: i + 1, nm: r.name, n: r.v, sh: dtShare(r.pct) }))))}'></obs-table>` : dtEmpty)}
      ${ovCard('Top Device Type · Option 3 — Packed bubble', devTypeRows.length ? DSCharts.bubble(devTypeRows.map(r => ({ name: r.name, v: r.pct })), { h: 244 }) : dtEmpty)}
    </div>
    <div class="ip-grid ip-ovgrid ip-ov2">
      ${ovCard('Top Device Type · Option 4 — Gauge grid', devTypeRows.length ? `<div class="ip-dtg">${devTypeRows.map(r =>
          `<div class="ip-dtgc">${DSCharts.gauge(r.pct, { max: devTypeTotal || 1, h: 82, labelY: -14, fontSize: 14, noTicks: true, name: r.name })}<span title="${esc(r.name)}: ${esc(r.v)} of ${esc(num(devTypeTotal))} (${dtShare(r.pct)}%)">${esc(r.name)}</span></div>`).join('')}</div>` : dtEmpty)}
      ${ovCard('Top Device Type · Option 5 — Tree view', devTypeRows.length ? vizTreemap(devTypeRows.map(r => ({ name: r.name, v: r.pct, label: r.v })), { h: 262, aspect: 2.9 }) : dtEmpty)}
    </div>
""")
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + """
html body .ip-ovgrid > .ip-card > .ip-card-body:has(> .ip-dtrank) { padding: 0; }
.ip-dtg { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px 8px; height: 100%; align-content: center; }
.ip-dtgc { display: flex; flex-direction: column; align-items: center; min-width: 0; }
.ip-dtgc > span { font-size: .72rem; color: var(--neutral-light); font-family: var(--chart-font-family);
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: -6px; }
.ip-dtgc .fa-viz { width: 100%; }""")

# ── §88 · Discover device carries no icon (request, 5 Oct 2026: "remove this icon") ──
t = t.replace('''<obs-button variant="primary" id="ipDiscoverDevice"><obs-icon name="network-discovery" size="16"></obs-icon>&nbsp;Discover device</obs-button>''', '''<obs-button variant="primary" id="ipDiscoverDevice">Discover device</obs-button>''')

# ── §89 · IP Per Site (request, 5 Oct 2026) ──
_v = "  const siteRows = s.bySite.slice().sort((a, b) => b.subnets - a.subnets).slice(0, 8).map(x =>\n    ({ name: x.site, pct: x.subnets, v: num(x.subnets) }));"
assert t.count(_v) == 1, 'siteRows'
t = t.replace(_v, _v + """
  /* §89 · Top IP Per Site — the addresses IN USE at each site (counted from the site's own addresses), same
     treemap as Site Count so the two read as a pair: one counts subnets, this one counts IPs */
  const ipSiteRows = s.bySite.map(x => ({ name: x.site, n: x.used || 0 }))
    .filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 8);""")
_c = """    <div class="ip-grid ip-ovgrid ip-ov2">
      ${ovCard('Site Count',"""
assert t.count(_c) == 1, 'row 2'
t = t.replace(_c, """    <div class="ip-grid ip-ovgrid">
      ${ovCard('Site Count',""")
_c = """        : `<p class="ip-empty">No site in this filter</p>`)}

      ${ovCard('Top Device Type',"""
assert t.count(_c) == 1, 'site card tail'
t = t.replace(_c, """        : `<p class="ip-empty">No site in this filter</p>`)}

      ${ovCard('Top IP Per Site', ipSiteRows.length ? vizTreemap(ipSiteRows.map(r => ({ name: r.name, v: r.n, label: num(r.n) })), { h: 262, aspect: 1.8 })
        : `<p class="ip-empty">No address in use in this filter</p>`)}

      ${ovCard('Top Device Type',""")

_a = "vizTreemap(siteRows.map(r => ({ name: r.name, v: r.pct, label: r.v })), { h: 262, aspect: 2.9 })\n        : `<p class=\"ip-empty\">No site in this filter</p>`)}\n\n      ${ovCard('Top IP Per Site'"
assert t.count(_a) == 1, 'site aspect'
t = t.replace(_a, _a.replace('aspect: 2.9', 'aspect: 1.8'))   # Site Count is a third-width card now

_s = '.ip-tmc b { font-size: 13px; font-weight: 600; line-height: 1.25; overflow-wrap: break-word; }'
assert t.count(_s) == 1, 'treemap name css'
t = t.replace(_s, _s + '\n/* §89 · a tile too narrow for its name (Bengaluru DR beside Delhi Branch) used to break the word letter by letter; names\n   now break only at spaces, and a tile under 72px wide shows just its count — the full name is in its tooltip */\n.ip-tmc { container-type: inline-size; }\n.ip-tmc b { overflow-wrap: normal; word-break: keep-all; }\n@container (max-width: 72px) { .ip-tmc b { display: none; } }')
# ── §90 · Site Count removed from the Overview (request, 5 Oct 2026) — Top IP Per Site and Top Device Type share the row ──
_a = t.index("    <div class=\"ip-grid ip-ovgrid\">\n      ${ovCard('Site Count',")
_b = t.index("      ${ovCard('Top IP Per Site'", _a)
t = t[:_a] + "    <div class=\"ip-grid ip-ovgrid ip-ov2\">\n" + t[_b:]
_c = "label: num(r.n) })), { h: 262, aspect: 1.8 })"
assert t.count(_c) == 1, 'ip per site aspect'
t = t.replace(_c, "label: num(r.n) })), { h: 262, aspect: 2.9 })")   # half-width card again
# ── §91 · Option 4 gauge grid drawn like the product's own gauge widget (request, 5 Oct 2026, with the product's
# "ui 1234567" gauge widget as the reference): a THICK three-quarter ring open at the foot (-135°→135°), the value as a
# percentage in the ring's centre, the name under it with a dotted underline (its tooltip names the count). The value is
# each type's SHARE of all classified devices — the honest percentage for this data — so the rings are short arcs.
_g = """        center: ['50%', '80%'], size: '135%', startAngle: -90, endAngle: 90,"""
assert t.count(_g) == 1, 'gauge pane'
t = t.replace(_g, """        center: o.ring ? ['50%', '55%'] : ['50%', '80%'], size: o.ring ? '112%' : '135%',
        startAngle: o.ring ? -135 : -90, endAngle: o.ring ? 135 : 90,""")
_g = """          innerRadius: '68%', outerRadius: '100%', shape: 'arc', borderWidth: 0"""
assert t.count(_g) == 1, 'gauge bg'
t = t.replace(_g, """          innerRadius: o.ring ? '80%' : '68%', outerRadius: '100%', shape: 'arc', borderWidth: 0""")
_g = """        solidgauge: {
          innerRadius: '68%',"""
assert t.count(_g) == 1, 'gauge inner'
t = t.replace(_g, """        solidgauge: {
          innerRadius: o.ring ? '80%' : '68%',""")
_g = """                    tok('--primary-alt', '#111c2c') + '">{y}</span>' +"""
assert t.count(_g) == 1, 'gauge value'
t = t.replace(_g, """                    tok('--primary-alt', '#111c2c') + '">' + (o.ring ? '{y:.2f}%' : '{y}') + '</span>' +""")
_c = """`<div class="ip-dtgc">${DSCharts.gauge(r.pct, { max: devTypeTotal || 1, h: 82, labelY: -14, fontSize: 14, noTicks: true, name: r.name })}<span title="${esc(r.name)}: ${esc(r.v)} of ${esc(num(devTypeTotal))} (${dtShare(r.pct)}%)">${esc(r.name)}</span></div>`"""
assert t.count(_c) == 1, 'gauge grid call'
t = t.replace(_c, """`<div class="ip-dtgc">${DSCharts.gauge(devTypeTotal ? Math.round(r.pct / devTypeTotal * 10000) / 100 : 0, { max: 100, h: 104, ring: true, labelY: -10, fontSize: 13, noTicks: true, name: r.name })}<span title="${esc(r.name)}: ${esc(r.v)} of ${esc(num(devTypeTotal))} devices">${esc(r.name)}</span></div>`""")
_s = """.ip-dtgc > span { font-size: .72rem; color: var(--neutral-light); font-family: var(--chart-font-family);"""
assert t.count(_s) == 1, 'gauge name css'
t = t.replace(_s, """.ip-dtgc > span { font-size: .8rem; color: var(--page-text-color); text-decoration: underline dotted; text-underline-offset: 3px; padding-bottom: 4px; cursor: default; font-family: var(--chart-font-family);""")
t = t.replace(".ip-dtgc > span { font-size: .8rem;", ".ip-dtgc > span { margin-top: -4px !important; font-size: .8rem;", 1)
# ── §92 · KPI cards: Available before Transient again (request, 5 Oct 2026: "swap the card") — Used · Available ·
# Transient · Reserved on BOTH rows (IP Details and the subnet detail), so the two rows keep one order. Reverses §63.
_tr = "    { label: 'Transient', value: c.transient, color: statusVar('Transient') },\n"
_av = "    { label: 'Available', value: c.available, color: statusVar('Available') },\n"
assert t.count(_tr + _av) == 1, 'ip details kpi order'
t = t.replace(_tr + _av, _av + _tr)
_tr = "    ${dsSdKpi('Transient', num(c.transient), statusVar('Transient'), pct(c.transient), 'Transient', true)}\n"
_av = "    ${dsSdKpi('Available', num(c.available), statusVar('Available'), pct(c.available), 'Available', true)}\n"
assert t.count(_tr + _av) == 1, 'subnet detail kpi order'
t = t.replace(_tr + _av, _av + _tr)
O='/Users/kishanpatel/ObseverOps/observeops-icons/common/'
import re
ip=re.search(r' d="([^"]+)"',open(O+'network-connectivity/ip.svg').read()).group(1)
lk=re.search(r' d="([^"]+)"',open(O+'security-access/locks.svg').read()).group(1)
# ── §93 · IP Reserved gets an IP-family glyph (request, 5 Oct 2026: "improve this icon") ──
# The other four cards wear the product's IP pins (total-ip / lease-ip / available-ip / transient-ip — a pin with its
# status mark at the lower right); Reserved wore a bare lock-alt and read as a different family. The product ships no
# reserved-ip, so it is COMPOSED from two product glyphs, both verbatim: common/network-connectivity/ip.svg with a
# circle knocked out of its lower right (a mask, so the badge sits clear of the pin), and security-access/locks.svg
# scaled into that corner — the same pin-plus-corner-mark shape the four siblings have. Nothing is drawn by hand.
svg = ('<svg class="ip-resic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true"><defs><mask id="ipResMask">'
       '<rect width="48" height="48" fill="#fff"/><circle cx="36.5" cy="36.5" r="13" fill="#000"/></mask></defs>'
       '<path fill="currentColor" mask="url(#ipResMask)" d="' + ip + '"/>'
       '<g transform="translate(26 25) scale(.44)"><path fill="currentColor" d="' + lk + '"/></g></svg>')
_k = "const DS_SD_KPI_IC = {"
assert t.count(_k) == 1, 'kpi ic'
t = t.replace(_k, "const DS_RES_IC = '" + svg + "';\nconst dsKpiIc = n => n === 'Reserved' ? DS_RES_IC : `<obs-icon name=\"${DS_SD_KPI_IC[n] || 'ip'}\" size=\"26\"></obs-icon>`;\n" + _k)
for a,b in [('<obs-icon name="${DS_SD_KPI_IC[label] || \'ip\'}" size="26"></obs-icon>', '${dsKpiIc(label)}'),
            ('<obs-icon name="${DS_SD_KPI_IC[b.label === \'Total\' ? \'Total IP\' : b.label] || \'ip\'}" size="26"></obs-icon>', "${dsKpiIc(b.label === 'Total' ? 'Total IP' : b.label)}")]:
    assert t.count(a) == 1, a; t = t.replace(a, b)
_s = ".ip-grid.ip-ovgrid.ip-ov2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }"
t = t.replace(_s, _s + "\n.ip-sdki .ip-resic { display: block; width: 26px; height: 26px; }", 1)
# ── §94 · Top Device Type: only the packed bubble survives (request, 6 Oct 2026: remove the bar card and Options 2, 4, 5) ──
# The bubble takes the old bar card's slot beside Top IP Per Site and drops its "Option 3" label — with no other options
# left, the label named a comparison that no longer exists. Options 2/4/5's CSS and the gauge `ring` mode stay, unreferenced.
_a = t.index("      ${ovCard('Top Device Type', devTypeRows.length ? vizTopN(")
_b = t.index("    <div class=\"ip-grid ip-ovgrid ip-ov2\">\n      ${ovCard('Rogue Detection Trend'", _a)
t = t[:_a] + "      ${ovCard('Top Device Type', devTypeRows.length ? DSCharts.bubble(devTypeRows.map(r => ({ name: r.name, v: r.pct })), { h: 244 }) : dtEmpty)}\n    </div>\n\n" + t[_b:]
# ── §95 · ONE Total IP card (request, 6 Oct 2026: "the name and colour is same" between the subnet detail and IP Details).
# IP Details drew its own Total tile — a grey (--primary-alt) icon over the raw address count — while the subnet detail
# draws dsSdKpiUtil: the icon in the utilisation-band colour, "N addresses", the % and a bar. IP Details now calls the
# same function, so the two cards cannot drift. `click` is false there: that page's tiles are not filters.
_a = """function dsSdKpiUtil(c, blind) {"""
assert t.count(_a) == 1, 'util fn'
t = t.replace(_a, """function dsSdKpiUtil(c, blind, click = true) {""")
_a = """  return `<div class="ip-sev-box ip-stat-click ip-sdku" data-stat-status="" role="button" tabindex="0">"""
assert t.count(_a) == 1, 'util box'
t = t.replace(_a, """  return `<div class="ip-sev-box${click ? ' ip-stat-click' : ''} ip-sdku"${click ? ' data-stat-status="" role="button" tabindex="0"' : ''}>""")
_a = """    { label: 'Total', value: c.total, color: 'var(--primary-alt)' },
"""
assert t.count(_a) == 1, 'ip total box'
t = t.replace(_a, "")
_a = """  return `<div class="ip-sev-row sn-kpis ip-ipkpis">
    ${boxes.map("""
assert t.count(_a) == 1, 'ip kpi row'
t = t.replace(_a, """  return `<div class="ip-sev-row sn-kpis ip-ipkpis">
    ${dsSdKpiUtil(c, c.pct == null, false)}
    ${boxes.map(""")
# ── §96 · the subnet header's tag row is the site only (request, 6 Oct 2026: remove the origin and address-count tags) ──
_a = """          <obs-tag variant="tag-primary">${esc(s.origin)}</obs-tag>
          <obs-tag>${esc(num(s.counts.total))} addresses</obs-tag>
"""
assert t.count(_a) == 1, 'sd tags'
t = t.replace(_a, "")
open(path, 'w', encoding='utf-8').write(t)
print('ds pass ok', path)
