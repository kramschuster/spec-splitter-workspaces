import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000;
const CAP_CENTS = 5_000;
const RATE = 0.1;

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  if (order.subtotalCents <= THRESHOLD_CENTS) {
    return 0;
  }
  return Math.min(Math.round(order.subtotalCents * RATE), CAP_CENTS);
}
