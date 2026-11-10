import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function audited(access: BankView['access'], fields: string[]): BankView {
  return { access, fields, auditId: randomUUID() };
}

function ticketOnMerchant(order: ViewRequest): boolean {
  return order.openTicket != null && order.openTicket.merchantId === order.merchantId;
}

function helpingWithPayout(order: ViewRequest): boolean {
  return ticketOnMerchant(order) && order.openTicket!.topic === 'payout';
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  if (order.merchantId !== history.merchantId) {
    return audited('none', []);
  }

  if (order.viewerRole === 'team-lead') {
    return audited('full', FULL_FIELDS);
  }

  if (order.viewerRole === 'support' && helpingWithPayout(order)) {
    return audited('full', FULL_FIELDS);
  }

  if (order.viewerRole === 'support') {
    return audited('masked', MASKED_FIELDS);
  }

  return audited('none', []);
}
