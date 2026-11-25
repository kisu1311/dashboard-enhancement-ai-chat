"""Put the module-work artifact's Mira sidebar (spec-sidebar.js - pin, groups, filters, drag, collapse-in-sidebar) into mira.html
itself and turn on the chosen options BY DEFAULT (request, 24 Nov 2026): Option 2's list with the Nested-menu filter (fopt 4), the
group action on the Groups title (gpos sec), Collapse in sidebar (mxsTog) and drag chats + groups. Idempotent: re-running replaces
the injected block. The stage (artifact-stage/build_stage.py) skips its own copy when mira.html already carries it."""
import re, os, json, subprocess
D = '/Users/kishanpatel/ObseverOps/Dashboard_with_AI_Chat/'
d = open(D + 'mira.html', encoding='utf-8').read()
sb = open(D + '_mira/artifact-stage/spec-sidebar.js', encoding='utf-8').read()
PICK = os.path.expanduser('~/.claude/skills/icon-library/scripts/pick.py')
need = sorted(set(re.findall(r"mxsI\('([a-z0-9-]+)'", sb) + re.findall(r"mxcI\('([a-z0-9-]+)'", sb) + re.findall(r"MXS_ICO\[['\"]([a-z0-9-]+)['\"]\]", sb)))
src = open(D + '_mira/artifact-stage/build_stage.py', encoding='utf-8').read()
lst = re.search(r"for n in \[([^\]]*)\]", src).group(1)
names = sorted(set(re.findall(r"'([a-z0-9-]+)'", lst)) | set(need))
ico = {}
for n in names:
    out = subprocess.run(['python3', PICK, n, '--set', 'tabler', '--svg'], capture_output=True, text=True).stdout
    m = re.search(r'<svg.*?</svg>', out, re.S)
    if m: ico[n] = re.sub(r'\s+xmlns="[^"]*"', '', m.group(0))
assert sb.count('/*MXS_ICONS*/{}') == 1
block = '\n/*MXS-SIDEBAR:BEGIN*/\n' + sb.replace('/*MXS_ICONS*/{}', json.dumps(ico)) + '\n/*MXS-SIDEBAR:END*/\n'
d = re.sub(r'\n/\*MXS-SIDEBAR:BEGIN\*/[\s\S]*?/\*MXS-SIDEBAR:END\*/\n', '\n', d)
assert d.count('\nrailMount();\n') == 1
d = d.replace('\nrailMount();\n', block + 'railMount();\n', 1)
boot = "var m=/^#\\/c\\/(c1|c2|c3)$/.exec(location.hash); show(m?m[1]:'new');"
dflt = ("var m=/^#\\/c\\/(c1|c2|c3)$/.exec(location.hash); show(m?m[1]:'new');"
        "/*MXS-DEFAULT*/try{ if(!window.__MXSPEC){ mxsInit('o2'); MXS.fopt='4'; MXS.gpos='sec'; MXS.fpos='sec'; MXS.cdrag=true; mxsCDragWire(); MXS.gdrag=true; mxsGDragWire();"
        " mxsTog('o2-tog'); MXC.drop=true; mxcWire('o3'); mxsPaint(); if(m) show(m[1]); } }catch(e){ if(window.console) console.error('mxs default', e); }")
d = re.sub(r"/\*MXS-DEFAULT\*/try\{[\s\S]*?console\.error\('mxs default', e\); \}", '', d)
assert d.count(boot) == 1; d = d.replace(boot, dflt, 1)
open(D + 'mira.html', 'w', encoding='utf-8').write(d)
print('icons', len(ico), 'size', len(d))
