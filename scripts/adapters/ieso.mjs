export const IESO_SOURCE =
  'https://reports-public.ieso.ca/public/RealtimeTotals/PUB_RealtimeTotals.xml';
export function parseIeso(xml, checkedAt = new Date().toISOString()) {
  if (
    typeof xml !== 'string' ||
    xml.length > 1000000 ||
    /<!DOCTYPE|<!ENTITY/.test(xml) ||
    !xml.includes('docID="RealtimeTotals"')
  )
    throw Error('Unexpected IESO report');
  const field = (s, k) => s.match(new RegExp('<' + k + '>([^<]+)</' + k + '>'))?.[1];
  const date = field(xml, 'DeliveryDate'),
    hour = Number(field(xml, 'DeliveryHour')),
    reportedAt = field(xml, 'CreatedAt');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isInteger(hour) ||
    hour < 1 ||
    hour > 24 ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(reportedAt)
  )
    throw Error('Invalid IESO reporting time');
  const intervals = [...xml.matchAll(/<IntervalEnergy>([\s\S]*?)<\/IntervalEnergy>/g)]
    .map(([, block]) => {
      const interval = Number(field(block, 'Interval')),
        quantities = {};
      for (const [, q] of block.matchAll(/<MQ>([\s\S]*?)<\/MQ>/g))
        quantities[field(q, 'MarketQuantity')] = Number(field(q, 'EnergyMW'));
      const demandMW = quantities['ONTARIO DEMAND'];
      if (
        !Number.isInteger(interval) ||
        interval < 1 ||
        interval > 12 ||
        !Number.isFinite(demandMW) ||
        demandMW <= 0 ||
        demandMW > 100000
      )
        throw Error('Invalid IESO demand interval');
      return { interval, demandMW };
    })
    .sort((a, b) => a.interval - b.interval);
  if (!intervals.length || new Set(intervals.map((r) => r.interval)).size !== intervals.length)
    throw Error('IESO interval coverage invalid');
  return {
    source: 'Independent Electricity System Operator',
    sourceUrl: IESO_SOURCE,
    catalogUrl: 'https://www.ieso.ca/en/Power-Data/Data-Directory',
    checkedAt,
    reportedAt,
    deliveryDate: date,
    deliveryHour: hour,
    ...intervals.at(-1),
    unit: 'MW',
    definition:
      'Ontario demand from the IESO Realtime Totals report, latest available five-minute interval in the delivered hour. This is a saved system-demand sample, not distributor reliability or a live outage measure. Report clock is shown as supplied by IESO.',
  };
}
export async function fetchIeso(fetcher = fetch) {
  const r = await fetcher(IESO_SOURCE, { signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw Error('Upstream HTTP ' + r.status);
  return parseIeso(await r.text());
}
