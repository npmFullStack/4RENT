// src/features/(app)/pages/Tenants.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    CreditCard,
    ArrowRight,
    Bed,
    Home,
    MoreVertical
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import WarningModal from "@/shared/components/WarningModal";

// Import property images
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";

// Mock data for tenants with property images from MyProperties
const mockTenants = [
    {
        id: 1,
        firstName: "Maria",
        lastName: "Santos",
        propertyId: 1,
        propertyName: "Sunset Boarding House",
        propertyImage: property1,
        propertyCategory: "boarding",
        propertyAddress: "123 Sunset Blvd, Barangay Sunset, Manila",
        monthlyRent: 4850,
        moveInDate: "2024-01-15",
        leaseEndDate: "2025-01-15",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "female"
    },
    {
        id: 2,
        firstName: "John",
        lastName: "Reyes",
        propertyId: 2,
        propertyName: "Downtown Luxury Apartment",
        propertyImage: property2,
        propertyCategory: "apartment",
        propertyAddress: "456 Main St, Barangay Central, Quezon City",
        monthlyRent: 12500,
        moveInDate: "2024-02-20",
        leaseEndDate: "2025-02-20",
        status: "unpaid",
        paymentDueDate: "2026-05-22",
        sex: "male"
    },
    {
        id: 3,
        firstName: "Ana",
        lastName: "Cruz",
        propertyId: 3,
        propertyName: "Garden View Boarding House",
        propertyImage: property3,
        propertyCategory: "boarding",
        propertyAddress: "789 Oak Ave, Barangay Riverside, Cebu City",
        monthlyRent: 3750,
        moveInDate: "2024-01-10",
        leaseEndDate: "2025-01-10",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "female"
    },
    {
        id: 4,
        firstName: "David",
        lastName: "Garcia",
        propertyId: 4,
        propertyName: "Ocean View Apartment",
        propertyImage: property1,
        propertyCategory: "apartment",
        propertyAddress: "321 Beach Road, Barangay Seaside, Davao City",
        monthlyRent: 18500,
        moveInDate: "2024-03-01",
        leaseEndDate: "2025-03-01",
        status: "overdue",
        paymentDueDate: "2026-04-15",
        sex: "male"
    },
    {
        id: 5,
        firstName: "Sofia",
        lastName: "Mendoza",
        propertyId: 5,
        propertyName: "Cozy Studio Boarding",
        propertyImage: property2,
        propertyCategory: "boarding",
        propertyAddress: "555 Peace St, Barangay Harmony, Cebu City",
        monthlyRent: 4200,
        moveInDate: "2024-03-15",
        leaseEndDate: "2025-03-15",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "female"
    },
    {
        id: 6,
        firstName: "Carlos",
        lastName: "Fernandez",
        propertyId: 6,
        propertyName: "Metro Central Tower",
        propertyImage: property3,
        propertyCategory: "apartment",
        propertyAddress: "789 Business Ave, Barangay Commercial, Makati City",
        monthlyRent: 22500,
        moveInDate: "2024-01-20",
        leaseEndDate: "2025-01-20",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "male"
    },
    {
        id: 7,
        firstName: "Isabella",
        lastName: "Lopez",
        propertyId: 7,
        propertyName: "Greenfield Boarding House",
        propertyImage: property1,
        propertyCategory: "boarding",
        propertyAddress: "456 Eco Park, Barangay Greenfield, Laguna",
        monthlyRent: 3500,
        moveInDate: "2024-02-10",
        leaseEndDate: "2025-02-10",
        status: "unpaid",
        paymentDueDate: "2026-05-22",
        sex: "female"
    },
    {
        id: 8,
        firstName: "Miguel",
        lastName: "Torres",
        propertyId: 8,
        propertyName: "Skyline Apartments",
        propertyImage: property2,
        propertyCategory: "apartment",
        propertyAddress: "123 High Street, Barangay Central, BGC",
        monthlyRent: 35000,
        moveInDate: "2024-01-05",
        leaseEndDate: "2025-01-05",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "male"
    },
    {
        id: 9,
        firstName: "Carmen",
        lastName: "Villanueva",
        propertyId: 9,
        propertyName: "Villa Maria Boarding House",
        propertyImage: property3,
        propertyCategory: "boarding",
        propertyAddress: "789 St. Mary Street, Barangay Maria, Bulacan",
        monthlyRent: 4200,
        moveInDate: "2024-03-20",
        leaseEndDate: "2025-03-20",
        status: "overdue",
        paymentDueDate: "2026-04-10",
        sex: "female"
    },
    {
        id: 10,
        firstName: "Patricia",
        lastName: "Aquino",
        propertyId: 10,
        propertyName: "Harbor View Apartment",
        propertyImage: property1,
        propertyCategory: "apartment",
        propertyAddress: "555 Port Street, Barangay Harbor, Batangas",
        monthlyRent: 15500,
        moveInDate: "2024-02-28",
        leaseEndDate: "2025-02-28",
        status: "paid",
        paymentDueDate: "2026-05-22",
        sex: "female"
    }
];

