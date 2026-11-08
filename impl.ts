import type { CustomerHistory, Order } from './interface.ts';

/** Merchandise subtotal must reach $500.00. Tax and shipping do not count. */
const THRESHOLD_CENTS = 50_000;
/** 10% off, and never more than $50.00 on one order. */
const CAP_CENTS = 5_000;

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  // The offer is per order. Earlier loyalty discounts do not reduce or block it.
  void history;

  const subtotalCents = order.subtotalCents;
  if (!Number.isFinite(subtotalCents) || subtotalCents < THRESHOLD_CENTS) return 0;

  const tenPercentOff = Math.round((subtotalCents * 10) / 100);
  if (tenPercentOff <= 0) return 0;
  return Math.min(tenPercentOff, CAP_CENTS);
}
