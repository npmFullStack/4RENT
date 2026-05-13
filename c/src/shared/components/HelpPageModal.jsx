// src/shared/components/HelpPageModal.jsx
import React, { useState, useEffect } from 'react';
import ModalPortal from './ModalPortal';
import { X, HelpCircle, ChevronLeft, ChevronRight, Building2, Home, Users, Bell, Activity } from 'lucide-react';

// Icon mapping
const iconMap = {
    Building2,
    Home,
    Users,
    Bell,
    Activity,
    HelpCircle
};

const HelpPageModal = ({ 
    isOpen, 
    onClose, 
    icon: IconComponent = HelpCircle,
    title = "Help Center",
    description = "Need assistance? We're here to help you navigate through the platform.",
    features = []
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = features.length;

    // Reset to first page when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const hasMultiplePages = totalPages > 1;
    const currentFeature = features[currentPage];
    const FeatureIcon = currentFeature?.icon ? iconMap[currentFeature.icon] || HelpCircle : HelpCircle;

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

                {/* Icon - Like WarningModal but with primary color */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {hasMultiplePages ? (
                            <FeatureIcon className="w-8 h-8 text-primary" />
                        ) : (
                            <IconComponent className="w-8 h-8 text-primary" />
                        )}
                    </div>
                </div>

                {/* Title - Now shows feature name when available */}
                <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-3">
                    {hasMultiplePages ? currentFeature?.title : title}
                </h2>

                {/* Description - Short and concise like WarningModal */}
                <p className="text-gray-600 text-center mb-6">
                    {hasMultiplePages ? currentFeature?.description : description}
                </p>

                {/* Page Indicator - Only dots for navigation */}
                {hasMultiplePages && (
                    <div className="flex justify-center gap-2 mb-6">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                className={`h-2 rounded-full transition-all duration-200 ${
                                    currentPage === index
                                        ? 'w-6 bg-primary'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation Buttons - Like WarningModal button style */}
                {hasMultiplePages && (
                    <div className="flex justify-between gap-3">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 0}
                            className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages - 1}
                            className={`flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === totalPages - 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Got it Button */}
                {(!hasMultiplePages || currentPage === totalPages - 1) && (
                    <button
                        onClick={onClose}
                        className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Got it
                    </button>
                )}
            </div>
        </ModalPortal>
    );
};

export default HelpPageModal;