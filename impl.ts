import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.1;
const FEE_FIXED_CENTS = 30;

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;

  if (order.goodsCents <= 0) return 0;

  const fee = Math.round(order.goodsCents * FEE_RATE) + FEE_FIXED_CENTS;

  if (order.kind === 'refund') return -fee;
  return order.settled ? fee : 0;
}
