import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  void history;

  if (order.subtotalCents <= 50_000) {
    return 0;
  }

  return Math.min(Math.floor(order.subtotalCents * 0.1), 5_000);
}
