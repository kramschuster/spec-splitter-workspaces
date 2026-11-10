import type { Capture, RefundHistory } from './interface.ts';

function cents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

/** Same-day means under 24 hours; we only have age in hours. */
function isSameDay(order: Capture): boolean {
  return cents(order.ageHours) < 24;
}

/**
 * Open / same-day requests follow ops practice (half the capture).
 * Settled, next-day+ requests follow the written refund policy.
 */
function followsOpenRelease(order: Capture): boolean {
  return !order.settled || isSameDay(order);
}

function proposedRefund(order: Capture): number {
  const captured = cents(order.capturedCents);
  if (followsOpenRelease(order)) return Math.floor(captured / 2);
  return Math.min(cents(order.requestedCents), captured);
}

function alreadyReturned(order: Capture, history: RefundHistory): number {
  const captures = history?.captures ?? [];
  if (history?.merchantId !== order.merchantId) return 0;
  let sum = 0;
  for (const prior of captures) {
    if (prior === order) continue;
    if (prior.id !== order.id) continue;
    sum += proposedRefund(prior);
  }
  return sum;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  const captured = cents(order.capturedCents);
  const remaining = Math.max(0, captured - alreadyReturned(order, history));
  return Math.min(proposedRefund(order), remaining);
}
