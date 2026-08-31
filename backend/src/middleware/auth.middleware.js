import { Errors } from '../utils/errors.js';

export const requireAuth = async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    throw Errors.AUTHENTICATION_REQUIRED();
  }
};

export const optionalAuth = async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    // Ignore verification failure; req.user will just be undefined.
  }
};
