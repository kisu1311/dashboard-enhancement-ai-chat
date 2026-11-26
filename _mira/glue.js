/* ══ mx* — replaces the live Vue app's behaviour on the cloned Mira markup ══════════════
   Everything is canned: nothing calls out. Chats: c3 (Runbook Creation, the newest - opens first), c1 (WhatsApp), c2 (Runbook Creation UI),
   'new' (the empty state), and n<N> for chats started here.                                */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var tpl=function(id){return document.getElementById('mxt-'+id)};
var MX={cur:null,panes:{},eff:'Medium',seq:0,busy:false,pop:null,side:null};
var EFF={Low:1,Medium:2,High:3,XHigh:3,Max:3};

/* a module picked in setting.html comes back here as #m= / #v= — hand it to Option 1 */
if(/^#(m|v)=/.test(location.hash)){ location.replace('index.html'+location.hash); return; }
try{ var th=localStorage.getItem('oo-theme')||'dark';
  var dark = th==='dark' || (th==='auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  if(!dark) document.body.removeAttribute('data-theme'); }catch(e){}

function toast(t){ var el=$('.mx-toast'); if(!el){ el=document.createElement('div'); el.className='mx-toast'; document.body.appendChild(el);} el.textContent=t; el.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(function(){el.classList.remove('on')},1800); }
function copy(text,msg){ var done=function(){toast(msg||'Copied')};
  if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text).then(done,done); return; }
  var ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;opacity:0;left:-999px'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy')}catch(e){} ta.remove(); done(); }
/* the run-result card is one row that folds its output (request, 18 Nov 2026) - see the CSS note. A failed run opens itself. */
/* ⚠️ THE ONE-ROW RUN CARD IS OPTION 2, NOT A REPLACEMENT (request, 18 Nov 2026: "the last change is option 2, the current UI is
   not removed"). OPTION 1 - the product's own card - is the default and is untouched: every Option 2 rule is scoped to .mx-run,
   which only runDress adds. Option 2 is picked with ?run=2 on the URL, localStorage 'mx-run-opt' = '2', or MX.runOpt (the
   artifact's component stage sets that). */
function runOpt(){ if(MX.runOpt) return MX.runOpt; try{ if(/[?&]run=2(&|$)/.test(location.search)||localStorage.getItem('mx-run-opt')==='2') return '2'; }catch(e){} return '1'; }
function runDress(root){ if(runOpt()!=='2') return; $$('.mira-run',root).forEach(function(c){ var h=$('.mira-run-head',c); if(!h||c.__mxrun) return; c.__mxrun=1; c.classList.add('mx-run');
    if(!$('.mx-run-cv',h)){ var cv=document.createElement('span'); cv.className='mx-run-cv'; cv.setAttribute('aria-hidden','true');
      cv.innerHTML='<svg viewBox="0 0 48 48"><path fill="currentColor" d="M31.4,22.6l-12-12c-.8-.8-2-.8-2.8,0-.8,.8-.8,2,0,2.8l10.6,10.6-10.6,10.6c-.8,.8-.8,2,0,2.8s2,.8,2.8,0l12-12c.8-.8,.8-2,0-2.8Z"/></svg>'; h.appendChild(cv); }
    var open=c.classList.contains('is-failed')||c.classList.contains('is-stopped'); c.classList.toggle('is-open',open);
    h.setAttribute('role','button'); h.tabIndex=0; h.setAttribute('aria-expanded',open);
    var tg=function(){ var o=c.classList.toggle('is-open'); h.setAttribute('aria-expanded',o); };
    h.onclick=tg; h.onkeydown=function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); tg(); } }; }); }
/* OPTION 2 ONLY (request, 18 Nov 2026: "show this in short with table view in option 2 only"): a result table in the thread is
   the design system's own grid, obs-table, five rows to a page with its pager - an eleven-row filesystem list no longer pushes the
   answer off the screen. The markdown table stays in the DOM, hidden, so copy / Option 1 are untouched. Columns and rows are set as
   PROPERTIES (the element ignores them as attributes once mounted); a column spec's heading is `title`. */
var TBL_PAGE=5;
function tblDress(root){ if(runOpt()!=='2'||!window.customElements||!customElements.get('obs-table')) return;
  $$('.mira-table-wrap',root).forEach(function(w){ var t=$('table',w); if(!t||w.__mxtbl) return; w.__mxtbl=1;
    /* ⚠️ two obs-table 0.1.166 defects, both already in design-system-gaps (49, 45): align:'right' right-aligns the cells and
       leaves the HEADER left (tblSkin adopts the fix into its shadow root), and columns split evenly, so a long numeric
       heading is cut - a right-aligned column gets a width from its heading (a px STRING; a bare number is ignored). */
    var cols=$$('thead th',t).map(function(th,i){ var ti=th.textContent.trim(), al=th.getAttribute('align')||'left', c={key:'c'+i,title:ti,align:al,sortable:true};
      /* every column is sized from its own content - the heading (12px caps) or its longest cell, whichever is wider */
      /* MEASURED, not estimated: the heading is 12px/600 caps with .25px tracking and 28px of padding in this bundle, a cell 13px */
      var hw=tblTW(ti.toUpperCase(),'600 12px '+TBL_FF())+ti.length*.25+36, cw=0;
      $$('tbody tr',t).forEach(function(tr){ var td=tr.children[i]; if(td) cw=Math.max(cw,tblTW(td.textContent.trim(),'13px '+TBL_FF())+34); });
      c.__w=Math.ceil(Math.max(56,hw,cw)); return c; });
    /* ...then FITTED to the message column, so the grid never scrolls sideways: any excess comes off the widest text column.
       obs-table adds its 32px of cell padding to a width, so the spec is the wanted box minus that. The wrap is display:none
       while its message is still hidden, so the room is read off the thread. */
    var host=w.closest('.mira-thread-list')||w.parentElement, room=(w.clientWidth||(host&&host.clientWidth)||720)-2, sum=0, wide=null;
    cols.forEach(function(c){ sum+=c.__w; if(c.align!=='right'&&(!wide||c.__w>wide.__w)) wide=c; });
    if(wide&&sum>room) wide.__w=Math.max(120,wide.__w-(sum-room));
    cols.forEach(function(c){ c.width=Math.max(24,c.__w-32)+'px'; delete c.__w; });
    var rows=$$('tbody tr',t).map(function(tr,r){ var o={id:'r'+r}; $$('td',tr).forEach(function(td,i){ o['c'+i]=td.textContent.trim(); }); return o; });
    if(!cols.length||!rows.length) return;
    /* NO PAGER (request, 18 Nov 2026: "don't show pagination, fix it another way, and add a table border"): a long table shows its
       first five rows and ONE quiet row under them - Show all N rows / Show fewer rows - inside a bordered frame. Sorting is off
       while it is cut short, because sorting five of eleven rows would look like the whole answer. */
    var g=document.createElement('obs-table'); g.className='mx-otbl'; g.setAttribute('page-size',0);
    var long=rows.length>TBL_PAGE, open=!long;
    function put(){ g.columns=cols.map(function(c){ var o={}; for(var k in c) o[k]=c[k]; o.sortable=open; return o; }); g.rows=open?rows:rows.slice(0,TBL_PAGE); }
    t.classList.add('mx-hide'); w.classList.add('mx-otblw'); w.appendChild(g); put(); tblSkin(g);
    if(long){ var b=document.createElement('button'); b.type='button'; b.className='mx-otblmore';
      var lab=function(){ b.innerHTML='<span>'+(open?'Show fewer rows':'Show all '+rows.length+' rows')+'</span><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M31.4,22.6l-12-12c-.8-.8-2-.8-2.8,0-.8,.8-.8,2,0,2.8l10.6,10.6-10.6,10.6c-.8,.8-.8,2,0,2.8s2,.8,2.8,0l12-12c.8-.8,.8-2,0-2.8Z"/></svg>';
        b.setAttribute('aria-expanded',open); b.classList.toggle('is-open',open); };
      b.onclick=function(){ open=!open; put(); lab(); }; lab(); w.appendChild(b); }
    /* the grid joins the message's word fade - wordFade may have walked the hidden markdown table first (its first word holds the
       count the grid starts at), or it reaches the grid later (it picks up g.__mxtf on its walk) */
    g.__mxtf=1; var f1=$('.mx-w',t); if(f1) tblFade(g,Math.round((parseFloat(f1.style.animationDelay)||0)/38)); }); }
/* WORD FADE FOR THE OPTION 2 GRID (request, 25 Nov 2026: "the table is not animated - apply the same animation as the text"): obs-table
   draws its cells in its shadow root, out of wordFade's reach, so the grid arrived whole while the words around it faded in. Here each
   cell takes the text's own fade (mxwf, .42s, 38 ms apart) - header left to right, then row by row - continuing the message's count;
   the frame fades in with the first heading and Show all after the last cell. The rules sit under :host(.mx-tf), dropped once the
   fade is over, so Show all / sorting re-renders the grid without replaying it. Returns the count after the grid. */
function tblFade(g,n){ if(g.__mxtfd) return n; g.__mxtfd=1; var w=g.closest('.mx-otblw'), nc=(g.columns||[]).length, nr=(g.rows||[]).length, tot=nc*(nr+1),
    mb=w&&$('.mx-otblmore',w);
  if(!nc||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)) return n+tot+1;
  var A='animation:mxwf .42s cubic-bezier(.2,0,0,1) both;animation-delay:', css='@keyframes mxwf{from{opacity:0}to{opacity:1}}', c, r;
  for(c=0;c<nc;c++) css+=':host(.mx-tf) .grid thead th:nth-child('+(c+1)+')>*{'+A+((n+c)*38)+'ms}';
  for(r=0;r<nr;r++) for(c=0;c<nc;c++) css+=':host(.mx-tf) .grid tbody tr:nth-child('+(r+1)+') td:nth-child('+(c+1)+') .cell-clip{'+A+((n+nc*(r+1)+c)*38)+'ms}';
  if(w){ w.classList.add('mx-w'); w.style.animationDelay=(n*38)+'ms'; }
  if(mb){ mb.classList.add('mx-w'); mb.style.animationDelay=((n+tot)*38)+'ms'; }
  g.classList.add('mx-tf'); var k=0;
  (function go(){ var sr=g.shadowRoot; if(!sr){ if(k++<40) setTimeout(go,50); return; }
    try{ var s=new CSSStyleSheet(); s.replaceSync(css); sr.adoptedStyleSheets=[].concat(sr.adoptedStyleSheets,[s]); }catch(e){} })();
  setTimeout(function(){ g.classList.remove('mx-tf'); },(n+tot)*38+700);
  return n+tot+1; }
var TBL_CV=null; function tblTW(s,font){ TBL_CV=TBL_CV||document.createElement('canvas').getContext('2d'); TBL_CV.font=font; return TBL_CV.measureText(s).width; }
function TBL_FF(){ return getComputedStyle(document.body).fontFamily||'sans-serif'; }
function tblSkin(g){ var n=0; (function go(){ var sr=g.shadowRoot; if(!sr){ if(n++<40) setTimeout(go,50); return; }
    try{ var s=new CSSStyleSheet(); s.replaceSync('.grid th.al-right{text-align:right}.grid th.al-center{text-align:center}'+
      /* the bundle asks for Poppins, which this page does not load - the grid takes the thread's own face; a long cell ends in an ellipsis */
      ':host{font-family:inherit}.grid,.grid th,.grid td,.pager,.pager *{font-family:inherit}.grid td{text-overflow:ellipsis}'+
      /* the frame is the wrap's: the grid's own first and last lines would double it */
      '.grid thead th{border-top:0}.grid tbody tr:last-child td{border-bottom:0}'); sr.adoptedStyleSheets=[].concat(sr.adoptedStyleSheets,[s]); }catch(e){} })(); }
/* ── the runbook card, OPTION 2 (request, 18 Nov 2026: "everything so far is option 1 - create option 2: the whole process, minimalist,
   user friendly, easy to understand, simple") ─────────────────────────────────────────────────────────────────────────────
   OPTION 1 - the product's own card - is the default and is untouched: every Option 2 rule is scoped to .mx-forge2, which only
   forgeDress adds. What Option 2 changes is how the SAME facts are shown:
     head     one line: the runbook's glyph, its name, "SSH · Read-only" as plain text, the Draft tag. No icon tile, no pills.
     process  the four stages as a STEPPER you can read at a glance - a tick when a step is done, a pulsing dot on the step in
              hand, a cross where it failed, an empty ring for what is still to come - joined by a line. It was four words in a row.
     message  one plain headline and one sentence under it; problems as a short list, the line number as a small tag.
     gone     the code silhouette (decoration - the Code button still opens the real code) and the tinted footer.
   Colours are the ObserveOps design-system tokens the page already carries. Picked with ?forge=2, localStorage 'mx-forge-opt' =
   '2', or MX.forgeOpt (the artifact's component stage sets that). The tick and cross are the product's own glyphs (TICK, CQ_X). */
/* OPTION 3 is Option 2's card with NO STEPS AT ALL (request, 18 Nov 2026: "show the whole process without steps, something
   different" - its first build, four bar segments with the stage names, was still a stepper). The process is now two things:
     one line of progress  a 3px bar under the header that fills as the work moves on (it animates between states), green,
                           red when a stage fails;
     one status chip       a dot and the stage in hand in words - Writing…, Compiling…, Compiling failed, Delivering… -
                           above the headline. The dot pulses while Mira is working.
   The four stage names are not shown; the <ol> stays in the DOM (hidden) and is what both parts are read from, so they
   cannot disagree with Options 1 and 2. ?forge=3 / 'mx-forge-opt' = '3' / MX.forgeOpt. */
function forgeOpt(){ if(MX.forgeOpt) return MX.forgeOpt; try{ var m=/[?&]forge=([23])(&|$)/.exec(location.search), s=localStorage.getItem('mx-forge-opt'); if(m) return m[1]; if(s==='2'||s==='3') return s; }catch(e){} return '1'; }
var FST_OK='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>', FST_X='<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
function forgeDress(root){ var fo=forgeOpt(); if(fo==='1'||!root) return; var list=$$('.mira-forge',root); if(root.classList&&root.classList.contains('mira-forge')) list.push(root);
  list.forEach(function(c){ if(!$('.mira-forge-head',c)) return; c.classList.add('mx-forge2'); c.classList.toggle('mx-forge3',fo==='3');
    $$('.mira-forge-stages li',c).forEach(function(li){ if($('.mx-fst',li)) return; var s=document.createElement('span'); s.className='mx-fst'; s.setAttribute('aria-hidden','true');
      s.innerHTML=li.classList.contains('is-done')?FST_OK:li.classList.contains('is-failed')?FST_X:''; li.insertBefore(s,li.firstChild); });
    if(fo==='3') forge3(c); }); }
function forge3(c){ var lis=$$('.mira-forge-stages li',c), body=$('.mira-forge-body',c), main=$('.mira-forge-main',c), bar=$('.mx-fprog',c);
  if(!bar&&body){ bar=document.createElement('div'); bar.className='mx-fprog'; bar.setAttribute('aria-hidden','true'); bar.innerHTML='<i></i>'; body.parentNode.insertBefore(bar,body); }
  var old=main&&$('.mx-fstat',main); if(old) old.remove(); if(!bar) return;
  if(!lis.length){ bar.classList.add('is-none'); return; } bar.classList.remove('is-none');
  var name=function(li){ return li.textContent.replace(/\s+/g,' ').trim(); }, done=0, now=null, bad=null;
  lis.forEach(function(li){ if(li.classList.contains('is-done')) done++; else if(li.classList.contains('is-failed')) bad=bad||li; else if(li.classList.contains('is-now')) now=now||li; });
  var cur=bad||now, pct=Math.round((done+(cur?.5:0))/lis.length*100), st=bad?'is-failed':now?'is-now':'is-done';
  /* a lone flex child would take the whole track - the fill is sized with width:% */
  bar.firstChild.style.width=pct+'%'; bar.classList.toggle('is-failed',!!bad);
  var chip=document.createElement('div'); chip.className='mx-fstat '+st; chip.setAttribute('role','status');
  chip.innerHTML='<i aria-hidden="true"></i><span>'+esc(bad?name(bad)+' failed':now?name(now)+'…':done&&done<lis.length?name(lis[done-1]):'Done')+'</span>'; if(main) main.insertBefore(chip,main.firstChild); }
