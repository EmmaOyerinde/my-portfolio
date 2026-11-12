'use strict';
(() => {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const cases = {
    ikeja: {
      category: 'UTILITY OPERATIONS / ESRI CASE STUDY',
      title: 'Ikeja Electric: the grid in view.',
      image: 'assets/ikeja.webp',
      alt: 'Ikeja Electric geographic distribution map',
      scope: 'Ikeja Electric',
      focus: 'GIS & power availability',
      intro:
        'A spatial lens on electricity distribution; making complex networks easier to understand and operational information easier to act on.',
      challenge:
        'Electricity networks connect physical assets, service areas, and operational decisions. GIS and spatial analytics connect power availability with the operational picture.',
      work: 'The project brings network assets and power availability into a geographic view that supports operational decisions. Explore the Esri case study for the project context and documented outcomes.',
      url: 'https://www.esri.com/en-us/lg/industry/electric-and-gas/stories/ikeja-electric-power-availablity-case-study',
      label: 'Read the Esri case study',
    },
    network: {
      category: 'ENTERPRISE GIS / NETWORK MONITORING',
      title: 'Geographic network monitoring.',
      image: 'assets/network.webp',
      alt: 'Geographic Network Monitoring System',
      scope: 'Geographic Network Monitoring',
      focus: 'Asset tracking & visibility',
      intro: 'A geographic interface for understanding the network and the assets within it.',
      challenge:
        'Infrastructure data is most useful when its relationship to the physical network is clear. This project brings location into the monitoring experience.',
      work: 'The monitoring system connects geographic assets with operational information to support infrastructure visibility and management. Explore the project for the system context and supporting material.',
      url: 'https://www.spatialnode.net/projects/geographic-network-monitoring-system-4228ae',
      label: 'Explore on SpatialNode',
    },
    ukraine: {
      category: 'ENVIRONMENTAL ANALYSIS / UNDP UKRAINE',
      title: 'Mining and flooding in the Donbas region.',
      image: 'assets/ukraine.webp',
      alt: 'Mining and flooding assessment of the Donbas region',
      scope: 'UNDP Ukraine: Coal Cities',
      focus: 'GIS environmental assessment',
      intro:
        'Spatial analysis supporting a broader view of environmental conditions and future economic possibilities.',
      challenge:
        'Communities transitioning from coal need to understand the environmental setting alongside the economic choices ahead.',
      work: 'GIS-based environmental assessment supports planning for coal communities transitioning toward economic diversification by 2035. This assessment examines mining-related flooding in the Donbas region.',
      url: 'https://spatialnode.net/projects/undp-ukraine-transition-of-coal-cities-c9394a',
      label: 'Explore the project',
      pdf: 'EFFECTS%20OF%20MINING%20ON%20FLOODING%20IN%20THE%20DONBAS%20REGION%20(Flooding%20rate%202).pdf',
    },
  };
  function openCase(id) {
    const c = cases[id];
    if (!c) return;
    $('#case-body').innerHTML =
      `<img class="case-cover ${id === 'ikeja' ? 'case-cover-ikeja' : ''}" src="${c.image}" alt="${c.alt}"><div class="case-content"><p class="eyebrow">${c.category}</p><h2 id="case-title">${c.title}</h2><p>${c.intro}</p><div class="case-facts"><div><small>PROJECT CONTEXT</small><strong>${c.scope}</strong></div><div><small>FOCUS</small><strong>${c.focus}</strong></div></div><h3>The challenge</h3><p>${c.challenge}</p><h3>The work</h3><p>${c.work}</p><a class="button primary" target="_blank" rel="noopener noreferrer" href="${c.url}">${c.label} ↗</a>${c.pdf ? `<a class="text-link" target="_blank" rel="noopener noreferrer" href="${c.pdf}">Read the assessment PDF ↗</a>` : ''}</div>`;
    $('#case-dialog').showModal();
  }
  $$('[data-case]').forEach((button) => (button.onclick = () => openCase(button.dataset.case)));
  $$('dialog').forEach((dialog) =>
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    }),
  );
  const commands = [
    { name: 'Selected work', type: 'Page', run: () => (location.hash = 'work') },
    { name: 'About Emmanuel', type: 'Page', run: () => (location.hash = 'about') },
    { name: 'Live energy news', type: 'Live wire', run: () => (location.hash = 'news') },
    { name: 'Contact & email', type: 'Page', run: () => (location.hash = 'contact') },
    {
      name: 'Sources & methodology',
      type: 'Reference',
      run: () => (location.hash = 'methodology'),
    },
    ...['reliability', 'forecast', 'deficit', 'offgrid'].map((view, i) => ({
      name: [
        'Utility reliability explorer',
        'Demand scenario studio',
        'Monthly energy balance',
        'Remote communities',
      ][i],
      type: 'Interactive map',
      run: () => {
        window.EOApp?.openTab(view);
        location.hash = 'lab';
      },
    })),
    ...Object.keys(cases).map((id) => ({
      name: cases[id].scope,
      type: 'Project',
      run: () => openCase(id),
    })),
    ...window.PORTFOLIO_DATA.utilitiesGeoJSON.features.map((f) => ({
      name: f.properties.utility,
      type: 'Utility',
      run: () => {
        window.EOApp?.openTab('reliability');
        window.EOMaps?.init('reliability');
        window.EOApp?.selectUtility(f.properties.id, true, true);
        location.hash = 'lab';
      },
    })),
  ];
  function renderCommands() {
    const query = $('#command-input').value.trim().toLowerCase();
    const matching = commands
      .filter((c) => `${c.name} ${c.type}`.toLowerCase().includes(query))
      .slice(0, 12);
    const holder = $('#command-results');
    holder.replaceChildren();
    for (const c of matching) {
      const b = document.createElement('button'),
        name = document.createElement('span'),
        type = document.createElement('small');
      name.textContent = c.name;
      type.textContent = c.type + ' ↗';
      b.append(name, type);
      b.onclick = () => {
        $('#command-dialog').close();
        c.run();
      };
      holder.append(b);
    }
    if (!matching.length) {
      const p = document.createElement('p');
      p.className = 'empty-state';
      p.textContent = 'No matches. Try “forecast”, “Toronto”, or “news”.';
      holder.append(p);
    }
  }
  function openCommand() {
    $('#command-input').value = '';
    renderCommands();
    $('#command-dialog').showModal();
    $('#command-input').focus();
  }
  $('#command-open').onclick = openCommand;
  $('#command-input').oninput = renderCommands;
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#command-dialog').open ? $('#command-dialog').close() : openCommand();
    }
  });
  $('#command-dialog').addEventListener('keydown', (e) => {
    const buttons = $$('#command-results button');
    if (!buttons.length) return;
    const index = buttons.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      buttons[(index + 1) % buttons.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length].focus();
    } else if (e.key === 'Enter' && document.activeElement === $('#command-input')) {
      e.preventDefault();
      buttons[0].click();
    }
  });
  $$('[data-guide]').forEach(
    (b) =>
      (b.onclick = () => {
        const view = b.dataset.guide;
        window.EOApp.openTab(view);
        if (view === 'reliability') window.EOApp.selectUtility('toronto-hydro');
        if (view === 'forecast') $('#scenario-reset').click();
        if (view === 'offgrid') {
          $('#community-reset').click();
          $('#community-search').value = 'Iqaluit';
          $('#community-search').dispatchEvent(new Event('input'));
        }
        $('.lab-shell').scrollIntoView({
          block: 'start',
          behavior: document.documentElement.dataset.reduceMotion === 'true' ? 'auto' : 'smooth',
        });
        $('#tab-' + view).focus({ preventScroll: true });
      }),
  );

  const nav = $('#nav'),
    header = $('.site-header');
  const navItems = $$('[data-nav-section]')
    .map((link) => ({ link, section: document.getElementById(link.dataset.navSection) }))
    .filter((item) => item.section);
  let navFrame = 0,
    currentSection = '';
  function updateNavigation() {
    navFrame = 0;
    const top = header.getBoundingClientRect().bottom,
      viewport = window.innerHeight || 800;
    const readingLine = Math.min(viewport * 0.4, top + 140);
    let active = '';
    for (const { section } of navItems) {
      const box = section.getBoundingClientRect();
      if (box.top <= readingLine && box.bottom > top + 24) active = section.id;
    }
    if (!active) {
      const candidate = navItems
        .map((item) => ({ id: item.section.id, box: item.section.getBoundingClientRect() }))
        .filter((item) => item.box.top < viewport * 0.65 && item.box.bottom > top + 24)
        .sort((a, b) => a.box.top - b.box.top)[0];
      active = candidate?.id || '';
    }
    if (active === currentSection) return;
    currentSection = active;
    nav.dataset.currentSection = active;
    for (const { link, section } of navItems) {
      if (section.id === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  function scheduleNavigation() {
    if (!navFrame) navFrame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  window.addEventListener('hashchange', scheduleNavigation);
  window.addEventListener('pageshow', scheduleNavigation);
  window.addEventListener('load', scheduleNavigation);
  const navigationSize = new ResizeObserver(scheduleNavigation);
  navigationSize.observe(header);
  navItems.forEach(({ section }) => navigationSize.observe(section));
  document.fonts?.ready.then(scheduleNavigation);
  scheduleNavigation();
})();
