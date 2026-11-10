import type { CardSale, SurchargeHistory } from './interface.ts';

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  const goods = cents(order.goodsCents);
  if (goods === 0) return 0;
  if (order.card === 'credit') return goods + cents(order.surchargeCents);
  return goods;
}

function cents(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
}
