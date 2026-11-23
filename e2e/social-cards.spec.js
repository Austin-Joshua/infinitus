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

    // 2. Scilab Workshop event-specific OpenGraph image
    const scilabRes = await request.get('/events/scilab-workshop/opengraph-image');
    expect(scilabRes.status()).toBe(200);
    expect(scilabRes.headers()['content-type']).toContain('image/png');
    const scilabBody = await scilabRes.body();
    expect(scilabBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-scilab.png',
      scilabBody
    );

    // 3. Reverse Logic event-specific OpenGraph image
    const logicRes = await request.get('/events/reverse-logic/opengraph-image');
    expect(logicRes.status()).toBe(200);
    expect(logicRes.headers()['content-type']).toContain('image/png');
    const logicBody = await logicRes.body();
    expect(logicBody.length).toBeGreaterThan(1000);
    await writeFile(
      'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/og-social-card-reverse-logic.png',
      logicBody
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
