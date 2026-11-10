import type { Invoice } from './interface.ts';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NET_TERMS_MS = 30 * MS_PER_DAY;
const HALF_FEE_WINDOW_MS = 7 * MS_PER_DAY;

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  const unpaidCents = invoice.amountCents - invoice.paidCents;
  if (!Number.isFinite(unpaidCents) || unpaidCents <= 0) return 0;

  const issuedAtMs = Date.parse(invoice.issuedAt);
  if (!Number.isFinite(issuedAtMs)) return 0;

  const overdueMs = Date.now() - (issuedAtMs + NET_TERMS_MS);
  if (overdueMs <= 0) return 0;

  const ratePercent = overdueMs < HALF_FEE_WINDOW_MS ? 1 : 2;
  return Math.round((unpaidCents * ratePercent) / 100);
}
