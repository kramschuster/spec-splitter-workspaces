// MF-1427 shared interface. Types only: every version implements the one function
// below, so the harness can compare outputs mechanically. Keep this free of rules;
// a rule written here would decide the ambiguity instead of exposing it.

export type Currency = 'USD';

export interface Order {
  id: string;
  customerId: string;
  // All amounts are in cents. Field names only; which of them a rule uses is the ticket's call.
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  currency: Currency;
  /** Order date, ISO 8601 calendar date (YYYY-MM-DD). */
  date: string;
}

export interface PastOrder extends Order {
  /** Loyalty discount applied to this past order, in cents. */
  loyaltyDiscountCents: number;
}

export interface CustomerHistory {
  customerId: string;
  /** The customer's earlier orders, oldest first. May include orders from previous months. */
  orders: PastOrder[];
}

/** Returns the loyalty discount for `order`, in cents, as a non-negative integer. */
export type LoyaltyDiscount = (order: Order, history: CustomerHistory) => number;
