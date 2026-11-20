
/* ── UI visualization · Artifact view (Module Work › Mira AI › UI visualization, 20 Nov 2026) ─────────────────────────
   Mira answers a "show me" question with a visualization. The thread gets a card (the product's runbook-card shell:
   icon, title, chips, a thumbnail, Open / Add to dashboard), and the visualization itself opens in the product's
   right-hand split - the pane the Code button opens - with Preview / Query tabs, chart-type and time-range switches,
   a hover tooltip, a legend that hides series, versions (a follow-up in the composer makes v2, v3 …), expand, copy
   query, download and Add to dashboard. Specimen-only: it lives in the stage driver, not in mira.html.
   Charts are drawn here as SVG on the DS chart-palette tokens, in palette order: the DS ships no chart element
   (the product renders Highcharts), so this is a stand-in for the product's Chart component. Icons are the product's
   own: the step icons are read out of the cloned page, the rest come from observeops-icons via build_stage.py. */
var MXA_ICO=/*MXA_ICONS*/{};
var MXA_C=['--chart-vivid-teal','--chart-tangerine','--chart-neon-purple','--chart-lime-green','--chart-hot-pink','--chart-aqua','--chart-golden-yellow','--chart-electric-coral','--chart-emerald-green','--chart-fuchsia'];
var MXA_R={'15m':{n:15,step:1,lab:'Last 15 minutes'},'1h':{n:60,step:1,lab:'Last hour'},'24h':{n:288,step:5,lab:'Last 24 hours'},'7d':{n:168,step:60,lab:'Last 7 days'}};
var MXA_TYPE={line:'Line chart',area:'Area chart',column:'Column chart',bar:'Bar chart',table:'Table',board:'Dashboard'};
var MXA_NOW=new Date(2026,10,20,14,30);
function mxaRng(s){ return function(){ s|=0; s=s+0x6D2B79F5|0; var t=Math.imul(s^s>>>15,1|s); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function mxaProd(name){ if(!mxaProd.c) mxaProd.c={}; if(mxaProd.c[name]) return mxaProd.c[name];
  var svg=document.querySelector('svg[data-icon="'+name+'"]'); if(!svg) $$('template').some(function(t){ svg=t.content.querySelector('svg[data-icon="'+name+'"]'); return !!svg; });
  return (mxaProd.c[name]=svg?svg.outerHTML:''); }
function mxaT(ago,fmt){ var d=new Date(MXA_NOW.getTime()-ago*60000), p=function(n){ return (n<10?'0':'')+n; }, hm=p(d.getHours())+':'+p(d.getMinutes());
  var dm=d.getDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return fmt==='d'?dm:fmt==='dt'?dm+' '+hm:hm; }

/* ── the three artifacts ── */
var MXA_HOSTS=[{n:'db-prod-02',b:58,a:12,z:8,sp:{at:740,v:94,w:40,every:1440}},{n:'app-prod-01',b:54,a:16,z:9},{n:'web-prod-03',b:44,a:15,z:9},
  {n:'cache-prod-01',b:37,a:6,z:6},{n:'queue-prod-02',b:30,a:9,z:12,sp:{at:200,v:71,w:20}}];
var MXA_IFS=[['core-sw-01 · Te1/0/1',812,640],['core-sw-01 · Te1/0/2',731,702],['dist-sw-03 · Te1/1/1',602,488],['edge-rtr-01 · Gi0/0/0',540,311],['fw-01 · eth1',497,455],
  ['dist-sw-02 · Te1/1/2',433,390],['srv-sw-04 · Gi1/0/24',388,122],['edge-rtr-02 · Gi0/0/1',301,276],['wan-rtr-01 · Se0/1/0',214,198],['acc-sw-11 · Gi1/0/48',176,64]];
function mxaArt(kind){
  if(kind==='topn') return {kind:'topn',title:'Top 10 interfaces by traffic',metric:'interface.traffic.bps',unit:'Mbps',vers:[{type:'bar',range:'1h'}],cur:0,tab:'preview',off:{}};
  if(kind==='board') return {kind:'board',title:'Payments service health',metric:'payments',unit:'',vers:[{type:'board',range:'24h'}],cur:0,tab:'preview',off:{}};
  return {kind:'ts',title:'CPU utilization · top 5 hosts',metric:'system.cpu.percent',unit:'%',vers:[{type:'line',range:'24h'}],cur:0,tab:'preview',off:{}}; }
function mxaV(A){ return A.vers[A.cur]; }
/* one series per host: a daily curve, noise, and the spikes (db-prod-02's nightly backup at 02:10) */
function mxaHostData(V){ var R=MXA_R[V.range];
  return MXA_HOSTS.map(function(h,hi){ var r=mxaRng(hi*977+R.n*13), v=[], nz=0;
    for(var i=0;i<R.n;i++){ var ago=(R.n-1-i)*R.step, hod=(((14.5*60-ago)%1440)+1440)%1440/60;
      nz=nz*.82+(r()-.5)*h.z*.55; var x=h.b+h.a*Math.sin((hod-8)/24*2*Math.PI)+nz;   /* AR(1) noise: a metric drifts, it does not flicker */
      if(h.sp){ var dd=h.sp.every?Math.abs((((ago-h.sp.at)%h.sp.every)+h.sp.every+h.sp.every/2)%h.sp.every-h.sp.every/2):Math.abs(ago-h.sp.at), w=Math.max(h.sp.w,R.step*1.5);
        dd=Math.max(0,dd-R.step/2); if(dd<w) x=x+(h.sp.v-x)*(1-dd/w); }   /* a point within half a step of the spike carries it: hourly points must not miss it */
      v.push(Math.max(2,Math.min(99,Math.round(x*10)/10))); }
    return {name:h.n,color:MXA_C[hi],v:v}; }); }
function mxaIfData(V){ var k={'15m':.92,'1h':1,'24h':.71}[V.range]||1, r=mxaRng(V.range.length*31);
  return MXA_IFS.map(function(x,i){ return {name:x[0],a:Math.round(x[1]*k*(.94+r()*.12)),b:Math.round(x[2]*k*(.94+r()*.12))}; }).sort(function(p,q){ return (q.a+q.b)-(p.a+p.b); }); }
function mxaStat(S){ var all=[],pk={v:-1}; S.forEach(function(s){ s.v.forEach(function(x,i){ all.push(x); if(x>pk.v) pk={v:x,s:s.name,i:i}; }); });
  return {avg:all.reduce(function(a,b){ return a+b; },0)/all.length,pk:pk,over:S.filter(function(s){ return Math.max.apply(null,s.v)>=85; }).length}; }

/* ── charts ── */
function mxaNice(m){ var p=Math.pow(10,Math.floor(Math.log10(m))), f=m/p; var st=[1,1.2,1.5,2,2.5,3,4,5,6,8,10]; for(var i=0;i<st.length;i++) if(f<=st[i]) return st[i]*p; return 10*p; }
/* time series: line / area / column; o = {unit, max, th (threshold), thl, range, off, anim} */
function mxaTS(box,S,o){ var W=Math.max(240,box.clientWidth), H=Math.max(150,box.clientHeight), R=MXA_R[o.range], n=S[0].v.length;
  var on=S.filter(function(s,i){ return !(o.off||{})[i]; }), mx=o.max||mxaNice(Math.max.apply(null,on.concat(S.slice(0,1)).map(function(s){ return Math.max.apply(null,s.v); }))*1.08);
  var L=o.unit==='%'?36:46, Rm=10, T=10, B=22, iw=W-L-Rm, ih=H-T-B, X=function(i){ return L+(n<2?0:i/(n-1)*iw); }, Y=function(v){ return T+ih-v/mx*ih; };
  var h='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Chart')+'">';
  for(var g=0;g<=4;g++){ var gv=mx*g/4, gy=Y(gv); h+='<line class="mxa-grid" x1="'+L+'" x2="'+(W-Rm)+'" y1="'+gy+'" y2="'+gy+'"/><text x="'+(L-6)+'" y="'+(gy+3.5)+'" text-anchor="end">'+(Math.round(gv*10)/10)+(o.unit==='%'?'%':'')+'</text>'; }
  var tk=6; for(var t=0;t<tk;t++){ var ti=Math.round(t/(tk-1)*(n-1)), ago=(n-1-ti)*R.step; h+='<text x="'+X(ti)+'" y="'+(H-6)+'" text-anchor="'+(t===0?'start':t===tk-1?'end':'middle')+'">'+mxaT(ago,o.range==='7d'?'d':'')+'</text>'; }
  if(o.th) h+='<line class="mxa-th" x1="'+L+'" x2="'+(W-Rm)+'" y1="'+Y(o.th)+'" y2="'+Y(o.th)+'"/><text class="mxa-thl" x="'+(L+6)+'" y="'+(Y(o.th)-5)+'">'+esc(o.thl||'')+'</text>';
  if(o.type==='column'){ var bk=o.range==='7d'?7:o.range==='1h'?12:o.range==='15m'?5:24, per=n/bk, gw=iw/bk, bw=Math.max(1.5,(gw*.74)/Math.max(1,on.length));
    for(var b=0;b<bk;b++){ var j=0; S.forEach(function(s,si){ if((o.off||{})[si]) return; var sl=s.v.slice(Math.round(b*per),Math.round((b+1)*per)), av=sl.reduce(function(a,c){ return a+c; },0)/sl.length, x=L+b*gw+gw*.13+j*bw; j++;
        h+='<rect class="'+(o.anim?'mxa-growy':'')+'" style="fill:var('+s.color+');animation-delay:'+(b*22)+'ms" x="'+x.toFixed(1)+'" y="'+Y(av).toFixed(1)+'" width="'+(bw-.6).toFixed(1)+'" height="'+(T+ih-Y(av)).toFixed(1)+'" rx="1"/>'; }); } }
  else S.forEach(function(s,si){ if((o.off||{})[si]) return; var d=s.v.map(function(v,i){ return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1); }).join('');
    if(o.type==='area') h+='<path class="mxa-ar'+(o.anim?' mxa-fade':'')+'" style="fill:var('+s.color+')" d="'+d+'L'+X(n-1).toFixed(1)+' '+(T+ih)+'L'+L+' '+(T+ih)+'Z"/>';
    h+='<path class="mxa-ln'+(o.anim?' mxa-draw':'')+'" pathLength="1" style="stroke:var('+s.color+')" d="'+d+'"/>'; });
  h+='<line class="mxa-cross" x1="0" x2="0" y1="'+T+'" y2="'+(T+ih)+'" hidden/><g class="mxa-dots"></g><rect class="mxa-hit" x="'+L+'" y="'+T+'" width="'+iw+'" height="'+ih+'" fill="transparent"/></svg><div class="mxa-tip" hidden></div>';
  box.innerHTML=h;
  var svg=$('svg',box), cr=$('.mxa-cross',box), dots=$('.mxa-dots',box), tip=$('.mxa-tip',box);
  $('.mxa-hit',box).addEventListener('mousemove',function(e){ var rc=svg.getBoundingClientRect(), mx0=(e.clientX-rc.left)*W/rc.width, i=Math.max(0,Math.min(n-1,Math.round((mx0-L)/iw*(n-1)))), x=X(i);
    cr.removeAttribute('hidden'); cr.setAttribute('x1',x); cr.setAttribute('x2',x);
    var rows=S.map(function(s,si){ return {s:s,si:si,v:s.v[i]}; }).filter(function(r){ return !(o.off||{})[r.si]; }).sort(function(p,q){ return q.v-p.v; });
    dots.innerHTML=o.type==='column'?'':rows.map(function(r){ return '<circle r="3.2" cx="'+x+'" cy="'+Y(r.v)+'" style="fill:var('+r.s.color+')"/>'; }).join('');
    tip.innerHTML='<div class="t">'+mxaT((n-1-i)*R.step,o.range==='7d'?'dt':'')+'</div>'+rows.map(function(r){ return '<div class="r"><i class="mxa-dot" style="background:var('+r.s.color+')"></i><span>'+esc(r.s.name)+'</span><b>'+r.v+(o.unit==='%'?'%':' '+o.unit)+'</b></div>'; }).join('');
    tip.hidden=false; var px=x*rc.width/W, tw=tip.offsetWidth; tip.style.left=(px+14+tw>rc.width?px-14-tw:px+14)+'px'; tip.style.top='8px'; });
  $('.mxa-hit',box).addEventListener('mouseleave',function(){ cr.setAttribute('hidden',''); dots.innerHTML=''; tip.hidden=true; }); }
