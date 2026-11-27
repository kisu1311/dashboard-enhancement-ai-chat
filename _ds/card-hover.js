/* ObserveOps prototypes - the Dashboard widget hover on every card in every module. */
/* (the ring and the wash are written at the use site, not as :root custom properties - a var() inside a custom property
   resolves where it is DECLARED, so at :root it missed the DS tokens that are only scoped around the cards) */
/* CARD HOVER — the Dashboard widget's hover, on every widget and card in every module (request, 27 Nov 2026: "i created
   the dashboard hover effect, apply it overall in all my modules where there is a widget or card").
   The Dashboard's own rule is `.widget.wds:hover` in index.html: a 1px --field-border-color edge, a soft lift, and the
   card's fill raised by a 1.4% (dark) / 0.8% (light) wash of the page ink. This is the same effect, written once here,
   for the cards outside the Dashboard board:
     · DS cards (obs-widget-card / obs-stat-card / obs-kpi-card / obs-overview-card) — the fill through the card's own
       --page-background-color, exactly as the Dashboard does it, and the edge + lift as a box-shadow on the host;
     · hand-built cards (Compliance, License, Mira AI connectors, Agentic AI providers, Log Explorer KPIs, APM cards) — the
       edge + lift as a box-shadow and the fill as a background-image wash over whatever surface the card already paints.
   ⚠️ The Dashboard board's widgets (`.widget.wds`) are EXCLUDED — they already carry the original and would get it twice.
   ⚠️ Add a new card type to HV_SEL below, not a second rule.
   Loaded by EVERY page beside _ds/colresize.js (the option pages, setting / topology / apm, and the IPAM, Firewall and
   Topology iframes) - one source, so the modules cannot drift. */
(function(){
  if (document.getElementById('ds-card-hover')) return;
  const DS = 'obs-widget-card,obs-stat-card,obs-kpi-card,obs-overview-card';
  const HV_SEL = '.cplpb,.cplpc,.cplkpi,.lxkpi,.licqbox,.licovc,.licg4>.licg4c,.licm4,.lic4,.lice5c,.mracard,.myccard,.agpc,.apxcard,.apsc,'
    /* IPAM (_ipam/ipam.html): its widget cards (not the frameless grid card) and the KPI tiles */
    + '.ip-card:not(.ip-sncard),.sn-kpis .ip-sev-box';
  const ds = ':is(' + DS + '):not(.widget.wds *)', hc = ':is(' + HV_SEL + ')';
  const st = document.createElement('style'); st.id = 'ds-card-hover';
  st.textContent =
    ':root{--hv-lift:0 6px 18px rgba(0,0,0,.24);--hv-pct:1.4%}' +
    'html.hv-light{--hv-lift:0 3px 12px rgba(0,0,0,.10);--hv-pct:.8%}' +
    ds + '{display:block;border-radius:var(--widget-border-radius,7px);transition:box-shadow .15s ease}' +
    ds + ':hover{box-shadow:inset 0 0 0 1px var(--field-border-color,var(--border)),var(--hv-lift);--page-background-color:color-mix(in srgb,var(--page-text-color) 1.4%,var(--widget-background))}' +
    'html.hv-light ' + ds + ':hover{--page-background-color:color-mix(in srgb,var(--page-text-color) .8%,var(--widget-background))}' +
    hc + '{transition:box-shadow .15s ease}' +
    hc + ':hover{box-shadow:inset 0 0 0 1px var(--field-border-color,var(--border)),var(--hv-lift);background-image:linear-gradient(color-mix(in srgb,var(--page-text-color,var(--text)) var(--hv-pct),transparent),color-mix(in srgb,var(--page-text-color,var(--text)) var(--hv-pct),transparent))}';
  (document.head || document.documentElement).appendChild(st);
  /* THE THEME IS READ OFF THE PAGE, NOT ONE ATTRIBUTE (fix, 27 Nov 2026: "IPAM does not change the theme"). The option
     pages mark light with data-theme="light"; the IPAM / Firewall / Topology frames use the DS convention - dark is
     data-theme="dark-theme" and light is NO attribute - so a [data-theme="light"] test never matched there and their light
     theme hovered with the dark shadow and tint. html.hv-light is set from the luminance of the page's own background
     and re-checked whenever <html> or <body> changes theme or class. */
  const lum = c => { const m = /rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?/.exec(c || '');
    return m && (m[4] === undefined || +m[4] > 0) ? (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255 : null; };
  const paint = () => { const de = document.documentElement, b = document.body;
    let L = b ? lum(getComputedStyle(b).backgroundColor) : null; if (L === null) L = lum(getComputedStyle(de).backgroundColor);
    if (L === null) { const t = de.getAttribute('data-theme'); L = t === 'light' || (t !== null && t !== 'dark' && t !== 'dark-theme' && t !== '') ? 1 : (t === null && /dark-theme/.test(st.textContent) ? 1 : 0); }
    if (de.classList.contains('hv-light') !== L > 0.5) de.classList.toggle('hv-light', L > 0.5); };
  const watch = () => { paint(); const o = new MutationObserver(() => { setTimeout(paint, 0); setTimeout(paint, 450); });   /* again after a background transition settles */
    o.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme','class'] });
    if (document.body) o.observe(document.body, { attributes:true, attributeFilter:['data-theme','class'] }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();

