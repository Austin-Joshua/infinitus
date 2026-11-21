import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test.describe('Dynamic Edge Social Cards (Feature 3B)', () => {
  test('serves high-resolution OpenGraph cards for homepage, events and dynamic API', async ({
    request,
  }) => {
    // 1. Root homepage OpenGraph image
    const homeRes = await request.get('/opengraph-image');
    expect(homeRes.status()).toBe(200);
    expect(homeRes.headers()['content-type']).toContain('image/png');
    const homeBody = await homeRes.body();
    expect(homeBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-home.png',
      homeBody
    );

    // 2. Ramanujan Reimagined event-specific OpenGraph image
    const ramanujanRes = await request.get('/events/ramanujan-reimagined/opengraph-image');
    expect(ramanujanRes.status()).toBe(200);
    expect(ramanujanRes.headers()['content-type']).toContain('image/png');
    const ramanujanBody = await ramanujanRes.body();
    expect(ramanujanBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-ramanujan.png',
      ramanujanBody
    );

    // 3. Number Hunt event-specific OpenGraph image
    const huntRes = await request.get('/events/number-hunt/opengraph-image');
    expect(huntRes.status()).toBe(200);
    expect(huntRes.headers()['content-type']).toContain('image/png');
    const huntBody = await huntRes.body();
    expect(huntBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-number-hunt.png',
      huntBody
    );

    // 4. Edge API dynamic OG route with query parameters
    const apiRes = await request.get(
      '/api/og?title=Matrix+Reloaded+Workshop&category=Applied+Computing&date=July+2025&venue=CSE+Laboratory&status=upcoming'
    );
    expect(apiRes.status()).toBe(200);
    expect(apiRes.headers()['content-type']).toContain('image/png');
    const apiBody = await apiRes.body();
    expect(apiBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-dynamic-api.png',
      apiBody
    );
  });
});
