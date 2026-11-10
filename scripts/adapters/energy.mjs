/** Authoritative Canadian electricity adapters. No runtime dependencies; Worker compatible. */
export const REGIONS = [
  ['CA', 'Canada', [44158996, 44159003, 44159006, 44159002]],
  ['NL', 'Newfoundland and Labrador', [44159046, 44159051, 44159053, 44159050]],
  ['PE', 'Prince Edward Island', [44159056, 44159061, 44159063, 44159060]],
  ['NS', 'Nova Scotia', [44159066, 44159073, 44159076, 44159072]],
  ['NB', 'New Brunswick', [44159080, 44159089, 44159093, 44159088]],
  ['QC', 'Quebec', [44159097, 44159106, 44159110, 44159105]],
  ['ON', 'Ontario', [44159114, 44159122, 44159126, 44159121]],
  ['MB', 'Manitoba', [44159130, 44159139, 44159143, 44159138]],
  ['SK', 'Saskatchewan', [44159147, 44159156, 44159160, 44159155]],
  ['AB', 'Alberta', [44159009, 44159016, 44159019, 44159015]],
  ['BC', 'British Columbia', [44159023, 44159032, 44159036, 44159031]],
  ['YT', 'Yukon', [44159040, null, null, 44159041]],
  ['NT', 'Northwest Territories', [44159042, null, null, 44159043]],
  ['NU', 'Nunavut', [44159044, null, null, 44159045]],
];
const WDS = 'https://www150.statcan.gc.ca/t1/wds/rest/';
const CER_HOME = 'https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/';
const trustedHosts = new Set([
  'www.cer-rec.gc.ca',
  'cer-rec.gc.ca',
  'open.canada.ca',
  'www150.statcan.gc.ca',
]);
function assert(ok, message) {
  if (!ok) throw new Error(message);
}
function trustedUrl(raw, base) {
  const u = new URL(raw.replace(/&amp;/g, '&'), base);
  assert(
    u.protocol === 'https:' && trustedHosts.has(u.hostname) && !u.username && !u.password,
    'Untrusted data source URL',
  );
  u.hash = '';
  return u.href;
}
async function response(fetcher, url, options) {
  const r = await fetcher(url, options);
  assert(r.ok, `Source returned HTTP ${r.status}`);
  return r;
}
async function json(fetcher, url, options) {
  return (await response(fetcher, url, options)).json();
}
async function text(fetcher, url) {
  return (await response(fetcher, url)).text();
}
const post = (body) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

/** CSV parser supports BOM, CRLF, quoted commas/newlines and doubled quotes. Streams rows in memory. */
export function* csvRows(source) {
  let row = [],
    field = '',
    quoted = false;
  for (let i = source.charCodeAt(0) === 0xfeff ? 1 : 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"' && field === '') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r' || c === '\n') {
      if (c === '\r' && source[i + 1] === '\n') i++;
      row.push(field);
      if (row.some((v) => v !== '')) yield row;
      row = [];
      field = '';
    } else field += c;
  }
  assert(!quoted, 'CSV ended within a quoted field');
  if (field !== '' || row.length) {
    row.push(field);
    yield row;
  }
}
function* csvObjects(source) {
  const it = csvRows(source);
  const head = it.next().value;
  assert(Array.isArray(head), 'Missing CSV header');
  for (const row of it) {
    assert(row.length === head.length, 'CSV column count changed');
    yield Object.fromEntries(head.map((k, i) => [k.trim(), row[i]]));
  }
}
function hrefs(html) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
}
function plain(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ');
}

/** Decode WDS readings without turning suppressed/unavailable values into zero. */
export function statcanValue(point) {
  if (!point || point.value === '' || point.value === null || point.value === undefined)
    return null;
  if (Number(point.securityLevelCode) !== 0 || [1, 8, 9, 10].includes(Number(point.statusCode)))
    return null;
  const n = Number(point.value),
    scale = Number(point.scalarFactorCode);
  assert(
    Number.isFinite(n) && Number.isInteger(scale) && scale >= 0 && scale <= 9,
    'Invalid StatsCan numeric value',
  );
  return (n * 10 ** scale) / 1e6; // source MWh -> TWh
}

