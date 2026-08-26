import crypto from 'crypto';
import { db } from '../../db/index.js';
import { refreshTokens } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { Errors } from '../../utils/errors.js';
import { PasswordUtil } from '../../utils/password.util.js';

export class AuthService {
  constructor(usersRepo, authRepo) {
    this.usersRepo = usersRepo;
    this.authRepo = authRepo;
  }

  getSafeUser(user) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  generateRefreshToken() {
    const raw = crypto.randomBytes(40).toString('hex');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    return { raw, hash };
  }

  async register(data) {
    const existingEmail = await this.usersRepo.findByEmail(data.email);
    if (existingEmail) throw Errors.EMAIL_ALREADY_EXISTS();

    if (data.phone) {
      const existingPhone = await this.usersRepo.findByPhone(data.phone);
      if (existingPhone) throw Errors.PHONE_ALREADY_EXISTS();
    }

    const passwordHash = await PasswordUtil.hash(data.password);

    const user = await this.usersRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: 'CUSTOMER', 
    });

    const tokenData = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepo.saveRefreshToken({
      userId: user.id,
      tokenHash: tokenData.hash,
      expiresAt,
    });

    return {
      user: this.getSafeUser(user),
      rawRefreshToken: tokenData.raw,
    };
  }

  async login(data) {
    const user = await this.usersRepo.findByEmail(data.email);
    if (!user) throw Errors.INVALID_CREDENTIALS();

    if (!user.isActive) throw Errors.USER_INACTIVE();

    const isPasswordValid = await PasswordUtil.verify(user.passwordHash, data.password);
    if (!isPasswordValid) throw Errors.INVALID_CREDENTIALS();

    const tokenData = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepo.saveRefreshToken({
      userId: user.id,
      tokenHash: tokenData.hash,
      expiresAt,
    });

    return {
      user: this.getSafeUser(user),
      rawRefreshToken: tokenData.raw,
    };
  }

  async refresh(rawToken) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    
    return await db.transaction(async (tx) => {
      const [tokenRecord] = await tx.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);
      
      if (!tokenRecord) throw Errors.AUTHENTICATION_REQUIRED();
      if (tokenRecord.revokedAt) throw Errors.AUTHENTICATION_REQUIRED();
      if (tokenRecord.expiresAt < new Date()) throw Errors.AUTHENTICATION_REQUIRED();

      const user = await this.usersRepo.findById(tokenRecord.userId);
      if (!user || !user.isActive) throw Errors.USER_INACTIVE();

      await tx.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.id, tokenRecord.id));

      const newTokenData = this.generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await tx.insert(refreshTokens).values({
        userId: user.id,
        tokenHash: newTokenData.hash,
        expiresAt,
      });

      return {
        user: this.getSafeUser(user),
        rawRefreshToken: newTokenData.raw,
      };
    });
  }

  async logout(rawToken) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenRecord = await this.authRepo.findRefreshToken(tokenHash);
    
    if (tokenRecord && !tokenRecord.revokedAt) {
      await this.authRepo.revokeRefreshToken(tokenRecord.id);
    }
  }

  async getMe(id) {
    const user = await this.usersRepo.findById(id);
    if (!user || !user.isActive) throw Errors.USER_INACTIVE();
    return this.getSafeUser(user);
  }
}
