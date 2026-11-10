export function savePhone(typed: string): string | null {
  const trimmed = typed.trim();
  if (trimmed === '') {
    return null;
  }

  const internationalNumber = trimmed.startsWith('00')
    ? trimmed.slice(2)
    : trimmed;
  const digits = internationalNumber.replace(/\D/g, '');

  if (digits.length < 7 || digits.length > 15) {
    return typed;
  }

  return `+${digits}`;
}
