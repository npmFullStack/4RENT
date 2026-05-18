// src/features/(landing)/components/PropertyCard.jsx
import React, { useState } from "react";
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
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
// Fix: Import SVGs as strings/URLs, not as components
import FemaleIconUrl from "@/assets/icons/female.svg";
import MaleIconUrl from "@/assets/icons/male.svg";
import MixedIconUrl from "@/assets/icons/mixed.svg";

import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

// Custom icon components that render img tags
const MaleIcon = ({ className }) => (
    <img src={MaleIconUrl} alt="male" className={className} />
);
const FemaleIcon = ({ className }) => (
    <img src={FemaleIconUrl} alt="female" className={className} />
);
const MixedIcon = ({ className }) => (
    <img src={MixedIconUrl} alt="mixed" className={className} />
);

const PropertyCard = ({
    id,
    images = [], // Array of image URLs for carousel
    image, // Fallback single image for backward compatibility
    name,
    category,
    address,
    price,
    capacity, // total capacity for boarding (legacy)
    bedrooms, // number of bedrooms for apartment
    bathrooms, // number of CR/bathrooms for both boarding and apartment
    sex, // overall sex for boarding (legacy)
    status,
    currentTenants,
    bedroomDetails, // NEW: array of bedroom objects [{ id, name, capacity, gender, currentTenants? }]
    getCapacityText,
    getSexText,
    getStatusBadgeProps,
    onClose,
    isInPopup = false,
    isMobilePopup = false,
    distanceKm = null,
    boardingHouseType = null // 'male', 'female', or 'mixed'
}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Prepare images array for carousel
    const imageList = images.length > 0 ? images : image ? [image] : [];
    const hasMultipleImages = imageList.length > 1;

    const handlePrevImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(prev =>
            prev === 0 ? imageList.length - 1 : prev - 1
        );
    };

    const handleNextImage = e => {
        e.stopPropagation();
        setCurrentImageIndex(prev =>
            prev === imageList.length - 1 ? 0 : prev + 1
        );
    };

    const handleViewDetails = () => {
        navigate(`/property/${id}`, {
            state: {
                id,
                image: imageList[currentImageIndex] || image,
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
    const categoryIcon = isBoarding ? Bed : House;

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

    // Helper to get gender icon component (for Badge component)
    const getGenderIconComponent = gender => {
        if (gender === "male") return MaleIcon;
        if (gender === "female") return FemaleIcon;
        return MixedIcon;
    };

    // Helper to get gender icon element (for direct rendering)
    const getGenderIconElement = gender => {
        if (gender === "male")
            return (
                <img
                    src={MaleIconUrl}
                    alt="male"
                    className={`${iconSize} text-blue-600`}
                />
            );
        if (gender === "female")
            return (
                <img
                    src={FemaleIconUrl}
                    alt="female"
                    className={`${iconSize} text-pink-600`}
                />
            );
        return (
            <img
                src={MixedIconUrl}
                alt="mixed"
                className={`${iconSize} text-gray-600`}
            />
        );
    };

    // Helper to get gender text
    const getGenderText = gender => {
        if (gender === "male") return "Male Only";
        if (gender === "female") return "Female Only";
        return "Mixed";
    };

    // Get boarding house type badge props
    const getBoardingTypeBadge = () => {
        const houseType = boardingHouseType || sex;
        if (houseType === "male") {
            return { label: "Male Only", color: "blue", icon: MaleIcon };
        } else if (houseType === "female") {
            return { label: "Female Only", color: "pink", icon: FemaleIcon };
        } else if (houseType === "mixed") {
            return { label: "Mixed", color: "gray", icon: MixedIcon };
        }
        return null;
    };

    // Helper to get bedroom status text and color
    const getBedroomStatus = bedroom => {
        const current = bedroom.currentTenants || 0;
        const total = bedroom.capacity || 0;

        if (current === 0) {
            return { label: "Vacant", color: "green", icon: CheckCircle };
        } else if (current === total) {
            return { label: "Full", color: "red", icon: XCircle };
        } else {
            return {
                label: `${current}/${total} filled`,
                color: "orange",
                icon: AlertCircle
            };
        }
    };

    // Calculate total capacity and current tenants from bedroomDetails if available
    const getTotalStats = () => {
        if (bedroomDetails && bedroomDetails.length > 0) {
            const totalCapacity = bedroomDetails.reduce(
                (sum, r) => sum + (r.capacity || 0),
                0
            );
            const totalCurrent = bedroomDetails.reduce(
                (sum, r) => sum + (r.currentTenants || 0),
                0
            );
            return { totalCapacity, totalCurrent };
        }
        return {
            totalCapacity: capacity || 0,
            totalCurrent: currentTenants || 0
        };
    };

    const { totalCapacity, totalCurrent } = getTotalStats();
    const boardingTypeBadge = getBoardingTypeBadge();

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

            {/* Image Container with Carousel */}
            <div
                className={`relative w-full overflow-hidden flex-shrink-0 ${isMobilePopup ? "h-40" : "h-56"}`}
            >
                <img
                    src={imageList[currentImageIndex] || image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Image Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-200"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-all duration-200"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                        {/* Image Counter */}
                        <div className="absolute bottom-2 right-2 z-20 bg-black/60 rounded-full px-2 py-0.5 text-xs text-white">
                            {currentImageIndex + 1} / {imageList.length}
                        </div>
                    </>
                )}
                {/* Badges - Now on LEFT side */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                    <Badge
                        variant="solid" // Changed from "solid" to "outline"
                        color={categoryColor}
                        icon={categoryIcon}
                    >
                        {categoryLabel}
                    </Badge>

                    {distanceLabel && (
                        <Badge
                            variant="outline" // Changed from "solid" to "outline"
                            color="gray"
                            icon={Navigation}
                            className="w-auto whitespace-nowrap"
                        >
                            {distanceLabel}
                        </Badge>
                    )}

                    {/* Boarding House Type Badge (only for boarding houses) */}
                    {isBoarding && boardingTypeBadge && (
                        <Badge
                            variant="soft"
                            color={boardingTypeBadge.color}
                            icon={boardingTypeBadge.icon}
                        >
                            {boardingTypeBadge.label}
                        </Badge>
                    )}
                </div>{" "}
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
                                            Total Capacity:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Users
                                                className={`${iconSize} text-gray-600`}
                                            />
                                            <span
                                                className={`${textSize} text-gray-800 font-medium`}
                                            >
                                                {totalCurrent}/{totalCapacity}{" "}
                                                persons
                                            </span>
                                        </div>
                                    </div>

                                    {/* Show each bedroom's status */}
                                    <div className="space-y-2 mt-1">
                                        {bedroomDetails.map((bedroom, idx) => {
                                            const status =
                                                getBedroomStatus(bedroom);
                                            return (
                                                <div
                                                    key={bedroom.id || idx}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {getGenderIconElement(
                                                            bedroom.gender
                                                        )}
                                                        <span
                                                            className={`${textSize} text-gray-600`}
                                                        >
                                                            {bedroom.name ||
                                                                `Room ${idx + 1}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`${textSize} text-gray-500`}
                                                        >
                                                            {bedroom.currentTenants ||
                                                                0}
                                                            /
                                                            {bedroom.capacity ||
                                                                0}
                                                        </span>
                                                        <Badge
                                                            variant="ghost"
                                                            color={status.color}
                                                            icon={status.icon}
                                                            className="text-xs px-1.5 py-0"
                                                        >
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                                    {getCapacityText
                                                        ? getCapacityText(
                                                              capacity
                                                          )
                                                        : `${capacity} persons`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Show CR count forboarding */}
                            {bathrooms !== undefined &&
                                bathrooms !== null &&
                                bathrooms > 0 && (
                                    <div className="flex items-center justify-between pt-1 border-t border-gray-100 mt-1">
                                        <span
                                            className={`${textSize} text-gray-500`}
                                        >
                                            CR/Bathrooms:
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

                            {/* Apartment Status */}
                            <div className="flex items-center justify-between pt-1">
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
                </div>

                {/* Footer Section - Price and View Details at bottom */}
                <div className="border-t border-gray-100 mt-auto pt-3">
                    <div className="flex justify-between items-center">
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
                                    {price?.toLocaleString()}
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
        </div>
    );
};

export default PropertyCard;
