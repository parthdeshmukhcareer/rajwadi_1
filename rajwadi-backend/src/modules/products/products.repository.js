import { db } from '../../db/index.js';
import { products, productVariants, productImages, categories } from '../../db/schema/index.js';
import { eq, and, or, ilike, asc, desc, sql, inArray } from 'drizzle-orm';

export class ProductsRepository {
  async getProducts(params) {
    const { page, limit, search, category, size, color, minPrice, maxPrice, featured, occasion, fabric, sort } = params;
    const offset = (page - 1) * limit;
    
    const conditions = [eq(products.isActive, true)];

    if (search) {
      conditions.push(or(
        ilike(products.name, `%${search}%`),
        ilike(products.shortDescription, `%${search}%`),
        ilike(products.description, `%${search}%`),
        ilike(products.fabric, `%${search}%`),
        ilike(products.occasion, `%${search}%`)
      ));
    }

    if (category) {
      const [cat] = await db.select().from(categories).where(or(eq(categories.slug, category), eq(categories.name, category))).limit(1);
      if (cat) {
        conditions.push(eq(products.categoryId, cat.id));
      } else {
        return { data: [], total: 0 };
      }
    }

    if (featured !== undefined) {
      conditions.push(eq(products.isFeatured, featured === 'true' || featured === true));
    }
    if (occasion) {
      conditions.push(eq(products.occasion, occasion));
    }
    if (fabric) {
      conditions.push(eq(products.fabric, fabric));
    }

    // Variant conditions
    const variantConditions = [eq(productVariants.productId, products.id), eq(productVariants.isActive, true)];
    
    if (size) variantConditions.push(eq(productVariants.size, size));
    if (color) variantConditions.push(eq(productVariants.color, color));
    if (minPrice !== undefined) variantConditions.push(sql`${productVariants.price} >= ${minPrice}`);
    if (maxPrice !== undefined) variantConditions.push(sql`${productVariants.price} <= ${maxPrice}`);

    conditions.push(sql`EXISTS (SELECT 1 FROM ${productVariants} WHERE ${and(...variantConditions)})`);

    let orderBy = desc(products.createdAt);
    if (sort === 'price_low_to_high') {
      orderBy = asc(sql`(SELECT MIN(price) FROM ${productVariants} WHERE product_id = ${products.id} AND is_active = true)`);
    } else if (sort === 'price_high_to_low') {
      orderBy = desc(sql`(SELECT MAX(price) FROM ${productVariants} WHERE product_id = ${products.id} AND is_active = true)`);
    }

    const [countResult] = await db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(products)
      .where(and(...conditions));
    
    const total = countResult.count;

    const productRows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const productIds = productRows.map(p => p.id);
    let allVariants = [];
    let allImages = [];
    if (productIds.length > 0) {
      allVariants = await db.select().from(productVariants)
        .where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true)));
      allImages = await db.select().from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(asc(productImages.sortOrder));
    }

    const data = productRows.map(prod => {
      const vars = allVariants.filter(v => v.productId === prod.id);
      const startingPrice = vars.length > 0 ? Math.min(...vars.map(v => v.price)) : prod.basePrice;
      const images = allImages.filter(img => img.productId === prod.id);
      
      return {
        ...prod,
        startingPrice,
        image: images.length > 0 ? images[0].imageUrl : null,
      };
    });

    return { data, total };
  }

  async getPublicProductBySlug(slug) {
    const [product] = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.isActive, true))).limit(1);
    if (!product) return null;

    const [category] = await db.select().from(categories).where(and(eq(categories.id, product.categoryId), eq(categories.isActive, true))).limit(1);
    if (!category) return null;

    const variants = await db.select().from(productVariants).where(and(eq(productVariants.productId, product.id), eq(productVariants.isActive, true)));
    const images = await db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(asc(productImages.sortOrder));

    const safeVariants = variants.map(v => {
      const availableStock = v.stockOnHand - v.reservedStock;
      const { reservedStock, stockOnHand, ...safeV } = v;
      return { ...safeV, availableStock };
    });

    return {
      ...product,
      category,
      variants: safeVariants,
      images,
    };
  }

  async getProductsByCategory(categorySlug) {
    const [cat] = await db.select().from(categories).where(and(eq(categories.slug, categorySlug), eq(categories.isActive, true))).limit(1);
    if (!cat) return [];

    const productRows = await db.select().from(products).where(and(eq(products.categoryId, cat.id), eq(products.isActive, true)));
    
    const productIds = productRows.map(p => p.id);
    let allVariants = [];
    let allImages = [];
    if (productIds.length > 0) {
      allVariants = await db.select().from(productVariants)
        .where(and(inArray(productVariants.productId, productIds), eq(productVariants.isActive, true)));
      allImages = await db.select().from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(asc(productImages.sortOrder));
    }

    return productRows.map(prod => {
      const vars = allVariants.filter(v => v.productId === prod.id);
      const startingPrice = vars.length > 0 ? Math.min(...vars.map(v => v.price)) : prod.basePrice;
      const images = allImages.filter(img => img.productId === prod.id);
      
      return {
        ...prod,
        startingPrice,
        image: images.length > 0 ? images[0].imageUrl : null,
      };
    });
  }

  // Admin Methods
  async getAdminProducts(params) {
    const { page, limit, search, isActive } = params;
    const offset = (page - 1) * limit;
    const conditions = [];

    if (search) {
      conditions.push(or(
        ilike(products.name, `%${search}%`),
        ilike(products.slug, `%${search}%`)
      ));
    }
    
    if (isActive !== undefined) {
      conditions.push(eq(products.isActive, isActive === 'true' || isActive === true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products).where(whereClause);
    const total = countResult.count;

    const data = await db.select().from(products).where(whereClause).orderBy(desc(products.createdAt)).limit(limit).offset(offset);
    return { data, total };
  }

  async findProductById(id) {
    const [prod] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return prod;
  }

  async findProductBySlug(slug) {
    const [prod] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return prod;
  }

  async createProduct(data) {
    const [prod] = await db.insert(products).values(data).returning();
    return prod;
  }

  async updateProduct(id, data) {
    const [prod] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return prod;
  }

  async findVariantById(id) {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, id)).limit(1);
    return variant;
  }

  async findVariantBySku(sku) {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.sku, sku)).limit(1);
    return variant;
  }

  async createVariant(data) {
    const [variant] = await db.insert(productVariants).values(data).returning();
    return variant;
  }

  async updateVariant(id, data) {
    const [variant] = await db.update(productVariants).set(data).where(eq(productVariants.id, id)).returning();
    return variant;
  }

  async updateVariantStock(id, stockOnHand) {
    return await db.transaction(async (tx) => {
      const [variant] = await tx.select().from(productVariants).where(eq(productVariants.id, id)).limit(1);
      if (!variant) throw new Error('Variant not found');
      
      if (stockOnHand < variant.reservedStock) {
        throw new Error(`stockOnHand (${stockOnHand}) cannot be less than reservedStock (${variant.reservedStock})`);
      }

      const [updated] = await tx.update(productVariants).set({ stockOnHand }).where(eq(productVariants.id, id)).returning();
      return updated;
    });
  }
}
