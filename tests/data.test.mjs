import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { csvRows, statcanValue } from '../scripts/adapters/energy.mjs';
import {
  parseReliabilityXml,
  discoverReliabilityRelease,
} from '../scripts/adapters/reliability.mjs';
import { validateRemoteService, normalizeRemoteFeature } from '../scripts/adapters/remote.mjs';
import { parseKmlBoundaries } from '../scripts/adapters/boundaries.mjs';
const data = (name) =>
  JSON.parse(fs.readFileSync(new URL('../data/' + name + '.json', import.meta.url)));
test('source snapshots have correct units, definitions and complete coverage', () => {
  const b = data('balance');
  assert.equal(b.records.length, 14);
  for (const r of b.records) {
    if (r.netExportsTWh !== null)
      assert.ok(Math.abs(r.generationTWh - r.availableTWh - r.netExportsTWh) < 1e-5);
  }
  for (const id of ['YT', 'NT', 'NU'])
    assert.equal(b.records.find((r) => r.region === id).importsTWh, null);
  const s = data('scenarios');
  assert.ok(s.scenarios.length >= 2);
  assert.ok(s.records.filter((r) => r.year > s.historicalThrough).every((r) => !r.historical));
  assert.equal(s.originalUnit, 'PJ');
  assert.equal(s.unit, 'TWh');
  const remote = data('communities');
  assert.ok(remote.communities.length >= 200);
  assert.ok(remote.communities.some((c) => c.primarySource === 'Prov./terr. grid'));
  assert.ok(remote.communities.some((c) => c.population === null));
  assert.ok(remote.communities.every((c) => c.observationYear === null));
});
test('missing and suppressed readings remain missing; genuine zero remains zero', () => {
  assert.equal(statcanValue({ value: null }), null);
  assert.equal(
    statcanValue({ value: 5, securityLevelCode: 0, statusCode: 1, scalarFactorCode: 0 }),
    null,
  );
  assert.equal(
    statcanValue({ value: 0, securityLevelCode: 0, statusCode: 0, scalarFactorCode: 0 }),
    0,
  );
  assert.equal(
    statcanValue({ value: 1000000, securityLevelCode: 0, statusCode: 0, scalarFactorCode: 0 }),
    1,
  );
});
test('CSV parser supports quotes and rejects malformed files', () => {
  assert.deepEqual(
    [...csvRows('a,b\r\n"hello, world","a""b"\n')],
    [
      ['a', 'b'],
      ['hello, world', 'a"b'],
    ],
  );
  assert.throws(() => [...csvRows('a,b\n"unfinished')]);
});
test('upstream schema and external-entity changes fail closed', () => {
  assert.throws(() =>
    parseReliabilityXml('<!DOCTYPE x><PerformanceItemsTable></PerformanceItemsTable>', 2025),
  );
  assert.throws(() =>
    discoverReliabilityRelease('<a href="https://evil.test/scorecard_data_2025.xml">fake</a>'),
  );
  assert.throws(() => validateRemoteService('https://evil.test/MapServer'));
  assert.throws(() =>
    normalizeRemoteFeature(
      { geometry: { type: 'Point', coordinates: [Infinity, 1] }, properties: {} },
      'x',
    ),
  );
  assert.throws(() => parseKmlBoundaries('<!ENTITY x SYSTEM="file:///etc/passwd"><kml/>'));
});
test('all original reference polygons remain lossless and official boundaries retain holes', () => {
  const path = new URL('../data/utility-territories.geojson', import.meta.url);
  const plain = fs.readFileSync(path);
  assert.deepEqual(
    zlib.gunzipSync(
      fs.readFileSync(new URL('../data/utility-territories.geojson.gz', import.meta.url)),
    ),
    plain,
  );
  const geo = JSON.parse(plain);
  assert.equal(geo.features.length, 93);
  const original = JSON.parse(
    fs.readFileSync(new URL('../data/ontario_cities.geojson', import.meta.url)),
  );
  const parts = (f) =>
    f.geometry.type === 'Polygon'
      ? [f.geometry.coordinates]
      : f.geometry.type === 'MultiPolygon'
        ? f.geometry.coordinates
        : [];
  const counts = new Map();
  for (const f of geo.features)
    for (const p of parts(f)) {
      const key = JSON.stringify(p);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  let count = 0;
  for (const f of original.features)
    for (const p of parts(f)) {
      const key = JSON.stringify(p);
      assert.ok(counts.get(key) > 0);
      counts.set(key, counts.get(key) - 1);
      count++;
    }
  assert.equal(count, 5221);
  const o = data('oeb-boundaries');
  assert.ok(o.features.length >= 20);
  assert.ok(o.features.flatMap(parts).every((p) => p.length >= 1));
  const box = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../js/data.js', import.meta.url), 'utf8'), box);
  assert.equal(box.window.PORTFOLIO_DATA.utilitiesGeoJSON.features.length, 93);
  assert.ok(!('saidi' in box.window.PORTFOLIO_DATA.utilitiesGeoJSON.features[0].properties));
});
