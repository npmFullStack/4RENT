// src/features/(app)/pages/Reports.jsx
import React, { useState } from "react";
import { 
    HelpCircle, 
    Building2, 
    Users, 
    DollarSign, 
    AlertTriangle,
    FileText,
    TrendingUp,
    Home,
    UserCheck,
    Wrench
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import WelcomeHeroBox from "@/shared/components/WelcomeHeroBox";
import ReportCard from "../components/ReportCard";
import welcomeHeroImage from "@/assets/images/welcome-hero-box.png";

const Reports = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    // Report cards configuration
    const reportCards = [
        {
            id: "properties",
            title: "Properties Report",
            icon: Building2,
            iconColor: "text-primary",
            reportType: "properties",
            bgColor: "bg-white",
            description: "Generate reports on property occupancy, types, and status"
        },
        {
            id: "tenants",
            title: "Tenants Report",
            icon: Users,
            iconColor: "text-blue-500",
            reportType: "tenants",
            bgColor: "bg-white",
            description: "Track move-ins, move-outs, and tenant activity"
        },
        {
            id: "income",
            title: "Income Report",
            icon: DollarSign,
            iconColor: "text-green-500",
            reportType: "income",
            bgColor: "bg-white",
            description: "View rent collections, deposits, and other income"
        },
        {
            id: "damages",
            title: "Damages Report",
            icon: AlertTriangle,
            iconColor: "text-red-500",
            reportType: "damages",
            bgColor: "bg-white",
            description: "Track property damages and maintenance issues"
        }
    ];

    // Help modal features
    const helpFeatures = [
        {
            title: "Properties Report",
            description: "Generate reports on your properties including occupancy rates, property types (Boarding Houses/Apartments), and availability status. Filter by date range and property status."
        },
        {
            title: "Tenants Report",
            description: "Track tenant movements including move-ins and move-outs. Filter by date range to see tenant activity over specific periods."
        },
        {
            title: "Income Report",
            description: "View detailed income reports including rent collections, security deposits, maintenance fees, and utility payments. Requires both start and end dates to generate."
        },
        {
            title: "Damages Report",
            description: "Monitor property damages and maintenance issues. Track resolution status including pending, in progress, resolved, and unresolved damages."
        },
        {
            title: "Date Range Filter",
            description: "Use the date pickers to specify the period for your report. For income reports, both start and end dates are required."
        },
        {
            title: "Report Generation",
            description: "Click 'Generate Report' on any card to view detailed results in a table format. Results will show relevant data based on your selected filters."
        }
    ];

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Header Section */}
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
                            Reports
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Generate and export detailed reports about your properties, tenants, income, and damages.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2 self-start"
                    aria-label="Help"
                >
                    <HelpCircle size={20} />
                    <span className="font-medium">Help</span>
                </button>
            </div>

            {/* Welcome Hero Box */}
            <div className="mb-8">
                <WelcomeHeroBox
                    image={welcomeHeroImage}
                    title="Reports Dashboard"
                    message="Generate comprehensive reports to track your property portfolio performance, tenant activity, income streams, and maintenance issues all in one place."
                    imagePosition="right"
                />
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 text-center">
                    <FileText className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Available Reports</p>
                    <p className="text-xl font-bold text-gray-800">4</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">This Month</p>
                    <p className="text-xl font-bold text-gray-800">Active</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4 text-center">
                    <Home className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Properties</p>
                    <p className="text-xl font-bold text-gray-800">12</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-4 text-center">
                    <UserCheck className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Active Tenants</p>
                    <p className="text-xl font-bold text-gray-800">24</p>
                </div>
            </div>

            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {reportCards.map((card) => (
                    <ReportCard
                        key={card.id}
                        title={card.title}
                        icon={card.icon}
                        iconColor={card.iconColor}
                        reportType={card.reportType}
                        bgColor={card.bgColor}
                    />
                ))}
            </div>

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Reports Help Center"
                description="Learn how to generate and use different types of reports to manage your property business effectively."
                features={helpFeatures}
            />
        </div>
    );
};

export default Reports;