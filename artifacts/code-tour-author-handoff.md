<decision>
Compute the fee directly from goods because shipping, settlement, and history are explicitly excluded from changing it; represent refunds as negative fees.

<risk>
Review the nearest-cent rounding choice and the sign convention expected by downstream consumers.

<verified>
Ran `node smoke.ts`, focused assertions for settlement, shipping, refunds, rounding, and uncapped history, plus `node --check impl.ts`.
