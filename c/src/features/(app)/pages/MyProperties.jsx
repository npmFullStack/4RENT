// src/features/(app)/pages/MyProperties.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Plus,
    Bed,
    Home,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Edit,
    Trash2,
    Eye,
    Bath
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Badge from "@/shared/components/Badge";
import Select from "@/shared/components/Select";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons as React components
import FemaleIcon from "@/assets/icons/female.svg";
import MaleIcon from "@/assets/icons/male.svg";
import MixedIcon from "@/assets/icons/mixed.svg";

// Helper function to generate property ID
const generatePropertyId = (id, category) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

// Wrapper components for gender icons to work with Badge component
const FemaleIconComponent = (props) => <img src={FemaleIcon} alt="female" className="w-3.5 h-3.5" {...props} />;
const MaleIconComponent = (props) => <img src={MaleIcon} alt="male" className="w-3.5 h-3.5" {...props} />;
const MixedIconComponent = (props) => <img src={MixedIcon} alt="mixed" className="w-3.5 h-3.5" {...props} />;

// Helper function to get boarding house sex badge props
const getBoardingSexBadgeProps = (sex) => {
    if (sex === "male") {
        return { 
            icon: MaleIconComponent,
            label: "Male Only",
            color: "blue"
        };
    }
    if (sex === "female") {
        return { 
            icon: FemaleIconComponent,
            label: "Female Only",
            color: "pink"
        };
    }
    if (sex === "mixed") {
        return { 
            icon: MixedIconComponent,
            label: "Mixed",
            color: "gray"
        };
    }
    return null;
};

// Helper function to get bedroom status badge props
const getBedroomStatusBadgeProps = (bedroom, boardingSex) => {
    const capacity = bedroom.capacity || 0;
    const currentTenants = bedroom.currentTenants || 0;
    const isFull = currentTenants === capacity && capacity > 0;
    const isEmpty = currentTenants === 0;
    
    let icon = null;
    let color = "";
    let statusText = "";
    
    if (isFull) {
        icon = XCircle;
        color = "red";
        statusText = "Full";
    } else if (isEmpty) {
        icon = CheckCircle;
        color = "green";
        statusText = "Available";
    } else {
        icon = Users;
        color = "orange";
        statusText = `${currentTenants}/${capacity} Tenants`;
    }
    
    // For mixed sex boarding, override icon with gender-specific icon
    if (boardingSex === "mixed" && bedroom.gender) {
        if (bedroom.gender === "male") {
            icon = MaleIconComponent;
        } else if (bedroom.gender === "female") {
            icon = FemaleIconComponent;
        }
    }
    
    return {
        icon,
        statusText,
        color,
        capacity,
        currentTenants,
        isFull,
        isEmpty
    };
};

// Helper function to get bedroom display text and color
const getBedroomDisplay = (bedroom, boardingSex) => {
    if (boardingSex === "male") {
        return { text: "Boys Bedroom", color: "blue", icon: MaleIconComponent };
    }
    if (boardingSex === "female") {
        return { text: "Girls Bedroom", color: "pink", icon: FemaleIconComponent };
    }
    if (boardingSex === "mixed" && bedroom.gender) {
        if (bedroom.gender === "male") {
            return { text: "Boys Bedroom", color: "blue", icon: MaleIconComponent };
        }
        if (bedroom.gender === "female") {
            return { text: "Girls Bedroom", color: "pink", icon: FemaleIconComponent };
        }
    }
    return { text: "Bedroom", color: "gray", icon: Bed };
};

