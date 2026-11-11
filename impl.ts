import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function noRefund(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id || request.merchantId !== payment.merchantId) {
    return noRefund(404, 'not-found');
  }

  // Failed payments are not refundable. Pending is, same as succeeded.
  if (payment.status !== 'succeeded' && payment.status !== 'pending') {
    return noRefund(422, 'payment-failed');
  }

  // Never refund more than the customer paid, or more than what is still unrefunded.
  const remaining = payment.amountCents - payment.refundedCents;
  const refundable = Math.min(payment.amountCents, remaining);
  const amount = request.amountCents === undefined ? refundable : request.amountCents;

  if (!Number.isInteger(amount) || amount <= 0 || amount > refundable) {
    return noRefund(400, 'invalid-request');
  }

  return { status: 201, refundedCents: amount, refundId: request.id };
}
