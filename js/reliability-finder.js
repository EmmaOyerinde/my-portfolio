'use strict';
(() => {
  const D = window.EOData,
    R = window.EOReliability,
    C = window.EOReliabilityCore,
    $ = (s) => document.querySelector(s);
  const { escapeHTML: esc, safeSourceURL: safe } = window.EOUI;
  const { fmt, regionNames, card, availableLinks } = window.EOReliabilityView;
  const requestedMetrics = ['CAIDI', 'CAIFI', 'MAIFI', 'ASAI', 'CEMIn', 'CELID', 'ENS', 'AENS'];
  let nationalMetric = requestedMetrics.includes(
      new URLSearchParams(location.search).get('reliabilityMetric'),
    )
      ? new URLSearchParams(location.search).get('reliabilityMetric')
      : 'CAIDI',
    nationalAll = false;
  function national() {
    const observations = R.available(nationalMetric),
      published = observations.filter((r) => r.kind === 'published'),
      calculated = observations.filter((r) => r.kind === 'calculated'),
      display = nationalAll ? observations : observations.slice(0, 4),
      def = C.definitions[nationalMetric];
    $('#national-metric-finder').innerHTML =
      `<div class="metric-finder-heading"><div><p class="eyebrow">CANADA / REPORTED RELIABILITY VALUES</p><h3 id="national-metric-title">Choose a metric. Find the numbers.</h3><p>Values from named utilities, with reporting periods and methods. This view is independent of the utility selected on the map.</p></div><span class="metric-finder-status">${requestedMetrics.filter((k) => R.available(k).length).length} of 8 indices have numeric observations</span></div><div class="metric-index-buttons" role="group" aria-label="Find reliability values by index">${requestedMetrics
        .map((key) => {
          const found = R.available(key),
            utilities = new Set(found.map((r) => D.sourceName(r.utilityId) || r.utilityId)).size;
          return `<button data-national-metric="${key}" aria-pressed="${key === nationalMetric}"><strong>${key === 'CEMIn' ? 'CEMIₙ' : key}</strong><span>${found.length ? utilities + ' ' + (utilities === 1 ? 'utility' : 'utilities') : 'Inputs required'}</span></button>`;
        })
        .join(
          '',
        )}</div><div class="national-results-heading"><div><h4>${nationalMetric === 'CEMIn' ? 'CEMIₙ' : nationalMetric} · ${esc(def.name)}</h4><p role="status">${published.length} published observations · ${calculated.length} calculated observations</p></div>${observations.length ? '<button class="text-button" id="national-metric-export">Download these values ↓</button>' : ''}</div><div class="national-metric-results">${display.map((r) => `<div class="national-result"><div class="national-result-utility"><strong>${esc(r.name)}</strong><span>${esc(regionNames[r.region])}</span></div>${card(r)}${D.profile(r.utilityId) ? `<button class="button outline" data-metric-utility="${esc(r.utilityId)}" data-metric-focus="${esc(nationalMetric)}">Open this utility’s values ↗</button>` : `<a class="button outline" href="${esc(safe(r.sourceUrl))}" target="_blank" rel="noopener noreferrer">Read the historical source (PDF) ↗</a>`}</div>`).join('') || `<div class="metric-input-note"><h4>${esc(def.name)} needs additional source records.</h4><p>${esc(def.needed)}</p><p>The reviewed Canadian publications do not yet support a numeric ${esc(nationalMetric)} observation in this site. A definition is not a measured value.</p><p class="metric-formula">${esc(def.formula)}</p>${R.gapNotes[nationalMetric] ? `<details class="metric-gap-review"><summary>What the source review established</summary><p>${esc(R.gapNotes[nationalMetric].summary)}</p>${R.gapNotes[nationalMetric].sources.map((s) => `<a href="${esc(safe(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}<p>Reviewed ${esc(R.gapNotes[nationalMetric].checkedAt)}</p></details>` : ''}<p>Available alternatives keep their own names and meaning:</p><div class="metric-alternatives">${availableLinks(nationalMetric === 'CAIFI' ? ['CEMIn', 'CAIDI'] : ['ENS', 'ASAI'])}</div></div>`}</div>${observations.length > 4 ? `<button class="button outline" data-national-more>${nationalAll ? 'Show a shorter list' : 'Show all ' + observations.length + ' observations'} ${nationalAll ? '↑' : '↓'}</button>` : ''}<p class="metric-finder-note">These are individual utility observations, not a national average or ranking. Company totals shared by multiple map footprints are counted once. Values from different periods, outage exclusions or network levels are not directly comparable.</p>`;
  }
  function nationalExport() {
    const columns = [
        'Utility',
        'Province or territory',
        'Metric',
        'Value',
        'Unit',
        'Period',
        'Published or calculated',
        'Method',
        'Scope',
        'Source URL',
      ],
      records = R.available(nationalMetric);
    const rows = [
      columns,
      ...records.map((r) => [
        r.name,
        r.region,
        r.metric,
        r.value,
        r.unit,
        r.period,
        r.kind,
        r.method,
        r.scope,
        r.readableUrl || r.sourceUrl,
      ]),
    ];
    window.EOUI.downloadCSV('canada-' + nationalMetric.toLowerCase() + '-evidence.csv', rows);
  }
  document.addEventListener('click', (e) => {
    const metric = e.target.closest('[data-national-metric]');
    if (metric) {
      nationalMetric = metric.dataset.nationalMetric;
      nationalAll = false;
      national();
      const url = new URL(location.href);
      url.searchParams.set('reliabilityMetric', nationalMetric);
      history.replaceState(null, '', url);
      $('[data-national-metric="' + nationalMetric + '"]').focus();
    }
    if (e.target.closest('[data-national-more]')) {
      nationalAll = !nationalAll;
      national();
      $('[data-national-more]')?.focus();
    }
    if (e.target.closest('#national-metric-export')) nationalExport();
  });
  document.addEventListener('eo:data', (e) => {
    if (e.detail === 'reliability') national();
  });
  national();
})();
