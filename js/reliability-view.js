'use strict';
(() => {
  const C = window.EOReliabilityCore,
    D = window.EOData,
    R = window.EOReliability;
  const { escapeHTML: esc, safeSourceURL: safe } = window.EOUI;
  const fmt = (r) =>
    r.value.toLocaleString('en-CA', { maximumFractionDigits: C.base(r.metric) === 'ASAI' ? 3 : 2 });
  const regionNames = {
    ON: 'Ontario',
    QC: 'Québec',
    BC: 'British Columbia',
    AB: 'Alberta',
    SK: 'Saskatchewan',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NS: 'Nova Scotia',
    NL: 'Newfoundland and Labrador',
    PE: 'Prince Edward Island',
    YT: 'Yukon',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
  };
  function learn(key) {
    const def = C.definitions[key];
    return `<article class="metric-guide"><span class="eyebrow">${esc(key === 'CEMIn' ? 'CEMIₙ' : key)}</span><h4>${esc(def.name)}</h4><p>${esc(def.meaning)}</p><p class="metric-formula">${esc(def.formula)}</p><p><strong>What the calculation needs</strong><br>${esc(def.needed)}</p></article>`;
  }
  function card(r) {
    const def = C.definitions[C.base(r.metric)],
      status =
        r.coverageLabel ||
        (r.contextOnly ? 'Corporate KPI' : r.kind === 'calculated' ? 'Calculated' : 'Published');
    return `<article class="reliability-card ${r.kind === 'calculated' ? 'is-calculated' : ''}"><div class="reliability-card-top"><strong>${esc(r.metric)}</strong><span>${esc(status)}</span></div><h4>${esc(r.metricName || def.name)}</h4><div class="reliability-value">${esc(fmt(r))}<small>${esc(r.unit)}</small></div><p class="reliability-period">${esc(r.period)} · ${esc(r.scope)}</p><p class="reliability-method">${esc(r.method)}</p>${r.definition ? `<p class="reliability-threshold">${esc(r.definition)}</p>` : r.threshold ? `<p class="reliability-threshold">Threshold: ${esc(r.thresholdOperator || '≥')} ${esc(r.threshold)} ${esc(r.thresholdUnit || 'interruptions')}</p>` : ''}<details><summary>Definition, method & source</summary><p>${esc(r.metricName ? r.definition : def.meaning)}</p>${r.formula ? `<p class="metric-formula">${esc(r.formula)}</p>` : ''}<p>${esc(r.evidence)}</p><p class="control-help">${esc(r.publisher)} · ${r.kind === 'calculated' ? 'Calculated from the attached publication' : r.reviewedAt ? 'Source reviewed ' + window.EOUI.formatDate(r.reviewedAt) : 'Published source'}${r.reviewDue && Date.now() > Date.parse(r.reviewDue) ? ' · Scheduled review due' : ''}</p><a href="${esc(safe(r.readableUrl || r.sourceUrl))}" target="_blank" rel="noopener noreferrer">Read the source${/\.pdf|\/File\/document/i.test(r.sourceUrl) ? ' (PDF)' : ''} ↗</a></details></article>`;
  }
  function availableLinks(keys) {
    return keys
      .flatMap((key) => R.available(key))
      .filter((r) => D.profile(r.utilityId))
      .filter((r, i, all) => all.findIndex((x) => x.utilityId === r.utilityId) === i)
      .slice(0, 4)
      .map(
        (r) =>
          `<button class="text-button" data-metric-utility="${esc(r.utilityId)}" data-metric-focus="${esc(C.base(r.metric))}">${esc(r.name)} · ${esc(r.metric)} ${esc(fmt(r))} ${esc(r.unit)} ↗</button>`,
      )
      .join('');
  }
  window.EOReliabilityView = Object.freeze({ fmt, regionNames, learn, card, availableLinks });
})();
