# MF-2002 Charge a late fee on an overdue invoice

**Type:** Story · **Team:** Billing · **Reporter:** Product (Invoicing)

Invoices are due 30 days after they are issued. Each night, billing checks open invoices and charges a late fee on any that are overdue. The late fee is 2% of the invoice. Customers can pay an invoice in parts.

Until now, accounting has charged half the fee when an invoice is less than a week overdue.

## Clarifications (from the product owner)
- While an invoice is less than 7 days (7 × 24 hours) past its due date, the late fee is half of the 2% fee (1% of the unpaid balance). From 7 days overdue on, it is the full 2%.
