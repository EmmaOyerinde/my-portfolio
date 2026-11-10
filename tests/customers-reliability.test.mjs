import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseCustomerXml, discoverCustomerRelease } from '../scripts/adapters/customers.mjs';
import { assertReplacement } from '../scripts/lib/refresh.mjs';
import '../js/reliability-core.js';
const row = (i, unit = 'Customers', count = 100, cls = 'Residential') =>
  `<Customers_Connections><Current_Company_Name>Utility ${i}</Current_Company_Name><Historical_Company_Name>Utility ${i}</Historical_Company_Name><Year>2025</Year><Rate_Class>${cls}</Rate_Class><Customer_or_Connections>${unit}</Customer_or_Connections><Total_Customers_or_Connections>${count}</Total_Customers_or_Connections></Customers_Connections>`;
const xml = (extra) =>
  '<dataroot>' +
  Array.from({ length: 20 }, (_, i) => row(i)).join('') +
  (extra || '') +
  '</dataroot>';
test('customer totals exclude lighting connections, preserve zeros, and discover newest allowed release', () => {
  const rows = parseCustomerXml(
    xml(
      row(0, 'Connections', 99999, 'Street Lighting Connections') +
        row(0, 'Customers', 0, 'Large User'),
    ),
    2025,
  );
  assert.equal(rows[0].customers, 100);
  assert.equal(rows[0].connections, 99999);
  assert.equal(rows[0].classes.find((r) => r.name === 'Large User').value, 0);
  const result = discoverCustomerRelease(
    '<a href="https://www.oeb.ca/documents/opendata/rrr/2024-2/ED%202.1.2%20Customers%20%26%20Connections.xml">old</a><a href="https://www.oeb.ca/documents/opendata/rrr/2025/ED 2.1.2 Customers &amp; Connections.xml">new</a>',
    new Date('2026-11-10'),
  );
  assert.equal(result.year, 2025);
});
test('customer adapter rejects duplicate classes, hostile XML, unsupported totals and missing new-year coverage', () => {
  assert.throws(() => parseCustomerXml(xml(row(0)), 2025), /Duplicate/);
  assert.throws(() => parseCustomerXml('<!DOCTYPE x>' + xml(), 2025));
  assert.throws(() => parseCustomerXml(xml(row(0, 'Total', 999, 'Total')), 2025));
  assert.throws(() => parseCustomerXml(xml(), 2026));
  assert.throws(() =>
    discoverCustomerRelease(
      '<a href="https://evil.test/documents/opendata/rrr/2025/ED 2.1.2 Customers &amp; Connections.xml">x</a>',
    ),
  );
});
test('customer replacements reject regressed releases and substantial loss of companies', () => {
  const prior = JSON.parse(fs.readFileSync('data/customers.json'));
  const older = structuredClone(prior);
  older.reportingYear--;
  older.reportingPeriod = String(older.reportingYear);
  older.rows.forEach((r) => r.year--);
  assert.throws(() => assertReplacement('customers', older, prior), /regressed/);
  const reduced = structuredClone(prior);
  reduced.rows = reduced.rows.slice(0, 25);
  assert.throws(() => assertReplacement('customers', reduced, prior), /coverage loss/);
});
const box = { window: {}, URL, Date, console };
box.globalThis = box.window;
for (const name of ['data', 'reliability-core', 'evidence-seed'])
  vm.runInNewContext(fs.readFileSync('js/' + name + '.js', 'utf8'), box);
const w = box.window;
w.EOData = {
  get: (k) => w.EOEvidenceSeed.datasets[k],
  sourceName: (id) => w.EOEvidenceSeed.mapping[id],
  utility: (id) =>
    w.EOEvidenceSeed.datasets.reliability.rows.find((r) => r.name === w.EOEvidenceSeed.mapping[id]),
};
for (const name of ['utility-profiles', 'reliability-data'])
  vm.runInNewContext(fs.readFileSync('js/' + name + '.js', 'utf8'), box);
