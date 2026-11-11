import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.merchantId !== payment.merchantId || request.paymentId !== payment.id) {
    return reject(404, 'payment not found');
  }

  if (payment.status !== 'succeeded' && payment.status !== 'pending') {
    return reject(409, payment.status === 'failed' ? 'payment failed' : 'payment is not refundable');
  }

  const paid = payment.amountCents;
  const already = payment.refundedCents;
  if (!Number.isSafeInteger(paid) || paid < 0 || !Number.isSafeInteger(already) || already < 0) {
    return reject(409, 'payment is not refundable');
  }

  const remaining = paid - already;
  const named = request.amountCents;
  if (named != null && (!Number.isSafeInteger(named) || named <= 0)) {
    return reject(400, 'invalid amount');
  }
  if (remaining <= 0) {
    return reject(409, already > 0 ? 'already refunded' : 'nothing to refund');
  }

  const amount = named == null ? remaining : named;
  if (amount > remaining) {
    return reject(400, 'refund exceeds payment');
  }

  return { status: 201, refundedCents: amount, refundId: `re_${request.id}` };
}
