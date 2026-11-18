import https from 'node:https';
import http from 'node:http';
import { URL } from 'node:url';

const BASE_URL = process.env.SITE_URL || 'https://infinitus-seven.vercel.app';
const ROUTES = ['/', '/events', '/events/scilab-workshop', '/gallery'];
const RUNS_PER_ROUTE = 5;

/**
 * Measure TTFB (Time to First Byte) using low-level node http/https request.
 * TTFB is measured from socket connection / start to the first response byte event.
 */
function measureRequestTTFB(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;
    const start = performance.now();

    const req = client.request(
      parsed,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js TTFB Benchmark)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (res) => {
        let firstByteTime = null;
        res.once('data', () => {
          if (firstByteTime === null) {
            firstByteTime = performance.now() - start;
          }
        });

        res.on('end', () => {
          const ttfb = firstByteTime !== null ? firstByteTime : performance.now() - start;
          resolve({
            statusCode: res.statusCode,
            ttfbMs: Math.round(ttfb * 10) / 10,
            cacheStatus: res.headers['x-vercel-cache'] || 'MISS/DYNAMIC',
          });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

async function runBenchmark() {
  console.log(`\n======================================================`);
  console.log(`Live TTFB Benchmark Suite: ${BASE_URL}`);
  console.log(`======================================================\n`);

  const results = {};

  for (const route of ROUTES) {
    const fullUrl = `${BASE_URL}${route}`;
    const samples = [];
    console.log(`Benchmarking ${route} (${RUNS_PER_ROUTE} iterations)...`);

    for (let i = 0; i < RUNS_PER_ROUTE; i++) {
      try {
        const sample = await measureRequestTTFB(fullUrl);
        samples.push(sample);
        // Small delay between requests to simulate real traffic
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`  Run ${i + 1} failed:`, err.message);
      }
    }

    if (samples.length === 0) continue;

    const coldRun = samples[0];
    const warmRuns = samples.slice(1);
    const warmTimes = warmRuns.map((s) => s.ttfbMs).sort((a, b) => a - b);
    const medianWarm =
      warmTimes.length % 2 === 1
        ? warmTimes[Math.floor(warmTimes.length / 2)]
        : (warmTimes[warmTimes.length / 2 - 1] + warmTimes[warmTimes.length / 2]) / 2;
    const worstWarm = warmTimes[warmTimes.length - 1];

    results[route] = {
      coldTTFB: coldRun.ttfbMs,
      coldCache: coldRun.cacheStatus,
      warmMedian: Math.round(medianWarm * 10) / 10,
      warmWorst: worstWarm,
      warmSamples: warmTimes,
    };
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`TTFB Benchmark Summary Table`);
  console.log(`------------------------------------------------------`);
  console.table(
    Object.entries(results).map(([route, r]) => ({
      Route: route,
      'Cold TTFB (ms)': r.coldTTFB,
      'Warm Median (ms)': r.warmMedian,
      'Warm Worst (ms)': r.warmWorst,
      'Vercel Cache': r.coldCache,
    }))
  );

  return results;
}

runBenchmark().catch(console.error);
