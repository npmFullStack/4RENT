// src/features/(app)/pages/Archives.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArchiveRestore, Trash2, FolderOpen } from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import ConfirmModal from "@/shared/components/ConfirmModal";
import Toast from "@/shared/components/Toast";
import BreadCrumbs from "../components/BreadCrumbs";

// Import property images
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

// Import gender icons
import MaleIcon from "@/assets/icons/male.svg";
import FemaleIcon from "@/assets/icons/female.svg";

// Helper function to generate payment ID
const generatePaymentId = id => {
    const paddedNumber = String(id).padStart(6, "0");
    return `PAY-${paddedNumber}`;
};

// Helper function to generate property ID
const generatePropertyId = (id, category) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

// Mock archived payment logs data
const mockArchivedPayments = [
    {
        id: 101,
        propertyId: 1,
        propertyCategory: "boarding",
        tenantId: "TNT-0011",
        tenantFirstName: "Roberto",
        tenantLastName: "Dela Cruz",
        tenantSex: "male",
        propertyName: "Sunset Boarding House",
        propertyImage: property1,
        amountPaid: 4850,
        paymentDate: "2026-04-15",
        archivedDate: "2026-05-01"
    },
    {
        id: 102,
        propertyId: 2,
        propertyCategory: "apartment",
        tenantId: "TNT-0012",
        tenantFirstName: "Maria",
        tenantLastName: "Reyes",
        tenantSex: "female",
        propertyName: "Downtown Luxury Apartment",
        propertyImage: property2,
        amountPaid: 12500,
        paymentDate: "2026-04-10",
        archivedDate: "2026-05-01"
    },
    {
        id: 103,
        propertyId: 3,
        propertyCategory: "boarding",
        tenantId: "TNT-0013",
        tenantFirstName: "Jose",
        tenantLastName: "Mendoza",
        tenantSex: "male",
        propertyName: "Garden View Boarding House",
        propertyImage: property3,
        amountPaid: 3750,
        paymentDate: "2026-04-18",
        archivedDate: "2026-05-02"
    },
    {
        id: 104,
        propertyId: 5,
        propertyCategory: "boarding",
        tenantId: "TNT-0014",
        tenantFirstName: "Elena",
        tenantLastName: "Gonzales",
        tenantSex: "female",
        propertyName: "Cozy Studio Boarding",
        propertyImage: property2,
        amountPaid: 4200,
        paymentDate: "2026-04-20",
        archivedDate: "2026-05-03"
    },
    {
        id: 105,
        propertyId: 7,
        propertyCategory: "boarding",
        tenantId: "TNT-0015",
        tenantFirstName: "Ricardo",
        tenantLastName: "Fernandez",
        tenantSex: "male",
        propertyName: "Greenfield Boarding House",
        propertyImage: property1,
        amountPaid: 3500,
        paymentDate: "2026-04-12",
        archivedDate: "2026-05-03"
    }
];

// Add paymentId and propertyFormattedId to each archived payment
const archivedPaymentsWithIds = mockArchivedPayments.map(payment => ({
    ...payment,
    paymentId: generatePaymentId(payment.id),
    propertyFormattedId: generatePropertyId(
        payment.propertyId,
        payment.propertyCategory
    )
}));

