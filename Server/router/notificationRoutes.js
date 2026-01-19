import express from "express";
import {
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount,
} from "../controllers/notificationController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all notifications
router.get("/", isAuthenticated, getAllNotifications);

// Get unread count
router.get("/unread/count", isAuthenticated, getUnreadCount);

// Mark notification as read
router.put("/read/:notificationId", isAuthenticated, markNotificationAsRead);

// Mark all as read
router.put("/read-all", isAuthenticated, markAllNotificationsAsRead);

// Delete notification
router.delete("/:notificationId", isAuthenticated, deleteNotification);

export default router;