function dress(root){ runDress(root); tblDress(root); forgeDress(root); $$('button[aria-label]:not([title])',root).forEach(function(b){ if(!b.textContent.trim()) b.title=b.getAttribute('aria-label'); }); }
function first(id){ return tpl(id).content.firstElementChild.cloneNode(true); }
function thread(){ return $('#mxPane .mira-thread-scroll'); }
function toBottom(){ var t=thread(); if(t){ t.scrollTop=t.scrollHeight; scrollBtn(); } }
function scrollBtn(){ var t=thread(), b=$('#mxPane .mira-scroll-down'); if(!t||!b) return; b.style.display = (t.scrollHeight-t.scrollTop-t.clientHeight>40)?'':'none'; }

/* ── chats ── */
function paneFor(id){ if(id==='new') return first('new'); if(!MX.panes[id]) MX.panes[id]=first(id); return MX.panes[id]; }
function show(id){
  if(MX.play) MX.play.finish(true);
  closePops(); closeCode();
  var node=paneFor(id); MX.cur=id;
  var host=$('#mxPane'); host.textContent=''; host.appendChild(node); dress(node);
  $$('.mira-side-row.is-chat').forEach(function(a){ a.classList.toggle('is-active',a.getAttribute('data-mx-chat')===id); });
  var nb=$('.mira-side-row.is-new'); if(nb) nb.classList.toggle('is-active',id==='new');
  var chat=$('.mira-chat'); if(chat) chat.classList.toggle('is-talking',id!=='new');
  var ttl=$('.mira-crumb.is-current',node); document.title=(ttl&&id!=='new'?ttl.textContent.trim()+' · ':'')+'Mira';
  if(id==='new'){ var d=$('.mira-home-date',node); if(d) d.textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}); }
  hdPaint(node,id);
  effPaint(); toBottom();
  var ta=$('.mira-composer-input',node); if(ta){ try{ta.focus({preventScroll:true})}catch(e){} }
}
function toggle(btn){ var o=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded',o?'false':'true');
  var ch=btn.querySelector('.mira-step-chevron'); if(ch) ch.classList.toggle('is-open',!o);
  if(!o&&btn.classList.contains('mira-group-head')) refade(btn.closest('.mira-activity-group'));
  else if(!o&&btn.classList.contains('mira-step-row')) fadeIn(btn.nextElementSibling); }
/* the word fade plays EVERY time a thinking group is opened, not only the first (request, 18 Nov 2026): steps that were
   never faded are wrapped now, then every word's animation is restarted, 38ms apart across the whole group. */
/* ⚠️ EVERY DETAILS VIEW FADES ITS TEXT IN EVERY TIME IT OPENS (request, 18 Nov 2026: "the text animation shows only the first time").
   One helper for all of them: words not yet wrapped are wrapped, then every word ON SCREEN gets its animation restarted, 38ms
   apart from the first. Used by the answered record's list and by a step row's detail; a thinking group has refade. */
function fadeIn(root){ if(!root) return; root.__wf=0; wordFade(root); var ws=$$('.mx-w',root); ws.forEach(function(w){ w.style.animation='none'; }); void root.offsetWidth;
  var n=0; ws.forEach(function(w){ w.style.animation=''; w.style.animationDelay=(w.offsetParent?n++*38:0)+'ms'; }); }
function refade(g){ if(!g) return; $$('.mira-group-step',g).forEach(function(s){ wordFade(s); });
  var ws=$$('.mx-w',g); ws.forEach(function(w){ w.style.animation='none'; }); void g.offsetWidth;
  /* only the words on screen take a turn - a step's folded detail is wrapped too and must not push the delays out */
  var n=0; ws.forEach(function(w){ w.style.animation=''; w.style.animationDelay=(w.offsetParent?n++*38:0)+'ms'; }); }

/* ── the Code panel (right-hand split) ── */
function closeCode(){ var sp=$('.mira-split'); if(!sp) return; $$('.splitpanes__splitter, .mira-pane.is-preview',sp).forEach(function(e){e.remove()}); $('#mxPane').style.width='100%'; codeInlineOff(); }
/* ⚠️ IN OPTIONS 2 AND 3 THE CODE OPENS INSIDE THE CARD, UNDER ITS FOOTER (request, 18 Nov 2026: "the code will be shown at the
   bottom, below the card's content - not outside"). Two earlier shapes, both wrong for these options: the product's RIGHT-hand
   split leaves the chat a 280px column in which the card collides with itself, and a bottom split of the whole page (built the
   same day, removed) was still a second panel outside the card. Now the Code button is a toggle - Code / Hide code - and the
   source is a section of the card itself: a slim head (name · copy · close) over the lines, 320px tall at most, scrolling inside.
   One card's code is open at a time. Option 1 keeps the product's right-hand split. */
function codeBottom(){ return forgeOpt()!=='1'; }
function codeInlineOff(){ $$('.mx-fcode').forEach(function(x){ var c=x.closest('.mira-forge'), b=c&&$('[data-mx-code]',c); if(b){ b.textContent=' Code '; b.setAttribute('aria-expanded','false'); } x.remove(); }); }
function codeInline(card,key,keep){ var open=$('.mx-fcode',card); if(open){ if(!keep) codeInlineOff(); return; }
  var t=tpl('code-'+key), sec=t&&$('.mira-code-pane',t.content); if(!sec) return; codeInlineOff();
  var w=document.createElement('div'); w.className='mx-fcode'; w.appendChild(sec.cloneNode(true)); card.appendChild(w); dress(w);
  var b=$('[data-mx-code]',card); if(b){ b.textContent=' Hide code '; b.setAttribute('aria-expanded','true'); }
  /* bring it into view by scrolling the THREAD only - scrollIntoView would move every ancestor scroller, the host page included */
  var sc=thread(); if(sc){ var d=w.getBoundingClientRect().bottom-sc.getBoundingClientRect().bottom+12; if(d>0) sc.scrollTop+=d; } }
function openCode(key,card,keep){ var t=tpl('code-'+key); if(!t) return; if(card&&codeBottom()){ codeInline(card,key,keep); return; } var sp=$('.mira-split'); closeCode();
  var s=document.createElement('div'); s.className='splitpanes__splitter';
  var p=t.content.firstElementChild.cloneNode(true);
  $('#mxPane').style.width='34.8087%'; p.style.width='65.1913%'; sp.appendChild(s); sp.appendChild(p); dress(p); }
function dragSplit(e){ var sp=$('.mira-split'), a=$('#mxPane'), b=$('.mira-pane.is-preview',sp); if(!b) return; e.preventDefault(); document.body.classList.add('mx-drag');
  var r=sp.getBoundingClientRect();
  function mv(ev){ var pc=Math.max(20,Math.min(80,(ev.clientX-r.left)/r.width*100)); a.style.width=pc+'%'; b.style.width=(100-pc)+'%'; }
  function up(){ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); document.body.classList.remove('mx-drag'); }
  document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); }
function dragSide(e){ var as=$('aside.mira-sidebar'); if(as.classList.contains('is-collapsed')) return; e.preventDefault(); document.body.classList.add('mx-drag');
  var l=as.getBoundingClientRect().left;
  function mv(ev){ as.style.width=Math.max(220,Math.min(420,ev.clientX-l))+'px'; }
  function up(){ document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); document.body.classList.remove('mx-drag'); }
  document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); }

/* ── popups ── */
function closePops(){ if(MX.pop){ MX.pop.remove(); MX.pop=null; } $$('.mx-hdt.open').forEach(function(b){ b.classList.remove('open'); b.setAttribute('aria-expanded','false'); });
  $$('.mira-chat-menu-list').forEach(function(m){m.remove()});
  $$('.mira-chat-menu-button').forEach(function(b){ b.classList.remove('is-open'); b.setAttribute('aria-expanded','false'); }); }
