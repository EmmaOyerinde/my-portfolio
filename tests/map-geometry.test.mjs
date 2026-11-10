import test from 'node:test';
import assert from 'node:assert/strict';
import '../js/map-geometry.js';
const square = (a, b, c, d) => [
  [a, b],
  [c, b],
  [c, d],
  [a, d],
  [a, b],
];
const feature = (id, coordinates, type = 'Polygon') => ({
  type: 'Feature',
  properties: { id },
  geometry: { type, coordinates },
});
test('overlap selection favours local parts, preserves polygon holes and deduplicates multipart utilities', () => {
  const index = globalThis.EOGeometry.build({
    features: [
      feature('regional', [square(0, 0, 20, 20)]),
      feature('local', [square(2, 2, 8, 8), square(4, 4, 6, 6)]),
      feature(
        'scattered',
        [[square(2.1, 2.1, 2.8, 2.8)], [square(10, 10, 19, 19)]],
        'MultiPolygon',
      ),
    ],
  });
  assert.deepEqual(EOGeometry.find(index, 2.5, 2.5), ['scattered', 'local', 'regional']);
  assert.deepEqual(EOGeometry.find(index, 5, 5), ['regional']);
  assert.deepEqual(EOGeometry.find(index, 15, 15), ['scattered', 'regional']);
  assert.deepEqual(EOGeometry.find(index, 4, 5), ['regional']);
  assert.deepEqual(EOGeometry.find(index, 2, 3), ['local', 'regional']);
  assert.deepEqual(EOGeometry.find(index, 30, 30), []);
});
