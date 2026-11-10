export function savePhone(typed: string): string | null {
  let s = typed.trim();
  if (s.startsWith('00')) s = '+' + s.slice(2);
  if (!s.startsWith('+')) return null;
  if (!/^\+[\d\s().-]*$/.test(s)) return null;
  const digits = s.replace(/\D/g, '');
  if (!/^[1-9]\d{6,14}$/.test(digits)) return null;
  return '+' + digits;
}
