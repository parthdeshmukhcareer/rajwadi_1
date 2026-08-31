import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema/index.js';

export class UsersRepository {
  async findByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async findByPhone(phone) {
    const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    return user;
  }

  async findById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async create(data) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async update(id, data) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAdminCustomers(params) {
    const { sql, desc, or, ilike, and } = await import('drizzle-orm');
    const { page = 1, limit = 10, search = '' } = params;
    const offset = (page - 1) * limit;
    const conditions = [eq(users.role, 'CUSTOMER')];

    if (search) {
      conditions.push(or(
        ilike(users.firstName, `%${search}%`),
        ilike(users.lastName, `%${search}%`),
        ilike(users.email, `%${search}%`)
      ));
    }

    const whereClause = and(...conditions);

    const [countResult] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(users).where(whereClause);
    const total = countResult.count;

    const data = await db.select().from(users).where(whereClause).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
    return { data, total };
  }
}
