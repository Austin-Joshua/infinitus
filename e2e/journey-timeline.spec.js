import { test, expect } from '@playwright/test';

test.describe('Our Journey So Far - 3D Flip & Enlarged Year Retrospective', () => {
  test('flips 2026 card in 3D and opens full year retrospective modal', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // Scroll to Journey section
    const journeyHeading = page.locator('h2:has-text("Our journey so far")');
    await expect(journeyHeading).toBeVisible({ timeout: 10000 });
    await journeyHeading.scrollIntoViewIfNeeded();

    // Locate 2026 milestone card container
    const card2026 = page.locator('.perspective-1000', { hasText: '2026' });
    await expect(card2026).toBeVisible({ timeout: 5000 });
    await expect(card2026).toContainText('Beyond campus & Horizons');

    // 1. Flip card to back
    const flipBtn = card2026.locator('button:has-text("Flip stats")');
    await flipBtn.click();

    // Verify back face is visible with archive details
    await expect(card2026).toContainText('2026 Archive');
    await expect(card2026).toContainText('Total Events');

    // 2. Open enlarged retrospective modal from back face
    const enlargeBtn = card2026.locator('button:has-text("Enlarge details ↗")');
    await enlargeBtn.click();

    // Verify modal dialog opens
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('2026');
    await expect(dialog).toContainText('Beyond campus & Horizons');
    await expect(dialog).toContainText('SHINKA Strikers 2026 Championship');
    await expect(dialog).toContainText('The Year’s Retrospective');
    await expect(dialog).toContainText('Legacy & Impact');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 3000 });

    // 3. Flip card back to front
    const frontFlipBtn = card2026.locator('button:has-text("Front")');
    await frontFlipBtn.click();
    await expect(card2026).toContainText('Beyond campus & Horizons');

    // 4. Open modal directly from front face via "Full story ↗"
    const fullStoryBtn = card2026.locator('button:has-text("Full story ↗")');
    await fullStoryBtn.click();
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Close modal via Done Reading button
    const doneBtn = dialog.locator('button:has-text("Done Reading")');
    await doneBtn.click();
    await expect(dialog).not.toBeVisible({ timeout: 3000 });

    // 5. Test 2025 card: Clicking the card flips AND enlarges directly to detailed view
    const card2025 = page.locator('.perspective-1000', { hasText: '2025' });
    await expect(card2025).toBeVisible();

    // Flip to back first to capture aligned back face
    const flip2025Btn = card2025.locator('button:has-text("Flip stats")');
    await flip2025Btn.click();
    await page.waitForTimeout(300);
    await card2025.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/journey-2025-card-aligned.png',
    });

    // Clicking anywhere on the card enlarges directly to detailed view
    await card2025.click();

    // Verify modal opens with 2025 retrospective and aligned stats
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('2025');
    await expect(dialog).toContainText('Mathspire Expilog');
    await expect(dialog).toContainText('500+');
    await expect(dialog).toContainText('Expilog Contenders');
    await expect(dialog).toContainText('State & College Award');

    await page.waitForTimeout(300);
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/journey-2025-modal-enlarged.png',
    });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 3000 });
  });
});
