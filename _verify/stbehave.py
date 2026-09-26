#!/usr/bin/env python3
"""stbehave.py — assert the shared Settings module (`setting.js`) mounts and
   works on every page that loads it.  Run from inside _verify/:

       python3 stbehave.py            # every page carrying the module
       python3 stbehave.py index.html # just one

   Same shape as lxbehave.py: a probe copy in _out/ with a <base href> so the page's
   relative assets (setting.js, _ds/) resolve, the Agentation loader stripped, the
   verdict read out of a <pre id="__probe"> block, and Chrome killed by `perl -e alarm`
   (a plain --dump-dom never returns on the larger files)."""
import os, re, subprocess, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
os.makedirs(OUT, exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# ⚠️ THE MARKER IS THE SCRIPT TAG, NOT THE SUBSTRING "setting.js" (17 Sep 2026).
# A bare substring also matches a page that only MENTIONS the file in a comment —
# `Global_ai.html` names it three times in prose and loads none of it, so discovery
# pulled that page in and every one of the 21 assertions failed on it, on a page that
# is correct. Matching the tag asks the question the suite actually means.
# ⚠️ 26 Sep 2026: `setting.js` is gone and the module is INLINE in `setting.html`, which is the
# only page that carries it; the marker is its inline stylesheet. The option pages load only
# `setting-nav.js` now (the tree + the doors into setting.html) and are not in this suite.
ALL = [f for f in sorted(os.listdir(BASE))
       if f.endswith(".html") and not f.startswith("_")
       and '<style id="settings-css">' in open(os.path.join(BASE, f), encoding="utf-8").read()]
FILES = sys.argv[1:] or ALL

PROBE = r"""
<script>
(function(){
  var R=[],E=[];
  window.onerror=function(m,s,l){E.push('onerror: '+m+' @'+l)};
  function ok(n,c,d){R.push((c?'ok   ':'FAIL ')+n+((d!==undefined&&!c)?'  ['+d+']':''))}
  window.addEventListener('load',function(){ setTimeout(function(){
   try{
    var s=document.getElementById('view-settings');
    ok('#view-settings injected', !!s);
    ok('injected in authored position', !!(s&&s.nextElementSibling&&
        /^view-(manage|logexp)$/.test(s.nextElementSibling.id||'')),
        s&&s.nextElementSibling?s.nextElementSibling.id:'no sibling');
    ok('stInit/stOpen are functions', typeof stInit==='function'&&typeof stOpen==='function');
    ok('ST_TREE has 19 categories', typeof ST_TREE!=='undefined'&&ST_TREE.length===19,
        typeof ST_TREE!=='undefined'?ST_TREE.length:'undefined');
    ok('ST_ICO populated', typeof ST_ICO!=='undefined'&&Object.keys(ST_ICO).length>20);
    ok('ST_PAGES: License registered', !!ST_PAGES['My Account › License']);
    /* derived from ST_TREE, not typed — stMainPaint looks a page up as "<cat> › <page>",
       so a hardcoded name here goes stale the moment the page is renamed and reports a
       working module as broken (it did, on the Overview → AI Provider rename). */
    var agCat = ST_TREE.filter(function(c){return c.n==='Agentic AI'})[0];
    var agPg  = agCat && agCat.subs[0][0];
    ok('ST_PAGES: Agentic AI registered', !!agPg && !!ST_PAGES['Agentic AI › '+agPg], agPg);
    ok('ST_PAGES: 3 Compliance pages', ['Compliance Policy','Benchmark','Rules']
        .every(function(p){return !!ST_PAGES['Compliance Settings › '+p]}));
    ok('obs-* elements registered', !!customElements.get('obs-table'));
    /* the stylesheet reached the page: .stnav has its authored width, not auto */
    stOpen('My Account','My Profile');
    var nav=document.querySelector('#view-settings .stnav');
    ok('settings stylesheet applied', !!nav&&parseFloat(getComputedStyle(nav).width)>100,
        nav?getComputedStyle(nav).width:'no .stnav');
    ok('settings view is on', s.classList.contains('on'));
    ok('19 categories rendered', document.querySelectorAll('#stList .stcat').length===19,
        document.querySelectorAll('#stList .stcat').length);
    ok('My Profile form rendered', !!document.getElementById('stSaveBtn')&&
        !!document.getElementById('stAv'));
    stOpen('My Account','License');
    ok('License page rendered', !!document.getElementById('licPage'));
    ok('License tabs rendered', !!document.querySelector('#licPage obs-tabs'));
    stOpen('Compliance Settings','Compliance Policy');
    ok('Compliance grid rendered', !!document.querySelector('#stMain .stcgrid'));
    stOpen('Agentic AI', agPg);
    ok('Agentic AI page rendered', !!document.getElementById('agPage'));
    ok('Agentic AI usage table', !!document.querySelector('#agPage obs-table'));
    /* the list search still works (it is the module's own, not the host's) */
    stOpen('My Account','My Profile');
    stSearch('utility');
    ok('list search narrows', document.querySelectorAll('#stList .stcat').length<19,
        document.querySelectorAll('#stList .stcat').length);
    stSearch('');
    ok('clearing search restores 19', document.querySelectorAll('#stList .stcat').length===19);
    ok('no console errors', E.length===0, E.join(' | '));
   }catch(err){ R.push('FAIL threw: '+err.message) }
   var n=R.filter(function(x){return x[0]==='F'}).length;
   var pre=document.createElement('pre'); pre.id='__probe';
   pre.textContent=(n?('RESULT '+n+' of '+R.length+' FAILED'):('RESULT ALL '+R.length+' PASS'))
                   +'\n'+R.join('\n');
   document.body.appendChild(pre);
  },1500)});
})();
</script>
"""

def _rebase(src, root):
    return src.replace('<head>', '<head>\n<base href="file://%s/">' % root.replace(' ', '%20'), 1)

fails = 0
for f in FILES:
    src = open(os.path.join(BASE, f), encoding="utf-8").read()
    src = _rebase(src, BASE)
    src = re.sub(r"<script>[^<]*?agentation-embed\.js.*?</script>", "", src, flags=re.S)
    src = re.sub(r"<script[^>]*agentation-embed\.js[^>]*></script>", "", src)
    src = src.replace("</body>", PROBE + "</body>")
    tmp = os.path.join(OUT, "stprobe-" + f.replace(" ", "_"))
    open(tmp, "w", encoding="utf-8").write(src)
    r = subprocess.run(["perl", "-e", "alarm 60; exec @ARGV", CHROME, "--headless=new",
                        "--disable-gpu", "--no-sandbox",
                        "--user-data-dir=/tmp/cp-st", "--virtual-time-budget=8000",
                        "--dump-dom", "file://" + tmp.replace(" ", "%20")],
                       capture_output=True, text=True, timeout=90)
    m = re.findall(r'<pre id="__probe">(.*?)</pre>', r.stdout, re.S)
    print("=" * 78); print(f)
    if m:
        import html; out = html.unescape(m[-1])[:4000]
        print(out)
        if "ALL" not in out.split("\n")[0]: fails += 1
    else:
        print("NO PROBE OUTPUT (stderr: %s)" % r.stderr[-400:]); fails += 1
print("\n%d of %d pages FAILED" % (fails, len(FILES)))
