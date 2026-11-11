import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.merchantId !== payment.merchantId || request.paymentId !== payment.id) {
    return reject(404, 'payment not found');
  }

  if (payment.status === 'failed') {
    return reject(422, 'failed payments cannot be refunded');
  }

  const remainingCents = payment.amountCents - payment.refundedCents;
  const amountCents = request.amountCents ?? remainingCents;

  if (!Number.isInteger(amountCents) || amountCents <= 0 || amountCents > remainingCents) {
    return reject(400, 'invalid refund amount');
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: `re_${request.id}`,
  };
}
