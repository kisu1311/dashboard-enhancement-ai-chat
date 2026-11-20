import re,sys
src='/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/mira.html'
d=open(src,encoding='utf-8').read()
spec=open('spec.js',encoding='utf-8').read()
# 1 drop the dev-only Agentation loader
i=d.rfind('<!-- Agentation'); j=d.find('</script>',i)+9; assert i>0; d=d[:i]+d[j:]
# 2 DS bundle path
assert d.count('src="_ds/observeops-elements.umd.js"')==1; d=d.replace('src="_ds/observeops-elements.umd.js"','src="mira-ds.js"')
# 3 navigation out of the page is a toast in specimen mode
n=len(re.findall(r'location\.href=',d)); d=re.sub(r'location\.href=','window.__mxgo=',d); 
# 4 specimen driver inside the glue closure, and the boot
boot="var m=/^#\\/c\\/(c1|c2|c3)$/.exec(location.hash); show(m?m[1]:'new');"
assert d.count(boot)==1 and d.count('\nrailMount();\n')==1
d=d.replace('\nrailMount();\n','\n'+spec+"\nObject.defineProperty(window,'__mxgo',{set:function(u){ if(window.__MXSPEC) toast('Opens in the full prototype'); else location.assign(u); }});\nrailMount();\n")
d=d.replace(boot,"if(window.__MXSPEC){ try{ mxSpec(window.__MXSPEC); }catch(e){ document.title='ERR '+e.message; if(window.console) console.error(e); } } else { "+boot+" }")
css='''<style id="mx-spec-css">
body.mx-spec #mxRail,body.mx-spec aside.mira-sidebar,body.mx-spec-page #mxRail{display:none!important}
body.mx-spec .mainLayoutContent,body.mx-spec-page .mainLayoutContent{padding-left:0!important;transition:none!important}
body.mx-spec-ff{opacity:0}
</style>'''
import datetime
stamp=datetime.datetime.now().strftime('%d %b %H:%M')   # shown under the stage, so a stale cached copy is visible as stale
d=d.replace('</head>',css+'<meta name="mx-build" content="'+stamp+'"></head>',1)
open('mira-stage.html','w',encoding='utf-8').write(d)
print('nav rewrites',n,'size',len(d))
