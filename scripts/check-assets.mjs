/**
 * Asset Integrity & Consistency Checker.
 * Run: npm run check:assets
 *
 * Enforces:
 * 1. Missing referenced files (events & gallery images in lib/data.js must exist on disk).
 * 2. Unreferenced images in public/events/ and public/gallery/.
 * 3. Filename format (strictly lowercase, no whitespace allowed).
 * 4. File size limits (posters <= 400 KB, all other images <= 250 KB).
 * 5. Alt / accessibility text completeness in static data.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

let errors = [];

function recordError(msg) {
  errors.push(msg);
  console.error(`  ✖ ${msg}`);
}

// 1. Load data from lib/data.js
const dataPath = path.join(ROOT, 'lib', 'data.js');
const dataModule = await import(`file://${dataPath}`);
const events = dataModule.EVENTS || [];
const gallery = dataModule.GALLERY || [];

console.log('Checking asset references from lib/data.js…');

const referencedEventImages = new Set();
const referencedGalleryImages = new Set();

// Check Events
for (const ev of events) {
  const imgUrl = ev.coverImageUrl || ev.coverImage || ev.posterUrl;
  if (!imgUrl) {
    // Some events might be text-only without posters; record only if expected
    continue;
  }
  const relativePath = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  referencedEventImages.add(path.basename(relativePath));

  if (!fs.existsSync(fullPath)) {
    recordError(`Referenced event cover image missing on disk: ${imgUrl}`);
  }

  // Accessibility alt check
  if (!ev.title && !ev.alt) {
    recordError(`Event "${ev.id}" is missing alt/title accessibility description.`);
  }
}

// Check Gallery
for (const item of gallery) {
  const imgUrl = item.src || item.image || item.url;
  if (!imgUrl) {
    recordError(`Gallery item "${item.id || item.caption}" is missing image/src property.`);
    continue;
  }
  const relativePath = imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl;
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  referencedGalleryImages.add(path.basename(relativePath));

  if (!fs.existsSync(fullPath)) {
    recordError(`Referenced gallery image missing on disk: ${imgUrl}`);
  }

  // Accessibility alt check
  if (!item.title && !item.caption && !item.alt) {
    recordError(`Gallery item "${item.id}" is missing alt/caption accessibility description.`);
  }
}

// 2. Walk public directory to check filenames, unreferenced images, and size limits
console.log('Checking public/ files for casing, whitespace, references, and size limits…');

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const allPublicFiles = walk(PUBLIC_DIR);

for (const filePath of allPublicFiles) {
  const relative = path.relative(PUBLIC_DIR, filePath);
  const filename = path.basename(filePath);

  // Check uppercase & whitespace
  if (/[A-Z]/.test(filename)) {
    recordError(`Filename contains uppercase characters: public/${relative}`);
  }
  if (/\s/.test(filename)) {
    recordError(`Filename contains whitespace: public/${relative}`);
  }

  // Check file size
  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  const isPoster = relative.startsWith('events') || relative.startsWith('events\\');
  const maxKB = isPoster ? 400 : 250;

  if (sizeKB > maxKB) {
    recordError(`File exceeds maximum size (${sizeKB.toFixed(1)} KB > ${maxKB} KB limit): public/${relative}`);
  }

  // Check unreferenced images in events and gallery
  if (isPoster) {
    if (!referencedEventImages.has(filename)) {
      recordError(`Unreferenced image in public/events/: ${filename}`);
    }
  }

  const isGallery = relative.startsWith('gallery') || relative.startsWith('gallery\\');
  if (isGallery) {
    if (!referencedGalleryImages.has(filename)) {
      recordError(`Unreferenced image in public/gallery/: ${filename}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Asset check failed with ${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log(`\n✓ All ${allPublicFiles.length} public assets verified successfully (casing, sizes, and references valid).\n`);
  process.exit(0);
}
