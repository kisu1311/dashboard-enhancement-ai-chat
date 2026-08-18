#!/usr/bin/env python3
"""Build a probe copy of an ObserveOps prototype and screenshot it at a size.

   shoot.py <file.html> <scene> <W> <H> <out.png>
   Scenes: closed | open | empty | plan | history
   Strips the Agentation loader (it hangs headless runs) and injects the scene.
"""
import sys, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_out")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
os.makedirs(SP, exist_ok=True)

ANSWER = """acOpen();
  var q='Why did CPU spike on srv-app-04?';
  AC.chat.msgs.push({r:'u',q:q,ctx:AC.ctx.slice()});
  AC.chat.msgs.push({r:'a',think:1});
  acAutoName(q); acLand(1,q,null); acRender();"""

SCENES = {
  'closed':  "",
  'empty':   "acOpen();",
  'open':    ANSWER,
  'query':   ANSWER + "\n AC.chat.msgs[1].qopen=1; acRender();",
  'plan':    """acOpen();
     var q='Create a widget for CPU by host';
     AC.chat.msgs.push({r:'u',q:q,ctx:AC.ctx.slice()});
     AC.chat.msgs.push({r:'a',think:1});
     acAutoName(q); acLand(1,q,'widget'); acRender();
     document.getElementById('acBody').scrollTop=0;""",
  'history': "acOpen(); acHistOpen();",
  # Log Explorer module (lx*) — cloned from live 8.2.6 /log/
  'lx-ov':     "selectModuleByName('Log Explorer');",
  'lx-search': "selectModuleByName('Log Explorer'); lxTab('ls');",
  'lx-detail': "selectModuleByName('Log Explorer'); lxTab('ls'); lxOpenRow(1);",
  'lx-metric': "selectModuleByName('Log Explorer'); lxTab('ls'); lxOpenRow(1); lxDetTab('metric');",
  'lx-json':   "selectModuleByName('Log Explorer'); lxTab('ls'); lxOpenRow(1); lxDetView('j');",
  'lx-chart':  "selectModuleByName('Log Explorer'); lxTab('ls'); lxViz('Chart');",
  'lx-topn':   "selectModuleByName('Log Explorer'); lxTab('ls'); lxViz('Top N'); lxShape('column');",
  'lx-gauge':  "selectModuleByName('Log Explorer'); lxTab('ls'); lxViz('Gauge');",
  'lx-pattern':"selectModuleByName('Log Explorer'); lxTab('ls'); lxRes('pattern');",
  'lx-pre':    "selectModuleByName('Log Explorer'); lxTab('ls'); lxPre(1);",
  'lx-range':  "selectModuleByName('Log Explorer'); lxRangeMenu({stopPropagation:function(){}});",
  'lx-live':   "selectModuleByName('Log Explorer'); lxLive(1);",
  # setTheme() persists to localStorage as well as painting — a bare data-theme
  # attribute gets overwritten when the page's own init() reads localStorage later
  'lx-light':  "setTheme('light'); selectModuleByName('Log Explorer'); lxTab('ls');"
               "setTimeout(function(){setTheme('light')},300);",
  'lx-lightov':"setTheme('light'); selectModuleByName('Log Explorer');"
               "setTimeout(function(){setTheme('light')},300);",
}

def build(fname, scene, tag):
    s = open(os.path.join(ROOT, fname)).read()
    i = s.rindex('<scr' + 'ipt>'); j = s.index('</scr' + 'ipt>', i)
    s = s[:i] + s[j + 9:]                      # drop the Agentation loader
    code = SCENES[scene]
    probe = ('<scr' + 'ipt>window.onerror=function(m){var e=document.createElement("div");'
             'e.style.cssText="position:fixed;bottom:0;left:0;right:0;z-index:99999999;background:red;'
             'color:#fff;padding:6px;font:12px monospace";e.textContent="JS ERROR: "+m;'
             'document.body.appendChild(e)};'
             'setTimeout(function(){try{' + code + '}catch(e){'
             'var d=document.createElement("div");d.style.cssText="position:fixed;bottom:0;left:0;right:0;'
             'z-index:99999999;background:red;color:#fff;padding:6px;font:12px monospace";'
             'd.textContent="SCENE ERROR: "+e.message;document.body.appendChild(d)}},80);'
             '</scr' + 'ipt>\n</body>')
    out = os.path.join(SP, 'p-%s.html' % tag)
    open(out, 'w').write(s.replace('</body>', probe))
    return out

def shoot(fname, scene, w, h, out):
    tag = '%s-%s' % (os.path.splitext(fname)[0].replace(' ', '_'), scene)
    page = build(fname, scene, tag)
    prof = '/tmp/cp-%s' % tag
    subprocess.run(['rm', '-rf', prof])
    subprocess.run(['perl', '-e', 'alarm 20; exec @ARGV', CHROME,
                    '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--user-data-dir=' + prof, '--hide-scrollbars',
                    '--window-size=%d,%d' % (w, h), '--virtual-time-budget=2500',
                    '--screenshot=' + out, 'file://' + page],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    ok = os.path.exists(out)
    print('%-34s %-8s %4dx%-4d %s' % (fname, scene, w, h, 'ok' if ok else 'NO SHOT'))

if __name__ == '__main__':
    shoot(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5])
