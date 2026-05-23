// src/features/(app)/pages/Tenants.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    MoreHorizontal
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import ConfirmModal from "@/shared/components/ConfirmModal"; // Still used for Remove Tenant
import Select from "@/shared/components/Select";
import RecordPaymentModal from "../components/RecordPaymentModal"; // NEW: Import the new modal

// Import property images
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";

// Helper function to generate tenant ID
const generateTenantId = id => {
    const paddedNumber = String(id).padStart(4, "0");
    return `TNT-${paddedNumber}`;
};

// Helper function to generate property ID
const generatePropertyId = (id, category) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

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
        rentDueDate: "2026-06-01",
        sex: "female",
        balance: 0 // NEW: track remaining balance
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
        rentDueDate: "2026-06-01",
        sex: "male",
        balance: 12500 // NEW: track remaining balance
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
        rentDueDate: "2026-06-01",
        sex: "female",
        balance: 0
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
        rentDueDate: "2026-05-01",
        sex: "male",
        balance: 18500
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
        rentDueDate: "2026-06-01",
        sex: "female",
        balance: 0
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
        rentDueDate: "2026-06-01",
        sex: "male",
        balance: 0
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
        rentDueDate: "2026-06-01",
        sex: "female",
        balance: 3500
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
        rentDueDate: "2026-06-01",
        sex: "male",
        balance: 0
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
        rentDueDate: "2026-05-01",
        sex: "female",
        balance: 4200
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
        rentDueDate: "2026-06-01",
        sex: "female",
        balance: 0
    }
];

// Add tenantId and propertyId to each mock tenant
const tenantsWithIds = mockTenants.map(tenant => ({
    ...tenant,
    tenantId: generateTenantId(tenant.id),
    propertyFormattedId: generatePropertyId(
        tenant.propertyId,
        tenant.propertyCategory
    )
}));

