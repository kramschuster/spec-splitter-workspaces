import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const requested = Number.isFinite(order.requestedCents) ? Math.floor(order.requestedCents) : 0;
  const captured = Number.isFinite(order.capturedCents) ? Math.floor(order.capturedCents) : 0;
  const ceiling = order.settled ? captured : Math.floor(captured / 2);
  return Math.max(0, Math.min(requested, ceiling));
}
