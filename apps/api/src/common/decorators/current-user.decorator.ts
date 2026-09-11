import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthSessionPayload } from '@arthax/types';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthSessionPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthSessionPayload;

    return data ? user?.[data] : user;
  },
);
