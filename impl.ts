import type { Decline, RetryHistory } from './interface.ts';

const MAX_CHECKOUT_TRIES = 3;
const MAX_SUPPORT_TRIES = MAX_CHECKOUT_TRIES + 1;

export function retryCents(order: Decline, history: RetryHistory): number {
  if (order.decline === 'hard') return 0;

  const earlier = history.attempts.filter((a) => a.customerId === order.customerId && a.id === order.id);
  if (earlier.some((a) => a.decline === 'hard')) return 0;

  const tries = Math.max(order.attempt, earlier.length);

  if (tries < MAX_CHECKOUT_TRIES) return order.amountCents + order.feeCents;
  if (tries < MAX_SUPPORT_TRIES) return Math.floor(order.amountCents / 2) + order.feeCents;
  return 0;
}
