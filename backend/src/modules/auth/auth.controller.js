import { registerSchema, loginSchema } from './auth.schema.js';
import { Errors } from '../../utils/errors.js';

const COOKIE_NAME = 'refresh_token';
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

    reply.setCookie(COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    
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

    reply.setCookie(COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    
    return reply.send({
      success: true,
      data: {
        user,
        accessToken
      }
    });
  }

  refresh = async (req, reply) => {
    const rawToken = req.cookies[COOKIE_NAME];
    if (!rawToken) {
      throw Errors.AUTHENTICATION_REQUIRED();
    }

    const { user, rawRefreshToken } = await this.authService.refresh(rawToken);
    
    const accessToken = await reply.jwtSign({ sub: user.id, role: user.role });

    reply.setCookie(COOKIE_NAME, rawRefreshToken, COOKIE_OPTIONS);
    
    return reply.send({
      success: true,
      data: {
        accessToken
      }
    });
  }

  logout = async (req, reply) => {
    const rawToken = req.cookies[COOKIE_NAME];
    if (rawToken) {
      await this.authService.logout(rawToken);
    }
    
    reply.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
    
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
