"""DS pass over the vendored Firewall Analyzer (13 Oct 2026).

  python3 _firewall/ds_pass.py [_firewall/firewall.html]

Request: "go to 'Firewall Analyzer' module and all components will be replaced using the ObserveOps
design system". The module was already built from obs-* controls; what was still hand-built is the set
`gaps.json` declares. Every one of those that HAS an element in the DS bundle this page ships is
swapped for it here:

  widget()          .fa-card + obs-toolbar(widget)      -> obs-widget-card static
  metricTile()      .fa-mt (device Overview tiles)      -> obs-widget-card + obs-metric-list / obs-gauge
  deviceTile()      .fa-tile (estate card view)         -> obs-widget-card + obs-metric-list
  stat()            .fa-stat (KPI stat tiles)           -> obs-widget-card + obs-metric-list
  kv()              <dl class="fa-kv">                  -> obs-key-value (when every value is text)
  gridPager()       hand-drawn pager under a grid       -> obs-pagination
  Devices grid      hand-drawn pager                    -> obs-pagination

NOT swapped, because the bundle has no element for them (still declared in gaps.json): the
Highcharts widgets (the DS's own answer is Highcharts), the light-DOM grids whose cells hold markup
obs-table cannot render, the facet panels, the template accordion, the command list, the coverage
signal cell, the data-collection rows, the licence / inventory cards and the stacked detail panel.

Idempotent: a page already carrying the marker is left alone. build_firewall.py runs this last.
"""
import re, sys

P = sys.argv[1] if len(sys.argv) > 1 else '_firewall/firewall.html'
t = open(P, encoding='utf-8').read()
MARK = '/* FA-DS-PASS */'
MARK2 = '/* FA-DS-PASS-2 */'


