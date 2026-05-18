// src/features/(app)/pages/MyProperties.jsx
import React, { useState } from "react";
import {
    HelpCircle,
    Plus,
    ChevronDown,
    Bed,
    Home,
    ArrowRight,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Select from "@/shared/components/Select";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Mock data for properties with unique entries (removed duplicates)
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
        currentTenants: null,
        sex: null,
        status: "available",
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
        currentTenants: 3,
        sex: "male",
        status: "full",
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
        currentTenants: null,
        sex: null,
        status: "rented",
        createdAt: "2024-03-01"
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
        createdAt: "2024-03-15"
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
        createdAt: "2024-01-20"
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
        createdAt: "2024-02-10"
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
        createdAt: "2024-01-05"
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
        createdAt: "2024-03-20"
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
        createdAt: "2024-02-28"
    }
];

const MyProperties = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [properties, setProperties] = useState(mockProperties);

    // Property type options for Select
    const propertyTypeOptions = [
        {
            value: "boarding",
            label: "Boarding",
            icon: <Bed className="w-3 h-3" />
        },
        {
            value: "apartment",
            label: "Apartment",
            icon: <Home className="w-3 h-3" />
        }
    ];

    // Handle view details
    const handleViewDetails = property => {
        console.log("View details:", property);
    };

    // Handle new property creation
    const handleNewProperty = type => {
        console.log(`Create new ${type}`);
        setSelectedPropertyType(null);
    };

    // Get status badge props
    const getStatusBadgeProps = row => {
        if (row.category === "apartment") {
            if (row.status === "rented") {
                return { icon: XCircle, label: "Rented", color: "red" };
            }
            return { icon: CheckCircle, label: "Available", color: "green" };
        }

        if (row.category === "boarding") {
            const isFull = row.currentTenants === row.capacity;
            const occupancyText = `${row.currentTenants}/${row.capacity}`;

            if (isFull) {
                return {
                    icon: XCircle,
                    label: `Full · ${occupancyText}`,
                    color: "red"
                };
            } else if (row.currentTenants > 0) {
                return {
                    icon: Users,
                    label: `${row.currentTenants} / ${row.capacity} tenants`,
                    color: "orange"
                };
            } else {
                return {
                    icon: CheckCircle,
                    label: `Vacant · ${occupancyText}`,
                    color: "green"
                };
            }
        }

        return { icon: AlertCircle, label: row.status, color: "gray" };
    };

    // Table columns configuration
    const columns = [
        {
            key: "image",
            header: "Image",
            sortable: false,
            width: "80px",
            render: row => (
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                        src={row.image}
                        alt={row.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        },
        {
            key: "name",
            header: "Property Name",
            sortable: true,
            width: "180px",
            className: "font-medium text-gray-800 text-xs"
        },
        {
            key: "category",
            header: "Category",
            sortable: true,
            width: "120px",
            render: row => {
                const isBoarding = row.category === "boarding";
                return (
                    <Badge
                        variant="outline"
                        color={isBoarding ? "blue" : "red"}
                        icon={isBoarding ? Bed : Home}
                    >
                        {isBoarding ? "Boarding" : "Apartment"}
                    </Badge>
                );
            }
        },
        {
            key: "address",
            header: "Address",
            sortable: true,
            width: "150px",
            render: row => (
                <div className="max-w-[130px]">
                    <p className="text-xs truncate">{row.address}</p>
                </div>
            )
        },
        {
            key: "price",
            header: "Rent / Month",
            sortable: true,
            width: "110px",
            render: row => (
                <span className="font-semibold text-gray-800 text-sm">
                    ₱{row.price.toLocaleString()}
                </span>
            )
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            width: "150px",
            render: row => {
                const { icon, label, color } = getStatusBadgeProps(row);
                return (
                    <Badge variant="ghost" color={color} icon={icon}>
                        {label}
                    </Badge>
                );
            }
        }
    ];

    // Table search handler
    const handleTableSearch = (searchTerm, data) => {
        if (!searchTerm.trim()) return data;

        return data.filter(
            item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Action buttons for each row
    const renderActions = row => (
        <div className="flex items-center">
            <Button
                variant="ghost"
                onClick={() => handleViewDetails(row)}
                className="!p-1 text-gray-600 hover:bg-gray-100 gap-1 text-xs"
                title="View Details"
            >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
            </Button>
        </div>
    );

    // Help modal features
    const helpFeatures = [
        {
            title: "My Properties",
            description:
                "View and manage all your properties in one place. You can see property details, status, and take actions.",
            icon: "Building2"
        },
        {
            title: "Add New Property",
            description:
                "Click the 'New Property' button to add a boarding house or apartment. Fill in the property details to list it.",
            icon: "Plus"
        },
        {
            title: "Search",
            description:
                "Use the search bar to find properties by name or address.",
            icon: "Search"
        },
        {
            title: "Property Actions",
            description:
                "Each property has a View Details button to see more information about the property.",
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
                            Manage your properties, track listings, and monitor
                            performance.
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
                    {/* New Property Select Component */}
                    <div className="w-50">
                        <Select
                            options={propertyTypeOptions}
                            value={selectedPropertyType}
                            onChange={handleNewProperty}
                            placeholder="New Property"
                            variant="primary"
                            isSearchable={false}
                            isClearable={false}
                            icon={<Plus className="w-4 h-4" />}
                        />
                    </div>{" "}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={properties}
                    keyField="id"
                    onRowClick={handleViewDetails}
                    showSearch={true}
                    searchPlaceholder="Search by property name or address..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No properties found. Click 'New Property' to add your first property."
                    actions={renderActions}
                />
            </div>

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
