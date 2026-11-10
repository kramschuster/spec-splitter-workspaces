import type { Decline, RetryHistory } from './interface.ts';

export function retryCents(order: Decline, history: RetryHistory): number {
  if (order.decline === 'hard' || history.customerId !== order.customerId) {
    return 0;
  }

  const latestAttempt = history.attempts.reduce(
    (latest, attempt) =>
      attempt.customerId === order.customerId
        ? Math.max(latest, attempt.attempt)
        : latest,
    order.attempt,
  );

  if (latestAttempt < 3) {
    return order.amountCents + order.feeCents;
  }

  if (latestAttempt === 3) {
    return Math.floor(order.amountCents / 2) + order.feeCents;
  }

  return 0;
}
