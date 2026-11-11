import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE_PERCENT = 10;
const FIXED_FEE_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  // 10% rounded half-up to the cent; shipping is passed to the carrier and never carries a fee.
  return Math.round((goodsCents * FEE_RATE_PERCENT) / 100) + FIXED_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const goods = Math.abs(order.goodsCents);
  if (order.kind === 'refund') {
    // Returned to the seller, so recorded as a negative fee; not capped by fees previously collected.
    return -feeOnGoods(goods);
  }
  // Taken at authorization, settled or not.
  return feeOnGoods(goods);
}
