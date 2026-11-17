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
function dress(root){ $$('button[aria-label]:not([title])',root).forEach(function(b){ if(!b.textContent.trim()) b.title=b.getAttribute('aria-label'); }); }
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
  effPaint(); toBottom();
  var ta=$('.mira-composer-input',node); if(ta){ try{ta.focus({preventScroll:true})}catch(e){} }
}
function toggle(btn){ var o=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded',o?'false':'true');
  var ch=btn.querySelector('.mira-step-chevron'); if(ch) ch.classList.toggle('is-open',!o); }

/* ── the Code panel (right-hand split) ── */
function closeCode(){ var sp=$('.mira-split'); if(!sp) return; $$('.splitpanes__splitter, .mira-pane.is-preview',sp).forEach(function(e){e.remove()}); $('#mxPane').style.width='100%'; }
function openCode(key){ var t=tpl('code-'+key); if(!t) return; var sp=$('.mira-split'); closeCode();
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
function closePops(){ if(MX.pop){ MX.pop.remove(); MX.pop=null; }
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
    var p=MX.panes[id]; if(p){ var c=$('.mira-crumb.is-current',p); if(c){ c.textContent=v; c.title=v; } } if(MX.cur===id) document.title=v+' · Mira'; };
  inp.onclick=function(e){e.preventDefault();e.stopPropagation()};
  inp.onkeydown=function(e){ e.stopPropagation(); if(e.key==='Enter') done(true); else if(e.key==='Escape') done(false); };
  inp.onblur=function(){done(true)}; }
function del(id){ closePops(); var a=rowOf(id); if(a) a.closest('li').remove(); delete MX.panes[id]; if(MX.cur===id) show('new'); toast('Chat deleted'); }
function link(id){ closePops(); copy(location.href.split('#')[0]+'#/c/'+id,'Chat link copied'); }
function searchTog(force){ var as=$('aside.mira-sidebar'); if(as.classList.contains('is-collapsed')) sideTog();
  var cur=$('.mira-sidebar-search'), btn=$('[data-testid="mira-search-chats"]'), on=force!==undefined?force:!cur;
  if(cur&&!on){ cur.remove(); filter(''); } 
  if(!cur&&on){ var s=first('search'); $('.mira-sidebar-actions').insertAdjacentElement('afterend',s); cur=s; }
  btn.setAttribute('aria-pressed',on?'true':'false'); if(on){ var i=$('input',cur); i.value=''; i.focus(); } }
