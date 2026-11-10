const SEPARATORS = /[\s\-().\/]/g;

function toE164(typed: string): string | null {
  let compact = typed.trim().replace(SEPARATORS, '');
  if (compact.startsWith('00')) compact = '+' + compact.slice(2);
  if (!/^\+[1-9]\d{6,14}$/.test(compact)) return null;
  return compact;
}

export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;
  return toE164(typed) ?? typed;
}
