import type { MonthReport, ReportRequest, Txn } from './interface.ts';

/** UTC instant. A datetime with no zone is UTC, matching the transaction contract. */
function instant(iso: string): Date {
  const value = iso.trim();
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value);
  }
  return new Date(`${value}Z`);
}

/** Calendar month (`YYYY-MM`) of an instant in the merchant's timezone. */
function calendarMonth(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(instant(iso));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  if (!year || !month) throw new Error(`invalid timestamp: ${iso}`);
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // Issued month (`at`). A refund's original sale month (`saleAt`) does not place it.
    if (calendarMonth(txn.at, request.timezone) !== request.month) continue;
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
