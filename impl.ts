import type { MonthReport, ReportRequest, Txn } from './interface.ts';

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  const [requestedYear, requestedMonth] = request.month.split('-');
  const monthInMerchantTimezone = new Intl.DateTimeFormat('en-US', {
    timeZone: request.timezone,
    year: 'numeric',
    month: '2-digit',
  });

  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    const parts = monthInMerchantTimezone.formatToParts(new Date(txn.at));
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;

    if (year !== requestedYear || month !== requestedMonth) {
      continue;
    }

    if (txn.type === 'sale') {
      grossCents += txn.amountCents;
    } else if (txn.type === 'fee') {
      feesCents += txn.amountCents;
    } else {
      refundsCents += txn.amountCents;
    }
  }

  return {
    grossCents,
    feesCents,
    refundsCents,
    netCents: grossCents - feesCents - refundsCents,
  };
}
