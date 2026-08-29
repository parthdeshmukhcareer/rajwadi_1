# Admin API Status & Authentication Flow

## Authentication Architecture

The Rajwadi backend utilizes Fastify with standard JWT-based authentication.

### Endpoints
- **Login**: `POST /auth/login` - Requires `email` and `password`. Returns JWT tokens and user info.
- **Refresh**: `POST /auth/refresh` - Used to obtain a new access token when the current one expires.
- **Logout**: `POST /auth/logout` - Invalidates the current session.
- **Me**: `GET /auth/me` - Retrieves the authenticated user's details.

### Admin Authorization
Admin endpoints are protected by the `requireAdmin` middleware (`backend/src/middleware/admin.middleware.js`).
1. **JWT Claim Check**: The JWT payload is checked for `role === 'ADMIN'`.
2. **Database Verification**: The user is verified against the database to ensure they are active (`isActive`) and still hold the `'ADMIN'` role.

If the user fails any check, the backend throws a `403 FORBIDDEN` error.

## Frontend Admin Authentication Flow
1. **Login Page**: An admin user visits `/admin/login` and submits credentials.
2. **Authentication**: The frontend calls `POST /auth/login`. 
3. **Role Validation**: If the login is successful, the frontend checks if the user's role is `'ADMIN'`. If not, access is denied and the token is discarded (or a generic error is shown).
4. **Session persistence**: The admin session is maintained via HTTP-only cookies (if configured by backend) or via memory/interceptor refresh token flow, avoiding `localStorage` for tokens as per security requirements.
5. **Route Protection**: `AdminProtectedRoute.jsx` wraps all `/admin/*` routes (except `/admin/login`). It checks the `AdminAuthContext` for an authenticated admin session and redirects to `/admin/login` if unauthorized.
