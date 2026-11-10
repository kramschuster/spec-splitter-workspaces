import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const capturedCents = Number.isFinite(order.capturedCents)
    ? Math.max(0, Math.trunc(order.capturedCents))
    : 0;

  if (!order.settled) {
    return Math.floor(capturedCents / 2);
  }

  const requestedCents = Number.isFinite(order.requestedCents)
    ? Math.max(0, Math.trunc(order.requestedCents))
    : 0;

  return Math.min(requestedCents, capturedCents);
}
