// src/features/(landing)/pages/LandlordHome.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    ArrowRight,
    Upload,
    DollarSign,
    Users,
    BarChart3,
    Shield,
    Clock,
    ChevronRight,
    LogIn
} from "lucide-react";
import FeatureCard from "@/features/(landing)/components/FeatureCard";
import Button from "@/shared/components/Button";
import heroBgLandlord from "@/assets/images/heroBg.png";
import ctaBg from "@/assets/images/ctaBg.png";
import feature1 from "@/assets/images/feature1.png";
import feature2 from "@/assets/images/feature2.png";
import feature3 from "@/assets/images/feature3.png";
import manageEverythingImg from "@/assets/images/manageEverything.png";

const landlordFeatures = [
    {
        id: 1,
        image: feature1,
        title: "List Your Properties",
        description:
            "Easily list your boarding houses and apartments with detailed information, photos, and pricing. Reach thousands of potential tenants actively searching for their next home."
    },
    {
        id: 2,
        image: feature2,
        title: "Manage Tenants & Leases",
        description:
            "Keep track of all your tenants, lease agreements, and payment histories in one centralized dashboard. Send automated reminders for rent collection."
    },
    {
        id: 3,
        image: feature3,
        title: "Rent Calendar",
        description:
            "Visualize all rent payments on an interactive calendar. See who's paid, who's overdue, and upcoming due dates at a glance. Never miss a payment again."
    },
    {
        id: 4,
        image: feature1,
        title: "Track Your Earnings",
        description:
            "Monitor rental income, track expenses, and generate financial reports. Get insights into your property portfolio's performance with detailed analytics."
    },
    {
        id: 5,
        image: feature2,
        title: "Tenant Communication",
        description:
            "Stay connected with your tenants through our built-in messaging system. Handle inquiries, maintenance requests, and renewals seamlessly."
    },
    {
        id: 6,
        image: feature3,
        title: "Maintenance & Repairs",
        description:
            "Manage repair requests from tenants, assign vendors, track status, and keep everyone updated. Ensure your properties stay in top condition."
    }
];

const LandlordHome = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero Section - Full width with overlay and whitish gradient */}
            <section className="relative min-h-screen -mt-20 flex items-center">
                {/* Background Image with white overlay - full coverage plus gradient at top */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroBgLandlord})` }}
                >
                    {/* White overlay - decreased opacity to 50% */}
                    <div className="absolute inset-0 bg-white/50"></div>
                    {/* Gradient white at top - stronger fade effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
                </div>

                {/* Hero Content - Full width without container restriction */}
                <div className="relative w-full z-10">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-logo text-gray-900 mb-6">
                            Turn Your Property Into
                            <span
                                className="text-primary block mt-2"
                                style={{
                                    WebkitTextStroke: "1px black",
                                    textShadow: "1px 1px 0 black"
                                }}
                            >
                                Profitable Asset
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of property owners who maximize their
                            rental income with 4RENT. List your properties, find
                            quality tenants, and manage everything from one
                            place.
                        </p>

                        {/* Two buttons in hero section */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <Button
                                    variant="primary"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                    className="text-lg px-8 py-3 w-full"
                                >
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/signin">
                                <Button
                                    variant="outline"
                                    icon={LogIn}
                                    iconPosition="left"
                                    className="w-full !text-lg !px-8 !py-3 !bg-white !hover:bg-gray-200/80 !border-gray-400 !text-gray-800"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Main Features Section - 6 features using 3 images */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-logo text-gray-800 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful tools designed specifically for property
                            owners and landlords
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {landlordFeatures.map(feature => (
                            <FeatureCard
                                key={feature.id}
                                image={feature.image}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* Manage Everything Section - No dashboard mention */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                Manage Everything in One Place
                            </h2>
                            <p className="text-gray-600 text-lg mb-6">
                                From property listings to tenant management,
                                rent collection to maintenance requests -
                                everything you need is just a click away.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Track rental payments and generate
                                        receipts
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Communicate with tenants through
                                        integrated chat
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Access financial reports and tax
                                        documents
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-gray-700">
                                        Get mobile alerts for new inquiries and
                                        payments
                                    </span>
                                </li>
                            </ul>
                            <Link to="/signup">
                                <Button
                                    variant="primary"
                                    icon={ArrowRight}
                                    iconPosition="right"
                                    className="w-full md:w-auto"
                                >
                                    Create Account Free
                                </Button>
                            </Link>
                        </div>
                        <div className="lg:w-1/2">
                            <img
                                src={manageEverythingImg}
                                alt="Manage Everything"
                                className="hidden md:flex w-full h-auto rounded-xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section
                className="py-16 md:py-20 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ctaBg})` }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B6914] to-[#E6B800]/80"></div>

                <div className="relative container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Maximize Your Rental Income?
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of successful landlords who use 4RENT to
                        manage their properties and grow their real estate
                        business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button
                                variant="primary"
                                icon={ArrowRight}
                                iconPosition="right"
                                className="w-full px-8 py-3 text-lg"
                            >
                                Start Now
                            </Button>
                        </Link>
                        <Link to="/signin">
                            <Button
                                variant="outline"
                                icon={LogIn}
                                iconPosition="left"
                                className="w-full bg-white/10 hover:bg-white/20 border-white text-white px-8 py-3 text-lg"
                            >
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>
                        &copy; {new Date().getFullYear()} 4RENT. All rights
                        reserved.
                    </p>
                    <p className="mt-2 text-gray-400">Developed by NorDev.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandlordHome;
