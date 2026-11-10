import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createPage, tick, read } from './helpers/page.mjs';

test('application loads in dependency order and preserves utility, metric, source and map interactions', async (t) => {
  const page = await createPage();
  t.after(page.close);
  const { w, d, errors } = page;
  await t.test(
    'fresh launch is dark; all 93 profiles retain customers and reporting routes',
    () => {
      assert.equal(d.documentElement.dataset.theme, 'dark');
      assert.equal(w.EOMaps.getState().base, 'dark');
      for (const feature of w.PORTFOLIO_DATA.utilitiesGeoJSON.features) {
        const id = feature.properties.id;
        assert.ok(w.EOData.customer(id).count > 0, id);
        w.EOApp.selectUtility(id, false);
        assert.equal(d.querySelector('#selected-utility').textContent, feature.properties.utility);
        assert.ok(d.querySelector('.jurisdiction-card a'), id);
      }
    },
  );
  await t.test('metric discovery exposes values and focuses the selected utility', () => {
    const finder = d.querySelector('#national-metric-finder');
    assert.equal(finder.querySelectorAll('[data-national-metric]').length, 8);
    for (const [metric, value, id] of [
      ['MAIFI', '2.99', 'entegrus'],
      ['ASAI', '99.929', 'bc'],
      ['CEMIn', '9.9', 'nsp'],
      ['CELID', '23.6', 'nsp'],
    ]) {
      finder.querySelector(`[data-national-metric="${metric}"]`).click();
      assert.ok(finder.querySelector('.national-metric-results').textContent.includes(value));
      finder.querySelector(`[data-metric-utility="${id}"]`).click();
      assert.equal(d.querySelector('#selected-utility').textContent, w.EOData.profile(id).name);
      assert.equal(d.activeElement.id, 'reliability-detail');
      assert.ok(d.querySelector('.reliability-grid').textContent.includes(value));
    }
    for (const metric of ['CAIFI', 'AENS']) {
      finder.querySelector(`[data-national-metric="${metric}"]`).click();
      assert.equal(finder.querySelectorAll('.reliability-value').length, 0);
      assert.ok(finder.querySelector('.metric-gap-review a'));
    }
    finder.querySelector('[data-national-metric=ENS]').click();
    assert.match(finder.textContent, /8.2/);
    assert.match(finder.textContent, /system minutes/);
    assert.match(finder.textContent, /Newfoundland and Labrador Hydro/);
    assert.equal(finder.querySelectorAll('[data-metric-utility=nlh]').length, 0);
    finder.querySelector('[data-national-metric=CAIDI]').click();
    const count = finder.querySelectorAll('.national-result').length;
    finder.querySelector('[data-national-more]').click();
    assert.ok(finder.querySelectorAll('.national-result').length > count);
    for (const id of ['bc', 'entegrus', 'nsp']) {
      w.EOApp.selectUtility(id, false);
      assert.equal(
        d.querySelectorAll('#reliability-detail .reliability-card').length,
        w.EOReliability.rows(id).length,
      );
    }
  });
  await t.test(
    'unchanged refresh keeps focused source controls and existing profile DOM',
    async () => {
      d.querySelector('#source-open').click();
      const button = d.querySelector('#source-cards [data-evidence-kind]');
      button.focus();
      const detail = d.querySelector('#reliability-detail').firstElementChild;
      await w.EOData.refresh('reliability');
      assert.equal(d.activeElement, button);
      assert.equal(d.querySelector('#reliability-detail').firstElementChild, detail);
      button.click();
      assert.equal(d.querySelector('#evidence-dialog').open, true);
      assert.ok(d.querySelector('#evidence-body h2').textContent);
      d.querySelector('#evidence-dialog').close();
      d.querySelector('#source-dialog').close();
      w.EOSources.customerSource('toronto-hydro');
      assert.match(
        d.querySelector('#evidence-body').textContent,
        /Accounts and population are different/,
      );
    },
  );
  await t.test(
    'directory selection fits the complete utility polygon and respects a changed motion preference',
    () => {
      const original = w.L.Map.prototype.fitBounds,
        fits = [];
      w.L.Map.prototype.fitBounds = function (bounds, options) {
        fits.push({ bounds, options });
        return original.call(this, bounds, options);
      };
      try {
        page.media.change(true);
        d.querySelector('[data-select="toronto-hydro"]').click();
        const feature = JSON.parse(read('data/utility-territories.geojson')).features.find(
          (f) => f.properties.id === 'toronto-hydro',
        );
        assert.ok(fits.at(-1).bounds.equals(w.L.geoJSON(feature).getBounds()));
        assert.equal(fits.at(-1).options.animate, false);
        const count = fits.length;
        w.EOMaps.chooseUtility('alectra');
        assert.equal(fits.length, count, 'polygon selection keeps the camera in place');
      } finally {
        w.L.Map.prototype.fitBounds = original;
        page.media.change(false);
      }
    },
  );
  await t.test('category tabs keep dark basemaps and page theme is independent', async () => {
    for (const tab of d.querySelectorAll('[data-tab]')) {
      tab.click();
      await tick();
      assert.equal(w.EOMaps.getState().base, 'dark');
      assert.equal(tab.getAttribute('aria-selected'), 'true');
    }
    d.querySelector('#theme').click();
    assert.equal(d.documentElement.dataset.theme, 'light');
    assert.equal(w.EOMaps.getState().base, 'dark');
  });
  assert.deepEqual(errors, []);
});

