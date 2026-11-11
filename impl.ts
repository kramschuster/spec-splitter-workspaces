import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_THRESHOLD_CENTS = 50000; // $500.00

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const cardCountry = attempt.cardCountry.trim().toUpperCase();
  const ipCountry = attempt.ipCountry.trim().toUpperCase();

  if (cardCountry !== ipCountry) {
    return {
      action: 'block',
      reasons: ['card country does not match payment country'],
    };
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_THRESHOLD_CENTS) {
    return {
      action: 'review',
      reasons: ['new customer payment over $500'],
    };
  }

  return { action: 'allow', reasons: [] };
}
