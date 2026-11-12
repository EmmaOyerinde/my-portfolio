import test from 'node:test';
import assert from 'node:assert/strict';
import { createPage } from './helpers/page.mjs';

async function motionPage(options = {}) {
  const frames = new Map();
  let id = 0,
    time = 1000,
    draws = 0,
    sample;
  const page = await createPage({
    ...options,
    before(w) {
      w.requestAnimationFrame = (callback) => {
        frames.set(++id, callback);
        return id;
      };
      w.cancelAnimationFrame = (key) => frames.delete(key);
      const getContext = w.HTMLCanvasElement.prototype.getContext;
      w.HTMLCanvasElement.prototype.getContext = function () {
        const context = getContext.call(this);
        if (this.id === 'connected-globe') {
          context.clearRect = () => {
            draws++;
            sample = null;
          };
          context.moveTo = (x, y) => {
            sample ||= [x, y];
          };
        }
        return context;
      };
      options.before?.(w);
    },
  });
  return {
    ...page,
    get draws() {
      return draws;
    },
    get sample() {
      return sample;
    },
    step(count = 4) {
      for (let i = 0; i < count; i++) {
        time += 34;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback(time));
      }
    },
    pointer(target, type, values = {}) {
      const event = new page.w.Event(type, { bubbles: true });
      Object.assign(event, {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 100,
        isPrimary: true,
        button: 0,
        ...values,
      });
      target.dispatchEvent(event);
    },
  };
}

function assertRotating(page) {
  const count = page.draws,
    position = page.sample;
  page.step();
  assert.ok(page.draws > count, 'the next frames are drawn');
  assert.notDeepEqual(page.sample, position, 'the globe changes orientation');
}

test('the globe keeps rotating after drag, cancellation, capture loss, arrow keys and news touches', async (t) => {
  const page = await motionPage();
  t.after(page.close);
  const { w, d } = page;
  const canvas = d.querySelector('#connected-globe');
  assert.equal(canvas.dataset.detail, 'land');
  assert.equal(d.querySelector('.motion-toggle'), null);
  assertRotating(page);
  for (const ending of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    page.pointer(canvas, 'pointerdown');
    page.step();
    const before = page.draws;
    page.step();
    assert.equal(page.draws, before, 'automatic rotation yields while dragging');
    page.pointer(canvas, 'pointermove', { clientX: 160 });
    page.pointer(canvas, ending, { clientX: 160 });
    assertRotating(page);
  }
  canvas.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assertRotating(page);
  page.pointer(d.querySelector('#wire-viewport'), 'pointerdown', { pointerType: 'touch' });
  assertRotating(page);
  page.pointer(d, 'pointerup', { pointerType: 'touch' });
  assertRotating(page);
  assert.deepEqual(page.errors, []);
});

test('reduced motion and hidden tabs stop rendering, then normal viewing resumes', async (t) => {
  let hidden = false;
  const page = await motionPage({
    before(w) {
      Object.defineProperty(w.document, 'hidden', { get: () => hidden });
    },
  });
  t.after(page.close);
  assertRotating(page);
  page.media.change(true);
  let before = page.draws;
  page.step();
  assert.equal(page.draws, before);
  assert.match(page.d.querySelector('#connected-globe').getAttribute('aria-label'), /^Globe\./);
  assert.equal(page.d.querySelector('#globe-state'), null);
  page.media.change(false);
  assertRotating(page);
  hidden = true;
  page.d.dispatchEvent(new page.w.Event('visibilitychange'));
  before = page.draws;
  page.step();
  assert.equal(page.draws, before);
  hidden = false;
  page.d.dispatchEvent(new page.w.Event('visibilitychange'));
  assertRotating(page);
  assert.deepEqual(page.errors, []);
});

test('missing or invalid land geometry keeps a rotating outline instead of an empty globe', async (t) => {
  for (const failure of ['offline', 'invalid']) {
    await t.test(failure, async (t) => {
      const page = await motionPage({
        failure: failure === 'offline' ? 'offline' : undefined,
        before(w) {
          if (failure !== 'invalid') return;
          const fetch = w.fetch;
          w.fetch = (url) =>
            String(url).includes('globe-land')
              ? Promise.resolve(
                  new Response(
                    JSON.stringify({
                      rings: [
                        [
                          [0, null],
                          [1, 2],
                          [3, 4],
                        ],
                      ],
                      dots: [],
                    }),
                  ),
                )
              : fetch(url);
        },
      });
      t.after(page.close);
      assert.equal(page.d.querySelector('#connected-globe').hidden, false);
      assert.equal(page.d.querySelector('#connected-globe').dataset.detail, 'outline');
      assertRotating(page);
      assert.deepEqual(page.errors, []);
    });
  }
});

test('a browser without Canvas receives the existing Earth image', async (t) => {
  const page = await motionPage({
    before(w) {
      w.HTMLCanvasElement.prototype.getContext = () => null;
    },
  });
  t.after(page.close);
  assert.equal(page.d.querySelector('#connected-globe').hidden, true);
  assert.equal(page.d.querySelector('#globe-static').hidden, false);
  assert.equal(page.d.querySelector('#globe-state'), null);
  assert.ok(
    page.d.querySelector('#map-reliability svg'),
    'the map uses SVG when Canvas is unavailable',
  );
  assert.deepEqual(page.errors, []);
});
