
# Authentication Workflows

This document details the complete end-to-end workflow for User Registration and Login.

## 1. User Registration Flow

### A. Frontend (Client)
1.  **User Action**: User navigates to `/auth/register` and fills in Name, Email, Password, and Confirm Password.
2.  **Validation**: `Register.jsx` checks:
    -   Passwords match.
    -   Password length (8-16 characters).
3.  **Dispatch**: Calls `registerUser` thunk (in `authSlice.js`).
    -   **API Call**: `POST /auth/register` with `{ name, email, password }`.

### B. Backend (Server)
1.  **Endpoint**: `/api/v1/auth/register` hits `authController.register`.
2.  **Validation**:
    -   Checks for missing fields.
    -   Verifies password length (8-16 chars).
    -   **DB Check**: Queries `SELECT * FROM users WHERE email = $1`. If exists, returns 400 error.
3.  **Processing**:
    -   Hashes password using `bcrypt.hash(password, 10)`.
    -   **DB Insert**: `INSERT INTO users (name, email, password) ... RETURNING *`.
    -   **Notification**: Creates a "User Registered" notification in `notifications` table.
4.  **Response**:
    -   Generates JWT Token.
    -   Sets `token` cookie (HTTPOnly).
    -   Returns 201 Created with JSON `{ success: true, user: {...}, token }`.

### C. Completion (Client)
1.  **Success**: Redux store is updated (signup state).
2.  **Navigation**: User is redirected to `/auth/login`.

---

## 2. User Login Flow

### A. Frontend (Client)
1.  **User Action**: User navigates to `/auth/login`, enters Email and Password.
2.  **Dispatch**: Calls `loginUser` thunk (in `authSlice.js`).
    -   **API Call**: `POST /auth/login` with `{ email, password }`.

### B. Backend (Server)
1.  **Endpoint**: `/api/v1/auth/login` hits `authController.login`.
2.  **Validation**: Checks if email and password are provided.
3.  **Authentication**:
    -   **DB Query**: `SELECT * FROM users WHERE email = $1`.
    -   If user not found -> Return 401.
    -   **Password Verification**: `bcrypt.compare(password, user.password)`.
    -   If mismatch -> Return 401.
4.  **Response**:
    -   Generates JWT Token.
    -   Sets `token` cookie (HTTPOnly).
    -   Returns 200 OK with JSON `{ success: true, user: {...}, token }`.

### C. Completion (Client)
1.  **Success**:
    -   Redux updates `state.auth.user`.
    -   Token is saved to `localStorage` (for Axios interceptor usage).
2.  **Navigation**:
    -   **Admin**: Redirects to `/admin/dashboard`.
    -   **User**: Redirects to `redirect` param (if present) or Home `/`.

---

## 3. Persistent Session (Auto-Login)

### A. App Init
1.  **Action**: `App.jsx` runs `useEffect` on mount.
2.  **Check**: Looks for `token` in `localStorage`.
3.  **Dispatch**:
    -   If token exists: Dispatches `getUser` thunk.
    -   If no token: Dispatches `checkAuth` (sets loading to false).

### B. Backend Verification
1.  **Endpoint**: `/api/v1/auth/me` hits `authController.getUser`.
2.  **Middleware**: `isAuthenticated` checks for valid JWT in cookies/headers.
3.  **Response**: Returns current user data.
