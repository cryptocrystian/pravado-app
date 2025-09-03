import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Ensure the dev server is ready and the app is loaded
    await page.goto('/');
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Wait for fonts to load to ensure consistent text rendering
    await page.evaluate(() => document.fonts.ready);
    
    // Disable animations globally for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
          transition-delay: 0ms !important;
          transition-duration: 0ms !important;
        }
        
        /* Ensure glass effects render consistently */
        [class*="glass"], [class*="backdrop"] {
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }
      `
    });

    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;