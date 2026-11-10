// MF-1912 shared interface. Types only. A rule written here would hide the ambiguity.

export type Role = 'support' | 'team-lead' | 'engineer';
export type Topic = 'payout' | 'refund' | 'account';

export interface ViewRequest {
  id: string;
  merchantId: string;
  viewerRole: Role;
  /** The viewer's open support ticket, if any. */
  openTicket: null | { merchantId: string; topic: Topic };
}

export interface MerchantBank {
  merchantId: string;
  accountNumber: string;
  routingNumber: string;
  accountHolder: string;
}

export interface BankView {
  access: 'full' | 'masked' | 'none';
  /** Names of the fields shown: "accountNumber", "routingNumber", "accountHolder", or "accountNumberLast4". */
  fields: string[];
  /** A new id for the audit log on every view. */
  auditId: string;
}

/** What the viewer is shown. */
export type ShowBankDetails = (order: ViewRequest, history: MerchantBank) => BankView;
