import { test, expect } from '@playwright/test';

test.describe('Content Security Policy & Console Integrity', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept local /_vercel/* analytics requests so dev/test runs cleanly without shipping stubs
    await page.route('**/_vercel/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '/* mock local analytics */',
      })
    );
  });

  const routes = [
    '/',
    '/about',
    '/events',
    '/events/scilab-workshop',
    '/gallery',
    '/team',
    '/contact',
    '/404-nonexistent-page',
  ];

  for (const route of routes) {
    test(`zero CSP errors or console violations on route: ${route}`, async ({ page }) => {
      const cspViolations = [];
      page.on('console', (msg) => {
        const text = msg.text();
        if (
          text.includes('Content Security Policy') ||
          text.includes('violates the following Content Security Policy') ||
          (text.includes('Refused to execute') && text.includes('Content Security Policy')) ||
          (text.includes('Refused to load') && text.includes('Content Security Policy'))
        ) {
          cspViolations.push(text);
        }
      });

      await page.goto(route, { waitUntil: 'load' });
      await page.waitForTimeout(200);

      expect(cspViolations).toEqual([]);
    });
  }

  test('zero CSP violations during client-side navigation and lightbox interaction', async ({ page }) => {
    const cspViolations = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('Content Security Policy') ||
        text.includes('violates the following Content Security Policy') ||
        (text.includes('Refused to execute') && text.includes('Content Security Policy')) ||
        (text.includes('Refused to load') && text.includes('Content Security Policy'))
      ) {
        cspViolations.push(text);
      }
    });

    // 1. Initial load
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(200);

    // 2. Client-side navigate to /gallery
    await page.getByRole('link', { name: 'Gallery' }).first().click();
    await page.waitForURL('**/gallery');
    await page.waitForLoadState('load');
    await page.waitForTimeout(200);

    // 3. Open lightbox
    const firstPhoto = page.locator('button[aria-haspopup="dialog"]').first();
    await expect(firstPhoto).toBeVisible();
    await firstPhoto.click();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();

    // 4. Close lightbox
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // 5. Navigate to /events
    await page.getByRole('link', { name: 'Events' }).first().click();
    await page.waitForURL('**/events');
    await page.waitForLoadState('load');
    await page.waitForTimeout(200);

    // 6. Navigate to /contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await page.waitForURL('**/contact');
    await page.waitForLoadState('load');
    await page.waitForTimeout(200);

    expect(cspViolations).toEqual([]);
  });
});
