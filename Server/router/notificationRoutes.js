import express from "express";
import {
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get all notifications
router.get("/", getAllNotifications);

// Get unread count
router.get("/unread/count", getUnreadCount);

// Mark notification as read
router.put("/read/:notificationId", markNotificationAsRead);

// Mark all as read
router.put("/read-all", markAllNotificationsAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

export default router;
