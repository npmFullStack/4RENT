// src/features/(landing)/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, HomeIcon, Users, Search } from "lucide-react";
import FeatureCard from "@/features/(landing)/components/FeatureCard";
import Button from "@/shared/components/Button";
import PropertyCard from "@/features/(landing)/components/PropertyCard";
import heroBg from "@/assets/images/heroBg.png";
import ctaBg from "@/assets/images/ctaBg.png";
import feature1 from "@/assets/images/feature1.png";
import feature2 from "@/assets/images/feature2.png";
import feature3 from "@/assets/images/feature3.png";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

const features = [
    {
        id: 1,
        image: feature1,
        title: "Find Boarding Houses & Apartments",
        description:
            "Search through thousands of boarding houses and apartments that match your budget and location preferences."
    },
    {
        id: 2,
        image: feature2,
        title: "Smart Filter Search",
        description:
            "Easily filter properties by type, price range, preferred tenant gender, and room capacity. Find exactly what you're looking for in seconds."
    },
    {
        id: 3,
        image: feature3,
        title: "Find Properties Near You",
        description:
            "View apartments and boarding houses on an interactive map to find the nearest available properties based on your current location."
    }
];

const popularProperties = [
    {
        id: 1,
        image: property1,
        name: "Sunset Boarding House",
        category: "boarding",
        address: "123 Sunset Blvd, Barangay Sunset, Manila, Philippines",
        price: 4850,
        capacity: 2,
        sex: "female"
    },
    {
        id: 2,
        image: property2,
        name: "Downtown Luxury Apartment",
        category: "apartment",
        address: "456 Main St, Barangay Central, Quezon City, Philippines",
        price: 12500,
        bedrooms: 2,
        bathrooms: 1,
        capacity: null,
        sex: null
    },
    {
        id: 3,
        image: property3,
        name: "Garden View Boarding House",
        category: "boarding",
        address: "789 Oak Ave, Barangay Riverside, Cebu City, Philippines",
        price: 3750,
        capacity: 3,
        sex: "male"
    }
];

const getCapacityText = capacity => {
    if (capacity === 1) return "1 person/room";
    if (capacity === 2) return "2 persons/room";
    if (capacity === 3) return "3 persons/room";
    if (capacity >= 4) return `${capacity}+ persons/room`;
    return "";
};

const getSexText = sex => {
    if (sex === "male") return "Male Only";
    if (sex === "female") return "Female Only";
    return "";
};

const Home = () => {
    const navigate = useNavigate();

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
                    <h1 className="text-4xl md:text-5xl font-logo text-gray-800 mb-6">
                        Find Your Perfect{" "}
                        <span
                            className="text-primary"
                            style={{
                                WebkitTextStroke: "1px black",
                                textShadow: "1px 1px 0 black"
                            }}
                        >
                            Rental Home
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover thousands of boarding houses and apartments for
                        rent. From affordable rooms to premium spaces, find your
                        next dream home today.
                    </p>

                    {/* Two buttons in hero section - wrapped in Link */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/properties" className="w-full sm:w-auto">
                            <Button
                                icon={HomeIcon}
                                className="w-full !text-lg !px-8 !py-3 text-center"
                            >
                                Find Property
                            </Button>
                        </Link>
                        <Link to="/home" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                icon={LayoutGrid}
                                className="w-full text-center !text-lg !px-8 !py-3 !bg-white !hover:bg-gray-200/80 !border-gray-400 !text-gray-800"
                            >
                                List Property
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Random Properties Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    {/* Header with View All button - below on mobile, right on desktop */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-4">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Random Properties
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Check out random properties in the Philippines
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            icon={ArrowRight}
                            iconPosition="right"
                            onClick={() => navigate("/properties")}
                            className="sm:whitespace-nowrap self-end sm:self-auto"
                        >
                            View All
                        </Button>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {popularProperties.map(property => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                image={property.image}
                                name={property.name}
                                category={property.category}
                                address={property.address}
                                price={property.price}
                                capacity={property.capacity}
                                bedrooms={property.bedrooms}
                                bathrooms={property.bathrooms}
                                sex={property.sex}
                                getCapacityText={getCapacityText}
                                getSexText={getSexText}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section (Features) */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-logo text-gray-800 mb-4">
                            Find Your Next Home
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Search, filter and discover boarding houses and
                            apartments near you. All in one place.
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
                    <Link
                        to="/properties"
                        className="inline-block"
                    >
                        <Button
                            variant="outline"
                            icon={Search}
                            iconPosition="right"
                            className=" bg-white hover:bg-gray-50 border-white text-gray-800"
                        >
                            Start Searching Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
