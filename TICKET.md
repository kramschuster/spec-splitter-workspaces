# MF-1844 Surcharge a card payment

**Type:** Story · **Team:** Payments · **Reporter:** Product (Checkout)

Credit cards can carry a surcharge of 3%. The goods are what the merchant sold. The surcharge is calculated on top and sent to the network with the authorization. Debit cards run through the same checkout. Prepaid cards are not on the surcharge list.

When a prepaid card is used, checkout has been authorizing half the goods as a hold. The written rule is that prepaid is not surcharged.

## Clarifications (from the product owner)
- Prepaid cards are authorized for the full goods amount with no surcharge; the existing half-goods hold is replaced.
