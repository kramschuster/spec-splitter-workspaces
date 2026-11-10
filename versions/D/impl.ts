import type { Invoice } from './interface.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const DUE_AFTER_DAYS = 30;
const GRACE_DAYS = 7;
const FEE_RATE = 0.02;

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const issuedMs = Date.parse(invoice.issuedAt);
  if (Number.isNaN(issuedMs)) {
    throw new Error(`Invoice ${invoice.id} has an invalid issuedAt: ${invoice.issuedAt}`);
  }

  const outstandingCents = invoice.amountCents - invoice.paidCents;
  if (outstandingCents <= 0) return 0;

  const dueMs = issuedMs + DUE_AFTER_DAYS * DAY_MS;
  const overdueMs = Date.now() - dueMs;
  if (overdueMs <= 0) return 0;

  const fullFee = outstandingCents * FEE_RATE;
  const fee = overdueMs < GRACE_DAYS * DAY_MS ? fullFee / 2 : fullFee;
  return Math.round(fee);
}
