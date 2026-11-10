/** Public NRCan RCED adapter. No key, proxy or fixed edition URL is required. */
export const RCED_CATALOGUE_SEARCH =
  'https://open.canada.ca/data/api/action/package_search?q=%22Remote%20Communities%20Energy%20Database%22&rows=25&sort=metadata_modified%20desc';
const REQUIRED = [
  'Community_Name',
  'Province_Territory',
  'Primary_Electricity_Source',
  'Electricity_Service_Provider',
  'Population',
  'Annual_System_Total_Electricity',
];
const TEXT_FIELDS = [
  'Community_Name',
  'Province_Territory',
  'Region',
  'Electricity_Service_Provider',
  'Primary_Electricity_Source',
  'Secondary_Electricity_Source',
  'Is_There_Year_Round_Road_Access',
];
const FIELDS = ['OBJECTID', ...TEXT_FIELDS, 'Population', 'Annual_System_Total_Electricity'];
const clean = (value) =>
  value == null
    ? null
    : String(value)
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .trim() || null;
const optionalNumber = (value) =>
  value == null || value === ''
    ? null
    : Number.isFinite(Number(value)) && Number(value) >= 0
      ? Number(value)
      : null;

export function validateRemoteService(url) {
  const u = new URL(url);
  if (
    u.protocol !== 'https:' ||
    u.hostname !== 'maps-cartes.services.geo.ca' ||
    u.port ||
    u.username ||
    u.password ||
    u.search ||
    u.hash ||
    !/^\/server_serveur\/rest\/services\/NRCan\/remote_communities_\d{4}_en\/MapServer\/?$/.test(
      u.pathname,
    )
  )
    throw new Error('Unexpected NRCan service URL');
  return u.href.replace(/\/$/, '');
}

export function selectRemoteCatalogue(search) {
  if (!search?.success || !Array.isArray(search.result?.results))
    throw new Error('Invalid NRCan catalogue response');
  const candidates = search.result.results.filter(
    (p) =>
      p.state === 'active' &&
      p.organization?.name === 'nrcan-rncan' &&
      /^Remote Communities Energy Database(?: \(\d{4}\))?$/.test(
        p.title_translated?.en || p.title || '',
      ),
  );
  candidates.sort((a, b) => {
    const year = (p) =>
      Number((p.title_translated?.en || p.title || '').match(/\((\d{4})\)/)?.[1] || 0);
    return (
      year(b) - year(a) || String(b.metadata_modified).localeCompare(String(a.metadata_modified))
    );
  });
  for (const record of candidates) {
    const resource = record.resources?.find(
      (r) => r.format === 'ESRI REST' && r.language?.includes('en') && r.state === 'active',
    );
    if (!resource) continue;
    // Fail closed on a changed publisher or URL schema; keep the previous good snapshot.
    const serviceUrl = validateRemoteService(resource.url);
    return { record, resource, serviceUrl };
  }
  throw new Error('No supported current NRCan RCED resource found');
}

export function normalizeRemoteFeature(feature, catalogueId) {
  const p = feature?.properties;
  const coordinates = feature?.geometry?.coordinates;
  if (
    !p ||
    feature.geometry.type !== 'Point' ||
    !Array.isArray(coordinates) ||
    !Number.isFinite(coordinates[0]) ||
    !Number.isFinite(coordinates[1]) ||
    coordinates[0] < -180 ||
    coordinates[0] > 180 ||
    coordinates[1] < -90 ||
    coordinates[1] > 90 ||
    !clean(p.Community_Name) ||
    !clean(p.Province_Territory)
  )
    throw new Error('Malformed RCED community');
  const objectId = p.OBJECTID ?? feature.id;
  if (!Number.isInteger(objectId)) throw new Error('Missing RCED object ID');
  return {
    id: `rced:${catalogueId}:${objectId}`,
    sourceObjectId: objectId,
    name: clean(p.Community_Name),
    province: clean(p.Province_Territory),
    region: clean(p.Region),
    lat: coordinates[1],
    lon: coordinates[0],
    provider: clean(p.Electricity_Service_Provider),
    primarySource: clean(p.Primary_Electricity_Source),
    secondarySource: clean(p.Secondary_Electricity_Source),
    population: optionalNumber(p.Population),
    annualSystemGenerationMWh: optionalNumber(p.Annual_System_Total_Electricity),
    roadAccess:
      p.Is_There_Year_Round_Road_Access === 'Y'
        ? true
        : p.Is_There_Year_Round_Road_Access === 'N'
          ? false
          : null,
    observationYear: null,
  };
}

