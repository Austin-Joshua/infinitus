/**
 * Generates web-optimized branding assets from /assets/brand/source.
 * Run: npm run branding:optimize
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'assets', 'brand', 'source');
const OUT_DIR = path.join(ROOT, 'public', 'brand');
const APP_DIR = path.join(ROOT, 'app');

const SOURCES = {
  infinitus: 'infinitus-logo.png',
  rit: 'rit-logo-black.png',
  ritWhite: 'rit-logo-white-transparent.png',
};

const INFINITUS_VARIANTS = [
  { name: 'infinitus-nav', size: 80, quality: 88 },
  { name: 'infinitus-hero', size: 320, quality: 92 },
  { name: 'infinitus-footer', size: 112, quality: 90 },
  { name: 'infinitus-loader', size: 256, quality: 92 },
];

const RIT_VARIANTS = [
  { name: 'rit-sm', width: 160, quality: 90 },
  { name: 'rit-md', width: 220, quality: 90 },
  { name: 'rit-lg', width: 280, quality: 92 },
];

const RIT_WHITE_VARIANTS = [
  { name: 'rit-white-sm', width: 160, quality: 92 },
  { name: 'rit-white-md', width: 220, quality: 92 },
  { name: 'rit-white-lg', width: 280, quality: 92 },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeSquareLogo(inputPath, variants) {
  for (const variant of variants) {
    const webpPath = path.join(OUT_DIR, `${variant.name}.webp`);
    await sharp(inputPath)
      .resize(variant.size, variant.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: variant.quality, effort: 6 })
      .toFile(webpPath);

    const stats = await fs.stat(webpPath);
    console.log(`  ✓ ${path.basename(webpPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

async function optimizeRitLogo(inputPath, variants) {
  for (const variant of variants) {
    const webpPath = path.join(OUT_DIR, `${variant.name}.webp`);
    await sharp(inputPath)
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: variant.quality, effort: 6 })
      .toFile(webpPath);

    const stats = await fs.stat(webpPath);
    console.log(`  ✓ ${path.basename(webpPath)} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

async function ensureTransparentWhiteRit() {
  const rawWhite = path.join(SOURCE_DIR, 'rit-logo-white.png');
  const transparentOut = path.join(SOURCE_DIR, SOURCES.ritWhite);

  try {
    await fs.access(transparentOut);
    return transparentOut;
  } catch {
    // fall through and regenerate
  }

  try {
    await fs.access(rawWhite);
  } catch {
    return null;
  }

  const { data, info } = await sharp(rawWhite).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] < 35 && pixels[i + 1] < 35 && pixels[i + 2] < 35) {
      pixels[i + 3] = 0;
    }
  }

  const trimmed = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  await sharp(trimmed).png().toFile(transparentOut);
  return transparentOut;
}

function createIcoFromPngs(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntrySize = 16;
  const entries = [];
  let offset = 6 + count * dirEntrySize;

  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  await ensureDir(OUT_DIR);
  await ensureDir(APP_DIR);

  const infinitusSrc = path.join(SOURCE_DIR, SOURCES.infinitus);
  const ritSrc = path.join(SOURCE_DIR, SOURCES.rit);

  console.log('Optimizing Infinitus logo…');
  await optimizeSquareLogo(infinitusSrc, INFINITUS_VARIANTS);

  console.log('Optimizing RIT logo (light)…');
  await optimizeRitLogo(ritSrc, RIT_VARIANTS);

  console.log('Optimizing RIT logo (dark / white)…');
  const ritWhiteSrc = await ensureTransparentWhiteRit();
  if (ritWhiteSrc) {
    await optimizeRitLogo(ritWhiteSrc, RIT_WHITE_VARIANTS);
  } else {
    console.log('  ⚠ skipped — place rit-logo-white.png in assets/brand/source');
  }

  const ogPngPath = path.join(OUT_DIR, 'infinitus-og.png');
  await sharp(infinitusSrc)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: false })
    .toFile(ogPngPath);
  console.log(`  ✓ ${path.basename(ogPngPath)} (${((await fs.stat(ogPngPath)).size / 1024).toFixed(1)} KB)`);

  const faviconPath = path.join(OUT_DIR, 'favicon.png');
  await sharp(infinitusSrc)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(faviconPath);
  console.log(`  ✓ favicon.png (${((await fs.stat(faviconPath)).size / 1024).toFixed(1)} KB)`);

  // App icons & favicons
  const icon32 = await sharp(infinitusSrc)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await fs.writeFile(path.join(APP_DIR, 'icon.png'), icon32);
  console.log('  ✓ app/icon.png (32x32)');

  const icon192 = await sharp(infinitusSrc)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await fs.writeFile(path.join(APP_DIR, 'icon-192.png'), icon192);
  await fs.writeFile(path.join(OUT_DIR, 'icon-192.png'), icon192);
  console.log('  ✓ icon-192.png');

  const icon512 = await sharp(infinitusSrc)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await fs.writeFile(path.join(OUT_DIR, 'icon-512.png'), icon512);
  console.log('  ✓ public/brand/icon-512.png');

  // Maskable 512 icon with safe area padding
  const innerLogo = await sharp(infinitusSrc)
    .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const iconMaskable = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 9, g: 10, b: 16, alpha: 1 },
    },
  })
    .composite([{ input: innerLogo, gravity: 'center' }])
    .png()
    .toBuffer();
  await fs.writeFile(path.join(OUT_DIR, 'icon-maskable-512.png'), iconMaskable);
  console.log('  ✓ public/brand/icon-maskable-512.png');

  // Touch icon (180x180)
  await sharp(infinitusSrc)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(APP_DIR, 'apple-icon.png'));
  console.log('  ✓ app/apple-icon.png');

  // Favicon.ico with 16, 32, 48
  const icon16 = await sharp(infinitusSrc)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const icon48 = await sharp(infinitusSrc)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const icoBuffer = createIcoFromPngs([icon16, icon32, icon48], [16, 32, 48]);
  await fs.writeFile(path.join(APP_DIR, 'favicon.ico'), icoBuffer);
  await fs.writeFile(path.join(ROOT, 'public', 'favicon.ico'), icoBuffer);
  console.log('  ✓ app/favicon.ico & public/favicon.ico');

  console.log('\nDone — optimized assets written to public/brand/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
