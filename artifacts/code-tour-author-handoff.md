<decision>
Implemented one deterministic refund path: validate ownership and payment identity, reject failed payments, then refund the requested integer amount or the remaining balance.

<risk>
Review the chosen HTTP/error responses for unmatched and failed payments, and the use of the request id as the refund id.

<verified>
Ran `node impl.ts`, `node smoke.ts`, `node scratch/check.ts`, and `git diff --check`; all exited successfully.
