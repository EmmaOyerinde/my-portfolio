// OEB polygon-only KML adapter. No DOM, Node APIs, or external packages required.
// Zip/KMZ decompression is deliberately left to the caller (for example, fflate).
export const OEB_BOUNDARY_CATALOG =
  'https://www.oeb.ca/open-data/electricity-and-natural-gas-distributors-service-areas-mapping-data';

function decodeXml(text) {
  return String(text)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, raw) => {
      const value = raw[0].toLowerCase() === 'x' ? parseInt(raw.slice(1), 16) : Number(raw);
      return Number.isSafeInteger(value) && value > 0 && value <= 0x10ffff
        ? String.fromCodePoint(value)
        : '';
    })
    .replace(
      /&(amp|lt|gt|quot|apos);/g,
      (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[name],
    );
}

function ringFromBoundary(boundary) {
  const matches = [...boundary.matchAll(/<coordinates\b[^>]*>([\s\S]*?)<\/coordinates>/g)];
  if (matches.length !== 1)
    throw new Error('Each OEB boundary ring must have one coordinate sequence');
  const tokens = matches[0][1].trim().split(/\s+/);
  if (tokens.length < 4) throw new Error('OEB polygon ring has fewer than four coordinates');
  const ring = tokens.map((token) => {
    const parts = token.split(',');
    if (
      parts.length < 2 ||
      parts.length > 3 ||
      parts.some((p) => !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(p))
    )
      throw new Error('Invalid OEB coordinate tuple');
    const point = parts.map(Number);
    if (
      point.some((n) => !Number.isFinite(n)) ||
      Math.abs(point[0]) > 180 ||
      Math.abs(point[1]) > 90
    )
      throw new Error('Nonfinite or out-of-range OEB coordinate');
    return point;
  });
  const first = ring[0],
    last = ring.at(-1);
  if (first.length !== last.length || first.some((n, i) => n !== last[i]))
    throw new Error('Unclosed OEB polygon ring');
  return ring;
}

export function parseKmlBoundaries(kml) {
  if (typeof kml !== 'string' || kml.length > 30000000 || /<!DOCTYPE|<!ENTITY/i.test(kml))
    throw new Error('Invalid or unsupported OEB KML');
  // Namespace prefixes do not change the meaning of these KML geometry tags.
  let xml = kml.replace(
    /<\/?(?:[A-Za-z_][\w.-]*:)(kml|Placemark|name|description|Polygon|outerBoundaryIs|innerBoundaryIs|LinearRing|coordinates)\b/g,
    (tag) => tag.replace(/(<\/?)[^:]+:/, '$1'),
  );
  if (!/<kml\b/.test(xml)) throw new Error('OEB archive does not contain KML');
  // Embedded descriptions may contain HTML/scripts. They are never retained or executed.
  xml = xml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<description\b[^>]*>[\s\S]*?<\/description>/g, '');
  const placemarks = [...xml.matchAll(/<Placemark\b([^>]*)>([\s\S]*?)<\/Placemark>/g)];
  if (!placemarks.length || placemarks.length > 500)
    throw new Error('Unexpected OEB boundary feature count');
  const features = placemarks.map(([, attributes, body]) => {
    if (/<(?:[A-Za-z_][\w.-]*:)?(?:Point|LineString|Track|Model)\b/.test(body))
      throw new Error('OEB boundary placemark contains unsupported nonpolygon geometry');
    const nameMatch = body.match(/<name\b[^>]*>([\s\S]*?)<\/name>/);
    const name = nameMatch ? decodeXml(nameMatch[1]) : '';
    if (!name.trim() || name.length > 250 || /[<>]/.test(name))
      throw new Error('Invalid OEB boundary name');
    const polygons = [...body.matchAll(/<Polygon\b[^>]*>([\s\S]*?)<\/Polygon>/g)].map(
      ([, polygon]) => {
        const outer = [
          ...polygon.matchAll(/<outerBoundaryIs\b[^>]*>([\s\S]*?)<\/outerBoundaryIs>/g),
        ];
        if (outer.length !== 1) throw new Error('OEB polygon must have exactly one exterior ring');
        const inner = [
          ...polygon.matchAll(/<innerBoundaryIs\b[^>]*>([\s\S]*?)<\/innerBoundaryIs>/g),
        ];
        return [
          ringFromBoundary(outer[0][1]),
          ...inner.map(([, boundary]) => ringFromBoundary(boundary)),
        ];
      },
    );
    if (!polygons.length) throw new Error('OEB placemark has no polygon geometry');
    const sourceId = attributes.match(/\bid\s*=\s*["']([^"']+)["']/)?.[1];
    return {
      type: 'Feature',
      ...(sourceId ? { id: decodeXml(sourceId) } : {}),
      properties: { name },
      geometry:
        polygons.length === 1
          ? { type: 'Polygon', coordinates: polygons[0] }
          : { type: 'MultiPolygon', coordinates: polygons },
    };
  });
  return { type: 'FeatureCollection', features };
}

export function discoverOebBoundaryRelease(html, now = new Date()) {
  const matches = [
    ...String(html).matchAll(/href\s*=\s*["']([^"']*open-data-electricity-map-(\d{8})\.zip)["']/gi),
  ];
  const releases = matches
    .map(([, href, ymd]) => {
      const url = new URL(decodeXml(href), OEB_BOUNDARY_CATALOG);
      const date = ymd.slice(0, 4) + '-' + ymd.slice(4, 6) + '-' + ymd.slice(6, 8);
      const parsed = Date.parse(date + 'T00:00:00Z');
      return { url, sourceDate: date, parsed };
    })
    .filter(
      ({ url, sourceDate, parsed }) =>
        url.protocol === 'https:' &&
        url.hostname === 'www.oeb.ca' &&
        /^\/documents\/opendata\/open-data-electricity-map-\d{8}\.zip$/.test(url.pathname) &&
        Number.isFinite(parsed) &&
        new Date(parsed).toISOString().startsWith(sourceDate) &&
        parsed <= now.getTime(),
    );
  releases.sort((a, b) => b.parsed - a.parsed);
  if (!releases.length) throw new Error('OEB catalog has no recognized service-area archive');
  return {
    sourceUrl: releases[0].url.href,
    sourceDate: releases[0].sourceDate,
    catalogUrl: OEB_BOUNDARY_CATALOG,
  };
}

async function download(fetcher, url, type, maxBytes) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 20000);
  try {
    const response = await fetcher(url, { signal: abort.signal });
    if (!response.ok) throw new Error('OEB boundary request returned HTTP ' + response.status);
    if (response.url && new URL(response.url).hostname !== 'www.oeb.ca')
      throw new Error('Unexpected boundary source redirect');
    if (Number(response.headers.get('content-length')) > maxBytes)
      throw new Error('Boundary source exceeds expected size');
    const content =
      type === 'text' ? await response.text() : new Uint8Array(await response.arrayBuffer());
    if (content.length > maxBytes) throw new Error('Boundary source exceeds expected size');
    return { content, lastModified: response.headers.get('last-modified') };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchOebBoundaryArchive(fetcher = fetch) {
  const catalog = await download(fetcher, OEB_BOUNDARY_CATALOG, 'text', 500000);
  const release = discoverOebBoundaryRelease(catalog.content);
  const archive = await download(fetcher, release.sourceUrl, 'bytes', 20000000);
  return {
    ...release,
    provider: 'Ontario Energy Board',
    checkedAt: new Date().toISOString(),
    sourceUpdatedAt: archive.lastModified,
    bytes: archive.content,
  };
}