function headMenu(btn){ var open=btn.classList.contains('is-open'); closePops(); if(open) return;
  if(MX.cur==='new'){ return; }
  var m=first('hmenu'); btn.parentElement.appendChild(m); btn.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
function rowMenu(btn,id){ var same=MX.pop&&MX.popFor===btn; closePops(); if(same) return;
  var m=first('rmenu'); m.removeAttribute('style'); m.classList.add('mx-pop'); m.setAttribute('data-mx-row',id); document.body.appendChild(m);
  var r=btn.getBoundingClientRect(); m.style.left=Math.max(8,r.right-m.offsetWidth+6)+'px'; m.style.top=(r.bottom+2)+'px'; MX.pop=m; MX.popFor=btn; }
function effMenu(btn){ var same=MX.pop&&MX.popFor===btn; closePops(); if(same) return;
  var m=first('effort'); m.removeAttribute('style'); m.classList.add('mx-pop');
  var chk=$('.mira-effort-check',m);
  $$('.mira-effort-option',m).forEach(function(o){ var on=o.textContent.trim()===MX.eff; o.classList.toggle('is-current',on); o.parentElement.classList.toggle('ant-dropdown-menu-item-selected',on); if(on&&chk) o.appendChild(chk); });
  document.body.appendChild(m); var r=btn.getBoundingClientRect();
  m.style.left=Math.max(8,r.right-m.offsetWidth)+'px'; m.style.top=Math.max(8,r.top-m.offsetHeight-4)+'px'; MX.pop=m; MX.popFor=btn; }
function effPaint(){ $$('#mxPane .mira-effort-pill').forEach(function(p){
    p.setAttribute('aria-label','Reasoning depth: '+MX.eff); p.title='Reasoning depth — '+MX.eff;
    $$('.mira-effort-bars span',p).forEach(function(b,i){ b.classList.toggle('is-on',i<EFF[MX.eff]); });
    for(var n=p.firstChild;n;n=n.nextSibling){ if(n.nodeType===3&&n.nodeValue.trim()){ n.nodeValue=' '+MX.eff+' '; break; } } }); }
function tipShow(wrap){ var t=tpl('tip'); if(!t||!t.content.firstElementChild||MX.tip) return; var el=first('tip'); el.removeAttribute('style'); el.classList.add('mx-tip'); document.body.appendChild(el);
  var r=wrap.getBoundingClientRect(); el.style.left=Math.max(8,r.left+r.width/2-el.offsetWidth/2)+'px'; el.style.top=(r.top-el.offsetHeight-6)+'px'; MX.tip=el; }
function tipHide(){ if(MX.tip){ MX.tip.remove(); MX.tip=null; } }

/* ── sidebar ── */
function rowOf(id){ return $('.mira-side-row.is-chat[data-mx-chat="'+id+'"]'); }
function titleOf(id){ var a=rowOf(id); return a?$('.mira-recent-name',a).textContent.trim():''; }
function rename(id){ closePops(); var a=rowOf(id); if(!a) return; var nm=$('.mira-recent-name',a), old=nm.textContent.trim();
  var inp=document.createElement('input'); inp.className='mx-rename'; inp.value=old; nm.textContent=''; nm.appendChild(inp); inp.focus(); inp.select();
  var done=function(ok){ inp.onblur=null; var v=(ok&&inp.value.trim())||old; nm.textContent=v; a.title=v;
    var p=MX.panes[id]; if(p){ var c=$('.mira-crumb.is-current',p); if(c){ c.textContent=v; c.title=v; } } if(MX.cur===id){ document.title=v+' · Mira'; var hn=$('#mxPane .mx-hdn'); if(hn) hn.textContent=v; } };
  inp.onclick=function(e){e.preventDefault();e.stopPropagation()};
  inp.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter') done(true); else if(e.key==='Escape') done(false); };
  inp.onblur=function(){done(true)}; }
function del(id){ closePops(); var a=rowOf(id); if(a) a.closest('li').remove(); delete MX.panes[id]; bandPaint(); if(MX.cur===id) show('new'); toast('Chat deleted'); }
function link(id){ closePops(); copy(location.href.split('#')[0]+'#/c/'+id,'Chat link copied'); }
/* Search chats is the DS search field (obs-input type=search), always on screen in the sidebar (request, 17 Nov 2026).
   It replaced a "Search chats" row that toggled a hand-built box. ⌘K focuses it; Esc clears it. */
function srchMount(){ if($('.mx-srch')) return; var row=$('[data-testid="mira-search-chats"]'); if(!row) return;
  var w=document.createElement('div'); w.className='mx-srch';
  w.innerHTML='<obs-input class="mx-srchi" type="search" placeholder="Search" aria-label="Search chats (⌘K)" allow-clear></obs-input><kbd class="mx-srchk">⌘K</kbd>';
  row.insertAdjacentElement('afterend',w); row.classList.add('mx-hide');
  var inp=$('obs-input',w); srchSkin(inp);
  inp.addEventListener('input',function(e){ var v=e.detail&&e.detail.length!==undefined?e.detail[0]:inp.value; filter(String(v==null?'':v)); w.classList.toggle('has-q',!!String(v||'')); }); }
/* the DS field, re-laid inside its own shadow root (request, 17 Nov 2026): the magnifier leads instead of trailing, the
   box is a soft filled pill on the --mira tokens, and the ⌘K hint sits at its right edge. Adopted, so it is the DS
   element's own markup and behaviour — only its skin changes. */
function srchSkin(o){ var go=function(){ var sh=o.shadowRoot; if(!sh||!sh.querySelector('.ip')){ return setTimeout(go,30); } if(sh.__mx) return; sh.__mx=1;
  var c=new CSSStyleSheet(); c.replaceSync('.root,.grp{width:100%}.ip{height:34px;padding:0 44px 0 12px;gap:8px;border:1px solid var(--mira-panel-edge);border-radius:var(--btn-radius,4px);background:transparent;transition:border-color .15s,background .15s}'+
    '.ip:hover{border-color:var(--mira-kbd-edge)}.ip:focus-within{border-color:var(--mira-accent-45);background:var(--mira-ask-face)}'+
    '.adorn.suf{order:-1;margin:0;color:var(--mira-text-muted);opacity:.6}.field{font-size:13px}.field::placeholder{color:var(--mira-text-muted);opacity:.6}');
  sh.adoptedStyleSheets=sh.adoptedStyleSheets.concat([c]); }; go(); }
function srchField(){ var o=$('.mx-srch obs-input'); return o&&o.shadowRoot?o.shadowRoot.querySelector('input'):null; }
function searchTog(force){ var as=$('aside.mira-sidebar'); if(as.classList.contains('is-collapsed')) sideTog(); srchMount();
  var o=$('.mx-srch obs-input'); if(!o) return;
  if(force===false){ o.value=''; filter(''); $('.mx-srch').classList.remove('has-q'); return; }
  var i=srchField(); if(i){ try{ i.focus(); i.select(); }catch(e){} } }
setTimeout(srchMount,0);
function filter(q){ q=q.trim().toLowerCase(); var n=0; $$('.mira-recents-list > li:not(.mx-band)').forEach(function(li){ var hit=!q||li.textContent.toLowerCase().indexOf(q)>=0; li.classList.toggle('mx-hide',!hit); if(hit) n++; });
  var nm=$('.mx-nomatch'); if(!n&&q){ if(!nm){ nm=document.createElement('div'); nm.className='mx-nomatch'; $('.mira-recents-list').insertAdjacentElement('afterend',nm); } nm.textContent='No chats match “'+q+'”'; } else if(nm) nm.remove(); bandVis(); }
function sideTog(){ var as=$('aside.mira-sidebar'), col=as.classList.contains('is-collapsed');
  if(!col){ MX.side=document.createDocumentFragment(); while(as.firstChild) MX.side.appendChild(as.firstChild); MX.sideW=as.style.width; as.innerHTML=tpl('sidec').innerHTML; as.classList.add('is-collapsed'); as.style.width=''; dress(as); }
  else { as.textContent=''; as.appendChild(MX.side); MX.side=null; as.classList.remove('is-collapsed'); as.style.width=MX.sideW||'18rem'; } }

/* ── sending (canned) ── */
function grow(ta){ var min=parseFloat(ta.style.minHeight)||35, max=parseFloat(ta.style.maxHeight)||242; ta.style.height=min+'px'; var h=Math.min(max,Math.max(min,ta.scrollHeight)); ta.style.height=h+'px'; ta.style.overflowY=ta.scrollHeight>max?'auto':'hidden';
  var sb=$('#mxPane .mira-submit'); if(sb&&!MX.play) sb.disabled=!ta.value.trim()||MX.busy; }
function think(msg,ms,after){ var head=$('.mira-group-head',msg), ttl=$('.mira-group-title',msg), md=$$('.mira-md',msg).filter(function(m){return !m.closest('.mira-group-fold')}), act=$('.mira-message-actions',msg);
  MX.busy=true; if(ttl) ttl.textContent=' Thinking… '; md.forEach(function(m){m.classList.add('mx-hide')}); if(act) act.classList.add('mx-hide');
  var sb=$('#mxPane .mira-submit'); if(sb){ sb.classList.add('is-busy'); sb.disabled=true; }
  clearTimeout(MX.t); MX.t=setTimeout(function(){ MX.busy=false; if(ttl) ttl.textContent=' Thought it through '; md.forEach(function(m){m.classList.remove('mx-hide')}); if(act) act.classList.remove('mx-hide');
    var s2=$('#mxPane .mira-submit'); if(s2){ s2.classList.remove('is-busy'); var ta=$('#mxPane .mira-composer-input'); s2.disabled=!(ta&&ta.value.trim()); }
    if(after) after(); toBottom(); },ms); }
function reply(q){ var src=tpl('c1').content, list=$('#mxPane .mira-thread-list'); if(!list) return;
  var u=$('.mira-message.is-user',src).cloneNode(true); $('.mira-user-bubble',u).textContent=q; list.appendChild(u);
  var all=$$('.mira-message.is-assistant',src), a=all[all.length-1].cloneNode(true), parts=$('.mira-message-parts',a);
  var grp=$('.mira-activity-group',parts), md=$$('.mira-md',parts).filter(function(m){return !m.closest('.mira-group-fold')})[0];
  var stepSrc=$$('.mira-group-step',src).filter(function(s){return $('.mira-step-reasoning',s)})[0];
  Array.prototype.slice.call(parts.children).forEach(function(c){ if(c!==grp&&c!==md) c.remove(); });
  if(grp){ var steps=$('.mira-group-steps',grp); if(steps&&stepSrc){ steps.textContent=''; var st=stepSrc.cloneNode(true); var dt=$('.mira-step-detail',st); if(dt) dt.textContent='Answering in the prototype';
      var rt=$('.mira-reasoning-text',st); if(rt) rt.innerHTML='<p>This page is a prototype of Mira. It is not connected to a model or to the ObserveOps tools, so there is nothing to look up or run for this request.</p>'; steps.appendChild(st); }
    var h=$('.mira-group-head',grp); h.setAttribute('aria-expanded','false'); var ch=$('.mira-step-chevron',h); if(ch) ch.classList.remove('is-open'); }
  if(md) md.innerHTML='<p>I can’t act on that here — this is a prototype of the Mira page, so no model or ObserveOps tool is connected.</p><p>In the product I would look up the monitors, alerts and runbooks involved, show what I found, and ask for your approval before changing anything.</p>';
  $$('.mira-usage',a).forEach(function(x){x.remove()});
  list.appendChild(a); dress(a); toBottom(); think(a,1500); }
function send(){ if(MX.play){ MX.play.finish(true); return; }
  var ta=$('#mxPane .mira-composer-input'); if(!ta||MX.busy) return; var q=ta.value.trim(); if(!q) return;
  if(MX.cur==='new'&&/create\s+(a\s+|the\s+)?runbook/i.test(q)){ startRunbook(q); return; }
  var rb=MX.panes[MX.cur]&&MX.panes[MX.cur].__rb; if(rb&&(rb.wait==='run'||rb.wait==='run-later')&&/^\s*run\b/i.test(q)){ ta.value=''; grow(ta); rbRun(MX.panes[MX.cur],q); return; }
  var cur=MX.panes[MX.cur];
  if(cur&&cur.__queue&&cur.__queue.length&&cur.__queue[0].classList.contains('is-user')&&$('.mira-user-bubble',cur.__queue[0]).textContent.trim().toLowerCase()===q.toLowerCase()){
    ta.value=''; ta.placeholder='Reply to Mira…'; grow(ta); cur.__queue.shift(); userMsg(cur,q); toBottom(); playQueue(cur); return; }
  if(MX.cur==='new'){ var t=q.replace(/\s+/g,' '); t=t.length>40?t.slice(0,40).replace(/\s+\S*$/,'')+'…':t; t=t.charAt(0).toUpperCase()+t.slice(1); show(fileChat(t)); }
  else { ta.value=''; grow(ta); }
  reply(q); }


/* ── step-by-step replay of the recorded "Runbook Creation" run (c3) ──────────────────────
   Typing "create runbook" in a New chat plays that chat back the way the live page streams it:
   "Working on your request… · Ns", then each thinking group OPEN with a dot-matrix mark and a
   "Working · Used …" title while its steps arrive one at a time, then the cards and the text.
   The recorded run has a second prompt ("run"): the replay waits for you to type it.        */
var STOP_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em"><path d="M5 7a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -10"/></svg>';
function matrix(){ var m=document.createElement('span'); m.className='mira-dot-matrix'; m.setAttribute('data-v-cfad4f7c',''); m.setAttribute('aria-hidden','true'); m.style.cssText='width:20px;height:20px;grid-template-columns:repeat(4,1fr);gap:2.5px';
  for(var i=0;i<16;i++){ var d=document.createElement('span'); d.className='mira-dot'; d.setAttribute('data-v-cfad4f7c',''); m.appendChild(d); } tick(); var tile=document.createElement('span'); tile.className='mx-dmtile'; tile.setAttribute('aria-hidden','true'); tile.appendChild(m); return tile; }
/* ONE creation animation (request 17 Nov 2026 — it cycled four unrelated patterns: ring, sweep, pulse, diagonal).
   The 4x4 grid is BUILT: cells lay in one at a time, bottom row first, left to right, like bricks; it holds full
   for a beat, then clears and builds again. Cumulative states, so every frame is the build so far.             */
var DM=(function(){ var order=[12,13,14,15,8,9,10,11,4,5,6,7,0,1,2,3], st=[], cur=[];
  order.forEach(function(i){ cur=cur.concat(i); st.push(cur); });
  st.push(cur,cur,cur,cur); st.push([],[]); return [st]; })();
function tick(){ if(MX.tick) return; var pat=0,st=0; MX.tick=setInterval(function(){ var ms=$$('.mira-dot-matrix'), ts=$$('.mira-live-time[data-mx-t0]');
    if(!ms.length&&!ts.length){ clearInterval(MX.tick); MX.tick=null; return; }
    var on=DM[pat][st]; st++; if(st>=DM[pat].length){ st=0; pat=(pat+1)%DM.length; }
    ms.forEach(function(m){ [].forEach.call(m.children,function(d,i){ d.classList.toggle('is-on',on.indexOf(i)>=0); }); });
    ts.forEach(function(t){ t.textContent='· '+Math.round((Date.now()-(+t.getAttribute('data-mx-t0')))/1000)+'s'; }); },120); }
function liveLine(label){ label=label||'Working on your request'; var w=document.createElement('div'); w.className='mira-live-activity'; w.setAttribute('data-v-7909f8be','');
  w.innerHTML='<div class="mira-live-line" data-v-7909f8be=""><span class="mira-live-label mira-shimmer" data-v-7909f8be="" data-v-4af8a674="" style="--mira-shimmer-spread:'+(label.length*2+2)+'px">'+label+'…</span><span class="mira-live-time" data-v-7909f8be="" data-mx-t0="'+Date.now()+'">· 1s</span></div>'; tick(); return w; }
function stepLabel(s){ var st=$('.mira-step-row',s); if(!st) return 'Working';
  if(st.classList.contains('is-static')){ var m=/Reading the\s+(.+?)\s+skill/.exec(st.textContent.replace(/\s+/g,' ')); return m?'Used the '+m[1]+' skill':st.textContent.trim(); }
  var t=$('.mira-step-title',st), d=$('.mira-step-detail',st); t=t?t.textContent.trim():'';
  return t==='Thought'?'Thinking'+(d&&d.textContent.trim()?': '+d.textContent.trim().toLowerCase():''):'Used '+t; }
function mkPlay(pane){ var P={pane:pane,fast:false,stopped:false,res:null};
  P.wait=function(ms){ if(P.fast) return Promise.resolve(); return new Promise(function(r){ P.res=r; P.t=setTimeout(function(){ P.res=null; r(); },ms); }); };
  P.finish=function(stop){ P.fast=true; if(stop) P.stopped=true; clearTimeout(P.t); if(P.res){ var r=P.res; P.res=null; r(); } };
  P.bottom=function(){ if($('#mxPane').firstElementChild===pane) toBottom(); }; return P; }
function diaFresh(t){ t.classList.remove('mx-fresh'); void t.offsetWidth; t.classList.add('mx-fresh'); }
function diaOnce(t){ t.classList.remove('mx-dia-once'); void t.offsetWidth; t.classList.add('mx-dia-once'); clearTimeout(t.__dia); t.__dia=setTimeout(function(){ t.classList.remove('mx-dia-once'); },1500); }
async function playGroup(g,P){ var head=$('.mira-group-head',g), ttl=$('.mira-group-title',g), fin=ttl.textContent, ch=$('.mira-step-chevron',head), steps=$$('.mira-group-step',g);
  steps.forEach(function(s){ s.classList.add('mx-hide'); }); g.classList.remove('mx-hide'); head.setAttribute('aria-expanded','true'); if(ch) ch.classList.add('is-open');
  var dm=matrix(); head.insertBefore(dm,head.firstChild); ttl.textContent=' Working '; ttl.classList.remove('mx-dia-once'); ttl.classList.add('mx-dia');
  for(var i=0;i<steps.length;i++){ steps[i].classList.remove('mx-hide'); wordFade(steps[i]); var nt=' Working · '+(sumTitle(steps.slice(0,i+1))||'starting')+' ';
    if(nt!==ttl.textContent){ ttl.textContent=nt; diaFresh(ttl); } P.bottom(); await P.wait(1100); }
  dm.remove(); ttl.textContent=' '+(sumTitle(steps)||fin.trim())+' '; ttl.classList.remove('mx-dia','mx-fresh'); diaOnce(ttl); head.setAttribute('aria-expanded','false'); if(ch) ch.classList.remove('is-open'); }
async function playMsg(msg,P){ var list=$('.mira-thread-list',P.pane), parts=$('.mira-message-parts',msg), kids=[].slice.call(parts.children), act=$('.mira-message-actions',msg);
  kids.forEach(function(k){ k.classList.add('mx-hide'); }); if(act) act.classList.add('mx-hide');
  var live=liveLine(); parts.appendChild(live); list.appendChild(msg); dress(msg); P.bottom(); await P.wait(1300);
  for(var i=0;i<kids.length;i++){ var k=kids[i];
    if(k.classList.contains('mira-activity-group')){ live.classList.add('mx-hide'); await playGroup(k,P); live.classList.remove('mx-hide'); P.bottom(); await P.wait(500); }
    else { k.classList.remove('mx-hide'); P.bottom(); await P.wait(900); } }
  live.remove(); if(act) act.classList.remove('mx-hide'); P.bottom(); }
function busyPaint(pane,on){ var sb=$('.mira-submit',pane); if(!sb) return; var ic=$('.anticon',sb)||sb;
  if(on){ if(!sb.__ic) sb.__ic=ic.innerHTML; ic.innerHTML=STOP_SVG; sb.classList.add('is-busy'); sb.disabled=false; sb.title='Stop'; sb.setAttribute('aria-label','Stop'); }
  else { if(sb.__ic){ ic.innerHTML=sb.__ic; sb.__ic=null; } sb.classList.remove('is-busy'); sb.title='Send prompt'; sb.setAttribute('aria-label','Send prompt'); var ta=$('.mira-composer-input',pane); sb.disabled=!(ta&&ta.value.trim()); } }
async function playQueue(pane){ var q=pane.__queue; if(!q||!q.length||MX.play) return; var P=MX.play=mkPlay(pane); MX.busy=true; busyPaint(pane,true);
  while(q.length&&q[0].classList.contains('is-assistant')&&!P.stopped){ await playMsg(q.shift(),P); if(q.length&&q[0].classList.contains('is-assistant')&&!P.stopped) await P.wait(1200); }
  if(q.length&&q[0].classList.contains('is-user')){ var ta=$('.mira-composer-input',pane); if(ta) ta.placeholder='Reply to Mira… (the recorded run continues with “'+$('.mira-user-bubble',q[0]).textContent.trim()+'”)'; }
  MX.play=null; MX.busy=false; busyPaint(pane,false); P.bottom(); }
function userMsg(pane,text){ var u=$('.mira-message.is-user',tpl('c1').content).cloneNode(true); $('.mira-user-bubble',u).textContent=text; $('.mira-thread-list',pane).appendChild(u); }
function fileChat(t,src){ var id='n'+(++MX.seq), node=first(src||'c1');
  var c=$('.mira-crumb.is-current',node); c.textContent=t; c.title=t; var cost=$('.mira-cost-chip',node); if(cost){ for(var n=cost.firstChild;n;n=n.nextSibling) if(n.nodeType===3) n.nodeValue='$0.00'; }
  $('.mira-thread-list',node).textContent=''; MX.panes[id]=node;
  var ul=$('.mira-recents-list'); if(!ul){ sideTog(); ul=$('.mira-recents-list'); }
  var li=first('row'); var a=$('a',li); a.setAttribute('data-mx-chat',id); a.title=t; a.classList.remove('is-active'); $('.mira-recent-name',a).textContent=t; ul.insertBefore(li,ul.firstChild); MX.at[id]=Date.now(); bandPaint();
  return id; }
function startReplay(q){ var id=fileChat('Runbook Creation','c3'), pane=MX.panes[id];
  var msgs=[].slice.call($('.mira-thread-list',tpl('c3').content).children).map(function(m){ return m.cloneNode(true); });
  msgs.shift(); pane.__queue=msgs; show(id); userMsg(pane,q); toBottom(); playQueue(pane); }


/* ── the "create runbook" flow (newest live run, c4) — interactive ────────────────────────
   create runbook → thinking steps → DOCKED question card (Runbook · Target · Action · Review)
   → answers recorded → Mira builds: the runbook card walks its states (Draft ready → It breaks
   the runbook rules → That name is taken → Could not test it; then the Diagnostic card: Saving
   and compiling → Saved and compiled → Delivering) → Test passed → DOCKED delivery card →
   Delivered card + next-step chips → "run" → DOCKED run-approval card → the run result.
   The markup of the three docked cards is built from the product's own templates (read out of
   its bundle); sc() stamps the scoped data-v attributes the product CSS keys on.            */
var IP='192.0.2.60', RB='Linux Disk Free Percentage Diagnostic';
var TICK='<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }
function sc(root){ var M=window.MX_SC||{}; [root].concat($$('*',root)).forEach(function(e){ var hit=false;
    [].forEach.call(e.classList||[],function(c){ (M[c]||[]).forEach(function(v){ e.setAttribute('data-v-'+v,''); hit=true; }); });
    if(!hit&&e.parentElement&&e!==root){ [].forEach.call(e.parentElement.attributes,function(a){ if(a.name.indexOf('data-v-')===0) e.setAttribute(a.name,''); }); } }); return root; }
function el(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return sc(t.content.firstElementChild); }
function isCur(pane){ return $('#mxPane').firstElementChild===pane; }
function dock(pane,card){ undock(pane); var f=$('.mira-footer',pane); $('.mira-composer',f).classList.add('mx-hide'); card.setAttribute('data-v-44a5716c',''); card.classList.add('mx-dock'); f.appendChild(card); if(isCur(pane)){ toBottom(); var fo=$('input:not([disabled])',card)||card; try{ fo.focus({preventScroll:true}); }catch(e){} } }
function undock(pane){ $$('.mx-dock',pane).forEach(function(c){ c.remove(); }); var c=$('.mira-footer .mira-composer',pane); if(c) c.classList.remove('mx-hide'); }
function hints(a){ return a.map(function(h,i){ return (i?'<span> · </span>':'')+h[0].map(function(k,j){ return (j?'<span>–</span>':'')+'<kbd>'+k+'</kbd>'; }).join('')+'<span> '+h[1]+'</span>'; }).join(''); }
function frame(inner,hint,btns,label){ return '<section class="mira-ask is-ask" role="group" tabindex="-1" aria-label="'+esc(label)+'"><div class="mira-ask-face">'+inner+'<div class="mira-ask-foot"><span class="mira-ask-hints" aria-hidden="true">'+hints(hint)+'</span><span class="mira-ask-spacer"></span>'+btns+'</div></div></section>'; }

/* the question card */

/* the question card, Ask AI's clarifier shape (request, 16 Nov 2026): ‹ · question · n / 3 · ✕, a subtitle, the 2px
   progress track, numbered rows (pick = answer and advance, 1–N keys), a "Something else…" row, Skip. The answers are
   still the live card's three (Runbook · Target · Action), so the record and everything after are unchanged. */
var CQ_BACK='<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>', CQ_X='<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  CQ_PEN='<svg viewBox="0 0 24 24"><path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>';
function askCard(pane,onSend,onChat){
  var Q=[{k:'Runbook',q:'What should the runbook do?',sub:'Tell me what you want the runbook to do, and I’ll build and test it on a real monitor.',opts:[],ph:'For example: collect disk usage, restart a service, or clear a cache.'},
         {k:'Target',q:'Which monitor or host should it run on?',sub:'I’ll test it there before anything is delivered.',opts:[],ph:'Type your answer…'},
         {k:'Action',q:'Should it only collect information, or change something?',sub:'Collecting is read-only; a change applies a remediation on the target.',opts:['Collect information only','Change something'],rec:0}];   /* rec = the recommended option's index */
  Q.forEach(function(x){ x.sel=x.opts.length?0:-1; x.free=''; });   /* a question with no options is ONE input field (request, 16 Nov 2026) */
  /* ⚠️ A REVIEW STEP AFTER THE LAST QUESTION (request, 18 Nov 2026: "when I give the answers it does not show the review of the
     questions and answers, or a way to change one - add this flow"). The card used to send from the third question. Now the
     last question leads to Review: every question with its answer, each row opens that question again, and Send answers is
     the only thing that sends. An answer changed from Review returns to Review, not through the later questions again. */
  var step=0, seen=false, wrap=document.createElement('div'); wrap.className='mx-aicq';
  function ans(x){ return x.sel<0?x.free.trim():x.opts[x.sel]; }
  function only(x){ return !x.opts.length; }
  function send(){ onSend(Q.map(function(x){ return [x.k,ans(x)||x.opts[0]||'',x.q]; })); }
  function paintReview(){
    wrap.innerHTML='<div class="aicq" role="group" aria-label="Review your answers"><div class="aicqh"><button class="aicqb" type="button" data-cq="back" title="Previous question">'+CQ_BACK+'</button>'+
      '<span class="aicqt">Review your answers</span><span class="aicqn">Review</span><button class="aicqc" type="button" data-cq="x" title="Chat instead">'+CQ_X+'</button></div>'+
      '<div class="aicqs">Check each answer before I build the runbook. Pick one to change it.</div><div class="aicqpg"><i style="width:100%"></i></div>'+
      Q.map(function(x,i){ var a=ans(x)||x.opts[0]||''; return '<button class="aicqo mx-rvrow" type="button" data-cq-rv="'+i+'" title="Change this answer"><span class="aicqi">'+(i+1)+'</span>'+
        '<span class="mx-rvtx"><span class="mx-rvq">'+esc(x.q)+'</span><span class="mx-rva'+(a?'':' is-skip')+'">'+esc(a||'Skipped')+'</span></span><span class="aicqp mx-rved" aria-hidden="true">'+CQ_PEN+'</span></button>'; }).join('')+
      '<div class="aicqd mx-rvfoot"><button class="aicqok" type="button" data-cq="send">Send answers</button></div></div>';
    if(isCur(pane)){ try{ ($('[data-cq=send]',wrap)||wrap).focus({preventScroll:true}); }catch(e){} toBottom(); } }
  function paint(){ if(step>=Q.length){ paintReview(); return; } var x=Q[step];
    wrap.innerHTML='<div class="aicq" role="group" aria-label="'+esc(x.q)+'"><div class="aicqh"><button class="aicqb" type="button" data-cq="back"'+(step?'':' disabled')+' title="Previous question">'+CQ_BACK+'</button>'+
      '<span class="aicqt">'+esc(x.q)+'</span><span class="aicqn"><b>'+(step+1)+'</b> / '+Q.length+'</span><button class="aicqc" type="button" data-cq="x" title="Chat instead">'+CQ_X+'</button></div>'+
      '<div class="aicqs">'+esc(x.sub)+'</div><div class="aicqpg"><i style="width:'+Math.round((step+1)/Q.length*100)+'%"></i></div>'+
      x.opts.map(function(o,i){ return '<button class="aicqo'+(x.sel===i?' on':'')+'" type="button" data-cq-i="'+i+'"><span class="aicqi">'+(i+1)+'</span>'+esc(o)+(x.rec===i?'<span class="mx-rec">Recommended</span>':'')+'</button>'; }).join('')+
      (only(x)?'<label class="aicqf mx-cqonly"><input value="'+esc(x.free)+'" placeholder="'+esc(x.ph)+'" maxlength="1000" autocomplete="off" aria-label="'+esc(x.q)+'"></label>'
        :'<label class="aicqf'+(x.sel<0?' on':'')+'"><span class="aicqp">'+CQ_PEN+'</span><input value="'+esc(x.free)+'" placeholder="Something else…" maxlength="1000" autocomplete="off"></label>')+
      '<div class="aicqd"><button class="aicqsk" type="button" data-cq="skip">Skip</button>'+(only(x)?'<button class="aicqok" type="button" data-cq="next"'+(x.free.trim()?'':' disabled')+'>'+(seen||step===Q.length-1?'Review':'Next')+'</button>':'')+'</div></div>';
    if(isCur(pane)){ var f=x.sel<0?$('.aicqf input',wrap):$('.aicqo.on',wrap); if(f&&f.tagName==='INPUT') try{ f.setSelectionRange(f.value.length,f.value.length); }catch(e){} try{ (f||wrap).focus({preventScroll:true}); }catch(e){} toBottom(); } }
  function next(){ if(seen||step>=Q.length-1){ seen=true; step=Q.length; } else step++; paint(); }
  wrap.tabIndex=-1;
  wrap.onclick=function(e){ var rv=e.target.closest('[data-cq-rv]'); if(rv){ step=+rv.getAttribute('data-cq-rv'); paint(); return; }
    var b=e.target.closest('[data-cq-i]'); if(b){ Q[step].sel=+b.getAttribute('data-cq-i'); $$('.aicqo',wrap).forEach(function(r){ r.classList.toggle('on',r===b); }); $('.aicqf',wrap).classList.remove('on'); setTimeout(next,180); return; }
    b=e.target.closest('[data-cq]'); if(!b) return; var a=b.getAttribute('data-cq');
    if(a==='send'){ send(); return; }
    if(a==='back'&&step){ step--; paint(); } else if(a==='x') onChat(); else if(a==='next'){ if(Q[step].free.trim()) next(); } else if(a==='skip'){ if(!only(Q[step])&&Q[step].sel<0&&!Q[step].free.trim()) Q[step].sel=0; next(); } };
  wrap.oninput=function(e){ if(!e.target.matches('.aicqf input')||step>=Q.length) return; var x=Q[step]; x.free=e.target.value; if(only(x)){ var nb=$('[data-cq=next]',wrap); if(nb) nb.disabled=!x.free.trim(); return; } x.sel=x.free.trim()?-1:0;
    $$('.aicqo',wrap).forEach(function(r,i){ r.classList.toggle('on',i===x.sel); }); $('.aicqf',wrap).classList.toggle('on',x.sel<0); };
  wrap.onkeydown=function(e){ e.stopPropagation(); var inp=e.target.matches&&e.target.matches('input');
    if(e.key==='Escape'){ e.preventDefault(); onChat(); }
    else if(step>=Q.length){ if(e.key==='Enter'){ if(e.target.closest&&e.target.closest('[data-cq-rv]')) return; e.preventDefault(); send(); }
      else if(/^[1-9]$/.test(e.key)&&+e.key<=Q.length){ e.preventDefault(); step=+e.key-1; paint(); }
      else if(e.key==='ArrowLeft'||e.key==='Backspace'){ e.preventDefault(); step=Q.length-1; paint(); } }
    else if(e.key==='Enter'){ e.preventDefault(); if(!inp||Q[step].free.trim()) next(); }
    else if(!inp&&/^[1-9]$/.test(e.key)){ var n=+e.key-1; if(n<Q[step].opts.length){ var r=$$('.aicqo',wrap)[n]; if(r) r.click(); } else if(n===Q[step].opts.length){ e.preventDefault(); $('.aicqf input',wrap).focus(); } }
    else if(!inp&&(e.key==='ArrowLeft'||e.key==='Backspace')&&step){ e.preventDefault(); step--; paint(); } };
  dock(pane,wrap); paint(); }

/* ── the clarifier, OPTION 2 (request, 18 Nov 2026, from a supplied reference card) ────────────────────────────────────────
   The Ask AI clarifier re-laid, as a SECOND option - askCard above is kept as it is. What changed, part for part:
     head     the question in plain weight on the left; ‹ n of 3 › and ✕ on the right. No back button on the left, no subtitle,
              no progress bar.
     rows     a 28px number chip, the option, and its one-line meaning under it; a hairline between rows.
     last row a pen chip, the free-text field ("Something else", or the example when the question has no options) and ONE button:
              Skip while the field is empty, Next / Review once something is typed.
     below    nothing - the composer is hidden while the card is open, like every other docked card (it was kept as
              "Or reply directly…" at first, and removed on request the same day).
   Nothing is preselected and Skip really skips (the record says Skipped). The Review step and its rule are askCard's: every
   answer listed, a row reopens its question, an edited answer returns to Review, and Send answers is the only thing that sends. */
function askCardV2(pane,onSend,onChat){
  var Q=[{k:'Runbook',q:'What should the runbook do?',ph:'For example: collect disk usage, restart a service, or clear a cache.',rows:[]},
         {k:'Target',q:'Which monitor or host should it run on?',ph:'Type a monitor or host name',rows:[]},
         {k:'Action',q:'Should it only collect information, or change something?',ph:'Something else',
          /* a row's third value marks it RECOMMENDED: the tag sits at the row's right end (request, 18 Nov 2026) */
          rows:[['Collect information only','Read state and return evidence without changing the target.',1],['Change something','Apply a remediation on the target.',0]]}];
  Q.forEach(function(x){ x.sel=-1; x.free=''; });
  var N=Q.length, step=0, seen=false, wrap=document.createElement('div'); wrap.className='mx-aicq mx-cl'; wrap.tabIndex=-1;
  var ta=$('.mira-composer-input',pane), ph0=ta?ta.placeholder:'';
  function ans(x){ return x.sel>=0?x.rows[x.sel][0]:x.free.trim(); }
  function close(){ if(ta){ ta.placeholder=ph0; ta.removeEventListener('keydown',direct,true); } }
  function send(){ close(); onSend(Q.map(function(x){ return [x.k,ans(x),x.q]; })); }
  function chat(){ close(); onChat(); }
  function direct(e){ if(e.key==='Enter'&&!e.shiftKey&&ta.value.trim()) chat(); }
  function goLabel(){ return seen||step===N-1?'Review':'Next'; }
  function head(t,mid,canBack,canFwd){ return '<div class="mx-clh"><span class="mx-clt">'+esc(t)+'</span><span class="mx-clnav"><button type="button" data-cq="back" aria-label="Previous question"'+(canBack?'':' disabled')+'>'+CQ_BACK+'</button><span>'+mid+'</span>'+
    '<button type="button" data-cq="fwd" aria-label="Next question"'+(canFwd?'':' disabled')+'>'+CQ_FWD+'</button></span><button type="button" class="mx-clx" data-cq="x" aria-label="Chat instead" title="Chat instead">'+CQ_X+'</button></div>'; }
  function paint(){ var h, rev=step>=N;
    if(rev){ h=head('Review your answers','Review',true,false)+Q.map(function(x,i){ var a=ans(x);
        return '<button type="button" class="mx-clo rv" data-cq-rv="'+i+'" title="Change this answer"><span class="mx-cln">'+(i+1)+'</span><span class="mx-cltx"><i>'+esc(x.q)+'</i><b'+(a?'':' class="is-skip"')+'>'+esc(a||'Skipped')+'</b></span>'+
          '<span class="mx-cled" aria-hidden="true">'+CQ_PEN+'</span></button>'; }).join('')+
        '<div class="mx-clf mx-clend"><span class="mx-clhint">Pick an answer to change it</span><button type="button" class="mx-clsk is-go" data-cq="send">Send answers</button></div>'; }
    else { var x=Q[step], typed=x.sel<0&&!!x.free.trim();
      h=head(x.q,(step+1)+' of '+N,step>0,true)+x.rows.map(function(r,i){ return '<button type="button" class="mx-clo'+(x.sel===i?' on':'')+'" data-cq-i="'+i+'"><span class="mx-cln">'+(i+1)+'</span><span class="mx-cltx"><b>'+esc(r[0])+'</b><i>'+esc(r[1])+'</i></span>'+(r[2]?'<span class="mx-rec">Recommended</span>':'')+'</button>'; }).join('')+
        '<label class="mx-clf"><span class="mx-cln">'+CQ_PEN+'</span><input value="'+esc(x.free)+'" placeholder="'+esc(x.ph)+'" maxlength="1000" autocomplete="off" aria-label="'+esc(x.rows.length?'Something else':x.q)+'">'+
        '<button type="button" class="mx-clsk'+(typed?' is-go':'')+'" data-cq="'+(typed?'next':'skip')+'">'+(typed?goLabel():'Skip')+'</button></label>'; }
    wrap.innerHTML='<div class="mx-clc" role="group" aria-label="'+esc(rev?'Review your answers':Q[step].q)+'">'+h+'</div>';
    if(isCur(pane)){ var f=rev?$('[data-cq=send]',wrap):(Q[step].rows.length?($('.mx-clo.on',wrap)||wrap):$('.mx-clf input',wrap));
      try{ (f||wrap).focus({preventScroll:true}); if(f&&f.tagName==='INPUT') f.setSelectionRange(f.value.length,f.value.length); }catch(e){} toBottom(); } }
  function next(){ if(seen||step>=N-1){ seen=true; step=N; } else step++; paint(); }
  wrap.onclick=function(e){ var b=e.target.closest('[data-cq-rv]'); if(b){ step=+b.getAttribute('data-cq-rv'); paint(); return; }
    b=e.target.closest('[data-cq-i]'); if(b){ var x=Q[step]; x.sel=+b.getAttribute('data-cq-i'); x.free=''; $$('.mx-clo',wrap).forEach(function(r){ r.classList.toggle('on',r===b); }); setTimeout(function(){ if(wrap.isConnected) next(); },180); return; }
    b=e.target.closest('[data-cq]'); if(!b||b.disabled) return; var a=b.getAttribute('data-cq'); e.preventDefault();
    if(a==='send') send(); else if(a==='x') chat(); else if(a==='back'){ step=Math.max(0,step-1); paint(); } else if(a==='fwd'||a==='next') next();
    else if(a==='skip'){ Q[step].sel=-1; Q[step].free=''; next(); } };
  wrap.oninput=function(e){ var x=Q[step]; if(!x||!e.target.matches('.mx-clf input')) return; x.free=e.target.value; var typed=!!x.free.trim(); if(typed) x.sel=-1;
    $$('.mx-clo',wrap).forEach(function(r,i){ r.classList.toggle('on',i===x.sel); });
    var b=$('.mx-clsk',wrap), go=typed&&x.sel<0; b.textContent=go?goLabel():'Skip'; b.setAttribute('data-cq',go?'next':'skip'); b.classList.toggle('is-go',go); };
  wrap.onkeydown=function(e){ e.stopPropagation(); var inp=e.target.matches&&e.target.matches('input'), btn=e.target.closest&&e.target.closest('button');
    if(e.key==='Escape'){ e.preventDefault(); chat(); return; }
    if(step>=N){ if(e.key==='Enter'){ if(btn) return; e.preventDefault(); send(); }
      else if(/^[1-9]$/.test(e.key)&&+e.key<=N){ e.preventDefault(); step=+e.key-1; paint(); }
      else if(e.key==='ArrowLeft'||e.key==='Backspace'){ e.preventDefault(); step=N-1; paint(); } return; }
    var x=Q[step];
    if(e.key==='Enter'){ if(btn) return; e.preventDefault(); if(ans(x)) next(); }
    else if(!inp&&/^[1-9]$/.test(e.key)){ var n=+e.key-1; if(n<x.rows.length){ var r=$$('.mx-clo',wrap)[n]; if(r) r.click(); } else if(n===x.rows.length){ e.preventDefault(); $('.mx-clf input',wrap).focus(); } }
    else if(!inp&&e.key==='ArrowLeft'&&step){ e.preventDefault(); step--; paint(); }
    else if(!inp&&e.key==='ArrowRight'){ e.preventDefault(); next(); } };
  /* the chat box is HIDDEN while the questions are open (request, 18 Nov 2026: "at question / answer time don't show the chat box").
     It was kept under the card as "Or reply directly…", after the reference. dock() hides it, like every other card; ✕ / Esc
     still hand it back. */
  dock(pane,wrap); paint(); }
function askCardTabs(pane,onSend,onChat){   /* the live tabbed card — the create-runbook card again since 17 Nov 2026: three questions
     (Runbook · Target · Action) + Review, never the live run's four, and no ✦ mark in its head (request) */
  var Q=[{k:'Runbook',text:'What should the runbook do?',kind:'text',ph:'For example: collect disk usage, restart a service, or clear a cache.',v:''},
         {k:'Target',text:'Which monitor or host should it run on?',kind:'text',ph:'Type your answer…',v:''},
         {k:'Action',text:'Should it only collect information, or change something?',kind:'choice',rows:[['Collect information only','Read state and return evidence without changing the target.',1],['Change something','Apply a remediation on the target.',0]],pick:0,typed:''}];
  var cur=0, host=document.createElement('div');
  function ans(q){ return q.kind==='text'?q.v.trim():(q.pick<0?q.typed.trim():q.rows[q.pick][0]); }
  function tabs(){ return Q.concat([{k:'Review'}]).map(function(q,i){ var done=i<Q.length&&!!ans(q);
      return '<button type="button" role="tab" class="mira-ask-tab'+(i===cur?' is-active':'')+'" aria-selected="'+(i===cur)+'" data-mx-tab="'+i+'"><span class="mira-ask-tick'+(done?' is-done':'')+'" aria-hidden="true">'+(done?TICK:'')+'</span> '+q.k+' </button>'; }).join(''); }
  function body(){ if(cur===Q.length) return '<div class="mira-ask-question">Review your answers</div><ul class="mira-ask-review">'+Q.map(function(q){ var a=ans(q); return '<li class="mira-ask-review-row"><span class="mira-ask-review-question">'+esc(q.text)+'</span><span class="mira-ask-review-answer'+(a?'':' is-missing')+'">'+esc(a||'Not answered yet')+'</span></li>'; }).join('')+'</ul>';
    var q=Q[cur]; if(q.kind==='text') return '<div class="mira-ask-question"> '+esc(q.text)+'</div><div class="mira-ask-text"><input type="text" class="mira-ask-text-input" placeholder="'+esc(q.ph)+'" aria-label="'+esc(q.text)+'" maxlength="1000" autocomplete="off" value="'+esc(q.v)+'"></div>';
    return '<div class="mira-ask-question"> '+esc(q.text)+'</div><div class="mira-ask-choices mira-ask-options" role="listbox" tabindex="0" aria-label="'+esc(q.text)+'">'+q.rows.map(function(r,i){ return '<button type="button" role="option" class="mira-ask-choice'+(q.pick===i?' is-picked is-focused':'')+'" aria-selected="'+(q.pick===i)+'" data-mx-pick="'+i+'"><span class="mira-ask-number" aria-hidden="true">'+(i+1)+'</span><span class="mira-ask-choice-body"><span class="mira-ask-choice-label">'+esc(r[0])+'</span><span class="mira-ask-choice-description">'+esc(r[1])+'</span></span>'+(r[2]?'<span class="mira-ask-recommended">Recommended</span>':'')+'</button>'; }).join('')+
      '<label class="mira-ask-typed'+(q.pick<0?' is-picked is-focused':'')+'"><span class="mira-ask-number" aria-hidden="true">'+(q.rows.length+1)+'</span><input type="text" class="mira-ask-typed-input" placeholder="Type your own answer…" aria-label="Type your own answer…" maxlength="1000" autocomplete="off" value="'+esc(q.typed)+'"></label></div>'; }
  function paint(focus){ var rev=cur===Q.length, ch=!rev&&Q[cur].kind==='choice', ok=Q.every(ans);
    var card=el(frame('<div class="mira-ask-head"><p class="mira-ask-intro">Tell me what you want the runbook to do, and I’ll build and test it on a real monitor.</p></div><div class="mira-ask-tabs" role="tablist" aria-label="Questions">'+tabs()+'</div>'+body(),
      ch?[[['1','3'],'pick'],[['Tab'],'next'],[['Esc'],'chat instead']]:[[['↵'],'send'],[['Tab'],'next'],[['Esc'],'chat instead']],
      '<button type="button" class="mira-ask-button is-ghost" data-mx-ask="chat"> Chat about this </button>'+(rev?'<button type="button" class="mira-ask-button is-primary" data-mx-ask="send"'+(ok?'':' disabled')+'> Send answers </button>':'<button type="button" class="mira-ask-button is-secondary" data-mx-ask="next"> Next </button>'),"Mira's questions"));
    card.setAttribute('data-v-44a5716c',''); card.classList.add('mx-dock'); if(host.parentNode) host.parentNode.replaceChild(card,host); host=card; wire();
    if(focus!==false&&isCur(pane)){ var i=$('.mira-ask-text-input',host)||(Q[cur]&&Q[cur].pick<0?$('.mira-ask-typed-input',host):null)||host; try{ i.focus({preventScroll:true}); if(i.value) i.setSelectionRange(i.value.length,i.value.length); }catch(e){} toBottom(); } }
  function ticks(){ var t=$('.mira-ask-tabs',host); if(t){ t.innerHTML=tabs(); sc(t); } }
  function go(i){ cur=Math.max(0,Math.min(Q.length,i)); paint(); }
  function send(){ if(!Q.every(ans)){ go(Q.findIndex(function(q){return !ans(q)})); return; } onSend(Q.map(function(q){ return [q.k,ans(q),q.text]; })); }
  function wire(){
    host.onclick=function(e){ var b=e.target.closest('[data-mx-tab]'); if(b){ go(+b.getAttribute('data-mx-tab')); return; }
      b=e.target.closest('[data-mx-pick]'); if(b){ Q[cur].pick=+b.getAttribute('data-mx-pick'); paint(); setTimeout(function(){ if(host.isConnected&&cur<Q.length&&Q[cur].kind==='choice') go(cur+1); },260); return; }
      b=e.target.closest('[data-mx-ask]'); if(b){ var a=b.getAttribute('data-mx-ask'); if(a==='chat') onChat(); else if(a==='next') go(cur+1); else send(); } };
    host.oninput=function(e){ var q=Q[cur]; if(!q) return; if(e.target.matches('.mira-ask-text-input')) q.v=e.target.value; else if(e.target.matches('.mira-ask-typed-input')){ q.typed=e.target.value; q.pick=-1; var l=e.target.closest('label'); $$('.mira-ask-choice',host).forEach(function(c){c.classList.remove('is-picked','is-focused')}); l.classList.add('is-picked','is-focused'); } ticks(); };
    host.onkeydown=function(e){ e.stopPropagation(); var inp=e.target.matches&&e.target.matches('input');
      if(e.key==='Escape'){ e.preventDefault(); onChat(); }
      else if(e.key==='Tab'){ e.preventDefault(); go(e.shiftKey?cur-1:(cur+1)%(Q.length+1)); }
      else if(e.key==='Enter'){ e.preventDefault(); if(cur===Q.length) send(); else if(ans(Q[cur])) go(cur+1); }
      else if(!inp&&cur<Q.length&&Q[cur].kind==='choice'&&/^[1-9]$/.test(e.key)){ var n=+e.key-1, q=Q[cur]; if(n<q.rows.length){ q.pick=n; paint(); setTimeout(function(){ if(host.isConnected&&cur<Q.length) go(cur+1); },260); } else if(n===q.rows.length){ e.preventDefault(); var t=$('.mira-ask-typed-input',host); if(t) t.focus(); } } }; }
  dock(pane,host); paint(); }

/* the create-runbook question card (request, 17 Nov 2026): the tabbed card's FLOW — Runbook · Target · Action · Review,
   any step reachable, Review then Send answers — in Ask AI's clarifier SHELL: ‹ · question · n / 3 · ✕, the subtitle,
   the 2px progress track, then a compact step strip, the answer, and Skip · Next. Rows are Ask AI's numbered rows. */
var CQ_FWD='<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>', CQ_ARR='<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 18 6-6-6-6"/></svg>';
var CQ_TICK='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
function askCardSteps(pane,onSend,onChat){
  var Q=[{k:'Runbook',q:'What should the runbook do?',sub:'Tell me what you want the runbook to do, and I’ll build and test it on a real monitor.',ph:'For example: collect disk usage, restart a service, or clear a cache.',v:''},
         {k:'Target',q:'Which monitor or host should it run on?',sub:'I’ll test it there before anything is delivered.',ph:'Type your answer…',v:''},
         {k:'Action',q:'Should it only collect information, or change something?',sub:'Collecting is read-only; a change applies a remediation on the target.',
          rows:[['Collect information only','Read state and return evidence without changing the target.',1],['Change something','Apply a remediation on the target.',0]],pick:0,typed:''}];
  var N=Q.length, cur=0, wrap=document.createElement('div'); wrap.className='mx-aicq mx-cqsteps'; wrap.tabIndex=-1;
  function ans(x){ return x.rows?(x.pick<0?x.typed.trim():x.rows[x.pick][0]):x.v.trim(); }
  function strip(){ return '<div class="mx-cqst" role="tablist" aria-label="Questions">'+Q.concat([{k:'Review'}]).map(function(x,i){ var d=i<N&&!!ans(x);
      return '<button type="button" role="tab" class="mx-cqtab'+(i===cur?' on':'')+(d?' done':'')+'" aria-selected="'+(i===cur)+'" data-cq-tab="'+i+'"><span class="mx-cqtk" aria-hidden="true">'+(d?CQ_TICK:'')+'</span>'+x.k+'</button>'; }).join('')+'</div>'; }
  /* minimal, after n8n's agent question card (Mobbin, request 17 Nov 2026): the question in bold, the answer, and ONE footer —
     ‹ n of 3 › on the left, Skip · Next on the right. No subtitle, progress bar, step strip or ✕; Esc still chats instead.
     A row shows its arrow only on hover / when picked; Review is the step after the third question. */
  function paint(){ var rev=cur===N, x=Q[cur], ok=Q.every(ans);
    var head=rev?'Review your answers':x.q;
    var h='<div class="aicq mx-min" role="group" aria-label="'+esc(head)+'"><div class="mx-mq">'+esc(head)+'</div>';
    if(rev) h+='<ol class="mx-cqrv">'+Q.map(function(y,i){ var a=ans(y); return '<li data-cq-tab="'+i+'" title="Change this answer"><div class="mx-cqrq">'+esc(y.k)+'</div><div class="mx-cqra'+(a?'':' miss')+'">'+esc(a||'Not answered yet')+'</div></li>'; }).join('')+'</ol>';
    else if(x.rows) h+=x.rows.map(function(r,i){ return '<button class="aicqo'+(x.pick===i?' on':'')+'" type="button" data-cq-i="'+i+'"><span class="aicqi">'+(i+1)+'</span><span class="mx-mol">'+esc(r[0])+(r[2]?'<em> · Recommended</em>':'')+'</span><span class="mx-moa">'+CQ_ARR+'</span></button>'; }).join('')+
      '<label class="aicqf'+(x.pick<0?' on':'')+'"><span class="aicqp">'+CQ_PEN+'</span><input value="'+esc(x.typed)+'" placeholder="Something else" maxlength="1000" autocomplete="off"></label>';
    else h+='<label class="aicqf mx-cqonly"><input value="'+esc(x.v)+'" placeholder="'+esc(x.ph)+'" maxlength="1000" autocomplete="off" aria-label="'+esc(x.q)+'"></label>';
    h+='<div class="mx-mf"><span class="mx-mpg"><button type="button" data-cq="back" aria-label="Previous"'+(cur?'':' disabled')+'>'+CQ_BACK+'</button><span>'+(rev?'Review':(cur+1)+' of '+N)+'</span><button type="button" data-cq="fwd" aria-label="Next step"'+(rev?' disabled':'')+'>'+CQ_FWD+'</button></span><span class="mx-msp"></span>'+
      (rev?'<button class="mx-mb is-pri" type="button" data-cq="send"'+(ok?'':' disabled')+'>Send answers</button>'
          :'<button class="mx-mb" type="button" data-cq="skip">Skip</button><button class="mx-mb is-pri" type="button" data-cq="next"'+(ans(x)?'':' disabled')+'>'+(cur===N-1?'Review':'Next')+'</button>')+'</div></div>';
    wrap.innerHTML=h;
    if(isCur(pane)){ var f=$('.aicqf input',wrap); if(f&&!x.rows) { try{ f.focus({preventScroll:true}); f.setSelectionRange(f.value.length,f.value.length); }catch(e){} } else try{ ($('.aicqo.on',wrap)||wrap).focus({preventScroll:true}); }catch(e){} toBottom(); } }
  function go(i){ cur=Math.max(0,Math.min(N,i)); paint(); }
  function send(){ if(!Q.every(ans)){ go(Q.findIndex(function(y){ return !ans(y); })); return; } onSend(Q.map(function(y){ return [y.k,ans(y),y.q]; })); }
  function sync(){ var x=Q[cur]; if(!x) return; var nb=$('[data-cq=next]',wrap); if(nb) nb.disabled=!ans(x); var s=$('.mx-cqst',wrap); if(s) s.outerHTML=strip(); }
  wrap.onclick=function(e){ var b=e.target.closest('[data-cq-tab]'); if(b){ go(+b.getAttribute('data-cq-tab')); return; }
    b=e.target.closest('[data-cq-i]'); if(b){ Q[cur].pick=+b.getAttribute('data-cq-i'); paint(); setTimeout(function(){ if(wrap.isConnected&&cur<N&&Q[cur].rows) go(cur+1); },220); return; }
    b=e.target.closest('[data-cq]'); if(!b||b.disabled) return; var a=b.getAttribute('data-cq');
    if(a==='back') go(cur-1); else if(a==='fwd') go(cur+1); else if(a==='x') onChat(); else if(a==='next'||a==='skip') go(cur+1); else if(a==='send') send(); };
  wrap.oninput=function(e){ var x=Q[cur]; if(!x||!e.target.matches('.aicqf input')) return;
    if(x.rows){ x.typed=e.target.value; x.pick=x.typed.trim()?-1:0; $$('.aicqo',wrap).forEach(function(r,i){ r.classList.toggle('on',i===x.pick); }); $('.aicqf',wrap).classList.toggle('on',x.pick<0); } else x.v=e.target.value; sync(); };
  wrap.onkeydown=function(e){ e.stopPropagation(); var inp=e.target.matches&&e.target.matches('input');
    if(e.key==='Escape'){ e.preventDefault(); onChat(); }
    else if(e.key==='Tab'){ e.preventDefault(); go(e.shiftKey?cur-1:(cur+1)%(N+1)); }
    else if(e.key==='Enter'){ e.preventDefault(); if(cur===N) send(); else if(ans(Q[cur])) go(cur+1); }
    else if(!inp&&cur<N&&Q[cur].rows&&/^[1-9]$/.test(e.key)){ var n=+e.key-1; if(n<Q[cur].rows.length){ var r=$$('.aicqo',wrap)[n]; if(r) r.click(); } else if(n===Q[cur].rows.length){ e.preventDefault(); $('.aicqf input',wrap).focus(); } } };
  dock(pane,wrap); paint(); }

function deliverCard(pane,onGo){
  var c=el('<article class="mira-deliver" role="group" tabindex="-1" aria-label="Deliver '+RB+'"><header class="mira-deliver-head"><span class="mira-deliver-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></span><div class="mira-deliver-heading"><h2 class="mira-deliver-title"> Deliver '+RB+' </h2><span class="mira-deliver-sub">Passed on motadata · assigns it, does not run it</span></div></header><ul class="mira-deliver-monitors" aria-label="Where it goes"><li class="mira-deliver-monitor"><svg class="mira-deliver-tick" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span class="mira-deliver-name">motadata</span><span class="mira-deliver-chip is-ok">tested</span></li></ul><footer class="mira-deliver-foot"><button type="button" class="mira-ask-button is-primary"> Deliver to 1 monitor </button></footer></article>');
  var b=$('.mira-ask-button',c), done=false; function go(){ if(done) return; done=true; b.disabled=true; b.textContent=' Delivering… '; setTimeout(onGo,700); }
  b.onclick=go; c.onkeydown=function(e){ if(e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); go(); } }; dock(pane,c); }
