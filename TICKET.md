# MF-1608 Retry a declined charge

**Type:** Story · **Team:** Payments · **Reporter:** Product (Checkout)

A declined card payment can be tried again. The invoice keeps the amount and the processing fee. Soft declines are the ones the network says are worth another try. Hard declines are not.

Checkout stops after three tries. Support has been submitting one more attempt, for half the amount, when the customer calls.
