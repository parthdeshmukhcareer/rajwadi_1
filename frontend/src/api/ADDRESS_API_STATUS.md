# Address API Status

## Overview
Evaluated the backend for address management endpoints (`/api/v1/addresses`).

## Authentication Requirement
All endpoints in this module require `Authorization: Bearer <token>`.

## Endpoints

1. **Get Addresses**: `GET /api/v1/addresses`
   - Response: `{ success: true, data: [ { id, fullName, addressLine1, ... } ] }`

2. **Create Address**: `POST /api/v1/addresses`
   - Payload: `{ fullName, phone, addressLine1, addressLine2?, landmark?, city, district?, state, postalCode, country?, addressType?, isDefault? }`
   - Response: `{ success: true, data: { id, ... } }`

3. **Update Address**: `PATCH /api/v1/addresses/:id`
   - Payload: Partial of create payload.
   - Response: `{ success: true, data: { id, ... } }`

4. **Delete Address**: `DELETE /api/v1/addresses/:id`
   - Response: `{ success: true, data: { message: 'Address deleted' } }`
