import type { MarketplaceCharge, SplitHistory } from './interface.ts';

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;

  const feeCents = Math.round(order.goodsCents * 0.1) + 30;

  if (order.kind === 'refund') {
    return -feeCents;
  }

  return order.settled ? feeCents : 0;
}
