// Dependency-free, Worker-compatible OEB annual reliability adapter.
// Cache the returned normalized payload at the caller; do not relabel an old payload as freshly fetched.
export const RELIABILITY_CATALOG =
  'https://www.oeb.ca/open-data/electricity-distributor-performance-scorecard';
export const RELIABILITY_METHOD = {
  label: 'OEB scorecard · loss of supply and major events excluded',
  saidiUnit: 'hours per customer per year',
  saifiUnit: 'interruptions per customer per year',
  scope: 'Annual Ontario distributor performance; not a live outage feed.',
  references: [
    'https://www.oeb.ca/oeb/_Documents/EB-2015-0182/Notice_Amendments_RRR_MajorEvents_20160503.pdf',
    'https://www.oeb.ca/sites/default/files/uploads/Scorecard_Performance_Measure_Data_Specifications.pdf',
    'https://www.oeb.ca/documents/scorecard/2025/Scorecard%20-%20Alectra%20Utilities%20Corporation.pdf',
  ],
};

function decodeXml(value) {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, raw) => {
      const number = raw[0].toLowerCase() === 'x' ? parseInt(raw.slice(1), 16) : Number(raw);
      return Number.isSafeInteger(number) && number > 0 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : '';
    })
    .replace(
      /&(amp|lt|gt|quot|apos);/g,
      (_, key) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[key],
    )
    .trim();
}

function field(block, tag) {
  const match = block.match(new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + tag + '>'));
  return match ? decodeXml(match[1]) : null;
}

function metric(value, label) {
  if (value == null || /^(?:N\/?A|not available|-)??$/i.test(value.trim())) return null;
  if (!/^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value))
    throw new Error('OEB ' + label + ' contains an unexpected numeric value');
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 100000)
    throw new Error('OEB ' + label + ' is out of range');
  return number;
}

export function discoverReliabilityRelease(html, now = new Date()) {
  const links = [
    ...String(html).matchAll(/href\s*=\s*["']([^"']*scorecard_data_(\d{4})\.xml)["']/gi),
  ]
    .map((match) => ({
      url: new URL(decodeXml(match[1]), RELIABILITY_CATALOG),
      year: Number(match[2]),
    }))
    .filter(
      ({ url, year }) =>
        url.protocol === 'https:' &&
        url.hostname === 'www.oeb.ca' &&
        /^\/_html\/performance\/data\/scorecard_data_\d{4}\.xml$/.test(url.pathname) &&
        year >= 2016 &&
        year <= now.getUTCFullYear(),
    );
  links.sort((a, b) => b.year - a.year);
  if (!links.length) throw new Error('OEB catalog has no recognized annual scorecard download');
  return { sourceUrl: links[0].url.href, year: links[0].year };
}

export function parseReliabilityXml(xml, year) {
  if (!Number.isInteger(year) || year < 2016 || year > 2200)
    throw new Error('Invalid reporting year');
  if (!String(xml).includes('<PerformanceItemsTable>') || /<!DOCTYPE|<!ENTITY/i.test(xml))
    throw new Error('Unrecognized OEB scorecard XML');
  const blocks = [
    ...xml.matchAll(/<PerformanceItemRow(?:\s[^>]*)?>([\s\S]*?)<\/PerformanceItemRow>/g),
  ];
  if (blocks.length < 20 || blocks.length > 200)
    throw new Error('Unexpected OEB distributor coverage');
  const names = new Set();
  const rows = blocks.map(([, block]) => {
    const name = field(block, 'dist');
    if (!name || name.length > 180 || /[<>]/.test(name))
      throw new Error('Invalid OEB distributor name');
    const normalizedName = name.toLowerCase();
    if (names.has(normalizedName)) throw new Error('Duplicate OEB distributor');
    names.add(normalizedName);
    return {
      name,
      year,
      saidi: metric(field(block, 'powerouthrs'), 'SAIDI'),
      saifi: metric(field(block, 'powerouttimes'), 'SAIFI'),
      customers: null, // Customer counts are not present in scorecard XML. Never substitute costpercust.
      sourceRecordUrl:
        'https://www.oeb.ca/_html/performance/report_builder_dist_display.php?showdist=' +
        encodeURIComponent(name),
    };
  });
  if (rows.filter((row) => row.saidi != null && row.saifi != null).length < 20)
    throw new Error('OEB reliability measures unavailable');
  return rows;
}

async function checkedFetch(fetcher, url, maxBytes) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15000);
  try {
    const response = await fetcher(url, {
      headers: { Accept: 'application/xml,text/xml,text/html;q=0.8' },
      signal: abort.signal,
    });
    if (!response.ok) throw new Error('OEB request returned HTTP ' + response.status);
    // Follow only same-origin official redirects; never expose an arbitrary proxy endpoint.
    if (response.url && new URL(response.url).hostname !== 'www.oeb.ca')
      throw new Error('Unexpected OEB redirect');
    const text = await response.text();
    if (text.length > maxBytes) throw new Error('OEB response exceeded expected size');
    return {
      text,
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchReliability(fetcher = fetch) {
  const now = new Date();
  const catalog = await checkedFetch(fetcher, RELIABILITY_CATALOG, 500000);
  const { sourceUrl, year } = discoverReliabilityRelease(catalog.text, now);
  const response = await checkedFetch(fetcher, sourceUrl, 1000000);
  const rows = parseReliabilityXml(response.text, year);
  return {
    dataset: 'reliability',
    provider: 'Ontario Energy Board',
    reportingYear: year,
    period: String(year),
    cadence: 'annual',
    checkedAt: new Date().toISOString(),
    sourceUpdatedAt: response.lastModified,
    sourceUrl,
    catalogUrl: RELIABILITY_CATALOG,
    methodology: RELIABILITY_METHOD,
    coverage: {
      region: 'Ontario',
      distributors: rows.length,
      metricsAvailable: rows.filter((row) => row.saidi != null && row.saifi != null).length,
    },
    notes: [
      'The source publishes annual observations, not current outages.',
      'Comparisons use one reporting year and one adjustment method.',
      'Customer counts are unavailable in this source.',
      'Multiple map territories may refer to one distributor; deduplicate by source name when aggregating.',
    ],
    rows,
  };
}
