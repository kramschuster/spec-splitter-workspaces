import type { MonthReport, ReportRequest, Txn } from './interface.ts';

export function monthlyReport(request: ReportRequest, txns: Txn[]): MonthReport {
  void request; void txns;
  throw new Error('not implemented');
}
