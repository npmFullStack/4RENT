// src/features/(app)/pages/NewTenant.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Upload,
    X,
    MapPin,
    Bed,
    Bath,
    PhilippinePeso,
    Building2,
    Trash2,
    Plus,
    Image as ImageIcon,
    ChevronUp,
    Search,
    Users,
    CheckCircle,
    AlertCircle,
    Calendar as CalendarIcon,
    User,
    Mail,
    Phone,
    FileText,
Home
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Instructions from "../components/Instructions";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import DatePicker from "@/shared/components/DatePicker";
import Select from "@/shared/components/Select";

// Import property images (same as MyProperties)
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";

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
            { id: 1, name: "Bedroom #1", capacity: 4, gender: "female", currentOccupancy: 0, status: "vacant" },
            { id: 2, name: "Bedroom #2", capacity: 3, gender: "female", currentOccupancy: 2, status: "partial" }
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
            { id: 1, name: "Bedroom #1", capacity: 3, gender: "male", currentOccupancy: 3, status: "full" }
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
        sex: "female",
        status: "available",
        createdAt: "2024-03-15",
        bedrooms: [
            { id: 1, name: "Studio Room", capacity: 2, gender: "female", currentOccupancy: 1, status: "partial" }
        ]
    },
    {
        id: 6,
        image: property3,
        name: "Metro Central Tower",
        category: "apartment",
        address: "789 Business Ave, Barangay Commercial, Makati City, Philippines",
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
        sex: "female",
        status: "available",
        createdAt: "2024-02-10",
        bedrooms: [
            { id: 1, name: "Room A", capacity: 2, gender: "female", currentOccupancy: 1, status: "partial" },
            { id: 2, name: "Room B", capacity: 3, gender: "female", currentOccupancy: 1, status: "partial" }
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
            { id: 1, name: "Room 1", capacity: 2, gender: "male", currentOccupancy: 2, status: "full" },
            { id: 2, name: "Room 2", capacity: 2, gender: "male", currentOccupancy: 2, status: "full" }
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
    propertyId: generatePropertyId(property.id, property.category, property.createdAt)
}));

