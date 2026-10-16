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
        """const PM_TABS = () => POL_SWITCH_MGMT.map(o => ({ key: o.value, label: o.text }));
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
    # CSS: the old rules still match the hosts by class — neutralise the box they drew; obs-progress draws its own track
    k = t.index('</style>')
    t = t[:k] + '\n' + MARK2 + """
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
.fa-pmf-form .fa-grid { column-gap: 24px; row-gap: 16px; }
.fa-pmf-form .fa-field { gap: 6px; }
.fa-pmf-form .fa-pmf-sec { margin-top: 8px; }
.fa-pmf-form .fa-dp-h3 { font-size: 16px; font-weight: 600; }
.fa-pmf-form .fa-field > obs-switch, .fa-pmf-form .fa-field > obs-checkbox { align-self: flex-start; display: inline-flex; align-items: center; min-height: var(--fa-input-height); }
.fa-req + .fa-mandatory, .fa-mandatory > .fa-req { margin: 0 2px 0 0; }
#pmfFoot, #pmoFoot { border-top: 0; }
#pmfFoot .fa-mandatory, #pmoFoot .fa-mandatory { font-size: 13px; color: var(--page-text-color); }
""" + t[k:]
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
