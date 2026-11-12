import { NEWS_SOURCES, mergeArticles } from './news-core.mjs';
import { createNewsFeed, startNewsRefresh } from './news-refresh.mjs';
import { renderNewsCards } from './news-view.mjs';
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const compactNews = matchMedia('(max-width: 640px)');
const pageSize = () => (compactNews.matches ? 3 : 6);
let previousPageSize = pageSize();
let previousWire = '';
let topic = 'all',
  limit = pageSize();
const feed = createNewsFeed({ onChange: render, onSave: save });
const refresh = () => feed.refresh();
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
const sourceSelect = $('#news-source');
for (const source of NEWS_SOURCES) {
  const o = document.createElement('option');
  o.value = source.id;
  o.textContent = source.name;
  sourceSelect.append(o);
}
function savedTime(id) {
  const h = feed.state.health[id];
  return h?.checkedAt && Number.isFinite(Date.parse(h.checkedAt))
    ? timeFormat.format(new Date(h.checkedAt))
    : 'not checked';
}
function currentArticles() {
  return mergeArticles(Object.values(feed.state.groups));
}
function render() {
  const { groups, health, loading, lastAttempt } = feed.state;
  $('#news-refresh').disabled = loading;
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
  grid.setAttribute('aria-busy', String(loading));
  renderNewsCards(
    grid,
    filtered.slice(0, limit),
    health,
    loading
      ? 'Connecting to official feeds…'
      : all.length
        ? 'No headlines match these filters. Try another topic or search.'
        : 'News is temporarily unavailable. Refresh to try the official feeds again.',
  );
  $('#news-count').textContent =
    `${Math.min(limit, filtered.length)} of ${filtered.length} matching headlines · past 180 days`;
  $('#news-more').hidden = filtered.length <= limit;
  const live = Object.values(health).filter((h) => h.state === 'live').length;
  $('#feed-status').textContent = loading
    ? 'Refreshing official feeds'
    : live === NEWS_SOURCES.length
      ? `Connected to ${NEWS_SOURCES.length} official sources`
      : live > 0
        ? `${live} of ${NEWS_SOURCES.length} sources connected`
        : 'Saved headlines · not live';
  if (!all.length && !loading && !live) $('#feed-status').textContent = 'Feeds unavailable';
  $('#feed-light').className = `status-light ${live ? 'live' : 'offline'}`;
  const checked = Object.values(health)
    .map((h) => Date.parse(h.checkedAt))
    .filter(Number.isFinite);
  const latestCheck = checked.length ? Math.max(...checked) : null;
  $('#feed-checked').textContent = loading
    ? 'Checking now…'
    : lastAttempt
      ? `Checked ${timeFormat.format(new Date(lastAttempt))} · auto-refresh every 5 min`
      : latestCheck
        ? `Saved check ${timeFormat.format(new Date(latestCheck))}`
        : 'Connecting…';
  $('#feed-latest').hidden = !all.length;
  $('#feed-latest').textContent = all.length
    ? `Latest published ${dateFormat.format(new Date(all[0].publishedAt))}${!loading && live === NEWS_SOURCES.length ? ' · latest available from these sources' : ''}`
    : '';
  const panel = $('#news-health');
  NEWS_SOURCES.forEach((source) => {
    let row = panel.querySelector(`[data-source="${source.id}"]`);
    if (!row) {
      row = document.createElement('div');
      row.className = 'source-health-row';
      row.dataset.source = source.id;
      const label = document.createElement('div');
      const link = document.createElement('a');
      link.href = source.page;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.name;
      label.append(link, document.createElement('small'));
      row.append(label, document.createElement('span'));
      panel.append(row);
    }
    row.querySelector('small').textContent = `Last successful check: ${savedTime(source.id)}`;
    const status = row.querySelector(':scope > span');
    const h = health[source.id];
    status.textContent =
      h?.state === 'live'
        ? `Connected · ${groups[source.id]?.length || 0} relevant headlines`
        : h?.checkedAt
          ? 'Saved results · source unavailable'
          : loading
            ? 'Connecting…'
            : 'Unavailable';
  });
  const wire = { articles: all.slice(0, 12), live, loading, health };
  const signature = JSON.stringify(wire);
  if (signature !== previousWire) {
    previousWire = signature;
    document.dispatchEvent(new CustomEvent('eo:news', { detail: wire }));
  }
}
function save() {
  try {
    localStorage.setItem(
      'eo-news-v2',
      JSON.stringify({ groups: feed.state.groups, health: feed.state.health }),
    );
  } catch (e) {}
}
$$('[data-news-topic]').forEach(
  (b) =>
    (b.onclick = () => {
      topic = b.dataset.newsTopic;
      limit = pageSize();
      $$('[data-news-topic]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render();
    }),
);
$('#news-search').oninput = () => {
  limit = pageSize();
  render();
};
sourceSelect.onchange = () => {
  limit = pageSize();
  render();
};
$('#news-more').onclick = () => {
  const firstNew = $('#news-grid').querySelectorAll('.news-card').length;
  limit += pageSize();
  render();
  $('#news-grid').children[firstNew]?.querySelector('a')?.focus();
};
compactNews.addEventListener('change', () => {
  const focusedCard = document.activeElement.closest('.news-card');
  const focusedIndex = [...$('#news-grid').children].indexOf(focusedCard);
  if (limit <= previousPageSize) limit = Math.max(pageSize(), focusedIndex + 1);
  previousPageSize = pageSize();
  render();
});
$('#news-refresh').onclick = refresh;
try {
  feed.restore(JSON.parse(localStorage.getItem('eo-news-v2')));
} catch (e) {}
render();
refresh();
startNewsRefresh({ refresh, lastAttempt: () => feed.state.lastAttempt });