export async function fetchBalance(fetcher = fetch) {
  const ids = REGIONS.flatMap((r) => r[2]).filter(Number.isInteger);
  const [data, metadata] = await Promise.all([
    json(
      fetcher,
      WDS + 'getDataFromVectorsAndLatestNPeriods',
      post(ids.map((vectorId) => ({ vectorId, latestN: 24 }))),
    ),
    json(fetcher, WDS + 'getCubeMetadata', post([{ productId: 25100016 }])),
  ]);
  assert(Array.isArray(data) && data.length === ids.length, 'Incomplete StatsCan response');
  const meta = metadata?.[0]?.object;
  assert(
    metadata?.[0]?.status === 'SUCCESS' && String(meta?.productId) === '25100016',
    'StatsCan metadata unavailable',
  );
  const members = meta.dimension?.find((d) => d.dimensionPositionId === 2)?.member;
  for (const id of [1, 2, 6, 17])
    assert(
      members?.find((m) => m.memberId === id)?.memberUomCode === 210,
      'StatsCan unit changed; adapter review required',
    );
  const period = meta.cubeEndDate?.slice(0, 7);
  assert(/^\d{4}-\d{2}$/.test(period), 'Invalid StatsCan reporting period');
  const byVector = new Map();
  for (const entry of data) {
    assert(
      entry.status === 'SUCCESS' &&
        entry.object?.responseStatusCode === 0 &&
        Number(entry.object.productId) === 25100016,
      'StatsCan series failed',
    );
    const obj = entry.object;
    assert(
      ids.includes(obj.vectorId) && Array.isArray(obj.vectorDataPoint),
      'Unexpected StatsCan series',
    );
    byVector.set(obj.vectorId, new Map(obj.vectorDataPoint.map((p) => [p.refPer.slice(0, 7), p])));
  }
  assert(byVector.size === ids.length, 'Duplicate StatsCan series');
  const periods = [...byVector.get(44158996).keys()].sort();
  const history = [];
  for (const month of periods) {
    for (const [region, regionName, vectors] of REGIONS) {
      const pts = vectors.map((v) => (v === null ? null : byVector.get(v).get(month)));
      const [generationTWh, importsTWh, exportsTWh, availableTWh] = pts.map(statcanValue);
      const netExportsTWh =
        importsTWh === null || exportsTWh === null ? null : exportsTWh - importsTWh;
      if (generationTWh !== null && availableTWh !== null && netExportsTWh !== null) {
        assert(
          Math.abs(generationTWh + importsTWh - exportsTWh - availableTWh) < 0.00001,
          'StatsCan energy accounting mismatch',
        );
      }
      history.push({
        region,
        regionName,
        period: month,
        generationTWh,
        availableTWh,
        importsTWh,
        exportsTWh,
        netExportsTWh,
        // Difference is an energy-flow comparison, never a capacity-adequacy deficit.
        generationMinusAvailableTWh:
          generationTWh === null || availableTWh === null ? null : generationTWh - availableTWh,
        releasedAt:
          pts
            .filter(Boolean)
            .map((p) => p.releaseTime)
            .sort()
            .at(-1) || null,
        flags: pts
          .map((p, i) =>
            p
              ? {
                  metric: ['generation', 'imports', 'exports', 'available'][i],
                  statusCode: p.statusCode,
                  symbolCode: p.symbolCode,
                  securityLevelCode: p.securityLevelCode,
                }
              : null,
          )
          .filter(Boolean),
      });
    }
  }
  const records = history.filter((r) => r.period === period);
  assert(
    records.length === 14 &&
      records.every((r) => r.generationTWh !== null && r.availableTWh !== null),
    'Latest StatsCan period incomplete',
  );
  return {
    schemaVersion: 1,
    source: 'Statistics Canada',
    dataset: '25-10-0016-01',
    sourceUrl: 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510001601',
    apiUrl: WDS + 'getDataFromVectorsAndLatestNPeriods',
    reportingPeriod: period,
    releasedAt: meta.releaseTime,
    checkedAt: new Date().toISOString(),
    cadence: 'Monthly',
    unit: 'TWh',
    definition:
      'Generation + receipts − deliveries = electricity available for use within the geographic border. Receipts/deliveries include interprovincial and international flows; at Canada level, international flows only. Availability includes electricity ultimately lost in transmission and distribution; it is not end-use demand or peak capacity. Northern import/export series are not published and remain null.',
    records,
    history,
  };
}

export function parseScenarioCsv(source, { historicalThrough, edition }) {
  const byName = new Map(REGIONS.map((r) => [r[1], r[0]])),
    records = [],
    keys = new Set();
  for (const row of csvObjects(source)) {
    assert(
      ['Scenario', 'Region', 'Variable', 'Year', 'Value', 'Sector'].every((k) => k in row),
      'CER demand schema changed',
    );
    if (row.Variable !== 'Electricity' || row.Sector !== 'Total End-Use') continue;
    const year = Number(row.Year),
      value = Number(row.Value);
    assert(
      byName.has(row.Region) &&
        Number.isInteger(year) &&
        year >= 1900 &&
        year <= 2100 &&
        row.Value.trim() !== '' &&
        Number.isFinite(value) &&
        value >= 0,
      'Invalid CER electricity record',
    );
    const key = [row.Scenario, row.Region, year].join('|');
    assert(!keys.has(key), 'Duplicate CER electricity record');
    keys.add(key);
    records.push({
      region: byName.get(row.Region),
      regionName: row.Region,
      scenario: row.Scenario,
      year,
      demandTWh: value / 3.6,
      historical: year <= historicalThrough,
    });
  }
  const years = [...new Set(records.map((r) => r.year))].sort((a, b) => a - b),
    scenarios = [...new Set(records.map((r) => r.scenario))];
  assert(
    scenarios.length >= 2 &&
      years.includes(historicalThrough) &&
      years.at(-1) >= Number(edition) + 10,
    'Incomplete CER scenario horizon',
  );
  assert(
    records.length === 14 * scenarios.length * years.length,
    'Incomplete CER region/year/scenario coverage',
  );
  // Every scenario is anchored to the same historical electricity observations.
  for (const [region] of REGIONS) {
    const vals = records
      .filter((r) => r.region === region && r.year === historicalThrough)
      .map((r) => r.demandTWh);
    assert(Math.max(...vals) - Math.min(...vals) < 0.0001, 'CER historical scenarios disagree');
  }
  return { records, years, scenarios };
}

