/* ============================================================
   Side_bar_menu — shared variant switcher
   ------------------------------------------------------------
   Connects every visualization variant in this folder.

   TO ADD A NEW VARIANT: just create the .html file in this
   folder — nothing manual. `node _sync_variants.js` scans the
   folder, adds every page to the list below, and injects this
   script into any file missing it. It runs automatically via
   the Claude Code hook (on file create/edit) and in the GitHub
   Pages deploy workflow (on push). New pages are labelled from
   their <title> tag.
   ============================================================ */
(function () {
  /* VARIANTS:BEGIN (managed by _sync_variants.js — do not edit by hand) */
  var VARIANTS = [
    {"file":"index copy.html","label":"V1 · Sidebar & Header Actions"},
    {"file":"index.html","label":"V2 · Grouped Sidebar"},
    {"file":"dashboard-picker-advanced.html","label":"V3 · Advanced Dashboard Picker"}
  ];
  /* VARIANTS:END */

  var here = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

  var css = [
    '.vs-switch{position:fixed;right:16px;bottom:16px;z-index:99999;font-family:Inter,system-ui,sans-serif;font-size:12px;}',
    '.vs-btn{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;cursor:pointer;',
    '  background:var(--pop,#1d2a3e);color:var(--text,#cad3e2);border:1px solid var(--border,#1d2a3e);',
    '  box-shadow:var(--pop-shadow,0 2px 8px rgba(0,0,0,.35));user-select:none;font-weight:600;}',
    '.vs-btn:hover{border-color:var(--teal,#14b8a6);}',
    '.vs-btn .vs-dot{width:7px;height:7px;border-radius:50%;background:var(--teal,#14b8a6);}',
    '.vs-btn .vs-car{opacity:.65;font-size:10px;transition:transform .15s;}',
    '.vs-switch.open .vs-car{transform:rotate(180deg);}',
    '.vs-menu{position:absolute;right:0;bottom:calc(100% + 8px);min-width:230px;display:none;overflow:hidden;',
    '  background:var(--pop,#1d2a3e);border:1px solid var(--border,#1d2a3e);border-radius:var(--radius,8px);',
    '  box-shadow:var(--shadow,0 12px 40px rgba(0,0,0,.55));}',
    '.vs-switch.open .vs-menu{display:block;}',
    '.vs-head{padding:8px 12px 6px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#5272a0);}',
    '.vs-item{display:flex;align-items:center;gap:8px;padding:8px 12px;color:var(--text,#cad3e2);text-decoration:none;}',
    '.vs-item:hover{background:var(--pop-item-hover,#2b394f);}',
    '.vs-item .vs-tick{width:14px;text-align:center;color:var(--teal,#14b8a6);font-weight:700;visibility:hidden;}',
    '.vs-item.on{color:var(--teal,#14b8a6);font-weight:600;}',
    '.vs-item.on .vs-tick{visibility:visible;}',
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.className = 'vs-switch';

  var items = VARIANTS.map(function (v) {
    var on = v.file === here;
    return '<a class="vs-item' + (on ? ' on' : '') + '" href="' + encodeURI(v.file) + '">' +
           '<span class="vs-tick">✓</span><span>' + v.label + '</span></a>';
  }).join('');

  var current = VARIANTS.filter(function (v) { return v.file === here; })[0];
  root.innerHTML =
    '<div class="vs-btn"><span class="vs-dot"></span>' +
    '<span>' + (current ? current.label : 'Variants') + '</span>' +
    '<span class="vs-car">▲</span></div>' +
    '<div class="vs-menu"><div class="vs-head">Visualization variants</div>' + items + '</div>';

  root.querySelector('.vs-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    root.classList.toggle('open');
  });
  document.addEventListener('click', function () { root.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') root.classList.remove('open'); });

  document.body.appendChild(root);
})();
