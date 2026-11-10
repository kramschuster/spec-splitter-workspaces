export function savePhone(typed: string): string | null {
  const trimmed = typed.trim();
  if (trimmed === '') return null;

  const international = trimmed.startsWith('+')
    ? trimmed.slice(1)
    : trimmed.startsWith('00')
      ? trimmed.slice(2)
      : null;

  if (international === null || !/^[\d\s().-]+$/.test(international)) {
    return typed;
  }

  const digits = international.replace(/[\s().-]/g, '');
  return /^[1-9]\d{1,14}$/.test(digits) ? `+${digits}` : typed;
}
