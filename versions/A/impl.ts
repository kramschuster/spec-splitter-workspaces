import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);
  // Open captures release at most half. Settled captures use the written refund.
  const releasable = order.settled === true ? captured : Math.floor(captured / 2);
  return Math.min(requested, releasable);
}

function wholeCents(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}
