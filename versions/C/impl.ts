import { randomUUID } from 'node:crypto';
import type { Payment, RefundRequest, RefundResponse } from './interface.ts';

export function createRefund(request: RefundRequest, payment: Payment): RefundResponse {
  if (request.paymentId !== payment.id || request.merchantId !== payment.merchantId) {
    return { status: 404, refundedCents: 0, error: 'payment not found' };
  }

  if (
    request.amountCents !== undefined
    && (!Number.isInteger(request.amountCents) || request.amountCents <= 0)
  ) {
    return {
      status: 400,
      refundedCents: 0,
      error: 'refund amount must be a positive whole number of cents',
    };
  }

  if (payment.status !== 'succeeded' && payment.status !== 'pending') {
    return { status: 409, refundedCents: 0, error: 'payment cannot be refunded' };
  }

  const refundableCents = payment.amountCents - payment.refundedCents;
  if (refundableCents <= 0) {
    return { status: 409, refundedCents: 0, error: 'payment is already fully refunded' };
  }

  const amountCents = request.amountCents ?? refundableCents;
  if (amountCents > refundableCents) {
    return {
      status: 400,
      refundedCents: 0,
      error: 'refund amount exceeds the refundable payment balance',
    };
  }

  return {
    status: 201,
    refundedCents: amountCents,
    refundId: randomUUID(),
  };
}
