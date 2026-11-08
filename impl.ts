import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000;
const DISCOUNT_RATE = 0.1;
const DISCOUNT_CAP_CENTS = 5_000;

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  void history;
  if (order.subtotalCents <= THRESHOLD_CENTS) {
    return 0;
  }
  const uncapped = Math.floor(order.subtotalCents * DISCOUNT_RATE);
  return Math.min(uncapped, DISCOUNT_CAP_CENTS);
}
