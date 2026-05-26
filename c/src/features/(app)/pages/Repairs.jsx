// src/features/(app)/pages/Repairs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Plus,
    CheckCircle,
    XCircle,
    Wrench,
    Edit
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";
import Toast from "@/shared/components/Toast";
import Select from "@/shared/components/Select";
import RepairDamageModal from "../components/RepairDamageModal";

// Helper function to generate damage ID
const generateDamageId = id => {
    const paddedNumber = String(id).padStart(4, "0");
    return `DAM-${paddedNumber}`;
};

// Helper function to generate property ID (mirroring Tenants)
const generatePropertyId = (id, category) => {
    const prefix = category === "boarding" ? "BRD" : "APT";
    const paddedNumber = String(id).padStart(4, "0");
    return `${prefix}-${paddedNumber}`;
};

// Mock data for repairs/damages
const mockRepairs = [
    {
        id: 1,
        damageName: "Broken Window Glass",
        propertyId: 1,
        propertyCategory: "boarding",
        status: "pending",
        dateIssued: "2025-03-10",
        dateFixed: null,
        totalCost: null
    },
    {
        id: 2,
        damageName: "Leaking Faucet",
        propertyId: 2,
        propertyCategory: "apartment",
        status: "fixed",
        dateIssued: "2025-03-15",
        dateFixed: "2025-03-20",
        totalCost: 800
    },
    {
        id: 3,
        damageName: "Broken Aircon",
        propertyId: 3,
        propertyCategory: "boarding",
        status: "pending",
        dateIssued: "2025-03-18",
        dateFixed: null,
        totalCost: null
    },
    {
        id: 4,
        damageName: "Damaged Door Lock",
        propertyId: 1,
        propertyCategory: "boarding",
        status: "pending",
        dateIssued: "2025-03-20",
        dateFixed: null,
        totalCost: null
    },
    {
        id: 5,
        damageName: "Clogged Toilet",
        propertyId: 4,
        propertyCategory: "apartment",
        status: "fixed",
        dateIssued: "2025-03-05",
        dateFixed: "2025-03-07",
        totalCost: 600
    },
    {
        id: 6,
        damageName: "Cracked Wall",
        propertyId: 2,
        propertyCategory: "apartment",
        status: "pending",
        dateIssued: "2025-03-12",
        dateFixed: null,
        totalCost: null
    },
    {
        id: 7,
        damageName: "Broken Light Fixture",
        propertyId: 5,
        propertyCategory: "boarding",
        status: "pending",
        dateIssued: "2025-03-22",
        dateFixed: null,
        totalCost: null
    },
    {
        id: 8,
        damageName: "Water Heater Issue",
        propertyId: 3,
        propertyCategory: "boarding",
        status: "fixed",
        dateIssued: "2025-03-08",
        dateFixed: "2025-03-12",
        totalCost: 2800
    }
];

// Add formatted IDs to each repair
const repairsWithIds = mockRepairs.map(repair => ({
    ...repair,
    damageId: generateDamageId(repair.id),
    propertyFormattedId: generatePropertyId(
        repair.propertyId,
        repair.propertyCategory
    )
}));

