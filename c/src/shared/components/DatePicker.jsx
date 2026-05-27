// src/shared/components/DatePicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

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
    const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
    const [startYear, setStartYear] = useState(new Date().getFullYear() - (new Date().getFullYear() % 12));
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
                    setViewMode('days');
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
                setViewMode('days');
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
            const calendarHeight = viewMode === 'days' ? 400 : 350;
            const calendarWidth = isMobile ? viewportWidth - 32 : 320;
            
            let top, left;
            
            if (isMobile) {
                top = (viewportHeight - calendarHeight) / 2;
                if (top < 20) top = 20;
                if (top + calendarHeight > viewportHeight - 20) {
                    top = viewportHeight - calendarHeight - 20;
                }
                left = (viewportWidth - calendarWidth) / 2;
                if (left < 16) left = 16;
            } else {
                top = rect.bottom + window.scrollY;
                left = rect.left + window.scrollX;
                
                if (rect.bottom + calendarHeight > viewportHeight) {
                    top = rect.top + window.scrollY - calendarHeight;
                }
                
                if (left + calendarWidth > viewportWidth) {
                    left = viewportWidth - calendarWidth - 10;
                }
                
                if (left < 10) {
                    left = 10;
                }
            }
            
            setCalendarPosition({ top, left, width: calendarWidth });
        }
    }, [isOpen, isMobile, viewMode]);

    // Update selected date when value prop changes
    useEffect(() => {
        setSelectedDate(value ? new Date(value) : null);
    }, [value]);

    // Reset view mode when calendar closes
    useEffect(() => {
        if (!isOpen) {
            setViewMode('days');
        }
    }, [isOpen]);

    // Update startYear when currentMonth changes (for years view)
    useEffect(() => {
        if (viewMode === 'years') {
            const year = currentMonth.getFullYear();
            setStartYear(year - (year % 12));
        }
    }, [viewMode, currentMonth]);

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
        setViewMode('days');
    };

    // Handle month selection
    const handleMonthSelect = (monthIndex) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
        setViewMode('days');
    };

    // Handle year selection
    const handleYearSelect = (year) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        setViewMode('months');
    };

    // Handle clear date
    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedDate(null);
        onChange(null);
    };

    // Go to previous decade in years view
    const goToPreviousDecade = () => {
        setStartYear(prev => prev - 12);
    };

    // Go to next decade in years view
    const goToNextDecade = () => {
        setStartYear(prev => prev + 12);
    };

    // Render calendar days
    const renderDays = () => {
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
                        ${isSelected ? 'bg-primary text-white font-semibold' : 'text-gray-700'}
                        ${isToday && !isSelected ? 'border border-primary text-primary' : ''}
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Render months view
    const renderMonths = () => {
        const currentYear = currentMonth.getFullYear();
        const currentMonthIndex = currentMonth.getMonth();
        
        return MONTH_NAMES.map((month, index) => {
            const isCurrentMonth = currentMonthIndex === index;
            
            // Check if any date in this month is selectable (not all days disabled)
            const testDate = new Date(currentYear, index, 15);
            const isMonthDisabled = (minDate && testDate < minDate) || (maxDate && testDate > maxDate);
            
            return (
                <button
                    key={month}
                    onClick={() => !isMonthDisabled && handleMonthSelect(index)}
                    disabled={isMonthDisabled}
                    className={`
                        py-2 px-1 rounded-lg text-sm transition-colors
                        ${isMonthDisabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-primary/10 cursor-pointer text-gray-700'}
                        ${isCurrentMonth ? 'bg-primary text-white hover:bg-primary' : ''}
                    `}
                >
                    {month.slice(0, 3)}
                </button>
            );
        });
    };

    // Render years view
    const renderYears = () => {
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);
        const currentYear = currentMonth.getFullYear();
        
        return (
            <>
                {/* Decade navigation header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <button
                        onClick={goToPreviousDecade}
                        className="p-1 hover:bg-primary/10 rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-gray-500">
                        {startYear} - {startYear + 11}
                    </span>
                    <button
                        onClick={goToNextDecade}
                        className="p-1 hover:bg-primary/10 rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Years grid */}
                <div className="grid grid-cols-3 gap-2">
                    {years.map(year => {
                        // Check if this year has any selectable dates
                        const testDate = new Date(year, 5, 15);
                        const isYearDisabled = (minDate && testDate < minDate) || (maxDate && testDate > maxDate);
                        const isCurrentYear = currentYear === year;
                        
                        return (
                            <button
                                key={year}
                                onClick={() => !isYearDisabled && handleYearSelect(year)}
                                disabled={isYearDisabled}
                                className={`
                                    py-2 px-1 rounded-lg text-sm transition-colors
                                    ${isYearDisabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-primary/10 cursor-pointer text-gray-700'}
                                    ${isCurrentYear ? 'bg-primary text-white hover:bg-primary' : ''}
                                `}
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    };

    // Week day headers
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Mobile backdrop
    const MobileBackdrop = () => (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
            onClick={() => {
                setIsOpen(false);
                setViewMode('days');
            }}
        />
    );

    // Get header title based on view mode
    const getHeaderTitle = () => {
        if (viewMode === 'days') {
            return `${MONTH_NAMES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
        }
        if (viewMode === 'months') {
            return currentMonth.getFullYear();
        }
        if (viewMode === 'years') {
            return 'Select Year';
        }
        return '';
    };

    // Handle header click based on view mode
    const handleHeaderClick = () => {
        if (viewMode === 'days') {
            // Clicking on "Month Year" in days view -> show months picker
            setViewMode('months');
        } else if (viewMode === 'months') {
            // Clicking on "Year" in months view -> show years picker
            setViewMode('years');
        }
        // In years mode, clicking header does nothing
    };

    // Handle back button
    const handleBack = () => {
        if (viewMode === 'months') {
            setViewMode('days');
        } else if (viewMode === 'years') {
            setViewMode('months');
        }
    };

    // Show back button
    const showBackButton = viewMode !== 'days';

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
                            {showBackButton ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            
                            <button
                                onClick={handleHeaderClick}
                                className="text-sm sm:text-sm font-semibold text-gray-800 hover:text-primary transition-colors"
                            >
                                {getHeaderTitle()}
                            </button>
                            
                            {viewMode === 'days' && (
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            {viewMode !== 'days' && (
                                <div className="w-7" /> /* Spacer for alignment */
                            )}
                        </div>

                        {/* Calendar content based on view mode */}
                        <div className="p-3 sm:p-3">
                            {viewMode === 'days' && (
                                <>
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
                                        {renderDays()}
                                    </div>
                                </>
                            )}

                            {viewMode === 'months' && (
                                <div className="grid grid-cols-3 gap-2">
                                    {renderMonths()}
                                </div>
                            )}

                            {viewMode === 'years' && (
                                <div>
                                    {renderYears()}
                                </div>
                            )}
                        </div>

                        {/* Footer with today button - only show in days view */}
                        {viewMode === 'days' && (
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
                                            setViewMode('days');
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
                        )}
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export default DatePicker;