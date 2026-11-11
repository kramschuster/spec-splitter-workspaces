import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function invalidRequest(): RefundResponse {
  return { status: 400, refundedCents: 0, error: 'invalid-request' };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id || request.merchantId !== payment.merchantId) {
    return { status: 404, refundedCents: 0, error: 'not-found' };
  }

  if (payment.status === 'failed') {
    return { status: 409, refundedCents: 0, error: 'not-refundable' };
  }

  const remainingCents = payment.amountCents - payment.refundedCents;
  const amountCents = request.amountCents === undefined ? remainingCents : request.amountCents;

  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > remainingCents) {
    return invalidRequest();
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: request.id,
  };
}
