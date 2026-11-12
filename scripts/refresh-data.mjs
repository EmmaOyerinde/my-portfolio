import { fetchCustomers } from './adapters/customers.mjs';
import { fetchIeso } from './adapters/ieso.mjs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fetchReliability } from './adapters/reliability.mjs';
import { fetchBalance, fetchScenarios } from './adapters/energy.mjs';
import { fetchRemoteCommunities } from './adapters/remote.mjs';
import { fetchBoundaries } from './lib/fetch-boundaries.mjs';
import { sourceFetch } from './lib/source-fetch.mjs';
import { refreshDatasets } from './lib/refresh.mjs';
import { NEWS_SOURCES } from '../js/news-core.mjs';
import { refreshNews } from './lib/refresh-news.mjs';
const directory = fileURLToPath(new URL('../data/', import.meta.url));
const runUrl =
  process.env.GITHUB_ACTIONS === 'true' &&
  /^[\w.-]+\/[\w.-]+$/.test(process.env.GITHUB_REPOSITORY || '') &&
  /^\d+$/.test(process.env.GITHUB_RUN_ID || '')
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null;
const manifest = await refreshDatasets({
  directory,
  runUrl,
  loaders: {
    customers: () => fetchCustomers(sourceFetch),
    ieso: () => fetchIeso(sourceFetch),
    reliability: () => fetchReliability(sourceFetch),
    scenarios: () => fetchScenarios(sourceFetch),
    balance: () => fetchBalance(sourceFetch),
    communities: () => fetchRemoteCommunities({ fetchImpl: sourceFetch }),
    boundaries: () => fetchBoundaries(sourceFetch),
  },
});
const news = await refreshNews();
const rows = Object.entries(manifest.datasets).map(
  ([kind, s]) => `| ${kind} | ${s.status} | ${s.period} | ${s.lastSuccessAt} |`,
);
const summary = [
  '## Published-data check',
  '',
  '| Dataset | Result | Retained period | Successful source check |',
  '|---|---|---|---|',
  ...rows,
  '',
  'Source failures preserve the previous verified file. A check time is not an observation date.',
  '',
  ...NEWS_SOURCES.map((s) => `- News / ${s.short}: ${news.health[s.id].status}`),
].join('\n');
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
for (const [kind, s] of Object.entries(manifest.datasets))
  if (s.status !== 'ok')
    console.log(
      `::warning title=Source check incomplete::${kind}: ${s.status}. Last verified ${s.period} retained.`,
    );
// Source outages are a handled health result. Validation/build failures still stop deployment.
