import { db } from '../src/db/index.js';
import { products, productVariants, categories, productImages } from '../src/db/schema/index.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function seed() {
  const content = fs.readFileSync(path.join(process.cwd(), '../frontend/src/data/products.js'), 'utf8');
  let jsonStr = content.replace('const products = ', '').replace('export default products;', '').trim();
  if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
  const rawProducts = eval('(' + jsonStr + ')');

  console.log(`Found ${rawProducts.length} products to seed.`);
  
  // Seed logic here
  for (const p of rawProducts) {
    // Upsert Category
    const [cat] = await db.insert(categories)
      .values({ name: p.category, slug: p.category.toLowerCase().replace(/ /g, '-') })
      .onConflictDoUpdate({ target: categories.slug, set: { name: p.category } })
      .returning();

    // Insert Product
    let [prod] = await db.insert(products)
      .values({
        id: p.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        categoryId: cat.id,
        basePrice: p.price,
        description: p.description,
        gstRate: 12,
        color: p.color,
        fabric: p.fabric
      })
      .onConflictDoNothing()
      .returning();

    if (!prod) {
      const [existingProd] = await db.select().from(products).where(eq(products.id, p.id)).limit(1);
      prod = existingProd;
    }
    if (!prod) {
      console.log(`Failed to insert or find product ${p.name}`);
      continue;
    }

    // Insert Variants
    for (const v of p.variants) {
      await db.insert(productVariants)
        .values({
          id: v.id,
          productId: prod.id,
          sku: `${p.name.substring(0,3).toUpperCase()}-${v.size}`,
          size: v.size,
          price: p.price,
          stockOnHand: v.stockOnHand
        })
        .onConflictDoNothing();
    }

    // Insert Images
    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        await db.insert(productImages)
          .values({
            productId: prod.id,
            imageUrl: p.images[i],
            cloudinaryPublicId: 'mock-id-' + Math.random().toString(36).substring(7),
            sortOrder: i
          })
          .onConflictDoNothing();
      }
    } else if (p.image) {
      await db.insert(productImages)
        .values({
          productId: prod.id,
          imageUrl: p.image,
          cloudinaryPublicId: 'mock-id-' + Math.random().toString(36).substring(7),
          sortOrder: 0
        })
        .onConflictDoNothing();
    }
  }

  console.log('Seeding completed successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
