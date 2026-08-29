# Order Management API Status

## Overview
The Admin Orders API manages order lifecycles and handles secure status transitions. It relies on the core database transaction schemas to ensure stock integrity and payment consistency.

## Endpoints

1. **List Orders**
   - **Endpoint**: `GET /api/v1/admin/orders`
   - **Method**: `GET`
   - **Query Params**: `page`, `limit`, `search` (orderNumber)
   - **Response Shape**: `{ success: true, data: [ ...orderRecords ] }`
   - **Authorization**: Requires valid JWT + `ADMIN` role.

2. **Get Order Details**
   - **Endpoint**: `GET /api/v1/admin/orders/:id`
   - **Method**: `GET`
   - **Response Shape**: `{ success: true, data: { ...orderRecord, items: [ ...orderItems ], user: { ...userRecord } } }`
   - *(Note: Enhanced internally to join items and user data for the detail page without inventing a new endpoint).*
   - **Authorization**: Requires valid JWT + `ADMIN` role.

3. **Update Order Status**
   - **Endpoint**: `PATCH /api/v1/admin/orders/:id/status`
   - **Method**: `PATCH`
   - **Payload**: `{ status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED', shippingCarrier?, trackingNumber?, trackingUrl? }`
   - **Backend Workflow Rules**:
     - `CONFIRMED` -> `PROCESSING`
     - `PROCESSING` -> `SHIPPED` (Requires `shippingCarrier` and `trackingNumber`)
     - `SHIPPED` -> `DELIVERED`
   - **Authorization**: Requires valid JWT + `ADMIN` role.

4. **Cancel Order**
   - **Endpoint**: *(Delegated to existing Refunds/Payments API flow or handled via specific cancellation routes. The current `admin.orders.routes.js` does not have a distinct DELETE or PATCH /cancel. We will leave cancellation explicitly disabled if the backend does not expose it natively via `admin.orders.routes.js`, or wire it to the refund API later as requested "Do not start payments/refunds integration".)*
