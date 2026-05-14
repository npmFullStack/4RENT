// src/features/(landing)/pages/FindPropertyViaMap.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyMap from "@/features/(landing)/components/PropertyMap";
import Button from "@/shared/components/Button";

// Import property data (you can import from a shared file or pass as props)
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
        // Navigate to property details page
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

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Bar */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            icon={ArrowLeft}
                            onClick={handleBack}
                            className="!p-2"
                        >
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Find Properties on Map
                            </h1>
                            <p className="text-sm text-gray-600">
                                Discover boarding houses and apartments near you
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full-height Map Container */}
            <div className="h-[calc(100vh-80px)]">
<PropertyMap
    properties={allProperties}
    getCapacityText={getCapacityText}
    getSexText={getSexText}
    onPropertyClick={handlePropertyClick}

/>
            </div>
        </div>
    );
};

export default FindPropertyViaMap;
