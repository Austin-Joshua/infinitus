import { test, expect } from '@playwright/test';

test.describe('1-Click Calendar Sync & PWA Offline Support (Feature 3C)', () => {
  test('opens calendar sync dropdown menu, generates iCal file, and tests PWA offline mode', async ({
    page,
    request,
  }) => {
    // 1. Visit Ramanujan Reimagined event page
    await page.goto('/events/ramanujan-reimagined', { waitUntil: 'domcontentloaded' });

    // 2. Check Add to Calendar button visibility
    const calBtn = page.locator('[data-testid="add-to-calendar-button"]');
    await expect(calBtn).toBeVisible({ timeout: 10000 });

    // 3. Click to open dropdown
    await calBtn.click();
    const dropdown = page.locator('[data-testid="calendar-dropdown-menu"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // 4. Verify Google, Apple, Outlook, Yahoo options exist
    await expect(page.locator('[data-testid="calendar-opt-google"]')).toBeVisible();
    await expect(page.locator('[data-testid="calendar-opt-apple"]')).toBeVisible();
    await expect(page.locator('[data-testid="calendar-opt-outlook"]')).toBeVisible();
    await expect(page.locator('[data-testid="calendar-opt-yahoo"]')).toBeVisible();

    // Take screenshot of open Calendar Sync Dropdown Menu
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/calendar-sync-dropdown.png',
    });

    // 5. Verify direct API endpoint returns valid .ics iCalendar file
    const icsRes = await request.get('/api/events/ramanujan-reimagined/calendar');
    expect(icsRes.status()).toBe(200);
    expect(icsRes.headers()['content-type']).toContain('text/calendar');
    const icsText = await icsRes.text();
    expect(icsText).toContain('BEGIN:VCALENDAR');
    expect(icsText).toContain('BEGIN:VEVENT');
    expect(icsText).toContain('SUMMARY:Ramanujan Reimagined');
    expect(icsText).toContain('LOCATION:Green Building');

    // 6. Test PWA Offline Status Simulation
    // Close dropdown
    await page.keyboard.press('Escape');

    // Simulate browser offline
    await page.context().setOffline(true);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // Check offline status banner
    const offlineBanner = page.locator('[data-testid="pwa-offline-banner"]');
    await expect(offlineBanner).toBeVisible({ timeout: 5000 });

    // Take screenshot of PWA offline indicator
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/pwa-offline-banner.png',
    });

    // Restore online
    await page.context().setOffline(false);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });
    await expect(offlineBanner).not.toBeVisible({ timeout: 5000 });
  });
});
