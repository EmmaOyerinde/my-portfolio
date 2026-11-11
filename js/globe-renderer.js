'use strict';
// Canvas geometry and projection, independent of news and interaction state.
(() => {
  function create(canvas, root = document.documentElement) {
    let ctx;
    try {
      ctx = canvas?.getContext('2d');
    } catch {}
    if (!ctx) return null;
    let rings = [],
      dots = [],
      angle = (-95 * Math.PI) / 180,
      size = 400,
      rotationCos = 1,
      rotationSin = 0;
    const tilt = (23 * Math.PI) / 180;
    const tiltCos = Math.cos(tilt),
      tiltSin = Math.sin(tilt);
    const vector = ([lng, lat]) => {
      lng *= Math.PI / 180;
      lat *= Math.PI / 180;
      return [Math.cos(lat) * Math.cos(lng), Math.cos(lat) * Math.sin(lng), Math.sin(lat)];
    };
    function project(v) {
      const x = v[1] * rotationCos - v[0] * rotationSin,
        z = v[0] * rotationCos + v[1] * rotationSin;
      return [x, v[2] * tiltCos - z * tiltSin, v[2] * tiltSin + z * tiltCos];
    }
    function resize() {
      if (!ctx) return;
      size = Math.max(220, Math.min(680, canvas.clientWidth || 400));
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    const graticule = [];
    for (let lat = -60; lat <= 60; lat += 30)
      graticule.push(Array.from({ length: 181 }, (_, i) => vector([-180 + i * 2, lat])));
    for (let lng = -180; lng < 180; lng += 30)
      graticule.push(Array.from({ length: 91 }, (_, i) => vector([lng, -90 + i * 2])));
    function line(points, cx, cy, r) {
      let pen = false;
      ctx.beginPath();
      for (const v of points) {
        const [x, y, z] = project(v);
        if (z <= 0.015) {
          pen = false;
          continue;
        }
        const px = cx + x * r,
          py = cy - y * r;
        if (pen) ctx.lineTo(px, py);
        else {
          ctx.moveTo(px, py);
          pen = true;
        }
      }
      ctx.stroke();
    }
    function draw(nextAngle = angle) {
      angle = nextAngle;
      rotationCos = Math.cos(angle);
      rotationSin = Math.sin(angle);
      const light = root.dataset.theme === 'light',
        c = size / 2,
        r = size * 0.435;
      ctx.clearRect(0, 0, size, size);
      const glow = ctx.createRadialGradient(c, c, r * 0.7, c, c, r * 1.13);
      glow.addColorStop(0, '#249cac00');
      glow.addColorStop(0.75, light ? '#1a869d20' : '#2ec6bd30');
      glow.addColorStop(1, '#249cac00');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);
      const sea = ctx.createRadialGradient(c - r * 0.4, c - r * 0.4, 0, c, c, r);
      sea.addColorStop(0, light ? '#e7f5f0' : '#143e4b');
      sea.addColorStop(0.7, light ? '#c9e3e9' : '#0b2534');
      sea.addColorStop(1, light ? '#accbdc' : '#071622');
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fillStyle = sea;
      ctx.fill();
      ctx.strokeStyle = light ? '#5b8b9e' : '#40839a';
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = light ? '#2d718426' : '#80c6d51b';
      ctx.lineWidth = 0.7;
      for (const linePoints of graticule) line(linePoints, c, c, r);
      ctx.strokeStyle = light ? '#0a7283bb' : '#80d3cabb';
      ctx.lineWidth = 0.85;
      for (const ring of rings) line(ring, c, c, r);
      for (const v of dots) {
        const [x, y, z] = project(v);
        if (z <= 0) continue;
        ctx.globalAlpha = 0.35 + z * 0.6;
        ctx.fillStyle = light ? '#086d79' : '#83dacb';
        ctx.beginPath();
        ctx.arc(c + x * r, c - y * r, size * 0.0021, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    function setGeometry(data) {
      if (
        !data ||
        !Array.isArray(data.rings) ||
        !data.rings.length ||
        data.rings.length > 500 ||
        !Array.isArray(data.dots) ||
        data.dots.length > 5000
      )
        throw Error('Invalid globe geometry');
      let count = 0;
      const point = (value) =>
        Array.isArray(value) &&
        value.length === 2 &&
        Number.isFinite(value[0]) &&
        Number.isFinite(value[1]) &&
        Math.abs(value[0]) <= 180 &&
        Math.abs(value[1]) <= 90;
      for (const ring of data.rings) {
        if (
          !Array.isArray(ring) ||
          ring.length < 3 ||
          (count += ring.length) > 25000 ||
          !ring.every(point)
        )
          throw Error('Invalid globe ring');
      }
      if (!data.dots.every(point)) throw Error('Invalid globe points');
      rings = data.rings.map((ring) => ring.map(vector));
      dots = data.dots.map(vector);
    }
    return Object.freeze({ resize, draw, setGeometry });
  }
  window.EOGlobe = Object.freeze({ create });
})();
