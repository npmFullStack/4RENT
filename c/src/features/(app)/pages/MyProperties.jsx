// src/features/(app)/pages/MyProperties.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Plus,
    Bed,
    Home,
    ArrowRight,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Trash2,
    Eye
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Badge from "@/shared/components/Badge";
import Select from "@/shared/components/Select";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Helper function to generate property ID
const generatePropertyId = (id, category, createdAt) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

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
// Add propertyId to each mock property
const propertiesWithId = mockProperties.map(property => ({
    ...property,
    propertyId: generatePropertyId(
        property.id,
        property.category,
        property.createdAt
    )
}));

const MyProperties = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [properties, setProperties] = useState(propertiesWithId);
    const [actionValues, setActionValues] = useState({});

    const propertyTypeOptions = [
        {
            value: "boarding",
            label: "Boarding",
            icon: <Bed className="w-4 h-4" />
        },
        {
            value: "apartment",
            label: "Apartment",
            icon: <Home className="w-4 h-4" />
        }
    ];

    // Action options for the Select dropdown
    const actionOptions = [
        {
            value: "view",
            label: "View Details",
            icon: <Eye className="w-3 h-3" />
        },
        {
            value: "edit",
            label: "Edit Property",
            icon: <Edit className="w-3 h-3" />
        },
        {
            value: "remove",
            label: "Remove Property",
            icon: <Trash2 className="w-3 h-3" />
        }
    ];

    const handleViewDetails = property => {
        console.log("View details:", property);
    };

    const handleEditProperty = property => {
        console.log("Edit property:", property);
    };

    const handleRemoveProperty = property => {
        console.log("Remove property:", property);
    };

    const handleActionChange = (property, actionValue) => {
        if (!actionValue) return;

        switch (actionValue) {
            case "view":
                handleViewDetails(property);
                break;
            case "edit":
                handleEditProperty(property);
                break;
            case "remove":
                handleRemoveProperty(property);
                break;
            default:
                break;
        }
        // Reset the select after action
        setActionValues(prev => ({
            ...prev,
            [property.id]: null
        }));
    };

    const handleNewProperty = type => {
        if (type === "boarding") {
            navigate("/new-boarding");
        } else if (type === "apartment") {
            navigate("/new-apartment");
        }
        setSelectedPropertyType(null);
    };

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

    const columns = [
        {
            key: "propertyId",
            header: "Property ID",
            sortable: true,
            width: "100px",
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.propertyId}
                </span>
            )
        },
        {
            key: "image",
            header: "Image",
            sortable: false,
            width: "120px",
            cellClassName: "!p-0 align-top",
            render: row => {
                const isBoarding = row.category === "boarding";
                return (
                    <div className="relative flex flex-col items-center gap-1 py-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img
                                src={row.image}
                                alt={row.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                );
            }
        },
        {
            key: "propertyInfo",
            header: "Property Info",
            sortable: true,
            width: "250px",
            render: row => (
                <div>
                    <p className="font-semibold text-gray-800 text-xs">
                        {row.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {row.address}
                    </p>
                </div>
            )
        },
        {
            key: "type",
            header: "Type",
            sortable: true,
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
            key: "price",
            header: "Rent / Month",
            sortable: true,
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

    const handleTableSearch = (searchTerm, data) => {
        if (!searchTerm.trim()) return data;
        return data.filter(
            item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.propertyId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Fixed renderActions - no portal, proper positioning
    const renderActions = row => (
        <div className="w-28 relative">
            <Select
                options={actionOptions}
                value={actionValues[row.id] || null}
                onChange={value => {
                    setActionValues(prev => ({
                        ...prev,
                        [row.id]: value
                    }));
                    handleActionChange(row, value);
                }}
                placeholder="More"
                variant="outline"
                isSearchable={false}
                isClearable={true}
                className="text-xs w-full"
            />
        </div>
    );

    const helpFeatures = [
        {
            title: "My Properties",
            description: "View and manage all your properties in one place.",
            icon: "Building2"
        },
        {
            title: "Add New Property",
            description:
                "Click the 'New Property' button to add a boarding house or apartment.",
            icon: "Plus"
        },
        {
            title: "Search",
            description:
                "Use the search bar to find properties by name, address, or Property ID.",
            icon: "Search"
        },
        {
            title: "Property Actions",
            description:
                "Click the 'More' dropdown to access View Details, Edit Property, or Remove Property.",
            icon: "MoreHorizontal"
        }
    ];

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
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
                            My Properties
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your properties, track listings, and monitor
                            performance.
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
                    {/* Larger New Property button */}
                    <div className="w-54">
                        <Select
                            options={propertyTypeOptions}
                            value={selectedPropertyType}
                            onChange={handleNewProperty}
                            placeholder="New Property"
                            variant="primary"
                            isSearchable={false}
                            isClearable={false}
                            icon={<Plus className="w-5 h-5" />}
                            size="lg"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={properties}
                    keyField="id"
                    onRowClick={handleViewDetails}
                    showSearch={true}
                    searchPlaceholder="Search by property name, address, or Property ID..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No properties found. Click 'New Property' to add your first property."
                    actions={renderActions}
                />
            </div>

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
