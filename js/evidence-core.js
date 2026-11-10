'use strict';
// Shared, dependency-free validation used by the browser and the GitHub refresh job.
(() => {
  const kinds = [
    'reliability',
    'scenarios',
    'balance',
    'communities',
    'boundaries',
    'ieso',
    'customers',
  ];
  const files = {
    customers: 'customers.json',
    reliability: 'reliability.json',
    scenarios: 'scenarios.json',
    balance: 'balance.json',
    communities: 'communities.json',
    boundaries: 'oeb-boundaries.json',
    ieso: 'ieso.json',
  };
  const regions = new Set([
    'CA',
    'NL',
    'PE',
    'NS',
    'NB',
    'QC',
    'ON',
    'MB',
    'SK',
    'AB',
    'BC',
    'YT',
    'NT',
    'NU',
  ]);
  const text = (x) => typeof x === 'string' && x.length > 0 && x.length <= 2000;
  const date = (x) => typeof x === 'string' && Number.isFinite(Date.parse(x));
  const number = (x) => x === null || Number.isFinite(x);
  const unique = (rows, key) => new Set(rows.map(key)).size === rows.length;
  const checkedAt = (kind, d) =>
    kind === 'communities' || kind === 'boundaries' ? d?.metadata?.checkedAt : d?.checkedAt;
  const period = (kind, d) =>
    String(
      kind === 'reliability'
        ? d.reportingYear
        : kind === 'communities' || kind === 'boundaries'
          ? d.metadata.edition
          : kind === 'ieso'
            ? d.reportedAt
            : d.reportingPeriod,
    );
  const validators = {
    customers: (d) =>
      Number.isInteger(d.reportingYear) &&
      d.reportingPeriod === String(d.reportingYear) &&
      text(d.definition) &&
      d.rows.length >= 20 &&
      d.rows.length <= 200 &&
      unique(d.rows, (r) => r.name.toLowerCase()) &&
      d.rows.every(
        (r) =>
          text(r.name) &&
          r.year === d.reportingYear &&
          Number.isSafeInteger(r.customers) &&
          r.customers > 0 &&
          Number.isSafeInteger(r.connections) &&
          r.connections >= 0 &&
          Array.isArray(r.classes) &&
          r.classes.length > 0 &&
          r.classes.every(
            (c) =>
              text(c.name) &&
              ['Customers', 'Connections'].includes(c.unit) &&
              Number.isSafeInteger(c.value) &&
              c.value >= 0,
          ) &&
          r.customers ===
            r.classes.filter((c) => c.unit === 'Customers').reduce((sum, c) => sum + c.value, 0) &&
          r.connections ===
            r.classes.filter((c) => c.unit === 'Connections').reduce((sum, c) => sum + c.value, 0),
      ),
    ieso: (d) =>
      d.unit === 'MW' &&
      Number.isFinite(d.demandMW) &&
      d.demandMW > 0 &&
      d.demandMW <= 100000 &&
      Number.isInteger(d.interval) &&
      d.interval >= 1 &&
      d.interval <= 12 &&
      Number.isInteger(d.deliveryHour) &&
      d.deliveryHour >= 1 &&
      d.deliveryHour <= 24 &&
      text(d.definition) &&
      date(d.reportedAt),
    reliability: (d) =>
      Number.isInteger(d.reportingYear) &&
      d.reportingYear >= 2016 &&
      text(d.methodology?.label) &&
      d.rows.length >= 20 &&
      d.rows.length <= 200 &&
      unique(d.rows, (r) => r.name) &&
      d.rows.every(
        (r) =>
          text(r.name) &&
          r.year === d.reportingYear &&
          number(r.saidi) &&
          number(r.saifi) &&
          (r.saidi === null || r.saidi >= 0) &&
          (r.saifi === null || r.saifi >= 0),
      ),
    scenarios: (d) =>
      d.unit === 'TWh' &&
      Number.isInteger(d.edition) &&
      Number.isInteger(d.historicalThrough) &&
      text(d.definition) &&
      d.scenarios.includes('Current Measures') &&
      d.scenarios.length >= 2 &&
      d.scenarios.every(text) &&
      d.years.length >= 2 &&
      d.years.every(Number.isInteger) &&
      d.years.every((y, i) => !i || y === d.years[i - 1] + 1) &&
      d.years.includes(d.historicalThrough) &&
      d.years.at(-1) > d.historicalThrough &&
      d.records.length === 14 * d.scenarios.length * d.years.length &&
      unique(d.records, (r) => r.region + '|' + r.scenario + '|' + r.year) &&
      d.records.every(
        (r) =>
          regions.has(r.region) &&
          text(r.regionName) &&
          d.scenarios.includes(r.scenario) &&
          d.years.includes(r.year) &&
          Number.isFinite(r.demandTWh) &&
          r.demandTWh >= 0 &&
          r.historical === r.year <= d.historicalThrough,
      ),
    balance: (d) =>
      d.unit === 'TWh' &&
      text(d.definition) &&
      /^\d{4}-(0[1-9]|1[012])$/.test(d.reportingPeriod) &&
      d.records.length === 14 &&
      unique(d.records, (r) => r.region) &&
      Array.isArray(d.history) &&
      d.history.length >= 14 &&
      unique(d.history, (r) => r.region + '|' + r.period) &&
      [...d.records, ...d.history].every(
        (r) =>
          regions.has(r.region) &&
          text(r.regionName) &&
          /^\d{4}-(0[1-9]|1[012])$/.test(r.period) &&
          ['generationTWh', 'availableTWh', 'importsTWh', 'exportsTWh', 'netExportsTWh'].every(
            (k) => number(r[k]),
          ),
      ) &&
      d.records.every((r) => r.period === d.reportingPeriod),
    communities: (d) =>
      Number.isInteger(d.metadata.edition) &&
      text(d.metadata.limitations) &&
      d.communities.length >= 100 &&
      d.communities.length <= 10000 &&
      unique(d.communities, (c) => c.id) &&
      d.communities.every(
        (c) =>
          text(c.id) &&
          text(c.name) &&
          regions.has(c.province) &&
          Number.isFinite(c.lat) &&
          c.lat >= 40 &&
          c.lat <= 90 &&
          Number.isFinite(c.lon) &&
          c.lon >= -150 &&
          c.lon <= -40 &&
          number(c.population) &&
          number(c.annualSystemGenerationMWh) &&
          (c.roadAccess === null || typeof c.roadAccess === 'boolean'),
      ),
    boundaries: (d) =>
      d.type === 'FeatureCollection' &&
      text(d.metadata.edition) &&
      d.features.length >= 20 &&
      d.features.length <= 500 &&
      d.features.every(
        (f) =>
          text(f.properties?.name) &&
          ['Polygon', 'MultiPolygon'].includes(f.geometry?.type) &&
          (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).every(
            (p) =>
              p.length > 0 &&
              p.every(
                (r) =>
                  r.length >= 4 &&
                  r.every(
                    (c) =>
                      c.length >= 2 &&
                      c.every(Number.isFinite) &&
                      Math.abs(c[0]) <= 180 &&
                      Math.abs(c[1]) <= 90,
                  ) &&
                  r[0].every((v, i) => v === r.at(-1)[i]),
              ),
          ),
      ),
  };
  function valid(kind, d) {
    try {
      if (!kinds.includes(kind) || !d || !date(checkedAt(kind, d))) return false;
      const hosts = {
        customers: ['www.oeb.ca'],
        reliability: ['www.oeb.ca'],
        scenarios: ['open.canada.ca'],
        balance: ['www150.statcan.gc.ca'],
        communities: ['open.canada.ca'],
        boundaries: ['www.oeb.ca'],
        ieso: ['reports-public.ieso.ca'],
      };
      const source = new URL(
        kind === 'communities' || kind === 'boundaries' ? d.metadata.sourceUrl : d.sourceUrl,
      );
      if (
        source.protocol !== 'https:' ||
        source.username ||
        source.password ||
        !hosts[kind]?.includes(source.hostname)
      )
        return false;
      return validators[kind]?.(d) === true;
    } catch {
      return false;
    }
  }
  function freshness(entry, hasData, now = Date.now()) {
    if (!hasData)
      return {
        state: 'unavailable',
        label: 'Data unavailable',
        message: 'This dataset could not be loaded. Retry, or open the publisher’s source.',
      };
    if (!entry || !date(entry.lastAttemptAt))
      return {
        state: 'snapshot',
        label: 'Verified snapshot',
        message:
          'Included published data. An automatic check has not yet been recorded for this copy of the site.',
      };
    if (now - Date.parse(entry.lastAttemptAt) > 72 * 3600000)
      return {
        state: 'overdue',
        label: 'Check overdue',
        message:
          'No recorded source check in over 72 hours. The last verified release remains available.',
      };
    if (entry.status === 'blocked')
      return {
        state: 'saved',
        label: 'Saved · publisher blocked check',
        message:
          'The publisher declined the automated request. The previous verified release is retained; the next scheduled run will try again.',
      };
    if (entry.status !== 'ok')
      return {
        state: 'saved',
        label: 'Saved · update unavailable',
        message:
          entry.status === 'invalid'
            ? 'A source change did not pass validation. The previous verified release is retained for review.'
            : 'The source could not be refreshed. The previous verified release is retained; a later run will try again.',
      };
    return {
      state: 'verified',
      label: 'Published data · checked',
      message:
        'The latest successful publisher check is recorded below. Publication dates and observation periods still vary by source.',
    };
  }
  globalThis.EOEvidence = Object.freeze({ kinds, files, valid, checkedAt, period, freshness });
})();
