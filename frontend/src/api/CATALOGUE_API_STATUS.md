# Customer Catalogue API Status

## Overview
Evaluated the backend for existing public endpoints to fetch categories and products.

## Endpoints

1. **Categories**
   - **List Categories**: `GET /api/v1/categories`
     - Method: `GET`
     - Query Params: None
     - Response: `{ success: true, data: [...] }`
     - Note: Returns categories with active status, including nested parent/child relationships if applicable.

2. **Products**
   - **List Products**: `GET /api/v1/products`
     - Method: `GET`
     - Query Params:
       - `page` (default: 1)
       - `limit` (default: 24, max: 100)
       - `search` (string)
       - `category` (slug string)
       - `size` (string)
       - `color` (string)
       - `minPrice` (number)
       - `maxPrice` (number)
       - `featured` (boolean)
       - `occasion` (string)
       - `fabric` (string)
       - `sort` (e.g. `price-low`, `price-high`, `rating`)
     - Response: `{ success: true, data: [...], pagination: { ... } }`

   - **Get Product by Slug**: `GET /api/v1/products/:slug`
     - Method: `GET`
     - Response: `{ success: true, data: { ...product, category, variants, images } }`

## Authorization
No authorization is required for these public endpoints.
