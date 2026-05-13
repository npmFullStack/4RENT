// src/features/(dashboard)/pages/Dashboard.jsx
import React, { useState } from "react";
import {
    HelpCircle,
    Building2,
    Home,
    Users,
    Bell,
    Activity
} from "lucide-react";
import HelpPageModal from "@/shared/components/HelpPageModal";
import StatCard from "@/shared/components/StatCard";
import WelcomeHeroBox from "@/shared/components/WelcomeHeroBox";
import welcomeHeroImage from "@/assets/images/welcome-hero-box.png";

const Dashboard = () => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const handleOpenHelpModal = () => {
        setIsHelpModalOpen(true);
    };

    // Mock user data
    const user = {
        firstName: "Norway",
        lastName: "Mangorangca",
        email: "john.doe@example.com"
    };

    // Dashboard features for help modal
    const helpFeatures = [
        {
            title: "Total Properties",
            description:
                "View all your properties at a glance. This card shows the total number of properties you own.",
            icon: "Building2"
        },
        {
            title: "Active Listings",
            description:
                "Track your currently active property listings and monitor availability.",
            icon: "Home"
        },
        {
            title: "Total Tenants",
            description:
                "Manage all your tenants from one place with lease agreements and payment history.",
            icon: "Users"
        },
        {
            title: "Pending Requests",
            description:
                "Review and respond to pending maintenance requests and applications.",
            icon: "Bell"
        },
        {
            title: "Recent Activity",
            description:
                "Stay updated with tenant applications and important notifications.",
            icon: "Activity"
        }
    ];

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleOpenHelpModal}
                        className="sm:hidden text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors p-2"
                        aria-label="Help"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Welcome back! Here's an overview of your properties
                            and activity.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleOpenHelpModal}
                    className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2 self-start"
                    aria-label="Help"
                >
                    <HelpCircle size={24} />
                    <span className="font-medium">Help</span>
                </button>
            </div>

            {/* Welcome Hero Box */}
            <div className="mb-8">
                <WelcomeHeroBox
                    image={welcomeHeroImage}
                    title={`Welcome back, ${user.firstName}!`}
                    message="Here's what's happening with your properties today. Check your latest stats and activities in one place."
                    imagePosition="right"
                />
            </div>

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard
                    title="Total Properties"
                    value="12"
                    message="+2 this month"
                    icon={Building2}
                    iconColor="text-primary"
                />
                <StatCard
                    title="Active Listings"
                    value="8"
                    message="+1 this week"
                    icon={Home}
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Total Tenants"
                    value="24"
                    message="+3 this month"
                    icon={Users}
                    iconColor="text-green-500"
                />
                <StatCard
                    title="Pending Requests"
                    value="5"
                    message="Needs attention"
                    icon={Bell}
                    messageColor="yellow"
                    iconColor="text-yellow-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Recent Activity
                    </h2>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(item => (
                        <div
                            key={item}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    New tenant application received
                                </p>
                                <p className="text-sm text-gray-500">
                                    2 hours ago
                                </p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Pending
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="Dashboard Features"
                description="Learn about the different features available on your dashboard"
                features={helpFeatures}
            />
        </div>
    );
};

export default Dashboard;
