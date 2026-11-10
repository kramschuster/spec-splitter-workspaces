const VISUAL_SEPARATORS = /[\s().\-./]/g;

/** E.164 compact form, or null if the country-code check fails. */
function toE164(typed: string): string | null {
  const trimmed = typed.trim();
  if (trimmed === '') return null;

  let national: string;
  if (trimmed.startsWith('+')) {
    national = trimmed.slice(1);
  } else if (trimmed.startsWith('00')) {
    // ITU recommended international prefix, same as '+'.
    national = trimmed.slice(2);
  } else {
    return null;
  }

  const digits = national.replace(VISUAL_SEPARATORS, '');
  // E.164: 7–15 digits, cannot start with 0 (0 is never a country code).
  if (!/^[1-9]\d{6,14}$/.test(digits)) return null;
  return `+${digits}`;
}

export function savePhone(typed: string): string | null {
  const formatted = toE164(typed);
  if (formatted !== null) return formatted;
  // Blank input is nothing to store. Anything else that fails the check is
  // kept exactly as typed, matching how support already saved these numbers.
  return typed.trim() === '' ? null : typed;
}
