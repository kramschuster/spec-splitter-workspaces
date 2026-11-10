// MF-1427 shared interface. Types only. A rule written here would hide the ambiguity.

export interface Capture {
  id: string;
  merchantId: string;
  /** Amount that was captured, in cents. */
  capturedCents: number;
  /** Amount the merchant asked to send back, in cents. */
  requestedCents: number;
  /** Hours since the capture. */
  ageHours: number;
  /** Set when the processor has marked the charge settled. */
  settled: boolean;
}

export interface RefundHistory {
  merchantId: string;
  captures: Capture[];
}

/** Amount returned to the card for this refund, in cents, as a non-negative integer. */
export type Refund = (order: Capture, history: RefundHistory) => number;