export async function fetchScenarios(fetcher = fetch) {
  const home = await text(fetcher, CER_HOME),
    links = hrefs(home);
  const datasetLink = links.find((l) =>
    /^https:\/\/open\.canada\.ca\/data\/en\/dataset\/[a-f0-9-]{36}/i.test(l),
  );
  assert(datasetLink, 'CER current dataset link missing');
  const sourceUrl = trustedUrl(datasetLink, CER_HOME),
    datasetId = new URL(sourceUrl).pathname.split('/').filter(Boolean).at(-1);
  const reports = links
    .map((l) => ({
      href: l,
      match: l.match(/\/canada-energy-future\/(\d{4})\/(?:index\.html)?(?:#.*)?$/),
    }))
    .filter((x) => x.match)
    .sort((a, b) => Number(b.match[1]) - Number(a.match[1]));
  assert(reports.length, 'CER report links missing');
  const edition = Number(reports[0].match[1]),
    reportUrl = trustedUrl(reports[0].href, CER_HOME);
  const [catalog, report] = await Promise.all([
    json(
      fetcher,
      'https://open.canada.ca/data/en/api/3/action/package_show?id=' +
        encodeURIComponent(datasetId),
    ),
    text(fetcher, reportUrl),
  ]);
  assert(
    catalog.success === true && Array.isArray(catalog.result?.resources),
    'CER open-data catalog unavailable',
  );
  assert(catalog.result.title.includes(String(edition)), 'CER report/catalog editions disagree');
  const resources = catalog.result.resources;
  const demand = resources.find(
    (r) =>
      r.format === 'CSV' &&
      r.language?.includes('en') &&
      /\/end-use-demand-\d{4}\.csv$/i.test(r.url),
  );
  const dict = resources.find(
    (r) => r.format === 'CSV' && r.language?.includes('en') && /data-dictionary\.csv$/i.test(r.url),
  );
  const resultsLink = hrefs(report).find((l) => /\/results\/(?:index\.html)?(?:#.*)?$/.test(l));
  assert(demand && dict && resultsLink, 'CER required data resources missing');
  const dataUrl = trustedUrl(demand.url, reportUrl),
    dictionaryUrl = trustedUrl(dict.url, reportUrl),
    methodologyUrl = trustedUrl(resultsLink, reportUrl);
  const [csv, dictionary, method] = await Promise.all([
    text(fetcher, dataUrl),
    text(fetcher, dictionaryUrl),
    text(fetcher, methodologyUrl),
  ]);
  const unitDefinition = [...csvObjects(dictionary)].find(
    (r) =>
      /end.use.demand/i.test(r.File) &&
      r.Column === 'Value' &&
      /petajoules/i.test(r['Description of Data Value or Column Name']),
  );
  assert(unitDefinition, 'CER demand unit could not be verified');
  const match = plain(method).match(/up to,?\s*and including,?\s*(\d{4})\s*for electricity/i);
  assert(match, 'CER historical cutoff could not be verified; retain previous verified edition');
  const historicalThrough = Number(match[1]),
    parsed = parseScenarioCsv(csv, { historicalThrough, edition });
  return {
    schemaVersion: 1,
    source: 'Canada Energy Regulator',
    dataset: `Canada’s Energy Future ${edition}`,
    edition,
    sourceUrl,
    dataUrl,
    dictionaryUrl,
    methodologyUrl,
    checkedAt: new Date().toISOString(),
    catalogModifiedAt: catalog.result.metadata_modified,
    resourcePublishedAt: demand.created,
    license: catalog.result.license_title,
    reportingPeriod: `EF${edition}`,
    cadence: 'Report edition',
    unit: 'TWh',
    originalUnit: 'PJ',
    historicalThrough,
    definition: `Electricity final consumption, Total End-Use sector. Values through ${historicalThrough} are historical within this report; later years are conditional model projections, not observations or promises. Values converted from PJ to TWh by dividing by 3.6. Historical values may differ from later statistical revisions.`,
    ...parsed,
  };
}
