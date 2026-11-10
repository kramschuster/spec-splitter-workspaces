import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  return order.goodsCents + (order.card === 'credit' ? order.surchargeCents : 0);
}
