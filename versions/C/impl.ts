import type { MarketplaceCharge, SplitHistory } from './interface.ts';

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;

  if (order.kind === 'sale' && !order.settled) {
    return 0;
  }

  const feeCents = Math.round(order.goodsCents * 0.1) + 30;
  return order.kind === 'refund' ? -feeCents : feeCents;
}
