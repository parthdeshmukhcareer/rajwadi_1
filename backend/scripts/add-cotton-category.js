import { db } from '../src/db/index.js';
import { categories } from '../src/db/schema/index.js';

const slugify = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-');

async function main() {
  try {
    await db.insert(categories).values({ name: 'Cotton Poshaks', slug: slugify('Cotton Poshaks') });
    console.log('Successfully inserted Cotton Poshaks category');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
main();
