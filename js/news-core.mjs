export const NEWS_SOURCES = [
  {
    id: 'nrcan',
    name: 'Natural Resources Canada',
    short: 'NRCan',
    department: 'naturalresourcescanada',
    topic: 'energy',
  },
  {
    id: 'cnsc',
    name: 'Canadian Nuclear Safety Commission',
    short: 'CNSC',
    department: 'canadiannuclearsafetycommission',
    topic: 'nuclear',
  },
  {
    id: 'eccc',
    name: 'Environment and Climate Change Canada',
    short: 'ECCC',
    department: 'departmentoftheenvironment',
    topic: 'climate',
  },
  {
    id: 'hicc',
    name: 'Housing, Infrastructure and Communities Canada',
    short: 'HICC',
    department: 'officeinfrastructure',
    topic: 'infrastructure',
  },
].map((s) => ({
  ...s,
  url: `https://api.io.canada.ca/io-server/gc/news/en/v2?dept=${s.department}&sort=publishedDate&orderBy=desc&pick=100&format=json`,
}));
export const NEWS_REFRESH_MS = 10 * 60 * 1000;
export function isNewsURL(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      ['www.canada.ca', 'canada.ca'].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
export function isSavedArticle(article, source) {
  return (
    !!article &&
    typeof article.title === 'string' &&
    article.title.trim().length > 0 &&
    article.title.length <= 2000 &&
    typeof article.publisher === 'string' &&
    Number.isFinite(Date.parse(article.publishedAt)) &&
    article.id === article.url &&
    article.source === source.id &&
    ['energy', 'nuclear', 'climate', 'infrastructure'].includes(article.topic) &&
    isNewsURL(article.url)
  );
}
const relevant =
  /\b(energ(?:y|ies)|electric(?:ity|al)?|grid|transmission|power|nuclear|reactor|hydro|renewable|wind|solar|battery|batteries|storage|hydrogen|infrastructure|water|wastewater|transit|climate|emissions|decarboni[sz]|net.zero|carbon|resilien(?:ce|t)|clean tech|clean growth|flood|heat pump|charging|zero.emission)\b/i;
export function cleanText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function normalizeFeed(payload, source, now = Date.now()) {
  const raw = payload?.feed?.entry;
  if (raw === undefined) throw new Error('Unexpected feed format');
  const entries = Array.isArray(raw) ? raw : [raw];
  return entries.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const title = cleanText(item.title),
      date = Date.parse(item.publishedDate);
    let url;
    try {
      url = new URL(item.link);
    } catch {
      return [];
    }
    if (
      !title ||
      title.length > 2000 ||
      !Number.isFinite(date) ||
      date > now + 60000 ||
      now - date > 180 * 86400000 ||
      !isNewsURL(url.href)
    )
      return [];
    if (!relevant.test(title)) return [];
    // Older event invitations are not useful as current coverage.
    if (
      /media advisory|to announce|to highlight|will announce|will highlight|to make an announcement/i.test(
        title,
      ) &&
      now - date > 7 * 86400000
    )
      return [];
    url.hash = '';
    url.search = '';
    let topic = source.topic;
    if (/nuclear|reactor|uranium|bruce b|darlington|pickering|point lepreau/i.test(title))
      topic = 'nuclear';
    else if (
      /electric|grid|energy|hydro|hydrogen|wind|solar|battery|charging|heat pump|transmission/i.test(
        title,
      )
    )
      topic = 'energy';
    return [
      {
        id: url.href,
        url: url.href,
        title,
        publishedAt: new Date(date).toISOString(),
        source: source.id,
        publisher: source.name,
        topic,
      },
    ];
  });
}
export function mergeArticles(groups, now = Date.now()) {
  const items = new Map();
  for (const group of groups)
    for (const item of group) {
      if (
        Date.parse(item.publishedAt) > now + 60000 ||
        now - Date.parse(item.publishedAt) > 180 * 86400000
      )
        continue;
      if (!items.has(item.id)) items.set(item.id, item);
    }
  return [...items.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
export async function fetchSource(source, fetcher = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetcher(source.url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (Number(response.headers?.get('content-length')) > 2500000) throw Error('Feed too large');
    const raw = await response.text();
    if (raw.length > 2500000) throw Error('Feed too large');
    const articles = normalizeFeed(JSON.parse(raw), source);
    return { source: source.id, checkedAt: new Date().toISOString(), articles };
  } finally {
    clearTimeout(timer);
  }
}