const Archives = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [archivedPayments, setArchivedPayments] = useState(
        archivedPaymentsWithIds
    );
    const [selectedPayments, setSelectedPayments] = useState(new Set());
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionType, setActionType] = useState(null); // 'restore' or 'delete'

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

    // Format amount with currency
    const formatAmount = amount => {
        return `₱${amount.toLocaleString()}`;
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

    // Handle checkbox selection for a single payment
    const handleSelectPayment = (paymentId, isChecked) => {
        setSelectedPayments(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(paymentId);
            } else {
                newSet.delete(paymentId);
            }
            return newSet;
        });
    };

    // Handle select all payments (from current filtered data)
    const handleSelectAll = () => {
        const allPaymentIds = filteredPayments.map(p => p.id);
        setSelectedPayments(new Set(allPaymentIds));
    };

    // Handle clear all selections
    const handleClearAll = () => {
        setSelectedPayments(new Set());
    };

    // Handle restore button click
    const handleRestoreClick = () => {
        if (selectedPayments.size === 0) {
            Toast.warning(
                "No Selection",
                "Please select at least one payment log to restore."
            );
            return;
        }
        setActionType("restore");
        setIsRestoreModalOpen(true);
    };

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedPayments.size === 0) {
            Toast.warning(
                "No Selection",
                "Please select at least one payment log to delete permanently."
            );
            return;
        }
        setActionType("delete");
        setIsDeleteModalOpen(true);
    };

    // Handle restore confirmation
    const handleRestoreConfirm = async () => {
        setIsActionLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Remove restored payments from archived list
            setArchivedPayments(prev =>
                prev.filter(payment => !selectedPayments.has(payment.id))
            );

            // Clear selections
            setSelectedPayments(new Set());

            Toast.success(
                "Restore Successful",
                `${selectedPayments.size} payment log(s) have been restored.`
            );
        } catch (error) {
            console.error("Error restoring payments:", error);
            Toast.error(
                "Restore Failed",
                "There was an error restoring the selected payment logs."
            );
        } finally {
            setIsActionLoading(false);
            setIsRestoreModalOpen(false);
        }
    };

    // Handle delete confirmation (permanent deletion)
    const handleDeleteConfirm = async () => {
        setIsActionLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Permanently delete selected payments
            setArchivedPayments(prev =>
                prev.filter(payment => !selectedPayments.has(payment.id))
            );

            // Clear selections
            setSelectedPayments(new Set());

            Toast.success(
                "Delete Successful",
                `${selectedPayments.size} payment log(s) have been permanently deleted.`
            );
        } catch (error) {
            console.error("Error deleting payments:", error);
            Toast.error(
                "Delete Failed",
                "There was an error deleting the selected payment logs."
            );
        } finally {
            setIsActionLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Navigate back to payment logs
    const handleBackToPaymentLogs = () => {
        navigate("/payment-logs");
    };

    // Filtered payments based on search
    const filteredPayments = useMemo(() => {
        if (!searchTerm.trim()) return archivedPayments;

        return archivedPayments.filter(payment => {
            const tenantName = `${payment.tenantFirstName} ${payment.tenantLastName}`;
            const paymentId = payment.paymentId;
            const propertyId = payment.propertyFormattedId;

            return (
                tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                propertyId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [archivedPayments, searchTerm]);

    // Table search handler for the Table component
    const handleTableSearch = (searchTerm, data) => {
        setSearchTerm(searchTerm);
        if (!searchTerm.trim()) return data;

        return data.filter(payment => {
            const tenantName = `${payment.tenantFirstName} ${payment.tenantLastName}`;
            const paymentId = payment.paymentId;
            const propertyId = payment.propertyFormattedId;

            return (
                tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                propertyId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    // Render checkbox column
    const renderCheckbox = row => {
        const isChecked = selectedPayments.has(row.id);
        return (
            <input
                type="checkbox"
                checked={isChecked}
                onChange={e => {
                    e.stopPropagation();
                    handleSelectPayment(row.id, e.target.checked);
                }}
                onClick={e => e.stopPropagation()}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
            />
        );
    };

    // Render tenant info with sex icon
    const renderTenantInfo = row => (
        <div className="flex items-center gap-1.5">
            {getSexIcon(row.tenantSex)}
            <span className="font-medium text-gray-800 text-sm">
                {row.tenantFirstName} {row.tenantLastName}
            </span>
        </div>
    );

    // Render property ID
    const renderPropertyId = row => (
        <span className="font-mono text-xs font-semibold text-gray-700">
            {row.propertyFormattedId}
        </span>
    );

    // Render amount paid
    const renderAmountPaid = row => (
        <span className="font-semibold text-gray-800 text-sm">
            {formatAmount(row.amountPaid)}
        </span>
    );

    // Render payment date
    const renderPaymentDate = row => (
        <span className="text-gray-600 text-xs whitespace-nowrap">
            {formatDate(row.paymentDate)}
        </span>
    );

    // Render archived date
    const renderArchivedDate = row => (
        <span className="text-gray-500 text-xs whitespace-nowrap">
            {formatDate(row.archivedDate)}
        </span>
    );

    // Columns configuration
    const columns = [
        {
            key: "selection",
            header: "",
            width: "40px",
            sortable: false,
            render: renderCheckbox
        },
        {
            key: "paymentId",
            header: "Payment ID",
            sortable: true,
            width: "110px",
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.paymentId}
                </span>
            )
        },
        {
            key: "tenantInfo",
            header: "Tenant Info",
            sortable: true,
            sortKey: "tenantLastName",
            width: "160px",
            render: renderTenantInfo
        },
        {
            key: "propertyId",
            header: "Property ID",
            sortable: true,
            width: "100px",
            render: renderPropertyId
        },
        {
            key: "amountPaid",
            header: "Amount Paid",
            sortable: true,
            width: "120px",
            render: renderAmountPaid
        },
        {
            key: "paymentDate",
            header: "Payment Date",
            sortable: true,
            width: "110px",
            render: renderPaymentDate
        },
        {
            key: "archivedDate",
            header: "Archived Date",
            sortable: true,
            width: "110px",
            render: renderArchivedDate
        }
    ];

    // Selection summary component
    const SelectionSummary = () => {
        if (selectedPayments.size === 0) return null;

        const isAllSelected =
            filteredPayments.length > 0 &&
            filteredPayments.every(p => selectedPayments.has(p.id));

        return (
            <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        {selectedPayments.size} archived payment log
                        {selectedPayments.size !== 1 ? "s" : ""} selected
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSelectAll}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Select All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Clear All
                    </button>
                    <Button
                        variant="outline"
                        icon={ArchiveRestore}
                        onClick={handleRestoreClick}
                        disabled={isActionLoading}
                        className="!border-green-700 !text-green-700 !text-sm"
                    >
                        Restore
                    </Button>
                    <Button
                        variant="primary"
                        icon={Trash2}
                        onClick={handleDeleteClick}
                        disabled={isActionLoading}
                        className="!bg-red-500 !text-sm"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        );
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Archives Overview",
            description:
                "View all archived payment logs that have been moved from the main payment logs. Archived logs can be restored or permanently deleted."
        },
        {
            title: "Selecting Archived Logs",
            description:
                "Use the checkboxes to select individual archived payment logs. Select multiple logs to restore or delete them in bulk."
        },
        {
            title: "Restore Archived Logs",
            description:
                "Select archived payment logs and click the 'Restore' button to move them back to the main payment logs."
        },
        {
            title: "Permanent Deletion",
            description:
                "Select archived payment logs and click the 'Delete Permanently' button to remove them from the system. This action cannot be undone."
        },
        {
            title: "Search & Filter",
            description:
                "Use the search bar to find archived payment logs by tenant name, Payment ID, or Property ID."
        }
    ];

    return (
<div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
    {/* Breadcrumbs */}
    <div className="mb-4">
        <BreadCrumbs
            items={[
                { label: "Payment Logs", path: "/payment-logs" },
                { label: "Archives", path: "/archives" }
            ]}
        />
    </div>

    {/* Header */}
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
                    Archives
                </h1>
                <p className="text-gray-600 mt-1">
                    View and manage archived payment logs.
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

            {/* Selection Summary */}
            <SelectionSummary />

            {/* Table */}
            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={archivedPayments}
                    keyField="id"
                    onRowClick={row => {
                        console.log("View archived payment details:", row);
                        Toast.info(
                            "Archived Payment Details",
                            `Payment ${row.paymentId} for ${row.tenantFirstName} ${row.tenantLastName}`
                        );
                    }}
                    showSearch={true}
                    searchPlaceholder="Search by tenant name, Payment ID, or Property ID..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No archived payment logs found."
                />
            </div>

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Archives Help"
                description="Learn how to manage archived payment logs."
                features={helpFeatures}
            />

            {/* Restore Confirmation Modal */}
            <ConfirmModal
                isOpen={isRestoreModalOpen}
                onClose={() => setIsRestoreModalOpen(false)}
                onConfirm={handleRestoreConfirm}
                title="Restore Payment Logs"
                message={`Are you sure you want to restore ${selectedPayments.size} archived payment log${selectedPayments.size !== 1 ? "s" : ""}? They will be moved back to the main payment logs.`}
                variant="info"
                confirmText="Restore"
                cancelText="Cancel"
                isLoading={isActionLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Permanently Delete"
                message={`Are you sure you want to permanently delete ${selectedPayments.size} archived payment log${selectedPayments.size !== 1 ? "s" : ""}? This action cannot be undone.`}
                variant="danger"
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isActionLoading}
            />
        </div>
    );
};

export default Archives;
