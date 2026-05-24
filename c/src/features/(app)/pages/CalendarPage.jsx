// src/features/(app)/pages/CalendarPage.jsx
import React, { useState } from "react";
import {
    HelpCircle,
    Filter,
    Calendar as CalendarIcon,
    ChevronDown
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import WelcomeHeroBox from "@/shared/components/WelcomeHeroBox";
import Calendar from "@/features/(app)/components/Calendar";
import DateDetailsModal from "@/features/(app)/components/DateDetailsModal";
import calendarImage from "@/assets/images/calendarImage.png";

const mockEvents = [
    {
        id: 1,
        date: "2026-05-25",
        type: "rent_due",
        title: "Monthly Rent Due",
        description: "Rent payment for Sunset Boarding House",
        tenant: "Maria Santos",
        property: "Sunset Boarding House",
        amount: 4850
    },
    {
        id: 2,
        date: "2026-05-25",
        type: "rent_paid",
        title: "Rent Payment Received",
        description: "Monthly rent payment received",
        tenant: "John Reyes",
        property: "Downtown Luxury Apartment",
        amount: 12500
    },
    {
        id: 3,
        date: "2026-05-28",
        type: "move_in",
        title: "New Tenant Move In",
        description: "Sofia Mendoza moving into Cozy Studio Boarding",
        tenant: "Sofia Mendoza",
        property: "Cozy Studio Boarding"
    },
    {
        id: 4,
        date: "2026-05-30",
        type: "damage_fixed",
        title: "Plumbing Repair Completed",
        description: "Fixed leaking pipe in bathroom unit 204",
        property: "Metro Central Tower"
    },
    {
        id: 5,
        date: "2026-06-01",
        type: "rent_due",
        title: "June Rent Due",
        description: "Monthly rent payment deadline",
        tenant: "All Tenants",
        property: "Multiple Properties",
        amount: "Various"
    },
    {
        id: 6,
        date: "2026-06-05",
        type: "maintenance",
        title: "AC Maintenance Scheduled",
        description: "Annual AC cleaning and maintenance",
        property: "Skyline Apartments"
    },
    {
        id: 7,
        date: "2026-06-10",
        type: "move_out",
        title: "Tenant Move Out",
        description: "Carmen Villanueva moving out",
        tenant: "Carmen Villanueva",
        property: "Villa Maria Boarding House"
    },
    {
        id: 8,
        date: "2026-06-15",
        type: "rent_due",
        title: "June Rent Due",
        description: "Monthly rent payment deadline",
        tenant: "All Tenants",
        property: "Multiple Properties",
        amount: "Various"
    },
    {
        id: 9,
        date: "2026-05-01",
        type: "maintenance",
        title: "Oten Repair",
        description: "Oten ko Malaki",
        tenant: "Norway Mangorangca",
        property: "Villa Norway"
    },
    {
        id: 10,
        date: "2026-05-26",
        type: "rent_paid",
        title: "Rent Payment Received",
        description: "Early payment for next month",
        tenant: "Ana Cruz",
        property: "Garden View Boarding House",
        amount: 3750
    },
    {
        id: 11,
        date: "2026-05-27",
        type: "maintenance",
        title: "Electrical Repair",
        description: "Faulty wiring in kitchen",
        tenant: "David Garcia",
        property: "Ocean View Apartment"
    },
    {
        id: 12,
        date: "2026-05-29",
        type: "damage_fixed",
        title: "Window Replacement",
        description: "Replaced broken window in living room",
        property: "Harbor View Apartment"
    }
];

const CalendarPage = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const getFilteredEvents = () => {
        if (filterType === "all") return mockEvents;
        return mockEvents.filter(event => event.type === filterType);
    };

    const filteredEvents = getFilteredEvents();

    const helpFeatures = [
        {
            title: "Click on Any Date",
            description:
                "Click any date on the calendar to view detailed information about events scheduled for that day."
        },
        {
            title: "Event Badges",
            description:
                "Color-coded badges on dates indicate different event types (Rent Due, Move In, Maintenance, etc.)."
        },
        {
            title: "Filter Events",
            description:
                "Use the filter dropdown to focus on specific event types like rent payments or maintenance schedules."
        },
        {
            title: "Property Management",
            description:
                "Track tenant move-ins/outs, rent collections, and property maintenance all in one place."
        },
        {
            title: "Month/Year Navigation",
            
            description:
                "Click on the month or year to quickly jump to any date, or use the arrow buttons to browse."
        }
    ];

    const filterOptions = [
        { value: "all", label: "All Events" },
        { value: "rent_due", label: "Rent Due" },
        { value: "rent_paid", label: "Rent Paid" },
        { value: "move_in", label: "Move In" },
        { value: "move_out", label: "Move Out" },
        { value: "maintenance", label: "Maintenance" },
        { value: "damage_fixed", label: "Damage Fixed" }
    ];

    const getFilterLabel = () => {
        const option = filterOptions.find(opt => opt.value === filterType);
        return option ? option.label : "All Events";
    };

    const handleDateSelect = date => {
        setSelectedDate(date);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="sm:hidden text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors p-2"
                        aria-label="Help"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Property Calendar
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track important dates, events, and property
                            activities.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2"
                    >
                        <HelpCircle size={20} />
                        <span className="font-medium">Help</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{getFilterLabel()}</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                            />
                        </button>

                        {showFilters && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowFilters(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                    {filterOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setFilterType(option.value);
                                                setShowFilters(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                                filterType === option.value
                                                    ? "bg-amber-50 text-amber-600 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Welcome Hero Box with Instructions */}
            <div className="mb-8">
                <WelcomeHeroBox
                    image={calendarImage}
                    title="Property Management Calendar"
                    message="Click any date for event details. Color badges show rent, move-ins, or maintenance. Use filter to focus. Track everything in one place."
                    imagePosition="left"
                />
            </div>

            {/* Calendar Section */}
            <div className="grid grid-cols-1 gap-6">
                <Calendar
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                    events={filteredEvents}
                />
            </div>

            {/* Date Details Modal */}
            <DateDetailsModal
                isOpen={isDetailsModalOpen}
                selectedDate={selectedDate}
                events={filteredEvents}
                onClose={() => setIsDetailsModalOpen(false)}
            />

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Calendar Help"
                description="Learn how to use the property management calendar effectively."
                features={helpFeatures}
            />
        </div>
    );
};

export default CalendarPage;