def pass2(t):
    """Stage 2 (15 Oct 2026, "use the design system components"): the gaps the 13 Oct pass had to leave because
    the old bundle shipped no meter. The bundle swap at the end of stage 1 brought obs-progress (product
    ant-progress: percent | segments, size small 6 / default 8 / large 12, severity | color, tooltips), so every
    hand-drawn bar goes to it, and the Distribution-of-Values popover's plain-text table goes to obs-table.
    Idempotent on its own marker, so it also runs on a page stage 1 already wrote."""
    if MARK2 in t:
        return t

    def rep(old, new, label, n=1):
        nonlocal t
        assert t.count(old) == n, (label, t.count(old))
        t = t.replace(old, new)

    # licence unit: the quota bar, in the unit's own hue
    rep('<div class="fa-lic-bar" role="img" aria-label="${nf(u.current)} of ${nf(u.cap)} ${esc(u.unit)} in use"><span style="width:${Math.min(100, u.pct * 100)}%"></span></div>',
        '<obs-progress class="fa-lic-bar" size="large" color="var(--lic-hue)" percent="${Math.min(100, u.pct * 100)}" label="${nf(u.current)} of ${nf(u.cap)} ${esc(u.unit)} in use"></obs-progress>',
        'lic bar')
    # Monitored Devices: the by-type stack is obs-progress's stacked mode, each segment with its own tooltip
    rep("""<div class="fa-lic-stack" role="img" aria-label="${esc(types.map(([l, v]) => l + ' ' + v).join(', '))}">${types.map(([l, v], k) =>
        `<span style="width:${total ? (v / total) * 100 : 0}%; background: var(${licHue(k)})" title="${esc(l)} ${v}"></span>`).join('')}</div>""",
        """<obs-progress class="fa-lic-stack" size="large" tooltips label="${esc(types.map(([l, v]) => l + ' ' + v).join(', '))}"
        segments='${j(types.map(([l, v], k) => ({ value: total ? (v / total) * 100 : 0, color: 'var(' + licHue(k) + ')', label: l })))}'></obs-progress>""",
        'lic stack')
    # licence term elapsed (the bar between the issue and expiry dates)
    rep('<span class="fa-lic-track"><span class="fa-lic-fill" style="width:${elapsed}%"></span></span>',
        '<obs-progress class="fa-lic-track" size="small" color="var(--fa-series-1)" percent="${elapsed}"></obs-progress>',
        'lic term')
    # inventory cards (used of cap)
    rep('<span class="fa-inv-bar"><span style="width:${Math.max(pct, used ? 1 : 0)}%"></span></span>',
        '<obs-progress class="fa-inv-bar" size="small" color="var(--fa-series-1)" percent="${Math.max(pct, used ? 1 : 0)}" label="${used.toLocaleString(\'en-US\')} of ${cap.toLocaleString(\'en-US\')} in use"></obs-progress>',
        'inv bar')
    # utilisation cells (the light-DOM grids' bar and the Interface tab's % of link) — the severity is the DS's own
    rep("""<span class="bar-track"><span class="bar-fill" style="width:${pct}%${sev ? `;background:var(--severity-${sev})` : ''}"></span></span>""",
        """<obs-progress class="bar-track" size="small" percent="${pct}"${sev ? ` severity="${sev}"` : ''} label="${pct}%"></obs-progress>""",
        'util bars', 2)
    # Distribution of Values popover: plain text in every cell, so it is an obs-table (no pager: page-size 0)
    rep("""    <table class="fa-tbl"><thead><tr>
      <th><span class="th-in">VALUE</span></th>
      <th class="al-right"><span class="th-in">COUNT</span></th>
      <th class="al-right"><span class="th-in">SHARE %</span></th>
    </tr></thead><tbody>${vals.slice(0, 12).map(v => `<tr>
      <td class="fa-mono">${esc(v.value)}</td>
      <td class="al-right">${v.n}</td>
      <td class="al-right">${v.share}%</td>
    </tr>`).join('')}</tbody></table>`;""",
        """    <obs-table class="fa-pt-dist" page-size="0" sortable="false" columns='${j([
      { key: 'value', title: 'Value' }, { key: 'n', title: 'Count', align: 'right' }, { key: 'share', title: 'Share %', align: 'right' }])}'
      rows='${j(vals.slice(0, 12).map((v, k) => ({ id: 'd' + k, value: String(v.value), n: v.n, share: v.share + '%' })))}'></obs-table>`;""",
        'dist table')

    # ── the device tabs' grids on obs-table (15 Oct 2026, "use ObserveOps design system components" on Policies
    # Analytics, then "verify the grid view … and improve User, Configuration, Active Alerts, Configured Alert Policy").
    # ONE helper, dsGrid(), puts each of these five grids on the DS's obs-table: the severity dot is its `severity`
    # cell, coloured chips its `tags` cell, the config-conflict link its `link` cell. Two things the light grid did
    # that obs-table cannot, kept by the page:
    #  · SORT BY VALUE. obs-table sorts a cell's STRING (numeric collation), which orders "454.14 GB" after "52.24 TB",
    #    "3,19,10,35,910" before "4,06,35,943" and "2 days" before "45 minutes". The page sorts (from the toolbar's
    #    gridState, each column's own sortVal, as before) and gives the table its rows in order with no `sort` of its
    #    own; a header click comes back as the `sort` event, and the sorted column is marked the DS way (--primary text +
    #    its longArrowUp/Down obs-icon).
    #  · NO INNER SCROLL BOX. The light grids capped themselves at calc(100vh - 330px) with a sticky header; in a short
    #    frame (Option 1's embed) that box came out shorter than three rows, so it scrolled and the header sat over the
    #    first row (owner's screenshot, 15 Oct). The table is its content's height now and the page scrolls.
    rep("""      ${faGrid('tblRules', gridCols('polGrid', cols), rows,
        { empty: 'No policy on this firewall matches the filters', maxHeight: 'calc(100vh - 400px)', static: true, gridId: 'polGrid', pager: false })}""",
        """      ${dsGrid('tblRules', 'polGrid', cols, rows, { empty: 'No policy on this firewall matches the filters' })}""", 'pol grid')
    # Policies Analytics: the name is the DS severity cell (dot + name), the figures are their formatted strings
    rep("""      render: r => `<span class="cell-sev"><obs-severity severity="${esc(r.sev)}" shape="dot"></obs-severity>${esc(r.name)}</span>` },
    { key: 'hits', title: 'Last Hit Count', align: 'right', width: 180, sortVal: r => r.hits, render: r => r.hits.toLocaleString() },
    { key: 'hitsTotal', title: 'Total Hit Counts', align: 'right', width: 180, sortVal: r => r.hitsTotal, render: r => r.hitsTotal.toLocaleString() },
    { key: 'bytesTotal', title: 'Total Bytes', align: 'right', width: 160, sortVal: r => r.bytesTotal, render: r => esc(fmtBytes(r.bytesTotal)) }""",
        """      ds: { type: 'severity', primary: true },
      render: r => `<span class="cell-sev"><obs-severity severity="${esc(r.sev)}" shape="dot"></obs-severity>${esc(r.name)}</span>` },
    { key: 'hits', title: 'Last Hit Count', align: 'right', width: 180, sortVal: r => r.hits, cell: r => r.hits.toLocaleString(), render: r => r.hits.toLocaleString() },
    { key: 'hitsTotal', title: 'Total Hit Counts', align: 'right', width: 180, sortVal: r => r.hitsTotal, cell: r => r.hitsTotal.toLocaleString(), render: r => r.hitsTotal.toLocaleString() },
    { key: 'bytesTotal', title: 'Total Bytes', align: 'right', width: 160, sortVal: r => r.bytesTotal, cell: r => fmtBytes(r.bytesTotal), render: r => esc(fmtBytes(r.bytesTotal)) }""", 'pol cols')
    rep("""    { key: 'seq', title: 'Policy ID', align: 'right', width: 110, fixed: true, sortVal: r => r.seq, render: r => esc(r.seq) },""",
        """    { key: 'seq', title: 'Policy ID', align: 'right', width: 110, fixed: true, sortVal: r => r.seq, cell: r => String(r.seq), render: r => esc(r.seq) },""", 'pol seq')

    # Configuration: the config name leads (the DS primary cell), status is a tags chip, the conflict a link cell
    rep("""    { key: 'kind', title: 'Config', width: 160, fixed: true, sortVal: r => r.kind, render: r => `<b>${esc(r.kind)}</b>` },""",
        """    { key: 'kind', title: 'Config', width: 160, fixed: true, ds: { primary: true }, sortVal: r => r.kind, render: r => `<b>${esc(r.kind)}</b>` },""", 'cfg kind')
    rep("""    { key: 'backup', title: 'Last backup status', sortVal: r => r.ok,""",
        """    { key: 'backup', title: 'Last backup status', sortVal: r => r.ok, ds: { type: 'tags' }, cell: r => chip(r.ok ? 'Success' : 'Failed', r.ok ? 'tag-green' : 'tag-red'),""", 'cfg backup')
    rep("""    { key: 'conflict', title: 'Config conflict status', sortVal: r => r.conflict,""",
        """    { key: 'conflict', title: 'Config conflict status', sortVal: r => r.conflict, ds: { type: 'link' },
      cell: r => r.conflict ? { text: 'Conflict detected' } : 'Not applicable',""", 'cfg conflict')
    rep("""      ${faGrid('tblConfigs', gridCols('cfgGrid', CFG_COLS), rows,
        { empty: 'No configuration captured for this firewall', maxHeight: '260px', static: true, gridId: 'cfgGrid', pager: false })}""",
        """      ${dsGrid('tblConfigs', 'cfgGrid', CFG_COLS, rows, { empty: 'No configuration captured for this firewall',
        onCell: (d, r) => { if (d.key === 'conflict' && r.conflict) openConfigDiff(r.dev); } })}""", 'cfg grid')

    # Active Alerts: policy = the DS severity cell, the value = a tags chip in its severity's colour
    rep("""    { key: 'policy', title: 'Alert Policy name', width: 230, fixed: true, sortVal: r => r.policy,""",
        """    { key: 'policy', title: 'Alert Policy name', width: 230, fixed: true, sortVal: r => r.policy, ds: { type: 'severity', primary: true },""", 'al policy')
    rep("""    { key: 'value', title: 'Value', width: 120, sortVal: r => parseFloat(r.value) || r.value,""",
        """    { key: 'value', title: 'Value', width: 120, sortVal: r => parseFloat(r.value) || r.value, ds: { type: 'tags' },
      cell: r => chip(r.value, r.sev === 'critical' ? 'tag-red' : r.sev === 'major' ? 'tag-orange' : r.sev === 'warning' ? 'tag-yellow' : 'tag-green'),""", 'al value')
    rep("""      ${faGrid('tblAlerts', gridCols('alGrid', AL_COLS), rows,
        { empty: 'No policy is alerting on this firewall', maxHeight: 'calc(100vh - 330px)', static: true, gridId: 'alGrid' })}""",
        """      ${dsGrid('tblAlerts', 'alGrid', AL_COLS, rows, { empty: 'No policy is alerting on this firewall' })}""", 'al grid')

    # Configured Alert Policy: the name leads, the tag is a tags chip
    rep("""    { key: 'name', title: 'Alert Policy name', width: 320, fixed: true, sortVal: r => r.name, render: r => esc(r.name) },""",
        """    { key: 'name', title: 'Alert Policy name', width: 320, fixed: true, ds: { primary: true }, sortVal: r => r.name, render: r => esc(r.name) },""", 'pc name')
    rep("""    { key: 'tag', title: 'Tag', sortVal: r => r.tag,""",
        """    { key: 'tag', title: 'Tag', sortVal: r => r.tag, ds: { type: 'tags' }, cell: r => (r.tag ? chip(r.tag, 'tag-green') : []),""", 'pc tag')
    rep("""      ${faGrid('tblPolicies', gridCols('pcGrid', PC_COLS), rows,
        { empty: 'No policy is configured for this firewall', maxHeight: 'calc(100vh - 330px)', static: true, gridId: 'pcGrid' })}""",
        """      ${dsGrid('tblPolicies', 'pcGrid', PC_COLS, rows, { empty: 'No policy is configured for this firewall' })}""", 'pc grid')

    # Users: already obs-table, but string-sorted ("2 days" before "45 minutes") and in a capped sticky box — same helper
    rep("""    { key: 'user', title: 'User Name', width: 220, fixed: true },
    { key: 'userTag', title: '', type: 'tags', width: 120 },""",
        """    { key: 'user', title: 'User Name', width: 220, fixed: true, ds: { primary: true }, sortVal: r => r.user },
    { key: 'userTag', title: '', width: 120, ds: { type: 'tags' }, cell: r => (r.unknown ? chip('unidentified', 'tag-yellow') : []) },""", 'usr cols1')
    rep("""    ...(scoped ? [] : [{ key: 'dev', title: 'Device Name', width: 170 }]),
    { key: 'hits', title: 'Hits', width: 120 },
    { key: 'duration', title: 'Duration', width: 190 },
    { key: 'traffic', title: 'Total Traffic', width: 140 }""",
        """    ...(scoped ? [] : [{ key: 'dev', title: 'Device Name', width: 170, sortVal: r => r.dev, cell: devCell }]),
    { key: 'hits', title: 'Hits', width: 120, sortVal: r => r.hits, cell: r => r.hits.toLocaleString() },
    { key: 'duration', title: 'Duration', width: 190, sortVal: r => r.secs, cell: r => fmtDuration(r.secs) },
    { key: 'traffic', title: 'Total Traffic', width: 140, sortVal: r => r.bytes, cell: r => fmtBytes(r.bytes) }""", 'usr cols2')
    rep("""      <obs-table id="tblFwUsers" class="fa-tblrule" header-style="default" sticky-header sort="traffic:desc"
        max-height="calc(100vh - 330px)" empty-text="This firewall reports no users"
        columns='${j(gridCols('usrGrid', USR_COLS))}'
        rows='${j(tblRows)}'></obs-table>""",
        """      ${dsGrid('tblFwUsers', 'usrGrid', USR_COLS, rows, { empty: 'This firewall reports no users',
        defaultSort: { key: 'traffic', dir: 'desc' } })}""", 'usr grid')

    rep("""let PL_COLS = [], POL_FIELDS = [];""", r"""let PL_COLS = [], POL_FIELDS = [];

/* dsGrid — a device-tab grid on obs-table (see ds_pass.py stage 2). A column may carry
     cell: r => value   what the obs-table cell holds (else the row field of its key)
     ds:   { type, primary }   the obs-table column type (severity · tags · link …) and its lead column
   Rows are sorted HERE, by each column's sortVal, from the toolbar's gridState — obs-table only shows them. */
const DSG = {};
function dsGrid(id, gridId, cols, rows, opts = {}) {
  const srt = (gridState[gridId] || {}).sort || opts.defaultSort;
  const sc = srt && cols.find(x => x.key === srt.key);
  if (sc) {
    const dir = srt.dir === 'desc' ? -1 : 1;
    rows = rows.slice().sort((a, b) => {
      const x = sortValOf(sc, a), y = sortValOf(sc, b);
      if (x == null && y == null) return 0;
      if (x == null) return 1;
      if (y == null) return -1;
      return (typeof x === 'number' && typeof y === 'number' ? x - y
        : String(x).localeCompare(String(y), undefined, { numeric: true })) * dir;
    });
  }
  const vis = gridCols(gridId, cols);
  const dsCols = vis.map(c => ({ key: c.key, title: c.title || '',
    ...(c.width ? { width: typeof c.width === 'number' ? c.width + 'px' : c.width } : {}),
    sortable: !!c.title, ...(c.ds || {}) }));
  const dsRows = rows.map(r => {
    const o = { id: r.id };
    if (r.sev) o.sev = r.sev;
    vis.forEach(c => { const v = c.cell ? c.cell(r) : r[c.key]; o[c.key] = v == null || v === '' ? (c.ds && c.ds.type === 'tags' ? [] : '—') : v; });
    return o;
  });
  DSG[id] = { gridId, cols, rows, srt: sc ? srt : null, onCell: opts.onCell };
  setTimeout(() => dsGridMark(id, 0), 0);
  /* .fa-dsg is sized to the rest of the screen (dsGridFit) — the DS's bounded-height layout: rows scroll inside the
     table under its sticky header and its own pager stays pinned at the foot; a one-page table's pager (the G47 shim's
     obs-pagination, placed right after the table) is pushed to the same foot. */
  return `<div class="fa-dsg" data-dsg="${id}"><obs-table id="${id}" class="fa-tblrule" header-style="default" sticky-header
    page-size="${opts.pageSize ?? 50}" empty-text="${esc(opts.empty || 'No records found')}"
    columns='${j(dsCols)}' rows='${j(dsRows)}'></obs-table></div>`;
}

/* the pager at the foot of the screen: each .fa-dsg box runs from where it starts to the bottom of the content
   area, less the content area's own bottom padding. Measured, never a constant — the old calc(100vh - 330px) is
   what squeezed the grid in Option 1's shorter frame. Re-fit on resize. */
function dsGridFit() {
  const view = $('#view');
  if (!view) return;
  const vb = view.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(view).paddingBottom) || 0);
  view.querySelectorAll('.fa-dsg').forEach(el => {
    el.style.height = Math.max(240, Math.floor(vb - el.getBoundingClientRect().top)) + 'px';
  });
}
window.addEventListener('resize', () => dsGridFit());

/* once the element has drawn its shadow root: bind the header sort + cell actions, mark the sorted column */
function dsGridMark(id, n) {
  const t = $('#' + id), g = DSG[id];
  if (!t || t.tagName !== 'OBS-TABLE' || !g) return;
  dsGridFit();
  const ths = t.shadowRoot ? t.shadowRoot.querySelectorAll('thead th') : [];
  if (!ths.length) { if (n < 40) setTimeout(() => dsGridMark(id, n + 1), 25); return; }
  if (!t.__dsg) {
    t.__dsg = true;
    t.addEventListener('sort', e => {
      const key = (detailOf(e) || {}).key;
      if (!key) return;
      const cur = (gridState[g.gridId] || {}).sort || g.srt;
      gridState[g.gridId] = Object.assign({}, gridState[g.gridId], {
        sort: { key, dir: cur && cur.key === key && cur.dir === 'asc' ? 'desc' : 'asc' } });
      renderContent();
    });
    if (g.onCell) t.addEventListener('cellaction', e => {
      const d = detailOf(e) || {};
      const r = g.rows.find(x => String(x.id) === String(d.id));
      if (r) g.onCell(d, r);
    });
  }
  if (!g.srt) return;
  const i = gridCols(g.gridId, g.cols).findIndex(c => c.key === g.srt.key);
  const th = ths[i];
  if (!th) return;
  th.style.color = 'var(--primary)';
  const lbl = th.querySelector('.th-in');
  if (lbl && !lbl.querySelector('.fa-sarr')) lbl.insertAdjacentHTML('beforeend',
    `<obs-icon class="sarr fa-sarr" name="${g.srt.dir === 'desc' ? 'longArrowDown' : 'longArrowUp'}" size="11"></obs-icon>`);
}""", 'dsgrid fns')
    # the header row's rules (15 Oct 2026, "the table title row bottom border is not visible"): obs-table's
    # header-style="default" draws NO line under the header, and the module's top rule used --border-color, #1d2a3e on a
    # #07101f page (~1.1:1). Both rules now use --field-border-color (#2b394f dark), the DS field-edge token the IPAM
    # grids settled on for the same reason. One rule in the shared obs-table hook, so every .fa-tblrule grid gets it.
    rep(":host(.fa-tblrule) thead th{box-shadow:inset 0 1px 0 var(--border-color)}",
        ":host(.fa-tblrule) thead th{box-shadow:inset 0 1px 0 var(--field-border-color),inset 0 -1px 0 var(--field-border-color)}",
        'th rules')
    # Flow tab (15 Oct 2026, "is every component here obs?"): it is — obs-widget-card, obs-input, obs-table and the DS's
    # Highcharts pies. Its six summary grids only lacked the module's table class, so their header rules were still the
    # faint --border-color pair; .fa-tblrule gives them the --field-border-color rules every other grid now has.
    rep('<obs-table id="tblFlow-${key}" header-style="default"', '<obs-table id="tblFlow-${key}" class="fa-tblrule" header-style="default"', 'flow pair tbl')
    rep('<obs-table id="tblFlowConv" header-style="default"', '<obs-table id="tblFlowConv" class="fa-tblrule" header-style="default"', 'flow conv tbl')
    rep('<obs-table id="tblFlowIface" header-style="default"', '<obs-table id="tblFlowIface" class="fa-tblrule" header-style="default"', 'flow if tbl')
    # Logs (15 Oct 2026, "is every component here obs?"): the source-tree toggle was the tab's one raw <button> (a 25px
    # outlined circle). It is an obs-button now — the same squared neutral-lighter icon button as Full screen on the
    # same row, `primary` while the tree is open (the DS's active-toggle look, as the grid toolbars' filter button).
    # obs-button fires an inline onclick TWICE (its inner button's composed click + its own re-emit), which would undo
    # a toggle — hence the 80ms guard. The facet panel stays composed (obs-button headers + obs-checkbox rows): the DS
    # registry's vertical-filter archetype is a visual reference only, not a functional element.
    rep('<obs-tooltip placement="right"><button slot="trigger" type="button" class="fa-logs-treebtn${window.__faLogTree ? \' on\' : \'\'}" aria-label="Log sources"\n      aria-expanded="${!!window.__faLogTree}"\n      onclick="window.__faLogTree=!window.__faLogTree;document.querySelector(\'.fa-logs\').classList.toggle(\'tree-on\',window.__faLogTree);this.setAttribute(\'aria-expanded\',window.__faLogTree);this.classList.toggle(\'on\',window.__faLogTree)"\n      ><obs-icon name="chevron-right" size="14"></obs-icon></button>Log sources</obs-tooltip>', '<obs-tooltip placement="right"><obs-button slot="trigger" squared variant="${window.__faLogTree ? \'primary\' : \'neutral-lighter\'}"\n      class="fa-logs-treetog${window.__faLogTree ? \' on\' : \'\'}" aria-label="Log sources" aria-expanded="${!!window.__faLogTree}"\n      ><obs-icon name="chevron-right" size="14"></obs-icon></obs-button>Log sources</obs-tooltip>', 'log tree toggle')
    # bound here rather than inline: a real click on the obs-button ran only half an inline handler (verified)
    rep("""    const full = view.querySelector('#logFull');""", """    const treeTog = view.querySelector('.fa-logs-treetog');
    if (treeTog) treeTog.addEventListener('click', () => {
      if (Date.now() - (treeTog.__t || 0) < 80) return;   /* obs-button's double click */
      treeTog.__t = Date.now();
      window.__faLogTree = !window.__faLogTree;
      const el = view.querySelector('.fa-logs');
      if (el) el.classList.toggle('tree-on', window.__faLogTree);
      treeTog.classList.toggle('on', window.__faLogTree);
      treeTog.setAttribute('aria-expanded', String(window.__faLogTree));
      treeTog.setAttribute('variant', window.__faLogTree ? 'primary' : 'neutral-lighter');
    });
    /* the Logs area runs to the foot of the content area, so the tree divider does too */
    const logFit = () => {
      const el = view.querySelector('.fa-logs');
      if (!el) return;
      const vb = view.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(view).paddingBottom) || 0);
      el.style.minHeight = Math.max(0, Math.floor(vb - el.getBoundingClientRect().top + view.scrollTop)) + 'px';
    };
    logFit();
    if (!window.__faLogFit) { window.__faLogFit = true; window.addEventListener('resize', () => { const f = window.__faLogFitFn; if (f) f(); }); }
    window.__faLogFitFn = logFit;
    const full = view.querySelector('#logFull');""", 'log tree bind')
    # the tree's divider (15 Oct 2026, "fix the line, it is connected top"): obs-side-menu draws its own full-height right
    # border, which started level with the source toggle's bottom corner, 16px to its right, so the line read as hanging off
    # the button. The menu's own border is turned off (shadow-sheet hook) and the column draws the divider instead, starting
    # BELOW the query-bar row (35px button + the bar's --fa-padding-sm) so it runs beside the chart and results only.
    rep("if(this.tagName==='OBS-SIDE-MENU'){try{var sm=new CSSStyleSheet();sm.replaceSync(':host(.fa-logtree) .lbl{flex:0 1 auto}",
        "if(this.tagName==='OBS-SIDE-MENU'){try{var sm=new CSSStyleSheet();sm.replaceSync(':host(.fa-logtree) .sm{border-right:0}:host(.fa-logtree) .lbl{flex:0 1 auto}",
        'side-menu border off')
    # Compliance (15 Oct 2026, "is every component here obs?"): it is — the shared DS.FilterRail (obs-button groups +
    # obs-checkbox rows), obs-stat-card, obs-banner, obs-toolbar/obs-select, obs-table and a Highcharts bar. The one
    # hand-drawn piece was the standard's coloured legend chip, a CSS ::before on the rail label. The DS ships that mark:
    # obs-severity shape="swatch" (its legend dot). The rail emits it for any row with a severity `tone`, and the
    # pseudo-element rules go.
    rep("""          <span class="ds-fr-lbl" title="${esc(it.label)}">${esc(it.label)}</span>""",
        """          <span class="ds-fr-lbl" title="${esc(it.label)}">${it.tone ? `<obs-severity shape="swatch" severity="${esc(it.tone)}"></obs-severity>` : ''}${esc(it.label)}</span>""",
        'rail swatch')
    for sel in ['.fa-dev-rail .ds-fr-item:has(.ds-fr-n[class*="is-"]) .ds-fr-lbl::before { content: ""; flex: 0 0 16px; height: 10px; border-radius: 2px; }\n',
                '.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-clear) .ds-fr-lbl::before { background: var(--severity-clear); }\n',
                '.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-warning) .ds-fr-lbl::before { background: var(--severity-warning); }\n',
                '.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-critical) .ds-fr-lbl::before { background: var(--severity-critical); }\n']:
        rep(sel, '', 'rail pseudo')
    # Interfaces (15 Oct 2026, "is every component here obs?"): the two grids were the light-DOM <table>. They go to
    # obs-table through dsGrid (value sort, the shared header rules) with the DS's own cells: Status a `tags` chip, the
    # three link percentages its `bar` cell. Port Type and the Errors / Discarded counts lose their leading icon — obs-table
    # has no icon+text cell. Two grids share the page, so each keeps a bounded 420px body with a sticky header instead
    # of the screen-foot pager (opts.maxHeight).
    rep("""      ${faGrid('tblInterfaces', gridCols('ifoGrid', oCols), rows, { empty: 'This firewall reports no interfaces', maxHeight: '420px', static: true, gridId: 'ifoGrid', pager: false })}""",
        """      ${dsGrid('tblInterfaces', 'ifoGrid', ifDsCols(oCols), rows, { empty: 'This firewall reports no interfaces', maxHeight: '420px' })}""", 'if grid 1')
    rep("""      ${faGrid('tblIfPerf', gridCols('ifpGrid', pCols), rows, { empty: 'This firewall reports no interfaces', maxHeight: '420px', static: true, gridId: 'ifpGrid', pager: false })}""",
        """      ${dsGrid('tblIfPerf', 'ifpGrid', ifDsCols(pCols), rows, { empty: 'This firewall reports no interfaces', maxHeight: '420px' })}""", 'if grid 2')
    rep("""  return `<div class="fa-dsg" data-dsg="${id}"><obs-table id="${id}" class="fa-tblrule" header-style="default" sticky-header""",
        """  if (opts.maxHeight) return `<obs-table id="${id}" class="fa-tblrule" header-style="default" sticky-header max-height="${opts.maxHeight}"
    page-size="0" empty-text="${esc(opts.empty || 'No records found')}" columns='${j(dsCols)}' rows='${j(dsRows)}'></obs-table>`;
  return `<div class="fa-dsg" data-dsg="${id}"><obs-table id="${id}" class="fa-tblrule" header-style="default" sticky-header""", 'dsgrid maxh')
    rep("""function dsGridMark(id, n) {""", r"""/* the Interfaces columns on obs-table cells — the light-DOM markup each column renders becomes a DS cell value */
function ifDsCols(cols) {
  const pct = (bps, r) => (r.oper === 'up' && r.speed ? Math.min(100, Math.round(bps / r.speed * 10000) / 100) : 0);
  const dash = v => (v == null || v === '' ? '—' : String(v));
  const map = {
    key:    { ds: { primary: true }, cell: r => ifKey(r) },
    name:   { cell: r => r.raw },
    alias:  { cell: r => dash(r.alias) },
    status: { ds: { type: 'tags' }, cell: r => chip(r.oper === 'up' ? 'Up' : 'Down', r.oper === 'up' ? 'tag-green' : 'tag-red') },
    type:   { cell: r => r.ifType },
    speed:  { cell: r => (r.speed ? fmtRate(r.speed) : '0 bps') },
    descr:  { cell: r => dash(r.descr) },
    ip:     { cell: r => dash(r.ip) },
    ifIndex:{ cell: r => String(r.ifIndex) },
    vlan:   { cell: r => dash(r.vlan) },
    util:   { ds: { type: 'bar' }, cell: r => pct(r.inBps + r.outBps, r) },
    in:     { ds: { type: 'bar' }, cell: r => pct(r.inBps, r) },
    out:    { ds: { type: 'bar' }, cell: r => pct(r.outBps, r) },
    err:    { cell: r => (r.errIn + r.errOut).toLocaleString('en-US') },
    disc:   { cell: r => (r.discIn + r.discOut).toLocaleString('en-US') },
    cint:   { cell: r => dash(r.peer && r.peer.intf) },
    cip:    { cell: r => dash(r.peer && r.peer.ip) },
    cmac:   { cell: r => dash(r.peer && r.peer.mac) }
  };
  return cols.map(c => Object.assign({}, c, map[c.key] || {}));
}

function dsGridMark(id, n) {""", 'ifDsCols')
    k2 = t.index('</style>')
    t = t[:k2] + '''
.fa-logs-treetog obs-icon { display: inline-flex; transition: transform .15s; }
.fa-logs-treetog.on obs-icon { transform: rotate(180deg); }
/* the tree divider, like the product's Log Search: ONE line from the top of the Logs area to the foot of the screen, on
   the tree column's edge (the same clamp() the grid's first column uses, so it cannot drift from it). The area is
   stretched to the screen's foot by logFit(). */
.fa-logs.tree-on { position: relative; }
.fa-logs.tree-on::before { content: ''; position: absolute; top: 0; bottom: 0; left: calc(clamp(300px, 26%, 480px) - 1px);
  border-right: 1px solid var(--field-border-color); pointer-events: none; }
.fa-logs.tree-on:fullscreen::before { top: var(--fa-padding-md); bottom: var(--fa-padding-md);
  left: calc(var(--fa-padding-md) + clamp(300px, calc((100% - 2 * var(--fa-padding-md)) * .26), 480px) - 1px); }
''' + t[k2:]
    # the two stylesheet notes that still said the DS has no meter
    rep("meter / progress element (docs/DS-GAPS.md G39).", "meter / progress element (docs/DS-GAPS.md G39) — superseded 15 Oct 2026: the bars are obs-progress now (ds_pass stage 2).", 'note G39')
    rep("the DS ships no progress / meter element.", "the DS shipped no progress / meter element — the bars are obs-progress since 15 Oct 2026 (ds_pass stage 2); the legend swatches stay a gap.", 'note lic')
    # Overview: the six tiles are the DS KPI card (owner, 15 Oct 2026: "use KPI card in observeops design system").
    # obs-kpi-card is the product's KPI widget — icon chip in the severity colour, title, up to two header
    # counters, a large mono value + unit, and (for a %) its own obs-progress bar. One card per reading, so
    # Disk · CPU · Memory are three cards now, not one card split by hairlines.
    i0 = t.index("        return [\n          tile([{ label: 'Interface'")
    i1 = t.index("].join('');", i0) + len("].join('');")
    t = t[:i0] + """        /* DS KPI card (15 Oct 2026) — obs-kpi-card, the product's KPI widget: one card per reading. A missing
           reading passes value null, which the card prints as "-"; the bar and the chip colour follow the band. */
        const kpi = o => `<obs-kpi-card class="fa-ov-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : ''}${
          o.stats ? ` stats='${j(o.stats)}'` : ''}${o.value == null ? '' : ` value="${esc(o.value)}"`}${o.unit ? ` unit="${esc(o.unit)}"` : ''}${o.bar ? ' bar' : ''}></obs-kpi-card>`;
        const pctKpi = (title, icon, v) => v == null
          ? kpi({ title, icon, stats: [{ label: 'Status', value: 'No reading' }] })
          : kpi({ title, icon, sev: sevOf(v), value: v, unit: '%', bar: true, stats: [{ label: 'Status', value: BAND[sevOf(v)][0] }] });
        const sk = on && m.sessions != null && m.sessions >= 1000;
        return [
          kpi({ title: 'Interface', icon: 'interface', sev: down ? 'critical' : 'clear', value: `${up} / ${total}`,
                stats: [{ label: 'Status', value: down ? `${down} down` : 'All up' }] }),
          kpi({ title: 'Active Sessions', icon: 'sessions', value: on && m.sessions != null ? (sk ? (Math.round(m.sessions / 100) / 10).toFixed(1) : m.sessions) : null,
                unit: sk ? 'K' : '', stats: [{ label: 'Window', value: 'Last 24 hours' }] }),
          kpi({ title: 'Response Time', icon: 'response-time', value: on && m.resp != null ? m.resp : null, unit: 'ms',
                stats: [{ label: 'Lost packets', value: m.lost == null ? '—' : String(m.lost) }] }),
          pctKpi('Disk', 'disk', disk), pctKpi('CPU', 'cpu', on ? m.cpu : null), pctKpi('Memory', 'memory', on ? m.mem : null)
        ].join('');""" + t[i1:]
    # KPI chips: one neutral chip on every card (owner, 15 Oct 2026, pointing at Response Time's) — the band stays on
    # the bar. .kpi[class] (0,2,0) under :host() outranks the card's own .sev-* / .kpi:not(.sev-neutral) chip tokens.
    rep("if(this.tagName==='OBS-INPUT'){",
        "if(this.tagName==='OBS-KPI-CARD'){try{var kc=new CSSStyleSheet();kc.replaceSync(':host(.fa-ov-kpi) .kpi[class]{--chip-bg:var(--primary-alt,#1d2a3e);--chip-fg:var(--page-background-color,#fff)}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[kc]);}catch(e){}}if(this.tagName==='OBS-INPUT'){",
        'kpi chip hook')
    # Time range: only where a reading over a period is the content (owner, 15 Oct 2026) — the firewall list (main
    # screen) and the Flow, Logs and Policies Analytics tabs. Every other screen drops the picker.
    rep("""          t === 'policy' || t === 'config' ? '' : '<obs-date-time-picker kind="range-presets" bordered></obs-date-time-picker>'}""",
        """          ['analytics', 'flow', 'logs'].includes(t) ? '<obs-date-time-picker kind="range-presets" bordered></obs-date-time-picker>' : ''}""",
        'device range')
    rep("""  pageHeader.setAttribute('heading', chrome.heading);\n""",
        """  pageHeader.setAttribute('heading', chrome.heading);
  /* the module strip's time range belongs to the firewall list alone (owner, 15 Oct 2026) */
  { const rp = pageHeader.querySelector('obs-date-time-picker'); if (rp) rp.style.display = tab === 'devices' ? '' : 'none'; }
""", 'strip range')
    # The time-range control is the DS's hero TimeRangePicker (owner, 15 Oct 2026): kind="range" — relative presets
    # AND a Custom absolute range, the date-time-pickers decisionFlow's answer for a chart/log window — at size="lg"
    # (35px) so it lines up with the 35px toolbar/action buttons. It was the presets-only kind at 28px.
    rep('<obs-date-time-picker kind="range-presets" bordered></obs-date-time-picker>',
        '<obs-date-time-picker kind="range" size="lg" bordered></obs-date-time-picker>', 'range picker', n=2)
    # Policies Management moved to Settings › Firewall Analyzer (owner, 15 Oct 2026). The module's tab row drops it;
    # the screen itself is unchanged and still lives on the #device/<id>/policy route, so every handler that keys off
    # dev1.tab === 'policy' keeps working. Under ?embed=settings (setting.html frames that route) the firewall header and
    # tab row give way to a FIREWALL picker — Settings has no "which firewall?" of its own.
    rep("""  { key: 'policy',     label: 'Policies Management', icon: 'policy-settings' },   /* "Policies and Object Management" until 2026-09-18 */\n""",
        """  /* Policies Management left this row for Settings › Firewall Analyzer on 2026-10-15 (owner); #device/<id>/policy still renders it */\n""",
        'drop policy tab')
    rep("  const known = DEVICE_TABS.some(x => x.key === routeTab);",
        "  const known = routeTab === 'policy' || DEVICE_TABS.some(x => x.key === routeTab);   /* policy: off the row, still a route (Settings frames it) */",
        'policy route known')
    rep("""  const track = FS.OS_TRACKS[d.vendorKey] || {};\n  return `<div class="fa-stack">\n    <section class="fa-card fa-dev-head">""",
        """  const track = FS.OS_TRACKS[d.vendorKey] || {};
  if (t === 'policy' && document.documentElement.classList.contains('fasettings'))
    return `<div class="fa-stack">
    <div class="fa-pmset">${field('Firewall', `<obs-select id="pmFwPick" searchable options='${j(D.devices.map(x => ({ label: x.name, value: x.id })))}' value="${esc(d.id)}"></obs-select>`)}</div>
    ${body}
  </div>`;
  return `<div class="fa-stack">
    <section class="fa-card fa-dev-head">""", 'settings policy frame')
    rep("""function bindDeviceScreen() {\n""",
        """function bindDeviceScreen() {
  const pk = view.querySelector('#pmFwPick');
  if (pk) pk.addEventListener('change', e => { const id = keyOf(detailOf(e)); if (id && id !== dev1.id) go('device', id + '/policy'); });
""", 'bind picker')
    # Policies Management's four views are obs-tabs (owner, 15 Oct 2026: "show as tab … use tabs components"), not the
    # obs-radio as-button segment inside each grid's toolbar. One tab row heads the screen, and the screen's action
    # (Add Policy / Add Object / Push) sits at its right end — so the action no longer takes a row of its own.
    # Policies Analytics keeps its two-way segment (its own polSwitch call, tab='analytics').
    rep("""const polSwitch = (value, tab = 'analytics') =>\n""",
        """/* Objects leads, then Policies (owner, 16 Oct 2026: "swap the policies & object") — Policies Management's tab
   row only; Policies Analytics' own two-way switch keeps POL_SWITCH's order */
const PM_TABS = () => [POL_SWITCH_MGMT[1], POL_SWITCH_MGMT[0]].concat(POL_SWITCH_MGMT.slice(2)).map(o => ({ key: o.value, label: o.text }));
const pmTabOf = section => (isObjectsSec(section) ? OBJECTS_SEC : [NAT_SEC, STATUS_SEC].includes(section) ? section : 'policies');
const polSwitch = (value, tab = 'analytics') => tab === 'policy' ? '' :
""", 'polSwitch policy tabs')
    rep("""  return `<div class="fa-stack">\n    ${pmBar(section, dev)}\n""",
        """  return `<div class="fa-stack">
    <obs-tabs class="fa-pm-tabs" value="${esc(pmTabOf(section))}" tabs='${j(PM_TABS())}'></obs-tabs>
""", 'pm head')
    rep("""  const el = view.querySelector('.fa-pol-switch');\n  if (!el || !dev1 || dev1.tab !== 'policy') return;""",
        """  const el = view.querySelector('.fa-pm-tabs');\n  if (!el || !dev1 || dev1.tab !== 'policy') return;""", 'pm tabs bind')
    rep("""  if (window.DS && DS.keyboardRadio) DS.keyboardRadio(view, '.fa-pol-switch', values, current, choose);\n}""",
        """  void values;   /* obs-tabs carries its own keyboard — the segment's keyboardRadio is not needed */\n}""", 'pm tabs kbd')
    # …then arranged like the product's list screens (owner, 15 Oct 2026, the scheduler list as the reference): the tabs
    # run the full width, and the screen's action (Add Policy / Add Object / Push) is the LAST item of the grid
    # toolbar, after the icon buttons, as a primary — the toolbar gained an `after` slot for it.
    rep("""          ${api.chooser === false ? '' : `<obs-select class="ds-dg-cols" trigger="icon" trigger-icon="eye" search""",
        """          ${api.chooser === false ? '' : `<obs-select class="ds-dg-cols" trigger="icon" trigger-icon="eye" search""", 'dg anchor')
    i = t.index('heading="COLUMNS" reset-label="Reset column preference"')
    k = t.index("</obs-select>`}", i) + len("</obs-select>`}")
    t = t[:k] + "\n          ${api.after ? `<span class=\"ds-dg-after\">${api.after}</span>` : ''}" + t[k:]
    rep("""    before: opts.before,\n    table: () => $('#' + opts.table),""",
        """    before: opts.before,\n    after: opts.after,\n    table: () => $('#' + opts.table),""", 'mount after')
    rep("""function mountStdGrids() {\n""",
        """function mountStdGrids() {
  /* Policies Management's action, at the end of its grid's toolbar */
  const pmAfter = sec => (dev1 && dev1.tab === 'policy' ? pmBar(sec, (D.devices.find(x => x.id === dev1.id) || {}).name) : '');
""", 'pmAfter')
    rep("""before: polSwitch('policies', 'policy'),\n""", """before: polSwitch('policies', 'policy'), after: pmAfter(null),\n""", 'after rules')
    rep("""before: polSwitch(OBJECTS_SEC, 'policy'),\n""", """before: polSwitch(OBJECTS_SEC, 'policy'), after: pmAfter(OBJECTS_SEC),\n""", 'after obj')
    rep("""before: polSwitch(STATUS_SEC, 'policy'),\n""", """before: polSwitch(STATUS_SEC, 'policy'), after: pmAfter(STATUS_SEC),\n""", 'after status')
    rep("""    <obs-button variant="default" id="pmAdd" data-add="${what}">""", """    <obs-button variant="primary" id="pmAdd" data-add="${what}">""", 'add primary')
    # Add Policy / Add Object drawer on the DS (owner, 15 Oct 2026): the read-only facts at the top (Device Name · Mode)
    # are obs-key-value — label→value facts about ONE record, the key-value decisionFlow — not two hand-made spans in
    # form-field shells; and each titled section (Source · Destination · Services · NAT · Log traffic) is preceded by an
    # obs-divider — the DS horizontal rule between stacked form sections. The headings stay PLAIN headings (the DS
    # norm; the labelled divider is opt-in only).
    rep("""      ${field('Device Name', pmRo(f.dev))}
      ${field('Mode', mode ? pmRo(mode) : pmRo('Not collected', true))}
      ${f.edit ?""",
        """      ${field('Device Name', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}
      ${field('Mode', `<obs-input type="text" block disabled value="${esc(mode || 'Not collected')}"></obs-input>`)}
      ${f.edit ?""", 'pmf ro inputs')
    # NAT and Log traffic are FIELDS (label above the switch / checkbox), as the product form's Auto Close Ticket is —
    # not headings carrying a control. The Translated Address row still follows when NAT is on.
    rep("""    ${pmHeading('NAT', `<obs-switch data-${ns}="nat" size="small"${f.nat ? ' checked' : ''} aria-label="NAT"></obs-switch>`)}
    ${nat}
    ${pmHeading('Log traffic')}
    <obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>""",
        """    <div class="fa-grid cols-2">
      ${field('NAT', `<obs-switch data-${ns}="nat" size="small"${f.nat ? ' checked' : ''} aria-label="NAT"></obs-switch>`)}
      ${field('Log traffic', `<obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>`)}
    </div>
    ${nat}""", 'pmf nat log fields')
    # the mandatory note's asterisk is the required-mark red, as in the product footer
    rep('<span class="fa-mandatory">* fields are mandatory</span>', '<span class="fa-mandatory"><i class="fa-req">*</i> fields are mandatory</span>', 'mandatory red', n=6)
    # The Add Policy / Add Object footer, like the product form's (owner, 15 Oct 2026, Create Integration Profile as the
    # reference): no rule above it, "* fields are mandatory" in body text with the red required mark, Reset + the primary
    # at the right — and no inline warning. Why Add is disabled moves into a tooltip ON the disabled button, so the
    # footer reads clean and the reason is still one hover away.
    rep("""      ${reason ? `<span class="fa-dp-why"><obs-icon name="exclamation-circle" size="13"></obs-icon>&nbsp;${esc(reason)}</span>` : ''}
      <span class="fa-spacer"></span>
      <obs-button variant="default" id="${ns}Reset">Reset</obs-button>
      <obs-button variant="primary" id="${ns}Add"${reason ? ' disabled' : ''}>${f.edit ? 'Save changes' : 'Add'}</obs-button>`;""",
        """      <span class="fa-spacer"></span>
      <obs-button variant="default" id="${ns}Reset">Reset</obs-button>
      ${reason ? `<obs-tooltip placement="top"><obs-button slot="trigger" variant="primary" id="${ns}Add" disabled>${f.edit ? 'Save changes' : 'Add'}</obs-button>${esc(reason)}</obs-tooltip>`
        : `<obs-button variant="primary" id="${ns}Add">${f.edit ? 'Save changes' : 'Add'}</obs-button>`}`;""", 'pm foot')
    # The firewall cards take the DS overview card's APM visualisation (owner, 16 Oct 2026, localhost:3000/overview-card
    # as the reference): an AREA sparkline under each of the two readings and a COLUMN sparkline beside the bottom count.
    # obs-overview-card variant="apm" itself is not used — its three labels are fixed in the component ("Response Time",
    # "Throughput", "Error Count") and would mislabel a firewall — so the card is composed from that variant's own parts
    # (obs-icon · obs-severity · obs-sparkline). A reading with no value draws no chart, as the reference's half/empty
    # states do. The series are deterministic per firewall and END on the card's own reading.
    rep("""function deviceTile(d) {\n""",
        """/* a firewall's 24-point trend for one reading: a seeded walk that ends exactly on the value the card prints */
function ovcSeries(id, key, end, n = 24) {
  let h = 2166136261; for (const ch of id + '|' + key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296);
  const out = [end]; let v = end;
  for (let i = 1; i < n; i++) { v = Math.max(end * 0.35, v * (1 + (rnd() - 0.55) * 0.18)); out.unshift(Math.round(v * 100) / 100); }
  return out;
}
/* the denied count as ten columns that add up to it */
function ovcCols(id, total, n = 10) {
  let h = 5381; for (const ch of id) h = (Math.imul(h, 33) + ch.charCodeAt(0)) >>> 0;
  const w = Array.from({ length: n }, () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return 0.6 + (h % 1000) / 1250; });
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map(x => Math.round(total * x / sum));
}
function deviceTile(d) {
""", 'ovc series')
    rep("""      <div class="fa-ovc-c"><span class="fa-ovc-l">Throughput</span><span class="fa-ovc-v"><b>${tp ? tp.toFixed(2) : '—'}</b><i>Gbps</i></span></div>
      <div class="fa-ovc-c"><span class="fa-ovc-l">Sessions</span><span class="fa-ovc-v"><b>${sess.toLocaleString('en-US')}</b><i>24h</i></span></div>""",
        """      <div class="fa-ovc-c"><span class="fa-ovc-l">Throughput</span><span class="fa-ovc-v"><b>${tp ? tp.toFixed(2) : '—'}</b><i>Gbps</i></span>
        ${tp ? `<obs-sparkline class="fa-ovc-sp" type="area" smooth height="30" color="var(--chart-vivid-teal)" name="Throughput" unit=" Gbps" data='${j(ovcSeries(d.id, 'tp', tp))}'></obs-sparkline>` : ''}</div>
      <div class="fa-ovc-c"><span class="fa-ovc-l">Sessions</span><span class="fa-ovc-v"><b>${sess.toLocaleString('en-US')}</b><i>24h</i></span>
        ${sess ? `<obs-sparkline class="fa-ovc-sp" type="area" smooth height="30" color="var(--chart-tangerine)" name="Sessions" data='${j(ovcSeries(d.id, 'sess', sess).map(Math.round))}'></obs-sparkline>` : ''}</div>""", 'ovc sparks')
    rep("""      <span class="fa-ovc-ev${den ? ' bad' : ''}"><b>${den.toLocaleString('en-US')}</b><i>${den ? denPct + '% of sessions' : 'none denied'}</i></span>
    </div>""",
        """<span class="fa-ovc-ev${den ? ' bad' : ''}"><b>${den.toLocaleString('en-US')}</b></span>
      ${den ? `<obs-sparkline class="fa-ovc-cols" type="column" height="40" bar-width="10" color="var(--severity-critical)" name="Denied sessions" data='${j(ovcCols(d.id, den))}'></obs-sparkline>` : ''}
    </div>""", 'ovc cols')
    # the card's "Open firewall" chevron is gone (owner, 16 Oct 2026) — the whole card opens the firewall (.fa-tile
    # data-dev), so the button said what the card already does. The card itself takes the keyboard path: focusable,
    # role="link", Enter/Space open it (bound below in the click delegate's keydown twin).
    rep("""      <span class="fa-spacer"></span>
      <obs-tooltip placement="left"><obs-button slot="trigger" variant="transparent" squared data-dev1="${esc(d.id)}"
        aria-label="Open ${esc(d.name)}"><obs-icon name="chevron-right" size="14"></obs-icon></obs-button>Open firewall</obs-tooltip>
""", "", 'drop open chevron')
    rep("""  return `<article class="fa-ovc fa-tile" data-dev="${esc(d.id)}" aria-label="${esc(d.name)}">""",
        """  return `<article class="fa-ovc fa-tile" data-dev="${esc(d.id)}" aria-label="Open ${esc(d.name)}" role="link" tabindex="0">""", 'card focusable')
    rep("""  if (e.key === 'Escape') { closeDrawer(); closeLogDrawer(); closeCredDrawer(); closeFwTemplate(); closeRole(); return; }""",
        """  if (e.key === 'Escape') { closeDrawer(); closeLogDrawer(); closeCredDrawer(); closeFwTemplate(); closeRole(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('.fa-ovc.fa-tile[data-dev]')) { e.preventDefault(); e.target.click(); }""", 'card keyboard')
    # Compliance tab: its two top widgets on DS components (owner, 16 Oct 2026 — the "KPI card + table" choice), laid out
    # like the Flow tab's widget row: the standard's score is an obs-kpi-card (the Overview's KPI card, neutral chip —
    # the band colours its bar), and "This firewall across all standards" is an obs-table — Standard · Compliance ·
    # Passed · Failed · Status (a band tag) — in place of the hand-coloured bar chart. The note under the score went:
    # the banner directly below says which control fails and what clearing it does.
    i0 = t.index("""    <div class="fa-grid cols-3">\n      ${(() => {\n        const band = ev.score >= 90""")
    i1 = t.index("""    ${worst ? `<obs-banner variant="warning" title="Clearing""", i0)
    t = t[:i0] + """    <div class="fa-grid cols-3 fa-cmp-top">
      ${(() => {
        const band = ev.score >= 90 ? 'clear' : ev.score >= 75 ? 'warning' : 'critical';
        /* owner, 16 Oct 2026 ("make it new better ui"): a framed widget like the table beside it, not a KPI card
           stretched to the row — status tag + one line, then the score as an obs-gauge beside an obs-metric-list */
        const tg = ev.score >= 90 ? ['Compliant', 'tag-green'] : ev.score >= 75 ? ['At risk', 'tag-yellow'] : ['Non-compliant', 'tag-red'];
        return widget(std.label, `<div class="fa-cmp-sc">
          <div class="fa-cmp-sch"><obs-tag variant="${tg[1]}">${tg[0]}</obs-tag>
            <span>${ev.failed.length} of ${total} controls failing</span></div>
          <div class="fa-cmp-scb">
            <obs-gauge class="fa-cmp-g" value="${ev.score}" total="100" severity="${band}" label="% compliant"></obs-gauge>
            <obs-metric-list class="fa-cmp-ml" items='${j([[String(ev.passed), '', 'Passed', '--severity-clear'], [String(ev.failed.length), '', 'Failed', '--severity-critical'], [String(total), '', 'Evaluated']])}'></obs-metric-list>
          </div>
        </div>`, { actions: '', cls: 'fa-cmp-scw' });
      })()}
      <div class="span-2 fa-cmp-stdw">
        ${widget('This firewall across all standards', `<obs-table id="tblStds" class="fa-tblrule fa-tbldense" header-style="default" sortable="false" page-size="0"
          columns='${j([
            { key: 'std', title: 'Standard', primary: true },
            { key: 'pct', title: 'Compliance', width: '140px' },
            { key: 'passed', title: 'Passed', width: '110px' },
            { key: 'failed', title: 'Failed', width: '110px' },
            { key: 'status', title: 'Status', type: 'tags', width: '150px' }])}'
          rows='${j(D.standards.map(x => {
            const e = evalCompliance(dev, x.label);
            const b = e.score >= 90 ? ['Compliant', 'tag-green'] : e.score >= 75 ? ['At risk', 'tag-yellow'] : ['Non-compliant', 'tag-red'];
            return { id: 'std-' + x.label, std: x.label, pct: e.score + ' %', passed: String(e.passed), failed: String(e.failed.length), status: chip(b[0], b[1]) };
          }))}'></obs-table>`, {
          actions: `<obs-button variant="default"><obs-icon name="export-pdf" size="14"></obs-icon>&nbsp;Export evidence pack</obs-button>` })}
      </div>
    </div>

""" + t[i1:]
    # …and FRAMED, as Flow's widgets are: the screen's .fa-flat stack stripped every widget card's frame and title strip
    rep('  return `<div class="fa-stack fa-flat">\n    <div class="fa-grid cols-3 fa-cmp-top">',
        '  return `<div class="fa-stack">\n    <div class="fa-grid cols-3 fa-cmp-top">', 'cmp framed')
    # Settings › Firewall Analyzer: Firewall Inventory and Firewall Templates are ONE screen with two tabs (owner,
    # 16 Oct 2026 — like Monitor Settings' tabbed screens). Under ?embed=settings the shared settings header carries an
    # obs-tabs row over the two routes; picking a tab is a route change, so each screen keeps its own bindings.
    rep("""function dpSettingsHeader() {
  return `<obs-page-header id="dpHeader" heading="Settings" back><obs-icon slot="before" name="settings" size="18" class="fa-lic-page-icon"></obs-icon></obs-page-header>`;
}""", """const FW_SET_TABS = [{ key: 'fwinventory', label: 'Firewall Inventory' }, { key: 'fwtemplates', label: 'Firewall Templates' }];
function dpSettingsHeader() {
  const tabs = document.documentElement.classList.contains('fasettings') && FW_SET_TABS.some(x => x.key === currentTab)
    ? `<obs-tabs class="fa-fwset-tabs" value="${currentTab}" tabs='${j(FW_SET_TABS)}'></obs-tabs>` : '';
  return `<obs-page-header id="dpHeader" heading="Settings" back><obs-icon slot="before" name="settings" size="18" class="fa-lic-page-icon"></obs-icon></obs-page-header>${tabs}`;
}
document.addEventListener('change', e => {
  const tb = e.target;
  if (!tb || !tb.classList || !tb.classList.contains('fa-fwset-tabs')) return;
  const d = Array.isArray(e.detail) ? e.detail[0] : e.detail;
  const k = typeof d === 'string' ? d : d && (d.key || d.value);
  if (k && k !== currentTab) go(k);
}, true);   /* capture: obs-tabs' change does not bubble to the document */""", 'fw settings tabs')
    # Settings › Firewall Inventory on obs-table (owner, 16 Oct 2026): the hand-built light-DOM grid (faGrid) is replaced.
    # Device = severity cell (status dot + name, the lead column) · Firewall Manage Status = obs-table's own switch cell ·
    # Credential Status = a coloured tag (Successful / Failed / No credential / Not applicable) · Type = an icon cell ·
    # the ⋯ menu is obs-table's rowActions. obs-table has no per-row link colour, so "Add Credential" and the red
    # "Failed" link became tags; their doors are the row menu's Update Credential and the new Credential status.
    # dsGrid learns rowActions (+ a `rowaction` handler) for it.
    rep("""    page-size="${opts.pageSize ?? 50}" empty-text="${esc(opts.empty || 'No records found')}"
    columns='${j(dsCols)}' rows='${j(dsRows)}'></obs-table></div>`;""",
        """    page-size="${opts.pageSize ?? 50}" empty-text="${esc(opts.empty || 'No records found')}"${opts.rowActions ? ` row-actions='${j(opts.rowActions)}'` : ''}
    columns='${j(dsCols)}' rows='${j(dsRows)}'></obs-table></div>`;""", 'dsGrid rowActions')
    rep("""  DSG[id] = { gridId, cols, rows, srt: sc ? srt : null, onCell: opts.onCell };""",
        """  DSG[id] = { gridId, cols, rows, srt: sc ? srt : null, onCell: opts.onCell, onRow: opts.onRow };""", 'dsGrid onRow')
    rep("""    if (g.onCell) t.addEventListener('cellaction', e => {""",
        """    if (g.onRow) t.addEventListener('rowaction', e => {
      const d = detailOf(e) || {};
      g.onRow(keyOf(d.action), String(d.id));
    });
    if (g.onCell) t.addEventListener('cellaction', e => {""", 'dsGrid rowaction bind')
    rep("""      ${faGrid('tblFwInventory', cols, D.devices, { maxHeight: 'calc(100vh - 300px)' })}`)}""",
        """      ${dsGrid('tblFwInventory', 'fiGrid', [
        { key: 'name', title: 'Device', ds: { type: 'severity', primary: true }, sortVal: d => d.name, cell: d => d.name },
        { key: 'mgmt', title: 'IP/Host', sortVal: d => d.mgmt, cell: d => d.mgmt },
        { key: 'sysOid', title: 'System OID', sortVal: d => d.sysOid, cell: d => d.sysOid },
        { key: 'vendor', title: 'Vendor', sortVal: d => fwVendorName(d), cell: d => fwVendorName(d) },
        { key: 'template', title: 'Template', sortVal: d => (fwTemplateOf(d) || {}).name || '', cell: d => { const t = fwTemplateOf(d); return t ? t.name : 'Not assigned'; } },
        { key: 'manage', title: 'Firewall Manage Status', ds: { type: 'switch' }, cell: d => fwManaged(d) },
        /* the live NCCM Device Inventory's Credential Status (owner, 16 Oct 2026): icon + text, not tags — ✓ Successful,
           ⊗ Failed, ⊘ Not Applicable — and "Add Credential" a text BUTTON (obs-table's link cell, which emits cellaction) */
        { key: 'cred', title: 'Credential Status', ds: { type: 'link' }, sortVal: d => credStatusOf(d).kind, cell: d => {
            const k = credStatusOf(d).kind;
            return k === 'ok' ? { text: 'Successful', icon: 'check-circle', iconLabel: 'Successful' }
              : k === 'fail' ? { text: 'Failed', icon: 'times-circle', iconLabel: 'Failed' }
              : k === 'add' ? { text: 'Add Credential' } : { text: 'Not Applicable', icon: 'ban', iconLabel: 'Not applicable' }; } },
        { key: 'type', title: 'Type', ds: { type: 'icon' }, cell: () => 'secure' }
      ].map(c => ({ ...c, sev: undefined })), D.devices.map(d => ({ ...d, sev: d.status })), {
        rowActions: FI_ROW_ACTIONS.concat([{ key: 'credStatus', label: 'Credential status', icon: 'shield-check' }]),
        onRow: (k, id) => {
          const dm = D.devices.find(x => x.id === id); if (dm && !fwManaged(dm)) return;   /* management off: no actions */
          if (k === 'schedule') scheduleBackupModal(id);
          if (k === 'updateCred') go('fwinventory', id + '/credential');
          if (k === 'updateTpl') go('fwinventory', id + '/template');
          if (k === 'credStatus') go('fwinventory', id + '/status');
        },
        onCell: (dd, r) => {
          if (dd.key === 'cred') {   /* Add Credential → Select Credential Profile; Failed → where the collection failed */
            const k = (credStatusOf(D.devices.find(x => x.id === r.id) || {}) || {}).kind;
            if (k === 'add') go('fwinventory', r.id + '/credential'); else if (k === 'fail') go('fwinventory', r.id + '/status');
            return;
          }
          if (dd.key !== 'manage') return;
          const d = D.devices.find(x => x.id === r.id); if (!d) return;
          const on = !!dd.value;
          d.faManaged = on;
          const rr = d.signals.rules = d.signals.rules || { state: 'off' };
          if (!on) { if (rr.state !== 'off') rr.state = 'off'; }
          else if (rr.cred) { const c = FS.credentials.find(x => x.id === rr.cred); rr.state = c && c.expired ? 'error' : 'ok'; }
          renderContent();
        } })}`)}""", 'fwinv obs-table')
    # Firewall Inventory on the DS list-view recipe (owner, 16 Oct 2026: "change the table view using observeops design system"):
    # NO card frame round toolbar + grid (table.dont: "the product grid is borderless"), the tinted header the recipe names
    # (--grid-header-bg), `selectable` rows with obs-table's own floating bulk-action bar (Enable / Disable management),
    # and column widths so "Firewall Manage Status" no longer truncates. dsGrid learns selectable / headerStyle / bulk.
    rep("""data-dsg="${id}"><obs-table id="${id}" class="fa-tblrule" header-style="default" sticky-header""",
        """data-dsg="${id}"><obs-table id="${id}" class="fa-tblrule" header-style="${opts.headerStyle || 'default'}"${opts.selectable ? ' selectable' : ''} sticky-header""", 'dsGrid header/selectable')
    rep("""    columns='${j(dsCols)}' rows='${j(dsRows)}'></obs-table></div>`;""",
        """    columns='${j(dsCols)}' rows='${j(dsRows)}'>${opts.bulk || ''}</obs-table></div>`;""", 'dsGrid bulk slot')
    rep("""  DSG[id] = { gridId, cols, rows, srt: sc ? srt : null, onCell: opts.onCell, onRow: opts.onRow };""",
        """  DSG[id] = { gridId, cols, rows, srt: sc ? srt : null, onCell: opts.onCell, onRow: opts.onRow, sel: [] };""", 'dsGrid sel')
    rep("""    if (g.onRow) t.addEventListener('rowaction', e => {""",
        """    t.addEventListener('change', e => {
      if (e.target !== t) return;
      const d = e.detail; const ids = Array.isArray(d) ? (Array.isArray(d[0]) ? d[0] : d) : [];
      g.sel = ids.map(String);
    });
    if (g.onRow) t.addEventListener('rowaction', e => {""", 'dsGrid selection bind')
    rep("""  <div class="fa-dp-list">
    ${panel(`
      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="fiFilters\"""",
        """  <div class="fa-dp-list fa-fi-list">
      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="fiFilters\"""", 'fwinv no panel open')
    rep("""          renderContent();
        } })}`)}
  </div>`;""", """          renderContent();
        },
        selectable: true, headerStyle: 'default',
        bulk: `<obs-button slot="bulk-actions" variant="default" size="small" data-fibulk="1">Enable management</obs-button>
          <obs-button slot="bulk-actions" variant="default" size="small" data-fibulk="0">Disable management</obs-button>` })}
  </div>`;""", 'fwinv no panel close')
    rep("""        { key: 'name', title: 'Device', ds: { type: 'severity', primary: true }, sortVal: d => d.name, cell: d => d.name },
        { key: 'mgmt', title: 'IP/Host', sortVal: d => d.mgmt, cell: d => d.mgmt },
        { key: 'sysOid', title: 'System OID', sortVal: d => d.sysOid, cell: d => d.sysOid },
        { key: 'vendor', title: 'Vendor', sortVal: d => fwVendorName(d), cell: d => fwVendorName(d) },
        { key: 'template', title: 'Template',""",
        """        { key: 'name', title: 'Device', width: 150, ds: { type: 'severity', primary: true }, sortVal: d => d.name, cell: d => d.name },
        { key: 'mgmt', title: 'IP/Host', width: 120, sortVal: d => d.mgmt, cell: d => d.mgmt },
        { key: 'sysOid', title: 'System OID', sortVal: d => d.sysOid, cell: d => d.sysOid },
        { key: 'vendor', title: 'Vendor', sortVal: d => fwVendorName(d), cell: d => fwVendorName(d) },
        { key: 'template', title: 'Template',""", 'fwinv widths a')
    rep("""        { key: 'manage', title: 'Firewall Manage Status', ds: { type: 'switch' }""",
        """        { key: 'manage', title: 'Firewall Manage Status', width: 200, ds: { type: 'switch' }""", 'fwinv widths b')
    rep("""        { key: 'type', title: 'Type', ds: { type: 'icon' }""",
        """        { key: 'type', title: 'Type', width: 80, ds: { type: 'icon' }""", 'fwinv widths d')
    rep("""        { key: 'cred', title: 'Credential Status', ds: { type: 'link' }""",
        """        { key: 'cred', title: 'Credential Status', width: 160, ds: { type: 'link' }""", 'fwinv widths c')
    rep("""function bindFwInventory() {""", """/* the bulk bar's two actions: every selected firewall's management on / off, the same write the row switch makes */
function fiBulk(on) {
  const g = DSG.tblFwInventory; if (!g || !g.sel.length) return;
  g.sel.forEach(id => {
    const d = D.devices.find(x => String(x.id) === id); if (!d) return;
    d.faManaged = on;
    const rr = d.signals.rules = d.signals.rules || { state: 'off' };
    if (!on) rr.state = 'off';
    else if (rr.cred) { const c = FS.credentials.find(x => x.id === rr.cred); rr.state = c && c.expired ? 'error' : 'ok'; }
  });
  g.sel = [];
  renderContent();
}
/* app.js is a module, so an inline onclick cannot reach fiBulk — one delegated listener. obs-button fires twice (inner
   button + host re-emit); the second finds the selection already cleared and does nothing. */
document.addEventListener('click', e => {
  const b = e.target && e.target.closest && e.target.closest('[data-fibulk]');
  if (b) fiBulk(b.dataset.fibulk === '1');
});
function bindFwInventory() {""", 'fiBulk')
    # Firewall Templates on the same DS list-view shape as Firewall Inventory (owner, 16 Oct 2026): no card frame, the
    # table in a .fa-dsg bounded box so its rows scroll under a sticky header and its pager sits at the foot of the
    # screen, the header ruled like every converted grid, and the right-aligned Devices count gets a right-aligned header.
    rep("""    ${panel(`
      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="ftFilters\"""", """      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="ftFilters\"""", 'fwtpl no panel open')
    rep("""      <obs-table id="tblFwTemplates" columns='${j(cols)}' rows='${j(rows)}' header-style="tinted" sort="name:asc" page-size="50" row-actions='${j(FT_ROW_ACTIONS)}'></obs-table>`)}""",
        """      <div class="fa-dsg"><obs-table id="tblFwTemplates" class="fa-tblrule fa-thr" columns='${j(cols)}' rows='${j(rows)}' header-style="default" sticky-header sort="name:asc" page-size="50" row-actions='${j(FT_ROW_ACTIONS)}'></obs-table></div>""", 'fwtpl no panel close')
    rep("""function bindFwTemplates() {""", """function bindFwTemplates() {
  if (currentTab === 'fwtemplates') setTimeout(() => dsGridFit(), 0);""", 'fwtpl fit')
    rep(""":host(.fa-tblx) thead th:first-child,:host(.fa-tblx) tbody td:first-child{padding-left:0}');r.adoptedStyleSheets""", """:host(.fa-tblx) thead th:first-child,:host(.fa-tblx) tbody td:first-child{padding-left:0}:host(.fa-thr) thead th.al-right{text-align:right}:host(.fa-tblrule) .hs-tinted thead th{background:linear-gradient(var(--grid-header-bg),var(--grid-header-bg)),var(--page-background-color)}');r.adoptedStyleSheets""", 'fwtpl th right')
    # Gap 06: obs-select's column-chooser menu is capped at 440px with overflow:hidden but its rows never scroll, so the
    # "Reset column preference" footer was clipped with 10 columns. Menu = flex column; rows take the rest and scroll;
    # long labels wrap instead of ellipsising in the fixed 220px menu.
    rep("""if(this.tagName==='OBS-TABLE'){try{var ts=""", """if(this.tagName==='OBS-SELECT'){try{var cs=new CSSStyleSheet();cs.replaceSync(':host(.ds-dg-cols) .menu.cols{display:flex;flex-direction:column}:host(.ds-dg-cols) .menu.cols .ccm{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}:host(.ds-dg-cols) .cc-rows{flex:1 1 auto;min-height:0;overflow-y:auto}:host(.ds-dg-cols) .cc-reset{flex:0 0 auto}:host(.ds-dg-cols) .cc-row{color:var(--page-text-color)}:host(.ds-dg-cols) .cc-lbl{white-space:normal;overflow-wrap:anywhere;line-height:1.3}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[cs]);}catch(e){}}if(this.tagName==='OBS-TABLE'){try{var ts=""", 'gap06 col chooser')
    # Policies Management's four grids (owner, 16 Oct 2026: "the pagination will be set by default bottom"): each table
    # sits in a .fa-dsg box sized to the rest of the screen (dsGridFit), so rows scroll under the sticky header and the
    # pager is at the foot whatever the row count — as Firewall Inventory / Templates. The old max-height cap goes.
    for tid in ['tblPmRules', 'tblPmNat', 'tblPmStatus']:
        rep('<obs-table id="%s" class="fa-tblrule"' % tid, '<div class="fa-dsg"><obs-table id="%s" class="fa-tblrule"' % tid, 'pm dsg open ' + tid)
    rep("""<obs-table id="${table}" class="fa-tblrule" columns='${j(gridCols(grid, cols))}' rows='${j(rows)}'
        header-style="default" sticky-header max-height="calc(100vh - 400px)" page-size="50" sort="name:asc"></obs-table>""",
        """<div class="fa-dsg"><obs-table id="${table}" class="fa-tblrule" columns='${j(gridCols(grid, cols))}' rows='${j(rows)}'
        header-style="default" sticky-header page-size="50" sort="name:asc"></obs-table></div>""", 'pm dsg objects')
    rep("""          { key: 'delete',  label: 'Delete Policy', icon: 'trash', danger: true }])}'></obs-table>`)}""",
        """          { key: 'delete',  label: 'Delete Policy', icon: 'trash', danger: true }])}'></obs-table></div>`)}""", 'pm dsg close rules')
    rep("""        empty-text="No NAT policy is collected for this firewall"></obs-table>`)}""",
        """        empty-text="No NAT policy is collected for this firewall"></obs-table></div>`)}""", 'pm dsg close nat')
    rep("""        empty-text="Nothing is pending on this firewall"></obs-table>`);""",
        """        empty-text="Nothing is pending on this firewall"></obs-table></div>`);""", 'pm dsg close status')
    rep("""header-style="default" sticky-header max-height="calc(100vh - 400px)" page-size="50" sort="seq:asc\"""",
        """header-style="default" sticky-header page-size="50" sort="seq:asc\"""", 'pm rules no cap')
    rep("""header-style="default" sticky-header max-height="calc(100vh - 400px)" page-size="50" sort="name:asc"
        empty-text="No NAT""", """header-style="default" sticky-header page-size="50" sort="name:asc"
        empty-text="No NAT""", 'pm nat no cap')
    rep("""header-style="default" sticky-header max-height="calc(100vh - 400px)" page-size="50" sort="requested:desc\"""",
        """header-style="default" sticky-header page-size="50" sort="requested:desc\"""", 'pm status no cap')
    rep("""function mountStdGrids() {
""", """function mountStdGrids() {
  setTimeout(() => dsGridFit(), 0);
""", 'stdgrids fit')
    # Firewall Inventory's toolbar = the module's standard DS grid toolbar (DS.DataGrid, as Policies Management) — owner,
    # 16 Oct 2026: "improve the view and alignment". Row 1: search · filter / PDF / CSV / Excel squares (neutral-lightest)
    # · the Columns chooser; row 2: the obs-filters bar with Groups · Types · Vendor as quick filters. The hand-built
    # strip (pills + bordered squares on one line, a Tag button that did nothing) is gone.
    rep("""function screenFwInventory() {
  const filterFields = [""", """let FI_FIELDS = [];
/* the Columns chooser's list — the grid's own columns, key + title (the name column stays) */
const FI_COLS = [{ key: 'name', title: 'Device', fixed: true }, { key: 'mgmt', title: 'IP/Host' }, { key: 'sysOid', title: 'System OID' },
  { key: 'vendor', title: 'Vendor' }, { key: 'template', title: 'Template' }, { key: 'manage', title: 'Firewall Manage Status' },
  { key: 'cred', title: 'Credential Status' }, { key: 'type', title: 'Type' }];
function screenFwInventory() {
  const filterFields = FI_FIELDS = [""", 'fi fields global')
    rep("""      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="fiFilters" kind="bar" match="all" value='[]' fields='${j(filterFields)}' quick-filters='${j(['groups', 'types', 'vendor'])}'></obs-filters>
        ${toolbarIcons(['preview', 'tag', 'pdf', 'csv', 'filter'])}
      </obs-toolbar>""", """      ${stdGridHost('fiGrid')}""", 'fi std toolbar')
    rep("""function mountStdGrids() {
""", """function mountStdGrids() {
  mountStdGrid('fiGrid', { columns: FI_COLS, table: 'tblFwInventory', fields: FI_FIELDS, quickFilters: ['groups', 'types', 'vendor'] });
""", 'fi mount')
    # Settings › Policies Management lists EVERY firewall (owner, 16 Oct 2026: "firewall is the device type, so remove this
    # field and it will be set in the table, and by default show all rows"). The Firewall picker is gone; under fasettings
    # the four grids are scoped to no device, so Policies / Objects / NAT carry their existing Firewall column and Policy
    # and Object Status gains one; Push sends the ticked changes whatever firewall they are for; Add Policy / Add Object
    # ask which firewall (Device Name becomes a picker, and changing it re-seeds the form from that firewall's ports,
    # objects and next Policy ID). The device's own Policies tab elsewhere stays one firewall.
    rep("""function pmBar(section, devName) {""", """/* Settings › Policies Management: every firewall at once (the route still names one, for the drawers' default) */
const pmAll = () => document.documentElement.classList.contains('fasettings');
const pmHome = () => (dev1 && (D.devices.find(x => x.id === dev1.id) || {}).name) || '';
const pmScope = () => (pmAll() ? null : pmHome());
function pmBar(section, devName) {""", 'pm all helpers')
    rep("""screenPolicyManagement(dev1.sub.policy, d.name)""", """screenPolicyManagement(dev1.sub.policy, pmAll() ? null : d.name)""", 'pm all screen')
    rep("""    <div class="fa-pmset">${field('Firewall', `<obs-select id="pmFwPick" searchable options='${j(D.devices.map(x => ({ label: x.name, value: x.id })))}' value="${esc(d.id)}"></obs-select>`)}</div>
""", "", 'pm all no picker')
    rep("""pmBar(sec, (D.devices.find(x => x.id === dev1.id) || {}).name)""", """pmBar(sec, pmScope())""", 'pm all bar')
    rep("""const pendingOf = devName => D.pendingChanges.filter(p => p.device === devName);""",
        """const pendingOf = devName => D.pendingChanges.filter(p => devName === null || p.device === devName);""", 'pm all pendingOf')
    rep("""  if (!mine.length) return `Nothing pending on ${devName}`;""", """  if (!mine.length) return devName ? `Nothing pending on ${devName}` : 'Nothing pending';""", 'pm all reason')
    rep("""  const rows = mine.map(p => ({ id: p.id, name: p.target, kind: p.kind, op: p.op, summary: p.summary, by: p.by,
    requested: p.requested, status: PENDING_TAG }));
  ST_COLS = [
    { key: 'name', title: 'Name', width: 210, fixed: true },""", """  const rows = mine.map(p => ({ id: p.id, name: p.target, device: p.device, kind: p.kind, op: p.op, summary: p.summary, by: p.by,
    requested: p.requested, status: PENDING_TAG }));
  ST_COLS = [
    { key: 'name', title: 'Name', width: 210, fixed: true },
    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 140 }]),""", 'pm all status col')
    rep("""        empty-text="Nothing is pending on this firewall"></obs-table>""", """        empty-text="${dev ? 'Nothing is pending on this firewall' : 'Nothing is pending'}"></obs-table>""", 'pm all status empty')
    rep("""    pmTicked = ids.filter(id => pendingOf(d.name).some(p => p.id === id));
    paintPmBar(d.name);""", """    pmTicked = ids.filter(id => pendingOf(pmScope()).some(p => p.id === id));
    paintPmBar(pmScope());""", 'pm all status bind')
    rep("""    if (d && !pmPushBtn.hasAttribute('disabled')) pmPush(d.name);""", """    if (d && !pmPushBtn.hasAttribute('disabled')) pmPush(pmScope());""", 'pm all push click')
    rep("""    title: `Push ${n} change${s} to ${devName}?`""", """    title: `Push ${n} change${s} to ${devName || [...new Set(picked.map(x => x.device))].join(', ')}?`""", 'pm all push title')
    rep("""      pmFlash = { title: `${n} change${s} submitted to ${devName}`""", """      pmFlash = { title: `${n} change${s} submitted to ${devName || [...new Set(picked.map(x => x.device))].join(', ')}`""", 'pm all push flash')
    rep("""      ${field('Device Name', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}""",
        """      ${pmAll() && !f.edit ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true })
        : field('Device Name', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}""", 'pm all policy dev')
    rep("""  return `<div class="fa-grid cols-2">
      ${field('Mode', mode ? pmRo(mode) : pmRo('Not collected', true))}""", """  return `<div class="fa-grid cols-2">
      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true }) : ''}
      ${field('Mode', mode ? pmRo(mode) : pmRo('Not collected', true))}""", 'pm all object dev')
    rep("""      if (k === 'type') { f.value = ''; f.members = []; }
      if (PM_SHAPE[k]) repaint(); else repaintFoot();""", """      if (k === 'type') { f.value = ''; f.members = []; }
      /* another firewall: its ports, objects and next Policy ID — the form re-seeds, keeping what was typed as name and description */
      if (k === 'dev') { const keep = { name: f.name, desc: f.desc }; Object.assign(f, pmBlank(f.kind, f.dev, f.types), keep); }
      if (PM_SHAPE[k] || k === 'dev') repaint(); else repaintFoot();""", 'pm all dev reseed')
    rep("""  if (!d || !r || r.device !== d.name) return;
  pmf = pmEditForm(r);""", """  if (!d || !r || (!pmAll() && r.device !== d.name)) return;
  pmf = pmEditForm(r);""", 'pm all edit')
    rep("""  const rule = r.edit ? D.rules.find(x => x.id === r.edit && x.device === d.name) : null;""",
        """  const rule = r.edit ? D.rules.find(x => x.id === r.edit && (pmAll() || x.device === d.name)) : null;""", 'pm all edit route')
    # Firewall as a filter (owner, 16 Oct 2026: "the device type is shown in the filter"): on the all-firewalls view each of
    # the four grids leads its quick-filter pills with Firewall. And the filter bar now FILTERS — DS.DataGrid kept the
    # chosen conditions (and the search) in gridState but nothing applied them to the rows; pmGridRows does, for these four.
    rep("""const pmScope = () => (pmAll() ? null : pmHome());""", """const pmScope = () => (pmAll() ? null : pmHome());
const PM_FW_FIELD = () => ({ key: 'device', label: 'Firewall', type: 'enum', values: D.devices.map(d => d.name) });
/* the grid's own filter bar + search, applied: obs-filters' {field, operator, value} conditions, Match all / any */
function pmGridRows(id, rows) {
  const st = gridState[id] || {};
  const txt = v => Array.isArray(v) ? v.map(x => (x && typeof x === 'object' ? (x.label || x.name || '') : String(x))).join('\\u0001')
    : v && typeof v === 'object' ? String(v.label || v.name || '') : String(v ?? '');
  const conds = (st.conditions || []).filter(c => c && c.field && (Array.isArray(c.value) ? c.value.length : c.value != null && c.value !== ''));
  const test = (r, c) => {
    const cell = txt(r[c.field]), parts = cell.split('\\u0001'), op = String(c.operator || '').toLowerCase();
    const vals = (Array.isArray(c.value) ? c.value : [c.value]).map(String);
    const lc = cell.toLowerCase();
    const hit = vals.some(v => { const x = v.toLowerCase();
      return /contain/.test(op) ? lc.includes(x) : /start/.test(op) ? lc.startsWith(x) : /end/.test(op) ? lc.endsWith(x) : parts.includes(v); });
    return /not|!=|exclude/.test(op) ? !hit : hit;
  };
  const q = String(st.query || '').trim().toLowerCase();
  return rows.filter(r => (!q || Object.keys(r).some(k => k !== 'id' && txt(r[k]).toLowerCase().includes(q)))
    && (!conds.length || (st.match === 'any' ? conds.some(c => test(r, c)) : conds.every(c => test(r, c)))));
}""", 'pm grid filter')
    rep("""  PM_FIELDS = [TAG_FIELD(['Used', 'Unused', 'Unassigned'])].concat(policyConfigFields(dev));""",
        """  const pcf = policyConfigFields(dev);
  PM_FIELDS = pcf.filter(f => f.key === 'device').concat([TAG_FIELD(['Used', 'Unused', 'Unassigned'])], pcf.filter(f => f.key !== 'device'));""", 'pm rules fields')
    rep("""PM_FIELDS.slice(0, 4)""", """PM_FIELDS.slice(0, pmAll() ? 5 : 4)""", 'pm rules quick')
    rep("""  OBJ_GRIDS[grid] = { table, cols, fields: [
    { key: 'kind', label: 'Object Type', type: 'enum', values: ['Address', 'Address group', 'Service', 'Service group'] },
    TAG_FIELD(['Assigned', 'Unassigned']),
    ...(dev ? [] : [{ key: 'device', label: 'Firewall', type: 'enum', values: D.devices.map(d => d.name) }])
  ] };""", """  OBJ_GRIDS[grid] = { table, cols, fields: [
    ...(dev ? [] : [PM_FW_FIELD()]),
    { key: 'kind', label: 'Object Type', type: 'enum', values: ['Address', 'Address group', 'Service', 'Service group'] },
    TAG_FIELD(['Assigned', 'Unassigned'])
  ] };""", 'pm obj fields')
    rep("""quickFilters: ['tag', 'kind'] });""", """quickFilters: (pmAll() ? ['device'] : []).concat(['tag', 'kind']) });""", 'pm obj quick')
    rep("""  NAT_FIELDS = [
    TAG_FIELD""", """  NAT_FIELDS = [
    ...(dev ? [] : [PM_FW_FIELD()]),
    TAG_FIELD""", 'pm nat fields')
    rep("""  ST_FIELDS = [
""", """  ST_FIELDS = [
    ...(dev ? [] : [PM_FW_FIELD()]),
""", 'pm status fields')
    # apply the filter to each grid's rows
    rep("""rows='${j(rows)}'
        header-style="default" sticky-header page-size="50" sort="seq:asc\"""", """rows='${j(pmGridRows('pmRulesGrid', rows))}'
        header-style="default" sticky-header page-size="50" sort="seq:asc\"""", 'pm rules apply')
    rep("""columns='${j(gridCols(grid, cols))}' rows='${j(rows)}'""", """columns='${j(gridCols(grid, cols))}' rows='${j(pmGridRows(grid, rows))}'""", 'pm obj apply')
    rep("""columns='${j(gridCols('pmNatGrid', NAT_COLS))}' rows='${j(rows)}'""", """columns='${j(gridCols('pmNatGrid', NAT_COLS))}' rows='${j(pmGridRows('pmNatGrid', rows))}'""", 'pm nat apply')
    rep("""columns='${j(gridCols('pmStatusGrid', ST_COLS))}' rows='${j(rows)}'""", """columns='${j(gridCols('pmStatusGrid', ST_COLS))}' rows='${j(pmGridRows('pmStatusGrid', rows))}'""", 'pm status apply')
    # Add / Edit Policy and Add Object on the DS form recipe (owner, 16 Oct 2026: "this sidebar is not perfect on observeops
    # design system"): a read-only value is a disabled obs-input like Device Name and Mode beside it (Policy ID, the object
    # form's Mode and NAT's translated address were bare text), labels in --page-text-color (form-view labelColour) and the
    # DS 16px column gutter (MRow :gutter 16, was 24).
    rep("""const pmRo = (v, muted) => `<span class="fa-pmf-ro${muted ? ' is-muted' : ''}">${esc(v)}</span>`;""",
        """const pmRo = v => `<obs-input type="text" block disabled value="${esc(v)}"></obs-input>`;""", 'pm ro input')
    # …and the same reference's two behaviours: the switch carries its ON / OFF text, and the primary names its action
    rep("""      ${field('NAT', `<obs-switch data-${ns}="nat" size="small"${f.nat ? ' checked' : ''} aria-label="NAT"></obs-switch>`)}""",
        """      ${field('NAT', `<obs-switch data-${ns}="nat" size="small" checked-text="ON" unchecked-text="OFF"${f.nat ? ' checked' : ''} aria-label="NAT"></obs-switch>`)}""", 'pm nat onoff')
    rep("""${f.edit ? 'Save changes' : 'Add'}</obs-button>${esc(reason)}</obs-tooltip>`
        : `<obs-button variant="primary" id="${ns}Add">${f.edit ? 'Save changes' : 'Add'}</obs-button>`}`;""",
        """${f.edit ? 'Save changes' : PM_ADD[f.kind] || 'Add'}</obs-button>${esc(reason)}</obs-tooltip>`
        : `<obs-button variant="primary" id="${ns}Add">${f.edit ? 'Save changes' : PM_ADD[f.kind] || 'Add'}</obs-button>`}`;""", 'pm add label')
    # the reference drawer's fields and frame, inside the components (their own shadow CSS cannot be reached from the page)
    rep('<obs-drawer id="pmAddDrawer" width="52%"', '<obs-drawer id="pmAddDrawer" width="40%"', 'pm drawer 40')
    rep("""const pmRo = v => `<obs-input type="text" block disabled value="${esc(v)}"></obs-input>`;""",
        """const pmRo = v => `<obs-input class="fa-pmfi" type="text" block disabled value="${esc(v)}"></obs-input>`;""", 'pm ro class')
    rep("""if(this.tagName==='OBS-SELECT'){try{var cs=new CSSStyleSheet();cs.replaceSync('""",
        """if(this.tagName==='OBS-DRAWER'){try{var dw=new CSSStyleSheet();dw.replaceSync(':host(#pmAddDrawer) .hd{margin-left:16px;margin-right:16px}:host(#pmAddDrawer) .body{padding:15px 16px}:host(#pmAddDrawer) .title{font-size:18px;font-weight:500}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[dw]);}catch(e){}}if(this.tagName==='OBS-INPUT'){try{var pi=new CSSStyleSheet();pi.replaceSync(':host([data-pmf]) .ip,:host([data-pmo]) .ip,:host(.fa-pmfi) .ip{border-color:var(--field-border-color)}:host([data-pmf]) input,:host([data-pmo]) input,:host(.fa-pmfi) input,:host([data-pmf]) textarea,:host([data-pmo]) textarea{font-size:14px}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[pi]);}catch(e){}}if(this.tagName==='OBS-SELECT'){try{var ps=new CSSStyleSheet();ps.replaceSync(':host([data-pmf]) .trig,:host([data-pmo]) .trig{border-color:var(--field-border-color);font-size:14px}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[ps]);}catch(e){}}if(this.tagName==='OBS-SELECT'){try{var cs=new CSSStyleSheet();cs.replaceSync('""", 'pm field hooks')
    # Policies Analytics (owner, 16 Oct 2026): "remove the LAST HIT COUNT and change TOTAL HIT COUNTS to HIT COUNTS" —
    # the time-range count goes from the grid and its filter; the lifetime count keeps its key and is renamed
    rep("""    { key: 'hits', title: 'Last Hit Count', align: 'right', width: 180, sortVal: r => r.hits, cell: r => r.hits.toLocaleString(), render: r => r.hits.toLocaleString() },
    { key: 'hitsTotal', title: 'Total Hit Counts',""", """    { key: 'hitsTotal', title: 'Hit Counts',""", 'pol hits col')
    rep("""    { key: 'hits', label: 'Last Hit Count', type: 'string' },
    { key: 'hitsTotal', label: 'Total Hit Counts', type: 'string' },""", """    { key: 'hitsTotal', label: 'Hit Counts', type: 'string' },""", 'pol hits field')
    # Users (owner, 16 Oct 2026: "remove the tag"): the untitled column that tagged the Unknown row "unidentified" goes —
    # the row's own name says it, and the Identity filter still separates identified from unidentified users
    rep("""    { key: 'userTag', title: '', width: 120, ds: { type: 'tags' }, cell: r => (r.unknown ? chip('unidentified', 'tag-yellow') : []) },
""", "", 'usr tag col')
    # Users (owner, 16 Oct 2026: "remove the link in USER NAME"): a row no longer opens the user's screen — no inspector,
    # no pointer, and the name keeps its weight but loses the dotted hover underline that promised a link
    rep("""  tblRecert: () => ruleDrawer('r-118'), tblEvents: logDrawer, tblFwUsers: openUser
};""", """  tblRecert: () => ruleDrawer('r-118'), tblEvents: logDrawer
};""", 'usr no link')
    rep("""#tblFwUsers { cursor: pointer; }""", """#tblFwUsers { cursor: default; }""", 'usr no pointer')
    rep(""":host(.fa-thr) thead th.al-right{text-align:right}""", """:host(.fa-thr) thead th.al-right{text-align:right}:host(#tblFwUsers) .primary-text{text-decoration:none!important}:host(#tblFwUsers) tbody tr{cursor:default}:host(#tblFwInventory) a.cell-link{color:var(--page-text-color);text-decoration:none;display:inline-flex;align-items:center;gap:6px;cursor:pointer}:host(#tblFwInventory) a.cell-link:hover{text-decoration:underline}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=check-circle]){color:var(--secondary-green);cursor:default;text-decoration:none}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=times-circle]){color:var(--secondary-red)}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=ban]){color:var(--neutral-light);cursor:default;text-decoration:none}:host(#tblFwInventory) a.cell-link obs-icon{cursor:inherit;color:inherit!important}""", 'usr no underline')
    # Device header = the DS page-header's "Monitor detail header" (owner, 16 Oct 2026, localhost:3000/page-header):
    # back › boxed type tile · title + a status badge · a label/value meta strip under it · squared icon actions on the
    # right. The vendored bundle has no `home` / `type-icon` props, so the tile goes in the `before` slot and the
    # back chevron stays as the way home. The OS track tag moved into the meta strip; the bare status dot became the badge.
    rep("""      <obs-page-header id="devHeader" back heading="${esc(d.name)}" no-divider>
        <span slot="before" class="fa-tile-ic fa-dev-ic"><obs-icon name="secure" size="14"></obs-icon></span>
        <obs-severity slot="before" severity="${esc(d.status)}" shape="dot"></obs-severity>
        <obs-tag slot="title" class="fa-dev-track" variant="tag-unknown">${esc(track.label || d.vendor)}</obs-tag>""",
        """      <obs-page-header id="devHeader" back heading="${esc(d.name)}" no-divider class="fa-mdh"
        meta='${j([{ label: 'Type', value: track.label || d.vendor }, { label: 'IP', value: d.mgmt }, { label: 'Site', value: d.site }, { label: 'HA', value: d.ha }])}'>
        <span slot="before" class="fa-mdh-tile"><obs-icon name="secure" size="20"></obs-icon></span>
        ${(() => { const st = { up: ['Up', 'tag-green'], critical: ['Down', 'tag-red'], warning: ['Warning', 'tag-yellow'], unreachable: ['Unreachable', 'tag-purple'] }[d.status] || [d.status, 'tag-unknown'];
          return `<obs-tag slot="title" class="fa-mdh-st" variant="${st[1]}">${esc(st[0])}</obs-tag>`; })()}
        <obs-button variant="default" squared aria-label="Refresh" data-tip="Refresh" data-mdh="refresh"><obs-icon name="sync" size="14"></obs-icon></obs-button>
        <obs-button variant="default" squared aria-label="Full screen" data-tip="Full screen" data-mdh="full"><obs-icon name="expand" size="14"></obs-icon></obs-button>""", 'mdh header')
    rep("""  if (h) h.addEventListener('back', () => go('devices', devReturn));
  const t = view.querySelector('#devTabs');""",
        """  if (h) h.addEventListener('back', () => go('devices', devReturn));
  /* the header's icon actions — obs-button can deliver one press twice, so each is guarded */
  let mdhAt = 0;
  view.querySelectorAll('[data-mdh]').forEach(b => b.addEventListener('click', () => {
    const now = Date.now(); if (now - mdhAt < 300) return; mdhAt = now;
    if (b.dataset.mdh === 'refresh') go('device', devRoute());
    else if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  }));
  const t = view.querySelector('#devTabs');""", 'mdh bind')
    # Creating an object or a policy (or editing a policy) also raises an APPROVAL request (owner, 16 Oct 2026: "when I
    # create the object or any policies then it will go on the Approval flow"). The request is written to localStorage,
    # which every file:// page shares, so Option 1's Approval screen (index.html) lists it whichever page the change was
    # made on; the parent is also told directly so an open Approval screen repaints at once.
    rep("""function pmRecordObject(f) {""",
        """function faApvQueue(p) {
  const req = { id: 'fa-' + Date.now().toString(36) + '-' + p.id, module: 'Firewall Analyzer', dev: p.device,
    kind: p.kind, op: p.op, target: p.newName || p.target, summary: p.summary, by: p.by, when: new Date().toISOString(),
    info: [['Firewall', p.device], [p.kind + ' name', p.newName || p.target]]
      .concat(p.objType ? [['Object type', p.objType]] : []).concat([['Change', p.summary]]),
    /* the change itself, so the Approval drawer can show what will reach the firewall, not just a sentence */
    rule: p.rule || null, objType: p.objType || '', value: p.value || '', members: p.members || [], desc: p.desc || (p.rule && p.rule.desc) || '' };
  try { const k = 'oo-apv-queue', q = JSON.parse(localStorage.getItem(k) || '[]'); q.push(req); localStorage.setItem(k, JSON.stringify(q)); } catch (e) {}
  try { if (parent !== window) parent.postMessage({ faApproval: req }, '*'); } catch (e) {}
  return req;
}
function pmRecordObject(f) {""", 'apv queue fn')
    rep("""    by: 'Bhavin G', requested: stamp(), objType: f.type, value: f.value.trim(), members: f.members.slice(), desc: f.desc.trim() });
  return name;""",
        """    by: 'Bhavin G', requested: stamp(), objType: f.type, value: f.value.trim(), members: f.members.slice(), desc: f.desc.trim() });
  faApvQueue(D.pendingChanges[D.pendingChanges.length - 1]);
  return name;""", 'apv object')
    rep("""      by: 'Bhavin G', requested: stamp(), rule });
    return name;
  }""",
        """      by: 'Bhavin G', requested: stamp(), rule });
    faApvQueue(D.pendingChanges[D.pendingChanges.length - 1]);
    return name;
  }""", 'apv policy add')
    rep("""    by: 'Bhavin G', requested: stamp(), rule });
  return r.name;""",
        """    by: 'Bhavin G', requested: stamp(), rule });
  faApvQueue(D.pendingChanges[D.pendingChanges.length - 1]);
  return r.name;""", 'apv policy edit')
    # Policy and Object Status is a VIEW of the approval (owner, 16 Oct 2026): every row is a change waiting on (or
    # decided by) the Approval module, its Status reads that decision, and the tab carries no checkboxes and no Push.
    # Decisions come from Option 1's Approval screen via localStorage 'oo-apv-decisions'; the seeded drafts share ids
    # with the Approval screen's demo rows, so the two screens agree from the first load.
    rep("""    { id: 'pc-3', device: 'HQ-FTG-01', kind: 'NAT Policy', op: 'Add', target: 'static-core-app-02', summary: 'Static NAT 198.18.12.12 ↔ 49.36.12.13',                               by: 'network-ops', requested: '2026-09-18 09:31' }
  ];""",
        """    { id: 'pc-3', device: 'HQ-FTG-01', kind: 'NAT Policy', op: 'Add', target: 'static-core-app-02', summary: 'Static NAT 198.18.12.12 ↔ 49.36.12.13',                               by: 'network-ops', requested: '2026-09-18 09:31' },
    { id: 'pc-4', device: 'DMZ-PA-01', kind: 'Object', op: 'Add', target: 'WEB-FARM-02', summary: 'Address 203.0.113.40/29 for the second web farm', by: 'network-ops', requested: '2026-09-17 16:05',
      objType: 'Address', value: '203.0.113.40/29', members: [], desc: 'Second web farm' },
    { id: 'pc-5', device: 'DMZ-PA-01', kind: 'Policy', op: 'Add', target: 'allow-any-rdp', summary: 'Allow any → DMZ-SERVERS on tcp/3389, ethernet1/1 → ethernet1/3', by: 'network-ops', requested: '2026-09-17 14:48',
      rule: { seq: 240, desc: '', action: 'Allow', status: 'Enable', src: ['any'], srcIntf: 'ethernet1/1', dst: ['DMZ-SERVERS'], dstIntf: 'ethernet1/3', svc: ['tcp/3389'], nat: null, log: true } },
    { id: 'pc-6', device: 'CLOUD-FTG-01', kind: 'Policy', op: 'Modify', target: 'api-gw-to-pay', summary: 'Policy 51: log traffic turned on', by: 'network-ops', requested: '2026-09-17 11:22' }
  ];
  /* each seeded draft is already in the Approval queue — the ids are the Approval screen's demo rows */
  [['pc-1', 'fa-demo-1'], ['pc-2', 'fa-demo-2'], ['pc-3', 'fa-demo-3'], ['pc-4', 'fa-demo-4'], ['pc-5', 'fa-demo-5'], ['pc-6', 'fa-demo-6']]
    .forEach(([pc, a]) => { const p = pendingChanges.find(x => x.id === pc); if (p) p.apv = a; });""", 'seed approvals')
    rep("""  try { const k = 'oo-apv-queue', q""", """  p.apv = req.id;
  try { const k = 'oo-apv-queue', q""", 'pending knows its approval')
    rep("""const PENDING_TAG = [{ label: 'Pending Request', variant: 'tag-yellow' }];""",
        """const PENDING_TAG = [{ label: 'Pending Request', variant: 'tag-yellow' }];
/* the Approval module's decision on a change: the seeded demo ones, then whatever Option 1's Approval screen decided */
const FA_APV_SEED = { 'fa-demo-4': { st: 'Approved', by: 'admin' }, 'fa-demo-5': { st: 'Rejected', by: 'admin' }, 'fa-demo-6': { st: 'Approved', by: 'admin' } };
function faApvOf(p) {
  let dec = {};
  try { dec = JSON.parse(localStorage.getItem('oo-apv-decisions') || '{}'); } catch (e) {}
  return (p.apv && (dec[p.apv] || FA_APV_SEED[p.apv])) || { st: 'Pending', by: '' };
}
const FA_APV_TAG = { Pending: 'tag-orange', Approved: 'tag-green', Rejected: 'tag-red' };""", 'apv status fn')
    rep("""  const rows = mine.map(p => ({ id: p.id, name: p.target, device: p.device, kind: p.kind, op: p.op, summary: p.summary, by: p.by,
    requested: p.requested, status: PENDING_TAG }));""",
        """  const rows = mine.map(p => { const a = faApvOf(p);
    return { id: p.id, name: p.target, device: p.device, kind: p.kind, op: p.op, summary: p.summary, by: p.by,
      requested: p.requested, approver: a.by || '—', status: [{ label: a.st === 'Pending' ? 'Pending Approval' : a.st, variant: FA_APV_TAG[a.st] }] }; });""", 'status rows')
    rep("""    { key: 'requested', title: 'Requested Time', width: 160 },
    { key: 'status', title: 'Status', type: 'tags', width: 170 }
  ];""",
        """    { key: 'requested', title: 'Requested Time', width: 160 },
    { key: 'approver', title: 'Approver', width: 120 },
    { key: 'status', title: 'Approval Status', type: 'tags', width: 170 }
  ];""", 'status cols')
    rep("""    { key: 'op', label: 'Change', type: 'enum', values: ['Add', 'Modify', 'Delete'] }
  ];
  return panel(`""",
        """    { key: 'op', label: 'Change', type: 'enum', values: ['Add', 'Modify', 'Delete'] },
    { key: 'status', label: 'Approval Status', type: 'enum', values: ['Pending Approval', 'Approved', 'Rejected'] }
  ];
  return panel(`""", 'status fields')
    rep("""rows='${j(pmGridRows('pmStatusGrid', rows))}' selectable selected='${j(pmTicked)}'""",
        """rows='${j(pmGridRows('pmStatusGrid', rows))}'""", 'status no select')
    rep("""  const what = isObjectsSec(section) ? 'object' : section === NAT_SEC ? null : section === STATUS_SEC ? 'push' : 'policy';""",
        """  const what = isObjectsSec(section) ? 'object' : section === NAT_SEC || section === STATUS_SEC ? null : 'policy';""", 'status no push')
    rep("""window.addEventListener('hashchange', () => {""",
        """/* a decision taken on the Approval screen (another page, or this frame's parent) repaints the status view */
window.addEventListener('storage', e => {
  if (e.key !== 'oo-apv-decisions') return;
  const [t, sec] = fromHash(); if (String(sec || '').includes(STATUS_SEC)) go(t, sec, true);
});
window.addEventListener('hashchange', () => {""", 'status live')
    # Add Object (owner, 16 Oct 2026): Object Name and Description side by side, Object Type on the next line, and the
    # Details (value) field REMOVED — asked and confirmed: "remove the field entirely". A group type keeps its Members
    # picker beside the type (that is a group's content, not the Details field). The value checks went with the field.
    rep("""      ${pmSelect(ns, f, 'type', 'Object Type', f.types, { req: true })}
      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${isGroupType(f.type) ? pmSelect(ns, f, 'members', 'Members', pool, { req: true, multi: true })
        : pmInput(ns, f, 'value', 'Details', { req: true, ph: f.type === 'Service' ? 'tcp/8443' : '198.18.23.0/16 or host.example.com' })}
      ${pmInput(ns, f, 'desc', 'Description', { type: 'textarea', wide: true })}""",
        """      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${pmInput(ns, f, 'desc', 'Description')}
      ${pmSelect(ns, f, 'type', 'Object Type', f.types, { req: true })}
      ${isGroupType(f.type) ? pmSelect(ns, f, 'members', 'Members', pool, { req: true, multi: true }) : ''}""", 'obj form layout')
    rep("""  if (!f.value.trim()) return 'Details is required';
  if (f.type === 'Address' && !IP_OR_HOST.test(f.value.trim())) return 'Details must be an IP, a CIDR or a host name';
  if (f.type === 'Service' && !PROTO_PORT.test(f.value.trim())) return 'Details must read protocol/port, e.g. tcp/8443';""",
        "", 'obj no value checks')
    rep("""  return isGroupType(f.type) ? `${f.type} of ${f.members.join(', ')}` : `${f.type} ${f.value.trim()}`;""",
        """  return isGroupType(f.type) ? `${f.type} of ${f.members.join(', ')}` : f.value.trim() ? `${f.type} ${f.value.trim()}` : f.type;""", 'obj summary')
    # Firewall Inventory's Manage Status switch (owner, 16 Oct 2026: "improve the on/off using the design system"): the
    # DS Switch's own rules — size=small "for dense rows/tables", and its known issue F2 (on/off is colour only) answered
    # with INNER on/off labels (owner, 16 Oct 2026: "use Inner on/off labels") — the component's own `labelled` mode
    # (checked-text / unchecked-text), its rules copied verbatim, the text supplied by .sw::before since the cell
    # cannot pass the props. obs-table's switch cell passes neither size nor checked-text (DS gap), so the shadow hook
    # styles the switch, scoped to this grid by :host-context(#tblFwInventory); the track edge takes --field-border-color
    # because the switch's own --switch-border is ~1.1:1 on the dark grid.
    rep("""r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[ts]);}catch(e){}}""",
        """r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[ts]);}catch(e){}}if(this.tagName==='OBS-SWITCH'){try{var sw=new CSSStyleSheet();sw.replaceSync(':host-context(#tblFwInventory){display:inline-flex;vertical-align:middle}:host-context(#tblFwInventory) .sw{width:auto;min-width:52px;height:22px;padding:0 3px;display:inline-flex;align-items:center;justify-content:space-between;gap:4px;border-color:var(--field-border-color)}:host-context(#tblFwInventory) .knob{position:static;transform:none!important;flex:0 0 auto}:host-context(#tblFwInventory) .sw::before{content:"OFF";order:2;font-size:10px;font-weight:500;line-height:1;padding:0 5px;white-space:nowrap;color:var(--neutral-light)}:host-context(#tblFwInventory) .sw.on::before{content:"ON";order:1;color:var(--page-text-color)}:host-context(#tblFwInventory) .sw.on .knob{order:2}:host-context(#tblFwInventory) .sw:not(.on) .knob{order:1}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[sw]);}catch(e){}}""", 'fi switch hook')
    # Firewall Templates' toolbar = the module's standard DS grid toolbar, as Firewall Inventory's (owner, 16 Oct 2026:
    # "improve this grid using the design system"): row 1 search · filter / exports / Columns · Import, row 2 the filter
    # bar with OS Type · Vendor as quick filters. The grid's rows go through the toolbar's search + conditions.
    rep("""  const rows = D.firewallTemplates.map(t => ({ id: t.id, name: t.name, vendor: t.vendor, os: t.osType, devices: String(fwTemplateDevices(t).length) }));
  const filterFields = [""",
        """  const rows = pmGridRows('ftGrid', D.firewallTemplates.map(t => ({ id: t.id, name: t.name, vendor: t.vendor, os: t.osType, devices: String(fwTemplateDevices(t).length) })));
  const filterFields = FT_FIELDS = [""", 'ft rows filtered')
    rep("""  <div class="fa-dp-list">
    ${flash ? `<obs-banner variant="${esc(flash.variant)}" title="${esc(flash.title)}" closable>${esc(flash.body || '')}</obs-banner>` : ''}
      <obs-toolbar>
        <obs-input slot="start" type="search" placeholder="Search" allow-clear></obs-input>
        <obs-filters id="ftFilters" kind="bar" match="all" value='[]' fields='${j(filterFields)}' quick-filters='${j(['os', 'vendor'])}'></obs-filters>
        ${toolbarIcons(['pdf', 'csv'])}
        <span class="fa-ft-import"><obs-button variant="default" id="ftImport"><obs-icon name="monitor-import" size="14"></obs-icon>&nbsp;Import</obs-button>
          <input type="file" id="ftImportFile" accept="application/json,.json" hidden aria-label="Template JSON file"></span>
        ${toolbarIcons(['filter'])}
      </obs-toolbar>
      <div class="fa-dsg"><obs-table id="tblFwTemplates" class="fa-tblrule fa-thr" columns='${j(cols)}'""",
        """  <div class="fa-dp-list fa-fi-list">
    ${flash ? `<obs-banner variant="${esc(flash.variant)}" title="${esc(flash.title)}" closable>${esc(flash.body || '')}</obs-banner>` : ''}
      ${stdGridHost('ftGrid')}
      <div class="fa-dsg"><obs-table id="tblFwTemplates" class="fa-tblrule fa-thr" columns='${j(gridCols('ftGrid', cols))}'""", 'ft std toolbar')
    rep("""function screenFwTemplates() {""", """let FT_FIELDS = [];
const FT_COLS = [{ key: 'name', title: 'Template', fixed: true }, { key: 'vendor', title: 'Vendor' }, { key: 'os', title: 'OS Type' }, { key: 'devices', title: 'Devices' }];
function screenFwTemplates() {""", 'ft globals')
    rep("""  mountStdGrid('fiGrid', {""", """  /* Import is the toolbar's trailing action; it is bound once the toolbar exists, after the screen's own binders ran */
  if ($('#ftGrid')) {
    mountStdGrid('ftGrid', { columns: FT_COLS, table: 'tblFwTemplates', search: 'Search', fields: FT_FIELDS, quickFilters: ['os', 'vendor'],
      after: `<span class="fa-ft-import"><obs-button variant="default" id="ftImport"><obs-icon name="monitor-import" size="14"></obs-icon>&nbsp;Import</obs-button>
        <input type="file" id="ftImportFile" accept="application/json,.json" hidden aria-label="Template JSON file"></span>` });
    bindFtImport();
  }
  mountStdGrid('fiGrid', {""", 'ft mount')
    # Schedule Backup is a SIDE drawer, not a centred modal (owner, 16 Oct 2026: "convert to side popup") — its own
    # obs-drawer, sized and styled as Add Policy's (40 %, 16px inset, 18px/500 title, footer pinned to the foot). The
    # shared formModal keeps every other form (the discovery schedule among them); only fm.dev (a firewall) routes here.
    rep("""<obs-drawer id="pmAddDrawer" width="40%" title="Add Policy" scrolled-content use-padding esc-closable></obs-drawer>""",
        """<obs-drawer id="pmAddDrawer" width="40%" title="Add Policy" scrolled-content use-padding esc-closable></obs-drawer>
<obs-drawer id="schedDrawer" width="40%" title="Schedule Backup" scrolled-content use-padding esc-closable></obs-drawer>""", 'sched drawer el')
    rep("""function openFormModal(title, body, footer) {
  formModal.setAttribute('title', title);""",
        """const fmInDrawer = () => !!(fm && fm.kind === 'schedule' && fm.dev);
const fmHost = () => (fmInDrawer() ? $('#schedDrawer') : formModal);
function openFormModal(title, body, footer) {
  if (fmInDrawer()) {
    const dr = $('#schedDrawer');
    dr.setAttribute('title', title);
    dr.innerHTML = `<div class="fa-pmf"><div class="fa-form">${body}</div><div class="ds-cred-foot">${footer}</div></div>`;
    if (!dr.hasAttribute('open')) { dr.open = true; dr.setAttribute('open', ''); }
    return;
  }
  formModal.setAttribute('title', title);""", 'sched open drawer')
    rep("""function closeFormModal() { fm = null; formModal.open = false; formModal.removeAttribute('open'); }""",
        """function closeFormModal() { fm = null; [formModal, $('#schedDrawer')].forEach(el => { if (el && el.hasAttribute('open')) { el.open = false; el.removeAttribute('open'); } }); }
$('#schedDrawer').addEventListener('close', e => { if (e.target === $('#schedDrawer')) fm = null; });""", 'sched close')
    rep("""  const on = (sel, ev, fn) => { const el = formModal.querySelector(sel); if (el) el.addEventListener(ev, fn); };
  const arr = v =>""",
        """  const on = (sel, ev, fn) => { const el = fmHost().querySelector(sel); if (el) el.addEventListener(ev, fn); };
  const arr = v =>""", 'sched bind host')
    rep("""$('#fwTplDrawer'), $('#roleDrawer'), $('#pmAddDrawer')].forEach(el => {""",
        """$('#fwTplDrawer'), $('#roleDrawer'), $('#pmAddDrawer'), $('#schedDrawer')].forEach(el => {""", 'sched closeall')
    rep(""":host(#pmAddDrawer) .hd{margin-left:16px;margin-right:16px}:host(#pmAddDrawer) .body{padding:15px 16px}:host(#pmAddDrawer) .title{font-size:18px;font-weight:500}""",
        """:host(#pmAddDrawer) .hd,:host(#schedDrawer) .hd{margin-left:16px;margin-right:16px}:host(#pmAddDrawer) .body,:host(#schedDrawer) .body{padding:15px 16px}:host(#pmAddDrawer) .title,:host(#schedDrawer) .title{font-size:18px;font-weight:500}""", 'sched drawer hook')
    # "No credential" opens the add-credential flow (owner, 16 Oct 2026). obs-table's tags cell emits nothing, so a
    # capture-phase click on the table notes that the press landed on that tag, and the row's own `rowclick` (which carries
    # the row id) opens the Select Credential Profile drawer — the same route as the row menu's Update Credential
    # (#fwinventory/<id>/credential, obs-drawer + obs-select + obs-button, "Create Credential Profile" inside it).
    # The tag gets a pointer, a focus stop and Enter/Space, set on the rendered tag because no CSS can single it out.
    rep("""function bindFwInventory() {
  if (currentTab !== 'fwinventory') return;
  settingsNavOn('Firewall Inventory');""",
        """function bindFwInventory() {
  if (currentTab !== 'fwinventory') return;
  settingsNavOn('Firewall Inventory');
  /* (the "No credential" tag-click capture that stood here went with the tag — the column is a link cell now) */
  /* a firewall whose management is OFF offers no row actions (owner, 16 Oct 2026: "when it is off then not show all
     action"). obs-table gives every row the same rowActions — no per-row list (DS gap) — so the row's ⋮ cell is hidden
     here, read off the row's own switch; the onRow handler refuses an unmanaged firewall as well. */
  const ti = view.querySelector('#tblFwInventory');
  if (ti && ti.shadowRoot) {
    const sync = () => ti.shadowRoot.querySelectorAll('tbody tr').forEach(tr => {
      const sw = tr.querySelector('obs-switch'), act = tr.querySelector('td.act-col'); if (!sw || !act) return;
      const on = sw.shadowRoot && sw.shadowRoot.querySelector('.sw') ? sw.shadowRoot.querySelector('.sw').classList.contains('on') : !!sw.checked;
      act.style.visibility = on ? '' : 'hidden'; act.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    [0, 60, 250, 800].forEach(ms => setTimeout(sync, ms));
    new MutationObserver(sync).observe(ti.shadowRoot, { childList: true, subtree: true });
  }""", 'fi cred tag click')
    rep(""":host(#pmAddDrawer) .hd,:host(#schedDrawer) .hd{""", """:host(#pmAddDrawer) .hd,:host(#schedDrawer) .hd,:host(#credDrawer) .hd{""", 'cred drawer hd')
    rep(""":host(#pmAddDrawer) .body,:host(#schedDrawer) .body{""", """:host(#pmAddDrawer) .body,:host(#schedDrawer) .body,:host(#credDrawer) .body{""", 'cred drawer body')
    rep(""":host(#pmAddDrawer) .title,:host(#schedDrawer) .title{""", """:host(#pmAddDrawer) .title,:host(#schedDrawer) .title,:host(#credDrawer) .title{""", 'cred drawer title')
    # the credential drawer is 40 % wide, the live NCCM Device Inventory's (owner, 16 Oct 2026; it was 52 %)
    rep('<obs-drawer id="credDrawer" width="52%"', '<obs-drawer id="credDrawer" width="40%"', 'cred drawer 40')
    # CSS: the old rules still match the hosts by class — neutralise the box they drew; obs-progress draws its own track
    k = t.index('</style>')
    t = t[:k] + '\n' + MARK2 + """
/* Add / Edit Policy and Add Object = the product's Create Integration Profile drawer, measured off the owner's screenshot
   (16 Oct 2026): 40% wide, 16px side inset, 18px title, labels 14px --neutral-light with the asterisk right after,
   7px label → field, 20px between rows, 32px between the two columns, no section headings (each label already names
   its group: Source Address, Destination Interface …), the mandatory note 14px in page text. The fields themselves
   (14px text, a visible --field-border-color edge) are set inside the components by the attachShadow hook. */
#pmAddDrawer .fa-pmf-form { gap: 20px; }
#pmAddDrawer .fa-pmf-form .fa-grid { column-gap: 32px; row-gap: 20px; }
#pmAddDrawer .fa-pmf-form .fa-field { gap: 7px; }
#pmAddDrawer .fa-field-label { color: var(--neutral-light); font-size: 14px; line-height: 18px; }
#pmAddDrawer .fa-field-label { gap: 2px; }
#pmAddDrawer .fa-field-label .fa-req { margin: 0; }
#pmAddDrawer .fa-pmf-form .fa-pmf-sec { display: none; }
#pmfFoot .fa-mandatory, #pmoFoot .fa-mandatory { font-size: 14px; color: var(--page-text-color); }
/* Firewall Inventory / Templates have no card frame: the toolbar runs flush with the table's edges (the DataGrid
   toolbar's own 16px side inset was for a panel), and the list sits on the page surface so the neutral pills and
   squares keep their fill in light theme (the settings pane behind is --neutral-lightest, their own fill colour). */
.fa-dp-list:has(.fa-dsg) { background: var(--page-background-color); }
.fa-fi-list .ds-dg { padding: 0 0 12px; }
obs-progress.fa-lic-bar, obs-progress.fa-lic-stack, obs-progress.fa-lic-track, obs-progress.fa-inv-bar,
.fa-tbl obs-progress.bar-track, .fa-if-pct obs-progress.bar-track { display: block; height: auto; background: none; border-radius: 0; overflow: visible; }
obs-progress.fa-lic-track { flex: 1 1 auto; }
/* the device-tab grids: a bounded flex column (height set by dsGridFit) — obs-table shrinks into it and scrolls its
   own body; a one-page table's pager (the G47 shim, the table's next sibling) sits at the foot */
.fa-dsg { display: flex; flex-direction: column; min-height: 0; }
.fa-dsg > obs-table { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
.fa-dsg > obs-pagination { flex: 0 0 auto; margin-top: auto; border-top: 1px solid var(--field-border-color); }
.fa-tbl .cell-bar obs-progress.bar-track { flex: 1 1 auto; min-width: 0; }
.fa-pt-pop obs-table.fa-pt-dist { display: block; }
/* Overview KPI row: six obs-kpi-card, one column each (the joined Disk · CPU · Memory card spanned three) */
.fa-grid.cols-6.fa-ov-tiles { grid-template-columns: repeat(6, minmax(0, 1fr)); }
obs-kpi-card.fa-ov-kpi { display: block; min-width: 0; --kpi-card-min-height: 150px; }
/* the firewall header card clipped the time-range picker's open panel to its own 61px (overflow:hidden on .fa-card) —
   the header lets it out and sits above the tabs and the tab body it opens over */
.fa-card.fa-dev-head { overflow: visible; position: relative; z-index: 5; }
/* the header is 61px whether or not this tab carries the 35px time-range picker (Flow · Logs · Policies Analytics do,
   the rest do not) — without it the tab row jumped 7px between tabs */
/* section.… outranks the later `.fa-card.fa-dev-head { min-height: 0 }` (same weight, later in the sheet) */
section.fa-card.fa-dev-head { box-sizing: border-box; min-height: 61px; display: flex; flex-direction: column; justify-content: center; }
/* Settings › Firewall Analyzer › Policies Management: the firewall picker that stands in for the firewall header */
/* the picker is the module's form-item shell (field(): the DS Form Field label above the control — obs-select ships no
   `label`), at the select's own width rather than the form column's */
.fa-pmset > .fa-field { display: inline-flex; flex-direction: column; }
/* Policies Management: the action is the last item of the grid toolbar (DataGrid's `after` slot) */
.ds-dg-after { display: inline-flex; align-items: center; margin-left: 4px; }
.ds-dg-after .fa-pm-bar { display: inline-flex; align-items: center; gap: 8px; padding: 0; margin: 0; border: 0; background: none; }
.ds-dg-after .fa-pm-bar .fa-spacer { display: none; }
/* Add Policy drawer: the read-only facts span both form columns; the section rules lean on the form's own 16px gap */
/* Add Policy / Add Object: the product form's rhythm (Create Integration Profile) — label 6px over its control, 16px
   between rows, a 24px gutter between the two columns, and a section heading 24px under the field above it */
.fa-pmf-form .fa-grid { column-gap: 16px; row-gap: 16px; }
.fa-pmf-form .fa-field { gap: 6px; }
.fa-pmf-form .fa-pmf-sec { margin-top: 8px; }
.fa-pmf-form .fa-dp-h3 { font-size: 16px; font-weight: 600; }
.fa-pmf-form .fa-field > obs-switch, .fa-pmf-form .fa-field > obs-checkbox { align-self: flex-start; display: inline-flex; align-items: center; min-height: var(--fa-input-height); }
.fa-req + .fa-mandatory, .fa-mandatory > .fa-req { margin: 0 2px 0 0; }
#pmfFoot, #pmoFoot { border-top: 0; }
.fa-fwset-tabs { display: block; margin-bottom: 16px; }
/* Compliance top row, like Flow's: the KPI card and the standards widget share one height */
.fa-grid.cols-3.fa-cmp-top { align-items: stretch; }
.fa-cmp-top > obs-kpi-card.fa-cmp-kpi { height: 100%; --kpi-card-min-height: 0; }
.fa-cmp-top > .fa-cmp-scw { height: 100%; }
.fa-mdh-tile { display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 4px;
  background: color-mix(in srgb, var(--page-text-color) 8%, transparent); color: var(--page-text-color); }
.fa-cmp-scw .fa-card-body { height: 100%; }
.fa-cmp-sc { display: flex; flex-direction: column; gap: 16px; height: 100%; }
.fa-cmp-sch { padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
.fa-cmp-sch { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--neutral-light); }
.fa-cmp-scb { flex: 1 1 auto; display: flex; align-items: center; justify-content: space-around; gap: 24px; }
.fa-cmp-g { zoom: 1.4; }
.fa-cmp-ml { flex: 0 1 auto; white-space: nowrap; }
.fa-cmp-stdw { grid-column: span 2; display: flex; flex-direction: column; min-width: 0; }
.fa-cmp-stdw > .fa-wc { flex: 1 1 auto; }
/* the Logs tree divider: ::before is the container's FIRST child, so the tree and the log columns painted over it and
   only the bits above and below them showed — lift it over them (pointer-events none, so nothing under it is blocked) */
.fa-logs.tree-on::before { z-index: 3; }
/* firewall cards: the trend runs the column's full width under its reading; the denied columns sit at the band's end */
/* the two halves are 50% INCLUDING their padding — content-box made them 2 × 32px wider than the card, so the
   right half's trend ran past the card's edge */
.fa-ovc-c { box-sizing: border-box; align-content: flex-start; }
.fa-ovc-c > obs-sparkline.fa-ovc-sp { flex: 0 0 100%; display: block; margin-top: 8px; min-width: 0; }
/* the column chart has a fixed width (ten 18px slots) — a flex basis under that let the bars overrun the caption.
   The caption sits under the count instead of beside it, so the count, its share and the columns each keep room */
.fa-ovc-e > obs-sparkline.fa-ovc-cols { flex: 0 0 180px; display: block; margin-left: auto; }
.fa-ovc:focus-visible { outline: 2px solid var(--primary-alt); outline-offset: 1px; }
.fa-ovc-ev { flex-direction: column; align-items: flex-start; gap: 4px; }
#pmfFoot .fa-mandatory, #pmoFoot .fa-mandatory { font-size: 14px; color: var(--page-text-color); }
/* OVERLAY HAND-OFF (owner, 16 Oct 2026: "the sidebar will open top to start and the sidebar and side menu will blur").
   Embedded, this page is a frame BELOW the host's header and RIGHT of its Settings list, so a drawer drawn here could
   neither start at the top of the screen nor blur the host's chrome. While a drawer or modal is open the host enlarges
   the frame to the whole window (and blurs itself behind it); this page then pins its own box back where the frame was
   (--faovl-*), with the canvas outside that box transparent so the host shows through. */
html.faovl { background: linear-gradient(transparent, transparent) !important; }  /* a bg image stops body's background propagating to the canvas */
html.faovl body { position: fixed; left: var(--faovl-l); top: var(--faovl-t); width: var(--faovl-w); height: var(--faovl-h); overflow: hidden; }
html.faovl .fa-shell { height: 100%; }
""" + t[k:]
    # the frame's half of the hand-off: report whether any drawer / modal dialog is open; apply the host's rect
    k2 = t.rindex('</body>')
    t = t[:k2] + """<script>/* FA-OVERLAY — see the html.faovl rules */
(function(){
  if (window.parent === window) return;
  var on = false, h = document.documentElement;
  function anyOpen(){ var els = document.querySelectorAll('obs-drawer, obs-modal');
    for (var i = 0; i < els.length; i++) { var d = els[i].shadowRoot && els[i].shadowRoot.querySelector('dialog'); if (d && d.open) return true; }
    return false; }
  setInterval(function(){ var a = anyOpen(); if (a !== on) { on = a; window.parent.postMessage({ faOverlay: a }, '*'); } }, 80);
  addEventListener('message', function(e){ var d = e.data; if (!d || !('faRect' in d)) return; var r = d.faRect;
    if (r) { h.style.setProperty('--faovl-l', r.l + 'px'); h.style.setProperty('--faovl-t', r.t + 'px');
      h.style.setProperty('--faovl-w', r.w + 'px'); h.style.setProperty('--faovl-h', r.h + 'px'); h.classList.add('faovl'); }
    else h.classList.remove('faovl');
    dispatchEvent(new Event('resize')); });
})();</script>
""" + t[k2:]
    # Agentation in the frame too (owner, 16 Oct 2026: "agentation is not working"). The parent page's widget cannot reach
    # inside an iframe, so every note left on a Firewall Analyzer screen went nowhere. Same dev-only loader and stacking fix
    # as the host pages (file:// / localhost only); the script is the folder root's shared copy.
    k3 = t.rindex('</body>')
    t = t[:k3] + """<script>/* AGENTATION (dev-only) */
(function () {
  var dev = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!dev || window.__faAgentation) return; window.__faAgentation = 1;
  var st = document.createElement('style');
  st.textContent = '[data-agentation-root] > *{z-index:2147483000 !important}'
    + '[data-agentation-root] > [class*="markersLayer" i]{z-index:2147483001 !important}'
    + '[data-agentation-root] > [class*="toolbar"]{z-index:2147483002 !important}'
    /* inside an open drawer / modal (see follow() below) the toolbar rides above the dialog's footer buttons */
    + ':is(obs-drawer, obs-modal) > [data-agentation-root] > [class*="toolbar"]{bottom:84px !important}';
  /* framed (setting.html / index.html): ONE toolbar on screen — the host hides its own while this frame is showing
     (owner, 16 Oct 2026: "show 2 agentation tools, fix the problem"), so this one keeps the normal corner */
  document.head.appendChild(st);
  var s = document.createElement('script'); s.src = '../agentation-embed.js'; s.defer = true; document.body.appendChild(s);
  /* An open obs-drawer / obs-modal is a MODAL <dialog>: the browser draws it in the top layer and makes everything outside
     it inert, so Agentation's toolbar sat under the drawer and could not be clicked (owner, 16 Oct 2026). While one is open,
     Agentation's root is moved into that dialog's light DOM (slotted into the dialog, so not inert, and still in this
     document, so its styles and events keep working); when none is open it goes back where it was mounted. A drawer that
     repaints its body drops the root, and the next tick puts it back. */
  (function follow() {
    var root = null, home = null;
    setInterval(function () {
      if (!root) { root = document.querySelector('[data-agentation-root]'); if (!root) return; home = root.parentNode; }
      var host = null;
      [].forEach.call(document.querySelectorAll('obs-drawer, obs-modal'), function (el) {
        var d = el.shadowRoot && el.shadowRoot.querySelector('dialog'); if (d && d.open) host = el; });
      var target = host || home;
      if (target && root.parentNode !== target) target.appendChild(root);
    }, 250);
  })();
})();
</script>
""" + t[k3:]
    return t


