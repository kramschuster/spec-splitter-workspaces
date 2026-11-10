import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const RATE = 0.10;
const FIXED_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  if (!Number.isFinite(goodsCents) || goodsCents <= 0) return 0;
  return Math.round(goodsCents * RATE) + FIXED_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = feeOnGoods(order.goodsCents);
  if (order.kind === 'refund') return -Math.round(fee / 2);
  return fee;
}
