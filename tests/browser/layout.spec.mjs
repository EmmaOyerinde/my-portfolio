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
