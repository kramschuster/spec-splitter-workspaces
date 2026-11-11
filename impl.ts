import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

const MINOR_UNITS_PER_MAJOR: Record<Currency, number> = { USD: 100, EUR: 100, GBP: 100, JPY: 1 };

const CONVERSION_FEE: Partial<Record<Currency, number>> = { EUR: 0.02 };

function cleanCents(minor: number): number {
  return Math.max(99, Math.round((minor + 1) / 100) * 100 - 1);
}

function cleanYen(yen: number): number {
  return Math.max(10, Math.round(yen / 10) * 10);
}

export function localPrice(request: PriceRequest): LocalPrice {
  const { usdCents, currency, rate } = request;

  if (currency === 'USD') {
    return { currency, amountMinor: Math.round(usdCents) };
  }

  const fee = CONVERSION_FEE[currency] ?? 0;
  const exactMinor = (usdCents / 100) * rate * (1 + fee) * MINOR_UNITS_PER_MAJOR[currency];

  const amountMinor = currency === 'JPY' ? cleanYen(exactMinor) : cleanCents(exactMinor);
  return { currency, amountMinor };
}