if MARK in t:
    t2 = pass2(t)
    if t2 == t:
        print('ds_pass: already applied'); sys.exit(0)
    open(P, 'w', encoding='utf-8').write(t2)
    print('ds_pass: stage 2 applied'); sys.exit(0)


def swap(start, end, new, label):
    """replace the text from `start` up to (not incl.) `end` — both must occur exactly once"""
    global t
    assert t.count(start) == 1, (label, 'start', t.count(start))
    i = t.index(start)
    j = t.index(end, i)
    t = t[:i] + new + t[j:]


# ── 1 · widget() → obs-widget-card ──────────────────────────────────────────────────────────
swap('function widget(title, bodyHtml, opts = {}) {', '/* plain card with no widget chrome',
'''function widget(title, bodyHtml, opts = {}) {
  ''' + MARK + '''
  /* obs-widget-card (DS) is the widget chrome now — its header strip, its kebab, its body. It has no
     slot for header actions, so a widget that carries its own button keeps it at the top of the body.
     `actions: ''` (the Flow pies) hides the card's kebab — the owner struck the widget menu there. */
  const custom = opts.actions != null && opts.actions !== '';
  const none = opts.actions === '';
  return `<obs-widget-card static class="fa-wc${opts.cls ? ' ' + opts.cls : ''}${none ? ' fa-wc-noacts' : ''}" title="${esc(title)}">
    ${custom ? `<div class="fa-wc-acts">${opts.actions}</div>` : ''}<div class="fa-card-body">${bodyHtml}</div>
  </obs-widget-card>`;
}

''', 'widget')

