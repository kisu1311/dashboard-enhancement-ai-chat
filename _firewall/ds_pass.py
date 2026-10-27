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
}""", """const FW_SET_TABS = [{ key: 'fwinventory', label: 'Firewall Inventory' }];   /* Firewall Templates tab removed (owner, 19 Oct 2026); its screen and route stay */
function dpSettingsHeader() {
  const tabs = document.documentElement.classList.contains('fasettings') && FW_SET_TABS.length > 1 && FW_SET_TABS.some(x => x.key === currentTab)
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
        <obs-button variant="neutral-lightest" squared aria-label="Refresh" data-tip="Refresh" data-mdh="refresh"><obs-icon name="sync" size="14"></obs-icon></obs-button>
        <obs-button variant="neutral-lightest" squared aria-label="Full screen" data-tip="Full screen" data-mdh="full"><obs-icon name="expand" size="14"></obs-icon></obs-button>""", 'mdh header')
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
    # Add Object (owner, 19 Oct 2026): "swap the 2 row" — Object Name · Description lead, Device Name · Mode follow.
    rep("""      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true }) : ''}
      ${field('Mode', mode ? pmRo(mode) : pmRo('Not collected', true))}
      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${pmInput(ns, f, 'desc', 'Description')}
""",
        """      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${pmInput(ns, f, 'desc', 'Description')}
      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true }) : ''}
      ${field('Mode', mode ? pmRo(mode) : pmRo('Not collected', true))}
