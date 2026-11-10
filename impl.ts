import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.10;
const FEE_FIXED_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  return Math.round(goodsCents * FEE_RATE) + FEE_FIXED_CENTS;
}

/**
 * Positive: fee ModFin keeps on a settled sale. Negative: fee returned to the seller on a refund.
 * Shipping is passed through to the carrier and never carries a fee.
 */
export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  if (order.kind === 'sale') {
    return order.settled ? feeOnGoods(order.goodsCents) : 0;
  }
  if (order.kind === 'refund') {
    return -feeOnGoods(order.goodsCents);
  }
  return 0;
}
