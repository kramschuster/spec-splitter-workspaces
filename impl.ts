import type { MonthReport, ReportRequest, Txn } from './interface.ts';

/**
 * One calendar month of sales, fees, and refunds for a merchant close.
 * Refunds are recognized when issued (`at`), not in the month of the original sale.
 */
export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(request.month)) {
    throw new Error(`month must be YYYY-MM, received ${JSON.stringify(request.month)}`);
  }

  // Constructing the formatter also rejects an unknown IANA timezone.
  const monthOf = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timezone,
    calendar: 'gregory',
    year: 'numeric',
    month: '2-digit',
  });

  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    const atMs = parseUtcInstant(txn.at);
    if (!Number.isFinite(atMs)) continue;
    if (calendarMonth(monthOf, atMs) !== request.month) continue;

    if (txn.type === 'sale') grossCents += txn.amountCents;
    else if (txn.type === 'fee') feesCents += txn.amountCents;
    else if (txn.type === 'refund') refundsCents += txn.amountCents;
  }

  return {
    grossCents,
    feesCents,
    refundsCents,
    netCents: grossCents - feesCents - refundsCents,
  };
}

/** Calendar month of an absolute instant in the merchant's timezone, "YYYY-MM". */
function calendarMonth(fmt: Intl.DateTimeFormat, utcMs: number): string {
  let year = '';
  let month = '';
  for (const part of fmt.formatToParts(new Date(utcMs))) {
    if (part.type === 'year') year = part.value;
    else if (part.type === 'month') month = part.value;
  }
  return `${year.padStart(4, '0')}-${month.padStart(2, '0')}`;
}

/**
 * `at` / `saleAt` are ISO-8601 instants in UTC. A date-time with no zone is UTC;
 * Date.parse would otherwise read it in the host's local zone.
 */
function parseUtcInstant(iso: string): number {
  const s = iso.trim();
  if (s.length === 0) return Number.NaN;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(s);
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(s);
  return Date.parse(dateOnly || hasZone ? s : `${s}Z`);
}
