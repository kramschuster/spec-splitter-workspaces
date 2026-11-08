import type { CustomerHistory, Order } from './interface.ts';

// $500 in cents. "Over" is exclusive: an order of exactly $500 does not qualify.
const OVER_CENTS = 50_000;
// $50 in cents. The cap applies to this order alone.
const CAP_CENTS = 5_000;

/** 10% of a cent amount, rounded half up to the nearest cent. */
function tenPercent(cents: number): number {
  return Math.round((cents * 10) / 100);
}

export function loyaltyDiscount(order: Order, _history: CustomerHistory): number {
  // Merchandise subtotal only. Tax, shipping, and past orders do not apply.
  const subtotal = order.subtotalCents;
  if (!Number.isFinite(subtotal) || subtotal <= OVER_CENTS) return 0;
  const raw = tenPercent(subtotal);
  return raw > CAP_CENTS ? CAP_CENTS : raw;
}
