import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'] as const;
const MASKED_FIELDS = ['accountNumberLast4'] as const;

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  const auditId = randomUUID();

  // The record on hand is for a different merchant than the one being viewed.
  if (history.merchantId !== order.merchantId) {
    return view('none', [], auditId);
  }

  // Team leads may see full payout bank details for any merchant, ticket or not.
  if (order.viewerRole === 'team-lead') {
    return view('full', FULL_FIELDS, auditId);
  }

  // Support agents see the full payout screen only while helping this merchant
  // with a payout. Any other support view keeps the last four of the account.
  if (order.viewerRole === 'support') {
    if (hasOpenPayoutTicket(order)) return view('full', FULL_FIELDS, auditId);
    return view('masked', MASKED_FIELDS, auditId);
  }

  // Engineers are not support agents or team leads.
  return view('none', [], auditId);
}

function hasOpenPayoutTicket(order: ViewRequest): boolean {
  const ticket = order.openTicket;
  return ticket !== null && ticket.merchantId === order.merchantId && ticket.topic === 'payout';
}

function view(access: BankView['access'], fields: readonly string[], auditId: string): BankView {
  return { access, fields: [...fields], auditId };
}
