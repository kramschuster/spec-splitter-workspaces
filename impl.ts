import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  switch (order.card) {
    case 'credit':
      return order.goodsCents + order.surchargeCents;
    case 'debit':
      return order.goodsCents;
    case 'prepaid':
      return Math.floor(order.goodsCents / 2);
  }
}
