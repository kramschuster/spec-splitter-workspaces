import { randomUUID } from 'node:crypto';
import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  // A payment that is not this merchant's is reported as not found, so its existence is not revealed.
  if (payment.id !== request.paymentId || payment.merchantId !== request.merchantId) {
    return reject(404, 'payment_not_found');
  }
  if (payment.status === 'failed') {
    return reject(409, 'payment_not_refundable');
  }

  const remaining = payment.amountCents - payment.refundedCents;
  if (request.amountCents === undefined && remaining <= 0) {
    return reject(409, 'payment_already_fully_refunded');
  }

  const amount = request.amountCents ?? remaining;
  if (!Number.isInteger(amount) || amount <= 0 || amount > remaining) {
    return reject(400, 'invalid_amount');
  }

  return { status: 201, refundedCents: amount, refundId: `re_${randomUUID()}` };
}
