
/* ── Composer · Create an artifact (Module Work › Mira AI › Composer, 24 Nov 2026) ─────────────────────────────────
   Request: "in this chatbot area add an artifact view, with 3-4 unique and user-friendly options, using Mobbin AI tools".
   The New chat hero gets a way to START an artifact - a dashboard, a report, a runbook, a chart, an alert policy -
   instead of only asking a question. Four options beside the current hero (Option 1):
     2 · Create menu     - the composer's + opens Add (file, context) and Create (the five types)      [Google Gemini]
                           picking one puts a removable type chip in the composer and a matching prompt  [Microsoft Copilot]
     3 · Artifact tiles  - "Or start an artifact" - five tiles + Start from scratch under the composer   [Claude]
     4 · Quick chips     - one row of create chips; a chip fills the composer with a fill-in template,
                           the first [blank] selected so typing replaces it                             [Langdock, WRITER]
     5 · Recent artifacts - "Your artifacts" cards under the composer: a small live preview, the type and
                           when it was edited, View all; a card reopens its artifact                     [Manus, Productboard]
   Specimen-only: it lives in the stage driver (mxk*), not in mira.html. Icons: Tabler, from the icon library. */
var MXK_ICO=/*MXK_ICONS*/{};
var MXK_T=[
  {k:'dash',  n:'Dashboard',    ic:'layout-dashboard', c:'--mira-module-dashboard', d:'Widgets for a set of hosts or apps',
   ph:'Describe the dashboard — e.g. CPU, memory and disk of the prod web servers, last 24 hours',
   tpl:'Build a dashboard for [hosts or group] showing [metrics] over [time range]'},
  {k:'report',n:'Report',       ic:'file-text',        c:'--mira-module-reports',   d:'SLA, incidents or capacity, ready to share',
   ph:'Describe the report — e.g. weekly SLA for the core network, sent every Monday',
   tpl:'Create a [weekly] report on [SLA / incidents / capacity] for [scope]'},
  {k:'runbook',n:'Runbook',     ic:'list-check',       c:'--mira-module-flow',      d:'A fix, step by step, with approvals',
   ph:'Describe the runbook — e.g. clear /var/log when a Linux disk passes 90%',
   tpl:'Write a runbook that [action] when [condition] on [hosts]'},
  {k:'chart', n:'Chart',        ic:'chart-line',       c:'--mira-module-apm',       d:'One metric or a Top N, as a widget',
   ph:'Describe the chart — e.g. top 10 interfaces by traffic in the last hour',
   tpl:'Chart [metric] for [hosts or interfaces] over [time range]'},
  {k:'alert', n:'Alert policy', ic:'bell-plus',        c:'--mira-module-alerts',    d:'Turn a condition into an alert',
   ph:'Describe the alert — e.g. critical when an interface flaps 3 times in 10 minutes',
   tpl:'Alert me when [condition] on [hosts] for [duration]'}];
var MXK={opt:'1',type:null};
/* the connectors the product's + lists (agno · GitHub · Notion; read off the live composer) */
var MXK_CON=[{n:'agno',c:'--chart-tangerine',on:true,d:'Agent tools for Mira'},{n:'GitHub',ic:'brand-github',on:true,d:'Repos, issues and pull requests'},{n:'Notion',ic:'brand-notion',on:false,d:'Runbooks and docs'}];
/* connectors block, improved (request, 24 Nov 2026: "suggest a better UI; the on/off is the ObserveOps DS switch"):
   a "Connectors · N of M on · Manage" header instead of an underlined first row, a one-line purpose under each name so you
   know what turning it on gives Mira, an off connector's name dimmed, and the switch is the DS obs-switch (size small, the
   DS's dense-row size). The whole row toggles; the menu stays open. */
function mxkConN(){ return MXK_CON.filter(function(c){ return c.on; }).length; }
function mxkConSync(m){ MXK_CON.forEach(function(c,i){ var r=m.querySelector('[data-mxk="con"][data-i="'+i+'"]'); if(!r) return; r.setAttribute('aria-checked',String(c.on)); r.classList.toggle('is-off',!c.on);
    /* the product's labelled switch (ON / OFF, default size - the live grids' switch); obs-switch is controlled */
    var sw=r.querySelector('obs-switch'); if(sw){ sw.checkedText='ON'; sw.uncheckedText='OFF'; sw.checked=c.on; } });
  var n=m.querySelector('.mxk-conn'); if(n) n.textContent=mxkConN()+' of '+MXK_CON.length+' on'; }
function mxkI(n,cls){ return '<span class="mxk-ic'+(cls?' '+cls:'')+'" aria-hidden="true">'+(MXK_ICO[n]||'')+'</span>'; }
function mxkType(k){ return MXK_T.filter(function(t){ return t.k===k; })[0]||null; }
function mxkHero(){ return $('.mira-composer.is-hero'); }
function mxkTa(){ var h=mxkHero(); return h&&$('textarea.mira-composer-input',h); }
function mxkInput(v,selFrom,selTo){ var ta=mxkTa(); if(!ta) return; ta.value=v; ta.dispatchEvent(new Event('input',{bubbles:true})); ta.focus();
  if(selFrom!=null) try{ ta.setSelectionRange(selFrom,selTo); }catch(e){} }

/* the type chip in the composer's action row (options 2 and 3) */
/* option 6 (request, 24 Nov 2026: "I need it IN the composer"): an Artifact pill in the composer's own action row, beside
   the reasoning pill (Sana's Create button, WRITER's Agent pill). It opens the five types; once one is picked the pill
   BECOMES that type - icon, name, a small x to drop it - so the choice stays visible where you type. */
function mxkPill(){ var h=mxkHero(); if(!h) return; var row=$('.mira-composer-actions',h); if(!row) return; var p=$('.mxk-pill',row), t=mxkType(MXK.type);
  if(!p){ p=document.createElement('span'); p.className='mxk-pillw'; var eff=$('.mira-effort-pill',row); row.insertBefore(p,eff?eff.nextSibling:null); } else p=p.parentNode;
  p.style.setProperty('--mxk-c',t?'var('+t.c+')':'var(--mira-name)');
  p.innerHTML='<button type="button" class="mxk-pill'+(t?' is-set':'')+'" data-mxk="pill" aria-haspopup="menu" aria-expanded="false" title="'+(t?'Creating a '+t.n.toLowerCase():'Create an artifact')+'">'+
    mxkI(t?t.ic:'sparkles','is-type')+'<span>'+(t?t.n:'Artifact')+'</span>'+(t?'':mxkI('chevron-down','is-chev'))+'</button>'+
    (t?'<button type="button" class="mxk-pillx" data-mxk="untype" aria-label="Stop creating a '+t.n.toLowerCase()+'">'+mxkI('x')+'</button>':''); }
function mxkSetType(k){ MXK.type=k; var h=mxkHero(); if(!h) return; var row=$('.mira-composer-actions',h), old=$('.mxk-chip',h); if(old) old.remove();
  var ta=mxkTa(), t=mxkType(k);
  if(ta){ if(!ta.__mxkPh) ta.__mxkPh=ta.placeholder; ta.placeholder=t?t.ph:ta.__mxkPh; }
  if(MXK.opt==='6'){ mxkPill(); if(ta) ta.focus(); return; }
  if(t&&row){ var c=document.createElement('span'); c.className='mxk-chip'; c.style.setProperty('--mxk-c','var('+t.c+')');
    c.innerHTML=mxkI(t.ic)+'<span>'+t.n+'</span><button type="button" class="mxk-chipx" data-mxk="untype" aria-label="Remove '+t.n+'">'+mxkI('x')+'</button>';
    var add=$('.mira-composer-add-wrap',row); add=add&&add.closest('.inline-block'); row.insertBefore(c,add?add.nextSibling:row.firstChild); }
  $$('.mxk-tile').forEach(function(x){ x.classList.toggle('is-on',x.getAttribute('data-k')===k); x.setAttribute('aria-pressed',String(x.getAttribute('data-k')===k)); });
  if(ta) ta.focus(); }

