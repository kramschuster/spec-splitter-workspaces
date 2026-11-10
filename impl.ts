import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'] as const;

function bankView(access: BankView['access'], fields: readonly string[]): BankView {
  return { access, fields: [...fields], auditId: randomUUID() };
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  // The record has to be the merchant being viewed. Anything else is not their bank details.
  if (history.merchantId !== order.merchantId) {
    return bankView('none', []);
  }

  // Team leads can see full details for any merchant, ticket or not.
  if (order.viewerRole === 'team-lead') {
    return bankView('full', FULL_FIELDS);
  }

  // Support sees the full account, routing number, and holder when the open ticket
  // is for this merchant (any topic). With no such ticket, only the last four.
  if (order.viewerRole === 'support') {
    const ticket = order.openTicket;
    if (ticket !== null && ticket.merchantId === order.merchantId) {
      return bankView('full', FULL_FIELDS);
    }
    return bankView('masked', ['accountNumberLast4']);
  }

  // Engineers are not in the support payout workflow.
  return bankView('none', []);
}
