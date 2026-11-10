export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;

  const looksLikePhone = /^\s*\+?[\d\s().\-]*\s*$/.test(typed);
  if (!looksLikePhone) return typed;

  let digits = typed.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.length < 7 || digits.length > 15) return typed;
  return '+' + digits;
}
