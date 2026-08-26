import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { refreshTokens } from '../../db/schema/index.js';

export class AuthRepository {
  async saveRefreshToken(data) {
    const [token] = await db.insert(refreshTokens).values(data).returning();
    return token;
  }

  async findRefreshToken(tokenHash) {
    const [token] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);
    return token;
  }

  async revokeRefreshToken(id) {
    await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.id, id));
  }
}
