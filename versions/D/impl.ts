import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function rejected(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  // Answer a payment of another merchant the same as a missing one, so its existence is not revealed.
  if (payment.id !== request.paymentId || payment.merchantId !== request.merchantId) {
    return rejected(404, 'payment_not_found');
  }

  if (payment.status === 'failed') {
    return rejected(409, 'payment_failed');
  }

  const refundable = Math.max(0, payment.amountCents - payment.refundedCents);

  if (request.amountCents !== undefined) {
    if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
      return rejected(400, 'invalid_amount');
    }
  }

  if (refundable === 0) {
    return rejected(409, 'already_refunded');
  }

  const amount = request.amountCents ?? refundable;
  if (amount > refundable) {
    return rejected(422, 'amount_exceeds_refundable');
  }

  return {
    status: 201,
    refundedCents: amount,
    // Derived from the request id so a retried request gets the same refund id.
    refundId: `re_${request.id}`,
  };
}
