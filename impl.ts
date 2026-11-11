import type { MonthReport, ReportRequest, Txn } from './interface.ts';

// Calendar YYYY-MM of an absolute instant in an IANA timezone.
function localYearMonth(atMs: number, format: Intl.DateTimeFormat): string {
  const parts = format.formatToParts(new Date(atMs));
  let year = '';
  let month = '';
  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    else if (part.type === 'month') month = part.value;
  }
  return `${year}-${month}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  // Constructing the formatter rejects an unknown timezone up front, including
  // when there are no transactions, so a bad zone cannot close as an empty month.
  const format = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timezone,
    year: 'numeric',
    month: '2-digit',
  });

  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    // `at` is when the money moved. Refunds use that issue instant, not saleAt.
    if (localYearMonth(Date.parse(txn.at), format) !== request.month) continue;
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
