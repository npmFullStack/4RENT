// src/shared/components/StatCard.jsx
import React from "react";

const StatCard = ({
    title,
    value,
    message,
    image,
    messageColor = "green" // green, yellow, red, blue
}) => {
    const messageColorStyles = {
        green: "text-green-500",
        yellow: "text-yellow-500",
        red: "text-red-500",
        blue: "text-blue-500"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 relative">
            {/* Image at top right */}
            {image && (
                <div className="absolute top-4 right-4">
                    <img
                        src={image}
                        alt={title}
                        className="w-12 h-16 object-cover"
                    />
                </div>
            )}

            {/* Title */}
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>

            {/* Value */}
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                {value}
            </p>

            {/* Message/Label */}
            {message && (
                <span
                    className={`text-xs font-medium ${messageColorStyles[messageColor]}`}
                >
                    {message}
                </span>
            )}
        </div>
    );
};

export default StatCard;
