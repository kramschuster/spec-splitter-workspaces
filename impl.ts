import type { MerchantBalance, PayoutHistory } from './interface.ts';

export function payoutCents(order: MerchantBalance, history: PayoutHistory): number {
  void order; void history;
  throw new Error('not implemented');
}
