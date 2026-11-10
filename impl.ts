export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;

  const digits = typed.replace(/[^0-9]/g, '');
  if (digits.length >= 7 && digits.length <= 15) return `+${digits}`;

  return typed;
}
