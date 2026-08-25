import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcName = 'size-guide-dog.png';
const srcDir = path.resolve(process.cwd(), 'public', 'assets');
const srcPath = path.join(srcDir, srcName);

const sizes = [480, 768, 1200];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  await ensureDir(srcDir);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source not found: ${srcPath}`);
    console.error('Place your original image at public/assets/size-guide-dog.png then re-run this script.');
    process.exit(1);
  }

  for (const w of sizes) {
    const outWebp = path.join(srcDir, `size-guide-dog-${w}.webp`);
    const outJpg = path.join(srcDir, `size-guide-dog-${w}.jpg`);

    console.log(`Generating ${w}px -> ${path.basename(outWebp)}`);
    await sharp(srcPath).resize({ width: w }).webp({ quality: 80 }).toFile(outWebp);

    console.log(`Generating ${w}px -> ${path.basename(outJpg)}`);
    await sharp(srcPath).resize({ width: w }).jpeg({ quality: 84 }).toFile(outJpg);
  }

  console.log('Image optimization complete. Files created under public/assets/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
