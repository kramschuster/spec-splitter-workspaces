import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const captured = nonNegInt(order.capturedCents);
  const requested = nonNegInt(order.requestedCents);

  // Open (not yet settled): merchant amount, never more than half the capture.
  if (!order.settled) {
    return Math.min(requested, Math.floor(captured / 2));
  }

  // Settled: merchant amount, never more than the captured/settled total.
  // The processing fee was already taken at capture, so it is not deducted again.
  return Math.min(requested, captured);
}

function nonNegInt(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.trunc(value));
}
