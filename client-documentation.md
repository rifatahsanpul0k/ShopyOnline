
# Client Architecture Documentation

## Overview
The client application is built with **React**, **Redux Toolkit**, and **Tailwind CSS**. It follows a feature-based folder structure, enforcing separation of concerns between UI components, global state management, and API services.

### Tech Stack
-   **Frontend Framework**: React (Vite)
-   **State Management**: Redux Toolkit (Global State) + Context API (Theme)
-   **Routing**: React Router DOM (v6)
-   **Styling**: Tailwind CSS + Pure CSS
-   **HTTP Client**: Axios
-   **Payment**: Stripe (React Stripe.js)

---

## 1. Project Structure (`Client/src`)

| Directory | Purpose |
| :--- | :--- |
| **`components/`** | Reusable UI components (Layout, UI primitives, Protected Routes). |
| **`pages/`** | Route components representing full views (e.g., `Home`, `ProductDetail`). |
| **`store/`** | Redux setup. Contains `store.js` and `slices/` directory. |
| **`services/`** | centralized API service functions (mainly for Orders & Payments). |
| **`lib/`** | Configuration files (e.g., `axios.js` instance). |
| **`App.jsx`** | Main entry point defining Routes and global providers. |

---

## 2. Redux State Management (`src/store`)

The application uses Redux Toolkit to manage global state. The store is configured in `store.js` and combines the following slices:

### **Auth Slice (`slices/authSlice.js`)**
Handles user authentication and session management.
-   **State**: `user` object, `isLoggingIn`, `isSigningUp`, authentication status.
-   **Actions**: `registerUser`, `loginUser`, `logoutUser`, `getUser`, `updateProfile`.
-   **Mechanism**: Uses `createAsyncThunk` to call API endpoints directly. On success, updates the store and stores JWT in `localStorage` (via thunk logic or component side-effects).

### **Product Slice (`slices/productSlice.js`)**
Manages product data fetching and interactions.
-   **State**: `products` list, `productDetails` (single product), `loading`, `error`, `productReviews`.
-   **Actions**: `fetchAllProducts`, `fetchSingleProduct`, `postReview`, `deleteReview`.
-   **Mechanism**: Fetches data from backend and normalizes it for UI consumption. Handles loading states for better UX.

### **Cart Slice (`slices/cartSlice.js`)**
Manages the shopping cart locally.
-   **State**: `cart` array (list of items with quantity).
-   **Actions**: `addToCart`, `removeFromCart`, `updateCartItemQuantity`, `clearCart`.
-   **Mechanism**: **Synchronous**. Persists cart data to `localStorage` immediately upon any change, ensuring cart data survives page reloads without backend calls until checkout.

### **orderSlice (`slices/orderSlice.js`)**
*Currently minimal.*
-   **State**: `myOrders`, `fetchingOrders`.
-   **Role**: Mostly acts as a placeholder or for potential future caching of order history. Most order logic currently resides in component local state or direct service calls.

### **Popup Slice (`slices/popupSlice.js`)**
Manages global UI overlays.
-   **State**: `isAuthPopupOpen`, `isCartOpen`, `isSidebarOpen`.
-   **Actions**: `toggleAuthPopup`, `toggleCart`, etc.
-   **Role**: Controls visibility of modals and sidebars to avoid prop drilling.

---

## 3. API Integration & Services

### **Axios Configuration (`lib/axios.js`)**
A centralized Axios instance is used for all HTTP requests.
-   **Base URL**: Configured via environment variables (proxies to `localhost:4000` in dev).
-   **Request Interceptor**: Automatically attaches the `Authorization: Bearer <token>` header if a token exists in `localStorage`.
-   **Response Interceptor**: Global error handling. Catches 401 (Unauthorized) to trigger logout/redirect and displays toast notifications for errors.

### **Service Pattern vs Thunks**
The application uses a hybrid approach:
1.  **Thunks (Auth/Products)**: API calls are defined *inside* `createAsyncThunk` in the slices (e.g., `authSlice.js`, `productSlice.js`).
2.  **Services (Orders/Payments)**: API calls are defined as standalone functions in `services/` (e.g., `ordersService.js`, `paymentService.js`) and called directly by components or thunks.

---

## 4. Key Workflows

### **A. User Authentication**
1.  **Entry**: User clicks "Login" or "Register".
2.  **Action**: `loginUser` or `registerUser` thunk is dispatched with form data.
3.  **API**: `POST /auth/login` or `POST /auth/register`.
4.  **Success**:
    -   Backend returns `token` and `user` data.
    -   Redux updates `state.auth.user`.
    -   Token saved to `localStorage`.
    -   `axios` interceptor picks up token for subsequent requests.

### **B. Shopping Cart**
1.  **Add**: User clicks "Add to Cart" on a product.
    -   Dispatches `addToCart` action.
    -   Updates Redux state and writes to `localStorage`.
2.  **View**: `Cart` page reads from Redux state.
3.  **Persist**: On App reload, `cartSlice` initializes state by reading `localStorage`.

### **C. Checkout & Order Placement**
This is a multi-step process handled in `Checkout.jsx` and `Payment.jsx`.

1.  **Step 1: Shipping & Billing** (`Checkout.jsx`)
    -   User fills address forms.
    -   Local state manages form inputs.
2.  **Step 2: Create Order**
    -   User clicks "Proceed to Payment".
    -   `createOrderAPI` (from `ordersService`) is called with cart items and shipping info.
    -   **Backend**: Creates "Pending" order in DB. Returns `orderId`.
3.  **Step 3: Payment** (`Payment.jsx`)
    -   User is redirected to `/payment` with `orderId`.
    -   Component calls `createPaymentIntentAPI` (Stripe) with `orderId`.
    -   **Stripe**: Returns `clientSecret`.
    -   User enters card details via `React Stripe.js` elements.
4.  **Step 4: Confirmation**
    -   On Stripe success, `updatePaymentStatusAPI` is called to mark order as "Paid".
    -   User redirected to `/payment/success`.
    -   Cart is cleared via `clearCart`.

### **D. Product Management (Admin)**
*Note: Admin routes are protected and use a different layout (`AdminLayout`).*
1.  **View**: Admin dashboard fetches stats.
2.  **Edit**: Admin products page allows CRUD operations on products.

---

## 5. Security Features
-   **Protected Routes**: `UserProtectedRoute` checks for `authUser` in Redux. If null, redirects to Login.
-   **Token Handling**: JWT tokens are stored in `localStorage` but handled via centralized interceptors to ensure consistent usage.
-   **Payment Security**: Payment details are never stored on the server. Stripe logic handles PCI compliance on the frontend.
