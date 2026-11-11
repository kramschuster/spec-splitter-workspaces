import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

const MINOR_PER_MAJOR: Record<Currency, number> = {
  USD: 100,
  EUR: 100,
  GBP: 100,
  JPY: 1,
};

/** Increment (in minor units) we round to so the customer sees a tidy price. */
const CLEAN_INCREMENT: Record<Currency, number> = {
  USD: 1,
  EUR: 100,
  GBP: 100,
  JPY: 10,
};

export function localPrice(request: PriceRequest): LocalPrice {
  const { usdCents, currency, rate } = request;

  let localMajor = (usdCents / 100) * rate;
  if (currency === 'EUR') {
    localMajor *= 1.02;
  }

  const rawMinor = localMajor * MINOR_PER_MAJOR[currency];
  const increment = CLEAN_INCREMENT[currency];
  const amountMinor = Math.round(rawMinor / increment) * increment;

  return { currency, amountMinor };
}
