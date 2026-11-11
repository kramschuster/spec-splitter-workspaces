import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

// Yen is already the smallest unit. The other checkout currencies have 100 minor units.
function minorPerMajor(currency: Currency): number {
  return currency === 'JPY' ? 1 : 100;
}

// Halves round away from zero. The tolerance pulls a binary value that landed
// just under n.5 (such as 100.5 stored as 100.49999999999999) back onto the half.
function roundHalfAwayFromZero(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const tolerance = 16 * Number.EPSILON * Math.max(1, abs);
  return sign * Math.floor(abs + 0.5 + tolerance);
}

export function localPrice(request: PriceRequest): LocalPrice {
  const exactMinor = (request.usdCents * request.rate * minorPerMajor(request.currency)) / 100;
  return {
    currency: request.currency,
    amountMinor: roundHalfAwayFromZero(exactMinor),
  };
}
