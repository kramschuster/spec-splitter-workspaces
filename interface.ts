// MF-2103 shared interface. Types only. A rule written here would hide the ambiguity.

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface PriceRequest {
  id: string;
  /** The merchant's price, in US cents. */
  usdCents: number;
  /** The customer's currency. */
  currency: Currency;
  /** Today's rate: units of the customer's currency per 1 US dollar. */
  rate: number;
}

export interface LocalPrice {
  currency: Currency;
  /** In the currency's smallest unit: cents, pence, or whole yen. */
  amountMinor: number;
}

/** The price the customer sees and pays. */
export type LocalPriceFn = (request: PriceRequest) => LocalPrice;
