import type { Capture, RefundHistory } from './interface.ts';

// Settled charges refund the amount the merchant typed, capped at what was captured.
// The processing fee was already taken at capture, so it is not added or subtracted here.
// An open charge refunds that same typed amount, capped at half the capture (rounded down).
export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);
  const cap = order.settled === true ? captured : Math.floor(captured / 2);
  return Math.min(requested, cap);
}

function wholeCents(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}
