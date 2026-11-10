import type { MerchantBalance, PayoutHistory } from './interface.ts';

const WEEK_DAYS = 7;

function wholeCents(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void history;

  const available = wholeCents(order?.availableCents);
  if (available === 0) return 0;

  // Risk has released the reserve: pay the full cleared balance.
  if (order.riskCleared) return available;

  // Still on reserve. Finance starts paying after a week live, at half.
  const ageDays = Number(order.ageDays);
  if (!Number.isFinite(ageDays) || ageDays < WEEK_DAYS) return 0;

  return Math.floor(available / 2);
}
