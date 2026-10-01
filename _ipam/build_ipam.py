import re,sys
S=sys.argv[1]  # the downloaded ipam-standalone.html
t=open(S,encoding='utf-8').read()
# 10.a.b.c -> 198.18.N.c  (one /24 per distinct 10.a.b prefix; 198.18.0.0/15 is RFC 2544 benchmark space)
pre={}
def sub10(m):
    k=m.group(2)+'.'+m.group(3)
    if k not in pre: pre[k]=len(pre)
    n=pre[k]; hi,lo=(18,n) if n<256 else (19,n-256)
    return m.group(1)+f'198.{hi}.{lo}.'+m.group(4)
t=re.sub(r'(^|[^0-9.])10\.(\d+)\.(\d+)\.(\d+)',sub10,t)
t=re.sub(r'(^|[^0-9.])172\.16\.9\.243',r'\g<1>203.0.113.243',t)
t=re.sub(r'(^|[^0-9.])192\.168\.1\.',r'\g<1>203.0.113.',t)
t=t.replace('corp.motadata.local','corp.example.com').replace('motadata-DMZ','corp-DMZ')
embed='''<script>/* EMBED MODE (Option 1): ?embed=1 hides this page's own rail + app header so it sits
inside Option 1's chrome; ?theme=dark|light follows the host. Added by build_ipam.py — the rest is the
source (divyam-shah29.github.io/IPAM-UI) with every address scrubbed to RFC 2544/5737. */
(function(){var q=new URLSearchParams(location.search),r=document.documentElement;
if(q.get('embed')==='1')r.classList.add('ipembed');
var th=q.get('theme');if(th)r.setAttribute('data-theme',th==='dark'?'dark-theme':'');
addEventListener('message',function(e){var d=e.data;if(d&&d.ipamTheme)r.setAttribute('data-theme',d.ipamTheme==='dark'?'dark-theme':'');});})();</script>
<style>html.ipembed .ip-rail,html.ipembed #appHeader{display:none!important}
html.ipembed .ip-shell{height:100vh}</style>
'''
t=t.replace('<head>\n','<head>\n'+embed,1)
open(sys.argv[2] if len(sys.argv)>2 else '_ipam/ipam.html','w',encoding='utf-8').write(t)
print(len(pre),'prefixes mapped')
# then the DS pass (obs-table / obs-metric-list / obs-key-value readouts)
import subprocess, os
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ds_pass.py'),
                sys.argv[2] if len(sys.argv) > 2 else '_ipam/ipam.html'], check=True)
