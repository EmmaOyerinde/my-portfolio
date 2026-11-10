import {
  NEWS_SOURCES,
  NEWS_REFRESH_MS,
  fetchSource,
  mergeArticles,
  isSavedArticle,
} from './news-core.mjs';
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
let topic = 'all',
  limit = 9,
  loading = false,
  groups = {},
  health = {},
  lastAttempt = null,
  fromSnapshot = false,
  visible = false;
const dateFormat = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const timeFormat = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
const labels = {
  energy: 'ENERGY & GRIDS',
  nuclear: 'NUCLEAR',
  climate: 'CLIMATE',
  infrastructure: 'INFRASTRUCTURE',
};
const sourceSelect = $('#news-source');
for (const source of NEWS_SOURCES) {
  const o = document.createElement('option');
  o.value = source.id;
  o.textContent = source.name;
  sourceSelect.append(o);
}
function savedTime(id) {
  const h = health[id];
  return h?.checkedAt && Number.isFinite(Date.parse(h.checkedAt))
    ? timeFormat.format(new Date(h.checkedAt))
    : 'not checked';
}
function currentArticles() {
  return mergeArticles(Object.values(groups));
}
function render() {
  const all = currentArticles(),
    q = $('#news-search').value.trim().toLowerCase(),
    source = sourceSelect.value;
  const filtered = all.filter(
    (a) =>
      (topic === 'all' || a.topic === topic) &&
      (source === 'all' || a.source === source) &&
      (!q || `${a.title} ${a.publisher}`.toLowerCase().includes(q)),
  );
  const grid = $('#news-grid');
  grid.replaceChildren();
  for (const article of filtered.slice(0, limit)) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.dataset.topic = article.topic;
    const meta = document.createElement('div');
    meta.className = 'news-card-meta';
    const tag = document.createElement('span');
    tag.textContent = labels[article.topic];
    const time = document.createElement('time');
    time.dateTime = article.publishedAt;
    time.textContent = dateFormat.format(new Date(article.publishedAt));
    meta.append(tag, time);
    const title = document.createElement('h3');
    title.textContent = article.title;
    const link = document.createElement('a');
    link.href = article.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent =
      article.publisher + (health[article.source]?.state === 'live' ? '' : ' · saved');
    link.setAttribute('aria-label', `Read ${article.title}; ${article.publisher}`);
    card.append(meta, title, link);
    grid.append(card);
  }
  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.className = 'news-empty';
    empty.textContent = loading
      ? 'Connecting to official feeds…'
      : all.length
        ? 'No headlines match these filters. Try another topic or search.'
        : 'News is temporarily unavailable. Refresh to try the official feeds again.';
    grid.append(empty);
  }
  $('#news-count').textContent =
    `${Math.min(limit, filtered.length)} of ${filtered.length} matching headlines · past 180 days`;
  $('#news-more').hidden = filtered.length <= limit;
  const live = Object.values(health).filter((h) => h.state === 'live').length;
  $('#feed-status').textContent = loading
    ? 'Refreshing official feeds'
    : live === NEWS_SOURCES.length
      ? 'Connected to 4 official sources'
      : live > 0
        ? `${live} of 4 sources connected`
        : 'Saved headlines · not live';
  if (!all.length && !loading && !live) $('#feed-status').textContent = 'Feeds unavailable';
  $('#feed-light').className = `status-light ${live ? 'live' : 'offline'}`;
  $('#feed-checked').textContent = lastAttempt
    ? `Last check ${timeFormat.format(new Date(lastAttempt))}`
    : fromSnapshot
      ? 'Showing a dated saved feed while connecting'
      : 'Checking source availability…';
  const panel = $('#news-health');
  panel.replaceChildren();
  NEWS_SOURCES.forEach((source) => {
    const row = document.createElement('div');
    row.className = 'source-health-row';
    const label = document.createElement('div'),
      link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = source.name;
    const detail = document.createElement('small');
    detail.textContent = `Last successful check: ${savedTime(source.id)}`;
    label.append(link, detail);
    const status = document.createElement('span');
    const h = health[source.id];
    status.textContent =
      h?.state === 'live'
        ? `Connected · ${groups[source.id]?.length || 0} relevant headlines`
        : h?.checkedAt
          ? 'Saved results · source unavailable'
          : loading
            ? 'Connecting…'
            : 'Unavailable';
    row.append(label, status);
    panel.append(row);
  });
  if (all.length) {
    const lead = all[0];
    $('#hero-headline').textContent = lead.title;
    $('#hero-news-meta').textContent =
      `${NEWS_SOURCES.find((s) => s.id === lead.source)?.short || lead.publisher} · ${dateFormat.format(new Date(lead.publishedAt))} · ${health[lead.source]?.state === 'live' ? 'feed connected' : 'saved headline'}`;
  }
  document.dispatchEvent(
    new CustomEvent('eo:news', { detail: { articles: all.slice(0, 12), live, loading, health } }),
  );
}
function save() {
  try {
    localStorage.setItem('eo-news-v2', JSON.stringify({ groups, health }));
  } catch (e) {}
}
function loadSaved(payload) {
  if (!payload || typeof payload.groups !== 'object') return;
  for (const source of NEWS_SOURCES) {
    const items = payload.groups[source.id];
    if (!Array.isArray(items)) continue;
    if (
      Date.parse(health[source.id]?.checkedAt || '') >
      Date.parse(payload.health?.[source.id]?.checkedAt || '')
    )
      continue;
    groups[source.id] = items.filter((article) => isSavedArticle(article, source));
    health[source.id] = {
      checkedAt: Number.isFinite(Date.parse(payload.health?.[source.id]?.checkedAt))
        ? payload.health[source.id].checkedAt
        : null,
      state: 'saved',
    };
  }
}
async function refresh() {
  if (loading) return;
  loading = true;
  $('#news-refresh').disabled = true;
  render();
  const results = await Promise.allSettled(NEWS_SOURCES.map((source) => fetchSource(source)));
  results.forEach((result, i) => {
    const id = NEWS_SOURCES[i].id;
    if (result.status === 'fulfilled') {
      groups[id] = result.value.articles;
      health[id] = { checkedAt: result.value.checkedAt, state: 'live' };
    } else health[id] = { ...health[id], state: 'failed' };
  });
  lastAttempt = new Date().toISOString();
  fromSnapshot = false;
  loading = false;
  $('#news-refresh').disabled = false;
  save();
  render();
}
$$('[data-news-topic]').forEach(
  (b) =>
    (b.onclick = () => {
      topic = b.dataset.newsTopic;
      limit = 9;
      $$('[data-news-topic]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    }),
);
$('#news-search').oninput = () => {
  limit = 9;
  render();
};
sourceSelect.onchange = () => {
  limit = 9;
  render();
};
$('#news-more').onclick = () => {
  limit += 9;
  render();
};
$('#news-refresh').onclick = refresh;
try {
  loadSaved(JSON.parse(localStorage.getItem('eo-news-v2')));
} catch (e) {}
{
  try {
    const response = await fetch('data/news-snapshot.json', { signal: AbortSignal.timeout(12000) });
    if (response.ok) {
      loadSaved(await response.json());
      fromSnapshot = true;
    }
  } catch (e) {}
}
render();
refresh();
window.addEventListener('online', refresh);
new IntersectionObserver(
  (entries) => {
    visible = entries.some((e) => e.isIntersecting);
  },
  { rootMargin: '250px' },
).observe($('#news'));
setInterval(() => {
  if (document.visibilityState === 'visible' && (visible || scrollY < innerHeight)) refresh();
}, NEWS_REFRESH_MS);
document.addEventListener('visibilitychange', () => {
  if (
    document.visibilityState === 'visible' &&
    (!lastAttempt || Date.now() - Date.parse(lastAttempt) > NEWS_REFRESH_MS)
  )
    refresh();
});
