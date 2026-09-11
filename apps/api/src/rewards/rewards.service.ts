import { Injectable } from '@nestjs/common';
import { LedgerService } from '../ledger/ledger.service';

@Injectable()
export class RewardsService {
  constructor(private ledgerService: LedgerService) {}

  async listTasks() {
    return [
      {
        id: 'task-01',
        title: 'Verify Sovereign GOV ID',
        category: 'Identity',
        rewardMinor: '5000', // 50.00 ARTH
        completed: true,
        claimed: true,
      },
      {
        id: 'task-02',
        title: 'Execute First Inter-Bank DvP Transfer',
        category: 'Banking',
        rewardMinor: '10000', // 100.00 ARTH
        completed: true,
        claimed: false,
      },
    ];
  }

  async claimTaskReward(userId: string, taskId: string, userAccountId: string) {
    const rewardMinor = 10000n; // 100.00 ARTH

    const tx = await this.ledgerService.recordBalancedTransaction({
      type: 'REWARD',
      scope: 'INTERNAL',
      amountMinor: rewardMinor,
      initiatedBy: userId,
      destinationAccountId: userAccountId,
      metadata: { taskId },
      entries: [
        {
          ledgerAccountId: 'acct_reward_pool_001',
          entryType: 'DEBIT',
          amountMinor: rewardMinor,
        },
        {
          ledgerAccountId: userAccountId,
          entryType: 'CREDIT',
          amountMinor: rewardMinor,
        },
      ],
    });

    return {
      success: true,
      transaction: tx,
      message: 'Reward claimed and credited to sovereign bank account',
    };
  }
}
