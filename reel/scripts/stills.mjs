// Render review stills: node scripts/stills.mjs <outDir> <compId>:<frame>[,<frame>...] ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, ...specs] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
for (const spec of specs) {
  const [id, frames] = spec.split(':');
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const fr of frames.split(',').map(Number)) {
    const output = path.join(outDir, `${id}_${String(fr).padStart(4, '0')}.png`);
    await renderStill({serveUrl, composition, frame: Math.min(fr, composition.durationInFrames - 1), output, browserExecutable, scale: 0.5});
    console.log(output);
  }
}
