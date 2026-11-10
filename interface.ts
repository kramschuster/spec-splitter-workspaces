// MF-1608 shared interface. Types only. A rule written here would hide the ambiguity.

export type DeclineKind = 'soft' | 'hard';

export interface Decline {
  id: string;
  customerId: string;
  /** Invoice amount, in cents. */
  amountCents: number;
  /** Processing fee already quoted for this invoice, in cents. */
  feeCents: number;
  decline: DeclineKind;
  /** 1 on the first try. */
  attempt: number;
}

export interface RetryHistory {
  customerId: string;
  attempts: Decline[];
}

/** Amount to submit on this attempt, in cents. Zero means do not retry. */
export type Retry = (order: Decline, history: RetryHistory) => number;