const Tenants = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [tenants, setTenants] = useState(tenantsWithIds);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false); // CHANGED: renamed
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // NEW: separate modal for remove
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionValues, setActionValues] = useState({});

    // Action options for the Select dropdown
    const actionOptions = [
        {
            value: "recordPayment",
            label: "Record Payment",
            icon: <CreditCard className="w-3 h-3" />,
            className: "text-gray-800"
        },
        {
            value: "remove",
            label: "Remove Tenant",
            icon: <XCircle className="w-3 h-3" />,
            className: "text-red-600",
            separator: true
        }
    ];

    // Get status badge props - UPDATED to include "partial" status
    const getStatusBadgeProps = status => {
        switch (status) {
            case "paid":
                return { icon: CheckCircle, label: "Paid", color: "green" };
            case "partial": // NEW: partial payment status
                return { icon: AlertCircle, label: "Partial", color: "yellow" };
            case "unpaid":
                return { icon: XCircle, label: "Unpaid", color: "orange" };
            case "overdue":
                return { icon: AlertCircle, label: "Overdue", color: "red" };
            default:
                return { icon: AlertCircle, label: "Unknown", color: "gray" };
        }
    };

    // Handle record payment - CHANGED function name
    const handleRecordPayment = tenant => {
        setSelectedTenant(tenant);
        setIsRecordPaymentModalOpen(true);
    };

    // Handle remove tenant
    const handleRemoveTenant = tenant => {
        setSelectedTenant(tenant);
        setIsRemoveModalOpen(true);
    };

    // Handle action change from dropdown
    const handleActionChange = (tenant, actionValue) => {
        if (!actionValue) return;

        switch (actionValue) {
            case "recordPayment": // CHANGED: from markPaid to recordPayment
                handleRecordPayment(tenant);
                break;
            case "remove":
                handleRemoveTenant(tenant);
                break;
            default:
                break;
        }
        // Reset the select after action
        setActionValues(prev => ({
            ...prev,
            [tenant.id]: null
        }));
    };

    // NEW: Handle payment confirmation from RecordPaymentModal
    const confirmRecordPayment = async (paymentData) => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setTenants(prev =>
                prev.map(tenant =>
                    tenant.id === paymentData.tenantId
                        ? {
                              ...tenant,
                              status: paymentData.status,
                              balance: paymentData.remainingBalance,
                              lastPaymentDate: paymentData.paymentDate,
                              lastPaymentAmount: paymentData.amountPaid,
                              lastPaymentMode: paymentData.modeOfPayment
                          }
                        : tenant
                )
            );

            // Show success message based on payment type
            if (paymentData.paymentType === "full") {
                Toast.success(
                    "Payment Recorded",
                    `${paymentData.tenantName} has paid in full via ${getModeOfPaymentLabel(paymentData.modeOfPayment)}.`
                );
            } else {
                Toast.success(
                    "Payment Recorded",
                    `${paymentData.tenantName} paid ₱${paymentData.amountPaid.toLocaleString()} via ${getModeOfPaymentLabel(paymentData.modeOfPayment)}. Remaining balance: ₱${paymentData.remainingBalance.toLocaleString()}`
                );
            }

            setIsRecordPaymentModalOpen(false);
            setSelectedTenant(null);
        } catch (error) {
            console.error("Error recording payment:", error);
            Toast.error(
                "Action Failed",
                "There was an error processing this payment."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper function for mode of payment labels
    const getModeOfPaymentLabel = (mode) => {
        const modes = {
            in_person: "In Person (Cash)",
            gcash: "GCash",
            bank_transfer: "Bank Transfer"
        };
        return modes[mode] || mode;
    };

    // Handle confirm remove tenant
    const confirmRemoveTenant = async () => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setTenants(prev =>
                prev.filter(tenant => tenant.id !== selectedTenant.id)
            );

            Toast.success(
                "Tenant Removed",
                `${selectedTenant.firstName} ${selectedTenant.lastName} has been removed.`
            );

            setIsRemoveModalOpen(false);
            setSelectedTenant(null);
        } catch (error) {
            console.error("Error removing tenant:", error);
            Toast.error(
                "Action Failed",
                "There was an error removing this tenant."
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

    // Table columns configuration - UPDATED to show balance if partial
    const columns = [
        {
            key: "tenantId",
            header: "Tenant ID",
            sortable: true,
            width: "100px",
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.tenantId}
                </span>
            )
        },
        {
            key: "tenantInfo",
            header: "Tenant Info",
            sortable: true,
            sortKey: "lastName",
            width: "180px",
            render: row => (
                <div className="flex items-center gap-1.5">
                    {getSexIcon(row.sex)}
                    <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                        {row.firstName} {row.lastName}
                    </span>
                </div>
            )
        },
        {
            key: "propertyId",
            header: "Property ID",
            sortable: true,
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.propertyFormattedId}
                </span>
            )
        },
        {
            key: "rentPerMonth",
            header: "Rent / Month",
            sortable: true,
            render: row => (
                <span className="font-semibold text-gray-800 text-sm">
                    ₱{row.monthlyRent.toLocaleString()}
                </span>
            )
        },
        {
            key: "rentDueDate",
            header: "Rent Due Date",
            sortable: true,
            render: row => (
                <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(row.rentDueDate)}
                </span>
            )
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
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
            key: "balance", // NEW: show balance column
            header: "Balance",
            sortable: true,
            render: row => (
                <span className={`text-xs font-semibold ${row.balance > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {row.balance > 0 ? `₱${row.balance.toLocaleString()}` : "—"}
                </span>
            )
        },
        {
            key: "moveInDate",
            header: "Move In Date",
            sortable: true,
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
                tenant.tenantId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tenant.propertyFormattedId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    };

    // Render actions with Select dropdown
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
                "Track monthly rent payments. Record payments as Full Payment or Downpayment. Partial payments will show remaining balance."
        },
        {
            title: "Add New Tenant",
            description:
                "Click the 'Add Tenant' button to register a new tenant and assign them to a property."
        },
        {
            title: "Tenant Actions",
            description:
                "Each tenant has a 'More' dropdown with options to Record Payment or Remove Tenant."
        },
        {
            title: "Search & Filter",
            description:
                "Use the search bar to find tenants by name, Tenant ID, or Property ID."
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
                    searchPlaceholder="Search by tenant name, Tenant ID, or Property ID..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No tenants found. Click 'Add Tenant' to register your first tenant."
                    actions={renderActions}
                />
            </div>

            {/* Record Payment Modal - NEW */}
            <RecordPaymentModal
                isOpen={isRecordPaymentModalOpen}
                onClose={() => {
                    setIsRecordPaymentModalOpen(false);
                    setSelectedTenant(null);
                }}
                onConfirm={confirmRecordPayment}
                tenant={selectedTenant}
                isLoading={isProcessing}
            />

            {/* Remove Tenant Confirmation Modal - UPDATED to use danger variant */}
            <ConfirmModal
                isOpen={isRemoveModalOpen}
                onClose={() => {
                    setIsRemoveModalOpen(false);
                    setSelectedTenant(null);
                }}
                onConfirm={confirmRemoveTenant}
                title="Remove Tenant"
                message={`Are you sure you want to remove ${selectedTenant?.firstName} ${selectedTenant?.lastName}? This action cannot be undone.`}
                variant="danger"
                confirmText="Remove"
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