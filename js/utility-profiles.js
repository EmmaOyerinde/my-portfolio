'use strict';
(() => {
  const D = window.EOData;
  const regions = {
    hq: 'QC',
    bc: 'BC',
    mh: 'MB',
    fa: 'AB',
    skp: 'SK',
    nsp: 'NS',
    nbp: 'NB',
    nfp: 'NL',
    me: 'PE',
    ntpc: 'NT',
    ye: 'YT',
    qec: 'NU',
    enmax: 'AB',
    epcor: 'AB',
    slp: 'SK',
    sje: 'NB',
    fortisbc: 'BC',
    lethbridge: 'AB',
    'medicine-hat': 'AB',
    'red-deer': 'AB',
    nelson: 'BC',
    penticton: 'BC',
    summerland: 'BC',
    'new-west': 'BC',
    sherbrooke: 'QC',
    magog: 'QC',
    alma: 'QC',
    'baie-comeau': 'QC',
    coaticook: 'QC',
    joliette: 'QC',
    summerside: 'PE',
    edmundston: 'NB',
    berwick: 'NS',
    'mahone-bay': 'NS',
    antigonish: 'NS',
    northland: 'NT',
    'atco-yukon': 'YT',
  };
  // Manually verified annual-report observations, reviewed 2026-11-10.
  // These retain their own methods and are never silently included in OEB rankings.
  const reports = {
    bc: {
      period: 'FY 2025/26',
      saidi: 4.61,
      saifi: null,
      method:
        'BC Hydro annual report; major events excluded using the IEEE major-event-day method. SAIFI is not in this table.',
      sourceUrl:
        'https://www.bcbudget.gov.bc.ca/Annual_Reports/2025_2026/pdf/agency/bchydro.pdf#page=16',
    },
    skp: {
      period: 'FY 2025/26',
      saidi: 6.6,
      saifi: 3.7,
      method:
        'SaskPower distribution measures: major event day excluded; loss of transmission supply included.',
      sourceUrl:
        'https://www.saskpower.com/-/media/saskpower/about-us/reports/report-annualreport-2025-26.pdf#page=22',
    },
    mh: {
      period: 'FY 2025/26',
      saidi: 466.6 / 60,
      saifi: 1.99,
      method:
        'Manitoba Hydro KPI table: 466.6 minutes converted to hours. The table does not state event exclusions.',
      sourceUrl: 'https://www.hydro.mb.ca/docs/corporate/annual_report_2025_26.pdf#page=24',
    },
    nsp: {
      period: '2025',
      saidi: 4.79,
      saifi: 1.57,
      method:
        'Nova Scotia Power Performance Standards measures, with severe-event exclusions. The all-events duration is a separate measure.',
      sourceUrl:
        'https://www.nspower.ca/docs/default-source/pdf-to-upload/performance-standards-report-appendices_2025.pdf#page=48',
    },
    me: {
      period: '2024',
      saidi: 2.25,
      saifi: null,
      method:
        'Maritime Electric normal-operations duration, excluding IEEE major events. 2024 observations published in the 2025 sustainability update.',
      sourceUrl:
        'https://www.maritimeelectric.com/media/xhmj0mis/2025-sustainability-report_final_dec-2025.pdf#page=17',
    },
  };
  const featuresById = new Map(
    window.PORTFOLIO_DATA.utilitiesGeoJSON.features.map((f) => [f.properties.id, f.properties]),
  );
  const feature = (id) => featuresById.get(id);
  const parseCount = (raw) => {
    const m = String(raw || '')
      .trim()
      .replaceAll(',', '')
      .match(/^(\d+(?:\.\d+)?)\s*([km])?$/i);
    return m
      ? Math.round(Number(m[1]) * ({ k: 1000, m: 1000000 }[m[2]?.toLowerCase()] || 1))
      : null;
  };
  D.customer = (id) => {
    const p = feature(id);
    if (!p) return null;
    const sourceName = D.sourceName(id),
      dataset = D.get('customers'),
      r = dataset?.rows.find((r) => r.name.toLowerCase() === sourceName?.toLowerCase());
    if (r)
      return {
        count: r.customers,
        connections: r.connections,
        classes: r.classes,
        period: String(r.year),
        type: 'oeb',
        approximate: false,
        sourceUrl: dataset.catalogUrl,
        technicalUrl: dataset.sourceUrl,
        sourceTitle: 'OEB customer accounts',
        definition: dataset.definition,
        scope: r.name + ' · entire company',
        checkedAt: dataset.checkedAt,
      };
    const report = window.EOEvidenceSeed?.customerReports?.[id];
    if (report && Number.isSafeInteger(report.count) && report.count > 0)
      return { ...report, type: 'report', scope: 'Utility customer base' };
    return {
      count: parseCount(window.EOEvidenceSeed?.customerReferences?.[id] || p.customers),
      period: 'Portfolio reference',
      type: 'reference',
      approximate: true,
      sourceTitle: 'Original portfolio dataset',
      sourceUrl: null,
      scope: 'Original utility footprint',
      definition:
        'Rounded customer count retained from the supplied portfolio. Its observation year and underlying publication were not recorded. Use it as a scale reference, not a current regulatory total.',
    };
  };
  D.customerLabel = (id) => {
    const c = D.customer(id);
    return c ? (c.approximate ? '≈' : '') + c.count.toLocaleString('en-CA') : 'Reference profile';
  };
  D.profile = (id) => {
    const p = feature(id);
    if (!p) return null;
    const region = regions[id] || 'ON',
      balance = D.get('balance')?.records.find((r) => r.region === region),
      r = D.utility(id),
      report = reports[id],
      customer = D.customer(id);
    if (r)
      return {
        type: 'oeb',
        id,
        region,
        balance,
        customer,
        period: String(r.year),
        scope: 'Utility · OEB scorecard',
        saidi: r.saidi,
        saifi: r.saifi,
        method: D.get('reliability').methodology.label,
        sourceUrl: D.get('reliability').sourceUrl,
        name: p.utility,
      };
    if (report)
      return {
        type: 'report',
        id,
        region,
        balance,
        customer,
        scope: 'Utility · published report',
        ...report,
        name: p.utility,
        reviewedAt: '2026-11-10',
        reviewDue: '2027-02-10',
      };
    return {
      type: 'context',
      id,
      region,
      balance,
      customer,
      period: balance?.period || 'Published regional profile',
      scope: 'Province / territory · electricity context',
      method:
        'Statistics Canada regional generation and electricity available for use. These describe the province or territory, not this utility’s outage performance.',
      sourceUrl:
        D.get('balance')?.sourceUrl ||
        'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2510001601',
      name: p.utility,
    };
  };
  D.reportProfiles = reports;
})();
