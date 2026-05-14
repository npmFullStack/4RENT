// src/features/(landing)/pages/AllProperties.jsx
import React, { useState } from "react";
import { Search, Filter, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/shared/components/Button";
import FilterMenu from "@/shared/components/FilterMenu";
import PropertyCard from "@/features/(landing)/components/PropertyCard";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";
import noMoreProperty from "@/assets/images/no-more-property.png";

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

const AllProperties = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: "all",
        priceRange: { min: "", max: "" },
        sex: "all",
        capacity: "all"
    });

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

    const filteredProperties = allProperties.filter(property => {
        // Search filter
        const matchesSearch =
            searchTerm === "" ||
            property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory =
            filters.category === "all" ||
            property.category === filters.category;

        // Price range filter
        let matchesPrice = true;
        if (
            filters.priceRange.min &&
            property.price < parseInt(filters.priceRange.min)
        ) {
            matchesPrice = false;
        }
        if (
            filters.priceRange.max &&
            property.price > parseInt(filters.priceRange.max)
        ) {
            matchesPrice = false;
        }

        // Sex filter (only for boarding houses)
        let matchesSex = true;
        if (property.category === "boarding" && filters.sex !== "all") {
            matchesSex = property.sex === filters.sex;
        }

        // Capacity filter (only for boarding houses)
        let matchesCapacity = true;
        if (property.category === "boarding" && filters.capacity !== "all") {
            if (filters.capacity === "4+") {
                matchesCapacity = property.capacity >= 4;
            } else {
                matchesCapacity =
                    property.capacity === parseInt(filters.capacity);
            }
        }

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesSex &&
            matchesCapacity
        );
    });

    // Get active filters count
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.category !== "all") count++;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        if (filters.sex !== "all") count++;
        if (filters.capacity !== "all") count++;
        return count;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        All Properties
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Discover thousands of boarding houses and apartments for
                        rent in the Philippines
                    </p>
                </div>

                {/* Search Bar and Map Prompt Row */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Search Bar - Full width on mobile, flex-1 on desktop */}
                    <div className="relative flex-1 w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by property name or location..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <Button
                                variant="ghost"
                                icon={Filter}
                                onClick={() => setIsFilterOpen(true)}
                                className="!p-2 bg-white"
                            >
                                Filter
                                {getActiveFiltersCount() > 0 && (
                                    <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Map Prompt - Beside search bar on desktop, full width on mobile */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 bg-gray-50 px-4 py-3 rounded-lg w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-800 flex-shrink-0" />
                            <span className="text-gray-800 font-medium text-sm">
                                Find nearest property?
                            </span>
                        </div>
                        <Link to="/find-properties-map">
                            <Button
                                variant="ghost"
                                icon={ArrowRight}
                                iconPosition="right"
                                className="text-md text-primary underline px-0"
                            >
                                View Map
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                    <p className="text-gray-600">
                        Found{" "}
                        <span className="font-semibold text-gray-800">
                            {filteredProperties.length}
                        </span>{" "}
                        properties
                    </p>
                    {getActiveFiltersCount() > 0 && (
                        <button
                            onClick={() =>
                                setFilters({
                                    category: "all",
                                    priceRange: { min: "", max: "" },
                                    sex: "all",
                                    capacity: "all"
                                })
                            }
                            className="text-sm text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
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
                                sex={property.sex}
                                getCapacityText={getCapacityText}
                                getSexText={getSexText}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <img
                            src={noMoreProperty}
                            alt="No properties found"
                            className="w-48 h-48 mx-auto mb-4 object-contain"
                            onError={e => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://via.placeholder.com/192x192?text=No+Properties";
                            }}
                        />
                        <p className="text-gray-500 font-semibold text-lg">
                            No properties found
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Try adjusting your filters or search term
                        </p>
                    </div>
                )}
            </div>

            {/* Filter Menu Component */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={newFilters => setFilters(newFilters)}
                initialFilters={filters}
            />
        </div>
    );
};

export default AllProperties;