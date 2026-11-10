import type { Decline, RetryHistory } from './interface.ts';

export function retryCents(order: Decline, history: RetryHistory): number {
  if (
    order.decline !== 'soft'
    || order.customerId !== history.customerId
    || order.attempt < 1
    || order.attempt > 3
  ) {
    return 0;
  }

  const invoiceCents = order.attempt === 3
    ? Math.floor(order.amountCents / 2)
    : order.amountCents;

  return invoiceCents + order.feeCents;
}
