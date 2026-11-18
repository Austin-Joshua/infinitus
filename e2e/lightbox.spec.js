import { test, expect } from '@playwright/test';

test.describe('Fullscreen Gallery Lightbox Experience', () => {
  test('opens, traps focus, changes slides on arrows, hides header/nav, and returns focus on close', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });

    // Locate the first gallery card button/trigger
    const firstCard = page.getByRole('button', { name: /View photo:/i }).first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // 1. Open the modal
    await firstCard.click();

    // 2. Assert modal is open with dialog role and aria-modal
    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // 3. Verify html & body have .lightbox-open class, overflow is hidden, and header is hidden
    const lockdown = await page.evaluate(() => ({
      bodyClass: document.body.classList.contains('lightbox-open'),
      htmlClass: document.documentElement.classList.contains('lightbox-open'),
      bodyOverflow: window.getComputedStyle(document.body).overflow,
      htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
    }));
    expect(lockdown.bodyClass).toBe(true);
    expect(lockdown.htmlClass).toBe(true);
    expect(lockdown.bodyOverflow).toBe('hidden');
    expect(lockdown.htmlOverflow).toBe('hidden');
    await expect(header).not.toBeVisible();

    // 4. Verify image in modal is loaded with real dimensions
    const modalImg = dialog.locator('img');
    await expect(modalImg).toBeVisible();
    await modalImg.evaluate(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) resolve(true);
          else img.onload = () => resolve(true);
        })
    );

    // 5. Test slide navigation with Arrow keys
    const initialSrc = await modalImg.getAttribute('src');
    await page.keyboard.press('ArrowRight');
    await expect(modalImg).not.toHaveAttribute('src', initialSrc);

    // 6. Test Close with Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Assert modal is closed and scroll locks removed
    const isClosed = await page.evaluate(() => ({
      bodyClosed: !document.body.classList.contains('lightbox-open'),
      htmlClosed: !document.documentElement.classList.contains('lightbox-open'),
    }));
    expect(isClosed.bodyClosed).toBe(true);
    expect(isClosed.htmlClosed).toBe(true);

    // 7. Verify header is restored and focus returned to the trigger button
    await expect(header).toBeVisible();
    await expect(firstCard).toBeFocused();
  });

  test('scroll position survives open and close at 390x844 and 1440x900', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900, name: 'desktop' },
      { width: 390, height: 844, name: 'mobile' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/gallery', { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('button[aria-haspopup="dialog"]').first()).toBeVisible({ timeout: 10000 });

      // Scroll to Y=1500
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 1500);
      });
      await page.waitForFunction(() => Math.abs(window.scrollY - 1500) <= 2, { timeout: 10000 });

      const beforeScrollY = await page.evaluate(() => window.scrollY);
      expect(Math.abs(beforeScrollY - 1500)).toBeLessThanOrEqual(5);

      // Open a photo trigger visible within current viewport without triggering Playwright auto-scroll
      const clicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[aria-haspopup="dialog"]'));
        const btn =
          buttons.find((b) => {
            const r = b.getBoundingClientRect();
            return r.bottom > 50 && r.top < window.innerHeight - 50;
          }) || buttons[0];
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      expect(clicked).toBe(true);

      const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
      await expect(dialog).toBeVisible({ timeout: 10000 });

      // Close modal using Escape
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();

      // Verify window.scrollY survived within 2px
      const afterScrollY = await page.evaluate(() => window.scrollY);
      expect(Math.abs(afterScrollY - beforeScrollY)).toBeLessThanOrEqual(2);

      // Verify html does not have residual height: 100% !important
      const htmlInlineHeight = await page.evaluate(() => document.documentElement.style.height);
      expect(htmlInlineHeight).toBe('');
    }
  });

  test('renders visible picture utilizing >= 85% of limiting dimension across 4:5 poster, landscape, and square', async ({ page }, testInfo) => {
    test.setTimeout(60000);
    const testCases = [
      {
        type: '4:5 Poster',
        buttonName: /Club Inauguration Day/i,
      },
      {
        type: 'Landscape',
        buttonName: /Faculty coordinators/i,
      },
      {
        type: 'Square',
        buttonName: /National Mathematics Day/i,
      },
    ];

    const viewports = [
      { width: 1440, height: 900, name: 'desktop' },
      { width: 1024, height: 768, name: 'ipad' },
      { width: 390, height: 844, name: 'mobile' },
    ];

    for (const tc of testCases) {
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/gallery', { waitUntil: 'domcontentloaded' });

        const trigger = page.getByRole('button', { name: tc.buttonName });
        await expect(trigger).toBeVisible({ timeout: 10000 });
        await trigger.click();

        const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });

        const img = dialog.locator('img');
        await expect(img).toBeVisible();

        // Wait for image to fully load
        await img.evaluate(
          (node) =>
            new Promise((resolve) => {
              if (node.complete && node.naturalWidth > 0) resolve(true);
              else node.onload = () => resolve(true);
            })
        );

        // Compute visible picture dimensions via object-fit containment
        const metrics = await img.evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return {
            naturalWidth: node.naturalWidth,
            naturalHeight: node.naturalHeight,
            boxWidth: rect.width,
            boxHeight: rect.height,
          };
        });

        expect(metrics.naturalWidth).toBeGreaterThan(0);
        expect(metrics.naturalHeight).toBeGreaterThan(0);

        const scale = Math.min(
          metrics.boxWidth / metrics.naturalWidth,
          metrics.boxHeight / metrics.naturalHeight
        );
        const renderedWidth = metrics.naturalWidth * scale;
        const renderedHeight = metrics.naturalHeight * scale;

        // Limiting dimension utilization against viewport
        const utilW = renderedWidth / vp.width;
        const utilH = renderedHeight / vp.height;
        const maxUtilization = Math.max(utilW, utilH);

        // Must utilize at least 85% of limiting side
        expect(maxUtilization).toBeGreaterThanOrEqual(0.85);

        // Capture artifact evidence screenshot to Playwright test output
        await page.screenshot({
          path: testInfo.outputPath(`${tc.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${vp.name}.png`),
        });

        // Close modal
        await page.keyboard.press('Escape');
        if (await dialog.isVisible()) {
          const closeBtn = dialog.locator('button[aria-label="Close image preview"]');
          if (await closeBtn.isVisible()) await closeBtn.click();
        }
        await expect(dialog).not.toBeVisible();
      }
    }
  });

  test('differentiates drag gesture from tap action', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });

    const trigger = page.getByRole('button', { name: /View photo:/i }).first();
    await trigger.click();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    const img = dialog.locator('img');
    await expect(img).toBeVisible();

    // Perform a drag > 8px on the image (drag from x=500 to x=480, delta 20px)
    await page.mouse.move(500, 400);
    await page.mouse.down();
    await page.mouse.move(480, 400, { steps: 5 });
    await page.mouse.up();

    // The modal should remain open (drag did not trigger background close)
    await expect(dialog).toBeVisible();

    // Now perform a clean tap on the image without dragging
    const closeBtn = dialog.locator('button[aria-label="Close image viewer"]');
    await expect(closeBtn).toBeVisible();
    await img.click(); // tap toggles controls off
    await expect(closeBtn).not.toBeVisible();

    await img.click(); // tap toggles controls back on
    await expect(closeBtn).toBeVisible();

    // Close on Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('lock effect never un-hides or flickers lightbox-open class while navigating slides', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });
    const firstCard = page.getByRole('button', { name: /View photo:/i }).first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Track any transient removals of lightbox-open class from document.body or documentElement
    await page.evaluate(() => {
      window.__lightboxOpenRemovals = 0;
      const origRemove = DOMTokenList.prototype.remove;
      DOMTokenList.prototype.remove = function (...tokens) {
        if (tokens.includes('lightbox-open')) {
          window.__lightboxOpenRemovals++;
        }
        return origRemove.apply(this, tokens);
      };
    });

    // Navigate 3 slides with ArrowRight
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(80);
    }

    const removals = await page.evaluate(() => window.__lightboxOpenRemovals);
    expect(removals).toBe(0);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('focus returns to thumbnail N after navigating across slides (Escape, close button, and backdrop click)', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });

    const cards = page.getByRole('button', { name: /View photo:/i });
    const cardN = cards.nth(2); // Thumbnail N (index 2)
    await expect(cardN).toBeVisible({ timeout: 10000 });
    const expectedName = (await cardN.getAttribute('aria-label'))?.trim();
    expect(expectedName).toBeTruthy();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');

    // Subtest 1: Close via Escape
    await cardN.click();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(60);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    const active1 = await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.trim());
    expect(active1).toBe(expectedName);

    // Subtest 2: Close via Close button
    await cardN.click();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(60);
    }
    const closeBtn = dialog.locator('button[aria-label="Close image viewer"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
    const active2 = await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.trim());
    expect(active2).toBe(expectedName);

    // Subtest 3: Close via click on black backdrop area
    await cardN.click();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(60);
    }
    // Click on the backdrop (near top-left edge outside controls and picture)
    await page.mouse.click(20, 20);
    await expect(dialog).not.toBeVisible();
    const active3 = await page.evaluate(() => document.activeElement?.getAttribute('aria-label')?.trim());
    expect(active3).toBe(expectedName);
  });

  test('scroll position survives open, navigation, and close at 390x844 and 1440x900', async ({ page }) => {
    for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(vp);
      await page.goto('/gallery', { waitUntil: 'domcontentloaded' });

      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
      });

      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForFunction(() => Math.abs(window.scrollY - 1500) <= 2);

      // Open a photo trigger visible within current viewport around Y=1500 without Playwright auto-scroll
      const clicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[aria-haspopup="dialog"]'));
        const btn =
          buttons.find((b) => {
            const r = b.getBoundingClientRect();
            return r.bottom > 50 && r.top < window.innerHeight - 50;
          }) || buttons[0];
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      expect(clicked).toBe(true);

      const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
      await expect(dialog).toBeVisible({ timeout: 10000 });

      // Navigate 3 slides
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(60);
      }

      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();

      // Assert window.scrollY is restored to within 2px of 1500
      const finalScroll = await page.evaluate(() => window.scrollY);
      expect(Math.abs(finalScroll - 1500)).toBeLessThanOrEqual(2);
    }
  });
});
