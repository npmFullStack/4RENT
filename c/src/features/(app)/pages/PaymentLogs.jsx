// src/features/(app)/pages/PaymentLogs.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Archive } from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Toast from "@/shared/components/Toast";

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

// Mock payment logs data
const mockPaymentLogs = [
    {
        id: 1,
        propertyId: 1,
        propertyCategory: "boarding",
        tenantId: "TNT-0001",
        tenantFirstName: "Maria",
        tenantLastName: "Santos",
        tenantSex: "female",
        propertyName: "Sunset Boarding House",
        propertyImage: property1,
        amountPaid: 4850,
        paymentDate: "2026-05-15"
    },
    {
        id: 2,
        propertyId: 2,
        propertyCategory: "apartment",
        tenantId: "TNT-0002",
        tenantFirstName: "John",
        tenantLastName: "Reyes",
        tenantSex: "male",
        propertyName: "Downtown Luxury Apartment",
        propertyImage: property2,
        amountPaid: 12500,
        paymentDate: "2026-05-10"
    },
    {
        id: 3,
        propertyId: 3,
        propertyCategory: "boarding",
        tenantId: "TNT-0003",
        tenantFirstName: "Ana",
        tenantLastName: "Cruz",
        tenantSex: "female",
        propertyName: "Garden View Boarding House",
        propertyImage: property3,
        amountPaid: 3750,
        paymentDate: "2026-05-18"
    },
    {
        id: 4,
        propertyId: 4,
        propertyCategory: "apartment",
        tenantId: "TNT-0004",
        tenantFirstName: "David",
        tenantLastName: "Garcia",
        tenantSex: "male",
        propertyName: "Ocean View Apartment",
        propertyImage: property1,
        amountPaid: 18500,
        paymentDate: "2026-04-28"
    },
    {
        id: 5,
        propertyId: 5,
        propertyCategory: "boarding",
        tenantId: "TNT-0005",
        tenantFirstName: "Sofia",
        tenantLastName: "Mendoza",
        tenantSex: "female",
        propertyName: "Cozy Studio Boarding",
        propertyImage: property2,
        amountPaid: 4200,
        paymentDate: "2026-05-20"
    },
    {
        id: 6,
        propertyId: 6,
        propertyCategory: "apartment",
        tenantId: "TNT-0006",
        tenantFirstName: "Carlos",
        tenantLastName: "Fernandez",
        tenantSex: "male",
        propertyName: "Metro Central Tower",
        propertyImage: property3,
        amountPaid: 22500,
        paymentDate: "2026-05-05"
    },
    {
        id: 7,
        propertyId: 7,
        propertyCategory: "boarding",
        tenantId: "TNT-0007",
        tenantFirstName: "Isabella",
        tenantLastName: "Lopez",
        tenantSex: "female",
        propertyName: "Greenfield Boarding House",
        propertyImage: property1,
        amountPaid: 3500,
        paymentDate: "2026-05-12"
    },
    {
        id: 8,
        propertyId: 8,
        propertyCategory: "apartment",
        tenantId: "TNT-0008",
        tenantFirstName: "Miguel",
        tenantLastName: "Torres",
        tenantSex: "male",
        propertyName: "Skyline Apartments",
        propertyImage: property2,
        amountPaid: 35000,
        paymentDate: "2026-05-08"
    },
    {
        id: 9,
        propertyId: 9,
        propertyCategory: "boarding",
        tenantId: "TNT-0009",
        tenantFirstName: "Carmen",
        tenantLastName: "Villanueva",
        tenantSex: "female",
        propertyName: "Villa Maria Boarding House",
        propertyImage: property3,
        amountPaid: 4200,
        paymentDate: "2026-04-25"
    },
    {
        id: 10,
        propertyId: 10,
        propertyCategory: "apartment",
        tenantId: "TNT-0010",
        tenantFirstName: "Patricia",
        tenantLastName: "Aquino",
        tenantSex: "female",
        propertyName: "Harbor View Apartment",
        propertyImage: property1,
        amountPaid: 15500,
        paymentDate: "2026-05-14"
    },
    {
        id: 11,
        propertyId: 2,
        propertyCategory: "apartment",
        tenantId: "TNT-0002",
        tenantFirstName: "John",
        tenantLastName: "Reyes",
        tenantSex: "male",
        propertyName: "Downtown Luxury Apartment",
        propertyImage: property2,
        amountPaid: 5000,
        paymentDate: "2026-05-22"
    },
    {
        id: 12,
        propertyId: 4,
        propertyCategory: "apartment",
        tenantId: "TNT-0004",
        tenantFirstName: "David",
        tenantLastName: "Garcia",
        tenantSex: "male",
        propertyName: "Ocean View Apartment",
        propertyImage: property1,
        amountPaid: 10000,
        paymentDate: "2026-05-20"
    }
];

