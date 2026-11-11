import type { PaymentAttempt, RiskDecision } from './interface.ts';

/** $500 in cents. "Over $500" is strictly above this. */
const REVIEW_ABOVE_CENTS = 50_000;

function sameCountry(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const reasons: string[] = [];
  const countryMismatch = !sameCountry(attempt.cardCountry, attempt.ipCountry);
  const largeNewCustomer =
    attempt.priorPayments === 0 && attempt.amountCents > REVIEW_ABOVE_CENTS;

  if (countryMismatch) {
    reasons.push('card country does not match payment country');
  }
  if (largeNewCustomer) {
    reasons.push('payment over $500 from a new customer');
  }

  if (countryMismatch) return { action: 'block', reasons };
  if (largeNewCustomer) return { action: 'review', reasons };
  return { action: 'allow', reasons };
}
