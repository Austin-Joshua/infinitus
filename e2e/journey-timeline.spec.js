import { test, expect } from '@playwright/test';

test.describe('Our Journey So Far - Pristine Initial Layout & 3D Flip to Enlarged Modal', () => {
  test('displays cards in clean initial position and flips into enlarged retrospective on click', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // Scroll to Journey section
    const journeySection = page.locator('#journey-timeline').first();
    await expect(journeySection).toBeVisible({ timeout: 10000 });
    await journeySection.scrollIntoViewIfNeeded();

    // 1. Verify all 4 cards start in clean, upright front position with bold symbols
    const card2023 = journeySection.locator('[data-year="2023"]');
    const card2024 = journeySection.locator('[data-year="2024"]');
    const card2025 = journeySection.locator('[data-year="2025"]');
    const card2026 = journeySection.locator('[data-year="2026"]');

    await expect(card2023).toBeVisible({ timeout: 5000 });
    await expect(card2023).toContainText('First steps & Genesis');
    await expect(card2023).toContainText('∞');
    await expect(card2023).toContainText('Foundations');
    await expect(card2023).toContainText('National Mathematics Day');

    await expect(card2024).toBeVisible({ timeout: 5000 });
    await expect(card2024).toContainText('Finding our rhythm');
    await expect(card2024).toContainText('∑');
    await expect(card2024).toContainText('Expansion');
    await expect(card2024).toContainText("Math-O-Fest '24");

    await expect(card2025).toBeVisible({ timeout: 5000 });
    await expect(card2025).toContainText('Growing louder & Flagship');
    await expect(card2025).toContainText('∫');
    await expect(card2025).toContainText('Recognition');
    await expect(card2025).toContainText("Mathspire Expilog '25");
    await expect(card2025).toContainText('The Math Podcast');

    await expect(card2026).toBeVisible({ timeout: 5000 });
    await expect(card2026).toContainText('Beyond campus & Horizons');
    await expect(card2026).toContainText('π');
    await expect(card2026).toContainText('Championship');
    await expect(card2026).toContainText('SHINKA Strikers 2026');
    await expect(card2026).toContainText('Algo-Odyssey Challenge');

    // Take screenshot of the clean initial position with all 4 upright cards
    await page.waitForTimeout(400);
    const timelineContainer = journeySection.locator('ol.grid');
    await timelineContainer.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/journey-timeline-pristine-initial.png',
    });

    // 2. Test 2026: Clicking the card executes 3D flip and opens enlarged retrospective modal
    await card2026.click();

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('2026');
    await expect(dialog).toContainText('π');
    await expect(dialog).toContainText('Beyond campus & Horizons');
    await expect(dialog).toContainText('SHINKA Strikers 2026 Championship');
    await expect(dialog).toContainText('The Year’s Retrospective');
    await expect(dialog).toContainText('Legacy & Impact');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 3000 });

    // Verify 2026 card resets to clean upright front position
    await expect(card2026).toContainText('Beyond campus & Horizons');

    // 3. Test 2025: Clicking the card executes 3D flip and opens enlarged retrospective modal
    await card2025.click();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('2025');
    await expect(dialog).toContainText('∫');
    await expect(dialog).toContainText('Mathspire Expilog');
    await expect(dialog).toContainText('500+');
    await expect(dialog).toContainText('Expilog Contenders');
    await expect(dialog).toContainText('State & College Award');

    // Capture screenshot of the enlarged 2025 modal with bold symbols and rich stats
    await page.waitForTimeout(400);
    await dialog.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/journey-2025-modal-enlarged.png',
    });

    // Close modal via Done Reading button
    const doneBtn = dialog.locator('button:has-text("Done Reading")');
    await doneBtn.click();
    await expect(dialog).not.toBeVisible({ timeout: 3000 });

    // 4. Verify all cards are back in their initial front position
    await expect(card2023).toContainText('First steps & Genesis');
    await expect(card2024).toContainText('Finding our rhythm');
    await expect(card2025).toContainText('Growing louder & Flagship');
    await expect(card2026).toContainText('Beyond campus & Horizons');
  });
});
