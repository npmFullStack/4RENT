// src/shared/components/DatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DatePicker = ({
    value,
    onChange,
    placeholder = "Select date",
    className = "",
    disabled = false,
    minDate = null,
    maxDate = null,
    formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0, width: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const inputRef = useRef(null);
    const calendarRef = useRef(null);

    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Prevent body scroll when mobile calendar is open
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isMobile, isOpen]);

    // Calculate and update calendar position when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const calendarHeight = 400; // Approximate calendar height
            const calendarWidth = isMobile ? viewportWidth - 32 : 320;
            
            let top, left;
            
            if (isMobile) {
                // On mobile, center the calendar vertically and horizontally
                // Calculate center position
                top = (viewportHeight - calendarHeight) / 2;
                // Ensure it doesn't go off screen at the top
                if (top < 20) top = 20;
                // Ensure it doesn't go off screen at the bottom
                if (top + calendarHeight > viewportHeight - 20) {
                    top = viewportHeight - calendarHeight - 20;
                }
                left = (viewportWidth - calendarWidth) / 2;
                // Ensure it doesn't go off screen horizontally
                if (left < 16) left = 16;
            } else {
                // Desktop positioning
                top = rect.bottom + window.scrollY;
                left = rect.left + window.scrollX;
                
                // Check if calendar goes beyond bottom of viewport
                if (rect.bottom + calendarHeight > viewportHeight) {
                    top = rect.top + window.scrollY - calendarHeight;
                }
                
                // Check if calendar goes beyond right of viewport
                if (left + calendarWidth > viewportWidth) {
                    left = viewportWidth - calendarWidth - 10;
                }
                
                // Check if calendar goes beyond left of viewport
                if (left < 10) {
                    left = 10;
                }
            }
            
            setCalendarPosition({ top, left, width: calendarWidth });
        }
    }, [isOpen, isMobile]);

    // Update selected date when value prop changes
    useEffect(() => {
        setSelectedDate(value ? new Date(value) : null);
    }, [value]);

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate to previous month
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Check if date is disabled
    const isDateDisabled = (date) => {
        if (disabled) return true;
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    // Handle date selection
    const handleDateSelect = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (isDateDisabled(newDate)) return;
        
        setSelectedDate(newDate);
        onChange(newDate);
        setIsOpen(false);
    };

    // Handle clear date
    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedDate(null);
        onChange(null);
    };

    // Render calendar days
    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-9 w-9 sm:h-8 sm:w-8" />);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();
            const isToday = date.getTime() === today.getTime();
            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`
                        h-9 w-9 sm:h-8 sm:w-8 rounded-full text-sm sm:text-sm transition-colors flex items-center justify-center
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-primary/10 cursor-pointer'}
                        ${isSelected ? 'bg-primary text-gray-900 font-semibold' : 'text-gray-700'}
                        ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Week day headers
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Mobile backdrop
    const MobileBackdrop = () => (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
            onClick={() => setIsOpen(false)}
        />
    );

    return (
        <>
            {/* Input field */}
            <div ref={inputRef} className={`relative ${className}`}>
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`
                        relative w-full px-3 py-2 border rounded-lg 
                        focus-within:ring-2 focus-within:ring-primary/50 
                        transition-all cursor-pointer
                        ${disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-gray-300 hover:border-primary bg-white'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${selectedDate ? 'text-primary' : 'text-gray-400'}`} />
                            <span className={`text-sm ${selectedDate ? 'text-gray-800' : 'text-gray-500'}`}>
                                {selectedDate ? formatDate(selectedDate) : placeholder}
                            </span>
                        </div>
                        {selectedDate && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendar dropdown rendered via Portal */}
            {isOpen && !disabled && createPortal(
                <>
                    {/* Mobile backdrop */}
                    {isMobile && <MobileBackdrop />}
                    
                    <div 
                        ref={calendarRef}
                        className={`
                            fixed bg-white rounded-xl shadow-xl border border-gray-200 z-[99999]
                            ${isMobile ? 'animate-slide-up' : ''}
                        `}
                        style={{
                            top: `${calendarPosition.top}px`,
                            left: `${calendarPosition.left}px`,
                            width: isMobile ? `${calendarPosition.width}px` : 'auto',
                            minWidth: isMobile ? 'auto' : '280px',
                            maxWidth: isMobile ? 'calc(100vw - 32px)' : '320px',
                        }}
                    >
                        {/* Calendar header */}
                        <div className="flex items-center justify-between p-3 sm:p-3 border-b border-gray-100">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="p-2 sm:p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <span className="text-sm sm:text-sm font-semibold text-gray-800">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-2 sm:p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Calendar grid */}
                        <div className="p-3 sm:p-3">
                            {/* Week days header */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center">
                                        <span className="text-xs sm:text-xs font-medium text-gray-500">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Calendar days */}
                            <div className="grid grid-cols-7 gap-1">
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Footer with today button */}
                        <div className="p-2 sm:p-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();
                                    if (!isDateDisabled(today)) {
                                        setSelectedDate(today);
                                        onChange(today);
                                        setCurrentMonth(today);
                                        setIsOpen(false);
                                    }
                                }}
                                disabled={isDateDisabled(new Date())}
                                className={`
                                    w-full text-center text-xs sm:text-xs py-2 sm:py-1.5 rounded-lg transition-colors
                                    ${isDateDisabled(new Date()) 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-primary hover:bg-primary/10 font-medium'
                                    }
                                `}
                            >
                                Today
                            </button>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export default DatePicker;