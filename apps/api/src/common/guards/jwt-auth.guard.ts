import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthSessionPayload } from '@arthax/types';
import { SessionStoreService } from '../services/session-store.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private sessionStore: SessionStoreService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthSessionPayload & { jti?: string }>(
        token,
        {
          secret: process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841',
        },
      );

      // Check if session or token has been revoked via killswitch / logout
      if (payload.jti && (await this.sessionStore.isSessionRevoked(payload.jti))) {
        throw new UnauthorizedException('Session token has been revoked');
      }

      // Attach authenticated user to request context
      (request as any).user = payload;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
