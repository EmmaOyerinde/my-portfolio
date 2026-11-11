import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { renderNewsCards } from '../js/news-view.mjs';
import { createPage, tick } from './helpers/page.mjs';

const article = (id) => ({
  title: `Headline ${id}`,
  url: `https://www.canada.ca/en/news/${id}.html`,
  publisher: 'Natural Resources Canada',
  source: 'nrcan',
  topic: 'energy',
  publishedAt: '2026-11-10T12:00:00Z',
});

test('news refreshes retain link identity and keyboard focus even when articles reorder', (t) => {
  const dom = new JSDOM('<div id="grid"></div>');
  t.after(() => dom.window.close());
  const d = dom.window.document;
  const grid = d.querySelector('#grid');
  renderNewsCards(grid, [article(1), article(2)], {}, 'No news');
  const link = grid.children[1].querySelector('a');
  link.focus();
  renderNewsCards(
    grid,
    [article(3), article(2), article(1)],
    { nrcan: { state: 'live' } },
    'No news',
  );
  assert.equal(grid.children[1].querySelector('a'), link);
  assert.equal(d.activeElement, link);
  assert.equal(link.textContent, 'Natural Resources Canada');
  renderNewsCards(grid, [article(3), article(1), article(2)], {}, 'No news');
  assert.equal(d.activeElement, link);
  assert.equal(grid.children[2].querySelector('a'), link);
  renderNewsCards(grid, [], {}, 'No news');
  assert.equal(d.activeElement, grid);
  assert.equal(grid.textContent, 'No news');
});

test('news titles and publishers are rendered as text', (t) => {
  const dom = new JSDOM('<div id="grid"></div>');
  t.after(() => dom.window.close());
  const grid = dom.window.document.querySelector('#grid');
  renderNewsCards(
    grid,
    [{ ...article(1), title: '<img src=x onerror=alert(1)>', publisher: '<script>bad()</script>' }],
    {},
    'No news',
  );
  assert.equal(grid.querySelectorAll('img,script').length, 0);
  assert.match(grid.textContent, /<img/);
});

test('the news banner refreshes while motion is reduced and safely defers while being read', async (t) => {
  const page = await createPage();
  t.after(page.close);
  const { w, d, media, errors } = page;
  const send = (items) =>
    d.dispatchEvent(
      new w.CustomEvent('eo:news', {
        detail: { articles: items, health: {}, live: 0, loading: false },
      }),
    );
  media.change(true);
  send([article(1)]);
  send([article(2)]);
  assert.match(d.querySelector('#wire-group').textContent, /Headline 2/);
  const reading = d.querySelector('#wire-group a');
  reading.focus();
  send([article(3)]);
  assert.equal(d.activeElement, reading);
  assert.match(d.querySelector('#wire-group').textContent, /Headline 2/);
  d.querySelector('#theme').focus();
  await tick();
  assert.match(d.querySelector('#wire-group').textContent, /Headline 3/);
  send([]);
  assert.equal(d.querySelector('.wire-copy'), null);
  assert.equal(d.querySelector('#wire-position').textContent, '00 / 00');
  assert.match(d.querySelector('#wire-group').textContent, /temporarily unavailable/);
  assert.deepEqual(errors, []);
});
