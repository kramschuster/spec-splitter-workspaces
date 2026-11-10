import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  const surcharge = order.card === 'credit' ? order.surchargeCents : 0;
  const total = order.goodsCents + surcharge;
  return total > 0 ? total : 0;
}
