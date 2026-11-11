import type { PaymentAttempt, RiskDecision } from './interface.ts';

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  void attempt;
  throw new Error('not implemented');
}
