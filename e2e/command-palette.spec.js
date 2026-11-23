import { test, expect } from '@playwright/test';

test.describe('Global Command Palette (Feature 3A)', () => {
  test('opens palette via search button, searches events, navigates, and dismisses with Escape', async ({
    page,
  }) => {
    // 1. Visit landing page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 2. Locate search trigger button in navbar (desktop or mobile)
    const searchBtn = page.locator('[data-testid="nav-search-button"], [data-testid="mobile-search-button"]').first();
    await expect(searchBtn).toBeVisible({ timeout: 10000 });

    // 3. Click the search button to open the command palette
    await searchBtn.click();

    // 4. Modal and search input must be visible
    const modal = page.locator('[data-testid="command-palette-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    const input = page.locator('[data-testid="command-palette-input"]');
    await expect(input).toBeFocused();

    // 5. Check default suggestions exist
    const options = page.locator('[role="option"]');
    await expect(options.first()).toBeVisible();

    // Take screenshot of default Command Palette (Dark Mode)
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/command-palette-dark.png',
    });

    // 6. Search for "Scilab"
    await input.fill('Scilab');

    // Wait for filtered option to be visible
    const scilabOption = page.locator('[role="option"]', { hasText: 'Numerical Aspects of Scilab' }).first();
    await expect(scilabOption).toBeVisible();

    // Take screenshot of search results state
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/command-palette-search.png',
    });

    // 7. Test Arrow navigation
    await page.keyboard.press('ArrowDown');

    // 8. Test Escape key dismisses palette
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    // 9. Test keyboard shortcut Control+k / Meta+k opens palette
    await page.keyboard.press('Control+k');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // 10. Switch to light mode and capture light mode styling
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    // Toggle theme to light mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('infinitus-theme', 'light');
      } catch (e) {}
    });
    await page.waitForTimeout(300);

    // Re-open palette in light mode
    await page.keyboard.press('Control+k');
    await expect(modal).toBeVisible({ timeout: 5000 });

    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/command-palette-light.png',
    });
  });
});
