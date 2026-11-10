import type { Capture, RefundHistory } from './interface.ts';

// Card credit for one refund request, in cents.
// A settled capture follows the written policy: the merchant's typed amount,
// capped at the capture. The processing fee was already taken at capture and
// is not part of this credit.
// A charge the processor has not settled is still open. Operations releases
// at most half of that capture, and never more than the merchant typed.
export function refundCents(order: Capture, history: RefundHistory): number {
  void history;

  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);
  const ceiling = order.settled === true ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}

function wholeCents(amount: number): number {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}
