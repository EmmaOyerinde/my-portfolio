import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { refreshDatasets, retry, assertReplacement, digest } from '../scripts/lib/refresh.mjs';
const E = globalThis.EOEvidence;
const fixture = async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-refresh-'));
  for (const file of Object.values(E.files))
    await fs.copyFile('data/' + file, path.join(dir, file));
  return dir;
};
const loaders = (dir) =>
  Object.fromEntries(
    E.kinds.map((k) => [
      k,
      async () => JSON.parse(await fs.readFile(path.join(dir, E.files[k]), 'utf8')),
    ]),
  );
test('blocked OEB, malformed replacement and timeout preserve byte-identical last-good evidence while other sources publish', async () => {
  const directory = await fixture();
  try {
    const load = loaders(directory),
      before = await fs.readFile(path.join(directory, E.files.reliability));
    let calls = 0;
    load.reliability = async () => {
      calls++;
      throw Error('Upstream HTTP 401 from www.oeb.ca');
    };
    load.customers = async () => {
      throw Error('Upstream HTTP 403 from www.oeb.ca');
    };
    load.communities = async () => ({ communities: [] });
    load.boundaries = async () => {
      throw Error('timeout');
    };
    const m = await refreshDatasets({
      directory,
      loaders: load,
      wait: async () => {},
      now: () => '2026-11-10T22:00:00Z',
    });
    assert.equal(calls, 1);
    assert.deepEqual(await fs.readFile(path.join(directory, E.files.reliability)), before);
    assert.equal(m.datasets.reliability.status, 'blocked');
    assert.equal(m.datasets.communities.status, 'invalid');
    assert.equal(m.datasets.boundaries.status, 'timeout');
    assert.equal(m.datasets.balance.status, 'ok');
    assert.equal(m.datasets.customers.status, 'blocked');
    assert.equal(
      m.datasets.customers.sha256,
      digest(await fs.readFile(path.join(directory, E.files.customers))),
    );
    assert.equal(m.datasets.reliability.sha256, digest(before));
    assert.equal(m.datasets.reliability.lastSuccessAt, JSON.parse(before).checkedAt);
    assert.equal(m.datasets.reliability.lastAttemptAt, '2026-11-10T22:00:00Z');
    assert.ok(JSON.parse(await fs.readFile(path.join(directory, 'source-status.json'), 'utf8')));
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
test('transient errors use bounded retries; rate limits and schema errors do not hammer a publisher', async () => {
  let attempts = 0;
  assert.equal(
    await retry(
      async () => {
        if (++attempts < 3) throw Error('fetch failed');
        return 42;
      },
      { wait: async () => {} },
    ),
    42,
  );
  assert.equal(attempts, 3);
  for (const message of ['Upstream HTTP 429', 'Invalid XML', 'Upstream HTTP 403']) {
    attempts = 0;
    await assert.rejects(() =>
      retry(
        async () => {
          attempts++;
          throw Error(message);
        },
        { wait: async () => {} },
      ),
    );
    assert.equal(attempts, 1);
  }
});
test('release regression and unexpected community coverage loss are rejected', async () => {
  const r = JSON.parse(await fs.readFile('data/reliability.json'));
  const next = structuredClone(r);
  next.reportingYear--;
  next.rows.forEach((x) => x.year--);
  assert.throws(() => assertReplacement('reliability', next, r), /regressed/);
  const d = JSON.parse(await fs.readFile('data/communities.json'));
  const truncated = structuredClone(d);
  truncated.communities = truncated.communities.slice(0, 110);
  assert.throws(() => assertReplacement('communities', truncated, d), /coverage loss/);
});
