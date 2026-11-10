import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();

  if (!order.merchantId || order.merchantId !== history.merchantId) {
    return { access: 'none', fields: [], auditId };
  }

  const hasPayoutTicket =
    order.openTicket != null &&
    order.openTicket.merchantId === order.merchantId &&
    order.openTicket.topic === 'payout';

  if (order.viewerRole === 'team-lead' || (order.viewerRole === 'support' && hasPayoutTicket)) {
    return {
      access: 'full',
      fields: ['accountNumber', 'routingNumber', 'accountHolder'],
      auditId,
    };
  }

  if (order.viewerRole === 'support') {
    return { access: 'masked', fields: ['accountNumberLast4'], auditId };
  }

  return { access: 'none', fields: [], auditId };
}
