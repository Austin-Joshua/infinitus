import { test, expect } from '@playwright/test';

test.describe('Core Member Posters & Detail Modal', () => {
  test('displays official poster in modal when core member card is clicked', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Find Austin Joshua M's card
    const austinCard = page.locator('button', { hasText: 'Austin Joshua M' });
    await expect(austinCard).toBeVisible();
    await expect(austinCard).toContainText('View poster & role');

    // Click the card to open detail modal
    await austinCard.click();

    // Verify dialog opens
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify official poster is rendered
    const posterImg = dialog.locator('img[src="/team/posters/austin-joshua-m.webp"]');
    await expect(posterImg).toBeVisible();
    await expect(posterImg).toHaveAttribute('alt', 'Austin Joshua M official poster');

    // Verify details
    await expect(dialog.locator('h3')).toHaveText('Austin Joshua M');
    await expect(dialog).toContainText('President');
    await expect(dialog).toContainText('Role Responsibilities');
    await expect(dialog).toContainText('Official Core Member');

    // Close via close button
    const closeBtn = dialog.locator('button[aria-label="Close"]');
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('falls back gracefully to avatar view for members without poster', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Find Dr A Thilagavathy Vinoth's card
    const facultyCard = page.locator('button', { hasText: 'Dr A Thilagavathy Vinoth' });
    await expect(facultyCard).toBeVisible();
    await expect(facultyCard).toContainText('Role details');

    // Click to open modal
    await facultyCard.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify initials avatar is displayed and no poster image is rendered
    await expect(dialog.locator('img[src*="/team/posters/"]')).toHaveCount(0);
    await expect(dialog.locator('h3')).toHaveText('Dr A Thilagavathy Vinoth');
    await expect(dialog).toContainText('Faculty Coordinator');

    // Close with Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
