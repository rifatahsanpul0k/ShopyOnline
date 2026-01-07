import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderStats,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/ordersController.js";
import { isAuthenticated, authorizedRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getUserOrders);
router.get("/:orderId", isAuthenticated, getOrderById);
router.put("/:orderId/cancel", isAuthenticated, cancelOrder);

// Admin routes
router.get("/", isAuthenticated, authorizedRoles("Admin"), getAllOrders);
router.put("/:orderId/status", isAuthenticated, authorizedRoles("Admin"), updateOrderStatus);
router.get("/stats/overview", isAuthenticated, authorizedRoles("Admin"), getOrderStats);

export default router;
