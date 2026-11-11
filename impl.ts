import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE_PERCENT = 10;
const FEE_FIXED_CENTS = 30;

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  if (order.goodsCents <= 0) return 0;

  const fee = Math.round((order.goodsCents * FEE_RATE_PERCENT) / 100) + FEE_FIXED_CENTS;
  return order.kind === 'refund' ? -fee : fee;
}