# ── 2 · stat() → obs-widget-card + obs-metric-list ───────────────────────────────────────────
swap('function stat(label, value, foot, spark) {', '/* obs-table `tags` cell payload',
'''function stat(label, value, foot, spark) {
  /* DS: the label is the card title, the figure an obs-metric-list row; the foot (icons, severity
     dots) stays as a line under it — metric-list renders text only */
  return `<obs-widget-card static class="fa-wc fa-wc-noacts fa-stat-wc" title="${esc(label)}">
    <obs-metric-list items='${j([[String(value), '', '']])}'></obs-metric-list>
    ${spark || ''}
    ${foot ? `<span class="fa-stat-foot">${foot}</span>` : ''}</obs-widget-card>`;
}

''', 'stat')

# ── 3 · kv() → obs-key-value when every value is plain text ─────────────────────────────────
swap('function kv(pairs) {', '/* ------------------------------------------------------------- app chrome */',
'''function kv(pairs) {
  /* obs-key-value renders TEXT. A pair list whose values carry obs-* markup (coloured tags, links)
     would lose them, so only an all-text list goes to the DS element; the rest keep the definition
     list (declared in gaps.json). Plain formatting (<b>, <code>, the muted span) is read as text. */
  /* a value that is ONE plain obs-tag (no variant, or tag-primary) is obs-key-value's own `status` item — the
     element renders it as an obs-tag (an unmapped status falls back to tag-primary), so it stays DS too */
  const ONE_TAG = /^\s*<obs-tag(?:\s+variant="tag-primary")?>([^<]*)<\/obs-tag>\s*$/;
  const rich = pairs.some(([, v]) => /<obs-/.test(String(v)) && !ONE_TAG.test(String(v)));
  if (!rich) {
    const tx = v => { const d = document.createElement('div'); d.innerHTML = String(v); return d.textContent.trim(); };
    return `<obs-key-value variant="plain" class="fa-kvds" items='${j(pairs.map(([k, v]) => {
      const m = String(v).match(ONE_TAG);
      return m ? { label: k, value: tx(m[1]), status: tx(m[1]) } : [k, tx(v)];
    }))}'></obs-key-value>`;
  }
  return `<dl class="fa-kv">${pairs.map(([k, v]) =>
    `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
}

''', 'kv')

