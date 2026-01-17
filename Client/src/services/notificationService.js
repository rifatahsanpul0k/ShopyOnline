import axios from "../lib/axios";

// Get all notifications
export const fetchNotifications = async (limit = 10, offset = 0, includeRead = false) => {
    try {
        const response = await axios.get("/notifications", {
            params: {
                limit,
                offset,
                include_read: includeRead,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get unread count
export const fetchUnreadCount = async () => {
    try {
        const response = await axios.get("/notifications/unread/count");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
    try {
        const response = await axios.put(`/notifications/read/${notificationId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Mark all as read
export const markAllAsRead = async () => {
    try {
        const response = await axios.put("/notifications/read-all");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    try {
        const response = await axios.delete(`/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
