// MF-1880 shared interface. Types only. A rule written here would hide the ambiguity.

export type ChargeKind = 'sale' | 'refund';

export interface MarketplaceCharge {
  id: string;
  sellerId: string;
  /** Merchandise, in cents. */
  goodsCents: number;
  /** Shipping the buyer paid, in cents. */
  shippingCents: number;
  kind: ChargeKind;
  /** Set once the sale has settled. */
  settled: boolean;
}

export interface SplitHistory {
  sellerId: string;
  charges: MarketplaceCharge[];
}

/** Platform fee for this charge, in cents. Zero means no fee is taken or returned. */
export type PlatformFee = (order: MarketplaceCharge, history: SplitHistory) => number;
