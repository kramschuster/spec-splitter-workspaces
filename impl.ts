import type { CardSale, SurchargeHistory } from './interface.ts';

// Amount sent to the network for this sale.
// Credit and debit share the checkout: the surcharge sits on top of the goods.
// Prepaid is not surcharged, so the authorization is the merchandise total.
// The half-goods prepaid hold is not the written rule.
export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  if (order.card === 'prepaid') return order.goodsCents;
  return order.goodsCents + order.surchargeCents;
}
