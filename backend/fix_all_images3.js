import { db } from './src/db/index.js';
import { productImages } from './src/db/schema/index.js';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function fix() {
  const dir = 'D:\\rajwadi-react\\rajwadi-react\\frontend\\public\\assets\\poshak';
  const files = fs.readdirSync(dir);
  
  // Filter only the ChatGPT images which are the real generated poshaks
  const poshakFiles = files.filter(f => f.startsWith('ChatGPT Image') && f.endsWith('.png'));
  const poshakPaths = poshakFiles.map(f => `assets/poshak/${f}`);
  
  console.log(`Found ${poshakPaths.length} valid poshak images.`);

  if (poshakPaths.length === 0) {
    console.error('No valid images found!');
    process.exit(1);
  }

  const imgs = await db.select().from(productImages);
  console.log('Total images in DB:', imgs.length);

  let updatedCount = 0;
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i];
    // Assign sequentially to ensure maximum distinctness
    const assignedPath = poshakPaths[i % poshakPaths.length];
    
    await db.update(productImages)
      .set({ imageUrl: assignedPath })
      .where(sql`${productImages.id} = ${img.id}`);
    updatedCount++;
  }
  
  console.log(`Updated ${updatedCount} images sequentially.`);
  process.exit(0);
}
fix();
