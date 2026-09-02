#!/usr/bin/env python3
"""
DS conformance for the Agentic AI screen — the ONE surface in this repo built from the real
`obs-*` components. Run from inside `_verify/`:

    python3 dsconf.py                      # all three scenes, Option 1
    python3 dsconf.py "../dashboard-grouped-sidebar.html"   # another option file

⚠️ RUNNING THE CHECKER ON A WHOLE OPTION FILE IS MEANINGLESS, and it will tell you so with a
   confident 49/100. These pages carry 16 views plus every drawer in ONE DOM and open on the
   Dashboard — which is hand-built from this file's own tokens, so the run measures
   `0 DS components · 276 raw controls` of chrome that was never claimed to be DS. This script
   builds a throwaway copy per scene that isolates `#agPage` and hands THAT to the checker.

Two adjustments the isolation makes, both of which are the difference between 49 and 100:

  · THE SHELL IS NOT THE SCREEN. `#agPage`'s surviving ancestors are `.shell` (64px of
    icon-rail padding) and `.stmain` (20px) — the only two off-scale values the checker could
    find. They are host chrome, so their padding is zeroed.
  · THE THEME CONVENTION IS INVERTED. The DS ships light on `:root` and dark under
    `[data-theme='dark-theme']`; this prototype is the other way round (see `_ds/README.md`).
    Without an adapter the checker's light↔dark probe cannot flip the page at all, and it
    compares this file's DARK render against the LIGHT reference library — which reads out as
    two bogus "variant looks overridden" hits (`obs-tag` bg `#2b394f` = `--tag-bg-color` dark;
    `obs-button` primary bg white = `--primary` dark). Both are correct dark values.
    The adapter re-emits the file's OWN two token blocks under the DS's convention, so
    nothing is invented — the same values, keyed the way the checker expects.

⚠️ `--declare chart` IS REQUIRED for the configured scene. The three trend SVGs are the
   screen's one declared `list_gaps` gap; they carry `class="agchart"` so the checker resolves
   the archetype from the class rather than falling back to a generic `graphic` that no
   declaration covers. `ds-gaps.json` is the manifest form of the same thing.
"""
import re, subprocess, sys, os, pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
SRC  = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "index.html"
OUT  = HERE / "_out"
CHK  = ROOT / "node_modules/@mtdt/observeops-ds-spec/conformance/ds-conformance.mjs"

# ⚠️ ONE SCENE WHILE THE SCREEN IS ONE HEADER. The cleared build's `wizard` and `connected`
#    scenes drove `agWizOpen()` / `agWizFinish()`, which no longer exist — a scene naming a
#    function the page does not have throws inside the harness, not in the checker, and reads
#    as a tooling failure rather than "that state is not built yet". Add a row back the moment
#    its state exists; the second field is just JS run after `stOpen`.
SCENES = [
    ("overview",  "",            "Overview"),
    ("config",    "agConfig();", "Configure AI provider"),
]

def block(s, sel_pat):
    """the declaration body of a rule, brace-matched — the token blocks contain nested rules"""
    m = re.search(sel_pat, s)
    i = s.index('{', m.start())
    depth, j = 0, i
    while True:
        if s[j] == '{': depth += 1
        elif s[j] == '}':
            depth -= 1
            if depth == 0: break
        j += 1
    return s[i + 1:j]

def tokens_source(src_text):
    """The scoped DS token block. ⚠️ IT MOVED. On 1 Sep 2026 another session extracted the
    st/stc/ag stylesheet out of `index.html` into `_settings-module.css`, so the block is
    no longer in the HTML for Option 1 — and this script's guard read the HTML, decided there
    was no screen, and SILENTLY SKIPPED the most-edited file while still printing a pass.
    Options 2 and 3 are not migrated, so both shapes have to work."""
    if '\n#agPage{' in src_text:
        return src_text
    ext = ROOT / '_settings-module.css'
    if ext.exists():
        return ext.read_text(encoding='utf-8')
    return src_text

