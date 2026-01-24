import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

// Create notification (internal use)
export const createNotification = async (type, title, message, relatedId = null, relatedType = null, userId = null) => {
    try {
        const query = `
            INSERT INTO notifications (type, title, message, related_id, related_type, user_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
            RETURNING *
        `;
        const result = await database.query(query, [type, title, message, relatedId, relatedType, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Get all notifications (10 most recent by default)
export const getAllNotifications = catchAsyncErrors(async (req, res, next) => {
    const { limit = 10, offset = 0, include_read = false } = req.query;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    try {
        let query = "SELECT * FROM notifications";
        const params = [];
        const conditions = [];

        // Filter by user: admins see all notifications without user_id, users see only their own
        if (isAdmin) {
            conditions.push("user_id IS NULL");
        } else if (userId) {
            conditions.push("user_id = $" + (params.length + 1));
            params.push(userId);
        }

        if (include_read === "false") {
            conditions.push("is_read = FALSE");
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY created_at DESC LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
        params.push(parseInt(limit), parseInt(offset));

        const result = await database.query(query, params);

        // Get total count
        let countQuery = "SELECT COUNT(*) as total FROM notifications";
        const countParams = [];
        const countConditions = [];

        if (isAdmin) {
            countConditions.push("user_id IS NULL");
        } else if (userId) {
            countConditions.push("user_id = $1");
            countParams.push(userId);
        }

        if (include_read === "false") {
            countConditions.push("is_read = FALSE");
        }

        if (countConditions.length > 0) {
            countQuery += " WHERE " + countConditions.join(" AND ");
        }

        const countResult = await database.query(countQuery, countParams);

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
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    try {
        let query = "UPDATE notifications SET is_read = TRUE, updated_at = NOW() WHERE is_read = FALSE";
        const params = [];

        if (isAdmin) {
            query += " AND user_id IS NULL";
        } else if (userId) {
            query += " AND user_id = $1";
            params.push(userId);
        }

        await database.query(query, params);

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
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "Admin";

    try {
        let query = "SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE";
        const params = [];

        if (isAdmin) {
            query += " AND user_id IS NULL";
        } else if (userId) {
            query += " AND user_id = $1";
            params.push(userId);
        }

        const result = await database.query(query, params);

        res.status(200).json({
            success: true,
            unreadCount: parseInt(result.rows[0].count),
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch unread count", 500));
    }
});
