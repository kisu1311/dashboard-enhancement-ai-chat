import re,sys,json
from bs4 import BeautifulSoup as BS
H='h/'
OUT=sys.argv[1]
def L(f): return BS(open(H+f).read(),'html.parser')
import os
SCRUB=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'scrub.local.json')))
def scrub(s):
    for a,b in SCRUB: s=s.replace(a,b)   # real values live in the git-ignored scrub.local.json
    s=re.sub(r'\b(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.(\d{1,3})\.(\d{1,3})\b',lambda m:'198.51.100.'+m.group(2),s)
    s=s.replace('https://192.0.2.60/ai-assistant/mira','mira.html')
    s=s.replace('$0.55','$0.59').replace('width: 5.5%','width: 5.9%')   # one monthly-usage figure everywhere (the newest capture's)
    return s
def clean(t):
    for g in t.select('grammarly-extension, grammarly-extension-vbars, superhuman-go-underlines, .give-freely-root'): g.decompose()
    for e in t.find_all(True):
        for a in list(e.attrs):
            if a.startswith('data-gr') or a.startswith('data-new-gr') or a in('append-to','ant-click-animating-without-extra-node'): del e[a]
    return t
def collapse(t):
    for f in t.select('.mira-group-fold, .mira-tool-body'):
        f['style']='height: auto;'
    for b in t.select('.mira-group-head, button.mira-step-row'):
        b['aria-expanded']='false'
        for ch in b.select('.mira-step-chevron'):
            ch['class']=[c for c in ch['class'] if c!='is-open']
    return t
def pane(view, key):
    p=view.select_one('.mira-split').find(recursive=False)
    clean(p); collapse(p)
    n=0
    for b in p.select('.mira-forge-button'):
        tx=b.get_text(strip=True)
        if tx=='Code': b['data-mx-code']=f'{key}-{n}'
        n+=1
    return p.decode_contents()
v1=L('s_view_open.html'); v2=L('s_view2_open.html'); vn=L('s_view_new.html'); v3=L('s_view3_open.html'); v4=L('s_view4_open.html')
P1=pane(v1,'c1'); P2=pane(v2,'c2'); PN=pane(vn,'new'); P3=pane(v3,'c3'); P4=pane(v4,'c4')
P4=re.sub(r'data-mx-code="c4-(?!0")\d+"','data-mx-code="c4-2"',P4)
P3=re.sub(r'data-mx-code="c3-(?!0")\d+"','data-mx-code="c3-2"',P3)
# chat-2 code buttons all show the same file
P2=re.sub(r'data-mx-code="c2-\d+"','data-mx-code="c2-0"',P2)
# sidebar (expanded) with two chats
side=clean(v1.select_one('aside.mira-sidebar'))
lis=side.select('.mira-recents-list > li')
for i,li in enumerate(lis):
    if i>1: li.decompose()
    else:
        a=li.find('a'); a['data-mx-chat']='c%d'%(i+1); a['href']='#'
