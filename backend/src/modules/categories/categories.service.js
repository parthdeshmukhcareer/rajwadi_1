import { Errors } from '../../utils/errors.js';

export class CategoriesService {
  constructor(categoriesRepo) {
    this.categoriesRepo = categoriesRepo;
  }

  async getActiveCategories() {
    return this.categoriesRepo.findAllActive();
  }

  async getAllCategories() {
    return this.categoriesRepo.findAll();
  }

  async createCategory(data) {
    const existing = await this.categoriesRepo.findBySlug(data.slug);
    if (existing) throw Errors.SLUG_ALREADY_EXISTS();
    return this.categoriesRepo.create(data);
  }

  async updateCategory(id, data) {
    const category = await this.categoriesRepo.findById(id);
    if (!category) throw Errors.CATEGORY_NOT_FOUND();
    
    if (data.slug && data.slug !== category.slug) {
      const existing = await this.categoriesRepo.findBySlug(data.slug);
      if (existing) throw Errors.SLUG_ALREADY_EXISTS();
    }
    
    return this.categoriesRepo.update(id, data);
  }

  async updateStatus(id, isActive) {
    const category = await this.categoriesRepo.findById(id);
    if (!category) throw Errors.CATEGORY_NOT_FOUND();
    return this.categoriesRepo.update(id, { isActive });
  }
}
