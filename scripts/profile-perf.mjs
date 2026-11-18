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

async function profileRoute(browser, path) {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  // 4x CPU slowdown
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`http://localhost:3000${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

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
    } catch (e) {}

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

  // Perform continuous scrolling for 3 seconds
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
      console.log('\n--- Throttled-CPU Profile (4x Slowdown, iPhone 14 Viewport) ---');

      // 3 runs on Home (/)
      const homeRuns = [];
      for (let i = 0; i < 3; i++) {
        const res = await profileRoute(browser, '/');
        homeRuns.push(res);
        console.log(`  Run ${i + 1} [/]: FPS = ${res.fps}, Jank Frames = ${res.jankFrames}`);
      }
      homeRuns.sort((a, b) => a.fps - b.fps);
      const homeMedian = homeRuns[1];

      // 3 runs on Gallery (/gallery)
      const galleryRuns = [];
      for (let i = 0; i < 3; i++) {
        const res = await profileRoute(browser, '/gallery');
        galleryRuns.push(res);
        console.log(`  Run ${i + 1} [/gallery]: FPS = ${res.fps}, Jank Frames = ${res.jankFrames}`);
      }
      galleryRuns.sort((a, b) => a.fps - b.fps);
      const galleryMedian = galleryRuns[1];

      console.log('\n======================================================');
      console.log('PROFILING RESULTS SUMMARY');
      console.log('======================================================');
      console.log(`Route [/] Median FPS: ${homeMedian.fps}, Median Jank Frames: ${homeMedian.jankFrames}`);
      console.log(`Route [/gallery] Median FPS: ${galleryMedian.fps}, Median Jank Frames: ${galleryMedian.jankFrames}`);

      return { homeMedian, galleryMedian };
    } finally {
      await browser.close();
    }
  } finally {
    console.log('Stopping server...');
    spawn('cmd.exe', ['/c', 'taskkill', '/F', '/T', '/PID', server.pid.toString()]);
  }
}

main().catch(console.error);
