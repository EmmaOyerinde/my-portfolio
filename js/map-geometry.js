'use strict';
// A click can belong to several footprints. Keep holes and prefer the smallest
// containing polygon part, so large regional footprints cannot mask local ones.
(() => {
  function ringContains(ring, x, y) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[i],
        [bx, by] = ring[j];
      const cross = (x - ax) * (by - ay) - (y - ay) * (bx - ax);
      if (
        Math.abs(cross) < 1e-10 &&
        x >= Math.min(ax, bx) &&
        x <= Math.max(ax, bx) &&
        y >= Math.min(ay, by) &&
        y <= Math.max(ay, by)
      )
        return true;
      if (ay > y !== by > y && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) inside = !inside;
    }
    return inside;
  }
  function build(data) {
    return data.features.flatMap((f) => {
      const parts =
        f.geometry.type === 'MultiPolygon'
          ? f.geometry.coordinates
          : f.geometry.type === 'Polygon'
            ? [f.geometry.coordinates]
            : [];
      return parts.map((rings) => {
        let west = Infinity,
          east = -Infinity,
          south = Infinity,
          north = -Infinity,
          area = 0;
        const ring = rings[0];
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = ring[i],
            [nx, ny] = ring[(i + 1) % ring.length];
          west = Math.min(west, x);
          east = Math.max(east, x);
          south = Math.min(south, y);
          north = Math.max(north, y);
          area += x * ny - nx * y;
        }
        return { id: f.properties.id, rings, west, east, south, north, area: Math.abs(area) };
      });
    });
  }
  function find(index, lng, lat) {
    const hits = new Map();
    for (const p of index) {
      if (lng < p.west || lng > p.east || lat < p.south || lat > p.north) continue;
      if (
        !ringContains(p.rings[0], lng, lat) ||
        p.rings.slice(1).some((r) => ringContains(r, lng, lat))
      )
        continue;
      if (!hits.has(p.id) || hits.get(p.id) > p.area) hits.set(p.id, p.area);
    }
    return [...hits].sort((a, b) => a[1] - b[1]).map(([id]) => id);
  }
  globalThis.EOGeometry = { build, find, ringContains };
})();
