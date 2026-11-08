# MF-1427 implementation notes

- Which order amount triggers the discount: subtotal, not total with tax/shipping. Chose `subtotalCents` because "orders over $500" is usually understood as the merchandise subtotal.
- Strict vs inclusive threshold: "over $500" means strictly greater than 50000 cents, so an order of exactly $500 gets no discount.
- Cap applies to discount amount: 10% computed, then clamped to 5000 cents ($50).
- Fractional cents: rounded to nearest cent with `Math.round` before applying the cap.
- History parameter: unused because the ticket does not tie the discount to past orders.
