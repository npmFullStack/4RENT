// src/features/(app)/components/Calendar.jsx
import React, { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    X,
    Users,
    Home,
    CheckCircle,
    PhilippinePeso,
    Wrench,
    UserPlus,
    UserMinus,
    RefreshCw,
    ClipboardList,
    Bug,
    Calendar as CalendarIcon
} from "lucide-react";
import Badge from "@/shared/components/Badge";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const EVENT_CONFIG = {
    rent_due: { color: "red", label: "Rent Due", icon: PhilippinePeso },
    rent_paid: { color: "green", label: "Rent Paid", icon: CheckCircle },
    move_in: { color: "blue", label: "Move In", icon: UserPlus },
    move_out: { color: "purple", label: "Move Out", icon: UserMinus },
    maintenance: { color: "gray", label: "Maintenance", icon: Wrench },
    damage_fixed: { color: "teal", label: "Damage Fixed", icon: Bug },
    lease_renewal: { color: "gray", label: "Lease Renewal", icon: RefreshCw },
    inspection: { color: "orange", label: "Inspection", icon: ClipboardList }
};

const toDateStr = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// ── MonthPicker overlay ────────────────────────────────────────────────────────

const MonthPicker = ({ current, onChange, onClose }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-3 w-56">
        <div className="grid grid-cols-3 gap-1">
            {MONTH_NAMES.map((m, i) => (
                <button
                    key={m}
                    onClick={() => {
                        onChange(i);
                        onClose();
                    }}
                    className={`text-xs py-1.5 px-1 rounded-lg transition-colors font-medium
            ${current === i ? "bg-primary text-white" : "hover:bg-primary/10 text-gray-700"}`}
                >
                    {m.slice(0, 3)}
                </button>
            ))}
        </div>
    </div>
);

// ── YearPicker overlay with navigation ─────────────────────────────────────────

