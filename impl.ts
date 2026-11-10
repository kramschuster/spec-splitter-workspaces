const SEPARATORS = /[\s\-.()\/]/g;

export function savePhone(typed: string): string | null {
  const trimmed = typed.trim();
  if (trimmed === '') return null;

  const compact = trimmed.replace(SEPARATORS, '');
  let digits: string;
  if (compact.startsWith('+')) {
    digits = compact.slice(1);
  } else if (compact.startsWith('00')) {
    digits = compact.slice(2);
  } else {
    return typed;
  }

  if (!/^\d{7,15}$/.test(digits) || digits.startsWith('0')) return typed;
  return '+' + digits;
}
