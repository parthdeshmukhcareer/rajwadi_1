# Cart System API Status

## Overview
Evaluated the backend for cart management endpoints (`/api/v1/cart`).

## Authentication Requirement
All endpoints in this module require `Authorization: Bearer <token>`.
If no token is provided or the token is invalid, the API returns a 401 error.

## Endpoints

1. **Get Cart**: `GET /api/v1/cart`
   - Response: `{ success: true, data: { cartId, userId, items: [...], totalValue } }`

2. **Add Item to Cart**: `POST /api/v1/cart/items`
   - Payload: `{ variantId: string(uuid), quantity: number }`
   - Response: `{ success: true, data: { cartId, ... } }`

3. **Update Item Quantity**: `PATCH /api/v1/cart/items/:id`
   - Payload: `{ quantity: number }`
   - Response: `{ success: true, data: { cartId, ... } }`

4. **Delete Cart Item**: `DELETE /api/v1/cart/items/:id`
   - Response: `{ success: true, data: { message: 'Item removed' } }`

5. **Clear Cart**: `DELETE /api/v1/cart`
   - Response: `{ success: true, data: { message: 'Cart cleared' } }`

6. **Preview Cart with Coupon**: `POST /api/v1/cart/preview`
   - Payload: `{ couponCode: string }`
   - Response: `{ success: true, data: { subtotal, discount, total, couponStatus } }`
