---
name: write-questions
description: How to turn harness disagreement clusters into product-owner questions with worked examples. Use when asked to write questions from clusters.json.
---

# Writing questions from disagreement clusters

1. For each cluster in `artifacts/clusters.json`, find the difference in reading that
   makes the groups disagree. Read the versions' `impl.ts` and `notes.md` and confirm it
   against the outputs on the cluster's inputs.
2. Merge clusters that come from the same difference. One question per difference.
   A cluster caused by two differences at once belongs to both questions; do not
   write a combined question for it.
3. For each question, pick the clearest worked example: an input from the question's
   clusters where only this difference matters (prefer non-random, labeled inputs).
4. Write one option per reading. An option's `versions` must be exactly the versions
   that hold that reading. On the example input, they all produce the same amount.
5. Give each option a `clarification`: the sentence to add to the ticket if the
   product owner picks it. It must be unambiguous on its own.
6. A cluster with `"kind": "minority"` is one version against all the others. It may be
   a reading the others missed, or a bug. This is that version's hearing. Write a question
   for it only if its `notes.md` or code shows a deliberate reading AND you can point to the
   sentence of the ticket it follows (often a note about what people "have been doing").
   Quote that sentence in the question. If the difference looks like a mistake (wrong units,
   a crash, ignoring a stated rule), leave it out, and it will be reported as a likely bug.
   Mark such questions `"minority": true`.
7. At most 5 questions, most money-relevant first.

Write `artifacts/questions.json`:

```json
{
  "questions": [
    {
      "id": "Q1",
      "title": "Do returned items count toward free shipping?",
      "question": "If a customer returns part of an order, is free shipping re-checked against what they kept?",
      "clusterIds": ["S2"],
      "exampleInputId": "in-014",
      "options": [
        { "versions": ["A", "C"], "label": "Yes: re-check against kept items",
          "clarification": "Free shipping is re-evaluated on the value of items kept after a return." },
        { "versions": ["B", "D", "E"], "label": "No: decided once at checkout",
          "clarification": "Free shipping is decided once at checkout and is not changed by later returns." }
      ]
    }
  ]
}
```

The orchestrator fills in each option's amount on the example input from the harness
grid, and flags any option whose versions do not actually agree there.
