import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  if (order.card === 'credit') return order.goodsCents + order.surchargeCents;
  return order.goodsCents;
}
