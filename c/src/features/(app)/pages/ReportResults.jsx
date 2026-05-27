// src/features/(app)/pages/ReportResults.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Download,
    Printer,
    Calendar,
    Filter,
    Building2,
    Users,
    DollarSign,
    AlertTriangle,
    FileText
} from "lucide-react";
import Table from "@/shared/components/Table";
import Button from "@/shared/components/Button";
import Toast from "@/shared/components/Toast";
import BreadCrumbs from "../components/BreadCrumbs";

const ReportResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reportParams, setReportParams] = useState({});
    const [summaryStats, setSummaryStats] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const reportType = params.get("reportType");
        const startDate = params.get("startDate");
        const endDate = params.get("endDate");
        const status = params.get("status");

        setReportParams({
            reportType,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            status
        });

        generateReportData(reportType, startDate, endDate, status);
    }, [location.search]);

    // Mock data generation based on report type
    const generateReportData = async (
        reportType,
        startDate,
        endDate,
        status
    ) => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        let data = [];
        let stats = {};

        switch (reportType) {
            case "properties":
                data = generatePropertiesData(status);
                stats = calculatePropertiesStats(data);
                break;
            case "tenants":
                data = generateTenantsData(status, startDate, endDate);
                stats = calculateTenantsStats(data);
                break;
            case "income":
                data = generateIncomeData(startDate, endDate, status);
                stats = calculateIncomeStats(data);
                break;
            case "damages":
                data = generateDamagesData(status, startDate, endDate);
                stats = calculateDamagesStats(data);
                break;
            default:
                data = [];
        }

        setReportData(data);
        setSummaryStats(stats);
        setIsLoading(false);
    };

    // Generate Properties Report Data
    const generatePropertiesData = status => {
        const allProperties = [
            {
                id: 1,
                name: "Sunset Boarding House",
                type: "boarding",
                address: "123 Sunset Blvd, Manila",
                units: 8,
                occupied: 6,
                vacancy: 2,
                monthlyRevenue: 38800,
                status: "active"
            },
            {
                id: 2,
                name: "Downtown Luxury Apartment",
                type: "apartment",
                address: "456 Main St, Quezon City",
                units: 4,
                occupied: 3,
                vacancy: 1,
                monthlyRevenue: 50000,
                status: "active"
            },
            {
                id: 3,
                name: "Garden View Boarding House",
                type: "boarding",
                address: "789 Oak Ave, Cebu City",
                units: 6,
                occupied: 5,
                vacancy: 1,
                monthlyRevenue: 22500,
                status: "active"
            },
            {
                id: 4,
                name: "Ocean View Apartment",
                type: "apartment",
                address: "321 Beach Road, Davao City",
                units: 3,
                occupied: 2,
                vacancy: 1,
                monthlyRevenue: 37000,
                status: "active"
            },
            {
                id: 5,
                name: "Cozy Studio Boarding",
                type: "boarding",
                address: "555 Peace St, Cebu City",
                units: 5,
                occupied: 4,
                vacancy: 1,
                monthlyRevenue: 21000,
                status: "active"
            },
            {
                id: 6,
                name: "Metro Central Tower",
                type: "apartment",
                address: "789 Business Ave, Makati City",
                units: 6,
                occupied: 6,
                vacancy: 0,
                monthlyRevenue: 135000,
                status: "active"
            },
            {
                id: 7,
                name: "Greenfield Boarding House",
                type: "boarding",
                address: "456 Eco Park, Laguna",
                units: 4,
                occupied: 3,
                vacancy: 1,
                monthlyRevenue: 14000,
                status: "maintenance"
            }
        ];

        if (status && status !== "all") {
            if (status === "boarding") {
                return allProperties.filter(p => p.type === "boarding");
            } else if (status === "apartment") {
                return allProperties.filter(p => p.type === "apartment");
            } else if (status === "occupied") {
                return allProperties.filter(p => p.occupied > 0);
            } else if (status === "vacant") {
                return allProperties.filter(p => p.vacancy > 0);
            }
        }
        return allProperties;
    };

    // Generate Tenants Report Data (Move In/Move Out)
    const generateTenantsData = (status, startDate, endDate) => {
        const allTenants = [
            {
                id: 1,
                name: "Maria Santos",
                property: "Sunset Boarding House",
                moveInDate: "2024-01-15",
                moveOutDate: null,
                rent: 4850,
                status: "active"
            },
            {
                id: 2,
                name: "John Reyes",
                property: "Downtown Luxury Apartment",
                moveInDate: "2024-02-20",
                moveOutDate: null,
                rent: 12500,
                status: "active"
            },
            {
                id: 3,
                name: "Ana Cruz",
                property: "Garden View Boarding House",
                moveInDate: "2024-01-10",
                moveOutDate: null,
                rent: 3750,
                status: "active"
            },
            {
                id: 4,
                name: "David Garcia",
                property: "Ocean View Apartment",
                moveInDate: "2024-03-01",
                moveOutDate: null,
                rent: 18500,
                status: "overdue"
            },
            {
                id: 5,
                name: "Sofia Mendoza",
                property: "Cozy Studio Boarding",
                moveInDate: "2024-03-15",
                moveOutDate: null,
                rent: 4200,
                status: "active"
            },
            {
                id: 6,
                name: "Carlos Fernandez",
                property: "Metro Central Tower",
                moveInDate: "2024-01-20",
                moveOutDate: null,
                rent: 22500,
                status: "active"
            },
            {
                id: 7,
                name: "Isabella Lopez",
                property: "Greenfield Boarding House",
                moveInDate: "2024-02-10",
                moveOutDate: "2025-02-10",
                rent: 3500,
                status: "moved_out"
            },
            {
                id: 8,
                name: "Miguel Torres",
                property: "Skyline Apartments",
                moveInDate: "2024-01-05",
                moveOutDate: null,
                rent: 35000,
                status: "active"
            },
            {
                id: 9,
                name: "Carmen Villanueva",
                property: "Villa Maria Boarding House",
                moveInDate: "2024-03-20",
                moveOutDate: "2025-03-20",
                rent: 4200,
                status: "moved_out"
            }
        ];

        if (status === "move_in") {
            return allTenants.filter(t => {
                const moveIn = new Date(t.moveInDate);
                if (startDate && endDate) {
                    return (
                        moveIn >= new Date(startDate) &&
                        moveIn <= new Date(endDate)
                    );
                }
                return t.status === "active";
            });
        } else if (status === "move_out") {
            return allTenants.filter(
                t => t.moveOutDate && t.status === "moved_out"
            );
        } else if (status === "active") {
            return allTenants.filter(t => t.status === "active");
        } else if (status === "overdue") {
            return allTenants.filter(t => t.status === "overdue");
        }
        return allTenants;
    };

    // Generate Income Report Data
    const generateIncomeData = (startDate, endDate, status) => {
        const payments = [
            {
                id: 1,
                tenant: "Maria Santos",
                property: "Sunset Boarding House",
                amount: 4850,
                type: "rent",
                date: "2024-05-22",
                mode: "GCash"
            },
            {
                id: 2,
                tenant: "John Reyes",
                property: "Downtown Luxury Apartment",
                amount: 12500,
                type: "rent",
                date: "2024-05-21",
                mode: "Bank Transfer"
            },
            {
                id: 3,
                tenant: "Ana Cruz",
                property: "Garden View Boarding House",
                amount: 3750,
                type: "rent",
                date: "2024-05-20",
                mode: "Cash"
            },
            {
                id: 4,
                tenant: "David Garcia",
                property: "Ocean View Apartment",
                amount: 5000,
                type: "partial",
                date: "2024-05-19",
                mode: "GCash"
            },
            {
                id: 5,
                tenant: "Sofia Mendoza",
                property: "Cozy Studio Boarding",
                amount: 4200,
                type: "rent",
                date: "2024-05-18",
                mode: "Cash"
            },
            {
                id: 6,
                tenant: "New Tenant",
                property: "Metro Central Tower",
                amount: 22500,
                type: "deposit",
                date: "2024-05-15",
                mode: "Bank Transfer"
            },
            {
                id: 7,
                tenant: "Building Maintenance",
                property: "Sunset Boarding House",
                amount: 2500,
                type: "maintenance",
                date: "2024-05-10",
                mode: "Cash"
            }
        ];

        let filtered = payments;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = payments.filter(p => {
                const paymentDate = new Date(p.date);
                return paymentDate >= start && paymentDate <= end;
            });
        }

        if (status && status !== "all") {
            filtered = filtered.filter(p => p.type === status);
        }

        return filtered;
    };

    // Generate Damages Report Data
    const generateDamagesData = (status, startDate, endDate) => {
        const damages = [
            {
                id: 1,
                property: "Sunset Boarding House",
                unit: "Room 101",
                description: "Leaking faucet",
                reportedDate: "2024-05-20",
                resolvedDate: null,
                status: "pending",
                cost: 500
            },
            {
                id: 2,
                property: "Downtown Luxury Apartment",
                unit: "Unit 3B",
                description: "Broken window",
                reportedDate: "2024-05-18",
                resolvedDate: null,
                status: "in_progress",
                cost: 3000
            },
            {
                id: 3,
                property: "Garden View Boarding House",
                unit: "Room 205",
                description: "Aircon not cooling",
                reportedDate: "2024-05-15",
                resolvedDate: "2024-05-22",
                status: "resolved",
                cost: 1500
            },
            {
                id: 4,
                property: "Ocean View Apartment",
                unit: "Unit 2A",
                description: "Electrical issue",
                reportedDate: "2024-05-10",
                resolvedDate: null,
                status: "unresolved",
                cost: 2000
            },
            {
                id: 5,
                property: "Metro Central Tower",
                unit: "Unit 15C",
                description: "Clogged toilet",
                reportedDate: "2024-05-05",
                resolvedDate: "2024-05-12",
                status: "resolved",
                cost: 800
            }
        ];

        let filtered = damages;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = damages.filter(d => {
                const reported = new Date(d.reportedDate);
                return reported >= start && reported <= end;
            });
        }

        if (status && status !== "all") {
            filtered = filtered.filter(d => d.status === status);
        }

        return filtered;
    };

    // Calculate statistics
    const calculatePropertiesStats = data => {
        const totalProperties = data.length;
        const totalUnits = data.reduce((sum, p) => sum + p.units, 0);
        const totalOccupied = data.reduce((sum, p) => sum + p.occupied, 0);
        const totalVacant = data.reduce((sum, p) => sum + p.vacancy, 0);
        const totalRevenue = data.reduce((sum, p) => sum + p.monthlyRevenue, 0);
        const occupancyRate =
            totalUnits > 0
                ? ((totalOccupied / totalUnits) * 100).toFixed(1)
                : 0;

        return {
            totalProperties,
            totalUnits,
            totalOccupied,
            totalVacant,
            totalRevenue,
            occupancyRate
        };
    };

    const calculateTenantsStats = data => {
        const totalTenants = data.length;
        const totalMonthlyRent = data.reduce((sum, t) => sum + t.rent, 0);
        const activeTenants = data.filter(t => t.status === "active").length;
        const movedOutTenants = data.filter(
            t => t.status === "moved_out"
        ).length;
        const overdueTenants = data.filter(t => t.status === "overdue").length;

        return {
            totalTenants,
            totalMonthlyRent,
            activeTenants,
            movedOutTenants,
            overdueTenants
        };
    };

    const calculateIncomeStats = data => {
        const totalIncome = data.reduce((sum, p) => sum + p.amount, 0);
        const rentIncome = data
            .filter(p => p.type === "rent")
            .reduce((sum, p) => sum + p.amount, 0);
        const depositIncome = data
            .filter(p => p.type === "deposit")
            .reduce((sum, p) => sum + p.amount, 0);
        const maintenanceIncome = data
            .filter(p => p.type === "maintenance")
            .reduce((sum, p) => sum + p.amount, 0);
        const transactionCount = data.length;

        return {
            totalIncome,
            rentIncome,
            depositIncome,
            maintenanceIncome,
            transactionCount
        };
    };

    const calculateDamagesStats = data => {
        const totalDamages = data.length;
        const pending = data.filter(d => d.status === "pending").length;
        const inProgress = data.filter(d => d.status === "in_progress").length;
        const resolved = data.filter(d => d.status === "resolved").length;
        const unresolved = data.filter(d => d.status === "unresolved").length;
        const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

        return {
            totalDamages,
            pending,
            inProgress,
            resolved,
            unresolved,
            totalCost
        };
    };

    // Get table columns based on report type
    const getTableColumns = () => {
        switch (reportParams.reportType) {
            case "properties":
                return [
                    {
                        key: "name",
                        header: "Property Name",
                        sortable: true,
                        width: "200px"
                    },
                    {
                        key: "type",
                        header: "Type",
                        sortable: true,
                        width: "120px",
                        render: row => (
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    row.type === "boarding"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}
                            >
                                {row.type === "boarding"
                                    ? "Boarding House"
                                    : "Apartment"}
                            </span>
                        )
                    },
                    { key: "address", header: "Address", sortable: true },
                    {
                        key: "units",
                        header: "Total Units",
                        sortable: true,
                        width: "100px"
                    },
                    {
                        key: "occupied",
                        header: "Occupied",
                        sortable: true,
                        width: "100px"
                    },
                    {
                        key: "vacancy",
                        header: "Vacant",
                        sortable: true,
                        width: "100px"
                    },
                    {
                        key: "monthlyRevenue",
                        header: "Monthly Revenue",
                        sortable: true,
                        width: "140px",
                        render: row => (
                            <span className="font-semibold text-green-600">
                                ₱{row.monthlyRevenue.toLocaleString()}
                            </span>
                        )
                    }
                ];
            case "tenants":
                return [
                    {
                        key: "name",
                        header: "Tenant Name",
                        sortable: true,
                        width: "180px"
                    },
                    { key: "property", header: "Property", sortable: true },
                    {
                        key: "moveInDate",
                        header: "Move In Date",
                        sortable: true,
                        render: row => formatDate(row.moveInDate)
                    },
                    {
                        key: "moveOutDate",
                        header: "Move Out Date",
                        sortable: true,
                        render: row =>
                            row.moveOutDate ? formatDate(row.moveOutDate) : "—"
                    },
                    {
                        key: "rent",
                        header: "Monthly Rent",
                        sortable: true,
                        render: row => `₱${row.rent.toLocaleString()}`
                    },
                    {
                        key: "status",
                        header: "Status",
                        sortable: true,
                        render: row => {
                            const statusColors = {
                                active: "bg-green-100 text-green-700",
                                overdue: "bg-red-100 text-red-700",
                                moved_out: "bg-gray-100 text-gray-700"
                            };
                            return (
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${statusColors[row.status]}`}
                                >
                                    {row.status.replace("_", " ").toUpperCase()}
                                </span>
                            );
                        }
                    }
                ];
            case "income":
                return [
                    {
                        key: "date",
                        header: "Date",
                        sortable: true,
                        render: row => formatDate(row.date)
                    },
                    { key: "tenant", header: "Payer", sortable: true },
                    { key: "property", header: "Property", sortable: true },
                    {
                        key: "type",
                        header: "Type",
                        sortable: true,
                        render: row => (
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${
                                    row.type === "rent"
                                        ? "bg-green-100 text-green-700"
                                        : row.type === "deposit"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {row.type.toUpperCase()}
                            </span>
                        )
                    },
                    {
                        key: "amount",
                        header: "Amount",
                        sortable: true,
                        render: row => (
                            <span className="font-semibold text-green-600">
                                ₱{row.amount.toLocaleString()}
                            </span>
                        )
                    },
                    { key: "mode", header: "Payment Mode", sortable: true }
                ];
            case "damages":
                return [
                    { key: "property", header: "Property", sortable: true },
                    { key: "unit", header: "Unit/Room", sortable: true },
                    {
                        key: "description",
                        header: "Description",
                        sortable: true
                    },
                    {
                        key: "reportedDate",
                        header: "Reported Date",
                        sortable: true,
                        render: row => formatDate(row.reportedDate)
                    },
                    {
                        key: "status",
                        header: "Status",
                        sortable: true,
                        render: row => {
                            const statusColors = {
                                pending: "bg-yellow-100 text-yellow-700",
                                in_progress: "bg-blue-100 text-blue-700",
                                resolved: "bg-green-100 text-green-700",
                                unresolved: "bg-red-100 text-red-700"
                            };
                            return (
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${statusColors[row.status]}`}
                                >
                                    {row.status.replace("_", " ").toUpperCase()}
                                </span>
                            );
                        }
                    },
                    {
                        key: "cost",
                        header: "Est. Cost",
                        sortable: true,
                        render: row => `₱${row.cost.toLocaleString()}`
                    }
                ];
            default:
                return [];
        }
    };

    const formatDate = dateString => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatCurrency = amount => {
        return `₱${amount.toLocaleString()}`;
    };

    const handleExport = () => {
        Toast.success("Export Started", "Your report is being exported to CSV");
    };

    const handlePrint = () => {
        window.print();
    };

    const getReportIcon = () => {
        switch (reportParams.reportType) {
            case "properties":
                return <Building2 className="w-5 h-5 text-primary" />;
            case "tenants":
                return <Users className="w-5 h-5 text-blue-500" />;
            case "income":
                return <DollarSign className="w-5 h-5 text-green-500" />;
            case "damages":
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    const getReportTitle = () => {
        switch (reportParams.reportType) {
            case "properties":
                return "Properties Report";
            case "tenants":
                return "Tenants Report";
            case "income":
                return "Income Report";
            case "damages":
                return "Damages Report";
            default:
                return "Report Results";
        }
    };

    const getBreadcrumbItems = () => {
        return [
            { label: "Reports", path: "/reports" },
            { label: getReportTitle(), path: "/reports/results" }
        ];
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs items={getBreadcrumbItems()} />
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {getReportTitle()}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        icon={Download}
                        className="!py-2 !border-gray-700 !text-gray-700 hover:bg-gray-50"
                    >
                        Export
                    </Button>
                    <Button
                        onClick={handlePrint}
                        icon={Printer}
                        className="!py-2 bg-gray-700 hover:bg-gray-800 text-white"
                    >
                        Print
                    </Button>
                </div>
            </div>

            {/* Filters Summary */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {reportParams.startDate && reportParams.endDate
                                ? `${formatDate(reportParams.startDate)} - ${formatDate(reportParams.endDate)}`
                                : "All Time"}
                        </span>
                    </div>
                    {reportParams.status && (
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 capitalize">
                                Filter: {reportParams.status.replace("_", " ")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <Table
                        columns={getTableColumns()}
                        data={reportData}
                        keyField="id"
                        showSearch={true}
                        searchPlaceholder={`Search ${getReportTitle().toLowerCase()}...`}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        itemsPerPage={10}
                        emptyMessage={`No ${getReportTitle().toLowerCase()} found for the selected filters.`}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportResults;
