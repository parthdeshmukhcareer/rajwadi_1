# Coupons & Reviews API Status

## Overview
Evaluated the backend for existing administrative endpoints to manage coupons and moderate reviews. 

## Endpoints

1. **Coupons**
   - **List Coupons**: `GET /api/v1/admin/coupons`
   - **Create Coupon**: `POST /api/v1/admin/coupons`
   - **Update Coupon**: `PATCH /api/v1/admin/coupons/:id`
   - **Update Status**: `PATCH /api/v1/admin/coupons/:id/status`
   - **Validation Rules (Enforced by Backend)**:
     - `code` must be uppercase.
     - `discountValue` >= 0. If `PERCENTAGE`, must be <= 100.
     - Limits (minimum order, max discount, usage) must be >= 0.

2. **Reviews**
   - **List Reviews**: `GET /api/v1/admin/reviews`
   - **Update Status**: `PATCH /api/v1/admin/reviews/:id/status` (Payload: `{ status: 'PUBLISHED' | 'HIDDEN' }`)
   - *(Note: Enhanced internally to join `users` and `products` directly from the database to support the frontend requirements).*

## Authorization
All endpoints require a valid JWT with the `ADMIN` role.
