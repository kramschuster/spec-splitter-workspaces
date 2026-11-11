import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id || request.merchantId !== payment.merchantId) {
    return {
      status: 404,
      refundedCents: 0,
      error: 'payment_not_found',
    };
  }

  if (payment.status === 'failed') {
    return {
      status: 400,
      refundedCents: 0,
      error: 'payment_not_refundable',
    };
  }

  const remainingCents = payment.amountCents - payment.refundedCents;
  const amountCents = request.amountCents ?? remainingCents;

  if (
    !Number.isInteger(amountCents)
    || amountCents <= 0
    || amountCents > remainingCents
  ) {
    return {
      status: 400,
      refundedCents: 0,
      error: 'invalid_refund_amount',
    };
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: request.id,
  };
}
