// src/features/(landing)/pages/FindPropertyViaMap.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyMap from "@/features/(landing)/components/PropertyMap";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

const allProperties = [
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

const FindPropertyViaMap = () => {
    const navigate = useNavigate();

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

    const handlePropertyClick = property => {
        navigate(`/property/${property.id}`, {
            state: {
                id: property.id,
                image: property.image,
                name: property.name,
                category: property.category,
                address: property.address,
                price: property.price,
                capacity: property.capacity,
                sex: property.sex
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header - Same style as AllProperties.jsx */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Find Properties on Map
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Discover boarding houses and apartments near you
                    </p>
                </div>

                {/* Map Container with max-width */}
                <div className="max-w-6xl mx-auto">
                    <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-lg">
                        <PropertyMap
                            properties={allProperties}
                            getCapacityText={getCapacityText}
                            getSexText={getSexText}
                            onPropertyClick={handlePropertyClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindPropertyViaMap;