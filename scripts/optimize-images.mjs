import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

const SOURCE_DIR = join(import.meta.dirname, '../../images');
const TARGET_DIR = join(import.meta.dirname, '../public/images');

// VERIFIED mapping — each UUID visually confirmed against target name
const IMAGE_MAP = {
  '8a316f43-b83f-488d-895d-6984dd2b682f.JPG': 'hero-pool-sunset.jpg',
  '1ac4a336-9fd9-4197-ab75-61c70942af42.JPG': 'exterior-hillside.jpg',
  '6ccf3501-4798-4c3a-aaf9-e9a2d84b2404.JPG': 'pool-house-umbrella.jpg',
  '4c1fc640-8066-4a03-a3bb-809e58ecaf3e.JPG': 'pool-panorama.jpg',
  '5678d0ab-e8db-474f-9399-1670c528e35e.JPG': 'living-room-windows.jpg',
  '2ef9375b-175a-4ac9-bb09-88f0d2ad9b12.JPG': 'living-room-tulips.jpg',
  '8ac4b0c8-b3df-42b6-9861-f7895fcc74b0.JPG': 'bedroom-mountain-view.jpg',
  '7cfe73c5-00ee-4463-bdb1-53310c244b70.JPG': 'bedroom-interior.jpg',
  '5fb83e32-6aac-41b2-ad30-395334d24624.JPG': 'bedroom-wide.jpg',
  '4dbaa728-9275-4cd2-8c2b-2f5151c8c950.JPG': 'terrace-mosaic-table.jpg',
  '2b9c2237-5f05-42d9-8db3-cc676b64c125.JPG': 'terrace-bistro.jpg',
  'df04ec9b-41d5-40b6-a2c1-68756b8c5f2f 2.JPG': 'outdoor-lounge.jpg',
  'af07d044-ceb2-4fef-91c5-aea83752c229 2.JPG': 'pool-sunset-loungers.jpg',
  '514d7086-0c89-4cd8-836d-3e61a46ee9b6.JPG': 'pool-crystal-clear.jpg',
  '23633494-56d6-4ff9-b09d-f69eee59ffd0.JPG': 'kitchen-stone-walls.jpg',
  '78facbf5-8f29-44d2-b063-a7b796ca7feb.JPG': 'dining-room.jpg',
  '2907a00f-1350-4426-82bc-5d73e159eb5f.JPG': 'bathroom-shower.jpg',
  '2d03ca0f-6279-4c7f-9631-2f47e30aef0d 2.JPG': 'window-view-olives.jpg',
  'e5af63d2-6621-43de-b12b-4c131107e474 2.JPG': 'garden-path.jpg',
  '51691678-eb31-48b4-b658-1f15be57917e.JPG': 'pergola-dining.jpg',
  '71f63594-2d2f-4d6c-b67c-0d7d19c3d207.JPG': 'terrace-wide-mosaic.jpg',
  'cdb629d8-7a47-4b93-8944-d12fde7a560e.JPG': 'living-room-clean.jpg',
};

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
  await mkdir(TARGET_DIR, { recursive: true });

  for (const [source, target] of Object.entries(IMAGE_MAP)) {
    const sourcePath = join(SOURCE_DIR, source);
    const targetPath = join(TARGET_DIR, target);

    try {
      const image = sharp(sourcePath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      await pipeline
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(targetPath);

      const origSize = ((metadata.size || 0) / 1024).toFixed(0);
      const { size: newSize } = await sharp(targetPath).metadata();
      console.log(`✓ ${target} (${origSize}KB → optimized)`);
    } catch (err) {
      console.error(`✗ Failed: ${source} → ${target}:`, err.message);
    }
  }

  console.log('\nDone! Images saved to public/images/');
}

optimizeImages();
