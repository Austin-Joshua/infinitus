import { test, expect } from '@playwright/test';

test.describe('Web Audio Harmonic Micro-Sounds (Feature 4A)', () => {
  test('verifies SoundToggle in Navbar, localStorage persistence, and Command Palette integration', async ({
    page,
  }) => {
    // 1. Visit homepage and wait for intro curtain to lift
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1600);

    // 2. Verify SoundToggle button is mounted in header
    const soundToggle = page.locator('[data-testid="sound-toggle-button"]');
    await expect(soundToggle).toBeVisible({ timeout: 10000 });

    // Initially sound should be enabled (title contains "Mute harmonic sounds")
    await expect(soundToggle).toHaveAttribute('aria-label', /Mute harmonic sound effects/);

    // Take screenshot of Navbar with Sound Toggle button
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/sound-toggle-navbar.png',
    });

    // 3. Click to mute sound
    await soundToggle.click();
    await expect(soundToggle).toHaveAttribute('aria-label', /Enable harmonic sound effects/);

    // Verify localStorage persistence
    const storedVal = await page.evaluate(() => localStorage.getItem('infinitus_sound_enabled'));
    expect(storedVal).toBe('false');

    // 4. Click again to unmute sound
    await soundToggle.click();
    await expect(soundToggle).toHaveAttribute('aria-label', /Mute harmonic sound effects/);
    const restoredVal = await page.evaluate(() => localStorage.getItem('infinitus_sound_enabled'));
    expect(restoredVal).toBe('true');

    // 5. Open Command Palette and search for "sound"
    await page.keyboard.press('Control+KeyK');
    const palette = page.locator('[data-testid="command-palette-modal"]');
    await expect(palette).toBeVisible({ timeout: 5000 });

    const input = page.locator('[data-testid="command-palette-input"]');
    await input.fill('sound');

    // Verify sound action is listed in search results
    const soundAction = page.locator('button', { hasText: 'Toggle Harmonic Sound Effects' });
    await expect(soundAction).toBeVisible({ timeout: 5000 });

    // Take screenshot of Command Palette with Sound Action
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/sound-palette-action.png',
    });

    // 6. Execute action and verify toast
    await soundAction.click();
    const toast = page.locator('[data-testid="command-palette-toast"]');
    await expect(toast).toBeVisible({ timeout: 4000 });
    await expect(toast).toContainText('Harmonic sound effects');
  });
});