const Tenants = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [tenants, setTenants] = useState(mockTenants);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Get status badge props (no more partial status)
    const getStatusBadgeProps = status => {
        switch (status) {
            case "paid":
                return { icon: CheckCircle, label: "Paid", color: "green" };
            case "unpaid":
                return { icon: XCircle, label: "Unpaid", color: "orange" };
            case "overdue":
                return { icon: AlertCircle, label: "Overdue", color: "red" };
            default:
                return { icon: AlertCircle, label: "Unknown", color: "gray" };
        }
    };

    // Handle mark as paid
    const handleMarkAsPaid = tenant => {
        setSelectedTenant(tenant);
        setIsMarkPaidModalOpen(true);
        setOpenMenuId(null);
    };

    // Handle remove tenant
    const handleRemoveTenant = tenant => {
        console.log("Remove tenant:", tenant);
        setOpenMenuId(null);
        // No logic yet - just frontend
    };

    const confirmMarkAsPaid = async () => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setTenants(prev =>
                prev.map(tenant =>
                    tenant.id === selectedTenant.id
                        ? {
                              ...tenant,
                              status: "paid"
                          }
                        : tenant
                )
            );

            Toast.success(
                "Payment Recorded",
                `${selectedTenant.firstName} ${selectedTenant.lastName}'s rent has been marked as paid.`
            );

            setIsMarkPaidModalOpen(false);
            setSelectedTenant(null);
        } catch (error) {
            console.error("Error marking as paid:", error);
            Toast.error(
                "Action Failed",
                "There was an error processing this action."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle view details
    const handleViewDetails = tenant => {
        console.log("View details:", tenant);
        Toast.info(
            "Tenant Details",
            `Viewing ${tenant.firstName} ${tenant.lastName}`
        );
        // Navigate to tenant details page
        // navigate(`/tenants/${tenant.id}`);
    };

    // Handle add new tenant
    const handleAddTenant = () => {
        console.log("Add new tenant");
        navigate("/new-tenant");
    };

    // Get sex icon
    const getSexIcon = sex => {
        if (sex === "male") {
            return <img src={MaleIcon} alt="Male" className="w-3.5 h-3.5" />;
        } else if (sex === "female") {
            return (
                <img src={FemaleIcon} alt="Female" className="w-3.5 h-3.5" />
            );
        }
        return null;
    };

    // Format date to readable format
    const formatDate = dateString => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Table columns configuration
    const columns = [
        {
            key: "property",
            header: "Property",
            sortable: true,
            width: "280px",
            render: row => (
                <div className="flex items-center gap-3 min-w-0">
                    {/* Colored line indicator - Blue for Boarding, Red for Apartment */}
                    <div
                        className={`w-1 h-12 rounded-full flex-shrink-0 ${
                            row.propertyCategory === "boarding"
                                ? "bg-blue-500"
                                : "bg-red-500"
                        }`}
                    />
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={row.propertyImage}
                            alt={row.propertyName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-xs break-words">
                            {row.propertyName}
                        </p>
                        <p className="text-gray-400 text-xs break-words">
                            {row.propertyAddress}
                        </p>
                    </div>
                </div>
            )
        },
        {
            key: "category",
            header: "Category",
            sortable: true,
            width: "100px",
            render: row => {
                const isBoarding = row.propertyCategory === "boarding";
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
            key: "tenantName",
            header: "Tenant Name",
            sortable: true,
            width: "130px",
            sortKey: "lastName",
            render: row => (
                <div className="flex items-center gap-1.5">
                    {getSexIcon(row.sex)}
                    <span className="text-gray-800 text-xs truncate">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            )
        },
        {
            key: "monthlyRent",
            header: "Rent / Month",
            sortable: true,
            width: "100px",
            render: row => (
                <span className="font-semibold text-gray-800 text-sm">
                    ₱{row.monthlyRent.toLocaleString()}
                </span>
            )
        },
        {
            key: "paymentDueDate",
            header: "Payment Due Date",
            sortable: true,
            width: "110px",
            render: row => (
                <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(row.paymentDueDate)}
                </span>
            )
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            width: "90px",
            render: row => {
                const { icon, label, color } = getStatusBadgeProps(row.status);
                return (
                    <Badge variant="soft" color={color} icon={icon} size="sm">
                        {label}
                    </Badge>
                );
            }
        },
        {
            key: "moveInDate",
            header: "Move In Date",
            sortable: true,
            width: "100px",
            render: row => (
                <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(row.moveInDate)}
                </span>
            )
        }
    ];

    // Table search handler
    const handleTableSearch = (searchTerm, data) => {
        if (!searchTerm.trim()) return data;

        return data.filter(
            tenant =>
                `${tenant.firstName} ${tenant.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tenant.propertyName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    };

    // Action buttons for each row - Ellipsis menu
    const renderActions = row => (
        <div className="relative">
            <button
                onClick={e => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === row.id ? null : row.id);
                }}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {openMenuId === row.id && (
                <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div
                        className="fixed inset-0 z-[9999]"
                        onClick={e => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                        }}
                    />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[10000]">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                handleMarkAsPaid(row);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            Mark as Paid
                        </button>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                handleRemoveTenant(row);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Remove Tenant
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    // Help modal features
    const helpFeatures = [
        {
            title: "Tenants Overview",
            description:
                "View and manage all your tenants in one place. See tenant details, property assignments, and payment status."
        },
        {
            title: "Payment Management",
            description:
                "Track monthly rent payments. Mark payments as paid, view unpaid tenants, and manage overdue payments."
        },
        {
            title: "Add New Tenant",
            description:
                "Click the 'Add Tenant' button to register a new tenant and assign them to a property."
        },
        {
            title: "Tenant Actions",
            description:
                "Each tenant has an ellipsis menu with options to Mark as Paid or Remove Tenant."
        },
        {
            title: "Search & Filter",
            description:
                "Use the search bar to find tenants by name or property."
        }
    ];

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
                            Tenants
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your tenants, track payments, and monitor
                            occupancy.
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
                    {/* Add Tenant Button */}
                    <Button
                        variant="primary"
                        onClick={handleAddTenant}
                        icon={Plus}
                        className="!py-2"
                    >
                        Add Tenant
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={tenants}
                    keyField="id"
                    onRowClick={handleViewDetails}
                    showSearch={true}
                    searchPlaceholder="Search by tenant name or property..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No tenants found. Click 'Add Tenant' to register your first tenant."
                    actions={renderActions}
                />
            </div>

            {/* Mark as Paid Confirmation Modal */}
            <WarningModal
                isOpen={isMarkPaidModalOpen}
                onClose={() => setIsMarkPaidModalOpen(false)}
                onConfirm={confirmMarkAsPaid}
                title="Mark as Paid"
                icon={CreditCard}
                description={`Mark ${selectedTenant?.firstName} ${selectedTenant?.lastName}'s rent payment as paid for this month?`}
                confirmText="Mark as Paid"
                cancelText="Cancel"
                isLoading={isProcessing}
            />

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Tenants Help"
                description="Learn how to manage your tenants effectively."
                features={helpFeatures}
            />
        </div>
    );
};

export default Tenants;