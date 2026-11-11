'use strict';
(() => {
  const $ = (selector) => document.querySelector(selector);
  const compact = matchMedia('(max-width: 960px)');
  const picker = $('#utility-picker');
  const label = $('#utility-picker-label');

  function layout() {
    // Desktop always exposes the directory; smaller screens start with the selection.
    picker.open = !compact.matches;
    if (!compact.matches && document.activeElement === $('.utility-picker-summary')) {
      $('#utility-search').focus({ preventScroll: true });
    }
    if (!picker.open && picker.contains(document.activeElement)) {
      $('.utility-picker-summary').focus({ preventScroll: true });
    }
  }

  function selection(id) {
    const profile = window.EOData.profile(id);
    if (!profile) return;
    label.textContent = profile.name;
    $('#utility-evidence-count').textContent =
      'Published figures, calculations, and definitions for ' + profile.name;
  }

  layout();
  compact.addEventListener('change', layout);
  selection(new URLSearchParams(location.search).get('utility') || 'toronto-hydro');
  document.addEventListener('eo:utility', (event) => selection(event.detail.id));

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-select]') && compact.matches) {
      picker.open = false;
      const heading = $('#selected-utility');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({
        block: 'start',
        behavior:
          document.documentElement.dataset.reduceMotion === 'true' ||
          matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
      });
    }
    if (event.target.closest('[data-metric-utility]')) $('#utility-evidence').open = true;
  });
  document.addEventListener('change', (event) => {
    if (event.target.id === 'compare-utility' && event.target.value) {
      $('#utility-comparison').open = true;
      $('#utility-evidence').open = true;
    }
  });

  // Hash links into a disclosure reveal their destination before browser scrolling.
  function revealHash() {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    if (target.matches('details')) target.open = true;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.matches('details')) parent.open = true;
    }
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();
