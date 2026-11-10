'use strict';
(() => {
  const E = window.EOEvidence,
    kinds = ['reliability', 'scenarios', 'balance', 'communities', 'ieso', 'customers'],
    datasets = {},
    health = {},
    mapping = {},
    pending = new Map();
  let manifest = window.EOEvidenceSeed?.manifest || null;
  const names = {
    customers: 'OEB customer accounts',
    ieso: 'IESO Ontario grid context',
    reliability: 'Ontario Energy Board',
    scenarios: 'Canada Energy Regulator',
    balance: 'Statistics Canada',
    communities: 'Natural Resources Canada',
    boundaries: 'OEB service-area geometry',
  };
  const safeLink = window.EOUI.safeSourceURL;
  const entries = { ...manifest?.datasets };
  function meta(kind) {
    const d = datasets[kind];
    if (!d)
      return {
        name: names[kind],
        period: 'Published source',
        checkedAt: null,
        url: '#methodology',
        definition: 'Open the source or retry this saved publication.',
      };
    if (kind === 'customers')
      return {
        name: names[kind],
        period: d.reportingPeriod + ' customer accounts',
        checkedAt: d.checkedAt,
        url: d.catalogUrl,
        dataUrl: d.sourceUrl,
        definition: d.definition,
        coverage:
          d.rows.length +
          ' Ontario distributors. Other utility profiles retain separately sourced reports or the original reference count.',
        cadence: 'Annual RRR releases · daily scheduled checks',
      };
    if (kind === 'ieso')
      return {
        name: names[kind],
        period: d.deliveryDate + ' · hour ending ' + d.deliveryHour + ' · interval ' + d.interval,
        checkedAt: d.checkedAt,
        url: d.catalogUrl,
        dataUrl: d.sourceUrl,
        definition: d.definition,
        coverage:
          'Ontario system demand · ' +
          d.demandMW.toLocaleString('en-CA') +
          ' MW at the sampled interval',
        cadence: 'Five-minute publisher report · saved by the daily job',
      };
    if (kind === 'reliability')
      return {
        name: names[kind],
        period: `${d.reportingYear} reporting year`,
        checkedAt: d.checkedAt,
        url: 'https://www.oeb.ca/ontarios-energy-sector/performance-assessment/electricity-distributor-scorecards',
        dataUrl: d.sourceUrl,
        definition: d.methodology.label + '. Annual Ontario distribution measures.',
        coverage: `${d.rows.length} published distributors. National profiles also show separately labelled provincial electricity context.`,
        cadence: 'Annual scorecards · daily scheduled checks',
      };
    if (kind === 'communities')
      return {
        name: names[kind],
        period: `${d.metadata.edition} edition`,
        checkedAt: d.metadata.checkedAt,
        url: d.metadata.sourceUrl,
        dataUrl: d.metadata.serviceUrl,
        definition: d.metadata.limitations,
        coverage: `${d.communities.length} communities · catalogue coverage ends ${d.metadata.coverageEnd || 'as documented by NRCan'}.`,
        cadence: 'As-needed releases · daily scheduled checks',
      };
    if (kind === 'boundaries')
      return {
        name: names[kind],
        period: d.metadata.edition,
        checkedAt: d.metadata.checkedAt,
        url: d.metadata.catalogUrl,
        dataUrl: d.metadata.sourceUrl,
        definition:
          'Official publisher geometry with original names, including legacy and split entities. This separate layer does not change the metric scope.',
        coverage: `${d.features.length} named boundary features`,
        cadence: 'As-published archives · daily scheduled checks',
      };
    return {
      name: names[kind],
      period:
        kind === 'balance'
          ? d.reportingPeriod
          : `${d.dataset} · historical through ${d.historicalThrough}`,
      checkedAt: d.checkedAt,
      url: d.sourceUrl,
      dataUrl: kind === 'balance' ? d.apiUrl : d.dataUrl,
      definition: d.definition,
      coverage:
        kind === 'balance'
          ? 'Canada and 13 provinces/territories · monthly observations'
          : `${d.scenarios.length} pathways · ${d.years[0]}–${d.years.at(-1)} · 14 geographies`,
      cadence:
        kind === 'balance'
          ? 'Monthly releases · daily scheduled checks'
          : 'Report editions · daily scheduled checks',
    };
  }
  function status(kind) {
    const h = health[kind] || {},
      base = E.freshness(entries[kind], !!datasets[kind]);
    if (h.loading)
      return {
        state: 'loading',
        label: 'Checking published copy',
        message:
          'Your current view remains available while the site checks for a newer published file.',
      };
    if (h.failed && datasets[kind])
      return {
        state: 'saved',
        label: 'Saved data · ready to explore',
        message:
          navigator.onLine === false
            ? 'You’re offline. The saved publication remains available; map backgrounds and external links need a connection.'
            : 'The latest site copy could not be checked. Your saved publication remains available. Try again when your connection improves.',
      };
    return base;
  }
  function notify(kind) {
    document.dispatchEvent(new CustomEvent('eo:data', { detail: kind }));
  }
  function notifyStatus() {
    document.dispatchEvent(new CustomEvent('eo:source-status'));
  }
  async function fetchJSON(file, limit = 12 * 1024 * 1024) {
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 12000);
    try {
      const r = await fetch(file, {
        cache: 'no-store',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (!r.ok) throw Error('File unavailable');
      if (Number(r.headers?.get('content-length')) > limit) throw Error('File too large');
      const text = await r.text();
      if (text.length > limit) throw Error('File too large');
      return { data: JSON.parse(text), text };
    } finally {
      clearTimeout(timer);
    }
  }
  function manifestValid(m) {
    return (
      m?.schemaVersion === 1 &&
      E.kinds.every(
        (k) =>
          m.datasets?.[k]?.file === E.files[k] &&
          /^[a-f0-9]{64}$/.test(m.datasets[k].sha256) &&
          [
            'ok',
            'not-run',
            'blocked',
            'rate-limited',
            'timeout',
            'unavailable',
            'invalid',
          ].includes(m.datasets[k].status),
      )
    );
  }
  let manifestRequest;
  async function readManifest() {
    if (manifestRequest) return manifestRequest;
    manifestRequest = (async () => {
      try {
        const { data } = await fetchJSON('data/source-status.json', 30000);
        if (!manifestValid(data)) throw Error('Status file invalid');
        manifest = data;
        return data;
      } catch {
        return null;
      } finally {
        manifestRequest = null;
      }
    })();
    return manifestRequest;
  }
  async function verified(kind, entry) {
    const hash = entry?.sha256;
    const { data, text } = await fetchJSON(
      'data/' + E.files[kind] + (hash ? '?v=' + hash.slice(0, 16) : ''),
    );
    if (!E.valid(kind, data)) throw Error('Dataset invalid');
    if (hash && globalThis.crypto?.subtle) {
      const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      const actual = [...new Uint8Array(bytes)]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
      if (actual !== hash) throw Error('Published files are not consistent yet');
    }
    return data;
  }
  async function refresh(kind) {
    if (!E.kinds.includes(kind)) throw new RangeError('Unknown dataset: ' + kind);
    if (pending.has(kind)) return pending.get(kind);
    const before = datasets[kind];
    const task = (async () => {
      health[kind] = { ...health[kind], loading: true };
      notifyStatus();
      try {
        // Keep data, integrity hash and publisher status from the same manifest generation.
        const current = await readManifest();
        const entry = current?.datasets[kind] || entries[kind];
        const unchanged = current && datasets[kind] && health[kind].sha256 === entry.sha256;
        if (!unchanged) datasets[kind] = await verified(kind, entry);
        if (entry) entries[kind] = entry;
        health[kind] = { loading: false, failed: !current, sha256: entry?.sha256 };
        if (kind !== 'boundaries')
          try {
            localStorage.setItem(
              'eo-evidence-v4-' + kind,
              JSON.stringify({ data: datasets[kind], sha256: health[kind].sha256 }),
            );
          } catch {}
      } catch {
        health[kind] = { ...health[kind], loading: false, failed: true };
      }
      if (datasets[kind] !== before) notify(kind);
      else notifyStatus();
      return datasets[kind];
    })();
    pending.set(kind, task);
    try {
      return await task;
    } finally {
      pending.delete(kind);
    }
  }
  async function start() {
    Object.assign(mapping, window.EOEvidenceSeed?.mapping || {});
    for (const kind of kinds) {
      const seed = window.EOEvidenceSeed?.datasets?.[kind];
      if (E.valid(kind, seed)) {
        datasets[kind] = seed;
        health[kind] = { sha256: manifest?.datasets?.[kind]?.sha256 };
      }
      try {
        const saved = JSON.parse(localStorage.getItem('eo-evidence-v4-' + kind));
        if (
          E.valid(kind, saved?.data) &&
          (!datasets[kind] ||
            Date.parse(E.checkedAt(kind, saved.data)) >
              Date.parse(E.checkedAt(kind, datasets[kind])))
        ) {
          datasets[kind] = saved.data;
          health[kind] = { sha256: saved.sha256 };
        }
      } catch {}
      notify(kind);
    }
    if (!Object.keys(mapping).length) {
      try {
        const { data } = await fetchJSON('data/reliability-mapping.json', 30000);
        for (const [k, v] of Object.entries(data)) if (typeof v === 'string') mapping[k] = v;
      } catch {}
    }
    await Promise.all(kinds.map(refresh));
  }
  window.EOData = {
    get: (kind) => datasets[kind],
    meta,
    health,
    status,
    refresh,
    load: (kind) => (datasets[kind] ? Promise.resolve(datasets[kind]) : refresh(kind)),
    utility: (id) => {
      const name = mapping[id];
      return name ? datasets.reliability?.rows.find((r) => r.name === name) : null;
    },
    sourceName: (id) => mapping[id],
    safeLink,
    sourceEntry: (kind) => entries[kind],
    manifest: () => manifest,
  };
  let lastRefresh = Date.now();
  function recheck() {
    if (document.visibilityState === 'visible' && Date.now() - lastRefresh > 3600000) {
      lastRefresh = Date.now();
      kinds.forEach(refresh);
    }
  }
  setInterval(recheck, 60000);
  document.addEventListener('visibilitychange', recheck);
  window.addEventListener('online', () => {
    lastRefresh = Date.now();
    kinds.forEach(refresh);
  });
  window.addEventListener('offline', () => {
    kinds.forEach((k) => {
      health[k] = { ...health[k], failed: true };
    });
    notifyStatus();
  });
  window.EOData.ready = start();
})();
