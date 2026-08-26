# Database Design

The application uses PostgreSQL (via Neon) managed by Drizzle ORM.

## Core Tables

- **`users`**: Customer and Admin accounts. Uses bcrypt for password hashing.
- **`refresh_tokens`**: Tracks JWT refresh tokens for secure session rotation.
- **`addresses`**: User shipping/billing addresses.

## Catalogue
- **`categories`**: Product categories.
- **`products`**: Core product information, SEO details, and base configurations.
- **`product_variants`**: Specific SKUs, pricing (current and compare-at), and inventory tracking (`stock_on_hand`, `reserved_stock`).
- **`product_images`**: Cloudinary URLs linked to products and optionally specific variants.

## Cart & Discounts
- **`carts`**: Active shopping cart linked to a user.
- **`cart_items`**: Quantities of specific `product_variants` added to a cart.
- **`coupons`**: Discount codes (PERCENTAGE or FIXED) with limits and expiry dates.

## Checkout & Payments
- **`orders`**: Historical snapshot of a user's purchase, tracking shipping addresses, total amounts, applied discounts, and statuses (`PENDING_PAYMENT`, `CONFIRMED`, `EXPIRED`, etc.).
- **`order_items`**: The specific variants and locked-in prices at the time of purchase.
- **`payments`**: Final successful payments confirming Razorpay Order IDs and Payment IDs.
- **`payment_attempts`**: Audit log of Razorpay interactions.
- **`webhook_events`**: Idempotency log ensuring exactly-once processing for Razorpay webhooks.
