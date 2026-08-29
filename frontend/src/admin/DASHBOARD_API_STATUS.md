# Dashboard API Status

## Findings

After inspecting `backend/src/modules/admin/`, there is **no dedicated dashboard or analytics endpoint** (e.g., `/admin/dashboard/stats`).

The available minimum existing APIs that can provide data for the Dashboard are:

1. **Recent Orders**
   - **Endpoint**: `GET /api/v1/admin/orders?limit=10`
   - **Method**: `GET`
   - **Response Shape**: `{ success: true, data: [ { id, orderNumber, totalAmount, status, paymentStatus, createdAt, ... } ] }`
   - **Authentication**: Requires valid JWT + `ADMIN` role.

2. **Total Products**
   - **Endpoint**: `GET /api/v1/admin/products`
   - **Method**: `GET`
   - **Response Shape**: `{ success: true, data: { data: [...], pagination: { total } } }` (Assuming standard pagination shape, or just an array if not paginated).
   - **Authentication**: Requires valid JWT + `ADMIN` role.

Since we cannot create fake backend APIs, we will use `GET /api/v1/admin/orders` to populate the Recent Orders table. For the summary stats (Revenue, Customers), since there are no aggregate endpoints, we can either fetch a larger limit of orders to calculate a rough total or just leave them as structural placeholders (0 or 'N/A') until the backend implements an analytics endpoint.