function filter(q){ q=q.trim().toLowerCase(); var n=0; $$('.mira-recents-list > li').forEach(function(li){ var hit=!q||li.textContent.toLowerCase().indexOf(q)>=0; li.classList.toggle('mx-hide',!hit); if(hit) n++; });
  var nm=$('.mx-nomatch'); if(!n&&q){ if(!nm){ nm=document.createElement('div'); nm.className='mx-nomatch'; $('.mira-recents-list').insertAdjacentElement('afterend',nm); } nm.textContent='No chats match “'+q+'”'; } else if(nm) nm.remove(); }
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
var DM=[[[0],[1],[2],[3],[7],[11],[15],[14],[13],[12],[8],[4],[5],[6],[10],[9]],[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]],[[5,6,9,10],[1,4,7,8,11,14],[0,3,12,15],[1,4,7,8,11,14],[5,6,9,10]],[[0],[1,4],[2,5,8],[3,6,9,12],[7,10,13],[11,14],[15]]];
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
  var li=first('row'); var a=$('a',li); a.setAttribute('data-mx-chat',id); a.title=t; a.classList.remove('is-active'); $('.mira-recent-name',a).textContent=t; ul.insertBefore(li,ul.firstChild);
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
         {k:'Action',q:'Should it only collect information, or change something?',sub:'Collecting is read-only; a change applies a remediation on the target.',opts:['Collect information only','Change something']}];
  Q.forEach(function(x){ x.sel=x.opts.length?0:-1; x.free=''; });   /* a question with no options is ONE input field (request, 16 Nov 2026) */
  var step=0, wrap=document.createElement('div'); wrap.className='mx-aicq';
  function ans(x){ return x.sel<0?x.free.trim():x.opts[x.sel]; }
  function only(x){ return !x.opts.length; }
  function paint(){ var x=Q[step];
    wrap.innerHTML='<div class="aicq" role="group" aria-label="'+esc(x.q)+'"><div class="aicqh"><button class="aicqb" type="button" data-cq="back"'+(step?'':' disabled')+' title="Previous question">'+CQ_BACK+'</button>'+
      '<span class="aicqt">'+esc(x.q)+'</span><span class="aicqn"><b>'+(step+1)+'</b> / '+Q.length+'</span><button class="aicqc" type="button" data-cq="x" title="Chat instead">'+CQ_X+'</button></div>'+
      '<div class="aicqs">'+esc(x.sub)+'</div><div class="aicqpg"><i style="width:'+Math.round((step+1)/Q.length*100)+'%"></i></div>'+
      x.opts.map(function(o,i){ return '<button class="aicqo'+(x.sel===i?' on':'')+'" type="button" data-cq-i="'+i+'"><span class="aicqi">'+(i+1)+'</span>'+esc(o)+'</button>'; }).join('')+
      (only(x)?'<label class="aicqf mx-cqonly"><input value="'+esc(x.free)+'" placeholder="'+esc(x.ph)+'" maxlength="1000" autocomplete="off" aria-label="'+esc(x.q)+'"></label>'
        :'<label class="aicqf'+(x.sel<0?' on':'')+'"><span class="aicqp">'+CQ_PEN+'</span><input value="'+esc(x.free)+'" placeholder="Something else…" maxlength="1000" autocomplete="off"></label>')+
      '<div class="aicqd"><button class="aicqsk" type="button" data-cq="skip">Skip</button>'+(only(x)?'<button class="aicqok" type="button" data-cq="next"'+(x.free.trim()?'':' disabled')+'>'+(step===Q.length-1?'Send':'Next')+'</button>':'')+'</div></div>';
    if(isCur(pane)){ var f=x.sel<0?$('.aicqf input',wrap):$('.aicqo.on',wrap); if(f&&f.tagName==='INPUT') try{ f.setSelectionRange(f.value.length,f.value.length); }catch(e){} try{ (f||wrap).focus({preventScroll:true}); }catch(e){} toBottom(); } }
  function next(){ if(step<Q.length-1){ step++; paint(); } else onSend(Q.map(function(x){ return [x.k,ans(x)||x.opts[0]||'',x.q]; })); }
  wrap.tabIndex=-1;
  wrap.onclick=function(e){ var b=e.target.closest('[data-cq-i]'); if(b){ Q[step].sel=+b.getAttribute('data-cq-i'); $$('.aicqo',wrap).forEach(function(r){ r.classList.toggle('on',r===b); }); $('.aicqf',wrap).classList.remove('on'); setTimeout(next,180); return; }
    b=e.target.closest('[data-cq]'); if(!b) return; var a=b.getAttribute('data-cq');
    if(a==='back'&&step){ step--; paint(); } else if(a==='x') onChat(); else if(a==='next'){ if(Q[step].free.trim()) next(); } else if(a==='skip'){ if(!only(Q[step])&&Q[step].sel<0&&!Q[step].free.trim()) Q[step].sel=0; next(); } };
  wrap.oninput=function(e){ if(!e.target.matches('.aicqf input')) return; var x=Q[step]; x.free=e.target.value; if(only(x)){ var nb=$('[data-cq=next]',wrap); if(nb) nb.disabled=!x.free.trim(); return; } x.sel=x.free.trim()?-1:0;
    $$('.aicqo',wrap).forEach(function(r,i){ r.classList.toggle('on',i===x.sel); }); $('.aicqf',wrap).classList.toggle('on',x.sel<0); };
  wrap.onkeydown=function(e){ e.stopPropagation(); var inp=e.target.matches&&e.target.matches('input');
    if(e.key==='Escape'){ e.preventDefault(); onChat(); }
    else if(e.key==='Enter'){ e.preventDefault(); if(!inp||Q[step].free.trim()) next(); }
    else if(!inp&&/^[1-9]$/.test(e.key)){ var n=+e.key-1; if(n<Q[step].opts.length){ var r=$$('.aicqo',wrap)[n]; if(r) r.click(); } else if(n===Q[step].opts.length){ e.preventDefault(); $('.aicqf input',wrap).focus(); } }
    else if(!inp&&(e.key==='ArrowLeft'||e.key==='Backspace')&&step){ e.preventDefault(); step--; paint(); } };
  dock(pane,wrap); paint(); }

