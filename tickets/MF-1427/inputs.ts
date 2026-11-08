// Input generator for MF-1427: boundaries mined from the ticket's own numbers, plus
// history/month-edge cases and seeded random orders. Deterministic for a given seed.
// "Test more edge cases" = add a rule to RULES below.
import type { CustomerHistory, Order, PastOrder } from './interface.ts';

export interface ProbeInput { id: string; label: string; rule: string; order: Order; history: CustomerHistory }

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const CUSTOMER = 'cus-7781';
let seq = 0;

function order(subtotalCents: number, o: Partial<Order> = {}): Order {
  return { id: `ord-${++seq}`, customerId: CUSTOMER, subtotalCents, taxCents: 0, shippingCents: 0, currency: 'USD', date: '2026-11-14', ...o };
}
function past(subtotalCents: number, date: string, loyaltyDiscountCents: number): PastOrder {
  return { ...order(subtotalCents, { date, taxCents: Math.round(subtotalCents * 0.08) }), loyaltyDiscountCents };
}
const history = (...orders: PastOrder[]): CustomerHistory => ({ customerId: CUSTOMER, orders });

/** Numbers the ticket author wrote down: dollar amounts and percentages. */
export function mine(ticket: string) {
  const dollars = [...ticket.matchAll(/\$([\d,]+(?:\.\d{1,2})?)/g)].map((m) => Math.round(Number(m[1].replace(/,/g, '')) * 100));
  const percents = [...ticket.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map((m) => Number(m[1]));
  return { dollars, percents };
}

type Rule = (n: ReturnType<typeof mine>) => Omit<ProbeInput, 'id' | 'rule'>[];

const RULES: Record<string, Rule> = {
  // Each dollar amount the ticket mentions, approached from both sides.
  'amount-boundary': ({ dollars }) => dollars.flatMap((c) => [c - 1, c, c + 1].map((s) => ({
    label: `subtotal ${usd(s)}${s === c ? ' (exactly the ticket amount)' : ''}`,
    order: order(s), history: history(),
  }))),
  // Subtotal under the threshold, but tax or shipping pushes the order total over it.
  'tax-shipping-crossing': ({ dollars }) => {
    const t = Math.max(...dollars);
    return [
      { label: `subtotal ${usd(t - 2000)} + tax ${usd(4000)} (total ${usd(t + 2000)})`, order: order(t - 2000, { taxCents: 4000 }), history: history() },
      { label: `subtotal ${usd(t - 1500)} + shipping ${usd(2500)} (total ${usd(t + 1000)})`, order: order(t - 1500, { shippingCents: 2500 }), history: history() },
      { label: `subtotal ${usd(t + 5000)} + tax ${usd(4400)} (both measures over)`, order: order(t + 5000, { taxCents: 4400 }), history: history() },
    ];
  },
  // Large orders where the percentage alone would exceed the cap.
  'cap-binding': () => [80_000, 120_000, 55_000].map((s) => ({ label: `subtotal ${usd(s)}, no earlier orders`, order: order(s, { taxCents: Math.round(s * 0.08) }), history: history() })),
  // Earlier discounted orders: is the cap per order or per period?
  'repeat-orders': () => [
    { label: `second ${usd(80_000)} order this month; first got ${usd(5000)} off`, order: order(80_000, { date: '2026-11-20' }), history: history(past(90_000, '2026-11-03', 5000)) },
    { label: `${usd(80_000)} order; ${usd(3000)} already discounted this month`, order: order(80_000, { date: '2026-11-20' }), history: history(past(60_000, '2026-11-03', 3000)) },
    { label: `third order this month; ${usd(2500)} + ${usd(2500)} already discounted`, order: order(70_000, { date: '2026-11-25' }), history: history(past(55_000, '2026-11-02', 2500), past(55_000, '2026-11-10', 2500)) },
  ],
  // Month edges: calendar month vs. rolling 30 days.
  'month-edge': () => [
    { label: `${usd(80_000)} on Nov 1; ${usd(5000)} discount on Oct 31`, order: order(80_000, { date: '2026-11-01' }), history: history(past(90_000, '2026-10-31', 5000)) },
    { label: `${usd(80_000)} on Nov 5; ${usd(5000)} discount on Oct 20 (16 days earlier)`, order: order(80_000, { date: '2026-11-05' }), history: history(past(90_000, '2026-10-20', 5000)) },
    { label: `${usd(80_000)} on Nov 28; ${usd(5000)} discount on Nov 1`, order: order(80_000, { date: '2026-11-28' }), history: history(past(90_000, '2026-11-01', 5000)) },
  ],
};

function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function randomInputs(count: number, seed: number): Omit<ProbeInput, 'id' | 'rule'>[] {
  const r = rng(seed);
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
  return Array.from({ length: count }, () => {
    const s = int(20_000, 200_000);
    const day = int(1, 28);
    const prior = Array.from({ length: int(0, 2) }, () => {
      const ps = int(30_000, 150_000);
      const pd = r() < 0.5 ? `2026-10-${String(int(1, 31)).padStart(2, '0')}` : `2026-11-${String(int(1, day)).padStart(2, '0')}`;
      return past(ps, pd, ps > 50_000 ? Math.min(Math.round(ps * 0.1), 5000) : 0);
    }).sort((a, b) => a.date.localeCompare(b.date));
    return {
      label: `random: subtotal ${usd(s)}, ${prior.length} earlier order(s)`,
      order: order(s, { taxCents: Math.round(s * 0.0825), shippingCents: int(0, 2500), date: `2026-11-${String(day).padStart(2, '0')}` }),
      history: history(...prior),
    };
  });
}

export function generate(ticket: string, opts: { seed?: number; random?: number } = {}): ProbeInput[] {
  seq = 0;
  const mined = mine(ticket);
  const out: ProbeInput[] = [];
  for (const [rule, fn] of Object.entries(RULES)) for (const i of fn(mined)) out.push({ ...i, rule, id: `in-${String(out.length + 1).padStart(3, '0')}` });
  for (const i of randomInputs(opts.random ?? 30, opts.seed ?? 1427)) out.push({ ...i, rule: 'random', id: `in-${String(out.length + 1).padStart(3, '0')}` });
  return out;
}
