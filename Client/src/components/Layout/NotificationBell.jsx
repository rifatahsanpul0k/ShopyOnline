import React, { useState, useEffect } from "react";
import { Bell, X, CheckCheck, Trash2, Eye } from "lucide-react";
import {
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../../services/notificationService";
import { formatDate } from "../../utils/formatters";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const limit = showAll ? 100 : 10;
            // Include both read and unread notifications
            const data = await fetchNotifications(limit, 0, true);
            setNotifications(data.notifications || []);

            // Fetch unread count
            const countData = await fetchUnreadCount();
            setUnreadCount(countData.unreadCount || 0);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            loadNotifications();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            loadNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            loadNotifications();
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "user_registration":
                return "👤";
            case "payment_placed":
                return "💳";
            default:
                return "📢";
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "user_registration":
                return "bg-blue-50 border-l-4 border-blue-500";
            case "payment_placed":
                return "bg-green-50 border-l-4 border-green-500";
            default:
                return "bg-gray-50 border-l-4 border-gray-500";
        }
    };

    const displayedNotifications = showAll ? notifications : notifications.slice(0, 10);

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowPanel(!showPanel)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
            >
                <Bell size={24} className="text-black" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {showPanel && (
                <div className="fixed md:absolute md:right-0 md:top-12 left-0 right-0 md:left-auto md:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-[500px] flex flex-col animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                        <div>
                            <h3 className="font-black text-lg text-black">Notifications</h3>
                            <p className="text-xs text-gray-500 font-medium">{unreadCount} unread</p>
                        </div>
                        <button
                            onClick={() => setShowPanel(false)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : displayedNotifications.length > 0 ? (
                            <div className="space-y-1 p-2">
                                {displayedNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 rounded-xl transition-all ${getNotificationColor(notification.type)} ${!notification.is_read ? "font-medium" : "opacity-70"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-black truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-2">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Eye size={14} className="text-blue-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} className="text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-center">
                                <Bell className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-sm font-bold text-gray-600">No notifications</p>
                                <p className="text-xs text-gray-400">You're all caught up!</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex-1 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Mark All Read
                            </button>
                        )}
                        {notifications.length > 10 && !showAll && (
                            <button
                                onClick={() => {
                                    setShowAll(true);
                                    loadNotifications();
                                }}
                                className="flex-1 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                View All
                            </button>
                        )}
                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="flex-1 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Show Recent
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
