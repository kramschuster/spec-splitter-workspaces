import type { Capture, RefundHistory } from './interface.ts';

function wholeCents(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);
  const ceiling = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}
