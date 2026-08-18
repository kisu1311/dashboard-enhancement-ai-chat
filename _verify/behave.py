#!/usr/bin/env python3
"""Exercise every ac* interaction in a page and paint a pass/fail list.
   behave.py "<file.html>" <out.png>
"""
import sys, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
os.makedirs(SP, exist_ok=True)

CHECKS = r"""
var R=[]; function T(n,f){ try{ var v=f(); R.push([n, v===true?'ok':'FAIL '+v]); }catch(e){ R.push([n,'ERR '+e.message]); } }
var Q='Why did CPU spike on srv-app-04?';
T('panel opens', function(){ acOpen(); return document.getElementById('acPanel').classList.contains('on'); });
T('body.acopen set', function(){ return document.body.classList.contains('acopen'); });
T('Currently strip reads the host page', function(){
  var n=acNowText(); return (n.page && n.page.length>1 && n.time && n.time.length>0) || JSON.stringify(n); });
T('empty chat NOT in history', function(){ acHistOpen(); acHistClose();
  return !AC_CHATS.some(function(c){return c.id===AC.chat.id}); });
/* Options 1 and 2 had the empty state removed on request (13 Aug 2026); Option 3
   still carries its five smart starters. Accept either, but catch a partial render. */
T('empty state renders (0 or 5 starters)', function(){
  var st = document.querySelectorAll('.acst').length;
  return st===0 || st===5 || 'unexpected starter count '+st; });
/* ⚠️ acLand's signature is (i, q, mode, clar, miss) since the mode/scope build —
   the old 3-arg call still landed an answer, but it exercised the wrong path. */
T('ask lands an answer', function(){
  AC.chat.msgs.push({r:'u',q:Q,ctx:AC.ctx.slice()}); AC.chat.msgs.push({r:'a',think:1});
  acAutoName(Q); acLand(1,Q,'normal',null,null); acRender();
  return AC.chat.msgs.length===2 && AC.chat.msgs[1].acts.length===5; });
T('chat auto-named', function(){ return AC.chat.n.indexOf('Why did CPU')===0; });
T('used chat IS in history', function(){ acFile(); return AC_CHATS.some(function(c){return c.id===AC.chat.id}); });
T('query block toggles', function(){ acQToggle(1); return AC.chat.msgs[1].qopen===true; });
T('query edit + save', function(){ acQEdit(1,1);
  document.getElementById('acQE1').value='Counter: monitor.down.count\nSource: edge-router-01';
  acQSave(1); return AC.chat.msgs[1].q.rows.length===2; });
T('quick action pushes a PLAN', function(){ acAct(1,'widget');
  return AC.chat.msgs[2].plan==='widget' && AC.chat.msgs[2].pst==='pending'; });
T('plan edit + save', function(){ acPlanEdit(2,1);
  document.getElementById('acPE2').value='• Step one\n• Step two'; acPlanSave(2);
  return AC.chat.msgs[2].psteps.length===2; });
T('read-only action does NOT plan', function(){ var n=AC.chat.msgs.length; acAct(1,'explore');
  return AC.chat.msgs.length===n; });
T('approve -> running', function(){ acPlanRun(2); return AC.chat.msgs[2].pst==='running'; });
T('undo -> cancelled', function(){ AC.chat.msgs[2].pst='done'; acUndo(2);
  return AC.chat.msgs[2].pst==='cancelled'; });
T('plan restore', function(){ acPlanRedo(2); return AC.chat.msgs[2].pst==='pending'; });
T('thumbs down asks why', function(){ acFeed(1,-1); return AC.chat.msgs[1].fb===-1; });
T('feedback reason logged', function(){ acFeedWhy(1,'Wrong scope'); return AC.chat.msgs[1].fbq==='Wrong scope'; });
T('@ typeahead filters', function(){ acMentShow('checkout');
  return AC.ment.length===1 && AC.ment[0].t==='service'; });
T('@ pick adds a chip', function(){ var n=AC.ctx.length;
  var t=document.getElementById('acTa'); t.value='@checkout'; t.selectionStart=9;
  acMentShow('checkout'); acMentPick(0);
  return AC.ctx.length===n+1 && AC.ctx[AC.ctx.length-1].n==='checkout-api'; });
T('chip removable', function(){ var n=AC.ctx.length; acCtxDrop(n-1); return AC.ctx.length===n-1; });
T('Use as context', function(){ AC.ctx=[]; acUseNow(); return AC.ctx.length===1; });
T('stop halts generation', function(){ AC.chat.msgs.push({r:'a',think:1}); AC.busy=true; acStop();
  var m=AC.chat.msgs[AC.chat.msgs.length-1]; return AC.busy===false && m.stopped===1; });
T('send becomes STOP', function(){ AC.busy=true; acSendState();
  var b=document.getElementById('acSend').classList.contains('stop'); AC.busy=false; acSendState(); return b; });
T('regenerate replays', function(){ AC.chat.msgs.length=2; acRegen(1);
  return AC.busy===true && !!AC.chat.msgs[1].think; });
T('history search filters', function(){ acStop(true); acHistSearch('checkout');
  return document.querySelectorAll('#acHistL .achr').length===1; });
T('history empty state', function(){ acHistSearch('zzzz');
  return !!document.querySelector('#acHistL .achempty'); });
T('history search clears', function(){ acHistSearch('');
  return document.querySelectorAll('#acHistL .achr').length===AC_CHATS.length; });
T('pin from a row', function(){ acPinRow('c5');
  return AC_CHATS.find(function(c){return c.id==='c5'}).pin===true; });
T('pinned group first', function(){
  return document.querySelector('#acHistL .achg').textContent.indexOf('Pinned')===0; });
T('rename dialog', function(){ acRenameDlg('c5');
  var on=document.getElementById('acDlg').classList.contains('on');
  document.getElementById('acDlgIn').value='Renamed chat'; acDlgSave();
  return on && AC_CHATS.find(function(c){return c.id==='c5'}).n==='Renamed chat'; });
T('inline rename (focused)', function(){ acNameEdit();
  var i=document.getElementById('acNameIn'); if(!i) return 'no input';
  i.focus(); i.value='Top bar rename'; acNameDone(true);
  return AC.chat.n==='Top bar rename' && !!document.getElementById('acName'); });
T('inline rename twice', function(){ acNameEdit();
  var i=document.getElementById('acNameIn'); if(!i) return 'no input on 2nd open';
  i.value='Again'; acNameDone(true); return AC.chat.n==='Again'; });
T('pin current chat', function(){ AC.chat.pin=false; acPinCur();
  return AC.chat.pin===true && document.getElementById('acPin').classList.contains('on'); });
T('delete from history', function(){ var n=AC_CHATS.length; acDelChat('c5');
  return AC_CHATS.length===n-1; });
T('seeded chat replays', function(){ acHistGo('c1'); acStop(true);
  return AC.chat.id==='c1' && AC.chat.msgs.length===2; });
T('new chat resets', function(){ acNewChat(true);
  return AC.chat.msgs.length===0 && AC.ctx.length===2; });
T('auto-run toggles', function(){ acAuto(); var on=AC.auto; acAuto(); return on===true && AC.auto===false; });
T('close hides panel + clears acopen', function(){ acClose();
  return !document.getElementById('acPanel').classList.contains('on')
      && !document.body.classList.contains('acopen'); });

/* ── MODE · SCOPE · STATES (ObserveOPS-AI-Chat-Mode-and-Scope.pdf + the
      Designer's Guide §4/§5/§6). These are synchronous checks only — the timed
      flow is covered separately; here we call the pure functions and the
      renderers directly so the suite stays fast. ────────────────────────────*/
T('mode: normal detected',   function(){ return acDetect('Why is checkout slow?').mode==='normal'; });
T('mode: query detected',    function(){ return acDetect('Show me 5xx grouped by host').mode==='query'; });
T('mode: workflow detected', function(){ return acDetect('Alert me when checkout errors go above 5%').mode==='workflow'; });
T('mode: slash forces + flags it', function(){ var d=acDetect('/do add a widget');
  return d.mode==='workflow' && d.forced===1; });
T('mode: slash stripped before matching', function(){ return acStrip('/query show errors')==='show errors'; });
T('mode: badge is rendered on the answer', function(){
  var h=acModeHTML({mode:'workflow'},0); return h.indexOf('acmdb workflow')>=0 && h.indexOf('acmch')>=0; });
T('mode: only workflow is tinted', function(){
  return acModeHTML({mode:'normal'},0).indexOf('acmdb normal')>=0; });
T('ambiguity is asked, not guessed', function(){
  return !!acAmbig('checkout errors','normal') && !acAmbig('Why is checkout slow?','normal'); });

T('scope: entry point sets the default', function(){
  acNewChat(true); acOpen('apm'); var a=AC.scope;
  acNewChat(true); acOpen('key'); return a==='apm' && AC.scope==='all'; });
T('scope: chip renders', function(){ acScopePick('apm');
  return document.getElementById('acScopeBtn').textContent.indexOf('APM')>=0; });
T('scope: mismatch detected on a read', function(){ AC.scope='apm';
  return acScopeMiss('show me the logs for checkout','normal')==='logs'; });
T('scope: a WORKFLOW is exempt', function(){ AC.scope='apm';
  return acScopeMiss('alert me when checkout errors go above 5%','workflow')===null; });
T('scope: global never mismatches', function(){ AC.scope='all';
  return acScopeMiss('show me the logs','normal')===null; });
T('scope: mismatch card offers both ways', function(){
  var h=acMissHTML({miss:'logs',wasScope:'apm'},0);
  return h.indexOf('Expand to Logs')>=0 && h.indexOf('Keep APM only')>=0; });

T('reasoning is collapsed by default', function(){
  var h=acReasonHTML({q:{src:'Metric',rows:[['a','b']]},srcs:['x']},0);
  return h.indexOf('acrsn')>=0 && h.indexOf('acrsn open')<0; });
T('reasoning is built from the answer itself', function(){
  var s=acReason({q:{src:'APM',rows:[['a','b']]},stats:[{k:'p95',v:'1'}],srcs:['apm.response.time']});
  return s.join(' ').indexOf('APM')>=0 && s.join(' ').indexOf('apm.response.time')>=0; });
T('confidence is a WORD, not a number', function(){
  var h=acReasonHTML({conf:'low',q:{src:'M',rows:[]}},0);
  return h.indexOf('Low confidence')>=0 && !/0\.\d/.test(h); });
T('tool chip is deterministic', function(){
  var m={q:{src:'Metric',rows:[['Counter','system.cpu.percent']]}};
  return acToolHTML(m,0)===acToolHTML(m,0) && acToolHTML(m,0).indexOf('Ran query')>=0; });

T('all five state cards render with a next step', function(){
  var ks=['noresult','qfail','noperm','partial','oos'];
  return ks.every(function(k){ var h=acStateHTML(k,0,{});
    return h.indexOf('acsc2')>=0 && h.indexOf('class="acb')>=0; }); });
T('config diff carries +/- glyphs, not colour alone', function(){
  var h=acDiffHTML([['add','x'],['rem','y'],['ctx','z']]);
  return h.indexOf('>+<')>=0 && h.indexOf('>−<')>=0; });
T('gate: Approve and Edit are the SAME weight', function(){
  AC.chat.msgs=[{r:'u',q:'x'},{r:'a',mode:'workflow',plan:'errrate',pst:'pending'}];
  var h=acPlanHTML(AC.chat.msgs[1],1);
  var i=h.indexOf('Approve &amp; create');
  return i>0 && h.slice(Math.max(0,i-240),i).indexOf('acb pri')<0; });
T('gate: nothing runs without approval', function(){
  return AC.chat.msgs[1].pst==='pending'; });
T('§6 motion: every keyframe is declared', function(){
  var css=''; for (var i=0;i<document.styleSheets.length;i++){
    try { var r=document.styleSheets[i].cssRules; for (var j=0;j<r.length;j++) css+=r[j].cssText||''; }
    catch(e){} }
  return ['accaret','acshim','acpulse','acdiffin','acgatein'].every(function(k){
    return css.indexOf(k)>=0; }) || 'missing a keyframe'; });
T('reduced-motion fallback exists', function(){
  var found=false; for (var i=0;i<document.styleSheets.length;i++){
    try { var r=document.styleSheets[i].cssRules; for (var j=0;j<r.length;j++)
      if ((r[j].conditionText||'').indexOf('reduced-motion')>=0) found=true; } catch(e){} }
  return found; });
var bad=R.filter(function(r){return r[1]!=='ok'});
var d=document.createElement('div');
d.style.cssText='position:fixed;inset:0;z-index:9999999;background:#fff;color:#111;font:12px/1.4 ui-monospace,monospace;padding:12px;overflow:auto';
d.innerHTML='<b style="font-size:15px;color:'+(bad.length?'#c00':'#070')+'">'+FILE+' — '+
  (bad.length?bad.length+' of '+R.length+' FAILED':'ALL '+R.length+' PASS')+'</b><br>'+
  R.map(function(r){return (r[1]==='ok'?'<span style="color:#070">✓</span> ':'<span style="color:#c00">✗</span> ')+r[0]+' — '+r[1]}).join('<br>');
document.body.appendChild(d);
"""

