import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_THRESHOLD_CENTS = 50_000;

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const countryMismatch =
    attempt.cardCountry.trim().toUpperCase() !== attempt.ipCountry.trim().toUpperCase();
  if (countryMismatch) {
    return { action: 'block', reasons: ['card country differs from IP country'] };
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_THRESHOLD_CENTS) {
    return { action: 'review', reasons: ['new customer payment over $500'] };
  }

  return { action: 'allow', reasons: ['no risk rules triggered'] };
}
