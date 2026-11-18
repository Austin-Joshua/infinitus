import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/about', '/events', '/events/scilab-workshop', '/team', '/gallery', '/contact'];

test.describe('SEO Quality & Semantic Structure', () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const route of ROUTES) {
    test(`route ${route} has exact 1 h1, valid lang, heading hierarchy, unique metadata, canonical, and valid JSON-LD`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      // 1. Valid html lang="en"
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');

      // 2. Exactly one <h1> element
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // 3. Heading hierarchy: headings start with h1 and never skip levels (e.g. h1 -> h3 is disallowed)
      const headingReport = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          .map((el) => ({ level: parseInt(el.tagName.substring(1), 10), text: el.textContent?.trim().slice(0, 30) }));
        if (headings.length === 0) return { valid: false, reason: 'No headings found' };
        if (headings[0].level !== 1) return { valid: false, reason: `First heading is h${headings[0].level}, expected h1` };

        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1].level;
          const curr = headings[i].level;
          if (curr > prev + 1) {
            return { valid: false, reason: `Skipped heading level from h${prev} to h${curr} at "${headings[i].text}"` };
          }
        }
        return { valid: true };
      });
      expect(headingReport.valid, headingReport.reason).toBe(true);

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
