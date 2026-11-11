import type { MonthReport, ReportRequest, Txn } from './interface.ts';

function yearMonthInTimezone(isoUtc: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date(isoUtc));
  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  const month = (parts.find((p) => p.type === 'month')?.value ?? '').padStart(2, '0');
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // Calendar month is the merchant's, not UTC. Refunds use `at` (issued), never `saleAt`.
    if (yearMonthInTimezone(txn.at, request.timezone) !== request.month) continue;
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
