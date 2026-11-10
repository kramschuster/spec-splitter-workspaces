// MF-1844 shared interface. Types only. A rule written here would hide the ambiguity.

export type CardKind = 'credit' | 'debit' | 'prepaid';

export interface CardSale {
  id: string;
  merchantId: string;
  /** Merchandise total, in cents. */
  goodsCents: number;
  /** 3% of the goods, in cents, already computed. */
  surchargeCents: number;
  card: CardKind;
}

export interface SurchargeHistory {
  merchantId: string;
  sales: CardSale[];
}

/** Amount to authorize, in cents. Zero means do not authorize. */
export type Authorization = (order: CardSale, history: SurchargeHistory) => number;
