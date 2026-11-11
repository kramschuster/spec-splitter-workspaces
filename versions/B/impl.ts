import type { MarketplaceCharge, SplitHistory } from './interface.ts';

/** 10% of merchandise (nearest cent) plus the $0.30 fixed fee. */
function feeOnGoods(goodsCents: number): number {
  return Math.round(goodsCents / 10) + 30;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = feeOnGoods(order.goodsCents);
  if (order.kind === 'refund') {
    // Desk returns half the fee; caller uses `kind` to treat this as a clawback.
    return Math.floor(fee / 2);
  }
  // Sales, including unsettled authorizations: finance accrues the fee at auth.
  return fee;
}
