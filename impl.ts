import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'] as const;
const MASKED_FIELDS = ['accountNumberLast4'] as const;

function bankView(access: BankView['access'], fields: readonly string[]): BankView {
  return { access, fields: [...fields], auditId: randomUUID() };
}

function payoutTicketForMerchant(order: ViewRequest): boolean {
  const ticket = order.openTicket;
  return ticket != null && ticket.merchantId === order.merchantId && ticket.topic === 'payout';
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  // The bank record must be the merchant being viewed. A mismatch is not a
  // masked view: last-four of the wrong account is still the wrong account.
  if (order.merchantId !== history.merchantId) {
    return bankView('none', []);
  }

  if (order.viewerRole === 'team-lead') {
    return bankView('full', FULL_FIELDS);
  }

  if (order.viewerRole === 'support') {
    return payoutTicketForMerchant(order) ? bankView('full', FULL_FIELDS) : bankView('masked', MASKED_FIELDS);
  }

  return bankView('none', []);
}
