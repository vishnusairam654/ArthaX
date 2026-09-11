import { Controller, Get, Patch, Body, UseGuards, UsePipes } from '@nestjs/common';
import { CentralBankService } from './central-bank.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateFinancialRuleSchema, UpdateFinancialRuleInput } from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('central-bank')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CENTRAL_BANK_ADMIN')
export class CentralBankController {
  constructor(private cbService: CentralBankService) {}

  @Get('overview')
  async getOverview() {
    return this.cbService.getMacroOverview();
  }

  @Get('financial-rules')
  async getFinancialRules() {
    return this.cbService.listFinancialRules();
  }

  @Patch('financial-rules')
  @UsePipes(new ZodValidationPipe(UpdateFinancialRuleSchema))
  async updateRule(@Body() body: UpdateFinancialRuleInput) {
    return this.cbService.updateFinancialRule(body);
  }
}
