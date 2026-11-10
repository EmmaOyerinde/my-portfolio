import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import '../../js/evidence-core.js';
const { kinds, files, valid, checkedAt, period } = globalThis.EOEvidence;
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
export async function readJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}
export async function atomicJson(file, data) {
  const target = file instanceof URL ? fileURLToPath(file) : file;
  const temp = target + '.tmp';
  await fs.writeFile(temp, JSON.stringify(data));
  await fs.rename(temp, target);
}
export function classify(error) {
  const message = String(error?.message || '');
  const code = error?.status || Number(message.match(/HTTP (\d{3})/)?.[1]);
  return code === 401 || code === 403
    ? 'blocked'
    : code === 429
      ? 'rate-limited'
      : code >= 500
        ? 'unavailable'
        : /timeout|abort/i.test(message + ' ' + error?.name)
          ? 'timeout'
          : /fetch|network|ENOTFOUND|ECONN/i.test(message)
            ? 'unavailable'
            : 'invalid';
}
export async function retry(load, { wait = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await load();
    } catch (error) {
      const state = classify(error);
      if (attempt === 2 || !['timeout', 'unavailable'].includes(state)) throw error;
      await wait(800 * 2 ** attempt);
    }
  }
}
export function assertReplacement(kind, next, previous) {
  if (!valid(kind, next)) throw Error('Dataset failed schema and coverage validation');
  if (valid(kind, previous) && period(kind, next) < period(kind, previous))
    throw Error('Publisher release regressed; manual review required');
  if (kind === 'customers' && previous?.rows && next.rows.length < previous.rows.length * 0.8)
    throw Error('Unexpected customer coverage loss; manual review required');
  if (
    kind === 'communities' &&
    previous?.communities &&
    next.communities.length < previous.communities.length * 0.8
  )
    throw Error('Unexpected coverage loss; manual review required');
  if (
    kind === 'boundaries' &&
    previous?.features &&
    next.features.length < previous.features.length * 0.8
  )
    throw Error('Unexpected boundary coverage loss; manual review required');
}
export async function refreshDatasets({
  directory,
  loaders,
  now = () => new Date().toISOString(),
  wait,
  runUrl = null,
}) {
  const previousManifest = await readJson(path.join(directory, 'source-status.json'));
  const manifest = {
    schemaVersion: 1,
    generatedAt: now(),
    schedule: 'daily',
    overdueAfterHours: 72,
    runUrl,
    datasets: { ...previousManifest?.datasets },
  };
  const results = await Promise.all(
    kinds.map(async (kind) => {
      const file = path.join(directory, files[kind]),
        previous = await readJson(file);
      let data = previous,
        status = 'ok';
      try {
        const next = await retry(loaders[kind], { wait });
        assertReplacement(kind, next, previous);
        await atomicJson(file, next);
        data = next;
      } catch (error) {
        status = classify(error);
      }
      const good = valid(kind, data);
      if (!good) throw Error('No valid snapshot remains for ' + kind);
      const entry = {
        file: files[kind],
        status,
        lastAttemptAt: now(),
        lastSuccessAt: checkedAt(kind, data),
        period: period(kind, data),
        sha256: digest(await fs.readFile(file)),
        bytes: (await fs.stat(file)).size,
      };
      return [kind, entry];
    }),
  );
  for (const [kind, entry] of results) manifest.datasets[kind] = entry;
  await atomicJson(path.join(directory, 'source-status.json'), manifest);
  return manifest;
}
export async function initialManifest(directory) {
  const datasets = {};
  for (const kind of kinds) {
    const file = path.join(directory, files[kind]),
      d = await readJson(file);
    if (!valid(kind, d)) throw Error('Invalid initial ' + kind);
    datasets[kind] = {
      file: files[kind],
      status: 'not-run',
      lastAttemptAt: null,
      lastSuccessAt: checkedAt(kind, d),
      period: period(kind, d),
      sha256: digest(await fs.readFile(file)),
      bytes: (await fs.stat(file)).size,
    };
  }
  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    schedule: 'daily',
    overdueAfterHours: 72,
    runUrl: null,
    datasets,
  };
  await atomicJson(path.join(directory, 'source-status.json'), manifest);
  return manifest;
}
