import type { MarketplaceCharge, SplitHistory } from './interface.ts';

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;

  const feeCents = Math.round(order.goodsCents / 10) + 30;
  return order.kind === 'sale' ? feeCents : -feeCents;
}
