import type { Capture, RefundHistory } from './interface.ts';

function toCents(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = toCents(order.capturedCents);
  const requested = toCents(order.requestedCents);
  const cap = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, cap);
}
