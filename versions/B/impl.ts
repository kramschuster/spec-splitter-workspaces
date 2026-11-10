import type { Capture, RefundHistory } from './interface.ts';

function nonNegInt(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const captured = nonNegInt(order.capturedCents);
  const requested = nonNegInt(order.requestedCents);

  // Open (not yet settled) charges follow ops practice: release at most half the capture.
  // Settled charges follow the written policy: send back what the merchant typed, up to the capture.
  // The processing fee was already taken at capture, so it is not deducted again.
  const limit = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, limit);
}
