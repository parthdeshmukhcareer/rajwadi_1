import { createProductSchema, updateProductSchema, createVariantSchema, updateVariantSchema, updateStockSchema } from '../products/products.schema.js';
import { Errors } from '../../utils/errors.js';
import { z } from 'zod';

export class AdminProductsController {
  constructor(productsService) {
    this.productsService = productsService;
  }

  getProducts = async (req, reply) => {
    const result = await this.productsService.getAdminProducts(req.query);
    return reply.send({ success: true, ...result });
  }

  getProduct = async (req, reply) => {
    const { id } = req.params;
    const product = await this.productsService.getAdminProductById(id);
    return reply.send({ success: true, data: product });
  }

  createProduct = async (req, reply) => {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const product = await this.productsService.createProduct(result.data);
    return reply.status(201).send({ success: true, data: product });
  }

  updateProduct = async (req, reply) => {
    const { id } = req.params;
    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const product = await this.productsService.updateProduct(id, result.data);
    return reply.send({ success: true, data: product });
  }

  updateProductStatus = async (req, reply) => {
    const { id } = req.params;
    const schema = z.object({ isActive: z.boolean() });
    const result = schema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const product = await this.productsService.updateProductStatus(id, result.data.isActive);
    return reply.send({ success: true, data: product });
  }

  deleteProduct = async (req, reply) => {
    const { id } = req.params;
    await this.productsService.deleteProduct(id);
    return reply.send({ success: true, message: 'Product deleted successfully' });
  }

  createVariant = async (req, reply) => {
    const { productId } = req.params;
    const result = createVariantSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const variant = await this.productsService.createVariant(productId, result.data);
    return reply.status(201).send({ success: true, data: variant });
  }

  updateVariant = async (req, reply) => {
    const { id } = req.params;
    const result = updateVariantSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const variant = await this.productsService.updateVariant(id, result.data);
    return reply.send({ success: true, data: variant });
  }

  updateVariantStock = async (req, reply) => {
    const { id } = req.params;
    const result = updateStockSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const variant = await this.productsService.updateVariantStock(id, result.data.stockOnHand);
    return reply.send({ success: true, data: variant });
  }

  deleteVariant = async (req, reply) => {
    const { id } = req.params;
    const result = await this.productsService.deleteVariant(id);
    if (result.deactivated) {
      return reply.send({ success: true, message: 'Variant deactivated because it is used in orders', data: result });
    }
    return reply.send({ success: true, message: 'Variant deleted successfully', data: result });
  }
}
