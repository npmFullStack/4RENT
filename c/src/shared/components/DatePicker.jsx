// src/shared/components/DatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';
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
    const pickerRef = useRef(null);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
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
                        h-8 w-8 rounded-full text-sm transition-colors flex items-center justify-center
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

    return (
        <div ref={pickerRef} className={`relative ${className}`}>
            {/* Input field */}
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

            {/* Calendar dropdown */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 w-72">
                    {/* Calendar header */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-semibold text-gray-800">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Calendar grid */}
                    <div className="p-3">
                        {/* Week days header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="h-8 w-8 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-500">
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
                    <div className="p-2 border-t border-gray-100">
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
                                w-full text-center text-xs py-1.5 rounded-lg transition-colors
                                ${isDateDisabled(new Date()) 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-primary hover:bg-primary/10'
                                }
                            `}
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;