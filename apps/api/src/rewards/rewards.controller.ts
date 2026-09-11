import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('tasks')
  async listTasks() {
    return this.rewardsService.listTasks();
  }

  @Post('tasks/:id/claim')
  async claimReward(
    @CurrentUser('sub') userId: string,
    @Param('id') taskId: string,
    @Body('accountId') accountId: string,
  ) {
    return this.rewardsService.claimTaskReward(userId, taskId, accountId || 'acct_user_default');
  }
}
