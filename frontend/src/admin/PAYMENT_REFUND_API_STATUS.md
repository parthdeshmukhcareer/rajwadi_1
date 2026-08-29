# Payments & Refunds API Status

## Overview
Evaluated the backend for existing administrative endpoints to manage payments and refunds. The `refunds` module is robust, but there are currently no exposed endpoints to list or view distinct `payments`.

## Endpoints

1. **Payments**
   - **List Payments**: ❌ *Not Found* (No backend endpoint exists).
   - **Payment Details**: ❌ *Not Found*.
   - *(Note: Per instructions "Do not invent APIs", we did not create new endpoints. The frontend service throws an explicit error indicating the missing API.)*

2. **Refunds**
   - **List Refunds**: `GET /api/v1/admin/refunds`
   - **Refund Details**: `GET /api/v1/admin/refunds/:id`
   - **Initiate Refund**: `POST /api/v1/admin/refunds/orders/:orderId/cancel-refund`
     - *(Note: Handles order cancellation and refund initiation in one transactional step. Ensures order was `PAID`, verifies Razorpay captured amounts, restores stock, and utilizes idempotency keys to prevent double-refunds).*
   - **Authorization**: Requires valid JWT + `ADMIN` role.
