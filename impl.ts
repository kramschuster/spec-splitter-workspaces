import type { Capture, RefundHistory } from './interface.ts';

function wholeCents(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function refundCents(order: Capture, history: RefundHistory): number {
  void history;
  const captured = wholeCents(order.capturedCents);
  const requested = wholeCents(order.requestedCents);

  // The processing fee was kept at capture, so a settled refund returns what the merchant asked for, up to the capture.
  // An open charge follows the operations practice of releasing at most half of the capture.
  const ceiling = order.settled ? captured : Math.floor(captured / 2);
  return Math.min(requested, ceiling);
}
