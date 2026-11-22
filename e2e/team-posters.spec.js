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

  test('verifies Sabari Naathan D card flips and renders official poster', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Locate Sabari Naathan D card
    const sabariContainer = page.locator('.perspective-1000', { hasText: 'Sabari Naathan D' });
    await expect(sabariContainer).toBeVisible();
    await expect(sabariContainer).toContainText('View poster & role');

    // Click card to flip
    await sabariContainer.click();

    // Verify back face has Sabari's poster
    const backPoster = sabariContainer.locator('img[src="/team/posters/sabari-naathan-d.webp"]');
    await expect(backPoster).toBeVisible();

    // Open detail modal
    const fullViewBtn = sabariContainer.locator('button[data-action="details"]');
    await fullViewBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify poster in modal
    const modalPosterImg = dialog.locator('img[src="/team/posters/sabari-naathan-d.webp"]');
    await expect(modalPosterImg).toBeVisible();
    await expect(modalPosterImg).toHaveAttribute('alt', 'Sabari Naathan D official poster');
    await expect(dialog.locator('h3')).toHaveText('Sabari Naathan D');
    await expect(dialog).toContainText('PRO');

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('verifies Vijay Ragav card flips and renders official poster', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Locate Vijay Ragav card
    const vijayContainer = page.locator('.perspective-1000', { hasText: 'Vijay Ragav' });
    await expect(vijayContainer).toBeVisible();
    await expect(vijayContainer).toContainText('View poster & role');

    // Click card to flip
    await vijayContainer.click();

    // Verify back face has Vijay's poster
    const backPoster = vijayContainer.locator('img[src="/team/posters/vijay-ragav.webp"]');
    await expect(backPoster).toBeVisible();

    // Open detail modal
    const fullViewBtn = vijayContainer.locator('button[data-action="details"]');
    await fullViewBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify poster in modal
    const modalPosterImg = dialog.locator('img[src="/team/posters/vijay-ragav.webp"]');
    await expect(modalPosterImg).toBeVisible();
    await expect(modalPosterImg).toHaveAttribute('alt', 'Vijay Ragav official poster');
    await expect(dialog.locator('h3')).toHaveText('Vijay Ragav');
    await expect(dialog).toContainText('Poster Designer');

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('verifies Chris Alan card exists in Technical Team and flips to role details', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // Locate Chris Alan card
    const chrisContainer = page.locator('.perspective-1000', { hasText: 'Chris Alan' });
    await expect(chrisContainer).toBeVisible();
    await expect(chrisContainer).toContainText('Role details');

    // Click to flip card
    await chrisContainer.click();

    // Verify revealed responsibilities on back face
    await expect(chrisContainer).toContainText('Technical Coordinator');
    await expect(chrisContainer).toContainText('Supports the technical team');

    // Open full detail modal
    const fullViewBtn = chrisContainer.locator('button[data-action="details"]');
    await fullViewBtn.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify no poster image is rendered
    await expect(dialog.locator('img[src*="/team/posters/"]')).toHaveCount(0);
    await expect(dialog.locator('h3')).toHaveText('Chris Alan');
    await expect(dialog).toContainText('Technical Coordinator');
    await expect(dialog).toContainText('Technical Team');
    await expect(dialog).toContainText('CSE');
    await expect(dialog).not.toContainText('Official Core Member');

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
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

  test('switches committee categories smoothly without manual page reload (Fixes Bug #2)', async ({ page }) => {
    await page.goto('/team', { waitUntil: 'domcontentloaded' });

    // 1. Initial state: All members visible
    const allCards = page.locator('.perspective-1000');
    await expect(allCards.first()).toBeVisible({ timeout: 5000 });
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThan(15);

    // 2. Switch to "Leadership"
    const leadershipBtn = page.locator('button[type="button"]:has-text("Leadership")');
    await leadershipBtn.click();

    // Verify Leadership members load immediately without refresh
    const austinCard = page.locator('.perspective-1000', { hasText: 'Austin Joshua M' });
    await expect(austinCard).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.perspective-1000', { hasText: 'Sanjay Yuvaraj' })).toBeVisible();

    // 3. Switch to "Technical Team"
    const technicalBtn = page.locator('button[type="button"]:has-text("Technical Team")');
    await technicalBtn.click();

    // Verify Technical Team members load immediately
    const technicalCards = page.locator('.perspective-1000');
    await expect(technicalCards.first()).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.perspective-1000', { hasText: 'Chris Alan' })).toBeVisible();
    await expect(austinCard).not.toBeVisible();

    // 4. Switch to "Photography"
    const photoBtn = page.locator('button[type="button"]:has-text("Photography")');
    await photoBtn.click();
    await expect(page.locator('.perspective-1000', { hasText: 'Sam Jebaraj J' })).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.perspective-1000', { hasText: 'Balachandar' })).toBeVisible();

    // 5. Switch back to "All"
    const allBtn = page.locator('button[type="button"]:has-text("All")');
    await allBtn.click();
    await expect(austinCard).toBeVisible({ timeout: 3000 });
  });
});
