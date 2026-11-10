import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function accessFor(order: ViewRequest, history: MerchantBank): BankView['access'] {
  if (history.merchantId !== order.merchantId) return 'none';
  if (order.viewerRole === 'team-lead') return 'full';
  if (order.viewerRole !== 'support') return 'none';
  const ticket = order.openTicket;
  if (ticket && ticket.merchantId === order.merchantId && ticket.topic === 'payout') return 'full';
  return 'masked';
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const access = accessFor(order, history);
  const fields = access === 'full' ? [...FULL_FIELDS] : access === 'masked' ? [...MASKED_FIELDS] : [];
  return { access, fields, auditId: randomUUID() };
}
