// Customer accounts and lighting/network connections are different reporting units.
export const CUSTOMER_CATALOG =
  'https://www.oeb.ca/open-data/electricity-reporting-record-keeping-requirements-rrr-section-212-market-monitoring';
const decode = (s) =>
  String(s)
    .replace(
      /&(amp|lt|gt|quot|apos);/g,
      (_, k) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[k],
    )
    .trim();
const field = (block, tag) =>
  decode(block.match(new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>'))?.[1] || '');
export function discoverCustomerRelease(html, now = new Date()) {
  const links = [...String(html).matchAll(/href\s*=\s*["']([^"']+)["']/gi)]
    .flatMap(([, raw]) => {
      try {
        const u = new URL(decode(raw), CUSTOMER_CATALOG),
          p = decodeURIComponent(u.pathname),
          m = p.match(
            /^\/documents\/opendata\/rrr\/(\d{4})(?:-\d+)?\/(?:ED )?2\.1\.2 Customers (?:&|and) Connections\.xml$/i,
          );
        return u.protocol === 'https:' &&
          u.hostname === 'www.oeb.ca' &&
          !u.username &&
          !u.password &&
          m &&
          +m[1] <= now.getUTCFullYear()
          ? [{ sourceUrl: u.href, year: +m[1] }]
          : [];
      } catch {
        return [];
      }
    })
    .sort((a, b) => b.year - a.year);
  if (!links.length) throw Error('OEB customer catalogue format changed');
  return links[0];
}
export function parseCustomerXml(xml, year) {
  if (
    !Number.isInteger(year) ||
    year < 2015 ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) ||
    !xml.includes('<dataroot')
  )
    throw Error('Unrecognized customer XML');
  const records = [...xml.matchAll(/<Customers_Connections>([\s\S]*?)<\/Customers_Connections>/g)];
  if (records.length < 20 || records.length > 30000) throw Error('Unexpected customer coverage');
  const seen = new Set(),
    companies = new Map();
  let latest = 0;
  for (const [, block] of records) {
    const y = Number(field(block, 'Year'));
    if (!Number.isInteger(y) || y < 2015 || y > year) throw Error('Customer year invalid');
    latest = Math.max(latest, y);
    if (y !== year) continue;
    const name = field(block, 'Current_Company_Name'),
      historical = field(block, 'Historical_Company_Name'),
      rateClass = field(block, 'Rate_Class'),
      kind = field(block, 'Customer_or_Connections'),
      raw = field(block, 'Total_Customers_or_Connections');
    if (
      !name ||
      name.length > 180 ||
      /[<>]/.test(name) ||
      !historical ||
      !rateClass ||
      !['Customers', 'Connections'].includes(kind) ||
      !/^\d+$/.test(raw) ||
      Number(raw) > 10000000
    )
      throw Error('Customer row invalid');
    const key = [name, historical, rateClass, kind].join('|');
    if (seen.has(key)) throw Error('Duplicate customer row');
    seen.add(key);
    if (!companies.has(name))
      companies.set(name, { name, year, customers: 0, connections: 0, classes: [] });
    const r = companies.get(name),
      value = Number(raw);
    r[kind === 'Customers' ? 'customers' : 'connections'] += value;
    r.classes.push({ name: rateClass, unit: kind, value, historicalCompany: historical });
  }
  const rows = [...companies.values()].sort((a, b) => a.name.localeCompare(b.name));
  if (
    latest !== year ||
    rows.length < 20 ||
    rows.some(
      (r) =>
        r.customers <= 0 ||
        !r.classes.some((c) => c.name === 'Residential' && c.unit === 'Customers'),
    )
  )
    throw Error('Customer coverage incomplete');
  return rows;
}
export async function fetchCustomers(fetcher = fetch) {
  const get = async (url, limit) => {
    const r = await fetcher(url, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw Error('OEB HTTP ' + r.status);
    const text = await r.text();
    if (text.length > limit) throw Error('Customer response too large');
    return { text, modified: r.headers.get('last-modified') };
  };
  const catalog = await get(CUSTOMER_CATALOG, 700000),
    release = discoverCustomerRelease(catalog.text),
    file = await get(release.sourceUrl, 12000000),
    rows = parseCustomerXml(file.text, release.year);
  return {
    dataset: 'customers',
    provider: 'Ontario Energy Board',
    reportingPeriod: String(release.year),
    reportingYear: release.year,
    checkedAt: new Date().toISOString(),
    sourceUpdatedAt: file.modified,
    sourceUrl: release.sourceUrl,
    catalogUrl: CUSTOMER_CATALOG,
    definition:
      'Customer rate classes are summed by current distributor. Lighting, embedded-distributor and other connection-only classes are reported separately and excluded from the customer total. Customer accounts are not a count of residents.',
    rows,
  };
}
