import { test, expect } from '@playwright/test';

test.describe('Events Mathematical Knowledge Graph (Feature 1C)', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept local /_vercel/* analytics requests
    await page.route('**/_vercel/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '/* mock local analytics */',
      })
    );
  });

  test('renders interactive knowledge graph, filters domains, and searches constellation without errors', async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    await page.goto('/events');

    const graphRegion = page.locator('div[role="region"][aria-label*="Knowledge Graph"]');
    await expect(graphRegion).toBeVisible();

    // Verify canvas is visible
    const canvas = graphRegion.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify domain filter pills exist
    await expect(graphRegion.getByRole('tab', { name: /all branches/i })).toBeVisible();
    const numberTheoryTab = graphRegion.getByRole('tab', { name: /number theory/i });
    await expect(numberTheoryTab).toBeVisible();

    // Click Number Theory tab
    await numberTheoryTab.click();
    await expect(numberTheoryTab).toHaveAttribute('aria-selected', 'true');

    // Click Logic & Cryptography tab
    const logicTab = graphRegion.getByRole('tab', { name: /logic & cryptography/i });
    await expect(logicTab).toBeVisible();
    await logicTab.click();
    await expect(logicTab).toHaveAttribute('aria-selected', 'true');

    // Search input test
    const searchInput = graphRegion.getByPlaceholder(/search constellation/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('ramanujan');
    await expect(searchInput).toHaveValue('ramanujan');
    await searchInput.fill('');

    // Zoom and recenter controls test
    const zoomInBtn = graphRegion.getByRole('button', { name: /zoom in/i });
    await expect(zoomInBtn).toBeVisible();
    await zoomInBtn.click();

    const zoomOutBtn = graphRegion.getByRole('button', { name: /zoom out/i });
    await expect(zoomOutBtn).toBeVisible();
    await zoomOutBtn.click();

    const recenterBtn = graphRegion.getByRole('button', { name: /reset position & zoom/i });
    await expect(recenterBtn).toBeVisible();
    await recenterBtn.click();

    // Drag interaction on canvas
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40);
      await page.mouse.up();
    }

    // Capture visual artifacts
    const artifactDir = 'C:\\Users\\austi\\.gemini\\antigravity\\brain\\74b30428-1f11-4b32-8bcd-1a9155f5bff2';

    // 1. Reset domain to All and capture desktop light
    await graphRegion.getByRole('tab', { name: /all branches/i }).click();
    await page.waitForTimeout(600);
    await graphRegion.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${artifactDir}/knowledge-graph-desktop-light.png` });

    // 2. Switch to dark mode and capture
    const themeBtn = page.getByRole('button', { name: /dark mode/i });
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(600);
      await graphRegion.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.screenshot({ path: `${artifactDir}/knowledge-graph-desktop-dark.png` });
    }

    // 3. Filter by Number Theory in dark mode and capture
    await numberTheoryTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${artifactDir}/knowledge-graph-filter.png` });

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
