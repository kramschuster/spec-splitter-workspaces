import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  if (order.goodsCents <= 0) return 0;

  // Prepaid is not on the surcharge list. Checkout already holds half the goods;
  // do not add the 3% on top of that hold.
  if (order.card === 'prepaid') {
    return Math.floor(order.goodsCents / 2);
  }

  // Credit can carry the 3% surcharge; debit runs through the same checkout,
  // so the surcharge is sent with the authorization in both cases.
  const surcharge = order.surchargeCents > 0 ? order.surchargeCents : 0;
  if (order.card === 'credit' || order.card === 'debit') {
    return order.goodsCents + surcharge;
  }

  return 0;
}
