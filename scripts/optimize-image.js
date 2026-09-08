import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.resolve(process.cwd(), 'public', 'assets');
const sources = [
  { name: 'd1.png', widths: [768, 1200] },
  { name: 'pp.png', widths: [768, 1200] },
  { name: 'about-velora.png', widths: [768, 1200] },
  { name: 'logoOs.png', widths: [320, 640] },
  { name: 'size-guide-dog.png', widths: [480, 768, 1200] },
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  await ensureDir(srcDir);

  for (const { name, widths } of sources) {
    const srcPath = path.join(srcDir, name);
    if (!fs.existsSync(srcPath)) continue;
    const baseName = path.parse(name).name;

    for (const w of widths) {
      const outWebp = path.join(srcDir, `${baseName}-${w}.webp`);

      console.log(`Generating ${w}px -> ${path.basename(outWebp)}`);
      await sharp(srcPath).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(outWebp);
    }

  }

  console.log('Image optimization complete. Files created under public/assets/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
