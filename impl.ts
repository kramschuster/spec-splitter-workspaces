import type { CustomerHistory, Order } from './interface.ts';

// Dollars from the ticket, in cents. Threshold is exclusive: "over $500".
const THRESHOLD_CENTS = 50_000;
const CAP_CENTS = 5_000;

/** 10% of a cent amount, rounded half up to the nearest cent. */
function tenPercentCents(amountCents: number): number {
  return Math.floor((amountCents + 5) / 10);
}

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  // Merchandise subtotal only. Tax and shipping are outside the offer,
  // and prior orders do not change this order's discount.
  if (order.subtotalCents <= THRESHOLD_CENTS) return 0;
  return Math.min(tenPercentCents(order.subtotalCents), CAP_CENTS);
}
