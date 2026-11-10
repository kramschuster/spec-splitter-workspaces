import type { Capture, RefundHistory } from './interface.ts';

// Amount returned to the card, in cents.
// Still open: the typed amount, capped at half the capture rounded down.
// Settled: the typed amount, capped at the capture. The fee taken at capture
// is not added back and is not deducted from what the card receives.
export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const captured = toCents(order.capturedCents);
  const requested = toCents(order.requestedCents);
  const cap = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, cap);
}

function toCents(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}
