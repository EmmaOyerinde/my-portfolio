import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../', import.meta.url),
  dist = new URL('../dist/', import.meta.url);
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const name of [
  'index.html',
  '404.html',
  'map-workspace.html',
  'styles.css',
  'logo-icon.svg',
  '.nojekyll',
  'assets',
  'vendor',
  'js',
  'data',
]) {
  const source = new URL(name, root);
  if (fs.existsSync(source))
    fs.cpSync(source, new URL(name, dist), {
      recursive: true,
      filter: (p) => path.basename(p) !== 'ontario_cities.geojson',
    });
}
for (const name of fs.readdirSync(root))
  if (/\.pdf$/i.test(name)) fs.copyFileSync(new URL(name, root), new URL(name, dist));
console.log(
  'Built a static GitHub Pages site in dist/. No server, Worker, API routes, or runtime keys.',
);
