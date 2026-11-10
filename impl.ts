import type { MarketplaceCharge, SplitHistory } from './interface.ts';

function feeOnGoods(goodsCents: number): number {
  return Math.round(goodsCents / 10) + 30;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = feeOnGoods(order.goodsCents);
  if (order.kind === 'refund') {
    // Full clawback of 10% of refunded goods + $0.30, even if nothing was collected.
    return -fee;
  }
  // Unsettled authorizations are not sales; the fee is taken only once the sale settles.
  if (order.kind === 'sale' && order.settled) {
    return fee;
  }
  return 0;
}
