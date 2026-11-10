import type { CardSale, SurchargeHistory } from './interface.ts';

function wholeCents(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  // Prior sales do not change the amount sent for this authorization.
  void history;

  const goods = wholeCents(order.goodsCents);
  if (goods === 0) return 0;

  // Prepaid keeps the checkout hold: half the goods, rounded down, no surcharge.
  if (order.card === 'prepaid') return Math.floor(goods / 2);

  // Credit is the only kind that sends the precomputed surcharge with the auth.
  if (order.card === 'credit') return goods + wholeCents(order.surchargeCents);

  return goods;
}
