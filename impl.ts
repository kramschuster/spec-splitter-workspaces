import type { Invoice } from './interface.ts';

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const millisecondsPerDay = 24 * 60 * 60 * 1_000;
  const now = Date.now();
  const issuedAt = Date.parse(invoice.issuedAt);
  const dueAt = issuedAt + 30 * millisecondsPerDay;

  if (!Number.isFinite(issuedAt) || now <= dueAt) {
    return 0;
  }

  const unpaidCents = Math.max(0, invoice.amountCents - invoice.paidCents);
  const daysOverdue = (now - dueAt) / millisecondsPerDay;
  const feeRate = daysOverdue < 7 ? 0.01 : 0.02;

  return Math.round(unpaidCents * feeRate);
}