/* ranked bars: one row per item, in + out stacked (the DS: many/long labels -> horizontal bar) */
function mxaBars(box,rows,o){ var mx=Math.max.apply(null,rows.map(function(r){ return r.a+(r.b||0); }));
  box.innerHTML='<div class="mxa-bars">'+rows.map(function(r,i){ var tot=r.a+(r.b||0);
    return '<div class="mxa-br" title="'+esc(r.name)+'"><span class="nm">'+esc(r.name)+'</span><span class="tr"><span class="in'+(o.anim?' mxa-grow':'')+'" style="width:'+(tot/mx*100).toFixed(1)+'%;animation-delay:'+(i*45)+'ms">'+
      '<i style="flex:'+r.a+';background:var('+MXA_C[0]+')"></i>'+(r.b?'<i style="flex:'+r.b+';background:var('+MXA_C[1]+')"></i>':'')+'</span></span><b>'+tot.toLocaleString('en-US')+' '+o.unit+'</b></div>'; }).join('')+'</div>'+
    (o.keys?'<div class="mxa-keys">'+o.keys.map(function(k,i){ return '<span><i class="mxa-dot" style="background:var('+MXA_C[i]+')"></i>'+k+'</span>'; }).join('')+'</div>':''); }

/* ── the panel body per kind ── */
function mxaBody(p,anim){ var A=p.__A, V=mxaV(A), body=$('.mxa-body',p); body.classList.toggle('is-q',A.tab==='query'); p.__sz=[body.clientWidth,body.clientHeight];
  if(A.tab==='query'){ body.innerHTML='<div class="mira-code-pane-body mxa-q" data-v-b5ea321c="">'+mxaQuery(A,V).split('\n').map(function(l,i){
      return '<div class="mira-code-pane-line" data-v-b5ea321c=""><span class="mira-code-pane-n" data-v-b5ea321c="">'+(i+1)+'</span><code class="mira-code-pane-code" data-v-b5ea321c="">'+
        esc(l).replace(/(&quot;[^&]*?&quot;)(\s*:)?/g,function(m,s,c){ return '<span class="'+(c?'mxa-k':'mxa-s')+'">'+s+'</span>'+(c||''); }).replace(/(:\s*)(-?\d[\d.]*)/g,'$1<span class="mxa-n">$2</span>')+'</code></div>'; }).join('')+'</div>'; return; }
  if(A.kind==='ts'){ var S=mxaHostData(V), st=mxaStat(S.filter(function(s,i){ return !A.off[i]; }).length?S.filter(function(s,i){ return !A.off[i]; }):S), R=MXA_R[V.range];
    body.innerHTML='<div class="mxa-stats"><div class="mxa-stat"><div class="k">Average</div><div class="v">'+st.avg.toFixed(1)+'%</div></div>'+
      '<div class="mxa-stat"><div class="k">Peak</div><div class="v">'+st.pk.v+'%</div><div class="s">'+esc(st.pk.s)+' · '+mxaT((R.n-1-st.pk.i)*R.step,V.range==='7d'?'dt':'')+'</div></div>'+
      '<div class="mxa-stat"><div class="k">Over the 85% threshold</div><div class="v">'+st.over+' of '+S.length+'</div></div></div><div class="mxa-chart"></div>'+
      '<table class="mxa-legt"><thead><tr><th>Host</th><th>Avg</th><th>Max</th><th>Last</th></tr></thead><tbody>'+S.map(function(s,i){ var av=s.v.reduce(function(a,b){ return a+b; },0)/s.v.length;
        return '<tr data-mxa="leg" data-i="'+i+'" class="'+(A.off[i]?'is-off':'')+'" title="'+(A.off[i]?'Show':'Hide')+' '+esc(s.name)+'"><td><i class="mxa-dot" style="background:var('+s.color+')"></i>'+esc(s.name)+'</td><td>'+av.toFixed(1)+'%</td><td>'+Math.max.apply(null,s.v).toFixed(1)+'%</td><td>'+s.v[s.v.length-1].toFixed(1)+'%</td></tr>'; }).join('')+'</tbody></table>';
    mxaTS($('.mxa-chart',body),S,{type:V.type,range:V.range,unit:'%',max:100,th:85,thl:'Warning 85%',off:A.off,anim:anim,label:A.title}); return; }
  if(A.kind==='topn'){ var rows=mxaIfData(V);
    if(V.type==='table'){ body.innerHTML='<table class="mxa-legt is-tbl"><thead><tr><th>Interface</th><th>In</th><th>Out</th><th>Total</th></tr></thead><tbody>'+rows.map(function(r){
        return '<tr><td>'+esc(r.name)+'</td><td>'+r.a+' Mbps</td><td>'+r.b+' Mbps</td><td>'+(r.a+r.b).toLocaleString('en-US')+' Mbps</td></tr>'; }).join('')+'</tbody></table>'; return; }
    var tot=rows.reduce(function(a,r){ return a+r.a+r.b; },0);
    body.innerHTML='<div class="mxa-stats"><div class="mxa-stat"><div class="k">Busiest</div><div class="v">'+(rows[0].a+rows[0].b).toLocaleString('en-US')+' Mbps</div><div class="s">'+esc(rows[0].name)+'</div></div>'+
      '<div class="mxa-stat"><div class="k">Top 10 total</div><div class="v">'+(tot/1000).toFixed(2)+' Gbps</div></div></div><div class="mxa-chart is-bars"></div>';
    mxaBars($('.mxa-chart',body),rows,{unit:'Mbps',anim:anim,keys:['In','Out']}); return; }
  /* board: KPI tiles, then three widgets */
  var r=mxaRng(V.range.length*7), R2=MXA_R[V.range], lat=[]; for(var i=0;i<R2.n;i++){ var ago=(R2.n-1-i)*R2.step, hod=(((14.5*60-ago)%1440)+1440)%1440/60;
    lat.push(Math.round(240+60*Math.sin((hod-9)/24*2*Math.PI)+(r()-.5)*40+(Math.abs(ago-95)<Math.max(25,R2.step*1.5)?190:0))); }
  var K=[['Availability','99.94%','clear','+0.02 vs last period'],['p95 latency',Math.max.apply(null,lat.slice(-12))+' ms','warning','Above the 300 ms target'],['Error rate','0.42%','clear','-0.08 vs last period'],['Active alerts','3','critical','1 critical · 1 major · 1 warning']];
  var EP=[['POST /api/v2/payments',412],['POST /api/v2/refunds',366],['GET /api/v2/payments/{id}',214],['POST /api/v2/auth/token',181],['GET /api/v2/health',22]];
  var AL=[['critical','Response time breach on POST /api/v2/payments','payments-api-02 · 12 min ago'],['major','Database connection pool at 92%','db-prod-02 · 41 min ago'],['warning','GC pause over 400 ms','payments-api-01 · 1 h ago']];
  body.innerHTML='<div class="mxa-kpis">'+K.map(function(k){ return '<div class="mxa-kpi"><div class="k">'+k[0]+'</div><div class="v">'+k[1]+'</div><div class="d"><i class="mxa-sev" style="background:var(--severity-'+k[2]+')"></i>'+k[3]+'</div></div>'; }).join('')+'</div>'+
    '<div class="mxa-wg"><section class="mxa-w is-wide"><h4>p95 latency · payments-api</h4><div class="mxa-chart" data-w="lat"></div></section>'+
    '<section class="mxa-w"><h4>Slowest endpoints · p95</h4><div class="mxa-chart is-bars" data-w="ep"></div></section>'+
    '<section class="mxa-w"><h4>Active alerts</h4><ul class="mxa-al">'+AL.map(function(a){ return '<li><i class="mxa-sev" style="background:var(--severity-'+a[0]+')"></i><div><div>'+esc(a[1])+'</div><div class="s">'+esc(a[2])+'</div></div></li>'; }).join('')+'</ul></section></div>';
  mxaTS($('[data-w=lat]',body),[{name:'p95',color:MXA_C[0],v:lat}],{type:'area',range:V.range,unit:'ms',th:300,thl:'Target 300 ms',anim:anim,label:'p95 latency'});
  mxaBars($('[data-w=ep]',body),EP.map(function(e){ return {name:e[0],a:e[1]}; }),{unit:'ms',anim:anim}); }