""", 'obj name row first')
    # Firewall Inventory row menu (owner, 19 Oct 2026): "remove the firewall template in action".
    rep("""  { key: 'updateCred', label: 'Update Credential', icon: 'lock-alt' },
  { key: 'updateTpl',  label: 'Update Template',   icon: 'file-alt' }
];""",
        """  { key: 'updateCred', label: 'Update Credential', icon: 'lock-alt' }
  /* Update Template removed from the row menu (owner, 19 Oct 2026); its screen and handlers stay */
];""", 'no update template action')
    # Firewall Inventory bulk bar on the DS (owner, 19 Oct 2026): default-size bordered actions with a glyph each and the
    # pill's divider; and no 2px --primary edge on a selected row (owner: "when i select the check box remove the white line").
    rep("""        bulk: `<obs-button slot="bulk-actions" variant="default" size="small" data-fibulk="1">Enable management</obs-button>
          <obs-button slot="bulk-actions" variant="default" size="small" data-fibulk="0">Disable management</obs-button>` })}""",
        """        bulk: `<span slot="bulk-actions" class="fa-bulk-div" aria-hidden="true"></span>
          <obs-button slot="bulk-actions" variant="default" data-fibulk="1"><obs-icon name="check-circle" size="14"></obs-icon>Enable management</obs-button>
          <obs-button slot="bulk-actions" variant="default" data-fibulk="0"><obs-icon name="ban" size="14"></obs-icon>Disable management</obs-button>` })}""", 'fi bulk ds')
    rep("""var(--page-background-color)}');r.adoptedStyleSheets""", """var(--page-background-color)}:host(#tblFwInventory) tbody tr.row-selected td:first-child{box-shadow:none}');r.adoptedStyleSheets""", 'fi no selected edge')
    rep("""              : k === 'add' ? { text: 'Add Credential' } : { text: 'Not Applicable', icon: 'ban', iconLabel: 'Not applicable' }; } },
        { key: 'type', title: 'Type', width: 80, ds: { type: 'icon' }, cell: () => 'secure' }
      ].map(""",
        """              : k === 'add' ? { text: 'Add Credential' } : { text: 'Not Applicable', icon: 'ban', iconLabel: 'Not applicable' }; } }
        /* Type column removed (owner, 19 Oct 2026): every row is a firewall, so it said the same thing ten times */
      ].map(""", 'fi no type col 0')
    rep("""  { key: 'cred', title: 'Credential Status' }, { key: 'type', title: 'Type' }];""",
        """  { key: 'cred', title: 'Credential Status' }];""", 'fi no type col 1')
    # Credentials Status drawer on the DS (owner, 19 Oct 2026): obs-table (tags cell for Validity) + obs-banner for the error.
    rep("""  const validity = v => v === 'na' ? `<span class="fa-cs is-na">[NA]</span>`
    : `<span class="fa-cs is-${v}"><obs-icon name="${v === 'ok' ? 'check-circle' : 'times-circle'}" size="14"></obs-icon>${v === 'ok' ? 'Succeed' : 'Failed'}</span>`;
  const cols = [
    { key: 'label',    title: 'Credential', render: s => esc(s.label) },
    { key: 'value',    title: 'Value',      render: s => s.value ? `<span class="fa-oid">${esc(s.value)}</span>` : '' },
    { key: 'validity', title: 'Validity',   render: s => validity(s.validity) }
  ];
  credDrawer.innerHTML = `<div class="ds-cred fa-cst" data-cred-status-for="${esc(d.id)}" data-method="${f.method}">
    ${faGrid('tblCredStatus', cols, f.steps, { static: true, pager: false, maxHeight: 'none' })}
    ${f.error ? `<div class="fa-cst-err"><obs-icon name="exclamation-triangle" size="14"></obs-icon>Error: ${esc(f.error)}</div>` : ''}""",
        """  /* on the DS (owner, 19 Oct 2026: "update the observeops design system components"): the steps are an obs-table with
     Validity as its tags cell (Succeed green · Failed red · NA neutral — the product's three words), the error is an
     obs-banner (error). The output box stays a <pre>: the DS ships no code/log block (searched), so it is token-only. */
  const VAL = { ok: { label: 'Succeed', variant: 'tag-green' }, fail: { label: 'Failed', variant: 'tag-red' }, na: { label: 'NA', variant: 'tag-unknown' } };
  const cols = [
    { key: 'label', title: 'Credential' }, { key: 'value', title: 'Value' },
    { key: 'validity', title: 'Validity', type: 'tags', width: '140px' }
  ];
  const rows = f.steps.map(s => ({ id: s.key, label: s.label, value: s.value || '—', validity: [VAL[s.validity]] }));
  credDrawer.innerHTML = `<div class="ds-cred fa-cst" data-cred-status-for="${esc(d.id)}" data-method="${f.method}">
    <obs-table id="tblCredStatus" class="fa-tblrule" header-style="default" page-size="0" columns='${j(cols)}' rows='${j(rows)}'></obs-table>
    ${f.error ? `<obs-banner variant="error" title="${esc(f.error)}"></obs-banner>` : ''}""", 'cred status ds')
    # Successful opens Credentials Status too, and Credential status leaves the row menu (owner, 19 Oct 2026).
    rep("""        rowActions: FI_ROW_ACTIONS.concat([{ key: 'credStatus', label: 'Credential status', icon: 'shield-check' }]),""",
        """        rowActions: FI_ROW_ACTIONS,   /* Credential status left the menu (owner, 19 Oct 2026) — the Credential Status cell opens it */""", 'cred ok link 0')
    rep("""            if (k === 'add') go('fwinventory', r.id + '/credential'); else if (k === 'fail') go('fwinventory', r.id + '/status');""",
        """            if (k === 'add') go('fwinventory', r.id + '/credential'); else if (k === 'fail' || k === 'ok') go('fwinventory', r.id + '/status');""", 'cred ok link 1')
    rep(""":host(#tblFwInventory) a.cell-link:has(obs-icon[name=check-circle]){color:var(--secondary-green);cursor:default;text-decoration:none}""",
        """:host(#tblFwInventory) a.cell-link:has(obs-icon[name=check-circle]){color:var(--secondary-green)}""", 'cred ok link 2')
    # Credential Status: "Add Credential" shown as a small secondary (default) button with a plus-circle (2026-10-19)
    rep("k === 'add' ? { text: 'Add Credential' } :", "k === 'add' ? { text: 'Add Credential', icon: 'plus-circle', iconLabel: 'Add credential' } :", 'add cred icon')
    rep(':host(#tblFwInventory) a.cell-link:has(obs-icon[name=ban])', ':host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]){height:24px;padding:0 10px;box-sizing:border-box;border:1px solid var(--default-button-border,var(--field-border-color));border-radius:var(--btn-radius,4px);background:var(--default-button-bg,var(--page-background-color));color:var(--default-button-text,var(--page-text-color));text-decoration:none;white-space:nowrap}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]):hover{background:var(--default-button-hover-bg,var(--neutral-lightest));border-color:var(--outline-button-hover-border,var(--neutral-light));text-decoration:none}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]){height:28px;padding:0 10px;margin-left:-10px;border-color:transparent;background:transparent;color:var(--page-text-color);transition:background-color .12s,border-color .12s}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]):hover,:host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]):focus-visible{border-color:var(--default-button-border,var(--field-border-color));background:var(--default-button-hover-bg,var(--neutral-lightest))}:host(#tblFwInventory) a.cell-link:has(obs-icon[name=ban])', 'add cred accent')
    # Add Credential at the DS small-button size; a "New" tag on recently added firewalls (2026-10-19)
    rep(':host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]){height:24px;padding:0 10px;box-sizing:border-box;', ':host(#tblFwInventory) a.cell-link:has(obs-icon[name=plus-circle]){height:var(--btn-height,2.1rem);padding:0 15px;gap:6px;font-size:var(--text-sm,.8rem);font-weight:400;font-family:var(--font-family,inherit);line-height:1;box-sizing:border-box;', 'add cred ds small')
    rep(':host(#tblFwInventory) tbody tr.row-selected td:first-child{box-shadow:none}', ':host(#tblFwInventory) tbody tr.row-selected td:first-child{box-shadow:none}:host(#tblFwInventory) obs-tag.fa-new{margin-left:8px;flex:0 0 auto}', 'fi new tag css')
    rep('    [0, 60, 250, 800].forEach(ms => setTimeout(sync, ms));\n    new MutationObserver(sync).observe(ti.shadowRoot, { childList: true, subtree: true });', '    /* a firewall added in the last FA_NEW_DAYS (by its `since` date, against the newest one) carries a "New" tag after\n       its name (owner, 19 Oct 2026). The severity cell prints text only, so the tag is placed into the cell here. */\n    const fresh = new Set(D.devices.filter(faIsNew).map(d => d.name));\n    const tagNew = () => ti.shadowRoot.querySelectorAll(\'tbody tr\').forEach(tr => {\n      const clip = tr.querySelector(\'td .cell-clip\'); if (!clip || !fresh.has(clip.textContent.trim())) return;\n      if (!clip.parentNode.querySelector(\'obs-tag.fa-new\')) clip.insertAdjacentHTML(\'afterend\', \'<obs-tag class="fa-new" variant="tag-primary">New</obs-tag>\');\n    });\n    const both = () => { sync(); tagNew(); };\n    [0, 60, 250, 800].forEach(ms => setTimeout(both, ms));\n    new MutationObserver(both).observe(ti.shadowRoot, { childList: true, subtree: true });', 'fi new tag js')
    rep('function fiBulk(on) {', 'const FA_NEW_DAYS = 7;\nfunction faIsNew(d) {\n  const last = Math.max(...D.devices.map(x => Date.parse(x.since) || 0));\n  return !!d.since && last - Date.parse(d.since) <= FA_NEW_DAYS * 864e5;\n}\nfunction fiBulk(on) {', 'fi new fn')
    # Add Object: the form takes .fa-pmf-form, so it gets the drawer's 7 / 20 / 32 spacing like Add Policy (2026-10-19)
    rep('  return `<div class="fa-grid cols-2">\n      ${pmInput(ns, f, \'name\', \'Object Name\', { req: true, ph: \'Must be unique\' })}', '  return `<div class="fa-pmf-form"><div class="fa-grid cols-2">\n      ${pmInput(ns, f, \'name\', \'Object Name\', { req: true, ph: \'Must be unique\' })}', 'obj form spacing 0')
    rep("      ${isGroupType(f.type) ? pmSelect(ns, f, 'members', 'Members', pool, { req: true, multi: true }) : ''}\n    </div>`;", "      ${isGroupType(f.type) ? pmSelect(ns, f, 'members', 'Members', pool, { req: true, multi: true }) : ''}\n    </div></div>`;", 'obj form spacing 1')
    # Device details drawer from the device name (2026-10-19)
    rep("  if (!d || !['credential', 'template', 'status'].includes(what)) { go('fwinventory'); return; }\n  if (what === 'credential') openCredAsk(d); else if (what === 'status') openCredStatus(d); else openTplAsk(d);", "  if (!d || !['credential', 'template', 'status', 'details'].includes(what)) { go('fwinventory'); return; }\n  if (what === 'details') { openFwDetails(d); return; }\n  if (what === 'credential') openCredAsk(d); else if (what === 'status') openCredStatus(d); else openTplAsk(d);", 'fi details route')
    rep("credDrawer.addEventListener('close', () => { credAsk = null; tplAsk = null; credStatus = null; });", '/* ---- Device details (owner, 19 Oct 2026: "when I click the device, show the view details using the ObserveOps design\n   system"): the device name opens this drawer in the shared credential host. Built from DS parts only — obs-tag for the\n   status chips, obs-key-value (card, two-column — "a record has MANY fields") for the record and for how each signal is\n   collected, obs-button for the way on. The Status value uses obs-key-value\'s own status tag where the map has the word;\n   Warning is not in it, so that value is coloured by its --severity token instead. ---- */\nlet fwDetails = null;   /* { dev } */\nfunction openFwDetails(d) {\n  fwDetails = { dev: d };\n  paintFwDetails();\n  credDrawer.open = true; credDrawer.setAttribute(\'open\', \'\');\n}\nfunction paintFwDetails() {\n  const a = fwDetails; if (!a) return;\n  const d = a.dev, t = fwTemplateOf(d), cs = credStatusOf(d), inv = invRowOf(d), on = fwManaged(d);\n  credDrawer.setAttribute(\'title\', d.name);\n  const STATUS_TAG = { up: \'tag-green\', warning: \'tag-yellow\', critical: \'tag-red\', down: \'tag-red\', unreachable: \'tag-purple\' };\n  const CRED_TAG = { ok: \'tag-green\', fail: \'tag-red\', add: \'tag-orange\', na: \'tag-unknown\' };\n  const st = d.status === \'warning\' ? [\'Status\', \'Warning\', \'--severity-warning\'] : [\'Status\', STATUS_LABEL[d.status] || d.status, \'\', d.status];\n  const general = [\n    [\'Device\', d.name], [\'IP/Host\', d.mgmt], [\'Vendor\', fwVendorName(d)], [\'Model\', d.vendor],\n    [\'System OID\', d.sysOid], [\'Template\', t ? t.name : \'Not assigned\'], [\'Site\', d.site || \'—\'], [\'HA Role\', d.ha || \'—\'],\n    [\'Version\', d.version || \'—\'], [\'Added On\', d.since || \'—\'], st, [\'Service\', d.service || \'—\']\n  ];\n  const SIG = { metrics: \'Metrics\', logs: \'Logs\', flow: \'Flow\', rules: \'Policies\' };\n  const sigVal = g => !g || g.state === \'off\' ? (g && g.note ? \'Off · \' + g.note : \'Off\')\n    : [g.state === \'ok\' ? \'OK\' : g.state === \'error\' ? \'Error\' : g.state === \'stalled\' ? \'Stalled\' : g.state, g.via, g.last ? \'last \' + g.last : \'\'].filter(Boolean).join(\' · \');\n  const sigCol = g => !g || g.state === \'off\' ? \'\' : g.state === \'ok\' ? \'\' : g.state === \'stalled\' ? \'--severity-warning\' : \'--severity-critical\';\n  const signals = Object.keys(SIG).map(k => { const g = (d.signals || {})[k]; return [SIG[k], sigVal(g), sigCol(g)]; });\n  const tags = (inv.groups || []).map(x => `<obs-tag variant="tag-primary">${esc(x)}</obs-tag>`).concat((inv.tags || []).map(x => `<obs-tag>${esc(x)}</obs-tag>`)).join(\'\');\n  credDrawer.innerHTML = `<div class="ds-cred fa-fid" data-fw-details="${esc(d.id)}">\n    <div class="fa-fid-tags">\n      <obs-tag variant="${STATUS_TAG[d.status] || \'tag-unknown\'}">${esc(STATUS_LABEL[d.status] || d.status)}</obs-tag>\n      <obs-tag variant="${on ? \'tag-green\' : \'tag-unknown\'}">Management ${on ? \'On\' : \'Off\'}</obs-tag>\n      <obs-tag variant="${CRED_TAG[cs.kind]}">Credential: ${esc(cs.label)}</obs-tag>\n      ${faIsNew(d) ? \'<obs-tag variant="tag-primary">New</obs-tag>\' : \'\'}\n    </div>\n    <div class="fa-fid-sec"><h4 class="fa-fid-h">General</h4><obs-key-value columns="2" items=\'${j(general)}\'></obs-key-value></div>\n    <div class="fa-fid-sec"><h4 class="fa-fid-h">Data Collection</h4><obs-key-value columns="2" items=\'${j(signals)}\'></obs-key-value></div>\n    ${tags ? `<div class="fa-fid-sec"><h4 class="fa-fid-h">Groups &amp; Tags</h4><div class="fa-fid-tags">${tags}</div></div>` : \'\'}\n    <div class="ds-cred-foot"><span class="fa-spacer"></span>\n      ${on ? `<obs-button variant="default" id="fdCred">${cs.kind === \'add\' ? \'Add Credential\' : \'Update Credential\'}</obs-button>` : \'\'}\n      <obs-button variant="primary" id="fdOpen">Open Device</obs-button></div>\n  </div>`;\n  const c = credDrawer.querySelector(\'#fdCred\');\n  if (c) c.addEventListener(\'click\', () => { fwDetails = null; go(\'fwinventory\', d.id + \'/credential\'); });\n  const o = credDrawer.querySelector(\'#fdOpen\');\n  if (o) o.addEventListener(\'click\', () => { fwDetails = null; credDrawer.open = false; credDrawer.removeAttribute(\'open\'); go(\'device\', d.id); });\n}\ncredDrawer.addEventListener(\'close\', () => { credAsk = null; tplAsk = null; credStatus = null; fwDetails = null; });', 'fi details drawer')
    rep('    const both = () => { sync(); tagNew(); };', "    const both = () => { sync(); tagNew(); };\n    /* the device NAME opens its details (owner, 19 Oct 2026) — only the name: the row's other cells keep their own jobs */\n    if (!ti.__fid) {\n      ti.__fid = true;\n      ti.addEventListener('click', e => {\n        const path = e.composedPath ? e.composedPath() : [];\n        if (!path.some(n => n.classList && n.classList.contains('primary-text'))) return;\n        const name = (path.find(n => n.classList && n.classList.contains('primary-text')).textContent || '').trim();\n        const dv = D.devices.find(x => x.name === name); if (dv) go('fwinventory', dv.id + '/details');\n      });\n    }", 'fi details click')
    rep(':host(#tblFwInventory) obs-tag.fa-new{margin-left:8px;flex:0 0 auto}', ':host(#tblFwInventory) obs-tag.fa-new{margin-left:8px;flex:0 0 auto}:host(#tblFwInventory) .primary-text{cursor:pointer}:host(#tblFwInventory) .primary-text:hover{text-decoration:underline}', 'fi details css')
    rep('.ds-cred-foot { display: flex;', '.fa-fid-tags { display: flex; flex-wrap: wrap; gap: var(--ds-padding-xs, 8px); }\n.fa-fid-sec { display: flex; flex-direction: column; gap: var(--ds-padding-xs, 8px); }\n.fa-fid-h { margin: 0; font-size: 14px; font-weight: 500; color: var(--page-text-color); }\n.ds-cred-foot { display: flex;', 'fi details page css')
    rep('    <div class="fa-fid-sec"><h4 class="fa-fid-h">Data Collection</h4><obs-key-value columns="2" items=\'${j(signals)}\'></obs-key-value></div>', '    <div class="fa-fid-sec"><h4 class="fa-fid-h">Data Collection</h4><obs-table id="tblFwSignals" class="fa-tblrule" header-style="default" page-size="0"\n      columns=\'${j([{ key: \'sig\', title: \'Signal\', width: \'110px\' }, { key: \'state\', title: \'State\', type: \'tags\', width: \'110px\' }, { key: \'via\', title: \'Collected Via\' }, { key: \'last\', title: \'Last\', width: \'110px\' }])}\'\n      rows=\'${j(signals)}\'></obs-table></div>', 'fi details sig table')
    rep('  const signals = Object.keys(SIG).map(k => { const g = (d.signals || {})[k]; return [SIG[k], sigVal(g), sigCol(g)]; });', "  const SIG_TAG = { ok: ['OK', 'tag-green'], stalled: ['Stalled', 'tag-yellow'], error: ['Error', 'tag-red'], off: ['Off', 'tag-unknown'] };\n  const signals = Object.keys(SIG).map(k => { const g = (d.signals || {})[k] || { state: 'off' }; const tg = SIG_TAG[g.state] || [g.state, 'tag-unknown'];\n    return { id: k, sig: SIG[k], state: [{ label: tg[0], variant: tg[1] }], via: g.state === 'off' ? (g.note || '—') : (g.via || '—'), last: g.last || '—' }; });", 'fi details sig rows')
    rep("  const sigVal = g => !g || g.state === 'off' ? (g && g.note ? 'Off · ' + g.note : 'Off')\n    : [g.state === 'ok' ? 'OK' : g.state === 'error' ? 'Error' : g.state === 'stalled' ? 'Stalled' : g.state, g.via, g.last ? 'last ' + g.last : ''].filter(Boolean).join(' · ');\n  const sigCol = g => !g || g.state === 'off' ? '' : g.state === 'ok' ? '' : g.state === 'stalled' ? '--severity-warning' : '--severity-critical';\n", '', 'fi details sig helpers')
    # Device details v2: identity header, stat strip, General without repeats (2026-10-19)
    rep("  const general = [\n    ['Device', d.name], ['IP/Host', d.mgmt], ['Vendor', fwVendorName(d)], ['Model', d.vendor],\n    ['System OID', d.sysOid], ['Template', t ? t.name : 'Not assigned'], ['Site', d.site || '—'], ['HA Role', d.ha || '—'],\n    ['Version', d.version || '—'], ['Added On', d.since || '—'], st, ['Service', d.service || '—']\n  ];", '  /* the header already names the device, its IP and its status, so General does not repeat them (owner, 19 Oct 2026:\n     "improve this") — and System OID gets the full row width (a 2-column cell truncated it) */\n  const general = [\n    [\'Vendor\', fwVendorName(d)], [\'Model\', d.vendor], [\'Template\', t ? t.name : \'Not assigned\'], [\'Site\', d.site || \'—\'],\n    [\'HA Role\', d.ha || \'—\'], [\'Version\', d.version || \'—\'], [\'Service\', d.service || \'—\'], [\'Added On\', d.since || \'—\']\n  ];\n  /* headline figures → obs-stat-card (the DS\'s joined KPI strip), each value coloured by its severity when it bites */\n  const stats = [\n    { label: \'Policies\', value: d.rules == null ? \'—\' : nf(d.rules), caption: \'collected\' },\n    { label: \'Findings\', value: d.findings == null ? \'—\' : nf(d.findings), valueSeverity: d.findings ? \'warning\' : undefined, caption: \'open\' },\n    { label: \'Critical\', value: d.critical == null ? \'—\' : nf(d.critical), valueSeverity: d.critical ? \'critical\' : undefined, caption: \'findings\' },\n    { label: \'Throughput\', value: d.throughput || \'—\', caption: d.lastLog ? \'last log \' + d.lastLog : \'\' }\n  ];', 'fi details general v2')
    rep('  credDrawer.innerHTML = `<div class="ds-cred fa-fid" data-fw-details="${esc(d.id)}">\n    <div class="fa-fid-tags">', '  credDrawer.innerHTML = `<div class="ds-cred fa-fid" data-fw-details="${esc(d.id)}">\n    <div class="fa-fid-id">\n      <span class="fa-fid-tile"><obs-icon name="secure" size="22"></obs-icon></span>\n      <div class="fa-fid-who"><b>${esc(d.name)}</b><span>${esc(d.mgmt)} <i>|</i> ${esc(d.vendor)}</span></div>\n    </div>\n    <div class="fa-fid-tags">', 'fi details identity')
    rep('    <div class="fa-fid-sec"><h4 class="fa-fid-h">General</h4><obs-key-value columns="2" items=\'${j(general)}\'></obs-key-value></div>', '    <obs-stat-card class="fa-fid-stats" items=\'${j(stats)}\'></obs-stat-card>\n    <div class="fa-fid-sec"><h4 class="fa-fid-h">General</h4><obs-key-value columns="2" items=\'${j(general)}\'></obs-key-value>\n      <obs-key-value items=\'${j([[\'System OID\', d.sysOid]])}\' class="fa-fid-oid"></obs-key-value></div>', 'fi details stats')
    rep('.fa-fid-h { margin: 0; font-size: 14px; font-weight: 500; color: var(--page-text-color); }', '.fa-fid-h { margin: 0; font-size: 14px; font-weight: 500; color: var(--page-text-color); }\n.fa-fid { gap: var(--ds-padding-lg, 24px); }\n.fa-fid > .fa-fid-tags { margin-top: calc(-1 * var(--ds-padding-sm, 12px)); }\n.fa-fid-id { display: flex; align-items: center; gap: var(--ds-padding-sm, 12px); }\n.fa-fid-tile { flex: 0 0 40px; height: 40px; display: grid; place-items: center; border-radius: var(--btn-radius, 4px);\n  background: var(--neutral-lightest); color: var(--page-text-color); }\n.fa-fid-who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }\n.fa-fid-who b { font-size: 16px; font-weight: 600; color: var(--page-text-color); }\n.fa-fid-who span { font-size: 13px; color: var(--neutral-light); }\n.fa-fid-who i { font-style: normal; margin: 0 4px; color: var(--border-color); }\n.fa-fid-sec > obs-key-value + obs-key-value { margin-top: -8px; }', 'fi details css v2')
    rep("  const st = d.status === 'warning' ? ['Status', 'Warning', '--severity-warning'] : ['Status', STATUS_LABEL[d.status] || d.status, '', d.status];\n", '', 'fi details drop st')
    rep('    <div class="ds-cred-foot"><span class="fa-spacer"></span>\n      ${on ? `<obs-button variant="default" id="fdCred">${cs.kind === \'add\' ? \'Add Credential\' : \'Update Credential\'}</obs-button>` : \'\'}\n      <obs-button variant="primary" id="fdOpen">Open Device</obs-button></div>\n  </div>`;\n  const c = credDrawer.querySelector(\'#fdCred\');\n  if (c) c.addEventListener(\'click\', () => { fwDetails = null; go(\'fwinventory\', d.id + \'/credential\'); });\n  const o = credDrawer.querySelector(\'#fdOpen\');\n  if (o) o.addEventListener(\'click\', () => { fwDetails = null; credDrawer.open = false; credDrawer.removeAttribute(\'open\'); go(\'device\', d.id); });', "  </div>`;   /* no footer: Update Credential / Open Device removed (owner, 19 Oct 2026) — the row's ⋮ and Credential Status cell carry them */", 'fi details no foot')
    rep("  credDrawer.setAttribute('title', d.name);\n  const STATUS_TAG", "  credDrawer.setAttribute('title', 'Device Details');\n  const STATUS_TAG", 'fi details title')
    rep('<obs-key-value columns="2" items=\'${j(general)}\'></obs-key-value>', '<obs-key-value columns="2" class="fa-fid-gen" items=\'${j(general)}\'></obs-key-value>', 'fi details gen class')
    rep("if(this.tagName==='OBS-SWITCH'){", "if(this.tagName==='OBS-KEY-VALUE'){try{var kv=new CSSStyleSheet();kv.replaceSync(':host(.fa-fid-gen) .kv.v-card{border-bottom-left-radius:0;border-bottom-right-radius:0}:host(.fa-fid-oid) .kv.cols-1{max-width:none}:host(.fa-fid-oid) .kv .k{width:22%}:host(.fa-fid-oid) .kv.v-card{border-top:0;border-top-left-radius:0;border-top-right-radius:0}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[kv]);}catch(e){}}if(this.tagName==='OBS-SWITCH'){", 'fi details kv hook')
    # Device details v3: the product monitor panel shape — title-slot identity, tabs, plain key-value (2026-10-19)
    t = t[:t.index('let fwDetails = null;')] + 'let fwDetails = null;   /* { dev, tab } */\n/* rebuilt on the product\'s monitor panel (owner, 19 Oct 2026 — the HB1 reference): the identity sits in the drawer\'s\n   own title row (icon tile · status dot · name · | IP | vendor, then the group and tag chips), obs-tabs under it, and\n   Summary is two flat label → value sections (obs-key-value plain) split by a hairline. The other three tabs are the\n   Devices list drawer\'s own panes (Polling · Triggered Alert Policies · Activity), so the two drawers cannot disagree. */\nconst FID_TABS = [\n  { key: \'summary\',  label: \'Summary\' },\n  { key: \'polling\',  label: \'Polling Info\' },\n  { key: \'policies\', label: \'Triggered Policies\' },\n  { key: \'activity\', label: \'Action History\' }\n];\nfunction openFwDetails(d) {\n  fwDetails = { dev: d, tab: \'summary\' };\n  credDrawer.setAttribute(\'width\', \'56%\');\n  paintFwDetails();\n  credDrawer.open = true; credDrawer.setAttribute(\'open\', \'\');\n}\nfunction fwDetailsSummary(d) {\n  const t = fwTemplateOf(d), cs = credStatusOf(d), inv = invRowOf(d), on = fwManaged(d);\n  const status = d.status === \'warning\' ? [\'Status\', \'Warning\', \'--severity-warning\'] : [\'Status\', STATUS_LABEL[d.status] || d.status, \'\', d.status];\n  const cred = cs.kind === \'ok\' ? [\'Credential\', \'Successful\', \'\', \'success\'] : cs.kind === \'fail\' ? [\'Credential\', \'Failed\', \'\', \'failed\']\n    : [\'Credential\', cs.kind === \'add\' ? \'Not added\' : \'Not applicable\'];\n  const dev = [\n    [\'Name\', d.name], [\'IP/Host\', d.mgmt], [\'System OID\', d.sysOid], [\'Type\', \'Firewall\'],\n    [\'Vendor\', fwVendorName(d)], [\'Model\', d.vendor], [\'Template\', t ? t.name : \'Not assigned\'],\n    [\'Group\', (inv.groups || []).join(\', \') || \'—\'], [\'Tags\', (inv.tags || []).join(\', \') || \'—\'],\n    status, [\'Management\', on ? \'On\' : \'Off\', \'\', on ? \'on\' : \'off\'], cred\n  ];\n  const sys = [\n    [\'Site\', d.site || \'—\'], [\'HA Role\', d.ha || \'—\'], [\'Service\', d.service || \'—\'], [\'Version\', d.version || \'—\'],\n    [\'Config Changed\', d.changed || \'—\'], [\'Throughput\', d.throughput || \'—\'],\n    [\'Policies\', d.rules == null ? \'—\' : nf(d.rules)],\n    [\'Findings\', d.findings == null ? \'—\' : nf(d.findings), d.findings ? \'--severity-warning\' : \'\'],\n    [\'Critical Findings\', d.critical == null ? \'—\' : nf(d.critical), d.critical ? \'--severity-critical\' : \'\'],\n    [\'Last Log\', d.lastLog || \'—\'], [\'Added On\', d.since || \'—\']\n  ];\n  return `<div class="fa-fid-sum">\n    <h4 class="fa-fid-h">Device Info</h4>\n    <obs-key-value variant="plain" class="fa-fid-kv" items=\'${j(dev)}\'></obs-key-value>\n    <obs-divider class="fa-fid-div"></obs-divider>\n    <h4 class="fa-fid-h">System Info</h4>\n    <obs-key-value variant="plain" class="fa-fid-kv" items=\'${j(sys)}\'></obs-key-value>\n  </div>`;\n}\nconst FID_PANES = { summary: fwDetailsSummary, polling: d => devDrawerPolling(d), policies: d => devDrawerPolicies(d), activity: d => devDrawerActivity(d) };\nfunction paintFwDetails() {\n  const a = fwDetails; if (!a) return;\n  const d = a.dev, inv = invRowOf(d), pane = FID_PANES[a.tab] ? a.tab : \'summary\';\n  credDrawer.setAttribute(\'title\', d.name);   /* the accessible name; the title slot below is what shows */\n  const chips = (inv.groups || []).map(x => `<obs-tag>${esc(x)}</obs-tag>`)\n    .concat((inv.tags || []).map(x => `<obs-tag variant="main-tags">${esc(x)}</obs-tag>`))\n    .concat(faIsNew(d) ? [\'<obs-tag variant="tag-primary">New</obs-tag>\'] : []).join(\'\');\n  credDrawer.innerHTML = `<div slot="title" class="fa-fid-hd">\n      <span class="fa-fid-tile"><obs-icon name="secure" size="22"></obs-icon></span>\n      <div class="fa-fid-who">\n        <div class="fa-fid-nm"><obs-severity severity="${esc(d.status)}" shape="dot"></obs-severity><b>${esc(d.name)}</b>\n          <span>| ${esc(d.mgmt)} | ${esc(fwVendorName(d))}</span></div>\n        ${chips ? `<div class="fa-fid-chips">${chips}</div>` : \'\'}\n      </div>\n    </div>\n    <div class="fa-fid" data-fw-details="${esc(d.id)}">\n      <obs-tabs id="fidTabs" value="${pane}" tabs=\'${j(FID_TABS)}\'></obs-tabs>\n      <div id="fidPane" class="fa-fid-pane" data-tab="${pane}">${FID_PANES[pane](d)}</div>\n    </div>`;\n  const tabs = credDrawer.querySelector(\'#fidTabs\');\n  if (tabs) tabs.addEventListener(\'change\', e => {\n    const v = detailOf(e), key = (typeof v === \'string\' ? v : (v && (v.key || v.value))) || \'summary\';\n    const host = credDrawer.querySelector(\'#fidPane\'); if (!host || !FID_PANES[key]) return;\n    a.tab = key; host.setAttribute(\'data-tab\', key); host.innerHTML = FID_PANES[key](d);\n  });\n}\n' + t[t.index("credDrawer.addEventListener('close', () => { credAsk = null; tplAsk = null; credStatus = null; fwDetails = null; });"):]
    rep("credDrawer.addEventListener('close', () => { credAsk = null; tplAsk = null; credStatus = null; fwDetails = null; });", "credDrawer.addEventListener('close', () => { credAsk = null; tplAsk = null; credStatus = null; fwDetails = null; credDrawer.setAttribute('width', '40%'); });", 'fi details v3 close')
    rep('.fa-fid-tags { display: flex; flex-wrap: wrap; gap: var(--ds-padding-xs, 8px); }\n.fa-fid-sec { display: flex; flex-direction: column; gap: var(--ds-padding-xs, 8px); }\n.fa-fid-h { margin: 0; font-size: 14px; font-weight: 500; color: var(--page-text-color); }\n.fa-fid { gap: var(--ds-padding-lg, 24px); }\n.fa-fid > .fa-fid-tags { margin-top: calc(-1 * var(--ds-padding-sm, 12px)); }\n.fa-fid-id { display: flex; align-items: center; gap: var(--ds-padding-sm, 12px); }\n.fa-fid-tile { flex: 0 0 40px; height: 40px; display: grid; place-items: center; border-radius: var(--btn-radius, 4px);\n  background: var(--neutral-lightest); color: var(--page-text-color); }\n.fa-fid-who { display: flex; flex-direction: column; gap: 2px; min-width: 0; }\n.fa-fid-who b { font-size: 16px; font-weight: 600; color: var(--page-text-color); }\n.fa-fid-who span { font-size: 13px; color: var(--neutral-light); }\n.fa-fid-who i { font-style: normal; margin: 0 4px; color: var(--border-color); }\n.fa-fid-sec > obs-key-value + obs-key-value { margin-top: -8px; }\n', '.fa-fid-h { margin: 0; font-size: 16px; font-weight: 500; color: var(--page-text-color); }\n.fa-fid { display: flex; flex-direction: column; }\n.fa-fid-pane { padding-top: var(--ds-padding-md, 16px); }\n.fa-fid-sum { display: flex; flex-direction: column; gap: var(--ds-padding-xs, 8px); }\n.fa-fid-sum obs-key-value { margin: 0 -10px; }\n.fa-fid-div { --divider-my: 8px; }\n.fa-fid-hd { display: flex; align-items: flex-start; gap: var(--ds-padding-sm, 12px); min-width: 0; font-size: 13px; font-weight: 400; }\n.fa-fid-tile { flex: 0 0 36px; height: 36px; display: grid; place-items: center; border-radius: var(--btn-radius, 4px);\n  background: var(--neutral-lightest); color: var(--page-text-color); }\n.fa-fid-who { display: flex; flex-direction: column; gap: 6px; min-width: 0; }\n.fa-fid-nm { display: flex; align-items: center; gap: 6px; min-width: 0; white-space: nowrap; }\n.fa-fid-nm b { font-size: 18px; font-weight: 500; color: var(--page-text-color); }\n.fa-fid-nm span { font-size: 13px; color: var(--neutral-light); overflow: hidden; text-overflow: ellipsis; }\n.fa-fid-chips { display: flex; flex-wrap: wrap; gap: 6px; }\n', 'fi details v3 css')
    rep(':host(.fa-fid-gen) .kv.v-card{', ':host(.fa-fid-kv) .kv.cols-1{max-width:none}:host(.fa-fid-kv) .kv tr:hover td.val{background:none}:host(.fa-fid-kv) .kv .k{width:35%;font-weight:400}:host(.fa-fid-gen) .kv.v-card{', 'fi details v3 kv hook')
    # Policies Management tab: "Policy and Object Status" → "Policy & Object Approval" (2026-10-19)
    rep("{ value: STATUS_SEC, text: 'Policy and Object Status' }", "{ value: STATUS_SEC, text: 'Policy & Object Approval' }", 'tab rename 0')
    rep('`Not on ${f.dev} until pushed from Policy and Object Status.`', '`Not on ${f.dev} until pushed from Policy & Object Approval.`', 'tab rename 1')
    rep('until the request is pushed from Policy and Object Status.</p>', 'until the request is pushed from Policy & Object Approval.</p>', 'tab rename 2')
    rep('`Not on ${r.device} until pushed from Policy and Object Status.`', '`Not on ${r.device} until pushed from Policy & Object Approval.`', 'tab rename 3')
    # Device details: Summary only, no tabs (2026-10-19)
    rep('      <obs-tabs id="fidTabs" value="${pane}" tabs=\'${j(FID_TABS)}\'></obs-tabs>\n      <div id="fidPane" class="fa-fid-pane" data-tab="${pane}">${FID_PANES[pane](d)}</div>', '      <div id="fidPane" class="fa-fid-pane" data-tab="summary">${fwDetailsSummary(d)}</div>', 'fid summary only')
    rep("  fwDetails = { dev: d, tab: 'summary' };\n  credDrawer.setAttribute('width', '56%');", "  fwDetails = { dev: d, tab: 'summary' };   /* Summary only (owner, 19 Oct 2026) — no tab strip, the drawer's own 40% */", 'fid no wide')
    # Device details: only the identifying fields (2026-10-19)
    rep("  const dev = [\n    ['Name', d.name], ['IP/Host', d.mgmt], ['System OID', d.sysOid], ['Type', 'Firewall'],\n    ['Vendor', fwVendorName(d)], ['Model', d.vendor], ['Template', t ? t.name : 'Not assigned'],\n    ['Group', (inv.groups || []).join(', ') || '—'], ['Tags', (inv.tags || []).join(', ') || '—'],\n    status, ['Management', on ? 'On' : 'Off', '', on ? 'on' : 'off'], cred\n  ];\n  const sys = [\n    ['Site', d.site || '—'], ['HA Role', d.ha || '—'], ['Service', d.service || '—'], ['Version', d.version || '—'],\n    ['Config Changed', d.changed || '—'], ['Throughput', d.throughput || '—'],\n    ['Policies', d.rules == null ? '—' : nf(d.rules)],\n    ['Findings', d.findings == null ? '—' : nf(d.findings), d.findings ? '--severity-warning' : ''],\n    ['Critical Findings', d.critical == null ? '—' : nf(d.critical), d.critical ? '--severity-critical' : ''],\n    ['Last Log', d.lastLog || '—'], ['Added On', d.since || '—']\n  ];\n", '  /* only what identifies the firewall (owner, 19 Oct 2026: "show only need details, remove the extra"): the grid row\n     already carries status, management and credential; Type is always Firewall; Service repeats the tag; the counts,\n     throughput and log age are live readings that belong to the firewall\'s own screens */\n  const dev = [\n    [\'Name\', d.name], [\'IP/Host\', d.mgmt], [\'System OID\', d.sysOid], [\'Vendor\', fwVendorName(d)], [\'Model\', d.vendor],\n    [\'Template\', t ? t.name : \'Not assigned\'], [\'Group\', (inv.groups || []).join(\', \') || \'—\'], [\'Tags\', (inv.tags || []).join(\', \') || \'—\']\n  ];\n  const sys = [[\'Site\', d.site || \'—\'], [\'HA Role\', d.ha || \'—\'], [\'Version\', d.version || \'—\'], [\'Added On\', d.since || \'—\']];\n', 'fid trim fields')
    rep("  const t = fwTemplateOf(d), cs = credStatusOf(d), inv = invRowOf(d), on = fwManaged(d);\n  const status = d.status === 'warning' ? ['Status', 'Warning', '--severity-warning'] : ['Status', STATUS_LABEL[d.status] || d.status, '', d.status];\n  const cred = cs.kind === 'ok' ? ['Credential', 'Successful', '', 'success'] : cs.kind === 'fail' ? ['Credential', 'Failed', '', 'failed']\n    : ['Credential', cs.kind === 'add' ? 'Not added' : 'Not applicable'];\n", '  const t = fwTemplateOf(d), inv = invRowOf(d);\n', 'fid trim vars')
    # Policies Management: the Add button carries no + glyph (2026-10-19)
    rep('<obs-button variant="primary" id="pmAdd" data-add="${what}"><obs-icon name="plus" size="14"></obs-icon>&nbsp;${PM_ADD[what]}</obs-button>', '<obs-button variant="primary" id="pmAdd" data-add="${what}">${PM_ADD[what]}</obs-button>', 'pm add no plus')
    # Policies Management › Policies: overview KPI row (2026-10-19)
    rep('  return `<div class="fa-stack">\n    ${panel(`\n      ${stdGridHost(\'pmRulesGrid\')}', '  return `<div class="fa-stack">\n    ${pmRulesOverview(rules, dev)}\n    ${panel(`\n      ${stdGridHost(\'pmRulesGrid\')}', 'pm ov call')
    rep('let PM_COLS = [], PM_FIELDS = [];', 'let PM_COLS = [], PM_FIELDS = [];\n/* the Policies overview (owner, 19 Oct 2026: "some details of policy related overview card"): six obs-kpi-card tiles —\n   the DS KPI widget the firewall Overview already uses — over the same rules the grid lists, so the two cannot disagree.\n   Each figure is read the way the grid\'s Tag column reads it (ruleTags): Used = hit at least once, Unassigned = an\n   "any" in source / destination / service / either interface. A count turns amber / red only when it is a problem. */\nfunction pmRulesOverview(rules, dev) {\n  const n = rules.length, pct = v => (n ? Math.round(v / n * 100) : 0) + \'%\';\n  const allow = rules.filter(r => /^allow/i.test(r.action)).length;\n  const used = rules.filter(r => r.hitsTotal > 0).length;\n  const unasg = rules.filter(r => ruleTags(r).includes(\'Unassigned\')).length;\n  const findings = rules.filter(r => r.finding && r.finding !== \'clean\').length;\n  const pend = pendingOf(dev || null), pendPol = pend.filter(p => p.kind === \'Policy\').length;\n  const kpi = o => `<obs-kpi-card class="fa-ov-kpi fa-pm-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : \'\'}\n    value="${esc(String(o.value))}" stats=\'${j(o.stats)}\'></obs-kpi-card>`;\n  return `<div class="fa-grid cols-6 fa-ov-tiles fa-pm-ov">${[\n    kpi({ title: \'Total Policies\', icon: \'secure\', value: nf(n), stats: [{ label: \'Firewalls\', value: String(new Set(rules.map(r => r.device)).size) }] }),\n    kpi({ title: \'Allow\', icon: \'check-circle\', sev: \'clear\', value: nf(allow), stats: [{ label: \'Deny\', value: nf(n - allow) }] }),\n    kpi({ title: \'Unused\', icon: \'ban\', sev: n - used ? \'warning\' : \'clear\', value: nf(n - used), stats: [{ label: \'Used\', value: nf(used) }] }),\n    kpi({ title: \'Unassigned\', icon: \'exclamation-circle\', sev: unasg ? \'warning\' : \'clear\', value: nf(unasg), stats: [{ label: \'Share\', value: pct(unasg) }] }),\n    kpi({ title: \'With Findings\', icon: \'times-circle\', sev: findings ? \'critical\' : \'clear\', value: nf(findings), stats: [{ label: \'Clean\', value: nf(n - findings) }] }),\n    kpi({ title: \'Pending Approval\', icon: \'history\', sev: pendPol ? \'warning\' : \'clear\', value: nf(pendPol), stats: [{ label: \'All changes\', value: nf(pend.length) }] })\n  ].join(\'\')}</div>`;\n}', 'pm ov fn')
    rep('obs-kpi-card.fa-ov-kpi { display: block; min-width: 0; --kpi-card-min-height: 150px; }', 'obs-kpi-card.fa-ov-kpi { display: block; min-width: 0; --kpi-card-min-height: 150px; }\nobs-kpi-card.fa-pm-kpi { --kpi-card-min-height: 120px; }\n.fa-pm-ov { margin-bottom: var(--ds-padding-md, 16px); }', 'pm ov css')
    # Policies overview cards: one row each — icon left, title + stat, value right (2026-10-19)
    rep(':host(.fa-ov-kpi) .kpi[class]{--chip-bg:var(--primary-alt,#1d2a3e);--chip-fg:var(--page-background-color,#fff)}', ':host(.fa-ov-kpi) .kpi[class]{--chip-bg:var(--primary-alt,#1d2a3e);--chip-fg:var(--page-background-color,#fff)}:host(.fa-pm-kpi) .kpi{flex-direction:row;align-items:center;justify-content:flex-start;gap:12px;min-height:0;padding:12px 16px}:host(.fa-pm-kpi) .top{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;column-gap:12px;row-gap:2px;flex:1 1 auto;min-width:0}:host(.fa-pm-kpi) .chip{grid-row:1 / span 2;width:40px;height:40px}:host(.fa-pm-kpi) .title{margin:0;font-size:14px;line-height:20px}:host(.fa-pm-kpi) .stats{grid-column:2}:host(.fa-pm-kpi) .foot{flex:0 0 auto;align-items:center}:host(.fa-pm-kpi) .fc{flex:0 0 auto}', 'pm kpi row hook')
    rep('value="${esc(String(o.value))}" stats=\'${j(o.stats)}\'></obs-kpi-card>`;', 'value="${esc(String(o.value))}" size="medium" stats=\'${j(o.stats)}\'></obs-kpi-card>`;', 'pm kpi medium')
    rep('obs-kpi-card.fa-pm-kpi { --kpi-card-min-height: 120px; }', 'obs-kpi-card.fa-pm-kpi { --kpi-card-min-height: 0px; }', 'pm kpi minh')
    # Policies overview: 3 + 3 (2026-10-19)
    rep('.fa-pm-ov { margin-bottom: var(--ds-padding-md, 16px); }', '.fa-pm-ov { margin-bottom: var(--ds-padding-md, 16px); }\n.fa-grid.cols-6.fa-ov-tiles.fa-pm-ov { grid-template-columns: repeat(3, minmax(0, 1fr)); }', 'pm kpi 3x2')
    # Objects overview KPI row, 3 + 3 (2026-10-19)
    rep('    TAG_FIELD([\'Assigned\', \'Unassigned\'])\n  ] };\n  return `<div class="fa-stack">\n    ${panel(`\n      ${stdGridHost(grid)}', '    TAG_FIELD([\'Assigned\', \'Unassigned\'])\n  ] };\n  return `<div class="fa-stack">\n    ${pmObjectsOverview(inView, dev)}\n    ${panel(`\n      ${stdGridHost(grid)}', 'obj ov call')
    rep('const OBJ_GRIDS = {};', 'const OBJ_GRIDS = {};\n/* the Objects overview (owner, 19 Oct 2026: "the same changes in Objects"): the Policies row\'s six DS KPI cards, 3 + 3,\n   over the objects the grid lists — Assigned / Unassigned read exactly as the grid\'s Tag column (objectTags) */\nfunction pmObjectsOverview(objs, dev) {\n  const n = objs.length, pct = v => (n ? Math.round(v / n * 100) : 0) + \'%\';\n  const cnt = k => objs.filter(o => o.kind === k).length;\n  const asg = objs.filter(o => objectTags(o).includes(\'Assigned\')).length;\n  const pend = pendingOf(dev || null), pendObj = pend.filter(p => p.kind === \'Object\').length;\n  const kpi = o => `<obs-kpi-card class="fa-ov-kpi fa-pm-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : \'\'}\n    value="${esc(String(o.value))}" size="medium" stats=\'${j(o.stats)}\'></obs-kpi-card>`;\n  return `<div class="fa-grid cols-6 fa-ov-tiles fa-pm-ov">${[\n    kpi({ title: \'Total Objects\', icon: \'secure\', value: nf(n), stats: [{ label: \'Firewalls\', value: String(new Set(objs.map(o => o.device)).size) }] }),\n    kpi({ title: \'Addresses\', icon: \'network\', value: nf(cnt(\'Address\')), stats: [{ label: \'Groups\', value: nf(cnt(\'Address group\')) }] }),\n    kpi({ title: \'Services\', icon: \'cog\', value: nf(cnt(\'Service\')), stats: [{ label: \'Groups\', value: nf(cnt(\'Service group\')) }] }),\n    kpi({ title: \'Assigned\', icon: \'check-circle\', value: nf(asg), stats: [{ label: \'Share\', value: pct(asg) }] }),\n    kpi({ title: \'Unassigned\', icon: \'exclamation-circle\', sev: n - asg ? \'warning\' : \'clear\', value: nf(n - asg), stats: [{ label: \'Share\', value: pct(n - asg) }] }),\n    kpi({ title: \'Pending Approval\', icon: \'history\', sev: pendObj ? \'warning\' : \'clear\', value: nf(pendObj), stats: [{ label: \'All changes\', value: nf(pend.length) }] })\n  ].join(\'\')}</div>`;\n}', 'obj ov fn')
    # View Object / View Policy read-only drawers from the name cells (2026-10-19)
    rep("    { key: 'name', title: 'Policy Name', width: 220, ...(sev ? { type: 'severity' } : {}) },", "    { key: 'name', title: 'Policy Name', width: 220, ...(sev ? { type: 'severity' } : links ? { type: 'link' } : {}) },", 'pol name link')
    rep("    { key: 'name', title: 'Object Name', width: 200, fixed: true },\n    { key: 'kind', title: 'Object Type', width: 150 },", "    { key: 'name', title: 'Object Name', width: 200, fixed: true, type: 'link' },\n    { key: 'kind', title: 'Object Type', width: 150 },", 'obj name link')
    rep("    if (p.key === 'src' || p.key === 'dst') objectDetailDrawer(r.device, r[p.key]);", "    if (p.key === 'name') { viewPolicyDrawer(r.id); return; }\n    if (p.key === 'src' || p.key === 'dst') objectDetailDrawer(r.device, r[p.key]);", 'pol name click')
    rep("  if (pmObjs) pmObjs.addEventListener('cellaction', e => { const p = detailOf(e) || {}; if (p.key === 'assoc' && p.id) assocRulesDrawer(p.id); });", "  if (pmObjs) pmObjs.addEventListener('cellaction', e => { const p = detailOf(e) || {};\n    if (p.key === 'name' && p.id) viewObjectDrawer(p.id);\n    if (p.key === 'assoc' && p.id) assocRulesDrawer(p.id); });", 'obj name click')
    rep('/* Policies and Objects Analytics */\nfunction screenPolicy(', '/* VIEW OBJECT / VIEW POLICY (owner, 19 Oct 2026 — the product\'s "View User Profile" as the reference): the name in the\n   Objects / Policies grid opens a READ-ONLY drawer laid out like the Add form — two columns, label over a disabled\n   field, lists as chips — so viewing and adding read as one form. Every value is the grid row\'s own. */\nfunction pmViewHTML(rows) {\n  const ro = v => pmRo(v == null || v === \'\' ? \'—\' : String(v));\n  const chips = (list, variant = \'\') => `<div class="fa-pmv-chips">${(list || []).length ? list.map(x => `<obs-tag${variant ? ` variant="${variant}"` : \'\'}>${esc(x)}</obs-tag>`).join(\'\')\n    : \'<span class="fa-muted">—</span>\'}</div>`;\n  return `<div class="fa-pmf-form fa-pmv"><div class="fa-grid cols-2">${rows.map(([label, v, kind, variant, wide]) => {\n    const html = field(label, kind === \'chips\' ? chips(v, variant) : kind === \'html\' ? v : ro(v));\n    return wide ? `<div class="fa-pmf-wide">${html}</div>` : html;\n  }).join(\'\')}</div></div>`;\n}\nfunction viewObjectDrawer(id) {\n  const o = D.objects.find(x => x.id === id); if (!o) return;\n  const d = D.devices.find(x => x.name === o.device), tags = objectTags(o);\n  openDrawer(\'View Object\', pmViewHTML([\n    [\'Object Name\', o.name], [\'Description\', o.desc],\n    [\'Device Name\', o.device], [\'Mode\', pmMode(d) || \'Not collected\'],\n    [\'Object Type\', o.kind], [\'Associated Policies\', objAssocRules(o).length],\n    isGroupObj(o) ? [\'Members\', o.members, \'chips\', \'\', true] : [isAddrType(o.kind) ? \'Address\' : \'Service\', o.value, \'\', \'\', true],\n    [\'Tag\', tags, \'chips\', tags.includes(\'Unassigned\') ? \'tag-orange\' : \'tag-green\']\n  ]), \'\', \'40%\');\n}\nfunction viewPolicyDrawer(id) {\n  const r = D.rules.find(x => x.id === id); if (!r) return;\n  const tags = ruleTags(r);\n  openDrawer(\'View Policy\', pmViewHTML([\n    [\'Policy ID\', r.seq], [\'Policy Name\', r.name],\n    [\'Device Name\', r.device], [\'Policy Action\', `<div class="fa-pmv-chips"><obs-tag variant="${/^allow/i.test(r.action) ? \'tag-green\' : \'tag-red\'}">${esc(r.action)}</obs-tag></div>`, \'html\'],\n    [\'Source\', [r.src], \'chips\'], [\'Destination\', [r.dst], \'chips\'],\n    [\'Source Interface\', ruleIntf(r, \'srcIntf\')], [\'Destination Interface\', ruleIntf(r, \'dstIntf\')],\n    [\'Services\', [r.svc], \'chips\'], [\'Log\', r.log],\n    [\'Last update Policy Time\', ruleLastUpdate(r)], [\'Hits\', r.hits == null ? \'—\' : nf(r.hits)],\n    [\'Tag\', tags, \'chips\', tags.includes(\'Unused\') || tags.includes(\'Unassigned\') ? \'tag-orange\' : \'tag-green\', true]\n  ]), \'\', \'40%\');\n}\n\n/* Policies and Objects Analytics */\nfunction screenPolicy(', 'pm view drawers')
    rep('#pmAddDrawer .fa-pmf-form { gap: 20px; }', '#pmAddDrawer .fa-pmf-form { gap: 20px; }\n.fa-pmv .fa-grid { column-gap: 32px; row-gap: 20px; }\n.fa-pmv .fa-field { gap: 7px; }\n.fa-pmv .fa-field-label { color: var(--neutral-light); font-size: 14px; line-height: 18px; }\n.fa-pmv-chips { display: flex; flex-wrap: wrap; gap: 6px; min-height: 22px; align-items: center; }', 'pm view css')
    # Add / View Policy: Policy Name | Device Name lead the form (2026-10-19)
    rep('      ${pmAll() && !f.edit ? pmSelect(ns, f, \'dev\', \'Device Name\', D.devices.map(x => x.name), { req: true })\n        : field(\'Device Name\', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}\n      ${field(\'Mode\', `<obs-input type="text" block disabled value="${esc(mode || \'Not collected\')}"></obs-input>`)}\n      ${f.edit ? field(\'Policy ID\', pmRo(f.seq)) : pmInput(ns, f, \'seq\', \'Policy ID\', { req: true, type: \'number\' })}\n      ${pmInput(ns, f, \'name\', \'Policy Name\', { req: true, ph: \'Must be unique\' })}', '      ${pmInput(ns, f, \'name\', \'Policy Name\', { req: true, ph: \'Must be unique\' })}\n      ${pmAll() && !f.edit ? pmSelect(ns, f, \'dev\', \'Device Name\', D.devices.map(x => x.name), { req: true })\n        : field(\'Device Name\', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}\n      ${f.edit ? field(\'Policy ID\', pmRo(f.seq)) : pmInput(ns, f, \'seq\', \'Policy ID\', { req: true, type: \'number\' })}\n      ${field(\'Mode\', `<obs-input type="text" block disabled value="${esc(mode || \'Not collected\')}"></obs-input>`)}', 'policy form name+dev first')
    rep("    ['Policy ID', r.seq], ['Policy Name', r.name],\n    ['Device Name', r.device], ['Policy Action',", "    ['Policy Name', r.name], ['Device Name', r.device],\n    ['Policy ID', r.seq], ['Policy Action',", 'view policy name+dev first')
    # One system tag per policy / NAT row (2026-10-19)
    rep("const ruleTags = r => [r.hitsTotal > 0 ? 'Used' : 'Unused']\n  .concat([r.src, r.dst, r.svc, r.srcIntf, r.dstIntf].includes('any') ? ['Unassigned'] : []);", '/* ONE system tag per row (owner, 19 Oct 2026: "the tag is system generated, it shows a single tag"): Unassigned wins\n   (an "any" in source / destination / service / either interface is the finding whether or not it is hit), then Unused\n   (never hit), else Used — so the three tags partition the rule base and the overview cards add up to the total */\nconst ruleTags = r => [[r.src, r.dst, r.svc, r.srcIntf, r.dstIntf].includes(\'any\') ? \'Unassigned\' : r.hitsTotal > 0 ? \'Used\' : \'Unused\'];', 'one tag rule')
    rep("const natTags = n => [n.hits > 0 ? 'Used' : 'Unused'].concat(natAssigned(n) ? [] : ['Unassigned']);", "const natTags = n => [!natAssigned(n) ? 'Unassigned' : n.hits > 0 ? 'Used' : 'Unused'];   /* one tag, same precedence as ruleTags */", 'one tag nat')
    rep("  const used = rules.filter(r => r.hitsTotal > 0).length;\n  const unasg = rules.filter(r => ruleTags(r).includes('Unassigned')).length;", "  const tagN = k => rules.filter(r => ruleTags(r)[0] === k).length;\n  const used = tagN('Used'), unused = tagN('Unused'), unasg = tagN('Unassigned');", 'ov tag counts')
    rep("    kpi({ title: 'Unused', icon: 'ban', sev: n - used ? 'warning' : 'clear', value: nf(n - used), stats: [{ label: 'Used', value: nf(used) }] }),", "    kpi({ title: 'Unused', icon: 'ban', sev: unused ? 'warning' : 'clear', value: nf(unused), stats: [{ label: 'Used', value: nf(used) }] }),", 'ov unused')
    # Add Policy: Policy Description is a one-line field beside Policy Name (2026-10-19)
    rep("      ${pmInput(ns, f, 'name', 'Policy Name', { req: true, ph: 'Must be unique' })}\n      ${pmAll() && !f.edit ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true })", "      ${pmInput(ns, f, 'name', 'Policy Name', { req: true, ph: 'Must be unique' })}\n      ${pmInput(ns, f, 'desc', 'Policy Description')}\n      ${pmAll() && !f.edit ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true })", 'pol desc beside name')
    rep("      ${pmSelect(ns, f, 'status', 'Policy Status', ['Enable', 'Disable'])}\n      ${pmInput(ns, f, 'desc', 'Policy Description', { type: 'textarea', wide: true })}\n    </div>", "      ${pmSelect(ns, f, 'status', 'Policy Status', ['Enable', 'Disable'])}\n    </div>", 'pol desc no textarea')
    rep('      ${f.edit ? field(\'Policy ID\', pmRo(f.seq)) : pmInput(ns, f, \'seq\', \'Policy ID\', { req: true, type: \'number\' })}\n      ${field(\'Mode\', `<obs-input type="text" block disabled value="${esc(mode || \'Not collected\')}"></obs-input>`)}', '      ${field(\'Mode\', `<obs-input type="text" block disabled value="${esc(mode || \'Not collected\')}"></obs-input>`)}\n      ${f.edit ? field(\'Policy ID\', pmRo(f.seq)) : pmInput(ns, f, \'seq\', \'Policy ID\', { req: true, type: \'number\' })}', 'pol form dev+mode pair')
    # Policies Management drawers: "Device Name" → "Firewall Name" (2026-10-19)
    rep('      ${pmAll() && !f.edit ? pmSelect(ns, f, \'dev\', \'Device Name\', D.devices.map(x => x.name), { req: true })\n        : field(\'Device Name\', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}', '      ${pmAll() && !f.edit ? pmSelect(ns, f, \'dev\', \'Firewall Name\', D.devices.map(x => x.name), { req: true })\n        : field(\'Firewall Name\', `<obs-input type="text" block disabled value="${esc(f.dev)}"></obs-input>`)}', 'fw name policy')
    rep("      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true }) : ''}", "      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Firewall Name', D.devices.map(x => x.name), { req: true }) : ''}", 'fw name object')
    rep("    ['Device Name', o.device], ['Mode', pmMode(d) || 'Not collected'],", "    ['Firewall Name', o.device], ['Mode', pmMode(d) || 'Not collected'],", 'fw name view obj')
    rep("    ['Policy Name', r.name], ['Device Name', r.device],", "    ['Policy Name', r.name], ['Firewall Name', r.device],", 'fw name view pol')
    # Objects overview: one joined obs-stat-card, no Services (2026-10-20)
    rep('function pmObjectsOverview(objs, dev) {\n  const n = objs.length, pct = v => (n ? Math.round(v / n * 100) : 0) + \'%\';\n  const cnt = k => objs.filter(o => o.kind === k).length;\n  const asg = objs.filter(o => objectTags(o).includes(\'Assigned\')).length;\n  const pend = pendingOf(dev || null), pendObj = pend.filter(p => p.kind === \'Object\').length;\n  const kpi = o => `<obs-kpi-card class="fa-ov-kpi fa-pm-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : \'\'}\n    value="${esc(String(o.value))}" size="medium" stats=\'${j(o.stats)}\'></obs-kpi-card>`;\n  return `<div class="fa-grid cols-6 fa-ov-tiles fa-pm-ov">${[\n    kpi({ title: \'Total Objects\', icon: \'secure\', value: nf(n), stats: [{ label: \'Firewalls\', value: String(new Set(objs.map(o => o.device)).size) }] }),\n    kpi({ title: \'Addresses\', icon: \'network\', value: nf(cnt(\'Address\')), stats: [{ label: \'Groups\', value: nf(cnt(\'Address group\')) }] }),\n    kpi({ title: \'Services\', icon: \'cog\', value: nf(cnt(\'Service\')), stats: [{ label: \'Groups\', value: nf(cnt(\'Service group\')) }] }),\n    kpi({ title: \'Assigned\', icon: \'check-circle\', value: nf(asg), stats: [{ label: \'Share\', value: pct(asg) }] }),\n    kpi({ title: \'Unassigned\', icon: \'exclamation-circle\', sev: n - asg ? \'warning\' : \'clear\', value: nf(n - asg), stats: [{ label: \'Share\', value: pct(n - asg) }] }),\n    kpi({ title: \'Pending Approval\', icon: \'history\', sev: pendObj ? \'warning\' : \'clear\', value: nf(pendObj), stats: [{ label: \'All changes\', value: nf(pend.length) }] })\n  ].join(\'\')}</div>`;\n}\n', 'function pmObjectsOverview(objs, dev) {\n  /* one JOINED obs-stat-card, hairline-split columns (owner, 20 Oct 2026 — the DS overview-card page\'s "Stat cards — the\n     four postures joined into one card" as the reference); Services left the row on the same request */\n  const n = objs.length, pct = v => nf(v) + \' of \' + nf(n) + \' objects\';   /* a count, not a % (owner, 20 Oct 2026) */\n  const cnt = k => objs.filter(o => o.kind === k).length;\n  const asg = objs.filter(o => objectTags(o).includes(\'Assigned\')).length;\n  const pend = pendingOf(dev || null), pendObj = pend.filter(p => p.kind === \'Object\').length;\n  const items = [\n    { label: \'Total Objects\', value: nf(n), caption: new Set(objs.map(o => o.device)).size + \' firewalls\' },\n    { label: \'Addresses\', value: nf(cnt(\'Address\')), caption: nf(cnt(\'Address group\')) + \' address groups\' },\n    { label: \'Assigned\', value: nf(asg), caption: pct(asg) },\n    { label: \'Unassigned\', value: nf(n - asg), caption: pct(n - asg), ...(n - asg ? { valueSeverity: \'warning\' } : {}) },\n    { label: \'Pending Approval\', value: nf(pendObj), caption: nf(pend.length) + \' changes in all\' }\n  ];\n  return `<obs-stat-card class="fa-pm-stats" items=\'${j(items)}\'></obs-stat-card>`;\n}\n', 'obj ov joined')
    rep('.fa-pm-ov { margin-bottom: var(--ds-padding-md, 16px); }', '.fa-pm-ov { margin-bottom: var(--ds-padding-md, 16px); }\nobs-stat-card.fa-pm-stats { display: block; margin-bottom: var(--ds-padding-md, 16px); }', 'obj ov joined css')
    rep("    { label: 'Assigned', value: nf(asg), caption: pct(asg) },\n    { label: 'Unassigned', value: nf(n - asg), caption: pct(n - asg), ...(n - asg ? { valueSeverity: 'warning' } : {}) },", '    /* the caption says what the count is MADE OF (it repeated the figure above it), the bar shows its share of the total\n       (owner, 20 Oct 2026: "improve 34 of 47 objects") — both counts, no % */\n    { label: \'Assigned\', value: nf(asg), caption: mix(o => objectTags(o).includes(\'Assigned\')), percent: n ? asg / n * 100 : 0, barSeverity: \'clear\' },\n    { label: \'Unassigned\', value: nf(n - asg), caption: mix(o => !objectTags(o).includes(\'Assigned\')), percent: n ? (n - asg) / n * 100 : 0,\n      barSeverity: \'warning\', ...(n - asg ? { valueSeverity: \'warning\' } : {}) },', 'obj ov caption mix')
    rep("  const pend = pendingOf(dev || null), pendObj = pend.filter(p => p.kind === 'Object').length;\n  const items = [", "  const pend = pendingOf(dev || null), pendObj = pend.filter(p => p.kind === 'Object').length;\n  const mix = f => { const sel = objs.filter(f), g = sel.filter(isGroupObj).length, one = sel.length - g;\n    return `${nf(one)} object${one === 1 ? '' : 's'} · ${nf(g)} group${g === 1 ? '' : 's'}`; };\n  const items = [", 'obj ov mix fn')
    # Add Object: wide drawer with a Network / Service Object rail (2026-10-20)
    rep('  pmAddDrawer.setAttribute(\'title\', pmf.edit ? \'Edit Policy\' : PM_ADD[pmf.kind]);\n  pmAddDrawer.innerHTML = `<div class="fa-pmf">\n    <div id="pmfBody">${pmf.kind === \'policy\' ? policyFormBody(pmf) : objectFormBody(\'pmf\', pmf)}</div>\n    <div class="ds-cred-foot" id="pmfFoot" data-reason="${esc(pmfReason(pmf))}">${pmFoot(\'pmf\', pmf)}</div>\n  </div><div id="pmStack"></div>`;', '  pmAddDrawer.setAttribute(\'title\', pmf.edit ? \'Edit Policy\' : PM_ADD[pmf.kind]);\n  /* Add Object = the wide category drawer (owner, 20 Oct 2026 — IPAM\'s "Create Subnet Discovery Profile" as the\n     reference): a rail of the two object families, Network Object (Address / Address group) and Service Object\n     (Service / Service group), the chosen family\'s form beside it under its own heading. Policy keeps the 40% form. */\n  const wide = pmf.kind === \'object\';\n  pmAddDrawer.setAttribute(\'width\', \'40%\');   /* Add Object back to 40% like Add Policy (owner, 20 Oct 2026) */\n  if (wide && !pmf.cat) pmfObjCat(isAddrType(pmf.type) ? \'network\' : \'service\', true);\n  const cat = wide ? PMO_CATS[pmf.cat] : null;\n  const body = `<div id="pmfBody">${pmf.kind === \'policy\' ? policyFormBody(pmf) : objectFormBody(\'pmf\', pmf)}</div>`;\n  pmAddDrawer.innerHTML = `<div class="fa-pmf${wide ? \' fa-pmo-wide\' : \'\'}">\n    ${wide ? `<div class="fa-pmo-cols">\n      <nav class="fa-pmo-rail" aria-label="Object type">${Object.keys(PMO_CATS).map(k =>\n        `<button type="button" class="fa-pmo-cat${k === pmf.cat ? \' on\' : \'\'}" data-pmo-cat="${k}" aria-pressed="${k === pmf.cat}">${PMO_CATS[k].label}</button>`).join(\'\')}</nav>\n      <div class="fa-pmo-main"><h3 class="fa-pmo-h">${cat.label}</h3><p class="fa-pmo-sub">${esc(cat.help)}</p>${body}</div>\n    </div>` : body}\n    <div class="ds-cred-foot" id="pmfFoot" data-reason="${esc(pmfReason(pmf))}">${pmFoot(\'pmf\', pmf)}</div>\n  </div><div id="pmStack"></div>`;\n  pmAddDrawer.querySelectorAll(\'[data-pmo-cat]\').forEach(b => b.addEventListener(\'click\', () => {\n    if (b.getAttribute(\'data-pmo-cat\') === pmf.cat) return;\n    pmfObjCat(b.getAttribute(\'data-pmo-cat\')); paintPmAdd();\n  }));', 'pmo wide paint')
    rep('function paintPmFoot(ns) {', "const PMO_CATS = {\n  network: { label: 'Network Object', types: ['Address', 'Address group'],\n    help: 'An address or a group of addresses the firewall policies can match as a source or a destination.' },\n  service: { label: 'Service Object', types: ['Service', 'Service group'],\n    help: 'A protocol and port, or a group of them, the firewall policies can match as the service.' }\n};\n/* switching family keeps what is family-neutral (name, description, firewall) and resets the type and its members */\nfunction pmfObjCat(k, keepType) {\n  if (!PMO_CATS[k]) return;\n  pmf.cat = k; pmf.types = PMO_CATS[k].types;\n  if (!keepType || !pmf.types.includes(pmf.type)) { pmf.type = pmf.types[0]; pmf.members = []; }\n}\nfunction paintPmFoot(ns) {", 'pmo cats')
    rep('.fa-pmv .fa-grid { column-gap: 32px; row-gap: 20px; }', '.fa-pmv .fa-grid { column-gap: 32px; row-gap: 20px; }\n.fa-pmo-wide { display: flex; flex-direction: column; min-height: 100%; }\n.fa-pmo-cols { display: grid; grid-template-columns: 180px minmax(0, 1fr); flex: 1 1 auto; min-height: 0; }\n.fa-pmo-rail { display: flex; flex-direction: column; gap: 4px; padding-right: 16px; border-right: 1px solid var(--border-color); }\n.fa-pmo-cat { all: unset; box-sizing: border-box; padding: 10px 12px; border-radius: var(--btn-radius, 4px); cursor: pointer;\n  font-size: 14px; color: var(--neutral-light); }\n.fa-pmo-cat:hover { color: var(--page-text-color); background: var(--neutral-lightest); }\n.fa-pmo-cat.on { color: var(--page-text-color); background: var(--neutral-lighter); font-weight: 500; }\n.fa-pmo-cat:focus-visible { outline: 2px solid var(--primary-alt); outline-offset: 1px; }\n.fa-pmo-main { padding: 4px 0 0 24px; min-width: 0; }\n.fa-pmo-h { margin: 0; font-size: 18px; font-weight: 500; color: var(--page-text-color); }\n.fa-pmo-sub { margin: 4px 0 20px; font-size: 13px; color: var(--neutral-light); }\n.fa-pmo-wide > .ds-cred-foot { padding-top: 16px; border-top: 1px solid var(--border-color); }', 'pmo wide css')
    # Network Object form: Name · Description · Type · Members List (2026-10-20)
    rep('const PM_SHAPE = { nat: 1, natAddr: 1, type: 1 };', 'const PM_SHAPE = { nat: 1, natAddr: 1, type: 1, ntype: 1 };', 'pmo ntype shape')
    rep("      if (k === 'type') { f.value = ''; f.members = []; }", "      if (k === 'type') { f.value = ''; f.members = []; }\n      if (k === 'ntype') { f.type = f.ntype === 'Address Group' ? 'Address group' : 'Address'; f.value = ''; f.members = []; }", 'pmo ntype put')
    rep('function objectFormBody(ns, f) {\n  const d = D.devices.find(x => x.name === f.dev), mode = pmMode(d);', '/* Network Object (owner, 20 Oct 2026 — FortiGate\'s address form as the reference): four fields — Object Name · Description\n   · Type (Address Group · IP Range · Subnet · FQDN) · Members List. A group picks its members from the firewall\'s\n   addresses (search + checkboxes); the other three types have no members, so that slot takes the value they name. The\n   Type is stored as the grid\'s kind (Address group / Address) with the chosen form kept as `ntype`. */\nconst NET_TYPES = [\'Address Group\', \'IP Range\', \'Subnet\', \'FQDN\'];\nconst NET_PH = { \'IP Range\': \'e.g. 192.0.2.10-192.0.2.40\', Subnet: \'e.g. 192.0.2.0/24\', FQDN: \'e.g. portal.example.com\' };\nfunction networkObjectBody(ns, f) {\n  const pool = [...new Set(pmChoices(f.dev).objs.filter(o => isAddrType(o.kind)).map(o => o.name))].sort();\n  return `<div class="fa-pmf-form"><div class="fa-grid cols-2">\n      ${pmInput(ns, f, \'name\', \'Object Name\', { req: true, ph: \'Must be unique\' })}\n      ${pmInput(ns, f, \'desc\', \'Description\')}\n      ${pmSelect(ns, f, \'ntype\', \'Type\', NET_TYPES, { req: true })}\n      ${f.ntype === \'Address Group\'\n        ? pmSelect(ns, f, \'members\', \'Members List\', pool, { req: true, multi: true, ph: \'Select Members\' })\n        : pmInput(ns, f, \'value\', f.ntype, { req: true, ph: NET_PH[f.ntype] || \'\' })}\n    </div></div>`;\n}\nfunction objectFormBody(ns, f) {\n  if (ns === \'pmf\' && f.cat === \'network\') return networkObjectBody(ns, f);\n  const d = D.devices.find(x => x.name === f.dev), mode = pmMode(d);', 'pmo network body')
    rep("  if (isGroupType(f.type)) return f.members.length ? '' : 'Pick at least one member';\n", "  if (isGroupType(f.type)) return f.members.length ? '' : 'Pick at least one member';\n  if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype} is required`;\n", 'pmo ntype reason')
    rep("  return isGroupType(f.type) ? `${f.type} of ${f.members.join(', ')}` : f.value.trim() ? `${f.type} ${f.value.trim()}` : f.type;", "  const tp = f.cat === 'network' && f.ntype ? f.ntype : f.type;\n  return isGroupType(f.type) ? `${tp} of ${f.members.join(', ')}` : f.value.trim() ? `${tp} ${f.value.trim()}` : tp;", 'pmo ntype summary')
    rep('  pmf.cat = k; pmf.types = PMO_CATS[k].types;\n  if (!keepType || !pmf.types.includes(pmf.type)) { pmf.type = pmf.types[0]; pmf.members = []; }', "  pmf.cat = k; pmf.types = PMO_CATS[k].types;\n  if (k === 'network') { if (!keepType || !pmf.ntype) { pmf.ntype = 'Address Group'; pmf.type = 'Address group'; pmf.members = []; pmf.value = ''; } return; }\n  if (!keepType || !pmf.types.includes(pmf.type)) { pmf.type = pmf.types[0]; pmf.members = []; }", 'pmo ntype default')
    # Add Object: the type rail becomes a segmented switch (2026-10-20)
    rep('    ${wide ? `<div class="fa-pmo-cols">\n      <nav class="fa-pmo-rail" aria-label="Object type">${Object.keys(PMO_CATS).map(k =>\n        `<button type="button" class="fa-pmo-cat${k === pmf.cat ? \' on\' : \'\'}" data-pmo-cat="${k}" aria-pressed="${k === pmf.cat}">${PMO_CATS[k].label}</button>`).join(\'\')}</nav>\n      <div class="fa-pmo-main"><h3 class="fa-pmo-h">${cat.label}</h3><p class="fa-pmo-sub">${esc(cat.help)}</p>${body}</div>\n    </div>` : body}', '    ${wide ? `<div class="fa-pmo-main">\n      <!-- the two families as a segmented switch (owner, 20 Oct 2026: "like Dashboard | NOC View", the rail removed) -->\n      <obs-radio as-button id="pmoCat" class="fa-pmo-seg" options=\'${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}\'></obs-radio>\n      ${body}</div>` : body}   <!-- no heading / help line: the switch names the family (owner, 20 Oct 2026) -->', 'pmo seg markup')
    rep("  pmAddDrawer.querySelectorAll('[data-pmo-cat]').forEach(b => b.addEventListener('click', () => {\n    if (b.getAttribute('data-pmo-cat') === pmf.cat) return;\n    pmfObjCat(b.getAttribute('data-pmo-cat')); paintPmAdd();\n  }));", "  const seg = pmAddDrawer.querySelector('#pmoCat');\n  if (seg) {\n    seg.value = pmf.cat;   /* a PROPERTY, as a string — obs-radio matches it strictly */\n    seg.addEventListener('change', e => { const k = keyOf(detailOf(e)) || seg.value;\n      if (!PMO_CATS[k] || k === pmf.cat) return; pmfObjCat(k); paintPmAdd(); });\n  }", 'pmo seg bind')
    rep('.fa-pmo-main { padding: 4px 0 0 24px; min-width: 0; }', '.fa-pmo-main { padding: 0; min-width: 0; flex: 1 1 auto; }\n.fa-pmo-seg { display: inline-block; margin-bottom: 20px; }', 'pmo seg css')
    # Add Object: the switch gets a label, Object Category (2026-10-20)
    rep('      <obs-radio as-button id="pmoCat" class="fa-pmo-seg" options=\'${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}\'></obs-radio>', '      <div class="fa-pmo-segf">${field(\'Object Category\', `<obs-radio as-button id="pmoCat" class="fa-pmo-seg" options=\'${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}\'></obs-radio>`)}</div>', 'pmo seg label')
    rep('.fa-pmo-seg { display: inline-block; margin-bottom: 20px; }', '.fa-pmo-seg { display: inline-block; }\n.fa-pmo-segf { margin-bottom: 20px; }\n.fa-pmo-segf .fa-field { gap: 7px; }\n.fa-pmo-segf .fa-field-label { color: var(--neutral-light); font-size: 14px; line-height: 18px; }\n.fa-pmo-segf .fa-field > obs-radio { align-self: flex-start; }', 'pmo seg label css')
    rep('      <div class="fa-pmo-segf">${field(\'Object Category\', `<obs-radio as-button id="pmoCat" class="fa-pmo-seg" options=\'${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}\'></obs-radio>`)}</div>', '', 'pmo cat out of head')
    rep('function networkObjectBody(ns, f) {', '/* Object Category sits on the form\'s SECOND line, after Object Name | Description (owner, 20 Oct 2026) */\nconst pmoCatField = () => `<div class="fa-pmo-segf">${field(\'Object Category\', `<obs-radio as-button id="pmoCat" class="fa-pmo-seg" options=\'${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}\'></obs-radio>`)}</div>`;\nfunction networkObjectBody(ns, f) {', 'pmo cat fn')
    rep("      ${pmInput(ns, f, 'desc', 'Description')}\n      ${pmSelect(ns, f, 'ntype', 'Type', NET_TYPES, { req: true })}", "      ${pmInput(ns, f, 'desc', 'Description')}\n      ${pmoCatField()}\n      ${pmSelect(ns, f, 'ntype', 'Type', NET_TYPES, { req: true })}", 'pmo cat in network')
    rep("      ${pmInput(ns, f, 'desc', 'Description')}\n      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Firewall Name', D.devices.map(x => x.name), { req: true }) : ''}", "      ${pmInput(ns, f, 'desc', 'Description')}\n      ${ns === 'pmf' && f.cat ? pmoCatField() : ''}\n      ${pmAll() && ns === 'pmf' ? pmSelect(ns, f, 'dev', 'Firewall Name', D.devices.map(x => x.name), { req: true }) : ''}", 'pmo cat in service')
    rep('.fa-pmo-segf { margin-bottom: 20px; }', '.fa-pmo-segf { margin-bottom: 0; }', 'pmo cat gap')
    # Network Object › IP Range: Start IP · End IP · Interface (2026-10-20)
    rep("      ${f.ntype === 'Address Group'\n        ? pmSelect(ns, f, 'members', 'Members List', pool, { req: true, multi: true, ph: 'Select Members' })\n        : pmInput(ns, f, 'value', f.ntype, { req: true, ph: NET_PH[f.ntype] || '' })}", "      ${f.ntype === 'Address Group'\n        ? pmSelect(ns, f, 'members', 'Members List', pool, { req: true, multi: true, ph: 'Select Members' })\n        : f.ntype === 'IP Range'\n        /* IP Range = Start IP · End IP · Interface (owner, 20 Oct 2026 — FortiGate's range form as the reference) */\n        ? `${pmInput(ns, f, 'startIp', 'Start IP', { req: true, ph: 'e.g. 192.0.2.10' })}\n           ${pmInput(ns, f, 'endIp', 'End IP', { req: true, ph: 'e.g. 192.0.2.40' })}\n           ${pmSelect(ns, f, 'intf', 'Interface', ['Any'].concat(pmChoices(f.dev).ports.filter(p => p !== 'any')))}`\n        : pmInput(ns, f, 'value', f.ntype, { req: true, ph: NET_PH[f.ntype] || '' })}", 'iprange fields')
    rep("      if (k === 'ntype') { f.type = f.ntype === 'Address Group' ? 'Address group' : 'Address'; f.value = ''; f.members = []; }", "      if (k === 'ntype') { f.type = f.ntype === 'Address Group' ? 'Address group' : 'Address'; f.value = ''; f.members = []; f.startIp = ''; f.endIp = ''; f.intf = 'Any'; }\n      if (k === 'startIp' || k === 'endIp') f.value = f.startIp || f.endIp ? `${f.startIp || ''}-${f.endIp || ''}` : '';", 'iprange put')
    rep("  if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype} is required`;", "  if (f.cat === 'network' && f.ntype === 'IP Range') {\n    if (!String(f.startIp || '').trim()) return 'Start IP is required';\n    if (!String(f.endIp || '').trim()) return 'End IP is required';\n  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype} is required`;", 'iprange reason')
    rep("  if (k === 'network') { if (!keepType || !pmf.ntype) { pmf.ntype = 'Address Group'; pmf.type = 'Address group'; pmf.members = []; pmf.value = ''; } return; }", "  if (k === 'network') { if (!keepType || !pmf.ntype) { pmf.ntype = 'Address Group'; pmf.type = 'Address group'; pmf.members = []; pmf.value = ''; pmf.startIp = ''; pmf.endIp = ''; pmf.intf = 'Any'; } return; }", 'iprange init')
    # Network Object › Subnet: IP/Netmask · Interface (2026-10-20)
    rep("        : pmInput(ns, f, 'value', f.ntype, { req: true, ph: NET_PH[f.ntype] || '' })}", "        : f.ntype === 'Subnet'\n        /* Subnet = IP/Netmask · Interface (owner, 20 Oct 2026 — FortiGate's subnet form as the reference) */\n        ? `${pmInput(ns, f, 'value', 'IP/Netmask', { req: true, ph: 'e.g. 192.0.2.0/255.255.255.0' })}\n           ${pmSelect(ns, f, 'intf', 'Interface', ['Any'].concat(pmChoices(f.dev).ports.filter(p => p !== 'any')))}`\n        : pmInput(ns, f, 'value', f.ntype, { req: true, ph: NET_PH[f.ntype] || '' })}", 'subnet fields')
    rep("  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype} is required`;", "  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype === 'Subnet' ? 'IP/Netmask' : f.ntype} is required`;", 'subnet reason')
    # Network Object › FQDN: FQDN value · Interface (2026-10-20)
    rep("        : pmInput(ns, f, 'value', f.ntype, { req: true, ph: NET_PH[f.ntype] || '' })}", "        /* FQDN = FQDN value · Interface (owner, 20 Oct 2026 — FortiGate's FQDN form as the reference) */\n        : `${pmInput(ns, f, 'value', 'FQDN value', { req: true, ph: NET_PH[f.ntype] || '' })}\n           ${pmSelect(ns, f, 'intf', 'Interface', ['Any'].concat(pmChoices(f.dev).ports.filter(p => p !== 'any')))}`}", 'fqdn fields')
    rep("return `${f.ntype === 'Subnet' ? 'IP/Netmask' : f.ntype} is required`;", "return `${f.ntype === 'Subnet' ? 'IP/Netmask' : f.ntype === 'FQDN' ? 'FQDN value' : f.ntype} is required`;", 'fqdn reason')
    # Service Object: Type Custom Service + Protocol / Source Port / Destination Port rows (2026-10-20)
    rep("function objectFormBody(ns, f) {\n  if (ns === 'pmf' && f.cat === 'network') return networkObjectBody(ns, f);", '/* Service Object (owner, 20 Oct 2026 — FortiGate\'s custom-service form as the reference): Object Name · Description ·\n   Object Category · Type (Custom Service), then one or more Protocol · Source Port · Destination Port rows with × / +.\n   The rows are kept on f.svcRows and folded into f.value ("tcp/443, udp/53") — the shape the grid\'s Details prints. */\nconst SVC_PROTOS = [\'TCP\', \'UDP\', \'SCTP\'];\nconst svcRowBlank = () => ({ proto: \'TCP\', src: \'1-65535\', dst: \'\' });\nconst svcValueOf = rows => rows.filter(r => String(r.dst).trim()).map(r => `${r.proto.toLowerCase()}/${String(r.dst).trim()}`).join(\', \');\nfunction serviceObjectBody(ns, f) {\n  const rows = f.svcRows || (f.svcRows = [svcRowBlank()]);\n  return `<div class="fa-pmf-form"><div class="fa-grid cols-2">\n      ${pmInput(ns, f, \'name\', \'Object Name\', { req: true, ph: \'Must be unique\' })}\n      ${pmInput(ns, f, \'desc\', \'Description\')}\n      ${pmoCatField()}\n      ${pmSelect(ns, f, \'stype\', \'Type\', [\'Custom Service\'], { req: true })}\n    </div>\n    <div class="fa-svc-rows">\n      <span class="fa-field-label">Protocol<i class="fa-req">&#42;</i></span><span class="fa-field-label">Source Port</span>\n      <span class="fa-field-label">Destination Port<i class="fa-req">&#42;</i></span><span></span>\n      ${rows.map((r, i) => `\n        <obs-select data-svcr="${i}:proto" block options=\'${j(SVC_PROTOS)}\' value="${esc(r.proto)}"></obs-select>\n        <obs-input data-svcr="${i}:src" class="fa-pmfi" block placeholder="1-65535" value="${esc(r.src)}"></obs-input>\n        <obs-input data-svcr="${i}:dst" class="fa-pmfi" block placeholder="e.g. 443 or 8000-8080" value="${esc(r.dst)}"></obs-input>\n        <span class="fa-svc-act">\n          <obs-button variant="default" square data-svc-del="${i}" aria-label="Remove row"${rows.length < 2 ? \' disabled\' : \'\'}><obs-icon name="times" size="14"></obs-icon></obs-button>\n          ${i === rows.length - 1 ? \'<obs-button variant="default" square data-svc-add aria-label="Add row"><obs-icon name="plus" size="14"></obs-icon></obs-button>\' : \'\'}\n        </span>`).join(\'\')}\n    </div></div>`;\n}\nfunction bindSvcRows(root) {\n  const f = pmf; if (!f || f.cat !== \'service\') return;\n  const sync = () => { f.value = svcValueOf(f.svcRows); paintPmFoot(\'pmf\'); };\n  root.querySelectorAll(\'[data-svcr]\').forEach(el => {\n    const [i, k] = el.getAttribute(\'data-svcr\').split(\':\');\n    const put = e => { const v = detailOf(e); f.svcRows[+i][k] = String((v && typeof v === \'object\' ? (v.value ?? v.label) : v) ?? e.target.value ?? \'\'); sync(); };\n    el.addEventListener(\'change\', put); if (el.tagName === \'OBS-INPUT\') el.addEventListener(\'input\', put);\n  });\n  root.querySelectorAll(\'obs-button[data-svc-del]\').forEach(b => b.addEventListener(\'click\', () => {\n    const i = +b.getAttribute(\'data-svc-del\'); if (f.svcRows.length < 2 || !f.svcRows[i]) return;\n    f.svcRows.splice(i, 1); f.value = svcValueOf(f.svcRows); paintPmAdd(); }));\n  const add = root.querySelector(\'obs-button[data-svc-add]\');\n  if (add) add.addEventListener(\'click\', () => { if (pmf.__svcAddT && Date.now() - pmf.__svcAddT < 300) return;   /* obs-button fires twice */\n    pmf.__svcAddT = Date.now(); f.svcRows.push(svcRowBlank()); paintPmAdd(); });\n}\nfunction objectFormBody(ns, f) {\n  if (ns === \'pmf\' && f.cat === \'network\') return networkObjectBody(ns, f);\n  if (ns === \'pmf\' && f.cat === \'service\') return serviceObjectBody(ns, f);', 'svc body')
    rep('  if (!keepType || !pmf.types.includes(pmf.type)) { pmf.type = pmf.types[0]; pmf.members = []; }', "  if (k === 'service') { pmf.type = 'Service'; pmf.stype = 'Custom Service'; pmf.members = []; if (!keepType || !pmf.svcRows) pmf.svcRows = [svcRowBlank()]; pmf.value = svcValueOf(pmf.svcRows); return; }\n  if (!keepType || !pmf.types.includes(pmf.type)) { pmf.type = pmf.types[0]; pmf.members = []; }", 'svc init')
    rep("  bindPmForm(pmAddDrawer.querySelector('#pmfBody'), 'pmf', () => pmf, paintPmAdd, () => paintPmFoot('pmf'));", "  bindPmForm(pmAddDrawer.querySelector('#pmfBody'), 'pmf', () => pmf, paintPmAdd, () => paintPmFoot('pmf'));\n  bindSvcRows(pmAddDrawer.querySelector('#pmfBody'));", 'svc bind')
    rep("  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim())", "  } else if (f.cat === 'service' && f.svcRows) {\n    if (f.svcRows.some(r => !String(r.dst).trim())) return 'Destination Port is required';\n  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim())", 'svc reason')
    rep('      pmf = rule ? pmEditForm(rule) : pmBlank(pmf.kind, pmf.dev); paintPmAdd(); });', '      const cat = pmf.cat; pmf = rule ? pmEditForm(rule) : pmBlank(pmf.kind, pmf.dev); if (cat) pmfObjCat(cat); paintPmAdd(); });   /* Reset keeps the chosen object category */', 'svc reset keeps cat')
    rep('.fa-pmo-seg { display: inline-block; }', '.fa-pmo-seg { display: inline-block; }\n.fa-svc-rows { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto; column-gap: 16px; row-gap: 12px;\n  align-items: center; margin-top: 20px; }\n.fa-svc-rows > .fa-field-label { color: var(--neutral-light); font-size: 14px; line-height: 18px; margin-bottom: -5px; }\n.fa-svc-act { display: inline-flex; gap: 8px; min-width: 84px; }', 'svc css')
    rep("    const i = +b.getAttribute('data-svc-del'); if (f.svcRows.length < 2 || !f.svcRows[i]) return;", "    if (pmf.__svcAddT && Date.now() - pmf.__svcAddT < 300) return; pmf.__svcAddT = Date.now();   /* obs-button fires twice */\n    const i = +b.getAttribute('data-svc-del'); if (f.svcRows.length < 2 || !f.svcRows[i]) return;", 'svc del guard')
    # Select Credential Profile drawer: no "* fields are mandatory" / reason line in the footer (2026-10-19)
    rep('    <div class="ds-cred-foot">\n      <span class="fa-mandatory"><i class="fa-req">*</i> fields are mandatory</span>\n      ${reason ? `<span class="fa-dp-why"><obs-icon name="exclamation-circle" size="13"></obs-icon>&nbsp;${esc(reason)}</span>` : \'\'}\n      <span class="fa-spacer"></span>\n      <obs-button variant="default" id="caReset">', '    <div class="ds-cred-foot">\n      <span class="fa-spacer"></span>\n      <obs-button variant="default" id="caReset">', 'cred ask no foot note')
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
/* Firewall Inventory bulk bar (owner, 19 Oct 2026): the DS bulk pill's divider between the count and the actions
   (the registry draws one, the vendored obs-toolbar does not), and the actions' glyph spaced from its label */
