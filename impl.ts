import type { Invoice } from './interface.ts';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const DUE_AFTER_MS = 30 * DAY_MS;
const FULL_FEE_AFTER_MS = 7 * DAY_MS;
const FULL_RATE = 0.02;

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const issuedMs = Date.parse(invoice.issuedAt);
  if (Number.isNaN(issuedMs)) {
    throw new Error(`Invoice ${invoice.id} has an invalid issuedAt: ${invoice.issuedAt}`);
  }

  const unpaidCents = invoice.amountCents - invoice.paidCents;
  if (unpaidCents <= 0) return 0;

  const overdueMs = Date.now() - (issuedMs + DUE_AFTER_MS);
  if (overdueMs <= 0) return 0;

  const rate = overdueMs < FULL_FEE_AFTER_MS ? FULL_RATE / 2 : FULL_RATE;
  return Math.round(unpaidCents * rate);
}
