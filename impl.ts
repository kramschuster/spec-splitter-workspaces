import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  void history;

  if (order.subtotalCents <= 50_000) {
    return 0;
  }

  const percentageDiscountCents = Math.round(order.subtotalCents * 0.1);
  return Math.min(percentageDiscountCents, 5_000);
}
