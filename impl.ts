import type { LocalPrice, PriceRequest } from './interface.ts';

const EUR_CONVERSION_FEE = 1.02;

export function localPrice(request: PriceRequest): LocalPrice {
  const { currency, usdCents, rate } = request;

  if (currency === 'USD') {
    return { currency, amountMinor: usdCents };
  }

  const feeMultiplier = currency === 'EUR' ? EUR_CONVERSION_FEE : 1;
  const usd = usdCents / 100;

  if (currency === 'JPY') {
    const yen = Number((usd * rate * feeMultiplier).toFixed(6));
    return { currency, amountMinor: Math.max(10, Math.ceil(yen / 10) * 10) };
  }

  const minor = Number((usd * rate * feeMultiplier * 100).toFixed(6));
  const units = Math.max(1, Math.ceil((minor + 1) / 100));
  return { currency, amountMinor: units * 100 - 1 };
}