def build(src_text, wiz, dest):
    tok   = tokens_source(src_text)
    dark  = block(tok, r'\n#agPage\{')
    light = block(tok, r'\nhtml\[data-theme="light"\] #agPage\{')
    h = src_text.replace("s.src = 'agentation-embed.js';", "s.src = '';")   # the loader hangs headless runs
    adapter = ('<style id="__dsadapt">'
      'html:not([data-theme="dark-theme"]) #agPage{' + light + '}'
      'html[data-theme="dark-theme"] #agPage{' + dark + '}'
      'html:not([data-theme="dark-theme"]) body{background:#ffffff;color:#1d2a3e}'
      'html[data-theme="dark-theme"] body{background:#07101f;color:#cad3e2}'
      '</style>')
    # ⚠️ SYNCHRONOUS ON `load` — the checker waits ~800ms after networkidle and then measures.
    #    A timer chain like the screenshot probes use would be read before it had navigated.
    # ⚠️ THE ISOLATION RETRIES INSTEAD OF ASSUMING `#agPage` IS THERE ON `load`. Since the
    #    st/stc/ag script moved to `_settings-module.js`, the screen is not painted the instant
    #    `load` fires — the first attempt found nothing, the isolation bailed, and the checker
    #    happily scored THE WHOLE DASHBOARD (0 DS components, 242 raw controls, 57/100) as if
    #    that were the Agentic AI screen. A silent wrong answer, not an error.
    #    The retries fit inside the checker's own ~800ms post-networkidle wait.
    nav = ('<script>window.addEventListener("load",function(){var tries=0;(function go(){try{'
           'stOpen("Agentic AI");' + wiz +
           'var keep=document.getElementById("agPage");'
           'if(!keep){ if(++tries<12) return setTimeout(go,50);'
           'document.title="ERR no #agPage";return;}'
           'var n=keep;while(n&&n!==document.body){var p=n.parentNode;'
           'Array.prototype.slice.call(p.children).forEach(function(s){'
           'if(s!==n&&s.tagName!=="STYLE"&&s.tagName!=="SCRIPT")s.remove();});n=p;}'
           'n=keep.parentNode;while(n&&n!==document.documentElement){'
           'n.style.setProperty("padding","0","important");'
           'n.style.setProperty("border-radius","0","important");n=n.parentNode;}'
           '}catch(e){ if(++tries<12) return setTimeout(go,50);'
           'document.title="ERR "+e.message;}})();});</script>' + adapter + '</body>')
    dest.write_text(h.replace('</body>', nav, 1), encoding='utf-8')

def main():
    if not CHK.exists():
        sys.exit("missing checker — npm install --no-save --no-package-lock @mtdt/observeops-ds-spec")
    OUT.mkdir(exist_ok=True)
    src = SRC.read_text(encoding='utf-8')
    # ⚠️ SAY "NOT BUILT YET" RATHER THAN SCORE AN EMPTY PAGE. The Agentic AI screen was cleared
    #    on 1 Sep 2026 to be rebuilt; with nothing registered under ST_PAGES the isolation finds
    #    no `#agPage` and the checker would happily score the placeholder instead — a number
    #    that looks like a verdict on a screen that does not exist.
    # ⚠️ TEST FOR THE TOKEN BLOCK, NOT THE ST_PAGES LINE. The cleared file leaves a comment
    #    saying "register the new screen as ST_PAGES['Agentic AI › Overview']" — which a naive
    #    substring test matches, so the guard never fired and `build()` threw on the missing
    #    rule instead. The scoped token block is what this script actually needs.
    if "\n#agPage{" not in tokens_source(src):
        print("no Agentic AI screen registered in %s — nothing to check yet." % SRC.name)
        print("(register it as ST_PAGES['Agentic AI \u203a Overview'] = { html, after } and re-run)")
        sys.exit(0)
    fails = []
    built = []
    for key, wiz, label in SCENES:
        # ⚠️ THE BUILT PAGE MUST SIT BESIDE ITS SOURCE, NOT IN `_out/`. Every asset the page
        #    pulls is a RELATIVE path — `_ds/observeops-elements.umd.js`, and since the 1 Sep
        #    refactor `_settings-module.css` / `.js` too. From `_verify/_out/` none of them
        #    resolve, so the DS bundle 404'd and NOT ONE `obs-*` ELEMENT EVER UPGRADED. The
        #    checker still returned 100/100, because it counts `obs-*` TAGS as DS components
        #    and finds few off-token colours on a page that barely paints. Every score this
        #    script produced before 1 Sep 2026 was measuring inert markup.
        #    The `_` prefix keeps `_sync_variants.js` from picking these up; they are deleted
        #    in the `finally` below.
        page = ROOT / ("_dsconf-%s.html" % key)
        build(src, wiz, page)
        r = subprocess.run(["node", str(CHK), str(page), "--declared", str(HERE / "ds-gaps.json")],
                           capture_output=True, text=True)
        built.append(page)
        line = next((l for l in r.stdout.splitlines() if "OVERALL" in l), "(no verdict)")
        print("%-32s %s" % (label, line.strip()))
        if r.returncode != 0:
            fails.append(label)
            print(r.stdout)
    for f in built:
        try: f.unlink()
        except OSError: pass
    print()
    print("FAILED: " + ", ".join(fails) if fails else "ALL SCENES PASS")
    sys.exit(1 if fails else 0)

main()
