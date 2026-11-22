import { test, expect } from '@playwright/test';

test.describe('Header Logo Alignment and Visibility Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('infinitus-intro', '1');
    });
  });

  test('verifies both logos are properly aligned and visible without changing header height', async ({ page }) => {
    // 1. Desktop Light
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const header = page.locator('header[data-site-header="true"]');
    await expect(header).toBeVisible();

    const infinitusLogo = page.locator('header img[alt="Infinitus Club Mathematics"]').first();
    const ritLightLogo = page.locator('header img[alt="Rajalakshmi Institute of Technology"]').first();

    await expect(infinitusLogo).toBeVisible();
    await expect(ritLightLogo).toBeVisible();

    // Verify header height did not change (remains 64px content + 1px border on sm+ / desktop)
    const headerBox = await header.boundingBox();
    expect(headerBox.height).toBeCloseTo(65, 1);

    // Verify logos bounding boxes and alignment
    const infinitusBox = await infinitusLogo.boundingBox();
    const ritBox = await ritLightLogo.boundingBox();

    console.log('Desktop Infinitus logo box:', infinitusBox);
    console.log('Desktop RIT logo box:', ritBox);

    // Infinitus is 36x36 on desktop
    expect(infinitusBox.height).toBeCloseTo(36, 1);
    // RIT logo is around 30-32px height and easily readable
    expect(ritBox.height).toBeGreaterThanOrEqual(28);
    expect(ritBox.height).toBeLessThanOrEqual(34);

    // Center alignment check: vertical centers should be within 3px of each other
    const infinitusCenterY = infinitusBox.y + infinitusBox.height / 2;
    const ritCenterY = ritBox.y + ritBox.height / 2;
    const yDiff = Math.abs(infinitusCenterY - ritCenterY);
    console.log(`Vertical center diff desktop: ${yDiff}px`);
    expect(yDiff).toBeLessThanOrEqual(3);

    // Take header screenshot on desktop light mode
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/header-logos-desktop-light.png',
      clip: { x: 0, y: 0, width: 1280, height: 80 },
    });

    // 2. Desktop Dark Mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(100);
    const ritDarkLogo = page.locator('header img[alt="Rajalakshmi Institute of Technology"]:visible').first();
    await expect(ritDarkLogo).toBeVisible();

    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/header-logos-desktop-dark.png',
      clip: { x: 0, y: 0, width: 1280, height: 80 },
    });

    // 3. Mobile Viewport (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(100);

    const mobileHeaderBox = await header.boundingBox();
    // Mobile height is h-14 = 56px + 1px border = 57px
    expect(mobileHeaderBox.height).toBeCloseTo(57, 1);

    const mobileInfinitus = await infinitusLogo.boundingBox();
    const mobileRit = await ritLightLogo.boundingBox();

    console.log('Mobile Infinitus logo box:', mobileInfinitus);
    console.log('Mobile RIT logo box:', mobileRit);

    // Infinitus is 36x36
    expect(mobileInfinitus.height).toBeCloseTo(36, 1);
    // RIT is at least 24px and at most 28px
    expect(mobileRit.height).toBeGreaterThanOrEqual(24);
    expect(mobileRit.height).toBeLessThanOrEqual(28);

    const mobileInfinitusCenterY = mobileInfinitus.y + mobileInfinitus.height / 2;
    const mobileRitCenterY = mobileRit.y + mobileRit.height / 2;
    const mobileYDiff = Math.abs(mobileInfinitusCenterY - mobileRitCenterY);
    console.log(`Vertical center diff mobile: ${mobileYDiff}px`);
    expect(mobileYDiff).toBeLessThanOrEqual(2);

    // Take mobile screenshot
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/header-logos-mobile-light.png',
      clip: { x: 0, y: 0, width: 390, height: 70 },
    });

    // 4. Mobile Viewport (320px) - check no overflow
    await page.setViewportSize({ width: 320, height: 600 });
    await page.waitForTimeout(100);

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/header-logos-mobile-320px.png',
      clip: { x: 0, y: 0, width: 320, height: 70 },
    });
  });
});
