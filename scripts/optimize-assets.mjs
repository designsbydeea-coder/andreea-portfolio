import { readdir, readFile, writeFile, stat, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : [filename];
  }));
  return groups.flat();
}

const files = await filesIn(output);
const replacements = new Map();
const originals = [];
const assetUrl = filename => encodeURI(`/${path.relative(output, filename).split(path.sep).join('/')}`);
let before = 0;
let after = 0;
for (const filename of files.filter(file => /\.png$/i.test(file))) {
  const original = await readFile(filename);
  const metadata = await sharp(original).metadata();
  // Keep comparison/logo lettering lossless; retain photo transparency separately.
  const lossless = /before.?after|logo|construction/i.test(filename);
  // Homepage photographs and prominent heroes get gentler compression.
  const prominent = /hero|background|portrait|projects-|final|last.?pic/i.test(path.basename(filename));
  const optimized = await sharp(original).webp({
    lossless,
    quality: prominent || metadata.hasAlpha ? 95 : 90,
    alphaQuality: 100,
    effort: lossless ? 1 : 4
  }).toBuffer();
  before += original.length;
  if (optimized.length >= original.length) {
    after += original.length;
    continue;
  }
  const next = filename.replace(/\.png$/i, '.webp');
  await writeFile(next, optimized);
  replacements.set(assetUrl(filename), assetUrl(next));
  originals.push(filename);
  after += optimized.length;
}

// Replace exact generated asset URLs, including inline SVG image references.
for (const filename of files.filter(file => /\.(html|css|js|svg)$/i.test(file))) {
  const original = await readFile(filename, 'utf8');
  const updated = original.replace(/\/assets\/[^\s"'`()<>\\]+/g,
    url => replacements.get(url) ?? url);
  if (updated !== original) await writeFile(filename, updated);
}
await Promise.all(originals.map(filename => unlink(filename)));
const builtFiles = await filesIn(output);
const total = (await Promise.all(builtFiles.map(file => stat(file)))).reduce((sum, info) => sum + info.size, 0);
console.log(`Optimized ${replacements.size} PNGs: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB. Total publish size: ${(total / 1e6).toFixed(1)} MB.`);