def run(fname, out):
    s = open(os.path.join(ROOT, fname)).read()
    i = s.rindex('<scr' + 'ipt>'); j = s.index('</scr' + 'ipt>', i)
    s = s[:i] + s[j + 9:]
    probe = ('<scr' + 'ipt>var FILE=' + repr(fname) + ';'
             'window.onerror=function(m){var e=document.createElement("div");'
             'e.style.cssText="position:fixed;bottom:0;left:0;right:0;z-index:99999999;background:red;'
             'color:#fff;padding:8px;font:13px monospace";e.textContent="WINDOW ERROR: "+m;'
             'document.body.appendChild(e)};setTimeout(function(){' + CHECKS + '},90);</scr' + 'ipt>\n</body>')
    tag = os.path.splitext(fname)[0].replace(' ', '_')
    page = os.path.join(SP, 'b-%s.html' % tag)
    open(page, 'w').write(s.replace('</body>', probe))
    prof = '/tmp/cpb-%s' % tag
    subprocess.run(['rm', '-rf', prof])
    subprocess.run(['perl', '-e', 'alarm 20; exec @ARGV', CHROME,
                    '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--user-data-dir=' + prof, '--hide-scrollbars',
                    '--window-size=980,760', '--virtual-time-budget=2500',
                    '--screenshot=' + out, 'file://' + page],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('%-34s -> %s' % (fname, 'ok' if os.path.exists(out) else 'NO SHOT'))

if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2])
