import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const cap = order.settled
    ? order.capturedCents
    : Math.floor(order.capturedCents / 2);
  return Math.max(0, Math.min(order.requestedCents, cap));
}
