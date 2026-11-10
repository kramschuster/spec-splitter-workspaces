import type { Decline, RetryHistory } from './interface.ts';

const CHECKOUT_TRIES = 3;

function invoiceTotal(order: Decline): number {
  return order.amountCents + order.feeCents;
}

function supportRetryCents(order: Decline): number {
  return Math.floor(order.amountCents / 2) + order.feeCents;
}

function samePayment(prior: Decline, order: Decline): boolean {
  return prior.id === order.id;
}

function triesSoFar(order: Decline, history: RetryHistory): number {
  let tries = order.attempt;
  for (const prior of history.attempts ?? []) {
    if (samePayment(prior, order) && prior.attempt > tries) tries = prior.attempt;
  }
  return tries;
}

function isHardBlocked(order: Decline, history: RetryHistory): boolean {
  if (order.decline === 'hard') return true;
  for (const prior of history.attempts ?? []) {
    if (samePayment(prior, order) && prior.decline === 'hard') return true;
  }
  return false;
}

export function retryCents(order: Decline, history: RetryHistory): number {
  if (isHardBlocked(order, history)) return 0;

  const tries = triesSoFar(order, history);
  let cents = 0;
  if (tries < CHECKOUT_TRIES) cents = invoiceTotal(order);
  else if (tries === CHECKOUT_TRIES) cents = supportRetryCents(order);

  return cents > 0 ? cents : 0;
}