.fa-bulk-div { align-self: stretch; width: 1px; margin: 2px 4px 2px 0; background: var(--border-color); }
obs-button[data-fibulk] obs-icon { margin-right: 6px; }
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
# Service Object port rows -> Special Days pattern (21 Oct 2026): rows inside a filled panel, a red (x) per row,
# (+) only after the LAST row's (x); a single row shows (+) alone (nothing to remove).
def svc_rows_patch(t):
    o = """        <span class="fa-svc-act">
          <obs-button variant="default" square data-svc-del="${i}" aria-label="Remove row"${rows.length < 2 ? ' disabled' : ''}><obs-icon name="times" size="14"></obs-icon></obs-button>
          ${i === rows.length - 1 ? '<obs-button variant="default" square data-svc-add aria-label="Add row"><obs-icon name="plus" size="14"></obs-icon></obs-button>' : ''}
        </span>"""
    n = """        <span class="fa-svc-act">
          ${rows.length > 1 ? `<button type="button" class="fa-svc-ib del" data-svc-del="${i}" aria-label="Remove row" data-tip="Remove row"><obs-icon name="times-circle" size="18"></obs-icon></button>` : ''}
          ${i === rows.length - 1 ? '<button type="button" class="fa-svc-ib add" data-svc-add aria-label="Add row" data-tip="Add row"><obs-icon name="plus-circle" size="18"></obs-icon></button>' : ''}
        </span>"""
    assert t.count(o) == 1, ('svc act', t.count(o)); t = t.replace(o, n)
    for a, b in [("root.querySelectorAll('obs-button[data-svc-del]')", "root.querySelectorAll('[data-svc-del]')"),
                 ("root.querySelector('obs-button[data-svc-add]')", "root.querySelector('[data-svc-add]')")]:
        assert t.count(a) == 1, a; t = t.replace(a, b)
    o = ".fa-svc-rows { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) auto; column-gap: 16px; row-gap: 12px;\n  align-items: center; margin-top: 20px; }"
    n = """.fa-svc-rows { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 56px; column-gap: 16px; row-gap: 12px;
  align-items: center; margin-top: 20px; padding: 16px; border-radius: 4px;
  background: color-mix(in srgb, var(--page-text-color) 5%, transparent); }"""
    assert t.count(o) == 1, 'svc css'; t = t.replace(o, n)
    o = ".fa-svc-act { display: inline-flex; gap: 8px; min-width: 84px; }"
    n = """.fa-svc-act { display: inline-flex; align-items: center; gap: 8px; }
.fa-svc-ib { display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 50%;
  background: transparent; cursor: pointer; }
.fa-svc-ib.del { color: var(--secondary-red); }
.fa-svc-ib.add { color: var(--page-text-color); }
.fa-svc-ib:hover { background: color-mix(in srgb, currentColor 14%, transparent); }
.fa-svc-ib:focus-visible { outline: 2px solid var(--primary); outline-offset: 1px; }"""
    assert t.count(o) == 1, 'svc act css'; t = t.replace(o, n)
    return t
t = svc_rows_patch(t)
# Service Object Type gains "Service Group" (21 Oct 2026, FortiGate's Type dropdown as the reference): picking it swaps the
# Protocol/Port rows for a Members List of this firewall's services, stored as the grid's 'Service group' kind.
def svc_group_patch(t):
    rp = lambda o, n, l: (t.count(o) == 1 or (_ for _ in ()).throw(AssertionError((l, t.count(o))))) and t.replace(o, n)
    t = rp("      ${pmSelect(ns, f, 'stype', 'Type', ['Custom Service'], { req: true })}\n    </div>\n    <div class=\"fa-svc-rows\">",
           "      ${pmSelect(ns, f, 'stype', 'Type', SVC_TYPES, { req: true })}\n      ${f.stype === 'Service Group'\n        ? pmSelect(ns, f, 'members', 'Members List', pmChoices(f.dev).svcs.filter(s => s !== f.name.trim()).sort(), { req: true, multi: true, ph: 'Select Members' })\n        : ''}\n    </div>\n    ${f.stype === 'Service Group' ? '' : `<div class=\"fa-svc-rows\">", 'svc type')
    t = rp("          ${i === rows.length - 1 ? '<button type=\"button\" class=\"fa-svc-ib add\" data-svc-add aria-label=\"Add row\" data-tip=\"Add row\"><obs-icon name=\"plus-circle\" size=\"18\"></obs-icon></button>' : ''}\n        </span>`).join('')}\n    </div></div>`;",
           "          ${i === rows.length - 1 ? '<button type=\"button\" class=\"fa-svc-ib add\" data-svc-add aria-label=\"Add row\" data-tip=\"Add row\"><obs-icon name=\"plus-circle\" size=\"18\"></obs-icon></button>' : ''}\n        </span>`).join('')}\n    </div>`}</div>`;", 'svc tail')
    t = rp("const SVC_PROTOS = ['TCP', 'UDP', 'SCTP'];", "const SVC_PROTOS = ['TCP', 'UDP', 'SCTP'];\nconst SVC_TYPES = ['Custom Service', 'Service Group'];", 'svc types')
    t = rp("const PM_SHAPE = { nat: 1, natAddr: 1, type: 1, ntype: 1 };", "const PM_SHAPE = { nat: 1, natAddr: 1, type: 1, ntype: 1, stype: 1 };", 'shape')
    t = rp("      if (k === 'startIp' || k === 'endIp')",
           "      if (k === 'stype') { f.type = f.stype === 'Service Group' ? 'Service group' : 'Service'; f.members = []; f.value = f.stype === 'Service Group' ? '' : svcValueOf(f.svcRows || []); }\n      if (k === 'startIp' || k === 'endIp')", 'stype change')
    t = rp("  const sync = () => { f.value = svcValueOf(f.svcRows); paintPmFoot('pmf'); };",
           "  if (f.stype === 'Service Group') return;\n  const sync = () => { f.value = svcValueOf(f.svcRows); paintPmFoot('pmf'); };", 'bind guard')
    return t
t = svc_group_patch(t)
# Service Group's Members List = FortiGate's shape (21 Oct 2026): a list box of the chosen members, each with a red (x),
# and a single "Select Members" dropdown under it that adds the picked service and clears itself.
def svc_glist_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("? pmSelect(ns, f, 'members', 'Members List', pmChoices(f.dev).svcs.filter(s => s !== f.name.trim()).sort(), { req: true, multi: true, ph: 'Select Members' })",
           "? svcGroupField(f)", 'glist field')
    t = rp("function bindSvcRows(root) {",
           """function svcGroupField(f) {
  const avail = pmChoices(f.dev).svcs.filter(s => s !== f.name.trim() && !f.members.includes(s)).sort();
  const list = f.members.length
    ? f.members.map(m => `<div class="fa-svcg-item"><span>${esc(m)}</span><button type="button" class="fa-svc-ib del" data-svcg-del="${esc(m)}" aria-label="Remove ${esc(m)}" data-tip="Remove"><obs-icon name="times-circle" size="16"></obs-icon></button></div>`).join('')
    : '';
  return `<div class="fa-field fa-svcg"><span class="fa-field-label">Members List<i class="fa-req">&#42;</i></span>
    <div class="fa-svcg-list">${list}</div>
    <obs-select data-svcg-add block searchable="true" placeholder="Select Members" options='${j(avail)}' value=""></obs-select></div>`;
}
function bindSvcGroup(root, f) {
  const sel = root.querySelector('[data-svcg-add]');
  if (sel) sel.addEventListener('change', e => {
    const v = detailOf(e), s = String((v && typeof v === 'object' ? (v.value ?? v.label) : v) ?? '').trim();
    if (!s || f.members.includes(s)) return; f.members.push(s); paintPmAdd(); });
  root.querySelectorAll('[data-svcg-del]').forEach(b => b.addEventListener('click', () => {
    f.members = f.members.filter(m => m !== b.getAttribute('data-svcg-del')); paintPmAdd(); }));
}
function bindSvcRows(root) {""", 'glist fn')
    t = rp("  if (f.stype === 'Service Group') return;\n", "  if (f.stype === 'Service Group') return bindSvcGroup(root, f);\n", 'glist bind')
    t = rp(".fa-svc-ib.del { color: var(--secondary-red); }", """.fa-svc-ib.del { color: var(--secondary-red); }
.fa-svcg-list { max-height: 200px; overflow-y: auto; }
.fa-svcg-list:not(:empty) { margin-bottom: 8px; }
.fa-svcg-item { display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 4px 0 8px; border-radius: 4px; }
.fa-svcg-item:hover { background: color-mix(in srgb, var(--page-text-color) 5%, transparent); }
.fa-svcg-item > span { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fa-svcg-empty { display: grid; place-items: center; min-height: 110px; color: var(--neutral-light); }""", 'glist css')
    return t
t = svc_glist_patch(t)
# Objects grid speaks the Add Object form's words (21 Oct 2026): an Object Category column (Network / Service Object) and
# Object Type as the form's sub-type (Address Group · IP Range · Subnet · FQDN · Custom Service · Service Group), both
# filterable. Derived from the stored kind + value, so the seed data needs no change.
def obj_cat_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("function policyObjects(dev, { grid, table }) {", """const OBJ_CATS = ['Network Object', 'Service Object'];
const OBJ_SUBTYPES = ['Address Group', 'IP Range', 'Subnet', 'FQDN', 'Custom Service', 'Service Group'];
const objCategory = o => /^Service/.test(o.kind) ? 'Service Object' : 'Network Object';
function objSubType(o) {
  if (o.ntype) return o.ntype;
  if (o.kind === 'Address group') return 'Address Group';
  if (o.kind === 'Service group') return 'Service Group';
  if (o.kind === 'Service') return 'Custom Service';
  const v = String(o.value || '').trim();
  if (/^\\d{1,3}(\\.\\d{1,3}){3}\\s*-\\s*\\d/.test(v)) return 'IP Range';
  if (/[a-z]/i.test(v) && !v.includes('/')) return 'FQDN';
  return 'Subnet';
}
function policyObjects(dev, { grid, table }) {""", 'helpers')
    t = rp("    { key: 'kind', title: 'Object Type', width: 150 },\n    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 140 }]),",
           "    { key: 'cat', title: 'Object Category', width: 150 },\n    { key: 'kind', title: 'Object Type', width: 150 },\n    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 140 }]),", 'cols')
    t = rp("    id: o.id, name: o.name, kind: o.kind, device: o.device, definition: objDefinition(o),",
           "    id: o.id, name: o.name, cat: objCategory(o), kind: objSubType(o), device: o.device, definition: objDefinition(o),", 'rows')
    t = rp("    { key: 'kind', label: 'Object Type', type: 'enum', values: ['Address', 'Address group', 'Service', 'Service group'] },\n    TAG_FIELD",
           "    { key: 'cat', label: 'Object Category', type: 'enum', values: OBJ_CATS },\n    { key: 'kind', label: 'Object Type', type: 'enum', values: OBJ_SUBTYPES },\n    TAG_FIELD", 'fields')
    t = rp("    ['Object Type', o.kind], ['Associated Policies', objAssocRules(o).length],",
           "    ['Object Category', objCategory(o)], ['Object Type', objSubType(o)], ['Associated Policies', objAssocRules(o).length],", 'view')
    t = rp("  const kind = name === 'any' ? 'Address' : (o ? o.kind : '—');", "  const kind = name === 'any' ? 'Subnet' : (o ? objSubType(o) : '—');", 'detail')
    return t