export const mockProperties = [
    {
        id: 1,
        images: [property1, property2, property3, property1],
        name: "Sunset Boarding House",
        category: "boarding",
        address: "123 Sunset Blvd, Barangay Sunset, Manila, Philippines",
        price: 4850,
        capacity: 4,
        currentTenants: 0,
        sex: "female",
        status: "available",
        createdAt: "2024-01-15",
        numberOfCR: 2,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 2, gender: "female", currentTenants: 0 },
            { id: 2, name: "Bedroom #2", capacity: 2, gender: "female", currentTenants: 0 }
        ]
    },
    {
        id: 2,
        images: [property2, property3, property1, property2],
        name: "Downtown Luxury Apartment",
        category: "apartment",
        address: "456 Main St, Barangay Central, Quezon City, Philippines",
        price: 12500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-02-20",
        numberOfCR: 1,
        bedrooms: []
    },
    {
        id: 3,
        images: [property3, property1, property2, property3],
        name: "Garden View Boarding House",
        category: "boarding",
        address: "789 Oak Ave, Barangay Riverside, Cebu City, Philippines",
        price: 3750,
        capacity: 3,
        currentTenants: 3,
        sex: "male",
        status: "full",
        createdAt: "2024-01-10",
        numberOfCR: 1,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 1, gender: "male", currentTenants: 1 },
            { id: 2, name: "Bedroom #2", capacity: 1, gender: "male", currentTenants: 1 },
            { id: 3, name: "Bedroom #3", capacity: 1, gender: "male", currentTenants: 1 }
        ]
    },
    {
        id: 4,
        images: [property1, property2, property3, property1],
        name: "Ocean View Apartment",
        category: "apartment",
        address: "321 Beach Road, Barangay Seaside, Davao City, Philippines",
        price: 18500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "rented",
        createdAt: "2024-03-01",
        numberOfCR: 2,
        bedrooms: []
    },
    {
        id: 5,
        images: [property2, property1, property3, property2],
        name: "Cozy Studio Boarding",
        category: "boarding",
        address: "555 Peace St, Barangay Harmony, Cebu City, Philippines",
        price: 4200,
        capacity: 2,
        currentTenants: 1,
        sex: "female",
        status: "available",
        createdAt: "2024-03-15",
        numberOfCR: 1,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 1, gender: "female", currentTenants: 0 },
            { id: 2, name: "Bedroom #2", capacity: 1, gender: "female", currentTenants: 1 }
        ]
    },
    {
        id: 6,
        images: [property3, property2, property1, property3],
        name: "Metro Central Tower",
        category: "apartment",
        address: "789 Business Ave, Barangay Commercial, Makati City, Philippines",
        price: 22500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-01-20",
        numberOfCR: 2,
        bedrooms: []
    },
    {
        id: 7,
        images: [property1, property3, property2, property1],
        name: "Greenfield Boarding House",
        category: "boarding",
        address: "456 Eco Park, Barangay Greenfield, Laguna, Philippines",
        price: 3500,
        capacity: 5,
        currentTenants: 2,
        sex: "female",
        status: "available",
        createdAt: "2024-02-10",
        numberOfCR: 2,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 2, gender: "female", currentTenants: 1 },
            { id: 2, name: "Bedroom #2", capacity: 2, gender: "female", currentTenants: 0 },
            { id: 3, name: "Bedroom #3", capacity: 1, gender: "female", currentTenants: 1 }
        ]
    },
    {
        id: 8,
        images: [property2, property1, property3, property2],
        name: "Skyline Apartments",
        category: "apartment",
        address: "123 High Street, Barangay Central, BGC, Philippines",
        price: 35000,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "rented",
        createdAt: "2024-01-05",
        numberOfCR: 3,
        bedrooms: []
    },
    {
        id: 9,
        images: [property3, property2, property1, property3],
        name: "Villa Maria Boarding House",
        category: "boarding",
        address: "789 St. Mary Street, Barangay Maria, Bulacan, Philippines",
        price: 4200,
        capacity: 4,
        currentTenants: 4,
        sex: "male",
        status: "full",
        createdAt: "2024-03-20",
        numberOfCR: 2,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 2, gender: "male", currentTenants: 2 },
            { id: 2, name: "Bedroom #2", capacity: 2, gender: "male", currentTenants: 2 }
        ]
    },
    {
        id: 10,
        images: [property1, property3, property2, property1],
        name: "Harbor View Apartment",
        category: "apartment",
        address: "555 Port Street, Barangay Harbor, Batangas, Philippines",
        price: 15500,
        capacity: null,
        currentTenants: null,
        sex: null,
        status: "available",
        createdAt: "2024-02-28",
        numberOfCR: 1,
        bedrooms: []
    },
    {
        id: 11,
        images: [property2, property1, property3, property2],
        name: "Harmony Mixed Boarding House",
        category: "boarding",
        address: "123 Unity St, Barangay Peace, Cebu City, Philippines",
        price: 5500,
        capacity: 6,
        currentTenants: 3,
        sex: "mixed",
        status: "available",
        createdAt: "2024-04-01",
        numberOfCR: 3,
        bedrooms: [
            { id: 1, name: "Bedroom #1", capacity: 2, gender: "male", currentTenants: 1 },
            { id: 2, name: "Bedroom #2", capacity: 2, gender: "male", currentTenants: 1 },
            { id: 3, name: "Bedroom #3", capacity: 2, gender: "female", currentTenants: 1 }
        ]
    }
];

