const TRUNK_ZERO = /\(\s*0\s*\)/g;
const FORMATTING = /[\s()./-]/g;

/** Store a merchant support number as E.164, or keep the typed text when it fails the check. */
export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;
  return toE164(typed) ?? typed;
}

function toE164(typed: string): string | null {
  const compact = typed.trim().replace(TRUNK_ZERO, '').replace(FORMATTING, '');
  const digits = internationalDigits(compact);
  if (digits === null || !/^[1-9]\d{6,14}$/.test(digits)) return null;
  return '+' + digits;
}

function internationalDigits(compact: string): string | null {
  let rest = compact;
  if (rest.startsWith('+')) rest = rest.slice(1);
  else if (!rest.startsWith('00')) return null;
  if (rest.startsWith('00')) rest = rest.slice(2);
  return rest;
}