t = obj_cat_patch(t)
# Add Object gains a Device Name field (21 Oct 2026): the firewall the object is created on, from the inventory's device
# list, FIRST on its own row (picked before anything else: it decides which members and services the form offers). Changing it re-seeds that firewall's members and services but keeps the
# object's name, description, category and type.
def obj_dev_patch(t):
    nm = "      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}"
    for fn in ("function networkObjectBody(ns, f) {", "function serviceObjectBody(ns, f) {"):
        i = t.index(fn); o = '<div class="fa-pmf-form"><div class="fa-grid cols-2">'; j = t.index(o, i)
        t = t[:j] + '<div class="fa-pmf-form"><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}</div><div class="fa-grid cols-2">' + t[j + len(o):]
    o = "function networkObjectBody(ns, f) {"
    assert t.count(o) == 1
    t = t.replace(o, "const pmoDevField = (ns, f) => pmSelect(ns, f, 'dev', 'Device Name', D.devices.map(x => x.name), { req: true, ph: 'Select Device' });\n" + o)
    o = "      if (k === 'dev') { const keep = { name: f.name, desc: f.desc }; Object.assign(f, pmBlank(f.kind, f.dev, f.types), keep); }"
    assert t.count(o) == 1, 'dev handler'
    t = t.replace(o, """      if (k === 'dev') { const keep = { name: f.name, desc: f.desc }, cat = f.cat, nt = f.ntype, st = f.stype;
        Object.assign(f, pmBlank(f.kind, f.dev, f.types), keep);
        if (cat && f === pmf) { pmfObjCat(cat); if (cat === 'network' && nt) { f.ntype = nt; f.type = nt === 'Address Group' ? 'Address group' : 'Address'; }
          if (cat === 'service' && st === 'Service Group') { f.stype = st; f.type = 'Service group'; f.value = ''; } } }""")
    return t
t = obj_dev_patch(t)
# Object Name + Description lead the form, Device Name follows on its own row (21 Oct 2026, owner).
def obj_dev_order_patch(t):
    o = """<div class="fa-pmf-form"><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}</div><div class="fa-grid cols-2">
      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${pmInput(ns, f, 'desc', 'Description')}
"""
    n = """<div class="fa-pmf-form"><div class="fa-grid cols-2">
      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}
      ${pmInput(ns, f, 'desc', 'Description')}
    </div><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}</div><div class="fa-grid cols-2">
"""
    assert t.count(o) == 2, ('dev order', t.count(o))
    return t.replace(o, n)
t = obj_dev_order_patch(t)
# Objects grid says Device Name where the Add Object form does (21 Oct 2026): the column, its quick filter, and the
# View Object drawer. Other grids keep "Firewall".
def obj_devcol_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("    { key: 'kind', title: 'Object Type', width: 150 },\n    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 140 }]),",
           "    { key: 'kind', title: 'Object Type', width: 150 },\n    ...(dev ? [] : [{ key: 'device', title: 'Device Name', width: 140 }]),", 'col')
    t = rp("  OBJ_GRIDS[grid] = { table, cols, fields: [\n    ...(dev ? [] : [PM_FW_FIELD()]),",
           "  OBJ_GRIDS[grid] = { table, cols, fields: [\n    ...(dev ? [] : [Object.assign(PM_FW_FIELD(), { label: 'Device Name' })]),", 'field')
    t = rp("    ['Firewall Name', o.device], ['Mode', pmMode(d) || 'Not collected'],", "    ['Device Name', o.device], ['Mode', pmMode(d) || 'Not collected'],", 'view')
    return t
t = obj_devcol_patch(t)
# Objects grid drops the Associated Policies column (21 Oct 2026, owner). The count is still in View Object, and the
# Tag column's Assigned / Unassigned says the same thing at a glance.
def obj_noassoc_patch(t):
    o = "    /* the COUNT, a link to the rules (owner, 2026-09-17) */\n    { key: 'assoc', title: 'Associated Policies', width: 170, type: 'link' },\n"
    assert t.count(o) == 1, ('assoc col', t.count(o))
    return t.replace(o, '')
t = obj_noassoc_patch(t)
# Objects grid column order (21 Oct 2026, owner): Object Name · Device Name · Object Category · Object Type · the rest.
def obj_order_patch(t):
    o = """    { key: 'cat', title: 'Object Category', width: 150 },
    { key: 'kind', title: 'Object Type', width: 150 },
    ...(dev ? [] : [{ key: 'device', title: 'Device Name', width: 140 }]),
"""
    n = """    ...(dev ? [] : [{ key: 'device', title: 'Device Name', width: 140 }]),
    { key: 'cat', title: 'Object Category', width: 150 },
    { key: 'kind', title: 'Object Type', width: 150 },
"""
    assert t.count(o) == 1, ('order', t.count(o))
    return t.replace(o, n)
t = obj_order_patch(t)
# Device Name and Object Category share a row (21 Oct 2026, owner): Name | Description, Device Name | Object Category,
# Type | its fields.
def obj_dev_pair_patch(t):
    o = '<div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}</div><div class="fa-grid cols-2">'
    assert t.count(o) == 2, ('dev pair', t.count(o))
    return t.replace(o, '<div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}')
t = obj_dev_pair_patch(t)
# Objects grid: Details is titled IP and follows Device Name (21 Oct 2026, owner).
def obj_ip_patch(t):
    o = """    ...(dev ? [] : [{ key: 'device', title: 'Device Name', width: 140 }]),
    { key: 'cat', title: 'Object Category', width: 150 },
    { key: 'kind', title: 'Object Type', width: 150 },
    { key: 'definition', title: 'Details', width: 320 },
"""
    n = """    ...(dev ? [] : [{ key: 'device', title: 'Device Name', width: 140 }]),
    { key: 'definition', title: 'IP', width: 320 },
    { key: 'cat', title: 'Object Category', width: 150 },
    { key: 'kind', title: 'Object Type', width: 150 },
"""
    assert t.count(o) == 1, ('ip', t.count(o))
    return t.replace(o, n)
t = obj_ip_patch(t)
# Policies overview = the Objects overview's joined obs-stat-card (21 Oct 2026, owner): With Findings removed, Deny added
# as its own column. Allow / Deny carry a share bar like Assigned / Unassigned; counts, not %.
def pol_ov_patch(t):
    i = t.index("function pmRulesOverview(rules, dev) {")
    a = t.index("  const kpi = o => `<obs-kpi-card class=\"fa-ov-kpi fa-pm-kpi\"", i)
    b = t.index("  ].join('')}</div>`;\n}\n", a) + len("  ].join('')}</div>`;\n}\n")
    n = """  const of = v => nf(v) + ' of ' + nf(n) + ' policies';
  const deny = n - allow;
  const items = [
    { label: 'Total Policies', value: nf(n), caption: new Set(rules.map(r => r.device)).size + ' firewalls' },
    { label: 'Allow', value: nf(allow), caption: of(allow), percent: n ? allow / n * 100 : 0, barSeverity: 'clear' },
    { label: 'Deny', value: nf(deny), caption: of(deny), percent: n ? deny / n * 100 : 0, barSeverity: 'critical' },
    { label: 'Unused', value: nf(unused), caption: nf(used) + ' used', ...(unused ? { valueSeverity: 'warning' } : {}) },
    { label: 'Unassigned', value: nf(unasg), caption: of(unasg), ...(unasg ? { valueSeverity: 'warning' } : {}) },
    { label: 'Pending Approval', value: nf(pendPol), caption: nf(pend.length) + ' changes in all' }
  ];
  return `<obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>`;
}
"""
    t = t[:a] + n + t[b:]
    o = "  const findings = rules.filter(r => r.finding && r.finding !== 'clean').length;\n"
    assert t.count(o) == 1; t = t.replace(o, '')
    return t
t = pol_ov_patch(t)
# Allow / Deny are ONE cell (21 Oct 2026, owner — Compliance's "Rules · 21 passed | 64 failed" as the reference):
# obs-stat-card's own pair cell (passed / failed), its two words re-labelled allow / deny via data-pair-words, since
# the component hardcodes them. Caption: "of N policies".
def pol_pair_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""    { label: 'Allow', value: nf(allow), caption: of(allow), percent: n ? allow / n * 100 : 0, barSeverity: 'clear' },
    { label: 'Deny', value: nf(deny), caption: of(deny), percent: n ? deny / n * 100 : 0, barSeverity: 'critical' },
""", """    { label: 'Policy Action', passed: nf(allow), failed: nf(deny), caption: 'of ' + nf(n) + ' policies' },
""", 'items')
    i = t.index("function pmRulesOverview(rules, dev) {")
    o = """  return `<obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>`;
}
"""
    k = t.index(o, i)
    t = t[:k] + """  return `<obs-stat-card class="fa-pm-stats" data-pair-words="allow,deny" items='${j(items)}'></obs-stat-card>`;
}
/* obs-stat-card prints its pair cell as "N passed | N failed" with the words baked in; a card carrying
   data-pair-words="a,b" has them re-labelled once its shadow root has rendered, and again on any re-render. */
(function faPairWords() {
  const fix = c => { const r = c.shadowRoot; if (!r) return; const w = (c.getAttribute('data-pair-words') || '').split(',');
    r.querySelectorAll('.row.pair').forEach(row => { const s = row.querySelectorAll('.w');
      s.forEach((el, i) => { if (w[i] && el.textContent !== w[i]) el.textContent = w[i]; }); });
    if (!c.__pw) { c.__pw = new MutationObserver(() => fix(c)); c.__pw.observe(r, { childList: true, subtree: true, characterData: true }); } };
  const scan = () => document.querySelectorAll('obs-stat-card[data-pair-words]').forEach(fix);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  customElements.whenDefined('obs-stat-card').then(() => setTimeout(scan, 0));
})();
""" + t[k + len(o):]
    return t
t = pol_pair_patch(t)
# Add / Edit Policy: no Policy ID field (21 Oct 2026, owner). The ID is still assigned — pmBlank takes the firewall's next
# free one (and again when the firewall changes), so the grid, the approval summary and the push keep their number.
def pol_noid_patch(t):
    o = "      ${f.edit ? field('Policy ID', pmRo(f.seq)) : pmInput(ns, f, 'seq', 'Policy ID', { req: true, type: 'number' })}\n"
    assert t.count(o) == 1, ('policy id field', t.count(o))
    return t.replace(o, '')
t = pol_noid_patch(t)
# Service Group Members List picks SEVERAL at once (21 Oct 2026, owner): the dropdown is obs-select `multiple` with
# a tick per service and Select all; it stays open while you tick, and only the member rows above it repaint.
def svc_multi_patch(t):
    i = t.index("function svcGroupField(f) {"); k = t.index("function bindSvcRows(root) {", i)
    n = r"""const svcgListHTML = f => f.members.map(m => `<div class="fa-svcg-item"><span>${esc(m)}</span><button type="button" class="fa-svc-ib del" data-svcg-del="${esc(m)}" aria-label="Remove ${esc(m)}" data-tip="Remove"><obs-icon name="times-circle" size="16"></obs-icon></button></div>`).join('');
function svcGroupField(f) {
  const avail = pmChoices(f.dev).svcs.filter(s => s !== f.name.trim()).sort();
  return `<div class="fa-field fa-svcg"><span class="fa-field-label">Members List<i class="fa-req">&#42;</i></span>
    <div class="fa-svcg-list">${svcgListHTML(f)}</div>
    <obs-select data-svcg-add block multiple allow-select-all searchable="true" max-items="2" placeholder="Select Members" options='${j(avail)}' value="${esc(f.members.join(','))}"></obs-select></div>`;
}
function bindSvcGroup(root, f) {
  const sel = root.querySelector('[data-svcg-add]'), list = root.querySelector('.fa-svcg-list');
  const paint = () => { if (list) { list.innerHTML = svcgListHTML(f); bindDel(); } paintPmFoot('pmf'); };
  const bindDel = () => list && list.querySelectorAll('[data-svcg-del]').forEach(b => b.addEventListener('click', () => {
    f.members = f.members.filter(m => m !== b.getAttribute('data-svcg-del'));
    if (sel) sel.value = f.members.join(','); paint(); }));
  if (sel) sel.addEventListener('change', e => {
    const v = detailOf(e), arr = Array.isArray(v) ? v : Array.isArray(e.detail) ? e.detail : String(v || '').split(',');
    f.members = arr.map(x => (typeof x === 'string' ? x : (x && (x.value ?? x.label)) || '').trim()).filter(Boolean); paint(); });
  bindDel();
}
"""
    return t[:i] + n + t[k:]
t = svc_multi_patch(t)
# Members List lines up with Type beside it (21 Oct 2026, owner): an EMPTY member list is a flex child of .fa-field,
# so it still took the field's 7px gap and pushed the dropdown 7px below Type's. It is out of flow while empty.
def svcg_align_patch(t):
    o = ".fa-svcg-list:not(:empty) { margin-bottom: 8px; }"
    assert t.count(o) == 1, ('svcg align', t.count(o))
    return t.replace(o, o + "\n.fa-svcg-list:empty { display: none; }")
t = svcg_align_patch(t)
# The picked members list sits UNDER the dropdown (21 Oct 2026): the dropdown is multi-select and stays open while you
# tick, so rows growing above it pushed the open list down under the pointer; below, the dropdown stays level with Type.
def svcg_below_patch(t):
    o = """    <div class="fa-svcg-list">${svcgListHTML(f)}</div>
    <obs-select data-svcg-add block multiple allow-select-all searchable="true" max-items="2" placeholder="Select Members" options='${j(avail)}' value="${esc(f.members.join(','))}"></obs-select></div>`;"""
    n = """    <obs-select data-svcg-add block multiple allow-select-all searchable="true" max-items="2" placeholder="Select Members" options='${j(avail)}' value="${esc(f.members.join(','))}"></obs-select>
    <div class="fa-svcg-list">${svcgListHTML(f)}</div></div>`;"""
    assert t.count(o) == 1, ('svcg below', t.count(o)); t = t.replace(o, n)
    o = ".fa-svcg-list:not(:empty) { margin-bottom: 8px; }"
    assert t.count(o) == 1; return t.replace(o, ".fa-svcg-list:not(:empty) { margin-top: 1px; }")
t = svcg_below_patch(t)
# Policy Action (the allow | deny pair) is the overview's LAST column (21 Oct 2026, owner): it is the one cell shaped
# differently from the rest, so it closes the row instead of breaking it up.
def pol_act_last_patch(t):
    o = "    { label: 'Policy Action', passed: nf(allow), failed: nf(deny), caption: 'of ' + nf(n) + ' policies' },\n"
    assert t.count(o) == 1, ('pol act', t.count(o)); t = t.replace(o, '')
    o2 = "    { label: 'Pending Approval', value: nf(pendPol), caption: nf(pend.length) + ' changes in all' }\n  ];\n  return `<obs-stat-card class=\"fa-pm-stats\" data-pair-words"
    assert t.count(o2) == 1, ('pol pend', t.count(o2))
    return t.replace(o2, o2.replace(" }\n  ];", " },\n" + o.rstrip(',\n') + "\n  ];"))
t = pol_act_last_patch(t)
# Policy Action is its OWN card beside the joined overview (21 Oct 2026, owner), with no "of N policies" caption.
# Both cards share one row; the pair card takes one cell's width so it reads as a sibling, not a sixth column.
def pol_act_sep_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""    { label: 'Pending Approval', value: nf(pendPol), caption: nf(pend.length) + ' changes in all' },
    { label: 'Policy Action', passed: nf(allow), failed: nf(deny), caption: 'of ' + nf(n) + ' policies' }
  ];
  return `<obs-stat-card class="fa-pm-stats" data-pair-words="allow,deny" items='${j(items)}'></obs-stat-card>`;""",
           """    { label: 'Pending Approval', value: nf(pendPol), caption: nf(pend.length) + ' changes in all' }
  ];
  const act = [{ label: 'Policy Action', passed: nf(allow), failed: nf(deny) }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats fa-pm-act" data-pair-words="allow,deny" items='${j(act)}'></obs-stat-card></div>`;""", 'sep')
    t = rp("obs-stat-card.fa-pm-stats { display: block; margin-bottom: var(--ds-padding-md, 16px); }",
           """obs-stat-card.fa-pm-stats { display: block; margin-bottom: var(--ds-padding-md, 16px); }
.fa-pm-ovrow { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 1fr); gap: var(--ds-padding-md, 16px);
  margin-bottom: var(--ds-padding-md, 16px); }
.fa-pm-ovrow > obs-stat-card.fa-pm-stats { margin-bottom: 0; height: 100%; }""", 'css')
    return t
t = pol_act_sep_patch(t)
# Policy Action card gets the overview's bottom line (21 Oct 2026, owner): one split bar under the pair — the allow share
# in green, the rest (deny) in red — so it closes on the same line as the cards beside it. obs-stat-card's own bar
# (percent + barSeverity 'clear'); the deny half is its TRACK (obs-progress reads --progress-bg), re-pointed to --severity-critical on this card only.
def pol_act_bar_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("  const act = [{ label: 'Policy Action', passed: nf(allow), failed: nf(deny) }];",
           "  const act = [{ label: 'Policy Action', passed: nf(allow), failed: nf(deny), percent: n ? allow / n * 100 : 0, barSeverity: 'clear' }];", 'bar')
    t = rp(".fa-pm-ovrow > obs-stat-card.fa-pm-stats { margin-bottom: 0; height: 100%; }",
           ".fa-pm-ovrow > obs-stat-card.fa-pm-stats { margin-bottom: 0; height: 100%; }", 'track')
    # the card's own .bar sets --progress-bg inside its shadow root, so the red track is set there, by the attachShadow hook
    t = rp(":host(.fa-cmp-stats) .cell:first-child{padding-left:0}');r.adoptedStyleSheets", ":host(.fa-cmp-stats) .cell:first-child{padding-left:0}:host(.fa-pm-act) .bar{--progress-bg:var(--severity-critical)}');r.adoptedStyleSheets", 'track red')
    return t
t = pol_act_bar_patch(t)
# Add / Edit Policy: Source · Destination · Services are titled sections (21 Oct 2026, owner — APM's Application
# Registration form as the reference): a hairline, a semibold title, one line saying what the section decides, then
# its fields. The old pmHeading rows were hidden in this drawer; these are their own class.
def pol_sec_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("const pmHeading = (text, extra = '') =>",
           "const pmSecHead = (title, desc) => `<div class=\"fa-pmsh\"><span class=\"fa-pmsh-t\">${esc(title)}</span><span class=\"fa-pmsh-d\">${esc(desc)}</span></div>`;\nconst pmHeading = (text, extra = '') =>", 'fn')
    t = rp("    ${pmHeading('Source')}\n", "    ${pmSecHead('Source', 'Where the traffic comes from: the source addresses and the interface it arrives on.')}\n", 'src')
    t = rp("    ${pmHeading('Destination')}\n", "    ${pmSecHead('Destination', 'Where the traffic is going: the destination addresses and the interface it leaves by.')}\n", 'dst')
    t = rp("    ${pmHeading('Services')}\n", "    ${pmSecHead('Services', 'The protocols and ports this policy matches. Leave it as any to match all services.')}\n", 'svc')
    t = rp("#pmAddDrawer .fa-pmf-form .fa-pmf-sec { display: none; }",
           """#pmAddDrawer .fa-pmf-form .fa-pmf-sec { display: none; }
#pmAddDrawer .fa-pmsh { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding-top: 16px; border-top: 1px solid color-mix(in srgb, var(--border-color) 50%, transparent); }
#pmAddDrawer .fa-pmsh-t { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--page-text-color); }
#pmAddDrawer .fa-pmsh-d { font-size: 12.8px; line-height: 18px; color: var(--neutral-light); }""", 'css')
    return t
t = pol_sec_patch(t)
# Add Policy's "Add" links open the SAME Add Object form (21 Oct 2026, owner): the stacked panel renders the Network /
# Service object form (Object Name · Description · Device Name · Object Category · Type · its fields) instead of the
# old generic one. Source / Destination open it on Network Object, Services on Service Object. Device Name and Object
# Category are shown read-only there: the object belongs to the policy's firewall, and the list it is added to decides
# whether it is an address or a service.
def stack_form_patch(t):
    def rp(o, n, l, c=1):
        assert t.count(o) == c, (l, t.count(o)); return t.replace(o, n)
    # objCatInit(f, k) — pmfObjCat's body for any form
    i = t.index("function pmfObjCat(k, keepType) {"); j = t.index("\n}\n", i) + 3
    body = t[i:j].replace("function pmfObjCat(k, keepType) {", "function objCatInit(f, k, keepType) {").replace("pmf.", "f.")
    t = t[:i] + body + "function pmfObjCat(k, keepType) { return objCatInit(pmf, k, keepType); }\n" + t[j:]
    # read-only Category / Device Name in the stacked panel
    t = rp("const pmoCatField = () => `<div class=\"fa-pmo-segf\">",
           "const pmoCatField = (ns, f) => ns === 'pmo'\n  ? `<div class=\"fa-pmo-segf\">${field('Object Category', `<obs-radio as-button disabled class=\"fa-pmo-seg\" value=\"${f.cat}\" options='${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}'></obs-radio>`)}</div>`\n  : `<div class=\"fa-pmo-segf\">", 'cat field')
    t = rp("      ${pmoCatField()}\n", "      ${pmoCatField(ns, f)}\n", 'cat calls', 2)
    t = rp("const pmoDevField = (ns, f) => pmSelect(", "const pmoDevField = (ns, f) => ns === 'pmo'\n  ? field('Device Name', `<obs-input type=\"text\" block disabled value=\"${esc(f.dev)}\"></obs-input>`, null, true)\n  : pmSelect(", 'dev field')
    t = rp("  if (ns === 'pmf' && f.cat === 'network') return networkObjectBody(ns, f);\n  if (ns === 'pmf' && f.cat === 'service') return serviceObjectBody(ns, f);",
           "  if (f.cat === 'network') return networkObjectBody(ns, f);\n  if (f.cat === 'service') return serviceObjectBody(ns, f);", 'body')
    # bindSvcRows / bindSvcGroup for either form
    i = t.index("function bindSvcGroup(root, f) {"); j = t.index("function objectFormBody(ns, f) {", i)
    seg = t[i:j]
    seg = seg.replace("function bindSvcGroup(root, f) {", "function bindSvcGroup(root, f, ns = 'pmf') {")
    seg = seg.replace("function bindSvcRows(root) {\n  const f = pmf; if (!f || f.cat !== 'service') return;\n  if (f.stype === 'Service Group') return bindSvcGroup(root, f);",
                      "function bindSvcRows(root, f = pmf, repaint = paintPmAdd, ns = 'pmf') {\n  if (!root || !f || f.cat !== 'service') return;\n  if (f.stype === 'Service Group') return bindSvcGroup(root, f, ns);")
    seg = seg.replace("paintPmFoot('pmf')", "paintPmFoot(ns)").replace("paintPmAdd();", "repaint();").replace("pmf.__svcAddT", "f.__svcAddT")
    assert "repaint();" in seg and "bindSvcGroup(root, f, ns)" in seg
    t = t[:i] + seg + t[j:]
    # the stack's form starts on its family and binds its rows
    t = rp("  pmStack = { from, f: pmBlank('object', pmf.dev, STACK_FROM[from].types) };",
           "  pmStack = { from, f: pmStackForm(pmf.dev, from) };", 'open')
    t = rp("{ from: r.from, f: pmBlank('object', d.name, STACK_FROM[r.from].types) }", "{ from: r.from, f: pmStackForm(d.name, r.from) }", 'route')
    t = rp("function openPmStack(from) {",
           "const pmStackForm = (dev, from) => { const f = pmBlank('object', dev, STACK_FROM[from].types); objCatInit(f, from === 'services' ? 'service' : 'network'); return f; };\nfunction openPmStack(from) {", 'helper')
    t = rp("  bindPmForm(host.querySelector('#pmoBody'), 'pmo', () => pmStack && pmStack.f, paintPmStack, () => paintPmFoot('pmo'));",
           "  bindPmForm(host.querySelector('#pmoBody'), 'pmo', () => pmStack && pmStack.f, paintPmStack, () => paintPmFoot('pmo'));\n  bindSvcRows(host.querySelector('#pmoBody'), pmStack.f, paintPmStack, 'pmo');", 'bind')
    # Reset in the stack keeps the family
    t = rp("if (r) r.addEventListener('click', () => { pmStack.f = pmBlank('object', pmStack.f.dev, pmStack.f.types); paintPmStack(); });",
           "if (r) r.addEventListener('click', () => { pmStack.f = pmStackForm(pmStack.f.dev, pmStack.from); paintPmStack(); });", 'reset')
    return t
t = stack_form_patch(t)
# NAT is a three-way choice (21 Oct 2026, owner — FortiGate's No NAT · Enable NAT · Use Central NAT Table, drawn as the
# product's segmented control like Config File | CLI). Default No NAT. Enable NAT keeps the Translated Address rows;
# f.nat stays the boolean the rest of the flow reads (summary, record, push), true only for Enable NAT.
def nat_mode_patch(t):
    def rp(o, n, l, c=1):
        assert t.count(o) == c, (l, t.count(o)); return t.replace(o, n)
    t = rp("const NAT_ADDR = [", "const NAT_MODES = [{ value: 'none', text: 'No NAT' }, { value: 'enable', text: 'Enable NAT' }, { value: 'central', text: 'Use Central NAT Table' }];\nconst NAT_ADDR = [", 'modes')
    t = rp("""    <div class="fa-grid cols-2">
      ${field('NAT', `<obs-switch data-${ns}="nat" size="small" checked-text="ON" unchecked-text="OFF"${f.nat ? ' checked' : ''} aria-label="NAT"></obs-switch>`)}
      ${field('Log traffic', `<obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>`)}
    </div>
    ${nat}""", """    <div class="fa-grid cols-2">
      ${field('NAT', `<obs-radio as-button data-${ns}="natMode" class="fa-pmf-natmode" options='${j(NAT_MODES)}' value="${f.natMode || (f.nat ? 'enable' : 'none')}"></obs-radio>`)}
      <div aria-hidden="true"></div>
    </div>
    ${nat}
    <div class="fa-grid cols-2">
      ${field('Log traffic', `<obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>`)}
      <div aria-hidden="true"></div>
    </div>""", 'field')
    t = rp("const PM_SHAPE = { nat: 1, natAddr: 1, type: 1, ntype: 1, stype: 1 };", "const PM_SHAPE = { nat: 1, natMode: 1, natAddr: 1, type: 1, ntype: 1, stype: 1 };", 'shape')
    t = rp("      if (k === 'stype') {", "      if (k === 'natMode') f.nat = f.natMode === 'enable';\n      if (k === 'stype') {", 'sync')
    t = rp("NAT_ADDR.map(o => o.value)", "(k === 'natMode' ? NAT_MODES : NAT_ADDR).map(o => o.value)", 'kbd')
    return t
t = nat_mode_patch(t)
# NAT's three segments take the form's full width so "Use Central NAT Table" stays on one line (it wrapped in a half column).
def nat_wide_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""      ${field('NAT', `<obs-radio as-button data-${ns}="natMode" class="fa-pmf-natmode" options='${j(NAT_MODES)}' value="${f.natMode || (f.nat ? 'enable' : 'none')}"></obs-radio>`)}
      <div aria-hidden="true"></div>""", """      <div class="fa-pmf-natrow">${field('NAT', `<obs-radio as-button data-${ns}="natMode" class="fa-pmf-natmode" options='${j(NAT_MODES)}' value="${f.natMode || (f.nat ? 'enable' : 'none')}"></obs-radio>`)}</div>""", 'row')
    t = rp("#pmAddDrawer .fa-pmsh-d {", "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }\n#pmAddDrawer obs-radio.fa-pmf-natmode { display: inline-block; white-space: nowrap; }\n#pmAddDrawer .fa-pmsh-d {", 'css')
    return t
t = nat_wide_patch(t)
# Translated Address's two radios stay on one line: their column hugs them (max-content) and Mapped IP takes the rest.
def nat_pick_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("  const nat = !f.nat ? '' : `<div class=\"fa-grid cols-2\">", "  const nat = !f.nat ? '' : `<div class=\"fa-grid cols-2 fa-pmf-natgrid\">", 'grid')
    t = rp("#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }", "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }\n#pmAddDrawer .fa-grid.fa-pmf-natgrid { grid-template-columns: max-content minmax(0, 1fr); }\n#pmAddDrawer obs-radio.fa-pmf-natpick { display: inline-block; white-space: nowrap; }", 'css')
    return t
t = nat_pick_patch(t)
# Enable NAT = FortiGate's Dynamic IP Pool row (21 Oct 2026, owner): a "Dynamic IP Pool" checkbox and the pool picker
# beside it (disabled until ticked; "No results found" when the firewall has none). Unticked = the outgoing interface
# address. It writes the same natAddr / natIp the record and summary already read. Central NAT Table shows nothing.
def ip_pool_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""  const nat = !f.nat ? '' : `<div class="fa-grid cols-2 fa-pmf-natgrid">
      ${field('Translated Address', c.snat.length
        ? `<obs-radio data-${ns}="natAddr" class="fa-pmf-natpick" options='${j(NAT_ADDR)}' value="${esc(f.natAddr)}"></obs-radio>`
        : pmRo('Outgoing Interface Address'))}
      ${f.natAddr === 'mapped' && c.snat.length ? pmSelect(ns, f, 'natIp', 'Mapped IP', c.snat, { req: true }) : '<div aria-hidden="true"></div>'}
    </div>`;""", """  const pool = f.natAddr === 'mapped';
  const nat = !f.nat ? '' : `<div class="fa-pmf-ippool">
      <obs-checkbox data-${ns}="natPool"${pool ? ' checked' : ''}>Dynamic IP Pool</obs-checkbox>
      <obs-select data-${ns}="natIp" block placeholder="${c.snat.length ? 'Select IP pool' : 'No results found'}" options='${j(c.snat)}' value="${esc(f.natIp)}"${pool && c.snat.length ? '' : ' disabled'}></obs-select>
    </div>`;""", 'body')
    t = rp("      if (k === 'natMode') f.nat = f.natMode === 'enable';",
           "      if (k === 'natMode') f.nat = f.natMode === 'enable';\n      if (k === 'natPool') { f.natAddr = f.natPool ? 'mapped' : 'outgoing'; if (!f.natPool) f.natIp = ''; }", 'sync')
    t = rp("const PM_SHAPE = { nat: 1, natMode: 1,", "const PM_SHAPE = { nat: 1, natMode: 1, natPool: 1,", 'shape')
    t = rp("return 'Mapped IP is required';", "return 'Pick a Dynamic IP Pool';", 'reason')
    t = rp("#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }",
           "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }\n#pmAddDrawer .fa-pmf-ippool { display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: center; column-gap: 16px; margin-top: 16px; }", 'css')
    return t
