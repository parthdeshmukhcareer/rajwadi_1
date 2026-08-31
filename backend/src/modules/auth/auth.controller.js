import { registerSchema, loginSchema } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';

const CUSTOMER_COOKIE_NAME = 'customer_refresh_token';
const ADMIN_COOKIE_NAME = 'admin_refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, reply) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }

    const { user, rawRefreshToken } = await this.authService.register(result.data);
    
    const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

    reply.setCookie(CUSTOMER_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    
    return reply.status(201).send({
      success: true,
      data: {
        user,
        accessToken
      }
    });
  }

  login = async (req, reply) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }

    const { user, rawRefreshToken } = await this.authService.login(result.data);
    
    const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

    if (result.data.sessionType === 'admin') {
      if (user.role !== 'ADMIN') {
        throw Errors.FORBIDDEN('Admin access required');
      }
      reply.setCookie(ADMIN_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    } else {
      if (user.role === 'ADMIN') {
        reply.setCookie(ADMIN_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
        reply.setCookie(CUSTOMER_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
      } else {
        reply.setCookie(CUSTOMER_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
      }
    }
    
    return reply.send({
      success: true,
      data: {
        user,
        accessToken
      }
    });
  }

  googleLogin = async (req, reply) => {
    const { credential } = req.body;
    if (!credential) {
      throw Errors.VALIDATION_ERROR('Google credential is required');
    }

    const { user, rawRefreshToken } = await this.authService.googleLogin(credential);
    
    const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

    reply.setCookie(CUSTOMER_COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    
    return reply.send({
      success: true,
      data: {
        user,
        accessToken
      }
    });
  }

  refresh = async (req, reply) => {
    // Determine session type either from body, query or fallback to customer
    const sessionType = req.body?.sessionType || req.query?.sessionType || 'customer';
    const cookieName = sessionType === 'admin' ? ADMIN_COOKIE_NAME : CUSTOMER_COOKIE_NAME;
    
    const rawToken = req.cookies[cookieName];
    if (!rawToken) {
      throw Errors.AUTHENTICATION_REQUIRED();
    }

    const { user, rawRefreshToken } = await this.authService.refresh(rawToken);
    
    if (sessionType === 'admin' && user.role !== 'ADMIN') {
       throw Errors.FORBIDDEN('Admin access required');
    }
    
    const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

    reply.setCookie(cookieName, rawRefreshToken, COOKIE_OPTIONS);
    
    return reply.send({
      success: true,
      data: {
        user,
        accessToken
      }
    });
  }

  logout = async (req, reply) => {
    const sessionType = req.body?.sessionType || req.query?.sessionType || 'customer';
    const cookieName = sessionType === 'admin' ? ADMIN_COOKIE_NAME : CUSTOMER_COOKIE_NAME;
    
    const rawToken = req.cookies[cookieName];
    if (rawToken) {
      await this.authService.logout(rawToken);
    }
    
    reply.clearCookie(cookieName, { path: '/api/v1/auth' });
    
    return reply.send({
      success: true,
      data: {
        message: 'Logged out successfully'
      }
    });
  }

  me = async (req, reply) => {
    const userId = req.user.sub;
    const user = await this.authService.getMe(userId);
    
    return reply.send({
      success: true,
      data: user
    });
  }
}
