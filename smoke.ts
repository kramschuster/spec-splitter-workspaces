// Loads impl.ts and checks it exports retryCents. Calls it once on a neutral example if it can.
// Not a test of the rules: the harness runs the real inputs.
import * as impl from './impl.ts';
const f = (impl as Record<string, unknown>)['retryCents'];
if (typeof f !== 'function') { console.log('impl.ts does not export retryCents'); process.exit(1); }
const order = { id: 'ord-smoke', customerId: 'cus-1', subtotalCents: 123456, taxCents: 10185, currency: 'USD' as const, date: '2026-06-15', lines: [] as never[] };
const context = { customerId: 'cus-1', orders: [] as never[], credits: [] as never[] };
try { console.log('retryCents ->', await (f as (...a: unknown[]) => unknown)(order, context)); }
catch (e) { console.log('retryCents loaded; the neutral example did not fit its arguments:', e instanceof Error ? e.message : e); }
