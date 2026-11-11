import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FIXED_FEE_CENTS = 30;

/** 10% of a non-negative cent amount, rounded half away from zero. */
function tenPercentNearestCent(goodsCents: number): number {
  const whole = Math.floor(goodsCents);
  const towardZero = Math.floor(whole / 10);
  const remainder = whole % 10;
  return towardZero + (remainder >= 5 ? 1 : 0);
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void history;
  if (!Number.isFinite(order.goodsCents)) return 0;
  // Shipping is passed to the carrier, so the fee is assessed on merchandise only.
  // Finance accrues this same fee at authorization, before the sale settles.
  const goods = Math.abs(Math.trunc(order.goodsCents));
  const fee = tenPercentNearestCent(goods) + FIXED_FEE_CENTS;
  // A refund claws the whole fee back. Negative means the fee is returned.
  return order.kind === 'refund' ? -fee : fee;
}
