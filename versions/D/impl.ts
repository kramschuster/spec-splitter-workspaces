import type { MarketplaceCharge, SplitHistory } from './interface.ts';

const FEE_RATE = 0.10;
const FIXED_FEE_CENTS = 30;

function feeOnGoods(goodsCents: number): number {
  const goods = Math.max(0, Math.abs(goodsCents));
  if (goods === 0) return 0;
  return Math.min(goods, Math.round(goods * FEE_RATE) + FIXED_FEE_CENTS);
}

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  if (order.kind === 'sale') {
    return order.settled ? feeOnGoods(order.goodsCents) : 0;
  }

  const others = history.charges.filter(
    (c) => c.id !== order.id && c.sellerId === order.sellerId,
  );
  const collected = others
    .filter((c) => c.kind === 'sale' && c.settled)
    .reduce((sum, c) => sum + feeOnGoods(c.goodsCents), 0);
  const alreadyReturned = others
    .filter((c) => c.kind === 'refund')
    .reduce((sum, c) => sum + feeOnGoods(c.goodsCents), 0);
  const remaining = Math.max(0, collected - alreadyReturned);

  const clawback = Math.min(feeOnGoods(order.goodsCents), remaining);
  return clawback === 0 ? 0 : -clawback;
}
