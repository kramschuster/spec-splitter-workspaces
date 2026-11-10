import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function hasPayoutTicketFor(order: ViewRequest): boolean {
  const ticket = order.openTicket;
  return ticket !== null && ticket.merchantId === order.merchantId && ticket.topic === 'payout';
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();

  if (history.merchantId !== order.merchantId) {
    return { access: 'none', fields: [], auditId };
  }

  if (order.viewerRole === 'team-lead') {
    return { access: 'full', fields: [...FULL_FIELDS], auditId };
  }

  if (order.viewerRole === 'support') {
    if (hasPayoutTicketFor(order)) {
      return { access: 'full', fields: [...FULL_FIELDS], auditId };
    }
    return { access: 'masked', fields: [...MASKED_FIELDS], auditId };
  }

  return { access: 'none', fields: [], auditId };
}
