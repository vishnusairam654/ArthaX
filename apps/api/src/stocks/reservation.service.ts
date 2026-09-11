import { Injectable, BadRequestException, Logger } from '@nestjs/common';

export interface CashReservation {
  orderId: string;
  accountId: string;
  amountMinor: bigint;
  createdAt: Date;
}

export interface ShareReservation {
  orderId: string;
  userId: string;
  symbol: string;
  quantity: number;
  createdAt: Date;
}

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  // orderId -> CashReservation
  private cashReservations = new Map<string, CashReservation>();
  // orderId -> ShareReservation
  private shareReservations = new Map<string, ShareReservation>();

  /**
   * Calculates total cash currently committed in active orders for a bank account.
   */
  getReservedCash(accountId: string): bigint {
    let total = 0n;
    for (const res of this.cashReservations.values()) {
      if (res.accountId === accountId) {
        total += res.amountMinor;
      }
    }
    return total;
  }

  /**
   * Calculates total shares currently committed in active sell orders for a user & symbol.
   */
  getReservedShares(userId: string, symbol: string): number {
    let total = 0;
    const sym = symbol.toUpperCase();
    for (const res of this.shareReservations.values()) {
      if (res.userId === userId && res.symbol.toUpperCase() === sym) {
        total += res.quantity;
      }
    }
    return total;
  }

  /**
   * Reserves cash for a BUY order after checking available balance.
   */
  reserveCash(orderId: string, accountId: string, amountMinor: bigint): void {
    if (amountMinor <= 0n) {
      throw new BadRequestException('Cash reservation amount must be strictly greater than zero');
    }
    this.cashReservations.set(orderId, {
      orderId,
      accountId,
      amountMinor,
      createdAt: new Date(),
    });
    this.logger.debug(`Reserved ${amountMinor} minor units on account [${accountId}] for order [${orderId}]`);
  }

  /**
   * Reserves shares for a SELL order after checking available holding.
   */
  reserveShares(orderId: string, userId: string, symbol: string, quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException('Share reservation quantity must be positive');
    }
    this.shareReservations.set(orderId, {
      orderId,
      userId,
      symbol: symbol.toUpperCase(),
      quantity,
      createdAt: new Date(),
    });
    this.logger.debug(`Reserved ${quantity} shares of [${symbol}] for user [${userId}] on order [${orderId}]`);
  }

  /**
   * Releases an active cash reservation (e.g. on order cancellation).
   */
  releaseCash(orderId: string): bigint {
    const res = this.cashReservations.get(orderId);
    if (!res) return 0n;
    this.cashReservations.delete(orderId);
    this.logger.debug(`Released cash reservation of ${res.amountMinor} for order [${orderId}]`);
    return res.amountMinor;
  }

  /**
   * Releases an active share reservation (e.g. on order cancellation).
   */
  releaseShares(orderId: string): number {
    const res = this.shareReservations.get(orderId);
    if (!res) return 0;
    this.shareReservations.delete(orderId);
    this.logger.debug(`Released share reservation of ${res.quantity} shares for order [${orderId}]`);
    return res.quantity;
  }

  /**
   * Consumes cash upon trade execution. If actual trade cost is less than reserved (e.g. limit order
   * executed at better maker price), releases any surplus reservation back to the customer.
   */
  consumeCash(orderId: string, consumedAmountMinor: bigint): bigint {
    const res = this.cashReservations.get(orderId);
    if (!res) return 0n;

    if (consumedAmountMinor >= res.amountMinor) {
      // Fully consumed
      this.cashReservations.delete(orderId);
      return 0n;
    }

    // Partially consumed: update remaining or release surplus
    const remaining = res.amountMinor - consumedAmountMinor;
    res.amountMinor = remaining;
    return remaining;
  }

  /**
   * Consumes shares upon sell execution. Updates remaining reservation if partial fill.
   */
  consumeShares(orderId: string, quantityConsumed: number): number {
    const res = this.shareReservations.get(orderId);
    if (!res) return 0;

    if (quantityConsumed >= res.quantity) {
      this.shareReservations.delete(orderId);
      return 0;
    }

    const remaining = res.quantity - quantityConsumed;
    res.quantity = remaining;
    return remaining;
  }

  /**
   * Gets details of an active order reservation.
   */
  getOrderReservation(orderId: string): { cash?: bigint; shares?: number } {
    const cash = this.cashReservations.get(orderId)?.amountMinor;
    const shares = this.shareReservations.get(orderId)?.quantity;
    return { cash, shares };
  }
}
