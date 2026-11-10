export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;

  // Only separators merchants commonly type are tolerated; anything else (letters, extensions) fails the check.
  const compact = typed.trim().replace(/[\s\-.()]/g, '');
  const match = /^(?:\+|00)(\d+)$/.exec(compact);
  if (!match) return typed;

  const digits = match[1];
  const validLength = digits.length >= 7 && digits.length <= 15;
  const validCountryCode = digits[0] !== '0';
  if (!validLength || !validCountryCode) return typed;

  return `+${digits}`;
}
