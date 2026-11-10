function digitsOf(typed: string): string {
  return typed.replace(/\D/g, '');
}

function hasExplicitPlus(typed: string): boolean {
  return typed.trimStart().startsWith('+');
}

/** Drop a leading international 00 prefix; it is not part of the country code. */
function e164Digits(typed: string): string {
  const digits = digitsOf(typed);
  if (!hasExplicitPlus(typed) && digits.startsWith('00')) {
    return digits.slice(2);
  }
  return digits;
}

export function savePhone(typed: string): string | null {
  if (typed.trim() === '') return null;

  const digits = e164Digits(typed);
  if (digits.length >= 7 && digits.length <= 15) {
    return `+${digits}`;
  }

  return typed;
}
