// src/features/(app)/components/ReportCard.jsx
import React, { useState } from "react";
import { ChevronRight, Calendar, Filter } from "lucide-react";
import DatePicker from "@/shared/components/DatePicker";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import { useNavigate } from "react-router-dom";

const ReportCard = ({
    title,
    icon: Icon,
    iconColor = "text-primary",
    reportType, // "properties", "tenants", "income", "damages"
    bgColor = "bg-white",
    className = ""
}) => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState(null);

    // Status options based on report type
    const getStatusOptions = () => {
        switch (reportType) {
            case "properties":
                return [
                    { value: "all", label: "All Properties" },
                    { value: "boarding", label: "Boarding Houses" },
                    { value: "apartment", label: "Apartments" },
                    { value: "occupied", label: "Occupied" },
                    { value: "vacant", label: "Vacant" }
                ];
            case "tenants":
                return [
                    { value: "all", label: "All Tenants" },
                    { value: "move_in", label: "Move In Tenants" },
                    { value: "move_out", label: "Move Out Tenants" },
                    { value: "active", label: "Active Tenants" },
                    { value: "overdue", label: "Overdue Payments" }
                ];
            case "income":
                return [
                    { value: "all", label: "All Income" },
                    { value: "rent", label: "Rent Collections" },
                    { value: "deposits", label: "Security Deposits" },
                    { value: "maintenance", label: "Maintenance Fees" },
                    { value: "utilities", label: "Utility Payments" }
                ];
            case "damages":
                return [
                    { value: "all", label: "All Damages" },
                    { value: "pending", label: "Pending" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "resolved", label: "Resolved" },
                    { value: "unresolved", label: "Unresolved" }
                ];
            default:
                return [];
        }
    };

    const statusOptions = getStatusOptions();

    // Get placeholder text for date pickers
    const getDatePlaceholder = () => {
        switch (reportType) {
            case "tenants":
                return "Select move in date range";
            case "income":
                return "Select payment date range";
            case "damages":
                return "Select reported date range";
            default:
                return "Select date range";
        }
    };

    // Handle generate report
    const handleGenerateReport = () => {
        const queryParams = new URLSearchParams();
        
        if (startDate) {
            queryParams.append("startDate", startDate.toISOString());
        }
        if (endDate) {
            queryParams.append("endDate", endDate.toISOString());
        }
        if (status && status !== "all") {
            queryParams.append("status", status);
        }
        queryParams.append("reportType", reportType);

        navigate(`/reports/results?${queryParams.toString()}`);
    };

    // Check if generate button should be disabled
    const isGenerateDisabled = () => {
        if (reportType === "tenants" && !status) return true;
        if (reportType === "income" && (!startDate || !endDate)) return true;
        return false;
    };

    return (
        <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden ${bgColor} ${className}`}>
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${iconColor.split('-')[1]}/10`}>
                        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-4">
                {/* Date Range - Show for all report types */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <DatePicker
                            value={startDate}
                            onChange={setStartDate}
                            placeholder="Start Date"
                            className="w-full"
                            formatDate={(date) => date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        />
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            placeholder="End Date"
                            className="w-full"
                            formatDate={(date) => date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                            minDate={startDate || undefined}
                        />
                    </div>
                </div>

                {/* Status Select - Show for all report types */}
                {statusOptions.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" />
                            Filter By
                        </label>
                        <Select
                            options={statusOptions}
                            value={status}
                            onChange={setStatus}
                            placeholder="Select status"
                            isSearchable={false}
                            isClearable={reportType !== "tenants"}
                            variant="outline"
                            size="default"
                            className="w-full"
                        />
                    </div>
                )}

                {/* Generate Button */}
                <Button
                    variant="primary"
                    onClick={handleGenerateReport}
                    disabled={isGenerateDisabled()}
                    className="w-full mt-2"
                    icon={ChevronRight}
                    iconPosition="right"
                >
                    Generate Report
                </Button>
            </div>
        </div>
    );
};

export default ReportCard;