import type { MarketplaceCharge, SplitHistory } from './interface.ts';

export function platformFeeCents(order: MarketplaceCharge, history: SplitHistory): number {
  void order; void history;
  throw new Error('not implemented');
}