for (const failure of ['offline', '404', 'corrupt'])
  test(`${failure} and blocked storage preserve every utility's saved evidence`, async (t) => {
    const page = await createPage({ failure, storage: false, clientOnly: true });
    t.after(page.close);
    const { w } = page;
    for (const feature of w.PORTFOLIO_DATA.utilitiesGeoJSON.features) {
      const profile = w.EOData.profile(feature.properties.id);
      assert.ok(profile.customer.count > 0);
      assert.ok(profile.region);
    }
    assert.equal(w.EOData.status('reliability').state, 'saved');
    assert.equal(w.EOData.status('balance').state, 'saved');
    await assert.rejects(w.EOData.refresh('unrecognised'), /Unknown dataset/);
  });

test('a stale reporting month or hash mismatch cannot replace verified browser data', async (t) => {
  const page = await createPage({ clientOnly: true });
  t.after(page.close);
  const { w } = page,
    prior = w.EOData.get('balance'),
    entry = w.EOData.sourceEntry('balance');
  const manifest = JSON.parse(read('data/source-status.json'));
  manifest.datasets.balance.sha256 = 'a'.repeat(64);
  const malformed = structuredClone(prior);
  malformed.records[0].period = '2000-01';
  for (const candidate of [malformed, prior]) {
    w.fetch = async (url) =>
      new Response(JSON.stringify(String(url).includes('source-status') ? manifest : candidate));
    await w.EOData.refresh('balance');
    assert.equal(w.EOData.get('balance'), prior);
    assert.equal(w.EOData.sourceEntry('balance'), entry);
    assert.equal(w.EOData.status('balance').state, 'saved');
  }
});

test('overlapping refreshes keep each dataset paired with its own verified manifest generation', async (t) => {
  const page = await createPage({ clientOnly: true });
  t.after(page.close);
  const { w } = page;
  const next = structuredClone(w.EOData.get('balance'));
  next.definition += ' Verified refresh test.';
  const bytes = JSON.stringify(next),
    hash = createHash('sha256').update(bytes).digest('hex');
  const first = JSON.parse(read('data/source-status.json'));
  first.datasets.balance.sha256 = hash;
  const second = structuredClone(first);
  second.datasets.balance.sha256 = 'b'.repeat(64);
  let manifestReads = 0,
    release,
    signalStarted;
  const started = new Promise((resolve) => {
    signalStarted = resolve;
  });
  const response = new Promise((resolve) => {
    release = resolve;
  });
  w.fetch = async (url) => {
    if (String(url).includes('source-status'))
      return new Response(JSON.stringify(++manifestReads === 1 ? first : second));
    if (String(url).includes('balance.json')) {
      signalStarted();
      return response;
    }
    throw Error('Unexpected refresh request: ' + url);
  };
  const pending = w.EOData.refresh('balance');
  await started;
  await w.EOData.refresh('ieso');
  release(new Response(bytes));
  await pending;
  assert.equal(w.EOData.get('balance').definition, next.definition);
  assert.equal(w.EOData.health.balance.sha256, hash);
  assert.equal(w.EOData.sourceEntry('balance').sha256, hash);
});
