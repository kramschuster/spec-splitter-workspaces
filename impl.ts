import type { Decline, RetryHistory } from './interface.ts';

const CHECKOUT_TRIES = 3;
const SUPPORT_TRIES = 4;

export function retryCents(order: Decline, history: RetryHistory): number {
  const chain = retryChain(order, history);
  if (chain.some((attempt) => attempt.decline === 'hard')) return 0;

  const triesSoFar = chainCount(order, chain);
  const feeCents = cents(order.feeCents);
  const amountCents = cents(order.amountCents);

  // Checkout retries the quoted invoice (amount + fee) through the 3rd try.
  if (triesSoFar < CHECKOUT_TRIES) return amountCents + feeCents;
  // One support retry after checkout stops: half the invoice amount, fee kept.
  if (triesSoFar < SUPPORT_TRIES) return Math.floor(amountCents / 2) + feeCents;
  return 0;
}

function retryChain(order: Decline, history: RetryHistory): Decline[] {
  const chain: Decline[] = [];
  const seen = new Set<string>();
  const add = (attempt: Decline | undefined) => {
    if (!attempt) return;
    const key = `${attempt.id}:${attempt.attempt}`;
    if (seen.has(key)) return;
    seen.add(key);
    chain.push(attempt);
  };

  if (history && history.customerId === order.customerId) {
    for (const attempt of history.attempts ?? []) {
      if (attempt && attempt.customerId === order.customerId) add(attempt);
    }
  }
  add(order);
  return chain;
}

function chainCount(order: Decline, chain: Decline[]): number {
  let n = 0;
  for (const attempt of chain) n = Math.max(n, cents(attempt.attempt) || 1);
  return Math.max(cents(order.attempt) || 1, n, chain.length);
}

function cents(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
