import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();
  const none: BankView = { access: 'none', fields: [], auditId };

  if (history.merchantId !== order.merchantId) return none;

  if (order.viewerRole === 'team-lead') {
    return { access: 'full', fields: ['accountNumber', 'routingNumber', 'accountHolder'], auditId };
  }

  if (order.viewerRole === 'support') {
    const ticket = order.openTicket;
    if (ticket !== null && ticket.merchantId === order.merchantId && ticket.topic === 'payout') {
      return { access: 'full', fields: ['accountNumber', 'routingNumber', 'accountHolder'], auditId };
    }
    return { access: 'masked', fields: ['accountNumberLast4'], auditId };
  }

  return none;
}
