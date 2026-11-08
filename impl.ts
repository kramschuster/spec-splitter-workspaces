import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000;
const CAP_CENTS = 5_000;
const DISCOUNT_RATE_PERCENT = 10;

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  if (order.subtotalCents <= THRESHOLD_CENTS) {
    return 0;
  }

  const uncapped = Math.floor((order.subtotalCents * DISCOUNT_RATE_PERCENT) / 100);
  return Math.min(uncapped, CAP_CENTS);
}
