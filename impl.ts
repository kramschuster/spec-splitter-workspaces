import type { CardSale, SurchargeHistory } from './interface.ts';

// Amount to authorize, in cents. Zero means do not authorize.
// Credit carries the precomputed surcharge on top of the goods.
// Debit checks out here for the goods only — a surcharge is credit-only.
// Prepaid is not surcharged: the hold is half the goods.
export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  const goods = wholeCents(order?.goodsCents);
  if (goods === 0) return 0;

  if (order.card === 'prepaid') return Math.floor(goods / 2);
  if (order.card === 'credit') return goods + wholeCents(order.surchargeCents);
  if (order.card === 'debit') return goods;
  return 0;
}

function wholeCents(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}
