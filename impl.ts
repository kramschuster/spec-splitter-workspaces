export function savePhone(typed: string): string | null {
  if (typed.length === 0) return null;

  const digits = typed.replace(/\D/g, '');
  const trimmed = typed.trim();
  const subscriber = trimmed.startsWith('+')
    ? digits
    : digits.startsWith('00')
      ? digits.slice(2)
      : digits;

  if (subscriber.length >= 7 && subscriber.length <= 15) {
    return `+${subscriber}`;
  }

  return typed;
}
