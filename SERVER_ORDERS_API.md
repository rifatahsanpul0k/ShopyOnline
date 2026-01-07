# Orders API Documentation

## Base URL
```
/api/v1/orders
```

## Authentication
All endpoints require authentication via JWT token in cookies or Authorization header.

---

## User Endpoints

### 1. Create Order
**POST** `/create`

Create a new order with items and shipping information.

**Request Body:**
```json
{
  "items": [
    {
      "id": "product-id",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 1,
      "image": "image-url"
    }
  ],
  "totalPrice": 99.99,
  "taxPrice": 9.99,
  "shippingPrice": 0,
  "shippingInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "pincode": "10001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": "uuid"
}
```

---

### 2. Get User's Orders
**GET** `/my-orders`

Get all orders for the authenticated user.

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order-id",
      "total": 99.99,
      "tax": 9.99,
      "shipping": 0,
      "status": "delivered",
      "date": "2026-01-15T10:00:00Z",
      "paid_at": "2026-01-15T10:00:00Z",
      "items": [
        {
          "id": "product-id",
          "name": "Product Name",
          "quantity": 1,
          "price": 99.99,
          "image": "image-url"
        }
      ],
      "shippingInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "pincode": "10001"
      }
    }
  ],
  "count": 1
}
```

---

### 3. Get Order by ID
**GET** `/:orderId`

Get a specific order by its ID (user can only view their own orders).

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order-id",
    "total": 99.99,
    "tax": 9.99,
    "shipping": 0,
    "status": "delivered",
    "date": "2026-01-15T10:00:00Z",
    "items": [...],
    "shippingInfo": {...},
    "payment_status": "Paid",
    "payment_type": "Online"
  }
}
```

---

### 4. Cancel Order
**PUT** `/:orderId/cancel`

Cancel an order (only if status is 'Processing').

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {...}
}
```

---

## Admin Endpoints

### 5. Get All Orders (Admin)
**GET** `/`

Get all orders in the system (Admin only).

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "count": 10
}
```

---

### 6. Update Order Status (Admin)
**PUT** `/:orderId/status`

Update the status of an order.

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**Valid Statuses:**
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {...}
}
```

---

### 7. Get Order Statistics (Admin)
**GET** `/stats/overview`

Get overview statistics for all orders.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_orders": 50,
    "total_revenue": "4999.50",
    "delivered_orders": 40,
    "processing_orders": 5,
    "shipped_orders": 3,
    "cancelled_orders": 2,
    "avg_order_value": "99.99"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

**Common Error Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Usage Examples

### JavaScript/React

```javascript
import { 
  createOrderAPI, 
  getUserOrdersAPI, 
  getOrderByIdAPI,
  cancelOrderAPI,
  updateOrderStatusAPI,
  getAllOrdersAPI,
  getOrderStatsAPI
} from "../services/ordersService.js";

// Create order
const createOrder = async () => {
  const response = await createOrderAPI(orderData);
  console.log(response.orderId);
};

// Get user's orders
const fetchOrders = async () => {
  const data = await getUserOrdersAPI();
  console.log(data.orders);
};

// Admin: Update order status
const updateStatus = async (orderId) => {
  await updateOrderStatusAPI(orderId, "Shipped");
};
```

---

## Database Schema

### orders table
- `id` - UUID primary key
- `buyer_id` - UUID (references users)
- `total_price` - Decimal
- `tax_price` - Decimal
- `shipping_price` - Decimal
- `order_status` - VARCHAR (Processing, Shipped, Delivered, Cancelled)
- `paid_at` - Timestamp
- `created_at` - Timestamp

### order_items table
- `id` - UUID primary key
- `order_id` - UUID (references orders)
- `product_id` - UUID (references products)
- `quantity` - Integer
- `price` - Decimal
- `image` - Text
- `title` - Text
- `created_at` - Timestamp

### shipping_info table
- `id` - UUID primary key
- `order_id` - UUID (references orders, unique)
- `full_name` - VARCHAR
- `state` - VARCHAR
- `city` - VARCHAR
- `country` - VARCHAR
- `address` - Text
- `pincode` - VARCHAR
- `phone` - VARCHAR

### payments table
- `id` - UUID primary key
- `order_id` - UUID (references orders, unique)
- `payment_type` - VARCHAR (Online)
- `payment_status` - VARCHAR (Paid, Pending, Failed)
- `payment_intent_id` - VARCHAR
- `created_at` - Timestamp
