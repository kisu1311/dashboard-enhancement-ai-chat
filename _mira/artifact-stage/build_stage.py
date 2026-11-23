import re,sys
src='/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/mira.html'
d=open(src,encoding='utf-8').read()
spec=open('spec.js',encoding='utf-8').read()
# UI visualization · Artifact view (20 Nov 2026): its driver is a second file, with the product's own icons read in from
# observeops-icons (never hand-drawn). Run from a folder holding spec.js + spec-artifact.js, as before.
import os,json
art=open('spec-artifact.js',encoding='utf-8').read()
OI='/Users/kishanpatel/ObseverOps/observeops-icons/'
ICONS={'chart':'common/charts-metrics/chart-line.svg','full':'common/navigation-layout/fullscreen.svg','shrink':'common/navigation-layout/compress-alt.svg',
  'down':'common/cloud-compute/cloud-download.svg','dash':'dashboards/navigation-layout/dashboard.svg'}
ico={k:re.sub(r'\s+xmlns="[^"]*"','',open(OI+p,encoding='utf-8').read().strip()) for k,p in ICONS.items()}
ico['chev']=re.sub(r'\s+xmlns="[^"]*"','',re.search(r'<svg[^>]*data-icon="chevron-right".*?</svg>',d,re.S).group(0))
assert art.count('/*MXA_ICONS*/{}')==1
spec=spec+'\n'+art.replace('/*MXA_ICONS*/{}',json.dumps(ico))
# Sidebar Option 2 (20 Nov 2026): pin / group / filter on the chat list. Tabler icons from free-icons via the icon-library picker.
import subprocess
sb=open('spec-sidebar.js',encoding='utf-8').read()
PICK=os.path.expanduser('~/.claude/skills/icon-library/scripts/pick.py')
sico={}
for n in ['filter','pin','pinned','pinned-off','folder','folder-open','folder-plus','folder-symlink','folder-off','folders','message','search','plus','pencil','trash','dots','chevron-right','chevron-down','x','check','sparkles','arrow-up','arrow-down','grip-vertical']:
    out=subprocess.run(['python3',PICK,n,'--set','tabler','--svg'],capture_output=True,text=True).stdout
    m=re.search(r'<svg.*?</svg>',out,re.S); assert m,n
    sico[n]=re.sub(r'\s+xmlns="[^"]*"','',m.group(0))
assert sb.count('/*MXS_ICONS*/{}')==1
spec=spec+'\n'+sb.replace('/*MXS_ICONS*/{}',json.dumps(sico))
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
/* Brand: the top-left of a 1440-wide screen at 2x, so the mark reads next to the search field and the chat header */
html:has(body.mx-spec-brand){overflow:hidden}
body.mx-spec-brand{width:1440px!important;height:900px!important;transform:scale(2);transform-origin:0 0;overflow:hidden}
/* Brand Option 2 (Mobbin: Gemini, Langdock, Plane, Customer.io, Plain): the brand row on the SAME centre line as the chat
   header (it sat 8px higher), the mark flat (no border, no glow) with its left edge on the search field's, the name 15px,
   ALPHA a readable sentence-case tag in a quiet tint (it was 8.5px uppercase in an outlined pill), and a hover state - it is
   the Mira home button */
body.mxb2 .mira-sidebar-head{padding:25px 16px 15px!important}
body.mxb2 .mira-brand{gap:8px!important;column-gap:8px!important;height:28px!important;padding:2px 8px 2px 2px!important;margin-left:-2px!important;border-radius:8px!important;transition:background .12s}
body.mxb2 .mira-brand:hover{background:var(--mira-row-hover)!important}
body.mxb2 .mira-brand-mark{width:24px!important;height:24px!important;flex:0 0 24px!important;border:0!important;box-shadow:none!important;border-radius:7px!important;background:var(--mira-accent-12)!important}
body.mxb2 .mira-brand-mark svg{width:13px!important;height:13px!important}
body.mxb2 .mira-brand-name{font-size:15px!important;line-height:20px!important;letter-spacing:-.01em!important}
body.mxb2 .mira-brand-alpha{margin:0!important;padding:1px 6px!important;border:0!important;border-radius:4px!important;background:var(--mira-accent-12)!important;color:var(--mira-name)!important;font-size:11px!important;font-weight:500!important;line-height:16px!important;letter-spacing:0!important;text-transform:none!important}
body.mx-spec-menu aside.mira-sidebar{display:none!important}
body.mx-spec-menu .mira-chat{flex:0 0 auto!important;width:440px!important;max-width:440px!important;overflow:hidden!important}
body.mx-spec-menu .mira-chat>:not(aside.mira-sidebar){flex:0 0 auto!important;min-width:2300px!important}
</style>'''
import datetime
stamp=datetime.datetime.now().strftime('%d %b %H:%M')   # shown under the stage, so a stale cached copy is visible as stale
d=d.replace('</head>',css+'<meta name="mx-build" content="'+stamp+'"></head>',1)
open('mira-stage.html','w',encoding='utf-8').write(d)
print('nav rewrites',n,'size',len(d))
