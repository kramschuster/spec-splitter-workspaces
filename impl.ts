import type { MonthReport, ReportRequest, Txn } from './interface.ts';

function monthInZone(iso: string, formatter: Intl.DateTimeFormat): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new Error(`invalid timestamp: ${iso}`);
  const parts = formatter.formatToParts(new Date(ms));
  const year = parts.find((p) => p.type === 'year')!.value;
  const month = parts.find((p) => p.type === 'month')!.value;
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timezone,
    year: 'numeric',
    month: '2-digit',
    calendar: 'iso8601',
    numberingSystem: 'latn',
  });

  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    if (monthInZone(txn.at, formatter) !== request.month) continue;
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
