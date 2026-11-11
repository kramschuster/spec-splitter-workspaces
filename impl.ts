import type { PaymentAttempt, RiskDecision } from './interface.ts';

export function screenPayment(attempt: PaymentAttempt): RiskDecision {
  if (attempt.cardCountry !== attempt.ipCountry) {
    return {
      action: 'block',
      reasons: ['card country does not match payment country'],
    };
  }

  if (attempt.priorPayments === 0 && attempt.amountCents > 50_000) {
    return {
      action: 'review',
      reasons: ['payment over $500 from a new customer'],
    };
  }

  return {
    action: 'allow',
    reasons: [],
  };
}
