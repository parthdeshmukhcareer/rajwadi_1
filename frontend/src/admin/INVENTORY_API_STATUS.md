# Inventory Management API Status

## Overview
Inventory in Rajwadi is managed at the **Variant** level, not the Product level. Each product has one or more variants, and each variant maintains its own `stockOnHand` and `reservedStock`.

## Endpoints

1. **Get Inventory (Products with Variants)**
   - **Endpoint**: `GET /api/v1/admin/products`
   - **Method**: `GET`
   - **Response Structure**: `{ success: true, data: [ { id, name, ..., variants: [ { id, sku, size, color, stockOnHand, reservedStock, ... } ] } ] }`
   - **Authorization**: Requires valid JWT with `ADMIN` role.

2. **Update Variant Stock**
   - **Endpoint**: `PATCH /api/v1/admin/products/variants/:id/stock`
   - **Method**: `PATCH`
   - **Payload**: `{ stockOnHand: number }`
   - **Response Structure**: `{ success: true, data: { id, stockOnHand, reservedStock, ... } }`
   - **Authorization**: Requires valid JWT with `ADMIN` role.

*Note: The backend enforces `stockOnHand >= 0` and `reservedStock <= stockOnHand` natively in the PostgreSQL schema via Drizzle ORM checks.*
