import type { CardSale, SurchargeHistory } from './interface.ts';

function isValidCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  if (!order || !isValidCents(order.goodsCents) || order.goodsCents === 0) return 0;

  switch (order.card) {
    case 'credit': {
      const surcharge = isValidCents(order.surchargeCents) ? order.surchargeCents : 0;
      return order.goodsCents + surcharge;
    }
    case 'debit':
    case 'prepaid':
      return order.goodsCents;
    default:
      return 0;
  }
}
