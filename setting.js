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

/* ══ AGENTIC AI (\`ag*\`) — Settings › Agentic AI › AI Provider ════════════════════════════════
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
   checker still said 100/100, because both halves were legal DS tokens — just not the same set.
   ⚠️ \`#drawer-gedit\` IS THE DASHBOARD'S OWN Edit-group DRAWER, IN \`index.html\`, AND IT IS HERE
   FOR ONE CONTROL (17 Sep 2026): its Header banner field is built from \`obs-button\`, and a DS
   component outside this block reads the package's own DEFAULTS, which are LIGHT — the same trap
   as \`#cwMdHelp\`, one section of the same page away.
   ⚠️ IT IS DELIBERATELY NOT IN THE PROTOTYPE-TOKEN RE-POINT BELOW. That block re-binds
   \`--card\` / \`--text\` / \`--border\` / \`--teal\` onto DS names, and the drawer's other three
   fields (\`.ddin\`, the \`cwFtDD\` dropdown, \`.ddseg\`) are written against this prototype's own
   values — taking the DS ones would repaint three fields nobody asked about. */
#agPage,#drawer-agadv,#licPage,#licHist,#licHistF,#licHistDr,#cwMdHelp,#drawer-gedit,#cwModal{

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

html[data-theme="light"] #agPage,html[data-theme="light"] #drawer-agadv,html[data-theme="light"] #licPage,html[data-theme="light"] #licHist,html[data-theme="light"] #licHistF,html[data-theme="light"] #cwMdHelp,html[data-theme="light"] #drawer-gedit,html[data-theme="light"] #cwModal{
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
#agPage,#drawer-agadv,#licPage,#licHist,#licHistF,#licHistDr,#cwMdHelp{
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
/* ╔═ ADVANCED CONFIGURE — a drawer of its own (request, 16 Sep 2026) ════════════════════
   Built to the product's own **APM › Application Registration** screen, supplied as the reference: a wide
   drawer whose left rail picks WHAT you are configuring and whose middle column is that thing's form.
   ⚠️ IT DOES NOT REUSE \`.sdrawer\`, AND THAT IS DELIBERATE. That chrome is declared in each PAGE's own
   stylesheet — natively in Options 1 and 4, ported by hand into 2 and 3 on 2 Sep — and \`setting.js\` is one
   file shared by THIRTEEN pages. Leaning on a page-level class is how \`#drawer-agcfg\` once opened nothing,
   silently, on the two options that had never had those rules. Everything this drawer needs is here.
   ⚠️ IT IS CREATED ONCE AND LIVES ON \`<body>\`, not inside \`#view-settings\` — that section is
   \`display:none\` whenever Settings is not the active view, and a FIXED child of a hidden ancestor is hidden
   too. The License history drawer is on \`<body>\` for exactly this reason.
   ⚠️ THE WIDTH IS DERIVED FROM WHAT THE FORM HOLDS, not picked: rail 230 + a form column wide enough for
   Agent · Model · Priority SIDE BY SIDE + gutters. \`obs-select\` paints a hardcoded 240px whatever its host
   asks for (a recorded v0.1.166 defect), so three of them plus two 12px gaps need 744px of content — at the
   original 1010 the column offered 746, i.e. **0.67px of slack per column**, which any font or padding
   change would have silently collapsed to two rows. 1080 gives each column 259px. It is still not the
   Configure drawer's viewport-minus-rail, which is what left that form's footer running 500px past its
   fields. */
#agAdvScrim{position:fixed;inset:0;z-index:89;background:rgba(3,8,18,.55);backdrop-filter:blur(3px);
  opacity:0;pointer-events:none;transition:opacity .18s}
#agAdvScrim.on{opacity:1;pointer-events:auto}
.agadvdr{position:fixed;top:0;bottom:0;right:0;z-index:90;display:flex;flex-direction:column;
  width:min(1080px,100vw);background:var(--page-background-color);border-left:1px solid var(--border-color);
  transform:translateX(102%);transition:transform .2s ease;box-shadow:-8px 0 28px rgba(3,8,18,.35)}
.agadvdr.on{transform:none}
.agadvh{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:14px 16px;
  border-bottom:1px solid var(--border-color)}
.agadvh .t{flex:1 1 auto;min-width:0;font-size:15px;font-weight:600;color:var(--primary-alt)}
.agadvx{width:28px;height:28px;border:0;border-radius:4px;background:transparent;cursor:pointer;
  color:var(--neutral-light);display:grid;place-items:center}
.agadvx:hover{background:var(--nav-hover-bg)}
/* ⚠️ \`.agadvbody\`, NOT \`.agadvb\` — THE NAME WAS ALREADY TAKEN, AND THAT WAS THE MISALIGNMENT.
   \`.agadvb\` is the Configure form's **Advanced settings** button ~200 lines down, and its rule carries
   \`margin:0 0 0 -15px\` to cancel the DS button's own padding. This drawer's body wore the same class, so
   the rail — and everything in it — was dragged **15px left of the drawer's own header title**, which is
   exactly what was reported. Nothing errored; the two just shared a name. The collision trap this repo's
   CLAUDE.md opens with, hit again: grep the CSS CLASS, not only the JS name. */
.agadvbody{flex:1 1 auto;min-height:0;display:flex}
/* the rail — the reference's Host/VM · Docker · Kubernetes column, carrying the 16 modules.
   ⚠️ EVERY NUMBER HERE IS DERIVED, WHICH IS WHAT "PROPER ALIGNMENT" MEANT (request, 16 Sep 2026). The row's
   8px padding sits inside the rail's own 8px, so each **glyph starts 16px from the drawer's left edge —
   exactly where the header title "Advanced configure" starts**, and the two share one left edge instead of
   the label sitting 4px past it. The label then starts at 16 + 18 (glyph) + 10 (gap) = 44 on EVERY row,
   which is the column the icons exist to establish: without them sixteen labels of different lengths had
   nothing lining them up but their own left edge.
   ⚠️ 32px ROW + 2px GAP = THE 34px PITCH \`.sitem\` AND \`.mfi\` ALREADY SHARE. \`line-height:18px\` is what
   pins it there — left at \`normal\` the 13px text makes a 19.5px line box and the row lands at 33.5. */
.agadvn{flex:0 0 230px;width:230px;min-width:0;overflow-y:auto;padding:8px;
  border-right:1px solid var(--border-color);scrollbar-width:thin}
/* ⚠️ EACH MODULE IS A BOX (request, 21 Sep 2026: "in this sidebar the each module box", with
   the product's own Application Registration rail supplied and its deployment-menu-item inspected:
   background #172336, padding 16px 12px, margin 0 0 8px, rounded).
   ⚠️ THE BOX IS A STATE, NOT THE RESTING LOOK (a follow-up the same day: "the box effect is
   show only hover and active time"). It shipped boxed at rest for an hour and sixteen filled,
   bordered cards stacked down a 230px rail read as sixteen things rather than as one list.
   ⚠️ THE BORDER IS KEPT AT transparent, NEVER DROPPED TO border:0. A border that appears on
   hover would move the row's content 1px and re-wrap its label under the cursor — the same reason
   the flyout reserves its chevron box rather than emitting it conditionally.
   ⚠️ THE MEASURED #172336 IS A TOKEN HERE, NOT A HEX — it is --common-widget-bg's own dark
   value, so light theme gets the value that works there instead of a dark slab on a white drawer.
   ⚠️ THE CORNERS ARE 4px, NOT the reference's rounded-lg: every box in this module is 4px
   (14 Sep 2026) and a lone 8px row would be the one thing on the screen off that rule.
   ⚠️ CONSEQUENCE, STATED: sixteen 52px rows on an 8px gap is ~960px of rail, so it SCROLLS
   where the 34px-pitch list used to fit. .agadvn was already overflow-y:auto, so nothing had to
   change for that — but the rail is a scrolling column now, which the 3-item reference is not. */
.agadvr{display:flex;align-items:center;gap:10px;width:100%;padding:16px 12px;
  border:1px solid transparent;border-radius:4px;
  background:transparent;color:var(--page-text-color);font:inherit;font-size:13px;
  line-height:18px;text-align:left;cursor:pointer;margin-bottom:8px}
/* the last row pays no gap, or the rail ends on 8px of nothing above its own padding */
.agadvr:last-child{margin-bottom:0}
/* hover and active are the two states that draw the box */
.agadvr:hover{background:var(--common-widget-bg);border-color:var(--border-color)}
.agadvr.on{background:var(--code-tag-background-color);border-color:var(--border-color);
  color:var(--primary);font-weight:500}
/* ⚠️ \`.agadvic\`, NOT \`.ic\` — that one is a PAGE-level class (\`.ic{width:20px;height:20px}\`, declared in
   all thirteen pages), and this file is shared by every one of them. A scoped rule happens to outrank it
   today; the name is still the page's, and borrowing it is how the next page-level edit reaches in here.
   ⚠️ THE GLYPH IS QUIET AT REST AND TAKES THE ROW'S OWN COLOUR WHEN SELECTED — the same pair the Configure
   drawer's rail needed, where the DS side menu hardcodes \`--neutral-light\` on \`.r-ic\` and left a selected
   row's glyph dim while its label brightened, i.e. two halves of one row disagreeing about being selected. */
.agadvr .agadvic{flex:0 0 18px;width:18px;height:18px;display:grid;place-items:center;color:var(--neutral-light)}
.agadvr.on .agadvic{color:inherit}
.agadvr .nm{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.agadvm{flex:1 1 auto;min-width:0;overflow-y:auto;padding:16px 24px 24px}
.agadvm > *{margin-top:24px}
.agadvm > :first-child{margin-top:0}
.agadvm > .agcfgp{margin-top:4px}
/* ⚠️ THE PROVIDER TILES ARE NOT A DS COMPONENT, AND THAT WAS CHECKED — the shipped bundle registers 52
   \`obs-*\` elements and none is a selectable card (\`obs-radio as-button\` takes {value,label} only and
   ESCAPES the label, so it cannot carry the tagline the reference's tiles carry). They are built from the
   same atoms as this screen's own provider cards, so the addition reads as native rather than imported. */
.agadvtiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.agadvtile{display:flex;flex-direction:column;gap:4px;padding:12px;text-align:left;cursor:pointer;
  border:1px solid var(--border-color);border-radius:var(--btn-radius);
  background:var(--widget-background);color:var(--page-text-color);font:inherit}
.agadvtile:hover{border-color:var(--neutral-light)}
.agadvtile.on{border-color:var(--primary);background:var(--code-tag-background-color)}
.agadvtile .h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
.agadvtile .d{font-size:12px;line-height:1.5;color:var(--text-color-common-secondary)}
.agadvfld{display:grid;justify-items:stretch;gap:7px}
.agadvfld .agflb{justify-self:start}
.agadvfld .agflb{margin-bottom:0}
/* ⚠️ Agent · Model · Priority ON ONE LINE (request, 16 Sep 2026), and \`auto-fit\` rather than a fixed
   \`repeat(3,…)\`: \`obs-select\`'s shadow \`.sel\` is a hardcoded 240px and PAINTS OUTSIDE ITS HOST when the
   host is narrower, so a forced third column on a narrow drawer would hang the control over the edge. At
   \`minmax(240px,1fr)\` a drawer with no room for three simply wraps to two, then one. */
.agadvgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;align-items:start}
/* ⚠️ \`obs-banner\` MUST BE TOLD IT IS A BLOCK HERE. The screen's other banners are direct children of
   \`.agpage\`, which has a rule for exactly that; this one is nested a level deeper, and an unknown element
   defaults to \`display:inline\` — the fault that made \`obs-radio\` measure 341px inside a 720px form. */
#agAdvNote .agnote{display:block}
/* ⚠️ THE TRAIL IS A BLOCK ON ITS OWN LINE, and the last crumb is the emphasised one — the breadcrumb
   convention (and the supplied reference's own shape: a path ending at the thing being located). The
   separator is quieter than the crumbs so the eye reads names, not arrows. */
.agadvcrumb{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:10px;
  font-size:12px;line-height:1.5;color:var(--text-color-common-secondary)}
.agadvcrumb .sep{color:var(--neutral-light);opacity:.75}
.agadvcrumb .cur{color:var(--page-text-color);font-weight:600}
.agadvf{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:12px 16px;
  border-top:1px solid var(--border-color)}
.agadvf .sp{margin-right:auto}
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
/* ⚠️ 45x45 AND IT CARRIES THE ASK-AI GRADIENT STAR, not the flat sparkling-star glyph
   (request, 21 Sep 2026: "the header ai icon will be use ask ai logo with 45*45 ps"), with the
   product's own Integration header (Motadata ServiceOps) supplied as the proportion reference:
   a mark that spans the title AND the sentence under it, rather than sitting beside one line.
   ⚠️ THE SIZE IS SET ON THE BOX AND THE ART FILLS IT — the star is a 48-unit viewBox, so it
   scales with no path arithmetic; rescaling a viewBox by hand is what puts artwork out of family.
   ⚠️ THE color IS A FALLBACK ONLY. The star paints from its own gradient (see AG_SPARK); this
   is what it would take if that def ever went missing, so it fails to violet rather than black. */
.aghmk{display:grid;place-items:center;width:45px;height:45px;color:var(--chart-indigo)}
.aghmk svg{width:100%;height:100%;display:block}
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
/* ⚠️ THE INDENT IS DERIVED FROM THE MARK, NOT TYPED: 8px of the header's own left padding
   (--page-header-padding) + the 45px mark + the component's own 10px .left gap = 63. It was 48
   for a 30px mark. Re-derive it if either number moves, or the sentence stops starting under the
   title — which is the whole point of the reference's arrangement.
   ⚠️ 13px ON REQUEST (21 Sep 2026), up from 12.8. */
.aghsub{margin:2px 0 12px 63px;font-size:13px;line-height:1.55;
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
.agrow2.agrow1{grid-template-columns:minmax(0,1fr)}
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
/* ⚠️ OPTION 3's PROVIDER CARDS — see \`agCardsHTML\` for why the CARD is not a DS component (the
   bundle registers no card element) while everything inside it is. The surface is deliberately
   \`.agpanel\`'s own, so a card here and a panel on Option 1 are the same object.
   ⚠️ \`auto-fit\` + \`minmax\`, NOT three fixed columns: at 1280 the pane is ~920px and three 300px
   cards fit; narrower, they wrap on their own rather than being clipped or squeezed. */
.agpcw{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:16px}
/* ⚠️ \`--widget-background\`, NOT A PASTED #0b1627 (request, 16 Sep 2026: "the card background colour
   use #0b1627"). That hex IS this token's exact dark value; the token is also \`#fff\` in light, so the
   card keeps a white surface there instead of a near-black one. The License page's cards landed on the
   same token for the same request, which is the precedent. */
.agpc{display:flex;flex-direction:column;padding:16px;border:1px solid var(--border-color);
  border-radius:var(--btn-radius);background:var(--widget-background)}
.agpch{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
/* ⚠️ ONE NEUTRAL TILE FOR ALL THREE, NOT A TINT PER PROVIDER (request, 16 Sep 2026: "the icon
   colour use #8e9fbc and the icon background colour is color-mix(in srgb, var(--page-text-color)
   8%, transparent)"). It was each provider's own \`--chart-*\` token at 16%.
   ⚠️ \`--neutral-light\` IS #8e9fbc — the token, not the hex. That is this theme's exact value for
   the colour asked for, and it carries #6a7fa0 into light, where #8e9fbc would be 1.9:1 on a white
   card and effectively invisible. The background is the expression as given, which is already a
   token: \`--page-text-color\` flips per theme, so an 8% wash of it works in both.
   ⚠️ CONSEQUENCE, STATED: colour no longer tells the three cards apart — the MARK does, which is
   what putting the providers' real logos on them was for. A coloured tile behind a brand logo was
   also asserting a brand colour that is not the brand's. */
.agpci{flex:0 0 40px;width:40px;height:40px;display:grid;place-items:center;border-radius:var(--btn-radius);
  color:var(--neutral-light);background:color-mix(in srgb, var(--page-text-color) 8%, transparent)}
/* ⚠️ THE MARKS PAINT IN THEIR OWN BRAND COLOURS (request, 16 Sep 2026: "the 3 card use real colour logo").
   ⚠️ THESE ARE THE ONLY PASTED HEXES ON THIS SCREEN, AND THEY HAVE TO BE. A brand colour is by definition
   not a DS token — no \`--chart-*\` or \`--severity-*\` value IS OpenAI's green — so the standing "prefer
   tokens over hexes" rule cannot apply. They are declared ONCE, here, as tokens of our own, exactly the way
   the License card holds the live product's \`--license-accent\` palette rather than sprinkling literals
   through the markup.
   ⚠️ THEY DO NOT FLIP PER THEME. A brand colour is absolute — re-tinting one for dark mode would be
   inventing a colour the brand does not use. Measured against the two card surfaces (#0b1627 dark, #fff
   light): Anthropic 5.8 / 3.2, DeepSeek 4.3 / 4.4, OpenAI 7.2 / ⚠️ 2.6 — the one value that lands under
   the 3:1 bar for a graphical object, and it does so in LIGHT theme only. Stated rather than "fixed": the
   fix would be a darker green that is no longer the brand's.
   ⚠️ OPENAI'S CURRENT OFFICIAL MARK IS MONOCHROME (black on light, white on dark); #74aa9c is the green
   the knot has been rendered in for years and is what reads as "the OpenAI colour". One line
   (\`color:var(--page-text-color)\`) makes it monochrome and theme-correct if that is preferred.
   ⚠️ THE TILE BEHIND THEM IS UNCHANGED — the neutral 8% wash asked for two requests earlier. Tinting each
   tile with its brand colour is one \`color-mix\` if wanted; it was not asked for, and three saturated tiles
   would take the row back to the per-provider colour the neutral tile deliberately replaced. */
/* ⚠️ ONE DECLARATION, TWO HOSTS. The Advanced-configure drawer is a separate element on
   <body>, so it inherits nothing declared on the cards' own wrapper — and a second copy of three
   brand hexes is how the two surfaces come to disagree about a provider's colour. */
.agpcw,.agadvtiles{--ag-openai:#74aa9c;--ag-anthropic:#d97757;--ag-deepseek:#4d6bfe}
.agpci[data-brand="openai"]{color:var(--ag-openai)}
.agpci[data-brand="anthropic"]{color:var(--ag-anthropic)}
.agpci[data-brand="deepseek"]{color:var(--ag-deepseek)}
/* ⚠️ ANTHROPIC'S MARK IS A FILLED WORDMARK, SO IT CANCELS THE STROKE RULES ABOVE. Painted with
   \`fill:none;stroke:currentColor;stroke-width:1.6\` it renders as a hairline OUTLINE of the letterform — not
   the logo. The two selectors have to mirror the two above them (root, and \`g\`/\`path\`), or the per-path
   \`stroke-width\` still applies and the glyph carries a 1.6 halo. */
.agpci[data-brand="anthropic"] svg{fill:currentColor;stroke:none}
.agpci[data-brand="anthropic"] svg,.agpci[data-brand="anthropic"] svg g,
.agpci[data-brand="anthropic"] svg path{stroke-width:0}
/* ⚠️ THE PROVIDER'S OWN MARK, FROM THE ICON LIBRARY — NEVER DRAWN (request, 16 Sep 2026: "use
   provider real icon", with Google image results for the three logos as the reference). All three
   are already in \`free-icons/\`: OpenAI is Tabler's \`brand/brand-openai\` and Anthropic and DeepSeek
   are Hugeicons' \`claude\` / \`deepseek\` — both sets MIT, so nothing needs visible attribution.
   ⚠️ TWO SETS IN ONE ROW, DELIBERATELY. The repo rule is one set per prototype, and its stated
   reason is that mixed STROKE WEIGHTS read as a bug — which this rule fixes below. A brand mark's
   shape is decided by the brand, not by the set, and no single set carries all three.
   ⚠️ THE STROKE-WIDTH IS SET HERE, NOT TAKEN FROM THE SOURCE. Tabler draws at 2 on a 24 grid and
   Hugeicons at 1.5; at 20px that is 1.67px against 1.25px on screen — the exact spread the AI
   panel's icon rule exists to stop. One declaration gives all three 1.33px.
   ⚠️ IT HAS TO REACH \`g\` AND \`path\` TOO: Hugeicons' DeepSeek carries \`stroke-width\` on its \`<g>\`
   as a presentation attribute, which a rule on the \`<svg>\` root alone does not override. */
.agpci svg{width:20px;height:20px;display:block;overflow:visible;fill:none;stroke:currentColor}
.agpci svg,.agpci svg g,.agpci svg path{stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
/* ⚠️ THE DRAWER'S TILE REUSES .agpci AND ONLY RESIZES IT (request, 21 Sep 2026: "add icon" on
   the Advanced-configure AI provider tiles, which carried a name and a sentence and no mark).
   Every brand rule above — the three colours, Anthropic's filled-not-stroked exception — reaches
   it by construction, so a provider cannot be one colour on a card and another in the drawer.
   ⚠️ AND THE MARK IS BARE HERE: no tile behind it (a second request the same day, with the
   product's own Instrumentation Method tiles supplied — there the glyph sits directly before the
   title at the title's own size, with nothing boxed around it).
   ⚠️ THE BRAND COLOUR IS KEPT. The reference paints its glyph in the row's own ink, but "use
   the provider's real colour logo" was an explicit request of its own hours earlier, and the two
   do not conflict: what the reference shows here is the TREATMENT, which is what changed. */
.agpci.sm{flex:0 0 16px;width:16px;height:16px;background:none;border-radius:0}
.agpci.sm svg{width:16px;height:16px}
/* Advanced configure's provider tiles: the brand marks are MONOCHROME (request, 23 Sep 2026:
   "the provider all icon will be use black & white"). They take the tile's own text colour, so they
   read white in dark and black in light. Scoped to .agadvtile: the Option 3 cards keep their brand colours. */
.agadvtile .agpci[data-brand]{color:var(--page-text-color)}
/* the reference's leading dot, and the one place the Active card differs from Available beyond its word */
.agpcd{width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block}
.agpcn{font-size:14px;font-weight:600;color:var(--page-text-color)}
.agpct{margin:4px 0 0;font-size:12.5px;line-height:1.55;color:var(--text-color-common-secondary)}
/* ⚠️ \`margin-top:auto\` ON THE ACTION ROW is what makes three cards of unequal tagline length end
   on one line — the grid stretches them to the tallest, and without this the buttons float. */
/* ⚠️ THE DOCS BUTTON IS GONE (request, same day: "remove this icon"), so the row holds one control.
   \`.agpcb\` keeps \`flex:1 1 auto\` — it stretches the HOST, not the painted button, which obs-button
   sizes to its own label; the row reads the same as before minus its neighbour. \`p.docs\` is NOT
   orphaned: Option 1's consent panel still links each provider's privacy page with it. */
.agpca{display:flex;gap:8px;margin-top:auto;padding-top:16px}
/* ⚠️ THE BUTTON HUGS ITS LABEL — it was flex:1 1 auto, which was invisible while the row held
   ONE button (the host grew, the inner .btn stayed content-sized and left-aligned inside it, so the
   card looked right) and wrong the moment Remove arrived: the two hosts split the row in half and
   the labels ended up ~90px apart with the 8px gap doing nothing. A flex basis on a wrapper whose
   child does not stretch is a latent bug that only shows when a sibling appears. */
.agpcb{flex:0 0 auto}
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
/* ⚠️ THE OVERVIEW'S "One provider at a time" NOTE TAKES THE SAME 16px the table takes, so the
   toolbar → note → grid column runs on one step. It is a direct child of \`.agpage\`, which has no
   gap of its own — without this it sat flush against the toolbar (measured 0px). Inside the drawer
   the same banner is spaced by \`.agfbody > *\`, so this rule is scoped to the page. */
.agpage > .agnote{display:block;margin-top:16px}



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
/* ⚠️ OPTION 3's RAIL IS TITLED (request, 16 Sep 2026) — see the \`obs-side-menu\` entry in the
   shadow-sheet map for what the rest of that reference changed, and for why the numbers were
   measured off the supplied screenshot rather than the live DOM.
   ⚠️ IT IS SLOTTED LIGHT DOM, so this page rule reaches it — the rail's ROWS are in the
   component's shadow root and cannot be styled from here, which is the whole reason that
   entry in the map exists.
   ⚠️ THE 24px SPACER BECOMES THE TITLE'S TOP MARGIN. \`#drawer-agcfg .agcfgsp{height:24px}\` is a
   FIXED height, so a title inside it would be clipped to 24px and paint over the first row —
   the height has to give way to the padding when there is something in the box. \`:has()\` is
   what keeps Option 1's empty spacer at exactly 24px.
   ⚠️ 12px OF LEFT INSET, NOT THE ROW'S 36. A \`categories\` leaf is indented 28px by the
   component's own \`q()\`, written INLINE on the row, plus \`.rows\`' 8px — so the glyphs sit at
   36. The reference puts its title LEFT of its icons, not over them, and a 36px indent in a
   230px column reads as a hanging label. */
#drawer-agcfg .agcfgsp:has(.agcfgnt){height:auto;padding:24px 12px 10px}
.agcfgnt{font-size:13.5px;font-weight:600;color:var(--primary-alt);line-height:1.3}
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
#agPage,#drawer-agadv,#licPage,#licHist,#licHistF,#licHistDr{--primary:var(--primary-alt);
  /* obs-button's primary reads its OWN pair, not --primary (registry tokensUsed: --primary-button-bg /
     --primary-button-text) — measured: the buttons stayed white after --primary alone moved */
  --primary-button-bg:var(--primary);--primary-button-text:var(--page-background-color);
  --primary-button-hover-bg:color-mix(in srgb, var(--primary) 84%, var(--page-background-color));--primary-button-hover-text:var(--page-background-color);
  --radio-btn-box-selected-bg:var(--primary);--radio-btn-box-selected-text-color:var(--page-background-color)}
/* ⚠️ THE LIGHT RULE REPEATS THE BUTTON AND RADIO PAIRS. The scoped token block declares them under
   \`html[data-theme="light"] #licPage\` (1,1,1), which outranks the (1,0,0) rule above — measured:
   with only \`--primary\` here, light-theme buttons stayed navy while dark went teal. */
html[data-theme="light"] #agPage,html[data-theme="light"] #drawer-agadv,html[data-theme="light"] #licPage,html[data-theme="light"] #licHist,html[data-theme="light"] #licHistF,html[data-theme="light"] #licHistDr{--primary:var(--primary-alt);
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
/* ════ Discovery Settings › Discovery Profile (dp*) ════ */
/* ══ DISCOVERY PROFILE (dp*) — Settings › Discovery Settings › Discovery Profile (25 Sep 2026) ══
   Cloned from live build 10.0.1 at /settings/network-discovery/network-discovery-profiles, its
   /create and /edit screens, a row's Schedule / Delete actions and a profile's /result page —
   the DOM and computed styles read in the browser. The LIST reuses the stc* chrome above
   (search · squares · chips · grid · pager · popovers · drawer) so the two grid pages cannot
   drift; what is new here is what Compliance does not have: the vendor TYPE column, the
   create page's type rail + per-type form + help card, the result grid and the live delete
   confirm. Every value below is measured (see the dp block in PART 2 for the numbers).
   No backtick appears in this block on purpose: PART 1 is a template literal. */
/* the list */
.dpgrid td.ty{padding-top:0;padding-bottom:0}
.dpty{display:inline-block;width:24px;height:24px;vertical-align:middle;line-height:0}
.dpty svg{width:24px;height:24px;display:block}
.dpty.cat svg{fill:currentColor;color:var(--text-dim)}
.dpst{color:var(--text)}
/* the live run control is visible AT REST (17.6px, --text-dim) — Compliance hides its run until hover */
.dpgrid tr .dprun{opacity:1}
.dpgrid tr .dprun svg{width:17px;height:17px}
/* ── the delete confirm — the live 450px red-bordered card, trash in a circle, No · Yes ──── */
.dpcf{position:fixed;inset:0;z-index:100006;display:none;place-items:center;background:rgba(4,10,20,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.dpcf.on{display:grid}
.dpcfb{width:450px;max-width:92vw;min-height:156px;background:var(--pop);border:1px solid var(--red);border-radius:4px;box-shadow:var(--shadow);padding:20px 24px;display:flex;flex-direction:column;gap:18px}
.dpcfr{display:flex;align-items:center;gap:16px}
.dpcfi{width:40px;height:40px;flex:0 0 40px;border-radius:50%;border:1px solid var(--red);color:var(--red);display:grid;place-items:center}
.dpcfi svg{width:18px;height:18px;fill:currentColor}
.dpcft{font-size:12.8px;color:var(--text);line-height:1.5}
.dpcfb .bt{display:flex;justify-content:flex-end;gap:8px}
.stbtn.dpyes{background:transparent;border-color:var(--red);color:var(--red)}
.stbtn.dpyes:hover{background:color-mix(in srgb, var(--red) 12%, transparent)}
/* ── the create / edit page: rail · form · help card ──────────────────────────────────────── */
.dpcr{display:flex;flex:1;min-height:0;margin:-16px -16px -20px}
.dprail{width:256px;flex:0 0 256px;border-right:1px solid var(--border);padding:10px 8px 16px 23px;overflow:auto;display:flex;flex-direction:column}
.dprail .stcsearch{width:100%;flex:0 0 auto;margin-bottom:6px}
.dprail .stcsearch input{height:36px}
.dpcat{border-bottom:1px solid var(--border)}
.dpcath{display:flex;align-items:center;gap:10px;height:42px;padding:0 4px 0 0;font-size:12.8px;color:var(--text);cursor:pointer;user-select:none}
.dpcath .ic{width:18px;height:18px;flex:0 0 18px;fill:currentColor;color:var(--text)}
.dpcath .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dpcath .car{width:13px;height:13px;flex:0 0 13px;fill:currentColor;color:var(--text-dim);transition:transform .15s}
.dpcat.open .dpcath .car{transform:rotate(90deg)}
.dpcath:hover{color:var(--white)}
.dpcath.on{color:var(--white);font-weight:500}
.dpsub{display:none;padding:0 0 6px}
.dpcat.open .dpsub{display:block}
/* a child: 30px, 25px further in than its parent's text, selected on --hover in white 500 (live #172336) */
.dpsubi{display:flex;align-items:center;height:30px;padding:0 10px 0 35px;border-radius:4px;font-size:12.8px;color:var(--text);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dpsubi:hover{color:var(--white)}
.dpsubi.on{background:var(--hover);color:var(--white);font-weight:500}
/* on Edit the type is locked: the rail dims and refuses the pointer, as live does */
.dpcr.lock .dprail{cursor:not-allowed}
.dpcr.lock .dpcats{opacity:.45;pointer-events:none}
.dpform{flex:1;min-width:0;overflow:auto;padding:16px 32px 8px}
.dpfw{max-width:744px}
/* a row of up to three fields — the live grid is 173 / 245 / 241 on a 744px form, 28px apart */
.dpfr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 28px;margin-bottom:14px}
.dpfr.two{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)}
.dpsegs{grid-column:2 / -1;display:flex;flex-wrap:wrap;align-items:flex-end;gap:0 12px;min-width:0}
.dpfi{min-width:0}
.dpfi.wide{grid-column:1 / span 2}
.dpfi.full{grid-column:1 / -1}
.dpfi.nolab{padding-top:23px}
.dpfi.btm{display:flex;align-items:flex-end}
.dplab{display:flex;align-items:center;gap:3px;font-size:12.8px;line-height:19px;color:var(--text-dim);margin-bottom:4px;white-space:nowrap}
.dplab.req::after{content:"*";color:var(--red)}
.dplab .dpinfo{width:14px;height:14px;display:inline-grid;place-items:center;color:var(--text-dim);cursor:help}
.dplab .dpinfo svg{width:14px;height:14px;fill:currentColor}
.dpin{width:100%;height:32px;padding:4px 11px;border:1px solid var(--chip);border-radius:4px;background:transparent;color:var(--text);font:inherit;font-size:12.8px;outline:none}
.dpin::placeholder{color:var(--text-dim)}
.dpin:focus{border-color:var(--text-dim)}
.dpin[type=number]{-moz-appearance:textfield}
textarea.dpin{height:auto;min-height:72px;padding:8px 11px;resize:vertical;font-family:inherit}
.dpfile{display:flex;align-items:center;gap:8px;color:var(--text-dim);cursor:pointer}
.dpfile input{display:none}
.dpsel{display:flex;align-items:center;gap:8px;height:32px;padding:0 10px 0 11px;border:1px solid var(--chip);border-radius:4px;background:transparent;color:var(--text);font-size:12.8px;cursor:pointer;user-select:none;min-width:0}
.dpsel .v{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dpsel .v.ph{color:var(--text-dim)}
.dpsel.tags .v.ph{font-family:"JetBrains Mono",monospace;letter-spacing:.04em}
.dpsel .v .stctag{height:20px;line-height:20px;font-size:11.5px;margin-right:4px}
.dpsel .car{width:13px;height:13px;fill:currentColor;color:var(--text-dim);flex:0 0 13px}
.dpsel:hover{border-color:var(--text-dim)}
.dpsel.dis{opacity:.55;cursor:not-allowed}
/* the live ant-radio-button group: 32px, checked = --white on --bg ink, unchecked = --bg with dim ink */
.dpseg{display:inline-flex;height:32px;vertical-align:middle}
.dpseg button{height:32px;padding:0 12px;border:1px solid var(--border);border-left-width:0;background:var(--bg);color:var(--text-dim);font:inherit;font-size:12.8px;cursor:pointer;white-space:nowrap}
.dpseg button:first-child{border-left-width:1px;border-radius:4px 0 0 4px}
.dpseg button:last-child{border-radius:0 4px 4px 0}
.dpseg button.on{background:var(--white);border-color:var(--white);color:var(--bg)}
.dpseg button:hover:not(.on){color:var(--text)}
.dpseg button[disabled]{cursor:default;opacity:.6}
.dpfi .stsw{margin-top:5px}
.dph3{font-size:16px;font-weight:500;color:var(--white);margin:6px 0 8px;line-height:24px}
.dpnot{display:flex;align-items:center;gap:12px}
.dpnot .dpin{flex:1}
.dpbcc{font-size:12.8px;color:var(--text);text-decoration:underline;cursor:pointer;white-space:nowrap}
.dpnotes{font-size:12.8px;color:var(--text-dim);margin-top:-6px;margin-bottom:12px}
/* required-and-empty: the label and the border go red, no message (live prints none) */
.dpfi.err .dplab{color:var(--red)}
.dpfi.err .dpin,.dpfi.err .dpsel{border-color:var(--red)}
/* the footer: ghost buttons left, Reset + primary right, 34px, 12.8px, radius 4 */
.dpff{display:flex;align-items:center;gap:8px;margin:20px 0 16px;max-width:744px}
.dpff .sp{flex:1}
.dpbtn{height:34px;padding:0 15px;border:1px solid var(--white);border-radius:4px;background:transparent;color:var(--text);font:inherit;font-size:12.8px;cursor:pointer;white-space:nowrap}
.dpbtn:hover{background:var(--hover)}
.dpbtn.reset{border-color:var(--text);background:var(--bg)}
.dpbtn.pri{background:var(--white);border-color:var(--white);color:var(--bg);font-weight:500}
.dpbtn.pri:hover{opacity:.9}
.dpbtn[disabled]{opacity:.55;cursor:default}
/* ── the Discovery Help Card column ───────────────────────────────────────────────────────── */
.dphelp{width:546px;max-width:34%;flex:0 0 auto;border-left:1px solid var(--border);padding:16px 20px 20px;overflow:auto;font-size:12.8px;color:var(--text);line-height:1.6}
.dphh{margin:0 0 16px;padding-left:12px;border-left:4px solid var(--white);font-size:16px;font-weight:500;line-height:20px;color:var(--white)}
.dphnote{font-size:12px;color:var(--text-dim);margin:-8px 0 12px}
.dphc{border:1px solid var(--border);border-radius:4px;background:var(--card);margin-bottom:12px}
.dphch{display:flex;align-items:center;height:46px;padding:0 16px;font-size:12.8px;color:var(--text);cursor:pointer;user-select:none}
.dphch .car{margin-left:auto;width:14px;height:14px;fill:currentColor;color:var(--text-dim);transition:transform .15s}
.dphc.open .dphch .car{transform:rotate(90deg)}
.dphcb{display:none;padding:0 16px 14px;color:var(--text)}
.dphc.open .dphcb{display:block}
.dphcb p{margin:0 0 8px;color:var(--text-dim)}
.dphcb .h{color:var(--white);font-weight:500;margin:12px 0 6px}
.dphcb .l{margin:8px 0 4px;color:var(--text)}
.dphcb ul{margin:0 0 8px 18px;padding:0;color:var(--text-dim)}
.dphcb li{margin:0 0 4px}
.dphcb li b{color:var(--text);font-weight:500}
.dpcode{display:flex;align-items:flex-start;gap:10px;background:var(--hover);border-radius:4px;padding:8px 12px;margin:4px 0 10px;font:11.5px/1.55 "JetBrains Mono",monospace;color:var(--text);white-space:pre-wrap;word-break:break-all}
.dpcode span{flex:1;min-width:0}
.dpcode .cp{flex:0 0 14px;width:14px;height:14px;fill:currentColor;color:var(--text-dim);cursor:pointer;margin-top:2px}
.dpcode .cp:hover{color:var(--white)}
.dpos{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px}
.dpost{width:44px;height:44px;border:1px solid var(--border);border-radius:4px;background:var(--panel);display:grid;place-items:center;color:var(--text)}
.dpost svg{width:22px;height:22px;fill:currentColor}
.dpost.more{font-size:12px;color:var(--text-dim)}
.dphtabs{margin:4px 0 10px}
.dphtabs .dpseg button{height:28px;padding:0 12px;font-size:12px}
.dphmore{font-size:12.8px;color:var(--text-dim);margin-top:4px}
.dphmore a{color:var(--white);text-decoration:underline;cursor:pointer}
.dphmore svg{width:12px;height:12px;fill:currentColor;color:var(--white);vertical-align:-1px;margin-left:4px}
/* ── the result page (a profile's discovered objects) ─────────────────────────────────────── */
.dpres .stcbar{margin-bottom:12px}
.dpres .stcsearch{width:230px;flex-basis:230px}
.dpstat{display:flex;align-items:center;gap:14px;font-size:12.8px;color:var(--text);margin-left:auto}
.dpstat b{font-weight:600;margin-left:4px}
.dpstat b.ok{color:var(--green)}
.dpstat b.bad{color:var(--red)}
.dpstat .bar{width:1px;height:18px;background:var(--border)}
.dpbdg{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:4px;font-size:12px;font-weight:500}
.dpbdg.N{background:color-mix(in srgb, var(--green) 20%, transparent);color:var(--green)}
.dpbdg.P{background:color-mix(in srgb, var(--blue) 20%, transparent);color:var(--white)}
.dpbdg.U{background:color-mix(in srgb, var(--orange) 20%, transparent);color:var(--orange)}
.dpresf{flex:0 0 auto;border-top:1px solid var(--border)}
.dplg{display:flex;align-items:center;gap:8px;padding:12px 0 4px;font-size:12.8px;color:var(--text)}
.dplg .dpbdg{margin-left:10px}
.dplg .dpbdg:first-child{margin-left:0}
.dplg .sp{flex:1}
.stcck.dis{opacity:.35;cursor:default}
/* the schedule drawer's own rows (the drawer chrome is stc's) */
.dpsch .dpfr{gap:14px 24px}
.dpck{display:inline-flex;align-items:center;gap:8px;font-size:12.8px;color:var(--text);cursor:pointer;user-select:none}
@media (max-width:1400px){ .dphelp{max-width:30%} }
@media (max-width:1280px){ .dphelp{display:none} .dprail{width:224px;flex-basis:224px} }

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
    /* ⚠️ OPTION 3's PROVIDER RAIL, BUILT TO THE PRODUCT'S OWN APM ‣ APPLICATION REGISTRATION RAIL
       (request, 16 Sep 2026, with that screen as the reference). ⚠️ MEASURED FROM THE SUPPLIED
       SCREENSHOT, NOT FROM THE LIVE DOM: the instance answers 200 but its SPA does not mount under
       browser automation — `document.body.textContent` came back EMPTY twice, which is the trap
       this file already records, made worse by an MCP tab being `visibilityState:"hidden"` so its
       boot timers starve. Say which, rather than let these numbers read as harvested.
       ⚠️ SCOPED `:host(.agcfgnav)`, which ONLY Option 3's rail carries — Option 1's is untouched.
       What the reference does that the shipped `m-categories` rail did not:
         · the column is TITLED (`Application Registration`) — ours is in the `logo` slot, below;
         · the rows breathe — a taller row and a real gap between them, not a 1px seam;
         · the row's own inset is wider, so the glyph is not against the column's edge;
         · the ACTIVE row's glyph takes the row's colour. `.r-ic` is hardcoded to
           `--neutral-light`, so on the shipped rail the selected row's icon stayed dim while its
           label brightened — two halves of one row disagreeing about being selected.
       ⚠️ THE ROW PADDING HAS TO BEAT `.m-categories .row.leaf` (0,2,0); `:host(.agcfgnav)` plus
       those two is (0,3,0), so it wins without `!important`.
       ⚠️ `padding-left` IS NOT SET HERE. The component writes it INLINE per row from its own
       `q()` (28px for a `categories` leaf), and an inline style beats any rule — the indent is
       its depth model, so it is left alone and only the right/vertical padding is ours. */
    'obs-side-menu': ':host(.agcfgnav) .m-categories .row.leaf{padding-top:9px;padding-bottom:9px;' +
      'padding-right:12px;font-size:13px;border-radius:4px}' +
      ':host(.agcfgnav) .rows{padding:0 8px;display:flex;flex-direction:column;gap:4px}' +
      ':host(.agcfgnav) .row.leaf.active .r-ic{color:inherit}',
    /* ⚠️ obs-page-header EXPOSES NO ::part AND NO SIZE HOOK — its .title is hardcoded
       16px/500 in its own shadow CSS, and --page-header-padding is the only documented lever.
       So a 24px/600 heading (request, 21 Sep 2026) can only be reached from inside the root.
       ⚠️ SCOPED BY A HOST CLASS. The License page draws its own obs-page-header and must keep
       the component's own size; :host(.aghph) cannot reach it. */
    'obs-page-header': ':host(.aghph) .title{font-size:24px;font-weight:600;line-height:1.3}',
    'obs-severity':  '.chip{border-radius:4px}',
    'obs-checkbox':  '.box{border-radius:4px}',
    /* ⚠️ THE SECOND RULE IS WHAT MAKES TWO ROWS SHARE ONE GAP (request, 16 Sep 2026: the three
       provider tiles and Agent · Model · Priority "make the same space"). Both rows are grids with
       the SAME `gap:12px`, and they still read as different spacings, because `obs-select`'s shadow
       `.sel` is a hardcoded **240px**: the tiles stretch to fill a 259px column while the selects
       sit at the left of theirs, so the eye sees 12px between tiles and 12 + 19 = 31px between
       fields. Measured, not guessed. Letting `.sel` fill the host is the only way to close it —
       page CSS cannot reach inside the component, and this hook is how every other shadow rule in
       this file lands. Scoped by a host class so no other `obs-select` on any screen is touched. */
    'obs-select':    '.val-pop,.t-badge,.pill,.pill-pop,.menu,.cbx{border-radius:4px}' +
      ':host(.agadvsel),:host(.agadvsel) .sel{width:100%}',
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
      '.cell-btn[variant="agactive"]{pointer-events:none;cursor:default}' +
      /* the Agentic AI grid's header rule — see agGridHTML for why it is the only table scoped */
      ':host(.aggridt) thead th{border-top:1px solid var(--border-color,#e3e8f2)}',
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
     · `ag*`  — Settings › Agentic AI › AI Provider, built on the real ObserveOps design system

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
     ⚠️ ITS ONE PAGE IS `AI Provider` — renamed from `Overview` on request (21 Sep 2026).
     `Overview` was the supplied Agentic AI reference's own name for its single routed screen, and
     it named nothing: what the page lists IS the three AI providers and their connection state,
     and its primary action is `Configure AI provider`. The singular also matches this rail's own
     convention (SLO Profile, Integration Profile, Ping) and the Configure form's own first field,
     which the product labels `AI provider`.
     ⚠️ THE PAGE NAME AND THE `ST_PAGES` KEY MUST MOVE TOGETHER — `stMainPaint` looks the page
     up as `ST.cat + ' › ' + ST.page`, so a key left on the old name falls through to the stub
     placeholder ("only My Account › My Profile is built in this prototype") with NO error.
     ⚠️ THE ROUTE IS DELIBERATELY UNCHANGED: `/settings/ai/agentic-ai` is the shape a route
     would take, not a label, and it is what the CATEGORY — not this page — is called.
     (That reference prototype's Data-&-privacy / Governance / Usage screens exist in its source
     but are not routed, so they are not built here either.) It is served by the `ag*` block
     through `ST_PAGES`.
     ⚠️ A CATEGORY CANNOT CARRY ZERO PAGES — `stOpen()` and `stStubHTML()` both dereference
     `subs[0]` — so adding a second page here is one array entry plus one `ST_PAGES` key.
     ⚠️ THE ROUTE IS THE SHAPE ONE WOULD TAKE, not a harvested one. `/settings/ai/` is the
     namespace Dependency Mapper already sits in on the instance.
     ⚠️ The flyout picks this up for free — `mfTree('Setting')` maps `ST_TREE`, it does not
     hold its own copy. */
  {n:"Agentic AI", ic:"sparkling-star", subs:[["AI Provider","/settings/ai/agentic-ai"]]}
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

/* ════ Discovery Settings › Discovery Profile (dp*) — cloned from live build 10.0.1, 25 Sep 2026 ════ */
const DP_ROWS0 = [{"id":1,"n":"192.0.2.112","t":"192.0.2.112","ic":"dell-emc-unity","c":1,"s":"2026/09/22 22:26:55"},{"id":2,"n":"192.0.2.114","t":"192.0.2.114","ic":"ping","c":1,"s":"2026/08/21 15:02:53"},{"id":3,"n":"192.0.2.163","t":"192.0.2.163","ic":"snmp-device","c":1,"s":"2026/07/27 19:57:55"},{"id":4,"n":"192.0.2.4","t":"192.0.2.4","ic":"ruckus-wireless","c":1,"s":"2026/09/25 14:54:07"},{"id":5,"n":"192.0.2.5","t":"192.0.2.5","ic":"ruckus-wireless","c":0,"s":"2026/09/25 14:49:18"},{"id":6,"n":"192.0.2.212_TEST","t":"192.0.2.212","ic":"prism","c":1,"s":"2026/08/06 12:21:17"},{"id":7,"n":"192.0.2.43","t":"192.0.2.43","ic":"snmp-device","c":1,"s":"2026/07/17 15:21:52"},{"id":8,"n":"192.0.2.47","t":"192.0.2.47","ic":"snmp-device","c":1,"s":"2026/07/17 15:19:50"},{"id":9,"n":"192.0.2.50","t":"192.0.2.50","ic":"snmp-device","c":1,"s":"2026/07/17 15:23:35"},{"id":10,"n":"198.51.100.2","t":"198.51.100.2","ic":"snmp-device","c":1,"s":"2026/07/17 15:21:08"},{"id":11,"n":"203.0.113.6","t":"203.0.113.6","ic":"snmp-device","c":1,"s":"2026/07/17 14:30:08"},{"id":12,"n":"203.0.113.71","t":"203.0.113.71","ic":"linux","c":1,"s":"2026/08/17 19:45:48"},{"id":13,"n":"198.51.100.14","t":"198.51.100.14","ic":"snmp-device","c":1,"s":"2026/07/17 14:34:48"},{"id":14,"n":"198.51.100.154","t":"198.51.100.154","ic":"snmp-device","c":1,"s":"2026/07/17 15:22:30"},{"id":15,"n":"198.51.100.4","t":"198.51.100.4","ic":"snmp-device","c":0,"s":"2026/07/17 15:18:26"},{"id":16,"n":"198.51.100.5","t":"198.51.100.5","ic":"snmp-device","c":0,"s":"2026/07/17 14:38:33"},{"id":17,"n":"203.0.113.221_test7","t":"203.0.113.221","ic":"snmp-device","c":1,"s":"2026/08/03 11:53:23"},{"id":18,"n":"203.0.113.222","t":"203.0.113.222","ic":"snmp-device","c":1,"s":"2026/07/17 14:32:51"},{"id":19,"n":"203.0.113.224","t":"203.0.113.224","ic":"snmp-device","c":1,"s":"2026/09/02 16:50:46"},{"id":20,"n":"203.0.113.224_new","t":"203.0.113.224","ic":"snmp-device","c":1,"s":"2026/09/02 16:52:26"},{"id":21,"n":"203.0.113.224_new2","t":"203.0.113.224","ic":"snmp-device","c":1,"s":"2026/09/02 16:52:56"},{"id":22,"n":"203.0.113.44","t":"203.0.113.44","ic":"cisco-wireless","c":1,"s":"2026/07/17 16:25:55"},{"id":23,"n":"Aruba","t":"192.0.2.242","ic":"aruba-wireless","c":1,"s":"2026/07/20 10:20:42"},{"id":24,"n":"aws-demo","t":"","ic":"aws-cloud","c":0,"s":"2026/07/17 14:47:20"},{"id":25,"n":"aws-demo1","t":"","ic":"aws-cloud","c":45,"s":"2026/07/17 14:57:51"},{"id":26,"n":"azure-demo","t":"","ic":"azure-cloud","c":6,"s":"2026/07/17 15:29:09"},{"id":27,"n":"Ops-PC","t":"192.0.2.182","ic":"windows","c":1,"s":"2026/07/17 14:35:19"},{"id":28,"n":"Citrix Xen Cluster","t":"192.0.2.231","ic":"citrix-xen-cluster","c":1,"s":"2026/07/18 16:04:37"},{"id":29,"n":"citrix xen cluster1","t":"198.51.100.117","ic":"citrix-xen-cluster","c":0,"s":"2026/07/18 19:52:16"},{"id":30,"n":"citrix xen discovery","t":"192.0.2.232","ic":"citrix-xen","c":0,"s":"F 2026/07/18 19:54:13"},{"id":31,"n":"Citrix-Xen","t":"192.0.2.232","ic":"citrix-xen","c":1,"s":"2026/07/18 16:06:08"},{"id":32,"n":"esxi_test","t":"192.0.2.14-30","ic":"vmware-esxi","c":0,"s":"2026/08/06 12:00:33"},{"id":33,"n":"esxidiscovery","t":"192.0.2.14-30","ic":"vmware-esxi","c":4,"s":"2026/07/18 09:40:26"},{"id":34,"n":"Firewall_VM","t":"203.0.113.22","ic":"snmp-device","c":1,"s":"2026/07/21 18:51:57"},{"id":35,"n":"fuyygiu","t":"192.0.2.217","ic":"linux","c":0,"s":"Not Run Yet"},{"id":36,"n":"HPE Storage","t":"192.0.2.112","ic":"hpe","c":0,"s":"2026/07/17 15:34:07"},{"id":37,"n":"Hyper-V Cluster Discovery","t":"198.51.100.230","ic":"hyperv-cluster","c":0,"s":"2026/07/18 16:12:41"},{"id":38,"n":"hyperv","t":"198.51.100.240","ic":"hyper-v","c":0,"s":"2026/07/18 16:09:57"},{"id":39,"n":"ibm_ubuntu","t":"198.51.100.138","ic":"linux","c":0,"s":"2026/09/22 15:18:42"},{"id":40,"n":"KVM","t":"198.51.100.71","ic":"kvm","c":0,"s":"2026/08/03 15:54:00"},{"id":41,"n":"kvm discovery","t":"198.51.100.71","ic":"kvm","c":0,"s":"2026/07/18 19:50:27"},{"id":42,"n":"kvmdiscovery","t":"198.51.100.71","ic":"kvm","c":0,"s":"2026/07/18 19:46:25"},{"id":43,"n":"LINUX IP RANGE DISCOVERY","t":"192.0.2.1-255","ic":"linux","c":10,"s":"2026/07/18 15:38:19"},{"id":44,"n":"Edge_Firewall","t":"192.0.2.1","ic":"snmp-device","c":1,"s":"2026/07/20 12:32:19"},{"id":45,"n":"mysql-demo","t":"198.51.100.165","ic":"mysql","c":1,"s":"2026/07/17 16:37:14"},{"id":46,"n":"Nutanix","t":"192.0.2.212","ic":"prism","c":1,"s":"2026/07/18 16:18:25"},{"id":47,"n":"nutanixdiscovery","t":"192.0.2.212","ic":"prism","c":1,"s":"2026/07/18 19:45:04"},{"id":48,"n":"oci-demo1","t":"","ic":"oracle-cloud","c":16,"s":"2026/07/17 15:32:07"},{"id":49,"n":"office365-demo","t":"","ic":"office-365","c":0,"s":"2026/07/17 15:34:09"},{"id":50,"n":"openshift","t":"api.openshift-cluster.example.com","ic":"openshift-kubernetes","c":0,"s":"2026/07/17 14:34:59"},{"id":51,"n":"Openshift Kubernetes","t":"api.openshift-cluster.example.com","ic":"openshift-kubernetes","c":0,"s":"2026/07/17 14:54:12"},{"id":52,"n":"oracle-db","t":"198.51.100.165","ic":"oracle-database","c":0,"s":"2026/07/17 16:32:43"},{"id":53,"n":"oracle-demo","t":"","ic":"oracle-cloud","c":0,"s":"2026/07/17 15:26:11"},{"id":54,"n":"ping-example","t":"203.0.113.120","ic":"ping","c":0,"s":"2026/07/17 16:29:14"},{"id":55,"n":"Proxmox Cluster","t":"198.51.100.117","ic":"proxmox-ve-cluster","c":1,"s":"2026/07/18 16:13:54"},{"id":56,"n":"analyst","t":"192.0.2.217","ic":"linux","c":0,"s":"Not Run Yet"},{"id":57,"n":"Analyst PC","t":"192.0.2.217","ic":"linux","c":1,"s":"2026/07/17 14:26:46"},{"id":58,"n":"sqlserver-demo","t":"198.51.100.216","ic":"mssql","c":0,"s":"2026/07/17 16:39:22"},{"id":59,"n":"storage Fibernetix","t":"192.0.2.112","ic":"fibrenetix","c":1,"s":"2026/07/17 15:55:35"},{"id":60,"n":"tanzu_try","t":"203.0.113.93","ic":"tanzu-kubernetes","c":0,"s":"2026/07/17 14:20:13"},{"id":61,"n":"try","t":"203.0.113.223","ic":"snmp-device","c":1,"s":"2026/07/22 11:41:54"},{"id":62,"n":"try_test4","t":"198.51.100.5","ic":"snmp-device","c":0,"s":"2026/07/27 12:37:31"},{"id":63,"n":"Vcenter Discovery","t":"192.0.2.180","ic":"vcenter","c":1,"s":"2026/07/18 15:47:12"},{"id":64,"n":"vcenterd","t":"192.0.2.180","ic":"vcenter","c":1,"s":"2026/07/18 09:44:36"},{"id":65,"n":"vcenterdiscovery","t":"192.0.2.180","ic":"vcenter","c":1,"s":"2026/07/18 09:42:34"},{"id":66,"n":"WINDOWS IP RANGE DISCOVERY","t":"203.0.113.1-255","ic":"windows","c":3,"s":"2026/07/18 15:42:15"}];
const DP_TYPE_NAME = {"dell-emc-unity":"Dell EMC Unity","ping":"Ping","snmp-device":"SNMP Device","ruckus-wireless":"Ruckus Wireless","prism":"Nutanix","linux":"Linux","cisco-wireless":"Cisco Wireless","aruba-wireless":"Aruba Wireless","aws-cloud":"AWS Cloud","azure-cloud":"Azure Cloud","windows":"Windows","citrix-xen-cluster":"Citrix Xen Cluster","citrix-xen":"Citrix Xen","vmware-esxi":"VMware ESXi","hpe":"HPE MSA 2060","hyperv-cluster":"Hyper-V Cluster","hyper-v":"Hyper-V","kvm":"KVM","mysql":"MySQL","oracle-cloud":"Oracle Cloud","office-365":"Office 365","openshift-kubernetes":"OpenShift","oracle-database":"Oracle Database","proxmox-ve-cluster":"Proxmox VE Cluster","mssql":"MSSQL","fibrenetix":"Fibrenetix E88","tanzu-kubernetes":"Tanzu Kubernetes","vcenter":"VMware vCenter"};
/* the 28 vendor marks the live TYPE column draws (24×24 <img>s on live) — the product's own
   `observeops-icons/monitors/*.svg`, verbatim apart from: no width/height (CSS sizes them), and
   every <defs> id and every class NAMESPACED per icon, because the same type repeats down the
   list and two copies sharing a gradient id let the second steal the first's paint (the recorded
   `wArt()` trap). Multi-colour, so they are NOT painted currentColor. */
const DP_TYPE_SVG = {"dell-emc-unity":"<svg viewBox=\"0 0 48 48\"><path d=\"M29.97 19.13h-3.28v3.26l-4.52 3.56-.87-.68 4.52-3.56-1.83-1.43-4.52 3.55-.87-.68 4.52-3.55-1.83-1.44-4.93 3.88c-.6-1.5-2.2-2.91-4.41-2.91H7.73v9.4h4.22c1.98 0 3.7-1.19 4.41-2.9l4.93 3.88 5.39-4.25v3.27h6.55v-2.75h-3.27v-6.66zM11.6 25.82h-.71v-4h.73c1.2 0 2.04.72 2.04 2 0 1.39-.95 2-2.06 2zM24 2.15C11.94 2.15 2.15 11.93 2.15 24S11.94 45.85 24 45.85 45.85 36.07 45.85 24 36.07 2.15 24 2.15zm13.78 35.63c-3.52 3.53-8.4 5.71-13.78 5.71s-10.25-2.19-13.78-5.71C6.69 34.26 4.51 29.38 4.51 24s2.18-10.26 5.71-13.78c3.53-3.53 8.4-5.71 13.78-5.71s10.26 2.18 13.78 5.71c3.53 3.52 5.7 8.4 5.7 13.78s-2.18 10.25-5.7 13.78zm-.39-12v-6.66h-3.28v9.41h6.55v-2.75h-3.27z\" fill=\"#007db8\"/></svg>","ping":"<svg viewBox=\"0 0 512 512\"><path d=\"M6 6h500v500H6z\" fill=\"#0078d4\"/><path d=\"M194.59 203.14c-5.94.62-11.77 2.75-17.41 4.81-2.05.75-4.16 1.52-6.28 2.21l-1.23-4h-15.38v115.26H171v-32.58l1.31.51c1.77.68 3.17 1.22 4.61 1.69 11 3.57 22 2.94 31-1.79s15.54-13 18.83-24a64.25 64.25 0 00-1.53-42.25c-5.51-14.35-16.39-21.38-30.63-19.86zm14.74 60.78c-2.15 6.31-7.89 11.42-15.36 13.68-7.77 2.36-15.75 1.22-21.37-3a6 6 0 01-1.53-4.05v-.38c-.08-2.4-.12-4.82-.13-7.23v.16V251c0-1.66 0-3.33.07-5a115.26 115.26 0 00-.17-11.59v-.14c-.42-5.13 1.23-8 5.5-9.67 1.38-.53 2.74-1.11 4.06-1.67a54.22 54.22 0 018.31-3c9.35-2.3 17.57 2.08 20.47 10.9a51.59 51.59 0 01.12 33.12zm-86.53-26.36a10.26 10.26 0 00-3-3.05h-.08a73.36 73.36 0 00-11-5.11l-69.27-30.7-1.79-.78-.3 1.93c-2.06 13.11-1.71 13.81 9.46 18.69L100.63 242l-11.17 4.87c-14.84 6.49-28.9 12.62-43 18.72-11.27 4.91-11.76 5.95-8.81 18.53l.41 1.76 9.66-4.28c23.7-10.49 48.21-21.34 72.17-32.2l.22-.11a9.4 9.4 0 004.19-7.4v-.3a10.3 10.3 0 00-1.5-4.03zm331.32-29.76l-1.27-.19-11.14-1.74c-6.12-1-11.85-1.85-17.57-2.72-16.93-2.54-31.58 4.32-39.19 18.36-8.95 16.54-9.21 34-.77 52 5.35 11.37 15.17 17.32 26.9 16.34 6.63-.56 13.11-2.36 19.38-4.1 2.15-.59 4.36-1.21 6.54-1.76.39 9.31-1.63 16-6 19.86-4.88 4.33-13 5.45-24.13 3.32-3.56-.68-7-1.66-10.69-2.69-2.18-.61-4.42-1.24-6.71-1.81l-1.86-.47v18.68l1.39.1c3.18.24 6.39.56 9.5.87 6.14.61 12.47 1.24 18.75 1.24h1.5c20.54-.32 33.48-12.67 34.61-33.05.73-13.13.72-26.51.72-39.45v-15.53zm-17 31v17.38c0 7.95-1.44 11.08-6.17 13.39a45.26 45.26 0 01-10.27 3.43c-10.51 2.32-18.37-1-21.57-9a42.87 42.87 0 010-33.25 19.48 19.48 0 016.59-8 29.35 29.35 0 0116.84-5.34c5 0 9.84 1.38 13.42 4.56a5.56 5.56 0 011.11 3.52c.08 4.39.06 8.95.05 13.36zm-75.75 7.06c-.09-7.13-.19-14.49-1.42-21.6-2.4-13.94-12.59-22.25-25.89-21.15-6.78.56-13.24 2.55-20.07 4.67-2.46.76-5 1.54-7.52 2.24-.17-.76-.38-1.72-.58-2.65l-.26-1.19H290v85.2h16.56v-15.35c0-14.57 0-28.33.12-42.34 0-2.86.87-5.52 1.55-5.89l1-.57c5.9-3.18 12-6.47 18.28-7.63 4.36-.81 8-.17 10.71 1.89 3 2.22 4.83 6.1 5.35 11.21a119.75 119.75 0 01.37 12.56v45.84h17.49v-15.5c.05-9.3.09-18.09 0-27.1zm-114.52-49.7h18V179h-18zm1 95h15.94v-85.07h-16z\" fill=\"#fff\"/></svg>","snmp-device":"<svg viewBox=\"0 0 512 512\"><path d=\"M448.81 184.59h-121.4v-23.87a14.22 14.22 0 014.19-10.11l20.23-20.23a43 43 0 10-20.2-20.2l-20.23 20.23a42.51 42.51 0 00-12.55 30.31v23.87h-28.57V89.25a42.85 42.85 0 10-28.56 0v95.34h-28.57v-23.87a42.49 42.49 0 00-12.55-30.3l-20.23-20.24a43 43 0 10-20.2 20.2l20.23 20.23a14.22 14.22 0 014.19 10.11v23.87H63.19a42.9 42.9 0 00-42.85 42.85v57.12a42.9 42.9 0 0042.85 42.85h121.4v23.87a14.22 14.22 0 01-4.19 10.11l-20.23 20.23a43 43 0 1020.2 20.2l20.23-20.23a42.51 42.51 0 0012.55-30.31v-23.87h28.57v95.34a42.85 42.85 0 1028.56 0v-95.34h28.57v23.87a42.49 42.49 0 0012.55 30.3l20.23 20.24a43 43 0 1020.2-20.2l-20.23-20.23a14.22 14.22 0 01-4.19-10.11v-23.87h121.4a42.9 42.9 0 0042.85-42.85v-57.12a42.9 42.9 0 00-42.85-42.85zM370.26 77.47A14.29 14.29 0 11356 91.75a14.28 14.28 0 0114.26-14.28zM141.74 106A14.29 14.29 0 11156 91.75 14.28 14.28 0 01141.74 106zm0 328.49A14.29 14.29 0 11156 420.25a14.28 14.28 0 01-14.26 14.28zM370.26 406A14.29 14.29 0 11356 420.25 14.28 14.28 0 01370.26 406zM256 34.63a14.28 14.28 0 11-14.28 14.28A14.28 14.28 0 01256 34.63zm0 442.74a14.28 14.28 0 1114.28-14.28A14.28 14.28 0 01256 477.37zm207.09-192.81a14.3 14.3 0 01-14.28 14.29H63.19a14.3 14.3 0 01-14.28-14.29v-57.12a14.3 14.3 0 0114.28-14.29h385.62a14.3 14.3 0 0114.28 14.29zm-42.84-42.84A14.28 14.28 0 10434.53 256a14.28 14.28 0 00-14.28-14.28zm-85.7 0A14.28 14.28 0 10348.83 256a14.28 14.28 0 00-14.28-14.28zm42.85 0A14.28 14.28 0 10391.68 256a14.28 14.28 0 00-14.28-14.28z\" fill=\"#1d83d4\"/></svg>","ruckus-wireless":"<svg viewBox=\"0 0 512 512\"><path d=\"M374 68.79c7-4.87 13-10.94 19.45-16.47 7-6.35 15-12 20.53-20-2.18-2-4.46-3.92-6.76-5.66-7.83 7.68-14 16.87-20.93 25.37-4.04 5.54-8.89 10.67-12.29 16.76zm16.61-53.88a60.93 60.93 0 00-8.61-2.84c-4.59 9.86-7.69 20.53-11.48 30.79-2.3 6.88-5 13.49-6.76 20.53 4.73-6.39 8.11-13.51 12.29-20.39 4.95-9.18 11.22-17.95 14.58-28.09zM227 99.17zm158.7 185.26a49.23 49.23 0 00-42.26-.13 61.67 61.67 0 0137.56 3.37c4.46 1.89 9.45 4.46 11.48 9.31 1.1 2.84-1.89 4.61-3.63 6.22-8.38 6.07-19.72 3.92-28.24-.4-18.13-9.33-31.11-26.61-38.53-45.23-5.95-14.46-10.67-30.12-8.36-45.78 1.34-9.33 3.37-19 0-28.24-3.91-11.05-9.86-21.31-15.39-31.58-1.1 1.62-2.44 3.23-3.66 4.85h-.08c5.28 12.15 13.22 23.1 16.47 36.06 2.7 10.39-1.34 20.65-1.62 31.06-.27 11.34 2.7 22.41 6.49 32.94 5.13 13.91 12 27.55 22.54 38.09 9.85 10 22.83 18.91 37.42 18.09 9.17-.14 16.73-7.83 18.35-16.48.5-5.52-3.96-9.99-8.56-12.15zm41.85-235.5c-8.69 4.06-16.37 9.59-24.34 14.72-7.69 5.28-15.81 10-23.23 15.66 9.33-3.51 18.5-7.56 27.83-11.34 8.27-3.5 16.78-6.34 24.34-11.33a78.62 78.62 0 00-4.62-7.71zm-150.08 85.21c-13.63-11.62-28.08-23.63-35.64-40.24a19.31 19.31 0 00-8 1.06 19.58 19.58 0 00-6.86 4.2c16.47 16.06 32.94 32.26 51.84 45.77 1.22.69 2.43 1.36 3.77 2 1.36-1.62 2.72-3.37 4.06-5.13-3.09-2.53-6.05-5.1-9.17-7.66zm9.17 15.16c1.9-1.1 3.82-2.33 5.72-3.67l.67-1.09c-2.98.27-6.8.94-6.39 4.76z\" fill=\"#f78f1e\"/><path d=\"M213.91 364.05c6.9-2.6 15.16-2.53 21.65 1.17 4.58 2.58 7.72 7 10 11.6 5.4 0 10.8.07 16.26-.06C258 363 245.59 352.17 231.6 349.5c-9.75-1.77-20.26-.34-28.73 4.85v0a39.36 39.36 0 00-16.8 20.83 43.32 43.32 0 004.71 38.32 37.52 37.52 0 0020.15 15.23 42 42 0 0029.75-1.85 39.55 39.55 0 0021.1-24c-5.39-.15-10.85-.08-16.25-.08a27.64 27.64 0 01-5.88 8.13c-8.74 8.33-23.9 8.27-32.57-.07-8.12-7.62-10.59-20.26-7.24-30.78 2.16-7.01 7.16-13.44 14.07-16.03zm-61.85 64.48q6.76.09 13.52 0v-77.59c-4.85-.06-9.76-.06-14.61 0-.14 13.73 0 27.45-.07 41.18-.14 6.44-1.08 13.27-5.19 18.46a18.62 18.62 0 01-13.59 6.49c-5.53.35-11.75-.88-15.5-5.25-4.37-5.08-5.12-12.05-5.33-18.47-.07-14.14.06-28.28-.07-42.41-4.85-.06-9.77-.13-14.62 0h0v44c.21 9.29 1.85 19.4 8.54 26.29 8.47 8.82 22 11.13 33.53 8.14A23.86 23.86 0 00152 420.6c.13 2.66.13 5.26.06 7.93zM253.5 460.8c0-2.76.13-5.52.13-8.17-11.82-.36-23.74-.36-35.67 0 .13 15.37 0 30.75 0 46.22 11.93.13 23.74.13 35.67-.11-.13-2.52 0-5.18 0-7.68-7.71-.61-15.54.11-23.25-.49 0-3.48 0-7 .12-10.44 7.22-.13 14.57-.13 21.8-.13 0-2.74.11-5.39.11-8.15-7.34-.61-14.69.11-22-.48 0-3.48 0-7 .12-10.44 7.56-.26 15.26-.13 22.97-.13zM176.9 482c4.11-1.08 8.68-2 11.92-5 4.22-3.73 6.39-10.44 3.38-15.61-3.61-6.12-11-8.77-17.83-8.88-8-.25-16.25-.13-24.32 0-.12 15.36-.12 30.85 0 46.33q6.12.19 12.28 0c0-5.65 0-11.4.11-17.17 5.79 5.54 10.84 11.88 17 17.06a122.28 122.28 0 0014.58 0c-5.56-5.73-11.33-11.15-17.12-16.73zm-14.57-7.41v-13.67c5.66.11 12.4-1.44 17.1 2.64 3 2.39 1.94 7.21-1.21 9-4.69 2.79-10.59 1.94-15.89 2.07zm83.28-410.53c3.11 6.87 7.83 14 6.35 22-1 4.86-6.23 6.2-10 7.83 7.56 16.61 22 28.62 35.64 40.24 1.21-2 2-4.87 4.32-6.09a10.15 10.15 0 017.85 1.22c11.6 6.35 22.51 13.77 34.68 19.19a8.11 8.11 0 0010.95-3.25c1.75-3.91-1.5-7.56-3.79-10.52-7.58-9-16.65-16.76-24.34-25.66-1.48-2.29-4.46-5.68-1.62-8.12 10.4-10.67 25.92-14 37.14-23.48C348 73 343.86 62.84 337 64.06c-15.4 1.74-30.53 6.35-46 6.47a16 16 0 01-12.7-6.74c-4.06-5.94-6.9-12.69-10.81-18.9-1.22-3-4.59-1.5-6.88-1.1h0c-.93 9.19 5.27 16.76 8.11 25a3.52 3.52 0 01.28 1.75 3.57 3.57 0 01-.59 1.67 3.68 3.68 0 01-1.33 1.18 3.53 3.53 0 01-1.72.39c-6.23-7.56-8.93-17.42-15.14-25.11-2.15-2.84-6.2-1.21-8.49.41-3.8 3-8.38 6.47-7.71 11.74 3.76.95 9.98-1.63 11.59 3.24zM54.93 398.76c7.71-.49 15.91-3.57 20.35-10.26 6.35-9.91 5.12-24.51-4-32.37-7.72-6.84-18.65-8-28.55-8-11.67.08-23.27-.06-34.88.08h0v80.32q7.58.09 15.16 0c.07-23.09.07-46.24 0-69.32 3.83-.28 7.64-.08 11.47-.15 5.47.07 11-.41 16.26 1.1 4.5 1.16 9.08 3.55 11.47 7.71a12.53 12.53 0 01-1.1 14.13c-2.66 3.15-6.56 4.85-10.38 5.95-7.58 2-15.5 1.63-23.29 1.78 6.65 7.92 13.69 15.42 20.52 23.21 4.78 5.31 9.36 10.87 14.61 15.57 7.31.21 14.69.14 22 0-9.84-10.01-19.95-19.7-29.64-29.75zm240.25-256c-2.44-1.88-5.68-.95-8.52-.95-1.34 1.76-2.7 3.51-4.06 5.13.15 3 0 6.49 2.58 8.38 2.56 2.43 6.35 2 9.45 1.48 1.22-1.62 2.56-3.23 3.65-4.85a8.6 8.6 0 00-3.1-9.19zm-3.25 10.81c-3 1.48-4.87-1.62-6.49-3.65l1.21-.67c1.89-1.09 3.8-2.31 5.68-3.65 3.92.4 3.37 7.3-.4 7.99zM60.55 484.33c-3.37-10.57-7.09-21.13-10.48-31.81q-4.68-.18-9.39 0c-3.72 10.57-7 21.24-11.07 31.68-3.15-9.12-6.39-18.25-9.52-27.37-.72-1.44-.72-3.48-2.17-4.44-4-.12-8 0-11.92.13 6 15.47 12.52 31 18.91 46.32 3.25.13 6.49.13 9.75.13 3.62-10.08 7.11-20.16 10.6-30.26 3.85 9.7 6.62 19.82 10.48 29.54 3 1.57 6.74.36 10.11.59 6.15-15.47 12.77-30.72 18.67-46.32-4.22-.13-8.3-.13-12.52-.13-3.85 10.7-7.24 21.5-11.45 31.94zm47.81-31.7c.13 15.36 0 30.74 0 46.22q6.15.19 12.29 0c.25-15.48.13-31 0-46.33a81.33 81.33 0 00-12.29.11zM356.89 350.8h0zm55.33 69.74c.13 2.65.07 5.32.13 8 4.39.06 8.9.06 13.33 0 0-25.89-.06-51.71 0-77.52q-7.35-.31-14.75 0c.08 14.14 0 28.35.08 42.54-.17 6.34-1.54 13.2-6.11 18s-11.68 6.21-18 5.25a15.53 15.53 0 01-11.81-7.37c-3.89-6.62-3.61-14.61-3.55-22.06v-36.51c-4.84 0-9.76 0-14.6-.07-.15 15.17 0 30.33-.07 45.48.25 8.89 2.05 18.45 8.46 25 8.47 8.75 22.07 11.06 33.54 8.07a24 24 0 0013.35-8.81zm2.19 47.7a4 4 0 01-2.64-2.51 3.84 3.84 0 01-.2-1.87 4 4 0 01.67-1.75c3.75-4.2 11.09-2.63 13.37 2.29 3.86 1.44 8.43.36 12.54.47A14.79 14.79 0 00430 454c-8.42-3.84-19.52-3.73-26.86 2.4H403c-5.17 4.2-5.3 13.07.13 17 6 4.8 14.2 4.69 20.84 8a4.73 4.73 0 011.79 1.27 4.65 4.65 0 011 1.93 4.72 4.72 0 010 2.18 4.84 4.84 0 01-1 1.95c-4.92 4.92-14.33 3.48-16.73-3.36-4.22 0-8.31 0-12.41.11.48 7.45 7.6 12.24 14.34 13.68 8 1.45 17 .85 23.52-4.2 5.66-4.07 6.62-13.43 1.45-18.24-5.74-5.59-14.4-5.59-21.52-8.48zm80.21 5.38c-5.43-2.87-11.82-3-17.36-5.65a3.87 3.87 0 01-2.11-5.11 3.79 3.79 0 011.26-1.59 8.29 8.29 0 017.23-1.31 8.29 8.29 0 015.44 4.91c4.1.13 8.2.25 12.3 0a15.29 15.29 0 00-3.61-7.68c-6-5.88-15.42-6.73-23.26-4.92-5.53 1.33-11.68 5.41-12.05 11.64h0a11 11 0 005.07 10.33c6 3.95 13.84 3.95 20.23 7.32a4.66 4.66 0 011.67 1.45 4.69 4.69 0 01.61 4.25 4.74 4.74 0 01-1.2 1.86c-4.95 4.32-14.11 3.11-16.28-3.61a117.76 117.76 0 00-12.88.13c1 3.35 2.17 7 5.18 9.12 7.1 5.52 17 6.24 25.54 4 6.13-1.57 12.39-6.37 12.28-13.33.47-5.32-3.49-9.76-8.06-11.81zm-8.23-44.74c6.08-1.58 11.95-5 15.65-10.26 4.84-7 5.45-17 .67-24.17-3.62-5.53-9.56-8.89-15.63-11.07-4.31-1.63-8.81-2.53-13.26-3.83-2.73-.81-5.59-1.84-7.64-3.89a7.73 7.73 0 01.06-10.59c3.71-3.62 9.66-4 14.36-2.39 3.7 1.31 6 4.72 6.84 8.41 5.49.2 10.94.07 16.41.07a18.08 18.08 0 00-3.28-10.72c-3.35-4.78-8.67-7.93-14.14-9.64a35.92 35.92 0 00-22.88.62h-.05c-5.8 2.19-11.13 6.28-13.93 11.88-3.61 7.24-2.05 16.81 4.1 22.13 6.43 5.6 15 7.3 22.89 9.84 4.23 1.42 8.95 3 11.68 6.76 3.07 4.64.68 11.33-4.17 13.65-6 3-13.93 2.53-19.25-1.77-3.15-2.6-4.18-6.69-5.06-10.52-5.33.06-10.72.06-16.12.06a23.65 23.65 0 003 12.23A26 26 0 00458.12 426a41.23 41.23 0 0028.27 2.88zm-136.27-.39c-10.59-13.86-21.72-27.25-32.38-41 9.22-12.23 18.85-24.18 27.86-36.54-6-.14-12.08-.07-18.09 0-8.88 12.56-17.82 25.06-26.57 37.7q14.79 19.08 29.44 38.1c.68.81 1.29 2 2.53 1.78q8.6.05 17.21-.04zm.1 62.24v-10.6c7.13-.24 14.36-.13 21.71 0a51.93 51.93 0 000-8.64q-10.86.17-21.71 0v-10.56c7.58-.26 15.18-.13 22.76 0 .12-2.89.12-5.77 0-8.66-11.56.12-23.25.12-34.81.12v0c-.6 15.49-.24 31-.24 46.46 11.65.12 23.49.12 35.17 0 0-2.64 0-5.4-.12-8.16q-11.4.21-22.76.04zm-57.12-62.18c.06-34.49 0-69 .06-103.48-5-.27-9.9-.13-14.89-.07v103.55c4.99 0 9.91.06 14.83 0zm1.83 62.38c-.36-12.84.13-25.8-.23-38.66-4 .12-8 .12-12.05.12-.48 15.49-.13 31-.13 46.46q16.07.19 32.17 0v-7.92c-6.63-.12-13.14-.12-19.76 0zm.35-186.26c-.81-5.8-6.87-7.57-10.79-10.93-6.23-4.47-7.16-12.84-8.78-19.72-4.87-28.64-4.47-57.81-6.76-86.55 0-2.17-.67-5 1.63-6.35 3.65 2.82 4.32 7.69 5.67 11.74 5.14 18.5 7.14 37.67 10.65 56.43 2.72 13.79 3.8 29.46 14.46 39.72 6.07 6.21 15.66 5.54 23.49 3.63.55-2.7.67-5.92-2.14-7.55-5.28-1.9-11.63-1.35-15.81-5.54-6.49-6.34-7-15.8-8.78-24-6.9-36.73-13.63-73.59-19.31-110.59-18.91-13.5-35.38-29.71-51.85-45.78a218.24 218.24 0 01-89.24 12.17h0c-6.47-.14-12.82-3.24-19.17-1.36-.14 2.44-.41 5 1.22 7 4.17 6.64 10 12.82 11.33 20.94a68.52 68.52 0 01-1.21 27.68c-1.48 5.95-6.35 10-9.17 15.26.42 21.48 1.62 43.08 2 64.68 0 8.9.81 17.95-.13 26.87a43.24 43.24 0 002.41 23.04 18.59 18.59 0 0013.08 10.81c2.84-.67 2.58-4.32 2.58-6.61-.14-6.23-6.21-9.74-8.38-15a74.48 74.48 0 01.81-13.51c2.29-26.61 4.59-53.06 6.9-79.68a10.94 10.94 0 012.55-6.75c3.11-1.22 5.13 2 6.49 4.32 2.3 4.73-3.12 8.64-2.31 13.25 1.22 23.89 2.72 47.66 3.51 71.56.29 7.16-1.34 14.32 0 21.48A18.8 18.8 0 00167.7 306a13.6 13.6 0 00-4.06-13c-4.34-3.23-3.79-9-4.06-13.78.41-20.18 1.34-40.46 1.75-60.75.55-12 1.76-24.58 8.23-34.84a17.47 17.47 0 0113.11-8.24c14.05-1.62 28.09.55 41.86 3 8.9 1.62 18.07 5.13 24.16 12a29 29 0 016.49 14.85c5 24.91 7.83 50.36 11.07 75.62 1.75 8.25 5.13 16.63 11.48 22.31a15.52 15.52 0 0017.55 1.48z\" fill=\"#009ddc\" stroke=\"#009ddc\" stroke-miterlimit=\"10\" stroke-width=\".179\"/></svg>","prism":"<svg viewBox=\"0 0 512 512\"><path d=\"M299.65 213.25L129.61 70.21c-1.26-1.03-2.8-1.59-4.38-1.59h-82.4c-3.26 0-6.15 2.3-6.74 5.67-.43 2.45.67 4.91 2.57 6.53L194.7 213.3c3.48 2.95 3.46 8.31-.02 11.25L38.42 356.13c-2.33 1.92-3.08 5.24-1.79 8.09 1.12 2.47 3.75 3.9 6.46 3.9h85.62c1.61 0 3.18-.56 4.38-1.6l166.55-141.86 1.68-1.54c2.53-2.32 2.47-6.34-.15-8.57l-1.54-1.31zm132.94 202.76l-.27-.23-30.13-25.34c-.22-.18-.5-.28-.78-.28h-14.6c-.58 0-1.09.41-1.19 1-.08.43.12.87.45 1.16l27.65 23.47c.61.52.61 1.47 0 1.99l-27.68 23.31c-.41.34-.55.93-.32 1.43.2.44.66.69 1.15.69h15.17c.28 0 .56-.1.78-.28l29.51-25.13.3-.27c.45-.41.44-1.12-.03-1.52z\" fill=\"#a8cb3a\"/><path d=\"M174.71 390.53h-10.76c-.66 0-1.2.54-1.2 1.2v35.04c0 2.89-3.58 4.35-10.66 4.35h-14.63c-7.21 0-10.86-1.46-10.86-4.35v-35.04c0-.66-.54-1.2-1.2-1.2h-10.89c-.66 0-1.2.54-1.2 1.2v35.58c0 2.47.42 4.6 1.23 6.33.81 1.71 1.91 3.19 3.28 4.38 1.34 1.17 2.91 2.09 4.66 2.75 1.7.64 3.49 1.13 5.32 1.45 1.81.33 3.7.52 5.61.6 1.86.07 3.61.1 5.25.1h11.91c8.74 0 14.96-1.21 19.02-3.69 4.2-2.57 6.33-6.58 6.33-11.92v-35.58c0-.66-.54-1.2-1.2-1.2zm62.9 9.25v-6.89c0-1.34-1.08-2.42-2.42-2.42h-52.62c-1.33 0-2.42 1.08-2.42 2.42v6.89c0 1.34 1.08 2.42 2.42 2.42h18.41c.67 0 1.22.55 1.22 1.22v37.09c0 1.33 1.08 2.42 2.42 2.42h8.46c1.34 0 2.42-1.08 2.42-2.42v-37.09c0-.67.55-1.22 1.22-1.22h18.48c1.34 0 2.42-1.08 2.42-2.42zm28.63-5.71c-1.81-2.53-4.21-3.82-7.13-3.82s-5.26 1.31-7.07 3.9l-32.46 46.87c-.31.45-.29 1.05.09 1.48.24.28.62.41.98.41h12.76c.41 0 .79-.21 1.01-.55l8.15-12.54c.09-.13.21-.25.35-.32.14-.08.3-.12.46-.12h31.29c.33 0 .63.16.81.44l8.34 12.56c.22.34.6.54 1 .54h12.25a1.207 1.207 0 001-1.87l-31.81-46.97zm-.55 23.52h-13.77a.63.63 0 01-.52-.99l6.74-9.69a.78.78 0 011.28 0l6.82 9.62c.32.45 0 1.07-.55 1.07zM107 390.53h-9.26c-1.11 0-2.02.91-2.02 2.02v29.92c0 .7-.83 1.08-1.36.62L60.1 393.26c-2.34-2.03-4.87-3.07-7.55-3.07-2.36 0-6.34.96-6.34 7.42v43.28c0 1.11.9 2.02 2.02 2.02h9.25c1.11 0 2.02-.9 2.02-2.02v-30.04c0-.7.83-1.08 1.36-.62l34.62 30.28c2.15 1.91 4.48 2.87 6.94 2.87s6.6-1.01 6.6-7.76v-43.08c0-1.11-.91-2.02-2.02-2.02zm218.91-196.38a7.313 7.313 0 009.47 0L471.77 80.8c1.89-1.61 2.99-4.08 2.57-6.53a6.822 6.822 0 00-6.74-5.67h-82.4c-1.58 0-3.12.56-4.38 1.59l-95.71 78.02c-3.46 2.91-3.47 8.24-.03 11.17l40.83 34.75zM436.97 412.4c.48.41 1.2.41 1.68 0l24.16-20.08c.34-.29.53-.72.46-1.16-.1-.6-.62-1-1.19-1h-14.6c-.28 0-.55.1-.78.28l-16.96 13.82c-.61.52-.62 1.46 0 1.98l7.23 6.16zm36.37-55.65L334.92 243.7a7.326 7.326 0 00-9.48 0l-38.2 33.28c-3.44 2.93-3.43 8.26.03 11.17l95.11 79.19c1.26 1.03 2.8 1.59 4.38 1.59h82.4c3.26 0 6.15-2.3 6.74-5.67.42-2.45-.67-4.92-2.56-6.53zm-34.77 64.42c-.48-.41-1.2-.41-1.68 0l-6.77 5.9a1.3 1.3 0 000 1.98l16.85 14.03c.22.18.5.28.78.28h14.6c.58 0 1.09-.41 1.19-1 .08-.43-.12-.87-.45-1.16l-24.52-20.03zm-76.58-30.64h-9.51c-1.04 0-1.89.85-1.89 1.89v30.33c0 .59-.7.91-1.15.52l-34.47-30.01c-2.34-2.03-4.88-3.07-7.56-3.07-2.36 0-6.34.96-6.34 7.42v43.41c0 1.04.85 1.89 1.89 1.89h9.51c1.04 0 1.89-.85 1.89-1.89v-30.45c0-.6.7-.91 1.15-.52l34.84 30.46c2.14 1.91 4.48 2.87 6.94 2.87s6.6-1.01 6.6-7.76v-43.2c0-1.05-.85-1.89-1.89-1.89zm18.22 0h-10.89c-.66 0-1.2.54-1.2 1.2v49.99c0 .66.54 1.2 1.2 1.2h10.89c.66 0 1.2-.54 1.2-1.2v-49.99c0-.66-.54-1.2-1.2-1.2z\" fill=\"#35a6de\"/></svg>","linux":"<svg viewBox=\"0 0 512 512\"><path d=\"M449.9 403.3c-1.1-1.3-2.4-2.9-2.9-3.5-2-2.6-3.5-6.6-5.3-13.9-.6-2.6-1.5-6.2-2-8.1-2.1-8.5-4.5-13.5-8.4-17.4a28.48 28.48 0 00-7.6-5.2c-1-.4-1.4-.7-1.4-.9s.5-1.6 1-3.1c6.3-20.8 5.4-43.9-2.6-68-8-23.9-22.8-48.8-45.1-75.7-4.8-5.8-11.4-14.2-15-19.2-9.6-13.4-15-24.1-17.8-35.4-2-8.2-2.1-9.4-2.1-31.2 0-18.2-.1-23.6-.7-32-2.3-30.5-10-52-23.7-65.7a55.6 55.6 0 00-15.1-10.8c-9.6-4.7-19.4-6.9-32.3-7.2-14.3-.3-28 1.8-38.9 6.1-24.1 9.5-37.5 29.7-40.7 61.6a154.77 154.77 0 00-.7 18c0 8.9.1 12.4 1.1 26.8.8 13.1.9 17 .6 20.6-1.5 19-4.9 31.9-12 45.8a108.82 108.82 0 01-13 20c-20.4 24.9-36.6 50.2-46.9 73.4-7.9 17.8-12.3 34.1-13.4 49.6a117.81 117.81 0 00.3 16.8l.3 2.8-1.8 1.9a72.67 72.67 0 00-7.7 9.6c-4.1 5.7-4.8 6.5-6.6 8.3-2.8 2.9-5.7 4.3-15.2 7.7a54.37 54.37 0 00-8.6 3.7 25.44 25.44 0 00-13.1 17.5c-.8 4.4-.6 8.1 1 19a96.4 96.4 0 011.2 10.8 21.86 21.86 0 01-1.5 10.1c-2.5 7.5-3.5 12.6-3.5 18 0 5.1.7 8.2 2.8 11.6a22.67 22.67 0 009.2 7.9c5.5 2.6 11.4 3.8 26.6 5.5 12.3 1.4 17.2 2.1 23.4 3.5a77.46 77.46 0 0119.3 7.1c12.1 6 22.5 9.1 33.9 10.4a65.37 65.37 0 0018.7-1c11.2-2.4 20.4-9.2 25-18.4l.7-1.5 2.9-.1c3.4-.2 6.5-.6 14.6-2.1 17.3-3.2 24.1-4 33.5-4 6.1 0 7.4.1 18.2 1.6 7.4 1 12.1 1.6 15.4 2 3.8.4 11.2.6 13.9.5l2.5-.1.7 2.2a43.25 43.25 0 007 12.6 53.22 53.22 0 007.7 7.3 39.56 39.56 0 0016.9 6.7 52 52 0 006.8.2 32.93 32.93 0 007.7-.6q22.8-4.35 41.6-26c6.4-7.4 12.3-12.1 22.1-17.6 1.4-.8 7.1-3.7 12.7-6.5 13.4-6.7 16.9-8.6 20.7-11.7 12.2-9.9 10.8-22.7-4.4-40.3zM346 226.3a1 1 0 01.9-.2c.6.2 7.4 7.2 9.9 10.2a119.82 119.82 0 0111 15.7h-.4a5.1 5.1 0 00-2.6 2.2c-1.5-2.7-2.7-5.4-4.4-8.1a86.56 86.56 0 00-11-13.8c-3.7-3.7-4.6-5.2-3.4-6zM253.1 99.7a41.74 41.74 0 015.4-13.7 34.25 34.25 0 017.6-7.6 17.8 17.8 0 0111.1-3.2 15.73 15.73 0 018.7 2A26.73 26.73 0 01298 89.9a35.05 35.05 0 013.9 14.8 37.58 37.58 0 01-6.4 24.1 7.89 7.89 0 01-1.2 1.5c-.1-.1-1.2-.5-2.5-1s-3.8-1.5-5.5-2.2l-3.8-1.4-.6-.2 1.6-1.7c2.3-2.4 3.3-4.9 3.8-9.5 1-8.4-2.2-16.7-7.4-19.2a8.58 8.58 0 00-5.9-.3 12.7 12.7 0 00-6.5 6.6 24 24 0 00-2.1 6.4 36.6 36.6 0 00-.2 8.1l.1.9-2.2-1a72.08 72.08 0 00-9.3-3c-1.1-.2-1.2-.3-1.4-1-.1-.4-.1-2.8-.1-5.2.2-2.3.4-4.6.8-6.9zm14.4 24.4c5.1 2.9 7 3.7 17.4 7.5 10.2 3.8 13.5 6 15.5 10.4a11.3 11.3 0 01.1 7.9 23.84 23.84 0 01-4.4 6.9c-3.3 3.7-10.1 7.8-16.4 10.1a62.43 62.43 0 00-11.5 5.9 105.37 105.37 0 01-16 7.4 23.42 23.42 0 01-12 1.3l-1.1-.2c-5-1.1-11.7-4.9-17.9-10.3a87.25 87.25 0 00-7.7-5.9c-7.9-5.2-10.7-7.9-13-12.6a7 7 0 01-1.1-4.7c0-2.9.4-4.2 2.1-6a83 83 0 017.9-6.2c3.6-2.7 8.3-6.5 10.4-8.3 5.9-5.3 9.4-7.6 14-9.3a24.52 24.52 0 0110-1.7c7.8.1 13.1 1.9 23.7 7.8zm-63-37.8a16.41 16.41 0 018.4-6.1 15.2 15.2 0 016.7.3c6 2 11.1 8.5 13.6 17.3a35.28 35.28 0 011.3 10.7v4.1l-2.1.7a39.29 39.29 0 00-6.6 3 10.91 10.91 0 01-1.1.6 32.35 32.35 0 01-.2-3.6 20 20 0 00-2-9.3c-4.9-10.3-13.7-6.9-14.3 5.7-.3 6.2 1.7 12.5 4.9 15.4a2.46 2.46 0 01.8 1 14.21 14.21 0 01-2.6 2v.1c-1.3 1-2.7 2.1-3.1 2.3l-.6.5-1.1-1.2c-3.5-3.9-6.1-9.7-7.3-16.4a53.9 53.9 0 01-.1-13.9 33.28 33.28 0 015.4-13.2zm-42.3 151.9c2.4-3.9 2.9-4.4 2.9-2.9 0 1.1-1.5 4.6-4.4 10.4-1.5 2.9-4.1 8-5.9 11.5a115 115 0 00-4.9 11.4l-.2-.2-2.6-2.3a311.66 311.66 0 0115.1-27.9zm34.5 236.2c-5.3 10.6-18.3 14.9-35.6 11.9l-1.3-.2a163 163 0 01-22.6-7.8c-15.9-6.8-20.8-8-59-13.8C63 462.1 63 459 63 454.5a61.11 61.11 0 012.3-14c2.5-8.2 2.4-13.1.8-26.7-2.3-19.7-1.2-20.6 13.5-26.8 14.3-6 16.9-8 30.5-23.9 7.3-8.5 7.4-8.5 11.4-8.5 10 0 13.7 1.4 30.7 32.1a361.09 361.09 0 0025.9 39.8c19.6 25.3 21.8 34.6 21.8 37.5 0 1.6-1.3 6.5-3.2 10.4zm120.2-112.8c-1.1 3.9-3.1 17.5-4.4 28.4-1.3 11.6-3.6 25.3-4.9 29.9-2.1 7.4-2.5 8.9-23.5 17.1-10.5 4.1-15.2 5-28.5 5.5-12.1.5-16.1.2-22.7-1.9l-2.9-1c-9.8-3.5-18.8-9.4-21.8-13.4a11.55 11.55 0 011.5-1.3 22.7 22.7 0 008.2-18.3c-.3-14.4-12.1-31.6-32.5-47.3-7.2-5.6-16.9-13-21.5-16.5l-3.6-2.8c2.7-3.5 4.6-9.5 6.1-19.1 2.8-18.4 6.7-30.2 20.9-63.4 15.5-35.9 21.1-51.1 25.1-67.7l1-4c10.9 7.8 21 11.7 30.8 11.7h.4c8.8-.1 15.2-2.6 33.9-11.8 7.6-3.8 13.8-6.7 17.7-8.6 4.5 15.1 19.9 52 28.8 71.6 7.9 17.2 17.1 39.7 20.5 50.2l5.2 16-4.5 4.8c-17.2 17.9-26 30.4-29.3 41.9zm111 81.9c-17.5 9-24.1 13.7-37.5 26.3-9.1 8.5-19.3 16.4-23.1 18.3-8.1 4.2-21.2 5.9-28.4 3.6-4.8-1.5-13.5-10.8-15.4-17.9-1.8-6.8-.2-17.1 6.8-42.6a254.7 254.7 0 006.7-38.7c1.9-21.9 3.5-28.4 7.2-33.4 2.4 6.7 7.6 14.4 11.9 17.8 10.8 8.5 30.9 5.3 45.7-7.3 3-2.5 4.5-3.2 10.2-3.2 8.3 0 10.9 0 16.5 19.5 3.6 12.4 7 19.8 12.5 27 4.8 6.4 9.1 12.7 8.5 15.7-1.1 3.9-11.3 9.5-21.6 14.9z\" fill=\"#849fbd\"/><path d=\"M428.4 385.9c-5.7-19.5-8.2-19.5-16.5-19.5-5.7 0-7.2.6-10.2 3.2-14.9 12.5-34.9 15.7-45.7 7.3-4.3-3.4-9.5-11-11.9-17.8-3.7 5-5.3 11.4-7.2 33.4a252.57 252.57 0 01-6.7 38.7c-7 25.5-8.6 35.9-6.8 42.6 1.9 7.1 10.5 16.4 15.4 17.9 7.2 2.3 20.3.6 28.4-3.6 3.9-1.9 14-9.8 23.1-18.3 13.4-12.6 20.1-17.3 37.5-26.3 10.4-5.4 20.6-11 21.5-14.9.7-3-3.7-9.3-8.5-15.7-5.5-7.2-8.8-14.5-12.4-27zm-276.2.8c-17-30.8-20.6-32.1-30.7-32.1-4 0-4.2 0-11.4 8.5C96.5 379 93.9 381 79.6 387c-14.8 6.2-15.8 7.1-13.5 26.8 1.6 13.7 1.7 18.5-.8 26.7a61.11 61.11 0 00-2.3 14c0 4.5 0 7.6 15.1 10 38.2 5.8 43.1 7 59 13.8a150.88 150.88 0 0022.6 7.8l1.3.2c17.2 3 30.2-1.4 35.6-11.9 2-3.9 3.2-8.7 3.2-10.4 0-2.9-2.1-12.2-21.8-37.5-7.2-9.3-18.8-27.2-25.8-39.8z\" fill=\"#ffbc00\"/><path d=\"M219.7 127.5c-2 1.8-6.8 5.6-10.4 8.3-3.9 2.9-7.4 5.7-7.9 6.2-1.6 1.8-2.1 3.1-2.1 6a7.16 7.16 0 001.1 4.7c2.3 4.7 5.1 7.4 13 12.6a87.25 87.25 0 017.7 5.9c6.1 5.4 12.9 9.3 17.9 10.3l1.1.2a23.42 23.42 0 0012-1.3 105.37 105.37 0 0016-7.4 59.8 59.8 0 0111.5-6c6.4-2.3 13.1-6.5 16.4-10.1a26.15 26.15 0 004.4-6.9 10.78 10.78 0 00-.1-7.9c-2.1-4.4-5.3-6.6-15.5-10.4-10.4-3.8-12.3-4.7-17.4-7.6-10.5-6-15.9-7.7-23.8-7.7a24.52 24.52 0 00-10 1.7c-4.4 1.7-8 4.1-13.9 9.4zm30.4-4.9a10.38 10.38 0 016.5.6c1.7.8 2.9 1.6 2.9 3.3a1.89 1.89 0 01-1 1.9v.1l-.6.2a3.92 3.92 0 01-1.8.4 6 6 0 01-3.1-1.2 3.7 3.7 0 00-1.8-.8c-1.7-.5-2.7-1.4-2.8-2.5a2.43 2.43 0 011.7-2zm-.8 41a85.39 85.39 0 0021-9.2c4.3-2.5 12.4-8.5 14-10.2l2.3-2.5a3.13 3.13 0 011.1-.9 4.19 4.19 0 011.5-.4c1.6 0 2.2.7 2.4 1.3.7 2-2.5 5.7-9.4 10.9-4.7 3.5-8 5.5-15.9 9.4-9.8 4.9-15.2 6.7-22.1 7.3a27.28 27.28 0 01-4.1.3 28.67 28.67 0 01-8.7-1.3c-7.5-1.9-14.5-6-22.6-13.2-4.6-4.1-5.8-5.4-6-8-.1-1.2-.2-2.5 1-2.9 2.2-.8 3.7 1.4 4.4 2.6 3.2 4.9 12.9 12.5 19.7 15.3 4.7 2 7 2.4 12.7 2.4 5-.1 5.6-.1 8.7-.9zM238.8 124a2 2 0 01-.1 1.5 3.51 3.51 0 01-2.3 1.6 18.89 18.89 0 00-2.5 1.1 6.72 6.72 0 01-2.8 1 4.19 4.19 0 01-1.6-.4 2.86 2.86 0 01-1.7-1.7 2.45 2.45 0 01.5-2c1.5-2 5.5-3 8-2.7 1.7.2 2.3 1 2.5 1.6z\" fill=\"#ff942a\"/><path d=\"M251.2 127.1a7.57 7.57 0 011.8.9 5 5 0 003.1 1.2 5.26 5.26 0 001.8-.4l.6-.2v-.1a1.89 1.89 0 001-1.9c0-1.7-1.2-2.5-2.9-3.3a10.32 10.32 0 00-6.5-.6c-1.5.6-1.7 1.6-1.6 2 0 1 1 1.9 2.7 2.4zm-23.4 0a2.86 2.86 0 001.7 1.7 4.19 4.19 0 001.6.4 7.26 7.26 0 002.8-1 27.18 27.18 0 012.5-1.1 3.41 3.41 0 002.3-1.6 1.6 1.6 0 00.1-1.5 2.76 2.76 0 00-2.5-1.6c-2.5-.3-6.5.7-8 2.7a2.88 2.88 0 00-.5 2zm-19.3 19.6c-.7-1.1-2.2-3.3-4.4-2.6-1.2.4-1.1 1.7-1 2.9.2 2.6 1.4 3.9 6 8 8.1 7.2 15.1 11.3 22.6 13.2a28.67 28.67 0 008.7 1.3 28.28 28.28 0 004.1-.3c6.9-.7 12.3-2.5 22.1-7.3 7.9-3.9 11.2-5.9 15.9-9.4 6.9-5.2 10-8.9 9.4-10.9-.2-.6-.8-1.3-2.4-1.3a2.82 2.82 0 00-1.5.4 2 2 0 00-1.1.9l-2.3 2.5c-1.6 1.7-9.7 7.7-14 10.2a89.32 89.32 0 01-21 9.2c-3.1.8-3.7.9-8.5.9-5.7 0-8-.4-12.7-2.4-7-2.9-16.7-10.4-19.9-15.3z\" fill=\"#849fbd\"/></svg>","cisco-wireless":"<svg viewBox=\"0 0 512 512\"><path d=\"M148.18 302.17h21.93v-86.91h-21.93zm-97.11-43.46c0 28 21.62 45 46.26 45a69.9 69.9 0 0020-3.08V277.3a38.56 38.56 0 01-18.42 4.61c-14.61 0-24-10.28-24-23.2 0-13.3 9.82-23.17 24-23.17a38.09 38.09 0 0118.42 4.64V216.9a66.83 66.83 0 00-20-3.11c-26.68 0-46.26 18.98-46.26 44.92zm186.81-9l-6-1.95c-3.6-1.14-10.05-3-10.05-8.28 0-4.18 4.78-7.11 13.57-7.11 7.57 0 16.8 2.54 17.13 2.64V216.5a93.84 93.84 0 00-21.36-2.77c-20.22 0-32.39 10.91-32.39 27.16 0 14.36 10.19 21.49 22.4 25.39 1.35.44 3.35 1.07 4.68 1.52 5.42 1.71 9.76 4.25 9.76 8.65 0 4.92-5 8.11-15.93 8.11-9.58 0-18.75-2.75-20.7-3.23v19.97a131.45 131.45 0 0023.66 2.38c16.78 0 36-7.34 36-29.16-.06-10.52-6.55-20.29-20.77-24.79zm41.95 9c0 28 21.65 45 46.31 45a70.17 70.17 0 0020-3.08V277.3a38.91 38.91 0 01-18.45 4.61c-14.6 0-24-10.28-24-23.2 0-13.3 9.83-23.17 24-23.17a38.34 38.34 0 0118.45 4.64V216.9a67.07 67.07 0 00-20-3.11c-26.72 0-46.31 18.98-46.31 44.92zm135.26-44.92c-26.74 0-45.9 20.07-45.9 44.92s19.18 45 45.9 45 45.89-20.13 45.89-45-19.16-44.92-45.89-44.92zM431 274.73a22.86 22.86 0 01-15.86 6.85 22.86 22.86 0 110-45.71A22.87 22.87 0 01431 274.73z\" fill=\"#d92844\"/><path d=\"M315.81 155.57a10.86 10.86 0 0010.85-10.85V92A10.85 10.85 0 00305 92v52.73a10.86 10.86 0 0010.85 10.85zm52 18.71a10.92 10.92 0 003.56 2.44 10.83 10.83 0 008.46 0 10.92 10.92 0 003.56-2.44 10.65 10.65 0 002.33-3.63 10.91 10.91 0 00.74-4.26V51a10.86 10.86 0 00-21.71 0v115.39a10.84 10.84 0 003.06 7.89zM256 155.57a10.86 10.86 0 0010.85-10.85v-22.8a10.85 10.85 0 00-21.7 0v22.8A10.86 10.86 0 00256 155.57zM13.63 347.35v123.8H506.2v-123.8zm481.51-191.77A10.86 10.86 0 00506 144.72v-22.8a10.86 10.86 0 10-21.72 0v22.8a10.86 10.86 0 0010.86 10.86zm-59.75.06a10.93 10.93 0 0010.92-10.92V92a10.92 10.92 0 00-21.84 0v52.73a10.93 10.93 0 0010.92 10.92zm-410.92-3.43a10.92 10.92 0 003.3-7.49v-22.8a10.89 10.89 0 00-21.77 0v22.8a10.89 10.89 0 0018.47 7.49zm52.2 3.07a10.88 10.88 0 0010.88-10.56V92a10.89 10.89 0 00-21.77 0v52.73a10.88 10.88 0 0010.89 10.56zm59.79 22a10.89 10.89 0 0010.89-10.89V51a10.89 10.89 0 00-21.78 0v115.39a10.89 10.89 0 0010.89 10.89zm59.83-22a10.88 10.88 0 0010.88-10.56V92a10.89 10.89 0 00-21.77 0v52.73a10.9 10.9 0 0010.89 10.56z\" fill=\"#118da3\"/><path d=\"M209.2 404.67h-.2v-9.83h-16.35v53H209v-25.32q0-6.74 3-10.63a9.89 9.89 0 018.32-3.91 14.24 14.24 0 016.88 1.6v-15.05a10.57 10.57 0 00-4-.62q-10.11 0-14 10.76zM175.51 372a11.1 11.1 0 00-13.58 0 7.62 7.62 0 00-2.63 6 7.91 7.91 0 002.63 6 9.55 9.55 0 006.78 2.46 9.74 9.74 0 006.8-2.38 7.9 7.9 0 002.61-6.11 7.67 7.67 0 00-2.61-5.97zm-15.08 75.83h16.35v-53h-16.35zm-37-24.67a53.12 53.12 0 00-1.08 8.27h-.21a61.33 61.33 0 00-1.19-8l-12.15-49.81H90.87l-13.45 49.21a41.19 41.19 0 00-1.5 8.69h-.31a59.32 59.32 0 00-1-8.49l-10.43-49.39H45.92l19.5 74.17h19.3l12.62-47.59a51.12 51.12 0 001.34-8.32h.21a38.75 38.75 0 001.19 8.32l12.31 47.59h18.51l19.61-74.17h-16.87zm228.5-29.59a25.5 25.5 0 00-18.83 7.71q-7.65 7.71-7.65 20.89 0 12.74 7.08 19.84t19.92 7.11q11.73 0 19.08-3.93v-11.81a28.34 28.34 0 01-15.36 4.13q-13.71 0-14.53-11.53h34.55v-6.88q0-11.79-6.34-18.67t-17.95-6.88zM341.5 416a14.86 14.86 0 013.49-8.12 8.77 8.77 0 016.8-3.26q9.21 0 9.21 11.38zm79.78 5.63a19.16 19.16 0 00-4.53-3.15 46.61 46.61 0 00-5.89-2.48c-1.21-.42-2.42-.82-3.65-1.22a23.33 23.33 0 01-3.33-1.34 8.26 8.26 0 01-2.44-1.79 3.57 3.57 0 01-.93-2.48 3.17 3.17 0 01.63-1.94 4.56 4.56 0 011.7-1.4 10.13 10.13 0 012.51-.82 15.43 15.43 0 013-.29 27.71 27.71 0 016.95.91 26 26 0 016.65 2.71v-12.67a54.84 54.84 0 00-7.14-1.58 48.28 48.28 0 00-7.14-.54 38.44 38.44 0 00-8.66 1 23.76 23.76 0 00-7.4 3 15.91 15.91 0 00-5.17 5.25 14.54 14.54 0 00-1.94 7.65 16.72 16.72 0 00.86 5.64 12.28 12.28 0 002.48 4.19 15.84 15.84 0 004 3.18 39.75 39.75 0 005.56 2.56c1.31.52 2.67 1 4.09 1.4a34 34 0 013.9 1.39 10.7 10.7 0 012.93 1.81 3.39 3.39 0 011.13 2.59 3.84 3.84 0 01-2.5 3.62 16.35 16.35 0 01-6.86 1.19 26.83 26.83 0 01-7.58-1.19 34.73 34.73 0 01-8-3.62v13.24a47.42 47.42 0 0016.19 2.69 43.18 43.18 0 009.18-1 24.36 24.36 0 007.81-3.05 16.3 16.3 0 005.43-5.43 16.92 16.92 0 001-13.83 12.56 12.56 0 00-2.84-4.25zm-161-28a25.47 25.47 0 00-18.82 7.71q-7.67 7.71-7.66 20.89 0 12.74 7.09 19.84t19.91 7.11q11.75 0 19.08-3.93v-11.87a28.34 28.34 0 01-15.36 4.13q-13.72 0-14.52-11.51h34.55v-6.9q0-11.79-6.34-18.67t-17.96-6.88zM249.86 416a14.71 14.71 0 013.49-8.12 8.76 8.76 0 016.8-3.26q9.21 0 9.21 11.38zm223 9.88a12.56 12.56 0 00-2.9-4.25 19.16 19.16 0 00-4.53-3.15 46.61 46.61 0 00-5.89-2.48c-1.21-.42-2.42-.82-3.65-1.22a23.33 23.33 0 01-3.33-1.34 8.26 8.26 0 01-2.44-1.79 3.57 3.57 0 01-.93-2.48 3.17 3.17 0 01.63-1.94 4.56 4.56 0 011.7-1.4 10.13 10.13 0 012.51-.82 15.43 15.43 0 013-.29 27.71 27.71 0 016.95.91 26 26 0 016.65 2.71v-12.67a54.84 54.84 0 00-7.14-1.58 48.28 48.28 0 00-7.14-.54 38.38 38.38 0 00-8.66 1 23.76 23.76 0 00-7.4 3 15.82 15.82 0 00-5.17 5.25 14.54 14.54 0 00-1.94 7.65 16.72 16.72 0 00.86 5.64 12.28 12.28 0 002.48 4.19 15.84 15.84 0 004 3.18 39.75 39.75 0 005.56 2.56c1.31.52 2.67 1 4.09 1.4a34 34 0 013.9 1.39 10.7 10.7 0 012.93 1.81 3.39 3.39 0 011.13 2.59 3.84 3.84 0 01-2.5 3.62 16.35 16.35 0 01-6.86 1.19 26.83 26.83 0 01-7.58-1.19 34.73 34.73 0 01-8-3.62v13.24a47.42 47.42 0 0016.19 2.69 43.18 43.18 0 009.18-1 24.36 24.36 0 007.81-3.05 16.3 16.3 0 005.43-5.43 17 17 0 001-13.83zm-176.55 22h16.34V369.4h-16.3z\" fill=\"#fff\"/></svg>","aruba-wireless":"<svg viewBox=\"0 0 512 512\"><path d=\"M256.33 391.14c-76 0-138.51-60.82-138.51-135.15s62.45-135.13 138.51-135.13S394.85 181.67 394.85 256s-62.46 135.14-138.52 135.14zM256 12.75C117.48 12.75 6 122.55 6 256c0 135.14 111.49 243.25 250 243.25 57.44 0 109.8-18.58 152-50.75 25.34 42.24 98 50.75 98 50.75V256c0-133.45-111.49-243.25-250-243.25z\" fill=\"#f5831f\"/></svg>","aws-cloud":"<svg viewBox=\"0 0 512 512\"><path d=\"M116.61 411.51C59.74 411.51 6 380.31 6 322.4s47.16-87.4 65.19-90.5c-2.08-65.19 50.62-131.41 125.17-131.41s111.3 54.44 118.93 75.59c35-25.66 96-7.29 100.56 49.93 48.54 6.24 90.15 49.58 90.15 96.74s-39.53 88.76-109.22 88.76z\" fill=\"#f89822\"/><path d=\"M216.91 298.05a7.28 7.28 0 001.9 3.52 5 5 0 003.43.9H230a5.59 5.59 0 003.61-.9 7 7 0 001.71-3.6l13.89-58.08 14 58.17a6.32 6.32 0 001.72 3.61 5.4 5.4 0 003.6.9h7.8a5.74 5.74 0 003.42-.9 6.82 6.82 0 001.9-3.52l21.71-69.71a12.63 12.63 0 00.63-2.26 8.59 8.59 0 00.18-1.44 2 2 0 00-2.25-2.25h-8.42a6 6 0 00-3.52.9 7.62 7.62 0 00-1.8 3.51l-15.6 60.43-14.25-60.43a6 6 0 00-1.71-3.51 5.45 5.45 0 00-3.61-.9h-7.23a6.15 6.15 0 00-3.61.9c-.72.54-1.26 1.71-1.71 3.51l-14.07 59.7-15.15-59.71c-.54-1.71-1.08-3-1.8-3.51s-1.81-.9-3.52-.9h-8.84a2 2 0 00-2.17 2.25 16 16 0 00.82 3.61zm97 1.63a41.49 41.49 0 0010.37 3.61 60.13 60.13 0 0013.89 1.62A43 43 0 00351 303a29.28 29.28 0 0010-5.05 24.3 24.3 0 006.58-7.95 23.23 23.23 0 002.42-10.48 20.43 20.43 0 00-4.15-12.62c-2.8-3.7-7.49-6.59-14-8.66L339 254.18c-4.77-1.53-8.12-3.25-9.92-5a8.45 8.45 0 01-2-2.91 8.35 8.35 0 01-.67-3.49 8.72 8.72 0 014.23-8c2.8-1.71 6.86-2.53 12-2.53a41.44 41.44 0 0117.36 3.53 9.23 9.23 0 003.42 1.09c1.35 0 2.07-1 2.07-2.89v-4.24a4.83 4.83 0 00-.81-3 7.63 7.63 0 00-2.7-2.25 19.26 19.26 0 00-3.79-1.63c-1.62-.54-3.34-1-5.14-1.44s-3.79-.72-5.86-1a46.86 46.86 0 00-6-.36 39.43 39.43 0 00-11.37 1.54 28.7 28.7 0 00-9.38 4.69 23.32 23.32 0 00-6.49 7.41 20.2 20.2 0 00-2.43 10 21.44 21.44 0 004.51 13.08c3 4.05 7.84 7.12 14.42 9.2l13.08 4.05c4.42 1.45 7.49 3 9.11 4.7a8.8 8.8 0 012.44 6.31 9.71 9.71 0 01-4.68 8.59c-3.07 2-7.49 3-13.17 3a54.37 54.37 0 01-10.73-1.05 49.23 49.23 0 01-9.92-3.18c-.9-.37-1.73-.72-2.26-.9a5 5 0 00-1.62-.27c-1.35 0-2.07.9-2.07 2.79v4.6a6.31 6.31 0 00.53 2.53 6.48 6.48 0 002.7 2.53zm-152.84-43.83a70.86 70.86 0 00-9.54-.72c-9.28 0-16.59 2.34-22.09 7s-8.21 10.91-8.21 18.57c0 7.23 2.25 13 6.67 17.32s10.46 6.49 18 6.49q16 0 26.51-12.42c1 2.05 1.9 3.76 2.8 5.3a27.17 27.17 0 003.25 4.23 4.14 4.14 0 002.7 1.27 4.33 4.33 0 002.35-.82l5.68-3.78a3.54 3.54 0 001.71-2.71 3.9 3.9 0 00-.63-2.07 48.18 48.18 0 01-2.88-6.49 27.6 27.6 0 01-1-8h-.22v-29.24c0-9.92-2.53-17.32-7.49-22.19s-12.9-7.3-23.63-7.3A54.76 54.76 0 00141 222a52.17 52.17 0 00-11.36 4.06 6.71 6.71 0 00-2.52 1.89 5.88 5.88 0 00-.63 3.18v4.42c0 1.89.63 2.79 1.89 2.79a5.09 5.09 0 001.44-.27 25.19 25.19 0 003.18-1.17 71.9 71.9 0 019.74-3.06 41 41 0 019.74-1.18c6.94 0 11.81 1.36 14.7 4.15s4.24 7.58 4.24 14.43v6.59c-3.59-.83-7.02-1.53-10.35-1.98zm10.57 12.06v3.79a32.36 32.36 0 01-.9 7.84 14.25 14.25 0 01-3.06 5.77 20.14 20.14 0 01-8.57 5.8 29.13 29.13 0 01-9.29 1.62c-4.15 0-7.3-1.06-9.45-3.34s-3.34-5.32-3.34-9.56c0-4.51 1.42-7.94 4.4-10.38s7.4-3.6 13.44-3.6a66.65 66.65 0 018.47.53 72.59 72.59 0 018.3 1.53zm208.51 57c-3.25-4-31.12-7.39-48.07 4.51-2.62 1.9-2.17 4.42.72 4.06 9.65-1.17 30.93-3.7 34.72 1.17s-4.24 24.89-7.85 33.82c-1.06 2.71 1.27 3.79 3.7 1.71 15.88-13.33 20.02-41.18 16.78-45.26zm-29.31 16.94a268 268 0 01-102.36 20.92c-48.79 0-96-13.44-134.19-35.63-3.34-2-5.86 1.47-3.07 4 35.34 31.93 82.16 51.14 134.1 51.14 37.07 0 80.19-11.64 109.85-33.55 4.83-3.61.63-9.11-4.33-6.87z\" fill=\"#fff\"/></svg>","azure-cloud":"<svg viewBox=\"0 0 512 512\"><path d=\"M304.51 341.33c17.12 0 31.26-14.11 31.26-32.88s-14.14-31.23-32.88-31.23c-12.46 0-23.44 7.81-29.73 18.77H88.89c-31.26 0-56.32-26.58-56.32-57.82s25.07-57.8 56.32-57.8h26.57c0-6.3 3.15-12.48 4.66-18.78 1.5-1.5 1.5-4.65 3.14-6.29a74.4 74.4 0 0165.63-39.07c25.07 0 46.88 12.47 61 31.25 7.82-3.14 15.63-6.3 25.07-7.81-17.13-29.73-48.5-48.5-85.94-48.5-42.2 0-78.13 26.58-93.71 64.12h-6.42C43.54 155.3 6 192.83 6 239.69a82.45 82.45 0 0082.89 82.87h185.9c4.65 10.97 15.62 18.77 29.72 18.77zM406 213.1c-18.75-37.53-57.79-64.1-101.49-64.1-54.69 0-100 39.06-111 90.69-26.58 3.14-50 17.12-64.12 37.53h135.9c9.32-12.46 23.44-18.77 39.07-18.77 28.07 0 50 23.44 50 51.51s-23.44 51.51-50 51.51c-15.63 0-29.73-7.81-39.07-18.77H113.82c6.3 43.7 43.69 78.13 87.53 78.13h203.14c56.3 0 101.51-45.34 101.51-103.16S460.68 214.75 406 213.1z\" fill=\"#008cdb\"/></svg>","windows":"<svg viewBox=\"0 0 512 512\"><path d=\"M242.85 45.46L506 6v234.2H242.85z\" fill=\"#90c300\"/><path d=\"M6 79.67l201.76-29.83v193H6z\" fill=\"#f8672c\"/><path d=\"M242.85 466.51L506 506V277.91H242.85z\" fill=\"#ffc400\"/><path d=\"M6 432.3l201.76 29.83V277.91H6z\" fill=\"#00b4f2\"/></svg>","citrix-xen-cluster":"<svg viewBox=\"0 0 512 512\"><path d=\"M114.06 310.34h32.6V201.61h-32.6zM63 231.18c9.58 0 19.09 5.13 23.91 13.17l17.17-27.72a57 57 0 100 78.85L87 267.69c-4.82 8-14.33 13.17-23.93 13.17-13.72 0-23.73-11.09-23.73-24.81s10-24.87 23.66-24.87zm41.09-14.56zm276.49-15H348v108.71h32.61zM155.45 230h24.79v80.32h32.46V230h24.8v-28.39h-82.05zm220.21 93a20.43 20.43 0 00-19.17-2 20.44 20.44 0 00-12.64 18.89 20.43 20.43 0 1031.81-17zM141.75 155.1a20.44 20.44 0 107.52 9.18 20.42 20.42 0 00-7.52-9.18zm326.43 96.53l36-50h-40l-14.91 23.06-12.88-23.06h-39.94l33.38 49.88-43.56 58.85h39.51l23-32 18.13 32H506zm-140.32-15.35c0-10.14-3-18.28-9.07-24.31-6.76-6.79-17-10.36-29.71-10.36h-42.74v108.73H279v-32.46l20.72 32.46h41.05L307.58 267c12.42-4.23 20.28-15.8 20.28-30.72zm-29.2 1.6c0 9-5.78 12.7-19.67 12.84v-25.61c5.54 0 13 .57 16.82 4.43 1.94 2 2.9 4.68 2.9 8.34z\" fill=\"#197ad1\"/></svg>","citrix-xen":"<svg viewBox=\"0 0 512 512\"><path d=\"M258.93 207.55a126.59 126.59 0 00-68.53-68.62A127.77 127.77 0 0071.56 150.6a126.65 126.65 0 10197 105.45 126 126 0 00-9.63-48.5zM226.87 312.8a102.13 102.13 0 1117.29-56.8 101.81 101.81 0 01-17.29 56.8z\" fill=\"#edaf24\"/><path d=\"M280.86 189.54h-80.61s-49.07 39-49.08 38.79c.08.07-29.1-38.79-29.1-38.79H52.33c.09 0 55.8 68.66 55.79 68.67C108.31 258.36 6.14 338 6 338s79.93.05 80 0 53.05-42 53.13-41.93S167.34 338 167.33 338s70.73.13 70.76 0-56.33-72.24-56.33-72.24c.31-.09 99.17-76.22 99.1-76.22zm73.26 83.24a58.19 58.19 0 002.47-17.93c0-8.1-5.13-17.52-12.76-22.89-7.33-4.7-15.88-7.15-23.16-8.64a154 154 0 00-17.79-1.93h-4.64.06a177.44 177.44 0 00-18.29.86 121.09 121.09 0 00-13.15 1.92c-4.24 1.46-9 1.88-14 4-16.74 5.39-31.76 19.06-35.93 36.27-1.13 4.63-2.29 10.48-1.38 16.23 1.06 10.86 10.85 20 21.41 23.66a76.31 76.31 0 0013.7 3.67c5.54.84 11.33 1.47 17.54 1.93a142.65 142.65 0 0019.06.28 161.3 161.3 0 0018.35-2c4.5-.84 9.76-1.7 14.25-3 11.14-3.28 26.42-9.3 30.32-22.34h-51.86c-2.24 5.46-8.89 8.67-14 9.19-6.36.65-15.68.45-17.56-7.54-1.05-4.32-.72-7 .14-11.65zm-71.37-31.55a21.27 21.27 0 019.59-2.2 18.79 18.79 0 0111.11 3.3c3.78 4.38 3.3 9.1 2.2 13.93 0 0-34.55.35-34.55.32 1.36-6.46 5.44-12.7 11.65-15.35zm216.39-10.94c-6.74-6.15-15.19-7.8-23.43-8.65a73.73 73.73 0 00-7.57-.33A92.77 92.77 0 00454 222.5c-9.32 1.54-21.44 7.41-30.38 16.38 0-.17 2.61-14.82 2.61-14.82h-52.3s-17.94 82.8-18.09 82.69h53c2.12-9.72 4.39-19.4 6.72-29.05 2.63-9.16 2.54-20.26 11.11-27 4.65-3.67 10.82-3.79 15.63-3.69 7.14.15 9.64 7.91 8.37 13.15-3.75 15.35-10.59 46.64-10.59 46.59h52.94s8.7-35.1 12.3-52.77c1.62-7.84.55-17.55-6.18-23.69z\" fill=\"#197ad1\"/></svg>","vmware-esxi":"<svg viewBox=\"0 0 512 512\"><defs><linearGradient id=\"dp-vmwareesxi-a\" x1=\"9.3\" y1=\"256\" x2=\"502.7\" y2=\"256\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".05\" stop-color=\"#9ccb53\"/><stop offset=\".32\" stop-color=\"#93c24e\"/><stop offset=\".75\" stop-color=\"#79aa42\"/><stop offset=\".99\" stop-color=\"#689a3a\"/></linearGradient><linearGradient id=\"dp-vmwareesxi-b\" x1=\"145.54\" y1=\"371.54\" x2=\"339.79\" y2=\"164.89\" gradientUnits=\"userSpaceOnUse\"><stop offset=\".05\" stop-color=\"#fcdd3e\"/><stop offset=\".33\" stop-color=\"#fad43e\"/><stop offset=\".79\" stop-color=\"#f5ba3d\"/><stop offset=\".99\" stop-color=\"#f2ad3d\"/></linearGradient></defs><path d=\"M483.83 24.88A64.5 64.5 0 00438.27 6h-239a64.46 64.46 0 00-64.45 64.45v67.63H73.75A64.46 64.46 0 009.3 202.53v239A64.47 64.47 0 0073.75 506h239a64.44 64.44 0 0064.45-64.45V373.9h61.07a64.47 64.47 0 0064.46-64.45v-239a64.48 64.48 0 00-18.9-45.57zM435 272.6a38.09 38.09 0 01-38 38h-87.51v94.07a38 38 0 01-38 38H106.24a38 38 0 01-38-38V239.4a38 38 0 0138-38h87.52v-94.06a38 38 0 0138-38H397a38 38 0 0138 38z\" fill=\"url(#dp-vmwareesxi-a)\"/><path d=\"M386.25 134.19a23.77 23.77 0 00-12.86-12.85 23.82 23.82 0 00-9.09-1.81h-99.84a23.75 23.75 0 00-23.75 23.75v99.89c0 9-8.47 8.46-8.47 8.46h-94.41a23.74 23.74 0 00-23.75 23.75v99.88A23.75 23.75 0 00137.83 399h99.87a23.77 23.77 0 0023.75-23.76v-99.86s-.53-8.46 6.26-8.46h96.59a23.78 23.78 0 0016.8-7 23.73 23.73 0 007-16.79v-99.85a23.63 23.63 0 00-1.85-9.09z\" fill=\"url(#dp-vmwareesxi-b)\"/></svg>","hpe":"<svg viewBox=\"0 0 48 48\"><defs><clipPath id=\"dp-hpe-a\"><path fill=\"none\" d=\"M2 14.82h44v18.36H2z\"/></clipPath></defs><g fill-rule=\"evenodd\" clip-path=\"url(#dp-hpe-a)\"><path d=\"M17.06 19.15H2.02v-4.32h15.04v4.32zm-14.1-.94h13.16v-2.44H2.96v2.44z\" fill=\"#00b188\"/><path d=\"M2.96 26.29h-.94v-4.32h.94v1.71h1.68v-1.71h.94v4.32h-.94V24.5H2.96v1.79zm4.77.06c-.95 0-1.6-.6-1.6-1.59s.64-1.62 1.48-1.62c.92 0 1.37.62 1.37 1.53v.34H7.02c.11.48.49.6.86.6.32 0 .56-.07.85-.25h.03v.71c-.25.18-.6.27-1.03.27zm-.71-1.97h1.12c-.02-.32-.15-.54-.52-.54-.28 0-.52.12-.6.54zm4.41.1l-.48 1.81h-.82l-.94-3.04v-.04h.9l.51 1.82.48-1.82h.73l.49 1.82.52-1.82h.87v.04l-.94 3.04h-.82l-.49-1.81zm3.76 1.86c-.74 0-1.05-.3-1.05-.99v-3.39h.91v3.33c0 .22.08.29.26.29.06 0 .15-.02.21-.04h.01v.75c-.08.03-.21.05-.35.05zm2.22.01c-.95 0-1.6-.6-1.6-1.59s.64-1.62 1.48-1.62c.92 0 1.38.62 1.38 1.53v.34h-1.96c.11.48.48.6.86.6.32 0 .56-.07.85-.25h.03v.71c-.25.18-.6.27-1.03.27zm-.72-1.97h1.12c-.02-.32-.15-.54-.52-.54-.28 0-.52.12-.6.54zm5.73-1.17h.68v.73h-.68v1.25c0 .27.1.39.38.39.08 0 .17 0 .28-.04h.02v.72c-.12.04-.3.09-.56.09-.74 0-1.03-.34-1.03-1.12v-1.29h-1.17v1.25c0 .27.1.39.38.39.08 0 .17 0 .28-.04h.02v.72c-.12.04-.3.09-.56.09-.74 0-1.03-.34-1.03-1.12v-1.29h-.47v-.73h.47v-.84h.91v.84h1.17v-.84h.91v.84zm5.4.2c0 .94-.63 1.45-1.58 1.45h-.67v1.4h-.94v-4.32h1.61c.95 0 1.58.51 1.58 1.47zm-1.66.66c.48 0 .71-.27.71-.66s-.23-.67-.71-.67h-.59v1.33h.59zm3.7 1.9c-.2.24-.5.36-.82.36-.6 0-1.09-.36-1.09-1.02 0-.6.49-1 1.2-1 .22 0 .45.03.68.1v-.05c0-.33-.19-.48-.68-.48-.31 0-.61.09-.86.24h-.03v-.73c.23-.14.65-.26 1.05-.26.93 0 1.43.44 1.43 1.22v1.93h-.88v-.3zm-.03-.66v-.26c-.14-.07-.32-.1-.51-.1-.3 0-.48.11-.48.36s.18.37.45.37c.26 0 .45-.13.53-.36zm1.36-.57c0-.99.7-1.61 1.61-1.61.32 0 .63.07.86.24v.78h-.04c-.2-.15-.43-.24-.7-.24-.46 0-.8.31-.8.84s.34.83.8.83c.27 0 .51-.09.7-.24h.04v.78c-.23.16-.53.24-.86.24-.91 0-1.61-.62-1.61-1.6zm3.96.14v1.4h-.91v-4.32h.91v2.46l.92-1.22h1.04v.03L36 24.62l1.11 1.61v.03h-1.05l-.91-1.4zm4.03 1.09c-.2.24-.5.36-.82.36-.6 0-1.09-.37-1.09-1.02 0-.6.49-1 1.2-1 .22 0 .45.03.68.1v-.06c0-.33-.18-.47-.68-.47-.31 0-.61.09-.87.23h-.03v-.73c.24-.14.65-.26 1.06-.26.93 0 1.43.44 1.43 1.22v1.93h-.89v-.3zm-.03-.66v-.26c-.14-.07-.32-.1-.5-.1-.3 0-.48.11-.48.36s.18.37.45.37.45-.13.53-.36zm2.46-1.62c.17-.34.41-.53.75-.53.12 0 .25.03.3.06v.87h-.03c-.1-.04-.23-.07-.4-.07-.28 0-.51.16-.58.48v1.77h-.91v-3.08h.89v.5zm3.48 2.28c-.19.25-.5.39-.91.39-.79 0-1.29-.72-1.29-1.6s.51-1.61 1.29-1.61c.4 0 .69.12.89.35v-1.53h.91v4.32h-.89v-.32zm-.02-.73v-.99a.675.675 0 00-.58-.32c-.4 0-.67.29-.67.82s.27.81.67.81c.23 0 .43-.09.58-.32zM2.03 27.7H4.7v.53H2.63v1.32H4.5v.51H2.63v1.44H4.7v.53H2.03v-4.32zm4.87 1.21c.68 0 1.06.45 1.06 1.19v1.92h-.57v-1.9c0-.39-.2-.68-.64-.68-.36 0-.66.23-.77.55v2.03h-.57v-3.04h.57v.44c.18-.28.49-.51.91-.51zm2.6.05h.78v.49H9.5v1.64c0 .34.18.46.5.46.09 0 .19-.01.26-.04h.02V32c-.08.03-.2.06-.36.06-.71 0-1-.32-1-.92v-1.69h-.53v-.49h.53v-.81h.57v.81zm2.64 3.12c-.89 0-1.5-.59-1.5-1.55s.57-1.62 1.39-1.62 1.27.6 1.27 1.49v.26h-2.09c.06.62.46.91 1 .91.34 0 .58-.08.85-.28h.02v.51c-.25.19-.57.27-.95.27zm-.91-1.88h1.51c-.02-.45-.24-.8-.71-.8-.43 0-.72.32-.8.8zm3.34-.76c.13-.32.42-.52.75-.52.13 0 .25.02.3.05v.57h-.02a.9.9 0 00-.36-.06c-.31 0-.57.21-.67.55v1.98H14v-3.04h.57v.47zm2.98-.53c.91 0 1.39.74 1.39 1.58s-.49 1.58-1.39 1.58c-.37 0-.69-.19-.85-.4v1.51h-.57v-4.21h.57v.34c.16-.22.48-.41.85-.41zm-.09 2.65c.57 0 .9-.45.9-1.07s-.33-1.06-.9-1.06c-.31 0-.6.19-.76.48v1.17c.15.3.44.48.76.48zm2.74-2.12c.13-.32.42-.52.75-.52.13 0 .25.02.3.05v.57h-.02a.9.9 0 00-.36-.06c-.31 0-.57.21-.67.55v1.98h-.57v-3.04h.57v.47zm1.88-.98c-.2 0-.37-.16-.37-.36s.16-.36.37-.36.36.16.36.36-.16.36-.36.36zm-.28.51h.57v3.04h-.57v-3.04zm2.62 1.26c.43.14.92.32.92.9 0 .62-.51.94-1.17.94-.4 0-.8-.1-1.03-.28v-.55h.03c.26.24.64.34 1 .34.32 0 .62-.13.62-.39s-.24-.33-.72-.49c-.43-.14-.91-.3-.91-.87s.48-.93 1.1-.93c.36 0 .68.07.93.25v.55h-.02c-.25-.2-.54-.32-.9-.32s-.56.16-.56.37c0 .24.22.31.71.47zm2.91 1.85c-.89 0-1.5-.59-1.5-1.55s.57-1.62 1.39-1.62 1.27.6 1.27 1.49v.26H26.4c.06.62.46.91 1 .91.34 0 .58-.07.85-.28h.02v.5c-.25.2-.57.27-.95.27zm-.91-1.88h1.51c-.02-.45-.24-.79-.71-.79-.44 0-.72.32-.8.79z\" fill=\"#7b8fa5\"/></g></svg>","hyperv-cluster":"<svg viewBox=\"0 0 512 512\"><path d=\"M89.81 502.94h19.81v-95H89.81zM69.13 311.36H31.89v-35.85H11.64v89.89h20.25v-36.61h37.24v36.61h20.31v-89.89H69.13zm98.42 164.12q0 6.39-3.2 10.12a10.65 10.65 0 01-8.53 3.73q-10.77 0-10.78-13.6v-37H125.3v38.75q0 27 22.31 27 12.28 0 19.62-11.34h.32v9.78h19.74v-64.2h-19.74zm178.72-162.36H346v-11.91h-19.79v64.19H346v-30.65q0-8.14 3.64-12.89a12 12 0 0110.09-4.73 17.18 17.18 0 018.34 1.95v-18.25a12.79 12.79 0 00-4.89-.75q-12.18 0-16.91 13.04zM19.32 425Q6 438.38 6 459.93q0 20.25 11.85 32.41t32.53 12.16q15.87 0 25.71-4.76v-18.49A42.21 42.21 0 0154.4 487q-12.4 0-19.75-7.73t-7.34-20.78q0-13.61 7.78-21.56t20.43-8a39.31 39.31 0 0120.57 5.4v-19.5q-9-3.32-22.2-3.32-21.24.03-34.57 13.49zm120.2-292.24c20.84-.33 41.7 0 62.54 0s41.7-.33 62.21 0c5.78 0 8.13-1.67 7.77-7.78-.33-9.76 0-19.53 0-29.29.33-26.52 0-53.44 0-79.9 0-4.15 1.34-9.16-6.1-8.14-42.72 6.45-85.44 12.43-128.16 18.53-5.46 1-7.45 3-7.45 8.77.34 29.62.34 59.05 0 89 .04 7.43 2.74 8.76 9.19 8.76zm.76 118.78c41.37 5.8 82.89 11.44 123.93 17.55 6.1 1 8.13-.34 8.13-6.8v-55.13c0-18.37-.32-36.62.34-55.1 0-6.1-1.66-8.77-8.43-8.77-41.53 0-83.23 0-125.59-.33-6.45 0-8.43 2-8.43 8.44.34 29.62.67 59.06 0 88.34-.02 8.12 2.61 10.76 10.05 11.75zM18.09 132.7h46c15.05 0 30.62-.32 46-.32 5.78 0 8.44-1 8.44-7.45v-88c0-5.8-.67-8.14-7.79-7.12q-46.26 7.45-92.66 13.4c-6.11 1-7.78 3-7.78 8.77.31 24.32.31 48.47 0 72.64.01 6.1 1.99 8.08 7.79 8.08zm.05 101.75c30.75 4.26 61.7 8.83 92.64 13.41 4.81.49 7.12 0 7.12-5.31l-.06-92c0-5.08-2.14-6.78-7.12-6.78H64.1c-15.56 0-30.61 0-46.32-.49-6.1 0-7.78 1.68-7.78 7.78.34 25 .34 49.46 0 74 0 6.34 2 8.41 8.14 9.39zm125 136.09l26.08-69.33h-19.66l-12.1 39.18a58.3 58.3 0 00-2.07 8.46h-.25a51.33 51.33 0 00-1.76-8.59l-12-39.05H99.47l26.08 64.07-3.39 8q-3 7.2-10.66 7.21a16.69 16.69 0 01-8.58-2.32v15.79a36.17 36.17 0 0011.84 1.63q18.94-.04 28.34-25.05zm269.12-46.32h-34.33v13.85h34.29zm-127.38 95l-19.75 5.64v13.85h-10.45v14.61h10.41v29.4q0 21.75 20.94 21.75 8.84 0 13.22-2.32v-14.63a13.39 13.39 0 01-6.45 1.81q-8 0-8-10v-25.98h14.41v-14.61h-14.37zm53.85 17.93a30.89 30.89 0 00-22.82 9.34q-9.28 9.35-9.28 25.32 0 15.42 8.59 24t24.13 8.62q14.24 0 23.13-4.76v-14.22a34.37 34.37 0 01-18.61 5q-16.62 0-17.62-14h41.88v-8.34q0-14.28-7.68-22.63t-21.76-8.3zm-12.6 27.14a17.89 17.89 0 014.23-9.84 10.65 10.65 0 018.24-4q11.16 0 11.16 13.79zm158.68-188.78l-18.62 62.31a50.58 50.58 0 00-1.94 9.21h-.38a44.93 44.93 0 00-1.81-9l-18.75-62.56H421.5l30.59 89.89H475l31-89.89zM285.65 367q14.24 0 23.13-4.77v-14.32a34.32 34.32 0 01-18.61 5q-16.62 0-17.62-14h41.88v-8.34q0-14.3-7.68-22.63t-21.75-8.3a30.93 30.93 0 00-22.79 9.36q-9.28 9.34-9.28 25.33 0 15.42 8.59 24t24.13 8.67zm-9-50a10.65 10.65 0 018.25-4q11.16 0 11.16 13.8h-23.64a18 18 0 014.24-9.86zM236 357.25q7.93-9.72 7.93-25.76 0-14.73-6.8-23.29t-19.28-8.56q-13.29 0-20.62 11.22H197v-9.65h-19.86v93.72H197v-37h.25q6.08 9 17.68 9Q228 367 236 357.25zm-35.82-9.65q-3.53-4.2-3.52-10.85v-5.14q0-7.58 3.86-12.19a12.37 12.37 0 019.94-4.61q13.15 0 13.16 16.93 0 9.58-3.73 14.82a12.16 12.16 0 01-10.5 5.24 11.42 11.42 0 01-9.24-4.2zm44.16 123.55a23 23 0 00-5.49-3.82 57 57 0 00-7.14-3c-1.47-.5-2.94-1-4.42-1.47a30 30 0 01-4-1.63 9.78 9.78 0 01-2.94-2.17 4.32 4.32 0 01-1.13-3 3.9 3.9 0 01.75-2.35A5.58 5.58 0 01222 452a12.06 12.06 0 013-1 18.66 18.66 0 013.67-.35 34 34 0 018.43 1.1 31.41 31.41 0 018.06 3.29v-15.29a62.85 62.85 0 00-8.66-1.91 58 58 0 00-8.65-.66 46.42 46.42 0 00-10.5 1.16 28.58 28.58 0 00-9 3.63 19.18 19.18 0 00-6.27 6.37 17.54 17.54 0 00-2.35 9.27 20.26 20.26 0 001 6.84 15.23 15.23 0 003 5.07 19.51 19.51 0 004.89 3.86 47.37 47.37 0 006.74 3.1q2.38.94 4.95 1.69a41.41 41.41 0 014.74 1.7 13.05 13.05 0 013.54 2.19 4.07 4.07 0 011.38 3.14 4.66 4.66 0 01-3 4.38 19.58 19.58 0 01-8.27 1.42 32 32 0 01-9.18-1.45 42.26 42.26 0 01-9.75-4.38v16a57.21 57.21 0 0019.62 3.26 52.14 52.14 0 0011.13-1.16 29.75 29.75 0 009.46-3.69 20 20 0 006.59-6.59 20.61 20.61 0 001.25-16.77 15.27 15.27 0 00-3.51-5.07zm155.62-20.5h-.25v-11.91h-19.84v64.2h19.81v-30.66q0-8.14 3.64-12.88a12 12 0 0110.09-4.73 17.24 17.24 0 018.34 1.94v-18.24a12.79 12.79 0 00-4.89-.75q-12.22 0-16.93 13.03z\" fill=\"#35a6de\"/></svg>","hyper-v":"<svg viewBox=\"0 0 512 512\"><path d=\"M14.14 277.37c30.75 4.25 61.7 8.83 92.64 13.4 4.81.49 7.12 0 7.12-5.31l-.06-92c0-5.09-2.14-6.79-7.12-6.79H60.1c-15.56 0-30.61 0-46.32-.49-6.1.02-7.78 1.7-7.78 7.82.34 25 .34 49.46 0 73.95 0 6.37 2 8.43 8.14 9.42zm122.14 17c41.37 5.79 82.89 11.44 123.93 17.54 6.1 1 8.13-.34 8.13-6.79v-55.05c0-18.37-.32-36.62.34-55.1 0-6.1-1.66-8.77-8.43-8.77-41.53 0-83.23 0-125.59-.33-6.45 0-8.43 2-8.43 8.44.34 29.62.67 59.06 0 88.35-.02 8.11 2.61 10.76 10.05 11.75zm-.76-118.78c20.84-.34 41.7 0 62.54 0s41.7-.34 62.21 0c5.78 0 8.13-1.68 7.77-7.78-.33-9.77 0-19.53 0-29.3.33-26.51 0-53.44 0-79.9 0-4.15 1.34-9.15-6.1-8.14C219.22 57 176.5 63 133.78 69.07c-5.46 1-7.45 3-7.45 8.77.34 29.62.34 59.06 0 89 .04 7.45 2.74 8.79 9.19 8.79zM64.8 376.57H27.2v-36.22H6.75v90.79H27.2v-37h37.6v37h20.51v-90.79H64.8zM14.09 175.62h46c15.05 0 30.62-.33 46-.33 5.78 0 8.44-1 8.44-7.44v-88c0-5.8-.67-8.14-7.79-7.12Q60.49 80.17 14.09 86.1c-6.11 1-7.78 3-7.78 8.78.31 24.32.31 48.46 0 72.63 0 6.12 1.98 8.11 7.78 8.11zm362.57 227.92h34.63v-14h-34.63zm107.94-63.19l-18.8 62.93a51 51 0 00-2 9.31h-.38a45.37 45.37 0 00-1.84-9l-18.93-63.19h-22l30.9 90.79h23.17L506 340.35zm-350.79 65.53a60.89 60.89 0 00-2.09 8.55h-.25a52 52 0 00-1.78-8.68l-12.09-39.44H95.44L121.78 431l-3.42 8q-3 7.29-10.76 7.28a16.85 16.85 0 01-8.68-2.28v15.95a36.65 36.65 0 0012 1.65q19.12 0 28.62-25.26l26.33-70H146zm210.88-27.54h-.25v-12h-20v64.83h20v-31q0-8.22 3.67-13a12.14 12.14 0 0110.19-4.78 17.42 17.42 0 018.42 2v-18.46a12.82 12.82 0 00-4.94-.76q-12.34 0-17.09 13.17zM215 364.73q-13.42 0-20.83 11.33h-.25v-9.75h-20V461h20v-37.39h.25q6.13 9.11 17.85 9.11 13.31 0 21.31-9.81t8-26q0-14.88-6.87-23.52T215 364.73zm2 47.39a12.28 12.28 0 01-10.61 5.28 11.52 11.52 0 01-9.3-4.24q-3.56-4.25-3.55-11V397q0-7.66 3.89-12.32a12.51 12.51 0 0110-4.65q13.29 0 13.29 17.09.07 9.71-3.72 15zm65.81-47.39a31.22 31.22 0 00-23 9.43q-9.36 9.43-9.37 25.58 0 15.57 8.68 24.28t24.37 8.7q14.37 0 23.36-4.81v-14.43a34.78 34.78 0 01-18.8 5.06q-16.78 0-17.79-14.12h42.29V396q0-14.43-7.76-22.85t-21.95-8.42zm-12.73 27.41a18.08 18.08 0 014.28-9.94 10.74 10.74 0 018.32-4q11.27 0 11.27 13.93z\" fill=\"#35a6de\"/></svg>","kvm":"<svg id=\"dp-kvm-Layer_1\" viewBox=\"0 0 512 512\"><defs><style>.dp-kvm-cls-1{fill:#e3e3e1}.dp-kvm-cls-2{fill:#f1f0f0}.dp-kvm-cls-5{fill:#e8c31e}.dp-kvm-cls-7{fill:#eed441}</style></defs><path d=\"M280.39 62.69l-36.3 116.27-5.29-19.21-31.63-97.06h-34.91l56.2 157 30.75-.05v-.02h.02l55.48-156.93h-34.32zm-169.36 54.6l45.94-54.62h-37.83s0 .01-.01.02c-18.94 22.95-38.06 45.79-56.5 69.14l.3-69.15-.02.02H31.35v.02h-.02v156.95h31.56v-.02h.02V173.9l24.5-29.05.75-.45 42.59 75.27h37.53v-.02h.02L111.03 117.3zm369.63 102.38h-.02v.02l.02-.02zM449.44 62.76l-33.17 74.71-8.97 22.55-11.13-26.83-32.68-70.47h-30.17v156.96h30.94l-.46-91.5c12.33 30.86 27.31 60.57 40.62 91 .68.95 2.72.3 3.81.51l41.5-91.51-.61 91.5h31.54V62.73l-31.21.04z\" fill=\"#35354c\"/><path d=\"M171.3 298.38c33.9-3.67 37.67 47.16 5.27 49.71-32.93 2.6-36.81-46.3-5.27-49.71z\" fill=\"#c11d71\"/><path d=\"M337.92 198c33.9-3.68 37.65 47.15 5.28 49.71-32.38 2.56-36.8-46.28-5.28-49.71z\" fill=\"#4c853d\"/><circle cx=\"201.33\" cy=\"131.47\" r=\"25\" fill=\"#3177bc\"/><g id=\"dp-kvm-R2EfDG\"><path d=\"M305.6 344.16c-1.66.6-5.39 4.53-8.11 4.93-.8 2.38 4.04 4.59 5.91 4.9 31.42 5.16 30.76-22.1 42.43-41.89 2.09-3.56 6.19-6.97 7.8-11.07 3.64-9.32-2.95-18.26.46-27.84 3.73-.06 3.96 2.04 5.76 4.56 3.07 4.33 6.34 11.84 7.71 16.97 1.89 7 .06 25.09-1.35 28.73-3.21 8.29-11.01 17.32-16.6 23.37-9.03 9.72-19.55 18.29-31.39 24.31 7.74 19.21 11.24 40.28 7.94 60.89-7.43.37-14.94-.14-22.36.09v-.89c2.64-15.94.6-33.4-7.74-47.51-1.75-2.95-6.16-7.31-7.05-9.12-1.55-3.21-2.61-11.67-4.3-16.37-2.38-6.59-10.69-19.5-11.47-24.91-.23-1.55.92-3.13.89-3.58-.06-.89.09-1.81 0-2.69 2.15-2.44-.6-9.09-2.69-9.89 5.91-8.46 4.56-24.89-6.28-27.84 8.08 15.42-13.16 22.22-12.59 3.58-4.93 4.21-4.5 11.9-.89 17.06-3.96-1.06-9.78-1.83-13.47 0-.29 0-3.61.95-3.78 1.03l1.98-1.92c3.35-5.25-.37-17.4-7.2-17.95-1.75-.14-3.35-.26-4.47 1.35 2.52 4.39 3.44 6.88 5.36.46 1.92 5.91.4 14.91-7.14 10.29a9.64 9.64 0 01-2.44-2.78 9.175 9.175 0 01-1.18-3.93c-.52 2.41-.72 6.36-.23 11.21.37 3.78 1.43 7.43 3.81 10.32-.26.17-2.87 4.73-3.15 5.39-3.01 6.77-.57 5.82 3.15 9.89 2.81 13.56-7.4 20.93-12.16 31.42-1.55 3.41-1.49 4.79-2.24 8.11-.72 3.3-1.38 6.54-1.81 9.89-2.04.97-9.78 15.45-9.89 17.6-.17 2.98 3.33 4.47 4.9 6.71 2.72 3.87 4.27 8.72 2.78 13.45-2.81 9.09-11.67-3.56-13.07-1.83-.14 4.33-.95 8.14-.89 12.56v1.81c-4.44-.11-9.15.69-13.36-1-.17-5.82 2.06-11.41 3.47-16.94-10.69-.46-17.35 5.68-28.56 2.98-2.95-.72-17.95-8.23-20.36-10.18-5.22-4.16-6.77-11.35-3.9-17.37 9.26-19.29 57.05-40.54 77.55-43.69 6.22-.97 8.57 1.49 9.46-7.6 1.58-16.03-3.13-36.21-1.86-53.07 3.64-49.54 68.06-47.42 79.9-4.42 3.9 14.19.63 30.68 3.7 43.89.63 2.69 4.24 7.51 5.53 10.64 1.09 2.69.29 6.34 3.41 7.83l.06.06zm-31.42-53.9c1.2-1.2-4.56-6.08-6.28-5.39-1.18 1.12 5.59 6.05 6.28 5.39zm-42.66-4.48v.89c.57-.29.57-.6 0-.89zm4.93 5.36c.46-4.85-6.39-6.62-2.04-1.15.54.69-.09 1.69 2.04 1.15zm-26.95 59.29c-7.91.43-15.88 2.92-23.05 6.14-5.85 2.61-31.59 17.55-32.63 23.08-1.18 6.36 4.64 14.02 11.01 14.65l29.39-13.79c4.13-10.61 8.74-20.73 15.28-30.05v-.03zm-16.17 35.04c-.54-.52-11.84 4.42-13.22 5.19-6.71 3.78 8.6 5.99 9.49 5.42.49-.29 4.13-10.24 3.73-10.64v.03z\" fill=\"#36354c\"/><path class=\"dp-kvm-cls-2\" d=\"M354.11 273.2c-3.41 9.55 3.18 18.49-.46 27.84-1.61 4.1-5.71 7.48-7.8 11.07-11.67 19.78-11.01 47.05-42.43 41.89-1.86-.32-6.71-2.49-5.91-4.9 2.72-.4 6.45-4.36 8.11-4.93.43-.14.77 0 .89 0 .8.09 5.22.14 11.35-6.14 2.98-3.04 4.5-5.71 7.4-10.75 5.3-9.32 4.87-12.44 9.6-16.23.97-.77 4.19-4.07 4.87-4.59 2.24-1.66 5.68-4.04 6.28-6.28.89-3.33 2.21-5.1 2.75-7.71.92-4.44 2.32-7.45.37-11.67.17-1.75-.17-4.5.49-5.73.95-1.29 2.29-2.09 4.5-1.81l-.03-.06z\"/><path class=\"dp-kvm-cls-1\" d=\"M190.63 431.25h38.62v-16.63c0-.32.86-1.49.95-2.67.34-4.47.32-9.06.86-13.5.14-1.23.63-2.87 1.78-1.35l-.89 34.12h71.85v.89c-37.21 1.23-75.69 1.78-113.16.89v-1.81.06z\"/><path d=\"M259.93 339.14s2.24-1.72 2.58-2.18l11.32-7.05c.77 5.42 8.51 21.79 10.89 28.38 1.69 4.67 2.75 13.16 4.3 16.37.86 1.81 5.3 6.19 7.05 9.12 8.31 14.11 10.35 31.57 7.74 47.51h-71.85l.89-34.12c-1.15-1.52-1.63.11-1.78 1.35-.57 4.44-.52 9.06-.86 13.5-.09 1.15-.95 2.35-.95 2.67v16.63h-38.62c-.06-4.44.75-8.23.89-12.56 1.38-1.69 10.24 10.92 13.07 1.83 1.46-4.76-.09-9.58-2.78-13.45-1.58-2.24-5.07-3.73-4.9-6.71.11-2.15 7.86-16.63 9.89-17.6.77-.37 2.67.06 3.99-.95 1.52-1.15 1.15-2.98 1.61-3.35.75-.63 3.44.2 4.3-1.55 1.32-2.41-4.44-1.52-4.79-1.61-1.35-.37-2.04-1.89-3.27-2.41.75-3.33.69-4.7 2.24-8.11 4.73-10.46 14.97-17.86 12.16-31.42 3.73 4.07 9.49 12.5 14.85 13.42 8.31 1.4 15.6-2.95 22.08-7.65l-.06-.06zm24.91 27.58c-2.61-1.46-3.47 2.35-4.82 3.47-6.14 4.93-13.68 2.69-20.67 3.58-1.23.17-2.78.6-1.35 1.81 9.4.97 20.33 3.61 28.13 9.15 2.49 1.78 10.72 12.61 10.52 4.9 0-.54-1.35-.54-1.46-.86-2.35-5.73-5.93-9.03-7.45-12.79-.83-2.06-1.46-8.43-2.9-9.23v-.03zm-75.34-16.29c-6.54 9.35-11.15 19.47-15.28 30.05l-29.39 13.79c-6.36-.63-12.18-8.26-11.01-14.65 1.03-5.53 26.75-20.5 32.63-23.08 7.2-3.18 15.17-5.71 23.05-6.14v.03z\" fill=\"#fafbf9\"/><path d=\"M232.86 312.7c-.63 1.26-2.44 3.9-2.47 4.13-.57 2.72 2.49 6.62 2.58 8.92.06 1.63-1.69 1.15-1.89 1.92-2.61 11.04 6.57 9.26 14.36 7.48l.89-.89c.72-.17 1.78-.63 2.69-.89h.89c.26-.09.63.09.89 0 2.58-.83 5.22-1.58 7.2-3.58 2.49-.52 5.62-5.13 7.14-5.76 1.23-.52 6.82 1.23 6.31-2.32.95 1.43 2.44 3.13 2.69 5.39.09.89-.06 1.81 0 2.69l-11.67 7.2c-.34.43-4.82 4.27-5.1 4.5-6.51 4.73-11.21 6.74-19.52 5.33-5.36-.92-11.12-9.35-14.85-13.42s-6.16-3.13-3.15-9.89c.29-.63 2.9-5.19 3.15-5.39.23-.17 2.18-.06 3.35-1 2.18-1.78 2.15-1.29 6.54-4.39l-.03-.03z\" fill=\"#cb9c2c\"/><path class=\"dp-kvm-cls-2\" d=\"M271.48 317.21c-.8-.29-2.81.17-4.47-.43-4.9-1.83-10.72-5.53-15.28-6.74-3.61-5.16-4.04-12.84.89-17.06-.6 18.64 20.67 11.84 12.59-3.58 10.84 2.95 12.18 19.38 6.28 27.84v-.03z\"/><path class=\"dp-kvm-cls-5\" d=\"M238.25 310.01s.63.83 1.32.77c1.63-.09 3.24-1.12 4.96-.77-2.12 4.42.92 4.67.95 4.99.17 1.86-3.73 14.68-2.72 15.65 2.41.75 9.23-2.21 8.08 2.69-.26.09-.63-.09-.89 0-.03 0 .14-.29-.89 0-.92.26-1.98.75-2.69.89-.37.09-.72.86-.89.89-7.77 1.78-16.97 3.56-14.36-7.48.17-.77 1.95-.29 1.89-1.92-.09-2.29-3.15-6.16-2.58-8.92.06-.23 1.86-2.87 2.47-4.13.29-.6-.77-2.35 1.81-1.81.09 0 2.09-.66 2.69-.89.17-.09.6 0 .89 0l-.03.03z\"/><path class=\"dp-kvm-cls-2\" d=\"M236.45 309.12c-.4.63-1.29 1.18-1.81 1.81-.83.43-1.49 1.2-1.81 1.81-3.93 2.78-3.56 2.18-5.73 3.96-1.18.95-3.9 1.26-4.16 1.43-4.82-5.82-4.19-14.56-3.58-21.56a14.01 14.01 0 003.61 6.68c3.01 1.81 4.79 1.15 5.13.97 3.01-1.35 3.35-7.08 2.01-11.27-.2-.6-.66-1.18-.89-1.81 6.82.57 10.55 12.7 7.2 17.95l.03.03z\"/><path class=\"dp-kvm-cls-7\" d=\"M251.73 310.01c4.56 1.2 10.38 4.93 15.28 6.74 1.66.63 3.7.14 4.47.43 2.09.77 4.85 7.45 2.69 9.89-.26-2.26-1.75-3.93-2.69-5.39-.2-.32.37-1.86-1.12-2.06l-19.55-6.02c-.29 2.32 2.44 2.69 2.72 4.96.26 2.04-2.44 1.55-2.75 2.69-.4 1.52 2.32 2.41 2.58 3.73.34 1.83-4.07 4.76.6 5.73 2.72.57 2.12-1.89 2.78-1.89.54 0 1.12.97 1.26.95-1.95 2.04-4.62 2.75-7.2 3.58 1.15-4.9-5.68-1.95-8.08-2.69-1-.97 2.9-13.79 2.72-15.65 0-.32-3.07-.57-.95-4.99-1.75-.34-3.33.69-4.96.77-.69.03-1.18-.77-1.32-.77 3.7-1.83 9.52-1.06 13.47 0h.03z\"/><path class=\"dp-kvm-cls-2\" d=\"M208.61 372.88c1.26.52 1.95 2.04 3.27 2.41.34.09 6.11-.8 4.79 1.61-.86 1.75-3.56.92-4.3 1.55-.46.37-.09 2.21-1.61 3.35-1.32 1-3.21.57-3.99.95.4-3.35 1.06-6.59 1.81-9.89l.03.03z\"/><path class=\"dp-kvm-cls-1\" d=\"M284.84 366.72c1.43.8 2.06 7.17 2.9 9.23 1.52 3.76 5.1 7.05 7.45 12.79.14.32 1.46.34 1.46.86.2 7.71-8.03-3.13-10.52-4.9-7.83-5.53-18.72-8.17-28.13-9.15-1.43-1.18.11-1.63 1.35-1.81 7-.89 14.51 1.35 20.67-3.58 1.38-1.09 2.21-4.93 4.82-3.47v.03z\"/><path class=\"dp-kvm-cls-5\" d=\"M258.01 329.79s-.69-.95-1.26-.95c-.66 0-.06 2.47-2.78 1.89-4.67-.97-.26-3.9-.6-5.73-.26-1.32-2.98-2.21-2.58-3.73.29-1.12 3.01-.63 2.75-2.69-.29-2.24-3.01-2.64-2.72-4.96l19.55 6.02c1.49.2.92 1.75 1.12 2.06.52 3.56-5.1 1.81-6.31 2.32-1.55.63-4.64 5.25-7.14 5.76h-.03z\"/><path class=\"dp-kvm-cls-7\" d=\"M249.92 333.38h-.89c1.03-.29.86 0 .89 0zm-4.5 1.77c.2-.06.54-.83.89-.89l-.89.89z\"/></g></svg>","mysql":"<svg viewBox=\"0 0 512 512\"><path d=\"M130.57 443.71h-20q-1.06-50.59-5.84-95.2h-.18l-30.43 95.2H59l-30.26-95.2h-.22q-3.37 42.81-4.24 95.2H6Q7.76 380 14.84 324.3h24.78l28.84 87.77h.18l29-87.77h23.71q7.81 65.28 9.22 119.41zm86.7-88.12q-12.2 66.26-32.21 96.31-15.57 23.1-34.14 23.1c-3.31 0-7.38-1-12.22-3v-10.6a57.94 57.94 0 008.32.54c5.79 0 10.43-1.59 14-4.79q6.36-5.83 6.36-13.08 0-5-5-20.36l-21.94-68.13h19.65l15.74 51q5.32 17.35 4.43 24.29a333.71 333.71 0 0018.05-75.21h18.93z\" fill=\"#7aa2ba\"/><path d=\"M483.4 443.71h-56.78V324.3h19.09V429h37.69zm-71.65 2.89l-22-10.83a40.09 40.09 0 005.48-5.34q14-16.44 14-48.65 0-59.26-46.55-59.29-22.83 0-35.58 15.05-14 16.45-14 48.48 0 31.5 12.39 46.18 11.32 13.26 34.16 13.28a55.06 55.06 0 0015.68-2.1L404 460zm-71.15-26.79q-7.25-11.67-7.25-37.49 0-45.12 27.43-45.14 14.36 0 21.05 10.79 7.25 11.68 7.26 37.16 0 45.48-27.43 45.54-14.34 0-21.06-10.81zm-35.75-9.15q0 15.18-11.13 24.95t-29.9 9.73q-17.5 0-34-11.13L235 424q14.18 7.08 25.65 7.09c7.2 0 12.82-1.6 16.91-4.77A16.23 16.23 0 00284 413c0-7.08-4.94-13.15-14-18.21-8.37-4.6-25.11-14.17-25.11-14.17-9.11-6.62-13.62-13.71-13.62-25.41q0-14.52 10.17-23.45t26.31-8.95a54.47 54.47 0 0130.25 8.88l-4.59 10.1a58.37 58.37 0 00-23-5c-6.12 0-10.86 1.47-14.16 4.42a14.79 14.79 0 00-5.36 11.33c0 7.09 5.06 13.21 14.38 18.39 8.48 4.61 25.65 14.38 25.65 14.38 9.31 6.61 13.95 13.65 13.95 25.25\" fill=\"#f8981d\"/><path d=\"M481.45 273c-16.91-.43-30 1.28-41 5.93-3.18 1.26-8.22 1.26-8.66 5.28 1.72 1.71 1.91 4.45 3.4 6.78a48.68 48.68 0 0011 12.88c4.44 3.39 8.89 6.76 13.53 9.72 8.23 5.09 17.55 8.05 25.56 13.13 4.67 3 9.31 6.75 14 9.93 2.3 1.69 3.77 4.45 6.75 5.5v-.65c-1.48-1.9-1.91-4.66-3.38-6.77l-6.36-6.12a100.9 100.9 0 00-22-21.35c-6.84-4.66-21.59-11-24.33-18.79l-.43-.43a84 84 0 0014.59-3.43c7.21-1.9 13.76-1.48 21.14-3.36 3.4-.85 6.76-1.92 10.17-3v-1.91c-3.82-3.81-6.55-8.9-10.59-12.47a279.82 279.82 0 00-34.88-26c-6.57-4.24-15-7-22-10.58-2.52-1.27-6.76-1.89-8.24-4-3.8-4.66-5.93-10.78-8.68-16.31-6.1-11.62-12.05-24.52-17.33-36.81-3.81-8.24-6.12-16.47-10.77-24.09-21.8-35.94-45.46-57.7-81.83-79.06-7.82-4.45-17.12-6.35-27.05-8.69l-15.86-.82c-3.38-1.48-6.78-5.51-9.73-7.41-12.07-7.61-43.13-24.09-52-2.33-5.73 13.76 8.45 27.3 13.34 34.26 3.59 4.85 8.24 10.38 10.76 15.87 1.48 3.6 1.9 7.41 3.39 11.2 3.39 9.32 6.54 19.66 11 28.34a99 99 0 007.81 13.09c1.69 2.34 4.65 3.38 5.29 7.2-3 4.21-3.17 10.56-4.88 15.85-7.6 23.88-4.62 53.49 6.15 71 3.37 5.28 11.42 16.92 22.24 12.46 9.54-3.8 7.42-15.85 10.17-26.42.63-2.55.21-4.23 1.49-5.93v.41c3 5.93 5.93 11.61 8.66 17.56 6.55 10.37 18 21.12 27.48 28.3 5.07 3.82 9.09 10.37 15.43 12.7v-.64h-.43c-1.27-1.89-3.16-2.74-4.85-4.21a103.84 103.84 0 01-11-12.69 274.4 274.4 0 01-23.72-38.54c-3.4-6.57-6.34-13.75-9.08-20.3-1.28-2.53-1.28-6.34-3.41-7.62-3.18 4.66-7.82 8.67-10.13 14.37-4 9.1-4.45 20.31-5.93 32l-.83.4c-6.73-1.69-9.07-8.66-11.64-14.57-6.33-15-7.41-39.13-1.89-56.46 1.48-4.44 7.84-18.39 5.29-22.61-1.28-4-5.5-6.36-7.83-9.54a86.82 86.82 0 01-7.62-13.52c-5.07-11.86-7.62-25-13.08-36.78-2.55-5.52-7-11.21-10.57-16.31-4-5.71-8.46-9.73-11.65-16.49-1.05-2.33-2.53-6.12-.83-8.66a3.31 3.31 0 011-1.88 3.36 3.36 0 012-.87c2.74-2.32 10.57.62 13.34 1.89a107.87 107.87 0 0120.93 10.57c3 2.12 6.14 6.14 9.93 7.21h4.45c6.76 1.48 14.37.4 20.76 2.31a136.24 136.24 0 0130.45 14.59 187.5 187.5 0 0165.94 72.32c2.54 4.85 3.6 9.29 5.93 14.36 4.45 10.38 10 20.94 14.38 31.14 4.45 9.93 8.68 20.07 15 28.33 3.17 4.45 15.88 6.76 21.57 9.09 4.22 1.89 10.79 3.57 14.59 5.92 7.19 4.45 14.37 9.52 21.13 14.4 3.36 2.53 13.94 7.83 14.57 12.05zM265.83 89.27a32.88 32.88 0 00-8.66 1.07v.42h.42c1.7 3.38 4.65 5.72 6.77 8.67 1.71 3.39 3.18 6.76 4.85 10.14l.42-.42c3-2.12 4.45-5.5 4.45-10.57-1.3-1.48-1.49-3-2.55-4.44-1.25-2.12-4-3.18-5.71-4.87\" fill=\"#7aa2ba\"/></svg>","oracle-cloud":"<svg viewBox=\"0 0 512 512\"><path d=\"M376.91 393.3h-9.89v64.71c.35.11.71.2 1.08.24 14.58.04 29.16.04 43.74 0 .37.02.75-.05 1.1-.18.35-.14.67-.34.94-.61 1.95-3.02 3.74-6.16 5.95-9.9h-42.92V393.3zM61.86 304.76c29.33 27.54 68.93 42.5 109.87 41.48h176.42c39.56-.99 77.15-16.84 104.77-44.16C480.54 274.76 496 238.11 496 199.95c0-38.15-15.46-74.79-43.08-102.12-27.62-27.33-65.21-43.17-104.77-44.16H171.73c-40.94-1.02-80.54 13.94-109.87 41.48C32.55 122.7 16 160.5 16 199.95c0 39.48 16.54 77.28 45.86 104.81zm46.32-170.61c17.74-17.67 41.92-28 67.43-28.79h158.94c26.6-.83 52.42 8.78 71.53 26.63 19.11 17.86 29.91 42.41 29.91 68.06 0 25.65-10.8 50.22-29.91 68.06-19.11 17.84-44.93 27.44-71.53 26.63H175.61c-25.51-.8-49.69-11.12-67.43-28.79-17.75-17.68-27.68-41.3-27.68-65.9 0-24.6 9.92-48.23 27.68-65.9zm204.83 269.69c12.39 0 24.85 0 37.28.07 1.08 0 2.68-.17 3.15-.87 2-2.97 3.68-6.17 5.6-9.52-.88-.11-1.26-.19-1.63-.2-15.67 0-31.35-.16-47.02 0-8.15.09-14.83 3.6-19.89 10.04-9.78 12.39-9.7 32.9.19 45.22 4.74 5.87 10.93 9.51 18.53 9.66 13.57.22 27.18 0 40.77 0 .42.01.84-.05 1.23-.21.39-.16.74-.4 1.04-.7 1.94-2.94 3.7-5.99 5.91-9.65l-4.31.03c-13.89 0-27.79.07-41.68 0-8.58-.05-14.35-4.25-17.17-12.36a29.033 29.033 0 01-.69-16.89c2.48-9.79 8.64-14.63 18.69-14.63zm134.14 43.64c-8.55-.13-16.11-8.04-15.94-16.62h49.01c1.04 0 2.61.04 3.04-.56 2.13-3.08 3.96-6.35 6.31-10.22h-58.54c-.04-.5-.04-1.01 0-1.51 1.74-8.97 8.59-14.79 17.66-14.79 12.82-.09 25.63-.02 38.45-.09 1.06 0 2.61-.22 3.1-.91 1.97-2.92 3.61-6.05 5.75-9.66H448c-9.74.1-17.3 4.4-22.43 12.6-6.06 9.8-6.83 20.4-3.84 31.35 3.06 11.17 12.41 21.68 28.07 21.23 12.01-.34 24.06-.11 36.08-.11.94 0 2.39.08 2.78-.47 2.14-3.08 4.04-6.34 6.37-10.1h-5.88c-14-.02-28.06.09-42-.13zm-194.61-49.71c-3.7-6.25-8.93-6.2-12.63.09-11.23 19.13-22.45 38.27-33.66 57.39-.49.81-.87 1.68-1.57 3.06 3.5 0 6.52.2 9.49-.09.67-.09 1.32-.32 1.91-.66.59-.35 1.1-.81 1.51-1.35 2.85-4.48 5.56-9.08 8.07-13.76a4.872 4.872 0 015.15-2.88c5.93.18 11.82.11 17.73.04.9 0 2.22-.22 2.61-.82 1.96-3 3.71-6.17 5.85-9.89h-23.39c4.38-7.38 8.42-14.1 12.71-21.33.93 1.52 1.48 2.43 2.01 3.35 8.79 14.96 17.62 29.9 26.5 44.82.59.99 1.64 2.31 2.56 2.39 3.35.29 6.78.13 10.72.13-.64-1.23-.91-1.85-1.25-2.45-11.44-19.38-22.9-38.72-34.34-58.03zm-155.91-4.66H56.08c-11.24 0-19.32 5.36-24.37 15.28-4.5 8.86-4.99 18.32-2.53 27.91 3.08 11.97 12.69 22.67 28.66 21.98 6.3-.24 12.61 0 18.92 0l.05-.03c7.4 0 14.8.09 22.19 0 3.96.05 7.88-.86 11.41-2.66 3.53-1.8 6.56-4.45 8.84-7.69 7.87-10.89 8.95-22.98 4.72-35.46-4.33-12.87-13.83-19.31-27.34-19.31zm17.26 44.45c-3.15 6.52-8.28 10.1-15.69 10.11H76.89c-6.5 0-13.03.02-19.53-.03-10.27-.02-16.38-4.86-18.85-14.82a27.973 27.973 0 011.47-18.5c3.02-6.86 8.35-10.47 15.97-10.51h40.53c10.59 0 17.03 5.13 19.17 15.51 1.3 6.25 1.04 12.42-1.77 18.23zm62.7-5.84c2.03.11 4.06.11 6.09 0 2.35-.19 4.68-.71 6.9-1.52 7.98-3.22 12.59-12.58 10.86-21.46-1.83-9.38-8.86-15.63-18.06-15.63h-48.52c-.46.03-.93.11-1.38.22v64.71h10.82V404.1c.48-.13.96-.22 1.45-.27 12.71-.02 25.45-.11 38.17.08 1.94.16 3.78.97 5.21 2.3a8.122 8.122 0 012.59 4.4c.37 1.71.19 3.5-.53 5.09a7.9 7.9 0 01-2.99 4.1c-1.42 1-3.14 1.5-4.88 1.42H155.1c-1.01 0-2.02.11-3.38.18.28.49.59.96.93 1.41 10.98 11.45 22 22.87 33.05 34.29.51.58 1.2.96 1.97 1.07 4.18.05 8.38.06 13.44.06l-24.81-25.7.3-.8z\" fill=\"#ed1c24\"/></svg>","office-365":"<svg viewBox=\"0 0 512 512\"><path d=\"M317.38 6L48.49 105.36v304L142 368.43V128.76l175.38-40.92V441.7L48.49 409.34 317.38 506l146.13-44.06V52.74z\" fill=\"#eb3c00\"/></svg>","openshift-kubernetes":"<svg viewBox=\"0 0 512 512\" fill=\"none\"><path d=\"M496.001 148.466c-5.372-11.095-11.588-21.802-18.8-31.901l-77.054 28.043c8.96 9.171 16.49 19.48 22.647 30.504l73.207-26.646zM155.39 233.691l-77.077 28.042c.985 12.361 3.12 24.57 6.11 36.533l73.219-26.658c-2.382-12.385-3.226-25.145-2.252-37.917z\" fill=\"#C22133\"/><path d=\"M326.442 126.636c16.032 7.483 29.919 17.686 41.635 29.649l77.054-28.042c-21.345-29.953-50.42-54.981-86.038-71.6C248.931 5.273 117.505 53.1 66.148 163.25c-16.63 35.643-22.811 73.501-19.903 110.163l77.066-28.042c1.278-16.701 5.348-33.437 12.819-49.481 33.379-71.565 118.747-102.62 190.312-69.255zm82.187 140.814c-1.231 16.689-5.442 33.425-12.935 49.481-33.367 71.577-118.748 102.633-190.301 69.267-16.056-7.495-30.047-17.616-41.717-29.602l-76.901 27.983c21.298 29.954 50.337 54.993 85.978 71.623 110.163 51.358 241.565 3.531 292.934-106.632 16.642-35.618 22.776-73.476 19.844-110.104l-76.902 27.984z\" fill=\"#DB212E\"/><path d=\"M427.578 173.371l-73.219 26.646c13.605 24.371 20.032 52.425 17.921 80.643l76.9-27.971a222.017 222.017 0 00-21.602-79.318zM89.219 296.507L16 323.177a222.91 222.91 0 0034.434 74.638l76.889-27.995c-19.738-20.266-32.862-45.916-38.104-73.313z\" fill=\"#EB2126\"/><path d=\"M484.838 128.165c-2.427-3.941-4.949-7.823-7.634-11.6l-77.054 28.043c3.389 3.471 6.508 7.154 9.487 10.93l75.201-27.373zM155.093 249.166a136.5 136.5 0 01.293-15.47l-77.077 28.042c.398 4.937 1.02 9.84 1.759 14.731l75.025-27.303z\" fill=\"#AD213B\"/><path d=\"M485.526 239.467l-76.902 27.983c-.809 11.071-2.966 22.166-6.497 33.073l83.704-30.516a220.926 220.926 0 00-.305-30.54zM86.781 384.591a218.434 218.434 0 0019.598 23.797l83.716-30.529c-9.782-6.122-18.625-13.264-26.424-21.263l-76.89 27.995z\" fill=\"#BA2133\"/></svg>","oracle-database":"<svg viewBox=\"0 0 512 512\"><path d=\"M203.06 68.54a37 37 0 003.79-.17 5.89 5.89 0 002.17-.75A5.73 5.73 0 00210.8 66c2.84-4.44 5.29-8.63 7.55-12.87a3.32 3.32 0 011.43-1.58 3.25 3.25 0 012.23-.39c5.49.18 11 .12 16.41.06.78 0 2.63-.16 3.35-1.29 1.43-2.19 2.72-4.42 4.19-7l1.14-2q7.26 12.3 14.57 24.6c.74 1.19 1.91 2.63 3.26 2.75s2.95.15 4.48.15h7.4l-1.4-2.75c-.27-.5-.42-.86-.65-1.23q-15.83-26.85-31.68-53.58C241.22 7.73 238.8 6 236.28 6c-2.53 0-5 1.77-6.84 4.95q-15.54 26.48-31 53a18.05 18.05 0 00-1 1.9l-1.34 2.68h1.87c1.77-.07 3.45.02 5.09.01zm28.34-37.47c1.64-2.77 3.29-5.53 5-8.34.33.53.59 1 .86 1.44L246 39h-19.35c1.61-2.69 3.19-5.32 4.75-7.93zm72.5 37.33q6.28.09 12.58.09c8.51 0 16.83-.09 25-.09a7.86 7.86 0 001.62-.28 4.26 4.26 0 001.49-1.06c1.37-2.09 2.63-4.2 4.07-6.64l2.45-4.08-18.83.06q-12.76.06-25.63 0c-7.36 0-12.33-3.62-14.76-10.64a25.4 25.4 0 01-.59-14.92c2.14-8.49 7.41-12.63 16.11-12.63 11.43 0 22.93 0 34.41.06 1.35 0 3.1-.22 3.82-1.29 1.42-2.07 2.61-4.22 3.9-6.49l2.2-3.92-2.47-.28a6.88 6.88 0 00-.9-.08H333.9c-9.5 0-19.31-.07-28.94 0-7.76.08-14.24 3.34-19.24 9.69-9.43 12-9.34 31.31.18 43.17 4.93 6.04 10.98 9.18 18 9.33zM135.84 18.23h6.49c9.45 0 19.27-.05 28.83.09a6.81 6.81 0 014.14 1.84 6.21 6.21 0 012 3.44 6.55 6.55 0 01-.46 4.1 6.05 6.05 0 01-2.33 3.19 6.67 6.67 0 01-3.84 1.1h-25.08c-.62 0-1.24 0-2 .09l-3.1.18.93 1.62a12.45 12.45 0 001 1.53Q157.68 51.2 173 67a4.21 4.21 0 002.67 1.38c3.87.06 7.74.06 12.43.06h2.71L167.2 44c1.27 0 2.65 0 3.94-.07a25.41 25.41 0 006.7-1.48c7.84-3.16 12.45-12.23 10.73-21.09C186.75 12 179.76 6 170.76 6H125.9a9.38 9.38 0 00-1.46.22l-.88.21v61.8h12.28zm229.63 50.16h40.32a8.23 8.23 0 001.46-.24 3.3 3.3 0 001.42-1c1.42-2.22 2.77-4.49 4.27-7.06l2.3-3.86h-40.48V6.16h-11.43v61.69l.79.25a5.56 5.56 0 001.35.29zm44.45 170.87c-34.22 11-72.05 17.4-119 20.05a623.67 623.67 0 01-76.85-.45c-29.14-1.95-54.79-5.44-78.43-10.66-17.83-3.95-41.1-9.88-62.87-20.85-8.24-4.16-17-9-24.49-15.63.07 14.58.1 29.16-.22 43.73-.17 7.95 2.27 14 7.67 19.16a93 93 0 0014.82 11.54c16.73 10.41 35.19 16.2 51.05 20.47 33.56 9.05 70.29 14.16 112.27 15.57 50.32 1.69 95.52-1.91 138.37-11.13 25.69-5.49 45.61-12.18 62.71-21.07 10.31-5.33 17.3-10.48 22.73-16.69 4.29-4.95 6.32-9.53 6.32-14.39V211.6a93 93 0 01-7.81 6c-12.43 8.67-26.69 15.4-46.27 21.66zm-340 138.42c13.42 8.1 28.58 14.27 49.24 20 25.69 7.15 53.58 11.88 85.25 14.47 56.26 4.52 108.09 2.11 158.47-7.43 26.8-5.06 48-11.54 66.78-20.39 9.28-4.38 19.83-10.08 27.88-19.24a24.08 24.08 0 006.46-16.86c-.14-15-.12-29.84-.09-44.71A95.64 95.64 0 01448 314.43 192.58 192.58 0 01423.6 326c-26.19 10.31-55.17 17-94 21.74a612.2 612.2 0 01-80.35 4.14c-44.32-.43-83.84-4.91-120.81-13.64-26-6.12-45.11-13-61.94-22.45a105.65 105.65 0 01-18.34-12.45c.05 14.67.08 29.32-.18 44a24.91 24.91 0 006.2 17.55 64.13 64.13 0 0015.73 12.79zm387.44 22.53C441.63 411.53 424.3 418 411 422.35c-33.06 10.8-69.38 17.17-114.31 20a645.44 645.44 0 01-80.14 0c-35.77-2.19-67.38-7-96.64-14.63-16.68-4.37-38.38-11-58.28-23.2a93.07 93.07 0 01-13.36-9.61c0 14.74.08 29.46-.17 44.2-.11 7.33 2.06 13.05 6.85 18a74 74 0 0010.42 9c15 10.56 32 16.57 46.66 21 28.46 8.71 60.45 14.29 97.77 17.06a628.43 628.43 0 0090.19.16c28.58-2 53.76-5.63 77-11s41.31-11.57 56.86-19.47c10.51-5.35 17.67-10.48 23.27-16.63a25 25 0 007-17.93c-.18-14.87-.16-29.66-.11-44.46-2.29 2.1-4.54 3.84-6.66 5.37zM64.82 68.42h6.86c4.59 0 9.12.06 13.65 0h.28a23.74 23.74 0 0010.78-2.6 23.41 23.41 0 008.61-7.46c7.2-10 8.73-21.32 4.53-33.76C105.37 12.42 96.27 6 83.15 6H45.74c-10.62 0-18.53 5-23.52 14.74-4.07 8-4.89 17-2.41 26.54C22.46 57.64 30.72 68.45 46 68.45h1.44c1.92-.07 3.86-.09 5.79-.09 3.86-.04 7.77.04 11.59.06zM46.92 56.3c-8.94 0-14.12-4.08-16.29-12.81A24.65 24.65 0 0132 27.19c2.61-6 7.21-9 13.67-9H83c9.29 0 14.7 4.39 16.57 13.41 1.26 6.07.75 11.33-1.56 16.1-2.81 5.83-7.21 8.68-13.43 8.68H62.37c-5.23-.07-10.3-.04-15.45-.08zm18.54 136.82c14.75 10.59 31.86 16.57 46.66 21 35.15 10.61 73.67 16.4 121.24 18.23a625.63 625.63 0 0079.15-2.15c33.82-3 63.05-8.49 89.38-16.66 17.3-5.39 30.6-11.24 41.87-18.43 8.42-5.35 13.73-10.33 17.24-16.16 3.91-6.57 4-12.6.31-18.95a40.61 40.61 0 00-5.94-7.65c-7.31-7.53-16.6-12.54-23.87-16.07-17-8.24-36.45-14.53-61.36-19.79-34.29-7.24-70.39-10.74-113.53-11-44.91 0-84.57 4.09-121.26 12.48-18.1 4.13-41.61 10.43-63 22.65-8.95 5.14-14.93 10-19.39 15.79-6.58 8.61-6.68 16.69-.29 24.71a64.55 64.55 0 0012.79 12zM473.72 56.29c-9 0-18.16 0-27.2-.11a13.68 13.68 0 01-9.52-4.37 14.17 14.17 0 01-4-8.68h44.19c1.15-.1 2.84 0 3.6-1 1.49-2.15 2.79-4.36 4.32-6.9l2.61-4.34h-54.97c1.55-7.84 7.35-12.72 15.18-12.72 11.8-.07 23.63 0 35.47-.08.85 0 3-.12 3.82-1.36 1.24-1.8 2.32-3.69 3.45-5.7.6-1 1.21-2.13 1.89-3.27l1-1.73h-46.3c-9.36.09-16.65 4.19-21.67 12.16C420.17 27 418.93 37 421.94 48c2.71 10 11 20.45 26.08 20.45h1c4.7-.12 9.45-.17 14.15-.17 6.48 0 12.56.08 19.4.08 1.12 0 2.54 0 3.22-.93 1.53-2.19 2.94-4.5 4.43-7l2.57-4.16h-7.5c-3.92 0-7.72.02-11.57.02z\" fill=\"#f10000\"/></svg>","proxmox-ve-cluster":"<svg viewBox=\"0 0 512 512\" fill=\"none\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M145.281 48.094c-9.844 0-18.468 1.78-26.718 5.338-8.063 3.56-15.188 8.336-21.47 14.61l159.377 174.58 159-174.672c-6.281-6.275-13.406-11.051-21.938-14.61-7.781-3.56-16.875-5.339-26.25-5.339-9.843 0-19.218 2.06-27.562 5.807-8.625 3.746-15.656 9.366-22.219 15.922l-61.125 67.621L194.5 69.729c-6.281-6.556-13.406-12.082-22.219-15.922-7.781-3.747-17.156-5.713-27-5.713zm111.094 220.939L97 443.892c6.281 6.088 13.406 11.052 21.469 14.611 8.344 3.559 16.969 5.339 26.25 5.339 10.312 0 19.219-2.248 27.562-5.807 8.813-4.028 16.406-9.366 22.688-15.922l61.406-67.621 61.313 67.621c6.281 6.556 13.406 11.894 21.937 15.922 8.344 3.559 17.438 5.807 27.563 5.807 9.375 0 18.468-1.78 26.25-5.339 8.625-3.559 15.656-8.616 21.937-14.611l-159-174.859z\" fill=\"#000\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M68.5 100.543c-10.125.281-19.969 2.248-28.781 6.088-9.094 3.746-16.875 9.085-23.719 15.641l121.688 133.65L16 389.384c6.844 6.837 14.625 12.082 23.719 16.109 8.812 4.028 18.656 5.807 28.781 6.276 10.875-.469 21-2.248 30.281-6.838 9.375-4.308 17.438-10.115 24.188-17.42l120-131.589-119.907-131.403c-7.312-7.024-15.187-12.831-24.468-17.42-9.375-4.308-19.219-6.275-30.094-6.556zm374.719 0c-10.875.281-20.438 2.248-29.813 6.556-9.375 4.496-17.437 10.302-24.469 17.42L269.5 255.922l119.437 131.683c7.032 7.305 15.188 13.112 24.469 17.42 9.375 4.496 18.938 6.275 29.813 6.837 10.875-.468 20.156-2.248 29.062-6.275 9.563-4.027 16.875-9.366 23.719-16.109L374.594 255.922 496 122.272c-6.844-6.556-14.156-11.895-23.719-15.641-8.812-3.84-18.187-5.807-29.062-6.088z\" fill=\"#E57000\"/></svg>","mssql":"<svg viewBox=\"0 0 512 512\"><defs><radialGradient id=\"dp-mssql-a\" cx=\"-153.77\" cy=\"806.53\" r=\"41.21\" gradientTransform=\"matrix(-.87 -.16 -.33 1.8 179.35 -906.25)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#ee352c\"/><stop offset=\"1\" stop-color=\"#a91d22\"/></radialGradient></defs><path d=\"M316 239.45l-100.14 32.71-87.11 38.43-24.37 6.41c-6.21 5.93-12.71 11.9-19.76 18-7.72 6.66-14.91 12.72-20.44 17.11a152.37 152.37 0 00-19.83 19.68c-6.89 8.62-12.4 17.71-14.68 24.79-4.16 12.72-2.11 25.59 5.91 37.47 10.29 15.12 30.8 30.57 54.72 41.09a347 347 0 0048.14 16.13c25.66 6.5 75.29 13.54 102.62 14.59a117.14 117.14 0 0013.25 0c.6-.37 4.83-8.46 9.75-18.54 16.81-34.32 28.94-66.49 35.51-93.91 3.93-16.64 7.08-38.81 9.09-65.08.51-7.35.74-31.87.3-40.27a282.4 282.4 0 00-3.8-35.41 8.75 8.75 0 01-.23-3.1c.3-.23 1.21-.53 13.55-4.09l-2.49-5.9zm-22.85 13.41c.91 0 3.33 23.23 3.93 37.91a20.25 20.25 0 01-.09 5.16c-.6 0-12.78-7.19-21.48-12.65-7.58-4.76-22-14.31-24.22-16.11-.76-.53-.67-.6 5.52-2.73 10.51-3.56 35.5-11.58 36.33-11.58zm-51 16.8c.68 0 2.43 1 6.59 3.55 15.58 9.75 36.78 21.57 45.87 25.5 2.8 1.2 3.1.76-3.33 5.15a332.11 332.11 0 01-52 28c-3.71 1.66-6.87 2.94-6.87 2.94a18.5 18.5 0 01.9-4.16 223.2 223.2 0 008.09-53.13c-.04-7.6-.04-7.62.72-7.85zm-10.52 4c.44.46.14 17.41-.46 22a191.84 191.84 0 01-7 32.92 50.07 50.07 0 01-1.77 5.31c-.3.39-10.62-9.76-14.08-13.69a103.11 103.11 0 01-13.89-20.2 63.86 63.86 0 01-4.23-10.28c1.2-.84 41.1-16.28 41.4-15.94zM182 293.15h.23a14.33 14.33 0 011.13 2.72 101 101 0 0012.56 22.48 127.82 127.82 0 0017.48 18.84c1.77 1.52 3.54 2.95 3.71 3.18s.61.38-11.73 5.07c-14.3 5.46-29.9 10.91-47.82 16.65l-12.8 4.16c-.68.23-.45-.14 1.52-3.24 8.85-13.87 22.33-41 29.89-60.21 1.3-3.33 2.57-6.66 2.8-7.42a2.78 2.78 0 01.59-1.19 2.71 2.71 0 011.08-.78 7.11 7.11 0 011.29-.3zm-15 6.25a167.3 167.3 0 01-7.42 15.67c-7.33 14.31-15.36 28.33-26.1 45.49-1.77 2.94-3.54 5.67-3.79 6s-.53.39-1.77-2a68.59 68.59 0 01-5.81-17.56 70.34 70.34 0 01.37-22.57c1-4.69.91-4.62 3.17-5.75 9.7-4.9 41.07-19.58 41.35-19.28zm130.55 5.31v3.17a412.46 412.46 0 01-4.46 56.92c-.45 2.95-.84 5.31-.91 5.45a38.41 38.41 0 01-4.76-1.36 195.27 195.27 0 01-34.8-14.89c-7.35-4-18-10.62-17.71-10.9s3.25-1.77 7-3.71a443.38 443.38 0 0041.41-24.29c4.6-3.1 11.56-8.09 13.09-9.46zm-187.71 22.4c.3 0 .23.6-.24 3.33-.3 2-.67 5.6-.83 8.09-.6 11.06 1.23 19.22 6.68 30.43 1 1.87 1.85 3.79 2.64 5.75-.54.44-50.63 15.14-66.37 19.48l-9.09 2.5c-.53.16-.6 0-.37-1.21 1.77-11.12 10.22-25.66 22-37.91a98 98 0 0124.84-19.11c7.72-4.39 19.61-11 20.52-11.28h.15zm118.06 21.11a29.29 29.29 0 014.09 2.2A228.14 228.14 0 00290 373l1.77.39-2.43 1.36c-10.06 5.6-43.13 19.38-77 32-4.92 1.77-9.76 3.54-10.63 4a5.69 5.69 0 01-1.76.53s1.36-2.72 3.1-6A376.37 376.37 0 00226.93 351c.6-1.43 1-2.73 1-2.8zm-12 3.93a22.06 22.06 0 01-1.3 3.54 478.14 478.14 0 01-26.33 52.85c-2.8 5-5.14 9-5.22 9s-2.34-1.36-5.07-3c-16-9.85-30.28-22-39.58-33.65l-1.4-1.68 6.89-1.89a495.06 495.06 0 0066.44-23c3.03-1.23 5.57-2.17 5.57-2.17zm74.76 26.12c.09 1.77-3.77 17.32-7 28.6-2.64 9.46-4.92 16.88-9.08 30-1.77 5.74-3.4 10.52-3.54 10.52a6.9 6.9 0 01-1-.23 317 317 0 01-61.51-17.33c-5.32-2.13-12.88-5.53-13.34-5.9a88.56 88.56 0 0110.15-4.78c34.44-15.06 70.16-32.16 82.41-39.5a9.82 9.82 0 012.8-1.36zM118 384.17c.14.16-9.46 14-22.93 32.85-4.7 6.59-10.15 14.31-12.19 17.18s-5.15 7.42-6.89 10.14l-3.19 4.93-3.4-2.89A125.72 125.72 0 0155.37 432a62.19 62.19 0 01-12.65-24.44c-.83-3.63-.83-5.45 0-5.68 1.14-.3 21.34-5.07 40.27-9.46a4579.3 4579.3 0 0027.1-6.36l8-1.89zm9.68 3.7l2.43 2.73a141.63 141.63 0 0035.42 29.06 20.76 20.76 0 014.09 2.65c-.53.37-46.77 16.81-68.2 24.23-12 4.23-21.94 7.63-22 7.63a13.23 13.23 0 01-1.5-1l-1.37-1 2.2-3.17c7.08-10.31 16-21.57 35.41-45l13.41-16.13zm60.39 43.23c.09 0 3.42 1.13 7.49 2.63a240.11 240.11 0 0028.09 8.72 309 309 0 0042.5 7.33c1.66.16 2.57.32 2.27.53s-11.66 4-19.84 6.59c-13 4.09-52.75 15.81-85.14 25.13-6 1.77-11.13 3.18-11.43 3.26a6.07 6.07 0 01-3.25-.84 52.79 52.79 0 014-5.06 453.91 453.91 0 0030.65-41.3l4.6-7zm-13.31.37s-5.32 8.71-14.69 23.53c-4 6.29-8.48 13.41-10.06 15.94s-3.79 6.2-5.08 8.33l-2.19 3.85-1.14-.3c-2.72-.76-21.87-7.49-26.93-9.54A188.39 188.39 0 0197 465.19c-6.06-3.26-13.62-8.1-13-8.26.15 0 10.52-2.87 23-6.28 33.16-9 51.55-14.17 63.58-18a33.23 33.23 0 014.16-1.14zm94.24 22.1c.3.76-11.95 34.82-16.41 45.56-1 2.43-1.37 3-1.9 3-1.29-.09-19.07-2.58-29.89-4.16-18.84-2.89-50.49-8.41-58.44-10.22l-1.77-.39 11.28-2.56c24.21-5.46 35.88-8.4 47.67-12.05a337.14 337.14 0 0044.59-17.17 34.22 34.22 0 014.87-2.01zM212.76 6c-1.66-.23-28.54 9.46-45.86 16.51C143.51 32 125.34 41.12 114.15 49c-4.17 3-9.39 8.18-10.22 10.22a7.15 7.15 0 00-.46 2.59l10.14 9.74 24.14 7.7 57.45 10.29 65.68 11.21.67-5.69H261l-8.62-1.36-1.77-3.1c-9-15.74-18.83-35.28-24.61-48.45a248.35 248.35 0 01-11-30.5c-1.29-5.15-1.44-5.45-2.27-5.52zm-1.22 3.86h.09s.38 2.2.68 4.7a157.64 157.64 0 007.35 31.87c2.79 8.33 2.79 7.88-.47 6.89-7.72-2.12-42.3-8.09-67.29-11.58-4-.53-7.42-1.06-7.42-1.13-.3-.3 18.1-9.92 26.19-13.69 10.38-4.78 38.84-16.67 40.94-17zm-72.95 33.92l2.95 1c16 5.46 56.39 13.18 78.65 15l4.67.46a33.57 33.57 0 01-4.71 2.48c-10.75 5.31-22.54 12-30.72 17a32 32 0 01-4.93 2.72c-.3 0-1.89-.31-3.54-.53l-3-.46-7.59-7.45c-13.32-12.92-23.76-23-27.77-26.7zm-3 2.33l10.62 13.32c5.83 7.35 11.73 14.54 13 16.13a22.91 22.91 0 012.32 3c-.3.23-15.43-2.73-23.47-4.53s-11.65-2.8-16.71-4.4l-4.16-1.36v-1.01c0-5.07 6.49-12.65 17.4-20.35l1-.69zm90.66 18.17c.32 0 .69.68 1.6 2.73 2.57 5.67 10.62 20.95 12.57 23.91.61 1 1.66 1.06-9-.68-25.66-4.16-33.91-5.52-33.91-5.68a8.37 8.37 0 011.76-1.13 148.31 148.31 0 0023-15.94c1.77-1.44 3.33-2.8 3.63-3s.23-.21.3-.14z\" fill=\"#b6bdc5\"/><path d=\"M104.45 58.21a7.48 7.48 0 000 6.57c1 2.43 3.86 5.31 7.09 8.41 0 0 33.64 32.85 37.77 37.54 18.61 21.49 26.72 42.68 27.47 71.9.45 18.77-3.1 35.26-12 54.42-15.74 34.36-49 72.27-100.21 114.37l7.51-2.52C77 345.36 83.54 341.41 99 333c35.65-19.48 75.76-37.47 125-55.94 70.84-26.56 187.32-57.82 253.61-68l6.89-1.06-1-1.66a229.74 229.74 0 00-15.32-21.47 182.08 182.08 0 00-53.73-44.73c-29.66-16.57-68-29.52-116.63-39.12-9.16-1.77-29.29-5.31-45.64-7.81-34.65-5.31-57.06-9.06-81.74-13.31-8.85-1.51-22.1-3.78-30.87-5.67a198.73 198.73 0 01-20.06-5.31c-5.46-2.11-13.32-4.24-15-10.63zm19.48 18.91a19.76 19.76 0 012.89.91c2.87 1 6.59 2.12 11 3.33q4.95 1.38 10 2.65c4.53 1.14 8.32 2.2 8.39 2.2.53.53 8.18 25 10.75 34.35a63.55 63.55 0 011.66 6.59 15.5 15.5 0 01-1.89-3c-8.86-15.58-22.86-31.39-39-44.11a33.08 33.08 0 01-3.72-3zm37.19 10.29a29.6 29.6 0 014.09.69c12.88 2.87 35.95 7.26 50.7 9.76a18 18 0 014.48 1 7.93 7.93 0 01-2 1.28c-2.5 1.29-12.56 7.28-15.94 9.54a143.63 143.63 0 00-21.21 17.11c-2.2 2.19-4.1 4-4.1 4s-.44-1.27-.83-2.87a242.91 242.91 0 00-13.54-37.08 30.6 30.6 0 01-1.51-3.54zm65.53 12.4c.45.16 1.22 2.73 2.72 8.41a123.72 123.72 0 013.63 34.66c-.14 3.18-.3 6.12-.44 6.51l-.23.76-3.93-1.29c-8.11-2.57-21.25-6.43-32.55-9.61-6.43-1.78-11.65-3.33-11.65-3.55a180 180 0 0113.38-13.4c7.66-6.73 28.34-22.77 29.07-22.56zm5.22.76c.23-.23 31.34 5.15 45.49 7.88 10.52 2 25.8 5.22 26.71 5.6.46.14-1.14 1.06-6.2 3.33a329.16 329.16 0 00-49.59 26.93c-3.86 2.59-7.08 4.69-7.19 4.69a37.07 37.07 0 01-.16-4.83 105.18 105.18 0 00-8.18-41.17 14 14 0 01-.78-2.34zm80.45 15.94a55.58 55.58 0 01-1.67 10c-2.72 11.28-10.06 28-19.07 43.74a49.4 49.4 0 01-3.17 5.15 32.55 32.55 0 01-4.55-2.43 247.47 247.47 0 00-29.66-14.54c-3-1.27-5.69-2.33-5.76-2.49-.53-.45 23.84-16.58 36.71-24.3 10.22-6.21 26.85-15.43 27.17-15.13zm5.75.9c.69 0 14.46 3.79 21.64 5.9a445 445 0 0151.55 18.86l5.53 2.49-3.86.91a561.85 561.85 0 00-87.27 27c-2.2.9-4.16 1.67-4.3 1.67a18.83 18.83 0 011.57-3.86c8.11-17.18 13.34-35.12 14.61-50.42 0-1.42.3-2.55.53-2.55zM180.94 148.9a168.6 168.6 0 0116.42 3.86c8.63 2.42 26.94 8.55 26.94 9 0 .09-2.05 1.77-4.45 3.95-9.92 8.25-19.49 17-30.89 28-3.4 3.26-6.29 5.9-6.43 5.9s-.23-.45-.16-1a170.66 170.66 0 00-1.06-45.65c-.12-2.06-.34-3.88-.27-4zm221.07.23c.15.14-4.85 8-8 12.48-4.55 6.5-11.21 15.14-26.26 34.06-8 10-16.88 21.25-19.84 25.05s-5.52 7-5.59 7a23.89 23.89 0 01-2.13-3 156 156 0 00-30.65-33.82c-2.27-1.89-4.76-4-5.6-4.55a9.23 9.23 0 01-1.54-1.35c0-.24 12.87-5.76 22.63-9.69 17.3-6.93 40.52-15.25 58-20.56 9.15-2.89 18.91-5.69 19.07-5.53zm5.83 1.5a17.25 17.25 0 014.3 2.13 256.52 256.52 0 0150.65 38c4 3.95 13.92 14.17 13.76 14.31s-3.54.3-7.56.6c-31.88 2.43-72.61 9.16-111.87 18.63-2.64.61-5 1.14-5.13 1.14s2.79-3 6.5-6.52c23-22.17 33.53-36.18 45.95-61.15 1.77-3.7 3.24-6.89 3.4-7.08zM239.29 167.9c1.06.21 10.9 4.83 18.31 8.55 6.82 3.4 17 8.86 17.57 9.3 0 .09-3.54 2-8 4.16C253 197 240.72 203.76 228 211.48c-3.63 2.2-6.66 4-6.73 4s-.23-.3 1.77-4a157.73 157.73 0 0015.37-41.7c.3-1.14.6-1.88.83-1.88zm-9.85 1.77a141.78 141.78 0 01-3.93 14.61A185.74 185.74 0 01212.12 215c-1.22 2.13-3 5.32-4 7l-1.89 3-4.23-4.08a55.6 55.6 0 00-14.08-10.38 20.26 20.26 0 01-3.63-2.12c0-.61 12.94-12.4 22.86-20.81 7.06-6.13 22.08-18.17 22.29-17.94zm60.21 24.79l3.72 2.43a288.85 288.85 0 0126.1 19.28c4.32 3.54 12.65 11.05 14.31 12.88l.91 1-6.13 1.77c-34.68 9.61-61.45 18.15-92.72 29.66-3.55 1.29-6.43 2.36-6.66 2.36s-.84.37 7-6.82A333.17 333.17 0 00287 198.57l2.64-4.09zm-15.81 3.93c.14.16-10.22 14.75-16.44 23-7.4 9.85-20.58 26.35-29.66 37.09-3.79 4.48-7.08 8.18-7.19 8.25a7.08 7.08 0 01-.3-2.8 63.26 63.26 0 00-6.43-27.24c-1.77-3.54-2-4.32-1.66-4.69 1.43-1.29 23.46-13.86 37.38-21.35 9.39-5 24.07-12.4 24.3-12.26zm-95.63 23.47a32 32 0 013.93 2 82.76 82.76 0 0113 8.86 22.64 22.64 0 01-4.39 3.54c-7.19 5.15-18.08 13.39-24.44 18.47-6.66 5.31-6.89 5.44-6.13 4.3a137 137 0 0010.13-17.48 139.51 139.51 0 006.36-15.81 12.49 12.49 0 011.52-3.86zm25.5 20c.37 0 .83.6 2.87 3.63a54.68 54.68 0 018.48 22l.16 1.53-10.38 4c-18.54 7.19-35.64 14.31-47.23 19.6-3.24 1.5-8.85 4.23-12.62 6.06s-6.75 3.32-6.75 3.25 2.36-1.76 5.22-3.94c22.64-16.42 42.24-34.43 56.92-52.44 1.6-1.89 3-3.65 3.19-3.72zM192 244.72c.3.3-8.33 10.06-14.17 16a250.48 250.48 0 01-47 37.92l-4.53 2.92c-.53.3.14-.44 8-9a180.74 180.74 0 0013.09-15.51 25 25 0 017.61-7.15c11.08-8 36.83-25.45 37-25.13z\" fill=\"url(#dp-mssql-a)\"/></svg>","fibrenetix":"<svg viewBox=\"0 0 512 512\"><path fill=\"#474c4f\" d=\"M0 0h512v512H0z\"/><path d=\"M397.57 280.73c.17.06.33.13.49.21 1.88.9 3.11 2.72 4.26 4.46 6.5 9.89 13 19.77 19.5 29.66 6.85-10.33 13.71-20.66 20.56-30.98.78-1.18 1.61-2.4 2.85-3.08 1.3-.72 2.86-.73 4.35-.72 5.7.02 11.39.05 17.09.07-10.85 15.81-21.69 31.62-32.54 47.43 11.32 16.41 22.64 32.83 33.96 49.24h-17.5c-1.62 0-3.33-.03-4.72-.87-1.13-.69-1.89-1.84-2.61-2.96-7.13-11.02-14.25-22.04-21.38-33.06-15.77 23.04-31.55 46.07-47.32 69.11-1.01 1.48-2.04 2.97-3.41 4.13-5.27 4.44-13.19 2.36-19.68.05l58.17-84.24c.16-.22-2.48-3.72-2.75-4.12l-2.86-4.29c-1.91-2.86-3.81-5.72-5.72-8.58-3.81-5.72-7.63-11.44-11.44-17.16l-4.69-7.04-2.29-3.43c-.68-1.02-2.08-2.44-2.41-3.61s1.91-.67 2.8-.68l4.29-.02 8.37-.05c1.56 0 3.18 0 4.63.54z\" fill=\"#7dbf42\"/><path d=\"M206.06 279.86c-62.58-18.82-81.7 80.99-26.49 97.63 11.96 3.61 36.3 3.05 47.15-3.51 4.66-2.81 1.49-13.22 2.36-18.26-23.83 10.79-59.33 13.39-59.76-21.35l65.46-1.42c.13-22.41-4.41-45.79-28.73-53.1zm-36.73 38.87c1.47-32.16 44.08-33.47 44.11 0h-44.11zM46.96 234.78H68.3v-82.53h18.51v-15.66l-18.51.01c-.29 0 .06-9.6.17-10.6.37-3.26 1.34-6.6 3.69-9 4.99-5.08 13.57-4.78 20.21-4.73 7.55.06 15.09.31 22.64.42 3.2.05 6.41.09 9.61 0 1.26-.03 3.55.24 4.68-.48l3.04-16.89c0 .01-.4 0-.42 0H97.18c-14.01 0-30.85-1.92-41.57 9.27-7.92 8.27-8.19 21.35-9.29 32.05l-14.81 5.82-.2 9.78h15.66v82.52zm67.07-2.33c1.48 4.53 16.81 1.46 21.14 2.33V136.6h-19.92l-1.22 95.85zm2.92 50.08c-6.87-3.92-15.05-5.29-22.91-4.39-10.75 1.22-20.96 6.67-27.95 14.93-.71-4.22-1.42-8.45-2.12-12.67l-12.98-.06c-.9 0-2.59-.35-3.41-.02-.92.37-.61 1.12-.61 2.17v94.58H68.4l-.3-48.86c-.03-4.92-.06-9.88.97-14.7s3.2-9.52 6.92-12.74c6-5.18 14.83-5.57 22.61-4.04 4.53.89 9.45 2.75 11.38 6.95 1 2.19 1.02 4.68 1.02 7.09v66.3h21.3l.15-62.43c.01-4.69.01-9.44-1.18-13.97-2.01-7.65-7.44-14.22-14.31-18.14zm136.38-123.38c-3.11-7.55-7.97-14.57-14.78-19.08-7.62-5.05-17.33-6.59-26.27-4.71-8.94 1.88-17.06 7.04-23 13.98.46-17.51.91-35.03 1.37-52.54 0 0-16.71-.04-18.23-.04-1.01 0-2.53-.4-3.07.6-.5.94-.03 3.32-.03 4.39v133.03c5.22-.22 10.45-.43 15.67-.65.99-4.1 1.97-8.2 2.96-12.31 6.67 6.89 15.37 11.95 24.82 13.59 9.45 1.63 19.61-.34 27.35-6 10.02-7.34 15-19.85 16.93-32.12 2.02-12.78 1.2-26.18-3.72-38.14zm-21.15 48.13c-7.13 15.35-30.37 15.5-38.04.55-6.66-12.98-7.29-51.32 11.79-55.25 31.94-6.59 35.93 33.86 26.25 54.7zm51.12 88.75c8.95-.04 17.89-.09 26.84-.13l1.41-15.53-28.33-.12-.12-22.63c-2.62-.81-5.46-.83-8.11-.14-2.28.59-4.45 1.52-5.65 3.67-1.49 2.68-2.17 5.69-2.95 8.63-.68 2.54-1.44 5.1-2.89 7.32-3.13 4.81-8.84 7.16-14.24 9.1-.07 3.24-.13 6.48-.2 9.72 4.29.04 8.58.07 12.87.11-.3 17.25-.61 34.5.13 51.74.29 6.66.81 13.58 4.14 19.35 4.14 7.17 12.23 11.5 20.45 12.53s16.57-.87 24.3-3.85l.51-15.88c-3.91 1.35-7.88 2.72-12 2.98s-8.51-.7-11.55-3.5c-4.74-4.35-5.03-11.61-4.97-18.05.12-15.1.25-30.2.37-45.3zm51.08 81.04h21.34v-96.76h-21.34v96.76zm99.86-164.23c-23.83 10.79-59.33 13.39-59.76-21.35l65.46-1.42c.13-22.41-4.41-45.79-28.73-53.1-62.58-18.82-81.7 80.99-26.49 97.63 11.96 3.61 36.3 3.05 47.15-3.51 4.66-2.81 1.49-13.22 2.36-18.26zm-15.64-37.01h-44.11c1.47-32.16 44.08-33.47 44.11 0zm-77.1-40.65c-16.95-2.32-31.66 3.94-40.56 18.51l-2.13-17.1h-17.08v98.19h21.34v-60.47c0-4.66 9.02-14.28 13.22-16.66 7.18-4.07 14.47-4.43 22.4-3.15l2.81-19.31z\" fill=\"#f6f9fb\"/></svg>","tanzu-kubernetes":"<svg viewBox=\"0 0 512 512\"><path d=\"M326.48 433.61H185.52c-5.54 0-10.86-2.47-14.28-6.84l-89.13-111.8c-3.54-4.36-4.84-10.39-3.43-15.82l34-136.94c1.3-5.19 4.72-9.56 9.56-11.93l125.95-63.16c5.08-2.59 11.21-2.59 16.3 0l127.5 63.16c4.83 2.48 8.37 6.85 9.68 12.17l32.34 136.82c1.3 5.55 0 11.21-3.54 15.7l-89.95 111.8c-3.31 4.37-8.5 6.84-14.05 6.84zm-140.6-18.89h140.36l89.6-111.44-32.22-136.23-127.15-62.92-125.48 62.92L97.11 303.4l88.78 111.32z\" fill=\"#218fcf\"/><path d=\"M24.39 307.06l20.55-4.6 40.25-161.85-16.05-13.82-44.75 180.27zM445.83 126.8l-16.17 13.35 38.49 162.43 20.42 4.49-42.74-180.27z\" fill=\"#1e4488\"/><path d=\"M28.41 325.48L145.87 472.8l9.2-18.77L48.94 320.86l-20.54 4.61zm435.37-4.61l-107.19 133.4 9.2 18.78 118.64-147.56-20.66-4.61z\" fill=\"#78be43\"/><path d=\"M266.29 30.11v21.13l152.29 75.43 15.94-13.23-168.23-83.33zm-18.88.11l-166.1 83.23 15.46 13.35 150.64-75.44V30.22zM172.07 462.3l-9.2 18.89h185.81l-9.2-18.89h-167.4z\" fill=\"#19bfd3\"/></svg>","vcenter":"<svg viewBox=\"0 0 512 512\"><path d=\"M378.64 110.24h-116.4a21.24 21.24 0 00-21.35 21.07v240.57h-98.66V275h87.31v-29.85H129.2a17.11 17.11 0 00-17.19 17v122.63a17.1 17.1 0 0017.19 17h120.56a21.23 21.23 0 0021.35-21.06v-240.6h98.65v94.81h-87.3v29.88h96.18A21.24 21.24 0 00400 243.74V131.31a21.24 21.24 0 00-21.36-21.07zM484.64 6H156.22a21.23 21.23 0 00-21.34 21.07V143H27.35A21.23 21.23 0 006 164v320.9A21.23 21.23 0 0027.35 506h328.43a21.24 21.24 0 0021.35-21.08V371.09h107.51A21.24 21.24 0 00506 350V27a21.24 21.24 0 00-21.36-21zm-8.86 331.75a3.52 3.52 0 01-3.59 3.47h-125.3v131.45a3.52 3.52 0 01-3.59 3.46H39.82a3.53 3.53 0 01-3.6-3.46V176.28a3.52 3.52 0 013.6-3.45H165.1V39.33a3.53 3.53 0 013.6-3.45h303.49a3.52 3.52 0 013.59 3.45zM426.46 57.1H208.19a21.24 21.24 0 00-21.35 21.07v115.88H81.39A21.24 21.24 0 0060 215.12v214.62A14.86 14.86 0 0065.17 441a15.23 15.23 0 0010 3.72 15.05 15.05 0 0015.12-14.94V223.92h126.8V87h209.37a14.94 14.94 0 100-29.87z\" fill=\"#89c540\"/></svg>"};
/* the /create rail's twelve category glyphs — the product's own discovery-* / topology icons, 48 grid */
const DP_CAT_ICO = {"server":"M40 26C43.3137 26 46 28.6863 46 32V40C46 43.3137 43.3137 46 40 46H8C4.68629 46 2 43.3137 2 40V32C2 28.6863 4.68629 26 8 26H40ZM8 30C6.89543 30 6 30.8954 6 32V40C6 41.1046 6.89543 42 8 42H40C41.1046 42 42 41.1046 42 40V32C42 30.8954 41.1046 30 40 30H8ZM12.0195 34C13.1241 34 14.0195 34.8954 14.0195 36C14.0195 37.1046 13.1241 38 12.0195 38H12C10.8954 38 10 37.1046 10 36C10 34.8954 10.8954 34 12 34H12.0195ZM40 2C43.3137 2 46 4.68629 46 8V16C46 19.3137 43.3137 22 40 22H8C4.68629 22 2 19.3137 2 16V8C2 4.68629 4.68629 2 8 2H40ZM8 6C6.89543 6 6 6.89543 6 8V16C6 17.1046 6.89543 18 8 18H40C41.1046 18 42 17.1046 42 16V8C42 6.89543 41.1046 6 40 6H8ZM12.0195 10C13.1241 10 14.0195 10.8954 14.0195 12C14.0195 13.1046 13.1241 14 12.0195 14H12C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10H12.0195Z","cloud":"M8.6,19.6c0-7.29,5.91-13.2,13.2-13.2,5.78,0,10.69,3.71,12.48,8.88,6.6.73,11.72,6.33,11.72,13.12,0,7.29-5.91,13.2-13.2,13.2H13c-6.08,0-11-4.92-11-11,0-4.52,2.73-8.41,6.63-10.1-.02-.3-.03-.6-.03-.9ZM21.8,10.8c-4.86,0-8.8,3.94-8.8,8.8,0,.67.07,1.31.21,1.93.27,1.19-.48,2.36-1.67,2.63-2.95.66-5.15,3.3-5.15,6.44,0,3.65,2.95,6.6,6.6,6.6h19.8c4.86,0,8.8-3.94,8.8-8.8s-3.94-8.8-8.8-8.8c-.06,0-.12,0-.18,0-1.06.02-1.99-.72-2.2-1.76-.81-4.02-4.37-7.04-8.62-7.04Z","network":"M39.98,32.01c-1.24,0-2.45,.4-3.46,1.12l-4.9-2.9c.23-.72,.35-1.47,.36-2.22,0-1.77-.6-3.48-1.68-4.88-1.09-1.4-2.6-2.39-4.31-2.84v-4.64c1.33-.47,2.46-1.4,3.17-2.62,.72-1.22,.98-2.65,.74-4.05-.24-1.39-.96-2.66-2.05-3.57-1.08-.91-2.45-1.41-3.87-1.41s-2.78,.5-3.87,1.41c-1.08,.91-1.81,2.18-2.05,3.57-.24,1.39,.02,2.83,.74,4.05,.72,1.22,1.84,2.15,3.17,2.62v4.64c-1.71,.44-3.23,1.44-4.31,2.84-1.09,1.4-1.68,3.11-1.68,4.88,0,.75,.13,1.5,.36,2.22l-4.9,2.9c-1.01-.72-2.22-1.11-3.46-1.12-1.19,0-2.35,.35-3.33,1.01-.99,.66-1.75,1.6-2.21,2.69-.45,1.1-.57,2.3-.34,3.47,.23,1.16,.8,2.23,1.64,3.07,.84,.84,1.91,1.41,3.07,1.64,1.16,.23,2.37,.11,3.47-.34,1.1-.45,2.03-1.22,2.69-2.21,.66-.99,1.01-2.15,1.01-3.33,0-.54-.09-1.08-.24-1.6l4.6-2.74c1.5,1.49,3.53,2.33,5.64,2.33s4.14-.84,5.64-2.33l4.6,2.74c-.34,1.21-.28,2.5,.15,3.67,.43,1.18,1.23,2.19,2.27,2.89,1.04,.7,2.28,1.06,3.53,1.03,1.26-.04,2.47-.47,3.47-1.23,1-.76,1.73-1.82,2.1-3.02s.34-2.49-.06-3.68c-.4-1.19-1.17-2.22-2.2-2.95-1.02-.73-2.25-1.12-3.5-1.11h0Zm-31.99,8c-.4,0-.78-.12-1.11-.34-.33-.22-.58-.53-.74-.9-.15-.37-.19-.77-.11-1.16,.08-.39,.27-.74,.55-1.02,.28-.28,.64-.47,1.02-.55,.39-.08,.79-.04,1.16,.11,.37,.15,.68,.41,.9,.74,.22,.33,.34,.72,.34,1.11,0,.53-.21,1.04-.59,1.41-.37,.38-.88,.59-1.41,.59ZM23.99,8.02c.4,0,.78,.12,1.11,.34,.33,.22,.58,.53,.74,.9,.15,.37,.19,.77,.11,1.16-.08,.39-.27,.74-.55,1.02-.28,.28-.64,.47-1.02,.55s-.79,.04-1.16-.11c-.37-.15-.68-.41-.9-.74-.22-.33-.34-.72-.34-1.11,0-.53,.21-1.04,.59-1.41,.37-.37,.88-.59,1.41-.59h0Zm0,23.99c-.79,0-1.56-.23-2.22-.67-.66-.44-1.17-1.06-1.47-1.79-.3-.73-.38-1.53-.23-2.31,.15-.78,.54-1.49,1.09-2.05s1.27-.94,2.05-1.09c.78-.15,1.58-.07,2.31,.23,.73,.3,1.36,.82,1.79,1.47,.44,.66,.67,1.43,.67,2.22,0,1.06-.42,2.08-1.17,2.83-.75,.75-1.77,1.17-2.83,1.17Zm15.99,8c-.4,0-.78-.12-1.11-.34-.33-.22-.58-.53-.74-.9-.15-.37-.19-.77-.11-1.16,.08-.39,.27-.74,.55-1.02,.28-.28,.64-.47,1.02-.55,.39-.08,.79-.04,1.16,.11,.37,.15,.68,.41,.9,.74,.22,.33,.34,.72,.34,1.11,0,.53-.21,1.04-.59,1.41-.37,.38-.88,.59-1.41,.59Z","sdn":"M40.5,29.9c-2.2,0-4,1.3-4.8,3.2h-2.2v-5.3h3.4c5,0,9.1-4.1,9.1-9.1s-2.8-7.7-6.7-8.8c-.9-4.6-5-8-9.8-8s-3.7,.5-5.3,1.5c-1.7-1.5-3.9-2.4-6.2-2.4-5,0-9,4-9.1,8.9-3.9,1-6.9,4.6-6.9,8.8s4.1,9.1,9.1,9.1h3.6v5.3h-2.4c-.8-1.9-2.7-3.2-4.8-3.2s-5.2,2.4-5.2,5.2,2.4,5.2,5.2,5.2,4.1-1.4,4.9-3.3h4.3c1.1,0,2-.9,2-2v-7.3h3.4v9c-1.9,.8-3.3,2.7-3.3,4.9s2.4,5.2,5.2,5.2,5.2-2.4,5.2-5.2-1.3-4-3.2-4.8v-9h3.3v7.3c0,1.1,.9,2,2,2h4.2c.8,1.9,2.7,3.3,4.9,3.3s5.2-2.4,5.2-5.2-2.4-5.2-5.2-5.2ZM7.5,36.9c-1,0-1.7-.8-1.7-1.7s.8-1.7,1.7-1.7,1.7,.8,1.7,1.7-.8,1.7-1.7,1.7Zm16.6,6.5c-1,0-1.7-.8-1.7-1.8s.8-1.7,1.7-1.7,1.7,.8,1.7,1.7-.8,1.8-1.7,1.8ZM11.1,23.9c-2.8,0-5.1-2.3-5.1-5.1s2.3-5.1,5-5.1c.6,0,1.2-.3,1.5-.8,.4-.5,.5-1.1,.4-1.7,0-.3-.1-.7-.1-1,0-2.8,2.3-5.1,5.1-5.1s3.3,.8,4.3,2.3c.3,.5,.9,.8,1.4,.9,.6,0,1.2-.1,1.6-.5,1.1-1.1,2.6-1.7,4.2-1.7,3.2,0,5.9,2.6,6,5.8,0,1,.8,1.8,1.8,1.9,2.7,.2,4.7,2.4,4.7,5.1s-2.3,5.1-5.1,5.1H11.1Zm29.3,13c-1,0-1.7-.8-1.7-1.7s.8-1.7,1.7-1.7,1.7,.8,1.7,1.7-.8,1.7-1.7,1.7Z","virtualization":"M23.7422 0C24.8853 0 26.0085 0.300406 26.999 0.871094L42.2168 9.56738C43.016 10.029 43.703 10.6561 44.2402 11.4004C44.3817 11.5385 44.5051 11.6944 44.6045 11.8662C44.6884 12.0113 44.7525 12.1665 44.8008 12.3262C45.2445 13.2238 45.4777 14.2127 45.4775 15.2178V32.6152C45.478 33.7604 45.1769 34.8861 44.6045 35.8779C44.0321 36.8696 43.2084 37.6931 42.2168 38.2656L27.002 46.9482C26.312 47.3458 25.5569 47.6083 24.7764 47.7334C24.4603 47.9054 24.1037 47.999 23.7373 47.999C23.3686 47.999 23.0099 47.9046 22.6924 47.7305C21.9191 47.604 21.1712 47.3423 20.4873 46.9482L5.26953 38.2559C4.27673 37.6848 3.45188 36.8622 2.87793 35.8711C2.30388 34.8796 2.00091 33.7541 2 32.6084V15.2129C1.99963 14.1977 2.23696 13.1987 2.68945 12.2939C2.73698 12.1452 2.79925 12.001 2.87793 11.8652C2.97018 11.7055 3.08311 11.5596 3.21191 11.4287C3.75266 10.6696 4.4494 10.0319 5.26074 9.56348L20.4854 0.871094C21.4759 0.300357 22.599 2.19815e-05 23.7422 0ZM25.9121 25.1924V42.5693L40.0371 34.499C40.367 34.3077 40.641 34.0327 40.8311 33.7021C41.0211 33.3716 41.1207 32.9965 41.1201 32.6152V16.3945L25.9121 25.1924ZM6.35254 32.6104C6.35215 32.9917 6.45251 33.3667 6.64258 33.6973C6.8326 34.0277 7.10592 34.3027 7.43555 34.4941L21.5635 42.5674V25.1875L6.35254 16.3867V32.6104ZM23.7412 4.34863C23.3593 4.34878 22.984 4.44953 22.6533 4.64062L8.60547 12.668L23.7412 21.4307L38.874 12.6689L24.8359 4.64062C24.5032 4.44834 24.1255 4.34755 23.7412 4.34863Z","hci":"M11.376 8C11.5618 8.00011 11.741 8.06945 11.8789 8.19336L28.7539 23.4434C28.9107 23.5863 29.001 23.7882 29.001 24C29.001 24.2118 28.9107 24.4137 28.7539 24.5566L11.8789 39.8066C11.741 39.9305 11.5618 39.9999 11.376 40H2.75098C2.44115 40 2.16388 39.8102 2.05176 39.5215C1.93982 39.2326 2.01642 38.9053 2.24414 38.6963L17.7588 24.5322C17.9137 24.3903 18.0008 24.1923 18.001 23.9805C18.001 23.7675 17.9148 23.5708 17.7578 23.4268L2.24512 9.30469C2.01642 9.09567 1.93882 8.76835 2.05176 8.47852C2.16288 8.18979 2.44115 8 2.75098 8H11.376ZM31.0371 26.1992C31.3311 25.9332 31.7793 25.9352 32.0723 26.2021L45.7568 38.6963C45.9846 38.9053 46.0622 39.2326 45.9492 39.5215C45.8371 39.8101 45.5606 39.9998 45.251 40H36.6328C36.4428 40 36.2582 39.9288 36.1162 39.8008L26.6836 31.2764C26.3456 30.9704 26.3456 30.4388 26.6836 30.1328L31.0371 26.1992ZM45.251 8C45.5606 8.00018 45.8381 8.18995 45.9492 8.47852C46.0622 8.76838 45.9846 9.09567 45.7559 9.30469L32.0527 21.7822C31.7598 22.0492 31.3116 22.0501 31.0176 21.7842L26.6836 17.8672C26.3456 17.5612 26.3456 17.0296 26.6836 16.7236L36.1221 8.19434C36.2601 8.06934 36.44 8 36.626 8H45.251Z","storage":"M29.5283 6C31.8162 6.00012 33.8716 7.2725 34.8936 9.31641L41.5781 22.6836C41.8541 23.2355 41.9999 23.8558 42 24.4717V36C42 39.308 39.308 42 36 42H12C8.692 42 6 39.308 6 36V24.4717C6.00005 23.8558 6.14592 23.2355 6.42188 22.6836L13.1064 9.31641C14.1284 7.2725 16.1838 6.00012 18.4717 6H29.5283ZM10 26V36C10 37.104 10.898 38 12 38H36C37.102 38 38 37.104 38 36V26H10ZM16 30C17.1 30 18 30.9 18 32C18 33.1 17.1 34 16 34C14.9 34 14 33.1 14 32C14 30.9 14.9 30 16 30ZM32 30C33.1 30 34 30.9 34 32C34 33.1 33.1 34 32 34H24C22.9 34 22 33.1 22 32C22 30.9 22.9 30 24 30H32ZM18.4717 10C17.7098 10.0001 17.0235 10.4245 16.6836 11.1064L11.2363 22H36.7637L31.3164 11.1064C30.9765 10.4245 30.2902 10.0001 29.5283 10H18.4717Z","database":"M16.67,31.87c-.36,0-.72,.1-1.02,.3-.3,.19-.54,.47-.68,.79-.14,.32-.18,.67-.1,1.01,.07,.34,.25,.65,.5,.9s.58,.41,.94,.48c.36,.07,.72,.03,1.06-.1,.34-.13,.62-.36,.82-.64,.2-.29,.31-.63,.31-.97,0-.46-.19-.91-.54-1.24s-.81-.51-1.3-.51ZM24,6.5c-7.33,0-14.67,2.4-14.67,7v21c0,4.6,7.33,7,14.67,7s14.67-2.4,14.67-7V13.5c0-4.6-7.33-7-14.67-7Zm11,28c0,1.24-4.18,3.5-11,3.5s-11-2.26-11-3.5v-5.72c3.43,1.56,7.2,2.32,11,2.22,3.8,.1,7.57-.67,11-2.22v5.72Zm0-10.5c0,1.24-4.18,3.5-11,3.5s-11-2.26-11-3.5v-5.72c3.43,1.56,7.2,2.32,11,2.22,3.8,.1,7.57-.67,11-2.22v5.72Zm-11-7c-6.82,0-11-2.26-11-3.5s4.18-3.5,11-3.5,11,2.26,11,3.5-4.18,3.5-11,3.5Zm-7.33,4.38c-.36,0-.72,.1-1.02,.29-.3,.19-.54,.47-.68,.79-.14,.32-.18,.67-.1,1.01,.07,.34,.25,.65,.5,.9s.58,.41,.94,.48c.36,.07,.72,.03,1.06-.1s.62-.36,.82-.64c.2-.29,.31-.63,.31-.97,0-.46-.19-.91-.54-1.24-.34-.33-.81-.51-1.3-.51Z","service-check":"M29.7012 14.1641C31.3788 14.1641 33.2117 14.5142 33.29 14.5293C33.6613 14.601 33.9966 14.8002 34.2373 15.0918C34.4778 15.3834 34.6093 15.7499 34.6094 16.1279V17.8174C34.7427 17.8701 34.875 17.9273 35.0059 17.9893L36.2051 16.7891C36.4698 16.5239 36.8177 16.3578 37.1904 16.3193C37.5632 16.2809 37.9377 16.3726 38.251 16.5781C38.3133 16.6191 39.7914 17.5942 40.9785 18.7812C42.1652 19.968 43.2136 21.5113 43.2578 21.5771C43.4701 21.8898 43.5664 22.2672 43.5312 22.6436C43.4961 23.0198 43.3309 23.3717 43.0645 23.6396L41.7188 24.9854C41.7476 25.069 41.7799 25.1517 41.8115 25.2354H43.7227C44.0966 25.2358 44.459 25.3654 44.749 25.6016C45.039 25.8377 45.2392 26.1661 45.3154 26.5322C45.3303 26.6048 45.6855 28.3403 45.6855 30.0186C45.6855 31.6967 45.3352 33.5312 45.3203 33.6084C45.2484 33.9793 45.0492 34.3132 44.7578 34.5537C44.4664 34.7942 44.1005 34.9265 43.7227 34.9268H41.6318C41.6161 34.9648 41.5997 35.003 41.583 35.041L43.0605 36.5215C43.3258 36.7861 43.4918 37.1341 43.5303 37.5068C43.5687 37.8796 43.4772 38.2541 43.2715 38.5674C43.2306 38.6297 42.2554 40.1078 41.0684 41.2949C39.8813 42.4819 38.3366 43.5305 38.2715 43.5742C37.9584 43.7859 37.5813 43.8816 37.2051 43.8457C36.8285 43.8097 36.4755 43.6444 36.208 43.377L34.6885 41.8555L34.6113 41.8877V43.9834C34.6114 44.3538 34.4847 44.713 34.2529 45.002C34.0211 45.291 33.6977 45.493 33.3359 45.5732C33.2569 45.5909 31.3918 46 29.7656 46C28.1395 45.9999 26.2754 45.5909 26.1973 45.5732C25.8355 45.493 25.5122 45.291 25.2803 45.002C25.0485 44.713 24.9218 44.3538 24.9219 43.9834V41.9971C24.8688 41.9775 24.8167 41.956 24.7646 41.9355L23.3623 43.3379C23.1003 43.5996 22.7568 43.7643 22.3887 43.8047C22.0204 43.8451 21.6495 43.7584 21.3369 43.5596C21.269 43.5158 19.6606 42.4896 18.5107 41.3379C17.3613 40.1864 16.3332 38.5802 16.2891 38.5117C16.0904 38.1991 16.0035 37.8281 16.0439 37.46C16.0844 37.0919 16.249 36.7483 16.5107 36.4863L17.7676 35.2295C17.7221 35.1292 17.6775 35.0289 17.6348 34.9277H15.8672C15.4966 34.9278 15.1367 34.8012 14.8477 34.5693C14.5588 34.3375 14.3576 34.0139 14.2773 33.6523C14.2606 33.5733 13.8506 31.7082 13.8506 30.082C13.8506 28.4559 14.2606 26.5918 14.2773 26.5127C14.3576 26.151 14.5588 25.8276 14.8477 25.5957C15.1367 25.3638 15.4966 25.2372 15.8672 25.2373H17.4492C17.505 25.0895 17.5646 24.9418 17.626 24.7959L16.5088 23.6787C16.2472 23.4167 16.0824 23.0731 16.042 22.7051C16.0017 22.337 16.0885 21.9658 16.2871 21.6533C16.3349 21.5791 17.3614 19.9737 18.5098 18.8271C19.6605 17.6784 21.2671 16.6492 21.335 16.6055C21.6475 16.4067 22.0185 16.3209 22.3867 16.3613C22.7551 16.4018 23.0993 16.5661 23.3613 16.8281L24.4404 17.9082C24.5994 17.8385 24.7591 17.7732 24.9199 17.7109V16.1299C24.9201 15.756 25.0494 15.3927 25.2852 15.1025C25.5209 14.8127 25.8492 14.6128 26.2148 14.5361C26.2874 14.5194 28.0229 14.1641 29.7012 14.1641ZM29.7051 17.4209C29.1953 17.4244 28.6856 17.4577 28.1797 17.5205V18.8809C28.1793 19.2359 28.0632 19.5814 27.8486 19.8643C27.6341 20.1471 27.3329 20.3522 26.9912 20.4482C26.2652 20.6511 25.5652 20.9384 24.9062 21.3047C24.5971 21.4759 24.2406 21.5422 23.8906 21.4932C23.5406 21.444 23.2159 21.282 22.9658 21.0322L22.0283 20.0957C21.1642 20.7193 20.4059 21.4777 19.7822 22.3418L20.749 23.3047C20.9963 23.5525 21.1568 23.8743 21.207 24.2207C21.2572 24.5669 21.1938 24.9199 21.0273 25.2275C20.6761 25.8813 20.4007 26.5739 20.2061 27.29C20.1124 27.6349 19.9078 27.9391 19.624 28.1562C19.34 28.3735 18.9923 28.4912 18.6348 28.4912H17.2334C17.156 29.0165 17.1139 29.5472 17.1064 30.0781C17.1138 30.6099 17.1559 31.1409 17.2334 31.667H18.7686C19.1142 31.667 19.4514 31.7765 19.7305 31.9805C20.0096 32.1847 20.2166 32.4731 20.3213 32.8027C20.5334 33.472 20.8174 34.1163 21.168 34.7246C21.3485 35.0355 21.4208 35.3975 21.374 35.7539C21.3272 36.1103 21.1638 36.4415 20.9092 36.6953L19.7822 37.8223C20.406 38.6866 21.164 39.4456 22.0283 40.0693L23.2637 38.835C23.5078 38.591 23.823 38.4301 24.1641 38.377C24.5051 38.3238 24.8543 38.3809 25.1611 38.5391C25.7451 38.8398 26.3585 39.0801 26.9912 39.2568C27.3329 39.3529 27.6341 39.558 27.8486 39.8408C28.0632 40.1237 28.1793 40.4692 28.1797 40.8242V42.6152C28.7055 42.6928 29.2361 42.7358 29.7676 42.7432C30.2993 42.7361 30.8303 42.6934 31.3564 42.6162V40.7461C31.3565 40.398 31.4689 40.0593 31.6758 39.7793C31.8827 39.4992 32.1739 39.2927 32.5068 39.1904C33.1125 39.0049 33.6987 38.7605 34.2568 38.4609C34.5648 38.2946 34.9183 38.232 35.2646 38.2822C35.6109 38.3326 35.9318 38.4933 36.1797 38.7402L37.5205 40.0801C37.9558 39.7403 38.3715 39.3761 38.7656 38.9893C39.1238 38.6265 39.4605 38.2423 39.7734 37.8398L38.4531 36.5205C38.2031 36.2706 38.0414 35.9458 37.9922 35.5957C37.943 35.2456 38.0091 34.8883 38.1807 34.5791C38.493 34.0149 38.7489 33.4212 38.9443 32.8066C39.0487 32.4771 39.2553 32.1886 39.5342 31.9844C39.8132 31.7802 40.1504 31.6708 40.4961 31.6709H42.3193C42.3861 31.1221 42.4222 30.5694 42.4268 30.0166C42.4228 29.5069 42.3895 28.9971 42.3271 28.4912H40.6299C40.2739 28.4896 39.9279 28.3712 39.6455 28.1543C39.3632 27.9374 39.1598 27.6336 39.0664 27.29C38.8864 26.6292 38.6369 25.9893 38.3223 25.3809C38.164 25.0742 38.1071 24.7248 38.1602 24.3838C38.2133 24.0426 38.374 23.7265 38.6182 23.4824L39.7715 22.3291C39.4316 21.8936 39.0677 21.4772 38.6807 21.083C38.3176 20.7251 37.9335 20.3893 37.5312 20.0762L36.4785 21.1289C36.2252 21.3826 35.8945 21.5458 35.5391 21.5928C35.1838 21.6396 34.8231 21.5678 34.5127 21.3887C33.8792 21.0232 33.2062 20.7304 32.5068 20.5166C32.1739 20.4143 31.8827 20.2079 31.6758 19.9277C31.4689 19.6477 31.3565 19.309 31.3564 18.9609V17.5303C30.8085 17.4627 30.2571 17.4264 29.7051 17.4209ZM29.6328 22.1191C31.6831 22.1216 33.649 22.9369 35.0986 24.3867C36.5483 25.8365 37.364 27.8023 37.3662 29.8525C37.3662 31.3822 36.9123 32.8776 36.0625 34.1494C35.2127 35.4212 34.0049 36.4127 32.5918 36.998C31.1786 37.5834 29.6233 37.736 28.123 37.4375C26.6228 37.139 25.2446 36.402 24.1631 35.3203C23.0817 34.2387 22.3451 32.8605 22.0469 31.3604C21.7487 29.8603 21.9019 28.3055 22.4873 26.8926C23.0728 25.4795 24.0641 24.2715 25.3359 23.4219C26.6078 22.5722 28.1033 22.119 29.6328 22.1191ZM31.3457 25.7148C30.5276 25.376 29.6273 25.2872 28.7588 25.46C27.8901 25.6327 27.0921 26.0593 26.4658 26.6855C25.8396 27.3118 25.413 28.1099 25.2402 28.9785C25.0676 29.847 25.1562 30.7474 25.4951 31.5654C25.8341 32.3836 26.409 33.0833 27.1455 33.5752C27.8818 34.0669 28.7474 34.3292 29.6328 34.3291C30.8197 34.3279 31.9576 33.8558 32.7969 33.0166C33.6361 32.1773 34.1081 31.0394 34.1094 29.8525C34.1095 28.9669 33.8474 28.1007 33.3555 27.3643C32.8635 26.6279 32.1638 26.0538 31.3457 25.7148ZM18.168 2C19.8447 2.00001 21.6776 2.34977 21.7578 2.36523C22.1283 2.43776 22.4623 2.63714 22.7021 2.92871C22.942 3.22029 23.0726 3.58633 23.0723 3.96387V5.65332C23.2053 5.70819 23.3376 5.76563 23.4688 5.82422L24.6689 4.625C24.9335 4.35974 25.2816 4.1938 25.6543 4.15527C26.0272 4.1168 26.4025 4.20825 26.7158 4.41406C26.7799 4.45616 28.257 5.43179 29.4424 6.61719C30.6285 7.80333 31.678 9.34894 31.7217 9.41406C31.8807 9.64959 31.9755 9.9226 31.9961 10.2061C32.0167 10.4897 31.9624 10.7741 31.8389 11.0303C31.1303 10.952 30.418 10.9114 29.7051 10.9072C28.9119 10.9121 28.119 10.9639 27.332 11.0625L28.2305 10.1641C27.8909 9.72889 27.5263 9.31384 27.1396 8.91992C26.7767 8.56203 26.3934 8.22522 25.9912 7.91211L24.9414 8.96484C24.6881 9.21829 24.3582 9.38097 24.0029 9.42773C23.6477 9.4745 23.2868 9.4029 22.9766 9.22363C22.3425 8.85856 21.6691 8.56635 20.9697 8.35156C20.637 8.24929 20.3456 8.04261 20.1387 7.7627C19.9318 7.48282 19.8205 7.14391 19.8203 6.7959V5.36621C19.2721 5.29852 18.7203 5.2613 18.168 5.25586C17.6584 5.25985 17.1493 5.29319 16.6436 5.35547V6.71582C16.6437 7.07093 16.527 7.41624 16.3125 7.69922C16.0978 7.98227 15.7962 8.18753 15.4541 8.2832C14.7282 8.48716 14.0284 8.77471 13.3691 9.14062C13.0593 9.31308 12.7017 9.38042 12.3506 9.33105C11.9995 9.28166 11.674 9.11835 11.4238 8.86719L10.4883 7.93164C10.0627 8.24871 9.65816 8.59326 9.27832 8.96387C8.90824 9.34582 8.56372 9.75214 8.24609 10.1787L9.21289 11.1455C9.4598 11.3935 9.61965 11.7152 9.66992 12.0615C9.72009 12.4076 9.65815 12.7606 9.49219 13.0684C9.14 13.7217 8.86355 14.4144 8.66992 15.1309C8.57628 15.4757 8.37174 15.7799 8.08789 15.9971C7.8039 16.2143 7.45618 16.332 7.09863 16.332H5.69824C5.62073 16.8581 5.57767 17.3892 5.57031 17.9209C5.57762 18.4525 5.62067 18.9838 5.69824 19.5098H7.2373C7.58318 19.5097 7.92019 19.6198 8.19922 19.8242C8.47826 20.0286 8.68484 20.3167 8.78906 20.6465C9.00137 21.3155 9.28572 21.9595 9.63672 22.5674C9.81585 22.8778 9.88751 23.2384 9.84082 23.5938C9.79406 23.9491 9.63131 24.2797 9.37793 24.5332L8.25098 25.6602C8.56777 26.0859 8.91238 26.4905 9.2832 26.8701C9.6634 27.2406 10.0679 27.5855 10.4932 27.9033L10.7803 27.6201C10.6638 28.437 10.6012 29.2608 10.5938 30.0859C10.5938 30.6133 10.6265 31.1482 10.6748 31.6523C10.3659 31.6526 10.0636 31.5649 9.80273 31.3994C9.73482 31.3557 8.12643 30.3276 6.97656 29.1768C5.82672 28.026 4.79768 26.4195 4.75488 26.3516C4.55481 26.0392 4.46691 25.6677 4.50684 25.2988C4.54681 24.9301 4.71235 24.5865 4.97461 24.3242L6.23047 23.0674C6.18492 22.967 6.14042 22.866 6.09766 22.7646H4.33008C3.95976 22.7645 3.60032 22.6381 3.31152 22.4062C3.0227 22.1744 2.82145 21.8508 2.74121 21.4893C2.72354 21.4111 2.31453 19.547 2.31445 17.9209C2.31445 16.2947 2.72354 14.4297 2.74121 14.3506C2.82086 13.9877 3.02282 13.6633 3.3125 13.4307C3.60218 13.198 3.96245 13.0708 4.33398 13.0713H5.91602C5.97272 12.9235 6.03148 12.7758 6.09375 12.6299L4.97656 11.5137C4.71441 11.252 4.55024 10.9082 4.50977 10.54C4.46933 10.1718 4.55569 9.80068 4.75488 9.48828C4.79768 9.42037 5.82487 7.8149 6.97656 6.66504C8.1282 5.51526 9.7346 4.4863 9.80273 4.44336C10.1151 4.24415 10.4862 4.15683 10.8545 4.19727C11.2227 4.23773 11.5664 4.40283 11.8281 4.66504L12.9082 5.74414C13.0668 5.67476 13.2263 5.60883 13.3867 5.54688V3.96582C13.3866 3.59169 13.5159 3.22875 13.752 2.93848C13.9879 2.64839 14.3165 2.44825 14.6826 2.37207C14.7552 2.35532 16.4897 2 18.168 2ZM18.1094 9.94727C19.1287 9.95053 20.1373 10.1552 21.0771 10.5498C22.0171 10.9445 22.8699 11.5215 23.5859 12.2471C23.2567 12.499 22.9608 12.7919 22.7051 13.1182C21.7682 13.0233 20.8234 13.2014 19.9854 13.6309C19.1746 13.2524 18.2692 13.1261 17.3857 13.2676C16.5023 13.4091 15.6813 13.812 15.0293 14.4248C14.3774 15.0377 13.9234 15.832 13.7275 16.7051C13.5317 17.5783 13.6029 18.4905 13.9307 19.3232C13.7381 19.6023 13.6035 19.8094 13.5439 19.9033C12.9469 20.84 12.688 21.9525 12.8096 23.0566C12.7584 23.0976 12.7085 23.1388 12.6592 23.1816C11.9331 22.4661 11.3563 21.6135 10.9609 20.6738C10.5656 19.7342 10.3594 18.7255 10.3555 17.7061C10.3516 16.6866 10.5493 15.6761 10.9375 14.7334C11.3257 13.7908 11.8966 12.934 12.6172 12.2129C13.3378 11.4918 14.1943 10.9201 15.1367 10.5312C16.0792 10.1424 17.0899 9.94406 18.1094 9.94727Z","wireless":"M40.7822 16.6016C41.3161 16.6023 41.8286 16.8149 42.2061 17.1924C42.5833 17.5698 42.7951 18.0816 42.7959 18.6152V28.2656C42.7952 28.7995 42.5835 29.312 42.2061 29.6895C41.8286 30.0669 41.3161 30.2786 40.7822 30.2793H29.7861V32.9883H31.8262C31.9613 32.9882 32.0949 33.0197 32.2158 33.0801C32.3367 33.1404 32.4423 33.2279 32.5234 33.3359L38.8818 41.7734C38.9962 41.9249 39.0586 42.11 39.0586 42.2998V46.5635C39.0585 46.7948 38.9663 47.0171 38.8027 47.1807C38.6391 47.3442 38.4169 47.4355 38.1855 47.4355H9.68555C9.45416 47.4355 9.23201 47.3442 9.06836 47.1807C8.90476 47.0171 8.81259 46.7948 8.8125 46.5635V42.6396C8.81401 42.623 8.81683 42.6062 8.82031 42.5898C8.82672 42.5788 8.82715 42.5678 8.82715 42.5576C8.8299 42.5427 8.83315 42.5271 8.83789 42.5127C8.84074 42.5016 8.8476 42.4915 8.84766 42.4805C8.85435 42.4579 8.86259 42.4357 8.87207 42.4141C8.87617 42.4038 8.88052 42.3935 8.88574 42.3838C8.89131 42.3699 8.8978 42.3567 8.9043 42.3438L8.92188 42.3125C8.92932 42.3004 8.93694 42.2875 8.94531 42.2754L8.96289 42.248L8.97266 42.2334L15.4414 33.3447C15.5222 33.2336 15.6276 33.1425 15.75 33.0801C15.8724 33.0177 16.0082 32.9854 16.1455 32.9854H18.4404V30.2793H7.22461C6.69092 30.2785 6.1792 30.0667 5.80176 29.6895C5.42427 29.312 5.21168 28.7995 5.21094 28.2656V18.6152C5.2117 18.0814 5.42429 17.5699 5.80176 17.1924C6.17923 16.8149 6.69079 16.6023 7.22461 16.6016H40.7822ZM10.5479 43.6201V45.6904H37.3135L37.3057 43.6201H10.5479ZM16.5947 34.7305L11.3896 41.875H36.7734L31.3926 34.7305H16.5947ZM20.1855 30.2793V32.9854H28.041V30.2793H20.1855ZM7.22461 18.3477C7.1536 18.3479 7.08537 18.3756 7.03516 18.4258C6.98495 18.476 6.9573 18.5442 6.95703 18.6152V28.2656C6.95728 28.3366 6.98505 28.4049 7.03516 28.4551C7.08537 28.5053 7.1536 28.5339 7.22461 28.5342H40.7773C40.8483 28.5339 40.9166 28.5053 40.9668 28.4551C41.017 28.4048 41.0457 28.3367 41.0459 28.2656L41.0508 18.6152C41.0505 18.5442 41.0219 18.476 40.9717 18.4258C40.9215 18.3757 40.8532 18.3479 40.7822 18.3477H7.22461ZM12.2168 20.5078C13.0005 20.5078 13.7525 20.8189 14.3066 21.373C14.8608 21.9272 15.1719 22.6792 15.1719 23.4629C15.1719 24.0473 14.9985 24.6186 14.6738 25.1045C14.3491 25.5904 13.8876 25.9697 13.3477 26.1934C12.8078 26.4169 12.2137 26.4752 11.6406 26.3613C11.0674 26.2473 10.5402 25.966 10.127 25.5527C9.71369 25.1395 9.43238 24.6123 9.31836 24.0391C9.20444 23.466 9.26274 22.8719 9.48633 22.332C9.70999 21.7921 10.0892 21.3306 10.5752 21.0059C11.0611 20.6812 11.6324 20.5078 12.2168 20.5078ZM23.999 20.5078C24.7827 20.5078 25.5347 20.8189 26.0889 21.373C26.643 21.9272 26.9541 22.6792 26.9541 23.4629C26.9541 24.0473 26.7807 24.6185 26.4561 25.1045C26.1314 25.5904 25.6698 25.9697 25.1299 26.1934C24.59 26.4169 23.9959 26.4753 23.4229 26.3613C22.8498 26.2473 22.3234 25.9658 21.9102 25.5527C21.4969 25.1395 21.2146 24.6123 21.1006 24.0391C20.9867 23.466 21.0459 22.8719 21.2695 22.332C21.4932 21.7922 21.8715 21.3305 22.3574 21.0059C22.8433 20.6812 23.4146 20.5079 23.999 20.5078ZM35.7812 20.5078C36.5648 20.5078 37.3169 20.819 37.8711 21.373C38.4253 21.9272 38.7363 22.6792 38.7363 23.4629C38.7363 24.0473 38.563 24.6185 38.2383 25.1045C37.9136 25.5904 37.452 25.9697 36.9121 26.1934C36.3723 26.4168 35.7781 26.4753 35.2051 26.3613C34.632 26.2473 34.1056 25.9658 33.6924 25.5527C33.2791 25.1395 32.9978 24.6123 32.8838 24.0391C32.7698 23.4659 32.8281 22.8719 33.0518 22.332C33.2754 21.7922 33.6538 21.3305 34.1396 21.0059C34.6255 20.6812 35.197 20.5079 35.7812 20.5078ZM11.9805 22.2764C11.746 22.3231 11.5304 22.4384 11.3613 22.6074C11.1923 22.7765 11.077 22.9921 11.0303 23.2266C10.9836 23.4612 11.0081 23.7048 11.0996 23.9258C11.1912 24.1467 11.3461 24.3359 11.5449 24.4688C11.7438 24.6016 11.9777 24.6719 12.2168 24.6719C12.5374 24.6714 12.8446 24.5441 13.0713 24.3174C13.298 24.0907 13.4253 23.7835 13.4258 23.4629C13.4258 23.2238 13.3555 22.9899 13.2227 22.791C13.0898 22.5922 12.9006 22.4372 12.6797 22.3457C12.4587 22.2542 12.2151 22.2297 11.9805 22.2764ZM23.7637 22.2764C23.5293 22.323 23.3136 22.4385 23.1445 22.6074C22.9755 22.7764 22.8602 22.9922 22.8135 23.2266C22.7668 23.4612 22.7903 23.7048 22.8818 23.9258C22.9734 24.1468 23.1283 24.3359 23.3271 24.4688C23.526 24.6016 23.7599 24.6718 23.999 24.6719C24.3196 24.6714 24.6268 24.544 24.8535 24.3174C25.0802 24.0907 25.2085 23.7835 25.209 23.4629C25.209 23.2237 25.1377 22.9899 25.0049 22.791C24.872 22.5921 24.6829 22.4372 24.4619 22.3457C24.2411 22.2542 23.9981 22.2298 23.7637 22.2764ZM35.5459 22.2764C35.3114 22.323 35.0959 22.4384 34.9268 22.6074C34.7577 22.7765 34.6424 22.9921 34.5957 23.2266C34.549 23.4611 34.5726 23.7048 34.6641 23.9258C34.7556 24.1467 34.9106 24.3359 35.1094 24.4688C35.3081 24.6016 35.5422 24.6718 35.7812 24.6719C36.1018 24.6714 36.41 24.5441 36.6367 24.3174C36.8632 24.0907 36.9907 23.7834 36.9912 23.4629C36.9912 23.2237 36.92 22.9899 36.7871 22.791C36.6542 22.5922 36.4651 22.4372 36.2441 22.3457C36.0233 22.2543 35.7803 22.2298 35.5459 22.2764ZM24.0576 9.54395C25.366 9.53859 26.6617 9.80188 27.8643 10.3174C29.0669 10.8329 30.1514 11.5896 31.0498 12.541C31.2041 12.7094 31.286 12.9319 31.2783 13.1602C31.2706 13.3886 31.1733 13.6051 31.0078 13.7627C30.8424 13.9202 30.6219 14.0071 30.3936 14.0039C30.165 14.0005 29.946 13.9076 29.7852 13.7451C29.0272 12.9485 28.1118 12.3182 27.0967 11.8955C26.0815 11.4727 24.9891 11.2668 23.8896 11.29C22.7902 11.3132 21.7074 11.565 20.7109 12.0303C19.7146 12.4955 18.8262 13.1633 18.1025 13.9912C18.0284 14.0819 17.9366 14.1574 17.833 14.2119C17.7294 14.2664 17.6156 14.2989 17.499 14.3086C17.3826 14.3183 17.2653 14.305 17.1543 14.2686C17.0431 14.2319 16.9397 14.1729 16.8516 14.0957C16.7635 14.0186 16.6916 13.9247 16.6406 13.8193C16.5897 13.714 16.5605 13.5993 16.5547 13.4824C16.5489 13.3656 16.5672 13.2485 16.6074 13.1387C16.6478 13.0287 16.71 12.9272 16.79 12.8418C17.6961 11.8057 18.8132 10.9754 20.0664 10.4062C21.3198 9.8371 22.681 9.54223 24.0576 9.54199V9.54395ZM24.0576 5.02539C25.8593 5.01844 27.6437 5.38038 29.2998 6.08984C30.9559 6.79932 32.4487 7.84133 33.6865 9.15039C33.7683 9.23276 33.8334 9.33085 33.877 9.43848C33.9204 9.54599 33.942 9.6614 33.9404 9.77734C33.9388 9.89337 33.9136 10.0079 33.8672 10.1143C33.8208 10.2205 33.7538 10.3164 33.6699 10.3965C33.5859 10.4766 33.4864 10.5397 33.3779 10.5811C33.2695 10.6223 33.154 10.6416 33.0381 10.6377C32.9221 10.6338 32.8076 10.6071 32.7021 10.5586C32.5968 10.5101 32.5022 10.4409 32.4238 10.3555C31.3482 9.21712 30.0508 8.31046 28.6113 7.69336C27.1719 7.07626 25.6208 6.76174 24.0547 6.76758C22.4529 6.77002 20.8693 7.10457 19.4033 7.75C17.9374 8.39545 16.6205 9.33778 15.5371 10.5176C15.3806 10.6879 15.1627 10.7889 14.9316 10.7988C14.7006 10.8087 14.4752 10.7266 14.3047 10.5703C14.1342 10.4139 14.0325 10.196 14.0225 9.96484C14.0125 9.73363 14.0946 9.50746 14.251 9.33691C15.4987 7.97956 17.0144 6.89542 18.7021 6.15332C20.39 5.41122 22.2138 5.02723 24.0576 5.02539ZM24 0.558594C26.2968 0.550627 28.572 1.00707 30.6885 1.89941C32.8049 2.79176 34.7196 4.10194 36.3174 5.75195C36.3973 5.83423 36.4605 5.93148 36.5029 6.03809C36.5453 6.14458 36.566 6.25845 36.5645 6.37305C36.5628 6.48783 36.5386 6.6016 36.4932 6.70703C36.4478 6.81245 36.3821 6.90826 36.2998 6.98828C36.2175 7.06822 36.1203 7.13142 36.0137 7.17383C35.907 7.21624 35.7925 7.23696 35.6777 7.23535C35.5631 7.23368 35.45 7.2094 35.3447 7.16406C35.2393 7.11865 35.1435 7.05301 35.0635 6.9707C33.6298 5.48866 31.9114 4.31158 30.0117 3.50977C28.112 2.70798 26.0698 2.29803 24.0078 2.30469C21.9459 2.31138 19.9062 2.73382 18.0117 3.54785C16.1172 4.36192 14.4065 5.55073 12.9824 7.04199C12.9011 7.12702 12.8035 7.19501 12.6953 7.24121C12.5869 7.28746 12.4695 7.31074 12.3516 7.31055C12.1809 7.3107 12.0137 7.26085 11.8711 7.16699C11.7286 7.07308 11.6171 6.93909 11.5498 6.78223C11.4826 6.62532 11.4629 6.45218 11.4932 6.28418C11.5235 6.11618 11.6019 5.96043 11.7197 5.83691C13.306 4.17583 15.2121 2.85231 17.3223 1.94531C19.4322 1.03848 21.7035 0.566617 24 0.558594Z","container":"M28.0996 2.15039C29.0421 2.15039 29.9687 2.39557 30.7881 2.86133C30.8097 2.87364 30.8314 2.8863 30.8525 2.89941L43.4531 10.6992L43.5996 10.7998C44.262 11.2966 44.947 12.0752 45.415 13.0195C45.456 13.0758 45.4946 13.1347 45.5303 13.1963C45.6699 13.4371 45.7532 13.6952 45.7852 13.9551C45.9212 14.4144 46 14.8991 46 15.3994V28.3994C46 29.3711 45.6361 30.3247 45.1973 31.0674C44.7499 31.8244 44.0838 32.6021 43.2285 33.1152C43.2214 33.1195 43.2142 33.1237 43.207 33.1279L22.6064 45.1279C22.6004 45.1314 22.594 45.1352 22.5879 45.1387C21.7687 45.6043 20.8426 45.8495 19.9004 45.8496C18.9579 45.8496 18.0313 45.6044 17.2119 45.1387C17.1903 45.1264 17.1686 45.1137 17.1475 45.1006L4.54688 37.3008C4.4965 37.2696 4.4478 37.2357 4.40039 37.2002C3.70653 36.6798 3.13636 35.9261 2.74414 35.207C2.35937 34.5015 2 33.5624 2 32.5996V19.3994C2.00004 18.9216 2.07536 18.443 2.21387 17.9814C2.2453 17.6937 2.33822 17.4079 2.50098 17.1455C2.54751 17.0705 2.59994 17.0012 2.6543 16.9346C3.16563 16.0091 3.94745 15.235 4.89941 14.8086L25.3936 2.87207L25.4121 2.86133C26.2314 2.39569 27.1573 2.15046 28.0996 2.15039ZM6 32.5996C6.00012 32.5996 6.00268 32.6693 6.04688 32.8115C6.09024 32.9509 6.16056 33.1173 6.25586 33.292C6.44316 33.6354 6.65015 33.8685 6.7666 33.9697L18 40.9229V29.1113L6 21.6689V32.5996ZM22 29.1523V40.8525L26 38.5225V26.833L22 29.1523ZM30 24.5137V36.1924L34 33.8613V22.1943L30 24.5137ZM38 19.874V31.5312L41.1709 29.6846C41.3156 29.5977 41.5503 29.3751 41.7529 29.0322C41.847 28.8731 41.9149 28.7206 41.9561 28.5928C41.9975 28.4643 41.9999 28.3994 42 28.3994V17.5547L38 19.874ZM28.0996 6.15039C27.8503 6.15046 27.6054 6.21566 27.3887 6.33887L27.3877 6.33789L7.52539 17.9082L20.0352 25.667L40.6875 13.6924L28.7969 6.33203C28.5834 6.21383 28.3438 6.15039 28.0996 6.15039Z","other":"M41.85,2.18H6.15c-2.15,0-3.9,1.75-3.9,3.9v25.71c0,2.15,1.75,3.9,3.9,3.9h1.38c.96,0,1.75-.79,1.75-1.75s-.79-1.75-1.75-1.75h-1.38c-.22,0-.4-.18-.4-.4v-15.46h36.5v15.46c0,.22-.18.4-.4.4h-1.43c-.96,0-1.75.79-1.75,1.75s.79,1.75,1.75,1.75h1.43c2.15,0,3.9-1.75,3.9-3.9V6.08c0-2.15-1.75-3.9-3.9-3.9ZM42.25,12.82H5.75v-6.74c0-.22.18-.4.4-.4h35.71c.22,0,.4.18.4.4v6.74h0ZM24.01,27.49c-1.08,0-2.13.32-3.03.92s-1.59,1.45-2.01,2.45-.52,2.09-.31,3.15c.21,1.06.73,2.02,1.49,2.79.77.76,1.73,1.28,2.79,1.49,1.04.21,2.15.1,3.15-.31s1.84-1.11,2.45-2.01c.6-.9.92-1.95.92-3.03,0-1.46-.57-2.82-1.6-3.85-1.03-1.03-2.4-1.6-3.85-1.6ZM25.41,34.34c-.37.37-.89.56-1.41.56-.38,0-.76-.1-1.08-.32-.33-.22-.58-.53-.73-.89s-.19-.76-.11-1.14c.08-.38.26-.73.54-1.01.28-.28.63-.46,1.01-.54.39-.08.78-.04,1.14.11.36.15.67.4.88.72.22.33.33.71.33,1.1,0,.52-.21,1.03-.58,1.4h.01ZM10.82,7.5c-.96,0-1.75.79-1.75,1.75s.79,1.75,1.75,1.75,1.75-.79,1.75-1.75-.79-1.75-1.75-1.75ZM34.6,33.42c-.11-.13-.17-.3-.17-.48s.06-.35.18-.48l1.58-1.78c.25-.28.4-.62.44-.98.04-.37-.04-.73-.23-1.05l-2.47-4.28c-.18-.32-.46-.57-.8-.72-.33-.15-.7-.19-1.06-.12l-2.33.47c-.18.03-.36,0-.51-.08-.16-.09-.28-.23-.33-.4l-.75-2.27c-.12-.35-.34-.64-.63-.85-.32-.23-.67-.34-1-.33h-4.92c-.38-.02-.76.08-1.08.3-.32.21-.55.53-.68.9l-.68,2.24c-.06.18-.18.32-.33.41s-.33.12-.52.08l-2.43-.48c-.33-.05-.67,0-.98.16-.31.15-.57.39-.75.69l-2.47,4.27c-.19.32-.28.68-.25,1.05.03.37.18.71.42.99l1.57,1.78c.12.13.18.31.18.49s-.06.35-.18.49l-1.58,1.79c-.24.28-.38.62-.42.99-.03.37.05.72.24,1.03l2.48,4.28c.18.32.46.57.79.72s.7.19,1.06.12l2.33-.47s.1-.01.15-.01c.13,0,.26.03.37.1.16.09.27.23.33.4l.76,2.27c.12.36.36.67.67.88.28.19.63.3.95.3h5.04c.37,0,.72-.11,1.01-.33.3-.21.52-.51.63-.86l.75-2.26c.06-.17.18-.32.33-.4.16-.09.34-.12.52-.08l2.32.47c.36.08.73.04,1.06-.12.34-.15.61-.4.8-.72l2.47-4.28c.18-.31.26-.69.23-1.05-.04-.37-.19-.71-.45-.99l-1.67-1.78v-.02ZM32.01,35.75l.75.84-1.22,2.12-1.11-.22c-1.01-.21-2.06-.04-2.96.48-.89.52-1.56,1.34-1.89,2.32l-.35,1.05h-2.44l-.34-1.07c-.32-.98-.99-1.8-1.89-2.32-.89-.52-1.94-.69-2.96-.48l-1.11.23-1.24-2.11.75-.84c.69-.77,1.07-1.77,1.07-2.81s-.38-2.03-1.07-2.81l-.75-.84,1.22-2.1,1.11.23c1.01.21,2.06.03,2.96-.48.89-.52,1.56-1.34,1.89-2.32l.36-1.06h2.45l.35,1.07c.32.98.99,1.81,1.89,2.33.89.51,1.94.69,2.96.48l1.11-.23,1.22,2.12-.75.84c-.68.77-1.06,1.76-1.06,2.79s.38,2.02,1.06,2.79h-.01ZM16.44,7.5c-.96,0-1.75.79-1.75,1.75s.79,1.75,1.75,1.75,1.75-.79,1.75-1.75-.79-1.75-1.75-1.75Z"};
/* the help card's distro row — simple-icons (CC0 1.0, so no attribution needed), 24 grid; the
   product ships no Linux-distro marks and the live card draws these six plus a "+1" */
const DP_DISTRO = {"ubuntu":["Ubuntu","M17.61.455a3.41 3.41 0 0 0-3.41 3.41a3.41 3.41 0 0 0 3.41 3.41a3.41 3.41 0 0 0 3.41-3.41a3.41 3.41 0 0 0-3.41-3.41M12.92.8C8.923.777 5.137 2.941 3.148 6.451a5 5 0 0 1 .26-.007a4.9 4.9 0 0 1 2.585.737A8.32 8.32 0 0 1 12.688 3.6A4.94 4.94 0 0 1 13.723.834A11 11 0 0 0 12.92.8m9.226 4.994a4.9 4.9 0 0 1-1.918 2.246a8.36 8.36 0 0 1-.273 8.303a4.9 4.9 0 0 1 1.632 2.54a11.16 11.16 0 0 0 .559-13.089M3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409a3.41 3.41 0 0 0 3.41-3.41a3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.9 4.9 0 0 1-2.915.358a11.1 11.1 0 0 0 7.991 6.698a11.2 11.2 0 0 0 2.422.249a4.88 4.88 0 0 1-.999-2.85a9 9 0 0 1-.836-.136a8.3 8.3 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41a3.41 3.41 0 0 0 3.41 3.41a3.41 3.41 0 0 0 3.41-3.41a3.41 3.41 0 0 0-3.41-3.41"],"redhat":["RedHat","M16.009 13.386c1.577 0 3.86-.326 3.86-2.202a1.8 1.8 0 0 0-.04-.431l-.94-4.08c-.216-.898-.406-1.305-1.982-2.093c-1.223-.625-3.888-1.658-4.676-1.658c-.733 0-.947.946-1.822.946c-.842 0-1.467-.706-2.255-.706c-.757 0-1.25.515-1.63 1.576c0 0-1.06 2.99-1.197 3.424a.8.8 0 0 0-.028.245c0 1.162 4.577 4.974 10.71 4.974m4.101-1.435c.218 1.032.218 1.14.218 1.277c0 1.765-1.984 2.745-4.593 2.745c-5.895.004-11.06-3.451-11.06-5.734a2.3 2.3 0 0 1 .19-.925C2.746 9.415 0 9.794 0 12.217c0 3.969 9.405 8.861 16.851 8.861c5.71 0 7.149-2.582 7.149-4.62c0-1.605-1.387-3.425-3.887-4.512"],"centos":["CentOS","M12.076.066L8.883 3.28H3.348v5.434L0 12.01l3.349 3.298v5.39h5.374l3.285 3.236l3.285-3.236h5.43v-5.374L24 12.026l-3.232-3.252V3.321H15.31zm0 .749l2.49 2.506h-1.69v6.441l-.8.805l-.81-.815V3.28H9.627zm-8.2 2.991h4.483L6.485 5.692l4.253 4.279v.654H9.94L5.674 6.423l-1.798 1.77zm5.227 0h1.635v5.415l-3.509-3.53zm4.302.043h1.687l1.83 1.842l-3.517 3.539zm2.431 0h4.404v4.394l-1.83-1.842l-4.241 4.267h-.764v-.69l4.261-4.287zm2.574 3.3l1.83 1.843v1.676h-5.327zm-12.735.013l3.515 3.462H3.876v-1.69zM3.348 9.454v1.697h6.377l.871.858l-.782.77H3.35v1.786L.753 12.01zm17.42.068l2.488 2.503l-2.533 2.55v-1.796h-6.41l-.75-.754l.825-.83h6.38zm-9.502.978l.81.815l.186-.188l.614-.618v.686h.768l-.825.83l.75.754h-.719v.808l-.842-.83l-.741.73v-.707h-.7l.781-.77l-.188-.186l-.682-.672h.788zm-7.39 2.807h5.402l-3.603 3.55l-1.798-1.772zm6.154 0h.708v.7l-4.404 4.338l1.852 1.824h-4.31v-4.342l1.798 1.77zm3.348 0h.715l4.317 4.343l.186-.187l1.599-1.61v4.316h-4.366l1.853-1.825l-.188-.185l-4.116-4.054zm1.46 0h5.357v1.798l-1.785 1.796zm-2.83.191l.842.829v6.37h1.691l-2.532 2.495l-2.533-2.495h1.79V14.23zm-1.27 1.251v5.42H8.939l-1.852-1.823zm2.64.097l3.552 3.499l-1.853 1.825h-1.7z"],"opensuse":["SUSE","M10.724 0a12 12 0 0 0-9.448 4.623c1.464.391 2.5.727 2.81.832c.005-.19.037-1.893.037-1.893s.004-.04.025-.06c.026-.026.065-.018.065-.018c.385.056 8.602 1.274 12.066 3.292c.427.25.638.517.902.786c.958.99 2.223 5.108 2.359 5.957c.005.033-.036.07-.054.083a5 5 0 0 1-.313.228c-.82.55-2.708 1.872-5.13 1.656c-2.176-.193-5.018-1.44-8.445-3.699q.503 1.185 1 2.371c.497.258 5.287 2.7 7.651 2.651c1.904-.04 3.941-.968 4.756-1.458c0 0 .179-.108.257-.048c.085.066.061.167.041.27c-.05.234-.164.66-.242.863l-.065.165c-.093.25-.183.482-.356.625c-.48.436-1.246.784-2.446 1.305c-1.855.812-4.865 1.328-7.66 1.31c-1.001-.022-1.968-.133-2.817-.232c-1.743-.197-3.161-.357-4.026.269A12 12 0 0 0 10.724 24a12 12 0 0 0 12-12a12 12 0 0 0-12-12M13.4 6.963a3.5 3.5 0 0 0-2.521.942a3.5 3.5 0 0 0-1.114 2.449a3.53 3.53 0 0 0 3.39 3.64a3.48 3.48 0 0 0 2.524-.946a3.5 3.5 0 0 0 1.114-2.446a3.527 3.527 0 0 0-3.393-3.64zm-.03 1.035a2.46 2.46 0 0 1 2.368 2.539a2.43 2.43 0 0 1-.774 1.706a2.46 2.46 0 0 1-1.762.659a2.46 2.46 0 0 1-2.364-2.542c.02-.655.3-1.26.777-1.707a2.42 2.42 0 0 1 1.756-.655zm.402 1.23c-.602 0-1.087.325-1.087.727c0 .4.485.725 1.087.725c.6 0 1.088-.326 1.088-.725c0-.402-.487-.726-1.088-.726Z"],"fedora":["Fedora","M12.001 0C5.376 0 .008 5.369.004 11.992H.002v9.287h.002A2.726 2.726 0 0 0 2.73 24h9.275c6.626-.004 11.993-5.372 11.993-11.997C23.998 5.375 18.628 0 12 0zm2.431 4.94c2.015 0 3.917 1.543 3.917 3.671c0 .197.001.395-.03.619a1 1 0 0 1-1.137.893a1 1 0 0 1-.842-1.175a3 3 0 0 0 .013-.337c0-1.207-.987-1.672-1.92-1.672c-.934 0-1.775.784-1.777 1.672c.016 1.027 0 2.046 0 3.07l1.732-.012c1.352-.028 1.368 2.009.016 1.998l-1.748.013c-.004.826.006.677.002 1.093c0 0 .015 1.01-.016 1.776c-.209 2.25-2.124 4.046-4.424 4.046c-2.438 0-4.448-1.993-4.448-4.437c.073-2.515 2.078-4.492 4.603-4.469l1.409-.01v1.996l-1.409.013h-.007c-1.388.04-2.577.984-2.6 2.47a2.44 2.44 0 0 0 2.452 2.439c1.356 0 2.441-.987 2.441-2.437l-.001-7.557c0-.14.005-.252.02-.407c.23-1.848 1.883-3.256 3.754-3.256"],"debian":["Debian","M13.88 12.685c-.4 0 .08.2.601.28c.14-.1.27-.22.39-.33a3 3 0 0 1-.99.05m2.14-.53c.23-.33.4-.69.47-1.06c-.06.27-.2.5-.33.73c-.75.47-.07-.27 0-.56c-.8 1.01-.11.6-.14.89m.781-2.05c.05-.721-.14-.501-.2-.221c.07.04.13.5.2.22M12.38.31c.2.04.45.07.42.12c.23-.05.28-.1-.43-.12m.43.12l-.15.03l.14-.01V.43m6.633 9.944c.02.64-.2.95-.38 1.5l-.35.181c-.28.54.03.35-.17.78c-.44.39-1.34 1.22-1.62 1.301c-.201 0 .14-.25.19-.34c-.591.4-.481.6-1.371.85l-.03-.06c-2.221 1.04-5.303-1.02-5.253-3.842c-.03.17-.07.13-.12.2a3.55 3.55 0 0 1 2.001-3.501a3.36 3.36 0 0 1 3.732.48a3.34 3.34 0 0 0-2.721-1.3c-1.18.01-2.281.76-2.651 1.57c-.6.38-.67 1.47-.93 1.661c-.361 2.601.66 3.722 2.38 5.042c.27.19.08.21.12.35a4.7 4.7 0 0 1-1.53-1.16c.23.33.47.66.8.91c-.55-.18-1.27-1.3-1.48-1.35c.93 1.66 3.78 2.921 5.261 2.3a6.2 6.2 0 0 1-2.33-.28c-.33-.16-.77-.51-.7-.57a5.802 5.803 0 0 0 5.902-.84c.44-.35.93-.94 1.07-.95c-.2.32.04.16-.12.44c.44-.72-.2-.3.46-1.24l.24.33c-.09-.6.74-1.321.66-2.262c.19-.3.2.3 0 .97c.29-.74.08-.85.15-1.46c.08.2.18.42.23.63c-.18-.7.2-1.2.28-1.6c-.09-.05-.28.3-.32-.53c0-.37.1-.2.14-.28c-.08-.05-.26-.32-.38-.861c.08-.13.22.33.34.34c-.08-.42-.2-.75-.2-1.08c-.34-.68-.12.1-.4-.3c-.34-1.091.3-.25.34-.74c.54.77.84 1.96.981 2.46c-.1-.6-.28-1.2-.49-1.76c.16.07-.26-1.241.21-.37A7.82 7.82 0 0 0 17.702 1.6c.18.17.42.39.33.42c-.75-.45-.62-.48-.73-.67c-.61-.25-.65.02-1.06 0C15.082.73 14.862.8 13.8.4l.05.23c-.77-.25-.9.1-1.73 0c-.05-.04.27-.14.53-.18c-.741.1-.701-.14-1.431.03c.17-.13.36-.21.55-.32c-.6.04-1.44.35-1.18.07C9.6.68 7.847 1.3 6.867 2.22L6.838 2c-.45.54-1.96 1.611-2.08 2.311l-.131.03c-.23.4-.38.85-.57 1.261c-.3.52-.45.2-.4.28c-.6 1.22-.9 2.251-1.16 3.102c.18.27 0 1.65.07 2.76c-.3 5.463 3.84 10.776 8.363 12.006c.67.23 1.65.23 2.49.25c-.99-.28-1.12-.15-2.08-.49c-.7-.32-.85-.7-1.34-1.13l.2.35c-.971-.34-.57-.42-1.361-.67l.21-.27c-.31-.03-.83-.53-.97-.81l-.34.01c-.41-.501-.63-.871-.61-1.161l-.111.2c-.13-.21-1.52-1.901-.8-1.511c-.13-.12-.31-.2-.5-.55l.14-.17c-.35-.44-.64-1.02-.62-1.2c.2.24.32.3.45.33c-.88-2.172-.93-.12-1.601-2.202l.15-.02c-.1-.16-.18-.34-.26-.51l.06-.6c-.63-.74-.18-3.102-.09-4.402c.07-.54.53-1.1.88-1.981l-.21-.04c.4-.71 2.341-2.872 3.241-2.761c.43-.55-.09 0-.18-.14c.96-.991 1.26-.7 1.901-.88c.7-.401-.6.16-.27-.151c1.2-.3.85-.7 2.421-.85c.16.1-.39.14-.52.26c1-.49 3.151-.37 4.562.27c1.63.77 3.461 3.011 3.531 5.132l.08.02c-.04.85.13 1.821-.17 2.711l.2-.42M9.54 13.236l-.05.28c.26.35.47.73.8 1.01c-.24-.47-.42-.66-.75-1.3m.62-.02c-.14-.15-.22-.34-.31-.52c.08.32.26.6.43.88zm10.945-2.382l-.07.15c-.1.76-.34 1.511-.69 2.212c.4-.73.65-1.541.75-2.362M12.45.12c.27-.1.66-.05.95-.12c-.37.03-.74.05-1.1.1zM3.006 5.142c.07.57-.43.8.11.42c.3-.66-.11-.18-.1-.42m-.64 2.661c.12-.39.15-.62.2-.84c-.35.44-.17.53-.2.83"]};
/* ═══════════════════════════════════════════════════════════════════════════════
   DISCOVERY SETTINGS › DISCOVERY PROFILE  —  cloned from the live product, build 10.0.1,
   25 Sep 2026, read in the browser at /settings/network-discovery/network-discovery-profiles,
   its /create screen, a row's Schedule / Delete / Edit actions and a profile's /result page.
   Namespace `dp` — registered into the st* Settings module through ST_PAGES, like `stc`.
   It borrows the stc* list chrome (search · squares · chips · grid · pager · popovers ·
   drawer · confirm) so the two grid pages cannot drift apart, and adds only what this
   screen has and Compliance does not: the type rail, the per-type form, the help card, the
   result grid.
   ⚠️ EVERY IP / HOST / PERSON IN `DP_ROWS0` IS SCRUBBED — RFC 5737 ranges, example.com,
   neutral names (the repo's publish rule). The live list carried 10.20.x / 172.16.x and
   two people's PCs. Types, counts and run times are the instance's own.
   ═══════════════════════════════════════════════════════════════════════════ */

/* the type rail (the live left column of /create): category → sub-types. A category with no
   `kids` is itself the type (Network · Storage · Database · Service Check, live: no chevron). */
const DP_TREE = [
  {n:'Server', ic:'server', kids:['Linux / Unix','Windows']},
  {n:'Cloud', ic:'cloud', kids:['AWS Cloud','Azure Cloud','Office 365','Oracle Cloud','Google Cloud']},
  {n:'Network', ic:'network'},
  {n:'SDN', ic:'sdn', kids:['Cisco Catalyst SD-WAN','Cisco Meraki','Cisco ACI','VMware NSX-T']},
  {n:'Virtualization', ic:'virtualization', kids:['VMWare','Hyper-V','Citrix Xen','Proxmox VE','KVM']},
  {n:'HCI', ic:'hci', kids:['Nutanix']},
  {n:'Storage', ic:'storage'},
  {n:'Database', ic:'database'},
  {n:'Service Check', ic:'service-check'},
  {n:'Wireless', ic:'wireless', kids:['Cisco Wireless','Aruba Wireless','Ruijie Wireless','Ruckus Wireless','Extreme Wireless']},
  {n:'Container Orchestration', ic:'container', kids:['Kubernetes','Tanzu Kubernetes','OpenShift']},
  {n:'Other', ic:'other', kids:['IBM Tape Library','Backup','Ping']}
];

/* ── the form, per type — measured off /create by picking each type in the rail ─────────────
   Every field is [key, label, kind, opts]. kinds: name · seg (radio buttons) · target (the
   IP/Host | IP Range | CSV | CIDR pair) · ip · text · num · pick (single) · multi · tags · sw
   (switch) · notify. `sec` names the "Discovery Parameters of X" heading a type prints; `top`
   is an extra segmented row the live form puts beside the name (Windows / Windows Cluster,
   VCenter / ESX / ESXi). ⚠️ THE FIELD ORDER IS THE LIVE ONE, row by row. */
const DP_COMMON_HEAD = [['name','Discovery Profile Name','name',{req:1, ph:'Must be unique'}]];
const DP_COLLECT = [['ctype','Collector Type','pick',{opts:['Collector','Edge Collector'], val:'Collector'}],
                    ['coll','Collectors','multi',{opts:['motadata'], ph:'Select', info:'Leave empty and the Master picks a healthy Collector'}]];
const DP_GROUPS  = ['groups','Groups','multi',{req:1, ph:'Select', src:'groups'}];
const DP_CRED    = ['cred','Credential Profiles','multi',{req:1, ph:'Select', src:'creds', create:1}];
const DP_TAGS    = ['tags','Tags','tags',{ph:'Add Tags'}];
const DP_PING    = ['ping','Ping Check','sw',{val:true}];
const DP_NOTIFY  = ['notify','Notify','notify',{ph:'@User or Email or /Handle or #User Profile or Mobile Number'}];
const DP_TARGET  = ['target','IP/Host','target',{req:1}];
const dpF = (o) => Object.assign({sec:'Discovery Parameters', top:null, head:[], grid:[], params:[], extra:[]}, o);
const DP_FORMS = {
  'Linux / Unix': dpF({sec:'Discovery Parameters of Linux', grid:[DP_TARGET, ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['port','Port','num',{req:1, val:22}], DP_PING]}),
  'Windows': dpF({sec:'Discovery Parameters of Windows', top:['wkind','Windows','seg',{opts:['Windows','Windows Cluster'], val:'Windows'}],
    grid:[DP_TARGET, ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:5985}], DP_PING]}),
  'AWS Cloud': dpF({sec:'Discovery Parameters Of AWS Cloud', grid:[...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['down','Discover Down instances','sw',{val:false}], DP_PING, ['regions','Regions','multi',{req:1, ph:'Select', opts:['us-east-1','us-east-2','us-west-1','us-west-2','eu-west-1','eu-central-1','ap-south-1','ap-southeast-1']}],
            ['res','Resources to be Monitored','multi',{ph:'Select', opts:['EC2','RDS','S3','ELB','Lambda','DynamoDB','CloudFront','EKS']}]]}),
  'Azure Cloud': dpF({sec:'Discovery Parameters Of Azure Cloud', grid:[...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['down','Discover Down instances','sw',{val:false}], DP_PING, ['res','Resources to be Monitored','multi',{ph:'Select', opts:['Virtual Machines','SQL Database','Storage Account','App Service','AKS','Load Balancer']}]]}),
  'Office 365': dpF({sec:'Discovery Parameters Of Office 365', grid:[...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[]}),
  'Oracle Cloud': dpF({sec:'Discovery Parameters Of Oracle Cloud', grid:[...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['down','Discover Down instances','sw',{val:false}], DP_PING, ['regions','Regions','multi',{req:1, ph:'Select', opts:['us-ashburn-1','us-phoenix-1','uk-london-1','eu-frankfurt-1','ap-mumbai-1']}]]}),
  'Google Cloud': dpF({sec:'Discovery Parameters Of Google Cloud', grid:[...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['down','Discover Down instances','sw',{val:false}], DP_PING, ['res','Resources to be Monitored','multi',{ph:'Select', opts:['Compute Engine','Cloud SQL','Cloud Storage','GKE','Load Balancing']}]]}),
  'Network': dpF({sec:'Discovery Parameters', grid:[DP_TARGET, ...DP_COLLECT, DP_GROUPS, DP_CRED, ['ncm','Network Config Management','sw',{val:false}], DP_TAGS],
    params:[['port','SNMP Port','num',{req:1, val:161}], ['retry','Retry Count','num',{req:1, val:2}], DP_PING, ['ifd','Interface Discovery','sw',{val:true}]],
    extra:[['Topology', [['topo','Run Topology','sw',{val:false}]]]]}),
  'Cisco Catalyst SD-WAN': dpF({sec:'Discovery Parameters of Cisco Catalyst SD-WAN', grid:[['url','URL Endpoint','text',{req:1, ph:'Enter text'}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['retry','Retry Count','num',{req:1, val:2}], DP_PING]}),
  'Cisco Meraki': dpF({sec:'Discovery Parameters of Cisco Meraki', grid:[['url','URL Endpoint','text',{req:1, ph:'Enter text'}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['retry','Retry Count','num',{req:1, val:2}], DP_PING]}),
  'Cisco ACI': dpF({sec:'Discovery Parameters of Cisco ACI', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:443}], DP_PING]}),
  'VMware NSX-T': dpF({sec:'Discovery Parameters of VMware NSX-T', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:443}], DP_PING]}),
  'VMWare': dpF({sec:'Discovery Parameters of VMWare', top:['vkind','VCenter','seg',{opts:['VCenter','ESX','ESXi'], val:'VCenter'}],
    grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:443}], DP_PING]}),
  'Hyper-V': dpF({sec:'Discovery Parameters of Hyper-V', top:['hkind','Hyper-V','seg',{opts:['Hyper-V','Hyper-V Cluster'], val:'Hyper-V'}],
    grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:5985}], DP_PING]}),
  'Citrix Xen': dpF({sec:'Discovery Parameters of Citrix Xen', top:['ckind','Citrix Xen','seg',{opts:['Citrix Xen','Citrix Xen Cluster'], val:'Citrix Xen'}],
    grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:443}], DP_PING]}),
  'Proxmox VE': dpF({sec:'Discovery Parameters of Proxmox VE', top:['pkind','Proxmox VE','seg',{opts:['Proxmox VE','Proxmox VE Cluster'], val:'Proxmox VE'}],
    grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:8006}], DP_PING]}),
  'KVM': dpF({sec:'Discovery Parameters of KVM', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:22}], DP_PING]}),
  'Nutanix': dpF({sec:'Discovery Parameters of Prism', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['urlt','URL Type','seg',{req:1, opts:['HTTP','HTTPS'], val:'HTTPS'}], ['port','Port','num',{req:1, val:9440}], DP_PING]}),
  'Storage': dpF({sec:'Discovery Parameters of Storage', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, ['vendor','Vendor','pick',{req:1, ph:'Select', opts:['Dell EMC','HPE','Fibrenetix','NetApp','Pure Storage','IBM']}], ['model','Device Model','pick',{req:1, ph:'Select', opts:['Dell PowerVault ME5','Dell EMC Unity','HPE MSA 2060','Fibrenetix E88']}], DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['urlt','URL Type','seg',{req:1, opts:['HTTP','HTTPS'], val:'HTTPS'}], ['port','Port','num',{req:1, val:443}], DP_PING]}),
  'Database': dpF({sec:'Discovery Parameters of Database', grid:[['dbt','Database Type','pick',{req:1, ph:'Select', opts:['Oracle','MySQL','MSSQL','PostgreSQL','IBM Db2','MariaDB','SAP HANA','MongoDB']}], ['ip','Scan IP/Host','ip',{req:1}], ['svc','Database Service Name','text',{req:1, ph:'Database Service Name'}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS],
    params:[['port','Port','num',{req:1, val:1521}]]}),
  'Service Check': dpF({sec:'Discovery Parameters of Ping', grid:[['sct','Type','pick',{req:1, ph:'Select', opts:['Ping','Port','URL','DNS','Domain','Certificate','Email']}], ...DP_COLLECT, ['src','Source','sw',{val:false}], DP_GROUPS, ['tt','Target Type','seg',{req:1, opts:['Monitor','IP/Host','IP Range','CSV','CIDR'], val:'Monitor', wide:1}], ['tgt','Target','multi',{req:1, ph:'Select', src:'monitors'}], DP_TAGS],
    params:[['retry','Retry Count','num',{req:1, val:1}]]}),
  'Cisco Wireless': dpF({sec:'Discovery Parameters of Cisco Wireless', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Aruba Wireless': dpF({sec:'Discovery Parameters of Aruba Wireless', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Ruijie Wireless': dpF({sec:'Discovery Parameters of Ruijie Wireless', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Ruckus Wireless': dpF({sec:'Discovery Parameters of Ruckus Wireless', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Extreme Wireless': dpF({sec:'Discovery Parameters of Extreme Wireless', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Kubernetes': dpF({sec:'Discovery Parameters', grid:[['ip','IP/Host','ip',{req:1, ph:'e.g. 192.168.1.1 or localhost'}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:22}], DP_PING]}),
  'Tanzu Kubernetes': dpF({sec:'Discovery Parameters of Tanzu Kubernetes', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:6443}], DP_PING]}),
  'OpenShift': dpF({sec:'Discovery Parameters of OpenShift', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:6443}], DP_PING]}),
  'IBM Tape Library': dpF({sec:'Discovery Parameters of IBM Tape Library', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:161}], DP_PING]}),
  'Backup': dpF({sec:'Discovery Parameters of Backup', grid:[['ip','IP/Host','ip',{req:1}], ...DP_COLLECT, DP_GROUPS, DP_CRED, DP_TAGS], params:[['port','Port','num',{req:1, val:443}], DP_PING]}),
  'Ping': dpF({sec:'Discovery Parameters of Ping', grid:[DP_TARGET, ...DP_COLLECT, DP_GROUPS, DP_TAGS], params:[['retry','Retry Count','num',{req:1, val:1}]]})
};
/* ⚠️ MEASURED vs READ: Linux · Windows · Network · AWS Cloud · VMWare · Database · Service Check
   · Storage · Ping · Cisco Wireless · Nutanix · Kubernetes · Cisco Meraki were each picked on the
   live rail and their fields dumped — those entries are the product's. The other seventeen types
   were NOT opened (a customer instance is not a place to click every tile) and are built on the
   nearest measured sibling (a wireless vendor like Cisco Wireless, a cloud like AWS, a
   virtualisation host like VMWare); their default ports are the protocols' well-known ones.
   The `opts` lists behind Regions / Resources / Vendor / Device Model / Database Type / Type are
   readings too — the live pickers were not opened for those. Say which when it matters. */

/* the pickers, as the live popovers list them (Groups: 39 entries + Select All; Credential
   Profiles: 14, names scrubbed; Collectors: the one collector on the instance) */
const DP_GROUPS_ALL = ['Oracle WebLogic','Database','Server','Other','Wireless','Virtualization','Network','Default','Cloud','Service Check','HAProxy','Nginx','Light Httpd','Microsoft IIS','Exchange Mailbox','Exchange Mailbox Role','Exchange Client Access Role','Exchange Edge Transport Role','Active Directory','Bind9','IBM WebSphere','WildFly','Linux DHCP','IBM MQ','Windows DNS','Windows DHCP','IBM Db2','Windows RDP','Apache HTTP','SAP MaxDB','Zimbra','Storage','Container Orchestration','Apache Tomcat','MSMQ','RabbitMQ','HCI','SDN'];
const DP_CREDS0 = [
  {id:1, n:'kvmcred', p:'SSH', u:'root'}, {id:2, n:'Firewall_VM', p:'SNMP v2c', u:'public'}, {id:3, n:'192.0.2.112', p:'HTTPS', u:'manage'},
  {id:4, n:'Edge_Firewall', p:'SNMP v2c', u:'public'}, {id:5, n:'ops-admin', p:'WinRM', u:'administrator'}, {id:6, n:'linux creds-4', p:'SSH', u:'observe'},
  {id:7, n:'ibm_ubuntu', p:'SSH', u:'ubuntu'}, {id:8, n:'198.51.100.71', p:'SSH', u:'root'}, {id:9, n:'tryyy', p:'SSH', u:'test'},
  {id:10, n:'Analyst PC', p:'WinRM', u:'analyst'}, {id:11, n:'linux creds-2', p:'SSH', u:'observe'}, {id:12, n:'linux creds-3', p:'SSH', u:'observe'},
  {id:13, n:'linux creds-1', p:'SSH', u:'observe'}, {id:14, n:'203.0.113.71', p:'SSH', u:'root'}
];
const DP_COLLECTORS = ['motadata'];
/* the category a type is filed under, for the Groups default (live: picking Linux pre-fills
   Groups with "Server") */
const dpCatOf = t => (DP_TREE.find(c => c.n === t || (c.kids || []).includes(t)) || {}).n || '';

/* ── the Discovery Help Card — the live text for Linux / Unix, section by section ────────────
   ⚠️ ONLY THE LINUX CARD WAS HARVESTED. Every other type shows the same four headings with the
   Linux body under them and says so in a note under the title — a customer instance is not a
   place to open thirty help cards, and inventing thirty would be inventing documentation. */
const DP_HELP = [
  {t:'Supported Platforms', open:true, b:[
    ['p','Motadata ObserveOps works smoothly across all modern Linux environments.'],
    ['ul',[['b','Linux Flavor:',' Debian, Ubuntu, Fedora, SUSE, RHEL, CentOS, PhotonOS'],['b','Unix Flavor:',' IBM-AIX, IBM AS/400, HP-UX, Solaris']]]]},
  {t:'Network & Connectivity Requirements', open:true, b:[
    ['p','Use the following diagnostic steps to validate Master/Collector connectivity with Linux targets.'],
    ['h','1. Ping / ICMP Verification (If Ping Check Is Enabled)'],
    ['p2','If Ping Check is enabled in the Discovery Profile, confirm ICMP reachability.'],
    ['l','Test ICMP:'], ['code','ping <Target-IP>'],
    ['h','2. Firewall Rules Verification (ICMP)'],
    ['p2','Confirm that the firewall configuration, inbound and outbound traffic for ICMP is permitted or not.'],
    ['l','Verify Rules for'], ['os'], ['l','If using:'], ['tabs',['ufw','nftables']],
    ['l','Check the firewall status:'], ['code','sudo systemctl status ufw'],
    ['l','Check for ICMP rule:'], ['code','sudo grep -i icmp /etc/ufw/before.rules'],
    ['l','Verify if this exists:'], ['code','-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT\n-A ufw-before-input -p icmp --icmp-type destination-unreachable -j ACCEPT\n-A ufw-before-input -p icmp --icmp-type time-exceeded -j ACCEPT\n-A ufw-before-forward -p icmp --icmp-type echo-request -j ACCEPT'],
    ['l','If empty, then add above lines and create a rule'], ['l','Reload UFW:'], ['code','sudo iptables -A INPUT -p icmp -j ACCEPT'],
    ['h','3. Port Connectivity Check'],
    ['p2','Validate that the Master/Collector can reach SSH port on the target.'],
    ['l','For Windows Deployment'], ['code','tnc -ComputerName <Target-IP> -Port 22'],
    ['l','For Linux Deployment'], ['code','nc -zv <Target-IP> 22'],
    ['l','If connectivity fails:'], ['p2','Verify that physical firewalls, network ACLs, or security appliances allow TCP port 22.'], ['code','sudo ufw allow 22/tcp'],
    ['p2','Make sure that essential network tools are installed to enable basic connectivity checks and network troubleshooting.'],
    ['p2','If FQDN is used for discovery, ensure DNS configuration permits correct resolution of target hostnames.']]},
  {t:'Credential Requirements and Permissions', open:false, b:[
    ['p','You can select an existing Credential Profile from the dropdown or create a new one using the ‘Create Credential Profile’ button.'],
    ['p','Before you start discovery, ensure the required user account and permissions are in place.'],
    ['ul',[['Verify that the system can connect to the device using SSH and that all network connectivity requirements are met.'],['Use a user account with at least read-only access. The user can be a sudo or non-sudo account, as long as it has permission to read system details.']]],
    ['h','Supported Authentication Methods'],
    ['ul',[['Use a username and password—the same credentials you normally use to log in via SSH.'],['You can also authenticate using an SSH private key.'],['If the key is protected with a passphrase, providing the passphrase in the credentials is mandatory.'],['If there is no passphrase, you can proceed without.']]]]},
  {t:'Discovery Mechanisms', open:false, b:[
    ['p','Motadata supports multiple flavors (shown in Supported Platforms) Linux and Unix systems for the discovery.'],
    ['h','Collector'],
    ['p2','A Collector is a component that helps the ObserveOps Master communicate with devices during discovery and monitoring. It connects to the target systems, gathers information and sends it back to the Master for processing.'],
    ['l','When setting up a Discovery Profile:'], ['l','Selecting Collector(s)'],
    ['ul',[['You can manually choose one or more Collectors to run the discovery. Selecting multiple Collectors allows the system to balance the load if one fails.'],['If you select a single Collector, the Master will always use that specific Collector for both polling and discovery. This option is ideal when monitoring devices at remote locations where a dedicated Collector is deployed.'],['If you select multiple Collectors, the Master will automatically distribute the polling and discovery load across all selected Collectors. These Collectors act as extended arms of the Master, and if one Collector fails, the Master continues operations using the remaining Collectors—ensuring high availability (HA).']]],
    ['l','In case of no selection of Collector(s)'],
    ['ul',[['The Master itself can also work as a Collector, handling discovery and monitoring directly.'],['If you don’t select any Collector, the Master automatically chooses a Collector based on its health and availability to handle the job.']]],
    ['l','Best Practices'],
    ['ul',[['In large or multi-site environments, install Collectors close to the devices they will monitor to reduce delay.'],['Distribute work evenly across all Collectors, including the Master, to maintain smooth performance.']]],
    ['h','Groups'],
    ['ul',[['Groups are logical containers that organize discovered devices for easier management, reporting, and monitoring template assignment.'],['When assigned during profile creation, discovered systems automatically inherit dashboards, alert rules, and configuration policies.'],['Groups can represent business units, departments, geographic regions, or environments (e.g., Production, UAT), ensuring alignment with organizational hierarchies.']]],
    ['h','Tags'],
    ['ul',[['Tags are short labels that help you identify and group your devices later in reports, Search, Filter etc. You can add tags during discovery to organize devices by technology, department, or purpose.']]],
    ['l','Example:'], ['code','Rack:R1\nLocation:HeadOffice\nRole:FileServer\nEnvironment:UAT\nDepartment:IT\nVendor:Microsoft\nTechnology:Windows'],
    ['h','Ping Check'],
    ['p2','The Ping Check option is used to see if a device is reachable before starting discovery.'],
    ['l','If Ping Check is ON:'], ['ul',[['Discovery will only run for devices that reply to a ping. In this mode, the system calculates availability based on ping/ICMP response.']]],
    ['l','If Ping Check is OFF:'], ['ul',[['Discovery will still run even if ping is blocked by a firewall or network rule. In this mode, the system calculates availability based on the data collected during regular poll.']]],
    ['h','Notifications'],
    ['ul',[['Discovery runs can automatically send completion or failure notifications to specified recipients via email or SMS.'],['This ensures stakeholders remain informed about the status of device onboarding without manual follow-up.']]],
    ['h','Actions'],
    ['ul',[['The Actions lets you decide what to do after setting up your discovery profile.'],['You can save the setup to run later, start discovery right away, or schedule it to run at a specific time.'],['There’s also an option to reset all the entered details if you want to start again from scratch.']]]]}
];
const DP_HELP_LINK = 'https://docs.motadata.com/observeops-docs/Adding%20and%20Managing%20Devices/discovery-profile/adding-servers';

/* what a seeded row's icon says about its form: the create page's TYPE plus any sub-kind or
   vendor/model the type's own segmented control carries. Read by Edit to prefill the form. */
const DP_ROW_FORM = {'dell-emc-unity':['Storage',{vendor:'Dell EMC',model:'Dell EMC Unity'}], 'hpe':['Storage',{vendor:'HPE',model:'HPE MSA 2060'}], 'fibrenetix':['Storage',{vendor:'Fibrenetix',model:'Fibrenetix E88'}],
  'snmp-device':['Network'], 'linux':['Linux / Unix'], 'windows':['Windows'], 'vmware-esxi':['VMWare',{vkind:'ESXi'}], 'vcenter':['VMWare',{vkind:'VCenter'}], 'prism':['Nutanix'],
  'openshift-kubernetes':['OpenShift'], 'tanzu-kubernetes':['Tanzu Kubernetes'], 'oracle-database':['Database',{dbt:'Oracle'}], 'mysql':['Database',{dbt:'MySQL'}], 'mssql':['Database',{dbt:'MSSQL'}],
  'proxmox-ve-cluster':['Proxmox VE',{pkind:'Proxmox VE Cluster'}], 'hyperv-cluster':['Hyper-V',{hkind:'Hyper-V Cluster'}], 'hyper-v':['Hyper-V'], 'citrix-xen-cluster':['Citrix Xen',{ckind:'Citrix Xen Cluster'}], 'citrix-xen':['Citrix Xen'],
  'kvm':['KVM'], 'ping':['Ping'], 'ruckus-wireless':['Ruckus Wireless'], 'cisco-wireless':['Cisco Wireless'], 'aruba-wireless':['Aruba Wireless'], 'aws-cloud':['AWS Cloud'], 'azure-cloud':['Azure Cloud'], 'oracle-cloud':['Oracle Cloud'], 'office-365':['Office 365']};
/* the reverse: which vendor mark a saved form gets in the TYPE column. A type the harvested set
   has no mark for falls back to its category glyph, painted --text-dim (key "cat:<glyph>"). */
function dpIconFor(t, v){
  v = v || {};
  switch (t){
    case 'Storage': return /Unity/.test(v.model||'') ? 'dell-emc-unity' : /HPE/.test(v.model||'') ? 'hpe' : /Fibrenetix/.test(v.model||'') ? 'fibrenetix' : 'dell-emc-unity';
    case 'Database': return v.dbt === 'MySQL' ? 'mysql' : v.dbt === 'MSSQL' ? 'mssql' : 'oracle-database';
    case 'VMWare': return v.vkind === 'VCenter' ? 'vcenter' : 'vmware-esxi';
    case 'Hyper-V': return /Cluster/.test(v.hkind||'') ? 'hyperv-cluster' : 'hyper-v';
    case 'Citrix Xen': return /Cluster/.test(v.ckind||'') ? 'citrix-xen-cluster' : 'citrix-xen';
    case 'Proxmox VE': return 'proxmox-ve-cluster';
    case 'Nutanix': return 'prism'; case 'Network': return 'snmp-device'; case 'Linux / Unix': return 'linux'; case 'Windows': return 'windows';
    case 'AWS Cloud': return 'aws-cloud'; case 'Azure Cloud': return 'azure-cloud'; case 'Oracle Cloud': return 'oracle-cloud'; case 'Office 365': return 'office-365';
    case 'KVM': return 'kvm'; case 'Ping': case 'Service Check': return 'ping'; case 'OpenShift': return 'openshift-kubernetes'; case 'Tanzu Kubernetes': return 'tanzu-kubernetes';
    case 'Cisco Wireless': return 'cisco-wireless'; case 'Aruba Wireless': return 'aruba-wireless'; case 'Ruckus Wireless': return 'ruckus-wireless';
  }
  const c = DP_TREE.find(x => x.n === t || (x.kids || []).includes(t));
  return 'cat:' + (c ? c.ic : 'other');
}
/* the display name a saved form's row carries in the TYPE tooltip and the Type filter */
function dpTypeName(t, v){
  v = v || {};
  if (t === 'Storage') return v.model || 'Storage';
  if (t === 'Database') return v.dbt ? (v.dbt === 'Oracle' ? 'Oracle Database' : v.dbt) : 'Database';
  if (t === 'VMWare') return v.vkind === 'VCenter' ? 'VMware vCenter' : 'VMware ESXi';
  if (t === 'Hyper-V') return v.hkind || t; if (t === 'Citrix Xen') return v.ckind || t; if (t === 'Proxmox VE') return v.pkind || t;
  if (t === 'Linux / Unix') return 'Linux'; if (t === 'Network') return 'SNMP Device';
  return t;
}
const DP_VENDOR = {'dell-emc-unity':'Dell EMC','hpe':'HPE','fibrenetix':'Fibrenetix','snmp-device':'Cisco Systems','linux':'Canonical','windows':'Microsoft','vmware-esxi':'VMware','vcenter':'VMware','prism':'Nutanix','openshift-kubernetes':'Red Hat','tanzu-kubernetes':'VMware','oracle-database':'Oracle','mysql':'Oracle','mssql':'Microsoft','proxmox-ve-cluster':'Proxmox','hyperv-cluster':'Microsoft','hyper-v':'Microsoft','citrix-xen-cluster':'Citrix','citrix-xen':'Citrix','kvm':'Red Hat','ruckus-wireless':'Ruckus','cisco-wireless':'Cisco Systems','aruba-wireless':'Aruba','aws-cloud':'Amazon','azure-cloud':'Microsoft','oracle-cloud':'Oracle','office-365':'Microsoft','ping':''};
const DP_MODEL = {'dell-emc-unity':'Unity 380','hpe':'MSA 2060','fibrenetix':'E88','snmp-device':'Catalyst 9300','linux':'Ubuntu 22.04','windows':'Windows Server 2022','vmware-esxi':'ESXi 8.0','vcenter':'vCenter 8.0','prism':'Prism Central','openshift-kubernetes':'OpenShift 4','tanzu-kubernetes':'TKG 2.x','oracle-database':'19c','mysql':'8.0','mssql':'2022','proxmox-ve-cluster':'PVE 8','hyperv-cluster':'Hyper-V 2022','hyper-v':'Hyper-V 2022','citrix-xen-cluster':'XenServer 8','citrix-xen':'XenServer 8','kvm':'QEMU/KVM','ruckus-wireless':'R750','cisco-wireless':'C9800','aruba-wireless':'AP-515','aws-cloud':'EC2','azure-cloud':'VM','oracle-cloud':'Compute','office-365':'Tenant','ping':''};

/* ── state ─────────────────────────────────────────────────────────────────────────────────── */
const DP = {
  rows: DP_ROWS0.map(r => Object.assign({}, r, {ty: DP_TYPE_NAME[r.ic] || r.ic, g:[dpCatOf((DP_ROW_FORM[r.ic]||[''])[0]) || 'Other'], col:['motadata'], cred:[], sched:null})),
  creds: JSON.parse(JSON.stringify(DP_CREDS0)),
  pg: { q:'', sort:1, chips:true, page:1, size:50, filt:{type:[], typeOp:'=', status:[], statusOp:'=', disc:[], discOp:'='}, cols:{sched:1, groups:0, coll:0} },
  run:{}, f:null, sf:null, rf:null, cf:null
};
/* the shared list helpers (stcSearchHTML · stcQ · stcPagerHTML · stcPage · stcSizeMenu) key their
   state on STC.pg[key] — registering this page's record there is what lets them serve it unchanged */
STC.pg.dp = DP.pg;
const dpEsc = s => stEsc(s == null ? '' : s);
const dpStamp = () => { const d = new Date(), p = n => String(n).padStart(2,'0'); return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; };
/* the STATUS column: the live grid prints these three strings, in one colour */
const dpStatusText = s => s === 'Not Run Yet' ? s : s.startsWith('F ') ? 'Last ran failed at ' + s.slice(2) : 'Last ran at ' + s;
function dpTypeIcon(r){
  const svg = DP_TYPE_SVG[r.ic];
  if (svg) return `<span class="dpty" data-tip="${dpEsc(r.ty)}">${svg}</span>`;
  const k = String(r.ic || '').replace(/^cat:/, '');
  return `<span class="dpty cat" data-tip="${dpEsc(r.ty)}"><svg viewBox="0 0 48 48"><path fill="currentColor" d="${DP_CAT_ICO[k] || DP_CAT_ICO.other}"/></svg></span>`;
}
const dpCatSvg = (k, cls) => `<svg class="${cls||'ic'}" viewBox="0 0 48 48"><path fill="currentColor" d="${DP_CAT_ICO[k] || ''}"/></svg>`;
const dpUniq = a => [...new Set(a)];

/* ── the list ──────────────────────────────────────────────────────────────────────────────── */
function dpRows(){
  const P = DP.pg, q = P.q.trim().toLowerCase(), F = P.filt;
  let rows = DP.rows.filter(r => !q || r.n.toLowerCase().includes(q) || (r.t||'').toLowerCase().includes(q) || (r.ty||'').toLowerCase().includes(q));
  const ap = (vals, op, get) => { if (!vals.length) return; rows = rows.filter(r => { const hit = vals.includes(get(r)); return op === '=' ? hit : !hit; }); };
  ap(F.type, F.typeOp, r => r.ty); ap(F.status, F.statusOp, r => dpStatusText(r.s)); ap(F.disc, F.discOp, r => String(r.c));
  rows.sort((a, b) => a.n.localeCompare(b.n, undefined, {sensitivity:'base'}) * P.sort);
  return rows;
}
function dpListHTML(){
  const P = DP.pg, C = P.cols, F = P.filt, rows = dpRows(), total = rows.length;
  const page = rows.slice((P.page - 1) * P.size, P.page * P.size);
  const chip = (lab, key) => { const vals = F[key], op = F[key + 'Op'], txt = vals.length === 1 ? vals[0] : vals.length ? vals[0] + ', +' + (vals.length - 1) : '';
    return `<span class="stcchip" onclick="dpChip(event,'${key}')"><span class="f">${lab}</span>${vals.length ? `<span class="op">${op}</span><span class="v" title="${dpEsc(vals.join(', '))}">${dpEsc(txt)}</span><svg class="x" viewBox="0 0 48 48" onclick="event.stopPropagation();dpFilt('${key}',[])"><path fill="currentColor" d="${STC_ICO.times}"/></svg>` : ''}</span>`; };
  const tr = page.map(r => {
    const running = !!DP.run[r.id];
    return `<tr>
      <td class="nm"><span class="lk" onclick="dpResult(${r.id})">${dpEsc(r.n)}</span></td>
      <td title="${dpEsc(r.t)}">${dpEsc(r.t)}</td>
      <td class="ty">${dpTypeIcon(r)}</td>
      <td class="c">${stcUsed(r.c)}</td>
      <td class="dpst">${dpEsc(dpStatusText(r.s))}</td>
      ${C.sched ? `<td class="c">${r.sched ? `<button class="stcib" data-tip="${dpEsc(dpSchedText(r.sched))}" onclick="dpSchedule(${r.id})">${stcSvg('schedule')}</button>` : ''}</td>` : ''}
      ${C.groups ? `<td>${stcTags(r.g)}</td>` : ''}
      ${C.coll ? `<td>${dpEsc((r.col||[]).join(', '))}</td>` : ''}
      <td><div class="stcact"><button class="stcib dprun${running?' spin':''}" data-tip="${running?'Running discovery…':'Run discovery'}" onclick="dpRun(${r.id})">${stcSvg('restart')}</button><button class="stcib" data-tip="Actions" onclick="dpMenu(event,${r.id})">${stcSvg('ellipsis-v')}</button></div></td>
    </tr>`;
  }).join('');
  return `<div class="stcbar">${stcSearchHTML('dp')}<span class="stcsp"></span>
      <button class="stcsq" data-tip="Show / hide columns" onclick="dpCols(event)">${stcSvg('eye')}</button>
      <button class="stcsq" data-tip="Export As PDF" onclick="dpExport('PDF')">${stcSvg('export-pdf')}</button>
      <button class="stcsq" data-tip="Export As CSV" onclick="dpExport('CSV')">${stcSvg('export-csv')}</button>
      <button class="stcsq${P.chips?' on':''}" data-tip="${P.chips?'Hide filters':'Show filters'}" onclick="DP.pg.chips=!DP.pg.chips;stMainPaint()">${stcSvg('filter')}</button>
      <button class="stbtn pri" onclick="dpForm('create')">Create Discovery Profile</button></div>
    <div class="stcchips${P.chips?'':' hid'}">
      ${chip('Type','type')}${chip('Status','status')}${chip('Discovered Objects','disc')}
      <button class="stcaddf" onclick="dpAddFilter(event)">${stcSvg('plus')}<span>Filter</span></button></div>
    <div class="stcgridw"><div class="stcscroll"><table class="stcgrid dpgrid">
      <colgroup><col style="width:24%"><col style="width:20%"><col style="width:80px"><col style="width:150px"><col>${C.sched?'<col style="width:100px">':''}${C.groups?'<col style="width:12%">':''}${C.coll?'<col style="width:12%">':''}<col style="width:100px"></colgroup>
      <thead><tr>${stcTh('Discovery Profile Name',{sort:P.sort,onclick:'dpSort()'})}${stcTh('IP/Host/IP Range/CIDR/CSV',{})}${stcTh('Type',{})}${stcTh('Discovered Objects',{cls:'c'})}${stcTh('Status',{})}${C.sched?stcTh('Scheduler',{cls:'c'}):''}${C.groups?stcTh('Groups',{}):''}${C.coll?stcTh('Collectors',{}):''}${stcTh('Actions',{cls:'r'})}</tr></thead>
      <tbody>${tr || `<tr><td colspan="9"><div class="stcempty">No discovery profiles match.</div></td></tr>`}</tbody></table></div>
    ${stcPagerHTML('dp', total)}</div>`;
}
function dpSort(){ DP.pg.sort *= -1; stMainPaint(); }
function dpFilt(key, vals){ DP.pg.filt[key] = vals; DP.pg.page = 1; stMainPaint(); }
/* the chip pickers list what the grid holds — the live values are the rows' own Type names,
   the STATUS strings and the Discovered-Objects counts (sorted as strings, as live sorts them) */
function dpChip(ev, key){
  const F = DP.pg.filt, titles = {type:'Type', status:'Status', disc:'Discovered Objects'};
  const vals = key === 'type' ? dpUniq(DP.rows.map(r => r.ty)).sort() : key === 'status' ? dpUniq(DP.rows.map(r => dpStatusText(r.s))).sort() : dpUniq(DP.rows.map(r => String(r.c))).sort();
  stcPick(ev.currentTarget, {title: titles[key], items: vals.map(v => ({k:v, t:v})), cur:F[key], multi:true, ops:{cur:F[key+'Op'], onOp:op => { F[key+'Op'] = op; if (F[key].length) stMainPaint(); }}, onPick:sel => dpFilt(key, sel), width: key === 'status' ? 300 : 240});
}
function dpAddFilter(ev){ stcMenu(ev.currentTarget, ['Type','Status','Discovered Objects'].map((t, i) => ({t, fn:() => { DP.pg.chips = true; stMainPaint(); setTimeout(() => { const c = document.querySelectorAll('#stMain .stcchip')[i]; c && c.click(); }, 30); }}))); }
/* the eye: the first five columns are fixed (dim, ticked), Scheduler on, Groups and Collectors off */
function dpCols(ev){
  const C = DP.pg.cols;
  const fixed = ['Discovery Profile Name','IP/Host/IP Range/CIDR/CSV','Type','Discovered Objects','Status'].map(t => `<div class="stcmi on ck" style="opacity:.6;cursor:default"><span class="bx">${stcSvg('check')}</span>${t}</div>`).join('');
  const html = fixed + [['sched','Scheduler'],['groups','Groups'],['coll','Collectors']].map(([k, t]) => `<div class="stcmi ck${C[k]?' on':''}" data-c="${k}"><span class="bx">${stcSvg('check')}</span>${t}</div>`).join('') +
    `<div class="stcmi sep"></div><div class="stcmi" data-c="reset">Reset Column Preference</div>`;
  const el = stcPop(ev.currentTarget, html, {right:true}); if (!el) return;
  el.querySelectorAll('[data-c]').forEach(m => m.onclick = () => { const k = m.dataset.c; if (k === 'reset'){ C.sched = 1; C.groups = 0; C.coll = 0; } else C[k] = C[k] ? 0 : 1; stMainPaint(); stcPopClose(); });
}
/* the row ⋮ — the live 228px popover's three rows, in its order, the delete in red */
function dpMenu(ev, id){
  stcMenu(ev.currentTarget, [
    {t:'Schedule Discovery Profile', ic:'schedule', fn:() => dpSchedule(id)},
    {t:'Edit Discovery Profile', ic:'pencil', fn:() => dpForm('edit', id)},
    {t:'Delete Discovery Profile', ic:'trash-alt', del:true, fn:() => dpDelete(id)}
  ], {right:true});
}
/* ⟳ — INFERRED: the live control was not pressed on a customer's instance. The spin and the
   status stamp are what the product's own Compliance run does; the count is left as it was. */
function dpRun(id){
  const r = DP.rows.find(x => x.id === id); if (!r || DP.run[id]) return;
  DP.run[id] = true; stMainPaint();
  setTimeout(() => { delete DP.run[id]; r.s = dpStamp(); stMainPaint(); toast(`Discovery run finished for “${r.n}” — ${r.c} object${r.c===1?'':'s'}`); }, 2400);
}
function dpExport(kind){
  const head = ['Discovery Profile Name','IP/Host/IP Range/CIDR/CSV','Type','Discovered Objects','Status','Scheduler'];
  const body = dpRows().map(r => [r.n, r.t || '', r.ty, r.c, dpStatusText(r.s), r.sched ? dpSchedText(r.sched) : '']);
  if (kind === 'PDF'){ toast('Printing the Discovery Profile list — choose “Save as PDF” in the print dialog'); setTimeout(() => window.print(), 260); return; }
  if (typeof lxDownload !== 'function') return toast('Export as CSV — the live button downloads the grid; this page does not write files');
  const csv = [head].concat(body).map(r => r.map(lxCsvCell).join(',')).join('\r\n');
  const name = 'discovery-profile-' + lxFileStamp() + '.csv';
  if (!lxDownload(name, csv, 'text/csv')) return toast('The browser blocked the download — open this page over http rather than file://');
  toast(`Exported ${body.length} discovery profiles to ${name}`);
}

/* ── delete: the live 450px red-bordered confirm, trash in a circle, No · Yes ─────────────── */
function dpCfEl(){
  let c = document.getElementById('dpCf');
  if (!c){
    c = document.createElement('div'); c.className = 'dpcf'; c.id = 'dpCf';
    c.innerHTML = `<div class="dpcfb" onclick="event.stopPropagation()"><div class="dpcfr"><span class="dpcfi">${stcSvg('trash-alt')}</span><span class="dpcft">Are you sure, you want to delete discovery profile?</span></div><div class="bt"><button class="stbtn" onclick="dpCfClose()">No</button><button class="stbtn dpyes" id="dpCfYes">Yes</button></div></div>`;
    c.onclick = dpCfClose; document.body.appendChild(c);
  }
  return c;
}
function dpDelete(id){
  const r = DP.rows.find(x => x.id === id); if (!r) return;
  const c = dpCfEl(); c.classList.add('on');
  const y = document.getElementById('dpCfYes');
  y.onclick = () => { dpCfClose(); DP.rows = DP.rows.filter(x => x.id !== id); stMainPaint(); toast(`Discovery profile “${r.n}” deleted`); };
  setTimeout(() => c.querySelector('.stbtn').focus(), 0);      /* focus lands on No — the safe answer */
}
function dpCfClose(){ const c = document.getElementById('dpCf'); if (c) c.classList.remove('on'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ const c = document.getElementById('dpCf'); if (c && c.classList.contains('on')){ dpCfClose(); e.stopPropagation(); } } }, true);

/* ── schedule: the live 682px drawer "<name> Schedule Discovery" ──────────────────────────── */
const DP_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DP_HOURS = (() => { const a = []; for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 5) a.push(String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0')); return a; })();
const dpSchedText = s => `${s.type} at ${s.hour}${s.type === 'Once' ? ' on ' + s.date : ''}`;
function dpSchedule(id){
  const r = DP.rows.find(x => x.id === id); if (!r) return;
  const d = new Date(), today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const s = r.sched || {};
  DP.sf = {id, type: s.type || 'Once', date: s.date || today, hour: s.hour || '', days: s.days ? [...s.days] : [], months: s.months ? [...s.months] : [], dates: s.dates ? [...s.dates] : [], notify: s.notify || '', bcc: s.bcc || '', showBcc: !!s.bcc, auto: !!s.auto, err:{}};
  dpSfPaint(true);
}
function dpSfPaint(open){
  const S = DP.sf, r = DP.rows.find(x => x.id === S.id), E = S.err;
  const seg = (k, opts, cur) => `<div class="dpseg">${opts.map(o => `<button type="button" class="${cur===o?'on':''}" onclick="DP.sf.${k}=${stA(o)};dpSfPaint()">${o}</button>`).join('')}</div>`;
  const fi = (k, lab, req, inner) => `<div class="dpfi${E[k]?' err':''}"><span class="dplab${req?' req':''}">${lab}</span>${inner}</div>`;
  const sel = (txt, ph, on) => `<div class="dpsel" onclick="${on}"><span class="v${txt?'':' ph'}">${txt ? dpEsc(txt) : ph}</span>${stcSvg('chevron-down','car')}</div>`;
  const body = `<div class="dpsch">
    ${fi('type', 'Scheduler Type', 1, seg('type', ['Once','Daily','Weekly','Monthly'], S.type))}
    ${S.type === 'Weekly' ? fi('days', 'Days', 1, `<div class="dpseg">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => `<button type="button" class="${S.days.includes(d)?'on':''}" onclick="dpSfTog('days',${stA(d)})">${d}</button>`).join('')}</div>`) : ''}
    ${S.type === 'Monthly' ? `<div class="dpfr">${fi('months', 'Months', 1, sel(S.months.join(', '), 'Select', "dpSfPick(event,'months')"))}${fi('dates', 'Dates', 1, sel(S.dates.join(', '), 'Select', "dpSfPick(event,'dates')"))}</div>` : ''}
    <div class="dpfr">
      ${fi('date', 'Start Date', 1, `<input class="dpin" type="date" value="${S.date}" oninput="DP.sf.date=this.value">`)}
      ${fi('hour', 'Hours', 1, sel(S.hour, '00:00', "dpSfPick(event,'hour')"))}
    </div>
    ${fi('notify', 'Notify', 0, `<div class="dpnot"><input class="dpin" placeholder="@User or Email or /Handle or #User Profile or Mobile Number" value="${dpEsc(S.notify)}" oninput="DP.sf.notify=this.value"><a class="dpbcc" onclick="DP.sf.showBcc=!DP.sf.showBcc;dpSfPaint()">+ Bcc</a></div>`)}
    ${S.showBcc ? fi('bcc', 'Bcc', 0, `<input class="dpin" placeholder="Email" value="${dpEsc(S.bcc)}" oninput="DP.sf.bcc=this.value">`) : ''}
    <label class="dpck"><span class="stcck${S.auto?' on':''}" onclick="DP.sf.auto=!DP.sf.auto;this.classList.toggle('on')">${stcSvg('check')}</span>Auto Provision</label>
  </div>`;
  const foot = `<button class="stbtn pri" onclick="dpSfSubmit()">Schedule</button><button class="stbtn" onclick="dpSchedule(${S.id})">Reset</button>`;
  if (open) stcDrOpen(`${r.n} Schedule Discovery`, body, foot); else document.getElementById('stcDrB').innerHTML = body;
}
function dpSfTog(k, v){ const a = DP.sf[k], i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); dpSfPaint(); }
function dpSfPick(ev, k){
  const S = DP.sf;
  if (k === 'hour') return stcPick(ev.currentTarget, {items: DP_HOURS.map(h => ({k:h, t:h})), cur:S.hour, onPick:v => { S.hour = v; dpSfPaint(); }, matchWidth:true, width:200});
  const items = k === 'months' ? DP_MONTHS : Array.from({length:31}, (_, i) => String(i + 1));
  stcPick(ev.currentTarget, {items: items.map(t => ({k:t, t})), cur:S[k], multi:true, search:false, onPick:sel => { S[k] = items.filter(t => sel.includes(t)); dpSfPaint(); }, matchWidth:true, width:220});
}
function dpSfSubmit(){
  const S = DP.sf; S.err = {};
  if (!S.date) S.err.date = 1; if (!S.hour) S.err.hour = 1;
  if (S.type === 'Weekly' && !S.days.length) S.err.days = 1;
  if (S.type === 'Monthly'){ if (!S.months.length) S.err.months = 1; if (!S.dates.length) S.err.dates = 1; }
  if (Object.keys(S.err).length){ dpSfPaint(); return; }
  const r = DP.rows.find(x => x.id === S.id);
  r.sched = {type:S.type, date:S.date, hour:S.hour, days:S.days, months:S.months, dates:S.dates, notify:S.notify, bcc:S.bcc, auto:S.auto};
  stcDrClose(); stMainPaint(); toast(`“${r.n}” scheduled — ${dpSchedText(r.sched)}`);
}

/* ── the result page: a profile's discovered objects ──────────────────────────────────────── */
function dpBaseIp(t){ const m = /^(\d+\.\d+\.\d+\.)(\d+)(?:-(\d+))?$/.exec(t || ''); return m ? {pfx:m[1], start:+m[2]} : null; }
function dpObjects(r){
  const out = [], base = dpBaseIp(r.t), vend = DP_VENDOR[r.ic] || '', model = DP_MODEL[r.ic] || '';
  const slug = (r.ty || 'object').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  for (let i = 0; i < r.c; i++){
    const ip = base ? base.pfx + Math.min(254, base.start + i) : (r.t && !/^\d/.test(r.t) ? '' : '');
    const host = ip || (r.t && !/^\d/.test(r.t) ? r.t : `${slug}-${String(i + 1).padStart(2,'0')}`);
    out.push({id:i + 1, st: r.c > 2 && i % 3 === 2 ? 'N' : 'P', n: host, ip, vend, model, host, cred: (r.cred && r.cred[0]) || '', col:'motadata'});
  }
  return out;
}
function dpResult(id){
  const r = DP.rows.find(x => x.id === id); if (!r) return;
  DP.rf = {id, q:'', sel:[], objs: dpObjects(r)};
  stFullOpen({ title: r.n, html: dpResHTML, onClose: () => { DP.rf = null; } });
}
function dpResHTML(){
  const R = DP.rf, r = DP.rows.find(x => x.id === R.id), q = R.q.toLowerCase();
  const list = R.objs.filter(o => !q || o.n.toLowerCase().includes(q) || o.ip.includes(q) || o.vend.toLowerCase().includes(q) || o.model.toLowerCase().includes(q));
  const pick = list.filter(o => o.st === 'N'), all = pick.length && pick.every(o => R.sel.includes(o.id));
  const rows = list.map(o => `<tr>
      <td>${o.st === 'N' ? `<span class="stcck${R.sel.includes(o.id)?' on':''}" onclick="dpResSel(${o.id})">${stcSvg('check')}</span>` : `<span class="stcck dis">${stcSvg('check')}</span>`}</td>
      <td><span class="dpbdg ${o.st}">${o.st}</span></td>
      <td class="nm">${dpEsc(o.n)}</td><td>${dpEsc(o.ip)}</td><td>${dpEsc(o.vend)}</td><td>${dpEsc(o.model)}</td><td>${dpEsc(o.host)}</td>
      <td class="ty">${dpTypeIcon(r)}</td><td>${dpEsc(o.cred)}</td><td>${dpEsc(o.col)}</td></tr>`).join('');
  return `<div class="stcfull dpres">
    <div class="stcbar"><div class="stcsearch dpressrch${R.q?' has':''}">${stcSvg('search')}<input placeholder="Search" value="${dpEsc(R.q)}" oninput="dpResQ(this)"><span class="clr" data-tip="Clear" onclick="DP.rf.q='';stMainPaint()">${stcSvg('times-circle')}</span></div>
      <div class="dpstat"><span>Discovered Objects<b class="ok">${R.objs.length}</b></span><span class="bar"></span><span>Failed Objects<b class="bad">0</b></span></div>
      <button class="stcsq" data-tip="Export CSV" onclick="dpResExport()">${stcSvg('export-csv')}</button></div>
    <div class="stcgridw"><div class="stcscroll"><table class="stcgrid dpgrid">
      <colgroup><col style="width:40px"><col style="width:44px"><col style="width:16%"><col style="width:12%"><col style="width:11%"><col style="width:13%"><col style="width:14%"><col style="width:64px"><col><col style="width:10%"></colgroup>
      <thead><tr><th><span class="stcck${all?' on':''}${pick.length?'':' dis'}" onclick="dpResAll()">${stcSvg('check')}</span></th><th></th><th>Name</th><th>IP</th><th>Vendor</th><th>Model</th><th>Host</th><th>Type</th><th>Credential Profile</th><th>Collectors</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="10"><div class="stcempty">No data found</div></td></tr>`}</tbody></table></div></div>
    <div class="dpresf"><div class="dplg"><span class="dpbdg N">N</span>New<span class="dpbdg P">P</span>Provisioned<span class="dpbdg U">U</span>Unprovisioned<span class="sp"></span>
      <button class="stbtn" onclick="stFullClose()">Cancel</button><button class="stbtn pri" ${R.sel.length?'':'disabled'} onclick="dpResAdd()">Add Selected Objects</button></div></div></div>`;
}
function dpResQ(el){ DP.rf.q = el.value; const p = el.selectionStart; stMainPaint(); const i = document.querySelector('#stMain .dpressrch input'); if (i){ i.focus(); i.setSelectionRange(p, p); } }
function dpResSel(id){ const s = DP.rf.sel, i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else s.push(id); stMainPaint(); }
function dpResAll(){ const R = DP.rf, q = R.q.toLowerCase(); const pick = R.objs.filter(o => o.st === 'N' && (!q || o.n.toLowerCase().includes(q) || o.ip.includes(q))); if (!pick.length) return; const all = pick.every(o => R.sel.includes(o.id)); R.sel = all ? R.sel.filter(i => !pick.some(o => o.id === i)) : dpUniq(R.sel.concat(pick.map(o => o.id))); stMainPaint(); }
function dpResAdd(){ const R = DP.rf, n = R.sel.length; if (!n) return; R.objs.forEach(o => { if (R.sel.includes(o.id)) o.st = 'P'; }); R.sel = []; stMainPaint(); toast(`${n} object${n===1?'':'s'} added as monitor${n===1?'':'s'}`); }
function dpResExport(){
  const R = DP.rf, r = DP.rows.find(x => x.id === R.id);
  const head = ['Status','Name','IP','Vendor','Model','Host','Type','Credential Profile','Collectors'], body = R.objs.map(o => [o.st === 'N' ? 'New' : 'Provisioned', o.n, o.ip, o.vend, o.model, o.host, r.ty, o.cred, o.col]);
  if (typeof lxDownload !== 'function') return toast('Export CSV — the live button downloads the result grid; this page does not write files');
  const csv = [head].concat(body).map(x => x.map(lxCsvCell).join(',')).join('\r\n'), name = 'discovery-result-' + lxFileStamp() + '.csv';
  if (!lxDownload(name, csv, 'text/csv')) return toast('The browser blocked the download — open this page over http rather than file://');
  toast(`Exported ${body.length} discovered objects to ${name}`);
}

/* ── the create / edit page ───────────────────────────────────────────────────────────────── */
const DP_TMODES = ['IP/Host','IP Range','CSV','CIDR'];
const DP_TPH = {'IP/Host':'e.g. 192.168.1.1 or fd00::1', 'IP Range':'e.g. 192.168.1.10-120', 'CIDR':'e.g. 192.168.1.12/24'};
function dpFields(T){ const a = []; if (T.top) a.push(T.top); a.push(...T.grid, ...T.params); (T.extra||[]).forEach(x => a.push(...x[1])); a.push(DP_NOTIFY); return a; }
function dpForm(mode, id){
  const src = id != null ? DP.rows.find(x => x.id === id) : null;
  let type = 'Linux / Unix', extra = {};
  if (src){ const m = DP_ROW_FORM[src.ic] || [src.fty || 'Linux / Unix']; type = DP_FORMS[m[0]] ? m[0] : 'Linux / Unix'; extra = Object.assign({}, m[1] || {}, src.fv || {}); }
  DP.f = {mode, id, type, open:[dpCatOf(type)], railq:'', v:{}, err:{}, tried:false, bcc:false, fw:'ufw', help: DP_HELP.map(h => mode === 'create' ? !!h.open : false)};
  dpSeed(src, extra);
  DP.f.init = JSON.parse(JSON.stringify(DP.f.v));
  stFullOpen({ title:(mode === 'edit' ? 'Edit' : 'Create') + ' Discovery Profile', html: dpFormHTML, after: dpFormAfter, onClose: () => { DP.f = null; } });
}
/* the form's values, defaulted the way the live form opens: Groups pre-filled with the type's
   category, Collector Type "Collector", every switch and port at the type's own default */
function dpSeed(src, extra){
  const F = DP.f, T = DP_FORMS[F.type], v = {};
  dpFields(T).forEach(([k, lab, kind, o]) => {
    o = o || {};
    if (kind === 'target'){ v.tmode = 'IP/Host'; v.target = ''; }
    else if (kind === 'multi') v[k] = k === 'groups' ? [dpCatOf(F.type)].filter(Boolean) : [];
    else if (kind === 'tags') v[k] = [];
    else if (kind === 'sw') v[k] = !!o.val;
    else if (kind === 'pick' || kind === 'seg') v[k] = o.val || '';
    else v[k] = o.val != null ? o.val : '';
  });
  v.bcc = '';
  if (src){
    v.name = src.n;
    if ('target' in v){ v.target = src.t; v.tmode = /-/.test(src.t) ? 'IP Range' : /\//.test(src.t) ? 'CIDR' : 'IP/Host'; }
    if ('ip' in v) v.ip = src.t;
    if ('url' in v) v.url = src.t;
    if ('groups' in v && src.g && src.g.length) v.groups = [...src.g];
    if ('cred' in v){ v.cred = src.cred && src.cred.length ? [...src.cred] : DP.creds.filter(c => c.n === src.n).map(c => c.n); }
    if ('coll' in v && src.col) v.coll = src.col.filter(c => DP_COLLECTORS.includes(c));
    if ('tags' in v && src.tags) v.tags = [...src.tags];
  }
  Object.keys(extra || {}).forEach(k => { if (k in v || k === 'vendor' || k === 'model' || k === 'dbt') v[k] = extra[k]; });
  F.v = v;
}
function dpFormHTML(){
  const F = DP.f, T = DP_FORMS[F.type], lock = F.mode === 'edit';
  return `<div class="dpcr${lock?' lock':''}">
    <div class="dprail"><div class="stcsearch dprs${F.railq?' has':''}">${stcSvg('search')}<input placeholder="Search" value="${dpEsc(F.railq)}" oninput="dpRailQ(this)"><span class="clr" data-tip="Clear" onclick="DP.f.railq='';dpRepaint()">${stcSvg('times-circle')}</span></div>
      <div class="dpcats">${dpRailHTML()}</div></div>
    <div class="dpform"><div class="dpfw">${dpFieldsHTML(T)}</div>${dpFootHTML()}</div>
    <div class="dphelp">${dpHelpHTML()}</div></div>`;
}
function dpRailHTML(){
  const F = DP.f, q = F.railq.trim().toLowerCase();
  return DP_TREE.map((c, i) => {
    const kids = (c.kids || []).filter(k => !q || k.toLowerCase().includes(q) || c.n.toLowerCase().includes(q));
    if (q && !c.n.toLowerCase().includes(q) && !kids.length) return '';
    const open = F.open.includes(c.n) || (q && kids.length);
    const leaf = !c.kids;
    return `<div class="dpcat${open && !leaf ? ' open' : ''}">
      <div class="dpcath${leaf && F.type === c.n ? ' on' : ''}" onclick="${leaf ? `dpType(${stA(c.n)})` : `dpCatTog(${i})`}">${dpCatSvg(c.ic)}<span class="nm">${dpEsc(c.n)}</span>${leaf ? '' : stcSvg('chevron-right','car')}</div>
      ${leaf ? '' : `<div class="dpsub">${kids.map(k => `<div class="dpsubi${F.type === k ? ' on' : ''}" onclick="dpType(${stA(k)})">${dpEsc(k)}</div>`).join('')}</div>`}</div>`;
  }).join('');
}
function dpCatTog(i){ const F = DP.f, n = DP_TREE[i].n, j = F.open.indexOf(n); if (j >= 0) F.open.splice(j, 1); else F.open.push(n); dpRepaint(); }
function dpRailQ(el){ DP.f.railq = el.value; const p = el.selectionStart; dpRepaint(); const i = document.querySelector('#stMain .dprs input'); if (i){ i.focus(); i.setSelectionRange(p, p); } }
/* picking a type re-seeds the form for that type; the name survives, everything else takes
   the new type's defaults (the live form starts each type from its own defaults) */
function dpType(t){
  const F = DP.f; if (F.mode === 'edit' || !DP_FORMS[t]) return;
  const name = F.v.name; F.type = t; F.err = {}; F.tried = false;
  const cat = dpCatOf(t); if (cat && !F.open.includes(cat)) F.open.push(cat);
  dpSeed(null, {}); F.v.name = name; F.init = JSON.parse(JSON.stringify(F.v));
  dpRepaint();
}
/* one field cell */
function dpCell(f){
  const F = DP.f, [k, lab, kind, o0] = f, o = o0 || {}, v = F.v[k], err = !!F.err[k];
  const L = `<span class="dplab${o.req?' req':''}">${dpEsc(lab)}${o.info ? `<span class="dpinfo" data-tip="${dpEsc(o.info)}">${stcSvg('info-circle')}</span>` : ''}</span>`;
  const wrap = (inner, cls) => `<div class="dpfi${cls?' '+cls:''}${err?' err':''}" id="dpfi-${k}">${inner}</div>`;
  const sel = (txt, ph, on) => `<div class="dpsel" onclick="${on}"><span class="v${txt?'':' ph'}">${txt ? dpEsc(txt) : ph}</span>${stcSvg('chevron-down','car')}</div>`;
  switch (kind){
    case 'name': case 'text': case 'ip':
      return wrap(L + `<input class="dpin" placeholder="${dpEsc(o.ph || (kind === 'ip' ? DP_TPH['IP/Host'] : 'Enter text'))}" value="${dpEsc(v)}" oninput="dpIn('${k}',this.value)">`);
    case 'num':
      return wrap(L + `<input class="dpin" type="number" value="${dpEsc(v)}" oninput="dpIn('${k}',this.value)">`);
    case 'target': {
      const m = F.v.tmode;
      if (m === 'CSV') return wrap(`<span class="dplab req">CSV</span><label class="dpin dpfile">${stcSvg('plus-circle','car')}<span>${F.v.target ? dpEsc(F.v.target) : 'Upload a CSV of targets'}</span><input type="file" accept=".csv" onchange="dpIn('target',this.files[0]?this.files[0].name:'')"></label>`);
      return wrap(`<span class="dplab req">${m === 'IP/Host' ? 'IP/Host' : m}</span><input class="dpin" placeholder="${DP_TPH[m]}" value="${dpEsc(F.v.target)}" oninput="dpIn('target',this.value)">`);
    }
    case 'pick': return wrap(L + sel(v, o.ph || 'Select', `dpPick(event,'${k}')`));
    case 'multi': return wrap(L + sel((v||[]).join(', '), o.ph || 'Select', `dpMulti(event,'${k}')`));
    case 'tags': return wrap(L + `<div class="dpsel tags" onclick="dpTags(event)"><span class="v${v.length?'':' ph'}">${v.length ? v.map(t => `<span class="stctag">${dpEsc(t)}</span>`).join('') : 'Add Tags'}</span>${stcSvg('chevron-down','car')}</div>`);
    case 'sw': return wrap(L + `<button type="button" class="stsw${v?' on':''}" role="switch" aria-checked="${!!v}" onclick="dpTog('${k}',this)"><span class="lb">${v?'ON':'OFF'}</span></button>`);
    case 'seg': return wrap((o.nolab ? '' : L) + dpSeg(k, o.opts, v), [o.nolab ? 'nolab' : '', o.wide ? 'wide' : ''].join(' ').trim());
    case 'notify':
      return wrap(L + `<div class="dpnot"><input class="dpin" placeholder="${dpEsc(o.ph)}" value="${dpEsc(v)}" oninput="dpIn('notify',this.value)"><a class="dpbcc" onclick="DP.f.bcc=!DP.f.bcc;dpRepaint()">+ Bcc</a></div>${F.bcc ? `<span class="dplab" style="margin-top:10px">Bcc</span><input class="dpin" placeholder="Email" value="${dpEsc(F.v.bcc)}" oninput="dpIn('bcc',this.value)">` : ''}`, 'full');
  }
  return '';
}
const dpSeg = (k, opts, cur) => `<div class="dpseg">${opts.map(o => `<button type="button" class="${cur===o?'on':''}" onclick="dpSet('${k}',${stA(o)})">${dpEsc(o)}</button>`).join('')}</div>`;
/* the form, row by row: the live first row is the name beside the target-mode segments, then
   the type's grid three to a row (Credential Profiles keeps its Create button beside it), then
   "Discovery Parameters of <type>", any extra section (Network's Topology), then Notifications */
function dpFieldsHTML(T){
  const F = DP.f, out = [];
  const row = (cells, cls) => cells.length ? `<div class="dpfr${cls?' '+cls:''}">${cells.join('')}</div>` : '';
  /* the name takes column 1 of the same three-column grid every other row uses, and the segment
     groups share ONE cell spanning columns 2-3 — so the first segment starts on Collector Type's
     left edge. As their own 1.4fr/1fr/1fr row the name ran 54px past column 1 and the segments
     floated on neither column (reported with a screenshot, 26 Sep 2026). */
  const segs = [];
  if (T.top) segs.push(dpCell([T.top[0], T.top[1], 'seg', Object.assign({nolab:true}, T.top[3])]));
  if (T.grid.some(f => f[2] === 'target')) segs.push(dpCell(['tmode', 'Target', 'seg', {opts: DP_TMODES, nolab:true}]));
  const first = [dpCell(DP_COMMON_HEAD[0])];
  if (segs.length) first.push(`<div class="dpsegs">${segs.join('')}</div>`);
  out.push(row(first));
  let cells = [], used = 0;
  T.grid.forEach(f => {
    if (f[2] === 'name') return;
    /* a cell that spans two columns (Service Check's five-option Target Type — too wide for one)
       counts as two, and starts a fresh row if only one column is left, so every cell still
       lands on the grid's own three column lines */
    const span = (f[3]||{}).wide ? 2 : 1;
    if (used + span > 3){ out.push(row(cells)); cells = []; used = 0; }
    cells.push(dpCell(f)); used += span;
    if (f[0] === 'cred' && (f[3]||{}).create){ cells.push(`<div class="dpfi btm"><button type="button" class="dpbtn" onclick="dpCredForm()">Create Credential Profile</button></div>`); used++; }
    if (used >= 3){ out.push(row(cells)); cells = []; used = 0; }
  });
  if (cells.length){ out.push(row(cells)); cells = []; }
  if (T.params.length){
    out.push(`<div class="dph3">${dpEsc(T.sec)}</div>`);
    T.params.forEach(f => { cells.push(dpCell(f)); if (cells.length === 3){ out.push(row(cells)); cells = []; } });
    if (cells.length){ out.push(row(cells)); cells = []; }
  }
  (T.extra || []).forEach(([h, fs]) => { out.push(`<div class="dph3">${dpEsc(h)}</div>`); out.push(row(fs.map(dpCell))); });
  out.push(`<div class="dph3">Notifications</div>`);
  out.push(row([dpCell(DP_NOTIFY)]));
  return out.join('');
}
function dpFootHTML(){
  return `<div class="dpff"><button type="button" class="dpbtn" onclick="dpSave('exit')">Save and Exit</button><button type="button" class="dpbtn" onclick="dpSave('schedule')">Save and Schedule</button><span class="sp"></span><button type="button" class="dpbtn reset" onclick="dpReset()">Reset</button><button type="button" class="dpbtn pri" onclick="dpSave('run')">Save and Run</button></div>`;
}
function dpFormAfter(){ if (DP.f && DP.f.mode === 'create'){ const i = document.querySelector('#stMain #dpfi-name input'); if (i) i.focus(); } }
/* a repaint keeps the two scrollers where they were — stMainPaint() resets #stMain, and this
   page's scrolling lives in .dpform and .dprail, so both are read before and put back after */
function dpRepaint(){
  const g = k => { const e = document.querySelector('#stMain ' + k); return e ? e.scrollTop : 0; };
  const a = g('.dpform'), b = g('.dprail');
  stMainPaint();
  const s = k => document.querySelector('#stMain ' + k);
  if (s('.dpform')) s('.dpform').scrollTop = a; if (s('.dprail')) s('.dprail').scrollTop = b;
}
function dpIn(k, v){ const F = DP.f; F.v[k] = v; if (F.tried){ dpValidate(k); const el = document.getElementById('dpfi-' + k); if (el) el.classList.toggle('err', !!F.err[k]); } }
function dpSet(k, v){ const F = DP.f; F.v[k] = v; if (k === 'tmode' && v !== 'CSV' && /\.csv$/i.test(F.v.target || '')) F.v.target = ''; if (F.tried) dpValidate(k); dpRepaint(); }
function dpTog(k, btn){ const F = DP.f; F.v[k] = !F.v[k]; btn.classList.toggle('on', F.v[k]); btn.setAttribute('aria-checked', F.v[k]); btn.querySelector('.lb').textContent = F.v[k] ? 'ON' : 'OFF'; }
function dpFieldDef(k){ const T = DP_FORMS[DP.f.type]; if (k === 'target' || k === 'tmode') return dpFields(T).find(f => f[2] === 'target'); return dpFields(T).find(f => f[0] === k) || (k === 'name' ? DP_COMMON_HEAD[0] : null); }
function dpValidate(k){
  const F = DP.f, f = dpFieldDef(k); if (!f) return true;
  const o = f[3] || {}, v = F.v[k]; let bad = false;
  if (k === 'name'){ const n = String(v||'').trim().toLowerCase(); bad = !n || DP.rows.some(r => r.n.toLowerCase() === n && !(F.mode === 'edit' && r.id === F.id)); }
  else if (o.req){ bad = Array.isArray(v) ? !v.length : (v === '' || v == null); }
  if (bad) F.err[k] = 1; else delete F.err[k];
  return !bad;
}
function dpValidateAll(){
  const F = DP.f, T = DP_FORMS[F.type]; F.err = {}; let ok = dpValidate('name');
  dpFields(T).forEach(f => { const k = f[2] === 'target' ? 'target' : f[0]; if (!dpValidate(k)) ok = false; });
  return ok;
}
function dpPick(ev, k){
  const F = DP.f, f = dpFieldDef(k), o = (f && f[3]) || {}, opts = o.opts || [];
  stcPick(ev.currentTarget, {items: opts.map(t => ({k:t, t})), cur:F.v[k], search: opts.length > 8, onPick:v => dpSet(k, v), matchWidth:true, width:240});
}
function dpMultiOpts(k, o){
  if (o.src === 'groups') return DP_GROUPS_ALL;
  if (o.src === 'creds') return DP.creds.map(c => c.n);
  if (o.src === 'monitors') return (typeof STC_DEVICES !== 'undefined' ? STC_DEVICES : []).map(d => d.n);
  if (k === 'coll') return DP_COLLECTORS;
  return o.opts || [];
}
/* a multi picker with the live list's "Select All" as its first row */
function dpMulti(ev, k){
  const F = DP.f, f = dpFieldDef(k), o = (f && f[3]) || {}, opts = dpMultiOpts(k, o), cur = F.v[k] || [];
  const items = (opts.length > 3 ? [{k:'__all', t:'Select All'}] : []).concat(opts.map(t => ({k:t, t})));
  stcPick(ev.currentTarget, {title: f ? f[1] : '', items, cur: cur.length === opts.length && opts.length > 3 ? ['__all'].concat(cur) : cur, multi:true, search: opts.length > 6,
    onPick:sel => { const had = cur.length === opts.length && opts.length > 3; let v = sel.filter(x => x !== '__all'); if (sel.includes('__all') && !had) v = [...opts]; else if (!sel.includes('__all') && had) v = []; dpSet(k, v); }, matchWidth:true, width:280});
}
/* Tags: type a tag and press Enter, click one to drop it (the live ant tags-mode select) */
function dpTags(ev){
  const F = DP.f, anchor = ev.currentTarget;
  const paint = () => {
    el.innerHTML = `<div class="stcms">${stcSvg('search')}<input placeholder="Type a tag and press Enter"></div><div class="stcml">${F.v.tags.length ? F.v.tags.map(t => `<div class="stcmi" data-t="${dpEsc(t)}"><span style="flex:1">${dpEsc(t)}</span>${stcSvg('times')}</div>`).join('') : '<div class="stcmi hd">No tags yet</div>'}</div>`;
    const inp = el.querySelector('input'); inp.onkeydown = e => { if (e.key === 'Enter'){ const t = inp.value.trim(); if (t && !F.v.tags.includes(t)) F.v.tags.push(t); paint(); el.querySelector('input').focus(); dpRepaintSoft(); } };
    el.querySelectorAll('.stcmi[data-t]').forEach(m => m.onclick = () => { F.v.tags = F.v.tags.filter(t => t !== m.dataset.t); paint(); dpRepaintSoft(); });
    setTimeout(() => { const i = el.querySelector('input'); i && i.focus(); }, 0);
  };
  const el = stcPop(anchor, '', {matchWidth:true, focus:false}); if (!el) return; el.style.minWidth = '300px'; paint();
}
/* repaint the field the open picker belongs to without tearing the picker down */
function dpRepaintSoft(){ const F = DP.f, fi = document.getElementById('dpfi-tags'); if (!fi) return; const v = fi.querySelector('.dpsel .v'); v.className = 'v' + (F.v.tags.length ? '' : ' ph'); v.innerHTML = F.v.tags.length ? F.v.tags.map(t => `<span class="stctag">${dpEsc(t)}</span>`).join('') : 'Add Tags'; }
function dpReset(){ const F = DP.f; F.v = JSON.parse(JSON.stringify(F.init)); F.err = {}; F.tried = false; F.bcc = false; dpRepaint(); }
/* Save and Exit · Save and Schedule · Save and Run — one commit, three ways out. A new profile
   opens "Not Run Yet"; Save and Run then runs it in the list (the inferred ⟳), Save and Schedule
   opens its schedule drawer over the list. */
function dpSave(how){
  const F = DP.f, T = DP_FORMS[F.type];
  if (!dpValidateAll()){ F.tried = true; dpRepaint(); const bad = document.querySelector('#stMain .dpfi.err'); if (bad) bad.scrollIntoView({block:'nearest'}); return; }
  const v = F.v, target = 'target' in v ? v.target : ('ip' in v ? v.ip : ('url' in v ? v.url : ''));
  const ic = dpIconFor(F.type, v), ty = dpTypeName(F.type, v), keep = {vkind:1, hkind:1, ckind:1, pkind:1, wkind:1, vendor:1, model:1, dbt:1};
  const fv = {}; Object.keys(v).forEach(k => { if (keep[k]) fv[k] = v[k]; });
  let r;
  if (F.mode === 'edit'){ r = DP.rows.find(x => x.id === F.id); Object.assign(r, {n:v.name.trim(), t:target, ic, ty, g:[...(v.groups||[])], cred:[...(v.cred||[])], col:(v.coll||[]).length ? [...v.coll] : ['motadata'], tags:[...(v.tags||[])], fty:F.type, fv}); }
  else { r = {id: DP.rows.reduce((m, x) => Math.max(m, x.id), 0) + 1, n:v.name.trim(), t:target, ic, ty, c:0, s:'Not Run Yet', g:[...(v.groups||[])], cred:[...(v.cred||[])], col:(v.coll||[]).length ? [...v.coll] : ['motadata'], tags:[...(v.tags||[])], sched:null, fty:F.type, fv}; DP.rows.push(r); }
  const id = r.id, name = r.n, edit = F.mode === 'edit';
  stFullClose();
  if (how === 'run'){ toast(`Discovery profile “${name}” ${edit ? 'updated' : 'created'} — running`); dpRun(id); }
  else if (how === 'schedule'){ toast(`Discovery profile “${name}” ${edit ? 'updated' : 'created'}`); dpSchedule(id); }
  else toast(`Discovery profile “${name}” ${edit ? 'updated' : 'created'}`);
}
function dpHelpTog(i){ const F = DP.f; F.help[i] = !F.help[i]; const c = document.querySelectorAll('#stMain .dphc')[i]; if (c) c.classList.toggle('open', F.help[i]); }
function dpCopy(btn){
  const t = btn.parentElement.querySelector('span').textContent;
  const done = () => toast('Copied to the clipboard');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, () => dpCopyFallback(t, done)); else dpCopyFallback(t, done);
}
function dpCopyFallback(t, done){ const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
function dpHelpBody(b){
  const F = DP.f;
  return b.map(x => {
    const [k, a] = x;
    if (k === 'p') return `<p>${dpEsc(a)}</p>`;
    if (k === 'p2') return `<p>${dpEsc(a)}</p>`;
    if (k === 'h') return `<div class="h">${dpEsc(a)}</div>`;
    if (k === 'l') return `<div class="l">${dpEsc(a)}</div>`;
    if (k === 'ul') return `<ul>${a.map(li => li[0] === 'b' ? `<li><b>${dpEsc(li[1])}</b>${dpEsc(li[2])}</li>` : `<li>${dpEsc(li[0])}</li>`).join('')}</ul>`;
    if (k === 'code') return `<div class="dpcode"><span>${dpEsc(a)}</span><svg class="cp" viewBox="0 0 48 48" data-tip="Copy" onclick="dpCopy(this)"><path fill="currentColor" d="${STC_ICO.clone}"/></svg></div>`;
    if (k === 'os') return `<div class="dpos">${Object.keys(DP_DISTRO).map(d => `<span class="dpost" data-tip="${DP_DISTRO[d][0]}"><svg viewBox="0 0 24 24"><path fill="currentColor" d="${DP_DISTRO[d][1]}"/></svg></span>`).join('')}<span class="dpost more">+1</span></div>`;
    if (k === 'tabs') return `<div class="dphtabs"><div class="dpseg">${a.map(t => `<button type="button" class="${F.fw===t?'on':''}" onclick="DP.f.fw=${stA(t)};dpRepaint()">${t}</button>`).join('')}</div></div>`;
    return '';
  }).join('');
}
function dpHelpHTML(){
  const F = DP.f;
  return `<h4 class="dphh">Discovery Help Card</h4>${F.type !== 'Linux / Unix' ? `<div class="dphnote">Showing the Linux / Unix card — this prototype harvested one help card; the live text differs per type.</div>` : ''}
    ${DP_HELP.map((h, i) => `<div class="dphc${F.help[i]?' open':''}"><div class="dphch" onclick="dpHelpTog(${i})"><span>${dpEsc(h.t)}</span>${stcSvg('chevron-right','car')}</div><div class="dphcb">${dpHelpBody(h.b)}</div></div>`).join('')}
    <div class="dphmore">For more information: <a href="${DP_HELP_LINK}" target="_blank" rel="noopener noreferrer">Discovery Profile${stcSvg('external-link')}</a></div>`;
}

/* ── Create Credential Profile — the live 682px drawer over a blurred backdrop ─────────────── */
function dpCredForm(){
  DP.cf = {name:'', proto:'SSH', user:'', pass:'', key:'', phrase:'', cli:false, ctp:'', ecmd:'', euser:'', epass:'', epp:'', eprompt:'', cmc:'', cpass:'', vrf:'', showPw:false, err:{}, tried:false};
  dpCfPaint(true);
}
function dpCfPaint(open){
  const C = DP.cf, E = C.err;
  const fi = (k, lab, req, inner) => `<div class="dpfi${E[k]?' err':''}" id="dpcf-${k}"><span class="dplab${req?' req':''}">${lab}</span>${inner}</div>`;
  const inp = (k, ph, type) => `<input class="dpin" type="${type||'text'}" placeholder="${dpEsc(ph||'')}" value="${dpEsc(C[k])}" oninput="dpCfIn('${k}',this.value)">`;
  const body = `<div class="dpsch">
    <div class="dpfr">${fi('name', 'Credential Profile Name', 1, inp('name', 'Must be unique'))}${fi('proto', 'Protocol', 1, `<div class="dpsel dis"><span class="v">SSH</span>${stcSvg('chevron-down','car')}</div>`)}</div>
    <div class="dpfr">${fi('user', 'User Name', 1, inp('user', 'User Name'))}${fi('pass', 'Password', 0, `<div class="dpnot"><input class="dpin" type="${C.showPw?'text':'password'}" placeholder="Password" value="${dpEsc(C.pass)}" oninput="dpCfIn('pass',this.value)"><button type="button" class="stcib" data-tip="Reset" onclick="dpCfIn('pass','');dpCfPaint()">${stcSvg('lock-alt')}</button><button type="button" class="stcib" data-tip="${C.showPw?'Hide':'Show'}" onclick="DP.cf.showPw=!DP.cf.showPw;dpCfPaint()">${stcSvg('eye')}</button></div>`)}</div>
    <div class="dpfr">${fi('key', 'SSH Key', 0, `<textarea class="dpin" placeholder="Paste the private key" oninput="dpCfIn('key',this.value)">${dpEsc(C.key)}</textarea>`)}${fi('phrase', 'Passphrase', 0, inp('phrase', 'Passphrase', 'password'))}</div>
    <label class="dpck" style="margin:2px 0 14px"><span class="stcck${C.cli?' on':''}" onclick="DP.cf.cli=!DP.cf.cli;dpCfPaint()">${stcSvg('check')}</span>Cli options</label>
    ${C.cli ? `<div class="dpfr">${fi('ctp', 'Config Transfer Protocol', 1, `<div class="dpsel" onclick="dpCfPick(event)"><span class="v${C.ctp?'':' ph'}">${C.ctp || 'Select'}</span>${stcSvg('chevron-down','car')}</div>`)}${fi('ecmd', 'Enable Command', 0, inp('ecmd', 'enable'))}</div>
      <div class="dpfr">${fi('euser', 'Enable User Name', 0, inp('euser', ''))}${fi('epass', 'Enable Password', 0, inp('epass', '', 'password'))}</div>
      <div class="dpfr">${fi('epp', 'Enable Password Prompt Pattern', 0, inp('epp', 'e.g. Password:')).replace('</span>', `<span class="dpinfo" data-tip="The prompt the device prints before it asks for the enable password">${stcSvg('info-circle')}</span></span>`)}${fi('eprompt', 'Enable Prompt', 1, inp('eprompt', 'e.g. #'))}</div>
      <div class="dpfr">${fi('cmc', 'Config Mode Command', 0, inp('cmc', 'configure terminal'))}${fi('cpass', 'Config Password', 0, inp('cpass', '', 'password'))}</div>
      <div class="dpfr">${fi('vrf', 'VRF Name', 0, inp('vrf', ''))}</div>` : ''}
    <div class="dphmore">For more information: <a href="https://docs.motadata.com/observeops-docs/Adding%20and%20Managing%20Devices/credential-profile/" target="_blank" rel="noopener noreferrer">Credential Profile${stcSvg('external-link')}</a></div></div>`;
  const foot = `<span class="mand"><b>*</b> fields are mandatory</span><button class="stbtn" onclick="dpCredForm()">Reset</button><button class="stbtn" onclick="dpCfTest()">Test</button><button class="stbtn pri" onclick="dpCfSubmit()">Create Credentials Profile</button>`;
  if (open) stcDrOpen('Create Credential Profile', body, foot); else { document.getElementById('stcDrB').innerHTML = body; }
}
function dpCfIn(k, v){ const C = DP.cf; C[k] = v; if (C.tried){ dpCfValidate(); const el = document.getElementById('dpcf-' + k); if (el) el.classList.toggle('err', !!C.err[k]); } }
function dpCfPick(ev){ stcPick(ev.currentTarget, {items:['SCP','SFTP','TFTP','FTP'].map(t => ({k:t, t})), cur:DP.cf.ctp, search:false, onPick:v => { DP.cf.ctp = v; dpCfPaint(); }, matchWidth:true}); }
function dpCfValidate(){
  const C = DP.cf; C.err = {};
  const n = C.name.trim().toLowerCase();
  if (!n || DP.creds.some(c => c.n.toLowerCase() === n)) C.err.name = 1;
  if (!C.user.trim()) C.err.user = 1;
  if (C.cli){ if (!C.ctp) C.err.ctp = 1; if (!C.eprompt.trim()) C.err.eprompt = 1; }
  return !Object.keys(C.err).length;
}
/* Test — the live button connects to a device with the credential; this page can only check
   the form is complete, and its toast says exactly that rather than claiming a connection */
function dpCfTest(){ const C = DP.cf; C.tried = true; if (!dpCfValidate()){ dpCfPaint(); return; } toast(`“${C.name.trim()}” is complete — the live Test connects to a device; this prototype does not`); }
function dpCfSubmit(){
  const C = DP.cf; C.tried = true; if (!dpCfValidate()){ dpCfPaint(); return; }
  const rec = {id: DP.creds.reduce((m, x) => Math.max(m, x.id), 0) + 1, n:C.name.trim(), p:'SSH', u:C.user.trim()};
  DP.creds.push(rec);
  if (DP.f && Array.isArray(DP.f.v.cred) && !DP.f.v.cred.includes(rec.n)) DP.f.v.cred.push(rec.n);
  stcDrClose(); if (DP.f) dpRepaint(); toast(`Credential profile “${rec.n}” created and selected`);
}

/* ── register the page with the Settings module ───────────────────────────────────────────── */
ST_PAGES['Discovery Settings › Discovery Profile'] = { html: dpListHTML };


/* ══════════════════════════════════════════════════════════════════════════════════════════
   BLOCK 3 of 3 — `ag*` · Agentic AI
   ══════════════════════════════════════════════════════════════════════════════════════════ */
/* ══ AGENTIC AI (`ag*`) — Settings › Agentic AI › AI Provider ════════════════════════════════
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
   function name. The page root carries data-agopt="1|2|3" so CSS can scope to one option without touching the other.
   ⚠️ OPTION 3 IS A COPY OF OPTION 1 (request, 16 Sep 2026: "in agentic AI the option 1 copy and create option3"), and
   it needed ONE LINE — this array. Every branch in the block asks `AG.opt === '2'` or `!== '2'`, so a third option
   falls into Option 1's path by construction: same overview table with its search, same drawer with its provider rail
   and help card, same KMS caption, same "Accept & enable AI" and the same done step. Nothing is duplicated, so the two
   cannot drift until something is asked for — and that ask is a `AG.opt === '3'` branch at the part that changes.
   ⚠️ AN `=== '1'` TEST WOULD HAVE BROKEN IT, and there is none: every branch was checked before adding the option
   rather than after. A test written as "is it Option 1" instead of "is it not Option 2" would silently drop Option 3
   into neither path. Keep that shape if a fourth is ever added. */
const AG_OPTS = [{ value:'1', label:'Option 1' }, { value:'2', label:'Option 2' }, { value:'3', label:'Option 3' }];
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

/* ══ THE ASK-AI MARK (request, 21 Sep 2026: "the header ai icon will be use ask ai logo") ══
   The assistant's own four-point star on the brand ramp, pasted verbatim from index.html's
   `AI_SPARK_PATH` and its `aisprkg` gradient.
   ⚠️ IT IS DECLARED HERE, NOT READ FROM THE PAGE. `AI_SPARK_PATH` is a page-level const and
   only SOME of the fourteen pages have it — index.html took the gradient star on 17 Sep, Option 14
   still carries the speech bubble, Options 2 and 3 their own. `setting.js` is one file shared by
   all of them, so reaching across would make this header depend on which page it opened on — the
   same rule `AG_MODULES` follows.
   ⚠️ THE GRADIENT LIVES INSIDE THIS SAME <svg>, so the mark is self-contained and needs no
   body-level <defs> on any of the fourteen pages.
   ⚠️ THE id IS NAMESPACED `agsprkg`. An SVG id is GLOBAL to the document and index.html already
   declares `aisprkg` — two defs under one name and whichever parses last wins for both.
   ⚠️ THE FILL IS AN INLINE STYLE, NOT A `fill=` ATTRIBUTE. A CSS rule beats a presentation
   attribute, so an attribute would let any `svg{fill:...}` in a host page flatten the ramp.
   ⚠️ viewBox STAYS 48 — the art was drawn in it and every consumer sizes the <svg> in CSS. */
const AG_SPARK = '<svg viewBox="0 0 48 48" aria-hidden="true">'
  + '<defs><radialGradient id="agsprkg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"'
  + ' gradientTransform="translate(45.7817 23.9609) rotate(-165.676) scale(43.3694 27.715)">'
  + '<stop stop-color="#4CB1FE"/><stop offset="0.547969" stop-color="#731EFB"/>'
  + '<stop offset="0.907125" stop-color="#F911E3"/></radialGradient></defs>'
  + '<path style="fill:url(#agsprkg)" d="M23.9609 0C24.463 0 24.9009 0.343385 25.0235 0.830769C25.3981 2.32146 25.8918 3.77968 26.4997 5.19138C28.0889 8.88369 30.2695 12.1152 33.038 14.8837C35.808 17.6529 39.0388 19.8336 42.7303 21.4228C44.1424 22.0305 45.6008 22.5241 47.0917 22.899C47.5791 23.0215 47.9217 23.4587 47.9217 23.9609C47.9217 24.463 47.5791 24.9009 47.091 25.0235C45.6003 25.3981 44.142 25.8918 42.7303 26.4997C39.038 28.0889 35.8073 30.2695 33.038 33.038C30.2695 35.808 28.0889 39.0388 26.4997 42.7303C25.8917 44.1423 25.3978 45.6008 25.0228 47.0917C24.9634 47.3285 24.8267 47.5388 24.6344 47.6891C24.442 47.8395 24.205 47.9213 23.9609 47.9217C23.4587 47.9217 23.0215 47.5791 22.899 47.091C22.5241 45.6003 22.0302 44.142 21.422 42.7303C19.8336 39.038 17.6537 35.8073 14.8837 33.038C12.1145 30.2695 8.88369 28.0889 5.19138 26.4997C3.77962 25.8917 2.32142 25.3978 0.830769 25.0228C0.593936 24.9636 0.383619 24.8271 0.233136 24.6349C0.0826532 24.4426 0.000608909 24.2057 0 23.9616C0 23.4594 0.343385 23.0223 0.830769 22.8997C2.32148 22.5248 3.7797 22.0309 5.19138 21.4228C8.88369 19.8343 12.1152 17.6537 14.8837 14.8844C17.6529 12.1159 19.8336 8.88443 21.4228 5.19212C22.0305 3.78034 22.5241 2.32213 22.899 0.831508C22.958 0.594415 23.0946 0.38384 23.287 0.233201C23.4793 0.082561 23.7165 0.000485916 23.9609 0Z"/></svg>';

function agOvHTML(){
  /* Organisms/PageHeader. `heading`, not `title` — `title` would set a native tooltip.
     ⚠️ `heading` AND the `title` SLOT COEXIST (measured): the slot APPENDS after the heading,
     it does not replace it, which is the only reason the status tag can sit beside the title
     at full size. `tag-green` is the DS's own answer for the status string "active" (Tag's
     statusMap); `tag-primary` is its neutral chip, which is what "not configured" is. */
  const head = `<div class="aghead">
    <obs-page-header class="aghph" heading="Agentic AI" no-divider>
      <span slot="before" class="aghmk">${AG_SPARK}</span>
      ${/* ⚠️ NO STATUS TAG ON OPTION 3 (request, 21 Sep 2026: "in this screen remove the
           active tag in header", with Option 3 on screen).
           ⚠️ SCOPED TO OPTION 3, not removed outright. Options 1 and 2 are single-provider
           screens whose whole subject is the ONE connection, and this tag is where each says
           whether it has one — taking it from them would strip a real state with nothing else
           reporting it.
           ⚠️ CONSEQUENCE, STATED: Option 3's header now says nothing about state. That is
           defensible there and nowhere else — it is the multi-provider screen, so "Active" was
           describing one of three cards without saying which, and the cards are where a
           provider's own state belongs. */''}
      ${AG.opt === '3' ? '' : `<obs-tag slot="title" variant="${AG.active ? 'tag-green' : 'tag-primary'}">${AG.active ? 'Active' : 'Not configured'}</obs-tag>`}
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
  /* ⚠️ OPTION 3 SHOWS NO TABLE AT ALL (request, 16 Sep 2026: "remove the grid"), so its page is the
     header and the toolbar. It was a copy of Option 1 from this morning; this is the first thing
     that makes it its own design, and the branch is `=== '3'` at the one part that changes — the
     pattern this block's header describes.
     ⚠️ THE SEARCH GOES WITH IT, exactly as it did when Option 2 dropped its grid: that box filters
     the table and nothing else, so over a page with no table it is a control that cannot do
     anything. Stated rather than assumed — the request said "remove the grid", and this is the
     neighbouring control the removal makes dead. */
  const o3 = AG.opt === '3';
  const toolbar = `<obs-toolbar>
      ${o2 || o3 ? '' : `<obs-input slot="start" class="agsrch" placeholder="Search" value="${AG.q.replace(/"/g,'&quot;')}"
        oninput="agSearch(agDet(event))">${agIc('search', 14).replace('<obs-icon', '<obs-icon slot="prefix"')}</obs-input>`}
      ${/* ⚠️ NO EXPORT ON OPTION 3 (request, 21 Sep 2026: "in agentic ai the option 3 remove
           export as pdf"). Options 1 and 2 keep it and `agExportPdf` is untouched — this is the
           button, not the feature. Option 3 has no usage table and no connection panel, so the
           PDF it would print is three provider cards. */''}
      ${o3 ? '' : `<obs-button variant="default" class="agexp" data-tip="Export as PDF"
        onclick="agTap(agExportPdf)">${agIc('export-pdf', 15)}</obs-button>`}
      ${/* ⚠️ OPTION 3 RENAMES THIS BUTTON (request, 16 Sep 2026: "remove the button 'Configure AI
           provider' because this button is also provided in card, but add a new button in the replaced
           button position — the name is 'Advanced configure'"). Every card already carries its own
           Configure / Change API key, so a toolbar control repeating that word said the same thing a
           fourth time on one screen.
           ⚠️ IT IS A RENAME, NOT A NEW CONTROL — same slot, same `agConfig`, same drawer. The request
           asked for a button in the removed one's position, which is what this is; nothing was added
           beside it and nothing else moved.
           ⚠️ STATED, NOT ACTED ON: the WORD now promises more than the button delivers. Option 3's drawer
           became Option 2's compact form minutes earlier — no Advanced settings, no Model selection — so
           "Advanced" names a form that is currently the barest of the three. Pointing it at Option 1's full
           form instead is one branch in `agCfgHTML`, and would make the name true. */''}
      <obs-button variant="primary" onclick="agTap(${o3 ? 'agAdvOpen' : 'agConfig'})">${
        o3 ? 'Advanced configure' : 'Configure AI provider'}</obs-button>
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
  const usage = o2 ? agGridHTML() : o3 ? agCardsHTML() : !AG.active ? '' : `<obs-table id="agUse" row-key="id" sortable expandable
      header-style="tinted" empty-text="No records available"
      columns="${agJ(AG_USE_COLS)}" rows="${agJ(agUseRows())}"></obs-table>`;

  /* ⚠️ THE NOTE FOLLOWS THE GRID (request, 16 Sep 2026: "swap in grid and note"). It reads as a
     footnote to the table now rather than a preamble to it — which is also the order the drawer
     settled on the same day: the thing itself first, then the rule that governs it. */
  return `<div class="agpage" id="agPage" data-agopt="${AG.opt}">${head}${toolbar}${usage}${agOneNoteHTML('overview')}</div>`;
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
/* ⚠️ WHICH OPTIONS USE THE COMPACT FORM DRAWER — asked once, here, and read by every branch that used to
   test `AG.opt === '2'` on the Configure screen (request, 16 Sep 2026: "copy option 2 sidebar 'Configure AI
   provider' and paste in option 3", confirmed as the WHOLE drawer rather than only its width).
   ⚠️ IT IS A PREDICATE, NOT NINE `|| AG.opt === '3'`s. Ten places decide this drawer's shape — its width,
   its `agcfgo2` class, the rail, the help card, the body, the provider picker, the credentials heading,
   Advanced settings, the test banner's tail, the footer's caption, its primary and what that primary does.
   Spelling the answer out at each of them is how two of them end up disagreeing.
   ⚠️ IT IS ABOUT THE DRAWER ONLY. The OVERVIEW still branches on the real option — Option 2 draws the
   grid, Option 3 the provider cards — and `agCfgSave`'s one-at-a-time wipe still tests `AG.opt !== '3'`,
   because Option 3 is multi-provider by an earlier request. Do not fold those into this.
   ⚠️ WHAT THIS DELETED, STATED: Option 3's titled "AI provider" rail, built from the product's APM ›
   Application Registration screen earlier the same day. The compact drawer is 684px — a 230px rail plus a
   720px form does not fit in it, which is why Option 2 never had one. Its CSS (`.agcfgnav` / `.agcfgnt` and
   the `obs-side-menu` entry in the shadow-sheet map) is KEPT AND UNREFERENCED, the house pattern, so the
   rail is one `o2` back. */
const agO2Form = () => AG.opt === '2' || AG.opt === '3';

/* ══ ADVANCED CONFIGURE ════════════════════════════════════════════════════════════════════
   Request, 16 Sep 2026, with the product's APM › Application Registration screen as the reference and a
   five-point spec: (1) the rail lists all module names, (2) the middle column picks one of the three AI
   providers, (3) below it an **Agent** dropdown of Agent 1–4, (4) then a **Model**, (5) then
   High / Medium / Low / Critical — and a Save button at the bottom.

   ⚠️ THE MODULE LIST IS THE PRODUCT'S OWN, NOT A GUESS. `_product-docs/MOTADATA-PRODUCT-REFERENCE.md`
   §1 names sixteen: Dashboards · Monitors · Alerts · SLO (BETA) · Reports · Topology · NCCM · NetRoute ·
   Metric Explorer · Log Explorer · APM Explorer · RUM Explorer · Flow Explorer · Trap Explorer · Audits ·
   Settings. The repo rule is to read the digested docs before inventing anything, and this is what they say.
   ⚠️ IT IS DECLARED HERE, NOT READ FROM THE PAGE'S `MODULES`. That array is a page-level `const` and this
   file is shared by thirteen pages; reaching across would make the screen depend on which page it opens on.
   ⚠️ THE RAIL CARRIES A GLYPH PER MODULE (request, 16 Sep 2026), and ALL SIXTEEN NAMES WERE RENDER-CHECKED
   BEFORE BEING WRITTEN IN. `agIc` renders an `obs-icon`, and a name the bundle does not have emits an empty
   comment — NOTHING, with no error — so a guessed name is one invisible row among fifteen and nothing
   reports it. The probe appended all 63 candidates and read each shadow root for an `<svg>`.
   ⚠️ THE PLURAL IS USUALLY THE WRONG ONE. `settings` renders and **`setting` does not** — which is the
   opposite of the host pages' own `ICONS`, where the key is `setting`; and `monitors` / `alerts` / `reports`
   / `audits` / `nccm` / `flows` / `logs` / `metrics` / `trap` all render nothing while their siblings
   `monitor` / `alert` / `report` / `audit` / `ncm` / `flow` / `log` / `metric-explorer` / `trap-viewer` do.
   Re-probe, never re-derive, if `_ds/` is upgraded.
   ⚠️ "Priority" IS MY LABEL. The spec gave the four values and no name for the field. Say so rather than
   let a made-up label read as the product's.
   ⚠️ THE FOUR VALUES ARE THE SPEC'S, NOT THE PRODUCT'S FIVE SEVERITIES (Critical · Major · Warning · Minor ·
   Clear, per the same reference §1). They were asked for verbatim, so they are used verbatim. */
const AG_MODULES = ['Dashboards','Monitors','Alerts','SLO','Reports','Topology','NCCM','NetRoute',
  'Metric Explorer','Log Explorer','APM Explorer','RUM Explorer','Flow Explorer','Trap Explorer',
  'Audits','Settings'];
const AG_MOD_IC = { 'Dashboards':'dashboard', 'Monitors':'monitor', 'Alerts':'alert', 'SLO':'slo',
  'Reports':'report', 'Topology':'topology', 'NCCM':'ncm', 'NetRoute':'netroute',
  'Metric Explorer':'metric-explorer', 'Log Explorer':'log', 'APM Explorer':'apm', 'RUM Explorer':'rum',
  'Flow Explorer':'flow', 'Trap Explorer':'trap-viewer', 'Audits':'audit', 'Settings':'settings' };
const AG_AGENTS = ['Agent 1','Agent 2','Agent 3','Agent 4'];
const AG_PRIORITY = ['High','Medium','Low','Critical'];

/* ⚠️ THE FOUR AGENT ROLES ARE MINE, AND THE SPEC GAVE ONLY FOUR NAMES. The request was for a note under the
   Agent field saying "how the agent works and where it works"; `Agent 1`–`Agent 4` are placeholders — the
   product docs define no such thing — so a note that merely repeated the number would have been the feature
   not working, and one that quoted a product behaviour would have been inventing product. What each agent
   DOES is therefore a plain reading of the four ways an assistant can be triggered, carries no invented
   numbers or intervals, and is flagged here as ours. Replace it the moment the real ones are known.
   ⚠️ WHERE IT RUNS IS DERIVED, NOT WRITTEN — the module, the provider and the model all come off the record
   the form is editing, so the note cannot name a module you are not on or a model that provider does not
   serve. That half of the sentence is the half that is true by construction. */
const AG_AGENT_HOW = {
  'Agent 1': "works through the module's own data on a fixed schedule and leaves what it finds on that module's screens",
  'Agent 2': 'works only when someone asks it something from that module — nothing runs in the background',
  'Agent 3': 'wakes when the module raises something — an alert, a breached threshold, a failed check — and works that one item',
  'Agent 4': "watches the module's live stream and works items as they arrive"
};

/* ⚠️ THE TRAIL IS DECLARED HERE, NOT READ FROM THE PAGE'S `EXPLORER_TREE` — same rule as `AG_MODULES`:
   that array is a page-level `const` and this file is shared by thirteen pages, so reaching across would
   make the note depend on which page the drawer was opened from. The grouping is the docs' own §1
   taxonomy (the six Explorers, plus Monitor / Topology / NCCM / NetRoute / Audit, all sit under Explorer;
   Dashboards, Alert, SLO, Report and Settings are top level).
   ⚠️ `AI features` IS THIS SCREEN'S OWN WORDING, not a new noun — it is what the Configure form's primary
   has always said ("Accept & enable AI"), so the trail ends somewhere the product already names. */
const AG_MOD_PATH = {
  'Dashboards':['Dashboards'], 'Monitors':['Explorer','Monitor'], 'Alerts':['Alert'], 'SLO':['SLO'],
  'Reports':['Report'], 'Topology':['Explorer','Topology'], 'NCCM':['Explorer','NCCM'],
  'NetRoute':['Explorer','NetRoute'], 'Metric Explorer':['Explorer','Metric Explorer'],
  'Log Explorer':['Explorer','Log Explorer'], 'APM Explorer':['Explorer','APM Explorer'],
  'RUM Explorer':['Explorer','RUM Explorer'], 'Flow Explorer':['Explorer','Flow Explorer'],
  'Trap Explorer':['Explorer','Trap Explorer'], 'Audits':['Explorer','Audit'], 'Settings':['Settings']
};

/* ⚠️ THE SEPARATOR IS THE CHARACTER, NOT A DRAWN GLYPH. The supplied reference is a text trail, `→` is a
   real character rather than hand-drawn path data, and it inherits the row's colour and size for free —
   so the icon rule ("never hand-draw one") is satisfied without loading a mark for punctuation. */
function agAdvCrumbHTML(){
  const trail = ['ObserveOps'].concat(AG_MOD_PATH[AG.adv.mod] || [AG.adv.mod], ['AI features', agAdvRec().agent]);
  return `<span class="agadvcrumb">${trail.map((c, i) => (i ? '<span class="sep">\u2192</span>' : '') +
    `<span class="c${i === trail.length - 1 ? ' cur' : ''}">${stEsc(c)}</span>`).join('')}</span>`;
}

function agAdvNoteHTML(){
  const r = agAdvRec(), p = agProv(r.prov);
  const mdl = (p.models.filter(m => m.id === r.model)[0] || p.models[0] || {}).name || r.model;
  /* ⚠️ THE MODULE IS NAMED ONCE, NOW THE TRAIL NAMES IT. The sentence used to read "scoped to
     <b>Dashboards</b>" and the breadcrumb under it would have said the same word 30px lower — the
     "every fact appears once" rule this file already applies to the summary card. The sentence keeps
     HOW and who does the reasoning; the trail is the WHERE, which is what it was added for. */
  return `<obs-banner class="agnote" variant="info" title="How ${stEsc(r.agent)} works">
      ${stEsc(r.agent)} ${AG_AGENT_HOW[r.agent] || 'works inside this module only'} — on the ObserveOps
      server, reading nothing outside the module it is scoped to. The reasoning is done by
      ${stEsc(p.name)} \u00b7 ${stEsc(mdl)}.
      ${agAdvCrumbHTML()}
    </obs-banner>`;
}

/* ⚠️ THE NOTE REPAINTS ON ITS OWN, AND THAT REPLACED A FULL-BODY REPAINT. \`agAdvSet\` used to call
   \`agAdvPaint()\`, which rewrites \`#agAdvMain\` — destroying all three \`obs-select\`s, including the one
   just used, on every pick. Only the note reads agent/model, so only the note is rebuilt; the record stays
   the truth and a module switch still rebuilds the body from it. The \`agConsPaint\` discipline. */
function agAdvNotePaint(){
  const n = document.getElementById('agAdvNote');
  if (n) n.innerHTML = agAdvNoteHTML();
}

/* one record per module, seeded so no dropdown ever opens on an empty value */
const agAdvSeed = () => {
  const o = {}, p0 = AG_DATA.providers[0];
  AG_MODULES.forEach(m => { o[m] = { prov:p0.id, agent:AG_AGENTS[0], model:p0.models[0].id, pri:AG_PRIORITY[1] }; });
  return o;
};
AG.adv = { mod:AG_MODULES[0], d:agAdvSeed() };

const agAdvRec = () => AG.adv.d[AG.adv.mod];

/* ⚠️ THE MODEL LIST BELONGS TO THE PICKED PROVIDER, so switching provider has to re-point the model or the
   row would name a model that provider does not serve — the same rule the Configure form follows. */
/* ⚠️ RESET IS SCOPED TO THE MODULE ON SCREEN, NOT THE WHOLE DRAWER. Each module keeps its own
   record (that is what makes the rail worth having), and a Reset sitting under one module's form
   that silently cleared the other fifteen would be a one-way door nothing on screen warned about.
   ⚠️ IT RE-SEEDS THE RECORD AND DOES NOT WRITE THE DEFAULTS BY HAND. `agAdvSeed` is the one
   place that knows what a default IS (first provider, first agent, that provider's first model, the
   middle priority); re-deriving them here would be a second copy of that answer, free to drift.
   ⚠️ DELETING WAS THE FIRST ATTEMPT AND WOULD HAVE BROKEN THE DRAWER: `agAdvRec()` dereferences
   `AG.adv.d[mod]` with no guard, and `agAdvPick` refuses a module whose record is missing — so a
   reset module would have rendered `undefined` and then become unreachable from the rail.
   ⚠️ IT REPAINTS THE PANE, NOT THE DRAWER BODY: replacing a slotted child fires slotchange and
   re-renders the component, and the rail is not what changed. */
function agAdvReset(){
  const m = AG.adv && AG.adv.mod; if (!m || !AG.adv.d) return;
  AG.adv.d[m] = agAdvSeed()[m];
  agAdvPaint();
  toast(m + ' reset to defaults');
}

function agAdvProv(id){
  const r = agAdvRec(); if (r.prov === id) return;
  r.prov = id; r.model = (agProv(id).models[0] || {}).id;
  agAdvPaint();
}
function agAdvSet(k, v){ agAdvRec()[k] = v; agAdvNotePaint(); }
function agAdvPick(m){ if (AG.adv.d[m]){ AG.adv.mod = m; agAdvPaint(); } }

function agAdvBodyHTML(){
  const r = agAdvRec(), p = agProv(r.prov);
  const sel = (id, label, opts, val, k) => `<div class="agadvfld">
      <span class="agflb">${stEsc(label)}</span>
      <obs-select class="agadvsel" id="${id}" options="${agJ(opts)}" value="${stEsc(val)}"
        onchange="agAdvSet('${k}', agDet(event))"></obs-select></div>`;
  return `<h2 class="agcfgh">${stEsc(AG.adv.mod)}</h2>
    <p class="agcfgp">Choose the AI provider, agent and model this module's AI features use.</p>

    <div class="agadvfld"><span class="agflb">AI provider</span></div>
    <div class="agadvtiles" id="agAdvTiles">${AG_DATA.providers.map(x => `
      <button type="button" class="agadvtile${x.id === r.prov ? ' on' : ''}" data-prov="${x.id}"
        onclick="agAdvProv('${x.id}')">
        <span class="h"><span class="agpci sm"${AG_BRAND[x.id] ? ` data-brand="${x.id}"` : ''}>${
          AG_BRAND[x.id] || agIc(x.ic, 14)}</span>${stEsc(x.name)}</span>
        <span class="d">${stEsc(x.tagline)}</span>
      </button>`).join('')}</div>

    <div class="agadvgrid">
      ${sel('agAdvAgent', 'Agent', AG_AGENTS.map(a => ({ value:a, label:a })), r.agent, 'agent')}
      ${sel('agAdvModel', 'Model', p.models.map(m => ({ value:m.id, label:m.name })), r.model, 'model')}
      ${sel('agAdvPri', 'Priority', AG_PRIORITY.map(x => ({ value:x, label:x })), r.pri, 'pri')}
    </div>
    <div id="agAdvNote">${agAdvNoteHTML()}</div>`;
}

function agAdvHTML(){
  return `<div class="agadvh">
      <span class="t">Advanced configure</span>
      <button class="agadvx" type="button" aria-label="Close" onclick="agAdvClose()">${agIc('times', 14)}</button>
    </div>
    <div class="agadvbody">
      <div class="agadvn" id="agAdvNav">${AG_MODULES.map(m => `
        <button type="button" class="agadvr${m === AG.adv.mod ? ' on' : ''}" data-mod="${stEsc(m)}"
          onclick="agAdvPick('${m.replace(/'/g, "\\'")}')"><span class="agadvic">${agIc(AG_MOD_IC[m], 18)}</span
          ><span class="nm">${stEsc(m)}</span></button>`).join('')}
      </div>
      <div class="agadvm" id="agAdvMain">${agAdvBodyHTML()}</div>
    </div>
    <div class="agadvf">
      <span class="sp"></span>
      ${/* ⚠️ RESET IS AN ICON-ONLY DS BUTTON BEFORE SAVE (request, 21 Sep 2026: "the sidebar
           show reset icon behind the save button, using the ObserveOps design system").
           ⚠️ THE VARIANT IS `default` AND THE SHAPE IS `squared-button`, both from the registry:
           usageRules.default is "the secondary next to a primary: Cancel/RESET/Clear/Back", and
           squared-button is its own answer for "a recognisable repeated space-tight icon action" —
           the 365x icon form. Its `must` is an aria-label, which is why this carries one.
           ⚠️ IT ALSO CARRIES data-tip. An icon-only control says nothing at rest, and this page's
           tooltip engine honours data-tip on an obs-* element (it only refuses to ADOPT their
           `title`, which on a DS component is a rendered prop). */''}
      <obs-button variant="default" class="squared-button" aria-label="Reset"
        data-tip="Reset this module to its defaults"
        onclick="agTap(function(){agAdvReset()})">${agIc('reset', 15)}</obs-button>
      <obs-button variant="primary" onclick="agTap(agAdvSave)">Save</obs-button>
    </div>`;
}

/* ⚠️ CREATED ONCE, ON `<body>` — see the CSS note. `#agPage` is what carries the scoped DS token block, so
   the drawer's own `id` had to be added to that block's selector list or it would paint in the DS's LIGHT
   defaults over a dark page — the exact trap the License history drawer hit when it moved to the top layer. */
function agAdvEl(){
  let d = document.getElementById('drawer-agadv');
  if (d) return d;
  const sc = document.createElement('div'); sc.id = 'agAdvScrim';
  sc.addEventListener('click', agAdvClose);
  document.body.appendChild(sc);
  d = document.createElement('div'); d.id = 'drawer-agadv'; d.className = 'agadvdr agpage';
  document.body.appendChild(d);
  return d;
}

/* ⚠️ ONLY THE INNER COLUMNS REPAINT once the drawer exists. Rewriting the whole panel would replay its
   slide-in on every keystroke and throw away the focus of the control just used — the discipline the
   Configure form already follows, and the `slotchange` lesson behind it. */
function agAdvPaint(){
  const d = document.getElementById('drawer-agadv');
  if (!d) return;
  const nav = document.getElementById('agAdvNav'), main = document.getElementById('agAdvMain');
  if (nav && main){
    [].slice.call(nav.children).forEach(b => b.classList.toggle('on', b.dataset.mod === AG.adv.mod));
    main.innerHTML = agAdvBodyHTML();
    return;
  }
  d.innerHTML = agAdvHTML();
}

function agAdvOpen(){
  const d = agAdvEl();
  agAdvPaint();
  document.body.classList.add('agdrawer');
  document.getElementById('agAdvScrim').classList.add('on');
  d.classList.add('on');
}
function agAdvClose(){
  const d = document.getElementById('drawer-agadv');
  if (d) d.classList.remove('on');
  const sc = document.getElementById('agAdvScrim'); if (sc) sc.classList.remove('on');
  document.body.classList.remove('agdrawer');
}
function agAdvSave(){
  const r = agAdvRec(), p = agProv(r.prov);
  const m = (p.models.find(x => x.id === r.model) || p.models[0]).name;
  agAdvClose();
  toast(`${AG.adv.mod} → ${p.name} · ${r.agent} · ${m} · ${r.pri}`);
}

/* ⚠️ ESCAPE, IN CAPTURE PHASE, AHEAD OF THE HOST'S OWN LADDER — the same reason `#drawer-agcfg` needs its
   own: the page's handler matches `.sdrawer.on`, which this drawer deliberately is not, so it would never
   close and its scrim would be left over the page. */
document.addEventListener('keydown', function (e){
  if (e.key !== 'Escape') return;
  const d = document.getElementById('drawer-agadv');
  if (!d || !d.classList.contains('on')) return;
  e.stopPropagation();
  agAdvClose();
}, true);

function agCfgSize(){
  const d = document.getElementById('drawer-agcfg'); if (!d) return;
  if (typeof railWidth !== 'function') return;
  /* ⚠️ OPTION 2 IS A SIDE PANEL, NOT THE FULL WIDTH (request, 16 Sep 2026, with the product's Create User drawer as the size
     reference): 684px — the product's own form-drawer width, the one the Compliance Policy drawer measured — and never
     wider than the room beside the rail */
  d.style.width = agO2Form() ? Math.min(684, innerWidth - railWidth()) + 'px'
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
  d.classList.toggle('agcfgo2', agO2Form());
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
  const o2 = agO2Form();
  return `<div class="agpage agcfg" id="agPage">
    ${o2 ? '' : `<div class="agcfgn">
      <obs-side-menu id="agCfgNav" mode="categories" search="false"
        active="${stEsc(p.name)}" items="${agJ(items)}"><div slot="logo" class="agcfgsp">${'' && `${
          /* ⚠️ THE TITLE GOES IN `obs-side-menu`'s OWN `logo` SLOT, which is the component's
             documented top-of-panel slot and already holds `.agcfgsp`, the drawer's 24px gutter.
             So the heading costs no new element and sits above `.rows`, which is the one thing
             that scrolls — it stays put while a long provider list moves under it.
             ⚠️ IT NAMES THE CHOICE, NOT THE SCREEN. The reference titles its column with the page
             ("Application Registration") because that rail IS the page; this rail sits inside a
             drawer whose own header already reads "Configure AI provider", so repeating that
             would say it twice 40px apart. "AI provider" is what the three rows are. */
          ''}`}</div></obs-side-menu>
    </div>`}
    <div class="agcfgm" id="agCfgMain">${agCfgFormHTML()}</div>
    ${/* ⚠️ NEITHER OPTION 2 NOR OPTION 3 HAS A HELP CARD (two requests, 16 Sep 2026) — the form
         column takes the width. ⚠️ ON OPTION 3 THAT LEAVES THE RAIL AND THE FORM IN A FULL-WIDTH
         DRAWER: `agCfgSize` still sizes it to the viewport minus the sidebar, and `.agform` caps
         at 720px, so the middle column is much wider than the fields in it. Stated rather than
         acted on — narrowing the drawer for Option 3 is a second decision. */
      o2 ? '' : agHelpHTML()}
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
             /* ⚠️ `agOneNoteHTML()` SELF-GUARDS TO OPTION 2, AND THAT MATTERS NOW THE LINE IS SHARED: the
                one-at-a-time rule is FALSE on Option 3, whose cards let all three providers hold a key at
                once. It returns '' there rather than stating a rule the option does not follow. */
             : agO2Form() ? agProvPickHTML() + agStepCreds() + agTermsHTML() + agOneNoteHTML() + agTestHTML()
  /* ⚠️ OPTION 3 IS CREDENTIALS + THE ONE TERMS LINE (three requests, 16 Sep 2026, in this order:
     drop Model selection -> replace the four consent boxes with one checkbox -> "remove [Review data
     sharing & processing terms], show only the checkbox and text"). `agStepConsent()` is no longer
     called here at all; it still renders in full for Option 1, so nothing is parked.
     ⚠️ WHAT WENT WITH THE SECTION, STATED RATHER THAN QUIETLY DROPPED — all three were disclosures,
     not decoration, and Option 3's form no longer carries any of them:
       · the WARNING BANNER "ObserveOps cannot control how a third-party provider stores or processes
         that data once it has been transmitted";
       · the seven `Data that may be transmitted` chips — so the reader is no longer shown WHAT is sent;
       · the provider's PRIVACY POLICY link, which two requests ago survived precisely because that panel
         carried it. It is now absent from Option 3 entirely.
     What remains saying anything about it is the terms sentence itself, which names the provider and
     links the Terms & Conditions. Option 1 still carries the whole section.
     ⚠️ THE GATE NEEDED NOTHING — it already read `d.terms`, which is exactly the control still on screen. */
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
/* ⚠️ IT IS A SIBLING OF THE TERMS LINE, NOT PART OF THE FIELDS, WHICH IS WHY IT HAS ITS OWN
   BUILDER. It began inside `agStepCreds` directly under the two inputs and was swapped below the
   terms on request (16 Sep 2026) — the order now reads: what you are connecting, what you agree
   to, then what it costs you. Keeping it in `agStepCreds` would have meant the form's ORDER was
   decided in two places; `agCfgFormHTML`'s one line is where every other block's position lives. */
/* ⚠️ THE SAME NOTE STANDS ON THE OVERVIEW TOO (request, 16 Sep 2026: "this message will be show by
   default [on] the main screen"), which is why it takes `where`. The rule is a property of the SCREEN,
   not of the form — the grid below it shows three providers and one Active chip, and this is the
   sentence that explains why the other two are only offering a button.
   ⚠️ ONE BUILDER, THREE SENTENCES, SO THEY CANNOT DRIFT: on the form it names the provider you are
   about to lose; on the overview it names the one you already have; with nothing connected both fall
   back to the plain rule. A second copy on the page would be the place they disagree. */
/* ⚠️ OPTION 2 ONLY, AND `agO2Form()` IS THE WRONG QUESTION HERE (reported 16 Sep 2026: "remove this
   because I configure multiple AI providers at a time"). Giving Option 3 Option 2's DRAWER swept this guard
   up with it, and the note then appeared on Option 3's overview and in its form — **stating a rule Option 3
   does not follow**, since its cards let all three providers hold a key at once. `agO2Form()` answers "does
   this option use the compact drawer"; this asks "does this option replace one provider with another", and
   the two stopped being the same question the moment Option 3 became multi-provider.
   ⚠️ MY OWN PROBE PASSED ON IT. The assertion read `textContent` of the drawer for "One provider at a
   time" — but that string is `obs-banner`'s `title` PROP, which the component renders inside its SHADOW
   ROOT, so the light DOM never contains it. A green assertion measuring the wrong tree, which is the
   failure this file records more than any other. Assert on the rendered banner element, not on page text. */
function agOneNoteHTML(where){
  if (AG.opt !== '2') return '';
  const conn = AG.active && AG.conn ? agProv(AG.conn) : null;
  let body;
  if (where === 'overview'){
    body = conn
      ? `<b>${stEsc(conn.name)}</b> is the connected provider. Configuring another replaces it — its connection is removed and its key is not kept.`
      : `Only one AI provider is connected at a time. Configure one to enable AI features.`;
  } else {
    const other = conn && conn.id !== AG.cfg.pid ? conn : null;
    body = other
      ? `Saving this connection replaces <b>${stEsc(other.name)}</b> — its connection is removed and its key is not kept.`
      : `Only one AI provider is connected at a time. Configuring another later replaces this one.`;
  }
  return `<obs-banner class="agnote" variant="info" title="One provider at a time">${body}</obs-banner>`;
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
  const head = agO2Form() ? '' : `<h2 class="agcfgh">Enter credentials</h2>
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
  /* ⚠️ OPTION 3 HAS NO CONNECTION NAME FIELD (request, 16 Sep 2026: "remove the Connection name in
       agentic ai in option 3"). Scoped to Option 3 by name, NOT to `agO2Form()` — Option 2 shares this
       whole drawer and was not named, and there are probe assertions that it still has the field.
     ⚠️ THE CONNECTION STILL HAS A NAME; only the way to edit it from this form is gone. `agSeed` sets
       `<Provider> production` per provider, so `d.name` is never empty and the four places that read it
       (the done summary, the overview panel, the grid, `agCfgSave`) are untouched. Say that rather than
       let the next reader think the record lost a field.
     ⚠️ THE KEY THEN TAKES THE WHOLE ROW rather than sitting in the left half of a two-column grid with
       dead space beside it. It stays inside `.agrow2` so the row keeps the form's own 16/24 rhythm —
       only the column count changes. */
  /* ⚠️ AND THE RECORD IS GIVEN THAT NAME, or Option 3 would save one with an empty `name`. `agSeed`
       only names the provider that is already connected, so an unconfigured one had nothing but the
       field's PLACEHOLDER — which is what the removed field was offering. The placeholder becomes the
       value; the four readers of `d.name` are unchanged, and Options 1 and 2 are untouched because
       their field is still there to overwrite it. */
  if (AG.opt === '3' && !d.name) d.name = p.name + ' production';
  const creds = AG.opt === '3'
    ? `<div class="agrow2 agrow1">${fld('key','API key',` required type="password" placeholder="${stEsc(p.keyHint)}"`)}</div>`
    : `<div class="agrow2">
      ${fld('name','Connection name',` placeholder="${stEsc(p.name)} production"`)}
      ${fld('key','API key',` required type="password" placeholder="${stEsc(p.keyHint)}"`)}
    </div>`;
  return `${head}
    ${creds}
    ${/* ⚠️ OPTION 3 DROPS ADVANCED SETTINGS TOO (request, 16 Sep 2026: "remove the advance
         setting and Model selection"). Its five fields keep their defaults — a custom endpoint
         and proxy stay empty, and the timeout / retries / rate limit are the seeded numbers — so
         nothing about the connection changes, only the ability to override it from this form. */
      agO2Form() ? '' : adv}`;
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
    stEsc(p.name)} is reachable with this key.${agO2Form() ? '' : ' Continue to pick the models it should use.'}</obs-banner>`;
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
  /* ⚠️ OPTION 3 CONFIRMS WITH ONE CHECKBOX, NOT FOUR (request, 16 Sep 2026: "remove all the checkbox
     with text, show only a single checkbox and [the Terms & Conditions sentence]"). It reuses
     `agTermsHTML()` — Option 2's line, not a copy of it — so the two options cannot drift apart on the
     wording of the one thing the reader agrees to.
     ⚠️ IT KEEPS ITS PLACE INSIDE `.agpf`, the panel's hairline footer. That rule exists to separate the
     EVIDENCE (what is transmitted, and the provider's privacy policy) from the DECISION, and the decision
     is still the decision when it is one box — lifting it out would leave the hairline cutting off nothing.
     ⚠️ "Confirm to continue" AND THE LIVE COUNT GO WITH THE FOUR BOXES. The count said "2 of 4 accepted"
     to explain a disabled primary; over a single box it can only ever say "0 of 1" or "1 of 1", which is
     what the box itself shows. `agConsText` / `agConsPaint` are untouched and still serve Option 1 —
     `agConsPaint` already guards on `#agConsN` existing, so it is simply inert here.
     ⚠️ THE PRIVACY POLICY IS NOT LOST WITH THE FOUR TERMS. Option 2 dropped that link when it went to one
     sentence; here the panel directly above still carries it under the transmitted-data chips, which is
     where it belongs — it explains the evidence rather than being a second thing to agree to.
     ⚠️ THE GATE MOVED WITH THE CONTROL — see `agFlowFootHTML`: Option 3's primary now reads `d.terms`,
     not `d.consent.every(Boolean)`, or it would wait forever on four boxes that are no longer on screen. */
  return `<h2 class="agcfgh">Review data sharing &amp; processing terms</h2>
    <obs-banner variant="warning" class="agbanwarn"
      title="Enabling AI sends observability data to ${stEsc(p.name)}">ObserveOps cannot control how a
      third-party provider stores or processes that data once it has been transmitted.</obs-banner>
    <div class="agpanel">
      <div class="agpt">Data that may be transmitted</div>
      <div class="agchips" style="margin-top:12px">${AG_SHARED.map(x => `<obs-tag variant="tag-primary">${stEsc(x)}</obs-tag>`).join('')}</div>
      <div class="agpll"><obs-link external href="${stEsc(p.docs)}" onclick="return false">${stEsc(p.privacy)}${agIc('external-link', 12)}</obs-link></div>
      <div class="agpf">${`
        <div class="agpt">Confirm to continue</div>
        <div class="agpd" id="agConsN">${agConsText()}</div>
        <div class="agcons" style="margin-top:12px">${
        AG_CONSENT.map((c, i) => `<obs-checkbox${d.consent[i] ? ' checked' : ''}
          onchange="agCfgConsent(${i}, agDet(event))">${stEsc(c)}</obs-checkbox>`).join('')
      }</div>`}
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
  /* ⚠️ A SUMMARY MAY ONLY NAME WHAT ITS OWN FORM ASKED. Option 2 has neither routing nor the four
     consent terms; Option 3 has the terms but no model step, so `Per-task routing` would report a
     switch that is not on its form. Fixing copy the change falsifies is part of the change. */
  ].filter(r => r.label !== 'Per-task routing' || AG.opt === '1')
   /* ⚠️ ONLY OPTION 1 STILL HAS FOUR CONSENT TERMS, so only Option 1's summary may say "Consent".
      Options 2 and 3 both confirm with the single Terms & Conditions box and report that instead. */
   .filter(r => r.label !== 'Consent' || AG.opt === '1')
   .concat(AG.opt === '1' ? [] : [{ label:'Terms & conditions', status:'Accepted' }]);
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
    : agO2Form()
    ? `<obs-button variant="primary"${dis(d.test === 'ok' && d.terms)}
         onclick="agTap(agCfgDone)">Save</obs-button>`
    /* ⚠️ OPTION 3 GATES ON THE ONE TERMS BOX (16 Sep 2026). Its consent step is a single checkbox now,
       so `consent.every(Boolean)` would hold the primary shut on four controls the form no longer renders
       — a permanently disabled button with nothing on screen to explain it, which is the dead end the
       Designer's Guide forbids. The test half is unchanged, and so is the label: "Accept" still names what
       the box does. Option 1 keeps all four. */
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
  const note = d.step === 0 && !agO2Form()
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
  if (agO2Form()) return agCfgSave();
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
  /* ⚠️ OPTION 3 IS EXEMPT — it configures several providers at once (see agCardsHTML), so wiping the
     previous one would delete a connection the option exists to let you keep. Options 1 and 2 keep the
     one-at-a-time rule their own screens state. */
  if (AG.opt !== '3' && AG.active && AG.conn && AG.conn !== p.id){
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
/* ⚠️ `header-style="default"`, NOT `tinted` (request, 16 Sep 2026: "remove the background colour and
   show top and bottom border", with the product's own monitor grid as the reference). The DS's default
   header IS that treatment — `.grid.hs-default th` is `background:transparent` with a `border-bottom`,
   and uppercase 600 labels, which is what the reference shows too. Only the TOP rule had to be added,
   in the sheet the corner-radius hook adopts into obs-table, scoped by the host class below.
   ⚠️ THE CLASS IS WHAT KEEPS IT OFF EVERY OTHER TABLE. That adopted sheet is shared by every
   `obs-table` in the module — the License page's quota grid and its nested breakdown included — so the
   rule is `:host(.aggridt)`, not a bare `th`. */
/* ⚠️ OPTION 3's PROVIDER CARDS (request, 16 Sep 2026, with a supplied card row: "add [this] using the
   ObserveOps design system"). One card per provider: a tinted icon tile, a status pill, the name and its
   tagline, then the action and a link to that provider's own documentation.
   ⚠️ THE CARD ITSELF IS NOT A DS COMPONENT, AND THAT IS CHECKED, NOT ASSUMED — the shipped bundle
   registers 52 `obs-*` elements and not one of them is a card (`obs-layout-panels` is a layout region,
   not a surface). So the container is this module's own `.agpanel` idiom, which is already the widget
   surface everywhere else on this screen: `--common-widget-bg` on `--border-color` at `--btn-radius`.
   Everything INSIDE it is a real DS part — `obs-icon`, `obs-tag`, `obs-button`.
   ⚠️ THE TILE COLOURS ARE CHART-PALETTE TOKENS, one per provider, never a brand hue: `resolve_logo`
   answers "do NOT hand-draw a brand mark", and the same rule covers painting a tile in a vendor's colour.
   The glyphs are each provider's own `ic`, already on the record and already used by Option 1's rail.
   ⚠️ THE ACTIVE CARD SAYS "Manage" AND THE OTHERS "Switch", which is the reference's own wording and is
   honest here: switching really does replace the connection (see agCfgSave), where managing does not. */
/* ⚠️ EVERY NAME HERE MUST BE A TOKEN THAT EXISTS — a `var()` on one that does not fails SILENTLY:
   the colour falls back to inherit and the `color-mix()` drops entirely, so the tile renders with no
   tint at all and nothing errors. This shipped for one build as `--chart-emerald`, which is only a
   PREFIX of the real `--chart-emerald-green`; a grep for the short name matched the long one and the
   screenshot was the only thing that showed it. The probe now asserts each tile actually paints. */
/* ⚠️ THE THREE PROVIDER MARKS, PASTED VERBATIM FROM `free-icons/` (request, 16 Sep 2026).
   OpenAI  = tabler/brand/brand-openai.svg           (MIT)
   Anthropic = hugeicons/uncategorised/claude.svg    (MIT)
   DeepSeek  = hugeicons/uncategorised/deepseek.svg  (MIT)
   ⚠️ ANTHROPIC'S ENTRY IS THE **CLAUDE** MARK, and that is the honest nearest thing: no set in
   the library carries an Anthropic corporate logo (searched all six). The card's own tagline
   already reads "Claude family", so the glyph names what the provider gives you.
   ⚠️ EVERY `width` / `height` / `stroke-width` / `fill` ATTRIBUTE IS STRIPPED on the way in, and
   `class` with them. The CSS at `.agpci svg` owns all of it — an attribute left here would have
   to be beaten rule by rule, and the two sets disagree about every one of them.
   ⚠️ TABLER'S FIRST PATH IS ITS INVISIBLE 24×24 BOUNDING BOX (`stroke:none;fill:none`) and is
   dropped: with the stroke rules below applied to every `path` it would paint a square frame.
   ⚠️ DO NOT HAND-CORRECT THESE PATHS. `resolve_logo` answers "do NOT hand-draw a brand mark",
   and the repo's icon rule says the same — a redrawn logo is the one thing that makes a
   prototype look unlike the product AND misrepresents somebody's trademark. */
const AG_BRAND = {
  openai: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35"/>' +
    '<path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946"/>' +
    '<path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348"/>' +
    '<path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45"/>' +
    '<path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946"/>' +
    '<path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42"/></svg>',
  /* ⚠️ ANTHROPIC IS THE CORPORATE WORDMARK NOW, NOT CLAUDE'S SUNBURST (request, 16 Sep 2026, with the
     "A\\" mark supplied: "the Anthropic change the real logo use [this]"). The earlier entry was Hugeicons'
     `claude` — the nearest thing the vendored library had, and the note here said so — but the card is
     titled *Anthropic*, so the company's own mark is the right one and the tagline still names Claude.
     ⚠️ IT IS NOT HAND-DRAWN. `free-icons/` has no Anthropic corporate logo (all six sets searched) and
     `resolve_logo` answers "do NOT hand-draw a brand mark" — so this came through the repo's own documented
     escape hatch, `fetch_source.py --search anthropic`, which searches 238 sets by tag. It is
     **simple-icons**' `anthropic`, pasted verbatim: the canonical brand-mark set, **CC0**, so it needs no
     visible attribution (unlike the CC BY sets the icon rule warns about).
     ⚠️ IT IS FILLED WHERE THE OTHER TWO ARE STROKED, and that costs a rule — see `.agpci` in PART 1. The
     shared `fill:none;stroke:currentColor;stroke-width:1.6` would render this wordmark as a thin OUTLINE of
     the letterform, which is not the mark. A solid glyph among outlines is the "different family" fault this
     file records at the composer's send button; here the brand's own treatment outranks the visual family,
     the same way its shape already does. */
  anthropic: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541Zm-.371 10.223L8.616 7.82l2.291 5.945Z"/></svg>',
  deepseek: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g>' +
    '<path d="M20.725 6.166a2.42 2.42 0 0 0-1.771.786c-.216-1.023-.859-1.324-1.593-1.665c-.465-.216-.659-.696-.722-1.043c-.024-.133-.133-.24-.268-.24c-.134 0-.262.055-.326.173c-.14.25-.354.8-.373 1.81c-.029 1.503 1.21 2.662 1.834 3.053c-.064.37-.29.942-.395 1.182a4.9 4.9 0 0 1-1.87-1.234c-.958-1.043-1.738-1.781-2.756-2.503s-.337-1.583.09-1.788s.103-.415-.962-.379c-.853.029-2.067.53-2.567.777c-.51-.162-1.572-.194-2.038-.19C2.425 4.905 1 8.98 1 11c0 6.086 4.873 9 8.373 9c3.958 0 5.345-1.614 5.345-1.614c.164.101.76.316 1.838.362c1.349.057 1.851-.324 1.89-.617s-.179-.4-.37-.49c-.19-.089-.49-.26-1.055-.445c-.453-.147-.657-.308-.702-.37c2.73-2.472 3.23-5.935 3.153-7.407c2.112-.082 2.943-1.488 3.217-2.2c.28-.726.454-1.716.164-1.94c-.232-.18-.426.036-.494.167c-.372.396-.644.719-1.635.719"/>' +
    '<path d="M12 10.568s.876-.27 1.645.255c1.041.71 1.355 1.676 1.355 1.676m-1.5 4s-1.041-.507-2.604-2.539c-1.878-2.44-3.647-5.074-7.367-4.213c0 0-.029 5.25 4.971 6.752"/></g></svg>',
};
/* ⚠️ KEPT AND UNREFERENCED (the house pattern). Each card's tile was tinted with its provider's
   own chart-palette token until 16 Sep 2026, when the tile went neutral — see `.agpci`. One
   `style=` back on the span in `agCardsHTML` restores it. */
const AG_CARD_TONE = { openai:'--chart-emerald-green', anthropic:'--chart-amber', deepseek:'--chart-indigo' };
/* ⚠️ OPTION 3 CONFIGURES SEVERAL PROVIDERS AT ONCE (request, 16 Sep 2026: "the 3 AI provider will be
   config at a time — config multiple provider"), which is the opposite of Options 1 and 2, where saving
   one connection removes the one before it. So on this option `agCfgSave` keeps the others (see the guard
   there) and a card's state is simply whether THAT provider holds a key — not whether it is `AG.conn`.
   ⚠️ THE STATUS PILLS ARE GONE with the same request ("remove [Active] [Available]"). With several
   providers configurable there is no single Active one for a pill to mark, so the pills would have been
   labelling a rule the option no longer has.
   ⚠️ "SWITCH" WENT WITH THEM, and that is part of the change rather than beyond it: the word promised a
   replacement that no longer happens.
   ⚠️ THE TWO LABELS NAME WHAT PRESSING THE BUTTON DOES (request, 16 Sep 2026): a provider with no key
   reads **Configure**, one that has a key reads **Change API key** — which is the only thing the form
   offers for a provider already connected, so the button says it rather than the vaguer "Manage".
   ⚠️ AND THE VARIANT FOLLOWS THE LABEL (request, 16 Sep 2026: "'change API key' is a secondary button
   and 'configure' is a primary button, and the primary button colour is cad3e2"). An unconfigured provider's
   Configure IS the thing to do on that card, so it is `primary`; changing a key on a provider that already
   works is a lesser errand, so it stays `default`. The two therefore cannot both be loud on one row.
   ⚠️ #cad3e2 IS NOT PASTED — it is what `--primary-button-bg` already resolves to here. The scoped DS
   block sets `--primary-button-bg:var(--primary)` and `--primary:var(--primary-alt)`, and `--primary-alt`
   IS #cad3e2 in dark / #1d2a3e in light. So `variant="primary"` paints the requested colour by token, and
   light theme gets the value that is legible there instead of #cad3e2 at 1.4:1 on white.
   ⚠️ CONSEQUENCE, STATED: with two providers unconfigured this paints TWO primaries on the row, under
   the toolbar's own `Configure AI provider` primary — three on the screen. That follows from the request
   plus Option 3's multi-provider rule (every card is independently actionable); the DS's one-primary-per-view
   guidance would make them `default` and leave the toolbar's the only primary. */
function agCardsHTML(){
  return `<div class="agpcw">${AG_DATA.providers.map(p => {
    const set = !!(AG.cfg.d[p.id] && String(AG.cfg.d[p.id].key || '').trim());
    const tone = AG_CARD_TONE[p.id] || '--chart-indigo';
    return `<div class="agpc${set ? ' on' : ''}">
      <div class="agpch">
        <span class="agpci"${AG_BRAND[p.id] ? ` data-brand="${p.id}"` : ''}>${
          AG_BRAND[p.id] || agIc(p.ic, 20)}</span>
      </div>
      <div class="agpcn">${stEsc(p.name)}</div>
      <p class="agpct">${stEsc(p.tagline)}</p>
      <div class="agpca">
        <obs-button variant="${set ? 'default' : 'primary'}" class="agpcb" onclick="agTap(function(){agConfig('${p.id}')})">${
          set ? 'Change API key' : 'Configure'}</obs-button>
        ${/* ⚠️ REMOVE IS `error`, WHICH IS THE DS's OWN ANSWER AND IS NEITHER PRIMARY NOR
             SECONDARY (request, 21 Sep 2026: "behind the Change API key button add remove button and
             it is not primary or secondary button, using the ObserveOps design system"). obs-button's
             decision flow reads "Destructive (delete/remove/abort)? -> variant=error + confirm", and
             its own usageRules put `default` on "the secondary next to a primary" and `primary` on
             "the ONE most-important action" — so error is the one variant that is both correct here
             and neither of the two the request rules out.
             ⚠️ NOT `danger`. Its own rule says "Avoid in new work — a rare (3x) light/ghost style,
             NOT solid red (F2); the ghost rendering under-signals danger."
             ⚠️ IT ONLY EXISTS ON A CONFIGURED PROVIDER. There is nothing to remove from a card that
             offers Configure, and a permanently dead red button is the dead end the guide forbids.
             ⚠️ AND IT CONFIRMS, which is the other half of the DS's sentence — see agCardRemove. */''}
        ${set ? `<obs-button variant="error" class="agpcb" onclick="agTap(function(){agCardRemove('${p.id}')})">Remove</obs-button>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

/* ⚠️ THE CONFIRM IS THE DS's REQUIREMENT, NOT AN EXTRA. obs-button's own rule for `error` is
   "destructive: delete/remove/abort/discard, WITH A CONFIRM" — the variant and the question are one
   decision, so shipping the red button without it would be following half the guidance.
   ⚠️ IT REUSES `stcConfirm`, the module's own confirm card, rather than a native confirm():
   nothing in this file uses a system dialog, and one over a dark page reads as a crash.
   ⚠️ IT CLEARS EVERY FIELD OF THE DRAFT, NOT JUST THE KEY. `set` is tested on the key alone, so
   a record left holding a name, a passed test and an accepted terms box would offer `Configure` over
   a form that was already half-filled and already `tested` — i.e. the gate would open on a provider
   with no key. Removing means removing.
   ⚠️ IT STANDS THE PAGE'S OWN STATE DOWN TOO when the provider being removed is the connected
   one, or the header keeps a green `Active` tag for a connection that no longer exists. */
function agCardRemove(id){
  const p = (AG_DATA.providers || []).filter(x => x.id === id)[0]; if (!p) return;
  stcConfirm('Remove ' + p.name + '?',
    'Its API key is deleted and ObserveOps stops sending anything to ' + stEsc(p.name) +
    '. This cannot be undone \u2014 you would have to paste a new key to connect it again.',
    'Remove', function(){
      const d = AG.cfg && AG.cfg.d && AG.cfg.d[id];
      if (d){ d.key = ''; d.name = ''; d.tested = false; d.terms = false; d.step = 0; }
      if (AG.conn === id){ AG.conn = null; AG.active = false; }
      stMainPaint();
      toast(p.name + ' removed');
    });
}

function agGridHTML(){
  return `<obs-table id="agGrid" class="aggridt" row-key="id" header-style="default" empty-text="No records available"
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
ST_PAGES['Agentic AI › AI Provider'] = { html: agOvHTML, after: agOvAfter };


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