import copy
ul=side.select_one('.mira-recents-list'); li0=ul.find('li'); li3=copy.copy(li0)
a3=li3.find('a'); a3['data-mx-chat']='c3'; a3['title']='Runbook Creation'; li3.select_one('.mira-recent-name').string='Runbook Creation'
li0.find('a')['class']=[c for c in li0.find('a')['class'] if c!='is-active']
li0.insert_before(li3)
SIDE=str(side)
sc=clean(L('s_view_side_collapsed.html').select_one('aside.mira-sidebar')); SIDEC=sc.decode_contents()
SEARCH=str(clean(L('s_view_search.html').select_one('.mira-sidebar-search')))
HMENU=str(L('s_full_hmenu.html').select_one('.mira-chat-menu-list'))
RMENU=str(L('s_full_rmenu.html').select_one('.ant-popover.picker-action-dropdown'))
EFF=str(L('s_full_effort.html').select_one('.ant-dropdown.mira-effort-menu'))
tp=L('s_full_plus.html').select_one('.tippy-popper'); TIP=str(tp) if tp else ''
def code(f): return str(clean(L(f).select_one('.mira-pane.is-preview')))
CODES={'c1-0':code('s_code0.html'),'c1-1':code('s_code1.html'),'c1-3':code('s_code3.html'),'c2-0':code('s_code2_0.html'),'c3-0':code('s_code3_0.html'),'c3-2':code('s_code3_2.html'),'c4-0':code('s_code4_0.html'),'c4-2':code('s_code4_2.html')}
# page skeleton from the first full-body capture
dom=open(H+'dom1.txt').read()
d=BS(dom,'html.parser'); body=d.find('body'); clean(body)
app=body.find('div',recursive=False)
view=app.select_one('.ai-assistant-mira-view')
chat=view.select_one('.mira-chat')
chat.select_one('aside.mira-sidebar').replace_with(BS(SIDE,'html.parser'))
sp=chat.select_one('.mira-split')
keep=L('s_view_open.html').select_one('.mira-split')
pn=keep.find(recursive=False); pn.clear(); pn['id']='mxPane'; pn['style']='width: 100%;'
for a,val in keep.attrs.items(): sp[a]=val
sp.clear(); sp.append(pn)
rail=app.select_one('.sidebar-rail')
rail.replace_with(BS('<div id="mxRail" class="mx-rail-host"></div>','html.parser'))
APP=str(app)
print('tip',len(TIP),'hmenu',len(HMENU),'rmenu',len(RMENU),'eff',len(EFF),'app',len(APP))
css=open('used.css').read()
# the capture injected `*{animation:none!important;transition:none!important}` into the live page to freeze it for
# measuring, and css1.txt recorded it; left in, it switched off every animation on the clone (found 16 Nov 2026).
import re as _re
_n=len(css); css=_re.sub(r'^\*, ::before, ::after \{ animation: [^}]*!important; transition: none !important; \}\s*$','',css,flags=_re.M)
assert len(css)<_n, 'freeze rule not found'
glue_css=open('glue.css').read(); glue_js=open('glue.js').read()
T=lambda i,h:'<template id="mxt-%s">%s</template>\n'%(i,h)
tpl=T('c1',P1)+T('c2',P2)+T('c3',P3)+T('c4',P4)+T('new',PN)+T('sidec',SIDEC)+T('search',SEARCH)+T('hmenu',HMENU)+T('rmenu',RMENU)+T('effort',EFF)+T('tip',TIP)
for k,h in CODES.items(): tpl+=T('code-'+k,h)
tpl+=T('o1rail',open('o1rail.html').read())
SC={}
for line in open(H+'css1.txt').read().split('\n'):
    if 'mira-' not in line or '[data-v-' not in line: continue
    for cm in re.finditer(r'\.(mira-[\w-]+)[^\s,>+~]*?\[data-v-([0-9a-f]{8})\]',line.split('{',1)[0]):
        SC.setdefault(cm.group(1),set()).add(cm.group(2))
SCJ=json.dumps({k:sorted(v) for k,v in sorted(SC.items())},separators=(',',':'))
print('scope map',len(SC),len(SCJ))
head=open('head.html').read()
page=head.replace('/*@@CSS@@*/',css.replace('</style','<\\/style')).replace('/*@@GLUE@@*/',glue_css)
page+='<body data-theme="dark-theme">\n'+APP+'\n'+tpl+'<script src="_ds/observeops-elements.umd.js"></script>\n<script>window.MX_SC='+SCJ+';</script>\n<script>\n'+glue_js+'\n</script>\n'+open('tail.html').read()
page=scrub(page)
open(OUT,'w').write(page)
print('wrote',OUT,len(page))
for pat in [r'\b10\.20\.',r'172\.16\.',r'motadata\.com',r'auth\.token',r'grammarly']+[re.escape(a) for a,_ in SCRUB]:
    print(pat,len(re.findall(pat,page)))
