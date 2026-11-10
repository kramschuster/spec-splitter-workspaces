export function savePhone(typed: string): string | null {
  if (typed.trim() === '') {
    return null;
  }

  const digits = typed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return typed;
  }

  return `+${digits}`;
}
