import { test, expect } from '@playwright/test';

test.describe('Web Audio Harmonic Micro-Sounds (Feature 4A)', () => {
  test('verifies clean header, Command Palette audio toggle, and localStorage persistence', async ({
    page,
  }) => {
    // 1. Visit homepage and wait for intro curtain
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1600);

    // 2. Verify header is clean and does NOT have a sound button
    const soundToggle = page.locator('[data-testid="sound-toggle-button"]');
    await expect(soundToggle).toHaveCount(0);

    // Take screenshot of clean header
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/sound-clean-header.png',
    });

    // 3. Open Command Palette and search for "sound"
    await page.keyboard.press('Control+KeyK');
    const palette = page.locator('[data-testid="command-palette-modal"]');
    await expect(palette).toBeVisible({ timeout: 5000 });

    const input = page.locator('[data-testid="command-palette-input"]');
    await input.fill('sound');

    // Verify sound action is listed in search results
    const soundAction = page.locator('button', { hasText: 'Toggle Harmonic Sound Effects' });
    await expect(soundAction).toBeVisible({ timeout: 5000 });

    // 4. Execute action via click and verify toast notification
    await soundAction.click();
    const toast = page.locator('[data-testid="command-palette-toast"]');
    await expect(toast).toBeVisible({ timeout: 4000 });
    await expect(toast).toContainText('Harmonic sound effects');

    // Verify localStorage persistence
    const storedVal = await page.evaluate(() => localStorage.getItem('infinitus_sound_enabled'));
    expect(storedVal).toBe('false');
  });
});
