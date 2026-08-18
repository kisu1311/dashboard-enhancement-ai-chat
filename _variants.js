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
    {"file":"index copy.html","label":"Option 1"},
    {"file":"index.html","label":"Option 2"},
    {"file":"dashboard-picker-advanced.html","label":"Option 3"}
  ];
  /* VARIANTS:END */

  var here = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

  var css = [
    /* Lifted clear of the floating "＋ Add widget" button it used to crowd in the
       bottom-right corner. Bottom-LEFT is not free either — that is the dashboard
       panel footer and, when the rail is expanded, the user row. Dimmed until hover
       so a dev-only control never competes with the product UI. */
    /* BOTTOM CENTRE (annotation, 15 Aug 2026). It used to sit bottom-right at bottom:126px,
       stacked above the "＋ Add widget" FAB — but the AI panel is docked on that same right
       edge, so the pill landed on top of the chat's own composer and follow-up chips.
       Centre is the one strip of the viewport no docked chrome owns: the canvas is behind it,
       the rail is left, the panel is right, the FAB is bottom-right.
       ⚠️ translateX(-50%) on the switch means the MENU can no longer anchor to right:0 —
       it centres too (see .vs-menu). */
    '.vs-switch{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:99999;font-family:Inter,system-ui,sans-serif;font-size:12px;opacity:.55;transition:opacity .15s;}',
    '.vs-switch:hover,.vs-switch.open{opacity:1;}',
    '.vs-btn{display:flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;cursor:pointer;',
    '  background:var(--pop,#1d2a3e);color:var(--text,#cad3e2);border:1px solid var(--border,#1d2a3e);',
    '  box-shadow:var(--pop-shadow,0 2px 8px rgba(0,0,0,.35));user-select:none;font-weight:600;}',
    '.vs-btn:hover{border-color:var(--teal,#14b8a6);}',
    '.vs-btn .vs-dot{width:7px;height:7px;border-radius:50%;background:var(--teal,#14b8a6);}',
    '.vs-btn .vs-car{opacity:.65;font-size:10px;transition:transform .15s;}',
    '.vs-switch.open .vs-car{transform:rotate(180deg);}',
    /* centred over the pill, since the pill itself is now centred */
    '.vs-menu{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(100% + 8px);min-width:230px;display:none;overflow:hidden;',
    '  background:var(--pop,#1d2a3e);border:1px solid var(--border,#1d2a3e);border-radius:var(--radius,8px);',
    '  box-shadow:var(--shadow,0 12px 40px rgba(0,0,0,.55));}',
    '.vs-switch.open .vs-menu{display:block;}',
    '.vs-head{padding:8px 12px 6px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#5272a0);}',
    '.vs-item{display:flex;align-items:center;gap:8px;padding:8px 12px;color:var(--text,#cad3e2);text-decoration:none;}',
    '.vs-item:hover{background:var(--pop-item-hover,#2b394f);}',
    '.vs-item .vs-tick{width:14px;text-align:center;color:var(--teal,#14b8a6);font-weight:700;visibility:hidden;}',
    '.vs-item.on{color:var(--teal,#14b8a6);font-weight:600;}',
    '.vs-item.on .vs-tick{visibility:visible;}',
    /* the 1 / 2 / 3 shortcut, shown on each row so it is discoverable */
    '.vs-item .vs-kbd{margin-left:auto;min-width:16px;text-align:center;padding:1px 5px;border-radius:4px;',
    '  border:1px solid var(--border,#2b394f);color:var(--muted,#5272a0);font-size:10px;font-weight:600;line-height:1.5;}',
    '.vs-item.on .vs-kbd{border-color:var(--teal,#14b8a6);color:var(--teal,#14b8a6);}',
    '.vs-foot{padding:7px 12px 8px;border-top:1px solid var(--pop-line,var(--border,#2b394f));',
    '  font-size:10px;color:var(--muted,#5272a0);}',
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.className = 'vs-switch';

  var items = VARIANTS.map(function (v, i) {
    var on = v.file === here;
    /* only the first nine get a digit — that is all the keyboard can address */
    var kbd = i < 9 ? '<span class="vs-kbd">' + (i + 1) + '</span>' : '';
    return '<a class="vs-item' + (on ? ' on' : '') + '" href="' + encodeURI(v.file) + '">' +
           '<span class="vs-tick">✓</span><span>' + v.label + '</span>' + kbd + '</a>';
  }).join('');

  var current = VARIANTS.filter(function (v) { return v.file === here; })[0];
  root.innerHTML =
    '<div class="vs-btn"><span class="vs-dot"></span>' +
    '<span>' + (current ? current.label : 'Variants') + '</span>' +
    '<span class="vs-car">▲</span></div>' +
    '<div class="vs-menu"><div class="vs-head">Visualization variants</div>' + items +
    '<div class="vs-foot">Press ' + VARIANTS.slice(0, 9).map(function (v, i) { return i + 1; }).join(' · ') +
    ' to switch</div></div>';

  root.querySelector('.vs-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    root.classList.toggle('open');
  });
  document.addEventListener('click', function () { root.classList.remove('open'); });

  /* ── 1 / 2 / 3 switch option ──────────────────────────────────────────────
     Bare digit, no modifier: ⌘1 / Ctrl+1 are the browser's own tab switching and
     Alt+1 belongs to the OS, so those are left alone. Shift is not tested because
     on QWERTY it produces "!" and never matches anyway, which keeps AZERTY working.

     Suppressed while typing — these pages are full of text fields the digits would
     otherwise be stolen from: the AI chat composer, its history search and rename
     inputs, the dashboard search, the Create Dashboard form, the query editor.
     The keys are free in all three pages (Option 1's single-key registry is letters
     only: N W G E D O T F / S A), so nothing was displaced. */
  function vsTyping() {
    var a = document.activeElement;
    if (!a) return false;
    if (a.isContentEditable) return true;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { root.classList.remove('open'); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key < '1' || e.key > '9') return;
    if (vsTyping()) return;
    var v = VARIANTS[+e.key - 1];
    if (!v || v.file === here) return;        /* already here — do nothing */
    e.preventDefault();
    location.href = encodeURI(v.file);
  });

  document.body.appendChild(root);
})();
