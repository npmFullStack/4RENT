// src/shared/components/StatCard.jsx
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({
    title,
    value,
    message,
    icon: Icon,
    trend = "up",
}) => {
    return (
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Large Gray Icon at Top Right */}
            <div className="absolute -top-2 -right-2 opacity-20">
                {Icon && <Icon size={80} strokeWidth={0.8} className="text-gray-400" />}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-gray-700 text-sm font-medium mb-3">
                    {title}
                </h3>

                {/* Value - font-black */}
                <p className="text-3xl font-black text-gray-900 mb-2">
                    {value}
                </p>

                {/* Message with trend */}
                {message && (
                    <div className="flex items-center gap-1.5">
                        {trend === "up" && <ArrowUp size={12} className="text-green-500" />}
                        {trend === "down" && <ArrowDown size={12} className="text-red-500" />}
                        <span className={`text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                            {message}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;