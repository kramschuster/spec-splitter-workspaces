import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function decline(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (payment.id !== request.paymentId || payment.merchantId !== request.merchantId) {
    return decline(404, 'payment not found');
  }

  if (payment.status !== 'succeeded' && payment.status !== 'pending') {
    return decline(409, 'failed payments cannot be refunded');
  }

  if (!Number.isInteger(payment.amountCents) || !Number.isInteger(payment.refundedCents)) {
    return decline(400, 'payment amount must be a whole number of cents');
  }

  const remaining = payment.amountCents - payment.refundedCents;
  if (remaining <= 0) {
    return decline(409, 'payment is already fully refunded');
  }

  const requested = request.amountCents;
  if (requested !== undefined && (!Number.isInteger(requested) || requested <= 0)) {
    return decline(400, 'refund amount must be a positive number of cents');
  }

  const amount = requested === undefined ? remaining : requested;
  if (amount > remaining) {
    return decline(400, 'refund cannot be more than the payment');
  }

  return {
    status: 201,
    refundedCents: amount,
    refundId: request.id,
  };
}
