import test from 'node:test';
import assert from 'node:assert/strict';
import { createPage } from './helpers/page.mjs';

test('compact utility selection closes the picker, preserves customer data, and reveals metric destinations', async (t) => {
  const page = await createPage({ viewport: 390 });
  t.after(page.close);
  const { w, d, media, errors } = page;
  const picker = d.querySelector('#utility-picker');
  assert.equal(picker.open, false);
  picker.open = true;
  d.querySelector('[data-select="alectra"]').click();
  assert.equal(picker.open, false);
  assert.equal(d.querySelector('#utility-picker-label').textContent, 'Alectra Utilities');
  assert.equal(d.activeElement.id, 'selected-utility');
  assert.ok(
    d.querySelector('#utility-metrics').textContent.includes(w.EOData.customerLabel('alectra')),
  );
  media.resize(1280);
  assert.equal(picker.open, true);
  assert.equal(d.querySelector('#selected-utility').textContent, 'Alectra Utilities');
  media.resize(768);
  assert.equal(picker.open, false);
  d.querySelector('#metric-discovery').open = true;
  d.querySelector('[data-national-metric="MAIFI"]').click();
  d.querySelector('[data-metric-utility="entegrus"]').click();
  assert.equal(d.querySelector('#utility-evidence').open, true);
  assert.equal(d.activeElement.id, 'reliability-detail');
  assert.ok(d.querySelector('.reliability-grid').textContent.includes('2.99'));
  d.querySelector('#compare-utility').value = 'toronto-hydro';
  d.querySelector('#compare-utility').dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(d.querySelector('#utility-comparison').open, true);
  assert.ok(d.querySelector('#comparison').textContent.includes('Toronto Hydro'));
  assert.deepEqual(errors, []);
});

test('direct links reveal collapsed research and source destinations', async (t) => {
  const page = await createPage({ viewport: 320, query: '#metric-discovery' });
  t.after(page.close);
  const { w, d, errors } = page;
  assert.equal(d.querySelector('#metric-discovery').open, true);
  w.location.hash = 'utility-context';
  w.dispatchEvent(new w.Event('hashchange'));
  assert.equal(d.querySelector('#utility-context-panel').open, true);
  assert.deepEqual(errors, []);
});

test('resizing the utility directory never leaves focus on a hidden control', async (t) => {
  const page = await createPage({ viewport: 390 });
  t.after(page.close);
  const { d, media } = page;
  d.querySelector('.utility-picker-summary').focus();
  media.resize(1280);
  assert.equal(d.activeElement.id, 'utility-search');
  media.resize(768);
  assert.equal(d.activeElement.className, 'utility-picker-summary');
});
