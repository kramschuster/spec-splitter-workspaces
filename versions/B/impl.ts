import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  const goods = order.goodsCents ?? 0;
  if (goods <= 0) return 0;

  // Prepaid is off the surcharge list. Checkout already holds half the goods;
  // do not add the 3% on top of that hold.
  if (order.card === 'prepaid') {
    return Math.floor(goods / 2);
  }

  // Credit carries a 3% surcharge sent with the auth. Debit uses the same checkout,
  // so it authorizes goods plus the already-computed surcharge as well.
  return goods + (order.surchargeCents ?? 0);
}
