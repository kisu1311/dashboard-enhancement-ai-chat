/* ── specimen mode: the artifact's component stage drives this page to one component / state ── */
var SPEC_QA=[['Runbook','Collect disk usage on the Linux hosts','What should the runbook do?'],['Target','motadata','Which monitor or host should it run on?'],['Action','Collect information only','Should it only collect information, or change something?']];
function specPane(){ var id=fileChat('Runbook Creation','c4'), pane=MX.panes[id];
  var M=[].slice.call($('.mira-thread-list',tpl('c4').content).children).map(function(m){ return m.cloneNode(true); });
  pane.__rb={A1:M[1],A2:M[2],A3:M[3],A4:M[5],A5:M[6],wait:null}; show(id); return pane; }
function specKey(el,key){ el.dispatchEvent(new KeyboardEvent('keydown',{key:key,bubbles:true,cancelable:true})); }
function specFF(target){ document.body.classList.add('mx-spec-ff'); startRunbook('create runbook'); var did={}, n=0;
  var iv=setInterval(function(){ var pane=$('#mxPane').firstElementChild, R=pane&&pane.__rb; if(!R||++n>900){ clearInterval(iv); document.body.classList.remove('mx-spec-ff'); return; }
    if(MX.play){ MX.play.finish(false); return; }
    if(R.wait===target){ clearInterval(iv); document.body.classList.remove('mx-spec-ff'); toBottom(); return; }
    if(!R.wait||did[R.wait]) return; did[R.wait]=1; var card=$('.mx-dock',pane);
    if(R.wait==='ask'&&card.classList.contains('mx-cl')){   /* the clarifier's Option 2: type each answer, Next, then Send answers on Review */
      for(var j=0;j<3;j++){ var g=$('.mx-clf input',card); g.value=SPEC_QA[j][1]; g.dispatchEvent(new Event('input',{bubbles:true})); $('.mx-clsk',card).click(); }
      var sd=$('[data-cq=send]',card); if(sd) sd.click(); }
    else if(R.wait==='ask'){ for(var i=0;i<3;i++){ var f=$('.mx-cqonly input',card); if(f){ f.value=SPEC_QA[i][1]; f.dispatchEvent(new Event('input',{bubbles:true})); } specKey(card,'Tab'); } specKey(card,'Enter'); }
    else if(R.wait==='deliver'||R.wait==='confirm') specKey(card,'Enter');
    else if(R.wait==='run') rbRun(pane,'run'); },40); }