function mxaQuery(A,V){ var q;
  if(A.kind==='ts') q={widget:A.title,visualization:V.type,timeline:MXA_R[V.range].lab.toLowerCase(),datasource:'metric',metric:A.metric,aggregation:'avg',granularity:V.range==='7d'?'1h':V.range==='24h'?'5m':'1m',group_by:'monitor',top:5,order:'desc',threshold:{warning:85}};
  else if(A.kind==='topn') q={widget:A.title,visualization:V.type==='table'?'grid':'top-n bar',timeline:MXA_R[V.range].lab.toLowerCase(),datasource:'metric',metric:['interface.in.traffic.bps','interface.out.traffic.bps'],aggregation:'avg',group_by:'interface',top:10,order:'desc'};
  else q={dashboard:A.title,timeline:MXA_R[V.range].lab.toLowerCase(),scope:{service:'payments',monitors:6},widgets:[{type:'kpi',metrics:['availability','latency.p95','error.rate','alerts.active']},{type:'area',metric:'latency.p95',target_ms:300},{type:'top-n bar',metric:'endpoint.latency.p95',top:5},{type:'alert list',status:'active'}]};
  return JSON.stringify(q,null,2); }

/* ── the panel: the Code pane's own head, then the bar, the body and a foot ── */
function mxaKid(head,el){ while(el&&el.parentNode!==head) el=el.parentNode; return el||null; }
function mxaHeadBtn(proto,act,label,icon){ var w=proto.cloneNode(true), b=$('button',w); b.setAttribute('aria-label',label); b.title=label; b.setAttribute('data-mxa',act); b.removeAttribute('data-testid'); $('.anticon',b).innerHTML=icon; return w; }
function mxaPaint(p,anim){ var A=p.__A, V=mxaV(A), sec=$('.mxa-sec',p);
  if(!sec){ sec=document.createElement('section'); sec.className='mira-code-pane mxa-sec'; sec.setAttribute('data-v-b5ea321c',''); p.appendChild(sec);
    var head=$('.mira-code-pane-head',tpl('code-c1-0').content).cloneNode(true), cp=mxaKid(head,$('[aria-label="Copy code"]',head)), cl=mxaKid(head,$('[aria-label="Close"]',head));
    var ic=document.createElement('span'); ic.className='mxa-hic'; ic.innerHTML=MXA_ICO.chart||''; head.insertBefore(ic,head.firstChild);
    var cpb=$('button',cp); cpb.setAttribute('aria-label','Copy query'); cpb.title='Copy query'; cpb.setAttribute('data-mxa','copyq'); cpb.removeAttribute('data-testid');
    var ver=document.createElement('span'); ver.className='mxa-ver'; head.insertBefore(ver,cp);
    head.insertBefore(mxaHeadBtn(cp,'full','Expand',MXA_ICO.full||''),cl);
    sec.appendChild(head);
    var bar=document.createElement('div'); bar.className='mxa-bar'; sec.appendChild(bar);
    var body=document.createElement('div'); body.className='mxa-body'; sec.appendChild(body);
    var foot=document.createElement('div'); foot.className='mxa-foot';
    foot.innerHTML='<span class="mxa-src"></span><button type="button" class="mxa-btn" data-mxa="png">'+(MXA_ICO.down||'')+'Download</button><button type="button" class="mxa-btn is-primary" data-mxa="dash">'+(MXA_ICO.dash||'')+'<span></span></button>';
    sec.appendChild(foot);
    try{ p.__ro=new ResizeObserver(function(){ var b=$('.mxa-body',p); if(!b||!p.__sz) return; if(Math.abs(b.clientWidth-p.__sz[0])>2||Math.abs(b.clientHeight-p.__sz[1])>2){ cancelAnimationFrame(p.__raf); p.__raf=requestAnimationFrame(function(){ mxaBody(p,false); }); } }); p.__ro.observe(body); }catch(e){} }
  $('.mira-code-pane-name',sec).textContent=A.title; $('.mira-code-pane-name',sec).title=A.title;
  $('.mira-code-pane-ext',sec).textContent=' · v'+(A.cur+1)+' · '+MXA_TYPE[V.type];
  var vn=$('.mxa-ver',sec), cv=MXA_ICO.chev||'';
  vn.innerHTML=A.vers.length>1?'<button type="button" data-mxa="vprev" aria-label="Previous version" title="Previous version" class="is-l"'+(A.cur?'':' disabled')+'>'+cv+'</button><span>v'+(A.cur+1)+' of '+A.vers.length+'</span><button type="button" data-mxa="vnext" aria-label="Next version" title="Next version"'+(A.cur<A.vers.length-1?'':' disabled')+'>'+cv+'</button>':'';
  var full=$('[data-mxa="full"]',sec), isF=$('.mira-split').classList.contains('mxa-full'); full.title=isF?'Back to the chat':'Expand'; full.setAttribute('aria-label',full.title); $('.anticon',full).innerHTML=isF?(MXA_ICO.shrink||''):(MXA_ICO.full||'');
  var types=A.kind==='ts'?['line','area','column']:A.kind==='topn'?['bar','table']:[], ranges=A.kind==='topn'?['15m','1h','24h']:['1h','24h','7d'];
  $('.mxa-bar',sec).innerHTML='<div class="mxa-tabs" role="tablist"><button type="button" role="tab" data-mxa="tab" data-t="preview" aria-selected="'+(A.tab==='preview')+'" class="'+(A.tab==='preview'?'on':'')+'">Preview</button><button type="button" role="tab" data-mxa="tab" data-t="query" aria-selected="'+(A.tab==='query')+'" class="'+(A.tab==='query'?'on':'')+'">Query</button></div>'+
    (types.length?'<span class="mxa-seg" aria-label="Chart type">'+types.map(function(t){ return '<button type="button" data-mxa="type" data-t="'+t+'" class="'+(V.type===t?'on':'')+'">'+MXA_TYPE[t].replace(' chart','')+'</button>'; }).join('')+'</span>':'')+
    '<span class="mxa-seg" aria-label="Time range">'+ranges.map(function(t){ return '<button type="button" data-mxa="range" data-t="'+t+'" class="'+(V.range===t?'on':'')+'">'+t+'</button>'; }).join('')+'</span>';
  $('.mxa-src',sec).textContent=(A.kind==='board'?'6 monitors · ':'Live metrics · ')+MXA_R[V.range].lab+' · generated by Mira at 14:30';
  $('[data-mxa="dash"] span',sec).textContent=A.kind==='board'?'Save as dashboard':'Add to dashboard';
  mxaBody(p,anim);
  $$('.mxa-card').forEach(function(c){ c.classList.toggle('is-active',c.__A===A&&c.__ver===A.cur); }); }
