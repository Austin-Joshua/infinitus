import https from 'node:https';

async function measure(url) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    https.get(url, (res) => {
      res.once('readable', () => {
        const ttfb = performance.now() - start;
        res.resume();
        resolve(ttfb);
      });
      res.on('end', () => {});
    }).on('error', reject);
  });
}

const urls = [
  'https://infinitus-seven.vercel.app/',
  'https://infinitus-seven.vercel.app/events/scilab-workshop',
];

for (const url of urls) {
  console.log(`Measuring ${url}`);
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const t = await measure(url);
    runs.push(t);
    console.log(`  Run ${i + 1}: ${t.toFixed(1)} ms`);
  }
  runs.sort((a, b) => a - b);
  console.log(`  Median TTFB: ${runs[1].toFixed(1)} ms\n`);
}