# ── 4 · gridPager() → obs-pagination ─────────────────────────────────────────────────────────
swap('function gridPager(n) {', '/* --------------------------------------------------------------- Interfaces */',
'''function gridPager(n) {
  /* obs-pagination (DS). Every grid here holds one page at 50 a page, as before. */
  return `<obs-pagination class="fa-pager" total="${n}" page="1" page-size="50"></obs-pagination>`;
}

''', 'gridPager')

# the Devices grid drew the same pager inline
i = t.index('<table class="fa-tbl hs-tinted">\n        <thead><tr>${head}</tr></thead>\n        <tbody>${body}</tbody>\n      </table>\n    </div>\n    <div class="pager">')
k = t.index('<div class="pager">', i)
e = t.index('</span>\n    </div>\n  </div>`;', k) + len('</span>\n    </div>')
assert 'prange' in t[k:e]
t = t[:k] + '${gridPager(n)}' + t[e:]

# ── 5 · metricTile() → obs-widget-card + obs-metric-list / obs-gauge ─────────────────────────
swap('function metricTile(o) {', '/* 51 600 → "51.6 K"',
'''function metricTile(o) {
  /* DS: obs-widget-card carries the label; a percentage reading is an obs-gauge (value of 100, the
     severity once it would raise an alert, the same 70 / 85 rule as before); anything else is an
     obs-metric-list. `o.items` lets a tile hand over several rows (Interface Up / Down). */
  const sev = o.pct == null ? '' : o.pct >= 85 ? 'critical' : o.pct >= 70 ? 'warning' : 'clear';
  const body = o.pct != null
    ? `<obs-gauge value="${o.pct}" total="100" severity="${sev}" label="% used"></obs-gauge>`
    : `<obs-metric-list items='${j(o.items || [[String(o.value), o.unit || '', o.cap || '']])}'></obs-metric-list>`;
  return `<obs-widget-card static class="fa-wc fa-wc-noacts fa-mt-wc" title="${esc(o.label)}">
    ${o.sub ? `<span class="fa-mt-sub">${o.sub}</span>` : ''}${body}</obs-widget-card>`;
}

''', 'metricTile')

