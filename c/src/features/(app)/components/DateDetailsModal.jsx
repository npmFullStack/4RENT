// src/features/(app)/components/DateDetailsModal.jsx
import React from "react";
import {
    X,
    Calendar as CalendarIcon,
    Users,
    Home,
    CheckCircle,
    Wrench,
    UserPlus,
    UserMinus,
    RefreshCw,
    ClipboardList,
    Bug,
    PhilippinePeso
} from "lucide-react";
import ModalPortal from "@/shared/components/ModalPortal";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

// Same EVENT_CONFIG as Calendar.jsx for consistent colors
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

const DateDetailsModal = ({ selectedDate, events, onClose, isOpen }) => {
    const formatDate = date => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getEventsForDate = () => {
        if (!selectedDate || !events) return [];
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const d = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;
        return events.filter(event => event.date === dateStr);
    };

    const dateEvents = getEventsForDate();

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="relative p-6 max-w-md w-full">
                {/* Close Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header - Icon beside title */}
                <div className="flex items-center gap-3 mb-6 pr-6">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-xl">
                        {selectedDate
                            ? formatDate(selectedDate)
                            : "No Date Selected"}
                    </h3>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                    {!selectedDate ? (
                        <div className="text-center py-12 text-gray-500">
                            <CalendarIcon className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                            <p className="text-base">
                                Select a date to view details
                            </p>
                        </div>
                    ) : dateEvents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <CheckCircle className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                            <p className="text-base">
                                No events scheduled for this date
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dateEvents.map((event, idx) => {
                                const cfg = EVENT_CONFIG[event.type] || {
                                    color: "gray",
                                    label: "Event",
                                    icon: CalendarIcon
                                };
                                const EventIcon = cfg.icon;

                                return (
                                    <div
                                        key={idx}
                                        className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-end gap-3 mb-3">
                                            <Badge
                                                variant="outline"
                                                color={cfg.color}
                                                icon={EventIcon}
                                            >
                                                {cfg.label}
                                            </Badge>
                                        </div>

                                        <h4 className="font-semibold text-gray-900 text-base mb-2">
                                            {event.title}
                                        </h4>

                                        {event.description && (
                                            <p className="text-sm text-gray-500 leading-relaxed mb-3">
                                                {event.description}
                                            </p>
                                        )}

                                        {event.tenant && (
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                <span>{event.tenant}</span>
                                            </div>
                                        )}

                                        {event.property && (
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                                <Home className="w-4 h-4" />
                                                <span>{event.property}</span>
                                            </div>
                                        )}

                                        {event.amount && (
                                            <div className="flex items-center gap-2 mt-2 text-base font-semibold text-gray-700">
                                                <PhilippinePeso className="w-4 h-4" />
                                                <span>
                                                    ₱
                                                    {typeof event.amount ===
                                                    "number"
                                                        ? event.amount.toLocaleString()
                                                        : event.amount}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ModalPortal>
    );
};

export default DateDetailsModal;
