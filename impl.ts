import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FIXED_FEE_CENTS = 30;

// 10% of merchandise, nearest cent (half up), plus $0.30.
// Shipping is a carrier pass-through and is not part of the base.
function merchandiseFeeCents(goodsCents: number): number {
  if (!Number.isFinite(goodsCents) || goodsCents < 0) return 0;
  return Math.round((goodsCents * 10) / 100) + FIXED_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  const fee = merchandiseFeeCents(order.goodsCents);
  // Finance accrues the full fee when the sale is authorized, so settlement
  // does not gate it. A refund claws the fee back; the desk returns half.
  if (order.kind === 'sale') return fee;
  if (order.kind === 'refund') return Math.round(fee / 2);
  return 0;
}
