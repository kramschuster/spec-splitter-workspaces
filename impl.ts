import type { Capture, RefundHistory } from './interface.ts';

function wholeCents(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount);
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);
  const ceiling = order.settled === true ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}
