// src/shared/components/Button.jsx
import React from "react";

const Button = ({
    children,
    variant = "primary",
    icon: Icon,
    iconPosition = "left",
    className = "",
    ...props
}) => {
    const baseStyles =
        "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 justify-center";

    const variants = {
        primary:
            "bg-primary text-white hover:bg-yellow-400 shadow-md hover:shadow-lg",
        outline:
            "border-2 border-primary text-primary bg-white hover:bg-primary/10",
        ghost: "text-gray-800 bg-transparent hover:bg-gray-300/10"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </button>
    );
};

export default Button;