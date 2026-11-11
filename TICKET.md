# MF-1880 Marketplace platform fee

**Type:** Story · **Team:** Payments · **Reporter:** Product (Platform)

A marketplace charge pays the seller and keeps ModFin's fee. The fee is 10% plus $0.30. The buyer can also pay shipping, which is passed to the carrier.

The fee applies to a sale. An authorization that has not settled is not a settled sale, except that finance has been accruing the fee at authorization. A refund claws the fee back; the desk has been returning half of it.

## Clarifications (from the product owner)
- The full platform fee (10% of goods plus $0.30) is taken when a sale is authorized, whether or not it has settled.
- A refund returns the full platform fee (10% of the refunded goods plus $0.30) to the seller, not half.
- A refund's fee return is worked out from the refunded goods alone and is not limited by the fees previously collected from the seller.
