import { db } from '../../db/index.js';
import { categories } from '../../db/schema/index.js';
import { eq, asc } from 'drizzle-orm';

export class CategoriesRepository {
  async findAllActive() {
    return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder));
  }
  
  async findAll() {
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async findById(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return category;
  }

  async findBySlug(slug) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return category;
  }

  async create(data) {
    const [category] = await db.insert(categories).values(data).returning();
    return category;
  }

  async update(id, data) {
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return category;
  }

  async hasProducts(id) {
    const { products } = await import('../../db/schema/index.js');
    const [product] = await db.select().from(products).where(eq(products.categoryId, id)).limit(1);
    return !!product;
  }

  async delete(id) {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
