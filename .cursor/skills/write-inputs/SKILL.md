---
name: write-inputs
description: How to write targeted test inputs from a ticket, so independent builds reveal where the ticket can be read more than one way. Use when asked to write artifacts/inputs.json.
---

# Writing targeted test inputs

1. Read `TICKET.md` line by line. List every place two careful engineers could build
   different behavior: an undefined word ("new customer"), a boundary ("over $500"),
   a missing case (what if the amount is not given?), two rules that can both apply,
   and anything in the notes that describes what people "have been doing".
2. For each place, write one or two inputs where the readings would give different
   answers. Aim for 6 inputs in total, never more than 8.
3. Copy the shape of `artifacts/example-inputs.json` exactly: same number of `args`,
   same field names, same units. Keep each value realistic. If the examples have a
   `now` field, give every input a `now` too.
4. Give each input a short plain-English `label` (what a product owner would read),
   and a `why`: the sentence of the ticket it tests.
5. Do not write expected outputs.

Write `artifacts/inputs.json`:

```json
{
  "inputs": [
    {
      "label": "$800 payment, same country, 1 earlier payment",
      "why": "Send payments over $500 from new customers to review.",
      "args": [ { "...": "same shape as the examples" } ]
    }
  ]
}
```

Then commit that one file and push it, as the prompt says.
