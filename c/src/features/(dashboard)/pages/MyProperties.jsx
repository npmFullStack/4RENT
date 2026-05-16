// src/features/(dashboard)/pages/MyProperties.jsx
import React, { useState } from "react";
import { HelpCircle, Plus, Building2, Home, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import FilterMenu from "@/shared/components/FilterMenu";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Mock data for properties
const mockProperties = [
    {
        id: 1,
        image: property1,
        name: "Sunset Boarding House",
        category: "boarding",
        address: "123 Sunset Blvd, Barangay Sunset, Manila, Philippines",
        price: 4850,
        capacity: 2,
        sex: "female",
        status: "active",
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        image: property2,
        name: "Downtown Luxury Apartment",
        category: "apartment",
        address: "456 Main St, Barangay Central, Quezon City, Philippines",
        price: 12500,
        capacity: null,
        sex: null,
        status: "active",
        createdAt: "2024-02-20"
    },
    {
        id: 3,
        image: property3,
        name: "Garden View Boarding House",
        category: "boarding",
        address: "789 Oak Ave, Barangay Riverside, Cebu City, Philippines",
        price: 3750,
        capacity: 3,
        sex: "male",
        status: "inactive",
        createdAt: "2024-01-10"
    },
    {
        id: 4,
        image: property1,
        name: "Ocean View Apartment",
        category: "apartment",
        address: "321 Beach Road, Barangay Seaside, Davao City, Philippines",
        price: 18500,
        capacity: null,
        sex: null,
        status: "active",
        createdAt: "2024-03-01"
    }
];

const MyProperties = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isNewPropertyDropdownOpen, setIsNewPropertyDropdownOpen] = useState(false);
    const [properties, setProperties] = useState(mockProperties);
    const [filters, setFilters] = useState({
        category: "all",
        status: "all",
        priceRange: { min: "", max: "" }
    });

    const getCapacityText = (capacity) => {
        if (capacity === 1) return "1 person/room";
        if (capacity === 2) return "2 persons/room";
        if (capacity === 3) return "3 persons/room";
        if (capacity >= 4) return `${capacity}+ persons/room`;
        return "N/A";
    };

    const getSexText = (sex) => {
        if (sex === "male") return "Male Only";
        if (sex === "female") return "Female Only";
        return "Mixed";
    };

    // Handle view details
    const handleViewDetails = (property) => {
        console.log("View details:", property);
        // Navigate to property details or open modal
    };

    // Handle edit
    const handleEdit = (property) => {
        console.log("Edit property:", property);
    };

    // Handle delete
    const handleDelete = (property) => {
        if (window.confirm(`Are you sure you want to delete "${property.name}"?`)) {
            setProperties(properties.filter(p => p.id !== property.id));
        }
    };

    // Handle new property creation
    const handleNewProperty = (type) => {
        console.log(`Create new ${type}`);
        setIsNewPropertyDropdownOpen(false);
        // Navigate to create property page or open modal
    };

    // Filter properties
    const getFilteredProperties = () => {
        return properties.filter(property => {
            // Category filter
            const matchesCategory = filters.category === "all" || property.category === filters.category;
            
            // Status filter
            const matchesStatus = filters.status === "all" || property.status === filters.status;
            
            // Price range filter
            let matchesPrice = true;
            if (filters.priceRange.min && property.price < parseInt(filters.priceRange.min)) {
                matchesPrice = false;
            }
            if (filters.priceRange.max && property.price > parseInt(filters.priceRange.max)) {
                matchesPrice = false;
            }
            
            return matchesCategory && matchesStatus && matchesPrice;
        });
    };

    const filteredProperties = getFilteredProperties();
    const activeFiltersCount = () => {
        let count = 0;
        if (filters.category !== "all") count++;
        if (filters.status !== "all") count++;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        return count;
    };

    // Table columns configuration
    const columns = [
        {
            key: "image",
            header: "Image",
            sortable: false,
            width: "80px",
            render: (row) => (
                <img 
                    src={row.image} 
                    alt={row.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                />
            )
        },
        {
            key: "name",
            header: "Property Name",
            sortable: true,
            className: "font-medium text-gray-800"
        },
        {
            key: "category",
            header: "Category",
            sortable: true,
            render: (row) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    row.category === "boarding" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-red-100 text-red-700"
                }`}>
                    {row.category === "boarding" ? (
                        <Building2 className="w-3 h-3" />
                    ) : (
                        <Home className="w-3 h-3" />
                    )}
                    {row.category === "boarding" ? "Boarding House" : "Apartment"}
                </span>
            )
        },
        {
            key: "address",
            header: "Address",
            sortable: true,
            render: (row) => (
                <div className="max-w-xs">
                    <p className="truncate">{row.address}</p>
                </div>
            )
        },
        {
            key: "price",
            header: "Rent / Month",
            sortable: true,
            render: (row) => (
                <span className="font-semibold text-gray-800">
                    ₱{row.price.toLocaleString()}
                </span>
            )
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            render: (row) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    row.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                }`}>
                    {row.status === "active" ? "Active" : "Inactive"}
                </span>
            )
        }
    ];

    // Table search handler
    const handleTableSearch = (searchTerm, data) => {
        if (!searchTerm.trim()) return data;
        
        return data.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Action buttons for each row
    const renderActions = (row) => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleViewDetails(row)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
            >
                <Eye className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleEdit(row)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(row)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );

    // Help modal features
    const helpFeatures = [
        {
            title: "My Properties",
            description: "View and manage all your properties in one place. You can see property details, status, and take actions.",
            icon: "Building2"
        },
        {
            title: "Add New Property",
            description: "Click the 'New' button to add a boarding house or apartment. Fill in the property details to list it.",
            icon: "Plus"
        },
        {
            title: "Search & Filter",
            description: "Use the search bar to find properties by name or address. Use filters to narrow down by category, status, or price.",
            icon: "Search"
        },
        {
            title: "Property Actions",
            description: "Each property has action buttons: View Details (eye), Edit (pencil), and Delete (trash).",
            icon: "Eye"
        }
    ];

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
                            My Properties
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your properties, track listings, and monitor performance.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Help Button (Desktop) */}
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2"
                    >
                        <HelpCircle size={20} />
                        <span className="font-medium">Help</span>
                    </button>

                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="relative px-3 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        Filter
                        {activeFiltersCount() > 0 && (
                            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFiltersCount()}
                            </span>
                        )}
                    </button>

                    {/* New Property Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNewPropertyDropdownOpen(!isNewPropertyDropdownOpen)}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Property
                            <ChevronDown className={`w-4 h-4 transition-transform ${isNewPropertyDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {isNewPropertyDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsNewPropertyDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                                    <button
                                        onClick={() => handleNewProperty("boarding")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        Boarding House
                                    </button>
                                    <button
                                        onClick={() => handleNewProperty("apartment")}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                                    >
                                        <Home className="w-4 h-4" />
                                        Apartment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-800">{filteredProperties.length}</span> properties
                </p>
                {activeFiltersCount() > 0 && (
                    <button
                        onClick={() => setFilters({
                            category: "all",
                            status: "all",
                            priceRange: { min: "", max: "" }
                        })}
                        className="text-sm text-primary hover:underline"
                    >
                        Clear all filters
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    data={filteredProperties}
                    keyField="id"
                    onRowClick={handleViewDetails}
                    showSearch={true}
                    searchPlaceholder="Search by property name or address..."
                    onSearch={handleTableSearch}
                    itemsPerPage={5}
                    emptyMessage="No properties found. Click 'New Property' to add your first property."
                    actions={renderActions}
                />
            </div>

            {/* Filter Menu */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={(newFilters) => setFilters(newFilters)}
                initialFilters={filters}
            />

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="My Properties Help"
                description="Learn how to manage your properties effectively."
                features={helpFeatures}
            />
        </div>
    );
};

export default MyProperties;