import { defineConfig } from '@playwright/test';

// Run in GitHub Actions or a local development machine with Chromium installed.
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 45000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [320, 390, 768, 1024, 1440].map((width) => ({
    name: `${width}px`,
    use: {
      viewport: { width, height: width < 700 ? 844 : 900 },
      hasTouch: width <= 768,
      isMobile: width <= 768,
    },
  })),
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory dist',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});
