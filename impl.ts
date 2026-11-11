import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_AMOUNT_CENTS = 50_000; // $500

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const reasons: string[] = [];
  let action: RiskDecision['action'] = 'allow';

  if (attempt.cardCountry !== attempt.ipCountry) {
    action = 'block';
    reasons.push('card country does not match payment country');
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_AMOUNT_CENTS) {
    if (action !== 'block') action = 'review';
    reasons.push('new customer payment over $500');
  }

  return { action, reasons };
}