function runCard(pane,onGo,onCancel){
  var c=el(frame('<div class="mira-run-confirm-head"><span class="mira-run-confirm-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span><div class="mira-run-confirm-heading"><h2 class="mira-run-confirm-title"> Run '+RB+' </h2><span class="mira-run-confirm-sub">A real run, on the monitor it is assigned to</span></div></div><div class="mira-run-confirm-monitors" role="listbox" tabindex="0" aria-label="Where to run it"><button type="button" role="option" aria-selected="true" class="mira-run-confirm-monitor is-picked"><span class="mira-run-confirm-dot" aria-hidden="true"></span><span class="mira-run-confirm-name">motadata</span><span class="mira-run-confirm-ip">'+IP+'</span></button></div>',
    [[['↵'],'run'],[['Esc'],'later']],'<button type="button" class="mira-ask-button is-ghost" data-mx-ask="cancel"> Cancel </button><button type="button" class="mira-ask-button is-primary" data-mx-ask="go"> Approve and run on motadata </button>','Run '+RB));
  var done=false; function go(){ if(done) return; done=true; var b=$('[data-mx-ask="go"]',c); b.disabled=true; b.textContent=' Starting… '; setTimeout(onGo,700); }
  c.onclick=function(e){ var b=e.target.closest('[data-mx-ask]'); if(!b) return; if(b.getAttribute('data-mx-ask')==='go') go(); else onCancel(); };
  c.ondblclick=function(e){ if(e.target.closest('.mira-run-confirm-monitor')) go(); };
  c.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter'){ e.preventDefault(); go(); } else if(e.key==='Escape'){ e.preventDefault(); onCancel(); } }; dock(pane,c); }

/* the runbook card's states */
function forgeSet(card,o){ var T=['is-fail','is-pass','is-quiet','is-warn'], sil=$('.mira-code-silhouette',card), main=$('.mira-forge-main',card);
  T.forEach(function(c){ card.classList.remove(c); sil.classList.remove(c); }); card.classList.add('is-'+o.tone); sil.classList.add('is-'+o.tone);
  var scan=$('.mira-code-silhouette-scan',sil); if(scan) scan.remove(); sil.classList.toggle('is-moving',!!o.moving); if(o.moving) sil.appendChild(el('<div class="mira-code-silhouette-scan"><div class="mira-code-silhouette-band"></div></div>'));
  main.innerHTML=(o.stages?'<ol class="mira-forge-stages" aria-label="Progress">'+o.stages.map(function(s){ return '<li class="is-'+s[1]+'"> '+s[0]+' </li>'; }).join('')+'</ol>':'')+(o.where?'<div class="mira-forge-where"> On '+esc(o.where)+' </div>':'')+(o.headline?'<div class="mira-forge-headline" role="status"> '+esc(o.headline)+' </div>':'')+(o.sub?'<p class="mira-forge-sub"> '+esc(o.sub)+' </p>':'')+
    (o.problems?'<ul class="mira-forge-problems">'+o.problems.map(function(p){ return '<li><button type="button" class="mira-forge-problem-line" title="Show line '+p[0]+'"> line '+p[0]+' </button><span class="mira-forge-problem-text">'+esc(p[1])+'</span></li>'; }).join('')+'</ul>':'');
  sc(main);
  if(o.tag) $('.mira-forge-tag',card).textContent=o.tag;
  if(o.chips){ var ch=$('.mira-forge-chips',card); ch.innerHTML=o.chips.map(function(c){ return '<span class="mira-forge-chip'+(c==='Read-only'?' is-ok':'')+'">'+c+'</span>'; }).join(''); sc(ch); }
  var ob=$$('.mira-forge-foot .mira-forge-button',card)[1]; if(ob) ob.classList.toggle('mx-hide',!o.open); forgeDress(card); }
var ST=function(a,b,c,d){ return [[a[0],a[1]],[b[0],b[1]],[c[0],c[1]],[d[0],d[1]]]; };
function sumTitle(steps){ var th=0,sk=[],tl=[]; steps.forEach(function(s){ var r=$('.mira-step-row',s); if(!r) return;
    if(r.classList.contains('is-static')){ var m=/Reading the\s+(.+?)\s+skill/.exec(r.textContent.replace(/\s+/g,' ')); if(m) sk.push('used the '+m[1]+' skill'); return; }
    var t=$('.mira-step-title',r); t=t?t.textContent.trim():''; if(t==='Thought') th++; else if(t&&tl.indexOf(t)<0) tl.push(t); });
  var p=[]; if(th) p.push('thought for '+th+'s'); p=p.concat(sk); if(tl.length) p.push('used '+(tl.length<=2?tl.join(' and '):tl[0]+' and '+tl[1]+' and '+(tl.length-2)+' more'));
  var s=p.join(', '); return s.charAt(0).toUpperCase()+s.slice(1); }
function addMsg(P,msg){ var parts=$('.mira-message-parts',msg), kids=[].slice.call(parts.children), act=$('.mira-message-actions',msg);
  kids.forEach(function(k){ k.classList.add('mx-hide'); }); if(act) act.classList.add('mx-hide'); $('.mira-thread-list',P.pane).appendChild(msg); dress(msg); return kids; }
function actShow(msg){ var a=$('.mira-message-actions',msg); if(a) a.classList.remove('mx-hide'); }
async function liveFor(P,msg,label,ms,noMark){ var mk=$('.mira-turn-mark',msg), lv=liveLine(label); if(noMark&&mk) mk.style.visibility='hidden'; $('.mira-message-parts',msg).appendChild(lv); P.bottom(); await P.wait(ms); lv.remove(); if(mk) mk.style.visibility=''; }
async function reveal(P,k,ms){ k.classList.remove('mx-hide'); P.bottom(); await P.wait(ms===undefined?800:ms); }
async function seg(pane,fn){ if(MX.play) return; var P=MX.play=mkPlay(pane); MX.busy=true; busyPaint(pane,true); try{ await fn(P); }catch(e){ if(window.console) console.error(e); } MX.play=null; MX.busy=false; busyPaint(pane,false); P.bottom(); }

function startRunbook(q){ var id=fileChat('Runbook Creation','c4'), pane=MX.panes[id];
  var M=[].slice.call($('.mira-thread-list',tpl('c4').content).children).map(function(m){ return m.cloneNode(true); });
  var R=pane.__rb={A1:M[1],A2:M[2],A3:M[3],A4:M[5],A5:M[6],wait:null}; show(id); userMsg(pane,q); toBottom();
  seg(pane,async function(P){ var k=addMsg(P,R.A1); await liveFor(P,R.A1,'Working on your request',1500,true);
    await playGroup(k[0],P); await reveal(P,k[2],500); R.k1=k; }).then(function(){ rbAsk(pane); }); }

/* the answered-questions record, Claude's shape (request, 16 Nov 2026): a check + "Answered 3 questions", then each
   question in muted text with the answer under it, on a thin rule. A skipped answer says so in italics. */
/* Option 1 = the record in its card (default); Option 2 = the boxless line. Picked with ?qa=2, localStorage 'mx-qa-opt' = '2',
   or MX.qaOpt (the artifact's component stage sets that). See the CSS note. */
function qaOpt(){ if(MX.qaOpt) return MX.qaOpt; try{ if(/[?&]qa=2(&|$)/.test(location.search)||localStorage.getItem('mx-qa-opt')==='2') return '2'; }catch(e){} return '1'; }
function qaRecord(rec,a){ var CK='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  /* only the record's BODY is replaced, so the card box (.mira-card-record) keeps its border and padding */
  var card=$('.mira-card-record',rec)||rec, body=$('.mira-card-record-body',card); if(body){ [].slice.call(card.children).forEach(function(k){ if(k!==body) k.remove(); }); rec=body; }
  /* AI-tool shape (request, 17 Nov 2026): a header you can fold — ✓ · Answered N questions · the answers in one line
     while folded · chevron — over one row per question: the topic as a small label, the question muted, the answer in a
     soft filled block. Opens expanded; the fold is a real <button>. */
  var CV='<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
  /* ⚠️ COLLAPSED BY DEFAULT (request, 18 Nov 2026) - it opened expanded. Folded, the header already carries the answers on one
     line, so the record reads at a glance and the thread stays short; a click opens the question-by-question list. */
  rec.innerHTML='<div class="mx-qa'+(qaOpt()==='2'?' mx-qa2':'')+'"><button type="button" class="mx-qa-h" aria-expanded="false"><span class="mx-qa-ck">'+CK+'</span><span class="mx-qa-t">Answered '+a.length+' question'+(a.length===1?'':'s')+'</span>'+
    '<span class="mx-qa-sum">'+a.map(function(x){ return esc(x[1]||'Skipped'); }).join(' · ')+'</span><span class="mx-qa-cv">'+CV+'</span></button><ol class="mx-qa-l">'+
    /* minimal rows (request, 17 Nov 2026): the question muted, the answer under it in plain text — no number, chip, box or rule */
    a.map(function(x){ return '<li><div class="mx-qa-q">'+esc(x[2]||x[0])+'</div><div class="mx-qa-a'+(x[1]?'':' is-skip')+'">'+(x[1]?esc(x[1]):'Skipped')+'</div></li>'; }).join('')+'</ol></div>';
  var box=rec.querySelector('.mx-qa'), hb=box.querySelector('.mx-qa-h');
  hb.onclick=function(){ var o=box.classList.toggle('is-open'); hb.setAttribute('aria-expanded',o); if(o) fadeIn(box.querySelector('.mx-qa-l')); }; }
/* Ask AI's Gemini fade (index.html aitw*): each word fades in where it stands, 38ms apart. Real spaces stay as text
   nodes so innerText / copy read normally; code and SVG are left whole. */
function wordFade(root){ if(!root||root.__wf) return; root.__wf=1; var n=0, w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null), list=[], t;
  while((t=w.nextNode())){ if(t.nodeType===1){ if(t.__mxtf) list.push(t); continue; }
    if(!t.nodeValue.trim()||t.parentNode.closest('svg,code,pre,.mx-dmtile,.mx-otblmore,.mx-w,.mx-otblw>table')) continue; list.push(t); }
  list.forEach(function(t){ if(t.nodeType===1){ n=tblFade(t,n); return; } var f=document.createDocumentFragment(); t.nodeValue.split(/(\s+)/).forEach(function(p){ if(!p) return;
      if(/^\s+$/.test(p)){ f.appendChild(document.createTextNode(p)); return; }
      var s=document.createElement('span'); s.className='mx-w'; s.style.animationDelay=(n++*38)+'ms'; s.textContent=p; f.appendChild(s); });
    t.parentNode.replaceChild(f,t); }); }
