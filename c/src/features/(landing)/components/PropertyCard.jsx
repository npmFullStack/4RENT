// src/features/(landing)/components/PropertyCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Users, PhilippinePeso } from "lucide-react";
import Button from "@/shared/components/Button";

const PropertyCard = ({
    id,
    image,
    name,
    category,
    address,
    price,
    capacity,
    getCapacityText
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/property/${id}`);
    };

    const isBoarding = category === "boarding";
    const categoryLabel = isBoarding ? "Boarding House" : "Apartment";
    const categoryColor = isBoarding ? "bg-blue-600" : "bg-red-600";

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col">
            {/* Image Container - fixed height, not full card */}
            <div className="relative h-56 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Top Left - Category Badge */}
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
                {/* Property Name */}
                <h3 className="text-lg font-bold mb-1 text-gray-800 truncate">
                    {name}
                </h3>

                {/* Address with icon */}
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{address}</span>
                </div>

                {/* Capacity info for boarding houses */}
                {isBoarding && capacity && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <Users className="w-3 h-3 flex-shrink-0" />
                        <span>{getCapacityText(capacity)}</span>
                    </div>
                )}

                {/* Price and View Details Button - Row layout */}
                <div className="flex justify-between items-center mt-auto pt-3">
                    <div className="text-left flex items-baseline gap-0.5">
                        <PhilippinePeso className="w-4 h-4 text-gray-800" />
                        <span className="text-xl font-bold text-gray-800">
                            {price}
                        </span>
                        <span className="text-xs text-gray-500">/month</span>
                    </div>

                    <Button
                        variant="ghost"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
