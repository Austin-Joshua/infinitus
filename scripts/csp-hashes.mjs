import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function getFiles(dir, all = []) {
  if (!fs.existsSync(dir)) return all;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) getFiles(full, all);
    else if (f.endsWith('.js') || f.endsWith('.css')) all.push(full);
  }
  return all;
}

const files = getFiles('.next/static');
console.log(`Total static bundle chunks: ${files.length}`);

const hashes = files.map((file) => {
  const content = fs.readFileSync(file);
  return `'sha256-${crypto.createHash('sha256').update(content).digest('base64')}'`;
});

const scriptDirective = `script-src 'self' ${hashes.join(' ')}`;
const fullCsp = `default-src 'self'; ${scriptDirective}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self' https://forms.gle https://docs.google.com; frame-ancestors 'none'; upgrade-insecure-requests;`;

const headerBytes = Buffer.byteLength(fullCsp, 'utf8');

console.log(`\nOption B (Build-Time Hash-based CSP) Measurements:`);
console.log(`--------------------------------------------------`);
console.log(`Total Hashes included: ${hashes.length}`);
console.log(`Script-src directive length: ${Buffer.byteLength(scriptDirective, 'utf8')} bytes`);
console.log(`Total Content-Security-Policy header size: ${headerBytes} bytes (${(headerBytes / 1024).toFixed(2)} KB)`);
console.log(`Exceeds 8 KB CDN Header Buffer Limit: ${headerBytes > 8192 ? 'YES (OVERFLOW RISK)' : 'NO'}`);
