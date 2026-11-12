import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function assertPublishableFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (/^(?:<{7}(?: |$)|={7}\s*$|>{7}(?: |$)|\|{7}(?: |$))/m.test(text))
    throw Error(`Unresolved merge conflict in ${file}. Resolve the file before publishing.`);
  if (/\.m?js$/.test(file)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.error || result.status !== 0)
      throw Error(
        `JavaScript syntax check failed: ${file}. ${result.error?.message || result.stderr.slice(0, 500)}`,
      );
  }
}

export function checkClientSources(root = process.cwd()) {
  const files = ['index.html', '404.html', 'map-workspace.html', 'styles.css'];
  for (const directory of ['js', 'styles', '.github/workflows']) {
    for (const file of fs.readdirSync(path.join(root, directory)))
      if (/\.(m?js|css|ya?ml)$/.test(file)) files.push(path.join(directory, file));
  }
  for (const file of files) assertPublishableFile(path.join(root, file));
}
