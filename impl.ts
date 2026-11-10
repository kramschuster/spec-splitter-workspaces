import type { MerchantBalance, PayoutHistory } from './interface.ts';

const RESERVE_MIN_AGE_DAYS = 7;

function wholeCents(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void history;
  const available = wholeCents(order.availableCents);
  if (order.riskCleared === true) return available;
  if (!(order.ageDays >= RESERVE_MIN_AGE_DAYS)) return 0;
  return Math.floor(available / 2);
}
