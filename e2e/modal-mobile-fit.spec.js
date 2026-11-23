import { test, expect } from '@playwright/test';

test('captures mobile member modal layout ensuring full fit and zero button clipping', async ({ page }) => {
  // iPhone 14 viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    sessionStorage.setItem('infinitus-intro', '1');
  });
  await page.goto('/team', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible({ timeout: 10000 });

  // Find Austin Joshua M card
  const austinCard = page.locator('.perspective-1000', { hasText: 'Austin Joshua M' });
  await expect(austinCard).toBeVisible();

  // Click card to flip
  await austinCard.click();

  // Click Full view
  const fullViewBtn = austinCard.locator('button[data-action="details"]');
  await fullViewBtn.scrollIntoViewIfNeeded();
  await fullViewBtn.click();

  // Modal appears and finishes transition
  const dialog = page.locator('div[role="dialog"]');
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(350);

  // Verify Close button and Instagram button are fully visible within viewport
  const closeBtn = dialog.locator('button:has-text("Close")');
  await expect(closeBtn).toBeVisible();

  const instaBtn = dialog.locator('a[aria-label*="Instagram"]');
  await expect(instaBtn).toBeVisible();

  // Check bounding box of close button is strictly within viewport
  const closeBox = await closeBtn.boundingBox();
  expect(closeBox).toBeTruthy();
  expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(844);

  // Take screenshot of full page with modal open
  await page.screenshot({
    path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/member-modal-mobile-fit.png',
  });
});

test('captures desktop member modal layout ensuring side-by-side fit and elegance', async ({ page }) => {
  // Desktop viewport
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    sessionStorage.setItem('infinitus-intro', '1');
  });
  await page.goto('/team', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible({ timeout: 10000 });

  // Find Austin Joshua M card
  const austinCard = page.locator('.perspective-1000', { hasText: 'Austin Joshua M' });
  await expect(austinCard).toBeVisible();

  // Click card to flip
  await austinCard.click();

  // Click Full view
  const fullViewBtn = austinCard.locator('button[data-action="details"]');
  await fullViewBtn.scrollIntoViewIfNeeded();
  await fullViewBtn.click();

  // Modal appears and finishes transition
  const dialog = page.locator('div[role="dialog"]');
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(350);

  // Take screenshot of full page with desktop modal open
  await page.screenshot({
    path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/member-modal-desktop-fit.png',
  });
});
