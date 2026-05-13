// src/shared/components/WarningModal.jsx
import React from 'react';
import ModalPortal from './ModalPortal';
import { AlertTriangle, X } from 'lucide-react';

const WarningModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Warning", 
    description = "Are you sure you want to proceed?",
    icon: IconComponent = AlertTriangle,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="relative p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
                <p className="text-gray-600 text-center mb-6">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default WarningModal;