import type { Invoice } from './interface.ts';

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const dayMilliseconds = 24 * 60 * 60 * 1_000;
  const dueAt = Date.parse(invoice.issuedAt) + 30 * dayMilliseconds;
  const overdueMilliseconds = Date.now() - dueAt;

  if (overdueMilliseconds <= 0) {
    return 0;
  }

  const unpaidCents = Math.max(0, invoice.amountCents - invoice.paidCents);
  const feeRate = overdueMilliseconds < 7 * dayMilliseconds ? 0.01 : 0.02;

  return Math.round(unpaidCents * feeRate);
}
