// src/features/(landing)/components/PropertyCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    ArrowRight,
    Users,
    PhilippinePeso,
    Home,
    Bed,
    X
} from "lucide-react";
import Button from "@/shared/components/Button";

const PropertyCard = ({
    id,
    image,
    name,
    category,
    address,
    price,
    capacity,
    sex,
    getCapacityText,
    getSexText,
    onClose,
    isInPopup = false
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        // Pass property data through state when navigating
        navigate(`/property/${id}`, {
            state: {
                id,
                image,
                name,
                category,
                address,
                price,
                capacity,
                sex
            }
        });
    };

    const isBoarding = category === "boarding";
    const categoryLabel = isBoarding ? "Boarding House" : "Apartment";
    const categoryColor = isBoarding ? "bg-blue-600" : "bg-red-600";

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col relative">
            {/* Close Button - Top Right of Image */}
            {onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
                >
                    <X className="w-4 h-4 text-gray-600" />
                </button>
            )}

            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span
                        className={`${categoryColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}
                    >
                        {categoryLabel}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Property Name - bold sub heading style */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {name}
                </h3>

                {/* Address with icon */}
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-2">{address}</span>
                </div>

                {/* Capacity info for boarding houses */}
                {isBoarding && capacity && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span>{getCapacityText(capacity)}</span>
                    </div>
                )}

                {/* Sex info for boarding houses */}
                {isBoarding && sex && getSexText && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <Bed className="w-3 h-3 flex-shrink-0" />
                        <span>{getSexText(sex)}</span>
                    </div>
                )}

                {/* Price and View Details Button */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                    <div className="text-left">
                        <span className="text-xs text-gray-500">Price</span>
                        <div className="flex items-baseline gap-0.5">
                            <PhilippinePeso className="w-4 h-4 text-gray-800" />
                            <span className="text-xl font-bold text-gray-800">
                                {price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                                /month
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={handleViewDetails}
                        className="text-sm"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;