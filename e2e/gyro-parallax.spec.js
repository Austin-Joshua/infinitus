import { test, expect } from '@playwright/test';

test.describe('3D Gyro-Parallax Poster Viewer (Feature 4B)', () => {
  test('interactively tilts poster on pointer move, shows holographic glare, and opens lightbox on click', async ({
    page,
  }) => {
    // 1. Visit Ramanujan Reimagined event page
    await page.goto('/events/ramanujan-reimagined', { waitUntil: 'domcontentloaded' });

    // 2. Verify 3D Gyro-Parallax Poster elements are visible
    const container = page.locator('[data-testid="gyro-parallax-container"]');
    await expect(container).toBeVisible({ timeout: 10000 });

    const card = page.locator('[data-testid="gyro-parallax-card"]');
    await expect(card).toBeVisible();

    const glare = page.locator('[data-testid="gyro-specular-glare"]');
    await expect(glare).toBeAttached();

    // 3. Move mouse to top-right corner of the poster to trigger 3D perspective tilt & specular sheen
    const box = await container.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.15);
    await page.waitForTimeout(400); // Allow spring physics to settle into 3D tilt angle

    // Take screenshot of 3D Tilted Poster with Holographic Specular Sheen
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/gyro-parallax-tilted.png',
    });

    // 4. Test Mobile Gyroscope DeviceOrientationEvent
    await page.evaluate(() => {
      const event = new Event('deviceorientation');
      Object.assign(event, { beta: 55, gamma: 18, alpha: 0 });
      window.dispatchEvent(event);
    });
    await page.waitForTimeout(200);

    // 5. Click the poster to enlarge into full-screen LightboxModal
    await card.click();
    const lightbox = page.locator('[role="dialog"]');
    await expect(lightbox).toBeVisible({ timeout: 4000 });

    // Take screenshot of Lightbox Modal opened from 3D card
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/gyro-parallax-lightbox.png',
    });

    // 6. Dismiss lightbox with Escape
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toBeVisible({ timeout: 4000 });
  });
});
