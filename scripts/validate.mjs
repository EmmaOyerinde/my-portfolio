import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import '../js/evidence-core.js';
import { compileStyles } from './lib/styles.mjs';
import { checkClientSources } from './lib/source-check.mjs';
checkClientSources();
if (fs.readFileSync('styles.css', 'utf8') !== compileStyles())
  throw Error('Stylesheet is out of date. Run npm run prepare:styles.');
const E = globalThis.EOEvidence,
  manifest = JSON.parse(fs.readFileSync('data/source-status.json', 'utf8'));
for (const kind of E.kinds) {
  const bytes = fs.readFileSync('data/' + E.files[kind]);
  if (!E.valid(kind, JSON.parse(bytes))) throw Error('Invalid dataset ' + kind);
  if (manifest.datasets[kind].sha256 !== createHash('sha256').update(bytes).digest('hex'))
    throw Error('Dataset hash mismatch: ' + kind);
}
for (const name of ['index.html', 'map-workspace.html', '404.html']) {
  const html = fs.readFileSync(name, 'utf8');
  if (!html.includes('http-equiv="Content-Security-Policy"'))
    throw Error('CSP missing from ' + name);
  if (/<script\b[^>]*>\s*[^<\s]/i.test(html) || /\son\w+\s*=/i.test(html))
    throw Error('Inline JavaScript found');
  for (const [, raw] of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    if (/^[a-z]+:/.test(raw)) continue;
    const target = decodeURIComponent(raw);
    if (target.startsWith('/') || !fs.existsSync(target))
      throw Error('Missing or non-portable asset ' + target);
  }
}
const client = fs
  .readdirSync('js')
  .filter((n) => /\.(m?js)$/.test(n))
  .map((n) => fs.readFileSync(path.join('js', n), 'utf8'))
  .join('\n');
if (/api\/data\//.test(client)) throw Error('A server API dependency remains');
const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('B.Eng in Electrical/Electronics Engineering')) throw Error('Degree missing');
console.log(
  'Validated source snapshots, integrity hashes, CSP, local assets, portable paths, static-only client and degree.',
);
