import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FIXED_FEE_CENTS = 30;

// 10% of whole merchandise cents, rounded half-up, plus the $0.30 fixed fee.
// Shipping is not part of the base. Null means the goods amount cannot be priced.
function feeOnGoods(goodsCents: number): number | null {
  if (!Number.isFinite(goodsCents) || goodsCents < 0) return null;
  const percentage = Math.floor((Math.trunc(goodsCents) + 5) / 10);
  return percentage + FIXED_FEE_CENTS;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  // Prior collection does not change this charge's fee.
  void history;

  const fee = feeOnGoods(order?.goodsCents);
  if (fee === null) return 0;
  // Kept on a sale, including an authorization finance accrues before settlement.
  if (order.kind === 'sale') return fee;
  // A refund returns the full fee.
  if (order.kind === 'refund') return -fee;
  return 0;
}
