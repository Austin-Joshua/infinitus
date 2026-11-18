import { test, expect } from '@playwright/test';

test.describe('Core Member Flip Cards & Detail Modal', () => {
  test('flips card to reveal poster and opens full detail modal without Official Core Member tag', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Locate Austin Joshua M card container
    const austinContainer = page.locator('.perspective-1000', { hasText: 'Austin Joshua M' });
    await expect(austinContainer).toBeVisible();
    await expect(austinContainer).toContainText('View poster & role');

    // Click card to trigger 3D flip
    await austinContainer.click();

    // Verify back face is revealed with poster image
    const backPoster = austinContainer.locator('img[src="/team/posters/austin-joshua-m.webp"]');
    await expect(backPoster).toBeVisible();

    // Find and click "Full view ↗" button on the flipped card
    const fullViewBtn = austinContainer.locator('button[data-action="details"]');
    await expect(fullViewBtn).toBeVisible();
    await fullViewBtn.click();

    // Verify detail modal opens
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify official poster is rendered in modal
    const modalPosterImg = dialog.locator('img[src="/team/posters/austin-joshua-m.webp"]');
    await expect(modalPosterImg).toBeVisible();
    await expect(modalPosterImg).toHaveAttribute('alt', 'Austin Joshua M official poster');

    // Verify details in modal
    await expect(dialog.locator('h3')).toHaveText('Austin Joshua M');
    await expect(dialog).toContainText('President');
    await expect(dialog).toContainText('Role Responsibilities');

    // Verify "Official Core Member" tag is removed
    await expect(dialog).not.toContainText('Official Core Member');

    // Close modal
    const closeBtn = dialog.locator('button[aria-label="Close"]');
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();

    // Flip card back to front face
    const flipBackBtn = austinContainer.locator('button[data-action="flip"]');
    await flipBackBtn.click();
    await expect(austinContainer).toContainText('View poster & role');
  });

  test('falls back gracefully to role icon and details for members without poster', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Locate Dr A Thilagavathy Vinoth card
    const facultyContainer = page.locator('.perspective-1000', { hasText: 'Dr A Thilagavathy Vinoth' });
    await expect(facultyContainer).toBeVisible();
    await expect(facultyContainer).toContainText('Role details');

    // Click to flip card
    await facultyContainer.click();

    // Verify revealed responsibilities on back face
    await expect(facultyContainer).toContainText('Faculty Coordinator');

    // Open full detail modal
    const fullViewBtn = facultyContainer.locator('button[data-action="details"]');
    await fullViewBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify no poster image is rendered
    await expect(dialog.locator('img[src*="/team/posters/"]')).toHaveCount(0);
    await expect(dialog.locator('h3')).toHaveText('Dr A Thilagavathy Vinoth');
    await expect(dialog).toContainText('Faculty Coordinator');
    await expect(dialog).not.toContainText('Official Core Member');

    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
