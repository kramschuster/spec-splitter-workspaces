import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  const goods = order.goodsCents;
  if (!Number.isFinite(goods) || goods <= 0) return 0;

  // Credit: 3% surcharge rides on the authorization. Debit uses this checkout
  // but is not a surcharged product. Prepaid is off the surcharge list and
  // authorizes the full goods amount (replacing the old half-goods hold).
  if (order.card === 'credit') {
    const surcharge = Number.isFinite(order.surchargeCents) && order.surchargeCents > 0
      ? order.surchargeCents
      : 0;
    return goods + surcharge;
  }

  return goods;
}
