// src/features/(landing)/pages/Home.jsx
import React from "react";
import {
    ArrowRight,
    LayoutGrid,
    HomeIcon,
    Building2,
    MapPin,
    Map
} from "lucide-react";
import FeatureCard from "@/features/(landing)/components/FeatureCard";
import Button from "@/shared/components/Button";
import heroBg from "@/assets/images/heroBg.png";
import ctaBg from "@/assets/images/ctaBg.png";

const features = [
    {
        id: 1,
        image: "/src/assets/images/feature1.png",
        title: "Find Boarding Houses & Apartments",
        description:
            "Search through thousands of boarding houses and apartments that match your budget and location preferences."
    },
    {
        id: 2,
        image: "/src/assets/images/feature2.png",
        title: "List Your Property",
        description:
            "Land owners can easily list their properties and connect with thousands of potential tenants looking for their next home."
    },
    {
        id: 3,
        image: "/src/assets/images/feature3.png",
        title: "Find Properties Near You",
        description:
            "View apartments and boarding houses on an interactive map to find the nearest available properties based on your current location."
    }
];

const Home = () => {
    return (
        <div>
{/* Hero Section */}
<section className="relative min-h-screen -mt-16 flex items-center">
    {/* Background Image with white overlay - full coverage plus gradient at top */}
    <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
    >
        {/* White overlay - decreased opacity to 50% */}
        <div className="absolute inset-0 bg-white/50"></div>
        {/* Gradient white at top - stronger fade effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
    </div>

    {/* Hero Content */}
    <div className="relative container mx-auto px-4 text-center z-10">
        <h1 className="text-3xl md:text-6xl font-logo text-gray-800 mb-6">
            Find Your Perfect{" "}
            <span className="text-primary" style={{ WebkitTextStroke: '1px black', textShadow: '1px 1px 0 black' }}>Rental Home</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of boarding houses and apartments for rent. 
            From affordable rooms to premium spaces, find your next dream home today.
        </p>

        {/* Two buttons in hero section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button icon={HomeIcon} className="mx-auto sm:mx-0">
                List Property
            </Button>
            <Button
                variant="outline"
                icon={LayoutGrid}
                className="mx-auto sm:mx-0"
            >
                View All
            </Button>
        </div>
    </div>
</section>
  
{/* About Section (Features) */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-logo text-gray-800 mb-4">
                            Why Choose 4RENT?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            The complete platform for boarding houses,
                            apartments, and property listings
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map(feature => (
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

            {/* CTA Section */}
            <section
                className="py-16 md:py-20 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${ctaBg})` }}
            >
                {/* Dark primary gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B6914] to-[#E6B800]/80"></div>

                <div className="relative container mx-auto px-4 text-center py-12 rounded-lg">
                    <h2 className="text-3xl md:text-4xl font-logo text-white mb-4">
                        Ready to Find Your New Home?
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of happy tenants and property owners who
                        found their perfect match with 4RENT
                    </p>
                    <Button
                        variant="outline"
                        icon={ArrowRight}
                        className="mx-auto bg-white hover:bg-gray-50 border-white text-gray-800"
                    >
                        Start Searching Now
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
