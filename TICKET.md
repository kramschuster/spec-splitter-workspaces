# MF-2001 Save a merchant's support phone number

**Type:** Story · **Team:** Merchant dashboard · **Reporter:** Product (Onboarding)

Merchants type a support phone number into their dashboard. We store it in one standard format so support can call it. Numbers must include a country code.

Until now, support has saved numbers that fail the check exactly as the merchant typed them.

## Clarifications (from the product owner)
- A number passes the check only if it has at least 7 digits (country code included, up to 15); shorter numbers fail the check and are saved exactly as the merchant typed them.
