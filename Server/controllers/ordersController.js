import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Create Order
export const createOrder = catchAsyncErrors(async (req, res, next) => {
  const { items, totalPrice, taxPrice, shippingPrice, shippingInfo } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!items || items.length === 0) {
    return next(new ErrorHandler("Please add items to your order", 400));
  }

  if (!totalPrice || !shippingInfo) {
    return next(new ErrorHandler("Please provide all required information", 400));
  }

  try {
    // Start transaction
    const client = await database.getClient?.() || database;

    // Create order
    const orderResult = await database.query(
      `INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price, order_status, paid_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, totalPrice, taxPrice || 0, shippingPrice || 0, "Processing"]
    );

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      await database.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.quantity, item.price, item.image, item.name]
      );
    }

    // Add shipping info
    const { fullName, state, city, country, address, pincode, phone } = shippingInfo;
    await database.query(
      `INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [orderId, fullName, state, city, country, address, pincode, phone]
    );

    // Create payment record
    await database.query(
      `INSERT INTO payments (order_id, payment_type, payment_status)
       VALUES ($1, $2, $3)`,
      [orderId, "Online", "Paid"]
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get All Orders for a User
export const getUserOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Get all orders for the user with related data
    const ordersResult = await database.query(
      `SELECT 
        o.id,
        o.total_price as total,
        o.tax_price as tax,
        o.shipping_price as shipping,
        o.order_status as status,
        o.created_at as date,
        o.paid_at,
        json_agg(
          json_build_object(
            'id', oi.product_id,
            'name', oi.title,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image
          )
        ) as items,
        json_build_object(
          'fullName', si.full_name,
          'email', u.email,
          'phone', si.phone,
          'address', si.address,
          'city', si.city,
          'state', si.state,
          'country', si.country,
          'pincode', si.pincode
        ) as shippingInfo
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN shipping_info si ON o.id = si.order_id
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.buyer_id = $1
       GROUP BY o.id, o.total_price, o.tax_price, o.shipping_price, o.order_status, o.created_at, o.paid_at, si.full_name, si.phone, si.address, si.city, si.state, si.country, si.pincode, u.email
       ORDER BY o.created_at DESC`,
      [userId]
    );

    if (ordersResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      orders: ordersResult.rows,
      count: ordersResult.rows.length,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Single Order
export const getOrderById = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const orderResult = await database.query(
      `SELECT 
        o.id,
        o.total_price as total,
        o.tax_price as tax,
        o.shipping_price as shipping,
        o.order_status as status,
        o.created_at as date,
        o.paid_at,
        json_agg(
          json_build_object(
            'id', oi.product_id,
            'name', oi.title,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image
          )
        ) as items,
        json_build_object(
          'fullName', si.full_name,
          'email', u.email,
          'phone', si.phone,
          'address', si.address,
          'city', si.city,
          'state', si.state,
          'country', si.country,
          'pincode', si.pincode
        ) as shippingInfo,
        p.payment_status,
        p.payment_type
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN shipping_info si ON o.id = si.order_id
       LEFT JOIN payments p ON o.id = p.order_id
       LEFT JOIN users u ON o.buyer_id = u.id
       WHERE o.id = $1 AND o.buyer_id = $2
       GROUP BY o.id, o.total_price, o.tax_price, o.shipping_price, o.order_status, o.created_at, o.paid_at, si.full_name, si.phone, si.address, si.city, si.state, si.country, si.pincode, u.email, p.payment_status, p.payment_type`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order: orderResult.rows[0],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update Order Status (Admin only)
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return next(
      new ErrorHandler(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400
      )
    );
  }

  try {
    const result = await database.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Cancel Order
export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    // Check if order belongs to user
    const orderCheck = await database.query(
      `SELECT * FROM orders WHERE id = $1 AND buyer_id = $2`,
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      return next(new ErrorHandler("Order not found or unauthorized", 404));
    }

    const order = orderCheck.rows[0];

    // Can only cancel if not shipped or delivered
    if (
      order.order_status === "Shipped" ||
      order.order_status === "Delivered" ||
      order.order_status === "Cancelled"
    ) {
      return next(
        new ErrorHandler(
          `Cannot cancel order with status: ${order.order_status}`,
          400
        )
      );
    }

    const result = await database.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *`,
      ["Cancelled", orderId]
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: result.rows[0],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get All Orders (Admin only)
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const ordersResult = await database.query(
      `SELECT 
        o.id,
        o.buyer_id,
        o.total_price as total,
        o.tax_price as tax,
        o.shipping_price as shipping,
        o.order_status as status,
        o.created_at as date,
        o.paid_at,
        u.name as buyer_name,
        u.email as buyer_email,
        json_agg(
          json_build_object(
            'name', oi.title,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN users u ON o.buyer_id = u.id
       GROUP BY o.id, o.buyer_id, o.total_price, o.tax_price, o.shipping_price, o.order_status, o.created_at, o.paid_at, u.name, u.email
       ORDER BY o.created_at DESC`
    );

    res.status(200).json({
      success: true,
      orders: ordersResult.rows,
      count: ordersResult.rows.length,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Order Statistics (Admin only)
export const getOrderStats = catchAsyncErrors(async (req, res, next) => {
  try {
    const statsResult = await database.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_price) as total_revenue,
        COUNT(CASE WHEN order_status = 'Delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN order_status = 'Processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN order_status = 'Shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN order_status = 'Cancelled' THEN 1 END) as cancelled_orders,
        AVG(total_price) as avg_order_value
       FROM orders`
    );

    res.status(200).json({
      success: true,
      stats: statsResult.rows[0],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
