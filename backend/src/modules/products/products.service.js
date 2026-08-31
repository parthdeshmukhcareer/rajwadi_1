import { Errors } from '../../utils/errors.js';

// Simple in-memory cache for products
const productsCache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute

export class ProductsService {
  constructor(productsRepo) {
    this.productsRepo = productsRepo;
  }

  async getProducts(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 24, 100);
    const params = {
      page,
      limit,
      search: query.search,
      category: query.category,
      size: query.size,
      color: query.color,
      minPrice: query.minPrice !== undefined ? parseInt(query.minPrice) : undefined,
      maxPrice: query.maxPrice !== undefined ? parseInt(query.maxPrice) : undefined,
      featured: query.featured,
      occasion: query.occasion,
      fabric: query.fabric,
      sort: query.sort,
    };

    const cacheKey = JSON.stringify(params);
    if (productsCache.has(cacheKey)) {
      const cached = productsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      } else {
        productsCache.delete(cacheKey);
      }
    }

    const { data, total } = await this.productsRepo.getProducts(params);
    
    const response = {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
    
    productsCache.set(cacheKey, { data: response, timestamp: Date.now() });
    
    return response;
  }

  async getProductBySlug(slug, user) {
    const isAdmin = user?.role === 'ADMIN';
    const product = await this.productsRepo.getPublicProductBySlug(slug, isAdmin);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    return product;
  }
  
  async getProductsByCategory(categorySlug) {
    const cacheKey = `category_${categorySlug}`;
    if (productsCache.has(cacheKey)) {
      const cached = productsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }
    const data = await this.productsRepo.getProductsByCategory(categorySlug);
    productsCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  // Admin Methods
  async getAdminProducts(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 24, 100);
    
    const { data, total } = await this.productsRepo.getAdminProducts({
      page, limit, search: query.search, isActive: query.isActive
    });

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async createProduct(data) {
    const existing = await this.productsRepo.findProductBySlug(data.slug);
    if (existing) throw Errors.SLUG_ALREADY_EXISTS();
    productsCache.clear();
    return this.productsRepo.createProduct(data);
  }

  async updateProduct(id, data) {
    const product = await this.productsRepo.findProductById(id);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    
    if (data.slug && data.slug !== product.slug) {
      const existing = await this.productsRepo.findProductBySlug(data.slug);
      if (existing) throw Errors.SLUG_ALREADY_EXISTS();
    }
    productsCache.clear();
    return this.productsRepo.updateProduct(id, data);
  }

  async updateProductStatus(id, isActive) {
    const product = await this.productsRepo.findProductById(id);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    productsCache.clear();
    return this.productsRepo.updateProduct(id, { isActive });
  }

  async createVariant(productId, data) {
    const product = await this.productsRepo.findProductById(productId);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();

    const existingSku = await this.productsRepo.findVariantBySku(data.sku);
    if (existingSku) throw Errors.SKU_ALREADY_EXISTS();

    productsCache.clear();
    return this.productsRepo.createVariant({ ...data, productId });
  }

  async updateVariant(id, data) {
    const variant = await this.productsRepo.findVariantById(id);
    if (!variant) throw Errors.VARIANT_NOT_FOUND();

    productsCache.clear();
    return this.productsRepo.updateVariant(id, data);
  }

  async updateVariantStock(id, stockOnHand) {
    try {
      const result = await this.productsRepo.updateVariantStock(id, stockOnHand);
      productsCache.clear();
      return result;
    } catch (error) {
      if (error.message === 'Variant not found') throw Errors.VARIANT_NOT_FOUND();
      throw Errors.INVALID_STOCK(error.message);
    }
  }

  async deleteProduct(id) {
    const product = await this.productsRepo.findProductById(id);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    
    // Check if it has any orders associated with it? 
    // Drizzle will handle onDelete: 'cascade' or 'restrict' based on schema.
    productsCache.clear();
    return this.productsRepo.deleteProduct(id);
  }
}
