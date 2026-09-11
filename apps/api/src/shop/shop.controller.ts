import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ShopPurchaseSchema,
  ShopPurchaseInput,
  ShopGiftSchema,
  ShopGiftInput,
  EquipLoadoutSchema,
  EquipLoadoutInput,
} from '@arthax/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('shop')
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  /**
   * Retrieves the sovereign virtual economy catalog.
   * Filterable by category (pet, frame, avatar, banner).
   */
  @Get('items')
  async listItems(@Query('category') category?: string) {
    return this.shopService.listCatalog(category);
  }

  /**
   * Retrieves single shop artifact details.
   */
  @Get('items/:id')
  async getItem(@Param('id') id: string) {
    return this.shopService.getItem(id);
  }

  /**
   * Executes atomic purchase of an artifact into the citizen's sovereign vault.
   * Requires step-up Financial Password and posts Core Ledger settlement to sys_shop_revenue.
   */
  @Post('purchase')
  @UsePipes(new ZodValidationPipe(ShopPurchaseSchema))
  async purchase(
    @CurrentUser('sub') userId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: ShopPurchaseInput,
  ) {
    return this.shopService.purchaseItem(userId, body, idempotencyKey);
  }

  /**
   * Executes atomic gifting of an artifact to another verified citizen.
   * Debits sender account, credits sys_shop_revenue, and grants directly to recipient's vault.
   */
  @Post('gift')
  @UsePipes(new ZodValidationPipe(ShopGiftSchema))
  async gift(
    @CurrentUser('sub') userId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() body: ShopGiftInput,
  ) {
    return this.shopService.giftItem(userId, body, idempotencyKey);
  }

  /**
   * Retrieves citizen's sovereign vault inventory and currently equipped loadout.
   */
  @Get('inventory')
  async getInventory(@CurrentUser('sub') userId: string) {
    return this.shopService.getUserInventory(userId);
  }

  /**
   * Updates citizen's equipped loadout (frame, avatar, banner, or pet).
   * Enforces vault ownership and single-active-pet invariant.
   */
  @Patch('loadout')
  @UsePipes(new ZodValidationPipe(EquipLoadoutSchema))
  async equip(
    @CurrentUser('sub') userId: string,
    @Body() body: EquipLoadoutInput,
  ) {
    return this.shopService.equipLoadout(userId, body);
  }

  /**
   * Retrieves the active financial modifier emitted by the citizen's single equipped pet.
   * Consumed by downstream financial domains (Banking, Stocks, CLS, Rewards).
   */
  @Get('active-pet')
  async getActivePetModifier(@CurrentUser('sub') userId: string) {
    return this.shopService.getActivePetModifier(userId);
  }

  /**
   * Claims the daily +5.00 ARTH civic bounty for the active Archive Cat ("Marjara") companion.
   * Debited strictly from the sovereign sys_reward_pool account.
   */
  @Post('claim-bounty')
  async claimBounty(
    @CurrentUser('sub') userId: string,
    @Body('targetAccountId') targetAccountId: string,
  ) {
    return this.shopService.claimCivicBounty(userId, targetAccountId);
  }
}
