import type { Invoice } from './interface.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const PAYMENT_TERM_DAYS = 30;
const LATE_FEE_PERCENT = 2;

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const issuedMs = Date.parse(invoice.issuedAt);
  if (Number.isNaN(issuedMs)) {
    throw new Error(`Invalid issuedAt for invoice ${invoice.id}: ${invoice.issuedAt}`);
  }

  const dueMs = issuedMs + PAYMENT_TERM_DAYS * DAY_MS;
  if (Date.now() <= dueMs) return 0;

  const outstandingCents = invoice.amountCents - invoice.paidCents;
  if (outstandingCents <= 0) return 0;

  return Math.round((outstandingCents * LATE_FEE_PERCENT) / 100);
}
