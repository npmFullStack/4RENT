// src/shared/components/ProfileMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { CircleUser, Settings, LogOut, Circle, Mail, Shield } from "lucide-react";
import avatar from "@/assets/images/avatar.svg";

const ProfileMenu = ({ onClose, onLogout }) => {
    // Mock user data - replace with actual user data from your auth context
    const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: avatar,
        isOnline: true
    };

    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* User Info Section */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={user.avatar}
                            alt={fullName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                        />
                        {/* Online Status Indicator */}
                        {user.isOnline && (
                            <div className="absolute bottom-0 right-0">
                                <div className="relative">
                                    <Circle className="w-4 h-4 text-white fill-current absolute" />
                                    <Circle className="w-4 h-4 text-green-500 fill-current animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                            {fullName}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500 truncate">
                                {user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                {/* Profile Link */}
                <Link
                    to="/dashboard/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                    <CircleUser className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">Profile</span>
                </Link>

                {/* Settings Link */}
                <Link
                    to="/dashboard/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>

                {/* Divider */}
                <hr className="my-2 border-gray-200" />

                {/* Logout Button */}
                <button
                    onClick={() => {
                        onClose();
                        onLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-red-600 hover:bg-red-50 transition-colors group"
                >
                    <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileMenu;