const Repairs = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [repairs, setRepairs] = useState(repairsWithIds);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionValues, setActionValues] = useState({});

    // Action options for the Select dropdown - only TWO options
    const actionOptions = [
        {
            value: "editRepair",
            label: "Manage Repair",
            icon: <Edit className="w-3 h-3" />,
            className: "text-gray-700"
        },
        {
            value: "remove",
            label: "Remove",
            icon: <XCircle className="w-3 h-3" />,
            className: "text-red-600",
            separator: true
        }
    ];

    // Get status badge props - only pending and fixed
    const getStatusBadgeProps = status => {
        switch (status) {
            case "fixed":
                return { icon: CheckCircle, label: "Fixed", color: "green" };
            case "pending":
                return { icon: XCircle, label: "Pending", color: "orange" };
            default:
                return { icon: XCircle, label: "Unknown", color: "gray" };
        }
    };

    // Format date to readable format
    const formatDate = dateString => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    // Handle action change from dropdown
    const handleActionChange = (repair, actionValue) => {
        if (!actionValue) return;

        switch (actionValue) {
            case "editRepair":
                handleEditRepair(repair);
                break;
            case "remove":
                handleRemoveRepair(repair);
                break;
            default:
                break;
        }
        // Reset the select after action
        setActionValues(prev => ({
            ...prev,
            [repair.id]: null
        }));
    };

    // Handle edit repair (open modal)
    const handleEditRepair = repair => {
        setSelectedRepair(repair);
        setIsRepairModalOpen(true);
    };

    // Handle remove repair
    const handleRemoveRepair = repair => {
        setSelectedRepair(repair);

        Toast.confirm(
            "Remove Damage Report",
            `Are you sure you want to remove "${repair.damageName}"? This action cannot be undone.`,
            async () => {
                setIsProcessing(true);

                try {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    setRepairs(prev => prev.filter(r => r.id !== repair.id));

                    Toast.success(
                        "Repair Removed",
                        `${repair.damageName} has been removed from the list.`
                    );

                    setSelectedRepair(null);
                } catch (error) {
                    console.error("Error removing repair:", error);
                    Toast.error(
                        "Action Failed",
                        "There was an error removing this repair."
                    );
                } finally {
                    setIsProcessing(false);
                }
            },
            {
                confirmText: "Remove",
                variant: "danger"
            }
        );
    };

    // Handle save repair updates (from modal)
    const handleSaveRepair = async updatedData => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            setRepairs(prev =>
                prev.map(repair =>
                    repair.id === selectedRepair.id
                        ? {
                              ...repair,
                              damageName: updatedData.damageName,
                              totalCost: updatedData.totalCost,
                              dateFixed: updatedData.dateFixed,
                              // Auto set status to fixed if dateFixed is provided
                              status: updatedData.dateFixed
                                  ? "fixed"
                                  : "pending"
                          }
                        : repair
                )
            );

            Toast.success(
                "Repair Updated",
                `${updatedData.damageName} has been updated successfully.`
            );

            setIsRepairModalOpen(false);
            setSelectedRepair(null);
        } catch (error) {
            console.error("Error updating repair:", error);
            Toast.error(
                "Action Failed",
                "There was an error updating this repair."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle view details (row click)
    const handleViewDetails = repair => {
        if (repair.totalCost) {
            Toast.info(
                "Repair Details",
                `${repair.damageName} - Total Cost: ₱${repair.totalCost.toLocaleString()}`
            );
        } else {
            Toast.info(
                "Repair Details",
                `${repair.damageName} - Cost not yet set`
            );
        }
    };

    // Handle add new repair
    const handleNewRepair = () => {
        navigate("/new-damage");
    };

    // Table columns configuration
    const columns = [
        {
            key: "damageId",
            header: "Damage ID",
            sortable: true,
            width: "100px",
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.damageId}
                </span>
            )
        },
        {
            key: "damageName",
            header: "Damage Name",
            sortable: true,
            width: "180px",
            render: row => (
                <span className="font-semibold text-gray-800 text-sm">
                    {row.damageName}
                </span>
            )
        },
        {
            key: "propertyFormattedId",
            header: "Property ID",
            sortable: true,
            render: row => (
                <span className="font-mono text-xs font-semibold text-gray-700">
                    {row.propertyFormattedId}
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
            key: "dateIssued",
            header: "Date Issued",
            sortable: true,
            render: row => (
                <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(row.dateIssued)}
                </span>
            )
        },
        {
            key: "dateFixed",
            header: "Date Fixed",
            sortable: true,
            render: row => (
                <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(row.dateFixed)}
                </span>
            )
        },
        {
            key: "totalCost",
            header: "Total Cost",
            sortable: true,
            render: row => (
                <span className="font-semibold text-gray-800 text-sm">
                    {row.totalCost ? `₱${row.totalCost.toLocaleString()}` : "—"}
                </span>
            )
        }
    ];

    // Table search handler
    const handleTableSearch = (searchTerm, data) => {
        if (!searchTerm.trim()) return data;

        return data.filter(
            repair =>
                repair.damageName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                repair.damageId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                repair.propertyFormattedId
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
    };

    // Render actions with Select dropdown
    const renderActions = row => {
        return (
            <div className="w-32 relative">
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
                    placeholder="Actions"
                    variant="outline"
                    isSearchable={false}
                    isClearable={true}
                    className="text-xs w-full"
                />
            </div>
        );
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Repairs Overview",
            description:
                "Track all damage reports and repair requests across your properties. Monitor status from Pending to Fixed."
        },
        {
            title: "Damage Status",
            description:
                "Status options: Pending (awaiting action) or Fixed (repair completed)."
        },
        {
            title: "Edit Repair",
            description:
                "Click the Actions dropdown and select 'Edit Repair' to update the damage name, total cost, and date fixed. Total cost can be set even while pending."
        },
        {
            title: "New Damage Report",
            description:
                "Click the 'New Damage' button to report a new issue, including damage name, property, and description."
        },
        {
            title: "Search & Filter",
            description:
                "Use the search bar to find damage reports by Damage ID, Damage Name, or Property ID."
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
                            Repairs & Maintenance
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Track damage reports, manage repairs, and monitor
                            maintenance costs.
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
                    {/* New Damage Button */}
                    <Button
                        variant="primary"
                        onClick={handleNewRepair}
                        icon={Plus}
                        className="!py-2"
                    >
                        New Damage
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={repairs}
                    keyField="id"
                    onRowClick={handleViewDetails}
                    showSearch={true}
                    searchPlaceholder="Search by Damage ID, Damage Name, or Property ID..."
                    onSearch={handleTableSearch}
                    itemsPerPageOptions={[5, 10, 20, -1]}
                    itemsPerPage={5}
                    emptyMessage="No damage reports found. Click 'New Damage' to report an issue."
                    actions={renderActions}
                />
            </div>

            {/* Edit Repair Modal */}
            {selectedRepair && (
                <RepairDamageModal
                    isOpen={isRepairModalOpen}
                    onClose={() => {
                        setIsRepairModalOpen(false);
                        setSelectedRepair(null);
                    }}
                    onConfirm={handleSaveRepair}
                    repair={selectedRepair}
                    isLoading={isProcessing}
                />
            )}

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Repairs Help"
                description="Learn how to manage damage reports and repair requests."
                features={helpFeatures}
            />
        </div>
    );
};

export default Repairs;
