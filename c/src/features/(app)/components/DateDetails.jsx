// src/features/(app)/components/DateDetails.jsx
import React from "react";
import {
    X,
    Calendar as CalendarIcon,
    Users,
    Home,
    CheckCircle,
    AlertCircle,
    Wrench,
    UserPlus,
    UserMinus,
    RefreshCw,
    ClipboardList,
    Bug,
    PhilippinePeso
} from "lucide-react";

const DateDetails = ({ selectedDate, events, onClose }) => {
    const formatDate = date => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getEventIcon = type => {
        const icons = {
            rent_due: {
                icon: PhilippinePeso,
                color: "text-red-600",
                bg: "bg-red-50",
                label: "Rent Due"
            },
            rent_paid: {
                icon: CheckCircle,
                color: "text-green-600",
                bg: "bg-green-50",
                label: "Rent Paid"
            },
            move_in: {
                icon: UserPlus,
                color: "text-blue-600",
                bg: "bg-blue-50",
                label: "Move In"
            },
            move_out: {
                icon: UserMinus,
                color: "text-purple-600",
                bg: "bg-purple-50",
                label: "Move Out"
            },
            maintenance: {
                icon: Wrench,
                color: "text-yellow-600",
                bg: "bg-yellow-50",
                label: "Maintenance Request"
            },
            damage_fixed: {
                icon: Bug,
                color: "text-teal-600",
                bg: "bg-teal-50",
                label: "Damage Fixed"
            },
            lease_renewal: {
                icon: RefreshCw,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                label: "Lease Renewal"
            },
            inspection: {
                icon: ClipboardList,
                color: "text-orange-600",
                bg: "bg-orange-50",
                label: "Property Inspection"
            }
        };
        return (
            icons[type] || {
                icon: CalendarIcon,
                color: "text-gray-600",
                bg: "bg-gray-50",
                label: "Event"
            }
        );
    };

    const getEventsForDate = () => {
        if (!selectedDate || !events) return [];
        const dateStr = selectedDate.toISOString().split("T")[0];
        return events.filter(event => event.date === dateStr);
    };

    const dateEvents = getEventsForDate();

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-80">
            {/* Header - matching NotificationMenu style */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-800" />
                        <h3 className="font-semibold text-gray-900 text-sm">
                            {selectedDate
                                ? formatDate(selectedDate)
                                : "No Date Selected"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close details"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
                {!selectedDate ? (
                    <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Select a date to view details</p>
                    </div>
                ) : dateEvents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">
                            No events scheduled for this date
                        </p>
                    </div>
                ) : (
                    <div>
                        {dateEvents.map((event, idx) => {
                            const {
                                icon: EventIcon,
                                color,
                                bg,
                                label
                            } = getEventIcon(event.type);
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
                                >
                                    {/* Icon - unified gray styling like NotificationMenu */}
                                    <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                                        <EventIcon className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color} ${bg}`}
                                                >
                                                    {label}
                                                </span>
                                                {event.time && (
                                                    <span className="text-xs text-gray-400">
                                                        {event.time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                                            {event.title}
                                        </h4>
                                        {event.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {event.description}
                                            </p>
                                        )}
                                        {event.tenant && (
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <Users className="w-3 h-3" />
                                                <span>{event.tenant}</span>
                                            </div>
                                        )}
                                        {event.property && (
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                <Home className="w-3 h-3" />
                                                <span>{event.property}</span>
                                            </div>
                                        )}
                                        {event.amount && (
                                            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-gray-700">
                                                <PhilippinePeso className="w-3 h-3" />
                                                <span>
                                                    {event.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

      </div>
    );
};

export default DateDetails;
