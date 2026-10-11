import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'assets', 'css', 'js', 'projects']) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log('Copied portfolio pages and original assets to dist.');
