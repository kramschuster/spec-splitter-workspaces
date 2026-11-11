import type { LocalPrice, PriceRequest } from './interface.ts';

// A finite number as an exact fraction of a power of ten, using the decimal
// text of the value so a rate such as 1.005 is not short of a half in binary.
function decimalRatio(value: number): { num: bigint; den: bigint } {
  const negative = value < 0;
  const [body, expRaw] = Math.abs(value).toString().toLowerCase().split('e');
  const exp = expRaw ? Number(expRaw) : 0;
  const [whole, frac = ''] = body.split('.');
  const num = BigInt(whole + frac) * (negative ? -1n : 1n);
  const scale = frac.length - exp;
  if (scale >= 0) return { num, den: 10n ** BigInt(scale) };
  return { num: num * 10n ** BigInt(-scale), den: 1n };
}

// Round (usdCents * rate / divisor) half away from zero to an integer.
function roundProduct(usdCents: number, rate: number, divisor: bigint): number {
  if (!Number.isFinite(usdCents) || !Number.isFinite(rate)) return NaN;
  const price = decimalRatio(usdCents);
  const fx = decimalRatio(rate);
  const num = price.num * fx.num;
  const den = price.den * fx.den * divisor;
  const negative = num < 0n;
  const absNum = negative ? -num : num;
  const quotient = absNum / den;
  const remainder = absNum % den;
  const rounded = remainder * 2n >= den ? quotient + 1n : quotient;
  return Number(negative ? -rounded : rounded);
}

export function localPrice(request: PriceRequest): LocalPrice {
  const { currency, usdCents, rate } = request;
  // The rate is local major units per 1 USD. Cent currencies are already in
  // hundredths once US cents are multiplied by that rate. Yen has no hundredths.
  const divisor = currency === 'JPY' ? 100n : 1n;
  return { currency, amountMinor: roundProduct(usdCents, rate, divisor) };
}
