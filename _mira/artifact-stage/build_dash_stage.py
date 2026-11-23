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
(function(){ var S=window.__DVSPEC; if(!S) return; window.__CVOPT=/4/.test(S.v||'')?'4':/3/.test(S.v||'')?'3':/2/.test(S.v||'')?'2':'1';
  function scroller(el){ for(var p=el.parentElement;p;p=p.parentElement){ var cs=getComputedStyle(p); if(/(auto|scroll)/.test(cs.overflowY)&&p.scrollHeight>p.clientHeight+2) return p; } return null; }
  function go(n){ try{
      if(typeof setTheme==='function') setTheme(S.theme==='light'?'light':'dark');
      if(S.key==='mira'){ window.__MROPT=/2/.test(S.v||'')?'2':'1'; var mid='mrstage';
        if(!document.querySelector('.mrtile[data-mid="'+mid+'"]')) awAdd('Untitled tile','mira',{mid:mid});
        var mt=document.querySelector('.mrtile[data-mid="'+mid+'"]'), mw=mt&&mt.closest('.widget');
        if(!mw){ if(n<40) return setTimeout(function(){go(n+1)},150); document.title='ERR no tile'; return; }
        var ms=scroller(mw); if(ms){ ms.scrollTop+=mw.getBoundingClientRect().top-ms.getBoundingClientRect().top-90; }
        wSelect(mw); document.title='READY'; return; }
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
css = '<style id="dv-stage-css">.vs-switch{display:none!important}</style><meta name="mx-build" content="' + stamp + '">'
assert d.count('<head>') >= 1
d = d.replace('<head>', '<head>' + shim, 1).replace('</head>', css + '</head>', 1)
k = d.rfind('</body>'); d = d[:k] + drv + d[k:]
open('dash-stage.html', 'w', encoding='utf-8').write(d)
print('dash-stage.html', len(d), stamp)
