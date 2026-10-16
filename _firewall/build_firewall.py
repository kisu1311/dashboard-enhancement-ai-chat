"""Vendor the Firewall Analyzer module into Option 1 (13 Oct 2026).

  python3 _firewall/build_firewall.py "<path>/firewall-analyzer-standalone.html" [_firewall/firewall.html]

Same recipe as _ipam/build_ipam.py: scrub every private address to documentation space, then inject
an EMBED block — ?embed=1 hides the page's own obs-sidebar rail + obs-app-header so it sits inside
Option 1's chrome (?embed=settings also hides its Settings list + head, for setting.html); ?theme=dark|light follows the host, and postMessage({faTheme}) re-points it.
Regenerate, never hand-edit firewall.html.
"""
import re, sys
S = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else '_firewall/firewall.html'
t = open(S, encoding='utf-8').read()

# 10.a.b.c / 172.16-31.b.c / 192.168.b.c -> 198.18.N.c (one /24 per distinct prefix; RFC 2544 space).
# STRICT 4 octets: minified SVG path data ("-10.82.15-.23", "l10.57.14c") has 3 and must not match.
pre = {}
def slot(k):
    if k not in pre: pre[k] = len(pre)
    n = pre[k]
    return f'198.{18 + n // 256}.{n % 256}.'
PRIV = r'(10\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+|192\.168\.\d+)'
t = re.sub(r'(^|[^0-9.])' + PRIV + r'\.(\d+)(?![0-9.]*\d)', lambda m: m.group(1) + slot(m.group(2)) + m.group(3), t)
# a prefix built by string concatenation in the seed data: '10.99.4.' + n
t = re.sub(r"(['\"])" + PRIV + r"\.(['\"])", lambda m: m.group(1) + slot(m.group(2)) + m.group(3), t)
t = t.replace('motadata.local', 'example.com')

embed = '''<script>/* EMBED MODE (Option 1) — added by _firewall/build_firewall.py. ?embed=1 hides this page's own
rail + app header; ?theme=dark|light follows the host (the user menu restores obs-theme-mode from
localStorage, so that is written too, before the bundle reads it). */
(function(){var q=new URLSearchParams(location.search),r=document.documentElement;
function set(th){r.setAttribute('data-theme',th==='dark'?'dark-theme':'');
  try{localStorage.setItem('obs-theme-mode',th);localStorage.setItem('obs-theme',th);}catch(e){}}
var em=q.get('embed');if(em)r.classList.add('faembed');if(em==='settings')r.classList.add('fasettings');
var th=q.get('theme');if(th)set(th);
addEventListener('message',function(e){var d=e.data;if(d&&d.faTheme)set(d.faTheme);});
if(th)addEventListener('load',function(){set(th);});})();</script>
<style>html.faembed{--fa-rail-width:0px}
html.faembed .fa-rail,html.faembed #appHeader{display:none!important}
/* inside Option 1 the page sits on the host's page background like every other module (its own --common-main-bg is lighter) */
html.faembed body,html.faembed .fa-body{background:var(--page-background-color)}
/* ?embed=settings: the host's Settings page supplies the category list and the head, so the page's own go */
html.fasettings .fa-sections,html.fasettings #dpHeader{display:none!important}</style>
'''
assert '<head>\n' in t
t = t.replace('<head>\n', '<head>\n' + embed, 1)
open(OUT, 'w', encoding='utf-8').write(t)
left = re.findall(r'(?<![0-9.])(?:10|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d+\.\d+\.\d+', t)
print(len(pre), 'prefixes mapped ·', len(left), 'private addresses left', left[:5])

# DS pass (13 Oct 2026): swap the hand-built widget chrome, tiles, stats, key/value lists and pagers
# for their obs-* elements — see _firewall/ds_pass.py.
import subprocess, os
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ds_pass.py'), OUT], check=True)
