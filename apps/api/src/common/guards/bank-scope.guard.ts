import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSessionPayload } from '@arthax/types';

/**
 * Enforces strict server-side bank scoping for BANK_ADMIN operations.
 * Bank Admins can only view and manage resources belonging to their assigned bank node.
 * Browser-supplied bank IDs cannot elevate or widen this scope.
 */
@Injectable()
export class BankScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthSessionPayload;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.role !== 'BANK_ADMIN') {
      throw new ForbiddenException('Access restricted to authorized Bank Administrators');
    }

    if (!user.bankId) {
      throw new ForbiddenException('No commercial bank assigned to this administrator account');
    }

    // Attach verified server-side bankId to the request context
    request.assignedBankId = user.bankId;

    // If request contains an explicit route parameter for bankId, verify exact match
    const paramBankId = request.params?.bankId;
    if (paramBankId && paramBankId.toLowerCase() !== user.bankId.toLowerCase()) {
      throw new ForbiddenException(
        `Cross-bank authorization rejected. Administrator is assigned to [${user.bankId}], cannot operate on [${paramBankId}].`,
      );
    }

    return true;
  }
}
