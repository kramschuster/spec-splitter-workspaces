import type { MonthReport, ReportRequest, Txn } from './interface.ts';

const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;

/**
 * `at` is an ISO instant in UTC. A clock time with no zone is still UTC;
 * date-only forms are already UTC per the language spec.
 */
function parseUtc(iso: string): Date {
  const hasTime = /T\d{2}:\d{2}/.test(iso);
  const hasZone = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(iso);
  const date = new Date(hasTime && !hasZone ? `${iso}Z` : iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`invalid timestamp: ${iso}`);
  }
  return date;
}

function localMonth(iso: string, formatter: Intl.DateTimeFormat): string {
  const parts = formatter.formatToParts(parseUtc(iso));
  let year = '';
  let month = '';
  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    else if (part.type === 'month') month = part.value;
  }
  if (year.length === 0 || month.length === 0) {
    throw new Error(`could not resolve calendar month for ${iso}`);
  }
  return `${year}-${month.padStart(2, '0')}`;
}

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  if (!MONTH.test(request.month)) {
    throw new Error(`month must be YYYY-MM, got ${String(request.month)}`);
  }

  const formatter = new Intl.DateTimeFormat('en-US-u-ca-gregory', {
    timeZone: request.timezone,
    year: 'numeric',
    month: '2-digit',
  });

  let grossCents = 0;
  let feesCents = 0;
  let refundsCents = 0;

  for (const txn of txns) {
    if (localMonth(txn.at, formatter) !== request.month) continue;
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
