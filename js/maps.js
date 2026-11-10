'use strict';
(() => {
  const db = window.PORTFOLIO_DATA,
    D = window.EOData,
    L = window.L;
  if (!db) return;
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const esc = window.EOUI.escapeHTML;
  const fmt = (n) =>
    n === null || n === undefined
      ? 'Not reported'
      : Number(n).toLocaleString('en-CA', { maximumFractionDigits: 2 });
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced =
    motionPreference.matches || document.documentElement.dataset.reduceMotion === 'true';
  const maps = {},
    states = {},
    bases = {};
  let active = 'reliability',
    selected = new URLSearchParams(location.search).get('utility') || 'toronto-hydro',
    metric = 'customers';
  let boundaries = db.utilitiesGeoJSON;
  let fullBoundaries = false;
  let boundaryRequest;
  let hitIndex = EOGeometry.build(boundaries),
    compareMode = false;
  const params = new URLSearchParams(location.search),
    defaultBase = 'dark';
  const requestedBase = ['dark', 'light', 'street', 'satellite'].includes(params.get('base'))
    ? params.get('base')
    : null;
  const requestedView = ['reliability', 'forecast', 'deficit', 'offgrid'].includes(
    params.get('view'),
  )
    ? params.get('view')
    : 'reliability';
  function national(map) {
    map.setView([57, -96], 3, { animate: !reduced });
  }
  function metricValue(id) {
    return metric === 'customers' ? D.customer(id)?.count : D.utility(id)?.[metric];
  }
  function color(value) {
    if (metric === 'customers' && value != null)
      value = value < 100000 ? 0.5 : value < 500000 ? 1.5 : 2;
    const light = ['light', 'street'].includes(states.reliability?.base);
    return value == null
      ? light
        ? '#665695'
        : '#b5a2d8'
      : value < 1
        ? light
          ? '#007865'
          : '#59d3b4'
        : value <= 1.8
          ? light
            ? '#986100'
            : '#edc56a'
          : light
            ? '#bb3650'
            : '#ff889e';
  }
  function createBase(name) {
    const options = {
      maxZoom: 18,
      attribution:
        name === 'street'
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          : name === 'satellite'
            ? 'Esri, Vantor, Earthstar Geographics, GIS community'
            : 'Esri, HERE, Garmin, &copy; OpenStreetMap contributors, GIS community',
      crossOrigin: false,
    };
    return L.tileLayer(
      name === 'street'
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        : name === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${name === 'light' ? 'Light' : 'Dark'}_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
      options,
    );
  }
  function setBase(name, key) {
    const map = maps[name];
    if (!map) return;
    if (bases[name]) map.removeLayer(bases[name]);
    if (states[name].reference) {
      map.removeLayer(states[name].reference);
      states[name].reference = null;
    }
    let errorShown = false;
    const layer = createBase(key);
    bases[name] = layer;
    states[name].base = key;
    layer.on('tileerror', () => {
      if (errorShown) return;
      errorShown = true;
      const stage = $(`[data-map-stage="${name}"]`);
      let note = stage.querySelector('.map-error');
      if (!note) {
        note = document.createElement('div');
        note.className = 'map-error';
        stage.append(note);
      }
      note.textContent =
        'Some background tiles are unavailable. Try another basemap; the data layers and lists remain available.';
    });
    layer.on('tileload', () => {
      const note = $(`[data-map-stage="${name}"] .map-error`);
      if (note) note.remove();
    });
    layer.addTo(map);
    if (key === 'dark' || key === 'light')
      states[name].reference = L.tileLayer(
        `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${key === 'light' ? 'Light' : 'Dark'}_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
        { pane: 'reference-labels', maxZoom: 18, interactive: false },
      ).addTo(map);
    document.dispatchEvent(new CustomEvent('eo:mapstate'));
  }
  function tools(name) {
    const holder = $(`[data-map-tools="${name}"]`);
    holder.innerHTML = `<button class="map-focus" data-national="${name}" aria-label="Reset ${name} map to Canada">Reset view</button><label>Basemap<select data-basemap="${name}" aria-label="${name} basemap"><option value="dark">Dark map</option><option value="light">Light map</option><option value="street">Street map</option><option value="satellite">Satellite</option></select></label>${name === 'reliability' ? '<label>Region<select id="map-region" aria-label="Focus map region"><option value="canada">Canada</option><option value="ontario">Ontario utilities</option><option value="gta">Greater Toronto</option><option value="west">Western Canada</option><option value="atlantic">Atlantic Canada</option></select></label><label>Metric<select id="map-metric" aria-label="Map reliability metric"><option value="customers">Customer base · Canada</option><option value="saidi">SAIDI · OEB method</option><option value="saifi">SAIFI · OEB method</option></select></label>' : ''}${name === 'reliability' ? '<label class="official-layer-control"><input type="checkbox" id="official-boundaries"> OEB boundary layer</label>' : ''}<button data-expand="${name}" aria-label="Expand ${name} map" title="Expand map">Expand</button>`;
    const select = holder.querySelector('[data-basemap]');
    select.value = states[name].base;
    select.onchange = () => {
      states[name].customBase = true;
      setBase(name, select.value);
      if (name === 'reliability') drawReliability(false);
    };
    holder.querySelector('[data-national]').onclick = () => national(maps[name]);
    holder.querySelector('[data-expand]').onclick = () => expand(name);
    if (name === 'reliability') {
      $('#official-boundaries').onchange = toggleOfficial;
      $('#map-metric').onchange = (e) => {
        metric = e.target.value;
        drawReliability(false);
      };
      $('#map-region').onchange = (e) => {
        const views = {
          canada: [57, -96, 3],
          ontario: [48, -84, 5],
          gta: [43.8, -79.5, 8],
          west: [53, -120, 4],
          atlantic: [47, -62, 5],
        };
        const [lat, lng, zoom] = views[e.target.value];
        maps.reliability.setView([lat, lng], zoom, { animate: !reduced });
      };
    }
  }
  function expand(name) {
    const stage = $(`[data-map-stage="${name}"]`);
    const expanded = stage.classList.toggle('is-expanded');
    document.body.style.overflow = expanded ? 'hidden' : '';
    if (expanded) {
      stage.setAttribute('role', 'dialog');
      stage.setAttribute('aria-modal', 'true');
      stage.setAttribute('aria-label', 'Expanded ' + name + ' map');
      stage._inert = [];
      let child = stage;
      while (child.parentElement && child !== document.body) {
        for (const sibling of child.parentElement.children)
          if (sibling !== child && !sibling.inert) {
            sibling.inert = true;
            stage._inert.push(sibling);
          }
        child = child.parentElement;
      }
    } else {
      stage.removeAttribute('role');
      stage.removeAttribute('aria-modal');
      for (const sibling of stage._inert || []) sibling.inert = false;
      stage._inert = [];
    }
    const b = stage.querySelector('[data-expand]');
    b.setAttribute('aria-label', `${expanded ? 'Close expanded' : 'Expand'} ${name} map`);
    b.textContent = expanded ? 'Close' : 'Expand';
    b.focus();
    setTimeout(() => maps[name]?.invalidateSize(), 50);
  }
  document.addEventListener('keydown', (e) => {
    const stage = $('.map-stage.is-expanded');
    if (e.key === 'Tab' && stage) {
      const f = [...stage.querySelectorAll('button,select,input,a[href],[tabindex="0"]')].filter(
        (n) => !n.disabled,
      );
      if (
        f.length &&
        ((e.shiftKey && document.activeElement === f[0]) ||
          (!e.shiftKey && document.activeElement === f.at(-1)))
      ) {
        e.preventDefault();
        (e.shiftKey ? f.at(-1) : f[0]).focus();
      }
    }
    if (e.key === 'Escape') $$('.map-stage.is-expanded').forEach((s) => expand(s.dataset.mapStage));
  });
  function init(name) {
    if (maps[name]) {
      maps[name].invalidateSize();
      return maps[name];
    }
    const node = $('#map-' + name);
    if (!node) return;
    if (!L) {
      node.innerHTML =
        '<p class="empty-state">The map library could not load. The lists and charts are still available.</p>';
      return;
    }
    const map = L.map(node, {
      preferCanvas: true,
      zoomControl: false,
      scrollWheelZoom: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      fadeAnimation: !reduced,
      zoomAnimation: !reduced,
      markerZoomAnimation: !reduced,
    });
    maps[name] = map;
    map.createPane('reference-labels');
    map.getPane('reference-labels').style.zIndex = 450;
    map.getPane('reference-labels').style.pointerEvents = 'none';
    const initialBase = name === requestedView && requestedBase ? requestedBase : defaultBase;
    states[name] = { base: initialBase };
    national(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    tools(name);
    setBase(name, initialBase);
    new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(node);
    if (name === 'reliability') {
      createInspector();
      drawReliability(false);
      loadBoundaries();
    }
    if (name === 'forecast') drawForecast();
    if (name === 'deficit') {
      drawDeficit();
      new IntersectionObserver((entries) => {
        node.dataset.motionVisible = String(entries.some((e) => e.isIntersecting));
      }).observe(node);
    }
    if (name === 'offgrid') drawOffgrid();
    return map;
  }
  function reliableStyle(f) {
    const p = f.properties,
      r = D.utility(p.id),
      chosen = p.id === selected;
    return {
      color: chosen
        ? ['light', 'street'].includes(states.reliability?.base)
          ? '#104fb2'
          : '#b4e6ff'
        : color(metricValue(p.id)),
      weight: chosen ? 3.5 : 1.25,
      opacity: chosen ? 1 : 0.9,
      fillColor: color(metricValue(p.id)),
      fillOpacity: chosen ? 0.4 : p.type_org === 'provincial' ? 0.07 : 0.25,
    };
  }
  function createInspector() {
    const stage = $('[data-map-stage="reliability"]');
    if ($('#map-inspector')) return;
    const dock = document.createElement('div');
    dock.id = 'map-inspector';
    dock.className = 'map-inspector';
    dock.innerHTML =
      '<div class="inspector-heading"><div><span class="eyebrow">YOUR SELECTION</span><strong id="map-selection-name"></strong><span id="map-selection-fact"></span></div><span class="selection-mark" aria-hidden="true">↗</span></div><p id="map-interaction-hint">Select a footprint to inspect it, or choose a utility from the list to zoom.</p><div id="map-overlaps" class="map-overlaps" hidden></div><div class="inspector-actions"><button id="map-focus-selection">Zoom to area ↗</button><button id="map-profile-selection">Full profile ↓</button><button id="map-compare-selection" aria-pressed="false">Compare an area ＋</button><button id="map-source-selection">Explore source ↗</button></div><span id="map-selection-announcement" class="sr-only" role="status"></span>';
    stage.append(dock);
    $('#map-focus-selection').onclick = () => focusUtility(selected, true);
    $('#map-profile-selection').onclick = () => {
      if (stage.classList.contains('is-expanded')) expand('reliability');
      const panel = $('#utility-metrics');
      panel.tabIndex = -1;
      panel.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      panel.focus({ preventScroll: true });
    };
    $('#map-source-selection').onclick = () => {
      if (stage.classList.contains('is-expanded')) expand('reliability');
      window.EOSources?.openUtility(selected);
    };
    $('#map-compare-selection').onclick = () => {
      compareMode = !compareMode;
      updateInspector();
    };
    updateInspector();
  }
  function updateInspector() {
    const p = D.profile(selected);
    if (!p || !$('#map-selection-name')) return;
    $('#map-selection-name').textContent = p.name;
    $('#map-selection-fact').textContent =
      D.customerLabel(selected) +
      ' customers · ' +
      p.customer.period +
      ' | ' +
      (p.type === 'context'
        ? `${p.balance?.regionName || p.region} · ${p.period} regional electricity context`
        : `${fmt(p.saidi)} hours per customer · ${p.period} · ${p.type === 'oeb' ? 'OEB adjusted annual measure' : 'utility report'}`);
    $('#map-compare-selection').setAttribute('aria-pressed', String(compareMode));
    $('#map-compare-selection').textContent = compareMode
      ? 'Cancel comparison ×'
      : 'Compare an area ＋';
    $('#map-interaction-hint').textContent = compareMode
      ? 'Choose a second area on the map. The comparison appears below.'
      : 'Select a footprint to inspect it, or choose a utility from the list to zoom.';
  }
  function chooseUtility(id) {
    if (compareMode) {
      if (id === selected) {
        $('#map-interaction-hint').textContent =
          'Choose a different area to compare with this one.';
        return;
      }
      $('#compare-utility').value = id;
      $('#compare-utility').dispatchEvent(new Event('change'));
      compareMode = false;
      updateInspector();
      $('#map-interaction-hint').textContent =
        'Comparison ready below the profile. Different reporting methods are clearly marked.';
      $('#map-selection-announcement').textContent = 'Comparison added: ' + D.profile(id).name;
      return;
    }
    window.EOApp?.selectUtility(id);
    $('#map-selection-announcement').textContent =
      D.profile(id)?.name + ' selected. Summary updated.';
  }
  function selectAt(latlng, fallback) {
    const hits = EOGeometry.find(hitIndex, latlng.lng, latlng.lat);
    if (!hits.length && fallback) hits.push(fallback);
    if (!hits.length) return;
    const holder = $('#map-overlaps');
    holder.replaceChildren();
    holder.hidden = hits.length < 2;
    if (hits.length > 1) {
      const label = document.createElement('span');
      label.textContent = 'Overlapping footprints here:';
      holder.append(label);
      for (const id of hits) {
        const button = document.createElement('button');
        button.textContent = D.profile(id)?.name || id;
        button.onclick = () => chooseUtility(id);
        holder.append(button);
      }
    }
    chooseUtility(hits[0]);
  }
  function drawReliability(focus = false) {
    const map = maps.reliability;
    if (!map) return;
    const state = states.reliability;
    if (state.layer) map.removeLayer(state.layer);
    if (state.targets) map.removeLayer(state.targets);
    state.byId = {};
    state.targets = L.layerGroup().addTo(map);
    // Provincial shapes are painted first. Exact hit testing still resolves every overlap.
    const ordered = {
      ...boundaries,
      features: [...boundaries.features].sort(
        (a, b) =>
          Number(b.properties.type_org === 'provincial') -
          Number(a.properties.type_org === 'provincial'),
      ),
    };
    state.layer = L.geoJSON(ordered, {
      smoothFactor: 0.5,
      style: reliableStyle,
      onEachFeature: (f, layer) => {
        const p = f.properties;
        state.byId[p.id] = layer;
        layer.bindTooltip(esc(p.utility) + ' · ' + esc(D.customerLabel(p.id)) + ' customers', {
          sticky: true,
          className: 'geo-label',
        });
        layer.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          selectAt(e.latlng, p.id);
        });
        layer.on('mouseover', () => layer.setStyle({ weight: 3, fillOpacity: 0.38 }));
        layer.on('mousemove', (e) => {
          if (Date.now() - (state.hoverAt || 0) < 90) return;
          state.hoverAt = Date.now();
          const id = EOGeometry.find(hitIndex, e.latlng.lng, e.latlng.lat)[0] || p.id;
          layer.setTooltipContent(
            esc(D.profile(id)?.name || p.utility) + ' · ' + esc(D.customerLabel(id)) + ' customers',
          );
          if (state.hoverLayer && state.hoverLayer !== state.byId[id])
            state.hoverLayer.setStyle(reliableStyle(state.hoverLayer.feature));
          state.hoverLayer = state.byId[id];
          state.hoverLayer?.setStyle({ weight: 3, fillOpacity: 0.38 });
        });
        layer.on('mouseout', () => {
          layer.setStyle(reliableStyle(f));
          if (state.hoverLayer) state.hoverLayer.setStyle(reliableStyle(state.hoverLayer.feature));
          state.hoverLayer = null;
        });
        const bounds = layer.getBounds();
        if (p.type_org !== 'provincial') {
          const target = L.circleMarker(bounds.getCenter(), {
            radius: 6,
            color: color(metricValue(p.id)),
            weight: 2,
            fillOpacity: 0.8,
            fillColor: color(metricValue(p.id)),
          })
            .bindTooltip(esc(p.utility), { className: 'geo-label' })
            .addTo(state.targets);
          target.on('click', () => {
            $('#map-overlaps').hidden = true;
            chooseUtility(p.id);
          });
        }
      },
    }).addTo(map);
    $('#legend-reliability').innerHTML =
      metric === 'customers'
        ? `<span><i style="background:${color(50000)}"></i> Under 100k</span><span><i style="background:${color(250000)}"></i> 100k–500k</span><span><i style="background:${color(1000000)}"></i> 500k+</span><small>Customer accounts · mixed reporting periods · reference estimates labelled in profiles</small><small class="boundary-status">${fullBoundaries ? 'Detailed geographic footprints' : 'Loading detailed geographic footprints…'}</small>`
        : `<span><i style="background:${color(0.5)}"></i> &lt; 1</span><span><i style="background:${color(1.5)}"></i> 1–1.8</span><span><i style="background:${color(2)}"></i> &gt; 1.8</span><small>${metric === 'saidi' ? 'SAIDI · outage hours' : 'SAIFI · interruptions'} · OEB annual data</small><span><i style="background:${color(null)}"></i> Report / regional context</span><small class="boundary-status">${fullBoundaries ? 'Detailed geographic footprints' : 'Loading detailed geographic footprints…'}</small>`;
    const toggleTargets = () => {
      if (map.getZoom() >= 8) {
        if (map.hasLayer(state.targets)) map.removeLayer(state.targets);
      } else if (!map.hasLayer(state.targets)) state.targets.addTo(map);
    };
    if (state.zoomHandler) map.off('zoomend', state.zoomHandler);
    state.zoomHandler = toggleTargets;
    map.on('zoomend', toggleTargets);
    toggleTargets();
    focusUtility(selected, false);
  }
  function focusUtility(id, focus = true) {
    const previous = selected;
    selected = id;
    const state = states.reliability;
    if (!state) return;
    for (const key of new Set([previous, selected])) {
      const target = state.byId[key];
      if (target) target.setStyle(reliableStyle(target.feature));
    }
    const layer = state.byId[id];
    updateInspector();
    if (!layer) return;
    layer.bringToFront();
    if (focus)
      maps.reliability.stop().fitBounds(layer.getBounds(), {
        padding: [35, 35],
        maxZoom: 12,
        animate: !reduced,
        duration: 0.65,
      });
  }
  async function loadBoundaries() {
    if (boundaryRequest) return boundaryRequest;
    boundaryRequest = (async () => {
      try {
        let d;
        const plain = async () => {
          const r = await fetch('data/utility-territories.geojson', {
            signal: AbortSignal.timeout(25000),
          });
          if (!r.ok) throw Error('Unavailable');
          return r.json();
        };
        if ('DecompressionStream' in window) {
          try {
            const r = await fetch('data/utility-territories.geojson.gz', {
              signal: AbortSignal.timeout(20000),
            });
            if (!r.ok) throw Error('Unavailable');
            const bytes = await r.arrayBuffer();
            if (bytes.byteLength < 2) throw Error('Empty geometry');
            const signature = new Uint8Array(bytes, 0, 2);
            d =
              signature[0] === 31 && signature[1] === 139
                ? await new Response(
                    new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')),
                  ).json()
                : JSON.parse(new TextDecoder().decode(bytes));
            if (d.type !== 'FeatureCollection' || d.features.length !== 93)
              throw Error('Invalid detail');
          } catch {
            d = await plain();
          }
        } else d = await plain();
        if (d.type !== 'FeatureCollection' || d.features.length !== 93)
          throw Error('Invalid boundary dataset');
        boundaries = d;
        hitIndex = EOGeometry.build(d);
        fullBoundaries = true;
        drawReliability(false);
        $('[data-retry-boundaries]')?.remove();
      } catch {
        const n = $('.boundary-status');
        if (n) n.textContent = 'Overview footprints ready · retry to load the finest detail';
        boundaryRequest = null;
        const tools = $('[data-map-tools="reliability"]');
        if (tools && !tools.querySelector('[data-retry-boundaries]')) {
          const button = document.createElement('button');
          button.dataset.retryBoundaries = '';
          button.textContent = 'Retry detail ↻';
          button.onclick = () => {
            button.disabled = true;
            loadBoundaries().finally(() => (button.disabled = false));
          };
          tools.append(button);
        }
      }
    })();
    return boundaryRequest;
  }
  const positions = {
    NL: [53.1, -57.6],
    PE: [46.4, -63.2],
    NS: [45.1, -63.6],
    NB: [46.7, -66.4],
    QC: [52.3, -72.0],
    ON: [49.4, -85.3],
    MB: [54.5, -98.7],
    SK: [54.1, -106.0],
    AB: [54.3, -115.0],
    BC: [54.1, -125.0],
    YT: [64, -136],
    NT: [64.8, -119.5],
    NU: [68.7, -96],
  };
  function drawForecast() {
    const map = maps.forecast;
    if (!map) return;
    const state = states.forecast;
    if (state.layer) map.removeLayer(state.layer);
    state.layer = L.layerGroup().addTo(map);
    state.byId = {};
    const rows = window.EOApp?.scenarioRows() || [],
      largest = Math.max(...rows.map((r) => r.value), 1),
      year = Number($('#year').value);
    for (const r of rows) {
      const ratio = r.base ? r.value / r.base : 1,
        fill = ratio >= 2 ? '#c5a6ff' : ratio >= 1.3 ? '#6aaaff' : '#71dbc1';
      const marker = L.circleMarker(positions[r.region], {
        radius: 7 + Math.sqrt(r.value / largest) * 24,
        color: fill,
        fillColor: fill,
        fillOpacity: 0.45,
        weight: 2,
      })
        .bindTooltip(`${esc(r.regionName)} · ${fmt(r.value)} TWh`, { className: 'geo-label' })
        .bindPopup(
          `<strong>${esc(r.regionName)}</strong><div class="map-popup-meta">${year} · ${esc($('#preset').value)}</div><div class="popup-metrics"><span><b>${fmt(r.value)}</b><small>TWh end-use electricity</small></span></div><div class="map-popup-meta">${Number($('#sensitivity').value) ? 'Your adjusted sensitivity; not the official pathway' : 'CER published projection'} · circles placed at regional reference points</div>`,
        )
        .addTo(state.layer);
      state.byId[r.region] = marker;
      marker.on('click', () => {
        $('#scenario-region').value = r.region;
        $('#scenario-region').dispatchEvent(new Event('change'));
      });
    }
    $('#legend-forecast').innerHTML =
      '<span><i style="background:#71dbc1"></i> &lt; 1.3×</span><span><i style="background:#6aaaff"></i> 1.3–2×</span><span><i style="background:#c5a6ff"></i> ≥ 2×</span><small>Size: projected demand · colour: change from historical baseline</small>';
  }
  function drawDeficit() {
    const map = maps.deficit;
    if (!map) return;
    const state = states.deficit;
    if (state.layer) map.removeLayer(state.layer);
    state.byId = {};
    state.layer = L.layerGroup().addTo(map);
    state.pulseRenderer ||= L.svg({ padding: 0.5 });
    let pulseIndex = 0;
    for (const r of window.EOApp?.balanceRows() || []) {
      if (r.region === 'CA' || !positions[r.region]) continue;
      const net = r.netExportsTWh,
        fill = net === null ? '#8d99ae' : net >= 0 ? '#71dbc1' : '#f8b277';
      const radius = 9 + Math.sqrt(Math.abs(net || 0)) * 8;
      const halo = L.circleMarker(positions[r.region], {
        radius,
        renderer: state.pulseRenderer,
        className: 'balance-pulse-ring',
        color: fill,
        fill: false,
        opacity: 0.3,
        weight: 2,
        interactive: false,
      }).addTo(state.layer);
      const element = halo.getElement();
      if (element) {
        element.setAttribute('aria-hidden', 'true');
        element.style.animationDelay = -pulseIndex++ * 0.27 + 's';
      }
      const marker = L.circleMarker(positions[r.region], {
        radius,
        color: fill,
        fillColor: fill,
        fillOpacity: 0.5,
        weight: 2,
      })
        .bindTooltip(esc(r.regionName), { className: 'geo-label' })
        .bindPopup(
          `<strong>${esc(r.regionName)}</strong><div class="map-popup-meta">Statistics Canada · ${esc(r.period)}</div><div class="popup-metrics"><span><b>${fmt(r.generationTWh)}</b><small>Generation / TWh</small></span><span><b>${fmt(r.availableTWh)}</b><small>Available / TWh</small></span></div><div class="map-popup-meta">${net === null ? 'Trade figures not published' : `${fmt(Math.abs(net))} TWh net ${net >= 0 ? 'exports' : 'imports'}`} · not a capacity assessment</div>`,
        )
        .addTo(state.layer);
      state.byId[r.region] = marker;
      marker.on('click', () => highlightBalance(r.region));
    }
    $('#legend-deficit').innerHTML =
      '<span><i style="background:#71dbc1"></i> Net exporter</span><span><i style="background:#f8b277"></i> Net importer</span><span><i style="background:#8d99ae"></i> Trade not published</span><small>Selected month · circle size: magnitude of net flow</small>';
  }
  function highlightBalance(id) {
    $$('[data-balance]').forEach((row) =>
      row.classList.toggle('active', row.dataset.balance === id),
    );
  }
  function focusBalance(id) {
    const marker = states.deficit?.byId[id];
    if (!marker) return;
    highlightBalance(id);
    maps.deficit.setView(marker.getLatLng(), 5, { animate: !reduced });
    marker.openPopup();
  }
  function drawOffgrid() {
    const map = maps.offgrid;
    if (!map) return;
    const state = states.offgrid;
    if (state.layer) map.removeLayer(state.layer);
    state.byId = {};
    state.layer = L.layerGroup().addTo(map);
    for (const c of window.EOApp?.filteredCommunities() || []) {
      const fill =
        c.primarySource === 'Diesel'
          ? '#f8b277'
          : c.primarySource === 'Hydro'
            ? '#71dbc1'
            : c.primarySource === 'Prov./terr. grid'
              ? '#6aaaff'
              : '#c5a6ff';
      const marker = L.circleMarker([c.lat, c.lon], {
        radius: 6,
        color: fill,
        fillColor: fill,
        fillOpacity: 0.75,
        weight: 1.5,
      })
        .bindTooltip(`${esc(c.name)} · ${esc(c.primarySource || 'Not reported')}`, {
          className: 'geo-label',
        })
        .bindPopup(
          `<strong>${esc(c.name)}</strong><div class="map-popup-meta">${esc(c.province)} · NRCan ${D.get('communities')?.metadata.edition || ''} edition</div><p>${esc(c.primarySource || 'Source not reported')}</p><div class="map-popup-meta">${esc(c.provider || 'Provider not reported')}</div>`,
        )
        .addTo(state.layer);
      state.byId[c.id] = marker;
      marker.on('click', () => window.EOApp?.showCommunity(c.id));
    }
    $('#legend-offgrid').innerHTML =
      '<span><i style="background:#f8b277"></i> Diesel</span><span><i style="background:#71dbc1"></i> Hydro</span><span><i style="background:#6aaaff"></i> Regional grid</span><span><i style="background:#c5a6ff"></i> Other</span><small>NRCan community locations · filters apply to map and directory</small>';
  }
  function focusCommunity(id) {
    const marker = states.offgrid?.byId[id];
    if (!marker) return;
    maps.offgrid.setView(marker.getLatLng(), 8, { animate: !reduced });
    marker.openPopup();
  }
  let officialData = null,
    officialLayer = null,
    officialLoading = false;
  async function toggleOfficial() {
    const checkbox = $('#official-boundaries');
    if (!checkbox.checked) {
      if (officialLayer) maps.reliability.removeLayer(officialLayer);
      return;
    }
    if (officialLoading) return;
    officialLoading = true;
    checkbox.disabled = true;
    try {
      if (!officialData) officialData = await D.load('boundaries');
      if (!officialData?.features?.length) throw Error('Layer unavailable');
      if (!officialLayer)
        officialLayer = L.geoJSON(officialData, {
          style: { color: '#fff2a7', weight: 2, fillOpacity: 0.035, dashArray: '5 3' },
          onEachFeature: (f, l) => {
            l.bindTooltip(esc(f.properties.name), {
              sticky: true,
              className: 'geo-label',
            }).bindPopup(
              `<strong>${esc(f.properties.name)}</strong><p>OEB published service boundary</p><div class="map-popup-meta">${esc(officialData.metadata.edition)} · published archive</div><div class="map-popup-meta">Publisher names retained, including legacy entities.</div>`,
            );
          },
        });
      if (checkbox.checked) {
        officialLayer.addTo(maps.reliability);
        maps.reliability.fitBounds(officialLayer.getBounds(), {
          padding: [30, 30],
          animate: !reduced,
        });
      }
      $('.official-layer-error')?.remove();
    } catch {
      checkbox.checked = false;
      $('.official-layer-error')?.remove();
      const note = document.createElement('p');
      note.className = 'map-error official-layer-error';
      note.setAttribute('role', 'status');
      note.textContent =
        'The official layer could not load. Detailed geographic footprints are still available. Enable the layer again to retry.';
      $('[data-map-stage="reliability"]').append(note);
    } finally {
      officialLoading = false;
      checkbox.disabled = false;
    }
  }
  let labVisible = false;
  const observe = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        labVisible = true;
        init(active);
        observe.disconnect();
      }
    },
    { rootMargin: '150px' },
  );
  observe.observe($('.lab-shell'));
  document.addEventListener('eo:tab', (e) => {
    active = e.detail;
    if (labVisible) init(active);
  });
  document.addEventListener('eo:utility', (e) => {
    focusUtility(e.detail.id, e.detail.focus);
  });
  document.addEventListener('eo:forecast', () => drawForecast());
  document.addEventListener('eo:balance-data', drawDeficit);
  document.addEventListener('eo:communities-data', drawOffgrid);
  document.addEventListener('eo:data', (e) => {
    if (['reliability', 'customers', 'balance'].includes(e.detail)) drawReliability(false);
  });
  document.addEventListener('eo:region', (e) => {
    const marker = states.forecast?.byId[e.detail];
    if (marker) {
      maps.forecast.setView(marker.getLatLng(), 6, { animate: !reduced });
      marker.openPopup();
    }
  });
  document.addEventListener('eo:balance', (e) => {
    if (labVisible) init('deficit');
    focusBalance(e.detail);
  });
  document.addEventListener('eo:community', (e) => {
    if (labVisible) init('offgrid');
    focusCommunity(e.detail);
  });
  function syncMotionPreference() {
    reduced = motionPreference.matches || document.documentElement.dataset.reduceMotion === 'true';
    for (const map of Object.values(maps)) {
      map.options.fadeAnimation = !reduced;
      map.options.zoomAnimation = !reduced;
      map.options.markerZoomAnimation = !reduced;
      if (reduced) map.stop();
    }
  }
  motionPreference.addEventListener('change', syncMotionPreference);
  new MutationObserver(syncMotionPreference).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-reduce-motion'],
  });
  window.EOMaps = {
    init,
    selectAt,
    chooseUtility,
    reset: () => maps[active] && national(maps[active]),
    getState: () => ({
      base:
        states[active]?.base ||
        (active === requestedView && requestedBase ? requestedBase : defaultBase),
    }),
    focusUtility,
  };
})();
