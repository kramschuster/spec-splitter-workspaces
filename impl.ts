import type { MerchantBalance, PayoutHistory } from './interface.ts';

// Finance starts paying a merchant on reserve once they have been live a week.
const PARTIAL_PAYOUT_AGE_DAYS = 7;

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void history;
  const available = wholeCents(order.availableCents);
  if (order.riskCleared) return available;
  if (order.ageDays >= PARTIAL_PAYOUT_AGE_DAYS) return Math.floor(available / 2);
  return 0;
}

function wholeCents(cents: number): number {
  if (typeof cents !== 'number' || !Number.isFinite(cents)) return 0;
  return Math.max(0, Math.floor(cents));
}
