import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIRS = ['components', 'app', 'styles'];
const BLUR_BUDGET = 5;

// Pattern matches both Tailwind class backdrop-blur and CSS property backdrop-filter
const BLUR_PATTERN = /backdrop-blur|backdrop-filter/g;

function scanDir(dir, found = []) {
  if (!fs.existsSync(dir)) return found;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, found);
    } else if (/\.(jsx?|tsx?|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Exclude comment lines or documentation notes
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return;
        }
        const matches = line.match(BLUR_PATTERN);
        if (matches) {
          found.push({
            file: fullPath.replace(/\\/g, '/'),
            line: idx + 1,
            match: trimmed,
          });
        }
      });
    }
  }
  return found;
}

const allMatches = [];
for (const dir of TARGET_DIRS) {
  scanDir(dir, allMatches);
}

console.log('=== Backdrop Blur Performance Budget Check ===');
console.log(`Target Directories: ${TARGET_DIRS.join(', ')}`);
console.log(`Allowed Budget: <= ${BLUR_BUDGET} occurrences`);
console.log(`Found Occurrences: ${allMatches.length}\n`);

allMatches.forEach((m, i) => {
  console.log(`${i + 1}. [${m.file}:${m.line}] ${m.match}`);
});

if (allMatches.length > BLUR_BUDGET) {
  console.error(`\n[FAIL]: Found ${allMatches.length} backdrop blur instances, exceeding maximum budget of ${BLUR_BUDGET}!`);
  process.exit(1);
}

console.log(`\n[PASS]: Backdrop blur budget satisfied (${allMatches.length}/${BLUR_BUDGET} utilized).`);
