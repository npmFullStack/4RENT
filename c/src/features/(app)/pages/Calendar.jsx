// src/features/(app)/pages/Calendar.jsx
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
import DateDetails from "@/features/(app)/components/DateDetails";
import welcomeHeroImage from "@/assets/images/welcome-hero-box.png";

// Mock events data
const mockEvents = [
    {
        id: 1,
        date: "2026-05-25",
        type: "rent_due",
        title: "Monthly Rent Due",
        description: "Rent payment for Sunset Boarding House",
        tenant: "Maria Santos",
        property: "Sunset Boarding House",
        amount: 4850,
        time: "All day"
    },
    {
        id: 2,
        date: "2026-05-25",
        type: "rent_paid",
        title: "Rent Payment Received",
        description: "Monthly rent payment received",
        tenant: "John Reyes",
        property: "Downtown Luxury Apartment",
        amount: 12500,
        time: "2:30 PM"
    },
    {
        id: 3,
        date: "2026-05-28",
        type: "move_in",
        title: "New Tenant Move In",
        description: "Sofia Mendoza moving into Cozy Studio Boarding",
        tenant: "Sofia Mendoza",
        property: "Cozy Studio Boarding",
        time: "10:00 AM"
    },
    {
        id: 4,
        date: "2026-05-30",
        type: "damage_fixed",
        title: "Plumbing Repair Completed",
        description: "Fixed leaking pipe in bathroom unit 204",
        property: "Metro Central Tower",
        time: "3:00 PM"
    },
    {
        id: 5,
        date: "2026-06-01",
        type: "rent_due",
        title: "June Rent Due",
        description: "Monthly rent payment deadline",
        tenant: "All Tenants",
        property: "Multiple Properties",
        amount: "Various",
        time: "All day"
    },
    {
        id: 6,
        date: "2026-06-05",
        type: "maintenance",
        title: "AC Maintenance Scheduled",
        description: "Annual AC cleaning and maintenance",
        property: "Skyline Apartments",
        time: "9:00 AM - 12:00 PM"
    },
    {
        id: 7,
        date: "2026-06-10",
        type: "move_out",
        title: "Tenant Move Out",
        description: "Carmen Villanueva moving out",
        tenant: "Carmen Villanueva",
        property: "Villa Maria Boarding House",
        time: "11:00 AM"
    },
    {
        id: 8,
        date: "2026-06-15",
        type: "inspection",
        title: "Quarterly Property Inspection",
        description: "Routine property inspection for all units",
        property: "All Properties",
        time: "9:00 AM - 5:00 PM"
    },
    {
        id: 9,
        date: "2026-06-20",
        type: "lease_renewal",
        title: "Lease Renewal Deadline",
        description: "Last day to renew lease for March move-ins",
        tenant: "Multiple Tenants",
        property: "Various Properties",
        time: "5:00 PM"
    },
    {
        id: 10,
        date: "2026-05-26",
        type: "rent_paid",
        title: "Rent Payment Received",
        description: "Early payment for next month",
        tenant: "Ana Cruz",
        property: "Garden View Boarding House",
        amount: 3750,
        time: "10:15 AM"
    },
    {
        id: 11,
        date: "2026-05-27",
        type: "maintenance",
        title: "Electrical Repair",
        description: "Faulty wiring in kitchen",
        tenant: "David Garcia",
        property: "Ocean View Apartment",
        time: "1:00 PM"
    },
    {
        id: 12,
        date: "2026-05-29",
        type: "damage_fixed",
        title: "Window Replacement",
        description: "Replaced broken window in living room",
        property: "Harbor View Apartment",
        time: "2:00 PM"
    }
];

const CalendarPage = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Filter events based on selected filter type
    const getFilteredEvents = () => {
        if (filterType === "all") return mockEvents;
        return mockEvents.filter(event => event.type === filterType);
    };

    const filteredEvents = getFilteredEvents();

    // Help features
    const helpFeatures = [
        {
            title: "Calendar Overview",
            description:
                "View all important dates including rent due dates, move-ins, maintenance schedules, and more."
        },
        {
            title: "Event Badges",
            description:
                "Small colored dots on dates indicate different event types. Hover to see event count."
        },
        {
            title: "Date Details",
            description:
                "Click any date to view detailed information about events scheduled for that day."
        },
        {
            title: "Filter Events",
            description:
                "Use the filter dropdown to focus on specific event types like rent payments or maintenance."
        },
        {
            title: "Property Management",
            description:
                "Track tenant move-ins/outs, rent collections, and property maintenance all in one place."
        }
    ];

    // Filter options for dropdown
    const filterOptions = [
        { value: "all", label: "All Events" },
        { value: "rent_due", label: "Rent Due" },
        { value: "rent_paid", label: "Rent Paid" },
        { value: "move_in", label: "Move In" },
        { value: "move_out", label: "Move Out" },
        { value: "maintenance", label: "Maintenance" },
        { value: "damage_fixed", label: "Damage Fixed" },
        { value: "lease_renewal", label: "Lease Renewal" },
        { value: "inspection", label: "Inspection" }
    ];

    const getFilterLabel = () => {
        const option = filterOptions.find(opt => opt.value === filterType);
        return option ? option.label : "All Events";
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
                            Calendar
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track important dates, events, and property
                            activities.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    {/* Help Button (Desktop) */}
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2"
                    >
                        <HelpCircle size={20} />
                        <span className="font-medium">Help</span>
                    </button>

                    {/* Filter Dropdown */}
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

            {/* Welcome Hero Box - Image on LEFT, message on RIGHT */}
            <div className="mb-8">
                <WelcomeHeroBox
                    image={welcomeHeroImage}
                    title="Property Management Calendar"
                    message="Stay on top of all your property events including rent due dates, tenant move-ins, maintenance schedules, and more. Click any date to view detailed information."
                    imagePosition="left"
                />
            </div>

            {/* Calendar and Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Component - takes 2/3 on large screens */}
                <div className="lg:col-span-2">
                    <Calendar
                        onDateSelect={setSelectedDate}
                        selectedDate={selectedDate}
                        events={filteredEvents}
                    />
                </div>

                {/* Date Details Component - takes 1/3 on large screens */}
                <div className="lg:col-span-1">
                    <DateDetails
                        selectedDate={selectedDate}
                        events={filteredEvents}
                        onClose={() => setSelectedDate(null)}
                    />
                </div>
            </div>

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
