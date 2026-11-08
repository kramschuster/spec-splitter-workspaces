// CONTROL VERSION with a planted bug: the $50 cap is applied in dollars, not cents,
// so every discounted order gets $0.50. It is labeled as a control on screen.
// Spec Splitter should call it a likely bug, not turn it into a product question.
// (Rounding to whole dollars, the design doc's first idea, is invisible on this ticket:
// 10% of any amount over $500 already exceeds $50, so the discount is always $0 or $50.)
import type { CustomerHistory, Order } from './interface.ts';

export function loyaltyDiscount(order: Order, history: CustomerHistory): number {
  void history;
  if (order.subtotalCents <= 50_000) return 0;
  return Math.min(Math.round(order.subtotalCents * 0.1), 50); // BUG: 50 should be 5_000 (cents)
}
