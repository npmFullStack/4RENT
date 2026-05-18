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
    House,
    XCircle,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import FemaleIcon from "@/assets/icons/female.svg";
import MaleIcon from "@/assets/icons/male.svg";

import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

const PropertyCard = ({
    id,
    image,
    name,
    category,
    address,
    price,
    capacity, // total capacity for boarding
    bedrooms, // number of bedrooms for apartment
    bathrooms,
    sex, // overall sex for boarding (legacy)
    status,
    currentTenants,
    bedroomDetails, // NEW: array of bedroom objects [{ id, name, capacity, gender }]
    getCapacityText,
    getSexText,
    getStatusBadgeProps,
    onClose,
    isInPopup = false,
    isMobilePopup = false,
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
                bathrooms,
                bedroomDetails // Pass bedroom details to detail page
            }
        });
    };

    const isBoarding = category === "boarding";
    const isApartment = category === "apartment";
    const categoryLabel = isBoarding ? "Boarding" : "Apartment";
    const categoryColor = isBoarding ? "blue" : "red";

    const statusProps = getStatusBadgeProps
        ? getStatusBadgeProps({
              category,
              status,
              currentTenants,
              capacity,
              bedroomDetails
          })
        : { icon: null, label: status || "Unknown", color: "gray" };

    const distanceLabel =
        distanceKm != null
            ? distanceKm < 1
                ? `${Math.round(distanceKm * 1000)}m away`
                : `${distanceKm.toFixed(1)}km away`
            : null;

    // Mobile popup uses smaller padding and font sizes
    const cardPadding = isMobilePopup ? "p-3" : "p-4";
    const titleSize = isMobilePopup ? "text-lg" : "text-xl";
    const priceSize = isMobilePopup ? "text-lg" : "text-xl";
    const iconSize = isMobilePopup ? "w-3 h-3" : "w-4 h-4";
    const textSize = isMobilePopup ? "text-xs" : "text-sm";

    // Helper to get gender icon
    const getGenderIcon = gender => {
        if (gender === "male")
            return <MaleIcon className={`${iconSize} text-blue-600`} />;
        if (gender === "female")
            return <FemaleIcon className={`${iconSize} text-pink-600`} />;
        return <Users className={`${iconSize} text-gray-600`} />;
    };

    // Helper to get gender text
    const getGenderText = gender => {
        if (gender === "male") return "Male Only";
        if (gender === "female") return "Female Only";
        return "Mixed";
    };

    return (
        <div
            className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col relative ${isMobilePopup ? "max-h-[80vh]" : ""}`}
        >
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
            <div
                className={`relative w-full overflow-hidden flex-shrink-0 ${isMobilePopup ? "h-40" : "h-56"}`}
            >
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges - Now on LEFT side */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                    <Badge
                        variant="solid"
                        color={categoryColor}
                        icon={isBoarding ? Bed : House}
                    >
                        {categoryLabel}
                    </Badge>
                    {distanceLabel && (
                        <Badge
                            variant="solid"
                            color="gray"
                            icon={Navigation}
                            className="w-auto whitespace-nowrap"
                        >
                            {distanceLabel}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className={`${cardPadding} flex flex-col flex-grow`}>
                {/* Property Name */}
                <h3
                    className={`${titleSize} font-bold text-gray-800 mb-2 line-clamp-1`}
                >
                    {name}
                </h3>

                {/* Address with separator */}
                <div className="flex items-start gap-1 text-gray-600 mb-3">
                    <MapPin className={`${iconSize} flex-shrink-0 mt-0.5`} />
                    <span className={`${textSize} line-clamp-2 flex-1`}>
                        {address}
                    </span>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Property-specific details */}
                <div className="space-y-2 mb-3">
                    {isBoarding && (
                        <>
                            {/* Show bedroom details if available */}
                            {bedroomDetails && bedroomDetails.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`${textSize} text-gray-500`}
                                        >
                                            Bedrooms:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Bed
                                                className={`${iconSize} text-gray-600`}
                                            />
                                            <span
                                                className={`${textSize} text-gray-800 font-medium`}
                                            >
                                                {bedroomDetails.length}{" "}
                                                {bedroomDetails.length === 1
                                                    ? "Room"
                                                    : "Rooms"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Show first bedroom details (or summary) */}
                                    {bedroomDetails.length === 1 ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`${textSize} text-gray-500`}
                                                >
                                                    Capacity:
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Users
                                                        className={`${iconSize} text-gray-600`}
                                                    />
                                                    <span
                                                        className={`${textSize} text-gray-800 font-medium`}
                                                    >
                                                        {
                                                            bedroomDetails[0]
                                                                .capacity
                                                        }{" "}
                                                        {bedroomDetails[0]
                                                            .capacity === 1
                                                            ? "person"
                                                            : "persons"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`${textSize} text-gray-500`}
                                                >
                                                    Gender:
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {getGenderIcon(
                                                        bedroomDetails[0].gender
                                                    )}
                                                    <span
                                                        className={`${textSize} text-gray-800 font-medium`}
                                                    >
                                                        {getGenderText(
                                                            bedroomDetails[0]
                                                                .gender
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`${textSize} text-gray-500`}
                                                >
                                                    Total Capacity:
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Users
                                                        className={`${iconSize} text-gray-600`}
                                                    />
                                                    <span
                                                        className={`${textSize} text-gray-800 font-medium`}
                                                    >
                                                        {capacity ||
                                                            bedroomDetails.reduce(
                                                                (sum, r) =>
                                                                    sum +
                                                                    (r.capacity ||
                                                                        0),
                                                                0
                                                            )}{" "}
                                                        persons
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`${textSize} text-gray-500`}
                                                >
                                                    Room Types:
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {getGenderIcon(
                                                        bedroomDetails[0].gender
                                                    )}
                                                    <span
                                                        className={`${textSize} text-gray-800 font-medium`}
                                                    >
                                                        {getGenderText(
                                                            bedroomDetails[0]
                                                                .gender
                                                        )}
                                                        {bedroomDetails.length >
                                                            1 &&
                                                            ` +${bedroomDetails.length - 1} more`}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                // Legacy display for old data structure
                                <>
                                    {capacity && (
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`${textSize} text-gray-500`}
                                            >
                                                Capacity:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Users
                                                    className={`${iconSize} text-gray-600`}
                                                />
                                                <span
                                                    className={`${textSize} text-gray-800 font-medium`}
                                                >
                                                    {getCapacityText(capacity)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {sex && getSexText && (
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`${textSize} text-gray-500`}
                                            >
                                                Gender:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Bed
                                                    className={`${iconSize} text-gray-600`}
                                                />
                                                <span
                                                    className={`${textSize} text-gray-800 font-medium`}
                                                >
                                                    {getSexText(sex)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex items-center justify-between">
                                <span className={`${textSize} text-gray-500`}>
                                    Status:
                                </span>
                                <Badge
                                    variant="ghost"
                                    color={statusProps.color}
                                    icon={statusProps.icon}
                                    className="text-xs"
                                >
                                    {statusProps.label}
                                </Badge>
                            </div>
                        </>
                    )}

                    {isApartment && (
                        <>
                            {bedrooms !== undefined && bedrooms !== null && (
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`${textSize} text-gray-500`}
                                    >
                                        Bedrooms:
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Bed
                                            className={`${iconSize} text-gray-600`}
                                        />
                                        <span
                                            className={`${textSize} text-gray-800 font-medium`}
                                        >
                                            {bedrooms}{" "}
                                            {bedrooms === 1
                                                ? "Bedroom"
                                                : "Bedrooms"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {bathrooms !== undefined && bathrooms !== null && (
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`${textSize} text-gray-500`}
                                    >
                                        Bathrooms:
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Bath
                                            className={`${iconSize} text-gray-600`}
                                        />
                                        <span
                                            className={`${textSize} text-gray-800 font-medium`}
                                        >
                                            {bathrooms}{" "}
                                            {bathrooms === 1 ? "CR" : "CRs"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className={`${textSize} text-gray-500`}>
                                    Status:
                                </span>
                                <Badge
                                    variant="soft"
                                    color={statusProps.color}
                                    icon={statusProps.icon}
                                    className="text-xs"
                                >
                                    {statusProps.label}
                                </Badge>
                            </div>
                        </>
                    )}
                </div>

                {/* Separator */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Price and View Details */}
                <div className="flex justify-between items-center mt-1">
                    <div className="text-left">
                        <span className="text-xs text-gray-500">
                            Monthly Rent
                        </span>
                        <div className="flex items-baseline gap-0.5">
                            <PhilippinePeso
                                className={`${iconSize} text-gray-800`}
                            />
                            <span
                                className={`${priceSize} font-bold text-gray-800`}
                            >
                                {price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={handleViewDetails}
                        className={`${textSize}`}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
