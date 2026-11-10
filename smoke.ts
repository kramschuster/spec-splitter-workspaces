// Loads impl.ts and calls it once on a neutral example. Not a test of the rules.
import { authorizedCents } from './impl.ts';
const order = { id: 'ord-smoke', customerId: 'cus-1', subtotalCents: 123456, taxCents: 10185, currency: 'USD' as const, date: '2026-06-15', method: 'standard' as const, firstOrder: true, scheduledRole: null, workedRole: null, incidents: [] as never[], lines: [] as never[] };
const context = { customerId: 'cus-1', orders: [] as never[], referrerId: 'cus-1', credits: [] as { date: string; cents: number }[] };
console.log('authorizedCents ->', authorizedCents(order, context));
