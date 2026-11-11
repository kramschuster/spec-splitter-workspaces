import type { Currency, LocalPrice, PriceRequest } from './interface.ts';

/** Smallest units per 1 major unit. JPY has no cents. */
const MINOR_PER_MAJOR: Record<Currency, number> = {
  USD: 100,
  EUR: 100,
  GBP: 100,
  JPY: 1,
};

/**
 * Snap size in minor units so converted prices look tidy, not like raw FX leftovers.
 * USD stays at 1 cent because the merchant already set that price.
 */
const CLEAN_STEP: Record<Currency, number> = {
  USD: 1,
  EUR: 5,
  GBP: 5,
  JPY: 10,
};

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function localPrice(request: PriceRequest): LocalPrice {
  const { currency, usdCents, rate } = request;
  // Existing sales practice: 2% conversion fee for euro presentment only.
  const fee = currency === 'EUR' ? 1.02 : 1;
  const localMajor = (usdCents / 100) * rate * fee;
  const rawMinor = localMajor * MINOR_PER_MAJOR[currency];
  const amountMinor = roundToStep(rawMinor, CLEAN_STEP[currency]);
  return { currency, amountMinor };
}