/* option 2 · the + menu */
function mxkMenuClose(){ var m=$('.mxk-menu'); if(m) m.remove(); var pl=$('.mxk-pill'); if(pl) pl.setAttribute('aria-expanded','false'); var b=$('.mira-composer.is-hero .mira-composer-add'); if(b) b.setAttribute('aria-expanded','false'); }
function mxkMenu(btn){ if($('.mxk-menu')){ mxkMenuClose(); return; }
  var six=MXK.opt==='6';
  var h=six?'<div class="mxk-mh">Create an artifact</div>'+
    MXK_T.map(function(t){ return '<button type="button" class="mxk-mi" data-mxk="type" data-k="'+t.k+'" style="--mxk-c:var('+t.c+')">'+mxkI(t.ic,'is-type')+
      '<span class="mxk-mt"><b>'+t.n+'</b><small>'+t.d+'</small></span>'+(MXK.type===t.k?mxkI('check','is-ck'):'')+'</button>'; }).join('')+
    '<div class="mxk-ms" role="separator"></div><button type="button" class="mxk-mi" data-mxk="untype">'+mxkI('x')+'<span class="mxk-mt"><b>Just ask</b><small>No artifact, just an answer</small></span>'+(MXK.type?'':mxkI('check','is-ck'))+'</button>'
   /* the product's + holds ONLY the connectors (request, 24 Nov 2026: "the + has only this action - add this, remove the
      extras"): Manage connectors, then each connector with its on/off switch. Option 2 adds Create under them. */
   :'<div class="mxk-conh"><span>Connectors</span><span class="mxk-conn">'+mxkConN()+' of '+MXK_CON.length+' on</span>'+
      '<button type="button" class="mxk-conm" data-mxk="connectors">'+mxkI('settings')+'Manage</button></div>'+
    MXK_CON.map(function(c,i){ return '<div class="mxk-mi mxk-con'+(c.on?'':' is-off')+'" data-mxk="con" data-i="'+i+'" role="menuitemcheckbox" tabindex="0" aria-checked="'+c.on+'">'+
      (c.ic?'<span class="mxk-logo">'+mxkI(c.ic)+'</span>':'<span class="mxk-logo is-letter" style="--mxk-c:var('+c.c+')">'+c.n[0]+'</span>')+
      '<span class="mxk-mt"><b>'+c.n+'</b><small>'+c.d+'</small></span><obs-switch aria-hidden="true" tabindex="-1"></obs-switch></div>'; }).join('')+
    '<div class="mxk-ms" role="separator"></div><div class="mxk-mh">Create</div>'+
    MXK_T.map(function(t){ return '<button type="button" class="mxk-mi" data-mxk="type" data-k="'+t.k+'" style="--mxk-c:var('+t.c+')">'+mxkI(t.ic,'is-type')+
      '<span class="mxk-mt"><b>'+t.n+'</b><small>'+t.d+'</small></span>'+(MXK.type===t.k?mxkI('check','is-ck'):'')+'</button>'; }).join('');
  var m=document.createElement('div'); m.className='mxk-menu'; m.setAttribute('role','menu'); m.innerHTML=h; document.body.appendChild(m);
  if(six) m.classList.add('is-six'); else mxkConSync(m);
  var r=btn.getBoundingClientRect(), y=r.bottom+6; if(y+m.offsetHeight>innerHeight-8) y=Math.max(8,r.top-6-m.offsetHeight);
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px'; m.style.top=y+'px'; btn.setAttribute('aria-expanded','true'); }


/* what sits under the composer: tiles (3), chips (4) or recent artifacts (5) */
var MXK_REC=[
  {k:'dash',  t:'Prod web servers — CPU & memory', ago:'2 h ago', v:'line'},
  {k:'report',t:'Weekly SLA · core network',       ago:'Yesterday', v:'bars'},
  {k:'runbook',t:'Clear /var/log on Linux hosts',  ago:'3 d ago', v:'steps'},
  {k:'chart', t:'Top 10 interfaces by traffic',    ago:'5 d ago', v:'hbars'}];
function mxkThumb(v){ var W=200,H=64;
  if(v==='line'){ var a=[38,30,34,22,26,18,24,14,20,12,16,10], b=[50,46,48,42,44,40,42,36,40,38,34,36];
    var p=function(s){ return s.map(function(y,i){ return (i*W/(s.length-1)).toFixed(1)+','+y; }).join(' '); };
    return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><polyline points="'+p(b)+'" fill="none" style="stroke:var(--chart-tangerine)" stroke-width="2"/><polyline points="'+p(a)+'" fill="none" style="stroke:var(--chart-vivid-teal)" stroke-width="2"/></svg>'; }
  if(v==='bars'){ var h=[40,46,44,50,38,48,52], w=W/h.length; return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true">'+h.map(function(x,i){ return '<rect x="'+(i*w+6).toFixed(1)+'" y="'+(H-x)+'" width="'+(w-12).toFixed(1)+'" height="'+x+'" rx="2" style="fill:var(--chart-neon-purple)"/>'; }).join('')+'</svg>'; }
  if(v==='hbars'){ var q=[180,150,128,96,70]; return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true">'+q.map(function(x,i){ return '<rect x="0" y="'+(i*13+1)+'" width="'+x+'" height="9" rx="2" style="fill:var(--chart-vivid-teal)"/>'; }).join('')+'</svg>'; }
  return '<div class="mxk-steps">'+['Check disk usage','Approve cleanup','Clear /var/log'].map(function(s,i){ return '<span><i>'+(i+1)+'</i>'+s+'</span>'; }).join('')+'</div>'; }
function mxkBelow(){ var o=MXK.opt;
  if(o==='3') return '<div class="mxk-below mxk-tiles-w"><div class="mxk-bh">Or start an artifact</div><div class="mxk-tiles">'+
    MXK_T.map(function(t){ return '<button type="button" class="mxk-tile" data-mxk="tile" data-k="'+t.k+'" aria-pressed="false" style="--mxk-c:var('+t.c+')">'+mxkI(t.ic,'is-type')+'<b>'+t.n+'</b><small>'+t.d+'</small></button>'; }).join('')+
    '<button type="button" class="mxk-tile is-blank" data-mxk="tile" data-k="">'+mxkI('plus','is-type')+'<b>Start from scratch</b><small>Just describe what you need</small></button></div></div>';
  if(o==='4') return '<div class="mxk-below mxk-chips" role="group" aria-label="Create">'+
    MXK_T.map(function(t){ return '<button type="button" class="mxk-qc" data-mxk="quick" data-k="'+t.k+'" style="--mxk-c:var('+t.c+')">'+mxkI(t.ic,'is-type')+'<span>'+({dash:'Build dashboard',report:'Create report',runbook:'Write runbook',chart:'Chart a metric',alert:'Set up alert'})[t.k]+'</span></button>'; }).join('')+'</div>';
  if(o==='5') return '<div class="mxk-below mxk-rec-w"><div class="mxk-bh"><span>Your artifacts</span><button type="button" class="mxk-all" data-mxk="all">View all'+mxkI('arrow-right')+'</button></div><div class="mxk-rec">'+
    MXK_REC.map(function(a,i){ var t=mxkType(a.k); return '<button type="button" class="mxk-card" data-mxk="open" data-i="'+i+'" style="--mxk-c:var('+t.c+')"><div class="mxk-th">'+mxkThumb(a.v)+'</div>'+
      '<div class="mxk-cb"><b title="'+a.t+'">'+a.t+'</b><span class="mxk-meta">'+mxkI(t.ic,'is-type')+t.n+' · '+a.ago+'</span></div></button>'; }).join('')+'</div></div>';
  return ''; }
function mxkPaint(){ var h=mxkHero(); if(!h) return; var old=$('.mxk-below'); if(old) old.remove(); var html=mxkBelow(); if(html) h.insertAdjacentHTML('afterend',html);
  var bl=$('.mxk-below'); if(bl) bl.style.setProperty('--mxk-w',Math.round(h.getBoundingClientRect().width)+'px');
  var add=$('.mira-composer-add',h); if(add){ if(MXK.opt==='2'){ add.disabled=false; add.removeAttribute('disabled'); add.setAttribute('aria-haspopup','menu'); add.setAttribute('aria-label','Connectors and create'); add.title='Connectors and create'; } } }
function mxkAct(b){ var a=b.getAttribute('data-mxk'), k=b.getAttribute('data-k');
  if(a==='type'){ mxkMenuClose(); mxkSetType(k); return; }
  if(a==='untype'){ mxkMenuClose(); mxkSetType(null); return; }
  if(a==='pill'){ mxkMenu(b); return; }
  if(a==='tile'){ if(!k){ mxkSetType(null); mxkInput(''); return; } mxkSetType(MXK.type===k?null:k); return; }
  if(a==='quick'){ var t=mxkType(k), s=t.tpl, i=s.indexOf('['), j=s.indexOf(']')+1; $$('.mxk-qc').forEach(function(x){ x.classList.toggle('is-on',x===b); }); mxkInput(s,i,j); return; }
  if(a==='con'){ var c=MXK_CON[+b.getAttribute('data-i')]; c.on=!c.on; var mm=b.closest('.mxk-menu'); if(mm) mxkConSync(mm); return; }   /* the menu stays open; the DS switch is controlled, so it is set from here */
  if(a==='connectors'){ mxkMenuClose(); toast('Opens Settings › Connectors'); return; }
  if(a==='open'){ var r=MXK_REC[+b.getAttribute('data-i')]; toast('Opens “'+r.t+'”'); return; }
  if(a==='all'){ toast('Opens all your artifacts'); return; } }
function mxkWire(){ if(mxkWire.on) return; mxkWire.on=1; var st=document.createElement('style'); st.id='mxk-css'; st.textContent=MXK_CSS; document.head.appendChild(st);
  window.addEventListener('click',function(e){ var t=e.target;
    var add=t.closest&&t.closest('.mira-composer.is-hero .mira-composer-add');
    if(add&&MXK.opt==='2'){ e.preventDefault(); e.stopPropagation(); mxkMenu(add); return; }
    var b=t.closest&&t.closest('[data-mxk]'); if(b){ e.preventDefault(); e.stopPropagation(); mxkAct(b); return; }
    if($('.mxk-menu')&&!(t.closest&&t.closest('.mxk-menu'))) mxkMenuClose(); },true);
  document.addEventListener('keydown',function(e){ var cr=e.target&&e.target.closest&&e.target.closest('.mxk-menu [data-mxk="con"]');
    if(cr&&(e.key===' '||e.key==='Enter')){ e.preventDefault(); e.stopPropagation(); mxkAct(cr); return; }
    if(e.key==='Escape'&&$('.mxk-menu')){ e.stopPropagation(); mxkMenuClose(); }
    /* option 4: Tab selects the next [blank] of the template, Shift+Tab the previous one */
    if(e.key==='Tab'&&MXK.opt==='4'&&e.target===mxkTa()&&/\[[^\]]*\]/.test(e.target.value)){ var ta=e.target, v=ta.value, at=e.shiftKey?ta.selectionStart:ta.selectionEnd, r=null, m, re=/\[[^\]]*\]/g;
      var all=[]; while((m=re.exec(v))) all.push([m.index,m.index+m[0].length]);
      if(e.shiftKey){ for(var q=all.length-1;q>=0;q--) if(all[q][1]<=at){ r=all[q]; break; } } else { for(var q2=0;q2<all.length;q2++) if(all[q2][0]>=at){ r=all[q2]; break; } }
      if(r){ e.preventDefault(); e.stopPropagation(); ta.setSelectionRange(r[0],r[1]); } }
    /* Backspace in an empty composer takes the type chip off, as a token field does */
    if(e.key==='Backspace'&&MXK.type&&e.target===mxkTa()&&!e.target.value) mxkSetType(null); },true); }
function mxkInit(v){ var m=/^o([2-6])/.exec(v||''); MXK.opt=m?m[1]:'1'; MXK.type=null; mxkWire(); mxkPaint();
  if(MXK.opt==='6') mxkPill();
  if(v==='o6-menu'){ var pl=$('.mxk-pill'); if(pl) setTimeout(function(){ mxkMenu(pl); },250); }
  else if(v==='o6-set') mxkSetType('dash');
  if(v==='o2'){ var add=$('.mira-composer.is-hero .mira-composer-add'); if(add) setTimeout(function(){ mxkMenu(add); },250); }
  else if(v==='o2-chip'||v==='o3-pick') mxkSetType('dash');
  else if(v==='o4-fill'){ var q=$('.mxk-qc[data-k="dash"]'); if(q) mxkAct(q); } }
var MXK_CSS=
 '.mxk-logo{display:grid;place-items:center;flex:0 0 20px;width:20px;height:20px;border-radius:4px;background:var(--mira-surface-muted);color:var(--mira-text-strong)}.mxk-logo .mxk-ic,.mxk-logo svg{width:14px;height:14px}'+
 '.mxk-logo.is-letter{background:var(--mxk-c);color:var(--mira-on-accent);font-size:12px;font-weight:700;text-transform:lowercase}'+
 '.mxk-cn{flex:1;min-width:0}'+
 '.mxk-conh{display:flex;align-items:center;gap:8px;padding:8px 8px 4px}.mxk-conh>span:first-child{font-size:12px;font-weight:500;color:var(--mira-text-muted)}'+
 '.mxk-conn{flex:1;font-size:11.5px;color:var(--mira-text-dimmed);font-variant-numeric:tabular-nums}'+
 '.mxk-conm{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 6px;border:0;border-radius:4px;background:none;color:var(--mira-name);font:inherit;font-size:12px;font-weight:500;cursor:pointer}'+
 '.mxk-conm:hover{background:var(--mira-row-hover)}.mxk-conm .mxk-ic,.mxk-conm svg{width:14px;height:14px}'+
 '.mxk-con{cursor:pointer}.mxk-con .mxk-logo{flex-basis:24px;width:24px;height:24px;border-radius:6px}.mxk-con obs-switch{flex:0 0 auto;pointer-events:none}'+
 /* DS gap 84: in dark theme the switch's track (--switch-bg) and border (--switch-border) match a raised menu, so only the
    knob shows. On this menu the track takes the page colour and the border the field border - both DS tokens. */
 '.mxk-menu obs-switch{--switch-bg:var(--page-background-color);--switch-border:var(--field-border-color)}'+
 '.mxk-con.is-off .mxk-mt b{color:var(--mira-text-muted)}.mxk-con.is-off .mxk-logo{opacity:.6}'+
 '.mxk-pillw{display:inline-flex;align-items:center;margin-left:6px}'+
 '.mxk-pill{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid var(--mira-border);border-radius:15px;background:none;color:var(--mira-text-toned);font:inherit;font-size:12.5px;font-weight:500;cursor:pointer}'+
 '.mxk-pill:hover,.mxk-pill[aria-expanded="true"]{color:var(--mira-text-strong);border-color:var(--mira-border-accented);background:var(--mira-row-hover)}'+
 '.mxk-pill .mxk-ic.is-type{color:var(--mxk-c)}.mxk-pill .is-chev,.mxk-pill .is-chev svg{width:14px;height:14px;color:var(--mira-text-muted)}'+
 '.mxk-pill.is-set{border-radius:15px 0 0 15px;border-right:0;padding-right:6px;color:var(--mira-text-strong);background:var(--mira-surface-muted)}'+
 '.mxk-pillx{display:grid;place-items:center;width:26px;height:30px;padding:0 4px 0 0;border:1px solid var(--mira-border);border-left:0;border-radius:0 15px 15px 0;background:var(--mira-surface-muted);color:var(--mira-text-muted);cursor:pointer}'+
 '.mxk-pillx:hover{color:var(--mira-text-strong)}.mxk-pillx .mxk-ic,.mxk-pillx svg{width:12px;height:12px}'+
 '.mxk-ic{display:inline-grid;place-items:center;flex:0 0 16px;width:16px;height:16px}.mxk-ic svg{width:16px;height:16px}'+
 '.mxk-ic.is-type{color:var(--mxk-c,var(--mira-text-muted))}'+
 /* the type chip in the composer */
 '.mxk-chip{display:inline-flex;align-items:center;gap:6px;height:28px;margin-left:6px;padding:0 4px 0 8px;border:1px solid var(--mira-border);border-radius:14px;background:var(--mira-surface-muted);color:var(--mira-text-strong);font-size:12.5px;font-weight:500}'+
 '.mxk-chip>.mxk-ic{color:var(--mxk-c)}.mxk-chipx{display:grid;place-items:center;width:20px;height:20px;padding:0;border:0;border-radius:50%;background:none;color:var(--mira-text-muted);cursor:pointer}'+
 '.mxk-chipx:hover{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxk-chipx .mxk-ic,.mxk-chipx svg{width:12px;height:12px}'+
 /* + menu */
 '.mxk-menu:not(.is-six){width:308px}.mxk-menu{position:fixed;z-index:6000;width:272px;padding:4px;border:1px solid var(--mira-panel-edge);border-radius:10px;background:var(--mira-surface-raised);box-shadow:var(--mira-menu-shadow)}'+
 '.mxk-mh{padding:8px 8px 4px;font-size:12px;font-weight:500;color:var(--mira-text-muted)}.mxk-ms{height:1px;margin:4px 0;background:var(--mira-hairline)}'+
 '.mxk-mi{display:flex;align-items:center;gap:10px;width:100%;min-height:32px;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--mira-text);font:inherit;font-size:13px;text-align:left;cursor:pointer}'+
 '.mxk-mi:hover,.mxk-mi:focus-visible{background:var(--mira-row-hover);color:var(--mira-text-strong);outline:0}.mxk-mi>.mxk-ic{color:var(--mira-text-muted)}.mxk-mi>.mxk-ic.is-type{color:var(--mxk-c)}'+
 '.mxk-mt{display:flex;flex-direction:column;flex:1;min-width:0}.mxk-mt b{font-weight:500}.mxk-mt small{font-size:11.5px;color:var(--mira-text-muted)}.mxk-ic.is-ck{color:var(--mira-name)}'+
 /* below the composer */
 '.mxk-below{width:100%;max-width:var(--mxk-w,720px);margin:16px auto 0;text-align:left}'+
 '.mxk-bh{display:flex;align-items:center;justify-content:space-between;margin:0 2px 8px;font-size:12.5px;font-weight:500;color:var(--mira-text-muted)}'+
 '.mxk-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'+
 '.mxk-tile{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-height:84px;padding:12px;border:1px solid var(--mira-border);border-radius:10px;background:var(--mira-surface);color:var(--mira-text);font:inherit;text-align:left;cursor:pointer;transition:border-color .12s,background .12s}'+
 '.mxk-tile:hover{border-color:var(--mira-border-accented);background:var(--mira-surface-muted)}.mxk-tile.is-on{border-color:var(--mxk-c);background:var(--mira-surface-muted)}'+
 '.mxk-tile .mxk-ic{width:20px;height:20px;margin-bottom:4px}.mxk-tile .mxk-ic svg{width:20px;height:20px}.mxk-tile b{font-size:13px;font-weight:500;color:var(--mira-text-strong)}.mxk-tile small{font-size:12px;line-height:16px;color:var(--mira-text-muted)}'+
 '.mxk-tile.is-blank{border-style:dashed}'+
 '.mxk-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}'+
 '.mxk-qc{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:1px solid var(--mira-border);border-radius:16px;background:var(--mira-surface);color:var(--mira-text-toned);font:inherit;font-size:12.5px;cursor:pointer}'+
 '.mxk-qc:hover{color:var(--mira-text-strong);border-color:var(--mira-border-accented)}.mxk-qc.is-on{color:var(--mira-text-strong);border-color:var(--mxk-c);background:var(--mira-surface-muted)}'+
 '.mxk-all{display:inline-flex;align-items:center;gap:4px;padding:0;border:0;background:none;color:var(--mira-name);font:inherit;font-size:12.5px;cursor:pointer}.mxk-all:hover{text-decoration:underline}.mxk-all .mxk-ic,.mxk-all svg{width:14px;height:14px}'+
 '.mxk-rec{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}'+
 '.mxk-card{display:flex;flex-direction:column;min-width:0;padding:0;border:1px solid var(--mira-border);border-radius:10px;background:var(--mira-surface);color:var(--mira-text);font:inherit;text-align:left;cursor:pointer;overflow:hidden;transition:border-color .12s}'+
 '.mxk-card:hover{border-color:var(--mira-border-accented)}'+
 '.mxk-th{height:76px;padding:10px 12px 6px;border-bottom:1px solid var(--mira-hairline);background:var(--mira-surface-muted)}.mxk-th svg{display:block;width:100%;height:100%}'+
 '.mxk-steps{display:flex;flex-direction:column;gap:3px;font-size:10.5px;color:var(--mira-text-muted)}.mxk-steps span{display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden}'+
 '.mxk-steps i{display:grid;place-items:center;flex:0 0 13px;width:13px;height:13px;border-radius:50%;background:var(--mira-row-hover);font-style:normal;font-size:9px;color:var(--mira-text-toned)}'+
 '.mxk-cb{display:flex;flex-direction:column;gap:4px;padding:8px 12px 10px;min-width:0}.mxk-cb b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:34px;font-size:12.5px;line-height:17px;font-weight:500;color:var(--mira-text-strong)}'+
 '.mxk-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--mira-text-muted);white-space:nowrap;overflow:hidden}.mxk-meta .mxk-ic,.mxk-meta svg{width:13px;height:13px}';

/* ── Composer · Help to start (Module Work › Mira AI › Composer, 24 Nov 2026) ─────────────────────────────────────
   Request: "in this chat area, better options using Mobbin" - asked: what sits UNDER the composer, to help people start.
     2 · Smart suggestions  - "Based on what's happening now": prompts built from live alerts / monitors / SLOs  [ClickUp, Sana]
     3 · Recent + suggested - two columns: your last chats (reopen) and suggestions                         [Notion]
     4 · Starter categories - Investigate · Explain · Build · Report, three example prompts each             [Copilot, Langdock]
     5 · Since you were here - a briefing strip of what changed, each item one click to ask about         [Productboard, Manus]
   A suggestion fills the composer (cursor at the end) - nothing is sent until you press Enter. */
var MXK_SUG=[
  {ic:'alert-triangle',c:'--mira-ask-danger',t:'3 critical alerts on core-sw-01 — what is going on?',m:'Alerts · 12 min ago'},
  {ic:'server',c:'--mira-ask-warn',t:'Disk on db-prod-02 is at 94% — what is using the space?',m:'Monitor · 40 min ago'},
  {ic:'activity',c:'--mira-ask-warn',t:'Te1/0/1 on core-sw-01 flapped 4 times — find the cause',m:'Interface · 1 h ago'},
  {ic:'chart-line',c:'--mira-name',t:'Core network SLA fell to 99.2% this week — why?',m:'SLO · today'}];
var MXK_CAT=[
  {k:'inv',n:'Investigate',ic:'search',p:['Why is core-sw-01 raising so many alerts today?','Which hosts had the most downtime this week?','What changed on db-prod-02 before the disk alert?']},
  {k:'exp',n:'Explain',ic:'bulb',p:['Explain this alert: Interface Down on Te1/0/1','What does the SLA burn rate on core network mean?','Explain the difference between a monitor and a policy']},
  {k:'bld',n:'Build',ic:'list-check',p:['Build a dashboard for the prod web servers','Write a runbook to clear /var/log above 90%','Create an alert when an interface flaps 3 times']},
  {k:'rep',n:'Report',ic:'file-text',p:['Weekly SLA report for the core network','Top 10 noisiest monitors this month','Incident summary for yesterday']}];
var MXK_ST={opt:'1',cat:'inv',rot:0};
function mxkFill(t){ mxkInput(t,t.length,t.length); }
function mxkStartHTML(){ var o=MXK_ST.opt, A='<span class="mxk-go">'+mxkI('arrow-right')+'</span>';
  var sug=function(n){ var r=[],i; for(i=0;i<n;i++) r.push(MXK_SUG[(i+MXK_ST.rot)%MXK_SUG.length]); return r; };
  var row=function(s,meta){ return '<button type="button" class="mxk-sr" data-mxk="fill" title="'+s.t.replace(/"/g,'&quot;')+'" data-t="'+s.t.replace(/"/g,'&quot;')+'" style="--mxk-c:var('+s.c+')"><span class="mxk-st">'+mxkI(s.ic,'is-type')+'</span>'+
      '<span class="mxk-mt"><b>'+s.t+'</b>'+(meta?'<small>'+s.m+'</small>':'')+'</span>'+A+'</button>'; };
  if(o==='2') return '<div class="mxk-below mxk-sug"><div class="mxk-bh"><span>Based on what’s happening now</span><button type="button" class="mxk-all" data-mxk="rot">'+mxkI('refresh')+'Other ideas</button></div>'+
    '<div class="mxk-list">'+sug(4).map(function(s){ return row(s,true); }).join('')+'</div></div>';
  if(o==='3'){ var rec=[['c1','WhatsApp Alert Integration Runbook','2 h ago'],['c2','Runbook Creation (UI)','Yesterday'],['c3','Runbook Creation','3 d ago']];
    return '<div class="mxk-below mxk-2col"><div><div class="mxk-bh"><span>Recent chats</span><button type="button" class="mxk-all" data-mxk="allchats">All chats'+mxkI('arrow-right')+'</button></div><div class="mxk-list">'+
      rec.map(function(r){ return '<button type="button" class="mxk-sr is-flat" data-mxk="chat" data-id="'+r[0]+'"><span class="mxk-st">'+mxkI('message')+'</span><span class="mxk-mt"><b>'+r[1]+'</b></span><span class="mxk-when">'+r[2]+'</span></button>'; }).join('')+'</div></div>'+
      '<div><div class="mxk-bh"><span>Suggested</span></div><div class="mxk-list">'+sug(3).map(function(s){ return row(s,false).replace('mxk-sr','mxk-sr is-flat'); }).join('')+'</div></div></div>'; }
  if(o==='4'){ var c=MXK_CAT.filter(function(x){ return x.k===MXK_ST.cat; })[0]||MXK_CAT[0];
    return '<div class="mxk-below mxk-cat"><div class="mxk-tabs" role="tablist" aria-label="Start with">'+MXK_CAT.map(function(x){ var on=x===c;
      return '<button type="button" role="tab" aria-selected="'+on+'" class="mxk-tab'+(on?' is-on':'')+'" data-mxk="cat" data-k="'+x.k+'">'+mxkI(x.ic)+x.n+'</button>'; }).join('')+'</div>'+
      '<div class="mxk-list">'+c.p.map(function(p){ return '<button type="button" class="mxk-sr is-flat" data-mxk="fill" data-t="'+p+'"><span class="mxk-mt"><b>'+p+'</b></span>'+A+'</button>'; }).join('')+'</div></div>'; }
  if(o==='5'){ var it=[{n:'12',l:'new alerts',s:'3 critical',c:'--mira-ask-danger',ic:'alert-triangle',q:'Summarise the 12 new alerts since yesterday 18:40, critical first'},
      {n:'2',l:'runbooks ran',s:'1 needs approval',c:'--mira-ask-warn',ic:'list-check',q:'Show the 2 runbooks that ran since yesterday 18:40 and what is waiting for approval'},
      {n:'99.2%',l:'core network SLA',s:'↓ 0.5 pts',c:'--mira-name',ic:'chart-line',q:'Why did the core network SLA drop to 99.2% since yesterday?'}];
    return '<div class="mxk-below mxk-brief"><div class="mxk-bh"><span>Since you were last here · yesterday 18:40</span><button type="button" class="mxk-all" data-mxk="fill" data-t="Summarise everything that changed since yesterday 18:40">Summarise all'+mxkI('arrow-right')+'</button></div>'+
      '<div class="mxk-bgrid">'+it.map(function(x){ return '<button type="button" class="mxk-bc" data-mxk="fill" data-t="'+x.q+'" style="--mxk-c:var('+x.c+')"><span class="mxk-bt">'+mxkI(x.ic,'is-type')+'<span>'+x.l+'</span></span>'+
        '<b>'+x.n+'</b><small>'+x.s+'</small><span class="mxk-ask">Ask about this'+mxkI('arrow-right')+'</span></button>'; }).join('')+'</div></div>'; }
  return ''; }
function mxkStartPaint(){ var h=mxkHero(); if(!h) return; var old=$('.mxk-below'); if(old) old.remove(); var html=mxkStartHTML(); if(!html) return; h.insertAdjacentHTML('afterend',html);
  var bl=$('.mxk-below'); if(bl) bl.style.setProperty('--mxk-w',Math.round(h.getBoundingClientRect().width)+'px'); }
function mxkStart(v){ var m=/^o([2-5])/.exec(v||''); MXK_ST.opt=m?m[1]:'1'; MXK.opt='start'; mxkWire(); MXK_ST.rot=0; MXK_ST.cat=v==='o4-build'?'bld':'inv';
  if(!document.getElementById('mxk-css2')){ var st=document.createElement('style'); st.id='mxk-css2'; st.textContent=MXK_CSS2; document.head.appendChild(st); }
  mxkStartPaint(); if(v==='o2-fill'){ var r=$('.mxk-sug [data-mxk="fill"]'); if(r) mxkAct(r); } }
/* the actions above go through mxkAct (window-capture click listener) */
var mxkAct0=mxkAct; mxkAct=function(b){ var a=b.getAttribute('data-mxk');
  if(a==='fill'){ var t=b.getAttribute('data-t'); $$('.mxk-sr.is-on,.mxk-bc.is-on').forEach(function(x){ x.classList.remove('is-on'); }); if(b.classList.contains('mxk-sr')||b.classList.contains('mxk-bc')) b.classList.add('is-on'); mxkFill(t); return; }
  if(a==='rot'){ MXK_ST.rot=(MXK_ST.rot+2)%MXK_SUG.length; mxkStartPaint(); return; }
  if(a==='cat'){ MXK_ST.cat=b.getAttribute('data-k'); mxkStartPaint(); return; }
  if(a==='chat'){ var id=b.getAttribute('data-id'); try{ show(id); }catch(e){ toast('Opens the chat'); } return; }
  if(a==='allchats'){ toast('Opens the chat list'); return; }
  return mxkAct0(b); };
var MXK_CSS2=
 '.mxk-list{display:flex;flex-direction:column;gap:2px}'+
 '.mxk-sr{display:flex;align-items:center;gap:12px;width:100%;min-height:44px;padding:8px 10px;border:0;border-radius:8px;background:none;color:var(--mira-text);font:inherit;text-align:left;cursor:pointer}'+
 '.mxk-sr:hover,.mxk-sr:focus-visible,.mxk-sr.is-on{background:var(--mira-row-hover);outline:0}.mxk-sr .mxk-mt b{font-size:13px;font-weight:400;color:var(--mira-text-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
 '.mxk-sr .mxk-mt small{margin-top:2px}.mxk-sr.is-flat{min-height:36px}'+
 '.mxk-st{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;border-radius:7px;background:var(--mira-surface-muted);color:var(--mira-text-muted)}.mxk-sr.is-flat .mxk-st{flex-basis:24px;width:24px;height:24px;background:none}'+
 '.mxk-go{display:grid;place-items:center;opacity:0;color:var(--mira-text-muted);transition:opacity .12s}.mxk-sr:hover .mxk-go,.mxk-sr:focus-visible .mxk-go{opacity:1}'+
 '.mxk-when{flex:0 0 auto;font-size:11.5px;color:var(--mira-text-dimmed)}'+
 '.mxk-all .mxk-ic{order:0}.mxk-sug .mxk-all .mxk-ic:first-child{margin-right:2px}'+
 '.mxk-2col{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}.mxk-2col>div{min-width:0}.mxk-2col .mxk-sr .mxk-mt b{font-size:12.5px}'+
 '.mxk-tabs{display:flex;gap:6px;margin:0 0 8px;justify-content:center}'+
 '.mxk-tab{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:1px solid var(--mira-border);border-radius:15px;background:none;color:var(--mira-text-toned);font:inherit;font-size:12.5px;cursor:pointer}'+
 '.mxk-tab:hover{color:var(--mira-text-strong)}.mxk-tab.is-on{background:var(--mira-surface-muted);border-color:var(--mira-border-accented);color:var(--mira-text-strong);font-weight:500}'+
 '.mxk-cat .mxk-list{padding:4px;border:1px solid var(--mira-border);border-radius:10px;background:var(--mira-surface)}'+
 '.mxk-bgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'+
 '.mxk-bc{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px;border:1px solid var(--mira-border);border-radius:10px;background:var(--mira-surface);color:var(--mira-text);font:inherit;text-align:left;cursor:pointer}'+
 '.mxk-bc:hover,.mxk-bc.is-on{border-color:var(--mira-border-accented);background:var(--mira-surface-muted)}'+
 '.mxk-bt{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--mira-text-muted)}.mxk-bc b{margin-top:4px;font-size:22px;line-height:28px;font-weight:600;color:var(--mira-text-strong);font-variant-numeric:tabular-nums}'+
 '.mxk-bc small{font-size:12px;color:var(--mxk-c)}.mxk-ask{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:12px;color:var(--mira-text-muted);transition:color .12s}'+
 '.mxk-bc:hover .mxk-ask,.mxk-bc:focus-visible .mxk-ask{color:var(--mira-name)}.mxk-ask .mxk-ic,.mxk-ask svg{width:13px;height:13px}';

/* ── Composer · The composer box (Module Work › Mira AI › Composer, 24 Nov 2026) ───────────────────────────────────
   Request: "not suggestions - I need the TEXT AREA and its other elements". Options for the box itself:
     2 · Scope & time     - two pickers in the action row: what to look at (All monitors ▾) and when (Last 24 hours ▾);
                            the placeholder says what you are about to ask about                         [ClickUp "All Sources", Sana]
     3 · Context & @      - type @ (or press the @ button) to pin a host, an alert or a runbook as a chip above the
                            text, so the question is about exactly that                                   [Manus, Productboard]
     4 · Tools & expand   - a Tools pill whose menu turns Mira's tools on or off (DS obs-switch), an expand
                            button for long prompts, and the keyboard hint spelled out                    [Notion, WRITER, Gemini]
     5 · Compact          - one rounded line that grows as you type: + · text · depth · mic · send       [Gemini, Perplexity]
   Every option adds a microphone button before Send. */
var MXQ={opt:'1',scope:'all',range:'24h',ctx:[],tools:{docs:true,diag:true,runbooks:false},big:false,rec:false};
var MXQ_SCOPE=[['all','All monitors','stack-2'],['net','Network devices','router'],['linux','Linux servers','server'],['db','Databases','database']];
var MXQ_RANGE=[['15m','Last 15 minutes'],['1h','Last hour'],['24h','Last 24 hours'],['7d','Last 7 days']];
var MXQ_ENT=[{k:'core-sw-01',n:'core-sw-01',s:'Router · 192.0.2.11',ic:'router'},{k:'db-prod-02',n:'db-prod-02',s:'Linux server · 198.51.100.24',ic:'server'},
  {k:'a4821',n:'Alert #4821',s:'Interface Down · critical',ic:'alert-triangle',c:'--mira-ask-danger'},{k:'rbvar',n:'Clear /var/log',s:'Runbook',ic:'list-check'}];
var MXQ_TOOLS=[['docs','Search the docs','book-2','Answers cite the product guide'],['diag','Run diagnostics','activity','Read-only checks on the hosts you name'],['runbooks','Use my runbooks','list-check','Suggest a runbook when one fits']];
function mxqRow(){ var h=mxkHero(); return h&&$('.mira-composer-actions',h); }
function mxqAfterEffort(el){ var row=mxqRow(); if(!row) return; var eff=$('.mira-effort-pill',row), at=$('.mxq-anchor',row)||eff; row.insertBefore(el,at?at.nextSibling:null); el.classList.add('mxq-anchor'); if(at&&at!==eff) at.classList.remove('mxq-anchor'); }
function mxqEl(html){ var d=document.createElement('span'); d.className='mxq-w'; d.innerHTML=html; return d; }
function mxqLab(list,k){ return (list.filter(function(x){ return x[0]===k; })[0]||list[0])[1]; }
function mxqPh(){ var ta=mxkTa(); if(!ta) return; if(!ta.__mxkPh) ta.__mxkPh=ta.placeholder;
  ta.placeholder=MXQ.opt==='2'?'Ask about '+mxqLab(MXQ_SCOPE,MXQ.scope).toLowerCase()+' · '+mxqLab(MXQ_RANGE,MXQ.range).toLowerCase()+'…'
    :MXQ.opt==='3'?(MXQ.ctx.length?'Ask about '+MXQ.ctx.map(function(k){ return (MXQ_ENT.filter(function(e){ return e.k===k; })[0]||{}).n; }).join(' and ')+'…':'Ask Mira… type @ to add a host, an alert or a runbook')
    :MXQ.opt==='5'?'Ask Mira…':ta.__mxkPh; }
/* the pills of option 2 and 4 */
function mxqPaintPills(){ $$('.mxq-w.is-pill').forEach(function(x){ x.remove(); }); var row=mxqRow(); if(!row) return; $$('.mxq-anchor').forEach(function(x){ x.classList.remove('mxq-anchor'); });
  if(MXQ.opt==='2'){ var sc=MXQ_SCOPE.filter(function(x){ return x[0]===MXQ.scope; })[0];
    var a=mxqEl('<button type="button" class="mxk-pill" data-mxk="qscope" aria-haspopup="menu">'+mxkI(sc[2])+'<span>'+sc[1]+'</span>'+mxkI('chevron-down','is-chev')+'</button>'); a.classList.add('is-pill'); mxqAfterEffort(a);
    var b=mxqEl('<button type="button" class="mxk-pill" data-mxk="qrange" aria-haspopup="menu">'+mxkI('clock')+'<span>'+mxqLab(MXQ_RANGE,MXQ.range)+'</span>'+mxkI('chevron-down','is-chev')+'</button>'); b.classList.add('is-pill'); mxqAfterEffort(b); }
  if(MXQ.opt==='4'){ var n=MXQ_TOOLS.filter(function(t){ return MXQ.tools[t[0]]; }).length;
    var c=mxqEl('<button type="button" class="mxk-pill" data-mxk="qtools" aria-haspopup="menu">'+mxkI('tool')+'<span>Tools</span><span class="mxq-n">'+n+'</span>'+mxkI('chevron-down','is-chev')+'</button>'); c.classList.add('is-pill'); mxqAfterEffort(c); }
  mxqPh(); }
function mxqPop(btn,html,cls){ var old=$('.mxk-menu'); if(old){ var same=old.__for===btn; mxkMenuClose(); if(same) return; }
  var m=document.createElement('div'); m.className='mxk-menu is-six mxq-pop '+(cls||''); m.setAttribute('role','menu'); m.innerHTML=html; m.__for=btn; document.body.appendChild(m);
  var r=btn.getBoundingClientRect(), y=r.bottom+6; if(y+m.offsetHeight>innerHeight-8) y=Math.max(8,r.top-6-m.offsetHeight);
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px'; m.style.top=y+'px'; return m; }
function mxqList(act,list,cur,icon){ return list.map(function(x){ var on=x[0]===cur; return '<button type="button" class="mxk-mi" data-mxk="'+act+'" data-k="'+x[0]+'">'+(icon&&x[2]?mxkI(x[2]):'')+'<span class="mxk-mt"><b>'+x[1]+'</b></span>'+(on?mxkI('check','is-ck'):'')+'</button>'; }).join(''); }
function mxqToolsMenu(btn){ var m=mxqPop(btn,'<div class="mxk-mh">Mira can use</div>'+MXQ_TOOLS.map(function(t){ return '<div class="mxk-mi mxk-con'+(MXQ.tools[t[0]]?'':' is-off')+'" data-mxk="qtool" data-k="'+t[0]+'" role="menuitemcheckbox" tabindex="0">'+
    '<span class="mxk-logo">'+mxkI(t[2])+'</span><span class="mxk-mt"><b>'+t[1]+'</b><small>'+t[3]+'</small></span><obs-switch aria-hidden="true" tabindex="-1"></obs-switch></div>'; }).join(''),'mxq-tools');
  if(m) mxqToolSync(m); }
function mxqToolSync(m){ MXQ_TOOLS.forEach(function(t){ var r=m.querySelector('[data-k="'+t[0]+'"]'); if(!r) return; r.classList.toggle('is-off',!MXQ.tools[t[0]]); var sw=r.querySelector('obs-switch'); if(sw){ sw.checkedText='ON'; sw.uncheckedText='OFF'; sw.checked=!!MXQ.tools[t[0]]; } }); }
/* option 3 · context chips + @ mentions */
function mxqCtxPaint(){ var h=mxkHero(); if(!h) return; var box=$('.mira-composer-box',h), ta=mxkTa(), s=$('.mxq-ctx',h);
  if(!MXQ.ctx.length){ if(s) s.remove(); mxqPh(); return; }
  if(!s){ s=document.createElement('div'); s.className='mxq-ctx'; box.insertBefore(s,ta); }
  s.innerHTML=MXQ.ctx.map(function(k){ var e=MXQ_ENT.filter(function(x){ return x.k===k; })[0]; return '<span class="mxq-cc" style="--mxk-c:var('+(e.c||'--mira-text-muted')+')">'+mxkI(e.ic,'is-type')+'<span>'+e.n+'</span><button type="button" class="mxk-chipx" data-mxk="qunctx" data-k="'+k+'" aria-label="Remove '+e.n+'">'+mxkI('x')+'</button></span>'; }).join('');
  mxqPh(); }
function mxqAt(q){ var ta=mxkTa(), h=mxkHero(); if(!ta||!h) return; q=(q||'').toLowerCase();
  var list=MXQ_ENT.filter(function(e){ return MXQ.ctx.indexOf(e.k)<0&&(!q||e.n.toLowerCase().indexOf(q)>=0||e.s.toLowerCase().indexOf(q)>=0); });
  var html='<div class="mxk-mh">Add to this question</div>'+(list.length?list.map(function(e,i){ return '<button type="button" class="mxk-mi'+(i?'':' is-hi')+'" data-mxk="qctx" data-k="'+e.k+'" style="--mxk-c:var('+(e.c||'--mira-text-muted')+')">'+mxkI(e.ic,'is-type')+'<span class="mxk-mt"><b>'+e.n+'</b><small>'+e.s+'</small></span></button>'; }).join(''):'<div class="mxk-mnone">Nothing matches “'+q+'”</div>');
  var m=$('.mxk-menu.mxq-at'); if(m){ m.innerHTML=html; return; }
  m=mxqPop($('.mira-composer-box',h),html,'mxq-at'); if(m){ var r=$('.mira-composer-box',h).getBoundingClientRect(); m.style.left=(r.left+12)+'px'; } }
function mxqAddCtx(k){ var ta=mxkTa(); if(MXQ.ctx.indexOf(k)<0) MXQ.ctx.push(k); if(ta){ var v=ta.value, p=ta.selectionStart==null?v.length:ta.selectionStart, pre=v.slice(0,p).replace(/@[\w.\-#\/]*$/,''); mxkInput(pre+v.slice(p),pre.length,pre.length); }
  mxkMenuClose(); mxqCtxPaint(); }
/* the microphone, every option */
function mxqMic(){ var row=mxqRow(); if(!row||$('.mxq-mic',row)) return; var send=$('.mira-submit',row); var b=document.createElement('button'); b.type='button'; b.className='mxq-mic'; b.setAttribute('data-mxk','qmic'); b.setAttribute('aria-label','Dictate'); b.title='Dictate';
  b.innerHTML=mxkI('microphone'); row.insertBefore(b,send); }
/* option 4 · expand */
function mxqExpand(){ var h=mxkHero(); if(!h) return; var box=$('.mira-composer-box',h); if(!$('.mxq-exp',box)){ var b=document.createElement('button'); b.type='button'; b.className='mxq-exp'; b.setAttribute('data-mxk','qbig'); box.appendChild(b); }
  var e=$('.mxq-exp',box); e.innerHTML=mxkI(MXQ.big?'arrows-minimize':'arrows-maximize'); e.title=MXQ.big?'Shrink':'Expand for a long prompt'; e.setAttribute('aria-label',e.title); h.classList.toggle('mxq-big',MXQ.big);
  var hint=$('.mira-composer-hint',h); if(hint) hint.innerHTML='<kbd>↵</kbd> send · <kbd>⇧</kbd><kbd>↵</kbd> new line'; }
function mxqComposer(v){ var m=/^o([2-5])/.exec(v||''); MXQ.opt=m?m[1]:'1'; MXK.opt='composer'; mxkWire();
  if(!document.getElementById('mxq-css')){ var st=document.createElement('style'); st.id='mxq-css'; st.textContent=MXQ_CSS+MXK_CSS2; document.head.appendChild(st); }
  var h=mxkHero(); if(!h) return; h.classList.toggle('mxq-compact',MXQ.opt==='5');
  if(MXQ.opt!=='1') mxqMic();
  if(MXQ.opt==='2'||MXQ.opt==='4') mxqPaintPills();
  if(MXQ.opt==='3'){ var row=mxqRow(), add=$('.mira-composer-add-wrap',row); add=add&&add.closest('.inline-block');
    var at=document.createElement('button'); at.type='button'; at.className='mxq-mic mxq-atb'; at.setAttribute('data-mxk','qat'); at.title='Add a host, an alert or a runbook'; at.setAttribute('aria-label',at.title); at.innerHTML=mxkI('at'); row.insertBefore(at,add?add.nextSibling:row.firstChild);
    if(v==='o3-ctx'){ MXQ.ctx=['core-sw-01','a4821']; } mxqCtxPaint();
    if(v==='o3-at'){ setTimeout(function(){ mxkInput('Why is @co',10,10); mxqAt('co'); },300); } }
  if(MXQ.opt==='4'){ mxqExpand(); if(v==='o4-big'){ MXQ.big=true; mxqExpand(); } if(v==='o4-tools') setTimeout(function(){ var b=$('[data-mxk="qtools"]'); if(b) mxqToolsMenu(b); },300); }
  if(MXQ.opt==='5'){ mxqPh(); var ta=mxkTa(); if(ta) mxqGrow(ta); }
  if(v==='o2-scope') setTimeout(function(){ var b=$('[data-mxk="qscope"]'); if(b) mxkAct(b); },300); }
function mxqGrow(ta){ var h=mxkHero(); if(!h||!h.classList.contains('mxq-compact')) return;
  /* one line until there is more to show: empty = 36px; otherwise the text's own height, up to 160px, then it scrolls */
  if(!ta.value){ h.style.setProperty('--mxq-h','36px'); h.classList.remove('mxq-multi'); return; }
  h.style.setProperty('--mxq-h','0px'); var sh=ta.scrollHeight; h.style.setProperty('--mxq-h',Math.min(160,Math.max(36,sh))+'px'); h.classList.toggle('mxq-multi',sh>40); }
var mxkAct1=mxkAct; mxkAct=function(b){ var a=b.getAttribute('data-mxk'), k=b.getAttribute('data-k');
  if(a==='qscope'){ mxqPop(b,'<div class="mxk-mh">Look at</div>'+mxqList('qsetscope',MXQ_SCOPE,MXQ.scope,true)); return; }
  if(a==='qrange'){ mxqPop(b,'<div class="mxk-mh">Time range</div>'+mxqList('qsetrange',MXQ_RANGE,MXQ.range,false)); return; }
  if(a==='qsetscope'||a==='qsetrange'){ if(a==='qsetscope') MXQ.scope=k; else MXQ.range=k; mxkMenuClose(); mxqPaintPills(); var ta=mxkTa(); if(ta) ta.focus(); return; }
  if(a==='qtools'){ mxqToolsMenu(b); return; }
  if(a==='qtool'){ MXQ.tools[k]=!MXQ.tools[k]; var m=b.closest('.mxk-menu'); if(m) mxqToolSync(m); var n=$('[data-mxk="qtools"] .mxq-n'); if(n) n.textContent=MXQ_TOOLS.filter(function(t){ return MXQ.tools[t[0]]; }).length; return; }
  if(a==='qat'){ var ta2=mxkTa(); if(ta2){ var v=ta2.value; mxkInput(v+(v&&!/\s$/.test(v)?' @':'@')); } mxqAt(''); return; }
  if(a==='qctx'){ mxqAddCtx(k); return; }
  if(a==='qunctx'){ MXQ.ctx=MXQ.ctx.filter(function(x){ return x!==k; }); mxqCtxPaint(); return; }
  if(a==='qbig'){ MXQ.big=!MXQ.big; mxqExpand(); var ta3=mxkTa(); if(ta3) ta3.focus(); return; }
  if(a==='qmic'){ MXQ.rec=!MXQ.rec; b.classList.toggle('is-rec',MXQ.rec); b.title=MXQ.rec?'Stop dictating':'Dictate'; if(MXQ.rec) toast('Listening… speak your question'); return; }
  return mxkAct1(b); };
document.addEventListener('input',function(e){ var ta=e.target; if(MXK.opt!=='composer'||ta!==mxkTa()) return;
  if(MXQ.opt==='5') mxqGrow(ta);
  if(MXQ.opt==='3'){ var m=/@([\w.\-#\/]*)$/.exec(ta.value.slice(0,ta.selectionStart)); if(m) mxqAt(m[1]); else if($('.mxk-menu.mxq-at')) mxkMenuClose(); } },true);
document.addEventListener('keydown',function(e){ if(MXK.opt!=='composer'||MXQ.opt!=='3') return; var m=$('.mxk-menu.mxq-at'); if(!m) return;
  var it=$$('.mxk-mi',m), i=it.findIndex(function(x){ return x.classList.contains('is-hi'); });
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); e.stopPropagation(); if(it[i]) it[i].classList.remove('is-hi'); i=(i+(e.key==='ArrowDown'?1:-1)+it.length)%it.length; if(it[i]) it[i].classList.add('is-hi'); }
  else if((e.key==='Enter'||e.key==='Tab')&&it[i]){ e.preventDefault(); e.stopPropagation(); mxqAddCtx(it[i].getAttribute('data-k')); } },true);
var MXQ_CSS=
 '.mxq-w{display:inline-flex}.mxq-n{min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--mira-accent-16);color:var(--mira-name);font-size:11px;line-height:16px;text-align:center}'+
 '.mxq-mic{display:grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:none;color:var(--mira-text-muted);cursor:pointer}'+
 '.mxq-mic:hover{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxq-mic .mxk-ic,.mxq-mic svg{width:18px;height:18px}'+
 '.mxq-mic.is-rec{color:var(--mira-ask-danger);background:var(--mira-error-soft);animation:mxqPulse 1.4s ease-in-out infinite}'+
 '@keyframes mxqPulse{0%,100%{box-shadow:0 0 0 0 var(--mira-error-ring)}50%{box-shadow:0 0 0 6px transparent}}'+
 '.mxq-atb{width:30px;height:30px;border:1px solid var(--mira-border)}'+
 /* context chips above the text */
 '.mxq-ctx{display:flex;flex-wrap:wrap;gap:6px;padding:6px 8px 0}'+
 '.mxq-cc{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 4px 0 8px;border:1px solid var(--mira-border);border-radius:6px;background:var(--mira-surface-muted);color:var(--mira-text-strong);font-size:12.5px}'+
 '.mxq-cc .mxk-ic.is-type{color:var(--mxk-c)}.mxk-menu .mxk-mi.is-hi{background:var(--mira-row-hover)}.mxq-at{width:300px}'+
 /* tools menu: the DS switch, visible on the raised menu (DS gap 84) */
 '.mxq-tools{width:320px}.mxq-tools .mxk-con .mxk-logo{background:var(--mira-surface-muted);color:var(--mira-text-toned)}.mxk-menu obs-switch{--switch-bg:var(--page-background-color);--switch-border:var(--field-border-color)}'+
 /* expand */
 'body .is-hero .mira-composer-box{position:relative}.mxq-exp{position:absolute;top:8px;right:8px;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:none;color:var(--mira-text-muted);cursor:pointer}'+
 '.mxq-exp:hover{color:var(--mira-text-strong);background:var(--mira-row-hover)}.mxq-exp .mxk-ic,.mxq-exp svg{width:16px;height:16px}'+
 'body .is-hero.mxq-big .mira-composer-input{height:240px!important;min-height:240px!important;max-height:240px!important;overflow-y:auto!important}'+
 /* compact: one rounded line that grows */
 /* compact (fix, 24 Nov 2026): the rim (.mira-composer-frame, 1px gradient, 20px radius) is rounded WITH the box, the bar
    is 48px, and the controls sit on the line's centre; once the text wraps they drop to the last line */
 'body .is-hero.mxq-compact .mira-composer-frame{border-radius:25px}'+
 'body .is-hero.mxq-compact .mira-composer-box{flex-direction:row;align-items:center;column-gap:6px;min-height:46px;padding:5px 7px!important;border-radius:24px}'+
 /* the compact box lost its inner padding to a later box rule, so + and the mic touched its edge (fix, 26 Nov 2026); the
    three round controls keep their 32px and never shrink */
 'body .is-hero.mxq-compact .mira-composer-actions>.inline-block,body .is-hero.mxq-compact .mira-effort-pill,body .is-hero.mxq-compact .mxq-mic,body .is-hero.mxq-compact .mira-submit{flex:0 0 32px;width:32px;height:32px}'+
 'body .is-hero.mxq-compact.mxq-multi .mira-composer-box{align-items:flex-end;padding-bottom:6px}'+
 'body .is-hero.mxq-compact .mira-composer-actions{display:contents}'+
 'body .is-hero.mxq-compact .mira-composer-input{order:1;align-self:center;height:var(--mxq-h,36px)!important;min-height:0!important;max-height:160px;padding:7px 4px;overflow-y:auto!important}'+
 'body .is-hero.mxq-compact .mira-composer-actions>.inline-block{order:0;margin:0}'+
 'body .is-hero.mxq-compact .mira-effort-pill{order:2;justify-content:center;font-size:0;gap:0;width:32px;padding:0;height:32px;margin:0}'+
 'body .is-hero.mxq-compact .mira-composer-spacer,body .is-hero.mxq-compact .mira-composer-hint{display:none}'+
 'body .is-hero.mxq-compact .mxq-mic{order:3;margin:0}body .is-hero.mxq-compact .mira-submit{order:4;margin:0}';
