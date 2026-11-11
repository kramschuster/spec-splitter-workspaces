import type { LocalPrice, PriceRequest } from './interface.ts';

export function localPrice(request: PriceRequest): LocalPrice {
  void request;
  throw new Error('not implemented');
}
