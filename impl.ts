const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;

  let digits = typed.replace(/[^0-9]/g, '');
  // "00" is the international dialling prefix, not part of the country code.
  if (/^[^0-9+]*00/.test(typed) && !typed.includes('+')) digits = digits.slice(2);

  if (digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS) return '+' + digits;
  return typed;
}
