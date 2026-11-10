import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  void order; void history;
  throw new Error('not implemented');
}
