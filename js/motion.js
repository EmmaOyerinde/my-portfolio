'use strict';
(() => {
  const $ = (s) => document.querySelector(s),
    root = document.documentElement,
    media = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true,
    wireVisible = true,
    hover = false,
    wireTouching = false,
    wireTouchHold = false,
    touchTimer,
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
  const readingWire = () =>
    hover || wireTouching || wireTouchHold || ribbon.contains(document.activeElement);
  function sync() {
    root.dataset.pageHidden = String(document.hidden);
    if ($('#globe-state'))
      $('#globe-state').textContent = !globe
        ? 'World view'
        : reduced()
          ? 'Still view'
          : 'Continuous rotation';
    canvas?.setAttribute(
      'aria-label',
      `${reduced() ? 'Globe' : 'Rotating globe'}. Use left and right arrow keys to turn it.`,
    );
    if (reduced()) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    flushNews();
    draw();
    start();
  }
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
  ribbon.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') hover = true;
  });
  ribbon.addEventListener('pointerleave', () => {
    hover = false;
    offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
    flushNews();
    start();
  });
  function releaseWireAfterTouch() {
    clearTimeout(touchTimer);
    wireTouchHold = true;
    touchTimer = setTimeout(() => {
      if (wireTouching) return;
      wireTouchHold = false;
      offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
      flushNews();
      start();
    }, 1800);
  }
  viewport.addEventListener(
    'pointerdown',
    (event) => {
      if (event.pointerType === 'touch') {
        wireTouching = true;
        clearTimeout(touchTimer);
      }
    },
    { passive: true },
  );
  function finishWireTouch(event) {
    if (!wireTouching || (event && event.pointerType !== 'touch')) return;
    wireTouching = false;
    releaseWireAfterTouch();
  }
  document.addEventListener('pointerup', finishWireTouch, { passive: true });
  document.addEventListener('pointercancel', finishWireTouch, { passive: true });
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
      if (reduced() || readingWire()) {
        offset = loopWidth ? viewport.scrollLeft % loopWidth : viewport.scrollLeft;
        updatePosition();
        if (wireTouching || wireTouchHold) releaseWireAfterTouch();
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
  const globe = canvas ? window.EOGlobe.create(canvas) : null;
  const fullTurn = Math.PI * 2;
  let angle = (-95 * Math.PI) / 180,
    drag = null;
  const normalizeAngle = (value) => ((value % fullTurn) + fullTurn) % fullTurn;
  const draw = () => globe?.draw(angle);
  function start() {
    if (frame || reduced() || document.hidden || (!visible && !wireVisible)) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }
  function tick(t) {
    frame = 0;
    if (reduced() || document.hidden || (!visible && !wireVisible)) return;
    const dt = last ? Math.min(t - last, 64) : 0;
    last = t;
    const globeRunning = visible && globe && !drag,
      wireRunning = wireVisible && !readingWire() && articles.length > 0 && loopWidth > 0;
    if (globeRunning) {
      angle = normalizeAngle(angle + dt * 0.000045);
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
  if (globe) {
    // The outline renders immediately and remains usable if the land asset cannot load.
    globe.resize();
    canvas.dataset.ready = 'true';
    canvas.dataset.detail = 'outline';
    fetch('assets/globe-land.json', { signal: AbortSignal.timeout(12000) })
      .then((response) => {
        if (!response.ok) throw Error('Globe unavailable');
        return response.json();
      })
      .then((data) => {
        globe.setGeometry(data);
        canvas.dataset.detail = 'land';
        draw();
      })
      .catch(() => {
        canvas.dataset.detail = 'outline';
        draw();
      });
    new ResizeObserver(() => globe.resize()).observe(canvas);
    canvas.addEventListener('pointerdown', (event) => {
      if (event.isPrimary === false || event.button > 0) return;
      drag = { id: event.pointerId, x: event.clientX, start: angle };
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      angle = normalizeAngle(drag.start - (event.clientX - drag.x) * 0.008);
      draw();
    });
    function finishDrag(event) {
      if (!drag || (event && event.pointerId !== drag.id)) return;
      drag = null;
      start();
    }
    canvas.addEventListener('pointerup', finishDrag);
    canvas.addEventListener('pointercancel', finishDrag);
    canvas.addEventListener('lostpointercapture', finishDrag);
    window.addEventListener('blur', () => finishDrag());
    canvas.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      angle = normalizeAngle(angle + (event.key === 'ArrowLeft' ? -0.15 : 0.15));
      draw();
      start();
    });
  }
  if (!globe) {
    canvas.hidden = true;
    $('#globe-static').hidden = false;
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
  window.addEventListener('blur', () => {
    hover = false;
    finishWireTouch();
  });
  document.addEventListener('visibilitychange', () => {
    root.dataset.pageHidden = String(document.hidden);
    if (document.hidden) {
      drag = null;
      hover = false;
      wireTouching = false;
      wireTouchHold = false;
      clearTimeout(touchTimer);
      cancelAnimationFrame(frame);
      frame = 0;
    } else start();
  });
  sync();
})();
