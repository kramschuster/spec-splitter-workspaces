import type { Capture, RefundHistory } from './interface.ts';

function cents(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = cents(order.capturedCents);
  const requested = cents(order.requestedCents);
  // Before settlement, operations releases at most half of the capture.
  const limit = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, limit);
}
