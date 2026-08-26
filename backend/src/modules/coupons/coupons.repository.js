import { db } from '../../db/index.js';
import { coupons } from '../../db/schema/index.js';
import { eq, or, ilike, desc, sql, and } from 'drizzle-orm';

export class CouponsRepository {
  async getAdminCoupons(params) {
    const { page, limit, search, isActive } = params;
    const offset = (page - 1) * limit;
    const conditions = [];

    if (search) {
      conditions.push(ilike(coupons.code, `%${search}%`));
    }
    
    if (isActive !== undefined) {
      conditions.push(eq(coupons.isActive, isActive === 'true' || isActive === true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(coupons).where(whereClause);
    const total = countResult.count;

    const data = await db.select().from(coupons).where(whereClause).orderBy(desc(coupons.createdAt)).limit(limit).offset(offset);
    return { data, total };
  }

  async findByCode(code) {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return coupon;
  }

  async findById(id) {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    return coupon;
  }

  async create(data) {
    const [coupon] = await db.insert(coupons).values(data).returning();
    return coupon;
  }

  async update(id, data) {
    const [coupon] = await db.update(coupons).set(data).where(eq(coupons.id, id)).returning();
    return coupon;
  }
}
