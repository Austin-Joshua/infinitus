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

async function profileRoute(browser, path, port = 3000) {
  const context = await browser.newContext({
    ...devices['iPhone 14'],
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  // 4x CPU slowdown
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Setup performance observer for frame timings and rolling window
  await page.evaluate(() => {
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

  // Smooth scroll top-to-bottom over 4000ms
  const scrollDurationMs = 4000;
  const start = Date.now();
  while (Date.now() - start < scrollDurationMs) {
    await page.evaluate(() => {
      window.scrollBy({ top: 35, behavior: 'instant' });
    });
    await page.waitForTimeout(25);
  }

  const results = await page.evaluate(() => {
    window.__recording = false;
    const frames = window.__frames || [];
    const totalFrameTime = frames.reduce((a, b) => a + b, 0);
    const avgFrameDuration = frames.length > 0 ? totalFrameTime / frames.length : 16.6;
    const meanFps = avgFrameDuration > 0 ? 1000 / avgFrameDuration : 60;
    const jankFrames = frames.filter((d) => d > 33.3).length; // frames > 33.3ms (dropped below 30fps)

    // Calculate worst-case FPS in any rolling 1-second (1000ms) window
    let worstWindowFps = meanFps;
    if (frames.length > 0) {
      // Cumulative timestamps
      const timestamps = [];
      let acc = 0;
      for (const dur of frames) {
        acc += dur;
        timestamps.push(acc);
      }

      let minFramesInSec = Infinity;
      let left = 0;
      for (let right = 0; right < timestamps.length; right++) {
        while (timestamps[right] - timestamps[left] > 1000) {
          left++;
        }
        if (timestamps[right] >= 1000) {
          const countInSec = right - left + 1;
          if (countInSec < minFramesInSec) {
            minFramesInSec = countInSec;
          }
        }
      }
      if (minFramesInSec !== Infinity) {
        worstWindowFps = minFramesInSec;
      }
    }

    return {
      framesCount: frames.length,
      fps: Math.round(meanFps * 10) / 10,
      worstWindowFps: Math.round(worstWindowFps * 10) / 10,
      jankFrames,
    };
  });

  await context.close();
  return results;
}

function computeStats(runs) {
  const fpsList = runs.map((r) => r.fps);
  const worstList = runs.map((r) => r.worstWindowFps);
  const jankList = runs.map((r) => r.jankFrames);

  // Median FPS
  const sortedFps = [...fpsList].sort((a, b) => a - b);
  const medianFps = sortedFps[Math.floor(sortedFps.length / 2)];

  // Median worst-case window FPS
  const sortedWorst = [...worstList].sort((a, b) => a - b);
  const medianWorstFps = sortedWorst[Math.floor(sortedWorst.length / 2)];

  // Median jank frames
  const sortedJank = [...jankList].sort((a, b) => a - b);
  const medianJank = sortedJank[Math.floor(sortedJank.length / 2)];

  // Standard deviation of FPS
  const meanFps = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
  const variance = fpsList.reduce((sum, val) => sum + Math.pow(val - meanFps, 2), 0) / fpsList.length;
  const stdDevFps = Math.round(Math.sqrt(variance) * 100) / 100;

  return {
    runs,
    medianFps,
    medianWorstFps,
    medianJank,
    stdDevFps,
  };
}

async function runBenchmark(port = 3000) {
  const browser = await chromium.launch();
  try {
    console.log(`\n--- Profiling 5 runs on Home (/) ---`);
    const homeRuns = [];
    for (let i = 0; i < 5; i++) {
      const res = await profileRoute(browser, '/', port);
      homeRuns.push(res);
      console.log(`  Run ${i + 1} [/]: FPS=${res.fps}, WorstWindowFPS=${res.worstWindowFps}, Jank=${res.jankFrames}`);
    }
    const homeStats = computeStats(homeRuns);

    console.log(`\n--- Profiling 5 runs on Gallery (/gallery) ---`);
    const galleryRuns = [];
    for (let i = 0; i < 5; i++) {
      const res = await profileRoute(browser, '/gallery', port);
      galleryRuns.push(res);
      console.log(`  Run ${i + 1} [/gallery]: FPS=${res.fps}, WorstWindowFPS=${res.worstWindowFps}, Jank=${res.jankFrames}`);
    }
    const galleryStats = computeStats(galleryRuns);

    return { homeStats, galleryStats };
  } finally {
    await browser.close();
  }
}

async function main() {
  const customPort = (process.env.BENCHMARK_PORT || '3005').trim();
  let server = null;

  // Check if server is already running on port
  let serverNeedsSpawn = false;
  try {
    const res = await fetch(`http://localhost:${customPort}`);
    if (!res.ok && res.status !== 200 && res.status !== 304) {
      serverNeedsSpawn = true;
    }
  } catch (e) {
    serverNeedsSpawn = true;
  }

  if (serverNeedsSpawn) {
    console.log(`Starting Next.js production server on port ${customPort}...`);
    server = spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', String(customPort)], {
      cwd: process.cwd(),
      stdio: 'ignore',
    });
    await waitForServer(`http://localhost:${customPort}`);
    console.log(`Server is running at http://localhost:${customPort}`);
  } else {
    console.log(`Reusing running server at http://localhost:${customPort}`);
  }

  try {
    const { homeStats, galleryStats } = await runBenchmark(customPort);

    console.log('\n======================================================');
    console.log('5-RUN BENCHMARK SUMMARY (4x CPU Slowdown, iPhone 14)');
    console.log('======================================================');
    console.log(`Route [/]:`);
    console.log(`  Median FPS: ${homeStats.medianFps}`);
    console.log(`  Worst-Window FPS: ${homeStats.medianWorstFps}`);
    console.log(`  Jank Frames (>33.3ms): ${homeStats.medianJank}`);
    console.log(`  Std Dev: ${homeStats.stdDevFps}`);
    console.log(`Route [/gallery]:`);
    console.log(`  Median FPS: ${galleryStats.medianFps}`);
    console.log(`  Worst-Window FPS: ${galleryStats.medianWorstFps}`);
    console.log(`  Jank Frames (>33.3ms): ${galleryStats.medianJank}`);
    console.log(`  Std Dev: ${galleryStats.stdDevFps}`);

    console.log('\nJSON Output:');
    console.log(JSON.stringify({ homeStats, galleryStats }, null, 2));
  } finally {
    if (server) {
      console.log('Stopping server...');
      spawn('cmd.exe', ['/c', 'taskkill', '/F', '/T', '/PID', server.pid.toString()]);
    }
  }
}

main().catch(console.error);
