import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  void request; void payment;
  throw new Error('not implemented');
}
