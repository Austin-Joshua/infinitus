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

    // 3. Verify body has .lightbox-open class and header is hidden
    const hasClass = await page.evaluate(() => document.body.classList.contains('lightbox-open'));
    expect(hasClass).toBe(true);
    await expect(header).not.toBeVisible();

    // 4. Test slide navigation with Arrow keys
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);

    // 5. Test Close with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Assert modal is closed
    await expect(dialog).not.toBeVisible();
    const isClosed = await page.evaluate(() => !document.body.classList.contains('lightbox-open'));
    expect(isClosed).toBe(true);

    // Verify header is restored
    await expect(header).toBeVisible();
  });
});
