import type { Capture, RefundHistory } from './interface.ts';

/** Non-negative whole cents. Missing or unusable amounts contribute nothing. */
function cents(amount: number): number {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = cents(order.capturedCents);
  const requested = cents(order.requestedCents);
  // Open: operations will not release more than half the capture.
  // Settled: the card gets the typed amount, up to what settled.
  // The processing fee was already taken at capture and is not deducted here.
  const ceiling = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}
