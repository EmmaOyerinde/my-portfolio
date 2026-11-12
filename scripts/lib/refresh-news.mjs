import { NEWS_SOURCES, fetchSource } from '../../js/news-core.mjs';
import { readJson, atomicJson, retry, classify } from './refresh.mjs';

// Shared by the daily evidence run and the lightweight hourly news run.
export async function refreshNews({
  file = new URL('../../data/news-snapshot.json', import.meta.url),
  loadSource = fetchSource,
} = {}) {
  const news = (await readJson(file)) || { groups: {}, health: {} };
  news.groups ||= {};
  news.health ||= {};
  await Promise.all(
    NEWS_SOURCES.map(async (source) => {
      try {
        const result = await retry(() => loadSource(source));
        news.groups[source.id] = result.articles;
        news.health[source.id] = {
          checkedAt: result.checkedAt,
          state: 'saved',
          lastAttemptAt: new Date().toISOString(),
          status: 'ok',
        };
      } catch (error) {
        news.health[source.id] = {
          ...news.health[source.id],
          state: 'saved',
          status: classify(error),
          lastAttemptAt: new Date().toISOString(),
        };
      }
    }),
  );
  news.savedAt = new Date().toISOString();
  await atomicJson(file, news);
  return news;
}
