import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  // Accept token from httpOnly cookie or Authorization header (Bearer)
  const cookieToken: string | undefined = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = cookieToken ?? headerToken;

  if (!token) {
    return next(ApiError.unauthorized('No authentication token provided'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
