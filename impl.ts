import type { Invoice } from './interface.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const TERMS_MS = 30 * DAY_MS;
const WEEK_MS = 7 * DAY_MS;

// Nearest integer to numerator/denominator. Halves round away from zero.
function roundHalfUp(numerator: number, denominator: number): number {
  const quotient = Math.trunc(numerator / denominator);
  const remainder = numerator % denominator;
  if (remainder * 2 >= denominator) return quotient + 1;
  return quotient;
}

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const issuedAtMs = Date.parse(invoice.issuedAt);
  if (Number.isNaN(issuedAtMs)) return 0;

  const unpaidCents = invoice.amountCents - invoice.paidCents;
  if (!Number.isFinite(unpaidCents) || unpaidCents <= 0) return 0;

  // Due exactly 30 days after issue. That instant is still on time.
  const overdueMs = Date.now() - issuedAtMs - TERMS_MS;
  if (overdueMs <= 0) return 0;

  // 2% of the unpaid balance. The first week overdue is charged at half that fee.
  const fullFee = roundHalfUp(unpaidCents * 2, 100);
  if (overdueMs < WEEK_MS) return roundHalfUp(fullFee, 2);
  return fullFee;
}
