import type { LocalPrice, PriceRequest } from './interface.ts';

export function localPrice(request: PriceRequest): LocalPrice {
  if (request.currency === 'USD') {
    return { currency: request.currency, amountMinor: request.usdCents };
  }

  const amountMinor = request.currency === 'JPY'
    ? Math.round((request.usdCents / 100) * request.rate)
    : Math.round(request.usdCents * request.rate);

  return { currency: request.currency, amountMinor };
}
