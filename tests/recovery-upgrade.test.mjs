import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createPage } from './helpers/page.mjs';
import { assertPublishableFile } from '../scripts/lib/source-check.mjs';

test('publication rejects merge markers and malformed JavaScript before building', async (t) => {
  const dir = await fs.mkdtemp(path.join(process.cwd(), '.source-check-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'broken.js');
  await fs.writeFile(
    file,
    '<<<<<<< HEAD\nwindow.data = {};\n=======\nwindow.data = null;\n>>>>>>> update',
  );
  assert.throws(() => assertPublishableFile(file), /Unresolved merge conflict/);
  await fs.writeFile(file, 'window.data = { broken: ; };');
  assert.throws(() => assertPublishableFile(file), /JavaScript syntax check failed/);
  await fs.writeFile(file, 'window.data = { count: 0 };');
  assert.doesNotThrow(() => assertPublishableFile(file));
});

for (const failure of [undefined, 'offline']) {
  test(`a missing evidence bundle keeps the application usable ${failure || 'and recovers published data'}`, async (t) => {
    const page = await createPage({ withoutSeed: true, failure, storage: false });
    t.after(page.close);
    const { w, d } = page;
    assert.equal(d.querySelectorAll('[data-select]').length, 93);
    for (const feature of w.PORTFOLIO_DATA.utilitiesGeoJSON.features) {
      const id = feature.properties.id;
      assert.ok(w.EOData.customer(id).count > 0, id);
      assert.doesNotThrow(() => w.EOData.customerLabel(id));
    }
    assert.ok(w.EOReliability.rows('bc').some((r) => r.metric === 'ASAI'));
    if (!failure) assert.equal(w.EOData.profile('toronto-hydro').type, 'oeb');
    d.querySelector('[data-select="alectra"]').click();
    assert.equal(d.querySelector('#selected-utility').textContent, 'Alectra Utilities');
    assert.match(d.querySelector('#selected-utility-summary').textContent, /customer accounts/);
    d.querySelector('#theme').click();
    assert.equal(d.documentElement.dataset.theme, 'light');
    assert.deepEqual(page.errors, []);
  });
}

test('utility search handles accents, retains focused rows on refresh, and clears empty results', async (t) => {
  const page = await createPage();
  t.after(page.close);
  const { w, d } = page,
    search = d.querySelector('#utility-search');
  search.value = 'hydro quebec';
  search.dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('[data-select]').length, 1);
  const row = d.querySelector('[data-select="hq"]');
  row.focus();
  d.dispatchEvent(new w.CustomEvent('eo:data', { detail: 'customers' }));
  assert.equal(d.querySelector('[data-select="hq"]'), row);
  assert.equal(d.activeElement, row);
  search.value = 'no such utility';
  search.dispatchEvent(new w.Event('input'));
  assert.match(d.querySelector('#utility-list').textContent, /No utilities found/);
  d.querySelector('.utility-empty button').click();
  assert.equal(d.querySelectorAll('[data-select]').length, 93);
  assert.equal(d.activeElement, search);
  assert.equal(d.querySelector('#utility-clear').hidden, true);
});

test('changing map colours reuses polygon layers, and shared views retain the metric and clear comparisons', async (t) => {
  const page = await createPage({ query: '?view=reliability&mapMetric=saidi&compare=alectra' });
  t.after(page.close);
  const { w, d } = page;
  w.EOMaps.init('reliability');
  assert.equal(d.querySelector('#map-metric').value, 'saidi');
  assert.equal(d.querySelector('#map-metric').closest('.map-settings'), null);
  const original = w.L.geoJSON;
  let constructions = 0;
  w.L.geoJSON = (...args) => {
    constructions++;
    return original(...args);
  };
  try {
    d.querySelector('#map-metric').value = 'saifi';
    d.querySelector('#map-metric').dispatchEvent(new w.Event('change'));
    d.dispatchEvent(new w.CustomEvent('eo:data', { detail: 'customers' }));
    assert.equal(constructions, 0, 'existing geometry is styled without rebuilding it');
    assert.equal(new URL(w.location.href).searchParams.get('mapMetric'), 'saifi');
    d.querySelector('#compare-utility').value = '';
    d.querySelector('#compare-utility').dispatchEvent(new w.Event('change'));
    assert.equal(new URL(w.location.href).searchParams.has('compare'), false);
  } finally {
    w.L.geoJSON = original;
  }
  assert.deepEqual(page.errors, []);
});
