#!/usr/bin/env python3
"""Assert layout at all seven target resolutions in ONE headless run.

Each resolution gets an iframe sized exactly to it. Media queries and layout
inside an iframe evaluate against the IFRAME's viewport, not the window's, so
this measures the real thing. The iframes are kept at opacity ~0 behind a
verdict overlay, which is the only thing the screenshot needs to show.

   harness.py "<file.html>" <scene> <out.png>
"""
import sys, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
os.makedirs(SP, exist_ok=True)
RES = [(1280,720),(1366,768),(1440,900),(1536,864),(1600,900),(1680,1050),(1920,1080)]

sys.path.insert(0, SP)
from shoot import build, SCENES                      # reuse the probe builder

CHECKS = r"""
function checks(w, d, W, H){
  var out = [];
  function C(n, f){ try{ var v=f(); out.push([n, v===true ? 'ok' : 'FAIL '+v]); }
                    catch(e){ out.push([n,'ERR '+e.message]); } }
  var panel = d.getElementById('acPanel');
  C('no js error', function(){ return !d.querySelector('div[style*="background: red"]') || 'error bar painted'; });
  C('panel present', function(){ return !!panel || 'missing'; });
  C('no page h-overflow', function(){
    var o = d.documentElement.scrollWidth - W; return o <= 1 || 'overflows by '+o+'px'; });
  C('panel fits height', function(){
    var r = panel.getBoundingClientRect();
    return (r.top >= -1 && r.bottom <= H+1) || 'top '+Math.round(r.top)+' bottom '+Math.round(r.bottom)+' vs '+H; });
  C('panel has no h-scroll', function(){
    var o = panel.scrollWidth - panel.clientWidth; return o <= 1 || 'inner overflow '+o+'px'; });
  C('composer visible', function(){
    var c = d.querySelector('.accw'); var r = c.getBoundingClientRect();
    return r.bottom <= H+1 || 'bottom '+Math.round(r.bottom)+' vs '+H; });
  C('disclaimer not clipped', function(){
    var c = d.querySelector('.acdis'); var r = c.getBoundingClientRect();
    return r.bottom <= H+1 || 'bottom '+Math.round(r.bottom)+' vs '+H; });
  C('message list >= 200px', function(){
    var b = d.getElementById('acBody');
    return b.clientHeight >= 200 || 'only '+b.clientHeight+'px'; });
  C('canvas >= 430px', function(){
    var c = d.querySelector('#dcanvas, .dcanvas, #dashGrid, .dgrid12, .canvas, #canvas');
    if (!c) return 'no canvas found';
    var cw = Math.round(c.getBoundingClientRect().width);
    return cw >= 430 || 'only '+cw+'px'; });
  C('composer >= 240px wide', function(){
    var t = d.querySelector('textarea.acta');
    var tw = Math.round(t.getBoundingClientRect().width);
    return tw >= 240 || 'only '+tw+'px'; });
  C('starters all visible', function(){
    var st = d.querySelectorAll('.acst'); if (!st.length) return true;   /* not the empty scene */
    var b = d.getElementById('acBody').getBoundingClientRect();
    var last = st[st.length-1].getBoundingClientRect();
    return last.bottom <= b.bottom+1 || 'last starter overflows by '+Math.round(last.bottom-b.bottom)+'px'; });
  return out;
}
"""

def harness(fname, scene, out):
    tag = os.path.splitext(fname)[0].replace(' ', '_') + '-' + scene
    page = build(fname, scene, tag)
    frames = ''.join(
        '<iframe id="f%d" src="file://%s" style="position:fixed;left:0;top:0;'
        'width:%dpx;height:%dpx;border:0"></iframe>' % (n, page, w, h)
        for n, (w, h) in enumerate(RES))
    html = """<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">
<div style="position:fixed;inset:0;opacity:.001;pointer-events:none;overflow:hidden">%s</div>
<div id="out" style="position:fixed;inset:0;z-index:9;background:#fff;color:#111;
  font:11.5px/1.42 ui-monospace,monospace;padding:12px;overflow:auto"></div>
<script>
%s
var RES = %s;
setTimeout(function(){
  var html = '', tot = 0, bad = 0;
  RES.forEach(function(r, n){
    var fr = document.getElementById('f'+n);
    var w = fr.contentWindow, d = fr.contentDocument;
    var rows;
    try { rows = checks(w, d, r[0], r[1]); }
    catch(e){ rows = [['harness', 'ERR ' + e.message]]; }
    var f = rows.filter(function(x){ return x[1] !== 'ok'; });
    tot += rows.length; bad += f.length;
    html += '<div style="margin:7px 0 2px;font-weight:700;font-size:12.5px">' + r[0] + '×' + r[1] +
            ' <span style="color:' + (f.length ? '#c00' : '#070') + '">' +
            (f.length ? f.length + ' FAILED' : 'all ' + rows.length + ' ok') + '</span></div>';
    if (f.length) html += f.map(function(x){
      return '<div style="color:#c00;padding-left:12px">✗ ' + x[0] + ' — ' + x[1] + '</div>'; }).join('');
  });
  document.getElementById('out').innerHTML =
    '<div style="font-size:15px;font-weight:700;color:' + (bad ? '#c00' : '#070') + '">' +
    '%s · %s — ' + (bad ? bad + ' of ' + tot + ' FAILED' : 'ALL ' + tot + ' PASS') + '</div>' + html;
}, 2000);
</script></body>""" % (frames, CHECKS,
                       '[' + ','.join('[%d,%d]' % (w, h) for w, h in RES) + ']',
                       fname, scene)
    hp = os.path.join(SP, 'h-%s.html' % tag)
    open(hp, 'w').write(html)
    prof = '/tmp/cph-%s' % tag
    subprocess.run(['rm', '-rf', prof])
    subprocess.run(['perl', '-e', 'alarm 40; exec @ARGV', CHROME,
                    '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--allow-file-access-from-files',
                    '--user-data-dir=' + prof, '--hide-scrollbars',
                    '--window-size=1000,900', '--virtual-time-budget=6000',
                    '--screenshot=' + out, 'file://' + hp],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(('%-34s %-8s -> %s' % (fname, scene, 'ok' if os.path.exists(out) else 'NO SHOT')))

if __name__ == '__main__':
    harness(sys.argv[1], sys.argv[2], sys.argv[3])
