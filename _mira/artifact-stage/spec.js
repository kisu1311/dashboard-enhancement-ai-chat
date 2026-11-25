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
  /* LAVENDER TEXT ANIMATION (request, 24 Nov 2026: "the text animation ... add a new option, colour #b9aef5"): the band that
     sweeps "Thought for 1s, used …" (the brand ramp blue → violet → pink) and the Working shimmer's highlight become ONE
     colour, --mira-name (#b9aef5 dark / #7c5ce0 light), fading in and out of the muted text. Picked by a variant 'lav'. */
  /* OPTION 4 of Create runbook flow (request, 24 Nov 2026, from Claude-style status lines: "Thinking", "Using mcp call",
     "Used list connections", "Using create dashboard"): the 4x4 dot tile becomes an ICON that says what the step is - a brain
     while Mira thinks, >_ once a tool step is done ("Used ..."), > while one runs ("Using ...") - and the title's colour sweep
     becomes a plain shimmer: a lighter band gliding over the grey text, no colour, no write-in. Variant 'lav4'. */
  if(v==='lav4'){ document.body.classList.add('mxo4'); var oc=document.createElement('style'); oc.id='mxo4-css'; oc.textContent=
    'body.mxo4 .mira-group-head>.mx-dmtile{display:none}'+
    'body.mxo4 .mxo4-ic{display:inline-grid;place-items:center;flex:0 0 18px;width:18px;height:18px;margin-right:2px;color:var(--mira-text-muted)}body.mxo4 .mxo4-ic svg{width:16px;height:16px}'+
    'body.mxo4 .mira-group-title.mx-dia{-webkit-mask-image:none;mask-image:none;background-image:linear-gradient(90deg,var(--mira-text-muted) 0%,var(--mira-text-muted) calc(var(--mx-sweep) - 12%),var(--mira-text-strong) var(--mx-sweep),var(--mira-text-muted) calc(var(--mx-sweep) + 12%),var(--mira-text-muted) 100%);animation:mxdia 1.8s linear infinite!important}'+
    'body.mxo4 .mira-group-title.mx-dia-once{-webkit-mask-image:none;mask-image:none;background:none;color:var(--mira-text-muted);animation:none!important}'+
    /* the icon breathes with the shimmer while the line works (fix, 24 Nov 2026), still once it lands - as Option 5 */
    'body.mxo4 .mira-group-head:has(.mira-group-title.mx-dia) .mxo4-ic{animation:mxo4i 1.8s ease-in-out infinite}'+
    '@keyframes mxo4i{0%,100%{color:var(--mira-text-muted);opacity:.55;transform:scale(.92)}50%{color:var(--mira-text-strong);opacity:1;transform:scale(1)}}'+
    '@media (prefers-reduced-motion:reduce){body.mxo4 .mira-group-title.mx-dia{animation:none!important;background:none;color:var(--mira-text-muted)}body.mxo4 .mxo4-ic{animation:none!important}}';
    document.head.appendChild(oc);
    var o4ic=function(t){ var s=(t||'').replace(/^\s*Working\s*·\s*/,''); return /^\s*(Working|Thinking|Clarifying)|^\s*$/.test(s)?'brain':/^\s*Thought\b/.test(s)?'brain':/^\s*Using\b/.test(s)?'chevron-right':/^\s*Used\b/.test(s)?'terminal':'chevron-right'; };
    var o4paint=function(){ $$('.mira-group-head').forEach(function(h){ var ti=$('.mira-group-title',h); if(!ti) return; var ic=$('.mxo4-ic',h), n=o4ic(ti.textContent);
      if(!ic){ ic=document.createElement('span'); ic.className='mxo4-ic'; ic.setAttribute('aria-hidden','true'); h.insertBefore(ic,ti); }
      if(ic.__n!==n){ ic.__n=n; ic.innerHTML=(typeof MXK_ICO!=='undefined'&&MXK_ICO[n])||''; } }); };
    new MutationObserver(o4paint).observe(document.body,{childList:true,subtree:true,characterData:true}); }
  /* OPTION 5 of Create runbook flow (request, 24 Nov 2026): Option 4's idea with the PRODUCT'S OWN step icons and words.
     While the group works, its head shows the CURRENT step exactly as the step rows below name it - its icon (cube,
     question-circle, the Thought icon, the Runbook icon, read off that row) and its text ("Reading the runbook-guide skill
     instructions", "Question card · step ask", "Thought · Clarifying user request") - instead of the 4x4 dot tile and
     "Working · …", with a plain grey shimmer. Once the group lands, the head is the Thought icon + "Thought for 1s, used …". */
  if(v==='lav5'){ document.body.classList.add('mxo5'); var c5=document.createElement('style'); c5.id='mxo5-css'; c5.textContent=
    'body.mxo5 .mira-group-head>.mx-dmtile{display:none}'+
    /* the icon takes the step rows' own geometry (fix, 24 Nov 2026): 14px glyph in a 14px box, the head's 10px gap to the text - it was an 18px box + 2px margin, so the text sat 14px away */
    'body.mxo5 .mxo5-ic{display:inline-grid;place-items:center;flex:0 0 14px;width:14px;height:14px;margin:0;color:var(--mira-text-muted)}body.mxo5 .mxo5-ic svg{display:block;width:14px;height:14px}'+
    'body.mxo5 .mira-group-title.mxo5-off{display:none}'+
    /* the FINISHED line rests quiet and lights up on hover (request, 24 Nov 2026): icon, text and chevron at 55%, full on
       hover / keyboard focus, and full while its step list is open */
    'body.mxo5 .mira-group-head.mxo5-done{opacity:.55;transition:opacity .15s}'+
    'body.mxo5 .mira-group-head.mxo5-done:hover,body.mxo5 .mira-group-head.mxo5-done:focus-visible,body.mxo5 .mira-activity-group.mxo5-open>.mira-group-head.mxo5-done{opacity:1}'+
    'body.mxo5 .mira-group-head.mxo5-done:hover .mira-group-title,body.mxo5 .mira-group-head.mxo5-done:hover .mxo5-ic{color:var(--mira-text-strong)}'+
    /* the step list box is CLOSED by default (request, 24 Nov 2026: the head already shows each step as it runs), but the
       head still opens and closes it - a click toggles .mxo5-open on the group; Mira's own open state is ignored here,
       so it never springs open on its own while the steps run. The chevron follows .mxo5-open. */
    'body.mxo5 .mira-activity-group:not(.mxo5-open)>.mira-group-fold{display:none!important}'+
    'body.mxo5 .mira-activity-group.mxo5-open>.mira-group-fold{display:block!important;height:auto!important;overflow:visible!important}'+
    'body.mxo5 .mira-activity-group .mira-group-head .mira-step-chevron.is-open{transform:none}'+
    'body.mxo5 .mira-activity-group.mxo5-open>.mira-group-head .mira-step-chevron{transform:rotate(90deg)}'+
    'body.mxo5 .mira-group-title.mx-dia:not(.mxo5-t){-webkit-mask-image:none;mask-image:none;background-image:linear-gradient(90deg,var(--mira-text-muted) 0%,var(--mira-text-muted) calc(var(--mx-sweep) - 12%),var(--mira-text-strong) var(--mx-sweep),var(--mira-text-muted) calc(var(--mx-sweep) + 12%),var(--mira-text-muted) 100%);animation:mxdia 1.8s linear infinite!important}'+
    'body.mxo5 .mira-group-title.mx-dia-once{-webkit-mask-image:none;mask-image:none;background:none;color:var(--mira-text-muted);animation:none!important}'+
    'body.mxo5 .mxo5-t{color:transparent;background-image:linear-gradient(90deg,var(--mira-text-muted) 0%,var(--mira-text-muted) 40%,var(--mira-text-strong) 50%,var(--mira-text-muted) 60%,var(--mira-text-muted) 100%);background-size:250% 100%;background-repeat:no-repeat;-webkit-background-clip:text;background-clip:text;animation:mxo5s 1.8s linear infinite}'+
    'body.mxo5 .mxo5-t .mxo5-d{opacity:.85}'+
    '@keyframes mxo5s{from{background-position:100% 0}to{background-position:0 0}}'+
    /* the icon breathes with the text while the step runs (fix, 24 Nov 2026: "the text animates but the icon does not"):
       same 1.8s beat - it brightens to the shimmer's highlight colour and settles back to muted; still once finished */
    'body.mxo5 .mira-group-head:not(.mxo5-done) .mxo5-ic{animation:mxo5i 1.8s ease-in-out infinite}'+
    '@keyframes mxo5i{0%,100%{color:var(--mira-text-muted);opacity:.55;transform:scale(.92)}50%{color:var(--mira-text-strong);opacity:1;transform:scale(1)}}'+
    '@media (prefers-reduced-motion:reduce){body.mxo5 .mxo5-t{animation:none;background:none;color:var(--mira-text-muted)}body.mxo5 .mxo5-ic{animation:none!important}}';
    document.head.appendChild(c5);
    var o5svg=function(row){ var sv=row&&$('.mira-step-icon svg',row); return sv?sv.outerHTML:''; };
    var o5thought=function(){ var r=$$('.mira-step-row').filter(function(x){ var t=$('.mira-step-title',x); return t&&/^\s*Thought\s*$/.test(t.textContent); })[0]; return o5svg(r); };
    var o5paint=function(){ $$('.mira-activity-group').forEach(function(g){ var h=$('.mira-group-head',g), ti=h&&$('.mira-group-title',h); if(!ti) return;
      /* the CURRENT step = the last step already revealed (unrevealed ones carry .mx-hide) */
      var live=ti.classList.contains('mx-dia')||/^\s*Working\b/.test(ti.textContent), rows=$$('.mira-group-steps>.mira-group-step:not(.mx-hide) .mira-step-row',g), cur=rows[rows.length-1];
      var ic=$('.mxo5-ic',h); if(!ic){ ic=document.createElement('span'); ic.className='mxo5-ic'; ic.setAttribute('aria-hidden','true'); h.insertBefore(ic,ti); }
      var t5=$('.mxo5-t',h); h.classList.toggle('mxo5-done',!live);
      if(live&&cur){ var tt=$('.mira-step-title',cur), dd=$('.mira-step-detail',cur), label=(tt?'<span>'+tt.textContent.trim()+'</span>':'')+(dd?(tt?'<span class="mxo5-d"> · ':'<span class="mxo5-d">')+dd.textContent.trim()+'</span>':'');
        var key=cur.textContent; if(!t5){ t5=document.createElement('span'); t5.className='mira-group-title mxo5-t'; h.insertBefore(t5,ti.nextSibling); }
        if(t5.__k!==key){ t5.__k=key; t5.innerHTML=label; } ti.classList.add('mxo5-off'); var sv=o5svg(cur); if(ic.__s!==sv){ ic.__s=sv; ic.innerHTML=sv; } }
      else { if(t5) t5.remove(); ti.classList.remove('mxo5-off'); var sv2=o5thought()||o5svg(cur); if(ic.__s!==sv2){ ic.__s=sv2; ic.innerHTML=sv2; } } }); };
    /* the watcher pauses while it paints, so its own edits never re-trigger it; repaints are batched to one per frame */
    var o5opt={childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']}, o5q=false, o5mo=new MutationObserver(function(){ if(o5q) return; o5q=true;
      setTimeout(function(){ o5q=false; o5mo.disconnect(); try{ o5paint(); }finally{ o5mo.observe(document.body,o5opt); } },30); });
    o5mo.observe(document.body,o5opt);
    window.addEventListener('click',function(e){ var h=e.target.closest&&e.target.closest('.mira-group-head'); if(!h) return; var g=h.closest('.mira-activity-group'); if(!g) return;
      e.preventDefault(); e.stopPropagation(); var on=g.classList.toggle('mxo5-open'); h.setAttribute('aria-expanded',String(on)); },true); }
  /* THINKING GROUP Options 2-4 (request, 24 Nov 2026: "suggest a better option for the Thinking group"). The same recorded
     steps, three ways to read them - variants 'tg2' Timeline, 'tg3' Tool chips, 'tg4' Progress. One painter keeps state
     classes on the group: .mxt-live while it works, and on each step .mxt-cur (the newest revealed step) / .mxt-past. */
  if(/^tg[234]d?$/.test(v)){ var tn=v.charAt(2); document.body.classList.add('mxt','mxt'+tn); var tc=document.createElement('style'); tc.id='mxt-css';
    var SH='color:transparent;background-image:linear-gradient(90deg,var(--mira-text-muted) 0%,var(--mira-text-muted) 40%,var(--mira-text-strong) 50%,var(--mira-text-muted) 60%,var(--mira-text-muted) 100%);background-size:250% 100%;background-repeat:no-repeat;-webkit-background-clip:text;background-clip:text;animation:mxts 1.8s linear infinite';
    tc.textContent=
    '@keyframes mxts{from{background-position:100% 0}to{background-position:0 0}}'+
    '@keyframes mxtp{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1)}}'+
    'body.mxt .mxt-n{flex:0 0 auto;font-family:var(--font-mono);font-size:11px;color:var(--mira-text-dimmed)}'+
    'body.mxt .mxt-ok{display:inline-grid;place-items:center;flex:0 0 14px;width:14px;height:14px;color:var(--mira-text-muted)}body.mxt .mxt-ok svg{width:14px;height:14px}'+
    /* Option 2 · Timeline: no box - the steps hang off a thin rail that links their icons; the newest step shimmers while
       it runs, the ones before it step back; finished, the head adds "5 steps" */
    'body.mxt2 .mira-group-steps{background:none;border:0;border-radius:0;margin-top:4px;overflow:visible}'+
    'body.mxt2 .mira-group-step{border-top:0!important;position:relative}'+
    'body.mxt2 .mira-group-step.mxt-next::before{content:"";position:absolute;left:18.5px;top:29px;bottom:-7px;border-left:1px solid var(--mira-border)}'+
    'body.mxt2 .mira-step-row{border-radius:6px}'+
    /* an OPENED step (fix, 24 Nov 2026: "fix this alignment"): its Request / Response body sits on the step TEXT's edge (12px row
       padding + 14px icon + 10px gap = 36px), so the rail runs clear down its left instead of through the code boxes; the open
       row is marked by a quiet fill, not the accent ring */
    'body.mxt2 .mira-group-step .mira-tool-body,body.mxt2 .mira-group-step .mira-step-reasoning{padding:4px 12px 12px 36px}'+
    'body.mxt2 .mira-step-row:focus-visible{outline:none;background:var(--mira-surface-raised)}'+
    'body.mxt2 .mira-step-row[aria-expanded="true"]{background:var(--mira-surface-raised)}'+
    'body.mxt2 .mira-group-step.mxt-past .mira-step-row{opacity:.6}'+
    'body.mxt2 .mira-group-step.mxt-cur .mira-step-title,body.mxt2 .mira-group-step.mxt-cur .mira-step-detail{'+SH+'}'+
    'body.mxt2 .mira-group-step.mxt-cur .mira-step-icon{color:var(--mira-text-strong);animation:mxtp 1.8s ease-in-out infinite}'+
    /* Option 3 · Tool chips: the box stays shut; under the head, one chip per skill / tool the turn used (×2 when it ran
       twice), arriving as each step lands - the newest one pulses. A chip (or the head) opens the full step list. */
    'body.mxt3 .mira-activity-group:not(.mxt-open)>.mira-group-fold{display:none!important}'+
    'body.mxt3 .mira-activity-group.mxt-open>.mira-group-fold{display:block!important;height:auto!important;overflow:visible!important}'+
    'body.mxt3 .mira-group-head .mira-step-chevron.is-open{transform:none}body.mxt3 .mxt-open>.mira-group-head .mira-step-chevron{transform:rotate(90deg)}'+
    'body.mxt3 .mxt-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 2px}'+
    'body.mxt3 .mxt-chip{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border:1px solid var(--mira-border);border-radius:12px;background:var(--mira-surface);color:var(--mira-text-muted);font:inherit;font-size:12px;cursor:pointer;transition:background-color .1s,color .1s}'+
    'body.mxt3 .mxt-chip:hover{background:var(--mira-surface-raised);color:var(--mira-text-strong)}'+
    'body.mxt3 .mxt-chip:focus-visible{outline:2px solid var(--mira-accent);outline-offset:1px}'+
    'body.mxt3 .mxt-chip svg{width:12px;height:12px;flex:0 0 12px}body.mxt3 .mxt-chip .x{font-family:var(--font-mono);font-size:11px;color:var(--mira-text-dimmed)}'+
    'body.mxt3 .mxt-chip.mxt-cur{color:var(--mira-text-strong);border-color:var(--mira-text-dimmed)}body.mxt3 .mxt-chip.mxt-cur svg{animation:mxtp 1.8s ease-in-out infinite}'+
    'body.mxt3 .mxt-chip.mxt-cur .l{'+SH+'}'+
    'body.mxt3 .mira-group-step.mxt-flash .mira-step-row{background:var(--mira-surface-raised)}'+
    /* Option 4 · Progress: while it works the box shows only the CURRENT step (shimmering), a "N steps done" line above it
       and a thin progress bar at its foot, and the head counts "3 of 5". Finished, it folds to ✓ + the title + "5 steps";
       opened, every step is listed. */
    'body.mxt4 .mxt-live .mira-group-step.mxt-past{display:none}'+
    'body.mxt4 .mxt-done{display:none;align-items:center;gap:10px;padding:8px 12px;font-size:12px;color:var(--mira-text-dimmed)}body.mxt4 .mxt-live .mxt-done.on{display:flex}'+
    'body.mxt4 .mxt-done svg{width:14px;height:14px}'+
    'body.mxt4 .mxt-live .mxt-done.on+.mira-group-step{border-top:1px solid var(--mira-border)}'+
    'body.mxt4 .mxt-live .mira-group-step.mxt-cur .mira-step-title,body.mxt4 .mxt-live .mira-group-step.mxt-cur .mira-step-detail{'+SH+'}'+
    'body.mxt4 .mxt-live .mira-group-step.mxt-cur .mira-step-icon{color:var(--mira-text-strong);animation:mxtp 1.8s ease-in-out infinite}'+
    'body.mxt4 .mxt-bar{display:none;height:2px;background:var(--mira-border)}body.mxt4 .mxt-live .mxt-bar{display:block}'+
    'body.mxt4 .mxt-bar i{display:block;height:100%;width:0;background:var(--mira-text-muted);transition:width .3s ease}'+
    '@media (prefers-reduced-motion:reduce){body.mxt .mira-step-title,body.mxt .mira-step-detail,body.mxt .mxt-chip .l{animation:none!important;background:none!important;color:inherit!important}body.mxt .mira-step-icon,body.mxt .mxt-chip svg{animation:none!important}}';
    document.head.appendChild(tc);
    var ico=function(n){ return (typeof MXK_ICO!=='undefined'&&MXK_ICO[n])||''; };
    var tSvg=function(s){ var sv=$('.mira-step-icon svg',s); return sv?sv.outerHTML:''; };
    var tName=function(s){ var r=$('.mira-step-row',s); if(!r) return ''; if(r.classList.contains('is-static')){ var m=/Reading the\s+(.+?)\s+skill/.exec(r.textContent.replace(/\s+/g,' ')); return m?m[1]:r.textContent.trim(); }
      var t=$('.mira-step-title',r); return t?t.textContent.trim():r.textContent.trim(); };
    var tPaint=function(){ $$('.mira-activity-group').forEach(function(g){ var h=$('.mira-group-head',g), ti=h&&$('.mira-group-title',h), box=$('.mira-group-steps',g); if(!ti||!box) return;
      var live=ti.classList.contains('mx-dia')||/^\s*Working\b/.test(ti.textContent), all=$$('.mira-group-steps>.mira-group-step',g), shown=all.filter(function(s){ return !s.classList.contains('mx-hide'); }), cur=live?shown[shown.length-1]:null;
      g.classList.toggle('mxt-live',live);
      all.forEach(function(s){ var i=shown.indexOf(s); s.classList.toggle('mxt-cur',s===cur); s.classList.toggle('mxt-past',live&&i>=0&&s!==cur); s.classList.toggle('mxt-next',i>=0&&i<shown.length-1); });
      var n=$('.mxt-n',h); if(!n){ n=document.createElement('span'); n.className='mxt-n'; h.insertBefore(n,ti.nextSibling); }
      var nt=live?(tn==='4'?shown.length+' of '+all.length:''):all.length+' steps'; if(n.textContent!==nt) n.textContent=nt; n.hidden=!nt;
      if(tn==='4'){ var ok=$('.mxt-ok',h); if(!live&&!ok){ ok=document.createElement('span'); ok.className='mxt-ok'; ok.setAttribute('aria-hidden','true'); ok.innerHTML=ico('check'); h.insertBefore(ok,h.firstChild); } if(live&&ok) ok.remove();
        var dn=$('.mxt-done',box); if(!dn){ dn=document.createElement('div'); dn.className='mxt-done'; box.insertBefore(dn,box.firstChild); }
        var past=shown.length-1, dt=past>0?ico('check')+'<span>'+past+(past===1?' step':' steps')+' done</span>':''; if(dn.__k!==dt){ dn.__k=dt; dn.innerHTML=dt; } dn.classList.toggle('on',live&&past>0);
        var bar=$('.mxt-bar',box); if(!bar){ bar=document.createElement('div'); bar.className='mxt-bar'; bar.innerHTML='<i></i>'; box.appendChild(bar); }
        var w=Math.round(shown.length/Math.max(1,all.length)*100)+'%'; if(bar.firstChild.style.width!==w) bar.firstChild.style.width=w; }
      if(tn==='3'){ var cw=$('.mxt-chips',g); if(!cw){ cw=document.createElement('div'); cw.className='mxt-chips'; g.insertBefore(cw,h.nextSibling); }
        var seen={}, order=[]; shown.forEach(function(s){ var k=tName(s); if(!seen[k]){ seen[k]={n:0,svg:tSvg(s),s:s}; order.push(k); } seen[k].n++; seen[k].last=s; });
        var ck=order.map(function(k){ return k+'|'+seen[k].n+'|'+(cur&&seen[k].last===cur?1:0); }).join(';');
        if(cw.__k!==ck){ cw.__k=ck; cw.innerHTML=''; order.forEach(function(k,i){ var c=document.createElement('button'); c.type='button'; c.className='mxt-chip'+(cur&&seen[k].last===cur?' mxt-cur':''); c.__step=seen[k].s;
          c.innerHTML=seen[k].svg+'<span class="l">'+esc(k)+'</span>'+(seen[k].n>1?'<span class="x">×'+seen[k].n+'</span>':''); cw.appendChild(c); }); }
        cw.hidden=!order.length; } }); };
    var topt={childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']}, tq=false, tmo=new MutationObserver(function(){ if(tq) return; tq=true;
      setTimeout(function(){ tq=false; tmo.disconnect(); try{ tPaint(); }finally{ tmo.observe(document.body,topt); } },30); });
    tmo.observe(document.body,topt);
    if(tn==='3') window.addEventListener('click',function(e){ var c=e.target.closest&&e.target.closest('.mxt-chip'), h=!c&&e.target.closest&&e.target.closest('.mira-group-head'), g=(c||h)&&(c||h).closest('.mira-activity-group'); if(!g) return;
      e.preventDefault(); e.stopPropagation(); var hd=$('.mira-group-head',g);
      if(c){ g.classList.add('mxt-open'); var st=c.__step; if(st){ st.classList.add('mxt-flash'); setTimeout(function(){ st.classList.remove('mxt-flash'); },900); } }
      else g.classList.toggle('mxt-open'); hd.setAttribute('aria-expanded',String(g.classList.contains('mxt-open'))); },true); }
  if(/lav/.test(v)&&v!=='lav4'&&v!=='lav5'){ document.body.classList.add('mxdia-lav'); var lc=document.createElement('style'); lc.id='mxdia-lav-css'; lc.textContent=
    'body.mxdia-lav .mira-group-title.mx-dia,body.mxdia-lav .mira-group-title.mx-dia-once{background-image:linear-gradient(90deg,var(--mira-text-muted) 0%,var(--mira-text-muted) calc(var(--mx-sweep) - 14%),var(--ai-accent) var(--mx-sweep),var(--mira-text-muted) calc(var(--mx-sweep) + 14%),var(--mira-text-muted) 100%)}'+
    'body.mxdia-lav .mira-shimmer{background-image:linear-gradient(90deg,transparent calc(50% - var(--mira-shimmer-spread)),var(--ai-accent),transparent calc(50% + var(--mira-shimmer-spread))),linear-gradient(var(--mira-text-muted),var(--mira-text-muted))}';
    document.head.appendChild(lc); }
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
  if(key==='create'){ show('new'); mxkInit(v); return; }   /* Composer · Create an artifact - spec-create.js */
  if(key==='start'){ show('new'); mxkStart(v); return; }   /* Composer · Help to start - spec-create.js */
  if(key==='composer'){ show('new'); mxqComposer(v); return; }   /* Composer · The composer box - spec-create.js */
  if(key==='deliver'){ specFF(v==='delivered'?'run':'deliver'); return; }
  if(key==='run'){ specFF(/^result/.test(v)?'done':'confirm'); return; }
  var pane=specPane(), R=pane.__rb, P=mkPlay(pane), k;
  if(key==='working'){ k=addMsg(P,R.A1); var mk=$('.mira-turn-mark',R.A1); if(mk&&v!=='thinking') mk.style.visibility='hidden';
    $('.mira-message-parts',R.A1).appendChild(liveLine(v==='thinking'?'Thinking':'Working on your request')); return; }
  if(key==='thinking'){ k=addMsg(P,R.A1); if(v==='done'||v==='open'||/^tg\dd$/.test(v)) P.fast=true;
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
