import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const err = result.error as ZodError;
      return next(
        ApiError.badRequest('Validation failed', err.flatten().fieldErrors),
      );
    }
    // Replace with parsed/coerced data
    (req as Record<string, unknown>)[part] = result.data;
    next();
  };
}
