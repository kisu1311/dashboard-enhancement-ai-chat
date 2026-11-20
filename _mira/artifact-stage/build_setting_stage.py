"""Build setting-stage.html: Settings › Discovery Profile › Create (Other › Backup, vendor Commvault) as it stands on the live
product, with the help card in two options, for the module-work artifact's Setting stage.
  Option 1  the live card: a floating box pinned to the top-right of the form, (i) + label + value. It sits OVER the form, so at
            1280px it covers the Collectors field (the user's screenshot).
  Option 2  a guidance COLUMN beside the form that never overlaps it: a heading, the supported models as tags, the prerequisites
            as a checklist. When the page is too narrow for a column it becomes a strip ABOVE the form.
The form itself is ObserveOps DS elements (obs-input / obs-select / obs-radio / obs-switch / obs-button, the vendored bundle the
artifact already publishes as mira-ds.js); colours are the dev-team tokens (design-tokens/observeops-tokens.css), inlined."""
import datetime
TOK = open('/Users/kishanpatel/ObseverOps/design-tokens/observeops-tokens.css', encoding='utf-8').read()

I_INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>'
I_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>'
I_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6l-6 6" /></svg>'
I_D = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6l6 -6" /></svg>'
I_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6l6 6" /></svg>'
I_EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg>'

MODELS = ['Commvault v11']
PREREQ = ["Make sure that the device you're adding is reachable from the server where the ObserveOps is deployed."]

types = [('Server', 1), ('Cloud', 1), ('Network', 0), ('SDN', 1), ('Virtualization', 1), ('HCI', 1), ('Storage', 0), ('Database', 0),
         ('Service Check', 0), ('Wireless', 1), ('Container Orchestration', 1)]
rail = ''.join('<div class="tr">%s%s</div>' % (n, I_R if c else '') for n, c in types)
rail += '<div class="tr open">Other' + I_D + '</div><div class="tr sub">IBM Tape Library</div><div class="tr sub on">Backup</div><div class="tr sub">Ping</div>'

def fld(label, ctl, req=False, cls=''):
    return '<div class="f %s"><div class="fl">%s%s</div>%s</div>' % (cls, label, '<em>*</em>' if req else '', ctl)

form = ('<div class="row r1">' + fld('Discovery Profile Name', '<obs-input placeholder="Must be unique"></obs-input>', True) + '</div>'
  '<div class="row">' + fld('IP/Host', '<obs-input placeholder="e.g. 192.0.2.1 or 2001:db8::1"></obs-input>', True)
  + fld('Collector Type', '<obs-select options="Collector,Master" value="Collector"></obs-select>')
  + fld('Collectors', '<obs-select placeholder="Select" options="collector-01,collector-02"></obs-select>') + '</div>'
  '<div class="row">' + fld('Vendor', '<obs-select options="Commvault" value="Commvault"></obs-select>', True) + '</div>'
  '<div class="row">' + fld('Groups', '<obs-select options="Other &gt; Backup &gt; Commvault" value="Other &gt; Backup &gt; Commvault"></obs-select>', True)
  + fld('Credential Profiles', '<obs-select placeholder="Select" options="commvault-api,backup-admin"></obs-select>', True)
  + '<div class="f fbtn"><obs-button variant="default">Create Credential Profile</obs-button></div></div>'
  '<div class="row">' + fld('Tags', '<obs-select placeholder="Add Tags" options="backup,prod"></obs-select>', False, 'wide') + '</div>'
  '<h3>Discovery Parameters of Backup</h3>'
  '<div class="row">' + fld('URL Type', '<obs-radio as-button value="HTTPS" options=\'[{"value":"HTTP","label":"HTTP"},{"value":"HTTPS","label":"HTTPS"}]\'></obs-radio>', True, 'narrow')
  + fld('Port', '<obs-input value="443"></obs-input>', True) + fld('Ping Check', '<obs-switch checked></obs-switch>', False, 'narrow') + '</div>'
  '<h3>Notifications</h3>'
  '<div class="row nrow">' + fld('Notify', '<obs-input placeholder="@User or Email or /Handle or #User Profile or Mobile Number"></obs-input>', False, 'grow')
  + '<div class="f fbtn"><obs-button variant="default">+ Bcc</obs-button></div></div>'
  '<div class="foot"><obs-button variant="default">Save and Exit</obs-button><span class="sp"></span><obs-button variant="default">Reset</obs-button><obs-button variant="primary">Save and Run</obs-button></div>'
  '<div class="more">For more information: <a href="#" onclick="return false">Discovery Profile' + I_EXT + '</a></div>')

