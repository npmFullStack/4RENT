// src/shared/components/FilterMenu.jsx
import React, { useState } from "react";
import { X, ChevronDown, Users } from "lucide-react";
import Button from "./Button";

const FilterMenu = ({ isOpen, onClose, onApplyFilters, initialFilters }) => {
    const [filters, setFilters] = useState(
        initialFilters || {
            category: "all",
            priceRange: { min: "", max: "" },
            sex: "all",
            capacity: "all"
        }
    );

    const [showSexFilter, setShowSexFilter] = useState(
        filters.category === "boarding"
    );
    const [showCapacityFilter, setShowCapacityFilter] = useState(
        filters.category === "boarding"
    );

    const handleCategoryChange = category => {
        setFilters({ ...filters, category });
        setShowSexFilter(category === "boarding");
        setShowCapacityFilter(category === "boarding");
        // Reset sex and capacity when switching from boarding to apartment
        if (category !== "boarding") {
            setFilters(prev => ({ ...prev, sex: "all", capacity: "all" }));
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
            capacity: "all"
        };
        setFilters(resetFilters);
        setShowSexFilter(false);
        setShowCapacityFilter(false);
        onApplyFilters(resetFilters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Filter Menu */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800">
                            Filter Properties
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="p-6 space-y-6">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Property Type
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleCategoryChange("all")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                    filters.category === "all"
                                        ? "bg-gray-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() =>
                                    handleCategoryChange("apartment")
                                }
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                    filters.category === "apartment"
                                        ? "bg-gray-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Apartment
                            </button>
                            <button
                                onClick={() => handleCategoryChange("boarding")}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                    filters.category === "boarding"
                                        ? "bg-gray-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Boarding House
                            </button>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sex Filter (Boarding House only) */}
                    {showSexFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Preferred Tenant Gender
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setFilters({ ...filters, sex: "all" })
                                    }
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                        filters.sex === "all"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({ ...filters, sex: "male" })
                                    }
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                        filters.sex === "male"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Male Only
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            sex: "female"
                                        })
                                    }
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                                        filters.sex === "female"
                                            ? "bg-pink-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Female Only
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Capacity Filter (Boarding House only) */}
                    {showCapacityFilter && (
                        <div className="animate-fadeIn">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                <Users className="w-4 h-4 inline mr-1" />
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
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        filters.capacity === "all"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        filters.capacity === "1"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    1 person/room
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "2"
                                        })
                                    }
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        filters.capacity === "2"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    2 persons/room
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "3"
                                        })
                                    }
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                        filters.capacity === "3"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    3 persons/room
                                </button>
                                <button
                                    onClick={() =>
                                        setFilters({
                                            ...filters,
                                            capacity: "4+"
                                        })
                                    }
                                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm col-span-2 ${
                                        filters.capacity === "4+"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    4+ persons/room
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                    >
                        Reset All
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleApply}
                        className="flex-1"
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
