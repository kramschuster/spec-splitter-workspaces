import type { Capture, RefundHistory } from './interface.ts';

/** Non-negative integer cents; invalid values become 0. */
function cents(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.trunc(n));
}

/**
 * Amount this request may return to the card, before prior-refund remaining.
 * Open (unsettled) charges follow ops: at most half the capture.
 * Settled charges follow written policy: the typed amount, up to the capture.
 * Processing fees are not deducted — they were already taken at capture.
 */
function requestReturn(capture: Capture): number {
  const captured = cents(capture?.capturedCents);
  const requested = cents(capture?.requestedCents);
  const cap = capture?.settled ? captured : Math.trunc(captured / 2);
  return Math.min(requested, cap);
}

export function refundCents(order: Capture, history: RefundHistory): number {
  const captured = cents(order?.capturedCents);
  const requestedNow = requestReturn(order ?? ({} as Capture));

  const prior = Array.isArray(history?.captures) ? history.captures : [];
  let alreadyReturned = 0;
  for (const row of prior) {
    if (row === order) continue;
    if (!row || row.id !== order?.id) continue;
    alreadyReturned += requestReturn(row);
  }

  const remaining = Math.max(0, captured - alreadyReturned);
  return Math.min(requestedNow, remaining);
}
