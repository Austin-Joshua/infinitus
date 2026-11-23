import { test, expect } from '@playwright/test';

test.describe('Featured Events Smooth Horizontal Carousel', () => {
  test('navigates smoothly via arrows, pagination dots, mouse drag, and two-finger wheel without vertical stacking', async ({
    page,
  }) => {
    await page.goto('/events', { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const carousel = page.getByRole('region', { name: 'Featured events slideshow' });
    await expect(carousel).toBeVisible({ timeout: 10000 });

    const prevBtn = carousel.getByRole('button', { name: 'Previous event' });
    const nextBtn = carousel.getByRole('button', { name: 'Next event' });
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    // Verify slide counter exists and starts at 01 / N
    const counter = carousel.locator('text=/^01 \\/ \\d+$/').first();
    await expect(counter).toBeVisible();

    // Measure initial carousel height to ensure no vertical stacking blowout
    const initialBox = await carousel.boundingBox();
    expect(initialBox).toBeTruthy();

    // Click Next
    await nextBtn.click();
    await page.waitForTimeout(450);

    // Verify slide counter advanced to 02 / N
    const counter2 = carousel.locator('text=/^02 \\/ \\d+$/').first();
    await expect(counter2).toBeVisible();

    // Verify height did not blow up or stack cards vertically
    const nextBox = await carousel.boundingBox();
    expect(Math.abs(nextBox.height - initialBox.height)).toBeLessThan(60);

    // Click Previous
    await prevBtn.click();
    await page.waitForTimeout(450);
    await expect(counter).toBeVisible();

    // Test mouse drag left (advance to next)
    const cardContainer = carousel.locator('.touch-pan-y');
    const box = await cardContainer.boundingBox();
    expect(box).toBeTruthy();

    const startX = box.x + box.width * 0.7;
    const startY = box.y + box.height * 0.5;
    const endX = box.x + box.width * 0.3;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY, { steps: 8 });
    await page.mouse.up();

    await page.waitForTimeout(450);
    await expect(counter2).toBeVisible();

    // Test two-finger trackpad horizontal wheel gesture (wheel with deltaX < -40 to go prev)
    await cardContainer.hover();
    await page.mouse.wheel(-60, 0);
    await page.waitForTimeout(450);
    await expect(counter).toBeVisible();

    // Test clicking pagination dot directly
    const dot3 = carousel.getByRole('button', { name: /Go to event 3/i });
    await expect(dot3).toBeVisible();
    await dot3.click();
    await page.waitForTimeout(450);

    const counter3 = carousel.locator('text=/^03 \\/ \\d+$/').first();
    await expect(counter3).toBeVisible();

    // Capture visual artifact evidence
    await carousel.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/featured-events-smooth-carousel.png',
    });
  });
});
