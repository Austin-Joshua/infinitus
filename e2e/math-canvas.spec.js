import { test, expect } from '@playwright/test';

test.describe('Hero Interactive Mathematical Canvas (Feature 1A)', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept local /_vercel/* analytics requests so dev/test runs cleanly without shipping stubs
    await page.route('**/_vercel/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '/* mock local analytics */',
      })
    );
  });

  test('renders interactive math canvas, switches modes, and supports controls without console errors', async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/');

    const visualizer = page.locator('div[role="region"][aria-label*="mathematical visualizer"]');
    await expect(visualizer).toBeVisible();

    // Check canvas exists
    const canvas = visualizer.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify initial mode is Lorenz
    await expect(visualizer.getByRole('tab', { name: 'Lorenz' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(visualizer).toContainText('dx/dt = σ(y - x)');

    // Switch to Fourier
    const fourierTab = visualizer.getByRole('tab', { name: 'Fourier (∞)' });
    await fourierTab.click();
    await expect(fourierTab).toHaveAttribute('aria-selected', 'true');
    await expect(visualizer).toContainText('Tracing Lemniscate');

    // Switch to Aizawa
    const aizawaTab = visualizer.getByRole('tab', { name: 'Aizawa' });
    await aizawaTab.click();
    await expect(aizawaTab).toHaveAttribute('aria-selected', 'true');
    await expect(visualizer).toContainText('Dynamical Systems');

    // Test Play / Pause toggle & visibility retention
    const pauseBtn = visualizer.getByRole('button', { name: /pause/i });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();

    // Verify PAUSED badge appears and canvas remains completely visible
    const pausedBadge = visualizer.getByText('PAUSED');
    await expect(pausedBadge).toBeVisible();
    await expect(canvas).toBeVisible();

    const resumeBtn = visualizer.getByRole('button', { name: /resume/i });
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();
    await expect(pausedBadge).not.toBeVisible();

    // Test drag interaction on canvas
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 - 30);
      await page.mouse.up();
    }

    // Save visual screenshots to artifacts
    const artifactDir = 'C:\\Users\\austi\\.gemini\\antigravity\\brain\\74b30428-1f11-4b32-8bcd-1a9155f5bff2';

    // 1. Switch back to Lorenz to capture Lorenz in light mode
    await visualizer.getByRole('tab', { name: 'Lorenz' }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${artifactDir}/hero-math-canvas-desktop-light.png` });

    // 2. Switch to dark mode and capture Lorenz
    const themeBtn = page.getByRole('button', { name: /dark mode/i });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${artifactDir}/hero-math-canvas-desktop-dark.png` });
    }

    // 3. Pause simulation in dark mode and capture (verify it stays 100% visible)
    await pauseBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/hero-math-canvas-paused.png` });
    await resumeBtn.click();

    // 4. Switch to Fourier mode and capture in dark mode
    await fourierTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${artifactDir}/hero-math-canvas-fourier-dark.png` });

    // 5. Scroll to Instagram section and capture the compact cards
    const instagramSection = page.locator('section', { hasText: 'From our feed' });
    await instagramSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${artifactDir}/instagram-feed-cards-compact.png` });

    // Filter benign / expected warnings
    const realErrors = consoleErrors.filter(
      (msg) =>
        !msg.includes('RateLimit') &&
        !msg.includes('client-error') &&
        !msg.includes('favicon')
    );
    expect(realErrors).toEqual([]);
  });
});
