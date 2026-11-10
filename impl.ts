import type { MerchantBalance, PayoutHistory } from './interface.ts';

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void history;

  const availableCents = Math.max(0, Math.floor(order.availableCents));

  if (order.riskCleared) {
    return availableCents;
  }

  if (order.ageDays >= 7) {
    return Math.floor(availableCents / 2);
  }

  return 0;
}
