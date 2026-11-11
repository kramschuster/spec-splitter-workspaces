import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.merchantId !== payment.merchantId || request.paymentId !== payment.id) {
    return reject(404, 'payment not found');
  }
  if (payment.status === 'failed') {
    return reject(422, 'payment failed and cannot be refunded');
  }

  const refundable = payment.amountCents - payment.refundedCents;
  const amount = request.amountCents ?? refundable;

  if (!Number.isInteger(amount) || amount <= 0) {
    return reject(request.amountCents === undefined ? 422 : 400,
      request.amountCents === undefined ? 'payment is already fully refunded' : 'amount must be a positive whole number of cents');
  }
  if (amount > refundable) {
    return reject(422, 'refund exceeds the refundable amount of the payment');
  }

  return { status: 201, refundedCents: amount, refundId: `re_${request.id}` };
}
