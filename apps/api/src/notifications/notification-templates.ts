import { NotificationCategory, NotificationPriority, formatArth } from '@arthax/types';

export interface RenderedTemplate {
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  summary: string;
  content: string;
  templateCode: string;
  templateVersion: number;
}

export const NotificationTemplates = {
  BANK_TRANSFER_RECEIVED_V1: {
    code: 'BANK_TRANSFER_RECEIVED_V1',
    version: 1,
    category: 'TRANSFER' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      amountMinor: bigint | string | number;
      senderBank: string;
      senderName?: string;
      txId: string;
      targetAccount: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.amountMinor);
      return {
        category: 'TRANSFER',
        priority: 'NORMAL',
        title: `Credit Notice: ${formatted} ARTH Received`,
        summary: `Direct transfer from ${data.senderName || data.senderBank} credited to account ${data.targetAccount}.`,
        content: `SOVEREIGN BANKING SETTLEMENT NOTICE\n\nTransaction ${data.txId} has finalized successfully. Your account ${data.targetAccount} has been credited with ${formatted} ARTH originating from ${data.senderBank}.\n\nReference: ${data.txId}\nFinality: Immediate (Core Ledger Confirmed)`,
        templateCode: 'BANK_TRANSFER_RECEIVED_V1',
        templateVersion: 1,
      };
    },
  },

  BANK_TRANSFER_SENT_V1: {
    code: 'BANK_TRANSFER_SENT_V1',
    version: 1,
    category: 'TRANSFER' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      amountMinor: bigint | string | number;
      recipientBank: string;
      recipientName?: string;
      txId: string;
      sourceAccount: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.amountMinor);
      return {
        category: 'TRANSFER',
        priority: 'NORMAL',
        title: `Debit Notice: ${formatted} ARTH Transferred`,
        summary: `Outgoing remittance of ${formatted} ARTH dispatched to ${data.recipientName || data.recipientBank}.`,
        content: `SOVEREIGN BANKING DEBIT CONFIRMATION\n\nYour transfer of ${formatted} ARTH from account ${data.sourceAccount} to ${data.recipientBank} has cleared.\n\nTransaction ID: ${data.txId}\nStatus: Settled`,
        templateCode: 'BANK_TRANSFER_SENT_V1',
        templateVersion: 1,
      };
    },
  },

  CLS_SETTLEMENT_COMPLETED_V1: {
    code: 'CLS_SETTLEMENT_COMPLETED_V1',
    version: 1,
    category: 'SETTLEMENT' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      amountMinor: bigint | string | number;
      sourceBank: string;
      targetBank: string;
      instructionId: string;
      settlementCycle: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.amountMinor);
      return {
        category: 'SETTLEMENT',
        priority: 'NORMAL',
        title: `CLS Settlement Finalized: ${formatted} ARTH`,
        summary: `Inter-bank clearing ${data.sourceBank} -> ${data.targetBank} settled in cycle ${data.settlementCycle}.`,
        content: `CENTRAL SETTLEMENT LAYER (CLS) RECEIPT\n\nInstruction ${data.instructionId} has achieved final settlement between ${data.sourceBank} and ${data.targetBank}.\nGross amount: ${formatted} ARTH\nSettlement Cycle: ${data.settlementCycle}\nInvariant: Double-entry conserved across participating reserves.`,
        templateCode: 'CLS_SETTLEMENT_COMPLETED_V1',
        templateVersion: 1,
      };
    },
  },

  CLS_SETTLEMENT_FAILED_V1: {
    code: 'CLS_SETTLEMENT_FAILED_V1',
    version: 1,
    category: 'SETTLEMENT' as NotificationCategory,
    priority: 'HIGH' as NotificationPriority,
    render(data: {
      amountMinor: bigint | string | number;
      sourceBank: string;
      targetBank: string;
      instructionId: string;
      reason: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.amountMinor);
      return {
        category: 'SETTLEMENT',
        priority: 'HIGH',
        title: `CLS Settlement Alert: Instruction ${data.instructionId} Failed`,
        summary: `Inter-bank settlement of ${formatted} ARTH could not clear: ${data.reason}. Funds returned.`,
        content: `CENTRAL SETTLEMENT LAYER NOTICE OF EXCEPTION\n\nInstruction ${data.instructionId} failed during bilateral clearing:\nSource Bank: ${data.sourceBank}\nDestination Bank: ${data.targetBank}\nReason: ${data.reason}\nAction: Hold release applied. No net ledger imbalance occurred.`,
        templateCode: 'CLS_SETTLEMENT_FAILED_V1',
        templateVersion: 1,
      };
    },
  },

  STOCK_ORDER_FILLED_V1: {
    code: 'STOCK_ORDER_FILLED_V1',
    version: 1,
    category: 'STOCK' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      symbol: string;
      side: 'BUY' | 'SELL';
      quantity: number;
      priceMinor: bigint | string | number;
      totalMinor: bigint | string | number;
      orderId: string;
      tradeId: string;
    }): RenderedTemplate {
      const priceFormatted = formatArth(data.priceMinor);
      const totalFormatted = formatArth(data.totalMinor);
      return {
        category: 'STOCK',
        priority: 'NORMAL',
        title: `Exchange Execution: ${data.side} ${data.quantity} ${data.symbol}`,
        summary: `Trade executed at ${priceFormatted} ARTH/share for total value ${totalFormatted} ARTH.`,
        content: `SOVEREIGN EQUITIES EXCHANGE EXECUTION REPORT\n\nOrder ${data.orderId} executed trade ${data.tradeId}.\nSide: ${data.side}\nAsset: ${data.quantity} shares of ${data.symbol}\nExecution Price: ${priceFormatted} ARTH\nTotal Consideration: ${totalFormatted} ARTH\nSettlement: Delivery vs Payment (DvP) committed to Core Ledger.`,
        templateCode: 'STOCK_ORDER_FILLED_V1',
        templateVersion: 1,
      };
    },
  },

  SHOP_PURCHASE_CONFIRMATION_V1: {
    code: 'SHOP_PURCHASE_CONFIRMATION_V1',
    version: 1,
    category: 'SHOP' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      itemName: string;
      itemId: string;
      priceMinor: bigint | string | number;
      txId: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.priceMinor);
      return {
        category: 'SHOP',
        priority: 'NORMAL',
        title: `Sovereign Emporium: ${data.itemName} Acquired`,
        summary: `Item added to citizen vault. Consideration: ${formatted} ARTH.`,
        content: `CITIZEN VAULT ACQUISITION RECEIPT\n\nItem: ${data.itemName} (${data.itemId})\nCost: ${formatted} ARTH\nLedger Transaction: ${data.txId}\nProceeds routed to sys_shop_revenue.`,
        templateCode: 'SHOP_PURCHASE_CONFIRMATION_V1',
        templateVersion: 1,
      };
    },
  },

  SHOP_GIFT_RECEIVED_V1: {
    code: 'SHOP_GIFT_RECEIVED_V1',
    version: 1,
    category: 'SHOP' as NotificationCategory,
    priority: 'HIGH' as NotificationPriority,
    render(data: {
      itemName: string;
      itemId: string;
      senderDisplayName: string;
      txId: string;
    }): RenderedTemplate {
      return {
        category: 'SHOP',
        priority: 'HIGH',
        title: `Gift Bestowed: ${data.itemName} from ${data.senderDisplayName}`,
        summary: `Citizen ${data.senderDisplayName} gifted you ${data.itemName}. Placed directly in your vault.`,
        content: `CITIZEN RECOGNITION GIFT\n\nYou have received ${data.itemName} as a civic gift from ${data.senderDisplayName}.\nItem is available for immediate equip in your loadout.\nTransaction: ${data.txId}`,
        templateCode: 'SHOP_GIFT_RECEIVED_V1',
        templateVersion: 1,
      };
    },
  },

  CENTRAL_BANK_POLICY_DIRECTIVE_V1: {
    code: 'CENTRAL_BANK_POLICY_DIRECTIVE_V1',
    version: 1,
    category: 'POLICY' as NotificationCategory,
    priority: 'HIGH' as NotificationPriority,
    render(data: {
      directiveNumber: string;
      title: string;
      summary: string;
      effectiveDate: string;
    }): RenderedTemplate {
      return {
        category: 'POLICY',
        priority: 'HIGH',
        title: `Central Bank Directive: ${data.title}`,
        summary: data.summary,
        content: `SOVEREIGN MONETARY AUTHORITY DIRECTIVE #${data.directiveNumber}\n\nTitle: ${data.title}\nEffective Date: ${data.effectiveDate}\n\n${data.summary}\n\nBy Order of the Central Bank Council.`,
        templateCode: 'CENTRAL_BANK_POLICY_DIRECTIVE_V1',
        templateVersion: 1,
      };
    },
  },

  SECURITY_STEP_UP_ALERT_V1: {
    code: 'SECURITY_STEP_UP_ALERT_V1',
    version: 1,
    category: 'SECURITY' as NotificationCategory,
    priority: 'URGENT' as NotificationPriority,
    render(data: {
      action: string;
      ipAddress?: string;
      timestamp: string;
    }): RenderedTemplate {
      return {
        category: 'SECURITY',
        priority: 'URGENT',
        title: `Security Alert: High-Value Authorization Triggered`,
        summary: `Financial step-up authorization was required for ${data.action}.`,
        content: `SOVEREIGN SECURITY MONITORING ALERT\n\nAction: ${data.action}\nTimestamp: ${data.timestamp}\nIP: ${data.ipAddress || 'Internal Network'}\n\nIf you did not initiate this authorization, immediately lock your session and consult Central Bank Governance.`,
        templateCode: 'SECURITY_STEP_UP_ALERT_V1',
        templateVersion: 1,
      };
    },
  },

  TRANSACTION_REVERSAL_V1: {
    code: 'TRANSACTION_REVERSAL_V1',
    version: 1,
    category: 'TRANSFER' as NotificationCategory,
    priority: 'URGENT' as NotificationPriority,
    render(data: {
      originalTxId: string;
      reversalTxId: string;
      amountMinor: bigint | string | number;
      reason: string;
    }): RenderedTemplate {
      const formatted = formatArth(data.amountMinor);
      return {
        category: 'TRANSFER',
        priority: 'URGENT',
        title: `Reversal Notice: Transfer ${data.originalTxId} Reversed`,
        summary: `Statutory reversal of ${formatted} ARTH applied. Reason: ${data.reason}`,
        content: `SOVEREIGN REMITTANCE REVERSAL ORDER\n\nOriginal Transaction: ${data.originalTxId}\nReversal Transaction: ${data.reversalTxId}\nAmount: ${formatted} ARTH\nReason: ${data.reason}\n\nNotice: The original transaction confirmation remains on record for audit fidelity. This reversal constitutes a distinct sovereign corrective entry.`,
        templateCode: 'TRANSACTION_REVERSAL_V1',
        templateVersion: 1,
      };
    },
  },

  FD_BOOKING_CONFIRMATION_V1: {
    code: 'FD_BOOKING_CONFIRMATION_V1',
    version: 1,
    category: 'FD' as NotificationCategory,
    priority: 'NORMAL' as NotificationPriority,
    render(data: {
      certificateNumber: string;
      bankName: string;
      principalMinor: bigint | string | number;
      maturityAmountMinor: bigint | string | number;
      apy: number;
      maturityDate: string;
      txId: string;
    }): RenderedTemplate {
      const formattedPrincipal = formatArth(data.principalMinor);
      const formattedMaturity = formatArth(data.maturityAmountMinor);
      return {
        category: 'FD',
        priority: 'NORMAL',
        title: `FD Certificate Issued: ${data.certificateNumber}`,
        summary: `Term deposit of ${formattedPrincipal} ARTH booked with ${data.bankName} at ${data.apy.toFixed(2)}% APY.`,
        content: `SOVEREIGN FIXED DEPOSIT CERTIFICATE\n\nCertificate No: ${data.certificateNumber}\nIssuing Institution: ${data.bankName}\nPrincipal Locked: ${formattedPrincipal} ARTH\nContract APY: ${data.apy.toFixed(2)}%\nProjected Maturity Yield: ${formattedMaturity} ARTH\nMaturity Date: ${data.maturityDate}\nFunding Reference: ${data.txId}\n\nSecurity: Sovereign Double-Entry Ledger Guaranteed.`,
        templateCode: 'FD_BOOKING_CONFIRMATION_V1',
        templateVersion: 1,
      };
    },
  },

  FD_PREMATURE_WITHDRAWAL_V1: {
    code: 'FD_PREMATURE_WITHDRAWAL_V1',
    version: 1,
    category: 'FD' as NotificationCategory,
    priority: 'HIGH' as NotificationPriority,
    render(data: {
      certificateNumber: string;
      bankName: string;
      principalMinor: bigint | string | number;
      payoutAmountMinor: bigint | string | number;
      penaltyRate: number;
      effectiveApy: number;
      txId: string;
    }): RenderedTemplate {
      const formattedPrincipal = formatArth(data.principalMinor);
      const formattedPayout = formatArth(data.payoutAmountMinor);
      return {
        category: 'FD',
        priority: 'HIGH',
        title: `FD Premature Liquidation: ${data.certificateNumber}`,
        summary: `Fixed deposit ${data.certificateNumber} liquidated early. Net payout of ${formattedPayout} ARTH disbursed to source account.`,
        content: `SOVEREIGN FIXED DEPOSIT EARLY LIQUIDATION NOTICE\n\nCertificate No: ${data.certificateNumber}\nInstitution: ${data.bankName}\nPrincipal: ${formattedPrincipal} ARTH\nPenalized Yield Disbursed: ${formattedPayout} ARTH\nPreclosure Penalty Applied: ${data.penaltyRate.toFixed(2)}%\nEffective APY: ${data.effectiveApy.toFixed(2)}%\nDisbursement Transaction: ${data.txId}\n\nNotice: Contract status transitioned to BROKEN. Principal returned to liquid balance.`,
        templateCode: 'FD_PREMATURE_WITHDRAWAL_V1',
        templateVersion: 1,
      };
    },
  },

  FD_MATURED_V1: {
    code: 'FD_MATURED_V1',
    version: 1,
    category: 'FD' as NotificationCategory,
    priority: 'HIGH' as NotificationPriority,
    render(data: {
      certificateNumber: string;
      bankName: string;
      principalMinor: bigint | string | number;
      maturityAmountMinor: bigint | string | number;
      rolloverAction: string;
      txId?: string;
    }): RenderedTemplate {
      const formattedPrincipal = formatArth(data.principalMinor);
      const formattedMaturity = formatArth(data.maturityAmountMinor);
      return {
        category: 'FD',
        priority: 'HIGH',
        title: `FD Matured: ${data.certificateNumber}`,
        summary: `Fixed deposit ${data.certificateNumber} matured. Maturity proceeds of ${formattedMaturity} ARTH settled (${data.rolloverAction}).`,
        content: `SOVEREIGN FIXED DEPOSIT MATURITY NOTICE\n\nCertificate No: ${data.certificateNumber}\nInstitution: ${data.bankName}\nInitial Principal: ${formattedPrincipal} ARTH\nTotal Maturity Proceeds: ${formattedMaturity} ARTH\nDisposition: ${data.rolloverAction}\nSettlement Ref: ${data.txId || 'N/A'}\n\nStatus: MATURED.`,
        templateCode: 'FD_MATURED_V1',
        templateVersion: 1,
      };
    },
  },
};
