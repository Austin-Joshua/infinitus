/**
 * Internal Link & Anchor Integrity Crawler.
 * Run: npm run check:links
 *
 * Enforces:
 * 1. Crawls all public routes of the built website.
 * 2. Asserts no internal link leads to HTTP 404.
 * 3. Asserts no broken or empty href="#" links exist (except valid #main skip links).
 */
import http from 'node:http';
import { spawn } from 'node:child_process';

const PORT = 3008;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const START_ROUTES = [
  '/',
  '/about',
  '/events',
  '/events/scilab-workshop',
  '/team',
  '/gallery',
  '/contact',
];

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = http.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close();
        resolve(true);
      })
      .listen(port, '127.0.0.1');
  });
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function main() {
  console.log('Verifying link integrity across all site routes…');

  let serverProcess = null;
  const available = await isPortAvailable(PORT);

  if (available) {
    console.log(`Starting ephemeral production server on port ${PORT}…`);
    serverProcess = spawn('npx', ['next', 'start', '-p', String(PORT)], {
      shell: true,
      stdio: 'pipe',
    });
    await waitForServer(BASE_URL);
  }

  const visited = new Set();
  const queue = [...START_ROUTES];
  let errors = [];
  let linksChecked = 0;

  try {
    while (queue.length > 0) {
      const currentPath = queue.shift();
      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      const targetUrl = `${BASE_URL}${currentPath}`;
      let res;
      try {
        res = await fetch(targetUrl);
      } catch (err) {
        errors.push(`Failed to fetch ${currentPath}: ${err.message}`);
        continue;
      }

      if (res.status === 404) {
        errors.push(`Internal 404 link found: ${currentPath}`);
        continue;
      }

      const html = await res.text();

      // Extract all href attributes
      const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]);

      for (const href of hrefMatches) {
        linksChecked++;

        // Check for broken bare href="#"
        if (href === '#' || href === '#!') {
          errors.push(`Broken placeholder link href="${href}" found on page: ${currentPath}`);
          continue;
        }

        // Check hash links on current page
        if (href.startsWith('#')) {
          const id = href.slice(1);
          if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
            errors.push(`Broken hash anchor href="${href}" missing target id on page: ${currentPath}`);
          }
          continue;
        }

        // Internal site links
        if (href.startsWith('/') && !href.startsWith('//')) {
          const cleanPath = href.split('#')[0].split('?')[0];
          // Skip static asset files and api routes
          if (cleanPath.startsWith('/_next') || cleanPath.startsWith('/api') || cleanPath.includes('.')) {
            continue;
          }
          if (!visited.has(cleanPath) && !queue.includes(cleanPath)) {
            queue.push(cleanPath);
          }
        }
      }
    }
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  }

  console.log(`\nLink Check Summary:`);
  console.log(`  Pages crawled: ${visited.size}`);
  console.log(`  Total links analyzed: ${linksChecked}`);

  if (errors.length > 0) {
    console.error(`\n❌ Link check failed with ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  ✖ ${e}`));
    process.exit(1);
  } else {
    console.log(`✓ All internal links and anchor targets valid (0 broken links, 0 internal 404s).`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
