import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get device name
 */
export const DeviceName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | 'undefined' => {
    const request = ctx.switchToHttp().getRequest();

    return (request.headers['user-agent'] || 'undefined').trim();
  },
);
