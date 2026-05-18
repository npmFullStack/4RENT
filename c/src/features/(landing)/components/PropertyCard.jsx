// src/features/(landing)/components/PropertyCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    ArrowRight,
    Users,
    PhilippinePeso,
    Bed,
    X,
    Navigation,
    Bath,
    House
} from "lucide-react";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

const PropertyCard = ({
    id,
    image,
    name,
    category,
    address,
    price,
    capacity,
    sex,
    bedrooms,
    bathrooms,
    status,
    currentTenants,
    getCapacityText,
    getSexText,
    getStatusBadgeProps,
    onClose,
    isInPopup = false,
    distanceKm = null
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/property/${id}`, {
            state: {
                id,
                image,
                name,
                category,
                address,
                price,
                capacity,
                sex,
                bedrooms,
                bathrooms
            }
        });
    };

    const isBoarding = category === "boarding";
    const isApartment = category === "apartment";
    const categoryLabel = isBoarding ? "Boarding" : "Apartment";
    const categoryColor = isBoarding ? "blue" : "red";

    // Get status badge props if function provided, otherwise use default
    const statusProps = getStatusBadgeProps
        ? getStatusBadgeProps({ category, status, currentTenants, capacity })
        : { icon: null, label: status || "Unknown", color: "gray" };

    // Format distance for display
    const distanceLabel =
        distanceKm != null
            ? distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m away`
                : `${distanceKm.toFixed(1)} km away`
            : null;

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col relative">
            {/* Close Button */}
            {onClose && (
                <button
                    onClick={e => {
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

                {/* Category Badge - Outline variant with white background */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                    <Badge
                        variant="outline"
                        color={categoryColor}
                        icon={isBoarding ? Bed : House}
                    >
                        {categoryLabel}
                    </Badge>
                    {/* Distance badge — only shown when a reference point exists */}
                    {distanceLabel && (
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg w-fit">
                            <Navigation className="w-3 h-3 shrink-0" />
                            {distanceLabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Property Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {name}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2 flex-1">{address}</span>
                </div>

                {/* Property-specific details */}
                {isBoarding && (
                    <>
                        {/* Capacity for boarding houses */}
                        {capacity && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                <span>{getCapacityText(capacity)}</span>
                            </div>
                        )}

                        {/* Sex for boarding houses */}
                        {sex && getSexText && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                                <Bed className="w-3 h-3 flex-shrink-0" />
                                <span>{getSexText(sex)}</span>
                            </div>
                        )}

                        {/* Status Badge - Below sex for boarding houses */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">
                                Status:
                            </span>
                            <Badge
                                variant="soft"
                                color={statusProps.color}
                                icon={statusProps.icon}
                            >
                                {statusProps.label}
                            </Badge>
                        </div>
                    </>
                )}

                {isApartment && (
                    <>
                        {/* Bedrooms for apartments */}
                        {bedrooms !== undefined && bedrooms !== null && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                <Bed className="w-3 h-3 flex-shrink-0" />
                                <span>
                                    {bedrooms}{" "}
                                    {bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                                </span>
                            </div>
                        )}

                        {/* Bathrooms/CR for apartments */}
                        {bathrooms !== undefined && bathrooms !== null && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                                <Bath className="w-3 h-3 flex-shrink-0" />
                                <span>
                                    {bathrooms} {bathrooms === 1 ? "CR" : "CRs"}
                                </span>
                            </div>
                        )}

                        {/* Status Badge - Below CR/bathrooms for apartments */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">
                                Status:
                            </span>
                            <Badge
                                variant="soft"
                                color={statusProps.color}
                                icon={statusProps.icon}
                            >
                                {statusProps.label}
                            </Badge>
                        </div>
                    </>
                )}

                {/* Price and View Details */}
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
