import type { Invoice } from './interface.ts';

const DAY_MS = 24 * 60 * 60 * 1000;
const PAYMENT_TERM_MS = 30 * DAY_MS;
const FULL_FEE_AFTER_MS = 7 * DAY_MS;

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const unpaidCents = Math.max(0, invoice.amountCents - invoice.paidCents);
  if (unpaidCents === 0) return 0;

  const dueAt = Date.parse(invoice.issuedAt) + PAYMENT_TERM_MS;
  const overdueMs = Date.now() - dueAt;
  if (!(overdueMs > 0)) return 0;

  const percent = overdueMs < FULL_FEE_AFTER_MS ? 1 : 2;
  return Math.floor((unpaidCents * percent + 50) / 100);
}
