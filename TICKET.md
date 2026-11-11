# MF-2101 Refunds: refund from my own system

**Type:** Story · **Team:** Payments · **Reporter:** Product (Merchant platform)

As a merchant, I want to refund customers from my own order system, not only from the dashboard, so that my team can handle returns where they already work.

**Acceptance criteria**

- My system sends a refund request for one of my payments, and gets back whether the refund went through and how much was refunded.
- A refund cannot be more than the payment.
- If I do not say how much, the whole payment is refunded.

**Notes:** Until now, support has refunded payments that are still pending from the dashboard.

## Clarifications (from the product owner)
- Merchants can refund both succeeded and pending payments from their own system; failed payments cannot be refunded.
- A refund request for more than the payment's remaining unrefunded balance is rejected with nothing refunded, using the same invalid-request error (HTTP 400) as a zero, negative, or fractional amount.
