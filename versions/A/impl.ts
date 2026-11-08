import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000;
const CAP_CENTS = 5_000;

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  const subtotalCents = order.subtotalCents;
  if (!(subtotalCents > THRESHOLD_CENTS)) return 0;
  const tenPercentCents = Math.floor((subtotalCents * 10 + 50) / 100);
  return Math.min(tenPercentCents, CAP_CENTS);
}
