import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = Math.max(0, Math.floor(order.capturedCents));
  const requested = Math.max(0, Math.floor(order.requestedCents));
  if (!Number.isFinite(captured) || !Number.isFinite(requested)) return 0;

  const refundable = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, refundable);
}
