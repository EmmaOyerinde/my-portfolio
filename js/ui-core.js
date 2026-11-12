'use strict';
// Shared presentation rules. Keep source adapters independent of the DOM.
(() => {
  const escapeHTML = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character],
    );

  function safeSourceURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' &&
        !url.username &&
        !url.password &&
        !url.port &&
        sourceHosts.has(url.hostname)
        ? url.href
        : '#methodology';
    } catch {
      return '#methodology';
    }
  }

  const sourceHosts = new Set(
    [
      'www.oeb.ca',
      'www.cer-rec.gc.ca',
      'cer-rec.gc.ca',
      'open.canada.ca',
      'www150.statcan.gc.ca',
      'maps-cartes.services.geo.ca',
      'www.ieso.ca',
      'reports-public.ieso.ca',
      'www.bchydro.com',
      'www.bcbudget.gov.bc.ca',
      'www.saskpower.com',
      'www.hydro.mb.ca',
      'www.nspower.ca',
      'www.maritimeelectric.com',
      // These are reviewed, repository-owned report links, never visitor-supplied origins.
      ...(window.EOReferenceData?.reliabilityReports?.coverage || []).flatMap((row) => [
        row.url,
        row.dataUrl,
      ]),
      ...Object.values(window.EOReferenceData?.reliabilityReports?.gapNotes || {}).flatMap((row) =>
        row.sources.map((source) => source.url),
      ),
      ...(window.EOReferenceData?.reliabilityReports?.rows || []).map((row) => row.sourceUrl),
      ...Object.values(window.EOReferenceData?.customerReports || {}).map((row) => row.sourceUrl),
    ]
      .map((value) => {
        if (!value.includes('://')) return value;
        try {
          const url = new URL(value);
          return url.protocol === 'https:' && !url.username && !url.password ? url.hostname : '';
        } catch {
          return '';
        }
      })
      .filter(Boolean),
  );

  function formatDate(
    value,
    { dateStyle = 'medium', includeTime = false, fallback = 'Not recorded' } = {},
  ) {
    if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) return fallback;
    // Publication dates have no time zone. UTC avoids moving Nov 10 to Nov 9 in Canada.
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    return new Date(value).toLocaleString('en-CA', {
      dateStyle,
      ...(dateOnly ? { timeZone: 'UTC' } : includeTime ? { timeStyle: 'short' } : {}),
    });
  }

  function csvCell(value) {
    // Leading spaces, tabs and control characters must not conceal a spreadsheet formula.
    const text =
      typeof value === 'string'
        ? value.replace(/^[\u0000-\u0020]*[=+@-]/, "'$&")
        : String(value ?? '');
    return '"' + text.replaceAll('"', '""') + '"';
  }

  function downloadCSV(filename, rows) {
    const csv = '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function focusableWithin(container) {
    return [
      ...container.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]'),
    ].filter((node) => {
      if (node.disabled || node.tabIndex < 0 || node.closest('[hidden],[inert]')) return false;
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (
          parent.matches('details:not([open])') &&
          !parent.querySelector(':scope > summary')?.contains(node)
        )
          return false;
      }
      const style = node.ownerDocument.defaultView.getComputedStyle(node);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        node.getClientRects().length > 0
      );
    });
  }
  window.EOUI = Object.freeze({
    escapeHTML,
    safeSourceURL,
    formatDate,
    csvCell,
    downloadCSV,
    focusableWithin,
  });
})();
