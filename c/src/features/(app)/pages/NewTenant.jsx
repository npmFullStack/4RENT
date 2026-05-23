// src/features/(app)/pages/NewTenant.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    X,
    Bed,
    Home,
    Trash2,
    Plus,
    Search,
    Users,
    CheckCircle,
    AlertCircle,
    Calendar as CalendarIcon,
    User,
    ChevronDown,
    ChevronUp,
    ArrowRight
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Instructions from "../components/Instructions";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import DatePicker from "@/shared/components/DatePicker";

// Import property images (same as MyProperties)
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";
import MixedIcon from "@/assets/icons/mixed.svg";

// Helper function to generate property ID
const generatePropertyId = (id, category, createdAt) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

// Mock properties data (from MyProperties)
const mockProperties = [
    {
        id: 1,
        image: property1,
        name: "Sunset Boarding House",
        category: "boarding",
        address: "123 Sunset Blvd, Barangay Sunset, Manila, Philippines",
        price: 4850,
        capacity: 4,
        currentTenants: 0,
        sex: "female",
        status: "available",
        createdAt: "2024-01-15",
        bedrooms: [
            {
                id: 1,
                name: "Bedroom #1",
                capacity: 4,
                gender: "female",
                currentOccupancy: 0,
                status: "vacant"
            },
            {
                id: 2,
                name: "Bedroom #2",
                capacity: 3,
                gender: "female",
                currentOccupancy: 2,
                status: "partial"
            }
        ]
    },
    {
        id: 2,
        image: property2,
        name: "Downtown Luxury Apartment",
        category: "apartment",
        address: "456 Main St, Barangay Central, Quezon City, Philippines",
        price: 12500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-02-20",
        bedrooms: []
    },
    {
        id: 3,
        image: property3,
        name: "Garden View Boarding House",
        category: "boarding",
        address: "789 Oak Ave, Barangay Riverside, Cebu City, Philippines",
        price: 3750,
        capacity: 3,
        currentTenants: 3,
        sex: "male",
        status: "full",
        createdAt: "2024-01-10",
        bedrooms: [
            {
                id: 1,
                name: "Bedroom #1",
                capacity: 3,
                gender: "male",
                currentOccupancy: 3,
                status: "full"
            }
        ]
    },
    {
        id: 4,
        image: property1,
        name: "Ocean View Apartment",
        category: "apartment",
        address: "321 Beach Road, Barangay Seaside, Davao City, Philippines",
        price: 18500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "rented",
        createdAt: "2024-03-01",
        bedrooms: []
    },
    {
        id: 5,
        image: property2,
        name: "Cozy Studio Boarding",
        category: "boarding",
        address: "555 Peace St, Barangay Harmony, Cebu City, Philippines",
        price: 4200,
        capacity: 2,
        currentTenants: 1,
        sex: "mixed",
        status: "available",
        createdAt: "2024-03-15",
        bedrooms: [
            {
                id: 1,
                name: "Studio Room",
                capacity: 2,
                gender: "female",
                currentOccupancy: 1,
                status: "partial"
            }
        ]
    },
    {
        id: 6,
        image: property3,
        name: "Metro Central Tower",
        category: "apartment",
        address:
            "789 Business Ave, Barangay Commercial, Makati City, Philippines",
        price: 22500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-01-20",
        bedrooms: []
    },
    {
        id: 7,
        image: property1,
        name: "Greenfield Boarding House",
        category: "boarding",
        address: "456 Eco Park, Barangay Greenfield, Laguna, Philippines",
        price: 3500,
        capacity: 5,
        currentTenants: 2,
        sex: "mixed",
        status: "available",
        createdAt: "2024-02-10",
        bedrooms: [
            {
                id: 1,
                name: "Room A",
                capacity: 2,
                gender: "female",
                currentOccupancy: 1,
                status: "partial"
            },
            {
                id: 2,
                name: "Room B",
                capacity: 3,
                gender: "male",
                currentOccupancy: 1,
                status: "partial"
            }
        ]
    },
    {
        id: 8,
        image: property2,
        name: "Skyline Apartments",
        category: "apartment",
        address: "123 High Street, Barangay Central, BGC, Philippines",
        price: 35000,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "rented",
        createdAt: "2024-01-05",
        bedrooms: []
    },
    {
        id: 9,
        image: property3,
        name: "Villa Maria Boarding House",
        category: "boarding",
        address: "789 St. Mary Street, Barangay Maria, Bulacan, Philippines",
        price: 4200,
        capacity: 4,
        currentTenants: 4,
        sex: "male",
        status: "full",
        createdAt: "2024-03-20",
        bedrooms: [
            {
                id: 1,
                name: "Room 1",
                capacity: 2,
                gender: "male",
                currentOccupancy: 2,
                status: "full"
            },
            {
                id: 2,
                name: "Room 2",
                capacity: 2,
                gender: "male",
                currentOccupancy: 2,
                status: "full"
            }
        ]
    },
    {
        id: 10,
        image: property1,
        name: "Harbor View Apartment",
        category: "apartment",
        address: "555 Port Street, Barangay Harbor, Batangas, Philippines",
        price: 15500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-02-28",
        bedrooms: []
    }
];

