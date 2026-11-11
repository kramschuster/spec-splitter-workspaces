import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id) {
    return fail(404, 'payment not found');
  }
  if (request.merchantId !== payment.merchantId) {
    return fail(403, 'merchant does not own this payment');
  }
  if (payment.status === 'failed') {
    return fail(409, 'cannot refund a failed payment');
  }

  const remainingCents = Math.max(0, payment.amountCents - payment.refundedCents);
  if (remainingCents <= 0) {
    return fail(409, 'payment already fully refunded');
  }

  let amountCents: number;
  if (request.amountCents === undefined) {
    amountCents = remainingCents;
  } else if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
    return fail(400, 'invalid amount');
  } else if (request.amountCents > remainingCents) {
    return fail(400, 'amount exceeds refundable balance');
  } else {
    amountCents = request.amountCents;
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: `rfnd_${request.id}`,
  };
}

function fail(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}
