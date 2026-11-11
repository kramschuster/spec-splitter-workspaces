import type { PaymentAttempt, RiskDecision } from './interface.ts';

/** $500, in cents. "Over $500" is strictly above this. */
const REVIEW_AMOUNT_CENTS = 50_000;

const COUNTRY_MISMATCH = 'card country does not match ip country';
const NEW_CUSTOMER_HIGH_AMOUNT = 'new customer payment over $500';

function countryCode(country: string): string {
  return country.trim().toUpperCase();
}

/** A new customer has no successful payment history. */
function isNewCustomer(priorPayments: number): boolean {
  return priorPayments <= 0;
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const reasons: string[] = [];
  const countryMismatch = countryCode(attempt.cardCountry) !== countryCode(attempt.ipCountry);
  const highAmountNewCustomer =
    isNewCustomer(attempt.priorPayments) && attempt.amountCents > REVIEW_AMOUNT_CENTS;

  if (countryMismatch) reasons.push(COUNTRY_MISMATCH);
  if (highAmountNewCustomer) reasons.push(NEW_CUSTOMER_HIGH_AMOUNT);

  if (countryMismatch) return { action: 'block', reasons };
  if (highAmountNewCustomer) return { action: 'review', reasons };
  return { action: 'allow', reasons };
}
