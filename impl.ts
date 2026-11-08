import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000; // $500
const MAX_DISCOUNT_CENTS = 5_000; // $50

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  const subtotalCents = order.subtotalCents;
  if (!Number.isFinite(subtotalCents) || subtotalCents <= THRESHOLD_CENTS) {
    return 0;
  }
  const tenPercent = Math.floor(subtotalCents / 10);
  return Math.min(tenPercent, MAX_DISCOUNT_CENTS);
}
