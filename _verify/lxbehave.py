#!/usr/bin/env python3
"""lxbehave.py — drive every entry point of the Log Explorer module in all three
   files and report pass/fail.  Run it from inside _verify/:

       python3 lxbehave.py

   It strips the Agentation loader (it hangs headless runs), injects a probe that
   calls every lx*() function and asserts the DOM it produced, and prints the
   verdict as text — the result is read out of a <pre id="__probe"> block rather
   than <title>, because the module's own source contains "<title>" strings for
   the SVG tooltips and a title-based read picks those up instead."""
import os, re, subprocess, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
os.makedirs(OUT, exist_ok=True)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FILES = ["index copy.html", "index.html", "dashboard-picker-advanced.html"]

PROBE = r"""
<script>
window.__E=[];window.onerror=function(m,s,l){window.__E.push('onerror: '+m+' @'+l)};
function T(n,f){ try{ f(); }catch(e){ window.__E.push(n+': '+e.message); } }
window.addEventListener('load', function(){ setTimeout(function(){
  var R=[];
  function ck(n,c){ try{ R.push((c()?'ok ':'FAIL ')+n); }catch(e){ R.push('ERR '+n+' '+e.message); } }

  T('open module', function(){ selectModuleByName('Log Explorer'); });
  ck('view-logexp is on',      function(){ return document.getElementById('view-logexp').classList.contains('on'); });
  /* ⚠️ The log-sources panel (Type | Group tree) was REMOVED FROM OPTION 1 by annotation
     on 17 Aug 2026 and is still present in Options 2 and 3, so the lx block is no longer
     byte-identical across the three. Its checks are skipped where it does not exist —
     asserting a panel that was deliberately deleted is a false failure, not a regression. */
  var HASTREE = !!document.getElementById('lxTree');
  var skipped = 0;
  function ckt(n,c){ if (HASTREE) ck(n,c); else skipped++; }
  ckt('tree has 16 groups',    function(){ return document.querySelectorAll('#lxTree .lxtr:not(.k1):not(.k2)').length===16; });
  ck('bubbles drawn',          function(){ return document.querySelectorAll('#lxBub circle').length>50; });
  ck('bubble labels',          function(){ return document.querySelectorAll('#lxBub text').length>8; });
  ck('3 KPI tiles',            function(){ return document.querySelectorAll('#lxOv .lxkpi').length===3; });

  T('log search', function(){ lxTab('ls'); });
  ck('Log Search shown',       function(){ return document.getElementById('lxLs').style.display==='flex'; });
  ck('histogram bars',         function(){ return document.querySelectorAll('#lxHist rect').length===64; });
  ck('facet groups',           function(){ return document.querySelectorAll('#lxFacetList .lxfg').length===22; });
  ck('event rows',             function(){ return document.querySelectorAll('#lxRows tbody tr').length===60; });
  ck('parsed message',         function(){ return /^\{ event\.source:/.test(document.querySelector('#lxRows td.msg').textContent); });

  T('raw log on', function(){ lxRaw(1); });
  ck('raw message',            function(){ return !/^\{ event\.source:/.test(document.querySelector('#lxRows td.msg').textContent); });
  T('raw log off', function(){ lxRaw(0); });
  T('density line', function(){ lxDens('line'); });
  ck('dense class',            function(){ return document.body.classList.contains('lxdense'); });
  T('density wrap', function(){ lxDens('wrap'); });

  T('facet pick', function(){ lxFacetPick('event.severity','Notice'); });
  ck('facet marked',           function(){ return document.querySelectorAll('#lxFacetList .lxfr.on').length===1; });
  T('facet unpick', function(){ lxFacetPick('event.severity','Notice'); });

  T('row detail', function(){ lxOpenRow(0); });
  ck('detail open',            function(){ return document.getElementById('lxDet').classList.contains('on'); });
  ck('4 summary cells',        function(){ return document.querySelectorAll('#lxDetSum .lxsc').length===4; });
  ck('attr rows',              function(){ return document.querySelectorAll('#lxDetBody .lxattr tr').length>=5; });
  T('json view', function(){ lxDetView('j'); });
  ck('json block',             function(){ return !!document.querySelector('#lxDetBody .lxjson'); });
  T('metric tab', function(){ lxDetTab('metric'); });
  ck('metric sections',        function(){ return document.querySelectorAll('#lxDetBody .lxmsec').length>=4; });
  ck('metric widgets',         function(){ return document.querySelectorAll('#lxDetBody .lxmw').length>=1; });
  T('close detail', function(){ lxDetTab('attr'); lxDetView('t'); lxCloseRow(); });
  ck('detail closed',          function(){ return !document.getElementById('lxDet').classList.contains('on'); });

  T('pattern tab', function(){ lxRes('pattern'); });
  ck('pattern rows',           function(){ return document.querySelectorAll('#lxPat tbody tr').length===7; });
  T('pattern fail', function(){ lxPatFail(); });
  ck('timeout state',          function(){ return /Request Timed out/.test(document.getElementById('lxPat').textContent); });
  T('pattern ok', function(){ lxPatFail(); lxRes('event'); });

  ['Chart','Grid','Top N','Gauge'].forEach(function(v){
    T('viz '+v, function(){ lxViz(v); });
    ck('viz '+v+' query builder', function(){ return document.querySelectorAll('#lxQb .lxqf').length===5; });
    ck('viz '+v+' body',          function(){ var e=document.getElementById('lxPlot'); return e && e.children.length>0; });
  });
  ck('Chart shapes = 8',       function(){ lxViz('Chart'); return document.querySelectorAll('#lxShapes .lxsh').length===8; });
  ck('TopN shapes = 6',        function(){ lxViz('Top N'); return document.querySelectorAll('#lxShapes .lxsh').length===6; });
  ck('Gauge has no shapes',    function(){ lxViz('Gauge'); return document.querySelectorAll('#lxShapes .lxsh').length===0; });
  ck('Save as Widget shown',   function(){ return document.getElementById('lxSaveW').style.display==='inline-block'; });
  T('shape switch', function(){ lxViz('Chart'); lxShape('column'); });
  ck('column bars',            function(){ return document.querySelectorAll('#lxPlot rect').length>10; });
  T('pie', function(){ lxViz('Top N'); lxShape('pie'); });
  ck('pie slices',             function(){ return document.querySelectorAll('#lxPlot path[fill^="#"]').length>3; });
  T('back to List', function(){ lxViz('List'); lxShape('spline'); });
  ck('List hides builder',     function(){ return document.getElementById('lxQb').style.display==='none'; });

  T('pre filters', function(){ lxPre(1); });
  ck('pre filters open',       function(){ return document.getElementById('lxPreBox').classList.contains('on'); });
  ck('criteria row',           function(){ return document.querySelectorAll('#lxPreBox .lxcrit').length===1; });
  T('add group', function(){ lxPreAddGroup(); lxPreAddCrit(0); });
  ck('2 groups 3 crit',        function(){ return document.querySelectorAll('#lxPreBox .lxgrp').length===2 &&
                                                  document.querySelectorAll('#lxPreBox .lxcrit').length===3; });
  T('reset', function(){ lxPreReset(); });
  ck('reset to 1/1',           function(){ return document.querySelectorAll('#lxPreBox .lxgrp').length===1 &&
                                                  document.querySelectorAll('#lxPreBox .lxcrit').length===1; });
  T('close pre', function(){ lxPre(0); });

  T('range menu', function(){ lxRangeMenu({stopPropagation:function(){}}); });
  ck('15 ranges',              function(){ return document.querySelectorAll('#lxRmenu .lxri').length===15; });
  T('pick 1h', function(){ lxPickRange('1h'); });
  ck('range chip = 1h',        function(){ return document.getElementById('lxRk').textContent==='1h' &&
                                                  document.getElementById('lxRl').textContent==='Last 1 Hour'; });
  ck('stamps moved',           function(){ return /11:57:18 AM/.test(document.getElementById('lxSt2').textContent) &&
                                                  /10:57:18 AM/.test(document.getElementById('lxSt1').textContent); });
  T('back to today', function(){ lxPickRange('today'); });

  if (HASTREE){
    T('tree group tab', function(){ lxTreeTab('group'); });
    ck('group tab empty state',  function(){ return /No log groups defined/.test(document.getElementById('lxTree').textContent); });
    T('tree type tab', function(){ lxTreeTab('type'); });
    /* ⚠️ OPTION 1 OPENS THE TREE FULLY COLLAPSED (request, 20 Aug 2026) while Options 2
       and 3 still expand group 0 on load, so this cannot assume either. Open the group
       only if it is not already open, then the type under it. Hardcoding one default
       fails on the other two files. */
    T('tree expand group', function(){ if (!LX.open['0']) lxTreeToggle('0'); });
    T('tree expand leaf', function(){ lxTreeToggle('0.0'); });
    ck('source level shown',     function(){ return document.querySelectorAll('#lxTree .lxtr.k2').length===1; });
    T('tree search', function(){ document.getElementById('lxTreeQ').value='windows'; lxTree(); });
    ck('search filters tree',    function(){ return document.querySelectorAll('#lxTree .lxtr').length>0 &&
                                                    document.querySelectorAll('#lxTree .lxtr').length<14; });
    T('clear tree search', function(){ document.getElementById('lxTreeQ').value=''; lxTree(); });
    /* ⚠️ THE SOURCES PANEL DEFAULT DIFFERS PER FILE TOO — Option 1 opens it collapsed
       (20 Aug 2026), Options 2 and 3 open it showing. So assert the TOGGLE, both ways,
       against whatever this file started with. */
    var wasOpen = document.body.classList.contains('lxopen');
    T('panel toggle', function(){ lxPanel(); });
    ck('panel toggles',          function(){ return document.body.classList.contains('lxopen') !== wasOpen; });
    T('panel back', function(){ lxPanel(); });
    ck('panel toggles back',     function(){ return document.body.classList.contains('lxopen') === wasOpen; });
  } else { skipped += 6; }

  T('live trail', function(){ lxLive(1); });
  ck('live trail shown',       function(){ return document.getElementById('lxLt').classList.contains('on'); });
  ck('console seeded',         function(){ return document.querySelectorAll('#lxCon .ln').length===26; });
  T('highlight', function(){ document.getElementById('lxLtHl').value='Connect'; lxLtPaint(); });
  ck('highlights painted',     function(){ return document.querySelectorAll('#lxCon .hl').length>0; });
  T('clear highlight', function(){ document.getElementById('lxLtHl').value=''; lxLtPaint(); });
  ck('highlights cleared',     function(){ return document.querySelectorAll('#lxCon .hl').length===0; });
  T('live cfg', function(){ lxLtCfg(1); });
  ck('cfg open',               function(){ return document.getElementById('lxLtCfg').classList.contains('on'); });
  T('cfg apply', function(){ lxLtCfgApply(); });
  T('back from live', function(){ lxLive(0); });
  ck('module back',            function(){ return document.getElementById('lxMod').style.display==='flex'; });

  T('flyout row: Log search', function(){ selectModuleByName('Log Explorer'); lxTab('ls'); });
  ck('still on Log Search',    function(){ return document.getElementById('lxLs').style.display==='flex'; });
  T('leave module', function(){ showView('dashboard'); });
  ck('dashboard back',         function(){ return document.getElementById('view-dashboard').classList.contains('on'); });

  var bad = R.filter(function(x){ return x.indexOf('ok ')!==0; });
  var msg = (bad.length||window.__E.length)
    ? ('RESULT ' + bad.length + ' of ' + R.length + ' FAILED :: ' + bad.join(' | ') + ' :: ERR ' + window.__E.join(' | '))
    : ('RESULT ALL ' + R.length + ' PASS' + (skipped ? ' (' + skipped + ' skipped: no log-sources panel in this option)' : ''));
  var d = document.createElement('pre'); d.id='__probe'; d.textContent = msg;
  document.body.appendChild(d);
}, 900); });
</script>
"""

for f in FILES:
    src = open(os.path.join(BASE, f), encoding="utf-8").read()
    # strip the dev-only Agentation loader (it hangs headless runs)
    src = re.sub(r"<script>[^<]*?agentation-embed\.js.*?</script>", "", src, flags=re.S)
    src = re.sub(r"<script[^>]*agentation-embed\.js[^>]*></script>", "", src)
    src = src.replace("</body>", PROBE + "</body>")
    tmp = os.path.join(OUT, "probe-" + f.replace(" ", "_"))
    open(tmp, "w", encoding="utf-8").write(src)
    r = subprocess.run(["perl", "-e", "alarm 60; exec @ARGV", CHROME, "--headless=new",
                        "--disable-gpu", "--no-sandbox",
                        "--user-data-dir=/tmp/cp-lx", "--virtual-time-budget=6000",
                        "--dump-dom", "file://" + tmp.replace(" ", "%20")],
                       capture_output=True, text=True, timeout=90)
    m = re.findall(r'<pre id="__probe">(.*?)</pre>', r.stdout, re.S)
    print("=" * 78)
    print(f)
    print(m[-1][:4000] if m else "NO PROBE OUTPUT (stderr: %s)" % r.stderr[-600:])
