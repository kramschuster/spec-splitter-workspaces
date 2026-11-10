import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();

  if (order.merchantId !== history.merchantId) {
    return { access: 'none', fields: [], auditId };
  }

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

  return { access: 'none', fields: [], auditId };
}
