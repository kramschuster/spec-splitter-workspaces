// MF-2104 shared interface. Types only. A rule written here would hide the ambiguity.

export interface Txn {
  id: string;
  type: 'sale' | 'refund' | 'fee';
  /** Always positive, in cents. */
  amountCents: number;
  /** When it happened, ISO 8601 in UTC. */
  at: string;
  /** For a refund: when the original sale happened, ISO 8601 in UTC. */
  saleAt?: string;
}

export interface ReportRequest {
  /** The month to report, "YYYY-MM". */
  month: string;
  /** The merchant's time zone, e.g. "America/New_York". */
  timezone: string;
}

export interface MonthReport {
  grossCents: number;
  feesCents: number;
  refundsCents: number;
  netCents: number;
}

/** One month's report from the merchant's transactions. */
export type MonthlyReport = (request: ReportRequest, txns: Txn[]) => MonthReport;
