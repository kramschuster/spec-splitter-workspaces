import { randomUUID } from 'node:crypto';

import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id) {
    return { status: 404, refundedCents: 0, error: 'payment not found' };
  }

  if (request.merchantId !== payment.merchantId) {
    return { status: 403, refundedCents: 0, error: 'payment belongs to another merchant' };
  }

  if (payment.status === 'failed') {
    return { status: 409, refundedCents: 0, error: 'payment cannot be refunded' };
  }

  const remainingCents = payment.amountCents - payment.refundedCents;
  if (remainingCents <= 0) {
    return { status: 409, refundedCents: 0, error: 'payment is already fully refunded' };
  }

  const amountCents = request.amountCents ?? remainingCents;
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return { status: 400, refundedCents: 0, error: 'refund amount must be positive whole cents' };
  }

  if (amountCents > remainingCents) {
    return { status: 409, refundedCents: 0, error: 'refund amount exceeds payment balance' };
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: randomUUID(),
  };
}
