import type { Invoice } from './interface.ts';

const DUE_AFTER_MS = 30 * 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const LATE_FEE_BPS = 200; // 2%

function outstandingCents(invoice: Invoice): number {
  return invoice.amountCents - invoice.paidCents;
}

function roundPercent(cents: number, basisPoints: number): number {
  return Math.round((cents * basisPoints) / 10_000);
}

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const remaining = outstandingCents(invoice);
  if (remaining <= 0) return 0;

  const issuedAtMs = Date.parse(invoice.issuedAt);
  if (!Number.isFinite(issuedAtMs)) return 0;

  const overdueMs = Date.now() - (issuedAtMs + DUE_AFTER_MS);
  if (overdueMs <= 0) return 0;

  const fullFee = roundPercent(remaining, LATE_FEE_BPS);
  if (overdueMs < WEEK_MS) return Math.round(fullFee / 2);
  return fullFee;
}
