import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NEWS_SOURCES,
  normalizeFeed,
  mergeArticles,
  isNewsURL,
  isSavedArticle,
  fetchSource,
} from '../js/news-core.mjs';

const now = Date.parse('2026-11-10T12:00:00Z'),
  source = NEWS_SOURCES[0];
const item = {
  title: 'New <b>electricity grid</b> investment &amp; storage',
  publishedDate: '2026-11-09T12:00:00Z',
  link: 'https://www.canada.ca/en/news/grid.html?tracking=1#section',
};
const feed = (entries) => ({ feed: { entry: entries } });

test('live news filters unsafe, malformed, stale and irrelevant entries while keeping valid headlines', () => {
  const items = normalizeFeed(
    feed([
      null,
      {},
      item,
      { ...item, link: 'https://username:password@www.canada.ca/en/news/grid.html' },
      { ...item, link: 'javascript:alert(1)' },
      { ...item, publishedDate: '2025-01-01' },
      { ...item, publishedDate: '2030-01-01' },
      { ...item, title: 'Minister to announce energy investment', publishedDate: '2026-09-01' },
      { ...item, title: 'A different subject' },
    ]),
    source,
    now,
  );
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'New electricity grid investment & storage');
  assert.equal(items[0].url, 'https://www.canada.ca/en/news/grid.html');
  assert.equal(isSavedArticle(items[0], source), true);
  assert.equal(isSavedArticle({ ...items[0], url: 'javascript:alert(1)' }, source), false);
  assert.equal(isNewsURL('https://canada.ca/en/news/item'), true);
  assert.equal(isNewsURL('https://www.canada.ca:8000/'), false);
  assert.equal(mergeArticles([items, items], now).length, 1);
  assert.throws(() => normalizeFeed({}, source, now), /Unexpected feed format/);
});

test('failed or oversized news responses reject without creating an empty successful publication', async () => {
  await assert.rejects(
    fetchSource(source, async () => new Response('Unavailable', { status: 503 })),
    /HTTP 503/,
  );
  await assert.rejects(
    fetchSource(
      source,
      async () => new Response('{}', { headers: { 'content-length': '3000000' } }),
    ),
    /too large/,
  );
  await assert.rejects(
    fetchSource(source, async () => new Response('{broken')),
    SyntaxError,
  );
});
