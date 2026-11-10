import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.1;
const FEE_FIXED_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  if (goodsCents <= 0) return 0;
  return Math.round(goodsCents * FEE_RATE) + FEE_FIXED_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = feeOnGoods(order.goodsCents);
  if (order.kind === 'refund') return -fee;
  return order.settled ? fee : 0;
}
