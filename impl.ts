import type { PaymentAttempt, RiskDecision } from './interface.ts';

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  if (attempt.cardCountry !== attempt.ipCountry) {
    return {
      action: 'block',
      reasons: ['card and payment countries differ'],
    };
  }

  if (attempt.priorPayments === 0 && attempt.amountCents > 50_000) {
    return {
      action: 'review',
      reasons: ['new customer payment over $500'],
    };
  }

  return {
    action: 'allow',
    reasons: [],
  };
}