function mxaOpen(A,ver){ var sp=$('.mira-split'); if(!sp) return; var p=$('.mxa-pane',sp), fresh=!p;
  if(ver!=null) A.cur=ver;
  if(fresh){ var as=$('aside.mira-sidebar'); if(as&&!as.classList.contains('is-collapsed')&&sp.clientWidth<820) sideTog();   /* too narrow for sidebar + chat + pane: the sidebar folds to its rail, as Claude's does */
    closeCode(); var s=document.createElement('div'); s.className='splitpanes__splitter'; s.setAttribute('data-v-44a5716c','');
    p=document.createElement('div'); p.className='splitpanes__pane mira-pane is-preview mxa-pane mxa-in'; p.setAttribute('data-v-44a5716c','');
    sp.classList.toggle('mxa-full',sp.clientWidth<760); $('#mxPane').style.width='40%'; p.style.width='60%'; sp.appendChild(s); sp.appendChild(p); }
  else if(p.__A!==A){ p.innerHTML=''; if(p.__ro) p.__ro.disconnect(); }
  p.__A=A; mxaPaint(p,true); }

/* ── the thread: Mira's message (a real assistant turn, its thinking steps rewritten) and the card ── */
function mxaMsg(steps,html){ var m=$('.mira-thread-list',tpl('c4').content).children[1].cloneNode(true), parts=$('.mira-message-parts',m), g=$('.mira-activity-group',parts);
  var md=$$('.mira-md',parts).filter(function(x){ return !x.closest('.mira-group-fold'); })[0];
  [].slice.call(parts.children).forEach(function(c){ if(c!==g&&c!==md) c.remove(); });
  var all=$$('.mira-group-step',g), proto=all.filter(function(s){ return !$('.mira-step-row.is-static',s); })[0], box=proto.parentNode; all.forEach(function(s){ s.remove(); });
  steps.forEach(function(s){ var st=proto.cloneNode(true), row=$('.mira-step-row',st); $('.mira-step-title',row).textContent=s[0];
    var dt=$('.mira-step-detail',row); if(dt) dt.textContent=s[1]; var ic=$('.mira-step-icon',row), sv=mxaProd(s[2]); if(ic&&sv) ic.innerHTML=sv;
    var bd=$('.mira-tool-body',st); if(bd) bd.innerHTML='<section><div class="mxa-sb">'+esc(s[3])+'</div></section>'; box.appendChild(st); });
  $('.mira-group-title',g).textContent=' '+sumTitle($$('.mira-group-step',g))+' '; md.innerHTML=html; return {m:m,g:g,md:md,parts:parts}; }
