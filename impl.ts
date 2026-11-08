import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  return order.subtotalCents > 50_000 ? 5_000 : 0;
}
