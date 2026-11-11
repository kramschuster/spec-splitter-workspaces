import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id) {
    return reject(404, 'payment not found');
  }
  if (request.merchantId !== payment.merchantId) {
    return reject(403, 'payment does not belong to merchant');
  }
  if (payment.status === 'failed') {
    return reject(422, 'failed payment cannot be refunded');
  }
  // Dashboard support has refunded pending payments; this merchant API is for captured charges (returns).
  if (payment.status === 'pending') {
    return reject(422, 'pending payment cannot be refunded');
  }

  const alreadyRefunded = Number.isFinite(payment.refundedCents) ? Math.max(0, payment.refundedCents) : 0;
  const remainingCents = payment.amountCents - alreadyRefunded;
  if (remainingCents <= 0) {
    return reject(409, 'payment already fully refunded');
  }

  let amountCents: number;
  if (request.amountCents === undefined) {
    // No amount means refund whatever is still left on the payment.
    amountCents = remainingCents;
  } else if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
    return reject(400, 'invalid refund amount');
  } else {
    amountCents = request.amountCents;
  }

  if (amountCents > remainingCents) {
    return reject(400, 'refund exceeds payment');
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: `re_${request.id}`,
  };
}
