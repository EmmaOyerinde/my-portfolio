'use strict';
// Status presentation subscribes to the data client without owning its fetch lifecycle.
(() => {
  const D = window.EOData,
    E = window.EOEvidence;
  const { escapeHTML: esc, safeSourceURL: safeLink } = window.EOUI;
  const date = (value) => window.EOUI.formatDate(value, { includeTime: true });
  const keyForTab = {
    reliability: 'reliability',
    forecast: 'scenarios',
    deficit: 'balance',
    offgrid: 'communities',
  };
  let active = 'reliability';
  function renderCards() {
    const holder = document.querySelector('#source-cards');
    if (!document.querySelector('#source-dialog').open || holder.contains(document.activeElement))
      return;
    document.querySelector('#source-cards').innerHTML = E.kinds
      .map((k) => {
        const m = D.meta(k),
          entry = D.sourceEntry(k),
          s = k === 'boundaries' && !D.get(k) ? E.freshness(entry, !!entry) : D.status(k);
        return `<article class="source-card"><div><h3>${esc(m.name)}</h3><span class="source-state ${s.state === 'verified' ? 'connected' : ''}">${esc(s.label)}</span></div><strong>${esc(k === 'boundaries' && !D.get(k) ? entry?.period || 'Official archive' : m.period)}</strong><p>${esc(m.coverage || 'Loaded when you enable the OEB layer.')}</p><dl><div><dt>Successful publisher check</dt><dd>${esc(date(m.checkedAt || entry?.lastSuccessAt))}</dd></div><div><dt>Most recent refresh attempt</dt><dd>${esc(date(entry?.lastAttemptAt))}</dd></div><div><dt>Publication / checks</dt><dd>${esc(m.cadence || 'As-published archives · daily scheduled checks')}</dd></div></dl><p>${esc(s.message)}</p><p>${esc(m.definition)}</p><div class="source-links"><button class="text-button" data-evidence-kind="${k}">Read the explanation ↗</button><a href="${esc(safeLink(k === 'boundaries' ? 'https://www.oeb.ca/open-data/electricity-and-natural-gas-distributors-service-areas-mapping-data' : m.url))}" target="_blank" rel="noopener noreferrer">Publisher & methodology ↗</a>${m.dataUrl ? `<a href="${esc(safeLink(m.dataUrl))}" target="_blank" rel="noopener noreferrer">Technical data file ↗</a>` : ''}</div></article>`;
      })
      .join('');
    const automation = document.querySelector('#automation-status');
    const attempted =
      typeof D.manifest()?.runUrl === 'string' &&
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/actions\/runs\/\d+$/.test(D.manifest().runUrl);
    automation.textContent = attempted
      ? 'Daily checks run through GitHub Actions. A delayed, disabled, or failed job never changes the last successful check date.'
      : 'This copy includes verified source snapshots. Automatic checks begin after the included GitHub workflow is enabled.';
  }
  function renderStatus() {
    const kind = keyForTab[active],
      m = D.meta(kind),
      status = D.status(kind);
    document.querySelector('#data-status').textContent = status.label;
    document.querySelector('#data-light').className =
      'status-light ' + (status.state === 'verified' ? 'live' : 'offline');
    document.querySelector('#data-period').textContent = `${m.period} · ${m.name}`;
    document.querySelector('#data-refresh').disabled = !!D.health[kind]?.loading;
    document.querySelector('#data-status-note').textContent = status.message;
    renderCards();
  }
  document.addEventListener('eo:tab', (event) => {
    if (!(event.detail in keyForTab)) return;
    active = event.detail;
    renderStatus();
  });
  document.addEventListener('eo:data', renderStatus);
  document.addEventListener('eo:source-status', renderStatus);
  document.querySelector('#data-refresh').onclick = () =>
    active === 'reliability'
      ? Promise.all(['reliability', 'customers'].map(D.refresh))
      : D.refresh(keyForTab[active]);
  const open = () => {
    document.querySelector('#source-dialog').showModal();
    renderStatus();
  };
  document.querySelector('#source-open').onclick = open;
  document.querySelector('#method-sources').onclick = open;
  document
    .querySelector('#source-cards')
    .addEventListener('focusout', () => queueMicrotask(renderCards));
  renderStatus();
})();
