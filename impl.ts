import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_THRESHOLD_CENTS = 50_000;

function normalizeCountry(code: string): string {
  return code.trim().toUpperCase();
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const reasons: string[] = [];
  let action: RiskDecision['action'] = 'allow';

  if (normalizeCountry(attempt.cardCountry) !== normalizeCountry(attempt.ipCountry)) {
    action = 'block';
    reasons.push('card country differs from IP country');
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_THRESHOLD_CENTS) {
    if (action === 'allow') action = 'review';
    reasons.push('new customer paying over $500');
  }

  return { action, reasons };
}
