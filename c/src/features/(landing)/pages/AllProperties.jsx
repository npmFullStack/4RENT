// src/features/(landing)/pages/AllProperties.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import Button from "@/shared/components/Button";
import PropertyCard from "@/features/(landing)/components/PropertyCard";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";

const allProperties = [
    {
        id: 1,
        image: property1,
        name: "Sunset Boarding House",
        category: "boarding",
        address: "123 Sunset Blvd, Los Angeles, CA",
        price: 850,
        capacity: 2
    },
    {
        id: 2,
        image: property2,
        name: "Downtown Luxury Apartment",
        category: "apartment",
        address: "456 Main St, New York, NY",
        price: 2500,
        capacity: null
    },
    {
        id: 3,
        image: property3,
        name: "Garden View Boarding House",
        category: "boarding",
        address: "789 Oak Ave, Chicago, IL",
        price: 750,
        capacity: 3
    }
];

const AllProperties = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const getCapacityText = capacity => {
        if (capacity === 1) return "1 person/room";
        if (capacity === 2) return "2 persons/room";
        if (capacity === 3) return "3 persons/room";
        if (capacity >= 4) return `${capacity}+ persons/room`;
        return "";
    };

    const filteredProperties = allProperties.filter(property => {
        const matchesSearch =
            property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            filterCategory === "all" || property.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                    All Properties
                </h1>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={
                                filterCategory === "all" ? "primary" : "outline"
                            }
                            onClick={() => setFilterCategory("all")}
                            className="whitespace-nowrap"
                        >
                            All
                        </Button>
                        <Button
                            variant={
                                filterCategory === "apartment"
                                    ? "primary"
                                    : "outline"
                            }
                            onClick={() => setFilterCategory("apartment")}
                            className="whitespace-nowrap"
                        >
                            Apartments
                        </Button>
                        <Button
                            variant={
                                filterCategory === "boarding"
                                    ? "primary"
                                    : "outline"
                            }
                            onClick={() => setFilterCategory("boarding")}
                            className="whitespace-nowrap"
                        >
                            Boarding Houses
                        </Button>
                    </div>
                </div>

                {/* Properties Grid */}
                {filteredProperties.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredProperties.map(property => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                image={property.image}
                                name={property.name}
                                category={property.category}
                                address={property.address}
                                price={property.price}
                                capacity={property.capacity}
                                getCapacityText={getCapacityText}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No properties found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProperties;
