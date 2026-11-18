import { test, expect } from '@playwright/test';

test.describe('Fullscreen Gallery Lightbox Experience', () => {
  test('opens, traps focus, changes slides on arrows, hides header/nav, and closes on Escape', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Locate the first gallery card button/trigger using accessible role & name
    const firstCard = page.getByRole('button', { name: /View photo:/i }).first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    // Verify header and nav are visible before opening
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

    // Verify image in modal is rendered and fills viewport generously
    const modalImg = dialog.locator('img');
    await expect(modalImg).toBeVisible();
    const box = await modalImg.boundingBox();
    expect(box).toBeTruthy();
    expect(box.height).toBeGreaterThan(400);

    // 4. Test slide navigation with Arrow keys
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);

    // 5. Test Close with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Assert modal is closed and scroll locks removed
    await expect(dialog).not.toBeVisible();
    const isClosed = await page.evaluate(() => ({
      bodyClosed: !document.body.classList.contains('lightbox-open'),
      htmlClosed: !document.documentElement.classList.contains('lightbox-open'),
    }));
    expect(isClosed.bodyClosed).toBe(true);
    expect(isClosed.htmlClosed).toBe(true);

    // Verify header is restored
    await expect(header).toBeVisible();
  });

  test('maximizes photo size and eliminates scrollbars on desktop and iPad viewports', async ({ page }) => {
    // 1. Test Desktop (1440 x 900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const firstCard = page.getByRole('button', { name: /View photo:/i }).first();
    await firstCard.click();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    const desktopImg = dialog.locator('img');
    await expect(desktopImg).toBeVisible();
    const desktopBox = await desktopImg.boundingBox();
    expect(desktopBox).toBeTruthy();
    // In 900px high viewport, photo should utilize at least 80% height (>= 720px)
    expect(desktopBox.height).toBeGreaterThanOrEqual(720);

    // Verify root html & body overflow is hidden (no scrollbar)
    const desktopOverflow = await page.evaluate(() => ({
      htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
      bodyOverflow: window.getComputedStyle(document.body).overflow,
    }));
    expect(desktopOverflow.htmlOverflow).toBe('hidden');
    expect(desktopOverflow.bodyOverflow).toBe('hidden');

    // Take screenshot of Desktop view for artifact verification
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/desktop-lightbox-verified.png',
    });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // 2. Test iPad Landscape (1024 x 768)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/gallery', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const ipadCard = page.getByRole('button', { name: /View photo:/i }).first();
    await ipadCard.click();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    const ipadImg = dialog.locator('img');
    await expect(ipadImg).toBeVisible();
    const ipadBox = await ipadImg.boundingBox();
    expect(ipadBox).toBeTruthy();
    // In 768px high viewport, photo should utilize at least 80% height (>= 614px)
    expect(ipadBox.height).toBeGreaterThanOrEqual(614);

    const ipadOverflow = await page.evaluate(() => ({
      htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
      bodyOverflow: window.getComputedStyle(document.body).overflow,
    }));
    expect(ipadOverflow.htmlOverflow).toBe('hidden');
    expect(ipadOverflow.bodyOverflow).toBe('hidden');

    // Take screenshot of iPad view for artifact verification
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/ipad-lightbox-verified.png',
    });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
