// src/shared/components/FilterMenu.jsx
import React, { useState } from "react";
import { X, Users, SlidersHorizontal, RotateCcw, Bed, Bath } from "lucide-react";
import Button from "./Button";

const FilterMenu = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
    const [filters, setFilters] = useState(
        initialFilters || {
            category: "all",
            priceRange: { min: "", max: "" },
            sex: "all",
            capacity: "all",
            bedrooms: "all",
            bathrooms: "all"
        }
    );

    const [showSexFilter, setShowSexFilter] = useState(
        filters.category === "boarding"
    );
    const [showCapacityFilter, setShowCapacityFilter] = useState(
        filters.category === "boarding"
    );
    const [showBedroomsFilter, setShowBedroomsFilter] = useState(
        filters.category === "apartment"
    );
    const [showBathroomsFilter, setShowBathroomsFilter] = useState(
        filters.category === "apartment"
    );

    const handleCategoryChange = category => {
        setFilters({ ...filters, category });
        
        // Boarding house filters
        setShowSexFilter(category === "boarding");
        setShowCapacityFilter(category === "boarding");
        
        // Apartment filters
        setShowBedroomsFilter(category === "apartment");
        setShowBathroomsFilter(category === "apartment");
        
        // Reset boarding-specific filters when switching from boarding to something else
        if (category !== "boarding") {
            setFilters(prev => ({ ...prev, sex: "all", capacity: "all" }));
        }
        
        // Reset apartment-specific filters when switching from apartment to something else
        if (category !== "apartment") {
            setFilters(prev => ({ ...prev, bedrooms: "all", bathrooms: "all" }));
        }
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            category: "all",
            priceRange: { min: "", max: "" },
            sex: "all",
            capacity: "all",
            bedrooms: "all",
            bathrooms: "all"
        };
        setFilters(resetFilters);
        setShowSexFilter(false);
        setShowCapacityFilter(false);
        setShowBedroomsFilter(false);
        setShowBathroomsFilter(false);
        onApplyFilters(resetFilters);
        onClose();
    };

    if (!isOpen) return null;

    // Helper function to check if a filter option is active
    const isCategoryActive = value => filters.category === value;
    const isSexActive = value => filters.sex === value;
    const isCapacityActive = value => filters.capacity === value;
    const isBedroomsActive = value => filters.bedrooms === value;
    const isBathroomsActive = value => filters.bathrooms === value;

    return (
        <>
            {/* Backdrop - Dark overlay with backdrop blur */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Filter Menu */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-gray-800" />
                        <h2 className="text-lg font-semibold text-gray-800">
                            Filter Properties
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-5 space-y-5">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Property Type
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCategoryChange("all")}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isCategoryActive("all")
                                        ? "shadow-sm bg-gray-600 text-white font-semibold"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() =>
                                    handleCategoryChange("apartment")
                                }
                                className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isCategoryActive("apartment")
                                        ? "shadow-sm bg-gray-600 text-white font-semibold"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                }`}
                            >
                                Apartment
                            </button>
                            <button
                                onClick={() => handleCategoryChange("boarding")}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-sm truncate font-medium transition-all ${
                                    isCategoryActive("boarding")
                                        ? "shadow-sm bg-gray-600 text-white font-semibold"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                }`}
                            >
                                Boarding House
                            </button>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Price Range (₱/month)
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.priceRange.min}
                                    onChange={e =>
                                        setFilters({
                                            ...filters,
                                            priceRange: {
                                                ...filters.priceRange,
                                                min: e.target.value
                                            }
                                        })
                                    }
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.priceRange.max}
                                    onChange={e =>
                                        setFilters({
                                            ...filters,
                                            priceRange: {
                                                ...filters.priceRange,
                                                max: e.target.value
                                            }
                                        })
                                    }
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sex Filter (Boarding House only) */}
                    {showSexFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Preferred Tenant Gender
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setFilters({ ...filters, sex: "all" })
                                    }
                                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        isSexActive("all")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({ ...filters, sex: "male" })
                                    }
                                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        isSexActive("male")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            sex: "female"
                                        })
                                    }
                                    className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        isSexActive("female")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Capacity Filter (Boarding House only) */}
                    {showCapacityFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                <Users className="w-3 h-3 inline mr-1" />
                                Room Capacity
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "all"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isCapacityActive("all")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "1"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isCapacityActive("1")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    1 person
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "2"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isCapacityActive("2")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    2 persons
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "3"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isCapacityActive("3")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    3 persons
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "4+"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs col-span-2 ${
                                        isCapacityActive("4+")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    4+ persons
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bedrooms Filter (Apartment only) */}
                    {showBedroomsFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                <Bed className="w-3 h-3 inline mr-1" />
                                Number of Bedrooms
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bedrooms: "all"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isBedroomsActive("all")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bedrooms: "1"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isBedroomsActive("1")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    1 Bedroom
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bedrooms: "2"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isBedroomsActive("2")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    2 Bedrooms
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bedrooms: "3+"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs col-span-2 ${
                                        isBedroomsActive("3+")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    3+ Bedrooms
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bathrooms/CR Filter (Apartment only) */}
                    {showBathroomsFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                <Bath className="w-3 h-3 inline mr-1" />
                                Number of CRs
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bathrooms: "all"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isBathroomsActive("all")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bathrooms: "1"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs ${
                                        isBathroomsActive("1")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    1 CR
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            bathrooms: "2+"
                                        })
                                    }
                                    className={`px-2 py-1.5 rounded-lg font-medium transition-all text-xs col-span-2 ${
                                        isBathroomsActive("2+")
                                            ? "shadow-sm bg-gray-600 text-white font-semibold"
                                            : "bg-gray-100 text-gray-400 hover:bg-gray-300"
                                    }`}
                                >
                                    2+ CRs
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons with Icons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
                    <Button
                        variant="outline"
                        icon={RotateCcw}
                        onClick={handleReset}
                        className="flex-1 text-sm"
                    >
                        Reset All
                    </Button>
                    <Button
                        variant="primary"
                        icon={SlidersHorizontal}
                        onClick={handleApply}
                        className="flex-1 text-sm"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default FilterMenu;