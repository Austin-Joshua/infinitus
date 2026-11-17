import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/about', '/events', '/events/scilab-workshop', '/team', '/gallery', '/contact'];
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

for (const route of ROUTES) {
  test.describe(`Horizontal Overflow Guard: ${route}`, () => {
    for (const width of WIDTHS) {
      for (const theme of ['light', 'dark']) {
        test(`width ${width}px | theme: ${theme}`, async ({ page }) => {
          await page.setViewportSize({ width, height: 800 });

          // Set theme & intro preferences before page load
          await page.addInitScript(({ th }) => {
            try {
              localStorage.setItem('infinitus-theme', th);
              sessionStorage.setItem('infinitus-intro', '1'); // curtain seen
            } catch (e) {}
          }, { th: theme });

          await page.goto(route, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(100);

          const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));

          // Strict assertion: horizontal scrollWidth must not exceed viewport clientWidth
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px subpixel tolerance
        });
      }
    }
  });
}