// Add paymentId and propertyFormattedId to each mock payment
const paymentLogsWithIds = mockPaymentLogs.map(payment => ({
    ...payment,
    paymentId: generatePaymentId(payment.id),
    propertyFormattedId: generatePropertyId(
        payment.propertyId,
        payment.propertyCategory
    )
}));

const PaymentLogs = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [paymentLogs, setPaymentLogs] = useState(paymentLogsWithIds);
    const [selectedPayments, setSelectedPayments] = useState(new Set());
    const [isArchiving, setIsArchiving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    // Handle archive selected payments
    const handleArchiveSelected = async () => {
        if (selectedPayments.size === 0) {
            Toast.warning(
                "No Selection",
                "Please select at least one payment log to archive."
            );
            return;
        }

        setIsArchiving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Remove selected payments from the list
            setPaymentLogs(prev =>
                prev.filter(payment => !selectedPayments.has(payment.id))
            );

            // Clear selections
            setSelectedPayments(new Set());

            Toast.success(
                "Archive Successful",
                `${selectedPayments.size} payment log(s) have been archived.`
            );
        } catch (error) {
            console.error("Error archiving payments:", error);
            Toast.error(
                "Archive Failed",
                "There was an error archiving the selected payment logs."
            );
        } finally {
            setIsArchiving(false);
        }
    };

    // Filtered payments based on search
    const filteredPayments = useMemo(() => {
        if (!searchTerm.trim()) return paymentLogs;

        return paymentLogs.filter(payment => {
            const tenantName = `${payment.tenantFirstName} ${payment.tenantLastName}`;
            const paymentId = payment.paymentId;
            const propertyId = payment.propertyFormattedId;

            return (
                tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                propertyId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [paymentLogs, searchTerm]);

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

    // Render checkbox column with standard HTML checkbox
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

    // Columns configuration (Property column removed)
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
            header: "Date",
            sortable: true,
            width: "110px",
            render: renderPaymentDate
        }
    ];

    // Selection summary component - appears below search when items are selected
    const SelectionSummary = () => {
        if (selectedPayments.size === 0) return null;

        const isAllSelected =
            filteredPayments.length > 0 &&
            filteredPayments.every(p => selectedPayments.has(p.id));

        return (
            <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-700">
                        {selectedPayments.size} payment log
                        {selectedPayments.size !== 1 ? "s" : ""} selected
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSelectAll}
                        className="text-xs text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Select All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        Clear All
                    </button>
                    <Button
                        variant="primary"
                        icon={Archive}
                        onClick={handleArchiveSelected}
                        disabled={isArchiving}
                        className="!bg-red-600 !rounded-xs !text-sm !hover:bg-red-500 !text-white !px-2.5 !py-1.5"
                    >
                        {isArchiving ? "Archiving..." : "Archive"}
                    </Button>
                </div>
            </div>
        );
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Payment Logs Overview",
            description:
                "View all recorded payments from tenants in one place. Each payment log includes Payment ID, Tenant Info, Property ID, Amount Paid, and Date."
        },
        {
            title: "Selecting Payment Logs",
            description:
                "Use the checkboxes to select individual payment logs. Select multiple logs to archive them in bulk."
        },
        {
            title: "Bulk Archive",
            description:
                "After selecting payment logs, click the 'Move to Archive' button to remove them from the main list. Archived logs can be restored from the archive section."
        },
        {
            title: "Search & Filter",
            description:
                "Use the search bar to find payment logs by tenant name, Payment ID, or Property ID."
        },
        {
            title: "Select All / Clear All",
            description:
                "When you have selected at least one payment log, a selection bar appears with options to Select All visible logs or Clear All selections."
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
                            Payment Logs
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage all tenant payment transactions.
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
                </div>
            </div>

            {/* Selection Summary (appears below search) */}
            <SelectionSummary />

            {/* Table */}
            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={paymentLogs}
                    keyField="id"
                    onRowClick={row => {
                        console.log("View payment details:", row);
                        Toast.info(
                            "Payment Details",
                            `Payment ${row.paymentId} for ${row.tenantFirstName} ${row.tenantLastName}`
                        );
                    }}
                    showSearch={true}
                    searchPlaceholder="Search by tenant name, Payment ID, or Property ID..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No payment logs found. Record payments from the Tenants page."
                />
            </div>

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Payment Logs Help"
                description="Learn how to manage and archive payment logs."
                features={helpFeatures}
            />
        </div>
    );
};

export default PaymentLogs;
