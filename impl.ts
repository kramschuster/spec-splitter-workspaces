import type { MerchantBalance, PayoutHistory } from './interface.ts';

const MIN_AGE_DAYS = 7;

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void history;
  const available = Math.max(0, Math.floor(order.availableCents));
  if (order.riskCleared) return available;
  if (order.ageDays >= MIN_AGE_DAYS) return Math.floor(available / 2);
  return 0;
}
