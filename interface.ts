// MF-2002 shared interface. Types only. A rule written here would hide the ambiguity.

export interface Invoice {
  id: string;
  customerId: string;
  /** When the invoice was issued, ISO 8601 in UTC. */
  issuedAt: string;
  /** Invoice amount, in cents. */
  amountCents: number;
  /** Paid so far, in cents. */
  paidCents: number;
}

/** Late fee to charge tonight, in cents. The current time is the system clock. */
export type LateFee = (invoice: Invoice) => Promise<number>;
