import type { PaymentAttempt, RiskDecision } from './interface.ts';

/** $500 expressed in cents. "Over $500" means strictly above this. */
const REVIEW_OVER_CENTS = 50_000;

function countryCode(code: string): string {
  return code.trim().toUpperCase();
}

/** A new customer has no successful payments yet. */
function isNewCustomer(priorPayments: number): boolean {
  return priorPayments <= 0;
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const reasons: string[] = [];
  const countryMismatch = countryCode(attempt.cardCountry) !== countryCode(attempt.ipCountry);
  const highAmountNewCustomer =
    isNewCustomer(attempt.priorPayments) && attempt.amountCents > REVIEW_OVER_CENTS;

  if (countryMismatch) reasons.push('card country differs from payment country');
  if (highAmountNewCustomer) reasons.push('new customer payment over $500');

  if (countryMismatch) return { action: 'block', reasons };
  if (highAmountNewCustomer) return { action: 'review', reasons };
  return { action: 'allow', reasons };
}
