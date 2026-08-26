import { checkoutSchema } from './orders.schema.js';
import { Errors } from '../../utils/errors.js';

export class OrdersController {
  constructor(ordersService) {
    this.ordersService = ordersService;
  }

  checkout = async (req, reply) => {
    const userId = req.user.sub;
    const result = checkoutSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const order = await this.ordersService.processCheckout(userId, result.data);
    return reply.status(201).send({ success: true, data: order });
  }

  getUserOrders = async (req, reply) => {
    const userId = req.user.sub;
    const result = await this.ordersService.getUserOrders(userId, req.query);
    return reply.send({ success: true, ...result });
  }

  getOrderDetails = async (req, reply) => {
    const userId = req.user.sub;
    const { orderNumber } = req.params;
    const data = await this.ordersService.getOrderDetails(userId, orderNumber);
    return reply.send({ success: true, data });
  }
}