# the six Overview tiles now hand over plain values (metric-list renders text)
swap("${metricTile({ icon: 'interface', label: 'Interface',", '    </div>\n\n    <div class="fa-grid cols-3 fa-ov-avail">',
'''${(() => {
        /* Overview tiles on the DS stat card (13 Oct 2026): every tile is one obs-stat-card, so all six share the
           same three rows — label · value · footer — and line up across the row. A percentage reading draws the
           DS progress bar in its footer, amber from 70 % and red from 85 % (the rule the gauges used). */
        const sevOf = v => v >= 85 ? 'critical' : v >= 70 ? 'warning' : 'clear';
        /* like the Compliance KPI row (13 Oct 2026): a severity swatch on each label, the band as an obs-tag beside
           the value, the value coloured only once it is a problem, and the three utilisation readings JOINED into one
           card split by hairlines (Disk · CPU · Memory, as Critical … Info are). Zero / missing readings dim. */
        const BAND = { clear: ['Normal', 'tag-green'], warning: ['High', 'tag-yellow'], critical: ['Critical', 'tag-red'] };
        const tile = (items, cls = '') => `<obs-stat-card class="fa-ov-stat ${cls}" items='${j(items)}'></obs-stat-card>`;
        const total = up + down;
        const util = (label, v, extra = {}) => {
          if (v == null) return { label, value: '—', caption: 'no reading', dim: true };
          const sv = sevOf(v), [band, tv] = BAND[sv];
          return { label, severity: sv, value: `${v}%`, tag: band, tagVariant: tv, percent: v, barSeverity: sv,
                   ...(sv === 'clear' ? {} : { valueSeverity: sv }), ...extra };
        };
        return [
          tile([{ label: 'Interface', severity: down ? 'critical' : 'clear', value: `${up} / ${total}`,
                  caption: down ? `${down} down` : 'all up', ...(down ? { valueSeverity: 'critical' } : {}) }]),
          tile([{ label: 'Active Sessions', value: on ? fmtK(m.sessions) : '—', caption: 'active sessions' }]),
          tile([{ label: 'Response Time', value: on && m.resp != null ? `${m.resp} ms` : '—',
                  caption: `Lost packets: ${m.lost == null ? '—' : m.lost}` }]),
          tile([util('Disk', disk), util('CPU', on ? m.cpu : null), util('Memory', on ? m.mem : null)], 'fa-ov-util')
        ].join('');
      })()}
''', 'overview tiles')

# ── 6 · deviceTile() → obs-widget-card + obs-metric-list ─────────────────────────────────────
swap('function deviceTile(d) {', 'function deviceTiles() {',
'''function deviceTile(d) {
  const tp = gbps(d.throughput);
  const sess = devSessions(d.id), den = devDenies(d.id);
  const track = FS.OS_TRACKS[d.vendorKey] || {};
  /* DS: obs-widget-card (the name is its title) over a joined obs-stat-card of the three readings. The
     host keeps `fa-tile` + data-dev, so a click anywhere on the card still routes; the obs-link is the
     keyboard path to the same place. */
  /* card view, improved on the DS (13 Oct 2026): ONE frame — the widget card; the stat card inside it is frameless and
     runs edge to edge under a hairline (it drew a second border inside the first). Every column carries a caption so
     the three line up row for row; Denied reads as a share of the sessions it was counted from. "Open" is the DS
     icon-only chevron button — the same action, quieter than a text link beside the status. */
  const denPct = sess ? Math.round(den / sess * 1000) / 10 : 0;
  return `<obs-widget-card static class="fa-wc fa-wc-noacts fa-wc-flush fa-tile" data-dev="${esc(d.id)}" title="${esc(d.name)}">
    <div class="fa-tile-id">
      <obs-severity severity="${esc(d.status)}" shape="dot"></obs-severity>
      <span class="fa-tile-st">${esc(STATUS_LABEL[d.status] || d.status)}</span>
      <obs-tag variant="tag-unknown">${esc(track.label || d.vendor)}</obs-tag>
      <span class="fa-spacer"></span>
      <obs-tooltip placement="left"><obs-button slot="trigger" variant="transparent" squared data-dev1="${esc(d.id)}"
        aria-label="Open ${esc(d.name)}"><obs-icon name="chevron-right" size="14"></obs-icon></obs-button>Open firewall</obs-tooltip>
    </div>
    <obs-stat-card class="fa-tile-stats" items='${j([
      { label: 'Throughput', value: tp ? tp.toFixed(2) : '—', caption: 'Gbps' },
      { label: 'Sessions', value: sess.toLocaleString('en-US'), caption: 'last 24 hours' },
      { label: 'Denied sessions', value: den.toLocaleString('en-US'), valueSeverity: den ? 'critical' : '',
        caption: den ? denPct + '% of sessions' : 'none denied' }
    ])}'></obs-stat-card>
  </obs-widget-card>`;
}

''', 'deviceTile')


# ── 7 · section.fa-card + a title-only obs-toolbar(widget) → obs-widget-card ─────────────────
# The module had TWO widget chromes once widget() moved to obs-widget-card. Where the toolbar holds
# nothing but the title (or the inert kebab, or the product's "[No Data]" marker) the section becomes
# an obs-widget-card as well; a toolbar carrying real controls (switches, export icons, pills) stays —
# obs-widget-card has no slot for them, and obs-toolbar is itself the DS widget header.
KEBAB = re.compile(r'<obs-button variant="transparent" square aria-label="Widget actions"[^>]*>\s*<obs-icon name="ellipsis-v" size="14"></obs-icon>\s*</obs-button>')
NODATA = '<span class="fa-nodata">[No Data]</span>'
def classify(acts):
    a = KEBAB.sub('', acts.replace('<span class="fa-spacer"></span>', '')).strip()
    kebab = bool(KEBAB.search(acts))
    if a == '': return ('', kebab)
    if a == NODATA: return (NODATA, kebab)
    return None
ai = t.index('<script type="module">/* app.js */'); ae = t.index('</script>', ai)
app = t[ai:ae]
SEC = re.compile(r'<section class="fa-card([^"]*)"([^>]*)>(\s*\$\{/\*[\s\S]*?\*/\'\'\})?\s*<obs-toolbar variant="widget" title="([^"]*)">([\s\S]*?)</obs-toolbar>')
out, pos, n7 = [], 0, 0
for m in SEC.finditer(app):
    if m.start() < pos: continue
    c = classify(m.group(5))
    if c is None: continue
    # the matching </section>, counting nested sections
    depth, k = 1, m.end()
    while depth:
        o = app.find('<section', k); cl = app.find('</section>', k)
        if o != -1 and o < cl: depth += 1; k = o + 8
        else: depth -= 1; k = cl + 10
    close = k - 10
    cls = m.group(1); attrs = m.group(2)
    inner = app[m.end():close]
    flush = ' fa-wc-flush' if re.search(r'faGrid\(|stdGridHost\(|<obs-table', inner) else ''
    head = f'<obs-widget-card static class="fa-wc{"" if c[1] else " fa-wc-noacts"}{flush}{cls}"{attrs} title="{m.group(4)}">'
    if c[0]: head += f'<div class="fa-wc-nodata">{c[0]}</div>'
    out.append(app[pos:m.start()]); out.append(head); out.append(app[m.end():close]); out.append('</obs-widget-card>')
    pos = close + 10; n7 += 1
out.append(app[pos:])
app = ''.join(out)
# panel(`<obs-toolbar variant="widget" ...`) — decided at runtime, same rule
old_panel = """function panel(bodyHtml, cls = '') {
  return `<section class="fa-card ${cls}">${bodyHtml}</section>`;
}"""
assert app.count(old_panel) == 1
app = app.replace(old_panel, """function panel(bodyHtml, cls = '') {
  /* DS pass: a panel that opens with a title-only widget toolbar is an obs-widget-card */
  const m = /^\\s*<obs-toolbar variant="widget" title="([^"]*)">([\\s\\S]*?)<\\/obs-toolbar>/.exec(bodyHtml);
  if (m) {
    const kebab = /aria-label="Widget actions"/.test(m[2]);
    const a = m[2].replace(/<span class="fa-spacer"><\\/span>/g, '')
      .replace(/<obs-button variant="transparent" square aria-label="Widget actions"[^>]*>\\s*<obs-icon name="ellipsis-v" size="14"><\\/obs-icon>\\s*<\\/obs-button>/g, '').trim();
    const flush = /<obs-table|fa-tbl-wrap|ds-dg/.test(bodyHtml) ? ' fa-wc-flush' : '';
    if (a === '' || a === '<span class="fa-nodata">[No Data]</span>')
      return `<obs-widget-card static class="fa-wc${kebab ? '' : ' fa-wc-noacts'}${flush} ${cls}" title="${m[1]}">${
        a ? `<div class="fa-wc-nodata">${a}</div>` : ''}${bodyHtml.slice(m[0].length)}</obs-widget-card>`;
  }
  return `<section class="fa-card ${cls}">${bodyHtml}</section>`;
}""")
t = t[:ai] + app + t[ae:]
print('sections converted:', n7)


# ── 8 · the firewall's tab row reads like the Alert module's (13 Oct 2026) ──────────────────
# Alert's row sits flush under the page header, its tabs start on the header content's left edge,
# and a full-width hairline runs under the strip. obs-tabs' DEFAULT variant draws that hairline
# (`no-border` was hiding it); the rest is two tokens and the stack's gap taken back.
old_tabs = '<obs-tabs id="devTabs" variant="no-border" value='
assert t.count(old_tabs) == 1, 'devTabs'
t = t.replace(old_tabs, '<obs-tabs id="devTabs" value=')

# ── CSS: lay the DS elements out where the hand-built ones were ─────────────────────────────
css = '''
/* FA DS pass (13 Oct 2026) — layout only; the elements bring their own look */
obs-widget-card.fa-wc { display: block; min-width: 0; }
.fa-wc + .fa-wc, .fa-card + .fa-wc, .fa-wc + .fa-card { margin-top: var(--fa-padding-md); }
.fa-grid > .fa-wc + .fa-wc, .fa-stack > .fa-wc + .fa-wc, .fa-flow-pair > .fa-wc + .fa-wc,
.fa-logs-main > .fa-wc + .fa-wc, .fa-usr-sec > .fa-wc + .fa-wc,
.fa-grid > .fa-card + .fa-wc, .fa-grid > .fa-wc + .fa-card,
.fa-stack > .fa-card + .fa-wc, .fa-stack > .fa-wc + .fa-card { margin-top: 0; }
.fa-flow-pair > .fa-wc { min-width: 0; }
/* the card's own body pads 10/12/14; the old inner body padding would double it */
.fa-wc > .fa-card-body { padding: 0; }
.fa-wc-acts { display: flex; justify-content: flex-end; margin-bottom: var(--fa-padding-xs); }
.fa-mt-wc .fa-mt-sub, .fa-stat-wc .fa-stat-foot { display: flex; align-items: center; gap: 4px;
  font-size: var(--fa-text-xs); color: var(--neutral-light); margin-bottom: 4px; }
.fa-stat-wc .fa-stat-foot { margin: 4px 0 0; }
.fa-mt-wc obs-gauge { display: block; margin: 2px auto 0; width: max-content; }
obs-widget-card.fa-tile { cursor: pointer; background: none; border: 0; border-radius: 0; overflow: visible; }
.fa-tiles > .fa-wc + .fa-wc, .fa-cs > .fa-wc + .fa-wc { margin-top: 0; }
.fa-tile-id { display: flex; align-items: center; gap: var(--fa-padding-xs); margin-bottom: 0; padding: 8px 10px;
  font-size: var(--fa-text-sm); color: var(--neutral-light); }
obs-stat-card.fa-ov-stat { display: block; min-width: 0; }
.fa-grid.cols-6.fa-ov-tiles > .fa-ov-util { grid-column: span 3; }
.fa-grid.cols-6.fa-ov-tiles { grid-template-columns: repeat(6, minmax(0, 1fr)); }
obs-stat-card.fa-tile-stats { display: block; margin-top: 0; border-top: 1px solid var(--border-color); }
.fa-tile-id .fa-tile-st { color: var(--page-text-color); }
/* firewall detail header: flat on the page like the other modules' detail pages (SLO) — no raised card,
   a hairline under it, the module tabs straight below */
.fa-card.fa-dev-head { background: none; border: 0; border-bottom: 1px solid var(--border-color); border-radius: 0;
  box-shadow: none; min-height: 0; padding: 0 0 var(--fa-padding-xs); margin: calc(-1 * var(--fa-padding-xs)) 0 0; }
/* estate toolbar (search · Filter · Card/List): no box behind it — it sits on the page like the header */
.fa-card.fa-dev-bar { background: none; border: 0; border-radius: 0; box-shadow: none; overflow: visible; }
/* the view-switch tooltip opens to the LEFT over Filter / Export — lift it above its toolbar siblings */
obs-tooltip:has(> .fa-vbtn) { position: relative; z-index: 10; }
/* estate list: no card around the grid — the product inventory grid sits straight on the page */
.fa-card:has(#tblDevices) { background: none; border: 0; border-radius: 0; box-shadow: none; overflow: visible; }
.fa-dev-legend { display: block; margin-top: var(--fa-padding-xs); }
/* a Standard Grid in a widget card: the table and its pager line up with the search bar above (.ds-dg pads 16px) */
.fa-wc .fa-std-grid ~ .fa-tbl-wrap, .fa-wc .fa-std-grid ~ obs-pagination.fa-pager { margin-left: 16px; margin-right: 16px; }
.fa-wc .fa-std-grid ~ obs-pagination.fa-pager { margin-bottom: 8px; }
.fa-pager { padding: 0 var(--fa-padding-xs); }
.fa-wc-nodata { margin-bottom: var(--fa-padding-xs); }
/* BACKGROUND (13 Oct 2026, "fix the background"): in dark the page, every card section and the DS card's title
   strip were all #172336, so a card's header melted into the page. The product's dark dashboard is three steps —
   page --page-background-color #07101f · widget --widget-background #0b1627 · title strip
   --code-tag-background-color #172336 — so the module's two surface tokens are re-pointed onto those, dark only
   (light already reads as page / white card). */
html[data-theme="dark-theme"] body { --common-main-bg: var(--page-background-color); --common-widget-bg: var(--widget-background); }
/* the tab row: flush under the header's hairline, tabs on the header content's left edge, its own rule under it */
#devTabs { --tabs-inset: var(--fa-padding-md); margin-top: calc(-1 * var(--fa-padding-md)); }
.fa-flow-pair > .fa-wc + .fa-wc { margin-top: 0; }
/* A GRID CARD runs its grid edge to edge, and its title, search box, pills, header text, cell text and
   pager share ONE left edge: the title strip's own 10px (+1px card border). Reference: the product's
   grid widget (title strip · search · rule-topped header · rows). */
.fa-wc-flush { --fa-wc-x: 10px; }
.fa-wc-flush .ds-dg { padding: var(--fa-padding-xs) var(--fa-wc-x) var(--fa-padding-xs); gap: var(--fa-padding-xs); }
.fa-wc-flush > .fa-card-body { padding: var(--fa-padding-xs) var(--fa-wc-x); }
.fa-wc-flush .fa-tbl th:first-child, .fa-wc-flush .fa-tbl td:first-child { padding-left: var(--fa-wc-x); }
.fa-wc-flush .fa-tbl th:last-child, .fa-wc-flush .fa-tbl td:last-child { padding-right: var(--fa-wc-x); }
.fa-wc-flush .fa-tbl thead th { border-top: 1px solid var(--border-color); }
.fa-wc-flush obs-pagination, .fa-wc-flush .fa-pager { padding: 0 calc(var(--fa-wc-x) - 4px); }
.fa-wc-flush .fa-std-grid ~ .fa-tbl-wrap, .fa-wc-flush .fa-std-grid ~ obs-pagination.fa-pager { margin-left: 0; margin-right: 0; }
obs-key-value.fa-kvds { margin: 0 calc(-1 * var(--fa-padding-xs)); }
'''
assert t.count('/* prototype.css */') == 1
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + css + t[k:]

# ── view switch: one icon-only square obs-button that toggles cards ⇄ list (owner, 13 Oct 2026) ──
# Same two modes and the same [data-devview] click route as the source; only the icons and the pressed look change.
swap('function devViewToggle() {', '/* ====',
"""function devViewToggle() {
  const cur = devViewMode();
  /* ONE square icon-only obs-button showing the current view (DS icons: widgetView = cards, grid = list); a click
     flips to the other view and the icon follows. The [data-devview] router goes to the mode it carries. */
  const next = cur === 'card' ? 'list' : 'card';
  const icon = cur === 'card' ? 'widgetView' : 'grid';
  const label = cur === 'card' ? 'Switch to list view' : 'Switch to card view';
  /* left: the button is at the far right AND top of the scroll area — above it the page header covers the bubble,
     centred it runs off screen — so the bubble sits beside it */
  return `<obs-tooltip placement="left"><obs-button slot="trigger" squared class="fa-vbtn" variant="neutral-lightest"
      data-devview="${next}" aria-label="${esc(label)}"><obs-icon name="${icon}" size="16"></obs-icon></obs-button>${esc(label)}</obs-tooltip>`;
}

""", 'devViewToggle')

# ── shadow-root tweak: hide the kebab on cards that have no actions ─────────────────────────
# obs-widget-card exposes no ::part, so — as setting.js does for obs-* corners — one sheet is
# adopted into each card's shadow root as it is created. Scoped by HOST class: no other card changes.
hook = '''<script>/* FA DS pass — obs-widget-card has no ::part; a card marked .fa-wc-noacts drops its kebab */
(function(){var A=Element.prototype.attachShadow;if(A.__fa)return;var sh;
Element.prototype.attachShadow=function(o){var r=A.call(this,o);
 if(this.tagName==='OBS-COMMAND-PALETTE'){try{var cs=new CSSStyleSheet();cs.replaceSync(':host(.fa-qwide) .cp{max-width:none}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[cs]);}catch(e){}}
 if(this.tagName==='OBS-STAT-CARD'){try{var sc=new CSSStyleSheet();sc.replaceSync(':host(.fa-tile-stats) .card{border:0;border-radius:0;background:transparent}:host(.fa-tile-stats) .cell{padding:12px 10px 14px}:host(.fa-cmp-stats) .cell:first-child{padding-left:0}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[sc]);}catch(e){}}
 if(this.tagName==='OBS-TABLE'){try{var ts=new CSSStyleSheet();ts.replaceSync(':host(.fa-tblrule) thead th{box-shadow:inset 0 1px 0 var(--border-color)}:host(.fa-tblx) thead th:first-child,:host(.fa-tblx) tbody td:first-child{padding-left:0}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[ts]);}catch(e){}}
 if(this.tagName==='OBS-WIDGET-CARD'){try{if(!sh){sh=new CSSStyleSheet();sh.replaceSync('.wcard{background:var(--widget-background,var(--page-background-color))}:host(.fa-wc-noacts) .wactions{display:none}:host(.fa-wc-flush) .wbody{padding:0}');}
  r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[sh]);}catch(e){}}return r;};
Element.prototype.attachShadow.__fa=1;})();</script>
'''
assert t.count('<head>\n') == 1
t = t.replace('<head>\n', '<head>\n' + hook, 1)

# ── estate search: the DS toolbar's search field (obs-toolbar grid example) — placeholder "Search"; the old
# "Search firewalls, sites, vendors…" was cut off by the 240px field ──
old_s = 'placeholder="Search firewalls, sites, vendors…"'
assert t.count(old_s) == 1, ('estate search', t.count(old_s))
t = t.replace(old_s, 'placeholder="Search"', 1)

