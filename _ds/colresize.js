/* ════════════════════════════════════════════════════════════════════════════════════════════
   ADJUSTABLE COLUMN WIDTHS — every table in the project (request, 5 Nov 2026: "in table the column
   width is adjustable — apply in overall all modules in my project").

   One shared script, loaded by every page with one tag after the DS bundle:
     <script src="_ds/colresize.js"></script>         (pages in a sub-folder: ../_ds/colresize.js)

   What it does: every header cell of every table gets a grip on its right edge — drag to size the
   column, double-click to give it back its default. It covers
     · obs-table (inside its shadow root — the DS table 0.1.166 has no column resizing: DS gap 45)
     · hand-built grids (<table> with a <thead>), e.g. .stcgrid
   Opt out with class="nocolrz" (or data-nocolrz) on the table, the obs-table host, or any ancestor.

   ⚠️ HOW A DRAG WORKS: on the first drag every other header is frozen at its CURRENT width, the
   table goes table-layout:fixed, and the LAST data column stays flexible — so only the column you
   drag moves, and the last one absorbs the slack. A total wider than the table sets min-width,
   so the grid scrolls sideways instead of squeezing.
   ⚠️ A FROZEN HEADER IS box-sizing:border-box, so the width set IS the box measured. Subtracting
   padding instead drifted: a header's padding can differ between measuring and painting (IPAM's
   came out 16-32px narrow), and the first build, setting content-box widths, painted 238px headers at 266px.
   ⚠️ position:relative is set on a header only if it is `static` — a sticky header is already a
   containing block, and forcing relative would un-stick it.
   ⚠️ WIDTHS SURVIVE RE-RENDERS: they are kept per table SIGNATURE (host id / class + header labels)
   and re-applied whenever the table repaints (a MutationObserver per root, debounced).
   ⚠️ NO COLOUR LITERALS: the grip line is a DS token with currentColor as the fallback, so pages on
   the older navy palette still get a visible line.
   ════════════════════════════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__dsColRz) return; window.__dsColRz = true;
  const CSS = '.dscrz{position:absolute;top:0;right:-4px;width:9px;height:100%;cursor:col-resize;z-index:3;touch-action:none}' +
    '.dscrz::after{content:"";position:absolute;left:4px;top:30%;bottom:30%;width:1px;background:var(--field-border-color,currentColor);opacity:0;transition:opacity .12s}' +
    'thead:hover .dscrz::after{opacity:.6}.dscrz:hover::after,.dscrz.on::after{opacity:1;width:2px;left:3.5px;top:0;bottom:0;background:var(--primary-alt,currentColor)}' +
    'body.dscrzing,body.dscrzing *{cursor:col-resize!important;user-select:none!important}';
  const STORE = new Map(), sheeted = new WeakSet(), watched = new WeakSet();
  const off = el => !!(el && el.closest && el.closest('.nocolrz,[data-nocolrz]'));

  function sheet(root){
    if (sheeted.has(root)) return; sheeted.add(root);
    if (root === document){ const s = document.createElement('style'); s.id = 'ds-colresize-css'; s.textContent = CSS; document.head.appendChild(s); return; }
    try { const s = new CSSStyleSheet(); s.replaceSync(CSS); root.adoptedStyleSheets = [].concat(root.adoptedStyleSheets || [], [s]); }
    catch (e){ const s = document.createElement('style'); s.textContent = CSS; root.appendChild(s); }
  }
  /* a header is a CONTROL column (checkbox, expand chevron, actions) when it carries no label */
  const label = th => (th.textContent || '').replace(/\s+/g, ' ').trim();
  function enhance(tbl, root, host){
    if (off(tbl) || off(host)) return;
    const hr = tbl.tHead && tbl.tHead.rows[0]; if (!hr) return;
    const ths = [...hr.cells].filter(c => c.tagName === 'TH'); if (ths.length < 2) return;
    if (ths.some(th => (th.colSpan || 1) > 1)) return;            /* grouped headers — skip, widths would not map */
    const data = ths.filter(th => label(th)); if (data.length < 2) return;
    const last = data[data.length - 1];
    const sig = (host ? (host.id || host.className || host.tagName) : (tbl.id || tbl.className || 'table')) + '|' + data.map(label).join('|');
    const W = STORE.get(sig) || {}; STORE.set(sig, W);
    const key = th => label(th) || ('#' + ths.indexOf(th));
    /* a table with a <colgroup> of one <col> per header takes its widths from the cols (fixed layout reads them first),
       so the width goes on the col and the col of the flexible column is cleared */
    const cg = [...tbl.querySelectorAll(':scope > colgroup > col')], useCol = cg.length === ths.length;
    const colOf = th => useCol ? cg[ths.indexOf(th)] : null;
    const set = (th, w) => { const c = colOf(th); if (c){ c.style.width = w + 'px'; c.removeAttribute('width'); } else { th.style.boxSizing = 'border-box'; th.style.width = w + 'px'; } };   /* border-box: the width IS the measured box, whatever padding the header has */
    const lastMin = () => Math.max(120, parseFloat(getComputedStyle(last).minWidth) || 0);
    const fit = () => { let sum = 0; ths.forEach(th => { if (th !== last) sum += W[key(th)] || th.getBoundingClientRect().width; });
      if (Object.keys(W).length){ tbl.style.tableLayout = 'fixed'; tbl.style.minWidth = (sum + lastMin()) + 'px'; } else { tbl.style.minWidth = ''; } };
    /* re-apply stored widths to a freshly rendered header */
    if (Object.keys(W).length){ ths.forEach(th => { if (th !== last && W[key(th)]) set(th, W[key(th)]); }); fit(); }
    data.forEach(th => {
      if (th === last || th.querySelector(':scope > .dscrz')) return;
      if (getComputedStyle(th).position === 'static') th.style.position = 'relative';
      const g = document.createElement('span'); g.className = 'dscrz'; g.setAttribute('aria-hidden', 'true'); g.title = 'Drag to resize · double-click to reset';
      ['click', 'mousedown'].forEach(t => g.addEventListener(t, e => e.stopPropagation()));
      g.addEventListener('dblclick', e => { e.stopPropagation(); delete W[key(th)]; const c = colOf(th); if (c) c.style.width = ''; th.style.width = ''; fit(); });
      g.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation(); try { g.setPointerCapture(e.pointerId); } catch (_){}
        g.classList.add('on'); document.body.classList.add('dscrzing');
        /* measure EVERY header first, then freeze — freezing one moves the others, so measure-then-set in one loop drifts */
        const fr = ths.filter(h => h !== last); fr.forEach(h => { const k = key(h); if (!W[k]) W[k] = Math.round(h.getBoundingClientRect().width); });
        fr.forEach(h => set(h, W[key(h)]));
        last.style.width = ''; if (colOf(last)) colOf(last).style.width = 'auto'; tbl.style.tableLayout = 'fixed'; fit();
        const x0 = e.clientX, w0 = W[key(th)];
        const mv = ev => { W[key(th)] = Math.max(56, Math.round(w0 + ev.clientX - x0)); set(th, W[key(th)]); fit(); };
        const up = () => { g.classList.remove('on'); document.body.classList.remove('dscrzing'); g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); };
        g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
      });
      th.appendChild(g);
    });
  }
  function scanRoot(root, host){
    sheet(root);
    root.querySelectorAll('table').forEach(t => enhance(t, root, host));
  }
  let pend = null;
  function scan(){
    pend = null;
    scanRoot(document, null);
    document.querySelectorAll('obs-table').forEach(h => {
      const r = h.shadowRoot; if (!r) return;
      scanRoot(r, h);
      if (!watched.has(r)){ watched.add(r); new MutationObserver(later).observe(r, { childList: true, subtree: true }); }
    });
  }
  /* debounced: our own grip insertions are childList mutations too, and must not loop */
  function later(muts){
    if (muts && muts.every(m => [...m.addedNodes].every(n => n.classList && n.classList.contains('dscrz')))) return;
    if (!pend) pend = setTimeout(scan, 60);
  }
  window.dsColRzScan = scan;
  const start = () => { scan(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
