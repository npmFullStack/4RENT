// src/features/(landing)/pages/FindPropertyViaMap.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyMap from "@/features/(landing)/components/PropertyMap";
import SetAddressManuallyModal from "@/features/(landing)/components/SetAddressManuallyModal";
import Button from "@/shared/components/Button";
import property1 from "@/assets/images/property1.png";
import property2 from "@/assets/images/property2.png";
import property3 from "@/assets/images/property3.png";
import { Navigation, MapPin, Loader2, X, CheckCircle } from "lucide-react";

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
bedrooms: 2,
        bathrooms: 1,
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

    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [manualAddress, setManualAddress] = useState(null);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

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
        navigate(`/property/${property.id}`, {
            state: { ...property }
        });
    };

    const getUserLocation = () => {
        setIsLocating(true);
        setLocationError(null);
        setManualAddress(null);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setIsLocating(false);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 4000);
            },
            (error) => {
                let errorMessage = "Unable to get your location";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Please allow location access to use this feature";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }
                setLocationError(errorMessage);
                setIsLocating(false);
                setTimeout(() => setLocationError(null), 5000);
            }
        );
    };

    const handleManualAddressConfirm = (addressData) => {
        setManualAddress(addressData);
        setUserLocation(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
    };

    const activeLocationLabel = userLocation
        ? "Using your current location"
        : manualAddress
            ? manualAddress.fullAddress
            : null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="mb-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                Find Properties on Map
                            </h1>
                            <p className="text-gray-600 mt-1.5">
                                Discover boarding houses and apartments near you
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                icon={MapPin}
                                onClick={() => setIsManualModalOpen(true)}
                                className="w-full sm:w-auto text-sm order-1"
                            >
                                Set Address Manually
                            </Button>

                            <Button
                                variant="primary"
                                icon={isLocating ? Loader2 : Navigation}
                                onClick={getUserLocation}
                                disabled={isLocating}
                                className={`w-full sm:w-auto text-sm order-2 ${isLocating ? "[&_svg]:animate-spin" : ""}`}
                            >
                                {isLocating ? "Getting location..." : "Use My Current Location"}
                            </Button>
                        </div>
                    </div>

                    {/* Success toast */}
                    {showSuccessMessage && activeLocationLabel && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl border border-green-100 animate-fade-in">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                                {userLocation
                                    ? "✓ Location found! Map updated."
                                    : `✓ Address set: ${manualAddress?.barangay?.label}, ${manualAddress?.city?.label}, ${manualAddress?.province?.label}`}
                            </span>
                        </div>
                    )}

                    {/* Error message */}
                    {locationError && (
                        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                            <span>⚠️ {locationError}</span>
                            <button onClick={() => setLocationError(null)} className="shrink-0 p-0.5 hover:bg-red-100 rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Persistent location chip */}
                    {!showSuccessMessage && activeLocationLabel && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200 w-fit max-w-full">
                            <MapPin className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            <span className="truncate">{activeLocationLabel}</span>
                            <button
                                onClick={() => { setUserLocation(null); setManualAddress(null); }}
                                className="shrink-0 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Map */}
                <div className="max-w-6xl mx-auto">
                    <div className="h-[calc(100vh-280px)] sm:h-[calc(100vh-220px)] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <PropertyMap
                            properties={allProperties}
                            getCapacityText={getCapacityText}
                            getSexText={getSexText}
                            onPropertyClick={handlePropertyClick}
                            userLocation={userLocation}
                            manualAddress={manualAddress}
                            isModalOpen={isManualModalOpen}
                        />
                    </div>
                </div>
            </div>

            {/* Set Address Manually Modal */}
            <SetAddressManuallyModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onConfirm={handleManualAddressConfirm}
            />
        </div>
    );
};

export default FindPropertyViaMap;