const NewTenant = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isInstructionsDrawerOpen, setIsInstructionsDrawerOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showRoomSelection, setShowRoomSelection] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        moveInDate: null,
        leaseEndDate: null
    });

    // Filtered properties based on search
    const filteredProperties = propertiesWithId.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.propertyId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Instructions items
    const instructionItems = [
        {
            title: "Tenant Information",
            description: "Enter the tenant's first name, last name, and contact details."
        },
        {
            title: "Select Property",
            description: "Search and select the property where the tenant will be assigned."
        },
        {
            title: "Select Room (Boarding Only)",
            description: "For boarding houses, select the specific room for the tenant."
        },
        {
            title: "Move In Date",
            description: "Set the date when the tenant will move in."
        },
        {
            title: "Lease End Date",
            description: "Set the lease end date for the contract period."
        }
    ];

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle property selection
    const handleSelectProperty = (property) => {
        setSelectedProperty(property);
        setSelectedRoom(null);
        
        // Check if property is boarding with multiple rooms
        if (property.category === "boarding" && property.bedrooms && property.bedrooms.length > 0) {
            // Filter available rooms (not full)
            const availableRooms = property.bedrooms.filter(room => room.status !== "full");
            if (availableRooms.length > 0) {
                setShowRoomSelection(true);
                Toast.info("Select Room", "Please select a room for this tenant.");
            } else {
                Toast.warning("No Available Rooms", "All rooms in this boarding house are full.");
                setSelectedProperty(null);
            }
        } else if (property.category === "apartment") {
            setShowRoomSelection(false);
            Toast.success("Property Selected", `${property.name} has been selected.`);
        }
    };

    // Handle room selection
    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        Toast.success("Room Selected", `${room.name} has been selected for this tenant.`);
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.firstName || !formData.lastName) {
            Toast.error("Missing Information", "Please enter tenant's first and last name.");
            return;
        }
        
        if (!selectedProperty) {
            Toast.error("Missing Information", "Please select a property.");
            return;
        }
        
        if (selectedProperty.category === "boarding" && !selectedRoom) {
            Toast.error("Missing Information", "Please select a room for the boarding house.");
            return;
        }
        
        if (!formData.moveInDate) {
            Toast.error("Missing Information", "Please select a move-in date.");
            return;
        }
        
        setIsSubmitting(true);

        const submitData = {
            ...formData,
            selectedProperty,
            selectedRoom: selectedRoom ? { ...selectedRoom, propertyId: selectedProperty.id } : null,
            moveInDate: formData.moveInDate?.toISOString(),
            leaseEndDate: formData.leaseEndDate?.toISOString()
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Form submitted:", submitData);
            
            Toast.success(
                "Tenant Added!", 
                `${formData.firstName} ${formData.lastName} has been successfully added to ${selectedProperty.name}.`
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
            description: "Search for properties by name, address, or Property ID."
        },
        {
            title: "Room Selection",
            description: "For boarding houses, select an available room for the tenant."
        },
        {
            title: "Lease Dates",
            description: "Set move-in date and lease end date for the contract."
        }
    ];

    // Get status badge for room
    const getRoomStatusBadge = (status) => {
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
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
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

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tenant@example.com"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+63 912 345 6789"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Move In Date and Lease End Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Move In Date
                                </label>
                                <DatePicker
                                    value={formData.moveInDate}
                                    onChange={(date) => setFormData(prev => ({ ...prev, moveInDate: date }))}
                                    placeholder="Select move-in date"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lease End Date
                                </label>
                                <DatePicker
                                    value={formData.leaseEndDate}
                                    onChange={(date) => setFormData(prev => ({ ...prev, leaseEndDate: date }))}
                                    placeholder="Select lease end date"
                                    minDate={formData.moveInDate || undefined}
                                />
                            </div>
                        </div>

                        {/* Property Selection Section */}
                        <div className="border-t border-gray-200 pt-6 mt-2">
                            <h3 className="text-md font-semibold text-gray-800 mb-4">
                                Property Assignment
                            </h3>

                            {/* Property Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by property name, address, or Property ID..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            {/* Property Cards Grid */}
                            {searchTerm && filteredProperties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {filteredProperties.map(property => (
                                        <div
                                            key={property.id}
                                            className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${
                                                selectedProperty?.id === property.id
                                                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                            }`}
                                            onClick={() => handleSelectProperty(property)}
                                        >
                                            <div className="flex p-3 gap-3">
                                                {/* Property Image */}
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={property.image}
                                                        alt={property.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                
                                                {/* Property Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-mono text-xs font-semibold text-gray-500">
                                                            {property.propertyId}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            color={property.category === "boarding" ? "blue" : "red"}
                                                            icon={property.category === "boarding" ? Bed : Home}
                                                            size="sm"
                                                        >
                                                            {property.category === "boarding" ? "Boarding" : "Apartment"}
                                                        </Badge>
                                                    </div>
                                                    <p className="font-semibold text-gray-800 text-sm truncate">
                                                        {property.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {property.address}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="font-semibold text-primary text-sm">
                                                            ₱{property.price.toLocaleString()}/month
                                                        </span>
                                                        {property.category === "boarding" && property.sex && (
                                                            <div className="flex items-center gap-1">
                                                                <img 
                                                                    src={property.sex === "male" ? MaleIcon : FemaleIcon} 
                                                                    alt={property.sex} 
                                                                    className="w-3.5 h-3.5" 
                                                                />
                                                                <span className="text-xs text-gray-600">
                                                                    {property.sex === "male" ? "Male Only" : "Female Only"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-3 pb-3">
                                                <button
                                                    type="button"
                                                    className={`w-full py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                                        selectedProperty?.id === property.id
                                                            ? "bg-primary text-gray-900"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {selectedProperty?.id === property.id ? "Selected" : "Select Property"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchTerm && filteredProperties.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No properties found matching "{searchTerm}"</p>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Start typing to search for properties</p>
                                </div>
                            )}

                            {/* Selected Property Display (when no search) */}
                            {selectedProperty && !searchTerm && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Property</h4>
                                    <div className="border border-primary rounded-xl overflow-hidden bg-primary/5">
                                        <div className="flex p-3 gap-3">
                                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={selectedProperty.image}
                                                    alt={selectedProperty.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-semibold text-gray-500">
                                                        {selectedProperty.propertyId}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        color={selectedProperty.category === "boarding" ? "blue" : "red"}
                                                        icon={selectedProperty.category === "boarding" ? Bed : Home}
                                                        size="sm"
                                                    >
                                                        {selectedProperty.category === "boarding" ? "Boarding" : "Apartment"}
                                                    </Badge>
                                                </div>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {selectedProperty.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {selectedProperty.address}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-semibold text-primary text-sm">
                                                        ₱{selectedProperty.price.toLocaleString()}/month
                                                    </span>
                                                    {selectedProperty.category === "boarding" && selectedProperty.sex && (
                                                        <div className="flex items-center gap-1">
                                                            <img 
                                                                src={selectedProperty.sex === "male" ? MaleIcon : FemaleIcon} 
                                                                alt={selectedProperty.sex} 
                                                                className="w-3.5 h-3.5" 
                                                            />
                                                            <span className="text-xs text-gray-600">
                                                                {selectedProperty.sex === "male" ? "Male Only" : "Female Only"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Room Selection for Boarding Houses */}
                            {showRoomSelection && selectedProperty && selectedProperty.category === "boarding" && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        Select Room for {selectedProperty.name}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedProperty.bedrooms?.map(room => {
                                            const { icon: StatusIcon, label: statusLabel, color: statusColor } = getRoomStatusBadge(room.status);
                                            return (
                                                <div
                                                    key={room.id}
                                                    className={`border rounded-lg p-3 transition-all cursor-pointer ${
                                                        selectedRoom?.id === room.id
                                                            ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    } ${room.status === "full" ? "opacity-60 cursor-not-allowed" : ""}`}
                                                    onClick={() => room.status !== "full" && handleSelectRoom(room)}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-gray-800">{room.name}</span>
                                                        <Badge variant="soft" color={statusColor} icon={StatusIcon} size="sm">
                                                            {statusLabel}
                                                            {room.status === "partial" && ` (${room.currentOccupancy}/${room.capacity})`}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            <span>Capacity: {room.capacity} persons</span>
                                                        </div>
                                                        {room.gender && (
                                                            <div className="flex items-center gap-1">
                                                                <img 
                                                                    src={room.gender === "male" ? MaleIcon : FemaleIcon} 
                                                                    alt={room.gender} 
                                                                    className="w-3 h-3" 
                                                                />
                                                                <span>{room.gender === "male" ? "Male" : "Female"} Only</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {room.status === "partial" && (
                                                        <p className="text-xs text-orange-600 mt-2">
                                                            {room.capacity - room.currentOccupancy} slot(s) available
                                                        </p>
                                                    )}
                                                    {room.status === "full" && (
                                                        <p className="text-xs text-red-500 mt-2">
                                                            Room is fully occupied
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                {isSubmitting ? "Adding Tenant..." : "Add Tenant"}
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
                                onClick={() => setIsInstructionsDrawerOpen(false)}
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