# Option 1 - the live card, as captured
help1 = ('<aside class="h1c" aria-label="Help">'
  '<div class="h1r">' + I_INFO + '<b>Supported models:</b></div><div class="h1v">' + ', '.join(MODELS) + '</div>'
  '<div class="h1r">' + I_INFO + '<b>Prerequisites:</b></div><ul class="h1l">' + ''.join('<li>%s</li>' % p for p in PREREQ) + '</ul></aside>')
# Option 2 - a guidance column (a strip above the form when there is no room for a column)
help2 = ('<aside class="h2c" aria-label="Before you start">'
  '<div class="h2t">' + I_INFO + '<span>Before you start</span></div>'
  '<div class="h2s"><div class="h2k">Supported models</div><div class="h2tags">' + ''.join('<obs-tag variant="tag-green">%s</obs-tag>' % m for m in MODELS) + '</div></div>'
  '<div class="h2s"><div class="h2k">Prerequisites</div><ol class="h2l">' + ''.join('<li><span class="h2n">%d</span><span>%s</span></li>' % (i + 1, p) for i, p in enumerate(PREREQ)) + '</ol></div>'
  '</aside>')

CSS = r"""
*{box-sizing:border-box}
html,body{height:100%;margin:0}
body{background:var(--page-background-color);color:var(--page-text-color);font:13px/1.45 Inter,system-ui,sans-serif}
svg{display:block}
.pg{display:flex;flex-direction:column;height:100%}
.ph{flex:0 0 52px;display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid var(--border-color);font-size:19px;font-weight:500}
.ph svg{width:18px;height:18px;color:var(--neutral-light)}
.bd{flex:1;min-height:0;display:flex}
.rail{flex:0 0 240px;overflow:auto;padding:10px 8px;border-right:1px solid var(--border-color)}
.tr{display:flex;align-items:center;justify-content:space-between;height:36px;padding:0 10px;border-bottom:1px solid var(--border-color);font-size:13px}
.tr svg{width:14px;height:14px;color:var(--neutral-light)}
.tr.sub{border:0;padding-left:22px;height:32px;border-radius:4px}
.tr.sub.on{background:var(--code-tag-background-color);font-weight:500}
.main{flex:1;min-width:0;overflow:auto;position:relative;container-type:inline-size;container-name:dp}
.wrap{padding:16px 24px 24px}
.fl{margin:0 0 6px;font-size:12.8px;color:var(--page-text-color)}
.fl em{font-style:normal;color:var(--secondary-red);margin-left:2px}
h3{margin:22px 0 10px;font-size:15px;font-weight:600}
.row{display:flex;flex-wrap:wrap;gap:16px 32px;margin-bottom:16px;align-items:flex-end}
.f{width:300px;max-width:100%}
.f.wide{width:632px}.f.narrow{width:auto;min-width:120px}.f.grow{flex:1;min-width:240px}
.fbtn{width:auto}
.nrow{flex-wrap:nowrap}
.foot{display:flex;gap:8px;align-items:center;margin-top:8px}.foot .sp{flex:1}
.more{margin-top:14px;font-size:12.8px;color:var(--neutral-light)}
.more a{color:var(--page-text-color);text-decoration:underline;display:inline-flex;align-items:center;gap:4px}
.more svg{width:13px;height:13px}
obs-input,obs-select{display:block;width:100%}

/* ── Option 1: the live card, floating over the top-right of the form ── */
.h1c{position:absolute;top:96px;right:16px;width:min(540px,44%);padding:14px 16px;border-radius:4px;background:var(--help-card-bg-color);z-index:2}
.h1r{display:flex;align-items:center;gap:6px;margin:0 0 4px;font-size:13.5px}
.h1r b{font-weight:500}
.h1r svg{width:16px;height:16px;color:var(--page-text-color)}
.h1v{margin:0 0 12px 22px;color:var(--neutral-light)}
.h1l{margin:4px 0 0 22px;padding-left:14px;color:var(--neutral-light)}
.opt2 .h1c{display:none}
/* Option 1, fixed (request, 19 Nov 2026): the card keeps its live look and place, but the form reserves its width on the right, so the
   fields wrap under each other instead of sitting UNDER the card (on the live product it covers Collector Type / Collectors at 1280). */
body:not(.opt2) .wrap{padding-right:calc(min(540px,44%) + 48px)}
.h2c{display:none}

/* ── Option 2: a guidance column beside the form, never over it ── */
.opt2 .mg{display:grid;grid-template-columns:minmax(0,1fr) 300px;align-items:start}
.opt2 .wrap{grid-column:1;grid-row:1;min-width:0}
.opt2 .h2c{display:block;grid-column:2;grid-row:1;position:sticky;top:0;margin:16px 16px 16px 0;padding:14px 16px 16px;
  border:1px solid var(--border-color);border-radius:8px;background:var(--widget-background)}
.h2t{display:flex;align-items:center;gap:8px;margin:0 0 14px;font-size:14px;font-weight:600}
.h2t svg{width:18px;height:18px;color:var(--main-tags-text-color)}
.h2s+.h2s{margin-top:14px;padding-top:14px;border-top:1px solid var(--border-color)}
.h2k{margin:0 0 8px;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--neutral-light)}
.h2tags{display:flex;flex-wrap:wrap;gap:6px}
.h2l{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.h2l li{display:flex;gap:10px;align-items:flex-start;line-height:1.5}
.h2n{flex:0 0 20px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;margin-top:1px;
  background:var(--code-tag-background-color);color:var(--page-text-color);font:600 11px/1 Inter,sans-serif}
/* no room for a column: the guidance becomes a strip above the form */
@container dp (max-width:860px){
  .opt2 .mg{display:block}   /* the container cannot restyle itself - the grid lives on .mg inside it */
  .opt2 .h2c{position:static;margin:16px 24px 0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 24px;align-items:start}
  .opt2 .h2t{grid-column:1 / -1;margin-bottom:6px}
  .opt2 .h2s+.h2s{margin-top:0;padding-top:0;border-top:0;padding-left:24px;border-left:1px solid var(--border-color)}
}
"""
DRV = r"""<script>(function(){ var S=window.__SVSPEC||{}; var h=document.documentElement;
  if(S.theme==='light') h.removeAttribute('data-theme'); else h.setAttribute('data-theme','dark-theme');
  if(/o2/.test(S.v||'')) document.body.classList.add('opt2');
  /* in light theme the DS elements read the :root tokens; in dark, [data-theme='dark-theme'] - nothing else to switch */
})();</script>"""

stamp = datetime.datetime.now().strftime('%d %b %H:%M')
html = ('<!doctype html><html data-theme="dark-theme"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  '<meta name="mx-build" content="' + stamp + '"><title>Create Discovery Profile</title>'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">'
  '<style>' + TOK + CSS + '</style></head><body>'
  '<div class="pg"><div class="ph">' + I_L + 'Create Discovery Profile</div><div class="bd"><nav class="rail">' + rail + '</nav>'
  '<main class="main"><div class="mg">' + help2 + '<div class="wrap">' + form + '</div></div>' + help1 + '</main></div></div>'   # the guidance comes FIRST, so the narrow strip sits above the form
  + DRV + '<script src="mira-ds.js"></script></body></html>')
open('setting-stage.html', 'w', encoding='utf-8').write(html)
print('setting-stage.html', len(html), stamp)