function askCardTabs(pane,onSend,onChat){   /* the live tabbed card — kept, unreferenced since 16 Nov 2026 */
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
    var card=el(frame('<div class="mira-ask-head"><span class="mira-ask-mark" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 2.5c.7 5 4.5 8.8 9.5 9.5-5 .7-8.8 4.5-9.5 9.5-.7-5-4.5-8.8-9.5-9.5 5-.7 8.8-4.5 9.5-9.5z" fill="currentColor"/></svg></span><p class="mira-ask-intro">Tell me what you want the runbook to do, and I’ll build and test it on a real monitor.</p></div><div class="mira-ask-tabs" role="tablist" aria-label="Questions">'+tabs()+'</div>'+body(),
      ch?[[['1','3'],'pick'],[['Tab'],'next'],[['Esc'],'chat instead']]:[[['↵'],'send'],[['Tab'],'next'],[['Esc'],'chat instead']],
      '<button type="button" class="mira-ask-button is-ghost" data-mx-ask="chat"> Chat about this </button>'+(rev?'<button type="button" class="mira-ask-button is-primary" data-mx-ask="send"'+(ok?'':' disabled')+'> Send answers </button>':'<button type="button" class="mira-ask-button is-secondary" data-mx-ask="next"> Next </button>'),"Mira's questions"));
    card.setAttribute('data-v-44a5716c',''); card.classList.add('mx-dock'); if(host.parentNode) host.parentNode.replaceChild(card,host); host=card; wire();
    if(focus!==false&&isCur(pane)){ var i=$('.mira-ask-text-input',host)||(Q[cur]&&Q[cur].pick<0?$('.mira-ask-typed-input',host):null)||host; try{ i.focus({preventScroll:true}); if(i.value) i.setSelectionRange(i.value.length,i.value.length); }catch(e){} toBottom(); } }
  function ticks(){ var t=$('.mira-ask-tabs',host); if(t){ t.innerHTML=tabs(); sc(t); } }
  function go(i){ cur=Math.max(0,Math.min(Q.length,i)); paint(); }
  function send(){ if(!Q.every(ans)){ go(Q.findIndex(function(q){return !ans(q)})); return; } onSend(Q.map(function(q){ return [q.k,ans(q)]; })); }
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
  var ob=$$('.mira-forge-foot .mira-forge-button',card)[1]; if(ob) ob.classList.toggle('mx-hide',!o.open); }
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
function qaRecord(rec,a){ var CK='<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  /* only the record's BODY is replaced, so the card box (.mira-card-record) keeps its border and padding */
  var card=$('.mira-card-record',rec)||rec, body=$('.mira-card-record-body',card); if(body){ [].slice.call(card.children).forEach(function(k){ if(k!==body) k.remove(); }); rec=body; }
  rec.innerHTML='<div class="mx-qa"><div class="mx-qa-h"><span class="mx-qa-ck">'+CK+'</span><span>Answered '+a.length+' question'+(a.length===1?'':'s')+'</span></div><ol class="mx-qa-l">'+
    a.map(function(x){ return '<li><div class="mx-qa-q">'+esc(x[2]||x[0])+'</div><div class="mx-qa-a'+(x[1]?'':' is-skip')+'">'+(x[1]?esc(x[1]):'Skipped')+'</div></li>'; }).join('')+'</ol></div>'; }
