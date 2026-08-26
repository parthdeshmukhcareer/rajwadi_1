import { eq, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { addresses } from '../../db/schema/index.js';

export class AddressesRepository {
  async findByUserId(userId) {
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async findByIdAndUserId(id, userId) {
    const [address] = await db.select().from(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId))).limit(1);
    return address;
  }

  async delete(id, userId) {
    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
  }
}