/* ⚠️ THE FLOW'S QUESTION CARD FOLLOWS THE OPTION (18 Nov 2026 - it was missed: Option 2 of the flow opened on the SAME minimal
   card as Option 1, so the two looked identical until the answers were sent). Option 1 keeps askCardSteps; Option 2 uses the
   clarifier's Option 2, askCardV2 - numbered rows with their meaning, Recommended, one Skip / Next button, and its Review
   step. Both hand back the same [topic, answer, question] rows. ?ask=2 / localStorage 'mx-ask-opt' = '2' / MX.askOpt. */
function askOpt(){ if(MX.askOpt) return MX.askOpt; try{ if(/[?&]ask=2(&|$)/.test(location.search)||localStorage.getItem('mx-ask-opt')==='2') return '2'; }catch(e){} return '1'; }
function rbAsk(pane){ var R=pane.__rb; R.wait='ask';
  (askOpt()==='2'?askCardV2:askCardSteps)(pane,function(a){ undock(pane); R.wait=null; var rec=R.k1[1], ls=$$('.mira-card-record-line',rec);
      qaRecord(rec,a); rec.classList.remove('mx-hide'); wordFade(rec); actShow(R.A1); R.ans=a; rbBuild(pane); },
    function(){ undock(pane); R.wait='chat'; actShow(R.A1); var ta=$('.mira-composer-input',pane); if(ta) ta.focus(); }); }
