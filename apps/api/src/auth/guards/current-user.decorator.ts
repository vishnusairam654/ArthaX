import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthedRequest } from "./auth.guards";

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.user) throw new Error("CurrentUser used on unauthenticated route");
  return req.user;
});