export function remoteMetadata(record, serviceUrl, checkedAt) {
  return {
    id: 'nrcan-rced',
    publisher: 'Natural Resources Canada',
    title: record.title_translated?.en || record.title,
    edition:
      Number((record.title_translated?.en || record.title).match(/\((\d{4})\)/)?.[1]) || null,
    catalogueId: record.id,
    sourceUrl: `https://open.canada.ca/data/en/dataset/${record.id}`,
    serviceUrl,
    checkedAt,
    recordModified: record.metadata_modified || null,
    published: record.date_published || null,
    coverageStart: record.time_period_coverage_start?.slice(0, 10) || null,
    coverageEnd: record.time_period_coverage_end?.slice(0, 10) || null,
    frequency: record.frequency || 'as_needed',
    licence: record.license_title || 'Open Government Licence - Canada',
    licenceUrl: 'https://open.canada.ca/en/open-government-licence-canada',
    limitations:
      'Publication-based inventory; individual population, generation and fuel observation years are not supplied. Regional-grid entries are included. Annual generation may describe shared systems and should not be summed as independent community generation.',
  };
}

export async function fetchRemoteCommunities({
  fetchImpl = fetch,
  checkedAt = new Date().toISOString(),
} = {}) {
  const json = async (url) => {
    const response = await fetchImpl(url, {
      signal: AbortSignal.timeout(20000),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`NRCan HTTP ${response.status}`);
    const value = await response.json();
    if (value.error) throw new Error('NRCan source returned an error');
    return value;
  };
  const { record, serviceUrl } = selectRemoteCatalogue(await json(RCED_CATALOGUE_SEARCH));
  const service = await json(`${serviceUrl}?f=json`);
  const layer = service.layers?.find(
    (l) =>
      l.type === 'Feature Layer' &&
      l.geometryType === 'esriGeometryPoint' &&
      /^Remote communities by main power source/i.test(l.name),
  );
  if (!layer || !Number.isInteger(layer.id)) throw new Error('NRCan community layer not found');
  const layerUrl = `${serviceUrl}/${layer.id}`;
  const schema = await json(`${layerUrl}?f=json`);
  if (!REQUIRED.every((name) => schema.fields?.some((f) => f.name === name)))
    throw new Error('NRCan schema changed');
  const ids = await json(`${layerUrl}/query?where=1%3D1&returnIdsOnly=true&f=json`);
  if (
    !Array.isArray(ids.objectIds) ||
    !ids.objectIds.length ||
    ids.objectIds.length > 5000 ||
    !ids.objectIds.every(Number.isInteger)
  )
    throw new Error('Invalid NRCan record inventory');
  const uniqueIds = [...new Set(ids.objectIds)].sort((a, b) => a - b);
  const features = [];
  // Batching by object ID is stable even if the service caps record counts or lacks offset paging.
  for (let offset = 0; offset < uniqueIds.length; offset += 500) {
    const params = new URLSearchParams({
      objectIds: uniqueIds.slice(offset, offset + 500).join(','),
      outFields: FIELDS.join(','),
      outSR: '4326',
      returnGeometry: 'true',
      f: 'geojson',
    });
    const page = await json(`${layerUrl}/query?${params}`);
    if (!Array.isArray(page.features) || page.exceededTransferLimit)
      throw new Error('Incomplete NRCan page');
    features.push(...page.features);
  }
  const communities = features.map((f) => normalizeRemoteFeature(f, record.id));
  const returned = new Set(communities.map((c) => c.sourceObjectId));
  if (
    returned.size !== uniqueIds.length ||
    communities.length !== uniqueIds.length ||
    !uniqueIds.every((id) => returned.has(id))
  )
    throw new Error('Incomplete NRCan community set');
  communities.sort((a, b) => a.province.localeCompare(b.province) || a.name.localeCompare(b.name));
  return { schemaVersion: 1, metadata: remoteMetadata(record, serviceUrl, checkedAt), communities };
}
