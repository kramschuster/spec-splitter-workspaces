import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

const MINOR_UNITS_PER_MAJOR: Record<Currency, number> = {
  USD: 100,
  EUR: 100,
  GBP: 100,
  JPY: 1,
};

function roundHalfAwayFromZero(value: number): number {
  // Strip float noise (e.g. 1234.4999999998) so true halves round as halves.
  const cleaned = Number(value.toPrecision(12));
  return Math.sign(cleaned) * Math.round(Math.abs(cleaned));
}

export function localPrice(request: PriceRequest): LocalPrice {
  const { usdCents, currency } = request;
  const rate = currency === 'USD' ? 1 : request.rate;
  const exactMinor = (usdCents / 100) * rate * MINOR_UNITS_PER_MAJOR[currency];
  return { currency, amountMinor: roundHalfAwayFromZero(exactMinor) + 0 };
}
