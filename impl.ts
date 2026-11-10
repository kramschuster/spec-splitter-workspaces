import type { Decline, RetryHistory } from './interface.ts';

const CHECKOUT_MAX_ATTEMPTS = 3;
const SUPPORT_EXTRA_ATTEMPTS = 1;

export function retryCents(order: Decline, history: RetryHistory): number {
  void history;

  if (order.decline !== 'soft') return 0;

  const nextAttempt = order.attempt + 1;
  const fullInvoice = order.amountCents + order.feeCents;

  if (nextAttempt <= CHECKOUT_MAX_ATTEMPTS) return fullInvoice;

  if (nextAttempt <= CHECKOUT_MAX_ATTEMPTS + SUPPORT_EXTRA_ATTEMPTS) {
    return Math.floor(order.amountCents / 2) + order.feeCents;
  }

  return 0;
}
