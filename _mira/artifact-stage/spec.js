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
