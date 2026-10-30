// Shrinks the PUBLISHED copy of the site. Run only in the deploy workflow (or on a
// throwaway copy) — it rewrites files in place, and the comments it strips are this
// repo's documentation, so the source files on main must keep them.
//
// Why: index.html is ~3 MB and ~1.2 MB of that is comments; the live page took ~5 s
// just to download. Safe settings only: comments + whitespace are removed, nothing is
// renamed (mangle:false), so inline onclick="fn()" handlers and globals keep working.
// A file that fails to minify is left exactly as it was.
//
// Usage: node _build/minify-site.mjs [dir]   (needs html-minifier-terser + terser)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';

const root = process.argv[2] || '.';
const SKIP_DIRS = new Set(['.git', 'node_modules', '_verify', '.github', '_build', '.claude']);
const JS_OPTS = { compress: false, mangle: false, format: { comments: false } };
const HTML_OPTS = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true,   // keep one space where whitespace mattered
  minifyCSS: true,
  minifyJS: JS_OPTS,
  keepClosingSlash: true,
};

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(n)) walk(p, out); }
    else if (['.html', '.js'].includes(extname(n)) && !n.endsWith('.min.js')) out.push(p);
  }
  return out;
}

let before = 0, after = 0;
for (const f of walk(root)) {
  const src = readFileSync(f, 'utf8');
  try {
    const out = f.endsWith('.html')
      ? await minifyHtml(src, HTML_OPTS)
      : (await minifyJs(src, JS_OPTS)).code;
    if (out && out.length < src.length) {
      writeFileSync(f, out);
      before += src.length; after += out.length;
      console.log(`${f}: ${(src.length / 1024) | 0} KB -> ${(out.length / 1024) | 0} KB`);
    }
  } catch (e) {
    console.log(`${f}: left unchanged (${String(e.message).slice(0, 80)})`);
  }
}
console.log(`total ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
