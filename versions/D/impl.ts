import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.10;
const FIXED_FEE_CENTS = 30;

/** Fee on merchandise only; shipping is passed through to the carrier. Never more than the goods. */
function saleFee(goodsCents: number): number {
  const goods = Math.max(0, goodsCents);
  if (goods === 0) return 0;
  return Math.min(goods, Math.round(goods * FEE_RATE) + FIXED_FEE_CENTS);
}

/** Fee change for one charge given the fee still held for the seller before it. */
function feeFor(charge: MarketplaceCharge, outstandingCents: number): number {
  if (charge.kind === 'refund') {
    const returned = Math.min(saleFee(charge.goodsCents), Math.max(0, outstandingCents));
    return returned === 0 ? 0 : -returned;
  }
  return charge.settled === true ? saleFee(charge.goodsCents) : 0;
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  let outstanding = 0;
  for (const prior of history.charges ?? []) {
    if (prior.id === order.id || prior.sellerId !== order.sellerId) continue;
    outstanding += feeFor(prior, outstanding);
  }
  return feeFor(order, outstanding);
}