function rbBuild(pane){ var R=pane.__rb; seg(pane,async function(P){ var k=addMsg(P,R.A2), f1=k[2], main=$('.mira-forge-main',f1), keep=main.innerHTML;
    await liveFor(P,R.A2,'Thinking',1400); await reveal(P,k[0],900); await playGroup(k[1],P);
    forgeSet(f1,{tone:'quiet',stages:ST(['Writing','now'],['Compiling','todo'],['Testing','todo'],['Delivering','todo']),headline:'Draft ready',sub:'Mira is filling in the job before saving it.'}); await reveal(P,f1,1700);
    var lv=liveLine('Thinking'); f1.insertAdjacentElement('afterend',lv);
    forgeSet(f1,{tone:'fail',stages:ST(['Written','done'],['Compiling','failed'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'It breaks the runbook rules',sub:'Mira is fixing it before saving again.',problems:[[16,'main() must print the result as one base64 line'],[19,'only main() writes to stdout (the engine reads one base64 line); log with loggerObj']]}); P.bottom(); await P.wait(2600);
    forgeSet(f1,{tone:'quiet',stages:ST(['Written','done'],['Compiling','now'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'That name is taken',sub:'A runbook named \'Linux Disk Free Percentage\' exists (id 122281148127); pick another name.'}); lv.remove(); await reveal(P,k[3],900); await playGroup(k[4],P);
    forgeSet(f1,{tone:'fail',open:true}); main.innerHTML=keep; P.bottom(); await P.wait(700); await reveal(P,k[5],900); await playGroup(k[6],P);
    var f2=R.f2=$('.mira-forge',R.A5).cloneNode(true); k[7].insertAdjacentElement('beforebegin',f2);
    forgeSet(f2,{tone:'quiet',chips:['SSH','Read-only'],tag:'Draft',stages:ST(['Written','done'],['Compiling','now'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'Saving and compiling',sub:'ObserveOps builds the Go source as it is saved.',moving:true}); P.bottom(); await P.wait(2200);
    forgeSet(f2,{tone:'quiet',chips:['Linux','SSH','Read-only'],tag:'Draft · v1',stages:ST(['Written','done'],['Compiled','done'],['Testing','todo'],['Delivering','todo']),where:'motadata ('+IP+')',headline:'Saved and compiled',sub:'Nothing has run yet. It will be tested on motadata ('+IP+').',open:true}); P.bottom(); await P.wait(1900);
    forgeSet(f2,{tone:'pass',stages:ST(['Written','done'],['Compiled','done'],['Tested','done'],['Delivering','now']),where:'motadata ('+IP+')',open:true}); await reveal(P,k[8],1000); await reveal(P,k[9],900); await playGroup(k[11],P); await reveal(P,k[12],300); R.k2=k;
  }).then(function(){ R.wait='deliver'; deliverCard(pane,function(){ undock(pane); R.wait=null; var rec=R.k2[10], sp=$('.mira-card-record-body span',rec), d=new Date();
      if(sp&&sp.lastChild&&sp.lastChild.nodeType===3) sp.lastChild.nodeValue=sp.lastChild.nodeValue.replace(/\d\d:\d\d\s*$/,('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2));
      rec.classList.remove('mx-hide'); actShow(R.A2); rbDelivered(pane); }); }); }
function rbDelivered(pane){ var R=pane.__rb; seg(pane,async function(P){ var k=addMsg(P,R.A3); await liveFor(P,R.A3,'Thinking',1300);
    R.f2.remove(); R.k2[7].classList.remove('mx-hide');
    var dc=R.dc=el('<section class="mira-forge mira-rise-in is-small is-pass is-bare" aria-label="Runbook '+RB+'"><div class="mira-forge-end is-delivered"><span class="mira-forge-end-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div class="mira-forge-end-text"><span class="mira-forge-end-title">'+RB+' <span class="mira-forge-end-state">· Delivered</span></span><span class="mira-forge-end-sub">On motadata. Run manually from Settings › Runbooks on the Linux monitor when you need a filesystem capacity snapshot.</span></div><button type="button" class="mira-forge-end-button" data-mx-say="run"> Run </button><button type="button" class="mira-forge-end-button is-ghost" data-mx-open="1"> Open </button></div></section>');
    k[0].insertAdjacentElement('beforebegin',dc); P.bottom(); await P.wait(900); await reveal(P,k[1],800); await playGroup(k[2],P); actShow(R.A3);
    var ns=R.ns=el('<div class="mira-next-steps">'+['Deliver it to another Linux monitor','Run it on motadata'].map(function(t){ return '<button type="button" class="mira-next-step" data-mx-say="'+t+'"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg> '+t+' </button>'; }).join('')+'</div>');
    var a=$('.mira-message-actions',R.A3); (a?a.parentElement:$('.mira-turn-body',R.A3)).appendChild(ns); R.k3=k; }).then(function(){ R.wait='run'; }); }
function rbRun(pane,text){ var R=pane.__rb; R.wait=null; if(R.ns) R.ns.remove(); if(R.dc){ R.dc.remove(); R.k3[0].classList.remove('mx-hide'); }
  userMsg(pane,text); toBottom();
  seg(pane,async function(P){ var k=addMsg(P,R.A4); await liveFor(P,R.A4,'Working on your request',1500,true);
    var f=R.f4=$('.mira-forge',R.A5).cloneNode(true); k[0].insertAdjacentElement('beforebegin',f); forgeSet(f,{tone:'quiet',where:'motadata ('+IP+')',open:true}); P.bottom(); await P.wait(1000);
    await playGroup(k[1],P); await reveal(P,k[2],300); R.k4=k; }).then(function(){ rbConfirm(pane); }); }
function rbConfirm(pane){ var R=pane.__rb; R.wait='confirm';
  runCard(pane,function(){ undock(pane); R.wait=null; actShow(R.A4);
      seg(pane,async function(P){ var k=addMsg(P,R.A5); await liveFor(P,R.A5,'Thinking',1300); R.f4.remove(); R.k4[0].classList.remove('mx-hide');
        for(var i=0;i<k.length;i++){ if(k[i].classList.contains('mira-activity-group')) await playGroup(k[i],P); else await reveal(P,k[i],900); } actShow(R.A5); }).then(function(){ R.wait='done'; }); },
    function(){ undock(pane); R.wait='run-later'; actShow(R.A4); }); }


/* ── the product rail is Option 1's sidebar (request, 16 Nov 2026) ────────────────────────
   index.html's rendered #sidebar + the CSS that styles it, mounted in a SHADOW ROOT so its
   tokens (--sidebar, --text, --primary …) and this page's product CSS cannot collide. Mira is
   the lit row. Built by _mira/o1rail.py from a headless dump of index.html.                */
var RAIL_GO={'Ask AI':'index.html','Dashboard':'index.html','Monitor':'index.html#m=Monitors','Alert':'index.html#m=Alerts','SLO':'index.html#m=SLO',
  'Explorer':'index.html#m=Metric Explorer','Topology':'topology.html?from=index.html','Compliance':'index.html#m=Compliance','IPAM':'index.html#m=IPAM',
  'Firewall Analyzer':'index.html#m=Firewall Analyzer','APM':'apm.html?from=index.html','Report':'index.html#m=Reports','Setting':'setting.html?from=mira.html',
  'Approval':'index.html#v=approval','Health Monitoring':'index.html#v=health'};
function railMount(){ var host=$('#mxRail'), t=tpl('o1rail'); if(!host||!t||host.shadowRoot) return;
  var sr=host.attachShadow({mode:'open'}); sr.appendChild(t.content.cloneNode(true));
  var tip=document.createElement('div'); tip.className='tipbox'; sr.appendChild(tip);
  var aside=sr.querySelector('.sidebar');
  function theme(){ host.classList.toggle('light',document.body.getAttribute('data-theme')!=='dark-theme'); }
  theme(); new MutationObserver(theme).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  function fit(){ host.classList.remove('sfootfit'); var m=aside.querySelector('.smenu'); if(m&&m.scrollHeight>m.clientHeight+1) host.classList.add('sfootfit'); }
  fit(); window.addEventListener('resize',fit);
  function tipOf(e){ var x=e.target.closest&&e.target.closest('[data-tip]'); return x&&aside.contains(x)?x:null; }
  var tcur=null, tt=null;
  aside.addEventListener('mouseover',function(e){ var x=tipOf(e); if(x===tcur) return; tcur=x; clearTimeout(tt); tip.classList.remove('on'); if(!x) return;
    tt=setTimeout(function(){ if(aside.classList.contains('open')&&!x.matches('.strcol, .sq, #sbMore, .squick .sitem')) return;
      var raw=x.getAttribute('data-tip'), m=raw.match(/^(.*?)\s{2,}(\S+)$/);
      tip.innerHTML=m?esc(m[1])+'<span class="tipk">'+esc(m[2])+'</span>':esc(raw); tip.classList.add('on');
      var r=x.getBoundingClientRect(), bh=tip.offsetHeight; tip.style.left=(r.right+8)+'px'; tip.style.top=Math.max(6,Math.min(r.top+r.height/2-bh/2,innerHeight-bh-6))+'px'; },320); });
  aside.addEventListener('mouseleave',function(){ tcur=null; clearTimeout(tt); tip.classList.remove('on'); });
  aside.addEventListener('click',function(e){ var x=e.target.closest('.sitem, .sq, button, [data-tip]'); if(!x||!aside.contains(x)) return; tip.classList.remove('on');
    if(x.id==='collapseBtn'){ e.stopPropagation(); var on=!aside.classList.contains('open'); aside.classList.toggle('open',on); host.classList.toggle('pinned',on); document.body.classList.toggle('mx-railopen',on); x.setAttribute('data-tip',on?'Collapse sidebar':'Expand sidebar'); setTimeout(fit,200); return; }
    var k=(x.getAttribute('data-tip')||'').replace(/\s{2,}.*$/,'');
    if(x.id==='sbMira') return;
    if(x.id==='sbSearch'){ searchTog(true); return; }
    if(x.id==='sbUser'){ location.href='setting.html?from=mira.html#st=My Account|My Profile'; return; }
    if(x.id==='sbBell'||/^Notification/.test(k)){ toast('Notifications open on the dashboard'); return; }
    if(x.classList.contains('uxnews')){ window.open('https://docs.motadata.com/motadata-aiops-docs/','_blank','noopener'); return; }
    if(x.id==='sbMore'){ e.stopPropagation(); railMore(x); return; }
    if(x.id==='sbAI'){ location.href='index.html'; return; }
    if(RAIL_GO[k]){ location.href=RAIL_GO[k]; return; }
    if(x.id==='sbApproval') location.href=RAIL_GO['Approval']; else if(x.id==='sbHealth') location.href=RAIL_GO['Health Monitoring']; }); }
function railMore(btn){ closePops(); var m=first('hmenu'); m.classList.add('mx-pop'); var it=$$('.mira-chat-menu-item',m), rule=$('.mira-chat-menu-rule',m); if(rule) rule.remove();
  [['Approval','index.html#v=approval'],['What’s new','https://docs.motadata.com/motadata-aiops-docs/'],['Health Monitoring','index.html#v=health']].forEach(function(r,i){ var b=it[i]; if(!b) return; b.classList.remove('is-danger'); var sv=$('svg',b); b.textContent=' '+r[0]+' '; if(sv&&i<2) b.insertBefore(sv,b.firstChild); b.setAttribute('data-mx-go',r[1]); });
  document.body.appendChild(m); var r=btn.getBoundingClientRect(); m.style.left=(r.right+8)+'px'; m.style.top=Math.max(8,r.bottom-m.offsetHeight)+'px'; MX.pop=m; MX.popFor=btn; }



/* ── chat history: date bands + ages, Ask AI's list shape (request, 17 Nov 2026) ──────────────────────────
   Each chat carries a time (MX.at). The three recorded chats are seeded RELATIVE TO LOAD, so Today / Yesterday /
   a dated band are populated whenever the page is opened; a chat filed from a sent message is stamped now. */
MX.at = MX.at || {}; (function(){ var H=3600e3, D=24*H, n=Date.now(); MX.at.c3=n-2*H; MX.at.c1=n-D-3*H; MX.at.c2=n-2*D-5*H; })();
function bandOf(t){ var d=new Date(t), now=new Date(), a=new Date(now.getFullYear(),now.getMonth(),now.getDate()), b=new Date(d.getFullYear(),d.getMonth(),d.getDate()), k=Math.round((a-b)/864e5);
  if(k<=0) return 'Today'; if(k===1) return 'Yesterday';
  var s=d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); return d.getFullYear()===now.getFullYear()?s:s+', '+d.getFullYear(); }
function ageOf(t){ var m=Math.max(0,(Date.now()-t)/6e4); if(m<1) return 'now'; if(m<60) return Math.floor(m)+'m'; var h=m/60; if(h<24) return Math.floor(h)+'h';
  var d=h/24; if(d<7) return Math.floor(d)+'d'; if(d<365) return Math.floor(d/7)+'w'; return Math.floor(d/365)+'y'; }
function bandPaint(){ var ul=$('.mira-recents-list')||(MX.side&&MX.side.querySelector('.mira-recents-list')); if(!ul) return;
  [].slice.call(ul.querySelectorAll('.mx-band')).forEach(function(b){ b.remove(); });
  var lis=[].slice.call(ul.children).filter(function(li){ return li.querySelector('.mira-side-row.is-chat'); });
  lis.forEach(function(li){ var a=li.querySelector('.mira-side-row.is-chat'), id=a.getAttribute('data-mx-chat'); if(!MX.at[id]) MX.at[id]=Date.now(); });
  lis.sort(function(x,y){ return MX.at[y.querySelector('a').getAttribute('data-mx-chat')]-MX.at[x.querySelector('a').getAttribute('data-mx-chat')]; }).forEach(function(li){ ul.appendChild(li); });
  var last=null; lis.forEach(function(li){ var a=li.querySelector('a'), t=MX.at[a.getAttribute('data-mx-chat')], bd=bandOf(t);
    var ag=a.querySelector('.mx-age'); if(!ag){ ag=document.createElement('span'); ag.className='mx-age'; a.appendChild(ag); } ag.textContent=ageOf(t); ag.title=new Date(t).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'});
    if(bd!==last){ var h=document.createElement('li'); h.className='mx-band'; h.setAttribute('aria-hidden','true'); h.textContent=bd; ul.insertBefore(h,li); last=bd; } });
  bandVis(); }
function bandVis(){ var ul=$('.mira-recents-list'); if(!ul) return; var cur=null, any=false;
  [].slice.call(ul.children).forEach(function(li){ if(li.classList.contains('mx-band')){ if(cur) cur.classList.toggle('mx-hide',!any); cur=li; any=false; } else if(!li.classList.contains('mx-hide')) any=true; });
  if(cur) cur.classList.toggle('mx-hide',!any); }

/* Sidebar foot: the usage meter lives INSIDE the user row, under the name (request, 17 Nov 2026) — one compact row
   instead of a usage card over a user row. Figures and bar width are read off the live usage block, then it is hidden. */
function footMount(){ var u=$('.mira-usage'), row=$('.mira-user'); if(!u||!row||$('.mx-uu',row)) return;
  var spent=($('.mira-usage-spent',u)||{}).textContent||'', fig=($('.mira-usage-figures',u)||{}).textContent||'', tot=(fig.split('/')[1]||'').trim().replace(/\.00$/,''),
    w=(($('.mira-usage-bar span',u)||{style:{}}).style.width)||'0%', tone=u.classList.contains('is-reached')?' is-reached':u.classList.contains('is-warning')?' is-warning':'';
  var role=$('.mira-user-role',row); var m=document.createElement('span'); m.className='mx-uu'+tone; m.title=u.getAttribute('title')||'';
  m.innerHTML='<span class="mx-uub"><i style="width:'+w+'"></i></span><span class="mx-uut">'+esc(spent.trim())+' of '+esc(tot)+'</span>';
  if(role) role.replaceWith(m); else $('.mira-user-text',row).appendChild(m); u.classList.add('mx-hide'); }
setTimeout(footMount,0);
/* ── chat header: history · (new chat) · <chat name ⌄> (request, 17 Nov 2026) ──────────────────────────────
   Replaces the "Mira / New chat" crumbs with Ask AI's header shape: a history button that shows / hides the chat
   list, a new-chat pencil once you are in a chat, and the chat's name as a trigger that opens Rename · Delete ·
   CONVERSATIONS. Icons: Tabler history / edit / chevron-down, verbatim. */
var HD_HIST='<svg viewBox="0 0 24 24"><path d="M12 8l0 4l2 2"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/></svg>',
  HD_NEW='<svg viewBox="0 0 24 24"><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415"/><path d="M16 5l3 3"/></svg>',
  HD_CV='<svg viewBox="0 0 24 24"><path d="M6 9l6 6l6 -6"/></svg>';
/* the panel toggle is the product's own sidebar-collapse / -expand glyph (48 grid, filled), not a clock (request, 17 Nov 2026) */
var HD_SBP='M11 8h26a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Zm0 3.6c-.8 0-1.4.6-1.4 1.4v22c0 .8.6 1.4 1.4 1.4h26c.8 0 1.4-.6 1.4-1.4V13c0-.8-.6-1.4-1.4-1.4H11ZM16.2 9.5h3.4v29h-3.4z', HD_SB=function(open){ return '<svg class="mx-fill" viewBox="0 0 48 48"><path d="'+HD_SBP+(open?'M30.5 17.6 24.1 24l6.4 6.4 2.4-2.4-4-4 4-4-2.4-2.4Z':'M26.5 17.6 32.9 24l-6.4 6.4-2.4-2.4 4-4-4-4 2.4-2.4Z')+'"/></svg>'; };
function hdRows(){ var r=$$('.mira-side-row.is-chat'); if(!r.length&&MX.side) r=[].slice.call(MX.side.querySelectorAll('.mira-side-row.is-chat')); return r; }
function hdRow(id){ return hdRows().filter(function(a){ return a.getAttribute('data-mx-chat')===id; })[0]; }
function hdTitle(id){ if(id==='new') return 'New chat'; var a=hdRow(id); return a?$('.mira-recent-name',a).textContent.trim():(($('.mira-crumb.is-current',MX.panes[id]||document)||{}).textContent||'Chat').trim(); }
function hdPaint(node,id){ var nav=$('.mira-crumbs',node); if(!nav) return; var h=$('.mx-hd',nav);
  if(!h){ h=document.createElement('div'); h.className='mx-hd'; nav.insertBefore(h,nav.firstChild); }
  var t=hdTitle(id);
  var sbOpen=!(($('aside.mira-sidebar')||{classList:{contains:function(){return 0}}}).classList.contains('is-collapsed')), sbLab=sbOpen?'Collapse sidebar':'Expand sidebar';
  h.innerHTML='<button type="button" class="mx-hdb" data-mx-hd="hist" aria-label="'+sbLab+'" data-mx-tip="'+sbLab+'">'+HD_SB(sbOpen)+'</button>'+
    (id!=='new'?'<button type="button" class="mx-hdb" data-mx-hd="new" aria-label="Start a new chat" data-mx-tip="Start a new chat">'+HD_NEW+'</button>':'')+
    '<button type="button" class="mx-hdt" data-mx-hd="menu" aria-haspopup="menu" aria-expanded="false" data-mx-tip="Rename, delete or switch conversation"><span class="mx-hdn">'+esc(t)+'</span>'+HD_CV+'</button>'; }
/* The chat-name menu is Ask AI's conversation dropdown (request, 20 Nov 2026, Ask Iris's menu as the picture):
   a "Search AI chats…" box, date bands, a speech-bubble mark per row (filled on the open chat), when it happened on
   the right — swapped for ✎ / 🗑 on hover — and "Show all N ›" when there are more than HD_CAP. Rename / Delete moved
   onto the rows; the search repaints the LIST only, so the field keeps its focus and caret. Icons: Lucide, verbatim. */
var HD_CAP=6, HD_I={
  chat:'<svg viewBox="0 0 24 24"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',
  pen:'<svg viewBox="0 0 24 24"><path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
  bin:'<svg viewBox="0 0 24 24"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  srch:'<svg viewBox="0 0 24 24"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
  hist:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  go:'<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>' };
/* today reads as elapsed time, any other day as the clock time — Ask AI's aiChatWhen */
function hdWhen(t){ if(!t) return ''; var m=Math.round((Date.now()-t)/6e4);
  if(bandOf(t)==='Today'){ if(m<1) return 'just now'; if(m<60) return m+' min'+(m===1?'':'s')+' ago'; var h=Math.round(m/60); return h+' hour'+(h===1?'':'s')+' ago'; }
  var d=new Date(t), hh=d.getHours(), ap=hh>=12?'pm':'am'; hh=hh%12||12; return hh+':'+String(d.getMinutes()).padStart(2,'0')+' '+ap; }
function hdChats(){ return hdRows().map(function(a){ var c=a.getAttribute('data-mx-chat'); return {id:c,n:$('.mira-recent-name',a).textContent.trim(),t:MX.at[c]||Date.now()}; }).sort(function(x,y){ return y.t-x.t; }); }
function hdListHTML(q){ var all=hdChats(), rx=q?new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'):null, l=all.filter(function(c){ return !rx||rx.test(c.n); }).slice(0,HD_CAP);
  if(!l.length) return '<div class="mx-hdme">'+(q?'No chat matches “'+esc(q)+'”.':'No conversations yet. A chat is listed here once you ask it something.')+'</div>';
  var out='', bd=null; l.forEach(function(c){ var g=bandOf(c.t); if(g!==bd){ bd=g; out+='<div class="mx-hdmg">'+esc(g)+'</div>'; }
    out+='<div class="mx-hdmc'+(c.id===MX.cur?' on':'')+'" role="menuitem" tabindex="0" data-mx-hm-c="'+c.id+'"><span class="cb">'+HD_I.chat+'</span><span class="nm">'+esc(c.n)+'</span>'+
      '<span class="wh">'+esc(hdWhen(c.t))+'</span><span class="ac"><i data-mx-hm-r="'+c.id+'" data-mx-tip="Rename">'+HD_I.pen+'</i><i class="dl" data-mx-hm-d="'+c.id+'" data-mx-tip="Delete">'+HD_I.bin+'</i></span></div>'; });
  return out; }
function hdMenuHTML(){ var n=hdRows().length;
  return '<label class="mx-hdms">'+HD_I.srch+'<input type="text" placeholder="Search AI chats…" aria-label="Search AI chats" data-mx-hm-q></label><div class="mx-hdml">'+hdListHTML('')+'</div>'+
    (n>HD_CAP?'<hr><button type="button" class="mx-hdma" data-mx-hm="all"><span class="cb">'+HD_I.hist+'</span><span class="nm">Show all</span><span class="wh">'+n+'</span>'+HD_I.go+'</button>':''); }
function hdMenu(btn){ var open=btn.classList.contains('open'); closePops(); if(open) return; var m=document.createElement('div'); m.className='mx-pop mx-hdm'; m.setAttribute('role','menu');
  m.innerHTML=hdMenuHTML(); document.body.appendChild(m); var r=btn.getBoundingClientRect(); m.style.left=r.left+'px'; m.style.top=(r.bottom+6)+'px';
  btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); MX.pop=m; MX.popFor=btn; hdTipHide(); var q=$('input',m); if(q) q.focus(); }
/* ✎ renames the row IN PLACE and does not switch chat (Ask AI's rule) */
function hdRowRen(id,i){ var row=i.closest('.mx-hdmc'), nm=$('.nm',row), old=nm.textContent, inp=document.createElement('input'); inp.className='mx-hdmin'; inp.value=old;
  hdTipHide(); row.classList.add('ren'); nm.replaceWith(inp); inp.focus(); inp.select();
  var done=function(ok){ inp.onblur=null; var v=(ok&&inp.value.trim())||old, a=hdRow(id); if(a){ $('.mira-recent-name',a).textContent=v; a.title=v; }
    var p=MX.panes[id]; if(p){ var c=$('.mira-crumb.is-current',p); if(c){ c.textContent=v; c.title=v; } }
    if(id===MX.cur){ document.title=v+' · Mira'; var h=$('#mxPane .mx-hdn'); if(h) h.textContent=v; } nm.textContent=v; inp.replaceWith(nm); row.classList.remove('ren'); };
  inp.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter') done(true); else if(e.key==='Escape') done(false); }; inp.onblur=function(){ done(true); }; }
/* the previous Rename · Delete · CONVERSATIONS menu, kept unreferenced */
function hdMenuOld(btn){ var open=btn.classList.contains('open'); closePops(); if(open) return; var id=MX.cur, m=document.createElement('div'); m.className='mx-pop mx-hdm'; m.setAttribute('role','menu');
  m.innerHTML=(id!=='new'?'<button type="button" data-mx-hm="rename">Rename chat</button><button type="button" class="is-danger" data-mx-hm="del">Delete chat</button><hr>':'')+
    '<div class="mx-hdmh">Conversations</div>'+hdRows().map(function(a){ var c=a.getAttribute('data-mx-chat'); return '<button type="button" class="mx-hdmc'+(c===id?' on':'')+'" data-mx-hm-c="'+c+'">'+esc($('.mira-recent-name',a).textContent.trim())+'</button>'; }).join('')+
    (hdRows().length?'':'<div class="mx-hdme">No conversations yet</div>');
  document.body.appendChild(m); var r=btn.getBoundingClientRect(); m.style.left=r.left+'px'; m.style.top=(r.bottom+6)+'px';
  btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); MX.pop=m; MX.popFor=btn; hdTipHide();
  var _cp=closePops; }
function hdRename(id){ closePops(); var b=$('#mxPane .mx-hdt'), n=b&&$('.mx-hdn',b); if(!n) return; var old=n.textContent;
  var inp=document.createElement('input'); inp.className='mx-rename mx-hdin'; inp.value=old; b.replaceWith(inp); inp.focus(); inp.select();
  var done=function(ok){ inp.onblur=null; var v=(ok&&inp.value.trim())||old; var a=hdRow(id); if(a){ $('.mira-recent-name',a).textContent=v; a.title=v; }
    var p=MX.panes[id]; if(p){ var c=$('.mira-crumb.is-current',p); if(c){ c.textContent=v; c.title=v; } } document.title=v+' · Mira'; inp.replaceWith(b); n.textContent=v; };
  inp.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter') done(true); else if(e.key==='Escape') done(false); }; inp.onblur=function(){ done(true); }; }
function hdDel(id){ closePops(); var a=hdRow(id); if(a) a.closest('li').remove(); delete MX.panes[id]; bandPaint(); show('new'); toast('Chat deleted'); }
function hdTipHide(){ if(MX.hdtip){ MX.hdtip.remove(); MX.hdtip=null; } }
document.addEventListener('mouseover',function(e){ var b=e.target.closest&&e.target.closest('[data-mx-tip]'); if(!b){ hdTipHide(); return; } if(MX.hdtip&&MX.hdtip.__for===b) return; hdTipHide();
  if(b.classList.contains('open')) return; var t=document.createElement('div'); t.className='mx-hdtip'; t.textContent=b.getAttribute('data-mx-tip'); t.__for=b; document.body.appendChild(t);
  var r=b.getBoundingClientRect(); t.style.left=Math.max(8,r.left)+'px'; t.style.top=(r.bottom+8)+'px'; MX.hdtip=t; });
document.addEventListener('click',function(e){ var t=e.target, b;
  if((b=t.closest('[data-mx-hd]'))){ e.stopImmediatePropagation(); var k=b.getAttribute('data-mx-hd'); hdTipHide();
    if(k==='hist'){ closePops(); sideTog(); hdPaint($('#mxPane').firstElementChild,MX.cur); } else if(k==='new'){ closePops(); show('new'); } else hdMenu(b); return; }
  if((b=t.closest('.mx-hdm [data-mx-hm]'))){ e.stopImmediatePropagation(); var a=b.getAttribute('data-mx-hm'); if(a==='all'){ closePops(); var as=$('aside.mira-sidebar'); if(as&&as.classList.contains('is-collapsed')){ sideTog(); hdPaint($('#mxPane').firstElementChild,MX.cur); } } else if(a==='rename') hdRename(MX.cur); else hdDel(MX.cur); return; }
  if((b=t.closest('.mx-hdm [data-mx-hm-r]'))){ e.stopImmediatePropagation(); hdRowRen(b.getAttribute('data-mx-hm-r'),b); return; }
  if((b=t.closest('.mx-hdm [data-mx-hm-d]'))){ e.stopImmediatePropagation(); hdTipHide(); var did=b.getAttribute('data-mx-hm-d'); if(did===MX.cur) hdDel(did); else { var ra=hdRow(did); if(ra) ra.closest('li').remove(); delete MX.panes[did]; bandPaint(); var l=$('.mx-hdm .mx-hdml'), q=$('.mx-hdm [data-mx-hm-q]'); if(l) l.innerHTML=hdListHTML(q?q.value:''); toast('Chat deleted'); } return; }
  if((b=t.closest('.mx-hdm [data-mx-hm-c]'))){ e.stopImmediatePropagation(); if(b.classList.contains('ren')) return; closePops(); show(b.getAttribute('data-mx-hm-c')); return; }
  if(t.closest('.mx-hdm')&&!t.closest('[data-mx-hm]')){ e.stopImmediatePropagation(); return; }
},true);

document.addEventListener('input',function(e){ var q=e.target.closest&&e.target.closest('.mx-hdm [data-mx-hm-q]'); if(!q) return; var l=$('.mx-hdm .mx-hdml'); if(l) l.innerHTML=hdListHTML(q.value); });
document.addEventListener('keydown',function(e){ var r=e.target.closest&&e.target.closest('.mx-hdm .mx-hdmc'); if(r&&e.key==='Enter'&&!r.classList.contains('ren')){ e.preventDefault(); closePops(); show(r.getAttribute('data-mx-hm-c')); } },true);
setTimeout(bandPaint,0);
/* ── wiring ── */
var RAIL={'Dashboards':'index.html','Monitors':'index.html#m=Monitors','Alerts':'index.html#m=Alerts','SLO BETA':'index.html#m=SLO','Explorer':'index.html#m=Metric Explorer','Reports':'index.html#m=Reports','Settings':'setting.html?from=mira.html','Search':'index.html','Approval':'index.html#v=approval','Health Monitoring':'index.html#v=health'};
document.addEventListener('click',function(e){
  var t=e.target, b;
  if(t.closest('.mx-rename')) return;
  if((b=t.closest('.mx-pop [data-mx-go]'))){ var u=b.getAttribute('data-mx-go'); closePops(); if(/^https?:/.test(u)) window.open(u,'_blank','noopener'); else location.href=u; return; }
  if((b=t.closest('.mira-chat-menu-item'))){ var id=MX.cur, tx=b.textContent.trim(); if(/Rename/.test(tx)) rename(id); else if(/Copy/.test(tx)) link(id); else del(id); return; }
  if((b=t.closest('.mx-pop.picker-action-dropdown a'))){ e.preventDefault(); var rid=b.closest('.mx-pop').getAttribute('data-mx-row'); if(b.id==='rename') rename(rid); else if(b.id==='copy-link') link(rid); else del(rid); return; }
  if((b=t.closest('.mx-pop .mira-effort-option'))){ MX.eff=b.textContent.trim(); closePops(); effPaint(); return; }
  if((b=t.closest('.mira-chat-menu-button'))){ headMenu(b); return; }
  if((b=t.closest('.mira-recent-menu button'))){ e.preventDefault(); rowMenu(b,b.closest('li').querySelector('a').getAttribute('data-mx-chat')); return; }
  if((b=t.closest('.mira-effort-pill'))){ effMenu(b); return; }
  closePops();
  if((b=t.closest('.mira-side-row.is-chat'))){ e.preventDefault(); show(b.getAttribute('data-mx-chat')); return; }
  if(t.closest('[data-testid="mira-new-chat"], .mira-brand')){ show('new'); return; }
  if(t.closest('[data-testid="mira-search-chats"]')){ searchTog(); return; }
  if(t.closest('[aria-label="Collapse sidebar"], [aria-label="Expand sidebar"]')){ sideTog(); hdPaint($('#mxPane').firstElementChild,MX.cur); return; }
  if(t.closest('.mira-user')){ location.href='setting.html?from=mira.html#st=My Account|My Profile'; return; }
  if((b=t.closest('.mira-group-head, button.mira-step-row, .mira-json-toggle'))){ toggle(b); return; }
  if((b=t.closest('[data-mx-say]'))){ var pn=MX.panes[MX.cur], sy=b.getAttribute('data-mx-say'); if(MX.busy||!pn||!pn.__rb) return; if(/^run/i.test(sy)){ if(pn.__rb.wait==='run'||pn.__rb.wait==='run-later') rbRun(pn,sy==='run'?'run':sy); } else { if(pn.__rb.ns) pn.__rb.ns.remove(); reply(sy); } return; }
  if(t.closest('[data-mx-open]')){ location.href='setting.html?from=mira.html#st=Plugin Library|Runbook'; return; }
  if((b=t.closest('.mira-forge-problem-line'))){ var cb=b.closest('.mira-forge').querySelector('[data-mx-code]'); if(cb) openCode(cb.getAttribute('data-mx-code'),b.closest('.mira-forge'),true); return; }
  if((b=t.closest('.mira-forge-button'))){ var k=b.getAttribute('data-mx-code'); if(k) openCode(k,b.closest('.mira-forge')); else location.href='setting.html?from=mira.html#st=Plugin Library|Runbook'; return; }
  if(t.closest('.mira-code-pane-head [aria-label="Close"]')){ if(t.closest('.mx-fcode')) codeInlineOff(); else closeCode(); return; }
  if(t.closest('[aria-label="Copy code"]')){ copy($$('.mira-code-pane-code').map(function(l){return l.textContent}).join('\n'),'Code copied'); return; }
  if((b=t.closest('[aria-label="Copy request"], [aria-label="Copy response"]'))){ var blk=b.closest('.mira-tool-block-head');
    if(blk){ copy(blk.nextElementSibling?blk.nextElementSibling.innerText:'','Copied'); return; }
    var msg=b.closest('.mira-message'); copy($$('.mira-md',msg).filter(function(m){return !m.closest('.mira-group-fold')}).map(function(m){return m.innerText}).join('\n\n'),'Response copied'); return; }
  if((b=t.closest('[aria-label="Good response"], [aria-label="Bad response"]'))){ var row=b.closest('.mira-message-actions'), was=b.classList.contains('is-active'); $$('[aria-label="Good response"], [aria-label="Bad response"]',row).forEach(function(x){x.classList.remove('is-active')}); if(!was){ b.classList.add('is-active'); toast('Thanks for the feedback'); } return; }
  if((b=t.closest('[aria-label="Regenerate response"]'))){ if(!MX.busy) think(b.closest('.mira-message'),1500); return; }
  if(t.closest('.mira-scroll-down')){ toBottom(); return; }
  if(t.closest('.mira-submit')){ send(); return; }
  if((b=t.closest('.sidebar-rail [aria-label], .sidebar-rail [title]'))){ var key=b.getAttribute('aria-label')||b.getAttribute('title'); var host=t.closest('a-tooltip'); if(host&&!RAIL[key]) key=host.getAttribute('title');
    if(RAIL[key]){ e.preventDefault(); location.href=RAIL[key]; } else if(key&&!/Mira/.test(key)){ e.preventDefault(); toast(key+' is not part of this prototype page'); } return; }
});
document.addEventListener('mousedown',function(e){ if(e.target.closest('.splitpanes__splitter')) dragSplit(e); else if(e.target.closest('.mira-sidebar-resize')) dragSide(e); });
document.addEventListener('input',function(e){ var t=e.target; if(t.matches('.mira-composer-input')) grow(t); else if(t.closest('.mira-sidebar-search')) filter(t.value); });
document.addEventListener('keydown',function(e){ var t=e.target, mod=e.metaKey||e.ctrlKey;
  if(t.matches&&t.matches('.mira-composer-input')&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){ e.preventDefault(); send(); return; }
  if(mod&&e.shiftKey&&(e.key==='o'||e.key==='O')){ e.preventDefault(); show('new'); return; }
  if(mod&&(e.key==='k'||e.key==='K')){ e.preventDefault(); searchTog(true); return; }
  if(e.key==='Escape'){ if(MX.pop||$('.mira-chat-menu-list')){ closePops(); return; } if($('.mira-sidebar-search')){ searchTog(false); return; } if($('.mira-pane.is-preview')) closeCode(); } });
document.addEventListener('scroll',function(e){ if(e.target.classList&&e.target.classList.contains('mira-thread-scroll')){ scrollBtn(); var th=e.target.parentElement; if(th) th.classList.toggle('mx-topfade',e.target.scrollTop>4); } },true);
document.addEventListener('mouseover',function(e){ var w=e.target.closest&&e.target.closest('.mira-composer-add-wrap'); if(w) tipShow(w); else tipHide(); });
window.addEventListener('resize',function(){ if(!window.__mxKeep) closePops(); });

/* the row template for a chat started here = the first seeded row */
(function(){ var li=$('.mira-recents-list > li'); if(li){ var t=document.createElement('template'); t.id='mxt-row'; t.innerHTML=li.outerHTML; document.body.appendChild(t); } })();
railMount();
dress(document);
var m=/^#\/c\/(c1|c2|c3)$/.exec(location.hash); show(m?m[1]:'new');   /* opens on New chat by default (request, 16 Nov 2026); #/c/c1|c2|c3 opens a chat */
})();
