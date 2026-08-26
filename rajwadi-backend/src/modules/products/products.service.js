import { Errors } from '../../utils/errors.js';

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

    const { data, total } = await this.productsRepo.getProducts(params);
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    };
  }

  async getProductBySlug(slug) {
    const product = await this.productsRepo.getPublicProductBySlug(slug);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    return product;
  }
  
  async getProductsByCategory(categorySlug) {
    return this.productsRepo.getProductsByCategory(categorySlug);
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
    return this.productsRepo.createProduct(data);
  }

  async updateProduct(id, data) {
    const product = await this.productsRepo.findProductById(id);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    
    if (data.slug && data.slug !== product.slug) {
      const existing = await this.productsRepo.findProductBySlug(data.slug);
      if (existing) throw Errors.SLUG_ALREADY_EXISTS();
    }
    return this.productsRepo.updateProduct(id, data);
  }

  async updateProductStatus(id, isActive) {
    const product = await this.productsRepo.findProductById(id);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    return this.productsRepo.updateProduct(id, { isActive });
  }

  async createVariant(productId, data) {
    const product = await this.productsRepo.findProductById(productId);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();

    const existingSku = await this.productsRepo.findVariantBySku(data.sku);
    if (existingSku) throw Errors.SKU_ALREADY_EXISTS();

    return this.productsRepo.createVariant({ ...data, productId });
  }

  async updateVariant(id, data) {
    const variant = await this.productsRepo.findVariantById(id);
    if (!variant) throw Errors.VARIANT_NOT_FOUND();

    return this.productsRepo.updateVariant(id, data);
  }

  async updateVariantStock(id, stockOnHand) {
    try {
      return await this.productsRepo.updateVariantStock(id, stockOnHand);
    } catch (error) {
      if (error.message === 'Variant not found') throw Errors.VARIANT_NOT_FOUND();
      throw Errors.INVALID_STOCK(error.message);
    }
  }
}
