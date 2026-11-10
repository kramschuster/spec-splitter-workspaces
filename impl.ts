import type { BankView, MerchantBank, ViewRequest } from './interface.ts';
import { randomUUID } from 'node:crypto';

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();

  if (order.merchantId !== history.merchantId) {
    return { access: 'none', fields: [], auditId };
  }

  const canViewFullDetails =
    order.viewerRole === 'team-lead'
    || (order.viewerRole === 'support'
      && order.openTicket?.merchantId === order.merchantId);

  if (canViewFullDetails) {
    return {
      access: 'full',
      fields: ['accountNumber', 'routingNumber', 'accountHolder'],
      auditId,
    };
  }

  if (order.viewerRole === 'support') {
    return {
      access: 'masked',
      fields: ['accountNumberLast4'],
      auditId,
    };
  }

  return { access: 'none', fields: [], auditId };
}
