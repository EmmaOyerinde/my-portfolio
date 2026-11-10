import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assertSource, sourceFetch } from '../scripts/lib/source-fetch.mjs';
import { parseIeso } from '../scripts/adapters/ieso.mjs';
import '../js/evidence-core.js';
const E = globalThis.EOEvidence;
test('source fetch rejects internal addresses, credentials, hostile redirects and unapproved paths', async () => {
  for (const u of [
    'http://www.oeb.ca/open-data/x',
    'https://127.0.0.1/admin',
    'https://www.oeb.ca.evil.test/open-data/x',
    'https://name:secret@www.oeb.ca/open-data/x',
    'https://www.oeb.ca/private',
    'https://reports-public.ieso.ca/private',
  ])
    assert.throws(() => assertSource(u));
  await assert.rejects(() =>
    sourceFetch(
      'https://www.oeb.ca/open-data/test',
      {},
      async () =>
        new Response(null, {
          status: 302,
          headers: { location: 'http://169.254.169.254/latest/meta-data' },
        }),
    ),
  );
  assert.equal(
    assertSource('https://reports-public.ieso.ca/public/RealtimeTotals/PUB_RealtimeTotals.xml')
      .hostname,
    'reports-public.ieso.ca',
  );
  await assert.rejects(
    () =>
      sourceFetch(
        'https://www.oeb.ca/open-data/test',
        {},
        async () => new Response('x', { headers: { 'content-length': String(30 * 1024 * 1024) } }),
      ),
    /too large/,
  );
});
test('static CSP blocks external scripts, eval, arbitrary connections and form submission', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const csp = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)[1];
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'none'/);
  assert.match(csp, /form-action 'none'/);
  assert.ok(!csp.includes('unsafe-eval'));
  assert.ok(!csp.includes('frame-ancestors'));
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  assert.ok(!/\son\w+=/.test(html));
});
test('manifest states distinguish untouched snapshots, blocked sources, overdue jobs and absent data', () => {
  const now = Date.parse('2026-11-10T12:00:00Z');
  assert.equal(E.freshness(null, true, now).state, 'snapshot');
  assert.equal(
    E.freshness({ lastAttemptAt: '2026-11-10T08:00:00Z', status: 'blocked' }, true, now).state,
    'saved',
  );
  assert.equal(
    E.freshness({ lastAttemptAt: '2026-11-01T08:00:00Z', status: 'ok' }, true, now).state,
    'overdue',
  );
  assert.equal(
    E.freshness({ lastAttemptAt: '2026-11-10T08:00:00Z', status: 'ok' }, true, now).state,
    'verified',
  );
  assert.equal(E.freshness(null, false, now).state, 'unavailable');
});
test('IESO parser selects the final valid interval and rejects unsafe or malformed XML', () => {
  const xml =
    '<Document docID="RealtimeTotals"><CreatedAt>2026-11-10T10:20:00</CreatedAt><DeliveryDate>2026-11-10</DeliveryDate><DeliveryHour>11</DeliveryHour><IntervalEnergy><Interval>1</Interval><MQ><MarketQuantity>ONTARIO DEMAND</MarketQuantity><EnergyMW>15000</EnergyMW></MQ></IntervalEnergy><IntervalEnergy><Interval>2</Interval><MQ><MarketQuantity>ONTARIO DEMAND</MarketQuantity><EnergyMW>16000</EnergyMW></MQ></IntervalEnergy></Document>';
  const d = parseIeso(xml);
  assert.equal(d.demandMW, 16000);
  assert.equal(d.interval, 2);
  assert.equal(E.valid('ieso', d), true);
  assert.throws(() => parseIeso('<!ENTITY x SYSTEM="file:///etc/passwd">' + xml));
  assert.throws(() => parseIeso(xml.replace('16000', 'NaN')));
  assert.throws(() => parseIeso(xml.replace('<Interval>2', '<Interval>1')));
});
test('workflow pins actions, isolates write permissions and explicitly deploys refreshed commits', () => {
  const yaml = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
  for (const [, pin] of yaml.matchAll(/uses: ([^\s]+)/g)) assert.match(pin, /@[a-f0-9]{40}$/);
  assert.ok(!yaml.includes('pull_request_target'));
  assert.match(yaml, /needs.refresh.outputs.commit/);
  assert.match(yaml, /persist-credentials: false/);
  assert.match(yaml, /git add data\/\*\.json js\/evidence-seed\.js/);
  assert.ok(!yaml.includes('force'));
  assert.match(yaml, /permissions:\n      contents: read/);
  assert.match(yaml, /pages: write\n      id-token: write/);
});
