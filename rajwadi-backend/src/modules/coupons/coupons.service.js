import { Errors } from '../../utils/errors.js';

export class CouponsService {
  constructor(couponsRepo) {
    this.couponsRepo = couponsRepo;
  }

  async getAdminCoupons(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 24, 100);
    
    const { data, total } = await this.couponsRepo.getAdminCoupons({
      page, limit, search: query.search, isActive: query.isActive
    });

    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async createCoupon(data) {
    const existing = await this.couponsRepo.findByCode(data.code);
    if (existing) throw Errors.COUPON_ALREADY_EXISTS();
    return this.couponsRepo.create(data);
  }

  async updateCoupon(id, data) {
    const coupon = await this.couponsRepo.findById(id);
    if (!coupon) throw Errors.COUPON_NOT_FOUND();
    
    if (data.code && data.code !== coupon.code) {
      const existing = await this.couponsRepo.findByCode(data.code);
      if (existing) throw Errors.COUPON_ALREADY_EXISTS();
    }
    return this.couponsRepo.update(id, data);
  }

  async updateCouponStatus(id, isActive) {
    const coupon = await this.couponsRepo.findById(id);
    if (!coupon) throw Errors.COUPON_NOT_FOUND();
    return this.couponsRepo.update(id, { isActive });
  }

  async validateAndCalculateDiscount(code, subtotal) {
    if (subtotal < 0) throw Errors.INTERNAL_ERROR('Subtotal cannot be negative');

    const coupon = await this.couponsRepo.findByCode(code.trim().toUpperCase());
    if (!coupon) throw Errors.COUPON_NOT_FOUND();

    if (!coupon.isActive) throw Errors.COUPON_INVALID('Coupon is inactive.');

    const now = new Date();
    if (coupon.startsAt && now < new Date(coupon.startsAt)) {
      throw Errors.COUPON_NOT_STARTED();
    }
    if (coupon.expiresAt && now > new Date(coupon.expiresAt)) {
      throw Errors.COUPON_EXPIRED();
    }

    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      throw Errors.COUPON_USAGE_LIMIT_REACHED();
    }

    if (coupon.minimumOrderAmount !== null && subtotal < coupon.minimumOrderAmount) {
      throw Errors.COUPON_MINIMUM_NOT_MET(`Minimum order amount of ₹${coupon.minimumOrderAmount / 100} is required.`);
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.floor((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscountAmount !== null) {
        discount = Math.min(discount, coupon.maximumDiscountAmount);
      }
    } else if (coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);

    return { valid: true, coupon, discount };
  }
}
