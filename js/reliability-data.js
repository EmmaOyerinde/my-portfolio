'use strict';
(() => {
  const D = window.EOData,
    C = window.EOReliabilityCore,
    seed = window.EOReferenceData?.reliabilityReports;
  const reports = C.valid(seed) ? seed : { rows: [], coverage: [], reviewedAt: null };
  let source = null;
  const rowCache = new Map(),
    metricCache = new Map();
  function resetIfChanged() {
    const current = D.get('reliability');
    if (current !== source) {
      source = current;
      rowCache.clear();
      metricCache.clear();
    }
  }
  function rows(id) {
    resetIfChanged();
    if (rowCache.has(id)) return rowCache.get(id);
    const p = D.profile(id);
    if (!p) return [];
    const result = reports.rows.filter((r) => r.utilityId === id).map((r) => ({ ...r }));
    if (p.type !== 'context')
      for (const [metric, key, unit] of [
        ['SAIDI', 'saidi', 'hours / customer'],
        ['SAIFI', 'saifi', 'interruptions / customer'],
      ])
        if (
          Number.isFinite(p[key]) &&
          !result.some(
            (r) =>
              r.metric === metric && r.period === p.period && Math.abs(r.value - p[key]) < 0.00001,
          )
        )
          result.unshift({
            utilityId: id,
            metric,
            value: p[key],
            unit,
            period: p.period,
            method: p.method,
            scope: p.scope,
            sourceUrl: p.sourceUrl,
            publisher: p.type === 'oeb' ? 'Ontario Energy Board' : p.name,
            kind: 'published',
            reviewedAt: p.type === 'report' ? p.reviewedAt : D.get('reliability')?.checkedAt,
            readableUrl:
              p.type === 'oeb'
                ? 'https://www.oeb.ca/ontarios-energy-sector/performance-assessment/electricity-distributor-scorecards'
                : p.sourceUrl,
            canDeriveCAIDI: true,
            evidence:
              p.type === 'oeb'
                ? 'Annual scorecard, common adjusted method'
                : 'Published utility report',
          });
    const group = (r) => [r.period, r.method, r.scope, r.sourceUrl.split('#')[0]].join('|');
    for (const duration of [...result].filter(
      (r) => r.metric === 'SAIDI' && !r.contextOnly && r.canDeriveCAIDI !== false,
    )) {
      const frequency = result.find(
        (r) =>
          r.metric === 'SAIFI' &&
          group(r) === group(duration) &&
          !r.contextOnly &&
          r.canDeriveCAIDI !== false,
      );
      if (!frequency || result.some((r) => r.metric === 'CAIDI' && group(r) === group(duration)))
        continue;
      const hours = /^minutes/i.test(duration.unit) ? duration.value / 60 : duration.value,
        value = C.caidi(hours, frequency.value);
      if (value === null) continue;
      result.push({
        ...duration,
        metric: 'CAIDI',
        value,
        unit: 'hours / interruption',
        kind: 'calculated',
        evidence: `Calculated from published SAIDI ${hours.toLocaleString('en-CA', { maximumFractionDigits: 4 })} hours and SAIFI ${frequency.value.toLocaleString('en-CA', { maximumFractionDigits: 4 })}. Rounded source inputs can affect the ratio.`,
        formula: 'SAIDI ÷ SAIFI',
      });
    }
    result.sort(
      (a, b) =>
        Object.keys(C.definitions).indexOf(C.base(a.metric)) -
          Object.keys(C.definitions).indexOf(C.base(b.metric)) || a.period.localeCompare(b.period),
    );
    const saved = Object.freeze(result.map(Object.freeze));
    rowCache.set(id, saved);
    return saved;
  }
  function available(metric) {
    resetIfChanged();
    if (metricCache.has(metric)) return metricCache.get(metric);
    const seen = new Set(),
      result = [];
    for (const f of window.PORTFOLIO_DATA.utilitiesGeoJSON.features) {
      for (const r of rows(f.properties.id)) {
        if (C.base(r.metric) !== metric || r.contextOnly) continue;
        const key = [
          D.sourceName(f.properties.id) || f.properties.id,
          r.metric,
          r.value,
          r.unit,
          r.period,
          r.method,
          r.scope,
          r.sourceUrl,
        ].join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        result.push({
          ...r,
          name: f.properties.utility,
          region: D.profile(f.properties.id).region,
        });
      }
    }
    for (const r of reports.rows.filter(
      (r) => !D.profile(r.utilityId) && C.base(r.metric) === metric && !r.contextOnly,
    )) {
      result.push({ ...r });
    }
    result.sort(
      (a, b) =>
        Number(a.kind === 'calculated') - Number(b.kind === 'calculated') ||
        b.period.localeCompare(a.period) ||
        a.name.localeCompare(b.name),
    );
    const saved = Object.freeze(result.map(Object.freeze));
    metricCache.set(metric, saved);
    return saved;
  }
  window.EOReliability = {
    rows,
    available,
    gapNotes: reports.gapNotes || {},
    coverage: reports.coverage,
    reviewedAt: reports.reviewedAt,
    reviewDue: reports.reviewDue,
  };
})();