# ── estate column chooser: the DS default (eye trigger, no heading, search box from the DS's auto rule) — the
# source overrode the icon with "columns" and added a COLUMNS heading ──
old_c = 'trigger="icon" trigger-icon="columns" heading="COLUMNS" reset-label="Reset column preference"'
assert t.count(old_c) >= 1, ('column chooser', t.count(old_c))
t = t.replace(old_c, 'trigger="icon" reset-label="Reset Column Preference"')

# ── Export: out of the page header, into the estate toolbar right after Filter (owner, 13 Oct 2026) ──
EXP = '<obs-button variant="default" id="btnExport"><obs-icon name="export-pdf" size="14"></obs-icon>&nbsp;Export</obs-button>'
assert t.count(EXP) == 1, ('header export', t.count(EXP))
t = t.replace(EXP, '', 1)
FA = "fields='${j(filterFields)}'></obs-filters>"
assert t.count(FA) == 1, ('estate filters', t.count(FA))
# icon-only, the DS toolbar's icon-button pattern (obs-toolbar example: neutral-lightest + squared + aria-label)
EXP_ICON = ('<obs-tooltip placement="bottom"><obs-button slot="trigger" variant="neutral-lightest" squared id="btnExport" '
            'aria-label="Export"><obs-icon name="export-pdf" size="14"></obs-icon></obs-button>Export</obs-tooltip>')
t = t.replace(FA, FA + '\n        ' + EXP_ICON, 1)

# ── estate list: the hand-built <table class="fa-tbl"> + hand-drawn pager → obs-table (DS). Same nine columns, same
# order and sort keys; the Monitor column is the DS `severity` cell (status dot + name, the primary column), Groups /
# Tags are `tags` chips, sorting and the pager are the table's own. id="tblDevices" keeps INSPECTORS' row-click →
# deviceDrawer (bindTables). A refresh (signal change) swaps the rows in place, so the binding survives. ──
swap('function devicesTableHtml() {', 'function screenDevices() {',
"""/* Status as the product inventory grid shows it: a coloured status chip (DS obs-tag colours by health) */
const STATUS_TAG = { up: 'tag-green', warning: 'tag-yellow', critical: 'tag-red', down: 'tag-red', unreachable: 'tag-purple' };
function devRowsDs() {
  return sortedDevices().map(d => {
    const inv = invRowOf(d);
    return {
      id: d.id, name: d.name, sev: d.status, ip: d.mgmt, vendor: VENDOR_NAME[d.vendorKey] || d.vendor,
      groups: inv.groups.map(g => ({ label: g, variant: 'tag-green' })),
      tags: inv.tags.map(t => ({ label: t, variant: 'tag-unknown' })),
      rules: polledRules(d) ?? '—', objects: polledObjects(d) ?? '—', alerts: deviceAlerts(d).length,
      status: [{ label: STATUS_LABEL[d.status] || d.status, variant: STATUS_TAG[d.status] || 'default' }]
    };
  });
}
function devicesTableHtml() {
  const type = { name: 'severity', groups: 'tags', tags: 'tags', status: 'tags' };
  /* the name and the group chip never truncate / wrap; the short columns get a smaller floor than obs-table's
     132px default, so all nine fit the page without a sideways scroll */
  const width = { name: '170px', groups: '170px' };
  const minW = { ip: 110, vendor: 110, tags: 140, rules: 100, objects: 100, alerts: 150, status: 120 };
  const cols = DEV_COLS.map(c => ({ key: c.key, title: c.title, sortable: !!c.sortable,
    ...(type[c.key] ? { type: type[c.key] } : {}), ...(c.key === 'name' ? { primary: true } : {}), ...(width[c.key] ? { width: width[c.key] } : {}), ...(minW[c.key] ? { minWidth: minW[c.key] } : {}) }));
  /* numbers stay left-aligned like the product inventory grid; the health legend explains the dots */
  return `<obs-table id="tblDevices" page-size="50" columns='${j(cols)}' rows='${j(devRowsDs())}'></obs-table>
    <obs-severity-legend class="fa-dev-legend" levels="up,warning,critical,unreachable"></obs-severity-legend>`;
}

function refreshDevicesTable() {
  const t = $('#tblDevices');
  if (t) t.setAttribute('rows', JSON.stringify(devRowsDs()));
}

""", 'devicesTable')
old_ref = """function refreshDevicesTable() {
  const host = $('#tblDevices');"""
assert t.count(old_ref) == 1, ('old refresh', t.count(old_ref))
# the source's own refresh (rebuilt the hand table's outerHTML) is renamed out of the way; the one above wins
t = t.replace(old_ref, """function _refreshDevicesTableOld() {
  const host = $('#tblDevices');""", 1)

# ── firewall tabs: names only, no icons (owner, 13 Oct 2026) — the obs-tabs items drop their `icon` ──
old_tabs = "return DEVICE_TABS.map(t => ({ ...t }));"
assert t.count(old_tabs) == 1, ('device tabs', t.count(old_tabs))
t = t.replace(old_tabs, "return DEVICE_TABS.map(({ icon, ...t }) => ({ ...t }));", 1)

# ── shared data-grid toolbar (ds/shared/data-grid.js — every Standard Grid in the module): its filter / export
# icon buttons take the DS toolbar's icon-button pattern (neutral-lightest + squared), matching the column eye
# (obs-select column mode, same look in the DS); the table + pager under the bar get the bar's 16px inset ──
old_ib = """<obs-button slot="trigger" variant="transparent" square
        data-dg="${key}\""""
assert t.count(old_ib) == 1, ('data-grid icon', t.count(old_ib))
t = t.replace(old_ib, """<obs-button slot="trigger" variant="neutral-lightest" squared
        data-dg="${key}\"""", 1)

# ── Interface widgets read like the product's Interface tab (13 Oct 2026, "improve like" + the product's screen):
# no pager under the grid; the search box stays (re-added on request); the action icons stay (Filter · Export PDF · CSV · Excel · the eye —
# "don't remove the action", 13 Oct 2026); headers in the product's uppercase on a plain header row; rows on the card surface.
old_mg = "    search: opts.search,\n    before: opts.before,"
assert t.count(old_mg) == 1, ('mountStdGrid', t.count(old_mg))
t = t.replace(old_mg, "    search: opts.search,\n    exports: opts.exports,\n    filterActive: opts.filterActive,\n    before: opts.before,", 1)
old_fi = "${icon('filter', 'filter', 'Filter')}"
assert t.count(old_fi) == 1, ('dg filter icon', t.count(old_fi))
t = t.replace(old_fi, "${api.filterActive ? icon('filter', 'filter', 'Filter').replace('variant=\"neutral-lightest\"', 'variant=\"primary\"') : icon('filter', 'filter', 'Filter')}", 1)
for g, tb in (('ifoGrid', 'tblInterfaces'), ('ifpGrid', 'tblIfPerf')):
    o = f"mountStdGrid('{g}', {{ columns: {'IFO' if g == 'ifoGrid' else 'IFP'}_COLS, table: '{tb}',"
    assert t.count(o) == 1, (g, t.count(o))
    pass   # search kept ("also add search option", 13 Oct 2026) — the toolbar's own search box, as every Standard Grid has
    o2 = f"static: true, gridId: '{g}' }})"
    assert t.count(o2) == 1, (g, 'faGrid', t.count(o2))
    t = t.replace(o2, f"static: true, gridId: '{g}', pager: false }})", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Interface widgets — the product's Interface tab grid */
#tblInterfaces .fa-tbl-box, #tblIfPerf .fa-tbl-box { background: transparent; }
#tblInterfaces .fa-tbl.hs-tinted thead th, #tblIfPerf .fa-tbl.hs-tinted thead th {
  background: var(--widget-background, var(--page-background-color)); text-transform: uppercase;
  font-weight: 600; letter-spacing: .02em; color: var(--page-text-color); border-top: 0; border-bottom: 0;
  /* a rule ABOVE and below the title row (13 Oct 2026). Inset shadows, not borders: the header is sticky inside a
     border-collapse table, and a collapsed border does not travel with a stuck cell. */
  box-shadow: inset 0 1px 0 var(--border-color), inset 0 -1px 0 var(--border-color); }
#tblInterfaces .fa-tbl td, #tblIfPerf .fa-tbl td { padding-top: 11px; padding-bottom: 11px; }
#ifoGrid .ds-dg, #ifpGrid .ds-dg { gap: 4px; padding-bottom: 8px; }
""" + t[k:]

# ── Policies Analytics reads like the product's grid page (13 Oct 2026, "improve like"): flat on the page (no card
# frame), the toolbar's search reads "Search", headers uppercase between two rules, rows on the page surface, every
# column left-aligned, no pager. Same header treatment as the Interface widgets above.
o = "static: true, gridId: 'polGrid' })"
assert t.count(o) == 1, ('polGrid faGrid', t.count(o))
t = t.replace(o, "static: true, gridId: 'polGrid', pager: false })", 1)
o = "table: 'tblRules', search: 'Search policies',"
assert t.count(o) == 1, ('polGrid search', t.count(o))
t = t.replace(o, "table: 'tblRules', search: 'Search',", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Policies Analytics — flat grid page */
.fa-card:has(> #polGrid) { background: none; border: 0; border-radius: 0; }
#polGrid .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
#tblRules .fa-tbl-box { background: transparent; }
#tblRules .fa-tbl.hs-tinted thead th {
  background: var(--page-background-color); text-transform: uppercase; font-weight: 600; letter-spacing: .02em;
  color: var(--page-text-color); border-top: 0; border-bottom: 0;
  box-shadow: inset 0 1px 0 var(--border-color), inset 0 -1px 0 var(--border-color); }
#tblRules .fa-tbl td { padding-top: 11px; padding-bottom: 11px; }
#tblRules .fa-tbl th:first-child, #tblRules .fa-tbl td:first-child { padding-left: 8px; }
#tblRules .fa-tbl .al-right { text-align: left; }
""" + t[k:]

