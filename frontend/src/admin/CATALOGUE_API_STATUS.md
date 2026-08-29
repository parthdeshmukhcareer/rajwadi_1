# Catalogue Management API Status

## Categories
All category endpoints are protected by `ADMIN` role requirement and JWT.

1. **Get All Categories**
   - **Endpoint**: `GET /api/v1/admin/categories`
   - **Response**: `{ success: true, data: [...] }`
2. **Create Category**
   - **Endpoint**: `POST /api/v1/admin/categories`
   - **Body**: `{ name, slug, description, imageUrl, isActive, sortOrder }`
   - **Response**: `{ success: true, data: { ... } }`
3. **Update Category**
   - **Endpoint**: `PATCH /api/v1/admin/categories/:id`
   - **Body**: Partial updates (any field from Create schema)
4. **Update Category Status**
   - **Endpoint**: `PATCH /api/v1/admin/categories/:id/status`
   - **Body**: `{ isActive: boolean }`

## Products
All product endpoints are protected by `ADMIN` role requirement and JWT.

1. **Get All Products**
   - **Endpoint**: `GET /api/v1/admin/products`
   - **Response**: `{ success: true, data: [...] }`
2. **Create Product**
   - **Endpoint**: `POST /api/v1/admin/products`
   - **Body**: `{ categoryId, name, slug, basePrice, compareAtPrice, fabric, workType, occasion, hsnCode, gstRate, description }` (plus optional fields)
3. **Update Product**
   - **Endpoint**: `PATCH /api/v1/admin/products/:id`
4. **Update Product Status**
   - **Endpoint**: `PATCH /api/v1/admin/products/:id/status`
   - **Body**: `{ isActive: boolean }`

## Product Variants
1. **Create Variant**
   - **Endpoint**: `POST /api/v1/admin/products/:productId/variants`
   - **Body**: `{ sku, size, color, price, compareAtPrice, stockOnHand, isActive }`

*Note: Since Product and Variant creation are separate endpoints in the backend, the frontend service `createProduct(data)` will need to orchestrate two API calls if variants are included in the form.*
