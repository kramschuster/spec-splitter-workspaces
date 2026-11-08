---
name: implement-ticket
description: How to implement a business-logic ticket against a fixed function interface - read the ticket and types, implement the one function, check it runs, and record the interpretation choices you made. Use when asked to implement a ticket in impl.ts.
---

# Implementing a ticket

1. Read `TICKET.md` and `interface.ts`. The types are fixed and give only shapes, not rules.
2. Write `loyaltyDiscount` in `impl.ts`. Keep it a single, readable function plus small helpers.
3. Run `node smoke.ts`. It loads your implementation and calls it once. Fix anything
   that stops it from running. You may write your own quick checks in `scratch/`.
4. Write `artifacts/notes.md`: one line per decision the ticket did not spell out, in
   the form `- <question>: <what you chose>`. List only decisions your code actually makes.
5. Reply with a one-sentence summary.
