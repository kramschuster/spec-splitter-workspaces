import type { Capture, RefundHistory } from './interface.ts';

export function refundCents(order: Capture, history: RefundHistory): number {
  void order; void history;
  throw new Error('not implemented');
}
