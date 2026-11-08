// Loads impl.ts and calls it once on a neutral example. Not a test of the rules.
import { loyaltyDiscount } from './impl.ts';
const order = { id: 'ord-smoke', customerId: 'cus-1', subtotalCents: 123456, taxCents: 10185, shippingCents: 999, currency: 'USD' as const, date: '2026-06-15' };
console.log('loyaltyDiscount ->', loyaltyDiscount(order, { customerId: 'cus-1', orders: [] }));
