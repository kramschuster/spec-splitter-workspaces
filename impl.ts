import type { Decline, RetryHistory } from './interface.ts';

const CHECKOUT_TRIES = 3;

function chargeCents(order: Decline): number {
  const amount = Number.isFinite(order.amountCents) ? order.amountCents : 0;
  const fee = Number.isFinite(order.feeCents) ? order.feeCents : 0;
  return amount + fee;
}

function sameInvoice(order: Decline, prior: Decline): boolean {
  return prior.id === order.id && prior.customerId === order.customerId;
}

function recordedAttempts(order: Decline, history: RetryHistory): Decline[] {
  if (!history || history.customerId !== order.customerId || !Array.isArray(history.attempts)) {
    return [];
  }
  return history.attempts.filter((prior) => sameInvoice(order, prior));
}

function triesSoFar(order: Decline, history: RetryHistory): number {
  const seen = new Set<number>();
  if (order.attempt >= 1) seen.add(order.attempt);
  for (const prior of recordedAttempts(order, history)) {
    if (prior.attempt >= 1) seen.add(prior.attempt);
  }
  return seen.size === 0 ? 1 : Math.max(...seen);
}

function invoiceHadHardDecline(order: Decline, history: RetryHistory): boolean {
  for (const prior of recordedAttempts(order, history)) {
    if (prior.decline === 'hard') return true;
  }
  return false;
}

export function retryCents(order: Decline, history: RetryHistory): number {
  if (order.decline === 'hard' || invoiceHadHardDecline(order, history)) return 0;

  const full = chargeCents(order);
  if (full <= 0) return 0;

  const tries = triesSoFar(order, history);
  if (tries < CHECKOUT_TRIES) return full;
  if (tries === CHECKOUT_TRIES) return Math.floor(full / 2);
  return 0;
}