function mxaSpark(A,V){ var W=96,H=36;
  if(A.kind==='topn'){ var rs=mxaIfData(V).slice(0,5), mx=rs[0].a+rs[0].b; return '<svg viewBox="0 0 '+W+' '+H+'">'+rs.map(function(r,i){ return '<rect x="0" y="'+(i*7.4)+'" height="5" rx="1" width="'+((r.a+r.b)/mx*W).toFixed(1)+'" style="fill:var('+MXA_C[0]+');opacity:'+(1-i*.14)+'"/>'; }).join('')+'</svg>'; }
  if(A.kind==='board') return '<svg viewBox="0 0 '+W+' '+H+'"><rect class="mxa-tl" x="0" y="0" width="21" height="12" rx="2"/><rect class="mxa-tl" x="25" y="0" width="21" height="12" rx="2"/><rect class="mxa-tl" x="50" y="0" width="21" height="12" rx="2"/><rect class="mxa-tl" x="75" y="0" width="21" height="12" rx="2"/><path d="M0 33 L14 27 L28 30 L42 21 L56 25 L70 17 L96 22" style="fill:none;stroke:var('+MXA_C[0]+');stroke-width:1.6"/></svg>';
  var S=mxaHostData(V), n=S[0].v.length; return '<svg viewBox="0 0 '+W+' '+H+'">'+S.slice(0,3).map(function(s){ return '<path d="'+s.v.filter(function(x,i){ return i%Math.ceil(n/40)===0; }).map(function(v,i,a){ return (i?'L':'M')+(i/(a.length-1)*W).toFixed(1)+' '+(H-2-v/100*(H-4)).toFixed(1); }).join('')+'" style="fill:'+(V.type==='area'?'none':'none')+';stroke:var('+s.color+');stroke-width:1.3"/>'; }).join('')+'</svg>'; }
function mxaCard(A,ver){ var V=A.vers[ver], c=document.createElement('div'); c.className='mira-forge is-compact mxa-card'; c.setAttribute('data-v-782110ee','');
  var chips=[MXA_TYPE[V.type],MXA_R[V.range].lab,A.kind==='ts'?'5 hosts':A.kind==='topn'?'10 interfaces':'4 widgets'];
  c.innerHTML='<div class="mira-forge-head" data-v-782110ee=""><div class="mira-forge-icon" data-v-782110ee="">'+(A.kind==='board'?MXA_ICO.dash:MXA_ICO.chart)+'</div><div class="mira-forge-heading" data-v-782110ee=""><p class="mira-forge-title" data-v-782110ee="">'+esc(A.title)+'</p>'+
    '<div class="mira-forge-chips" data-v-782110ee="">'+chips.map(function(x){ return '<span class="mira-forge-chip" data-v-782110ee="">'+esc(x)+'</span>'; }).join('')+'<span class="mira-forge-tag" data-v-782110ee="">v'+(ver+1)+'</span></div></div>'+
    '<button type="button" class="mxa-thumb" data-mxa="open" aria-label="Open '+esc(A.title)+'">'+mxaSpark(A,V)+'</button></div>'+
    '<div class="mira-forge-foot" data-v-782110ee=""><button type="button" class="mira-forge-button ant-btn" data-v-782110ee="" data-mxa="open">Open</button><button type="button" class="mira-forge-button ant-btn" data-v-782110ee="" data-mxa="dash">'+(A.kind==='board'?'Save as dashboard':'Add to dashboard')+'</button></div>';
  c.__A=A; c.__ver=ver; return c; }

var MXA_CHAT={
  ts:{title:'CPU utilization of top hosts',q:'Show CPU utilization for the top 5 hosts over the last 24 hours',
    steps:[['Thought','choosing the chart','brain','A trend over time for a handful of hosts: a line chart, one series per host, with the 85% warning threshold drawn in.'],
      ['Monitor search','top 5 by average CPU · 24h','search','Ranked 214 Linux and Windows monitors by average CPU over the last 24 hours and kept the top 5.'],
      ['Metric query','system.cpu.percent · 5-minute points','database','5 series, 288 points each, averaged per 5 minutes.'],
      ['Visualization','line chart · v1','chart','Built the chart and opened it beside the chat.']],
    md:'<p>Here is CPU utilization for the five busiest hosts over the last 24 hours. <strong>db-prod-02</strong> is the one to look at: it peaked at <strong>94%</strong> at 02:10, in the nightly backup window, and it is the only host that crossed the 85% warning threshold.</p><p>The chart is open on the right. Switch it to an area or column view, change the time range, or add it to a dashboard. To change what it shows, just ask.</p>'},
  topn:{title:'Top interfaces by traffic',q:'Which 10 interfaces carried the most traffic in the last hour?',
    steps:[['Thought','ranking interfaces','brain','A ranking with long names reads best as horizontal bars, in and out stacked.'],
      ['Interface search','top 10 by total traffic · 1h','search','Ranked 1,326 interfaces on 88 network devices by in + out traffic over the last hour.'],
      ['Metric query','interface.in / out.traffic.bps','database','Averaged over the hour, converted to Mbps.'],
      ['Visualization','bar chart · v1','chart','Built the ranking and opened it beside the chat.']],
    md:'<p>The two <strong>core-sw-01</strong> uplinks carry the most traffic: together about 2.9 Gbps over the last hour, both well inside their 10 Gbps capacity. <strong>srv-sw-04 · Gi1/0/24</strong> is the odd one out: three quarters of its traffic is inbound.</p><p>The ranking is open on the right, as bars or as a table.</p>'},
  board:{title:'Payments service health',q:'Build a health view for the payments service',
    steps:[['Thought','planning the view','brain','A service health view: headline numbers first, then latency over time, the slowest endpoints and what is alerting.'],
      ['Service lookup','payments · 6 monitors','search','Found 6 monitors tagged service:payments: 3 API hosts, 2 databases and a load balancer.'],
      ['Metric query','availability, p95 latency, errors','database','24 hours of availability, p95 latency per endpoint and error rate.'],
      ['Alert search','3 active','search','1 critical, 1 major and 1 warning alert on the service right now.'],
      ['Visualization','dashboard · 4 widgets','chart','Built the view and opened it beside the chat.']],
    md:'<p>Here is a health view for <strong>payments</strong>. The service is up (99.94%), but p95 latency is above the 300 ms target and <strong>POST /api/v2/payments</strong> is the slowest endpoint. It is also the subject of the one critical alert.</p><p>The view is open on the right. Save it as a dashboard to keep it.</p>'}
};
function mxaStatic(o,A,ver){ var P={pane:$('#mxPane').firstElementChild}; addMsg(P,o.m); [].slice.call(o.parts.children).forEach(function(k){ k.classList.remove('mx-hide'); });
  o.parts.appendChild(mxaCard(A,ver)); actShow(o.m); }
