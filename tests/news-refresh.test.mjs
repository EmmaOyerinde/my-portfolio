import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { NEWS_SOURCES, NEWS_REFRESH_MS, mergeArticles } from '../js/news-core.mjs';
import { createNewsFeed, startNewsRefresh } from '../js/news-refresh.mjs';
import { renderNewsCards } from '../js/news-view.mjs';
import { refreshNews } from '../scripts/lib/refresh-news.mjs';
const now = Date.now();
const iso = (offset = 0) => new Date(now + offset).toISOString();
const article = (source, name = 'latest') => ({
  id: `https://www.canada.ca/en/news/${source.id}-${name}.html`,
  url: `https://www.canada.ca/en/news/${source.id}-${name}.html`,
  source: source.id,
  publisher: source.name,
  title: `Electricity grid ${name}`,
  publishedAt: iso(-86400000),
  topic: source.topic,
});
const snapshot = (source, checked = iso(-3600000), name = 'saved') => ({
  groups: { [source.id]: [article(source, name)] },
  health: { [source.id]: { checkedAt: checked } },
});

test('live requests start alongside a slow snapshot, concurrent refreshes coalesce and old saves cannot overwrite live news', async () => {
  const source = NEWS_SOURCES[0];
  let releaseSnapshot,
    requests = 0;
  const feed = createNewsFeed({
    sources: [source],
    now: () => now,
    loadSnapshot: () =>
      new Promise((resolve) => {
        releaseSnapshot = resolve;
      }),
    loadSource: async () => {
      requests++;
      return { articles: [article(source)], checkedAt: iso() };
    },
  });
  const pending = feed.refresh();
  assert.equal(feed.refresh(), pending);
  assert.equal(requests, 1);
  await Promise.resolve();
  assert.equal(feed.state.health[source.id].state, 'live');
  releaseSnapshot(snapshot(source));
  await pending;
  assert.match(feed.state.groups[source.id][0].title, /latest/);
  assert.equal(feed.state.health[source.id].state, 'live');
  assert.equal(feed.state.loading, false);
});

test('a failed publisher retains its headlines, a newer backup is adopted, and a later live check recovers', async () => {
  const [source, other] = NEWS_SOURCES;
  let fail = true;
  const feed = createNewsFeed({
    sources: [source, other],
    now: () => now,
    loadSnapshot: async () => snapshot(source, iso(-60000), 'newer backup'),
    loadSource: async (s) => {
      if (s === source && fail) throw Error('HTTP 503');
      return { articles: [article(s)], checkedAt: iso() };
    },
  });
  feed.restore(snapshot(source));
  await feed.refresh();
  assert.match(feed.state.groups[source.id][0].title, /newer backup/);
  assert.equal(feed.state.health[source.id].checkedAt, iso(-60000));
  assert.equal(feed.state.health[other.id].state, 'live');
  fail = false;
  await feed.refresh();
  assert.match(feed.state.groups[source.id][0].title, /latest/);
  assert.equal(feed.state.health[source.id].state, 'live');
});

test('corrupt, future-dated and unsafe saved news cannot replace validated headlines', async () => {
  const source = NEWS_SOURCES[0];
  const feed = createNewsFeed({ sources: [source], now: () => now });
  feed.restore(snapshot(source));
  feed.restore({ groups: null });
  feed.restore(snapshot(source, iso(86400000), 'future'));
  const bad = snapshot(source, iso());
  bad.groups[source.id][0].url = 'javascript:alert(1)';
  feed.restore(bad);
  assert.match(feed.state.groups[source.id][0].title, /saved/);
});

test('refresh continues anywhere on the visible page and catches up after focus, history and reconnect', () => {
  const doc = new EventTarget(),
    win = new EventTarget();
  let current = now,
    last = iso(),
    calls = 0,
    tick;
  doc.visibilityState = 'visible';
  win.setInterval = (fn) => {
    tick = fn;
    return 1;
  };
  win.clearInterval = () => {};
  const stop = startNewsRefresh({
    win,
    doc,
    now: () => current,
    lastAttempt: () => last,
    refresh: () => {
      calls++;
      last = new Date(current).toISOString();
    },
  });
  tick();
  assert.equal(calls, 0);
  current += NEWS_REFRESH_MS;
  tick();
  assert.equal(calls, 1);
  doc.visibilityState = 'hidden';
  current += NEWS_REFRESH_MS;
  tick();
  assert.equal(calls, 1);
  doc.visibilityState = 'visible';
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(calls, 2);
  for (const event of ['focus', 'pageshow']) {
    current += NEWS_REFRESH_MS;
    win.dispatchEvent(new Event(event));
  }
  assert.equal(calls, 4);
  win.dispatchEvent(new Event('online'));
  assert.equal(calls, 5);
  stop();
  current += NEWS_REFRESH_MS;
  win.dispatchEvent(new Event('focus'));
  assert.equal(calls, 5);
});

test('hourly refresh preserves a failed source and updates other publishers without changing article dates', async (t) => {
  const dir = await fs.mkdtemp(path.join(process.cwd(), '.news-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'news.json');
  const source = NEWS_SOURCES[0];
  const before = snapshot(source);
  await fs.writeFile(file, JSON.stringify(before));
  await refreshNews({
    file,
    loadSource: async (s) => {
      if (s === source) throw Error('HTTP 403');
      return { articles: [article(s)], checkedAt: iso() };
    },
  });
  const saved = JSON.parse(await fs.readFile(file));
  assert.deepEqual(saved.groups[source.id], before.groups[source.id]);
  assert.equal(saved.health[source.id].checkedAt, before.health[source.id].checkedAt);
  assert.equal(saved.health[source.id].status, 'blocked');
  assert.equal(saved.health.cnsc.status, 'ok');
  assert.equal(saved.groups.cnsc[0].publishedAt, iso(-86400000));
});

test('the news screen separates publication and check dates, refreshes cards, and links readable source pages', async (t) => {
  const html = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://example.com/my-portfolio/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const w = dom.window,
    d = w.document;
  w.matchMedia = () => ({ matches: false, addEventListener() {} });
  let feed,
    generation = 1;
  const code = (await fs.readFile(new URL('../js/news.js', import.meta.url), 'utf8')).replace(
    /^import .*;\n/gm,
    '',
  );
  new w.Function(
    'NEWS_SOURCES',
    'mergeArticles',
    'createNewsFeed',
    'startNewsRefresh',
    'renderNewsCards',
    code,
  )(
    NEWS_SOURCES,
    mergeArticles,
    (options) =>
      (feed = createNewsFeed({
        ...options,
        loadSnapshot: async () => null,
        loadSource: async (s) => ({
          articles: [article(s, `update ${generation}`)],
          checkedAt: iso(),
        }),
      })),
    (options) => startNewsRefresh({ ...options, win: w, doc: d }),
    renderNewsCards,
  );
  await feed.refresh();
  assert.match(d.querySelector('#feed-status').textContent, /Connected to 4/);
  assert.match(d.querySelector('#feed-checked').textContent, /Checked .*auto-refresh every 5 min/);
  assert.match(d.querySelector('#feed-latest').textContent, /Latest published .*latest available/);
  assert.equal(d.querySelector('#news-health a').href, NEWS_SOURCES[0].page);
  generation++;
  d.querySelector('#news-refresh').click();
  await feed.refresh();
  assert.match(d.querySelector('#news-grid').textContent, /update 2/);
  assert.equal(d.querySelector('#news-refresh').disabled, false);
  assert.equal(d.querySelector('#news-grid').getAttribute('aria-busy'), 'false');
});
