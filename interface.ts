// MF-2101 shared interface. Types only. A rule written here would hide the ambiguity.
// The merchant's system sends a RefundRequest; we answer with a RefundResponse.

export interface RefundRequest {
  id: string;
  merchantId: string;
  paymentId: string;
  /** Amount to refund, in cents. Missing when the merchant did not say how much. */
  amountCents?: number;
}

export interface Payment {
  id: string;
  merchantId: string;
  /** What the customer paid, in cents. */
  amountCents: number;
  /** Already refunded, in cents. */
  refundedCents: number;
  status: 'succeeded' | 'pending' | 'failed';
}

export interface RefundResponse {
  /** HTTP status the merchant's system receives, e.g. 201 when a refund is made. */
  status: number;
  /** Refunded by this request, in cents. 0 when nothing was refunded. */
  refundedCents: number;
  /** Short reason when nothing was refunded. */
  error?: string;
  /** New id for the refund, when one is made. */
  refundId?: string;
}

/** Answer one refund request for one payment. */
export type CreateRefund = (request: RefundRequest, payment: Payment) => RefundResponse;
