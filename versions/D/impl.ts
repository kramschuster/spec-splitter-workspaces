import type { Capture, RefundHistory } from './interface.ts';

function cents(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = cents(order.capturedCents);
  const requested = cents(order.requestedCents);
  const ceiling = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}