const YearPicker = ({ current, onChange, onClose }) => {
    const [startYear, setStartYear] = useState(current - (current % 12));

    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    const goToPreviousDecade = () => {
        setStartYear(prev => prev - 12);
    };

    const goToNextDecade = () => {
        setStartYear(prev => prev + 12);
    };

    return (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 p-3 w-52">
            {/* Navigation header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
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
            <div className="grid grid-cols-3 gap-1">
                {years.map(y => (
                    <button
                        key={y}
                        onClick={() => {
                            onChange(y);
                            onClose();
                        }}
                        className={`text-xs py-1.5 px-1 rounded-lg transition-colors font-medium
              ${current === y ? "bg-primary text-white" : "hover:bg-primary/10 text-gray-700"}`}
                    >
                        {y}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ── Main Calendar ──────────────────────────────────────────────────────────────

const Calendar = ({ onDateSelect, selectedDate, events }) => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Sync local selected date with prop
    useEffect(() => {
        setLocalSelectedDate(selectedDate);
    }, [selectedDate]);

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewYear(y => y - 1);
            setViewMonth(11);
        } else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewYear(y => y + 1);
            setViewMonth(0);
        } else setViewMonth(m => m + 1);
    };

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    // Leading cells from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ day: daysInPrev - i, current: false, next: false });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ day: d, current: true, next: false });
    }
    // Trailing cells
    const trailing = 42 - cells.length;
    for (let d = 1; d <= trailing; d++) {
        cells.push({ day: d, current: false, next: true });
    }

    const getEventsForDay = day => {
        if (!events) return [];
        const m = String(viewMonth + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        return events.filter(e => e.date === `${viewYear}-${m}-${d}`);
    };

    const handleCellClick = day => {
        const date = new Date(viewYear, viewMonth, day);
        setLocalSelectedDate(date);
        onDateSelect && onDateSelect(date);
    };

    const isToday = day =>
        day === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear();

    const isSelected = day => {
        if (!localSelectedDate) return false;
        return (
            day === localSelectedDate.getDate() &&
            viewMonth === localSelectedDate.getMonth() &&
            viewYear === localSelectedDate.getFullYear()
        );
    };

    // Check if a day is Sunday (index 0)
    const getDayOfWeek = day => {
        return new Date(viewYear, viewMonth, day).getDay();
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* ── Header with centered month/year and side arrows ── */}
                <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5 border-b border-gray-200">
                    {/* Previous button - left side */}
                    <button
                        onClick={prevMonth}
                        className="p-1.5 sm:p-2 hover:bg-primary/10 rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Month and Year - center */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Month button */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowMonthPicker(p => !p);
                                    setShowYearPicker(false);
                                }}
                                className="text-base sm:text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                            >
                                {MONTH_NAMES[viewMonth]}
                            </button>
                            {showMonthPicker && (
                                <MonthPicker
                                    current={viewMonth}
                                    onChange={setViewMonth}
                                    onClose={() => setShowMonthPicker(false)}
                                />
                            )}
                        </div>

                        {/* Year button */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowYearPicker(p => !p);
                                    setShowMonthPicker(false);
                                }}
                                className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
                            >
                                {viewYear}
                            </button>
                            {showYearPicker && (
                                <YearPicker
                                    current={viewYear}
                                    onChange={setViewYear}
                                    onClose={() => setShowYearPicker(false)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Next button - right side */}
                    <button
                        onClick={nextMonth}
                        className="p-1.5 sm:p-2 hover:bg-primary/10 rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* ── Day Labels ── */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                    {DAY_LABELS.map((d, i) => (
                        <div
                            key={i}
                            className={`py-1.5 sm:py-2.5 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${
                                i === 0 ? "text-red-500" : "text-gray-400"
                            }`}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* ── Calendar Grid ── */}
                <div className="grid grid-cols-7">
                    {cells.map((cell, idx) => {
                        if (!cell.current) {
                            // Get day of week for non-current cells (for Sunday color)
                            const nonCurrentDate = new Date(
                                cell.next ? viewYear : viewYear,
                                cell.next ? viewMonth + 1 : viewMonth,
                                cell.day
                            );
                            const isNonCurrentSunday =
                                nonCurrentDate.getDay() === 0;

                            return (
                                <div
                                    key={idx}
                                    className="border-b border-r border-gray-200 min-h-[60px] sm:min-h-[120px] p-0.5 sm:p-1 relative bg-gray-50/30"
                                >
                                    <span
                                        className={`text-[10px] sm:text-xs absolute bottom-0.5 sm:bottom-1.5 left-0.5 sm:left-1.5 ${isNonCurrentSunday ? "text-red-300" : "text-gray-300"}`}
                                    >
                                        {cell.day}
                                    </span>
                                </div>
                            );
                        }

                        const dayEvents = getEventsForDay(cell.day);
                        const uniqueTypes = [
                            ...new Set(dayEvents.map(e => e.type))
                        ];
                        const today_ = isToday(cell.day);
                        const selected_ = isSelected(cell.day);
                        const isSunday = getDayOfWeek(cell.day) === 0;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleCellClick(cell.day)}
                                className={`
                                    relative border-b border-r border-gray-200 min-h-[60px] sm:min-h-[120px] p-0.5 sm:p-1.5 text-left
                                    transition-colors duration-150 group
                                    ${selected_ ? "bg-primary hover:bg-primary" : "bg-white hover:bg-primary/5"}
                                `}
                            >
                                {/* Badges top-right */}
                                {uniqueTypes.length > 0 && (
                                    <div className="absolute top-0.5 sm:top-1.5 right-0.5 sm:right-1.5 flex flex-wrap gap-0.5 justify-end max-w-[90%] sm:max-w-[80%]">
                                        {uniqueTypes
                                            .slice(0, isMobile ? 3 : 2)
                                            .map((type, i) => {
                                                const cfg = EVENT_CONFIG[type];
                                                if (!cfg) return null;
                                                const IconComponent = cfg.icon;
                                                return isMobile ? (
                                                    // Mobile: icon-only badge
                                                    <Badge
                                                        key={i}
                                                        variant="solid"
                                                        color={cfg.color}
                                                        size="xs"
                                                        icon={cfg.icon}
                                                        className="!px-1 !py-0.5 [&>svg]:w-3 [&>svg]:h-3"
                                                    >
                                                        {/* No text on mobile */}
                                                    </Badge>
                                                ) : (
                                                    // Desktop: badge with text
                                                    <Badge
                                                        key={i}
                                                        variant="solid"
                                                        color={cfg.color}
                                                        size="xs"
                                                        icon={cfg.icon}
                                                        className="text-[12px] px-1.5 py-0.5 max-w-[100px] [&>svg]:w-3 [&>svg]:h-3 [&>span]:truncate"
                                                    >
                                                        <span className="truncate block max-w-[80px]">
                                                            {cfg.label}
                                                        </span>
                                                    </Badge>
                                                );
                                            })}
                                        {uniqueTypes.length >
                                            (isMobile ? 3 : 2) && (
                                            <Badge
                                                variant="solid"
                                                color="gray"
                                                size="xs"
                                                className="text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0.5"
                                            >
                                                +
                                                {uniqueTypes.length -
                                                    (isMobile ? 3 : 2)}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Day number */}
                                <div className="absolute bottom-0.5 sm:bottom-1.5 left-0.5 sm:left-1.5">
                                    {today_ ? (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-yellow-500 text-white text-[10px] sm:text-xs font-semibold">
                                            {cell.day}
                                        </div>
                                    ) : (
                                        <span
                                            className={`text-[10px] sm:text-xs font-semibold ${
                                                selected_
                                                    ? "text-white"
                                                    : isSunday
                                                      ? "text-red-500"
                                                      : "text-gray-700"
                                            }`}
                                        >
                                            {cell.day}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Calendar;
