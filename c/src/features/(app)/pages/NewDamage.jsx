// src/features/(app)/pages/NewDamage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    X,
    Bed,
    Home,
    Search,
    CheckCircle,
    AlertCircle,
    Calendar as CalendarIcon,
    DollarSign,
    FileText,
    Wrench,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Instructions from "../components/Instructions";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import DatePicker from "@/shared/components/DatePicker";

// Import property images (same as NewTenant/MyProperties)
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Helper function to generate property ID
const generatePropertyId = (id, category, createdAt) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

// Mock properties data (reused from NewTenant)
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
        bedrooms: []
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
        bedrooms: []
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
        bedrooms: []
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
        bedrooms: []
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
        bedrooms: []
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

const NewDamage = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isInstructionsDrawerOpen, setIsInstructionsDrawerOpen] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        damageName: "",
        dateIssued: new Date() // Default to today's date
    });

    // Determine which properties to display
    const displayedProperties = selectedProperty
        ? [selectedProperty]
        : propertiesWithId;

    // Filtered properties based on search
    const filteredProperties = selectedProperty
        ? displayedProperties
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
            title: "Damage Information",
            description:
                "Enter the damage name and the date it was reported."
        },
        {
            title: "Select Property",
            description:
                "Search and select the property where the damage occurred."
        },
        {
            title: "Date Issued",
            description:
                "The date when the damage was reported or discovered (defaults to today)."
        }
    ];

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle property selection
    const handleSelectProperty = property => {
        setSelectedProperty(property);
        setExpandedPropertyId(null);
        Toast.info("Property Selected", `${property.name} has been selected.`);
    };

    // Handle clear property selection
    const handleClearPropertySelection = () => {
        setSelectedProperty(null);
        Toast.info(
            "Property Selection Cleared",
            "You can now select a different property."
        );
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();

        // Basic validation
        if (!formData.damageName.trim()) {
            Toast.warning("Missing Information", "Please enter a damage name.");
            return;
        }
        if (!selectedProperty) {
            Toast.warning("Missing Information", "Please select a property.");
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            damageName: formData.damageName,
            selectedProperty: {
                id: selectedProperty.id,
                name: selectedProperty.name,
                propertyId: selectedProperty.propertyId,
                category: selectedProperty.category,
                address: selectedProperty.address
            },
            dateIssued: formData.dateIssued?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            status: "pending"
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Damage report submitted:", submitData);

            Toast.success(
                "Damage Reported!",
                `${formData.damageName} has been reported successfully.`
            );

            setTimeout(() => {
                navigate("/repairs");
            }, 1500);
        } catch (error) {
            console.error("Error submitting damage report:", error);
            Toast.error(
                "Submission Failed",
                "There was an error reporting the damage. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Reporting a Damage",
            description: "Enter damage details and assign it to a property."
        },
        {
            title: "Property Search",
            description:
                "Search for properties by name, address, or Property ID."
        },
        {
            title: "Date Tracking",
            description:
                "Record when the damage was reported for maintenance records."
        }
    ];

    // Get category badge
    const getCategoryBadge = category => {
        if (category === "boarding") {
            return { icon: Bed, label: "Boarding", color: "blue" };
        }
        return { icon: Home, label: "Apartment", color: "red" };
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs
                    items={[
                        { label: "Repairs", path: "/repairs" },
                        { label: "New Damage", path: "/new-damage" }
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
                            New Damage Report
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Report a new damage or repair issue for a property.
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
                            Damage Information
                        </h2>

                        {/* Damage Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Damage Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="damageName"
                                    value={formData.damageName}
                                    onChange={handleChange}
                                    placeholder="e.g., Broken Window, Leaking Pipe, etc."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        {/* Date Issued */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date Issued
                            </label>
                            <DatePicker
                                value={formData.dateIssued}
                                onChange={date =>
                                    setFormData(prev => ({
                                        ...prev,
                                        dateIssued: date
                                    }))
                                }
                                placeholder="Select date issued"
                            />
                        </div>

                        {/* Property Selection Section */}
                        <div className="border-t border-gray-200 pt-6 mt-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-md font-semibold text-gray-800">
                                    Property Damaged <span className="text-red-500">*</span>
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

                            {/* Property Cards */}
                            <div className="space-y-3">
                                {filteredProperties.map(property => {
                                    const isSelected =
                                        selectedProperty?.id === property.id;
                                    const categoryBadge = getCategoryBadge(property.category);

                                    return (
                                        <div
                                            key={property.id}
                                            className={`border rounded-xl overflow-hidden transition-all ${
                                                isSelected
                                                    ? "border-gray-800 ring-2 ring-gray-200 bg-white"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
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
                                                                {property.propertyId}
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                color={categoryBadge.color}
                                                                icon={categoryBadge.icon}
                                                                size="sm"
                                                            >
                                                                {categoryBadge.label}
                                                            </Badge>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">
                                                            {property.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {property.address}
                                                        </p>
                                                        <div className="flex items-center justify-end mt-2">
                                                            {/* Property Select Button */}
                                                            {!isSelected ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSelectProperty(property)
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
                                onClick={() => navigate("/repairs")}
                                className="w-full sm:flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                icon={Wrench}
                                className="w-full sm:flex-1"
                            >
                                {isSubmitting
                                    ? "Reporting Damage..."
                                    : "Report Damage"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Instructions - Desktop */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                    <Instructions
                        title="How to Report a Damage"
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
                                title="How to Report a Damage"
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
                title="New Damage Report Help"
                description="Learn how to report a new damage or repair issue."
                features={helpFeatures}
            />
        </div>
    );
};

export default NewDamage;