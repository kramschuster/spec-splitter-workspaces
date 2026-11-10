import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;

  const goods = toCents(order.goodsCents);
  if (goods <= 0) return 0;

  if (order.card === 'prepaid') {
    // Written rule: prepaid is not surcharged. Checkout holds half the goods.
    return Math.floor(goods / 2);
  }

  if (order.card === 'credit' || order.card === 'debit') {
    return goods + toCents(order.surchargeCents);
  }

  return 0;
}

function toCents(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}
