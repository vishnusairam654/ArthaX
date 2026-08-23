import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, RolesGuard } from "../auth/guards/auth.guards";
import { Roles } from "../auth/guards/roles.decorator";

/**
 * Sample RBAC-protected surface. Real Central Bank administration
 * (bank registry, approvals, monetary policy) arrives in Phase 5.
 */
@Controller("central-bank")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CentralBankController {
  @Get("registry")
  @Roles("CENTRAL_BANK_ADMIN")
  registry(): { note: string } {
    return { note: "Bank registry — populated in Phase 5" };
  }
}
