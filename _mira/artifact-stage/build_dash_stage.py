"""Build dash-stage.html: Dashboard_with_AI_Chat/index.html (Option 1's dashboard) with a driver that opens it on one
component state, for the module-work artifact's Dashboard stage. Run from this folder; the artifact also publishes
mira-ds.js (the same _ds/observeops-elements.umd.js the Mira stage uses)."""
import re, datetime
D = '/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/'
d = open(D + 'index.html', encoding='utf-8').read()

# 1 drop the dev-only Agentation loader and the variant switcher
i = d.rfind('<!-- Agentation')
if i > 0:
    j = d.find('</script>', i) + 9; d = d[:i] + d[j:]
d = re.sub(r'<script src="_variants\.js"></script>', '', d)
# 2 the DS bundle is the artifact's mira-ds.js; the two small helpers are inlined
assert d.count('src="_ds/observeops-elements.umd.js"') == 1
d = d.replace('src="_ds/observeops-elements.umd.js"', 'src="mira-ds.js"')
for f in ['setting-nav.js', '_ds/colresize.js']:
    tag = '<script src="%s"></script>' % f
    assert d.count(tag) == 1, f
    body = open(D + f, encoding='utf-8').read().replace('</script', '<\\/script')
    d = d.replace(tag, '<script>/* inlined %s */\n%s\n</script>' % (f, body))
# 3 storage can be refused inside a framed srcdoc - give the page a memory store rather than let init throw
shim = ("<script>(function(){try{var k='__t';localStorage.setItem(k,k);localStorage.removeItem(k);}catch(e){var m={};"
        "var s={getItem:function(k){return k in m?m[k]:null},setItem:function(k,v){m[k]=String(v)},removeItem:function(k){delete m[k]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null},get length(){return Object.keys(m).length}};"
        "try{Object.defineProperty(window,'localStorage',{value:s,configurable:true})}catch(e2){}}})();</script>")
