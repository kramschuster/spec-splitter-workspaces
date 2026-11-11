import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_THRESHOLD_CENTS = 50_000;

function normalizeCountry(country: string): string {
  return country.trim().toUpperCase();
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  if (normalizeCountry(attempt.cardCountry) !== normalizeCountry(attempt.ipCountry)) {
    return { action: 'block', reasons: ['card country does not match IP country'] };
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_THRESHOLD_CENTS) {
    return { action: 'review', reasons: ['new customer payment over $500'] };
  }

  return { action: 'allow', reasons: [] };
}
