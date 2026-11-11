import type { LocalPrice, PriceRequest } from './interface.ts';

export function localPrice(request: PriceRequest): LocalPrice {
  const { currency, usdCents, rate } = request;

  if (currency === 'USD') {
    return { currency, amountMinor: usdCents };
  }

  const local = (usdCents / 100) * rate;
  const amountMinor = currency === 'JPY' ? Math.round(local) : Math.round(local * 100);

  return { currency, amountMinor };
}
