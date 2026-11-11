import test from 'node:test';
import assert from 'node:assert/strict';
import { createPage } from './helpers/page.mjs';

test('map failures stay visible until the affected tiles recover and never remove boundary errors', async (t) => {
  const page = await createPage();
  t.after(page.close);
  const { w, d, errors } = page;
  const map = w.EOMaps.init('reliability');
  let base;
  map.eachLayer((layer) => {
    if (layer._url?.includes('Gray_Base')) base = layer;
  });
  assert.ok(base);
  const stage = d.querySelector('[data-map-stage="reliability"]');
  const official = d.createElement('p');
  official.className = 'map-error official-layer-error';
  official.textContent = 'Boundary service unavailable';
  stage.append(official);
  const failed = d.createElement('img');
  base.fire('tileerror', { tile: failed });
  base.fire('tileload', { tile: d.createElement('img') });
  assert.ok(stage.querySelector('.basemap-error'));
  base.fire('tileload', { tile: failed });
  assert.equal(stage.querySelector('.basemap-error'), null);
  assert.ok(official.isConnected);
  base.fire('tileerror', { tile: failed });
  stage.querySelector('.basemap-error button').click();
  assert.equal(stage.querySelector('.basemap-error'), null);
  assert.equal(d.activeElement.dataset.basemap, 'reliability');
  base.fire('tileerror', { tile: failed });
  assert.equal(
    stage.querySelector('.basemap-error'),
    null,
    'a retired layer cannot report new errors',
  );
  assert.ok(official.isConnected);
  assert.deepEqual(errors, []);
});

test('touch maps allow page scrolling inline and restore full dragging when expanded', async (t) => {
  const page = await createPage({ viewport: 390, touch: true });
  t.after(page.close);
  const { w, d, errors } = page;
  const map = w.EOMaps.init('reliability');
  const stage = d.querySelector('[data-map-stage="reliability"]');
  assert.equal(map.dragging.enabled(), false);
  assert.equal(stage.querySelector('.map-touch-hint').hidden, false);
  const button = stage.querySelector('[data-expand]');
  d.body.style.overflow = 'auto';
  button.click();
  assert.equal(map.dragging.enabled(), true);
  assert.equal(stage.querySelector('.map-touch-hint').hidden, true);
  const settings = stage.querySelector('.map-settings');
  settings.open = true;
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(settings.open, false);
  assert.equal(stage.classList.contains('is-expanded'), true);
  assert.equal(d.activeElement, settings.querySelector('summary'));
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(map.dragging.enabled(), false);
  assert.equal(d.activeElement, button);
  assert.equal(d.body.style.overflow, 'auto');
  assert.equal(stage.hasAttribute('aria-label'), false);
  assert.deepEqual(errors, []);
});

test('expanded map keyboard navigation excludes closed layers, hidden and disabled controls', async (t) => {
  const page = await createPage();
  t.after(page.close);
  const { w, d } = page;
  const stage = d.querySelector('[data-map-stage="reliability"]');
  stage.querySelector('[data-expand]').click();
  const items = w.EOUI.focusableWithin(stage);
  assert.ok(items.includes(stage.querySelector('.map-settings > summary')));
  assert.ok(!items.includes(d.querySelector('#map-region')));
  const last = items.at(-1);
  last.focus();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  assert.equal(d.activeElement, items[0]);
  d.dispatchEvent(
    new w.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
  );
  assert.equal(d.activeElement, last);
});