# ── Users reads the same way (13 Oct 2026, "improve like"): flat page, "Search", obs-table's own plain uppercase
# header (header-style="default") with a rule above it, numbers left-aligned like the reference grid.
o = '<obs-table id="tblFwUsers" header-style="tinted"'
assert t.count(o) == 1, ('tblFwUsers', t.count(o))
t = t.replace(o, '<obs-table id="tblFwUsers" class="fa-tblrule" header-style="default"', 1)
ui = t.index('USR_COLS = [')
ue = t.index('];', ui)
seg = t[ui:ue].replace(", align: 'right', width: 120 }", ", width: 120 }").replace(", align: 'right', width: 140 }", ", width: 140 }")
assert "align: 'right'" not in seg, 'USR_COLS align'
t = t[:ui] + seg + t[ue:]
o = "table: 'tblFwUsers',\n    search: 'Search users',"
assert t.count(o) == 1, ('usr search', t.count(o))
t = t.replace(o, "table: 'tblFwUsers',\n    search: 'Search',", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Users — flat grid page */
.fa-card:has(> #usrGrid) { background: none; border: 0; border-radius: 0; }
#usrGrid .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
""" + t[k:]

# ── Policies Management reads the same way (13 Oct 2026, "improve like"): all four views (Policies · Objects · NAT
# Policies · Policy and Object Status) flat on the page, the toolbar's search reads "Search", obs-table's plain uppercase
# header with a rule above it, Policy ID left-aligned. The view switch, Add Policy and the row ⋮ stay.
for tid in ('tblPmRules', 'tblPmNat', 'tblPmStatus', '${table}'):
    seg_i = t.index('<obs-table id="' + tid + '"')
    seg_e = t.index('>', t.index('header-style="tinted"', seg_i))
    seg = t[seg_i:seg_e]
    t = t[:seg_i] + seg.replace('<obs-table id="' + tid + '"', '<obs-table id="' + tid + '" class="fa-tblrule"', 1).replace('header-style="tinted"', 'header-style="default"', 1) + t[seg_e:]
o = "{ key: 'seq', title: 'Policy ID', width: 90, align: 'right', fixed: true }"
assert t.count(o) == 1, ('seq col', t.count(o))
t = t.replace(o, "{ key: 'seq', title: 'Policy ID', width: 90, fixed: true }", 1)
for o in ("search: 'Search policies, objects, ports, CIDRs…'", "search: 'Search objects'",
          "search: 'Search NAT policies'", "search: 'Search changes'"):
    assert t.count(o) == 1, (o, t.count(o))
    t = t.replace(o, "search: 'Search'", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Policies Management — flat grid page, all four views */
.fa-card:has(> :is(#pmRulesGrid, #pmObjGrid, #pmNatGrid, #pmStatusGrid)) { background: none; border: 0; border-radius: 0; }
:is(#pmRulesGrid, #pmObjGrid, #pmNatGrid, #pmStatusGrid) .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
""" + t[k:]

# ── Configuration reads the same way (13 Oct 2026, "improve like"): flat page, "Search", uppercase headers between two
# rules, rows on the page surface, no pager — the Policies Analytics treatment, on the same light-DOM grid.
o = "static: true, gridId: 'cfgGrid' })"
assert t.count(o) == 1, ('cfgGrid faGrid', t.count(o))
t = t.replace(o, "static: true, gridId: 'cfgGrid', pager: false })", 1)
o = "search: 'Search configuration'"
assert t.count(o) == 1, ('cfg search', t.count(o))
t = t.replace(o, "search: 'Search'", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Configuration — flat grid page */
.fa-card:has(> #cfgGrid) { background: none; border: 0; border-radius: 0; }
#cfgGrid .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
#tblConfigs .fa-tbl-box { background: transparent; }
#tblConfigs .fa-tbl.hs-tinted thead th {
  background: var(--page-background-color); text-transform: uppercase; font-weight: 600; letter-spacing: .02em;
  color: var(--page-text-color); border-top: 0; border-bottom: 0;
  box-shadow: inset 0 1px 0 var(--border-color), inset 0 -1px 0 var(--border-color); }
#tblConfigs .fa-tbl td { padding-top: 11px; padding-bottom: 11px; }
#tblConfigs .fa-tbl th:first-child, #tblConfigs .fa-tbl td:first-child { padding-left: 8px; }
""" + t[k:]

# ── Logs reads like the product's Log Search (13 Oct 2026, "improve like" + the live Log Search screen): no boxes —
# the query bar, the histogram and the results sit flat on the page, split by hairlines; the source tree is a column
# with a rule on its right; the event grid takes obs-table's plain uppercase header (TIMESTAMP · MESSAGE) with a rule
# above it, and the timestamp reads in the numeric font as the product's does.
o = '<obs-table id="tblEvents" header-style="tinted"'
assert t.count(o) == 1, ('tblEvents', t.count(o))
t = t.replace(o, '<obs-table id="tblEvents" class="fa-tblrule" header-style="default"', 1)
o = '<obs-tabs id="logResultTabs" variant="grey"'
assert t.count(o) == 1, ('logResultTabs', t.count(o))
t = t.replace(o, '<obs-tabs id="logResultTabs" variant="no-border"', 1)   # plain tabs, as the product's Event Log | Log Pattern
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Logs — flat, like the product's Log Search */
.fa-logs-tree { background: none; border: 0; border-right: 1px solid var(--border-color); border-radius: 0; }
.fa-logs-main > .fa-card { background: none; border: 0; border-radius: 0; }
.fa-logs-main > .fa-card:not(.fa-res) { border-bottom: 1px solid var(--border-color); }
.fa-logs-main .fa-qbar { padding: 0 0 var(--fa-padding-sm); }
.fa-logs-main .fa-log-hist .fa-card-body { padding: 0 0 var(--fa-padding-xs); }
.fa-logs-main .fa-res-h { padding: 0; }
.fa-logs-main .fa-facets-h { padding-left: 0; }
""" + t[k:]

# ── Active Alerts reads like the product's Active Alerts tab (13 Oct 2026, "improve like"): flat page, "Search",
# uppercase headers between two rules, rows on the page surface. The pager stays (the product's keeps it).
o = "search: 'Search alerts'"
assert t.count(o) == 1, ('al search', t.count(o))
t = t.replace(o, "search: 'Search'", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Active Alerts — flat grid page */
.fa-card:has(> #alGrid) { background: none; border: 0; border-radius: 0; }
#alGrid .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
#tblAlerts .fa-tbl-box { background: transparent; }
#tblAlerts .fa-tbl.hs-tinted thead th {
  background: var(--page-background-color); text-transform: uppercase; font-weight: 600; letter-spacing: .02em;
  color: var(--page-text-color); border-top: 0; border-bottom: 0;
  box-shadow: inset 0 1px 0 var(--border-color), inset 0 -1px 0 var(--border-color); }
#tblAlerts .fa-tbl td { padding-top: 8px; padding-bottom: 8px; }
#tblAlerts .fa-tbl th:first-child, #tblAlerts .fa-tbl td:first-child { padding-left: 8px; }
#tblAlerts .pager { border-top: 0; }
""" + t[k:]

# ── Configured Alert Policy reads the same way (13 Oct 2026, "improve like"): flat page, "Search",
# uppercase headers between two rules, rows on the page surface. The pager stays (the product's keeps it).
o = "search: 'Search alert policies'"
assert t.count(o) == 1, ('pc search', t.count(o))
t = t.replace(o, "search: 'Search'", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Configured Alert Policy — flat grid page */
.fa-card:has(> #pcGrid) { background: none; border: 0; border-radius: 0; }
#pcGrid .ds-dg { padding: 0 0 var(--fa-padding-xs); gap: 4px; }
#tblPolicies .fa-tbl-box { background: transparent; }
#tblPolicies .fa-tbl.hs-tinted thead th {
  background: var(--page-background-color); text-transform: uppercase; font-weight: 600; letter-spacing: .02em;
  color: var(--page-text-color); border-top: 0; border-bottom: 0;
  box-shadow: inset 0 1px 0 var(--border-color), inset 0 -1px 0 var(--border-color); }
#tblPolicies .fa-tbl td { padding-top: 8px; padding-bottom: 8px; }
#tblPolicies .fa-tbl th:first-child, #tblPolicies .fa-tbl td:first-child { padding-left: 8px; }
#tblPolicies .pager { border-top: 0; }
""" + t[k:]

# ── Compliance reads like the product's Log Search (13 Oct 2026, "improve like"): flat — the filter rail is a column
# with a rule on its right, the two widgets lose their card frame (title on a hairline, no fill), the controls grid sits
# flat on the page with obs-table's plain uppercase header between two rules.
o = '''  return `<div class="fa-stack">
    <div class="fa-grid cols-3">
      ${widget(`${std.label}'''
assert t.count(o) == 1, ('compliance stack', t.count(o))
t = t.replace(o, o.replace('<div class="fa-stack">', '<div class="fa-stack fa-flat">', 1), 1)
o = '''<obs-table id="tblControls" columns='${j(cols)}' rows='${j(rows)}' header-style="tinted"'''
assert t.count(o) == 1, ('tblControls', t.count(o))
t = t.replace(o, '''<obs-table id="tblControls" class="fa-tblrule fa-tblx" columns='${j(cols)}' rows='${j(rows)}' header-style="default"''', 1)
o = 'placeholder="Search controls…"'
assert t.count(o) == 1, ('controls search', t.count(o))
t = t.replace(o, 'placeholder="Search"', 1)
# obs-widget-card inside .fa-flat: no frame, title on a hairline (its shadow root, via the card hook)
o = ":host(.fa-wc-flush) .wbody{padding:0}"
assert t.count(o) == 1, ('wc hook', t.count(o))
t = t.replace(o, o + ":host-context(.fa-flat) .wcard{background:transparent;border:0;border-radius:0}"
                     ":host-context(.fa-flat) .whead{background:transparent;border-radius:0;border-bottom:1px solid var(--border-color);padding-left:0}"
                     ":host-context(.fa-flat) .wbody{padding-left:0;padding-right:0}", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Compliance — flat, like the product's Log Search */
.fa-dev-rail:has(.ds-fr) { background: none; border: 0; border-right: 1px solid var(--border-color); border-radius: 0; }
.fa-dev-rail .ds-fr { background: none; border: 0; border-radius: 0; }
.fa-flat .fa-card:has(#tblControls) { background: none; border: 0; border-radius: 0; }
.fa-flat .fa-card:has(#tblControls) > obs-toolbar { --toolbar-padding: 0 0 8px; }
/* (13 Oct 2026) the grid's first column starts on the search box's edge, 8px under the toolbar */
.fa-flat .fa-card:has(#tblControls) #tblControls { display: block; margin-top: 8px; }
""" + t[k:]

# ── Logs, same as the product's Log Search (13 Oct 2026, "same to same with proper alignment, don't remove any action"):
# the source tree is COLLAPSED behind a chevron at the far left of the top row (the product's own `>` before its tabs) —
# one click opens it, so nothing is lost; the query bar runs the full width with Execute at its end; the histogram is
# the product's tall chart; and every block starts on ONE left edge.
o = '''  return `<div class="fa-logs">
    ${logTreePane()}
    <div class="fa-logs-main">
      <div class="fa-logs-bar">
        <span class="fa-spacer"></span>'''
assert t.count(o) == 1, ('logs screen', t.count(o))
t = t.replace(o, '''  return `<div class="fa-logs${window.__faLogTree ? ' tree-on' : ''}">
    ${logTreePane()}
    <div class="fa-logs-main">
      <div class="fa-logs-bar">
        <obs-button variant="transparent" squared class="fa-logs-treebtn" aria-label="Log sources"
          onclick="if(Date.now()-(window.__faLT||0)<120)return;window.__faLT=Date.now();window.__faLogTree=!window.__faLogTree;document.querySelector('.fa-logs').classList.toggle('tree-on',window.__faLogTree)"><obs-icon name="chevron-right" size="14"></obs-icon></obs-button>
        <span class="fa-spacer"></span>''', 1)
o = '<obs-command-palette id="logQuery" block'
assert t.count(o) == 1, ('logQuery', t.count(o))
t = t.replace(o, '<obs-command-palette id="logQuery" class="fa-qwide" block', 1)   # full width (its .cp caps at 1100px)
o = "DSCharts.column(logHist(), { name: 'Matches', h: 128 })"
assert t.count(o) == 1, ('log hist', t.count(o))
t = t.replace(o, "DSCharts.column(logHist(), { name: 'Matches', h: 210 })", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Logs — the product's Log Search: tree collapsed by default, one left edge, full-width query bar */
.fa-logs { grid-template-columns: minmax(0, 1fr); gap: 0; }
.fa-logs > .fa-logs-tree { display: none; }
.fa-logs.tree-on { grid-template-columns: 264px minmax(0, 1fr); gap: var(--fa-padding-md); }
.fa-logs.tree-on > .fa-logs-tree { display: block; }
.fa-logs-treebtn obs-icon { transition: transform .15s; }
.fa-logs.tree-on .fa-logs-treebtn obs-icon { transform: rotate(180deg); }
.fa-logs-main { gap: var(--fa-padding-sm); }
.fa-logs-main .fa-qbar obs-command-palette { width: 100%; max-width: none; }
.fa-logs-main .fa-res-body { grid-template-columns: 290px minmax(0, 1fr); }
.fa-logs-main .fa-facets-h { padding-right: var(--fa-padding-sm); }
""" + t[k:]

# ── Overview availability on the DS's own Availability family (13 Oct 2026, "improve using the design system"):
# Today's Availability = obs-availability-donut, Availability Statistics = obs-availability-bars, each in a flush
# obs-widget-card — the DS registry's own pairing, "matched to the live product render". States keep their fixed
# --severity-<state> colours; the donut centre is always Up (product rule); durations feed the slice tooltips.
o_i = t.index('''${widget("Today's Availability", vizDonut(''')
o_e = t.index("${widget('Response Time vs. Packet Lost'", o_i)
t = t[:o_i] + '''${(() => {
        const st = v => { const down = Math.round((100 - v) * 10) / 10; return down > 0 ? { up: v, down } : { up: v }; };
        const dur = pct => { const m = Math.round(pct / 100 * 24 * 60); return `${Math.floor(m / 60)}h ${m % 60}m`; };
        const day = st(av.day);
        const durs = Object.fromEntries(Object.entries(day).map(([k, v]) => [k, dur(v)]));
        return widget("Today's Availability",
            `<obs-availability-donut class="fa-av-donut" values='${j(day)}' durations='${j(durs)}'></obs-availability-donut>`,
            { cls: 'fa-wc-flush fa-av' })
          + widget('Availability Statistics',
            `<obs-availability-bars class="fa-av-bars" rows='${j([
              { label: 'Last Day', values: st(av.day) },
              { label: 'Last 7 Days', values: st(av.d7) },
              { label: 'Last 15 Days', values: st(av.d15) }])}'></obs-availability-bars>`,
            { cls: 'fa-wc-flush fa-av' });
      })()}
      ''' + t[o_e:]
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Overview availability — DS Availability family */
.fa-av > .fa-card-body { display: flex; align-items: center; justify-content: center; min-height: 230px; padding: 12px 16px; }
obs-availability-bars.fa-av-bars { display: block; width: 100%; }
/* the grid toolbar's action icons (Filter · PDF · CSV · Excel · eye) 8px apart (13 Oct 2026) — every Standard Grid */
.ds-dg-bar { gap: 8px; }
/* 10px between neighbouring widgets, both axes (13 Oct 2026) — Overview, Flow, the estate cards, every stack */
.fa-grid, .fa-stack, .fa-flow-pair, .fa-tiles { gap: 10px; }
""" + t[k:]

# ── Flow, like the product's Flow Explorer dashboard (13 Oct 2026, "improve using /flow/dashboard"): read off the live
# build — each pie (1/3) beside its summary grid (2/3); the summary's search is a FIXED 288px field, not a full-width bar;
# the grid header is the plain UPPERCASE one (transparent, 600, a rule under it), 12px cells; widget title strip as is.
n = t.count('header-style="tinted" sortable="false"')
for tid in ('tblFlow-${key}', 'tblFlowConv', 'tblFlowIface'):
    o = f'<obs-table id="{tid}" header-style="tinted"'
    assert t.count(o) == 1, (tid, t.count(o))
    t = t.replace(o, f'<obs-table id="{tid}" header-style="default"', 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Flow — the product's Flow Explorer dashboard: a fixed-width search above each summary grid */
.fa-flow-search obs-input { display: block; width: 288px; max-width: 100%; }
.fa-wc > .fa-card-body.fa-flow-search, .fa-wc-flush > .fa-card-body.fa-flow-search { padding: 8px 10px; }
""" + t[k:]

# ── Logs, matched to the product's Log Search (13 Oct 2026, "improve using /log/search"): read off the live build —
# the event list is DENSE (12px cells, 4px vertical padding) with a two-button row-density toggle at the right end of
# the results header; the attribute panel's search reads plain "Search". The List·Chart·Grid·Top N·Gauge strip the
# live page also carries is NOT restored: the owner removed it on 2026-09-16 (see the note at logResultsHeader).
o = '''    <obs-button variant="default" id="logSaveReport"><obs-icon name="save" size="14"></obs-icon>&nbsp;Save as Report</obs-button>
  </div>`;'''
assert t.count(o) == 1, ('log results header', t.count(o))
t = t.replace(o, '''    <obs-button variant="default" id="logSaveReport"><obs-icon name="save" size="14"></obs-icon>&nbsp;Save as Report</obs-button>
    <span class="fa-dens" role="group" aria-label="Row density">${[['compact', 'bars', 'Compact rows'], ['comfy', 'list', 'Comfortable rows']].map(([k, ic, l]) =>
      `<obs-tooltip placement="top"><obs-button slot="trigger" variant="${(window.__faLogDens || 'compact') === k ? 'primary' : 'default'}" square
        aria-label="${l}" aria-pressed="${(window.__faLogDens || 'compact') === k}"
        onclick="if(Date.now()-(window.__faLD||0)<120)return;window.__faLD=Date.now();window.__faLogDens='${k}';refreshLogs()"><obs-icon name="${ic}" size="14"></obs-icon></obs-button>${l}</obs-tooltip>`).join('')}</span>
  </div>`;''', 1)
o = '<obs-table id="tblEvents" class="fa-tblrule"'
assert t.count(o) == 1, ('tblEvents', t.count(o))
t = t.replace(o, '<obs-table id="tblEvents" class="fa-tblrule${(window.__faLogDens || \'compact\') === \'compact\' ? \' fa-tbldense\' : \'\'}"', 1)
o = 'placeholder="Search attribute"'
assert t.count(o) == 1, ('facet search', t.count(o))
t = t.replace(o, 'placeholder="Search"', 1)
# obs-table hands `width` to Vue's style binding, which does not add px to a bare number — 245 was dropped and the
# two columns split the grid in half. The live list has a narrow TIMESTAMP and MESSAGE takes the rest.
o = "{ key: 'ts', title: 'Timestamp', type: 'severity', width: 245 }"
assert t.count(o) == 1, ('ts width', t.count(o))
t = t.replace(o, "{ key: 'ts', title: 'Timestamp', type: 'severity', width: '210px' }", 1)
o = ":host(.fa-tblrule) thead th{box-shadow:inset 0 1px 0 var(--border-color)}"
assert t.count(o) == 1, ('table hook', t.count(o))
t = t.replace(o, o + ":host(.fa-tbldense) tbody td{padding-top:4px;padding-bottom:4px;font-size:12px}", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Logs — the product's row-density pair at the end of the results header */
.fa-dens { display: inline-flex; gap: 0; }
.fa-dens obs-tooltip { display: inline-flex; line-height: 0; }
.fa-dens obs-tooltip + obs-tooltip { margin-left: -1px; }
""" + t[k:]

# ── Estate card view on the DS overview-card (13 Oct 2026, "improve using localhost:3000/overview-card"): the APM
# variant's layout, band for band — header (type-icon chip · status dot · name · the runtime logo's slot, here the OS
# tag · open chevron), two readings side by side split by a hairline (24px mono value + unit), and the bottom band the
# APM card gives Error Count (16px label · 32px mono value) carrying Denied sessions. ⚠️ NOT the <obs-overview-card>
# element: every variant hardcodes its labels (APM prints "Response Time"/"Throughput"), so firewall readings would sit
# under the wrong words. Same frame and numbers, DS parts inside (obs-icon · obs-severity · obs-tag · obs-button).
# No sparklines — the owner took them off the tile on 2026-09-16.
o_i = t.index('  return `<obs-widget-card static class="fa-wc fa-wc-noacts fa-wc-flush fa-tile"')
o_e = t.index('function deviceTiles()', o_i)
t = t[:o_i] + '''  return `<article class="fa-ovc fa-tile" data-dev="${esc(d.id)}" aria-label="${esc(d.name)}">
    <header class="fa-ovc-hd">
      <span class="fa-ovc-chip"><obs-icon name="secure" size="18"></obs-icon></span>
      <obs-tooltip placement="top"><obs-severity slot="trigger" severity="${esc(d.status)}" shape="dot"></obs-severity>${esc(STATUS_LABEL[d.status] || d.status)}</obs-tooltip>
      <span class="fa-ovc-nm" title="${esc(d.name)}">${esc(d.name)}</span>
      <obs-tag variant="tag-unknown">${esc(track.label || d.vendor)}</obs-tag>
      <span class="fa-spacer"></span>
      <obs-tooltip placement="left"><obs-button slot="trigger" variant="transparent" squared data-dev1="${esc(d.id)}"
        aria-label="Open ${esc(d.name)}"><obs-icon name="chevron-right" size="14"></obs-icon></obs-button>Open firewall</obs-tooltip>
    </header>
    <div class="fa-ovc-m">
      <div class="fa-ovc-c"><span class="fa-ovc-l">Throughput</span><span class="fa-ovc-v"><b>${tp ? tp.toFixed(2) : '—'}</b><i>Gbps</i></span></div>
      <div class="fa-ovc-c"><span class="fa-ovc-l">Sessions</span><span class="fa-ovc-v"><b>${sess.toLocaleString('en-US')}</b><i>24h</i></span></div>
    </div>
    <div class="fa-ovc-e">
      <span class="fa-ovc-el">Denied sessions</span>
      <span class="fa-ovc-ev${den ? ' bad' : ''}"><b>${den.toLocaleString('en-US')}</b><i>${den ? denPct + '% of sessions' : 'none denied'}</i></span>
    </div>
  </article>`;
}

''' + t[o_e:]
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Estate cards — the DS overview-card, APM variant (frame --widget-background · 1px --widget-border-color · 7px) */
.fa-ovc { display: flex; flex-direction: column; min-width: 0; cursor: pointer; border: 1px solid var(--widget-border-color, var(--border-color));
  border-radius: 7px; background: var(--widget-background, var(--page-background-color)); color: var(--page-text-color); font-size: .8rem; line-height: 1.5; }
.fa-ovc:hover { border-color: var(--neutral-lighter, var(--border-color)); }
.fa-ovc-hd { display: flex; align-items: center; gap: 8px; min-width: 0; margin: 8px 0; padding: 0 4px 0 8px; }
.fa-ovc-chip { display: inline-flex; padding: 4px; border-radius: 4px; background: var(--neutral-lightest); }
.fa-ovc-hd obs-tooltip { display: inline-flex; line-height: 0; }
.fa-ovc-nm { font-size: 12.8px; font-weight: 500; line-height: 19px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.fa-ovc-m { display: flex; flex: 1 1 auto; padding-bottom: 12px; }
.fa-ovc-c { flex: 0 0 50%; display: flex; align-items: center; flex-wrap: wrap; gap: 0 16px; min-width: 0; padding: 4px 24px 0 8px; }
.fa-ovc-c + .fa-ovc-c { padding-left: 24px; border-left: 1px solid var(--border-color); }
.fa-ovc-l, .fa-ovc-el { color: var(--neutral-theme-color, var(--neutral-light)); white-space: nowrap; }
.fa-ovc-v, .fa-ovc-ev { display: flex; align-items: baseline; gap: 8px; min-width: 0; white-space: nowrap; }
.fa-ovc-v b, .fa-ovc-ev b { font-family: 'JetBrains Mono', monospace; font-weight: 600; line-height: 1; }
.fa-ovc-v b { font-size: 24px; }
.fa-ovc-v i, .fa-ovc-ev i { font-style: normal; color: var(--neutral-light); }
.fa-ovc-e { display: flex; align-items: center; border-top: 1px solid var(--border-color); padding: 16px 8px; }
.fa-ovc-el { flex: 0 0 33.333%; font-size: 16px; font-weight: 500; line-height: 24px; }
.fa-ovc-ev b { font-size: 32px; }
.fa-ovc-ev.bad b { color: var(--severity-critical); }
.fa-tiles > .fa-ovc + .fa-ovc { margin-top: 0; }
""" + t[k:]

# ── Logs: the source-tree toggle sits BEFORE the tab row, and the tree reads like the product's (13 Oct 2026). The live
# Log Explorer puts its circled `>` at the left of its tab row, so the toggle leaves its own near-empty row (which only
# held it and Save Query) and joins the firewall's tab row; Save Query goes to that row's right end — on Logs only.
# The tree takes the product's log-item rows: count pill right AFTER the name (not pushed to the edge), normal weight.
o_i = t.index('      <div class="fa-logs-bar">\n        <obs-button variant="transparent" squared class="fa-logs-treebtn"')
o_e = t.index('      ${logQueryBar()}', o_i)
t = t[:o_i] + t[o_e:]
o = '''    <obs-tabs id="devTabs" value="${esc(t)}" tabs='${j(devTabsFor(d))}'></obs-tabs>'''
assert t.count(o) == 1, ('devTabs', t.count(o))
# (13 Oct 2026, later) the arrow and Save Query moved onto the filter bar's line — the tab row is plain tabs again
t = t.replace(o, '''    <div class="fa-devtabs">
      <obs-tabs id="devTabs" value="${esc(t)}" tabs='${j(devTabsFor(d))}'></obs-tabs>
    </div>''', 1)
o = '<obs-side-menu id="logTree" mode="tree"'
assert t.count(o) == 1, ('logTree', t.count(o))
t = t.replace(o, '<obs-side-menu id="logTree" class="fa-logtree" mode="tree"', 1)
o = "if(this.tagName==='OBS-TABLE'){"
assert t.count(o) == 1, ('hook', t.count(o))
t = t.replace(o, "if(this.tagName==='OBS-SIDE-MENU'){try{var sm=new CSSStyleSheet();sm.replaceSync("
  "':host(.fa-logtree) .lbl{flex:0 1 auto}"
  ":host(.fa-logtree) .row{gap:8px}"
  ":host(.fa-logtree) .row.group{font-weight:400;padding-top:4px;padding-bottom:4px}"
  ":host(.fa-logtree) .row.leaf{padding-top:4px;padding-bottom:4px}"
  ":host(.fa-logtree) .hd{padding:0 16px 0 0}"
  ":host(.fa-logtree) .srow{padding:8px 16px 8px 0}');"
  "r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[sm]);}catch(e){}}"
  "if(this.tagName==='OBS-INPUT'){try{var li=new CSSStyleSheet();li.replaceSync(':host(.fa-lq-in) .ip{border:0;border-radius:0;background:transparent;height:28px}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[li]);}catch(e){}}" + o, 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Logs — the circled source-tree toggle at the start of the tab row (the product's `>`), Save Query at its end */
.fa-devtabs { display: flex; align-items: center; gap: var(--fa-padding-sm); min-width: 0; margin-top: calc(-1 * var(--fa-padding-md)); }
.fa-devtabs > #devTabs { flex: 1 1 auto; min-width: 0; margin-top: 0; }
.fa-devtabs.is-logs > #devTabs { --tabs-inset: 0px; }
.fa-devtabs obs-tooltip { display: inline-flex; line-height: 0; }
.fa-logs-treebtn { display: inline-grid; place-items: center; width: 25px; height: 25px; padding: 0; border-radius: 50%;
  border: 1px solid var(--border-color); background: none; color: var(--neutral-light); cursor: pointer; }
.fa-logs-treebtn:hover, .fa-logs-treebtn.on { color: var(--primary); border-color: var(--neutral-lighter); }
/* the open tree is the product's docked left pane (13 Oct 2026, "like the live Log Search"): ~a quarter of the page,
   running the full height of the screen beside the search, ONE rule on its right — obs-side-menu draws that rule
   itself, so the host carries no border of its own (the DS side-menu rule; two lines showed before). */
.fa-logs.tree-on { grid-template-columns: clamp(300px, 26%, 480px) minmax(0, 1fr); align-items: stretch; }
.fa-logs.tree-on > .fa-logs-tree { display: flex; flex-direction: column; position: sticky; top: 0; align-self: start;
  height: calc(100vh - 150px); max-height: none; overflow: hidden; border: 0; border-radius: 0; }
.fa-logs-tree > obs-side-menu { flex: 1 1 auto; min-height: 0; display: block; }
/* one left edge in the pane (13 Oct 2026, "improve the alignment"): Event Source, the tab labels, the search box and
   the tree's chevrons all start on the pane's own left edge, and Event Source sits on the filter line's centre */
.fa-logs-tree > obs-side-menu { --tabs-inset: 0px; }
.fa-logs.tree-on .fa-logs-pin { padding: 0 16px 0 0; height: 35px; }
.fa-logs-treebtn obs-icon { transition: transform .15s; }
.fa-logs-treebtn.on obs-icon { transform: rotate(180deg); }
.fa-logs-treebtn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.fa-devtabs-div { flex: 0 0 1px; height: 25px; background: var(--border-color); }
/* alignment (13 Oct 2026): the arrow starts on the query bar's left edge; ONE rule runs under the whole row (the tabs'
   own rule stopped short of Save Query) — the tabs sit 1px over it so the active underline still lands on the line */
""" + t[k:]

# ── Logs filter bar, like the product's Log Search (13 Oct 2026): [funnel] one plain field · a small Execute · a
# full-screen square — the live bar. What the old command palette carried and the product bar does not is NOT lost:
# Event Log / Log Pattern is the results header's own tabs, and the time range is the firewall header's picker.
o_i = t.index('function logQueryBar() {')
o_e = t.index('\n}\n', o_i) + 3
t = t[:o_i] + '''function logQueryBar() {
  return `<div class="fa-qbar fa-lqbar">
    <obs-tooltip placement="right"><button slot="trigger" type="button" class="fa-logs-treebtn${window.__faLogTree ? ' on' : ''}" aria-label="Log sources"
      aria-expanded="${!!window.__faLogTree}"
      onclick="window.__faLogTree=!window.__faLogTree;document.querySelector('.fa-logs').classList.toggle('tree-on',window.__faLogTree);this.setAttribute('aria-expanded',window.__faLogTree);this.classList.toggle('on',window.__faLogTree)"
      ><obs-icon name="chevron-right" size="14"></obs-icon></button>Log sources</obs-tooltip>
    <span class="fa-lq-box">
      <span class="fa-lq-ic" aria-hidden="true"><obs-icon name="filter" size="14"></obs-icon></span>
      <obs-input id="logQuery" class="fa-lq-in" block placeholder="Search" aria-label="Log query"
        value="${esc(logState.draft != null ? logState.draft : logState.query)}"></obs-input>
    </span>
    <obs-button variant="neutral-lighter" size="small" id="logExecute">Execute</obs-button>
    <obs-tooltip placement="left"><obs-button slot="trigger" variant="neutral-lighter" squared id="logFull"
      aria-label="Full screen"><obs-icon name="fullscreen" size="14"></obs-icon></obs-button>Full screen</obs-tooltip>
    <obs-button variant="default" id="logSaveQuery"><obs-icon name="save" size="14"></obs-icon>&nbsp;Save Query</obs-button>
  </div>`;
}
''' + t[o_e:]
o = "    q.addEventListener('category', e => {"
assert t.count(o) == 1, ('q category', t.count(o))
t = t.replace(o, """    /* Enter runs the field, as the product's bar does (Execute is the same) */
    q.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      if (logState.draft != null) logState.query = logState.draft;
      logState.draft = null;
      refreshLogs();
    });
    const full = view.querySelector('#logFull');
    if (full) full.addEventListener('click', () => {
      const el = view.querySelector('.fa-logs');
      if (!el) return;
      if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen();
    });
""" + o, 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Logs filter bar — the product's: a 30px funnel box, the field, a small Execute, a full-screen square */
.fa-lqbar { display: flex; align-items: center; gap: 8px; padding: 0 0 var(--fa-padding-sm); border-bottom: 1px solid var(--border-color); }
.fa-lq-ic { display: inline-grid; place-items: center; flex: 0 0 30px; height: 30px; border: 1px solid var(--border-color);
  border-radius: 4px; color: var(--neutral-light); }
/* (13 Oct 2026) the funnel and the field are ONE bordered box — the funnel a cell divided off on the left — as the
   product's bar is; the field's own border and fill go inside it (obs-input's .ip, via the shadow hook) */
.fa-lq-box { display: flex; align-items: stretch; flex: 1 1 auto; min-width: 0; height: 30px; box-sizing: border-box;
  border: 1px solid var(--border-color); border-radius: 4px; background: var(--page-background-color); }
.fa-lq-box:focus-within { border-color: var(--neutral-lighter); }
.fa-lq-box > .fa-lq-ic { flex: 0 0 30px; height: auto; border: 0; border-right: 1px solid var(--border-color); border-radius: 0; }
.fa-lq-in { flex: 1 1 auto; min-width: 0; }
.fa-lqbar obs-tooltip { display: inline-flex; line-height: 0; }
.fa-logs:fullscreen { background: var(--page-background-color); padding: var(--fa-padding-md); overflow: auto; }
""" + t[k:]

# ── Compliance rail, like the Compliance module's Explorer facet panel (13 Oct 2026, "improve like"): a search box
# leads (the rail's own `search`), no FILTERS / Clear all header (Standard is a required single choice, so Clear all
# could only clear Reports — one click on the ticked report does the same), bold group titles with no count beside
# them, a severity swatch before each standard with its % in plain text, and a ticked box — not a filled row — for
# the choice. Scoped to .fa-dev-rail: other DS.FilterRail users are untouched.
o = "devRail = DS.FilterRail.create({ host, title: 'Filters', groups,"
assert t.count(o) == 1, ('devRail', t.count(o))
t = t.replace(o, "devRail = DS.FilterRail.create({ host, title: 'Filters', search: 'Search', clearable: false, groups,", 1)
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Compliance rail — the Compliance module's Explorer facet panel */
.fa-dev-rail .ds-fr-head { display: none; }
.fa-dev-rail .ds-fr-search { padding: 0 12px 0 0; }
.fa-dev-rail .ds-fr-body { padding: 12px 12px 12px 0; gap: 12px; }
.fa-dev-rail .ds-fr-gname { font-size: 13.6px; font-weight: 600; }
.fa-dev-rail .ds-fr-gh .ds-fr-n { display: none; }
.fa-dev-rail .ds-fr-item { gap: 8px; padding: 3px 0; }
.fa-dev-rail .ds-fr-item.is-on { background: none; }
.fa-dev-rail .ds-fr-lbl, .fa-dev-rail .ds-fr-item.is-on .ds-fr-lbl { color: var(--page-text-color); display: flex; align-items: center; gap: 8px; }
.fa-dev-rail .ds-fr-n, .fa-dev-rail .ds-fr-item.is-on .ds-fr-n { color: var(--page-text-color); font-size: 12.8px; }
.fa-dev-rail .ds-fr-item:has(.ds-fr-n[class*="is-"]) .ds-fr-lbl::before { content: ""; flex: 0 0 16px; height: 10px; border-radius: 2px; }
.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-clear) .ds-fr-lbl::before { background: var(--severity-clear); }
.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-warning) .ds-fr-lbl::before { background: var(--severity-warning); }
.fa-dev-rail .ds-fr-item:has(.ds-fr-n.is-critical) .ds-fr-lbl::before { background: var(--severity-critical); }
""" + t[k:]

# ── Compliance score widgets on the DS (13 Oct 2026, "using the ObserveOps design system, improve"):
# LEFT — the score was a hand-drawn donut in a mostly empty card under a kebab menu with nothing in it. It is now ONE
# frameless obs-stat-card of three readings — Compliance (% in its band colour, the band as a tag, a progress bar,
# "N of M controls met"), Passed and Failed — the DS stat-card shape this module's Overview already uses; the
# sentence about where failures trace back to stays under it. No kebab (`actions: ''`).
# RIGHT — the per-standard bars keep the DS chart engine but sit on the rail's own bands (≥90 clear · ≥75 warning ·
# below critical — was major/orange, so the chart and the rail disagreed about SOC 2 and ISO), at a 12px bar.
o_i = t.index('''      ${widget(`${std.label} — ${esc(dev || 'estate')}`, `<div class="fa-score">''')
o_e = t.index('''      <div class="fa-grid span-2" style="align-content:start">''', o_i)
t = t[:o_i] + '''      ${(() => {
        const band = ev.score >= 90 ? ['Compliant', 'clear', 'tag-green'] : ev.score >= 75 ? ['At risk', 'warning', 'tag-yellow'] : ['Non-compliant', 'critical', 'tag-red'];
        return widget(`${std.label} — ${esc(dev || 'estate')}`, `<obs-stat-card class="fa-tile-stats fa-cmp-stats" items='${j([
            { label: 'Compliance', severity: band[1], value: ev.score + '%', valueSeverity: band[1], tag: band[0], tagVariant: band[2],
              percent: ev.score, barSeverity: band[1], caption: ev.passed + ' of ' + total + ' controls met' },
            { label: 'Passed', value: String(ev.passed), valueSeverity: 'clear', caption: 'controls' },
            { label: 'Failed', value: String(ev.failed.length), valueSeverity: ev.failed.length ? 'critical' : '', caption: ev.failed.length ? 'controls to clear' : 'none failing', dim: !ev.failed.length }
          ])}'></obs-stat-card>
          <div class="fa-secondary fa-cmp-note">${ev.failed.length ? `<b class="fa-strong">${ev.failed.length} failing control${ev.failed.length === 1 ? '' : 's'}</b>
            on <b class="fa-strong">${esc(dev || 'the estate')}</b> trace back to this firewall's own policies and collection state.`
            : 'Nothing outstanding against this standard.'}</div>`, { actions: '', cls: 'fa-wc-flush fa-cmp-score' });
      })()}

''' + t[o_e:]
o = "color: e.sev === 'clear' ? '--severity-clear' : e.sev === 'warning' ? '--severity-warning' : '--severity-major' };"
assert t.count(o) == 1, ('topN colour', t.count(o))
t = t.replace(o, "color: e.score >= 90 ? '--severity-clear' : e.score >= 75 ? '--severity-warning' : '--severity-critical' };", 1)
o = "          return { name: x.label, pct: e.score, v: e.score + ' %',"
assert t.count(o) == 1
o2 = "        })), {\n          actions: `<obs-button variant=\"default\"><obs-icon name=\"export-pdf\""
assert t.count(o2) == 1, ('topN opts', t.count(o2))
t = t.replace(o2, "        }), null, { pointWidth: 12, h: D.standards.length * 29 + 20 }), {\n          actions: `<obs-button variant=\"default\"><obs-icon name=\"export-pdf\"", 1)
o = "  })), { h: opts.h, axisMax: opts.axisMax, axisUnit: opts.axisUnit });"
assert t.count(o) == 1, ('vizTopN', t.count(o))
t = t.replace(o, "  })), { h: opts.h, axisMax: opts.axisMax, axisUnit: opts.axisUnit, pointWidth: opts.pointWidth });", 1)
o = "          borderWidth: 0, borderRadius: 2, pointPadding: 0.12, groupPadding: 0.06,"
assert t.count(o) == 1, ('barTopN', t.count(o))
t = t.replace(o, "          borderWidth: 0, borderRadius: 2, pointPadding: 0.12, groupPadding: 0.06, pointWidth: o.pointWidth,", 1)
# the category labels sat on the chart's left edge (spacing 0) and the longest lost their first letter
o = "      b.chart.spacing = [6, 4, 2, 0];"
assert t.count(o) >= 1, ('barTopN spacing', t.count(o))
i = t.index("function barTopN(rows, o) {"); j = t.index(o, i)
t = t[:j] + "      b.chart.spacing = [6, 4, 2, o.pointWidth ? 8 : 0];" + t[j + len(o):]
k = t.index('</style>', t.index('/* prototype.css */'))
t = t[:k] + """
/* Compliance score card — a frameless stat card over the explanatory line */
.fa-cmp-score obs-stat-card.fa-cmp-stats { border-top: 0; }
.fa-cmp-note { padding: 12px 0; border-top: 1px solid var(--border-color); }
/* the card is frameless here (.fa-flat), so its content starts on the TITLE's edge: no body inset, no first-cell inset */
.fa-cmp-score > .fa-card-body { padding-left: 0; padding-right: 0; }
""" + t[k:]

# ── DS bundle: the vendored page inlined an older @mtdt/observeops-ds-elements (no obs-stat-card). Swap it for
# the current local DS build (a superset) so the estate cards can use obs-stat-card. Override with $OBS_DS_BUNDLE.
import os
B = os.environ.get('OBS_DS_BUNDLE') or os.path.expanduser(
    '~/ObserveOps Design System/motadata-design-system/components-lib/dist/observeops-elements.js')
BH = '<script type="module">/* node_modules/@mtdt/observeops-ds-elements/dist/observeops-elements.js */\n'
assert t.count(BH) == 1, 'ds bundle block'
bi = t.index(BH) + len(BH); be = t.index('</script>', bi)
nb = open(B, encoding='utf-8').read().replace('</script', '<\\/script')
assert 'obs-stat-card' in nb, 'DS build has no obs-stat-card'
t = t[:bi] + nb + '\n' + t[be:]

t = pass2(t)
open(P, 'w', encoding='utf-8').write(t)
print('ds_pass: applied')
