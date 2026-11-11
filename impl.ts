import { randomUUID } from 'node:crypto';
import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

function reject(status: number, error: string): RefundResponse {
  return { status, refundedCents: 0, error };
}

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id || request.merchantId !== payment.merchantId) {
    return reject(404, 'payment not found');
  }

  if (payment.status === 'pending') {
    return reject(409, 'payment is still pending');
  }
  if (payment.status !== 'succeeded') {
    return reject(409, 'payment did not succeed');
  }

  const remainingCents = Math.max(0, payment.amountCents - payment.refundedCents);

  if (request.amountCents !== undefined) {
    if (!Number.isSafeInteger(request.amountCents) || request.amountCents <= 0) {
      return reject(400, 'amount must be a positive whole number of cents');
    }
    if (request.amountCents > remainingCents) {
      return reject(400, 'amount is more than the refundable balance');
    }
  }

  if (remainingCents === 0) {
    return reject(409, 'payment is already fully refunded');
  }

  const refundCents = request.amountCents ?? remainingCents;
  return { status: 201, refundedCents: refundCents, refundId: `re_${randomUUID()}` };
}
