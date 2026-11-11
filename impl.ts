import type { LocalPrice, PriceRequest } from './interface.ts';

export function localPrice(request: PriceRequest): LocalPrice {
  const unitsPerDollar =
    request.currency === 'EUR' ? request.rate * 1.02 : request.rate;
  const amountMinor =
    request.currency === 'JPY'
      ? Math.round((request.usdCents / 100) * unitsPerDollar)
      : Math.round(request.usdCents * unitsPerDollar);

  return {
    currency: request.currency,
    amountMinor,
  };
}
