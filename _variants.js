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
    {"file":"index.html","label":"Option 1"},
    {"file":"dashboard-grouped-sidebar.html","label":"Option 2"},
    {"file":"dashboard-picker-advanced.html","label":"Option 3"},
    {"file":"dashboard-labelled-rail.html","label":"Option 4"},
    {"file":"dashboard-nav-column.html","label":"Option 5"},
    {"file":"dashboard-card-sidebar.html","label":"Option 6"},
    {"file":"dashboard-single-column.html","label":"Option 7"},
    {"file":"dashboard-nav-column-alt.html","label":"Option 8"},
    {"file":"dashboard-card-sidebar-alt.html","label":"Option 9"},
    {"file":"dashboard-rail-flyout.html","label":"Option 10"},
    {"file":"dashboard-rail-flyout-alt.html","label":"Option 11"}
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

  /* ── which key addresses which option ───────────────────────────────────────
     1–9 for the first nine, then **0 for the TENTH** (request, 9 Sep 2026). 0 is
     where the digit row ends, and it is what every browser already uses for "the
     last one" — a two-key chord like "10" is not a shortcut, it is a sequence, and
     nothing here could tell "1" from the start of "10" without a timer.
     ⚠️ AN ELEVENTH VARIANT GETS NO KEY. That is the same rule one step further on,
     not an oversight: the digit row is used up. `vsKey` returning '' is what both
     the keycap and the footer already test, so an 11th page needs no code change.
     ⚠️ ONE PAIR OF FUNCTIONS, THREE CALLERS — the keycap on the row, the footer's
     hint and the keydown handler. They disagreed the moment they were three
     separate expressions, which is how the tenth row shipped with no key at all. */
  /* ⚠️ THE DIGIT ROW RAN OUT AT OPTION 10, so Option 11 takes a LETTER — `X`, by request
     (10 Sep 2026). `vsKey` and `vsIdx` are exact inverses and must be edited together; a key
     shown on a row that does not switch, or a key that switches with no keycap on the row, is
     worse than no shortcut.
     ⚠️ `X` WAS CHECKED FREE IN EVERY OPTION FIRST. Each page's own single-key registry (`KB`) is
     n w g e d o t f / s a — letters only, and none of them is x — so nothing was displaced.
     Grep before binding another one; this handler runs on ALL eleven pages, so a letter has to
     be free in every one of them, not just in the page it points at.
     ⚠️ BOTH CASES MATCH. `e.key` is 'x' bare and 'X' with Shift, and unlike a digit — where
     Shift produces '!' and can never match — a letter with Shift is still that letter. Refusing
     the shifted form would make the shortcut fail for anyone with caps lock on.
     ⚠️ A TWELFTH OPTION NEEDS A DELIBERATE CHOICE, not the next letter along: it has to be free
     in every page's `KB` and not be a browser or OS binding. `vsKey` returning '' is still what
     makes an unbound row render with no keycap and no footer entry. */
  var VS_LETTERS = ['x'];                       /* index 10 onward, in order */
  function vsKey(i) {
    if (i < 9) return String(i + 1);
    if (i === 9) return '0';
    var L = VS_LETTERS[i - 10];
    return L ? L.toUpperCase() : '';
  }
  function vsIdx(k) {
    if (k === '0') return 9;
    if (k >= '1' && k <= '9') return +k - 1;
    var i = VS_LETTERS.indexOf(String(k).toLowerCase());
    return i < 0 ? -1 : i + 10;
  }

  var items = VARIANTS.map(function (v, i) {
    var on = v.file === here;
    var kbd = vsKey(i) ? '<span class="vs-kbd">' + vsKey(i) + '</span>' : '';
    return '<a class="vs-item' + (on ? ' on' : '') + '" href="' + encodeURI(v.file) + '">' +
           '<span class="vs-tick">✓</span><span>' + v.label + '</span>' + kbd + '</a>';
  }).join('');

  var current = VARIANTS.filter(function (v) { return v.file === here; })[0];
  root.innerHTML =
    '<div class="vs-btn"><span class="vs-dot"></span>' +
    '<span>' + (current ? current.label : 'Variants') + '</span>' +
    '<span class="vs-car">▲</span></div>' +
    '<div class="vs-menu"><div class="vs-head">Visualization variants</div>' + items +
    '<div class="vs-foot">Press ' + VARIANTS.map(function (v, i) { return vsKey(i); }).filter(Boolean).join(' · ') +
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
    /* ⚠️ MODIFIERS ARE STILL LEFT ALONE, and 0 makes that matter more, not less:
       ⌘0 / Ctrl+0 is the browser's "reset zoom" and Alt+0 belongs to the OS. */
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var idx = vsIdx(e.key);
    if (idx < 0) return;
    if (vsTyping()) return;
    var v = VARIANTS[idx];
    if (!v || v.file === here) return;        /* already here — do nothing */
    e.preventDefault();
    location.href = encodeURI(v.file);
  });

  document.body.appendChild(root);
})();
