// src/shared/components/WarningModal.jsx
import React from "react";
import ModalPortal from "./ModalPortal";
import Button from "./Button";
import { AlertTriangle, X, LogOut, Loader2 } from "lucide-react";

const WarningModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Warning",
    description = "Are you sure you want to proceed?",
    icon: IconComponent = AlertTriangle,
    confirmText = "Logout",
    cancelText = "Cancel",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (isLoading) return;
        await onConfirm();
    };

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
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-3">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6">{description}</p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 "
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        icon={isLoading ? Loader2 : LogOut}
                        iconPosition="left"
                        className="flex-1 !bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    >
                        {isLoading ? "Logging out..." : confirmText}
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default WarningModal;