// Add propertyId to each mock property
const propertiesWithId = mockProperties.map(property => ({
    ...property,
    propertyId: generatePropertyId(
        property.id,
        property.category,
        property.createdAt
    )
}));

const NewTenant = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isInstructionsDrawerOpen, setIsInstructionsDrawerOpen] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);

    // Form state - only first name, last name, and move in date
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        moveInDate: null
    });

    // Determine which properties to display
    const displayedProperties = selectedProperty
        ? [selectedProperty] // Show only selected property if one is selected
        : propertiesWithId; // Show all properties if no property selected

    // Filtered properties based on search (only applies when no property is selected)
    const filteredProperties = selectedProperty
        ? displayedProperties // No filtering when a property is selected
        : displayedProperties.filter(
              property =>
                  property.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  property.address
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  property.propertyId
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
          );

    // Instructions items
    const instructionItems = [
        {
            title: "Tenant Information",
            description:
                "Enter the tenant's first name, last name, and move-in date."
        },
        {
            title: "Select Property",
            description:
                "Search and select the property where the tenant will be assigned."
        },
        {
            title: "Select Room (Boarding Only)",
            description:
                "For boarding houses, select the specific room for the tenant."
        }
    ];

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle property selection (selects the property without expanding)
    const handleSelectProperty = property => {
        setSelectedProperty(property);
        setSelectedRoom(null);

        // Auto-expand if boarding house with rooms
        if (
            property.category === "boarding" &&
            property.bedrooms &&
            property.bedrooms.length > 0
        ) {
            setExpandedPropertyId(property.id);
        } else {
            setExpandedPropertyId(null);
        }

        Toast.info("Property Selected", `${property.name} has been selected.`);
    };

    // Handle clear property selection
    const handleClearPropertySelection = () => {
        setSelectedProperty(null);
        setSelectedRoom(null);
        setExpandedPropertyId(null);
        Toast.info(
            "Property Selection Cleared",
            "You can now select a different property."
        );
    };

    // Toggle property expansion
    const toggleExpand = propertyId => {
        if (expandedPropertyId === propertyId) {
            setExpandedPropertyId(null);
        } else {
            setExpandedPropertyId(propertyId);
        }
    };

    // Handle room selection
    const handleSelectRoom = room => {
        if (room.status === "full") {
            Toast.warning("Room Full", "This room is already fully occupied.");
            return;
        }
        setSelectedRoom(room);
        Toast.success(
            "Room Selected",
            `${room.name} has been selected for this tenant.`
        );
    };

    // Handle form submission - no validation
    const handleSubmit = async e => {
        e.preventDefault();

        setIsSubmitting(true);

        const submitData = {
            ...formData,
            selectedProperty,
            selectedRoom: selectedRoom
                ? { ...selectedRoom, propertyId: selectedProperty?.id }
                : null,
            moveInDate: formData.moveInDate?.toISOString()
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Form submitted:", submitData);

            Toast.success(
                "Tenant Added!",
                `${formData.firstName || "New Tenant"} has been successfully added.`
            );

            setTimeout(() => {
                navigate("/tenants");
            }, 1500);
        } catch (error) {
            console.error("Error submitting form:", error);
            Toast.error(
                "Submission Failed",
                "There was an error adding the tenant. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Adding a New Tenant",
            description: "Fill in tenant details and assign them to a property."
        },
        {
            title: "Property Search",
            description:
                "Search for properties by name, address, or Property ID."
        },
        {
            title: "Room Selection",
            description:
                "For boarding houses, select an available room for the tenant."
        }
    ];

    // Get status badge for room
    const getRoomStatusBadge = status => {
        switch (status) {
            case "vacant":
                return { icon: CheckCircle, label: "Vacant", color: "green" };
            case "partial":
                return { icon: Users, label: "Has Tenants", color: "orange" };
            case "full":
                return { icon: AlertCircle, label: "Full", color: "red" };
            default:
                return { icon: AlertCircle, label: "Unknown", color: "gray" };
        }
    };

    // Get gender icon and label
    const getGenderInfo = sex => {
        switch (sex) {
            case "male":
                return { icon: MaleIcon, label: "Male Only" };
            case "female":
                return { icon: FemaleIcon, label: "Female Only" };
            case "mixed":
                return { icon: MixedIcon, label: "Mixed" };
            default:
                return null;
        }
    };

    // Get room gender icon
    const getRoomGenderIcon = gender => {
        switch (gender) {
            case "male":
                return MaleIcon;
            case "female":
                return FemaleIcon;
            default:
                return null;
        }
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs
                    items={[
                        { label: "Tenants", path: "/tenants" },
                        { label: "New Tenant", path: "/new-tenant" }
                    ]}
                />
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="sm:hidden text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors p-2"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            New Tenant
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Register a new tenant and assign them to a property.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2"
                    >
                        <HelpCircle size={20} />
                        <span className="font-medium">Help</span>
                    </button>
                </div>
            </div>

            {/* Form and Instructions Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Section */}
                <div className="flex-1">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">
                            Tenant Information
                        </h2>

                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g., Juan"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g., Dela Cruz"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Move In Date only */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Move In Date
                            </label>
                            <DatePicker
                                value={formData.moveInDate}
                                onChange={date =>
                                    setFormData(prev => ({
                                        ...prev,
                                        moveInDate: date
                                    }))
                                }
                                placeholder="Select move-in date"
                            />
                        </div>

                        {/* Property Selection Section */}
                        <div className="border-t border-gray-200 pt-6 mt-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-semibold text-gray-800">
                                    Property Assignment
                                </h3>
                                {selectedProperty && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearPropertySelection}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear Selection
                                    </Button>
                                )}
                            </div>

                            {/* Property Search - Only show when no property selected */}
                            {!selectedProperty && (
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e =>
                                                setSearchTerm(e.target.value)
                                            }
                                            placeholder="Search by property name, address, or Property ID..."
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Property Cards - 1 per row */}
                            <div className="space-y-3">
                                {filteredProperties.map(property => {
                                    const genderInfo = getGenderInfo(
                                        property.sex
                                    );
                                    const isSelected =
                                        selectedProperty?.id === property.id;
                                    const isExpanded =
                                        expandedPropertyId === property.id;
                                    const hasRooms =
                                        property.category === "boarding" &&
                                        property.bedrooms?.length > 0;

                                    return (
                                        <div
                                            key={property.id}
                                            className={`border rounded-xl overflow-hidden transition-all ${
                                                isSelected
                                                    ? "border-gray-800 ring-2 ring-gray-200 bg-white"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            {/* Property Card */}
                                            <div className="p-4">
                                                <div className="flex gap-4">
                                                    {/* Property Image */}
                                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={property.image}
                                                            alt={property.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Property Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                                                            <span className="font-mono text-xs font-semibold text-gray-500">
                                                                {
                                                                    property.propertyId
                                                                }
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    color={
                                                                        property.category ===
                                                                        "boarding"
                                                                            ? "blue"
                                                                            : "red"
                                                                    }
                                                                    icon={
                                                                        property.category ===
                                                                        "boarding"
                                                                            ? Bed
                                                                            : Home
                                                                    }
                                                                    size="sm"
                                                                >
                                                                    {property.category ===
                                                                    "boarding"
                                                                        ? "Boarding"
                                                                        : "Apartment"}
                                                                </Badge>
                                                                {hasRooms && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleExpand(
                                                                                property.id
                                                                            )
                                                                        }
                                                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                                    >
                                                                        {isExpanded ? (
                                                                            <ChevronUp className="w-4 h-4" />
                                                                        ) : (
                                                                            <ChevronDown className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">
                                                            {property.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {property.address}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-semibold text-gray-800">
                                                                    ₱
                                                                    {property.price.toLocaleString()}
                                                                    /month
                                                                </span>
                                                                {genderInfo && (
                                                                    <div className="flex items-center gap-1">
                                                                        <img
                                                                            src={
                                                                                genderInfo.icon
                                                                            }
                                                                            alt={
                                                                                genderInfo.label
                                                                            }
                                                                            className="w-3.5 h-3.5"
                                                                        />
                                                                        <span className="text-xs text-gray-600">
                                                                            {
                                                                                genderInfo.label
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Property Select Button - bg-gray-800 with white text */}
                                                            {!isSelected ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSelectProperty(
                                                                            property
                                                                        )
                                                                    }
                                                                    className="px-5 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                                                                >
                                                                    Select
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="px-4 py-1.5 text-sm bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-1"
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    Selected
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable Rooms Section (for boarding houses) */}
                                            {isExpanded && hasRooms && (
                                                <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                        Available Rooms
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {property.bedrooms.map(
                                                            room => {
                                                                const {
                                                                    icon: StatusIcon,
                                                                    label: statusLabel,
                                                                    color: statusColor
                                                                } = getRoomStatusBadge(
                                                                    room.status
                                                                );
                                                                const roomGenderIcon =
                                                                    getRoomGenderIcon(
                                                                        room.gender
                                                                    );
                                                                const isRoomSelected =
                                                                    selectedRoom?.id ===
                                                                        room.id &&
                                                                    selectedProperty?.id ===
                                                                        property.id;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            room.id
                                                                        }
                                                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                                                            isRoomSelected
                                                                                ? "border-gray-300 bg-gray-50"
                                                                                : room.status ===
                                                                                    "full"
                                                                                  ? "border-gray-200 bg-gray-100 opacity-60"
                                                                                  : "border-gray-200 bg-white hover:border-gray-300"
                                                                        }`}
                                                                    >
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-3 mb-1">
                                                                                <span className="font-medium text-gray-800">
                                                                                    {
                                                                                        room.name
                                                                                    }
                                                                                </span>
                                                                                <Badge
                                                                                    variant="soft"
                                                                                    color={
                                                                                        statusColor
                                                                                    }
                                                                                    icon={
                                                                                        StatusIcon
                                                                                    }
                                                                                    size="sm"
                                                                                >
                                                                                    {
                                                                                        statusLabel
                                                                                    }
                                                                                    {room.status ===
                                                                                        "partial" &&
                                                                                        ` (${room.currentOccupancy}/${room.capacity})`}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                                <div className="flex items-center gap-1">
                                                                                    <Users className="w-3 h-3" />
                                                                                    <span>
                                                                                        Capacity:{" "}
                                                                                        {
                                                                                            room.capacity
                                                                                        }{" "}
                                                                                        persons
                                                                                    </span>
                                                                                </div>
                                                                                {roomGenderIcon && (
                                                                                    <div className="flex items-center gap-1">
                                                                                        <img
                                                                                            src={
                                                                                                roomGenderIcon
                                                                                            }
                                                                                            alt={
                                                                                                room.gender
                                                                                            }
                                                                                            className="w-3 h-3"
                                                                                        />
                                                                                        <span>
                                                                                            {room.gender ===
                                                                                            "male"
                                                                                                ? "Male Only"
                                                                                                : "Female Only"}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {room.status ===
                                                                                    "partial" && (
                                                                                    <span className="text-orange-600">
                                                                                        {room.capacity -
                                                                                            room.currentOccupancy}{" "}
                                                                                        slot(s)
                                                                                        available
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {/* Room Select Button - bg-gray-800 with white text */}
                                                                        {!isRoomSelected ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleSelectRoom(
                                                                                        room
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    room.status ===
                                                                                    "full"
                                                                                }
                                                                                className={`px-3 py-2 text-xs rounded-lg flex items-center gap-1 transition-colors ml-3 ${
                                                                                    room.status ===
                                                                                    "full"
                                                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                                        : "bg-gray-800 text-white hover:bg-gray-700"
                                                                                }`}
                                                                            >
                                                                                Select
                                                                                Room
                                                                                <ArrowRight className="w-3 h-3" />
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                disabled
                                                                                className="px-3 py-1 text-xs bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-1 ml-3"
                                                                            >
                                                                                <CheckCircle className="w-3 h-3" />
                                                                                Selected
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {!selectedProperty &&
                                filteredProperties.length === 0 &&
                                searchTerm && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>
                                            No properties found matching "
                                            {searchTerm}"
                                        </p>
                                    </div>
                                )}

                            {!selectedProperty &&
                                filteredProperties.length === 0 &&
                                !searchTerm && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Home className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>
                                            Start typing to search for
                                            properties
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/tenants")}
                                className="w-full sm:flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                icon={Plus}
                                className="w-full sm:flex-1"
                            >
                                {isSubmitting
                                    ? "Adding Tenant..."
                                    : "Add Tenant"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Instructions - Desktop */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                    <Instructions
                        title="How to Add a Tenant"
                        items={instructionItems}
                    />
                </div>
            </div>

            {/* Floating Help Button - Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsInstructionsDrawerOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                >
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Instructions Drawer - Mobile */}
            {isInstructionsDrawerOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-50"
                        onClick={() => setIsInstructionsDrawerOpen(false)}
                    />
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <button
                                onClick={() =>
                                    setIsInstructionsDrawerOpen(false)
                                }
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4">
                            <Instructions
                                title="How to Add a Tenant"
                                items={instructionItems}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="New Tenant Help"
                description="Learn how to add a new tenant to your property."
                features={helpFeatures}
            />
        </div>
    );
};

export default NewTenant;
