/* ══════════════════════════════════════════════════════════════════════════════════════════
   setting.js — THE SETTINGS MODULE, WHOLE: its stylesheet, its markup and its behaviour
   ──────────────────────────────────────────────────────────────────────────────────────────
   Built 12 Sep 2026 (request: "create new file the name is 'setting' and all setting related
   all will be in this file"). It replaces the pair `_settings-module.css` + `_settings-module.js`,
   which were themselves lifted out of `index.html` on 1 Sep 2026 and adopted by every other
   option on 12 Sep. Both of those files are DELETED — this is the only copy. Every one of the
   thirteen option pages loads it with a single tag.

   What is in it, in order:

     · PART 1 — the stylesheet: the `st*` block (My Account › My Profile), the `stc*` block
                (Compliance Settings) and the `ag*` block (Agentic AI + the Product License
                page, on the real ObserveOps design system, with its scoped DS token block).
     · PART 2 — the `<section id="view-settings">` markup, injected at parse time, and the
                three script blocks: `st*`, `stc*`, `ag*`/`lic*`.

   ── HOW TO LOAD IT ────────────────────────────────────────────────────────────────────────
   ONE tag, placed immediately after the design-system bundle:

       <script src="_ds/observeops-elements.umd.js"></script>
       <script src="setting.js"></script>

   ⚠️ A PLAIN, PARSER-BLOCKING `<script src>` — no `defer`, no `async`, NOT `type=module`.
   All three blocks were classic inline scripts and their top-level `const` / `let` / `function`
   declarations land in the same global scope from a classic external script, which is the only
   reason each host page's `stInit()`, `stOpen()`, `ST_TREE` and `ST_ICO` references resolve.
   A module script would put every one of them in module scope and the rail's Settings entry
   would throw on the first click.
   ⚠️ IT MUST LOAD **AFTER** `_ds/observeops-elements.umd.js`. The `ag*` screen is built out of
   real `obs-*` custom elements.
   ⚠️ THERE IS NO LONGER A `<link>` TO REMEMBER. The stylesheet is injected by PART 1 below —
   see the note there for why appending it to `<head>` keeps the same cascade the `<link>` had.

   ── ⚠️ THE ONE RULE FOR EDITING PART 1 ────────────────────────────────────────────────────
   THE CSS LIVES IN A TEMPLATE LITERAL, SO EVERY BACKTICK IN IT IS WRITTEN `\``.
   This stylesheet's comments are its documentation and they are full of `--primary`-style code
   names — 866 backticks at the time of the merge. A JS template literal ends at the first
   unescaped one, so a comment typed naturally here is a syntax error hundreds of lines from
   where it looks like the problem is. That hazard is exactly why a previous session kept the
   CSS in its own `.css` file (see CLAUDE.md, "Why the CSS is a `.css` file and not a string
   inside the `.js`"); the request for one file overrules that, and this note is the mitigation.
   Nothing else needed escaping — the stylesheet contains no backslashes and no `${`, both
   asserted by the builder — so the escaped text round-trips to the original byte for byte.
   ⚠️ `node --check setting.js` after touching PART 1. It names the line in one second; a
   screenshot does not.
   ══════════════════════════════════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════════════════════════════
   PART 1 of 2 — THE STYLESHEET
   ──────────────────────────────────────────────────────────────────────────────────────────
   ⚠️ INJECTED INTO `<head>`, WHICH IS WHAT KEEPS THE CASCADE IT HAD AS A `<link>`. Each page
   is one flat stylesheet where source order decides every tie at equal specificity, and the
   `<link>` this replaces sat immediately after the page's inline `</style>`. Appending a
   `<style>` to `<head>` puts it in the same place in document order — after the inline block —
   so a rule here still wins the ties it used to win. Injecting it into `<body>` instead would
   also work today, but only by accident of the body coming later; `<head>` is the honest home.
   ⚠️ IT RUNS AT PARSE TIME OF THIS FILE, not on `load`. There is no flash to worry about
   either way: `#view-settings` is a `.view` section and is hidden until something opens it.
   ⚠️ `textContent`, never `innerHTML` — a stylesheet is text, and `innerHTML` would try to
   parse it as markup.
   ══════════════════════════════════════════════════════════════════════════════════════════ */

var SETTINGS_CSS = `/* ══════════════════════════════════════════════════════════════════════════════════════════
   PART 1's original header — it was \`_settings-module.css\`, the Settings module's stylesheet,
   from 1 Sep to 12 Sep 2026. Kept verbatim below; only its address changed.
   ──────────────────────────────────────────────────────────────────────────────────────────
   Lifted OUT of \`index copy.html\` on 1 Sep 2026, byte for byte. It is the \`st*\` block
   (Settings › My Account › My Profile), the \`stc*\` block (Compliance Settings) and the \`ag*\`
   block (Agentic AI, on the real ObserveOps design system) — three regions that were 1,369
   lines of that file's single 8,296-line \`<style>\`.

   ⚠️ LOADED BY A \`<link>\` PLACED IMMEDIATELY AFTER THAT \`<style>\`, and it has to stay there.
   These files are one flat stylesheet where source order decides every tie at equal
   specificity; putting the link before the inline block would hand every shared-specificity
   contest to rules that used to lose them.
   ⚠️ ONE CASCADE CHANGE WAS ACCEPTED, KNOWINGLY. The \`st*\`/\`stc*\` half used to sit BEFORE the
   "ObserveOps DESIGN SYSTEM LAYER" block (the Dashboard-layout drawer) and now sits after it.
   Checked before moving: that block is scoped entirely to \`#drawer-layout\` (id specificity)
   and this file's only non-\`.st*\`/\`.stc*\` selector is \`#view-settings\`, so the two cannot
   collide.
   ⚠️ SUPERSEDED 12 Sep 2026 — THIS *IS* A STRING INSIDE THE JS NOW, and the hazard it warns
   about is real, so read it as the live caveat rather than as history. It argued: the comments
   below contain backticks (\`--primary\`, \`ST_TREE\`, … 866 of them by the time of the merge, up
   from the 218 counted here). In a JS template literal every one needs escaping, and the next
   person to add a comment gets a syntax error from a character they had no reason to think was
   special. The comments in this repo are the documentation — they stay verbatim, so they are
   escaped rather than rewritten. **Every backtick in PART 1 is written \\\` .** Run
   \`node --check setting.js\` after editing here; it names the line in one second.
   ══════════════════════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════════
   SETTINGS MODULE  —  My Account › My Profile, cloned from the live product,
   build 8.2.7, 19 Aug 2026, read in the browser at /settings/my-account/my-profile
   (DOM, computed styles, the Vue component's own template + validation rules).
   Namespace is \`st\` everywhere — \`.st*\` classes, \`st*()\` functions, \`ST_*\`
   constants — these files are one flat stylesheet and one flat script and a
   duplicate name silently wins. Borrows only toast() / showView() /
   selectModuleByName() from the host. Same block in all three options.
   ═══════════════════════════════════════════════════════════════════════════ */
#view-settings{overflow:hidden}
/* ⚠️ THE SETTINGS MODULE'S ACCENT IS #CAD3E2, NOT THE HOST TEAL (request, 15 Sep 2026: "in the setting module replace
   #14b8a6 with #CAD3E2"). Every page declares \`--teal:#14b8a6\` on :root, so the module re-points the token ONCE, on
   each root it renders into — the view, and the four things it appends to <body> (the stc popover, drawer and confirm,
   and the Agentic AI config drawer) — rather than rewriting each rule. ⚠️ TWO VALUES, ONE PER THEME: #cad3e2 on white
   is 1.4:1 and would vanish, so light takes #1d2a3e — the same pair the DS calls \`--primary-alt\` and the host calls
   \`--action\`. \`--st-on-accent\` is the ink ON that fill (a tick, a primary label), which inverts with it; the old
   #04211d was right only on teal. The rail, the dashboard and Log Explorer keep their teal. */
#view-settings,.stcmenu,#stcDr,#stcCf,#drawer-agcfg{--teal:#cad3e2;--teal-dim:#cad3e2;--st-accent-h:#e3e8f2;--st-on-accent:#0b1627}
html[data-theme="light"] #view-settings,html[data-theme="light"] .stcmenu,html[data-theme="light"] #stcDr,html[data-theme="light"] #stcCf,html[data-theme="light"] #drawer-agcfg{--teal:#1d2a3e;--teal-dim:#1d2a3e;--st-accent-h:#111c2c;--st-on-accent:#fff}
.stwrap{flex:1;display:flex;min-height:0}
/* the head's chevron collapses the left list, as live (the panel goes to 0 and the
   content takes the full width) — same control the Log Explorer head has */
.stpt{width:24px;height:24px;border:0;background:transparent;color:var(--text-dim);
      border-radius:4px;cursor:pointer;display:grid;place-items:center;flex:0 0 24px}
/* ⚠️ \`[hidden]\` LOSES TO ANY AUTHOR \`display\` RULE, AND THAT MADE \`stHeadPaint\` A NO-OP.
   \`.stpt{display:grid}\` is (0,1,0) and beats the UA stylesheet's \`[hidden]{display:none}\`, so
   \`i.hidden = true\` set the attribute and hid nothing — the head's (i) kept its full 34px box
   and stayed clickable on every settings page that has no help pane. Found 2 Sep 2026 by
   hit-testing the pixel: a probe asserting \`el.hidden\` PASSED on a button that was plainly
   still on screen, because the property was true and the paint was unchanged. Assert what is
   painted, not what the property says. */
.stpt[hidden]{display:none}
.stpt:hover{background:var(--hover);color:var(--text)}
.stpt svg{width:14px;height:14px;fill:currentColor}
.stsep{width:1px;height:18px;background:var(--border);flex:0 0 1px;margin:0 2px}
/* ── left list: search + the 18 collapsible categories (246px incl. 8px pad, as live) ── */
/* ⚠️ A DIVIDER BETWEEN THE LIST AND THE CONTENT (request, 31 Aug 2026: "add line to show
   difference"). The category list and the page sat edge to edge on the same white surface with
   nothing between them, so the list's right edge was only implied by where its rows stopped —
   and its scrollbar then read as the boundary. The product draws this rule: the DS describes
   \`side-menu\` as "flush white + right border", and the Create SLO Profile screen has the same
   line between its rail and its form.
   ⚠️ IT STAYS WHEN THE LIST COLLAPSES (since 3 Sep 2026) — the collapsed state is a column
   too, see below — so the rule still has an edge to sit on. */
.stnav{width:246px;flex:0 0 246px;display:flex;flex-direction:column;min-height:0;
       padding:8px 0 0 8px;overflow:hidden;border-right:1px solid var(--border);
       transition:width .18s,flex-basis .18s,padding .18s}
/* ══ COLLAPSED IS AN ICON RAIL, NOT NOTHING ═══════════════════════════════════════════════
   Request, 3 Sep 2026: "when I collapse the setting sub module it doesn't hide fully — show
   the sidebar by default icon". It used to go to 0px, which is what the live splitpane does —
   but live has no glyph per category to fall back on, and this list does: the product's own
   19 icons (\`ST_ICO\`), which are exactly what makes a 52px column readable with no words.
   ⚠️ 52px / 32px TILE / 20px GLYPH ARE THE RAIL NUMBERS THIS FOLDER SETTLED ON TODAY — Option
   5's rail and the drawer's own »/« — so the collapsed list is the same object as the rails it
   sits beside rather than a third size. The tile is \`.stch\` itself: it was already the click
   target and already \`display:flex\`, so it only loses its padding and its words.
   ⚠️ A TILE NAVIGATES, IT DOES NOT FOLD. Expanded, a category header toggles its pages open;
   collapsed there are no pages to show, so the same row goes to the category's first page
   (\`stCatTap\`). One element, two states, the behaviour that makes sense in each.
   ⚠️ THE TOOLTIP COMES FREE. Every header carries \`data-tip\` = its own name, and the host's
   tooltip engine suppresses a tip whose text is readable on the element (\`tipSeenText\` skips
   \`display:none\` nodes) — so it is silent while the label shows and speaks once it is hidden.
   ⚠️ THE CURRENT CATEGORY IS LIT (\`.stcat.cur\`) only here: expanded, the lit PAGE (\`.stsi.on\`)
   already says where you are, and lighting its parent too would say it twice. The class is
   emitted in both states and styled in one.
   ⚠️ \`#view-settings.stshut .stsub\` OUTRANKS \`.stcat.open .stsub\` on the id, which is what keeps
   an open category's pages from spilling out of a 52px column. */
#view-settings.stshut .stnav{width:52px;flex-basis:52px;padding:8px 0 0}
#view-settings.stshut .stsearch,#view-settings.stshut .stch .nm,#view-settings.stshut .stch .beta,
#view-settings.stshut .stch .car,#view-settings.stshut .stsub,#view-settings.stshut .stempty{display:none}
#view-settings.stshut .stlist{min-width:0;padding:0 0 12px;scrollbar-width:none}
#view-settings.stshut .stlist::-webkit-scrollbar{display:none}
#view-settings.stshut .stcat{border-bottom:0}
#view-settings.stshut .stch{width:32px;height:32px;min-height:0;margin:0 auto 6px;padding:0;
  justify-content:center;border-radius:4px;color:var(--text-dim)}
#view-settings.stshut .stch .ic{width:20px;height:20px;margin:0;flex:0 0 20px}
#view-settings.stshut .stch:hover{background:var(--hover);color:var(--text)}
#view-settings.stshut .stcat.cur .stch{background:var(--chip);color:var(--white)}
/* a full-page screen (Create Benchmark, Create Rule, a benchmark's view) replaces the list AND
   the content, as live — the head becomes “‹ <title>” and the left list is gone */
#view-settings.stfullpg .stnav{display:none}
#view-settings.stfullpg #stHeadIc,#view-settings.stfullpg #stHeadSep{display:none}
.stpt.stinfo{width:34px;height:34px;border:1px solid var(--border);border-radius:4px;flex:0 0 34px}
.stpt.stinfo svg{width:18px;height:18px}
.stsearch{position:relative;height:36px;flex:0 0 36px;margin:0 8px 8px 0}
.stsearch svg{position:absolute;left:12px;top:9px;width:18px;height:18px;fill:currentColor;color:var(--text);pointer-events:none}
.stsearch input{width:100%;height:36px;padding:0 10px 0 40px;border:1px solid var(--border);border-radius:4px;
                background:var(--bg);color:var(--text);font:inherit;font-size:12.8px;outline:none}
.stsearch input:focus{border-color:var(--text-dim)}
.stsearch input::placeholder{color:var(--text-dim)}
.stlist{flex:1;overflow:auto;padding:0 12px 12px 0;min-width:230px}
.stcat{border-bottom:1px solid var(--border)}
.stch{display:flex;align-items:center;min-height:42px;padding:8px 18px 8px 0;cursor:pointer;
      color:var(--text);font-size:12.8px;position:relative;user-select:none;line-height:1.35}
.stch:hover{color:var(--white)}
.stch .ic{width:21px;height:21px;margin-right:5px;flex:0 0 21px;fill:currentColor}
.stch .nm{flex:1;min-width:0}
.stch .beta{flex:0 0 auto;margin:0 8px;padding:2px 5px;border-radius:4px;background:var(--blue);color:#fff;
            font-size:10px;font-weight:500;line-height:1.2;letter-spacing:.02em}
.stch .car{position:absolute;right:0;top:50%;width:13px;height:13px;fill:currentColor;color:var(--text-dim);
           transform:translateY(-50%);transition:transform .15s}
.stcat.open .stch .car{transform:translateY(-50%) rotate(90deg)}
.stsub{display:none;padding:0 0 3px 25px}
.stcat.open .stsub{display:block}
.stsi{display:block;height:30px;line-height:30px;padding:0 10px;margin-bottom:1px;border-radius:4px;
      color:var(--text-dim);font-size:12.8px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stsi:hover{color:var(--text);background:var(--hover)}
.stsi.on{background:var(--chip);color:var(--white);font-weight:500}
.stempty{padding:18px 4px;color:var(--text-dim);font-size:12px}
/* ── content ── */
.stmain{flex:1;min-width:0;min-height:0;overflow:auto;padding:16px 16px 20px;display:flex;flex-direction:column}
/* ── My Profile form: avatar column + a 710px label/field column, as measured ── */
.stprof{display:flex;align-items:flex-start;flex:0 0 auto}
.stav{flex:0 0 166px;width:166px;padding:0 16px;display:flex;flex-direction:column;align-items:center}
.stavc{position:relative;width:120px;height:120px;border-radius:50%;background:var(--chip);color:var(--white);
       display:grid;place-items:center;font-size:35.2px;font-weight:600;overflow:hidden;line-height:1}
.stavc img{width:100%;height:100%;object-fit:cover;display:block}
.stavl{margin:8px 0;display:flex;align-items:center;justify-content:center;font-size:12.8px;white-space:nowrap}
.stavl a{color:var(--white);text-decoration:underline dotted;cursor:pointer;margin:0 8px}
.stavl a.rm{color:var(--red)}
.stavl .sep{color:var(--text-dim);margin:0 4px}
.stform{flex:0 1 710px;max-width:710px;padding:0 16px;min-width:0}
.stfi{display:flex;align-items:flex-start;margin-bottom:12px;min-height:40px}
.stfl{flex:0 0 166px;padding-top:10px;font-size:12.8px;color:var(--text-dim);line-height:19px}
.stfl.req::after{content:"*";color:var(--red);margin-left:2px}
.stfc{flex:1;min-width:0;position:relative}
.stin{width:100%;height:32px;margin-top:4px;padding:4px 11px 4px 0;border:0;border-bottom:1px solid var(--pop-line);
      border-radius:0;background:transparent;color:var(--text);font:inherit;font-size:12.8px;outline:none}
.stin::placeholder{color:var(--text);opacity:.5}
/* live: a disabled field looks exactly like an enabled one (User Name) — reproduced */
.stin[disabled]{cursor:auto;color:var(--text);opacity:1;-webkit-text-fill-color:var(--text)}
.stfi.err .stfl{color:var(--red)}
.stfi.err .stin{border-bottom-color:var(--red)}
.stex{font-size:12px;line-height:18px;color:var(--red);margin-top:4px;min-height:0}
.stex:empty{display:none}
.stpw .stin{padding-right:30px}
.steye{position:absolute;right:12px;top:11px;width:18px;height:18px;cursor:pointer;color:var(--text-dim);fill:currentColor}
.steye:hover{color:var(--text)}
/* the Change Password switch — 22px pill, label inside, knob grey OFF / green ON, as live */
.stsw{position:relative;display:inline-flex;align-items:center;height:22px;min-width:44px;margin-top:9px;padding:0;
      border:0;border-radius:100px;background:var(--chip);color:var(--text-dim);font:inherit;font-size:10px;
      line-height:22px;cursor:pointer;user-select:none;vertical-align:middle}
.stsw .lb{margin:0 6px 0 24px}
.stsw.on .lb{margin:0 24px 0 6px}
.stsw::after{content:"";position:absolute;top:2.5px;left:2.5px;width:17px;height:17px;border-radius:50%;
             background:var(--text-dim);transition:left .15s,background .15s}
.stsw.on::after{left:calc(100% - 19.5px);background:var(--green)}
.stact{display:flex;justify-content:flex-end;gap:8px;margin:16px 0 20px;padding-right:16px;flex:0 0 auto}
.stbtn{height:34px;padding:0 15px;border-radius:4px;border:1px solid var(--border);background:var(--card);color:var(--text);
       font:inherit;font-size:12.8px;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
.stbtn:hover{border-color:var(--text-dim)}
.stbtn.pri{background:var(--teal);border-color:var(--teal);color:var(--st-on-accent);font-weight:600}
.stbtn.pri:hover{background:var(--st-accent-h);border-color:var(--st-accent-h)}
.stbtn[disabled]{opacity:.65;cursor:default}
.stspin{width:13px;height:13px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;
        animation:stspin .7s linear infinite}
@keyframes stspin{to{transform:rotate(360deg)}}
@media (max-width:1366px){ .stav{flex-basis:150px;width:150px;padding:0 8px} .stform{padding:0 8px} }
/* ═══════════════════════════════════════════════════════════════════════════════
   COMPLIANCE SETTINGS  —  Compliance Policy · Benchmark · Rules, cloned from the
   live product, build 8.2.7, 20 Aug 2026, read in the browser at
   /settings/compliance-settings/{audit-policy,benchmark,rules} and their create /
   view screens. Namespace \`stc\` — registered into the st* Settings module through
   ST_PAGES (see the st* script). Same block in all three options.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ── list toolbar: search · (eye · PDF · CSV · filter) · Create ──────────────── */
.stcbar{display:flex;align-items:center;gap:8px;margin:0 0 8px;flex:0 0 auto}
.stcsearch{position:relative;width:335px;height:36px;flex:0 0 335px}
.stcsearch svg{position:absolute;left:12px;top:9px;width:18px;height:18px;fill:currentColor;color:var(--text);pointer-events:none}
.stcsearch input{width:100%;height:36px;padding:0 30px 0 40px;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--text);font:inherit;font-size:12.8px;outline:none}
.stcsearch input:focus{border-color:var(--text-dim)}
.stcsearch input::placeholder{color:var(--text-dim)}
.stcsearch .clr{position:absolute;right:9px;top:10px;width:16px;height:16px;color:var(--text-dim);cursor:pointer;display:none}
.stcsearch .clr svg{position:static;width:16px;height:16px;fill:currentColor;color:inherit}
.stcsearch .clr:hover{color:var(--text)}
.stcsearch.has .clr{display:block}
.stcsp{flex:1}
.stcsq{width:35px;height:35px;flex:0 0 35px;border:1px solid var(--chip);border-radius:4px;background:var(--chip);color:var(--text);
       display:grid;place-items:center;cursor:pointer;padding:0}
.stcsq svg{width:18px;height:18px;fill:currentColor}
.stcsq:hover{border-color:var(--text-dim)}
.stcsq.on{background:var(--white);border-color:var(--white);color:var(--bg)}
/* ── filter chips row (Benchmark · Tags · ＋ Filter) ─────────────────────────── */
.stcchips{display:flex;align-items:center;gap:8px;margin:0 0 8px;flex:0 0 auto;flex-wrap:wrap}
.stcchips.hid{display:none}
.stcchip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:4px;background:var(--chip);color:var(--text);
         font-size:12.8px;cursor:pointer;gap:4px;user-select:none}
.stcchip .f{color:var(--text-dim)}
.stcchip .op{color:var(--teal);font-family:"JetBrains Mono",monospace;font-size:12px}
.stcchip .v{color:var(--white);font-weight:500;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stcchip .x{margin-left:4px;width:14px;height:14px;fill:currentColor;color:var(--text-dim)}
.stcchip .x:hover{color:var(--red)}
.stcchip:hover{background:var(--hover-side)}
.stcaddf{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px;border:1px solid var(--chip);border-radius:4px;background:var(--chip);
         color:var(--text);font:inherit;font-size:12.8px;cursor:pointer}
.stcaddf svg{width:15px;height:15px;fill:currentColor;color:var(--white)}
.stcaddf:hover{border-color:var(--text-dim)}
/* ── the grid: uppercase 28px header, 40px rows, name bold, tags mono-teal ────── */
.stcgridw{flex:1;min-height:0;display:flex;flex-direction:column}
.stcscroll{flex:1;min-height:0;overflow:auto}
.stcgrid{width:100%;border-collapse:collapse;table-layout:fixed}
.stcgrid th{height:28px;padding:4px 8px;text-align:left;font-size:12.8px;font-weight:600;letter-spacing:.25px;text-transform:uppercase;
            color:var(--text);border-bottom:1px solid var(--border);white-space:nowrap;position:sticky;top:0;background:var(--bg);z-index:1;user-select:none}
.stcgrid th.s{cursor:pointer}
.stcgrid th.s:hover{color:var(--white)}
.stcgrid th .sa{font-size:11px;margin-left:3px;color:var(--text-dim)}
.stcgrid th.r,.stcgrid td.r{text-align:right}
.stcgrid th.c,.stcgrid td.c{text-align:center}
.stcgrid td{height:40px;padding:4px 8px;font-size:12px;color:var(--text);border-bottom:1px solid var(--border-soft);vertical-align:middle;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:17px}
.stcgrid tr:hover td{background:var(--hover)}
.stcgrid td.nm{font-weight:500;color:var(--white)}
.stcgrid td.nm .lk{cursor:pointer}
.stcgrid td.nm .lk:hover{text-decoration:underline}
.stcgrid td.nm .lock{width:14px;height:14px;fill:currentColor;color:var(--text-dim);display:inline-block;vertical-align:-2px;margin-right:6px}
.stcgrid td.dim{color:var(--text-dim)}
.stcgrid td.wrap{white-space:normal}
.stcused{display:inline-block;min-width:22px;height:22px;line-height:22px;padding:0 7px;border-radius:4px;background:var(--chip);color:var(--white);
         font-size:12px;font-weight:500;text-align:center}
.stctag{display:inline-block;height:22px;line-height:22px;padding:0 7px;border-radius:4px;background:color-mix(in srgb, var(--teal) 16%, transparent);color:var(--teal);
        font:12px/22px "JetBrains Mono",monospace;margin-right:6px;max-width:220px;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}
.stctag.more{cursor:default}
.stcempty{padding:40px 0;text-align:center;color:var(--text-dim);font-size:12.5px}
/* the actions cell: run-now (when the policy has devices) and the ⋮, right-aligned */
.stcact{display:flex;align-items:center;justify-content:flex-end;gap:2px}
.stcib{width:28px;height:28px;border:0;background:transparent;color:var(--text-dim);border-radius:4px;display:grid;place-items:center;cursor:pointer;padding:0}
.stcib svg{width:16px;height:16px;fill:currentColor}
.stcib:hover{color:var(--text);background:var(--hover-side)}
.stcib.spin svg{animation:stcspin 1s linear infinite;color:var(--yellow)}
@keyframes stcspin{to{transform:rotate(360deg)}}
/* row actions are hover-revealed on live (opacity), the ⋮ stays */
.stcgrid tr .stcrun{opacity:0;transition:opacity .12s}
.stcgrid tr:hover .stcrun,.stcgrid tr .stcrun.spin{opacity:1}
/* severity bar on a rule (the product's severity-indicator) */
.stcsev{display:inline-block;width:3px;height:18px;border-radius:2px;margin-right:9px;vertical-align:-4px;background:var(--text-dim)}
.stcsev.CRITICAL{background:var(--red)} .stcsev.HIGH{background:var(--orange)} .stcsev.MEDIUM{background:var(--yellow)} .stcsev.LOW{background:var(--blue)} .stcsev.INFO{background:var(--text-dim)}
/* ── pager: ⏮ ◀ 1 ▶ ⏭ · [50 ▾] items per page … 1 - 12 of 12 items ─────────── */
.stcpager{display:flex;align-items:center;gap:4px;height:45px;flex:0 0 45px;padding:8px 0;border-top:1px solid var(--border);font-size:12.8px;color:var(--text)}
.stcpg{width:28px;height:28px;border:0;background:transparent;color:var(--text);border-radius:4px;display:grid;place-items:center;cursor:pointer;font-size:12.8px;padding:0}
.stcpg svg{width:14px;height:14px;fill:currentColor}
.stcpg:hover{background:var(--hover-side)}
.stcpg.on{background:var(--chip);color:var(--white)}
.stcpg[disabled]{opacity:.35;cursor:default;background:transparent}
.stcsize{display:inline-flex;align-items:center;gap:14px;height:28px;padding:0 8px 0 12px;margin:0 8px 0 12px;border:1px solid var(--border);border-radius:4px;
         background:var(--bg);cursor:pointer;color:var(--white);font-size:12.8px}
.stcsize svg{width:11px;height:11px;fill:currentColor;color:var(--text-dim)}
.stcpinfo{margin-left:auto;color:var(--text)}
/* ── popover menu (row ⋮, column chooser, pickers) ────────────────────────────── */
.stcmenu{position:fixed;z-index:100005;min-width:190px;max-width:420px;background:var(--pop);border:1px solid var(--pop-line);border-radius:4px;
         box-shadow:var(--pop-shadow);padding:4px 0;font-size:12.8px;color:var(--text)}
.stcmi{display:flex;align-items:center;gap:8px;height:32px;padding:0 21px 0 14px;cursor:pointer;white-space:nowrap}
.stcmi svg{width:14px;height:14px;fill:currentColor;color:var(--text-dim);flex:0 0 14px}
.stcmi:hover{background:var(--pop-item-hover);color:var(--white)}
.stcmi.del:hover{color:var(--red)}
.stcmi.on{color:var(--white);font-weight:500}
.stcmi.ck{padding-left:12px}
.stcmi .bx{width:14px;height:14px;border:1px solid var(--text-dim);border-radius:4px;flex:0 0 14px;display:grid;place-items:center}
.stcmi.on .bx{background:var(--teal);border-color:var(--teal)}
.stcmi .bx svg{width:10px;height:10px;color:var(--st-on-accent)}
.stcmi.sep{height:1px;padding:0;margin:4px 0;background:var(--pop-line);cursor:default}
.stcmi.hd{height:26px;color:var(--text-dim);font-size:11px;text-transform:uppercase;letter-spacing:.04em;cursor:default}
.stcmi.hd:hover{background:transparent;color:var(--text-dim)}
.stcmenu .stcms{padding:6px 8px}
.stcmenu .stcms input{width:100%;height:30px;padding:0 8px 0 30px;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--text);font:inherit;font-size:12.5px;outline:none}
.stcmenu .stcms{position:relative}
.stcmenu .stcms svg{position:absolute;left:16px;top:13px;width:15px;height:15px;fill:currentColor;color:var(--text-dim)}
.stcmenu .stcml{max-height:300px;overflow:auto}
.stcmenu .stcmo{display:flex;gap:4px;padding:4px 8px 6px}
.stcmenu .stcmo b{font:600 12px/24px "JetBrains Mono",monospace;padding:0 10px;border-radius:4px;border:1px solid var(--border);cursor:pointer;color:var(--text-dim)}
.stcmenu .stcmo b.on{background:var(--chip);color:var(--white);border-color:var(--chip)}
.stcmenu .stcmf{display:flex;justify-content:flex-end;gap:6px;padding:6px 8px;border-top:1px solid var(--pop-line)}
/* the device picker is a grid in a popover (search + checkbox table), 855px on live */
.stcmenu.grid{width:855px;max-width:calc(100vw - 40px);padding:12px}
.stcmenu.grid .stcgrid th{position:static;background:transparent}
.stcmenu.grid .stcgrid td{height:38px}
.stcck{width:16px;height:16px;border:1px solid var(--text-dim);border-radius:4px;display:inline-grid;place-items:center;vertical-align:-3px;cursor:pointer;background:var(--bg)}
.stcck.on{background:var(--teal);border-color:var(--teal)}
.stcck svg{width:11px;height:11px;fill:currentColor;color:var(--st-on-accent);display:none}
.stcck.on svg{display:block}
.stcgtag{display:inline-block;height:20px;line-height:20px;padding:0 7px;border-radius:4px;background:var(--chip);color:var(--text);font-size:11.5px;margin-right:4px}
/* ── drawer (40% / 684px, blurred backdrop) ──────────────────────────────────── */
.stcscrim{position:fixed;inset:0;z-index:100003;background:rgba(4,10,20,.35);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:none}
.stcscrim.on{display:block}
.stcdr{position:fixed;top:0;right:0;bottom:0;width:684px;max-width:92vw;z-index:100004;background:var(--bg);border-left:1px solid var(--border);
       box-shadow:var(--shadow);display:none;flex-direction:column;transform:translateX(24px);opacity:0;transition:transform .18s,opacity .18s}
.stcdr.on{display:flex}
.stcdr.in{transform:none;opacity:1}
.stcdrh{height:62px;flex:0 0 62px;display:flex;align-items:center;padding:0 20px;border-bottom:1px solid var(--border);font-size:17px;font-weight:600;color:var(--white)}
.stcdrh .x{margin-left:auto;width:30px;height:30px;border:0;background:transparent;color:var(--text-dim);border-radius:4px;display:grid;place-items:center;cursor:pointer}
.stcdrh .x svg{width:16px;height:16px;fill:currentColor}
.stcdrh .x:hover{color:var(--text);background:var(--hover-side)}
.stcdrb{flex:1;min-height:0;overflow:auto;padding:16px 20px}
.stcdrf{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:14px 20px;border-top:1px solid var(--border)}
.stcdrf .mand{font-size:12.8px;color:var(--text);margin-right:auto}
.stcdrf .mand b{color:var(--red);font-weight:400}
/* ── form atoms: label + underline input (st's .stin), bordered select, segmented ── */
.stcrow{display:flex;gap:36px;margin-bottom:14px}
.stccol{flex:1;min-width:0}
.stclab{font-size:12.8px;color:var(--text-dim);line-height:19px;margin-bottom:4px;display:block}
.stclab.req::after{content:"*";color:var(--red);margin-left:2px}
.stcfi{margin-bottom:14px}
.stcfi.err .stclab{color:var(--red)}
.stcfi.err .stin,.stcfi.err .stcsel,.stcfi.err .stcta{border-color:var(--red)}
.stcfi .stin{margin-top:0}
.stcfi .stex{font-size:12px;color:var(--red);margin-top:4px}
.stcfi .stex:empty{display:none}
.stcsel{display:flex;align-items:center;height:36px;padding:0 10px;border:1px solid var(--border);border-radius:4px;background:transparent;color:var(--text);
        font-size:12.8px;cursor:pointer;gap:8px;user-select:none;min-width:0}
.stcsel .v{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stcsel .ph{color:var(--text-dim)}
.stcsel .car{width:14px;height:14px;fill:currentColor;color:var(--text-dim);flex:0 0 14px}
.stcsel:hover{border-color:var(--text-dim)}
.stcsel.dis{opacity:.55;cursor:not-allowed}
.stcsel.line{border-width:0 0 1px;border-radius:0;padding:0 2px;height:32px;border-color:var(--pop-line)}
.stcsel .stctag{height:20px;line-height:20px;font-size:11.5px;margin-right:4px}
.stcsel .chipx{width:18px;height:18px;border-radius:4px;background:var(--chip);color:var(--text);display:inline-grid;place-items:center;font-size:11px;margin-right:4px}
.stcseg{display:inline-flex;border:1px solid var(--border);border-radius:4px;overflow:hidden;height:36px}
.stcseg button{height:34px;padding:0 12px;border:0;border-right:1px solid var(--border);background:transparent;color:var(--text-dim);font:inherit;font-size:12.8px;cursor:pointer}
.stcseg button:last-child{border-right:0}
.stcseg button.on{background:var(--chip);color:var(--white)}
.stcseg button:hover:not(.on){color:var(--text)}
.stcseg button[disabled]{cursor:default}
.stcta{width:100%;min-height:72px;padding:10px 12px;border:1px solid var(--border);border-radius:4px;background:transparent;color:var(--text);font:inherit;font-size:12.8px;outline:none;resize:vertical}
.stcta::placeholder{color:var(--text-dim)}
.stcta:focus{border-color:var(--text-dim)}
.stcmore{font-size:12.8px;color:var(--text-dim);margin-top:6px}
.stcmore a{color:var(--white);text-decoration:underline;cursor:pointer}
.stcmore svg{width:12px;height:12px;fill:currentColor;color:var(--teal);vertical-align:-1px;margin-left:4px}
.stcnote{font-size:12.8px;color:var(--text-dim)}
/* ── confirm (delete) ─────────────────────────────────────────────────────────── */
.stccf{position:fixed;inset:0;z-index:100006;display:none;place-items:center;background:rgba(4,10,20,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}
.stccf.on{display:grid}
.stccfb{width:420px;max-width:92vw;background:var(--pop);border:1px solid var(--pop-line);border-radius:4px;box-shadow:var(--shadow);padding:20px}
.stccfb h5{margin:0 0 8px;font-size:15px;font-weight:600;color:var(--white)}
.stccfb p{margin:0 0 18px;font-size:12.8px;color:var(--text);line-height:1.55}
.stccfb .bt{display:flex;justify-content:flex-end;gap:8px}
.stbtn.danger{background:var(--red);border-color:var(--red);color:#fff;font-weight:600}
/* ── full pages: Create Benchmark · a benchmark's view · Create Rule ───────────── */
.stcfull{display:flex;flex-direction:column;flex:1;min-height:0}
.stcfh{display:flex;gap:36px;padding:0 0 6px}
.stcfh .stccol{flex:1}
.stcfoot{display:flex;justify-content:flex-end;gap:8px;margin:16px 0 20px;flex:0 0 auto}
.stcfoot .mand{margin-right:auto;font-size:12.8px;color:var(--text)}
.stcfoot .mand b{color:var(--red);font-weight:400}
/* benchmark tree — nested accordions, a group header row, rules with a severity bar */
.stcbt{margin:6px 0 0 0}
.stcbg{border:1px solid var(--border);border-radius:4px;margin-bottom:8px;position:relative}
.stcbg .stcbg{border:0;border-left:1px solid var(--border-soft);border-radius:0;margin:0 0 0 24px}
.stcbgh{display:flex;align-items:center;min-height:48px;padding:0 10px 0 30px;gap:8px;position:relative;cursor:pointer}
.stcbgh .car{position:absolute;left:10px;top:50%;width:14px;height:14px;fill:currentColor;color:var(--text-dim);transform:translateY(-50%) rotate(0deg);transition:transform .15s}
.stcbg.open > .stcbgh .car{transform:translateY(-50%) rotate(90deg)}
.stcbgh .drag{width:16px;height:16px;fill:currentColor;color:var(--text-dim);cursor:move;flex:0 0 16px}
.stcbgh .num{font-size:12.8px;color:var(--text);flex:0 0 auto}
.stcbgh .nm{font-size:12.8px;color:var(--white);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stcbgh input.nm{background:transparent;border:0;border-bottom:1px solid var(--pop-line);color:var(--text);font:inherit;font-size:12.8px;outline:none;padding:2px 0;height:26px}
.stcbgh .acts{display:flex;gap:2px;flex:0 0 auto;opacity:.85}
.stcbgh .acts .stcib.ok{color:var(--green)}
.stcbgh .acts .stcib.del:hover{color:var(--red)}
.stcbgb{display:none;padding:4px 0 6px 0}
.stcbg.open > .stcbgb{display:block}
.stcbr{display:flex;align-items:center;min-height:40px;padding:0 10px 0 30px;margin-left:24px;gap:8px;border-top:1px solid var(--border-soft);font-size:12.8px;color:var(--text)}
.stcbr .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stcbr .stcib{opacity:0}
.stcbr:hover .stcib{opacity:1}
.stcbr .stcib:hover{color:var(--red)}
.stcbradd{margin:4px 0 0 54px;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px dashed var(--border);border-radius:4px;
          color:var(--text-dim);font-size:12px;cursor:pointer;background:transparent;font-family:inherit}
.stcbradd svg{width:13px;height:13px;fill:currentColor}
.stcbradd:hover{color:var(--text);border-color:var(--text-dim)}
.stcbtn-out{height:34px;padding:0 15px;border:1px solid var(--text);border-radius:4px;background:transparent;color:var(--text);font:inherit;font-size:12.8px;cursor:pointer}
.stcbtn-out:hover{background:var(--hover)}
/* the (i) help pane on the right of a full page */
.stcinfo{display:none;width:34%;max-width:560px;flex:0 0 auto;border-left:1px solid var(--border);padding:0 0 0 20px;margin-left:20px;font-size:12.8px;color:var(--text);line-height:1.6;overflow:auto}
.stcfull.info .stcinfo{display:block}
.stcinfo h5{margin:12px 0 4px;font-size:13.5px;font-weight:600;color:var(--white)}
.stcinfo h5:first-child{margin-top:0}
.stcinfo p{margin:0 0 8px}
.stcinfo li{margin:0 0 4px 16px}
.stcinfo code{font-family:"JetBrains Mono",monospace;font-size:11.5px;background:var(--chip);padding:1px 5px;border-radius:4px}
.stcsplit{display:flex;flex:1;min-height:0}
.stcsplit > .stcfbody{flex:1;min-width:0;overflow:auto}
/* the rule wizard: a 320px steps column and the form */
.stcwz{display:flex;flex:1;min-height:0;margin:-16px -16px -20px}
.stcsteps{width:320px;flex:0 0 320px;border-right:1px solid var(--border)}
.stcstep{display:flex;align-items:center;gap:12px;height:47px;padding:0 20px;font-size:12.8px;color:var(--text-dim);cursor:pointer;border-bottom:1px solid var(--border-soft)}
.stcstep .n{width:26px;height:26px;border-radius:50%;border:1px solid var(--text-dim);display:grid;place-items:center;font-size:12px;flex:0 0 26px}
.stcstep.on{background:var(--hover);color:var(--white);font-weight:600}
.stcstep.on .n{border-color:var(--white);color:var(--white)}
.stcstep.done .n{background:var(--white);border-color:var(--white);color:var(--bg)}
.stcstep.done .n svg{width:12px;height:12px;fill:currentColor}
.stcwzf{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0}
.stcwzb{flex:1;min-height:0;overflow:auto;padding:16px 20px 0 20px}
.stcwzfoot{flex:0 0 auto;display:flex;justify-content:flex-end;gap:8px;padding:14px 20px}
.stch4{font-size:17px;font-weight:600;color:var(--white);margin:22px 0 12px}
.stcinl{display:flex;align-items:center;gap:24px;margin:10px 0}
.stcinl .stclab{margin:0;min-width:128px}
.stccond{display:flex;align-items:flex-end;gap:16px 24px;margin-bottom:10px;flex-wrap:wrap}
.stccond .op{width:102px;flex:0 0 102px}
.stccond .cd{width:222px;flex:0 0 222px}
.stccond .rp{flex:1;min-width:120px;max-width:360px}
.stccond .oc{width:114px;flex:0 0 114px}
.stccond .ic{display:flex;gap:8px;padding-bottom:4px}
.stccond .ic .stcib svg{width:18px;height:18px}
.stccond .ic .stcib.rm{color:var(--red)}
.stccond .stcsel.blank{opacity:1;border-color:var(--border);cursor:default}
.stccond .stcsel.blank .car{display:none}
.stcctl{border:1px solid var(--border);border-radius:4px;padding:14px 18px;margin:14px 0;position:relative;background:var(--panel)}
.stcctl .x{position:absolute;right:10px;top:10px}
.stcwzrow{display:flex;align-items:flex-start;gap:24px;margin-bottom:16px;max-width:780px}
.stcwzrow .stclab{flex:0 0 166px;margin:8px 0 0;min-width:0}
.stcwzrow .f{flex:1;min-width:0}
.stcwzrow .stin{margin-top:0}
@media (max-width:1366px){ .stcsearch{width:260px;flex-basis:260px} .stcsteps{width:260px;flex-basis:260px} }

/* ══ AGENTIC AI (\`ag*\`) — Settings › Agentic AI › Overview ════════════════════════════════
   Rebuilt 1 Sep 2026. The previous build was cleared on request; this is the new screen,
   growing from a supplied reference one piece at a time. FIRST PIECE: the page header.

   ⚠️ IT IS ONE COMPONENT, NOT A COMPOSITION. \`obs-page-header\` carries every part of the
   reference itself — \`heading\` for the title, the \`title\` SLOT for the status tag, \`subtitle\`
   for the description, the DEFAULT slot for the right-hand Docs button, and its own
   edge-to-edge bottom rule. There is no wrapper markup and no header CSS at all.
   ⚠️ \`no-divider\` IS DELIBERATELY *NOT* SET — the reference shows the rule under the whole
   block, which is the component's default. The previous build had to pass it because the
   description lived OUTSIDE the component (it carried an inline doc link, and \`subtitle\`
   escapes markup), so the divider would have landed between the title and its own text.
   With the link now a button, the description is the real \`subtitle\` and the default is right.

   ── the token blocks ────────────────────────────────────────────────────────────────────
   \`@mtdt/observeops-ds-css\` v0.1.6, re-emitted SCOPED so the DS palette reaches the \`obs-*\`
   elements without leaking onto the dashboard, the Log Explorer or the rest of Settings.
   ⚠️ THE PACKAGE IS NOT LINKED, AND MUST NOT BE: it declares its LIGHT values on \`:root\` and
   dark under \`[data-theme='dark-theme']\` — this prototype is the other way round, so linking
   it would put the whole page in the DS's light theme. See \`_ds/README.md\`.
   ⚠️ RECOVERED VERBATIM FROM 2e2c42f, not re-extracted. Regenerating needs a quote- and
   paren-aware declaration splitter: \`--graph-bg\` is a \`url('data:image/svg+xml;…')\` whose
   value carries its own \`;\`, and a naive \`split(';')\` leaves an unterminated string that
   silently drops every rule after the block.
   ⚠️ SCOPED TO \`#agPage\` ONLY. Anything this screen later renders OUTSIDE that subtree — a
   drawer, a dialog, a portalled popover — inherits none of this and must be added to both
   selectors. That is why the old build's selector read \`#agPage,#agWiz\`.
   ⚠️ Declared divergence: the DS ships Poppins, this prototype is Inter.
   ⚠️ \`#licHistDr\` IS THE obs-drawer HOST, AND IT HAS TO BE IN THIS LIST (12 Sep 2026). The
   drawer renders through a native \`<dialog>\` in the TOP LAYER and its element lives on \`<body>\`,
   so it is outside \`#licPage\` entirely — without it here the panel read the DS's own DEFAULT
   values, which are LIGHT, and the drawer painted white-on-white text over a dark page while the
   slotted body (\`#licHist\`, already in this list) correctly took the dark ones. Two themes in one
   overlay. Caught by shooting dark, not by any probe: every assertion passed and the conformance
   checker still said 100/100, because both halves were legal DS tokens — just not the same set. */
#agPage,#licPage,#licHist,#licHistF,#licHistDr{

  --action-dropdown-divider:rgba(255, 255, 255, 0.2);
  --action-dropdown-hover-bg:#172336;
  --action-dropdown-text:#cad3e2;
  --active-text-color:#fff;
  --alert-message-color:#e3e8f2;
  --alert-notification-popup-background-color:#282828;
  --alert-notification-popup-border-color:rgb(22, 22, 22);
  --ant-primary:#099dd9;
  --apm-heatmap-border-color:rgba(23, 35, 54, 0.7);
  --apm-heatmap-hover-color:#1d2a3e;
  --availability-icon-background-color:#2b394f;
  --availability-icon-text-color:#cad3e2;
  --bar-chart-color:#14b8a6;
  --border-color:#1d2a3e;
  --border-color-opacity:rgba(60, 60, 60, 0.5);
  --bottom-line-color:rgba(23, 35, 54, 1);
  --btn-height:2.1rem;
  --btn-radius:4px;
  --btn-raidus-full:150px;
  --button-disabled-bg:rgba(43, 57, 79, 0.7);
  --button-disabled-border:rgba(72, 89, 117, 0.7);
  --button-disabled-text:rgba(255, 255, 255, 0.5);
  --button-transparent-hover-text:#cad3e2;
  --button-transparent-text:#cad3e2;
  --calendar-border-color:#2b394f;
  --calendar-selected-day-background-color:#e3e8f2;
  --chart-amber:#fbbf24;
  --chart-aqua:#06b6d4;
  --chart-border-color:rgba(255, 255, 255, 0.5);
  --chart-bright-violet:#c026d3;
  --chart-chartreuse:#a3e635;
  --chart-electric-coral:#ff6b6b;
  --chart-emerald-green:#10b981;
  --chart-font-family:'JetBrains Mono', monospace;
  --chart-fuchsia:#d946ef;
  --chart-golden-yellow:#eab308;
  --chart-grid-line-color:rgba(23, 35, 54, 0.8);
  --chart-hot-pink:#ec4899;
  --chart-indigo:#8b5cf6;
  --chart-legend-color:rgba(255, 255, 255, 0.8);
  --chart-lime-green:#84cc16;
  --chart-line-type-icon:#8e9fbc;
  --chart-mint-green:#2dd4bf;
  --chart-neon-purple:#a855f7;
  --chart-null-color:#000;
  --chart-rose-red:#f43f5e;
  --chart-sunset-orange:#f97316;
  --chart-tangerine:#fb923c;
  --chart-tooltip-background:rgba(43, 57, 79, 0.9);
  --chart-type-icon:#fff;
  --chart-vibrant-magenta:#e83e8c;
  --chart-vivid-teal:#14b8a6;
  --chart-vivid-teal-faded:rgba(20, 184, 166, 0.35);
  --chat-height:400px;
  --chat-width:50vw;
  --checkbox-bg:#2b394f;
  --checkbox-checked-border-color:#485975;
  --checkbox-checked-color:#cad3e2;
  --code-tag-background-color:#172336;
  --code-tag-text-color:#cad3e2;
  --collapse-content-padding:10px 6px;
  --common-main-bg:#172336;
  --common-padd-space:15px;
  --common-widget-bg:#172336;
  --control-btn-bg:rgba(52, 152, 219, 0.2);
  --control-padding-horizontal:12px;
  --control-padding-horizontal-sm:8px;
  --dashboard-background:#0b1627;
  --default-button-bg:#07101f;
  --default-button-border:rgba(255, 255, 255, 0.8);
  --default-button-hover-bg:#1d2a3e;
  --default-button-hover-border:rgba(255, 255, 255, 0.8);
  --default-button-hover-text:#cad3e2;
  --default-button-text:#cad3e2;
  --default-tag-bg:rgba(9, 157, 217, 0.3);
  --default-tag-color:rgba(255, 255, 255, 0.2);
  --default-tag-text-color:rgba(202, 211, 226, 0.8);
  --disabled-checkbox-opacity:0.5;
  --disk-space-full-background:#ecf1f9;
  --drawer-background-color:#07101f;
  --drawer-mask-color:rgba(255, 255, 255, 0.45);
  --drawer-sidebar-background:#07101f;
  --dropdown-background:#1d2a3e;
  --dropdown-btn-background:'transparent';
  --dropdown-hover-background:#2b394f;
  --dropdown-text:#cad3e2;
  --error-button-bg:#ec5b5b;
  --error-button-hover-bg:#c84235;
  --error-button-hover-text:#cad3e2;
  --error-button-text:#cad3e2;
  --error-outline-button-bg:transparent;
  --error-outline-button-hover-bg:rgba(200, 66, 53, 0.2);
  --error-outline-button-hover-text:#c84235;
  --error-outline-button-text:#c84235;
  --faded-page-background-color:rgba(30, 30, 30, 0.4);
  --faded-text-color:rgba(30, 30, 30, 0.4);
  --field-border-color:#2b394f;
  --filter-background:#172336;
  --filter-viewer-bg-color:rgb(80, 80, 80);
  --focus-color:#204ca2;
  --font-family:'Poppins', sans-serif;
  --font-size-10:10px;
  --font-size-base:0.8rem;
  --font-size-lg:1rem;
  --font-size-sm:0.8rem;
  --gauge-base-color:#404244;
  --gauge-text-color:rgba(255, 255, 255, 0.8);
  --graph-bg:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none'%3E%3Crect x='4' y='4' width='2' height='2' fill='%232B394F'/%3E%3C/svg%3E");
  --grid-header-bg:rgba(72, 89, 117, 0.4);
  --grid-header-hover-bg:rgba(23, 35, 54, 0.4);
  --grid-header-solid-bg:rgba(70, 70, 70, 1);
  --grid-row-border-color:rgba(23, 35, 54, 0.7);
  --group-header-upper:#172336;
  --group-icon-color:#cad3e2;
  --group-list-bg:#172336;
  --group-list-hover-bg:#172336;
  --group-text-color:#cad3e2;
  --hardware-port-bolt-view-bg:#8fadc7;
  --hc-primary:#0d9488;
  --hc-range-background:#14b8a6;
  --header-drop-width:320px;
  --header-height:55px;
  --header-title-text-color:#e3e8f2;
  --help-card-bg-color:rgba(43, 57, 79, 0.3);
  --hieararchy-border-color:#6a7fa0;
  --info-border:#2c4a6b;
  --info-surface:#16283c;
  --info-text:#9cc4ec;
  --input-addon-color:#cad3e2;
  --input-height-base:32px;
  --input-padding-horizontal:11px;
  --input-padding-horizontal-base:11px;
  --input-padding-vertical-base:4px;
  --input-placeholder-color:rgba(202, 211, 226, 0.5);
  --input-suffix-bg:rgb(45, 45, 45);
  --input-suffix-text:#7186a8;
  --input-text-color:#cad3e2;
  --layout-header-height:55px;
  --layout-header-padding:0 12px;
  --left-menu-arrow-color:rgba(255, 255, 255, 0.65);
  --left-menu-arrow-opacity:0.7;
  --left-menu-hover-bg:#172336;
  --left-menu-text-color:rgba(255, 255, 255, 0.65);
  --left-menu-text-color-hover:rgba(255, 255, 255, 0.8);
  --left-menu-text-hover-color:white;
  --license-background:#07101f;
  --list-menu-hover:#e7f5fb;
  --main-tags-bg-color:#183a42;
  --main-tags-text-color:#2ec4b6;
  --map-line-color:#1d2a3e;
  --menu-collapsed-width:70px;
  --menu-item-active-border-width:3px;
  --mesasge-error:#fcdbd8;
  --mesasge-success:#e7f4d9;
  --modal-background-color:#07101f;
  --modal-text-color:#cad3e2;
  --nav-beta-text:#cad3e2;
  --nav-divider-bg:#e3e8f2;
  --nav-hover-bg:#1d2a3e;
  --nav-icon-height:40px;
  --nav-icon-line-height:40px;
  --nav-icon-size:1.1rem;
  --nav-icon-width:50px;
  --nav-menu-height:30px;
  --nav-panel-bg:#172336;
  --nav-selected-text-color:#172336;
  --nav-text-color:#cad3e2;
  --navbar-height:50px;
  --neutral-button-bg:#2b394f;
  --neutral-button-hover-bg:rgb(70, 70, 70);
  --neutral-button-hover-text:#cad3e2;
  --neutral-button-text:#cad3e2;
  --neutral-dark:#172336;
  --neutral-darker:#172336;
  --neutral-darkest:#000;
  --neutral-light:#8e9fbc;
  --neutral-lighter:#1d2a3e;
  --neutral-lightest:#172336;
  --neutral-regular:#6a7fa0;
  --neutral-regular-lighter:#ebeef2;
  --neutral-shadow-light:rgba(70, 70, 70, 0.15);
  --neutral-theme-color:#8e9fbc;
  --notification-dropdown-background:#172336;
  --notification-dropdown-background-hover:#1d2a3e;
  --notification-dropdown-border-color:#2b394f;
  --notification-dropdown-datetime-color:#8e9fbc;
  --notification-dropdown-footer:#323232;
  --notification-dropdown-header:rgb(70, 70, 70);
  --notification-dropdown-header-footer:#2b394f;
  --notification-subtitle-color:#cad3e2;
  --numeric-font-family:'JetBrains Mono', monospace;
  --outline-button-bg:transparent;
  --outline-button-hover-bg:#1d2a3e;
  --outline-button-hover-border:rgba(227, 232, 242, 0.5);
  --outline-button-hover-text:#cad3e2;
  --outline-button-text:#cad3e2;
  --overlay-bg:rgba(255, 255, 255, 0.25);
  --overlay-border-width:4px;
  --padding-md:16px;
  --padding-sm:12px;
  --padding-xs:8px;
  --page-background-color:#07101f;
  --page-text-color:#cad3e2;
  --pagination-active-bg:#172336;
  --pagination-active-text:#cad3e2;
  --pagination-select-bg:#172336;
  --pagination-select-text:#cad3e2;
  --pan-btn-bg:#2b394f;
  --pan-btn-border:#485975;
  --panel-side-box-shadow:-1px 6px 6px 0 rgba;
  --partition-icon-background-color:#2b394f;
  --partition-icon-text-color:#cad3e2;
  --picker-popover-max-height:35vh;
  --picker-popover-max-width:80vw;
  --policy-border-color:none;
  --pop-footer-height:75px;
  --popover-arrow-width:6px;
  --primary:#e3e8f2;
  --primary-alt:#cad3e2;
  --primary-alt-lighter:#e0ebf5;
  --primary-button-bg:#fff;
  --primary-button-hover-bg:rgba(255, 255, 255, 0.7);
  --primary-button-hover-text:#07101f;
  --primary-button-text:#07101f;
  --progress-bar-bg:#2b394f;
  --progress-bg:#2b394f;
  --radio-btn-box-bg:#07101f;
  --radio-btn-box-border-color:#204ca2;
  --radio-btn-box-selected-bg:#e3e8f2;
  --radio-btn-box-selected-text-color:#07101f;
  --screenshot-share-form-bg:#07101f;
  --screenshot-share-overlay-bg:rgba(255, 255, 255, 0.4);
  --search-height:36px;
  --search-icon:#e7f5fb;
  --search-width:18rem;
  --secondary-green:#36d576;
  --secondary-green-lighter:#edf7e2;
  --secondary-orange:#fa9950;
  --secondary-red:#ec5b5b;
  --secondary-red-dark:#c84235;
  --secondary-red-light:#f17a73;
  --secondary-yellow:#fad100;
  --secondery-focus-bg:#172336;
  --severity-clear:#36d576;
  --severity-clear-darker:#0d3a1f;
  --severity-clear-dot-box:#0d3a1f;
  --severity-clear-lighter:#0d3a1f;
  --severity-clear-lightest:#0d3a1f;
  --severity-critical:#ec5b5b;
  --severity-critical-darker:#310c0c;
  --severity-critical-dot-box:#310c0c;
  --severity-critical-lighter:#310c0c;
  --severity-critical-lightest:#310c0c;
  --severity-disable:#99aab7;
  --severity-disable-darker:#0d151a;
  --severity-disable-lighter:#0d151a;
  --severity-disable-lightest:#0d151a;
  --severity-down:#ad1111;
  --severity-down-darker:#1e0202;
  --severity-down-lighter:#1e0202;
  --severity-down-lightest:#1e0202;
  --severity-maintenance:#008cff;
  --severity-maintenance-darker:#001489;
  --severity-maintenance-dot-box:#001489;
  --severity-maintenance-lighter:#001489;
  --severity-maintenance-lightest:#001489;
  --severity-major:#fa9950;
  --severity-major-darker:#541914;
  --severity-major-dot-box:#541914;
  --severity-major-lighter:#541914;
  --severity-major-lightest:#541914;
  --severity-none:#8ac1d3;
  --severity-none-darker:#04232c;
  --severity-none-dot-box:#245463;
  --severity-none-lighter:#04232c;
  --severity-none-lightest:#04232c;
  --severity-stop:#ff91a0;
  --severity-stop-darker:#3e0614;
  --severity-stop-dot-box:#82283b;
  --severity-stop-lighter:#3e0614;
  --severity-stop-lightest:#3e0614;
  --severity-suspended:#d6b084;
  --severity-suspended-darker:#2d1b04;
  --severity-suspended-dot-box:#644621;
  --severity-suspended-lighter:#2d1b04;
  --severity-suspended-lightest:#2d1b04;
  --severity-unknown:#b1b1b1;
  --severity-unknown-darker:#2e2e2e;
  --severity-unknown-dot-box:#5d5d5d;
  --severity-unknown-lighter:#2e2e2e;
  --severity-unknown-lightest:#2e2e2e;
  --severity-unreachable:#8c5bd8;
  --severity-unreachable-darker:#22094a;
  --severity-unreachable-dot-box:#380e78;
  --severity-unreachable-lighter:#22094a;
  --severity-unreachable-lightest:#22094a;
  --severity-up:#36d576;
  --severity-up-darker:#0d3a1f;
  --severity-up-lighter:#0d3a1f;
  --severity-up-lightest:#0d3a1f;
  --severity-warning:#fad100;
  --severity-warning-darker:#543308;
  --severity-warning-dot-box:#543308;
  --severity-warning-lighter:#543308;
  --severity-warning-lightest:#543308;
  --side-menu-bg:#07101f;
  --slider-tracker:#485975;
  --sparkline-color-response-time:#14b8a6;
  --sparkline-color-throughput:#fb923c;
  --status-down:rgb(192, 62, 50);
  --status-progress-color:#485564ad;
  --status-up:rgb(110, 158, 51);
  --success-button-bg:#36d576;
  --success-button-hover-bg:#36d576;
  --success-button-hover-text:#cad3e2;
  --success-button-text:#cad3e2;
  --success-outline-button-bg:transparent;
  --success-outline-button-hover-bg:#0d3a1f;
  --success-outline-button-hover-text:#14b053;
  --success-outline-button-text:#14b053;
  --switch-bg:#172336;
  --switch-border:#1d2a3e;
  --switch-port-view-bg:#485975;
  --table-details-bg:#2b394f;
  --table-group-header-highlight:#172336;
  --tabs-card-height:32px;
  --tabs-text-color:#8e9fbc;
  --tag-bg:#1d2a3e;
  --tag-bg-color:#2b394f;
  --tag-border:#204ca2;
  --tag-color:#cad3e2;
  --tag-height:24px;
  --text-color-common-link:#e3e8f2;
  --text-color-common-primery:rgba(255, 255, 255, 0.8);
  --text-color-common-secondary:#8e9fbc;
  --text-input-bg:#fff;
  --text-lg:1.5rem;
  --text-neutral-ligher:#8e9fbc;
  --text-regular:1rem;
  --text-sm:0.8rem;
  --text-xs:0.6rem;
  --timeline-indicator-color:#1d2a3e;
  --timeline-scrollbar-background-color:#1d2a3e;
  --timerange-background-color:#2b394f;
  --timerange-text-color:#e3e8f2;
  --toast-background-color:#172336;
  --toast-text-color:rgba(255, 255, 255, 0.8);
  --tooltip-background-color:rgba(43, 57, 79, 0.9);
  --tooltip-box-shadow:0 2px 8px rgba(0, 0, 0, 0.5);
  --tooltip-text-color:#cad3e2;
  --topology-background:#172336;
  --topology-graph-tooltip-bg:#07101f;
  --topology-graph-tooltip-text-color:#fff;
  --topology-overlay-btn-bg:#cad3e2;
  --topology-overlay-btn-hover-bg:#cad3e2;
  --topology-overlay-btn-text:#07101f;
  --topology-tooltip-devider:#2b394f;
  --tour-flow-bg-color:#376842;
  --tour-log-bg-color:#236777;
  --tour-metric-bg-color:#142c40;
  --transparent-border-color:'transparent';
  --upgrade-accent-primary:#22d3ee;
  --upgrade-accent-secondary:#fb7185;
  --upgrade-accent-tertiary:#fbbf24;
  --upgrade-node-fill:rgba(255, 255, 255, 0.1);
  --upgrade-orb-primary:rgba(34, 211, 238, 0.3);
  --upgrade-orb-secondary:rgba(251, 113, 133, 0.2);
  --upgrade-progress-fill:linear-gradient(90deg, #22d3ee 0%, #06b6d4 100%);
  --upgrade-progress-shimmer:rgba(255, 255, 255, 0.3);
  --upgrade-progress-track:rgba(255, 255, 255, 0.1);
  --upgrade-ring-color:rgba(34, 211, 238, 0.22);
  --upgrade-text-primary:#fff;
  --upgrade-text-secondary:rgba(255, 255, 255, 0.6);
  --user-count-height:23px;
  --user-dropdown-button-bg:rgb(40, 40, 40);
  --user-dropdown-button-hover-bg:#172336;
  --user-dropdown-button-hover-text:#cad3e2;
  --user-dropdown-button-text:#cad3e2;
  --user-dropdown-theme-icon-color:#2b394f;
  --utility-result-bg:#0b1627;
  --utility-result-border:#172336;
  --utility-scrollbar-thumb:rgba(160, 160, 160, 0.5);
  --white-regular:rgba(255, 255, 255, 0.8);
  --widget-background:#0b1627;
  --widget-background-color:#172336;
  --widget-border-color:#172336;
  --widget-border-radius:4px;
  --widget-box-shadow:#000;
  --widget-type-selector-border-color:'transparent';
}

html[data-theme="light"] #agPage,html[data-theme="light"] #licPage,html[data-theme="light"] #licHist,html[data-theme="light"] #licHistF{
  /* ⚠️ THE SELECTED ROW AND A HOVERED ROW WERE THE SAME COLOUR IN LIGHT THEME — a DS
     collision, and the reason two rail rows read as selected at once (reported 1 Sep 2026
     with a screenshot). \`obs-side-menu\` paints \`.row.leaf.active\` with
     \`--code-tag-background-color\` and \`.row:not(.active):hover\` with \`--nav-hover-bg\`, and in
     LIGHT both resolve to #ecf1f9. \`sections\` mode gets away with it because it adds
     \`box-shadow: inset 2px 0 0 var(--primary)\` — that left rule is the only thing separating
     the two states — and \`categories\`, which the reference's row shape required, has no rule.
     Selected is now one step stronger than hover: \`--neutral-lighter\` (#e3e8f2) over #ecf1f9.
     ⚠️ LIGHT ONLY, ON PURPOSE. In DARK the DS values already differ (active #172336 over hover
     #1d2a3e), and \`--neutral-lighter\` is #1d2a3e there — re-pointing it for both themes would
     FIX light by creating the identical collision in dark. Measured both before choosing.
     ⚠️ Scoped to \`#agPage\`, like every token here: \`--code-tag-background-color\` also drives
     code chips elsewhere in the product's vocabulary. */

  --action-dropdown-divider:#e3e8f2;
  --action-dropdown-hover-bg:#e3e8f2;
  --action-dropdown-text:#7186a8;
  --alert-notification-popup-background-color:#fff;
  --alert-notification-popup-border-color:#eff2f6;
  --apm-heatmap-border-color:rgba(236, 241, 249, 1);
  --apm-heatmap-hover-color:#f6f9fc;
  --availability-icon-background-color:#e3e8f2;
  --availability-icon-text-color:#1d2a3e;
  --bar-chart-color:#0d9488;
  --border-color:#e3e8f2;
  --border-color-opacity:rgba(222, 229, 237, 0.5);
  --bottom-line-color:rgba(236, 241, 249, 1);
  --button-disabled-bg:#ecf1f9;
  --button-disabled-border:#e3e8f2;
  --button-disabled-text:rgba(0, 0, 0, 0.5);
  --button-transparent-hover-text:#7186a8;
  --button-transparent-text:#7186a8;
  --calendar-border-color:#e3e8f2;
  --calendar-selected-day-background-color:#111c2c;
  --chart-amber:#f59e0b;
  --chart-aqua:#0891b2;
  --chart-border-color:rgba(0, 0, 0, 0.1);
  --chart-bright-violet:#a21caf;
  --chart-chartreuse:#84cc16;
  --chart-electric-coral:#ef4444;
  --chart-emerald-green:#059669;
  --chart-fuchsia:#c026d3;
  --chart-golden-yellow:#ca8a04;
  --chart-grid-line-color:rgba(236, 241, 249, 0.8);
  --chart-hot-pink:#db2777;
  --chart-indigo:#7c3aed;
  --chart-legend-color:rgba(54, 70, 88, 0.9);
  --chart-lime-green:#65a30d;
  --chart-mint-green:#14b8a6;
  --chart-neon-purple:#9333ea;
  --chart-null-color:#e3e8f2;
  --chart-rose-red:#e11d48;
  --chart-sunset-orange:#ea580c;
  --chart-tangerine:#f97316;
  --chart-tooltip-background:rgba(255, 255, 255, 0.9);
  --chart-type-icon:#6a7fa0;
  --chart-vibrant-magenta:#db2777;
  --chart-vivid-teal:#0d9488;
  --chart-vivid-teal-faded:rgba(13, 148, 136, 0.35);
  --checkbox-bg:#fff;
  --checkbox-checked-border-color:#6a7fa0;
  --checkbox-checked-color:#111c2c;
  --code-tag-background-color:var(--neutral-lighter);/*#ecf1f9 — see the note above*/
  --code-tag-text-color:#1d2a3e;
  --common-main-bg:#ecf1f9;
  --common-widget-bg:#fff;
  --control-btn-bg:rgb(214 217 221);
  --dashboard-background:#f9fafb;
  --default-button-bg:#fff;
  --default-button-border:#e3e8f2;
  --default-button-hover-bg:#ecf1f9;
  --default-button-hover-border:#e3e8f2;
  --default-button-hover-text:#1d2a3e;
  --default-button-text:#1d2a3e;
  --default-tag-color:#e3e8f2;
  --default-tag-text-color:#516381;
  --disabled-checkbox-opacity:0.8;
  --drawer-background-color:#fff;
  --drawer-mask-color:rgba(0, 0, 0, 0.45);
  --drawer-sidebar-background:#fff;
  --dropdown-background:#fff;
  --dropdown-btn-background:#fff;
  --dropdown-hover-background:#ecf1f9;
  --dropdown-text:#7186a8;
  --error-button-hover-text:#fff;
  --error-button-text:#fff;
  --error-outline-button-hover-bg:rgba(240, 78, 62, 0.2);
  --error-outline-button-hover-text:#ec5b5b;
  --error-outline-button-text:#ec5b5b;
  --faded-page-background-color:rgba(255, 255, 255, 0.4);
  --field-border-color:#e3e8f2;
  --filter-background:#fff;
  --filter-viewer-bg-color:#fff;
  --gauge-base-color:#dee5ed;
  --gauge-text-color:#1d2a3e;
  --graph-bg:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNEg2VjZINFY0WiIgZmlsbD0iI0RGRTVFQyIvPgo8L3N2Zz4K');
  --grid-header-bg:#ecf1f9;
  --grid-header-hover-bg:#f6f9fc;
  --grid-header-solid-bg:#ecf1f9;
  --grid-row-border-color:rgba(236, 241, 249, 1);
  --group-header-upper:#f6f6f6;
  --group-icon-color:#6a7fa0;
  --group-list-bg:#ecf1f9;
  --group-list-hover-bg:#ecf1f9;
  --group-text-color:#2b394f;
  --hc-range-background:#0d9488;
  --header-title-text-color:#1d2a3e;
  --help-card-bg-color:rgba(227, 232, 242, 0.4);
  --hieararchy-border-color:#e3e8f2;
  --info-border:#cadff5;
  --info-surface:#eef5fc;
  --info-text:#2f6099;
  --input-addon-color:#6a7fa0;
  --input-placeholder-color:rgba(43, 57, 79, 0.5);
  --input-suffix-bg:#ecf1f9;
  --input-text-color:#1d2a3e;
  --left-menu-arrow-color:#6a7fa0;
  --left-menu-arrow-opacity:1;
  --left-menu-hover-bg:#ecf1f9;
  --left-menu-text-color:#2b394f;
  --left-menu-text-color-hover:#111c2c;
  --left-menu-text-hover-color:#111c2c;
  --license-background:#ecf1f9;
  --list-menu-hover:#ecf1f9;
  --main-tags-bg-color:#cdf1ed;
  --main-tags-text-color:#218b81;
  --map-line-color:#bbc8d6;
  --modal-background-color:#fff;
  --modal-text-color:#000;
  --nav-beta-text:#f6f9fc;
  --nav-divider-bg:#111c2c;
  --nav-hover-bg:#ecf1f9;
  --nav-panel-bg:#f6f9fc;
  --nav-selected-text-color:#f6f9fc;
  --nav-text-color:#1d2a3e;
  --neutral-button-bg:#e3e8f2;
  --neutral-button-hover-bg:#ecf1f9;
  --neutral-button-hover-text:#7186a8;
  --neutral-button-text:#7186a8;
  --neutral-dark:#2b394f;
  --neutral-light:#6a7fa0;
  --neutral-lighter:#e3e8f2;
  --neutral-lightest:#ecf1f9;
  --neutral-regular:#7186a8;
  --neutral-theme-color:#6a7fa0;
  --notification-dropdown-background:white;
  --notification-dropdown-background-hover:#ecf1f9;
  --notification-dropdown-border-color:#e3e8f2;
  --notification-dropdown-datetime-color:#516381;
  --notification-dropdown-header-footer:#e3e8f2;
  --notification-subtitle-color:#1d2a3e;
  --outline-button-hover-bg:#ecf1f9;
  --outline-button-hover-border:rgba(17, 28, 44, 0.5);
  --outline-button-hover-text:#111c2c;
  --outline-button-text:#111c2c;
  --overlay-bg:rgba(0, 0, 0, 0.25);
  --page-background-color:#fff;
  --page-text-color:#1d2a3e;
  --pagination-active-bg:#e3e8f2;
  --pagination-active-text:#7186a8;
  --pagination-select-bg:#e3e8f2;
  --pagination-select-text:#7186a8;
  --pan-btn-bg:#fff;
  --pan-btn-border:#dee5ed;
  --partition-icon-background-color:#e3e8f2;
  --partition-icon-text-color:#1d2a3e;
  --policy-border-color:#e3e8f2;
  --primary:#111c2c;
  --primary-alt:#1d2a3e;
  --primary-button-bg:#07101f;
  --primary-button-hover-bg:rgba(7, 16, 31, 0.7);
  --primary-button-hover-text:#fff;
  --primary-button-text:#fff;
  --progress-bar-bg:#e3e8f2;
  --progress-bg:#e3e8f2;
  --radio-btn-box-bg:#fff;
  --radio-btn-box-border-color:#e3e8f2;
  --radio-btn-box-selected-bg:#111c2c;
  --radio-btn-box-selected-text-color:#fff;
  --screenshot-share-form-bg:#fff;
  --screenshot-share-overlay-bg:rgba(0, 0, 0, 0.4);
  --search-icon:#2b394f;
  --secondary-green:#14b053;
  --secondary-orange:#f47c22;
  --secondary-yellow:#e8b407;
  --severity-clear:#14b053;
  --severity-clear-darker:#d1fae0;
  --severity-clear-dot-box:#a2f6c3;
  --severity-clear-lighter:#d1fae0;
  --severity-clear-lightest:#d1fae0;
  --severity-critical-darker:#fef5f5;
  --severity-critical-dot-box:#fef5f5;
  --severity-critical-lighter:#fef5f5;
  --severity-critical-lightest:#fef5f5;
  --severity-disable:#81929f;
  --severity-disable-darker:#d9e3ea;
  --severity-disable-lighter:#d9e3ea;
  --severity-disable-lightest:#d9e3ea;
  --severity-down-darker:#f3c9c4;
  --severity-down-lighter:#f3c9c4;
  --severity-down-lightest:#f3c9c4;
  --severity-maintenance:#006dfa;
  --severity-maintenance-darker:#cce4ff;
  --severity-maintenance-dot-box:#99cdff;
  --severity-maintenance-lighter:#cce4ff;
  --severity-maintenance-lightest:#cce4ff;
  --severity-major:#f47c22;
  --severity-major-darker:#fddcc4;
  --severity-major-dot-box:#fac2a0;
  --severity-major-lighter:#fddcc4;
  --severity-major-lightest:#fddcc4;
  --severity-none:#6fa8bb;
  --severity-none-darker:#dbf8ff;
  --severity-none-dot-box:#c5ecfa;
  --severity-none-lighter:#dbf8ff;
  --severity-none-lightest:#dbf8ff;
  --severity-stop:#e87587;
  --severity-stop-darker:#ffdfe5;
  --severity-stop-dot-box:#ffcad3;
  --severity-stop-lighter:#ffdfe5;
  --severity-stop-lightest:#ffdfe5;
  --severity-suspended:#be9669;
  --severity-suspended-darker:#ffeed7;
  --severity-suspended-dot-box:#fcdfbf;
  --severity-suspended-lighter:#ffeed7;
  --severity-suspended-lightest:#ffeed7;
  --severity-unknown-darker:#fcfcfc;
  --severity-unknown-dot-box:#f8f8f8;
  --severity-unknown-lighter:#fcfcfc;
  --severity-unknown-lightest:#fcfcfc;
  --severity-unreachable:#6d2ed1;
  --severity-unreachable-darker:#e7dcfa;
  --severity-unreachable-dot-box:#c8aff0;
  --severity-unreachable-lighter:#e7dcfa;
  --severity-unreachable-lightest:#e7dcfa;
  --severity-up:#14b053;
  --severity-up-darker:#d1fae0;
  --severity-up-lighter:#d1fae0;
  --severity-up-lightest:#d1fae0;
  --severity-warning:#e8b407;
  --severity-warning-darker:#fff1b3;
  --severity-warning-dot-box:#ffe980;
  --severity-warning-lighter:#fff1b3;
  --severity-warning-lightest:#fff1b3;
  --side-menu-bg:#fff;
  --sparkline-color-response-time:#0d9488;
  --sparkline-color-throughput:#f97316;
  --status-progress-color:transparent;
  --success-button-bg:#14b053;
  --success-button-hover-bg:#14b053;
  --success-button-hover-text:#fff;
  --success-button-text:#fff;
  --success-outline-button-hover-bg:#d1fae0;
  --switch-bg:#fff;
  --switch-border:#e3e8f2;
  --switch-port-view-bg:#cad3e2;
  --table-details-bg:#e3e8f2;
  --table-group-header-highlight:#d6edf8;
  --tabs-text-color:#516381;
  --tag-bg:#ecf1f9;
  --tag-bg-color:#e3e8f2;
  --tag-border:#e3e8f2;
  --tag-color:#7186a8;
  --text-color-common-link:#111c2c;
  --text-color-common-primery:#2b394f;
  --text-color-common-secondary:#7186a8;
  --text-neutral-ligher:#6a7fa0;
  --timeline-indicator-color:#172336;
  --timeline-scrollbar-background-color:#e3e8f2;
  --timerange-background-color:#e3e8f2;
  --timerange-text-color:#7186a8;
  --toast-background-color:#fff;
  --toast-text-color:#000;
  --tooltip-background-color:#172336;
  --tooltip-box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);
  --tooltip-text-color:#fff;
  --topology-background:#fff;
  --topology-graph-tooltip-bg:#172336;
  --topology-overlay-btn-bg:#ecf1f9;
  --topology-overlay-btn-hover-bg:#e3e8f2;
  --topology-overlay-btn-text:#7186a8;
  --tour-flow-bg-color:#def1e2;
  --tour-log-bg-color:#d6f1f7;
  --tour-metric-bg-color:#cfdce6;
  --transparent-border-color:#e3e8f2;
  --user-dropdown-button-bg:#ecf1f9;
  --user-dropdown-button-hover-bg:#e3e8f2;
  --user-dropdown-button-hover-text:#1d2a3e;
  --user-dropdown-button-text:#1d2a3e;
  --user-dropdown-theme-icon-color:#e3e8f2;
  --utility-result-bg:#ecf1f9;
  --utility-result-border:#e3e8f2;
  --utility-scrollbar-thumb:rgba(136, 136, 136, 0.4);
  --white-regular:#fff;
  --widget-background:#fff;
  --widget-background-color:#fff;
  --widget-border-color:#e3e8f2;
  --widget-box-shadow:none;
  --widget-type-selector-border-color:#e3e8f2;
}

/* ── this file's own tokens, re-pointed at the DS ones ────────────────────────────────────
   The \`.ag*\` rules below (and the \`st\`/\`stc\` atoms this page still borrows for layout) are
   written against this prototype's token names; pointing them at the DS names above converts
   every one of them at once, and keeps the mapping auditable in one table. */
#agPage,#licPage,#licHist,#licHistF,#licHistDr{
  /* ⚠️ the DS ships Poppins; this prototype is Inter. Declared divergence — see above. */
  --font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --card:var(--common-widget-bg);      --panel-2:var(--neutral-lightest);
  --text:var(--page-text-color);       --text-dim:var(--text-color-common-secondary);
  --text-dim2:var(--neutral-light);    --muted:var(--neutral-regular);
  --border:var(--border-color);        --border-soft:var(--border-color);
  --chip:var(--field-border-color);    --hover:var(--nav-hover-bg);
  --sel:var(--neutral-lighter);        --white:var(--primary);
  /* Atoms/Button → one \`primary\` per view = \`--primary-button-bg\` / \`--primary-button-text\` */
  --action:var(--primary-button-bg);   --action-fg:var(--primary-button-text);
  --action-h:var(--primary-alt);
  --teal:var(--primary);               --teal-dim:var(--primary-alt);
  /* ⚠️ THE AI ACCENT IS \`--chart-indigo\`, AND IT IS THE ONLY CHROMATIC THING HERE.
     The DS has NO "AI accent" token — \`resolve_token("AI accent purple")\` returns nothing —
     and the contract forbids inventing one. \`--chart-indigo\` is the DS's own violet and is
     already what this prototype paints every AI surface with (Log Explorer's AI Query, the
     per-widget ✦ drawer, the toolbar pill). Declaring it here also FIXES LIGHT THEME: \`:root\`
     declares \`--ai:#8b5cf6\` once and never overrides it, so light was wearing the dark value.
     ⚠️ It paints the MARK, never a button. The reference makes every CTA purple; the DS is
     explicit that the primary action is \`--primary\` (navy) and warns twice that the brand is
     "navy, NOT cyan, NOT blue". So violet marks *what this is*; navy marks *what to press*. */
  --ai:var(--chart-indigo);
  --ai-soft:color-mix(in srgb, var(--chart-indigo) 13%, transparent);
  --ai-line:color-mix(in srgb, var(--chart-indigo) 34%, transparent);
}

.agpage{flex:0 0 auto;min-width:0}

/* ── the integration header ───────────────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026: the product's own "Motadata ServiceOps" INTEGRATION header —
   a mark leading the row, the title, and the description beneath it carrying the doc link
   inline as "For more information: <link> ↗".
   ⚠️ THE DESCRIPTION CANNOT BE \`subtitle\`. The prop ESCAPES markup (measured — an \`<a>\`
   renders as literal text), so an inline link is impossible through it. It is rendered here,
   outside the component, which is why the component takes \`no-divider\`: its own rule would
   otherwise land BETWEEN the title and the description that belongs to it. The rule moves to
   this wrapper so it sits under the whole block, which is what the reference shows.
   ⚠️ THE INDENT ALIGNS THE DESCRIPTION WITH THE TITLE, NOT WITH THE MARK — 30px of mark plus
   the header's own 12px gap. In the reference the sentence starts under the product name. */
/* ⚠️ NO RULE UNDER THE HEADER (request, 1 Sep 2026: "remove this line"). It had one because
   the description was moved OUT of \`obs-page-header\`'s \`subtitle\` — the prop escapes markup, so
   the inline documentation link forced a separate \`<p>\` — and the component's own divider would
   then have landed BETWEEN the title and the text that belongs to it. \`no-divider\` stays on the
   component for that reason; the wrapper's border is simply gone.
   ⚠️ THE MARGIN GOES UP 14 → 16px (@padding-md). With the rule there, the line did the
   separating; without it the space has to, and 14px was the gap to a rule, not to the toolbar. */
.aghead{padding:0;margin:0 0 16px}
/* ⚠️ LESS MARGIN BETWEEN THE TITLE AND ITS DESCRIPTION (request, 1 Sep 2026: "use less
   margin"). The description is a separate \`<p>\` — \`subtitle\` escapes markup and the doc link is
   inline — so the gap was the COMPONENT's 8px bottom inset plus the \`<p>\`'s 2px, measuring 17px
   from the heading's own baseline.
   ⚠️ ONLY THE BOTTOM INSET IS DROPPED: \`8px 8px 0\`, not \`0\`. \`--page-header-padding\` sets all
   four sides, and zeroing it would pull the title 8px LEFT — out of line with the description
   below it, which is indented from \`.aghead\` and does not move. */
.aghead obs-page-header{display:block;--page-header-padding:8px 8px 0}
/* the Option 1 / Option 2 switcher in the header's action slot (see AG_OPTS) — the License header's .lichact */
.aghact{display:inline-flex;align-items:center;gap:8px}
/* Option 2's Configure drawer: a 684px side panel with no rail and no help card, so the form pane pays its own right gutter */
#drawer-agcfg.agcfgo2 .agcfgm{padding-right:24px}
/* ⚠️ NO RULE ABOVE THE BUTTONS ON OPTION 2 (request, 16 Sep 2026: "remove the line upper side save
   button"). The padding STAYS: the border is what was asked for, and taking the 16px with it would
   jam Save against the field above it. The footer still sits on the drawer's floor, which is what
   separates it — \`.agff\` keeps its \`margin-top:24px\` and the body flexes into the slack. */
#drawer-agcfg.agcfgo2 .agff{padding-right:0;border-top:0}
/* the footer on the panel's floor, like the product's form drawers: the body GROWS to the panel but never SHRINKS below its
   content (flex:1 0 auto) — shrinking is the recorded .dr-b squash that stranded the full-width form's footer mid-panel */
#drawer-agcfg.agcfgo2 .dr-b > .agcfg{flex:1 0 auto}
/* ⚠️ ONE RHYTHM FOR EVERY ROW (request, 16 Sep 2026: "make proper alignment", with the product's own Create Credential
   Profile / Schedule Topology drawers as the reference). Measured before: the provider row's label sat 6px above its control
   while obs-input's own shadow label sits 7px above its field, and the rows ran on the form's 16px step where the product's
   form drawers run on 24px. Now: 7px label→control on EVERY row (the component's own number, which page CSS cannot change),
   and 24px between rows — @padding-lg, the step those drawers use. Scoped to Option 2; Option 1's form is untouched. */
.agfprov{display:grid;justify-items:start;gap:7px}
.agfprov .agflb{margin-bottom:0}
.agfprov obs-radio{display:block}
/* ⚠️ OPTION 2's PANEL IS INSET 16px, NOT 24 (request, 16 Sep 2026), AND THE FIRST ROW SITS FLUSH
   AT THE TOP ("the AI provider field margin is 24px → 0px"). Measured before changing it: the
   drawer's own header is padded \`14px 16px\`, so the form was inset 8px further than the title
   above it — 16px puts every field on the same left edge as "Configure AI provider".
   ⚠️ THE 56px BOTTOM PADDING IS UNTOUCHED. It is not spacing: it holds the pinned footer clear of
   the fixed variant-switcher pill, and its own note records the 103×7px overlap it exists to stop.
   ⚠️ \`> :first-child\` NEEDS THE ID TOO. \`.agfbody > :first-child{margin-top:0}\` already exists at
   (0,2,0) and LOSES to this block's own \`#drawer-agcfg.agcfgo2 .agfbody > *\` at (1,2,0) — which is
   why the picker carried 24px in the first place. The zero has to be written at the same weight. */
#drawer-agcfg.agcfgo2 .agcfgm{padding:16px 16px 56px}
#drawer-agcfg.agcfgo2 .agfbody > :first-child{margin-top:0}
#drawer-agcfg.agcfgo2 .agfbody > *{margin-top:24px}
#drawer-agcfg.agcfgo2 .agfbody > .agcfgp{margin-top:4px}   /* the helper line still belongs to the heading above it */
.agterms{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;line-height:1.55;color:var(--text-color-common-secondary)}
/* ⚠️ THE BOX IS CENTRED ON ITS FIRST LINE, not on the row: obs-checkbox renders a 24px box against a 19px line, so
   flex-start alone left the tick sitting low, and align-items:center would centre it across BOTH lines if the text ever wraps */
.agterms obs-checkbox{flex:0 0 auto;margin-top:-2px}
.agterms obs-link{display:inline}
/* Option 2's connected-provider panel (agConnHTML): header · key-value · metric row · the three trend widgets */
.agpage obs-key-value,.agpage obs-metric-list{display:block}
.agcon{display:grid;gap:16px;margin-top:16px}
.agcon0{display:block;font-size:13px;color:var(--text-color-common-secondary)}
.agcon0 b{color:var(--primary-alt);font-weight:600}
.agconh{display:flex;align-items:center;gap:12px}
.agconi{flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:var(--btn-radius);
  background:var(--page-background-color);color:var(--chart-indigo)}   /* not --neutral-lightest: that IS the panel's #172336 in dark */
.agcont{min-width:0}
.agconn{display:flex;align-items:center;gap:8px;font-size:15px;color:var(--primary-alt)}
.agconn b{font-weight:600}
.agcont p{margin:2px 0 0;font-size:12.5px;color:var(--text-color-common-secondary)}
.aghmk{display:grid;place-items:center;width:30px;height:30px;color:var(--chart-indigo)}
/* ⚠️ 48px, NOT 42 — MEASURED, NOT ESTIMATED. The indent is meant to put the description under
   the TITLE rather than under the mark, and 42px was a guess at "30px mark + 12px gap". The
   real offset is the component's own 8px left inset + the 30px mark + its 10px gap = 48px; at
   42 the description sat 6px left of the title it belongs to. Caught by comparing the two
   rects, not by eye. */
/* ⚠️ NO \`max-width\` (request, 2 Sep 2026: "text will be shown full"). It was capped at 940px,
   so on a wide screen the description wrapped to two lines with the rest of the row empty beside
   it — and the wrap fell mid-sentence, breaking "…to the provider you connect —" from "nothing
   is stored in plain text". A measure cap is right for a paragraph you READ; this is one line of
   page description that should simply use the width it has.
   ⚠️ It keeps its 48px left indent, which is what aligns it under the page title rather than
   under the mark beside it. */
.aghsub{margin:2px 0 12px 48px;font-size:12.8px;line-height:1.55;
  color:var(--text-color-common-secondary)}
.aghsub obs-link{margin-left:2px}
/* ⚠️ \`obs-link\`'s \`external\` PROP DOES NOT DRAW THE ↗ — it only marks the link as external.
   The reference puts the glyph after the text, so it is added as an \`obs-icon\` in the link's
   own slot (a DS icon, not a hand-drawn one). Measured before assuming. */
.aghsub obs-link obs-icon{margin-left:5px;vertical-align:-1px}

/* ── the toolbar ──────────────────────────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026: a search field left, one primary action right. That is
   Organisms/Toolbar's grid variant exactly — \`start\` slot for the search, the default slot
   for the action — and it is \`list-view\`'s own "Add <Noun>" region.
   ⚠️ NO WIDTH ON THE BUTTON AND NO CUSTOM CONTROL HERE. Both children are real \`obs-*\`. */
.agpage obs-toolbar{display:block}
.agsrch{width:290px;max-width:100%}

/* ── the provider configuration screen ────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026: the product's "Application Registration" screen — a narrow
   left rail of the things you can configure, and the selected one's form on the right.
   ⚠️ IT IS A FULL PAGE, NOT A DRAWER (\`stFullOpen\`), which is what the reference shows: its
   own title bar, the settings category list hidden, the body given over to the two columns.
   The cleared build put this in a 62% \`obs-drawer\`; the reference does not.
   ⚠️ THE RAIL IS \`obs-side-menu\` mode="categories", AND THAT IS A LOOKS-FIRST CHOICE —
   recorded because it bends the component's own semantics. All four modes were rendered side
   by side against the reference: \`sections\` puts a \`--primary\` LEFT RULE on the active row and
   packs the rows to 31px; \`list\` adds a divider between every row; \`tree\` adds chevrons.
   The reference has none of those — a roomy row, an icon, and a plain fill — and only
   \`categories\` renders that. Its registry describes it as a counted category picker at ~30vw,
   so BOTH the purpose and the width are departures; with three uncounted rows in a 230px rail
   neither costs anything, and the alternative was hand-building a nav the DS already ships.
   ⚠️ THE ROUNDED, INSET highlight of the reference is NOT reachable. Every mode paints the
   active row full-bleed in \`--code-tag-background-color\`, and that rule lives in the
   component's shadow root — there is no part, and no radius token. Declared, not faked.
   ⚠️ NO BORDER HERE. \`obs-side-menu\` has carried its own \`border-right\` since 2026-08-06 and
   the DS is explicit it must stay a flush white panel — wrapping it in a bordered/tinted card
   is called out in its \`dont\` list. */
/* ⚠️ IT MUST FILL \`#stMain\`, OR THE DIVIDERS STOP MID-PAGE (request, 1 Sep 2026: "the line
   will be show full", with both rules boxed in red). \`#stMain\` is a flex COLUMN, so this was
   \`flex:0 0 auto\` and took its content height — 520px against 679px of available column, and
   the rail's right rule and the help card's left rule both ended in mid-air. \`flex:1 1 auto\`
   makes it take the remaining height and \`align-items:stretch\` passes that to both columns,
   so the two rules run the full panel height as the reference shows.
   ⚠️ The min-height stays as a floor for a very short viewport. */
.agcfg{display:flex;align-items:stretch;flex:1 1 auto;min-height:520px;gap:0}
/* ⚠️ THE NARROW RAIL IS A DS DISTINCTION, NOT A GUESS (request, 1 Sep 2026: "make small
   sidebar"). \`obs-side-menu\`'s own sizing contract puts mode \`list\` at ~15–25% of the
   viewport (~340px, an explorer rail) and mode \`sections\` at ~15% (~215–290px, the SETTINGS
   rail) — and the reference is a settings form. Switching mode is what makes it small; the
   element is \`width:100%\`, so this container is the only place the width is set. */
.agcfgn{flex:0 0 230px;width:230px;min-width:0}
/* ⚠️ A COLUMN, SO THE FOOTER CAN SIT AT THE BOTTOM (request, 1 Sep 2026: "it will be show in
   bottom"). The step body used to end wherever its content ended and the footer followed it, so
   on a short step — Credentials with Advanced closed — the KMS note and Continue floated in the
   middle of a tall panel. */
.agcfgm{flex:1;min-width:0;padding:0 0 56px 24px;display:flex;flex-direction:column}
/* ⚠️ 56px OF BOTTOM PADDING, AND IT IS NOT DECORATION — it keeps the footer out from under the
   variant switcher. \`.vs-switch\` is \`position:fixed; left:50%; bottom:18px\` and 33px tall, so
   it owns the bottom ~51px of the viewport at screen centre. Once the footer was pinned to the
   bottom of this column the pill sat ON TOP of Continue — measured 103×7px of overlap, with
   Continue at 794..881 under the pill at 749..851. The pill ships (it is in \`_variants.js\`,
   loaded by every page), so this is not a dev-only collision. */
.agcfgh{margin:0 0 4px;font-size:16px;font-weight:600;color:var(--primary-alt)}
.agcfgp{margin:0 0 4px;font-size:12.8px;line-height:1.55;color:var(--text-color-common-secondary);max-width:720px}
/* a form section — the reference separates each with a hairline and gives it a label,
   a line of help, then the control.
   ⚠️ EVERY SPACING HERE IS ON THE DS STRUCTURAL SCALE (\`tokens/structural.json\`:
   @padding-lg 24 · @padding-md 16 · @padding-sm 12 · @padding-xs 8). It opened at 18/22/28px
   — eyeballed, and off-scale on all three — which the conformance checker scored \`layout 38\`
   while every other dimension was 100. Don't nudge these to a round-looking number. */
/* ⚠️ THE SECTION-PER-FIELD RULES (\`.agfs\` / \`.agfl\` / \`.agfd\` / \`.agfc\`) WERE DELETED WITH
   THE FORM THEY STYLED. The reference labels each field on the control itself (obs-input's own
   \`label\`/\`required\`), not with a bold heading + a line of help above it, so nothing carried
   those classes any more — and a rule that outlives what it supported is the trap this file
   records at \`.agemt\`. Grep before restoring them.
   ⚠️ EVERY SPACING HERE IS ON THE DS STRUCTURAL SCALE (@padding-lg 24 · @padding-md 16 ·
   @padding-sm 12 · @padding-xs 8). Eyeballed values scored \`layout 38\` once already. */
/* ⚠️ \`flex:1 0 auto\` — GROW, NEVER SHRINK. These two were \`1 1 auto; min-height:0\`, which was
   right while the screen was a three-step wizard whose every step fitted: the body stretched so
   the footer sat at the bottom. Flattening the wizard (2 Sep 2026) made the content taller than
   the viewport, and a shrinkable body with \`overflow:visible\` collapsed BELOW its own content —
   so the form painted straight over the footer. \`shrink:0\` keeps the natural height once the
   content exceeds the space, \`grow:1\` still pushes the footer down when it does not, and
   \`.stmain\` (already \`overflow:auto\`) does the scrolling.
   ⚠️ \`min-height:0\` HAD TO GO WITH IT — it is the licence to shrink below content, so leaving it
   in would have kept the overlap whatever the flex shorthand said.
   ⚠️ TWENTY PASSING ASSERTIONS DID NOT CATCH THIS. Every one of them read the DOM — buttons,
   gating, section count — and the defect was purely where things PAINTED. The screenshot found
   it. */
.agform{max-width:720px;flex:1 0 auto;display:flex;flex-direction:column}
/* ⚠️ THE BODY FLEXES AND THE FOOTER KEEPS ITS OWN MARGIN — deliberately NOT \`margin-top:auto\`
   on the footer. \`margin-top:auto\` resolves to 0 when there is no free space, so it cannot also
   carry the minimum gap, and a tall step would end up with the footer jammed against the last
   control. That is the recorded \`.aihelpl\` trap. Letting the BODY take the slack keeps the
   24px in \`.agff\` a real floor in both cases. */
.agfbody{flex:1 0 auto}
.agrow2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 24px}
.agrow3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 24px;margin-top:16px}
.agcfgm obs-input{display:block}
/* the Advanced settings disclosure — a real obs-button, so the one control here stays a DS
   element; only the chevron's rotation is ours */
/* ⚠️ THE TOGGLE LIVES INSIDE THE BOX (request, 2 Sep 2026: "the Advanced settings button will
   be shown inside box"). It used to sit above it, so open and closed were two different objects —
   a loose button, then a loose button with a panel under it. It is now one collapsible section:
   the box is always there, the button is its header, the fields are its body.
   ⚠️ THE DS SHIPS NO ACCORDION. Checked against the bundle 2 Sep 2026: 52 registered \`obs-*\`
   elements and not one collapse / disclosure / details among them — the same declared gap the
   Help Card sits in. So the SECTION is built here, but the one interactive part of it stays a
   real \`obs-button\`; only the chevron's rotation and the box are ours.
   ⚠️ \`--common-widget-bg\`, NOT \`--neutral-lightest\`. The DS's own description of
   \`--neutral-lightest\` is "subtle fill / skeleton / code chip" — a panel of form fields is none
   of those, and it painted this section as a tinted slab unlike every other panel on the screen.
   \`--common-widget-bg\` is what \`.agpanel\` and \`.agtest\` use. Same argument as \`.laypick\`,
   27 Aug 2026. */
.agadv{margin-top:16px;padding:12px 16px;border:1px solid var(--border-color);
  border-radius:var(--btn-radius);background:var(--common-widget-bg)}
.agadv.on{padding-bottom:16px}
/* ⚠️ THE BUTTON'S BORDER AND FILL ARE REMOVED BY REPOINTING THE COMPONENT'S OWN TOKENS, scoped
   to this one button (request, 2 Sep 2026: "remove button border"). \`.btn.v-default\` inside the
   shadow root reads \`--default-button-bg\` / \`--default-button-border\`, and custom properties
   inherit ACROSS the shadow boundary — so nothing here has to reach inside the component, which
   exposes no \`::part\`. It stays a real \`obs-button\` with the DS's own type, height and focus
   ring; only these two paints are cleared.
   ⚠️ THE HOVER/FOCUS FILL IS CLEARED TOO, AND THAT IS THE SECOND PASS. It was left in as the
   control's only feedback — but \`.v-default\` paints that same fill on \`:hover\`, \`:active\` AND
   \`:focus\`, so after you clicked to expand the section the button KEPT a filled slab for as long
   as it held focus. Removing the border and leaving that in meant the button looked bordered
   again the moment it was used. Hover now strengthens the LABEL instead
   (\`--default-button-hover-text: --primary\`, which inverts correctly per theme), and real
   keyboard focus still gets the DS's own \`:focus-visible\` 2px outline, untouched.
   ⚠️ \`margin-left:-15px\` PULLS THE CHEVRON FLUSH WITH THE PANEL'S CONTENT EDGE. \`.btn\` carries a
   hardcoded \`padding:0 15px\` with no token behind it, so with the border gone the header's glyph
   sat 15px right of the field labels underneath it — an indent that was invisible while a button
   box explained it. Cancelling it in the margin lines the disclosure up with its own content, as
   a disclosure header should. Measured against the first field label, not eyeballed. */
.agadvb{margin:0 0 0 -15px;
  --default-button-bg:transparent;--default-button-border:transparent;
  --default-button-hover-bg:transparent;--outline-button-hover-border:transparent;
  --default-button-hover-text:var(--primary)}
.agadv .agadvb obs-icon{transition:transform .15s ease}
.agadv.on .agadvb obs-icon{transform:rotate(180deg)}
/* ⚠️ NO RULE BETWEEN HEADER AND BODY (request, same). The box's own border already says where
   the section starts and ends; a second hairline 40px inside it cut one panel into two. The
   16px is the DS \`@padding-md\` step, doing the separating on its own. */
.agadvbd{margin-top:16px}
/* ⚠️ \`.agflb\` REPRODUCES \`obs-input\`'s OWN SHADOW \`.lbl\` RULE, VERBATIM — the component draws
   its label inside its shadow root with no slot and no ::part, so a field that needs an ⓘ after
   its label has to render the label itself. Values read from the shipped 0.1.166 stylesheet:
   \`font-size:var(--text-sm,.8rem); line-height:1.5; color:var(--text-color-common-secondary)\`.
   ⚠️ IF THE COMPONENT'S LABEL STYLING EVER CHANGES, THIS DRIFTS SILENTLY — the two would simply
   stop matching, with nothing to error. There is a probe assertion comparing a \`.agflb\` label to
   a field that still uses the component's own \`label\` prop, on size, colour and offset. */
.agflb{display:flex;align-items:center;gap:6px;margin-bottom:4px;
  font-size:var(--text-sm,.8rem);line-height:1.5;color:var(--text-color-common-secondary)}
/* the ⓘ is \`obs-tooltip\`'s OWN default trigger — given no \`trigger\` slot and no \`trigger-label\`
   it renders \`obs-icon name="infoCircle" size="15" label="More info" tabindex="0"\`, so the mark,
   its size and its keyboard focusability are the DS's, not drawn here. */
.agflb obs-tooltip{display:inline-flex;line-height:0}
/* ⚠️ NO BORDER, AND THEREFORE NO PADDING AND NO FILL (request, 2 Sep 2026: "remove border").
   This block is only on screen while the test RUNS — about two seconds — and it is now plain
   content in the form's own flow rather than a panel.
   ⚠️ The padding and the fill had to go WITH the border, not be kept beside it. \`padding:16px\`
   with no box indents the content 16px from everything above it with nothing on screen to
   explain the indent; and \`--common-widget-bg\` is \`#fff\` in light, i.e. invisible against the
   page — so in light it bought nothing and in dark it would have left a tinted band hugging two
   lines of text. One \`margin-top\` is all the separation a transient status line needs.
   ⚠️ It is still LAYOUT around real \`obs-*\` controls, not a fabricated component: the DS has no
   card or accordion (\`search_components\`), and \`list_gaps\` declares only charts / topology /
   widget-grid — which is why this was a hand-built block in the first place. Now it is less of
   one, not more. */
.agtest{margin-top:24px}
/* ⚠️ NEVER PUT \`style=\` ON AN \`obs-*\` ELEMENT — Vue FORWARDS IT INTO THE SHADOW ROOT. A custom
   element built with \`defineCustomElement\` applies the host's fallthrough attributes, \`style\`
   included, to the COMPONENT'S OWN ROOT NODE. So \`style="display:block"\` on \`<obs-banner>\` did
   not merely set the host (which \`:host{display:block}\` already does) — it landed on \`.bn\`
   inside the shadow root and overrode its \`display:flex\`, stacking the icon above the message.
   Measured 2 Sep 2026: \`inline style on .bn = "margin-top:16px; display:block"\`, computed
   \`display:block\`, and forcing flex back put them on one line.
   ⚠️ A CLASS IS SAFE where a style attribute is not: the class is copied inward too, but page
   CSS cannot match inside a shadow tree, so only the rule targeting the HOST applies — which is
   what these two do. Margins are all they need; the component already declares its own display.
   ⚠️ Both banners on this screen carried that inline style, so BOTH were stacking. */
/* the toolbar's icon-only export — square, like the Compliance grid's own square actions */
.agexp{--default-button-bg:transparent}
.agbanok{margin-top:16px}
.agbanwarn{margin:12px 0 16px}
.agth{display:flex;align-items:center;gap:8px}
.agth .t{font-size:13px;font-weight:600;color:var(--primary-alt)}
.agth obs-icon{color:var(--neutral-light)}
.agth obs-tag{margin-left:2px}
.agth obs-button{margin-left:auto}
.agtn{display:flex;align-items:flex-start;gap:8px;margin-top:12px;font-size:12.5px;
  line-height:1.5;color:var(--text-color-common-secondary)}
.agtn obs-icon{flex:0 0 auto;margin-top:1px;color:var(--neutral-light)}
.agtn.ok{color:var(--secondary-green)}
.agtn.ok obs-icon{color:var(--secondary-green)}

/* ── the flow's remaining steps ───────────────────────────────────────────────────────────
   Model selection · Data consent · Done, from the reference prototype's own wizard. All
   spacing on the DS structural scale (@padding-lg 24 · @padding-md 16 · @padding-sm 12 ·
   @padding-xs 8) — eyeballed values have scored \`layout 38\` here once already. */
.agflow{margin-bottom:24px}
.agsub{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:var(--neutral-regular);margin:0 0 12px}
.agpanel{padding:16px;border:1px solid var(--border-color);border-radius:var(--btn-radius);
  background:var(--common-widget-bg)}
.agpanel + .agpanel{margin-top:16px}
.agph{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
.agpt{font-size:13px;font-weight:600;color:var(--primary-alt)}
.agpd{font-size:12px;line-height:1.4;color:var(--text-color-common-secondary);margin-top:4px}
.agphl{display:flex;align-items:flex-start;gap:12px}
.agphl obs-icon{flex:0 0 auto;margin-top:1px;color:var(--chart-indigo)}
/* per-task routing rows */
.agrt{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 0;
  border-bottom:1px solid var(--border-color)}
.agrt:last-child{border-bottom:0}
/* ⚠️ \`min-width:0\` — WITHOUT IT THIS ROW OVERFLOWS. A flex item defaults to
   \`min-width:auto\`, so the label refuses to shrink below its own text; the select is
   \`flex:0 0 200px\` and cannot shrink either, so on a narrow panel the pair is wider than the
   row and the select pushes out past the panel's edge. The longest labels here are "Runbook
   recommendations" and "Natural language queries". Reported 1 Sep 2026 as an alignment
   problem; I could not reproduce it at 1440 or 1800 in any option, but the defect is in the
   rule regardless — \`min-width:0\` + \`overflow:hidden\` is the fix either way. */
.agrt .n{display:inline-flex;align-items:center;gap:12px;font-size:12.5px;color:var(--page-text-color);
  min-width:0;flex:0 1 auto;white-space:nowrap}
/* ⚠️ THE LABEL NEEDS ITS OWN SPAN TO ELLIPSIS. \`overflow:hidden\` used to sit on \`.n\`, which is
   an \`inline-flex\` box whose label was a bare TEXT NODE — and \`text-overflow\` cannot act on an
   anonymous flex item, so it computed to \`clip\` and the label was cut MID-GLYPH wherever the row
   was tight ("Alert summarizatior", "Knowledge searct"). Reported 2 Sep 2026.
   ⚠️ It only bites at narrow widths — at 1600px the row is 686px and nothing truncates, which is
   why a measurement there reported \`CLIPPED=false\` on a genuinely broken rule. Test this one at
   1280, where the rail and help card have taken their share.
   ⚠️ \`min-width:0\` on BOTH: the span cannot shrink below its text without it, and neither can
   \`.n\` — a flex item's default \`min-width:auto\` is what stops either from yielding. */
.agrt .n>.t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.agrt .n obs-icon{color:var(--neutral-light)}
/* ⚠️ ONE LEFT RHYTHM FOR THE PANEL. The header's title and the rows' labels have to start at
   the same x or the block reads as two unrelated lists. The header icon is 17px on \`.agphl\`'s
   12px gap (text at +29); the rows were 14px icons on an 8px gap (text at +22) — a 7px stagger,
   repeated down seven rows, which is what reads as "not aligned". Both icons now sit in a fixed
   17px slot on the same 12px gap, so each glyph KEEPS ITS OWN SIZE (the header's is deliberately
   the louder mark) and only the TEXT is brought into line. The icons share a left edge.
   ⚠️ Size the slot with \`flex\`, not \`width\` — \`obs-icon\` is a flex item here and its own
   \`size\` attribute sets its width, which a plain \`width\` would fight. */
.agrt .n>obs-icon,.agphl>obs-icon{flex:0 0 17px}
/* ⚠️ 240px IS \`obs-select\`'s OWN INTRINSIC WIDTH — DO NOT NARROW IT. Its shadow root's \`.sel\`
   div is hardcoded to 240px and ignores a narrower host, so at \`width:200px\` the HOST box
   measured 837..1037 while the control PAINTED 837..1077 — 40px outside its own box, straight
   over the panel's right border. \`getBoundingClientRect()\` on the host reports the honest 200px
   and every geometry assertion passed; only counting painted pixels in the screenshot found it
   (seven 30px runs at x=1076, one per row). This is a shipped v0.1.166 defect — see
   \`_ds/README.md\`. Matching the host to 240px makes box and paint agree exactly. */
.agrt obs-select{width:240px;flex:0 0 240px}
.agrtw{margin-top:12px;border-top:1px solid var(--border-color);padding-top:8px}
/* consent */
.agchips{display:flex;flex-wrap:wrap;gap:8px}
/* a hairline-separated section INSIDE a panel */
.agpf{margin-top:12px;padding-top:12px;border-top:1px solid var(--border-color)}
/* the provider's privacy link — part of "what is transmitted", so it sits with the chips rather
   than behind a rule of its own */
.agpll{margin-top:12px}
.agcons{display:flex;flex-direction:column;gap:12px}
/* the live connection test's stage list */
.agstg{display:flex;align-items:center;gap:8px;font-size:12.5px;padding:4px 0;
  color:var(--text-color-common-secondary)}
/* ⚠️ ONE LINE, NOT FOUR (request, 2 Sep 2026: "show only single line and the text will be shown
   and replaced, a loader will load"). Each of the four named stages had its own row, and after a
   ~2s test all four stayed on screen ticked — a permanent four-line list restating work that is
   over, directly above a banner that already reports the outcome. The stage NAME is kept, because
   that is what makes the wait informative rather than a bare spinner; only the ACCUMULATION is
   gone. One row: a spinner and the current stage, swapped in place as each lands.
   ⚠️ The spinner is \`.stspin\`, the settings module's own — the DS ships NO loader/spinner
   component (\`search_components\` for "spinner loading indicator progress" returns Severity and
   Steps and nothing else), so this is built from what the file already has rather than drawn. It
   colours from \`currentColor\`, which is why the colour is set on the element and not a border. */
.agstgl{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:12.5px;
  color:var(--page-text-color)}
.agstgl .stspin{flex:0 0 13px;color:var(--neutral-light)}
/* ⚠️ KEPT AND UNREFERENCED from here down — the four-row stage list the single line replaced.
   It was the reference's own shape, so it is parked rather than deleted (house pattern). Note
   \`.agstg.now\` was added earlier the SAME DAY to mark the running stage; the single line makes
   the distinction moot, since the only stage shown is the running one. */
.agstgs{margin-top:12px}
.agstg.done{color:var(--page-text-color)}
/* the stage currently in flight — brought up to full text colour with a breathing ring, so it
   is distinguishable from the stages that have not started. Deliberately NEUTRAL chrome: green
   already means done, and \`--primary-color\` is the DS's Ant-form-control cyan, which would be
   off-purpose on a progress mark. */
.agstg.now{color:var(--page-text-color)}
.agstg.now .p{border-color:var(--neutral-light);animation:agpulse 1.1s ease-in-out infinite}
@keyframes agpulse{0%,100%{opacity:1}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){ .agstg.now .p{animation:none} }
.agstg obs-icon{flex:0 0 auto;color:var(--secondary-green)}
.agstg .p{flex:0 0 14px;width:14px;height:14px;border-radius:50%;
  border:1.5px solid var(--border-color)}
/* done */
.agdone{display:flex;flex-direction:column;align-items:center;text-align:center;padding:24px 0}
.agdmk{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;margin-bottom:16px;
  color:var(--secondary-green);background:var(--severity-clear-lighter)}
.agdt{margin:0 0 8px;font-size:19px;font-weight:600;color:var(--primary-alt)}
.agdp{margin:0 0 24px;font-size:12.8px;line-height:1.55;color:var(--text-color-common-secondary);max-width:420px}
.agsum{width:min(440px,100%);text-align:left}

/* ── usage & health, on a configured provider ─────────────────────────────────────────────
   Reference re-supplied 1 Sep 2026: four figure tiles over three trend cards, both as grids
   that reflow. ⚠️ IT WAS BRIEFLY AN \`obs-table\` AND THAT WAS A MISREAD OF "grid" — "grid view"
   here means THIS: a grid of cards. The table version is gone; don't rebuild it.
   ⚠️ THIS IS THE SCREEN'S ONE DECLARED \`list_gaps\` GAP. \`list_gaps\` names charts and stat tiles
   as things the DS does not ship, and \`search_components\` returns no card component — so the
   tiles and chart frames are LAYOUT, and the three SVGs are the archetype gap itself. They
   carry \`class="agchart"\` so the conformance checker resolves them as \`chart\` and
   \`--declare chart\` (\`_verify/ds-gaps.json\`) covers them; unclassed they fall back to a generic
   \`graphic\` that no declaration matches, and the run fails on a gap that WAS declared.
   ⚠️ SERIES COLOURS ARE TOKENS, never \`--primary\`. A chart in the brand navy would say
   "primary action" in a shape you cannot press.
   ⚠️ Spacing on the DS structural scale (@padding-lg 24 · @padding-md 16 · @padding-sm 12). */
/* ── usage & health: a GRID that expands to the widget ────────────────────────────────────
   Annotation, 1 Sep 2026: "convert in grid with expand and collapes" — and earlier, "my idea
   is to show the grid view and i expand and collapse to show widget". So the grid is the
   resting state and the chart is what a row opens.
   ⚠️ IT IS \`obs-table expandable\` — A DS CAPABILITY, NOT A HAND-BUILT ACCORDION. Neither the
   component registry nor \`search_components\` mentions it; it was read out of the shipped
   element (v0.1.166): \`expandable\` renders an \`exp-col\` chevron per row, and an opened row
   becomes \`<tr class="row-detail">\` whose cell is filled from
   \`innerHTML: row.detail || "No detail"\`, spanning every column. The element also carries an
   undocumented \`sparkline\` cell type (an 80×18 polyline). Both are worth reporting upstream.
   ⚠️ THE DETAIL RENDERS INSIDE THE COMPONENT'S SHADOW ROOT, so this stylesheet CANNOT reach
   it — the old \`.agcht\` / \`.agchh\` rules would not have applied in there. The detail markup is
   styled INLINE with \`var(--token)\` values, which DO inherit across the boundary. That is the
   one place on this screen where inline styles are correct; do not "tidy" them into classes.
   ⚠️ THE SEVEN-CELL RULED FRAME IS GONE, and its rules with it — \`.aggrid\`, \`.agkpi\`, \`.agkl\`,
   \`.agkv\`, \`.agcht\`, \`.agchh\` no longer have anything carrying them. A rule outliving what it
   supported is the trap this file records at \`.agemt\`. */
/* ⚠️ KEPT AND UNREFERENCED — the "Usage & health" heading it styled was removed on request
   (2 Sep 2026) and this is the only thing that ever used it. Parked rather than deleted, the
   house pattern, so a second section on this page has a label to reuse. */
.agsec{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:var(--neutral-regular);margin:24px 0 12px}
/* ⚠️ 16px, NOT 4px. The 4 was the remainder of a gap the heading's own \`margin-bottom:12px\`
   was paying for; with the heading gone the table sat almost flush under the toolbar. 16px is
   \`@padding-md\` on the DS structural scale — the toolbar and its table are one unit in the
   \`list-view\` recipe, so this is a gap, not the 24px section break the heading used to draw. */
.agpage obs-table{display:block;margin-top:16px}



/* ⚠️ \`padding-right\` PUTS THE GAP INSIDE THE BORDER BOX, WHICH IS THE WHOLE POINT. The rule is
   this element's \`border-top\`, so it spans the padding too — the line runs the full width of the
   pane, right up to the help card's divider, while the button stops 24px short of it and keeps
   the breathing room every other control has. Setting a right MARGIN instead would shorten the
   line by the same 24px, which is the thing the request asked to fix. */
.agff{display:flex;align-items:center;gap:8px;margin-top:24px;padding:16px 24px 0 0;
  border-top:1px solid var(--border-color)}
.agff .sp{margin-right:auto}
/* ⚠️ THIS REPLACES AN INLINE \`style="margin:0"\` THAT WAS SILENTLY CANCELLING THE RULE ABOVE.
   The caption is the \`.sp\` spacer, and an inline \`margin:0\` beats a stylesheet \`margin-right:auto\`
   — so the footer's buttons were never pushed to the right edge; they sat immediately after the
   caption text, wherever that happened to end (measured 323px short of the pane edge). The inline
   style existed only to cancel \`.agtn\`'s own \`margin-top:12px\`; doing that here, scoped to the
   footer, cancels the top margin and leaves the auto margin alive. */
.agff .agtn{margin-top:0}

/* ── the help card ────────────────────────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026 (the product's "RUM Instrumentation Help Card"): a right-hand
   column with an accent-barred title and collapsible sections, the first open.
   ⚠️ IT IS A COMPOSITION, NOT A DS COMPONENT. \`search_components\` returns no accordion, card
   or collapse, and no recipe covers it — so this is layout plus a raw \`<button>\` per section
   header. The conformance checker treats a raw control as an ADVISORY, not a breach, for
   exactly this reason ("raw is expected when composing an unshipped organism"); it is not a
   fabricated look-alike of something the DS ships.
   ⚠️ THE COLUMN HIDES BELOW 1400px rather than squeezing the form. Rail 230 + form 720 + help
   380 + gaps needs the room; under that the form is what matters.
   ⚠️ Spacing on the DS structural scale (@padding-lg 24 · @padding-md 16 · @padding-sm 12). */
/* ⚠️ A FULL-HEIGHT RULE ON ITS LEFT EDGE (request, 1 Sep 2026: "add line like…", with the
   product's "Supported Framework" panel as the reference). The column floated against the form
   with nothing dividing them; the product separates that panel with a vertical rule running the
   whole height, which is the same job \`obs-side-menu\` does for the rail on the other side.
   ⚠️ \`.agcfg\` is already \`align-items:stretch\`, so the column takes the row's height — but the
   ROW is only as tall as its tallest child, so on a short step the rule stopped early. The
   container carries a min-height and the columns stretch into it, which is what makes the line
   run the full panel height as the reference shows. */
/* ⚠️ THE CONFIGURE DRAWER IS WIDE, AND ITS PARKED OFFSET MUST MOVE WITH THE WIDTH — the recorded
   \`#drawer-layout\` lesson: an id-scoped width on a \`.sdrawer\` needs its own \`right\` too, or the
   panel sits partly on screen while closed. It holds a provider rail beside a 720px form, so
   \`min(1040px, 92vw)\`.
   ⚠️ \`#drawer-agcfg .dr-b\` drops \`.dr-b\`'s own padding and gap — \`#agPage\` inside it brings the
   screen's own spacing, and two paddings put the content 30px from the drawer's edge.
   ⚠️ THE HELP CARD IS IN THE DRAWER (request + reference, 2 Sep 2026 — the product's own
   "Application Registeration" panel, which is a wide drawer holding a rail, a form AND a help
   card). I had hidden it here and said three columns would not fit a side panel; the reference
   shows the product doing exactly that, so the drawer got wider instead of the card getting cut.
   ⚠️ 1440px FITS ALL THREE: rail 220 + form 720 + help 380 = 1320. Below ~1400px viewport the
   card takes itself out through the \`@media (max-width:1400px)\` rule it already had, and rail +
   form (940) fit what is left — so the two rules hand over cleanly with nothing new to keep in
   step. */
#agCfgScrim{position:fixed;inset:0;z-index:89;background:var(--scrim);
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
  opacity:0;pointer-events:none;transition:opacity .18s}
#agCfgScrim.on{opacity:1;pointer-events:auto}
/* ⚠️ EVERYTHING EXCEPT THE RAIL (request, 3 Sep 2026: "not full screen sorry but the background
   sidebar will be show"). Three widths were tried in one day and this is the settled one — it was
   \`min(1440px,96vw)\` (a panel beside the app, with a strip of page showing), then briefly the
   full viewport (which covered the rail), and now the full width MINUS the sidebar, so the app's
   navigation stays visible behind the scrim while the drawer is everything else.
   ⚠️ THE RAIL IS DIMMED, NOT INTERACTIVE. \`#agCfgScrim\` is \`inset:0\` at z-index 89 and \`.sidebar\`
   is z-index 60, so the scrim still covers the rail — it shows through blurred, and no pointer
   reaches it. That is also what keeps the width stable: the rail cannot hover-expand underneath
   an open drawer, so the number measured on open stays true.
   ⚠️ \`calc(100% - var(--rail-w))\` IS THE FALLBACK, NOT THE ANSWER — \`body.pinned\` widens the rail
   to \`--rail-w-open\`, and this token is only the collapsed width. \`agCfgSize()\` sets the real one
   from \`railWidth()\`, which is the function \`.shell\` and the flyout already trust for exactly
   this question.
   ⚠️ THE PARKED OFFSET STAYS \`-100%\` — wider than any width this can take, so the panel is fully
   off screen while closed whatever the rail is doing (an id-scoped width needs its own parked
   \`right\`, the recorded \`#drawer-layout\` lesson).
   ⚠️ \`@media (max-width:1400px)\` ON THE HELP CARD IS STILL RIGHT: the drawer is now the viewport
   less a 64–190px rail, so the viewport still predicts it to within one rail width, and the card
   only has to go when three columns genuinely stop fitting. A drawer sized to anything narrower
   than this would need a container query instead (tried on 3 Sep, reverted with its width). */
#drawer-agcfg{width:calc(100% - var(--rail-w));right:-100%}
#drawer-agcfg.on{right:0}
#drawer-agcfg .dr-b{padding:0;gap:0}
/* ⚠️ THE 24px TOP GUTTER IS INSIDE EACH COLUMN, NOT ON \`#agPage\` (two requests, 3 Sep 2026:
   "add more spacing", then — with the gutter on the page — "the line is attached", pointing at
   the help card's rule meeting its own title). The first answer padded the page: the header rule
   ended at y=51 and the rail's first row, "Enter credentials" and the help card's title all began
   at y=51, so one padding on the page moved all three. But \`.aghelp\` draws its own \`border-left\`
   and the side menu draws its own \`border-right\`, so both vertical rules moved down WITH the
   content and started 24px below the header, mid-air, flush with the first line of text — a
   panel divider that begins where the title begins reads as attached to the title.
   Now the COLUMNS stay full height (both rules meet the header rule at y=51) and the CONTENT
   inside each starts 24px down: \`.agcfgm\` and \`.aghelp\` are padded, and the rail gets a 24px
   spacer in \`obs-side-menu\`'s \`logo\` slot — its documented top-of-panel slot ("adds no height
   when unused"), rendered INSIDE its \`.sm\`, so the panel's own background and rule run from the
   header down while the rows start under the spacer. Page CSS cannot pad \`.rows\` (shadow DOM),
   and padding the HOST moves the rule too — the slot is the component's only hook above its rows.
   The spacer is \`.agcfgsp\` in \`agCfgHTML\`; it is sized ONLY here, so on any other surface it is
   a zero-height div.
   ⚠️ THE RAIL'S PANEL IS NOT THE DRAWER'S COLOUR (\`--side-menu-bg\`: #fff on a #f7f9fc drawer in
   light, #07101f on #0a1322 in dark), which is the other reason the page-level padding was wrong:
   it left a 24px strip of drawer above a panel of a different colour.
   24px = \`@padding-lg\`, the gutter \`.agcfgm\` and \`.aghelp\` already keep on their left edges. */
#drawer-agcfg .agcfgm{padding-top:24px}
#drawer-agcfg .agcfgsp{height:24px}
/* ⚠️ \`flex:0 0 auto\` IS WHAT MAKES THE DRAWER SCROLL. \`.dr-b\` is a flex COLUMN, so its child
   defaults to \`flex-shrink:1\` and \`.agcfg\` was squashed to the body's height — the content then
   spilled out with no scrollbar (measured: scrollHeight 756 === clientHeight 756 while content
   ran to y=1466) and the footer sat stranded at y=700 with form behind it. Refusing to shrink is
   what lets the body's own \`overflow:auto\` see something to scroll.
   ⚠️ Removing \`min-height:100%\` alone did NOT fix it — that was the second guess and it was
   wrong; the shrink is the cause. */
#drawer-agcfg .dr-b > .agcfg{flex:0 0 auto}
/* ⚠️ THE DRAWER HAS TO PAY FOR ITS OWN GUTTERS. On the full page this screen sat inside
   \`.stmain\`'s 16px padding, so the columns never touched an edge. In the drawer \`.dr-b\` is
   \`padding:0\` — deliberately, so \`#agPage\` owns its spacing — and \`.aghelp\` only ever had
   \`padding-left:24px\`, so the help card's text ran flush to the drawer's right edge with no
   gutter at all (2 Sep 2026: "it is not aligned"). 24px on the right mirrors its left.
   ⚠️ \`box-sizing:border-box\` means the padding comes OUT of the 420px, not on top of it — the
   column stays 420 and its text measure becomes 372. */
#drawer-agcfg .aghelp{padding-top:24px;padding-right:24px}
/* the rail and the form get the same treatment on their own outer edges */
#drawer-agcfg .agcfgn{padding-left:8px}
/* ⚠️ NO \`min-height:100%\` HERE — it stranded the footer. With it, \`.agcfg\` was pinned to the
   drawer body's height, so the tall flattened form overflowed WITHOUT the body scrolling
   (measured: \`.dr-b\` scrollHeight 756 === clientHeight 756 while content ran to y=1466) and
   \`.agff\` sat at y=700, halfway up the panel with content behind it. Letting the content size
   itself is what lets \`.dr-b\`'s own \`overflow:auto\` do its job.
   ⚠️ \`align-items:stretch\` on \`.agcfg\` still gives the three columns equal height, so the help
   card's left border still runs the full length of the content. */
#drawer-agcfg .agcfg{align-items:stretch}
/* ⚠️ 420px, AND EVERY SECTION OPEN BY DEFAULT (request, 2 Sep 2026: "the help card is not
   proper visualization — use more space, better view"). Two things were wrong at once: the
   column was 380px so every bullet wrapped to two or three lines, and only the first section
   was expanded — so the card filled the top third of a 900px column and left the rest empty.
   Widening it and opening all three uses the space that was already there, and nothing is a
   click away any more.
   ⚠️ THE FORM DOES NOT LOSE ANYTHING. \`.agcfgm\` takes the remaining width but \`.agform\` is
   capped at \`max-width:720px\`, so the 40px comes out of that column's slack, not out of the
   fields — measured: form 829 → 789, \`.agform\` still 720. */
.aghelp{flex:0 0 420px;width:420px;min-width:0;padding:0 0 24px 24px;
  border-left:1px solid var(--border-color)}
@media (max-width:1400px){ .aghelp{display:none} }
.agcfg.nohelp .aghelp{display:none}
.aghct{display:flex;align-items:center;gap:12px;margin-bottom:16px}
/* the reference leads the title with a short accent bar */
.aghct .bar{flex:0 0 3px;width:3px;height:18px;border-radius:2px;background:var(--primary)}
.aghct .t{font-size:14px;font-weight:600;color:var(--primary-alt)}
.aghs{border:1px solid var(--border-color);border-radius:var(--btn-radius);
  background:var(--common-widget-bg);margin-bottom:12px;overflow:hidden}
.aghch{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;
  padding:12px 16px;background:transparent;border:0;cursor:pointer;text-align:left;
  font-family:inherit;font-size:12.5px;font-weight:600;line-height:1.3;color:var(--primary-alt)}
.aghch:hover{background:var(--nav-hover-bg)}
.aghch obs-icon{flex:0 0 auto;color:var(--neutral-light);transition:transform .15s ease}
.aghs.on .aghch obs-icon{transform:rotate(180deg)}
/* ⚠️ 1.65 LINE-HEIGHT AND 10px BETWEEN BULLETS — the recorded \`.aiab li\` rule, in a third
   place: the gap BETWEEN points must beat the leading INSIDE a wrapped one, or a two-line bullet
   reads as two bullets. At 12.5px/1.65 a wrapped line carries ~8px, so the margin is 10. */
.aghcb{padding:0 16px 16px;font-size:12.5px;line-height:1.65;
  color:var(--text-color-common-secondary)}
/* ⚠️ 16px, NOT the 18px this opened at — @padding-md on the DS structural scale. The
   conformance checker caught it as the screen's one off-scale value (layout 98). */
.aghcb ul{margin:0;padding-left:18px}
.aghcb li{margin-bottom:10px}
.aghcb li:last-child{margin-bottom:0}
.aghcb b{color:var(--primary-alt);font-weight:600}




/* ══ THE PROVIDER-CONFIG SCREEN SCROLLS ITS BODY, NOT ITSELF (request, 2 Sep 2026: "it will be
   fix this in bottom and the scroll only <body>") ═══════════════════════════════════════════
   The wizard's action bar — the KMS caption, Run test, Accept & enable AI — scrolled away with
   the form, so on the Model-selection step (three radios, a routing table of seven rows and a
   consent panel) the only way to reach the primary button was to scroll to the very bottom.
   The bar is the step's commit; it has to be on screen the whole time.

   ⚠️ THE SCROLLER WAS \`#stMain\`, TWO ANCESTORS UP. Pinning the footer is not a footer change —
   nothing inside \`.agcfgm\` can pin while an ancestor is the thing that scrolls. So \`#stMain\`
   stops scrolling FOR THIS SCREEN ONLY (\`:has(.agcfg)\`, the same mechanism \`body:has(...)\`
   already uses in this repo) and the height flows down to a bounded \`.agfbody\`.
   ⚠️ EVERY LINK IN THE CHAIN NEEDS \`min-height:0\`. A flex child's default \`min-height:auto\` is
   its content, so any one of \`.agcfg\` / \`.agcfgm\` / \`.agform\` left at \`auto\` re-grows the
   column past the viewport and the footer leaves the screen again — the scrollbar just moves.
   ⚠️ \`.agcfg\`'s \`min-height:520px\` HAD TO GO with it: a floor taller than the viewport is the
   same bug on a short screen, except the overflow is now \`hidden\` and the content unreachable.
   ⚠️ THE STEPPER STAYS PINNED TOO. It sits in \`.agform\` above \`.agfbody\`, so only the body
   moves — which is what "the scroll only" asks for, and the rail is the step indicator: it is
   navigation, not content.
   ⚠️ \`.agcfgm\`'s 56px of bottom padding is KEPT and is still load-bearing — it is what holds
   the now-pinned footer clear of the fixed variant-switcher pill. See its own note above.
   ⚠️ The two side columns get their own scrollers for the same reason: once the row is bounded,
   a long provider list or a long help card would otherwise be clipped with no way to reach it. */
#stMain:has(.agcfg){overflow:hidden}
.agcfg{min-height:0}
.agcfgn,.aghelp{min-height:0;overflow-y:auto;scrollbar-width:thin}
.agcfgm{min-height:0}
.agform{flex:1 1 auto;min-height:0}
.agfbody{flex:1 1 auto;min-height:0;overflow-y:auto;scrollbar-width:thin}
.agff{flex:0 0 auto}

/* ══ THE CONFIG SCREEN'S SCROLLBAR AND ITS FOOTER WIDTH (request, 2 Sep 2026) ═══════════════
   Both are fallout from pinning the footer earlier the same day.

   ⚠️ THE SCROLLBAR IS HIDDEN, NOT THE SCROLLING. \`overflow-y:auto\` stays — \`overflow:hidden\`
   would remove the bar by removing the ability to reach the rest of the form. This is the same
   pair the AI panel's thinking trail uses. The trade-off is real and worth stating: the bar was
   the only thing announcing that the area scrolls, so the affordance is now the content being
   visibly cut off at the fold. Acceptable here because the footer is pinned in view, which is
   what tells you the form continues above it.
   ⚠️ \`scrollbar-width\` AND the \`::-webkit-scrollbar\` rule are both needed — the first is the
   standard property, the second is what Chrome actually honours today.

   ⚠️ THE FOOTER SPANS ITS OWN COLUMN — NOT THE FORM (720), AND NOT THE WHOLE PANE (1524).
   Request, 2 Sep 2026: "show proper full width". This rule has now been wrong in BOTH directions
   and the history is worth keeping, because the obvious fix each time was the other extreme:

     1524  it started as a sibling of \`.agform\` with no cap, so the commit bar ran 470px past
           the form it commits and its buttons sat in empty space beside the help card.
      720  capping it to \`.agform\`'s \`max-width\` fixed that, and overshot: 720 is a readable
           measure for FIELDS, but the footer is the SCREEN's action bar, so its rule stopped
           150px short of the help card's divider and read as belonging to the inputs.
     1204  the middle column's own content edge — measured \`.agcfgm\` 310..1204 against the help
           card at 1204..1584. The rule now meets that divider exactly.

   ⚠️ SO THERE IS NO \`max-width\` HERE AT ALL. \`.agff\` is a child of \`.agcfgm\`, so with the cap
   removed it simply fills that column — the width is DERIVED from the layout rather than being
   a third hardcoded number that has to be re-guessed the next time the pane changes.
   ⚠️ \`padding-right:24px\` COMES BACK. The rule IS \`.agff\`'s \`border-top\` and a border spans the
   PADDING box, so the line reaches the divider at 1204 while the buttons stop 24px short of it,
   at 1180 — the same inset every other control on this screen has. A \`margin-right\` would shorten
   the LINE by that 24px, which is the thing the request asked to fix. */
.agfbody{scrollbar-width:none}
.agfbody::-webkit-scrollbar{display:none}
.agff{padding-right:24px}


/* ═══ PRODUCT LICENSE (\`lic*\`) — Settings › My Account › License, 7 Sep 2026 ═══════════════
   Built on the DS elements (see the block's header in \`_settings-module.js\`). Since the second
   pass the same day EVERY region is a DS element, so this sheet is LAYOUT ONLY: grids and gaps,
   the \`display:block\` an unknown-element host needs, the body that finishes the frame an
   \`obs-toolbar variant="widget"\` starts, and the text styles of the two toolbar titles. The
   first build's edition card, ring, term bar, legend rules and code box are gone with the
   markup they styled.
   ⚠️ The DS tokens reach this page through the scoped token block above: \`#licPage\`, \`#licHist\`
   and \`#licHistF\` are listed beside \`#agPage\` in all three of its selectors. Anything this page
   renders OUTSIDE those subtrees inherits none of it.
   ⚠️ \`#licHist\` / \`#licHistF\` are the body and the footer of the HOUSE drawer (\`stcDrOpen\`),
   which is Compliance's element — the drawer chrome is its; only what sits inside is this page's.
   ⚠️ Names grepped free before use: no \`.lic*\` class, \`lic*\` function or \`LIC_*\` constant
   existed in \`index.html\` or this module.
   ⚠️ Spacing is on the DS structural scale (16 = @padding-md, 12 = @padding-sm, 8 = @padding-xs);
   the 20px above a section toolbar is 16 + the 4px the toolbar's own row carries. */
/* ── THE ACCENT IS THE PROTOTYPE'S TEAL, NOT THE DS NAVY (request, 8 Sep 2026) ────────────────
   The DS has no interaction accent distinct from \`--primary\`, and on this page \`--primary\` was
   painting the active tab, the selected range segment, every bar cell, every link and both primary
   buttons in the navy/off-white pair (#111c2c light · #e3e8f2 dark) — nothing for the eye to land
   on, and unlike every other surface in this prototype, which uses the live console's teal. The
   root CLAUDE.md records this exact gap and its answer: declare the departure ONCE in the token
   scope rather than sprinkle literals. \`--primary\` is re-pointed for the License subtree only —
   the page, the drawer body and the drawer footer — so the DS's navy is untouched everywhere else.
   ⚠️ TWO VALUES, ONE PER THEME, the prototype's own \`--teal\` / \`--teal-dim\` pair: #14b8a6 on the
   dark canvas, #0e8578 on white — obs-button paints its primary label in \`--page-background-color\`,
   and white on #14b8a6 is 2.5:1 where white on #0e8578 clears 4:1. ⚠️ \`var(--teal)\` cannot be
   used here: the re-point block above already binds \`--teal\` to \`--primary\` inside this scope,
   so the reference would be circular.
   ⚠️ \`--primary-alt\` (titles, the edition name) and \`--page-text-color\` are NOT touched — those
   are ink, and the ask was the accent. The selected range segment reads \`--radio-btn-box-selected-bg\`,
   a literal in the scoped block, so it is re-bound to \`--primary\` to follow. */
/* ⚠️ THE ACCENT IS TEAL ACROSS THE WHOLE DS SCOPE, NOT JUST LICENSE (request, 8 Sep 2026:
   "replace #172336 / #cad3e2 with #14b8a6 EVERYWHERE the active colour uses the primary colour").
   The scoped DS token block (\`#agPage,#licPage,#licHist,#licHistF,#licHistDr\`) is the ONLY place in this
   prototype that paints active/primary chrome in the DS navy pair — every other surface already
   uses this teal. So \`--primary\` is re-pointed for all four ids: the Agentic AI page's active
   tab, its "Configure AI provider" primary button and its selected side-menu row now match the
   License page and the rest of the console. The AI mark stays \`--chart-indigo\` (violet) — that is
   the AI accent, not an active/primary state, and the request named the primary colour only.
   ⚠️ THIS OVERRIDES the earlier "brand primary is navy, NOT teal" note on the Agentic AI screen —
   a direct, repeated request; the divergence is declared here rather than reverted. */
/* ⚠️ SUPERSEDED 15 Sep 2026 — THE ACCENT IS #CAD3E2 / #1D2A3E NOW (request: "replace #14b8a6 with #CAD3E2" across the
   Settings module). \`--primary\` reads the DS's own \`--primary-alt\`, which is exactly that pair, so no hex is pasted; the
   two notes above are the record of the teal it replaces. The hover mixes toward the page background, because in dark
   \`--page-text-color\` IS #cad3e2 and mixing toward it changed nothing. */
#agPage,#licPage,#licHist,#licHistF,#licHistDr{--primary:var(--primary-alt);
  /* obs-button's primary reads its OWN pair, not --primary (registry tokensUsed: --primary-button-bg /
     --primary-button-text) — measured: the buttons stayed white after --primary alone moved */
  --primary-button-bg:var(--primary);--primary-button-text:var(--page-background-color);
  --primary-button-hover-bg:color-mix(in srgb, var(--primary) 84%, var(--page-background-color));--primary-button-hover-text:var(--page-background-color);
  --radio-btn-box-selected-bg:var(--primary);--radio-btn-box-selected-text-color:var(--page-background-color)}
/* ⚠️ THE LIGHT RULE REPEATS THE BUTTON AND RADIO PAIRS. The scoped token block declares them under
   \`html[data-theme="light"] #licPage\` (1,1,1), which outranks the (1,0,0) rule above — measured:
   with only \`--primary\` here, light-theme buttons stayed navy while dark went teal. */
html[data-theme="light"] #agPage,html[data-theme="light"] #licPage,html[data-theme="light"] #licHist,html[data-theme="light"] #licHistF,html[data-theme="light"] #licHistDr{--primary:var(--primary-alt);
  --primary-button-bg:var(--primary);--primary-button-text:var(--page-background-color);
  --primary-button-hover-bg:color-mix(in srgb, var(--primary) 84%, var(--page-background-color));--primary-button-hover-text:var(--page-background-color);
  --radio-btn-box-selected-bg:var(--primary);--radio-btn-box-selected-text-color:var(--page-background-color)}
/* ⚠️ THE TABLE'S BAR CELL PAINTS ITS FILL IN \`--primary-alt\` (measured in the bundle:
   \`background: var(--primary-alt)\`, \`--severity-major\` past 70%) — which is #cad3e2 in dark, the
   very swatch the request named, on a #172336 track. \`--primary-alt\` is also every title on the
   page, so it is re-bound to the accent ON THE TABLES ONLY; the nested by-type table inherits it
   through the outer table's shadow tree. Titles stay ink. The Agentic AI usage table has no bar
   cell, so the rule is inert there, but it is scoped to both for parity. */
.licpage obs-table,.agpage obs-table{--primary-alt:var(--primary)}

/* ⚠️ EVERY CARD ON THE LICENSE PAGE IS #0B1627 IN DARK, IN ALL FIVE OPTIONS (request, 14 Sep 2026:
   "for all option 1 to 5 the all card background … #0B1627"). That hex is the DS's
   \`--widget-background\` (#fff in light), and every card here is painted from
   \`--common-widget-bg\` (#172336 dark) — Option 1's widgets and the obs-toolbar widget headers above
   them (the bundle's \`.tb.v-widget\` reads that token), the EPS tiles, Option 3's two cards,
   Option 4's card and the base under Option 5's tint. So the token is re-pointed ONCE, here, on
   #licPage, rather than restyling each card. Option 2's cards name \`--widget-background\` directly.
   ⚠️ SCOPED TO #licPage — the Agentic AI page and the History drawer (portalled to <body>) keep
   their own. The only other readers in the bundle are obs-* popovers, which then open on the same
   surface as the card they belong to.
   ⚠️ THE LIGHT RULE IS REPEATED for the same (1,1,1)-outranks-(1,0,0) reason as the accent above;
   both tokens are #fff there, so light is unchanged.
   ⚠️ \`--lic5-surface\` is Option 5's borderless card fill: exactly \`--widget-background\` in dark, as
   asked; a 3% text wash over it in light, where a borderless white card on the white pane has no
   edge. It is a TOKEN rather than \`color-mix(… 0% …)\`: a zero mix paints the same colour but
   serialises as \`color(srgb …)\`, which no longer reads as the colour it is. */
#licPage{--common-widget-bg:var(--widget-background);--lic5-surface:var(--widget-background)}
html[data-theme="light"] #licPage{--common-widget-bg:var(--widget-background);
  --lic5-surface:color-mix(in srgb, var(--page-text-color) 3%, var(--widget-background))}

.licpage{flex:0 0 auto;min-width:0}
.lichead obs-page-header{display:block;--page-header-padding:8px 8px 4px}
.lichmk{display:grid;place-items:center;width:26px;height:26px;color:var(--primary-alt)}
.lichact{display:inline-flex;align-items:center;gap:8px}
.lictabs{margin:4px 0 0}
.lictabs obs-tabs{display:block}
/* \` > obs-tabs > \` on purpose (16 Sep 2026): as a bare descendant \`[slot]\` it also matched every obs-toolbar title carrying
   slot="start" inside a pane, gave it 16px of top padding, and sat each section title ~8px below the text on its right
   ("Dynamic EPS · allocation by signal" under "allocated vs live ingested"). Only the two tab PANES are meant here. */
.lictabs > obs-tabs > [slot]{display:block;padding-top:16px}
/* every DS host this page places is an unknown element to the browser, i.e. \`display:inline\`
   until told otherwise — the recorded \`obs-radio\` "phantom gap" lesson */
.licpage obs-key-value,.licpage obs-metric-list,.licpage obs-table,.licpage obs-toolbar{display:block}

/* ── the overview widgets: the same widget frame the EPS tiles use ───────────────────────── */
.licwids{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:stretch}
.licwid{display:flex;flex-direction:column;min-width:0}
.licwid obs-toolbar{display:block}
.licwidb{flex:1 1 auto;display:flex;flex-direction:column;gap:12px;padding:14px 16px 16px}
/* the edition name is the one piece of page-level type: --primary-alt is the DS heading colour */
/* ⚠️ KEPT AND UNREFERENCED since 12 Sep 2026 — the big "Infinity ∞" display line. The edition
   name is an obs-key-value row now (see licOverviewHTML's header comment for why). Two lines to
   re-point if the display treatment is ever wanted back. */
.licedn{font-size:24px;font-weight:600;line-height:1.15;color:var(--primary-alt)}
.licedn span{color:var(--primary)}   /* the ∞ follows the accent, not the chart palette */
.licwidb obs-key-value,.licwidb obs-metric-list,.licwidb obs-table{display:block}
.licwidb .lichelp{margin:0}
.liclinks{display:flex;flex-direction:column;gap:6px}
.liclinks obs-link obs-icon{margin-left:4px;vertical-align:-1px}
.licwidb obs-button{align-self:flex-start;margin-top:auto}

/* ── section toolbars (Organisms/Toolbar, grid variant): title in \`start\`, hint + control after */
.lictb{margin:20px 0 8px}
.lictabs > obs-tabs > [slot] > .lictb:first-child{margin-top:0}   /* the pane's own 16px already separates it from the tab rule */
.licwids + .lictb{margin-top:24px}

/* ══ PRODUCT LICENSE · OPTION 2 — the licence card + the Monitored devices card ══════════════
   Third design for this option, 14 Sep 2026, from two supplied cards. It replaced the one-row
   licence strip (13 Sep), which is in git history.
   · the licence card — label row + status, the edition name with its tag, four label-over-value
     tiles, the term as a ring and two lines, and the activation code with Copy and a mailto.
   · Monitored devices — used of allotment, the bar, the agentless/agent split, the by-type counts,
     and History as an icon in its top-right (the drawer Option 1's grid row opens).
   ⚠️ WHAT IS A DS COMPONENT: every pill is obs-tag, every mark obs-icon, both rules obs-divider,
   the code field a read-only obs-input, Copy and the History icon obs-buttons, the mailto an obs-link.
   What is hand-built is LAYOUT on the spacing scale (tiles, rows, the by-type grid) — the DS has
   no label-above-value component (see Option 3's note) — plus the ring and the bar, which are the
   declared \`gauge\` / \`chart\` gaps. */
.licx,.licq{display:flex;flex-direction:column;gap:16px;padding:24px;min-width:0;margin-top:4px;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);background:var(--widget-background)}
/* ⚠️ OPTION 2's CARDS ARE \`--widget-background\` (request, 14 Sep 2026: "all card background …
   #0B1627"). That hex IS this DS token's dark value (#fff in light), so the request lands on a
   token rather than a pasted colour and the light theme keeps a white card. It was
   --common-widget-bg (#172336), one step lighter. All three Option 2 cards follow: the licence
   card, Monitored devices and Flow Sources. */
.licq{margin-top:16px}
/* ⚠️ \`--divider-my:0\`: obs-divider carries a 1rem margin of its own inside its shadow root, and
   the card's 16px gap already spaces it — both together put 48px round every rule. The variable
   is the element's own lever (read out of the bundle); a margin on the HOST cannot reach it. */
.licx obs-divider,.licq obs-divider{display:block;--divider-my:0}
.licqh,.licxch{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}
.licxh obs-tag,.licqh obs-tag{flex:0 0 auto}
/* the top row: identity on the left, the term on the right. ⚠️ \`flex-wrap\` so a narrow card
   drops the term under the identity instead of squeezing the title into an ellipsis. */
.licxtop{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px 24px;min-width:0}
/* ⚠️ \`flex-start\`, NOT \`center\` (request, 15 Sep 2026: "this 2 element make proper alignment in option 2",
   pointing at the term block and the Activation code button). Centred, the right cluster floated
   between the title and the description — its top 17px under the name row and its centre on neither
   line. Top-aligned, the ring's top edge IS the name row's top edge, so the card has one top line
   across both halves; inside .licxterm the ring, the two lines and the button still share a centre. */
.licxid{display:flex;flex-direction:column;gap:16px;min-width:0;flex:1 1 320px}
/* ⚠️ flex:1 1 320px — with the description in it the identity block's CONTENT width is the whole
   sentence, and .licxtop wraps, so the term and the Activation code button dropped onto their own
   line at the left. A 320px basis keeps both on the top row and lets the sentence wrap instead. */
/* ⚠️ THE PILL SITS RIGHT AFTER THE LABEL — \`flex-start\`, not the \`space-between\` this row
   shared with the devices card's header, where the pill still belongs at the edge */
.licxh{display:flex;align-items:center;gap:8px;min-width:0}
.licxl{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--neutral-regular)}
.licxt{display:flex;align-items:center;flex-wrap:wrap;gap:12px}
.licxtiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
/* ⚠️ THE TILE FILL IS A 5% WASH OF THE TEXT COLOUR, not a surface token. The card is
   --common-widget-bg; --neutral-lightest is the SAME #172336 in dark and --page-background-color
   the same #fff in light, so each would erase the tiles in one theme. A wash of --page-text-color
   lightens a dark card and darkens a light one, from one declaration. */
.licxtile{padding:12px;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 5%, transparent)}
.licxterm{display:flex;align-items:center;gap:12px;flex:0 0 auto}
.licxterm .licxact{flex:0 0 auto;margin-left:12px}
.licxst obs-tag{align-self:flex-start;margin-top:2px}   /* 24px off the term text: a control, not part of the reading */
.licxact obs-icon{margin-right:6px;vertical-align:-2px}
.licxcode{display:flex;flex-direction:column;gap:8px;min-width:0}
.licxct,.licqt{display:inline-flex;align-items:center;gap:8px;min-width:0;color:var(--neutral-regular)}
.licxct b,.licqt b{font-size:14px;font-weight:600;color:var(--page-text-color);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licxch obs-link obs-icon{margin-right:6px;vertical-align:-2px}
.licxhelp{margin:0;font-size:12.5px;color:var(--text-color-common-secondary)}
/* the edition description under the name (request, 15 Sep 2026) — the same sentence Option 4's card
   carries, from LIC_DATA.edition, in that card's own type: 13px secondary with the phrase in bold */
.licxdesc{margin:0;font-size:13px;line-height:1.6;color:var(--text-color-common-secondary)}
.licxdesc b{font-weight:600;color:var(--page-text-color)}
/* ⚠️ THE NAME AND THE EDITION CHIP TAKE THE LIVE PRODUCT'S LICENSE-HERO COLOURS (request, 15 Sep 2026:
   "change the color using" the live \`license-hero-name\` / \`license-hero-infinity\` / \`license-hero-chip\`
   elements). Read out of live build 10.0.x's own stylesheet (/css/styles.293200e0.css):
     .license-hero-name     linear-gradient(100deg, --license-accent, --license-violet), text-clipped
     .license-hero-infinity --license-accent at opacity .85
     .license-hero-chip     linear-gradient(135deg, --license-accent, --license-violet), --license-on-accent text
   ⚠️ A DECLARED DIVERGENCE FROM THE DS: these are the live product's \`--license-*\` tokens, NOT DS
   tokens. The DS chart palette has no blue at all, so there is no DS pair that is this gradient —
   the nearest, --chart-indigo, is only the violet end (and only in light). They are declared ONCE,
   under the live product's own names, scoped to \`.licx\` so nothing else on the page can read them;
   the sizes are unchanged (the request was the colour). The chip's 8px live radius is NOT copied —
   every box in this module is 4px. ⚠️ White on the dark theme's #7aa2f7 end is ~2.4:1: that is what
   the live chip ships (--license-on-accent is #fff in both themes), recorded rather than "fixed". */
.licx,.lic4:not(.lic5){--license-accent:#7aa2f7;--license-violet:#bb9af7;--license-on-accent:#fff}
/* Option 4, DARK theme: the same two hues, 15 points darker in lightness (request, 16 Sep 2026: "make this gradient colour
   darker"). The name still clears 4:1 on the card (4.01 / 4.04, where 3:1 is the bar for text this size), and white on the
   chip rises from ~2.4:1 to ~4.5:1. Option 2 keeps the live values; light theme keeps #2563eb / #7c3aed, already deep. */
.lic4:not(.lic5){--license-accent:#306ef3;--license-violet:#8c55f1}
html[data-theme="light"] .licx,html[data-theme="light"] .lic4:not(.lic5){--license-accent:#2563eb;--license-violet:#7c3aed}
/* Option 4's name row (see lic4HTML) — 8px under the eyebrow, where .lic4title's own margin put the name */
.lic4nr{margin-top:0}   /* it leads the section since the eyebrow went (15 Sep 2026); it sat 8px under that */
/* ⚠️ \`.lic4s obs-tag{align-self:flex-start}\` (the stacked tag's rule, later in the sheet at equal weight) would pin
   the chip 3px above the name's centre line — (0,2,1) puts it back on the row's centre */
.lic4 .lic4nr obs-tag{align-self:center}
/* ⚠️ \`-webkit-text-fill-color\` AS WELL AS \`color\` — without it background-clip:text paints the
   glyphs solid over the gradient (the recorded Ask-AI label trap) */
.licxname{background:linear-gradient(100deg,var(--license-accent),var(--license-violet));
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.licxinf{color:var(--license-accent);-webkit-text-fill-color:var(--license-accent);opacity:.85}
.licxcf{display:flex;align-items:center;gap:8px;margin-top:4px}
.licxcf obs-input{flex:1 1 auto;min-width:0}
.licxcf obs-button{flex:0 0 auto}
/* the used figure and its bar are ONE group, 8px apart against the card's 16px (the .aiab-li rule) */
.licqu{display:grid;gap:8px}
.licqm{display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap}
.licqn{font-size:14px;color:var(--text-color-common-secondary)}
.licqn b{font-size:28px;font-weight:600;line-height:1;color:var(--page-text-color)}
.licqa{font-size:12.5px;color:var(--text-color-common-secondary)}
.licqs{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px 24px;font-size:13px;
  color:var(--text-color-common-secondary)}
.licqs b,.licqg b{font-weight:600;color:var(--page-text-color)}
/* ⚠️ ONE auto margin in this row — two would split the free space (the .mfkc/.mfpin fault) */
.licqd{margin-left:auto;font-size:12.5px}
.licqty{display:grid;gap:8px}
.licql{font-size:12px;color:var(--neutral-regular)}
.licqg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px 16px;font-size:13px;
  color:var(--text-color-common-secondary)}
.licqg span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licqf{display:flex;justify-content:flex-end;margin-top:-8px}   /* kept unreferenced since History became the header icon */
/* the pill and the History icon travel together at the header's right edge */
.licqhr{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}
.licqhist{flex:0 0 auto}
@media (max-width:1100px){ .licxtiles,.licqg{grid-template-columns:repeat(2,minmax(0,1fr))} }
/* a meter bar — Option 2's device allotment and Option 4's licence term. The declared gap: the
   DS ships no meter or progress element. ⚠️ THE TRACK IS THE TONE AT LOW ALPHA, not
   --neutral-lighter, which is the same #1d2a3e as --border-color in dark and vanished on the card.
   ⚠️ THE FILL IS SIZED BY \`width\`, NEVER BY \`flex\` — a lone flex child takes the whole track. */
.licbar{display:block;width:100%;height:6px;border-radius:var(--btn-radius);overflow:hidden;
  background:color-mix(in srgb, var(--licbar-tone, var(--chart-indigo)) 18%, transparent)}
.licbar i{display:block;height:100%;border-radius:var(--btn-radius);background:var(--licbar-tone, var(--chart-indigo))}

/* ══ PRODUCT LICENSE · OPTION 3 — the two-card "License overview" ═══════════════════════════
   Two cards, one skeleton: a muted label row, main content, and a two-column key/value grid
   pinned to the bottom. See licOvHTML's header for which parts are DS components. */
.licov{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;margin-top:4px;align-items:stretch}
/* the spec's breakpoint: side by side at ≥768px, stacked below it with the edition card first
   (which is DOM order, so nothing needs reordering) */
@media (min-width:768px){ .licov{grid-template-columns:repeat(2,minmax(0,1fr))} }
/* ⚠️ BOTH CARDS ARE THE SAME HEIGHT, AND THAT IS WHAT \`margin-top:auto\` ON THE GRID IS FOR.
   The grid row stretches them (align-items:stretch), the card is a flex COLUMN, and the bottom
   key/value grid takes the slack — so the two grids line up with each other however tall the
   middles are. Sizing the cards instead would break the moment one card's content changed. */
.licovc{display:flex;flex-direction:column;gap:16px;padding:16px;min-width:0;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);
  background:var(--common-widget-bg)}
/* the label row — sentence case, muted, never all-caps (by instruction) */
.licovl{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--neutral-regular)}
.licovl > span{flex:0 0 auto}
/* ⚠️ THE SPACER IS THE OPTIONAL ACTION SLOT, and it must take the slack even when it is EMPTY —
   it is what pushes the status pill to the card's right edge. \`flex:1 1 auto\` on an empty span
   does that; \`margin-left:auto\` on the pill would too, until the slot is filled and there are
   two auto margins splitting the space (the recorded .mfkc/.mfpin/.mfdocs fault). */
.licovact{flex:1 1 auto;min-width:0;display:flex;justify-content:flex-end}
.licovl obs-tag{flex:0 0 auto}
/* the status pill's dot. ⚠️ \`currentColor\`, so it can never disagree with the pill it sits in —
   and the pill's WORD carries the state too, so colour is not the only signal (spec). */
.licovdot{display:inline-block;width:5px;height:5px;margin-right:5px;border-radius:50%;
  background:currentColor;vertical-align:middle}
.licovm{display:flex;flex-direction:column;gap:10px;min-width:0}
.licovmr{flex-direction:row;align-items:center;gap:12px}
.licovtitle{font-size:26px;font-weight:700;line-height:1.1;letter-spacing:-.02em;
  color:var(--chart-indigo)}
.licovc obs-tag{align-self:flex-start}
.licovring{flex:0 0 52px;width:52px;height:52px;display:block}
.licovrt{font-size:13px;font-weight:700;fill:var(--page-text-color)}
.licovtx{display:flex;flex-direction:column;gap:2px;min-width:0}
.licovtx b{font-size:14px;font-weight:600;color:var(--page-text-color)}
.licovtx span{font-size:12px;color:var(--text-color-common-secondary)}
/* the bottom grid: label ABOVE value, two across. ⚠️ obs-key-value renders label BESIDE value,
   so it cannot make this shape — see licOvHTML's header. */
.licovg{margin-top:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.licovp{display:flex;flex-direction:column;gap:2px;min-width:0}
.licovp span{font-size:12px;color:var(--neutral-regular)}
.licovp b{font-size:13px;font-weight:600;color:var(--page-text-color);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licov + .lictb{margin-top:24px}
/* Option 3's quota tiles (\`lic3TileHTML\`): the overview's card, grid and pairs, plus the figure.
   ⚠️ THE COLUMN COUNT FOLLOWS THE PANE, NOT THE VIEWPORT — the settings list beside it can be open or
   collapsed, so a media query would guess. The WRAPPER is the size container because a grid cannot
   query its own width. 3 across from 880px (tiles ≥ ~280px, room for "NCCM managed devices" beside
   the History button), 2 from 520px, 1 below. */
.licu3w{container-type:inline-size}
.licu3g{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;align-items:stretch}
@container (min-width:520px){ .licu3g{grid-template-columns:repeat(2,minmax(0,1fr))} }
@container (min-width:880px){ .licu3g{grid-template-columns:repeat(3,minmax(0,1fr))} }
.licu3 .licovl{min-height:24px}
.licu3 .licovl > span:not(.licovact){min-width:0;flex:0 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  font-size:13px;font-weight:500;color:var(--page-text-color)}
/* ⚠️ \`.licovl > span{flex:0 0 auto}\` (0,1,1) OUTRANKS \`.licovact{flex:1 1 auto}\` (0,1,0), so the action
   slot never took the slack and the History button sat against the name. Restated at tile weight.
   (The overview card's own status pill has the same tie and sits after its label — not changed here.) */
.licu3 .licovl > .licovact{flex:1 1 auto;gap:8px;align-items:center}
.licu3 .licovact obs-tag{align-self:center}
/* the figure and its meter are one group — 8px apart against the tile's 16px (the .aiab-li rule) */
.licu3m{display:flex;align-items:baseline;gap:6px;min-width:0;margin-bottom:-8px}
.licu3m b{font-size:24px;font-weight:600;line-height:1;color:var(--page-text-color)}
.licu3m span{font-size:13px;color:var(--text-color-common-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ══ PRODUCT LICENSE · OPTION 4 — the one-card licence (14 Sep 2026) ══════════════════════════
   Built from a supplied page (license-card.html): three sections in a row — edition, the record
   over a term bar, a days-left ring — then an activation row. The layout is the file's; the paint
   is this page's DS tokens, so the card themes with everything else.
   ⚠️ WHAT MOVED ONTO THE DS, recorded so nobody "restores" the file's values: its hex palette
   (#0f131b card, #8b9cff accent, #16301c status…) → tokens; the violet chip and the green status
   pill → obs-tag (tinted, where the file's chip was a solid fill); the copy button and the mailto
   → obs-button / obs-link; 32 / 40px spacing and the 16px / 10px / 999px radii → the structural
   scale (24px) and \`--btn-radius\`. The title's gradient runs between two chart-palette tokens.
   ⚠️ THE FILE FORCED \`min-width:1180px\` AND SCROLLED SIDEWAYS. This pane is ~920px at 1280, so
   the card is a size CONTAINER instead: under 1080px of its own width the record drops below the
   edition and the ring, and the activation row stacks. */
.lic4{container-type:inline-size;display:flex;flex-direction:column;gap:24px;padding:24px;min-width:0;
  margin-top:4px;border:1px solid var(--border-color);border-radius:var(--btn-radius);
  background:var(--common-widget-bg)}
.lic4top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr) 184px;align-items:center}
.lic4s{min-width:0;padding:0 24px}
.lic4s:first-child{padding-left:0}
.lic4s:last-child{padding-right:0}
/* ⚠️ NO RULES BETWEEN THE THREE SECTIONS (request, 14 Sep 2026: "remove all [these] lines"). The
   supplied file drew a 1px border-left on the second and third; the 24px padding either side of
   where each rule stood is kept, so the sections are still held apart — by space alone. The rule
   above the ACTIVATION ROW is untouched; the one above the term bar went later the same day
   (request: "in option 4 remove the line") — see \`.lic4tl\`. */
.lic4eb,.lic4f span{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;color:var(--neutral-regular)}
/* ⚠️ \`-webkit-text-fill-color\` AS WELL AS \`color\` — without it background-clip:text paints the
   glyphs solid on top of the gradient (the recorded Ask-AI label trap) */
.lic4title{margin:8px 0 16px;font-size:36px;font-weight:700;line-height:1.1;letter-spacing:-.02em;
  background:linear-gradient(90deg,var(--chart-neon-purple),var(--chart-indigo));
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.lic4title span{font-weight:400}
.lic4s obs-tag{align-self:flex-start}
.lic4desc{margin:16px 0 0;max-width:36ch;font-size:13px;line-height:1.6;color:var(--text-color-common-secondary)}
.lic4desc b{font-weight:600;color:var(--page-text-color)}
.lic4meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.lic4f{display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0}
.lic4f b{max-width:100%;font-size:15px;font-weight:500;line-height:1.3;color:var(--page-text-color);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ⚠️ NO RULE ABOVE THE TERM BAR (request, 14 Sep 2026: "in option 4 remove the line"). It sat 24px
   under Account / Status and 24px over the bar, so the record and its term read as two blocks; the
   24px margin stays, the rule and the 24px padding under it go. Option 5 already had neither, so
   its \`.lic5 .lic4tl\` override went with this — the two options now share one rule here. */
.lic4tl{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;
  margin-top:24px;font-size:11px;color:var(--neutral-regular)}
.lic4ring{display:flex;flex-direction:column;align-items:center;text-align:center}
.lic4ring .licring{width:120px;height:120px}
.lic4ring .lic4eb{margin-top:16px;justify-content:center}
.lic4date{margin-top:8px;font-size:15px;font-weight:600;color:var(--page-text-color)}
.lic4act{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:24px;
  padding-top:24px;border-top:1px solid var(--border-color)}
.lic4acth{font-size:13px;font-weight:600;color:var(--page-text-color);white-space:nowrap}
/* the code box: a label cell, the code, a copy cell. ⚠️ THE BOX IS --page-background-color and the
   label cell a 5% text wash over it — the file's inset look (a darker well, a lighter label) in
   both themes; in light the well matches the card and the border carries the edge. */
.lic4code{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:stretch;min-width:0;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);overflow:hidden;
  background:var(--page-background-color)}
.lic4k{display:flex;align-items:center;padding:12px 16px;font-size:13px;font-weight:600;white-space:nowrap;
  color:var(--text-color-common-secondary);border-right:1px solid var(--border-color);
  background:color-mix(in srgb, var(--page-text-color) 5%, transparent)}
/* ⚠️ A BLOCK, NOT A FLEX BOX — text-overflow cannot act on an anonymous flex item (recorded) */
.lic4v{display:block;align-self:center;min-width:0;padding:0 16px;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;font:13px/20px "JetBrains Mono",ui-monospace,monospace;color:var(--page-text-color)}
.lic4cp{display:grid;place-items:center;padding:0 4px;border-left:1px solid var(--border-color)}
.lic4help{margin:0;font-size:13px;color:var(--text-color-common-secondary);white-space:nowrap}
/* Option 4's folding Activation code (see lic4HTML). ⚠️ HIDDEN BY CLASS, NOT \`[hidden]\` — .lic4code is
   \`display:grid\` and an author display rule beats the UA's [hidden] (the recorded .stpt trap). The
   button's own padding and type are set inside its shadow root by the hook near the top of PART 2
   (:host(.lic4axb)), so the label keeps the heading's 13px/600 and its left edge stays on the card's. */
.lic4ax:not(.open) .lic4code,.lic4ax:not(.open) .lic4help{display:none}
/* the toggle under the description, 12px below it; the bottom row loses its rule and its heading column,
   and is not displayed at all while collapsed (the card's 24px flex gap would otherwise hang under it) */
.lic4axw{margin-top:12px}
.lic4act.lic4ax{grid-template-columns:minmax(0,1fr) auto;padding-top:0;border-top:0}
.lic4act.lic4ax:not(.open){display:none}
.lic4axb obs-icon{display:inline-flex;margin-left:2px;transition:transform .15s ease}   /* ⚠️ inline-flex — a transform does nothing on an inline box */
.lic4axb.open obs-icon{transform:rotate(180deg)}
@media (prefers-reduced-motion:reduce){ .lic4axb obs-icon{transition:none} }
@container (max-width:1080px){
  .lic4top{grid-template-columns:minmax(0,1fr) 184px;row-gap:24px}
  .lic4ring{grid-column:2;grid-row:1}
  .lic4rec{grid-column:1 / -1;grid-row:2;padding:24px 0 0}
  .lic4act,.lic4act.lic4ax{grid-template-columns:minmax(0,1fr);gap:12px}
  .lic4help{white-space:normal}
}
.lic4 + .lictb{margin-top:24px}
/* ── Option 4 only (Agentation notes, 15 Sep 2026) ─────────────────────────────────────────────
   · "in this field add border individual" — each record field (License type · Issue date · Account ·
     Status) is its own bordered box, at the tiles' 12px gap rather than the open grid's 24px.
   · "make small font size" on the ring's figure, and "make the circle thickness" on the ring: the
     days-left figure 27 -> 22 (viewBox units) and both arcs 10 -> 14. ⚠️ THE ARCS ARE 8 NOW (request, 15 Sep 2026:
     "change the stroke-width to 8") — 8 viewBox units, ~6.3px at the ring's 100px, leaving the figure 50 units of
     inner radius. (8px ON SCREEN would be 10.24 units, i.e. back to the original 10.)
   ⚠️ :not(.lic5) — Option 5 renders the same markup (its record is display:contents and its ring
   100px) and was not part of the notes. */
.lic4:not(.lic5) .lic4meta{gap:12px}
.lic4:not(.lic5) .lic4f{padding:12px 16px;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 4%, transparent)}
/* ⚠️ NO BORDER, A FILL (request, 15 Sep 2026: "this 4 box — remove border and add background colour"): the same 4% text
   wash the quota tiles below use (.licm4k), so every box on Option 4 is one surface, in both themes. */
.lic4:not(.lic5) .licringv{font-size:22px}
.lic4:not(.lic5) .licring circle{stroke-width:8}
/* ⚠️ OPTION 4's LABELS ARE SENTENCE CASE, 12px MEDIUM, NO TRACKING, AND ITS VALUES SEMIBOLD (request, 15 Sep 2026:
   "the 11px to 12px with medium, the 15px with semibold, remove the letter spacing, and write the title in small —
   only the first letter capital"). Every uppercase label on the licence card shares one rule — the eyebrow
   (ObserveOps edition), License type · Issue date · Account · Status, and Expires under the ring — so all of them
   change; the text is already sentence case in the markup and was only UPPERCASED by CSS. Option 5 keeps its
   uppercase labels. ⚠️ The ring's own DAYS LEFT is SVG text in the ring's markup, not this rule — unchanged. */
.lic4:not(.lic5) .lic4eb,.lic4:not(.lic5) .lic4f span{font-size:12px;font-weight:500;letter-spacing:0;text-transform:none}
.lic4:not(.lic5) .lic4f b{font-weight:600}
/* ⚠️ OPTION 4's CARD ICONS ARE ONE NEUTRAL (request, 15 Sep 2026: "remove the icon colour — use #8e9fbc"). #8e9fbc is the DS's
   own --neutral-light in dark (#6a7fa0 in light), so it is that token, not the hex: the add-on header tile, the
   Monitored devices header tile, and — in the builders — every tile icon. The header tiles take the add-on header's 8%
   text wash so both card kinds match. The entitlement tones stay on the rings' arcs and APM's split swatches. */
.licg4c .licg4i,.licm4:not(.licm5) .licm4i{color:var(--neutral-light);background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
/* ⚠️ THE THREE SECTIONS SHARE ONE TOP AND ONE BOTTOM (request, 15 Sep 2026: "the Infinity with the paragraph and button,
   and the 4 boxes, will be the same height — and the top-right ring block the same height too"). The row stretches;
   the name leads the left section and Activation code sits on its floor; the boxes fill theirs (1fr rows, so a taller
   neighbour grows them evenly); the ring leads the right section with Expires + the date on its floor.
   ⚠️ THE RING WENT 120 → 100px so its block (ring · Expires · date) is no taller than the boxes — otherwise IT would set
   the row and everything else would stretch to it. The DAYS LEFT label went 8.5 → 10 viewBox units with it (~8px).
   ⚠️ \`margin-top:auto\` cannot carry a minimum gap (it resolves to 0 with no free space — the recorded \`.aihelpl\` trap),
   so the floors are padding: 12px above the button, 8px above Expires. */
.lic4:not(.lic5) .lic4top{align-items:stretch}
.lic4:not(.lic5) .lic4s:first-child{display:flex;flex-direction:column}
.lic4:not(.lic5) .lic4axw{margin-top:auto;padding-top:12px;display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.lic4:not(.lic5) .lic4rec{display:flex;flex-direction:column}
.lic4:not(.lic5) .lic4meta{flex:1 1 auto;grid-auto-rows:1fr}
.lic4:not(.lic5) .lic4ring .licring{width:100px;height:100px}
.lic4:not(.lic5) .lic4ring .lic4eb{margin-top:auto;padding-top:8px}
.lic4:not(.lic5) .lic4date{margin-top:4px;font-size:16px;font-weight:600}   /* 16px semibold (request, 15 Sep 2026); "Expires" above is 500 by the label rule */
.lic4:not(.lic5) .licringl{font-size:10px}
/* ⚠️ EVERY OPTION 4 CARD IS PADDED 10px (request, 15 Sep 2026: "in option 4 all card padding is 24px — change
   to 10px"): the licence card and Monitored devices (24px) and the five add-on cards (16px 24px). The
   tiles and record boxes inside keep their own 12px / 16px. ⚠️ A DECLARED DIVERGENCE FROM THE DS
   SPACING SCALE (8 · 12 · 16 · 24) — 10px is not on it, and the conformance checker's layout score
   has read an off-scale padding before (\`padding:20px\` cost Option 2 layout 97). Asked for as a
   number, so it is that number. (0,2,0) so each rule beats its card's own (0,1,0) declaration
   wherever it sits in the sheet; Option 5's cards (\`.lic5\` / \`.licm5\` / \`.licg5c\`) keep theirs. */
.lic4:not(.lic5),.licm4:not(.licm5),.licg4 > .licg4c{padding:10px}
/* ⚠️ OPTION 4's CARD EDGES ARE --widget-border-color (request, 15 Sep 2026: "the option 4 all card border colour to use
   #172336") — the DS's own widget-border token, #172336 in dark and #e3e8f2 in light (the value these cards already had
   there), so light is unchanged and no hex is pasted. Licence, Monitored devices and the five add-on cards. */
.lic4:not(.lic5),.licm4:not(.licm5),.licg4 > .licg4c{border-color:var(--widget-border-color)}
/* the licence card's gap between its sections row and the Activation code row is 16px on Option 4 (request, 15 Sep 2026,
   set in devtools: "gap 24px → 16px"); Option 5 keeps 24 */
.lic4:not(.lic5){gap:16px}
/* ⚠️ THE SECTIONS' SPACING FOLLOWS A SUPPLIED SCREENSHOT (request, 15 Sep 2026: "change the spacing like this screenshot"),
   measured off it: the left block 1.2× the record block, the ring column 184px, and no padding between the three — the
   boxes start where the left column ends and the ring centres in its own column. The description's 57ch cap is what keeps
   the text off the boxes. Only the wide layout; under the 1080px container query the sections still stack. */
/* ⚠️ INSIDE A WIDE-CARD QUERY, NOT BARE: at (0,3,0) these outrank the stacked layout's own rules in the 1080px query below
   (0,1,0), and a bare copy gave a 929px card (the 1280 viewport) three columns with the record spilling under them. */
@container (width > 1080px){
  .lic4:not(.lic5) .lic4top{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) 184px}
  .lic4:not(.lic5) .lic4s{padding:0}
}
/* the "Last N days" sparkline sits between the label and the figure. ⚠️ THE CHART GIVES WAY, NOT THE LABEL: the label and
   figure keep their width and the chart takes what is left (up to 120px). ⚠️ UNDER A 300px TILE IT IS NOT DRAWN — at a 1280
   viewport the tile is ~265px and the chart would get ~28px while "Last 30 days" clipped to 40px (measured). The tile is a
   NAMED container only when it carries a chart, so no other container query in the card can answer to it. */
.licm4k:has(> .licq5sp){container:licm4k / inline-size}
.licm4k:has(> .licq5sp) .licm4kt{flex:0 0 auto}
.licm4k .licq5sp{flex:1 1 120px;max-width:120px;min-width:0;height:28px;margin-left:auto}
@container licm4k (max-width:300px){ .licm4k .licq5sp{display:none} }
/* the edition description runs to 57ch on Option 4 (request, 15 Sep 2026, set in devtools and supplied as
   the picture): at 36ch it wrapped to four lines beside a record that needs two. A cap, not a width — a
   narrower column still wraps it. Option 5 keeps 36ch. */
.lic4:not(.lic5) .lic4desc{max-width:57ch}

/* ══ PRODUCT LICENSE · OPTION 5 — the one-card licence, borderless (14 Sep 2026) ═══════════════
   From a second supplied page: Option 4's card with its edges taken out. SAME MARKUP — lic4HTML
   emits \`lic4 lic5\` — so the two cannot drift apart in content; only these rules differ:
   · no card border, and no rule above the term bar;
   · the activation row is a filled, rounded BAND instead of a row under a rule;
   · the code box loses its outline and its two cell rules (the label cell keeps its fill);
   · the ring is 100px.
   ⚠️ THE TOP ROW IS CENTRED, NOT TOP-ALIGNED (request, 14 Sep 2026: "the card will be [aligned
   like this]"). The second file set \`align-items:start\` with only the ring centred, so beside the
   tall edition column the record hugged the top while the ring sat on the row's middle — the two
   right-hand blocks were ~25px out of line with each other. Centring the row puts the record, the
   ring and the edition on one centre line; the file's 2px nudge on the record (which only existed
   to line its labels up with the eyebrow under top alignment) went with it.
   ⚠️ THE RING'S FIGURE IS NOT ENLARGED. The file set it to 28px in a 120 box; this ring prints
   "1,433" with a separator, and at that proportion the comma pushed the digits into the stroke.
   The SVG scales as one unit, so the default size fits at 100px exactly as it does at 120.
   ⚠️ THE CARD FILL IS \`--lic5-surface\` (#0B1627 in dark since that request; a 3% text wash over
   white in light). With the border gone, a light-theme
   card is #fff on the #fff pane and would have no edge at all; the wash gives it one in light and
   only lifts it a step in dark. The band is a further 4% wash and the label cell 8% over the well,
   so every step is one declaration that holds in both themes (the file's #121826 / #1a2232 are
   dark-only).
   ⚠️ NO QUOTA GRID. Option 5 is this card plus the Monitored devices card below (\`.licq5\`) —
   see licUsageHTML. */
.lic4.lic5{border-color:transparent;background:var(--lic5-surface)}
/* ⚠️ OPTION 5's TOP ROW SHARES ONE TOP LINE AND ONE BOTTOM LINE (request, 14 Sep 2026: "change the
   'OBSERVEOPS EDITION' alignment [with] the card"). Centred, the record floated ~24px below the
   edition eyebrow and its term bar ~20px above the description's last line, so the edition column
   stuck out above and below the rest. The sections now STRETCH to the row: the record is a column
   with its labels at the top — "License type" on the "ObserveOps edition" line — and the term bar
   pushed to the bottom, level with the description's end. The ring keeps its own centre, which is
   what a round figure reads against. Option 4 stays centred; the request named Option 5.
   ⚠️ THE RECORD's THREE LINES SHARE THE FREE SPACE EVENLY. With the bar alone pushed down, ~90px
   opened between Account / Status and the bar while the two field rows sat 24px apart — one hole
   in the middle of the card. \`.lic4meta\` is \`display:contents\` here so its four fields and the bar
   are items of ONE grid, and \`align-content:space-between\` spaces all three rows alike; the 24px
   row gap stays as their floor, which is why the bar's own 24px margin is dropped. */
.lic5 .lic4top{align-items:stretch}
.lic5 .lic4rec{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px;row-gap:24px;
  align-content:space-between}
.lic5 .lic4meta{display:contents}
.lic5 .lic4tl{grid-column:1 / -1;margin-top:0}
.lic5 .lic4ring{align-self:center}
.lic5 .lic4ring{justify-self:center}
.lic5 .lic4ring .licring{width:100px;height:100px}
.lic5 .lic4date{margin-top:4px}
.lic5 .lic4act{padding:16px 24px;border-top:0;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 4%, transparent)}
.lic5 .lic4code{border-color:transparent}
.lic5 .lic4k{border-right:0;background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
.lic5 .lic4cp{border-left:0}

/* ══ THE QUOTA-ROW CARD SHAPE (\`.licq5\`) — Option 2's five add-on cards (14 Sep 2026) ═════════
   ⚠️ IT WAS BUILT FOR OPTION 5's Monitored devices card and LEFT IT the same day, when that card was
   simplified on request (\`.licd5\`, below). Everything here now describes Option 2's add-on cards,
   which override the surface and the accent (\`.licqbox\`, Options 2 and 3). The original description, kept:
   the live product's quota-row card: an icon tile, the name over its metering token, the status
   pill · the used figure · History on the right; a thick meter; what remains and the 30-day change
   beside a sparkline; the agentless/agent split as a legend; and BY TYPE as a stacked bar with its
   legend. It shares Option 5's surface (the same 3% wash, no outer border) so the two cards on the
   tab read as a set, and keeps the supplied card's left accent in the entitlement's own tone.
   ⚠️ THE LEFT ACCENT IS AN INSET SHADOW, NOT A BORDER — a 3px border would push the content 3px
   right of the licence card's content above it. The shadow paints inside the box and follows the
   radius.
   ⚠️ THE SERIES COLOURS ARE CHART-PALETTE TOKENS (\`LIC5_PAL\`), not the live product's
   --license-* hues, which have no token here; the meter and sparkline take the entitlement's own
   \`q.tok\`, the colour the History drawer it opens plots in.
   ⚠️ EVERY FILL IS SIZED BY \`width\` WITH \`flex:0 0 auto\` — a lone flex child grows to the whole
   track, and a zero-share segment is not emitted at all rather than sized to nothing (the recorded
   \`min-width\` / \`flex:50\` faults).
   The sparkline and both bars are the declared \`chart\` gap. */
.licq5{display:flex;flex-direction:column;gap:16px;padding:24px;margin-top:16px;min-width:0;
  border-radius:var(--btn-radius);box-shadow:inset 3px 0 0 var(--licq5-tone, var(--chart-indigo));
  background:var(--lic5-surface)}
.licq5 obs-divider{display:block;--divider-my:0;--border-color:color-mix(in srgb, var(--page-text-color) 12%, transparent)}
/* ⚠️ THE RULES READ A 12% TEXT WASH, NOT \`--border-color\` — that token is #1d2a3e in dark, and
   this card's washed surface lands within a step of it, so both dividers vanished (measured on
   the dark screenshot). The custom property is set on the HOST and inherits into obs-divider's
   shadow root, where its line reads it. */
/* ⚠️ THE HEADER READS: icon · title + its status · token under them … figure · History (14 Sep 2026:
   "the Healthy will show behind [the title]"). The pill sits ON THE TITLE LINE, directly after the
   name — the shape Option 2's licence card already uses for "ObserveOps edition · Activated" — so
   the status belongs to the entitlement rather than floating beside the figure. The title block
   takes the slack (flex:1), which is what pins the figure + button to the right edge; ONE flexible
   item, never a second auto margin (the recorded .mfkc/.mfpin/.mfdocs fault). */
.licq5h{display:flex;align-items:center;flex-wrap:wrap;gap:12px 16px;min-width:0}
.licq5i{flex:0 0 32px;width:32px;height:32px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--text-color-common-secondary);background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
.licq5t{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.licq5t b{font-size:14px;font-weight:600;color:var(--page-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ⚠️ \`> span:not(.licq5tt)\`, NOT \`span\` — the title row is a span too, and the descendant rule
   would have set it (and anything inside the pill) to the token's 12px secondary ink. */
.licq5t > span:not(.licq5tt){font-size:12px;color:var(--text-color-common-secondary)}
.licq5tt{display:flex;align-items:center;gap:8px;min-width:0}
.licq5tt b{flex:0 1 auto;min-width:0}
.licq5tt obs-tag{flex:0 0 auto}
.licq5r{flex:0 0 auto;display:flex;align-items:center;gap:12px}
.licq5n{font-size:13px;color:var(--text-color-common-secondary);white-space:nowrap}
.licq5n b{font-size:22px;font-weight:600;line-height:1;color:var(--page-text-color)}
/* ⚠️ \`.licq5r obs-button obs-icon{margin-right:2px}\` WENT — it spaced a glyph from the word "History";
   in an icon-only button it pushed the glyph 2px off-centre. */
.licbar.licq5bar{height:10px}
/* Option 2's Flow Sources card: the same card on Option 2's own surface — the 1px border and
   \`--widget-background\` its licence and devices cards wear.
   ⚠️ NO LEFT ACCENT HERE (request, 14 Sep 2026: "remove this color"). The supplied card's green
   edge came off, so on Option 2 the card reads as a sibling of the two above it; Option 5's
   Monitored devices card keeps its accent. */
.licq5.licqbox{border:1px solid var(--border-color);background:var(--widget-background);box-shadow:none}
/* ⚠️ OPTION 2's CARDS ARE PADDED 12px (request, 15 Sep 2026: "in option 2 the card margin is 24px — change to 12px"):
   the licence card and the six quota cards, which is where the 24px was. Their inner gaps are untouched. The 24px
   between the licence card and "License & Quota Usage" is a margin on the head, not the card, and stays. */
.licx,.licq5.licqbox{padding:12px}
/* ⚠️ OPTION 2's CARD IS A 4-COLUMN GRID (request, 14 Sep 2026: "the 100 remaining of 100 will be align
   of 0 of 100 exporters"). Columns: icon · title · figure · History. The header joins it through
   \`subgrid\` and its right cluster through \`display:contents\`, so the FIGURE owns column 3 — and the
   caption row is placed in that same column and pushed to its end. Both right edges are the column's
   end by construction, whatever width the caption or the figure takes; a padding sized to the History
   button would have been a second copy of that button's width.
   ⚠️ Everything else (meter, dividers, split, BY TYPE) spans all four columns. */
.licq5.licqbox{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;column-gap:12px;row-gap:16px}
.licqbox > *{grid-column:1 / -1}
.licqbox > .licq5h{display:grid;grid-template-columns:subgrid;align-items:center;column-gap:12px}
.licqbox .licq5r{display:contents}
.licqbox .licq5i{grid-column:1}
.licqbox .licq5t{grid-column:2}
/* ⚠️ ONE TWO-LINE STAT, TOP RIGHT (request, 14 Sep 2026: make "0 of 100 exporters" and "100 remaining of
   100" "better visualization and user friendly"). The caption used to sit on its own row under the meter,
   ~40px from the figure it qualifies and alone at the card's right; a reader had to find it. Now the used
   figure and what remains are one right-aligned block that MIRRORS the name + code block on the left —
   two lines each side — and the second line also states the share used, the one number the meter drew
   and no text said. "remaining of 100" lost its "of 100": the figure directly above already says it. */
.licqbox .licq5st{grid-column:3;justify-self:end;display:flex;flex-direction:column;align-items:flex-end;gap:4px;white-space:nowrap}
.licq5rm{font-size:12px;color:var(--text-color-common-secondary);font-variant-numeric:tabular-nums}
.licq5rm b{font-weight:600;color:var(--page-text-color)}
.licqbox .licq5n{font-variant-numeric:tabular-nums}
.licqbox .licqhist{grid-column:4}
.licqbox > .licq5m{grid-column:3;justify-self:end;justify-content:flex-end;white-space:nowrap}
/* ⚠️ THE TRACK IS \`--progress-bar-bg\` (#2B394F in dark, as asked) — the DS's own progress-bar track
   token, not the entitlement tone at 18%. The FILL keeps the tone. Option 2 only. */
.licqbox .licbar{background:var(--progress-bar-bg)}
/* Option 3: the cards sit 16px under the two overview cards (the head that used to separate them is
   gone from Option 3 by an earlier request) */
.licov + .licqcards{margin-top:16px}

/* ══ PRODUCT LICENSE · OPTION 5 — the Monitored devices card, simplified (14 Sep 2026) ═════════
   Request: "remove the line of color … make this card ui simple and user-friendly", against the
   quota-row card it had been. What went, and why each was noise:
   · the LEFT ACCENT — a coloured edge on one card of two said nothing the icon and title do not;
   · the SPARKLINE — 120px of 30 days is unreadable, and History opens the real chart;
   · the SWATCHES on Agentless / Agent-based — they keyed a chart that does not exist there, so the
     colour squares promised a legend with nothing to read it against. It is a plain line now;
   · the second rule and the top-right action cluster — one rule, and the one action at the foot.
   What stayed: the title and metering token, the status pill, the used figure over the meter, what
   remains and the change over the window, the split, and BY TYPE (its bar DOES need the legend).
   Same surface as Option 5's licence card (\`--lic5-surface\`, no border), 16px below it. */
.licd5{display:flex;flex-direction:column;gap:16px;padding:24px;margin-top:16px;min-width:0;
  border-radius:var(--btn-radius);background:var(--lic5-surface)}
.licd5 obs-divider{display:block;--divider-my:0;--border-color:color-mix(in srgb, var(--page-text-color) 12%, transparent)}
.licd5h{display:flex;align-items:center;gap:12px;min-width:0}
.licd5h obs-tag{flex:0 0 auto;margin-left:auto}
/* the figure and its meter are ONE group, 8px apart against the card's 16px (the .aiab-li rule) */
.licd5u{display:grid;gap:8px}
.licd5m{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px 16px}
.licd5r{font-size:12.5px;color:var(--text-color-common-secondary)}
.licd5s{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px 24px;font-size:13px;color:var(--text-color-common-secondary)}
.licd5s b{font-weight:600;color:var(--page-text-color)}
.licd5f{display:flex;justify-content:flex-end;margin-top:-8px}

/* ══ PRODUCT LICENSE · OPTION 4 — the Monitored devices card (14 Sep 2026) ══════════════════════
   From a supplied card. DS parts: the Healthy and 30-day \`obs-tag\`s, the History \`obs-button\`
   (\`default\`, icon + label, as the picture has it — Option 2's is icon-only), every \`obs-icon\` and the
   \`obs-divider\`. The meter and the BY DEVICE TYPE bar are the declared \`chart\` gap (\`.licchart\`).
   ⚠️ SAME SURFACE AS OPTION 4's LICENCE CARD — 1px border on \`--common-widget-bg\` (#0B1627 here) —
   16px under it, so the two read as a set.
   ⚠️ THE PICTURE WRAPPED ITS FIGURE ROW ("of 5,000 / used", "9 in / 30d") — that is a broken render,
   not the design. Every run in that row is \`nowrap\` and the ROW wraps instead.
   ⚠️ THE SPLIT'S COLOURS ARE THE PICTURE'S: agentless aqua, agent-based lime — which are also the BY TYPE
   palette's first two (Cloud, Servers), exactly as in the reference. They key the meter segments and
   the tile marks; the type bar has its own legend under its own heading.
   ⚠️ THE 30-DAY CHANGE IS \`tag-orange\` BECAUSE THE PICTURE IS — the DS has no positive-text token, and
   this is an attention colour, not a verdict. */
.licm4{container-type:inline-size;display:flex;flex-direction:column;gap:20px;padding:24px;margin-top:16px;min-width:0;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);background:var(--common-widget-bg)}
.licm4 obs-divider{display:block;--divider-my:0;--border-color:color-mix(in srgb, var(--page-text-color) 12%, transparent)}
.licm4h{display:flex;align-items:center;gap:12px;min-width:0}
.licm4i{flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--chart-aqua);background:color-mix(in srgb, var(--chart-aqua) 16%, transparent)}
.licm4t{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.licm4tt{display:flex;align-items:center;gap:8px;min-width:0}
.licm4tt b{flex:0 1 auto;min-width:0;font-size:15px;font-weight:600;color:var(--page-text-color);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licm4tt obs-tag{flex:0 0 auto}
.licm4tk{font-size:12.5px;color:var(--text-color-common-secondary)}
.licm4hist{flex:0 0 auto}
/* the figure and its meter are ONE group — 8px against the card's 20px (the .aiab-li rule) */
.licm4u{display:grid;gap:8px}
.licm4m{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:8px 16px}
.licm4n{display:inline-flex;align-items:baseline;gap:6px;white-space:nowrap}
.licm4n b{font-size:28px;font-weight:600;line-height:1;color:var(--page-text-color)}
.licm4n span{font-size:13px;color:var(--text-color-common-secondary)}
.licm4n em{font-style:normal;font-size:13px;color:var(--text-color-common-secondary)}
.licm4r{display:inline-flex;align-items:center;gap:12px;white-space:nowrap;font-size:13px;color:var(--text-color-common-secondary)}
.licm4r obs-tag{flex:0 0 auto}
/* ⚠️ SEGMENTS ARE \`width:%\` WITH \`flex:0 0 auto\` — a lone flex child grows to the whole track */
.licm4bar{display:flex;width:100%;height:8px;overflow:hidden;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
.licm4bar i{display:block;height:100%;flex:0 0 auto}
.licm4ks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.licm4k{display:flex;align-items:center;gap:12px;min-width:0;padding:12px 16px;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 4%, transparent)}
.licm4ki{flex:0 0 36px;width:36px;height:36px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--licm4-t);background:color-mix(in srgb, var(--licm4-t) 16%, transparent)}
.licm4kt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.licm4kt b{font-size:13.5px;font-weight:500;color:var(--page-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* ⚠️ OPTION 4's TILE TITLES ARE SEMIBOLD (request, 15 Sep 2026: "Agentless · Agent-based · Last 30 days — make this font
   semibold"). The add-on cards' In use · Available · Last N days tiles are the same markup and follow, so the two
   card kinds on Option 4 keep one shape; Option 5's device tiles keep 500. */
.licm4:not(.licm5) .licm4kt b,.licg4c .licm4kt b{font-weight:600}
.licm4kt span{font-size:12px;color:var(--text-color-common-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licm4kv{flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right}
.licm4kv b{font-size:20px;font-weight:600;line-height:1.1;color:var(--page-text-color)}
.licm4kv span{font-size:12px;color:var(--text-color-common-secondary);white-space:nowrap}
.licm4ty{display:grid;gap:12px}
.licm4l{text-align:center;font-size:13px;color:var(--text-color-common-secondary)}
.licm4lg{justify-content:center}
/* ⚠️ OPTION 4's LEGEND STARTS AT THE LEFT (request, 15 Sep 2026: "the bottom legend will align left side"),
   on the card's content edge under the type bar's start, where every other line of the card begins.
   Option 5's stays centred. */
.licm4:not(.licm5) .licm4lg{justify-content:flex-start}
/* narrow pane: the two tiles stack */
@container (max-width:620px){ .licm4ks{grid-template-columns:minmax(0,1fr)} }
/* Option 4's ring body (see \`changeTile\` in lic4DevHTML): the figure line over a ring + three tiles row,
   the add-on cards' own row — two tiles across under 1000px of card, one under 620px. \`.licm4c\` (the
   column that briefly held the figure line beside the ring) is kept, unreferenced. */
.licm4c{display:grid;gap:12px;min-width:0}
.licm4ks.licm4k3{grid-template-columns:repeat(3,minmax(0,1fr))}
@container (max-width:1000px){ .licm4ks.licm4k3{grid-template-columns:repeat(2,minmax(0,1fr))} }
@container (max-width:620px){ .licm4ks.licm4k3{grid-template-columns:minmax(0,1fr)} }

/* ══ PRODUCT LICENSE · OPTION 5 — the supplied Monitored devices quota card (14 Sep 2026) ═══════════
   \`lic4DevHTML('5')\`: Option 4's markup with \`.licm5\`. What the page asked for that differs:
   · SIZES — a 36px icon tile, 30px deployment marks, the tile's name at 12px secondary weight (not a
     heading), a 26px figure with its unit at 14px and the share one step quieter, 18px tile counts;
   · BARS WITH 2px GAPS — both bars, and the type bar has NO TRACK (the page's \`background:transparent\`);
     a non-zero meter segment keeps a 12px / 4px minimum and a type segment 4px, so shrinking is allowed
     (\`flex:0 1 auto\`) or a gap-plus-100%-width row clips its last segment;
   · the status is graded Healthy / Warning (≥80%) / Critical (≥95%), the change tag carries a sign and
     turns green when nothing rose — both in the builder.
   ⚠️ THE PAGE'S TYPE SHARES WERE OF THE USED TOTAL (86 / 171), which leaves its own bar ~19% short of
   full; they are shares of the TYPED total here, as on every other card and in the image this card
   also came from. ⚠️ Its 16px/20px padding and 12px radius are 16px/24px and \`--btn-radius\`.
   ⚠️ It sits under Option 5's simplified devices card, so Option 5 shows two cards for one
   entitlement — that is what "add" said; one line in \`licQCardsHTML\` if one should go. */
/* ⚠️ OPTION 5's CARDS HAVE NO BORDER (request, 14 Sep 2026: "in option 5 remove the box border of every
   card"). The border is made TRANSPARENT rather than removed, so no card's box shrinks by 2px against
   Option 4's, and the fill moves to \`--lic5-surface\` — the licence card's own borderless fill — so the
   three kinds of card read as one set and a light-theme card keeps an edge on the white pane. */
.licm4.licm5{gap:12px;padding:16px 24px;border-color:transparent;background:var(--lic5-surface)}
/* the split sits on the figures' OWN three columns — Agentless under In use, Agent-based under
   Available — so the card has one column rhythm; a two-column split put Agent-based between them */
.licm5 .licn5s.licn5sp{grid-template-columns:repeat(3,minmax(0,1fr))}
.licm5 .licm4i{flex-basis:36px;width:36px;height:36px}
.licm5 .licm4tk{font-size:13px}
.licm5 .licm4u{gap:8px}
.licm5 .licm4n b{font-size:26px}
.licm5 .licm4n span{font-size:14px}
.licm5 .licm4n em{color:var(--neutral-regular)}
.licm5 .licm4bar,.licm5 .licq5stk{gap:2px}
.licm5 .licm4bar i,.licm5 .licq5stk i{flex:0 1 auto}
.licm5 .licq5stk{height:8px;background:transparent}
.licm5 .licq5stk i{min-width:4px}
.licm5 .licm4ks{gap:12px}
/* Option 5's deployment tiles (see \`licm5k\` in lic4DevHTML): icon top-aligned with the name; the body
   is the name + figure row over the share row. The name keeps the Option 4 tile's body weight — the
   old 12px secondary name read as a caption. The share track is the tile's tone at 16%, so a zero
   tile still shows WHICH track is empty. */
.licm5 .licm4k.licm5k{align-items:flex-start;padding:12px 16px}
.licm5k .licm5kb{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:10px}
.licm5k .licm5kr{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-width:0}
.licm5k .licm4kv{flex-direction:row;align-items:baseline;gap:4px}
.licm5k .licm4kv span{font-size:12.5px}
.licm5k .licm5ks{display:flex;align-items:center;gap:12px;min-width:0}
.licm5k .licm5kt{flex:1 1 auto;display:block;height:4px;overflow:hidden;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--licm4-t) 16%, transparent)}
.licm5k .licm5kt i{display:block;height:100%;background:var(--licm4-t);border-radius:inherit}
.licm5k .licm5kp{flex:0 0 auto;font-size:12px;color:var(--text-color-common-secondary);
  font-variant-numeric:tabular-nums;white-space:nowrap}
.licm5 .licm4ty{gap:8px}
.licm5 .licm4l{font-size:12px;color:var(--neutral-regular)}
.licm5 .licm4lg{gap:6px 16px}

/* ══ PRODUCT LICENSE · OPTION 4 — the add-on licence cards (14 Sep 2026) ═══════════════════════
   Two supplied pages (\`lic4AddonHTML\`). DS parts: the status \`obs-tag\`, the \`default\` View-history
   \`obs-button\`, the \`obs-icon\`s and \`obs-divider\`s; the ring is the declared \`gauge\` gap.
   ⚠️ THE PAGES' 20px/22px PADDING IS 16px/24px here, the DS scale (off-scale padding has cost this page
   \`layout 97\` before). The header's own rule is an \`obs-divider\`, not a border. */
/* ⚠️ ONE CARD PER ROW, FULL WIDTH, AND NO ACCENT EDGE (request, 14 Sep 2026: "remove this color line
   and all card will be show in single line, not side by side"). Both came from the add-on page — its
   \`auto-fill, minmax(520px,1fr)\` grid and \`border-left:3px\` — and both went the same day. The accent
   still tints each card's icon glyph, ring arc and split swatch; only the edge is gone. */
.licg4{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;margin-top:16px}
.licg4c{container-type:inline-size;display:flex;flex-direction:column;gap:16px;padding:16px 24px;min-width:0;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);background:var(--common-widget-bg)}
.licg4c obs-divider{display:block;--divider-my:0;--border-color:color-mix(in srgb, var(--page-text-color) 12%, transparent)}
.licg4h{display:flex;align-items:center;gap:12px;min-width:0}
.licg4i{flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--licg4-a);background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
.licg4t{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.licg4t b{font-size:15px;font-weight:600;color:var(--page-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licg4t span{font-size:12.5px;color:var(--text-color-common-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licg4hist{flex:0 0 auto}
/* the status pill sits top-right, after View history (Agentation note, 15 Sep 2026: "show top right
   behind view history") — it left the tiles' row, where it spanned the grid above the three tiles */
.licg4h obs-tag{flex:0 0 auto}
/* ⚠️ THE RING IS THE TILES' HEIGHT (request, 15 Sep 2026: Option 4 "Flow Sources … the circle make small and
   same height [as the] 'In use' card"). It was 96px beside 65px tiles, so it overhung the row by 15px each
   side. ONE token sizes both: the tiles take it as a min-height (their content measured 65.4px) and the ring
   as its box, so the two are equal by construction rather than by a number that happens to match today.
   It is on \`.licg4b\`, so the Monitored devices card — whose ring row IS this row, on request — follows. */
.licg4b{--licg4-h:66px;display:grid;grid-template-columns:var(--licg4-h) minmax(0,1fr);align-items:center;column-gap:24px}
.licg4b .licm4k{min-height:var(--licg4-h)}
.licg4r{width:var(--licg4-h);height:var(--licg4-h);display:block}
/* the duplicate RUM card: the ring leads the header where the icon tile was (same 66px token, so it reads as the same ring),
   and the tile row spans the card because nothing sits beside it */
.licg4c.licg4rh .licg4h{--licg4-h:66px}
.licg4c.licg4rh .licg4h > .licg4r{flex:0 0 var(--licg4-h)}
.licg4c.licg4rh .licg4b{grid-template-columns:minmax(0,1fr)}
.licg4rt{stroke:color-mix(in srgb, var(--page-text-color) 10%, transparent)}
.licg4rv{font-size:20px;font-weight:600;fill:var(--page-text-color)}   /* 20px semibold (request, 15 Sep 2026: "the '170' font size is 26px, make it 20px and semibold"); viewBox units, so it draws ~14px in the 66px ring. Every Option 4 ring — one class */
.licg4rl{font-size:13px;fill:var(--text-color-common-secondary)}      /* ~9px; "of 5,000" still clears the arc */
.licg4f{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:24px;row-gap:12px;align-items:start}
.licg4f obs-tag{grid-column:1 / -1;justify-self:start}
.licg4p{display:flex;flex-direction:column;gap:4px;min-width:0}
/* Option 4's facts as tiles (see \`tiles4\` in lic4AddonHTML): the grid keeps three columns but at the
   tiles' own 12px gap, and the tiles stack under 720px of card — three 36px icons plus figures do not
   fit narrower. (0,2,0) so it outranks the 440px rule that sets \`.licg4f\` to two columns. */
.licg4f.licg4ft{column-gap:12px;row-gap:12px}
@container (max-width:720px){ .licg4f.licg4ft{grid-template-columns:minmax(0,1fr)} }
.licg4p span{font-size:12px;color:var(--text-color-common-secondary);line-height:1.2}
.licg4p b{font-size:14px;font-weight:500;line-height:1.2;color:var(--page-text-color);font-variant-numeric:tabular-nums;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.licg4s{display:flex;flex-wrap:wrap;gap:8px 24px}
/* Option 4's APM split sits 12px under its tiles (requests, 15 Sep 2026: "remove the line and the gap", then "add 8px
   space", then "8px — use 12px") — the -4px takes .licg4c's own 16px flex gap down to 12, the only space left once the
   divider went */
.licg4 > .licg4c > .licg4s{margin-top:-4px}
.licg4k{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--text-color-common-secondary)}
.licg4k i{display:block;flex:0 0 8px;width:8px;height:8px;border-radius:2px;background:var(--licg4-a)}
.licg4k b{font-weight:500;color:var(--page-text-color);font-variant-numeric:tabular-nums}
/* a narrow card: the ring over the facts, two facts across (the page's own 560px step, per card) */
/* ══ PRODUCT LICENSE · OPTION 5 — the add-on licence cards (14 Sep 2026) ══════════════════════════
   \`lic4AddonHTML(q, '5')\`, from the supplied "Add-on licenses — option 2" page, stacked one per row at
   full width as the accompanying screenshot shows (Flow Sources included, which the page left out).
   The card IS the page's grid: \`minmax(0,1fr) auto\` — row 1 name + History, row 2 facts + ring, row 3
   the optional split across both columns.
   ⚠️ NO ACCENT EDGE: the page has none, and the same edge was removed from Option 4's cards on request
   an hour earlier — the screenshot's coloured edges are the older Option 2 cards it was pointing at for
   the stacked LAYOUT. The tone tints the icon tile, the glyph, the ring arc and APM's swatches.
   ⚠️ The page's 22px padding and 12px radius are 24px and \`--btn-radius\`; its 20px row gap is 16. */
/* ⚠️ OPTION 5's ADD-ON CARDS ARE TWO ACROSS (request, 14 Sep 2026: "make this card side by side and
   the inside the card element make proper alignment with user friendly"). At full width the three
   facts sat ~400px apart and the ring ~1,000px from the name it belongs to. Two across halves that,
   and inside each card: View history is centred on the title block (it was pinned to its top edge),
   the ring's right edge is the button's, and \`align-content:start\` keeps a card's content at its
   top when its row-mate is taller — APM carries an extra split row, and a stretched NCCM beside it
   would otherwise re-centre its rows lower. Under 1000px of pane the grid goes back to one column —
   measured: at a 1280 viewport the pane is ~940px, and two ~460px cards wrapped the pill under the
   name and pushed "Last 30 days" onto a second row;
   via the named container on \`#licQCards\` (set only when Option 5's grid is in it, so no other
   option's unnamed container queries find a new container). */
#licQCards:has(> .licg4.licg5){container:licqc / inline-size}
.licg4.licg5{grid-template-columns:repeat(2,minmax(0,1fr))}
@container licqc (max-width:1000px){ .licg4.licg5{grid-template-columns:minmax(0,1fr)} }
.licg5c{container-type:inline-size;display:flex;flex-direction:column;gap:16px;
  padding:24px;min-width:0;border:1px solid transparent;
  border-radius:var(--btn-radius);background:var(--lic5-surface)}
/* ⚠️ THE REFERENCE-CARD SHAPE (see lic4AddonHTML's Option 5 branch). A flex COLUMN, not the old
   2-column grid: header · figures · usage · (APM's split) · footer. The footer takes
   \`margin-top:auto\`, so in a row where APM's extra split row makes the pair taller, BOTH cards'
   footers sit on the same line at the bottom; the column's 16px gap is still the minimum above it
   (the recorded trap — an auto margin alone resolves to 0 when there is no free space). */
.licn5h{display:flex;align-items:flex-start;gap:12px;min-width:0}
.licn5t{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.licn5t b{font-size:15px;font-weight:600;line-height:1.3;color:var(--page-text-color);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.licn5t span{font-size:12.5px;color:var(--text-color-common-secondary)}
.licn5h obs-tag{flex:0 0 auto}
.licn5s{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.licn5s.licn5sp{grid-template-columns:repeat(2,minmax(0,1fr))}
.licn5v{display:flex;flex-direction:column;gap:4px;min-width:0}
.licn5v > span{font-size:12px;color:var(--text-color-common-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.licn5v > b{font-size:22px;font-weight:600;line-height:1.2;color:var(--page-text-color);
  font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.licn5v > b em{font-style:normal;font-size:13px;font-weight:400;color:var(--text-color-common-secondary)}
.licn5u{display:grid;gap:8px}
.licn5ul{display:flex;align-items:baseline;justify-content:space-between;gap:12px;font-size:12px;
  color:var(--text-color-common-secondary)}
.licn5ul b{font-size:15px;font-weight:600;color:var(--page-text-color);font-variant-numeric:tabular-nums}
.licn5u .licbar{height:8px}
.licn5f{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0;
  font-size:12.5px;color:var(--text-color-common-secondary)}
.licn5f > span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.licn5f b{font-weight:500;color:var(--page-text-color)}
.licn5f .licg4hist{flex:0 0 auto}
@container (max-width:380px){ .licn5s{grid-template-columns:repeat(2,minmax(0,1fr))} }
.licg5i{flex:0 0 36px;width:36px;height:36px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--licg4-a);background:color-mix(in srgb, var(--licg4-a) 16%, transparent)}
.licg5tt{display:flex;align-items:center;flex-wrap:wrap;gap:4px 8px;min-width:0}
.licg5tt b{font-size:15px;font-weight:600;color:var(--page-text-color)}
.licg5tt obs-tag{flex:0 0 auto}
/* ⚠️ \`.licg4t span\` (Option 4's subtitle rule: 12.5px, nowrap, ellipsis) also matches this TITLE ROW,
   which is a span too — it would clip the pill and stop the row wrapping. Undone at (0,2,0). */
.licg4t .licg5tt{font-size:inherit;color:inherit;overflow:visible;white-space:normal;text-overflow:clip}
.licg5tk{font-size:12.5px;color:var(--text-color-common-secondary)}
@container (max-width:440px){ .licg4b{grid-template-columns:minmax(0,1fr);row-gap:16px;justify-items:start}
  .licg4f{grid-template-columns:repeat(2,minmax(0,1fr))} }
.licq5m{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;
  font-size:12.5px;color:var(--text-color-common-secondary)}
.licq5c{display:inline-flex;align-items:center;gap:12px}
.licq5sp{display:block;width:120px;height:28px;flex:0 0 120px}
.licq5s,.licq5lg{display:flex;align-items:center;flex-wrap:wrap;gap:8px 20px;font-size:12.5px;
  color:var(--text-color-common-secondary)}
.licq5k{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.licq5k i{display:block;flex:0 0 10px;width:10px;height:10px;border-radius:2px}
.licq5k b{font-weight:600;color:var(--page-text-color)}
.licq5k em{font-style:normal;color:var(--neutral-regular)}
.licq5ty{display:grid;gap:12px}
.licq5l{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--neutral-regular)}
.licq5stk{display:flex;width:100%;height:10px;overflow:hidden;border-radius:var(--btn-radius);
  background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
.licq5stk i{display:block;height:100%;flex:0 0 auto}

/* the days-left ring (\`licRingHTML\`) — built for Option 2's FIRST design (12 Sep 2026), parked
   for two days, and IN USE AGAIN since 14 Sep as Option 4's ring (sized to 120px there). */
.licring{width:128px;height:128px;display:block}
.licringv{font-size:27px;font-weight:700;fill:var(--primary-alt)}
.licringl{font-size:8.5px;font-weight:600;letter-spacing:.1em;fill:var(--neutral-regular)}.lictbt{font-size:14px;font-weight:600;color:var(--primary-alt)}
.lichint{font-size:11.5px;color:var(--text-color-common-secondary)}
/* Option 2: the head sits 24px under the licence card and 8px over the first card — the grid's own
   8px in Option 1 — so the first card drops its 16px top margin inside the block */
.licx + .lictb, .lic4 + .lictb{margin-top:24px}
.licqcards > :first-child{margin-top:0}
.lictb obs-radio{display:block}
.liclegend{display:inline-flex;gap:6px}

/* ── widget tiles: the \`widget\` toolbar draws the rounded TOP of the frame, the body the rest ── */
.licgrid2{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px}
.lictiles{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.lictile.full{grid-column:1/-1}
.lictileb{padding:10px 12px 8px;border:1px solid var(--border-color);border-top:none;border-radius:0 0 4px 4px;background:var(--common-widget-bg)}
.lictileb obs-metric-list{margin:0 0 6px}

/* ── Option 5's EPS tab: four individual stat cards (lic5EpsHTML) ─────────────────────────────
   From a supplied strip — HARDWARE CEILING · ALLOCATED · INGESTED LIVE · DROP STATUS — split into
   one card per figure on Option 5's own borderless surface (--lic5-surface, the 1px border kept
   transparent so no box shrinks against its neighbours). Label over a mono figure over a caption,
   as the strip reads. The figure takes the DS's --numeric-font-family (JetBrains Mono).
   ⚠️ A NAMED container, so the Option 5 cards' unnamed container queries elsewhere on the page
   are not answered by this wrapper. 4 across, 2 under 720px of pane, 1 under 360px. */
.lice5{container:lice5 / inline-size;display:grid;gap:16px}
/* the note under the cards (request, same day: the drop policy the old tab carried, as a note) —
   obs-banner's info variant, lead-in in its title, the two rules in the slot as a label | text grid
   so both sentences start on one column. ⚠️ The slot is light DOM, so page CSS reaches it; nothing
   goes in a style attribute on the host (Vue forwards that into the shadow root). */
.lice5n{display:block}
.lice5nr{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:12px;row-gap:4px}
.lice5nr b{font-weight:600;color:var(--page-text-color)}
/* the allocation card (lic5AllocHTML) — the stat cards' surface, a taller rhythm inside.
   Bar tokens: headroom --neutral-lightest, the allocated band --progress-bar-bg (the DS progress
   track), ingested --info-text (the DS blue — the chart palette has none, and the live card's
   ingested fill is the same blue as its Allocated figure, so the card above takes it too),
   over-quota --secondary-red, the allocation marker --secondary-yellow. */
.lice5a{gap:16px}
.lice5tb{display:block}
.lice5rows{display:grid;gap:14px}
.lice5r{display:grid;gap:8px;min-width:0}
.lice5rh{display:flex;align-items:center;gap:8px;min-width:0;font-size:12px;line-height:16px}
.lice5rh > b{font-weight:600;color:var(--page-text-color)}
.lice5sw{flex:0 0 8px;width:8px;height:8px;border-radius:2px}
.lice5rs{font-size:11px;color:var(--text-color-common-secondary);white-space:nowrap}
.lice5rf{margin-left:auto;font-size:11.5px;color:var(--text-color-common-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}
.lice5rf b{font-weight:600;color:var(--page-text-color)}
.lice5bar{position:relative;height:8px;border-radius:var(--btn-radius);background:var(--neutral-lightest)}
.lice5bar i{position:absolute;top:0;bottom:0;left:0}
.lice5bar .al{background:var(--progress-bar-bg);border-radius:4px 0 0 4px}
.lice5bar .in{background:var(--info-text);border-radius:4px 0 0 4px}
.lice5bar .ov{background:var(--secondary-red);border-radius:0 4px 4px 0}
/* the marker overhangs the 8px bar by 3px each side, as on the live card; centred on its value */
.lice5bar .mk{top:-3px;bottom:-3px;width:2px;margin-left:-1px;border-radius:1px;background:var(--secondary-yellow)}
.lice5lg{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px 16px;
  font:11px/14px var(--chart-font-family);color:var(--chart-legend-color)}
.lice5lg span{display:inline-flex;align-items:center;gap:6px}
.lice5lg i{width:10px;height:10px;border-radius:2px}
.lice5lg .al{background:var(--progress-bar-bg)}
.lice5lg .in{background:var(--info-text)}
.lice5lg .ov{background:var(--secondary-red)}
/* the per-telemetry line charts (lic5TrendHTML). The section sits 24px under the allocation card
   (the wrapper's 16px gap + 8px) with its head 8px over the first card — the rhythm every
   section head on this page keeps. The legend's keys are LINE samples, since the series are lines. */
.lice5t{display:grid;gap:8px;margin-top:8px}
.lice5lk i{width:14px;height:0;border-radius:0;background:none;border-top:2px solid}
.lice5lk .in{border-top-color:var(--page-text-color)}
.lice5lk .dr{border-top-color:var(--secondary-red)}
.lice5lk .al{border-top:1px dashed var(--neutral-light)}
.lice5lk i.in,.lice5lk i.dr,.lice5lk i.al{background:none}   /* (0,2,1) — the allocation card's .lice5lg .al/.in fills (0,2,0) would show through the dashes */
.lice5tg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.lice5k{gap:8px}
.lice5k.full{grid-column:1 / -1}   /* no top accent line — removed on request, 15 Sep 2026 */
.lice5kh{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;line-height:16px;color:var(--page-text-color)}
.lice5kh .lice5sw{background:var(--lice5-tone)}
.lice5khr{display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;min-width:0}
.lice5ktg{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}
.lice5k.full .lice5kh{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--lice5-tone)}
.lice5kf{font-size:12px;color:var(--text-color-common-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}
.lice5kf b{margin-right:2px;font-size:22px;line-height:28px;font-weight:600;color:var(--page-text-color)}
.lice5hc{height:96px;margin:4px 0;min-width:0}
.lice5hc.lice5hct{height:118px}
.lice5hct .lice5ch{height:96px}
.lice5ax{position:relative;height:22px;font-size:11px;line-height:26px;color:var(--neutral-light);font-variant-numeric:tabular-nums;
  border-top:1px solid var(--field-border-color)}
.lice5ax span{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.lice5ax span::before{content:'';position:absolute;left:50%;top:0;width:1px;height:5px;background:var(--field-border-color)}
/* ⚠️ Highcharts writes overflow:hidden INLINE on its container, which would clip the tooltip at the
   chart's 96px; !important is the only thing that outranks an inline declaration */
.lice5hc .highcharts-container{overflow:visible!important}
.lice5ch{display:block;width:100%;height:100%}
/* Highcharts' HTML tooltip (rendered inside the card, so these page rules reach it) */
.lice5th{display:block;margin:0 0 4px;color:var(--text-color-common-secondary)}
.lice5tr{display:flex;align-items:center;gap:6px;min-width:128px;line-height:16px}
.lice5tr i{width:8px;height:8px;border-radius:2px}
.lice5tr b{margin-left:auto;padding-left:12px;font-weight:600;color:var(--page-text-color)}
.lice5tr.al i{height:0;border-top:1px dashed var(--neutral-light);border-radius:0}
.lice5kx{display:flex;justify-content:space-between;gap:12px;font-size:11px;color:var(--text-color-common-secondary);font-variant-numeric:tabular-nums}
.lice5kx b{font-weight:600;color:var(--page-text-color)}
@container lice5 (max-width:720px){ .lice5tg{grid-template-columns:minmax(0,1fr)} }
.lice5g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.lice5c{display:flex;flex-direction:column;gap:4px;min-width:0;padding:16px 24px;
  border:1px solid transparent;border-radius:var(--btn-radius);background:var(--lic5-surface)}
/* ⚠️ OPTION 4's EPS CARDS ARE ITS USAGE-TAB CARDS (request, 15 Sep 2026: "add the card border like the License & Quota Usage
   tab, and apply [its] card padding"): the same 1px --widget-border-color edge, 10px padding and --common-widget-bg fill as
   .lic4 / .licm4 / .licg4c — the stat cards, the allocation card and the five trend cards. The fill matters in light only,
   where Option 5's borderless wash would sit inside a border on the white pane. Option 5 keeps its borderless cards. */
.lice5.lice5o4 .lice5c{padding:10px;border-color:var(--widget-border-color);background:var(--common-widget-bg)}
/* Option 4's allocation card: 14px between the title row and the first signal row (request, 16 Sep 2026 — asked as 10px,
   then 14px). The card's flex
   gap is 4px — \`.lice5c{gap:4px}\` comes later in the sheet than \`.lice5a{gap:16px}\` at the same weight, so that 16px never
   applied — and the toolbar's 10px margin makes up the rest. */
.lice5.lice5o4 .lice5a > .lice5tb{margin-bottom:10px}
/* the stat cards' labels read in sentence case on Option 4 (request, 15 Sep 2026: "the title text will be small and [the]
   first letter capital") — the markup already is ("Hardware ceiling"); only the uppercase transform and its tracking go */
.lice5.lice5o4 .lice5l{text-transform:none;letter-spacing:0}
.lice5l{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:var(--text-color-common-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lice5v{margin-top:4px;font:600 22px/28px var(--numeric-font-family);font-variant-numeric:tabular-nums;
  color:var(--page-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lice5s{font-size:12px;line-height:16px;color:var(--text-color-common-secondary);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@container lice5 (max-width:720px){ .lice5g{grid-template-columns:repeat(2,minmax(0,1fr))} }
@container lice5 (max-width:360px){ .lice5g{grid-template-columns:minmax(0,1fr)} }

/* ── the history drawer's body and footer ───────────────────────────────────────────────── */
#licHist{display:grid;gap:16px}
.lichtop{display:flex;align-items:center;gap:12px}
.lichrng{margin-left:auto;display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--neutral-regular)}
.lichrng obs-radio{display:block}
#licHist obs-metric-list{display:block}
.lichchart{padding:4px 0 0}
.lichaxis{display:flex;justify-content:space-between;font-size:10.5px;color:var(--neutral-regular)}
.lichaxis .cap{color:var(--secondary-red)}
.lichf{display:flex;align-items:center;gap:8px;width:100%}
/* Option 5's history modal (see licHistMdHTML), Metric Explorer's chart-popup layout: one head row,
   the chart across the width, a facts row. Every line is on the 16 / 24 scale; the head's rule is the
   one divider, as in the reference. */
.lichx{display:flex;flex-direction:column;min-height:0}
.lichxh{display:flex;align-items:center;gap:16px;padding:12px 16px 12px 24px;border-bottom:1px solid var(--border-color)}
.lichxtt{flex:1 1 auto;min-width:0;display:flex;align-items:baseline;gap:16px}
.lichxt{min-width:0;font-size:16px;font-weight:600;color:var(--page-text-color);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lichxtok{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--text-color-common-secondary);white-space:nowrap}
.lichxr{flex:0 0 auto;display:flex;align-items:center;gap:16px}
.lichxr obs-radio{display:block}
.lichxd{display:flex;flex-direction:column;gap:2px;font-size:12px;line-height:1.3;color:var(--text-color-common-secondary);
  font-variant-numeric:tabular-nums;white-space:nowrap}
.lichxc{padding:16px 24px 0}
.lichxcap{display:flex;justify-content:center;padding:4px 0 0;font-size:11px;color:var(--secondary-red)}
.lichxf{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;padding:16px 24px 24px}
.lichxv{display:flex;flex-direction:column;gap:4px;min-width:0}
.lichxv span{font-size:12px;color:var(--text-color-common-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lichxv b{display:flex;align-items:center;gap:6px;font-size:18px;font-weight:600;color:var(--page-text-color);
  font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lichxv b em{font-style:normal;font-weight:400;color:var(--text-color-common-secondary)}
.lichxv.cur b{color:var(--lichm-a)}
.lichxv.up b{color:var(--secondary-green)}
.lichxsw{flex:0 0 10px;width:10px;height:10px;border-radius:2px;background:var(--lichm-a)}
/* narrow screens WRAP the head row rather than hide any of its details */
@media (max-width:1100px){ .lichxh{flex-wrap:wrap} .lichxr{flex-wrap:wrap} }
.lichnote{margin-right:auto;font-size:11.5px;color:var(--text-color-common-secondary)}

/* ── the activation modal ───────────────────────────────────────────────────────────────── */
.licact{display:grid;gap:12px;padding:4px 0}
.liccode{display:flex;align-items:flex-end;gap:8px}
.liccode obs-input{flex:1;min-width:0}
.licact obs-input{display:block}
.lichelp{margin:0;font-size:12.5px;line-height:1.5;color:var(--text-color-common-secondary)}
.lichelp2{margin:0;font-size:11.5px;color:var(--neutral-regular)}
.licactf{display:inline-flex;gap:8px}

/* below 1366 the pane is ~950px with the settings list open: the Edition widget takes the full
   row and Validity · Support share the next, rather than three ~300px columns or one tall stack */
@media (max-width:1366px){
  .licwids{grid-template-columns:1fr 1fr}
  .licwids .licwid:first-child{grid-column:1/-1}
}
@media (max-width:1280px){
  .licgrid2,.lictiles{grid-template-columns:1fr}
  .lictile.full{grid-column:auto}
}
@media (max-width:1024px){ .licwids{grid-template-columns:1fr} }

/* ── ONE VERTICAL RHYTHM FOR THE CONFIG FORM ───────────────────────────────────────────────
   Request, 2 Sep 2026: "make to proper alignment in 3 section and same spacing for all field".
   MEASURED FIRST, because the horizontal reading was wrong: every block already shared an x of
   334 and a right edge of 1054, and the routing labels are NOT clipped (scrollWidth ==
   clientWidth on all seven — the ragged last letters in the screenshot are JPEG artifacts).
   The fault was entirely VERTICAL, and it was five different values doing one job:

     4  heading -> helper           16 helper -> fields          16 fields -> Advanced
     0  Advanced -> "Model selection"          <-- a SECTION HEADING with nothing above it
     17 label -> radios             79 radios -> routing panel
     0  routing panel -> "Review data sharing" <-- the other one
     12 heading -> banner           16 panel -> panel

   ⚠️ THE TWO ZEROS ARE THE WHOLE COMPLAINT. \`.agcfgh\` is \`margin:0 0 4px\` — no top margin — so
   it depended on whatever sat above it, and since the wizard was flattened into one page
   (2 Sep 2026) what sits above it is the previous section's last panel. Sections 2 and 3 opened
   flush against it, so three sections read as one continuous run. Every other number here was
   an inline \`style="margin-top:…"\` written at the call site: four of them, one of which said 24
   where its neighbours said 16.

   So spacing is declared ONCE, here, and the inline styles are gone from \`_settings-module.js\`:

     .agfbody > *                  16px  @padding-md — every field, panel, banner and control
     .agfbody > .agcfgp             4px  the helper line belongs to the heading above it
     .agfbody > .agcfgh ~ .agcfgh  32px  a NEW SECTION

   ⚠️ 32 = 2 x @padding-md, not an eyeballed number. The scale tops out at @padding-lg 24, and
   24 against 16 inside is a 1.5x ratio that barely reads — this file has already recorded that
   lesson twice (\`.aiab li\`, \`.aichips\`): THE GAP BETWEEN GROUPS MUST BEAT THE GAP INSIDE ONE.
   A multiple of the scale keeps the conformance checker happy, where 18/22/28 scored layout 38.
   ⚠️ \`.agfbody > *\` is (0,1,0) and TIES with \`.agsub\` / \`.agadv\` / \`.agrow2\` / \`.agtn\`, so this
   block only wins by SOURCE ORDER. It has to stay at the end of this file.
   ⚠️ \`.agfbody > .agcfgh ~ .agcfgh\` reads "an .agcfgh with another .agcfgh somewhere before it",
   which is exactly every section heading except the first — no wrapper markup, no :not(), and
   the done screen (\`.agdone\`, no \`.agcfgh\`) is untouched.
   ⚠️ Section 3 goes heading -> banner at 16 where 1 and 2 go heading -> helper at 4. That is the
   rule being consistent, not breaking: a banner is content, a \`<p class="agcfgp">\` is the
   heading's own subtitle. Giving section 3 a helper line purely for symmetry would be inventing
   copy. */
.agfbody > *{margin-top:16px}
.agfbody > :first-child{margin-top:0}
.agfbody > .agcfgp{margin-top:4px}
.agfbody > .agcfgh ~ .agcfgh{margin-top:32px}
/* ⚠️ \`obs-radio\` IS AN UNKNOWN ELEMENT, SO IT DEFAULTS TO \`display:inline\` — it measured 341px
   wide inside a 720px form and its rect stopped 55px short of its own painted rows, which is
   where the phantom "79px gap" above the routing panel came from. \`.agcfgm obs-input\` already
   carries the same fix for the same reason; the radio group never got one. Nothing moves
   visually except that the gap below it is now the 16px it always claimed to be. */
.agfbody obs-radio{display:block}
`;

(function () {
  if (document.getElementById('settings-css')) return;
  var st = document.createElement('style');
  st.id = 'settings-css';
  st.textContent = SETTINGS_CSS;
  (document.head || document.documentElement).appendChild(st);
})();

/* ── The design system's own corners, set to 4px (14 Sep 2026) ────────────────────────────
   Request: "in all option of setting module … all box radius will be apply 4px". PART 1 sets
   every corner this module draws itself, and `--btn-radius` reaches the design system's
   buttons through a token (`--widget-border-radius` went 7px → 4px with it, though nothing in
   the bundle reads it today) — but most `obs-*` corners are LITERALS inside each
   component's shadow root (the widget header's 6px top, the modal's 16px, the banner's and the
   menus' 6px, a status tag's 10px pill, a checkbox's 3px). Page CSS cannot reach them and no
   component exposes a `::part` for them (checked in the bundle).
   ⚠️ THE WIDGET HEADER IS THE ONE THAT HAD TO FOLLOW. `obs-toolbar variant="widget"` draws the
   top of a widget frame whose body is painted here (`.lictileb`, and the Agentic AI trend
   tiles' inline body) at `0 0 4px 4px`; changing only the body would leave a 6px top over a
   4px bottom.
   ⚠️ SO EACH SHADOW ROOT ADOPTS ONE SMALL SHEET, keyed by the element's tag. It is attached in
   `attachShadow`, which the bundle's custom-element base class calls once per instance in its
   constructor, and an ADOPTED sheet is ordered after a shadow root's own `<style>`s in the
   cascade — so every rule below wins its tie with the component's own, no `!important`.
   Elements nested inside another component (an `obs-tag` in an `obs-table` cell) are built by
   the same constructor and are covered by the same hook.
   ⚠️ SCOPED BY CONSTRUCTION, NOT BY SELECTOR: the `obs-*` elements are rendered by this module
   and nothing else in any page (each page carries one `obs-icon`, which has no entry here).
   ⚠️ LEFT ROUND ON PURPOSE: circles (radio marks, avatars, step markers), the switch track
   (`obs-switch`, the same call as `.stsw`), and marks too small to read as boxes (a table's 6px
   bar cell, a 2px swatch).
   ⚠️ RE-CHECK IF `_ds/` IS UPGRADED — these are the v0.1.166 class names, and a renamed class
   stops matching silently. */
(function () {
  var R = {
    'obs-toolbar':   '.tb.v-widget{border-radius:4px 4px 0 0}.tb.v-bulk{border-radius:4px}',
    'obs-modal':     '.modal,.modal.confirm{border-radius:4px}' +
                     /* Option 5's history popup draws its own head row (see licHistMdHTML) */
                     ':host(.lichmx) .head,:host(.lichmx) .foot{display:none}:host(.lichmx) .body{padding:0}',
    'obs-banner':    '.bn{border-radius:4px}',
    'obs-key-value': '.kv.v-card{border-radius:4px}',
    'obs-tag':       '.rounded{border-radius:4px}' +
                     /* Option 2's edition chip: the live license-hero-chip gradient (see .licxname) */
                     ':host(.licxchip) .tag{background:linear-gradient(135deg,var(--license-accent),var(--license-violet));' +
                     'color:var(--license-on-accent);font-weight:600}',
    'obs-severity':  '.chip{border-radius:4px}',
    'obs-checkbox':  '.box{border-radius:4px}',
    'obs-select':    '.val-pop,.t-badge,.pill,.pill-pop,.menu,.cbx{border-radius:4px}',
    'obs-menu':      '.menu,:host([bordered]) .dots{border-radius:4px}',
    /* ⚠️ THE SECOND RULE IS THE AGENTIC AI GRID'S, NOT A RADIUS, AND IT IS A STATED COMPROMISE.
       Its Connection column has to show a STATUS on one row and a BUTTON on the others, and an
       `obs-table` column has exactly one cell type — there is no `html` type (the full list is
       heat / bar / severity / dot / status / type / tags / sparkline / switch / icon / link /
       button). So the column is `button` throughout and the connected row's cell is painted as the
       DS's own green tag and made inert: `pointer-events:none` plus `cursor:default`, so it cannot
       be pressed or hovered like its neighbours. It is still a `<button>` element underneath.
       ⚠️ `variant="agactive"` IS A NAME OF OURS, not a DS variant — obs-button reflects whatever it
       is given onto the host (probed), so this selector cannot collide with a real variant used by
       any other table in the module. The values are `obs-tag`'s own, read from its shadow CSS. */
    'obs-table':     '.ppage,.psize{border-radius:4px}' +
      /* the host only has to stop behaving like a button; the PAINT is on the inner <button>,
         in obs-button's own sheet below — see the note there */
      '.cell-btn[variant="agactive"]{pointer-events:none;cursor:default}',
    /* ⚠️ THIS IS THE AGENTIC AI GRID'S ACTIVE CELL, NOT A RADIUS, AND IT IS A STATED COMPROMISE.
       Its Connection column has to show a STATUS on one row and a BUTTON on the others, and an
       `obs-table` column has exactly one cell type — there is no `html` type (the full list is
       heat / bar / severity / dot / status / type / tags / sparkline / switch / icon / link /
       button). So the column is `button` throughout and the connected row's cell is painted as the
       DS's own green tag and made inert. It is still a `<button>` element underneath.
       ⚠️ IT MUST PAINT THE INNER `.btn`, NOT THE HOST — and getting that wrong is what put a second
       box behind the chip (reported 16 Sep 2026 as "the Active will be overlap"). obs-button renders
       `<button class="btn v-agactive s-small">` inside its OWN shadow root and that element carries
       the variant's background, border and min-height; a rule on the host from obs-table's sheet
       painted a green box *around* a default-styled button, so both were visible.
       ⚠️ `variant="agactive"` IS A NAME OF OURS, not a DS variant — obs-button reflects whatever it
       is given onto the host (probed), so `:host([variant="agactive"])` cannot touch any other
       button in the module. The values are `obs-tag`'s own, read from its shadow CSS. */
    'obs-button':    ':host([variant="agactive"]) .btn{border:0;min-height:0;height:22px;' +
      'font-size:.7rem;font-weight:500;line-height:22px;padding:0 8px;border-radius:4px;box-shadow:none;' +
      'color:var(--secondary-green,#14b053);background:var(--secondary-green-lightest,rgba(54,213,118,.2))}'
  };
  if (!window.ShadowRoot || !('adoptedStyleSheets' in ShadowRoot.prototype)) return;
  var orig = Element.prototype.attachShadow;
  if (orig.__stRadius) return;
  var made = {};
  function adopt(root, tag) {
    if (!root || !R[tag]) return;
    var sh = made[tag];
    if (!sh) { sh = made[tag] = new CSSStyleSheet(); sh.replaceSync(R[tag]); }
    if (root.adoptedStyleSheets.indexOf(sh) < 0) root.adoptedStyleSheets = root.adoptedStyleSheets.concat(sh);
  }
  var hook = function (init) { var root = orig.call(this, init); adopt(root, this.localName); return root; };
  hook.__stRadius = true;
  Element.prototype.attachShadow = hook;
  document.querySelectorAll(Object.keys(R).join(',')).forEach(function (el) { adopt(el.shadowRoot, el.localName); });
})();


/* ══════════════════════════════════════════════════════════════════════════════════════════
   PART 2 of 2 — THE MARKUP AND THE BEHAVIOUR
   ──────────────────────────────────────────────────────────────────────────────────────────
   Everything below is `_settings-module.js` verbatim: the `<section id="view-settings">`
   chrome it injects, then the `st*`, `stc*` and `ag*`/`lic*` blocks. Its own header comment
   follows and still describes the contract exactly; only its address changed.
   ══════════════════════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════════════════════
   _settings-module.js — the Settings module: its markup and all of its behaviour
   ──────────────────────────────────────────────────────────────────────────────────────────
   Lifted OUT of `index copy.html` on 1 Sep 2026 (request: "all setting code move in new
   file"). It carries, byte for byte, the three `<script>` blocks that were at the end of that
   file plus the `<section id="view-settings">` chrome that was in its body:

     · `st*`  — Settings › My Account › My Profile, cloned from live 8.2.7
     · `stc*` — Compliance Settings: Compliance Policy · Benchmark · Rules
     · `ag*`  — Settings › Agentic AI › Overview, built on the real ObserveOps design system

   Its stylesheet is PART 1 of this same file (it was the sibling `_settings-module.css` until
   12 Sep 2026).

   ── THE LOAD-ORDER CONTRACT ───────────────────────────────────────────────────────────────
   ⚠️ IT IS A PLAIN, PARSER-BLOCKING `<script src>` — no `defer`, no `async`, no `type=module`.
   All three blocks were classic inline scripts and their top-level `const`/`let`/`function`
   declarations land in the SAME global scope from here, which is the only reason the host
   page's `stInit()`, `stOpen()`, `ST_TREE` and `ST_ICO` references still resolve. A module
   script would put every one of them in module scope and the rail's Settings entry would
   throw on the first click.
   ⚠️ IT MUST LOAD **AFTER** `_ds/observeops-elements.umd.js`. The `ag*` block's screen is
   built out of real `obs-*` custom elements; the page keeps that tag immediately above this
   one, which is where it already sat between the `stc*` and `ag*` blocks.
   ⚠️ IT MUST LOAD **BEFORE** anything can open Settings — i.e. before the Agentation loader
   and `_variants.js`, at the position the blocks already occupied. Nothing in the host page
   reads from here at load: `ST_ICO` is read through a function (`layPIc`), `ST_TREE` is
   derived lazily on first hover and cached, and `stInit` / `stOpen` are click handlers.
   Verified before the move — those four are the ONLY runtime references from outside; every
   other `st*`/`stc*`/`ag*` mention in that file is prose in a comment.

   ── THE MARKUP IS INJECTED ────────────────────────────────────────────────────────────────
   ⚠️ Inserted BEFORE `#view-manage`, which is exactly where it was authored, rather than
   appended to `.main`. Nothing keys off sibling order today, but `.view` sections are toggled
   by a class and a stack of them in the wrong order is the kind of thing that only shows up
   later, on a z-index question.
   ⚠️ The injection runs at parse time of this file, so `#view-settings` exists long before any
   click can reach it. It is guarded on `.main` existing so the file cannot throw on a page
   that has no shell.
   ══════════════════════════════════════════════════════════════════════════════════════════ */

var SETTINGS_VIEW_HTML = "    <!-- ══════ SETTINGS MODULE — My Account › My Profile, cloned from live 8.2.7 (19 Aug 2026) ══════\n         Chrome is authored here; the list and the page are rendered by the st* script\n         block at the end of the file. See that block's header comment. -->\n    <section class=\"view\" id=\"view-settings\">\n      <div class=\"pagehead\">\n        <button class=\"stpt\" id=\"stPanelBtn\" data-tip=\"Hide settings menu\" onclick=\"stHeadBtn()\"></button>\n        <span class=\"stsep\" id=\"stHeadSep\"></span>\n        <svg class=\"ic\" viewBox=\"0 0 48 48\" id=\"stHeadIc\"></svg>\n        <span class=\"ttl\" id=\"stHeadTtl\">Settings</span>\n        <span style=\"flex:1\"></span>\n        <!-- full-page screens (Create Benchmark, Create Rule …) carry the product's (i) help toggle -->\n        <button class=\"stpt stinfo\" id=\"stHeadInfo\" data-tip=\"Help\" hidden onclick=\"stFullInfo()\"></button>\n      </div>\n      <div class=\"stwrap\">\n        <aside class=\"stnav\" id=\"stNav\">\n          <div class=\"stsearch\"><svg viewBox=\"0 0 48 48\" id=\"stSearchIc\"></svg>\n            <input id=\"stQ\" placeholder=\"Search\" autocomplete=\"off\" oninput=\"stSearch(this.value)\"\n                   onkeydown=\"if(event.key==='Escape'){this.value='';stSearch('')}\"></div>\n          <div class=\"stlist\" id=\"stList\"></div>\n        </aside>\n        <div class=\"stmain\" id=\"stMain\"></div>\n      </div>\n    </section>";

(function () {
  var main = document.querySelector('main.main');
  if (!main || document.getElementById('view-settings')) return;
  /* ⚠️ THE ANCHOR IS TRIED IN AUTHORED ORDER, NOT ASSUMED. `#view-settings` was authored
     immediately before `#view-manage` in the options that have a Manage screen (1, 4) and
     immediately before `#view-logexp` in the ones that do not (2, 3). Testing only the first
     would append Settings at the END of `.main` on those two — a different sibling order from
     the one they shipped with, and `.view` sections are toggled by a class, so a stack of them
     in the wrong order is the kind of thing that only surfaces later, on a z-index question. */
  var anchor = document.getElementById('view-manage') || document.getElementById('view-logexp');
  var slot = document.createElement('div');
  slot.innerHTML = SETTINGS_VIEW_HTML;
  var node = slot.firstElementChild;
  if (anchor) main.insertBefore(node, anchor); else main.appendChild(node);
})();



/* ══════════════════════════════════════════════════════════════════════════════════════════
   BLOCK 1 of 3 — `st*` · the Settings module itself
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════════
   SETTINGS MODULE  —  a clone of the live product's Settings › My Account › My
   Profile, read on build 8.2.7 on 19 Aug 2026 at /settings/my-account/my-profile
   through the browser: the DOM, the computed styles, the Vue component's own
   render template and its validation rules (FlotoFormItem / vee-validate), and
   every state driven by hand — the Change Password switch, the eye toggles,
   a failed submit, Reset, the left list's search and the head's collapse.

   WHY ITS OWN <script>: these files are one flat script, so a second
   `function foo()` silently wins. Everything here is namespaced `st` —
   `st*()` functions, `ST_*` constants, `.st*` classes — and it borrows only
   toast(), showView() and selectModuleByName() from the host page. The same
   three blocks (CSS, markup, this script) are in all three options byte for
   byte, so a change here has to be made three times.

   WHAT WAS COPIED, all measured rather than invented:
     · the head       — ‹ collapse · ⚙ · Settings. The chevron hides the left
       list (width → 0, icon flips), exactly what the live one does.
     · the left list  — Search, then the product's 18 categories in its order
       (plus `Agentic AI`, the one category that is NOT on the instance — see the
       note at ST_TREE's tail), each with the product's own icon (harvested SVG
       paths), collapsible,
       BETA tag on Service Level Objective; every sub-page under every
       category (ST_TREE carries the live route of each). Search matches a
       category name (shows all its pages) or a page name, case-insensitive
       substring, and expands what it matched — verified with “prof”,
       “utility”, “ACCOUNT”, “PING” on the live list.
     · My Profile     — 120px avatar circle with the initials (first[0]+last[0],
       live off the two name fields), Change → file picker (JPEG/JPG/PNG/SVG,
       anything else is refused with the live error text) → “Change | Remove”;
       First Name* · Last Name* · User Name* (disabled, “Must be unique”) ·
       Email Address* · Mobile Number · Change Password OFF/ON → Current
       Password* · Password* (“Do not use simple password”) · Confirm Password*
       (“Same as the password field”, paste disabled) each with an eye toggle;
       Reset · Update My Profile.
     · validation     — the component's own rules: names required + /^[a-zA-Z
       \s'\-]{1,50}$/, email required + email, mobile numeric 8–12, current
       password required, password required + the instance's policy (min 6,
       special, number, lower, upper; max 64), confirm required + must match.
       Messages are the ones the live form printed (“The Email Address field
       must be a valid email”, “Password must be at least 6 characters long”,
       “The Password field confirmation does not match”).
       ⚠️ A REQUIRED-EMPTY field shows NO message on live — only the label and
       the underline turn red (the explain is rendered display:none). Reproduced.
     · Reset          — reloads the saved values, drops a picked picture, clears
       the errors and the password fields. ⚠️ Live leaves the Change Password
       switch where it was (onReset never touches isChangePassword). Reproduced.
     · Update         — button shows a spinner, then the saved values replace
       the draft, the switch goes OFF, the password fields empty, the signed-in
       identity in the header / profile popover refreshes (live: refreshUser()).

   DELIBERATE DIFFERENCES, so nothing here is mistaken for the live product:
     · the seed identity is read off the page's own signed-in user (#sbUser),
       the e-mail is on example.com (repo scrub rule) — live was a real address.
     · the primary button is this prototype's teal; live paints a white button
       on the dark theme. The success toast text is ours — the form was never
       actually submitted against the instance.
     · the picked picture is shown circle-cropped; live runs vue-croppa (drag to
       pan, wheel to zoom) — not reproduced.
     · every other settings page (UI Preference, License, the 17 other
       categories) lands on a placeholder that names the live route.
   ═══════════════════════════════════════════════════════════════════════════ */
const ST_ICO = {
  "my-account": "M15.3,31.4c1,0,1.8-.8,1.8-1.7,0-3.8,3.1-6.8,6.9-6.9,0,0,0,0,0,0s0,0,0,0c3.8,0,6.8,3.1,6.9,6.9,0,1,.8,1.7,1.8,1.7h0c1,0,1.7-.8,1.7-1.8,0-3.9-2.2-7.3-5.4-9.1,1.1-1.2,1.8-2.9,1.8-4.7,0-3.8-3.1-6.9-6.9-6.9s-6.9,3.1-6.9,6.9,.7,3.4,1.8,4.7c-3.2,1.8-5.4,5.2-5.4,9.1,0,1,.8,1.8,1.7,1.8ZM24,12.6c1.9,0,3.4,1.5,3.4,3.4s-1.5,3.3-3.3,3.4c0,0,0,0,0,0s0,0,0,0c-1.8,0-3.3-1.5-3.3-3.4s1.5-3.4,3.4-3.4ZM38.3,2.2H9.7c-2.7,0-4.9,2.2-4.9,4.9V40.9c0,2.7,2.2,4.9,4.9,4.9h28.6c2.7,0,4.9-2.2,4.9-4.9V7.1c0-2.7-2.2-4.9-4.9-4.9Zm1.4,38.6c0,.8-.6,1.4-1.4,1.4H9.7c-.8,0-1.4-.6-1.4-1.4V7.1c0-.8,.6-1.4,1.4-1.4h28.6c.8,0,1.4,.6,1.4,1.4V40.9Zm-5.7-6.6H14c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h20.1c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Z",
  "user-settings": "M19.7,35.4c-.4-.2-.9-.3-1.3-.5-1.1-.5-2.4-.3-3.3,.6l-2.5,2.5-3.1-3.1,2.4-2.4c.9-.9,1.1-2.2,.6-3.4-.2-.4-.4-.9-.6-1.4-.4-1.2-1.5-1.9-2.7-1.9h-3.4v-4.4h3.3c1.2,0,2.4-.8,2.8-2,.2-.5,.4-1,.6-1.4,.5-1.1,.3-2.4-.5-3.3l-2.3-2.3,3.1-3.1,2.3,2.3c.9,.9,2.2,1.1,3.3,.6,.4-.2,.9-.4,1.3-.5,1.2-.4,2-1.5,2-2.8v-3.3h4.4v3.3c0,1.2,.8,2.3,1.9,2.8,.5,.2,1,.4,1.4,.6,1.1,.6,2.5,.3,3.4-.5l2.4-2.3,3.1,3.1-2.4,2.4c-.9,.9-1.1,2.2-.6,3.3,.2,.4,.3,.7,.4,1.1,2.2,.1,4.3,1,5.9,2.3l.4,.3c1.6,1.4,2.8,3.4,3.4,5.5,0-.3,.1-.6,.1-.9v-5.6c0-1.6-1.3-2.9-2.9-2.9h-3.6c-.1-.3-.2-.6-.4-.9l2.6-2.6c.6-.6,.9-1.3,.9-2.1,0-.8-.3-1.5-.8-2.1l-4-4c-.6-.6-1.3-.9-2.1-.9-.8,0-1.5,.3-2.1,.8l-2.5,2.5c-.3-.2-.7-.3-1-.4v-3.5c0-1.6-1.3-2.9-2.9-2.9h-5.6c-1.6,0-2.9,1.3-2.9,2.9v3.4c-.3,.1-.6,.2-.9,.4l-2.4-2.5c-.5-.6-1.3-.9-2.1-.9-.8,0-1.5,.3-2.1,.8l-4,3.9c-1.1,1.1-1.2,3,0,4.1l2.4,2.5c-.2,.3-.3,.7-.4,1h-3.5c-1.6,0-2.9,1.3-2.9,2.9v5.6c0,1.6,1.3,2.9,2.9,2.9h3.6c.1,.3,.3,.6,.4,1l-2.6,2.5c-.6,.6-.9,1.3-.9,2.1,0,.8,.3,1.5,.8,2.1l4,4c1.1,1.1,3,1.1,4.1,0l2.6-2.6c.3,.1,.6,.2,.8,.3v3.7c0,1.5,1.1,2.7,2.5,2.9,0-.3,0-.7,0-1,0-1.9,.4-3.7,1.1-5.4v-.7c0-1.2-.8-2.4-2-2.8Zm20.4-.6c1.2-1.3,2-3,2-4.9,0-3.9-3.2-7.1-7.1-7.1s-7.1,3.2-7.1,7.1,.7,3.6,2,4.9c-3.4,1.8-5.7,5.4-5.7,9.5,0,.5,.2,.9,.5,1.3,.3,.3,.8,.5,1.3,.5h18.1c.5,0,.9-.2,1.3-.5,.3-.3,.5-.8,.5-1.3,0-4.1-2.3-7.6-5.7-9.5Zm-5.1-8.4c2,0,3.6,1.6,3.6,3.6s-1.6,3.5-3.5,3.6c0,0-.1,0-.2,0-1.9,0-3.5-1.6-3.5-3.6s1.6-3.6,3.6-3.6Zm-7.1,16.1c.8-3.1,3.6-5.4,6.9-5.5,0,0,0,0,0,0,0,0,0,0,0,0s0,0,0,0c0,0,0,0,0,0,3.3,0,6.1,2.4,6.9,5.5h-14.1Zm-3.6-12.6c0-.6,0-1.2,.2-1.7-.2,0-.5,0-.7,0-2.6,0-4.7-2.1-4.7-4.7s2.1-4.7,4.7-4.7,3.7,1.2,4.4,3c.9-.8,2-1.4,3.1-1.8-1.3-2.8-4.2-4.7-7.5-4.7s-8.3,3.7-8.3,8.3,3.7,8.3,8.3,8.3,.5,0,.7,0c-.1-.6-.2-1.2-.2-1.8Z",
  "system-settings": "M44.2,27.7c-1,0-1.8,.8-1.8,1.8v2.3c0,.2-.3,.2-.4,.2h-11.4c-.7-3-3.3-5.8-6.7-5.8s-5.9,2.8-6.7,5.8H6c-.1,0-.4,0-.4-.2v-11.7c0-1-.8-1.8-1.8-1.8s-1.8,.8-1.8,1.8v11.7c0,2.1,1.7,3.8,4,3.8h11v3.3h-3c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h20.1c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-3.2v-3.3h11.2c2.3,0,4-1.6,4-3.8v-2.3c0-1-.8-1.8-1.8-1.8Zm-16.9,11.1h-6.8v-4.7c0-.1,0-.3,0-.4,0-1.8,1.5-4.1,3.4-4.1s3.4,2.2,3.4,4.1,0,.2,0,.4v4.7ZM42,5.6H6c-2.2,0-4,1.8-4,4v2.4c0,1,.8,1.8,1.8,1.8s1.8-.8,1.8-1.8v-2.4c0-.2,.2-.4,.4-.4H42c.2,0,.4,.2,.4,.4v11.2c0,1,.8,1.8,1.8,1.8s1.8-.8,1.8-1.8V9.6c0-2.2-1.8-4-4-4ZM10.3,26.5c-1,0-1.8,.8-1.8,1.8,0,1,.8,1.8,1.8,1.8h2.1c1.1,0,2.2-.7,2.5-1.8,.1-.4,.3-.7,.5-1.1,.5-1,.3-2.2-.5-3.1l-1.6-1.6,1.9-1.9,1.5,1.6c.8,.8,2,1,3.1,.5,.3-.2,.7-.3,1-.4,1.1-.4,1.8-1.4,1.8-2.5v-2.2h2.7v2.2c0,1.1,.7,2.1,1.8,2.5,.4,.1,.7,.3,1.1,.5,1,.5,2.3,.3,3.1-.5l1.6-1.6,1.9,1.9-1.7,1.6c-.8,.8-1,2-.5,3,.2,.3,.3,.7,.4,1,.4,1.1,1.4,1.8,2.5,1.8h2.2c1,0,1.8-.8,1.8-1.7,0-1-.8-1.8-1.8-1.8h-1.6c0-.1,0-.2-.1-.3l1.8-1.8c.5-.5,.8-1.2,.8-1.9,0-.7-.3-1.4-.8-1.9l-3.1-3.1c-1-1-2.7-1.1-3.8,0l-1.8,1.8c-.1,0-.2,0-.3-.1v-2.5c0-1.5-1.2-2.7-2.7-2.7h-4.4c-1.5,0-2.7,1.2-2.7,2.7v2.5c0,0-.2,0-.2,0l-1.7-1.8c-.5-.5-1.2-.8-1.9-.8-.7,0-1.4,.3-1.9,.8l-3.1,3.1c-.5,.5-.8,1.2-.8,1.9,0,.7,.3,1.4,.8,1.9l1.7,1.8c0,.1,0,.2-.1,.3h-1.5Z",
  "policy-settings": "M3.8,10.6h6.5c.8,2.6,3.1,4.4,5.9,4.4s6.2-2.8,6.2-6.2-2.8-6.2-6.2-6.2-5.2,1.9-5.9,4.4H3.8c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8Zm12.4-4.4c1.5,0,2.6,1.2,2.6,2.6s-1.2,2.6-2.6,2.6-2.6-1.2-2.6-2.6,1.2-2.6,2.6-2.6Zm12.1,4.4h16c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-16c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8Zm-7.3,11.6H3.8c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8H21c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Zm23.2,15.3H27c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h17.2c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Zm0-15.3h-5.1c-.8-2.6-3.1-4.4-5.9-4.4s-6.2,2.8-6.2,6.2,2.8,6.2,6.2,6.2,5.2-1.9,5.9-4.4h5.1c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Zm-11.1,4.4c-1.5,0-2.6-1.2-2.6-2.6s1.2-2.6,2.6-2.6,2.6,1.2,2.6,2.6-1.2,2.6-2.6,2.6Zm-18.3,6.4c-2.8,0-5.2,1.9-5.9,4.4H3.8c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h5.1c.8,2.6,3.1,4.4,5.9,4.4s6.2-2.8,6.2-6.2-2.8-6.2-6.2-6.2Zm0,8.8c-1.5,0-2.6-1.2-2.6-2.6s1.2-2.6,2.6-2.6,2.6,1.2,2.6,2.6-1.2,2.6-2.6,2.6Z",
  "network-discovery": "M40.3,32.7c-.5,0-.9,0-1.4,.2l-1.1-1.7c1.4-1.4,2.3-3.3,2.3-5.4,0-3.6-2.5-6.7-5.9-7.5v-3.2c2.7-.7,4.8-3.2,4.8-6.1s-2.8-6.3-6.3-6.3-6.3,2.8-6.3,6.3,1.9,5.2,4.4,6v3.3c-1.1,.3-2.1,.7-2.9,1.4L15.7,9.8c.2-.5,.3-1.1,.3-1.7,0-3-2.5-5.5-5.5-5.5s-5.5,2.5-5.5,5.5,2.5,5.5,5.5,5.5,2.2-.4,3.1-1l11.9,9.8c-.2,.4-.3,.8-.5,1.2l-11,2.6c-1.1-1.8-3.1-3-5.4-3-3.5,0-6.3,2.8-6.3,6.3s2.8,6.3,6.3,6.3,6.3-2.8,6.3-6.3l9.9-2.3c.2,1.2,.7,2.2,1.4,3.1l-4,4.5c-.6-.2-1.2-.4-1.9-.4-3,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5,5.5-2.5,5.5-5.5-.3-2.1-.9-2.9l4-4.5c1,.5,2.2,.8,3.4,.8s1.7-.1,2.4-.4l1.2,1.8c-.8,.9-1.2,2.1-1.2,3.4,0,3,2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5-2.5-5.5-5.5-5.5ZM10.5,10c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Zm-1.9,22.3c-1.6,0-2.8-1.3-2.8-2.8s1.3-2.8,2.8-2.8,2.8,1.3,2.8,2.8-1.3,2.8-2.8,2.8Zm11.7,9.7c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2ZM29.7,8.9c0-1.6,1.3-2.8,2.8-2.8s2.8,1.3,2.8,2.8-1.3,2.8-2.8,2.8-2.8-1.3-2.8-2.8Zm2.7,21c-2.3,0-4.2-1.9-4.2-4.2s1.9-4.2,4.2-4.2,4.2,1.9,4.2,4.2-1.9,4.2-4.2,4.2Zm7.9,10.3c-1.1,0-2-.9-2-2s.9-2,2-2,2,.9,2,2-.9,2-2,2Z",
  "inventory": "M42,5.3H6c-2.2,0-4,1.8-4,4V31.5c0,2.2,1.8,4,4,4h11v3.7h-3c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h20.1c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-3.2v-3.7h11.2c2.2,0,4-1.8,4-4V9.3c0-2.2-1.8-4-4-4Zm-14.7,33.8h-6.8v-3.7h6.8v3.7Zm15.1-7.7c0,.2-.2,.4-.4,.4H6c-.2,0-.4-.2-.4-.4V9.3c0-.2,.2-.4,.4-.4H42c.2,0,.4,.2,.4,.4V31.5Z",
  "ncm": "M24.57,20.52c-.73,0-1.38,.3-1.85,.78-.45,.46-.72,1.1-.72,1.79,0,1.42,1.15,2.58,2.58,2.58,.73,0,1.39-.3,1.86-.79,.44-.46,.72-1.09,.72-1.78,0-1.42-1.15-2.58-2.58-2.58Zm9.56,4.01c.07-.47,.12-.95,.12-1.44,0-.4-.03-.79-.08-1.18l2.54-.78-1.03-3.34-2.55,.79c-.41-.77-.92-1.48-1.52-2.11l1.6-2.17-2.82-2.08-1.6,2.17c-.77-.37-1.59-.65-2.46-.81v-2.7h-3.5v2.7c-.74,.13-1.46,.35-2.14,.65l-1.52-2.22-2.89,1.97,1.52,2.22c-.05,.05-.11,.1-.17,.16-.56,.58-1.03,1.22-1.42,1.9l-2.53-.88-1.15,3.3,2.51,.88c-.08,.5-.13,1.01-.13,1.53,0,.37,.03,.73,.07,1.09l-2.53,.78,1.03,3.34,2.51-.78c.41,.79,.92,1.51,1.52,2.15l-1.56,2.11,2.82,2.08,1.55-2.1c.78,.39,1.62,.67,2.51,.83v2.6h3.5v-2.6c.76-.14,1.5-.36,2.19-.68l1.47,2.15,2.89-1.97-1.48-2.16c.05-.05,.1-.09,.15-.15,.57-.59,1.05-1.25,1.44-1.95l2.48,.87,1.15-3.3-2.5-.87Zm-5.1,2.84c-1.17,1.22-2.76,1.9-4.45,1.9-3.4,0-6.17-2.77-6.17-6.17,0-1.61,.62-3.14,1.74-4.29,1.17-1.21,2.75-1.88,4.44-1.88,3.4,0,6.17,2.77,6.17,6.17,0,1.6-.61,3.12-1.72,4.28ZM6.85,23.1c0-3.3,.92-6.47,2.61-9.23l.11,1.55,3.49-.25-.55-7.69-7.78,.6,.27,3.49,1.85-.14c-2.27,3.44-3.5,7.47-3.5,11.67,0,11.7,9.52,21.22,21.22,21.22v-3.5c-9.77,0-17.72-7.95-17.72-17.72Zm35.4,11.72c2.29-3.45,3.54-7.5,3.54-11.72C45.79,11.4,36.27,1.88,24.57,1.88v3.5c9.77,0,17.72,7.95,17.72,17.72,0,3.22-.88,6.31-2.48,9.01l-.09-1.31-3.49,.25,.55,7.69,7.78-.6-.27-3.49-2.03,.16Z",
  "metric-explorer": "M7.1,27.2l3.3,1.1-1.5,3.2c-1.9,.3-3.3,2.1-2.9,4.2s1.3,2.3,2.6,2.6c2.3,.5,4.3-1.2,4.3-3.4s-.3-1.5-.7-2.1l1.6-3.5,7.9,2.6c.2,0,.4,0,.5,0,.7,0,1.3-.4,1.6-1.1l3-6.8,5.8,2.7c.4,1.8,2.2,3,4.2,2.5s2.4-1.4,2.6-2.7-.2-2.5-1-3.2l1.5-6.6,2.9-.2c.8,0,1.5-.6,1.6-1.3,.3-1.2-.7-2.3-1.9-2.2l-1.9,.2,.7-3.2c1.5-.6,2.6-2.2,2.2-4s-1.3-2.4-2.6-2.7c-2.3-.5-4.3,1.2-4.3,3.4s.5,2,1.3,2.7l-.9,4.1-8.6,.7c-.6,0-1.2,.5-1.5,1l-1.9,4.2-5-2.3c-.5-1.8-2.4-3.1-4.5-2.5s-1.9,1.1-2.2,2.1-.1,2.6,.7,3.5l-2.2,4.7-3.8-1.2c-1.1-.4-2.3,.4-2.3,1.7s.6,1.4,1.3,1.7Zm22.7-9.6l6.5-.5-1.2,5.5c-.5,.2-.9,.4-1.3,.8l-5.4-2.5,1.5-3.3Zm-12.3,3.8c.6-.1,1.2-.4,1.6-.9l4.5,2.1-2.4,5.4-6-1.9,2.2-4.7Zm26.7,19.9H3.8c-.8,0-1.5,.5-1.8,1.2-.4,1.2,.5,2.3,1.7,2.3H44.2c.8,0,1.5-.5,1.8-1.2,.4-1.2-.5-2.3-1.7-2.3Z",
  "trap-viewer": "M43.9,25.4c-.4-.9-4.9-10.1-6.2-12.6-.6-1.2-1.7-2.4-3.3-2.9-.3-1.6-1.3-2.3-1.9-2.6-1.6-.7-3.5,0-4.6,1.2-.6,.7-.6,1.6-.3,2.3l.3,.8c-.8,.9-1.2,2-1.3,3.2h-5c0-1.2-.5-2.2-1.2-3.1l.4-.8h0c.2-.8,.3-2.1-.8-2.9-1.1-.8-3-1.5-4.5-.7-.7,.4-1.5,1.1-1.7,2.6-1.6,.5-2.6,1.8-3.3,2.9-1.4,2.5-5.8,11.7-6.2,12.6-1.2,1.6-1.9,3.6-1.9,5.8,0,5.5,4.5,10,10,10s8.1-2.9,9.5-6.8h4.5c1.3,3.9,5.1,6.8,9.5,6.8s10-4.5,10-10-.7-4.1-1.9-5.8ZM13.4,14.5c.8-1.5,1.7-1.6,2.9-1.3,.7,.2,1.6,.6,1.7,1.8,0,1,.2,4.8,.4,8.2-1.7-1.3-3.8-2.1-6.1-2.1s-1.6,.1-2.4,.3c1.3-2.8,2.8-5.8,3.5-7Zm-1.1,23.2c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5,6.5,2.9,6.5,6.5-2.9,6.5-6.5,6.5Zm13.6-8.5c-.1,.5-.2,1.1-.2,1.7h-3.5c0-.6,0-1.1-.2-1.7h0c0-.1,0-.7,0-1.7h3.9c0,1,0,1.6,0,1.7h0Zm.2-5.2h-4.2c0-1.9-.2-4-.2-5.7h4.7c0,1.7-.2,3.8-.2,5.7Zm3.9-9c0-1.2,1-1.6,1.7-1.8,1.2-.3,2.1-.2,2.9,1.3,.7,1.2,2.1,4.2,3.5,7-.8-.2-1.6-.3-2.4-.3-2.3,0-4.4,.8-6.1,2.1,.1-3.4,.3-7.2,.4-8.2Zm5.7,22.7c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5,6.5,2.9,6.5,6.5-2.9,6.5-6.5,6.5Z",
  "log": "M41.4,16.1s0,0,0-.1c0,0,0-.1,0-.2,0,0,0,0,0-.1,0,0,0-.1,0-.2,0,0,0,0,0-.1,0,0,0,0,0-.1L29.5,2.6s0,0,0,0c0,0-.1-.1-.2-.1,0,0,0,0-.1,0,0,0-.1,0-.2-.1,0,0,0,0,0,0,0,0-.2,0-.3,0,0,0,0,0,0,0-.1,0-.2,0-.4,0H8.4c-1,0-1.8,.8-1.8,1.8V44.2c0,1,.8,1.8,1.8,1.8h31.2c1,0,1.8-.8,1.8-1.8V16.4c0-.1,0-.2,0-.3Zm-11.4-7.7l5.7,6.3h-5.7v-6.3Zm7.9,34.1H10.1V5.5H26.4v10.9c0,1,.8,1.8,1.8,1.8h9.6v24.2ZM15.5,27.9c0,1,.8,1.8,1.8,1.8h12c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-12c-1,0-1.8,.8-1.8,1.8Zm13.8,5.9h-12c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h12c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Z",
  "flow": "M42.9,28.1h-2v-4.8c0-1-.8-1.8-1.8-1.8h-11.5c-.3-.7-.8-1.2-1.5-1.6v-3.5h9.8c2.5,0,4.6-2.1,4.6-4.6V7c0-2.5-2.1-4.6-4.6-4.6H12.3c-2.5,0-4.6,2.1-4.6,4.6v4.8c0,2.5,2.1,4.6,4.6,4.6h10.3v3.7c-.5,.4-.9,.8-1.2,1.4H9.1c-1,0-1.8,.8-1.8,1.8v4.8h-2.3c-1.7,0-3.1,1.4-3.1,3.1v5.5c0,1.7,1.4,3.1,3.1,3.1h2.2v2.3h-1.4c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h6.3c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-1.4v-2.3h2.2c1.7,0,3.1-1.4,3.1-3.1v-5.5c0-1.7-1.4-3.1-3.1-3.1h-2.2v-3h11.1c.6,.7,1.5,1.2,2.6,1.2s2-.5,2.6-1.2h10.2v3h-2.4c-1.7,0-3.1,1.4-3.1,3.1v5.5c0,1.7,1.4,3.1,3.1,3.1h2.2v2.3h-1.4c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h6.3c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-1.4v-2.3h2.2c1.7,0,3.1-1.4,3.1-3.1v-5.5c0-1.7-1.4-3.1-3.1-3.1Zm-30.3,3.5v4.6H5.5v-4.6h7.1Zm-.3-18.7c-.6,0-1.1-.5-1.1-1.1V7c0-.6,.5-1.1,1.1-1.1h23.6c.6,0,1.1,.5,1.1,1.1v4.8c0,.6-.5,1.1-1.1,1.1H12.3Zm30.2,23.3h-7.1v-4.6h7.1v4.6ZM17.6,7.7c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8,1.8-.8,1.8-1.8-.8-1.8-1.8-1.8Zm6.5,0c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8,1.8-.8,1.8-1.8-.8-1.8-1.8-1.8Zm6.5,0c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8,1.8-.8,1.8-1.8-.8-1.8-1.8-1.8Z",
  "plugin-library": "M39.3,21.6c-.6,0-1.3,0-1.9,.3v-4.1c0-1.7-1.4-3.1-3.1-3.1h-3.8c.1-.5,.2-1.1,.2-1.6,0-3.7-3-6.7-6.7-6.7s-6.7,3-6.7,6.7,0,1.1,.2,1.6h-3.9c-1.7,0-3.1,1.4-3.1,3.1v4.1c-.6-.2-1.2-.2-1.8-.2-3.7,0-6.7,3-6.7,6.7s3,6.7,6.7,6.7,1.2,0,1.8-.2v3.8c0,1.7,1.4,3.1,3.1,3.1h6.7c.7,0,1.3-.4,1.6-1,.3-.6,.2-1.4-.3-1.9-.5-.6-.8-1.3-.8-2.1,0-1.7,1.4-3.2,3.2-3.2s3.2,1.4,3.2,3.2-.3,1.5-.8,2.1c-.5,.5-.6,1.3-.3,1.9,.3,.6,.9,1,1.6,1h6.6c1.7,0,3.1-1.4,3.1-3.1v-3.8c.6,.2,1.2,.3,1.9,.3,3.7,0,6.7-3,6.7-6.7s-3-6.7-6.7-6.7Zm0,9.9c-.9,0-1.7-.4-2.3-1-.5-.5-1.3-.7-1.9-.5s-1.1,.9-1.1,1.6v6.5h-3.3c.1-.5,.2-1,.2-1.5,0-3.7-3-6.7-6.7-6.7s-6.7,3-6.7,6.7,0,1,.2,1.5h-3.5v-6.4c0-.7-.4-1.4-1.1-1.6-.7-.3-1.4-.1-1.9,.4-.6,.6-1.4,1-2.3,1-1.7,0-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2,1.7,.3,2.3,1c.5,.5,1.3,.7,1.9,.4,.7-.3,1.1-.9,1.1-1.6v-6.7h6.5c.7,0,1.3-.4,1.6-1.1,.3-.6,.1-1.4-.3-1.9-.6-.6-.9-1.4-.9-2.2,0-1.7,1.4-3.2,3.2-3.2s3.2,1.4,3.2,3.2-.3,1.6-.9,2.2c-.5,.5-.6,1.3-.3,1.9,.3,.7,.9,1.1,1.6,1.1h6.3v6.8c0,.7,.4,1.4,1.1,1.7s1.5,0,1.9-.5c.6-.7,1.4-1,2.3-1,1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2Z",
  "brain": "M44,22c0-1.4-.4-2.8-1.1-4s-1.7-2.2-2.9-2.9c0-.3,0-.7,0-1,0-1.6-.6-3.1-1.8-4.2-1.1-1.1-2.6-1.8-4.2-1.8h-.4c-.3-.9-.9-1.7-1.6-2.4-.7-.7-1.6-1.1-2.6-1.4-1-.2-1.9-.2-2.9,0-1,.2-1.8,.7-2.6,1.3-.7-.7-1.6-1.1-2.6-1.3-1-.2-1.9-.2-2.9,0-1,.2-1.8,.7-2.6,1.4-.7,.7-1.3,1.5-1.6,2.4h-.4c-1.6,0-3.1,.6-4.2,1.8-1.1,1.1-1.8,2.6-1.8,4.2,0,.3,0,.7,0,1-1.1,.6-2.1,1.5-2.8,2.6s-1.1,2.3-1.2,3.6c-.1,1.3,.1,2.6,.6,3.8,.5,1.2,1.3,2.3,2.3,3.1-.7,1.2-1,2.6-.9,4,0,1.4,.4,2.7,1.1,3.9,.7,1.2,1.7,2.2,2.9,2.8s2.6,1,4,1h.4c.3,.9,.9,1.7,1.6,2.4,.7,.7,1.6,1.1,2.6,1.4,1,.2,1.9,.2,2.9,0s1.8-.7,2.6-1.3c.7,.7,1.6,1.1,2.6,1.3s1.9,.2,2.9,0c1-.2,1.8-.7,2.6-1.4,.7-.7,1.3-1.5,1.6-2.4h.4c1.4,0,2.7-.4,3.9-1.1,1.2-.7,2.2-1.7,2.9-2.8,.7-1.2,1.1-2.5,1.1-3.9,0-1.4-.3-2.7-.9-3.9,.9-.7,1.7-1.7,2.2-2.8,.5-1.1,.8-2.3,.8-3.4Zm-22-4.9c-.4-.2-.9-.5-1.4-.6-.5-.2-1.1-.1-1.5,.1-.5,.2-.8,.7-1,1.2-.2,.5-.1,1.1,.1,1.5,.2,.5,.7,.8,1.2,1,.8,.3,1.4,.8,1.9,1.5,.5,.7,.7,1.5,.7,2.3v3.1c-.4-.2-.9-.5-1.4-.6-.5-.2-1.1-.1-1.5,.1-.5,.2-.8,.7-1,1.2-.2,.5-.1,1.1,.1,1.5,.2,.5,.7,.8,1.2,1,.8,.3,1.4,.8,1.9,1.5,.5,.7,.7,1.5,.7,2.3v4c0,.5-.2,1-.6,1.4s-.9,.6-1.4,.6c-.4,0-.8-.1-1.1-.3-.3-.2-.6-.5-.7-.9,.3-.2,.7-.4,1-.7,.2-.2,.4-.4,.5-.6,.1-.2,.2-.5,.2-.7,0-.3,0-.5,0-.8,0-.3-.2-.5-.4-.7-.2-.2-.4-.4-.6-.5-.2-.1-.5-.2-.7-.2-.3,0-.5,0-.8,0-.3,0-.5,.2-.7,.4-.7,.6-1.6,.9-2.6,.9-1.1,0-2.1-.4-2.8-1.2-.7-.7-1.2-1.8-1.2-2.8,0-.8,.2-1.5,.6-2.1,.4,0,.9,.1,1.4,.1,.5,0,1-.2,1.4-.6,.4-.4,.6-.9,.6-1.4s-.2-1-.6-1.4c-.4-.4-.9-.6-1.4-.6-.5,0-.9,0-1.4-.3-.7-.3-1.3-.7-1.8-1.3-.5-.6-.7-1.3-.8-2.1,0-.8,0-1.5,.4-2.2,.4-.7,.9-1.2,1.6-1.6,.3,.3,.6,.5,.9,.7,.5,.3,1,.3,1.5,.2,.5-.1,1-.5,1.2-.9,.3-.5,.3-1,.2-1.5-.1-.5-.5-1-.9-1.2-.3-.2-.5-.4-.7-.7-.2-.3-.3-.7-.2-1.1,0-.5,.2-1,.6-1.4s.9-.6,1.4-.6c.1,0,.3,0,.4,0,.1,.3,.2,.6,.4,.9,.1,.2,.3,.4,.5,.6,.2,.2,.4,.3,.7,.3,.3,0,.5,0,.8,0,.3,0,.5-.1,.7-.3,.4-.3,.8-.7,.9-1.2s0-1-.2-1.5c-.2-.3-.3-.6-.3-1,0-.5,.2-1,.6-1.4,.4-.4,.9-.6,1.4-.6s1,.2,1.4,.6c.4,.4,.6,.9,.6,1.4v7.1Zm15.4,8.6c-.4,.2-.9,.3-1.4,.3-.5,0-1,.2-1.4,.6s-.6,.9-.6,1.4,.2,1,.6,1.4,.9,.6,1.4,.6c.5,0,.9,0,1.4-.1,.4,.6,.6,1.4,.6,2.1,0,1.1-.4,2.1-1.2,2.8-.7,.7-1.8,1.2-2.8,1.2-.9,0-1.9-.3-2.6-.9-.4-.3-.9-.5-1.5-.5-.5,0-1,.3-1.4,.7-.3,.4-.5,.9-.5,1.5,0,.5,.3,1,.7,1.4,.3,.2,.6,.5,1,.7-.2,.4-.4,.7-.7,.9-.3,.2-.7,.3-1.1,.3-.5,0-1-.2-1.4-.6s-.6-.9-.6-1.4v-4c0-.8,.3-1.6,.7-2.3,.5-.7,1.1-1.2,1.9-1.5,.5-.2,.9-.5,1.2-1,.2-.5,.3-1,.1-1.5-.2-.5-.5-.9-1-1.2-.5-.2-1-.3-1.5-.1-.5,.2-.9,.4-1.4,.6v-3.1c0-.8,.3-1.6,.7-2.3,.5-.7,1.1-1.2,1.9-1.5,.5-.2,.9-.5,1.2-1,.2-.5,.3-1,.1-1.5-.2-.5-.5-.9-1-1.2-.5-.2-1-.3-1.5-.1-.5,.2-.9,.4-1.4,.6v-7.1c0-.5,.2-1,.6-1.4,.4-.4,.9-.6,1.4-.6s1,.2,1.4,.6c.4,.4,.6,.9,.6,1.4,0,.3,0,.7-.3,1-.1,.2-.2,.5-.3,.7,0,.3,0,.5,0,.8,0,.3,.2,.5,.3,.7,.2,.2,.4,.4,.6,.5,.2,.1,.5,.2,.7,.3,.3,0,.5,0,.8,0,.3,0,.5-.2,.7-.3,.2-.2,.4-.4,.5-.6,.1-.3,.3-.7,.4-1,.1,0,.3,0,.4,0,.5,0,1,.2,1.4,.6,.4,.4,.6,.9,.6,1.4,0,.4-.1,.8-.3,1.1-.2,.3-.4,.5-.7,.6-.5,.3-.8,.7-.9,1.2-.1,.5,0,1.1,.2,1.5,.3,.5,.7,.8,1.2,.9,.5,.1,1.1,0,1.5-.2,.4-.2,.7-.4,1-.7,.7,.4,1.2,.9,1.6,1.6,.4,.7,.5,1.4,.5,2.2,0,.8-.3,1.5-.8,2.1-.5,.6-1.1,1.1-1.8,1.3h0Z",
  "slo": "M16 23C22.0751 23 27 27.9249 27 34C27 40.0751 22.0751 45 16 45C9.92487 45 5 40.0751 5 34C5 27.9249 9.92487 23 16 23ZM16 27C12.134 27 9 30.134 9 34C9 37.866 12.134 41 16 41C19.866 41 23 37.866 23 34C23 30.134 19.866 27 16 27ZM31 3C31.5304 3 32.039 3.21086 32.4141 3.58594L42.4141 13.5859C42.7891 13.961 43 14.4696 43 15V35C43 37.2091 41.2091 39 39 39H28.002C28.522 37.7531 28.8499 36.408 28.957 35H39V19H29C27.8954 19 27 18.1046 27 17V7H15V21.041C13.5922 21.1481 12.2468 21.4762 11 21.9961V7C11 4.79086 12.7909 3 15 3H31ZM15 29C16.1046 29 17 29.8954 17 31V33H19C20.1046 33 21 33.8954 21 35C21 36.1046 20.1046 37 19 37H15C13.8954 37 13 36.1046 13 35V31C13 29.8954 13.8954 29 15 29ZM31 15H38.1719L31 7.82812V15Z",
  "utility": "M26.9492 1.14844C27.3666 1.14795 27.7802 1.22921 28.166 1.38867C28.5524 1.54841 28.9037 1.78337 29.1992 2.0791C29.4946 2.37475 29.7283 2.726 29.8877 3.1123C30.0469 3.49815 30.1287 3.91173 30.1279 4.3291V7.93652C30.4426 8.05975 30.7537 8.19235 31.0605 8.33398L33.6279 5.77832C33.9215 5.4844 34.2703 5.25141 34.6543 5.09277C35.0381 4.9343 35.45 4.85252 35.8652 4.85352C36.283 4.85313 36.6975 4.93585 37.083 5.09668C37.4676 5.25715 37.8162 5.49293 38.1094 5.78906L42.2695 9.96973C42.5636 10.2651 42.7956 10.6155 42.9541 11.001C43.1126 11.3865 43.1936 11.7999 43.1924 12.2168C43.1911 12.6336 43.1081 13.0462 42.9473 13.4307C42.7866 13.8147 42.5512 14.1627 42.2559 14.4561L39.5996 17.1006C39.7194 17.3811 39.8317 17.6647 39.9365 17.9512L43.6914 17.9658H43.6934C44.5336 17.9708 45.338 18.3087 45.9297 18.9053C46.5212 19.5019 46.8517 20.3092 46.8496 21.1494L46.8281 27.0518V27.0547C46.8224 27.893 46.4861 28.6951 45.8916 29.2861C45.297 29.8772 44.4926 30.2092 43.6543 30.21H43.6445L39.6416 30.1865H39.626L39.6104 30.1855C39.1043 30.1642 38.626 29.9485 38.2754 29.583C37.9246 29.2172 37.7285 28.7294 37.7285 28.2227C37.7286 27.716 37.9247 27.229 38.2754 26.8633C38.626 26.4977 39.1042 26.2811 39.6104 26.2598L39.6309 26.2588L39.6514 26.2598L42.8975 26.2783L42.9219 21.8877L39.3877 21.8701C38.7234 21.8666 38.0764 21.6543 37.5391 21.2637C37.0018 20.873 36.6007 20.3232 36.3926 19.6924C36.2311 19.2074 36.0414 18.7308 35.8252 18.2676C35.5506 17.6764 35.464 17.0139 35.5781 16.3721C35.6923 15.7303 36.0014 15.139 36.4629 14.6787L36.4639 14.6777L38.957 12.1982L35.8613 9.08594L33.4512 11.4883L33.4502 11.4873C32.9797 11.9568 32.374 12.2675 31.7178 12.373C31.0621 12.4785 30.3895 12.3749 29.7959 12.0771L29.4326 11.9023C29.0663 11.7334 28.6919 11.5819 28.3115 11.4473C27.6933 11.2294 27.1577 10.8246 26.7783 10.29C26.3986 9.75488 26.1935 9.11516 26.1924 8.45898V5.08105H21.7998V8.40234L21.79 8.64844C21.7457 9.22151 21.546 9.77332 21.2109 10.2441C20.8281 10.782 20.287 11.1873 19.6631 11.4033L19.6592 11.4053C19.3034 11.5266 18.9529 11.6631 18.6094 11.8154L18.2676 11.9736C17.6717 12.2587 17.0013 12.3503 16.3506 12.2363C15.7 12.1223 15.1012 11.8084 14.6377 11.3379L12.3027 8.9668L9.18164 12.0479L11.543 14.4453L11.708 14.627C12.0762 15.0644 12.32 15.5948 12.4121 16.1621C12.5042 16.7294 12.4404 17.3094 12.2295 17.8408L12.1309 18.0645C11.8929 18.552 11.6849 19.0536 11.5078 19.5664L11.5068 19.5654C11.2925 20.1899 10.8891 20.7319 10.3516 21.1152C9.81397 21.4985 9.16999 21.703 8.50977 21.7021L8.49219 21.7031L5.11328 21.6855L5.08887 26.0762L8.5752 26.0947C9.22734 26.0992 9.86391 26.3048 10.3955 26.6826C10.927 27.0604 11.3292 27.5927 11.5479 28.207C11.7209 28.6931 11.922 29.1687 12.1494 29.6318L12.25 29.8594C12.4647 30.398 12.5281 30.9867 12.4307 31.5615C12.3193 32.2184 12.0044 32.8239 11.5293 33.291L11.5283 33.29L9.04492 35.7588L12.1426 38.873L14.7168 36.3193L14.7178 36.3184C15.1814 35.8595 15.7751 35.5536 16.418 35.4434C17.0608 35.3332 17.7226 35.424 18.3125 35.7021C18.7524 35.9107 19.2047 36.0955 19.665 36.2539C20.2895 36.4689 20.8316 36.8733 21.2148 37.4111C21.5978 37.9488 21.8043 38.5928 21.8037 39.2529V42.8838H26.1963V39.9043C26.1963 39.3839 26.4035 38.8846 26.7715 38.5166C27.1395 38.1486 27.6388 37.9415 28.1592 37.9414C28.6796 37.9414 29.1788 38.1487 29.5469 38.5166C29.9149 38.8846 30.122 39.3838 30.1221 39.9043V43.6367C30.1213 44.4777 29.7871 45.2842 29.1924 45.8789C28.6349 46.4364 27.8911 46.7651 27.1074 46.8047L26.9492 46.8086H21.0508C20.2096 46.8079 19.4024 46.4737 18.8076 45.8789C18.213 45.2842 17.8787 44.4777 17.8779 43.6367V39.7754C17.6195 39.6773 17.3637 39.5723 17.1104 39.4619L14.3779 42.1797L14.377 42.1787C13.7815 42.7716 12.9761 43.1054 12.1357 43.1055C11.2951 43.1054 10.4881 42.7721 9.89258 42.1787L9.89062 42.1758L5.73047 37.9951C5.43685 37.7 5.20426 37.3489 5.0459 36.9639C4.88737 36.5783 4.80638 36.1649 4.80762 35.748C4.80889 35.3313 4.89195 34.9187 5.05273 34.5342C5.21352 34.1497 5.44838 33.8004 5.74414 33.5068L8.38672 30.8828C8.25834 30.6003 8.13715 30.3145 8.02441 30.0254L4.30664 30.0049C3.46562 29.9992 2.65987 29.6604 2.06836 29.0625C1.47683 28.4644 1.14686 27.6556 1.15039 26.8145L1.18164 20.9111C1.18731 20.0753 1.52185 19.2743 2.11328 18.6836C2.70501 18.0929 3.50666 17.7591 4.34277 17.7549H4.37305L7.9707 17.7734C8.09279 17.4521 8.22504 17.1347 8.36621 16.8213L5.84668 14.2637C5.55418 13.9668 5.32363 13.6147 5.16699 13.2285C5.01034 12.8422 4.93139 12.4286 4.93457 12.0117C4.9378 11.5947 5.02289 11.1818 5.18555 10.7979C5.34818 10.414 5.58467 10.0658 5.88184 9.77344L10.085 5.63965L10.2002 5.53125C10.7866 5.00969 11.5474 4.72251 12.3359 4.72852C13.1247 4.73462 13.8815 5.03363 14.46 5.56445L14.5732 5.67383L14.5742 5.6748L17.0645 8.20605C17.3325 8.08808 17.604 7.97759 17.8779 7.87402V4.3291C17.8772 3.91242 17.9585 3.49957 18.1172 3.11426C18.2761 2.72846 18.5092 2.37759 18.8037 2.08203C19.0983 1.78648 19.4487 1.55182 19.834 1.3916C20.2194 1.23139 20.6334 1.1488 21.0508 1.14844H26.9492ZM23.7236 14.0156C25.8605 14.0998 27.9369 14.9555 29.8057 16.5166C31.3536 17.8095 32.2009 19.1441 32.667 20.4229C33.0119 21.3693 33.1386 22.2644 33.2051 23.0273L33.2568 23.7432C33.332 24.9075 33.4038 25.2864 33.625 25.5742C36.85 28.9612 38.8247 30.9194 40.2715 32.3525L41.7227 33.7979C41.942 34.0197 42.1538 34.2365 42.3633 34.4541L42.9912 35.1172L42.9922 35.1191C43.5166 35.6855 44.6333 36.8763 45.1055 38.4082C45.3479 39.195 45.4265 40.0881 45.167 41.0352C44.9078 41.9808 44.3286 42.9152 43.3594 43.8154C42.1444 44.9449 40.9047 45.4287 39.6797 45.4287C38.3651 45.4287 37.2201 44.8648 36.3262 44.2334C35.4303 43.6006 34.7114 42.8441 34.2588 42.3711C32.5052 40.5347 27.2554 35.2344 25.2861 33.248C23.6117 33.5109 20.4106 33.6251 17.5537 31.4609C15.5074 29.9122 14.5805 27.8435 14.166 26.1738C13.7601 24.5386 13.8314 23.2355 13.8457 23.0439L13.8584 22.9199C13.8969 22.6306 13.9993 22.3529 14.1592 22.1074C14.3419 21.827 14.5934 21.5973 14.8896 21.4414C15.1858 21.2856 15.517 21.2086 15.8516 21.2168C16.1855 21.225 16.512 21.3178 16.7998 21.4873L20.9697 23.9375C21.123 23.8698 21.3051 23.7625 21.4805 23.5811C21.7228 23.3302 21.9962 22.8992 22.1553 22.1543C19.2849 20.3707 17.7261 19.3777 17.5762 19.2812C17.5745 19.2802 17.573 19.2794 17.5713 19.2783C17.5679 19.2761 17.5645 19.2744 17.5645 19.2744C17.3006 19.102 17.0815 18.8684 16.9268 18.5938C16.7697 18.3148 16.6823 18.0017 16.6738 17.6816C16.6654 17.3617 16.7359 17.0446 16.8779 16.7578C17.0201 16.4709 17.2305 16.2233 17.4902 16.0361L17.4912 16.0352C19.4584 14.6224 21.5863 13.9315 23.7236 14.0156ZM23.9268 17.959C23.5572 17.9185 23.1966 17.922 22.8467 17.9609C23.5465 18.3969 24.3618 18.9038 25.2871 19.4785C25.5783 19.6598 25.8179 19.9147 25.9805 20.2168C26.1429 20.5188 26.224 20.8583 26.2148 21.2012V21.209C26.1228 23.722 25.2606 25.4254 24.1143 26.5029C22.9894 27.5602 21.6495 27.9575 20.6729 27.9756L20.6738 27.9766L20.6699 27.9756L20.6689 27.9766L20.668 27.9756C20.3513 27.9819 20.0382 27.9131 19.7559 27.7725L19.6367 27.707L18.9111 27.2812C19.1829 27.6606 19.5164 28.0191 19.9277 28.3311L20.1494 28.4893C21.2639 29.2461 22.4984 29.4539 23.5146 29.4541C24.6027 29.4543 25.3718 29.2162 25.3232 29.2324L25.334 29.2285L25.3457 29.2256C25.5338 29.1687 25.7293 29.1393 25.9258 29.1396H25.9287C26.4319 29.1424 26.9137 29.3392 27.2764 29.6865C27.2789 29.6888 27.2861 29.6954 27.2959 29.7051C27.2996 29.7087 27.3039 29.7122 27.3076 29.7158C27.8339 30.2358 34.9842 37.4406 37.0996 39.6582C38.3228 40.9396 39.051 41.3756 39.5049 41.4688C39.8319 41.5358 40.1393 41.4477 40.6875 40.9385L40.8018 40.8311C41.3266 40.3207 41.4262 40.0514 41.4131 39.8213C41.3942 39.491 41.1378 38.9021 40.1104 37.7939L40.1094 37.793C39.3306 36.9509 38.5742 36.2041 37.5068 35.1465C36.0359 33.6873 34.0169 31.6874 30.7158 28.2178L30.707 28.208L30.6982 28.1992L30.6475 28.1426L30.626 28.1172C29.4947 26.7532 29.4152 25.2047 29.3369 24.0029V23.999C29.2842 23.1422 29.2345 22.444 28.9775 21.7461C28.7295 21.0725 28.2656 20.346 27.2939 19.5342C26.066 18.5079 24.9309 18.069 23.9268 17.959Z",
  "apm": "M42,5.1H6c-2.2,0-4,1.8-4,4V31.3c0,2.2,1.8,4,4,4h11v4.1h-3c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8h20.1c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8h-3.2v-4.1h11.2c2.2,0,4-1.8,4-4V9.1c0-2.2-1.8-4-4-4Zm-14.7,34.2h-6.8v-4.1h6.8v4.1Zm15.1-8.1c0,.2-.2,.4-.4,.4H6c-.2,0-.4-.2-.4-.4V9.1c0-.2,.2-.4,.4-.4H42c.2,0,.4,.2,.4,.4V31.3ZM17.9,14.8c-.6-.8-1.7-1-2.5-.4l-5.1,3.8c-.5,.3-.7,.9-.7,1.4s.3,1.1,.7,1.4l5.1,3.8c.3,.2,.7,.3,1.1,.3,.5,0,1.1-.2,1.4-.7,.6-.8,.4-1.9-.4-2.5l-3.2-2.3,3.2-2.3c.8-.6,1-1.7,.4-2.5Zm20,3.4l-5.1-3.8c-.8-.6-1.9-.4-2.5,.4-.6,.8-.4,1.9,.4,2.5l3.2,2.3-3.2,2.3c-.8,.6-1,1.7-.4,2.5,.3,.5,.9,.7,1.4,.7s.7-.1,1.1-.3l5.1-3.8c.5-.3,.7-.9,.7-1.4s-.3-1.1-.7-1.4Zm-10.4-4.9c-.9-.5-1.9-.2-2.4,.7l-5.2,9.4c-.5,.9-.2,1.9,.7,2.4,.3,.2,.6,.2,.9,.2,.6,0,1.2-.3,1.5-.9l5.2-9.4c.5-.9,.2-1.9-.7-2.4Z",
  "monitor": "M4.6,16.6H43.4c1,0,1.8-.8,1.8-1.8V3.5c0-1-.8-1.8-1.8-1.8H4.6c-1,0-1.8,.8-1.8,1.8V14.9c0,1,.8,1.8,1.8,1.8ZM37.9,7.9h-1.2l-2.1-1.3c-.4-.3-1-.3-1.4,0l-2.4,1.3-2.7-2.4s0,0,0,0h13.6v7.9H23.2c.4,0,.7-.2,.9-.5l3.2-4.2,2.4,2.1c.4,.4,1.1,.5,1.6,.2l2.5-1.3,1.7,1.1c.2,.1,.5,.2,.8,.2h1.7c.8,0,1.4-.6,1.4-1.4s-.6-1.4-1.4-1.4ZM6.4,5.3H26.3c0,0-.2,.2-.3,.3l-3.3,4.2-3.1-2.6c-.5-.4-1.2-.4-1.7,0l-1.5,1h-5.8c-.8,0-1.4,.6-1.4,1.4s.6,1.4,1.4,1.4h6.2c.3,0,.6,0,.8-.2l.9-.6,3.4,2.9c.2,.2,.5,.3,.8,.3H6.4V5.3ZM44,42.7h-13.8v-4.3c0-1-.8-1.8-1.8-1.8h-2.7v-2.7h17.6c1,0,1.8-.8,1.8-1.8v-11.4c0-1-.8-1.8-1.8-1.8H4.6c-1,0-1.8,.8-1.8,1.8v11.4c0,1,.8,1.8,1.8,1.8H22.2v2.7h-2.7c-1,0-1.8,.8-1.8,1.8v4.3H4c-1,0-1.8,.8-1.8,1.8s.8,1.8,1.8,1.8H44c1,0,1.8-.8,1.8-1.8s-.8-1.8-1.8-1.8Zm-6.1-17.5h-1.2l-2.1-1.3c-.4-.3-1-.3-1.4,0l-2.4,1.3-2.7-2.4s0,0,0,0h13.6v7.9H23.2c.4,0,.7-.2,.9-.5l3.2-4.2,2.4,2.1c.4,.4,1.1,.5,1.6,.2l2.5-1.3,1.7,1.1c.2,.1,.5,.2,.8,.2h1.7c.8,0,1.4-.6,1.4-1.4s-.6-1.4-1.4-1.4ZM6.4,30.5v-7.9H26.3c0,0-.2,.2-.3,.3l-3.3,4.2-3.1-2.6c-.5-.4-1.2-.4-1.7,0l-1.5,1h-5.8c-.8,0-1.4,.6-1.4,1.4s.6,1.4,1.4,1.4h6.2c.3,0,.6,0,.8-.2l.9-.6,3.4,2.9c.2,.2,.5,.3,.8,.3H6.4Zm20.4,12.3h-5.5v-2.5h5.5v2.5Z",
  "integration": "M13.72,17.52c-.73-.73-2-.73-2.73,0-.75.75-.75,1.97,0,2.73l.16.16-2.45,2.45c-4.04,4.04-4.53,10.37-1.25,14.96l-4.08,4.08c-.36.36-.56.85-.56,1.36s.2,1,.56,1.36l.19.19h.03c.32.23.72.36,1.14.36h0c.52,0,1.01-.2,1.36-.55l4.08-4.08c4.59,3.28,10.92,2.79,14.96-1.25l2.44-2.45.16.16c.75.75,1.97.75,2.73,0,.36-.36.56-.85.56-1.36s-.2-1-.56-1.36L13.72,17.52ZM22.42,36.57c-1.47,1.47-3.42,2.28-5.49,2.28s-4.03-.81-5.49-2.28c-3.03-3.03-3.03-7.96,0-10.98h0l2.45-2.45,10.99,10.99-2.45,2.45ZM45.19,4.74c0-.52-.2-1-.57-1.36-.7-.7-2.03-.7-2.73,0l-4.08,4.08c-4.59-3.29-10.92-2.79-14.96,1.25l-2.45,2.45-.16-.16c-.73-.73-2-.73-2.73,0-.75.75-.75,1.97,0,2.73l3.21,3.21-1.33,1.33c-.71.71-.71,1.87,0,2.58.38.38.89.59,1.44.59h0c.54,0,1.05-.21,1.43-.59l1.19-1.19,4.89,4.89-1.29,1.29c-.36.36-.55.83-.55,1.33s.2.97.55,1.33c.77.77,2.02.77,2.79,0l1.22-1.23,3.21,3.21c.36.36.85.56,1.36.56s1-.2,1.36-.56c.36-.36.56-.85.56-1.36s-.2-1-.56-1.36l-.16-.16,2.45-2.45c4.04-4.04,4.53-10.37,1.25-14.96l4.08-4.08c.36-.36.56-.85.56-1.36ZM36.56,22.42l-2.45,2.45-10.99-10.98,2.45-2.45c1.47-1.47,3.42-2.28,5.49-2.28s4.03.81,5.49,2.28c3.03,3.03,3.03,7.96,0,10.99Z",
  "info-circle": "M24,22c-.6,0-1.1,.2-1.4,.6s-.6,.9-.6,1.4v8c0,.6,.2,1.1,.6,1.4s.9,.6,1.4,.6,1.1-.2,1.4-.6,.6-.9,.6-1.4v-8c0-.6-.2-1.1-.6-1.4s-.9-.6-1.4-.6Zm.8-7.8c-.5-.2-1.1-.2-1.5,0-.3,0-.5,.2-.7,.4s-.3,.4-.4,.7c0,.2-.2,.5-.2,.8s0,.6,.2,.8c0,.3,.3,.5,.5,.7s.4,.3,.7,.4c.3,0,.7,.2,1,0,.3,0,.7-.2,1-.3,.3-.2,.5-.4,.7-.8,.2-.3,.2-.6,.3-1,0-.6-.2-1.1-.6-1.4-.2-.2-.4-.3-.7-.4h-.2Zm17.8,2.3c-1.1-2.4-2.5-4.7-4.4-6.5-1.9-1.9-4.1-3.3-6.5-4.4s-5.1-1.5-7.6-1.5c-4,0-7.8,1.1-11.2,3.3s-5.8,5.3-7.4,9-1.9,7.7-1.1,11.6c.8,3.9,2.7,7.4,5.4,10.3,2.8,2.8,6.4,4.7,10.3,5.4,3.9,.8,7.9,.4,11.6-1.1,3.6-1.5,6.8-4.1,9-7.4,2.2-3.3,3.3-7.2,3.3-11.2s-.5-5.3-1.5-7.6h0Zm-7.2,19.1c-3.1,3.1-7.1,4.7-11.4,4.7s-6.3-1-8.9-2.7c-2.7-1.7-4.7-4.3-5.9-7.2-1.2-3-1.5-6.1-1-9.3,.6-3.2,2.1-6,4.4-8.2s5.1-3.7,8.2-4.4c3.2-.6,6.3-.3,9.3,1,3,1.2,5.4,3.2,7.2,5.9s2.7,5.7,2.7,8.9-1.7,8.3-4.7,11.4h0Z",
  "chevron-left": "M31.4,10.6c.8,.8,.8,2,0,2.8l-10.6,10.6,10.6,10.6c.8,.8,.8,2,0,2.8-.8,.8-2,.8-2.8,0l-12-12c-.8-.8-.8-2,0-2.8l12-12c.8-.8,2-.8,2.8,0Z",
  "chevron-right": "M31.4,22.6l-12-12c-.8-.8-2-.8-2.8,0-.8,.8-.8,2,0,2.8l10.6,10.6-10.6,10.6c-.8,.8-.8,2,0,2.8s2,.8,2.8,0l12-12c.8-.8,.8-2,0-2.8Z",
  "settings": "M24,16.55c-4.11,0-7.45,3.34-7.45,7.45s3.34,7.45,7.45,7.45,7.45-3.34,7.45-7.45-3.34-7.45-7.45-7.45Zm0,10.91c-1.9,0-3.45-1.55-3.45-3.45s1.55-3.45,3.45-3.45,3.45,1.55,3.45,3.45-1.55,3.45-3.45,3.45Zm15.29,2.79c.08-.18,.21-.33,.37-.44,.16-.11,.35-.17,.54-.17h.16c1.51,0,2.92-.59,3.98-1.65,1.07-1.06,1.65-2.48,1.65-3.99s-.59-2.92-1.65-3.98c-1.06-1.07-2.48-1.65-3.99-1.65h-.3c-.2,0-.38-.06-.55-.17-.1-.07-.19-.15-.25-.24-.03-.12-.07-.24-.12-.36-.08-.18-.1-.39-.07-.58,.04-.2,.13-.38,.25-.51l.11-.11c.53-.53,.94-1.14,1.22-1.83,.29-.69,.43-1.41,.43-2.16s-.14-1.47-.43-2.16-.7-1.3-1.22-1.83c-.53-.53-1.14-.94-1.83-1.22-1.38-.57-2.94-.57-4.32,0-.69,.29-1.3,.7-1.83,1.22l-.09,.09c-.14,.14-.32,.23-.52,.27-.2,.03-.4,.01-.6-.08-.18-.08-.33-.2-.44-.37-.11-.16-.17-.35-.17-.54v-.16c0-1.48-.6-2.94-1.65-3.98-1.06-1.06-2.48-1.65-3.99-1.65s-2.92,.59-3.98,1.65c-1.06,1.06-1.65,2.48-1.65,3.99v.3c0,.2-.06,.39-.17,.55-.07,.1-.15,.19-.24,.26-.12,.03-.24,.07-.36,.12-.18,.08-.39,.11-.58,.07-.2-.04-.38-.13-.5-.25l-.11-.11c-.53-.53-1.14-.94-1.83-1.22-1.38-.57-2.94-.57-4.32,0-.69,.28-1.3,.7-1.83,1.22-.53,.53-.94,1.14-1.22,1.83-.28,.69-.43,1.41-.43,2.16s.14,1.47,.43,2.16c.29,.69,.7,1.3,1.22,1.83l.1,.1c.14,.14,.23,.32,.27,.52,.04,.2,.01,.4-.07,.58-.02,.04-.03,.08-.05,.12-.07,.19-.19,.35-.36,.47-.16,.12-.36,.18-.51,.19h-.16c-1.51,0-2.92,.59-3.99,1.65-1.06,1.06-1.65,2.48-1.65,3.98s.59,2.92,1.65,3.99,2.48,1.65,3.99,1.65h.3c.19,0,.38,.06,.55,.17,.16,.11,.29,.26,.37,.46,.08,.18,.1,.38,.07,.58-.04,.2-.13,.38-.26,.51l-.1,.11c-.53,.53-.94,1.14-1.22,1.83-.28,.69-.43,1.41-.43,2.16s.14,1.47,.43,2.16c.29,.69,.7,1.3,1.22,1.83,.53,.53,1.14,.94,1.83,1.22,1.37,.57,2.95,.57,4.32,0,.69-.28,1.3-.7,1.83-1.23l.09-.09c.14-.14,.32-.23,.52-.27,.2-.03,.4-.01,.58,.07,.04,.02,.08,.03,.12,.05,.19,.07,.35,.19,.47,.36,.12,.16,.18,.36,.19,.51v.16c0,1.5,.59,2.92,1.65,3.99,1.06,1.06,2.48,1.65,3.98,1.65s2.92-.59,3.99-1.65c1.06-1.07,1.65-2.48,1.65-3.98v-.3c0-.2,.06-.38,.17-.55,.11-.16,.26-.29,.46-.38,.18-.08,.38-.1,.58-.07,.2,.04,.38,.13,.5,.25l.11,.11c.53,.53,1.14,.94,1.83,1.22,1.38,.57,2.95,.57,4.32,0,.69-.28,1.3-.7,1.83-1.22s.94-1.14,1.22-1.83c.29-.69,.43-1.41,.43-2.16s-.14-1.47-.43-2.16c-.28-.69-.7-1.3-1.22-1.83l-.09-.09c-.14-.14-.23-.33-.27-.52-.04-.2-.01-.4,.07-.58v-.02Zm-1.83-3.78c-.81,.54-1.45,1.29-1.83,2.19-.4,.92-.52,1.92-.34,2.9,.18,.99,.64,1.89,1.36,2.62l.11,.11c.15,.15,.27,.33,.35,.53,.08,.2,.13,.42,.13,.63s-.04,.43-.12,.63c-.08,.2-.2,.38-.36,.53s-.33,.27-.54,.36c-.39,.16-.85,.17-1.25,0-.2-.08-.38-.2-.53-.36l-.13-.13c-.72-.7-1.62-1.17-2.6-1.34-.99-.18-1.99-.06-2.89,.34-.9,.38-1.66,1.02-2.2,1.83-.54,.82-.83,1.76-.83,2.75v.31c0,.43-.17,.85-.48,1.16-.61,.61-1.7,.61-2.31,0-.31-.31-.48-.72-.48-1.16v-.21c-.02-1.01-.35-1.97-.93-2.79-.57-.8-1.36-1.41-2.28-1.76-.9-.39-1.89-.5-2.85-.32-.99,.18-1.89,.64-2.62,1.36l-.11,.11c-.15,.15-.33,.27-.53,.36-.4,.16-.85,.17-1.25,0-.2-.08-.38-.2-.53-.36-.15-.15-.27-.33-.35-.53-.08-.2-.12-.41-.12-.63s.04-.43,.12-.63c.08-.2,.2-.38,.36-.54l.12-.12c.7-.72,1.17-1.62,1.35-2.6,.18-.99,.06-1.99-.34-2.89-.39-.9-1.02-1.66-1.83-2.2-.82-.54-1.77-.83-2.75-.83h-.31c-.44,0-.85-.17-1.16-.48-.31-.31-.48-.72-.48-1.16s.17-.85,.48-1.16c.31-.31,.72-.48,1.16-.48h.21c1.01-.02,1.97-.35,2.79-.93,.8-.57,1.41-1.36,1.76-2.28,.38-.9,.5-1.89,.32-2.85-.18-.99-.64-1.89-1.36-2.62l-.11-.11c-.15-.15-.27-.33-.35-.53-.08-.2-.12-.41-.12-.63s.04-.43,.12-.63c.08-.2,.2-.38,.36-.53,.15-.15,.33-.27,.53-.36,.4-.17,.85-.17,1.25,0,.2,.08,.38,.2,.53,.35l.13,.13c.72,.7,1.62,1.17,2.6,1.34,.85,.16,1.72,.09,2.53-.19,.18-.02,.35-.07,.51-.14,.9-.39,1.66-1.02,2.2-1.83,.54-.82,.83-1.76,.83-2.75v-.31c0-.43,.17-.85,.48-1.16,.61-.61,1.7-.61,2.31,0,.3,.31,.48,.73,.48,1.16v.17c0,.98,.29,1.92,.83,2.74,.54,.81,1.3,1.45,2.18,1.83,.92,.4,1.92,.52,2.91,.34,.99-.18,1.89-.64,2.62-1.36l.11-.11c.15-.15,.33-.27,.53-.35,.4-.17,.85-.17,1.25,0,.2,.08,.38,.2,.53,.36,.15,.15,.27,.33,.36,.53,.08,.2,.12,.41,.12,.63s-.04,.43-.12,.63c-.08,.2-.2,.38-.36,.53l-.12,.12c-.7,.72-1.17,1.62-1.35,2.61-.15,.85-.09,1.72,.2,2.53,.02,.17,.07,.35,.14,.51,.38,.9,1.02,1.66,1.83,2.2,.82,.54,1.76,.83,2.75,.83h.31c.44,0,.85,.17,1.16,.48s.48,.72,.48,1.16-.17,.85-.48,1.16-.72,.48-1.16,.48h-.17c-.98,0-1.93,.29-2.74,.83Z",
  "search": "M43.4,40.6l-7.4-7.3c2.9-3.6,4.3-8.2,3.9-12.8-.4-4.6-2.5-8.9-5.9-11.9-3.4-3-7.9-4.7-12.5-4.6s-9,2-12.2,5.2c-3.2,3.2-5.2,7.7-5.3,12.3s1.5,9,4.6,12.5c3,3.4,7.3,5.5,11.9,5.9s9.1-1,12.8-3.9l7.3,7.3c.2,.2,.4,.4,.7,.5s.5,.2,.8,.2,.6,0,.8-.2c.3,0,.5-.3,.7-.5,.4-.4,.6-.9,.6-1.4s-.2-1-.6-1.4h0Zm-11.5-8.6c-2.7,2.7-6.2,4.1-9.9,4.1s-5.4-.9-7.8-2.4c-2.3-1.5-4.1-3.7-5.1-6.3-1-2.6-1.3-5.3-.8-8.1,.6-2.7,1.9-5.2,3.8-7.1,2-2,4.5-3.3,7.1-3.8,2.7-.6,5.5-.3,8.1,.8s4.8,2.9,6.3,5.1c1.5,2.3,2.4,5,2.4,7.8s-1.4,7.2-4.1,9.9Z",
  "eye": "M43.8,23.2c-4-9.3-11.6-15.2-19.8-15.2S8.2,13.8,4.2,23.2c0,.3-.2,.6-.2,.8s0,.6,.2,.8c4,9.3,11.6,15.2,19.8,15.2s15.8-5.8,19.8-15.2c0-.3,.2-.6,.2-.8s0-.6-.2-.8Zm-19.8,12.8c-6.4,0-12.4-4.6-15.8-12,3.4-7.4,9.4-12,15.8-12s12.4,4.6,15.8,12c-3.4,7.4-9.4,12-15.8,12Zm0-20c-1.6,0-3.1,.5-4.5,1.3-1.3,.9-2.4,2.1-3,3.6-.6,1.4-.8,3-.5,4.7,.3,1.5,1,3,2.2,4.1s2.6,1.9,4.1,2.2,3.1,.2,4.7-.5c1.4-.6,2.7-1.6,3.6-3,.9-1.3,1.3-2.9,1.3-4.5s-.9-4.2-2.4-5.6c-1.5-1.5-3.5-2.4-5.6-2.4Zm2.9,10.9c-.8,.8-1.8,1.1-2.9,1.1s-1.5-.2-2.2-.7c-.7-.5-1.1-1-1.4-1.8s-.4-1.5-.2-2.3c.2-.8,.6-1.5,1-2s1.2-1,2-1c.8-.2,1.6,0,2.3,.2,.8,.3,1.3,.9,1.8,1.4,.5,.7,.7,1.4,.7,2.2s-.4,2.1-1.1,2.9Z",
  "eye-slash": "M19.8,11.4c0,.2,.3,.4,.6,.6,.2,.2,.5,.3,.8,.3h.8c.7-.2,1.4-.3,2.1-.3,6.4,0,12.4,4.6,15.8,12-.6,1.1-1.1,2.2-1.8,3.2-.2,.3-.3,.7-.3,1.1s.2,.9,.4,1.2c.3,.4,.7,.6,1,.7,.4,0,.9,0,1.2,0,.4-.2,.8-.5,1-.9,1-1.4,1.7-3,2.4-4.6,0-.3,.2-.5,.2-.8s0-.6-.2-.8c-4-9.3-11.6-15.2-19.8-15.2s-1.9,0-2.8,.3c-.3,0-.5,0-.8,.3-.2,0-.4,.3-.6,.6-.2,.2-.3,.5-.3,.8v.8c0,.2,0,.5,.3,.8h0Zm23.9,29.7c0-.3-.3-.5-.5-.7L7.5,4.6c-.2-.2-.4-.4-.7-.5-.3,0-.5-.2-.8-.2s-.6,0-.8,.2c-.3,0-.5,.3-.7,.5-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4l6.2,6.2c-2.9,2.8-5,6-6.6,9.6,0,.3-.2,.6-.2,.8s0,.6,.2,.8c4,9.3,11.6,15.2,19.8,15.2s7.1-1,10.1-3l6.5,6.5c.2,.2,.4,.4,.7,.5s.5,.2,.8,.2,.6,0,.8-.2c.3,0,.5-.3,.7-.5s.4-.4,.5-.7,.2-.5,.2-.8,0-.6-.2-.8h0ZM20.1,23l4.8,4.8c-.4,0-.7,.2-1,0-1,0-2.1-.4-2.9-1.1-.8-.8-1.1-1.8-1.1-2.9s0-.7,0-1h0Zm3.9,13.1c-6.4,0-12.4-4.6-15.8-12,1.3-2.9,3.1-5.4,5.4-7.6l3.5,3.6c-.9,1.5-1.1,3.2-.9,4.9,.3,1.7,1,3.3,2.3,4.5,1.2,1.2,2.9,2,4.5,2.3,1.7,.3,3.4,0,4.9-.9l3.1,3.1c-2.2,1.2-4.7,2-7.1,2Z",
  /* ⚠️ HAND-ADDED, AND THE ONLY KEY HERE THAT IS NOT FROM THE HARVEST. `Agentic AI` is not a
     category on the instance, so re-running the generator over the live Settings list cannot
     produce this icon — a re-harvest drops it and it has to be put back.
     It is the DS's own `sparkling-star` (`observeops-icons/common/shapes-symbols/`, verbatim,
     the name `list_icons` gives it) and nothing else in this list uses it: `brain` is
     Dependency Mapper's, and `agent` means a MONITORING agent in this product (Agent Based
     Discovery, Agent Monitor Settings), so it would name the wrong thing entirely. */
  "sparkling-star": "M37.7,26.1c-7.5-2.78-13.42-8.69-16.2-16.2-.17-.47-.85-.47-1.03,0-2.78,7.5-8.69,13.42-16.2,16.2-.47.17-.47.85,0,1.02,7.5,2.78,13.42,8.69,16.2,16.2.17.48.85.48,1.03,0,2.78-7.5,8.69-13.42,16.2-16.2.48-.17.48-.85,0-1.02ZM43.8,9.88c-2.82-1.04-5.04-3.26-6.08-6.08-.06-.17-.32-.17-.38,0-1.04,2.82-3.26,5.04-6.08,6.08-.18.06-.18.32,0,.38,2.82,1.04,5.04,3.26,6.08,6.08.06.17.32.17.38,0,1.04-2.82,3.26-5.04,6.08-6.08.18-.06.18-.32,0-.38Z"
};

/* the live list, in the live order; each page carries the route it links to on the instance */
const ST_TREE = [
  {n:"My Account", ic:"my-account", subs:[["My Profile","/settings/my-account/my-profile"], ["UI Preference","/settings/my-account/ui-preference"], ["License","/settings/my-account/license"]]},
  {n:"User Settings", ic:"user-settings", subs:[["User","/settings/users-settings/"], ["User Profile","/settings/users-settings/user-profiles"], ["Personal Access Token","/settings/users-settings/personal-access-token"], ["Role","/settings/users-settings/roles"], ["Group","/settings/group-settings/"], ["Password Settings","/settings/users-settings/password-settings"], ["LDAP Server Settings","/settings/users-settings/ldap-server-settings"], ["Single Sign-On","/settings/users-settings/single-sign-on"], ["Radius Server Settings","/settings/users-settings/radius-server-settings"]]},
  {n:"System Settings", ic:"system-settings", subs:[["Two Factor Authentication","/settings/system-settings/two-factor-authentication"], ["Mail Server Settings","/settings/system-settings/mail-server-settings"], ["Proxy Server Settings","/settings/system-settings/proxy-server-settings"], ["SMS Server Settings","/settings/system-settings/sms-server-settings"], ["Rebranding","/settings/system-settings/rebranding"], ["Data Retention","/settings/system-settings/data-retention"], ["Deployment Settings","/settings/system-settings/motadata-collector"], ["MAC Address List","/settings/system-settings/mac-address-scanner"], ["Storage Profile","/settings/system-settings/external-storage-profile"], ["Backup Profile","/settings/system-settings/backup-profiles"], ["Rule Based Tags","/settings/system-settings/rule-based-tags-list"], ["DNS Server Profile","/settings/system-settings/dns-server-profiles"], ["SSH Security Settings","/settings/system-settings/ssh-security-settings"]]},
  {n:"Policy Settings", ic:"policy-settings", subs:[["Metric Policy","/settings/policy-settings/"], ["Log Policy","/settings/policy-settings/log"], ["Flow Policy","/settings/policy-settings/flow"], ["Trap Policy","/settings/policy-settings/trap"], ["NetRoute Policy","/settings/policy-settings/netroute"], ["APM Policy","/settings/policy-settings/apm"], ["Network Config Policy","/settings/policy-settings/network-config"], ["RUM Policy","/settings/policy-settings/real-user-monitoring"]]},
  {n:"Discovery Settings", ic:"network-discovery", subs:[["Credential Profile","/settings/network-discovery/"], ["Discovery Profile","/settings/network-discovery/network-discovery-profiles"]]},
  {n:"Monitor Settings", ic:"inventory", subs:[["Device Monitor Settings","/settings/monitoring/device-monitor-settings"], ["Cloud Monitor Settings","/settings/monitoring/cloud-monitor-settings"], ["Monitor Templates","/settings/monitoring/monitor-templates"], ["Agent Monitor Settings","/settings/monitoring/agent-monitor-settings"], ["Service Check Monitor Settings","/settings/monitoring/service-check-monitor-settings"], ["Process Monitor Settings","/settings/monitoring/processes"], ["Service Monitor Settings","/settings/monitoring/services"], ["File/Directory Settings","/settings/monitoring/file-directory-list"], ["SNMP Device Catalog","/settings/monitoring/snmp-device-catalog"], ["Rediscover Settings","/settings/monitoring/rediscover-setting"], ["NetRoute Settings","/settings/monitoring/netroute-setting"], ["Topology Scanner","/settings/monitoring/topology-scanner"], ["Monitoring Hour","/settings/monitoring/monitoring-hours"], ["Custom Monitoring Field","/settings/monitoring/custom-monitoring-field"]]},
  {n:"Network Config Settings", ic:"ncm", subs:[["Device Inventory","/settings/nccm-settings/device-inventory"], ["Device Template","/settings/nccm-settings/device-template"], ["Firmware Update Profile","/settings/nccm-settings/firmware-update-profile"]]},
  {n:"Compliance Settings", ic:"metric-explorer", subs:[["Compliance Policy","/settings/compliance-settings/audit-policy"], ["Benchmark","/settings/compliance-settings/benchmark"], ["Rules","/settings/compliance-settings/rules"]]},
  {n:"SNMP Trap", ic:"trap-viewer", subs:[["SNMP Trap Profile","/settings/snmp-trap/"], ["SNMP Trap Forwarder","/settings/snmp-trap/snmp-trap-forwarder"], ["SNMP Trap Listener","/settings/snmp-trap/snmp-trap-listener"]]},
  {n:"Log Settings", ic:"log", subs:[["Log Inventory","/settings/log-settings/log-inventory"], ["Log Parser Library","/settings/log-settings/log-parsers"], ["Log Collection Profile","/settings/log-settings/log-collection-profile"], ["Log Forwarder","/settings/log-settings/log-forwarder"]]},
  {n:"Flow Settings", ic:"flow", subs:[["Flow Settings","/settings/flow-settings/flow-settings"], ["Sample Rate Settings","/settings/flow-settings/sampling-rate"], ["Application Mapping","/settings/flow-settings/application-mapping"], ["Protocol Mapping","/settings/flow-settings/protocol-mapping"], ["AS Mapping","/settings/flow-settings/as-mapping"], ["Domain Mapping","/settings/flow-settings/domain-mapping"], ["Geolocation Mapping","/settings/flow-settings/geolocation-mapping"], ["IP Mapping","/settings/flow-settings/ip-mapping"]]},
  {n:"Plugin Library", ic:"plugin-library", subs:[["Runbook","/settings/plugin-library/runbooks"], ["Metric","/settings/plugin-library/metrics"], ["Topology","/settings/plugin-library/topology-plugins"], ["Log Parser Plugin","/settings/plugin-library/log-parsers"]]},
  {n:"Dependency Mapper", ic:"brain", subs:[["Parent Child Dependency Mapper","/settings/ai/dependency-mapper"]]},
  {n:"Service Level Objective", ic:"slo", beta:true, subs:[["SLO Profile","/settings/service-level-objective/slo-profile"], ["Correction Profile","/settings/service-level-objective/correction-profile"], ["Penalty Profile","/settings/service-level-objective/penalty-profile"]]},
  {n:"Utility", ic:"utility", subs:[["Ping","/settings/utility/ping"], ["SNMP Ping","/settings/utility/snmp-ping"], ["Traceroute","/settings/utility/traceroute"], ["SNMP Walk","/settings/utility/snmp-walk"], ["SNMP Community Check","/settings/utility/snmp-community-check"], ["MAC Address Resolver","/settings/utility/mac-address-resolver"], ["CLI Command","/settings/utility/cli-command"], ["Power Shell Command","/settings/utility/power-shell-command"], ["DNS Resolver","/settings/utility/dns-resolver"], ["Telnet","/settings/utility/telnet"]]},
  {n:"APM", ic:"apm", subs:[["Application Registration","/settings/apm-settings/application-registration"]]},
  {n:"Real User Monitoring", ic:"monitor", subs:[["Application Registration","/settings/digital-experience-monitoring/rum-applications"]]},
  {n:"Integration", ic:"integration", subs:[["Integration Profile","/settings/integration/integration-profile"], ["Motadata ServiceOps","/settings/integration/motadata-serviceops"], ["ServiceNow","/settings/integration/service-now"], ["Atlassian Jira","/settings/integration/atlassian-jira"], ["Microsoft Teams","/settings/integration/microsoft-teams"], ["Slack","/settings/integration/slack"], ["LAMA","/settings/integration/lama"]]},
  /* ⚠️ THE ONE CATEGORY THAT IS NOT ON THE INSTANCE (request, 31 Aug 2026: "in setting module
     create new sub module name is Agentic AI"). Everything above it is the harvested live list
     in the live order, so this is APPENDED rather than slotted in beside Dependency Mapper —
     the other `/settings/ai/` area — which would have shifted the harvest's own positions.
     ⚠️ ITS ONE PAGE IS `Overview`, which is the name the supplied Agentic AI reference gives
     its own single routed screen (that prototype's nav shows Overview and nothing else; its
     Data-&-privacy / Governance / Usage screens exist in its source but are not routed, so
     they are not built here either). It is served by the `ag*` block through `ST_PAGES`.
     ⚠️ A CATEGORY CANNOT CARRY ZERO PAGES — `stOpen()` and `stStubHTML()` both dereference
     `subs[0]` — so adding a second page here is one array entry plus one `ST_PAGES` key.
     ⚠️ THE ROUTE IS THE SHAPE ONE WOULD TAKE, not a harvested one. `/settings/ai/` is the
     namespace Dependency Mapper already sits in on the instance.
     ⚠️ The flyout picks this up for free — `mfTree('Setting')` maps `ST_TREE`, it does not
     hold its own copy. */
  {n:"Agentic AI", ic:"sparkling-star", subs:[["Overview","/settings/ai/agentic-ai"]]}
];

/* the instance's password policy, read off the component (passwordPolicyContext.policies) */
const ST_PW = { min:6, special:true, number:true, lower:true, upper:true, max:64 };
const ST_NAME_RX = /^[a-zA-Z\s'\-]{1,50}$/;

const ST = { inited:false, cat:'My Account', page:'My Profile', open:['My Account'], q:'', nav:true, full:null,
             pw:false, show:{old:false,nw:false,cf:false}, data:null, saved:null,
             avatar:null, savedAvatar:null, err:{}, tried:false, busy:false };

const stEsc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stA   = v => JSON.stringify(String(v)).replace(/"/g,'&quot;');   /* JSON quotes would close the attribute */
const stPath = n => `<path fill="currentColor" d="${ST_ICO[n]||''}"/>`;
const stSvg = (n, cls) => `<svg${cls?` class="${cls}"`:''} viewBox="0 0 48 48">${stPath(n)}</svg>`;
const stSlug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* The seed profile is the page's own signed-in user, split the way the live one was
   (“motadata admin” → First “motadata”, Last “admin”, User Name “admin”). */
function stSeed(){
  /* ⚠️ `.nm` FIRST, `.lbl` ONLY AS A FALLBACK. Option 1's rail footer gained a second line
     (the e-mail) INSIDE `.lbl` on 2 Sep 2026, so `.lbl.textContent` there is the name and the
     address run together — "Kishan Patelkishan.patel@example.com" — and this would have seeded
     the profile form with that as the first name. The other options still have a bare `.lbl`,
     and this file is shared with none of them, but the fallback keeps the two shapes readable
     by one function. */
  const lbl = document.querySelector('#sbUser .nm') || document.querySelector('#sbUser .lbl');
  const nm = ((lbl && lbl.textContent) || 'motadata admin').trim().split(/\s+/);
  const first = nm[0] || 'motadata', last = nm.slice(1).join(' ') || 'admin';
  return { first, last, user:'admin',
           email:(first+'.'+last).toLowerCase().replace(/[^a-z0-9.]+/g,'.')+'@example.com',
           mobile:'9876501234', old:'', nw:'', cf:'' };
}
function stBoot(){ if (ST.inited) return; ST.inited = true; ST.saved = stSeed(); ST.data = {...ST.saved}; }

/* entry from selectModule() — the rail's Settings row and anything that names the module */
function stInit(){
  stBoot();
  const h = document.getElementById('stHeadIc'); if (h && !h.innerHTML) h.innerHTML = stPath('settings');
  const s = document.getElementById('stSearchIc'); if (s && !s.innerHTML) s.innerHTML = stPath('search');
  const q = document.getElementById('stQ'); if (q) q.value = ST.q;
  stRender();
}
/* entry from the flyout / docked list / profile popover: open a category (and a page) */
function stOpen(cat, page){
  stBoot();
  const c = ST_TREE.find(x => x.n === cat) || ST_TREE[0];
  const p = (page && c.subs.find(s => s[0] === page)) ? page : c.subs[0][0];
  ST.cat = c.n; ST.page = p; ST.q = ''; ST.full = null;
  if (!ST.open.includes(c.n)) ST.open.push(c.n);
  if (typeof closePops === 'function') closePops();
  selectModuleByName('Settings');          /* → selectModule → showView('settings') + stInit() */
  stRender();
}
function stGo(cat, page){ ST.cat = cat; ST.page = page; ST.full = null; if (!ST.open.includes(cat)) ST.open.push(cat); stRender(); }
/* full-page screens: {title, html(), after?(), info?()} — opened by a page (Create Benchmark …),
   closed by the head's ‹, by stGo/stOpen, and by the screen's own Cancel/back */
function stFullOpen(pg){ ST.full = pg; stMainPaint(); stNavPaint(); }
function stFullClose(){ if (!ST.full) return; const back = ST.full.onClose; ST.full = null; stMainPaint(); stNavPaint(); if (back) back(); }
function stFullInfo(){ if (ST.full && ST.full.info) ST.full.info(); }
function stHeadBtn(){ if (ST.full) stFullClose(); else stPanel(); }
function stHeadPaint(){
  const t = document.getElementById('stHeadTtl'), i = document.getElementById('stHeadInfo');
  if (t) t.textContent = ST.full ? ST.full.title : 'Settings';
  if (i){ i.hidden = !(ST.full && ST.full.info); if (!i.innerHTML) i.innerHTML = stSvg('info-circle'); }
}
function stTog(cat){ const i = ST.open.indexOf(cat); if (i >= 0) ST.open.splice(i,1); else ST.open.push(cat); stNavPaint(); }
/* a category header: expanded it folds its pages, collapsed it IS the door to the category —
   see the icon-rail note above `#view-settings.stshut .stnav` in the stylesheet. If it is
   already the current category the current page is kept rather than reset to the first. */
function stCatTap(cat){
  if (ST.nav) return stTog(cat);
  const c = ST_TREE.find(x => x.n === cat); if (!c) return;
  stGo(cat, ST.cat === cat ? ST.page : c.subs[0][0]);
}
function stSearch(v){ ST.q = v; stNavPaint(); }
function stPanel(){ ST.nav = !ST.nav; stPanelPaint(); }
function stPanelPaint(){
  const v = document.getElementById('view-settings'), b = document.getElementById('stPanelBtn');
  if (!v || !b) return;
  v.classList.toggle('stshut', !ST.nav);
  v.classList.toggle('stfullpg', !!ST.full);
  b.innerHTML = stSvg(ST.full ? 'chevron-left' : ST.nav ? 'chevron-left' : 'chevron-right');
  b.setAttribute('data-tip', ST.full ? 'Back' : ST.nav ? 'Hide settings menu' : 'Show settings menu');
  stHeadPaint();
}
function stRender(){ stNavPaint(); stMainPaint(); stPanelPaint(); }

function stNavPaint(){
  const el = document.getElementById('stList'); if (!el) return;
  const q = ST.q.trim().toLowerCase();
  let html = '';
  ST_TREE.forEach(c => {
    const catHit = q && c.n.toLowerCase().includes(q);
    const subs = (!q || catHit) ? c.subs : c.subs.filter(s => s[0].toLowerCase().includes(q));
    if (q && !subs.length) return;
    const open = q ? true : ST.open.includes(c.n);
    html += `<div class="stcat${open?' open':''}${ST.cat===c.n?' cur':''}">
      <div class="stch" role="button" aria-expanded="${open}" data-tip="${stEsc(c.n)}" onclick="stCatTap(${stA(c.n)})">${stSvg(c.ic,'ic')}<span class="nm">${stEsc(c.n)}</span>${c.beta?'<span class="beta">BETA</span>':''}${stSvg('chevron-right','car')}</div>
      <div class="stsub">${subs.map(s => `<a class="stsi${(ST.cat===c.n && ST.page===s[0])?' on':''}" onclick="stGo(${stA(c.n)},${stA(s[0])})">${stEsc(s[0])}</a>`).join('')}</div>
    </div>`;
  });
  /* the live list shows nothing at all for no match; a line saying so costs nothing and reads better */
  el.innerHTML = html || `<div class="stempty">No settings match “${stEsc(ST.q.trim())}”.</div>`;
}

/* Other settings pages register themselves here (a later script block owns them — the
   Compliance Settings block does), keyed “<category> › <page>” → {html(), after?()}.
   A page the registry does not know lands on the placeholder. */
function stMainPaint(){
  const el = document.getElementById('stMain'); if (!el) return;
  const pages = (typeof ST_PAGES !== 'undefined') ? ST_PAGES : {};
  const pg = ST.full || pages[ST.cat + ' › ' + ST.page];
  if (!ST.full && ST.cat === 'My Account' && ST.page === 'My Profile') el.innerHTML = stProfileHTML();
  else if (pg) el.innerHTML = pg.html();
  else el.innerHTML = stStubHTML();
  el.scrollTop = 0;
  stPanelPaint();
  if (pg && pg.after) pg.after();
  stBtnPaint();
}
function stStubHTML(){
  const c = ST_TREE.find(x => x.n === ST.cat), s = c.subs.find(x => x[0] === ST.page) || ['',''];
  return `<div class="modwrap"><div class="modcard">${stSvg(c.ic,'ic')}
    <div class="nm">${stEsc(ST.page)}</div><div class="sub">${stEsc(s[1])}</div>
    <div class="sub">${stEsc(ST.cat)} › ${stEsc(ST.page)} — only My Account › My Profile is built in this prototype.</div></div></div>`;
}

/* ── My Profile ───────────────────────────────────────────────────────────── */
function stInitials(){ const d = ST.data; return ((d.first||'').trim()[0]||'').toUpperCase() + ((d.last||'').trim()[0]||'').toUpperCase(); }
function stAvHTML(){
  return `<div class="stavc">${ST.avatar ? `<img src="${ST.avatar}" alt="">` : stEsc(stInitials())}</div>
    <div class="stavl"><a onclick="stAvPick()">Change</a>${ST.avatar ? '<span class="sep">|</span><a class="rm" onclick="stAvRemove()">Remove</a>' : ''}</div>`;
}
function stAvPaint(){ const el = document.getElementById('stAv'); if (el) el.innerHTML = stAvHTML(); }
function stField(k, label, o){
  const e = ST.err[k];
  return `<div class="stfi${e?' err':''}" id="stfi-${k}"><div class="stfl${o.req?' req':''}">${label}</div><div class="stfc">
    <input class="stin" id="stin-${k}" type="text" value="${stEsc(ST.data[k])}"${o.dis?' disabled':''}${o.ph?` placeholder="${o.ph}"`:''} autocomplete="off" oninput="stIn('${k}',this.value)">
    <div class="stex" id="stex-${k}">${e && e.msg ? stEsc(e.msg) : ''}</div></div></div>`;
}
function stPwField(k, label, ph){
  const e = ST.err[k], show = ST.show[k];
  return `<div class="stfi stpw${e?' err':''}" id="stfi-${k}"><div class="stfl req">${label}</div><div class="stfc">
    <input class="stin" id="stin-${k}" type="${show?'text':'password'}" value="${stEsc(ST.data[k])}"${ph?` placeholder="${ph}"`:''} autocomplete="new-password"${k==='cf'?' onpaste="return false"':''} oninput="stIn('${k}',this.value)">
    <svg class="steye" id="steye-${k}" viewBox="0 0 48 48" data-tip="${show?'Hide':'Show'}" onclick="stEye('${k}')"><path fill="currentColor" d="${ST_ICO[show?'eye-slash':'eye']}"/></svg>
    <div class="stex" id="stex-${k}">${e && e.msg ? stEsc(e.msg) : ''}</div></div></div>`;
}
function stProfileHTML(){
  return `<form class="stprof" autocomplete="off" onsubmit="stSubmit();return false">
    <div class="stav" id="stAv">${stAvHTML()}</div>
    <div class="stform">
      ${stField('first','First Name',{req:1})}
      ${stField('last','Last Name',{req:1})}
      ${stField('user','User Name',{req:1,dis:1,ph:'Must be unique'})}
      ${stField('email','Email Address',{req:1})}
      ${stField('mobile','Mobile Number',{})}
      <div class="stfi"><div class="stfl">Change Password</div><div class="stfc">
        <button type="button" class="stsw${ST.pw?' on':''}" role="switch" aria-checked="${ST.pw}" onclick="stPwTog()"><span class="lb">${ST.pw?'ON':'OFF'}</span></button></div></div>
      ${ST.pw ? stPwField('old','Current Password','') + stPwField('nw','Password','Do not use simple password') + stPwField('cf','Confirm Password','Same as the password field') : ''}
    </div>
    <input type="submit" hidden>
  </form>
  <div class="stact">
    <button class="stbtn" type="button" id="stResetBtn" onclick="stReset()">Reset</button>
    <button class="stbtn pri" type="button" id="stSaveBtn" onclick="stSubmit()">Update My Profile</button>
  </div>
  <input type="file" id="stFile" accept="image/jpeg,image/png,image/svg+xml" style="display:none" onchange="stAvFile(this)">`;
}
function stIn(k, v){
  ST.data[k] = v;
  if (k === 'first' || k === 'last'){ if (!ST.avatar){ const a = document.querySelector('#stAv .stavc'); if (a) a.textContent = stInitials(); } }
  if (ST.tried){ stErrSet(k, stValidate(k)); if (k === 'nw' && ST.pw) stErrSet('cf', stValidate('cf')); }
}
function stPwTog(){
  ST.pw = !ST.pw;
  if (!ST.pw){ ST.data.old = ST.data.nw = ST.data.cf = ''; delete ST.err.old; delete ST.err.nw; delete ST.err.cf; }
  ST.show = {old:false,nw:false,cf:false};
  stMainPaint();
}
function stEye(k){
  ST.show[k] = !ST.show[k];
  const i = document.getElementById('stin-'+k), e = document.getElementById('steye-'+k);
  if (i) i.type = ST.show[k] ? 'text' : 'password';
  if (e){ e.querySelector('path').setAttribute('d', ST_ICO[ST.show[k]?'eye-slash':'eye']); e.setAttribute('data-tip', ST.show[k]?'Hide':'Show'); }
}
function stAvPick(){ const f = document.getElementById('stFile'); if (f) f.click(); }
function stAvFile(inp){
  const f = inp.files && inp.files[0]; inp.value = '';
  if (!f) return;
  if (!/^image\/(jpeg|png|svg\+xml)$/.test(f.type)){ toast('Unsupported file type — only JPEG, JPG, PNG and SVG files are allowed'); return; }
  const r = new FileReader();
  r.onload = e => { ST.avatar = e.target.result; stAvPaint(); };
  r.readAsDataURL(f);
}
function stAvRemove(){ ST.avatar = null; stAvPaint(); }

/* ── validation: the component's own rules, the messages the live form printed ── */
function stPwPolicy(v){
  if (v.length < ST_PW.min)             return {msg:`Password must be at least ${ST_PW.min} characters long`};
  if (ST_PW.special && !/[^A-Za-z0-9]/.test(v)) return {msg:'Password must contain at least a special character'};
  if (ST_PW.number  && !/\d/.test(v))   return {msg:'Password must contain at least a number character'};
  if (ST_PW.lower   && !/[a-z]/.test(v)) return {msg:'Password must contain at least a lower case character'};
  if (ST_PW.upper   && !/[A-Z]/.test(v)) return {msg:'Password must contain at least a upper case character'};
  if (v.length > ST_PW.max)             return {msg:`The Password field may not be greater than ${ST_PW.max} characters`};
  return null;
}
function stValidate(k){
  const v = String(ST.data[k] == null ? '' : ST.data[k]);
  const req = v.trim() === '' ? {req:true} : null;      /* required: label + underline go red, no message (live) */
  switch (k){
    case 'first':  return req || (!ST_NAME_RX.test(v) ? {msg:'The First Name field format is invalid'} : null);
    case 'last':   return req || (!ST_NAME_RX.test(v) ? {msg:'The Last Name field format is invalid'} : null);
    case 'user':   return req;
    case 'email':  return req || (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? {msg:'The Email Address field must be a valid email'} : null);
    case 'mobile': if (!v) return null;
                   if (!/^\d+$/.test(v)) return {msg:'The Mobile Number field may only contain numeric characters'};
                   if (v.length < 8)  return {msg:'The Mobile Number field must be at least 8 characters'};
                   if (v.length > 12) return {msg:'The Mobile Number field may not be greater than 12 characters'};
                   return null;
    case 'old':    return ST.pw ? req : null;
    case 'nw':     return ST.pw ? (req || stPwPolicy(v)) : null;
    case 'cf':     return ST.pw ? (req || (v !== ST.data.nw ? {msg:'The Password field confirmation does not match'} : null)) : null;
  }
  return null;
}
function stErrSet(k, e){
  if (e) ST.err[k] = e; else delete ST.err[k];
  const fi = document.getElementById('stfi-'+k), ex = document.getElementById('stex-'+k);
  if (fi) fi.classList.toggle('err', !!e);
  if (ex) ex.textContent = (e && e.msg) ? e.msg : '';
}
function stBtnPaint(){
  const b = document.getElementById('stSaveBtn'); if (!b) return;
  b.disabled = ST.busy;
  b.innerHTML = (ST.busy ? '<span class="stspin"></span>' : '') + 'Update My Profile';
}
function stSubmit(){
  if (ST.busy) return;
  ST.tried = true;
  const keys = ['first','last','user','email','mobile'].concat(ST.pw ? ['old','nw','cf'] : []);
  let bad = false;
  keys.forEach(k => { const e = stValidate(k); stErrSet(k, e); if (e) bad = true; });
  if (bad) return;                                   /* live: no toast, the fields say it */
  ST.busy = true; stBtnPaint();
  setTimeout(() => {
    ST.saved = {...ST.data, old:'', nw:'', cf:''}; ST.data = {...ST.saved};
    ST.savedAvatar = ST.avatar;
    ST.pw = false; ST.show = {old:false,nw:false,cf:false}; ST.err = {}; ST.tried = false; ST.busy = false;
    stIdentity(); stMainPaint();
    toast('My Profile updated');
  }, 900);
}
function stReset(){
  ST.data = {...ST.saved}; ST.avatar = ST.savedAvatar;
  ST.err = {}; ST.tried = false; ST.show = {old:false,nw:false,cf:false};
  /* ⚠️ the switch is left as it is — live onReset() never touches isChangePassword */
  stMainPaint();
}
/* the saved profile IS the signed-in user: refresh the rail row and the profile popover
   (live calls refreshUser() after the update) */
function stIdentity(){
  const d = ST.saved, name = (d.first+' '+d.last).trim(), ini = stInitials();
  /* ⚠️ WRITE THE NAME INTO `.nm` WHERE ONE EXISTS, NOT INTO `.lbl` — on Option 1's rail `.lbl`
     now wraps the name AND the e-mail sub-line, so setting its textContent would delete the
     sub-line on the first profile save. */
  const nmEl = document.querySelector('#sbUser .nm');
  document.querySelectorAll((nmEl ? '#sbUser .nm' : '#sbUser .lbl') + ', #userPop .uhead .nm, #userPop .upname')
    .forEach(el => el.textContent = name);
  /* the sub-line follows the saved e-mail, so the rail and the profile form cannot disagree */
  const subEl = document.getElementById('sbUserSub'); if (subEl) subEl.textContent = d.email || '';
  const sb = document.getElementById('sbUser'); if (sb) sb.setAttribute('data-tip', name);
  document.querySelectorAll('#sbUser .miniav, #userPop .upavatar').forEach(el => {
    if (ST.savedAvatar){ el.textContent = ''; el.style.backgroundImage = `url("${ST.savedAvatar}")`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
    else { el.style.backgroundImage = ''; el.textContent = ini; }
  });
}

/* ══════════════════════════════════════════════════════════════════════════════════════════
   BLOCK 2 of 3 — `stc*` · Compliance Settings
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════════════════
   COMPLIANCE SETTINGS  —  the three pages of the category, cloned from the live
   product (build 8.2.7) on 20 Aug 2026 at /settings/compliance-settings/
   audit-policy · benchmark · rules, plus benchmark/create, benchmark/<id>/view and
   rules/create, read in the browser: the Kendo grids (columns, widths, row
   actions, pager), the Vue components' render templates and option lists
   (AuditPolicyList / AuditPolicyForm / BenchmarkList / RulesList / RulesFom,
   pulled out of __vue__), every drawer and picker driven by hand, and the two
   (i) help panes' text.

   It plugs into the st* Settings module through ST_PAGES — the st block paints
   whatever is registered for “Compliance Settings › <page>” — and uses the st
   block's stFullOpen() for the screens that replace the whole settings view on
   live (Create Benchmark, a benchmark's view, Create Rule). Namespace `stc`;
   borrows stEsc / stA / stFullOpen / stFullClose / stMainPaint / toast.

   WHAT WAS COPIED, measured rather than invented:
     · Compliance Policy — search · eye (column chooser with Reset Column
       Preference) · Export As PDF · Export As CSV · filter toggle · Create
       Compliance Policy; filter chips Benchmark · Tags · ＋ Filter (operator
       = / != then a value); grid POLICY NAME↑ · DESCRIPTION · CREATED TIME ·
       USED COUNT (pill) · TAG (mono pills, first + “+N”) · SCHEDULE (icon when
       scheduled) · BENCHMARK · ACTIONS (run-now when usedCounts > 0, spinning
       while it runs, and ⋮ Edit · Clone · Schedule · Assign Monitor · Remove
       Assigned Monitor · Delete); 50 per page pager; a policy name opens the
       read-only “View Audit Policy” drawer (that is its live title).
       Create/Edit/Clone is a 684px (40%) drawer over a blurred page: Policy
       Name* (“Must be unique”) · Description (“Write Description here”) · Tags ·
       Config File Type* Startup|Running · Benchmark Filter by Tags · Benchmark*
       (locked while editing, as live) · Device Filter* Monitor|Group|Tag ·
       Select Device* (the grid-dropdown: search + DEVICE/IP/TYPE/GROUPS/VENDOR/
       TAGS with checkboxes) · Notify Team (“@User or Email or /Handle or #User
       Profile”) · “For more information: Compliance Policy ↗” · “* fields are
       mandatory” · Reset · Create/Update/Clone Compliance Policy.
       Schedule → “<name> Schedule” drawer (Once/Daily/Weekly/Monthly, Start
       Date, Hours, Notify*, Schedule · Reset). Assign / Remove Assigned Monitor
       → a monitor table with checkboxes, Cancel · Assign/Unassign Monitor.
     · Benchmark — search · PDF · CSV · filter · Create Benchmark; Tags chip;
       grid BENCHMARK (link; 🔒 on the system benchmark) · DESCRIPTION · USED
       COUNT · TAG · ACTIONS (⋮ Clone · Delete; the locked one has Clone only).
       A name opens the full-page view (‹ name, (i), read-only fields, the nested
       rule groups with numbered rules and their severity bars). Create Benchmark
       is a full page: Benchmark Name* · Description · Tags · the rule-group
       builder (Add Rule Group → numbered accordions: Enter Name ✓, ✎ Edit Name,
       ⊕ Add Rule Group below, Delete, Add Rule), Reset · Create Benchmark.
     · Rules — search (with ×) · Create Rule; grid RULE (severity bar) ·
       DESCRIPTION · TAG · RULE TYPE (Custom/Default) · ACTIONS (⋮ Edit · Clone ·
       Delete). Create Rule is the two-step wizard: 1 Audit & Remediation
       Properties (Rule Check in* Config File|CLI · Rule Configuration* Basic|
       Advanced · Block Criteria (Block Start* / Block End + Add Conditions) ·
       Command* for CLI · Rule Condition rows [AND/OR] Condition* Should Contain/
       Should Not contain · Result Pattern* · Occurrence* Any/1–25 ⊗ ⊕ ·
       Remediation Action: Action to be taken + Create Runbook · Reset · Next),
       2 General Properties (Rule Name* · Description · Rule Severity* Critical/
       High/Medium/Low/Info (High default) · Tags · Rationale · Impact · Default
       Value · References · Additional Information · Controls Name/Description/
       Version/IG (IG-1/2/3) + Add New Controls · Reset · Create Rule), with the
       (i) help pane text copied from the page.
     · The CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0 tree is the live one — 3 planes,
       every group and all 99 rules with their severities — and the rule list is
       those 99 “Default” rules plus the 10 “Custom” ones the instance had.

   DELIBERATE DIFFERENCES:
     · Hosts and IPs are RFC 5737; people's names in policy/benchmark names were
       neutralised (“Sagar_*” → “BFSI_*”/“Branch_*”); the live notify e-mail is not
       carried. Tags, rule titles and CIS text are as live.
     · The group accordion on live renders a BLANK third button (its Delete / Add
       Rule icon is missing in 8.2.7) — the (i) pane documents Delete and Add Rule,
       so both are built here with icons.
     · Export As PDF/CSV and Create Runbook toast instead of producing a file /
       leaving the module; the Device Filter → Group / Tag pickers are lists.
     · Primary buttons are this prototype's teal (live: white on dark).
   ═══════════════════════════════════════════════════════════════════════════ */
const STC_ICO = {"restart": "M21.7,14.3c-.6-.4-1.4-.4-2.1,0-.7,.3-1.1,1-1.1,1.8v16c0,.7,.4,1.4,1.1,1.8,.3,.2,.6,.2,.9,.2s.8-.1,1.1-.3l12-8c.6-.4,.9-1,.9-1.7s-.3-1.3-.9-1.7l-12-8Zm.9,13.9v-8.5l6.4,4.3-6.4,4.3Zm20.8-5.6c-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6-.6,.9-.6,1.4c0,3.7-1.3,7.4-3.6,10.3-2.4,2.9-5.7,4.9-9.4,5.6-3.7,.7-7.5,.1-10.8-1.6-3.3-1.8-5.9-4.7-7.3-8.1-1.4-3.5-1.5-7.3-.4-10.9,1.1-3.6,3.5-6.6,6.6-8.7,3.1-2,6.9-2.9,10.6-2.5,3.7,.4,7.2,2.2,9.8,4.9h-4.1c-.5,0-1,.2-1.4,.6-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4c.4,.4,.9,.6,1.4,.6h8.4c.5,0,1-.2,1.4-.6,.4-.4,.6-.9,.6-1.4V6.3c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6c-.4,.4-.6,.9-.6,1.4v3.2c-3.3-3.2-7.7-5.1-12.3-5.5-4.6-.4-9.2,.9-13,3.5-3.8,2.6-6.6,6.5-7.8,10.9-1.3,4.4-1,9.2,.8,13.4,1.8,4.2,5,7.7,9.1,9.9,4.1,2.1,8.8,2.8,13.3,1.9,4.5-.9,8.6-3.4,11.5-6.9,2.9-3.6,4.5-8,4.5-12.6,0-.5-.2-1-.6-1.4Z", "schedule": "M33.4,32.5h-2.7v-2.5c0-.4-.2-.8-.5-1.1-.6-.6-1.7-.6-2.3,0-.3,.3-.5,.7-.5,1.1v4.1c0,.4,.2,.8,.5,1.1,.3,.3,.7,.5,1.1,.5h4.3c.4,0,.8-.2,1.1-.5,.3-.3,.5-.7,.5-1.1s-.2-.8-.5-1.1c-.3-.3-.7-.5-1.1-.5Zm-15.7,7.4h-7c-.3,0-.5-.2-.5-.5V15.3h27.5v5.5c.9,.6,1.8,1.3,2.6,2,.4,.4,.8,.8,1.1,1.3V12.4c0-2.1-1.7-3.8-3.8-3.8h-3.8V4.6c0-.5-.4-.9-.9-.9h-3.1c-.5,0-.9,.4-.9,.9v4.1h-10V4.6c0-.5-.4-.9-.9-.9h-3.1c-.5,0-.9,.4-.9,.9v4.1h-3.8c-2.1,0-3.8,1.7-3.8,3.8v27.5c0,2.1,1.7,3.8,3.8,3.8h10.5c-.2-.2-.4-.4-.6-.6-1-1-1.7-2-2.4-3.2Zm23-11.3c-.6-1.4-1.4-2.6-2.5-3.7-1.1-1.1-2.3-1.9-3.7-2.5-3.5-1.4-7.5-1-10.6,1-1.9,1.2-3.3,3-4.2,5.1-.9,2.1-1.1,4.3-.6,6.5,.4,2.2,1.5,4.2,3.1,5.8,1.6,1.6,3.6,2.7,5.8,3.1,.7,.1,1.5,.2,2.2,.2,1.5,0,2.9-.3,4.3-.9,2.1-.9,3.8-2.3,5.1-4.2,1.2-1.9,1.9-4,1.9-6.3s-.3-2.9-.9-4.3Zm-4.8,10c-1.5,1.5-3.5,2.3-5.6,2.3s-3.1-.5-4.4-1.3c-1.3-.9-2.3-2.1-2.9-3.6-.6-1.5-.8-3.1-.5-4.6,.3-1.6,1.1-3,2.2-4.1s2.5-1.9,4.1-2.2c.5-.1,1-.2,1.6-.2,1,0,2.1,.2,3,.6,1.5,.6,2.7,1.6,3.6,2.9,.9,1.3,1.3,2.8,1.3,4.4s-.8,4.1-2.3,5.6Z", "ellipsis-v": "M24,14c2.2,0,4-1.8,4-4s-1.8-4-4-4-4,1.8-4,4,1.8,4,4,4Zm0,20c-2.2,0-4,1.8-4,4s1.8,4,4,4,4-1.8,4-4-1.8-4-4-4Zm0-14c-2.2,0-4,1.8-4,4s1.8,4,4,4,4-1.8,4-4-1.8-4-4-4Z", "pencil": "M42.4,13.6l-8-8c-.8-.8-2.1-.8-2.8,0l-6,6L5.5,31.6c-.4,.4-.5,.9-.5,1.4v7.9c0,1.1,.9,2,2,2H15c.5,0,1-.2,1.4-.5l25.9-26c.8-.8,.8-2.1,0-2.8ZM14.1,39h-5.1v-5.1L26.9,15.9l5.1,5.1L14.1,39Zm20.8-20.8l-5.1-5.1,3.2-3.2,5.1,5.1-3.2,3.2Z", "clone": "M4,8c0-2.2,1.8-4,4-4H28c2.2,0,4,1.8,4,4v8h8c2.2,0,4,1.8,4,4v20c0,2.2-1.8,4-4,4H20c-2.2,0-4-1.8-4-4v-8H8c-2.2,0-4-1.8-4-4V8Zm16,24v8h20V20h-8v8c0,2.2-1.8,4-4,4h-8Zm8-4V8H8V28H28Z", "trash-alt": "M28,36c.6,0,1-.2,1.4-.6s.6-.9,.6-1.4v-12c0-.6-.2-1-.6-1.4s-.9-.6-1.4-.6-1,.2-1.4,.6-.6,.9-.6,1.4v12c0,.6,.2,1,.6,1.4s.9,.6,1.4,.6Zm-8,0c.6,0,1-.2,1.4-.6s.6-.9,.6-1.4v-12c0-.6-.2-1-.6-1.4s-.9-.6-1.4-.6-1,.2-1.4,.6-.6,.9-.6,1.4v12c0,.6,.2,1,.6,1.4s.9,.6,1.4,.6ZM41.4,12.6c-.4-.4-.9-.6-1.4-.6h-8v-2c0-1.6-.7-3.1-1.7-4.3-1.1-1.1-2.7-1.7-4.3-1.7h-4c-1.6,0-3.1,.7-4.3,1.7-1.1,1.1-1.7,2.7-1.7,4.3v2H8c-.6,0-1,.2-1.4,.6-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4,.9,.6,1.4,.6h2v22c0,1.6,.7,3.1,1.7,4.3,1.1,1.1,2.7,1.7,4.3,1.7h16c1.6,0,3.1-.7,4.3-1.7,1.1-1.1,1.7-2.7,1.7-4.3V16h2c.6,0,1-.2,1.4-.6,.4-.4,.6-.9,.6-1.4s-.2-1-.6-1.4Zm-21.4-2.6c0-.6,.2-1,.6-1.4s.9-.6,1.4-.6h4c.6,0,1,.2,1.4,.6,.4,.4,.6,.9,.6,1.4v2h-8v-2Zm14,28c0,.6-.2,1-.6,1.4s-.9,.6-1.4,.6H16c-.6,0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4V16h20v22Z", "file-check": "M22.99,39.99H11c-.53,0-1.04-.21-1.41-.59-.37-.37-.59-.88-.59-1.41V10c0-.53,.21-1.04,.59-1.41,.37-.37,.88-.59,1.41-.59h10v6c0,1.59,.63,3.12,1.76,4.24,1.12,1.12,2.65,1.76,4.24,1.76h6v10c0,.53,.21,1.04,.59,1.41s.88,.59,1.41,.59,1.04-.21,1.41-.59,.59-.88,.59-1.41v-12.12c-.02-.18-.06-.36-.12-.54v-.18c-.1-.21-.22-.39-.38-.56h0L24.49,4.6c-.17-.16-.35-.28-.56-.38-.07-.01-.13-.01-.2,0-.19-.1-.4-.18-.62-.22H11c-1.59,0-3.12,.63-4.24,1.76s-1.76,2.65-1.76,4.24v27.99c0,1.59,.63,3.12,1.76,4.24,1.12,1.12,2.65,1.76,4.24,1.76h12c.53,0,1.04-.21,1.41-.59s.59-.88,.59-1.41-.21-1.04-.59-1.41-.88-.59-1.41-.59Zm2-29.17l5.18,5.18h-3.18c-.53,0-1.04-.21-1.41-.59-.37-.37-.59-.88-.59-1.41v-3.18ZM15,27.99h12c.53,0,1.04-.21,1.41-.59s.59-.88,.59-1.41-.21-1.04-.59-1.41-.88-.59-1.41-.59H15c-.53,0-1.04,.21-1.41,.59-.37,.37-.59,.88-.59,1.41s.21,1.04,.59,1.41c.37,.37,.88,.59,1.41,.59Zm8,4h-8c-.53,0-1.04,.21-1.41,.59-.37,.37-.59,.88-.59,1.41s.21,1.04,.59,1.41c.37,.37,.88,.59,1.41,.59h8c.53,0,1.04-.21,1.41-.59s.59-.88,.59-1.41-.21-1.04-.59-1.41-.88-.59-1.41-.59Zm-8-12h2c.53,0,1.04-.21,1.41-.59,.37-.37,.59-.88,.59-1.41s-.21-1.04-.59-1.41c-.37-.37-.88-.59-1.41-.59h-2c-.53,0-1.04,.21-1.41,.59-.37,.37-.59,.88-.59,1.41s.21,1.04,.59,1.41c.37,.37,.88,.59,1.41,.59Zm27.41,12.58c-.19-.19-.41-.34-.65-.44-.24-.1-.51-.15-.77-.15s-.53,.05-.77,.15c-.24,.1-.46,.25-.65,.44l-6.58,6.6-2.58-2.6c-.19-.19-.41-.33-.65-.44-.24-.1-.5-.15-.77-.15s-.52,.05-.77,.15c-.24,.1-.47,.25-.65,.44-.19,.19-.33,.41-.44,.65-.1,.24-.15,.5-.15,.77s.05,.52,.15,.77c.1,.24,.25,.47,.44,.65l4,4c.19,.19,.41,.34,.65,.44,.24,.1,.51,.15,.77,.15s.53-.05,.77-.15c.24-.1,.46-.25,.65-.44l8-8c.19-.19,.34-.41,.44-.65,.1-.24,.15-.51,.15-.77s-.05-.53-.15-.77c-.1-.24-.25-.46-.44-.65h0Z", "file-times": "M29.9,26.8c.1-.2,.2-.5,.2-.8s0-.5-.2-.8c-.1-.2-.3-.5-.4-.7-.2-.2-.4-.3-.7-.4-.2-.1-.5-.2-.8-.2s-.5,0-.8,.2c-.2,.1-.5,.3-.7,.4l-2.6,2.6-2.6-2.6c-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6-.6,.9-.6,1.4,.2,1,.6,1.4l2.6,2.6-2.6,2.6c-.2,.2-.3,.4-.4,.7-.1,.2-.2,.5-.2,.8s0,.5,.2,.8c.1,.2,.3,.5,.4,.7,.2,.2,.4,.3,.7,.4,.2,.1,.5,.2,.8,.2s.5,0,.8-.2c.2-.1,.5-.3,.7-.4l2.6-2.6,2.6,2.6c.2,.2,.4,.3,.7,.4,.2,.1,.5,.2,.8,.2s.5,0,.8-.2c.2-.1,.5-.3,.7-.4,.2-.2,.3-.4,.4-.7,.1-.2,.2-.5,.2-.8s0-.5-.2-.8c-.1-.2-.3-.5-.4-.7l-2.6-2.6,2.6-2.6c.2-.2,.3-.4,.4-.7Zm10-9.4v-.2c0-.2-.2-.4-.4-.6L27.5,4.6c-.2-.2-.4-.3-.6-.4h-.2c-.2-.1-.4-.2-.6-.2H14c-1.6,0-3.1,.6-4.2,1.8s-1.8,2.7-1.8,4.2v28c0,1.6,.6,3.1,1.8,4.2,1.1,1.1,2.7,1.8,4.2,1.8h20c1.6,0,3.1-.6,4.2-1.8,1.1-1.1,1.8-2.7,1.8-4.2V18h0c0-.3,0-.5-.1-.7Zm-11.9-6.5l5.2,5.2h-3.2c-.5,0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4v-3.2Zm8,27.2c0,.5-.2,1-.6,1.4s-.9,.6-1.4,.6H14c-.5,0-1-.2-1.4-.6s-.6-.9-.6-1.4V10c0-.5,.2-1,.6-1.4s.9-.6,1.4-.6h10v6c0,1.6,.6,3.1,1.8,4.2s2.7,1.8,4.2,1.8h6v18Z", "export-pdf": "M37.9,11.7l-6.6-6.6c-.7-.7-1.7-1.1-2.6-1.1H12.8c-2.1,0-3.7,1.7-3.7,3.8V40.3c0,2.1,1.7,3.7,3.7,3.7h22.5c2.1,0,3.7-1.7,3.7-3.7V14.3c0-1-.4-2-1.1-2.7Zm-3,2.4h-5.9v-5.9l5.9,5.9ZM12.8,40.3V7.8h12.5V15.9c0,1,.8,1.9,1.9,1.9h8.1v22.5H12.8Zm19.5-11.2c-1-.9-3.7-.7-5-.5-1.3-.8-2.2-2-2.9-3.6,.3-1.3,.8-3.2,.4-4.4-.3-2-3-1.8-3.3-.5-.3,1.3,0,3,.5,5.2-.8,1.9-1.9,4.4-2.8,5.8-1.6,.8-3.7,2-4,3.6-.3,1.2,2,4.3,5.9-2.4,1.7-.6,3.7-1.3,5.3-1.6,1.5,.8,3.2,1.3,4.4,1.3,2,0,2.2-2.2,1.4-3Zm-15.5,6.1c.4-1.1,1.9-2.3,2.4-2.7-1.5,2.4-2.4,2.8-2.4,2.7Zm6.4-14.9c.6,0,.5,2.5,.1,3.2-.3-1.1-.3-3.2-.1-3.2Zm-1.9,10.7c.8-1.3,1.4-2.9,1.9-4.3,.6,1.2,1.5,2.1,2.4,2.8-1.6,.3-3,1-4.3,1.5Zm10.3-.4s-.4,.5-2.9-.6c2.7-.2,3.2,.4,2.9,.6Z", "export-csv": "M37.9,11.7l-6.6-6.6c-.7-.7-1.7-1.1-2.6-1.1H12.7c-2.1,0-3.7,1.7-3.7,3.8V40.3c0,2.1,1.7,3.7,3.7,3.7h22.5c2.1,0,3.8-1.7,3.8-3.7V14.3c0-1-.4-2-1.1-2.7Zm-8.9-3.6l5.9,5.9h-5.9v-5.9h0Zm6.3,32.2H12.7V7.8h12.5V15.9c0,1,.8,1.9,1.9,1.9h8.1v22.5Zm-8.8-15.6v1.6c0,2.8,1,5.4,2.8,7.4,.2,.3,.6,.4,.9,.4s.7-.1,.9-.4c1.8-2,2.8-4.6,2.8-7.4v-1.6c0-.3-.3-.6-.6-.6h-1.2c-.3,0-.6,.3-.6,.6v1.6c0,1.6-.4,3.1-1.2,4.4-.8-1.3-1.2-2.9-1.2-4.4v-1.6c0-.3-.3-.6-.6-.6h-1.2c-.3,0-.6,.3-.6,.6Zm-8.1-.6h-.6c-2.1,0-3.8,1.7-3.8,3.8v2.5c0,2.1,1.7,3.8,3.8,3.8h.6c.3,0,.6-.3,.6-.6v-1.2c0-.3-.3-.6-.6-.6h-.6c-.7,0-1.2-.6-1.2-1.2v-2.5c0-.7,.6-1.2,1.2-1.2h.6c.3,0,.6-.3,.6-.6v-1.2c0-.3-.3-.6-.6-.6Zm4.6,3.3c-.1,0-.2-.2-.2-.3,0-.2,.3-.5,.8-.5h1c.3,0,.6-.3,.6-.6v-1.2c0-.3-.3-.6-.6-.6h-1c-1.8,0-3.3,1.4-3.3,3s.4,1.6,1,2.2l1.7,1.5c.1,0,.2,.2,.2,.3,0,.2-.3,.5-.8,.5h-1c-.3,0-.6,.3-.6,.6v1.2c0,.3,.3,.6,.6,.6h1c1.8,0,3.3-1.4,3.3-3s-.4-1.6-1-2.2l-1.7-1.5h0Z", "filter": "M28,44c-.3,0-.6,0-.9-.2l-8-4c-.7-.3-1.1-1-1.1-1.8v-12.3L2.5,7.3c-.5-.6-.6-1.4-.3-2.1,.3-.7,1-1.2,1.8-1.2H44c.8,0,1.5,.5,1.8,1.2s.2,1.5-.3,2.1l-15.5,18.4v16.3c0,.7-.4,1.3-.9,1.7-.3,.2-.7,.3-1.1,.3Zm-6-7.2l4,2v-13.8c0-.5,.2-.9,.5-1.3l13.2-15.6H8.3l13.2,15.6c.3,.4,.5,.8,.5,1.3v11.8Z", "plus": "M38,22h-12V10c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6c-.4,.4-.6,.9-.6,1.4v12H10c-.5,0-1,.2-1.4,.6-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4c.4,.4,.9,.6,1.4,.6h12v12c0,.5,.2,1,.6,1.4s.9,.6,1.4,.6,1-.2,1.4-.6,.6-.9,.6-1.4v-12h12c.5,0,1-.2,1.4-.6s.6-.9,.6-1.4-.2-1-.6-1.4-.9-.6-1.4-.6Z", "eye": "M43.8,23.2c-4-9.3-11.6-15.2-19.8-15.2S8.2,13.8,4.2,23.2c0,.3-.2,.6-.2,.8s0,.6,.2,.8c4,9.3,11.6,15.2,19.8,15.2s15.8-5.8,19.8-15.2c0-.3,.2-.6,.2-.8s0-.6-.2-.8Zm-19.8,12.8c-6.4,0-12.4-4.6-15.8-12,3.4-7.4,9.4-12,15.8-12s12.4,4.6,15.8,12c-3.4,7.4-9.4,12-15.8,12Zm0-20c-1.6,0-3.1,.5-4.5,1.3-1.3,.9-2.4,2.1-3,3.6-.6,1.4-.8,3-.5,4.7,.3,1.5,1,3,2.2,4.1s2.6,1.9,4.1,2.2,3.1,.2,4.7-.5c1.4-.6,2.7-1.6,3.6-3,.9-1.3,1.3-2.9,1.3-4.5s-.9-4.2-2.4-5.6c-1.5-1.5-3.5-2.4-5.6-2.4Zm2.9,10.9c-.8,.8-1.8,1.1-2.9,1.1s-1.5-.2-2.2-.7c-.7-.5-1.1-1-1.4-1.8s-.4-1.5-.2-2.3c.2-.8,.6-1.5,1-2s1.2-1,2-1c.8-.2,1.6,0,2.3,.2,.8,.3,1.3,.9,1.8,1.4,.5,.7,.7,1.4,.7,2.2s-.4,2.1-1.1,2.9Z", "search": "M43.4,40.6l-7.4-7.3c2.9-3.6,4.3-8.2,3.9-12.8-.4-4.6-2.5-8.9-5.9-11.9-3.4-3-7.9-4.7-12.5-4.6s-9,2-12.2,5.2c-3.2,3.2-5.2,7.7-5.3,12.3s1.5,9,4.6,12.5c3,3.4,7.3,5.5,11.9,5.9s9.1-1,12.8-3.9l7.3,7.3c.2,.2,.4,.4,.7,.5s.5,.2,.8,.2,.6,0,.8-.2c.3,0,.5-.3,.7-.5,.4-.4,.6-.9,.6-1.4s-.2-1-.6-1.4h0Zm-11.5-8.6c-2.7,2.7-6.2,4.1-9.9,4.1s-5.4-.9-7.8-2.4c-2.3-1.5-4.1-3.7-5.1-6.3-1-2.6-1.3-5.3-.8-8.1,.6-2.7,1.9-5.2,3.8-7.1,2-2,4.5-3.3,7.1-3.8,2.7-.6,5.5-.3,8.1,.8s4.8,2.9,6.3,5.1c1.5,2.3,2.4,5,2.4,7.8s-1.4,7.2-4.1,9.9Z", "chevron-down": "M37.4,16.6c-.8-.8-2-.8-2.8,0l-10.6,10.6-10.6-10.6c-.8-.8-2-.8-2.8,0-.8,.8-.8,2,0,2.8l12,12c.8,.8,2,.8,2.8,0l12-12c.8-.8,.8-2,0-2.8Z", "plus-circle": "M42.5,16.3c-1-2.4-2.5-4.6-4.3-6.5s-4.1-3.3-6.5-4.3c-2.4-1-5-1.5-7.7-1.5-4,0-7.8,1.2-11.1,3.4-3.3,2.2-5.9,5.3-7.4,9-1.5,3.7-1.9,7.7-1.1,11.6,.8,3.9,2.7,7.4,5.5,10.2,2.8,2.8,6.4,4.7,10.2,5.5,3.9,.8,7.9,.4,11.6-1.1,3.7-1.5,6.8-4.1,9-7.4,2.2-3.3,3.4-7.2,3.4-11.1s-.5-5.2-1.5-7.7Zm-7.2,19c-3,3-7.1,4.7-11.3,4.7s-6.3-.9-8.9-2.7c-2.6-1.8-4.7-4.3-5.9-7.2-1.2-2.9-1.5-6.1-.9-9.2,.6-3.1,2.1-6,4.4-8.2s5.1-3.8,8.2-4.4c3.1-.6,6.3-.3,9.2,.9,2.9,1.2,5.4,3.3,7.2,5.9,1.8,2.6,2.7,5.7,2.7,8.9s-1.7,8.3-4.7,11.3Zm-3.3-13.3h-6v-6c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6c-.4,.4-.6,.9-.6,1.4v6h-6c-.5,0-1,.2-1.4,.6-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4c.4,.4,.9,.6,1.4,.6h6v6c0,.5,.2,1,.6,1.4s.9,.6,1.4,.6,1-.2,1.4-.6,.6-.9,.6-1.4v-6h6c.5,0,1-.2,1.4-.6s.6-.9,.6-1.4-.2-1-.6-1.4-.9-.6-1.4-.6Z", "info-circle": "M24,22c-.6,0-1.1,.2-1.4,.6s-.6,.9-.6,1.4v8c0,.6,.2,1.1,.6,1.4s.9,.6,1.4,.6,1.1-.2,1.4-.6,.6-.9,.6-1.4v-8c0-.6-.2-1.1-.6-1.4s-.9-.6-1.4-.6Zm.8-7.8c-.5-.2-1.1-.2-1.5,0-.3,0-.5,.2-.7,.4s-.3,.4-.4,.7c0,.2-.2,.5-.2,.8s0,.6,.2,.8c0,.3,.3,.5,.5,.7s.4,.3,.7,.4c.3,0,.7,.2,1,0,.3,0,.7-.2,1-.3,.3-.2,.5-.4,.7-.8,.2-.3,.2-.6,.3-1,0-.6-.2-1.1-.6-1.4-.2-.2-.4-.3-.7-.4h-.2Zm17.8,2.3c-1.1-2.4-2.5-4.7-4.4-6.5-1.9-1.9-4.1-3.3-6.5-4.4s-5.1-1.5-7.6-1.5c-4,0-7.8,1.1-11.2,3.3s-5.8,5.3-7.4,9-1.9,7.7-1.1,11.6c.8,3.9,2.7,7.4,5.4,10.3,2.8,2.8,6.4,4.7,10.3,5.4,3.9,.8,7.9,.4,11.6-1.1,3.6-1.5,6.8-4.1,9-7.4,2.2-3.3,3.3-7.2,3.3-11.2s-.5-5.3-1.5-7.6h0Zm-7.2,19.1c-3.1,3.1-7.1,4.7-11.4,4.7s-6.3-1-8.9-2.7c-2.7-1.7-4.7-4.3-5.9-7.2-1.2-3-1.5-6.1-1-9.3,.6-3.2,2.1-6,4.4-8.2s5.1-3.7,8.2-4.4c3.2-.6,6.3-.3,9.3,1,3,1.2,5.4,3.2,7.2,5.9s2.7,5.7,2.7,8.9-1.7,8.3-4.7,11.4h0Z", "chevron-left": "M31.4,10.6c.8,.8,.8,2,0,2.8l-10.6,10.6,10.6,10.6c.8,.8,.8,2,0,2.8-.8,.8-2,.8-2.8,0l-12-12c-.8-.8-.8-2,0-2.8l12-12c.8-.8,2-.8,2.8,0Z", "times-circle": "M31.8,18.8c.1-.2,.2-.5,.2-.8s0-.5-.2-.8c-.1-.2-.2-.5-.4-.6-.2-.2-.4-.3-.6-.4s-.5-.2-.8-.2-.5,0-.8,.2c-.2,.1-.5,.2-.6,.4l-4.5,4.5-4.5-4.5c-.4-.4-.9-.6-1.4-.6s-1,.2-1.4,.6c-.4,.4-.6,.9-.6,1.4s.2,1,.6,1.4l4.5,4.5-4.5,4.5c-.2,.2-.3,.4-.4,.6-.1,.2-.2,.5-.2,.8s0,.5,.2,.8c.1,.2,.2,.5,.4,.6,.2,.2,.4,.3,.6,.4s.5,.2,.8,.2,.5,0,.8-.2c.2-.1,.5-.2,.6-.4l4.5-4.5,4.5,4.5c.2,.2,.4,.3,.6,.4,.2,.1,.5,.2,.8,.2s.5,0,.8-.2,.5-.2,.6-.4c.2-.2,.3-.4,.4-.6,.1-.2,.2-.5,.2-.8s0-.5-.2-.8c-.1-.2-.2-.5-.4-.6l-4.5-4.5,4.5-4.5c.2-.2,.3-.4,.4-.6Zm10.6-2.4c-1-2.4-2.5-4.6-4.4-6.4-1.8-1.9-4-3.4-6.4-4.4-2.4-1-5-1.6-7.6-1.6s-5.2,.5-7.7,1.5-4.6,2.5-6.5,4.3-3.3,4.1-4.3,6.5-1.5,5-1.5,7.7,.6,5.2,1.6,7.6c1,2.4,2.5,4.6,4.4,6.4,1.8,1.9,4,3.4,6.4,4.4,2.4,1,5,1.6,7.6,1.6,2.6,0,5.2-.5,7.7-1.5,2.4-1,4.6-2.5,6.5-4.3,1.9-1.9,3.3-4.1,4.3-6.5,1-2.4,1.5-5,1.5-7.7,0-2.6-.6-5.2-1.6-7.6Zm-3.8,13.6c-.8,1.9-2,3.7-3.4,5.1-2.6,2.6-6,4.2-9.6,4.6-3.6,.4-7.3-.6-10.3-2.6s-5.3-5.1-6.3-8.5c-1.1-3.5-.9-7.3,.5-10.6,1.4-3.4,3.9-6.2,7.1-7.9,3.2-1.7,6.9-2.3,10.5-1.6,3.6,.7,6.8,2.6,9.1,5.5,2.3,2.8,3.6,6.4,3.6,10,0,2.1-.4,4.1-1.2,6.1Z", "lock-alt": "M38.3,19.7c-1.1-1.1-2.7-1.7-4.3-1.7v-4c0-2.7-1-5.2-3-7-1.9-1.9-4.4-3-7-3s-5.2,1-7,3c-1.9,1.9-3,4.4-3,7v4c-1.6,0-3.1,.7-4.3,1.7s-1.7,2.7-1.7,4.3v14c0,1.6,.7,3.1,1.7,4.3s2.7,1.7,4.3,1.7h20c1.6,0,3.1-.7,4.3-1.7s1.7-2.7,1.7-4.3v-14c0-1.6-.7-3.1-1.7-4.3Zm-20.3-5.7c0-1.6,.7-3.1,1.7-4.3s2.7-1.7,4.3-1.7,3.1,.7,4.3,1.7c1.1,1.1,1.7,2.7,1.7,4.3v4h-12v-4Zm18,24c0,.6-.2,1-.6,1.4-.4,.4-.9,.6-1.4,.6H14c-.6,0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4v-14c0-.6,.2-1,.6-1.4s.9-.6,1.4-.6h20c.6,0,1,.2,1.4,.6s.6,.9,.6,1.4v14Zm-12-12c-.6,0-1,.2-1.4,.6s-.6,.9-.6,1.4v6c0,.6,.2,1,.6,1.4s.9,.6,1.4,.6,1-.2,1.4-.6c.4-.4,.6-.9,.6-1.4v-6c0-.6-.2-1-.6-1.4s-.9-.6-1.4-.6Z", "move-up": "M17.9922 36.5059C16.3356 36.5059 14.9922 37.8493 14.9922 39.5059C14.9922 41.1624 16.3356 42.5059 17.9922 42.5059C19.6488 42.5059 20.9922 41.1624 20.9922 39.5059C20.9922 37.8493 19.6488 36.5059 17.9922 36.5059ZM17.9922 21.5059C16.3356 21.5059 14.9922 22.8493 14.9922 24.5059C14.9922 26.1624 16.3356 27.5059 17.9922 27.5059C19.6488 27.5059 20.9922 26.1624 20.9922 24.5059C20.9922 22.8493 19.6488 21.5059 17.9922 21.5059ZM29.9922 12.5059C31.6488 12.5059 32.9922 11.1624 32.9922 9.50586C32.9922 7.8493 31.6488 6.50586 29.9922 6.50586C28.3356 6.50586 26.9922 7.8493 26.9922 9.50586C26.9922 11.1624 28.3356 12.5059 29.9922 12.5059ZM29.9922 21.5059C28.3356 21.5059 26.9922 22.8493 26.9922 24.5059C26.9922 26.1624 28.3356 27.5059 29.9922 27.5059C31.6488 27.5059 32.9922 26.1624 32.9922 24.5059C32.9922 22.8493 31.6488 21.5059 29.9922 21.5059ZM17.9922 6.50586C16.3356 6.50586 14.9922 7.8493 14.9922 9.50586C14.9922 11.1624 16.3356 12.5059 17.9922 12.5059C19.6488 12.5059 20.9922 11.1624 20.9922 9.50586C20.9922 7.8493 19.6488 6.50586 17.9922 6.50586ZM29.9922 36.5059C28.3356 36.5059 26.9922 37.8493 26.9922 39.5059C26.9922 41.1624 28.3356 42.5059 29.9922 42.5059C31.6488 42.5059 32.9922 41.1624 32.9922 39.5059C32.9922 37.8493 31.6488 36.5059 29.9922 36.5059Z", "check": "M40.6,12.6c-.8-.8-2-.8-2.8,0L18,32.4l-7.8-7.8c-.8-.8-2-.8-2.8,0s-.8,2,0,2.8l9.2,9.2c.4,.4,.9,.6,1.4,.6s1-.2,1.4-.6l21.2-21.2c.8-.8,.8-2,0-2.8Z", "chevron-right": "M31.4,22.6l-12-12c-.8-.8-2-.8-2.8,0-.8,.8-.8,2,0,2.8l10.6,10.6-10.6,10.6c-.8,.8-.8,2,0,2.8s2,.8,2.8,0l12-12c.8-.8,.8-2,0-2.8Z", "times": "M27.1,24l9.4-9.4c.8-.8,.8-2.1,0-2.9s-2.1-.8-2.9,0l-9.4,9.4-9.4-9.4c-.8-.8-2.1-.8-2.9,0s-.8,2.1,0,2.9l9.4,9.4-9.4,9.4c-.8,.8-.8,2.1,0,2.9,.4,.4,.9,.6,1.4,.6s1-.2,1.4-.6l9.4-9.4,9.4,9.4c.4,.4,.9,.6,1.4,.6s1-.2,1.4-.6c.8-.8,.8-2.1,0-2.9l-9.4-9.4Z", "external-link": "M40,26c-1.1,0-2,.9-2,2v10c0,1.1-.9,2-2,2H10c-1.1,0-2-.9-2-2V12c0-1.1,.9-2,2-2h10c1.1,0,2-.9,2-2s-.9-2-2-2H10c-3.3,0-6,2.7-6,6v26c0,3.3,2.7,6,6,6h26c3.3,0,6-2.7,6-6v-10c0-1.1-.9-2-2-2ZM42,4h-12c-1.1,0-2,.9-2,2s.9,2,2,2h7.2l-15.6,15.6c-.8,.8-.8,2,0,2.8,.4,.4,.9,.6,1.4,.6s1-.2,1.4-.6l15.6-15.6v7.2c0,1.1,.9,2,2,2s2-.9,2-2V6c0-1.1-.9-2-2-2Z"};
const STC_RULES0 = [{"id": 1, "n": "Ensure hfs kernel module is not available", "sev": "MEDIUM", "d": "The hfs filesystem type is a hierarchical filesystem that allows you to mount Mac OS filesystems.", "tags": ["compliance"], "type": "Custom"}, {"id": 2, "n": "NATEnabled", "sev": "MEDIUM", "d": "Verifies that NAT (Network Address Translation) is configured on the device to prevent direct exposure of internal IP addresses.", "tags": ["hipaa"], "type": "Custom"}, {"id": 3, "n": "EnableLoginFailureLogs", "sev": "CRITICAL", "d": "Checks that login failures are logged on the device. This ensures auditability of unsuccessful access attempts.", "tags": ["hipaa"], "type": "Custom"}, {"id": 4, "n": "Copy of Set 'snmp-server host' when using SNMP", "sev": "CRITICAL", "d": "SNMP notifications can be sent as traps to authorized management systems.", "tags": ["profile applicability:level 1", "vendor:cisco systems"], "type": "Custom"}, {"id": 5, "n": "SrPasswordEncryptionEnabled", "sev": "HIGH", "d": "Checks that the global configuration command 'service password-encryption' is enabled, ensuring all locally stored passwords are obscured.", "tags": ["hipaa"], "type": "Custom"}, {"id": 6, "n": "SrPasswordLengthEnabled", "sev": "HIGH", "d": "Checks that a minimum password length is enforced in the configuration, preventing the use of weak, short passwords.", "tags": ["hipaa"], "type": "Custom"}, {"id": 7, "n": "NoPublicCommunity", "sev": "CRITICAL", "d": "Checks that the SNMP community string 'public' is not configured on the device.", "tags": ["hipaa"], "type": "Custom"}, {"id": 8, "n": "NBAREnabled", "sev": "MEDIUM", "d": "Checks whether NBAR protocol discovery is enabled on the device. This supports HIPAA’s requirement to regularly review system activity.", "tags": ["hipaa"], "type": "Custom"}, {"id": 9, "n": "Unique User ID", "sev": "HIGH", "d": "Verifies that each administrator has a unique user ID in device configurations. Prevents use of shared admin logins.", "tags": ["hipaa"], "type": "Custom"}, {"id": 10, "n": "unique username should be there", "sev": "HIGH", "d": "unique username should be there", "tags": [], "type": "Custom"}, {"id": 101, "n": "Enable 'aaa new-model'", "sev": "CRITICAL", "d": "This command enables the AAA access control system.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.1"}, {"id": 102, "n": "Enable 'aaa authentication login'", "sev": "CRITICAL", "d": "Recommendation 1.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.2"}, {"id": 103, "n": "Enable 'aaa authentication enable default'", "sev": "CRITICAL", "d": "Recommendation 1.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.3"}, {"id": 104, "n": "Set 'login authentication for 'line vty'", "sev": "CRITICAL", "d": "Recommendation 1.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.4"}, {"id": 105, "n": "Set 'login authentication for 'ip http'", "sev": "CRITICAL", "d": "Recommendation 1.1.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.5"}, {"id": 106, "n": "Set 'aaa accounting' to log all privileged use commands using 'commands 15'", "sev": "HIGH", "d": "Recommendation 1.1.6 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.6"}, {"id": 107, "n": "Set 'aaa accounting connection'", "sev": "HIGH", "d": "Recommendation 1.1.7 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.7"}, {"id": 108, "n": "Set 'aaa accounting exec'", "sev": "HIGH", "d": "Recommendation 1.1.8 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.8"}, {"id": 109, "n": "Set 'aaa accounting network'", "sev": "HIGH", "d": "Recommendation 1.1.9 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.9"}, {"id": 110, "n": "Set 'aaa accounting system'", "sev": "HIGH", "d": "Recommendation 1.1.10 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.1.10"}, {"id": 111, "n": "Set 'privilege 1' for local users", "sev": "CRITICAL", "d": "Recommendation 1.2.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.1"}, {"id": 112, "n": "Set 'transport input ssh' for 'line vty' connections", "sev": "CRITICAL", "d": "Recommendation 1.2.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.2"}, {"id": 113, "n": "Set 'no exec' for 'line aux 0'", "sev": "CRITICAL", "d": "Recommendation 1.2.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.3"}, {"id": 114, "n": "Create 'access-list' for use with 'line vty'", "sev": "CRITICAL", "d": "Recommendation 1.2.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.4"}, {"id": 115, "n": "Set 'access-class' for 'line vty'", "sev": "CRITICAL", "d": "Recommendation 1.2.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.5"}, {"id": 116, "n": "Set 'exec-timeout' to less than or equal to 10 minutes for 'line aux 0'", "sev": "CRITICAL", "d": "If no input is detected during the interval, the EXEC facility resumes the current connection. If no connections exist, the EXEC facility returns the terminal to the idle state and disconnects the incoming session.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.6"}, {"id": 117, "n": "Set 'exec-timeout' to less than or equal to 10 minutes 'line console 0'", "sev": "CRITICAL", "d": "If no input is detected during the interval, the EXEC facility resumes the current connection. If no connections exist, the EXEC facility returns the terminal to the idle state and disconnects the incoming session.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.7"}, {"id": 118, "n": "Set 'exec-timeout' to less than or equal to 10 minutes 'line vty'", "sev": "CRITICAL", "d": "If no input is detected during the interval, the EXEC facility resumes the current connection. If no connections exist, the EXEC facility returns the terminal to the idle state and disconnects the incoming session.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.8"}, {"id": 119, "n": "Set 'transport input none' for 'line aux 0'", "sev": "CRITICAL", "d": "When you want to allow only an outgoing connection on a line, use the no exec command.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.9"}, {"id": 120, "n": "Set 'http Secure-server' limit", "sev": "CRITICAL", "d": "Device management includes the ability to control the number of administrators and management sessions that manage a device.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.10"}, {"id": 121, "n": "Set 'exec-timeout' to less than or equal to 10 min on 'ip http'", "sev": "CRITICAL", "d": "If no input is detected during the interval, the EXEC facility resumes the current connection. If no connections exist, the EXEC facility returns the terminal to the idle state and disconnects the incoming session.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.2.11"}, {"id": 122, "n": "Set the 'banner-text' for 'banner exec'", "sev": "MEDIUM", "d": "This command specifies a message to be displayed when an EXEC process is created (a line is activated, or an incoming connection is made to a vty).", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.3.1"}, {"id": 123, "n": "Set the 'banner-text' for 'banner login'", "sev": "MEDIUM", "d": "Follow the banner login command with one or more blank spaces and a delimiting character of your choice. Then enter one or more lines of text, terminating the message with the second occurrence of the delimiting character.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.3.2"}, {"id": 124, "n": "Set the 'banner-text' for 'banner motd'", "sev": "MEDIUM", "d": "Recommendation 1.3.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.3.3"}, {"id": 125, "n": "Set the 'banner-text' for 'webauth banner'", "sev": "MEDIUM", "d": "Recommendation 1.3.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.3.4"}, {"id": 126, "n": "Set 'password' for 'enable secret'", "sev": "CRITICAL", "d": "Recommendation 1.4.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.4.1"}, {"id": 127, "n": "Enable 'service password-encryption'", "sev": "CRITICAL", "d": "When password encryption is enabled, the encrypted form of the passwords is displayed when a 'more system:running-config' command is entered.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.4.2"}, {"id": 128, "n": "Set 'username secret' for all local users", "sev": "CRITICAL", "d": "Recommendation 1.4.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.4.3"}, {"id": 129, "n": "Set 'no snmp-server' to disable SNMP when unused", "sev": "CRITICAL", "d": "Recommendation 1.5.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.1"}, {"id": 130, "n": "Unset 'private' for 'snmp-server community'", "sev": "CRITICAL", "d": "An SNMP community string permits read-only access to all objects.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.2"}, {"id": 131, "n": "Unset 'public' for 'snmp-server community'", "sev": "CRITICAL", "d": "An SNMP community string permits read-only access to all objects.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.3"}, {"id": 132, "n": "Do not set 'RW' for any 'snmp-server community'", "sev": "CRITICAL", "d": "Recommendation 1.5.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.4"}, {"id": 133, "n": "Set the ACL for each 'snmp-server community'", "sev": "CRITICAL", "d": "Recommendation 1.5.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.5"}, {"id": 134, "n": "Create an 'access-list' for use with SNMP", "sev": "CRITICAL", "d": "Recommendation 1.5.6 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.6"}, {"id": 135, "n": "Set 'snmp-server host' when using SNMP", "sev": "CRITICAL", "d": "SNMP notifications can be sent as traps to authorized management systems.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.7"}, {"id": 136, "n": "Set 'snmp-server enable traps snmp'", "sev": "CRITICAL", "d": "Recommendation 1.5.8 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.8"}, {"id": 137, "n": "Set 'priv' for each 'snmp-server group' using SNMPv3", "sev": "CRITICAL", "d": "Recommendation 1.5.9 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.9"}, {"id": 138, "n": "Require 'aes 128' as minimum for 'snmp-server user' when using SNMPv3", "sev": "CRITICAL", "d": "Recommendation 1.5.10 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "1.5.10"}, {"id": 139, "n": "Set the 'hostname'", "sev": "HIGH", "d": "Recommendation 2.1.1.1.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.1.1.1"}, {"id": 140, "n": "Set the 'ip domain-name'", "sev": "HIGH", "d": "Recommendation 2.1.1.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.1.1.2"}, {"id": 141, "n": "Set 'seconds' for 'ip ssh timeout' for 60 seconds or less", "sev": "HIGH", "d": "Recommendation 2.1.1.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.1.1.3"}, {"id": 142, "n": "Set maximum value for 'ip ssh authentication-retries'", "sev": "HIGH", "d": "Recommendation 2.1.1.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.1.1.4"}, {"id": 143, "n": "Set version 2 for 'ip ssh version'", "sev": "CRITICAL", "d": "Recommendation 2.1.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.1.2"}, {"id": 144, "n": "Set 'no cdp run'", "sev": "HIGH", "d": "Recommendation 2.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.2"}, {"id": 145, "n": "Set 'no ip bootp server'", "sev": "HIGH", "d": "Recommendation 2.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.3"}, {"id": 146, "n": "Set 'no service dhcp'", "sev": "HIGH", "d": "Recommendation 2.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.4"}, {"id": 147, "n": "Set 'no ip identd'", "sev": "HIGH", "d": "Recommendation 2.1.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.5"}, {"id": 148, "n": "Set 'service tcp-keepalives-in'", "sev": "HIGH", "d": "Recommendation 2.1.6 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.6"}, {"id": 149, "n": "Set 'service tcp-keepalives-out'", "sev": "HIGH", "d": "Recommendation 2.1.7 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.7"}, {"id": 150, "n": "Set 'no service pad'", "sev": "HIGH", "d": "Recommendation 2.1.8 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.1.8"}, {"id": 151, "n": "Set 'logging enable'", "sev": "CRITICAL", "d": "Recommendation 2.2.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.1"}, {"id": 152, "n": "Set 'buffer size' for 'logging buffered'", "sev": "CRITICAL", "d": "Recommendation 2.2.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.2"}, {"id": 153, "n": "Set 'logging console critical'", "sev": "CRITICAL", "d": "Recommendation 2.2.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.3"}, {"id": 154, "n": "Set IP address for 'logging host'", "sev": "CRITICAL", "d": "Recommendation 2.2.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.4"}, {"id": 155, "n": "Set 'logging trap informational'", "sev": "CRITICAL", "d": "Recommendation 2.2.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.5"}, {"id": 156, "n": "Set 'service timestamps debug datetime'", "sev": "CRITICAL", "d": "Recommendation 2.2.6 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.6"}, {"id": 157, "n": "Set 'logging source interface'", "sev": "CRITICAL", "d": "Recommendation 2.2.7 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.7"}, {"id": 158, "n": "Set 'login success/failure logging'", "sev": "CRITICAL", "d": "Recommendation 2.2.8 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.2.8"}, {"id": 159, "n": "Set 'ntp authenticate'", "sev": "HIGH", "d": "Recommendation 2.3.1.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.3.1.1"}, {"id": 160, "n": "Set 'ntp authentication-key'", "sev": "HIGH", "d": "Recommendation 2.3.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.3.1.2"}, {"id": 161, "n": "Set the 'ntp trusted-key'", "sev": "HIGH", "d": "Recommendation 2.3.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.3.1.3"}, {"id": 162, "n": "Set 'key' for each 'ntp server'", "sev": "HIGH", "d": "Recommendation 2.3.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.3.1.4"}, {"id": 163, "n": "Set 'ip address' for 'ntp server'", "sev": "CRITICAL", "d": "Recommendation 2.3.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.3.2"}, {"id": 164, "n": "Create a single 'interface loopback'", "sev": "HIGH", "d": "Recommendation 2.4.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.4.1"}, {"id": 165, "n": "Set AAA 'source-interface'", "sev": "HIGH", "d": "Recommendation 2.4.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.4.2"}, {"id": 166, "n": "Set 'ntp source' to Loopback Interface", "sev": "HIGH", "d": "Recommendation 2.4.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.4.3"}, {"id": 167, "n": "Set 'ip tftp source-interface' to the Loopback Interface", "sev": "HIGH", "d": "Recommendation 2.4.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "2.4.4"}, {"id": 168, "n": "Set 'no ip source-route'", "sev": "HIGH", "d": "Recommendation 3.1.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.1.1"}, {"id": 169, "n": "Set 'no ip proxy-arp'", "sev": "HIGH", "d": "Recommendation 3.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.1.2"}, {"id": 170, "n": "Set 'no interface tunnel'", "sev": "HIGH", "d": "Recommendation 3.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.1.3"}, {"id": 171, "n": "Set 'ip verify unicast source reachable-via'", "sev": "HIGH", "d": "Recommendation 3.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.1.4"}, {"id": 172, "n": "Set 'ip access-list extended' to Forbid Private Source Addresses from External Networks", "sev": "MEDIUM", "d": "Recommendation 3.2.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.2.1"}, {"id": 173, "n": "Set inbound 'ip access-group' on the External Interface", "sev": "MEDIUM", "d": "Recommendation 3.2.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.2.2"}, {"id": 174, "n": "Set 'key chain'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.1"}, {"id": 175, "n": "Set 'key'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.2"}, {"id": 176, "n": "Set 'key-string'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.3 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.3"}, {"id": 177, "n": "Set 'address-family ipv4 autonomous-system'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.4 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.4"}, {"id": 178, "n": "Set 'af-interface default'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.5 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.5"}, {"id": 179, "n": "Set 'authentication key-chain'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.6 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.6"}, {"id": 180, "n": "Set 'authentication mode md5'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.7 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.7"}, {"id": 181, "n": "Set 'ip authentication key-chain eigrp'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.8 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.8"}, {"id": 182, "n": "Set 'ip authentication mode eigrp'", "sev": "MEDIUM", "d": "Recommendation 3.3.1.9 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.1.9"}, {"id": 183, "n": "Set 'authentication message-digest' for OSPF area", "sev": "MEDIUM", "d": "Recommendation 3.3.2.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.2.1"}, {"id": 184, "n": "Set 'ip ospf message-digest-key md5'", "sev": "MEDIUM", "d": "Recommendation 3.3.2.2 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.2.2"}, {"id": 185, "n": "Set 'neighbor password'", "sev": "MEDIUM", "d": "Recommendation 3.3.3.1 of the CIS Cisco IOS XE 16.x Benchmark v2.1.0.", "tags": ["Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "OS Version:16.x", "Technology:Cisco Router"], "type": "Default", "cis": "3.3.3.1"}];
const STC_BENCH0 = [{"id": 1, "n": "CIS Debian Linux 11 Benchmark v2.0.0-Level 1 - Server", "d": "", "used": 1, "tags": ["compliance"], "tree": [{"g": "Filesystem configuration", "kids": [{"r": 1}]}, {"g": "Initial setup", "kids": [{"r": 9}, {"r": 10}]}]}, {"id": 2, "n": "NOC_CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 0, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}, {"id": 3, "n": "test 1", "d": "", "used": 1, "tags": [], "tree": [{"g": "General", "kids": [{"r": 2}, {"r": 3}, {"r": 7}]}]}, {"id": 4, "n": "HIPAA Test", "d": "", "used": 0, "tags": [], "tree": [{"g": "HIPAA controls", "kids": [{"r": 2}, {"r": 3}, {"r": 5}, {"r": 6}, {"r": 7}, {"r": 8}, {"r": 9}]}]}, {"id": 5, "n": "Copy of BFSI_Baseline", "d": "Top 10 rules which are essential for BFSI", "used": 1, "tags": [], "tree": [{"g": "BFSI essentials", "kids": [{"r": 101}, {"r": 102}, {"r": 126}, {"r": 127}, {"r": 112}, {"r": 131}, {"r": 130}, {"r": 151}, {"r": 143}, {"r": 144}]}]}, {"id": 6, "n": "BFSI_benchmark_2", "d": "", "used": 1, "tags": [], "tree": [{"g": "Access", "kids": [{"r": 101}, {"r": 102}, {"r": 126}, {"r": 127}, {"r": 112}]}, {"g": "Logging", "kids": [{"r": 151}]}]}, {"id": 7, "n": "BFSI_benchmark", "d": "", "used": 2, "tags": [], "tree": [{"g": "Access", "kids": [{"r": 101}, {"r": 102}, {"r": 126}, {"r": 127}, {"r": 112}]}, {"g": "SNMP", "kids": [{"r": 131}, {"r": 130}]}]}, {"id": 8, "n": "pmg test 1", "d": "this is for test", "used": 0, "tags": ["test", "cis", "ncm", "cisco", "compliance", "logging"], "tree": [{"g": "Test group", "kids": [{"r": 3}, {"r": 5}, {"r": 6}]}]}, {"id": 9, "n": "CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0 - rem", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 1, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}, {"id": 10, "n": "CIS_Cisco_IOS_XE_17.x_Benchmark_v2.1.0", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 0, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}, {"id": 11, "n": "BFSI_Baseline", "d": "Top 10 rules which are essential for BFSI", "used": 1, "tags": [], "tree": [{"g": "BFSI essentials", "kids": [{"r": 101}, {"r": 102}, {"r": 126}, {"r": 127}, {"r": 112}, {"r": 131}, {"r": 130}, {"r": 151}, {"r": 143}, {"r": 144}]}]}, {"id": 12, "n": "Fortigate 7.4", "d": "", "used": 0, "tags": [], "tree": [{"g": "Fortigate", "kids": []}]}, {"id": 13, "n": "test hipaa benchmark", "d": "", "used": 0, "tags": [], "tree": [{"g": "HIPAA", "kids": [{"r": 2}, {"r": 3}, {"r": 5}, {"r": 6}]}]}, {"id": 14, "n": "CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 1, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}], "sys": true}, {"id": 15, "n": "Copy of CIS_Cisco_IOS_XE_16.x_Benchmark_v2.1.0", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 0, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}, {"id": 16, "n": "CIS_Cisco_IOS_XE_16.x_Benchmark_v2.2.0", "d": "Please see the below link for CIS's current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 1, "tags": ["framework:cis", "benchmark version:2.1.0", "vendor:cisco systems"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}, {"id": 17, "n": "CIS Cisco IOS XE 16.x Benchmark ---- test", "d": "Please see the below link for our current terms of use: https://www.cisecurity.org/cis-securesuite/cis-securesuite-membership-terms-of-use/", "used": 2, "tags": ["cis", "ncm", "cisco", "framework:cis", "compliance"], "tree": [{"g": "Management Plane", "kids": [{"g": "Local Authentication, Authorization and Accounting (AAA) Rules", "kids": [{"r": 101}, {"r": 102}, {"r": 103}, {"r": 104}, {"r": 105}, {"r": 106}, {"r": 107}, {"r": 108}, {"r": 109}, {"r": 110}]}, {"g": "Access Rules", "kids": [{"r": 111}, {"r": 112}, {"r": 113}, {"r": 114}, {"r": 115}, {"r": 116}, {"r": 117}, {"r": 118}, {"r": 119}, {"r": 120}, {"r": 121}]}, {"g": "Banner Rules", "kids": [{"r": 122}, {"r": 123}, {"r": 124}, {"r": 125}]}, {"g": "Password Rules", "kids": [{"r": 126}, {"r": 127}, {"r": 128}]}, {"g": "SNMP Rules", "kids": [{"r": 129}, {"r": 130}, {"r": 131}, {"r": 132}, {"r": 133}, {"r": 134}, {"r": 135}, {"r": 136}, {"r": 137}, {"r": 138}]}]}, {"g": "Control Plane", "kids": [{"g": "Global Service Rules", "kids": [{"g": "Setup SSH", "kids": [{"g": "Configure Prerequisites for the SSH Service", "kids": [{"r": 139}, {"r": 140}, {"r": 141}, {"r": 142}]}, {"r": 143}]}, {"r": 144}, {"r": 145}, {"r": 146}, {"r": 147}, {"r": 148}, {"r": 149}, {"r": 150}]}, {"g": "Logging Rules", "kids": [{"r": 151}, {"r": 152}, {"r": 153}, {"r": 154}, {"r": 155}, {"r": 156}, {"r": 157}, {"r": 158}]}, {"g": "NTP Rules", "kids": [{"g": "Require Encryption Keys for NTP", "kids": [{"r": 159}, {"r": 160}, {"r": 161}, {"r": 162}]}, {"r": 163}]}, {"g": "Loopback Rules", "kids": [{"r": 164}, {"r": 165}, {"r": 166}, {"r": 167}]}]}, {"g": "Data Plane", "kids": [{"g": "Routing Rules", "kids": [{"r": 168}, {"r": 169}, {"r": 170}, {"r": 171}]}, {"g": "Border Router Filtering", "kids": [{"r": 172}, {"r": 173}]}, {"g": "Neighbor Authentication", "kids": [{"g": "Require EIGRP Authentication if Protocol is Used", "kids": [{"r": 174}, {"r": 175}, {"r": 176}, {"r": 177}, {"r": 178}, {"r": 179}, {"r": 180}, {"r": 181}, {"r": 182}]}, {"g": "Require OSPF Authentication if Protocol is Used", "kids": [{"r": 183}, {"r": 184}]}, {"g": "Require BGP Authentication if Protocol is Used", "kids": [{"r": 185}]}]}]}]}];
const STC_POL0 = [{"id": 1, "n": "aaabcd", "d": "", "created": "Tue, Mar 03, 2026 01:00:07 PM", "used": 2, "tags": [], "sched": false, "bm": 3, "cfg": "startup", "devFilter": "Monitor", "devs": [1, 2], "notify": []}, {"id": 2, "n": "BFSI_Test", "d": "", "created": "Fri, May 01, 2026 12:09:27 PM", "used": 0, "tags": [], "sched": false, "bm": 11, "cfg": "startup", "devFilter": "Monitor", "devs": [], "notify": []}, {"id": 3, "n": "BFSI_TEST_2", "d": "", "created": "Fri, May 01, 2026 08:00:09 PM", "used": 0, "tags": [], "sched": false, "bm": 5, "cfg": "startup", "devFilter": "Monitor", "devs": [], "notify": []}, {"id": 4, "n": "CIS - PMG", "d": "", "created": "Wed, Feb 19, 2025 04:18:05 PM", "used": 3, "tags": [], "sched": true, "bm": 14, "cfg": "running", "devFilter": "Monitor", "devs": [1, 2, 6], "notify": []}, {"id": 5, "n": "CIS - PMG - rem", "d": "", "created": "Tue, Mar 17, 2026 06:47:53 PM", "used": 1, "tags": [], "sched": false, "bm": 9, "cfg": "running", "devFilter": "Monitor", "devs": [8], "notify": []}, {"id": 6, "n": "CIS Compliance Policy --- test", "d": "test pmg", "created": "Fri, Jan 10, 2025 07:08:36 PM", "used": 3, "tags": ["cis", "ncm", "cisco", "compliance"], "sched": true, "bm": 17, "cfg": "startup", "devFilter": "Monitor", "devs": [8, 9, 10], "notify": []}, {"id": 7, "n": "CIS_Assessment_Certificate_Cisco_ XE 16.x B v.2.2.0", "d": "", "created": "Fri, Oct 24, 2025 12:53:10 PM", "used": 1, "tags": [], "sched": false, "bm": 16, "cfg": "startup", "devFilter": "Monitor", "devs": [10], "notify": []}, {"id": 8, "n": "Clone of CIS Compliance Policy --- test", "d": "test pmg", "created": "Wed, Dec 31, 2025 03:39:00 PM", "used": 3, "tags": ["cis", "ncm", "cisco", "compliance"], "sched": false, "bm": 17, "cfg": "startup", "devFilter": "Monitor", "devs": [8, 9, 10], "notify": []}, {"id": 9, "n": "Branch_G1", "d": "", "created": "Fri, May 01, 2026 11:54:11 AM", "used": 0, "tags": [], "sched": false, "bm": 7, "cfg": "startup", "devFilter": "Monitor", "devs": [], "notify": []}, {"id": 10, "n": "Branch_policy", "d": "", "created": "Fri, May 01, 2026 06:32:31 AM", "used": 0, "tags": ["compliance"], "sched": false, "bm": 7, "cfg": "startup", "devFilter": "Monitor", "devs": [], "notify": []}, {"id": 11, "n": "Branch_policy_2", "d": "", "created": "Fri, May 01, 2026 06:33:09 AM", "used": 0, "tags": [], "sched": false, "bm": 6, "cfg": "startup", "devFilter": "Monitor", "devs": [], "notify": []}, {"id": 12, "n": "test policy", "d": "", "created": "Tue, Jan 20, 2026 02:39:44 PM", "used": 1, "tags": [], "sched": false, "bm": 1, "cfg": "running", "devFilter": "Monitor", "devs": [7], "notify": []}];
const STC_DEVICES = [{"id": 1, "n": "core-rtr-01", "ip": "192.0.2.10", "type": "Router", "groups": ["Network", "Network > Router", "Core"], "vendor": "Cisco Systems", "tags": ["site:hq", "env:prod"], "sev": "UP"}, {"id": 2, "n": "edge-rtr-02", "ip": "192.0.2.11", "type": "Router", "groups": ["Network", "Network > Router", "Edge"], "vendor": "Cisco Systems", "tags": ["site:hq", "env:prod"], "sev": "UP"}, {"id": 3, "n": "dist-sw-01", "ip": "198.51.100.5", "type": "Switch", "groups": ["Network", "Network > Switch"], "vendor": "Juniper Networks", "tags": ["site:dc1"], "sev": "UP"}, {"id": 4, "n": "access-sw-07", "ip": "198.51.100.21", "type": "Switch", "groups": ["Network", "Network > Switch", "Floor 7"], "vendor": "Hewlett Packard Enterprise", "tags": ["site:dc1", "env:prod", "rack:7b"], "sev": "DOWN"}, {"id": 5, "n": "fw-branch-01", "ip": "203.0.113.2", "type": "Firewall", "groups": ["Network", "South Region"], "vendor": "Fortinet", "tags": ["site:branch"], "sev": "UP"}, {"id": 6, "n": "wan-rtr-03", "ip": "203.0.113.9", "type": "Router", "groups": ["Network", "Network > Router", "South Region"], "vendor": "Cisco Systems", "tags": ["site:branch", "env:prod"], "sev": "UNREACHABLE"}, {"id": 7, "n": "huawei-sw-01", "ip": "198.51.100.40", "type": "Switch", "groups": ["South Region", "Network > Switch", "Lab"], "vendor": "Huawei", "tags": ["site:lab", "env:test", "owner:netops"], "sev": "UP"}, {"id": 8, "n": "ospf-rtr-01", "ip": "192.0.2.8", "type": "Router", "groups": ["Network", "Network > Router", "Lab"], "vendor": "Cisco Systems", "tags": ["site:lab", "env:test", "proto:ospf", "owner:netops"], "sev": "UP"}, {"id": 9, "n": "bgp-rtr-01", "ip": "192.0.2.23", "type": "Router", "groups": ["Network", "Network > Router", "Lab"], "vendor": "Cisco Systems", "tags": ["site:lab", "proto:bgp"], "sev": "UP"}, {"id": 10, "n": "lab-rtr-xe", "ip": "192.0.2.44", "type": "Router", "groups": ["Network", "Network > Router", "Lab"], "vendor": "Cisco Systems", "tags": ["site:lab", "env:test"], "sev": "UP"}];
const STC_GROUPS = ["Network", "Network > Router", "Network > Switch", "Core", "Edge", "South Region", "Floor 7", "Lab", "Default"];
const STC_TAGS = ["cisco", "transmission security", "cis", "benchmark version:2.1.0", "nat", "audit control", "ncm", "hipaa", "network protection", "Profile Applicability:Level 2", "Profile Applicability:Level 1", "Vendor:Cisco Systems", "OS:IOS-XE", "authentication", "uniqueuserid", "access control", "test", "framework:cis", "ios:v16.x", "os version:16.x", "Technology:Cisco Router", "logging", "vendor:cisco systems", "compliance"];
const STC_RUNBOOKS = ["interface description change", "Remediation runbook for - 1.3.1 Set the 'banner-text' for 'banner exec'", "show version", "Cisco Syslog", "Cisco Flow Enable", "bulk network config runbook"];

var ST_PAGES = (typeof ST_PAGES !== 'undefined' && ST_PAGES) || {};

const STC = {
  pol: JSON.parse(JSON.stringify(STC_POL0)), bm: JSON.parse(JSON.stringify(STC_BENCH0)), rules: JSON.parse(JSON.stringify(STC_RULES0)),
  pg: { pol:{ q:'', sort:1, filt:{bm:null, bmOp:'=', tag:null, tagOp:'='}, chips:true, page:1, size:50, cols:{desc:1,created:1,used:1,tag:1,sched:1,bm:1} },
        bm:{ q:'', filt:{tag:null, tagOp:'='}, chips:true, page:1, size:50 },
        ru:{ q:'', page:1, size:50 } },
  run:{}, pf:null, bf:null, rf:null, sf:null, af:null
};
const stcEsc = s => stEsc(s), stcA = v => stA(v);
const stcSvg = (n, cls) => `<svg${cls?` class="${cls}"`:''} viewBox="0 0 48 48"><path fill="currentColor" d="${STC_ICO[n]||''}"/></svg>`;
const stcNewId = arr => arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;
function stcNow(){
  const d = new Date(), D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const p = n => String(n).padStart(2,'0'); let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${D[d.getDay()]}, ${M[d.getMonth()]} ${p(d.getDate())}, ${d.getFullYear()} ${p(h)}:${p(d.getMinutes())}:${p(d.getSeconds())} ${ap}`;
}
/* tag pills: the first, then “+N” carrying the rest in its tooltip — the live grid shape */
function stcTags(arr){
  if (!arr || !arr.length) return '';
  const rest = arr.slice(1);
  return `<span class="stctag" title="${stcEsc(arr[0])}">${stcEsc(arr[0])}</span>` +
         (rest.length ? `<span class="stctag more" title="${stcEsc(rest.join(', '))}">+${rest.length}</span>` : '');
}
const stcUsed = n => `<span class="stcused">${n}</span>`;
const stcSevBar = s => `<span class="stcsev ${s}"></span>`;
const stcBmName = id => (STC.bm.find(b => b.id === id) || {}).n || '';
const stcRule = id => STC.rules.find(r => r.id === id);

/* ── popover menus / pickers ──────────────────────────────────────────────────── */
let stcPopEl = null, stcPopAnchor = null;
function stcPopClose(){ if (stcPopEl){ stcPopEl.remove(); stcPopEl = null; stcPopAnchor = null; } }
function stcPop(anchor, html, o){
  o = o || {};
  if (stcPopEl && stcPopAnchor === anchor && !o.keep){ stcPopClose(); return null; }
  stcPopClose();
  const el = document.createElement('div'); el.className = 'stcmenu' + (o.cls ? ' ' + o.cls : ''); el.innerHTML = html;
  document.body.appendChild(el); stcPopEl = el; stcPopAnchor = anchor;
  const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  let left = o.right ? r.right - w : r.left, top = r.bottom + 4;
  if (o.matchWidth) el.style.minWidth = r.width + 'px';
  if (left + w > innerWidth - 8) left = innerWidth - w - 8; if (left < 8) left = 8;
  if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 4);
  el.style.left = left + 'px'; el.style.top = top + 'px';
  const inp = el.querySelector('input'); if (inp && o.focus !== false) setTimeout(() => inp.focus(), 0);
  return el;
}
document.addEventListener('mousedown', e => {
  if (stcPopEl && !stcPopEl.contains(e.target) && !(stcPopAnchor && stcPopAnchor.contains(e.target))) stcPopClose();
}, true);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (stcPopEl){ stcPopClose(); e.stopPropagation(); return; }
  if (document.getElementById('stcCf') && document.getElementById('stcCf').classList.contains('on')){ stcCfClose(); e.stopPropagation(); return; }
  if (document.getElementById('stcDr') && document.getElementById('stcDr').classList.contains('on')){ stcDrClose(); e.stopPropagation(); }
}, true);
/* a simple action menu: items [{t, ic, fn, del}] */
function stcMenu(anchor, items, o){
  const html = items.map((it, i) => it === '-' ? '<div class="stcmi sep"></div>' :
    `<div class="stcmi${it.del?' del':''}${it.on?' on':''}" data-i="${i}">${it.ic ? stcSvg(it.ic) : ''}<span>${stcEsc(it.t)}</span></div>`).join('');
  const el = stcPop(anchor, html, o); if (!el) return;
  el.querySelectorAll('.stcmi[data-i]').forEach(m => m.onclick = () => { const it = items[+m.dataset.i]; stcPopClose(); it.fn && it.fn(); });
}
/* a list picker: {items:[{k,t,sub}], cur (k or [k]), multi, search, onPick(k|[k]), title, ops:{cur,onOp}} */
function stcPick(anchor, o){
  const st = { q:'', sel: o.multi ? [...(o.cur||[])] : o.cur };
  const paint = () => {
    const q = st.q.toLowerCase();
    const items = o.items.filter(it => !q || it.t.toLowerCase().includes(q));
    const ops = o.ops ? `<div class="stcmo">${['=','!='].map(x => `<b class="${o.ops.cur===x?'on':''}" data-op="${x}">${x}</b>`).join('')}</div>` : '';
    const search = o.search === false ? '' : `<div class="stcms">${stcSvg('search')}<input placeholder="Search" value="${stcEsc(st.q)}"></div>`;
    const list = items.length ? items.map(it => {
      const on = o.multi ? st.sel.includes(it.k) : st.sel === it.k;
      return `<div class="stcmi${o.multi?' ck':''}${on?' on':''}" data-k="${stcEsc(String(it.k))}">${o.multi ? `<span class="bx">${stcSvg('check')}</span>` : ''}<span style="overflow:hidden;text-overflow:ellipsis">${stcEsc(it.t)}</span>${it.sub?`<span style="margin-left:auto;color:var(--text-dim);font-size:11px">${stcEsc(it.sub)}</span>`:''}</div>`;
    }).join('') : `<div class="stcmi hd">No match</div>`;
    const foot = o.multi ? `<div class="stcmf"><button class="stbtn" style="height:28px;padding:0 10px" data-act="clear">Clear</button><button class="stbtn pri" style="height:28px;padding:0 12px" data-act="apply">Apply</button></div>` : (o.clear ? `<div class="stcmf"><button class="stbtn" style="height:28px;padding:0 10px" data-act="clear">Clear</button></div>` : '');
    el.innerHTML = (o.title ? `<div class="stcmi hd">${stcEsc(o.title)}</div>` : '') + ops + search + `<div class="stcml">${list}</div>` + foot;
    el.querySelectorAll('.stcmi[data-k]').forEach(m => m.onclick = () => {
      const k = o.items.find(it => String(it.k) === m.dataset.k).k;
      if (o.multi){ const i = st.sel.indexOf(k); if (i >= 0) st.sel.splice(i, 1); else st.sel.push(k); const box = m; box.classList.toggle('on'); }
      else { stcPopClose(); o.onPick(k); }
    });
    const inp = el.querySelector('.stcms input'); if (inp){ inp.oninput = () => { st.q = inp.value; const pos = inp.selectionStart; paint(); const i2 = el.querySelector('.stcms input'); i2.focus(); i2.setSelectionRange(pos, pos); }; }
    el.querySelectorAll('.stcmo b').forEach(b => b.onclick = () => { o.ops.cur = b.dataset.op; o.ops.onOp && o.ops.onOp(b.dataset.op); paint(); });
    const ap = el.querySelector('[data-act="apply"]'); if (ap) ap.onclick = () => { stcPopClose(); o.onPick(st.sel); };
    const cl = el.querySelector('[data-act="clear"]'); if (cl) cl.onclick = () => { stcPopClose(); o.onPick(o.multi ? [] : null); };
  };
  const el = stcPop(anchor, '', {right:o.right, matchWidth:o.matchWidth, cls:o.cls, keep:o.keep}); if (!el) return;
  el.style.minWidth = Math.max(parseInt(el.style.minWidth)||0, o.width || 230) + 'px';
  paint();
  /* re-place now that it has a size */
  const r = anchor.getBoundingClientRect(); let left = o.right ? r.right - el.offsetWidth : r.left; if (left + el.offsetWidth > innerWidth - 8) left = innerWidth - el.offsetWidth - 8; el.style.left = Math.max(8, left) + 'px';
  if (r.bottom + 4 + el.offsetHeight > innerHeight - 8) el.style.top = Math.max(8, r.top - el.offsetHeight - 4) + 'px';
}

/* ── drawer + confirm ─────────────────────────────────────────────────────────── */
function stcDrEls(){
  let d = document.getElementById('stcDr');
  if (!d){
    const s = document.createElement('div'); s.className = 'stcscrim'; s.id = 'stcScrim'; s.onclick = () => { if (!stcPopEl) stcDrClose(); }; document.body.appendChild(s);
    d = document.createElement('div'); d.className = 'stcdr'; d.id = 'stcDr';
    d.innerHTML = `<div class="stcdrh"><span id="stcDrT"></span><button class="x" data-tip="Close" onclick="stcDrClose()">${stcSvg('times')}</button></div><div class="stcdrb" id="stcDrB"></div><div class="stcdrf" id="stcDrF"></div>`;
    document.body.appendChild(d);
    const c = document.createElement('div'); c.className = 'stccf'; c.id = 'stcCf'; c.innerHTML = `<div class="stccfb" onclick="event.stopPropagation()"><h5 id="stcCfT"></h5><p id="stcCfP"></p><div class="bt"><button class="stbtn" onclick="stcCfClose()">Cancel</button><button class="stbtn danger" id="stcCfOk">Delete</button></div></div>`;
    c.onclick = stcCfClose; document.body.appendChild(c);
  }
  return d;
}
function stcDrOpen(title, body, foot){
  const d = stcDrEls();
  document.getElementById('stcDrT').textContent = title;
  document.getElementById('stcDrB').innerHTML = body;
  const f = document.getElementById('stcDrF'); f.innerHTML = foot || ''; f.style.display = foot ? '' : 'none';
  document.getElementById('stcScrim').classList.add('on'); d.classList.add('on');
  requestAnimationFrame(() => d.classList.add('in'));
  const first = d.querySelector('input:not([disabled]):not([readonly])'); if (first) setTimeout(() => first.focus(), 60);
}
function stcDrClose(){ stcPopClose(); const d = document.getElementById('stcDr'); if (!d) return; d.classList.remove('in','on'); document.getElementById('stcScrim').classList.remove('on'); STC.pf = STC.sf = STC.af = null; }
let stcCfFn = null;
function stcConfirm(title, text, okLabel, fn){ stcDrEls(); document.getElementById('stcCfT').textContent = title; document.getElementById('stcCfP').innerHTML = text; const ok = document.getElementById('stcCfOk'); ok.textContent = okLabel || 'Delete'; stcCfFn = fn; ok.onclick = () => { stcCfClose(); fn && fn(); }; document.getElementById('stcCf').classList.add('on'); setTimeout(() => ok.focus(), 0); }
function stcCfClose(){ const c = document.getElementById('stcCf'); if (c) c.classList.remove('on'); }

/* ── shared list chrome: search, squared buttons, chips, pager ────────────────── */
function stcSearchHTML(key, ph){ const P = STC.pg[key]; return `<div class="stcsearch${P.q?' has':''}">${stcSvg('search')}<input placeholder="${ph||'Search'}" value="${stcEsc(P.q)}" oninput="stcQ('${key}',this.value)"><span class="clr" data-tip="Clear" onclick="stcQClear('${key}')">${stcSvg('times-circle')}</span></div>`; }
function stcQ(key, v){ STC.pg[key].q = v; STC.pg[key].page = 1; stcRepaint(key, true); }
function stcQClear(key){ STC.pg[key].q = ''; stcRepaint(key); }
function stcRepaint(key, keepFocus){
  stMainPaint();
  if (keepFocus){ const i = document.querySelector('#stMain .stcsearch input'); if (i){ const v = i.value; i.focus(); i.setSelectionRange(v.length, v.length); } }
}
function stcPagerHTML(key, total){
  const P = STC.pg[key], pages = Math.max(1, Math.ceil(total / P.size)); if (P.page > pages) P.page = pages;
  const a = total ? (P.page - 1) * P.size + 1 : 0, b = Math.min(total, P.page * P.size);
  const nums = []; for (let i = 1; i <= pages; i++) nums.push(`<button class="stcpg${i===P.page?' on':''}" onclick="stcPage('${key}',${i})">${i}</button>`);
  return `<div class="stcpager">
    <button class="stcpg" data-tip="Go to the first page" ${P.page===1?'disabled':''} onclick="stcPage('${key}',1)"><svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM18 6l-7 6 7 6z"/></svg></button>
    <button class="stcpg" data-tip="Go to the previous page" ${P.page===1?'disabled':''} onclick="stcPage('${key}',${P.page-1})"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6z"/></svg></button>
    ${nums.join('')}
    <button class="stcpg" data-tip="Go to the next page" ${P.page===pages?'disabled':''} onclick="stcPage('${key}',${P.page+1})"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6z"/></svg></button>
    <button class="stcpg" data-tip="Go to the last page" ${P.page===pages?'disabled':''} onclick="stcPage('${key}',${pages})"><svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM6 6l7 6-7 6z"/></svg></button>
    <span class="stcsize" onclick="stcSizeMenu(event,'${key}')">${P.size}${stcSvg('chevron-down')}</span><span>items per page</span>
    <span class="stcpinfo">${a} - ${b} of ${total} items</span></div>`;
}
function stcPage(key, p){ STC.pg[key].page = p; stMainPaint(); }
function stcSizeMenu(ev, key){ stcMenu(ev.currentTarget, [10,20,50,100].map(n => ({t:String(n), on: STC.pg[key].size===n, fn:() => { STC.pg[key].size = n; STC.pg[key].page = 1; stMainPaint(); }}))); }
const stcTh = (t, o) => `<th class="${o.cls||''}${o.sort?' s':''}"${o.w?` style="width:${o.w}"`:''}${o.onclick?` onclick="${o.onclick}"`:''}>${t}${o.sort ? `<span class="sa">${o.sort===1?'↑':'↓'}</span>` : ''}</th>`;
/* ⚠️ EXPORT REALLY EXPORTS (request, 27 Aug 2026). It toasted "this prototype does not
   write files", which was true and is no longer.
   ⚠️ CSV writes a file; PDF hands off to the browser's own print-to-PDF, because a real PDF
   needs a renderer and pulling one in would be the first external dependency in a folder
   whose whole premise is self-contained pages. The toast says which of the two happened.
   ⚠️ It exports THE FILTERED, SORTED ROWS — `stcPolRows()` / `stcBmRows()` are the same
   functions the grid paints from, so the file and the screen cannot disagree. */
function stcExportRows(what){
  if (what === 'Benchmark'){
    return { head:['Benchmark','Description','Used count','Tags'],
             body: stcBmRows().map(b => [b.n, b.d || '', b.used, (b.tags||[]).join('; ')]) };
  }
  return { head:['Policy name','Description','Created time','Used count','Tags','Scheduled','Benchmark'],
           body: stcPolRows().map(r => [r.n, r.d || '', r.created, r.used,
                                        (r.tags||[]).join('; '), r.sched ? 'Yes' : 'No', stcBmName(r.bm)]) };
}
function stcExport(kind, what){
  const { head, body } = stcExportRows(what);
  if (kind === 'PDF'){
    /* the browser's print dialog is a real PDF writer and the only one available to a
       single self-contained file — saying so is better than shipping a fake */
    toast(`Printing the ${what} list — choose “Save as PDF” in the print dialog`);
    setTimeout(() => window.print(), 260);
    return;
  }
  /* ⚠️ THE CSV BRANCH NEEDS THREE LOG-EXPLORER HELPERS THIS FILE DOES NOT OWN — `lxCsvCell`,
     `lxFileStamp` and `lxDownload`. Options 1 and 4 carry them; Options 2 and 3 never gained a
     file-writing path at all (their own `lxCsv()` is a toast too), so calling them there would
     throw where the page used to say plainly that it does not write files. Same guard, same
     wording, as `licHistCsv` below — the three always ship together, so testing one is enough. */
  if (typeof lxDownload !== 'function') return toast(`Export as ${kind} — the live button downloads the ${what.toLowerCase()} grid; this page does not write files`);
  const csv = [head].concat(body)
    .map(r => r.map(lxCsvCell).join(',')).join('\r\n');
  const name = what.toLowerCase().replace(/[^a-z0-9]+/g,'-') + '-' + lxFileStamp() + '.csv';
  if (!lxDownload(name, csv, 'text/csv')){
    toast('The browser blocked the download — open this page over http rather than file://');
    return;
  }
  toast(`Exported ${body.length} ${what.toLowerCase()} rows to ${name}`);
}

/* ═══ Compliance Policy ═══════════════════════════════════════════════════════ */
function stcPolRows(){
  const P = STC.pg.pol, q = P.q.trim().toLowerCase(), F = P.filt;
  let rows = STC.pol.filter(r => !q || r.n.toLowerCase().includes(q) || (r.d||'').toLowerCase().includes(q));
  if (F.bm != null) rows = rows.filter(r => F.bmOp === '=' ? r.bm === F.bm : r.bm !== F.bm);
  if (F.tag != null) rows = rows.filter(r => F.tagOp === '=' ? r.tags.includes(F.tag) : !r.tags.includes(F.tag));
  rows.sort((a, b) => a.n.localeCompare(b.n, undefined, {sensitivity:'base'}) * P.sort);
  return rows;
}
function stcPolHTML(){
  const P = STC.pg.pol, C = P.cols, rows = stcPolRows(), total = rows.length;
  const page = rows.slice((P.page - 1) * P.size, P.page * P.size);
  const chip = (lab, key, opKey, val, txt) => `<span class="stcchip" onclick="stcPolChip(event,'${key}')"><span class="f">${lab}</span>${val != null ? `<span class="op">${STC.pg.pol.filt[opKey]}</span><span class="v" title="${stcEsc(txt)}">${stcEsc(txt)}</span><svg class="x" viewBox="0 0 48 48" onclick="event.stopPropagation();stcPolFilt('${key}',null)"><path fill="currentColor" d="${STC_ICO.times}"/></svg>` : ''}</span>`;
  const tr = page.map(r => {
    const running = !!STC.run['p'+r.id];
    return `<tr>
      <td class="nm"><span class="lk" onclick="stcPolView(${r.id})">${stcEsc(r.n)}</span></td>
      ${C.desc ? `<td class="dim" title="${stcEsc(r.d)}">${stcEsc(r.d)}</td>` : ''}
      ${C.created ? `<td>${stcEsc(r.created)}</td>` : ''}
      ${C.used ? `<td class="c">${stcUsed(r.used)}</td>` : ''}
      ${C.tag ? `<td>${stcTags(r.tags)}</td>` : ''}
      ${C.sched ? `<td class="c">${r.sched ? `<button class="stcib" data-tip="Scheduled — open the schedule" onclick="stcSchedule(${r.id})">${stcSvg('schedule')}</button>` : ''}</td>` : ''}
      ${C.bm ? `<td>${stcTags([stcBmName(r.bm)])}</td>` : ''}
      <td><div class="stcact">${r.used > 0 ? `<button class="stcib stcrun${running?' spin':''}" data-tip="${running?'Running…':'Run now'}" onclick="stcRun(${r.id})">${stcSvg(running?'restart':'restart')}</button>` : ''}<button class="stcib" data-tip="Actions" onclick="stcPolMenu(event,${r.id})">${stcSvg('ellipsis-v')}</button></div></td>
    </tr>`;
  }).join('');
  return `<div class="stcbar">${stcSearchHTML('pol')}<span class="stcsp"></span>
      <button class="stcsq" data-tip="Show / hide columns" onclick="stcPolCols(event)">${stcSvg('eye')}</button>
      <button class="stcsq" data-tip="Export As PDF" onclick="stcExport('PDF','Compliance Policy')">${stcSvg('export-pdf')}</button>
      <button class="stcsq" data-tip="Export As CSV" onclick="stcExport('CSV','Compliance Policy')">${stcSvg('export-csv')}</button>
      <button class="stcsq${P.chips?' on':''}" data-tip="${P.chips?'Hide filters':'Show filters'}" onclick="STC.pg.pol.chips=!STC.pg.pol.chips;stMainPaint()">${stcSvg('filter')}</button>
      <button class="stbtn pri" onclick="stcPolForm('create')">Create Compliance Policy</button></div>
    <div class="stcchips${P.chips?'':' hid'}">
      ${chip('Benchmark','bm','bmOp',P.filt.bm,stcBmName(P.filt.bm))}
      ${chip('Tags','tag','tagOp',P.filt.tag,P.filt.tag||'')}
      <button class="stcaddf" onclick="stcPolAddFilter(event)">${stcSvg('plus')}<span>Filter</span></button></div>
    <div class="stcgridw"><div class="stcscroll"><table class="stcgrid">
      <colgroup><col style="width:26%">${C.desc?'<col style="width:13%">':''}${C.created?'<col style="width:15%">':''}${C.used?'<col style="width:110px">':''}${C.tag?'<col style="width:13%">':''}${C.sched?'<col style="width:96px">':''}${C.bm?'<col>':''}<col style="width:120px"></colgroup>
      <thead><tr>${stcTh('Policy Name',{sort:P.sort,onclick:'stcPolSort()'})}${C.desc?stcTh('Description',{}):''}${C.created?stcTh('Created Time',{}):''}${C.used?stcTh('Used Count',{cls:'c'}):''}${C.tag?stcTh('Tag',{}):''}${C.sched?stcTh('Schedule',{cls:'c'}):''}${C.bm?stcTh('Benchmark',{}):''}${stcTh('Actions',{cls:'r'})}</tr></thead>
      <tbody>${tr || `<tr><td colspan="9"><div class="stcempty">No compliance policies match.</div></td></tr>`}</tbody></table></div>
    ${stcPagerHTML('pol', total)}</div>`;
}
function stcPolSort(){ STC.pg.pol.sort *= -1; stMainPaint(); }
function stcPolFilt(key, val){ STC.pg.pol.filt[key] = val; STC.pg.pol.page = 1; stMainPaint(); }
function stcPolChip(ev, key){
  const F = STC.pg.pol.filt;
  if (key === 'bm') stcPick(ev.currentTarget, {title:'Benchmark', items: STC.bm.map(b => ({k:b.id, t:b.n})), cur:F.bm, clear:true, ops:{cur:F.bmOp, onOp:op => { F.bmOp = op; if (F.bm != null) stMainPaint(); }}, onPick:k => stcPolFilt('bm', k), width:320});
  else stcPick(ev.currentTarget, {title:'Tags', items: STC_TAGS.map(t => ({k:t, t})), cur:F.tag, clear:true, ops:{cur:F.tagOp, onOp:op => { F.tagOp = op; if (F.tag != null) stMainPaint(); }}, onPick:k => stcPolFilt('tag', k), width:260});
}
function stcPolAddFilter(ev){ stcMenu(ev.currentTarget, [{t:'Benchmark', fn:() => { STC.pg.pol.chips = true; stMainPaint(); setTimeout(() => { const c = document.querySelectorAll('#stMain .stcchip')[0]; c && c.click(); }, 30); }}, {t:'Tags', fn:() => { STC.pg.pol.chips = true; stMainPaint(); setTimeout(() => { const c = document.querySelectorAll('#stMain .stcchip')[1]; c && c.click(); }, 30); }}]); }
function stcPolCols(ev){
  const C = STC.pg.pol.cols, defs = [['desc','DESCRIPTION'],['created','CREATED TIME'],['used','Used Count'],['tag','Tag'],['sched','Schedule'],['bm','Benchmark']];
  const html = `<div class="stcmi on ck" style="opacity:.6;cursor:default"><span class="bx">${stcSvg('check')}</span>Policy Name</div>` +
    defs.map(([k, t]) => `<div class="stcmi ck${C[k]?' on':''}" data-c="${k}"><span class="bx">${stcSvg('check')}</span>${t}</div>`).join('') +
    `<div class="stcmi sep"></div><div class="stcmi" data-c="reset">Reset Column Preference</div>`;
  const el = stcPop(ev.currentTarget, html, {right:true}); if (!el) return;
  el.querySelectorAll('[data-c]').forEach(m => m.onclick = () => { const k = m.dataset.c; if (k === 'reset') Object.keys(C).forEach(x => C[x] = 1); else C[k] = C[k] ? 0 : 1; stMainPaint(); stcPopClose(); });
}
function stcPolMenu(ev, id){
  const r = STC.pol.find(p => p.id === id);
  stcMenu(ev.currentTarget, [
    {t:'Edit', ic:'pencil', fn:() => stcPolForm('edit', id)},
    {t:'Clone', ic:'clone', fn:() => stcPolForm('clone', id)},
    {t:'Schedule', ic:'schedule', fn:() => stcSchedule(id)},
    {t:'Assign Monitor', ic:'file-check', fn:() => stcAssign(id, 'assign')},
    {t:'Remove Assigned Monitor', ic:'file-times', fn:() => stcAssign(id, 'unassign')},
    {t:'Delete', ic:'trash-alt', del:true, fn:() => stcConfirm('Delete Compliance Policy', `Are you sure you want to delete <b>${stcEsc(r.n)}</b>? Its ${r.used} assigned monitor${r.used===1?'':'s'} and schedule go with it. This cannot be undone.`, 'Delete', () => { STC.pol = STC.pol.filter(p => p.id !== id); stMainPaint(); toast(`Compliance Policy “${r.n}” deleted`); })},
  ], {right:true});
}
function stcRun(id){
  const r = STC.pol.find(p => p.id === id); if (!r || STC.run['p'+id]) return;
  STC.run['p'+id] = true; stMainPaint();
  setTimeout(() => { delete STC.run['p'+id]; stMainPaint(); toast(`Compliance check finished for “${r.n}” on ${r.used} device${r.used===1?'':'s'}`); }, 2600);
}

/* — the Create / Edit / Clone / View drawer ─────────────────────────────────── */
function stcPolForm(mode, id){
  const src = id != null ? STC.pol.find(p => p.id === id) : null;
  const f = src ? {name: mode === 'clone' ? 'Clone of ' + src.n : src.n, desc: src.d, tags:[...src.tags], cfg: src.cfg, bmTags:[], bm: src.bm, devFilter: src.devFilter || 'Monitor', devs:[...src.devs], notify: (src.notify||[]).join(', ')}
                : {name:'', desc:'', tags:[], cfg:'startup', bmTags:[], bm:null, devFilter:null, devs:[], notify:''};
  STC.pf = {mode, id, init: JSON.parse(JSON.stringify(f)), ...f, err:{}, tried:false, busy:false};
  stcPfPaint(true);
}
function stcPfPaint(open){
  const F = STC.pf, view = F.mode === 'view', E = F.err;
  const title = view ? 'View Audit Policy' : (F.mode === 'clone' ? 'Clone' : F.mode === 'edit' ? 'Update' : 'Create') + ' Compliance Policy';
  const lab = (t, req, k) => `<span class="stclab${req?' req':''}">${t}</span>`;
  const fi = (k, inner) => `<div class="stcfi${E[k]?' err':''}" id="stcpf-${k}">${inner}<div class="stex">${E[k] && E[k].msg ? stcEsc(E[k].msg) : ''}</div></div>`;
  const sel = (k, txt, ph, on, dis) => `<div class="stcsel${dis?' dis':''}" ${dis?'':`onclick="${on}"`}><span class="v${txt?'':' ph'}">${txt ? stcEsc(txt) : ph}</span>${stcSvg('chevron-down','car')}</div>`;
  const bmOpts = STC.bm.filter(b => !F.bmTags.length || F.bmTags.some(t => b.tags.includes(t)));
  const devTxt = F.devFilter === 'Monitor' ? F.devs.map(d => (STC_DEVICES.find(x => x.id === d) || {}).n).filter(Boolean) : F.devs;
  const body = `
    <div class="stcrow">
      <div class="stccol">${fi('name', lab('Policy Name', 1) + `<input class="stin" placeholder="Must be unique" value="${stcEsc(F.name)}" ${view?'disabled':''} oninput="stcPfIn('name',this.value)">`)}</div>
      <div class="stccol">${fi('desc', lab('Description') + `<input class="stin" placeholder="Write Description here" value="${stcEsc(F.desc)}" ${view?'disabled':''} oninput="stcPfIn('desc',this.value)">`)}</div>
    </div>
    <div class="stcrow">
      <div class="stccol">${fi('tags', lab('Tags') + `<div class="stcsel line${view?' dis':''}" ${view?'':'onclick="stcPfTags(event)"'}><span class="v">${F.tags.length ? F.tags.map(t => `<span class="stctag">${stcEsc(t)}</span>`).join('') : '<span class="ph" style="font-family:\'JetBrains Mono\',monospace;letter-spacing:.04em">Add Tags</span>'}</span>${stcSvg('chevron-down','car')}</div>`)}</div>
      <div class="stccol">${fi('cfg', lab('Config File Type', 1) + `<div class="stcseg"><button type="button" class="${F.cfg==='startup'?'on':''}" ${view?'disabled':''} onclick="stcPfIn('cfg','startup');stcPfPaint()">Startup</button><button type="button" class="${F.cfg==='running'?'on':''}" ${view?'disabled':''} onclick="stcPfIn('cfg','running');stcPfPaint()">Running</button></div>`)}</div>
    </div>
    <div class="stcrow">
      <div class="stccol">${fi('bmTags', lab('Benchmark Filter by Tags') + sel('bmTags', F.bmTags.join(', '), 'Select', 'stcPfBmTags(event)', view))}</div>
      <div class="stccol">${fi('bm', lab('Benchmark', 1) + sel('bm', stcBmName(F.bm), 'Select', 'stcPfBm(event)', view || F.mode === 'edit'))}</div>
    </div>
    <div class="stcrow">
      <div class="stccol">${fi('devFilter', lab('Device Filter', 1) + sel('devFilter', F.devFilter, 'Select', 'stcPfDevFilter(event)', view))}</div>
      <div class="stccol">${fi('devs', lab('Select Device', 1) + sel('devs', devTxt.length > 2 ? devTxt.slice(0,2).join(', ') + ` +${devTxt.length-2}` : devTxt.join(', '), ' ', 'stcPfDevs(event)', view || !F.devFilter))}</div>
    </div>
    ${fi('notify', lab('Notify Team') + `<input class="stin" placeholder="@User or Email or /Handle or #User Profile" value="${stcEsc(F.notify)}" ${view?'disabled':''} oninput="stcPfIn('notify',this.value)">`)}
    <div class="stcmore">For more information: <a href="https://docs.motadata.com/motadata-aiops-docs/network-configuration-and-compliance-management/compliance-management/compliance-policy" target="_blank" rel="noopener">Compliance Policy${stcSvg('external-link')}</a></div>`;
  const foot = view ? '' : `<span class="mand"><b>*</b> fields are mandatory</span><button class="stbtn" onclick="stcPfReset()">Reset</button><button class="stbtn pri" id="stcPfSave" ${F.busy?'disabled':''} onclick="stcPfSubmit()">${F.busy?'<span class="stspin"></span>':''}${F.mode === 'clone' ? 'Clone' : F.mode === 'edit' ? 'Update' : 'Create'} Compliance Policy</button>`;
  if (open) stcDrOpen(title, body, foot);
  else { document.getElementById('stcDrT').textContent = title; document.getElementById('stcDrB').innerHTML = body; document.getElementById('stcDrF').innerHTML = foot; }
}
function stcPfIn(k, v){ STC.pf[k] = v; if (STC.pf.tried){ stcPfValidate(k); const fi = document.getElementById('stcpf-'+k); if (fi){ fi.classList.toggle('err', !!STC.pf.err[k]); fi.querySelector('.stex').textContent = STC.pf.err[k] && STC.pf.err[k].msg || ''; } } }
function stcPfValidate(k){
  const F = STC.pf, v = F[k]; let e = null;
  if (k === 'name'){ if (!String(v).trim()) e = {req:1}; else if (STC.pol.some(p => p.n.toLowerCase() === v.trim().toLowerCase() && !(F.mode === 'edit' && p.id === F.id))) e = {msg:'The Policy Name field must be unique'}; }
  if (k === 'bm' && v == null) e = {req:1};
  if (k === 'devFilter' && !v) e = {req:1};
  if (k === 'devs' && !(v && v.length)) e = {req:1};
  if (k === 'cfg' && !v) e = {req:1};
  if (e) F.err[k] = e; else delete F.err[k];
  return !e;
}
function stcPfTags(ev){ stcPick(ev.currentTarget, {title:'Tag', items: STC_TAGS.map(t => ({k:t, t})), cur: STC.pf.tags, multi:true, onPick: sel => { STC.pf.tags = sel; stcPfPaint(); }, matchWidth:true, width:300}); }
function stcPfBmTags(ev){ stcPick(ev.currentTarget, {items: STC_TAGS.map(t => ({k:t, t})), cur: STC.pf.bmTags, multi:true, onPick: sel => { STC.pf.bmTags = sel; const ok = STC.bm.filter(b => !sel.length || sel.some(t => b.tags.includes(t))); if (STC.pf.bm != null && !ok.some(b => b.id === STC.pf.bm)) STC.pf.bm = null; stcPfPaint(); }, matchWidth:true, width:300}); }
function stcPfBm(ev){ const F = STC.pf; const opts = STC.bm.filter(b => !F.bmTags.length || F.bmTags.some(t => b.tags.includes(t))); stcPick(ev.currentTarget, {items: opts.map(b => ({k:b.id, t:b.n})), cur:F.bm, onPick:k => { F.bm = k; stcPfIn('bm', k); stcPfPaint(); }, matchWidth:true, width:310}); }
function stcPfDevFilter(ev){ stcPick(ev.currentTarget, {items:['Monitor','Group','Tag'].map(t => ({k:t, t})), cur:STC.pf.devFilter, search:false, onPick:k => { if (STC.pf.devFilter !== k) STC.pf.devs = []; STC.pf.devFilter = k; stcPfIn('devFilter', k); stcPfPaint(); }, matchWidth:true, width:310}); }
function stcPfDevs(ev){
  const F = STC.pf;
  if (F.devFilter === 'Monitor') return stcDevGrid(ev.currentTarget, F.devs, sel => { F.devs = sel; stcPfIn('devs', sel); stcPfPaint(); });
  const items = F.devFilter === 'Group' ? STC_GROUPS : [...new Set(STC_DEVICES.flatMap(d => d.tags))];
  stcPick(ev.currentTarget, {items: items.map(t => ({k:t, t})), cur:F.devs, multi:true, onPick: sel => { F.devs = sel; stcPfIn('devs', sel); stcPfPaint(); }, matchWidth:true, width:310});
}
/* the Select Device grid-dropdown: search + a checkbox table (DEVICE · IP · TYPE · GROUPS · VENDOR · TAGS), 855px on live */
function stcDevGrid(anchor, cur, onPick, o){
  o = o || {}; const st = {q:'', sel:[...cur]};
  const paint = () => {
    const q = st.q.toLowerCase();
    const list = (o.items || STC_DEVICES).filter(d => !q || d.n.toLowerCase().includes(q) || d.ip.includes(q) || d.vendor.toLowerCase().includes(q));
    const all = list.length && list.every(d => st.sel.includes(d.id));
    el.innerHTML = `<div class="stcms" style="padding:0 0 10px">${stcSvg('search')}<input placeholder="Search" value="${stcEsc(st.q)}" style="padding-left:30px"></div>
      <div style="max-height:380px;overflow:auto"><table class="stcgrid"><colgroup><col style="width:40px"><col style="width:18%"><col style="width:14%">${o.sev?'<col style="width:12%">':''}<col style="width:11%"><col style="width:17%"><col style="width:17%"><col></colgroup>
      <thead><tr><th><span class="stcck${all?' on':''}" data-all="1">${stcSvg('check')}</span></th><th>Device</th><th>IP</th>${o.sev?'<th>Severity</th>':''}<th>Type</th><th>Groups</th><th>Vendor</th><th>Tags</th></tr></thead>
      <tbody>${list.map(d => `<tr><td><span class="stcck${st.sel.includes(d.id)?' on':''}" data-id="${d.id}">${stcSvg('check')}</span></td><td class="nm">${stcEsc(d.n)}</td><td>${d.ip}</td>${o.sev?`<td><span class="stcgtag" style="color:${d.sev==='UP'?'var(--green)':d.sev==='DOWN'?'var(--red)':'var(--orange)'}">${d.sev}</span></td>`:''}<td>${d.type}</td><td><span class="stcgtag">${stcEsc(d.groups[0])}</span>${d.groups.length>1?`<span class="stcgtag">+${d.groups.length-1}</span>`:''}</td><td title="${stcEsc(d.vendor)}">${stcEsc(d.vendor)}</td><td>${stcTags(d.tags)}</td></tr>`).join('') || `<tr><td colspan="8"><div class="stcempty">No devices match.</div></td></tr>`}</tbody></table></div>
      <div class="stcmf" style="border:0;padding:10px 0 0"><span style="margin-right:auto;color:var(--text-dim);font-size:12px;align-self:center">${st.sel.length} selected</span><button class="stbtn" style="height:30px" data-act="cancel">Cancel</button><button class="stbtn pri" style="height:30px" data-act="apply">${o.applyLabel || 'Apply'}</button></div>`;
    el.querySelector('[data-all]').onclick = () => { if (all) st.sel = st.sel.filter(i => !list.some(d => d.id === i)); else list.forEach(d => { if (!st.sel.includes(d.id)) st.sel.push(d.id); }); paint(); };
    el.querySelectorAll('.stcck[data-id]').forEach(c => c.onclick = () => { const id = +c.dataset.id; const i = st.sel.indexOf(id); if (i >= 0) st.sel.splice(i, 1); else st.sel.push(id); paint(); });
    const inp = el.querySelector('input'); inp.oninput = () => { st.q = inp.value; const p = inp.selectionStart; paint(); const i2 = el.querySelector('input'); i2.focus(); i2.setSelectionRange(p, p); };
    el.querySelector('[data-act="cancel"]').onclick = stcPopClose;
    el.querySelector('[data-act="apply"]').onclick = () => { stcPopClose(); onPick(st.sel); };
  };
  const el = stcPop(anchor, '', {cls:'grid', right:true}); if (!el) return; paint();
  const r = anchor.getBoundingClientRect(); let left = r.right - el.offsetWidth; if (left < 8) left = 8; el.style.left = left + 'px';
  if (r.bottom + 4 + el.offsetHeight > innerHeight - 8) el.style.top = Math.max(8, innerHeight - el.offsetHeight - 8) + 'px';
}
function stcPfReset(){ const F = STC.pf; Object.assign(F, JSON.parse(JSON.stringify(F.init))); F.err = {}; F.tried = false; stcPfPaint(); }
function stcPfSubmit(){
  const F = STC.pf; if (F.busy) return; F.tried = true;
  const ok = ['name','cfg','bm','devFilter','devs'].map(k => stcPfValidate(k)).every(Boolean);
  if (!ok){ stcPfPaint(); return; }
  F.busy = true; stcPfPaint();
  setTimeout(() => {
    const notify = F.notify.split(/[,\s]+/).filter(Boolean);
    const rec = {n: F.name.trim(), d: F.desc.trim(), tags: F.tags, cfg: F.cfg, bm: F.bm, devFilter: F.devFilter, devs: F.devs, notify};
    let msg;
    if (F.mode === 'edit'){ const p = STC.pol.find(x => x.id === F.id); Object.assign(p, rec, {used: F.devFilter === 'Monitor' ? F.devs.length : p.used}); msg = `Compliance Policy “${p.n}” updated`; }
    else { const p = {id: stcNewId(STC.pol), ...rec, created: stcNow(), used: F.devFilter === 'Monitor' ? F.devs.length : F.devs.length, sched:false}; STC.pol.push(p); msg = `Compliance Policy “${p.n}” ${F.mode === 'clone' ? 'cloned' : 'created'}`; }
    stcDrClose(); stMainPaint(); toast(msg);
  }, 700);
}
function stcPolView(id){ stcPolForm('view', id); }

/* — Schedule drawer (“<name> Schedule”: Once / Daily / Weekly / Monthly · Start Date · Hours · Notify*) — */
function stcSchedule(id){
  const p = STC.pol.find(x => x.id === id);
  STC.sf = {id, type:'Once', date:'', hour:'', days:[], dom:'', notify:'', err:{}, tried:false};
  stcSfPaint(true);
}
function stcSfPaint(open){
  const S = STC.sf, p = STC.pol.find(x => x.id === S.id), E = S.err;
  const seg = (k, opts, cur) => `<div class="stcseg">${opts.map(o => `<button type="button" class="${cur===o?'on':''}" onclick="STC.sf.${k}='${o}';stcSfPaint()">${o}</button>`).join('')}</div>`;
  const body = `
    <div class="stcfi"><span class="stclab req">Scheduler Type</span>${seg('type', ['Once','Daily','Weekly','Monthly'], S.type)}</div>
    <div class="stcrow">
      <div class="stccol"><div class="stcfi${E.date?' err':''}"><span class="stclab req">Start Date</span><input class="stin" type="date" value="${S.date}" oninput="STC.sf.date=this.value"></div></div>
      <div class="stccol"><div class="stcfi${E.hour?' err':''}"><span class="stclab req">Hours</span><input class="stin" type="time" value="${S.hour}" oninput="STC.sf.hour=this.value"></div></div>
    </div>
    ${S.type === 'Weekly' ? `<div class="stcfi"><span class="stclab req">Days</span><div class="stcseg">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<button type="button" class="${S.days.includes(d)?'on':''}" onclick="stcSfDay('${d}')">${d}</button>`).join('')}</div></div>` : ''}
    ${S.type === 'Monthly' ? `<div class="stcfi"><span class="stclab req">Day of month</span><input class="stin" type="number" min="1" max="31" placeholder="1 – 31" value="${S.dom}" oninput="STC.sf.dom=this.value" style="width:120px"></div>` : ''}
    <div class="stcfi${E.notify?' err':''}"><span class="stclab req">Notify</span><input class="stin" placeholder="@User or Email or /Handle or #User Profile" value="${stcEsc(S.notify)}" oninput="STC.sf.notify=this.value"></div>`;
  const foot = `<span class="mand"><b>*</b> fields are mandatory</span><button class="stbtn pri" onclick="stcSfSubmit()">Schedule</button><button class="stbtn" onclick="stcSchedule(${S.id})">Reset</button>`;
  if (open) stcDrOpen(`${p.n} Schedule`, body, foot); else { document.getElementById('stcDrB').innerHTML = body; }
}
function stcSfDay(d){ const a = STC.sf.days; const i = a.indexOf(d); if (i >= 0) a.splice(i, 1); else a.push(d); stcSfPaint(); }
function stcSfSubmit(){
  const S = STC.sf; S.err = {}; if (!S.date) S.err.date = 1; if (!S.hour) S.err.hour = 1; if (!S.notify.trim()) S.err.notify = 1;
  if (Object.keys(S.err).length){ stcSfPaint(); return; }
  const p = STC.pol.find(x => x.id === S.id); p.sched = true; stcDrClose(); stMainPaint(); toast(`“${p.n}” scheduled ${S.type.toLowerCase()} from ${S.date} at ${S.hour}`);
}

/* — Assign / Remove Assigned Monitor drawer — */
function stcAssign(id, mode){
  STC.af = {id, mode, sel:[], q:'', filt:false};
  stcAfPaint(true);
}
function stcAfPaint(open){
  const A = STC.af, p = STC.pol.find(x => x.id === A.id);
  const pool = A.mode === 'assign' ? STC_DEVICES.filter(d => !p.devs.includes(d.id)) : STC_DEVICES.filter(d => p.devs.includes(d.id));
  const q = A.q.toLowerCase(), list = pool.filter(d => !q || d.n.toLowerCase().includes(q) || d.ip.includes(q));
  const all = list.length && list.every(d => A.sel.includes(d.id));
  const body = `<div class="stcbar" style="margin-bottom:10px"><div class="stcsearch" style="width:260px;flex-basis:260px">${stcSvg('search')}<input placeholder="Search" value="${stcEsc(A.q)}" oninput="STC.af.q=this.value;stcAfPaint();const i=document.querySelector('#stcDrB .stcsearch input');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></div><span class="stcsp"></span><button class="stcsq${A.filt?' on':''}" data-tip="Filter" onclick="STC.af.filt=!STC.af.filt;stcAfPaint()">${stcSvg('filter')}</button></div>
    ${A.filt ? `<div class="stcnote" style="margin:0 0 10px">Filters — Type · Groups · Vendor · Tags (the live dialog's MonitorSelectionFilters; not wired here)</div>` : ''}
    <div style="overflow:auto"><table class="stcgrid"><colgroup><col style="width:36px"><col style="width:22%"><col style="width:15%"><col style="width:18%"><col style="width:10%"><col style="width:20%"><col></colgroup>
      <thead><tr><th><span class="stcck${all?' on':''}" onclick="stcAfAll()">${stcSvg('check')}</span></th><th>Device</th><th>Severity</th><th>IP</th><th>Type</th><th>Groups</th><th>Vendor</th></tr></thead>
      <tbody>${list.map(d => `<tr><td><span class="stcck${A.sel.includes(d.id)?' on':''}" onclick="stcAfTog(${d.id})">${stcSvg('check')}</span></td><td class="nm">${stcEsc(d.n)}</td><td><span style="font:600 10.5px/1 'JetBrains Mono',monospace;color:${d.sev==='UP'?'var(--green)':d.sev==='DOWN'?'var(--red)':'var(--orange)'}">${d.sev}</span></td><td>${d.ip}</td><td>${d.type}</td><td><span class="stcgtag">${stcEsc(d.groups[0])}</span>${d.groups.length>1?`<span class="stcgtag">+${d.groups.length-1}</span>`:''}</td><td title="${stcEsc(d.vendor)}">${stcEsc(d.vendor)}</td></tr>`).join('') || `<tr><td colspan="7"><div class="stcempty">${A.mode === 'assign' ? 'Every device is already assigned to this policy.' : 'No monitors are assigned to this policy.'}</div></td></tr>`}</tbody></table></div>`;
  const lbl = A.mode === 'assign' ? 'Assign Monitor' : 'Unassign Monitor';
  const foot = `<span class="mand" style="color:var(--text-dim)">${A.sel.length} selected</span><button class="stbtn" onclick="stcDrClose()">Cancel</button><button class="stbtn pri" ${A.sel.length?'':'disabled'} onclick="stcAfSubmit()">${lbl}</button>`;
  if (open) stcDrOpen(A.mode === 'assign' ? 'Assign Monitor' : 'Unassign Monitor', body, foot); else { document.getElementById('stcDrB').innerHTML = body; document.getElementById('stcDrF').innerHTML = foot; }
}
function stcAfTog(id){ const a = STC.af.sel, i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.push(id); stcAfPaint(); }
function stcAfAll(){ const A = STC.af, p = STC.pol.find(x => x.id === A.id); const pool = (A.mode === 'assign' ? STC_DEVICES.filter(d => !p.devs.includes(d.id)) : STC_DEVICES.filter(d => p.devs.includes(d.id))).map(d => d.id); const all = pool.every(i => A.sel.includes(i)); A.sel = all ? [] : pool; stcAfPaint(); }
function stcAfSubmit(){
  const A = STC.af, p = STC.pol.find(x => x.id === A.id);
  if (A.mode === 'assign') A.sel.forEach(i => { if (!p.devs.includes(i)) p.devs.push(i); }); else p.devs = p.devs.filter(i => !A.sel.includes(i));
  p.devFilter = 'Monitor'; p.used = p.devs.length;
  stcDrClose(); stMainPaint(); toast(`${A.sel.length} monitor${A.sel.length===1?'':'s'} ${A.mode === 'assign' ? 'assigned to' : 'removed from'} “${p.n}”`);
}

/* ═══ Benchmark ═══════════════════════════════════════════════════════════════ */
function stcBmRows(){ const P = STC.pg.bm, q = P.q.trim().toLowerCase(), F = P.filt; let rows = STC.bm.filter(b => !q || b.n.toLowerCase().includes(q) || (b.d||'').toLowerCase().includes(q)); if (F.tag != null) rows = rows.filter(b => F.tagOp === '=' ? b.tags.includes(F.tag) : !b.tags.includes(F.tag)); return rows; }
function stcBmHTML(){
  const P = STC.pg.bm, rows = stcBmRows(), total = rows.length, page = rows.slice((P.page-1)*P.size, P.page*P.size);
  return `<div class="stcbar">${stcSearchHTML('bm')}<span class="stcsp"></span>
      <button class="stcsq" data-tip="Export As PDF" onclick="stcExport('PDF','Benchmark')">${stcSvg('export-pdf')}</button>
      <button class="stcsq" data-tip="Export As CSV" onclick="stcExport('CSV','Benchmark')">${stcSvg('export-csv')}</button>
      <button class="stcsq${P.chips?' on':''}" data-tip="${P.chips?'Hide filters':'Show filters'}" onclick="STC.pg.bm.chips=!STC.pg.bm.chips;stMainPaint()">${stcSvg('filter')}</button>
      <button class="stbtn pri" onclick="stcBmForm()">Create Benchmark</button></div>
    <div class="stcchips${P.chips?'':' hid'}">
      <span class="stcchip" onclick="stcBmChip(event)"><span class="f">Tags</span>${P.filt.tag != null ? `<span class="op">${P.filt.tagOp}</span><span class="v">${stcEsc(P.filt.tag)}</span><svg class="x" viewBox="0 0 48 48" onclick="event.stopPropagation();STC.pg.bm.filt.tag=null;stMainPaint()"><path fill="currentColor" d="${STC_ICO.times}"/></svg>` : ''}</span>
      <button class="stcaddf" onclick="stcMenu(event.currentTarget,[{t:'Tags',fn:()=>{STC.pg.bm.chips=true;stMainPaint();setTimeout(()=>{const c=document.querySelector('#stMain .stcchip');c&&c.click()},30)}}])">${stcSvg('plus')}<span>Filter</span></button></div>
    <div class="stcgridw"><div class="stcscroll"><table class="stcgrid">
      <colgroup><col style="width:24%"><col style="width:30%"><col style="width:14%"><col><col style="width:120px"></colgroup>
      <thead><tr>${stcTh('Benchmark',{})}${stcTh('Description',{})}${stcTh('Used Count',{cls:'c'})}${stcTh('Tag',{})}${stcTh('Actions',{cls:'r'})}</tr></thead>
      <tbody>${page.map(b => `<tr>
        <td class="nm">${b.sys ? stcSvg('lock-alt','lock') : ''}<span class="lk" onclick="stcBmView(${b.id})">${stcEsc(b.n)}</span></td>
        <td class="dim" title="${stcEsc(b.d)}">${stcEsc(b.d)}</td>
        <td class="c">${stcUsed(b.used)}</td>
        <td>${stcTags(b.tags)}</td>
        <td><div class="stcact"><button class="stcib" data-tip="Actions" onclick="stcBmMenu(event,${b.id})">${stcSvg('ellipsis-v')}</button></div></td></tr>`).join('') || `<tr><td colspan="5"><div class="stcempty">No benchmarks match.</div></td></tr>`}</tbody></table></div>
    ${stcPagerHTML('bm', total)}</div>`;
}
function stcBmChip(ev){ const F = STC.pg.bm.filt; stcPick(ev.currentTarget, {title:'Tags', items: STC_TAGS.map(t => ({k:t, t})), cur:F.tag, clear:true, ops:{cur:F.tagOp, onOp:op => { F.tagOp = op; if (F.tag != null) stMainPaint(); }}, onPick:k => { F.tag = k; STC.pg.bm.page = 1; stMainPaint(); }, width:260}); }
function stcBmMenu(ev, id){
  const b = STC.bm.find(x => x.id === id);
  const items = [{t:'Clone', ic:'clone', fn:() => stcBmForm(id)}];
  if (!b.sys) items.push({t:'Delete', ic:'trash-alt', del:true, fn:() => {
    const used = STC.pol.filter(p => p.bm === id);
    if (used.length) return toast(`“${b.n}” is used by ${used.length} compliance polic${used.length===1?'y':'ies'} — remove it from them first`);
    stcConfirm('Delete Benchmark', `Are you sure you want to delete <b>${stcEsc(b.n)}</b>? This cannot be undone.`, 'Delete', () => { STC.bm = STC.bm.filter(x => x.id !== id); stMainPaint(); toast(`Benchmark “${b.n}” deleted`); });
  }});
  stcMenu(ev.currentTarget, items, {right:true});
}
/* tree helpers: numbering is derived, never stored */
function stcTreeHTML(nodes, prefix, o){
  return nodes.map((n, i) => {
    const num = (prefix ? prefix + '.' : '') + (i + 1);
    if (n.r != null){ const r = stcRule(n.r); return `<div class="stcbr">${stcSevBar(r ? r.sev : 'INFO')}<span class="nm">${num} ${stcEsc(r ? r.n : '(deleted rule)')}</span>${o.edit ? `<button class="stcib" data-tip="Remove rule" onclick="stcBfRmRule('${n._p}')">${stcSvg('times')}</button>` : ''}</div>`; }
    /* live starts every group COLLAPSED (the view page had to be clicked open to read the
       tree); only a group just added in the builder opens itself (stcBfAddGroup sets open) */
    const open = n.open === true;
    const head = o.edit && n.edit
      ? `<span class="num">${num}</span><input class="nm" placeholder="Enter Name" value="${stcEsc(n.g)}" id="stcbg-${n._p}" onclick="event.stopPropagation()" onkeydown="if(event.key==='Enter'){stcBfName('${n._p}')}" autofocus><span class="acts"><button class="stcib ok" data-tip="Update Name" onclick="event.stopPropagation();stcBfName('${n._p}')">${stcSvg('check')}</button><button class="stcib" data-tip="Add Rule Group" onclick="event.stopPropagation();stcBfAddGroup('${n._p}')">${stcSvg('plus-circle')}</button><button class="stcib del" data-tip="Delete" onclick="event.stopPropagation();stcBfDel('${n._p}')">${stcSvg('trash-alt')}</button></span>`
      : `<span class="num">${num}</span><span class="nm">${stcEsc(n.g)}</span>${o.edit ? `<span class="acts"><button class="stcib" data-tip="Edit Name" onclick="event.stopPropagation();stcBfEdit('${n._p}')">${stcSvg('pencil')}</button><button class="stcib" data-tip="Add Rule Group" onclick="event.stopPropagation();stcBfAddGroup('${n._p}')">${stcSvg('plus-circle')}</button><button class="stcib del" data-tip="Delete" onclick="event.stopPropagation();stcBfDel('${n._p}')">${stcSvg('trash-alt')}</button></span>` : ''}`;
    return `<div class="stcbg${open?' open':''}" data-p="${n._p||''}">
      <div class="stcbgh" onclick="stcBgTog(this)">${stcSvg('chevron-right','car')}${o.edit ? stcSvg('move-up','drag') : ''}${head}</div>
      <div class="stcbgb">${stcTreeHTML(n.kids || [], num, o)}${o.edit ? `<button class="stcbradd" onclick="stcBfAddRule(event,'${n._p}')">${stcSvg('plus')}Add Rule</button>` : ''}</div></div>`;
  }).join('');
}
function stcBgTog(h){ const g = h.parentElement; g.classList.toggle('open'); const p = g.dataset.p; if (STC.bf && p){ const n = stcBfNode(p); if (n) n.open = g.classList.contains('open'); } }
function stcCountRules(nodes){ return nodes.reduce((s, n) => s + (n.r != null ? 1 : stcCountRules(n.kids || [])), 0); }
/* view page */
function stcBmView(id){
  const b = STC.bm.find(x => x.id === id);
  stFullOpen({ title: b.n, info: stcBmInfo, infoHTML: stcBmInfoHTML, html: () => `<div class="stcfull${stcInfoOn()?' info':''}"><div class="stcsplit"><div class="stcfbody">
      <div class="stcfh"><div class="stccol"><span class="stclab req">Benchmark Name</span><input class="stin" value="${stcEsc(b.n)}" disabled></div>
        <div class="stccol"><span class="stclab">Description</span><input class="stin" value="${stcEsc(b.d)}" disabled></div>
        <div class="stccol"><span class="stclab">Tags</span><div style="padding-top:6px">${stcTags(b.tags) || '<span class="stcnote">—</span>'}</div></div></div>
      <div class="stcnote" style="margin:4px 0 10px">${stcCountRules(b.tree)} rules in ${b.tree.length} group${b.tree.length===1?'':'s'}${b.used ? ` · used by ${b.used} compliance polic${b.used===1?'y':'ies'}` : ''}</div>
      <div class="stcbt">${stcTreeHTML(b.tree, '', {edit:false})}</div></div>${stcInfoPane()}</div></div>`,
    onClose: () => {} });
}
/* create / clone page */
function stcBmForm(cloneId){
  const src = cloneId != null ? STC.bm.find(x => x.id === cloneId) : null;
  const tree = src ? JSON.parse(JSON.stringify(src.tree)) : [{g:'', kids:[], edit:true, open:true}];
  STC.bf = {mode: src ? 'clone' : 'create', name: src ? 'Copy of ' + src.n : '', desc: src ? src.d : '', tags: src ? [...src.tags] : [], tree, err:{}, tried:false, info:false};
  stFullOpen({ title: (src ? 'Clone' : 'Create') + ' Benchmark', info: stcBmInfo, infoHTML: stcBmInfoHTML, html: stcBfHTML, after: () => { const i = document.querySelector('#stMain .stcbgh input'); if (i) i.focus(); }, onClose: () => { STC.bf = null; } });
}
function stcBfPaths(nodes, prefix){ nodes.forEach((n, i) => { n._p = (prefix ? prefix + '-' : '') + i; if (n.kids) stcBfPaths(n.kids, n._p); }); }
function stcBfNode(p){ let arr = STC.bf.tree, n = null; for (const i of p.split('-').map(Number)){ n = arr[i]; if (!n) return null; arr = n.kids || []; } return n; }
function stcBfParent(p){ const parts = p.split('-').map(Number); const idx = parts.pop(); let arr = STC.bf.tree; for (const i of parts){ arr = arr[i].kids; } return {arr, idx}; }
function stcBfHTML(){
  const B = STC.bf; stcBfPaths(B.tree, '');
  const fi = (k, inner) => `<div class="stcfi${B.err[k]?' err':''}">${inner}</div>`;
  return `<div class="stcfull${stcInfoOn()?' info':''}"><div class="stcsplit"><div class="stcfbody">
    <div class="stcfh">
      <div class="stccol">${fi('name', `<span class="stclab req">Benchmark Name</span><input class="stin" placeholder="Benchmark Name" value="${stcEsc(B.name)}" oninput="STC.bf.name=this.value;if(STC.bf.tried){this.closest('.stcfi').classList.toggle('err',!this.value.trim())}">`)}</div>
      <div class="stccol">${fi('desc', `<span class="stclab">Description</span><input class="stin" placeholder="Description" value="${stcEsc(B.desc)}" oninput="STC.bf.desc=this.value">`)}</div>
      <div class="stccol">${fi('tags', `<span class="stclab">Tags</span><div class="stcsel line" onclick="stcBfTags(event)"><span class="v">${B.tags.length ? B.tags.map(t => `<span class="stctag">${stcEsc(t)}</span>`).join('') : '<span class="ph" style="font-family:\'JetBrains Mono\',monospace;letter-spacing:.04em">Add Tags</span>'}</span>${stcSvg('chevron-down','car')}</div>`)}</div>
    </div>
    <div class="stcbt">${stcTreeHTML(B.tree, '', {edit:true})}</div>
    <div><button class="stcbtn-out" onclick="stcBfAddGroup(null)">Add Rule Group</button></div>
    <div class="stcfoot"><button class="stbtn" onclick="stcBfReset()">Reset</button><button class="stbtn pri" onclick="stcBfSubmit()">${B.mode === 'clone' ? 'Clone' : 'Create'} Benchmark</button></div>
    </div>${stcInfoPane()}</div></div>`;
}
function stcBfRepaint(){ stMainPaint(); }
function stcBfTags(ev){ stcPick(ev.currentTarget, {title:'Tag', items: STC_TAGS.map(t => ({k:t, t})), cur: STC.bf.tags, multi:true, onPick: sel => { STC.bf.tags = sel; stcBfRepaint(); }, matchWidth:true, width:300}); }
function stcBfAddGroup(p){
  const node = {g:'', kids:[], edit:true, open:true};
  if (p == null) STC.bf.tree.push(node); else { const n = stcBfNode(p); n.kids.push(node); n.open = true; }
  stcBfRepaint(); const ins = document.querySelectorAll('#stMain .stcbgh input'); const last = ins[ins.length - 1]; if (last) last.focus();
}
function stcBfName(p){ const n = stcBfNode(p), i = document.getElementById('stcbg-' + p); const v = i ? i.value.trim() : ''; if (!v){ i && i.focus(); toast('Enter a name for the rule group'); return; } n.g = v; n.edit = false; stcBfRepaint(); }
function stcBfEdit(p){ const n = stcBfNode(p); n.edit = true; stcBfRepaint(); const i = document.getElementById('stcbg-' + p); if (i){ i.focus(); i.select(); } }
function stcBfDel(p){ const n = stcBfNode(p), cnt = stcCountRules([n]); const go = () => { const {arr, idx} = stcBfParent(p); arr.splice(idx, 1); stcBfRepaint(); }; if (cnt || (n.kids && n.kids.length)) stcConfirm('Delete rule group', `Delete <b>${stcEsc(n.g || 'this group')}</b> and the ${cnt} rule${cnt===1?'':'s'} under it?`, 'Delete', go); else go(); }
function stcBfRmRule(p){ const {arr, idx} = stcBfParent(p); arr.splice(idx, 1); stcBfRepaint(); }
/* Add Rule: the product's picker lists existing rules, filtered by tag / severity */
function stcBfAddRule(ev, p){
  const n = stcBfNode(p), have = (n.kids || []).filter(k => k.r != null).map(k => k.r);
  const st = {q:'', sev:'', sel:[]};
  const paint = () => {
    const q = st.q.toLowerCase();
    const list = STC.rules.filter(r => !have.includes(r.id) && (!st.sev || r.sev === st.sev) && (!q || r.n.toLowerCase().includes(q) || r.tags.join(' ').toLowerCase().includes(q)));
    el.innerHTML = `<div class="stcmi hd">Add Rule · ${list.length} available</div>
      <div class="stcms">${stcSvg('search')}<input placeholder="Search rules or tags" value="${stcEsc(st.q)}"></div>
      <div class="stcmo" style="gap:6px;flex-wrap:wrap">${['','CRITICAL','HIGH','MEDIUM','LOW','INFO'].map(s => `<b class="${st.sev===s?'on':''}" data-sev="${s}" style="font-family:inherit;font-weight:500;text-transform:capitalize">${s ? s.toLowerCase() : 'All'}</b>`).join('')}</div>
      <div class="stcml" style="max-height:340px">${list.slice(0, 80).map(r => `<div class="stcmi ck${st.sel.includes(r.id)?' on':''}" data-id="${r.id}" title="${stcEsc(r.d)}"><span class="bx">${stcSvg('check')}</span>${stcSevBar(r.sev)}<span style="overflow:hidden;text-overflow:ellipsis">${stcEsc(r.n)}</span><span style="margin-left:auto;color:var(--text-dim);font-size:11px">${r.type}</span></div>`).join('') || '<div class="stcmi hd">No rules match</div>'}${list.length > 80 ? `<div class="stcmi hd">${list.length - 80} more — narrow the search</div>` : ''}</div>
      <div class="stcmf"><span style="margin-right:auto;color:var(--text-dim);font-size:12px;align-self:center">${st.sel.length} selected</span><button class="stbtn" style="height:28px;padding:0 10px" data-act="cancel">Cancel</button><button class="stbtn pri" style="height:28px;padding:0 12px" data-act="apply">Add</button></div>`;
    const inp = el.querySelector('input'); inp.oninput = () => { st.q = inp.value; const c = inp.selectionStart; paint(); const i2 = el.querySelector('input'); i2.focus(); i2.setSelectionRange(c, c); };
    el.querySelectorAll('[data-sev]').forEach(b => b.onclick = () => { st.sev = b.dataset.sev; paint(); });
    el.querySelectorAll('.stcmi[data-id]').forEach(m => m.onclick = () => { const id = +m.dataset.id; const i = st.sel.indexOf(id); if (i >= 0) st.sel.splice(i, 1); else st.sel.push(id); m.classList.toggle('on'); el.querySelector('.stcmf span').textContent = st.sel.length + ' selected'; });
    el.querySelector('[data-act="cancel"]').onclick = stcPopClose;
    el.querySelector('[data-act="apply"]').onclick = () => { stcPopClose(); st.sel.forEach(id => n.kids.push({r:id})); n.open = true; stcBfRepaint(); };
  };
  const el = stcPop(ev.currentTarget, '', {keep:true}); if (!el) return; el.style.width = '520px'; paint();
  if (ev.currentTarget.getBoundingClientRect().bottom + 4 + el.offsetHeight > innerHeight - 8) el.style.top = Math.max(8, innerHeight - el.offsetHeight - 8) + 'px';
}
function stcBfReset(){ const B = STC.bf; B.name = ''; B.desc = ''; B.tags = []; B.tree = [{g:'', kids:[], edit:true, open:true}]; B.err = {}; B.tried = false; stcBfRepaint(); }
function stcBfSubmit(){
  const B = STC.bf; B.tried = true; B.err = {};
  if (!B.name.trim()) B.err.name = 1;
  if (STC.bm.some(b => b.n.toLowerCase() === B.name.trim().toLowerCase())){ B.err.name = 1; toast('A benchmark with this name already exists'); }
  if (Object.keys(B.err).length){ stcBfRepaint(); return; }
  const strip = nodes => nodes.map(n => n.r != null ? {r:n.r} : {g:n.g || 'Untitled group', kids: strip(n.kids || [])});
  const b = {id: stcNewId(STC.bm), n: B.name.trim(), d: B.desc.trim(), tags: B.tags, used:0, tree: strip(B.tree)};
  STC.bm.push(b); const name = b.n; STC.bf = null; stFullClose(); toast(`Benchmark “${name}” ${B.mode === 'clone' ? 'cloned' : 'created'}`);
}
/* the (i) pane: ST.full._info is the open/closed state, ST.full.infoHTML the text — both live
   on the page object so a repaint (every keystroke in the builder) keeps the pane as it was */
const stcInfoOn = () => !!(ST.full && ST.full._info);
function stcInfoPane(){ return `<div class="stcinfo" id="stcInfo">${stcInfoOn() && ST.full.infoHTML ? ST.full.infoHTML() : ''}</div>`; }
function stcInfoTog(){ const pg = ST.full; if (!pg) return; pg._info = !pg._info; const w = document.querySelector('#stMain .stcfull'); if (w) w.classList.toggle('info', pg._info); const p = document.getElementById('stcInfo'); if (p) p.innerHTML = pg._info && pg.infoHTML ? pg.infoHTML() : ''; }
function stcBmInfo(){ stcInfoTog(); }
function stcBmInfoHTML(){ return `<h5>Benchmark Properties:</h5><p>In this section, you will define and customize compliance benchmarks. Benchmarks are structured collections of compliance rules, grouped for easier management. Below are the fields and actions available:</p>
<h5>Fields:</h5><li><b>Benchmark Name:</b> Enter a unique name for your benchmark to help identify its purpose.</li><li><b>Description:</b> Provide a detailed description of the benchmark, outlining its intent and the types of devices it covers.</li><li><b>Tags:</b> Use relevant tags to categorize and filter your benchmark later.</li><li><b>Add Rule Group:</b> Add a new group to organize specific rules under your benchmark.</li>
<p>Once a rule group is added, it appears as a movable accordion, providing flexible management options:</p><li><b>Edit Name:</b> Change the title of the accordion to represent the group’s function or purpose.</li><li><b>Delete:</b> Remove the accordion (and its associated rules).</li><li><b>Add Rule Group Below:</b> Add a child accordion beneath the current group. This makes the parent-child relationship visible, where the newly added rule group is nested under the parent.</li><li><b>Add Rule:</b> Choose from existing compliance rules (already created in the product). Filter these rules based on tags or severity levels (Critical, Major, Warning) to select the most relevant rules.</li>
<p>You can also add additional parent accordions parallel to the existing parent groups by clicking on "Add Rule Group."</p>
<h5>Example:</h5><p>Benchmark Name: "CIS Cisco IOS 16 Benchmark"<br>Description: "A set of compliance rules tailored to Cisco IOS 16 security standards."<br>Tags: "Cisco, Security, CIS"</p><li>Add Rule Group: Add an accordion for "Management Plane."</li><li>Add Rule Group Below: Add a child group for "Local Authentication, Authorization and Accounting (AAA) Rules." Inside this accordion, filter and add rules like "Enable aaa new-model," "Set aaa accounting exec," "Set login authentication for ip http," etc.</li><li>Add Parallel Rule Group: Add another accordion to the above for "SNMP Rules."</li><li>Add Parallel Rule Group: Add another parent accordion for "Control Plane."</li>
<p style="margin-top:8px">For more information: <a href="https://docs.motadata.com/motadata-aiops-docs/network-configuration-and-compliance-management/compliance-management/benchmark" target="_blank" rel="noopener" style="color:var(--white);text-decoration:underline">NCCM Compliance: Benchmark</a></p>`; }

/* ═══ Rules ═══════════════════════════════════════════════════════════════════ */
function stcRuRows(){ const P = STC.pg.ru, q = P.q.trim().toLowerCase(); return STC.rules.filter(r => !q || r.n.toLowerCase().includes(q) || r.d.toLowerCase().includes(q) || r.tags.join(' ').toLowerCase().includes(q)); }
function stcRuHTML(){
  const P = STC.pg.ru, rows = stcRuRows(), total = rows.length, page = rows.slice((P.page-1)*P.size, P.page*P.size);
  return `<div class="stcbar">${stcSearchHTML('ru')}<span class="stcsp"></span><button class="stbtn pri" onclick="stcRuForm('create')">Create Rule</button></div>
    <div class="stcgridw"><div class="stcscroll"><table class="stcgrid">
      <colgroup><col style="width:23%"><col style="width:30%"><col style="width:24%"><col><col style="width:120px"></colgroup>
      <thead><tr>${stcTh('Rule',{})}${stcTh('Description',{})}${stcTh('Tag',{})}${stcTh('Rule Type',{})}${stcTh('Actions',{cls:'r'})}</tr></thead>
      <tbody>${page.map(r => `<tr>
        <td class="nm" title="${stcEsc(r.n)}">${stcSevBar(r.sev)}${stcEsc(r.n)}</td>
        <td class="dim" title="${stcEsc(r.d)}">${stcEsc(r.d)}</td>
        <td>${stcTags(r.tags)}</td>
        <td>${r.type}</td>
        <td><div class="stcact"><button class="stcib" data-tip="Actions" onclick="stcRuMenu(event,${r.id})">${stcSvg('ellipsis-v')}</button></div></td></tr>`).join('') || `<tr><td colspan="5"><div class="stcempty">No rules match.</div></td></tr>`}</tbody></table></div>
    ${stcPagerHTML('ru', total)}</div>`;
}
function stcRuMenu(ev, id){
  const r = stcRule(id);
  stcMenu(ev.currentTarget, [
    {t:'Edit', ic:'pencil', fn:() => stcRuForm('edit', id)},
    {t:'Clone', ic:'clone', fn:() => stcRuForm('clone', id)},
    {t:'Delete', ic:'trash-alt', del:true, fn:() => {
      const inB = STC.bm.filter(b => stcTreeHas(b.tree, id)).length;
      stcConfirm('Delete Rule', `Are you sure you want to delete <b>${stcEsc(r.n)}</b>?${inB ? ` It is part of ${inB} benchmark${inB===1?'':'s'} and will be removed from them.` : ''} This cannot be undone.`, 'Delete', () => { STC.rules = STC.rules.filter(x => x.id !== id); STC.bm.forEach(b => stcTreeDrop(b.tree, id)); stMainPaint(); toast(`Rule “${r.n}” deleted`); });
    }},
  ], {right:true});
}
function stcTreeHas(nodes, id){ return nodes.some(n => n.r === id || (n.kids && stcTreeHas(n.kids, id))); }
function stcTreeDrop(nodes, id){ for (let i = nodes.length - 1; i >= 0; i--){ if (nodes[i].r === id) nodes.splice(i, 1); else if (nodes[i].kids) stcTreeDrop(nodes[i].kids, id); } }
/* the two-step wizard */
const STC_COND = [['contain','Should Contain'],['not contain','Should Not contain']], STC_OPS = [['and','AND'],['or','OR']], STC_SEV = [['CRITICAL','Critical'],['HIGH','High'],['MEDIUM','Medium'],['LOW','Low'],['INFO','Info']];
const STC_OCC = [[-1,'Any']].concat(Array.from({length:25}, (_, i) => [i+1, String(i+1)]));
function stcRuForm(mode, id){
  const src = id != null ? stcRule(id) : null;
  STC.rf = { mode, id, step:1, info:false, newRb:null, checkIn:'Config File', cfg:'basic', blockStart:'', blockEnd:'', block:[], command:'',
    cond:[{op:'', c:'', rp:'', oc:''}], runbooks:[],
    name: src ? (mode === 'clone' ? 'Copy of ' + src.n : src.n) : '', desc: src ? src.d : '', sev: src ? src.sev : 'HIGH', tags: src ? [...src.tags] : [],
    rationale:'', impact:'', defaultValue:'', references:'', additional:'', controls:[{name:'', desc:'', ver:'', ig:[]}], err:{}, tried:false };
  if (src && src.cond){ Object.assign(STC.rf, JSON.parse(JSON.stringify(src.cond))); }
  stFullOpen({ title: (mode === 'edit' ? 'Edit' : mode === 'clone' ? 'Clone' : 'Create') + ' Rule', info: stcRuInfo, infoHTML: stcRuInfoHTML, html: stcRfHTML, onClose: () => { STC.rf = null; } });
}
function stcRfHTML(){
  const R = STC.rf, E = R.err;
  const seg = (k, opts, cur, onpick) => `<div class="stcseg">${opts.map(([v, t]) => `<button type="button" class="${cur===v?'on':''}" onclick="${onpick||`STC.rf.${k}=${JSON.stringify(v).replace(/"/g,'&quot;')};stcRfRepaint()`}">${t}</button>`).join('')}</div>`;
  const sel = (txt, ph, on, cls) => `<div class="stcsel${cls?' '+cls:''}" ${on?`onclick="${on}"`:''}><span class="v${txt?'':' ph'}">${txt ? stcEsc(txt) : ph}</span>${stcSvg('chevron-down','car')}</div>`;
  const condRow = (arr, key, i, withOcc) => {
    const c = arr[i], first = i === 0, last = i === arr.length - 1, e = (E[key] || {})[i] || {};
    return `<div class="stccond">
      <div class="op">${first ? '<div class="stcfi" style="margin:0"><span class="stclab">&nbsp;</span>' + sel('', ' ', null, 'blank') + '</div>' : `<div class="stcfi${e.op?' err':''}" style="margin:0"><span class="stclab">&nbsp;</span>${sel((STC_OPS.find(o => o[0]===c.op)||[])[1], 'Select', `stcRfPick(event,'${key}',${i},'op')`)}</div>`}</div>
      <div class="cd"><div class="stcfi${e.c?' err':''}" style="margin:0"><span class="stclab${first?' req':''}">${first?'Condition':'&nbsp;'}</span>${sel((STC_COND.find(o => o[0]===c.c)||[])[1], 'Select', `stcRfPick(event,'${key}',${i},'c')`)}</div></div>
      <div class="rp"><div class="stcfi${e.rp?' err':''}" style="margin:0"><span class="stclab${first?' req':''}">${first?'Result Pattern':'&nbsp;'}</span><input class="stin" value="${stcEsc(c.rp)}" oninput="STC.rf.${key}[${i}].rp=this.value"></div></div>
      ${withOcc ? `<div class="oc"><div class="stcfi${e.oc?' err':''}" style="margin:0"><span class="stclab${first?' req':''}">${first?'Occurrence':'&nbsp;'}</span>${sel((STC_OCC.find(o => String(o[0])===String(c.oc))||[])[1], 'Select', `stcRfPick(event,'${key}',${i},'oc')`)}</div></div>` : ''}
      <div class="ic">${arr.length > 1 || !withOcc ? `<button class="stcib rm" data-tip="Remove" onclick="stcRfRow('${key}','rm',${i})">${stcSvg('times-circle')}</button>` : ''}${last ? `<button class="stcib" data-tip="Add" onclick="stcRfRow('${key}','add')">${stcSvg('plus-circle')}</button>` : ''}</div></div>`;
  };
  const step1 = `
    <div class="stcinl"><span class="stclab req">Rule Check in</span>${seg('checkIn', [['Config File','Config File'],['CLI','CLI']], R.checkIn)}</div>
    ${R.checkIn === 'Config File' ? `<div class="stcinl"><span class="stclab req">Rule Configuration</span>${seg('cfg', [['basic','Basic'],['advanced','Advanced']], R.cfg)}</div>` : ''}
    ${R.checkIn === 'Config File' && R.cfg === 'advanced' ? `<h4 class="stch4">Block Criteria</h4>
      <div class="stcrow" style="max-width:800px"><div class="stccol"><div class="stcfi${E.blockStart?' err':''}"><span class="stclab req">Block Start</span><input class="stin" value="${stcEsc(R.blockStart)}" oninput="STC.rf.blockStart=this.value"></div></div><div class="stccol"><div class="stcfi"><span class="stclab">Block End</span><input class="stin" value="${stcEsc(R.blockEnd)}" oninput="STC.rf.blockEnd=this.value"></div></div></div>
      ${R.block.map((_, i) => condRow(R.block, 'block', i, false)).join('')}
      <div><button class="stcbtn-out" onclick="stcRfRow('block','add')">Add Conditions</button></div>` : ''}
    <h4 class="stch4">Rule Condition</h4>
    ${R.checkIn === 'CLI' ? `<div class="stcfi${E.command?' err':''}" style="max-width:800px"><span class="stclab req">Command</span><input class="stin" value="${stcEsc(R.command)}" oninput="STC.rf.command=this.value" placeholder="e.g. show running-config | include snmp-server community"></div>` : ''}
    ${R.cond.map((_, i) => condRow(R.cond, 'cond', i, true)).join('')}
    <h4 class="stch4">Remediation Action</h4>
    <div class="stcinl"><span class="stclab">Action to be taken</span><div style="width:390px">${sel(R.runbooks.length ? R.runbooks.join(', ') : '', 'Select', 'stcRfRunbooks(event)')}</div>${R.newRb == null
      ? `<button class="stcbtn-out" onclick="stcRfNewRb('')">Create Runbook</button>`
      : `<span class="stcnewrb"><input class="stin" id="stcNewRb" placeholder="Runbook name" value="${stcEsc(R.newRb)}" ` +
        `oninput="STC.rf.newRb=this.value" onkeydown="stcRfNewRbKey(event)">` +
        `<button class="stcib" data-tip="Create" onclick="stcRfNewRbGo()">${stcSvg('check')}</button>` +
        `<button class="stcib x" data-tip="Cancel" onclick="stcRfNewRb(null)">${stcSvg('times')}</button></span>`}</div>`;
  const ctl = (c, i) => `<div class="stcctl"><button class="stcib x" data-tip="Remove" onclick="STC.rf.controls.splice(${i},1);stcRfRepaint()">${stcSvg('times')}</button>
      <div class="stcwzrow"><span class="stclab">Controls Name</span><div class="f"><input class="stin" placeholder="Select" value="${stcEsc(c.name)}" oninput="STC.rf.controls[${i}].name=this.value"></div></div>
      <div class="stcwzrow"><span class="stclab">Controls Description</span><div class="f"><input class="stin" placeholder="Description" value="${stcEsc(c.desc)}" oninput="STC.rf.controls[${i}].desc=this.value"></div></div>
      <div class="stcwzrow"><span class="stclab">Controls Version</span><div class="f"><input class="stin" placeholder="Version" value="${stcEsc(c.ver)}" oninput="STC.rf.controls[${i}].ver=this.value"></div></div>
      <div class="stcwzrow" style="margin-bottom:0"><span class="stclab">Controls IG</span><div class="f">${sel(c.ig.join(', '), 'Version', `stcRfIg(event,${i})`)}</div></div></div>`;
  const ta = (k, lab) => `<div class="stcwzrow"><span class="stclab">${lab}</span><div class="f"><textarea class="stcta" placeholder="Add text here" oninput="STC.rf.${k}=this.value">${stcEsc(R[k])}</textarea></div></div>`;
  const step2 = `
    <div class="stcwzrow"><span class="stclab req">Rule Name</span><div class="f"><div class="stcfi${E.name?' err':''}" style="margin:0"><input class="stin" value="${stcEsc(R.name)}" oninput="STC.rf.name=this.value;if(STC.rf.tried){this.closest('.stcfi').classList.toggle('err',!this.value.trim())}"><div class="stex">${E.name && E.name.msg ? stcEsc(E.name.msg) : ''}</div></div></div></div>
    <div class="stcwzrow"><span class="stclab">Description</span><div class="f"><div class="stcfi${E.desc?' err':''}" style="margin:0"><input class="stin" value="${stcEsc(R.desc)}" oninput="STC.rf.desc=this.value;if(STC.rf.tried){this.closest('.stcfi').classList.toggle('err',!this.value.trim())}"></div></div></div>
    <div class="stcwzrow"><span class="stclab req">Rule Severity</span><div class="f">${seg('sev', STC_SEV, R.sev)}</div></div>
    <div class="stcwzrow"><span class="stclab">Tags</span><div class="f"><div class="stcsel line" onclick="stcRfTags(event)"><span class="v">${R.tags.length ? R.tags.map(t => `<span class="stctag">${stcEsc(t)}</span>`).join('') : '<span class="ph" style="font-family:\'JetBrains Mono\',monospace;letter-spacing:.04em">Add Tags</span>'}</span>${stcSvg('chevron-down','car')}</div></div></div>
    ${ta('rationale','Rationale')}${ta('impact','Impact')}${ta('defaultValue','Default Value')}${ta('references','References')}${ta('additional','Additional Information')}
    ${R.controls.map(ctl).join('')}
    <div style="max-width:780px"><button class="stcbtn-out" onclick="STC.rf.controls.push({name:'',desc:'',ver:'',ig:[]});stcRfRepaint()">Add New Controls</button></div>`;
  return `<div class="stcfull${stcInfoOn()?' info':''}"><div class="stcsplit"><div class="stcfbody" style="display:flex;min-height:0"><div class="stcwz">
    <div class="stcsteps">
      <div class="stcstep${R.step===1?' on':' done'}" onclick="STC.rf.step=1;stcRfRepaint()"><span class="n">${R.step===1?'1':stcSvg('check')}</span>Audit &amp; Remediation Properties</div>
      <div class="stcstep${R.step===2?' on':''}" onclick="stcRfNext()"><span class="n">2</span>General Properties</div></div>
    <div class="stcwzf"><div class="stcwzb">${R.step === 1 ? step1 : step2}</div>
      <div class="stcwzfoot"><button class="stbtn" onclick="stcRfReset()">Reset</button>${R.step === 1 ? `<button class="stbtn pri" onclick="stcRfNext()">Next</button>` : `<button class="stbtn pri" onclick="stcRfSubmit()">${R.mode === 'edit' ? 'Update' : 'Create'} Rule</button>`}</div></div>
    </div></div>${stcInfoPane()}</div></div>`;
}
function stcRfRepaint(){ stMainPaint(); }
function stcRfRow(key, act, i){ const arr = STC.rf[key]; if (act === 'add') arr.push({op:'', c:'', rp:'', oc:''}); else arr.splice(i, 1); stcRfRepaint(); }
function stcRfPick(ev, key, i, f){
  const items = f === 'op' ? STC_OPS : f === 'c' ? STC_COND : STC_OCC;
  stcPick(ev.currentTarget, {items: items.map(([k, t]) => ({k, t})), cur: STC.rf[key][i][f], search:false, onPick:k => { STC.rf[key][i][f] = k; if (STC.rf.tried && STC.rf.err[key] && STC.rf.err[key][i]) delete STC.rf.err[key][i][f]; stcRfRepaint(); }, matchWidth:true, width:120});
}
/* ⚠️ CREATE RUNBOOK CREATES ONE, IN PLACE (request, 27 Aug 2026). It toasted "opens
   Settings › Plugin Library › Runbook on the live product" — and navigating there is
   exactly what it must NOT do from inside a two-step wizard with unsaved input: the rule
   you are half-way through writing would be abandoned to reach a list.
   ⚠️ It is the `Enter Name ✓` shape the benchmark builder already uses, so it reads as the
   same control rather than as a new one. The name goes into `STC_RUNBOOKS` — the array the
   picker beside it reads — and is selected straight away, which is the only reason you
   pressed the button. */
function stcRfNewRb(v){ STC.rf.newRb = v; stcRfRepaint();
  if (v != null) setTimeout(() => { const e = document.getElementById('stcNewRb'); if (e){ e.focus(); e.select(); } }, 10); }
function stcRfNewRbKey(e){
  if (e.key === 'Enter'){ e.preventDefault(); stcRfNewRbGo(); }
  else if (e.key === 'Escape'){ e.preventDefault(); stcRfNewRb(null); }
}
function stcRfNewRbGo(){
  const n = String(STC.rf.newRb || '').trim();
  if (!n){ toast('Give the runbook a name'); return; }
  if (STC_RUNBOOKS.some(r => r.toLowerCase() === n.toLowerCase())){
    toast('A runbook called “' + n + '” already exists — pick it from the list'); return;
  }
  STC_RUNBOOKS.unshift(n);
  if (STC.rf.runbooks.indexOf(n) < 0) STC.rf.runbooks = STC.rf.runbooks.concat([n]);
  STC.rf.newRb = null;
  stcRfRepaint();
  toast('Created runbook “' + n + '” and set it as the remediation action');
}
function stcRfRunbooks(ev){ stcPick(ev.currentTarget, {items: STC_RUNBOOKS.map(t => ({k:t, t})), cur: STC.rf.runbooks, multi:true, onPick: sel => { STC.rf.runbooks = sel; stcRfRepaint(); }, matchWidth:true, width:390}); }
function stcRfTags(ev){ stcPick(ev.currentTarget, {title:'Tag', items: STC_TAGS.map(t => ({k:t, t})), cur: STC.rf.tags, multi:true, onPick: sel => { STC.rf.tags = sel; stcRfRepaint(); }, matchWidth:true, width:300}); }
function stcRfIg(ev, i){ stcPick(ev.currentTarget, {items:[['ig1','IG-1'],['ig2','IG-2'],['ig3','IG-3']].map(([k,t]) => ({k:t, t})), cur: STC.rf.controls[i].ig, multi:true, search:false, onPick: sel => { STC.rf.controls[i].ig = sel; stcRfRepaint(); }, matchWidth:true, width:200}); }
function stcRfValidate1(){
  const R = STC.rf, E = {}; let bad = false;
  const rows = (arr, key, withOcc) => { arr.forEach((c, i) => { const e = {}; if (i > 0 && !c.op) e.op = 1; if (!c.c) e.c = 1; if (!c.rp.trim()) e.rp = 1; if (withOcc && c.oc === '') e.oc = 1; if (Object.keys(e).length){ (E[key] = E[key] || {})[i] = e; bad = true; } }); };
  if (R.checkIn === 'Config File' && R.cfg === 'advanced'){ if (!R.blockStart.trim()){ E.blockStart = 1; bad = true; } rows(R.block, 'block', false); }
  if (R.checkIn === 'CLI' && !R.command.trim()){ E.command = 1; bad = true; }
  rows(R.cond, 'cond', true);
  R.err = E; return !bad;
}
function stcRfNext(){ const R = STC.rf; if (R.step === 2) return; R.tried = true; if (!stcRfValidate1()){ stcRfRepaint(); return; } R.step = 2; R.tried = false; stcRfRepaint(); }
function stcRfReset(){ const R = STC.rf; R.newRb = null; if (R.step === 1){ Object.assign(R, {checkIn:'Config File', cfg:'basic', blockStart:'', blockEnd:'', block:[], command:'', cond:[{op:'',c:'',rp:'',oc:''}], runbooks:[], err:{}, tried:false}); } else { Object.assign(R, {name:'', desc:'', sev:'HIGH', tags:[], rationale:'', impact:'', defaultValue:'', references:'', additional:'', controls:[{name:'',desc:'',ver:'',ig:[]}], err:{}, tried:false}); } stcRfRepaint(); }
function stcRfSubmit(){
  const R = STC.rf; R.tried = true; R.err = {};
  if (!R.name.trim()) R.err.name = {req:1};
  else if (STC.rules.some(r => r.n.toLowerCase() === R.name.trim().toLowerCase() && !(R.mode === 'edit' && r.id === R.id))) R.err.name = {msg:'The Rule Name field must be unique'};
  if (!R.desc.trim()) R.err.desc = 1;             /* required in the component (rules:"required"), though the live label carries no star */
  if (Object.keys(R.err).length){ stcRfRepaint(); return; }
  const cond = {checkIn:R.checkIn, cfg:R.cfg, blockStart:R.blockStart, blockEnd:R.blockEnd, block:R.block, command:R.command, cond:R.cond, runbooks:R.runbooks, rationale:R.rationale, impact:R.impact, defaultValue:R.defaultValue, references:R.references, additional:R.additional, controls:R.controls};
  let msg;
  if (R.mode === 'edit'){ const r = stcRule(R.id); Object.assign(r, {n:R.name.trim(), d:R.desc.trim(), sev:R.sev, tags:R.tags, cond}); msg = `Rule “${r.n}” updated`; }
  else { const r = {id: stcNewId(STC.rules), n:R.name.trim(), d:R.desc.trim(), sev:R.sev, tags:R.tags, type:'Custom', cond}; STC.rules.unshift(r); msg = `Rule “${r.n}” ${R.mode === 'clone' ? 'cloned' : 'created'}`; }
  STC.rf = null; stFullClose(); toast(msg);
}
function stcRuInfo(){ stcInfoTog(); }
function stcRuInfoHTML(){ return `<h5>Audit/Remediation Properties</h5><p>Set up how this rule will be audited and what actions will be taken for remediation. This ensures the rule is enforceable and provides guidance for rectifying any violations.</p>
<h5>Difference Between CLI and Config File Selection</h5><p><b>CLI:</b> This option allows you to define commands that will be executed on the device, and the result will be matched against the rule’s condition. It is suitable when the configuration is managed via specific commands.</p><p><b>Config File:</b> This option checks the conditions directly within the configuration file of the device like startup or running config files.</p>
<h5>Basic vs Advanced Options in Config File</h5><p><b>Basic:</b> This is a straightforward rule where conditions are checked against specific patterns in the configuration file. It is useful when a simple condition needs to be verified in a specific section of the config file.</p><p><b>Advanced:</b> This allows more control by specifying a block of the configuration file to check (Block Start and Block End) and defining patterns and commands within that block. It’s suitable for complex rules requiring detailed inspection of specific parts of the configuration.</p>
<h5>Remediation and Auto-Execution</h5><p><b>Remediation:</b> If a rule is violated, you can attach or create a remediation runbook to automatically fix the issue. You can also choose to manually execute the runbook if needed.</p><p><b>Auto-Execute Runbook:</b> A checkbox that allows automatic execution of the remediation runbook if the rule is violated. If enabled, an additional checkbox appears that allows you to back up the configuration file before and after the runbook is executed, ensuring no data loss occurs during the remediation process.</p>
<h5>Example</h5><p><b>Creating a Rule to Ensure SNMP Community String is Not Set to the Default Value.</b> We will create a rule to ensure that the SNMP community string is not set to its default values.</p>
<p><b>Scenario 1: Using "Config File" for Rule Check</b><br>Rule Condition: Select the condition "should not contain" to flag the rule as failed if the following patterns are found in the configuration file:<br><code>snmp-server community public</code> <code>snmp-server community private</code><br>Occurrence: Set to "Any" to match either of the patterns. Use the logical OR operator between the two conditions.</p>
<p><b>Scenario 2: Using "CLI" for Rule Check</b><br>Command: <code>show running-config | include snmp-server community</code><br>Rule Condition: Again, select "should not contain" to flag a failure if either default SNMP community string is found. Occurrence: "Any"; OR between the two conditions.</p>`; }

/* ── register the three pages with the Settings module ───────────────────────── */
ST_PAGES['Compliance Settings › Compliance Policy'] = { html: stcPolHTML };
ST_PAGES['Compliance Settings › Benchmark'] = { html: stcBmHTML };
ST_PAGES['Compliance Settings › Rules'] = { html: stcRuHTML };

/* ══════════════════════════════════════════════════════════════════════════════════════════
   BLOCK 3 of 3 — `ag*` · Agentic AI
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/* ══ AGENTIC AI (`ag*`) — Settings › Agentic AI › Overview ════════════════════════════════
   Rebuilt 1 Sep 2026 on the ObserveOps design system, from supplied references, one piece at
   a time. So far: the integration header, and the toolbar beneath it.

   ⚠️ `ST_PAGES` IS THE ONLY WIRING. `stMainPaint()` paints whatever is registered under
   "<category> › <page>" and falls back to the placeholder, so nothing in the `st` block has to
   change to host this — the registration at the foot of this block is the entire hook-up.
   ⚠️ EVERY VISIBLE PART IS A REAL `obs-*` ELEMENT. No CSS reproduction of a DS component and
   no hand-built control; `_ds/observeops-elements.umd.js` (v0.1.166) registers them. The only
   CSS this screen owns is LAYOUT — the header wrapper's indent and rule, and the search width.
   ⚠️ Verify with `_verify/dsconf.py`, which isolates this screen and scores it against the DS
   conformance checker. The whole-file score is meaningless — see that script's header. */

/* ⚠️ `conn` IS WHICH PROVIDER IS CONNECTED, and `active` merely whether ANY is — the grid's
   Active/Available column needs to know which row, not just that one exists. One provider at a
   time is the reference's own rule. */
const AG = { active: true, conn: 'openai', q: '', opt: '1' };
/* ══ AGENTIC AI · OPTION 1 / OPTION 2 (16 Sep 2026) ══════════════════════════════════════════════════════════════
   Request: "create option 2 — the current design is option 1 — copy option 1 and paste it in option 2". A switcher in the
   page header (the License page's own review chrome, same obs-radio as-button) picks between them, and it goes when one
   design is chosen.
   ⚠️ OPTION 2 IS A COPY BY CONSTRUCTION, NOT BY DUPLICATED CODE. Both options render through the SAME builders
   (agOvHTML, agConfig and everything under them), so today they are pixel-identical and cannot drift by accident. A later
   Option 2 request is made by branching on AG.opt === '2' at the part that changes (the License page's lic4HTML('5')
   pattern) — never by pasting a second copy of these ~500 lines, which in this flat global scope would collide on every
   function name. The page root carries data-agopt="1|2" so CSS can scope to one option without touching the other. */
const AG_OPTS = [{ value:'1', label:'Option 1' }, { value:'2', label:'Option 2' }];
/* ⚠️ ⚠️ `obs-button` FIRES `onclick` TWICE FOR ONE REAL CLICK — v0.1.166, measured 1 Sep 2026.
   A pointer click targets the component's INNER `<button>` (in its shadow root). That event is
   `composed`, so it crosses the boundary and runs the host's `onclick` once — and the component
   ALSO re-emits a click on the host, which runs it again. Measured directly:
       inner.click()  -> onclick fired 2x        host.click() -> onclick fired 1x
   ⚠️ IT IS INVISIBLE UNTIL A HANDLER IS NOT IDEMPOTENT, which is why it survived several green
   probe runs: every probe here clicked the HOST (one fire). The first non-idempotent handler
   exposed it instantly — `agCfgAdv` is a TOGGLE, so Advanced settings toggled twice and the
   panel never opened. A DEAD CONTROL that every automated check called working.
   ⚠️ EVERY `onclick` ON AN `obs-button` GOES THROUGH HERE. The guard collapses a repeat of the
   SAME handler within 60ms — far below a human double-click, and scoped per function so two
   different buttons in quick succession both run.
   ⚠️ `onchange` is NOT affected: obs-checkbox / obs-switch / obs-radio / obs-select each fire
   once (measured), and their handlers take a value rather than toggling, so they are idempotent
   anyway. Do not wrap those. */
let AG_TAP = { fn:null, t:0 };
function agTap(fn){
  const t = (window.performance && performance.now) ? performance.now() : Date.now();
  if (AG_TAP.fn === fn && t - AG_TAP.t < 60) return;
  AG_TAP = { fn, t };
  fn();
}

const agIc = (n, sz) => `<obs-icon name="${n}" size="${sz || 15}"></obs-icon>`;
const agJ = v => stEsc(JSON.stringify(v));

/* ⚠️ AN INLINE `onclick` IS FINE and a custom event name would NOT be. `click` is a standard
   DOM event that bubbles out of the element, so the attribute works; `obs-table`'s
   `cellaction` / `obs-drawer`'s `close` are custom names and an `on<name>=` attribute for
   those is inert markup — the trap the previous build hit. Bind those with addEventListener.
   ⚠️ `obs-input` emits `input` with the value in `detail[0]`, NOT a native event — reading
   `event.target.value` is not the contract. `agDet` unwraps it. */
const agDet = e => (e && e.detail && e.detail.length ? e.detail[0] : (e && e.detail));


/* the usage grid's columns. ⚠️ Declared once, outside the render, so the header cannot drift
   from the row keys it labels.
   ⚠️ ONE ROW, NOT FOUR (request, 1 Sep 2026: "the all is single config and single entry and
   the all widget will be show in single grid"). Only one provider is ever connected — that is
   the reference prototype's own rule and this screen enforces it — so the grid has ONE entry:
   the connection, with its figures as COLUMNS. It listed the four metrics as four rows, each
   opening its own chart, which split one connection's health across four expanders. */
/* ⚠️ SHARES OF THE WIDTH, NOT PIXELS (request, 3 Sep 2026: "add new column 'last usage' and
   column will be full width"). Four fixed columns and one free one put 670px of figures on the
   left and handed everything else to Availability, so the grid read as five columns crammed
   into two thirds of its own row with an empty tail. `obs-table` passes a non-numeric `width`
   straight through to the header cell's style (checked in the bundle), so a percentage lands
   as `width:20%` on the `<th>` and the browser shares the row out. Provider gets the larger
   share because it carries a name; the five figures split the rest evenly. */
const AG_USE_COLS = [
  { key:'provider', title:'Provider',       width:'20%' },
  { key:'requests', title:'Requests today', width:'16%' },
  { key:'latency',  title:'Avg latency',    width:'16%' },
  { key:'errors',   title:'Error rate',     width:'16%' },
  { key:'avail',    title:'Availability',   width:'16%' },
  { key:'last',     title:'Last usage',     width:'16%' },
];
/* ⚠️ TYPING SETS THE GRID'S `rows` ATTRIBUTE — IT MUST NOT REPAINT THE PAGE. Rewriting
   `#stMain` would destroy the search box mid-keystroke and take the caret with it (the
   recorded `st` search-box lesson).
   ⚠️ `setAttribute` TAKES RAW JSON, NOT `agJ()` — that HTML-escapes for markup, and an escaped
   string set as an attribute value reaches the component as literal `&quot;`. */
/* ⚠️ EXPORT SITS BEFORE THE PRIMARY (request, 2 Sep 2026). `obs-toolbar`'s default slot lays
   its actions out in source order, so "before Configure AI provider" is simply being emitted
   first — the primary stays the last thing in the row, which is where the DS's Button rule wants
   the one main action.
   ⚠️ THE GLYPH IS THE DS's OWN `export-pdf`, confirmed with `resolve_icon` before it was used
   ("found": true, canonical `export-pdf`) rather than assumed — an `obs-icon` given a name the
   set does not have renders NOTHING, silently, which is indistinguishable from a styling bug.
   ⚠️ It is icon-only with a `data-tip`, matching the Compliance Policy toolbar's own square
   actions; the export itself is a toast, as every other export in this prototype is — there is
   no PDF pipeline here and pretending otherwise would be the one thing that lies about
   capability. */
function agExportPdf(){
  const p = agProv(AG.conn);
  toast('Exporting Agentic AI usage as PDF' + (AG.active && p ? ' — ' + p.name + ' included' : ''));
}
function agSearch(v){
  AG.q = String(v == null ? '' : v);
  const t = document.getElementById('agUse');
  if (t) t.setAttribute('rows', JSON.stringify(agUseRows()));
  else stMainPaint();
}

/* the connected provider's three trend widgets — the usage grid's expanded row (Option 1) and Option 2's details panel
   render the SAME markup, so the two options cannot disagree about a figure or a chart */
function agUseWidgetsHTML(){
  const h = AG_DATA.health;
  /* ⚠️ THE TILE IS THE DS WIDGET (request, 3 Sep 2026: "replace this chart Using the ObserveOps
     design system"). Its header is `obs-toolbar variant="widget"` — the DS's own widget header
     (title 14px/500 + a time-range pill + actions), which draws a bordered, rounded-TOP frame
     with no bottom edge on purpose: the body below carries the rest of the frame. The window
     and the delta sit in its slot, where the registry puts a widget's time-range pill.
     ⚠️ `--common-widget-bg` IS REPOINTED ON THE HOST. The header's own CSS paints that token,
     and it is the SAME `#172336` as the table's detail band in dark (the recorded collision) —
     the frame would vanish there. A custom property set on the host inherits into the shadow
     root, so the header takes the page surface, like the body. Nothing else goes in that
     `style`: Vue forwards a host's style attribute onto the inner div (the recorded
     `obs-banner` trap), so a `display` here would break the toolbar's own flex layout.
     ⚠️ THE FIGURE ABOVE THE PLOT IS THE ROW'S OWN — the registry's `kpi-tile` is "a headline
     number with a trend", and these numbers are the ones already printed in the grid row, so
     the tile and the row cannot disagree. */
  const w = (title, win, node, val, unit, delta) =>
    `<div style="min-width:0">
       <obs-toolbar variant="widget" title="${title}" style="--common-widget-bg:var(--page-background-color)">
         <obs-tag variant="tag-primary">${win}</obs-tag>${delta ? `<obs-tag variant="tag-primary">${delta}</obs-tag>` : ''}
       </obs-toolbar>
       <div style="padding:10px 12px 8px;background:var(--page-background-color);border:1px solid var(--border-color);border-top:none;border-radius:0 0 4px 4px">
         <div style="display:flex;align-items:baseline;gap:6px;margin:0 0 6px 2px">
           <span style="font-size:18px;font-weight:600;line-height:1.2;color:var(--page-text-color)">${val}</span>
           <span style="font-size:11px;color:var(--text-color-common-secondary)">${unit}</span></div>
         ${node}</div></div>`;

  /* ⚠️ THREE FIXED TRACKS, NOT `auto-fit`. There are exactly three widgets, and `auto-fit`
     resolved to FOUR at desktop width — the three sat in a four-column raster with an empty
     tail. Stating the count makes them fill the row.
     ⚠️ No media query: this is inside the shadow root, so the page's breakpoints do not apply.
     `minmax(0,1fr)` lets the tracks shrink instead of overflowing on a narrow window. */
  /* ⚠️ THE SHAPES ARE THE DS's TIME-SERIES SET — `data-viz`'s decision flow sends "change over
     time" to line / area, and the product's own chart library lists area, line AND vertical bar
     under Time Series. Volume is an AREA (its rule: "a trend where magnitude/volume matters"),
     latency a LINE (the default trend), failures per day a VERTICAL BAR (daily buckets). The
     grid, axis labels and series colours are all tokens the registry names for this family. */
  const widgets = `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 24px;padding:8px 0 12px">
      ${w('Request volume', 'Last 14 days', agChart('area',   AG_DATA.volume,  '--chart-indigo', agFmtK),  h.requestsToday.toLocaleString(), 'requests today', '+18%')}
      ${w('Response time',  'Last 14 days', agChart('line',   AG_DATA.latency, '--chart-aqua',   agFmtS),  h.avgLatency + ' s', 'avg response', '')}
      ${w('Error trend',    'Last 14 days', agChart('column', AG_DATA.errors,  '--chart-amber',  agFmtK),  h.errorRate + ' %', 'error rate', '−40%')}
    </div>`;

  return widgets;
}

/* the usage rows, as a function so the toolbar search can rebuild them without a repaint */
function agUseRows(){
  const h = AG_DATA.health;
  /* ⚠️ EVERY WIDGET IN ONE GRID INSIDE THE DETAIL. The charts live in the row's `detail`,
     which `obs-table` inner-HTMLs into its SHADOW ROOT — so this stylesheet cannot reach them
     and the layout has to be INLINE, with `var(--token)` values, which do inherit across the
     boundary. That is the one place inline styles are correct here.
     ⚠️ THE SVGs KEEP `class="agchart"` so the conformance checker still resolves them as the
     declared `chart` gap, and carry their height inline for the same shadow-root reason. */
  const widgets = agUseWidgetsHTML();

  /* ⚠️ ALL THREE PROVIDERS ARE ROWS (request, 1 Sep 2026). Only the CONNECTED one has usage —
     the others are listed so the page says what is available, and their figures are an em dash
     rather than a zero: nothing has been measured, which is not the same as measuring nothing.
     ⚠️ AND THEIR EXPAND SAYS WHY IT IS EMPTY. `obs-table`'s `expandable` puts a chevron on
     EVERY row, so an unconnected one would otherwise open onto the element's own "No detail". */
  const dash = '—';
  const rows = AG_DATA.providers.map(p => {
    const on = AG.active && AG.conn === p.id;
    return on
      ? { id:p.id, provider:p.name,
          requests:h.requestsToday.toLocaleString(), latency:h.avgLatency + 's',
          errors:h.errorRate + '%', avail:h.availability + '%', last:h.lastUsed, detail:widgets }
      : { id:p.id, provider:p.name,
          requests:dash, latency:dash, errors:dash, avail:dash, last:dash,
          detail:`<div style="padding:8px 0 12px;font-size:12.5px;line-height:1.6;color:var(--text-color-common-secondary)">`
            + `<b style="color:var(--primary-alt)">${stEsc(p.name)}</b> is not connected, so no usage has been collected for it. `
            + `${stEsc(p.tagline)} Use <b style="color:var(--primary-alt)">Configure AI provider</b> to connect it — `
            + `only one provider is active at a time, so connecting it disconnects the current one.</div>` };
  });
  const q = AG.q.trim().toLowerCase();
  return q ? rows.filter(r => r.provider.toLowerCase().includes(q)) : rows;
}

function agOvHTML(){
  /* Organisms/PageHeader. `heading`, not `title` — `title` would set a native tooltip.
     ⚠️ `heading` AND the `title` SLOT COEXIST (measured): the slot APPENDS after the heading,
     it does not replace it, which is the only reason the status tag can sit beside the title
     at full size. `tag-green` is the DS's own answer for the status string "active" (Tag's
     statusMap); `tag-primary` is its neutral chip, which is what "not configured" is. */
  const head = `<div class="aghead">
    <obs-page-header heading="Agentic AI" no-divider>
      <span slot="before" class="aghmk">${agIc('sparkling-star', 30)}</span>
      <obs-tag slot="title" variant="${AG.active ? 'tag-green' : 'tag-primary'}">${AG.active ? 'Active' : 'Not configured'}</obs-tag>
      <span class="aghact"><obs-radio id="agOpt" as-button size="small" options="${agJ(AG_OPTS)}" value="${AG.opt}"></obs-radio></span>
    </obs-page-header>
    <p class="aghsub">AI-powered observability runs on your own LLM provider keys. ObserveOps sends prompts and selected telemetry context to the provider you connect — nothing is stored in plain text. For more information:
      <obs-link external href="https://docs.motadata.com/motadata-aiops-docs/" onclick="return false">Agentic AI documentation${agIc('external-link', 12)}</obs-link></p>
  </div>`;

  /* Organisms/Toolbar. ⚠️ THE SEARCH GLASS GOES IN THE `prefix` SLOT, NOT THE `prefix-icon`
     PROP — the prop is documented in `elements-api.json` and read by the source, but this
     build (0.1.166) renders NEITHER prefix-icon nor suffix-icon (measured, and recorded in
     `_ds/README.md`). The slot works. */
  /* ⚠️ THE SEARCH FINALLY HAS SOMETHING TO SEARCH. It shipped over an empty page an hour ago;
     it filters this grid. */
  const o2 = AG.opt === '2';
  const toolbar = `<obs-toolbar>
      ${o2 ? '' : `<obs-input slot="start" class="agsrch" placeholder="Search" value="${AG.q.replace(/"/g,'&quot;')}"
        oninput="agSearch(agDet(event))">${agIc('search', 14).replace('<obs-icon', '<obs-icon slot="prefix"')}</obs-input>`}
      <obs-button variant="default" class="agexp" data-tip="Export as PDF"
        onclick="agTap(agExportPdf)">${agIc('export-pdf', 15)}</obs-button>
      <obs-button variant="primary" onclick="agTap(agConfig)">Configure AI provider</obs-button>
    </obs-toolbar>`;

  /* ⚠️ THE DETAIL ONLY EXISTS ONCE A PROVIDER IS CONNECTED. Unconfigured, the page is header →
     toolbar and nothing else, and the "Not configured" tag beside the title is what says so —
     usage figures for a connection that does not exist would be an invention. */
  /* ⚠️ NO "USAGE & HEALTH" HEADING — removed on request (2 Sep 2026). The page holds ONE table,
     directly under its own toolbar, which is the DS `list-view` recipe's own shape
     (page-header → toolbar → table); a section label over a single table names something there
     is no second thing to distinguish it from. The heading also carried `margin:24px 0 12px`,
     so the toolbar↔table gap had to move onto the table itself — see `.agpage obs-table`. */
  /* ⚠️ OPTION 2 SHOWS NO GRID (request, 16 Sep 2026: "remove the grid and show only which AI I integrated, show details").
     The three-row usage table — two of whose rows were em dashes — becomes ONE panel about the connected provider; the
     toolbar search went with the grid it filtered (a search box over nothing would be a dead control). See agConnHTML. */
  const usage = o2 ? agGridHTML() : !AG.active ? '' : `<obs-table id="agUse" row-key="id" sortable expandable
      header-style="tinted" empty-text="No records available"
      columns="${agJ(AG_USE_COLS)}" rows="${agJ(agUseRows())}"></obs-table>`;

  return `<div class="agpage" id="agPage" data-agopt="${AG.opt}">${head}${toolbar}${usage}</div>`;
}


/* ── the provider configuration screen ────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026 (the product's "Application Registration" screen): the three
   providers as a left rail, the selected one's form on the right. Opened by the toolbar's
   primary button; `stFullOpen` gives it the reference's own shape — a titled full page with
   the settings category list hidden and a ‹ back in the head. */

/* ⚠️ ONE PROVIDER LIST, and the models are the cleared build's, recovered verbatim rather
   than re-invented — the model ids and context windows were checked once and there is no
   reason to make them up a second time. */
const AG_DATA = {
  providers: [
    { id:'openai', name:'OpenAI', ic:'eye', docs:'https://platform.openai.com/docs',
      privacy:'OpenAI privacy policy',
      tagline:'GPT-4o family — broad reasoning, fast summaries, vision.',
      base:'https://api.openai.com/v1', keyHint:'sk-••••••••••••••••',
      models:[ {id:'gpt-4o', name:'GPT-4o', note:'Flagship · multimodal', ctx:'128K'},
               {id:'gpt-4-1', name:'GPT-4.1', note:'Deep reasoning', ctx:'200K'},
               {id:'gpt-4-1-mini', name:'GPT-4.1 Mini', note:'Low-latency · cheap', ctx:'128K'} ] },
    { id:'anthropic', name:'Anthropic', ic:'book-open', docs:'https://docs.anthropic.com',
      privacy:'Anthropic privacy policy',
      tagline:'Claude family — long-context analysis and careful reasoning.',
      base:'https://api.anthropic.com/v1', keyHint:'sk-ant-••••••••••••',
      models:[ {id:'claude-sonnet', name:'Claude Sonnet', note:'Balanced · everyday', ctx:'200K'},
               {id:'claude-opus', name:'Claude Opus', note:'Highest reasoning', ctx:'200K'} ] },
    { id:'deepseek', name:'DeepSeek', ic:'thunder-bolt', docs:'https://api-docs.deepseek.com',
      privacy:'DeepSeek privacy policy',
      tagline:'Open-weight efficiency — strong reasoning at low cost.',
      base:'https://api.deepseek.com/v1', keyHint:'sk-••••••••••••••••',
      models:[ {id:'deepseek-chat', name:'DeepSeek Chat', note:'General purpose', ctx:'64K'},
               {id:'deepseek-reasoner', name:'DeepSeek Reasoner', note:'Chain-of-thought', ctx:'64K'} ] },
  ],
};

/* the reference's own usage figures and 14-day series */
/* `lastUsed` is the moment of the most recent request, in the same relative voice the reference
   prototype uses for its timestamps; the unconnected providers show an em dash, not "never" —
   nothing has been measured, which is the rule the other four cells already follow. */
AG_DATA.health  = { requestsToday:4820, avgLatency:1.24, errorRate:0.4, availability:99.96, lastUsed:'2 min ago' };
AG_DATA.volume  = [180,240,210,300,280,360,420,390,460,520,480,540,610,580];
AG_DATA.latency = [1.4,1.3,1.5,1.2,1.3,1.1,1.25,1.2,1.3,1.15,1.2,1.1,1.24,1.2];
AG_DATA.errors  = [3,2,5,1,0,2,1,4,1,0,1,2,1,0];

/* ⚠️ THE SVGs CARRY THEIR SIZE INLINE, and they must. Their 56px height used to come from
   `.agcht > svg` in the stylesheet; they now render inside `obs-table`'s SHADOW ROOT (the
   expanded row's `detail` is inner-HTMLed in there), where no page rule reaches them. With
   `preserveAspectRatio="none"` and no height, the chart stretched to hundreds of pixels —
   visible immediately in a screenshot, invisible in the markup.
   ⚠️ `class="agchart"` IS LOAD-BEARING, NOT DECORATION — no CSS reads it. The DS conformance
   checker derives an element's gap ARCHETYPE from its class/id
   (`/(chart|graph|topology|gauge|widget|heatmap|…)/`); unclassed these resolve to the generic
   `graphic`, which `--declare chart` does not cover, and the run fails with
   "⛔ CONTRACT BREACH · undeclared non-DS element" on a gap that was declared. */
/* ⚠️ SERIES COLOURS COME FROM THE CHART PALETTE, NEVER FROM A SEVERITY TOKEN. `Error trend` was
   drawn in `--severity-warning`, which is the token for a monitor or alert's severity LEVEL —
   on a data series it claims a state the chart is not reporting, and that metric was reading
   amber-for-alarm while trending DOWN 40%, i.e. improving. It is `--chart-amber` now: the
   palette's own amber, same visual character, none of the meaning.
   ⚠️ The first two charts BOTH used `--chart-indigo`, so a row of three unrelated metrics read
   as two-that-belong-together plus one. Each has its own hue now — indigo, aqua, amber.
   ⚠️ The DS ships 15 named series colours, each themed per mode, so none of this needs a
   literal. `--chart-vivid-teal` is deliberately avoided: it resolves to #14b8a6, this
   prototype's own accent, and a series painted in the product accent reads as chrome.
   ⚠️ These charts are the one declared `list_gaps` gap on this screen and carry `class="agchart"`,
   which is load-bearing — the conformance checker derives the archetype from that class. */
/* ⚠️ ONE RENDERER, THREE SHAPES, DRAWN TO THE DS's OWN RULES (3 Sep 2026). The registry ships no
   chart element — charts are Highcharts in the product and a declared gap here (`class="agchart"`
   stays, which is what the conformance checker keys on) — so what this draws is the product's
   chart CHROME from the tokens the `data-viz` family names: gridlines in `--neutral-lighter`,
   axis labels in `--neutral-light` at 11px, the baseline in `--border-color`, series from the
   chart palette (never `--primary`), markers punched back to the page surface. `agBars` /
   `agLine` — the axis-less bars and stroke this replaced — are gone, not parked: the shapes live
   on as `column` and `line` here.
   ⚠️ A FIXED viewBox THAT SCALES UNIFORMLY, not `preserveAspectRatio="none"`. The old plot had no
   text, so stretching it was free; an axis label stretched to a tile's aspect ratio is not a
   label any more. The tile is ~370px in a three-up detail, so the 400-unit box draws near 1:1.
   ⚠️ THE Y SCALE IS A "NICE" NUMBER (1 / 2 / 2.5 / 5 × 10ⁿ above the max) so the gridlines land
   on round values, which is what makes them readable as a scale rather than as decoration.
   ⚠️ X labels are real dates counted back from today — the window says "Last 14 days", and a
   date axis that said otherwise would be the tile contradicting its own header. Every third day
   plus the last, or fourteen labels collide at this width. */
const agFmtK = v => v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : String(Math.round(v));
const agFmtS = v => (Math.round(v * 10) / 10) + 's';
function agNice(max){
  const p = Math.pow(10, Math.floor(Math.log10(max || 1))), m = (max || 1) / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}
function agChart(kind, d, tok, fmt){
  const W = 400, H = 140, L = 38, R = 10, T = 10, B = 24, pw = W - L - R, ph = H - T - B;
  const top = agNice(Math.max(...d) * 1.08), ticks = 4;
  const y = v => T + ph - (v / top) * ph, f = n => n.toFixed(1);
  const n = d.length, slot = pw / n, xs = i => L + slot * i + slot / 2;
  const grid = [...Array(ticks + 1)].map((_, i) => { const v = top * i / ticks, yy = f(y(v));
    return `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="var(--neutral-lighter)" stroke-width="1"/>` +
           `<text x="${L - 7}" y="${f(y(v) + 3.5)}" text-anchor="end" font-size="11" fill="var(--neutral-light)">${fmt(v)}</text>`; }).join('');
  const day = 864e5, now = Date.now(), every = Math.ceil(n / 5);
  const labels = [...Array(n)].map((_, i) => {
    /* the last day always gets a label; a regular one that would land within a slot of it is
       dropped — at fourteen days the third-day cadence puts one on day 12, and "Sep 2" and
       "Sep 3" printed on top of each other. */
    if ((i % every && i !== n - 1) || (i !== n - 1 && n - 1 - i < every)) return '';
    const dt = new Date(now - (n - 1 - i) * day);
    return `<text x="${f(xs(i))}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--neutral-light)">${dt.toLocaleDateString('en-US', { month:'short', day:'numeric' })}</text>`; }).join('');
  let body = '';
  if (kind === 'column'){
    const bw = slot * 0.56;
    body = d.map((v, i) => `<rect x="${f(xs(i) - bw / 2)}" y="${f(y(v))}" width="${f(bw)}" height="${f(T + ph - y(v))}" rx="2" fill="var(${tok})"/>`).join('');
  } else {
    const pts = d.map((v, i) => `${f(xs(i))},${f(y(v))}`).join(' ');
    if (kind === 'area') body += `<polygon points="${f(xs(0))},${f(T + ph)} ${pts} ${f(xs(n - 1))},${f(T + ph)}" fill="var(${tok})" opacity=".14"/>`;
    body += `<polyline points="${pts}" fill="none" stroke="var(${tok})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    body += d.map((v, i) => `<circle cx="${f(xs(i))}" cy="${f(y(v))}" r="2.4" fill="var(--page-background-color)" stroke="var(${tok})" stroke-width="1.6"/>`).join('');
  }
  return `<svg class="agchart" viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;font-family:inherit" aria-hidden="true">` +
    grid + `<line x1="${L}" x2="${W - R}" y1="${f(T + ph)}" y2="${f(T + ph)}" stroke="var(--border-color)"/>` + body + labels + `</svg>`;
}

const agProv = id => AG_DATA.providers.find(p => p.id === id) || AG_DATA.providers[0];
const agProvByName = n => AG_DATA.providers.find(p => p.name === n);

/* the draft, one entry per provider so switching rails does not lose what you typed —
   including whether Advanced settings was left open and the result of the last test.
   ⚠️ THE REFERENCE'S ADVANCED DEFAULTS ARE PRE-FILLED (30 / 2 / 120), not empty placeholders:
   they are the values the connection actually uses if you never open the panel, and an empty
   box would imply "no timeout". */
AG.cfg = { pid:'openai', d:{}, run:0 };
AG_DATA.providers.forEach(p => { AG.cfg.d[p.id] = {
  step:0, name:'', key:'', adv:false, endpoint:'', proxy:'',
  timeout:'30', retries:'2', rate:'120', test:'idle', stage:0,
  model:p.models[0].id, perTask:false, routing:{}, consent:[false,false,false,false],
  terms:false /* Option 2's single terms & conditions box — see agTermsHTML */ }; });

/* ⚠️ THE CONNECTED PROVIDER OPENS ALREADY CONFIGURED (request, 1 Sep 2026: "add demo details").
   The page ships with `AG.active` true, so its detail has to describe a real connection —
   showing "Consent: not accepted" on a screen whose header says Active would be the page
   contradicting itself. This seeds the DRAFT for the connected provider, which is also what
   the Configure screen reads, so opening it shows the connection as it stands rather than an
   empty form. Everything here is the reference's own vocabulary; the key is masked and the
   endpoint is the provider default. */
/* ⚠️ DEFINED HERE, CALLED AT THE FOOT OF THE BLOCK. It reads `AG_TASKS`, which is a `const`
   declared further down — running it here put that in the temporal dead zone and the
   ReferenceError aborted the entire script, taking the whole screen with it. `const` is not
   hoisted; this file records the same trap for `DASH_PINS` / `waiIcon`. */
function agSeed(){
  const d = AG.cfg.d[AG.conn], p = agProv(AG.conn);
  if (!d || !p) return;
  d.name = p.name + ' production';
  d.key  = '••••••••••••4A2F';
  /* ⚠️ THE SEED DOES NOT MARK THE CONNECTION TESTED (request, 2 Sep 2026: "by default it is not
     shown — it will show [after] I click Run again"). It used to set `d.test = 'ok'`, so the
     credentials step OPENED already Verified, with the green success banner up and the button
     reading "Run again" — the whole test sequence had already happened before you arrived, and
     pressing the button replayed something the screen was already claiming. Now it opens
     untested: "Not tested" / "Run test" / no banner, and the loader → stages → success run is
     something you actually see happen.
     ⚠️ This is why a bug report of "clicking Run again shows the success message" could not be
     reproduced by tracing the click — the click was always correct; the SCREEN ARRIVED in the
     end state. When a flow cannot be reproduced, check what the state was before it started.
     ⚠️ `d.test` is read ONLY by the wizard (the credentials pane, the footer's Continue gate and
     its button label) — nothing on the Overview reads it, so the provider still shows as
     connected there and the usage table is unaffected. Checked before removing it.
     ⚠️ Option 4 has no `agSeed` at all, so it already behaved this way. */
  d.consent = [true, true, true, true];
  d.terms = true;   /* Option 2's terms box: accepted when this connection was made */
  d.perTask = true;
  /* a routing worth showing: the routine tasks moved onto the cheap fast model, the analytical
     ones left on the default — which is exactly what the per-task toggle is FOR.
     ⚠️ STATED AS A LIST, NOT MATCHED BY REGEX. This was `/4\.1$|opus|reasoner/` against the
     model IDS, and `gpt-4-1` does not end in "4.1" — the match failed silently, fell back to
     `models[0]`, and only LOOKED right because models[0] happens to be the flagship. A regex
     that never matches and a correct answer are indistinguishable on screen; the id list is
     not. Fast falls back to the LAST model (the cheapest by convention here), not the first. */
  const fast = (p.models.find(m => /mini|chat|sonnet/i.test(m.id)) || p.models[p.models.length - 1]).id;
  const routine = { 'alert-summary':1, runbook:1, knowledge:1, nlq:1 };
  AG_TASKS.forEach(t => { d.routing[t.id] = routine[t.id] ? fast : d.model; });
}

/* ⚠️ IT TAKES AN OPTIONAL PROVIDER so a grid row opens ITS OWN provider rather than whatever
   the rail last had. The toolbar button passes nothing and keeps the current selection. */
/* ⚠️ IT IS A SIDE DRAWER NOW, NOT A FULL PAGE (request, 2 Sep 2026: "when I click Configure AI
   provider the screen will show as a side popup like this", pointing at the Dashboard layout
   drawer). That is also what the DS prescribes — `get_layout(panels)` answers "drawer for
   create/edit", the single most-used overlay in the product (146 files).
   ⚠️ IT REUSES `.sdrawer`, THE PROTOTYPE'S OWN DRAWER, not `obs-drawer`. The DS element was
   tried for this very screen on 31 Aug and carries six recorded defects — it never emits its
   documented `close` event, an `open` attribute in markup does nothing, and replacing a slotted
   child re-runs its open animation. `.sdrawer` is what the reference screenshot actually shows,
   it was rebuilt against the DS in the 27 Aug pass, and it has none of those problems.
   ⚠️ `stFullOpen` IS NO LONGER USED HERE, so the Settings category list stays visible behind the
   drawer — which is the point of a drawer: the Overview you came from is still on screen.
   `agHelpShowTog` and `.agcfg.nohelp` remain unreferenced, as before. */
/* ⚠️ THE DRAWER STOPS AT THE RAIL'S EDGE — see the note at `#drawer-agcfg` in the stylesheet.
   ⚠️ IT READS `railWidth()`, WHICH READS THE TOKEN, NOT THE BOX. The rail animates its width, and
   this file's own recorded lesson is that a `getBoundingClientRect()` on it catches the
   transition mid-flight and parks whatever depends on it at the wrong number — the flyout bug.
   `railWidth()` already answers "how wide is the rail meant to be", including `body.pinned`
   (`--rail-w-open`), and the shell's padding trusts it for the same question.
   ⚠️ GUARDED: this block also loads in pages whose rail engine differs, so a missing
   `railWidth` leaves the CSS fallback in place rather than throwing on open. */
function agCfgSize(){
  const d = document.getElementById('drawer-agcfg'); if (!d) return;
  if (typeof railWidth !== 'function') return;
  /* ⚠️ OPTION 2 IS A SIDE PANEL, NOT THE FULL WIDTH (request, 16 Sep 2026, with the product's Create User drawer as the size
     reference): 684px — the product's own form-drawer width, the one the Compliance Policy drawer measured — and never
     wider than the room beside the rail */
  d.style.width = AG.opt === '2' ? Math.min(684, innerWidth - railWidth()) + 'px'
                                 : Math.max(720, innerWidth - railWidth()) + 'px';
}
window.addEventListener('resize', () => {
  const d = document.getElementById('drawer-agcfg');
  if (d && d.classList.contains('on')) agCfgSize();
});
function agConfig(pid){
  if (pid && AG.cfg.d[pid]) AG.cfg.pid = pid;
  const d = document.getElementById('drawer-agcfg');
  if (!d) return;
  /* ⚠️ THE BODY IS BUILT FOR ONE OPTION. agCfgPaint repaints only #agCfgMain once the body exists, so a drawer first opened
     on Option 2 (no rail, no help card) and reopened on Option 1 kept Option 2's frame. Clearing a body built for the
     other option sends agCfgPaint down its full-build branch. */
  const bd = document.getElementById('agCfgBody');
  if (bd && bd.dataset.agopt !== AG.opt) bd.innerHTML = '';
  d.classList.toggle('agcfgo2', AG.opt === '2');
  agCfgPaint();
  agCfgSize();
  document.body.classList.add('agdrawer');
  const sc = document.getElementById('agCfgScrim'); if (sc) sc.classList.add('on');
  d.classList.add('on');
  agCfgAfter();
}
/* ⚠️ ESCAPE CLOSES IT THROUGH `agCfgClose()`, AND THAT IS A BUG FIX, NOT A NEW SHORTCUT
   (3 Sep 2026, found while making the drawer full width). Escape already reached this drawer:
   the host page's own ladder matches `.sdrawer.on` and calls `closeOverlays()`, which strips
   `.on` from every drawer and clears `#scrim2` — but it knows nothing about THIS drawer's own
   `#agCfgScrim`, nor about `body.agdrawer`. So the panel slid away and left its blurred scrim
   over the page, blocking it, with the Overview never repainted. Latent since the drawer was
   built on 2 Sep; the full-width panel makes Escape the reflex, so it surfaces every time.
   ⚠️ CAPTURE PHASE + `stopPropagation()` — the ONLY way to be sure this runs instead of the
   host's rung, whatever order the two scripts registered in. Falling through would close the
   drawer twice, once correctly and once badly.
   ⚠️ NO `obs-select` GUARD. One was tried and is wrong twice over: the host has always closed
   this drawer on Escape from anywhere inside it, so exempting a dropdown would INVENT an
   inconsistency rather than remove one — and in bubble phase the guard could not have worked
   anyway, because the host's handler fires regardless of what this one decides. */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const dr = document.getElementById('drawer-agcfg');
  if (!dr || !dr.classList.contains('on')) return;
  e.stopPropagation();
  agCfgClose();
}, true);
function agCfgClose(){
  const d = document.getElementById('drawer-agcfg');
  if (d) d.classList.remove('on');
  const sc = document.getElementById('agCfgScrim'); if (sc) sc.classList.remove('on');
  document.body.classList.remove('agdrawer');
  /* the Overview behind it shows the connection state, so it has to catch up */
  if (typeof stMainPaint === 'function') stMainPaint();
}

/* ── the help card ────────────────────────────────────────────────────────────────────────
   Reference supplied 1 Sep 2026. Content is this flow's own — the prerequisites the connection
   actually has, the three steps this screen actually runs, and the data the consent step
   actually lists. ⚠️ IT MUST NOT DRIFT FROM THE FLOW: the steps below are `AG_FLOW` in prose
   and the transmitted list is `AG_SHARED`. If either changes, change this too. */
const AG_HELP = [
  { t:'Prerequisites', html:
    `<ul><li>An API key from the provider, on an account with billing enabled.</li>
      <li>Outbound HTTPS from the ObserveOps backend to the provider's endpoint — or to your own
        gateway, which you can set under <b>Advanced settings</b>.</li>
      <li>A user with Settings permission for Agentic AI.</li>
      <li><b>One provider is active at a time.</b> Connecting a new one disconnects the current
        connection and resets per-task routing to the new provider's models.</li></ul>` },
  { t:'Setup steps', html:
    `<ul><li><b>Credentials</b> — name the connection and paste the key. Test connection has to
        pass before you can continue.</li>
      <li><b>Model selection</b> — pick the default model, and optionally route individual AI
        tasks to different models.</li>
      <li><b>Data consent</b> — review what is transmitted and accept all four terms.</li></ul>` },
  { t:'Data handling', html:
    `<ul><li>Transmitted when AI features run: alerts, logs, metrics, traces, incident info,
        your prompts and the generated responses.</li>
      <li>Keys are encrypted with the deployment KMS and are never returned to the browser.</li>
      <li>ObserveOps does not control how a provider processes data once it has been
        transmitted — see that provider's privacy policy on the consent step.</li></ul>` },
];
/* the first section open, as the reference has it */
/* ⚠️ ALL THREE OPEN (request, 2 Sep 2026). It was `[true,false,false]` — the reference's own
   default — but that reference is a TALL narrow rail where three open sections would overflow.
   Here the column is ~900px and the three together measure ~520px, so collapsing two of them
   bought nothing and left two-thirds of the card empty while hiding content behind a click.
   ⚠️ `agHelpTog` still works, so they can each be folded away; this only changes what you
   arrive to. */
AG.helpOpen = [true, true, true];
AG.helpShow = true;

function agHelpHTML(){
  return `<div class="aghelp" id="agHelp">
    <div class="aghct"><span class="bar"></span><span class="t">Agentic AI Help Card</span></div>
    ${AG_HELP.map((s, i) => `<div class="aghs${AG.helpOpen[i] ? ' on' : ''}">
      <button class="aghch" onclick="agHelpTog(${i})" aria-expanded="${AG.helpOpen[i]}">
        ${stEsc(s.t)}${agIc('chevron-down', 14)}</button>
      ${AG.helpOpen[i] ? `<div class="aghcb">${s.html}</div>` : ''}
    </div>`).join('')}
  </div>`;
}
/* ⚠️ REPAINT THE HELP COLUMN ONLY. Rewriting the screen would destroy `obs-side-menu` and
   orphan its `select` listener — the same rule the form pane follows.
   ⚠️ A RAW `<button>` FIRES ONCE, so this needs no `agTap` guard; that guard exists for
   `obs-button`, which fires a consumer's onclick twice (see the note at `agTap`). */
function agHelpTog(i){
  AG.helpOpen[i] = !AG.helpOpen[i];
  const el = document.getElementById('agHelp');
  if (el) el.outerHTML = agHelpHTML(); else agCfgPaint();
}
/* the settings head's own (i) toggles the column — `stFullOpen`'s `info` is what reveals that
   button, so the affordance is the module's, not a new control. ⚠️ IT TOGGLES A CLASS rather
   than re-rendering: adding/removing the column by repaint would take the rail with it. */
function agHelpShowTog(){
  AG.helpShow = !AG.helpShow;
  const w = document.querySelector('.agcfg');
  if (w) w.classList.toggle('nohelp', !AG.helpShow);
}

function agCfgHTML(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  /* ⚠️ A DIFFERENT ICON PER ROW, AND NONE OF THEM IS A BRAND MARK (annotation, 1 Sep 2026:
     "it is all icon is same make to use different icon"). All three wore `sparkling-star`,
     which said "an AI provider" three times and let the label do all the work.
     ⚠️ THE DS SHIPS NO PROVIDER LOGO — `resolve_logo('openai')` returns nothing and answers
     "Do NOT hand-draw a brand mark" — so these are not logos. Each is taken from that
     provider's OWN tagline, which is on screen two lines away, so the glyph is a reading of
     the row rather than an arbitrary pick:
       OpenAI    `eye`          — "broad reasoning, fast summaries, VISION"
       Anthropic `book-open`    — "LONG-CONTEXT analysis and careful reasoning"
       DeepSeek  `thunder-bolt` — "open-weight EFFICIENCY, strong reasoning at low cost"
     ⚠️ THE ICON LIVES ON THE PROVIDER RECORD (`ic`), not in this map — one source of truth, so
     a fourth provider brings its own and nothing here has to change. All three names were
     checked against `list_icons` (553 glyphs); never hand-draw one. */
  const items = AG_DATA.providers.map(x => ({ label:x.name, icon:x.ic }));

  const sec = (label, req, help, control) => `<div class="agfs">
    <div class="agfl">${stEsc(label)}${req ? '<span class="req">*</span>' : ''}</div>
    <div class="agfd">${stEsc(help)}</div>
    <div class="agfc">${control}</div></div>`;

  /* ⚠️ `#agPage` IS ON THIS SCREEN TOO, and it has to be: the scoped DS token block is
     `#agPage{…}`, so anything rendered outside that id gets none of the palette. The Overview
     and this page never coexist — `stMainPaint` swaps one for the other. */
  /* ⚠️ `.agcfgsp` is the drawer's 24px top gutter for the RAIL, in the side menu's own `logo`
     slot so the panel and its right rule stay full height while the rows start lower (3 Sep 2026:
     "the line is attached"). Sized only under `#drawer-agcfg` — see that rule in the CSS. */
  const o2 = AG.opt === '2';
  return `<div class="agpage agcfg" id="agPage">
    ${o2 ? '' : `<div class="agcfgn">
      <obs-side-menu id="agCfgNav" mode="categories" search="false"
        active="${stEsc(p.name)}" items="${agJ(items)}"><div slot="logo" class="agcfgsp"></div></obs-side-menu>
    </div>`}
    <div class="agcfgm" id="agCfgMain">${agCfgFormHTML()}</div>
    ${/* ⚠️ OPTION 2 HAS NO HELP CARD (request, 16 Sep 2026) — the form column takes the width */ AG.opt === '2' ? '' : agHelpHTML()}
  </div>`;
}

/* the RIGHT PANE only — see `agCfgPick` for why this is separate from `agCfgHTML` */
/* ── THE FLOW ─────────────────────────────────────────────────────────────────────────────
   Read off the reference prototype's own wizard (`Motadata Agentic AI (1) (1).html`, decoded
   from its `__bundler/template` + manifest — its five steps are provider → credentials with a
   live test → models → consent → success) and rebuilt on the DS.
   ⚠️ THE REFERENCE'S STEP 1 IS OUR RAIL. It picks the provider in the wizard; here the left
   `obs-side-menu` does, so the flow in this pane is the remaining FOUR. That is why the
   stepper reads three items and not five.
   ⚠️ `Done` IS NOT A STEP ROW — the same call as the cleared build's rail (request, 1 Sep
   2026: "there are 4 type of configuration so in the 4 step will be show"). The success screen
   is what happens after the configuration, not a fourth thing to configure. `active` is set
   PAST the end on that screen, and `obs-steps` derives every step before `active` to `finish`,
   so all three read ✓ — the same mechanism, and the reason not to clamp it. */
const AG_FLOW = ['Credentials','Model selection','Data consent'];
/* the reference's own four test stages, verbatim */
const AG_STAGES = ['Resolving provider endpoint','Authenticating API key',
                   'Negotiating TLS 1.3 session','Listing available models'];
/* the reference's own consent terms, verbatim */
const AG_CONSENT = [
  'I understand that selected observability data may be sent to the configured AI provider.',
  "I have reviewed my organization's data governance requirements.",
  "I accept the provider's privacy and data processing terms.",
  'I am authorized to enable AI processing for my organization.',
];
const AG_SHARED = ['Alerts','Logs','Metrics','Traces','Incident info','User prompts','Generated responses'];
/* the reference's seven AI tasks, for per-task model routing */
const AG_TASKS = [
  { id:'alert-summary', label:'Alert summarization',      ic:'bell' },
  { id:'incident',      label:'Incident analysis',        ic:'exclamation-triangle' },
  { id:'rca',           label:'Root cause analysis',      ic:'sitemap' },
  { id:'log-invest',    label:'Log investigation',        ic:'search' },
  { id:'runbook',       label:'Runbook recommendations',  ic:'layer-group' },
  { id:'knowledge',     label:'Knowledge search',         ic:'globe' },
  { id:'nlq',           label:'Natural language queries', ic:'cpu' },
];

function agCfgFormHTML(){
  const d = AG.cfg.d[AG.cfg.pid];
  /* ⚠️ ONE FORM, NO STEPPER (request, 2 Sep 2026: "remove the number of step and all fields
     will be shown by default"). The three stages are stacked and everything is on screen at
     once; each keeps its own `<h2 class="agcfgh">` heading, so what were step titles are now
     section headings — Enter credentials · Model selection · Review data sharing.
     ⚠️ THE GATES ARE UNCHANGED, only the navigation is gone. `agFlowFootHTML` still requires a
     PASSING test and all four consent boxes before the one primary is enabled — the wizard was
     never what enforced that, it only spread it over three screens.
     ⚠️ `d.step` SURVIVES AS THE DONE FLAG, not as a position: `> 2` renders the completion
     screen. Keeping it is what lets `agCfgSave` and the done state work untouched.
     ⚠️ `agCfgGo` / `agCfgBack` / `agCfgNext` and `AG_FLOW` are KEPT AND UNREFERENCED (the house
     pattern) — the wizard is one `flow` line away if it is ever wanted back. `agCfgBind` still
     guards on `#agFlow` existing, so it is inert rather than broken. */
  /* ⚠️ OPTION 2 IS CREDENTIALS ONLY (request, 16 Sep 2026: "remove Advanced settings, Model selection and the review of
     data sharing terms"). The provider keeps its default model (d.model, the first listed), and the footer's gate drops
     the consent half it can no longer show — see agFlowFootHTML. */
  const body = d.step > 2 ? agStepDone()
             : AG.opt === '2' ? agProvPickHTML() + agStepCreds() + agTermsHTML() + agTestHTML()
             : agStepCreds() + agStepModels() + agStepConsent() + agTestHTML();
  /* ⚠️ `size` IS THE DEFAULT 32px, NOT `small` (annotation ×3, 1 Sep 2026: "improve this" on
     each of the three steps). It shipped as `size="small"`, and the registry's own `size`
     rule rules that out in as many words — useWhen: "small (24px) for a dense side rail (the
     compliance form) or a tight space; default (32px) for a top-of-form wizard bar", dontUse:
     "small on a spacious horizontal wizard (the markers look cramped)". This IS the spacious
     top-of-form horizontal wizard that sentence describes: measured 720px of rail for three
     steps, with ~190px of bare connector line between each pair, and 24px markers sitting in
     it. `small` is for the VERTICAL compliance rail, which is where the 24px number came from.
     ⚠️ Nothing else about the stepper is off-spec — `direction` (horizontal), `variant`
     (number), `fill` (solid), `connector` (line), `completed` (primary), `clickable` and
     `status` were each checked against the registry's usage cards and all are the prescribed
     choice for a top-of-form wizard whose completed steps are safe to revisit. Size was the
     one documented `dontUse` being violated, so it is the one thing changed. */
  const flow = '';
  /* ⚠️ THE FOOTER SITS OUTSIDE `.agform` ON PURPOSE (request, 2 Sep 2026: "the line is full and
     the button will be show on helpcard devider line"). `.agform` is capped at 720px because
     that is a readable measure for FIELDS; the footer is the screen's ACTION BAR, so it spans
     the whole pane and its rule runs all the way to the help card's own divider. `.agcfgm` is
     the flex column, `.agform` takes the slack (`flex:1 1 auto`) and `.agff` sits at the
     bottom — which is what keeps the footer clear of the variant pill. */
  return `<div class="agform">${flow}<div class="agfbody">${body}</div></div>${agFlowFootHTML()}`;
}

/* ══ OPTION 2 · THE PROVIDER PICKER AND THE TERMS BOX (16 Sep 2026) ════════════════════════════════════════════════
   The provider rail became a SEGMENTED control at the top of the form (request: "the sidebar will be shown like
   [Browser Default | Light | Dark]") — obs-radio as-button, the same control the header's Option switch and the
   License window switch use. It sits INSIDE #agCfgMain, so every pane paint rebuilds it: agCfgBind rebinds its custom
   change event and sets its value PROPERTY as a string (obs-radio compares strictly — the recorded licRadioSync lesson).
   Below the fields, ONE checkbox with terms & conditions text and links (request: "below all fields show a checkbox and
   terms & condition related text with link"). It stands in for the four consent terms Option 2 removed, so it gates
   Enable AI with the test (agFlowFootHTML). The text is a sibling of the obs-checkbox, not its label: a link inside the
   component's <label> would tick the box when clicked. Ticking repaints the FOOTER only (the agCfgConsent discipline). */
function agProvPickHTML(){
  const opts = AG_DATA.providers.map(x => ({ value:x.id, label:x.name }));
  return `<div class="agfprov"><span class="agflb">AI provider</span>
    <obs-radio id="agCfgProv" as-button options="${agJ(opts)}" value="${stEsc(AG.cfg.pid)}"></obs-radio></div>`;
}
function agTermsHTML(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  /* ⚠️ ONE LINK, NOT TWO (request, 16 Sep 2026: "you have 2 links, make it a single link and improve the text"). It carried
     both the Terms & Conditions and the provider's privacy policy, so a single sentence asked the reader to visit two places
     before ticking one box. The sentence now says what ticking it DOES — data leaves for this provider — and the one link
     is the terms that govern it. It also fits on one line at 684px, which is what lets the box align to its own text. */
  return `<div class="agterms">
    <obs-checkbox id="agTerms"${d.terms ? ' checked' : ''} onchange="agCfgTerms(agDet(event))"></obs-checkbox>
    <span>I agree to sending selected observability data to ${stEsc(p.name)} under the <obs-link external href="https://docs.motadata.com/motadata-aiops-docs/" onclick="return false">Terms &amp; Conditions${agIc('external-link', 12)}</obs-link>.</span>
  </div>`;
}
function agCfgTerms(v){ AG.cfg.d[AG.cfg.pid].terms = !!v; agCfgFootPaint(); }

/* ── 1 · credentials ───────────────────────────────────────────────────────────────────── */
function agStepCreds(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  const v = x => stEsc(x == null ? '' : String(x));
  /* ⚠️ A FIELD WITH A TOOLTIP RENDERS ITS OWN LABEL. `obs-input`'s `label` prop draws the label
     INSIDE the component's shadow root, and the shipped 0.1.166 element exposes no slot and no
     ::part — so there is no way to put anything after that text. The reference (supplied 2 Sep
     2026) puts the ⓘ immediately after the label, next to the required *, so for those fields the
     label moves OUT and `.agflb` reproduces the component's own `.lbl` rule verbatim
     (`font-size:var(--text-sm,.8rem); line-height:1.5; color:var(--text-color-common-secondary)`,
     read from its shadow CSS). Fields with no tooltip keep the component's own label, and the two
     are asserted to render at the same size, colour and offset.
     ⚠️ Every field in the Advanced panel takes a tooltip, so the two label mechanisms never mix
     inside one visual group. */
  const fld = (k, label, extra, tip) => {
    const inp = `<obs-input block${tip ? '' : ` label="${label}"`}${extra || ''}
      value="${v(d[k])}" oninput="agCfgIn('${k}', agDet(event))"></obs-input>`;
    return !tip ? inp : `<div class="agfld"><span class="agflb">${label}<obs-tooltip
      class="agtip" placement="top-start">${stEsc(tip)}</obs-tooltip></span>${inp}</div>`;
  };

  /* ⚠️ "(optional)" IS GONE FROM THE LABELS — the DS marks the opposite. `obs-input`'s own
     `label` note is "a red required * is appended when `required`", and this form already uses
     that on API key, so an unmarked label ALREADY means optional. Saying it twice, in two
     conventions, made the two longest labels here longer still.
     ⚠️ THE UNITS STAY IN THE LABEL, AND THAT IS A WORKAROUND, NOT A CHOICE. The registry's
     `addonBefore/addonAfter` rule is explicit that an attached fixed segment is where a unit
     belongs ("protocol/unit"), and `prefix/suffix` covers a unit inside the field — but the
     shipped 0.1.166 element renders NO `<slot>` of any name (recorded in `_ds/README.md`), so
     neither is reachable from outside. `(s)` and `(req/min)` therefore remain parenthetical.
     ⚠️ `help` IS the DS's supporting-text slot and it DOES work (added in elements@0.1.10) —
     it carries what "(optional)" was weakly implying, which is what each field is actually for.
     ⚠️ `allow-clear` on the two text fields, per its usage rule: "an optional field/search where
     clearing to empty is valid". The three numeric ones are not cleared to empty — they have
     working defaults — so they do not get it. */
  /* ⚠️ THE BOX IS ALWAYS RENDERED; ONLY ITS BODY IS CONDITIONAL. The toggle is the section's
     header now, so the section has to exist for it to sit in — `!d.adv` used to return '' and
     take the box away with the fields. */
  const adv = `<div class="agadv${d.adv ? ' on' : ''}">
      <obs-button class="agadvb" variant="default" onclick="agTap(agCfgAdv)">
        ${agIc('chevron-down', 13)}Advanced settings</obs-button>
      ${!d.adv ? '' : `<div class="agadvbd">
      <div class="agrow2">
        ${fld('endpoint','Custom endpoint URL',' allow-clear placeholder="https://gateway.internal/v1"',
              'Send requests to your own gateway instead of the provider\'s endpoint. Leave empty to use the provider directly.')}
        ${fld('proxy','Proxy',' allow-clear placeholder="http://proxy.corp:8080"',
              'Route outbound traffic through a corporate proxy. Leave empty for a direct connection.')}
      </div>
      <div class="agrow3">
        ${fld('timeout','Request timeout (s)',' type="number"',
              'How long to wait for a reply before the request is abandoned, in seconds.')}
        ${fld('retries','Retry attempts',' type="number"',
              'How many times a failed request is retried before the connection is reported as failed.')}
        ${fld('rate','Rate limit (req/min)',' type="number"',
              'The most requests ObserveOps will send in a minute. Keep it under your provider plan\'s limit.')}
      </div></div>`}</div>`;

  /* the reference runs four named stages rather than a spinner — the wait says what it is
     doing, and each line resolves to a ✓ as it lands.
     ⚠️ THE RUNNING STAGE IS MARKED (`.now`). Every not-yet-done stage drew the same empty ring,
     so while the test ran you could not tell which one was in flight from the two that had not
     started — the four lines said "something is happening" and nothing more. */
  /* ⚠️ THE WHOLE TEST PANEL IS ABSENT AT REST (request, 2 Sep 2026: "remove this — show only
     when I click Run test"). The credentials step is now just the two fields and Advanced
     settings; the panel materialises on the first run and then stays, carrying the progress line
     and the result. THE FOOTER'S "Run test" IS WHAT STARTS IT — that button, added an hour
     earlier, is the reason this can be removed at all: without it the only way to run a test
     would have gone with the panel.
     ⚠️ This is the end of three successive removals from the same block — the "Not tested" tag,
     then the hint line, then the panel itself. Each was the same observation: at rest it reported
     that nothing had happened yet. The tag and the button label therefore no longer need an
     `idle` case at all, and the maps here are `busy`/`ok` only.
     ⚠️ `st` IS STILL COMPUTED FOR IDLE, and must be — the footer's own button label and the
     Continue gate both read it. */
  const st = d.test === 'ok' ? 'ok' : d.test === 'busy' ? 'busy' : 'idle';
  const stages = st !== 'busy' ? ''
    : `<div class="agstgl"><span class="stspin"></span><span class="t">${
        stEsc(AG_STAGES[Math.min(d.stage, AG_STAGES.length - 1)])}\u2026</span></div>`;
  /* ⚠️ THE OUTCOME IS AN `obs-banner`, THE HINT IS NOT. The result used to be a fifth row in
     exactly the shape of the four stages above it — same tick, same size, differing only in
     text colour — so the one line that reports the ANSWER read as one more step. `obs-banner`
     variant=success is the catalogued component for "a positive inline confirmation that should
     persist on the surface" (its registry's own words), and it is a different object from a
     stage row. The idle line stays plain muted text on purpose: it is a form HINT, not a state,
     and a tinted block before you have done anything is heavier than what it says. */
  /* ⚠️ NO `title` ON THE SUCCESS BANNER (request, 2 Sep 2026: "the icon and success message will
     be shown in a single line"). `.bn` is `display:flex` with the icon and the body as siblings,
     so a title occupies the body's first line and the message falls to a second one, leaving the
     ✓ aligned to the title and nothing beside it. With no title the body is just the message and
     the two share one line — and nothing is lost, because the green ✓ and the success colour
     already say "verified", which is all the title said.
     ⚠️ THE TITLE WAS ALSO BEING EATEN BY THIS PAGE'S TOOLTIP ENGINE. `tipFor()` adopts any
     `title=` into `data-tip` and DELETES the attribute on first hover — the trap already recorded
     for `obs-drawer` — so the heading vanished the moment the pointer crossed it, leaving an
     EMPTY title element still holding that first line. That is why the ✓ sat alone above the
     text. The engine is now guarded against `obs-*` elements (see `tipFor` in the page), so the
     consent step's warning banner keeps its own title. */
  const note = st === 'ok'
    ? `<obs-banner variant="success" class="agbanok">${
        stEsc(p.name)} is reachable with this key. Continue to pick the models it should use.</obs-banner>`
    : '';
  /* ⚠️ NOTHING AT REST (request, 2 Sep 2026: "remove this"). The idle body was a hint —
     "Enter your API key, then run a test to verify the connection before continuing" — and it
     went with the "Not tested" tag removed the same hour, for the same reason: it narrated a
     state the panel already showed. The two fields are directly above it, the button says
     "Run test", and the footer's Continue is visibly gated until one passes, so the sentence
     was restating three things already on screen. At rest the panel is now its title and the
     button; the body appears only when there is something to report — the running line, then
     the result banner.
     ⚠️ `.agtn` is NOT dead: the footer's KMS caption still uses it (as `.sp agtn`). */

  /* ⚠️ OPTION 2 SHOWS NEITHER THE HEADING NOR THE HELPER LINE (request, 16 Sep 2026: "remove this").
     On a form of three things — pick a provider, name it, paste a key — a section heading names a
     section that has no sibling to be told apart from, and the sentence under it restated the
     provider already selected in the segmented control directly above.
     ⚠️ CONSEQUENCE, STATED: with this line gone AND the footer's KMS caption removed the hour
     before, Option 2's drawer now says NOTHING about where the key goes. Option 1 carries both. */
  const head = AG.opt === '2' ? '' : `<h2 class="agcfgh">Enter credentials</h2>
    <p class="agcfgp">Connecting <b>${stEsc(p.name)}</b>. Your key is encrypted server-side and never shown again in full.</p>`;
  /* ⚠️ OPTION 2 STATES THE ONE-AT-A-TIME RULE UNDER THE FIELDS (request, 16 Sep 2026: "show the
     message — at a time I config a single AI provider, and when I config another the old one will be
     removed — show as a note"). It is the rule `agCfgSave` enforces, so the form has to say it
     BEFORE you fill it in, not afterwards in a toast.
     ⚠️ IT NAMES THE PROVIDER IT WILL REPLACE, because that is the part that costs you something —
     a generic sentence would not tell you which key you are about to lose. Re-configuring the
     provider that is already active replaces nothing, so it gets the plain rule instead.
     ⚠️ `obs-banner variant="info"` IS THE DS's OWN INLINE HINT (its `usageRules.info`), and its
     `title` carries the lead-in with the detail in the slot — the component's own `do` rule, which
     the consent banner's note records being got wrong once already. */
  const other = AG.active && AG.conn && AG.conn !== p.id ? agProv(AG.conn) : null;
  const onlyOne = AG.opt !== '2' ? '' : `<obs-banner class="agnote" variant="info" title="One provider at a time">${
    other
      ? `Saving this connection replaces <b>${stEsc(other.name)}</b> — its connection is removed and its key is not kept.`
      : `Only one AI provider is connected at a time. Configuring another later replaces this one.`
  }</obs-banner>`;
  return `${head}
    <div class="agrow2">
      ${fld('name','Connection name',` placeholder="${stEsc(p.name)} production"`)}
      ${fld('key','API key',` required type="password" placeholder="${stEsc(p.keyHint)}"`)}
    </div>
    ${onlyOne}
    ${AG.opt === '2' ? '' : adv}`;
}
/* ⚠️ THE TEST OUTPUT RENDERS AT THE END OF THE FORM, NOT UNDER THE CREDENTIALS FIELDS (request,
   2 Sep 2026). It used to close `agStepCreds`, which was right while that was step 1 of a wizard
   and the Run test button sat directly beneath it. Two changes since moved the button away: the
   wizard was flattened into one long form, and Run test moved into the pinned footer. So the
   control was at the bottom of the screen and its result appeared ~950px above it — off screen
   entirely once you had scrolled to reach the button. The output now sits immediately above the
   footer that triggers it.
   ⚠️ IT IS ITS OWN FUNCTION so that only ONE place decides what the test shows. `agStepCreds`
   still owns the fields; this owns the result; `agCfgFormHTML` puts them in order. */
function agTestHTML(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  const st = d.test === 'ok' ? 'ok' : d.test === 'busy' ? 'busy' : 'idle';
  if (st === 'idle') return '';
  if (st === 'ok') return `<obs-banner variant="success" class="agbanok">${
    stEsc(p.name)} is reachable with this key.${AG.opt === '2' ? '' : ' Continue to pick the models it should use.'}</obs-banner>`;
  return `<div class="agtest">
      <div class="agth">${agIc('plug', 15)}<span class="t">Test connection</span>
        <obs-tag variant="tag-yellow">Testing</obs-tag></div>
      <div class="agstgl"><span class="stspin"></span><span class="t">${
        stEsc(AG_STAGES[Math.min(d.stage, AG_STAGES.length - 1)])}\u2026</span></div>
    </div>`;
}

/* ── 2 · model selection ───────────────────────────────────────────────────────────────── */
function agStepModels(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  /* ⚠️ THE MODEL'S NOTE AND CONTEXT WINDOW ARE FOLDED INTO THE LABEL. The reference draws each
     model as a card with a title, a description and a `128K ctx` chip; `obs-radio` accepts only
     {value,label,disabled} and ESCAPES the label (a known 0.1.166 defect, in `_ds/README.md`),
     so a rich card is not reachable. Folding keeps every fact rather than dropping two. */
  const opts = p.models.map(m => ({ value:m.id, label:`${m.name} — ${m.note} — ${m.ctx} context` }));
  const rows = !d.perTask ? '' : `<div class="agrtw">` + AG_TASKS.map(t => `<div class="agrt">
      <span class="n">${agIc(t.ic, 14)}<span class="t">${stEsc(t.label)}</span></span>
      <obs-select value="${stEsc(d.routing[t.id] || d.model)}"
        options="${agJ(p.models.map(m => ({ key:m.id, label:m.name })))}"
        onchange="agCfgRoute('${t.id}', agDet(event))"></obs-select></div>`).join('') + `</div>`;

  return `<h2 class="agcfgh">Model selection</h2>
    <p class="agcfgp">Pick a default model for <b>${stEsc(p.name)}</b>. Optionally route individual workflows to different models.</p>
    <div class="agsub">Default model</div>
    <obs-radio vertical value="${stEsc(d.model)}" options="${agJ(opts)}"
      onchange="agCfgIn('model', agDet(event))"></obs-radio>
    <div class="agpanel">
      <div class="agph">
        <div class="agphl">${agIc('sitemap', 17)}
          <div><div class="agpt">Use different models for different AI tasks</div>
            <div class="agpd">Route high-stakes work to a stronger model and routine summaries to a faster one.</div></div></div>
        <obs-switch${d.perTask ? ' checked' : ''} onchange="agCfgPerTask(agDet(event))"></obs-switch>
      </div>${rows}</div>`;
}

/* ── 3 · data consent ──────────────────────────────────────────────────────────────────── */
function agStepConsent(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  /* ⚠️ THE BANNER'S TITLE IS THE LEAD-IN AND ITS BODY IS THE DETAIL — the component's own `do`
     rule ("keep the message short; put a lead-in in `title` and the detail in the slot"). It said
     the same thing twice: the title read "AI features transmit observability data to a third
     party" and the body opened "When AI features are used, selected observability data may be
     transmitted to <provider> for processing". That restatement cost a third line on the biggest,
     loudest block of a screen whose whole point is the four checkboxes under it. The body now
     carries only the part the title cannot say.
     ⚠️ THE COUNT LINE EXISTS BECAUSE THE GATE WAS SILENT. `agFlowFootHTML` disables "Accept &
     enable AI" until `consent.every(Boolean)` and nothing on screen said so — a disabled primary
     with no reason beside it is the dead end the Designer's Guide forbids. It reports live, so
     three of four tells you what is left.
     ⚠️ NEITHER NOTE MAY BE WRITTEN AS AN HTML COMMENT INSIDE THE TEMPLATE BELOW. Both carry
     backticks around code names, and a backtick inside a template literal ENDS it — `node --check`
     reported "Unexpected token 'do'" hundreds of characters away. Prose about this file's code
     belongs in a JS comment, outside the string. */
  /* ⚠️ ONE PANEL, NOT TWO (request, 2 Sep 2026: "improve this section"). The section rendered a
     banner and then TWO `.agpanel` boxes — what is transmitted, and what you must accept — so it
     carried three stacked blocks where Credentials and Model selection each carry one, and read
     as the heaviest of the three sections purely by container count. They are one panel now, cut
     by a hairline: the evidence above it, the decision below it. That is the same `.agpf`
     hairline the privacy link already used, doing the job it was written for.
     ⚠️ THE PRIVACY LINK LOST ITS OWN RULE (`.agpll`, not `.agpf`). It belongs to "what is
     transmitted" — it is where you go to read how the provider handles it — so a rule above it
     was separating it from the thing it explains, and left two hairlines in one short panel. */
  return `<h2 class="agcfgh">Review data sharing &amp; processing terms</h2>
    <obs-banner variant="warning" class="agbanwarn"
      title="Enabling AI sends observability data to ${stEsc(p.name)}">ObserveOps cannot control how a
      third-party provider stores or processes that data once it has been transmitted.</obs-banner>
    <div class="agpanel">
      <div class="agpt">Data that may be transmitted</div>
      <div class="agchips" style="margin-top:12px">${AG_SHARED.map(x => `<obs-tag variant="tag-primary">${stEsc(x)}</obs-tag>`).join('')}</div>
      <div class="agpll"><obs-link external href="${stEsc(p.docs)}" onclick="return false">${stEsc(p.privacy)}${agIc('external-link', 12)}</obs-link></div>
      <div class="agpf">
        <div class="agpt">Confirm to continue</div>
        <div class="agpd" id="agConsN">${agConsText()}</div>
        <div class="agcons" style="margin-top:12px">${
        AG_CONSENT.map((c, i) => `<obs-checkbox${d.consent[i] ? ' checked' : ''}
          onchange="agCfgConsent(${i}, agDet(event))">${stEsc(c)}</obs-checkbox>`).join('')
      }</div>
      </div>
    </div>`;
}

/* ── 4 · done ──────────────────────────────────────────────────────────────────────────── */
function agStepDone(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  const model = (p.models.find(m => m.id === d.model) || p.models[0]).name;
  /* ⚠️ `status` ON A ROW RENDERS AN `obs-tag`, which is what a STATE deserves; a provider name
     and a model id are values you read, so they stay plain. Tagging all five would make the
     tag mean nothing. */
  const summary = [
    { label:'Provider',          value:p.name },
    { label:'Default model',     value:model },
    { label:'Connection status', status:'Healthy' },
    { label:'Per-task routing',  value:d.perTask ? 'Enabled' : 'Default only' },
    { label:'Consent',           status:'Accepted' },
  ].filter(r => AG.opt !== '2' || (r.label !== 'Per-task routing' && r.label !== 'Consent'))   /* not on Option 2's form */
   .concat(AG.opt === '2' ? [{ label:'Terms & conditions', status:'Accepted' }] : []);
  return `<div class="agdone">
    <span class="agdmk">${agIc('check-circle', 30)}</span>
    <h2 class="agdt">Setup completed successfully</h2>
    <p class="agdp">${stEsc(p.name)} is connected and ready. AI-powered workflows can now use your configured models.</p>
    <div class="agsum agpanel"><obs-key-value columns="1" variant="plain" items="${agJ(summary)}"></obs-key-value></div>
  </div>`;
}

/* ── the flow footer ───────────────────────────────────────────────────────────────────── */
/* ⚠️ EACH GATE IS THE REFERENCE'S OWN: Continue off the credentials step needs a SUCCESSFUL
   test (`canCredsNext = test.status === "success"`), and the consent step needs all four boxes
   (`allConsent = consent.every(Boolean)`). Neither is invented, and neither silently passes. */
function agFlowFootHTML(){
  const d = AG.cfg.d[AG.cfg.pid];
  /* ⚠️ ONE PRIMARY, BOTH GATES ON IT. With the wizard flattened there is no Back and no
     Continue; `Accept & enable AI` is enabled only when the connection test has PASSED and all
     four consent boxes are ticked — exactly the two conditions the three-step footer enforced
     one at a time. The consent panel's own live count says how many remain, so a disabled
     primary is never unexplained. */
  const back = '';
  const dis = ok => ok ? '' : ' disabled';
  const next = d.step > 2
    ? `<obs-button variant="primary" onclick="agTap(agCfgSave)">Start using AI features</obs-button>`
    /* ⚠️ OPTION 2 GATES ON THE TEST ALONE and does not say "Accept": the consent terms are not on its form, so requiring
       them would disable the button for every unseeded provider with nothing on screen to tick, and "Accept" would name
       terms nobody was shown */
    /* ⚠️ NO GLYPH, AND IT READS "Save" (request, 16 Sep 2026). The shield said "this is about security", which is
       the terms line's job two rows up; and "Enable AI" named a capability while the button's actual effect is to
       store this provider's connection — which is what the Overview then shows. Option 1's own primary is untouched. */
    : AG.opt === '2'
    ? `<obs-button variant="primary"${dis(d.test === 'ok' && d.terms)}
         onclick="agTap(agCfgDone)">Save</obs-button>`
    : `<obs-button variant="primary"${dis(d.test === 'ok' && d.consent.every(Boolean))}
         onclick="agTap(agCfgDone)">${agIc('shield-check', 13)}Accept &amp; enable AI</obs-button>`;
  /* ⚠️ THE KMS CAPTION IS THE CREDENTIALS STEP'S, NOT THE FLOW'S. It rendered on all four
     steps, so "Keys are encrypted with the deployment KMS · never sent to the browser" sat under
     "Setup completed successfully" — a sentence about a field two steps back, on a screen with no
     field on it. The empty `.sp` stays because `.agff .sp{margin-right:auto}` is what pushes
     Back/Continue to the right edge; drop the span and the buttons slide to the left. */
  /* ⚠️ OPTION 2 SHOWS NO KMS CAPTION (request, 16 Sep 2026: "remove the text"). Its form already says where the key
     goes — "Your key is encrypted server-side and never shown again in full" sits under the Enter credentials heading —
     so the footer was repeating it under a button. Option 1 keeps the caption; its form has no such line.
     ⚠️ THE EMPTY `.sp` SPAN STAYS EITHER WAY: `.agff .sp{margin-right:auto}` is what pushes the buttons to the right
     edge, and dropping the span slides them back to the middle of the footer. */
  const note = d.step === 0 && AG.opt !== '2'
    ? `<span class="sp agtn">${agIc('lock-alt', 13)}Keys are encrypted with the deployment KMS · never sent to the browser</span>`
    : `<span class="sp"></span>`;
  /* ⚠️ THE TEST BUTTON IS IN THE FOOTER TOO (request, 2 Sep 2026: "add test button after
     Continue"), AND ONLY ON THE CREDENTIALS STEP. It earns its place: `next` above disables
     Continue until `d.test === 'ok'`, so on this step the footer shows a blocked primary and,
     without this, nothing beside it to unblock with — the one control that clears the gate was
     up in the panel, out of reach of where you are trying to act.
     ⚠️ `variant="default"`, NOT primary — Continue is the step's one main action and the DS's
     Button rule allows a single primary per group; two filled buttons side by side would make
     the row say there are two ways forward.
     ⚠️ Its LABEL TRACKS THE SAME THREE STATES as the panel's (Run test / Testing… / Run again),
     read from the same `d.test`, so the two can never disagree about whether a test has run.
     ⚠️ IT SITS BEFORE CONTINUE (request, 2 Sep 2026: "swap"). It was added after Continue the
     hour before, in those words, which put the secondary to the RIGHT of the primary — the
     reverse of this footer's own Back-then-Continue order. Swapping restores that: the row now
     reads secondary, then the one main action last, which is also where Back-then-Continue puts
     it on every other step. Don't move it back without re-reading both requests. */
  const tst = d.step !== 0 ? '' :
    `<obs-button variant="default"${d.test === 'busy' ? ' disabled' : ''} onclick="agTap(agCfgTest)">${
      d.test === 'ok' ? 'Run again' : d.test === 'busy' ? 'Testing\u2026' : 'Run test'}</obs-button>`;
  return `<div class="agff" id="agFlowFoot">
    ${note}
    ${back}${tst}${next}</div>`;
}
/* ⚠️ TICKING A CONSENT BOX REPAINTS THE FOOTER, NOT THE PANE. The only thing a tick changes is
   whether Accept is gated — and a full `agCfgPaint()` destroys and rebuilds all four
   checkboxes, throwing away the focus of the one you just clicked and (because the DS elements
   render on their own tick) leaving a moment where the next one is not yet interactive. The
   same discipline as repainting the pane instead of the whole screen, one level finer. */
function agCfgFootPaint(){
  const f = document.getElementById('agFlowFoot');
  if (f) f.outerHTML = agFlowFootHTML(); else agCfgPaint();
}

/* the one place the flattened form advances: to the completion screen */
/* ⚠️ OPTION 2's SAVE COMMITS AND CLOSES — IT NEVER OPENS THE DONE STEP (request, 16 Sep 2026:
   "when I click Save, remove [the Setup completed page] — show the main grid screen").
   The done step is a wizard ending: it recaps Provider / Default model / Connection status /
   Terms, then asks you to press "Start using AI features" to actually commit. On a three-field
   form whose own button already says Save, that is a second commit for one decision, and every
   fact it recaps is on the grid it hands you back to. So Save goes straight through `agCfgSave`,
   which is the function that was doing the real work all along.
   ⚠️ OPTION 1 STILL STEPS TO IT. Its form carries model routing and four consent terms, so a
   recap before committing is worth the extra press — and the step is where its own primary
   ("Accept & enable AI") has always led. `agStepDone` is NOT unreferenced. */
function agCfgDone(){
  if (AG.opt === '2') return agCfgSave();
  const d = AG.cfg.d[AG.cfg.pid]; d.step = 3; agCfgPaint();
}
function agCfgNext(){ const d = AG.cfg.d[AG.cfg.pid]; d.step = Math.min(3, d.step + 1); agCfgPaint(); }
function agCfgBack(){ const d = AG.cfg.d[AG.cfg.pid]; d.step = Math.max(0, d.step - 1); agCfgPaint(); }
/* obs-steps `clickable` leaves future steps inert; this guards the same rule again */
function agCfgGo(n){ const d = AG.cfg.d[AG.cfg.pid]; if (n > d.step) return; d.step = n; agCfgPaint(); }
function agCfgPerTask(v){ const d = AG.cfg.d[AG.cfg.pid]; d.perTask = !!v;
  AG_TASKS.forEach(t => { if (!d.routing[t.id]) d.routing[t.id] = d.model; }); agCfgPaint(); }
function agCfgRoute(id, v){ AG.cfg.d[AG.cfg.pid].routing[id] = v; }
function agConsText(){
  const d = AG.cfg.d[AG.cfg.pid], n = d.consent.filter(Boolean).length;
  return n === AG_CONSENT.length
    ? `All ${AG_CONSENT.length} accepted \u2014 you can enable AI features.`
    : `${n} of ${AG_CONSENT.length} accepted \u2014 all are required before AI features can be enabled.`;
}
/* ⚠️ WRITES ONE NODE'S TEXT, NEVER REPAINTS THE PANE — the same discipline as `agCfgFootPaint`
   below, and for the same reason: rebuilding the pane destroys all four `obs-checkbox`es and
   throws away the focus of the one just clicked. */
function agConsPaint(){ const el = document.getElementById('agConsN'); if (el) el.textContent = agConsText(); }
function agCfgConsent(i, v){ AG.cfg.d[AG.cfg.pid].consent[i] = !!v; agConsPaint(); agCfgFootPaint(); }

function agCfgAdv(){ AG.cfg.d[AG.cfg.pid].adv = !AG.cfg.d[AG.cfg.pid].adv; agCfgPaint(); }

/* ⚠️ `select` IS A CUSTOM EVENT — an inline `onselect=` attribute is inert markup, the trap
   that shipped green in the cleared build because the probe called the handler directly. It
   has to be `addEventListener`, and `after()` is the only place the node exists. */
function agCfgAfter(){
  const nav = document.getElementById('agCfgNav');
  if (nav && !nav._agBound){
    nav._agBound = 1;
    nav.addEventListener('select', e => { const v = agDet(e); agCfgPick(v && v.label ? v.label : v); });
  }
  agCfgBind();
}

/* ⚠️ REPAINT THE RIGHT PANE ONLY — never the whole screen. `stMainPaint()` would rewrite
   `#stMain.innerHTML` and destroy `obs-side-menu`, so the rail would re-render (replaying its
   own transitions) and the listener above would need rebinding on every click. The component
   already moves its own highlight internally; `active` is set so a later full paint agrees. */
function agCfgPick(name){
  const p = agProvByName(name); if (!p || p.id === AG.cfg.pid) return;
  AG.cfg.run++;                       /* abandon a test still running for the old provider */
  AG.cfg.pid = p.id;
  agCfgPaint();
  const nav = document.getElementById('agCfgNav');
  if (nav) nav.setAttribute('active', p.name);
}
/* ⚠️ THE RIGHT PANE ONLY — every repaint on this screen goes through here. Rewriting
   `#stMain` would destroy `obs-side-menu` and orphan its `select` listener. */
/* ⚠️ THE DRAWER'S BODY IS THE PAINT TARGET NOW. `#agCfgMain` is still the inner node that gets
   rewritten on every state change — the same discipline as before, so the provider rail and the
   drawer chrome are never destroyed mid-interaction. The first paint has to build the whole
   body, which is what the `#agCfgBody` branch does. */
function agCfgPaint(){
  const main = document.getElementById('agCfgMain');
  if (main){ main.innerHTML = agCfgFormHTML(); agCfgBind(); return; }
  const body = document.getElementById('agCfgBody');
  if (body){ body.innerHTML = agCfgHTML(); body.dataset.agopt = AG.opt; agCfgAfter(); return; }
  stMainPaint();
}
/* ⚠️ THE STEPPER IS REBOUND ON EVERY PAINT, and the rail is NOT. `obs-steps` lives inside the
   pane this function replaces, so its node is destroyed each time and a listener bound once
   would be lost; `obs-side-menu` lives outside it and is bound once in `agCfgAfter`. Both are
   CUSTOM events (`change` / `select`) — an `on<name>=` attribute for either is inert markup. */
function agCfgBind(){
  const pv = document.getElementById('agCfgProv');
  if (pv && !pv._agBound){
    pv._agBound = 1;
    pv.addEventListener('change', e => { const v = String((e && Array.isArray(e.detail)) ? e.detail[0] : (e && e.detail));
      const x = agProv(v); if (x) agCfgPick(x.name); });
  }
  if (pv) pv.value = String(AG.cfg.pid);
  const st = document.getElementById('agFlow');
  if (st && !st._agBound){ st._agBound = 1; st.addEventListener('change', e => agCfgGo(agDet(e))); }
}

function agCfgIn(field, v){ AG.cfg.d[AG.cfg.pid][field] = String(v == null ? '' : v); }

/* ⚠️ THE RUN TOKEN IS THE `agClose()` LESSON. A test left running when you switch provider —
   or leave the screen — would otherwise land its result in a pane that is now showing
   something else. `agCfgPick` and `stFullClose` both bump it, and the callback checks it. */
function agCfgTest(){
  const p = agProv(AG.cfg.pid), d = AG.cfg.d[p.id];
  if (!d.key.trim()) return toast('Enter an API key for ' + p.name + ' first');
  const run = ++AG.cfg.run, pid = p.id;
  d.test = 'busy'; d.stage = 0; agCfgPaint();
  /* the reference walks its four stages at 520ms each; each tick checks the run token, so a
     test abandoned by switching provider or leaving cannot tick into someone else's pane */
  AG_STAGES.forEach((_, i) => setTimeout(() => {
    if (AG.cfg.run !== run || AG.cfg.pid !== pid) return;
    AG.cfg.d[pid].stage = i + 1; agCfgPaint();
  }, (i + 1) * 520));
  setTimeout(() => {
    if (AG.cfg.run !== run || AG.cfg.pid !== pid) return;
    AG.cfg.d[pid].test = 'ok'; agCfgPaint();
  }, AG_STAGES.length * 520 + 160);
}
function agCfgSave(){
  const p = agProv(AG.cfg.pid);
  if (!AG.cfg.d[p.id].key.trim()) return toast('Enter an API key for ' + p.name + ' first');
  /* ⚠️ SWITCHING PROVIDER REMOVES THE OLD CONNECTION (request, 16 Sep 2026: "at a time I use a
     single provider — when I switch to another the old AI provider will be removed"). Only one is
     active at a time, so the one being replaced is wiped back to an unconfigured draft: its name,
     key, terms and test result go, which is what makes its grid row a Config button rather than a
     provider that merely lost a badge while quietly keeping your key.
     ⚠️ IT RUNS BEFORE `AG.conn` MOVES, or it would clear the provider just connected. */
  if (AG.active && AG.conn && AG.conn !== p.id){
    const old = AG.cfg.d[AG.conn];
    if (old) Object.assign(old, { name:'', key:'', terms:false, test:'idle', stage:0, step:0 });
  }
  AG.active = true; AG.conn = p.id; AG.cfg.run++;
  /* ⚠️ `agCfgClose`, NOT `stFullClose` — and that was a live bug, not a tidy-up. This screen was a
     full page until 2 Sep 2026 and has been a drawer ever since; `stFullClose` returns early unless
     `ST.full` is set, so on BOTH options pressing the final button committed the connection and left
     the drawer standing open over the page it had just changed. `agCfgClose` drops the panel, its
     scrim and the body class, and repaints the Overview so the grid shows the new state. */
  agCfgClose();
  toast(p.name + ' connected — AI features are live');
}

/* ⚠️ THE `after` HOOK IS BACK (16 Sep 2026) — for the Option 1 / Option 2 switcher only, agOvAfter below, defined BEFORE the
   ST_PAGES line that names it. The history: it existed to `addEventListener` the provider grid's custom
   `cellaction` / `rowaction`; the usage grid is read-only and emits neither, so the hook went
   with it. Naming a function that no longer exists here is not a silent no-op — `stMainPaint`
   guards `pg.after`, but the object literal evaluates the identifier and throws a
   ReferenceError that aborts the whole block. Re-add both together or neither. */
/* ══ OPTION 2 · THE CONNECTED PROVIDER, NOT A GRID (16 Sep 2026) ══════════════════════════════════════════════════
   One panel: who is connected (the provider's glyph, name, tagline and a Connected tag), how it is connected
   (obs-key-value — connection name, default model, endpoint, the masked key, last usage), how it is doing
   (availability sits with the details) and the three 14-day trend widgets — requests, latency, errors — the grid's
   expanded row carried (agUseWidgetsHTML, the same markup). Every figure comes from AG_DATA.health and AG.cfg, the
   records Option 1 reads, so the two options cannot disagree.
   ⚠️ NOTHING CONNECTED → A PLAIN LINE, not an empty panel of dashes: usage for a connection that does not exist would
   be an invention (the rule the Overview has always followed). */
/* ⚠️ OPTION 2's OVERVIEW IS A TWO-COLUMN GRID (request, 16 Sep 2026: "remove [the connection panel]
   and show the grid — 2 columns: 1. AI provider  2. Status (up/down)").
   ⚠️ THIS REVERSES THE 16 Sep "remove the grid and show only which AI I integrated" — the SAME DAY,
   and deliberately. What comes back is not what went: that grid was six columns of usage figures on
   three rows, two of them em dashes; this is the two the request names. Do not restore the six-column
   one on the strength of the older note, and do not restore the panel on the strength of this one.
   ⚠️ `agConnHTML` (the panel) IS KEPT AND UNREFERENCED, the house pattern — one call away.
   `agUseWidgetsHTML` is NOT unreferenced: Option 1's expanded row still draws the same three charts.
   ⚠️ "DOWN" HERE MEANS NOT CONNECTED, and that is a reading of the request, not the product's own
   word for it — only one provider is active at a time, so the other two are unconfigured rather than
   unreachable. `up` / `down` are what was asked for and they are real keys in the DS status map
   (`up:tag-green`, `down:tag-red`, read out of the bundle); a third "Not configured" state would be
   more honest and is one entry in `agGridRows` away. Say so rather than let it be discovered.
   ⚠️ NO SEARCH BOX. It went with the six-column grid and was not asked back; three rows do not
   need one, and the toolbar's own note records that a search over nothing is a dead control. */
/* ⚠️ ONE PROVIDER IS ACTIVE AT A TIME, SO THE COLUMN CARRIES TWO DIFFERENT THINGS (request,
   16 Sep 2026: "the status column will be convert — at a time I use a single provider … the column
   will show the active status and another show a Config button"). The connected provider gets an
   **Active** tag; the other two get a **Config** button that opens the drawer on themselves.
   ⚠️ THIS REPLACES Up / Down, the morning's own reading, and it is a better one: nothing was ever
   *down* — the other two are simply not configured, which is what the earlier note flagged as the
   honest third state. The button says so and gives you the way to change it in the same cell.
   ⚠️ IT TAKES TWO COLUMNS BECAUSE A CELL HAS ONE TYPE. `obs-table`'s cell types are
   heat / bar / severity / dot / status / type / tags / sparkline / switch / icon / link / button —
   there is no `html`, so one column cannot be a tag on one row and a button on the next. The action
   column carries no title, which is the product's own idiom for a trailing per-row control (the
   License grid's History button does exactly this), so the two read as one region.
   ⚠️ `tags`, NOT `status`, FOR THE TAG — measured, not assumed: an empty `status` cell still paints
   a blank grey chip, while `tags` with `[]` renders nothing at all. An empty `button` cell paints a
   16×24 empty button, which is why the sheet the corner-radius hook already adopts into obs-table
   hides it (`.cell-btn:empty`); Chrome's `:empty` does match it (probed — its two child nodes are
   empty text/comment anchors). */
const AG_GRID_COLS = [
  { key:'provider', title:'AI provider', width:'70%' },
  /* ⚠️ THE COLUMN IS CALLED "Connection" (the name was left to me, 16 Sep 2026). It is not a
     Status column any more: one cell says which provider IS the connection and the other two offer
     to make one, so a word that covers both beats "Status" over a row of buttons. "Action" would
     name only half of it. */
  { key:'conn',     title:'Connection',  type:'button', width:'30%' },
];
const agGridRows = () => AG_DATA.providers.map(p => {
  const on = AG.active && p.id === AG.conn;
  return {
    id: p.id,
    provider: p.name,
    conn: on ? { label:'Active', variant:'agactive' } : { label:'Configure', variant:'default' },
  };
});
function agGridHTML(){
  return `<obs-table id="agGrid" row-key="id" header-style="tinted" empty-text="No records available"
    columns="${agJ(AG_GRID_COLS)}" rows="${agJ(agGridRows())}"></obs-table>`;
}
/* ⚠️ `cellaction` IS A CUSTOM EVENT NAME, so an inline `oncellaction=` is inert markup — it has to
   be bound with addEventListener, from the page's `after` hook, on every repaint (the table is
   rebuilt each time). The same contract the License grid's History button uses. */
function agGridBind(){
  const tb = document.getElementById('agGrid');
  if (!tb) return;
  tb.addEventListener('cellaction', e => {
    const d = (e && Array.isArray(e.detail)) ? e.detail[0] : (e && e.detail);
    /* the Active cell is inert (pointer-events:none), so this cannot fire on it — the guard is
       belt and braces, because a keyboard could still reach a <button> element */
    if (d && d.key === 'conn' && d.id && d.id !== AG.conn) agConfig(d.id);
  });
}

function agConnHTML(){
  const p = AG.active ? agProv(AG.conn) : null;
  if (!p) return `<div class="agpanel agcon agcon0">No AI provider is connected yet. Use <b>Configure AI provider</b> to connect one — only one is active at a time.</div>`;
  const d = AG.cfg.d[p.id] || {}, h = AG_DATA.health;
  const model = (p.models.find(m => m.id === d.model) || p.models[0]).name;
  const key = d.key ? '\u2022\u2022\u2022\u2022' + String(d.key).slice(-4) : '\u2014';
  const facts = [
    { label:'Connection name', value:d.name || p.name },
    { label:'Default model',   value:model },
    { label:'Endpoint',        value:d.endpoint || p.base },
    { label:'API key',         value:key },
    { label:'Availability',    value:h.availability + '%' },
    { label:'Last usage',      value:h.lastUsed },
  ];
  /* ⚠️ NO obs-metric-list: it renders one figure PER ROW (its registry's vertical-value layout), which put four lines of
     mostly empty width under the details — and three of the four (requests, latency, error rate) are already the headline
     figure of the trend widget below. Availability, the one the widgets do not carry, moved into the key-value. */
  return `<div class="agpanel agcon">
    <div class="agconh">
      <span class="agconi">${agIc(p.ic, 20)}</span>
      <div class="agcont"><div class="agconn"><b>${stEsc(p.name)}</b><obs-tag variant="tag-green">Connected</obs-tag></div>
        <p>${stEsc(p.tagline)}</p></div>
    </div>
    <obs-key-value columns="3" variant="plain" items="${agJ(facts)}"></obs-key-value>
    ${agUseWidgetsHTML()}
  </div>`;
}

agSeed();   /* see the note at `agSeed` — it must run after AG_TASKS is initialised */
/* the Option 1 / Option 2 switcher — the only thing the hook binds (see AG_OPTS). It REPAINTS the page, like the License
   page's switcher: the two options may render different markup, and nothing is mid-edit on the overview.
   ⚠️ obs-radio compares values strictly and honours the value PROPERTY only as a string — set it after render
   (the recorded licRadioSync lesson), or the selected segment does not show. */
function agOvAfter(){
  agGridBind();   /* Option 2's grid; a no-op on Option 1, which renders no #agGrid */
  const op = document.getElementById('agOpt');
  if (!op) return;
  op.addEventListener('change', e => {
    const v = String((e && Array.isArray(e.detail)) ? e.detail[0] : (e && e.detail));
    if (v && v !== AG.opt && AG_OPTS.some(o => o.value === v)){ AG.opt = v; stMainPaint(); }
  });
  op.value = String(AG.opt);
}
ST_PAGES['Agentic AI › Overview'] = { html: agOvHTML, after: agOvAfter };


/* ═══════════════════════════════════════════════════════════════════════════════════════
   PRODUCT LICENSE  —  Settings › My Account › License, built on the ObserveOps design system
   (7 Sep 2026). Read off live build 10.0.1 at /settings/my-account/license — the DOM, the
   computed styles, the Vue components (LicenseDetails · LicenseQuotaUsageTab · LicenseQuotaRow
   · LicenseHistoryModal · ActivationCodeModal · LicenseEpsTab) and their handlers out of the
   settings chunk — and the ObserveOps License Guide
   (docs.motadata.com/observeops-docs/getting-started/license-guide), whose per-module metering
   rules are the detail text under each quota row.

   The FLOW is the live one; EVERY PART is a DS element (7 Sep 2026, second pass — the first
   build still composed the edition card, the row detail, the legend and the code box from raw
   spans, which is exactly what the contract calls a reproduction. Nothing here is drawn any more
   except the two line charts):
   · header         obs-page-header — heading, the licence status as an obs-tag in the `title`
                    slot, Export (default) · Upgrade Now (primary)
   · overview       three DS WIDGETS (obs-toolbar variant="widget" + body): Edition (the name,
                    obs-tags, the guide's line, obs-key-value for License Type · Account) ·
                    Validity (obs-metric-list for days left, a one-row obs-table whose `bar` cell
                    is the term elapsed) · Support & renewal (obs-links from the License Guide's
                    Support & Contact, an obs-button into the Activation Code modal)
   · two tabs       obs-tabs — License & Quota Usage | EPS Trend Breakdown (icons as live)
   · section heads  obs-toolbar (grid variant): the title in `start`, the hint and the control after
   · quota usage    obs-table — link · text · bar · sparkline · status · button cells, EXPANDABLE
                    rows; the DETAIL is DS too: obs-banner (info) for the metering rule, obs-key-value
                    for the agentless/agent (or monolith/agent) split, and a NESTED obs-table whose `bar`
                    cells carry the by-type share; obs-radio as-button for the 7d / 15d / 30d window
   · history        the house drawer (stcDrOpen): the token as an obs-tag · obs-radio range ·
                    obs-metric-list for the five figures · a line chart against the licence cap ·
                    obs-button Close · Export as CSV (a real file, the live's own columns)
   · Upgrade Now    obs-modal "Activation Code" — a read-only labelled obs-input carrying the current
                    code + an obs-button copy, obs-link mailto, an obs-input textarea (`block`),
                    obs-button Cancel · Activate License
   · EPS tab        two widget tiles (obs-toolbar variant="widget" + obs-metric-list / obs-key-value)
                    · obs-table with bar cells (allocation by signal) · a legend of obs-tags ·
                    five widget tiles, each obs-toolbar (title + window/avg/peak/util tags) over
                    obs-metric-list (the live figure) over a line chart dashed at the allocation

   ⚠️ THE ONE DECLARED data-viz GAP LEFT: the line charts (history · the five EPS tiles). The DS
   ships no chart element, `list_gaps` says so, and they carry class="licchart" so the conformance
   checker resolves the archetype; every colour in them is a token. The days-left ring, the term
   bar and the by-type stacked bar of the first build are GONE — each had a DS answer (a metric
   row, the record's dates, a table with bar cells), so a gap was not the honest call.

   ⚠️ DELIBERATE DIFFERENCES FROM LIVE, recorded so nothing here is mistaken for the product:
   · the live rows are bespoke CARDS (a 3px accent border, a 12px meter, a Highcharts sparkline
     in the corner); here they are obs-table rows — the DS has no "card row with a meter", and
     the table has every cell type the row needs. The breakdowns moved into the expandable
     detail, which is also where the docs' metering rule now lives;
   · the live edition HERO (gradient "Infinity ∞", a ring, a term bar, four meta cells) is a row
     of three DS widgets — the ring became a metric row, the term bar a `bar` cell, the meta cells
     key-value rows. It was a key-value card beside a metric list ("very bad ui"), then the
     header's detail-meta strip ("also bad ui"), both the same day — recorded so neither is tried
     a third time;
   · history opens in a DRAWER, not the live's 720px modal. The DS panel guide files drill-down
     detail under the drawer ("~90% deep drill-downs") and keeps the modal for confirm/collect —
     which is exactly what the Activation Code dialog is, so THAT one stays a modal, as live;
   · the ACCENT is the prototype's teal (`--primary` re-pointed to #14b8a6 / #0e8578 inside the
     License scope, request 8 Sep 2026) — the active tab, the range segment, the bar cells, links,
     the primary buttons and the ∞ glyph; the DS navy stays everywhere else on the site;
   · the status reads "Active" — the label the DS status map gives the "active" key — where live
     prints "Activated"; the per-type colours of the live stacked bar are gone with it (the DS
     bar cell paints in the product's own ink);
   · Export prints (the browser's own PDF writer, the stcExport rule) where live snapshots the
     page to an image with html2canvas;
   · the EPS figures are SEEDED — the instance is idle and every live counter there reads 0, so
     charts drawn from it would have nothing to say. The licence and quota figures are the
     instance's own (170 of 5,000 devices, +15 over 30 days, 1 NCCM device, 2 RUM apps …).
   ⚠️ `licVal(e)` UNWRAPS obs-* EVENT PAYLOADS. `agDet` tests `detail.length`, which is also
   true of a plain STRING payload and would hand back its first character — obs-input's `input`
   detail is `[value]` today, but the guard costs nothing.
   ═══════════════════════════════════════════════════════════════════════════════════════ */
const LIC = { tab:'usage', range:30, hist:null, hrange:30, code:'', busy:false, drw:null, opt:'1', ovDemo:null, ovAction:null, act4:false };
/* the two design options for this screen. ⚠️ REVIEW CHROME, like `Setting/`'s Scale switcher —
   it exists so both designs can be compared in one build and goes when one is picked. */
/* ⚠️ OPTION 3 IS OUT OF THE SWITCHER (request, 14 Sep 2026: "remove option 3"). The labels of the rest
   were NOT renumbered — every request and note in this file names them Option 4 and Option 5, and a
   renumber would silently repoint all of them. Option 3's builders (`licOvHTML`, `lic3TileHTML`,
   `lic3CardsHTML`, `licOvDemo`) are kept and unreferenced; one entry here brings it back. */
const LIC_OPTS = [{ value:'1', label:'Option 1' }, { value:'2', label:'Option 2' },
                  { value:'4', label:'Option 4' }, { value:'5', label:'Option 5' }];
/* ⚠️ STRING VALUES, AND THE SELECTION IS SET AS A PROPERTY. obs-radio compares option values
   strictly against `value`, and it honours the `value` PROPERTY only as a string: numeric options
   never matched ("30" !== 30) and a numeric property never matched either, so the segment control
   showed NO selected segment at rest — invisible for a day because the DS navy fill on the dark
   canvas was faint anyway. Measured 8 Sep 2026: string options + `el.value = '30'` selects;
   every other combination does not. The change event still hands back the option's value, so the
   readers coerce with `+`. */
const LIC_RANGES = [{ value:'7', label:'7d' }, { value:'15', label:'15d' }, { value:'30', label:'30d' }];
function licRadioSync(id, v){ const el = document.getElementById(id); if (el) el.value = String(v); }
/* ⚠️ THE FIRST TAB IS "License & Quota Usage" IN EVERY OPTION AGAIN (14 Sep 2026). It read
   "License" in Option 2 while that option carried no quota at all; its Monitored devices card
   puts quota usage back on the tab, so the full name is true there once more. */
/* ⚠️ THE TABS CARRY NO ICONS, IN EVERY OPTION (request, 15 Sep 2026: "remove the icon in all option").
   They were `tacho-meter` / `heart-rate`; obs-tabs renders a glyph only when an item has `icon`, so
   dropping the field is the whole change. */
const LIC_TABS_EPS = { key:'eps', label:'EPS Trend Breakdown' };
const licTabs = () => [{ key:'usage', label:'License & Quota Usage' }, LIC_TABS_EPS];

const LIC_DATA = {
  edition: { name:'Infinity', chip:'Unified Edition',
    blurb:'One edition for the full-stack observability platform.',
    blurb2:'devices for the base, add-on modules metered by their own unit.' },
  /* the instance's own licence: a Free edition issued 17 Jul 2026, expiring 17 Aug 2030 */
  license: { type:'Free', issued:'2026-07-17', expires:'2030-08-17', account:'Motadata',
    status:'active', code:'OBSV-INF-2026-7K2Q-M4XD-9RTA-B5CE-U8HW' },
  /* the six entitlements, in the live order. ⚠️ THE FIVE ADD-ONS CARRY DEMO USAGE, 10 EACH (request, 15 Sep 2026: "add demo
     data like the Log card will show 10 of 100 in every card") — the instance reads 0 / 0 / 1 / 0 / 2, which left most
     rings empty. Totals, deltas and Monitored Devices are still the live figures. This is shared data, so every option's
     cards and the History drawer/modal show it. `delta` is the change over
     the 30-day window the live sparkline reported; `rule` is the License Guide's metering note;
     `trend` marks the two whose history the live plots WITHOUT a cap line (its `trendType`) */
  quotas: [
    { key:'device', title:'Monitored Devices', token:'DEV · base platform', icon:'server', tok:'--chart-indigo',
      used:170, total:5000, unit:'devices', delta:15,
      rule:'Per provisioned entity — one license per network device, server, VM, application, database, storage, WAN link or NetRoute; one per two wireless access points. Interfaces, processes and services are not licensed, and an entity monitored both agentlessly and by agent counts once.',
      sub:[{ label:'Agentless (SNMP / API / WMI)', value:170 }, { label:'Agent-based', value:0, note:'Installed agent' }],
      deploy:[{ label:'Cloud', value:86 }, { label:'Servers', value:28 },
              { label:'Network Devices', value:14 }, { label:'Virtualization', value:6 },
              { label:'HCI', value:2 }, { label:'Other', value:1 }, { label:'Database', value:1 }] },
    { key:'flow', title:'Flow Sources', token:'FSRC · add-on', icon:'flow', tok:'--chart-emerald-green',
      used:10, total:100, unit:'exporters', delta:0, trend:true,
      rule:'Per flow source — one license per unique flow exporter. Several flow protocols or interfaces from one exporter count as one source; metering is by exporter count, not flows per second or data volume.' },
    { key:'log', title:'Log Sources', token:'LSRC · add-on', icon:'log', tok:'--chart-neon-purple',
      used:10, total:100, unit:'sources', delta:0, trend:true,
      rule:'Per log source — one license per unique log-emitting source (hostname, IP, agent id or application id). Several log types or files from one source count as one source; metering is by source count, not data volume.' },
    { key:'nccm', title:'NCCM Managed Devices', token:'NDEV · add-on', icon:'ncm', tok:'--chart-hot-pink',
      used:10, total:100, unit:'devices', delta:0,
      rule:'Per managed network device — one license per device under configuration and firmware management, counted independently of whether the device is also a monitored entity.' },
    { key:'apm', title:'APM Instrumented Units', token:'APP · AGT · add-on', icon:'apm', tok:'--chart-amber',
      used:10, total:52, unit:'units', delta:0,
      rule:'Per instrumented application instance for a monolith, per APM agent for microservices — one agent covers every service on its node or cluster.',
      sub:[{ label:'Applications (monolith)', value:10, of:52 }, { label:'Agents (microservices)', value:0, of:0 }] },
    { key:'rum', title:'RUM Front-end Apps', token:'FEA · add-on', icon:'rum', tok:'--chart-aqua',
      used:10, total:50, unit:'apps', delta:0,
      rule:'Per instrumented front-end application — one license per unique instrumented web or mobile front-end application.' },
  ],
  /* the EPS tab. The hardware ceiling and the per-signal allocations are the instance's; the
     live ingest is seeded (see the header note) */
  eps: { ceiling:765,
    notify:'On a telemetry threshold breach an admin is alerted — nothing is dropped.',
    drop:'At 100% sustained for 60 s, excess events are shed to protect ingestion.',
    signals:[ { key:'log',  label:'Log',  icon:'log',  tok:'--chart-neon-purple',  alloc:314, live:212 },
              { key:'flow', label:'Flow', icon:'flow', tok:'--chart-emerald-green', alloc:152, live:98 },
              { key:'apm',  label:'APM',  icon:'apm',  tok:'--chart-amber',        alloc:266, live:140 },
              { key:'rum',  label:'RUM',  icon:'rum',  tok:'--chart-aqua',         alloc:219, live:61 } ] },
};

/* ── helpers ────────────────────────────────────────────────────────────────────────────── */
const licVal  = e => (e && Array.isArray(e.detail)) ? e.detail[0] : (e && e.detail);
const licFmt  = n => Number(n || 0).toLocaleString('en-US');
/* a compact total for the small Option 4 rings: 5,000 → "5k", 1,500 → "1.5k"; under 1,000 unchanged */
const licK    = n => { n = Number(n || 0); return n >= 1000 ? (Math.round(n / 100) / 10).toString().replace(/\.0$/, '') + 'k' : licFmt(n); };
const licDate = (d, o) => d.toLocaleDateString('en-US', o);
const licLong = d => licDate(d, { month:'long', day:'numeric', year:'numeric' });            /* August 17, 2030 */
const licFull = d => licDate(d, { weekday:'short', month:'short', day:'2-digit', year:'numeric' }); /* Sat, Aug 08, 2026 */
const licMed  = d => licDate(d, { month:'short', day:'numeric', year:'numeric' });                 /* Aug 17, 2030 — the widget table's cell is ~120px */
const licMY   = d => licDate(d, { month:'short', year:'numeric' });                          /* Jul 2026 */
const licToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const licQuota = k => LIC_DATA.quotas.find(q => q.key === k);
/* a finer "nice" ceiling than agNice's 1 / 2 / 2.5 / 5 / 10 — those steps took a 951 eps
   allocation to a 2,000 axis and a 5,000 cap to 10,000, squashing the line into the bottom
   quarter. Round values still land on the gridlines; the headroom is just smaller. */
function licNice(max){
  const p = Math.pow(10, Math.floor(Math.log10(max || 1))), m = (max || 1) / p;
  return ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => m <= x) || 10) * p;
}
/* its own PRNG — `rng()` is Option 1's and this file is loaded by more than one page */
function licRng(seed){ let s = (seed % 2147483647) || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* daily consumption over the window, ending at the row's CURRENT figure. Deterministic per
   row + window, so a repaint never redraws a different history; the 30-day change is the
   instance's own (+15 devices) and a shorter window takes a proportional share of it. */
function licSeries(q, days){
  const r = licRng(q.key.length * 7919 + days * 131 + q.used * 17 + 1);
  const delta = Math.round((q.delta || 0) * days / 30), start = Math.max(0, q.used - delta);
  const w = [...Array(days)].map(() => 0.35 + r()), tot = w.reduce((a, b) => a + b, 0);
  let carried = 0; const out = [start];
  for (let i = 0; i < days; i++){ carried += delta * w[i] / tot; out.push(Math.min(q.used, start + Math.round(carried))); }
  out[days] = q.used;
  return out;
}
function licStats(q, s){
  const avg = Math.round(s.reduce((a, b) => a + b, 0) / s.length);
  return { current:q.used, start:s[0], peak:Math.max(...s), avg, change:q.used - s[0] };
}
/* the DS status map has no "watch" level, so a row is healthy until it is over its allotment */
const licLevel = q => (q.total && q.used >= q.total) ? 'critical' : 'healthy';

/* ── the page ───────────────────────────────────────────────────────────────────────────── */
/* ⚠️ THE OPTIONS THAT RENDER OPTION 5's EPS TAB (request, 15 Sep 2026: "the Option 5 'EPS Trend Breakdown' tab — all data,
   copy and add in Option 4"). One list read by the slot AND by the Highcharts mount, so a second option cannot get the
   markup without its charts. It is the same builder, not a copy, so the two tabs cannot drift. Options 1 and 2 keep
   licEpsHTML. */
const LIC_EPS5 = ['4', '5'];
function licHTML(){
  return `<div class="licpage" id="licPage">${licHeadHTML()}
    <div class="lictabs"><obs-tabs id="licTabs" tabs="${agJ(licTabs())}" value="${LIC.tab}">
      <div slot="usage">${licUsageHTML()}</div>
      <div slot="eps">${LIC_EPS5.includes(LIC.opt) ? lic5EpsHTML() : licEpsHTML()}</div>
    </obs-tabs></div>
    ${licActHTML()}
    ${LIC_HIST_MD.includes(LIC.opt) ? licHistMdHTML() : ''}
  </div>`;
}

/* Organisms/PageHeader — `heading`, the product's file-certificate mark in `before`, the licence
   STATUS as an obs-tag in the `title` slot (the registry's "a status badge, e.g. the monitor detail
   Up"), the two actions in the default slot. `no-divider`: the tab bar beneath draws its own rule.
   ⚠️ THE RECORD IS NOT IN THE HEADER ANY MORE. It was carried as the detail-meta strip (subtitle +
   a key:value row) for one pass and reported as "also bad ui" — a line of small labelled text is
   the RUM span header's shape, not an overview. The overview is now the three widgets at the top
   of the usage tab (`licOverviewHTML`), the product's own dashboard vocabulary. */
function licHeadHTML(){
  const L = LIC_DATA.license, active = L.status === 'active';
  return `<div class="lichead"><obs-page-header heading="Product License" no-divider>
    <span slot="before" class="lichmk">${agIc('file-certificate', 26)}</span>
    <obs-tag slot="title" variant="${active ? 'tag-green' : 'tag-red'}">${active ? 'Active' : 'Expired'}</obs-tag>
    <span class="lichact">
      <obs-radio id="licOpt" as-button size="small" options="${agJ(LIC_OPTS)}" value="${LIC.opt}"></obs-radio>
      <obs-button variant="default" onclick="agTap(licExport)">${agIc('download', 14)}Export</obs-button>
      ${/* ⚠️ NOT ON OPTION 4 (request, 15 Sep 2026: "remove this in option 4, top right") — its licence card carries its
         own Upgrade Now, which opens the same Activation Code modal, so nothing becomes unreachable */ ''}
      ${LIC.opt === '4' ? '' : `<obs-button variant="primary" onclick="agTap(licActOpen)">Upgrade Now</obs-button>`}
    </span>
  </obs-page-header></div>`;
}

/* the days-left ring — Option 4's (and, on 12 Sep 2026, Option 2's first design). It renders the
   declared `gauge` gap that `_verify/ds-gaps.json` names: the DS ships no gauge, meter or progress
   element. ⚠️ A REAL ARC, not a picture — `stroke-dasharray` over the circumference, so the sweep
   IS the fraction and cannot disagree with the figure printed inside it. `tone` follows the
   licence state (licOvState), so an expiring licence's ring turns warning with its pill. */
function licRingHTML(pct, left, tone){
  const R = 54, C = 2 * Math.PI * R, on = Math.max(0, Math.min(100, pct)) / 100 * C, t = tone || '--chart-indigo';
  return `<svg class="licchart licring" viewBox="0 0 128 128" role="img"
      aria-label="${licFmt(left)} days left on the license">
    <circle cx="64" cy="64" r="${R}" fill="none" stroke="var(${t})" stroke-width="10" opacity=".18"/>
    <circle cx="64" cy="64" r="${R}" fill="none" stroke="var(${t})" stroke-width="10"
      stroke-linecap="round" stroke-dasharray="${on.toFixed(1)} ${(C - on).toFixed(1)}"
      transform="rotate(-90 64 64)"/>
    <text class="licringv" x="64" y="62" text-anchor="middle">${licFmt(left)}</text>
    <text class="licringl" x="64" y="80" text-anchor="middle">DAYS LEFT</text>
  </svg>`;
}
/* the support mailto, with the activation code in the body — ONE builder for the Activation Code
   modal, Option 2's card and Option 4's help line, so the three can never send different mail */
function licMailHref(){
  const L = LIC_DATA.license;
  return 'mailto:support@motadata.com?subject=' + encodeURIComponent(L.account + ' License Renewal') +
         '&body=' + encodeURIComponent('Please provide us a license code.\n\nOur activation code is as below:\n\n' + L.code);
}

/* ══ PRODUCT LICENSE · OPTION 2 — the licence card (14 Sep 2026, a supplied card) ═══════════
   A top row — the label with its status pill and the edition name with its tag on the left, the
   term as a 52px ring and two lines on the right — then four label-over-value tiles, a rule, and
   the activation code.
   ⚠️ THE TERM IS licTermModel's — the same thresholds, ring tone, pill and both lines Option 3's
   status card shows, so the two designs cannot disagree about one licence.
   ⚠️ THE CODE FIELD IS A READ-ONLY obs-input, the Activation Code modal's own control. It scrolls
   rather than ellipsising when the card is narrow — its text styles live in its shadow root.
   ⚠️ THE "⋯" DRAWN OUTSIDE THE SUPPLIED CARD'S CORNER WAS NOT BUILT — it sat off the card and no
   menu was specified for it; inventing its actions would be inventing product. */
/* ⚠️ OPTION 2's TERM LINE READS "N days · Ends 17 Aug 2030" (request, 15 Sep 2026: "remove 4% of term used
   and add Ends … 2030"), day-month-year as written. Built here rather than in licTermModel, whose line2
   the parked Option 3 overview still prints; "Ended" once the licence has run out. The request said
   12 Aug — the licence's own expiry is 17 Aug, and the date comes from T.expires so it cannot drift. */
function licHeroHTML(){
  const T = licTermModel(), D = T.D, L = LIC_DATA.license, E = LIC_DATA.edition;
  const tile = (k, v) => `<div class="licovp licxtile"><span>${stEsc(k)}</span><b>${stEsc(v)}</b></div>`;
  /* ⚠️ THE TERM SITS IN THE CARD'S TOP-RIGHT AND THE STATUS PILL FOLLOWS THE LABEL (request,
     14 Sep 2026). The ring and its two lines were a row of their own between two rules; they now
     share the top row with the identity block, so the card lost one rule and one row. The pill
     left the right edge to make room, and sits straight after "ObserveOps edition" — the status
     of the licence reads as part of its name line rather than as a corner badge. */
  return `<section class="licx" aria-label="License">
    <div class="licxtop">
      <div class="licxid">
        ${/* ⚠️ NO "ObserveOps edition" LABEL ROW (request, 15 Sep 2026). The status pill went onto the name
           line after the edition tag, then into the fourth tile (next request); .licxh / .licxl are kept
           and unreferenced. */ ''}
        <div class="licxt">
          ${/* ⚠️ THE NAME AND THE ∞ ARE SIBLINGS, as the live name row has them: the gradient runs across
             the NAME alone (a gradient over "Infinity ∞" would stop short of violet at the last letter),
             and the ∞ takes the accent on its own. The chip keeps obs-tag; `licxchip` is the hook the
             shadow-root sheet near the top of PART 2 styles (page CSS cannot reach inside obs-tag). */ ''}
          <span class="licovtitle"><span class="licxname">${stEsc(D.edition)}</span> <span class="licxinf" aria-hidden="true">∞</span></span>
          <obs-tag class="licxchip" variant="tag-purple">${agIc('check', 11)}${stEsc(licSentence(D.editionTag))}</obs-tag>
        </div>
        <p class="licxdesc">${stEsc(E.blurb)} <b>Licensed by what you monitor</b> — ${stEsc(E.blurb2)}</p>
      </div>
      <div class="licxterm">
        ${licOvRing(T.percentUsed, T.st.tone, true)}
        <div class="licovtx"><b>${stEsc(T.line1)}</b><span>${stEsc(licPlural(Math.max(0, T.daysLeft), 'day'))} · ${T.daysLeft > 0 ? 'Ends' : 'Ended'} ${stEsc(T.expires.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }))}</span></div>
        <obs-button class="licxact" variant="default" onclick="agTap(licActOpen)">${agIc('key', 14)}Activation code</obs-button>
      </div>
    </div>
    <div class="licxtiles">
      ${tile('License type', D.licenseType)}${tile('Account', D.account)}${tile('Issue date', licMed(T.issued))}
      ${/* ⚠️ THE FOURTH TILE IS STATUS, NOT EXPIRES (request, 15 Sep 2026: "remove Expires, and the Expires
         box will show Activated"). The pill left the name row, where the previous request had put it,
         so the status is shown once; the expiry still reads in the term line beside the ring. */ ''}
      <div class="licovp licxtile licxst"><span>Status</span><obs-tag variant="${T.st.tag}"><i class="licovdot"></i>${T.st.label}</obs-tag></div>
    </div>
    ${/* ⚠️ THE ACTIVATION CODE SECTION LEFT THE CARD (request, 15 Sep 2026: "remove the Activation code
       and it will be shown as a button in the ObserveOps edition card"). The rule and the code block
       under the tiles are gone; an "Activation code" button sits top-right beside the term and opens
       the SAME Activation Code modal Upgrade Now opens (licActOpen), which already carries the code,
       Copy and the support mailto — so nothing the section did is lost. .licxcode / .licxch / .licxcf
       / .licxhelp are kept and unreferenced. */ ''}
  </section>`;
}
/* ══ PRODUCT LICENSE · OPTION 2 — the Monitored devices card (14 Sep 2026, a supplied card) ═══
   Full width, under the licence card. ⚠️ ONLY THIS ENTITLEMENT — the request named Monitored
   devices; the other five (flow, log, NCCM, APM, RUM) are still not on Option 2.
   ⚠️ THE FIGURES ARE LIC_DATA's, not the card's: 170 of 5,000 with 0 agent-based and +15 over 30
   days, where the picture read 171 / 1 / "+9 this month". "this month" is also not what the data
   says — `delta` is a 30-day window — so the line names the window.
   ⚠️ THE GROWTH FIGURE IS NOT GREEN. The DS catalogues no positive-text token (resolve_token has
   no match), and borrowing a severity colour would call growth "clear".
   ⚠️ THE BAR TAKES THE ENTITLEMENT'S OWN SERIES TOKEN (`q.tok`), the colour the History drawer
   this card opens plots it in; over the allotment it turns --severity-critical with the pill.
   ⚠️ HISTORY IS AN obs-button, NOT A LINK — it opens a drawer and navigates nowhere (the button
   registry's own decision flow). It was a "View history →" footer until the request that made it an
   icon in the header's top-right, like every other Option 2 card (licHistIcon). */
const licHistDev = () => licHistOpen('device');
function licDevCardHTML(){
  const q = licQuota('device'); if (!q) return '';
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const pct = q.total ? Math.min(100, q.used / q.total * 100) : 0;
  const tone = over ? '--severity-critical' : q.tok;
  /* "Agentless (SNMP / API / WMI)" → "Agentless": the protocols are Option 1's detail text */
  const short = l => String(l).replace(/\s*\(.*\)\s*$/, '');
  /* "Other" goes last, as the supplied card has it; the rest keep the data's order */
  const types = (q.deploy || []).slice().sort((x, y) => (x.label === 'Other') - (y.label === 'Other'));
  /* the window follows the section head's switch; at 30d this is the instance's own +15 */
  const dsr = licSeries(q, LIC.range), dch = q.used - dsr[0];
  const delta = dch ? (dch > 0 ? '+' : '−') + licFmt(Math.abs(dch)) + ' in ' + LIC.range + ' days' : 'No change in ' + LIC.range + ' days';
  return `<section class="licq" aria-label="${stEsc(licSentence(q.title))}">
    <div class="licqh">
      <span class="licqt">${agIc(q.icon, 16)}<b>${stEsc(licSentence(q.title))}</b></span>
      <span class="licqhr">
        <obs-tag variant="${over ? 'tag-red' : 'tag-green'}">${over ? '' : agIc('check-circle', 12)}${over ? 'Over limit' : 'Healthy'}</obs-tag>
        ${licHistIcon(q.key)}
      </span>
    </div>
    <div class="licqu">
      <div class="licqm">
        <span class="licqn"><b>${licFmt(q.used)}</b> of ${licFmt(q.total)} ${stEsc(q.unit)}</span>
        <span class="licqa">${licFmt(avail)} available</span>
      </div>
      <span class="licbar licchart" role="img" aria-label="${Math.round(pct)}% of the ${stEsc(q.unit)} allotment used"
        style="--licbar-tone:var(${tone})"><i style="width:${pct.toFixed(1)}%"></i></span>
    </div>
    <obs-divider></obs-divider>
    <div class="licqs">
      ${(q.sub || []).map(x => `<span>${stEsc(short(x.label))} <b>${licFmt(x.value)}</b></span>`).join('')}
      <span class="licqd">${delta}</span>
    </div>
    <obs-divider></obs-divider>
    <div class="licqty">
      <span class="licql">By type</span>
      <div class="licqg">${types.map(t => `<span>${stEsc(t.label)} <b>${licFmt(t.value)}</b></span>`).join('')}</div>
    </div>
  </section>`;
}
/* ══ PRODUCT LICENSE · OPTION 3 — the two-card "License overview" (14 Sep 2026) ════════════
   Built to a supplied written spec plus a card. Options 1 and 2 are untouched; this is a third
   design behind the same switcher.

   THE SHAPE THE SPEC ASKED FOR: two cards side by side at ≥768px, stacked below it (edition
   first), sharing one skeleton — a muted label row on top, main content in the middle, and a
   two-column key/value grid pinned to the bottom, both cards the same height.

   ⚠️ THE BOTTOM GRID IS HAND-BUILT, AND obs-key-value IS THE WRONG COMPONENT FOR IT. That element
   renders label BESIDE value (measured on Option 1: "License Type  Free"); the spec and the card
   both show the label ABOVE its value, two pairs across. The DS has no component for that shape,
   so it is four spans on the spacing scale — layout, not an invented component.
   ⚠️ WHAT IS A DS COMPONENT HERE: both pills are obs-tag (`tag-purple` for the edition,
   `tag-green` / `tag-orange` / `tag-red` / `tag-unknown` for the status) and both label-row marks
   are obs-icon. `file-certificate`, `calendar` and `check` were each confirmed to RENDER — an
   obs-icon given a name the bundle lacks emits an empty comment and fails silently (`certificate`
   and `license` both do).
   ⚠️ THE RING IS THE DECLARED `gauge` GAP, the same one `ds-gaps.json` already names — the DS
   ships no gauge, meter or progress element. It is a real `stroke-dasharray` arc over the
   circumference, so the sweep IS the percentage printed inside it.

   ⚠️ NO MARKETING COPY, BY INSTRUCTION. The edition blurb ("One edition for the full-stack…")
   that Option 1 carries is deliberately absent from both cards.
   ⚠️ SENTENCE CASE THROUGHOUT, also by instruction — no all-caps labels anywhere in this section,
   which is why it carries no uppercase eyebrow (Option 4's supplied design does). */

/* the spec's own data shape. ⚠️ DERIVED FROM `LIC_DATA`, NOT DUPLICATED — and `daysLeft`,
   `totalDays`, `percentUsed` and the human duration are COMPUTED from the two dates here rather
   than passed in, exactly as the spec asks. */
function licOvData(){
  const L = LIC_DATA.license, E = LIC_DATA.edition;
  let expiry = L.expires;
  /* the spec asks for the expiring and expired states to be demonstrable; `licOvDemo` moves the
     expiry date and nothing else, so every figure below stays derived */
  if (LIC.ovDemo === 'expiring') expiry = licIso(new Date(licToday().getTime() + 47 * 864e5));
  if (LIC.ovDemo === 'expired')  expiry = licIso(new Date(licToday().getTime() - 12 * 864e5));
  return { edition:E.name, editionTag:E.chip, licenseType:L.type, account:L.account,
           status:L.status, issueDate:L.issued, expiryDate:expiry };
}
const licIso = d => d.toISOString().slice(0, 10);
/* ⚠️ SENTENCE CASE AT THE RENDER SITE, NOT IN THE DATA. The spec writes every label in
   sentence case ("Unified edition"); `LIC_DATA.edition.chip` is "Unified Edition" and is
   shared with Options 1 and 2, which show it as-is. Casing it here keeps this option faithful
   to its spec without rewriting a value two other designs render. */
const licSentence = t => String(t || '').charAt(0).toUpperCase() + String(t || '').slice(1).toLowerCase();

/* calendar duration between two dates, floored — the spec's "two largest non-zero units" */
function licDur(from, to){
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0){ m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0){ y--; m += 12; }
  return { y, m, d };
}
/* ⚠️ licFmt, NOT the raw number — the spec asks for thousands separators, and this helper is
   what prints the day counts in both of card 2's lines ("1,433 days", not "1433 days"). */
const licPlural = (n, w) => licFmt(n) + ' ' + w + (n === 1 ? '' : 's');
/* ⚠️ A ZERO UNIT IS DROPPED, NOT PRINTED. The spec enumerates years+months / months+days / days,
   so "3 years, 0 months" reads as "3 years" — the two largest NON-ZERO units. */
function licDurText(from, to){
  const { y, m, d } = licDur(from, to);
  if (y) return licPlural(y, 'year') + (m ? ', ' + licPlural(m, 'month') : '');
  if (m) return licPlural(m, 'month') + (d ? ', ' + licPlural(d, 'day') : '');
  return licPlural(d, 'day');
}

/* the spec's thresholds, in one place so the ring's tone and the pill can never disagree */
function licOvState(daysLeft, active){
  if (!active)        return { key:'inactive', label:'Inactive',      tag:'tag-unknown', tone:'--severity-unknown' };
  if (daysLeft <= 0)  return { key:'expired',  label:'Expired',       tag:'tag-red',     tone:'--severity-critical' };
  if (daysLeft <= 90) return { key:'expiring', label:'Expiring soon', tag:'tag-orange',  tone:'--severity-warning' };
  return                     { key:'active',   label:'Activated',     tag:'tag-green',   tone:'--chart-indigo' };
}

/* 52px, 5px stroke, the percentage inside. ⚠️ `role="img"` + an aria-label, per the spec —
   the figure is also printed, so the ring is never the only carrier. */
/* ⚠️ `bare` DROPS THE FIGURE (request, 15 Sep 2026: "remove the 4% in the donut chart", Option 2). The
   percentage is still in the aria-label and in the "N% of term used" line printed beside the ring. */
function licOvRing(pct, tone, bare){
  const R = 23.5, C = 2 * Math.PI * R, on = Math.max(0, Math.min(100, pct)) / 100 * C;
  return `<svg class="licchart licovring" viewBox="0 0 52 52" role="img"
      aria-label="${pct}% of license term used">
    <circle cx="26" cy="26" r="${R}" fill="none" stroke="var(${tone})" stroke-width="5" opacity=".18"/>
    <circle cx="26" cy="26" r="${R}" fill="none" stroke="var(${tone})" stroke-width="5"
      stroke-linecap="round" stroke-dasharray="${on.toFixed(1)} ${(C - on).toFixed(1)}"
      transform="rotate(-90 26 26)"/>
    ${bare ? '' : `<text class="licovrt" x="26" y="29" text-anchor="middle">${pct}%</text>`}
  </svg>`;
}

/* the licence term, derived once from licOvData — Options 2, 3 and 4 all read it, so the ring,
   the pill, the bar and both lines cannot disagree between the designs. `totalDays`, `daysLeft`,
   `percentUsed` and the duration are COMPUTED from the two dates, never passed in (Option 3's spec). */
function licTermModel(){
  const D = licOvData();
  const issued = new Date(D.issueDate + 'T00:00:00'), expires = new Date(D.expiryDate + 'T00:00:00');
  const today = licToday();
  const totalDays = Math.max(1, Math.round((expires - issued) / 864e5));
  const daysLeft = Math.round((expires - today) / 864e5);
  const st = licOvState(daysLeft, D.status === 'active');
  /* expired pins the ring at 100%, per the spec */
  const percentUsed = st.key === 'expired' ? 100
    : Math.min(100, Math.max(0, Math.round((today - issued) / (expires - issued) * 100)));
  const line1 = st.key === 'expired'  ? 'Expired on ' + licMed(expires)
              : st.key === 'expiring' ? 'Expires in ' + licPlural(daysLeft, 'day')
              : licDurText(today, expires) + ' left';
  const line2 = licPlural(Math.max(0, daysLeft), 'day') + ' · ' + percentUsed + '% of term used';
  return { D, issued, expires, today, totalDays, daysLeft, st, percentUsed, line1, line2 };
}
function licOvHTML(){
  const { D, issued, expires, st, percentUsed, line1, line2 } = licTermModel();
  const pair = (k, v) => `<div class="licovp"><span>${stEsc(k)}</span><b>${stEsc(v)}</b></div>`;
  /* the spec's optional action slot — nothing renders unless LIC.ovAction is set */
  const action = LIC.ovAction
    ? `<obs-button variant="default" size="small" onclick="agTap(${LIC.ovAction.on})">${stEsc(LIC.ovAction.label)}</obs-button>`
    : '';
  return `<div class="licov">
    <section class="licovc">
      <div class="licovl">${agIc('file-certificate', 15)}<span>ObserveOps edition</span></div>
      <div class="licovm">
        <div class="licovtitle">${stEsc(D.edition)} <span aria-hidden="true">∞</span></div>
        <obs-tag variant="tag-purple">${agIc('check', 11)}${stEsc(licSentence(D.editionTag))}</obs-tag>
      </div>
      <div class="licovg">${pair('License type', D.licenseType)}${pair('Account', D.account)}</div>
    </section>
    <section class="licovc">
      <div class="licovl">${agIc('calendar', 15)}<span>License status</span>
        <span class="licovact">${action}</span>
        <obs-tag variant="${st.tag}"><i class="licovdot"></i>${st.label}</obs-tag></div>
      <div class="licovm licovmr">
        ${licOvRing(percentUsed, st.tone)}
        <div class="licovtx"><b>${stEsc(line1)}</b><span>${stEsc(line2)}</span></div>
      </div>
      <div class="licovg">${pair('Issue date', licMed(issued))}${pair('Expires', licMed(expires))}</div>
    </section>
  </div>`;
}
/* the spec's demo: `licOvDemo('expiring')` / `('expired')` / `()` to clear. It moves the expiry
   date only, so every derived figure — ring, pill, both lines, the grid — follows from it. */
/* ⚠️ unreferenced since Option 3 left the switcher — '3' now falls through to Option 1's page */
function licOvDemo(state){ LIC.ovDemo = state || null; LIC.opt = '3'; stMainPaint(); }

/* ══ PRODUCT LICENSE · OPTION 4 — the one-card licence (14 Sep 2026) ══════════════════════════
   From a supplied page, `license-card.html`. Layout is the file's; paint, pills and controls are
   the DS's — see the CSS header for exactly what moved. The quota section stays below it, as it
   does under Options 1 and 3.
   ⚠️ THE RING SHOWS WHAT IS LEFT, THE BAR WHAT IS USED — as in the file (its arc was ~96% full
   beside a 4% track). Both come from licTermModel, so they always sum to the term.
   ⚠️ The edition line IS the file's copy, and it is LIC_DATA.edition's blurb word for word —
   shared with Option 1's Edition widget rather than retyped. */
/* `v === '5'` adds Option 5's modifier — the same card, restyled (see the CSS header) */
/* ══ PRODUCT LICENSE · OPTION 5 — the Monitored devices card (14 Sep 2026) ═══════════════════
   From a supplied card (the live product's quota row), with Mobbin's usage cards as the pattern
   reference — they agree on the shape: the used figure top-right, the meter full width under the
   header, a caption under the meter. See the CSS header for what is a DS part and what is a gap.
   ⚠️ THE FIGURES ARE LIC_DATA's (170 · 0 agent-based · +15 over 30 days, 138 typed devices), not
   the picture's (171 · 1 · +9); every percentage is computed from them.
   ⚠️ THE CHANGE LINE IS NOT GREEN, as on Option 2's card — the DS has no positive-text token.
   ⚠️ "History" OPENS THE SAME DRAWER Option 2's "View history" does (`licHistDev`). */
const LIC5_PAL = ['--chart-aqua', '--chart-lime-green', '--chart-neon-purple', '--chart-amber',
                  '--chart-hot-pink', '--chart-rose-red', '--chart-indigo'];
/* a 120×28 area sparkline over the 30-day series, ending on a dot at today's figure. ⚠️ The
   gradient id carries the entitlement key — two cards on one tab would otherwise share an id and
   the second would paint with the first's gradient (the recorded `wsg<seed>` trap). */
/* ⚠️ Unreferenced 14 Sep 2026 (see licQuotaCardHTML); drawn again since 15 Sep 2026 in Option 4's "Last N days" tiles */
function lic5Spark(sr, tone, key){
  const W = 120, H = 28, mn = Math.min(...sr), mx = Math.max(...sr), span = (mx - mn) || 1;
  /* ⚠️ A FLAT SERIES RIDES THE TOP, as the supplied Flow Sources card draws it — on the floor its
     area has no height, so the fill vanished and the chart read as a stray rule */
  const pts = sr.map((v, i) => [i / (sr.length - 1) * W, mx === mn ? 3 : H - 3 - (v - mn) / span * (H - 6)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  const last = pts[pts.length - 1];
  return `<svg class="licchart licq5sp" viewBox="0 0 ${W} ${H}" role="img" aria-label="The last ${sr.length - 1} days">
    <defs><linearGradient id="licq5sg-${key}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="var(${tone})" stop-opacity=".4"/><stop offset="1" stop-color="var(${tone})" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${line}L${W} ${H}L0 ${H}Z" fill="url(#licq5sg-${key})"/>
    <path d="${line}" fill="none" stroke="var(${tone})" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.5" fill="var(${tone})"/>
  </svg>`;
}
/* ⚠️ ONE BUILDER FOR OPTION 2's QUOTA-ROW CARDS — Flow Sources, Log Sources, NCCM, APM and RUM
   (14 Sep 2026) are one supplied shape, so they cannot drift. It was Option 5's Monitored devices
   card too until that card was simplified into its own builder (lic5DevHTML). The split legend and the
   BY TYPE bar render only for an entitlement that carries `sub` / `deploy`; Flow Sources has
   neither, so its card stops at the caption row, exactly as the supplied card does.
   ⚠️ History goes through LIC_HIST_GO — one STABLE function per entitlement. An inline arrow in the
   onclick would be a new function on every click and defeat agTap's same-handler guard, so
   obs-button's double-fire would open the drawer twice. */
const LIC_HIST_GO = Object.fromEntries(LIC_DATA.quotas.map(q => [q.key, () => licHistOpen(q.key)]));
/* ⚠️ HISTORY IS A LABELLED, FILLED BUTTON NOW (request, 14 Sep 2026: "improve the history button like
   option 3" — Option 3 had been removed and its tiles used this same icon-only button, so this is read
   as the third entry of today's switcher, Option 4, whose History buttons Option 5 shares). It was an
   icon-only `neutral-lightest small` button (28×24, "the history icon is button"): a trend glyph with
   no word next to a two-line figure reads as decoration. `neutral-lighter` is the DS's filled,
   borderless button — fill and border are both `--neutral-button-bg` — at the default size, with the
   same trend glyph and the word, exactly as on Options 4 and 5.
   The live callers are Option 2's cards only; `licDevCardHTML` and `lic3TileHTML` are unreferenced. */
const licHistIcon = key => `<obs-button class="licqhist" variant="neutral-lighter" aria-label="History" data-tip="Open history and CSV export"
      onclick="agTap(LIC_HIST_GO.${key})">${agIc('trending-up', 14)}History</obs-button>`;
function licQuotaCardHTML(q, cls){
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const pct = q.total ? Math.min(100, q.used / q.total * 100) : 0;
  const tone = over ? '--severity-critical' : q.tok;
  /* ⚠️ NO CHANGE FIGURE AND NO SPARKLINE (request, 14 Sep 2026: "remove [these]", outlining
     "— 0 · 30d" and the chart on every add-on card). The caption row keeps what remains; History —
     now the top-right icon — opens the real trend. `lic5Spark` and the `.licq5c` / `.licq5sp` CSS
     are kept unreferenced, the house pattern. */
  const sw = c => `<i style="background:var(${c})"></i>`;
  /* ⚠️ THE SPLIT CARRIES NO SWATCHES (14 Sep 2026). They keyed no chart — and once Monitored devices
     joined this builder its "Agentless" square was the SAME aqua as the BY TYPE legend's "Cloud"
     one card-row lower, so the two read as one series. Plain label → figure, like the caption. */
  const sub = (q.sub || []).map(x =>
    `<span class="licq5k">${stEsc(x.label)} <b>${licFmt(x.value)}</b>${
      x.of != null ? ` <em>of ${licFmt(x.of)} ${stEsc(q.unit)}</em>` : ''}</span>`).join('');
  const types = (q.deploy || []).map((t, i) => ({ ...t, c:LIC5_PAL[i % LIC5_PAL.length] }));
  const tot = types.reduce((a, t) => a + t.value, 0) || 1;
  /* a zero-share type keeps its legend entry but draws no segment */
  const segs = types.filter(t => t.value > 0)
    .map(t => `<i style="width:${(t.value / tot * 100).toFixed(2)}%;background:var(${t.c})"></i>`).join('');
  const legend = types.map(t =>
    `<span class="licq5k">${sw(t.c)}${stEsc(t.label)} <b>${licFmt(t.value)}</b> <em>${Math.round(t.value / tot * 100)}%</em></span>`).join('');
  const splitHTML = sub ? `<obs-divider></obs-divider><div class="licq5s">${sub}</div>` : '';
  const typesHTML = types.length ? `<obs-divider></obs-divider>
    <div class="licq5ty">
      <span class="licq5l">By type</span>
      <span class="licq5stk licchart" role="img" aria-label="${stEsc(q.unit)} by type">${segs}</span>
      <div class="licq5lg">${legend}</div>
    </div>` : '';
  return `<section class="${cls}" aria-label="${stEsc(q.title)}" style="--licq5-tone:var(${tone})">
    <div class="licq5h">
      <span class="licq5i">${agIc(q.icon, 18)}</span>
      <span class="licq5t">
        <span class="licq5tt"><b>${stEsc(q.title)}</b><obs-tag variant="${over ? 'tag-red' : 'tag-green'}"><i class="licovdot"></i>${over ? 'Over limit' : 'Healthy'}</obs-tag></span>
        <span class="licq5tk">${stEsc(q.token)}</span>
      </span>
      <span class="licq5r">
        <span class="licq5st">
          <span class="licq5n"><b>${licFmt(q.used)}</b> of ${licFmt(q.total)} ${stEsc(q.unit)}</span>
          <span class="licq5rm"><b>${licFmt(avail)}</b> remaining · ${(Math.round(pct * 10) / 10)}% used</span>
        </span>
        ${licHistIcon(q.key)}
      </span>
    </div>
    <span class="licbar licq5bar licchart" role="img" aria-label="${Math.round(pct)}% of the ${stEsc(q.unit)} allotment used"
      style="--licbar-tone:var(${tone})"><i style="width:${pct.toFixed(1)}%"></i></span>
    <!-- the "N remaining of M" caption row under the meter is gone: what remains sits UNDER the figure
         in one two-line stat now (see the .licq5st CSS) -->
    ${splitHTML}${typesHTML}
  </section>`;
}
/* ══ OPTION 5 — the Monitored devices card, simplified (14 Sep 2026) ═════════════════════════
   Its own builder since the request to make it "simple and user-friendly" — see the `.licd5` CSS
   header for what went and why. `licQuotaCardHTML` is now Option 2's add-on shape only. */
function lic5DevHTML(){
  const q = licQuota('device'); if (!q) return '';
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const pct = q.total ? Math.min(100, q.used / q.total * 100) : 0;
  const tone = over ? '--severity-critical' : q.tok;
  const sr = licSeries(q, LIC.range), ch = q.used - sr[0];
  const change = ch ? (ch > 0 ? '+' : '−') + licFmt(Math.abs(ch)) + ' in ' + LIC.range + ' days' : 'No change in ' + LIC.range + ' days';
  const short = l => String(l).replace(/\s*\(.*\)\s*$/, '');
  const types = (q.deploy || []).map((t, i) => ({ ...t, c:LIC5_PAL[i % LIC5_PAL.length] }));
  const tot = types.reduce((a, t) => a + t.value, 0) || 1;
  const segs = types.filter(t => t.value > 0)
    .map(t => `<i style="width:${(t.value / tot * 100).toFixed(2)}%;background:var(${t.c})"></i>`).join('');
  const legend = types.map(t =>
    `<span class="licq5k"><i style="background:var(${t.c})"></i>${stEsc(t.label)} <b>${licFmt(t.value)}</b> <em>${Math.round(t.value / tot * 100)}%</em></span>`).join('');
  return `<section class="licd5" aria-label="${stEsc(q.title)}">
    <div class="licd5h">
      <span class="licq5i">${agIc(q.icon, 18)}</span>
      <span class="licq5t"><b>${stEsc(q.title)}</b><span>${stEsc(q.token)}</span></span>
      <obs-tag variant="${over ? 'tag-red' : 'tag-green'}"><i class="licovdot"></i>${over ? 'Over limit' : 'Healthy'}</obs-tag>
    </div>
    <div class="licd5u">
      <div class="licd5m">
        <span class="licq5n"><b>${licFmt(q.used)}</b> of ${licFmt(q.total)} ${stEsc(q.unit)}</span>
        <span class="licd5r">${licFmt(avail)} remaining · ${change}</span>
      </div>
      <span class="licbar licq5bar licchart" role="img" aria-label="${Math.round(pct)}% of the ${stEsc(q.unit)} allotment used"
        style="--licbar-tone:var(${tone})"><i style="width:${pct.toFixed(1)}%"></i></span>
    </div>
    <obs-divider></obs-divider>
    ${(q.sub || []).length ? `<div class="licd5s">${q.sub.map(x => `<span>${stEsc(short(x.label))} <b>${licFmt(x.value)}</b></span>`).join('')}</div>` : ''}
    ${types.length ? `<div class="licq5ty">
      <span class="licq5l">By type</span>
      <span class="licq5stk licchart" role="img" aria-label="${stEsc(q.unit)} by type">${segs}</span>
      <div class="licq5lg">${legend}</div>
    </div>` : ''}
    <div class="licd5f"><obs-button variant="transparent" size="small" onclick="agTap(LIC_HIST_GO.${q.key})">View history${agIc('long-arrow-right', 14)}</obs-button></div>
  </section>`;
}
/* ══ OPTION 4 — the Monitored devices card (14 Sep 2026) ══════════════════════════════════
   From a supplied card: icon tile · title + Healthy · token … History; the used figure and share
   over a meter split by deployment, what is available and the 30-day change; two tiles, one per
   deployment; then BY DEVICE TYPE as a stacked bar over a centred legend. See the `.licm4` CSS header
   for what is a DS part.
   ⚠️ THE FIGURES ARE LIC_DATA's (170 · 0 agent-based · +15 in 30 days · 138 typed devices), NOT THE
   PICTURE'S (171 · 1 · 9 · Servers 29) — every share is computed from them.
   ⚠️ THE CHANGE FOLLOWS THE SECTION HEAD'S 7d/15d/30d SWITCH (`licSeries(q, LIC.range)`) since Options
   3–5 gained that head (request, 14 Sep 2026: "add this in all option 1-5"). It read the data's fixed
   30-day `delta` while there was no switch on this page; a switch directly above a card that ignored
   it would look broken. `licSetRange` repaints #licQCards, which holds this card.
   `v === '5'` IS OPTION 5's CARD, from a supplied HTML page of the same design (request, 14 Sep 2026:
   "add new card on option 5"). SAME MARKUP, three behaviours and the `.licm5` sizes differ — see the
   `.licm5` CSS header. */
function lic4DevHTML(v){
  const q = licQuota('device'); if (!q) return '';
  const o5 = v === '5', R = LIC.range;
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const share = v => { const n = Math.round(v * 10) / 10; return (n % 1 ? n.toFixed(1) : String(n)) + '%'; };
  const pct = q.total ? Math.min(100, q.used / q.total * 100) : 0;
  /* the split: "Agentless (SNMP / API / WMI)" → name + note; a note on the record wins */
  /* Option 5's page draws a cloud-download for agentless and a chip for the agent: `download` / `cpu`
     are the rendered obs-icon names nearest those (`cloud` does not exist in the bundle) */
  const DEP = o5 ? [{ tone:'--chart-aqua', ic:'download' }, { tone:'--chart-lime-green', ic:'cpu' }]
                 : [{ tone:'--neutral-light', ic:'network' }, { tone:'--neutral-light', ic:'agent' }];   /* Option 4: neutral icons (15 Sep 2026, "#8e9fbc") */
  const deps = (q.sub || []).map((x, i) => {
    const m = /^(.*?)\s*\((.*)\)\s*$/.exec(x.label);
    return { name: m ? m[1] : x.label, note: x.note || (m ? m[2] : ''), value: x.value,
             tone: (DEP[i] || DEP[0]).tone, ic: (DEP[i] || DEP[0]).ic };
  });
  const usedSum = deps.reduce((a, d) => a + d.value, 0) || 1;
  /* a zero-value deployment draws no meter segment (the recorded min-width fault) */
  /* ⚠️ Option 5's page gives each NON-ZERO segment a minimum width (12px agentless, 4px agent) so a
     3.4% share is still visible; it is set only on segments that are emitted at all */
  const meter = deps.map((d, i) => ({ ...d, i })).filter(d => d.value > 0).map(d =>
    `<i style="width:${(q.total ? d.value / q.total * 100 : 0).toFixed(2)}%;background:var(${d.tone})${o5 ? `;min-width:${d.i ? 4 : 12}px` : ''}"></i>`).join('');
  /* ⚠️ OPTION 5's DEPLOYMENT TILES CARRY A SHARE BAR (request, 14 Sep 2026: "the 2 card inside … make
     user friendly"). They were a dim 12px name over an 11px note beside "100% of used" — the share was
     a phrase to read, and a zero tile looked like the full one. Now: the name at body weight over its
     note, the figure with its UNIT on the right, and under both a thin bar in the tile's own tone —
     the same aqua / lime as the meter segment above — with the share beside it. A zero share draws
     the tinted track and no fill (the recorded min-width fault). Option 4 keeps its shape. */
  const tiles = deps.map(d => {
    const sh = Math.round(d.value / usedSum * 100);
    if (o5) return `<div class="licm4k licm5k" style="--licm4-t:var(${d.tone})">
      <span class="licm4ki">${agIc(d.ic, 18)}</span>
      <span class="licm5kb">
        <span class="licm5kr">
          <span class="licm4kt"><b>${stEsc(d.name)}</b>${d.note ? `<span>${stEsc(d.note)}</span>` : ''}</span>
          <span class="licm4kv"><b>${licFmt(d.value)}</b> <span>${stEsc(q.unit)}</span></span>
        </span>
        <span class="licm5ks"><span class="licm5kt" role="img" aria-label="${sh}% of used ${stEsc(q.unit)}">${sh > 0 ? `<i style="width:${sh}%"></i>` : ''}</span><span class="licm5kp">${sh}% of used</span></span>
      </span>
    </div>`;
    return `<div class="licm4k" style="--licm4-t:var(${d.tone})">
      <span class="licm4ki">${agIc(d.ic, 18)}</span>
      <span class="licm4kt"><b>${stEsc(d.name)}</b>${d.note ? `<span>${stEsc(d.note)}</span>` : ''}</span>
      ${/* no "N% of used" under the figure (request, 15 Sep 2026: Option 4 "remove '100% of used' and '0% of used'") —
         the figure alone; the share stays in Option 5's tiles */ ''}
      <span class="licm4kv"><b>${licFmt(d.value)}</b></span>
    </div>`;
  }).join('');
  const types = (q.deploy || []).map((t, i) => ({ ...t, c:LIC5_PAL[i % LIC5_PAL.length] }));
  const tot = types.reduce((a, t) => a + t.value, 0) || 1;
  const segs = types.filter(t => t.value > 0)
    .map(t => `<i style="width:${(t.value / tot * 100).toFixed(2)}%;background:var(${t.c})"></i>`).join('');
  const legend = types.map(t =>
    `<span class="licq5k"><i style="background:var(${t.c})"></i>${stEsc(t.label)} <b>${licFmt(t.value)}</b> <em>${Math.round(t.value / tot * 100)}%</em></span>`).join('');
  const sr = licSeries(q, R), d = q.used - sr[0];
  /* ⚠️ OPTION 4: THE METER IS A RING AND THE CHANGE IS A TILE (request, 15 Sep 2026: "the progress bar will
     show like [the add-on card's ring] and '15 in 30d' will show as a card like 'Last 30 days'"). The
     body is now the add-on cards' own shape — the 96px `lic4Ring` (used of total, the entitlement's
     tone) beside the tiles — so the six cards on this option read as one set. The figure line stays
     over the tiles; the change leaves its orange tag for the add-on cards' "Last N days" tile, same
     markup, neutral tone, following the window switch. The two-tone deployment meter went with the bar:
     the Agentless / Agent-based tiles right beside the ring still carry that split. Option 5 keeps both. */
  const changeTile = `<div class="licm4k" style="--licm4-t:var(--neutral-light)">
      <span class="licm4ki">${agIc('trending-up', 18)}</span>
      <span class="licm4kt"><b>Last ${R} days</b><span>Change in use</span></span>
      ${lic5Spark(sr, over ? '--severity-critical' : q.tok, '4-' + q.key)}
      <span class="licm4kv"><b>${d > 0 ? '+' + licFmt(d) : d < 0 ? '−' + licFmt(-d) : '0'}</b> <span>${d > 0 ? 'added' : d < 0 ? 'removed' : 'No change'}</span></span>
    </div>`;
  /* Option 5's page: a rise is a warning tag with a sign, anything else is ok; Option 4's picture: an
     orange tag with no sign, a neutral one when flat */
  const change = o5
    ? `<obs-tag variant="${d > 0 ? 'tag-orange' : 'tag-green'}"${d ? ` data-tip="${licFmt(Math.abs(d))} ${d > 0 ? 'more' : 'fewer'} devices than ${R} days ago"` : ''}>${d ? agIc('trending-up', 12) : ''}${d > 0 ? '+' : d < 0 ? '−' : ''}${d ? licFmt(Math.abs(d)) + ' in ' + R + 'd' : 'No change in ' + R + 'd'}</obs-tag>`
    : d
      ? `<obs-tag variant="tag-orange">${agIc('trending-up', 12)}${licFmt(Math.abs(d))} in ${R}d</obs-tag>`
      : `<obs-tag variant="tag-unknown">No change in ${R}d</obs-tag>`;
  /* Option 5's page grades the status by share of the allotment — Warning at 80%, Critical at 95% —
     where Option 4 (and every other card) flags only a quota that is over its limit */
  const st = o5
    ? (pct >= 95 ? ['tag-red', 'Critical'] : pct >= 80 ? ['tag-orange', 'Warning'] : ['tag-green', 'Healthy'])
    : (over ? ['tag-red', 'Over limit'] : ['tag-green', 'Healthy']);
  return `<section class="licm4${o5 ? ' licm5' : ''}" aria-label="${stEsc(licSentence(q.title))}">
    <div class="licm4h">
      <span class="licm4i">${agIc(q.icon, o5 ? 18 : 20)}</span>
      <span class="licm4t">
        <span class="licm4tt"><b>${stEsc(licSentence(q.title))}</b><obs-tag variant="${st[0]}">${st[1]}</obs-tag></span>
        <span class="licm4tk">${stEsc(q.token.replace(/base platform/i, 'Base platform'))}</span>
      </span>
      <obs-button class="licm4hist" variant="neutral-lighter" data-tip="Open history and CSV export"
        onclick="agTap(LIC_HIST_GO.${q.key})">${agIc(o5 ? 'trending-up' : 'history', 14)}History</obs-button>
    </div>
    ${o5 ? `<div class="licm4u">
      <div class="licm4m">
        <span class="licm4n"><b>${licFmt(q.used)}</b> <span>of ${licFmt(q.total)} used</span> <em>· ${share(pct)}</em></span>
        <span class="licm4r"><span>${licFmt(avail)} available</span> ${change}</span>
      </div>
      <span class="licm4bar licchart" role="img" aria-label="${share(pct)} of the ${stEsc(q.unit)} allotment used">${meter}</span>
    </div>
    <div class="licm4ks">${tiles}</div>`
    : `${/* ⚠️ NO FIGURE LINE (request, 15 Sep 2026: Option 4 Monitored devices "remove '170 of 5,000 used · 3.4%' and
         '4,830 available' — show simple and short"). It had moved above the ring row an hour earlier ("change the
         alignment"); now the card is its header, the ring row and the type bar. The ring still reads 170 of 5,000
         and carries the figures in its aria-label. ⚠️ CONSEQUENCE, stated: the 3.4% share and the 4,830 available
         are no longer written anywhere on this card. Option 5's card keeps its figure line. */ ''}
    <div class="licg4b licm4b">
      ${lic4Ring(q, over ? '--severity-critical' : q.tok)}
      <div class="licm4ks licm4k3">${tiles}${changeTile}</div>
    </div>`}
    ${/* No rule and no "By device type" heading here, on either option (requests, 14 Sep 2026: Option 4
       "remove the 'By device type' and remove line", then the same for Option 5). The legend already
       names every type and the bar's aria-label still says what it is; the card's own gap separates
       the tiles from the bar. `.licm4l` and `.licm4 obs-divider` are kept, unreferenced. */ ''}
    <div class="licm4ty">
      <span class="licq5stk licchart" role="img" aria-label="${stEsc(q.unit)} by type">${segs}</span>
      <div class="licq5lg licm4lg">${legend}</div>
    </div>
  </section>`;
}

/* ══ OPTION 4 — the add-on licence cards (14 Sep 2026) ════════════════════════════════════
   From two supplied pages: a Flow Sources card, and a grid of the same card for Log Sources, NCCM
   Managed Devices, APM Instrumented Units and RUM Front-end Apps. One shape each: icon tile · name ·
   "Add-on license · TOKEN" … View history; a rule; a 96px ring (used of total) beside a status pill
   ("Healthy · 5% used") over three facts — In use · Available · Last 30 days; APM adds its split.
   ⚠️ FIVE CARDS, ONE PER ROW, NO ACCENT EDGE — the page's two-across grid and 3px `border-left` were
   both removed on request the same day (see the `.licg4` CSS).
   ⚠️ THE ACCENT IS THE ENTITLEMENT'S OWN `q.tok`, not the pages' hexes (#7fc466 / #a78bfa / #f472b6 /
   #fbbf24 / #5eead4) — the same tone its meter and its History chart use on every other option.
   ⚠️ FIGURES ARE LIC_DATA's: every add-on reads 0-change over 30 days, so "Last 30 days" says No change
   where the pictures said +1 / +2, and Flow Sources is 0 of 100, not 5. */
function lic4Ring(q, tone){
  const C = 2 * Math.PI * 40, f = q.total ? Math.min(1, q.used / q.total) : 0;
  return `<svg class="licg4r licchart" viewBox="0 0 96 96" role="img" aria-label="${licFmt(q.used)} of ${licFmt(q.total)} ${stEsc(q.unit)} in use">
    ${/* drawn at 66px since 15 Sep 2026 (the tiles' height): an 8-unit arc (~5.5px) and the two lines re-centred
       for the larger type — see .licg4rv / .licg4rl */ ''}
    <circle cx="48" cy="48" r="40" fill="none" stroke-width="8" class="licg4rt"/>
    ${f > 0 ? `<circle cx="48" cy="48" r="40" fill="none" stroke-width="8" stroke="var(${tone})"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - f)).toFixed(1)}" transform="rotate(-90 48 48)"/>` : ''}
    ${/* 4px more between the figure and "of …" (request, 15 Sep 2026 — asked as 2px, then 4px; 4 is what ships): the
       baselines went 14 → 20 viewBox units apart (+6 units ≈ +4px at the ring's 66/96 scale), split evenly so the pair
       stays centred on 56. The total reads in k from 1,000 ("of 5k"); the aria-label keeps the full number. */ ''}
    <text x="48" y="46" text-anchor="middle" class="licg4rv">${licFmt(q.used)}</text>
    <text x="48" y="66" text-anchor="middle" class="licg4rl">of ${licK(q.total)}</text>
  </svg>`;
}
/* `v === '5'` IS OPTION 5's CARD, from a third supplied page ("Add-on licenses — option 2"; request,
   14 Sep 2026: "add this card in option 5 … like this card", with a screenshot of the stacked add-on
   cards). Same data and the same parts, re-arranged on a 2-column grid: the status pill moves up BESIDE
   THE NAME, View history sits top-right, the facts take the left of the second row and the ring its
   right, and APM's split runs underneath with no rule. See the `.licg5` CSS header. */
/* `head` — 'ring' draws the ring in the header's icon slot instead of beside the tiles (Option 4's duplicate RUM card) */
function lic4AddonHTML(q, v, head){
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const tone = over ? '--severity-critical' : q.tok;
  const pct = q.total ? Math.round(q.used / q.total * 100) : 0;
  const unit = n => licPlural(n, String(q.unit).replace(/s$/, ''));
  const R = LIC.range, sr = licSeries(q, R), d = q.used - sr[0];
  const last = d > 0 ? `+${licFmt(d)} added` : d < 0 ? `−${licFmt(-d)} removed` : 'No change';
  const fact = (k, v) => `<div class="licg4p"><span>${stEsc(k)}</span> <b>${stEsc(v)}</b></div>`;
  const codes = String(q.token).split('·').map(x => x.trim()).filter(x => x && !/add-on/i.test(x)).join(', ');
  /* ⚠️ THE TWO HALVES OF APM's SPLIT ARE TWO COLOURS (request, 15 Sep 2026: "use a different colour for applications and
     agents") — Applications keeps the card's tone (amber), Agents takes --chart-aqua, the palette's farthest hue from it. */
  const SPLIT_T = ['var(--licg4-a)', 'var(--chart-aqua)'];
  const splitRow = (q.sub || []).length ? `<div class="licg4s">${q.sub.map((x, i) =>
      `<span class="licg4k"><i style="background:${SPLIT_T[i] || SPLIT_T[0]}"></i>${stEsc(x.label)} <b>${licFmt(x.value)}${x.of != null ? ' of ' + licFmt(x.of) : ''}</b></span>`).join('')}</div>` : '';
  /* ⚠️ NO RULE AND NO GAP ABOVE IT (request, 15 Sep 2026: "remove the horizontal line and also remove the gap between the
     3 cards and [the split]") — the obs-divider is gone, and .licg4s trims the card's 16px flex gap to 12px (see its rule). */
  const split = splitRow;
  /* ⚠️ THE PILL IS THE STATUS ONLY (request, 15 Sep 2026: Option 4 "remove the '0% used'"). The share is already the
     "In use" tile's "N% of total" and the ring's arc; beside the name it was a third copy. */
  /* ⚠️ NO DOT (request, 15 Sep 2026: "remove the dot in [the] health tag") — the tag's green already says Healthy, and the
     Monitored devices card's pill beside these never carried one. Only this Option 4 pill; Option 5's cards keep theirs. */
  const pill = `<obs-tag variant="${over ? 'tag-red' : 'tag-green'}">${over ? 'Over limit' : 'Healthy'}</obs-tag>`;
  /* ⚠️ OPTIONS 4 AND 5's HISTORY BUTTONS ARE FILLED AND BORDERLESS (request, 14 Sep 2026: "show as normal button
     like [Create Widget] without border"). `neutral-lighter` is the DS variant for exactly that: its
     fill is `--neutral-button-bg` (#2b394f dark / #e3e8f2 light) and its border is the SAME token, so
     no outline shows. Option 4's cards got the same button the next request ("in option 4 the history and
     view history will be show as normal button"), so both variants share it. */
  const hist = `<obs-button class="licg4hist" variant="neutral-lighter" data-tip="Open history and CSV export"
        onclick="agTap(LIC_HIST_GO.${q.key})">${agIc(v === '5' ? 'trending-up' : 'history', 14)}${/* "History" on Option 4 (request,
        15 Sep 2026: "change 'View history' to 'History'") — the devices card above already says History, so the two card
        kinds now name the one action alike. Option 5's footer button keeps "View history". */ v === '5' ? 'View history' : 'History'}</obs-button>`;
  const facts = `${fact('In use', unit(q.used))}${fact('Available', unit(avail))}${fact('Last ' + R + ' days', last)}`;
  /* ⚠️ OPTION 4's FACTS ARE TILES (request, 14 Sep 2026: "In use, Available, Last 30 days — show like
     [the Agentless tile]"). They reuse the Monitored devices card's own `.licm4k` markup — icon tile ·
     label over the unit · figure over its share — so the two cards on this option speak one shape.
     Only "In use" carries the entitlement's tone; Available and the change are neutral, because a
     second and third hue on one card would read as series. Option 5 keeps its plain `fact` rows. */
  const tile = (ic, t, k, sub, val, vsub, chart) => `<div class="licm4k" style="--licm4-t:var(${t})">
      <span class="licm4ki">${agIc(ic, 18)}</span>
      <span class="licm4kt"><b>${stEsc(k)}</b><span>${stEsc(sub)}</span></span>
      ${chart || ''}
      <span class="licm4kv"><b>${stEsc(val)}</b> <span>${stEsc(vsub)}</span></span>
    </div>`;
  const aPct = q.total ? Math.round(avail / q.total * 100) : 0;
  /* ⚠️ EVERY TILE ICON IS --neutral-light (#8e9fbc in dark) since 15 Sep 2026 ("change the 'In use' icon", with the request
     to use #8e9fbc for the icons) — In use joins Available and Last N days; the entitlement's tone stays on the ring's arc */
  /* ⚠️ "In use" WEARS `utilization`, NOT q.icon (request, 15 Sep 2026: "change the icon of 'In use'") — q.icon is the
     card header's own glyph, so the tile repeated the header 40px below it. `utilization` is the product's usage mark
     (render-checked; `gauge` / `usage` / `activity` do not exist in the bundle). */
  const tiles4 = tile('utilization', '--neutral-light', 'In use', q.unit, licFmt(q.used), `${pct}% of total`)
    + tile('check', '--neutral-light', 'Available', q.unit, licFmt(avail), `${aPct}% of total`)
    /* ⚠️ THE ICONS ARE SWAPPED ON OPTION 4 (request, 15 Sep 2026: "the View history icon will be used in 'Last 30 days' and
       the 'Last 30 days' icon in View history"): View history wears the clock (history), the change tile the trend line
       (trending-up). The Monitored devices card's change tile follows, and its History button already wore the clock. */
    + tile('trending-up', '--neutral-light', 'Last ' + R + ' days', 'Change in use',
        d > 0 ? '+' + licFmt(d) : d < 0 ? '−' + licFmt(-d) : '0', d > 0 ? 'added' : d < 0 ? 'removed' : 'No change',
        /* ⚠️ A SPARKLINE OF THE WINDOW (request, 15 Sep 2026: "add the chart in the 'Last 30 days' card") — the same
           licSeries the History modal plots, in the entitlement's tone, so it follows the 7d/15d/30d switch. lic5Spark
           (Option 5's parked quota sparkline) draws it; the gradient id carries '4-' + key so no two cards share one.
           A flat window rides the top of the chart, which is how a 0-change add-on reads. */
        lic5Spark(sr, tone, '4-' + q.key + (head === 'ring' ? '-rh' : '')));
  /* ⚠️ OPTION 5's ADD-ON CARD IS THE REFERENCE-CARD SHAPE (request, 14 Sep 2026: "make [it a] proper and
     user friendly card", with an SLO card and a NetRoute card as the reference). Both references read
     top to bottom: the name with its status at the top-right, label-over-value figures, one labelled
     strip with its value at the right, and a quiet footer line. So: icon · name over code · status
     pill; In use · Available · Allotted as label-over-value; "Usage" with its % over the meter; and a
     footer of the window's change beside View history. The ring is gone from this option — the usage
     row says the same thing in the references' own way — and `lic4Ring` stays Option 4's. */
  if (v === '5') {
    const stat = (k, n, u) => `<div class="licn5v"><span>${stEsc(k)}</span><b>${n}${u ? ` <em>${stEsc(u)}</em>` : ''}</b></div>`;
    const uw = n => n === 1 ? String(q.unit).replace(/s$/, '') : q.unit;
    const exact = q.total ? q.used / q.total * 100 : 0;
    const change = d > 0 ? `+${licFmt(d)} added` : d < 0 ? `−${licFmt(-d)} removed` : 'No change';
    const splitN5 = (q.sub || []).length ? `<div class="licn5s licn5sp">${q.sub.map(x =>
        stat(x.label, licFmt(x.value), x.of != null ? 'of ' + licFmt(x.of) : '')).join('')}</div>` : '';
    return `<section class="licg5c" aria-label="${stEsc(q.title)} license usage" style="--licg4-a:var(${tone})">
    <div class="licn5h">
      <span class="licg5i">${agIc(q.icon, 20)}</span>
      <span class="licn5t"><b>${stEsc(q.title)}</b><span>Add-on license · ${stEsc(codes)}</span></span>
      <obs-tag variant="${over ? 'tag-red' : 'tag-green'}"><i class="licovdot"></i>${over ? 'Over limit' : 'Healthy'}</obs-tag>
    </div>
    <div class="licn5s">${stat('In use', licFmt(q.used), uw(q.used))}${stat('Available', licFmt(avail), uw(avail))}${stat('Allotted', licFmt(q.total), uw(q.total))}</div>
    <div class="licn5u">
      <div class="licn5ul"><span>Usage</span><b>${pct}%</b></div>
      <span class="licbar licchart" role="img" aria-label="${pct}% of the ${licFmt(q.total)} ${stEsc(q.unit)} allotment used" style="--licbar-tone:var(${tone})">${exact > 0 ? `<i style="width:${exact.toFixed(2)}%"></i>` : ''}</span>
    </div>
    ${splitN5}
    <div class="licn5f"><span>Last ${R} days · <b>${change}</b></span>${hist}</div>
  </section>`;
  }
  const rh = head === 'ring';
  return `<section class="licg4c${rh ? ' licg4rh' : ''}" aria-label="${stEsc(q.title)} license usage" style="--licg4-a:var(${tone})">
    <div class="licg4h">
      ${rh ? lic4Ring(q, tone) : `<span class="licg4i">${agIc(q.icon, 22)}</span>`}
      ${/* ⚠️ THE PILL SITS RIGHT AFTER THE NAME (request, 15 Sep 2026: Option 4 "the 'Healthy · 0% used' will show
         behind the 'Flow Sources'"), the Monitored devices card's own title row. It had moved to the header's
         right edge after View history on 14 Sep; now the status reads as part of the name and View history is
         alone at the edge. \`.licg5tt\` is the title row Option 5's earlier add-on card used for exactly this
         (flex, 8px gap, wraps under the name when narrow) and it already carries the undo for \`.licg4t span\`,
         which would otherwise clip the pill — reused rather than a second copy. */ ''}
      <span class="licg4t"><span class="licg5tt"><b>${stEsc(q.title)}</b>${pill}</span><span>Add-on license · ${stEsc(codes)}</span></span>
      ${hist}
    </div>
    ${/* no rule under the header (request, 14 Sep 2026: "remove this line"); the card's 16px gap
       separates it from the ring. APM's rule above its split row went too, on 15 Sep 2026. */ ''}
    <div class="licg4b">
      ${rh ? '' : lic4Ring(q, tone)}
      <div class="licg4f licg4ft">
        ${tiles4}
      </div>
    </div>
    ${split}
  </section>`;
}
const lic4AddonsHTML = v => `<div class="licg4${v === '5' ? ' licg5' : ''}">${LIC_DATA.quotas.filter(q => q.key !== 'device').map(q => lic4AddonHTML(q, v)).join('')}</div>`;
/* ⚠️ THE RUM CARD WITH THE RING IN THE HEADER — built on Option 4 (request, 15 Sep 2026: "duplicate the card, remove the
   [header] icon, and use [the ring] in the icon position") and MOVED TO OPTION 5 the same night ("this card will be move in
   option 5"). Option 4 is back to five add-on cards. It is a second design for the RUM entitlement, not a second licence:
   same data, same History door. It keeps Option 4's card shape and look (border, 10px padding, "History", the '-rh'
   sparkline id) because it was moved as it was — so on Option 5 it is the one bordered card among borderless ones. It sits
   in its own one-column .licg4 under Option 5's two-across grid, which is what gives it Option 4's card rules
   (.licg4 > .licg4c) and the full row. */
const lic5RumRingHTML = () => `<div class="licg4">${lic4AddonHTML(LIC_DATA.quotas.find(q => q.key === 'rum'), '4', 'ring')}</div>`;
/* ══ PRODUCT LICENSE · OPTION 2 — the Flow Sources card (14 Sep 2026, a supplied card) ═══════
   Under the Monitored devices card. ⚠️ THE FIGURES ARE LIC_DATA's — the instance meters 0 of 100
   exporters with no change over 30 days, where the picture read 5 · 95 remaining; so the meter is
   empty and the sparkline flat. That is the instance, not a rendering fault. */
/* ⚠️ AND THE OTHER FOUR ADD-ONS, in the data's order — Log Sources, NCCM Managed Devices, APM
   Instrumented Units, RUM Front-end Apps (a later request the same day, from supplied cards). Every
   entitlement except Monitored devices gets this card, so a fifth add-on in LIC_DATA appears on its
   own. Figures are LIC_DATA's, not the pictures' (Log 0 of 100 · NCCM 1 · APM of 52 · RUM 2 of 50).
   ⚠️ NO LEFT ACCENT, as on Flow Sources — the supplied cards carry one, but Option 2's was removed
   by request; Option 5 keeps it. */
/* ⚠️ EVERY ENTITLEMENT IS ONE CARD SHAPE NOW, MONITORED DEVICES INCLUDED (14 Sep 2026: "in option 2
   all the cards — change to this card's visualization — and add in option 3"). The devices card had
   its own builder and read as a different object from the five under it. `licDevCardHTML` and its
   `.licq*` CSS are kept and unreferenced. `licqbox` is the bordered surface Options 2 and 3 share
   (it was `licq5o2` while only Option 2 used it). */
const licAddonCardsHTML = () => LIC_DATA.quotas.map(q => licQuotaCardHTML(q, 'licq5 licqbox')).join('');
function lic4HTML(v){
  const T = licTermModel(), D = T.D, E = LIC_DATA.edition, L = LIC_DATA.license;
  const left = Math.max(0, T.daysLeft), leftPct = 100 - T.percentUsed;
  const field = (k, v) => `<div class="lic4f"><span>${stEsc(k)}</span>${v}</div>`;
  return `<article class="lic4${v === '5' ? ' lic5' : ''}" aria-label="ObserveOps license">
    <div class="lic4top">
      <section class="lic4s">
        ${/* ⚠️ NO "ObserveOps edition" EYEBROW ON OPTION 4 (request, 15 Sep 2026: "remove this in option 4") — the name
           row leads the card. Option 5 keeps it. */ ''}
        ${v === '5' ? `<div class="lic4eb">${agIc('file-certificate', 14)}ObserveOps edition</div>` : ''}
        ${/* ⚠️ OPTION 4's NAME AND CHIP ARE OPTION 2's (request, 15 Sep 2026: "change [this] and improve like [Option 2's
           name row]"): the live license-hero gradient on the name, the ∞ in the accent, the gradient-filled chip —
           and the chip INLINE after the name instead of on its own line. Same classes as Option 2, so the two cannot
           drift; the eyebrow above stays (the picture was of the name row). Option 5 keeps its own title. */ ''}
        ${v === '5' ? `<div class="lic4title">${stEsc(D.edition)} <span aria-hidden="true">∞</span></div>
        <obs-tag variant="tag-purple">${agIc('check', 11)}${stEsc(licSentence(D.editionTag))}</obs-tag>`
        : `<div class="licxt lic4nr"><span class="licovtitle"><span class="licxname">${stEsc(D.edition)}</span> <span class="licxinf" aria-hidden="true">∞</span></span>
        <obs-tag class="licxchip" variant="tag-purple">${agIc('check', 11)}${stEsc(licSentence(D.editionTag))}</obs-tag></div>`}
        <p class="lic4desc">${stEsc(E.blurb)} <b>Licensed by what you monitor</b> — ${stEsc(E.blurb2)}</p>
        ${/* ⚠️ THE ACTIVATION CODE TOGGLE SITS AT THE END OF THE DESCRIPTION (request, 15 Sep 2026: "remove the
           line, and the Activation code button will show at the end of [the] paragraph"). It left the
           card's bottom row, and the rule over that row went with it — so collapsed, the card is the three
           sections and nothing under them. Opening it still shows the code row across the card's full
           width at the bottom, which is the only place the code box has room. Option 5 is untouched. */ ''}
        ${/* ⚠️ A FILLED BUTTON, NO BORDER (request, 15 Sep 2026: "Activation code will show as a button with background
           colour, no border colour"). \`neutral-lighter\` is the DS variant History and View history already use on
           this option: its fill is --neutral-button-bg and its border the same token, so no outline shows. It replaces
           the transparent button restyled as a heading — the shadow-root hook that did that is gone, and with it the
           conformance checker's "variant looks overridden" finding. */ ''}
        ${/* Upgrade Now beside Activation code (request, 15 Sep 2026) — the page header's own primary, same handler (licActOpen,
           the Activation Code modal), so the card's two licence actions sit together. ⚠️ It duplicates the header's Upgrade
           Now, which stays. ⚠️ UPGRADE NOW LEADS: it was added after Activation code and swapped the same day ("swap this"). */ ''}
        ${v === '5' ? '' : `<div class="lic4axw"><obs-button class="lic4up" variant="primary" onclick="agTap(licActOpen)">Upgrade Now</obs-button><obs-button class="lic4axb${LIC.act4 ? ' open' : ''}" variant="neutral-lighter"
          aria-expanded="${LIC.act4 ? 'true' : 'false'}" data-tip="${LIC.act4 ? 'Hide' : 'Show'} the activation code"
          onclick="agTap(lic4ActTog)">Activation code${agIc('chevron-down', 16)}</obs-button></div>`}
      </section>
      <section class="lic4s lic4rec">
        <div class="lic4meta">
          ${field('License type', `<b>${stEsc(D.licenseType)}</b>`)}${field('Issue date', `<b>${licLong(T.issued)}</b>`)}
          ${field('Account', `<b>${stEsc(D.account)}</b>`)}${/* no dot on Option 4 (request, 15 Sep 2026: "remove the dot in [the] Status card"), as its Healthy pills lost theirs;
             Option 5 renders this same markup and keeps it */ ''}${field('Status', `<obs-tag variant="${T.st.tag}">${v === '5' ? '<i class="licovdot"></i>' : ''}${T.st.label}</obs-tag>`)}
        </div>
        ${/* ⚠️ NO TERM BAR ON OPTION 4 (request, 15 Sep 2026: "in option 4 remove the progress bar"). The
           Jul 2026 → Aug 2030 bar said, in a second shape, what the ring beside it already says in days
           left and the date under it. Option 5 keeps its bar — the request named Option 4. */ ''}
        ${v === '5' ? `<div class="lic4tl"><span>${licMY(T.issued)}</span>
          <span class="licbar licchart" role="img" aria-label="${T.percentUsed}% of the license term used"
            style="--licbar-tone:var(${T.st.tone})"><i style="width:${T.percentUsed}%"></i></span>
          <span>${licMY(T.expires)}</span></div>` : ''}
      </section>
      <section class="lic4s lic4ring">
        ${licRingHTML(leftPct, left, T.st.tone)}
        <span class="lic4eb">Expires</span>
        <b class="lic4date">${licLong(T.expires)}</b>
      </section>
    </div>
    ${/* ⚠️ ON OPTION 4 THE ACTIVATION CODE FOLDS (request, 15 Sep 2026: "show the Activation code with an
       expand / collapse icon, and when I click it show [the code row]"). The heading becomes the toggle —
       an obs-button carrying the label and a chevron — and the code box and the support line show only
       while it is open. Open, the row is exactly the one it was. It starts COLLAPSED: the code is
       something you fetch once to email support, not something to read every visit. The state is
       `LIC.act4`, so a repaint of the page keeps it; the toggle itself only flips a class (lic4ActTog),
       so nothing under the pointer is rebuilt. ⚠️ Through agTap — obs-button fires its onclick twice,
       and a toggle that fires twice never opens. Option 5 keeps its plain heading.
       ⚠️ The toggle has since moved under the description (next request, see the first section); this row
       is the code box and the support line only, with no heading and no rule. */ ''}
    <section class="lic4act${v === '5' ? '' : ' lic4ax' + (LIC.act4 ? ' open' : '')}">
      ${v === '5' ? `<b class="lic4acth">Activation code</b>` : ''}
      <div class="lic4code">
        <span class="lic4k">Upgradation code</span>
        <span class="lic4v">${stEsc(L.code)}</span>
        <span class="lic4cp"><obs-button variant="transparent" aria-label="Copy activation code" onclick="agTap(licCopy)">${agIc('copy', 16)}</obs-button></span>
      </div>
      <p class="lic4help">Email the activation code above to <obs-link href="${stEsc(licMailHref())}">support@motadata.com</obs-link></p>
    </section>
  </article>`;
}

/* ── tab 1 · License & Quota Usage ──────────────────────────────────────────────────────── */
/* the section head is Organisms/Toolbar's grid variant — the title in `start`, the hint and the
   window switch after it — the same shape the Agentic AI page puts above its own table */
/* ── the overview: three DS WIDGETS (7 Sep 2026, third pass) ─────────────────────────────
   The product's own overview vocabulary is a row of widgets, and the DS ships the chrome:
   `obs-toolbar variant="widget"` draws the framed header (title + a tag in the pill slot) and the
   body carries the rest of the frame — the same tile the EPS tab already uses, so the page speaks
   one language. Inside them, only DS parts — and, since 12 Sep 2026, the ones the DS's OWN DECISION FLOW
   PRESCRIBES rather than merely catalogued ones. ⚠️ THE CONFORMANCE CHECKER CANNOT SEE THIS
   CLASS OF FAULT: it scored 100/100 before this pass and 100/100 after, because it counts
   whether a component is DS, never whether it was the RIGHT one.
   · Edition   — obs-key-value (plain) for Edition · License Type · Account, then the guide's
                 one-line description. ⚠️ THE BIG "Infinity ∞" IS GONE: it was a raw
                 `<div class="licedn">` at 24px — the loudest thing on the page for the least
                 actionable fact on it — and an edition NAME is a record field, not a KPI;
                 obs-metric-list's own `dont` reads "don't use for a record's key/value detail".
                 The name is the first key-value row now, and the header keeps its edition tag.
   · Validity  — obs-metric-list for DAYS LEFT (the one real KPI on this row, coloured by
                 threshold through the item's severity token) over an obs-key-value for
                 Issued · Expires · Term elapsed.
                 ⚠️ THOSE THREE WERE A ONE-ROW obs-table WITH A `bar` CELL, and that is the
                 mis-selection this pass fixes. obs-key-value's decisionFlow reads "Label→value
                 pairs describing ONE record? -> Key-Value"; obs-table is for "rows of MANY
                 records". A table header (ISSUED | EXPIRES | TERM ELAPSED) over a single row
                 also out-weighed the neighbouring card's key-value labels, so two adjacent
                 cards spoke two languages for one job.
                 ⚠️ THE BAR IS THE ONE THING LOST, and it was weighed: `Term elapsed` keeps the
                 signal as a --severity-coloured value (warning at 75%, critical at 90%), the DS
                 ships no standalone meter or progress element (searched), and the days-left KPI
                 directly above it already carries the urgency.
   · Support   — the License Guide's Support & Contact section: one line on how overages are
                 handled, obs-links to the portal and the mailbox, and an obs-button into the
                 same Activation Code modal Upgrade Now opens.
                 ⚠️ THE LINKS STAY obs-links AND ARE NOT KEY-VALUE ROWS. Folding them in would
                 have made this card echo the other two, but obs-key-value renders text, so the
                 working `mailto:` would have stopped being clickable — a real loss for a
                 cosmetic symmetry. Links are their own catalogued component; the inconsistency
                 worth fixing was two components doing the SAME job, not two jobs looking
                 different. ⚠️ THE BUTTON WENT `neutral-lightest` → `default`: against the
                 light canvas the lightest fill read as a disabled control.
   ⚠️ Two earlier shapes were built and rejected the same day: a key-value card beside a metric
   list ("very bad ui"), then the header's detail-meta strip ("also bad ui"). Both are recorded
   above so neither is tried a third time. */
function licOverviewHTML(){
  const L = LIC_DATA.license, E = LIC_DATA.edition, active = L.status === 'active';
  const issued = new Date(L.issued + 'T00:00:00'), expires = new Date(L.expires + 'T00:00:00'), today = licToday();
  const total = Math.max(1, Math.round((expires - issued) / 864e5)), left = Math.max(0, Math.round((expires - today) / 864e5));
  const elapsed = Math.min(100, Math.max(0, Math.round((today - issued) / (expires - issued) * 100)));
  /* the ONE headline figure on this row, coloured by the item's own --severity token */
  const days = [licFmt(left), 'days', active ? 'left on the license' : 'the license has expired'];
  if (!active || left <= 30) days.push('--severity-critical'); else if (left <= 90) days.push('--severity-warning');
  /* Issued · Expires · Term elapsed are ONE record's fields -> obs-key-value, per its own
     decisionFlow. `Term elapsed` carries a --severity token so the value still signals how far
     through the term the licence is, which is the part of the old bar that was load-bearing. */
  const termCol = !active || elapsed >= 90 ? '--severity-critical' : elapsed >= 75 ? '--severity-warning' : '';
  const validity = [['Issued', licMed(issued)], ['Expires', licMed(expires)],
                    ['Term elapsed', elapsed + '%', termCol]];
  const widget = (title, tag, body) => `<div class="licwid"><obs-toolbar variant="widget" title="${title}">${tag ? `<obs-tag variant="tag-primary">${tag}</obs-tag>` : ''}</obs-toolbar><div class="lictileb licwidb">${body}</div></div>`;
  return `<div class="licwids">
    ${widget('Edition', E.chip, `
      <obs-key-value variant="plain" items="${agJ([['Edition', E.name], ['License Type', L.type], ['Account', L.account]])}"></obs-key-value>
      <p class="lichelp">${stEsc(E.blurb)} Licensed by what you monitor — ${stEsc(E.blurb2)}</p>`)}
    ${widget('Validity', licFmt(total) + '-day term', `
      <obs-metric-list items="${agJ([days])}"></obs-metric-list>
      <obs-key-value variant="plain" items="${agJ(validity)}"></obs-key-value>`)}
    ${widget('Support & renewal', '', `
      <p class="lichelp">Overages are handled through add-on packs or a true-up; a new activation code replaces this license in place.</p>
      <div class="liclinks">
        <obs-link external href="https://support.motadata.com" onclick="return false">support.motadata.com${agIc('external-link', 12)}</obs-link>
        <obs-link href="mailto:support@motadata.com">support@motadata.com</obs-link>
      </div>
      <obs-button variant="default" onclick="agTap(licActOpen)">${agIc('key', 14)}Activate a new code</obs-button>`)}
  </div>`;
}
/* ⚠️ ONLY OPTION 1 CARRIES THE QUOTA GRID NOW. Option 2 has a section head over six quota cards;
   Options 3 and 4 have neither head nor grid; Option 5 has its devices card. Everything the grid was
   bound to is guarded in `licAfter` — `#licRange`, `#licTable` — so nothing throws when absent. */
/* the section head — Organisms/Toolbar's grid variant: the title, a hint, the 7d · 15d · 30d window.
   ⚠️ ONE MARKUP FOR OPTIONS 1 AND 2, and the switch keeps the id #licRange in both, so licAfter's
   single binding drives the grid in Option 1 and the cards in Option 2. */
const licQuotaHeadHTML = hint => `<obs-toolbar class="lictb"><span slot="start" class="lictbt">License &amp; Quota Usage</span>
      <span class="lichint">${hint}</span>
      <obs-radio id="licRange" as-button size="small" options="${agJ(LIC_RANGES)}" value="${LIC.range}"></obs-radio></obs-toolbar>`;
/* ══ OPTION 3 — the quota tiles, simple (14 Sep 2026) ═════════════════════════════════════
   Request: "in option 3 the card ui will be change and make simple and user friendly", against six
   full-width Option 2 cards stacked down the page. Option 2 keeps that card; Option 3 gets a tile
   built from ITS OWN overview skeleton (`.licovc` · the muted `.licovl` label row · `.licovg`
   label-above-value pairs), so the six tiles read as the same family as the two cards above them.
   Each tile says three things and nothing else: what it is, how much is used, how much is left.
   What went, and why:
   · the METERING TOKENS (DEV · base platform, FSRC · add-on) — licence codes, not words; the History
     drawer still shows each one;
   · "Healthy" ON EVERY TILE — six identical pills say nothing. A pill appears only when a quota is
     OVER ITS LIMIT, which is the one state worth interrupting for;
   · the AGENTLESS / AGENT-BASED split and BY TYPE on Monitored devices — the densest block on the
     page. ⚠️ CONSEQUENCE, stated: Option 3 no longer shows that breakdown; Option 1's row detail and
     Option 2's card still do;
   · the full-width stack — a 3 / 2 / 1-column grid by the pane's own width (container query), so the
     six fit on two rows at 1600px instead of ~900px of scrolling.
   ⚠️ SENTENCE CASE KEEPS ACRONYMS (`lic3Name`) — Option 3's spec asks for sentence case, and the
   shared `licSentence` would print "Nccm managed devices". */
const lic3Name = t => String(t).split(' ').map((w, i) =>
  /^[A-Z]{2,}$/.test(w) ? w : i ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
function lic3TileHTML(q){
  const over = licLevel(q) === 'critical', avail = Math.max(q.total - q.used, 0);
  const pct = q.total ? Math.min(100, q.used / q.total * 100) : 0;
  const tone = over ? '--severity-critical' : q.tok, name = lic3Name(q.title);
  /* a real space between label and value, and figure and unit — flex ignores it on screen, but the
     text a screen reader (and textContent) gets is "Available 4,830", not "Available4,830" */
  const pair = (k, v) => `<div class="licovp"><span>${stEsc(k)}</span> <b>${stEsc(v)}</b></div>`;
  return `<section class="licovc licu3" aria-label="${stEsc(name)}">
    <div class="licovl">${agIc(q.icon, 15)}<span>${stEsc(name)}</span>
      <span class="licovact">${over ? `<obs-tag variant="tag-red"><i class="licovdot"></i>Over limit</obs-tag>` : ''}${licHistIcon(q.key)}</span></div>
    <div class="licu3m"><b>${licFmt(q.used)}</b> <span>of ${licFmt(q.total)} ${stEsc(q.unit)}</span></div>
    <span class="licbar licchart" role="img" aria-label="${Math.round(pct)}% of the ${stEsc(q.unit)} allotment used"
      style="--licbar-tone:var(${tone})"><i style="width:${pct.toFixed(1)}%"></i></span>
    <div class="licovg">${pair('Available', licFmt(avail))}${pair('Used', Math.round(pct) + '%')}</div>
  </section>`;
}
const lic3CardsHTML = () => `<div class="licu3g">${LIC_DATA.quotas.map(lic3TileHTML).join('')}</div>`;
/* ⚠️ ONE CONTAINER ID FOR BOTH OPTIONS (#licQCards), so `licSetRange`'s repaint picks the builder
   by option rather than writing Option 2's cards into Option 3's grid. */
/* ⚠️ EVERY OPTION FROM 2 TO 5 NOW HAS THE SECTION HEAD AND ITS CARDS IN #licQCards, so the window
   switch's repaint (`licSetRange`) reaches whichever cards the open option draws. */
const licQCardsHTML = () =>
    LIC.opt === '4' ? lic4DevHTML() + lic4AddonsHTML()
  /* ⚠️ Option 5's simplified devices card (`lic5DevHTML`, `.licd5`) was REMOVED (request, 14 Sep 2026:
     "remove this card in option 5") — kept and unreferenced, one call away. */
  : LIC.opt === '5' ? lic4DevHTML('5') + lic4AddonsHTML('5') + lic5RumRingHTML()
  : licAddonCardsHTML();
const LIC_QHINT = 'History opens the trend and a CSV export';
function licUsageHTML(){
  /* ⚠️ OPTION 2 GAINED THE SECTION HEAD (14 Sep 2026: "add this below the ObserveOps edition card"),
     over its six quota cards. ⚠️ THE HINT DROPS "Expand a row for its metering rule" — Option 2 has
     no rows to expand, so that half would describe a control that is not on screen. */
  if (LIC.opt === '2') return licHeroHTML() + licQuotaHeadHTML(LIC_QHINT)
    + `<div class="licqcards" id="licQCards">${licQCardsHTML()}</div>`;
  /* ⚠️ THE SECTION HEAD IS ON EVERY OPTION NOW (request, 14 Sep 2026: "add this in all option 1-5"),
     which REVERSES "remove this in option 3 & 4" for the head. Options 3–5 use Option 2's hint. The
     notes below record how each option got here. */
  /* ⚠️ OPTIONS 3 AND 4 HAVE NO QUOTA SECTION (14 Sep 2026: "remove this in option 3 & 4", pointing at
     the head and the grid). CONSEQUENCE, stated: the grid was their only door to the History drawer
     and the metering-rule detail, so neither option reaches those any more; Option 1 still does. */
  /* ⚠️ …AND OPTION 3 GAINED THE SIX QUOTAS BACK (14 Sep 2026: "add in option 3") — then, the same
     day, as its own simple tiles (see `lic3TileHTML`). NOT the section head that "remove this in
     option 3 & 4" took away. The tiles restore Option 3's door to the History drawer. Option 4 still
     has neither. */
  /* (Option 3's route was removed with it from the switcher — see LIC_OPTS.) */
  /* ⚠️ …but Option 4 gained its own Monitored devices card (14 Sep 2026: "in option 4 add this card")
     under the licence card — see `lic4DevHTML`. Its History button is Option 4's door to the drawer. */
  if (LIC.opt === '4') return lic4HTML() + licQuotaHeadHTML(LIC_QHINT)
    + `<div class="licqcards" id="licQCards">${licQCardsHTML()}</div>`;
  /* ⚠️ OPTION 5 HAS NO QUOTA GRID (request: "create only this") — its licence card, then the
     Monitored devices card (a later request the same day). */
  /* …and Option 5 is its licence card, the head, the supplied quota devices card (`lic4DevHTML('5')`)
     and the five add-on cards — its simplified devices card was removed the same evening. */
  if (LIC.opt === '5') return lic4HTML('5') + licQuotaHeadHTML(LIC_QHINT)
    + `<div class="licqcards" id="licQCards">${licQCardsHTML()}</div>`;
  return licOverviewHTML() + licQuotaHeadHTML('Expand a row for its metering rule · History opens the trend and a CSV export')
    + `<obs-table id="licTable" row-key="id" expandable sortable="false"
      columns="${agJ(licCols())}" rows="${agJ(licRows())}"></obs-table>`;
}
/* the quota grid. Declared as a function because two headers name the window — and because the
   column set follows the width: at 1280 with the settings list open the pane is ~950px, and ten
   columns wrapped every label to three lines and pushed History past the edge. Below 1366px the
   two derivable columns go (Remaining = Allotted − Used; Change is the sparkline's own delta and
   reads "—" on five of six rows), and the others take the room. `licAfter` re-sets the columns
   when the query flips. */
const LIC_MQ = '(max-width:1366px)';
function licCols(){
  const narrow = window.matchMedia && window.matchMedia(LIC_MQ).matches;
  const cols = [
    { key:'name',   title:'Entitlement', type:'link',  width: narrow ? '24%' : '19%' },
    { key:'token',  title:'Metric',                    width: narrow ? '18%' : '17%' },
    { key:'used',   title:'Used',        align:'right', width:'7%' },
    { key:'total',  title:'Allotted',    align:'right', width: narrow ? '13%' : '11%' },
    { key:'pct',    title:'Usage',       type:'bar',   width: narrow ? '13%' : '10%' },
    { key:'remain', title:'Remaining',   align:'right', width:'8%' },
    { key:'trend',  title:'Trend · ' + LIC.range + 'd',  type:'sparkline', width: narrow ? '12%' : '10%' },
    { key:'change', title:'Change · ' + LIC.range + 'd', align:'right', width:'8%' },
    { key:'status', title:'Status',      type:'status', width: narrow ? '9%' : '7%' },
    { key:'hist',   title:'',            type:'button', width: narrow ? '4%' : '3%' },
  ];
  return narrow ? cols.filter(c => c.key !== 'remain' && c.key !== 'change') : cols;
}
/* re-set the grid's columns when the width query flips — attributes only, no repaint */
function licColsSync(){
  const tb = document.getElementById('licTable'); if (!tb) return;
  tb.setAttribute('columns', JSON.stringify(licCols()));
}
function licRows(){
  return LIC_DATA.quotas.map(q => {
    const s = licSeries(q, LIC.range), ch = q.used - s[0];
    return { id:q.key, name:{ text:q.title, icon:q.icon }, token:q.token,
      used:licFmt(q.used), total:licFmt(q.total) + ' ' + q.unit,
      pct: q.total ? Math.round(q.used / q.total * 100) : 0,
      remain: licFmt(Math.max(q.total - q.used, 0)), trend:s,
      change: ch ? (ch > 0 ? '▲ +' : '▼ −') + licFmt(Math.abs(ch)) : '—',
      status: licLevel(q),
      hist:{ text:'History', icon:'history', variant:'transparent' },
      detail: licDetailHTML(q) };
  });
}
/* ⚠️ THE DETAIL IS INNER-HTMLed INTO obs-table's SHADOW ROOT — and custom elements written there
   still upgrade (measured: nested obs-key-value and obs-table both get a shadow root and render),
   so the detail is DS all the way down: obs-banner for the metering rule, obs-key-value for the split, and a
   NESTED obs-table whose `bar` cells carry the by-type share. The one inline style is the grid
   that stacks them — this stylesheet cannot reach into the shadow root. */
/* ⚠️ THE BAR COLUMN IS NARROWER THAN IT WAS (40% → 28%). At 40% of an already-wide row the
   track ran most of the panel's width, so a 1% share drew a dot at the far left of a very long
   empty rail — the emptiest thing on the screen carrying the least information. The type column
   takes the space back. */
/* ⚠️ 44 / 16 / 40 — AND THE 56% TYPE COLUMN THAT REPLACED IT FOR ONE PASS WAS WORSE. Widening
   the name column to shorten the bar simply moved the empty space: "Cloud" then sat a third of the
   panel away from its own count. The bar looks sparse because five of seven shares are ≤ 4%, which
   is the DATA, not the layout. */
const LIC_TYPE_COLS = [
  { key:'type',  title:'Device type',    width:'44%' },
  { key:'count', title:'Devices',        align:'right', width:'16%' },
  { key:'share', title:'Share of fleet', type:'bar',    width:'40%' },
];
function licDetailHTML(q){
  /* ⚠️ obs-banner, NOT a key-value row: the single-column list caps itself at 480px (`.kv.cols-1`
     in its shadow CSS) and wrapped the rule to six lines beside an empty band. The banner is the
     DS's lead-in + detail message and spans the row; `info` is its own "a hint" variant. */
  const parts = [`<obs-banner variant="info" title="Metered per">${stEsc(q.rule)}</obs-banner>`];
  /* ⚠️ THE DEPLOYMENT SPLIT IS ONE LINE OF TEXT, AND BOTH DS CANDIDATES WERE TRIED AND LOOK
     WORSE. It was `obs-key-value columns="2"`, which put each label at the far left of a wide
     column and its number in the middle — "Agentless (SNMP / API / WMI) ......... 170" read as a
     broken row. Swapping to `obs-metric-list` (the right component on paper: these ARE counts, and
     key-value's own `dont` says "don't use for KPI metrics") was measurably worse HERE: it renders
     the value at KPI size and constrains its label column, so "170" became huge and
     "Agentless (SNMP / API / WMI)" wrapped to two lines for two numbers that are a footnote to the
     table below. Two numbers do not need a component. ⚠️ Reaching for one anyway, to keep a DS
     count up, is the same mistake as using obs-table for a single record's fields — the point is
     the RIGHT component, and sometimes that is none. */
  /* ⚠️ STYLED INLINE, AND IT HAS TO BE: this is inner-HTMLed into obs-table's SHADOW ROOT, which
     the page stylesheet cannot reach. Custom properties DO inherit across the boundary, so every
     value here is still a token. (Same reason the charts carry their height inline.) */
  /* ⚠️ THE LABEL IS NOT LOWERCASED. It read better as a sentence — "170 agentless · 0
     agent-based" — until you see what it does to the acronyms the label carries:
     "agentless (snmp / api / wmi)". The data's own casing wins. */
  if (q.sub) parts.push(`<p style="margin:0;font-size:12.5px;color:var(--text-color-common-secondary)">${
    q.sub.map(x => `<b style="color:var(--page-text-color);font-weight:600">${licFmt(x.value)}</b> ${
      stEsc(x.label)}`).join(' &middot; ')}</p>`);
  if (q.deploy){
    const tot = q.deploy.reduce((a, d) => a + d.value, 0) || 1;
    const rows = q.deploy.map(d => ({ id:d.label.toLowerCase().replace(/\W+/g, '-'), type:d.label,
      count:licFmt(d.value), share:Math.round(d.value / tot * 100) }));
    /* ⚠️ `variant="borderless"` AND `header-style="tinted"` ARE REAL obs-table LEVERS, read out of
       the bundle (the element builds its class list as `grid hs-<headerStyle> v-<variant>`; the
       stylesheet carries .v-bordered / .v-borderless / .v-borderless-rows / .v-plain / .v-card and
       .hs-tinted / .hs-default). A fully-bordered grid nested INSIDE a row of another grid drew a
       second table's worth of chrome for seven rows — which is what made this panel read as heavy.
       Borderless keeps the columns and the header meaning and drops the box. */
    parts.push(`<obs-table row-key="id" sortable="false" variant="borderless"
      columns="${agJ(LIC_TYPE_COLS)}" rows="${agJ(rows)}"></obs-table>`);
  }
  /* the one inline style: this stylesheet cannot reach into obs-table's shadow root, where the
     detail is inner-HTMLed. 16px is @padding-md on the DS structural scale. */
  return `<div style="display:grid;gap:12px;padding:2px 0 4px">${parts.join('')}</div>`;
}

/* ⚠️ THE WINDOW SWITCH SETS THE GRID'S ATTRIBUTES — IT DOES NOT REPAINT THE PAGE. A repaint
   would rebuild the tabs (and every open detail row) under the pointer. `setAttribute` takes
   RAW JSON, not `agJ()` (the recorded trap: escaped JSON reaches the component as literal
   `&quot;`). */
function licSetRange(v){
  v = +v; if (!v || v === LIC.range) return; LIC.range = v;
  /* Options 2 and 3's cards are repainted as a block (no card holds open state). ⚠️ Since the change
     figure went (14 Sep 2026) nothing ON a card reads the window — the switch now sets the History
     drawer's starting window (`licHistOpen` copies it into `LIC.hrange`) and Option 1's grid. */
  const qc = document.getElementById('licQCards'); if (qc) qc.innerHTML = licQCardsHTML();
  const tb = document.getElementById('licTable'); if (!tb) return;
  tb.setAttribute('columns', JSON.stringify(licCols()));
  tb.setAttribute('rows', JSON.stringify(licRows()));
}

/* ── history — the DS's own obs-drawer (12 Sep 2026) ───────────────────────── */
/* This was `stcDrOpen`, the house `.sdrawer`. The DS catalogues `drawer` as the product's
   most-used overlay (158×) and its decisionFlow puts exactly this content in one: "Long content,
   a detail view, or a form contextual to a record? -> FlotoDrawer". Switching also buys the
   native `<dialog>` behaviours the house drawer hand-rolls — top-layer render, a focus trap and
   Esc — which is why it is worth the two workarounds below.
   ⚠️ THE TWO v0.1.166 DEFECTS ARE REAL AND WERE RE-MEASURED, not taken on trust. The DS
   registry now describes obs-drawer as FUNCTIONAL ("✕ / Esc / [data-close] emit close then
   after-close"); the bundle this repo vendors does NOT do that. Driven in a headless probe:
     · `el.show()` opens it, the `open` ATTRIBUTE opens it, and the title / default / actions
       slots all render — so the element is usable;
     · but clicking its ✕ fires NO event on the host, leaves `el.open` false throughout, and
       never touches the host's `open` attribute. The ONE signal every close path shares is the
       INNER `<dialog>`'s own `open` attribute going false — which is what `licHistWatch`
       observes. Re-check this if `_ds/` is ever upgraded; the workaround can then go.
   ⚠️ THE ELEMENT IS CREATED ONCE AND REUSED, and it lives on `<body>`. Rebuilding it per open
   would replay the slide-in and re-cost the shadow root; `<body>` keeps it clear of
   `#view-settings`, which is `display:none` whenever Settings is not the active view — a
   `position:fixed` child of a hidden ancestor is hidden too, top layer or not.
   ⚠️ ONLY THE INNER CONTENT IS EVER REPAINTED (`#licHist`.innerHTML, and the footer note's
   textContent). Replacing a node the drawer has SLOTTED fires `slotchange` and re-renders the
   component — the recorded trap that made the Agentic AI wizard flash on every Continue. */
function licHistEl(){
  let d = document.getElementById('licHistDr');
  if (d) return d;
  d = document.createElement('obs-drawer');
  d.id = 'licHistDr';
  d.setAttribute('width', '720px');
  /* the footer's own `.lichf` already carries `display:flex; gap:8px`, which is also the
     work-around for the registry's F3 ("the .actions footer is justify-end with NO gap, so
     adjacent buttons touch") — the gap is on our slotted span, not on its shadow footer. */
  d.innerHTML = `<div id="licHist"></div>
    <span slot="actions" id="licHistF" class="lichf">
      <span class="lichnote" id="licHistNote"></span>
      <obs-button variant="default" onclick="agTap(licHistClose)">Close</obs-button>
      <obs-button variant="primary" onclick="agTap(licHistCsv)">${agIc('export-csv', 14)}Export as CSV</obs-button>
    </span>`;
  document.body.appendChild(d);
  return d;
}
/* ── Option 5's history is a CENTRED MODAL (request, 14 Sep 2026: "in option 5 when I click the History
   button, the sidebar will convert to a center popup", with a supplied popup as the reference) ──────────
   Same data, same chart, same CSV as the drawer — only the container and the layout of its head differ:
   the entitlement's token behind a swatch in its tone, RANGE on the right, then the five figures as ONE
   filled band of label-over-value columns (CURRENT in the tone, a positive CHANGE in green, as the
   reference draws them), then the chart and its axis, and a footer of the window beside Close · Export.
   ⚠️ IT IS obs-modal, THE DS's DIALOG, placed INSIDE `#licPage` like the Activation Code modal — the
   top layer renders it, but custom properties still inherit through the DOM, so the scoped DS token
   block reaches it (the obs-drawer on `<body>` needed its id added to that block; this does not).
   ⚠️ ITS IDS ARE ITS OWN (`licHistM`, `licHMRange`). The drawer is created once
   on `<body>` and survives an option switch, so sharing `licHist` / `licHRange` would put two
   elements under one id the moment someone opened History on Option 1 and then on Option 5.
   ⚠️ obs-modal LEAVES `open` TRUE AFTER ITS OWN ✕ (recorded) — `licAfter` syncs it on close/cancel.
   ⚠️ OPTIONS 2 AND 4 USE IT TOO (request, 15 Sep 2026: "the History centre popup UI — copy and apply in
   option 2 & 4"). LIC_HIST_MD is the one list both the render (licHTML) and the router (licHistOpen)
   read, so the two cannot disagree. Option 1 keeps the drawer. */
const LIC_HIST_MD = ['2', '4', '5'];
/* ⚠️ …AND IT IS LAID OUT LIKE METRIC EXPLORER's CHART POPUP (request, 14 Sep 2026: "improve this popup
   [to be] like this", with Metric Explorer's full-width metric popup as the reference). One head row —
   the title at the left; the range, the window's two dates stacked, Export as CSV and ✕ at the right —
   then the chart across the whole width, then a row of label-over-value facts under it. It is
   `calc(100vw - 48px)` wide (obs-modal's own max), and the head / foot obs-modal draws are hidden for
   THIS dialog only, by a `:host(.lichmx)` rule in the corner hook, because obs-modal's header takes a
   title and a ✕ and nothing else. Esc and the backdrop still close it natively. */
function licHistMdHTML(){
  return `<obs-modal id="licHistMd" class="lichmx" title="Historical Consumption" width="calc(100vw - 48px)" hide-footer>
    <div id="licHistM" class="lichx"></div>
  </obs-modal>`;
}
function licHistMdOpen(q){
  const md = document.getElementById('licHistMd'); if (!md) return;
  LIC.hist = q.key; LIC.hrange = LIC.range;
  md.setAttribute('title', q.title + ' · Historical Consumption');
  licHistMdPaint();
  md.open = true;
}
function licHistMdClose(){
  const md = document.getElementById('licHistMd'); if (!md) return;
  if (md.open) LIC.hist = null;
  md.open = false;
}
function licHistMdPaint(){
  const b = document.getElementById('licHistM'); if (b) b.innerHTML = licHistMdBodyHTML();
  const rg = document.getElementById('licHMRange');
  licRadioSync('licHMRange', LIC.hrange);
  if (rg) rg.addEventListener('change', e => { LIC.hrange = +licVal(e); licHistMdPaint(); });
}
function licHistMdBodyHTML(){
  /* ⚠️ THE DETAILS ARE THE CENTRED POPUP's, ONLY THE LAYOUT IS METRIC EXPLORER's (request, 14 Sep 2026:
     "after I click History the details are the same — change only the UI"). So: the token behind its
     swatch · RANGE · Current / Period start / Peak / Average / Change as bare figures (CURRENT in the
     tone, a rise in green) · the chart with its "license cap" legend · the window's two dates · Close ·
     Export as CSV. Nothing is added — an earlier pass here had brought in Entitlement / License cap /
     Min / Max facts and units, and those went with this request. */
  const q = licQuota(LIC.hist); if (!q) return '';
  const days = LIC.hrange, s = licSeries(q, days), st = licStats(q, s);
  const w = licHistWindow(), cap = q.trend ? 0 : q.total, end = licToday();
  const dates = s.map((_, i) => new Date(end - (s.length - 1 - i) * 864e5));
  const fact = (k, v, cls) => `<div class="lichxv${cls ? ' ' + cls : ''}"><span>${k}</span><b>${v}</b></div>`;
  const chg = (st.change > 0 ? '+' : st.change < 0 ? '−' : '') + licFmt(Math.abs(st.change));
  return `<div class="lichxh">
      <span class="lichxtt"><b class="lichxt">${stEsc(q.title)} · Historical Consumption</b>
        <span class="lichxtok" style="--lichm-a:var(${q.tok})"><i class="lichxsw"></i>${stEsc(q.token)}</span></span>
      <span class="lichxr">
        <span class="lichrng">Range
          <obs-radio id="licHMRange" as-button size="small" options="${agJ(LIC_RANGES)}" value="${days}"></obs-radio></span>
        <span class="lichxd"><span>${licFull(w.start)} →</span><span>${licFull(w.end)} · ${days} days</span></span>
        <obs-button variant="primary" onclick="agTap(licHistCsv)">${agIc('export-csv', 14)}Export as CSV</obs-button>
        <obs-button class="lichxx" variant="neutral-lightest" aria-label="Close" data-tip="Close" onclick="agTap(licHistMdClose)">${agIc('times', 14)}</obs-button>
      </span>
    </div>
    <div class="lichxc">
      ${licHistChart(s, q, { W:1480, H:460, dates })}
      ${cap ? `<div class="lichxcap"><span>– – license cap ${licFmt(cap)}</span></div>` : ''}
    </div>
    <div class="lichxf" style="--lichm-a:var(${q.tok})">
      ${fact('Current', licFmt(st.current), 'cur')}${fact('Period start', licFmt(st.start))}${fact('Peak', licFmt(st.peak))}${fact('Average', licFmt(st.avg))}${fact('Change', chg, st.change > 0 ? 'up' : '')}
    </div>`;
}

/* the only signal every close path shares — see the note above */
function licHistWatch(d){
  if (LIC.drw) return;
  const dlg = d.shadowRoot && d.shadowRoot.querySelector('dialog');
  if (!dlg) return;
  LIC.drw = new MutationObserver(() => {
    /* ⚠️ a teardown looks exactly like a user close without this guard — the recorded
       `agWiz` fault, where clearing state on a disconnected node made Continue close the panel */
    if (!dlg.isConnected || dlg.open) return;
    LIC.hist = null;
  });
  LIC.drw.observe(dlg, { attributes:true, attributeFilter:['open'] });
}
function licHistClose(){
  licHistMdClose();
  const d = document.getElementById('licHistDr'); if (!d) return;
  if (typeof d.hide === 'function') d.hide(); else d.removeAttribute('open');
}
function licHistOpen(key){
  const q = licQuota(key); if (!q) return;
  if (LIC_HIST_MD.includes(LIC.opt) && document.getElementById('licHistMd')) return licHistMdOpen(q);
  LIC.hist = key; LIC.hrange = LIC.range;
  const d = licHistEl();
  d.setAttribute('title', q.title + ' · Historical Consumption');
  document.getElementById('licHist').innerHTML = licHistBodyHTML();
  document.getElementById('licHistNote').textContent = licHistNote();
  if (typeof d.show === 'function') d.show(); else d.setAttribute('open', '');
  licHistWatch(d);
  licHistBind();
}
function licHistWindow(){ const end = licToday(); return { start:new Date(end - LIC.hrange * 864e5), end }; }
function licHistNote(){ const w = licHistWindow(); return `${licFull(w.start)} → ${licFull(w.end)} · ${LIC.hrange} days`; }
function licHistBodyHTML(){
  const q = licQuota(LIC.hist), days = LIC.hrange, s = licSeries(q, days), st = licStats(q, s);
  const items = [[licFmt(st.current), q.unit, 'Current'], [licFmt(st.start), q.unit, 'Period start'],
                 [licFmt(st.peak), q.unit, 'Peak'], [licFmt(st.avg), q.unit, 'Average'],
                 [(st.change > 0 ? '+' : st.change < 0 ? '−' : '') + licFmt(Math.abs(st.change)), q.unit, 'Change over ' + days + ' days']];
  const w = licHistWindow(), cap = q.trend ? 0 : q.total;
  return `<div class="lichtop">
      <obs-tag variant="tag-primary">${stEsc(q.token)}</obs-tag>
      <span class="lichrng">Range
        <obs-radio id="licHRange" as-button size="small" options="${agJ(LIC_RANGES)}" value="${days}"></obs-radio></span></div>
    <obs-metric-list items="${agJ(items)}"></obs-metric-list>
    <div class="lichchart">${licHistChart(s, q)}</div>
    <div class="lichaxis"><span>${licFull(w.start)}</span>${cap ? `<span class="cap">– – license cap ${licFmt(cap)}</span>` : ''}<span>${licFull(w.end)}</span></div>`;
}
function licHistBind(){
  const rg = document.getElementById('licHRange');
  licRadioSync('licHRange', LIC.hrange);
  if (rg) rg.addEventListener('change', e => {
    LIC.hrange = +licVal(e);
    const b = document.getElementById('licHist'); if (b) b.innerHTML = licHistBodyHTML();
    const n = document.getElementById('licHistNote'); if (n) n.textContent = licHistNote();
    licHistBind();
  });
}
/* the live chart's shape: an area under the line, the cap as a dashed red rule, and the scale
   running to the CAP when there is one (as live — a 170-device fleet under a 5,000 cap reads as
   a line near the floor, which is the point), to the data when there is not. */
function licHistChart(s, q, o){
  /* `o` (Option 5's wide modal): a larger viewBox so its 11px labels stay 11px at ~1,500px wide
     instead of scaling up 2.3×, and date labels along the x axis. The drawer passes nothing. */
  o = o || {};
  const W = o.W || 640, H = o.H || 220, L = 46, R = 12, T = 12, B = o.dates ? 30 : 22, pw = W - L - R, ph = H - T - B;
  const cap = q.trend ? 0 : q.total, top = licNice(Math.max(cap, Math.max(...s), 1) * 1.06), ticks = 4;
  const y = v => T + ph - (v / top) * ph, f = n => n.toFixed(1), n = s.length, xs = i => L + pw * i / Math.max(1, n - 1);
  const grid = [...Array(ticks + 1)].map((_, i) => { const v = top * i / ticks, yy = f(y(v));
    return `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="var(--neutral-lighter)"/>` +
           `<text x="${L - 8}" y="${f(y(v) + 3.5)}" text-anchor="end" font-size="11" fill="var(--neutral-light)">${licFmt(Math.round(v))}</text>`; }).join('');
  const pts = s.map((v, i) => `${f(xs(i))},${f(y(v))}`).join(' ');
  const step = o.dates ? Math.max(1, Math.round((n - 1) / 10)) : 0;
  const xl = o.dates ? s.map((_, i) => (i % step === 0 || i === n - 1) && !(i !== n - 1 && n - 1 - i < step / 2)
      ? `<text x="${f(xs(i))}" y="${H - 8}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}" font-size="11" fill="var(--neutral-light)">${o.dates[i].toLocaleDateString('en-US', { month:'short', day:'numeric' })}</text>` : '').join('') : '';
  return `<svg class="licchart" viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;font-family:inherit" aria-hidden="true">${grid}${xl}
    <line x1="${L}" x2="${W - R}" y1="${f(T + ph)}" y2="${f(T + ph)}" stroke="var(--border-color)"/>
    <polygon points="${f(xs(0))},${f(T + ph)} ${pts} ${f(xs(n - 1))},${f(T + ph)}" fill="var(${q.tok})" opacity=".14"/>
    <polyline points="${pts}" fill="none" stroke="var(${q.tok})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${cap ? `<line x1="${L}" x2="${W - R}" y1="${f(y(cap))}" y2="${f(y(cap))}" stroke="var(--secondary-red)" stroke-dasharray="4 3"/>` : ''}
    <circle cx="${f(xs(n - 1))}" cy="${f(y(s[n - 1]))}" r="3" fill="var(${q.tok})" stroke="var(--page-background-color)" stroke-width="1.5"/></svg>`;
}
/* the live modal's own CSV: date,resource,value,cap,utilization_pct — newest row first */
function licHistCsv(){
  const q = licQuota(LIC.hist); if (!q) return;
  const days = LIC.hrange, s = licSeries(q, days), end = licToday(), cap = q.trend ? '' : q.total;
  const head = ['date', 'resource', 'value', 'cap', 'utilization_pct'];
  const body = s.map((v, i) => [licFull(new Date(end - (days - i) * 864e5)), q.title, v, cap, cap ? (v / cap * 100).toFixed(1) : '']).reverse();
  if (typeof lxDownload !== 'function') return toast('CSV export needs the Log Explorer helpers this page does not carry');
  const csv = [head].concat(body).map(r => r.map(lxCsvCell).join(',')).join('\r\n');
  const name = `license-${q.key}-${days}d-${lxFileStamp()}.csv`;
  if (!lxDownload(name, csv, 'text/csv')) return toast('The browser blocked the download — open this page over http rather than file://');
  toast(`Exported ${body.length} days of ${q.title} to ${name}`);
}

/* ── Export ─────────────────────────────────────────────────────────────────────────────── */
/* live `handleExport` renders the page to an image named license-<edition>; a single
   self-contained file has no image writer, and the browser's print dialog is a real PDF one —
   the stcExport rule: say so rather than ship a fake */
function licExport(){
  toast('Printing the Product License report — choose “Save as PDF” in the print dialog');
  setTimeout(() => window.print(), 260);
}

/* ── Upgrade Now — the live Activation Code modal, on obs-modal ─────────────────────────── */
/* live: `activateNow(){ this.showActivationCode = true }` → ActivationCodeModal (MModal 720):
   an "Upgradation code" cell + the current code + a copy cell, "Please email the above
   activation code to support@motadata.com" (a mailto with the code in the body), a required
   6-row textarea "Paste your code here...", Cancel · Activate License → PUT
   /settings/license/{id} {license.activation.code} → the licence is re-fetched. */
/* ⚠️ `block` ON THE PASTE BOX, NOT `width:100%` ON THE HOST. obs-input's textarea group is a
   hardcoded 280px (`.grp.area{width:280px}` in its shadow CSS, measured); only its own `block`
   attribute switches the group to the host's width. `rows` is not a prop it reads either — the
   field stays at its three rows and grows with the paste. */
function licActHTML(){
  const L = LIC_DATA.license, mail = licMailHref();
  return `<obs-modal id="licAct" title="Activation Code" width="720">
    <div class="licact">
      ${/* ⚠️ THE PASTE BOX LEADS (request, 15 Sep 2026: "swap the 'Upgradation code' & 'New license code'"). The live modal
         puts the current code first; here the field you act in comes first and the code you send sits under it. The help
         sentence moved with its block, so "above"/"below" were rewritten — left as they were, it would point the wrong way.
         .licact is a grid on one 12px gap, so no spacing depended on the order. */ ''}
      <obs-input id="licCode" type="textarea" block label="New license code" placeholder="Paste your code here..."></obs-input>
      <p class="lichelp2" id="licActHint">${licActHint()}</p>
      <div class="liccode"><obs-input id="licCodeCur" label="Upgradation code" value="${stEsc(L.code)}" readonly block></obs-input>
        <obs-button variant="neutral-lightest" aria-label="Copy activation code" onclick="agTap(licCopy)">${agIc('copy', 14)}</obs-button></div>
      <p class="lichelp">Please email this activation code to <obs-link href="${mail}">support@motadata.com</obs-link>. The new license code comes back by mail — paste it above to activate.</p>
    </div>
    <span slot="footer" class="licactf">
      <obs-button variant="default" onclick="agTap(licActClose)">Cancel</obs-button>
      <obs-button variant="primary" id="licActBtn" disabled onclick="agTap(licActivate)">Activate License</obs-button>
    </span>
  </obs-modal>`;
}
/* the gate says WHY it is shut — a disabled primary with no reason beside it is the dead end
   the Designer's Guide forbids (the agConsText rule) */
const licActHint = () => LIC.code.trim() ? 'Activating replaces the current license with the entitlements in this code.' : 'Activate License is enabled once a code is pasted.';
/* Option 4's Activation code disclosure — flips a class and the button's state, never repaints */
function lic4ActTog(){
  LIC.act4 = !LIC.act4;
  const sec = document.querySelector('#licPage .lic4ax'), b = document.querySelector('#licPage .lic4axb');
  if (sec) sec.classList.toggle('open', LIC.act4);
  if (b){ b.classList.toggle('open', LIC.act4); b.setAttribute('aria-expanded', LIC.act4 ? 'true' : 'false'); b.setAttribute('data-tip', (LIC.act4 ? 'Hide' : 'Show') + ' the activation code'); }
}
function licActOpen(){ const md = document.getElementById('licAct'); if (!md) return; md.open = true; licActPaint(); }
function licActClose(){ const md = document.getElementById('licAct'); if (md) md.open = false; }
function licActPaint(){
  const b = document.getElementById('licActBtn'); if (b){ if (LIC.code.trim() && !LIC.busy) b.removeAttribute('disabled'); else b.setAttribute('disabled', ''); if (LIC.busy) b.setAttribute('loading', ''); else b.removeAttribute('loading'); }
  const h = document.getElementById('licActHint'); if (h) h.textContent = licActHint();
}
function licCopy(){
  const code = LIC_DATA.license.code;
  const done = () => toast('Activation code copied!');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, () => toast('Copy blocked — select the code and copy it by hand'));
  else toast('Copy blocked — select the code and copy it by hand');
}
/* ⚠️ THE MODAL CLOSES BEFORE THE PAGE REPAINTS. `stMainPaint` rebuilds `#stMain`, and a native
   <dialog> destroyed while it is in the top layer leaves the page inert behind nothing. */
function licActivate(){
  if (LIC.busy || !LIC.code.trim()) return;
  LIC.busy = true; licActPaint();
  setTimeout(() => {
    const L = LIC_DATA.license, t = licToday(), e = new Date(t); e.setFullYear(e.getFullYear() + 1);
    const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    L.type = 'Annual Subscription'; L.issued = iso(t); L.expires = iso(e); L.status = 'active';
    L.code = LIC.code.trim().replace(/\s+/g, '').toUpperCase().slice(0, 40) || L.code;
    LIC.code = ''; LIC.busy = false;
    licActClose();
    stMainPaint();
    toast('License activated — Annual Subscription, valid until ' + licLong(e));
  }, 900);
}

/* ── tab 2 · EPS Trend Breakdown ────────────────────────────────────────────────────────── */
const LIC_EPS_COLS = [
  { key:'signal', title:'Signal',        width:'20%' },
  { key:'share',  title:'Share of pool', width:'16%' },
  { key:'alloc',  title:'Allocated',     align:'right', width:'15%' },
  { key:'live',   title:'Ingested live', align:'right', width:'15%' },
  { key:'util',   title:'Utilization',   type:'bar',    width:'20%' },
  { key:'state',  title:'State',         type:'status', width:'14%' },
];
/* 24 hourly points ending at the live figure, seeded per signal */
function licEpsSeries(sig){
  const r = licRng(sig.alloc * 31 + sig.live * 7 + 3), out = [];
  for (let i = 0; i < 24; i++){ const wave = Math.sin((i - 6) / 24 * Math.PI * 2) * 0.18; out.push(Math.max(0, Math.round(sig.live * (0.82 + wave + (r() - 0.5) * 0.22)))); }
  out[23] = sig.live; return out;
}
function licEpsHTML(){
  const E = LIC_DATA.eps, alloc = E.signals.reduce((a, s) => a + s.alloc, 0), live = E.signals.reduce((a, s) => a + s.live, 0);
  const dropping = live > alloc;
  const kpi = [[licFmt(E.ceiling), 'eps', 'Hardware ceiling'],
               [licFmt(alloc), 'eps', 'Allocated (' + Math.round(alloc / E.ceiling * 100) + '% of ceiling)'],
               [licFmt(live), 'eps', 'Ingested live (' + Math.round(live / alloc * 100) + '% utilization)'],
               [dropping ? 'dropping' : 'clean', '', 'Drop status (' + (dropping ? 'over allocation' : 'within limits') + ')', dropping ? '--severity-critical' : '--severity-clear']];
  const policy = [['Notify', E.notify], ['Drop', E.drop]];
  const rows = E.signals.map(s => ({ id:s.key, signal:s.label, share:Math.round(s.alloc / alloc * 100) + '% of pool',
    alloc:licFmt(s.alloc) + ' eps', live:licFmt(s.live) + ' eps', util:Math.round(s.live / s.alloc * 100), state:s.live > s.alloc ? 'critical' : 'healthy' }));
  const per = E.signals.map(s => ({ label:s.label, tok:s.tok, alloc:s.alloc, live:s.live, series:licEpsSeries(s) }));
  const total = { label:'Total · all telemetry', tok:'--chart-indigo', alloc, live,
    series: per[0].series.map((_, i) => per.reduce((a, p) => a + p.series[i], 0)) };
  /* the two summary tiles are the DS widget: its `widget` toolbar as the header, a DS list inside */
  const tile = (title, body) => `<div class="lictile"><obs-toolbar variant="widget" title="${title}"></obs-toolbar><div class="lictileb">${body}</div></div>`;
  /* the legend is a row of obs-tags — a chart's legend is chart chrome, but the chips are the DS's */
  const legend = [['ingested', '--page-text-color', 'horizontal-rule'], ['dropped', '--secondary-red', 'horizontal-rule'], ['allocated', '--neutral-light', 'minus']]
    .map(([t, tok, ic]) => `<obs-tag variant="tag-primary"><span style="color:var(${tok})">${agIc(ic, 12)}</span> ${t}</obs-tag>`).join('');
  return `<div class="licgrid2">
      ${tile('Events per second', `<obs-metric-list items="${agJ(kpi)}"></obs-metric-list>`)}
      ${tile('Drop policy', `<obs-key-value variant="plain" items="${agJ(policy)}"></obs-key-value>`)}
    </div>
    <obs-toolbar class="lictb"><span slot="start" class="lictbt">Dynamic EPS · allocation by signal</span><span class="lichint">allocated vs live ingested</span></obs-toolbar>
    <obs-table id="licAlloc" row-key="id" sortable="false" columns="${agJ(LIC_EPS_COLS)}" rows="${agJ(rows)}"></obs-table>
    <obs-toolbar class="lictb"><span slot="start" class="lictbt">Calculated vs actual EPS · per telemetry</span><span class="liclegend">${legend}</span></obs-toolbar>
    <div class="lictiles">${licTileHTML(total, true)}${per.map(p => licTileHTML(p, false)).join('')}</div>`;
}
/* Option 5's EPS tab is ONLY these four cards and the drop-policy note under them (request, 15 Sep
   2026: "remove all details and add [the strip] as individual cards", then "add [the drop policy]
   as a note"). Options 1, 2 and 4 keep licEpsHTML's full tab. The figures
   are LIC_DATA's — the same ones the other options' EPS tab reads — not the supplied picture's:
   the allocation sums to 951 (the picture's live instance said 949) and the ingest is the seeded
   511 eps, where the idle instance read 0. */
function lic5EpsHTML(){
  const E = LIC_DATA.eps, alloc = E.signals.reduce((a, s) => a + s.alloc, 0), live = E.signals.reduce((a, s) => a + s.live, 0);
  const dropping = live > alloc;
  const card = (label, value, sub, tok) => `<div class="lice5c" role="group" aria-label="${label}">
      <span class="lice5l">${label}</span>
      <span class="lice5v"${tok ? ` style="color:var(${tok})"` : ''}>${value}</span>
      <span class="lice5s">${sub}</span></div>`;
  return `<div class="lice5${LIC.opt === '4' ? ' lice5o4' : ''}"><div class="lice5g">
    ${card('Hardware ceiling', licFmt(E.ceiling), 'eps · auto-derived')}
    ${card('Allocated', licFmt(alloc), Math.round(alloc / E.ceiling * 100) + '% of ceiling', '--info-text')}
    ${card('Ingested live', licFmt(live), Math.round(live / alloc * 100) + '% utilization')}
    ${card('Drop status', dropping ? 'dropping' : 'clean', dropping ? 'over allocation' : 'within limits', dropping ? '--severity-critical' : '--severity-clear')}
  </div>
  <obs-banner variant="info" title="Drop policy" class="lice5n"><span class="lice5nr"><b>Notify</b> <span>${stEsc(E.notify)}</span> <b>Drop</b> <span>${stEsc(E.drop)}</span></span></obs-banner>
  ${lic5AllocHTML(E, alloc)}
  ${lic5TrendHTML(E, alloc, live)}
  </div>`;
}
/* Calculated vs actual EPS · per telemetry (request, 15 Sep 2026, from the live product's section,
   "as chart line, using the ObserveOps design system"). The head is obs-toolbar — title in start,
   the three-series legend in the default slot, Option 1's own head for this section. Each card is
   the stat cards' surface: swatch + name, the live figure over its allocation, a line chart, and an
   avg · peak · util footer; Total spans the row (a 2px top accent was removed on request).
   The line is the declared chart gap (data-viz `trend-line`; the DS ships no chart element), drawn
   in DS tokens: the series colour is the signal's LIC_DATA tone (Total takes --info-text, the blue
   the allocation card's ingested fill uses), the allocation a dashed --neutral-light rule, and any
   ingest above it re-stroked in --secondary-red through a clip — the legend's "dropped".
   ⚠️ SAME SERIES AS OPTION 1's TILES (licEpsSeries), so the two options plot one set of numbers. */
const LIC5_TREND = {};   /* key → the series model, filled as the cards render, read by lic5TrendMount */
function lic5TrendHTML(E, alloc, live){
  const per = E.signals.map(s => ({ key:s.key, label:s.label, tok:s.tok, alloc:s.alloc, live:s.live, series:licEpsSeries(s) }));
  const total = { key:'total', label:'Total · all telemetry', tok:'--info-text', alloc, live, full:true,
    series: per[0].series.map((_, i) => per.reduce((a, p) => a + p.series[i], 0)) };
  const key = [['in', 'ingested'], ['dr', 'dropped'], ['al', 'allocated']]
    .map(([k, t]) => `<span><i class="${k}"></i>${t}</span>`).join('');
  return `<div class="lice5t">
    <obs-toolbar class="lice5tb"><span slot="start" class="lictbt">Calculated vs actual EPS · per telemetry</span><span class="lice5lg lice5lk">${key}</span></obs-toolbar>
    <div class="lice5tg">${[total, ...per].map(lic5TrendCard).join('')}</div>
  </div>`;
}
function lic5TrendCard(t){
  t.o4 = LIC.opt === '4';   /* read again by lic5HcConfig / lic5TrendChart, which run off the stored model */
  LIC5_TREND[t.key] = t;
  const avg = Math.round(t.series.reduce((a, b) => a + b, 0) / t.series.length), peak = Math.max(...t.series);
  const util = t.alloc ? Math.round(t.live / t.alloc * 100) : 0;
  /* ⚠️ OPTION 4's TREND CARDS: NO SWATCH, AND THE WINDOW + FIGURES AS TAGS AT THE TOP RIGHT (request, 15 Sep 2026: "remove
     the title box colour … and add top right [Last 24 hours · avg · peak · util]"). The tags are Option 1's EPS tiles' own
     obs-tag row, verbatim, so the two options say it one way. Option 5 renders this same card and keeps its swatch and no
     tags. The avg / peak / util row under the chart is NOT removed — the request said add — so on Option 4 those three
     figures now appear twice per card. */
  const o4 = t.o4;
  const tags = o4 ? `<span class="lice5ktg"><obs-tag variant="tag-primary">Last 24 hours</obs-tag><obs-tag variant="tag-primary">avg ${licFmt(avg)}</obs-tag><obs-tag variant="tag-primary">peak ${licFmt(peak)}</obs-tag><obs-tag variant="tag-primary">util ${util}%</obs-tag></span>` : '';
  return `<div class="lice5c lice5k${t.full ? ' full' : ''}" style="--lice5-tone:var(${t.tok})">
    ${o4 ? `<div class="lice5khr"><span class="lice5kh">${stEsc(t.label)}</span>${tags}</div>` : `<span class="lice5kh"><i class="lice5sw"></i>${stEsc(t.label)}</span>`}
    <span class="lice5kf"><b>${licFmt(t.live)}</b> / ${licFmt(t.alloc)} eps</span>
    <div class="lice5hc licchart${o4 ? ' lice5hct' : ''}" data-lic5k="${t.key}">${lic5TrendChart(t)}</div>
    ${/* ⚠️ NO avg / peak / util ROW ON OPTION 4 (request, 15 Sep 2026: "remove this and add [a] 24 hour time range") — the
       tags at the top right already carry all three, and the chart gains a time axis in the space instead */ o4 ? '' :
    `<span class="lice5kx"><span>avg <b>${licFmt(avg)}</b></span><span>peak <b>${licFmt(peak)}</b></span><span>util <b>${util}%</b></span></span>`}
  </div>`;
}
/* ⚠️ A fixed viewBox that scales UNIFORMLY (the agChart rule), sized so a full-width and a half-width
   card land at the same height (~90px): 1200 x 90 against ~1210px of content, 580 x 90 against ~570. */
function lic5TrendChart(t){
  const W = t.full ? 1200 : 580, H = 90, L = 4, R = 4, T = 6, B = 4, pw = W - L - R, ph = H - T - B;
  const s = t.series, n = s.length, top = licNice(Math.max(t.alloc, ...s, 1) * 1.3);
  const f = v => v.toFixed(1), x = i => L + pw * i / (n - 1), y = v => T + ph - (v / top) * ph;
  const pts = s.map((v, i) => f(x(i)) + ',' + f(y(v))).join(' '), ya = f(y(t.alloc)), id = 'lice5clip-' + t.key;
  const line = stroke => `<polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
  return `<svg class="lice5ch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${stEsc(t.label)}: ingested eps over the last 24 hours against ${licFmt(t.alloc)} eps allocated">
    <defs><clipPath id="${id}"><rect x="0" y="0" width="${W}" height="${ya}"/></clipPath></defs>
    <line x1="${L}" x2="${W - R}" y1="${ya}" y2="${ya}" stroke="var(--neutral-light)" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>
    ${line('var(--lice5-tone)')}
    <g clip-path="url(#${id})">${line('var(--secondary-red)')}</g>
  </svg>${t.o4 ? lic5TimeAxis(t) : ''}`;
}
/* Option 4's 24-hour time axis for the SVG fallback — the same hours the Highcharts axis labels (every 4h, every 2h on
   the full-width card), placed by the point they belong to. The SVG stretches (preserveAspectRatio none), so the labels
   are HTML, not SVG text. Highcharts replaces all of it when it mounts. */
function lic5TimeAxis(t){
  const hour = 36e5, end = Math.floor(Date.now() / hour) * hour, n = t.series.length, step = t.full ? 2 : 4;
  const lab = [];
  for (let i = 0; i < n; i++){ const d = new Date(end - (n - 1 - i) * hour); if (d.getHours() % step === 0)
    lab.push(`<span style="left:${(i / (n - 1) * 100).toFixed(2)}%">${String(d.getHours()).padStart(2, '0')}:00</span>`); }
  return `<div class="lice5ax" aria-hidden="true">${lab.join('')}</div>`;
}
/* Dynamic EPS · allocation by signal (request, 15 Sep 2026, from the live product's card, "using the
   ObserveOps design system"). The header is obs-toolbar (grid variant: title in start, the hint in the
   default slot — the same head Option 1's allocation table has); the bars are the page's declared
   chart gap (the DS ships no meter / bullet element — list_gaps), drawn with DS tokens only; the legend
   is chart chrome in the DS's own --chart-font-family / --chart-legend-color.
   ⚠️ ONE SCALE FOR ALL FOUR ROWS — the largest allocation (or ingest, if a signal is over quota) plus
   5%, which is where the live card puts its markers (Log's at ~95%), so the bars compare across rows.
   ⚠️ "% of pool" is the signal's LIVE ingest as a share of the allocated pool — the live card read 0%
   on every row with nothing ingested, so it cannot be the allocation share Option 1's table prints. */
function lic5AllocHTML(E, alloc){
  /* ⚠️ OPTION 4: NO SWATCH BEFORE THE NAME, THE COLOUR IS IN THE BAR (request, 15 Sep 2026: "remove the legend box and the
     colour will show in the progress bar"). The ingested fill takes the signal's tone, so each bar says which signal it
     is; the legend's "ingested" key becomes a split swatch of the four tones, or it would still say "ingested is blue".
     Option 5 keeps its swatches and the shared --info-text fill. */
  const o4 = LIC.opt === '4';
  const scale = Math.max(...E.signals.map(s => Math.max(s.alloc, s.live))) * 1.05 || 1;
  const pc = v => (v / scale * 100).toFixed(2) + '%';
  const rows = E.signals.map(s => {
    const ing = Math.min(s.live, s.alloc), over = Math.max(0, s.live - s.alloc);
    return `<div class="lice5r">
      <div class="lice5rh">${o4 ? '' : `<i class="lice5sw" style="background:var(${s.tok})"></i>`}<b>${stEsc(s.label)}</b>
        <span class="lice5rs">${alloc ? Math.round(s.live / alloc * 100) : 0}% of pool</span>
        <span class="lice5rf"><b>${licFmt(s.live)}</b> / ${licFmt(s.alloc)} eps</span></div>
      <div class="lice5bar" role="img" aria-label="${stEsc(s.label)}: ${licFmt(s.live)} of ${licFmt(s.alloc)} eps ingested${over ? ', ' + licFmt(over) + ' over quota' : ''}">
        <i class="al" style="width:${pc(s.alloc)}"></i>${ing ? `<i class="in" style="width:${pc(ing)}${o4 ? ';background:var(' + s.tok + ')' : ''}"></i>` : ''}${over ? `<i class="ov" style="left:${pc(s.alloc)};width:${pc(over)}"></i>` : ''}<i class="mk" style="left:${pc(s.alloc)}"></i>
      </div></div>`;
  }).join('');
  const split = o4 ? ` style="background:linear-gradient(90deg,${E.signals.map((s, i, a) => `var(${s.tok}) ${(i / a.length * 100).toFixed(0)}% ${((i + 1) / a.length * 100).toFixed(0)}%`).join(',')})"` : '';
  const key = [['al', 'allocated'], ['in', 'ingested'], ['ov', 'over-quota']]
    .map(([k, t]) => `<span><i class="${k}"${k === 'in' ? split : ''}></i>${t}</span>`).join('');
  return `<div class="lice5c lice5a">
    <obs-toolbar class="lice5tb"><span slot="start" class="lictbt">Dynamic EPS · allocation by signal</span><span class="lichint">allocated vs live ingested · over-quota shaded</span></obs-toolbar>
    <div class="lice5rows">${rows}</div>
    <div class="lice5lg">${key}</div>
  </div>`;
}
/* ── the trend charts on Highcharts (request, 15 Sep 2026: "improve the chart using highcharts.com/demo",
   with the live product's chart and its hover tooltip as the picture) ──────────────────────────
   Highcharts v10 is the PRODUCT'S chart engine, and the DS's data-viz guide now answers a standalone
   chart with it: "copy the matching fixture's config and render with Highcharts v10". The options below
   are the DS's captured chart-multi-line config (@mtdt/observeops-ds-spec 0.1.219, charts/fixtures) —
   spline, a shared HTML tooltip with a crosshair on --chart-tooltip-background / --border-color /
   --chart-font-family, markers off until hover, credits and exporting off — cut down to this card:
   no axis labels, lines or legend (the section head carries the legend, as on the live card), the allocation
   as a dashed y plot line, a soft fill under the ingested line, and Dropped as its own series.
   ⚠️ LOADED ONCE, LAZILY, from jsDelivr, and only when Option 5's EPS tab is painted — no page pays for
   it otherwise. Highcharts is COMMERCIALLY LICENSED; the product holds that licence, and the public
   Pages site now fetches it at runtime. If it cannot load (offline file://), the SVG drawn by
   lic5TrendChart stays in the card: nothing is removed until Highcharts exists.
   ⚠️ EVERY COLOUR IS A var(--token) STRING, as in the DS fixtures, so light/dark flip with no re-render.
   That is also why the fill is a gradient whose stops are color-mix() strings: Highcharts cannot parse
   var() to apply fillOpacity, and a var() fillColor with its default opacity would paint a solid slab.
   ⚠️ DROPPED IS null WHILE WITHIN QUOTA, so no red line sits along the floor of every card; the tooltip
   formatter prints it as 0 there, as the live card does.
   ⚠️ A CHART RENDERED IN THE HIDDEN TAB MEASURES 0 WIDE — a ResizeObserver per container reflows it when
   the tab shows it, and charts whose container a repaint removed are destroyed before the next mount. */
const LIC_HC_SRC = 'https://cdn.jsdelivr.net/npm/highcharts@10.3.3/highcharts.js';
let licHcP = null;
function licHc(){
  if (window.Highcharts) return Promise.resolve(window.Highcharts);
  if (!licHcP) licHcP = new Promise((ok, no) => {
    const sc = document.createElement('script'); sc.src = LIC_HC_SRC; sc.async = true;
    sc.onload = () => window.Highcharts ? ok(window.Highcharts) : no(new Error('Highcharts missing'));
    sc.onerror = () => { licHcP = null; no(new Error('Highcharts failed to load')); };
    document.head.appendChild(sc);
  });
  return licHcP;
}
function lic5TrendMount(){
  if (!document.querySelector('#licPage .lice5hc')) return;
  licHc().then(H => {
    (H.charts || []).forEach(c => { if (c && !c.renderTo.isConnected){ if (c.licRo) c.licRo.disconnect(); c.destroy(); } });
    document.querySelectorAll('#licPage .lice5hc').forEach(el => {
      const t = LIC5_TREND[el.dataset.lic5k]; if (!t || el.dataset.hc) return;
      el.dataset.hc = '1'; el.innerHTML = '';
      const c = H.chart(el, lic5HcConfig(t));
      c.licRo = new ResizeObserver(() => { if (el.offsetWidth && c.chartWidth !== el.offsetWidth) c.reflow(); });
      c.licRo.observe(el);
    });
  }).catch(() => {});
}
function lic5HcConfig(t){
  const hour = 36e5, end = Math.floor(Date.now() / hour) * hour, n = t.series.length;
  const top = licNice(Math.max(t.alloc, ...t.series, 1) * 1.3);
  const at = i => end - (n - 1 - i) * hour;
  const tip = 'var(--chart-font-family)', o4 = !!t.o4;
  return {
    chart:{ type:'areaspline', height:o4 ? 118 : 96, backgroundColor:'transparent', plotBorderColor:'transparent',
            spacing:[6, 0, 2, 0], animation:false, style:{ fontFamily:tip } },
    /* ⚠️ Highcharts creates EMPTY subtitle and caption <text> nodes even with no text, painted in its
       #666666 default — the DS checker counted all ten (token 99) — so both carry a token colour */
    accessibility:{ enabled:false }, title:{ text:null, style:{ color:'var(--page-text-color)' } },
    subtitle:{ text:null, style:{ color:'var(--neutral-light)' } }, caption:{ text:null, style:{ color:'var(--neutral-light)' } },
    credits:{ enabled:false }, exporting:{ enabled:false }, legend:{ enabled:false },
    time:{ useUTC:false },
    /* ⚠️ THE AXES ARE VISIBLE WITH EVERYTHING SWITCHED OFF, not visible:false — Highcharts skips an
       invisible axis's plot lines AND its crosshair, so the allocation rule and the hover line both
       vanished. Every axis colour is set, or its #cccccc / #ccd6eb defaults land in the SVG. */
    /* ⚠️ OPTION 4 LABELS THE 24-HOUR AXIS (request, 15 Sep 2026: "add [a] 24 hour time range"): HH:00 every 4h, every 2h on
       the full-width Total card, in the axis-label token; the chart is 22px taller for it. Option 5's axis stays bare. */
    /* ⚠️ …AND DRAWS THE TIMELINE ITSELF (request, same day: "show the ingested line on [the] timeline" — asked, and the answer
       was a visible axis along the floor with a tick at each time label). The line and ticks are --field-border-color, NOT
       the DS fixture's --bottom-line-color: that is #172336 in dark, ~1.1:1 on this #0B1627 card, i.e. no timeline at all. */
    xAxis:{ type:'datetime', tickInterval:o4 ? (t.full ? 2 : 4) * hour : undefined,
            labels:{ enabled:o4, format:'{value:%H:%M}', y:18, style:{ color:'var(--neutral-light)', fontSize:'11px' } },
            title:{ text:null, style:{ color:'var(--neutral-light)' } }, lineWidth:o4 ? 1 : 0, tickLength:o4 ? 5 : 0, tickWidth:o4 ? 1 : 0,
            tickPosition:'outside', lineColor:o4 ? 'var(--field-border-color)' : 'transparent',
            tickColor:o4 ? 'var(--field-border-color)' : 'transparent', gridLineWidth:0, gridLineColor:'transparent',
            crosshair:{ color:'var(--neutral-light)', width:1 } },
    yAxis:{ labels:{ enabled:false, style:{ color:'var(--neutral-light)' } }, title:{ text:null, style:{ color:'var(--neutral-light)' } },
            lineWidth:0, lineColor:'transparent', tickColor:'transparent',
            gridLineWidth:0, gridLineColor:'transparent', minorGridLineColor:'transparent',
            min:0, max:top, startOnTick:false, endOnTick:false,
            plotLines:[{ value:t.alloc, color:'var(--neutral-light)', dashStyle:'Dash', width:1, zIndex:3 }] },
    tooltip:{ shared:true, useHTML:true, animation:false, shadow:false, outside:false,
      backgroundColor:'var(--chart-tooltip-background)', borderColor:'var(--border-color)', borderWidth:1, borderRadius:4,
      padding:8, style:{ color:'var(--page-text-color)', fontFamily:tip, fontSize:'11px' },
      formatter(){
        const p = this.points || [], ing = p.find(x => x.series.index === 0), y = ing ? ing.y : 0, dr = Math.max(0, y - t.alloc);
        const row = (col, name, v) => `<span class="lice5tr"><i style="background:${col}"></i>${name}<b>${licFmt(v)}</b></span>`;
        return `<span class="lice5th">${Highcharts.dateFormat('%a %H:%M', this.x)}</span>` +
          row('var(--lice5-tone)', 'Ingested', y) + row('var(--secondary-red)', 'Dropped', dr) +
          `<span class="lice5tr al"><i></i>Allocated<b>${licFmt(t.alloc)}</b></span>`;
      } },
    plotOptions:{ series:{ animation:false, lineWidth:2, states:{ hover:{ lineWidthPlus:0 } },
      marker:{ enabled:false, symbol:'circle', radius:3, lineWidth:1, lineColor:'var(--lic5-surface)', states:{ hover:{ enabled:true } } } } },
    series:[
      { name:'Ingested', color:'var(--lice5-tone)', data:t.series.map((v, i) => [at(i), v]),
        fillColor:{ linearGradient:{ x1:0, y1:0, x2:0, y2:1 },
          stops:[[0, 'color-mix(in srgb, var(--lice5-tone) 22%, transparent)'], [1, 'color-mix(in srgb, var(--lice5-tone) 0%, transparent)']] } },
      { name:'Dropped', type:'spline', color:'var(--secondary-red)', connectNulls:false,
        data:t.series.map((v, i) => [at(i), v > t.alloc ? v : null]) },
    ],
  };
}
/* the tile IS the DS widget: `obs-toolbar variant="widget"` is its header — the title, then the
   window, avg, peak and util as tags, where the registry puts a widget's time-range pill — and
   the body is an obs-metric-list row (the live figure, the DS's KPI) over the chart. The first
   build typed the figure and the avg/peak/util footer as raw spans. */
function licTileHTML(t, full){
  const avg = Math.round(t.series.reduce((a, b) => a + b, 0) / t.series.length), peak = Math.max(...t.series);
  const util = Math.round(t.live / t.alloc * 100);
  return `<div class="lictile${full ? ' full' : ''}">
    <obs-toolbar variant="widget" title="${stEsc(t.label)}"><obs-tag variant="tag-primary">Last 24 hours</obs-tag><obs-tag variant="tag-primary">avg ${licFmt(avg)}</obs-tag><obs-tag variant="tag-primary">peak ${licFmt(peak)}</obs-tag><obs-tag variant="tag-primary">util ${util}%</obs-tag></obs-toolbar>
    <div class="lictileb">
      <obs-metric-list items="${agJ([[licFmt(t.live), 'eps', 'ingested now · ' + licFmt(t.alloc) + ' eps allocated']])}"></obs-metric-list>
      ${licEpsChart(t, full)}
    </div></div>`;
}
/* ingested as the signal's line, the allocation as a dashed rule, and anything above it in
   red — the live legend's three series. A fixed viewBox that scales UNIFORMLY (the agChart
   rule): the full-width tile takes a wider box so it does not grow tall. */
function licEpsChart(t, full){
  const W = full ? 1200 : 560, H = 120, L = 40, R = 10, T = 10, B = 18, pw = W - L - R, ph = H - T - B;
  const s = t.series, top = licNice(Math.max(t.alloc, Math.max(...s), 1) * 1.15), ticks = 3;
  const y = v => T + ph - (v / top) * ph, f = n => n.toFixed(1), n = s.length, xs = i => L + pw * i / (n - 1);
  const grid = [...Array(ticks + 1)].map((_, i) => { const v = top * i / ticks, yy = f(y(v));
    return `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="var(--neutral-lighter)"/>` +
           `<text x="${L - 7}" y="${f(y(v) + 3.5)}" text-anchor="end" font-size="11" fill="var(--neutral-light)">${licFmt(Math.round(v))}</text>`; }).join('');
  const hours = [...Array(n)].map((_, i) => (i % 6 && i !== n - 1) ? '' :
    `<text x="${f(xs(i))}" y="${H - 4}" text-anchor="middle" font-size="11" fill="var(--neutral-light)">${i === n - 1 ? 'now' : '−' + (n - 1 - i) + 'h'}</text>`).join('');
  const pts = s.map((v, i) => `${f(xs(i))},${f(y(v))}`).join(' ');
  const over = s.map((v, i) => v > t.alloc ? `<circle cx="${f(xs(i))}" cy="${f(y(v))}" r="2.6" fill="var(--secondary-red)"/>` : '').join('');
  return `<svg class="licchart" viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto;font-family:inherit" aria-hidden="true">${grid}
    <line x1="${L}" x2="${W - R}" y1="${f(T + ph)}" y2="${f(T + ph)}" stroke="var(--border-color)"/>
    <polyline points="${pts}" fill="none" stroke="var(${t.tok})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <line x1="${L}" x2="${W - R}" y1="${f(y(t.alloc))}" y2="${f(y(t.alloc))}" stroke="var(--neutral-light)" stroke-dasharray="4 3"/>
    ${over}${hours}</svg>`;
}

/* ── wiring ─────────────────────────────────────────────────────────────────────────────── */
/* ⚠️ CUSTOM EVENTS NEED addEventListener (the recorded rule — an inline on<name>= for a custom
   name is inert markup). The tab is read back through a MutationObserver on the reflected
   `value` attribute: the element reflects it on every click, which is the one signal that does
   not depend on knowing the event's name. */
function licAfter(){
  const tabs = document.getElementById('licTabs');
  if (tabs) new MutationObserver(() => { const v = tabs.getAttribute('value'); if (v) LIC.tab = v; }).observe(tabs, { attributes:true, attributeFilter:['value'] });
  const rg = document.getElementById('licRange'); if (rg){ rg.addEventListener('change', e => licSetRange(licVal(e))); licRadioSync('licRange', LIC.range); }
  /* ⚠️ THE OPTION SWITCH REPAINTS THE WHOLE PAGE, unlike the window switch beside it, which sets
     the grid's attributes in place. It has to: the two options render different markup above the
     table, and there is no open detail row or caret to lose at the moment you change design. */
  const op = document.getElementById('licOpt');
  if (op){ op.addEventListener('change', e => { const v = String(licVal(e)); if (v && v !== LIC.opt){ LIC.opt = v; stMainPaint(); } });
           licRadioSync('licOpt', LIC.opt); }
  /* one listener for the life of the page, not one per paint */
  if (window.matchMedia && !LIC.mq){ LIC.mq = window.matchMedia(LIC_MQ); LIC.mq.addEventListener('change', licColsSync); }
  const tb = document.getElementById('licTable');
  if (tb) tb.addEventListener('cellaction', e => { const d = licVal(e); if (d && (d.key === 'hist' || d.key === 'name')) licHistOpen(d.id); });
  const md = document.getElementById('licAct');
  if (md){ md.addEventListener('close', () => { md.open = false; }); md.addEventListener('cancel', () => { md.open = false; }); }
  const hm = document.getElementById('licHistMd');
  if (hm){ const shut = () => { hm.open = false; LIC.hist = null; }; hm.addEventListener('close', shut); hm.addEventListener('cancel', shut); }
  const ta = document.getElementById('licCode');
  if (ta) ta.addEventListener('input', e => { const v = licVal(e); LIC.code = v == null ? '' : String(v); licActPaint(); });
  if (LIC_EPS5.includes(LIC.opt)) lic5TrendMount();
}
ST_PAGES['My Account › License'] = { html: licHTML, after: licAfter };
