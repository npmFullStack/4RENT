// src/shared/components/ConfirmModal.jsx
import React from "react";
import ModalPortal from "./ModalPortal";
import Button from "./Button";
import { AlertTriangle, X, LogOut, Loader2, Info, CheckCircle } from "lucide-react";

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    variant = "warning", // warning, danger, info, success
    icon: IconComponent,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (isLoading) return;
        await onConfirm();
    };

    // Variant configurations
    const variants = {
        warning: {
            icon: AlertTriangle,
            iconBgColor: "bg-amber-100",
            iconColor: "text-amber-600",
            buttonColor: "!bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
        },
        danger: {
            icon: AlertTriangle,
            iconBgColor: "bg-red-100",
            iconColor: "text-red-600",
            buttonColor: "!bg-red-600 hover:bg-red-700 focus:ring-red-500"
        },
        info: {
            icon: Info,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            buttonColor: "!bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        },
        success: {
            icon: CheckCircle,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
            buttonColor: "!bg-green-600 hover:bg-green-700 focus:ring-green-500"
        }
    };

    const variantConfig = variants[variant];
    const Icon = IconComponent || variantConfig.icon;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="relative p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 ${variantConfig.iconBgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${variantConfig.iconColor}`} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-3">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-gray-600 text-center mb-6">{message}</p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        icon={isLoading ? Loader2 : undefined}
                        iconPosition="left"
                        className={`flex-1 ${variantConfig.buttonColor}`}
                    >
                        {isLoading ? `${confirmText}...` : confirmText}
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default ConfirmModal;