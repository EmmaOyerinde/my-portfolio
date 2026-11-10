'use strict';
(() => {
  const db = window.PORTFOLIO_DATA,
    D = window.EOData,
    $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const esc = window.EOUI.escapeHTML;
  const fmt = (n) =>
    n === null || n === undefined || !Number.isFinite(Number(n))
      ? '–'
      : Number(n).toLocaleString('en-CA', { maximumFractionDigits: 2 });
  let timer;
  function toast(s) {
    $('#toast').textContent = s;
    $('#toast').classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
  }
  function syncTheme() {
    const light = document.documentElement.dataset.theme === 'light';
    $('#theme').setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    document.querySelector('meta[name="theme-color"]').content = light ? '#f4f7f6' : '#071821';
  }
  syncTheme();
  $('#theme').onclick = () => {
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    syncTheme();
  };
  $('#menu').onclick = () => {
    const open = $('#nav').classList.toggle('open');
    $('#menu').setAttribute('aria-expanded', String(open));
    $('#menu').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    $('#menu').textContent = open ? '×' : '☰';
  };
  $$('#nav a').forEach(
    (a) =>
      (a.onclick = () => {
        if ($('#nav').classList.contains('open')) $('#menu').click();
      }),
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('#nav').classList.contains('open')) {
      $('#menu').click();
      $('#menu').focus();
    }
  });
  $('#copyright-year').textContent = new Date().getFullYear();
  $('#copy-email').onclick = async () => {
    try {
      await navigator.clipboard.writeText('emmanueloyerinde@yahoo.com');
      toast('Email address copied');
    } catch {
      toast('Email: emmanueloyerinde@yahoo.com');
    }
  };
  $('#reading-open').onclick = () => {
    $('#reading-size').value =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-size')) ||
      19;
    $('#reading-size-value').textContent = $('#reading-size').value + ' px';
    $('#reading-motion').checked = document.documentElement.dataset.reduceMotion === 'true';
    $('#reading-dialog').showModal();
  };
  function reading() {
    const size = Math.max(18, Math.min(22, Number($('#reading-size').value) || 19));
    document.documentElement.style.setProperty('--reading-size', size + 'px');
    document.documentElement.dataset.reduceMotion = String($('#reading-motion').checked);
    $('#reading-size-value').textContent = size + ' px';
    try {
      localStorage.setItem('eo-text-size', String(size));
      localStorage.setItem('eo-reduce-motion', String($('#reading-motion').checked));
    } catch {}
  }
  $('#reading-size').oninput = reading;
  $('#reading-motion').onchange = reading;
  $('#reading-reset').onclick = () => {
    $('#reading-size').value = 19;
    $('#reading-motion').checked = false;
    reading();
  };
  const utilities = db.utilitiesGeoJSON.features,
    query = new URLSearchParams(location.search);
  let activeTab = 'reliability',
    selected = query.get('utility') || 'toronto-hydro',
    communityLimit = 20;
  if (!utilities.some((f) => f.properties.id === selected)) selected = 'toronto-hydro';
  function openTab(name, update = true) {
    if (!['reliability', 'forecast', 'deficit', 'offgrid'].includes(name)) name = 'reliability';
    activeTab = name;
    $('.lab-shell').dataset.view = name;
    $$('[data-tab]').forEach((b) => {
      const current = b.dataset.tab === name;
      b.setAttribute('aria-selected', String(current));
      b.tabIndex = current ? 0 : -1;
      $('#panel-' + b.dataset.tab).hidden = !current;
    });
    if (name === 'forecast') renderForecast();
    document.dispatchEvent(new CustomEvent('eo:tab', { detail: name }));
    if (update) saveView();
  }
  $$('[data-tab]').forEach((b, i, buttons) => {
    b.onclick = () => openTab(b.dataset.tab);
    b.onkeydown = (e) => {
      const keys = { ArrowRight: (i + 1) % 4, ArrowLeft: (i + 3) % 4, Home: 0, End: 3 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      buttons[keys[e.key]].focus();
      openTab(buttons[keys[e.key]].dataset.tab);
    };
  });
  function viewURL() {
    const u = new URL(location.href);
    u.search = '';
    for (const [k, v] of Object.entries({
      view: activeTab,
      utility: selected,
      reliabilityMetric:
        document.querySelector('[data-national-metric][aria-pressed=true]')?.dataset
          .nationalMetric ||
        query.get('reliabilityMetric') ||
        'CAIDI',
      year: $('#year').value,
      scenario: $('#preset').value,
      region: $('#scenario-region').value,
      adjustment: $('#sensitivity').value,
      month: $('#balance-period').value,
      base: window.EOMaps?.getState().base || 'dark',
      compare: $('#compare-utility').value,
    }))
      if (v) u.searchParams.set(k, v);
    u.hash = 'lab';
    return u;
  }
  function saveView() {
    const u = viewURL();
    u.hash = location.hash;
    history.replaceState(null, '', u);
  }
  $('#share').onclick = async () => {
    const url = viewURL().href;
    try {
      await navigator.clipboard.writeText(url);
      toast('View copied, including your scenario and reporting month');
    } catch {
      $('#share-url').value = url;
      $('#share-dialog').showModal();
      $('#share-url').select();
    }
  };
  function filteredUtilities() {
    const q = $('#utility-search').value.toLowerCase().trim(),
      sort = $('#utility-sort').value;
    return utilities
      .filter(
        (f) =>
          `${f.properties.utility} ${f.properties.region}`.toLowerCase().includes(q) &&
          ($('#utility-province').value === 'all' ||
            D.profile(f.properties.id).region === $('#utility-province').value) &&
          (!$('#verified-only').checked ||
            D.profile(f.properties.id)?.type !== 'context' ||
            window.EOReliability?.rows(f.properties.id).length),
      )
      .sort((a, b) =>
        sort === 'utility'
          ? a.properties.utility.localeCompare(b.properties.utility)
          : sort === 'customers'
            ? (D.customer(b.properties.id)?.count || 0) - (D.customer(a.properties.id)?.count || 0)
            : (D.utility(a.properties.id)?.[sort] ?? Infinity) -
              (D.utility(b.properties.id)?.[sort] ?? Infinity),
      );
  }
  function renderList() {
    const list = filteredUtilities();
    $('#utility-count').textContent = `${list.length} / ${utilities.length}`;
    $('#utility-list').innerHTML = list.length
      ? list
          .map((f) => {
            const p = f.properties,
              r = D.utility(p.id);
            return `<button class="utility-item" data-select="${esc(p.id)}" aria-pressed="${p.id === selected}"><span>${esc(p.utility)}</span><span class="utility-customers">${esc(D.customerLabel(p.id))} customers</span><small>${r ? `${r.year} · SAIDI ${fmt(r.saidi)} h · OEB` : `${D.profile(p.id)?.type === 'report' ? 'Utility annual report' : 'Regional electricity context'} · ${D.profile(p.id)?.period || 'Explore profile'}`}</small></button>`;
          })
          .join('')
      : '<p class="empty-state">No utilities match. Try a wider search or turn off the coverage filter.</p>';
    $$('[data-select]').forEach(
      (b) =>
        (b.onclick = () => {
          window.EOMaps?.init('reliability');
          selectUtility(b.dataset.select, true, true);
          if (matchMedia('(max-width: 760px)').matches)
            $('[data-map-stage="reliability"]').scrollIntoView({
              block: 'start',
              behavior:
                document.documentElement.dataset.reduceMotion === 'true' ||
                matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'auto'
                  : 'smooth',
            });
        }),
    );
  }
  function metricCard(label, value, unit, note = '') {
    return `<div><small>${esc(label)}</small><strong>${esc(value)} <span>${esc(unit)}</span></strong><span class="metric-definition">${esc(note)}</span></div>`;
  }
  function profileMetrics(profile) {
    if (!profile) return '';
    const cards = [
      metricCard(
        'Customers served',
        D.customerLabel(profile.id),
        'customer accounts',
        profile.customer.period +
          ' · ' +
          (profile.customer.type === 'reference'
            ? 'Reference estimate'
            : profile.customer.type === 'oeb'
              ? 'OEB published total'
              : 'Utility publication'),
      ),
    ];
    if (profile.type !== 'context') {
      if (profile.saidi !== null)
        cards.push(
          metricCard(
            'Average outage duration',
            fmt(profile.saidi),
            'hours / customer / year',
            'SAIDI · ' + profile.period,
          ),
        );
      if (profile.saifi !== null)
        cards.push(
          metricCard(
            'Average outage frequency',
            fmt(profile.saifi),
            'interruptions / customer / year',
            'SAIFI · ' + profile.period,
          ),
        );
      if (cards.length < 2)
        cards.push(
          metricCard(
            'Published observation',
            profile.period,
            'utility report',
            'Original methodology linked below',
          ),
        );
      cards.push(
        metricCard(
          'Evidence type',
          profile.type === 'oeb' ? 'Scorecard' : 'Annual report',
          profile.type === 'oeb' ? 'Ontario Energy Board' : 'Publisher methodology',
          profile.type === 'report' ? 'Reviewed 10 Nov 2026' : 'Same-year adjusted measures',
        ),
      );
    } else {
      const b = profile.balance;
      if (b) {
        if (b.generationTWh !== null)
          cards.push(
            metricCard(
              b.regionName + ' generation',
              fmt(b.generationTWh),
              'TWh · province / territory',
              b.period + ' · Statistics Canada',
            ),
          );
        if (b.availableTWh !== null)
          cards.push(
            metricCard(
              'Electricity available for use',
              fmt(b.availableTWh),
              'TWh · province / territory',
              'Regional energy context',
            ),
          );
        cards.push(metricCard('Reporting period', b.period, 'monthly publication', b.regionName));
      } else {
        cards.push(
          metricCard(
            'Explore the region',
            profile.region,
            'published source below',
            'Regional electricity profile',
          ),
        );
      }
    }
    return cards.join('');
  }
  function profileContext(profile) {
    const b = profile.balance,
      ieso = profile.region === 'ON' ? D.get('ieso') : null;
    const regionLine =
      profile.type !== 'context' && b
        ? `<p class="regional-context"><strong>${esc(b.regionName)} context · ${esc(b.period)}</strong><span>${fmt(b.generationTWh)} TWh generated · ${fmt(b.availableTWh)} TWh available for use. Province/territory totals.</span></p>`
        : '';
    const reportNote =
      profile.type === 'report'
        ? `<span class="context-badge">Reviewed report excerpt${Date.now() > Date.parse(profile.reviewDue) ? ' · review due' : ''}</span>`
        : '';
    return `<div class="customer-evidence"><p><strong>Customer base · ${esc(profile.customer.period)}</strong><span>${esc(profile.customer.scope)}. Accounts represent service relationships, not individual residents.</span></p><button class="text-button" data-customer-source="${esc(profile.id)}">Count & source ↗</button></div><div class="profile-evidence"><div><span class="context-badge">${esc(profile.scope)}</span>${reportNote}</div><p>${esc(profile.method)}</p><button class="text-button source-explain" data-evidence-utility="${esc(selected)}">Understand this source ↗</button></div>${regionLine}${ieso ? `<div class="ieso-context"><div><span class="eyebrow">IESO / ONTARIO GRID SNAPSHOT</span><strong>${fmt(ieso.demandMW)} <small>MW demand</small></strong></div><p>${esc(ieso.deliveryDate)} · hour ending ${ieso.deliveryHour}, interval ${ieso.interval}<span>Saved five-minute sample · not a live outage reading</span></p><a href="https://www.ieso.ca/en/Power-Data/Data-Directory" target="_blank" rel="noopener noreferrer">Explore IESO data ↗</a></div>` : ''}<details class="geometry-note"><summary>About this map’s boundaries</summary><p>The detailed geographic footprints preserve the original portfolio’s local polygons. For official Ontario service-area geometry, turn on the OEB boundary layer. Use the publisher’s address lookup to confirm service at a specific location.</p><a href="https://www.oeb.ca/ontarios-energy-sector/ontario-electricity-and-natural-gas-utilities-service-area-map" target="_blank" rel="noopener noreferrer">Official Ontario service-area lookup ↗</a></details>`;
  }
  function selectUtility(id, update = true, focus = false) {
    const p = utilities.find((f) => f.properties.id === id)?.properties;
    if (!p) return;
    selected = id;
    const profile = D.profile(id);
    $('#selected-utility').textContent = p.utility;
    $$('[data-select]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.select === id)),
    );
    $('#utility-provenance').textContent =
      profile.type === 'oeb'
        ? `${profile.period} OEB scorecard · loss of supply and major events excluded`
        : profile.type === 'report'
          ? `${profile.period} utility publication · publisher-specific methodology`
          : `${profile.balance?.regionName || p.region} · published regional context for this utility profile`;
    $('#utility-metrics').innerHTML = profileMetrics(profile);
    $('#utility-context').innerHTML = profileContext(profile);
    renderComparison();
    document.dispatchEvent(new CustomEvent('eo:utility', { detail: { id, focus } }));
    if (update) saveView();
  }
  $('#utility-province').onchange = renderList;
  $('#utility-search').oninput = renderList;
  $('#utility-sort').onchange = renderList;
  $('#verified-only').onchange = renderList;
  $('#reset-map').onclick = () => {
    $('#utility-search').value = '';
    $('#utility-province').value = 'all';
    $('#utility-sort').value = 'utility';
    $('#verified-only').checked = false;
    $('#compare-utility').value = '';
    renderList();
    renderComparison();
    window.EOMaps?.reset();
    toast('National view restored');
  };
  for (const f of [...utilities].sort((a, b) =>
    a.properties.utility.localeCompare(b.properties.utility),
  )) {
    const o = document.createElement('option');
    o.value = f.properties.id;
    o.textContent = f.properties.utility;
    $('#compare-utility').append(o);
  }
  if (utilities.some((f) => f.properties.id === query.get('compare')))
    $('#compare-utility').value = query.get('compare');
  function renderComparison() {
    const other = $('#compare-utility').value;
    if (!other) {
      $('#comparison').innerHTML = '';
      return;
    }
    const a = D.profile(selected),
      b = D.profile(other);
    if (a.type !== 'oeb' || b.type !== 'oeb') {
      $('#comparison').innerHTML =
        `<p class="comparison-explainer">These profiles use different scopes or reporting methods. Explore them side by side; no reliability ranking is implied.</p><div class="profile-comparison">${[a, b].map((p) => `<article><h4>${esc(p.name)}</h4><span class="context-badge">${esc(p.scope)}</span><div class="comparison-metrics">${profileMetrics(p)}</div><p>${esc(p.method)}</p><button class="text-button" data-evidence-utility="${esc(p.id)}">Understand source ↗</button></article>`).join('')}</div>`;
      return;
    }
    $('#comparison').innerHTML =
      `<div class="table-scroll"><table><caption>OEB annual measures · ${esc(a.period)} · same adjustment method</caption><thead><tr><th scope="col">Measure</th><th scope="col">${esc(a.name)}</th><th scope="col">${esc(b.name)}</th></tr></thead><tbody><tr><th scope="row">Customers served</th><td>${esc(D.customerLabel(a.id))}<small>${esc(a.customer.period)}</small></td><td>${esc(D.customerLabel(b.id))}<small>${esc(b.customer.period)}</small></td></tr><tr><th scope="row">SAIDI · hours</th><td>${a.saidi === null ? 'See source definition' : fmt(a.saidi)}</td><td>${b.saidi === null ? 'See source definition' : fmt(b.saidi)}</td></tr><tr><th scope="row">SAIFI · interruptions</th><td>${a.saifi === null ? 'See source definition' : fmt(a.saifi)}</td><td>${b.saifi === null ? 'See source definition' : fmt(b.saifi)}</td></tr></tbody></table></div><p class="control-help">${D.utility(selected)?.name === D.utility(other)?.name ? 'These territories share the same company-level result.' : 'Same reporting year and adjustment method. Annual customer interruptions, not live outage readings.'}</p>`;
  }
  $('#compare-utility').onchange = () => {
    renderComparison();
    saveView();
  };
  $('#export-data').onclick = () => {
    const rows = [
      [
        'Utility',
        'Customer accounts',
        'Customer count period',
        'Count evidence',
        'Count source',
        'Geographic context',
        'Evidence scope',
        'Reporting period',
        'SAIDI hours per customer',
        'SAIFI interruptions per customer',
        'Method',
        'Regional generation TWh',
        'Regional available TWh',
        'Regional reporting period',
        'Source URL',
      ],
      ...filteredUtilities().map((f) => {
        const p = D.profile(f.properties.id);
        return [
          p.name,
          p.customer.count,
          p.customer.period,
          p.customer.type,
          p.customer.sourceUrl || 'Original portfolio dataset',
          f.properties.region,
          p.scope,
          p.period,
          p.type === 'context' ? 'Regional context; not an outage measure' : p.saidi,
          p.type === 'context' ? 'Regional context; not an outage measure' : p.saifi,
          p.method,
          p.balance?.generationTWh,
          p.balance?.availableTWh,
          p.balance?.period,
          p.sourceUrl,
        ];
      }),
    ];
    window.EOUI.downloadCSV(
      'utility-evidence-and-context.csv',
      rows.map((row) => row.map((value) => value ?? 'Not published')),
    );
    toast('Profiles exported with methods, scope, dates, and sources');
  };
  let scenarioInitialized = false,
    balanceInitialized = false,
    communityInitialized = false;
  const descriptions = {
    'Current Measures':
      'A pathway based on measures in place as assessed by the CER. It is a scenario, not a prediction.',
    'Canada Net-zero':
      'A pathway examining Canada’s transition to net-zero emissions under the report’s assumptions.',
    'Higher Scenario':
      'The report’s higher energy-demand pathway. This is not a statistical upper confidence bound.',
    'Lower Scenario':
      'The report’s lower energy-demand pathway. This is not a statistical lower confidence bound.',
  };
  function loadScenarioControls() {
    const d = D.get('scenarios');
    if (!d) return;
    const previous = $('#preset').value,
      region = $('#scenario-region').value;
    $('#preset').replaceChildren(...d.scenarios.map((s) => new Option(s, s)));
    $('#preset').value = d.scenarios.includes(
      scenarioInitialized ? previous : query.get('scenario'),
    )
      ? scenarioInitialized
        ? previous
        : query.get('scenario')
      : 'Current Measures';
    const regions = [...new Map(d.records.map((r) => [r.region, r.regionName]))];
    $('#scenario-region').replaceChildren(...regions.map(([id, name]) => new Option(name, id)));
    $('#scenario-region').value = regions.some(
      ([id]) => id === (scenarioInitialized ? region : query.get('region')),
    )
      ? scenarioInitialized
        ? region
        : query.get('region')
      : 'CA';
    $('#year').min = d.historicalThrough + 1;
    $('#year').max = d.years.at(-1);
    if (!scenarioInitialized) {
      const y = Number(query.get('year')) || 2050;
      $('#year').value = Math.max(d.historicalThrough + 1, Math.min(d.years.at(-1), y));
      $('#sensitivity').value = Math.max(-1, Math.min(1, Number(query.get('adjustment')) || 0));
    }
    $('#year-min').textContent = d.historicalThrough + 1;
    $('#year-max').textContent = d.years.at(-1);
    $('#scenario-definition').textContent = d.definition;
    scenarioInitialized = true;
    renderForecast();
  }
  function scenarioValue(
    region,
    year,
    scenario = $('#preset').value,
    adjust = Number($('#sensitivity').value),
  ) {
    const d = D.get('scenarios'),
      r = d?.records.find((r) => r.region === region && r.year === year && r.scenario === scenario);
    return r
      ? r.demandTWh * Math.pow(1 + adjust / 100, Math.max(0, year - d.historicalThrough))
      : null;
  }
  function scenarioRows() {
    const d = D.get('scenarios');
    if (!d) return [];
    const year = Number($('#year').value);
    return d.records
      .filter((r) => r.year === year && r.scenario === $('#preset').value && r.region !== 'CA')
      .map((r) => ({
        ...r,
        value: scenarioValue(r.region, year),
        base: scenarioValue(r.region, d.historicalThrough, 'Current Measures', 0),
      }));
  }
  function renderForecast() {
    const d = D.get('scenarios');
    if (!d) return;
    const year = Number($('#year').value),
      region = $('#scenario-region').value || 'CA',
      adjust = Number($('#sensitivity').value),
      total = scenarioValue(region, year),
      base = scenarioValue(region, d.historicalThrough, 'Current Measures', 0),
      reference = scenarioValue(region, year, 'Current Measures', 0);
    $('#year-label').textContent = year;
    $('#scenario-year').textContent = year;
    $('#scenario-total').textContent = fmt(total);
    $('#scenario-growth').textContent = base
      ? `${fmt((total / base - 1) * 100)}% vs ${d.historicalThrough}`
      : 'No historical baseline';
    $('#baseline-caption').textContent =
      `${$('#scenario-region').selectedOptions[0]?.text || 'Canada'} · ${d.historicalThrough} historical end-use: ${fmt(base)} TWh · Current Measures in ${year}: ${fmt(reference)} TWh`;
    $('#scenario-kind').textContent = adjust
      ? 'YOUR SENSITIVITY / NOT AN OFFICIAL PATHWAY'
      : 'CER PUBLISHED PROJECTION';
    $('#sensitivity-value').textContent = (adjust > 0 ? '+' : '') + adjust.toFixed(1) + '%';
    $('#scenario-explainer').textContent =
      descriptions[$('#preset').value] || 'A conditional pathway from the current CER report.';
    $('#year-back').disabled = year <= Number($('#year').min);
    $('#year-next').disabled = year >= Number($('#year').max);
    const years = Array.from(
        { length: year - d.historicalThrough + 1 },
        (_, i) => i + d.historicalThrough,
      ),
      series = years.map((y) => scenarioValue(region, y)),
      refs = years.map((y) => scenarioValue(region, y, 'Current Measures', 0));
    const w = Math.max(300, $('#scenario-chart').clientWidth || 650),
      h = 280,
      l = 56,
      right = w - 20,
      top = 28,
      bottom = 235,
      max = Math.max(...series, ...refs, 1) * 1.12,
      x = (y) =>
        l + ((y - d.historicalThrough) / Math.max(1, year - d.historicalThrough)) * (right - l),
      py = (n) => bottom - (n / max) * (bottom - top);
    const line = (values) =>
        values
          .map((v, i) => `${i ? 'L' : 'M'}${x(years[i]).toFixed(1)} ${py(v).toFixed(1)}`)
          .join(' '),
      grid = [0, 1, 2, 3]
        .map((i) => {
          const n = (max * i) / 3;
          return `<path d="M${l} ${py(n)}H${right}" stroke="var(--border)"/><text x="${l - 8}" y="${py(n) + 5}" text-anchor="end" fill="var(--muted)" font-size="14">${Math.round(n).toLocaleString()}</text>`;
        })
        .join('');
    $('#scenario-chart').innerHTML =
      `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc($('#preset').value)} electricity use in ${esc(region)}. ${fmt(total)} TWh in ${year}; Current Measures ${fmt(reference)} TWh.">${grid}<path d="${line(series)}L${right} ${bottom}L${l} ${bottom}Z" fill="var(--accent)" opacity=".09"/><path d="${line(refs)}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/><path d="${line(series)}" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="${x(year)}" cy="${py(total)}" r="5" fill="var(--accent)"/><text x="${l}" y="269" fill="var(--muted)" font-size="14">${d.historicalThrough} historical</text><text x="${right}" y="269" text-anchor="end" fill="var(--muted)" font-size="14">${year} projection</text></svg>`;
    $('#regional-results').innerHTML =
      '<thead><tr><th scope="col">Province / territory</th><th scope="col">Historical TWh</th><th scope="col">Selected TWh</th></tr></thead><tbody>' +
      scenarioRows()
        .map(
          (r) =>
            `<tr><th scope="row"><button class="table-link" data-region="${r.region}">${esc(r.regionName)}</button></th><td>${fmt(r.base)}</td><td>${fmt(r.value)}</td></tr>`,
        )
        .join('') +
      '</tbody>';
    $$('[data-region]').forEach(
      (b) =>
        (b.onclick = () => {
          $('#scenario-region').value = b.dataset.region;
          renderForecast();
          saveView();
          document.dispatchEvent(new CustomEvent('eo:region', { detail: b.dataset.region }));
        }),
    );
    document.dispatchEvent(new Event('eo:forecast'));
  }
  for (const id of ['preset', 'scenario-region', 'year', 'sensitivity'])
    $('#' + id).addEventListener(id === 'year' || id === 'sensitivity' ? 'input' : 'change', () => {
      renderForecast();
      saveView();
    });
  $('#year-back').onclick = () => {
    $('#year').stepDown();
    renderForecast();
    saveView();
  };
  $('#year-next').onclick = () => {
    $('#year').stepUp();
    renderForecast();
    saveView();
  };
  $('#scenario-reset').onclick = () => {
    $('#preset').value = 'Current Measures';
    $('#scenario-region').value = 'CA';
    $('#year').value = $('#year').max;
    $('#sensitivity').value = 0;
    renderForecast();
    saveView();
    toast('Published Current Measures pathway restored');
  };
  function balanceRows() {
    const d = D.get('balance');
    return d?.history.filter((r) => r.period === $('#balance-period').value) || [];
  }
  function loadBalanceControls() {
    const d = D.get('balance');
    if (!d) return;
    const previous = $('#balance-period').value,
      periods = [...new Set(d.history.map((r) => r.period))].sort().reverse();
    $('#balance-period').replaceChildren(
      ...periods.map(
        (p) =>
          new Option(
            new Date(p + '-15T12:00:00Z').toLocaleDateString('en-CA', {
              month: 'long',
              year: 'numeric',
            }),
            p,
          ),
      ),
    );
    $('#balance-period').value = periods.includes(
      balanceInitialized ? previous : query.get('month'),
    )
      ? balanceInitialized
        ? previous
        : query.get('month')
      : d.reportingPeriod;
    balanceInitialized = true;
    renderBalance();
  }
  function renderBalance() {
    const data = balanceRows(),
      national = data.find((r) => r.region === 'CA');
    if (!national) return;
    $('#balance-summary').innerHTML = [
      ['Canada generation', national.generationTWh],
      ['Available for use', national.availableTWh],
      ['Net international exports', national.netExportsTWh],
    ]
      .map(
        ([label, n]) =>
          `<div><small>${label}</small><strong>${fmt(n)} <span>TWh</span></strong></div>`,
      )
      .join('');
    const rows = data
        .filter((r) => r.region !== 'CA')
        .sort((a, b) =>
          $('#balance-sort').value === 'name'
            ? a.regionName.localeCompare(b.regionName)
            : $('#balance-sort').value === 'generation'
              ? b.generationTWh - a.generationTWh
              : Math.abs(b.netExportsTWh ?? 0) - Math.abs(a.netExportsTWh ?? 0),
        ),
      max = Math.max(...rows.flatMap((r) => [r.generationTWh, r.availableTWh]));
    $('#balance-list').innerHTML = rows
      .map(
        (r) =>
          `<button class="balance-row" data-balance="${r.region}"><h4>${esc(r.regionName)}</h4><div class="balance-bars" aria-hidden="true"><div style="width:${(r.generationTWh / max) * 100}%"></div><div style="width:${(r.availableTWh / max) * 100}%"></div></div><div><strong>${r.netExportsTWh === null ? 'Trade not published' : `${fmt(Math.abs(r.netExportsTWh))} TWh net ${r.netExportsTWh >= 0 ? 'exports' : 'imports'}`}</strong><small>${fmt(r.generationTWh)} generated / ${fmt(r.availableTWh)} available</small></div></button>`,
      )
      .join('');
    $$('[data-balance]').forEach(
      (b) =>
        (b.onclick = () =>
          document.dispatchEvent(new CustomEvent('eo:balance', { detail: b.dataset.balance }))),
    );
    document.dispatchEvent(new Event('eo:balance-data'));
  }
  $('#balance-sort').onchange = renderBalance;
  $('#balance-period').onchange = () => {
    renderBalance();
    saveView();
  };
  function filteredCommunities() {
    const d = D.get('communities'),
      q = $('#community-search').value.toLowerCase().trim();
    return (d?.communities || []).filter(
      (c) =>
        (!q || `${c.name} ${c.province} ${c.provider || ''}`.toLowerCase().includes(q)) &&
        ($('#community-province').value === 'all' ||
          c.province === $('#community-province').value) &&
        ($('#community-fuel').value === 'all' || c.primarySource === $('#community-fuel').value),
    );
  }
  function loadCommunityControls() {
    const d = D.get('communities');
    if (!d) return;
    for (const [id, field] of [
      ['community-province', 'province'],
      ['community-fuel', 'primarySource'],
    ]) {
      const previous = $('#' + id).value,
        values = [...new Set(d.communities.map((c) => c[field]).filter(Boolean))].sort();
      $('#' + id).replaceChildren(
        new Option(field === 'province' ? 'All regions' : 'All power sources', 'all'),
        ...values.map((v) => new Option(v, v)),
      );
      $('#' + id).value = values.includes(previous) ? previous : 'all';
    }
    communityInitialized = true;
    renderCommunities();
  }
  function renderCommunities() {
    const rows = filteredCommunities(),
      d = D.get('communities');
    $('#community-count').textContent =
      `${rows.length} matching ${rows.length === 1 ? 'community' : 'communities'}${d ? ` · ${d.metadata.edition} published edition` : ''}. Select a place to explore its power context.`;
    $('#community-list').innerHTML = rows.length
      ? rows
          .slice(0, communityLimit)
          .map(
            (c) =>
              `<details class="community-group" data-community="${esc(c.id)}"><summary><span>${esc(c.name)}<small>${esc(c.province)} · ${esc(c.primarySource || 'Source not reported')}</small></span><span>↗</span></summary><dl><div><dt>Electricity provider</dt><dd>${esc(c.provider || 'Not reported')}</dd></div><div><dt>Population in the published inventory</dt><dd>${c.population === null ? 'Not reported' : fmt(c.population)}</dd></div><div><dt>Secondary source / reference</dt><dd>${esc(c.secondarySource || 'Not reported')}</dd></div><div><dt>All-season road access</dt><dd>${c.roadAccess === null ? 'Not reported' : c.roadAccess ? 'Yes' : 'No'}</dd></div><div><dt>System generation</dt><dd>${c.annualSystemGenerationMWh === null ? 'Not reported' : fmt(c.annualSystemGenerationMWh) + ' MWh/year'} · may represent a shared system</dd></div></dl></details>`,
          )
          .join('') +
        (rows.length > communityLimit
          ? '<button id="communities-more" class="button outline">Show more communities ↓</button>'
          : '')
      : '<p class="empty-state">No communities match these filters. Try clearing a filter.</p>';
    $$('[data-community] summary').forEach(
      (s) =>
        (s.onclick = (e) => {
          e.preventDefault();
          const group = s.parentElement;
          group.open = !group.open;
          if (group.open)
            document.dispatchEvent(
              new CustomEvent('eo:community', { detail: group.dataset.community }),
            );
        }),
    );
    if ($('#communities-more'))
      $('#communities-more').onclick = () => {
        communityLimit += 20;
        renderCommunities();
      };
    document.dispatchEvent(new Event('eo:communities-data'));
  }
  for (const id of ['community-search', 'community-province', 'community-fuel'])
    $('#' + id).addEventListener(id === 'community-search' ? 'input' : 'change', () => {
      communityLimit = 20;
      renderCommunities();
    });
  $('#community-reset').onclick = () => {
    $('#community-search').value = '';
    $('#community-province').value = 'all';
    $('#community-fuel').value = 'all';
    communityLimit = 20;
    renderCommunities();
  };
  function showCommunity(id) {
    const index = filteredCommunities().findIndex((c) => c.id === id);
    if (index < 0) return;
    if (index >= communityLimit) {
      communityLimit = index + 1;
      renderCommunities();
    }
    const group = $$('[data-community]').find((g) => g.dataset.community === id);
    $$('[data-community]').forEach((g) => g.classList.toggle('active', g === group));
    if (group) {
      group.open = true;
      group.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }
  document.addEventListener('eo:data', (e) => {
    if (['reliability', 'customers', 'balance', 'ieso'].includes(e.detail)) {
      renderList();
      selectUtility(selected, false);
    }
    if (e.detail === 'scenarios') loadScenarioControls();
    if (e.detail === 'balance') loadBalanceControls();
    if (e.detail === 'communities') loadCommunityControls();
  });
  window.EOApp = {
    selectUtility,
    openTab,
    scenarioRows,
    balanceRows,
    filteredCommunities,
    showCommunity,
  };
  document.addEventListener('eo:mapstate', saveView);
  renderList();
  selectUtility(selected, false);
  loadScenarioControls();
  loadBalanceControls();
  loadCommunityControls();
  openTab(query.get('view') || 'reliability', false);
  let width = 0;
  new ResizeObserver((e) => {
    const n = e[0]?.contentRect.width || 0;
    if (n > 0 && Math.abs(n - width) > 1) {
      width = n;
      renderForecast();
    }
  }).observe($('#scenario-chart'));
})();
