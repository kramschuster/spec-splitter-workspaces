# MF-1427 Refund a captured charge

**Type:** Story · **Team:** Payments · **Reporter:** Product (Card processing)

A merchant can return money to the card after a charge is captured. The capture is the amount that settled. The merchant types the amount to send back. ModFin already took its processing fee at capture.

A request the same day is not the same as a refund after the charge has settled. While a charge is still open, operations has been releasing half of the capture. The written policy describes the refund once the charge has settled.

## Clarifications (from the product owner)
- While a charge is still open, the refund is the amount the merchant typed, but never more than half of the captured amount (rounded down to the cent).
