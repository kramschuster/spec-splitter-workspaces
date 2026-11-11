import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

/** Minor units per 1 major unit: cents, pence, or whole yen. */
function minorPerMajor(currency: Currency): number {
  return currency === 'JPY' ? 1 : 100;
}

export function localPrice(request: PriceRequest): LocalPrice {
  const usdMajor = request.usdCents / 100;
  const localMajor = usdMajor * request.rate;
  const amountMinor = Math.round(localMajor * minorPerMajor(request.currency));
  return { currency: request.currency, amountMinor };
}
