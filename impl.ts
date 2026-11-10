import type { Invoice } from './interface.ts';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
// Due 30 days after issue, as an exact elapsed duration from the issued instant.
const DUE_AFTER_MS = 30 * DAY_MS;
// Full 2% starts at 7 × 24 hours past due. Before that the fee is half, 1%.
const FULL_RATE_AFTER_MS = 7 * DAY_MS;

/** issuedAt is ISO 8601 in UTC. A missing offset is UTC, not the host zone. */
function issuedInstantMs(issuedAt: string): number {
  const trimmed = issuedAt.trim();
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  return Date.parse(hasZone ? trimmed : `${trimmed}Z`);
}

/** `percent` percent of whole cents, rounded half up (away from zero). */
function percentOfCents(cents: number, percent: number): number {
  const scaled = BigInt(cents) * BigInt(percent);
  return Number((scaled + 50n) / 100n);
}

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  if (typeof invoice?.issuedAt !== 'string') {
    throw new Error('invalid issuedAt');
  }
  const issuedMs = issuedInstantMs(invoice.issuedAt);
  if (Number.isNaN(issuedMs)) {
    throw new Error(`invalid issuedAt: ${invoice.issuedAt}`);
  }
  if (
    !Number.isInteger(invoice.amountCents) ||
    !Number.isInteger(invoice.paidCents) ||
    invoice.amountCents < 0 ||
    invoice.paidCents < 0
  ) {
    throw new Error('amountCents and paidCents must be non-negative whole cents');
  }

  const overdueMs = Date.now() - (issuedMs + DUE_AFTER_MS);
  if (overdueMs <= 0) return 0;

  const unpaidCents = invoice.amountCents - invoice.paidCents;
  if (unpaidCents <= 0) return 0;

  const percent = overdueMs < FULL_RATE_AFTER_MS ? 1 : 2;
  return percentOfCents(unpaidCents, percent);
}