t = ip_pool_patch(t)
# A hairline after the Services section (21 Oct 2026, owner), the same softened rule the section heads carry, so NAT and
# Log traffic read as their own block rather than as part of Services.
def svc_line_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""    <div class="fa-grid cols-2">
      <div class="fa-pmf-natrow">""", """    <div class="fa-pmsep" aria-hidden="true"></div>
    <div class="fa-grid cols-2">
      <div class="fa-pmf-natrow">""", 'sep')
    t = rp("#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }",
           "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }\n#pmAddDrawer .fa-pmsep { margin-top: 8px; border-top: 1px solid color-mix(in srgb, var(--border-color) 50%, transparent); }", 'css')
    return t
t = svc_line_patch(t)
# Dynamic IP Pool row on the form's own two columns (21 Oct 2026, owner: "alignment"): the checkbox in the left column,
# the picker in the right one — so the picker lines up with Source / Destination Interface above it instead of running
# from the checkbox's edge to the drawer's — both centred on one line.
def pool_align_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("  const nat = !f.nat ? '' : `<div class=\"fa-pmf-ippool\">", "  const nat = !f.nat ? '' : `<div class=\"fa-grid cols-2 fa-pmf-ippool\">", 'cls')
    t = rp("#pmAddDrawer .fa-pmf-ippool { display: grid; grid-template-columns: max-content minmax(0, 1fr); align-items: center; column-gap: 16px; margin-top: 16px; }",
           "#pmAddDrawer .fa-grid.fa-pmf-ippool { align-items: center; }\n#pmAddDrawer .fa-pmf-ippool > obs-checkbox { display: flex; align-items: center; }", 'css')
    return t
t = pool_align_patch(t)
# Dynamic IP Pool gets an "Add" (21 Oct 2026, owner — FortiGate's IP Pool form as the reference): the picker carries the
# form's "IP Pool · Add" label, and Add opens the stacked side panel (the same one Add Object uses) with IP Pool Name ·
# Start IP · End IP and Cancel · Add. A saved pool joins that firewall's pool list (PM_POOLS) and is picked straight away.
def pool_add_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("    .map(n => `${n.mSrcIp} (${n.name})`);\n  return { ports, addrs: names(isAddrType), svcs, objs, snat };",
           "    .map(n => `${n.mSrcIp} (${n.name})`).concat(PM_POOLS[devName] || []);\n  return { ports, addrs: names(isAddrType), svcs, objs, snat };", 'choices')
    t = rp("""      <obs-select data-${ns}="natIp" block placeholder="${c.snat.length ? 'Select IP pool' : 'No results found'}" options='${j(c.snat)}' value="${esc(f.natIp)}"${pool && c.snat.length ? '' : ' disabled'}></obs-select>""",
           """      <div class="fa-field"><span class="fa-field-label fa-pmf-lab">IP Pool${pool ? '<i class="fa-req">&#42;</i>' : ''}<span class="fa-spacer"></span><obs-link href="#" data-pm-pool>Add</obs-link></span>
      <obs-select data-${ns}="natIp" block placeholder="${c.snat.length ? 'Select IP pool' : 'No results found'}" options='${j(c.snat)}' value="${esc(f.natIp)}"${pool && c.snat.length ? '' : ' disabled'}></obs-select></div>""", 'field')
    t = rp("#pmAddDrawer .fa-grid.fa-pmf-ippool { align-items: center; }",
           "#pmAddDrawer .fa-grid.fa-pmf-ippool { align-items: end; }\n#pmAddDrawer .fa-pmf-ippool > obs-checkbox { min-height: 32px; }", 'css')
    t = rp("""  pmAddDrawer.querySelectorAll('obs-link[data-pm-stack]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); openPmStack(a.getAttribute('data-pm-stack'));
  }));""", """  pmAddDrawer.querySelectorAll('obs-link[data-pm-stack]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); openPmStack(a.getAttribute('data-pm-stack'));
  }));
  pmAddDrawer.querySelectorAll('#pmfBody obs-link[data-pm-pool]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openPoolStack(); }));
  if (pmPool) paintPoolStack();""", 'bind')
    t = rp("function openPmStack(from) {", r"""const PM_POOLS = {};
let pmPool = null;      /* { name, start, end }: the Add IP Pool panel stacked over Add Policy */
const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
function poolReason(p) {
  if (!p.name.trim()) return 'IP Pool Name is required';
  if ((PM_POOLS[pmf.dev] || []).concat(pmChoices(pmf.dev).snat).some(s => s.toLowerCase().endsWith('(' + p.name.trim().toLowerCase() + ')'))) return `${p.name.trim()} already exists on ${pmf.dev}`;
  if (!IPV4.test(p.start.trim())) return 'Start IP must be an IPv4 address';
  if (!IPV4.test(p.end.trim())) return 'End IP must be an IPv4 address';
  return '';
}
function openPoolStack() {
  if (!pmf || pmf.kind !== 'policy') return;
  pmPool = { name: '', start: '', end: '' }; paintPoolStack();
  focusDeep(pmAddDrawer.querySelector('#pmPoolBody obs-input[data-pool="name"]'));
}
function closePoolStack() {
  pmPool = null; const host = pmAddDrawer.querySelector('#pmStack'); if (host) host.innerHTML = '';
  focusDeep(pmAddDrawer.querySelector('#pmfBody obs-link[data-pm-pool]'));
}
function poolFoot() {
  const r = poolReason(pmPool);
  return `<span class="fa-spacer"></span><obs-button variant="default" id="poolCancel">Cancel</obs-button>
    ${r ? `<obs-tooltip placement="top"><obs-button slot="trigger" variant="primary" id="poolAdd" disabled>Add</obs-button>${esc(r)}</obs-tooltip>` : '<obs-button variant="primary" id="poolAdd">Add</obs-button>'}`;
}
function paintPoolStack() {
  const host = pmAddDrawer.querySelector('#pmStack'); if (!host || !pmPool) return;
  const inp = (k, label, ph) => field(label, `<obs-input data-pool="${k}" block placeholder="${ph}" value="${esc(pmPool[k])}"></obs-input>`, null, true);
  host.innerHTML = `<div class="fa-sp-scrim"></div>
  <aside class="fa-sp-panel" role="dialog" aria-modal="false" aria-label="Add IP Pool">
    <div class="fa-sp-head"><span class="fa-sp-title">Add IP Pool</span>
      <obs-button variant="transparent" square id="poolX" aria-label="Close"><obs-icon name="times" size="16"></obs-icon></obs-button></div>
    <div class="fa-sp-body" id="pmPoolBody"><div class="fa-pmf-form"><div class="fa-grid cols-2">
      ${inp('name', 'IP Pool Name', 'Must be unique')}<div aria-hidden="true"></div>
      ${inp('start', 'Start IP', 'e.g. 203.0.113.10')}${inp('end', 'End IP', 'e.g. 203.0.113.20')}
    </div></div></div>
    <div class="fa-sp-foot" id="poolFoot">${poolFoot()}</div>
  </aside>`;
  const foot = () => { const ft = host.querySelector('#poolFoot'); ft.innerHTML = poolFoot(); bindFoot(); };
  const bindFoot = () => {
    host.querySelector('#poolCancel').addEventListener('click', () => closePoolStack());
    const add = host.querySelector('obs-button#poolAdd');
    if (add && !add.hasAttribute('disabled')) add.addEventListener('click', () => {
      if (!pmPool || poolReason(pmPool)) return;
      const v = `${pmPool.start.trim()}-${pmPool.end.trim()} (${pmPool.name.trim()})`;
      (PM_POOLS[pmf.dev] = PM_POOLS[pmf.dev] || []).push(v);
      pmf.natAddr = 'mapped'; pmf.natPool = true; pmf.natIp = v; pmPool = null;
      const h = pmAddDrawer.querySelector('#pmStack'); if (h) h.innerHTML = '';
      paintPmAdd();
    });
  };
  host.querySelectorAll('obs-input[data-pool]').forEach(el => {
    const put = e => { const v = detailOf(e); pmPool[el.getAttribute('data-pool')] = String((v && typeof v === 'object' ? v.value : v) ?? e.target.value ?? ''); foot(); };
    el.addEventListener('input', put); el.addEventListener('change', put);
  });
  bindFoot();
  host.querySelector('obs-button#poolX').addEventListener('click', () => closePoolStack());
  host.querySelector('.fa-sp-panel').addEventListener('keydown', e => {
    if (e.key !== 'Escape') return; e.stopPropagation(); if (e.defaultPrevented) return; e.preventDefault(); closePoolStack(); });
}
function openPmStack(from) {""", 'fns')
    t = rp("pmAddDrawer.addEventListener('close', e => { if (e.target !== pmAddDrawer) return; pmf = null; pmStack = null;",
           "pmAddDrawer.addEventListener('close', e => { if (e.target !== pmAddDrawer) return; pmf = null; pmStack = null; pmPool = null;", 'close')
    return t
t = pool_add_patch(t)
# Log traffic is one line (21 Oct 2026, owner — "Enable trace notifications (i)" as the reference): the checkbox with its
# own label and an info tooltip after it; the separate "Log traffic" title above it is gone.
def log_row_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""    <div class="fa-grid cols-2">
      ${field('Log traffic', `<obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>`)}
      <div aria-hidden="true"></div>
    </div>""", """    <div class="fa-pmf-logrow">
      <obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>
      <obs-tooltip placement="top"><obs-icon slot="trigger" name="infoCircle" size="14" class="fa-field-info" label="About logging"></obs-icon>On: every session this policy allows or denies is logged and the logs are collected. Off: no traffic logs are collected for this policy.</obs-tooltip>
    </div>""", 'row')
    t = rp("#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }",
           "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }\n#pmAddDrawer .fa-pmf-logrow { display: flex; align-items: center; gap: 8px; margin-top: 16px; }\n#pmAddDrawer .fa-pmf-logrow .fa-field-info { color: var(--neutral-light); cursor: help; }", 'css')
    return t
t = log_row_patch(t)
# Objects overview: Pending Approval is its own card at the end of the row (21 Oct 2026, owner), the shape the Policies
# overview's Policy Action card has — same .fa-pm-ovrow grid, same height.
def obj_pend_patch(t):
    o = """    { label: 'Pending Approval', value: nf(pendObj), caption: nf(pend.length) + ' changes in all' }
  ];
  return `<obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>`;
}"""
    n = """  ];
  const pendCard = [{ label: 'Pending Approval', value: nf(pendObj), caption: nf(pend.length) + ' changes in all' }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats" items='${j(pendCard)}'></obs-stat-card></div>`;
}"""
    assert t.count(o) == 1, ('obj pend', t.count(o)); t = t.replace(o, n)
    o = "    { label: 'Unassigned', value: nf(n - asg), caption: mix(o => !objectTags(o).includes('Assigned')), percent: n ? (n - asg) / n * 100 : 0,\n      barSeverity: 'warning', ...(n - asg ? { valueSeverity: 'warning' } : {}) },\n  ];"
    if t.count(o) == 1:
        t = t.replace(o, o.replace(" },\n  ];", " }\n  ];"))
    return t
t = obj_pend_patch(t)
# IP Pool's "Add" opens Add OBJECT, not a pool-only form (21 Oct 2026, owner): the same stacked Add Object panel the
# address and service Adds open, preset to Network Object · IP Range. Saving records the object (a pending change, as
# every Add does) and its range becomes that firewall's IP pool, picked straight away with Dynamic IP Pool ticked.
def pool_obj_patch(t):
    def rp(o, n, l, c=1):
        assert t.count(o) == c, (l, t.count(o)); return t.replace(o, n)
    t = rp("  services:    { key: 'svc', types: ['Service', 'Service group'] }\n};",
           "  services:    { key: 'svc', types: ['Service', 'Service group'] },\n  pool:        { key: 'natIp', types: ['Address', 'Address group'] }\n};", 'from')
    t = rp("const pmStackForm = (dev, from) => { const f = pmBlank('object', dev, STACK_FROM[from].types); objCatInit(f, from === 'services' ? 'service' : 'network'); return f; };",
           "const pmStackForm = (dev, from) => { const f = pmBlank('object', dev, STACK_FROM[from].types); objCatInit(f, from === 'services' ? 'service' : 'network');\n  if (from === 'pool') { f.ntype = 'IP Range'; f.type = 'Address'; }\n  return f; };", 'form')
    t = rp("  const name = pmRecordObject(st.f), k = STACK_FROM[st.from].key;\n",
           "  const name = pmRecordObject(st.f), k = STACK_FROM[st.from].key;\n  if (st.from === 'pool') {\n    const v = `${String(st.f.startIp || '').trim()}-${String(st.f.endIp || '').trim()} (${name})`;\n    (PM_POOLS[pmf.dev] = PM_POOLS[pmf.dev] || []).push(v);\n    pmf.natAddr = 'mapped'; pmf.natPool = true; pmf.natIp = v; pmf.made.push(name);\n    pmStack = null; paintPmAdd(); pmSetHash();\n    focusDeep(pmAddDrawer.querySelector('obs-link[data-pm-stack=\"pool\"]'));\n    return;\n  }\n", 'save')
    t = rp("<obs-link href=\"#\" data-pm-pool>Add</obs-link>", "<obs-link href=\"#\" data-pm-stack=\"pool\">Add</obs-link>", 'link')
    t = rp("  pmAddDrawer.querySelectorAll('#pmfBody obs-link[data-pm-pool]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openPoolStack(); }));\n", "", 'bind')
    t = rp("(?:\\/(source|destination|services))?$/;", "(?:\\/(source|destination|services|pool))?$/;", 'route1')
    t = rp("(\\/(source|destination|services))?$/;", "(\\/(source|destination|services|pool))?$/;", 'route2')
    return t
t = pool_obj_patch(t)
# Objects overview: the Pending Approval card reads the way Policy Action does (21 Oct 2026, owner): "N approved | N
# rejected" — the Approval module's decision on this view's changes (faApvOf) — over a split bar, approved green,
# rejected red. obs-stat-card's pair cell, its words re-labelled by data-pair-words; the red track is .fa-pm-act's.
def obj_apv_patch(t):
    o = """  const pendCard = [{ label: 'Pending Approval', value: nf(pendObj), caption: nf(pend.length) + ' changes in all' }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats" items='${j(pendCard)}'></obs-stat-card></div>`;"""
    n = """  const apv = pend.map(p => faApvOf(p).st), apr = apv.filter(s => s === 'Approved').length, rej = apv.filter(s => s === 'Rejected').length;
  const pendCard = [{ label: 'Pending Approval', passed: nf(apr), failed: nf(rej), percent: apr + rej ? apr / (apr + rej) * 100 : 0, barSeverity: 'clear' }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats fa-pm-act" data-pair-words="approved,rejected" items='${j(pendCard)}'></obs-stat-card></div>`;"""
    assert t.count(o) == 1, ('obj apv', t.count(o))
    return t.replace(o, n)
t = obj_apv_patch(t)
# Policy Action card words: allow / deny -> approve / reject (21 Oct 2026, owner). The counts are unchanged.
def act_words_patch(t):
    o = 'class="fa-pm-stats fa-pm-act" data-pair-words="allow,deny"'
    assert t.count(o) == 1, ('act words', t.count(o))
    return t.replace(o, 'class="fa-pm-stats fa-pm-act" data-pair-words="approve,reject"')
t = act_words_patch(t)
# Add Policy / Add Object drawer: no horizontal scroll (21 Oct 2026, owner). An obs-tooltip keeps its hidden bubble in
# the layout, absolutely placed, and the one beside "Log firewall traffic" sits past the body's right edge — so the body
# scrolled sideways by the bubble's overhang. The body clips horizontally; vertical scroll is untouched.
def no_hscroll_patch(t):
    # (overflow on the shadow .body would force overflow-y too; clipping the slotted form's x axis leaves y scrolling alone)
    o = "#pmAddDrawer .fa-pmf-natrow { grid-column: 1 / -1; }"
    assert t.count(o) == 1, ('hscroll', t.count(o))
    return t.replace(o, o + "\n#pmAddDrawer > div:first-child { overflow-x: clip; }")
t = no_hscroll_patch(t)
# View Policy follows today's Add Policy (21 Oct 2026, owner): the same Source / Destination / Services sections (soft
# hairline, title, one-line description), then a hairline and the NAT + Log block, then the read-outs (last update, hits,
# tag). pmViewHTML gains two row kinds: ['__sec', title, desc] and ['__line']. NAT reads the pending edit when there is
# one (the only place a rule's NAT is stored), else No NAT.
def view_pol_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("""  return `<div class="fa-pmf-form fa-pmv"><div class="fa-grid cols-2">${rows.map(([label, v, kind, variant, wide]) => {
    const html = field(label, kind === 'chips' ? chips(v, variant) : kind === 'html' ? v : ro(v));""",
           """  return `<div class="fa-pmf-form fa-pmv"><div class="fa-grid cols-2">${rows.map(([label, v, kind, variant, wide]) => {
    if (label === '__sec') return `</div>${pmSecHead(v, kind)}<div class="fa-grid cols-2">`;
    if (label === '') return '<div aria-hidden=\"true\"></div>';
    if (label === '__line') return `</div><div class="fa-pmsep" aria-hidden="true"></div><div class="fa-grid cols-2">`;
    const html = field(label, kind === 'chips' ? chips(v, variant) : kind === 'html' ? v : ro(v));""", 'view html')
    t = rp("""    ['Source', [r.src], 'chips'], ['Destination', [r.dst], 'chips'],
    ['Source Interface', ruleIntf(r, 'srcIntf')], ['Destination Interface', ruleIntf(r, 'dstIntf')],
    ['Services', [r.svc], 'chips'], ['Log', r.log],
    ['Last update Policy Time', ruleLastUpdate(r)], ['Hits', r.hits == null ? '—' : nf(r.hits)],""",
           """    ['__sec', 'Source', 'Where the traffic comes from: the source addresses and the interface it arrives on.'],
    ['Source Address', r.src], ['Source Interface', ruleIntf(r, 'srcIntf')],
    ['__sec', 'Destination', 'Where the traffic is going: the destination addresses and the interface it leaves by.'],
    ['Destination Address', r.dst], ['Destination Interface', ruleIntf(r, 'dstIntf')],
    ['__sec', 'Services', 'The protocols and ports this policy matches. Leave it as any to match all services.'],
    ['Services', r.svc], ['', ''],
    ['__line'],
    ['NAT', (() => { const p = pmPendingEdit(r), n = p && p.rule && p.rule.nat; return !n ? 'No NAT' : n === 'outgoing interface' ? 'Enable NAT · Outgoing interface address' : 'Enable NAT · Dynamic IP Pool ' + n; })()],
    ['Log firewall traffic', /^on$/i.test(String(r.log)) ? 'On' : 'Off'],
    ['__line'],
    ['Last update Policy Time', ruleLastUpdate(r)], ['Hits', r.hits == null ? '—' : nf(r.hits)],""", 'rows')
    t = rp("#pmAddDrawer .fa-pmsh { display: flex;", ".fa-pmv .fa-pmsh, #pmAddDrawer .fa-pmsh { display: flex;", 'sh css')
    t = rp("#pmAddDrawer .fa-pmsh-t {", ".fa-pmv .fa-pmsh-t, #pmAddDrawer .fa-pmsh-t {", 'sht css')
    t = rp("#pmAddDrawer .fa-pmsh-d {", ".fa-pmv .fa-pmsh-d, #pmAddDrawer .fa-pmsh-d {", 'shd css')
    t = rp("#pmAddDrawer .fa-pmsep {", ".fa-pmv .fa-pmsep, #pmAddDrawer .fa-pmsep {", 'sep css')
    return t
t = view_pol_patch(t)
# Policies grid: no Policy ID column (21 Oct 2026, owner — it left the Add Policy form). Rows still come in policy order
# (the grid sorts on the row's seq), and View Policy still shows the ID.
def pol_noid_col_patch(t):
    o = "    { key: 'seq', title: 'Policy ID', width: 90, fixed: true },\n    { key: 'name', title: 'Policy Name', width: 220,"
    assert t.count(o) == 1, ('noid col', t.count(o))
    return t.replace(o, "    { key: 'name', title: 'Policy Name', width: 220, fixed: true,")
t = pol_noid_col_patch(t)
# Policy & Object Approval: the Name is a link that opens the change in a side drawer (21 Oct 2026, owner: "show all
# details"). Request (who / where / when / approver / status), then the change itself, laid out like View Policy and
# View Object: a policy's rule in its Source · Destination · Services sections with NAT and Log; an object's category,
# type, value or members and description; otherwise the change summary. Read off the pending change record.
def chg_view_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("    { key: 'name', title: 'Name', width: 210, fixed: true },", "    { key: 'name', title: 'Name', width: 210, fixed: true, type: 'link' },", 'link')
    t = rp("""  const pmObjs = view.querySelector('#tblPmObjects');""", """  const pmSt = view.querySelector('#tblPmStatus');
  if (pmSt) pmSt.addEventListener('cellaction', e => { const p = detailOf(e) || {}; if (p.key === 'name' && p.id) viewChangeDrawer(p.id); });
  const pmObjs = view.querySelector('#tblPmObjects');""", 'bind')
    t = rp("function viewPolicyDrawer(id) {", r"""function viewChangeDrawer(id) {
  const p = D.pendingChanges.find(x => x.id === id); if (!p) return;
  const a = faApvOf(p), st = a.st === 'Pending' ? 'Pending Approval' : a.st;
  const rows = [
    ['__sec', 'Request', 'Who asked for this change, where it goes and where it stands.'],
    ['Name', p.target], ['Firewall Name', p.device],
    ['Type', p.kind], ['Change', p.op],
    ['Requested By', p.by], ['Requested Time', p.requested],
    ['Approver', a.by || '—'], ['Approval Status', [st], 'chips', FA_APV_TAG[a.st]]
  ];
  const r = p.rule;
  if (p.kind === 'Policy' && r) {
    const any = v => (v && v.length ? v : ['any']);
    rows.push(['__sec', 'Policy', 'The policy as it will reach the firewall.'],
      ['Policy ID', r.seq], ['Policy Action', `<div class="fa-pmv-chips"><obs-tag variant="${/^allow/i.test(r.action) ? 'tag-green' : 'tag-red'}">${esc(r.action)}</obs-tag></div>`, 'html'],
      ['Policy Status', r.status || 'Enable'], ['Policy Description', r.desc],
      ['__sec', 'Source', 'Where the traffic comes from: the source addresses and the interface it arrives on.'],
      ['Source Address', any(r.src), 'chips'], ['Source Interface', portLabel(p.device, r.srcIntf) || r.srcIntf],
      ['__sec', 'Destination', 'Where the traffic is going: the destination addresses and the interface it leaves by.'],
      ['Destination Address', any(r.dst), 'chips'], ['Destination Interface', portLabel(p.device, r.dstIntf) || r.dstIntf],
      ['__sec', 'Services', 'The protocols and ports this policy matches.'],
      ['Services', any(r.svc), 'chips'], ['', ''],
      ['__line'],
      ['NAT', !r.nat ? 'No NAT' : r.nat === 'outgoing interface' ? 'Enable NAT · Outgoing interface address' : 'Enable NAT · Dynamic IP Pool ' + r.nat],
      ['Log firewall traffic', r.log ? 'On' : 'Off']);
  } else if (p.kind === 'Object' && (p.objType || p.value || (p.members || []).length)) {
    const o = { kind: p.objType || 'Address', value: p.value || '', members: p.members || [] };
    rows.push(['__sec', 'Object', 'The object as it will reach the firewall.'],
      ['Object Category', objCategory(o)], ['Object Type', objSubType(o)],
      o.members.length ? ['Members', o.members, 'chips', '', true] : [/^Service/.test(o.kind) ? 'Service' : 'Address', o.value, '', '', true],
      ['Description', p.desc, '', '', true]);
  }
  rows.push(['__sec', 'Change summary', 'What this request does, in one line.'], ['Details', p.summary, '', '', true]);
  openDrawer(p.target, pmViewHTML(rows), '', '40%');
}
function viewPolicyDrawer(id) {""", 'fn')
    return t
t = chg_view_patch(t)
# a view that OPENS on a section (the change drawer) draws no rule above it: the drawer header already ends in one
def first_sec_patch(t):
    o = ".fa-pmv .fa-pmsh, #pmAddDrawer .fa-pmsh { display: flex;"
    assert t.count(o) == 1, ('first sec', t.count(o))
    return t.replace(o, ".fa-pmv > .fa-grid:first-child:empty { display: none; }\n.fa-pmv > .fa-grid:first-child:empty + .fa-pmsh { margin-top: 0; padding-top: 0; border-top: 0; }\n" + o)
t = first_sec_patch(t)
# Policies grid row menu: Disable Policy removed (21 Oct 2026, owner). Edit Policy · Delete Policy remain; the disable
# handler (pmStagePolicy 'disable') is kept and unreferenced, so it is one row away.
def no_disable_patch(t):
    o = "          { key: 'disable', label: 'Disable Policy', icon: 'ban' },\n"
    assert t.count(o) == 1, ('no disable', t.count(o))
    return t.replace(o, '')
t = no_disable_patch(t)
# Edit Policy is "Update Policy" (21 Oct 2026, owner): the row menu, the drawer title and its primary all say Update
# Policy. In update mode the Policy Name is read-only (with Firewall Name and Mode, which already were), and Update lands
# on Policy & Object Approval, where the new pending change sits at the top waiting for approval.
def upd_pol_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("          { key: 'edit',    label: 'Edit Policy', icon: 'pencil' },", "          { key: 'edit',    label: 'Update Policy', icon: 'pencil' },", 'menu')
    t = rp("  pmAddDrawer.setAttribute('title', pmf.edit ? 'Edit Policy' : PM_ADD[pmf.kind]);", "  pmAddDrawer.setAttribute('title', pmf.edit ? 'Update Policy' : PM_ADD[pmf.kind]);", 'title')
    t = t.replace("${f.edit ? 'Save changes' : PM_ADD[f.kind] || 'Add'}", "${f.edit ? 'Update Policy' : PM_ADD[f.kind] || 'Add'}")
    t = rp("      ${pmInput(ns, f, 'name', 'Policy Name', { req: true, ph: 'Must be unique' })}",
           "      ${f.edit ? field('Policy Name', `<obs-input type=\"text\" block disabled value=\"${esc(f.name)}\"></obs-input>`, null, true) : pmInput(ns, f, 'name', 'Policy Name', { req: true, ph: 'Must be unique' })}", 'name')
    t = rp("""    body: `Not on ${f.dev} until pushed from Policy & Object Approval.` };
  closePmAdd();
  renderContent();
}""", """    body: `Not on ${f.dev} until pushed from Policy & Object Approval.` };
  closePmAdd();
  if (f.edit && f.kind === 'policy' && dev1 && dev1.tab === 'policy') { dev1.sub[dev1.tab] = STATUS_SEC; go('device', devRoute()); return; }
  renderContent();
}""", 'go')
    return t
t = upd_pol_patch(t)
# Clone Policy (21 Oct 2026, owner): a row action that opens Add Policy prefilled from the policy — a NEW policy, so
# every field is editable (name, firewall included). The name starts as "Copy of <name>" made unique on that firewall,
# the ID is the firewall's next free one, and saving is an ordinary Add (a pending request). The drawer is titled
# Clone Policy and its primary reads Clone Policy.
def clone_pol_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("          { key: 'edit',    label: 'Update Policy', icon: 'pencil' },",
           "          { key: 'edit',    label: 'Update Policy', icon: 'pencil' },\n          { key: 'clone',   label: 'Clone Policy', icon: 'copy' },", 'menu')
    t = rp("        if (key === 'edit') openPmEdit(id);", "        if (key === 'edit') openPmEdit(id);\n        else if (key === 'clone') openPmClone(id);", 'route')
    t = rp("function openPmEdit(id) {", """function openPmClone(id) {
  const d = dev1 && D.devices.find(x => x.id === dev1.id), r = D.rules.find(x => x.id === id);
  if (!d || !r) return;
  const f = pmEditForm(r);
  delete f.edit; delete f.was; delete f.loaded;
  let name = 'Copy of ' + r.name, k = 2;
  while (pmNameTaken(f.dev, name)) name = `Copy of ${r.name} (${k++})`;
  Object.assign(f, { name, seq: String(pmNextRuleId(f.dev)), clone: r.name, made: [] });
  pmf = f; pmStack = null;
  paintPmAdd();
  pmAddDrawer.open = true; pmAddDrawer.setAttribute('open', '');
}
function openPmEdit(id) {""", 'fn')
    t = rp("  pmAddDrawer.setAttribute('title', pmf.edit ? 'Update Policy' : PM_ADD[pmf.kind]);",
           "  pmAddDrawer.setAttribute('title', pmf.edit ? 'Update Policy' : pmf.clone ? 'Clone Policy' : PM_ADD[pmf.kind]);", 'title')
    t = t.replace("${f.edit ? 'Update Policy' : PM_ADD[f.kind] || 'Add'}", "${f.edit ? 'Update Policy' : f.clone ? 'Clone Policy' : PM_ADD[f.kind] || 'Add'}")
    return t
t = clone_pol_patch(t)
# Objects grid row actions: Update Object and Clone Object (21 Oct 2026, owner), the Policies grid's pair. Both open the
# Add Object form filled from the object (its category, type, value / range / members / service rows).
#   Update: Object Name, Device Name and Object Category are read-only; saving is a Modify request and lands on
#           Policy & Object Approval, as Update Policy does.
#   Clone:  a NEW object, every field editable, named "Copy of <name>" (unique on the firewall); saving is an Add.
# Reset reloads what the form opened with (f.reload) — for Clone Policy too, which used to reset to a blank form.
def obj_upd_patch(t):
    def rp(o, n, l, c=1):
        assert t.count(o) == c, (l, t.count(o)); return t.replace(o, n)
    t = rp("""        header-style="default" sticky-header page-size="50" sort="name:asc"></obs-table></div>`)}""",
           """        header-style="default" sticky-header page-size="50" sort="name:asc"${table === 'tblPmObjects' ? ` row-actions='${j([
          { key: 'edit', label: 'Update Object', icon: 'pencil' }, { key: 'clone', label: 'Clone Object', icon: 'copy' }])}'` : ''}></obs-table></div>`)}""", 'row actions')
    t = rp("""  const pmObjs = view.querySelector('#tblPmObjects');
  if (pmObjs) pmObjs.addEventListener('cellaction', e => { const p = detailOf(e) || {};""",
           """  const pmObjs = view.querySelector('#tblPmObjects');
  if (pmObjs) pmObjs.addEventListener('rowaction', e => { const p = detailOf(e) || {}, key = actionKeyOf(p), id = rowIdOf(p);
    if (key === 'edit' || key === 'clone') openPmObj(id, key); });
  if (pmObjs) pmObjs.addEventListener('cellaction', e => { const p = detailOf(e) || {};""", 'bind')
    # read-only identity in update mode
    t = rp("const pmoCatField = (ns, f) => ns === 'pmo'\n", "const pmoCatField = (ns, f) => ns === 'pmo' || (f && f.edit)\n", 'cat ro')
    t = rp("const pmoDevField = (ns, f) => ns === 'pmo'\n", "const pmoDevField = (ns, f) => ns === 'pmo' || f.edit\n", 'dev ro')
    t = rp("      ${pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}",
           "      ${f.edit ? field('Object Name', `<obs-input type=\"text\" block disabled value=\"${esc(f.name)}\"></obs-input>`, null, true) : pmInput(ns, f, 'name', 'Object Name', { req: true, ph: 'Must be unique' })}", 'name ro', 3)
    t = rp("  if (pmNameTaken(f.dev, f.name)) return `${f.name.trim()} already exists on ${f.dev}`;",
           "  if (!f.edit && pmNameTaken(f.dev, f.name)) return `${f.name.trim()} already exists on ${f.dev}`;", 'name taken')
    # Modify request for an update
    t = rp("  D.pendingChanges.push({ id: 'pc-' + (++pcSeq), device: f.dev, kind: 'Object', op: 'Add', target: name, summary: pmfSummary(f),",
           "  D.pendingChanges.push({ id: 'pc-' + (++pcSeq), device: f.dev, kind: 'Object', op: f.edit ? 'Modify' : 'Add', ...(f.edit ? { editOf: f.edit } : {}), target: name, summary: pmfSummary(f),", 'modify')
    t = rp("  if (f.edit && f.kind === 'policy' && dev1 && dev1.tab === 'policy') {", "  if (f.edit && dev1 && dev1.tab === 'policy') {", 'go approval')
    # titles + buttons
    t = rp("  pmAddDrawer.setAttribute('title', pmf.edit ? 'Update Policy' : pmf.clone ? 'Clone Policy' : PM_ADD[pmf.kind]);",
           "  pmAddDrawer.setAttribute('title', pmf.edit ? (pmf.kind === 'policy' ? 'Update Policy' : 'Update Object') : pmf.clone ? (pmf.kind === 'policy' ? 'Clone Policy' : 'Clone Object') : PM_ADD[pmf.kind]);", 'title')
    t = t.replace("${f.edit ? 'Update Policy' : f.clone ? 'Clone Policy' : PM_ADD[f.kind] || 'Add'}",
                  "${f.edit ? (f.kind === 'policy' ? 'Update Policy' : 'Update Object') : f.clone ? (f.kind === 'policy' ? 'Clone Policy' : 'Clone Object') : PM_ADD[f.kind] || 'Add'}")
    # the object route has no edit form: an object update / clone keeps the address on /add
    t = rp("  currentSection = devRoute() + (pmf ? (pmf.edit ? '/edit/' + pmf.edit : '/add')",
           "  currentSection = devRoute() + (pmf ? (pmf.edit && pmf.kind === 'policy' ? '/edit/' + pmf.edit : '/add')", 'hash')
    # Reset reloads the opened form
    t = rp("    if (r) r.addEventListener('click', () => { const rule = pmf.edit && D.rules.find(x => x.id === pmf.edit);",
           "    if (r) r.addEventListener('click', () => { if (pmf.reload) { pmf = pmf.reload(); paintPmAdd(); return; } const rule = pmf.edit && D.rules.find(x => x.id === pmf.edit);", 'reset')
    t = rp("  Object.assign(f, { name, seq: String(pmNextRuleId(f.dev)), clone: r.name, made: [] });",
           "  Object.assign(f, { name, seq: String(pmNextRuleId(f.dev)), clone: r.name, made: [], reload: () => { openPmClone(id); return pmf; } });", 'clone reload')
    t = rp("function openPmClone(id) {", r"""function pmObjForm(o, mode) {
  const f = pmBlank('object', o.device);
  const cat = /^Service/.test(o.kind) ? 'service' : 'network';
  objCatInit(f, cat);
  f.desc = o.desc || ''; f.members = (o.members || []).slice(); f.value = o.value || '';
  if (cat === 'network') {
    f.ntype = objSubType(o); f.type = f.ntype === 'Address Group' ? 'Address group' : 'Address';
    if (f.ntype === 'IP Range') { const [a, b] = String(o.value || '').split('-'); f.startIp = (a || '').trim(); f.endIp = (b || '').trim(); }
    f.intf = 'Any';
  } else if (o.kind === 'Service group') { f.stype = 'Service Group'; f.type = 'Service group'; f.value = ''; }
  else {
    f.stype = 'Custom Service'; f.type = 'Service';
    const rows = String(o.value || '').split(',').map(s => s.trim()).filter(Boolean).map(s => {
      const [p, port] = s.split('/'); return { proto: String(p || 'tcp').toUpperCase(), src: '1-65535', dst: port || '' }; });
    f.svcRows = rows.length ? rows : [svcRowBlank()]; f.value = svcValueOf(f.svcRows);
  }
  if (mode === 'edit') { f.name = o.name; f.edit = o.id; f.was = o.name; }
  else { let name = 'Copy of ' + o.name, k = 2; while (pmNameTaken(o.device, name)) name = `Copy of ${o.name} (${k++})`; f.name = name; f.clone = o.name; }
  f.reload = () => pmObjForm(o, mode);
  return f;
}
function openPmObj(id, mode) {
  const o = D.objects.find(x => x.id === id); if (!o) return;
  pmf = pmObjForm(o, mode); pmStack = null;
  paintPmAdd();
  pmAddDrawer.open = true; pmAddDrawer.setAttribute('open', '');
}
function openPmClone(id) {""", 'fns')
    return t
t = obj_upd_patch(t)
# Objects grid: Delete Object in the row menu, and the menu's column is headed ACTION (21 Oct 2026, owner).
# Delete asks once (askConfirm, as Delete Policy does), then stages a Delete request for Policy & Object Approval.
# obs-table draws the row-menu column with an empty header (th.act-col); the attachShadow hook prints "Action" there.
def obj_del_patch(t):
    def rp(o, n, l):
        assert t.count(o) == 1, (l, t.count(o)); return t.replace(o, n)
    t = rp("          { key: 'edit', label: 'Update Object', icon: 'pencil' }, { key: 'clone', label: 'Clone Object', icon: 'copy' }])}'",
           "          { key: 'edit', label: 'Update Object', icon: 'pencil' }, { key: 'clone', label: 'Clone Object', icon: 'copy' },\n          { key: 'delete', label: 'Delete Object', icon: 'trash', danger: true }])}'", 'menu')
    t = rp("    if (key === 'edit' || key === 'clone') openPmObj(id, key); });",
           "    if (key === 'edit' || key === 'clone') openPmObj(id, key);\n    else if (key === 'delete') pmStageObject(id); });", 'route')
    t = rp("function openPmObj(id, mode) {", """function pmStageObject(id) {
  const o = D.objects.find(x => x.id === id); if (!o) return;
  askConfirm({
    title: `Delete object ${o.name}?`, icon: 'trash', variant: 'error', confirmText: 'Delete Object',
    body: `<p>${esc(o.device)} keeps the object as it is until the request is pushed from Policy & Object Approval.</p>`,
    onOk: () => {
      D.pendingChanges.push({ id: 'pc-' + (++pcSeq), device: o.device, kind: 'Object', op: 'Delete', editOf: o.id, target: o.name,
        summary: `Delete ${objSubType(o).toLowerCase()} ${o.name}`, by: 'Bhavin G', requested: stamp(), objType: o.kind, value: o.value || '', members: (o.members || []).slice(), desc: o.desc || '' });
      faApvQueue(D.pendingChanges[D.pendingChanges.length - 1]);
      pmFlash = { title: `Deleting ${o.name} is a pending request`, body: `Not on ${o.device} until pushed from Policy & Object Approval.` };
      renderContent();
    }
  });
}
function openPmObj(id, mode) {""", 'fn')
    t = rp(" if(this.tagName==='OBS-WIDGET-CARD'){",
           " if(this.tagName==='OBS-TABLE'){try{var tb=new CSSStyleSheet();tb.replaceSync(':host(#tblPmObjects) thead th.act-col{line-height:normal}:host(#tblPmObjects) thead th.act-col::after{content:\"Action\"}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[tb]);}catch(e){}}\n if(this.tagName==='OBS-WIDGET-CARD'){", 'hdr')
    return t
t = obj_del_patch(t)
# The change drawer on Policy & Object Approval reads like the Approval module's own detail (21 Oct 2026, owner): the
# status tag under the title, then Requestor info · Request info · Policy / Object details · Approver info as titled
# sections of label | value rows (chips for addresses and services, tags for the change and the action), and Reject ·
# Approve in the footer while the change is pending. A decision is written where the Approval screen keeps them
# (oo-apv-decisions), so both screens agree; the drawer and the grid repaint with it.
def apv_drawer_patch(t):
    i = t.index("function viewChangeDrawer(id) {"); j = t.index("function viewPolicyDrawer(id) {", i)
    n = r"""function viewChangeDrawer(id) {
  const p = D.pendingChanges.find(x => x.id === id); if (!p) return;
  const a = faApvOf(p), st = a.st === 'Pending' ? 'Pending' : a.st;
  const tag = (txt, v) => `<obs-tag variant="${v}">${esc(txt)}</obs-tag>`;
  const chips = list => `<div class="fa-pmv-chips">${(list && list.length ? list : ['any']).map(x => `<obs-tag>${esc(x)}</obs-tag>`).join('')}</div>`;
  const row = (k, v, html) => `<div class="fa-apvd-k">${esc(k)}</div><div class="fa-apvd-v">${html ? v : esc(v == null || v === '' ? '—' : String(v))}</div>`;
  const sec = (title, rows) => `<h3 class="fa-apvd-h">${esc(title)}</h3><div class="fa-apvd-g">${rows.join('')}</div>`;
  const opTag = { Add: 'tag-green', Modify: 'tag-primary', Delete: 'tag-red' }[p.op] || 'tag-primary';
  const out = [`<div class="fa-apvd-st">${tag(st, FA_APV_TAG[a.st])}</div>`,
    sec('Requestor info', [row('Requestor', p.by), row('Requested on', p.requested), row('Reason for request', p.summary)]),
    sec('Request info', [row('Change', tag(`${p.op} ${p.kind.toLowerCase()}`, opTag), true), row('Firewall', p.device),
      row(p.kind === 'Object' ? 'Object name' : 'Policy name', p.newName || p.target)])];
  const r = p.rule;
  if (p.kind === 'Policy' && r) out.push(sec('Policy details', [
    row('Policy ID', r.seq), row('Action', tag(r.action, /^allow/i.test(r.action) ? 'tag-green' : 'tag-red'), true),
    row('Status', /^dis/i.test(r.status || '') ? 'Disabled' : 'Enabled'),
    row('Source', chips(r.src), true), row('Source interface', portLabel(p.device, r.srcIntf) || r.srcIntf),
    row('Destination', chips(r.dst), true), row('Destination interface', portLabel(p.device, r.dstIntf) || r.dstIntf),
    row('Services', chips(r.svc), true),
    row('NAT', !r.nat ? 'Off' : r.nat === 'outgoing interface' ? 'Outgoing interface address' : 'Dynamic IP Pool ' + r.nat),
    row('Log traffic', r.log ? 'Yes' : 'No')]));
  else if (p.kind === 'Object' && (p.objType || p.value || (p.members || []).length)) {
    const o = { kind: p.objType || 'Address', value: p.value || '', members: p.members || [] };
    out.push(sec('Object details', [row('Object category', objCategory(o)), row('Object type', objSubType(o)),
      o.members.length ? row('Members', chips(o.members), true) : row(/^Service/.test(o.kind) ? 'Service' : 'Address', o.value),
      row('Description', p.desc)]));
  }
  out.push(sec('Approver info', [row('Approver', a.by || '—')].concat(a.st === 'Pending' ? [] : [row('Decision', tag(a.st, FA_APV_TAG[a.st]), true)])));
  const acts = a.st === 'Pending' && p.apv ? `<span class="fa-spacer"></span><obs-button variant="default" class="fa-apvd-rej" data-apv-dec="Rejected">Reject</obs-button><obs-button variant="primary" data-apv-dec="Approved">Approve</obs-button>` : '';
  openDrawer(`${p.device} – ${p.op.toLowerCase()} ${p.kind.toLowerCase()} – ${p.newName || p.target}`, `<div class="fa-apvd">${out.join('')}</div>`, acts, '40%');
  drawer.querySelectorAll('obs-button[data-apv-dec]').forEach(b => b.addEventListener('click', () => {
    if (b.__done) return; b.__done = 1;   /* obs-button fires twice */
    let dec = {}; try { dec = JSON.parse(localStorage.getItem('oo-apv-decisions') || '{}'); } catch (e) {}
    dec[p.apv] = { st: b.getAttribute('data-apv-dec'), by: 'admin' };
    try { localStorage.setItem('oo-apv-decisions', JSON.stringify(dec)); } catch (e) {}
    renderContent(); viewChangeDrawer(id);
  }));
}
"""
    t = t[:i] + n + t[j:]
    o = ".fa-pmv .fa-pmsh, #pmAddDrawer .fa-pmsh { display: flex;"
    assert t.count(o) == 1
    t = t.replace(o, """.fa-apvd-st { margin-bottom: 8px; }
.fa-apvd-h { margin: 20px 0 0; padding-bottom: 8px; font-size: 16px; line-height: 22px; font-weight: 600; color: var(--page-text-color);
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 50%, transparent); }
.fa-apvd-g { display: grid; grid-template-columns: minmax(0, 176px) minmax(0, 1fr); column-gap: 16px; row-gap: 12px; padding-top: 12px; align-items: center; }
.fa-apvd-k { color: var(--neutral-light); font-size: 13px; }
.fa-apvd-v { color: var(--page-text-color); font-size: 13px; min-width: 0; overflow-wrap: anywhere; }
.fa-apvd-v .fa-pmv-chips { margin: 0; }
obs-button.fa-apvd-rej { --default-button-text: var(--secondary-red); --default-button-border: var(--secondary-red); color: var(--secondary-red); }
""" + o)
    return t
t = apv_drawer_patch(t)
def obj_pend2_patch(t):
    """Objects overview: the separate Pending Approval card (approved | rejected) leaves; a Pending Approval tile joins the
    one stat card, carrying what is still waiting — policies and objects (owner, 21 Oct 2026, the Policies tab's joined
    card as the reference)."""
    old = """      barSeverity: 'warning', ...(n - asg ? { valueSeverity: 'warning' } : {}) }
  ];
  const apv = pend.map(p => faApvOf(p).st), apr = apv.filter(s => s === 'Approved').length, rej = apv.filter(s => s === 'Rejected').length;
  const pendCard = [{ label: 'Pending Approval', passed: nf(apr), failed: nf(rej), percent: apr + rej ? apr / (apr + rej) * 100 : 0, barSeverity: 'clear' }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats fa-pm-act" data-pair-words="approved,rejected" items='${j(pendCard)}'></obs-stat-card></div>`;"""
    new = """      barSeverity: 'warning', ...(n - asg ? { valueSeverity: 'warning' } : {}) },
    /* what is still WAITING on an approver — policies and objects both (owner, 21 Oct 2026: the separate approved | rejected
       card left the row and its status joined this card, as the Policies tab's own Pending Approval tile does) */
    (() => { const wait = pend.filter(p => faApvOf(p).st === 'Pending'), wp = wait.filter(p => p.kind === 'Policy').length, wo = wait.length - wp;
      return { label: 'Pending Approval', value: nf(wait.length),
        caption: `${nf(wp)} polic${wp === 1 ? 'y' : 'ies'} · ${nf(wo)} object${wo === 1 ? '' : 's'}` }; })()
  ];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card></div>`;"""
    assert t.count(old) == 1, 'obj_pend2 anchor'
    return t.replace(old, new)
t = obj_pend2_patch(t)

def obj_pend3_patch(t):
    """the Objects overview is ONE card now, so its row is one full-width column (it kept the 4fr | 1fr split)."""
    old = """  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card></div>`;"""
    assert t.count(old) == 1, 'obj_pend3 markup'
    t = t.replace(old, old.replace('class="fa-pm-ovrow"', 'class="fa-pm-ovrow fa-pm-one"'))
    css = ".fa-pm-ovrow > obs-stat-card.fa-pm-stats { margin-bottom: 0; height: 100%; }"
    assert t.count(css) == 1, 'obj_pend3 css'
    return t.replace(css, css + "\n.fa-pm-ovrow.fa-pm-one { grid-template-columns: minmax(0, 1fr); }")
t = obj_pend3_patch(t)

def pol_pend_patch(t):
    """Policies overview, the Objects tab's change (owner, 21 Oct 2026): the separate Policy Action card leaves the row,
    the one stat card spans it, and its Pending Approval tile says what is still waiting — policies and objects."""
    old = """    { label: 'Pending Approval', value: nf(pendPol), caption: nf(pend.length) + ' changes in all' }
  ];
  const act = [{ label: 'Policy Action', passed: nf(allow), failed: nf(deny), percent: n ? allow / n * 100 : 0, barSeverity: 'clear' }];
  return `<div class="fa-pm-ovrow"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card>
    <obs-stat-card class="fa-pm-stats fa-pm-act" data-pair-words="approve,reject" items='${j(act)}'></obs-stat-card></div>`;"""
    new = """    (() => { const wait = pend.filter(p => faApvOf(p).st === 'Pending'), wp = wait.filter(p => p.kind === 'Policy').length, wo = wait.length - wp;
      return { label: 'Pending Approval', value: nf(wait.length),
        caption: `${nf(wp)} polic${wp === 1 ? 'y' : 'ies'} · ${nf(wo)} object${wo === 1 ? '' : 's'}` }; })()
  ];
  return `<div class="fa-pm-ovrow fa-pm-one"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card></div>`;"""
    assert t.count(old) == 1, 'pol_pend anchor'
    return t.replace(old, new)
t = pol_pend_patch(t)

def pend_cap_patch(t):
    """Pending Approval caption, both tabs (owner, 21 Oct 2026: "improve 1 policy · 2 objects"): the waiting count read
    against every change raised — "of 6 changes in all" — so the figure above it has a total to be read against."""
    old = """        caption: `${nf(wp)} polic${wp === 1 ? 'y' : 'ies'} · ${nf(wo)} object${wo === 1 ? '' : 's'}` }; })()"""
    assert t.count(old) == 2, 'pend_cap anchor'
    return t.replace(old, """        caption: `of ${nf(pend.length)} change${pend.length === 1 ? '' : 's'} in all` }; })()""")
t = pend_cap_patch(t)

def pol_actcol_patch(t):
    """the Policies grid's row-menu column is titled "Action", as the Objects grid's is (owner, 21 Oct 2026)."""
    old = """tb.replaceSync(':host(#tblPmObjects) thead th.act-col{line-height:normal}:host(#tblPmObjects) thead th.act-col::after{content:"Action"}');"""
    assert t.count(old) == 1, 'pol_actcol anchor'
    return t.replace(old, """tb.replaceSync(':host(#tblPmObjects) thead th.act-col,:host(#tblPmRules) thead th.act-col{line-height:normal}:host(#tblPmObjects) thead th.act-col::after,:host(#tblPmRules) thead th.act-col::after{content:"Action"}');""")
t = pol_actcol_patch(t)

def grid_fit_patch(t):
    """Policy & Object Approval grid (owner, 21 Oct 2026): every cell on ONE line with "…", the full text in a tooltip on
    hover when it is cut, and columns resized by dragging a header's right edge. obs-table has neither (no resize, and a
    link cell is an inline-flex box whose bare text node cannot take text-overflow) — so this binds into its shadow root.
    Widths are kept per header name and re-applied whenever the table re-renders (search, filter, sort, page)."""
    anchor = "Element.prototype.attachShadow.__fa=1;})();</script>"
    assert t.count(anchor) == 1, 'grid_fit anchor'
    js = r"""
<script>/* FA grid fit — EVERY obs-table on the page: single-line cells cut with "…" and a tooltip with the full text on hover
   (owner, 27 Oct 2026); drag-to-resize columns stays on FA_FIT_IDS only */
(function(){
  var FA_FIT_IDS = ['tblPmStatus'], W = {};
  var CSS = ':host(.fa-fit) tbody td{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + ':host(.fa-fit) tbody td a.cell-link{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + ':host(.fa-fit) thead th{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + ':host(.fa-fit) tbody td .cell-clip{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + ':host(.fa-rzon) thead th{position:sticky}'
    + ':host(.fa-rzon) .fa-rz{position:absolute;top:0;right:-3px;width:7px;height:100%;cursor:col-resize;z-index:3}'
    + ':host(.fa-rzon) .fa-rz::after{content:"";position:absolute;left:3px;top:25%;height:50%;width:1px;background:var(--border-color)}'
    + ':host(.fa-rzon) .fa-rz:hover::after,:host(.fa-rzon) .fa-rz.on::after{top:0;height:100%;width:2px;left:2.5px;background:var(--primary-alt,var(--primary))}'
    + ':host(.fa-rzon) thead th:last-child .fa-rz{display:none}';
  var sheet; try { sheet = new CSSStyleSheet(); sheet.replaceSync(CSS); } catch (e) {}
  var key = function (th) { return (th.getAttribute('data-fa-k') || th.textContent || '').trim(); };
  var tip = document.createElement('div');
  tip.className = 'fa-fit-tip';
  tip.style.cssText = 'position:fixed;z-index:2147482000;max-width:420px;padding:6px 10px;border-radius:4px;font:12px/1.4 var(--font-family,Poppins,sans-serif);'
    + 'background:var(--tooltip-background-color,var(--neutral-darkest,#1d2a3e));color:var(--tooltip-text-color,#fff);pointer-events:none;display:none;white-space:normal;word-break:break-word;box-shadow:0 4px 12px rgba(0,0,0,.25)';
  function tipShow(el, txt){ var r = el.getBoundingClientRect(); tip.textContent = txt || el.textContent.trim(); tip.style.display = 'block';
    var tw = tip.offsetWidth, th = tip.offsetHeight, x = Math.max(8, Math.min(r.left, innerWidth - tw - 8)), y = r.bottom + 6;
    if (y + th > innerHeight - 8) y = r.top - th - 6; tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
  function tipHide(){ tip.style.display = 'none'; }
  function cut(el){ return el && el.scrollWidth > el.clientWidth + 1; }
  function paint(host){
    var r = host.shadowRoot, ws = W[host.id] || (W[host.id] = {});
    r.querySelectorAll('thead th').forEach(function (th) {
      if (!th.hasAttribute('data-fa-k')) th.setAttribute('data-fa-k', th.textContent.trim());
      var k = key(th); if (ws[k] && th.style.width !== ws[k] + 'px') th.style.width = ws[k] + 'px';
      if (th.classList.contains('act-col') || th.querySelector('.fa-rz')) return;
      var h = document.createElement('span'); h.className = 'fa-rz'; th.appendChild(h);
      h.addEventListener('mousedown', function (e) {
        e.preventDefault(); e.stopPropagation(); h.classList.add('on');
        var x0 = e.clientX, w0 = th.getBoundingClientRect().width;
        var mv = function (ev) { var w = Math.max(60, Math.round(w0 + ev.clientX - x0)); ws[key(th)] = w; th.style.width = w + 'px'; };
        var up = function () { h.classList.remove('on'); removeEventListener('mousemove', mv); removeEventListener('mouseup', up, true); };
        addEventListener('mousemove', mv); addEventListener('mouseup', up, true);
      });
      h.addEventListener('click', function (e) { e.stopPropagation(); });   /* a resize never sorts the column */
    });
  }
  function bind(host){
    if (host.__faFit || !host.shadowRoot) return; host.__faFit = 1; host.classList.add('fa-fit');
    var rz = FA_FIT_IDS.indexOf(host.id) >= 0; if (rz) host.classList.add('fa-rzon');
    var r = host.shadowRoot; if (sheet) r.adoptedStyleSheets = [].concat(r.adoptedStyleSheets || [], [sheet]);
    if (!tip.parentNode) document.body.appendChild(tip);
    r.addEventListener('mouseover', function (e) {
      /* every text cell shows its full text; a header only when it is cut; tags, buttons, menus and switches carry
         their own label and get none */
      var c = e.target.closest && e.target.closest('a.cell-link, .cell-clip, tbody td, thead th');
      if (c && c.matches('tbody td') && c.querySelector('a.cell-link, .cell-clip')) c = c.querySelector('a.cell-link, .cell-clip');
      var txt = '';
      if (c && !(e.target.closest && e.target.closest('obs-tag, obs-button, obs-menu, obs-checkbox, obs-switch'))) {
        /* the cell's OWN text: a status dot, a "New" tag, a switch or a button beside it is not part of what it says */
        var k = c.cloneNode(true); k.querySelectorAll('obs-tag, obs-button, obs-menu, obs-checkbox, obs-switch, .fa-rz').forEach(function (x) { x.remove(); });
        txt = k.textContent.replace(/\s+/g, ' ').trim();
      }
      if (txt && (c.matches('thead th') ? cut(c) : true)) tipShow(c, txt); else tipHide();
    });
    r.addEventListener('mouseleave', tipHide, true); host.addEventListener('mouseleave', tipHide);
    if (rz) { paint(host); new MutationObserver(function () { paint(host); }).observe(r, { childList: true, subtree: true }); }
  }
  function scan(){ document.querySelectorAll('obs-table').forEach(bind); }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('scroll', tipHide, true);
})();</script>"""
    return t.replace(anchor, anchor + js)
t = grid_fit_patch(t)

def req_reason_patch(t):
    """Reason for request (owner, 21 Oct 2026): every Add / Update / Clone of a policy or an object asks WHY, as a mandatory
    note at the foot of the form. It is the drawer's own form only (an object added from the stacked panel inside a
    policy rides on that policy's request). The note travels with the pending change and is what the Approval drawer's
    "Reason for request" row shows (it showed the summary before)."""
    def rp(old, new, n=1):
        nonlocal t
        assert t.count(old) == n, ('req_reason', old[:60], t.count(old)); t = t.replace(old, new)
    # the field, at the foot of the drawer's own form
    rp("""  const body = `<div id="pmfBody">${pmf.kind === 'policy' ? policyFormBody(pmf) : objectFormBody('pmf', pmf)}</div>`;""",
       """  const body = `<div id="pmfBody">${pmf.kind === 'policy' ? policyFormBody(pmf) : objectFormBody('pmf', pmf)}${pmReasonHTML(pmf)}</div>`;""")
    rp("""const pmSecHead = (title, desc) =>""",
       """/* the mandatory note: why this change is asked for — the approver reads it before deciding */
const pmReasonHTML = f => `<div class="fa-pmsep" aria-hidden="true"></div><div class="fa-pmf-reason">${field('Reason for request',
  `<obs-input data-pmf="reason" type="textarea" block placeholder="Why is this change needed? The approver reads this before deciding." value="${esc(f.reason || '')}"></obs-input>`, null, true)}</div>`;
const pmSecHead = (title, desc) =>""")
    # mandatory — checked after every other field (it is the last thing on the form), only for the drawer's own form
    rp("""    if (f.edit && pmSnapshot(f) === f.loaded) return 'Nothing has changed';
    return '';
  }""", """    if (f.edit && pmSnapshot(f) === f.loaded) return 'Nothing has changed';
    if (f === pmf && !String(f.reason || '').trim()) return 'Reason for request is required';
    return '';
  }""")
    rp("""  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype === 'Subnet' ? 'IP/Netmask' : f.ntype === 'FQDN' ? 'FQDN value' : f.ntype} is required`;

  return '';
}""", """  } else if (f.cat === 'network' && f.ntype && !String(f.value).trim()) return `${f.ntype === 'Subnet' ? 'IP/Netmask' : f.ntype === 'FQDN' ? 'FQDN value' : f.ntype} is required`;
  if (f === pmf && !String(f.reason || '').trim()) return 'Reason for request is required';
  return '';
}""")
    # it travels with the request
    rp("""by: 'Bhavin G', requested: stamp(), objType: f.type, value: f.value.trim(), members: f.members.slice(), desc: f.desc.trim() });""",
       """by: 'Bhavin G', requested: stamp(), objType: f.type, value: f.value.trim(), members: f.members.slice(), desc: f.desc.trim(), reason: String(f.reason || '').trim() });""")
    rp("""      by: 'Bhavin G', requested: stamp(), rule });""", """      by: 'Bhavin G', requested: stamp(), rule, reason: String(f.reason || '').trim() });""")
    rp("""    by: 'Bhavin G', requested: stamp(), rule });""", """    by: 'Bhavin G', requested: stamp(), rule, reason: String(f.reason || '').trim() });""")
    rp("""      .concat(p.objType ? [['Object type', p.objType]] : []).concat([['Change', p.summary]]),""",
       """      .concat(p.objType ? [['Object type', p.objType]] : []).concat([['Change', p.summary]]).concat(p.reason ? [['Reason for request', p.reason]] : []),
    reason: p.reason || '',""")
    rp("""row('Reason for request', p.summary)]),""", """row('Reason for request', p.reason || p.summary)]),""")
    rp("""#pmAddDrawer .fa-pmf-logrow { display: flex; align-items: center; gap: 8px; margin-top: 16px; }""",
       """#pmAddDrawer .fa-pmf-logrow { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
#pmAddDrawer .fa-pmf-reason { margin-top: 16px; }""")
    return t
t = req_reason_patch(t)

def req_reason2_patch(t):
    """Reason for request, the owner's wording (21 Oct 2026): the placeholder asks for the why AND the impact, and a note
    under the field says what happens next — the request goes to an approver before anything reaches the firewall."""
    old = """placeholder="Why is this change needed? The approver reads this before deciding." value="${esc(f.reason || '')}"></obs-input>`, null, true)}</div>`;"""
    assert t.count(old) == 1, 'req_reason2 field'
    t = t.replace(old, """placeholder="Explain why this action is required and any expected impact." value="${esc(f.reason || '')}"></obs-input>`, null, true)}
  <div class="fa-pmf-rnote"><obs-icon name="infoCircle" size="16"></obs-icon><span>Your request will be sent for approval. The approver will review it before the action is executed.</span></div></div>`;""")
    css = "#pmAddDrawer .fa-pmf-reason { margin-top: 16px; }"
    assert t.count(css) == 1, 'req_reason2 css'
    return t.replace(css, css + """
#pmAddDrawer .fa-pmf-rnote { display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; font-size: 13px; line-height: 1.5; color: var(--page-text-color); }
#pmAddDrawer .fa-pmf-rnote obs-icon { flex: 0 0 auto; margin-top: 2px; color: var(--neutral-light); }""")
t = req_reason2_patch(t)

def mdh_ds_patch(t):
    """Firewall detail header = the DS page-header's "Monitor detail header" variant (owner, 26 Oct 2026, the DS docs'
    /page-header as the reference): a boxed home button › a 28px type tile + title + status badge + the Type | IP |
    Site | HA meta strip, icon actions on the right. The vendored obs-page-header predates that variant (no `home` /
    `type-icon` props — DS gap 15), so the same parts go in its `before` slot, with the variant's own geometry and
    tokens; `back` is gone (home IS the way back to Firewall Inventory)."""
    def rp(old, new):
        nonlocal t
        assert t.count(old) == 1, ('mdh', old[:60]); t = t.replace(old, new)
    rp("""      <obs-page-header id="devHeader" back heading="${esc(d.name)}" no-divider class="fa-mdh\"""",
       """      <obs-page-header id="devHeader" heading="${esc(d.name)}" no-divider class="fa-mdh\"""")
    rp("""        <span slot="before" class="fa-mdh-tile"><obs-icon name="secure" size="20"></obs-icon></span>""",
       """        <span slot="before" class="fa-mdh-lead"><button type="button" class="fa-mdh-home" data-mdh="home" aria-label="Firewall Inventory" data-tip="Firewall Inventory"><obs-icon name="home" size="14"></obs-icon></button><span class="fa-mdh-sep" aria-hidden="true"><obs-icon name="chevronRight" size="12"></obs-icon></span><span class="fa-mdh-tile" aria-hidden="true"><obs-icon name="secure" size="16"></obs-icon></span></span>""")
    rp("""    if (b.dataset.mdh === 'refresh') go('device', devRoute());""",
       """    if (b.dataset.mdh === 'home') go('devices', devReturn);
    else if (b.dataset.mdh === 'refresh') go('device', devRoute());""")
    rp(""".fa-mdh-tile { display: inline-grid; place-items: center; width: 36px; height: 36px; border-radius: 4px;
  background: color-mix(in srgb, var(--page-text-color) 8%, transparent); color: var(--page-text-color); }""",
       """/* the DS "Monitor detail header": boxed home (28px, 1px border, page fill) › type tile (28px, info surface) */
.fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }
.fa-mdh-home { appearance: none; flex: 0 0 auto; width: 28px; height: 28px; padding: 0; border-radius: 4px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);
  background: var(--page-background-color); color: var(--neutral-light); transition: background .12s, border-color .12s, color .12s; }
.fa-mdh-home:hover { background: var(--neutral-lightest); border-color: var(--neutral-lighter); color: var(--primary-alt); }
.fa-mdh-home:focus-visible { outline: 2px solid var(--primary-alt); outline-offset: 2px; }
.fa-mdh-sep { display: inline-flex; align-items: center; height: 28px; color: var(--neutral-light); }
.fa-mdh-tile { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px;
  border-radius: 4px; background: var(--info-surface); color: var(--info-text); }""")
    return t
t = mdh_ds_patch(t)

def mdh_center_patch(t):
    """the detail header's lead (home › tile) is centred on the WHOLE title block — title + meta strip — as the product's
    inventory header does (owner, 26 Oct 2026). The vendored obs-page-header pins `before` to the title line when a meta
    strip is present (`.left.stacked{align-items:flex-start}` + `.before{height:27px}`); scoped by the host class."""
    a = " if(this.tagName==='OBS-WIDGET-CARD')"
    assert t.count(a) == 1, 'mdh_center anchor'
    return t.replace(a, """ if(this.tagName==='OBS-PAGE-HEADER'){try{var ph=new CSSStyleSheet();ph.replaceSync(':host(.fa-mdh) .left.stacked{align-items:center}:host(.fa-mdh) .left.stacked .before{height:auto}:host(.fa-mdh) .left{gap:10px}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[ph]);}catch(e){}}
""" + a, 1)
t = mdh_center_patch(t)

def ov_ds_patch(t):
    """Overview, checked against the DS docs (owner, 26 Oct 2026): (1) the Interface KPI is the DS's own "Up / Down with
    arrows" card type — two labelled values — not "8 / 8"; (2) Availability Statistics' rows spread over the whole body
    as the DS widget does: obs-availability-bars is height:100% with flex:1 rows, but the body centred it, so it shrank
    to its content and the three rows bunched at the top."""
    def rp(old, new):
        nonlocal t
        assert t.count(old) == 1, ('ov_ds', old[:70]); t = t.replace(old, new)
    rp("""        const kpi = o => `<obs-kpi-card class="fa-ov-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : ''}${
          o.stats ? ` stats='${j(o.stats)}'` : ''}${o.value == null ? '' : ` value="${esc(o.value)}"`}""",
       """        const kpi = o => `<obs-kpi-card class="fa-ov-kpi" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : ''}${
          o.stats ? ` stats='${j(o.stats)}'` : ''}${o.values ? ` values='${j(o.values)}'` : ''}${o.value == null ? '' : ` value="${esc(o.value)}"`}""")
    rp("""          kpi({ title: 'Interface', icon: 'interface', sev: down ? 'critical' : 'clear', value: `${up} / ${total}`,
                stats: [{ label: 'Status', value: down ? `${down} down` : 'All up' }] }),""",
       """          kpi({ title: 'Interface', icon: 'interface', sev: down ? 'critical' : 'clear',
                values: [{ label: 'Up', value: String(up) }, { label: 'Down', value: String(down) }] }),""")
    rp(""".fa-av > .fa-card-body { display: flex; align-items: center; justify-content: center; min-height: 230px; padding: 12px 16px; }""",
       """.fa-av > .fa-card-body { display: flex; align-items: center; justify-content: center; min-height: 230px; padding: 12px 16px; }
.fa-av > .fa-card-body:has(> obs-availability-bars) { align-items: stretch; }""")
    return t
t = ov_ds_patch(t)

def ov_ds2_patch(t):
    """the bars' own :host{height:100%} cannot resolve against a body that has only a min-height, and a non-auto height
    also blocks flex stretch — so the host takes height:auto and stretches to the body (26 Oct 2026)."""
    old = "obs-availability-bars.fa-av-bars { display: block; width: 100%; }"
    assert t.count(old) == 1, 'ov_ds2'
    return t.replace(old, "obs-availability-bars.fa-av-bars { display: block; width: 100%; height: auto; align-self: stretch; }")
t = ov_ds2_patch(t)












assert t.count("quickFilters: (pmAll() ? ['device'] : []).concat(['tag', 'kind']) });") == 1; t = t.replace("quickFilters: (pmAll() ? ['device'] : []).concat(['tag', 'kind']) });", "quickFilters: (pmAll() ? ['device'] : []).concat(['tag', 'cat', 'kind']) });")
def pol_kpi_patch(t):
    """Policies Analytics gets a KPI row + a view switch (owner, 26 Oct 2026: "add new kpi card for this Policies
    Analytics screen, help for policy overview … using the ObserveOps design system & /radio"). Five obs-kpi-card over
    the device's whole rule base — Total (Allow / Deny) · Active · Unused · With findings (Critical / Major / Warning)
    · Total traffic — then the DS segmented radio (obs-radio as-button, the DS's "small 2-5 always-visible exclusive
    choices") at the head of the grid's toolbar: All · Active · Unused · With findings, each with its count. The cards
    always describe the WHOLE rule base; the radio narrows the grid only."""
    MK = '/* FA-POL-KPI */'
    if MK in t:
        return t
    def rp(old, new):
        nonlocal t
        assert t.count(old) == 1, ('pol_kpi', old[:70], t.count(old)); t = t.replace(old, new)
    rp("""  const rows = rules.slice().sort((a, b) => a.seq - b.seq).map(r => ({
    id: r.id, seq: r.seq, name: r.name, sev: sevOf(r.finding), hits: r.hits, hitsTotal: r.hitsTotal, bytesTotal: r.bytesTotal""",
       """  POL_RULES = rules;
  const rows = rules.filter(polViewOk).sort((a, b) => a.seq - b.seq).map(r => ({
    id: r.id, seq: r.seq, name: r.name, sev: sevOf(r.finding), hits: r.hits, hitsTotal: r.hitsTotal, bytesTotal: r.bytesTotal""")
    rp("""  return `<div class="fa-stack">
    <section class="fa-card">
      ${stdGridHost('polGrid')}""", """  return `<div class="fa-stack">
    ${polKpiHTML(rules)}
    <section class="fa-card">
      ${stdGridHost('polGrid')}""")
    rp("""let PL_COLS = [], POL_FIELDS = [];""", """let PL_COLS = [], POL_FIELDS = [];
""" + MK + """
/* the view the grid shows; the KPI row always counts every rule. A rule is ACTIVE when its lifetime hit count is
   above zero (the grid's Hit Counts column), UNUSED otherwise; it has a FINDING when its severity is not clear —
   the same dot the Policy Name cell draws, so card, radio and grid cannot disagree. */
let POL_VIEW = 'all', POL_RULES = [];
/* the KPI row's design — review chrome (Option 1 stat cards · 2 KPI cards · 3 charts · 4 gauges); goes when one is picked */
let POL_KPI_OPT = '1';
const polIsActive = r => (r.hitsTotal || 0) > 0;
const polHasFinding = r => sevOf(r.finding) !== 'clear';
const POL_VIEW_TEST = { all: () => true, active: polIsActive, unused: r => !polIsActive(r), findings: polHasFinding };
const polViewOk = r => (POL_VIEW_TEST[POL_VIEW] || POL_VIEW_TEST.all)(r);
function polViewRadio() {
  const n = k => POL_RULES.filter(POL_VIEW_TEST[k]).length;
  const opts = [['all', 'All'], ['active', 'Active'], ['unused', 'Unused'], ['findings', 'With findings']]
    .map(([value, l]) => ({ value, label: `${l} (${n(value)})` }));
  return `<obs-radio class="fa-pol-view" as-button value="${POL_VIEW}" options='${j(opts)}' aria-label="Policy view"></obs-radio>`;
}
function bindPolView() {
  const el = view.querySelector('.fa-pol-view');
  /* obs-kpi-card's `title` prop is also the host's native title (DS gap 20): an empty title on its shadow .kpi stops
     the browser tooltip repeating the card title */
  view.querySelectorAll('obs-kpi-card.fa-pol-kc').forEach(k => {
    const go = () => { const d = k.shadowRoot && k.shadowRoot.querySelector('.kpi'); if (d) d.setAttribute('title', ''); return !!d; };
    if (!go()) setTimeout(go, 0);
  });
  const osw = view.querySelector('.fa-pol-optsw');
  if (osw) { osw.value = POL_KPI_OPT; osw.addEventListener('change', e => {
    const v = keyOf(detailOf(e)); if (v && v !== POL_KPI_OPT) { POL_KPI_OPT = v; renderContent(); } }); }
  if (!el) return;
  el.value = POL_VIEW;
  el.addEventListener('change', e => {
    const v = keyOf(detailOf(e));
    if (!v || v === POL_VIEW || !POL_VIEW_TEST[v]) return;
    POL_VIEW = v; renderContent();
  });
}
function polKpiHTML(rules) {
  const n = rules.length, act = rules.filter(polIsActive).length, un = n - act;
  const allow = rules.filter(r => /allow|accept|permit/i.test(r.action || '')).length;
  const sv = rules.map(r => sevOf(r.finding)), c = k => sv.filter(x => x === k).length;
  const fnd = sv.filter(x => x !== 'clear').length;
  const worst = c('critical') ? 'critical' : c('major') ? 'major' : fnd ? 'warning' : 'clear';
  const hits = rules.reduce((s, r) => s + (r.hitsTotal || 0), 0);
  const bytes = rules.reduce((s, r) => s + (r.bytesTotal || 0), 0);
  const top = rules.slice().sort((a, b) => (b.bytesTotal || 0) - (a.bytesTotal || 0))[0];
  const [bv, bu = ''] = fmtBytes(bytes).split(' ');
  const pct = v => (n ? Math.round(v / n * 100) : 0) + '%';
  const compact = v => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(v);
  /* DS "Stat cards" — the Policy KPI row pattern (obs-stat-card), as Policies Management's overview: one joined card for
     the rule base, one joined card for the findings postures, each with a severity dot (verified against the DS docs,
     26 Oct 2026 — obs-kpi-card is the monitor-metric card, and its `title` prop pops a tooltip: DS gap 20). */
  const summary = [
    { label: 'Total Policies', value: nf(n), caption: `${nf(allow)} Allow · ${nf(n - allow)} Deny` },
    { label: 'Active', severity: 'clear', value: nf(act), caption: `${nf(act)} of ${nf(n)} policies · ${compact(hits)} hits` },
    { label: 'Unused', severity: un ? 'warning' : 'clear', value: nf(un), caption: `${nf(un)} of ${nf(n)} policies · no hits`, ...(un ? { valueSeverity: 'warning' } : {}) },
    { label: 'Total Traffic', value: fmtBytes(bytes), caption: top ? `Top: ${top.name}` : 'No traffic' }
  ];
  const finds = [['Critical', 'critical'], ['Major', 'major'], ['Warning', 'warning'], ['Clean', 'clear']].map(([label, k]) =>
    ({ label, severity: k, value: nf(c(k)), caption: `${nf(c(k))} of ${nf(n)} policies`, ...(c(k) && k !== 'clear' ? { valueSeverity: k } : {}) }));
  const sw = `<div class="fa-pol-opt"><obs-radio class="fa-pol-optsw" as-button size="small" value="${POL_KPI_OPT}" aria-label="KPI design"
    options='${j([{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }, { value: '3', label: 'Option 3' }, { value: '4', label: 'Option 4' }])}'></obs-radio></div>`;
  const FS = [['Critical', 'critical'], ['Major', 'major'], ['Warning', 'warning'], ['Clean', 'clear']];
  const [hv, hu] = (m => m ? [m[1], m[2]] : [compact(hits), ''])(/^([\d.]+)([A-Za-z]*)$/.exec(compact(hits)));
  let body;
  /* Options 2 · 3 follow the DS DASHBOARD recipe (26 Oct 2026, owner: "improve using the ObserveOps design system"):
     a tile that holds a visualization (obs-progress / obs-gauge / obs-metric-list) IS an obs-widget-card — grey title
     strip, body in the default slot — the same chrome as this device's Overview tab ("widgets are obs-widget-card, NOT a
     generic .card div"). Every card's metric list carries FOUR rows, so the three cards fill to one height with no empty
     band; the loose notes became rows. A value is coloured only when it carries a threshold (Unused, a non-zero finding). */
  /* title="" on the body: obs-widget-card's `title` prop is also the host's native title attribute, so hovering the
     card popped a tooltip repeating the header (DS gap 20, also hit here); an empty title on a descendant stops it */
  const card = (title, inner) => widget(title, `<div class="fa-pol-cb" title="">${inner}</div>`, { cls: 'fa-pol-w', actions: '' });
  const ml = items => `<obs-metric-list class="fa-pol-ml" items='${j(items)}'></obs-metric-list>`;
  const sevItem = (v, label, k) => [String(v), '', label].concat(v && k !== 'clear' ? ['--severity-' + k] : []);
  const [tv, tu = ''] = top ? fmtBytes(top.bytesTotal || 0).split(' ') : ['—'];
  const usageMl = ml([[String(act), '', `Active · ${pct(act)}`], sevItem(un, `Unused · ${pct(un)}`, 'warning'),
    [String(allow), '', `Allow · ${nf(n - allow)} Deny`], [String(n), '', 'Total policies']]);
  const findMl = ml(FS.map(([label, k]) => sevItem(c(k), `${label} · ${pct(c(k))}`, k)));
  /* the Traffic by Policy card was removed (owner, 26 Oct 2026: "remove this") from Options 2 and 3 — the
     traffic figures are still in Option 1 and in the grid's Total Bytes column. */
  if (POL_KPI_OPT === '2') {
    /* Option 2 — obs-kpi-card, the DS KPI row (docs › Dashboard › KPI Card): six cards in one even row; an icon chip
       coloured by severity (the value text stays neutral — DS rule), at most two header stats, at most three footer
       values. Not wrapped in obs-widget-card (DS: the KPI card has no widget header). Counts, not percentages. */
    const kc = o => `<obs-kpi-card class="fa-pol-kc" title="${esc(o.title)}" icon="${o.icon}"${o.sev ? ` severity="${o.sev}"` : ''}${
      o.stats ? ` stats='${j(o.stats)}'` : ''}${o.values ? ` values='${j(o.values)}'` : ''}${o.value == null ? '' : ` value="${esc(o.value)}"`}${o.unit ? ` unit="${esc(o.unit)}"` : ''}></obs-kpi-card>`;
    const of = v => ({ label: 'Policies', value: `${nf(v)} of ${nf(n)}` });
    body = `<div class="fa-pol-kcs">${[
      kc({ title: 'Total Policies', icon: 'secure', values: [{ label: 'Allow', value: nf(allow) }, { label: 'Deny', value: nf(n - allow) }] }),
      kc({ title: 'Active', icon: 'check-circle', sev: act ? 'clear' : 'neutral', value: nf(act), stats: [of(act), { label: 'Hits', value: compact(hits) }] }),
      kc({ title: 'Unused', icon: 'ban', sev: un ? 'warning' : 'clear', value: nf(un), stats: [of(un)] }),
      kc({ title: 'Total Traffic', icon: 'traffic', value: bv, unit: bu, stats: [{ label: 'Top', value: top ? top.name : '—' }] }),
      kc({ title: 'Findings', icon: 'exclamation-triangle', sev: worst, stats: [of(fnd)],
           values: [['Critical', 'critical'], ['Major', 'major'], ['Warning', 'warning']].map(([label, k]) => ({ label, value: nf(c(k)) })) }),
      kc({ title: 'Clean', icon: 'shield-check', sev: 'clear', value: nf(c('clear')), stats: [of(c('clear'))] })
    ].join('')}</div>`;
  } else if (POL_KPI_OPT === '3') {
    /* Option 2 — charts, picked by the DS data-viz decision flow (26 Oct 2026, "better visualization"): a part-to-whole
       split is a DONUT (Policy Usage, Findings by Severity — the figure in the hole, the legend names every slice), a
       ranking is a TOP-N BAR (Traffic by policy). Drawn by DSCharts — this module's Highcharts layer, which reads every
       colour from DS tokens (--severity-* for status, the chart palette for categories) and re-themes on light/dark. */
    body = `<div class="fa-pol-w3 fa-pol-two">${[
      card('Policy Usage', '<div class="fa-pol-dn">' + vizDonut([{ name: `Active ${act}`, v: act, color: '--severity-clear' }, { name: `Unused ${un}`, v: un, color: '--severity-warning' }],
        nf(n), n === 1 ? 'Policy' : 'Policies', { h: 170, legendRight: true }) + '</div>'),
      card('Findings by Severity', '<div class="fa-pol-dn">' + vizDonut(FS.map(([name, k]) => ({ name: `${name} ${c(k)}`, v: c(k), color: '--severity-' + k })),
        nf(fnd), 'With findings', { h: 170, legendRight: true }) + '</div>')
    ].join('')}</div>`;
  } else if (POL_KPI_OPT === '4') {
    /* Option 3 — obs-gauge groups: one dial per member, every dial in a row against the same total (all policies) */
    const dials = list => `<div class="fa-pol-dials">${list.map(([label, v, sev]) =>
      `<obs-gauge value="${v}" total="${n}" severity="${sev}" label="${esc(label)}"></obs-gauge>`).join('')}</div>`;
    body = `<div class="fa-pol-w2">${[
      card('Policy Usage', dials([['Active', act, 'clear'], ['Unused', un, 'warning']])),
      card('Findings by Severity', dials(FS.map(([label, k]) => [label, c(k), k])))
    ].join('')}</div>`;
  } else {
    body = `<div class="fa-pol-kpis">
    <obs-stat-card class="fa-pol-stats" items='${j(summary)}'></obs-stat-card>
    <obs-stat-card class="fa-pol-stats fa-pol-finds" items='${j(finds)}'></obs-stat-card>
  </div>`;
  }
  return sw + body;
}""")
    rp(""" if(this.tagName==='OBS-WIDGET-CARD')""", """ if(this.tagName==='OBS-METRIC-LIST'){try{var pm=new CSSStyleSheet();pm.replaceSync(':host(.fa-pol-ml) .ml{max-width:none}:host(.fa-pol-ml) .v{width:34%}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[pm]);}catch(e){}}if(this.tagName==='OBS-TABLE'){try{var pt=new CSSStyleSheet();pt.replaceSync(':host(.fa-pol-tt) .bar-fill{background:var(--fa-series-1)!important}');r.adoptedStyleSheets=[].concat(r.adoptedStyleSheets||[],[pt]);}catch(e){}}
 if(this.tagName==='OBS-WIDGET-CARD')""")
    rp("      b.legend.layout = o.legendLayout || 'horizontal';", "      b.legend.layout = o.legendLayout || 'horizontal';\n      /* opt-in (Policies Analytics, 26 Oct 2026): the legend beside the donut, so a short card carries both */\n      if (o.legendRight) { b.legend.layout = 'vertical'; b.legend.align = 'right'; b.legend.verticalAlign = 'middle'; b.legend.itemMarginBottom = 6; }")
    rp('  })), centerBig, centerSmall, { h: opts.h || 230, legendLayout: opts.legendLayout });', '  })), centerBig, centerSmall, { h: opts.h || 230, legendLayout: opts.legendLayout, legendRight: opts.legendRight });')
    rp("""  mountStdGrid('polGrid', { columns: PL_COLS, table: 'tblRules', search: 'Search', fields: POL_FIELDS });""",
       """  mountStdGrid('polGrid', { columns: PL_COLS, table: 'tblRules', search: 'Search', fields: POL_FIELDS });   /* the All · Active · Unused · With findings switch was removed (owner, 26 Oct 2026) */
  bindPolView();""")
    k = t.index('</style>', t.index('/* prototype.css */'))
    t = t[:k] + """
/* Policies Analytics KPI row (26 Oct 2026): two joined obs-stat-card — the rule base, then the findings postures —
   side by side; stacked on a narrow pane */
.fa-pol-kpis { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 3fr); gap: var(--ds-padding-md, 16px);
  margin-bottom: var(--ds-padding-md, 16px); }
obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }
@media (max-width: 1366px) { .fa-pol-kpis { grid-template-columns: minmax(0, 1fr); } }
.fa-pol-opt { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.fa-pol-kcs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: var(--ds-padding-md, 16px); margin-bottom: var(--ds-padding-md, 16px); }
obs-kpi-card.fa-pol-kc { display: block; min-width: 0; --kpi-card-min-height: 150px; }
@media (max-width: 1366px) { .fa-pol-kcs { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.fa-pol-w3, .fa-pol-w2 { display: grid; gap: var(--ds-padding-md, 16px); margin-bottom: var(--ds-padding-md, 16px); }
.fa-pol-w3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.fa-pol-w2 { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
.fa-pol-w3.fa-pol-two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.fa-pol-two .fa-pol-w > .fa-card-body { padding: 8px 16px; }
/* donut + its legend kept together and centred (the chart would otherwise stretch the full card width) */
.fa-pol-dn { width: 100%; max-width: 340px; margin: 0 auto; }
/* the generic card: the module's .fa-card surface (DS tokens), a 14px/500 title, 16px inset */
.fa-pol-w3 > .fa-wc, .fa-pol-w2 > .fa-wc { margin: 0; height: 100%; }
.fa-pol-w > .fa-card-body { padding: 12px 16px 8px; }
.fa-pol-w.fa-wc-flush > .fa-card-body { padding: 0; }
.fa-pol-cb { display: flex; flex-direction: column; gap: 12px; }
obs-progress.fa-pol-seg, obs-metric-list.fa-pol-ml, obs-table.fa-pol-tt { display: block; }
/* Traffic by Policy — ranked rows: rank · name · size + share, then the share as a small obs-progress */
.fa-pol-rank { list-style: none; margin: 0; padding: 0 12px; display: flex; flex-direction: column; gap: 12px; }
.fa-pol-rank li { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; column-gap: 8px; row-gap: 6px; align-items: baseline; }
.fa-pol-rk { font-size: 11px; color: var(--neutral-light); font-variant-numeric: tabular-nums; }
.fa-pol-rn { font-size: 13px; color: var(--page-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fa-pol-rv { font-size: 13px; font-weight: 600; color: var(--page-text-color); white-space: nowrap; }
.fa-pol-rv em { font-style: normal; font-weight: 400; font-size: 11px; color: var(--neutral-light); margin-left: 8px; }
obs-progress.fa-pol-rb { display: block; grid-column: 2 / -1; }
.fa-pol-w > .fa-card-body { display: flex; flex-direction: column; }
.fa-pol-cb { flex: 1 1 auto; }
/* the DS example's gauge row: centred both ways in the body (docs › Widget Grid › Alert Count) */
.fa-pol-dials { flex: 1 1 auto; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px 48px; padding: 4px 0; }
@media (max-width: 1366px) { .fa-pol-w3, .fa-pol-w2 { grid-template-columns: minmax(0, 1fr); } }
""" + t[k:]
    return t
t = pol_kpi_patch(t)

def ov_split_patch(t):
    """Objects + Policies overviews split into SEPARATE cards (owner, 27 Oct 2026): the paired tiles share one card
    (Assigned + Unassigned, Unused + Unassigned), and Pending Approval stands alone and opens Policy & Object Approval."""
    old = """  return `<div class="fa-pm-ovrow fa-pm-one"><obs-stat-card class="fa-pm-stats" items='${j(items)}'></obs-stat-card></div>`;"""
    assert t.count(old) == 2, 'ov_split markup'
    a = t.index(old); t = t[:a] + "  return pmOvSplit(items, [1, 2, 1]);" + t[a + len(old):]          # Policies
    a = t.index(old); t = t[:a] + "  return pmOvSplit(items, [2, 2, 1]);" + t[a + len(old):]          # Objects
    fn = "function pmRulesOverview(rules, dev) {"
    assert t.count(fn) == 1, 'ov_split fn anchor'
    helper = r"""/* the overview as SEPARATE cards (owner, 27 Oct 2026): `groups` slices the tiles into one obs-stat-card each, sized by
   how many tiles it holds so every tile is the same width; the LAST card is Pending Approval and opens the Approval tab */
function pmOvSplit(items, groups) {
  let k = 0;
  const cards = groups.map((n, gi) => {
    const part = items.slice(k, k += n), last = gi === groups.length - 1;
    const card = `<obs-stat-card class="fa-pm-stats" items='${j(part)}'></obs-stat-card>`;
    return last ? `<div class="fa-pm-go" role="button" tabindex="0" data-pm-go="approval" aria-label="Open Policy &amp; Object Approval"
      data-tip="Open Policy &amp; Object Approval">${card}</div>` : card;
  });
  return `<div class="fa-pm-ovrow fa-pm-split" style="grid-template-columns:${groups.map(n => `minmax(0,${n}fr)`).join(' ')}">${cards.join('')}</div>`;
}
function pmGoApproval() {
  if (typeof dev1 !== 'undefined' && dev1 && dev1.tab === 'policy') { dev1.sub[dev1.tab] = STATUS_SEC; go('device', devRoute()); }
}
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-pm-go="approval"]')) pmGoApproval(); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('[data-pm-go="approval"]')) { e.preventDefault(); pmGoApproval(); } });
"""
    t = t.replace(fn, helper + fn)
    css = ".fa-pm-ovrow.fa-pm-one { grid-template-columns: minmax(0, 1fr); }"
    assert t.count(css) == 1, 'ov_split css'
    return t.replace(css, css + """
.fa-pm-ovrow.fa-pm-split > obs-stat-card.fa-pm-stats, .fa-pm-go > obs-stat-card.fa-pm-stats { margin-bottom: 0; height: 100%; }
.fa-pm-go { display: block; height: 100%; cursor: pointer; border-radius: var(--btn-radius, 4px); outline: 1px solid transparent; transition: outline-color .12s; }
.fa-pm-go:hover, .fa-pm-go:focus-visible { outline-color: var(--primary-alt, var(--primary)); }""")
t = ov_split_patch(t)

def sb_notify_patch(t):
    """Schedule Backup's Notify (owner, 27 Oct 2026): the DS's own obs-notify — the Notify field with a "+ Bcc" button
    at its right, and the Bcc row with a remove ⊗ — in place of a plain input over a "+ Add Bcc" text link."""
    old = """    ${field('Notify', `<obs-input id="fmNotify" block placeholder="Email or Mobile Number" value="${esc(f.notify)}"></obs-input>`)}
    ${f.bcc === null
      ? `<obs-link id="fmAddBcc" class="fa-form-add">+ Add Bcc</obs-link>`
      : `<div class="fa-form-row-remove">
           ${field('Bcc', `<obs-input id="fmBcc" block placeholder="Email" value="${esc(f.bcc)}"></obs-input>`)}
           <obs-button variant="transparent" square id="fmRmBcc" aria-label="Remove Bcc" title="Remove Bcc"><obs-icon name="timesCircle" size="16"></obs-icon></obs-button>
         </div>`}`;"""
    new = """    <obs-notify id="fmNotify" value="${esc(f.notify)}"${f.bcc === null ? '' : ` bcc="${esc(f.bcc)}" show-bcc`}></obs-notify>`;"""
    assert t.count(old) == 1, 'sb_notify markup'
    t = t.replace(old, new)
    old = """  on('#fmNotify', 'change', e => { fm.notify = detailOf(e) || ''; });
  on('#fmBcc', 'change', e => { fm.bcc = detailOf(e) || ''; });"""
    new = """  /* obs-notify emits input {notify, bcc} as you type and bcc-toggle when its Bcc row opens or closes; it keeps its own
     row state, so neither event re-renders the form (that would drop the caret) */
  on('#fmNotify', 'input', e => { const d = detailOf(e) || {}; fm.notify = d.notify || ''; if (fm.bcc !== null) fm.bcc = d.bcc || ''; });
  on('#fmNotify', 'bcc-toggle', e => { fm.bcc = detailOf(e) ? (fm.bcc || '') : null; });"""
    assert t.count(old) == 1, 'sb_notify bind'
    return t.replace(old, new)
t = sb_notify_patch(t)

def ov_pair_patch(t):
    """the paired overview tiles as ONE pass/fail-style tile (owner, 27 Oct 2026, the Compliance "Rules · 21 passed | 64
    failed · of 85 rules evaluated" card as the reference): Objects reads "N assigned | N unassigned · of N objects",
    Policies "N unused | N unassigned · of N policies". obs-stat-card's own pair row; its words and colours re-labelled."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'ov_pair ' + what
        t = t.replace(a, b)
    rp("""    { label: 'Unused', value: nf(unused), caption: nf(used) + ' used', ...(unused ? { valueSeverity: 'warning' } : {}) },
    { label: 'Unassigned', value: nf(unasg), caption: of(unasg), ...(unasg ? { valueSeverity: 'warning' } : {}) },""",
       """    /* both halves are findings, so both read amber (a zero reads plain) — not the DS pair's green | red */
    { label: 'Policy Usage', passed: nf(unused), failed: nf(unasg), caption: 'of ' + nf(n) + ' policies',
      pairWords: 'unused,unassigned', pairColors: (unused ? 'warning' : '') + ',' + (unasg ? 'warning' : '') },""", 'pol items')
    rp("  return pmOvSplit(items, [1, 2, 1]);", "  return pmOvSplit(items, [1, 1, 1]);", 'pol groups')
    rp("""    { label: 'Assigned', value: nf(asg), caption: mix(o => objectTags(o).includes('Assigned')), percent: n ? asg / n * 100 : 0, barSeverity: 'clear' },
    { label: 'Unassigned', value: nf(n - asg), caption: mix(o => !objectTags(o).includes('Assigned')), percent: n ? (n - asg) / n * 100 : 0,
      barSeverity: 'warning', ...(n - asg ? { valueSeverity: 'warning' } : {}) },""",
       """    { label: 'Object Assignment', passed: nf(asg), failed: nf(n - asg), caption: 'of ' + nf(n) + ' objects',
      pairWords: 'assigned,unassigned', pairColors: 'clear,' + (n - asg ? 'warning' : '') },""", 'obj items')
    rp("  return pmOvSplit(items, [2, 2, 1]);", "  return pmOvSplit(items, [2, 1, 1]);", 'obj groups')
    rp("""    const card = `<obs-stat-card class="fa-pm-stats" items='${j(part)}'></obs-stat-card>`;""",
       """    const pw = part.find(x => x.pairWords);
    const card = `<obs-stat-card class="fa-pm-stats"${pw ? ` data-pair-words="${pw.pairWords}" data-pair-colors="${pw.pairColors || ''}"` : ''} items='${j(part)}'></obs-stat-card>`;""", 'card attrs')
    rp("""      s.forEach((el, i) => { if (w[i] && el.textContent !== w[i]) el.textContent = w[i]; }); });""",
       """      s.forEach((el, i) => { if (w[i] && el.textContent !== w[i]) el.textContent = w[i]; });
      /* data-pair-colors="clear,warning": a severity per half, '' leaves that half plain page ink (a zero is not a finding) */
      if (c.hasAttribute('data-pair-colors')) { const cl = c.getAttribute('data-pair-colors').split(',');
        row.querySelectorAll('b').forEach((b, i) => { const v = cl[i] ? `var(--severity-${cl[i]})` : 'var(--page-text-color)'; if (b.style.color !== v) b.style.color = v; }); } });""", 'colors')
    return t
t = ov_pair_patch(t)

def obj_section_patch(t):
    """Add / Edit Object in SECTIONS, like Add Policy (owner, 27 Oct 2026): name, description, firewall and the Object
    Category switch on top; then the chosen category is a section heading — its title and the one-line help PMO_CATS
    already carries — over Type and every field that depends on it."""
    head = "const pmoDevField = (ns, f) =>"
    assert t.count(head) == 1, 'obj_section helper anchor'
    t = t.replace(head, "const pmoSecHead = f => (PMO_CATS[f.cat] ? pmSecHead(PMO_CATS[f.cat].label, PMO_CATS[f.cat].help) : '');\n" + head)
    for key, what in (("ntype", 'network'), ("stype", 'service')):
        old = """    </div><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}
      ${pmoCatField(ns, f)}
      ${pmSelect(ns, f, '%s', 'Type',""" % key
        new = """    </div><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}
      ${pmoCatField(ns, f)}
    </div>
    ${pmoSecHead(f)}
    <div class="fa-grid cols-2">
      ${pmSelect(ns, f, '%s', 'Type',""" % key
        assert t.count(old) == 1, 'obj_section ' + what
        t = t.replace(old, new)
    return t
t = obj_section_patch(t)

def nat_view_patch(t):
    """VIEW NAT POLICY (owner, 27 Oct 2026): the NAT grid's Name is a link that opens a read-only drawer laid out like
    View Policy — the same pmViewHTML, sections for what is translated on each side, every value the row's own."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'nat_view ' + what
        t = t.replace(a, b)
    rp("""    { key: 'name', title: 'Name', width: 200, fixed: true },
    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 130 }]),
    { key: 'dstIntf'""", """    { key: 'name', title: 'Name', width: 200, fixed: true, type: 'link' },
    ...(dev ? [] : [{ key: 'device', title: 'Firewall', width: 130 }]),
    { key: 'dstIntf'""", 'name link')
    rp("function viewPolicyDrawer(id) {", r"""function viewNatDrawer(id) {
  const n = D.natRules.find(x => x.id === id); if (!n) return;
  const tags = natTags(n);
  openDrawer('View NAT Policy', pmViewHTML([
    ['NAT Policy Name', n.name], ['Firewall Name', n.device],
    ['Type', n.type], ['Hits', n.hits == null ? '—' : nf(n.hits)],
    ['__sec', 'Source', 'Where the traffic comes from, and the address its source is translated to.'],
    ['Source Interface', portLabel(n.device, n.srcIntf)], ['Source IP', n.srcIp],
    ['Mapped Source IP', n.mSrcIp], ['', ''],
    ['__sec', 'Destination', 'Where the traffic is going, and the address its destination is translated to.'],
    ['Destination Interface', portLabel(n.device, n.dstIntf)], ['Destination IP', n.dstIp],
    ['Mapped Destination IP', n.mDstIp], ['', ''],
    ['__sec', 'Services', 'The protocol and port this NAT policy matches, and the port it is translated to.'],
    ['Service', n.svc], ['Mapped Service', n.mSvc],
    ['__line'],
    ['Tag', tags, 'chips', tags.includes('Unused') || tags.includes('Unassigned') ? 'tag-orange' : 'tag-green', true]
  ]), '', '40%');
}
function viewPolicyDrawer(id) {""", 'drawer')
    rp("  const pmSt = view.querySelector('#tblPmStatus');", """  const pmNat = view.querySelector('#tblPmNat');
  if (pmNat) pmNat.addEventListener('cellaction', e => { const p = detailOf(e) || {}; if (p.key === 'name' && p.id) viewNatDrawer(p.id); });
  const pmSt = view.querySelector('#tblPmStatus');""", 'bind')
    return t
t = nat_view_patch(t)

def apv_head_tag_patch(t):
    """the change drawer's status tag sits IN THE HEADER, under the title (owner, 27 Oct 2026 — the Approval module's own
    drawer as the reference). obs-drawer's `title` slot carries the title + the tag; every other drawer keeps the plain
    title attribute, because openDrawer only fills the slot when it is given something to put under the title."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'apv_head ' + what
        t = t.replace(a, b)
    rp("""function openDrawer(title, body, actions, width = '52%') {
  drawer.setAttribute('title', title);
  drawer.setAttribute('width', width);   /* the device drawer's Activity table needs more room than a detail */
  drawer.innerHTML = `<div>${body}</div>` +
    (actions ? `<div slot="actions" class="fa-row">${actions}</div>` : '');""",
       """function openDrawer(title, body, actions, width = '52%', under = '') {
  drawer.setAttribute('title', title);
  drawer.setAttribute('width', width);   /* the device drawer's Activity table needs more room than a detail */
  drawer.innerHTML = `<div>${body}</div>` +
    (actions ? `<div slot="actions" class="fa-row">${actions}</div>` : '') +
    (under ? `<div slot="title" style="display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0">
      <span style="max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</span>
      <span style="display:inline-flex;font-size:12px;font-weight:400;line-height:normal">${under}</span></div>` : '');""", 'openDrawer')
    rp("""  const out = [`<div class="fa-apvd-st">${tag(st, FA_APV_TAG[a.st])}</div>`,
    sec('Requestor info',""", """  const out = [sec('Requestor info',""", 'body tag')
    rp("""<div class="fa-apvd">${out.join('')}</div>`, acts, '40%');""",
       """<div class="fa-apvd">${out.join('')}</div>`, acts, '40%', tag(st, FA_APV_TAG[a.st]));""", 'pass tag')
    return t
t = apv_head_tag_patch(t)

def apv_cancel_patch(t):
    """Policies Management is the REQUESTER's view (owner, 27 Oct 2026): "I can only cancel the request, not approve —
    approve is only the admin". The change drawer's Reject · Approve became one Cancel request (confirmed first); a
    cancelled request reads Cancelled, keeps its row for the record, and leaves the Pending Approval count. Approving and
    rejecting stay where the approver works — Option 1's Approval screen, which reads the same oo-apv-decisions."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'apv_cancel ' + what
        t = t.replace(a, b)
    rp("const FA_APV_TAG = { Pending: 'tag-orange', Approved: 'tag-green', Rejected: 'tag-red' };",
       "const FA_APV_TAG = { Pending: 'tag-orange', Approved: 'tag-green', Rejected: 'tag-red', Cancelled: 'tag-unknown' };", 'tag')
    rp("values: ['Pending Approval', 'Approved', 'Rejected'] }", "values: ['Pending Approval', 'Approved', 'Rejected', 'Cancelled'] }", 'filter')
    rp("""  out.push(sec('Approver info', [row('Approver', a.by || '—')].concat(a.st === 'Pending' ? [] : [row('Decision', tag(a.st, FA_APV_TAG[a.st]), true)])));
  const acts = a.st === 'Pending' && p.apv ? `<span class="fa-spacer"></span><obs-button variant="default" class="fa-apvd-rej" data-apv-dec="Rejected">Reject</obs-button><obs-button variant="primary" data-apv-dec="Approved">Approve</obs-button>` : '';""",
       """  out.push(sec('Approver info', a.st === 'Cancelled'
    ? [row('Approver', '—'), row('Decision', tag('Cancelled', FA_APV_TAG.Cancelled), true), row('Cancelled by', a.cancelledBy || p.by)]
    : [row('Approver', a.by || '—')].concat(a.st === 'Pending' ? [] : [row('Decision', tag(a.st, FA_APV_TAG[a.st]), true)])));
  const acts = a.st === 'Pending' && p.apv ? `<span class="fa-spacer"></span><obs-button variant="default" class="fa-apvd-rej" data-apv-cancel>Cancel request</obs-button>` : '';""", 'footer')
    rp("""  drawer.querySelectorAll('obs-button[data-apv-dec]').forEach(b => b.addEventListener('click', () => {""",
       """  drawer.querySelectorAll('obs-button[data-apv-cancel]').forEach(b => b.addEventListener('click', () => {
    if (b.__done) return; b.__done = 1; setTimeout(() => { b.__done = 0; }, 400);   /* obs-button fires twice */
    askConfirm({ title: 'Cancel this request?', icon: 'times-circle', confirmText: 'Cancel request',
      body: `The request to ${p.op.toLowerCase()} ${p.newName || p.target} on ${p.device} is withdrawn. It is not sent to the approver and nothing changes on the firewall. Raise it again to bring it back.`,
      onOk: () => {
        let dec = {}; try { dec = JSON.parse(localStorage.getItem('oo-apv-decisions') || '{}'); } catch (e) {}
        dec[p.apv] = { st: 'Cancelled', by: '', cancelledBy: p.by, at: new Date().toISOString() };
        try { localStorage.setItem('oo-apv-decisions', JSON.stringify(dec)); } catch (e) {}
        renderContent(); viewChangeDrawer(id);
      } });
  }));
  drawer.querySelectorAll('obs-button[data-apv-dec]').forEach(b => b.addEventListener('click', () => {""", 'bind')
    return t
t = apv_cancel_patch(t)

def apv_keep_patch(t):
    """the cancel confirm's two buttons read Keep request · Cancel request — "Cancel" beside "Cancel request" is two
    words for opposite answers. askConfirm takes an optional cancelText; every other confirm keeps obs-modal's Cancel."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'apv_keep ' + what
        t = t.replace(a, b)
    rp("""function askConfirm({ title, icon = 'times-circle', body, confirmText = 'Confirm', variant = 'error', onOk }) {
  confirm.setAttribute('title', title);""", """function askConfirm({ title, icon = 'times-circle', body, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'error', onOk }) {
  confirm.setAttribute('title', title);
  confirm.setAttribute('cancel-text', cancelText);""", 'askConfirm')
    rp("askConfirm({ title: 'Cancel this request?', icon: 'times-circle', confirmText: 'Cancel request',",
       "askConfirm({ title: 'Cancel this request?', icon: 'times-circle', confirmText: 'Cancel request', cancelText: 'Keep request',", 'use')
    return t
t = apv_keep_patch(t)

def pm_spacing_patch(t):
    """Add Policy / Add Object rhythm (owner, 27 Oct 2026: "the line alignment like other margin padding", "use universal
    space"). Measured first: every divider INSIDE the form sits 28px under the row above it (the form's 20px gap + its own
    8px) with 20px under it — but the one before "Reason for request" is OUTSIDE the form, so it got 8px above and 16px
    below, and Service Object's Type -> protocol rows were 40px (20 gap + 20 margin). All three now take the form's own
    numbers. And "Log firewall traffic" becomes a settings row — title + one line of description, an ON/OFF obs-switch
    at the right — the shape the Create Dashboard drawer's "Default landing dashboard" uses."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'pm_spacing ' + what
        t = t.replace(a, b)
    rp("#pmAddDrawer .fa-pmf-logrow { display: flex; align-items: center; gap: 8px; margin-top: 16px; }",
       """#pmAddDrawer .fa-pmf-logrow { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 8px; }
#pmAddDrawer .fa-pmf-logt { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
#pmAddDrawer .fa-pmf-logt b { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--page-text-color); }
#pmAddDrawer .fa-pmf-logt span { font-size: 12.8px; line-height: 18px; color: var(--neutral-light); }
#pmAddDrawer .fa-pmf-logrow obs-switch { flex: 0 0 auto; }
/* the divider before Reason for request sits outside the form: give it the form's own 28px above / 20px below */
#pmAddDrawer .fa-pmf-form + .fa-pmsep { margin-top: 28px; }
#pmAddDrawer .fa-pmsep + .fa-pmf-reason { margin-top: 20px; }
/* Service Object: Type -> protocol rows on the form's 20px row gap, not 20 gap + 20 margin */
#pmAddDrawer .fa-pmf-form > .fa-svc-rows { margin-top: 0; }""", 'css')
    rp("""      <obs-checkbox data-${ns}="log"${f.log ? ' checked' : ''}>Log firewall traffic</obs-checkbox>
      <obs-tooltip placement="top"><obs-icon slot="trigger" name="infoCircle" size="14" class="fa-field-info" label="About logging"></obs-icon>On: every session this policy allows or denies is logged and the logs are collected. Off: no traffic logs are collected for this policy.</obs-tooltip>""",
       """      <div class="fa-pmf-logt"><b>Log firewall traffic</b><span>Every session this policy allows or denies is logged and collected.</span></div>
      <obs-switch data-${ns}="log"${f.log ? ' checked' : ''} checked-text="ON" unchecked-text="OFF" aria-label="Log firewall traffic"></obs-switch>""", 'markup')
    return t
t = pm_spacing_patch(t)

def svcg_chips_patch(t):
    """Service Group members (owner, 27 Oct 2026: "when I select all members the dropdown shows this — wrong"): the picked
    members were a full-width list of rows with a ⊗ each under the select, which read as a dropdown left open. They are
    closable obs-tag chips now, wrapping under the field; a chip's ✕ (its own close event) takes the member out."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'svcg ' + what
        t = t.replace(a, b)
    rp("""const svcgListHTML = f => f.members.map(m => `<div class="fa-svcg-item"><span>${esc(m)}</span><button type="button" class="fa-svc-ib del" data-svcg-del="${esc(m)}" aria-label="Remove ${esc(m)}" data-tip="Remove"><obs-icon name="times-circle" size="16"></obs-icon></button></div>`).join('');""",
       """const svcgListHTML = f => f.members.map(m => `<obs-tag closable data-svcg-del="${esc(m)}" aria-label="${esc(m)}">${esc(m)}</obs-tag>`).join('');""", 'html')
    rp("const bindDel = () => list && list.querySelectorAll('[data-svcg-del]').forEach(b => b.addEventListener('click', () => {",
       "const bindDel = () => list && list.querySelectorAll('[data-svcg-del]').forEach(b => b.addEventListener('close', () => {", 'bind')
    rp(".fa-svcg-list { max-height: 200px; overflow-y: auto; }",
       ".fa-svcg-list { display: flex; flex-wrap: wrap; gap: 6px; max-height: 120px; overflow-y: auto; }", 'css')
    rp(".fa-svcg-list:not(:empty) { margin-top: 1px; }", ".fa-svcg-list:not(:empty) { margin-top: 2px; }", 'css2')
    return t
t = svcg_chips_patch(t)

def pol_finds_patch(t):
    """Policies Analytics, Option 1 (owner, 27 Oct 2026 — the Compliance "Rules · 21 passed | 64 failed · of 85 rules
    evaluated" card as the reference): the four severity tiles become ONE tile, "N critical | N major | N warning | N clean
    · of N policies". obs-stat-card's pair row holds only two values, so this is that tile's own anatomy rebuilt with its
    measurements (13px/500 label, 28px mono figures, 12.8px words, 24px dividers, 7px radius, the widget tokens). A count
    is coloured only when it is not zero — a zero is not a finding."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'pol_finds ' + what
        t = t.replace(a, b)
    rp("""    <obs-stat-card class="fa-pol-stats fa-pol-finds" items='${j(finds)}'></obs-stat-card>
  </div>`;""", """    <div class="fa-pol-fcard" role="group" aria-label="Findings: ${FS.map(([l, k]) => `${nf(c(k))} ${l.toLowerCase()}`).join(', ')}, of ${nf(n)} policies">
      <span class="fa-pol-fk">Findings</span>
      <div class="fa-pol-frow">${FS.map(([l, k], i) => `${i ? '<i class="fa-pol-fdv" aria-hidden="true"></i>' : ''}<b${c(k) ? ` style="color:var(--severity-${k})"` : ''}>${nf(c(k))}</b><span>${l.toLowerCase()}</span>`).join('')}</div>
      <span class="fa-pol-flb">of ${nf(n)} ${n === 1 ? 'policy' : 'policies'}</span>
    </div>
  </div>`;""", 'markup')
    rp("obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }",
       """obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }
.fa-pol-fcard { display: flex; flex-direction: column; gap: 8px; padding: 16px 20px; min-width: 0; height: 100%; box-sizing: border-box;
  border: 1px solid var(--widget-border-color); border-radius: 7px; background: var(--widget-background, var(--page-background-color)); color: var(--page-text-color); }
.fa-pol-fk { height: 18px; font-size: 13px; font-weight: 500; line-height: 18px; }
.fa-pol-frow { display: flex; align-items: center; gap: 8px; height: 32px; min-width: 0; }
.fa-pol-frow b { font: 600 28px/1 var(--numeric-font-family, 'JetBrains Mono', monospace); white-space: nowrap; }
.fa-pol-frow span { font-size: 12.8px; color: var(--neutral-light); align-self: flex-end; margin: 0 0 5px; white-space: nowrap; }
.fa-pol-fdv { flex: 0 0 1px; height: 24px; background: var(--border-color); margin: 0 6px; }
.fa-pol-flb { height: 18px; line-height: 18px; font-size: 12px; color: var(--neutral-light); white-space: nowrap; }""", 'css')
    return t
t = pol_finds_patch(t)

def dev_alert_rings_patch(t):
    """the firewall header carries its ACTIVE ALERT COUNT (owner, 27 Oct 2026 — the product's own monitor header as the
    reference: a ring per severity, the count inside in that severity's colour, the arc its share of the alerts). One
    ring per severity that has alerts, worst first; clicking any of them opens the Active Alerts tab. Read off
    deviceAlerts(d) — the rows that tab lists — so the header and the grid cannot disagree."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'dev_rings ' + what
        t = t.replace(a, b)
    rp("""        <obs-button variant="neutral-lightest" squared aria-label="Refresh" data-tip="Refresh" data-mdh="refresh">""",
       """        ${(() => { const al = deviceAlerts(d), n = al.length, C = 2 * Math.PI * 15;
          const sevs = [['critical', 'Critical'], ['major', 'Major'], ['warning', 'Warning'], ['clear', 'Clear']]
            .map(([k, l]) => [k, l, al.filter(a => a.sev === k).length]).filter(x => x[2]);
          return sevs.length ? `<span class="fa-mdh-rings">${sevs.map(([k, l, c]) => `<button type="button" class="fa-mdh-ring" data-mdh="alerts"
            aria-label="${c} ${l.toLowerCase()} alert${c === 1 ? '' : 's'} — open Active Alerts" data-tip="${c} ${l} · open Active Alerts" style="--ring:var(--severity-${k})">
            <svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="tr"></circle>
              <circle cx="18" cy="18" r="15" class="ar" stroke-dasharray="${(C * c / n).toFixed(2)} ${C.toFixed(2)}"></circle></svg>
            <b>${nf(c)}</b></button>`).join('')}</span>` : ''; })()}
        <obs-button variant="neutral-lightest" squared aria-label="Refresh" data-tip="Refresh" data-mdh="refresh">""", 'markup')
    rp("""    if (b.dataset.mdh === 'home') go('devices', devReturn);""",
       """    if (b.dataset.mdh === 'home') go('devices', devReturn);
    else if (b.dataset.mdh === 'alerts') { dev1.tab = 'alerts'; go('device', devRoute()); }""", 'click')
    rp(".fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }",
       """.fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }
.fa-mdh-rings { display: inline-flex; align-items: center; gap: 8px; margin-right: 8px; }
.fa-mdh-ring { appearance: none; position: relative; display: inline-grid; place-items: center; width: 36px; height: 36px; padding: 0;
  border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
.fa-mdh-ring svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.fa-mdh-ring circle { fill: none; stroke-width: 2.5; }
.fa-mdh-ring .tr { stroke: var(--border-color); }
.fa-mdh-ring .ar { stroke: var(--ring); stroke-linecap: round; }
.fa-mdh-ring b { position: relative; font: 600 13px/1 var(--numeric-font-family, 'JetBrains Mono', monospace); color: var(--ring); }
.fa-mdh-ring:hover { background: color-mix(in srgb, var(--ring) 12%, transparent); }
.fa-mdh-ring:focus-visible { outline: 2px solid var(--primary-alt); outline-offset: 2px; }""", 'css')
    return t
t = dev_alert_rings_patch(t)

def dev_alert_rings2_patch(t):
    """the header rings at the PRODUCT's own numbers (owner, 27 Oct 2026, the live monitor header's markup supplied): 45px
    circles 5px apart, an ant-progress-circle stroke of 4 on a 100 viewBox (r 48) with round caps over a --border-color
    trail, the count an h4 in the severity's colour. CLEAR is not a ring: a --severity-clear-lightest disc with a 0.1
    hairline, exactly as the product draws it."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'dev_rings2 ' + what
        t = t.replace(a, b)
    rp("const al = deviceAlerts(d), n = al.length, C = 2 * Math.PI * 15;", "const al = deviceAlerts(d), n = al.length, C = 2 * Math.PI * 48;", 'C')
    rp("""<button type="button" class="fa-mdh-ring" data-mdh="alerts\"""", """<button type="button" class="fa-mdh-ring${k === 'clear' ? ' clr' : ''}" data-mdh="alerts\"""", 'cls')
    rp("""<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="tr"></circle>
              <circle cx="18" cy="18" r="15" class="ar\"""", """<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" class="tr"></circle>
              <circle cx="50" cy="50" r="48" class="ar\"""", 'svg')
    rp(".fa-mdh-rings { display: inline-flex; align-items: center; gap: 8px; margin-right: 8px; }",
       ".fa-mdh-rings { display: inline-flex; align-items: center; gap: 5px; margin-right: 8px; }", 'gap')
    rp("width: 36px; height: 36px; padding: 0;\n  border: 0; border-radius: 50%; background: transparent; cursor: pointer; }",
       "width: 45px; height: 45px; padding: 0; font: inherit;\n  border: 0; border-radius: 50%; background: transparent; cursor: pointer; }\n.fa-mdh-ring.clr { background: var(--severity-clear-lightest); }", 'size')
    rp(".fa-mdh-ring circle { fill: none; stroke-width: 2.5; }", ".fa-mdh-ring circle { fill: none; stroke-width: 4; }\n.fa-mdh-ring.clr circle { stroke-width: 0.1; }", 'stroke')
    rp(".fa-mdh-ring b { position: relative; font: 600 13px/1 var(--numeric-font-family, 'JetBrains Mono', monospace); color: var(--ring); }",
       ".fa-mdh-ring b { position: relative; font-size: 16px; font-weight: 600; line-height: 1; color: var(--ring); }", 'text')
    rp(".fa-mdh-ring:hover { background: color-mix(in srgb, var(--ring) 12%, transparent); }",
       ".fa-mdh-ring:hover { background: color-mix(in srgb, var(--ring) 12%, transparent); }\n.fa-mdh-ring.clr:hover { background: color-mix(in srgb, var(--ring) 28%, var(--severity-clear-lightest)); }", 'hover')
    return t
t = dev_alert_rings2_patch(t)

def pol_finds_fit_patch(t):
    """the Findings card hugs its content (owner, 27 Oct 2026: "the last extra space is removed and align all cards"): it
    kept the 3fr column the four tiles needed, so half of it was empty. It takes max-content now and the rule-base card
    takes the rest; the two still share one height, and below 1366px they stack as before."""
    a = "obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }\n.fa-pol-fcard {"
    assert t.count(a) == 1, 'pol_finds_fit'
    return t.replace(a, "obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }\n"
                        "@media (min-width: 1367px) { .fa-pol-kpis:has(> .fa-pol-fcard) { grid-template-columns: minmax(0, 1fr) max-content; } }\n.fa-pol-fcard {")
t = pol_finds_fit_patch(t)

def dev_head_btn_patch(t):
    """the header's Refresh / Full screen are the product's filled icon squares (owner, 27 Oct 2026): obs-button
    neutral-lightest — a --code-tag-background-color fill AND border, no outline. Two DS faults worked around through that
    variant's own token (it inherits into the shadow root): in LIGHT the fill is the same #ecf1f9 as the header surface,
    so the buttons vanished — they take the page surface there; and the bundle has no :hover for the variant at all, so
    hover steps one ramp shade (--neutral-lighter). DS gap logged."""
    a = ".fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }"
    assert t.count(a) == 1, 'dev_head_btn'
    return t.replace(a, a + """
html:not([data-theme="dark-theme"]) .fa-dev-head obs-button[variant="neutral-lightest"] { --code-tag-background-color: var(--page-background-color); }
.fa-dev-head obs-button[variant="neutral-lightest"]:hover { --code-tag-background-color: var(--neutral-lighter); }""")
t = dev_head_btn_patch(t)

def analytics_add_patch(t):
    """Policies Analytics gets an "Add Policy" button (owner, 27 Oct 2026) — the very control Policies Management carries
    (pmBar: obs-button#pmAdd data-add="policy", one delegated click -> openPmAdd), so it opens the same Add Policy drawer,
    on this firewall, raising the same pending request."""
    a = "  mountStdGrid('polGrid', { columns: PL_COLS, table: 'tblRules', search: 'Search', fields: POL_FIELDS });"
    assert t.count(a) == 1, 'analytics_add'
    return t.replace(a, "  mountStdGrid('polGrid', { columns: PL_COLS, table: 'tblRules', search: 'Search', fields: POL_FIELDS,\n    after: dev1 && dev1.tab === 'analytics' ? pmBar(null) : '' });")
t = analytics_add_patch(t)

def inv_device_link_patch(t):
    """Firewall Inventory's Device name opens THAT firewall's own page (owner, 27 Oct 2026: "when I click the device,
    redirect to the device explorer screen"). In the module it is openDevice(id); inside Settings (embed=settings) the
    frame cannot draw the module, so it asks the host to open Explorer › Firewall Analyzer on device/<id>/overview."""
    a = """        onCell: (dd, r) => {
          if (dd.key === 'cred') {"""
    assert t.count(a) == 1, 'inv_device_link'
    return t.replace(a, """        onCell: (dd, r) => {
          if (dd.key === 'name') {
            if (document.documentElement.classList.contains('fasettings') && parent !== window) parent.postMessage({ faOpenDevice: r.id }, '*');
            else openDevice(r.id);
            return;
          }
          if (dd.key === 'cred') {""")
t = inv_device_link_patch(t)

def inv_device_click_patch(t):
    """the Device-name link, bound to what obs-table REALLY emits (27 Oct 2026). The Device column is a severity primary
    cell, and a click on it fires `rowclick` — never `cellaction` — so inv_device_link_patch's onCell branch never ran (a
    hand-dispatched cellaction is what made it look working). rowclick carries only the row id and fires for the whole
    row, so the id is kept and the navigation happens on the click that follows it — only when that click landed in the
    Device cell (td.first-data), so a click on the IP or Vendor does not leave the page."""
    a = "  const ti = view.querySelector('#tblFwInventory');\n"
    assert t.count(a) == 1, 'inv_device_click'
    return t.replace(a, a + """  if (ti && !ti.__devLink) {
    ti.__devLink = 1; let rowId = null;
    ti.addEventListener('rowclick', e => { rowId = rowIdOf(detailOf(e)); });
    ti.addEventListener('click', e => {
      const td = e.composedPath().find(n => n && n.tagName === 'TD'), id = rowId; rowId = null;
      if (!id || !td || !td.classList.contains('first-data')) return;
      /* Settings only: inside the module the row already opens its own inventory details page */
      if (document.documentElement.classList.contains('fasettings') && parent !== window) parent.postMessage({ faOpenDevice: id }, '*');
    });
  }
""")
t = inv_device_click_patch(t)

def obj_section2_patch(t):
    """Add / Edit Object in two titled sections (owner, 27 Oct 2026): GENERAL holds Object Name · Description · Device
    Name; OBJECT CATEGORY holds the Network | Service switch and, under it, Type and every field that depends on it.
    The section was titled with the chosen category ("Network Object"); it is "Object Category" now and the help line
    under it still follows the choice. The switch drops its own "Object Category" label — the heading says it."""
    def rp(a, b, what, n=1):
        nonlocal t
        assert t.count(a) == n, 'obj_section2 ' + what + ' ' + str(t.count(a))
        t = t.replace(a, b)
    rp("const pmoSecHead = f => (PMO_CATS[f.cat] ? pmSecHead(PMO_CATS[f.cat].label, PMO_CATS[f.cat].help) : '');",
       "const pmoSecHead = f => pmSecHead('Object Category', PMO_CATS[f.cat] ? PMO_CATS[f.cat].help : 'Pick what kind of object this is.');\n"
       "const pmoGenHead = () => pmSecHead('Object details', 'Name the object and choose the firewall it is created on.');", 'heads')
    rp("""  ? `<div class="fa-pmo-segf">${field('Object Category', `<obs-radio as-button disabled class="fa-pmo-seg" value="${f.cat}" options='${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}'></obs-radio>`)}</div>`""",
       """  ? `<div class="fa-pmo-segf"><obs-radio as-button disabled class="fa-pmo-seg" aria-label="Object Category" value="${f.cat}" options='${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}'></obs-radio></div>`""", 'seg ro')
    rp("""  : `<div class="fa-pmo-segf">${field('Object Category', `<obs-radio as-button id="pmoCat" class="fa-pmo-seg" options='${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}'></obs-radio>`)}</div>`;""",
       """  : `<div class="fa-pmo-segf"><obs-radio as-button id="pmoCat" class="fa-pmo-seg" aria-label="Object Category" options='${j(Object.keys(PMO_CATS).map(k => ({ value: k, label: PMO_CATS[k].label })))}'></obs-radio></div>`;""", 'seg')
    # the network and service bodies (the first two of three; the third is the fallback body for other kinds)
    a = """  return `<div class="fa-pmf-form"><div class="fa-grid cols-2">
      ${f.edit ? field('Object Name',"""
    assert t.count(a) == 3, 'obj_section2 gen head'
    t = t.replace(a, """  return `<div class="fa-pmf-form">${pmoGenHead()}<div class="fa-grid cols-2">
      ${f.edit ? field('Object Name',""", 2)
    rp("""    </div><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}
      ${pmoCatField(ns, f)}
    </div>
    ${pmoSecHead(f)}
    <div class="fa-grid cols-2">""", """    </div><div class="fa-grid cols-2 fa-pmo-devrow">${pmoDevField(ns, f)}<div aria-hidden="true"></div>
    </div>
    ${pmoSecHead(f)}
    ${pmoCatField(ns, f)}
    <div class="fa-grid cols-2">""", 'cat move', 2)
    rp("#pmAddDrawer .fa-pmf-form > .fa-svc-rows { margin-top: 0; }",
       "#pmAddDrawer .fa-pmf-form > .fa-svc-rows { margin-top: 0; }\n"
       "/* a form that OPENS on a section heading: no rule above it — the drawer's header already draws one */\n"
       "#pmAddDrawer .fa-pmf-form > .fa-pmsh:first-child { margin-top: 0; padding-top: 0; border-top: 0; }", 'css')
    return t
t = obj_section2_patch(t)

def pol_kpi_opt1_patch(t):
    """Policies Analytics keeps Option 1 only (owner, 27 Oct 2026: "option 2, 3, 4 remove"): the Option 1-4 switch is no
    longer rendered, and POL_KPI_OPT — which only that switch ever changed — stays '1'. The other three branches are
    kept and unreachable, the house pattern, so a design is one value away."""
    a = "  return sw + body;"
    assert t.count(a) == 1, 'pol_kpi_opt1'
    return t.replace(a, "  return body;   /* the Option 1-4 switch (sw) is not rendered: Option 1 only (27 Oct 2026) */")
t = pol_kpi_opt1_patch(t)

def pol_id_tag_patch(t):
    """Policies Analytics' Policy ID as a tag (owner, 27 Oct 2026 — a "dc1" code chip as the reference, fill #2B394F):
    obs-table's own tags cell carrying the DS `main-tags` tag (its teal ink, --main-tags-text-color), with that tag's
    fill pointed at --tag-bg-color for this table — #2b394f dark / #e3e8f2 light, the DS tag surface. The value is
    the same number; sorting still reads it as a number."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'pol_id ' + what
        t = t.replace(a, b)
    rp("""    { key: 'seq', title: 'Policy ID', align: 'right', width: 110, fixed: true, sortVal: r => r.seq, cell: r => String(r.seq), render: r => esc(r.seq) },""",
       """    { key: 'seq', title: 'Policy ID', width: 110, fixed: true, ds: { type: 'tags' }, sortVal: r => r.seq, cell: r => chip(String(r.seq), 'main-tags'), render: r => esc(r.seq) },""", 'col')
    rp("obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }",
       "obs-stat-card.fa-pol-stats { display: block; min-width: 0; height: 100%; }\n#tblRules { --main-tags-bg-color: var(--tag-bg-color); --main-tags-text-color: var(--neutral-light); }   /* Policy ID ink: --neutral-light, the grid's secondary text (27 Oct 2026) */", 'css')
    return t
t = pol_id_tag_patch(t)

def if_faceplate_patch(t):
    """the Interfaces tab opens on the device's FRONT PANEL (owner, 27 Oct 2026 — the product's own rack-unit faceplate as
    the reference): a rack unit with an ear at each end, one socket per PHYSICAL port in ifIndex order with its link
    light over it (green up, red down), and the device's name in a plate at the right. Tunnels and loopbacks have no
    socket, so they are not on it. Each socket names its port, alias and state on hover. Colours are DS tokens:
    the unit --pan-btn-border, the plate --page-background-color, the lights --severity-clear / --severity-critical."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'faceplate ' + what
        t = t.replace(a, b)
    rp("""    <obs-widget-card static class="fa-wc fa-wc-flush" title="Interface Overview">
      ${stdGridHost('ifoGrid')}""", """    ${(() => { const ph = rows.filter(r => /ethernet/i.test(r.ifType)).sort((a, b) => a.ifIndex - b.ifIndex);
      return ph.length ? `<section class="fa-fp" aria-label="${esc(section)} front panel">
        <i class="fa-fp-ear" aria-hidden="true"></i>
        <div class="fa-fp-ports">${ph.map(r => { const up = r.oper === 'up', lbl = `${r.raw}${r.alias ? ' · ' + r.alias : ''} · ${up ? 'Up' : 'Down'}`;
          return `<span class="fa-fp-port${up ? '' : ' dn'}" role="img" aria-label="${esc(lbl)}" data-tip="${esc(lbl)}"><i class="fa-fp-led"></i><span class="fa-fp-jack"><i></i></span></span>`; }).join('')}</div>
        <span class="fa-fp-name">${esc(section)}</span>
        <i class="fa-fp-ear" aria-hidden="true"></i>
      </section>` : ''; })()}
    <obs-widget-card static class="fa-wc fa-wc-flush" title="Interface Overview">
      ${stdGridHost('ifoGrid')}""", 'markup')
    rp(".fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }", """.fa-mdh-lead { display: inline-flex; align-items: center; gap: 8px; }
.fa-fp { display: flex; align-items: center; gap: 16px; min-height: 108px; padding: 12px 10px; border-radius: 8px; background: var(--pan-btn-border); }
.fa-fp-ear { flex: 0 0 auto; align-self: stretch; width: 8px; display: flex; flex-direction: column; justify-content: space-between; }
.fa-fp-ear::before, .fa-fp-ear::after { content: ""; width: 8px; height: 18px; border-radius: 4px; background: var(--page-text-color); opacity: .9; }
.fa-fp-ports { flex: 1 1 auto; display: flex; flex-wrap: wrap; gap: 8px; padding-left: 8px; }
.fa-fp-port { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; cursor: default; }
.fa-fp-led { width: 10px; height: 4px; border-radius: 1px; background: var(--severity-clear); }
.fa-fp-port.dn .fa-fp-led { background: var(--severity-critical); }
.fa-fp-jack { position: relative; width: 22px; height: 18px; border-radius: 2px; background: var(--neutral-light); box-shadow: inset 0 0 0 2px var(--neutral-lighter); }
.fa-fp-jack i { position: absolute; left: 5px; right: 5px; bottom: 3px; height: 6px; border-radius: 1px;
  background: repeating-linear-gradient(90deg, var(--severity-warning) 0 1px, transparent 1px 3px); }
.fa-fp-jack::after { content: ""; position: absolute; left: 8px; right: 8px; top: 2px; height: 3px; background: var(--neutral-lighter); }
.fa-fp-name { flex: 0 0 auto; max-width: 180px; padding: 14px 16px; border-radius: 8px; background: var(--page-background-color);
  color: var(--page-text-color); font-size: 13px; font-weight: 600; text-align: center; word-break: break-word; }""", 'css')
    return t
t = if_faceplate_patch(t)

def if_faceplate_ds_patch(t):
    """the front panel on the ObserveOps DS (owner, 27 Oct 2026). The catalogue has NO faceplate / port-panel element
    (search_components: none; it is a declared visualization gap), so it is composed from DS parts: an obs-widget-card
    "Front Panel" — the same frame as Interface Overview under it — the DS `port` icon for each socket, an obs-severity
    dot for each link light, an obs-tooltip per port, and the device name as an obs-tag. Only the rack unit itself (a
    token-filled band with an ear at each end) is hand-built. The hand-drawn CSS jacks are gone."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'faceplate_ds ' + what
        t = t.replace(a, b)
    rp("""      return ph.length ? `<section class="fa-fp" aria-label="${esc(section)} front panel">
        <i class="fa-fp-ear" aria-hidden="true"></i>
        <div class="fa-fp-ports">${ph.map(r => { const up = r.oper === 'up', lbl = `${r.raw}${r.alias ? ' · ' + r.alias : ''} · ${up ? 'Up' : 'Down'}`;
          return `<span class="fa-fp-port${up ? '' : ' dn'}" role="img" aria-label="${esc(lbl)}" data-tip="${esc(lbl)}"><i class="fa-fp-led"></i><span class="fa-fp-jack"><i></i></span></span>`; }).join('')}</div>
        <span class="fa-fp-name">${esc(section)}</span>
        <i class="fa-fp-ear" aria-hidden="true"></i>
      </section>` : ''; })()}""",
       """      const upN = ph.filter(r => r.oper === 'up').length;
      return ph.length ? `<obs-widget-card static class="fa-wc" title="Front Panel">
        <div class="fa-fp" role="group" aria-label="${esc(section)} front panel: ${upN} of ${ph.length} ports up">
          <i class="fa-fp-ear" aria-hidden="true"></i>
          <div class="fa-fp-ports">${ph.map(r => { const up = r.oper === 'up';
            return `<obs-tooltip placement="top"><span slot="trigger" class="fa-fp-port" aria-label="${esc(r.raw)} ${up ? 'up' : 'down'}">
                <obs-severity severity="${up ? 'up' : 'down'}" shape="dot"></obs-severity><obs-icon name="port" size="24"></obs-icon>
                <span class="fa-fp-pn">${esc(r.raw)}</span></span>${esc(r.raw)}${r.alias ? ' · ' + esc(r.alias) : ''} · ${up ? 'Up' : 'Down'}</obs-tooltip>`; }).join('')}</div>
          <div class="fa-fp-id"><obs-tag variant="tag-primary">${esc(section)}</obs-tag><span>${upN} of ${ph.length} ports up</span></div>
          <i class="fa-fp-ear" aria-hidden="true"></i>
        </div>
      </obs-widget-card>` : ''; })()}""", 'markup')
    a = t.index(".fa-fp { display: flex;"); b = t.index("word-break: break-word; }", a) + len("word-break: break-word; }")
    t = t[:a] + """.fa-fp { display: flex; align-items: stretch; gap: 16px; padding: 12px; border-radius: var(--btn-radius, 4px); background: var(--neutral-lighter); }
.fa-fp-ear { flex: 0 0 auto; width: 6px; display: flex; flex-direction: column; justify-content: space-between; }
.fa-fp-ear::before, .fa-fp-ear::after { content: ""; width: 6px; height: 16px; border-radius: 3px; background: var(--neutral-light); }
.fa-fp-ports { flex: 1 1 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.fa-fp-port { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; color: var(--page-text-color); cursor: default; }
.fa-fp-pn { font-size: 11px; line-height: 14px; color: var(--neutral-light); }
.fa-fp-id { flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 6px; font-size: 12px; color: var(--neutral-light); }""" + t[b:]
    return t
t = if_faceplate_ds_patch(t)

def if_faceplate_off_patch(t):
    """the front panel is REMOVED from the Interfaces tab (owner, 27 Oct 2026); Interface Overview leads the tab again.
    The builder stays in place behind FA_FACEPLATE, so turning it back on is one value."""
    a = "    ${(() => { const ph = rows.filter(r => /ethernet/i.test(r.ifType)).sort((a, b) => a.ifIndex - b.ifIndex);"
    assert t.count(a) == 1, 'faceplate_off'
    return t.replace(a, "    ${!FA_FACEPLATE ? '' : (() => { const ph = rows.filter(r => /ethernet/i.test(r.ifType)).sort((a, b) => a.ifIndex - b.ifIndex);").replace(
        "function screenInterfaces(section) {", "const FA_FACEPLATE = false;   /* the Interfaces tab's front panel — removed on request (27 Oct 2026) */\nfunction screenInterfaces(section) {", 1)
t = if_faceplate_off_patch(t)

def if_faceplate_product_patch(t):
    """the front panel BACK, rebuilt to the product's own switch-port view (owner, 27 Oct 2026, the live markup supplied):
    a 110px .switch-port-view-container with a bolt in each corner, the ports in the left 90% (each a 29x29 box: a status
    LED over the product's port glyph — its own 512-grid paths, painted with DS tokens because its three literal fills
    are off-palette), and the monitor-info plate on the right: the device name over its vendor. A port's popover sits to
    its right, as live. LED per state: up --severity-clear, down --severity-critical, otherwise --severity-unreachable."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'faceplate_product ' + what
        t = t.replace(a, b)
    rp("const FA_FACEPLATE = false;   /* the Interfaces tab's front panel — removed on request (27 Oct 2026) */",
       "const FA_FACEPLATE = true;    /* the Interfaces tab's front panel — the product's switch-port view (27 Oct 2026) */\n"
       "const FA_PORT_SVG = '<svg viewBox=\"0 0 512 512\" class=\"fa-sp-glyph\" aria-hidden=\"true\"><path class=\"b\" d=\"M506,491.29H6V20.71H506Z\"></path>'\n"
       "  + '<path class=\"o\" d=\"M57.69,426.43H454.24V191.14h-69v-56.8H299.07V85.66H212.86v48.68h-86.2v56.8h-69Z\"></path>'\n"
       "  + '<path class=\"p\" d=\"M135.25,426.35h34.49V329H135.25Zm68.93,0h34.49V329H204.18ZM342.12,329v97.36h34.49V329Zm-68.93,97.36h34.49V329H273.19Z\"></path></svg>';", 'flag')
    a = t.index("      const upN = ph.filter(r => r.oper === 'up').length;\n      return ph.length ? `<obs-widget-card static class=\"fa-wc\" title=\"Front Panel\">")
    b = t.index("      </obs-widget-card>` : ''; })()}", a) + len("      </obs-widget-card>` : ''; })()}")
    t = t[:a] + """      const dv = D.devices.find(x => x.name === section), vendor = dv ? fwVendorName(dv) : '';
      const st = r => (r.oper === 'up' ? 'up' : r.oper === 'down' ? 'down' : 'unreachable');
      return ph.length ? `<section class="fa-sp" aria-label="${esc(section)} front panel">
        <i class="fa-sp-bolt tl"></i><i class="fa-sp-bolt tr"></i><i class="fa-sp-bolt bl"></i><i class="fa-sp-bolt br"></i>
        <div class="fa-sp-ports">${ph.map(r => `<obs-tooltip placement="right"><span slot="trigger" class="fa-sp-port" tabindex="0" aria-label="${esc(r.raw)} ${st(r)}">
            <i class="fa-sp-led ${st(r)}"></i>${FA_PORT_SVG}</span>${esc(r.raw)}${r.alias ? ' · ' + esc(r.alias) : ''} · ${st(r) === 'up' ? 'Up' : st(r) === 'down' ? 'Down' : 'Unreachable'}</obs-tooltip>`).join('')}</div>
        <div class="fa-sp-info"><h5 title="${esc(section)}">${esc(section)}</h5>${vendor ? `<h5 class="v" title="Vendor">${esc(vendor)}</h5>` : ''}</div>
      </section>` : ''; })()}""" + t[b:]
    a = t.index(".fa-fp { display: flex;")
    end = ".fa-fp-id { flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 6px; font-size: 12px; color: var(--neutral-light); }"
    b = t.index(end, a) + len(end)
    t = t[:a] + """.fa-sp { position: relative; display: flex; align-items: stretch; height: 110px; padding: 10px 28px; border-radius: 6px; box-sizing: border-box;
  background: var(--pan-btn-border); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .1), 0 4px 6px -2px rgba(0, 0, 0, .05); --fa-sp-plate: var(--neutral-lighter); }
html:not([data-theme="dark-theme"]) .fa-sp { --fa-sp-plate: var(--page-background-color); }
.fa-sp-bolt { position: absolute; width: 8px; height: 18px; border-radius: 4px; background: var(--page-background-color); }
html[data-theme="dark-theme"] .fa-sp-bolt { background: var(--primary); }
.fa-sp-bolt.tl { top: 10px; left: 10px; } .fa-sp-bolt.tr { top: 10px; right: 10px; }
.fa-sp-bolt.bl { bottom: 10px; left: 10px; } .fa-sp-bolt.br { bottom: 10px; right: 10px; }
.fa-sp-ports { width: 90%; display: flex; flex-wrap: wrap; align-items: center; height: 100%; }
.fa-sp-port { display: inline-flex; flex-direction: column; align-items: center; width: 29px; height: 29px; padding: 0 4px; margin-bottom: 8px; cursor: auto; }
.fa-sp-led { width: 10px; height: 3px; margin-bottom: 4px; border-radius: 1px; background: var(--severity-unreachable); }
.fa-sp-led.up { background: var(--severity-clear); } .fa-sp-led.down { background: var(--severity-critical); }
.fa-sp-glyph { width: 24px; height: 22px; flex: 0 0 auto; }
.fa-sp-glyph .b { fill: var(--neutral-light); } .fa-sp-glyph .o { fill: var(--neutral-lighter); } .fa-sp-glyph .p { fill: var(--severity-warning); }
.fa-sp-info { flex: 1 1 auto; min-width: 0; overflow: hidden; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; padding: 0 12px; background: var(--fa-sp-plate); }
.fa-sp-info h5 { margin: 0; max-width: 100%; font-size: 13px; font-weight: 600; line-height: 18px; color: var(--primary); text-align: center; overflow-wrap: anywhere; }
.fa-sp-info h5.v { font-weight: 400; font-size: 12px; color: var(--neutral-light); }""" + t[b:]
    return t
t = if_faceplate_product_patch(t)

def pm_hide_cols_patch(t):
    """Policies Management's Policies grid opens with Source Interface, Destination Interface and Last update Policy
    Time HIDDEN (owner, 27 Oct 2026: "hide, don't remove — show option in column hide"). They stay columns: the grid's
    eye chooser lists them unticked and ticking one brings it back; Reset Column Preference shows every column.
    It is the grid's own saved state seeded, not a removal, so the column filters and exports still know them."""
    a = "const gridState = {};"
    assert t.count(a) == 1, 'pm_hide'
    i = t.index(a); j = t.index('\n', i)
    return t[:j] + "\ngridState.pmRulesGrid = { hidden: ['srcIntf', 'dstIntf', 'updated'] };   /* hidden by default, shown from the eye chooser (27 Oct 2026) */\ngridState.pmNatGrid = { hidden: ['srcIntf', 'dstIntf', 'mSvc', 'type'] };   /* NAT: hidden by default, shown from the eye chooser (27 Oct 2026) */" + t[j:]
t = pm_hide_cols_patch(t)

def pend_link_patch(t):
    """the Pending Approval card reads as a LINK on hover (owner, 27 Oct 2026): its title underlines and an external-link
    glyph (Tabler `external-link`, MIT, from free-icons) appears after it. The title is inside obs-stat-card's shadow
    root, so the rule rides the page's attachShadow hook, scoped by a host class only that card carries."""
    def rp(a, b, what):
        nonlocal t
        assert t.count(a) == 1, 'pend_link ' + what + ' ' + str(t.count(a))
        t = t.replace(a, b)
    rp("""    const card = `<obs-stat-card class="fa-pm-stats"${pw ?""", """    const card = `<obs-stat-card class="fa-pm-stats${last ? ' fa-pm-golink' : ''}"${pw ?""", 'class')
    svg = ("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 "
           "stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6%22/%3E"
           "%3Cpath d=%22M11 13l9 -9%22/%3E%3Cpath d=%22M15 4h5v5%22/%3E%3C/svg%3E")
    css = (':host(.fa-pm-golink) .k{overflow:visible}:host(.fa-pm-golink:hover) .k{text-decoration:underline;text-underline-offset:3px}'
           ':host(.fa-pm-golink) .k::after{content:"";flex:0 0 14px;width:14px;height:14px;margin-left:6px;background:currentColor;opacity:0;'
           '-webkit-mask:url("' + svg + '") center/contain no-repeat;mask:url("' + svg + '") center/contain no-repeat}'
           ':host(.fa-pm-golink:hover) .k::after{opacity:1}')
    a = "if(this.tagName==='OBS-STAT-CARD'){try{var sc=new CSSStyleSheet();sc.replaceSync('"
    rp(a, a + css, 'hook')
    return t
t = pend_link_patch(t)

def inv_link_icon_patch(t):
    """Firewall Inventory's Device name reads as a LINK on hover, the same as the Pending Approval card (owner, 27 Oct
    2026): a solid underline and the Tabler `external-link` glyph after the name. Rides the obs-table shadow sheet that
    already underlines it; the glyph is a currentColor mask so it follows the theme."""
    svg = ("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 "
           "stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6%22/%3E"
           "%3Cpath d=%22M11 13l9 -9%22/%3E%3Cpath d=%22M15 4h5v5%22/%3E%3C/svg%3E")
    a = ':host(#tblFwInventory) .primary-text:hover{text-decoration:underline}'
    assert t.count(a) == 1, 'inv_link_icon ' + str(t.count(a))
    css = (':host(#tblFwInventory) .primary-text:hover{text-decoration:underline solid;text-underline-offset:3px}'
           ':host(#tblFwInventory) .primary-text::after{content:"";display:inline-block;vertical-align:-2px;width:14px;height:14px;margin-left:6px;'
           'background:currentColor;opacity:0;-webkit-mask:url("' + svg + '") center/contain no-repeat;mask:url("' + svg + '") center/contain no-repeat}'
           ':host(#tblFwInventory) .primary-text:hover::after{opacity:1}')
    return t.replace(a, css)
t = inv_link_icon_patch(t)

def inv_device_tab_patch(t):
    """Settings › Firewall Inventory: the Device name opens the firewall's page in a NEW TAB (owner, 27 Oct 2026). It was
    a postMessage asking setting.html to navigate in place. The tab is Option 1 (index.html, the page that carries the
    module), arriving on #m=Firewall Analyzer&sub=fa:device/<id>/overview — setting-nav.js sets MOD_SUB from `sub` and
    faInit reads the `fa:` route. Opened from the frame itself, so the click's user activation is the frame's own."""
    for v in ('r.id', 'id'):
        a = "parent.postMessage({ faOpenDevice: " + v + " }, '*')"
        assert t.count(a) == 1, 'inv_device_tab ' + v + ' ' + str(t.count(a))
        t = t.replace(a, "window.open('../index.html#m=' + encodeURIComponent('Firewall Analyzer') + '&sub=' + encodeURIComponent('fa:device/' + " + v + " + '/overview'), '_blank', 'noopener')")
    return t
t = inv_device_tab_patch(t)

def inv_name_nodrawer_patch(t):
    """Settings › Firewall Inventory: a click on the Device NAME opens the new tab and nothing else (owner, 27 Oct 2026:
    the Device Info drawer was opening behind it). That drawer comes from the name-click listener (__fid, 19 Oct 2026),
    so inside Settings it stands down — inv_device_tab_patch's tab is the name's job there. In the module it still opens."""
    a = """        if (!path.some(n => n.classList && n.classList.contains('primary-text'))) return;
        const name ="""
    assert t.count(a) == 1, 'inv_name_nodrawer ' + str(t.count(a))
    return t.replace(a, """        if (!path.some(n => n.classList && n.classList.contains('primary-text'))) return;
        if (document.documentElement.classList.contains('fasettings') && parent !== window) return;   /* Settings: the name opens a new tab instead */
        const name =""")
t = inv_name_nodrawer_patch(t)

open(P, 'w', encoding='utf-8').write(t)
print('ds_pass: applied')
