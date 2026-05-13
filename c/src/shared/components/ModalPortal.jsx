// src/shared/components/ModalPortal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children, isOpen, onClose, closeOnOutsideClick = true }) => {
    const modalRef = useRef(null);

    // Handle escape key press
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Handle click outside
    const handleOutsideClick = (event) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 animate-in fade-in zoom-in"
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default ModalPortal;