import type { Invoice } from './interface.ts';

export async function lateFeeCents(invoice: Invoice): Promise<number> {
  void invoice;
  throw new Error('not implemented');
}
