import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  throw new Error('not implemented');
}
