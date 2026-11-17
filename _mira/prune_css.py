import re,subprocess,sys,os,html
H='h/'
css=open(H+'css1.txt').read().replace('</style','<\\/style')
dom=open(H+'dom1.txt').read()
body=re.sub(r'^<body[^>]*>','',dom); body=re.sub(r'</body>\s*$','',body)
extra=''
for f in sorted(os.listdir(H)):
    if f.startswith('s_') and f.endswith('.html') and os.path.getsize(H+f)>500:
        s=open(H+f).read()
        s=re.sub(r'^<body[^>]*>','<div>',s); s=re.sub(r'</body>\s*$','</div>',s)
        extra+='<div class="u">'+s+'</div>\n'
js=r'''
(function(){
const PSE=/::[\w-]+(\([^)]*\))?|:(hover|focus-visible|focus-within|focus|active|visited|link|target|checked|disabled|enabled|placeholder-shown|before|after|first-line|first-letter|selection)\b/g;
function parts(sel){const out=[];let d=0,cur='';for(const ch of sel){if(ch==='('||ch==='[')d++;if(ch===')'||ch===']')d--;if(ch===','&&d===0){out.push(cur);cur=''}else cur+=ch}out.push(cur);return out}
function hit(sel){ if(sel.indexOf('mira-')>=0) return true; for(let p of parts(sel)){p=p.replace(PSE,'').trim(); if(!p||/[>+~]$/.test(p)) p+=' *'; p=p.replace(/^[>+~]/,'* $&'); try{ if(document.querySelector(p)) return true }catch(e){} } return false }
const kf={}; let out=[];
function walk(rules,acc){ for(const r of rules){ const t=r.constructor.name;
  if(t==='CSSStyleRule'){ if(hit(r.selectorText)) acc.push(r.cssText) }
  else if(t==='CSSMediaRule'||t==='CSSSupportsRule'){ const inner=[]; walk(r.cssRules,inner); if(inner.length) acc.push((t==='CSSMediaRule'?'@media '+r.conditionText:'@supports '+r.conditionText)+'{\n'+inner.join('\n')+'\n}') }
  else if(t==='CSSKeyframesRule'){ kf[r.name]=r.cssText }
  else if(t==='CSSFontFaceRule'){}
  else { acc.push(r.cssText) }
} }
for(const ss of document.styleSheets) walk(ss.cssRules,out);
let txt=out.join('\n'); const used=Object.keys(kf).filter(n=>new RegExp('[ :,]'+n.replace(/[-.]/g,'\\$&')+'\\b').test(txt));
txt+='\n'+used.map(n=>kf[n]).join('\n');
document.body.innerHTML=''; const pre=document.createElement('pre'); pre.id='__out'; pre.textContent='@@START@@'+txt+'@@END@@'; document.body.appendChild(pre);
})();
'''
page='<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body data-theme="dark-theme">'+body+extra+'<script>'+js+'</script></body></html>'
open('universe.html','w').write(page)
print('universe',len(page))
