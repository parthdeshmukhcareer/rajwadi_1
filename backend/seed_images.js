import { eq } from 'drizzle-orm';
import { db } from './src/db/index.js';
import { products as productsSchema, productImages } from './src/db/schema/index.js';
import productsData from '../frontend/src/data/products.js';

async function seedImages() {
  console.log('Starting image seed...');
  
  for (const p of productsData) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // check if product exists
    let [existingProd] = await db.select().from(productsSchema).where(
      eq(productsSchema.slug, slug)
    ).limit(1);

    if (existingProd) {
      // Check if image already exists
      let [existingImg] = await db.select().from(productImages).where(
        eq(productImages.productId, existingProd.id)
      ).limit(1);

      if (!existingImg && p.image) {
        console.log(`Inserting image for product: ${p.name}`);
        await db.insert(productImages).values({
          productId: existingProd.id,
          cloudinaryPublicId: p.image, // just a placeholder since local
          imageUrl: p.image,
          sortOrder: 0
        });
      }
    }
  }

  console.log('--- IMAGE SEEDING COMPLETE ---');
  process.exit(0);
}

seedImages().catch(err => {
  console.error(err);
  process.exit(1);
});
