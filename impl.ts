import type { MonthReport, ReportRequest, Txn } from './interface.ts';

function monthInZone(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date(iso));
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // Refunds are counted by issue date (`at`), not by the original sale date.
    if (monthInZone(txn.at, request.timezone) !== request.month) continue;
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
