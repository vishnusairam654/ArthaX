import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { AuthService, SESSION_COOKIE } from "../auth.service";
import { ROLES_KEY } from "./roles.decorator";
import type { Role } from "@prisma/client";

export interface AuthedRequest extends Request {
  user?: { sub: string; email: string; role: Role };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const token = bearer || req.cookies?.[SESSION_COOKIE];
    if (!token) throw new ForbiddenException("Not authenticated");
    req.user = this.auth.verifySession(token);
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    if (!req.user || !required.includes(req.user.role)) {
      throw new ForbiddenException("Insufficient role");
    }
    return true;
  }
}
