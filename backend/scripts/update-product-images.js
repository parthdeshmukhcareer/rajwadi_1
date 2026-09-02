import fs from 'fs';
import path from 'path';
import { db } from '../src/db/index.js';
import { products, productImages } from '../src/db/schema/index.js';

async function main() {
  console.log('--- Updating Product Images ---');

  const assetsDir = 'D:\\rajwadi-react\\rajwadi-react\\frontend\\public\\assets\\poshak';
  
  if (!fs.existsSync(assetsDir)) {
    console.error('Assets directory not found:', assetsDir);
    process.exit(1);
  }

  // Get all image files
  const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  console.log(`Found ${files.length} images in poshak directory.`);

  try {
    // Clear existing product images
    await db.delete(productImages);
    console.log('Cleared existing product images.');

    // Fetch all products
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products in database.`);

    if (allProducts.length === 0) {
      console.log('No products found to update.');
      process.exit(0);
    }

    let insertedCount = 0;
    
    // Assign one image per product
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      const fileName = files[i % files.length]; // Loop through images if fewer images than products
      
      const imageUrl = `/assets/poshak/${fileName}`;
      
      await db.insert(productImages).values({
        productId: product.id,
        cloudinaryPublicId: `local_asset_${fileName}`,
        imageUrl: imageUrl,
        altText: product.name,
        sortOrder: 0
      });
      
      insertedCount++;
    }

    console.log(`Successfully assigned new images to ${insertedCount} products.`);
    console.log('--- Done ---');
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    process.exit(0);
  }
}

main();
