import type { CustomerHistory, Order } from './interface.ts';

// Reading: threshold gte, base subtotal, cap calendar-month
export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  const amount = order.subtotalCents;
  if (amount < 50_000) return 0;
  const alreadyUsed = history.orders.filter((o) => o.date.slice(0, 7) === order.date.slice(0, 7)).reduce((s, o) => s + o.loyaltyDiscountCents, 0);
  const capLeft = Math.max(0, 5_000 - alreadyUsed);
  return Math.min(Math.round(amount * 0.1), capLeft);
}
