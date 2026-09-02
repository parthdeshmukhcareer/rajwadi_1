import { createCategorySchema, updateCategorySchema } from './categories.schema.js';
import { Errors } from '../../utils/errors.js';
import { z } from 'zod';

export class CategoriesController {
  constructor(categoriesService) {
    this.categoriesService = categoriesService;
  }

  getPublicCategories = async (req, reply) => {
    const categories = await this.categoriesService.getActiveCategories();
    return reply.send({ success: true, data: categories });
  }

  // Admin endpoints
  getAdminCategories = async (req, reply) => {
    const categories = await this.categoriesService.getAllCategories();
    return reply.send({ success: true, data: categories });
  }

  createCategory = async (req, reply) => {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const category = await this.categoriesService.createCategory(result.data);
    return reply.status(201).send({ success: true, data: category });
  }

  updateCategory = async (req, reply) => {
    const { id } = req.params;
    const result = updateCategorySchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const category = await this.categoriesService.updateCategory(id, result.data);
    return reply.send({ success: true, data: category });
  }

  updateStatus = async (req, reply) => {
    const { id } = req.params;
    const schema = z.object({ isActive: z.boolean() });
    const result = schema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const category = await this.categoriesService.updateStatus(id, result.data.isActive);
    return reply.send({ success: true, data: category });
  }

  deleteCategory = async (req, reply) => {
    const { id } = req.params;
    await this.categoriesService.deleteCategory(id);
    return reply.send({ success: true, message: 'Category deleted successfully.' });
  }
}
