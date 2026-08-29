import { eq } from 'drizzle-orm';
import { db } from './src/db/index.js';
import { categories, products as productsSchema, productVariants } from './src/db/schema/index.js';
import fs from 'fs';
import path from 'path';

// We will read the file as a string to parse it manually because importing it might be tricky if it has React-specific stuff,
// but it seems to just export a constant array. Let's just import it!
import productsData from '../frontend/src/data/products.js';

async function seed() {
  console.log('Starting seed...');
  
  // 1. Create a default Category or use existing
  let [category] = await db.select().from(categories).limit(1);
  if (!category) {
    [category] = await db.insert(categories).values({
      name: 'All Collection',
      slug: 'all-collection',
      description: 'Default collection',
    }).returning();
    console.log('Created default category:', category.id);
  } else {
    console.log('Using existing category:', category.id);
  }

  const idMap = {}; // old string ID -> new UUID
  const variantMap = {}; // old string ID -> new variant UUIDs

  // 2. Loop through products
  for (const p of productsData) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // check if exists
    let [existingProd] = await db.select().from(productsSchema).where(
      eq(productsSchema.slug, slug)
    ).limit(1);

    if (!existingProd) {
      console.log(`Inserting product: ${p.name}`);
      [existingProd] = await db.insert(productsSchema).values({
        categoryId: category.id,
        name: p.name,
        slug: slug,
        description: p.description,
        basePrice: Math.round(p.price),
        fabric: p.fabric || null,
        isActive: true,
        gstRate: 5 // Default GST
      }).returning();
    }
    
    idMap[p.id] = existingProd.id;

    // 3. Insert Variants (Sizes)
    if (p.sizes && p.sizes.length > 0) {
      variantMap[p.id] = {};
      for (const size of p.sizes) {
        const variantSku = `${p.id}-${size}`; // e.g. prod-lehenga-01-M
        
        let [existingVar] = await db.select().from(productVariants).where(
          eq(productVariants.sku, variantSku)
        ).limit(1);

        if (!existingVar) {
          console.log(`Inserting variant: ${variantSku}`);
          [existingVar] = await db.insert(productVariants).values({
            productId: existingProd.id,
            sku: variantSku,
            size: size,
            color: p.color || null,
            price: Math.round(p.price),
            stockOnHand: 100,
            isActive: true,
          }).returning();
        }
        variantMap[p.id][size] = existingVar.id;
      }
    }
  }

  console.log('--- SEEDING COMPLETE ---');
  
  // Now write the new id map to a JSON file so we can update the frontend
  const outPath = path.join(process.cwd(), 'idMap.json');
  fs.writeFileSync(outPath, JSON.stringify({ idMap, variantMap }, null, 2));
  console.log('Wrote id map to idMap.json');
  
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
