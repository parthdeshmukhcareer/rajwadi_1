# Checkout API Status

## Overview
Evaluated the backend for order checkout endpoints (`/api/v1/orders/checkout`) and cart preview (`/api/v1/cart/preview`).

## Authentication Requirement
Both endpoints require `Authorization: Bearer <token>`.

## Endpoints

1. **Preview Cart**: `POST /api/v1/cart/preview`
   - Payload: `{ couponCode?: string }`
   - Response: `{ success: true, data: { items: [], subtotal, discount, tax, shipping, grandTotal, couponInfo: { code, discountValue } } }`

2. **Checkout / Create Order**: `POST /api/v1/orders/checkout`
   - Payload: `{ addressId: string, couponCode?: string }`
   - Response: `{ success: true, data: { id, orderNumber, totalAmount, ... } }`
   - Errors:
     - `CART_EMPTY`: If the user has no items in the cart.
     - `OUT_OF_STOCK`: If requested quantity exceeds available inventory.
     - `INVALID_COUPON`: If coupon code is expired or invalid.
     - `ADDRESS_INVALID`: (Not explicitly seen, but UUID schema enforces valid ID)
