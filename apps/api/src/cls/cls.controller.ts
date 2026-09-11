import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClsService } from './cls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ExecuteBatchSettlementSchema,
  ExecuteBatchSettlementInput,
  EmergencySettlementActionSchema,
  EmergencySettlementActionInput,
} from '@arthax/validation';

@Controller('cls')
export class ClsController {
  constructor(private readonly clsService: ClsService) {}

  /**
   * Global Central Settlement Layer KPI Telemetry.
   * Public / Citizen dashboard discovery.
   */
  @Get('overview')
  async getOverview() {
    return this.clsService.getClsTelemetry();
  }

  /**
   * Active Settlements Queue with stage & bank filtering.
   */
  @Get('queue')
  async getQueue(@Query('stage') stage?: string, @Query('bankId') bankId?: string) {
    return this.clsService.listSettlements(stage, bankId);
  }

  /**
   * Single settlement inspection with full audit timeline.
   */
  @Get('queue/:id')
  async getSettlementDetails(@Param('id') id: string) {
    return this.clsService.getSettlementById(id);
  }

  /**
   * 5x5 Bilateral Inter-Bank Flow Matrix.
   */
  @Get('matrix')
  async getBilateralMatrix() {
    return this.clsService.getBilateralMatrix();
  }

  /**
   * Central Bank Batch Settlement Trigger.
   * Processes queued obligations with individual atomicity.
   */
  @Post('batches/execute')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CENTRAL_BANK_ADMIN')
  async executeBatch(@Body() body: ExecuteBatchSettlementInput) {
    const validated = ExecuteBatchSettlementSchema.parse(body);
    return this.clsService.executeBatchSettlement(validated.targetBankId, validated.maxBatchSize);
  }

  /**
   * CLS Clearing Pool Reconciliation against Core Ledger.
   */
  @Get('reconciliation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CENTRAL_BANK_ADMIN')
  async getReconciliation() {
    return this.clsService.reconcileClsClearing();
  }

  /**
   * Central Bank Emergency Action (Cancel, Refund, Compensate).
   */
  @Post('settlements/:id/reverse')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CENTRAL_BANK_ADMIN')
  async emergencyIntervention(
    @Param('id') id: string,
    @Body() body: EmergencySettlementActionInput,
  ) {
    const validated = EmergencySettlementActionSchema.parse(body);
    return this.clsService.emergencyIntervention(id, validated.action, validated.reason);
  }
}
