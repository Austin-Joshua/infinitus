import { chromium, devices } from '@playwright/test';
import { spawn } from 'node:child_process';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) return;
    } catch (e) {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server failed to start at ${url} within ${timeout}ms`);
}

async function profileRoute(browser, routeName, path) {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  
  // 4x CPU slowdown
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });

  // Setup performance observer for long tasks and frame timings
  await page.evaluate(() => {
    window.__longTasks = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__longTasks.push(entry.duration);
      }
    });
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // fallback
    }

    window.__frames = [];
    window.__recording = true;
    let prev = performance.now();
    function tick(now) {
      window.__frames.push(now - prev);
      prev = now;
      if (window.__recording) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  });

  // Perform continuous scrolling up and down for 3 seconds
  const start = Date.now();
  while (Date.now() - start < 3000) {
    await page.evaluate(() => {
      window.scrollBy({ top: 120, behavior: 'instant' });
    });
    await page.waitForTimeout(30);
  }

  const results = await page.evaluate(() => {
    window.__recording = false;
    const frames = window.__frames || [];
    const longTasks = window.__longTasks || [];
    const totalFrameTime = frames.reduce((a, b) => a + b, 0);
    const avgFrameDuration = frames.length > 0 ? totalFrameTime / frames.length : 16.6;
    const fps = avgFrameDuration > 0 ? 1000 / avgFrameDuration : 60;
    const jankFrames = frames.filter((d) => d > 33.3).length; // frames > 33ms (dropped below 30fps)
    const totalLongTaskDuration = longTasks.reduce((a, b) => a + b, 0);

    return {
      framesCount: frames.length,
      fps: Math.round(fps * 10) / 10,
      jankFrames,
      longTaskCount: longTasks.length,
      totalLongTaskDurationMs: Math.round(totalLongTaskDuration * 10) / 10,
    };
  });

  await context.close();
  return results;
}

async function main() {
  console.log('Starting Next.js production server for profiling...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', '3000'], {
    cwd: process.cwd(),
    stdio: 'ignore',
  });

  try {
    await waitForServer('http://localhost:3000');
    console.log('Server is running at http://localhost:3000');

    const browser = await chromium.launch();
    try {
      console.log('--- Profiling Performance (4x CPU Slowdown, iPhone 14) ---');
      const homeMetrics = await profileRoute(browser, 'Home Page (/)', '/');
      console.log('Home Page (/):', JSON.stringify(homeMetrics, null, 2));

      const galleryMetrics = await profileRoute(browser, 'Gallery Page (/gallery)', '/gallery');
      console.log('Gallery Page (/gallery):', JSON.stringify(galleryMetrics, null, 2));
    } finally {
      await browser.close();
    }
  } finally {
    console.log('Stopping server...');
    spawn('cmd.exe', ['/c', 'taskkill', '/F', '/T', '/PID', server.pid.toString()]);
  }
}

main().catch(console.error);
