import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  Req,
  UseGuards,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { CentralBankService } from './central-bank.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  UpdateFinancialRuleSchema,
  UpdateFinancialRuleInput,
  CreateFinancialRuleSchema,
  CreateFinancialRuleInput,
  ProposeSovereignIssuanceSchema,
  ProposeSovereignIssuanceInput,
  ApproveSovereignIssuanceSchema,
  ApproveSovereignIssuanceInput,
  RequestElaFacilitySchema,
  RequestElaFacilityInput,
  RepayElaFacilitySchema,
  RepayElaFacilityInput,
  CreateEmergencyActionSchema,
  CreateEmergencyActionInput,
  RevokeEmergencyActionSchema,
  RevokeEmergencyActionInput,
} from '@arthax/validation';

@Controller('central-bank')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CENTRAL_BANK_ADMIN')
export class CentralBankController {
  constructor(private readonly cbService: CentralBankService) {}

  @Get('overview')
  async getOverview() {
    return this.cbService.getMacroOverview();
  }

  @Get('monetary/supply')
  async getMonetarySupply() {
    return this.cbService.getMonetarySupply();
  }

  @Post('monetary/issuance/propose')
  @UsePipes(new ZodValidationPipe(ProposeSovereignIssuanceSchema))
  async proposeIssuance(
    @Req() req: any,
    @Body() body: ProposeSovereignIssuanceInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    const key = idempotencyKey || `IDEMP-PROP-${Date.now()}`;
    return this.cbService.proposeSovereignIssuance(actorId, body, key);
  }

  @Post('monetary/issuance/approve')
  @UsePipes(new ZodValidationPipe(ApproveSovereignIssuanceSchema))
  async approveIssuance(
    @Req() req: any,
    @Body() body: ApproveSovereignIssuanceInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    const checkerId = req.user?.id || 'DEPUTY_GOV_CHECKER';
    const key = idempotencyKey || `IDEMP-APPR-${Date.now()}`;
    return this.cbService.approveSovereignIssuance(checkerId, body, key);
  }

  @Get('prudential/banks')
  async getPrudentialMetrics() {
    return this.cbService.getBankPrudentialMetrics();
  }

  @Post('emergency/ela/request')
  @UsePipes(new ZodValidationPipe(RequestElaFacilitySchema))
  async requestEla(
    @Req() req: any,
    @Body() body: RequestElaFacilityInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    const key = idempotencyKey || `IDEMP-ELA-${Date.now()}`;
    return this.cbService.requestElaFacility(actorId, body, key);
  }

  @Post('emergency/ela/repay')
  @UsePipes(new ZodValidationPipe(RepayElaFacilitySchema))
  async repayEla(
    @Req() req: any,
    @Body() body: RepayElaFacilityInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    const key = idempotencyKey || `IDEMP-REPAY-${Date.now()}`;
    return this.cbService.repayElaFacility(actorId, body, key);
  }

  @Post('emergency/action')
  @UsePipes(new ZodValidationPipe(CreateEmergencyActionSchema))
  async createEmergencyAction(
    @Req() req: any,
    @Body() body: CreateEmergencyActionInput,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    const key = idempotencyKey || `IDEMP-EMG-${Date.now()}`;
    return this.cbService.createEmergencyAction(actorId, body, key);
  }

  @Post('emergency/action/:id/revoke')
  @UsePipes(new ZodValidationPipe(RevokeEmergencyActionSchema))
  async revokeEmergencyAction(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: RevokeEmergencyActionInput,
  ) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    if (body.actionId !== id) {
      throw new BadRequestException('actionId in body must match URL parameter');
    }
    return this.cbService.revokeEmergencyAction(actorId, body);
  }

  @Get('emergency/status')
  async getEmergencyStatus() {
    const activeActions = this.cbService.getActiveEmergencyActions();
    return {
      marketHalted: this.cbService.isMarketHalted(),
      activeActions,
    };
  }

  @Get('financial-rules')
  async getFinancialRules() {
    return this.cbService.listFinancialRules();
  }

  @Post('financial-rules')
  @UsePipes(new ZodValidationPipe(CreateFinancialRuleSchema))
  async createRule(@Req() req: any, @Body() body: CreateFinancialRuleInput) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    return this.cbService.createFinancialRule(actorId, body);
  }

  @Patch('financial-rules')
  @UsePipes(new ZodValidationPipe(UpdateFinancialRuleSchema))
  async updateRule(@Req() req: any, @Body() body: UpdateFinancialRuleInput) {
    const actorId = req.user?.id || 'GOVERNOR_VANCE';
    return this.cbService.updateFinancialRule(body, actorId);
  }

  @Get('tax-rules')
  async getTaxRules() {
    return this.cbService.listTaxRules();
  }
}
