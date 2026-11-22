import { test, expect } from '@playwright/test';

test.describe('Interactive Mathematical History & Heritage Timeline (Feature 3B)', () => {
  test('renders timeline, filters by era, selects milestones, updates equations, and links to command palette', async ({
    page,
  }) => {
    // 1. Visit /about page
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // 2. Locate timeline section and scroll into view
    const timelineSection = page.locator('#math-history-timeline').first();
    await expect(timelineSection).toBeVisible({ timeout: 10000 });
    await timelineSection.scrollIntoViewIfNeeded();

    // 3. Verify default milestone card (Aryabhata)
    const activeCard = page.locator('[data-testid="math-history-active-card"]').first();
    await expect(activeCard).toBeVisible({ timeout: 5000 });
    await expect(activeCard).toContainText('Aryabhata');
    await expect(activeCard).toContainText('π ≈ 62832 / 20000 = 3.1416');

    // Take screenshot of default timeline view
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-history-timeline-desktop.png',
    });

    // 4. Click era filter pill: "Topology & Analysis"
    const topologyTab = page.locator('button[role="tab"]:has-text("Topology & Analysis")').first();
    await topologyTab.click();
    await expect(topologyTab).toHaveAttribute('aria-selected', 'true');

    // 5. Click Srinivasa Ramanujan milestone stepper node
    const ramanujanBtn = page.locator('button[aria-label="Select Srinivasa Ramanujan"]').first();
    await expect(ramanujanBtn).toBeVisible({ timeout: 5000 });
    await ramanujanBtn.click();

    // 6. Verify active card updates to Ramanujan
    await expect(activeCard).toContainText('Srinivasa Ramanujan');
    await expect(activeCard).toContainText('Partitions, Mock Theta Functions');
    await expect(activeCard).toContainText('1/π = (2√2 / 9801)');
    await expect(activeCard).toContainText('#Infinite Depth');

    // Take screenshot of Ramanujan milestone card
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-history-milestone-ramanujan.png',
    });

    // 7. Verify Command Palette search integration
    // Open Command Palette via hotkey or evaluate shortcut
    await page.keyboard.press('Control+k');
    const palette = page.locator('[data-testid="command-palette-modal"]');
    await expect(palette).toBeVisible({ timeout: 5000 });

    const searchInput = page.locator('[data-testid="command-palette-input"]');
    await searchInput.fill('heritage');

    // Verify search result item appears
    const historyResult = page.locator('button:has-text("Mathematical History & Heritage")');
    await expect(historyResult).toBeVisible({ timeout: 5000 });
  });

  test('adapts active mathematician card automatically when era card is clicked', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const timelineSection = page.locator('#math-history-timeline').first();
    await expect(timelineSection).toBeVisible({ timeout: 10000 });
    await timelineSection.scrollIntoViewIfNeeded();

    const activeCard = page.locator('[data-testid="math-history-active-card"]').first();
    await expect(activeCard).toContainText('Aryabhata');

    // 1. Click "Pioneering Calculus" -> card must adapt to Madhava immediately
    const calculusTab = page.locator('button[role="tab"]:has-text("Pioneering Calculus")');
    await calculusTab.click();
    await expect(activeCard).toContainText('Madhava of Sangamagrama');
    await expect(activeCard).toContainText('Discovery of Calculus & Infinite Power Series');
    await timelineSection.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-history-calculus-madhava.png',
    });

    // 2. Click "Chaos & Computational" -> card must adapt to Edward Lorenz immediately
    const chaosTab = page.locator('button[role="tab"]:has-text("Chaos & Computational")');
    await chaosTab.click();
    await expect(activeCard).toContainText('Edward Lorenz — Chaos Theory');
    await expect(activeCard).toContainText('Deterministic Chaos & Strange Attractors');
    await timelineSection.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-history-chaos-lorenz.png',
    });

    // 3. Click "Classical & Zero" -> card must adapt back to Aryabhata
    const classicalTab = page.locator('button[role="tab"]:has-text("Classical & Zero")');
    await classicalTab.click();
    await expect(activeCard).toContainText('Aryabhata');
  });
});