/* a follow-up in the composer edits the open artifact and makes the next version */
function mxaFollow(pane,q){ var A=pane.__mxa; if(!A||MX.busy) return; var ta=$('.mira-composer-input',pane); if(ta){ ta.value=''; grow(ta); }
  var V=mxaV(A), N={type:V.type,range:V.range}, s=q.toLowerCase();
  if(A.kind==='ts'){ if(/area/.test(s)) N.type='area'; else if(/column|bar/.test(s)) N.type='column'; else if(/line/.test(s)) N.type='line'; }
  if(A.kind==='topn'&&/table|grid/.test(s)) N.type='table'; else if(A.kind==='topn'&&/bar/.test(s)) N.type='bar';
  if(/7\s*d|week|7 days|seven days/.test(s)&&A.kind!=='topn') N.range='7d'; else if(/24\s*h|day/.test(s)) N.range='24h'; else if(/1\s*h|hour/.test(s)) N.range='1h'; else if(/15/.test(s)&&A.kind==='topn') N.range='15m';
  if(N.type===V.type&&N.range===V.range){ if(A.kind==='ts') N.type=V.type==='area'?'line':'area'; else if(A.kind==='topn') N.type=V.type==='bar'?'table':'bar'; else N.range=V.range==='7d'?'24h':'7d'; }
  A.vers.push(N); var ver=A.vers.length-1;
  var tn=MXA_TYPE[N.type].toLowerCase(), what=[N.type!==V.type?'as '+(/^[aeiou]/.test(tn)?'an ':'a ')+tn:'',N.range!==V.range?'over the '+MXA_R[N.range].lab.toLowerCase():''].filter(Boolean).join(', ');
  var note=A.kind==='ts'&&N.range==='7d'?' Over the week, db-prod-02 climbs past 90% every night at about 02:00. That is the backup job, not a one-off.':'';
  var o=mxaMsg([['Thought','reading the change','brain','Kept the same data and changed only what was asked.'],['Visualization',MXA_TYPE[N.type].toLowerCase()+' · v'+(ver+1),'chart','Saved as version '+(ver+1)+'. Version '+ver+' is still there.']],
    '<p>Updated. Version '+(ver+1)+' shows the same data '+(what||'with your change')+'.'+note+'</p>');
  userMsg(pane,q); toBottom();
  seg(pane,async function(P){ var k=addMsg(P,o.m); await liveFor(P,o.m,'Working on your request',900,true); await playGroup(o.g,P); await reveal(P,o.md,300); wordFade(o.md);
    var c=mxaCard(A,ver); c.classList.add('mira-rise-in'); o.parts.appendChild(c); P.bottom(); await P.wait(350); mxaOpen(A,ver); actShow(o.m); setTimeout(toBottom,60); }); }

