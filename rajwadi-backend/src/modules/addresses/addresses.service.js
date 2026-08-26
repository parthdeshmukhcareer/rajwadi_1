import { db } from '../../db/index.js';
import { Errors } from '../../utils/errors.js';
import { addresses } from '../../db/schema/index.js';
import { and, eq } from 'drizzle-orm';

export class AddressesService {
  constructor(addressesRepo) {
    this.addressesRepo = addressesRepo;
  }

  async getAddresses(userId) {
    return this.addressesRepo.findByUserId(userId);
  }

  async createAddress(userId, data) {
    return await db.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.update(addresses).set({ isDefault: false }).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
      }
      
      const [address] = await tx.insert(addresses).values({ ...data, userId }).returning();
      return address;
    });
  }

  async updateAddress(userId, addressId, data) {
    return await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
      if (!existing) throw Errors.ADDRESS_NOT_FOUND();

      if (data.isDefault) {
        await tx.update(addresses).set({ isDefault: false }).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
      }

      const [updated] = await tx.update(addresses).set(data).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).returning();
      return updated;
    });
  }

  async deleteAddress(userId, addressId) {
    const existing = await this.addressesRepo.findByIdAndUserId(addressId, userId);
    if (!existing) throw Errors.ADDRESS_NOT_FOUND();
    await this.addressesRepo.delete(addressId, userId);
  }
}
