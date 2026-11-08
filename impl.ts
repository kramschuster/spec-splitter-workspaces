import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  if (order.subtotalCents <= 50000) {
    return 0;
  }
  const discount = Math.floor(order.subtotalCents / 10);
  return Math.min(discount, 5000);
}
