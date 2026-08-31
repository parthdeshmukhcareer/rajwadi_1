export class ProductsController {
  constructor(productsService) {
    this.productsService = productsService;
  }

  getProducts = async (req, reply) => {
    const result = await this.productsService.getProducts(req.query);
    return reply.send({ success: true, ...result });
  }

  getProduct = async (req, reply) => {
    const { slug } = req.params;
    const product = await this.productsService.getProductBySlug(slug, req.user);
    return reply.send({ success: true, data: product });
  }

  getProductsByCategory = async (req, reply) => {
    const { slug } = req.params;
    const products = await this.productsService.getProductsByCategory(slug);
    return reply.send({ success: true, data: products });
  }
}
