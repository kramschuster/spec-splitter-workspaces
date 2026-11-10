import type { CardSale, SurchargeHistory } from './interface.ts';

function validCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function authorizedCents(order: CardSale, history: SurchargeHistory): number {
  void history;
  const goods = order.goodsCents;
  if (!validCents(goods) || goods === 0) return 0;

  // Card-network rules forbid surcharging debit and prepaid; only credit carries it.
  if (order.card === 'credit') {
    const surcharge = validCents(order.surchargeCents)
      ? order.surchargeCents
      : Math.round(goods * 0.03);
    return goods + surcharge;
  }
  return goods;
}
