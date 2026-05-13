// src/shared/components/NotificationMenu.jsx
import React from "react";
import { Bell, MessageCircle, Home, DollarSign, FileText, X } from "lucide-react";

const NotificationMenu = ({ onClose }) => {
    const notifications = [
        {
            id: 1,
            type: "message",
            icon: MessageCircle,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-100",
            title: "New message from tenant",
            description: "John Doe sent you a message about the Downtown apartment",
            time: "5 minutes ago",
            read: false
        },
        {
            id: 2,
            type: "property",
            icon: Home,
            iconColor: "text-green-500",
            bgColor: "bg-green-100",
            title: "Property view request",
            description: "Someone requested to view your property at 123 Main St",
            time: "1 hour ago",
            read: false
        },
        {
            id: 3,
            type: "payment",
            icon: DollarSign,
            iconColor: "text-yellow-500",
            bgColor: "bg-yellow-100",
            title: "Payment received",
            description: "Monthly rent payment of $1,500 has been received",
            time: "3 hours ago",
            read: true
        },
        {
            id: 4,
            type: "document",
            icon: FileText,
            iconColor: "text-purple-500",
            bgColor: "bg-purple-100",
            title: "Lease agreement signed",
            description: "Tenant has signed the lease agreement for Property #456",
            time: "Yesterday",
            read: true
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                                !notification.read ? "bg-blue-50/30" : ""
                            }`}
                        >
                            <div className={`${notification.bgColor} p-2 rounded-full`}>
                                <notification.icon className={`w-4 h-4 ${notification.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                        {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {notification.time}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                    {notification.description}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <button className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-1 transition-colors">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationMenu;