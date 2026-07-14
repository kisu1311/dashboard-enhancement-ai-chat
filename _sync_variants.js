#!/usr/bin/env node
/* ============================================================
   _sync_variants.js — auto-connects every page in this folder
   ------------------------------------------------------------
   Scans Side_bar_menu/ for *.html files and keeps the variant
   switcher (_variants.js) in sync:

     • every .html file becomes an option in the switcher menu
       (new pages are labelled "V<n> · <page title>")
     • deleted files are removed from the list
     • any page missing <script src="_variants.js"></script>
       gets it injected just before </body>

   Runs automatically:
     • Claude Code hook — whenever an .html here is created/edited
     • GitHub Pages deploy workflow — on every push
   Manual run:  node _sync_variants.js

   `--hook` mode: reads the Claude Code PostToolUse JSON from
   stdin and only syncs when the touched file is an .html
   directly inside this folder. Always exits 0.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const VJS = path.join(DIR, '_variants.js');
const INCLUDE = '<script src="_variants.js"></script>';
const BEGIN = '/* VARIANTS:BEGIN';
const END = '/* VARIANTS:END */';

function pageTitle(file) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  const m = html.match(/<title>([^<]*)<\/title>/i);
  let t = m ? m[1].trim() : '';
  // strip product-name prefixes so labels stay short
  t = t.replace(/^\s*(motadata\s+)?observeops\s*[—–\-·:|]\s*/i, '').trim();
  if (!t || /^side_bar_menu$/i.test(t)) {
    t = file.replace(/\.html$/i, '').replace(/[-_]+/g, ' ').trim();
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }
  return t;
}

function sync() {
  const htmlFiles = fs
    .readdirSync(DIR)
    .filter(f => f.toLowerCase().endsWith('.html') && !f.startsWith('_'))
    .sort();

  const vjs = fs.readFileSync(VJS, 'utf8');
  const b = vjs.indexOf(BEGIN);
  const e = vjs.indexOf(END);
  if (b === -1 || e === -1) {
    console.error('_sync_variants.js: VARIANTS:BEGIN/END markers not found in _variants.js');
    process.exit(1);
  }
  const block = vjs.slice(b, e);
  const arrStart = block.indexOf('[');
  const arrEnd = block.lastIndexOf(']');
  let existing = [];
  try {
    existing = JSON.parse(block.slice(arrStart, arrEnd + 1));
  } catch (err) {
    existing = [];
  }

  const changes = [];

  // keep existing entries (and their hand-tuned labels), drop deleted files
  const list = existing.filter(v => htmlFiles.includes(v.file));
  existing
    .filter(v => !htmlFiles.includes(v.file))
    .forEach(v => changes.push('removed option: ' + v.file));

  // append any new page, labelled from its <title>
  for (const f of htmlFiles) {
    if (list.some(v => v.file === f)) continue;
    const label = 'V' + (list.length + 1) + ' · ' + pageTitle(f);
    list.push({ file: f, label: label });
    changes.push('added option: ' + f + ' → "' + label + '"');
  }

  const newArr =
    '[\n' + list.map(v => '    ' + JSON.stringify(v)).join(',\n') + '\n  ]';
  const newBlock = block.slice(0, arrStart) + newArr + block.slice(arrEnd + 1);
  if (newBlock !== block) {
    fs.writeFileSync(VJS, vjs.slice(0, b) + newBlock + vjs.slice(e));
  }

  // make sure every page loads the switcher
  for (const f of htmlFiles) {
    const p = path.join(DIR, f);
    let html = fs.readFileSync(p, 'utf8');
    if (html.indexOf('_variants.js') !== -1) continue;
    const i = html.toLowerCase().lastIndexOf('</body>');
    html =
      i === -1
        ? html + '\n' + INCLUDE + '\n'
        : html.slice(0, i) + INCLUDE + '\n' + html.slice(i);
    fs.writeFileSync(p, html);
    changes.push('injected switcher into: ' + f);
  }

  if (changes.length) {
    console.log('_sync_variants: ' + changes.join('; '));
  }
  return changes.length;
}

if (process.argv.includes('--hook')) {
  let raw = '';
  process.stdin.on('data', c => (raw += c));
  process.stdin.on('end', () => {
    let fp = '';
    try {
      const input = JSON.parse(raw);
      fp =
        (input.tool_input && input.tool_input.file_path) ||
        (input.tool_response && input.tool_response.filePath) ||
        '';
    } catch (err) {
      /* not our payload — ignore */
    }
    if (fp) {
      const rel = path.relative(DIR, fp);
      const isOurs =
        !rel.startsWith('..') &&
        !rel.includes(path.sep) &&
        rel.toLowerCase().endsWith('.html') &&
        !rel.startsWith('_');
      if (isOurs) {
        try {
          sync();
        } catch (err) {
          /* never block the editing session */
        }
      }
    }
    process.exit(0);
  });
} else {
  sync();
}