test('every utility has a positive customer count, with official counts preferred and branch/company scope retained', () => {
  for (const f of w.PORTFOLIO_DATA.utilitiesGeoJSON.features) {
    const c = w.EOData.customer(f.properties.id);
    assert.ok(c.count > 0, f.properties.id);
    assert.ok(c.period);
    assert.ok(c.definition);
  }
  assert.equal(
    w.EOData.customer('toronto-hydro').count,
    w.EOEvidenceSeed.datasets.customers.rows.find(
      (r) => r.name === 'Toronto Hydro-Electric System Limited',
    ).customers,
  );
  assert.equal(w.EOData.customer('bc').count, 2301508);
  assert.equal(w.EOData.customer('innpower').type, 'oeb');
  assert.equal(w.EOData.customer('elexicon').count, w.EOData.customer('elexicon-belleville').count);
  assert.match(w.EOData.customer('elexicon-belleville').scope, /entire company/);
  assert.equal(w.EOData.customer('qec').type, 'reference');
});
test('CAIDI never divides by zero and never combines incompatible periods or scopes', () => {
  const C = w.EOReliabilityCore;
  assert.equal(C.caidi(2, 0), null);
  assert.equal(C.caidi(0, 0), null);
  assert.equal(C.caidi(0, 2), 0);
  assert.equal(C.caidi(null, 2), null);
  assert.equal(C.caidi(4, 2), 2);
  assert.ok(
    w.EOReliability.rows('toronto-hydro').some(
      (r) => r.metric === 'CAIDI' && r.kind === 'calculated',
    ),
  );
  assert.ok(!w.EOReliability.rows('hq').some((r) => r.kind === 'calculated'));
  assert.ok(!w.EOReliability.rows('nbp').some((r) => r.kind === 'calculated'));
  assert.ok(
    !w.EOReliability.rows('bc').some((r) => r.kind === 'calculated' && r.metric === 'ASAI'),
  );
  assert.equal(w.EOReliability.coverage.length, 13);
});
test('advanced observations retain thresholds, reviewed sources and all-event distinctions', () => {
  const d = w.EOEvidenceSeed.reliabilityReports;
  assert.ok(w.EOReliabilityCore.valid(d));
  const nsp = d.rows.find((r) => r.utilityId === 'nsp' && r.metric === 'CELID-8');
  assert.equal(nsp.value, 23.6);
  assert.match(nsp.definition, /cumulat/i);
  assert.equal(d.rows.filter((r) => r.utilityId === 'bc' && r.metric === 'ASAI').length, 2);
  assert.ok(d.rows.every((r) => r.sourceUrl.startsWith('https://') && r.reviewedAt));
  for (const metric of ['CAIFI', 'MAIFI', 'ASAI', 'CEMIn', 'CELID', 'ENS', 'AENS'])
    assert.ok(w.EOReliabilityCore.definitions[metric].needed);
});

test('reviewed reliability validation rejects malformed links and impossible percentages without throwing', () => {
  const original = JSON.parse(fs.readFileSync('data/reliability-reports.json'));
  const malformed = structuredClone(original);
  malformed.rows[0].sourceUrl = 'https://';
  assert.equal(globalThis.EOReliabilityCore.valid(malformed), false);
  const impossible = structuredClone(original);
  impossible.rows.find((r) => r.metric === 'ASAI').value = 101;
  assert.equal(globalThis.EOReliabilityCore.valid(impossible), false);
});
test('national metric discovery finds numeric evidence and deduplicates shared company results', () => {
  const r = w.EOReliability;
  for (const key of ['CAIDI', 'MAIFI', 'ASAI', 'CEMIn', 'CELID', 'ENS'])
    assert.ok(r.available(key).length > 0, key);
  assert.equal(r.available('CAIFI').length, 0);
  assert.equal(r.available('AENS').length, 0);
  const elexicon = r
    .available('CAIDI')
    .filter((x) => ['elexicon', 'elexicon-belleville'].includes(x.utilityId));
  assert.equal(elexicon.length, 1);
  const ens = r.available('ENS');
  assert.equal(ens.find((x) => x.metric === 'ENS-N').unit, 'system minutes');
  assert.equal(ens.find((x) => x.metric === 'ENS-N').value, 8.2);
  assert.ok(
    ens
      .filter((x) => x.utilityId === 'nlh')
      .every((x) => x.region === 'NL' && x.coverageLabel.startsWith('Historical')),
  );
  assert.ok(!r.rows('nfp').some((x) => x.metric.startsWith('ENS')));
  assert.equal(w.EOData.profile('nlh'), null);
});
