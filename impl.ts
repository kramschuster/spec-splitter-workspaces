import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const GOODS_FEE_NUMERATOR = 10;
const GOODS_FEE_DENOMINATOR = 100;
const FIXED_FEE_CENTS = 30;

function feeOnGoodsCents(goodsCents: number): number {
  return Math.round((goodsCents * GOODS_FEE_NUMERATOR) / GOODS_FEE_DENOMINATOR) + FIXED_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = feeOnGoodsCents(order.goodsCents);
  if (order.kind === 'refund') return -fee;
  return fee;
}
