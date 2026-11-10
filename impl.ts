import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.10;
const FIXED_FEE_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  return Math.round(goodsCents * FEE_RATE) + FIXED_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  if (order.kind === 'refund') {
    return -feeOnGoods(order.goodsCents);
  }
  if (!order.settled) {
    return 0;
  }
  return feeOnGoods(order.goodsCents);
}
