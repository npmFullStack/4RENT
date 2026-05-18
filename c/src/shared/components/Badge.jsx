// src/shared/components/Badge.jsx
import React from "react";

const Badge = ({
    children,
    variant = "subtle",
    color = "gray",
    size = "sm",
    icon: Icon = null,
    className = ""
}) => {
    const colorMap = {
        gray: {
            subtle: "bg-gray-100 text-gray-700",
            light: "bg-gray-50 text-gray-500 border border-gray-200",
            vivid: "bg-gray-600 text-white shadow-sm",
            outline: "border-2 border-gray-300 text-gray-700",
            elevated: "bg-white text-gray-800 shadow-md border border-gray-100"
        },
        red: {
            subtle: "bg-red-100 text-red-700",
            light: "bg-red-50 text-red-500 border border-red-100",
            vivid: "bg-red-500 text-white shadow-sm",
            outline: "border-2 border-red-400 text-red-600",
            elevated: "bg-white text-red-600 shadow-md border border-red-100"
        },
        green: {
            subtle: "bg-green-100 text-green-700",
            light: "bg-green-50 text-green-500 border border-green-100",
            vivid: "bg-green-500 text-white shadow-sm",
            outline: "border-2 border-green-400 text-green-600",
            elevated:
                "bg-white text-green-600 shadow-md border border-green-100"
        },
        blue: {
            subtle: "bg-blue-100 text-blue-700",
            light: "bg-blue-50 text-blue-500 border border-blue-100",
            vivid: "bg-blue-500 text-white shadow-sm",
            outline: "border-2 border-blue-400 text-blue-600",
            elevated: "bg-white text-blue-600 shadow-md border border-blue-100"
        },
        orange: {
            subtle: "bg-orange-100 text-orange-700",
            light: "bg-orange-50 text-orange-500 border border-orange-100",
            vivid: "bg-orange-500 text-white shadow-sm",
            outline: "border-2 border-orange-400 text-orange-600",
            elevated:
                "bg-white text-orange-600 shadow-md border border-orange-100"
        },
        yellow: {
            subtle: "bg-yellow-100 text-yellow-800",
            light: "bg-yellow-50 text-yellow-600 border border-yellow-200",
            vivid: "bg-yellow-500 text-white shadow-sm",
            outline: "border-2 border-yellow-400 text-yellow-700",
            elevated:
                "bg-white text-yellow-700 shadow-md border border-yellow-100"
        },
        purple: {
            subtle: "bg-purple-100 text-purple-700",
            light: "bg-purple-50 text-purple-500 border border-purple-100",
            vivid: "bg-purple-500 text-white shadow-sm",
            outline: "border-2 border-purple-400 text-purple-600",
            elevated:
                "bg-white text-purple-600 shadow-md border border-purple-100"
        },
        pink: {
            subtle: "bg-pink-100 text-pink-700",
            light: "bg-pink-50 text-pink-500 border border-pink-100",
            vivid: "bg-pink-500 text-white shadow-sm",
            outline: "border-2 border-pink-400 text-pink-600",
            elevated: "bg-white text-pink-600 shadow-md border border-pink-100"
        },
        teal: {
            subtle: "bg-teal-100 text-teal-700",
            light: "bg-teal-50 text-teal-500 border border-teal-100",
            vivid: "bg-teal-500 text-white shadow-sm",
            outline: "border-2 border-teal-400 text-teal-600",
            elevated: "bg-white text-teal-600 shadow-md border border-teal-100"
        }
    };

    const variantBase = {
        subtle: "rounded-full font-medium",
        light: "rounded-lg font-medium",
        vivid: "rounded-lg font-semibold",
        outline: "rounded-xl font-medium bg-white",
        elevated: "rounded-2xl font-medium backdrop-blur-sm"
    };

    const sizeStyles = {
        xs: "px-2 py-0.5 text-[10px] gap-1",
        sm: "px-2.5 py-0.5 text-xs gap-1.5",
        md: "px-3 py-1 text-sm gap-1.5",
        lg: "px-3.5 py-1.5 text-sm gap-2"
    };

    const iconSize = {
        xs: "w-2.5 h-2.5",
        sm: "w-3 h-3",
        md: "w-3.5 h-3.5",
        lg: "w-4 h-4"
    };

    const colorTokens = colorMap[color] ?? colorMap.gray;
    const colorClasses = colorTokens[variant] ?? colorTokens.subtle;
    const baseClasses = variantBase[variant] ?? variantBase.subtle;

    return (
        <span
            className={`
                inline-flex items-center leading-none select-none
                transition-all duration-200 ease-out
                hover:scale-105 hover:shadow-sm
                active:scale-95
                ${baseClasses}
                ${sizeStyles[size]}
                ${colorClasses}
                ${className}
            `}
        >
            {Icon && (
                <Icon
                    className={`flex-shrink-0 ${iconSize[size]} transition-transform group-hover:rotate-6`}
                />
            )}
            <span className="tracking-wide">{children}</span>
        </span>
    );
};

export default Badge;
