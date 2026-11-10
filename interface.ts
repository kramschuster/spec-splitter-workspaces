// MF-1514 shared interface. Types only. A rule written here would hide the ambiguity.

export interface MerchantBalance {
  id: string;
  merchantId: string;
  /** Cleared funds, in cents. */
  availableCents: number;
  /** Captures that have not cleared, in cents. */
  pendingCents: number;
  /** Days since the merchant went live. */
  ageDays: number;
  /** Set when risk has cleared the reserve. */
  riskCleared: boolean;
}

export interface PayoutHistory {
  merchantId: string;
  payouts: MerchantBalance[];
}

/** Amount paid to the merchant, in cents, as a non-negative integer. */
export type Payout = (order: MerchantBalance, history: PayoutHistory) => number;
