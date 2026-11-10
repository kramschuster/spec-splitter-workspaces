import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function view(access: BankView['access'], fields: string[]): BankView {
  return { access, fields, auditId: randomUUID() };
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  if (order.merchantId !== history.merchantId) {
    return view('none', []);
  }

  if (order.viewerRole === 'team-lead') {
    return view('full', FULL_FIELDS);
  }

  if (order.viewerRole === 'support') {
    const ticket = order.openTicket;
    if (ticket !== null && ticket.merchantId === order.merchantId && ticket.topic === 'payout') {
      return view('full', FULL_FIELDS);
    }
    return view('masked', MASKED_FIELDS);
  }

  return view('none', []);
}
