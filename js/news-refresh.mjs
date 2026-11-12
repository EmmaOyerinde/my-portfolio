import {
  NEWS_SOURCES,
  NEWS_REFRESH_MS,
  fetchSource,
  isSavedArticle,
  mergeArticles,
} from './news-core.mjs';

async function fetchSnapshot() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('data/news-snapshot.json', {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) throw Error('Saved feed unavailable');
    if (Number(response.headers.get('content-length')) > 2500000) throw Error('Feed too large');
    const raw = await response.text();
    if (raw.length > 2500000) throw Error('Feed too large');
    return JSON.parse(raw);
  } finally {
    clearTimeout(timer);
  }
}

// The same saved feed can arrive after a direct response. Never let that race
// roll a successful publisher check back to an older snapshot.
export function createNewsFeed({
  sources = NEWS_SOURCES,
  loadSource = fetchSource,
  loadSnapshot = fetchSnapshot,
  now = Date.now,
  onChange = () => {},
  onSave = () => {},
} = {}) {
  const state = { groups: {}, health: {}, loading: false, lastAttempt: null };
  let pending = null;
  function restore(payload) {
    if (!payload?.groups || typeof payload.groups !== 'object') return;
    for (const source of sources) {
      const items = payload.groups[source.id];
      const checkedAt = Date.parse(payload.health?.[source.id]?.checkedAt);
      if (
        !Array.isArray(items) ||
        items.length > 500 ||
        !Number.isFinite(checkedAt) ||
        checkedAt > now() + 60000
      )
        continue;
      const previous = Date.parse(state.health[source.id]?.checkedAt) || 0;
      if (checkedAt <= previous) continue;
      const valid = items.filter((item) => isSavedArticle(item, source));
      if (items.length && !valid.length) continue;
      state.groups[source.id] = mergeArticles([valid], now()).map((item) => ({
        ...item,
        publisher: source.name,
      }));
      state.health[source.id] = { checkedAt: new Date(checkedAt).toISOString(), state: 'saved' };
    }
  }
  function refresh() {
    if (pending) return pending;
    state.loading = true;
    onChange();
    pending = (async () => {
      await Promise.allSettled([
        // A slow or blocked fallback never delays the direct publisher requests.
        (async () => {
          restore(await loadSnapshot());
          onChange();
        })(),
        ...sources.map(async (source) => {
          try {
            const result = await loadSource(source);
            state.groups[source.id] = mergeArticles([result.articles], now());
            state.health[source.id] = { checkedAt: result.checkedAt, state: 'live' };
          } catch {
            state.health[source.id] = { ...state.health[source.id], state: 'failed' };
          }
          onChange();
        }),
      ]);
      state.lastAttempt = new Date(now()).toISOString();
      state.loading = false;
      pending = null;
      onSave();
      onChange();
    })();
    return pending;
  }
  return { state, restore, refresh };
}

// Refresh throughout the visible page, including when the visitor is exploring
// maps. Focus/pageshow also cover background tabs and browser back/forward cache.
export function startNewsRefresh({
  refresh,
  lastAttempt,
  win = window,
  doc = document,
  now = Date.now,
}) {
  const due = () => {
    if (
      doc.visibilityState === 'visible' &&
      (!lastAttempt() || now() - Date.parse(lastAttempt()) >= NEWS_REFRESH_MS)
    )
      refresh();
  };
  const online = () => {
    if (doc.visibilityState === 'visible') refresh();
  };
  const timer = win.setInterval(due, 30000);
  win.addEventListener('online', online);
  win.addEventListener('focus', due);
  win.addEventListener('pageshow', due);
  doc.addEventListener('visibilitychange', due);
  return () => {
    win.clearInterval(timer);
    win.removeEventListener('online', online);
    win.removeEventListener('focus', due);
    win.removeEventListener('pageshow', due);
    doc.removeEventListener('visibilitychange', due);
  };
}