var MXA_CSS='.mxa-pane{display:flex;min-width:0;min-height:0}.mxa-pane.mxa-in{animation:mxaIn .34s cubic-bezier(.2,.7,.2,1)}@keyframes mxaIn{from{opacity:0;transform:translateX(28px)}}'+
 '.mira-split.mxa-full:has(.mxa-pane) #mxPane,.mira-split.mxa-full:has(.mxa-pane) .splitpanes__splitter{display:none!important}.mira-split.mxa-full .mxa-pane{width:100%!important}'+
 '.mxa-sec{height:100%}.mxa-sec .mira-code-pane-head{gap:4px}.mxa-hic{display:flex;width:16px;height:16px;margin-right:6px;color:var(--mira-name)}.mxa-hic svg{width:16px;height:16px}'+
 '.mxa-ver{display:inline-flex;align-items:center;gap:2px;margin-right:6px;font:500 11.5px var(--font-mono);color:var(--mira-text-muted);white-space:nowrap}.mxa-ver:empty{display:none}'+
 '.mxa-ver button{display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:none;color:var(--mira-text-toned);cursor:pointer}.mxa-ver button:hover:not(:disabled){background:var(--mira-row-hover)}.mxa-ver button:disabled{opacity:.35;cursor:default}.mxa-ver svg{width:12px;height:12px}.mxa-ver .is-l svg{transform:scaleX(-1)}'+
 '.mxa-bar{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;padding:8px 12px 8px 14px;border-bottom:1px solid var(--mira-border)}.mxa-tabs{display:flex;gap:2px;margin-right:auto}'+
 '.mxa-tabs button{height:28px;padding:0 11px;border:0;border-radius:7px;background:none;color:var(--mira-text-muted);font-size:12.5px;font-weight:500;cursor:pointer}.mxa-tabs button:hover{color:var(--mira-text-strong)}.mxa-tabs button.on{background:var(--mira-row-on);color:var(--mira-text-strong)}'+
 '.mxa-seg{display:inline-flex;gap:2px;padding:2px;border:1px solid var(--mira-border);border-radius:8px}.mxa-seg button{height:24px;padding:0 9px;border:0;border-radius:6px;background:none;color:var(--mira-text-muted);font-size:12px;cursor:pointer;white-space:nowrap}.mxa-seg button:hover{color:var(--mira-text-strong)}.mxa-seg button.on{background:var(--mira-surface-accented);color:var(--mira-text-strong);font-weight:500}'+
 '.mxa-body{flex:1 1 auto;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:16px}.mxa-body.is-q{padding:0}.mxa-body.is-q .mxa-q{flex:1 1 auto}'+
 '.mxa-k{color:var(--mira-code-keyword)}.mxa-s{color:var(--mira-json-string)}.mxa-n{color:var(--mira-json-number)}'+
 '.mxa-stats{display:flex;flex-wrap:wrap;gap:8px 32px;flex:0 0 auto}.mxa-stat .k{font-size:11.5px;color:var(--mira-text-muted)}.mxa-stat .v{font:600 19px/1.3 var(--font-mono);color:var(--mira-text-strong)}.mxa-stat .s{font-size:11.5px;color:var(--mira-text-toned)}'+
 '.mxa-chart{position:relative;flex:1 1 auto;min-height:220px}.mxa-chart.is-bars{flex:0 0 auto;min-height:0}.mxa-chart svg{display:block;width:100%;height:100%}'+
 '.mxa-chart text{font-family:var(--font-mono);font-size:10.5px;fill:var(--mira-text-dimmed)}.mxa-grid{stroke:var(--mira-hairline)}.mxa-th{stroke:var(--severity-warning);stroke-dasharray:4 4}.mxa-chart .mxa-thl{fill:var(--severity-warning)}'+
 '.mxa-ln{fill:none;stroke-width:1.75;stroke-linejoin:round;stroke-linecap:round}.mxa-ar{opacity:.13}.mxa-cross{stroke:var(--mira-text-dimmed);stroke-dasharray:2 3}.mxa-dots circle{stroke:var(--mira-surface);stroke-width:1.5}'+
 '.mxa-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:mxaDraw 1.15s cubic-bezier(.3,.6,.2,1) forwards}@keyframes mxaDraw{to{stroke-dashoffset:0}}.mxa-fade{animation:mxaFade .7s .35s both}@keyframes mxaFade{from{opacity:0}}'+
 '.mxa-growy{transform-box:fill-box;transform-origin:50% 100%;animation:mxaGy .6s cubic-bezier(.3,.6,.2,1) both}@keyframes mxaGy{from{transform:scaleY(0)}}.mxa-grow{transform-origin:0 50%;animation:mxaGx .7s cubic-bezier(.3,.6,.2,1) both}@keyframes mxaGx{from{transform:scaleX(0)}}'+
 '.mxa-tip{position:absolute;z-index:3;min-width:160px;padding:8px 10px;border:1px solid var(--mira-border);border-radius:8px;background:var(--mira-menu);box-shadow:var(--mira-menu-shadow);font-size:12px;color:var(--mira-text);pointer-events:none}'+
 '.mxa-tip .t{margin-bottom:5px;font:500 11px var(--font-mono);color:var(--mira-text-muted)}.mxa-tip .r{display:flex;align-items:center;gap:8px;line-height:1.7}.mxa-tip b{margin-left:auto;font:500 12px var(--font-mono);color:var(--mira-text-strong)}'+
 '.mxa-dot{display:inline-block;flex:0 0 8px;width:8px;height:8px;border-radius:2px;margin-right:8px;vertical-align:1px}.mxa-tip .mxa-dot{margin-right:0}'+
 '.mxa-legt{width:100%;flex:0 0 auto;border-collapse:collapse;font-size:12.5px}.mxa-legt th{padding:0 0 6px 12px;font-size:11px;font-weight:500;color:var(--mira-text-muted);text-align:right;border-bottom:1px solid var(--mira-hairline)}.mxa-legt th:first-child,.mxa-legt td:first-child{padding-left:0;text-align:left}'+
 '.mxa-legt td{padding:7px 0 7px 12px;text-align:right;border-bottom:1px solid var(--mira-hairline);font-family:var(--font-mono);font-size:12px;color:var(--mira-text)}.mxa-legt td:first-child{font-family:inherit;font-size:12.5px;color:var(--mira-text-strong)}'+
 '.mxa-legt tr[data-mxa]{cursor:pointer}.mxa-legt tr[data-mxa]:hover td{background:var(--mira-row-hover)}.mxa-legt tr.is-off td{opacity:.4}'+
 '.mxa-bars{display:flex;flex-direction:column;gap:9px}.mxa-br{display:grid;grid-template-columns:minmax(110px,38%) minmax(0,1fr) auto;align-items:center;gap:12px;font-size:12.5px}.mxa-br .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--mira-text-strong)}'+
 '.mxa-br .tr{height:10px;border-radius:3px;background:var(--mira-surface-muted);overflow:hidden}.mxa-br .in{display:flex;height:100%;gap:1px}.mxa-br .in i{display:block;height:100%}.mxa-br b{font:500 12px var(--font-mono);color:var(--mira-text);white-space:nowrap}'+
 '.mxa-keys{display:flex;gap:16px;margin-top:12px;font-size:12px;color:var(--mira-text-toned)}'+
 '.mxa-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:10px;flex:0 0 auto}.mxa-kpi{padding:11px 12px;border:1px solid var(--mira-border);border-radius:10px;background:var(--mira-surface-muted)}'+
 '.mxa-kpi .k{font-size:11.5px;color:var(--mira-text-muted)}.mxa-kpi .v{margin:2px 0;font:600 20px/1.25 var(--font-mono);color:var(--mira-text-strong)}.mxa-kpi .d{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--mira-text-toned)}'+
 '.mxa-sev{display:inline-block;flex:0 0 8px;width:8px;height:8px;border-radius:50%}'+
 '.mxa-wg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;flex:0 0 auto}.mxa-w{display:flex;flex-direction:column;min-width:0;padding:12px;border:1px solid var(--mira-border);border-radius:10px}.mxa-w.is-wide{grid-column:1/-1}'+
 '.mxa-w h4{margin:0 0 10px;font-size:12.5px;font-weight:500;color:var(--mira-text-strong)}.mxa-w .mxa-chart{min-height:170px;height:170px;flex:0 0 auto}.mxa-w .mxa-chart.is-bars{height:auto}'+
 '.mxa-al{margin:0;padding:0;list-style:none}.mxa-al li{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--mira-hairline);font-size:12.5px;color:var(--mira-text-strong)}.mxa-al li:last-child{border-bottom:0}.mxa-al .mxa-sev{margin-top:5px}.mxa-al .s{font-size:11.5px;color:var(--mira-text-muted)}'+
 '.mxa-foot{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:10px 12px 10px 16px;border-top:1px solid var(--mira-border)}.mxa-foot{flex-wrap:nowrap}.mxa-src{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--mira-text-muted)}.mxa-btn{flex:0 0 auto;white-space:nowrap}'+
 '.mxa-btn{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 13px;border:1px solid var(--mira-kbd-edge);border-radius:9px;background:none;color:var(--mira-text-strong);font-size:12.5px;cursor:pointer}.mxa-btn:hover{background:var(--mira-row-on)}.mxa-btn svg{width:14px;height:14px}'+
 '.mxa-btn.is-primary{background:var(--mira-accent);border-color:var(--mira-accent);color:var(--mira-on-accent)}.mxa-btn.is-primary:hover{background:var(--mira-accent);filter:brightness(1.08)}'+
 '.mxa-card{margin-top:4px;container-type:inline-size}@container (max-width:470px){.mxa-thumb{display:none}}.mxa-card .mira-forge-head{flex-wrap:nowrap;padding:14px 16px}.mxa-card .mira-forge-icon svg{width:18px;height:18px}.mxa-card .mira-forge-foot{padding:10px 16px}.mxa-card .mira-forge-foot .mira-forge-button{height:32px;cursor:pointer}'+
 '.mxa-card.is-active{border-color:var(--mira-accent-45)}.mxa-thumb{flex:0 0 112px;height:52px;padding:8px;border:1px solid var(--mira-hairline);border-radius:8px;background:var(--mira-surface-muted);cursor:pointer}.mxa-thumb:hover{border-color:var(--mira-accent-45)}.mxa-thumb svg{display:block;width:100%;height:100%}.mxa-tl{fill:var(--mira-accent-25)}'+
 '.mxa-sb{padding:2px 0 8px 28px;font-size:12.5px;color:var(--mira-text-toned)}'+
 '@media (max-width:520px){.mxa-thumb{display:none}}';

