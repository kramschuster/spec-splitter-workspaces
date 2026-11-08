import type { CustomerHistory, Order } from './interface.ts';

const THRESHOLD_CENTS = 50_000;
const DISCOUNT_RATE = 0.1;
const MAX_DISCOUNT_CENTS = 5_000;

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  if (order.subtotalCents <= THRESHOLD_CENTS) {
    return 0;
  }

  const rawDiscountCents = Math.round(order.subtotalCents * DISCOUNT_RATE);
  return Math.min(rawDiscountCents, MAX_DISCOUNT_CENTS);
}

