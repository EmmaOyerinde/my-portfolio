import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import { JSDOM, VirtualConsole } from 'jsdom';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
export const tick = () => new Promise((resolve) => setTimeout(resolve, 30));

// DOM integration only. Geometry, canvas pixels, CSS layout and real browser input
// require a rendered browser review, which this harness does not claim to perform.
export async function createPage({
  query = '',
  failure,
  storage = true,
  clientOnly = false,
  viewport = 1280,
  touch = false,
  before,
} = {}) {
  const errors = [],
    requests = [],
    downloads = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error.message));
  const dom = new JSDOM(read('index.html'), {
    url: 'https://emmaoyerinde.github.io/my-portfolio/' + query,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });
  const w = dom.window,
    d = w.document;
  const mediaListeners = new Set();
  const media = {
    matches: false,
    addEventListener: (_, listener) => mediaListeners.add(listener),
    removeEventListener: (_, listener) => mediaListeners.delete(listener),
  };
  const queries = new Map();
  const evaluateQuery = (query) => {
    if (query === '(pointer: coarse)') return touch;
    const max = query.match(/max-width:\s*(\d+)px/);
    const min = query.match(/min-width:\s*(\d+)px/);
    return (
      (!max || viewport <= Number(max[1])) &&
      (!min || viewport >= Number(min[1])) &&
      Boolean(max || min)
    );
  };
  w.matchMedia = (query) => {
    if (query.includes('prefers-reduced-motion')) return media;
    if (!queries.has(query)) {
      const listeners = new Set();
      queries.set(query, {
        matches: evaluateQuery(query),
        addEventListener: (_, listener) => listeners.add(listener),
        removeEventListener: (_, listener) => listeners.delete(listener),
        listeners,
      });
    }
    return queries.get(query);
  };
  media.resize = (width) => {
    viewport = width;
    for (const [query, item] of queries) {
      const matches = evaluateQuery(query);
      if (item.matches === matches) continue;
      item.matches = matches;
      for (const listener of item.listeners) listener({ matches });
    }
  };
  media.change = (value) => {
    media.matches = value;
    for (const listener of mediaListeners) listener({ matches: value });
  };
  w.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  w.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }
    disconnect() {}
  };
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLCanvasElement.prototype.getContext = function () {
    return new Proxy(
      {
        canvas: this,
        createRadialGradient() {
          return { addColorStop() {} };
        },
      },
      { get: (object, key) => (key in object ? object[key] : () => {}) },
    );
  };
  Object.defineProperty(w.HTMLElement.prototype, 'clientWidth', {
    get() {
      return 900;
    },
  });
  Object.defineProperty(w.HTMLElement.prototype, 'clientHeight', {
    get() {
      return this.classList?.contains('geo-map') ? 440 : 200;
    },
  });
  w.HTMLElement.prototype.getBoundingClientRect = function () {
    return {
      width: this.clientWidth,
      height: this.clientHeight,
      left: 0,
      top: 0,
      right: this.clientWidth,
      bottom: this.clientHeight,
    };
  };
  w.HTMLElement.prototype.getClientRects = function () {
    return [this.getBoundingClientRect()];
  };
  w.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  w.SVGSVGElement.prototype.createSVGRect = () => ({});
  w.AbortSignal = AbortSignal;
  w.AbortController = AbortController;
  w.TextEncoder = TextEncoder;
  Object.defineProperty(w.crypto, 'subtle', { value: webcrypto.subtle });
  w.URL.createObjectURL = (blob) => {
    downloads.push(blob);
    return 'blob:test-download';
  };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function () {};
  w.fetch = async (url) => {
    requests.push(String(url));
    if (failure === 'offline') throw new TypeError('Offline');
    if (failure === '404') return new Response('Missing', { status: 404 });
    if (failure === 'corrupt') return new Response('{broken');
    const parsed = new URL(String(url), w.location.href);
    if (!/^\/my-portfolio\/(data|assets)\//.test(parsed.pathname))
      throw Error('Unexpected request: ' + url);
    try {
      return new Response(
        fs.readFileSync(path.join(root, parsed.pathname.replace('/my-portfolio/', ''))),
      );
    } catch {
      return new Response('Missing', { status: 404 });
    }
  };
  if (!storage)
    Object.defineProperty(w, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  before?.(w);
  const clientFiles = [
    'preferences',
    'data',
    'evidence-core',
    'reliability-core',
    'evidence-seed',
    'ui-core',
    'data-client',
    'utility-profiles',
    'reliability-data',
  ].map((name) => 'js/' + name + '.js');
  const scripts = [...d.querySelectorAll('script[src]:not([type=module])')].map((script) =>
    script.getAttribute('src'),
  );
  for (const script of clientOnly ? clientFiles : scripts) w.eval(read(script));
  await w.EOData.ready;
  if (!clientOnly) await tick();
  return { dom, w, d, errors, requests, downloads, media, close: () => w.close() };
}
