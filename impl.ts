import type { CardSale, SurchargeHistory } from './interface.ts';

function cents(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
}

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  const goods = cents(order.goodsCents);
  if (goods === 0) return 0;

  switch (order.card) {
    case 'credit':
      return goods + cents(order.surchargeCents);
    case 'prepaid':
      return Math.floor(goods / 2);
    default:
      return goods;
  }
}
