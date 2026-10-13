import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // The live store is slow (see BUG-08), so each test and each check gets more time.
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // One test at a time: gentler on a live production site.
  fullyParallel: false,
  workers: 1,

  // No automatic retries: if a test is flaky, we want to see it, not hide it.
  retries: 0,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.paradoxinteractive.com',
    // Keep evidence when a test fails: a trace (step-by-step replay) and a screenshot.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
