export const SOURCE_PATHS = {
  'reports-public.ieso.ca': /^\/public\/RealtimeTotals\/PUB_RealtimeTotals\.xml$/,
  'www.oeb.ca': /^\/(?:open-data\/|_html\/performance\/data\/|documents\/opendata\/)/,
  'www.cer-rec.gc.ca':
    /^\/(?:en\/data-analysis\/canada-energy-future\/|open\/energy\/energyfutures\d{4}\/(?:end-use-demand-\d{4}|EF\d{4}-data-dictionary)\.csv$)/,
  'cer-rec.gc.ca':
    /^\/(?:en\/data-analysis\/canada-energy-future\/|open\/energy\/energyfutures\d{4}\/(?:end-use-demand-\d{4}|EF\d{4}-data-dictionary)\.csv$)/,
  'open.canada.ca': /^\/data\/(?:en\/)?(?:api\/|dataset\/)/,
  'www150.statcan.gc.ca':
    /^\/t1\/wds\/rest\/(?:getDataFromVectorsAndLatestNPeriods|getCubeMetadata)$/,
  'maps-cartes.services.geo.ca':
    /^\/server_serveur\/rest\/services\/NRCan\/remote_communities_\d{4}_en\/MapServer(?:\/\d+(?:\/query)?)?\/?$/,
};
export function assertSource(raw) {
  const u = new URL(raw);
  if (
    u.protocol !== 'https:' ||
    u.username ||
    u.password ||
    u.port ||
    !SOURCE_PATHS[u.hostname]?.test(u.pathname)
  )
    throw Error('Source URL rejected');
  return u;
}
export async function sourceFetch(raw, options = {}, fetcher = fetch) {
  const u = assertSource(raw);
  const signal = options.signal
    ? AbortSignal.any([options.signal, AbortSignal.timeout(25000)])
    : AbortSignal.timeout(25000);
  let current = u;
  for (let redirects = 0; redirects < 3; redirects++) {
    const r = await fetcher(current.href, { ...options, signal, redirect: 'manual' });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      const next = assertSource(new URL(r.headers.get('location'), current).href);
      if (next.origin !== current.origin) throw Error('Cross-origin redirect rejected');
      current = next;
      continue;
    }
    if (!r.ok) throw Error('Upstream HTTP ' + r.status + ' from ' + current.hostname);
    const limit = 24 * 1024 * 1024;
    if (Number(r.headers.get('content-length')) > limit) throw Error('Source too large');
    const reader = r.body.getReader(),
      chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) {
        await reader.cancel();
        throw Error('Source too large');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return new Response(bytes, { status: r.status, headers: r.headers });
  }
  throw Error('Too many redirects');
}