function mxaWire(){ if(mxaWire.on) return; mxaWire.on=1;
  var st=document.createElement('style'); st.id='mxa-css'; st.textContent=MXA_CSS; document.head.appendChild(st);
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-mxa]'); if(!b) return; var a=b.getAttribute('data-mxa'), p=$('.mxa-pane'), card=b.closest('.mxa-card');
    e.preventDefault(); e.stopPropagation();
    if(a==='open'){ mxaOpen(card.__A,card.__ver); return; }
    if(a==='dash'){ var A0=card?card.__A:p&&p.__A; toast(A0&&A0.kind==='board'?'Saved as dashboard · Payments service health':'Added to dashboard · Mira charts'); return; }
    if(a==='png'){ toast('Downloaded '+p.__A.title+'.png'); return; }
    if(a==='copyq'){ copy(mxaQuery(p.__A,mxaV(p.__A)),'Query copied'); return; }
    if(a==='full'){ $('.mira-split').classList.toggle('mxa-full'); mxaPaint(p,false); return; }
    var A=p&&p.__A; if(!A) return; var V=mxaV(A);
    if(a==='tab') A.tab=b.getAttribute('data-t'); else if(a==='type') V.type=b.getAttribute('data-t'); else if(a==='range') V.range=b.getAttribute('data-t');
    else if(a==='leg'){ var i=+b.getAttribute('data-i'); if(A.off[i]) delete A.off[i]; else if(Object.keys(A.off).length<4) A.off[i]=1; }
    else if(a==='vprev'&&A.cur>0) A.cur--; else if(a==='vnext'&&A.cur<A.vers.length-1) A.cur++;
    mxaPaint(p,a!=='tab'&&a!=='leg'); },true);
  /* the composer: in an artifact chat, Enter (or Send) edits the artifact instead of the prototype's canned reply */
  function ours(){ var pane=$('#mxPane').firstElementChild; return pane&&pane.__mxa?pane:null; }
  function hero(e){ if(MX.cur!=='new'||!mxaWire.hero) return false; var ta=$('#mxPane .mira-composer-input'), q=ta&&ta.value.trim(); if(!q) return true; e.preventDefault(); e.stopPropagation(); mxaWire.hero=false; ta.value=''; mxaStart(mxaKind(q),q,true); return true; }
  document.addEventListener('keydown',function(e){ if(e.key!=='Enter'||e.shiftKey||e.isComposing||!e.target.closest('.mira-composer-input')) return; if(hero(e)) return; var pane=ours(); if(!pane) return;
    var q=e.target.value.trim(); e.preventDefault(); e.stopPropagation(); if(q) mxaFollow(pane,q); },true);
  document.addEventListener('click',function(e){ if(!e.target.closest('.mira-submit')) return; if(hero(e)) return; var pane=ours(); if(!pane||MX.busy) return; var ta=$('.mira-composer-input',pane), q=ta&&ta.value.trim(); if(!q) return;
    e.preventDefault(); e.stopPropagation(); mxaFollow(pane,q); },true); }

/* the stage: '' plays the whole thing FROM THE NEW-CHAT HERO (request, 20 Nov 2026: the full Mira page - sidebar, header,
   "What's on your radar, admin?" - not a bare thread); the rest open on one state, filed in the sidebar under Today */
function mxaKind(q){ q=q.toLowerCase(); return /interface|traffic|bandwidth/.test(q)?'topn':/health|service|dashboard|overview/.test(q)?'board':'ts'; }
function mxaStart(kind,q,play){ var A=mxaArt(kind), C=MXA_CHAT[kind], id=fileChat(C.title), pane=MX.panes[id]; show(id);
  var o=mxaMsg(C.steps,C.md); pane.__mxa=A; userMsg(pane,q||C.q);
  var ta=$('.mira-composer-input',pane); if(ta) ta.placeholder=kind==='board'?'Ask Mira to change the view…':'Ask Mira to change the chart…';
  if(play){ toBottom(); seg(pane,async function(P){ var k=addMsg(P,o.m); await liveFor(P,o.m,'Working on your request',1500,true); await playGroup(o.g,P);
      await reveal(P,o.md,200); wordFade(o.md); await P.wait(900); var c=mxaCard(A,0); c.classList.add('mira-rise-in'); o.parts.appendChild(c); P.bottom(); await P.wait(600); mxaOpen(A,0); actShow(o.m); setTimeout(toBottom,60); }); }
  return {A:A,o:o,pane:pane}; }
function mxaHero(kind){ show('new'); mxaWire.hero=true; var pane=$('#mxPane').firstElementChild, ta=$('.mira-composer-input',pane), q=MXA_CHAT[kind].q, i=0;
  if(!ta) return mxaStart(kind,q,true);
  setTimeout(function step(){ if(MX.cur!=='new'||!mxaWire.hero) return; ta.value=q.slice(0,++i); ta.dispatchEvent(new Event('input',{bubbles:true})); try{ grow(ta); }catch(e){}
    if(i<q.length) setTimeout(step,28); else setTimeout(function(){ if(MX.cur==='new'&&mxaWire.hero){ mxaWire.hero=false; ta.value=''; mxaStart(kind,q,true); } },650); },900); }
function mxaSpec(v){ mxaWire(); var kind=v==='topn'?'topn':v==='board'?'board':'ts';
  if(v===''){ mxaHero(kind); return; }
  var r=mxaStart(kind,null,false), A=r.A, pane=r.pane; mxaStatic(r.o,A,0);
  if(v==='v2'){ A.vers.push({type:'area',range:'7d'}); var q2='Make it an area chart and show the last 7 days', o2=mxaMsg([['Thought','reading the change','brain','Kept the same data and changed only what was asked.'],['Visualization','area chart · v2','chart','Saved as version 2. Version 1 is still there.']],
      '<p>Updated. Version 2 shows the same five hosts as an area chart over the last 7 days. Over the week, db-prod-02 climbs past 90% every night at about 02:00. That is the backup job, not a one-off.</p>');
    userMsg(pane,q2); mxaStatic(o2,A,1); }
  toBottom();
  if(v==='closed') return;
  if(v==='query') A.tab='query';
  mxaOpen(A,A.vers.length-1); setTimeout(toBottom,60); }
