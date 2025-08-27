import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording for CI debugging */
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 },
        // Enable device pixel ratio for consistent screenshots
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1200, height: 800 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1200, height: 800 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Mobile',
      use: { 
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 1,
      },
    },
    
    /* Agent-APQ: Accessibility tests - run on Chromium only to avoid duplication */
    {
      name: 'a11y-tests',
      testDir: './tests/a11y',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        // Ensure screen reader compatibility
        colorScheme: 'dark'
      },
    },
    
    /* Agent-APQ: Performance tests */
    {
      name: 'performance-tests', 
      testDir: './tests/performance',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        // Performance settings
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=TranslateUI']
        }
      },
    },
    
    /* Agent-APQ: Visual regression tests */
    {
      name: 'visual-tests',
      testDir: './tests/visual', 
      use: { 
        ...devices['Desktop Chrome'],
        // Ensure consistent screenshots
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1
      },
    }
  ],

  /* Visual comparison settings */
  expect: {
    // Threshold for visual comparisons (0.0 - 1.0)
    toHaveScreenshot: {
      // More lenient threshold for glass effects and animations
      threshold: 0.25,
      // Animation handling
      animations: 'disabled',
      // Clip to content area to avoid browser chrome variations
      clip: { x: 0, y: 0, width: 800, height: 600 },
      // Mode for comparison
      mode: 'ixel',
    },
    // Custom matcher settings
    toMatchSnapshot: {
      threshold: 0.25,
    },
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global setup and teardown */
  globalSetup: './tests/global-setup.ts',

  /* Output directories */
  outputDir: 'test-results',
  
  /* Test timeout */
  timeout: 30 * 1000,
});