# 4 the driver
drv = r"""<script>
/* the module-work artifact's stage: __DVSPEC = { key, v, theme } opens the board on one state */
(function(){ var S=window.__DVSPEC; if(!S) return; if(S.key==='aisum') document.documentElement.classList.add('dvwait'); window.__CVOPT=/4/.test(S.v||'')?'4':/3/.test(S.v||'')?'3':/2/.test(S.v||'')?'2':'1';
  function scroller(el){ for(var p=el.parentElement;p;p=p.parentElement){ var cs=getComputedStyle(p); if(/(auto|scroll)/.test(cs.overflowY)&&p.scrollHeight>p.clientHeight+2) return p; } return null; }
  function go(n){ try{
      if(typeof setTheme==='function') setTheme(S.theme==='light'?'light':'dark');
      if(S.key==='mira'){ window.__MROPT=/2/.test(S.v||'')?'2':'1'; var mid='mrstage';
        if(!document.querySelector('.mrtile[data-mid="'+mid+'"]')) awAdd('Untitled tile','mira',{mid:mid});
        var mt=document.querySelector('.mrtile[data-mid="'+mid+'"]'), mw=mt&&mt.closest('.widget');
        if(!mw){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no tile'; return; }
        var ms=scroller(mw); if(ms){ ms.scrollTop+=mw.getBoundingClientRect().top-ms.getBoundingClientRect().top-90; }
        wSelect(mw); document.title='READY'; return; }
      if(S.key==='sv78'){ var o8=/8/.test(S.v||''), ed=/e/.test(S.v||''), sl=(typeof WIDGETS!=='undefined'&&WIDGETS[curG])||[], si=-1;
        /* the option 7 and 8 cards are no longer on the board (24 Nov 2026) - the stage adds its three cards at the top, the same values
           the board shipped (a measured card twice, then the flat "No change" one) */
        if(!sl.some(function(x){return x&&x.t==='cmp'&&x.cmpopt===(o8?8:7)})){
          [4,5,6].slice().reverse().forEach(function(o){ sl.unshift({ t:'cmp', title:'system.cpu.percent', span:4, h:190, seed:42902, trend:.89, color:'#14b8a6', acc:false,
            ctr:'system.cpu.percent', agg:'Avg', src:'Metric', u:'%', cmpWith:'yesterday', cmpAs:'Percent', cmpUp:'Good', cmpLine:true, cmpView:'Area', cmpLeg:true, cmpAx:true, cmpGrid:true, cmpLw:2,
            cmpXtOn:false, cmpXt:'', cmpYtOn:false, cmpYt:'', cmpZtOn:false, cmpZt:'', cmpGr:5, cmpGu:'Minute', cmpWin:'24h', cmpPts:false, cmpPs:4, cmpBand:true, cmpStats:true,
            cmpTbl:false, cmpopt:o8?8:7, ctr2:'', cmpDemo:o===6?'flat':'ok' }); });
          renderCanvas(); }
        for(var q=0;q<sl.length;q++){ if(sl[q]&&sl[q].t==='cmp'&&sl[q].cmpopt===(o8?8:7)){ si=q; break; } }
        var sw=si>=0&&document.querySelector('#dashGrid .widget[data-g="'+curG+'"][data-i="'+si+'"]');
        if(!sw){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no card'; return; }
        var ss=scroller(sw); if(ss){ ss.scrollTop+=sw.getBoundingClientRect().top-ss.getBoundingClientRect().top-90; }
        if(ed){ cwOpen(curG,si); setTimeout(function(){ var v=document.querySelector('.cwcmp8v'), sb=v&&v.closest('.cwsb'); if(v&&sb) sb.scrollTop+=v.getBoundingClientRect().top-sb.getBoundingClientRect().top-60; document.title='READY'; },700); return; }
        document.title='READY'; return; }
      /* Dashboard AI Summary · Mira (24 Nov 2026): Option 1 = the cards design (sumopt 1), Option 2 = the briefing (sumopt 2).
         Both ship at the top of the board; the stage scrolls to the one asked for (adds it first if the board lacks it). */
      if(S.key==='aisum'){ var so=/5/.test(S.v||'')?'5':/4/.test(S.v||'')?'4':/2/.test(S.v||'')?'2':'1', al=(typeof WIDGETS!=='undefined'&&WIDGETS[curG])||[], ai=-1;
        /* ONE summary on the board (fix, 26 Nov 2026: Option 1 showed the board's shipped plain-text summary first, then
           stacked the cards one above it): the shipped board summary is switched to the option asked for, any other board
           summary is dropped, and the board stays hidden (html.dvwait) until that is done */
        for(var u=al.length-1;u>=0;u--){ if(al[u]&&al[u].t==='aisum'&&al[u].scope!=='group'){ if(ai>=0) al.splice(ai,1); ai=u; } }
        var ash={ title:so==='2'?'Dashboard AI Summary · Mira — briefing':'Dashboard AI Summary · Mira', h:so==='4'?440:so==='2'?305:390, sumopt:so };
        if(ai<0){ al.unshift({ t:'aisum', span:12, scope:'board' }); ai=0; }
        if(al[ai].sumopt!==so||al[ai].__dv!==so){ Object.assign(al[ai],ash); al[ai].__dv=so; renderCanvas(); }
        var aw=document.querySelector('#dashGrid .widget[data-g="'+curG+'"][data-i="'+ai+'"]');
        if(!aw){ if(n<40) return setTimeout(function(){go(n+1)},150); document.documentElement.classList.remove('dvwait'); document.title='ERR no summary'; return; }
        document.documentElement.classList.remove('dvwait');
        var as=scroller(aw); if(as){ as.scrollTop+=aw.getBoundingClientRect().top-as.getBoundingClientRect().top-12; }
        document.title='READY'; return; }
      /* Dashboard filter (25 Nov 2026, moved off the board): Option 1 the filter row open, Option 2 with a Monitor and a Group set */
      if(S.key==='dflt'){ document.body.classList.add('dfstage');
        if(typeof dfTog!=='function'){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no filter'; return; }
        if(/2/.test(S.v||'')){ var f=dfCur(); f.monitor=['fg-firewall.example.com']; f.group=['Network > Firewall','Network > Switch']; dfInit(); dfApply(); }
        dfTog(true); document.title='READY'; return; }
      /* Widget hover hint (26 Nov 2026): five designs, window.__WTBHINT; the stage hovers the first chart widget */
      if(S.key==='wtbhint'){ var ho=(S.v||'').replace('o','')||'1'; window.__WTBHINT=ho;
        var hl=(typeof WIDGETS!=='undefined'&&WIDGETS[curG])||[], hi=-1; for(var z=0;z<hl.length;z++){ if(hl[z]&&(hl[z].t==='pie'||hl[z].t==='hbars'||hl[z].t==='cmp')){ hi=z; break; } }
        var hw=hi>=0&&document.querySelector('#dashGrid .widget[data-g="'+curG+'"][data-i="'+hi+'"]');
        if(!hw){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no widget'; return; }
        var hs=scroller(hw); if(hs){ hs.scrollTop+=hw.getBoundingClientRect().top-hs.getBoundingClientRect().top-70; }
        setTimeout(function(){ var r=hw.getBoundingClientRect(), x=r.left+r.width*.55, y=r.top+r.height*.5, tgt=document.elementFromPoint(x,y)||hw;
          tgt.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,clientX:x,clientY:y})); tgt.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:x,clientY:y})); document.title='READY'; },300);
        return; }
      if(S.key==='wtbintro'){ window.__WTBOPT=window.__CVOPT; try{ ['oo-wtb-seen','oo-wtb-uses'].forEach(function(k){localStorage.removeItem(k)}); }catch(e){}
        var wl=(typeof WIDGETS!=='undefined'&&WIDGETS[curG])||[], wi=-1; for(var j=0;j<wl.length;j++){ if(wl[j]&&(wl[j].t==='pie'||wl[j].t==='hbars')){ wi=j; break; } }
        var ww=wi>=0&&document.querySelector('#dashGrid .widget[data-g="'+curG+'"][data-i="'+wi+'"]');
        if(!ww){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no widget'; return; }
        var ws=scroller(ww); if(ws){ ws.scrollTop+=ww.getBoundingClientRect().top-ws.getBoundingClientRect().top-70; }
        wSelect(ww); document.title='READY'; return; }
      var want=S.key==='cvcard'?function(m){return m.t==='cmp'}:function(m){return m.t==='pie'||m.t==='hbars'||m.t==='tn'};
      var list=(typeof WIDGETS!=='undefined'&&WIDGETS[curG])||[], idx=-1; for(var i=0;i<list.length;i++){ if(list[i]&&want(list[i])){ idx=i; break; } }
      var w=idx>=0&&document.querySelector('#dashGrid .widget[data-g="'+curG+'"][data-i="'+idx+'"]');
      if(!w){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no widget'; return; }
      var sc=scroller(w); if(sc){ sc.scrollTop+=w.getBoundingClientRect().top-sc.getBoundingClientRect().top-70; }
      wSelect(w);
      setTimeout(function(){ var b=document.getElementById('wTbViewBtn'); if(!b){ document.title='ERR no button'; return; }
        wTbView({stopPropagation:function(){},currentTarget:b}); document.title='READY'; },250);
    }catch(e){ document.title='ERR '+e.message; } }
  window.addEventListener('load',function(){ setTimeout(function(){go(0)},900); });
})();
</script>"""
stamp = datetime.datetime.now().strftime('%d %b %H:%M')
css = '<style id="dv-stage-css">.vs-switch{display:none!important}html.dvwait #dashGrid{visibility:hidden}</style><meta name="mx-build" content="' + stamp + '">'
assert d.count('<head>') >= 1
d = d.replace('<head>', '<head>' + shim, 1).replace('</head>', css + '</head>', 1)
k = d.rfind('</body>'); d = d[:k] + drv + d[k:]
open('dash-stage.html', 'w', encoding='utf-8').write(d)
print('dash-stage.html', len(d), stamp)
