import { fetchOebBoundaryArchive, parseKmlBoundaries } from '../adapters/boundaries.mjs';
import { unzipSync, strFromU8 } from 'fflate';
import { sourceFetch } from './source-fetch.mjs';
export async function fetchBoundaries(fetcher = sourceFetch) {
  const archive = await fetchOebBoundaryArchive(fetcher);
  const outer = unzipSync(archive.bytes, {
    filter: (file) =>
      file.name.toLowerCase().endsWith('.kmz') && file.originalSize < 12 * 1024 * 1024,
  });
  const candidates = Object.values(outer);
  if (candidates.length !== 1) throw Error('Unexpected OEB archive');
  const inner = unzipSync(candidates[0], {
    filter: (file) =>
      file.name.toLowerCase().endsWith('doc.kml') && file.originalSize < 24 * 1024 * 1024,
  });
  const kml = Object.values(inner);
  if (kml.length !== 1) throw Error('Unexpected OEB KMZ');
  const result = parseKmlBoundaries(strFromU8(kml[0]));
  result.metadata = {
    edition: archive.sourceDate,
    checkedAt: archive.checkedAt,
    sourceUrl: archive.sourceUrl,
    catalogUrl: archive.catalogUrl,
    sourceUpdatedAt: archive.sourceUpdatedAt,
    provider: 'Ontario Energy Board',
    note: 'Publisher names retained, including legacy and split entities; no automatic metric join.',
  };
  return result;
}