/* Ask AI's Gemini fade (index.html aitw*): each word fades in where it stands, 38ms apart. Real spaces stay as text
   nodes so innerText / copy read normally; code and SVG are left whole. */
function wordFade(root){ if(!root||root.__wf) return; root.__wf=1; var n=0, w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), list=[], t;
  while((t=w.nextNode())){ if(!t.nodeValue.trim()||t.parentNode.closest('svg,code,pre,.mx-dmtile')) continue; list.push(t); }
  list.forEach(function(t){ var f=document.createDocumentFragment(); t.nodeValue.split(/(\s+)/).forEach(function(p){ if(!p) return;
      if(/^\s+$/.test(p)){ f.appendChild(document.createTextNode(p)); return; }
      var s=document.createElement('span'); s.className='mx-w'; s.style.animationDelay=(n++*38)+'ms'; s.textContent=p; f.appendChild(s); });
    t.parentNode.replaceChild(f,t); }); }
function rbAsk(pane){ var R=pane.__rb; R.wait='ask';
  askCard(pane,function(a){ undock(pane); R.wait=null; var rec=R.k1[1], ls=$$('.mira-card-record-line',rec);
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
  if(t.closest('[aria-label="Collapse sidebar"], [aria-label="Expand sidebar"]')){ sideTog(); return; }
  if(t.closest('.mira-user')){ location.href='setting.html?from=mira.html#st=My Account|My Profile'; return; }
  if((b=t.closest('.mira-group-head, button.mira-step-row, .mira-json-toggle'))){ toggle(b); return; }
  if((b=t.closest('[data-mx-say]'))){ var pn=MX.panes[MX.cur], sy=b.getAttribute('data-mx-say'); if(MX.busy||!pn||!pn.__rb) return; if(/^run/i.test(sy)){ if(pn.__rb.wait==='run'||pn.__rb.wait==='run-later') rbRun(pn,sy==='run'?'run':sy); } else { if(pn.__rb.ns) pn.__rb.ns.remove(); reply(sy); } return; }
  if(t.closest('[data-mx-open]')){ location.href='setting.html?from=mira.html#st=Plugin Library|Runbook'; return; }
  if((b=t.closest('.mira-forge-problem-line'))){ var cb=b.closest('.mira-forge').querySelector('[data-mx-code]'); if(cb) openCode(cb.getAttribute('data-mx-code')); return; }
  if((b=t.closest('.mira-forge-button'))){ var k=b.getAttribute('data-mx-code'); if(k) openCode(k); else location.href='setting.html?from=mira.html#st=Plugin Library|Runbook'; return; }
  if(t.closest('.mira-code-pane-head [aria-label="Close"]')){ closeCode(); return; }
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
document.addEventListener('scroll',function(e){ if(e.target.classList&&e.target.classList.contains('mira-thread-scroll')) scrollBtn(); },true);
document.addEventListener('mouseover',function(e){ var w=e.target.closest&&e.target.closest('.mira-composer-add-wrap'); if(w) tipShow(w); else tipHide(); });
window.addEventListener('resize',function(){ if(!window.__mxKeep) closePops(); });

/* the row template for a chat started here = the first seeded row */
(function(){ var li=$('.mira-recents-list > li'); if(li){ var t=document.createElement('template'); t.id='mxt-row'; t.innerHTML=li.outerHTML; document.body.appendChild(t); } })();
railMount();
dress(document);
var m=/^#\/c\/(c1|c2|c3)$/.exec(location.hash); show(m?m[1]:'new');   /* opens on New chat by default (request, 16 Nov 2026); #/c/c1|c2|c3 opens a chat */
})();
