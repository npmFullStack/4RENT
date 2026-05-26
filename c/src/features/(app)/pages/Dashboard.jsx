// src/features/(app)/pages/Dashboard.jsx
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
import statCard1 from "@/assets/images/stat-card/stat-card1.svg";
import statCard2 from "@/assets/images/stat-card/stat-card2.svg";
import statCard3 from "@/assets/images/stat-card/stat-card3.svg";
import statCard4 from "@/assets/images/stat-card/stat-card4.svg";

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

    // Stat cards data
    const statCards = [
        {
            id: 1,
            title: "Total Properties",
            value: "12",
            message: "+2 this month",
            image: statCard1,
            messageColor: "green"
        },
        {
            id: 2,
            title: "Total Sales",
            value: "₱245,000",
            message: "+15% this month",
            image: statCard2,
            messageColor: "green"
        },
        {
            id: 3,
            title: "Total Tenants",
            value: "24",
            message: "+3 this month",
            image: statCard3,
            messageColor: "green"
        },
        {
            id: 4,
            title: "Damaged Properties",
            value: "3",
            message: "Needs inspection",
            image: statCard4,
            messageColor: "red"
        }
    ];

    // Recent activities data
    const recentActivities = [
        {
            id: 1,
            title: "New tenant application received",
            time: "2 hours ago",
            status: "Pending",
            statusColor: "blue"
        },
        {
            id: 2,
            title: "Maintenance request #1042 completed",
            time: "5 hours ago",
            status: "Completed",
            statusColor: "green"
        },
        {
            id: 3,
            title: "Property inspection scheduled",
            time: "1 day ago",
            status: "Upcoming",
            statusColor: "yellow"
        },
        {
            id: 4,
            title: "Rent payment received from Unit 4B",
            time: "2 days ago",
            status: "Paid",
            statusColor: "green"
        }
    ];

    // Dashboard features for help modal
    const helpFeatures = [
        {
            title: "Total Properties",
            description:
                "View all your properties at a glance. This card shows the total number of properties you own.",
            icon: "Building2"
        },
        {
            title: "Total Sales",
            description:
                "Track your total sales revenue and monitor financial performance.",
            icon: "Activity"
        },
        {
            title: "Total Tenants",
            description:
                "Manage all your tenants from one place with lease agreements and payment history.",
            icon: "Users"
        },
        {
            title: "Damaged Properties",
            description: "Monitor properties requiring maintenance or repairs.",
            icon: "Home"
        },
        {
            title: "Recent Activity",
            description:
                "Stay updated with tenant applications and important notifications.",
            icon: "Bell"
        }
    ];

    // Status color mapping
    const getStatusColor = color => {
        const colors = {
            blue: "bg-blue-100 text-blue-700",
            green: "bg-green-100 text-green-700",
            yellow: "bg-yellow-100 text-yellow-700",
            red: "bg-red-100 text-red-700"
        };
        return colors[color] || colors.blue;
    };

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

            {/* Dashboard Stats Cards - Mapped */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {statCards.map(card => (
                    <StatCard
                        key={card.id}
                        title={card.title}
                        value={card.value}
                        message={card.message}
                        image={card.image}
                        messageColor={card.messageColor}
                    />
                ))}
            </div>

            {/* Recent Activity Section - Mapped */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                        Recent Activity
                    </h2>
                </div>
                <div className="space-y-3">
                    {recentActivities.map(activity => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {activity.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {activity.time}
                                </p>
                            </div>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.statusColor)}`}
                            >
                                {activity.status}
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
