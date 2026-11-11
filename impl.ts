import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FIXED_FEE_CENTS = 30;

/** 10% of whole cents, rounded half up (a remainder of 5 rounds away from zero). */
function tenPercentCents(goodsCents: number): number {
  const whole = Math.trunc(goodsCents);
  const base = Math.floor(whole / 10);
  return whole % 10 >= 5 ? base + 1 : base;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  // A refund is computed from its own goods and is not capped by fees already taken.
  void history;

  const goods = order.goodsCents;
  if ((order.kind !== 'sale' && order.kind !== 'refund') || !Number.isFinite(goods) || goods < 0) {
    return 0;
  }

  return tenPercentCents(goods) + FIXED_FEE_CENTS;
}
