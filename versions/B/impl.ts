import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function loggedView(access: BankView['access'], fields: string[]): BankView {
  return { access, fields, auditId: randomUUID() };
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  if (order.merchantId !== history.merchantId) {
    return loggedView('none', []);
  }

  if (order.viewerRole === 'team-lead') {
    return loggedView('full', FULL_FIELDS);
  }

  const ticket = order.openTicket;
  const helpingWithPayout =
    order.viewerRole === 'support' &&
    ticket !== null &&
    ticket.merchantId === order.merchantId &&
    ticket.topic === 'payout';

  if (helpingWithPayout) {
    return loggedView('full', FULL_FIELDS);
  }

  if (order.viewerRole === 'support') {
    return loggedView('masked', MASKED_FIELDS);
  }

  return loggedView('none', []);
}
