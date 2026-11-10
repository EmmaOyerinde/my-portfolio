'use strict';
(() => {
  const D = window.EOData,
    R = window.EOReliability,
    C = window.EOReliabilityCore,
    $ = (s) => document.querySelector(s),
    esc = window.EOUI.escapeHTML;
  const safe = window.EOUI.safeSourceURL;
  const { fmt, regionNames, learn, card, availableLinks } = window.EOReliabilityView;
  let selected = new URLSearchParams(location.search).get('utility') || 'toronto-hydro',
    filter = 'all',
    compareMetric = 'CAIDI';
  if (!D.profile(selected)) selected = 'toronto-hydro';
  const groups = {
    all: 'All figures',
    duration: 'Duration',
    frequency: 'Frequency',
    availability: 'Availability',
    experience: 'Customer impact',
    energy: 'Unserved energy',
  };
  function render() {
    const p = D.profile(selected),
      all = R.rows(selected),
      filtered = all.filter(
        (r) => filter === 'all' || C.definitions[C.base(r.metric)].group === filter,
      ),
      display = filtered,
      reg = R.coverage.find((c) => c.region === p.region);
    const metrics = new Set(all.map((r) => C.base(r.metric)));
    const otherValues =
      filter === 'all'
        ? []
        : Object.keys(C.definitions).filter((k) => C.definitions[k].group === filter);
    $('#reliability-detail').innerHTML =
      `<div class="reliability-heading"><div><p class="eyebrow">THE RELIABILITY DESK</p><h3>More than an average.</h3><p>Follow the outages, the customer experience and the evidence.</p></div><span class="reliability-count">${metrics.size} measures<br><small>${all.filter((r) => r.kind === 'published').length} published · ${all.filter((r) => r.kind === 'calculated').length} calculated</small></span></div><div class="reliability-filters" role="group" aria-label="Filter reliability measures">${Object.entries(
        groups,
      )
        .map(
          ([key, label]) =>
            `<button data-reliability-filter="${key}" aria-pressed="${key === filter}">${label}</button>`,
        )
        .join(
          '',
        )}</div><p class="control-help">Periods and event exclusions stay attached to each figure. All-event, adjusted and transmission measures describe different things.</p><div class="reliability-grid">${display.map(card).join('') || `<div class="reliability-reading"><strong>${filter === 'all' ? 'Start with the customer base and regional profile.' : 'How to read ' + groups[filter].toLowerCase()}</strong><p>${filter === 'all' ? 'This utility’s customer count is above. The guides below explain the additional outage records needed for each measure.' : 'The connected publications support the figures shown under All figures. Use the named utilities below to see available values for these measures.'}</p>${reg ? `<a href="${esc(safe(reg.dataUrl))}" target="_blank" rel="noopener noreferrer">Explore ${esc(regionNames[p.region])} reporting ↗</a>` : ''}<div class="metric-alternatives">${availableLinks(otherValues.length ? otherValues : Object.keys(C.definitions))}</div></div>`}</div>${
        filter !== 'all'
          ? `<div class="metric-guide-grid">${Object.keys(C.definitions)
              .filter((k) => C.definitions[k].group === filter)
              .map(learn)
              .join('')}</div>`
          : ''
      }<details class="metric-library"><summary>Understand CAIDI, CAIFI, MAIFI, ASAI, CEMIₙ, CELID, ENS and AENS</summary><div class="metric-guide-grid">${Object.keys(C.definitions).map(learn).join('')}</div><p class="control-help">Definitions follow common distribution-reliability conventions. The attached publisher’s threshold, scope and method take precedence. AENS here means average energy not supplied.</p></details>${reg ? `<div class="jurisdiction-card"><div><span class="eyebrow">${esc(regionNames[p.region])} / REPORTING ROUTE</span><h4>${esc(reg.name)}</h4><p>${esc(reg.note)}</p></div><a class="text-link" href="${esc(safe(reg.url))}" target="_blank" rel="noopener noreferrer">Explore the regulator ↗</a></div>` : ''}<details class="national-directory"><summary>Explore reporting across all 13 provinces and territories</summary><div class="jurisdiction-grid">${R.coverage.map((c) => `<article><h4>${esc(regionNames[c.region])}</h4><a href="${esc(safe(c.url))}" target="_blank" rel="noopener noreferrer">${esc(c.name)} ↗</a><p>${esc(c.note)}</p></article>`).join('')}</div><p class="control-help">Ontario scorecards and customer releases are checked by the daily GitHub job. Other observations are reviewed report excerpts, last reviewed ${esc(R.reviewedAt)}. This directory links every jurisdiction; it is not a claim that every regulatory filing has been imported.</p></details><div id="advanced-comparison"></div><button class="text-button reliability-export" id="reliability-export">Download this utility’s reliability evidence ↓</button>`;
    compare();
  }
  function compare() {
    const target = $('#advanced-comparison'),
      other = $('#compare-utility').value;
    if (!target || !other) {
      if (target) target.innerHTML = '';
      return;
    }
    const p = D.profile(selected),
      q = D.profile(other);
    const column = (id) => {
      const found = R.rows(id).filter((r) => C.base(r.metric) === compareMetric);
      return found.length
        ? found
            .map(
              (r) =>
                `<p><strong>${esc(r.metric)} · ${esc(fmt(r))} ${esc(r.unit)}</strong><span>${esc(r.period)} · ${r.kind === 'calculated' ? 'Calculated' : 'Published'}</span><span>${esc(r.scope)}</span><span>${esc(r.method)}</span></p>`,
            )
            .join('')
        : '<p>Use the metric guide above to see the required inputs, and the jurisdiction link to explore further reporting.</p>';
    };
    target.innerHTML = `<div class="advanced-compare-heading"><h4>Compare the evidence</h4><label>Measure <select id="compare-reliability-metric">${Object.keys(
      C.definitions,
    )
      .map(
        (k) =>
          `<option value="${k}" ${k === compareMetric ? 'selected' : ''}>${k === 'CEMIn' ? 'CEMIₙ' : k}</option>`,
      )
      .join(
        '',
      )}</select></label></div><p class="control-help">Read periods, thresholds and methods together. These columns do not imply a performance ranking.</p><div class="advanced-compare-columns"><article><h4>${esc(p.name)}</h4>${column(selected)}</article><article><h4>${esc(q.name)}</h4>${column(other)}</article></div>`;
  }
  function exportRows() {
    const records = R.rows(selected),
      p = D.profile(selected),
      columns = [
        'Utility',
        'Metric',
        'Value',
        'Unit',
        'Period',
        'Evidence',
        'Method',
        'Scope',
        'Threshold',
        'Publisher',
        'Source URL',
      ];
    const rows = [
      columns,
      ...records.map((r) => [
        p.name,
        r.metric,
        r.value,
        r.unit,
        r.period,
        r.contextOnly ? 'Context KPI' : r.kind,
        r.method,
        r.scope,
        r.definition || '',
        r.publisher,
        r.readableUrl || r.sourceUrl,
      ]),
    ];
    window.EOUI.downloadCSV(selected + '-reliability-evidence.csv', rows);
  }
  document.addEventListener('click', (e) => {
    const utility = e.target.closest('[data-metric-utility]');
    if (utility) {
      window.EOApp.selectUtility(utility.dataset.metricUtility, true, true);
      filter = C.definitions[utility.dataset.metricFocus]?.group || 'all';
      render();
      $('#reliability-detail').scrollIntoView({
        block: 'start',
        behavior:
          document.documentElement.dataset.reduceMotion === 'true' ||
          matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
      });
      $('#reliability-detail').setAttribute('tabindex', '-1');
      $('#reliability-detail').focus({ preventScroll: true });
    }
    const f = e.target.closest('[data-reliability-filter]');
    if (f) {
      filter = f.dataset.reliabilityFilter;
      render();
      $('[data-reliability-filter="' + filter + '"]').focus();
    }
    if (e.target.closest('#reliability-export')) exportRows();
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'compare-reliability-metric') {
      compareMetric = e.target.value;
      compare();
      $('#compare-reliability-metric').focus();
    }
    if (e.target.id === 'compare-utility') compare();
  });
  document.addEventListener('eo:utility', (e) => {
    const changed = selected !== e.detail.id;
    selected = e.detail.id;
    if (changed) {
      filter = 'all';
    }
    render();
  });
  window.EOReliabilityUI = { render };
  render();
})();
