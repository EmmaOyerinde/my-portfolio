import { test, expect } from '@playwright/test';

const browserErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  browserErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  // Exercise the bundled fallback without depending on upstream API availability.
  await page.route('https://api.io.canada.ca/**', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});

async function noPageOverflow(page) {
  const result = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(result.content).toBeLessThanOrEqual(result.viewport + 1);
}

test('map controls fit at normal and larger reading sizes', async ({ page }) => {
  for (const size of ['19', '22']) {
    await page.locator('#reading-open').click();
    await page.locator('#reading-size').press(size === '22' ? 'End' : 'Home');
    if (size === '19') await page.locator('#reading-size').press('ArrowRight');
    await page.getByRole('button', { name: 'Close reading preferences', exact: true }).click();
    await page.locator('#lab').scrollIntoViewIfNeeded();
    const toolbar = page.locator('[data-map-tools="reliability"]');
    await expect(toolbar.locator('#map-metric')).toBeVisible();
    const bounds = await toolbar.boundingBox();
    for (const selector of [
      '[data-basemap]',
      '#map-metric',
      '.map-settings > summary',
      '[data-national]',
      '[data-expand]',
    ]) {
      const control = toolbar.locator(selector);
      const rect = await control.boundingBox();
      expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.x).toBeGreaterThanOrEqual(bounds.x - 1);
      expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
    }
    await noPageOverflow(page);
  }
});

test('dark and light layouts fit the viewport with readable controls', async ({
  page,
}, testInfo) => {
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await page.locator('#theme').click();
    await noPageOverflow(page);
    await testInfo.attach(`hero-${theme}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await page.locator('#lab').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-basemap="reliability"]')).toHaveValue('dark');
    await expect(page.locator('#utility-metrics')).not.toBeEmpty();
    const select = page.locator('[data-basemap="reliability"]');
    const size = await select.boundingBox();
    expect(size.height).toBeGreaterThanOrEqual(44);
    expect(
      await select.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    await page.locator('[data-map-stage="reliability"]').scrollIntoViewIfNeeded();
    await noPageOverflow(page);
    await testInfo.attach(`intelligence-${theme}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await page.locator('#news').scrollIntoViewIfNeeded();
    await expect(page.locator('#news-grid')).toHaveAttribute('aria-busy', 'false', {
      timeout: 20000,
    });
    await expect(page.locator('#news-count')).toContainText('matching headlines');
    await noPageOverflow(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  }
});

test('utility navigation, map expansion, and all categories remain usable', async ({ page }) => {
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const picker = page.locator('#utility-picker');
  if (!(await picker.evaluate((node) => node.open))) await picker.locator('summary').click();
  await page.locator('#utility-search').fill('Alectra');
  await page.locator('[data-select="alectra"]').click();
  await expect(page.locator('#selected-utility')).toHaveText('Alectra Utilities');
  await expect(page.locator('#utility-metrics')).toContainText(/customer/i);
  await page.locator('[data-expand="reliability"]').click();
  await expect(page.locator('[data-map-stage="reliability"]')).toHaveAttribute(
    'aria-modal',
    'true',
  );
  await page.locator('.map-settings > summary').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.map-settings')).not.toHaveAttribute('open', '');
  await expect(page.locator('[data-map-stage="reliability"]')).toHaveAttribute(
    'aria-modal',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-map-stage="reliability"]')).not.toHaveAttribute(
    'aria-modal',
    'true',
  );
  await expect(page.locator('[data-expand="reliability"]')).toBeFocused();
  for (const view of ['forecast', 'deficit', 'offgrid', 'reliability']) {
    await page.locator(`[data-tab="${view}"]`).click();
    await expect(page.locator(`[data-basemap="${view}"]`)).toHaveValue('dark');
    await noPageOverflow(page);
  }
});

test('the red beacon honours reduced motion', async ({ page }) => {
  const dot = page.locator('.wire-light');
  await expect(dot).toHaveCSS('background-color', 'rgb(255, 97, 116)');
  expect(await dot.evaluate((node) => getComputedStyle(node, '::after').animationName)).toBe(
    'wire-beacon',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => dot.evaluate((node) => getComputedStyle(node, '::after').animationName))
    .toBe('none');
  await page.locator('#theme').click();
  await expect(dot).toHaveCSS('background-color', 'rgb(197, 42, 66)');
});

test('globe rotation resumes after direct interaction without pause controls', async ({ page }) => {
  const canvas = page.locator('#connected-globe');
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.motion-toggle')).toHaveCount(0);
  const isRotating = async () => {
    const initial = await canvas.evaluate((node) => node.toDataURL());
    await expect.poll(() => canvas.evaluate((node) => node.toDataURL())).not.toBe(initial);
  };
  await isRotating();
  await canvas.press('ArrowRight');
  await isRotating();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await isRotating();
});

test('each project has subtle focus feedback and respects reduced motion', async ({
  page,
}, testInfo) => {
  const cards = page.locator('#work .work-card');
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    const image = card.locator('img');
    await card.locator('button[data-case]').first().focus();
    await expect
      .poll(() =>
        image.evaluate(
          (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).isIdentity,
        ),
      )
      .toBe(false);
    await noPageOverflow(page);
  }
  await testInfo.attach('selected-work-feedback', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const card of await cards.all()) {
    await card.locator('button[data-case]').first().focus();
    await expect
      .poll(() =>
        card
          .locator('img')
          .evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).isIdentity),
      )
      .toBe(true);
  }
});

test('utility rows contain their full text at default and large reading sizes', async ({
  page,
}, testInfo) => {
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const picker = page.locator('#utility-picker');
  if (!(await picker.evaluate((node) => node.open))) await picker.locator('summary').click();
  const rows = page.locator('#utility-list .utility-item');
  await expect(rows).toHaveCount(93);
  await page.evaluate(() => document.fonts.ready);

  for (const size of [19, 22]) {
    if (size === 22) {
      await page.locator('#reading-open').click();
      await page.locator('#reading-size').press('End');
      await page.keyboard.press('Escape');
      await expect(page.locator('html')).toHaveCSS('font-size', '22px');
    }
    for (const theme of ['dark', 'light']) {
      if ((await page.locator('html').getAttribute('data-theme')) !== theme)
        await page.locator('#theme').click();
      await rows.first().scrollIntoViewIfNeeded();
      const clipped = await rows.evaluateAll((items) =>
        items.flatMap((row) => {
          const bounds = row.getBoundingClientRect();
          const content = [...row.children].map((child) => child.getBoundingClientRect());
          const overflows =
            row.scrollHeight > row.clientHeight + 1 ||
            row.scrollWidth > row.clientWidth + 1 ||
            content.some(
              (box) =>
                box.bottom > bounds.bottom - 1 ||
                box.top < bounds.top ||
                box.left < bounds.left ||
                box.right > bounds.right,
            );
          return overflows
            ? [
                {
                  name: row.firstElementChild.textContent,
                  height: bounds.height,
                  contentHeight: row.scrollHeight,
                },
              ]
            : [];
        }),
      );
      expect(clipped, `Utility content must fit each row at ${size}px in ${theme} mode`).toEqual(
        [],
      );
      await noPageOverflow(page);
      await testInfo.attach(`utility-directory-${theme}-${size}px`, {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
    }
  }
  await page.locator('#utility-search').fill('Niagara-on-the-Lake');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('customers');
  await page.locator('#utility-search').fill('no-such-utility-123');
  await expect(page.locator('#utility-list')).toContainText('No utilities match');
  await noPageOverflow(page);
});
