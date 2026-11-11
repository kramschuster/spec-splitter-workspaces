import type { MonthReport, ReportRequest, Txn } from './interface.ts';

function monthFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
  });
}

function calendarMonth(at: string, formatter: Intl.DateTimeFormat): string | null {
  const instant = new Date(at);
  if (Number.isNaN(instant.getTime())) return null;
  const parts = formatter.formatToParts(instant);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  if (!year || !month) return null;
  return `${year}-${month.padStart(2, '0')}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  const formatter = monthFormatter(request.timezone);
  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // Refunds (and every other type) use the event time `at`, not saleAt.
    if (calendarMonth(txn.at, formatter) !== request.month) continue;
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
