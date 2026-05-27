// src/features/(app)/components/ReportCard.jsx
import React, { useState } from "react";
import { ChevronRight, Calendar } from "lucide-react";
import DatePicker from "@/shared/components/DatePicker";
import Button from "@/shared/components/Button";
import { useNavigate } from "react-router-dom";

// Import report images
import report1 from "@/assets/images/reportCard/report1.svg";
import report2 from "@/assets/images/reportCard/report2.svg";
import report3 from "@/assets/images/reportCard/report3.svg";
import report4 from "@/assets/images/reportCard/report4.svg";

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

    // Get image based on report type
    const getReportImage = () => {
        switch (reportType) {
            case "properties":
                return report1;
            case "tenants":
                return report2;
            case "income":
                return report3;
            case "damages":
                return report4;
            default:
                return report1;
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
        queryParams.append("reportType", reportType);

        navigate(`/reports/results?${queryParams.toString()}`);
    };

    // Check if generate button should be disabled
    const isGenerateDisabled = () => {
        // Only income report requires both dates
        if (reportType === "income" && (!startDate || !endDate)) return true;
        return false;
    };

    return (
        <div
            className={`rounded-xl shadow-sm border border-gray-100 ${bgColor} ${className}`}
        >
            {/* Card Header - Title only, no icon */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
                <h3 className="font-semibold text-gray-800 text-lg text-center">
                    {title}
                </h3>
            </div>

            {/* Report Image */}
            <div className="w-full flex items-center justify-center">
                <img
                    src={getReportImage()}
                    alt={title}
                    className="w-20 h-20 object-cover"
                />
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-4">
                {/* Date Range - Show for all report types */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Date Range
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {/* Remove relative wrapper - DatePicker handles its own positioning */}
                        <DatePicker
                            value={startDate}
                            onChange={setStartDate}
                            placeholder="Start Date"
                            className="w-full"
                            formatDate={date =>
                                date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })
                            }
                        />
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            placeholder="End Date"
                            className="w-full"
                            formatDate={date =>
                                date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })
                            }
                            minDate={startDate || undefined}
                        />
                    </div>
                </div>

                {/* Generate Button */}
                <Button
                    variant="primary"
                    onClick={handleGenerateReport}
                    disabled={isGenerateDisabled()}
                    className="w-full mt-2 !text-sm"
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
