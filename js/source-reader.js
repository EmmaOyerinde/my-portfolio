'use strict';
(() => {
  const D = window.EOData,
    $ = (s) => document.querySelector(s),
    esc = window.EOUI.escapeHTML;
  const number = (n) => Number(n).toLocaleString('en-CA', { maximumFractionDigits: 2 });
  const oeb =
    'https://www.oeb.ca/ontarios-energy-sector/performance-assessment/electricity-distributor-scorecards';
  const guides = {
    customers: {
      title: 'How many customers does the utility serve?',
      intro:
        'The Ontario Energy Board collects customer accounts by rate class every year. These figures describe the size of a distributor’s customer base.',
      meaning:
        'Residential, business and other customer classes are added together. Lighting and other connection-only records are kept separate, so a streetlight is not counted as a household.',
      limit:
        'Accounts are not people. One account can serve a household or a business. A company total can cover several map footprints and must only be counted once.',
      label: 'Read the OEB customer data guide',
    },
    reliability: {
      title: 'How often does the power go out?',
      intro:
        'The Ontario Energy Board publishes an annual scorecard for each electricity distributor. The figures here describe an average customer’s interruptions over a year.',
      meaning:
        'SAIDI adds up the average hours without power. SAIFI counts the average interruptions. A lower number means less outage time or fewer interruptions under the same reporting method.',
      limit:
        'These adjusted figures exclude loss of supply and major events. They are annual averages, not an outage alert, a prediction for your address, or a guarantee of service.',
      label: 'Read the OEB scorecards',
      url: oeb,
    },
    scenarios: {
      title: 'What could future electricity use look like?',
      intro:
        'The Canada Energy Regulator publishes several pathways for energy use. Choose a pathway, region, and year to explore its assumptions.',
      meaning:
        'The figures show annual electricity use in terawatt-hours (TWh). The dashed line gives the Current Measures pathway as a reference. Your sensitivity slider applies an additional assumption and is labelled separately.',
      limit:
        'A scenario is conditional. It is not a promise or a probability. Do not subtract these end-use projections from the monthly generation figures in another view.',
      label: 'Read the CER report',
    },
    balance: {
      title: 'Where does the electricity go?',
      intro:
        'Statistics Canada reports electricity generation, trade, and electricity available for use by province and territory each month.',
      meaning:
        'Generation is electricity produced. Available for use includes losses in transmission and distribution. Net exports or imports describe the direction of the trade balance.',
      limit:
        'Monthly energy in TWh does not measure peak power or spare capacity. Net imports alone do not establish a shortage.',
      label: 'Open the readable statistics table',
    },
    communities: {
      title: 'How are these communities powered?',
      intro:
        'Natural Resources Canada’s inventory identifies remote communities, their locations, and the power sources and providers reported in the published edition.',
      meaning:
        'Select a place to see its recorded electricity context. Some communities connect to regional grids. The inventory is broader than diesel-only or fully off-grid settlements.',
      limit:
        'The publisher does not provide an observation date for each value. Shared-system generation can cover several places and must not be added together across communities.',
      label: 'Read the NRCan catalogue',
    },
    ieso: {
      title: 'A snapshot of Ontario’s grid',
      intro:
        'The IESO publishes Ontario system demand in five-minute intervals. This site keeps a dated sample from the most recent successful scheduled check.',
      meaning:
        'Megawatts (MW) measure power at the sampled interval. This is a province-wide operating context, separate from a utility’s annual outage performance.',
      limit:
        'The saved sample is not a continuous live feed. Its delivery date, hour, and interval matter more than when you opened this page.',
      label: 'Explore the IESO data directory',
    },
    boundaries: {
      title: 'What does a boundary tell you?',
      intro:
        'The optional OEB layer shows the service-area geometry published by the regulator. The detailed portfolio footprints remain available underneath.',
      meaning:
        'The official layer retains publisher names, including legacy and split entities. It is presented separately from the utility performance data.',
      limit:
        'Map overlap does not prove which company serves an address. Use the regulator’s service-area lookup for that question.',
      label: 'Read the OEB mapping guide',
      url: 'https://www.oeb.ca/open-data/electricity-and-natural-gas-distributors-service-areas-mapping-data',
    },
  };
  const safe = window.EOUI.safeSourceURL;
  function customerSource(id) {
    const p = D.profile(id),
      c = p.customer;
    $('#evidence-body').innerHTML =
      `<p class="eyebrow">CUSTOMER BASE / SOURCE EXPLAINED</p><h2 id="evidence-title">${esc(p.name)}</h2><div class="evidence-values"><div><strong>${esc(D.customerLabel(id))}</strong><span>Customer accounts · ${esc(c.period)}</span></div></div><p class="evidence-intro">${esc(c.definition)}</p><p><strong>Scope</strong><br>${esc(c.scope)}</p>${
        c.type === 'oeb'
          ? `<div class="table-scroll"><table><caption>Customer classes included in the total</caption><thead><tr><th>Class</th><th>Customers</th></tr></thead><tbody>${c.classes
              .filter((r) => r.unit === 'Customers')
              .map(
                (r) =>
                  `<tr><th scope="row">${esc(r.name)}</th><td>${r.value.toLocaleString('en-CA')}</td></tr>`,
              )
              .join(
                '',
              )}</tbody></table></div><p>${c.connections.toLocaleString('en-CA')} lighting and other connection-only records are reported separately. They are excluded from the customer total.</p>`
          : ''
      }<div class="evidence-limit"><h3>Accounts and population are different</h3><p>One account can serve a household or a business. Company totals can cover several map areas. Do not add overlapping company and local-area totals together.</p></div>${c.sourceUrl ? `<a class="button primary" href="${esc(safe(c.sourceUrl))}" target="_blank" rel="noopener noreferrer">${c.type === 'oeb' ? 'Read the OEB customer guide' : 'Read the customer-count source'} ↗</a>` : `<p class="reference-note">Original portfolio reference · retained for continuity. New verified publisher figures take priority as they are added.</p>`}${c.location ? `<p class="control-help">${esc(c.location)} · Reviewed ${esc(c.reviewedAt)}</p>` : ''}`;
    $('#evidence-dialog').showModal();
  }
  function open(kind, id) {
    const p = id ? D.profile(id) : null;
    if (p) kind = p.type === 'oeb' ? 'reliability' : p.type === 'context' ? 'balance' : 'report';
    const m = D.meta(kind === 'report' ? 'reliability' : kind),
      g = guides[kind] || {
        title: 'Read the utility’s own report',
        intro:
          'This profile uses a figure published in the utility’s annual or sustainability report. It keeps the reporting year and measurement method attached to the number.',
        meaning: p?.method,
        limit:
          'Utilities can use different event exclusions and reporting methods. These figures are not merged into an OEB ranking.',
        label: 'Read the original report (PDF)',
      };
    const raw = p?.sourceUrl || m.dataUrl;
    const readable = g.url || (kind === 'report' ? p.sourceUrl : m.url);
    const period = p?.period || m.period;
    const checked = kind === 'report' ? p.reviewedAt : m.checkedAt;
    const check = window.EOUI.formatDate(checked, {
      dateStyle: 'long',
      fallback: 'See Sources & freshness',
    });
    const status = kind === 'report' ? 'Reviewed report excerpt' : D.status(kind).label;
    const facts =
      p && p.type !== 'context'
        ? `<div class="evidence-values">${p.saidi !== null ? `<div><strong>${esc(number(p.saidi))} <small>hours</small></strong><span>Average annual outage duration</span></div>` : ''}${p.saifi !== null ? `<div><strong>${esc(number(p.saifi))}</strong><span>Average annual interruptions</span></div>` : ''}</div>`
        : '';
    $('#evidence-body').innerHTML =
      `<p class="eyebrow">SOURCE, IN PLAIN LANGUAGE</p><h2 id="evidence-title">${esc(g.title)}</h2>${p ? `<p class="evidence-utility">${esc(p.name)} · ${esc(p.scope)}</p>` : ''}<p class="evidence-intro">${esc(g.intro)}</p><div class="evidence-meta"><div><small>Reporting period</small><strong>${esc(period)}</strong></div><div><small>${kind === 'report' ? 'Reviewed' : 'Publisher checked'}</small><strong>${esc(check)}</strong></div><div><small>Availability</small><strong>${esc(status)}</strong></div></div>${facts}<h3>How to read it</h3><p>${esc(g.meaning)}</p><div class="evidence-limit"><h3>Keep this in mind</h3><p>${esc(g.limit)}</p>${p?.type === 'oeb' ? `<p>${esc(p.method)}</p>` : ''}</div><a class="button primary" href="${esc(safe(readable))}" target="_blank" rel="noopener noreferrer">${esc(g.label)} ↗</a>${kind !== 'report' && raw ? `<details class="technical-source"><summary>For analysts: data file & method</summary><p>This is a machine-readable file or data service. It may open as XML, JSON, or a download. The explanation above and the publisher’s page are easier to read.</p><a href="${esc(safe(raw))}" target="_blank" rel="noopener noreferrer">Open original technical data ↗</a><p>${esc(m.definition)}</p></details>` : ''}`;
    const stage = document.querySelector('.map-stage.is-expanded');
    if (stage) stage.querySelector('[data-expand]').click();
    $('#evidence-dialog').showModal();
  }
  document.addEventListener('click', (e) => {
    const customer = e.target.closest('[data-customer-source]');
    if (customer) customerSource(customer.dataset.customerSource);
    const button = e.target.closest('[data-evidence-utility],[data-evidence-kind]');
    if (!button) return;
    if (button.dataset.evidenceUtility) open(null, button.dataset.evidenceUtility);
    else open(button.dataset.evidenceKind);
  });
  window.EOSources = { customerSource, openUtility: (id) => open(null, id), open };
})();