function mxSpec(o){ var key=o.key, v=o.v||''; if(/o[23]/.test(v)){ MX.runOpt='2'; MX.qaOpt='2'; MX.forgeOpt=/o3/.test(v)?'3':'2'; MX.askOpt='2'; }   /* o3 = Option 3 of the runbook card (segments) */   /* any '…o2' variant is Option 2: the one-row run card, the grid, the boxless record */
  if(o.theme==='light') document.body.removeAttribute('data-theme'); else document.body.setAttribute('data-theme','dark-theme');
  if(key==='brand'){ document.body.classList.add('mx-spec-brand'); if(v==='o2') document.body.classList.add('mxb2'); show('new');
    /* the brand stage draws the screen at 2x with transform:scale(2) on <body>, and a transformed body is the containing block of
       its position:fixed children - so a popup placed at a button's on-screen rect (already 2x) was scaled AGAIN and opened far
       below and right of it (request, 20 Nov 2026: "fix this alignment", the chat menu). Halve every fixed popup's left/top. */
    var MXB_S=2, mxbFix=function(el){ if(el.nodeType!==1||el.parentNode!==document.body||getComputedStyle(el).position!=='fixed') return; var k=el.style.left+'|'+el.style.top; if(el.__mxbk===k) return;
      if(/px$/.test(el.style.left)) el.style.left=parseFloat(el.style.left)/MXB_S+'px'; if(/px$/.test(el.style.top)) el.style.top=parseFloat(el.style.top)/MXB_S+'px'; el.__mxbk=el.style.left+'|'+el.style.top; };
    new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.type==='childList') m.addedNodes.forEach(mxbFix); else mxbFix(m.target); }); }).observe(document.body,{childList:true,attributes:true,subtree:true,attributeFilter:['style']});
    return; }   /* Brand category (20 Nov 2026): the Mira mark, at 2x, beside the search field and the chat header */
  if(key==='chatmenu'){ document.body.classList.add('mx-spec-page','mx-spec-menu'); window.__mxKeep=true; show('new'); if(/^o[2-5]$/.test(v)) mxcInit(v);   /* __mxKeep: a stage resize must not close the menu */   /* Sidebar category: the New chat menu (Search AI chats + the dated list), opened */
    setTimeout(function(){ var hb=$('#mxPane [data-mx-hd="menu"]'); if(hb) hb.click(); },350);
    /* keep the open menu UNDER its button (request, 20 Nov 2026: "fix this alignment"): the menu is position:fixed and was placed
       once, at open; when the stage frame settles to another width afterwards the pane re-centres and the button moves, but the
       menu stayed put (the page's resize handler, which would close it, is held off by __mxKeep). Re-anchor it on every resize. */
    var re=function(){ if(!MX.pop||!MX.popFor) return; if(MX.pop.classList.contains('mxc')){ mxcPlace(MX.pop,MX.popFor); return; } var r=MX.popFor.getBoundingClientRect(); MX.pop.style.left=r.left+'px'; MX.pop.style.top=(r.bottom+6)+'px'; };
    window.addEventListener('resize',re); try{ new ResizeObserver(re).observe(document.body); new ResizeObserver(re).observe($('#mxPane')); }catch(e){} return; }
  if(key==='sidebar'){ show('new'); if(/^o2/.test(v)) mxsInit(v); if(/tog/.test(v)) mxsTog(v); return; }   /* Option 2: pin, group and filter on the chat list - spec-sidebar.js */   /* Sidebar category (20 Nov 2026): the whole mira.html screen as it opens - product rail, Mira sidebar, chat panel and hero - shown at a chosen screen size (a crop to the sidebar read as broken) */
  if(key==='artifact'){ document.body.classList.add('mx-spec-page'); mxaSpec(v); return; }   /* UI visualization · Artifact view - spec-artifact.js; the FULL page: sidebar, header, hero */
  if(key==='page'){ document.body.classList.add('mx-spec-page'); show(/^c[123]$/.test(v)?v:'new'); return; }
  document.body.classList.add('mx-spec');
  if(key==='flow'){ show('new'); startRunbook('create runbook'); return; }
  if(key==='deliver'){ specFF(v==='delivered'?'run':'deliver'); return; }
  if(key==='run'){ specFF(/^result/.test(v)?'done':'confirm'); return; }
  var pane=specPane(), R=pane.__rb, P=mkPlay(pane), k;
  if(key==='working'){ k=addMsg(P,R.A1); var mk=$('.mira-turn-mark',R.A1); if(mk&&v!=='thinking') mk.style.visibility='hidden';
    $('.mira-message-parts',R.A1).appendChild(liveLine(v==='thinking'?'Thinking':'Working on your request')); return; }
  if(key==='thinking'){ k=addMsg(P,R.A1); if(v==='done'||v==='open') P.fast=true;
    playGroup(k[0],P).then(function(){ if(v==='open') toggle($('.mira-group-head',k[0])); }); return; }
  if(key==='wordfade'){ k=addMsg(P,R.A2); k[0].classList.remove('mx-hide'); wordFade(k[0]); var k1=addMsg(P,R.A5); k1.forEach(function(x){ if(!x.classList.contains('mira-activity-group')&&!x.classList.contains('mira-forge')){ x.classList.remove('mx-hide'); wordFade(x); } }); return; }
  if(key==='question'){ k=addMsg(P,R.A1); k[2].classList.remove('mx-hide'); var fn=v==='tabs'?askCardTabs:v==='ask'?askCard:v==='ask2'?askCardV2:askCardSteps;
    var open=function(){ fn(pane,function(a){ undock(pane); var rec=k[1]; qaRecord(rec,a); rec.classList.remove('mx-hide'); wordFade(rec); toBottom(); },function(){ undock(pane); setTimeout(open,900); }); };
    open(); return; }
  if(key==='record'){ k=addMsg(P,R.A1); var a=SPEC_QA.map(function(x){ return x.slice(); }); if(/skipped$/.test(v)) a[1][1]='';
    qaRecord(k[1],a); k[1].classList.remove('mx-hide'); wordFade(k[1]); if(/(open|skipped)$/.test(v)) $('.mx-qa-h',k[1]).click(); return; }   /* the record is collapsed by default */
  if(key==='runbook'){ k=addMsg(P,R.A2); var f1=k[2], main=$('.mira-forge-main',f1), keep=main.innerHTML;
    var S1={draft:function(){ forgeSet(f1,{tone:'quiet',stages:ST(['Writing','now'],['Compiling','todo'],['Testing','todo'],['Delivering','todo']),headline:'Draft ready',sub:'Mira is filling in the job before saving it.'}); },
      rules:function(){ forgeSet(f1,{tone:'fail',stages:ST(['Written','done'],['Compiling','failed'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'It breaks the runbook rules',sub:'Mira is fixing it before saving again.',problems:[[16,'main() must print the result as one base64 line'],[19,'only main() writes to stdout (the engine reads one base64 line); log with loggerObj']]}); },
      taken:function(){ forgeSet(f1,{tone:'quiet',stages:ST(['Written','done'],['Compiling','now'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'That name is taken',sub:'A runbook named \'Linux Disk Free Percentage\' exists (id 122281148127); pick another name.'}); },
      untested:function(){ forgeSet(f1,{tone:'fail',open:true}); main.innerHTML=keep; }};
    var v1=v.replace(/^o[23]-?/,''); if(S1[v1]){ S1[v1](); f1.classList.remove('mx-hide'); return; }
    (async function(){ for(;;){ S1.draft(); f1.classList.remove('mx-hide'); await P.wait(1700); S1.rules(); await P.wait(2600); S1.taken(); await P.wait(2200); S1.untested(); await P.wait(2600); } })(); return; }
  if(key==='runresult'){ MX.runOpt=/^o2/.test(v)?'2':'1'; k=addMsg(P,R.A5); var rc=$('.mira-run',R.A5);
    if(/failed$/.test(v)){ var bad=null; ['c1','c2','c3','c4'].forEach(function(id){ bad=bad||$('.mira-run.is-failed',tpl(id).content); }); if(bad){ rc=bad.cloneNode(true); $('.mira-message-parts',R.A5).appendChild(rc); dress(R.A5); } }
    rc.classList.remove('mx-hide'); if(v==='o2-open') $('.mira-run-head',rc).click(); return; }
  if(key==='diagnostic'){ k=addMsg(P,R.A2); var f2=$('.mira-forge',R.A5).cloneNode(true); k[7].insertAdjacentElement('beforebegin',f2);
    var S2={saving:function(){ forgeSet(f2,{tone:'quiet',chips:['SSH','Read-only'],tag:'Draft',stages:ST(['Written','done'],['Compiling','now'],['Testing','todo'],['Delivering','todo']),where:'motadata',headline:'Saving and compiling',sub:'ObserveOps builds the Go source as it is saved.',moving:true}); },
      saved:function(){ forgeSet(f2,{tone:'quiet',chips:['Linux','SSH','Read-only'],tag:'Draft · v1',stages:ST(['Written','done'],['Compiled','done'],['Testing','todo'],['Delivering','todo']),where:'motadata ('+IP+')',headline:'Saved and compiled',sub:'Nothing has run yet. It will be tested on motadata ('+IP+').',open:true}); },
      delivering:function(){ forgeSet(f2,{tone:'pass',stages:ST(['Written','done'],['Compiled','done'],['Tested','done'],['Delivering','now']),where:'motadata ('+IP+')',open:true}); }};
    var v2=v.replace(/^o[23]-?/,''); if(S2[v2]){ S2[v2](); return; }
    (async function(){ for(;;){ S2.saving(); await P.wait(2200); S2.saved(); await P.wait(1900); S2.delivering(); await P.wait(2400); } })(); return; }
}
