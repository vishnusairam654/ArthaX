import { Injectable, BadRequestException, NotFoundException, Optional } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CentralBankService } from '../central-bank/central-bank.service';
import { BankId } from '@arthax/types';

export const CANONICAL_BANK_IDS: BankId[] = ['nava', 'samaya', 'setu', 'sthira', 'vayu'];

export interface InterbankRoute {
  sourceBankId: string;
  destinationBankId: string;
  feeLevyMinor: bigint;
  isEligible: boolean;
}

@Injectable()
export class ClsRoutingService {
  constructor(
    private readonly prisma: PrismaService,
    @Optional() private readonly centralBankService?: CentralBankService,
  ) {}

  setCentralBankService(cb: any): void {
    (this as any).centralBankService = cb;
  }

  /**
   * Validates inter-bank eligibility and resolves the routing path between two distinct bank nodes.
   */
  async resolveRoute(sourceBankId: string, destinationBankId: string): Promise<InterbankRoute> {
    const srcId = sourceBankId.toLowerCase();
    const destId = destinationBankId.toLowerCase();

    // Central Bank Regulatory Moratorium Invariant
    if (this.centralBankService) {
      if (this.centralBankService.isBankUnderMoratorium(srcId)) {
        throw new BadRequestException(
          `Source bank node [${srcId.toUpperCase()}] is under Central Bank regulatory MORATORIUM; outbound clearing suspended.`,
        );
      }
      if (this.centralBankService.isBankUnderMoratorium(destId)) {
        throw new BadRequestException(
          `Destination bank node [${destId.toUpperCase()}] is under Central Bank regulatory MORATORIUM; inbound clearing suspended.`,
        );
      }
    }

    if (srcId === destId) {
      throw new BadRequestException(
        `Self-bank transfer from [${srcId}] to [${destId}] must be handled via internal banking transfer, not CLS.`,
      );
    }

    // Verify both bank nodes are registered canonical or active institutions
    const isSrcCanonical = CANONICAL_BANK_IDS.includes(srcId as BankId);
    const isDestCanonical = CANONICAL_BANK_IDS.includes(destId as BankId);

    if (!isSrcCanonical) {
      throw new NotFoundException(`Source bank node [${srcId}] is not a recognized clearing participant.`);
    }
    if (!isDestCanonical) {
      throw new NotFoundException(`Destination bank node [${destId}] is not a recognized clearing participant.`);
    }

    // If database is reachable, verify status in DB
    if (this.prisma.isConnected) {
      const banks = await this.prisma.bank.findMany({
        where: { id: { in: [srcId, destId] } },
        select: { id: true, status: true },
      });

      const srcBank = banks.find((b) => b.id === srcId);
      const destBank = banks.find((b) => b.id === destId);

      if (srcBank && srcBank.status !== 'ACTIVE') {
        throw new BadRequestException(`Source bank node [${srcId}] is ${srcBank.status}; clearing suspended.`);
      }
      if (destBank && destBank.status !== 'ACTIVE') {
        throw new BadRequestException(
          `Destination bank node [${destId}] is ${destBank.status}; incoming clearing suspended.`,
        );
      }
    }

    return {
      sourceBankId: srcId,
      destinationBankId: destId,
      feeLevyMinor: 0n, // Sovereign standard clearing at zero fee levy
      isEligible: true,
    };
  }

  /**
   * Generates a unique, sovereign CLS settlement reference.
   * Format: CLS-YYYY-XXXXX
   */
  generateSettlementReference(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `CLS-${year}-${rand}`;
  }
}
