# MF-2103 International sales: charge in local currency

**Type:** Story · **Team:** Checkout · **Reporter:** Product (International)

As a merchant expanding abroad, I want to charge customers in their local currency, so that international buyers see a price they understand and are more likely to pay.

**Acceptance criteria**

- Prices are set in US dollars and converted at today's rate.
- The price is in the currency's smallest unit. Japanese yen has no cents.
- Prices should look clean to the customer.

**Notes:** Until now, sales has added a 2% conversion fee for customers paying in euros.

## Clarifications (from the product owner)
- No conversion fee is added for any currency, including euros. The local price is the US dollar price times today's rate.
- Converted pound and euro prices are rounded to the nearest penny or cent, with no further tidying of the ending.
- Converted yen prices are rounded to the nearest whole yen, with no further tidying.
- When a converted price is tidied, it goes to the nearest tidy price, which may be slightly below the exact conversion.
