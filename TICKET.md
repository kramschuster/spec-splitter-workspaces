# MF-2102 Fraud protection: flag risky payments

**Type:** Story · **Team:** Risk · **Reporter:** Product (Merchant risk)

As a risk-conscious merchant, I want suspicious payments flagged or blocked automatically, so that I lose less money to chargebacks and stolen cards.

**Acceptance criteria**

- Every payment gets one decision: allow, review, or block.
- Block a payment when the card's country is not the country the customer is paying from.
- Send payments over $500 from new customers to review.

**Notes:** Until now, the risk team has let repeat customers through without checks.
