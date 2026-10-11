import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const homepage = path.join(root, 'index.html');
const revealScript = path.join(root, 'js/home-reveal.js');
const pages = ['index.html', ...['uniflora', 'forrest-frank', 'prodigal-son', 'cazac', 'english-club'].map(name => `projects/${name}/index.html`)];

export default defineConfig({
  publicDir: false,
  build: {
    assetsInlineLimit: 0,
    reportCompressedSize: false,
    rolldownOptions: { input: pages.map(page => path.join(root, page)) }
  },
  plugins: [{
    name: 'preserve-early-reveal-script',
    transformIndexHtml: {
      order: 'pre',
      handler(_html, context) {
        if (path.resolve(context.filename) !== homepage) return;
        return [{
          tag: 'script',
          attrs: { 'data-home-reveal': '' },
          children: readFileSync(revealScript, 'utf8'),
          injectTo: 'head'
        }];
      }
    }
  }]
});
