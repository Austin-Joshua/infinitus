import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/about', '/events', '/events/scilab-workshop', '/team', '/gallery', '/contact'];

test.describe('SEO Quality & Semantic Structure', () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const route of ROUTES) {
    test(`route ${route} has exact 1 h1, unique metadata, canonical, and valid JSON-LD`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      // 1. Exactly one <h1> element
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // 2. Title presence & uniqueness
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      expect(titles.has(title)).toBe(false);
      titles.add(title);

      // 3. Description presence & uniqueness
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc).toBeTruthy();
      expect(desc?.length).toBeGreaterThan(15);
      expect(descriptions.has(desc)).toBe(false);
      descriptions.add(desc);

      // 4. Canonical link tag presence
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical?.startsWith('http')).toBe(true);

      // 5. Valid JSON-LD scripts that parse without syntax errors
      const jsonLdElements = await page.locator('script[type="application/ld+json"]').all();
      expect(jsonLdElements.length).toBeGreaterThan(0);
      for (const el of jsonLdElements) {
        const text = await el.textContent();
        expect(text).toBeTruthy();
        const parsed = JSON.parse(text || '{}');
        expect(parsed['@context']).toBe('https://schema.org');
      }
    });
  }

  test('/robots.txt serves valid directives and sitemap link', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('User-Agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('Sitemap:');
  });

  test('/sitemap.xml serves valid XML listing core routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('/about');
    expect(body).toContain('/events');
    expect(body).toContain('/team');
    expect(body).toContain('/gallery');
    expect(body).toContain('/contact');
  });
});
