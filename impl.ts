import type { Decline, RetryHistory } from './interface.ts';

export function retryCents(order: Decline, history: RetryHistory): number {
  void history;

  if (order.decline !== 'soft' || order.attempt > 3) {
    return 0;
  }

  const invoiceCents = order.amountCents + order.feeCents;

  if (order.attempt < 3) {
    return invoiceCents;
  }

  return Math.floor(order.amountCents / 2) + order.feeCents;
}
