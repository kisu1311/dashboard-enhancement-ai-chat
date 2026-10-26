#!/usr/bin/env python3
"""Build _topology/topology.html from topology.src.html.

    python3 _topology/build_topology.py

Inlines, so the page stays one self-contained file that opens over file://:
  @@TOKENS@@     design-tokens/observeops-tokens.css (light on :root, dark on [data-theme='dark-theme'])
  @@ICONS@@      the UI glyphs read out of the live Topology page (icons.json, 48-grid, fill=currentColor)
  @@MONICONS@@   node glyphs from observeops-icons/monitors/ — recoloured to currentColor so the
                 canvas and the tree tint them with tokens (the brand fills are dropped, see below)
  @@EMPTY@@      the live empty-state illustration, every fill mapped onto the DS token that carries it
  @@I:name@@     an inline icon from @@ICONS@@

icons.json and empty.svg are the harvest (21 Oct 2026, Playwright against build 10.0.1); they live
beside this script so a rebuild needs no access to the instance.
"""
import json, re, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent                      # /ObseverOps
SRC = HERE / 'topology.src.html'
OUT = HERE / 'topology.html'

tokens = (ROOT / 'design-tokens' / 'observeops-tokens.css').read_text()
palette = json.loads((ROOT / 'design-tokens' / 'palette.json').read_text())['colors']
icons = json.loads((HERE / 'icons.json').read_text())

# extra glyphs the live page did not carry on screen when it was read
for name, path in [('times', 'common/shapes-symbols/times.svg'), ('check', 'common/status-severity-health/check.svg'), ('lock', 'settings/security-access/lock-alt.svg'), ('image', 'common/media-device/image.svg')]:
    s = (ROOT / 'observeops-icons' / path).read_text()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    icons[name] = {'vb': vb, 'd': re.findall(r'\sd="([^"]+)"', s)}

def ui(name):
    i = icons[name]
    return f'<svg class="i" viewBox="{i["vb"]}" aria-hidden="true">' + ''.join(f'<path d="{d}"/>' for d in i['d']) + '</svg>'

# node glyphs. ⚠️ A white-filled path is the SYMBOL drawn on the vendor's coloured tile (the switch's
# crossed arrows); used as a currentColor glyph inside a node ring, the tile would paint a solid square,
# so when a mark has white paths only those are kept. Otherwise every painted path is the silhouette.
MON = {
    'switch': 'monitors/network-devices/switch.svg', 'router': 'monitors/network-devices/router.svg',
    'vm': 'monitors/virtualization/vm.svg', 'vmware-esxi': 'monitors/virtualization/vmware-esxi.svg',
    'vcenter': 'monitors/virtualization/vcenter.svg', 'citrix-xen': 'monitors/virtualization/citrix-xen.svg',
    'nutanix': 'monitors/virtualization/nutanix.svg', 'prism': 'monitors/virtualization/prism.svg',
    'linux': 'monitors/operating-systems/linux.svg', 'windows': 'monitors/operating-systems/windows.svg',
    'proxmox': 'monitors/virtualization/proxmox-ve-cluster.svg', 'aws-cloud': 'monitors/aws/aws-cloud.svg',
    'azure-cloud': 'monitors/azure/azure-cloud.svg', 'oracle-cloud': 'monitors/oracle-cloud/oracle-cloud.svg', 'firewall': 'monitors/security-identity/firewall.svg',
}
mon = {}
for k, p in MON.items():
    s = (ROOT / 'observeops-icons' / p).read_text()
    paths = re.findall(r'<path\b[^>]*>', s)
    white = [x for x in paths if re.search(r'fill="#fff(fff)?"', x, re.I)]
    keep = white or [x for x in paths if 'fill="none"' not in x]
    ds = [re.search(r'\sd="([^"]+)"', x).group(1) for x in keep if re.search(r'\sd="', x)]
    mon[k] = '<svg class="i" viewBox="0 0 512 512" aria-hidden="true">' + ''.join(f'<path d="{d}"/>' for d in ds) + '</svg>'
mon['server'] = mon['vm']

# the TREE shows the product's marks in their own brand colours, as live does (request, 21 Oct 2026: "the icon
# colour is not same … improve the icon colour"). Verbatim files; only their <defs> ids are namespaced, because
# several marks use id="a"/"b" and a second copy on screen would steal the first one's gradient.
monc = {}
for k, p in MON.items():
    s2 = (ROOT / 'observeops-icons' / p).read_text()
    s2 = re.sub(r'<\?xml[^>]*>', '', s2)
    ids = set(re.findall(r'\sid="([^"]+)"', s2))
    for i in ids:
        s2 = s2.replace(f'id="{i}"', f'id="mc-{k}-{i}"').replace(f'url(#{i})', f'url(#mc-{k}-{i})').replace(f'href="#{i}"', f'href="#mc-{k}-{i}"')
    s2 = re.sub(r'<svg\b', '<svg class="i" aria-hidden="true"', s2, count=1)
    monc[k] = s2
monc['server'] = monc['vm']
# the topology glyph is on a 48 grid; node glyphs are drawn in a 512 box, so it is scaled into it (a design's container node)
mon['topology'] = '<svg class="i" viewBox="0 0 512 512" aria-hidden="true"><g transform="scale(10.6667)">' + ''.join(f'<path d="{d}"/>' for d in icons['topology']['d']) + '</g></svg>'

# empty-state art: map every literal fill/stroke onto a token that carries exactly that colour
def tok(hexv):
    h = hexv.lower()
    if len(h) == 4: h = '#' + ''.join(c * 2 for c in h[1:])
    names = palette.get(h) or palette.get(h.upper())
    if names:
        pick = [x for x in names if 'neutral' in x] or names   # the ramp token, not a field-state one
        n = pick[0].split(' ')[0]
        return f'var({n})'
    return 'var(--neutral-light)'
empty = (HERE / 'empty.svg').read_text()
empty = re.sub(r'\s(fill|stroke)="(#[0-9a-fA-F]{3,6})"', lambda m: f' style="{m.group(1)}:{tok(m.group(2))}"', empty)
empty = re.sub(r'\sdata-v-[0-9a-f]+=""', '', empty)

html = SRC.read_text()
html = html.replace('/*@@TOKENS@@*/', tokens)
html = html.replace('/*@@ICONS@@*/', json.dumps({k: ui(k) for k in icons}))
html = html.replace('/*@@MONICONS@@*/', json.dumps(mon))
html = html.replace('/*@@MONCOLOR@@*/', json.dumps(monc))
html = html.replace('@@EMPTY@@', empty)
html = html.replace('/*@@DATA@@*/', (HERE / 'data.json').read_text())
html = re.sub(r'@@I:([a-z0-9-]+)@@', lambda m: ui(m.group(1)), html)
OUT.write_text(html)
print('wrote', OUT, len(html), 'bytes')
