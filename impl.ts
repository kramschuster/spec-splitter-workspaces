import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  const goods = cents(order.goodsCents);
  if (goods === 0) return 0;

  // Prepaid is off the surcharge list. Checkout holds half the merchandise.
  if (order.card === 'prepaid') return Math.floor(goods / 2);

  // Debit runs through the same checkout: goods plus the precomputed surcharge.
  if (order.card === 'credit' || order.card === 'debit') {
    return goods + cents(order.surchargeCents);
  }

  return 0;
}

function cents(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}
