// MF-2102 shared interface. Types only. A rule written here would hide the ambiguity.

export interface PaymentAttempt {
  id: string;
  customerId: string;
  /** Amount, in cents. */
  amountCents: number;
  /** Two-letter country of the card, e.g. "US". */
  cardCountry: string;
  /** Two-letter country the customer is paying from (by IP address). */
  ipCountry: string;
  /** Successful payments this customer has made before. */
  priorPayments: number;
}

export interface RiskDecision {
  action: 'allow' | 'review' | 'block';
  /** Why, in a few words each. */
  reasons: string[];
}

/** Decide what happens to one payment. */
export type ScreenPayment = (attempt: PaymentAttempt) => RiskDecision;
