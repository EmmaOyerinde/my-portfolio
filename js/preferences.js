'use strict';
(() => {
  const root = document.documentElement;
  root.dataset.theme = 'dark';
  try {
    const size = Number(localStorage.getItem('eo-text-size'));
    root.style.setProperty('--reading-size', `${size >= 18 && size <= 22 ? size : 19}px`);
    root.dataset.reduceMotion =
      localStorage.getItem('eo-reduce-motion') === 'true' ? 'true' : 'false';
  } catch {}
})();