// Add propertyId to each mock property
export const propertiesWithId = mockProperties.map(property => ({
    ...property,
    propertyId: generatePropertyId(property.id, property.category)
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

    const actionOptions = [
        {
            value: "view",
            label: "View Details",
            icon: <Eye className="w-3 h-3" />,
            className: "text-gray-800"
        },
        {
            value: "edit",
            label: "Edit Property",
            icon: <Edit className="w-3 h-3" />,
            className: "text-gray-800"
        },
        {
            value: "remove",
            label: "Remove Property",
            icon: <Trash2 className="w-3 h-3" />,
            className: "text-red-600",
            separator: true
        }
    ];

    const handleNewProperty = type => {
        if (type === "boarding") {
            navigate("/new-boarding");
        } else if (type === "apartment") {
            navigate("/new-apartment");
        }
        setSelectedPropertyType(null);
    };

    const handleViewDetails = property => {
        navigate(`/property-details/${property.id}`);
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
        setActionValues(prev => ({
            ...prev,
            [property.id]: null
        }));
    };

    const getStatusBadgeProps = row => {
        // For apartments - simple status
        if (row.category === "apartment") {
            if (row.status === "rented") {
                return { icon: XCircle, label: "Rented", color: "red" };
            }
            return { icon: CheckCircle, label: "Available", color: "green" };
        }
        return null;
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
            render: row => (
                <div className="relative flex flex-col items-center gap-1 py-3">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                            src={row.images?.[0] || row.image}
                            alt={row.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )
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
            sortable: false,
            width: "320px",
            render: row => {
                // For apartments - simple status
                if (row.category === "apartment") {
                    const { icon, label, color } = getStatusBadgeProps(row);
                    return (
                        <Badge variant="ghost" color={color} icon={icon}>
                            {label}
                        </Badge>
                    );
                }

                // For boarding houses - show boarding type label + bedrooms
                const sexBadge = getBoardingSexBadgeProps(row.sex);
                
                return (
                    <div className="flex flex-col gap-2">
                        {/* Boarding Type Label and Badge */}
                        <div>
                            <span className="text-xs font-medium text-gray-500">Boarding Type: </span>
                            {sexBadge && (
                                <Badge 
                                    variant="ghost" 
                                    color={sexBadge.color} 
                                    icon={sexBadge.icon}
                                    size="sm"
                                    className="inline-flex"
                                >
                                    {sexBadge.label}
                                </Badge>
                            )}
                        </div>
                        
                        {/* Bedroom Statuses */}
                        <div className="flex flex-col gap-1.5">
                            {row.bedrooms && row.bedrooms.map(bedroom => {
                                const badgeProps = getBedroomStatusBadgeProps(bedroom, row.sex);
                                const bedroomDisplay = getBedroomDisplay(bedroom, row.sex);
                                const BedroomIcon = bedroomDisplay.icon;
                                
                                return (
                                    <div key={bedroom.id} className="flex items-center gap-2 flex-wrap">
                                        <div className={`flex items-center gap-1 text-${bedroomDisplay.color}-600`}>
                                            <BedroomIcon className={`w-3.5 h-3.5 text-${bedroomDisplay.color}-500`} />
                                            <span className={`text-xs font-medium text-${bedroomDisplay.color}-600`}>
                                                {bedroomDisplay.text}:
                                            </span>
                                        </div>
                                        <Badge
                                            variant="ghost"
                                            color={badgeProps.color}
                                            icon={badgeProps.icon}
                                            size="sm"
                                        >
                                            {badgeProps.statusText}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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