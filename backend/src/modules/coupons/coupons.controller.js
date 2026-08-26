import { createCouponSchema, updateCouponSchema, updateCouponStatusSchema } from './coupons.schema.js';
import { Errors } from '../../utils/errors.js';

export class AdminCouponsController {
  constructor(couponsService) {
    this.couponsService = couponsService;
  }

  getCoupons = async (req, reply) => {
    const result = await this.couponsService.getAdminCoupons(req.query);
    return reply.send({ success: true, ...result });
  }

  createCoupon = async (req, reply) => {
    const result = createCouponSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const coupon = await this.couponsService.createCoupon(result.data);
    return reply.status(201).send({ success: true, data: coupon });
  }

  updateCoupon = async (req, reply) => {
    const { id } = req.params;
    const result = updateCouponSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const coupon = await this.couponsService.updateCoupon(id, result.data);
    return reply.send({ success: true, data: coupon });
  }

  updateCouponStatus = async (req, reply) => {
    const { id } = req.params;
    const result = updateCouponStatusSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const coupon = await this.couponsService.updateCouponStatus(id, result.data.isActive);
    return reply.send({ success: true, data: coupon });
  }
}
