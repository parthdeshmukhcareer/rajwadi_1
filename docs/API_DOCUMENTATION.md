# API Documentation

Base URL: `http://localhost:4000/api/v1`

## Authentication
- `POST /auth/register` - Register a new customer
- `POST /auth/login` - Login and receive JWT pair
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate session

## Catalogue
- `GET /categories` - List categories
- `GET /products` - List active products with variants
- `GET /products/:id` - Fetch single product

## Cart
- `GET /cart` - Retrieve user's cart
- `POST /cart/items` - Add a variant to cart
- `PATCH /cart/items/:id` - Update quantity
- `DELETE /cart/items/:id` - Remove item
- `DELETE /cart` - Clear cart
- `POST /cart/preview` - Preview cart totals with optional coupon code

## Orders & Checkout
- `POST /orders/checkout` - Convert cart to a `PENDING_PAYMENT` order, reserving inventory.
- `POST /orders/:orderNumber/payment` - Generate Razorpay Order ID.

## Payments
- `POST /payments/verify` - Verify frontend Razorpay capture and convert order to `PAID`.
- `POST /webhooks/razorpay` - Razorpay server-to-server webhook endpoint for robust capture.
