"""⚠️ OUTDATED NUMBERING (30 Oct 2026): options were renumbered — Option 1 = firewall2.html, Option 2 = firewall3.html,
Option 3 = firewall.html — and firewall2/3 have diverged a long way. Do NOT run this without --one; even --one writes the
OLD switch (value 1) into firewall.html, which must read value 3 now. Fix the mapping before using it again.

Firewall Analyzer Option 1 / 2 / 3 (30 Oct 2026: "copy and create as option 2 & 3").

  python3 _firewall/make_options.py

Copies _firewall/firewall.html to firewall2.html and firewall3.html (byte copies of Option 1) and puts an
Option 1 / 2 / 3 switch (obs-radio as-button, the Topology switch's shape) in each page header, set to that
page's own number. Picking another option posts {faOpt:'N'} to the host (index.html swaps its iframe);
opened on its own, the page navigates. Idempotent: the switch block is replaced, never stacked.

⚠️ firewall2/3 are copies NOW — edit them directly from here on to make them diverge. Re-running this script
OVERWRITES both with Option 1 again. After rebuilding firewall.html (build_firewall.py), run it with --one to
re-add the switch to firewall.html only:  python3 _firewall/make_options.py --one
"""
import re, sys, pathlib

HERE = pathlib.Path(__file__).parent
FILES = {'1': 'firewall.html', '2': 'firewall2.html', '3': 'firewall3.html'}
B, E = '<!--FAOPT:BEGIN-->', '<!--FAOPT:END-->'
SB, SE = '/*FAOPT-JS:BEGIN*/', '/*FAOPT-JS:END*/'


def switch(n):
    opts = '[{"value":"1","label":"Option 1"},{"value":"2","label":"Option 2"},{"value":"3","label":"Option 3"}]'
    return (f'{B}<obs-radio id="faOpt" as-button size="small" options=\'{opts}\' value="{n}" '
            f'aria-label="Design option" style="margin-right:8px"></obs-radio>{E}')


def js(n):
    return (f'<script>{SB}(function(){{const CUR="{n}",F={{"1":"firewall.html","2":"firewall2.html","3":"firewall3.html"}};'
            'function bind(){const r=document.getElementById("faOpt");if(!r)return;'
            'try{r.value=CUR;}catch(e){}'
            'r.addEventListener("change",function(e){if(!(e instanceof CustomEvent))return;'
            'const d=e.detail,v=String(Array.isArray(d)?d[0]:d);if(!F[v]||v===CUR)return;'
            'if(parent!==window)parent.postMessage({faOpt:v},"*");'
            'else location.href=F[v]+location.search+location.hash;});}'
            'if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();'
            f'}})();{SE}</script>')


def inject(src, n):
    src = re.sub(re.escape(B) + '.*?' + re.escape(E), '', src, flags=re.S)
    src = re.sub(r'<script>' + re.escape(SB) + '.*?' + re.escape(SE) + '</script>', '', src, flags=re.S)
    anchor = '<obs-page-header id="pageHeader" heading="Firewall Analyzer">'   # unique: the picker tag also appears in a JS string
    assert src.count(anchor) == 1, 'page-header anchor not found exactly once'
    src = src.replace(anchor, anchor + switch(n), 1)
    i = src.rfind('</body>')
    assert i > 0
    return src[:i] + js(n) + src[i:]


base = (HERE / FILES['1']).read_text(encoding='utf-8')
targets = ['1'] if '--one' in sys.argv else ['1', '2', '3']
for n in targets:
    (HERE / FILES[n]).write_text(inject(base, n), encoding='utf-8')
    print('wrote', FILES[n])
