import type { Decline, RetryHistory } from './interface.ts';

export function retryCents(order: Decline, history: RetryHistory): number {
  void order; void history;
  throw new Error('not implemented');
}
