import { randomUUID } from 'node:crypto';
import type { BankView, MerchantBank, ViewRequest } from './interface.ts';

const FULL_FIELDS = ['accountNumber', 'routingNumber', 'accountHolder'];
const MASKED_FIELDS = ['accountNumberLast4'];

function view(access: BankView['access'], fields: string[]): BankView {
  return { access, fields, auditId: randomUUID() };
}

export function showBankDetails(order: ViewRequest, history: MerchantBank): BankView {
  // A bank record for a different merchant is never shown, whatever the role.
  if (order.merchantId !== history.merchantId) return view('none', []);

  // Team leads may open any merchant. They do not need a ticket.
  if (order.viewerRole === 'team-lead') return view('full', [...FULL_FIELDS]);

  if (order.viewerRole === 'support') {
    const ticket = order.openTicket;
    const payoutForThisMerchant =
      !!ticket && ticket.merchantId === order.merchantId && ticket.topic === 'payout';
    // Full payout screen: account, routing number, and the account holder.
    if (payoutForThisMerchant) return view('full', [...FULL_FIELDS]);
    // No authorizing payout ticket: keep the legacy last-four display.
    return view('masked', [...MASKED_FIELDS]);
  }

  // Engineers are not support agents or team leads.
  return view('none', []);
}
