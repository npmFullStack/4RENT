// src/shared/components/Badge.jsx
import React from "react";

const Badge = ({
    children,
    variant = "soft",
    color = "gray",
    size = "sm",
    icon: Icon = null,
    className = ""
}) => {
    const colorMap = {
        gray: {
            solid: "bg-gray-900 text-white",
            soft: "bg-gray-100 text-gray-700",
            surface: "bg-gray-50 text-gray-600 border border-gray-200",
            outline: "border border-gray-300 text-gray-700 bg-white",
            ghost: "text-gray-600 hover:bg-gray-50"
        },
        red: {
            solid: "bg-red-500 text-white",
            soft: "bg-red-50 text-red-700",
            surface: "bg-red-50/50 text-red-600 border border-red-200",
            outline: "border border-red-300 text-red-600 bg-white",
            ghost: "text-red-600 hover:bg-red-50"
        },
        green: {
            solid: "bg-green-500 text-white",
            soft: "bg-green-50 text-green-700",
            surface: "bg-green-50/50 text-green-600 border border-green-200",
            outline: "border border-green-300 text-green-600 bg-white",
            ghost: "text-green-600 hover:bg-green-50"
        },
        blue: {
            solid: "bg-blue-500 text-white",
            soft: "bg-blue-50 text-blue-700",
            surface: "bg-blue-50/50 text-blue-600 border border-blue-200",
            outline: "border border-blue-300 text-blue-600 bg-white",
            ghost: "text-blue-600 hover:bg-blue-50"
        },
        orange: {
            solid: "bg-orange-500 text-white",
            soft: "bg-orange-50 text-orange-700",
            surface: "bg-orange-50/50 text-orange-600 border border-orange-200",
            outline: "border border-orange-300 text-orange-600 bg-white",
            ghost: "text-orange-600 hover:bg-orange-50"
        },
        yellow: {
            solid: "bg-yellow-500 text-white",
            soft: "bg-yellow-50 text-yellow-800",
            surface: "bg-yellow-50/50 text-yellow-700 border border-yellow-200",
            outline: "border border-yellow-300 text-yellow-700 bg-white",
            ghost: "text-yellow-700 hover:bg-yellow-50"
        },
        purple: {
            solid: "bg-purple-500 text-white",
            soft: "bg-purple-50 text-purple-700",
            surface: "bg-purple-50/50 text-purple-600 border border-purple-200",
            outline: "border border-purple-300 text-purple-600 bg-white",
            ghost: "text-purple-600 hover:bg-purple-50"
        },
        pink: {
            solid: "bg-pink-500 text-white",
            soft: "bg-pink-50 text-pink-700",
            surface: "bg-pink-50/50 text-pink-600 border border-pink-200",
            outline: "border border-pink-300 text-pink-600 bg-white",
            ghost: "text-pink-600 hover:bg-pink-50"
        },
        teal: {
            solid: "bg-teal-500 text-white",
            soft: "bg-teal-50 text-teal-700",
            surface: "bg-teal-50/50 text-teal-600 border border-teal-200",
            outline: "border border-teal-300 text-teal-600 bg-white",
            ghost: "text-teal-600 hover:bg-teal-50"
        }
    };

    const variantBase = {
        solid: "rounded-full font-medium",
        soft: "rounded-full font-medium",
        surface: "rounded-lg font-medium",
        outline: "rounded-full font-medium",
        ghost: "rounded-full font-medium"
    };

    const sizeStyles = {
        xs: "px-2 py-0.5 text-[11px] gap-1",
        sm: "px-2.5 py-1 text-xs gap-1.5",
        md: "px-3 py-1 text-sm gap-1.5",
        lg: "px-3.5 py-1.5 text-sm gap-2"
    };

    const iconSize = {
        xs: "w-3 h-3",
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-4.5 h-4.5"
    };

    const colorTokens = colorMap[color] ?? colorMap.gray;
    const colorClasses = colorTokens[variant] ?? colorTokens.soft;
    const baseClasses = variantBase[variant] ?? variantBase.soft;

    return (
        <span
            className={`
                inline-flex items-center leading-none select-none
                transition-all duration-200 ease-out
                hover:scale-105
                active:scale-95
                ${baseClasses}
                ${sizeStyles[size]}
                ${colorClasses}
                ${className}
            `}
        >
            {Icon && <Icon className={`flex-shrink-0 ${iconSize[size]}`} />}
            <span className="tracking-tight">{children}</span>
        </span>
    );
};

export default Badge;
