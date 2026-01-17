import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

// Create notification (internal use)
export const createNotification = async (type, title, message, relatedId = null, relatedType = null) => {
    try {
        const query = `
            INSERT INTO notifications (type, title, message, related_id, related_type, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *
        `;
        const result = await database.query(query, [type, title, message, relatedId, relatedType]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Get all notifications (10 most recent by default)
export const getAllNotifications = catchAsyncErrors(async (req, res, next) => {
    const { limit = 10, offset = 0, include_read = false } = req.query;

    try {
        let query = "SELECT * FROM notifications";
        const params = [];

        if (include_read === "false") {
            query += " WHERE is_read = FALSE";
        }

        query += " ORDER BY created_at DESC LIMIT $1 OFFSET $2";
        params.push(parseInt(limit), parseInt(offset));

        const result = await database.query(query, params);

        // Get total count
        let countQuery = "SELECT COUNT(*) as total FROM notifications";
        if (include_read === "false") {
            countQuery += " WHERE is_read = FALSE";
        }
        const countResult = await database.query(countQuery);

        res.status(200).json({
            success: true,
            notifications: result.rows,
            total: parseInt(countResult.rows[0].total),
            showing: result.rows.length,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch notifications", 500));
    }
});

// Mark notification as read
export const markNotificationAsRead = catchAsyncErrors(async (req, res, next) => {
    const { notificationId } = req.params;

    try {
        const query = "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *";
        const result = await database.query(query, [notificationId]);

        if (result.rows.length === 0) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification: result.rows[0],
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to update notification", 500));
    }
});

// Mark all notifications as read
export const markAllNotificationsAsRead = catchAsyncErrors(async (req, res, next) => {
    try {
        const query = "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE is_read = FALSE";
        await database.query(query);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to update notifications", 500));
    }
});

// Delete notification
export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
    const { notificationId } = req.params;

    try {
        const query = "DELETE FROM notifications WHERE id = $1 RETURNING *";
        const result = await database.query(query, [notificationId]);

        if (result.rows.length === 0) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to delete notification", 500));
    }
});

// Get unread notifications count
export const getUnreadCount = catchAsyncErrors(async (req, res, next) => {
    try {
        const query = "SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE";
        const result = await database.query(query);

        res.status(200).json({
            success: true,
            unreadCount: parseInt(result.rows[0].count),
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch unread count", 500));
    }
});
