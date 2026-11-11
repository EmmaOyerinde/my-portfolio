'use strict';
(() => {
  const $ = (s) => document.querySelector(s),
    root = document.documentElement,
    media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false,
    visible = true,
    wireVisible = true,
    hover = false,
    frame = 0,
    last = 0,
    lastGlobe = 0,
    index = 0,
    articles = [],
    health = {},
    pendingNews = null,
    offset = 0,
    loopWidth = 0,
    positions = [];
  const ribbon = $('.wire-ribbon'),
    viewport = $('#wire-viewport'),
    group = $('#wire-group'),
    track = $('#wire-track');
  const reduced = () => media.matches || root.dataset.reduceMotion === 'true';
  const stopped = () => paused || reduced();
  const readingWire = () => hover || ribbon.contains(document.activeElement);
  function sync() {
    root.dataset.motionPaused = String(stopped());
    root.dataset.pageHidden = String(document.hidden);
    document.querySelectorAll('.motion-toggle').forEach((b) => {
      b.setAttribute('aria-pressed', String(stopped()));
      b.disabled = reduced();
      b.setAttribute(
        'aria-label',
        reduced()
          ? 'Motion reduced by your preferences'
          : paused
            ? 'Resume site motion'
            : 'Pause site motion',
      );
      b.textContent = b.closest('.wire-controls')
        ? stopped()
          ? '▶'
          : 'Ⅱ'
        : reduced()
          ? 'Motion reduced'
          : paused
            ? 'Resume motion ▶'
            : 'Pause motion Ⅱ';
    });
    if ($('#globe-state'))
      $('#globe-state').textContent = stopped() ? 'Still view' : 'Slow rotation';
    flushNews();
    draw();
    start();
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('.motion-toggle')) {
      paused = !paused;
      sync();
    }
  });
  function measure() {
    viewport.style.setProperty('--wire-view-width', viewport.clientWidth + 'px');
    loopWidth = group.getBoundingClientRect().width;
    positions = [...group.children].map((child) => child.offsetLeft);
    if (loopWidth > 0) {
      offset = viewport.scrollLeft % loopWidth;
      viewport.scrollLeft = offset;
    }
    updatePosition();
  }
  function updatePosition() {
    if (!articles.length) return;
    let next = 0;
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] <= offset + 3) next = i;
      else break;
    }
    index = next;
    const label =
      String(index + 1).padStart(2, '0') + ' / ' + String(articles.length).padStart(2, '0');
    if ($('#wire-position').textContent !== label) $('#wire-position').textContent = label;
  }
  function headlineItem(a, i, copy = false) {
    const link = document.createElement('a');
    link.className = 'wire-item';
    link.href = a.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.headlineIndex = String(i);
    if (copy) {
      link.tabIndex = -1;
      link.setAttribute('aria-hidden', 'true');
    }
    const title = document.createElement('strong');
    title.textContent = a.title;
    const meta = document.createElement('span');
    meta.textContent = `${a.publisher} · ${new Date(a.publishedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })} · ${health[a.source]?.state === 'live' ? 'feed connected' : 'saved headline'}`;
    const divider = document.createElement('i');
    divider.textContent = '✦';
    divider.setAttribute('aria-hidden', 'true');
    link.append(title, meta, divider);
    return link;
  }
  function renderNews(incoming) {
    const current = articles[index]?.url,
      within = offset - (positions[index] || 0);
    health = incoming.health || {};
    articles = incoming.articles.slice(0, 12).filter((a) => {
      try {
        const u = new URL(a.url);
        return (
          u.protocol === 'https:' &&
          ['www.canada.ca', 'canada.ca'].includes(u.hostname) &&
          !u.port &&
          !u.username &&
          !u.password &&
          typeof a.title === 'string' &&
          Number.isFinite(Date.parse(a.publishedAt))
        );
      } catch {
        return false;
      }
    });
    if (!articles.length) {
      const link = document.createElement('a');
      link.className = 'wire-item';
      link.href = '#news';
      link.textContent = incoming.loading
        ? 'Checking official news sources…'
        : 'Headlines are temporarily unavailable. Open the news desk to retry.';
      group.replaceChildren(link);
      track.querySelector('.wire-copy')?.remove();
      positions = [];
      loopWidth = 0;
      offset = 0;
      viewport.scrollLeft = 0;
      $('#wire-position').textContent = '00 / 00';
      return;
    }
    index = Math.max(
      0,
      articles.findIndex((a) => a.url === current),
    );
    group.replaceChildren(...articles.map((a, i) => headlineItem(a, i)));
    track.querySelector('.wire-copy')?.remove();
    const copy = document.createElement('div');
    copy.className = 'wire-group wire-copy';
    copy.setAttribute('aria-hidden', 'true');
    copy.append(...articles.map((a, i) => headlineItem(a, i, true)));
    track.append(copy);
    loopWidth = group.getBoundingClientRect().width;
    positions = [...group.children].map((child) => child.offsetLeft);
    offset = (positions[index] || 0) + (current === articles[index]?.url ? Math.max(0, within) : 0);
    viewport.scrollLeft = offset;
    updatePosition();
    start();
  }
  function flushNews() {
    if (pendingNews && !readingWire()) {
      const data = pendingNews;
      pendingNews = null;
      renderNews(data);
    }
  }
  function stepHeadline(step) {
    if (!articles.length) return;
    index = (index + step + articles.length) % articles.length;
    offset = positions[index] || 0;
    viewport.scrollLeft = offset;
    const label =
      String(index + 1).padStart(2, '0') + ' / ' + String(articles.length).padStart(2, '0');
    if ($('#wire-position').textContent !== label) $('#wire-position').textContent = label;
  }
  $('#wire-prev').onclick = () => stepHeadline(-1);
  $('#wire-next').onclick = () => stepHeadline(1);
  ribbon.addEventListener('pointerenter', () => (hover = true));
  ribbon.addEventListener('pointerleave', () => {
    hover = false;
    offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
    flushNews();
    start();
  });
  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      paused = true;
      sync();
    }
  });
  viewport.addEventListener('focusin', (e) => {
    const item = e.target.closest('.wire-item');
    if (item) {
      index = Number(item.dataset.headlineIndex) || 0;
      offset = positions[index] || 0;
      viewport.scrollLeft = offset;
      updatePosition();
    }
  });
  ribbon.addEventListener('focusout', () =>
    queueMicrotask(() => {
      offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
      flushNews();
      start();
    }),
  );
  viewport.addEventListener(
    'scroll',
    () => {
      if (stopped() || readingWire()) {
        offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
        updatePosition();
      }
    },
    { passive: true },
  );
  const wireSize = new ResizeObserver(measure);
  wireSize.observe(group);
  wireSize.observe(viewport);
  document.addEventListener('eo:news', (e) => {
    const incoming = e.detail;
    $('#wire-status').textContent = incoming.live
      ? `${incoming.live} official ${incoming.live === 1 ? 'feed' : 'feeds'} connected`
      : incoming.loading
        ? 'Checking official feeds'
        : incoming.articles?.length
          ? 'Saved headlines · not live'
          : 'Feeds unavailable';
    ribbon.dataset.live = String(incoming.live > 0);
    if (!Array.isArray(incoming.articles)) return;
    if (readingWire()) pendingNews = incoming;
    else renderNews(incoming);
  });
  const canvas = $('#connected-globe');
  let ctx;
  try {
    ctx = canvas?.getContext('2d');
  } catch {}
  let rings = [],
    dots = [],
    angle = (-95 * Math.PI) / 180,
    size = 400,
    ready = false,
    drag = null;
  const tilt = (23 * Math.PI) / 180;
  const vector = ([lng, lat]) => {
    lng *= Math.PI / 180;
    lat *= Math.PI / 180;
    return [Math.cos(lat) * Math.cos(lng), Math.cos(lat) * Math.sin(lng), Math.sin(lat)];
  };
  function project(v) {
    const x = v[1] * Math.cos(angle) - v[0] * Math.sin(angle),
      z = v[0] * Math.cos(angle) + v[1] * Math.sin(angle);
    return [
      x,
      v[2] * Math.cos(tilt) - z * Math.sin(tilt),
      v[2] * Math.sin(tilt) + z * Math.cos(tilt),
    ];
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
  function draw() {
    if (!ctx || !ready) return;
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
  function start() {
    if (frame || stopped() || document.hidden || (!visible && !wireVisible)) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }
  function tick(t) {
    frame = 0;
    if (stopped() || document.hidden || (!visible && !wireVisible)) return;
    const dt = last ? Math.min(t - last, 64) : 0;
    last = t;
    const globeRunning = visible && ready && !drag,
      wireRunning = wireVisible && !readingWire() && articles.length > 0 && loopWidth > 0;
    if (globeRunning) {
      angle += dt * 0.000045;
      if (t - lastGlobe >= 32) {
        draw();
        lastGlobe = t;
      }
    }
    if (wireRunning) {
      offset = (offset + dt * 0.022) % loopWidth;
      viewport.scrollLeft = offset;
      updatePosition();
    }
    if (globeRunning || wireRunning) frame = requestAnimationFrame(tick);
  }
  if (ctx) {
    fetch('assets/globe-land.json', { signal: AbortSignal.timeout(12000) })
      .then((r) => {
        if (!r.ok) throw Error('Globe unavailable');
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data.rings) || data.rings.length > 500) throw Error('Invalid globe');
        rings = data.rings.map((r) => r.map(vector));
        dots = (data.dots || []).map(vector);
        ready = true;
        canvas.dataset.ready = 'true';
        resize();
        sync();
      })
      .catch(() => {
        canvas.hidden = true;
        $('#globe-help').textContent = 'World view · NASA background image';
      });
    new ResizeObserver(resize).observe(canvas);
    canvas.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, start: angle };
      canvas.setPointerCapture?.(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      angle = drag.start - (e.clientX - drag.x) * 0.008;
      draw();
    });
    const finish = () => {
      if (drag) {
        drag = null;
        paused = true;
        sync();
      }
    };
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      paused = true;
      angle += e.key === 'ArrowLeft' ? -0.15 : 0.15;
      draw();
      sync();
    });
  }
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    start();
  }).observe(canvas);
  new IntersectionObserver((entries) => {
    wireVisible = entries.some((e) => e.isIntersecting);
    start();
  }).observe(ribbon);
  new MutationObserver(sync).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-reduce-motion'],
  });
  media.addEventListener?.('change', sync);
  document.addEventListener('eo:tab', sync);
  document.addEventListener('visibilitychange', () => {
    root.dataset.pageHidden = String(document.hidden);
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else start();
  });
  sync();
})();
