import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const RATE_PERCENT = 10;
const FLAT_FEE_CENTS = 30; // $0.30

/** 10% of merchandise plus the $0.30 flat fee. Shipping is pass-through, not in the base. */
function saleFeeCents(goodsCents: number): number {
  if (goodsCents <= 0) return 0;
  return Math.round((goodsCents * RATE_PERCENT) / 100) + FLAT_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = saleFeeCents(order.goodsCents);
  if (order.kind === 'sale') {
    // Finance accrues the fee at authorization, so unsettled sales still bear it.
    return fee;
  }
  if (order.kind === 'refund') {
    // Desk returns half of the fee that would apply to this merchandise amount.
    return Math.round(fee / 2);
  }
  return 0;
}
