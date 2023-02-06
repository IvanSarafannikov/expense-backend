import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Get cookies decorator
 */
export const GetCookies = createParamDecorator(
  <T extends string | Array<string>>(
    data: T,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();

    return request.cookies[data];
  },
);
