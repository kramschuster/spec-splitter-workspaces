import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function rejected(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.merchantId !== payment.merchantId || request.paymentId !== payment.id) {
    return rejected(404, 'payment not found');
  }

  if (payment.status === 'failed') {
    return rejected(409, 'payment failed, nothing to refund');
  }

  const refundable = payment.amountCents - payment.refundedCents;
  if (refundable <= 0) {
    return rejected(409, 'payment already fully refunded');
  }

  let amount: number;
  if (request.amountCents === undefined) {
    amount = refundable;
  } else {
    amount = request.amountCents;
    if (!Number.isInteger(amount) || amount <= 0) {
      return rejected(400, 'amount must be a positive whole number of cents');
    }
    if (amount > refundable) {
      return rejected(422, 'amount exceeds the refundable balance of the payment');
    }
  }

  return { status: 201, refundedCents: amount, refundId: `re_${request.id}` };
}
