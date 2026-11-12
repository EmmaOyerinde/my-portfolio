import fs from 'node:fs/promises';
import { NEWS_SOURCES } from '../js/news-core.mjs';
import { refreshNews } from './lib/refresh-news.mjs';

const news = await refreshNews();
const summary = [
  '## News source check',
  '',
  ...NEWS_SOURCES.map(
    (source) =>
      `- ${source.name}: ${news.health[source.id].status}. Last successful check: ${news.health[source.id].checkedAt || 'pending'}.`,
  ),
  '',
  'Original publication dates are retained. Failed sources keep their last successful headlines.',
].join('\n');
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
