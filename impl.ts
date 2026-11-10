import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  if (order.card === 'prepaid') {
    return Math.floor(order.goodsCents / 2);
  }
  return order.goodsCents + order.surchargeCents;
}
