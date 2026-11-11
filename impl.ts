import type { PaymentAttempt, RiskDecision } from './interface.ts';

const REVIEW_THRESHOLD_CENTS = 50_000;

function normalizeCountry(country: string): string {
  return country.trim().toUpperCase();
}

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  const blockReasons: string[] = [];
  const reviewReasons: string[] = [];

  if (normalizeCountry(attempt.cardCountry) !== normalizeCountry(attempt.ipCountry)) {
    blockReasons.push('card country differs from IP country');
  }

  const isNewCustomer = attempt.priorPayments === 0;
  if (isNewCustomer && attempt.amountCents > REVIEW_THRESHOLD_CENTS) {
    reviewReasons.push('new customer paying over $500');
  }

  if (blockReasons.length > 0) {
    return { action: 'block', reasons: [...blockReasons, ...reviewReasons] };
  }
  if (reviewReasons.length > 0) {
    return { action: 'review', reasons: reviewReasons };
  }
  return { action: 'allow', reasons: [] };
}
