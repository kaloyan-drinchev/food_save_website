// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL for `page.goto('/admin')` etc.
 * Default is Vite dev (`npm run dev`). Override:
 *   PLAYWRIGHT_BASE_URL=http://localhost:4173 npx playwright test   # after npm run preview
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [['list'], ['html']],

  timeout: 60_000,

  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    navigationTimeout: 30_000,
  },

  projects: [
    // { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Start Vite before tests (or reuse if you already ran `npm run dev`).
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});