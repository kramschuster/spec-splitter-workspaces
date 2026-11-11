import type { MonthReport, ReportRequest, Txn } from './interface.ts';

/** Calendar year-month (YYYY-MM) of an instant in the merchant's time zone. */
function calendarMonth(iso: string, timezone: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    calendar: 'gregory',
  }).formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  if (!year || !month) return null;
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // Refunds (and every other type) belong to the month they occurred, not the
    // original sale month. `saleAt` is ignored on purpose.
    if (calendarMonth(txn.at, request.timezone) !== request.month) continue;

    const amount = txn.amountCents;
    if (typeof amount !== 'number' || !Number.isFinite(amount)) continue;

    if (txn.type === 'sale') grossCents += amount;
    else if (txn.type === 'fee') feesCents += amount;
    else if (txn.type === 'refund') refundsCents += amount;
  }

  return {
    grossCents,
    feesCents,
    refundsCents,
    netCents: grossCents - feesCents - refundsCents,
  };
}
