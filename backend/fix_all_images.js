import { db } from './src/db/index.js';
import { productImages } from './src/db/schema/index.js';
import { sql } from 'drizzle-orm';

async function fix() {
  const imgs = await db.select().from(productImages);
  console.log('Total images in DB:', imgs.length);

  const poshakImages = [
    'assets/poshak/elegant_moments_rajputi_1788381938438.jpg',
    'assets/poshak/rajputi_hero_banner_1788381866714.jpg',
    'assets/poshak/stitched_poshak_1788382195391.jpg',
    'assets/poshak/unstitched_poshak_1788382106661.jpg',
    'assets/poshak/media_1788381413857.jpg',
    'assets/poshak/media_1788381982874.jpg'
  ];

  let updatedCount = 0;
  for (const img of imgs) {
    if (!img.imageUrl.startsWith('assets/poshak/')) {
      const rand = poshakImages[Math.floor(Math.random() * poshakImages.length)];
      await db.update(productImages)
        .set({ imageUrl: rand })
        .where(sql`${productImages.id} = ${img.id}`);
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} images to poshak images.`);
  process.exit(0);
}
fix();
