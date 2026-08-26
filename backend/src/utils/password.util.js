import * as argon2 from 'argon2';

export class PasswordUtil {
  static async hash(password) {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verify(hash, plain) {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}
