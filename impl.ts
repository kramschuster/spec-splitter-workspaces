import type { Decline, RetryHistory } from './interface.ts';

const CHECKOUT_TRIES = 3;
const SUPPORT_TRY = CHECKOUT_TRIES + 1;

function cents(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
}

export function retryCents(order: Decline, history: RetryHistory): number {
  const priorDeclines = (history?.attempts ?? []).filter(
    (a) => a && a.id === order.id && a.customerId === order.customerId,
  );

  if (order.decline !== 'soft' || priorDeclines.some((a) => a.decline === 'hard')) return 0;

  const triesMade = Math.max(
    Number.isInteger(order.attempt) && order.attempt > 0 ? order.attempt : 1,
    ...priorDeclines.map((a) => (Number.isInteger(a.attempt) ? a.attempt : 0)),
    priorDeclines.length,
  );
  const nextTry = triesMade + 1;

  const amount = cents(order.amountCents);
  const fee = cents(order.feeCents);

  if (nextTry <= CHECKOUT_TRIES) return amount + fee;
  if (nextTry === SUPPORT_TRY) return Math.floor(amount / 2) + fee;
  return 0;
}
