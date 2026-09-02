import { db } from '../src/db/index.js';
import { categories, products } from '../src/db/schema/index.js';
import { ne, eq } from 'drizzle-orm';

const slugify = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-');

async function main() {
  console.log('--- Updating Categories ---');

  const newCategories = [
    { name: 'Pure Poshak', slug: slugify('Pure Poshak') },
    { name: 'Semi Pure Poshak', slug: slugify('Semi Pure Poshak') },
    { name: 'Stitched Poshak', slug: slugify('Stitched Poshak') },
    { name: 'Unstitched Poshak', slug: slugify('Unstitched Poshak') }
  ];

  try {
    // 1. Insert new categories
    const insertedCategories = await db.insert(categories).values(newCategories).returning();
    console.log('Inserted new categories:', insertedCategories.map(c => c.name).join(', '));

    const purePoshak = insertedCategories.find(c => c.name === 'Pure Poshak');

    // 2. Reassign all existing products to 'Pure Poshak'
    const updatedProducts = await db.update(products)
      .set({ categoryId: purePoshak.id })
      .returning();
    console.log(`Reassigned ${updatedProducts.length} products to 'Pure Poshak'.`);

    // 3. Delete all old categories (ones that are not in the new inserted IDs)
    const newCategoryIds = insertedCategories.map(c => c.id);
    
    // We fetch all categories to find the old ones
    const allCategories = await db.select().from(categories);
    const oldCategories = allCategories.filter(c => !newCategoryIds.includes(c.id));
    
    let deletedCount = 0;
    for (const oldCat of oldCategories) {
      await db.delete(categories).where(eq(categories.id, oldCat.id));
      deletedCount++;
    }
    
    console.log(`Deleted ${deletedCount} old categories.`);
    console.log('--- Done ---');

  } catch (err) {
    console.error('Error updating categories:', err.message);
  } finally {
    process.exit(0);
  }
}

main();
